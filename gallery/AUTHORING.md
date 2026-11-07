# Authoring gallery entries

This folder is a standalone static site that walks every example in the
[Vega-Lite gallery](https://vega.github.io/vega-lite/examples/) and the
[Observable Plot gallery](https://observablehq.com/@observablehq/plot-gallery),
and for each one shows:

1. the **original**, rendered live (Vega-Lite via `vega-embed`; Plot by running
   the original notebook in the Observable runtime), with its code;
2. the **ElicitJS recreation** of the same chart, if one is possible, with its spec;
3. **elicitation interfaces** — one or more tabs, each a live ElicitJS chart that
   asks the reader a question using that chart type, with the spec lines that make
   the elicitation work highlighted;
4. for examples ElicitJS can't build: **why**, and which missing features would
   unlock them. The analysis page aggregates these.

The site is meant to be shared. **No identifying information** anywhere in an
entry: no personal names, emails, institutions, local file paths, or usernames.

Open it with `open index.html` (it works from `file://`) or any static server.

## Where things are

| Path | What |
|---|---|
| `entries/<your-file>.js` | **The only file you write.** One `GALLERY.add({...})` per example. |
| `entries/features.js` | The feature-gap vocabulary (`needs` / `prep` keys). Read it. |
| `tools/.cache/vl/<name>.vl.json` | Each Vega-Lite example's spec. |
| `tools/.cache/plot/<slug>.js` | Each Plot notebook's source (the Plot code + its data cells). |
| `originals/catalog.js` | Every example: `id`, `ref`, `section`, `title`. |
| `tools/check.mjs` | Headless checker + screenshots. |
| `../../elicitjs/CLAUDE.md` | The library's design rules. Read the invariants. |
| `../../elicitjs/src/index.d.ts`, `src/types.d.ts`, `src/vocabulary.js` | The public API and every option each factory accepts. |
| `../app/**/_examples/*.example.txt` | **287 working docs examples** — the best idiom corpus. Copy patterns from here. |
| `../app/**/page.mdx` | The docs prose for each mark/edit/constraint. |

Don't edit anything outside your entry file (not `assets/`, not `index.html`,
not the library). If the site itself has a bug, or the library does, say so in
your final report.

## The entry format

```js
GALLERY.add({
  id: 'vl-bar',                 // from originals/catalog.js — must match exactly
  status: 'full',               // 'full' | 'partial' | 'none'
  verdict: 'One sentence: what the recreation does / why it is impossible.',
  needs: ['facet'],             // feature keys ElicitJS is MISSING (see features.js)
  prep: ['prep-aggregate'],     // transforms computed in JS before Elicit
  gaps: ['Free-text bullets: each concrete difference from the original.'],
  recreation: { code: `...` },  // omit for 'none'
  interfaces: [ { title, question, try, why, uses, code } ],  // omit for 'none'
  alternative: 'Optional, for none: the closest thing ElicitJS can ask instead.',
});
```

### Status

- **`full`** — the chart's form and encodings are reproduced with ordinary
  ElicitJS marks. Data may be loaded, filtered, aggregated or binned in plain JS
  first (list each in `prep`). Cosmetic differences are fine (fonts, exact
  palette, tick density, axis titles) — mention notable ones in `gaps`.
- **`partial`** — the core form is reproduced, but something a reader would
  notice is missing: labels, a dual axis, a gradient, the interaction the
  example is *about*, a normalized stack, etc. List what's missing in `needs`
  (keys) and `gaps` (prose).
- **`none`** — it can't be built from the existing marks with minimal
  customization. Writing a new mark with the `authoring` kit does **not** count as
  minimal. List the blocking features in `needs` and explain in `verdict`/`gaps`.

Be honest and specific. The analysis is only useful if a `full` really is full.
If a feature is missing from `features.js`, prefer the closest existing key; if
none fits, add one at the top of your entry file with
`GALLERY.defineFeatures({ 'key': { label, description } })` and mention it in
your report.

### Code

`code` is a string of JavaScript that is **displayed verbatim and executed**. It
runs as the body of an async function, so `await` works. In scope:

- every mark (`bar`, `barY`, `point`, `line`, `area`, `rect`, `text`, `rule`,
  `tick`, `arc`, `donut`, `waffle`, `dotStack`, `composite`, `face`, `link`, `geo*`,
  …), every element (`axisX`, `gridY`, `legendColor`, …), every constraint
  (`clamp`, `maintainSum`, …, and `constraints.custom`), every universal edit
  (`move`, `slide`, `create`, `remove`, `brushRect`, `select`, …) bare, and the
  scoped edits under `edit.*` (`edit.line.sweep()`, `edit.stack.cut()`, …);
- `Elicit`, `edit`, `when`, `guides`, `widgets`, `elements`, `format`, `themes`,
  `authoring`, `d3`, and `topojson` (topojson-client: `topojson.feature(topo, topo.objects.states)` turns TopoJSON into GeoJSON);
- `mount(el)` — call it with what `Elicit(...)` returns. Mount exactly one chart.
- data loaders (all cached, return fresh copies):
  - `await vegaData('cars.json')` — a Vega dataset, by the file name the spec uses.
  - `await plotData('penguins')` — an Observable sample dataset (`aapl`,
    `alphabet`, `cars`, `diamonds`, `industries`, `olympians`, `penguins`, …).
  - `await plotData('observablehq__plot-stacked-dots', 'us-congress-2023.csv')`
    — a notebook's own file attachment, by notebook slug and file name.

Same conventions as the docs examples: `mount(Elicit({ width, height, margins,
data, schema, marks, … }))`. Keep width ≤ 480 so the two columns sit side by side
(match the original's aspect ratio roughly).

**Highlighting.** End a line with `//! short note` to highlight it as part of
what makes the elicitation work. The marker and note are stripped from the copied
code and the note is shown beside the line. Highlight the edit(s), the
constraint(s), `lock`, an `open` domain, a guide — the lines a reader would change
to change the *question*. Don't highlight boilerplate. 1–6 highlights per
interface; none in a plain recreation unless something there is essential.

Note the note text is inline markdown: wrap identifiers in backticks, and since
`code` is a template literal, escape backticks inside it as `` \` ``.

### Interfaces

Every `full` or `partial` entry gets **1–3 interfaces** (more only when the chart
genuinely supports more distinct questions). Each is a different *way to ask*:

```js
{
  title: 'Drag each bar',                        // tab label, 2–4 words
  question: 'How many cars per origin will be electric in 2030?',
  try: 'Drag a bar up or down.',                  // the gesture, imperative
  why: 'Putting `move()` on `y` makes ... (1–3 sentences: the mechanism)',
  uses: ['move()', 'clamp()'],                    // the vocabulary it relies on
  code: `mount(Elicit({ ... }))`,
}
```

- **Ground the question in the example's own data/domain** (cars, weather, stocks,
  penguins …) and make it something a survey could really ask: a forecast, an
  estimate, a distribution, a ranking, an allocation, a region, a trend.
- **Seed the data so the interface starts in a meaningful state**: a neutral prior,
  the observed data with the part to predict missing or flattened, or the real
  data the reader corrects. Use `lock: 'seed'` when given rows must stay fixed.
- **Vary the edits.** For a family of similar examples (all the bar charts), don't
  repeat the same `move()` interface ten times: spread the vocabulary — `move`,
  `slide`, `create`/`remove`, `brushSpan`/`brushRect`, `edit.stack.cut/edge/merge`,
  `edit.line.sweep/draw/anchor`, `edit.trend.*`, `edit.scale.categories`,
  `edit.legend.*`, `select`, `rank`, `cycle`, `toggle`, `editText`, constraints
  (`maintainSum`, `clamp`, `snap`, `ordering`, `monotonic`, `count`, `unique`,
  `spacing`), `guides.*`, stages, `lock`, `when` modifiers, widgets. Each
  interface should show a capability worth seeing.
- A **widget** (`widgets.histogram`, `widgets.allocation`, …) is fine when it is the
  natural instrument, but prefer an explicit spec when the point is to show which
  lines do the work.
- `why` follows the docs style (`../STYLE.md`): terse, active voice, second person,
  British spelling (colour, behaviour), backtick every identifier.

### Data volume

Recreate with the real dataset where it renders reasonably (a few thousand marks is
fine). An *interface* is a question a person answers, so keep its data small: a
handful to a few dozen rows to edit. Dense recreations are fine; list `dense-data`
in `needs` only if density stops the elicitation from making sense.

## Checking your work (required)

```sh
cd elicitjs-docs/gallery
node tools/check.mjs --file entries/<your-file>.js --shot <your-scratch-dir>/shots
node tools/check.mjs vl-bar vl-bar_aggregate --shot <dir>      # specific ids
```

For every recreation and interface it reports errors, `[elicit]` warnings, how
many SVG nodes were drawn, and a smoke test: whether a real drag on a mark, and a
click in the plot, changed `getData()`. It exits non-zero on any error, warning or
empty chart. **All three must be clean.** A warning means the spec is wrong (or the
guard has a false positive — then say so in your report); never silence warnings.

The smoke test is a hint: it drags the first pointer-active mark it finds. If it
says "no change" for an interface whose gesture is a sweep, a click on empty space,
a legend click, a keyboard edit, etc., that can be fine — but **verify** such
gestures: write a throwaway Playwright script in your scratch dir (require
`playwright` from `../../elicitjs/node_modules`) that opens
`file://…/gallery/index.html#/<id>`, clicks the tab, performs the gesture and reads
`window.GALLERY_STATE.blocks[i].chart.getData()`. An interface that doesn't
actually elicit anything is worse than none.

**Look at the screenshots** (`<id>.compare.png`, `<id>.iface-<n>.png`) with the
Read tool, at least for every recreation and a good sample of interfaces. Compare
the recreation to the original side by side. Fix overlapping labels, clipped
marks, empty margins, wrong orientation, unreadable colours.

## Final report

Reply with: counts by status; every library bug or surprising behaviour you hit
(with a minimal spec), any warning you believe is a false positive; any feature key
you added; any site bug. Keep it factual and short.
