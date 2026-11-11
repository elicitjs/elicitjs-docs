// app.js — the gallery's single page app. Classic script, no build step, so the
// folder opens straight from disk (file://) as well as from any static host.
(function () {
  'use strict';

  const CAT = window.CATALOG || { vl: [], plot: [] };
  const G = window.GALLERY;
  const VLDATA = 'https://cdn.jsdelivr.net/npm/vega-datasets@3/';

  // ------------------------------------------------------------ helpers
  const $ = (sel, el = document) => el.querySelector(sel);
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Inline markdown for prose fields: `code`, **bold**, [text](url).
  const md = (s) => esc(s || '')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,;:!?)]|$)/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // ------------------------------------------------------------ catalog
  // Every upstream example, merged with whatever entry describes it.
  const all = [...CAT.vl, ...CAT.plot].map((c) => ({ ...c, ...(G.entries[c.id] || {}), catalog: c }));
  const byId = Object.fromEntries(all.map((e) => [e.id, e]));
  const statusOf = (e) => (G.entries[e.id] ? (G.entries[e.id].status || 'none') : 'todo');
  const STATUS = {
    full: { label: 'Recreated', short: 'full' },
    partial: { label: 'Partly recreated', short: 'partial' },
    none: { label: 'Not supported', short: 'none' },
    todo: { label: 'Not yet analysed', short: 'todo' },
  };
  const LIB = { vl: 'Vega-Lite', plot: 'Observable Plot' };

  // ------------------------------------------------------------ code view
  const KW = /\b(const|let|var|function|return|new|await|async|if|else|for|of|in|true|false|null|undefined|typeof|=>)\b/;
  function highlightJs(line) {
    // Tokenise one line: strings, comments, numbers, keywords, identifiers.
    const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)(?=\s*:)|(\b(?:const|let|var|function|return|new|await|async|if|else|for|of|in|true|false|null|undefined|typeof)\b)/g;
    let out = '', last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      const t = esc(m[0]);
      out += m[1] ? `<span class="t-c">${t}</span>`
        : m[2] ? `<span class="t-s">${t}</span>`
          : m[3] ? `<span class="t-n">${t}</span>`
            : m[4] ? `<span class="t-f">${t}</span>`
              : m[5] ? `<span class="t-k">${t}</span>`
                : `<span class="t-w">${t}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(line.slice(last));
  }
  function highlightJson(line) {
    return esc(line)
      .replace(/(&quot;|")([^"]*?)("\s*:)/g, '<span class="t-k">"$2"</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="t-s">$1</span>')
      .replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="t-n">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="t-w">$1</span>');
  }

  // A line ending in `//! note` is HIGHLIGHTED (it is what makes the elicitation
  // work); the marker is stripped and the note shown beside the line.
  function codeView(code, { lang = 'js', title, open = true } = {}) {
    const lines = String(code).replace(/\s+$/, '').split('\n');
    const rows = lines.map((raw) => {
      const mk = raw.match(/^(.*?)\s*\/\/!\s?(.*)$/);
      const text = mk ? mk[1] : raw;
      const note = mk ? mk[2] : '';
      const body = lang === 'json' ? highlightJson(text) : highlightJs(text);
      return `<div class="ln${mk ? ' hl' : ''}"><span class="lc">${body || ' '}</span>${note ? `<span class="note">${md(note)}</span>` : ''}</div>`;
    }).join('');
    const hlCount = lines.filter((l) => /\/\/!/.test(l)).length;
    const wrap = h('details', { class: 'code', open: open || null },
      h('summary', {}, h('span', {}, title || 'Code'),
        hlCount ? h('span', { class: 'hlcount' }, `${hlCount} highlighted line${hlCount > 1 ? 's make' : ' makes'} the elicitation work`) : null,
        h('button', {
          class: 'copy', type: 'button', onclick: (ev) => {
            ev.preventDefault();
            const clean = lines.map((l) => l.replace(/\s*\/\/!.*$/, '')).join('\n');
            navigator.clipboard?.writeText(clean);
            ev.target.textContent = 'Copied'; setTimeout(() => (ev.target.textContent = 'Copy'), 1200);
          },
        }, 'Copy')),
      h('pre', { html: rows }));
    return wrap;
  }

  // ------------------------------------------------------------ ElicitJS runner
  const E = window.elicit;
  const {
    line: _l, axis: _a, legend: _lg, stack: _s, geo: _g, waffle: _w, trend: _t,
    network: _n, when: _wh, scale: _sc, ...universalEdits
  } = E.edit;
  const dataCache = new Map();
  function fetchData(url, opts = {}) {
    const key = url + JSON.stringify(opts);
    if (!dataCache.has(key)) {
      const kind = opts.type || (/\.csv(\?|$)/.test(url) ? 'csv' : /\.tsv(\?|$)/.test(url) ? 'tsv' : 'json');
      const p = kind === 'csv' ? d3.csv(url, d3.autoType)
        : kind === 'tsv' ? d3.tsv(url, d3.autoType)
          : kind === 'text' ? d3.text(url) : d3.json(url);
      dataCache.set(key, p);
    }
    // A fresh copy per caller, so one chart's edits never leak into another's rows.
    const copy = (d) => (Array.isArray(d) ? [...d] : d && typeof d === 'object' && !(d instanceof Date) ? { ...d } : d);
    return dataCache.get(key).then((v) => (Array.isArray(v) ? v.map(copy) : v));
  }
  // Datasets the two galleries use, by the name each gallery uses.
  const vegaData = (file, opts) => fetchData(VLDATA + (file.startsWith('data/') ? file : 'data/' + file), opts);
  function plotFileUrl(slug, name) {
    const nb = window.PLOT_NOTEBOOKS[slug] || window.PLOT_NOTEBOOKS['observablehq__' + slug];
    if (!nb) throw new Error(`plotData: no notebook ${slug}`);
    const src = nb.define.toString();
    const m = src.match(new RegExp(`\\["${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}", \\{url: "([^"]+)"`));
    if (!m) throw new Error(`plotData: ${slug} has no file ${name}`);
    return m[1];
  }
  const SAMPLE = ['aapl', 'alphabet', 'cars', 'citywages', 'diamonds', 'flare', 'industries', 'miserables', 'olympians', 'penguins', 'pizza', 'weather'];
  let sampleLib = null;
  async function plotData(slugOrSample, file, opts = {}) {
    if (file == null && SAMPLE.includes(slugOrSample)) {
      // Observable's built-in sample datasets — the exact rows Plot's gallery uses.
      sampleLib ||= new window.ObservableRuntime.Library();
      const v = await sampleLib[slugOrSample]();
      return Array.isArray(v) ? v.map((d) => ({ ...d })) : v;
    }
    const url = plotFileUrl(slugOrSample, file);
    const type = opts.type || (/\.csv$/.test(file) ? 'csv' : /\.tsv$/.test(file) ? 'tsv' : 'json');
    return fetchData(url, { ...opts, type });
  }

  function makeScope(mount) {
    return {
      ...E.plot, ...E.elements, ...E.constraints, constraints: E.constraints,
      ...universalEdits,
      Elicit: E.Elicit, when: E.edit.when, edit: E.edit, elements: E.elements,
      guides: E.guides, widgets: E.widgets, format: E.format, authoring: E.authoring,
      D3Renderer: E.D3Renderer, CanvasRenderer: E.CanvasRenderer,
      themes: E.themes, resolveTheme: E.resolveTheme, noteBox: E.authoring.noteBox,
      d3, topojson: window.topojson, vegaData, plotData, mount,
    };
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  // Run an ElicitJS snippet into `host`. Resolves { chart, warnings, error }.
  // Runs are SERIALIZED: warnings are captured by patching console.warn, so two
  // charts building at once would each collect the other's. Each run also clears
  // the library's warn-once dedup, so every chart reports its own problems.
  let runQueue = Promise.resolve();
  function runElicit(code, host) {
    const p = runQueue.then(() => runElicitNow(code, host));
    runQueue = p.catch(() => {});
    return p;
  }
  async function runElicitNow(code, host) {
    if (E.setWarnings) E.setWarnings(true);
    const warnings = [];
    const origWarn = console.warn;
    console.warn = function (...args) {
      if (typeof args[0] === 'string' && args[0].startsWith('[elicit]')) warnings.push(args.join(' '));
      return origWarn.apply(this, args);
    };
    let chart = null;
    const mount = (el) => { if (el instanceof Node) { host.append(el); chart = chart || el; } return el; };
    const scope = makeScope(mount);
    try {
      const fn = new AsyncFunction(...Object.keys(scope), code);
      await fn(...Object.values(scope));
      await new Promise((r) => requestAnimationFrame(() => r()));
      return { chart, warnings };
    } catch (error) {
      host.append(h('div', { class: 'err' }, `Error: ${error && error.message || error}`));
      return { chart, warnings, error: String(error && error.stack || error) };
    } finally {
      // Warnings fire synchronously during build and on the first frame.
      await new Promise((r) => setTimeout(r, 30));
      console.warn = origWarn;
    }
  }

  // ------------------------------------------------------------ originals
  let activeRuntimes = [];
  function disposeRuntimes() { activeRuntimes.forEach((r) => { try { r.dispose(); } catch { /* gone */ } }); activeRuntimes = []; }

  async function renderVl(name, host) {
    const spec = window.VL_SPECS[name];
    if (!spec) { host.append(h('div', { class: 'err' }, 'Spec not bundled.')); return { error: 'missing spec' }; }
    try {
      await vegaEmbed(host, JSON.parse(JSON.stringify(spec)), {
        actions: false, renderer: 'svg',
        loader: vega.loader({ baseURL: VLDATA }),
      });
      return {};
    } catch (error) {
      host.append(h('div', { class: 'err' }, String(error.message || error)));
      return { error: String(error) };
    }
  }

  function isPlotOutput(v) {
    if (!(v instanceof Element)) return false;
    const cls = (v.getAttribute('class') || '');
    if (/plot/.test(cls) && (v.tagName.toLowerCase() === 'svg' || v.tagName.toLowerCase() === 'figure')) return true;
    return !!(v.querySelector && v.querySelector('svg[class*="plot"], figure[class*="plot"]'));
  }

  async function renderPlot(slug, host) {
    const nb = window.PLOT_NOTEBOOKS[slug];
    if (!nb) { host.append(h('div', { class: 'err' }, 'Notebook not bundled.')); return { error: 'missing notebook' }; }
    const { Runtime, Library } = window.ObservableRuntime;
    const lib = new Library();
    const W = Math.max(320, Math.min(640, host.clientWidth || 600));
    // Stand-ins for builtins that would otherwise fetch from a CDN or track the window.
    // A notebook that reads a cell its published version no longer defines.
    const SHIMS = {
      'observablehq__plot-ridgeline': {
        overlap: () => 4.5,
        traffic: () => d3.csv(plotFileUrl('observablehq__plot-ridgeline', 'traffic.csv'), d3.autoType),
      },
    };
    const builtins = Object.assign(lib, SHIMS[slug] || {}, {
      Plot: () => window.Plot,
      d3: () => window.d3,
      width: () => W,
      md: () => () => document.createElement('div'),
      tex: () => () => document.createElement('span'),
    });
    const runtime = new Runtime(builtins);
    activeRuntimes.push(runtime);
    let shown = 0;
    const controls = h('div', { class: 'nb-controls' });
    host.append(controls);
    const errors = [];
    return new Promise((resolve) => {
      const done = () => resolve(errors.length && !shown ? { error: errors.join('; ') } : {});
      let timer = setTimeout(done, 12000);
      const settle = () => { clearTimeout(timer); timer = setTimeout(done, 600); };
      runtime.module(nb.define, (name) => ({
        pending() {},
        fulfilled(v) {
          if (name && name.startsWith('viewof ') && v instanceof Element) { controls.append(v); return; }
          if (isPlotOutput(v)) {
            if (shown < 3 && !host.contains(v)) { host.append(v); shown++; }
            settle();
          }
        },
        rejected(e) { errors.push(`${name || 'cell'}: ${e && e.message || e}`); settle(); },
      }));
    });
  }

  // ------------------------------------------------------------ data panel
  function fmtVal(v) {
    if (v == null) return `<span class="t-w">${v}</span>`;
    if (typeof v === 'number') return `<span class="t-n">${Number.isInteger(v) ? v : v.toFixed(2)}</span>`;
    if (v instanceof Date) return `<span class="t-s">${v.toISOString().slice(0, 10)}</span>`;
    if (typeof v === 'string') return `<span class="t-s">"${esc(v.length > 40 ? v.slice(0, 40) + '…' : v)}"</span>`;
    const s = JSON.stringify(v);
    return `<span class="t-n">${esc(s.length > 40 ? s.slice(0, 40) + '…' : s)}</span>`;
  }
  function dataPanel(chart) {
    const body = h('pre', { class: 'data-body' });
    const count = h('span', { class: 'data-count' });
    const panel = h('div', { class: 'data' }, h('div', { class: 'data-head' }, h('span', {}, 'getData()'), count), body);
    const render = () => {
      let d;
      try { d = chart.getData(); } catch { body.textContent = 'unavailable'; return; }
      const groups = Array.isArray(d) ? [[null, d]] : Object.entries(d || {});
      count.textContent = groups.map(([n, r]) => (n ? `${n} ` : '') + `${r.length} row${r.length === 1 ? '' : 's'}`).join(' · ');
      body.innerHTML = groups.map(([n, rows]) => {
        const shownRows = rows.slice(0, 60);
        const pad = String(Math.max(rows.length - 1, 0)).length;
        const txt = shownRows.map((r, i) => `<span class="idx">${String(i).padStart(pad)}</span>  { ` +
          Object.entries(r).map(([k, v]) => `<span class="t-k">${esc(k)}:</span> ${fmtVal(v)}`).join(', ') + ' }').join('\n');
        return (n ? `<span class="tbl">${esc(n)}</span>\n` : '') + (txt || '<span class="t-c">no rows</span>') +
          (rows.length > 60 ? `\n<span class="t-c">… ${rows.length - 60} more</span>` : '');
      }).join('\n\n');
    };
    if (chart && chart.on) { chart.on('change', render); render(); }
    return panel;
  }

  // ------------------------------------------------------------ routes + sidebar
  // #/                      overview          #/gallery/<lib>[/<section>]  gallery grid
  // #/analysis, #/beyond    study pages       #/<id>                       one example
  const nav = $('#nav');
  const slug = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sectionsOf = (lib) => [...new Set(all.filter((e) => e.lib === lib).map((e) => e.section))];
  const store = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };
  let currentLib = store.get('gallery-lib', 'vl') === 'plot' ? 'plot' : 'vl';
  let filter = store.get('gallery-filter', 'all');
  let query = '';

  function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    if (!parts[0]) return { page: 'overview' };
    if (parts[0] === 'analysis' || parts[0] === 'beyond') return { page: parts[0] };
    if (parts[0] === 'gallery') return { page: 'gallery', lib: parts[1] === 'plot' ? 'plot' : 'vl', section: parts[2] || null };
    return { page: 'entry', id: decodeURIComponent(parts.join('/')) };
  }

  function navItem(href, label, active, count, attrs = {}) {
    return h('a', { href, class: 'nav-item' + (active ? ' active' : ''), ...attrs },
      h('span', { class: 'nav-label' }, label), count != null ? h('span', { class: 'n' }, count) : null);
  }

  function buildNav(r) {
    nav.innerHTML = '';
    const entry = r.page === 'entry' ? byId[r.id] : null;
    nav.append(h('div', { class: 'nav-group' },
      h('div', { class: 'nav-head' }, 'Study'),
      navItem('#/', 'Overview', r.page === 'overview'),
      navItem('#/analysis', 'Outcome analysis', r.page === 'analysis'),
      navItem('#/beyond', 'Beyond the two libraries', r.page === 'beyond')));
    const lib = currentLib;
    const list = all.filter((e) => e.lib === lib);
    const g = h('div', { class: 'nav-group' },
      h('div', { class: 'nav-head' }, `${LIB[lib]} chart types`),
      navItem(`#/gallery/${lib}`, 'All examples', r.page === 'gallery' && !r.section, list.length));
    for (const s of sectionsOf(lib)) {
      const items = list.filter((e) => e.section === s);
      const on = entry ? entry.section === s : r.page === 'gallery' && r.section === slug(s);
      g.append(navItem(`#/gallery/${lib}/${slug(s)}`, s, on, items.length, { 'data-sec': slug(s) }));
      if (entry && entry.section === s) {
        g.append(h('div', { class: 'nav-sub' }, ...items.map((x) =>
          h('a', { href: `#/${x.id}`, class: 'nav-subitem' + (x.id === entry.id ? ' active' : '') },
            h('span', { class: `dot s-${statusOf(x)}`, title: STATUS[statusOf(x)].label }), x.title))));
      }
    }
    nav.append(g);
    nav.append(h('div', { class: 'nav-legend' }, ...['full', 'partial', 'none'].map((k) =>
      h('span', {}, h('span', { class: `dot s-${k}` }), STATUS[k].label))));
    // Keep the current example in view in a long section list.
    const act = nav.querySelector('.nav-subitem.active');
    if (act) act.scrollIntoView({ block: 'nearest' });
  }

  function updateTopbar(r) {
    const libPage = r.page === 'gallery' || r.page === 'entry';
    document.querySelectorAll('.libswitch [data-lib]').forEach((a) =>
      a.classList.toggle('on', libPage && a.dataset.lib === currentLib));
    document.querySelectorAll('.toplinks [data-page]').forEach((a) =>
      a.classList.toggle('on', a.dataset.page === r.page));
  }

  // ------------------------------------------------------------ pages
  const main = $('#main');
  const blocks = []; // render bookkeeping for the headless checker

  function counts(list) {
    const c = { full: 0, partial: 0, none: 0, todo: 0 };
    list.forEach((e) => c[statusOf(e)]++);
    return c;
  }
  function statBar(list) {
    const c = counts(list); const n = list.length || 1;
    return h('div', { class: 'statbar' },
      ...['full', 'partial', 'none', 'todo'].filter((k) => c[k]).map((k) =>
        h('span', { class: `seg s-${k}`, style: `flex:${c[k]}`, title: `${STATUS[k].label}: ${c[k]}` },
          c[k] / n > 0.06 ? `${c[k]}` : '')));
  }
  function legendRow() {
    return h('div', { class: 'legend' }, ...['full', 'partial', 'none', 'todo'].map((k) =>
      h('span', {}, h('span', { class: `dot s-${k}` }), STATUS[k].label)));
  }

  function pageOverview() {
    const intro = window.GALLERY_TEXT && window.GALLERY_TEXT.overview;
    main.append(h('header', { class: 'page-head' },
      h('div', { class: 'eyebrow' }, 'ElicitJS × Vega-Lite × Observable Plot'),
      h('h1', {}, 'What can ElicitJS draw — and ask?'),
      h('p', { class: 'lead', html: md(intro || '') })));
    const grid = h('div', { class: 'cards' });
    for (const lib of ['vl', 'plot']) {
      const list = all.filter((e) => e.lib === lib); const c = counts(list);
      grid.append(h('div', { class: 'card' },
        h('h3', {}, LIB[lib]), h('div', { class: 'big' }, list.length, h('small', {}, ' examples')),
        statBar(list),
        h('p', { class: 'muted' }, `${c.full} recreated · ${c.partial} partly · ${c.none} not supported${c.todo ? ` · ${c.todo} pending` : ''}`)));
    }
    const ifaces = all.reduce((n, e) => n + ((e.interfaces || []).length), 0);
    grid.append(h('div', { class: 'card' }, h('h3', {}, 'Elicitation interfaces'),
      h('div', { class: 'big' }, ifaces, h('small', {}, ' live interfaces')),
      h('p', { class: 'muted' }, 'Each recreated chart gets one or more ways to ask a question with it. Every one is live: drag, click or draw, and watch getData() change.')));
    main.append(grid, legendRow());
    if (window.GALLERY_TEXT && window.GALLERY_TEXT.howToRead) {
      main.append(h('section', { class: 'prose', html: window.GALLERY_TEXT.howToRead }));
    }
    // Section matrix
    for (const lib of ['vl', 'plot']) {
      const list = all.filter((e) => e.lib === lib);
      main.append(h('h2', {}, LIB[lib]));
      const tbl = h('div', { class: 'secgrid' });
      for (const s of [...new Set(list.map((e) => e.section))]) {
        const items = list.filter((e) => e.section === s);
        tbl.append(h('div', { class: 'secrow' }, h('div', { class: 'secname' }, s),
          h('div', { class: 'secdots' }, ...items.map((e) =>
            h('a', { href: `#/${e.id}`, class: `dot big s-${statusOf(e)}`, title: `${e.title} — ${STATUS[statusOf(e)].label}` })))));
      }
      main.append(tbl);
    }
  }

  function badge(e) {
    const s = statusOf(e);
    return h('span', { class: `badge s-${s}` }, STATUS[s].label);
  }

  function featureChip(key) {
    const f = G.features[key];
    return h('span', { class: 'chip', title: f ? f.description : key }, f ? f.label : key);
  }

  // ------------------------------------------------------------ gallery grid
  const thumbUrl = (e) => (e.lib === 'vl' ? `https://vega.github.io/vega-lite/examples/${e.ref}.svg` : e.thumbnail || null);
  let spy = null; // stops the scroll listener that tracks the visible section

  function exampleCard(e) {
    const s = statusOf(e);
    const n = (e.interfaces || []).length;
    const src = thumbUrl(e);
    const fallback = () => h('div', { class: 'ex-noimg' }, e.title);
    const thumb = h('div', { class: `ex-thumb ex-thumb-${e.lib}` },
      src ? h('img', { src, alt: '', loading: 'lazy', decoding: 'async', onerror: (ev) => ev.target.replaceWith(fallback()) }) : fallback());
    return h('a', { href: `#/${e.id}`, class: 'ex', title: e.title },
      thumb,
      h('div', { class: 'ex-meta' },
        h('div', { class: 'ex-title' }, e.title),
        h('div', { class: 'ex-sub' },
          h('span', { class: `dot s-${s}` }), STATUS[s].label,
          n ? h('span', { class: 'ex-n' }, `${n} interface${n > 1 ? 's' : ''}`) : null)));
  }

  function scrollToSection(sec) {
    const el = sec && document.getElementById(`sec-${sec}`);
    if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
  }

  function pageGallery(r) {
    const lib = r.lib;
    const list = all.filter((e) => e.lib === lib);
    const c = counts(list);
    main.classList.add('wide');
    main.append(h('header', { class: 'page-head' },
      h('div', { class: 'eyebrow' }, 'Gallery'),
      h('h1', {}, `${LIB[lib]} examples`),
      h('p', { class: 'lead' }, `Every example in the ${LIB[lib]} gallery. Open one to see the original beside its ElicitJS recreation, with each elicitation interface in its own tab.`),
      h('div', { class: 'head-stats' }, statBar(list),
        h('span', { class: 'muted small' }, `${list.length} examples · ${c.full} recreated · ${c.partial} partly · ${c.none} not supported${c.todo ? ` · ${c.todo} pending` : ''}`))));

    const shown = h('span', { class: 'optbar-count' });
    const body = h('div', { class: 'ex-sections' });
    const chips = h('div', { class: 'seg', role: 'group', 'aria-label': 'Filter by outcome' });
    const FILTERS = [['all', 'All'], ['full', 'Recreated'], ['partial', 'Partly'], ['none', 'Not supported']];
    const render = () => {
      body.innerHTML = '';
      const q = query.toLowerCase().trim();
      const items = list
        .filter((e) => filter === 'all' || statusOf(e) === filter)
        .filter((e) => !q || (e.title + ' ' + e.section + ' ' + e.ref).toLowerCase().includes(q));
      shown.textContent = items.length === list.length ? `${list.length} examples` : `${items.length} of ${list.length}`;
      for (const s of sectionsOf(lib)) {
        const sec = items.filter((e) => e.section === s);
        if (!sec.length) continue;
        body.append(h('section', { class: 'ex-section', id: `sec-${slug(s)}`, 'data-sec': slug(s) },
          h('h2', {}, s, h('small', {}, ` ${sec.length}`)),
          h('div', { class: 'ex-grid' }, ...sec.map(exampleCard))));
      }
      if (!items.length) body.append(h('p', { class: 'placeholder' }, 'No examples match this filter.'));
      watchSections();
    };
    FILTERS.forEach(([k, label]) => chips.append(h('button', {
      type: 'button', class: filter === k ? 'on' : null,
      onclick: (ev) => {
        filter = k; store.set('gallery-filter', k);
        chips.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === ev.currentTarget));
        render();
      },
    }, label)));
    const input = h('input', {
      type: 'search', class: 'optbar-search', placeholder: 'Filter examples…', 'aria-label': 'Filter examples',
      oninput: (ev) => { query = ev.target.value; render(); },
    });
    input.value = query;
    main.append(h('div', { class: 'optbar' }, input, chips, shown), body);
    render();
    if (r.section) requestAnimationFrame(() => scrollToSection(r.section));
  }

  // Highlight the sidebar's section as its cards scroll past: the last section
  // whose heading has reached the sticky bars.
  function watchSections() {
    if (spy) spy();
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = main.querySelector('.optbar');
      const line = (bar ? bar.getBoundingClientRect().bottom : 0) + 24;
      const secs = [...main.querySelectorAll('.ex-section')];
      if (!secs.length) return;
      const atTop = secs[0].getBoundingClientRect().top > line;
      let cur = secs[0];
      for (const el of secs) if (el.getBoundingClientRect().top <= line) cur = el;
      nav.querySelectorAll('.nav-item[data-sec]').forEach((a) => a.classList.toggle('active', !atTop && a.dataset.sec === cur.dataset.sec));
      const allLink = nav.querySelector(`.nav-item[href="#/gallery/${currentLib}"]`);
      if (allLink) allLink.classList.toggle('active', atTop);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    spy = () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); spy = null; };
    onScroll();
  }

  // ------------------------------------------------------------ one example
  // Top to bottom:
  //   header   breadcrumbs, title, outcome, the one-line verdict
  //   panels   original | ElicitJS, each: head / intro / chart / code. The
  //            ElicitJS panel has one tab per view (the recreation first, then
  //            each interface); its intro is the view's title, question and
  //            gesture, so you read what is asked before you answer it.
  //   details  what is missing and why (the example), and how the active
  //            interface works plus its live getData() (the view).
  async function pageEntry(id) {
    const e = byId[id];
    if (!e) { main.append(h('h1', {}, 'Not found'), h('p', {}, id)); return; }
    const s = statusOf(e);
    const libList = all.filter((x) => x.lib === e.lib);
    const idx = libList.indexOf(e);
    const prev = libList[idx - 1], next = libList[idx + 1];
    main.classList.add('wide');

    main.append(h('header', { class: 'ex-head' },
      h('div', { class: 'crumbs' },
        h('a', { href: `#/gallery/${e.lib}` }, LIB[e.lib]), h('span', { class: 'sep' }, '/'),
        h('a', { href: `#/gallery/${e.lib}/${slug(e.section)}` }, e.section)),
      h('div', { class: 'ex-titlerow' },
        h('h1', {}, e.title), badge(e),
        h('div', { class: 'pager-btns' },
          prev ? h('a', { class: 'btn', href: `#/${prev.id}`, title: prev.title }, '← Previous') : h('span', { class: 'btn disabled' }, '← Previous'),
          next ? h('a', { class: 'btn', href: `#/${next.id}`, title: next.title }, 'Next →') : h('span', { class: 'btn disabled' }, 'Next →'))),
      e.verdict ? h('p', { class: 'ex-verdict', html: md(e.verdict) }) : null));

    // ---- panels
    const cmp = h('div', { class: 'compare' });
    const origHost = h('div', { class: 'chart-host' });
    const origCode = e.lib === 'vl'
      ? codeView(JSON.stringify(window.VL_SPECS[e.ref], null, 2), { lang: 'json', title: 'Vega-Lite spec' })
      : window.PLOT_NOTEBOOKS[e.ref] ? codeView(window.PLOT_NOTEBOOKS[e.ref].code, { title: 'Plot code' }) : h('div');
    const origIntro = h('div', { class: 'intro' });
    if (e.catalog.description) {
      const d = h('p', { class: 'intro-desc', title: 'Click to expand', html: md(e.catalog.description) });
      d.addEventListener('click', () => d.classList.toggle('open'));
      origIntro.append(d);
    }
    cmp.append(h('section', { class: 'panel' },
      h('div', { class: 'panel-head' },
        h('span', { class: 'panel-title' }, 'Original'), h('span', { class: 'panel-sub' }, LIB[e.lib]),
        h('a', { class: 'panel-link', href: e.url, target: '_blank', rel: 'noopener' }, 'Open in gallery ↗')),
      origIntro, origHost, origCode));
    const rightPanel = h('section', { class: 'panel' });
    cmp.append(rightPanel);
    main.append(cmp);

    const origBlock = { id: `${id}:original`, kind: 'original', state: 'pending' };
    blocks.push(origBlock);
    const origP = (e.lib === 'vl' ? renderVl(e.ref, origHost) : renderPlot(e.ref, origHost)).then((r) => {
      origBlock.state = r.error ? 'error' : 'ok'; origBlock.error = r.error;
      if (r.error && e.thumbnail) origHost.append(h('img', { src: e.thumbnail, alt: e.title, class: 'thumb' }));
    });

    // ---- details: the example (left) and the active view (right)
    const details = h('section', { class: 'notes' });
    const about = h('div', { class: 'note-col' }, h('h3', { class: 'note-h' }, s === 'none' ? 'Why ElicitJS can’t draw it' : 'How the recreation differs'));
    const facts = h('dl', { class: 'facts' });
    if ((e.needs || []).length) facts.append(h('dt', {}, s === 'none' ? 'Needs' : 'Missing'), h('dd', {}, ...e.needs.map(featureChip)));
    if ((e.prep || []).length) facts.append(h('dt', {}, 'Computed outside the spec'), h('dd', {}, ...e.prep.map(featureChip)));
    if (facts.childNodes.length) about.append(facts);
    if ((e.gaps || []).length) about.append(h('div', { class: 'note-sub' }, 'Differences from the original'), h('ul', { class: 'gap-list' }, ...e.gaps.map((g) => h('li', { html: md(g) }))));
    if (s !== 'todo' && !(e.interfaces || []).length && e.alternative) about.append(h('div', { class: 'note-sub' }, 'What ElicitJS can ask instead'), h('p', { class: 'small', html: md(e.alternative) }));
    if (s === 'todo') about.append(h('p', { class: 'muted' }, 'This example has not been analysed yet.'));
    else if (about.childNodes.length === 1) about.append(h('p', { class: 'muted small' }, 'No notable differences: the recreation matches the original.'));
    details.append(about);
    const viewCol = h('div', { class: 'note-col note-view' });

    const rec = G.entries[id] && G.entries[id].recreation;
    const ifs = e.interfaces || [];
    const views = [];
    if (rec) views.push({ key: 'rec', label: 'Recreation', code: rec.code, rec: true });
    ifs.forEach((iface, i) => views.push({ key: `iface-${i}`, label: iface.title || `Interface ${i + 1}`, code: iface.code, iface, i }));

    const runs = [];
    if (!views.length) {
      rightPanel.append(h('div', { class: 'panel-head' }, h('span', { class: 'panel-title' }, 'ElicitJS'),
        h('span', { class: 'panel-sub' }, s === 'todo' ? 'not yet analysed' : 'not supported')),
      h('div', { class: s === 'todo' ? 'placeholder' : 'placeholder none' },
        s === 'todo' ? 'This example has not been analysed yet.' : h('span', {}, h('b', {}, 'No ElicitJS recreation. '), 'The notes below say why.')));
    } else {
      details.append(viewCol);
      const tabs = h('div', { class: 'tabs', role: 'tablist' });
      const intros = h('div', { class: 'intro-stack' });
      const panes = h('div', { class: 'panes' });
      const codeArea = h('div', { class: 'code-area' });
      rightPanel.append(h('div', { class: 'panel-head tabs-head' }, h('span', { class: 'panel-title' }, 'ElicitJS'), tabs), intros, panes, codeArea);
      const select = (k) => views.forEach((v, j) => {
        v.tab.classList.toggle('on', j === k); v.tab.setAttribute('aria-selected', j === k ? 'true' : 'false');
        v.intro.hidden = v.pane.hidden = v.note.hidden = v.codeEl.hidden = j !== k;
      });
      views.forEach((v, k) => {
        if (k === 1 && views[0].rec) tabs.append(h('span', { class: 'tab-sep', 'aria-hidden': 'true' }));
        v.tab = h('button', {
          class: 'tab', role: 'tab', type: 'button', 'data-view': v.rec ? 'rec' : 'iface',
          'data-iface': v.iface ? v.i : null, onclick: () => select(k),
        }, v.label);
        tabs.append(v.tab);

        // above the chart: what this view is, and what to do
        v.intro = h('div', { class: 'intro' });
        if (v.rec) {
          v.intro.append(h('div', { class: 'intro-title' }, 'Recreation'),
            h('p', { class: 'intro-text' }, 'The original chart drawn with ordinary ElicitJS marks.' +
              (ifs.length ? ` The ${ifs.length === 1 ? 'next tab turns' : `other ${ifs.length} tabs turn`} it into a question you answer by editing the chart.` : '')));
        } else {
          const f = v.iface;
          v.intro.append(h('div', { class: 'intro-title' }, f.title || 'Interface', h('span', { class: 'intro-count' }, `Interface ${v.i + 1} of ${ifs.length}`)));
          if (f.question) v.intro.append(h('p', { class: 'question' }, h('span', { class: 'qmark' }, 'Q'), h('span', { html: md(f.question) })));
          if (f.try) v.intro.append(h('p', { class: 'try', html: '<b>Try</b> ' + md(f.try) }));
        }
        intros.append(v.intro);

        const host = h('div', { class: 'chart-host' });
        v.pane = h('div', { class: 'pane', role: 'tabpanel' }, host);
        panes.append(v.pane);
        v.codeEl = codeView(v.code, { title: 'ElicitJS spec' });
        codeArea.append(v.codeEl);

        // below everything: how it works, and what it returns
        v.note = h('div', { class: 'note-pane' });
        const dataSlot = h('div', { class: 'data-slot' });
        if (v.rec) {
          v.note.append(h('h3', { class: 'note-h' }, ifs.length ? 'Questions this chart can ask' : 'Interfaces'));
          if (ifs.length) {
            v.note.append(h('ol', { class: 'iface-list' }, ...ifs.map((f, i) => h('li', {},
              h('button', { type: 'button', class: 'linklike', onclick: () => select(views.findIndex((x) => x.iface === f)) }, f.title || `Interface ${i + 1}`),
              f.question ? h('div', { class: 'small muted', html: md(f.question) }) : null))));
          } else {
            v.note.append(h('p', { class: 'muted small' }, 'No elicitation interface for this example.'));
          }
        } else {
          const f = v.iface;
          v.note.append(h('h3', { class: 'note-h' }, 'How it works'));
          if (f.why) v.note.append(h('div', { class: 'why', html: md(f.why) }));
          if ((f.uses || []).length) v.note.append(h('div', { class: 'uses' }, h('b', {}, 'Uses '), ...f.uses.map((u) => h('code', {}, u))));
          v.note.append(dataSlot);
        }
        viewCol.append(v.note);

        const blk = v.rec
          ? { id: `${id}:recreation`, kind: 'recreation', state: 'pending' }
          : { id: `${id}:iface:${v.i}`, kind: 'interface', state: 'pending', title: v.iface.title };
        blocks.push(blk);
        const run = () => {
          host.innerHTML = ''; dataSlot.innerHTML = '';
          return runElicit(v.code, host).then((r) => {
            Object.assign(blk, { state: r.error ? 'error' : 'ok', error: r.error, warnings: r.warnings, chart: r.chart });
            if (r.warnings.length) host.append(h('div', { class: 'warn' }, r.warnings.join('\n')));
            if (!v.rec && r.chart && r.chart.getData) dataSlot.append(dataPanel(r.chart));
          });
        };
        if (!v.rec) v.pane.append(h('div', { class: 'pane-foot' }, h('button', { class: 'reset', type: 'button', onclick: run }, '↺ Reset')));
        blk.promise = run();
        runs.push(blk.promise);
      });
      select(0);
    }
    main.append(h('h2', { class: 'details-title' }, 'Details'), details);
    await Promise.all([origP, ...runs]);
  }

  function pageAnalysis() {
    const A = window.GALLERY_TEXT || {};
    main.append(h('header', { class: 'page-head' },
      h('div', { class: 'eyebrow' }, 'Outcome analysis'),
      h('h1', {}, 'What can be created, what can’t, and why'),
      A.analysisLead ? h('p', { class: 'lead', html: md(A.analysisLead) }) : null));
    const cards = h('div', { class: 'cards' });
    for (const lib of ['vl', 'plot']) {
      const list = all.filter((e) => e.lib === lib); const c = counts(list);
      cards.append(h('div', { class: 'card' }, h('h3', {}, LIB[lib]), statBar(list),
        h('p', { class: 'muted' }, `${c.full} recreated · ${c.partial} partly · ${c.none} not supported${c.todo ? ` · ${c.todo} pending` : ''} of ${list.length}`)));
    }
    main.append(cards, legendRow());
    if (A.analysisBody) main.append(h('section', { class: 'prose', html: A.analysisBody }));

    // Missing features, ranked by how many examples each would unlock.
    const tally = {};
    for (const e of all) {
      const s = statusOf(e);
      for (const k of e.needs || []) {
        tally[k] ||= { none: [], partial: [] };
        if (s === 'none') tally[k].none.push(e); else tally[k].partial.push(e);
      }
    }
    const ranked = Object.entries(tally).sort((a, b) => (b[1].none.length * 2 + b[1].partial.length) - (a[1].none.length * 2 + a[1].partial.length));
    main.append(h('h2', {}, 'Missing features, ranked'),
      h('p', { class: 'muted' }, 'How many examples each missing capability blocks outright, and how many it would make more faithful.'));
    const ft = h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, h('th', {}, 'Feature'), h('th', {}, 'Blocks'), h('th', {}, 'Degrades'), h('th', {}, 'What it is'))));
    const tb = h('tbody');
    for (const [k, v] of ranked) {
      const f = G.features[k];
      tb.append(h('tr', {}, h('td', {}, h('b', {}, f ? f.label : k)),
        h('td', { class: 'num' }, v.none.length), h('td', { class: 'num' }, v.partial.length),
        h('td', { class: 'muted', html: md(f ? f.description : '') })));
    }
    ft.append(tb); main.append(ft);

    // Prep tally
    const prep = {};
    for (const e of all) for (const k of e.prep || []) (prep[k] ||= []).push(e);
    if (Object.keys(prep).length) {
      main.append(h('h2', {}, 'Transforms done outside the spec'),
        h('p', { class: 'muted', html: md('ElicitJS has no transform layer: a recreation computes these with plain JavaScript (usually `d3`) before handing rows to `Elicit`. That is faithful for display, but an elicitation writes to the rows you hand it — so a derived value is only editable when its inverse is meaningful (see the analysis above).') }));
      main.append(h('div', { class: 'chips' }, ...Object.entries(prep).sort((a, b) => b[1].length - a[1].length)
        .map(([k, v]) => h('span', { class: 'chip' }, `${G.features[k] ? G.features[k].label : k} · ${v.length}`))));
    }

    // Full list
    for (const lib of ['vl', 'plot']) {
      main.append(h('h2', {}, `${LIB[lib]}: every example`));
      const t = h('table', { class: 'tbl list' }, h('thead', {}, h('tr', {}, h('th', {}, 'Example'), h('th', {}, 'Outcome'), h('th', {}, 'Ifaces'), h('th', {}, 'Why'))));
      const b = h('tbody');
      for (const e of all.filter((x) => x.lib === lib)) {
        b.append(h('tr', {},
          h('td', {}, h('a', { href: `#/${e.id}` }, e.title), h('div', { class: 'muted small' }, e.section)),
          h('td', {}, badge(e)),
          h('td', { class: 'num' }, (e.interfaces || []).length || ''),
          h('td', {}, h('div', { class: 'small', html: md(e.verdict || '') }), (e.needs || []).length ? h('div', {}, ...e.needs.map(featureChip)) : null)));
      }
      t.append(b); main.append(t);
    }
  }

  async function pageBeyond() {
    const A = window.GALLERY_TEXT || {};
    main.append(h('header', { class: 'page-head' },
      h('div', { class: 'eyebrow' }, 'Beyond the two libraries'),
      h('h1', {}, 'Things only an elicitation grammar can do'),
      A.beyondLead ? h('p', { class: 'lead', html: md(A.beyondLead) }) : null));
    if (A.beyondBody) main.append(h('section', { class: 'prose', html: A.beyondBody }));
    const list = G.beyondList;
    const toc = h('ol', { class: 'toc' }, ...list.map((b, i) => h('li', {}, h('a', { href: `#beyond-${i}`, onclick: (ev) => { ev.preventDefault(); document.getElementById(`beyond-${i}`).scrollIntoView({ behavior: 'smooth' }); } }, b.title))));
    main.append(toc);
    const ps = [];
    list.forEach((b, i) => {
      const sec = h('section', { class: 'beyond', id: `beyond-${i}` },
        h('h2', {}, b.title),
        b.question ? h('p', { class: 'question' }, h('span', { class: 'qmark' }, 'Q'), b.question) : null);
      const row = h('div', { class: 'iface' });
      const host = h('div', { class: 'chart-host' });
      const left = h('div', { class: 'col' }, host);
      if (b.try) left.append(h('p', { class: 'try', html: '<b>Try:</b> ' + md(b.try) }));
      const right = h('div', { class: 'col' });
      if (b.why) right.append(h('div', { class: 'why', html: md(b.why) }));
      if (b.whyNot) right.append(h('div', { class: 'whynot', html: '<b>Why Vega-Lite and Plot can’t:</b> ' + md(b.whyNot) }));
      row.append(left, right); sec.append(row);
      const blk = { id: `beyond:${i}`, kind: 'interface', state: 'pending', title: b.title };
      blocks.push(blk);
      const run = () => {
        host.innerHTML = ''; right.querySelectorAll('.data').forEach((d) => d.remove());
        return runElicit(b.code, host).then((r) => {
          Object.assign(blk, { state: r.error ? 'error' : 'ok', error: r.error, warnings: r.warnings, chart: r.chart });
          if (r.warnings.length) host.append(h('div', { class: 'warn' }, r.warnings.join('\n')));
          if (r.chart && r.chart.getData) right.append(dataPanel(r.chart));
        });
      };
      left.append(h('button', { class: 'reset', type: 'button', onclick: run }, 'Reset'));
      ps.push(run());
      sec.append(codeView(b.code, { title: 'ElicitJS spec' }));
      main.append(sec);
    });
    await Promise.all(ps);
  }

  // ------------------------------------------------------------ router
  let routeToken = 0;
  let shown = null; // the route currently rendered
  async function route() {
    const token = ++routeToken;
    const r = parseRoute();
    const lib = r.page === 'gallery' ? r.lib : r.page === 'entry' && byId[r.id] ? byId[r.id].lib : null;
    if (lib) { currentLib = lib; store.set('gallery-lib', lib); }
    buildNav(r);
    updateTopbar(r);
    document.body.classList.remove('nav-open');
    // Within one library's gallery, a section link only scrolls.
    if (shown && shown.page === 'gallery' && r.page === 'gallery' && shown.lib === r.lib) {
      shown = r; window.GALLERY_STATE.route = location.hash;
      scrollToSection(r.section);
      return;
    }
    shown = r;
    disposeRuntimes();
    if (spy) spy();
    blocks.length = 0;
    window.GALLERY_STATE = { route: location.hash, done: false, blocks };
    main.innerHTML = '';
    main.className = '';
    window.scrollTo(0, 0);
    try {
      if (r.page === 'overview') pageOverview();
      else if (r.page === 'analysis') pageAnalysis();
      else if (r.page === 'beyond') await pageBeyond();
      else if (r.page === 'gallery') pageGallery(r);
      else await pageEntry(r.id);
    } catch (err) {
      main.append(h('div', { class: 'err' }, String(err && err.stack || err)));
    }
    if (token === routeToken) window.GALLERY_STATE.done = true;
    document.title = (main.querySelector('h1')?.firstChild?.textContent || 'Gallery') + ' · ElicitJS gallery study';
  }
  window.addEventListener('hashchange', route);
  $('#menu')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));

  route();
})();
