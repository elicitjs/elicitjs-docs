// build-originals.mjs — fetch the two upstream galleries and compile them into
// classic scripts the static site can load from file:// (no server, no modules).
//
//   node tools/build-originals.mjs          (run from the gallery/ folder)
//
// Writes:
//   originals/catalog.js         window.CATALOG = { vl: [...], plot: [...] }
//   originals/vl-specs.js        window.VL_SPECS = { name: spec }
//   originals/plot-notebooks.js  window.PLOT_NOTEBOOKS = { slug: { define, code } }
//
// Downloads are cached in tools/.cache so a rebuild is offline.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const cache = path.join(here, '.cache');
await fs.mkdir(path.join(cache, 'vl'), { recursive: true });
await fs.mkdir(path.join(cache, 'plot'), { recursive: true });

async function cached(file, url) {
    const p = path.join(cache, file);
    try { return await fs.readFile(p, 'utf8'); } catch { /* fetch */ }
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    const t = await r.text();
    await fs.writeFile(p, t);
    return t;
}

// ---------------------------------------------------------------- Vega-Lite
const VL_REF = 'main';
const vlIndex = JSON.parse(await cached('vl-examples.json',
    `https://raw.githubusercontent.com/vega/vega-lite/${VL_REF}/site/_data/examples.json`));
const vl = [];
const seen = new Set();
for (const [group, sections] of Object.entries(vlIndex)) {
    for (const [section, arr] of Object.entries(sections)) {
        for (const e of arr) {
            // An example listed under two sections keeps its FIRST home.
            if (seen.has(e.name)) continue;
            seen.add(e.name);
            vl.push({
                id: `vl-${e.name}`, lib: 'vl', ref: e.name, group,
                section: section || group, title: e.title,
                description: e.description || '',
                url: `https://vega.github.io/vega-lite/examples/${e.name}.html`,
            });
        }
    }
}
const vlSpecs = {};
await Promise.all(vl.map(async (e) => {
    const t = await cached(`vl/${e.ref}.vl.json`,
        `https://raw.githubusercontent.com/vega/vega-lite/${VL_REF}/examples/specs/${e.ref}.vl.json`);
    vlSpecs[e.ref] = JSON.parse(t);
}));

// ---------------------------------------------------------------- Plot
const galleryJs = await cached('plot-gallery.js',
    'https://api.observablehq.com/@observablehq/plot-gallery.js?v=4');
// Each section cell is `function _x(previews,md){return(md`### Heading ... ${previews([...])}`)}`.
// Run them with a capturing `previews` and `md` to get the real lists.
const plot = [];
const seenPlot = new Set();
const sectionFns = [...galleryJs.matchAll(/^function (_[a-z]+)\(previews,md\)\{return\(\n([\s\S]*?)\n\)\}$/gm)];
for (const [, , body] of sectionFns) {
    let captured = [];
    const previews = (arr) => { captured = arr; return ''; };
    const md = (strings) => strings[0];
    const head = new Function('previews', 'md', `return (${body});`)(previews, md);
    const section = (head.match(/###\s*([^\n]+)/) || [, 'Other'])[1].replace(/<!--.*?-->/g, '').trim();
    for (const p of captured) {
        if (!p.path || seenPlot.has(p.path.replace(/\/\d+$/, ''))) continue;
        seenPlot.add(p.path.replace(/\/\d+$/, ''));
        const slug = p.path.replace(/^@/, '').replace(/\/\d+$/, '').replace(/\//g, '__');
        plot.push({
            id: 'plot-' + slug.split('__').map((x, i, a) => (i === a.length - 1 ? x.replace(/^plot-/, '') : x))
                .filter((x) => x !== 'observablehq').join('-'),
            lib: 'plot', ref: slug, group: 'Observable Plot', section, title: p.title,
            description: '',
            url: `https://observablehq.com/${p.path.replace(/\/(\d+)$/, '')}`,
            thumbnail: p.thumbnail
                ? `https://static.observableusercontent.com/thumbnail/${p.thumbnail}.jpg` : null,
            apiPath: p.path.replace(/\/(\d+)$/, '@$1'),
        });
    }
}

// A notebook module is ESM (`export default function define`). Rewrite it into an
// assignment so a classic <script> can register it.
const plotNotebooks = {};
for (const e of plot) {
    let src;
    try {
        src = await cached(`plot/${e.ref}.js`, `https://api.observablehq.com/${e.apiPath}.js?v=4`)
            .catch(() => cached(`plot/${e.ref}.js`, `https://api.observablehq.com/${e.apiPath.replace(/@\d+$/, '')}.js?v=4`));
    } catch (err) { console.warn('skip', e.ref, err.message); continue; }
    if (src.startsWith('{"errors"')) { console.warn('skip (api error)', e.ref); continue; }
    // Child-notebook imports: keep them resolvable by URL at runtime.
    const imports = [...src.matchAll(/^import (define\d+) from "([^"]+)";$/gm)];
    let body = src.replace(/^import define\d+ from "[^"]+";\n/gm, '')
        .replace('export default function define(', 'function define(')
        // Child notebooks are imported by a site-relative URL; make it absolute.
        .replace(/import\("\/d\//g, 'import("https://api.observablehq.com/d/');
    // Display code: every cell that names Plot or builds the data, verbatim.
    const cells = [...src.matchAll(/^function (_[A-Za-z0-9_$]+)\(([^)]*)\)\{return\(\n([\s\S]*?)\n\)\}$/gm)]
        .filter(([, , args, b]) => !/^md`/.test(b.trim()) && !/^htl\.html`/.test(b.trim()))
        .map(([, name, args, b]) => {
            const n = name.replace(/^_/, '');
            return /^\d+$/.test(n) ? b.trim() : `${n} = ${b.trim()}`;
        });
    const title = (src.match(/<h1[^>]*>(?:Plot: )?([^<]+)<\/h1>/) || src.match(/^# (?:Plot: )?(.+)$/m) || [, e.title])[1];
    const desc = (src.match(/<\/div>\n\n# [^\n]+\n\n([^\n`]+)/) || [, ''])[1];
    if (desc && !e.description) e.description = desc.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    plotNotebooks[e.ref] = {
        code: cells.join('\n\n'),
        imports: imports.map(([, name, url]) => ({ name, url })),
        src: body,
        title,
    };
}

// ---------------------------------------------------------------- write
const out = path.join(root, 'originals');
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, 'catalog.js'),
    `window.CATALOG = ${JSON.stringify({ vl, plot }, null, 1)};\n`);
await fs.writeFile(path.join(out, 'vl-specs.js'),
    `window.VL_SPECS = ${JSON.stringify(vlSpecs)};\n`);
let nb = 'window.PLOT_NOTEBOOKS = {};\n';
for (const [slug, n] of Object.entries(plotNotebooks)) {
    nb += `window.PLOT_NOTEBOOKS[${JSON.stringify(slug)}] = { code: ${JSON.stringify(n.code)}, imports: ${JSON.stringify(n.imports)}, define: (function(){\n${n.src}\nreturn define;\n})() };\n`;
}
await fs.writeFile(path.join(out, 'plot-notebooks.js'), nb);
console.log(`vl ${vl.length} examples, plot ${plot.length} examples (${Object.keys(plotNotebooks).length} notebooks)`);
