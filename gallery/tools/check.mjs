// check.mjs — headless check of gallery entries in real Chromium.
//
//   node tools/check.mjs vl-bar plot-stacked-dots     check these entries
//   node tools/check.mjs --file entries/vl-bars.js    every entry in a file
//   node tools/check.mjs --all                        every entry registered
//   node tools/check.mjs --beyond                     the "beyond" page
//   options:
//     --shot <dir>   save PNGs: <id>.compare.png and <id>.iface-<i>.png
//     --no-smoke     skip the drag/click smoke test on interfaces
//     --json         print machine-readable results only
//
// For each entry it reports: the original's render state, the recreation's and
// every interface's (errors, [elicit] warnings, how many SVG nodes it drew), and —
// unless --no-smoke — whether a real drag or click on the interface changed
// getData(). The smoke test is a HINT: it drags the first pointer-active mark it
// finds, which may not be the gesture the interface is about.
//
// Exits non-zero if any recreation/interface errors, warns, or draws nothing.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(path.resolve(root, '../../elicitjs/package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const shotDir = opt('--shot');
const smoke = !flag('--no-smoke');
const asJson = flag('--json');

function idsInFile(file) {
    const ids = [];
    const ctx = { GALLERY: { add: (e) => ids.push(e.id), beyond: () => {}, defineFeatures: () => {} }, window: {} };
    ctx.window.GALLERY = ctx.GALLERY;
    vm.runInNewContext(fs.readFileSync(path.resolve(root, file), 'utf8'), ctx);
    return ids;
}
function allIds() {
    const manifestCtx = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'entries/manifest.js'), 'utf8'), manifestCtx);
    return manifestCtx.window.ENTRY_FILES.flatMap((f) => idsInFile(path.join('entries', f)));
}

let ids = [];
if (flag('--all')) ids = allIds();
const fileArg = opt('--file');
if (fileArg) ids.push(...idsInFile(fileArg));
ids.push(...args.filter((a, i) => !a.startsWith('--') && !['--shot', '--file'].includes(args[i - 1])));
if (flag('--beyond')) ids.push('beyond');
if (!ids.length) { console.error('nothing to check'); process.exit(2); }
if (shotDir) fs.mkdirSync(shotDir, { recursive: true });

const url = pathToFileURL(path.join(root, 'index.html')).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
let pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) pageErrors.push(m.text().slice(0, 300)); });

await page.goto(url + '#/');
await page.waitForFunction(() => window.GALLERY_STATE && window.GALLERY_STATE.done, null, { timeout: 60000 });

const results = [];
let bad = 0;
for (const id of ids) {
    pageErrors = [];
    await page.evaluate((h) => { location.hash = h; }, `#/${id}`);
    try {
        await page.waitForFunction((h) => window.GALLERY_STATE && window.GALLERY_STATE.route === h && window.GALLERY_STATE.done,
            `#/${id}`, { timeout: 45000 });
    } catch { /* report whatever finished */ }
    await page.waitForTimeout(300);
    const blocks = await page.evaluate(() => window.GALLERY_STATE.blocks.map((b, i) => {
        const host = b.chart ? b.chart.closest('.chart-host') : null;
        return {
            i, id: b.id, kind: b.kind, state: b.state, title: b.title,
            error: b.error ? String(b.error).split('\n')[0] : undefined,
            warnings: b.warnings || [],
            nodes: host ? host.querySelectorAll('svg *, canvas').length : 0,
        };
    }));
    const res = { id, blocks, pageErrors: [] };

    // Interfaces: show each pane, screenshot, smoke-test a drag and a click.
    let paneIndex = -1;
    for (const b of blocks) {
        if (b.kind !== 'interface') continue;
        paneIndex++;
        const pi = id === 'beyond' ? null : paneIndex;
        if (pi != null) {
            await page.evaluate((k) => { const t = document.querySelector(`.tabs .tab[data-iface="${k}"]`); if (t) t.click(); }, pi);
            await page.waitForTimeout(100);
        }
        if (shotDir) {
            const sel = id === 'beyond' ? `#beyond-${b.i - 0}` : '.pane:not([hidden])';
            const el = id === 'beyond' ? (await page.$$('.beyond'))[paneIndex] : await page.$(sel);
            if (el) await el.screenshot({ path: path.join(shotDir, `${id}.iface-${paneIndex}.png`) }).catch(() => {});
        }
        if (!smoke || b.state !== 'ok') continue;
        const probe = await page.evaluate((bi) => {
            const blk = window.GALLERY_STATE.blocks[bi];
            const chart = blk.chart; if (!chart || !chart.getData) return null;
            // Pointer events only land on what is inside the viewport.
            chart.scrollIntoView({ block: 'center' });
            const svg = chart.querySelector('svg') || chart.querySelector('canvas');
            if (!svg) return null;
            const before = JSON.stringify(chart.getData());
            const r = svg.getBoundingClientRect();
            const cands = [...chart.querySelectorAll('svg circle, svg rect, svg path, svg ellipse, svg line, svg polygon')]
                .filter((el) => getComputedStyle(el).pointerEvents !== 'none')
                .map((el) => el.getBoundingClientRect())
                .filter((bb) => bb.width * bb.height > 4 && bb.width < r.width * 0.9 && bb.height < r.height * 0.9);
            const t = cands[Math.floor(cands.length / 2)] || null;
            return {
                before,
                target: t ? { x: t.x + t.width / 2, y: t.y + t.height / 2 } : null,
                center: { x: r.x + r.width / 2, y: r.y + r.height / 2 },
                candidates: cands.length,
            };
        }, b.i);
        if (!probe) continue;
        const after = () => page.evaluate((bi) => JSON.stringify(window.GALLERY_STATE.blocks[bi].chart.getData()), b.i);
        let dragChanged = null, clickChanged = null;
        if (probe.target) {
            await page.mouse.move(probe.target.x, probe.target.y);
            await page.mouse.down();
            await page.mouse.move(probe.target.x + 12, probe.target.y - 18, { steps: 6 });
            await page.mouse.move(probe.target.x + 24, probe.target.y - 30, { steps: 6 });
            await page.mouse.up();
            await page.waitForTimeout(80);
            dragChanged = (await after()) !== probe.before;
        }
        const mid = await after();
        await page.mouse.click(probe.center.x + 7, probe.center.y + 5);
        await page.waitForTimeout(80);
        clickChanged = (await after()) !== mid;
        Object.assign(b, { candidates: probe.candidates, dragChanged, clickChanged });
    }
    if (shotDir && id !== 'beyond') {
        // The comparison shot shows the recreation tab beside the original.
        await page.evaluate(() => { const t = document.querySelector('.tabs .tab[data-view="rec"]'); if (t) t.click(); });
        await page.waitForTimeout(100);
        const cmp = await page.$('.compare');
        if (cmp) await cmp.screenshot({ path: path.join(shotDir, `${id}.compare.png`) }).catch(() => {});
    }
    res.pageErrors = pageErrors;
    // An entry file that failed to load registers nothing, and the page still
    // renders its original — so "not registered" and load-time errors are failures.
    if (id !== 'beyond') {
        const registered = await page.evaluate((x) => !!window.GALLERY.entries[x], id);
        if (!registered) blocks.push({ kind: 'entry', state: 'error', error: 'entry not registered (missing, or its file failed to load)', warnings: [], nodes: 1 });
    }
    for (const e of pageErrors.filter((x) => /SyntaxError|ReferenceError|TypeError/.test(x))) {
        blocks.push({ kind: 'page', state: 'error', error: e, warnings: [], nodes: 1 });
    }
    for (const b of blocks) {
        b.problem = b.kind !== 'original' && (b.state !== 'ok' || b.warnings.length || b.nodes === 0);
        if (b.problem) bad++;
    }
    results.push(res);
}
await browser.close();

if (asJson) { console.log(JSON.stringify(results, null, 1)); }
else {
    for (const r of results) {
        console.log(`\n■ ${r.id}`);
        for (const b of r.blocks) {
            const tag = b.kind === 'interface' ? `iface ${b.title ? '“' + b.title + '”' : ''}` : b.kind;
            const mark = b.kind === 'original' ? (b.state === 'ok' ? '·' : '!') : (b.problem ? '✗' : '✓');
            let line = `  ${mark} ${tag}: ${b.state}${b.kind !== 'original' ? `, ${b.nodes} svg nodes` : ''}`;
            if (b.dragChanged != null || b.clickChanged != null) line += `, drag→${b.dragChanged ? 'CHANGED' : 'no change'}, click→${b.clickChanged ? 'CHANGED' : 'no change'}`;
            console.log(line);
            if (b.error) console.log(`      error: ${b.error}`);
            for (const w of b.warnings) console.log(`      warn: ${w.slice(0, 400)}`);
        }
        for (const e of r.pageErrors) console.log(`  ! page: ${e}`);
    }
    console.log(`\n${results.length} entries, ${bad} problem block(s)`);
}
process.exit(bad ? 1 : 0);
