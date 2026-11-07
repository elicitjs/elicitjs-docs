// build-analysis.mjs — write ANALYSIS.md from the entries, so the shareable
// write-up and the site can never disagree about a count.
//
//   node tools/build-analysis.mjs
//
// The narrative comes from tools/analysis-narrative.md (hand-written); every
// number, table and list after it is generated.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const ctx = { window: {}, console };
const entries = {}; const beyond = []; const features = {};
ctx.GALLERY = ctx.window.GALLERY = {
    add: (e) => { entries[e.id] = e; },
    beyond: (b) => beyond.push(b),
    defineFeatures: (m) => Object.assign(features, m),
};
vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
run('originals/catalog.js');
run('entries/manifest.js');
for (const f of ctx.window.ENTRY_FILES) {
    try { run(path.join('entries', f)); } catch (err) { console.warn(`skipped entries/${f}: ${err.message.split('\n')[0]}`); }
}
const { vl, plot } = ctx.window.CATALOG;

const LIB = { vl: 'Vega-Lite', plot: 'Observable Plot' };
const all = [...vl, ...plot].map((c) => ({ ...c, ...(entries[c.id] || {}), status: entries[c.id] ? entries[c.id].status : 'todo' }));
const label = (k) => (features[k] ? features[k].label : k);
const oneLine = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '—');

function counts(list) {
    const c = { full: 0, partial: 0, none: 0, todo: 0, ifaces: 0 };
    for (const e of list) { c[e.status]++; c.ifaces += (e.interfaces || []).length; }
    return c;
}

let md = '';
const narrative = path.join(here, 'analysis-narrative.md');
if (fs.existsSync(narrative)) md += fs.readFileSync(narrative, 'utf8').trim() + '\n\n';
else md += '# ElicitJS gallery study: outcome analysis\n\n';

// ------------------------------------------------------------ summary
md += '## The numbers\n\n';
md += '| Gallery | Examples | Recreated | Partly | Not supported | Interfaces |\n|---|---:|---:|---:|---:|---:|\n';
for (const lib of ['vl', 'plot']) {
    const list = all.filter((e) => e.lib === lib); const c = counts(list);
    md += `| ${LIB[lib]} | ${list.length} | ${c.full} (${pct(c.full, list.length)}) | ${c.partial} (${pct(c.partial, list.length)}) | ${c.none} (${pct(c.none, list.length)}) | ${c.ifaces} |\n`;
}
{
    const c = counts(all);
    md += `| **Both** | **${all.length}** | **${c.full} (${pct(c.full, all.length)})** | **${c.partial} (${pct(c.partial, all.length)})** | **${c.none} (${pct(c.none, all.length)})** | **${c.ifaces}** |\n`;
    if (c.todo) md += `\n_${c.todo} examples not yet analysed._\n`;
}
md += `\nPlus ${beyond.length} interfaces on the “Beyond” page that neither library can express.\n\n`;

// ------------------------------------------------------------ by section
md += '## By section\n\n| Gallery | Section | Examples | Recreated | Partly | Not supported |\n|---|---|---:|---:|---:|---:|\n';
for (const lib of ['vl', 'plot']) {
    const list = all.filter((e) => e.lib === lib);
    for (const s of [...new Set(list.map((e) => e.section))]) {
        const c = counts(list.filter((e) => e.section === s));
        md += `| ${LIB[lib]} | ${s} | ${c.full + c.partial + c.none + c.todo} | ${c.full} | ${c.partial} | ${c.none} |\n`;
    }
}
md += '\n';

// ------------------------------------------------------------ features
const tally = {};
for (const e of all) for (const k of e.needs || []) {
    tally[k] ||= { none: [], partial: [] };
    (e.status === 'none' ? tally[k].none : tally[k].partial).push(e);
}
const ranked = Object.entries(tally).sort((a, b) => (b[1].none.length * 2 + b[1].partial.length) - (a[1].none.length * 2 + a[1].partial.length));
md += '## Missing features, ranked\n\n';
md += '“Blocks” counts examples ElicitJS cannot draw at all without the feature; “degrades” counts examples it draws only partly. An example can need several features.\n\n';
md += '| Feature | Blocks | Degrades | What it is |\n|---|---:|---:|---|\n';
for (const [k, v] of ranked) md += `| **${label(k)}** | ${v.none.length} | ${v.partial.length} | ${oneLine(features[k] ? features[k].description : '')} |\n`;
md += '\n';

// Sole blocker: features that are the ONLY thing standing between an example and a recreation.
const sole = {};
for (const e of all.filter((x) => x.status === 'none' && (x.needs || []).length === 1)) (sole[e.needs[0]] ||= []).push(e);
if (Object.keys(sole).length) {
    md += '### Single-feature unlocks\n\nExamples whose only listed blocker is one feature — adding it would make them drawable:\n\n';
    for (const [k, list] of Object.entries(sole).sort((a, b) => b[1].length - a[1].length)) {
        md += `- **${label(k)}** (${list.length}): ${list.map((e) => `${e.title} (${LIB[e.lib]})`).join(', ')}\n`;
    }
    md += '\n';
}

// ------------------------------------------------------------ prep
const prep = {};
for (const e of all) for (const k of e.prep || []) (prep[k] ||= []).push(e);
if (Object.keys(prep).length) {
    md += '## Transforms computed outside the spec\n\nElicitJS has no transform layer, so recreations compute these in plain JavaScript before calling `Elicit`:\n\n';
    md += '| Transform | Examples |\n|---|---:|\n';
    for (const [k, list] of Object.entries(prep).sort((a, b) => b[1].length - a[1].length)) md += `| ${label(k)} | ${list.length} |\n`;
    md += '\n';
}

// ------------------------------------------------------------ lists
for (const [status, heading] of [['none', 'Not supported'], ['partial', 'Partly recreated']]) {
    md += `## ${heading}\n\n`;
    for (const lib of ['vl', 'plot']) {
        const list = all.filter((e) => e.lib === lib && e.status === status);
        if (!list.length) continue;
        md += `### ${LIB[lib]} (${list.length})\n\n| Example | Section | Why | Needs |\n|---|---|---|---|\n`;
        for (const e of list) {
            md += `| [${e.title}](${e.url}) | ${e.section} | ${oneLine(e.verdict).replace(/\|/g, '\\|')} | ${(e.needs || []).map(label).join(', ')} |\n`;
        }
        md += '\n';
    }
}
md += '## Recreated\n\n';
for (const lib of ['vl', 'plot']) {
    const list = all.filter((e) => e.lib === lib && e.status === 'full');
    md += `### ${LIB[lib]} (${list.length})\n\n`;
    md += list.map((e) => `- [${e.title}](${e.url}) — ${(e.interfaces || []).length} interface${(e.interfaces || []).length === 1 ? '' : 's'}${(e.prep || []).length ? ` · prep: ${e.prep.map(label).join(', ')}` : ''}`).join('\n') + '\n\n';
}

// ------------------------------------------------------------ vocabulary coverage
const VOCAB = [
    'move(', 'slide(', 'resize(', 'rotate(', 'cycle(', 'create(', 'toggle(', 'remove(', 'set(', 'editText(', 'rank(', 'select(',
    'brushSpan(', 'brushRect(', 'moveSpan(', 'edit.line.sweep(', 'edit.line.draw(', 'edit.line.anchor(', 'edit.line.newSeries(',
    'edit.line.removeSeries(', 'pick: "sweep"', 'pick: "nearest"', 'edit.stack.cut(', 'edit.stack.edge(', 'edit.stack.merge(',
    'edit.trend.', 'edit.waffle.fill(', 'edit.legend.', 'edit.scale.categories(', 'edit.axis.scale(', 'edit.network.', 'edit.geo.',
    'maintainSum(', 'clamp(', 'snap(', 'count(', 'unique(', 'ordering(', 'monotonic(', 'spacing(', 'constraints.custom(',
    'lock:', 'stage:', 'open: true', 'widgets.', 'guides.',
];
const code = all.flatMap((e) => (e.interfaces || []).map((i) => i.code)).concat(beyond.map((b) => b.code)).map((c) => c.replace(/'/g, '"'));
md += '## Vocabulary exercised by the interfaces\n\nHow many interfaces (including the Beyond page) use each piece of the edit / constraint vocabulary:\n\n| Vocabulary | Interfaces |\n|---|---:|\n';
for (const v of VOCAB) {
    const n = code.filter((c) => c.includes(v)).length;
    md += `| \`${v.replace(/\($/, '()')}\` | ${n} |\n`;
}
md += '\n';

fs.writeFileSync(path.join(root, 'ANALYSIS.md'), md);

// The site's analysis page shows the same narrative (minus its title), as HTML.
function mdToHtml(src) {
    const inline = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    const out = []; let list = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
    for (const block of src.split(/\n\n+/)) {
        for (const line of block.split('\n')) {
            let m;
            if ((m = line.match(/^(#{2,3}) (.*)$/))) { close(); out.push(`<h${m[1].length + 1}>${inline(m[2])}</h${m[1].length + 1}>`); }
            else if ((m = line.match(/^- (.*)$/))) { if (list !== 'ul') { close(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); }
            else if ((m = line.match(/^\d+\. (.*)$/))) { if (list !== 'ol') { close(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); }
            else if ((m = line.match(/^ {2,}(.*)$/)) && list) { out[out.length - 1] = out[out.length - 1].replace(/<\/li>$/, ' ' + inline(m[1]) + '</li>'); }
            else if (line.trim()) { close(); out.push(`<p>${inline(line)}</p>`); }
        }
        close();
    }
    return out.join('\n');
}
if (fs.existsSync(narrative)) {
    const body = fs.readFileSync(narrative, 'utf8').replace(/^# .*\n+/, '');
    // The intro paragraph is the page lead; the rest is the body.
    const [intro, ...rest] = body.split(/\n\n/);
    fs.writeFileSync(path.join(root, 'entries/analysis-text.js'),
        '// Generated by tools/build-analysis.mjs from tools/analysis-narrative.md. Do not edit.\n' +
        `window.GALLERY_TEXT = Object.assign(window.GALLERY_TEXT || {}, ${JSON.stringify({ analysisLead: intro.trim(), analysisBody: mdToHtml(rest.join('\n\n')) }, null, 1)});\n`);
}
const c = counts(all);
console.log(`ANALYSIS.md: ${all.length} examples — full ${c.full}, partial ${c.partial}, none ${c.none}, todo ${c.todo}; ${c.ifaces} interfaces + ${beyond.length} beyond`);
