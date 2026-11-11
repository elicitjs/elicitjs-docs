# ElicitJS findings from the gallery study

> **Status (2026-11-10):** every numbered item in sections 1–3 was fixed on the library's `gallery-findings`
> branch; the last column says how. Sections 4–6 are annotated in place. Section 7 records what moving the
> entries from context tables to context rows found: the drawing bugs are fixed, three questions are open.
> Section 8 records the style and theme limits, all fixed.
> The original report is kept as `LIBRARY-FINDINGS.v1.md`.

Building ~350 recreations and ~400 interfaces surfaced these library issues.
Each was hit while authoring, and most were reported independently by more than
one author (the count in brackets). They are grouped by how much they hurt: a
bug that silently writes wrong data is worse than one that silently does
nothing, which is worse than one that draws wrong.

## 1. Silently writes wrong or inconsistent data

| # | Issue | Minimal case | Where | Status |
|---|---|---|---|---|
| 1 | `snap()` on a temporal field stores a number. | `snap({ field: 'Date', step })` on a dragged `ruleX` turns a `Date` into epoch ms. | constraints/snap | fixed |
| 2 | `editText()` on a quantitative field stores a string. | Typing `250` writes `"250"`; nothing coerces or warns. | edit/basic `editText` | fixed |
| 3 | `edit.geo.draw`: a second stroke continues the first stroke's row; `edit.geo.dragVertex` on the same mark never fires. | Draw two strokes in the docs example "draw-a-path-across-vancouver". `drawIndex` is missing from the draw driver's `sessionKeys`. | edit/drivers (geo draw) | fixed |
| 4 | Line edits mint series key `0` instead of the next value of a declared categorical domain [3]. | `symbol: { type: 'categorical', domain: [..., 'IBM'] }`; `edit.line.draw`/`anchor`/`newSeries` write `symbol: 0`. `nextSeriesKey` vs `mintDatum`'s `nextCategory`. | edit/line | fixed |
| 5 | `edit.line.draw` (`into: 'nearest'`) near a LOCKED series appends rows to it; with string keys a new series can reuse an existing key. | | edit/line | fixed |
| 6 | `edit.stack.cut({ label: fn })` stringifies the function into the category name. | Mints `'(k) => "sport " + k 2'`. `types.d.ts` documents `string \| (n) => string`. | `nextCategory` | fixed |
| 7 | `snap({ field: ['a', 'b'] })` snaps only `field[0]`, on the active row only [2]; `snap` after `edit.stack.edge/cut` breaks the stack total. | | constraints/define `applyConstraint` | fixed |
| 8 | `maintainSum` assumes non-negative values: `redistribute` clamps to `[0, total]`, so `total: -100` zeroes every row. | | constraints/maintainSum | fixed |
| 9 | `unique()` treats `null` as a category, so rows seeded with `null` reject every answer. | `unique({ field: 'sport' })` over unanswered rows. | constraints/unique | fixed |
| 10 | `monotonic` + `lock` can leave the run non-monotonic; with `clamp` first the drag is dropped. `clamp` only clamps the active row, never rows another constraint pushed. | `lineY` y = [50,50,50], `lock: d => d.x === 0`, `monotonic({ field: 'y', along: 'x' })`; drag x=1 to 40 → [50,40,50]. | constraint ordering / invariants | fixed |
| 11 | `brushSpan` on a VERTICAL span swaps low/high mid-gesture (`recenterSpan` gives the smaller *pixel* to the first channel); with `ordering` every body drag collapses the span to one value [2]. | `barY({ channels: { x, y1: 'low', y2: 'high' }, edits: [brushSpan({ channels: ['y1','y2'] })] })` + `ordering({ field: ['low','high'] })`. | edit/basic `recenterSpan` | fixed |
| 12 | `directed: false` in the bare links-table form becomes a COLUMN named `directed`; only `{ directed, fields }` is read. No warning. | | core/schema `normalizeTable` | fixed |
| 13 | `rank()` dragged across several slots swaps with every row holding the target rank, one swap per tick. Valid permutation, but surprising. | | edit/basic `rank` | fixed |

## 2. Silently does nothing (an edit that is dead with no warning)

| # | Issue | Minimal case / cause | Status |
|---|---|---|---|
| 14 | After a stage change the interaction PLANE stays on top, so stage-1 direct edits are unreachable [2]. | D3 renderer raises the plane when `planeOnTop` is true but never lowers it when it flips back. `lineY({ edits: [edit.line.draw({ stage: 0 })], channels: { y: { field, edit: move({ stage: 1 }) } } })` → after `nextStage()` the handles are under `rect.plane`. Same with a stage-0 `pick: 'probe'`. | fixed |
| 15 | `move({ pick: 'sweep' })` on `bar`/`rect` never edits [3]. | `nearestMarkOnAxis` only targets nodes with `cx`/`cy`. | fixed |
| 16 | `edits: [edit.line.sweep()]` at MARK level is inert [2]; only `y: { field, edit: edit.line.sweep() }` works. `handles: false` on an `area` kills sweep, though the docs say a line with `handles: false` is still sweepable. | fixed |
| 17 | An axis edit blocks every mark drag. | `axisX({ edit: edit.axis.scale() })` raises the plane (`pick: 'axisDrag'` → `needsPlaneOnTop`), so `barX` `move()` can't be grabbed. | fixed |
| 18 | A direct edit beside a sweep is unreachable even with disjoint `when` modifiers. | `move({ when: when.shift })` + `edit.line.sweep({ when: when.noShift })`: the sweep raises the plane. | fixed |
| 19 | `brushSpan()` without `channels` does nothing (`ctx.channels` empty); a body drag on an `areaY` `y1/y2` span does nothing (`recenterSpan` reads `node.height`). | fixed |
| 20 | `edit.line.anchor({ into: 'nearest' })` can't extend a locked line [2]: the nearest search skips locked rows, so the click starts series `0`. | fixed |
| 21 | A `sticker` whose only edit is on its `ports` channel is pointer-transparent, so its ports never show on hover. | fixed |

## 3. Silently draws wrong

| # | Issue | Cause / case | Status |
|---|---|---|---|
| 22 | Named schemes on a CONTINUOUS colour scale keep only their end colours [8]. `viridis` comes out purple→brown→yellow, `turbo` black→dark red, `RdBu` grey. A 3-stop `range` uses only two stops. | `schemeRange` (core/encoding.js): the sequential branch returns `[interp(0), interp(1)]`; the default branch quantizes to the domain length (2). | fixed |
| 23 | An unknown scheme name (`'YlGnBu'`, `'PRGn'`) silently falls back to the default ramp [3]. | No warning. | fixed |
| 24 | An adopted d3 continuous scale ignores the schema domain [2] and maps over `[0, 1]`. | `adoptScale` applies the domain only when `!scale.domain().length`, but d3 scales start at `[0, 1]`. | fixed |
| 25 | `area` over an ordinal x joins categories alphabetically, so the outline crosses itself [3]. | With `connect: 'domain'`, `area` sorts by the raw value, `line` by pixel. | fixed |
| 26 | A clockwise `arc` (`start: 90, end: -270`) draws no slices. | `usable = span - pad*n` goes negative in plot/arc.js. | fixed |
| 27 | Rows missing the y field are drawn at a fallback position, and NaN corrupts the path. There is no `defined` gap behaviour [3]. | wheat.json's last `wages` rows. | fixed |
| 28 | A constant `stroke` on one line mark counts as an encoding and rotates another mark's palette family. | A white halo line before a coloured `stroke: { field }` line gives Dark2 instead of tableau. | fixed |
| 29 | `area` applies `curve` to the whole closed polygon, so a `stepAfter` top gets a `stepBefore` bottom. | fixed |
| 30 | A `series` field holding `Date` objects splits into one series per row (Map keyed by identity). | fixed |
| 31 | The waffle count axis is wrong when the waffle is width-limited (square cells). | `waffleY({ unit: 5, multiple: 10 })` with `axes: { count: true }`. | fixed |
| 32 | `guides.region` ignores `label` and `stroke` (they are in its allow-list). `guides.remaining` ignores `format`, and pluralises naively ("50 %s left"). `guides.proximity()` throws with no options. | fixed |
| 33 | Background guide nodes are grouped by type rather than kept in array order (lines always under paths). Guide rects paint above the grid. | fixed |
| 34 | Text: `lineAnchor: 'top'` is ignored on wrapped text (the block is centred). `angle` on text MARKS renders tiny clipped glyphs. `geoText` with `lat: { datum }` draws nothing. | fixed (lineAnchor, geo `{ value }`); `angle` on text stays scaled — use `scale: null` for raw degrees |
| 35 | A `{ fn }`-only value channel crashes (`Cannot read properties of undefined (reading 'range')`). A positional `{ fn }` lands in pixel space next to field-driven marks. | fixed (crash); a positional `{ fn }` stays visual space by design |
| 36 | `geoLine` in row mode connects projected points in pixel space: no great circles, no antimeridian clipping. | fixed |
| 37 | Legend: the title isn't measured, so it is clipped [5]. Label width is a character-count estimate (clips "AAPL"). A bottom legend doesn't wrap. A right-anchored ramp's labels can clip. When two marks state one encoding, the second's `legend` option is ignored. | fixed |

## 4. Papercuts every author hit

- **The y-axis title is horizontal** … — *fixed*: it runs along the axis, past the measured tick labels; `titleAngle: 0` lays it flat.
- **Band and point y axes put `domain[0]` at the bottom.** — *documented, not changed*: `reverse: true` lists top-down; flipping the default would silently reorder every existing chart.
- **`line` and `area` draw vertex handles with no edit attached** — *fixed*: handles draw only when the mark carries an edit; `handles: 'hit'` keeps invisible targets for a sweep.
- **An explicit `axisY()` / `gridX()` in `marks`/`elements` removes that channel's implicit axis.**
- **`slide({ axis: 'x' })` defaults to `increase: 'left'`** — *fixed*: `right` is the default.
- **`edit.scale.categories()` "＋" only extends the domain.** The axis docs say "Double-click ＋ to add a bar". Rename starts only from the swatch, not the label.
- **Locked rows still draw stack seam handles** (inert, but they look grabbable).
- **`angle` is counter-clockwise math degrees**, the opposite sign to Plot's `rotate`.
- **One chart is one table.** — *fixed*: `context` on the spec (`true`, or a predicate over the seeded rows) marks reference rows of the elicited table, which are drawn, read-only, and left out of `getData()`. A first fix, a separate context table (`{ context: true, fields }`), restated every shared column and was replaced; it now throws with the new spelling.

## 5. False-positive warnings

- `slide()` on a sequential `fill` warns … — *fixed*: slide declares `inverts: 'domain'`, so the guard skips it.
- `projection: { type: 'identity', … }` warns "reversed ring winding" — *fixed*: the check skips planar (identity) projections.
- `warnDuplicatePlaneEdits` fires for `edit.axis.scale()` + `move({ pick: 'nearest' })` — *fixed*: domain and selection edits are exempt, and an axis edit is a direct edit now.

## 6. Missing warnings (validation gaps)

An unknown colour scheme; `guides.region({ label })`; a mark-level `edit.line.sweep()`; `brushSpan()` with no channels; `directed` in the bare table form; a sweep on a bar; an arc with a negative usable span. — *fixed*: each now warns (`scheme:*`, `*:nochannel:*`, `schema:*:fact-as-column`, `arc:span`) or works (`region` label, `brushSpan` takes the mark's pair, a sweep on a bar).

## 7. Found while moving to context rows (2026-11-08)

Context rows share the elicited table, so every mark over the table sees every row, including rows that fill
none of its columns. That exposed one bug class in many marks, and three open questions.

**Fixed: a row that doesn't fill a mark's columns drew anyway.** The documented rule is that a missing value
draws nothing; these marks fell back to a position instead. Each now skips the row (`missingValue`), and
`test/context-rows.test.js` checks every mark.

| Mark | What it drew for such a row |
|---|---|
| `text` | the label at the centre of the plot |
| `rule` (span mode) | a full-length line at the centre, or a zero-length line at the baseline |
| `trend`, `trendBand` | a flat line at intercept 0 with handles (hundreds per chart) |
| `line`, `area` | a point at the centre, breaking the path there |
| `shape`, `ellipse` | the shape at the centre |
| `curve`, `needle` | a chord at fixed fractions of the plot; a needle at 0° |
| `rect` | a zero-size rect at the origin |
| `bar`, `waffle`, `dotStack` | a row with no category fell into the first band |

A bar or waffle with a category and no value keeps its empty affordance (a zero-height bar, an empty grid),
which a nearest pick can still fill. A line still breaks at a row that has its x but no value: that is the gap
rule, and an entry whose context shares the x column uses a context-only `series` or `connect: 'sequence'`.

**Open: decisions the library hasn't made.**

| # | Issue | Minimal case | Effect in the gallery |
|---|---|---|---|
| 38 | `count({ max })` counts context rows, and `strategy: 'replace'` drops the oldest rows, which are the context rows, so the lock refuses the whole edit. | `context: true` over 10 rows, `create()`, `count({ max: 1 })`: every click is refused. | Five interfaces cap at `context.length + N` with `strategy: 'reject'`, and three `lock: 'seed'` interfaces already did the same arithmetic over locked rows (one with the default `replace`, which works only because the lock refuses the drop). "Hover, then commit" used to replace your answer on a second click and now refuses it. Counting only unlocked rows would restore `replace`, but changes `count` beside `lock`. |
| 39 | A created row gets every declared column as `null`, including columns only context rows fill. | `schema: { x, y, gx, gy }`, `context: true`, `edit.line.draw()`: drawn rows read `{ x, y, gx: null, gy: null }`. | About a dozen creating interfaces now report extra `null` keys. Data at load is unchanged. |
| 40 | Handles draw on locked rows: inert, but they look grabbable. Handle nodes carry no common tag, so the engine can't hide them. | A line with an edit over shared columns: every context point gets a dot. Stack seams likewise. | Most entries give context its own columns, drawn by a mark with no edit, partly to avoid this. "Survey a new island" (stacked bars) shows inert seam dots on its context bars. |

Two smaller notes. `toggle` finds a slot's occupant by its column values, so a toggle grid can't share its key
columns with context rows (it would toggle the locked row and be refused). Merging tables changes the order of
a categorical domain's union, so the answer's categories must be listed first to keep their colours.


## 8. Style and theme customization (fixed 2026-11-10)

Every gap below was a STYLE limit: the chart drew, but an entry had to fake a piece of chrome with a mark,
cut a label short, or list a cosmetic difference. All are fixed in the library's theme and axis options, and
each entry now uses the option. The named themes (`theme: "nyt"`, seventeen in all, fourteen transcribed from
[Flint](https://github.com/microsoft/flint-chart)) came out of the same pass; see `/theming/themes`.

| # | Issue | Entries | Status |
|---|---|---|---|
| 41 | An axis cannot turn its tick labels, so rotated labels were a `text` mark under an axis with blank labels, or were cut to three letters. | plot-olympians-grouped-bar-chart, plot-vertical-bars-rotated-labels, vl-bar_grouped_repeated | fixed — `labelAngle` on `axis()` and `theme.axis`; the axis reserves the room the turned labels need. |
| 42 | A tick label is one line, so a date axis could not put the year under its January. | plot-datawrapper-style-date-axis, vl-line_conditional_axis | fixed — a `\n` in the formatted label starts a second line. |
| 43 | Tick length, tick colour, label weight and gridline dash cannot vary per tick, so a conditional grid was a `guides.rule` per tick. | vl-line_conditional_axis | fixed — `tickSize`, `stroke`, `fill`, `fontWeight` on an axis and `stroke`, `strokeWidth`, `strokeDash` on a grid take `(value, index) => …`. |
| 44 | No plot-area fill: `theme.background` greys the margins too, and a `guides.region` paints over the grid. | plot-ggplot2-style-axes | fixed — `theme.panel: { fill, stroke }` paints under the grid and can frame the plot. |
| 45 | No zero gridline, so a black line at 0 was a `ruleY`/`ruleX` mark or a `guides.rule`. | vl-bar_negative, vl-bar_negative_horizontal_label, vl-concat_layer_voyager_result | fixed — a grid's `zero` option and `theme.grid.zero`. |
| 46 | An axis `fill` colours its labels and title together. | vl-layer_dual_axis | fixed — `titleFill`, `titleFontSize`, `titleFontWeight`, `titlePadding`. |
| 47 | The text mark has no font weight, style or family. | plot-proportion-plot | fixed — `fontWeight`, `fontStyle`, `fontFamily`, each a constant or a channel; both renderers paint them. |
| 48 | `bar({ stack: true })` has no corner radius, so a rounded stack was hand-stacked `rect` spans. | vl-stacked_bar_count_corner_radius_mark | fixed — `rx` on `bar`, and `theme.marks.bar.rx`. |
| 49 | `scheme` knows only part of d3-scale-chromatic (`PRGn`, `PuRd`, `BuPu`, … were missing). | plot-proportion-plot, plot-impact-of-vaccines, plot-continuous-dimensions-heatmap | fixed — every d3-scale-chromatic scheme can be named. The last two keep a d3 scale for its sqrt/symlog transform. |
| 50 | "No white halo" listed on six entries. Halos had landed (a `stroke` on text paints behind the glyphs) but the entries were not updated. | plot-cancer-survival-rates, plot-parcoords, plot-color-crosshair, plot-state-labels, plot-v-counties, plot-cluster-diagram | fixed — the entries draw `stroke: 'white'` halos. |
| 51 | Axis spine and ticks, tick padding, gridline dash, band padding, legend swatch size and shape, and title fonts were not theme tokens, so a house style could not be one object. | (all) | fixed — `theme.axis` (with `discrete` / `continuous` per-kind overrides), `theme.grid` (`strokeDash`, `show`, `zero`), `theme.panel`, `theme.bandPadding`, `theme.guide.legend`, `theme.title.fontFamily`, `theme.marks.{bar,rect}.rx`, `theme.marks.point.size`. |
| 52 | Axis labels cannot move inside the plot, gridlines sit only at band centres, and a y title cannot sit at the top of its axis — the space-saving axis was a `text` mark under a hidden axis. | vl-bar_axis_space_saving | fixed — `labelAlign` and `labelOffset` (with a negative `tickPadding`), a grid's `bandPosition`, and `titleAnchor`; all four are theme tokens too. |

Still open, and still listed in the entries: a legend inside the plot, mirrored panels with the axis between
them (vl-concat_population_pyramid, a multi-view layout), and Vega's own scheme names (`lighttealblue`).
