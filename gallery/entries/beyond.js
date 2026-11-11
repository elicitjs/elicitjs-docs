// "Beyond the two libraries": interfaces that only make sense when a chart is an
// INPUT. Each one leans on something neither Vega-Lite nor Plot has: gestures
// that write rows, a schema that can grow, constraints that repair, glyphs with
// their own frame, multi-table structures, or stages.

GALLERY.beyond({
  title: 'A face per outlook',
  question: 'How do you feel about each of these over the next five years?',
  try: 'Drag a mouth up to smile or down to frown; drag an eye sideways to widen it.',
  why: 'A `face` is a `composite` whose parts sit in the glyph’s own frame, so each feature is an ordinary channel on a real part. `slide` on `mouthCurve` writes `mood`; `slide` on `eyeScale` writes `worry`. The same column also drives `y`, so the face rises as it smiles.',
  whyNot: 'Neither has a glyph whose parts are placed in the glyph’s own frame, and neither can write a drag back to data. A Chernoff face there is a static picture of answers you already have.',
  code: `mount(Elicit({
  width: 460, height: 280,
  margins: { top: 20, right: 20, bottom: 32, left: 40 },
  data: [
    { topic: "Housing", mood: 0.3, worry: 0.8 },
    { topic: "Jobs",    mood: 0.6, worry: 0.4 },
    { topic: "Health",  mood: 0.5, worry: 0.5 },
    { topic: "Climate", mood: 0.2, worry: 0.9 },
  ],
  schema: {
    topic: { type: "categorical", domain: ["Housing", "Jobs", "Health", "Climate"] },
    mood:  { type: "quantitative", domain: [0, 1] },
    worry: { type: "quantitative", domain: [0, 1] },
  },
  marks: [
    face({
      size: 30,
      channels: {
        x: { field: "topic" },
        y: { field: "mood" },
        mouthCurve: { field: "mood", edit: slide({ axis: "y", increase: "up" }) }, //! the smile IS the answer
        eyeScale:   { field: "worry", edit: slide({ axis: "x" }) }, //! a second column, read off the other drag axis
      },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Grow the vocabulary',
  question: 'How will people get to work in 2035? Split the bar into modes, and rename or add any mode the list is missing.',
  try: 'Click inside the bar to cut a new share; drag a boundary; double-click a legend swatch to rename it, or the ＋ to add a mode.',
  why: 'The `mode` field is declared `open: true`, so its domain is a starting set, not a ceiling. `edit.stack.cut()` mints the next unused category (or a placeholder once they run out), and `edit.scale.categories()` on the legend renames, adds and deletes categories, rewriting the rows that carry them. The total stays 100 by arithmetic.',
  whyNot: 'A Vega-Lite or Plot domain is read from the data or fixed in the spec. No gesture can add a category, and renaming one means editing the data by hand.',
  code: `mount(Elicit({
  width: 420, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  data: [{ year: "2035", mode: "Car", pct: 100 }],
  schema: {
    year: { type: "categorical", domain: ["2035"] },
    mode: { type: "categorical", domain: ["Car", "Transit", "Bike", "Walk"], open: true }, //! an open vocabulary
    pct:  { type: "quantitative", domain: [0, 100] },
  },
  marks: [
    bar({
      stack: true,
      channels: {
        x: { field: "year" },
        y: { field: "pct" },
        fill: { field: "mode" },
      },
      edits: [edit.stack.cut(), edit.stack.edge(), edit.stack.merge()], //! cut, resize, merge shares
    }),
    legendColor({ anchor: "right", edit: edit.scale.categories() }), //! the legend edits the domain itself
  ],
}))`,
});

GALLERY.beyond({
  title: 'Draw the causes',
  question: 'What drives housing costs where you live? Add the factors you think matter and draw an arrow from each cause to what it affects.',
  try: 'Drag from a note’s right edge onto another note to connect them. Click empty space to add a note, double-click a note to type. Alt-click deletes.',
  why: 'The schema declares a `network` structure: a `factors` table and a `drives` table whose `source`/`target` are `ref`s to it. `ports` with `edit.network.connect()` turns a drag between notes into a new links row; `create` + `key: true` mints a node with its own id. Deleting a note deletes its links, because referential integrity is part of the schema.',
  whyNot: 'Plot’s `link` and `arrow` read both endpoints from coordinates stored on each row, and Vega-Lite has no link mark at all. Nothing creates a row, and nothing keeps a link attached to a node that moves or is deleted.',
  code: `mount(Elicit({
  width: 460, height: 320,
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  axes: false,
  schema: {
    structure: "network", //! two tables: nodes and links
    tables: {
      factors: {
        role: "nodes",
        fields: {
          id:    { type: "categorical", key: true, open: true },
          label: { type: "categorical", open: true },
          x: { type: "quantitative", domain: [0, 100] },
          y: { type: "quantitative", domain: [0, 100] },
        },
      },
      drives: {
        role: "links",
        directed: true, //! cause → effect
        fields: { source: { type: "ref" }, target: { type: "ref" } }, //! links name nodes by key
      },
    },
  },
  data: {
    factors: [
      { id: "rates",  label: "Interest rates", x: 16, y: 80 },
      { id: "zoning", label: "Zoning rules",   x: 16, y: 22 },
      { id: "cost",   label: "Housing costs",  x: 82, y: 50 },
    ],
    drives: [{ source: "rates", target: "cost" }],
  },
  marks: [
    link({ curve: "bezier", stroke: "#64748b", strokeWidth: 1.6, edits: [remove({ when: when.alt })] }),
    sticker({
      fill: "#fef9c3", stroke: "#ca8a04", radius: 6, maxWidth: 110,
      edits: [
        create({ defaults: { label: "New factor" } }), //! click empty space to add a factor
        editText(), //! double-click to name it
        remove({ when: when.alt }),
      ],
      channels: {
        x: { field: "x", edit: move({ channels: ["x", "y"], mode: "relative" }) },
        y: { field: "y" },
        text: { field: "label" },
        ports: { value: { out: ["right"], in: ["left"] }, edit: edit.network.connect() }, //! drag from a port to connect
      },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Twenty chips',
  question: 'You have 20 chips. Place them over next year’s inflation rate to show how likely you think each outcome is.',
  try: 'Click above a bin to add a chip, click a chip to take it back. You can’t place more than 20.',
  why: 'One row is one chip: `dotStack` stacks a token per row, `create` mints one on click and `remove` deletes one. `count({ max: 20 })` is a dataset invariant, so the 21st chip is rejected whichever gesture tries to add it, and `guides.remaining` shows what is left to place.',
  whyNot: 'Both can draw a stacked dot plot of rows you already have. Neither can add a row from a click, and neither has a rule that refuses one.',
  code: `const bins = ["0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%+"];
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 28, right: 16, bottom: 28, left: 16 },
  axes: { x: {}, y: false },
  data: [{ rate: "2%" }, { rate: "2%" }, { rate: "3%" }],
  schema: { rate: { type: "ordinal", domain: bins } },
  constraints: [count({ max: 20 })], //! at most 20 chips, for every gesture
  guides: [guides.remaining({ total: 20, unit: "chip" })], //! what is left to place
  marks: [
    dotStack({
      fill: "#0ea5e9",
      channels: { x: { field: "rate" } },
      edits: [create({ gesture: "click", channels: ["x"] }), remove()], //! click to add, click a chip to remove
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'A line and how sure you are',
  question: 'As a car’s horsepower rises, how much does its fuel economy fall — and how sure are you?',
  try: 'Drag the line’s centre to move it and an end handle to tilt it. Drag the band’s handles to widen or narrow your uncertainty.',
  why: 'A `trend` draws a line from an intercept and a slope that are COLUMNS: `edit.trend.intercept()` and `edit.trend.slope()` write them. `trendBand` draws the spread of lines your uncertainty allows, and its handles write the two spreads. The answer is a distribution over lines, not a line.',
  whyNot: 'A regression in Vega-Lite or Plot is a transform computed from the data. Here there is no data to fit: the line and its band are the answer, and the reader sets both.',
  code: `mount(Elicit({
  width: 420, height: 300,
  margins: { top: 16, right: 16, bottom: 32, left: 40 },
  axes: { origin: false },
  schema: {
    x: { type: "quantitative", domain: [50, 230] },  // horsepower
    y: { type: "quantitative", domain: [5, 45] },    // miles per gallon
    intercept: { type: "quantitative" },
    slope:     { type: "quantitative" },
    aSd:       { type: "quantitative" },
    bSd:       { type: "quantitative" },
  },
  data: [{ intercept: 25, slope: -0.05, aSd: 3, bSd: 0.02 }],
  marks: [
    trendBand({
      fill: "#7c3aed", handles: true,
      channels: {
        interceptSpread: { field: "aSd", edit: edit.trend.interceptSpread() }, //! how unsure: the band’s width
        slopeSpread:     { field: "bSd", edit: edit.trend.slopeSpread() }, //! how unsure: the band’s flare
      },
    }),
    trend({
      stroke: "#7c3aed",
      channels: {
        intercept: { field: "intercept", edit: edit.trend.intercept() }, //! the line’s level
        slope:     { field: "slope",     edit: edit.trend.slope() }, //! the line’s tilt
      },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Best guess first, then the range',
  question: 'What will the unemployment rate be a year from now? First your single best guess; then the range you are 90% sure it falls in.',
  try: 'Drag the dot to your best guess, press Next, then drag the two caps.',
  why: 'Each edit carries a `stage`, so only one question is live at a time: `move({ stage: 0 })` on the estimate, `move({ stage: 1 })` on each bound. `ordering` keeps low ≤ guess ≤ high by pushing the others out of the way. Asking for the anchor before the range is a design decision the spec states, not a property of the widget.',
  whyNot: 'Neither library has edits, so neither has an order in which they may be made. A staged protocol there is application code wrapped around a chart.',
  code: `const chart = Elicit({
  width: 300, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 44 },
  stage: 0, //! one question at a time
  stageLabels: ["Best guess", "90% range"],
  data: [{ q: "Next year", est: 5, lo: 4.5, hi: 5.5 }],
  schema: {
    q:   { type: "categorical", domain: ["Next year"] },
    est: { type: "quantitative", domain: [0, 12] },
    lo:  { type: "quantitative", domain: [0, 12] },
    hi:  { type: "quantitative", domain: [0, 12] },
  },
  constraints: [ordering({ field: ["lo", "est", "hi"], strategy: "push" })], //! low ≤ guess ≤ high
  marks: [
    ruleX({ stroke: "#94a3b8", strokeWidth: 2, channels: { x: { field: "q" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
    tick({ stroke: "#334155", strokeWidth: 3, channels: { x: { field: "q" }, y: { field: "lo", edit: move({ stage: 1 }) } } }), //! stage 1: the bounds
    tick({ stroke: "#334155", strokeWidth: 3, channels: { x: { field: "q" }, y: { field: "hi", edit: move({ stage: 1 }) } } }),
    point({ fill: "#dc2626", size: 9, channels: { x: { field: "q" }, y: { field: "est", edit: move({ stage: 0 }) } } }), //! stage 0: the anchor
  ],
});
mount(chart);
const controls = document.createElement("div");
controls.style.cssText = "display:flex;gap:8px;align-items:center;margin-top:8px;font:13px system-ui";
const back = document.createElement("button"), next = document.createElement("button"), label = document.createElement("span");
back.textContent = "Back"; next.textContent = "Next";
back.onclick = () => chart.prevStage(); next.onclick = () => chart.nextStage();
const show = () => { label.textContent = "Now: " + chart.getStageLabel(); };
chart.on("stage", show); show();
controls.append(back, next, label);
mount(controls);`,
});

GALLERY.beyond({
  title: 'Out of 100 people',
  question: 'Out of 100 adults in your city, how many do you think cycle to work at least once a week?',
  try: 'Click a cell to fill the grid up to it, or drag across the grid.',
  why: '`waffle` draws a count as cells, and `edit.waffle.fill()` inverts the pointer to a cell index — so a click on the 23rd cell writes 23. A frequency format (“23 out of 100”) is easier to reason about than a percentage, and the spec makes that format the input.',
  whyNot: 'Vega-Lite and Plot draw a waffle from a count you already know (Plot via `waffleX`/`waffleY`); neither can turn a click on a cell back into the count.',
  code: `mount(Elicit({
  width: 280, height: 300,
  margins: { top: 12, right: 12, bottom: 24, left: 12 },
  axes: { x: {}, y: false },
  data: [{ who: "Cycle weekly", n: 12 }],
  schema: {
    who: { type: "categorical", domain: ["Cycle weekly"] },
    n:   { type: "quantitative", domain: [0, 100] },
  },
  marks: [
    waffleY({
      fill: "#16a34a", showEmpty: true,
      channels: {
        x: { field: "who" },
        count: { field: "n", edit: edit.waffle.fill() }, //! drag sets the count
      },
      edits: [edit.waffle.fill({ channels: ["count"], gesture: "click" })], //! a click sets it to that cell
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Rank by dragging',
  question: 'Which of these will grow fastest in your city over the next decade? Put them in order.',
  try: 'Drag a bar up or down to move it to that slot; the bars between shift to make room.',
  why: 'The rank is a column on an ordinal axis. `rank()` inverts the pointer to a slot and inserts the dragged row there, shifting the rows between, so the ranks stay a permutation however you drag. The bar length is a second, independent answer, edited with `move()`.',
  whyNot: 'Sorting in Vega-Lite and Plot is a transform applied to data for display. Here the order is the answer, and a drag writes it.',
  code: `mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 16, bottom: 28, left: 100 },
  data: [
    { item: "Rents",           rank: 1, growth: 40 },
    { item: "Population",      rank: 2, growth: 25 },
    { item: "Transit use",     rank: 3, growth: 20 },
    { item: "Remote work",     rank: 4, growth: 15 },
    { item: "Cycling",         rank: 5, growth: 10 },
  ],
  schema: {
    item:   { type: "categorical", domain: ["Rents", "Population", "Transit use", "Remote work", "Cycling"] },
    rank:   { type: "ordinal", domain: [1, 2, 3, 4, 5] },
    growth: { type: "quantitative", domain: [0, 60] },
  },
  axes: { y: false },
  marks: [
    barX({
      fill: "#6366f1",
      channels: {
        y: { field: "rank", edit: rank() }, //! drag vertically to reorder
        x: { field: "growth", edit: move({ channels: ["x"] }) }, //! drag horizontally to size it
      },
    }),
    text({
      fontSize: 12, dx: -8,
      channels: {
        y: { field: "rank" },
        x: { datum: 0 },
        text: { field: "item" },
        textAnchor: { value: "end" },
        lineAnchor: { value: "middle" },
      },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Several futures',
  question: 'Sketch three different ways unemployment could go between now and 2035.',
  try: 'Double-click in the future to start a new line at that level, then drag across it to reshape it. Alt-click a line to delete it.',
  why: 'The observed years are `context`: drawn and read-only, and left out of `getData()`, so the answer is the futures alone. `edit.line.newSeries()` mints a whole new series of anchors on double-click, at the years you list in `samples`, `move({ pick: "sweep" })` reshapes the series under the pointer, and a `custom` constraint caps the number of futures at three.',
  whyNot: 'Both can draw a spaghetti plot of scenarios you already computed. Neither can add a series, and neither can keep the past fixed while the future is drawn.',
  code: `const past = [5.3, 4.9, 4.4, 3.9, 3.7, 8.1, 5.4, 3.6, 3.6, 4.0, 4.2]
  .map((y, i) => ({ s: "observed", year: 2015 + i, rate: y }));
mount(Elicit({
  width: 460, height: 280,
  margins: { top: 14, right: 16, bottom: 28, left: 36 },
  data: past,
  context: (d) => d.s === "observed", //! the past is given, never reported
  schema: {
    s:    { type: "categorical" },
    year: { type: "quantitative", domain: [2015, 2035] },
    rate: { type: "quantitative", domain: [0, 12] },
  },
  constraints: [
    constraints.custom(({ data }) => new Set(data.map((d) => d.s)).size <= 4), //! at most three futures
  ],
  marks: [
    lineY({
      curve: "monotoneX", strokeWidth: 2.5,
      channels: {
        series: { field: "s" },
        x: { field: "year" },
        y: { field: "rate", edit: move({ pick: "sweep" }) }, //! sweep to reshape the line under the pointer
        stroke: { field: "s" },
      },
      edits: [
        edit.line.newSeries({ along: "x", value: "y", series: "s", samples: [2025, 2027, 2029, 2031, 2033, 2035] }), //! double-click to start a future
        edit.line.removeSeries({ when: when.alt }),
      ],
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'A needle for likelihood',
  question: 'How likely is a recession in the next twelve months?',
  try: 'Grab the needle and swing it.',
  why: 'An ordinal answer scale is laid around a half circle by `axisRadial`, and `needle` reads its `theta` through the same scale. `rotate()` inverts the needle’s angle back through that scale, so the answer snaps to a category.',
  whyNot: 'Vega-Lite and Plot have no needle mark and no rotate gesture; a gauge there is an arc drawn to a value you already know.',
  code: `mount(Elicit({
  width: 360, height: 220,
  margins: { top: 40, right: 70, bottom: 20, left: 70 },
  axes: false,
  overflow: "visible",
  data: [{ chance: "Toss-up" }],
  schema: {
    chance: { type: "ordinal", domain: ["Very unlikely", "Unlikely", "Toss-up", "Likely", "Very likely"] },
  },
  marks: [
    axisRadial({
      orient: "top", radius: 110, bands: true, bandWidth: 22, tickSize: 0, labelOffset: 18, fontSize: 9,
      channels: {
        theta: { field: "chance", scale: { range: [180, 0] } },
        fill: { field: "chance", scale: { scheme: "RdYlGn", reverse: true } },
      },
    }),
    needle({
      length: 95, fill: "#334155",
      channels: {
        theta: { field: "chance", scale: { range: [180, 0] }, edit: rotate({ pivot: "mark", fold: false, pick: "direct" }) }, //! swing to answer
      },
    }),
    text({
      fontSize: 14, dy: 32,
      channels: { text: { field: "chance" }, textAnchor: { value: "middle" }, lineAnchor: { value: "middle" } },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'A risk matrix of sticky notes',
  question: 'Where does each project risk sit, by how likely it is and how much damage it would do?',
  try: 'Drag notes into place. Click empty space to add a risk; double-click a note to edit its text; alt-click to delete.',
  why: 'A `sticker` is a text label on a padded box, and both are data: the note’s position is two columns, its text a third. `editText({ multiline: true })` makes the text an answer too, and `create` adds a note where you click. `guides.region` shades the danger zone without touching data.',
  whyNot: 'Text in Vega-Lite and Plot is output. There is no way to add a note, type into one, or drag it to say where it belongs.',
  code: `mount(Elicit({
  width: 460, height: 320,
  margins: { top: 16, right: 16, bottom: 34, left: 44 },
  data: [
    { note: "Key supplier fails", likely: 25, impact: 80 },
    { note: "Scope creep",        likely: 75, impact: 45 },
    { note: "Staff turnover",     likely: 45, impact: 30 },
  ],
  schema: {
    note:   { type: "categorical", open: true },
    likely: { type: "quantitative", domain: [0, 100] },
    impact: { type: "quantitative", domain: [0, 100] },
  },
  guides: [guides.region({ x: [50, 100], y: [50, 100], fill: "#fecaca", opacity: 0.5, label: "Act now" })],
  marks: [
    sticker({
      fill: "#fef3c7", stroke: "#d97706", maxWidth: 110,
      edits: [
        editText({ multiline: true }), //! the note’s text is an answer too
        create({ defaults: { note: "New risk" } }), //! click to add a risk
        remove({ when: when.alt }),
      ],
      channels: {
        x: { field: "likely", edit: move({ channels: ["x", "y"], mode: "relative" }) }, //! drag to place it
        y: { field: "impact" },
        text: { field: "note" },
      },
    }),
  ],
}))`,
});

GALLERY.beyond({
  title: 'Pin it, then say how sure',
  question: 'Where do you think the largest earthquake of the coming year will strike? Drop a pin, then size its ring to show how sure you are.',
  try: 'Drag the pin to move your guess. Drag the ring outward or inward to grow or shrink it. Click elsewhere on the map to add a second guess (up to three).',
  why: 'A geographic answer is two columns, `lon` and `lat`, and `edit.geo.move()` inverts the pointer through the projection to write them. The ring is the same row drawn again with a `size` channel, and `resize` writes the radius — a location and a confidence from one row.',
  whyNot: 'Maps in Vega-Lite and Plot project data to the screen in one direction only; there is no inverse from a pointer back to longitude and latitude, and no way to add a point.',
  code: `const world = await vegaData("world-110m.json");
const land = topojson.feature(world, world.objects.countries);
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "equal-earth", domain: { type: "Sphere" } },
  data: [{ lon: 140, lat: 36, km: 900 }],
  schema: {
    lon: { type: "quantitative", domain: [-180, 180] },
    lat: { type: "quantitative", domain: [-90, 90] },
    km:  { type: "quantitative", domain: [100, 3000] },
  },
  constraints: [count({ max: 3 })],
  marks: [
    geoBasemap({ geojson: land, fill: "#e5e7eb", stroke: "#fff", strokeWidth: 0.4 }),
    geoPoint({
      fill: "#f97316", fillOpacity: 0.15, stroke: "#f97316", strokeWidth: 1.5,
      channels: {
        lon: { field: "lon" }, lat: { field: "lat" },
        size: { field: "km", scale: { range: [6, 60] }, edit: resize() }, //! the ring’s radius is your uncertainty
      },
    }),
    geoPoint({
      size: 5, fill: "#c2410c", stroke: "#fff", strokeWidth: 1.5,
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [edit.geo.move(), edit.geo.create()], //! drag through the projection; click to add
    }),
  ],
}))`,
});
