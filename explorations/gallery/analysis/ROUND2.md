# Gallery study, round 2: what can't be drawn, and how the interfaces relate to the originals

Scope: the 409 entries in `elicitjs-docs/gallery/entries/*.js` (189 Vega-Lite, 220 Plot), with 257 full, 93 partial, 59 none and 435 interfaces. Part 1 is computed from each entry's `needs` keys. Part 2 comes from reading every recreation and interface against the original spec, one file group per reviewer, under a fixed rubric. The per-interface results are in `ROUND2-interfaces.csv`, next to this file. Nothing was re-rendered; the judgements are from code.

---

## Part 1 — Why charts can't be drawn

Every `needs` key falls into one of four families:

| Family | Keys |
|---|---|
| **MV**: facet / multi-view | `facet`, `concat` |
| **DP**: derived geometry / data processing | `density-2d`, `delaunay`, `hexbin`, `raster`, `dodge`, `tree`, `horizon`, `stack-offset`, `geo-transform`, `interval-band`, `boxplot` |
| **INT**: view interaction | `selection`, `input-widgets`, `href`, `zoom` (linked domains) |
| **RENDER**: marks / chrome | `axis-custom`, `image-mark`, `background-image`, `trail-mark`, `vector-mark`, `variable-paint-line`, `curve-types`, `legend-custom`, `color-scheme`, `text-layout`, `dual-axis`, `band-offset`, `projection`, `clip`, `topojson`, `radius-channel`, `scale-discretize`, `dense-data` |

### Not supported (59)

| Primary reason (MV > DP > INT > RENDER) | Count | Share |
|---|---:|---:|
| Facet / multi-view | 35 | 59% |
| Derived geometry | 24 | 41% |
| **Anything else** | **0** | **0%** |

**Every example that can't be drawn is either multi-view or derived geometry.** No example is blocked only by interaction, chrome or a missing mark. Where INT or RENDER keys appear (selection ×10, projection ×7, clip ×4, topojson ×4…), they always sit beside an MV or DP key.

The 24 derived-geometry cases:

| Kind | Count |
|---|---:|
| Contours / 2-D density | 15 |
| Voronoi | 5 |
| Dodge | 2 |
| Hexbin | 1 |
| Projected raster | 1 |

### Partial (93)

| Primary reason | Count | Share |
|---|---:|---:|
| Facet / multi-view (mostly flattened facets) | 27 | 29% |
| Derived geometry (hexbin, tree, horizon, stack offset, raster, dodge) | 13 | 14% |
| **View interaction** (selection 16, bound inputs 21, href 1) | **33** | **35%** |
| **Rendering / chrome** (axis ×5, image ×4, varying stroke ×3, band offset ×2, trail ×2, dual axis ×2, curve types ×2, …) | **20** | **22%** |

So **57% of partials (53 of 93) are held back by something that is neither multi-view nor data processing.**

### Combined (152 not fully drawable)

| | Count | of 152 | of 409 |
|---|---:|---:|---:|
| MV-related | 62 | 41% | 15% |
| DP-related (no MV) | 37 | 24% | 9% |
| **Neither** | **53** | **35%** | **13%** |

### Your Voronoi point holds, and goes further

`guides.custom(ctx => nodes)` receives the live `state` and `scales` and may return filled `path` nodes. The entries rejected Voronoi and filled contours because "`line`/`path` are always unfilled and `geoPolygon` needs a projection, which would drop the axes". Neither objection applies to a guide: it keeps the axes, it can fill, and it redraws when points are dragged, so a Voronoi or density layer becomes **live feedback** on an elicited scatter.

My estimate, unverified because nothing was built: about **13–14 of the 24 derived-geometry blockers** could be drawn today, at least as partial.
- Planar contours and density (10): the function contours, filled volcano, blurred, IGRF, Olympians, point-cloud, one-dimensional, non-overlapping, and density-stroke.
- The Voronoi scatterplot (1).
- The Voronoi labels, as text at cell centroids plus rules (1).
- Text dodge, laid out in JS exactly like `plot-dodge-cars`, which is graded partial (1).
- The Olympians hexbin, as `shape` hexagons exactly like `plot-centroid-hexbin`, which is graded partial (1).

The projected cases (GeoTIFF, Walmart, sphere clip, county and capital Voronoi) would also need projection access inside a guide. The two slider-driven densities would still be partial.

### Grading inconsistencies (worth fixing before the numbers are reported)

- **Faceting is graded two ways.** The Vega-Lite trellis examples are `none`, while the Plot facet examples are flattened onto one band axis and graded `partial` (`plot-grouped-bar-chart`, `plot-faceted-lollipop`, `plot-barley-trellis` …). `vl-trellis_bar` and `vl-trellis_barley` could be flattened the same way.
- **Dodge and hexbin are graded two ways.** `plot-text-dodge` and `plot-olympians-hexbin` are `none`; `plot-dodge-cars`, `plot-hexbin-map` and `plot-centroid-hexbin` are `partial`, using the same JS-prep technique.
- **Four `full` entries miss the thing the example is about** and read as partial:
  - `plot-stack-offset`: the offset selector is fixed to wiggle;
  - `plot-sparse-line`: only the first chart is drawn;
  - `plot-ordinal-scale-interval`: no checkbox;
  - `plot-tips-paired-channels`: the mirrored chart is missing.
- **25 `full` entries use an emulated technique.** The study's rule allows prep, but readers may not expect it:
  - hand-computed area stacks (3 VL stacked-area examples, `plot-difference-chart`);
  - jitter;
  - invisible `select()` marks to fake hover (3);
  - rotated labels drawn as a text mark;
  - arrows, vectors and spikes rebuilt from `shape` / `link` / triangle polygons (5).
- **12 `partial` entries were judged only cosmetic.** Examples: the three tree layouts, `plot-ggplot2-style-axes`, and the two "unselected doesn't fade" selections. They are borderline full.

---

## Part 2 — Do the recreations and interfaces match the originals?

### Recreation fidelity (350 drawn entries)

| | exact | cosmetic | emulated | flattened | reduced |
|---|---:|---:|---:|---:|---:|
| full (257) | 147 | 81 | 25 | – | 4 |
| partial (93) | – | 12 | 32 | 15 | 34 |

`reduced` means part of the original is missing: a layer, a panel, or the interaction the example is about. In 14 of the Vega-Lite interactive entries the missing part is the bound widget, brush or hover.

### Interface relation to the original (435 interfaces)

| Relation | Count | Share | Meaning |
|---|---:|---:|---|
| **Same mark, same encoding** | 276 | 63% | Drag or sweep the original's own mark on a channel it already encodes. |
| **Same mark, new channel** | 39 | 9% | The original's mark, but the answer is a meaning it never encoded. Mostly an area turned into a lo/hi **uncertainty band** (12), or a cell or polygon turned into a **category to cycle or toggle** (≈15). |
| **Original drawn + new answer mark (overlay)** | 57 | 13% | The chart is context; the answer is another mark on top: a rule (mean, date), `trend`/`trendBand`, a `rect` brush region, ticks on bullets, points on a line, geo pins and routes. |
| **Different chart** | 43 | 10% | The original form is not drawn; the question uses another chart type. |
| **Non-mark** (legend / axis / selection) | 18 | 4% | Answer written through a legend swatch or colour ramp (13), an axis domain (2), or the selection itself. |
| **Widget** | 2 | <1% | `widgets.likert` (self-report), `widgets.histogram`. |

**86% of interfaces keep the original chart in view** (same mark, or overlay). Encodings are fully kept in 45%, partly kept in 53%, and dropped in 3% (12 interfaces).

The "partly" share is high for a structural reason. Nearly every interface cuts the data to a handful of rows and often drops a colour, a series or a facet, as `AUTHORING.md` asks.

#### The 43 "different chart" interfaces, by substitution

1. **Distribution or count → tokens (13).** `dotStack` or `waffle` replaces the histogram, beeswarm or stacked bar:
   - `vl-histogram#1`, `vl-histogram_rel_freq`, `vl-layer_histogram_global_mean#1`;
   - `vl-isotype_grid#1`;
   - `plot-stacked-dots` (drops the men-up/women-down split that is the example's point), `plot-dodge-cars`, `plot-colored-stacked-bar-chart` (mass moves from colour to x), `plot-highlighted-bin#1`, `plot-one-dimensional-crosshair`;
   - `plot-caltrain-schedule`, `plot-horizontal-stacked-bars`, `plot-apportionment-of-seats-in-the-ep` (a streamgraph becomes 72 seat tokens on one date);
   - `plot-lebron-james-shots` (heatmap → placed point tokens).
2. **Special form → plain line, area or band (12).** The form is hard to edit, so the question falls back to the underlying series:
   - **`vl-trail_comet#0`** (comets → a dot plot of the 1931→32 change, Morris only);
   - `vl-trail_color#0/#1` (trail width → uncertainty band, GOOG only);
   - the horizon charts (`plot-unemployment-horizon-chart#0/#1`, `plot-horizon#1`) become a line or band, with a guide re-folding the answer live;
   - `plot-burndown-chart#0/#1`, `plot-faceted-areas#0`, `plot-random-walk#1` (a `trendBand` fan);
   - `vl-interactive_multi_line_tooltip#0`;
   - `vl-layer_precipitation_mean#1` (bars → a swept line).
3. **Variable-geometry composition → simple bars (8).**
   - Mosaic and marimekko become equal-width 100% stacks, losing the share on x.
   - The diverging stack becomes a plain bar.
   - The ribbon chart becomes one ranking column.
   - The variable-fill area becomes quarterly rects.
   - The log histogram and the ordinal scatter become one range bar each.
   - The lasagna becomes span bars, with the heatmap drawn only after reveal.
4. **Re-aggregated or collapsed dot plots (5).**
   - `vl-point_angle_windvector` (wedges → `needle`, projection and speed dropped);
   - `plot-temperature-amplitude` (x becomes month);
   - `plot-dot-plot` (50 states → one national row);
   - `plot-isotype-chart#1` (pictogram rows → one pictogram on a value axis);
   - `plot-tip-format` (the scatter becomes a rank column; neither axis survives).
5. **Map changed (4).**
   - `vl-geo_circle#1` and `plot-centroid-hexbin` become a lon/lat box. The hexbin's county mesh largely gives the answer away.
   - `plot-election-wind-map`: a wind-arrow map becomes a 10-state choropleth, and its "why" text overstates the match.
   - `plot-bivariate-choropleth#1`: the legend becomes a 3×3 bubble matrix. This one is deliberate and one of the best interfaces.
6. **Other (1).** `plot-small-grid-contours`: a text grid becomes a classification grid whose answer can be worked out by arithmetic.

#### Original drawn, answer on a new mark (the "fine, but note it" group, 57)

Recurring overlays:
- **`trend` / `trendBand`** over a scatter or line (8): `vl-point_2d`, `vl-point_quantile_quantile`, `vl-interactive_query_widgets`, the Simpson regressions, `plot-pointer-modes-x-y-and-xy`, `plot-line-with-moving-average`.
- **`rule` for a summary** (≈6): a mean, a median per system, the vaccine year, a date, the 2019 high.
- **`rect` brush region or span** (≈12): the scatter boxes, streamgraph months, horizon windows, pulse windows, recessions, and the "worst stretch" on the axis examples.
- **Lo/hi band added to a mean line** (5): the raw-point mean examples, `plot-psr-b1919-21#1`, `plot-stacked-area-chart#1`.
- **Ticks or points for targets and forecasts**: the bullet targets, the grouped-bar reference, candlestick OHLC forecasts, percent-change glyphs.
- **Geo pins and routes on a basemap** (8): floor plan, polar ice edge, flight route, shockwave, projection domain, choropleth pin, London box.
- **Summary points over a crowd** (4): centroids, sport means.
- **Text labels**: `plot-background-image`, naming clusters.
- **`path` sketch over an inert field**: `plot-perlin-noise`.

#### Same mark, new meaning (39): the two dominant moves

- **Area → uncertainty band.** `areaY`'s `y1`/`y2` are reused as lo/hi bounds on 12 area, density and ridge charts. It's a natural fit, though on a density (`vl-area_density#1`, `plot-density-estimation#1`) a pointwise band is a weak quantity, because neither edge integrates to 1.
- **Value → category.**
  - Heatmap and choropleth cells become a cycled or toggled category: weather words, low/mid/high, claimed or not, in-set or not.
  - Position becomes a rank (`vl-bar_aggregate_sort_by_encoding#1`, `vl-circle_custom_tick_labels#1`, `vl-layer_bar_fruit#1`).
  - Hover or paint becomes a toggle (`vl-interactive_paintbrush`, `vl-isotype_grid#0`, `vl-airport_connections`).

### How view interactions were translated (Vega-Lite Interactive sections)

- **Brush** → the answer region or span (`brushRect` / `brushSpan`), with the original highlight redrawn as feedback from the answer.
- **Hover** → a probe preview (`create({ pick: 'probe' })`), a membership toggle, a nearest-series sweep, or a draggable answer rule.
- **Legend filter or click-select** → a legend pick that writes the selected rows.
- **Sliders and search** → the subject of the question (fit a trend to the queried subset) or typed text.
- **Pan / zoom** → an axis-domain answer.
- **Not translated:** the globe rotation and size sliders, and the projection dropdown.

### Elicitation strategies (share of 435; an interface can have several)

| Strategy | Share | Typical mechanism |
|---|---:|---|
| Given + predict | 37% | `context` / `lock` rows; answer the future or the missing part |
| Direct value | 37% | `move` / `slide` a mark to a value |
| Sketch | 20% | `edit.line.sweep` / `draw`, band-edge sweeps |
| Interval / uncertainty | 19% | `brushSpan`, lo/hi bands, `follow` / `symmetric` error bars, `trendBand` |
| Constraint-shaped | 18% | `ordering`, `monotonic`, `constraints.custom` doing real work |
| Classify | 12% | `select` / `cycle` / `toggle`, legend picks |
| Allocation | 11% | `maintainSum`, `edit.stack.cut/edge/merge` |
| Feedback guide | 11% | a guide recomputed from the answer (rebased lines, live folding, greyed-out brush) |
| Tokens | 8% | `dotStack` / `waffle`, `create` / `remove` |
| Geo place / draw | 7% | `edit.geo.*` |
| Structure | 5% | network wiring, `newSeries`, open domains, category rename |
| Staged | 4% | guess → reveal → revise, best guess → range |
| Region | 4% | `brushRect` |
| Rank / model fit / text | 2% each | `rank`, `edit.trend.*`, `editText` |

By relation:
- **Same-mark** interfaces are mostly direct value with given+predict.
- **Different-chart** interfaces are led by tokens.
- **Overlay** interfaces are led by interval and region.
- **Non-mark** interfaces are almost all classify.

### Most unique interfaces

1. `vl-sequence_line_fold#0`, **Draw the derivative**: cos is hidden and you draw the slope of sin; revealing the original is the check.
2. `plot-percentogram#0`, **Move the deciles**: an equal-area constraint makes bin width set bin height. The chart's defining idea becomes the gesture.
3. `vl-ternary#0`, **Place a composition**: one 2-D drag gives three shares that sum to 1. `getData()` returns x/y, not the shares.
4. `plot-stacked-area-chart#0`, **Total first, then split**: a staged decomposition. Sweep the total, then place each inner edge, with `ordering` pushing them.
5. `plot-single-stacked-bar#0`, **Cut, then name**: an open domain plus `stack.cut` plus a legend rename. Which categories exist is part of the answer.
6. **Colour-ramp legend as the input**, for a quantity encoded only in colour:
   - `plot-warming-stripes#0`, `plot-simpsons-ratings#0`;
   - `vl-selection_heatmap#0`, `vl-rect_heatmap#0`, `plot-log-heatmap#0`.
7. `plot-delaunay-links#0`, **Link the relatives**: a clustering elicited as a network of "same species" links.
8. `plot-bivariate-choropleth#1`, **Fill the 3 × 3**: the bivariate legend becomes a joint-distribution allocation, and correlation shows as mass on the diagonal.
9. `plot-perlin-noise#0`, **Sketch a streamline**: integrate a vector field in your head.
10. `vl-selection_type_point_zorder#0`, **Hover, then commit**: the hover highlight is the tentative answer (`pick: 'probe'`).
11. `vl-selection_translate_scatterplot_drag#0`, **Zoom to your range**: the axis domain is the answer.
12. `vl-bar_aggregate_sort_by_encoding#0`: a custom repair makes `sort: "-x"` a live invariant, so the bars re-sort as you drag.
13. `plot-apportionment-of-seats-in-the-ep#0`: moving 10-seat tokens keeps 720 seats by construction.
14. `plot-mareys-trains#0`: place a new train in Marey's encoding, with `monotonic` stopping time running backwards.
15. `plot-candlestick-chart#0`: full OHLC forecasts, where two `ordering`s keep every candle valid.
16. `plot-wind-map#0`: one drag on the arrow tip sets bearing (`rotate`) and speed (`resize`).
17. `plot-finite-state-machine#0` and `plot-tree-tidy#0`: draw a Markov structure with self-loops; re-parent a class by dragging a link end.
18. `vl-stacked_area_stream#1`: `symmetric()` reproduces streamgraph centring, so one swept edge draws the whole silhouette.
19. `plot-linear-regression-simpson#1`: a line per species after the pooled one acts out Simpson's paradox.
20. `vl-interactive_multi_line_pivot_tooltip#0`: one stock is held out and drawn against the other four.

Beyond page (no original): the face glyphs, the open-vocabulary mode split, the causal diagram, the sticky-note risk matrix and the pin-plus-confidence ring are the most distinctive of its 12.

### Interfaces that don't elicit what they claim

1. **Reference rows `lock`ed instead of `context`**, so `getData()` returns them with the answer (≈9):
   - `vl-bar#1`, `vl-stacked_bar_h#0`, `vl-bar_layered_transparent#0`, `vl-circle_wilkinson_dotplot#0`, `vl-layer_scatter…#1`, `vl-layer_line_errorband_ci#0`;
   - `vl-point_href`, `vl-interactive_global_development`, `plot-radar-chart#0`.
2. **A stated total or cardinality that isn't enforced:**
   - `vl-histogram#0` ("out of 100"), `vl-circle_wilkinson_dotplot` ("exactly ten"), `vl-selection_heatmap` (18 per class), `vl-airport_connections` (19 airports);
   - `plot-prebinned-histogram#1` ("out of 40"), `plot-dot-bins` ("share"), `plot-pointer-transform` (five deletions), `vl-bar_color_disabled_scale` (a permutation).
3. **The answer is visible in the context**, so the task is reading the chart, not stating a belief:
   - `plot-facet-wrap#0`, `plot-datawrapper-style-date-axis#0`, `plot-major-and-minor-axis-ticks#0`, `plot-crosshairx#0`;
   - `plot-centroid-hexbin#0`, `plot-tips-additional-channels#0` (tips name the sport);
   - `vl-param_search_input#0`, `vl-interactive_index_chart#0`, `plot-small-grid-contours#0`.
4. **The question refers to something not drawn:**
   - `vl-bar_binned_data`, `vl-histogram_log` ("the values above");
   - `plot-radar-chart-faceted#0` ("the eleven cars shown"; none shown);
   - `plot-image-medals#0` (unlabelled dots);
   - the floor plan's "kitchen";
   - `plot-mandelbrot-set#0` (axes off);
   - `plot-spike#0` (no length scale);
   - `vl-lookup#0` (fictional people).
5. **The chart changed without saying so:**
   - `plot-area-chart#0/#1` switch close → volume;
   - log y axes appear in `vl-interactive_line_hover` and `vl-interactive_index_chart`;
   - `vl-stacked_bar_weather` reverses the stack order;
   - `vl-area_density_stacked#0` overlays instead of stacking;
   - `plot-diverging-stacked-bar#0` loses its centre;
   - `plot-symbol-channel#0` swaps the hollow shapes for filled glyphs;
   - `plot-ordinal-scale-interval#0` has a bar domain that excludes 0.
6. **Two answers that can contradict each other:** rank vs value in `plot-horizontal-bar-chart#0` and `plot-sorted-groups`.
7. **Spec bugs:**
   - `plot-tree-tidy` and `plot-custom-tree-layout` write `lock: (d, table) => …`, but the engine calls `lock(d, i, table)` (`src/core/lock.js:68`). So `table` holds the row index and **the lock never applies**. Verified.
   - `plot-cumulative-histogram` uses `monotonic({ dir: 'increasing' })`, which works only because it isn't `'down'`. Verified.
   - `maps-tips` and `small-grid-contours` declare unordered answer sets as `ordinal`.
   - Five interfaces draw their whole chart in `guides.custom` with hand-made d3 scales to get "dim the others", losing the legend, tips and, in `vl-interactive_area_brush#0`, the y axis.

---

## Suggested improvements

### Library: diagnostics (cheap; each one would have caught a defect above)

1. **Validate option VALUES, not just names.** `monotonic({ dir: 'increasing' })` passes silently today. The vocabulary could carry enums.
2. **Warn when a `lock` or `context` predicate matches no seed rows.** That catches the `(d, table)` arity mistake without reading parameter names.
3. **Warn when every locked row is a seed row and there is no `context`**, and suggest `context`. This is the reference-as-answer pattern behind about 9 interfaces.
4. **`count` over context rows.** It counts every row today (`src/constraints/count.js:24`), so authors write `max: rows.length + N`. With the default `strategy: 'replace'` it slices the oldest rows, which is where context sits. Count reported rows by default, or add an option.
5. **Warn when a bar's value domain excludes 0.**

### Library: features, ranked by how many entries they would fix

1. **Derived-geometry guides over live state**: Voronoi, contour or density, hexbin, as `guides.*` or recipes over `guides.custom`, plus a planar filled polygon. This would move about 13 `none` entries to drawable, and Voronoi or density becomes feedback on an elicited scatter.
2. **Selection-driven "dim the others"**: an effect or guide that reads the selection or another answer. It is the top INT blocker (16 partials), and 5 interfaces redrew whole charts in `guides.custom` to get it.
3. **Facet over the elicited table**: 24 partials are degraded by flattening it, and 18 entries are blocked by it.
4. **Area stacking**: `areaY({ stack })` with offsets (zero, normalize, center, wiggle) plus `edit.stack.edge` on areas. Also a diverging (Likert) offset for `bar`. About 10 entries hand-roll this, and three interfaces dropped the stack because of it.
5. **A band-uncertainty preset** (lo/hi plus `ordering`, swept or dragged): rebuilt about 25 times across the files.
6. **Hover effects on inert marks**, so hover doesn't need a dummy `select()` (4 recreations).
7. **Derived or computed output fields in `getData()`** (ternary shares, stacked counts), so answers don't live only in guide text.
8. **Smaller gaps:**
   - `xOffset` grouped bands and `cornerRadius` on stacked bars (5 emulations);
   - polar position on `point` plus a closed line, for radars;
   - a vector or spike mark and a `geo.move` axis lock;
   - `symmetric({ about: 0 })` with a constant centre;
   - `unique` that ignores nulls;
   - a calendar-aware temporal `snap`;
   - `maintainSum` per group;
   - a `total` option on `widgets.histogram`;
   - a constraint tying a rank column to its value column;
   - `guides.remaining` counting rows;
   - a folded (horizon) scale.

Naming question: `move({ pick: 'sweep' })` (11 uses) and `edit.line.sweep()` (a scoped `move` with a guide) are two spellings of one behaviour. That is probably deliberate (the universal form works on bars), but it is worth checking against the one-name rule.

### Gallery entries (not the library)

- Fix the two tree `lock`s, convert locked reference rows to `context`, and enforce the totals the questions state.
- Remove the context that gives the answer away (or turn those into explicit "reading" tasks).
- Make the grading consistent: facets (VL `none` vs Plot `partial`), dodge and hexbin, and the 4 full → partial cases.
- Consider giving each of the 43 different-chart entries one interface on the original form. That matters most where the different chart drops the example's point: comet, stacked dots, marimekko, diverging stack, wind map.
