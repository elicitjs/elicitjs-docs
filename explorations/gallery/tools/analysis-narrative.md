# ElicitJS gallery study: outcome analysis

We tried to rebuild every example in the Vega-Lite gallery (189) and the Observable Plot gallery (220) with ElicitJS. Where that worked, we designed one or more elicitation interfaces on the result: a live chart whose gestures write the reader's answer back to data. Each example was judged on one rule: can it be built from ElicitJS's existing marks with minimal customization? Computing data in plain JavaScript first counts as minimal. Writing a new mark with the authoring kit does not. Every recreation and interface was rendered in Chromium and had to draw, raise no error, and emit no `[elicit]` warning. Every gesture was checked to actually change the data.

## Headline

- **86% of the examples can be drawn**: 65% fully and 21% partly, up from 53% and 32% in the first study (`ANALYSIS.v1.md`). Vega-Lite is 68% full and 17% partial, Plot 62% full and 24% partial. 14% can't be drawn, and nearly all of those are now declared out of scope.
- **The core of statistical graphics is covered.** Every Vega-Lite bar chart is recreated or partly recreated, and so is every Plot bar, cell and rect chart (40 of 47 in full). The same goes for every line and area chart in both galleries, error bars, box plots, pies, heatmaps, strip and scatter plots, waffles, and the Vega-Lite maps of points, lines and choropleths. Two Plot network diagrams (a finite-state machine and an arc diagram) map directly onto ElicitJS's network structure.
- **What can't be drawn falls into three groups**: several views in one spec (faceting and concatenation, not covered by this study), geometry computed from a density (contours, Voronoi, rasters, hexbins, out of scope), and view interaction that drives other marks (selection-driven encoding, bound input widgets). Tooltips, crosshair readouts, zoom and pan moved out of this list after the first study.
- **The galleries yield 436 elicitation interfaces** (385 in the first study), plus 12 on the Beyond page that neither library can express.

## What can't be created, and why

### 1. More than one view (not covered by this study)

Faceting blocks 18 examples and degrades 24. Multi-view layout (concat, repeat, marginal plots, overview + detail) blocks 17. Together they account for most of the Vega-Lite "Faceting", "Repeat & Concatenation" and "Interactive Multi-View" sections.

Faceting and multiple views are not covered by this study. Recreations that flatten a facet into one chart are kept, and their pages say so. An ElicitJS chart is one coordinate frame over one dataset, and that is deliberate. Faceting is the strongest case for relaxing it: 12 examples need nothing else. For elicitation, small multiples are also the natural way to ask for one distribution per group. The rows already carry the grouping field, so a facet over the elicited table would partition rows rather than add a second data path. Concatenated dashboards with linked views are a much bigger step, and they matter less for asking questions.

### 2. Geometry derived from a field (out of scope)

Contours and 2-D density block 17 examples, Delaunay/Voronoi 6, and rasters, hexbins, dodge and clipping a few each. Almost all of Plot's "Contour, Raster, Density" and "Delaunay, Voronoi" sections are here.

These are transforms whose output is new geometry rather than rows, so an edit on them has no obvious inverse. What would dragging a contour write? Where the geometry is a polyline, a recreation still works by computing it with d3 first: the stroked contours, Delaunay links and Delaunay hull are all recreated this way. Filled regions and per-pixel rasters are not. Contours, 2-D density, rasters, Voronoi and hexbins are out of scope for an elicitation library for now; a polyline computed in JavaScript can still be drawn, now as context rows (§5). Binning is the same kind of transform: it stays in plain JavaScript (`prep-bin`), because the answer is the bin height, not the raw observation.

### 3. View interaction

ElicitJS's interaction model writes data. It has no parameter system that changes how other marks draw, so selection-driven encoding (a brush that recolours another layer) and bound input widgets remain real gaps. Tooltips, crosshair readouts, zoom and pan are now covered (see "Changes since the first study"): a tip and a crosshair are guides that read the pointer, so they never block a gesture, and a wheel zoom or a drag pan is a change to the field's domain, so it is undoable like any other domain edit. Both Vega-Lite `bind: "scales"` scatterplots now zoom and pan like their originals. What stays out is a brush in one view that sets another view's domain (overview + detail, a minimap), which needs several views.

Even so, 38 of the 47 still draw their chart, and each of those got an interface that translates the view interaction into a question:

- a brush becomes a region you answer with (`brushRect`);
- a click highlight becomes a row you select;
- a legend filter becomes a category you pick;
- a crosshair becomes a nearest-pick on the value you mean.

The other 9 are linked multi-view dashboards (§1).

The original's highlight or filter often comes back as feedback: a `guides.custom` reads the answer and redraws it, for example colouring the cars inside your brush. Tooltips are the cheapest and broadest of these to add.

### 4. Chrome and styling

Titles, a rotated y-axis title, gradients, dashes as an encoding and gaps at missing values were added after the first study. Titles and axis titles reserve their own layout space the way legends do, so a chart keeps its declared size.

A later pass made the chrome themeable (2026-11-10). Every axis token is a theme token and an `axis()` option of the same name: spine on or off and its width, tick length and padding, label angle (the axis reserves the room turned labels need), label and title typography, and an offset. `tickSize`, `stroke`, `fill` and `fontWeight` take a per-tick function, and a `\n` in a tick label starts a second line, which is what Vega-Lite's conditional axis and Plot's year-under-January date axes needed. Labels can align and shift along the axis, which with a negative padding puts them inside the plot (the space-saving axis), and a title can sit at either end of its axis. A grid takes a dash, an emphasised zero line, and lines at band edges, `theme.panel` paints the plot area alone (the ggplot2 grey), `theme.bandPadding` sets bar spacing, a text mark takes `fontWeight`, `fontStyle` and `fontFamily`, a stacked bar takes `rx`, and every d3-scale-chromatic scheme can be named. Seventeen named themes ship with it, fourteen of them Flint's house styles. Text halos (a `stroke` on text paints behind the glyphs) had already landed; the six entries that still listed "no white halo" now draw one.

What is left — colour varying along a line, extra curve types, label placement, image marks and a few legend layouts — rarely blocks an example outright.

### 5. One chart, one table (now: one elicited table, with context rows)

The first study found one structural limit in every section: reference data could not sit beside the answer, so authors drew it as `guides.custom` background nodes, or merged it into the answer table and `lock`ed it, which left it in `getData()`. **Context rows** fix this. `context: (d) => d.year <= 2020` (or `context: true`, every row in `data`) marks reference rows of the elicited table. Every mark over the table draws them, they are read-only, and `getData()` leaves them out. The predicate runs once, over the seed, so an answer dragged into its region stays an answer.

Context rows share the table's columns. Observed history and the forecast after it are one column with one type, and one line can carry both. Reference data of another shape fills its own columns: a mark draws nothing for a row that leaves its columns empty, and a line or area skips it. The revised entries use context rows for observed history, reference series, outliers, axis ticks, annotations, basemap labels and polyline geometry computed in JavaScript.

Authoring them taught three rules:

- **Own columns when the context is drawn differently.** Every mark over the table draws every row, so a grey record beside a coloured answer either takes its own columns or a `{ fn }` paint that tells the rows apart. Most entries chose own columns.
- **Constraints see context rows.** Per-row rules (`clamp`, `snap`, `ordering`, `follow`) are unaffected. `monotonic` needs a `series` when context shares its column, `maintainSum` needs the context in another column, and `count` counts context rows too (see the open findings).
- **A line breaks where a context row shares its x but has no value.** That is the gap rule for missing values. A `series` that only the context fills, or `connect: 'sequence'`, keeps the answer's line whole.

A first fix put reference rows in a separate **context table** (`{ context: true, fields }`). It restated every shared column, so the two copies could disagree on a type, and it was replaced by context rows before release.

## What a recreation costs

ElicitJS has no transform layer. A recreation computes these in JavaScript before calling `Elicit`:

- calculate or filter in 185 examples;
- aggregate in 86;
- bin in 41;
- geo conversion in 36;
- fold or pivot in 30;
- stack offsets in 29;
- window in 22;
- lookup in 18.

For display that is harmless. For elicitation it forces a useful decision: **which quantity is the answer?** An edit writes the rows it is given, so you elicit bin heights rather than raw observations, deviations rather than values, a waterfall's deltas rather than its running totals. Several interfaces kept a derived quantity consistent with a `constraints.custom` invariant instead of a transform, for example a running total kept chained under edits. That is the elicitation-side equivalent of `joinaggregate` and `window`.

## What the interfaces show

Most-used vocabulary:

- `move` (238 interfaces), `clamp` (127) and `lock` (94): positional editing with bounds over partly-given data;
- `guides.*` (97, down from 149 because reference data moved to context rows), mostly reference lines, regions, tips and readouts;
- `ordering` (70), `edit.line.sweep` (47), `snap` (44), `create` (34), `count` (34), `remove` (31), `edit.geo.*` (29).

Every other piece of the vocabulary also appears: the stack edits (`cut`/`edge`/`merge`), the line edits (`sweep`/`draw`/`anchor`/`newSeries`), trends and bands, waffle fill, network connect, legend and scale-domain edits, `rank`, `cycle`, `select`, stages and `open` domains.

Four patterns recur across chart types:

1. **Given + predicted.** `context` marks the observed rows as given and leaves only the future, the missing bar or the new series to answer (99 interfaces). `lock` fixes rows that stay part of the answer.
2. **Answer as data, context as guide.** The answer is rows; the feedback is a guide computed from them, so the original's highlight or reference line reappears as a response to the reader.
3. **Staged protocols.** Guess, reveal, revise, or anchor first and range second, declared with `stage` on each edit.
4. **Invariants instead of transforms.** `maintainSum`, `ordering`, `monotonic` and `constraints.custom` keep derived structure true under any gesture.

## Library issues the study surfaced

Authoring about 750 specs found roughly 40 library issues, listed with minimal cases in `tools/LIBRARY-FINDINGS.md`. Every numbered item there is now fixed; the file's last column says how, and `tools/LIBRARY-FINDINGS.v1.md` keeps the original report. Moving the entries to context rows found more (section 7 there): fourteen marks drew a row that does not fill their columns, now fixed, and three questions are still open.

## Recommended priorities

1. **Selection-driven encoding** as a guide that reads the selection (a brush that recolours another layer is a statement about state, not data).
2. **Faceting over the elicited table**, if multiple views come into scope: it would unlock 12 examples outright, and per-group elicitation is a common survey need.
3. **Label placement**: dodged and occlusion-avoiding labels, a label at a line's end. Axis styling and themes are done (§4).
4. **Out of scope** for now: contour, Voronoi and raster as editable marks, binning as a transform, and linked multi-view dashboards.

## Changes since the first study

The first version of this analysis is kept as `ANALYSIS.v1.md`. Between the two versions the library and the entries changed as follows.

**Library fixes.** Every issue in `tools/LIBRARY-FINDINGS.md` was fixed. The ones that wrote wrong data came first:
- `snap` keeps a date a `Date`, and `snap`/`clamp` repair every cell a proposal changes, not only the dragged one;
- `editText` and `set` store a number on a quantitative column;
- a second geo stroke starts a new row, and a new line takes the schema's next declared category;
- a vertical `brushSpan` keeps low below high, and `rank` inserts instead of swapping per tick;
- `maintainSum` handles negative totals, `unique` ignores unanswered rows, and `monotonic`/`spacing` stop at a locked neighbour or the domain's edge.

Edits that silently did nothing now work: a stage change lowers the interaction plane, an axis edit no longer blocks mark drags, a sweep works on bars, and a press on a draggable mark grabs it even when a sweep or brush covers the chart. Drawing fixes include continuous colour schemes keeping every stop, missing values breaking a line, an ordinal area keeping its order, clockwise arcs, and measured legend titles.

**New in the library**, each driven by a gap the study counted:
- **context rows** (`context` on the spec) — reference rows of the elicited table: drawn, read-only, and left out of `getData()`;
- **tooltips** (`tip` on any mark, `guides.tip`) and **pointer readouts** (`guides.crosshair`), as guides that never block a gesture;
- **zoom and pan** (`edit.axis.zoom`, `edit.axis.pan`, `el.setDomain`) as changes to the domain, with the marks clipped to the plot while either is on (`clip: { pad }` grows the clip, a mark's `clip: false` lets it out);
- **titles, subtitles and captions**, a **rotated y-axis title**, `strokeDash` as an encoding, **gradients**, and **gaps** at missing values;
- the **`radius` channel**, which makes the radial plot drawable and its rims draggable;
- **`plot.shape`**, a mark that draws any SVG path per row, used for the isotype and wind-vector examples and usable as a network node;
- **`follow` and `symmetric`** constraints, so a mean drags its interval along, with symmetric or independent ends;
- **edge-by-edge sweeps** on area bands, which paint every column a fast stroke crosses;
- handles that take their series' colour;
- **themes for the chrome** — axis, grid, panel, legend and typography tokens, per-kind axis styling, per-tick axis functions, two-line tick labels, and seventeen named themes, fourteen transcribed from Flint (`theme: "nyt"`, or `{ extends: "nyt", … }`).

**Entry revisions.** 39 examples became fully recreated (218 → 257) and two left "not supported" (the radial plot and the phases of the moon); 50 interfaces were added (385 → 435).
- Reference data moved from `guides.custom` drawings and `lock`ed merged rows into context rows: 128 charts across 13 entry files (first as context tables, then as rows of the elicited table once tables were replaced).
- The two `bind: "scales"` scatterplots gained drag pan beside the wheel zoom, and the "Several futures" showcase keeps its observed past as context.
- Every mean-with-interval glyph (error bars, error bands, box plots) uses `follow`, with symmetric and independent-ends variants.
- Tooltips (`tip`, `guides.tip`) and crosshairs replaced the "no hover tip" gaps, including on choropleths.
- Pictograms, wind vectors, arrowheads and the moon's phases are drawn with `plot.shape`.
- Every area chart gained a band-sweep interface beside the point-by-point one.
- Rank interfaces use the example's own bars instead of a stand-in mark.
- The bivariate choropleth gained an interface on the map itself.
- Faceting, multi-view, contour and density entries now state their scope.
- Axis titles were restored where authors had dropped them.
- Styling workarounds were replaced by the theme and axis options: rotated tick labels drawn by a `text` mark became `labelAngle`, the ggplot2 panel became `theme.panel`, conditional gridlines drawn as a rule per tick became per-tick grid functions, zero rules became the grid's `zero` line, a hand-stacked `rect` became `bar({ stack, rx })`, and labels gained white halos.
