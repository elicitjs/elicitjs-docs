# Elicitation tasks in the gallery: what each interface asks for, and how

Scope: every elicitation interface in the gallery. That is 436 interfaces on the 350 drawable entries (215 Vega-Lite, 221 Plot), plus the 12 on the Beyond page: **448 in all**. Each interface is coded on four independent dimensions:

| Dimension | Question it answers | Codes | Coded from |
|---|---|---:|---|
| **Task** | *What* is the respondent asked to provide? | 15, in 8 families | the `question` (read by hand) |
| **Frame** | *Where does the true answer live?* | 5 | the `question` (read by hand) |
| **Method** | *How is the elicitation structured?* (design pattern) | 10 | the spec code (pattern match) |
| **Interaction** | *What gesture produces the answer?* | 10 | the spec code (pattern match) |

An interface can carry several task codes (118 do, e.g. a forecast plus its interval), several methods and several gestures. Percentages are of 448 unless stated. The per-interface codes are in `ELICITATION-TASKS.csv`, which also carries ROUND2's `relation` and `answerMark` columns for the 435 interfaces that ROUND2 judged.

This replaces the "Elicitation strategies" table in `ROUND2.md`. That table mixed *what* is elicited (interval, classify, rank) with *how* (sketch, tokens, constraint-shaped, staged). Here the two are separate dimensions, and uncertainty is split from population spread.

---

## 1. Summary

**Tasks (what is asked)**

| Family | Interfaces | Share | Tasks inside |
|---|---:|---:|---|
| **Quantity**: "how much?" | 252 | 56% | Predict 134 · Estimate 93 · Fill in 25 |
| **Uncertainty & variation**: "how sure? how spread?" | 117 | 26% | Distribution 77 · Uncertainty 44 |
| **Structure among values**: "how do they relate?" | 66 | 15% | Allocation 41 · Relationship 15 · Rank 10 |
| **Category & selection**: "which? what kind?" | 44 | 10% | Identify 26 · Classify 18 |
| **Place & time**: "where? when?" | 44 | 10% | Locate 44 |
| **Personal & open**: "what do you want or think?" | 17 | 4% | Preference 16 · Explain 1 |
| **Reading the shown data** | 14 | 3% | Summarise 14 |
| **Relations**: "what connects to what?" | 11 | 2% | Structure 11 |

**Main findings**

1. **The gallery is mostly about quantities.** 56% of interfaces ask for a value: a forecast (30%), an estimate of a fact (21%) or a missing part of a record (6%).
2. **Uncertainty is asked for explicitly in only 10% (44).** 30 of those 44 sit on a forecast (`PRED+UNC`). In 38 of the 44 the uncertainty is an interval or a band. A full subjective distribution over one quantity appears twice (probability chips). The probability of an event appears twice, both on the Beyond page. The Beyond page holds 7 of the 44 from only 12 interfaces, so the gallery proper under-samples uncertainty.
3. **Population spread (distribution, 17%) is asked for almost twice as often as uncertainty**, in ten different representations. Histograms are the largest (21), then summary statistics such as boxes, mean ± SD and quantiles (18).
4. **Gesture does not determine task.** Drag is used for 15 of the 15 tasks and brush for 6. Brush, for example, elicits a location (14), a distribution range (13), an uncertainty interval (2) and a forecast range (4). The task comes from the question, and the **constraint is what makes the gesture mean the task**: `ordering` sits on 34 of the 44 uncertainty interfaces, and a sum rule or a fixed whole holds 38 of the 41 allocations.
5. **Prediction is mostly continuation.** 92 of 134 forecasts (69%) extend a record that is drawn as reference. Fill-in uses a reference in 24 of 25 by definition. Estimation is the opposite: 67 of 93 (72%) start blank.
6. **11% (49) ask about something the reader can work out from what is drawn** (frame S). For 14 that is the point: summarising, smoothing, a derivative, fitting a Q-Q line. Most of the rest (location 14, classify 7, relationship 9) are the "answer is visible" cases flagged in ROUND2.
7. **Few interfaces sequence the elicitation.** 20 (4%) use stages: 12 guess → reveal, 8 decompose (median, then spread; total, then split). 32 (7%) show live feedback computed from the answer.
8. **Rare tasks:** relations and networks (11), ranking (10), relationships between variables (15), joint or dependent quantities (3), event probabilities (2) and free-text explanation (1).

---

## 2. The coding scheme

### 2.1 Task: what is asked

| Code | Task | Definition | Typical question |
|---|---|---|---|
| `EST` | **Estimate** | A quantity that exists now or in the past, with no part of its own record drawn. | "How many people live in each of these counties?" |
| `PRED` | **Predict / extrapolate** | Values beyond the edge of the given record: later in time, or new instances. | "Where will each stock close at the end of 2018?" |
| `FILL` | **Fill in / reconstruct** | A hidden or missing part *inside* a shown record: a gap, a hidden series, a hidden variable. | "Apple's closes for Jan–Mar 2016 are missing. What were they?" |
| `UNC` | **Uncertainty** | How sure the respondent is: an interval, band, probability, scenarios. The wording is "X% sure", "how sure", "how likely". | "Give a range you are 80% sure holds the price." |
| `DIST` | **Distribution** | How a population's values spread: shape, bins, quantiles, central range, typical-and-extreme. The wording is "X% of items fall". | "Out of 100 films, how many land in each rating band?" |
| `ALLOC` | **Allocation / composition** | Parts of a whole or a budget, over nominal categories. | "How does a typical remote worker split 24 hours?" |
| `REL` | **Relationship** | A function between variables: slope, curve, frontier, correlation. | "How fast does mileage fall as horsepower rises?" |
| `RANK` | **Rank** | An order of items. | "Order the five vowels from most to least frequent." |
| `CLASS` | **Classify** | Assign each item a nominal label: species, cause, colour, cluster name. | "Which species is each unlabelled penguin?" |
| `IDENT` | **Identify** | Pick out which items meet a criterion (an in/out set, top-k, outliers). | "Which states have more than 10 million residents?" |
| `LOC` | **Locate** | Place something in space or time: a point, path, span or region. | "In which month did these stocks hit bottom?" |
| `STRUCT` | **Structure** | Relations among entities (links, hierarchy, transitions), or which categories exist at all. | "Connect every pair of characters who share a scene." |
| `SUMM` | **Summarise the shown data** | A statistic or transform of data in view: mean, smoothing, derivative, running maximum. | "Here is sin(x). Draw its slope." |
| `PREF` | **Preference / self-report** | Personal opinion, choice, plan or norm. There is no external truth. | "How much does each factor matter to you when choosing a phone?" |
| `EXPLAIN` | **Explain** | Free-text account of an event. | "Something happened to Apple in early 2016. What, and when?" |

**Decision rules for the borderline cases**

- **`PRED` vs `FILL` vs `EST`.** If the answer lies past every shown point (later in time, or a new instance), code `PRED`, even when the event is in the past. "Draw the crash" asks for 2008–10 given 2007, so it is `PRED`. If it lies between or beside shown parts of the same record (a gap, a hidden series, the women's bars beside the men's), code `FILL`. If none of the record is drawn, code `EST`.
- **`UNC` vs `DIST`.** "X% *sure*" is `UNC`, a belief about one unknown. "X% *of items* fall" is `DIST`, a property of a population. A range that is itself the quantity (a day's low–high, a candle) is neither; it is `EST` or `PRED`.
- **`ALLOC` vs `DIST`.** Splits over nominal categories (formats, sources, species) are `ALLOC`. Splits over bins of a quantitative variable (age bands, weight bins) are `DIST`.
- **Coarse estimates.** Cycling low / middling / high on a choropleth is a coarse `EST`, not `CLASS`, because the categories are bins of a quantity. `CLASS` is kept for nominal labels.
- **`IDENT` vs `LOC`.** Selecting discrete items (states, hours, routes) is `IDENT`. Placing a pin, span or path is `LOC`. Pinning "the five busiest airports" is both.

### 2.2 Frame: where the true answer lives

| Code | Frame | n | Share | Meaning |
|---|---|---:|---:|---|
| `K` | Knowable fact | 235 | 52% | Past or present fact the respondent may not know (survey of knowledge). |
| `F` | Future | 126 | 28% | Not yet knowable; scored later or never. |
| `S` | Shown | 49 | 11% | Derivable from what is drawn (graph comprehension or a giveaway). |
| `H` | Hypothetical / personal | 26 | 6% | Opinions, plans, norms, invented scenarios: no external truth. |
| `T` | Theoretical | 12 | 3% | Mathematics or a stated model (normal deciles, random walk, Mandelbrot, derivative). |

### 2.3 Method: design patterns

| Code | Pattern | n | Share | Detected by |
|---|---|---:|---:|---|
| Reference | **Given → elicit.** Real rows are drawn read-only and the answer is the rest. | 213 | 48% | `context`, `lock`, or a reference `guides.rule/region` |
| Blank | **Free elicitation.** No record is drawn; the answer starts at a neutral prior or empty. | 235 | 52% | complement of the above |
| Order | **Coherence by order.** lo ≤ mid ≤ hi, monotone curves, symmetric or following intervals. | 88 | 20% | `ordering`, `monotonic`, `symmetric`, `follow`, `spacing`, `unique` |
| Tokens | **Frequency format.** The answer is a count of discrete units placed or removed. | 43 | 10% | `dotStack`, `waffle`, `create` |
| Feedback | **Live consequence.** A guide recomputed from the answer (remaining budget, rebased lines, folded horizon, derived headcount). | 32 | 7% | `guides.remaining/crosshair`, `guides.custom` reading `data` |
| Sum | **Coherence by total.** Parts must add to a fixed total. | 28 | 6% | `maintainSum`, `edit.waffle`, `count` |
| Repair | **Custom coherence.** A bespoke invariant (a sorted order, ternary closure, survival only falls). | 26 | 6% | `constraints.custom` |
| Open | **Open vocabulary.** The respondent adds, renames or names the categories or series. | 16 | 4% | `open: true`, `edit.scale.categories`, `newSeries` |
| Reveal | **Guess → reveal (→ revise).** | 12 | 3% | a `Reveal` stage |
| Staged | **Decomposition.** One answer in ordered steps (median → quartiles → range; total → split). | 8 | 2% | `stage` without reveal |

### 2.4 Interaction: the gesture

| Gesture | n | Share | Vocabulary |
|---|---:|---:|---|
| **Drag** a mark or handle to a value | 256 | 57% | `move`, `slide`, `edit.stack.edge`, `edit.line.anchor`, `edit.trend.*`, `edit.geo.move`, `resize`, `rotate`, `edit.legend.value` |
| **Sweep / draw** a curve in one stroke | 84 | 19% | `edit.line.sweep/draw`, `move({ pick: 'sweep' })`, `edit.geo.draw` |
| **Create / remove** marks | 63 | 14% | `create`, `remove`, `edit.waffle.fill`, `edit.geo.create`, `edit.stack.cut/merge`, `newSeries` |
| **Pick / cycle** a state | 48 | 11% | `select`, `cycle`, `toggle`, `edit.legend.category` |
| **Brush** a span or box | 32 | 7% | `brushSpan`, `brushRect`, `edit.geo.brush` |
| **Type** text | 12 | 3% | `editText`, `edit.scale.categories` |
| **Reorder** | 11 | 2% | `rank` |
| **Connect** nodes | 6 | 1% | `edit.network.connect/rewire` |
| **Axis** (zoom, pan, scale) | 3 | 1% | `edit.axis.*` |
| **Widget** | 2 | <1% | `widgets.likert`, `widgets.histogram` |

62 interfaces (14%) combine two or more gestures, typically create plus drag, or rank plus drag.

---

## 3. Tasks in detail

### 3.1 Quantity: predict, estimate, fill in (252)

| | Predict | Estimate | Fill in |
|---|---:|---:|---:|
| Interfaces | 134 | 93 | 25 |
| … with a reference record drawn | 92 (69%) | 26 (28%) | 24 (96%) |
| … main gesture: drag / sweep | 86 / 39 | 68 / 8 | 16 / 8 |
| … also asks for uncertainty | 30 | 1 | 0 |
| … also asks for an allocation | 13 | 17 | 0 |

- **Predict** has two forms. *Continuation* (92) draws the record and leaves the future blank: "Draw the 2020s", "Extend the band", "Add the next quarters". *Standalone forecast* (42) gives no record: "Predict 2050", "Forecast revenue". 30 predictions are retrospective (frame `K`), with a known answer behind them, as in "Draw the crash", "Burn down a cohort" and "Rate season 9". This is the "You Draw It" pattern, and the only place where reveal is used naturally.
- **Estimate** is general-knowledge recall: populations, ratings, letter frequencies, temperatures. 11 estimates are coarse, made by cycling ordinal categories on a choropleth or heatmap rather than dragging a value.
- **Fill in** is the cleanest "fill in the blanks" task. Its forms are a gap in a line (`plot-line-chart-with-gaps`, `plot-area-chart-missing-data`), a hidden series among visible ones (`vl-interactive_multi_line_pivot_tooltip`, "Draw the missing stock"), a hidden variable beside a shown one (`vl-bar_layered_transparent`, women beside men), and a hidden patch of a field (`plot-log-heatmap`, `plot-volcano-raster`).

Exemplars: `plot-stacked-area-chart#0` (total first, then split), `plot-simpsons-ratings#0` (forecast written through a colour legend), `vl-window_impute_null#0` (guess, see the imputation, revise), `plot-cancer-survival-rates#0` (survival can only fall).

### 3.2 Uncertainty (44)

This is uncertainty in the strict sense: the respondent's confidence about something unknown. It is almost never the only task (4 of 44). It qualifies a forecast (30), a distribution (4), a relationship (3), or once each an estimate, a summary and a location.

**What the uncertainty is about, and how it is drawn**

| Object of uncertainty | n | Representation | Examples |
|---|---:|---|---|
| **A path over time** (forecast fan) | 19 | lo/hi band, swept in two strokes (14) or dragged point by point (5) | `vl-area_gradient#1`, `plot-burndown-chart#1`, `plot-bollinger-bands#0` |
| **A single value** | 12 | error bar on a point (8), brush span (2), best guess then range (1), confidence ring around a pin (1) | `vl-layer_point_errorbar_ci#0–2`, `vl-bar_argmax#0`, Beyond "Pin it, then say how sure" |
| **A function or curve** | 7 | band around a density or CDF (4), trend band via `slopeSpread` / `interceptSpread` (3) | `vl-area_density#1`, `vl-layer_point_line_regression#0` |
| **Alternative futures** | 2 | several sketched scenario paths | `vl-area_overlay#1`, Beyond "Several futures" |
| **Full subjective distribution** | 2 | probability chips over the value axis | `vl-histogram#1`, Beyond "Twenty chips" |
| **An event** | 2 | probability needle; likelihood axis of a risk matrix | Beyond "A needle for likelihood", "risk matrix" |

**Three interval parameterisations** recur on error bars and bands. ElicitJS expresses them as one constraint swap, a contrast that `vl-layer_point_errorbar_ci`, `vl-layer_line_errorband_ci` and `vl-concat_layer_voyager_result` each show in three tabs:
- **centre carries the interval** (`follow`): move the best guess and the range comes with it;
- **symmetric** (`symmetric`): one half-width;
- **independent ends** (`ordering` only): skewed intervals are allowed.

### 3.3 Distribution (77)

This is the spread of a population. It is coded separately from uncertainty, though a few interfaces ask for both.

| Representation | n | Examples |
|---|---:|---|
| **Binned mass**: drag histogram or cell heights, often with `maintainSum` | 21 | `plot-prebinned-histogram#0`, `vl-circle_binned#0`, `plot-bivariate-choropleth#1` (3 × 3 joint) |
| **Summary statistics**: box handles, mean ± SD, median and range, deciles, top-k, Q-Q | 18 | `vl-boxplot_2D_vertical#0` (staged), `plot-binned-box-plot#0–2`, `plot-qq-plot#0` |
| **Samples**: one token per observation | 9 | `vl-circle_wilkinson_dotplot#0`, `plot-stacked-dots#0`, `plot-lebron-james-shots#0` |
| **Central range** on one axis | 6 | `vl-point_offset_random#0`, `plot-auto-mark-heatmap-2#0` |
| **Continuous curve**: density or CDF, swept or drawn | 6 | `plot-density-estimation#0`, `plot-cumulative-histogram#0` |
| **Central region** in 2-D (box) | 5 | `vl-interactive_brush#0`, `plot-auto-mark-heatmap#0` |
| **Band around a density or CDF** (also `UNC`) | 4 | `vl-area_cumulative_freq#1` |
| **Coarse rating of cells** (common / rare) | 4 | `vl-rect_binned_heatmap#0`, `plot-hexbin-text#0` |
| **Variability band over time** | 2 | `plot-ridgeline#1`, `plot-psr-b1919-21#1` |
| **Process realisation**: draw one random walk, open its fan | 2 | `plot-random-walk#0–1` |

`plot-percentogram#0` ("Move the deciles") is the most distinctive. The equal-area constraint makes bin edges the input, so the shape follows from where the quantiles sit.

### 3.4 Allocation (41)

Here a whole is divided. What varies is how the whole is held fixed:

| How the total is kept | n | Examples |
|---|---:|---|
| **Boundaries inside a fixed whole**: stack edges, pie arcs, normalised areas, cut / merge | 24 | `vl-arc_pie#0`, `plot-single-stacked-bar#0`, `plot-normalized-stack#0` |
| **Free parts plus `maintainSum`**, usually with `guides.remaining` | 8 | `vl-bar_percent_of_total#0`, `plot-wrap-tick-labels#0` |
| **Fixed token budget** | 4 | `vl-bar_grouped#1`, `plot-apportionment-of-seats-in-the-ep#0` |
| **Geometry or custom repair** | 2 | `vl-ternary#0` (shares from one 2-D point), `plot-image-scatterplot-2#0` |
| **Not enforced** (total implied by the wording) | 3 | `vl-selection_heatmap#0` (18 per class), `vl-bar_grouped_repeated#0`, `vl-layer_precipitation_mean#0` |

The categories themselves are part of the answer in 4 interfaces (open vocabulary): `vl-arc_donut#0`, `plot-single-stacked-bar#0`, `vl-stacked_bar_h#0` and Beyond "Grow the vocabulary".

### 3.5 Relationship, rank, summarise (39)

- **Relationship (15)** is mostly a trend through a context scatter (9 of 15 in frame `S`), set through `edit.trend.slope` / `intercept` or a drawn curve. It also covers a frontier (`vl-circle#0`), a conditional curve (`vl-repeat_layer#0`, worldwide gross given US gross), Simpson's paradox as one line and then a line per species (`plot-linear-regression-simpson#0–1`), and a correlation matrix (`plot-fil-correlation-heatmap#0`). Joint or dependent beliefs appear only 3 times: the correlation matrix, the 3 × 3 bivariate allocation and the binned IMDB × RT grid.
- **Rank (10)** always uses `rank`. It is paired with value dragging in 3 ("Rank, then size"), which ROUND2 notes can let the two answers contradict.
- **Summarise (14)** is graph comprehension: draw the mean through shown points, smooth a series, trace the running high, fit the Q-Q line, draw the derivative (`vl-sequence_line_fold#0`), integrate a flow (`plot-perlin-noise#0`). All are frame `S` or `T`. Here the answer being derivable from the view is intended.

### 3.6 Classify, identify, locate (88)

- **Classify (18)** labels items with species, sex, cause, colour or cluster name. The gesture is pick or cycle (12), through a legend or by clicking the mark. 7 are frame `S`, inferring the label from position in the shown scatter.
- **Identify (26)** picks out a set: states over a threshold, outliers, corrupted rows, rush hours, routes. Toggle or select is the usual gesture (14). `remove` acts as strike-out (3), and `create` drops pins on the chosen places (4).
- **Locate (44)** splits into time (spans and dates on a chart, 18), space (pins, paths and boxes on a map or plan, 25) and feature space (1). Brush is the main gesture for spans and regions (14). This is also where most giveaways sit: 14 of the 44 are frame `S`, such as "find the peak week" or "date the bottom" on a chart that shows it.

### 3.7 Structure, preference, explain (28)

- **Structure (11)** covers networks drawn with `edit.network.connect` (state-machine transitions, co-occurrence, dendrogram, re-parenting a tree, causal diagram), linking cases into clusters (`plot-delaunay-links#0`), and open-vocabulary category sets (which origins, sources or sports exist). 7 of the 11 use an open domain.
- **Preference (16)** has no right answer. It covers self-report (Likert widget, tool-usage map, face glyphs), normative targets (`plot-bullet-graph#0–1`), personal budgets (`vl-arc_pie_normalize_tooltip#0`), plans and designs (router placement, an escape route, a new tube line, a train timetable), and a purchase range set by zooming the axis (`vl-selection_translate_scatterplot_drag#0`).
- **Explain (1)**: `plot-static-annotations#0` places a dated annotation and types what happened.

### 3.8 Common task combinations

| Combination | n | What it is |
|---|---:|---|
| `PRED+UNC` | 30 | forecast plus interval or band |
| `EST+ALLOC` | 17 | estimate a split of a known whole |
| `PRED+ALLOC` | 13 | forecast a future split |
| `PRED+LOC`, `IDENT+LOC`, `PREF+LOC` | 5, 5, 4 | when or where something will happen; which places; where you would put something |
| `SUMM+DIST`, `EST+DIST`, `DIST+UNC` | 4 each | typical value plus spread; distribution plus confidence band |
| `PRED+ALLOC+STRUCT` | 3 | future split over categories you name yourself |
| `RANK+EST`, `PRED+RANK`, `PRED+CLASS`, `REL+UNC` | 3 each | order then size; forecast an order; categorical forecast; trend plus spread |

---

## 4. How tasks map to interactions and methods

### Task × interaction (number of interfaces using each gesture)

| Task | n | Drag | Sweep/draw | Create/remove | Pick/cycle | Brush | Type | Reorder | Connect | Axis | Widget |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| EST | 93 | 68 | 8 | 13 | 11 | 1 | 2 | 3 | · | 1 | · |
| PRED | 134 | 86 | 39 | 12 | 8 | 4 | 4 | 3 | · | · | · |
| FILL | 25 | 16 | 8 | 5 | 2 | · | · | · | · | 1 | · |
| UNC | 44 | 21 | 20 | 5 | · | 2 | 1 | · | · | · | · |
| DIST | 77 | 38 | 15 | 10 | 4 | 13 | · | · | · | · | 1 |
| ALLOC | 41 | 37 | 2 | 10 | 1 | · | 3 | · | · | · | · |
| REL | 15 | 11 | 4 | · | 1 | · | · | · | · | · | · |
| RANK | 10 | 4 | · | · | · | · | · | 10 | · | · | · |
| CLASS | 18 | 3 | · | 1 | 12 | 1 | 1 | 1 | 1 | · | · |
| IDENT | 26 | 7 | 1 | 7 | 14 | · | 3 | · | · | · | · |
| LOC | 44 | 24 | 6 | 9 | 1 | 14 | 2 | · | · | · | · |
| STRUCT | 11 | 7 | · | 8 | · | · | 5 | · | 6 | · | · |
| SUMM | 14 | 10 | 5 | · | · | · | · | · | · | · | · |
| PREF | 16 | 8 | 2 | 4 | · | · | 1 | · | · | 1 | 1 |
| EXPLAIN | 1 | 1 | · | · | · | · | 1 | · | · | · | · |
| **All** | **448** | **256** | **84** | **63** | **48** | **32** | **12** | **11** | **6** | **3** | **2** |

Reading the table:
- **Continuous tasks** (estimate, predict, fill, allocation, relationship, summarise) are drag-first. Sweep is the second gesture wherever the answer is a curve over x.
- **Uncertainty is split evenly between drag (21) and sweep (20).** The swept lo/hi band is the gallery's signature uncertainty gesture.
- **Discrete tasks** (classify, identify) are pick-first, and **locate** is drag- and brush-first.
- **Structure** is the only task that needs connect and type together.
- **Pick/cycle serves nine tasks**, mostly identify, classify, and coarse estimates or forecasts made by cycling ordinal categories. **Brush serves six**: locate, distribution, predict, uncertainty, a range estimate and classify (as regions).

### Task × method

| Task | n | Reference | Blank | Order | Tokens | Feedback | Sum | Repair | Open | Reveal | Staged |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| EST | 93 | 26 | 67 | 12 | 12 | 9 | 12 | 6 | 3 | 3 | · |
| PRED | 134 | 92 | 42 | 40 | 7 | 5 | 1 | 11 | 6 | 3 | 4 |
| FILL | 25 | 24 | 1 | 3 | 1 | · | · | 2 | 1 | · | 1 |
| UNC | 44 | 31 | 13 | 34 | 4 | 2 | · | 1 | 2 | 1 | 1 |
| DIST | 77 | 25 | 52 | 29 | 10 | 6 | 14 | 3 | · | 2 | 4 |
| ALLOC | 41 | 11 | 30 | 3 | 4 | 10 | 9 | 5 | 4 | · | 1 |
| REL | 15 | 13 | 2 | 1 | · | · | · | 1 | · | · | · |
| RANK | 10 | 2 | 8 | 1 | · | · | · | · | · | · | · |
| CLASS | 18 | 8 | 10 | 2 | · | · | · | 2 | 1 | · | · |
| IDENT | 26 | 5 | 21 | · | 4 | 3 | · | · | 3 | · | · |
| LOC | 44 | 14 | 30 | 3 | 9 | 4 | · | · | 2 | 1 | · |
| STRUCT | 11 | 2 | 9 | 1 | 2 | · | · | · | 7 | · | · |
| SUMM | 14 | 14 | · | 6 | · | 1 | · | · | · | 2 | 1 |
| PREF | 16 | 3 | 13 | 1 | 2 | 2 | · | 1 | · | · | · |
| EXPLAIN | 1 | 1 | · | · | · | · | · | · | 1 | · | · |
| **All** | **448** | **213** | **235** | **88** | **43** | **32** | **28** | **26** | **16** | **12** | **8** |

Each task has a constraint that carries it:
- **uncertainty → order** (34 of 44): `ordering` keeps lo ≤ hi; `follow` and `symmetric` set the parameterisation;
- **distribution → order and sum** (29 and 14): monotone CDFs, ordered quantiles, histograms that add to 100;
- **allocation → a fixed whole** (stack edges, `maintainSum`, a token budget), most often paired with **feedback** (10 of 41, `guides.remaining`);
- **structure → open vocabulary** (7 of 11).

Tokens (frequency format) are spread across estimate (12), distribution (10), locate (9) and allocation (4). Reveal sits mostly on retrospective quantity and summarise tasks.

### Task × frame

| Task | n | Future | Knowable | Shown | Hypothetical | Theoretical |
|---|---:|---:|---:|---:|---:|---:|
| EST | 93 | · | 88 | 1 | 4 | · |
| PRED | 134 | 103 | 30 | · | · | 1 |
| FILL | 25 | · | 23 | · | · | 2 |
| UNC | 44 | 30 | 10 | 3 | 1 | · |
| DIST | 77 | 18 | 44 | 7 | 3 | 5 |
| ALLOC | 41 | 17 | 19 | 1 | 4 | · |
| REL | 15 | · | 6 | 9 | · | · |
| RANK | 10 | 3 | 7 | · | · | · |
| CLASS | 18 | 3 | 7 | 7 | 1 | · |
| IDENT | 26 | 2 | 19 | 3 | · | 2 |
| LOC | 44 | 6 | 18 | 14 | 5 | 1 |
| STRUCT | 11 | 3 | 6 | 1 | 1 | · |
| SUMM | 14 | · | · | 13 | · | 1 |
| PREF | 16 | · | · | · | 16 | · |
| **All** | **448** | **126** | **235** | **49** | **26** | **12** |

80% of interfaces elicit a **belief about the world** (future or knowable). 11% test **reading of the shown data**, 6% a **personal or hypothetical** view and 3% **mathematical** knowledge.

### Task × relation to the original chart (ROUND2 judgements, 435 interfaces)

| Task | Same mark | New channel | Overlay | Different chart | Non-mark |
|---|---:|---:|---:|---:|---:|
| EST | 66 | 5 | 6 | 10 | 4 |
| PRED | 98 | 10 | 9 | 9 | 4 |
| FILL | 23 | · | · | · | 2 |
| UNC | 12 | 13 | 6 | 6 | · |
| DIST | 45 | 8 | 10 | 13 | · |
| ALLOC | 33 | · | 1 | 4 | 1 |
| LOC | 21 | · | 18 | 3 | 1 |
| IDENT | 7 | 10 | 3 | 3 | 3 |
| SUMM | 6 | · | 8 | · | · |

The original chart's own mark fits value tasks (predict, estimate, fill and allocation are 73–92% same-mark). **Uncertainty is the task that most often needs something the original didn't encode.** In 19 of the 37 judged, the answer goes on a new channel (an area reused as a lo/hi band) or on an overlay mark, and 6 more use a different chart. **Locate and summarise** are mostly overlays (a rule, span or pin on top of the chart). **Distribution** is the task most often moved to a different chart (13), usually tokens instead of a histogram.

---

## 5. Gaps and suggestions

What the gallery covers thinly, relative to what elicitation research asks for:

1. **Uncertainty about a single quantity beyond an interval.** Only 2 interfaces elicit a full subjective distribution (chips), and one of them is on the Beyond page. None uses quantile or bisection elicitation (median, then the 25th and 75th percentiles as separate judgements), which `stage` + `follow` could express. Suggest one per distribution-friendly section.
2. **Event probability.** 2 interfaces, both on the Beyond page. A binary "will X happen?" with a probability is the most common forecasting question and has no gallery example.
3. **Uncertainty as a standard companion to forecasts.** 30 of 134 forecasts ask for it. Many continuation charts could add a band tab at little cost; the band preset suggested in ROUND2 would make it one line.
4. **Dependence.** 3 interfaces elicit a joint or correlational belief. Conditional questions ("if X rises, what happens to Y?") appear only implicitly in `vl-repeat_layer#0`.
5. **Sequenced elicitation.** 20 interfaces use stages. Guess → reveal → revise and best guess → range are well-studied protocols for reducing anchoring and overconfidence. They are cheap to add to the 30 retrospective forecasts.
6. **Wording that separates uncertainty from spread.** Some "between what low and high" questions read either way (`plot-horizon#1`, `plot-ridgeline#1`, `vl-layer_candlestick#1`, `plot-temporal-bar-chart#0`). If the analysis treats them differently, the wording should say "X% sure" or "most days".
7. **Frame `S` giveaways.** Of the 49 shown-frame interfaces, the 14 summarise tasks are intentional. The rest are worth either rewording into explicit "reading" tasks or hiding the part that gives the answer away (see ROUND2 §"Interfaces that don't elicit what they claim").

---

## 6. Method notes

- **One coder.** Tasks and frames were assigned by reading each question (with the title and gesture), in one pass, using the rules in §2.1, followed by two automatic consistency checks. The first listed every interface whose wording or mechanism implied uncertainty, a range or a missing part. The second checked every range-gesture interface not coded `UNC`/`DIST`. That pass recoded one interface (`vl-layer_line_mean_point_raw#2` → `SUMM+DIST`). Agreement with a second coder has not been measured. The borderline cases are the `PRED`/`FILL`/`EST` boundary on retrospective questions, and `IDENT` vs `LOC`.
- **Methods and interactions are mechanical**: regular expressions over each spec's `code` (the patterns are listed in §2.3–2.4). They record what the spec *uses*, not whether it works. ROUND2 lists the interfaces whose stated total isn't enforced, and those still count under "Sum" only when the spec calls a sum constraint.
- **Primary task.** The first code listed in the CSV is the main one. Counts in this document are "any code" unless they say otherwise.
- **The 436 vs 435 difference** with ROUND2 is one interface added after that review. It has task codes but no `relation`.
