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

## The numbers

| Gallery | Examples | Recreated | Partly | Not supported | Interfaces |
|---|---:|---:|---:|---:|---:|
| Vega-Lite | 189 | 129 (68%) | 32 (17%) | 28 (15%) | 215 |
| Observable Plot | 220 | 136 (62%) | 53 (24%) | 31 (14%) | 221 |
| **Both** | **409** | **265 (65%)** | **85 (21%)** | **59 (14%)** | **436** |

Plus 12 interfaces on the “Beyond” page that neither library can express.

## By section

| Gallery | Section | Examples | Recreated | Partly | Not supported |
|---|---|---:|---:|---:|---:|
| Vega-Lite | Bar Charts | 24 | 23 | 1 | 0 |
| Vega-Lite | Histograms, Density Plots, and Dot Plots | 15 | 12 | 3 | 0 |
| Vega-Lite | Scatter & Strip Plots | 13 | 12 | 1 | 0 |
| Vega-Lite | Line Charts | 20 | 18 | 2 | 0 |
| Vega-Lite | Area Charts & Streamgraphs | 7 | 7 | 0 | 0 |
| Vega-Lite | Table-based Plots | 7 | 7 | 0 | 0 |
| Vega-Lite | Circular Plots | 6 | 6 | 0 | 0 |
| Vega-Lite | Advanced Calculations | 17 | 16 | 1 | 0 |
| Vega-Lite | Error Bars & Error Bands | 4 | 4 | 0 | 0 |
| Vega-Lite | Box Plots | 3 | 3 | 0 | 0 |
| Vega-Lite | Labeling & Annotation | 7 | 6 | 1 | 0 |
| Vega-Lite | Other Layered Plots | 6 | 4 | 2 | 0 |
| Vega-Lite | Faceting (Trellis Plot / Small Multiples) | 10 | 0 | 0 | 10 |
| Vega-Lite | Repeat & Concatenation | 7 | 0 | 1 | 6 |
| Vega-Lite | Maps (Geographic Displays) | 12 | 7 | 2 | 3 |
| Vega-Lite | Interactive Charts | 24 | 4 | 16 | 4 |
| Vega-Lite | Interactive Multi-View Displays | 7 | 0 | 2 | 5 |
| Observable Plot | Dot, Image, Text | 38 | 19 | 11 | 8 |
| Observable Plot | Bar, Cell, Rect | 47 | 43 | 4 | 0 |
| Observable Plot | Area, Line | 46 | 30 | 16 | 0 |
| Observable Plot | Rule, Tick | 7 | 6 | 1 | 0 |
| Observable Plot | Geo | 17 | 9 | 7 | 1 |
| Observable Plot | Arrow, Link, Tree, Vector | 13 | 7 | 6 | 0 |
| Observable Plot | Contour, Raster, Density | 22 | 2 | 3 | 17 |
| Observable Plot | Axes | 7 | 6 | 1 | 0 |
| Observable Plot | Delaunay, Voronoi | 7 | 2 | 0 | 5 |
| Observable Plot | Tips and interactions | 16 | 12 | 4 | 0 |

## Missing features, ranked

“Blocks” counts examples ElicitJS cannot draw at all without the feature; “degrades” counts examples it draws only partly. An example can need several features.

| Feature | Blocks | Degrades | What it is |
|---|---:|---:|---|
| **Faceting** | 18 | 21 | Small multiples: one chart per value of a field (`facet`, `row`/`column`, `fx`/`fy`), sharing scales. |
| **Multi-view layout** | 17 | 3 | Several coordinated views in one spec (`hconcat`/`vconcat`/`repeat`, marginal plots, overview+detail). |
| **Selection-driven encoding** | 10 | 16 | View-side interaction that changes how OTHER marks draw (highlight/filter by a brush, click or hover param, crossfilter, linked views). ElicitJS selections exist, but they select rows to edit; they do not drive conditional encodings or filters. |
| **Contours & 2-D density** | 17 | 1 | Contour lines/fills, 2-D kernel density, isolines. |
| **Bound input widgets** | 3 | 21 | Sliders, dropdowns or search boxes bound to chart parameters. |
| **Projection options** | 7 | 1 | Projections or projection parameters ElicitJS does not offer. |
| **Delaunay / Voronoi** | 6 | 0 | Delaunay meshes, Voronoi cells and convex hulls. |
| **Geo transforms** | 5 | 0 | Geo centroid, geo-to-pixel transforms, sphere/graticule, spherical lines. |
| **TopoJSON input** | 4 | 1 | Reading TopoJSON / feature collections directly from the spec. |
| **Linked domains** | 4 | 0 | A brush or selection in one view that sets another view's scale domain (overview + detail, a minimap), or pan and zoom shared across panels. Wheel zoom and drag pan on one view exist (`edit.axis.zoom()`, `edit.axis.pan()`). |
| **Clipping to a geometry** | 4 | 0 | Clipping marks to a shape (the sphere, a facet frame). Clipping to the plot rectangle exists (`clip`, `clip: { pad }`, and on by default under zoom and pan). |
| **Dodge / beeswarm** | 3 | 1 | Collision-avoiding placement of dots (beeswarm, dodge transform), or random jitter as a transform. |
| **Image mark** | 1 | 4 | Drawing an image (URL) per row. |
| **Hexagonal binning** | 1 | 4 | Hexbin transform and hexagon mark. |
| **Raster** | 2 | 2 | Per-pixel image rendering of a field or function. |
| **Label layout** | 2 | 1 | Automatic label placement: dodged/occlusion-avoiding labels, text along a line, a label at a line end. (Halos, rotated tick labels and two-line tick labels exist: `stroke` on text, an axis `labelAngle`, a `\n` in `tickFormat`.) |
| **Error bar / band composite** | 0 | 4 | Built-in error bar or error band computed from raw rows (`errorbar`, `errorband`). |
| **Dense data** | 2 | 0 | Thousands of marks; a recreation renders but an elicitation over every row is not meaningful. |
| **Stack offsets** | 0 | 3 | Stack layouts beyond zero-based: normalize to 100%, center/silhouette, wiggle (streamgraph), diverging with a neutral middle, stack order controls. |
| **Axis customization** | 1 | 1 | Axis placements a single axis cannot make: an axis between two mirrored panels, facet headers as axis labels, tick dashes. (Label angle, alignment and offset, labels inside the plot, per-tick styling, two-line labels, title anchoring, offset, spine/tick toggles, grid dashes, band-edge gridlines and zero lines, and a plot panel exist — see /theming and /marks/axes.) |
| **Varying colour along a line** | 0 | 3 | A line whose stroke varies per segment (z-less colour encoding). |
| **Tree / hierarchy layout** | 0 | 3 | Tree, cluster or other hierarchy layouts. |
| **Variable-width line** | 0 | 2 | A line whose width varies along its length (`trail`, size along a path). |
| **Box plot mark** | 0 | 2 | A box-and-whisker composite with automatic quartile/outlier computation. |
| **Independent scales** | 0 | 2 | Two layers with independent scales on one axis (dual y-axis, `resolve: independent`). |
| **Discretizing scales** | 1 | 0 | Quantize, quantile and threshold scales (and their legends). |
| **Free-standing link mark** | 1 | 0 | A segment from (x1,y1) to (x2,y2) per row of ONE table (Plot `link`/`arrow`) rather than a join between two tables. |
| **Horizon bands** | 0 | 2 | Horizon charts: a series folded into overlapping coloured bands. |
| **More curve interpolators** | 0 | 2 | Curves ElicitJS does not offer: `bump-x`/`bump-y`, closed curves (`cardinal-closed`, `linear-closed`), and geodesic interpolation. |
| **Named colour schemes** | 0 | 1 | Vega’s own schemes (e.g. `lighttealblue`), or a named scheme on a sqrt/log/symlog colour scale. (Every d3-scale-chromatic scheme can be named with `scheme`.) |
| **Hyperlinks** | 0 | 1 | A mark that opens a URL on click (Vega-Lite `href` channel, Plot `href`). |
| **Background image** | 0 | 1 | A raster image (or CSS background) behind the plot frame. |
| **Radius encoding** | 0 | 1 | A radial position channel (Vega-Lite `radius`, rose / radial plots). |
| **Legend customization** | 0 | 1 | Legend layouts and forms ElicitJS does not draw. |
| **Vector / arrow / spike** | 0 | 1 | Arrow, vector or spike marks with per-row length and direction. |

### Single-feature unlocks

Examples whose only listed blocker is one feature — adding it would make them drawable:

- **Faceting** (14): Trellis Bar Chart (Vega-Lite), Trellis Stacked Bar Chart (Vega-Lite), Trellis Scatter Plot (wrapped) (Vega-Lite), Trellis Histograms (Vega-Lite), Trellis Scatter Plot Showing Anscombe's Quartet (Vega-Lite), Becker's Barley Trellis Plot (Vega-Lite), Trellis Area (Vega-Lite), Faceted Density Plot (Vega-Lite), Compact Trellis Grid of Bar Charts (Vega-Lite), Income in the U.S. by State, Faceted over Income Brackets (Vega-Lite), Faceted County-Level Species Habitat Maps (Vega-Lite), 2D faceting (Observable Plot), 2D faceting with non-faceted marks (Observable Plot), Anscombe’s quartet (Observable Plot)
- **Contours & 2-D density** (9): Function contour (Observable Plot), Function contour 2 (Observable Plot), Blurred contours (Observable Plot), IGRF90 contours (Observable Plot), Filled contours (Observable Plot), Olympians density (Observable Plot), One-dimensional density (Observable Plot), Point cloud density (Observable Plot), Non-overlapping density regions (Observable Plot)
- **Multi-view layout** (5): Vertical Concatenation (Vega-Lite), Horizontally Repeated Charts (Vega-Lite), Marginal Histograms (Vega-Lite), Nested View Concatenation Aligned with Axis `minExtent` (Vega-Lite), Three Choropleths Representing Disjoint Data from the Same Table (Vega-Lite)
- **Hexagonal binning** (1): Hexbin heatmap (Observable Plot)
- **Delaunay / Voronoi** (1): Voronoi scatterplot (Observable Plot)

## Transforms computed outside the spec

ElicitJS has no transform layer, so recreations compute these in plain JavaScript before calling `Elicit`:

| Transform | Examples |
|---|---:|
| Calculate / filter | 186 |
| Aggregate | 86 |
| Bin | 41 |
| Geo conversion | 36 |
| Fold / pivot | 31 |
| Stack offsets | 28 |
| Window | 22 |
| Lookup / join | 18 |
| Density | 3 |
| Regression | 3 |
| Delaunay / Voronoi | 2 |
| Contours | 1 |

## Not supported

### Vega-Lite (28)

| Example | Section | Why | Needs |
|---|---|---|---|
| [Trellis Bar Chart](https://vega.github.io/vega-lite/examples/trellis_bar.html) | Faceting (Trellis Plot / Small Multiples) | Two bar charts of the 2000 US population by age, one row per gender sharing the x scale. Faceting is not covered by this study, so the small-multiple layout is out of scope. | Faceting |
| [Trellis Stacked Bar Chart](https://vega.github.io/vega-lite/examples/trellis_stacked_bar.html) | Faceting (Trellis Plot / Small Multiples) | Stacked horizontal bars of barley yield by variety and site, faceted into one column per year: the stacked bar is drawable, but faceting is not covered by this study. | Faceting |
| [Trellis Scatter Plot (wrapped)](https://vega.github.io/vega-lite/examples/trellis_scatter.html) | Faceting (Trellis Plot / Small Multiples) | A scatter of worldwide gross against DVD sales wrapped into one panel per MPAA rating. Each panel is a plain scatter; faceting is not covered by this study. | Faceting |
| [Trellis Histograms](https://vega.github.io/vega-lite/examples/trellis_bar_histogram.html) | Faceting (Trellis Plot / Small Multiples) | Horsepower histograms of cars stacked in one row per origin: a single histogram is easy, but the three aligned rows are a facet, and faceting is not covered by this study. | Faceting |
| [Trellis Scatter Plot Showing Anscombe's Quartet](https://vega.github.io/vega-lite/examples/trellis_anscombe.html) | Faceting (Trellis Plot / Small Multiples) | Anscombe's quartet as four scatter plots side by side, one column per series: the four-panel comparison is the point, and faceting is not covered by this study. | Faceting |
| [Becker's Barley Trellis Plot](https://vega.github.io/vega-lite/examples/trellis_barley.html) | Faceting (Trellis Plot / Small Multiples) | Becker's barley trellis: median yield per variety as dots coloured by year, in one wrapped panel per site sorted by median — a facet with per-panel sorting. Faceting is not covered by this study. | Faceting |
| [Trellis Area](https://vega.github.io/vega-lite/examples/trellis_area.html) | Faceting (Trellis Plot / Small Multiples) | Four stock-price area charts stacked in rows that share the time axis: an area per symbol is drawable, but the row layout is a facet, and faceting is not covered by this study. | Faceting |
| [Trellis Area Plot Showing Annual Temperatures in Seattle](https://vega.github.io/vega-lite/examples/trellis_area_seattle.html) | Faceting (Trellis Plot / Small Multiples) | Seattle's hourly temperature normals as 24 thin area charts, one row per hour of the day: a row facet with custom header labels. Faceting is not covered by this study. | Faceting, Axis customization |
| [Faceted Density Plot](https://vega.github.io/vega-lite/examples/area_density_facet.html) | Faceting (Trellis Plot / Small Multiples) | Body-mass density curves for three penguin species, one row each on a shared x axis: the density areas are drawable after a JS density estimate, but the stacked rows are a facet, and faceting is not covered by this study. | Faceting |
| [Compact Trellis Grid of Bar Charts](https://vega.github.io/vega-lite/examples/facet_grid_bar.html) | Faceting (Trellis Plot / Small Multiples) | A 3×3 grid of tiny bar charts crossing two factors, with a colour legend for a third: a row-and-column facet. Faceting is not covered by this study. | Faceting |
| [Vertical Concatenation](https://vega.github.io/vega-lite/examples/vconcat_weather.html) | Repeat & Concatenation | Two different charts stacked vertically — monthly mean precipitation bars and a binned temperature bubble plot — from one dataset. Multiple views are not covered by this study. | Multi-view layout |
| [Horizontally Repeated Charts](https://vega.github.io/vega-lite/examples/repeat_histogram.html) | Repeat & Concatenation | The same stacked histogram repeated for four car measures in a 2×2 grid: a `repeat` layout, and multiple views are not covered by this study. | Multi-view layout |
| [Interactive Scatterplot Matrix](https://vega.github.io/vega-lite/examples/interactive_splom.html) | Repeat & Concatenation | A 3×3 scatterplot matrix with a shared brush that recolours every panel and pan/zoom bound to the scales. Multiple views, and the selections and domains linked across them, are not covered by this study; a single panel can zoom and pan with `edit.axis.zoom()` and `edit.axis.pan()`. | Multi-view layout, Selection-driven encoding, Linked domains |
| [Marginal Histograms](https://vega.github.io/vega-lite/examples/concat_marginal_histograms.html) | Repeat & Concatenation | A 2-D binned heatmap of IMDB against Rotten Tomatoes ratings with marginal histograms on top and right: three aligned views, and multiple views are not covered by this study. | Multi-view layout |
| [Discretizing scales](https://vega.github.io/vega-lite/examples/concat_bar_scales_discretize.html) | Repeat & Concatenation | Three side-by-side columns of circles showing quantize, quantile and threshold scales with their legends. Multiple views are not covered by this study, and ElicitJS has no discretizing scale types. | Multi-view layout, Discretizing scales |
| [Nested View Concatenation Aligned with Axis `minExtent`](https://vega.github.io/vega-lite/examples/nested_concat_align.html) | Repeat & Concatenation | Two rows of repeated histograms (ratings, then gross) nested inside a vertical concatenation and aligned by axis extent. Multiple views are not covered by this study. | Multi-view layout |
| [Three Choropleths Representing Disjoint Data from the Same Table](https://vega.github.io/vega-lite/examples/geo_repeat.html) | Maps (Geographic Displays) | Three choropleths of US states — population, engineers and hurricanes — repeated in rows with independent colour scales: each map alone is a `geoPolygon` choropleth, but multiple views are not covered by this study. | Multi-view layout |
| [Income in the U.S. by State, Faceted over Income Brackets](https://vega.github.io/vega-lite/examples/geo_trellis.html) | Maps (Geographic Displays) | State choropleths of the share of income per bracket, one map per income group in rows: a facet over a geoshape, and faceting is not covered by this study. | Faceting |
| [Faceted County-Level Species Habitat Maps](https://vega.github.io/vega-lite/examples/interactive_geo_facet_species.html) | Maps (Geographic Displays) | County-level habitat maps for four species in a 2×2 grid with a viridis scale and tooltips: a wrapped facet over 3,000-county choropleths. One map is a `geoPolygon` with `scale: { scheme: "viridis" }` and `tip: true`; faceting is not covered by this study. | Faceting |
| [Brushing Scatter Plot to show data on a table](https://vega.github.io/vega-lite/examples/brush_table.html) | Interactive Charts | The brushed scatter alone is drawable, but the example is a scatter and a linked table: the brush filters rows into three text columns beside the chart. Multiple views are not covered by this study, and a brush that filters another view is selection-driven encoding, not elicitation. | Multi-view layout, Selection-driven encoding |
| [Bar Chart with a Minimap](https://vega.github.io/vega-lite/examples/bar_count_minimap.html) | Interactive Charts | A detail bar chart of car names whose rows are chosen by brushing a minimap beside it. Multiple views are not covered by this study, and the brush that scrolls one view from the other is selection-driven, not elicitation. | Multi-view layout, Selection-driven encoding, Linked domains |
| [Focus + Context - Smooth Histogram Zooming](https://vega.github.io/vega-lite/examples/interactive_bin_extent.html) | Interactive Charts | Two stacked histograms where brushing the first re-bins the second over the brushed extent. Either histogram alone is a `rect` over d3 bins; the example is the link between two views, and multiple views are not covered by this study. | Multi-view layout, Selection-driven encoding, Linked domains |
| [Dynamic Color Legend](https://vega.github.io/vega-lite/examples/dynamic_color_legend.html) | Interactive Charts | The Seattle-weather dashboard (a brushable scatter over a bar chart that filters it) with five bound colour pickers that rewrite the weather palette. Multiple views are not covered by this study, and colour inputs bound to a scale range are missing. | Multi-view layout, Selection-driven encoding, Bound input widgets |
| [Overview and Detail](https://vega.github.io/vega-lite/examples/interactive_overview_detail.html) | Interactive Multi-View Displays | An S&P 500 area chart whose x domain is set by brushing a small overview area below it. Either area alone is an ordinary `areaY`, and the detail view alone can zoom and pan with `edit.axis.zoom()` and `edit.axis.pan()`; the overview whose brush sets its domain is a second view, and multiple views are not covered by this study. | Multi-view layout, Linked domains, Selection-driven encoding |
| [Crossfilter (Filter)](https://vega.github.io/vega-lite/examples/interactive_crossfilter.html) | Interactive Multi-View Displays | Three repeated histograms (distance, delay, hour) where brushing any one filters the other two. Each histogram alone is a `rect` over d3 bins; repeated, cross-filtered views are not covered by this study. | Multi-view layout, Selection-driven encoding |
| [Crossfilter (Highlight)](https://vega.github.io/vega-lite/examples/interactive_layered_crossfilter.html) | Interactive Multi-View Displays | The crossfilter again, but each histogram keeps the full distribution in grey behind the brushed subset. As with `vl-interactive_crossfilter`, repeated, cross-filtered views are not covered by this study. | Multi-view layout, Selection-driven encoding |
| [Interactive Dashboard with Cross Highlight](https://vega.github.io/vega-lite/examples/interactive_concat_layer.html) | Interactive Multi-View Displays | A binned IMDB × Rotten Tomatoes heatmap above a genre bar chart; clicking a genre overlays that genre's counts as sized dots on the heatmap. Each view alone is drawable; multiple views, with a click in one filtering the other, are not covered by this study. | Multi-view layout, Selection-driven encoding |
| [Seattle Weather Exploration](https://vega.github.io/vega-lite/examples/interactive_seattle_weather.html) | Interactive Multi-View Displays | The Seattle weather dashboard: a date × temperature scatter whose brush filters a weather-type bar chart below, and whose bars, clicked, filter the scatter back. The scatter alone is a `point` mark; multiple, mutually filtering views are not covered by this study. | Multi-view layout, Selection-driven encoding |

### Observable Plot (31)

| Example | Section | Why | Needs |
|---|---|---|---|
| [Image dodge](https://observablehq.com/@observablehq/plot-image-dodge) | Dot, Image, Text | Portraits laid out by a dodge transform: ElicitJS has neither an image mark nor collision-avoiding placement. | Image mark, Dodge / beeswarm |
| [Hexbin heatmap](https://observablehq.com/@observablehq/plot-olympians-hexbin) | Dot, Image, Text | A hexagon-tiled heatmap: hexagonal binning is out of scope for an elicitation library. | Hexagonal binning |
| [Text dodge](https://observablehq.com/@observablehq/plot-text-dodge) | Dot, Image, Text | IPO valuations as text laid out by a dodge transform; ElicitJS has no collision-avoiding placement. | Dodge / beeswarm, Label layout |
| [Voronoi labels](https://observablehq.com/@fil/plot-voronoi-labels) | Dot, Image, Text | Labels moved to the centroids of their Voronoi cells, with leader lines: Voronoi diagrams are out of scope for an elicitation library, and ElicitJS has no label-placement transform. | Delaunay / Voronoi, Label layout, Free-standing link mark |
| [Faceted dodge](https://observablehq.com/@observablehq/plot-dodge-penguins) | Dot, Image, Text | A beeswarm per species facet: faceting is not covered by this study, and ElicitJS has no dodge transform to pack the dots. | Faceting, Dodge / beeswarm |
| [2D faceting](https://observablehq.com/@observablehq/plot-two-dimensional-faceting) | Dot, Image, Text | A grid of panels by sex × species: faceting / multiple views are not covered by this study. | Faceting |
| [2D faceting with non-faceted marks](https://observablehq.com/@observablehq/plot-non-faceted-marks) | Dot, Image, Text | Each sex × species panel repeats the whole population in grey behind its own subset: faceting / multiple views are not covered by this study. | Faceting |
| [Anscombe’s quartet](https://observablehq.com/@observablehq/plot-anscombes-quartet) | Dot, Image, Text | Four side-by-side panels, one per series: faceting / multiple views are not covered by this study. | Faceting |
| [GeoTIFF contours](https://observablehq.com/@observablehq/plot-geotiff-contours) | Geo | Filled contours of a raster read from a GeoTIFF: contours and rasters are out of scope for an elicitation library, and computing 30 contour bands (plus decoding the TIFF) by hand is not minimal customization. | Contours & 2-D density, Raster, Clipping to a geometry |
| [Function contour](https://observablehq.com/@observablehq/plot-function-contour) | Contour, Raster, Density | Filled isobands of a function of x and y: contours are out of scope for an elicitation library, which has no contour generator and no filled polygon mark on planar axes. | Contours & 2-D density |
| [Faceted function contour](https://observablehq.com/@observablehq/plot-faceted-function-contour) | Contour, Raster, Density | Four contour panels of products of functions: contours are out of scope for an elicitation library, and faceting is not covered by this study. | Contours & 2-D density, Faceting |
| [Function contour 2](https://observablehq.com/@observablehq/plot-function-contour-2) | Contour, Raster, Density | Filled isobands of sin(x)·cos(y) with a diverging legend: contours are out of scope for an elicitation library. | Contours & 2-D density |
| [Contours & projection](https://observablehq.com/@observablehq/plot-contours-projection) | Contour, Raster, Density | Contours of a global water-vapour grid, projected to Equal Earth and clipped to the sphere: contours are out of scope for an elicitation library, and the sphere outline and clip are missing too. | Contours & 2-D density, Projection options, Geo transforms, Clipping to a geometry |
| [Blurred contours](https://observablehq.com/@observablehq/plot-blurred-contours) | Contour, Raster, Density | Contours interpolated from scattered magnetometer samples and blurred: spatial interpolation and contours are out of scope for an elicitation library. | Contours & 2-D density |
| [IGRF90 contours](https://observablehq.com/@observablehq/plot-igrf90-contours) | Contour, Raster, Density | Filled contours derived from non-gridded samples: interpolation and contours are out of scope for an elicitation library. | Contours & 2-D density |
| [Filled contours](https://observablehq.com/@observablehq/plot-filled-contours) | Contour, Raster, Density | Elevation bands of the volcano filled by value: filled contours are out of scope for an elicitation library. | Contours & 2-D density |
| [Olympians density](https://observablehq.com/@observablehq/plot-olympians-density) | Contour, Raster, Density | Two-dimensional kernel-density contours of weight × height, one set per sex: 2-D density is out of scope for an elicitation library. | Contours & 2-D density |
| [Density skew (weight) interactive](https://observablehq.com/@observablehq/plot-density-weighted) | Contour, Raster, Density | A 2-D density whose weights a slider skews between the sexes: 2-D density is out of scope for an elicitation library, and the slider is a bound input it lacks. | Contours & 2-D density, Bound input widgets |
| [Density, faceted](https://observablehq.com/@observablehq/plot-density-faceted) | Contour, Raster, Density | Density contours coloured by density, faceted by island and clipped to the frame: 2-D density is out of scope for an elicitation library, and faceting is not covered by this study. | Contours & 2-D density, Faceting |
| [Walmart density](https://observablehq.com/@observablehq/plot-walmart-density) | Contour, Raster, Density | A projected 2-D density of store locations under state borders: 2-D density is out of scope for an elicitation library. | Contours & 2-D density, Projection options, TopoJSON input |
| [Density stroke](https://observablehq.com/@observablehq/plot-density-stroke) | Contour, Raster, Density | Density contours of 50,000 diamonds on log–log axes, stroked by density: 2-D density is out of scope for an elicitation library. | Contours & 2-D density, Dense data |
| [Projected raster: vapor](https://observablehq.com/@observablehq/plot-raster-projection) | Contour, Raster, Density | A global water-vapour raster, barycentrically interpolated, projected to Equal Earth and clipped to the sphere: projected rasters are out of scope for an elicitation library. | Raster, Projection options, Clipping to a geometry, Geo transforms |
| [One-dimensional density](https://observablehq.com/@observablehq/plot-one-dimensional-density) | Contour, Raster, Density | Density contours of Old Faithful waiting times over a strip of dots: the density is two-dimensional even with one variable, and 2-D density is out of scope for an elicitation library. | Contours & 2-D density |
| [Density options](https://observablehq.com/@observablehq/plot-density-options) | Contour, Raster, Density | Two sliders drive a density mark’s bandwidth and thresholds: 2-D density is out of scope for an elicitation library, and the sliders are bound inputs it lacks. | Contours & 2-D density, Bound input widgets |
| [Point cloud density](https://observablehq.com/@observablehq/plot-point-cloud-density) | Contour, Raster, Density | Density contours drawn over the Old Faithful scatter: 2-D density is out of scope for an elicitation library. | Contours & 2-D density |
| [Non-overlapping density regions](https://observablehq.com/@observablehq/plot-non-overlapping-density-regions) | Contour, Raster, Density | One density per species with negative weights for the others, cut at a single threshold to make non-overlapping regions: 2-D density is out of scope for an elicitation library. | Contours & 2-D density |
| [Voronoi scatterplot](https://observablehq.com/@observablehq/plot-voronoi-scatterplot) | Delaunay, Voronoi | Voronoi cells filled by species under a scatter: Voronoi diagrams are out of scope for an elicitation library, which has no filled polygon mark on planar axes. | Delaunay / Voronoi |
| [Voronoi map](https://observablehq.com/@observablehq/plot-voronoi-map) | Delaunay, Voronoi | Voronoi cells of the state capitals on a clipped azimuthal projection, over a TopoJSON nation: Voronoi diagrams are out of scope for an elicitation library. | Delaunay / Voronoi, Projection options, TopoJSON input, Clipping to a geometry, Geo transforms |
| [Walmart Voronoi](https://observablehq.com/@observablehq/plot-walmart-voronoi) | Delaunay, Voronoi | A Voronoi mesh of 3,000 store locations over the US outline in Albers: Voronoi diagrams are out of scope for an elicitation library. | Delaunay / Voronoi, Projection options, TopoJSON input, Dense data |
| [Centroid Voronoi](https://observablehq.com/@observablehq/plot-centroid-voronoi) | Delaunay, Voronoi | Voronoi cells around the centroid of every US county under Albers: Voronoi diagrams are out of scope for an elicitation library. | Delaunay / Voronoi, Geo transforms, Projection options, TopoJSON input |
| [Planar vs. spherical Voronoi](https://observablehq.com/@visionscarto/planar-vs-spherical-voronoi) | Delaunay, Voronoi | Planar and spherical Voronoi diagrams of world airports compared under five projections: Voronoi diagrams are out of scope for an elicitation library, and multiple views are not covered by this study. | Delaunay / Voronoi, Projection options, Geo transforms, Multi-view layout |

## Partly recreated

### Vega-Lite (32)

| Example | Section | Why | Needs |
|---|---|---|---|
| [Heat Lane Chart](https://vega.github.io/vega-lite/examples/bar_heatlane.html) | Bar Charts | The two binning passes run in JS; each horsepower bin is a rounded `rect` spanning ±count/2, coloured by its binned count. | Named colour schemes |
| [Stacked Density Estimates](https://vega.github.io/vega-lite/examples/area_density_stacked.html) | Histograms, Density Plots, and Dot Plots | Per-species kernel densities stacked in JS and drawn as `areaY` bands (`y1`/`y2`) coloured by species, under the chart `title`; `area` has no stack layout of its own. | Stack offsets |
| [Isotype Dot Plot](https://vega.github.io/vega-lite/examples/isotype_bar_chart.html) | Histograms, Density Plots, and Dot Plots | `shape` draws the original’s own SVG-path pictograms, one per animal, laid out in rows per country; faceting is not covered by this study, so the country facet becomes a combined row key. | Faceting |
| [Isotype Dot Plot with Emoji](https://vega.github.io/vega-lite/examples/isotype_bar_chart_emoji.html) | Histograms, Density Plots, and Dot Plots | `dotStackX` with an emoji `symbol` is this chart: one row per animal, stacked along x per country-and-animal row. Faceting is not covered by this study, so the country facet is flattened. | Faceting |
| [Image-based Scatter Plot](https://vega.github.io/vega-lite/examples/scatter_image.html) | Scatter & Strip Plots | There is no image mark; a `guides.custom` layer can draw an image at each row's position, but the image itself is not an encoded, pickable mark. | Image mark |
| [Line Chart with Varying Size (using the trail mark)](https://vega.github.io/vega-lite/examples/trail_color.html) | Line Charts | There is no trail mark, so the trail is approximated by a dense run of `point`s whose radius encodes price; overlapping dots read as a line that thickens with price. | Variable-width line |
| [A comet chart showing changes between between two states](https://vega.github.io/vega-lite/examples/trail_comet.html) | Line Charts | Each comet is drawn as a tapered `areaY` band between its 1931 and 1932 ends, and the six site columns are laid side by side on one x axis. There is no trail mark; faceting is not covered by this study, so the facet is flattened. | Variable-width line, Faceting |
| [Quantile-Quantile Plot (QQ Plot)](https://vega.github.io/vega-lite/examples/point_quantile_quantile.html) | Advanced Calculations | The quantile transform and the normal quantile function are computed in JS and each panel is a plain `point` chart. Multiple views are not covered by this study, so only the normal Q-Q panel is drawn. | Multi-view layout |
| [Comparative Likert Scale Ratings](https://vega.github.io/vega-lite/examples/concat_layer_voyager_result.html) | Labeling & Annotation | The upper panel — mean ratings with 95% confidence intervals per study, filled or hollow by measure — is one ElicitJS chart, titled as in the original; the arrow annotation panel underneath is drawn as a guide in the bottom margin, since multiple views are not covered by this study. | Multi-view layout |
| [Bullet Chart](https://vega.github.io/vega-lite/examples/facet_bullet.html) | Other Layered Plots | Five bullet charts in one panel: each row's ranges, measures and target are rescaled to a fraction of that row's top range, and a per-row tick scale in the original units is drawn under each bullet as a guide. Faceting is not covered by this study, so the per-row independent scales are flattened. | Faceting, Independent scales |
| [Layered Plot with Dual-Axis](https://vega.github.io/vega-lite/examples/layer_dual_axis.html) | Other Layered Plots | Seattle's monthly temperature band and precipitation line share one plot, but ElicitJS has one y scale per chart, so the precipitation is rescaled into temperature units by hand and its right-hand axis is a relabelled `axisY`. | Independent scales |
| [Population Pyramid](https://vega.github.io/vega-lite/examples/concat_population_pyramid.html) | Repeat & Concatenation | The pyramid itself fits one panel: female population as bars running left from a shared centre and male running right, by age group. The original builds it from three concatenated views; multiple views are not covered by this study, so the recreation flattens them into one. | Multi-view layout, Axis customization |
| [Projection explorer](https://vega.github.io/vega-lite/examples/geo_params_projections.html) | Maps (Geographic Displays) | The world map draws in any of ElicitJS's named projections, but the example is about switching projection from a dropdown bound to a parameter, which ElicitJS has no bound inputs for; this shows the default Equal Earth. | Bound input widgets, Projection options |
| [Earthquakes Example](https://vega.github.io/vega-lite/examples/interactive_geo_earthquakes.html) | Maps (Geographic Displays) | An orthographic globe with an ocean sphere, countries and earthquakes sized by magnitude; the rotation and size sliders that are the point of the example have no ElicitJS equivalent, so the globe is fixed at the initial rotation. | Bound input widgets |
| [Bar Chart with Highlighting on Hover and Selection on Click](https://vega.github.io/vega-lite/examples/interactive_bar_select_highlight.html) | Interactive Charts | The bar chart is exact, and hover and click-to-select reproduce as `effects` on `select()`; what is missing is the conditional encoding that fades every UNselected bar once something is picked. | Selection-driven encoding |
| [Interactive Legend](https://vega.github.io/vega-lite/examples/interactive_legend.html) | Interactive Charts | The centre-stacked streamgraph and its legend reproduce, with the stack offset computed in d3; clicking a legend entry to dim the other industries does not, because a legend click writes a row rather than driving a highlight. | Selection-driven encoding |
| [Scatterplot with External Links and Tooltips](https://vega.github.io/vega-lite/examples/point_href.html) | Interactive Charts | The hollow-point scatter coloured by origin and its name tooltip are exact; clicking a car to open a web search has no ElicitJS equivalent. | Hyperlinks |
| [Rectangular Brush](https://vega.github.io/vega-lite/examples/interactive_brush.html) | Interactive Charts | The scatter coloured by cylinders reproduces; the brush that greys out everything outside it does not, since an ElicitJS brush is a row of data, not a selection that conditions another mark's colour. | Selection-driven encoding |
| [Area Chart with Rectangular Brush](https://vega.github.io/vega-lite/examples/interactive_area_brush.html) | Interactive Charts | The area of total unemployment reproduces; brushing a span to repaint it goldenrod does not — though the interface rebuilds that highlight from an elicited span. | Selection-driven encoding |
| [Paintbrush Highlight](https://vega.github.io/vega-lite/examples/interactive_paintbrush.html) | Interactive Charts | The hollow scatter is exact, and nearest-point painting reproduces as a proximity `select()` whose rings stand in for the enlarged points; painting by hover alone (with shift to accumulate) does not, because selection is made by clicking. | Selection-driven encoding |
| [Query Widgets](https://vega.github.io/vega-lite/examples/interactive_query_widgets.html) | Interactive Charts | The chart in its initial state (4-cylinder 1977 cars enlarged and coloured by origin, the rest grey) reproduces with a precomputed column; the two range sliders that re-query it do not. | Bound input widgets, Selection-driven encoding |
| [Interactive Average](https://vega.github.io/vega-lite/examples/selection_layer_bar_month.html) | Interactive Charts | The monthly bars and the red mean rule reproduce, and the rule follows a selection — but the selection is made by clicking months (shift to add), not by brushing an interval. | Selection-driven encoding |
| [Multi Series Line Chart with an Interactive Line Highlight](https://vega.github.io/vega-lite/examples/interactive_line_hover.html) | Interactive Charts | The four price lines with end labels reproduce; highlighting the hovered line and greying out the rest does not. | Selection-driven encoding |
| [Multi Series Line Chart with Labels](https://vega.github.io/vega-lite/examples/interactive_multi_line_label.html) | Interactive Charts | The five price lines and a grey rule that follows the pointer reproduce; labelling every line's value at the nearest date does not — though the interface rebuilds it around a date you drag. | Selection-driven encoding |
| [Multi Series Line Chart with Tooltip via Pivot](https://vega.github.io/vega-lite/examples/interactive_multi_line_pivot_tooltip.html) | Interactive Charts | The five price lines and the pivoted rule per date, which shows on hover with every stock's price in its tooltip, reproduce; the points marking each line at the hovered date do not. | Selection-driven encoding |
| [Isotype Grid](https://vega.github.io/vega-lite/examples/isotype_grid.html) | Interactive Charts | The 10 × 10 grid of people reproduces with the original's own SVG person path, drawn by `shape`; brushing a rectangle of them to turn them red does not. The interfaces make "colour some of the hundred" the answer. | Selection-driven encoding |
| [Selectable Heatmap](https://vega.github.io/vega-lite/examples/selection_heatmap.html) | Interactive Charts | The confusion-matrix heatmap reproduces, and a clicked cell gets the black stroke through `effects.selected`; fading the unselected cells to half opacity does not. | Selection-driven encoding |
| [Interactive Index Chart](https://vega.github.io/vega-lite/examples/interactive_index_chart.html) | Interactive Charts | The index chart at its initial index date (January 2005) reproduces with the rebasing done in d3; moving the index by hovering does not — the interface makes the index date a dragged answer and rebases the lines around it. | Selection-driven encoding |
| [Search Input](https://vega.github.io/vega-lite/examples/param_search_input.html) | Interactive Charts | The scatter reproduces; the bound search box that dims every car whose name does not match does not. The interface recovers it by making the search text an elicited answer that a guide filters on. | Bound input widgets |
| [Change zorder on hover](https://vega.github.io/vega-lite/examples/selection_type_point_zorder.html) | Interactive Charts | The grey scatter reproduces, and a hovered car turns coral through `effects.hovered`; growing it to 400 px² and raising it above its neighbours does not, since an effect restyles a node but cannot resize or reorder it. | Selection-driven encoding |
| [Connections among Major U.S. Airports.](https://vega.github.io/vega-lite/examples/airport_connections.html) | Interactive Multi-View Displays | The map of states with every airport sized by its route count reproduces on an Albers USA projection; hovering an airport to draw its routes does not. The interface turns "show me the routes" into "which routes exist?". | Selection-driven encoding |
| [An interactive scatter plot of global health statistics by country and year.](https://vega.github.io/vega-lite/examples/interactive_global_development.html) | Interactive Multi-View Displays | The 1955 frame of the gapminder scatter, with its faint year watermark and a country label on hover, reproduces; the year slider and the hover / click trails do not. | Bound input widgets, Selection-driven encoding |

### Observable Plot (53)

| Example | Section | Why | Needs |
|---|---|---|---|
| [Background image](https://observablehq.com/@observablehq/plot-background-image) | Dot, Image, Text | The white penguin dots, grid and frame draw, but not the sea-ice photograph behind them. | Background image |
| [Image medals](https://observablehq.com/@observablehq/plot-image-medals) | Dot, Image, Text | Each president is a dot at their first inauguration and the share of people with any opinion of them; the portraits are missing. | Image mark |
| [Image scatterplot](https://observablehq.com/@observablehq/plot-image-scatterplot) | Dot, Image, Text | Net favourability against inauguration date draws as labelled dots; the portraits are missing. | Image mark |
| [Default image scatterplot](https://observablehq.com/@observablehq/plot-image-scatterplot-2) | Dot, Image, Text | Favourable against unfavourable opinion draws as dots with zero rules; the 16 px portraits are missing. | Image mark |
| [Sized hexbin heatmap](https://observablehq.com/@observablehq/plot-hexbin-binwidth) | Dot, Image, Text | Hexagonal bins computed by hand in pixel space draw as dots sized by count; the `binWidth` slider is missing, and hexbin itself is out of scope for an elicitation library. | Hexagonal binning, Bound input widgets |
| [Hexbin text](https://observablehq.com/@observablehq/plot-hexbin-text) | Dot, Image, Text | Hexagonal bins computed by hand draw as count labels at each bin centre; hexbin itself is out of scope for an elicitation library. | Hexagonal binning |
| [Beeswarm (dodge)](https://observablehq.com/@observablehq/plot-dodge-cars) | Dot, Image, Text | The beeswarm draws, but its packing is computed in JavaScript: ElicitJS has no dodge transform, so the layout is a static picture. | Dodge / beeswarm |
| [Barley trellis](https://observablehq.com/@observablehq/plot-barley-trellis) | Dot, Image, Text | All 120 yields draw on one chart. Faceting is not covered by this study, so the six site facets become one long categorical axis of site · variety rows. | Faceting |
| [The Wealth & Health of Nations](https://observablehq.com/@observablehq/plot-wealth-health-nations) | Dot, Image, Text | The final frame (each nation’s latest income, life expectancy and population) draws as a bubble chart on a log x axis; the animation scrubber is missing. | Bound input widgets |
| [Dot sort](https://observablehq.com/@observablehq/plot-dot-sort) | Dot, Image, Text | County populations draw as bubbles at county centroids over a state mesh (Albers USA), largest first; the sort toggle is missing. | Bound input widgets |
| [Isotype Chart](https://observablehq.com/@observablehq/plot-isotype-chart) | Dot, Image, Text | A unit chart of livestock emoji, one per million animals, drawn with `waffleX` and a symbol channel. Faceting is not covered by this study, so the country facets become combined row labels. | Faceting |
| [Bullet graph](https://observablehq.com/@observablehq/plot-bullet-graph) | Bar, Cell, Rect | Each bullet is a wide grey `barX` (share of population) with a narrower coloured `rectX` (share of cases) inside it; faceting is not covered by this study, so the five race panels are flattened into groups on one band axis instead of sitting side by side. | Faceting |
| [Stacked waffles](https://observablehq.com/@observablehq/plot-stacked-waffles) | Bar, Cell, Rect | Each (weight class, sex) count is a `waffleY` block of 10-athlete cells on a count axis, with the class on x and the sex on `xOffset`; the diverging layout (women up, men down) is not drawn. | Stack offsets |
| [Calendar](https://observablehq.com/@observablehq/plot-calendar) | Bar, Cell, Rect | Cells per trading day on a week × weekday grid coloured by the daily change, with month labels and month dividers drawn by a `guides.custom` layer. Faceting is not covered by this study, so the year facets are emulated with one band per (year, weekday), and only the last three years are shown. | Faceting |
| [Simplified calendar](https://observablehq.com/@observablehq/plot-dow-jones-calendar) | Bar, Cell, Rect | A `rect` per trading day on a week × weekday grid, coloured by daily change on a PiYG ramp, with the daily change as a tip. Faceting is not covered by this study, so the year facets are emulated with one band per (year, weekday). | Faceting |
| [Index chart](https://observablehq.com/@observablehq/plot-index-chart) | Area, Line | The four stocks normalised to a basis day on a log y axis, with end labels; the scrubber that moves the basis day is missing. | Bound input widgets, Label layout |
| [Gradient encoding](https://observablehq.com/@observablehq/plot-gradient-encoding) | Area, Line | The step line is rebuilt from two `rule` marks per day, each coloured by temperature on the `turbo` scheme; within a segment the colour is flat, because a line stroke takes no gradient. | Varying colour along a line |
| [Faceted area chart](https://observablehq.com/@observablehq/plot-faceted-areas) | Area, Line | Fourteen `areaY` series stacked into rows by an offset computed in JavaScript, each labelled at its first point. Faceting is not covered by this study, so the panels are a layout trick on one y scale. | Faceting |
| [Bollinger bands](https://observablehq.com/@observablehq/plot-bollinger-bands) | Area, Line | A 20-day, 2σ Bollinger band as an `areaY` span under a `lineY` of the closes; the two sliders that set N and K are missing. | Bound input widgets |
| [Line chart, percent change](https://observablehq.com/@observablehq/plot-line-chart-percent-change) | Area, Line | Apple’s price relative to its first close on a log y axis with percent ticks and a rule at 0%; the range input that moves the basis is missing. | Bound input widgets |
| [Ridgeline plot](https://observablehq.com/@observablehq/plot-ridgeline) | Area, Line | Thirty-eight overlapping ridges, one `areaY` + `lineY` pair per station so each ridge occludes the ones above it. Faceting is not covered by this study, so the facets are an offset in data units rather than an `fy` scale. | Faceting |
| [PSR B1919+21](https://observablehq.com/@observablehq/plot-psr-b1919-21) | Area, Line | The eighty pulses as stacked ridges, each a white-filled `areaY` under a `lineY` so lower pulses occlude upper ones. Faceting is not covered by this study, so the facets are a data-unit offset, and the fill runs to each ridge’s baseline rather than closing the line on itself. | Faceting |
| [Horizon chart](https://observablehq.com/@observablehq/plot-unemployment-horizon-chart) | Area, Line | Each industry folded into seven bands, every band an `areaY` span clamped to one band’s height and coloured on a YlGnBu ramp, stacked into rows by a data-unit offset. Horizon folding is computed by hand, and faceting is not covered by this study. | Horizon bands, Faceting |
| [Horizon chart 2](https://observablehq.com/@observablehq/plot-horizon) | Area, Line | Thirty-eight stations folded into five bands each, every band an `areaY` span clamped to one band and coloured on an ordinal Greens scale, with a legend for the band thresholds. Horizon folding is computed by hand, and faceting is not covered by this study, so the rows are a data-unit offset. | Horizon bands, Faceting, Bound input widgets |
| [Stacking order](https://observablehq.com/@observablehq/plot-stacking-order-and-reverse) | Area, Line | The stacked revenue areas draw with `areaY` over hand-computed `lo`/`hi` bounds; the `order` and `reverse` inputs the example is about become a fixed choice made in JavaScript. | Stack offsets, Bound input widgets |
| [Overlapping density estimations](https://observablehq.com/@observablehq/plot-overlapping-density-estimations) | Area, Line | The binned culmen-length proportions per species draw as translucent `areaY` bands under `lineY` outlines. Faceting is not covered by this study, so the two sex panels are emulated by offsetting each panel's baseline by hand. | Faceting |
| [Facet wrap](https://observablehq.com/@observablehq/plot-facet-wrap) | Area, Line | Fourteen small area charts in a three-column wrap, each industry's unemployment normalized to its own extent. Faceting is not covered by this study, so the wrap is emulated by placing every panel at an offset in one shared coordinate space. | Faceting |
| [Difference stroke](https://observablehq.com/@observablehq/plot-window-and-map) | Area, Line | Unemployment for 45 US metro divisions with each line coloured by its month-to-month change; since a `lineY` series has one stroke, every line is cut into one two-point series per month. | Varying colour along a line |
| [Spherical line with a varying stroke](https://observablehq.com/@observablehq/plot-spherical-line-with-a-varying-stroke) | Area, Line | The Beagle's route over an equirectangular world map, built from `geoBasemap` and a row-connecting `geoLine` whose legs follow great circles and clip at the antimeridian; the stroke that varies along the route is faked with one two-point series per leg. | Varying colour along a line |
| [Radar chart](https://observablehq.com/@observablehq/plot-radar-chart) | Area, Line | Built the way the original builds it — an azimuthal-equidistant projection centred on the North Pole, with each axis a longitude and each value a colatitude — from `geoBasemap` rings and spokes, `geoPolygon` areas, `geoPoint` dots with a value `tip`, and `geoText` labels. The areas are straight-edged rather than cardinal-closed curves. | More curve interpolators |
| [Radar chart, small multiples](https://observablehq.com/@observablehq/plot-radar-chart-faceted) | Area, Line | Eleven radar charts of car specifications in a 4 × 3 grid, each value normalized by its column maximum, with the raw value as a `tip`. Faceting is not covered by this study, and a polygon has no polar position channel, so every panel's rings, spokes and polygon are computed as planar coordinates offset by hand and drawn through an `identity` projection. | Faceting, Radius encoding, More curve interpolators |
| [Faceted lollipop](https://observablehq.com/@observablehq/plot-faceted-lollipop) | Rule, Tick | The lollipops (rule + point, coloured by age group) are reproduced; faceting is not covered by this study, so the six state facets are flattened into one band axis of state × age group, with state names drawn as text under each group. | Faceting |
| [Map small multiples](https://observablehq.com/@observablehq/plot-map-small-multiples) | Geo | The nation, state mesh and every store are drawn under an Albers projection; faceting is not covered by this study, so the five decade facets collapse into one map with stores coloured by decade. | Faceting |
| [Projection domain](https://observablehq.com/@observablehq/plot-projection-domain) | Geo | The rotated azimuthal-equidistant projection fitted to a `d3.geoCircle` domain, with graticule, land and the red circle, is reproduced for one fixed radius; the radius slider is not. | Bound input widgets |
| [World projections](https://observablehq.com/@observablehq/plot-world-projections) | Geo | Graticule, land and sphere outline under any named projection are reproduced, but only for one projection at a time: the dropdown that switches it is not. | Bound input widgets |
| [Earthquake globe](https://observablehq.com/@observablehq/plot-earthquake-globe) | Geo | The orthographic globe with land, sphere outline and a dot per earthquake sized by amplitude is reproduced at one rotation; the longitude slider is not. | Bound input widgets |
| [Hexbin map](https://observablehq.com/@observablehq/plot-hexbin-map) | Geo | The map and the binned dots — sized by store count, coloured by first opening year on the spectral scheme — draw correctly. Hexagonal binning is out of scope for an elicitation library, so it is written by hand in JS against a projection fitted by hand. | Hexagonal binning |
| [Centroid hexbin](https://observablehq.com/@observablehq/plot-centroid-hexbin) | Geo | County centroids binned into 20px hexagons, each drawn as a hollow hexagon `shape` sized by count. Hexagonal binning is out of scope for an elicitation library, so the centroids and the bins are computed by hand in JS. | Hexagonal binning |
| [Bivariate choropleth](https://observablehq.com/@observablehq/plot-bivariate-choropleth) | Geo | The county map coloured by a 3 × 3 diabetes × obesity class with the original nine-colour scheme is reproduced; the rotated-diamond bivariate legend is not. | Legend customization |
| [Barley Trellis plot with arrows](https://observablehq.com/@observablehq/plot-trellis-anomaly) | Arrow, Link, Tree, Vector | The 1931 → 1932 barley yield change per variety is drawn as a coloured span with a chevron `shape` arrowhead and a spectral legend; faceting is not covered by this study, so the six site facets become one long band axis of site · variety rows. | Faceting |
| [Phases of the moon](https://observablehq.com/@observablehq/plot-phases-of-the-moon) | Arrow, Link, Tree, Vector | A year of moons on a calendar grid, each a dark disc with its lit part drawn as a `shape` whose path is a function of the phase — the limb and an elliptical terminator, the outline Plot’s orthographic hemisphere projects to. The year and locale inputs are not reproduced. | Bound input widgets |
| [Election wind map](https://observablehq.com/@observablehq/plot-election-wind-map) | Arrow, Link, Tree, Vector | One arrow per county, tilted right and red or left and blue by the 2020 winner, with length √(margin × votes), over state and nation outlines — drawn as arrow-shaped polylines computed in JS on the pre-projected atlas. | Vector / arrow / spike |
| [Tree, tidy](https://observablehq.com/@observablehq/plot-tree-tidy) | Arrow, Link, Tree, Vector | The flare class hierarchy is drawn as a tidy tree — dots, horizontal Bézier links and end/start-anchored labels — but the hierarchy and its layout are computed with `d3.stratify` and `d3.tree` in JS; the network `link` mark only draws the result. | Tree / hierarchy layout |
| [Cluster diagram](https://observablehq.com/@observablehq/plot-cluster-diagram) | Arrow, Link, Tree, Vector | The flare hierarchy as a dendrogram — every leaf at the same depth, children sorted by height — is drawn by the network `link` mark, with `d3.cluster` doing the layout in JS. | Tree / hierarchy layout |
| [Indented tree diagram](https://observablehq.com/@observablehq/plot-custom-tree-layout) | Arrow, Link, Tree, Vector | The indented tree — depth on x, pre-order index on y, step links — is reproduced from a hand-computed layout (the same three-line `eachBefore` the original passes as `treeLayout`), drawn by the network `link` mark. | Tree / hierarchy layout |
| [Mandelbrot set](https://observablehq.com/@observablehq/plot-mandelbrot-set) | Contour, Raster, Density | The raster becomes a 100×78 grid of `rect` cells coloured by escape count: the same picture at a coarser resolution. Per-pixel rasters are out of scope for an elicitation library. | Raster |
| [Log heatmap](https://observablehq.com/@observablehq/plot-log-heatmap) | Contour, Raster, Density | The Goldstein–Price function sampled on an 80×80 grid of `rect` cells, coloured through a log-scaled magma ramp, with zero rules as guides. Per-pixel rasters are out of scope for an elicitation library. | Raster |
| [Small grid contours](https://observablehq.com/@observablehq/plot-small-grid-contours) | Contour, Raster, Density | The notebook’s first chart, a 10×10 grid of values drawn as `text` coloured by value, is reproduced; its contoured twin is not, since contours are out of scope for an elicitation library. | Contours & 2-D density |
| [Parallel coordinates](https://observablehq.com/@observablehq/plot-parcoords) | Axes | Parallel coordinates the way Plot draws them: a `lineX` over tidy (car, dimension, normalized value) rows, one series per car, coloured by fuel economy, with each axis’s ticks drawn by a `text` mark over context rows. The “color by” select is missing. | Bound input widgets |
| [Pointer transform](https://observablehq.com/@observablehq/plot-pointer-transform) | Tips and interactions | The penguin culmen scatter, with the big red dot that Plot’s pointer transform filters to the nearest penguin drawn by a `guides.custom` that tracks the pointer; the toggle is not bound. | Bound input widgets |
| [Pointer modes (x, y, and xy)](https://observablehq.com/@observablehq/plot-pointer-modes-x-y-and-xy) | Tips and interactions | The Apple `lineY` with a `tip` on every day; the select between Plot’s three pointer modes (nearest by x, by y, or by both) is missing. | Bound input widgets |
| [One-dimensional pointing](https://observablehq.com/@observablehq/plot-one-dimensional-pointing) | Tips and interactions | The histogram of Apple’s log₁₀ daily volume is a `rectY` over 40 bins computed with `d3.bin`, with a `tip` on each bar and a red dot at each bar’s centroid; one-dimensional pointing and its toggle, which are the example, are missing. | Bound input widgets |
| [Interactive tips with longer text](https://observablehq.com/@observablehq/plot-tips-longer-text) | Tips and interactions | The weight × height scatter with the 131 athletes who have a biography drawn dark on top, and a `tip` that shows each one’s name and biography. Faceting is not covered by this study, so both sexes share one panel. | Faceting |

## Recreated

### Vega-Lite (129)

- [Simple Bar Chart](https://vega.github.io/vega-lite/examples/bar.html) — 2 interfaces
- [Responsive Bar Chart](https://vega.github.io/vega-lite/examples/bar_size_responsive.html) — 1 interface · prep: Aggregate
- [Aggregate Bar Chart](https://vega.github.io/vega-lite/examples/bar_aggregate.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Aggregate Bar Chart (Sorted)](https://vega.github.io/vega-lite/examples/bar_aggregate_sort_by_encoding.html) — 2 interfaces · prep: Calculate / filter, Aggregate, Window
- [Grouped Bar Chart](https://vega.github.io/vega-lite/examples/bar_grouped.html) — 2 interfaces
- [Grouped Bar Chart (Multiple Measure with Repeat)](https://vega.github.io/vega-lite/examples/bar_grouped_repeated.html) — 1 interface · prep: Aggregate, Fold / pivot
- [Stacked Bar Chart](https://vega.github.io/vega-lite/examples/stacked_bar_weather.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Stacked Bar Chart with Rounded Corners](https://vega.github.io/vega-lite/examples/stacked_bar_count_corner_radius_mark.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Horizontal Stacked Bar Chart](https://vega.github.io/vega-lite/examples/stacked_bar_h.html) — 1 interface · prep: Aggregate
- [Normalized (Percentage) Stacked Bar Chart](https://vega.github.io/vega-lite/examples/stacked_bar_normalize.html) — 1 interface · prep: Calculate / filter, Aggregate, Stack offsets
- [Normalized (Percentage) Stacked Bar Chart With Labels](https://vega.github.io/vega-lite/examples/stacked_bar_h_normalized_labeled.html) — 1 interface · prep: Calculate / filter, Aggregate, Stack offsets
- [Gantt Chart (Ranged Bar Marks)](https://vega.github.io/vega-lite/examples/bar_gantt.html) — 1 interface
- [A Bar Chart Encoding Color Names in the Data](https://vega.github.io/vega-lite/examples/bar_color_disabled_scale.html) — 1 interface
- [Layered Bar Chart](https://vega.github.io/vega-lite/examples/bar_layered_transparent.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Diverging Stacked Bar Chart (Population Pyramid)](https://vega.github.io/vega-lite/examples/bar_diverging_stack_population_pyramid.html) — 1 interface · prep: Calculate / filter
- [Diverging Stacked Bar Chart (with Neutral Parts)](https://vega.github.io/vega-lite/examples/bar_diverging_stack_transform.html) — 1 interface · prep: Calculate / filter, Stack offsets, Aggregate
- [Bar Chart with Labels](https://vega.github.io/vega-lite/examples/layer_bar_labels.html) — 1 interface
- [Bar Chart with Label Overlays](https://vega.github.io/vega-lite/examples/layer_bar_labels_grey.html) — 1 interface · prep: Aggregate
- [Bar Chart showing Initials of Month Names](https://vega.github.io/vega-lite/examples/bar_month_temporal_initial.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Bar Chart with bars center-aligned with time unit ticks](https://vega.github.io/vega-lite/examples/bar_month_temporal_band_center.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Bar Chart with Negative Values and a Zero-Baseline](https://vega.github.io/vega-lite/examples/bar_negative.html) — 1 interface
- [Horizontal Bar Chart with Negative Values and Labels](https://vega.github.io/vega-lite/examples/bar_negative_horizontal_label.html) — 1 interface
- [Bar Chart with a Spacing-Saving Y-Axis](https://vega.github.io/vega-lite/examples/bar_axis_space_saving.html) — 1 interface · prep: Aggregate
- [Histogram](https://vega.github.io/vega-lite/examples/histogram.html) — 2 interfaces · prep: Bin
- [Histogram (from Binned Data)](https://vega.github.io/vega-lite/examples/bar_binned_data.html) — 1 interface
- [Log-scaled Histogram](https://vega.github.io/vega-lite/examples/histogram_log.html) — 1 interface · prep: Calculate / filter, Bin
- [Non-linear Histogram](https://vega.github.io/vega-lite/examples/histogram_nonlinear.html) — 1 interface
- [Relative Frequency Histogram](https://vega.github.io/vega-lite/examples/histogram_rel_freq.html) — 1 interface · prep: Bin, Aggregate, Calculate / filter
- [Density Plot](https://vega.github.io/vega-lite/examples/area_density.html) — 2 interfaces · prep: Density
- [2D Histogram Scatterplot](https://vega.github.io/vega-lite/examples/circle_binned.html) — 1 interface · prep: Bin, Aggregate
- [2D Histogram Heatmap](https://vega.github.io/vega-lite/examples/rect_binned_heatmap.html) — 1 interface · prep: Bin, Aggregate
- [Cumulative Frequency Distribution](https://vega.github.io/vega-lite/examples/area_cumulative_freq.html) — 2 interfaces · prep: Aggregate, Window
- [Layered Histogram and Cumulative Histogram](https://vega.github.io/vega-lite/examples/layer_cumulative_histogram.html) — 1 interface · prep: Bin, Window
- [Wilkinson Dot Plot](https://vega.github.io/vega-lite/examples/circle_wilkinson_dotplot.html) — 1 interface
- [Relative Bar Chart (Calculate Percentage of Total)](https://vega.github.io/vega-lite/examples/bar_percent_of_total.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Scatterplot](https://vega.github.io/vega-lite/examples/point_2d.html) — 2 interfaces · prep: Calculate / filter
- [1D Strip Plot](https://vega.github.io/vega-lite/examples/tick_dot.html) — 1 interface
- [Strip Plot](https://vega.github.io/vega-lite/examples/tick_strip.html) — 1 interface · prep: Calculate / filter
- [Colored Scatterplot](https://vega.github.io/vega-lite/examples/point_color_with_shape.html) — 2 interfaces · prep: Calculate / filter
- [Bubble Plot](https://vega.github.io/vega-lite/examples/point_bubble.html) — 1 interface · prep: Calculate / filter
- [Scatterplot with Null Values in Grey](https://vega.github.io/vega-lite/examples/point_invalid_color.html) — 1 interface · prep: Calculate / filter
- [Scatterplot with Filled Circles](https://vega.github.io/vega-lite/examples/circle.html) — 1 interface · prep: Calculate / filter
- [Bubble Plot (Gapminder)](https://vega.github.io/vega-lite/examples/circle_bubble_health_income.html) — 2 interfaces · prep: Calculate / filter
- [Bubble Plot (Natural Disasters)](https://vega.github.io/vega-lite/examples/circle_natural_disasters.html) — 1 interface · prep: Calculate / filter
- [Scatter Plot with Text Marks](https://vega.github.io/vega-lite/examples/text_scatterplot_colored.html) — 1 interface · prep: Calculate / filter
- [Strip plot with custom axis tick labels](https://vega.github.io/vega-lite/examples/circle_custom_tick_labels.html) — 2 interfaces · prep: Aggregate
- [Dot Plot with Jittering](https://vega.github.io/vega-lite/examples/point_offset_random.html) — 1 interface · prep: Calculate / filter
- [Line Chart](https://vega.github.io/vega-lite/examples/line.html) — 1 interface · prep: Calculate / filter
- [Line Chart with Point Markers](https://vega.github.io/vega-lite/examples/line_overlay.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Line Chart with Stroked Point Markers](https://vega.github.io/vega-lite/examples/line_overlay_stroked.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Multi Series Line Chart](https://vega.github.io/vega-lite/examples/line_color.html) — 1 interface · prep: Calculate / filter
- [Multi Series Line Chart with Repeat Operator](https://vega.github.io/vega-lite/examples/repeat_layer.html) — 1 interface · prep: Bin, Aggregate, Fold / pivot
- [Multi Series Line Chart with Halo Stroke](https://vega.github.io/vega-lite/examples/line_color_halo.html) — 1 interface · prep: Calculate / filter
- [Slope Graph](https://vega.github.io/vega-lite/examples/line_slope.html) — 1 interface · prep: Aggregate
- [Step Chart](https://vega.github.io/vega-lite/examples/line_step.html) — 1 interface · prep: Calculate / filter
- [Line Chart with Monotone Interpolation](https://vega.github.io/vega-lite/examples/line_monotone.html) — 1 interface · prep: Calculate / filter
- [Line Chart with Conditional Axis Properties](https://vega.github.io/vega-lite/examples/line_conditional_axis.html) — 1 interface · prep: Calculate / filter
- [Connected Scatterplot (Lines with Custom Paths)](https://vega.github.io/vega-lite/examples/connected_scatterplot.html) — 1 interface
- [Bump Chart](https://vega.github.io/vega-lite/examples/line_bump.html) — 1 interface
- [Line Chart with Markers and Invalid Values](https://vega.github.io/vega-lite/examples/line_skip_invalid_mid_overlay.html) — 1 interface
- [Carbon Dioxide in the Atmosphere](https://vega.github.io/vega-lite/examples/layer_line_co2_concentration.html) — 1 interface · prep: Calculate / filter, Aggregate
- [Line Charts Showing Ranks Over Time](https://vega.github.io/vega-lite/examples/window_rank.html) — 1 interface · prep: Window
- [Drawing Sine and Cosine Curves with the Sequence Generator](https://vega.github.io/vega-lite/examples/sequence_line_fold.html) — 1 interface · prep: Calculate / filter, Fold / pivot
- [Line chart with varying stroke dash](https://vega.github.io/vega-lite/examples/line_strokedash.html) — 1 interface · prep: Calculate / filter
- [Line chart with a dashed part](https://vega.github.io/vega-lite/examples/line_dashed_part.html) — 1 interface
- [Area Chart](https://vega.github.io/vega-lite/examples/area.html) — 2 interfaces · prep: Aggregate
- [Area Chart with Gradient](https://vega.github.io/vega-lite/examples/area_gradient.html) — 2 interfaces · prep: Calculate / filter
- [Area Chart with Overlaying Lines and Point Markers](https://vega.github.io/vega-lite/examples/area_overlay.html) — 2 interfaces · prep: Calculate / filter
- [Stacked Area Chart](https://vega.github.io/vega-lite/examples/stacked_area.html) — 2 interfaces · prep: Aggregate, Stack offsets
- [Normalized Stacked Area Chart](https://vega.github.io/vega-lite/examples/stacked_area_normalize.html) — 2 interfaces · prep: Aggregate, Stack offsets
- [Streamgraph](https://vega.github.io/vega-lite/examples/stacked_area_stream.html) — 2 interfaces · prep: Aggregate, Stack offsets
- [Horizon Graph](https://vega.github.io/vega-lite/examples/area_horizon.html) — 2 interfaces · prep: Calculate / filter
- [Table Heatmap](https://vega.github.io/vega-lite/examples/rect_heatmap.html) — 1 interface · prep: Aggregate
- [Annual Weather Heatmap](https://vega.github.io/vega-lite/examples/rect_heatmap_weather.html) — 1 interface · prep: Aggregate
- [Table Bubble Plot (Github Punch Card)](https://vega.github.io/vega-lite/examples/circle_github_punchcard.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Heatmap with Labels](https://vega.github.io/vega-lite/examples/layer_text_heatmap.html) — 1 interface · prep: Aggregate
- [Lasagna Plot (Dense Time-Series Heatmap)](https://vega.github.io/vega-lite/examples/rect_lasagna.html) — 1 interface · prep: Calculate / filter
- [Mosaic Chart with Labels](https://vega.github.io/vega-lite/examples/rect_mosaic_labelled_with_offset.html) — 1 interface · prep: Aggregate, Stack offsets, Window
- [Wind Vector Map](https://vega.github.io/vega-lite/examples/point_angle_windvector.html) — 1 interface · prep: Calculate / filter
- [Pie Chart](https://vega.github.io/vega-lite/examples/arc_pie.html) — 1 interface
- [Pie Chart with percentage_tooltip](https://vega.github.io/vega-lite/examples/arc_pie_normalize_tooltip.html) — 1 interface
- [Donut Chart](https://vega.github.io/vega-lite/examples/arc_donut.html) — 1 interface
- [Pie Chart with Labels](https://vega.github.io/vega-lite/examples/layer_arc_label.html) — 1 interface · prep: Calculate / filter
- [Radial Plot](https://vega.github.io/vega-lite/examples/arc_radial.html) — 2 interfaces · prep: Calculate / filter
- [Pyramid Pie Chart](https://vega.github.io/vega-lite/examples/arc_pie_pyramid.html) — 1 interface · prep: Calculate / filter
- [Calculate Difference from Average](https://vega.github.io/vega-lite/examples/joinaggregate_mean_difference.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Calculate Difference from Annual Average](https://vega.github.io/vega-lite/examples/joinaggregate_mean_difference_by_year.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Calculate Residuals](https://vega.github.io/vega-lite/examples/joinaggregate_residual_graph.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Waterfall Chart of Monthly Profit and Loss](https://vega.github.io/vega-lite/examples/waterfall_chart.html) — 1 interface · prep: Window, Calculate / filter
- [Filtering Top-K Items](https://vega.github.io/vega-lite/examples/window_top_k.html) — 1 interface · prep: Window, Calculate / filter
- [Top-K Plot with "Others"](https://vega.github.io/vega-lite/examples/window_top_k_others.html) — 1 interface · prep: Aggregate, Window, Calculate / filter
- [Using the lookup transform to combine data](https://vega.github.io/vega-lite/examples/lookup.html) — 1 interface · prep: Lookup / join, Aggregate
- [Parallel Coordinate Plot](https://vega.github.io/vega-lite/examples/parallel_coordinate.html) — 1 interface · prep: Fold / pivot, Aggregate, Calculate / filter
- [Bar Chart Showing Argmax Value](https://vega.github.io/vega-lite/examples/bar_argmax.html) — 1 interface · prep: Aggregate
- [Layering Averages over Raw Values](https://vega.github.io/vega-lite/examples/layer_line_mean_point_raw.html) — 3 interfaces · prep: Aggregate, Calculate / filter
- [Layering Rolling Averages over Raw Values](https://vega.github.io/vega-lite/examples/layer_line_rolling_mean_point_raw.html) — 2 interfaces · prep: Window
- [Line Chart to Show Benchmarking Results](https://vega.github.io/vega-lite/examples/layer_line_window.html) — 1 interface · prep: Window, Calculate / filter
- [Linear Regression](https://vega.github.io/vega-lite/examples/layer_point_line_regression.html) — 1 interface · prep: Regression
- [Loess Regression](https://vega.github.io/vega-lite/examples/layer_point_line_loess.html) — 1 interface · prep: Regression
- [Using window transform to impute missing values by averaging the previous and next values.](https://vega.github.io/vega-lite/examples/window_impute_null.html) — 1 interface · prep: Window, Calculate / filter
- [Ternary chart](https://vega.github.io/vega-lite/examples/ternary.html) — 1 interface · prep: Calculate / filter
- [Error Bars Showing Confidence Interval](https://vega.github.io/vega-lite/examples/layer_point_errorbar_ci.html) — 3 interfaces · prep: Aggregate
- [Error Bars Showing Standard Deviation](https://vega.github.io/vega-lite/examples/layer_point_errorbar_stdev.html) — 2 interfaces · prep: Aggregate
- [Line Chart with Confidence Interval Band](https://vega.github.io/vega-lite/examples/layer_line_errorband_ci.html) — 3 interfaces · prep: Aggregate, Calculate / filter
- [Scatterplot with Mean and Standard Deviation Overlay](https://vega.github.io/vega-lite/examples/layer_scatter_errorband_1D_stdev_global_mean.html) — 2 interfaces
- [Box Plot with Min/Max Whiskers](https://vega.github.io/vega-lite/examples/boxplot_minmax_2D_vertical.html) — 2 interfaces · prep: Aggregate
- [Tukey Box Plot (1.5 IQR)](https://vega.github.io/vega-lite/examples/boxplot_2D_vertical.html) — 1 interface · prep: Aggregate, Calculate / filter
- [Box Plot with Pre-Calculated Summaries](https://vega.github.io/vega-lite/examples/boxplot_preaggregated.html) — 1 interface · prep: Fold / pivot
- [Simple Bar Chart with Labels and Emojis](https://vega.github.io/vega-lite/examples/layer_bar_fruit.html) — 2 interfaces
- [Bar Chart Highlighting Values beyond a Threshold](https://vega.github.io/vega-lite/examples/layer_bar_annotations.html) — 2 interfaces · prep: Calculate / filter
- [Mean overlay over precipitation chart](https://vega.github.io/vega-lite/examples/layer_precipitation_mean.html) — 3 interfaces · prep: Aggregate, Calculate / filter
- [Histogram with a Global Mean Overlay](https://vega.github.io/vega-lite/examples/layer_histogram_global_mean.html) — 3 interfaces · prep: Bin, Aggregate
- [Line Chart with Highlighted Rectangles](https://vega.github.io/vega-lite/examples/layer_falkensee.html) — 2 interfaces · prep: Calculate / filter
- [Distributions and Medians of Likert Scale Ratings](https://vega.github.io/vega-lite/examples/layer_likert.html) — 2 interfaces · prep: Aggregate, Fold / pivot
- [Candlestick Chart](https://vega.github.io/vega-lite/examples/layer_candlestick.html) — 2 interfaces
- [Ranged Dot Plot](https://vega.github.io/vega-lite/examples/layer_ranged_dot.html) — 2 interfaces · prep: Calculate / filter
- [Weekly Weather Plot](https://vega.github.io/vega-lite/examples/bar_layered_weather.html) — 1 interface · prep: Fold / pivot
- [Wheat and Wages Example](https://vega.github.io/vega-lite/examples/wheat_wages.html) — 2 interfaces · prep: Calculate / filter
- [Choropleth of Unemployment Rate per County](https://vega.github.io/vega-lite/examples/geo_choropleth.html) — 2 interfaces · prep: Geo conversion, Lookup / join
- [One Dot per Zipcode in the U.S.](https://vega.github.io/vega-lite/examples/geo_circle.html) — 2 interfaces · prep: Calculate / filter
- [One Dot per Airport in the U.S. Overlayed on Geoshape](https://vega.github.io/vega-lite/examples/geo_layer.html) — 1 interface · prep: Geo conversion
- [Rules (line segments) Connecting SEA to every Airport Reachable via Direct Flights](https://vega.github.io/vega-lite/examples/geo_rule.html) — 1 interface · prep: Geo conversion, Lookup / join, Calculate / filter
- [U.S. State Capitals Overlayed on a Map of U.S.](https://vega.github.io/vega-lite/examples/geo_text.html) — 1 interface · prep: Geo conversion
- [Line between Airports in the U.S.](https://vega.github.io/vega-lite/examples/geo_line.html) — 2 interfaces · prep: Geo conversion, Lookup / join
- [London Tube Lines](https://vega.github.io/vega-lite/examples/geo_layer_line_london.html) — 2 interfaces · prep: Geo conversion, Calculate / filter
- [Histogram with Full-Height Hover Targets for Tooltip](https://vega.github.io/vega-lite/examples/interactive_histogram_full_height_hover.html) — 2 interfaces · prep: Bin
- [Scatterplot Pan & Zoom](https://vega.github.io/vega-lite/examples/selection_translate_scatterplot_drag.html) — 2 interfaces · prep: Calculate / filter
- [Multi Series Line Chart with an Interactive Point Highlight](https://vega.github.io/vega-lite/examples/interactive_line_point_hover.html) — 1 interface · prep: Calculate / filter
- [Multi Series Line Chart with Tooltip](https://vega.github.io/vega-lite/examples/interactive_multi_line_tooltip.html) — 1 interface

### Observable Plot (136)

- [Scatterplot](https://observablehq.com/@observablehq/plot-scatterplot) — 2 interfaces · prep: Calculate / filter
- [Scatterplot with color](https://observablehq.com/@observablehq/color-scatterplot) — 2 interfaces · prep: Calculate / filter
- [Diverging color scatterplot](https://observablehq.com/@observablehq/plot-diverging-color-scatterplot) — 1 interface
- [Symbol scatterplot](https://observablehq.com/@observablehq/plot-symbol-channel) — 1 interface · prep: Calculate / filter
- [Scatterplot with interactive tips](https://observablehq.com/@observablehq/scatterplot-with-interactive-tips) — 1 interface · prep: Calculate / filter
- [Proportional symbol scatterplot](https://observablehq.com/@observablehq/plot-proportional-symbol-scatterplot) — 1 interface · prep: Calculate / filter
- [Scatterplot with ordinal dimension](https://observablehq.com/@observablehq/plot-scatterplot-with-ordinal-dimension) — 2 interfaces · prep: Calculate / filter
- [Stacked dots](https://observablehq.com/@observablehq/plot-stacked-dots) — 1 interface · prep: Calculate / filter, Stack offsets
- [Quantile-quantile plot](https://observablehq.com/@observablehq/qq-plot) — 1 interface · prep: Calculate / filter, Window
- [Seattle temperature amplitude](https://observablehq.com/@observablehq/plot-temperature-amplitude) — 1 interface · prep: Calculate / filter
- [Simpson’s paradox](https://observablehq.com/@observablehq/plot-linear-regression-simpson) — 2 interfaces · prep: Regression
- [Dot plot](https://observablehq.com/@observablehq/plot-dot-plot) — 1 interface · prep: Fold / pivot, Aggregate, Calculate / filter
- [Ordinal scatterplot](https://observablehq.com/@observablehq/plot-ordinal-scatterplot) — 1 interface · prep: Aggregate
- [Dot heatmap](https://observablehq.com/@observablehq/plot-dot-heatmap) — 1 interface · prep: Bin
- [Text spiral](https://observablehq.com/@observablehq/plot-text-spiral) — 1 interface · prep: Calculate / filter
- [This is just to say](https://observablehq.com/@observablehq/plot-this-is-just-to-say) — 1 interface
- [Stem-and-leaf plot](https://observablehq.com/@observablehq/plot-caltrain-schedule) — 1 interface · prep: Stack offsets, Calculate / filter
- [Dot histogram](https://observablehq.com/@observablehq/plot-dot-bins) — 1 interface · prep: Bin
- [Bubble map](https://observablehq.com/@observablehq/plot-us-bubble-map) — 1 interface · prep: Geo conversion, Lookup / join
- [Horizontal bar chart](https://observablehq.com/@observablehq/plot-horizontal-bar-chart) — 1 interface · prep: Calculate / filter
- [Vertical bar chart](https://observablehq.com/@observablehq/plot-vertical-bar-chart) — 1 interface · prep: Calculate / filter
- [Grouped bar chart](https://observablehq.com/@observablehq/plot-grouped-bar-chart) — 1 interface · prep: Calculate / filter
- [Grouped bar chart 2](https://observablehq.com/@observablehq/plot-olympians-grouped-bar-chart) — 1 interface · prep: Aggregate
- [Diverging bars](https://observablehq.com/@observablehq/plot-state-population-change) — 1 interface · prep: Calculate / filter
- [Diverging stacked bars](https://observablehq.com/@observablehq/plot-diverging-stacked-bar) — 1 interface · prep: Aggregate, Stack offsets
- [Stacked bars](https://observablehq.com/@observablehq/plot-stacked-bars) — 1 interface · prep: Aggregate
- [Stacked bars 2](https://observablehq.com/@observablehq/plot-crimean-war-bary) — 1 interface · prep: Fold / pivot, Calculate / filter
- [Stacked rects](https://observablehq.com/@observablehq/plot-crimean-war-recty) — 1 interface · prep: Fold / pivot, Stack offsets, Calculate / filter
- [Vertical bars, rotated labels](https://observablehq.com/@observablehq/plot-vertical-bars-rotated-labels) — 1 interface · prep: Window, Calculate / filter
- [Horizontal bars with a label](https://observablehq.com/@observablehq/plot-horizontal-bar-chart-with-label) — 1 interface · prep: Window
- [Horizontal stacked bars](https://observablehq.com/@observablehq/plot-horizontal-stacked-bars) — 1 interface · prep: Aggregate, Stack offsets
- [Ordinal time bar chart](https://observablehq.com/@observablehq/plot-ordinal-bar-chart) — 1 interface · prep: Calculate / filter
- [Ordinal scale interval](https://observablehq.com/@observablehq/plot-ordinal-scale-interval) — 1 interface
- [Temporal bar chart](https://observablehq.com/@observablehq/plot-temporal-bar-chart) — 1 interface · prep: Calculate / filter
- [Binned box plot](https://observablehq.com/@observablehq/plot-binned-box-plot) — 3 interfaces · prep: Bin, Aggregate
- [Gradient bars](https://observablehq.com/@observablehq/plot-gradient-bars) — 1 interface
- [Stacked unit chart](https://observablehq.com/@observablehq/plot-colored-stacked-bar-chart) — 1 interface · prep: Calculate / filter
- [Civilizations timeline](https://observablehq.com/@observablehq/plot-civilizations-timeline) — 1 interface · prep: Calculate / filter
- [Single stacked bar](https://observablehq.com/@observablehq/plot-stacked-percentages) — 1 interface · prep: Stack offsets
- [Single stacked bar 2](https://observablehq.com/@observablehq/plot-single-stacked-bar) — 1 interface · prep: Aggregate, Stack offsets
- [Warming stripes](https://observablehq.com/@observablehq/plot-warming-stripes) — 1 interface · prep: Calculate / filter
- [Normal histogram](https://observablehq.com/@observablehq/plot-normal-histogram) — 1 interface · prep: Bin
- [Stacked histogram](https://observablehq.com/@observablehq/plot-vertical-histogram) — 1 interface · prep: Bin, Stack offsets
- [Overlapping histograms](https://observablehq.com/@observablehq/plot-overlapping-histogram) — 2 interfaces · prep: Bin
- [Highlighted bin](https://observablehq.com/@observablehq/plot-highlighted-bin) — 2 interfaces · prep: Bin, Aggregate
- [Pre-binned histogram](https://observablehq.com/@observablehq/plot-prebinned-histogram) — 2 interfaces · prep: Bin
- [Cumulative histogram](https://observablehq.com/@observablehq/plot-cumulative-histogram) — 1 interface · prep: Bin, Window
- [Percentogram](https://observablehq.com/@observablehq/plot-percentogram) — 2 interfaces · prep: Bin, Calculate / filter
- [Distribution of poverty](https://observablehq.com/@observablehq/plot-cumulative-distribution-of-poverty) — 1 interface · prep: Calculate / filter, Stack offsets
- [The Impact of Vaccines](https://observablehq.com/@observablehq/plot-impact-of-vaccines) — 1 interface · prep: Fold / pivot
- [Seattle temperature temporal heatmap](https://observablehq.com/@observablehq/plot-seattle-temperature-heatmap) — 2 interfaces · prep: Aggregate, Calculate / filter
- [Sorted heatmap](https://observablehq.com/@observablehq/plot-sorted-heatmap) — 1 interface · prep: Aggregate, Calculate / filter
- [Simpsons IMDB ratings](https://observablehq.com/@observablehq/plot-simpsons-ratings) — 1 interface · prep: Calculate / filter
- [Survey waffle](https://observablehq.com/@observablehq/plot-survey-waffle) — 1 interface
- [Correlation heatmap](https://observablehq.com/@fil/correlation-heatmap) — 1 interface · prep: Aggregate, Fold / pivot
- [Auto mark, heatmap](https://observablehq.com/@observablehq/plot-auto-mark-heatmap) — 1 interface · prep: Bin, Aggregate
- [Auto mark, heatmap 2](https://observablehq.com/@observablehq/plot-auto-mark-heatmap-2) — 1 interface · prep: Bin, Aggregate
- [Heatmap (continuous)](https://observablehq.com/@observablehq/plot-continuous-dimensions-heatmap) — 1 interface · prep: Bin, Aggregate
- [Basketball shot chart](https://observablehq.com/@observablehq/plot-lebron-james-shots) — 1 interface · prep: Bin, Aggregate, Calculate / filter
- [Marimekko chart](https://observablehq.com/@observablehq/plot-marimekko) — 1 interface · prep: Aggregate, Stack offsets
- [Grid choropleth](https://observablehq.com/@observablehq/observable-plot-grid-choropleth) — 2 interfaces · prep: Lookup / join, Calculate / filter
- [County bounding boxes](https://observablehq.com/@observablehq/plot-county-boxes) — 1 interface · prep: Geo conversion
- [Line chart](https://observablehq.com/@observablehq/plot-simple-line-chart) — 2 interfaces
- [Multi-line chart](https://observablehq.com/@observablehq/plot-multiple-line-chart) — 1 interface
- [Labeled multi-line chart](https://observablehq.com/@observablehq/plot-labeled-multi-line-chart) — 1 interface · prep: Calculate / filter
- [Area chart](https://observablehq.com/@observablehq/plot-area-chart) — 2 interfaces
- [Area chart with gradient](https://observablehq.com/@observablehq/plot-area-chart-with-gradient) — 2 interfaces
- [Difference chart](https://observablehq.com/@observablehq/plot-difference-chart) — 2 interfaces · prep: Calculate / filter
- [Burndown chart](https://observablehq.com/@observablehq/plot-burndown-chart) — 2 interfaces · prep: Bin, Stack offsets
- [Area-line custom mark](https://observablehq.com/@observablehq/plot-arealiney-custom-mark) — 2 interfaces
- [Random walk](https://observablehq.com/@observablehq/plot-random-walk) — 2 interfaces · prep: Window
- [Moving average](https://observablehq.com/@observablehq/plot-line-with-moving-average) — 1 interface · prep: Window
- [Line with missing data](https://observablehq.com/@observablehq/plot-line-chart-with-gaps) — 1 interface · prep: Calculate / filter
- [Line with sparse data](https://observablehq.com/@observablehq/plot-sparse-line) — 1 interface · prep: Calculate / filter
- [Rolling min and max](https://observablehq.com/@observablehq/plot-window-reduce) — 1 interface · prep: Window
- [Stacked areas](https://observablehq.com/@observablehq/plot-stacked-area-chart) — 2 interfaces · prep: Stack offsets
- [Population pyramid](https://observablehq.com/@observablehq/plot-population-pyramid) — 1 interface · prep: Stack offsets, Calculate / filter
- [Wiggle streamgraph](https://observablehq.com/@observablehq/plot-stack-offset) — 1 interface · prep: Stack offsets, Fold / pivot
- [Normalized stack](https://observablehq.com/@observablehq/plot-normalized-stack) — 1 interface · prep: Stack offsets
- [Euro parliament seats](https://observablehq.com/@observablehq/apportionment-of-seats-in-the-ep) — 1 interface · prep: Fold / pivot, Stack offsets, Calculate / filter
- [Ribbon chart](https://observablehq.com/@observablehq/plot-ribbon-chart) — 1 interface · prep: Stack offsets
- [Job vacancies](https://observablehq.com/@observablehq/plot-job-vacancies) — 1 interface · prep: Calculate / filter
- [Proportion plot](https://observablehq.com/@observablehq/plot-proportion-plot) — 1 interface · prep: Fold / pivot, Stack offsets, Calculate / filter
- [Continuous histogram](https://observablehq.com/@observablehq/plot-density-estimation) — 2 interfaces · prep: Bin
- [Variable fill area](https://observablehq.com/@observablehq/plot-variable-fill-area) — 1 interface · prep: Calculate / filter
- [Line chart with markers](https://observablehq.com/@observablehq/plot-line-chart-with-markers) — 1 interface · prep: Fold / pivot
- [Non-temporal line chart](https://observablehq.com/@observablehq/plot-non-temporal-line-chart) — 1 interface
- [Connected scatterplot](https://observablehq.com/@observablehq/plot-connected-scatterplot) — 1 interface · prep: Calculate / filter
- [Area chart, missing data](https://observablehq.com/@observablehq/plot-area-chart-missing-data) — 1 interface · prep: Calculate / filter
- [Slope chart](https://observablehq.com/@observablehq/plot-slope-chart) — 1 interface · prep: Calculate / filter
- [Slope chart II](https://observablehq.com/@observablehq/plot-cancer-survival-rates) — 1 interface · prep: Calculate / filter
- [Marey’s trains](https://observablehq.com/@observablehq/plot-mareys-trains) — 1 interface · prep: Calculate / filter
- [Candlestick chart](https://observablehq.com/@observablehq/plot-candlestick-chart) — 1 interface · prep: Calculate / filter
- [Band chart with rule](https://observablehq.com/@observablehq/plot-band-chart-with-rule) — 1 interface
- [Lollipop chart](https://observablehq.com/@observablehq/plot-lollipop) — 1 interface
- [Bar and tick](https://observablehq.com/@observablehq/plot-bar-and-tick) — 1 interface
- [Barcode chart](https://observablehq.com/@observablehq/plot-barcode) — 1 interface · prep: Fold / pivot, Calculate / filter
- [Germany traffic patterns](https://observablehq.com/@observablehq/plot-sorted-groups) — 1 interface · prep: Aggregate, Calculate / filter
- [Floor plan](https://observablehq.com/@observablehq/plot-floor-plan) — 2 interfaces
- [Polar projection](https://observablehq.com/@observablehq/plot-polar-projection) — 1 interface · prep: Geo conversion
- [Albers-USA projection](https://observablehq.com/@observablehq/plot-albers-usa-projection) — 1 interface · prep: Geo conversion
- [Centroid dot](https://observablehq.com/@observablehq/plot-centroid-dot) — 1 interface · prep: Geo conversion
- [State labels](https://observablehq.com/@observablehq/plot-state-labels) — 1 interface · prep: Geo conversion
- [State centroids](https://observablehq.com/@observablehq/plot-state-centroids) — 1 interface · prep: Geo conversion
- [V-Counties](https://observablehq.com/@observablehq/plot-v-counties) — 1 interface · prep: Geo conversion, Calculate / filter
- [Shockwave](https://observablehq.com/@observablehq/plot-shockwave) — 1 interface · prep: Geo conversion, Calculate / filter
- [Choropleth](https://observablehq.com/@observablehq/plot-choropleth) — 1 interface · prep: Geo conversion, Lookup / join, Bin
- [Finite state machine](https://observablehq.com/@observablehq/plot-finite-state-machine) — 1 interface · prep: Fold / pivot
- [Arc diagram](https://observablehq.com/@observablehq/plot-arc-diagram) — 1 interface · prep: Calculate / filter, Lookup / join
- [Arrow variation chart](https://observablehq.com/@observablehq/plot-arrow-variation-chart) — 1 interface · prep: Fold / pivot
- [Difference arrows](https://observablehq.com/@observablehq/plot-difference-arrows) — 1 interface · prep: Aggregate, Calculate / filter
- [Spike map](https://observablehq.com/@observablehq/plot-spike) — 1 interface · prep: Geo conversion, Lookup / join, Calculate / filter
- [Wind map](https://observablehq.com/@observablehq/plot-wind-map) — 1 interface · prep: Calculate / filter
- [Perlin noise](https://observablehq.com/@observablehq/plot-perlin-noise) — 1 interface · prep: Calculate / filter
- [Volcano raster](https://observablehq.com/@observablehq/plot-volcano-raster) — 1 interface · prep: Calculate / filter
- [Stroked contours](https://observablehq.com/@observablehq/plot-stroked-contours) — 1 interface · prep: Contours
- [Axis with wrapped labels](https://observablehq.com/@observablehq/plot-wrap-tick-labels) — 1 interface
- [ggplot2-style axes](https://observablehq.com/@observablehq/plot-ggplot2-style-axes) — 1 interface
- [Datawrapper-style date axis](https://observablehq.com/@observablehq/plot-datawrapper-style-date-axis) — 1 interface
- [New York Times-style axes](https://observablehq.com/@observablehq/plot-nyt-style-axes) — 1 interface
- [Data-based axis](https://observablehq.com/@observablehq/plot-data-based-axis) — 1 interface · prep: Calculate / filter
- [Major and minor axis ticks](https://observablehq.com/@observablehq/plot-major-and-minor-axis-ticks) — 1 interface
- [Delaunay links](https://observablehq.com/@observablehq/plot-delaunay-links) — 1 interface · prep: Delaunay / Voronoi
- [Delaunay & hull](https://observablehq.com/@observablehq/plot-delaunay-hull) — 1 interface · prep: Delaunay / Voronoi
- [Crosshair](https://observablehq.com/@observablehq/plot-crosshair) — 1 interface · prep: Calculate / filter
- [CrosshairX](https://observablehq.com/@observablehq/plot-crosshairx) — 1 interface
- [One-dimensional crosshair](https://observablehq.com/@observablehq/plot-one-dimensional-crosshair) — 1 interface
- [Color crosshair](https://observablehq.com/@observablehq/plot-color-crosshair) — 1 interface
- [Multi-series line chart, interactive tips](https://observablehq.com/@observablehq/plot-multi-series-line-chart-interactive-tips) — 1 interface
- [Pointer target position](https://observablehq.com/@observablehq/plot-pointer-target-position) — 1 interface
- [Line chart, interactive tip](https://observablehq.com/@observablehq/plot-line-chart-interactive-tip) — 1 interface
- [Static annotations](https://observablehq.com/@observablehq/plot-static-annotations) — 1 interface
- [Interactive tips with additional channels](https://observablehq.com/@observablehq/plot-tips-additional-channels) — 1 interface
- [Tip format](https://observablehq.com/@observablehq/plot-tip-format) — 1 interface
- [Tips, paired channels](https://observablehq.com/@observablehq/plot-tips-paired-channels) — 1 interface · prep: Bin
- [Map and tips](https://observablehq.com/@observablehq/plot-maps-tips) — 1 interface · prep: Geo conversion

## Vocabulary exercised by the interfaces

How many interfaces (including the Beyond page) use each piece of the edit / constraint vocabulary:

| Vocabulary | Interfaces |
|---|---:|
| `move()` | 239 |
| `slide()` | 11 |
| `resize()` | 6 |
| `rotate()` | 4 |
| `cycle()` | 23 |
| `create()` | 35 |
| `toggle()` | 8 |
| `remove()` | 32 |
| `set()` | 8 |
| `editText()` | 7 |
| `rank()` | 11 |
| `select()` | 16 |
| `brushSpan()` | 23 |
| `brushRect()` | 5 |
| `moveSpan()` | 1 |
| `edit.line.sweep()` | 47 |
| `edit.line.draw()` | 13 |
| `edit.line.anchor()` | 8 |
| `edit.line.newSeries()` | 4 |
| `edit.line.removeSeries()` | 3 |
| `pick: "sweep"` | 18 |
| `pick: "nearest"` | 21 |
| `edit.stack.cut()` | 7 |
| `edit.stack.edge()` | 17 |
| `edit.stack.merge()` | 7 |
| `edit.trend.` | 10 |
| `edit.waffle.fill()` | 7 |
| `edit.legend.` | 16 |
| `edit.scale.categories()` | 5 |
| `edit.axis.scale()` | 1 |
| `edit.network.` | 6 |
| `edit.geo.` | 29 |
| `maintainSum()` | 22 |
| `clamp()` | 127 |
| `snap()` | 44 |
| `count()` | 35 |
| `unique()` | 5 |
| `ordering()` | 70 |
| `monotonic()` | 13 |
| `spacing()` | 1 |
| `constraints.custom()` | 26 |
| `lock:` | 93 |
| `stage:` | 17 |
| `open: true` | 9 |
| `widgets.` | 2 |
| `guides.` | 97 |

