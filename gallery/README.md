# ElicitJS gallery study

Every example in the [Vega-Lite gallery](https://vega.github.io/vega-lite/examples/)
and the [Observable Plot gallery](https://observablehq.com/@observablehq/plot-gallery),
set beside its ElicitJS recreation where one is possible, with live elicitation
interfaces for each chart type. Examples ElicitJS can't draw say why, and which
missing features would unlock them.

- **`index.html`** — the site. Open it directly in a browser (it works from
  `file://`) or serve the folder with any static server. It needs a network
  connection for the example datasets (fetched from jsDelivr and Observable's
  file CDN).
- **`analysis/ANALYSIS.md`** — the outcome analysis as a standalone document:
  what can be created, what can't, why, and the missing features ranked.
- **`analysis/ANALYSIS.v1.md`** and **`tools/LIBRARY-FINDINGS.v1.md`** — the
  first version of the analysis and of the library findings, kept for
  comparison. The current `ANALYSIS.md` ends with "Changes since the first
  study", and `tools/LIBRARY-FINDINGS.md` records how each finding was resolved.
- **`analysis/ROUND2.md`** — the second-round review: what blocks each chart
  (multi-view, derived geometry or something else), how each recreation and
  interface relates to its original, the elicitation strategies used, the most
  unique interfaces, and suggested improvements. `analysis/ROUND2-interfaces.csv`
  holds the per-interface judgements.

## What's in the folder

| Path | What |
|---|---|
| `index.html`, `assets/` | The single-page site (no build step). |
| `vendor/` | Two bundled scripts: ElicitJS + d3 + topojson-client, and Vega/Vega-Lite/vega-embed + Plot + the Observable runtime for the originals. |
| `originals/` | The upstream specs and notebooks, compiled to plain scripts. |
| `entries/` | One file per gallery section: each example's recreation, interfaces and verdict. `features.js` is the feature-gap vocabulary; `beyond.js` the showcase. |
| `analysis/` | The analysis documents (above). `ANALYSIS.md` is generated; `ROUND2.md` is written by hand. |
| `tools/` | Build and check scripts (below). |

## Rebuilding

```sh
cd tools && npm install
node build-originals.mjs   # re-fetch both galleries into originals/
node build-vendor.mjs      # rebundle vendor/ (rebuild after an ElicitJS change)
node check.mjs --all       # render every entry in Chromium; fail on errors/warnings
node build-analysis.mjs    # regenerate analysis/ANALYSIS.md from the entries
```

`build-vendor.mjs` builds ElicitJS from the sibling `elicitjs` repository's
source, and `check.mjs` uses that repository's Playwright install.
`AUTHORING.md` documents the entry format.
