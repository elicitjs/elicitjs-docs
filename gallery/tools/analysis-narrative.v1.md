# ElicitJS gallery study: outcome analysis

We tried to rebuild every example in the Vega-Lite gallery (189) and the Observable Plot gallery (220) with ElicitJS. Where that worked, we designed one or more elicitation interfaces on the result: a live chart whose gestures write the reader's answer back to data. Each example was judged on one rule: can it be built from ElicitJS's existing marks with minimal customization? Computing data in plain JavaScript first counts as minimal. Writing a new mark with the authoring kit does not. Every recreation and interface was rendered in Chromium and had to draw, raise no error, and emit no `[elicit]` warning. Every gesture was checked to actually change the data.

## Headline

- **85% of the examples can be drawn**: 53% fully and 32% partly. The two galleries come out almost the same: Vega-Lite 58% full and 27% partial, Plot 50% full and 36% partial. Each gallery has 15% that can't be drawn.
- **The core of statistical graphics is covered.** Every Vega-Lite bar chart is recreated or partly recreated, and so is every Plot bar, cell and rect chart (40 of 47 in full). The same goes for every line and area chart in both galleries, error bars, box plots, pies, heatmaps, strip and scatter plots, waffles, and the Vega-Lite maps of points, lines and choropleths. Two Plot network diagrams (a finite-state machine and an arc diagram) map directly onto ElicitJS's network structure.
- **What can't be drawn falls into three groups**: several views in one spec (faceting and concatenation), geometry computed from a density (contours, Voronoi, rasters, hexbins), and view-only interaction (selections, tooltips, input widgets, zoom).
- **The galleries yielded 385 elicitation interfaces**, plus 12 on the Beyond page that neither library can express.

## What can't be created, and why

### 1. More than one view

Faceting blocks 18 examples and degrades 24. Multi-view layout (concat, repeat, marginal plots, overview + detail) blocks 17. Together they account for most of the Vega-Lite "Faceting", "Repeat & Concatenation" and "Interactive Multi-View" sections.

An ElicitJS chart is one coordinate frame over one dataset, and that is deliberate. Faceting is the strongest case for relaxing it: 12 examples need nothing else. For elicitation, small multiples are also the natural way to ask for one distribution per group. The rows already carry the grouping field, so a facet over the elicited table would partition rows rather than add a second data path. Concatenated dashboards with linked views are a much bigger step, and they matter less for asking questions.

### 2. Geometry derived from a field

Contours and 2-D density block 17 examples, Delaunay/Voronoi 6, and rasters, hexbins, dodge and clipping a few each. Almost all of Plot's "Contour, Raster, Density" and "Delaunay, Voronoi" sections are here.

These are transforms whose output is new geometry rather than rows, so an edit on them has no obvious inverse. What would dragging a contour write? Where the geometry is a polyline, a recreation still works by computing it with d3 first: the stroked contours, Delaunay links and Delaunay hull are all recreated this way. Filled regions and per-pixel rasters are not. They are probably out of scope for an elicitation grammar, except as read-only context (see §5).

### 3. View interaction

ElicitJS's interaction model writes data. It has no parameter system that changes how other marks draw. So none of the 47 examples in Vega-Lite's interactive sections and Plot's "Tips and interactions" is fully reproduced. Selection-driven encoding blocks 10 and degrades 17. Tooltips degrade 22. Bound input widgets degrade 18, and pan and zoom block 4 and degrade 2.

Even so, 38 of the 47 still draw their chart, and each of those got an interface that translates the view interaction into a question:

- a brush becomes a region you answer with (`brushRect`);
- a click highlight becomes a row you select;
- a legend filter becomes a category you pick;
- a crosshair becomes a nearest-pick on the value you mean.

The other 9 are linked multi-view dashboards (§1).

The original's highlight or filter often comes back as feedback: a `guides.custom` reads the answer and redraws it, for example colouring the cars inside your brush. Tooltips are the cheapest and broadest of these to add.

### 4. Chrome and styling

Titles, axis customization, gradients, dashes as an encoding, colour varying along a line, line gaps at missing values, extra curve types, label layout, image marks and legend layouts rarely block an example outright, but together they degrade about 40. Each one is a small, separable addition.

### 5. One chart, one table

One structural limit came up in every section. A mark is a view over the one elicited dataset, so reference data of a different shape can't sit beside the answer: observed points behind a trend you draw, a history series behind a brush, labels from another table. Authors drew such context as `guides.custom` background nodes, or merged it into the answer table and `lock`ed it. Both work, but the spec stops saying what is data and what is context. A read-only context layer (`layer-data` in the feature table) would fix this cleanly. It would also absorb much of §2: a contour or raster drawn as context needs no inverse.

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

- `move` (217 interfaces), `lock` (107) and `clamp` (103): positional editing with bounds over partly-given data;
- `guides.*` (149), mostly reference lines, regions, and context drawn from the answer;
- `snap` (43), `create` (34), `count` (34), `ordering` (31), `edit.geo.*` (31), `remove` (31).

Every other piece of the vocabulary also appears: the stack edits (`cut`/`edge`/`merge`), the line edits (`sweep`/`draw`/`anchor`/`newSeries`), trends and bands, waffle fill, network connect, legend and scale-domain edits, `rank`, `cycle`, `select`, stages and `open` domains.

Four patterns recur across chart types:

1. **Given + predicted.** `lock: 'seed'` turns observed rows into context and leaves only the future, the missing bar or the new series to answer.
2. **Answer as data, context as guide.** The answer is rows; the feedback is a guide computed from them, so the original's highlight or reference line reappears as a response to the reader.
3. **Staged protocols.** Guess, reveal, revise, or anchor first and range second, declared with `stage` on each edit.
4. **Invariants instead of transforms.** `maintainSum`, `ordering`, `monotonic` and `constraints.custom` keep derived structure true under any gesture.

## Library issues the study surfaced

Authoring about 750 specs found roughly 40 library issues, listed with minimal cases in `tools/LIBRARY-FINDINGS.md`. The most important are:

- **Silently written wrong data.** Examples: `snap` turns a date into a number, `editText` stores numbers as strings, and a second `edit.geo.draw` stroke continues the first.
- **Edits that silently do nothing.** Examples:
  - the interaction plane stays on top after a stage change;
  - sweep doesn't work on bars;
  - an axis edit blocks every mark drag.
- **Continuous colour schemes keep only their end colours.** This was reported by 8 of 13 authors.
- **A horizontal y-axis title** that collides with the tick labels; almost every author dropped it.

## Recommended priorities

1. **Fix the silent failures** in `tools/LIBRARY-FINDINGS.md` §1–3, starting with the ones that write wrong data.
2. **Faceting over the elicited table.** It unlocks 12 examples outright and improves 24, and per-group elicitation is a common survey need.
3. **Read-only context layers**, so reference data and derived geometry can sit beside the answer.
4. **Cheap, broad chrome**: tooltips, titles, a rotated y-axis title, gradients, dashes, gaps at missing values.
5. **Out of scope** for now: contour, Voronoi and raster as editable marks, and linked multi-view dashboards.
