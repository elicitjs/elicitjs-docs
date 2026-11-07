// Vega-Lite "Interactive Charts" and "Interactive Multi-View Displays".
// These examples are about VIEW interaction: a selection or param that highlights,
// filters or zooms. ElicitJS interactions WRITE DATA instead, so each verdict judges
// two things: can the static chart be recreated, and can the interaction be.
// The interfaces translate the view gesture into an elicitation.
GALLERY.defineFeatures({
  'href': { label: 'Hyperlinks', description: 'A mark that opens a URL on click (Vega-Lite `href` channel, Plot `href`).' },
});

GALLERY.add({
  id: 'vl-interactive_bar_select_highlight',
  status: 'partial',
  verdict: 'The bar chart is exact, and hover and click-to-select reproduce as `effects` on `select()`; what is missing is the conditional encoding that fades every UNselected bar once something is picked.',
  needs: ['selection'],
  prep: [],
  gaps: [
    'Selected bars get a 2 px black stroke and hovered bars a 1 px one, as in the original, via `effects.selected` / `effects.hovered`.',
    'The other bars do not drop to 30% fill opacity: an effect restyles the node in that state, never the nodes that are not.',
  ],
  recreation: {
    code: `const rows = [
  { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: 19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 14, right: 12, bottom: 30, left: 40 },
  data: rows,
  schema: {
    a: { type: "categorical", domain: rows.map((d) => d.a) },
    b: { type: "quantitative", domain: [0, 100] },
  },
  effects: {
    hovered:  { stroke: "black", strokeWidth: 1, outline: false },
    selected: { stroke: "black", strokeWidth: 2, outline: false },
  },
  marks: [
    barY({
      fill: "#4C78A8",
      channels: { x: { field: "a" }, y: { field: "b" } },
      edits: [ select({ multi: true }) ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Select, then classify',
      question: 'These are last year\'s sales for nine product lines. Which ones do you expect to shrink next year?',
      try: 'Click a bar, shift-click more, then click a swatch in the legend.',
      why: 'The original\'s click selection survives as `select({ multi: true })`, but here it is only the target: `edit.legend.category()` on `fill` writes the swatch you click into every selected row, so the selection ends up in `getData()` as an `outlook` column.',
      uses: ['select()', 'edit.legend.category()', 'legend'],
      code: `const rows = [
  { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: 19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
].map((d) => ({ ...d, outlook: "flat" }));
mount(Elicit({
  width: 420, height: 260,
  margins: { top: 14, right: 12, bottom: 30, left: 40 },
  data: rows,
  schema: {
    a: { type: "categorical", domain: rows.map((d) => d.a) },
    b: { type: "quantitative", domain: [0, 100] },
    outlook: { type: "categorical", domain: ["grow", "flat", "shrink"] },
  },
  marks: [
    barY({
      stroke: "black", strokeWidth: 0.5,
      channels: {
        x: { field: "a" }, y: { field: "b" },
        fill: { field: "outlook", scale: { range: ["#4C78A8", "#c7ccd4", "#e45756"] },
                edit: edit.legend.category() },          //! a swatch click writes \`outlook\` into the selection
      },
      edits: [ select({ multi: true }) ],                //! click / shift-click picks the rows to classify
    }),
  ],
}))`,
    },
    {
      title: 'Drag to forecast',
      question: 'What will each product line sell next year?',
      try: 'Drag the top of a bar. The dark tick is last year.',
      why: '`move()` on `y` writes the forecast. Last year\'s values are a `context` table drawn as `tickY`, so they stay fixed and out of `getData()`; `clamp` keeps every forecast on the axis.',
      uses: ['move()', 'clamp()', 'context table', 'tickY'],
      code: `const lastYear = [
  { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: 19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
];
const fields = {
  a: { type: "categorical", domain: lastYear.map((d) => d.a) },
  b: { type: "quantitative", domain: [0, 120] },
};
mount(Elicit({
  width: 420, height: 260,
  margins: { top: 14, right: 12, bottom: 30, left: 40 },
  schema: { data: fields, lastYear: { context: true, fields } },     //! last year, drawn but never elicited
  data: { data: lastYear.map((d) => ({ ...d })), lastYear },
  constraints: [ clamp({ min: 0, max: 120 }) ],                  //! forecasts stay on the axis
  marks: [
    barY({
      fill: "#4C78A8", fillOpacity: 0.55,
      channels: { x: { field: "a" }, y: { field: "b", edit: move() } },  //! dragging the top writes \`b\`
    }),
    tickY({ table: "lastYear", stroke: "#1f2937", strokeWidth: 2,
      channels: { x: { field: "a" }, y: { field: "b" } } }),
  ],
}))`,

    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_histogram_full_height_hover',
  status: 'full',
  verdict: 'The histogram, its full-height hover column (a background bar that only the `hovered` effect makes visible) and the bin tooltip all reproduce.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [
    'The hover column is a second `rect` over the same bins, drawn at opacity 0 and carrying `select()` only so it is pointer-active; `effects.hovered` lifts its opacity to 0.5. A click therefore also selects the bin (selection is UI state; it writes nothing).',
    'The tooltip is the column\'s `tip`, a guide that reads the row under the pointer, so it shows the bin and its count as Vega-Lite\'s `tooltip: true` does.',
  ],
  recreation: {
    code: `const movies = await vegaData("movies.json");
const ratings = movies.map((d) => d["IMDB Rating"]).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(2, 10))(ratings)
  .map((b) => ({ x0: b.x0, x1: b.x1, count: b.length }));
const top = d3.max(bins, (d) => d.count);
mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 34, left: 44 },
  data: bins,
  schema: {
    x0: { type: "quantitative", domain: [1, 10] },
    x1: { type: "quantitative", domain: [1, 10] },
    count: { type: "quantitative", domain: [0, top] },
  },
  axes: { x: { title: "IMDB Rating (binned)" }, y: { title: "count" } },
  effects: { hovered: { opacity: 0.5, outline: false }, selected: false },
  marks: [
    // The full-height column: invisible until hovered.
    rect({
      fill: "#dddddd", opacity: 0,
      channels: { x1: { field: "x0" }, x2: { field: "x1" }, y1: { datum: 0 }, y2: { datum: top } },
      edits: [ select() ],
      tip: (d) => ["IMDB Rating (binned): " + d.x0 + "–" + d.x1, "Count of Records: " + d.count],
    }),
    rect({
      fill: "#4C78A8", stroke: "white", strokeWidth: 1,
      channels: { x1: { field: "x0" }, x2: { field: "x1" }, y1: { datum: 0 }, y2: { field: "count" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Share out 100 films',
      question: 'Of 100 films released next year, how many will land in each IMDB rating band?',
      try: 'Drag bars up or down. The total stays at 100.',
      why: '`move()` on `y` writes each band\'s share, and `maintainSum({ total: 100, strategy: "redistribute" })` takes the difference out of the other bands, so the answer is always a distribution. The `tip` reads out the band under the pointer; it is a guide, so it never blocks the drag.',
      uses: ['move()', 'maintainSum()', 'tip'],
      code: `const bands = ["1–2", "2–3", "3–4", "4–5", "5–6", "6–7", "7–8", "8–9", "9–10"];
mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 34, left: 40 },
  data: bands.map((band) => ({ band, films: 100 / 9 })),
  schema: {
    band: { type: "ordinal", domain: bands },
    films: { type: "quantitative", domain: [0, 50] },
  },
  axes: { x: { title: "IMDB rating" }, y: { title: "films out of 100" } },
  constraints: [
    maintainSum({ field: "films", total: 100, strategy: "redistribute" }),  //! always 100 films
    clamp({ field: "films", min: 0, max: 50 }),
  ],
  marks: [
    barY({
      fill: "#4C78A8",
      channels: { x: { field: "band" }, y: { field: "films", edit: move() } },  //! drag to set a band's share
      tip: (d) => d.band + ": " + d.films.toFixed(1) + " films",          //! reads out the band under the pointer
    }),

  ],
}))`,
    },
    {
      title: 'Click the columns',
      question: 'Which rating bands do you think hold at least one film in ten?',
      try: 'Click a column to add it, click it again to take it back.',
      why: 'The original\'s full-height hover column becomes the answer: `toggle()` mints a row for the band you click and drops it when you click again, so `getData()` is exactly the set of bands you picked.',
      uses: ['toggle()'],
      code: `const bands = ["1–2", "2–3", "3–4", "4–5", "5–6", "6–7", "7–8", "8–9", "9–10"];
mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 12, bottom: 34, left: 12 },
  data: [],
  schema: {
    band: { type: "ordinal", domain: bands },
    on: { type: "quantitative", domain: [0, 1], default: 1 },
  },
  axes: { x: { title: "IMDB rating" }, y: false },
  marks: [
    barY({
      fill: "#4C78A8", fillOpacity: 0.35, stroke: "#4C78A8",
      channels: { x: { field: "band" }, y: { field: "on" } },
      edits: [ toggle() ],                                   //! a click adds or removes that band's row
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_legend',
  status: 'partial',
  verdict: 'The centre-stacked streamgraph and its legend reproduce, with the stack offset computed in d3; clicking a legend entry to dim the other industries does not, because a legend click writes a row rather than driving a highlight.',
  needs: ['selection'],
  prep: ['prep-stack', 'prep-reshape'],
  gaps: [
    'The `stack: "center"` offset is `d3.stackOffsetSilhouette`, computed before `Elicit` and drawn as an `area` between `lo` and `hi`.',
    '`category20b` is not a named scheme (d3 dropped it), so its 20 colours are passed as a `range`; the palette is exact.',

    'No click-to-highlight from the legend.',
  ],
  recreation: {
    code: `const raw = await vegaData("unemployment-across-industries.json");
const industries = [...new Set(raw.map((d) => d.series))].sort();
const wide = d3.rollups(raw, (v) => Object.fromEntries(v.map((d) => [d.series, d.count])), (d) => d.date)
  .map(([date, counts]) => ({ date: new Date(date), ...counts }))
  .sort((a, b) => a.date - b.date);
const layers = d3.stack().keys([...industries].reverse()).offset(d3.stackOffsetSilhouette)(wide);
const rows = layers.flatMap((L) => L.map((p) => ({ series: L.key, date: p.data.date, lo: p[0], hi: p[1] })));
const category20b = ["#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252","#b5cf6b","#cedb9c",
  "#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"];
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 10, right: 10, bottom: 26, left: 18 },
  data: rows,
  schema: {
    series: { type: "categorical", domain: industries },
    date: { type: "temporal", domain: d3.extent(wide, (d) => d.date) },
    lo: { type: "quantitative", domain: d3.extent(rows, (d) => d.lo) },
    hi: { type: "quantitative", domain: d3.extent(rows, (d) => d.hi) },
  },
  axes: { x: { tickFormat: d3.timeFormat("%Y") }, y: false },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      channels: {
        x: { field: "date" }, y1: { field: "lo" }, y2: { field: "hi" },
        fill: { field: "series", scale: { range: category20b },
                legend: { swatchSize: 10, fontSize: 10 } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Pick in the legend',
      question: 'Which industry do you think lost the most jobs in the 2008–09 recession?',
      try: 'Click an industry in the legend.',
      why: 'The answer is a one-row table, and `edit.legend.category()` writes the swatch you click into it — with one row there is nothing to select first. The streamgraph is context, so it is a `guides.custom` that reads the answer and dims every other industry: the original\'s legend highlight, driven by your answer.',
      uses: ['edit.legend.category()', 'legendColor', 'guides.custom'],
      code: `const raw = await vegaData("unemployment-across-industries.json");
const industries = [...new Set(raw.map((d) => d.series))].sort();
const wide = d3.rollups(raw, (v) => Object.fromEntries(v.map((d) => [d.series, d.count])), (d) => d.date)
  .map(([date, counts]) => ({ date: new Date(date), ...counts }))
  .sort((a, b) => a.date - b.date);
const layers = d3.stack().keys([...industries].reverse()).offset(d3.stackOffsetSilhouette)(wide);
const category20b = ["#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252","#b5cf6b","#cedb9c",
  "#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"];
mount(Elicit({
  width: 470, height: 310,
  margins: { top: 30, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: [{ pick: null }],
  schema: { pick: { type: "categorical", domain: industries } },
  guides: [
    guides.custom(({ scales, data, width, height }) => {         //! the streamgraph reads your answer
      const x = d3.scaleUtc(d3.extent(wide, (d) => d.date), [0, width]);
      const y = d3.scaleLinear([d3.min(layers[0], (p) => p[0]), d3.max(layers.at(-1), (p) => p[1])], [height, 0]);
      const shape = d3.area().x((p) => x(p.data.date)).y0((p) => y(p[0])).y1((p) => y(p[1]));
      const pick = data[0].pick;
      return layers.map((L) => ({
        type: "path", d: shape(L), fill: scales.fill.encode(L.key), stroke: "none", background: true,
        opacity: pick == null || pick === L.key ? 1 : 0.2,
      }));
    }),
  ],
  marks: [
    text({
      textAnchor: "start", fontSize: 13,
      channels: {
        x: { value: 0 }, y: { value: -14 },
        text: { fn: (d) => d.pick ? "Your answer: " + d.pick : "Click an industry in the legend" },
        fill: { field: "pick", scale: { range: category20b } },
      },
    }),
    legendColor({ anchor: "right", swatchSize: 10, fontSize: 10, title: "industry",
                 edit: edit.legend.category() }),   //! a swatch click writes \`pick\`
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_href',
  status: 'partial',
  verdict: 'The hollow-point scatter coloured by origin and its name tooltip are exact; clicking a car to open a web search has no ElicitJS equivalent.',
  needs: ['href'],
  prep: ['prep-calculate'],
  gaps: [
    'Cars with no horsepower or mileage are dropped first (Vega-Lite drops them silently).',
    'The name tooltip is `tip: ["name"]` on the points.',
    'No `href` channel: a click on a car opens nothing, since a click in ElicitJS writes data or does nothing.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ name: d.Name, hp: d.Horsepower, mpg: d.Miles_per_Gallon, origin: d.Origin }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    name: { type: "categorical" },
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
    origin: { type: "categorical", domain: ["Europe", "Japan", "USA"] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({
      fill: "none", strokeWidth: 1.5, size: 3,
      tip: ["name"],
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        stroke: { field: "origin", scale: { range: ["#4c78a8", "#f58518", "#e45756"] }, legend: true },
      },
    }),

  ],
}))`,
  },
  interfaces: [
    {
      title: 'Place a modern car',
      question: 'Where would a 2024 hybrid hatchback sit among these 1970s and 80s cars?',
      try: 'Click empty space to place a car (up to three), drag one to adjust it.',
      why: '`lock: "seed"` makes the real cars fixed context while every row you add stays free. `create()` mints a row at the click with `origin: "yours"` from `defaults`, `move()` adjusts it, and `count` with `strategy: "reject"` caps you at three. Hover a real car for its name, as in the original.',
      uses: ['create()', 'move()', 'lock', 'count()', 'tip'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d, i) => d.Horsepower != null && d.Miles_per_Gallon != null && i % 6 === 0)
  .map((d) => ({ name: d.Name, hp: d.Horsepower, mpg: d.Miles_per_Gallon, origin: d.Origin }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  lock: "seed",                                              //! the real cars are given, not elicited
  schema: {
    name: { type: "categorical" },
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 70] },
    origin: { type: "categorical", domain: ["Europe", "Japan", "USA", "yours"] },
  },
  constraints: [ count({ max: cars.length + 3, strategy: "reject" }) ],   //! three guesses at most
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({
      size: 4, strokeWidth: 1.5,
      tip: (d) => d.name || "your car",                      //! hover a car for its name
      channels: {

        x: { field: "hp" }, y: { field: "mpg" },
        fill: { field: "origin", scale: { range: ["#fff", "#fff", "#fff", "#111"] } },
        stroke: { field: "origin", scale: { range: ["#4c78a8", "#f58518", "#e45756", "#111"] }, legend: true },
      },
      edits: [
        create({ defaults: { origin: "yours" } }),           //! a click mints your car
        move({ channels: ["x", "y"] }),
      ],
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_brush',
  status: 'partial',
  verdict: 'The scatter coloured by cylinders reproduces; the brush that greys out everything outside it does not, since an ElicitJS brush is a row of data, not a selection that conditions another mark\'s colour.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    'Every car is drawn in its cylinder colour (the original\'s state with the brush covering everything).',
    'No interval brush. The interface below gets the highlight back by drawing the cars as a guide that reads an elicited box.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, cyl: d.Cylinders }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
    cyl: { type: "ordinal", domain: [3, 4, 5, 6, 8] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({
      fill: "none", strokeWidth: 1.5, size: 3,
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        stroke: { field: "cyl", legend: true },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Brush your region',
      question: 'Where do most new cars sold in 2025 fall on horsepower and mileage?',
      try: 'Drag the box by its body, edges or corners.',
      why: 'The box is the answer: one row whose four columns `brushRect()` writes as you move or resize it. The 1970s cars are context, so they are a `guides.custom` that reads the box and greys out every car outside it — the original\'s brush highlight, kept as a comparison.',
      uses: ['brushRect()', 'guides.custom'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, cyl: d.Cylinders }));
const cylColour = d3.scaleOrdinal([3, 4, 5, 6, 8], d3.quantize(d3.interpolateBlues, 7).slice(2));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 14, bottom: 36, left: 50 },
  data: [{ hpLo: 55, hpHi: 160, mpgLo: 13, mpgHi: 37 }],     // the original brush's start
  schema: {
    hpLo: { type: "quantitative", domain: [0, 320] }, hpHi: { type: "quantitative", domain: [0, 320] },
    mpgLo: { type: "quantitative", domain: [0, 60] }, mpgHi: { type: "quantitative", domain: [0, 60] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  guides: [
    guides.custom(({ scales, data }) => {                  //! 1970s cars, coloured only inside your box
      const b = data[0];
      const inside = (d) => d.hp >= b.hpLo && d.hp <= b.hpHi && d.mpg >= b.mpgLo && d.mpg <= b.mpgHi;
      return cars.map((d) => ({
        type: "circle", cx: scales.x.encode(d.hp), cy: scales.y.encode(d.mpg), r: 3,
        fill: "none", strokeWidth: 1.3, stroke: inside(d) ? cylColour(d.cyl) : "#c4c4c4",
      }));
    }),
  ],
  marks: [
    rect({
      fill: "#333", fillOpacity: 0.06, stroke: "#333", strokeWidth: 1,
      channels: {
        x1: { field: "hpLo" }, x2: { field: "hpHi" },
        y1: { field: "mpgLo" }, y2: { field: "mpgHi" },
      },
      edits: [ brushRect({ edgeInset: 10 }) ],               //! body moves, edges and corners resize
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_area_brush',
  status: 'partial',
  verdict: 'The area of total unemployment reproduces; brushing a span to repaint it goldenrod does not — though the interface rebuilds that highlight from an elicited span.',
  needs: ['selection'],
  prep: ['prep-aggregate'],
  gaps: [
    'Monthly totals are summed in d3 first.',
    'Drawn goldenrod, as the original renders before any brush: an empty brush passes every month through to the highlight layer.',
    'No interval brush on the chart itself.',
  ],
  recreation: {
    code: `const raw = await vegaData("unemployment-across-industries.json");
const totals = d3.rollups(raw, (v) => d3.sum(v, (d) => d.count), (d) => d.date)
  .map(([date, count]) => ({ date: new Date(date), count }))
  .sort((a, b) => a.date - b.date);
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 12, right: 14, bottom: 30, left: 50 },
  data: totals,
  schema: {
    date: { type: "temporal", domain: d3.extent(totals, (d) => d.date) },
    count: { type: "quantitative", domain: [0, 16000] },
  },
  axes: { x: { tickFormat: d3.timeFormat("%Y") } },
  // With the brush empty, the goldenrod "selected" layer covers everything.
  marks: [ areaY({ fill: "goldenrod", fillOpacity: 1, stroke: "none",
                   channels: { x: { field: "date" }, y: { field: "count" } } }) ],
}))`,
  },
  interfaces: [
    {
      title: 'Brush the recession',
      question: 'Which months would you call the 2008–09 recession in this record?',
      try: 'Drag the band to move it, or drag either edge.',
      why: '`brushSpan()` on a `rect` with only `x1`/`x2` writes a start and an end date. The area is context, drawn by `guides.custom`, which repaints the months inside your span goldenrod as the original\'s brush did.',
      uses: ['brushSpan()', 'guides.custom'],
      code: `const raw = await vegaData("unemployment-across-industries.json");
const totals = d3.rollups(raw, (v) => d3.sum(v, (d) => d.count), (d) => d.date)
  .map(([date, count]) => ({ date: new Date(date), count }))
  .sort((a, b) => a.date - b.date);
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 12, right: 14, bottom: 30, left: 50 },
  data: [{ from: new Date("2007-06-01"), to: new Date("2008-06-01") }],
  schema: {
    from: { type: "temporal", domain: d3.extent(totals, (d) => d.date) },
    to:   { type: "temporal", domain: d3.extent(totals, (d) => d.date) },
  },
  axes: { x: { tickFormat: d3.timeFormat("%Y") }, y: false },
  guides: [
    guides.custom(({ scales, data, height }) => {              //! repaints the months inside your span
      const y = d3.scaleLinear([0, 16000], [height, 0]);
      const shape = d3.area().x((d) => scales.x.encode(d.date)).y0(height).y1((d) => y(d.count));
      const { from, to } = data[0];
      return [
        { type: "path", d: shape(totals), fill: "#4c78a8", stroke: "none", background: true },
        { type: "path", d: shape(totals.filter((d) => d.date >= from && d.date <= to)), fill: "goldenrod", stroke: "none", background: true },
      ];
    }),
  ],
  marks: [
    rect({
      fill: "#333", fillOpacity: 0.08, stroke: "#333",
      channels: { x1: { field: "from" }, x2: { field: "to" } },
      edits: [ brushSpan({ channels: ["x1", "x2"], edgeInset: 8 }) ],   //! writes \`from\` and \`to\`
    }),
  ],
}))`,
    },
    {
      title: 'Sweep what came next',
      question: 'Unemployment through 2007 is shown. How did it move over 2008 and 2009?',
      try: 'Sweep across the flat stretch on the right to draw it.',
      why: '`lock` with a predicate fixes every month before 2008, so the sweep can only reshape the months you are asked about. `move({ pick: "sweep" })` on `y` sets each month the pointer passes over.',
      uses: ['move({ pick: "sweep" })', 'lock'],
      code: `const raw = await vegaData("unemployment-across-industries.json");
const cut = new Date("2008-01-01");
const totals = d3.rollups(raw, (v) => d3.sum(v, (d) => d.count), (d) => d.date)
  .map(([date, count]) => ({ date: new Date(date), count }))
  .filter((d) => d.date >= new Date("2005-01-01"))
  .sort((a, b) => a.date - b.date);
const flat = totals.filter((d) => d.date < cut).at(-1).count;
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 12, right: 14, bottom: 30, left: 50 },
  data: totals.map((d) => (d.date < cut ? d : { ...d, count: flat })),
  lock: (d) => d.date < cut,                                  //! the record is fixed; 2008 on is yours
  schema: {
    date: { type: "temporal", domain: d3.extent(totals, (d) => d.date) },
    count: { type: "quantitative", domain: [0, 18000] },
  },
  axes: { x: { tickFormat: d3.timeFormat("%Y") } },
  guides: [ guides.region({ x: [cut, totals.at(-1).date], fill: "#f59e0b", opacity: 0.08 }) ],
  marks: [
    areaY({
      fill: "#4c78a8", fillOpacity: 0.8, handles: "hit",
      channels: { x: { field: "date" }, y: { field: "count", edit: move({ pick: "sweep" }) } },  //! sweep to draw
    }),
  ],
}))`,
    },
    {
      title: 'Sweep a band',
      question: 'Unemployment through 2007 is shown. Between what low and high do you think it ran over 2008 and 2009?',
      try: 'Sweep along the top edge of the goldenrod band to raise or lower it, along the bottom edge to set the low.',
      why: 'Each month is a row with a `lo` and a `hi`, and `edit.line.sweep()` on both `y1` and `y2` paints whichever edge is nearer the pointer at press. `ordering` keeps every low under its high. The record is a `context` table: drawn as a plain area, read-only, and left out of `getData()`.',
      uses: ['edit.line.sweep()', 'ordering()', 'context table'],
      code: `const raw = await vegaData("unemployment-across-industries.json");
const cut = new Date("2008-01-01");
const totals = d3.rollups(raw, (v) => d3.sum(v, (d) => d.count), (d) => d.date)
  .map(([date, count]) => ({ date: new Date(date), count }))
  .filter((d) => d.date >= new Date("2005-01-01"))
  .sort((a, b) => a.date - b.date);
const record = totals.filter((d) => d.date < cut);
const last = record.at(-1).count;
const ahead = totals.filter((d) => d.date >= cut)
  .map((d) => ({ date: d.date, lo: last * 0.85, hi: last * 1.15 }));    // a flat, wide prior
const dates = { type: "temporal", domain: d3.extent(totals, (d) => d.date) };
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 12, right: 14, bottom: 30, left: 66 },

  schema: {
    data: { date: dates,
            lo: { type: "quantitative", domain: [0, 18000] },
            hi: { type: "quantitative", domain: [0, 18000] } },
    record: { context: true, fields: { date: dates,                     //! the record: drawn, never elicited
              count: { type: "quantitative", domain: [0, 18000] } } },
  },
  data: { data: ahead, record },
  constraints: [ ordering({ field: ["lo", "hi"] }) ],                   //! a low never passes its high
  axes: { x: { tickFormat: d3.timeFormat("%Y") }, y: { title: "unemployed (thousands)" } },
  marks: [
    areaY({ table: "record", fill: "#4c78a8", fillOpacity: 0.8,
      channels: { x: { field: "date" }, y: { field: "count" } } }),
    areaY({
      fill: "goldenrod", fillOpacity: 0.35, stroke: "goldenrod", handles: "hit",
      channels: {
        x: { field: "date" },
        y1: { field: "lo", edit: edit.line.sweep() },                   //! sweep the low edge…
        y2: { field: "hi", edit: edit.line.sweep() },                   //! …or the high one
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_paintbrush',

  status: 'partial',
  verdict: 'The hollow scatter is exact, and nearest-point painting reproduces as a proximity `select()` whose rings stand in for the enlarged points; painting by hover alone (with shift to accumulate) does not, because selection is made by clicking.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    'Hover rings the nearest car (`effects.hovered`), and a click keeps it (`select({ pick: "nearest", multi: true })`, shift-click adds). Vega-Lite paints on hover and keeps a trail only with shift held.',
    'A painted point is ringed rather than redrawn at 300 px²: an effect cannot change a mark\'s size.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  effects: {
    hovered:  { outline: { color: "#4c78a8", width: 1.5, pad: 6, opacity: 0.9 } },
    selected: { outline: { color: "#4c78a8", width: 1.5, pad: 6, opacity: 0.9 } },
  },
  marks: [
    point({
      fill: "none", stroke: "#4c78a8", strokeWidth: 1.5, size: 3,
      channels: { x: { field: "hp" }, y: { field: "mpg" } },
      edits: [ select({ pick: "nearest", threshold: 30, multi: true }) ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Flag the outliers',
      question: 'Which of these cars would you call unusual — far thirstier or thriftier than their power suggests?',
      try: 'Click near a car to flag it, click again to clear it.',
      why: 'The paintbrush becomes a column: `cycle()` on `fill` steps a car between `typical` and `outlier`, and `pick: "nearest"` lets a click land on the closest car, as the original\'s `nearest: true` did, so you never have to hit a 3 px dot.',
      uses: ['cycle()', 'pick: "nearest"'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d, i) => d.Horsepower != null && d.Miles_per_Gallon != null && i % 5 === 0)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, flag: "typical" }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
    flag: { type: "categorical", domain: ["typical", "outlier"] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({
      size: 4, stroke: "#4c78a8", strokeWidth: 1.5,
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        fill: { field: "flag", scale: { range: ["#ffffff", "#e45756"] }, legend: true,
                edit: cycle({ pick: "nearest", threshold: 25 }) },   //! a click flips the nearest car's \`flag\`
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-selection_translate_scatterplot_drag',
  status: 'full',
  verdict: 'The sized-circle scatter opens on the original\'s 75–150 hp × 20–40 mpg window, and `edit.axis.zoom()` on both axes gives the wheel zoom that `bind: "scales"` provides. Dragging the plot to pan is out of scope.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Every car is loaded; the schema declares the full range (the zoom-out ceiling) and `el.setDomain` opens on the original window. `clip: true` hides the cars outside it, as Vega-Lite clips them.',
    'The wheel zooms each axis about the pointer, and every zoom is undoable; dragging to pan, which `bind: "scales"` also gives, is out of scope.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, cyl: d.Cylinders }));
const el = Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  clip: true,
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
    cyl: { type: "quantitative", domain: [0, 8] },
  },
  axes: {
    x: { title: "Horsepower", edit: edit.axis.zoom() },
    y: { title: "Miles_per_Gallon", edit: edit.axis.zoom() },
  },
  marks: [
    point({
      fill: "#4c78a8", fillOpacity: 0.7,
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        size: { field: "cyl", scale: { type: "sqrt", range: [0, 10] }, legend: true },
      },
    }),
  ],
});
mount(el);
el.setDomain("hp", [75, 150]);     // the original's opening window
el.setDomain("mpg", [20, 40]);`,
  },
  interfaces: [

    {
      title: 'Zoom to your range',
      question: 'What horsepower range would you shop in for a family car? Stretch the axis until the window covers it.',
      try: 'Drag the blue handle at either end of the horsepower axis: inward widens the range, outward narrows it.',
      why: '`edit.axis.scale()` on the x axis writes the horsepower DOMAIN — the schema, not a row — so the answer is `getSchema().hp.domain` and `getData()` never changes. The cars rescale with it, which is the original\'s zoom, but here the window you leave is what is recorded.',
      uses: ['edit.axis.scale()', 'axisX'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d, i) => d.Horsepower != null && d.Miles_per_Gallon != null && i % 3 === 0)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, cyl: d.Cylinders }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 14, bottom: 40, left: 50 },
  overflow: "hidden",
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [40, 240] },
    mpg: { type: "quantitative", domain: [5, 50] },
    cyl: { type: "quantitative", domain: [3, 8] },
  },
  axes: false,
  marks: [
    axisY({ title: "mpg" }),
    axisX({ title: "Horsepower", edit: edit.axis.scale() }),      //! dragging the axis writes the hp domain
    point({
      fill: "#4c78a8", fillOpacity: 0.6,
      channels: { x: { field: "hp" }, y: { field: "mpg" }, size: { field: "cyl", scale: { range: [2, 6] } } },
    }),
  ],
}))`,
    },
    {
      title: 'Zoom in, then place',
      question: 'Where would a 1982 Honda Civic sit among these cars? Zoom in to place it precisely.',
      try: 'Scroll over the plot to zoom, then drag the red dot. Scroll the other way to see the whole field.',
      why: '`edit.axis.zoom()` on each axis zooms the domain about the pointer, and `move()` inverts through the zoomed scale, so the closer you zoom the finer the answer. The other cars are a `context` table, so they frame the guess and stay out of `getData()`.',
      uses: ['edit.axis.zoom()', 'move()', 'context table'],
      code: `const seen = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, cyl: d.Cylinders }));
const fields = {
  hp: { type: "quantitative", domain: [0, 240] },
  mpg: { type: "quantitative", domain: [0, 50] },
  cyl: { type: "quantitative", domain: [0, 8] },
};
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 14, bottom: 36, left: 50 },
  clip: true,
  schema: { data: fields, seen: { context: true, fields } },            //! the record frames the guess
  data: { data: [{ hp: 120, mpg: 25, cyl: 4 }], seen },
  axes: {
    x: { title: "Horsepower", edit: edit.axis.zoom() },                  //! the wheel zooms about the pointer
    y: { title: "Miles_per_Gallon", edit: edit.axis.zoom() },
  },
  marks: [
    point({
      table: "seen", fill: "#4c78a8", fillOpacity: 0.35,
      channels: { x: { field: "hp" }, y: { field: "mpg" }, size: { field: "cyl", scale: { type: "sqrt", range: [0, 8] } } },
    }),
    point({
      fill: "#e45756", stroke: "#fff", strokeWidth: 1.5, size: 7,
      channels: { x: { field: "hp" }, y: { field: "mpg" } },
      edits: [ move({ channels: ["x", "y"] }) ],                         //! drag the Civic to your guess
    }),
  ],
}))`,
    },
  ],
});


GALLERY.add({
  id: 'vl-interactive_query_widgets',
  status: 'partial',
  verdict: 'The chart in its initial state (4-cylinder 1977 cars enlarged and coloured by origin, the rest grey) reproduces with a precomputed column; the two range sliders that re-query it do not.',
  needs: ['input-widgets', 'selection'],
  prep: ['prep-calculate'],
  gaps: [
    'The highlight is a precomputed `hl` column (origin when the car matches, `other` otherwise), so it is fixed at Cylinders = 4, Year = 1977.',
    'Vega-Lite\'s `year()` reads the date in local time, so west of UTC the original highlights 1976\'s cars; this reads the year in UTC.',
    'No bound sliders.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => {
    const match = d.Cylinders === 4 && new Date(d.Year).getUTCFullYear() === 1977;
    return { hp: d.Horsepower, mpg: d.Miles_per_Gallon, hl: match ? d.Origin : "other", big: match ? 5.5 : 3 };
  })
  .sort((a, b) => a.big - b.big);
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
    hl: { type: "categorical", domain: ["Europe", "Japan", "USA", "other"] },
    big: { type: "quantitative", domain: [3, 5.5] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({
      fillOpacity: 0.7,
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        fill: { field: "hl", scale: { range: ["#4c78a8", "#f58518", "#e45756", "#8c8c8c"] }, legend: true },
        size: { field: "big", scale: null },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Fit the trend',
      question: 'Among 4-cylinder cars from 1977, how fast does mileage fall as horsepower rises?',
      try: 'Drag the left handle to move the line, either end handle to tilt it.',
      why: 'The sliders picked a subset to look at; here that subset is the question. `trend` draws `mpg = intercept + slope × hp`, and the two edits write those parameters. The cars are a `context` table, grey with the asked-about group in colour, and stay out of `getData()`.',
      uses: ['trend', 'edit.trend.intercept()', 'edit.trend.slope()', 'context table'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => {
    const match = d.Cylinders === 4 && new Date(d.Year).getUTCFullYear() === 1977;
    return { hp: d.Horsepower, mpg: d.Miles_per_Gallon, group: match ? "4-cyl 1977" : "other", r: match ? 4.5 : 2.5 };
  })
  .sort((a, b) => a.r - b.r);
const hp = { type: "quantitative", domain: [40, 240] };
const mpg = { type: "quantitative", domain: [0, 50] };
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 14, bottom: 36, left: 50 },
  axes: { origin: false, x: { title: "Horsepower" }, y: { title: "mpg" } },
  schema: {
    data: { hp, mpg, intercept: { type: "quantitative" }, slope: { type: "quantitative" } },
    cars: { context: true, fields: { hp, mpg,                          //! the cars: drawn, never elicited
      group: { type: "categorical", domain: ["4-cyl 1977", "other"] },
      r: { type: "quantitative", domain: [2.5, 4.5] } } },
  },
  data: { data: [{ intercept: 30, slope: 0 }], cars },
  marks: [
    point({
      table: "cars", opacity: 0.8,
      channels: { x: { field: "hp" }, y: { field: "mpg" }, size: { field: "r", scale: null },
                  fill: { field: "group", scale: { range: ["#4c78a8", "#d4d4d4"] } } },
    }),

    trend({
      stroke: "#e45756", strokeWidth: 2.5,
      channels: {
        x: { field: "hp" }, y: { field: "mpg" },
        intercept: { field: "intercept", edit: edit.trend.intercept() },   //! sets the line's height
        slope: { field: "slope", edit: edit.trend.slope() },               //! tilts it about the anchor
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-selection_layer_bar_month',
  status: 'partial',
  verdict: 'The monthly bars and the red mean rule reproduce, and the rule follows a selection — but the selection is made by clicking months (shift to add), not by brushing an interval.',
  needs: ['selection'],
  prep: ['prep-aggregate'],
  gaps: [
    'The rule is a `guides.rule` whose `y` is a function of the context: the mean of every selected month\'s days, or of all days when nothing is selected.',
    'Click and shift-click instead of an x-interval brush; unselected bars are not dimmed to 0.7.',
  ],
  recreation: {
    code: `const weather = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => {
  const days = weather.filter((d) => d.date.getUTCMonth() === m);
  return { month: d3.utcFormat("%b")(new Date(Date.UTC(2000, m, 1))),
           mean: d3.mean(days, (d) => d.precipitation), days: days.length };
});
mount(Elicit({
  width: 430, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: months,
  schema: {
    month: { type: "ordinal", domain: months.map((d) => d.month) },
    mean: { type: "quantitative", domain: [0, 6] },
    days: { type: "quantitative" },
  },
  effects: { selected: { outline: false, stroke: "#333", strokeWidth: 1.5 } },
  guides: [
    guides.rule({
      y: ({ data, scales }) => {
        const sel = scales.selectionAll();
        const rows = sel.length ? sel.map((i) => data[i]) : data;
        return d3.sum(rows, (d) => d.mean * d.days) / d3.sum(rows, (d) => d.days);
      },
      stroke: "firebrick", strokeWidth: 3,
    }),
  ],
  marks: [
    barY({
      fill: "#4c78a8",
      channels: { x: { field: "month" }, y: { field: "mean" } },
      edits: [ select({ multi: true }) ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Estimate each month',
      question: 'On an average day in each month, how many millimetres of rain fall in Seattle?',
      try: 'Drag each bar to your estimate. The red line is the yearly mean of your answers.',
      why: '`move()` on `y` writes each month\'s estimate, and `guides.rule` with a function `y` recomputes the mean from the live rows on every render — the original\'s rule, now chasing your answers instead of a brush.',
      uses: ['move()', 'guides.rule', 'clamp()'],
      code: `const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
mount(Elicit({
  width: 430, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: months.map((month) => ({ month, mm: 3 })),
  schema: {
    month: { type: "ordinal", domain: months },
    mm: { type: "quantitative", domain: [0, 8] },
  },
  constraints: [ clamp({ min: 0, max: 8 }) ],
  axes: { y: { title: "mm/day" } },
  guides: [
    guides.rule({ y: ({ data }) => d3.mean(data, (d) => d.mm),   //! the mean follows your bars
                  stroke: "firebrick", strokeWidth: 3, label: "your yearly mean" }),
  ],
  marks: [
    barY({
      fill: "#4c78a8",
      channels: { x: { field: "month" }, y: { field: "mm", edit: move() } },   //! drag to estimate
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_line_hover',
  status: 'partial',
  verdict: 'The four price lines with end labels reproduce; highlighting the hovered line and greying out the rest does not.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    'The end-of-line dots and labels are a `guides.custom`, since a mark has no "last row of each series" filter.',
    'No hover highlight. `effects.hovered` restyles a node a gesture would take, but a line\'s path is not a grab target (its handles are), so there is nothing to hover; and fading the OTHER lines is a selection-driven encoding in any case.',
  ],
  recreation: {
    code: `const parse = d3.timeParse("%b %d %Y");
const rows = (await vegaData("stocks.csv"))
  .filter((d) => d.symbol !== "IBM")
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }));
const ends = d3.rollups(rows, (v) => v.at(-1), (d) => d.symbol).map(([, d]) => d);
mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 52, bottom: 36, left: 54 },
  data: rows,
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "MSFT"] },
    date: { type: "temporal", domain: d3.extent(rows, (d) => d.date) },
    price: { type: "quantitative", domain: [0, 800] },
  },
  axes: { x: { title: "date" }, y: { title: "price" } },
  guides: [

    guides.custom(({ scales }) => ends.flatMap((d) => [
      { type: "circle", cx: scales.x.encode(d.date), cy: scales.y.encode(d.price), r: 4, fill: scales.stroke.encode(d.symbol) },
      { type: "text", x: scales.x.encode(d.date) + 6, y: scales.y.encode(d.price) + 4, text: d.symbol,
        fontSize: 11, textAnchor: "start", fill: scales.stroke.encode(d.symbol) },
    ])),
  ],
  marks: [
    lineY({
      strokeWidth: 2,
      channels: { x: { field: "date" }, y: { field: "price" }, stroke: { field: "symbol" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep 2008–2010',
      question: 'Prices up to January 2007 are shown. Where did each stock trade at the start of 2008, 2009 and 2010?',
      try: 'Press near a line in the shaded years and sweep across to draw it.',
      why: '`move({ pick: "sweep" })` on `y` locks onto the nearest series at press, so one gesture redraws one stock. `lock` with a predicate fixes the record years, leaving only the three you are asked about.',
      uses: ['move({ pick: "sweep" })', 'lock', 'guides.region'],
      code: `const parse = d3.timeParse("%b %d %Y");
const yearly = (await vegaData("stocks.csv"))
  .filter((d) => d.symbol !== "IBM")
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }))
  .filter((d) => d.date.getMonth() === 0 && d.date.getFullYear() >= 2004)
  .map((d) => ({ symbol: d.symbol, year: d.date.getFullYear(), price: d.price }));
const at2007 = Object.fromEntries(yearly.filter((d) => d.year === 2007).map((d) => [d.symbol, d.price]));
mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 14, bottom: 30, left: 40 },
  data: yearly.map((d) => (d.year <= 2007 ? d : { ...d, price: at2007[d.symbol] })),
  lock: (d) => d.year <= 2007,                                   //! the record is given
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "MSFT"] },
    year: { type: "quantitative", domain: [2004, 2010] },
    price: { type: "quantitative", domain: [10, 1000] },
  },
  scales: { y: { type: "log" } },                                // keeps the cheap stocks sweepable
  axes: { x: { tickFormat: "d" }, y: { tickValues: [10, 20, 50, 100, 200, 500, 1000], tickFormat: String } },
  guides: [ guides.region({ x: [2007, 2010], fill: "#f59e0b", opacity: 0.08 }) ],
  marks: [
    lineY({
      strokeWidth: 2.5, handleSize: 3,
      channels: {
        x: { field: "year" },
        y: { field: "price", edit: move({ pick: "sweep", guide: true }) },   //! one sweep redraws the nearest stock
        stroke: { field: "symbol", legend: { labelWidth: 40 } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_line_point_hover',
  status: 'full',
  verdict: 'The five lines, the hover-revealed point (invisible points that `effects.hovered` makes opaque) and its tooltip all reproduce.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The hidden points carry `select()` only so they are pointer-active; `effects.selected` is off so a click changes nothing visible.',
    'The tooltip is `tip: true` on the hidden points: every column of the row under the pointer.',
    'The hovered point keeps its size; Vega-Lite also shrinks it from 100 to 48 px².',
  ],
  recreation: {
    code: `const parse = d3.timeParse("%b %d %Y");
const rows = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }));
mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: rows,
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "IBM", "MSFT"] },
    date: { type: "temporal", domain: d3.extent(rows, (d) => d.date) },
    price: { type: "quantitative", domain: [0, 800] },
  },
  legends: { stroke: { labelWidth: 40 }, fill: false },   // room for the ticker symbols
  effects: { hovered: { opacity: 1, outline: false }, selected: false },
  marks: [
    lineY({ strokeWidth: 2,
      channels: { x: { field: "date" }, y: { field: "price" }, stroke: { field: "symbol" } } }),
    point({
      size: 5, opacity: 0, tip: true,
      channels: { x: { field: "date" }, y: { field: "price" }, fill: { field: "symbol" } },
      edits: [ select() ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Extend the lines',
      question: 'Where will AAPL, AMZN and GOOG trade in January 2011, 2012 and 2013?',
      try: 'Click in the shaded years near a line to extend it. Reset to start again.',
      why: '`edit.line.anchor({ into: "nearest" })` appends a point to the series nearest the click, taking its `symbol`, so every forecast is a row of that stock. `clamp` and `snap` hold the new point to a whole year inside the forecast window, and the `tip` reads out any point you hover.',
      uses: ['edit.line.anchor()', 'clamp()', 'snap()', 'tip'],
      code: `const parse = d3.timeParse("%b %d %Y");
const yearly = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }))
  .filter((d) => ["AAPL", "AMZN", "GOOG"].includes(d.symbol) && d.date.getMonth() === 0 && d.date.getFullYear() >= 2005)
  .map((d) => ({ symbol: d.symbol, year: d.date.getFullYear(), price: d.price }));
mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 14, bottom: 30, left: 40 },
  data: yearly,
  constraints: [
    clamp({ field: "year", min: 2011, max: 2013 }),                //! forecasts land in 2011–2013
    snap({ field: "year", step: 1 }),
  ],
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG"] },
    year: { type: "quantitative", domain: [2005, 2013] },
    price: { type: "quantitative", domain: [0, 900] },
  },
  axes: { x: { tickFormat: "d" } },
  guides: [ guides.region({ x: [2010.5, 2013], fill: "#f59e0b", opacity: 0.08 }) ],
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 4,
      tip: (d) => d.symbol + " " + d.year + ": $" + d.price.toFixed(0),                  //! hover a point for its value
      channels: {
        series: { field: "symbol" },

        x: { field: "year" }, y: { field: "price" },
        stroke: { field: "symbol", legend: { labelWidth: 40 } },
      },
      edits: [
        edit.line.anchor({ into: "nearest", channels: ["x", "y"], series: "symbol", threshold: 200 }),  //! a click extends the nearest stock
      ],
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_multi_line_label',
  status: 'partial',
  verdict: 'The five price lines and a grey rule that follows the pointer reproduce; labelling every line\'s value at the nearest date does not — though the interface rebuilds it around a date you drag.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    'The rule is `guides.crosshair({ y: false })`, with the date read off the axis. It follows the pointer smoothly rather than snapping to the nearest date.',
    'No points or price labels on every line at that date: that is a hover-driven filter on another layer. Hovering a line\'s point shows its price as a `tip` instead.',
  ],
  recreation: {
    code: `const parse = d3.timeParse("%b %d %Y");
const rows = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }));
mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: rows,
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "IBM", "MSFT"] },
    date: { type: "temporal", domain: d3.extent(rows, (d) => d.date) },
    price: { type: "quantitative", domain: [0, 800] },
  },
  legends: { stroke: { labelWidth: 40 } },   // room for the ticker symbols
  guides: [ guides.crosshair({ y: false, stroke: "gray", strokeDash: "none", format: d3.timeFormat("%b %Y") }) ],
  marks: [
    lineY({ strokeWidth: 2,
      channels: { x: { field: "date" }, y: { field: "price" }, stroke: { field: "symbol" } } }),
    point({ size: 4, opacity: 0, tip: (d) => d.symbol + " " + d.price,
      channels: { x: { field: "date" }, y: { field: "price" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Drag the date rule',

      question: 'In which month did these stocks hit bottom after the dot-com crash?',
      try: 'Drag the grey rule left or right; the labels read each stock at that month.',
      why: 'The rule is the answer: `move()` on `x` writes its `month`, and `snap` holds it to whole months. The lines and their value labels are a `guides.custom` that reads that month — the original\'s nearest-date labels, driven by your answer rather than the hover.',
      uses: ['move()', 'snap()', 'ruleX', 'guides.custom'],
      code: `const parse = d3.timeParse("%b %d %Y");
// x is months since January 2000, so a whole number is a whole month.
const rows = (await vegaData("stocks.csv"))
  .map((d) => { const t = parse(d.date);
    return { symbol: d.symbol, m: (t.getFullYear() - 2000) * 12 + t.getMonth(), price: d.price }; })
  .filter((d) => d.m < 72);
const colour = d3.scaleOrdinal(["AAPL", "AMZN", "GOOG", "IBM", "MSFT"], d3.schemeTableau10);
const bySymbol = d3.groups(rows, (d) => d.symbol);
mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: [{ month: 12, lo: 0, hi: 450 }],
  schema: {
    month: { type: "quantitative", domain: [0, 71] },
    lo: { type: "quantitative", domain: [0, 450] },
    hi: { type: "quantitative", domain: [0, 450] },
  },
  constraints: [ snap({ field: "month", step: 1 }) ],                 //! whole months only
  axes: { x: { tickValues: d3.range(0, 72, 12), tickFormat: (m) => String(2000 + m / 12) } },
  guides: [
    guides.custom(({ scales, data }) => {                              //! labels read the month you set
      const at = data[0].month;
      const stamp = { type: "text", x: scales.x.encode(at) + 5, y: 8, fontSize: 11, textAnchor: "start",
                      fill: "#555", text: d3.timeFormat("%b %Y")(new Date(2000, at, 1)) };
      return [stamp, ...bySymbol.flatMap(([s, v]) => {
        const near = v.find((d) => d.m === at);
        const line = { type: "path", fill: "none", stroke: colour(s), strokeWidth: 2, background: true,
                       points: v.map((d) => [scales.x.encode(d.m), scales.y.encode(d.price)]) };
        if (!near) return [line];
        const px = scales.x.encode(at), py = scales.y.encode(near.price);
        return [line,
          { type: "circle", cx: px, cy: py, r: 4, fill: colour(s) },
          { type: "text", x: px + 6, y: py - 6, text: s + " " + near.price, fontSize: 11, textAnchor: "start", fill: colour(s) }];
      })];
    }),
  ],
  marks: [
    ruleX({
      stroke: "#888", strokeWidth: 2,
      channels: { x: { field: "month", edit: move() }, y1: { field: "lo" }, y2: { field: "hi" } },   //! drag writes \`month\`
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_multi_line_pivot_tooltip',
  status: 'partial',
  verdict: 'The five price lines and the pivoted rule per date, which shows on hover with every stock\'s price in its tooltip, reproduce; the points marking each line at the hovered date do not.',
  needs: ['selection'],
  prep: ['prep-calculate', 'prep-reshape'],
  gaps: [
    'The pivot is a `d3.rollup` into one row per date; a `ruleX` over it is invisible until `effects.hovered` lifts it to 0.3, and its `tip` lists the five prices. The long rows the lines draw are a `context` table beside it.',
    'The rules carry `select()` only so they are pointer-active (the hovered effect needs that); a click selects a date and writes nothing.',
    'No points on the lines at the hovered date: that is a hover-driven filter on another layer.',
  ],
  recreation: {
    code: `const parse = d3.timeParse("%b %d %Y");
const symbols = ["AAPL", "AMZN", "GOOG", "IBM", "MSFT"];
const rows = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }));
// The pivot: one row per date, one column per stock.
const wide = d3.rollups(rows, (v) => Object.fromEntries(v.map((d) => [d.symbol, d.price])), (d) => +d.date)
  .map(([t, prices]) => ({ date: new Date(t), ...prices }));
const date = { type: "temporal", domain: d3.extent(rows, (d) => d.date) };
const price = { type: "quantitative", domain: [0, 800] };
mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  schema: {
    data: { date, ...Object.fromEntries(symbols.map((s) => [s, price])) },
    prices: { context: true, fields: { symbol: { type: "categorical", domain: symbols }, date, price } },
  },
  data: { data: wide, prices: rows },
  legends: { stroke: { labelWidth: 40 } },   // room for the ticker symbols
  effects: { hovered: { opacity: 0.3, outline: false }, selected: false },
  marks: [
    lineY({ table: "prices", strokeWidth: 2,
      channels: { x: { field: "date" }, y: { field: "price" }, stroke: { field: "symbol" } } }),
    ruleX({ stroke: "black", strokeWidth: 3, opacity: 0, tip: symbols,

      channels: { x: { field: "date" } }, edits: [ select() ] }),
  ],
}))`,
  },

  interfaces: [
    {
      title: 'Draw the missing stock',
      question: 'Four stocks are shown. Draw how you think IBM\'s price moved from 2000 to 2010.',
      try: 'Press near the left edge and drag across the chart. Draw again to replace it.',
      why: '`edit.line.draw()` turns one drag into a line, one row per year in `samples`, so IBM is the only thing in `getData()`. `count({ max: 11 })` keeps the newest eleven rows, which makes a second drawing replace the first. The four real stocks are a `context` table: drawn, read-only, never elicited.',
      uses: ['edit.line.draw()', 'count()', 'context table'],
      code: `const parse = d3.timeParse("%b %d %Y");
const stocks = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }))
  .filter((d) => d.symbol !== "IBM" && d.date.getMonth() === 0)
  .map((d) => ({ symbol: d.symbol, year: d.date.getFullYear(), price: d.price }));
const year = { type: "quantitative", domain: [2000, 2010] };
const price = { type: "quantitative", domain: [0, 800] };
const isLast = (d, i, rows) => !rows[i + 1] || rows[i + 1].symbol !== d.symbol;
mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 44, bottom: 30, left: 54 },
  schema: {
    data: { year, price },
    stocks: { context: true, fields: { year, price,                   //! the four known stocks: context only
      symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "IBM", "MSFT"] } } },
  },
  data: { data: [], stocks },
  constraints: [ count({ max: 11 }) ],                              //! a new drawing replaces the old
  axes: { x: { tickFormat: "d" }, y: { title: "price" } },

  marks: [
    lineY({
      table: "stocks", strokeWidth: 2, opacity: 0.7,
      channels: { x: { field: "year" }, y: { field: "price" },
                  stroke: { field: "symbol", scale: { scheme: "tableau10" } } },
    }),
    text({
      table: "stocks", fontSize: 11, textAnchor: "start", dx: 5, dy: 4,
      channels: { x: { field: "year" }, y: { field: "price" },
                  text: { fn: (d, i, rows) => (isLast(d, i, rows) ? d.symbol : "") },
                  fill: { field: "symbol", scale: { scheme: "tableau10" } } },
    }),
    lineY({
      stroke: d3.schemeTableau10[3], strokeWidth: 3, handleSize: 3,

      channels: { x: { field: "year" }, y: { field: "price" } },
      edits: [ edit.line.draw({ along: "x", value: "y", samples: d3.range(2000, 2011) }) ],  //! one drag, eleven rows
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_multi_line_tooltip',
  status: 'full',
  verdict: 'The daily high and low temperature lines reproduce, two `line` marks over one table sharing a y axis, and so does the hover rule with its three-field tooltip: a transparent `ruleX` per day that `effects.hovered` turns black.',
  needs: [],
  prep: [],
  gaps: [
    'The rules carry `select()` only so they are pointer-active (the hovered effect needs that); a click selects a day and writes nothing.',
    'The tooltip is `tip: ["date", "hi", "lo"]` on the rules, so it names the columns `hi` and `lo` rather than `temp_max` and `temp_min`.',
  ],
  recreation: {
    code: `const days = (await vegaData("seattle-weather.csv"))
  .map((d) => ({ date: d.date, hi: d.temp_max, lo: d.temp_min }));
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: days,
  schema: {
    date: { type: "temporal", domain: d3.extent(days, (d) => d.date) },
    hi: { type: "quantitative", domain: [-10, 40] },
    lo: { type: "quantitative", domain: [-10, 40] },
  },
  effects: { hovered: { opacity: 1, outline: false }, selected: false },
  marks: [
    lineY({ stroke: "orange", strokeWidth: 1,
 channels: { x: { field: "date" }, y: { field: "hi" } } }),
    lineY({ stroke: "red", strokeWidth: 1, channels: { x: { field: "date" }, y: { field: "lo" } } }),
    ruleX({ stroke: "black", opacity: 0, tip: ["date", "hi", "lo"],
      channels: { x: { field: "date" } }, edits: [ select() ] }),
  ],
}))`,

  },
  interfaces: [
    {
      title: 'Set the daily range',
      question: 'On a typical day in each month, how cold does Seattle get at night and how warm by afternoon?',
      try: 'Drag the upper and lower edges of the band, month by month.',
      why: 'The two lines become the two edges of one `area`: `move()` on `y1` writes the low and on `y2` the high. `ordering` is a dataset rule, so whichever edge you drag, a low can never pass its high.',
      uses: ['move()', 'ordering()', 'areaY'],
      code: `const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: months.map((name, i) => ({ month: i + 1, lo: 8, hi: 16 })),
  schema: {
    month: { type: "quantitative", domain: [1, 12] },
    lo: { type: "quantitative", domain: [-10, 40] },
    hi: { type: "quantitative", domain: [-10, 40] },
  },
  constraints: [ ordering({ field: ["lo", "hi"] }) ],              //! a low never passes its high
  axes: { x: { tickValues: d3.range(1, 13), tickFormat: (m) => months[m - 1] }, y: { title: "°C" } },
  marks: [
    areaY({
      fill: "orange", fillOpacity: 0.25, stroke: "orange",
      channels: {
        x: { field: "month" },
        y1: { field: "lo", edit: move({ channels: ["y1"] }) },      //! the night-time low
        y2: { field: "hi", edit: move({ channels: ["y2"] }) },      //! the afternoon high
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-isotype_grid',
  status: 'partial',
  verdict: 'The 10 × 10 grid of people reproduces with the original\'s own SVG person path, drawn by `shape`; brushing a rectangle of them to turn them red does not. The interfaces make "colour some of the hundred" the answer.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    '`shape({ path })` draws Vega-Lite\'s custom path per row, fitted to a box of radius `size`, so the glyph matches; it replaces the earlier 웃 text stand-in.',
    'No interval brush: everyone is drawn red, the original\'s state before a brush (an empty interval selects all).',
  ],
  recreation: {
    code: `const person = "M1.7 -1.7h-0.8c0.3 -0.2 0.6 -0.5 0.6 -0.9c0 -0.6 -0.4 -1 -1 -1c-0.6 0 -1 0.4 -1 1c0 0.4 0.2 0.7 0.6 0.9h-0.8c-0.4 0 -0.7 0.3 -0.7 0.6v1.9c0 0.3 0.3 0.6 0.6 0.6h0.2c0 0 0 0.1 0 0.1v1.9c0 0.3 0.2 0.6 0.3 0.6h1.3c0.2 0 0.3 -0.3 0.3 -0.6v-1.8c0 0 0 -0.1 0 -0.1h0.2c0.3 0 0.6 -0.3 0.6 -0.6v-2c0.2 -0.3 -0.1 -0.6 -0.4 -0.6z";
const people = d3.range(1, 101).map((id) => ({ col: Math.ceil(id / 10), row: id - Math.ceil(id / 10) * 10 + 10 }));
mount(Elicit({
  width: 400, height: 400,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: people,
  schema: {
    col: { type: "ordinal", domain: d3.range(1, 11) },
    row: { type: "ordinal", domain: d3.range(1, 11) },
  },
  marks: [
    // Red, as the original renders before any brush: an empty interval selects everyone.
    shape({ path: person, size: 17, fill: "rgb(194,81,64)", stroke: "none",
      channels: { x: { field: "col" }, y: { field: "row" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Colour the people',
      question: 'Out of 100 adults in the US, how many do you think hold a valid passport?',
      try: 'Click a person to colour them; click again to undo. The count is above the grid.',
      why: 'Each person is a row drawn by `shape` with the original\'s path, and `cycle()` on `fill` flips their `has` column between the two declared values. The grid itself is the response scale, and `guides.custom` keeps the running count in view.',
      uses: ['shape', 'cycle()', 'guides.custom'],
      code: `const person = "M1.7 -1.7h-0.8c0.3 -0.2 0.6 -0.5 0.6 -0.9c0 -0.6 -0.4 -1 -1 -1c-0.6 0 -1 0.4 -1 1c0 0.4 0.2 0.7 0.6 0.9h-0.8c-0.4 0 -0.7 0.3 -0.7 0.6v1.9c0 0.3 0.3 0.6 0.6 0.6h0.2c0 0 0 0.1 0 0.1v1.9c0 0.3 0.2 0.6 0.3 0.6h1.3c0.2 0 0.3 -0.3 0.3 -0.6v-1.8c0 0 0 -0.1 0 -0.1h0.2c0.3 0 0.6 -0.3 0.6 -0.6v-2c0.2 -0.3 -0.1 -0.6 -0.4 -0.6z";
const people = d3.range(100).map((i) => ({ col: (i % 10) + 1, row: Math.floor(i / 10) + 1, has: "no" }));
mount(Elicit({
  width: 400, height: 420,
  margins: { top: 30, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: people,
  schema: {
    col: { type: "ordinal", domain: d3.range(1, 11) },
    row: { type: "ordinal", domain: d3.range(1, 11) },
    has: { type: "categorical", domain: ["no", "yes"] },
  },
  guides: [
    guides.custom(({ data, width }) => [{ type: "text", x: width / 2, y: -12, textAnchor: "middle", fontSize: 13,
      fill: "rgb(194,81,64)", text: data.filter((d) => d.has === "yes").length + " of 100" }]),
  ],
  marks: [
    shape({
      path: person, size: 17, stroke: "none",                      //! the original's person path
      channels: {
        x: { field: "col" }, y: { field: "row" },
        fill: { field: "has", scale: { range: ["rgb(167,165,156)", "rgb(194,81,64)"] },
                edit: cycle() },                                   //! a click flips this person
      },
    }),
  ],
}))`,
    },
    {
      title: 'Fill the waffle',
      question: 'Out of 100 adults in the US, how many do you think hold a valid passport?',
      try: 'Drag up or down over the dots, or click one, to set how many are filled.',
      why: 'The same question as one number: `waffle` turns `count` into filled cells, and `edit.waffle.fill()` writes the count from the cell under the pointer, by drag or by click. One row, one value — quicker than a hundred clicks, but you lose the "these people" framing.',
      uses: ['waffle', 'edit.waffle.fill()'],
      code: `mount(Elicit({
  width: 260, height: 260,
  margins: { top: 12, right: 12, bottom: 24, left: 34 },
  data: [{ who: "adults", n: 30 }],
  schema: {
    who: { type: "categorical", domain: ["adults"] },
    n: { type: "quantitative", domain: [0, 100] },
  },
  scales: { x: { type: "band" } },
  marks: [
    waffleY({
      fill: "rgb(194,81,64)", shape: "circle", unit: 1, multiple: 10,
      channels: {
        x: { field: "who" },
        count: { field: "n", edit: edit.waffle.fill() },           //! drag sets how many are filled
      },
      edits: [ edit.waffle.fill({ channels: ["count"], gesture: "click" }) ],
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-brush_table',
  status: 'none',
  verdict: 'The brushed scatter alone is drawable, but the example is a scatter and a linked table: the brush filters rows into three text columns beside the chart. Multiple views are not covered by this study, and a brush that filters another view is selection-driven encoding, not elicitation.',
  needs: ['concat', 'selection'],
  gaps: [
    'The scatter half matches `vl-interactive_brush`; the table half (text columns of the first 20 brushed cars) has no equivalent.',
  ],
  alternative: 'Ask for the region itself: `brushRect()` on a one-row `rect` writes a horsepower × mileage box, and a `guides.custom` can draw the cars inside it in colour and print how many fall inside — see the interface on `vl-interactive_brush`.',
});

GALLERY.add({
  id: 'vl-selection_heatmap',
  status: 'partial',
  verdict: 'The confusion-matrix heatmap reproduces, and a clicked cell gets the black stroke through `effects.selected`; fading the unselected cells to half opacity does not.',
  needs: ['selection'],
  prep: [],
  gaps: [
    '`yellowgreenblue` is not a named scheme, so nine stops of `d3.interpolateYlGnBu` are passed as a `range`; a continuous scale keeps every stop, so the ramp matches.',
    'Rows are listed C, B, A in the schema so that A sits at the top, as in the original.',
    'Unselected cells stay at full opacity.',
  ],
  recreation: {
    code: `const cells = [
  { actual: "A", predicted: "A", count: 13 }, { actual: "A", predicted: "B", count: 0 }, { actual: "A", predicted: "C", count: 0 },
  { actual: "B", predicted: "A", count: 0 },  { actual: "B", predicted: "B", count: 10 }, { actual: "B", predicted: "C", count: 6 },
  { actual: "C", predicted: "A", count: 0 },  { actual: "C", predicted: "B", count: 0 }, { actual: "C", predicted: "C", count: 9 },
];
mount(Elicit({
  width: 200, height: 180,
  margins: { top: 10, right: 10, bottom: 34, left: 52 },
  data: cells,
  schema: {
    actual: { type: "categorical", domain: ["C", "B", "A"] },
    predicted: { type: "categorical", domain: ["A", "B", "C"] },
    count: { type: "quantitative", domain: [0, 13] },
  },
  scales: { x: { type: "band", padding: 0 }, y: { type: "band", padding: 0 } },
  axes: { x: { title: "predicted" }, y: { title: "actual" } },
  effects: { selected: { stroke: "black", strokeWidth: 2, outline: false }, hovered: false },
  marks: [
    rect({
      channels: {
        x: { field: "predicted" }, y: { field: "actual" },
        fill: { field: "count", scale: { range: d3.quantize(d3.interpolateYlGnBu, 9) }, legend: true },
      },
      edits: [ select() ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Select, then set',
      question: 'A classifier sorts 18 items of each class. How many do you expect in each cell of its confusion matrix?',
      try: 'Click a cell, then drag the handle on the colour ramp to set its count.',
      why: 'The original\'s click selection becomes the target: `select()` picks a cell, and `edit.legend.value()` on the colour legend writes the value under its handle into the selected row. The counts are printed by a `text` mark over the same rows, so the colour you set is readable.',
      uses: ['select()', 'edit.legend.value()', 'legendColor', 'text'],
      code: `const classes = ["A", "B", "C"];
const cells = classes.flatMap((actual) => classes.map((predicted) => ({ actual, predicted, count: 6 })));
mount(Elicit({
  width: 300, height: 230,
  margins: { top: 10, right: 10, bottom: 34, left: 52 },
  data: cells,
  schema: {
    actual: { type: "categorical", domain: [...classes].reverse() },
    predicted: { type: "categorical", domain: classes },
    count: { type: "quantitative", domain: [0, 18] },
  },
  scales: { x: { type: "band", padding: 0 }, y: { type: "band", padding: 0 } },
  axes: { x: { title: "predicted" }, y: { title: "actual" } },
  effects: { selected: { stroke: "black", strokeWidth: 3, outline: false } },
  marks: [
    rect({
      channels: {
        x: { field: "predicted" }, y: { field: "actual" },
        fill: { field: "count", scale: { range: d3.quantize(d3.interpolateYlGnBu, 9) } },

      },
      edits: [ select() ],                                         //! click picks the cell to set
    }),
    text({ fontSize: 13, channels: { x: { field: "predicted" }, y: { field: "actual" },
      text: { fn: (d) => String(Math.round(d.count)) } } }),
    legendColor({ anchor: "right", title: "count", edit: edit.legend.value() }),   //! the ramp handle writes \`count\`
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-bar_count_minimap',
  status: 'none',
  verdict: 'A detail bar chart of car names whose rows are chosen by brushing a minimap beside it. Multiple views are not covered by this study, and the brush that scrolls one view from the other is selection-driven, not elicitation.',
  needs: ['concat', 'selection', 'zoom'],
  gaps: [
    'Either bar chart alone is an ordinary `barX`; the scrolling-by-brush behaviour is the example.',
  ],
  alternative: 'A brush can still be the answer: `brushSpan()` on a `rect` beside a long list of names writes the span of rows a reader picks (say, the models they think were sold in more than one year), with a `guides.custom` drawing the bars as context.',
});

GALLERY.add({
  id: 'vl-interactive_index_chart',
  status: 'partial',
  verdict: 'The index chart at its initial index date (January 2005) reproduces with the rebasing done in d3; moving the index by hovering does not — the interface makes the index date a dragged answer and rebases the lines around it.',
  needs: ['selection'],
  prep: ['prep-calculate', 'prep-lookup'],
  gaps: [
    'Each stock is divided by its January 2005 price before `Elicit`, so the index is fixed.',
    'The firebrick index rule and its date label are a `guides.rule` with a `label`.',
  ],
  recreation: {
    code: `const parse = d3.timeParse("%b %d %Y");
const rows = (await vegaData("stocks.csv"))
  .map((d) => ({ symbol: d.symbol, date: parse(d.date), price: d.price }));
const index = new Date(2005, 0, 1);
const base = Object.fromEntries(rows.filter((d) => +d.date === +index).map((d) => [d.symbol, d.price]));
const indexed = rows.map((d) => ({ symbol: d.symbol, date: d.date, change: d.price / base[d.symbol] - 1 }));
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 12, right: 12, bottom: 24, left: 46 },
  data: indexed,
  schema: {
    symbol: { type: "categorical", domain: ["AAPL", "AMZN", "GOOG", "IBM", "MSFT"] },
    date: { type: "temporal", domain: d3.extent(rows, (d) => d.date) },
    change: { type: "quantitative", domain: d3.extent(indexed, (d) => d.change) },
  },
  axes: { x: { tickFormat: d3.timeFormat("%Y") }, y: { tickFormat: ".0%" } },
  legends: { stroke: { labelWidth: 40 } },   // room for the ticker symbols
  guides: [ guides.rule({ x: index, stroke: "firebrick", strokeWidth: 0.5, label: "Jan 2005" }) ],
  marks: [
    lineY({ strokeWidth: 2,
      channels: { x: { field: "date" }, y: { field: "change" }, stroke: { field: "symbol" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Drag the index date',
      question: 'If you could have bought all five stocks in one month between 2000 and 2007, which month would you pick?',
      try: 'Drag the red rule; every line is rebased to the month it sits on.',
      why: 'The rule is the answer: `move()` on `x` writes `month`, and `snap` keeps it on a whole month. The lines are a `guides.custom` that rebases each stock to its price in that month — the original\'s hover-to-index, but the month you leave is recorded. The y axis is a log ratio so every rebasing stays on screen.',
      uses: ['move()', 'snap()', 'ruleX', 'guides.custom'],
      code: `const parse = d3.timeParse("%b %d %Y");
// x is months since January 2000.
const rows = (await vegaData("stocks.csv"))
  .map((d) => { const t = parse(d.date);
    return { symbol: d.symbol, m: (t.getFullYear() - 2000) * 12 + t.getMonth(), price: d.price }; });
const colour = d3.scaleOrdinal(["AAPL", "AMZN", "GOOG", "IBM", "MSFT"], d3.schemeTableau10);
const bySymbol = d3.groups(rows, (d) => d.symbol);
mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 44, bottom: 24, left: 46 },
  data: [{ month: 60, lo: 0.05, hi: 60 }],
  schema: {
    month: { type: "quantitative", domain: [0, 122] },
    lo: { type: "quantitative", domain: [0.05, 60] },
    hi: { type: "quantitative", domain: [0.05, 60] },
  },
  scales: { y: { type: "log" } },        // a ratio: 2× and ½× sit the same distance from 1×
  constraints: [
    snap({ field: "month", step: 1 }),
    clamp({ field: "month", min: 0, max: 95 }),                       //! a month from 2000 to 2007
  ],
  axes: { x: { tickValues: d3.range(0, 123, 24), tickFormat: (m) => String(2000 + m / 12) },
          y: { tickValues: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50], tickFormat: (v) => v + "×" } },
  guides: [
    guides.custom(({ scales, data }) => {                             //! every line rebased to your month
      const at = data[0].month;
      const y = (v) => scales.y.encode(Math.max(0.05, Math.min(60, v)));
      return bySymbol.flatMap(([s, v]) => {
        const base = v.find((d) => d.m === at);
        if (!base) return [];
        const last = v.at(-1);
        return [
          { type: "path", fill: "none", stroke: colour(s), strokeWidth: 2, background: true,
            points: v.map((d) => [scales.x.encode(d.m), y(d.price / base.price)]) },
          { type: "text", x: scales.x.encode(last.m) + 4, y: y(last.price / base.price) + 4,
            text: s, fontSize: 10, textAnchor: "start", fill: colour(s) },
        ];
      }).concat([{ type: "text", x: scales.x.encode(at), y: -4, textAnchor: "middle", fontSize: 11,
        fill: "firebrick", text: d3.timeFormat("%b %Y")(new Date(2000, at, 1)) }]);
    }),
  ],
  marks: [
    ruleX({
      stroke: "firebrick", strokeWidth: 2,
      channels: { x: { field: "month", edit: move() }, y1: { field: "lo" }, y2: { field: "hi" } },  //! drag writes \`month\`
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_bin_extent',
  status: 'none',
  verdict: 'Two stacked histograms where brushing the first re-bins the second over the brushed extent. Either histogram alone is a `rect` over d3 bins; the example is the link between two views, and multiple views are not covered by this study.',
  needs: ['concat', 'selection', 'zoom'],
  gaps: [
    'The top histogram matches the recreations elsewhere in this family; the second view and the param-driven `bin.extent` have no equivalent.',
  ],
  alternative: 'Ask for the extent itself: `brushSpan()` on a `rect` with only `x1`/`x2` over a flight-time histogram (drawn as a `guides.custom`) writes the hours a reader thinks the evening rush covers, the way the `vl-interactive_area_brush` interface does for a recession.',
});

GALLERY.add({
  id: 'vl-dynamic_color_legend',
  status: 'none',
  verdict: 'The Seattle-weather dashboard (a brushable scatter over a bar chart that filters it) with five bound colour pickers that rewrite the weather palette. Multiple views are not covered by this study, and colour inputs bound to a scale range are missing.',
  needs: ['concat', 'selection', 'input-widgets'],
  gaps: [
    'The scatter alone (date × max temperature, sized by precipitation, coloured by weather) is drawable with `point`; the colour pickers and the cross-filtering are the example.',
  ],
  alternative: 'Recolouring is a legend act ElicitJS can turn into data: a `legendColor` with `edit.legend.category()` beside a selectable scatter of days lets a reader re-label the weather of the days they select, and `edit.scale.categories()` lets them rename or add the categories themselves.',
});

GALLERY.add({
  id: 'vl-param_search_input',
  status: 'partial',
  verdict: 'The scatter reproduces; the bound search box that dims every car whose name does not match does not. The interface recovers it by making the search text an elicited answer that a guide filters on.',
  needs: ['input-widgets'],
  prep: ['prep-calculate'],
  gaps: [
    'Every car is drawn at 0.8 opacity (the empty-search state).',
    'The name tooltip is `tip: ["name"]` on the points.',
    'No search input.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ name: d.Name, hp: d.Horsepower, mpg: d.Miles_per_Gallon }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    name: { type: "categorical" },
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({ fill: "none", stroke: "#4c78a8", strokeWidth: 1.5, size: 3, opacity: 0.8, tip: ["name"],
      channels: { x: { field: "hp" }, y: { field: "mpg" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Type a make',
      question: 'Which car maker do you think got the best mileage for its horsepower in this era?',
      try: 'Double-click the note, type a make (try "honda" or "ford"), press Enter.',
      why: 'The search box becomes the answer: `editText()` on a `sticker` writes what you type into `make`. A `guides.custom` reads it and rings every car whose name matches — the original\'s regex filter, so you can check your guess against the cloud. The cars themselves are a faint `context` table whose `tip` names any car you hover.',
      uses: ['editText()', 'sticker', 'guides.custom', 'context table', 'tip'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, name: d.Name }));
const hp = { type: "quantitative", domain: [0, 240] };
const mpg = { type: "quantitative", domain: [0, 50] };
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  schema: {
    data: { hp, mpg, make: { type: "categorical", open: true } },
    cars: { context: true, fields: { hp, mpg, name: { type: "categorical" } } },
  },
  // One row: the answer, pinned near the top right of the plot.
  data: { data: [{ hp: 200, mpg: 44, make: "" }], cars },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  guides: [
    guides.custom(({ scales, data }) => {                       //! highlights every car your text matches
      const q = (data[0].make || "").trim().toLowerCase();
      const hint = { type: "text", x: scales.x.encode(200), y: scales.y.encode(44) - 26, textAnchor: "middle",
                     fontSize: 10, fill: "#64748b", text: "your answer (double-click)" };
      return [hint, ...cars.filter((d) => !q || d.name.toLowerCase().includes(q)).map((d) => ({
        type: "circle", cx: scales.x.encode(d.hp), cy: scales.y.encode(d.mpg), r: 3,
        fill: "none", stroke: "#4c78a8", strokeWidth: 1.5, opacity: 0.85, background: true,
      }))];
    }),
  ],
  marks: [
    point({ table: "cars", fill: "none", stroke: "#4c78a8", strokeWidth: 1.5, size: 3, opacity: 0.1,
      tip: ["name"],                                              //! hover a car for its name
      channels: { x: { field: "hp" }, y: { field: "mpg" } } }),

    sticker({
      fill: "#fff", stroke: "#94a3b8", minWidth: 110, radius: 4,
      channels: { x: { field: "hp" }, y: { field: "mpg" }, text: { field: "make" } },
      edits: [ editText() ],                                      //! double-click to type the make
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-selection_type_point_zorder',
  status: 'partial',
  verdict: 'The grey scatter reproduces, and a hovered car turns coral through `effects.hovered`; growing it to 400 px² and raising it above its neighbours does not, since an effect restyles a node but cannot resize or reorder it.',
  needs: ['selection'],
  prep: ['prep-calculate'],
  gaps: [
    'Hover colours the car coral and rings it; the ring is drawn on top, which partly stands in for the z-order change.',
    'No size change on hover.',
  ],
  recreation: {
    code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp: { type: "quantitative", domain: [0, 240] },
    mpg: { type: "quantitative", domain: [0, 50] },
  },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  effects: { hovered: { fill: "coral", outline: { color: "coral", width: 2, pad: 4, opacity: 1 } }, selected: false },
  marks: [
    point({
      fill: "grey", size: 5.5,
      channels: { x: { field: "hp" }, y: { field: "mpg" } },
      edits: [ select() ],
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Hover, then commit',
      question: 'Where would a typical 2024 full-size pickup truck sit among these cars?',
      try: 'Move over the chart to preview a spot, click to commit it.',
      why: 'The hover IS the gesture: `create({ pick: "probe" })` draws a tentative dot under the pointer — the original\'s coral highlight, but for a value you have not given yet — and a click commits it. `count({ max: 1 })` keeps only the newest, so probing again changes your answer.',
      uses: ['create({ pick: "probe" })', 'count()', 'context table'],
      code: `const cars = (await vegaData("cars.json"))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));
const fields = {
  hp: { type: "quantitative", domain: [0, 450] },
  mpg: { type: "quantitative", domain: [0, 50] },
};
mount(Elicit({
  width: 430, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 50 },
  schema: { data: fields, cars: { context: true, fields } },          //! the 1970s cars are context
  data: { data: [], cars },
  axes: { x: { title: "Horsepower" }, y: { title: "mpg" } },
  marks: [
    point({ table: "cars", fill: "grey", opacity: 0.5, size: 3.5,
      channels: { x: { field: "hp" }, y: { field: "mpg" } } }),

    point({
      fill: "coral", stroke: "white", strokeWidth: 1.5, size: 8,
      channels: { x: { field: "hp" }, y: { field: "mpg" } },
      edits: [ create({ pick: "probe", advance: false }) ],     //! hover previews, click commits
    }),
  ],
  constraints: [ count({ max: 1 }) ],                          //! a new click replaces the old answer
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-airport_connections',
  status: 'partial',
  verdict: 'The map of states with every airport sized by its route count reproduces on an Albers USA projection; hovering an airport to draw its routes does not. The interface turns "show me the routes" into "which routes exist?".',
  needs: ['selection'],
  prep: ['prep-aggregate', 'prep-lookup', 'prep-geo'],
  gaps: [
    'Route counts and the airport lookup are joined in d3 first; the states come from TopoJSON through `topojson.feature`.',
    'No hover, so no route lines (the original\'s resting state has none either).',
  ],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const flights = await vegaData("flights-airport.csv");
const where = new Map((await vegaData("airports.csv")).map((d) => [d.iata, d]));
const airports = d3.rollups(flights, (v) => v.length, (d) => d.origin)
  .map(([iata, routes]) => ({ iata, routes, a: where.get(iata) }))
  .filter((d) => d.a && d.a.state !== "PR" && d.a.state !== "VI")
  .map((d) => ({ iata: d.iata, routes: d.routes, lon: d.a.longitude, lat: d.a.latitude }))
  .sort((a, b) => b.routes - a.routes);
mount(Elicit({
  width: 480, height: 290,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: airports,
  schema: {
    iata: { type: "categorical" },
    routes: { type: "quantitative", domain: [0, 175] },
    lon: { type: "quantitative", domain: d3.extent(airports, (d) => d.lon) },
    lat: { type: "quantitative", domain: d3.extent(airports, (d) => d.lat) },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "#ddd", stroke: "#fff", strokeWidth: 1 }),
    geoPoint({
      fill: "#4c78a8", fillOpacity: 0.7,
      channels: { lon: { field: "lon" }, lat: { field: "lat" },
                  size: { field: "routes", scale: { type: "sqrt", range: [0, 9] } } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Flag the routes',
      question: 'Boise (the black star) had direct flights to 19 airports in 2008. Which of these 40 hubs do you think were among them?',
      try: 'Click near an airport to flag it; click again to unflag. A route line follows each flag.',
      why: '`cycle()` on `fill` flips an airport\'s `route` column, and `pick: "nearest"` lets a click land on the closest dot on a crowded map. The route lines are a `guides.custom` that reads the flags and projects through `scales.projection` — the original\'s hover routes, drawn for the airports you chose.',
      uses: ['cycle()', 'pick: "nearest"', 'guides.custom'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const flights = await vegaData("flights-airport.csv");
const where = new Map((await vegaData("airports.csv")).map((d) => [d.iata, d]));
const hubs = d3.rollups(flights, (v) => v.length, (d) => d.origin)
  .sort((a, b) => b[1] - a[1]).slice(0, 40)
  .map(([iata, routes]) => ({ iata, routes, lon: where.get(iata).longitude, lat: where.get(iata).latitude, route: "no" }));
const boise = where.get("BOI");
mount(Elicit({
  width: 480, height: 290,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: hubs,
  schema: {
    iata: { type: "categorical" },
    routes: { type: "quantitative", domain: [0, 175] },
    lon: { type: "quantitative", domain: d3.extent(hubs, (d) => d.lon) },
    lat: { type: "quantitative", domain: d3.extent(hubs, (d) => d.lat) },
    route: { type: "categorical", domain: ["no", "yes"] },
  },
  guides: [
    guides.custom(({ scales, data }) => {                        //! a route line to every airport you flag
      const from = scales.projection.apply([boise.longitude, boise.latitude]);
      return data.filter((d) => d.route === "yes").map((d) => {
        const to = scales.projection.apply([d.lon, d.lat]);
        return { type: "line", x1: from[0], y1: from[1], x2: to[0], y2: to[1], stroke: "#000", opacity: 0.35 };
      }).concat([{ type: "text", x: from[0], y: from[1] + 5, text: "★", fontSize: 16, textAnchor: "middle", fill: "#000" }]);
    }),
  ],
  marks: [
    geoBasemap({ geojson: states, fill: "#ddd", stroke: "#fff", strokeWidth: 1 }),
    geoPoint({
      stroke: "#fff", strokeWidth: 0.5,
      channels: {
        lon: { field: "lon" }, lat: { field: "lat" },
        size: { field: "routes", scale: { type: "sqrt", range: [0, 10] } },
        fill: { field: "route", scale: { range: ["#9db4cf", "#e45756"] },
                edit: cycle({ pick: "nearest", threshold: 20 }) },   //! a click flips the nearest airport
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_global_development',
  status: 'partial',
  verdict: 'The 1955 frame of the gapminder scatter, with its faint year watermark and a country label on hover, reproduces; the year slider and the hover / click trails do not.',
  needs: ['input-widgets', 'selection'],
  prep: ['prep-lookup', 'prep-calculate'],
  gaps: [
    'One year only (the slider\'s starting value, 1955); the region names are joined in d3.',
    'The hovered country\'s name is a `tip` rather than a text label beside the point.',
    'No hover or click trail through a country\'s years.',
  ],
  recreation: {
    code: `const regions = ["South Asia", "Europe & Central Asia", "Sub-Saharan Africa", "America",
                 "East Asia & Pacific", "Middle East & North Africa"];
const rows = (await vegaData("gapminder.json"))
  .filter((d) => d.year === 1955)
  .map((d) => ({ country: d.country, fertility: d.fertility, life: d.life_expect, region: regions[d.cluster] }));
mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 56 },
  data: rows,
  schema: {
    country: { type: "categorical" },
    fertility: { type: "quantitative", domain: [0, 9] },
    life: { type: "quantitative", domain: [20, 85] },
    region: { type: "categorical", domain: regions },
  },
  axes: { x: { title: "Fertility", ticks: 5 }, y: { title: "Life Expectancy", ticks: 5 } },
  legends: { fill: { fontSize: 10, swatchSize: 10 } },
  guides: [
    guides.custom(({ width, height }) => [{ type: "text", x: width / 2, y: height / 2 + 30, text: "1955",
      fontSize: 100, textAnchor: "middle", fill: "#000", opacity: 0.06, background: true }]),
  ],
  marks: [
    point({ size: 5.6, opacity: 0.9, tip: ["country"],

      channels: { x: { field: "fertility" }, y: { field: "life" }, fill: { field: "region" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Move them to 2030',
      question: 'Each country is shown where it stood in 2005. Where do you think it will be in 2030?',
      try: 'Drag the labelled dot of each country; its trail follows from 2005.',
      why: 'The original\'s trail through a country\'s years becomes the answer\'s shape: each country is a `path` series from its 2005 row to its 2030 row. `lock` fixes the 2005 rows, so only the 2030 dots move, and `move()` on both axes writes your forecast.',
      uses: ['move()', 'lock', 'path'],
      code: `const regions = ["South Asia", "Europe & Central Asia", "Sub-Saharan Africa", "America",
                 "East Asia & Pacific", "Middle East & North Africa"];
const pick = ["China", "India", "Nigeria", "Brazil", "Egypt", "Japan", "Afghanistan", "Mexico"];
const y2005 = (await vegaData("gapminder.json"))
  .filter((d) => d.year === 2005 && pick.includes(d.country))
  .map((d) => ({ country: d.country, year: 2005, fertility: d.fertility, life: d.life_expect, region: regions[d.cluster] }));
mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 56 },
  data: [...y2005, ...y2005.map((d) => ({ ...d, year: 2030 }))],   // 2030 starts where 2005 was
  lock: (d) => d.year === 2005,                                    //! 2005 is the record
  schema: {
    country: { type: "categorical", domain: pick },
    year: { type: "quantitative", domain: [2005, 2030] },
    fertility: { type: "quantitative", domain: [0, 9] },
    life: { type: "quantitative", domain: [20, 90] },
    region: { type: "categorical", domain: regions },
  },
  axes: { x: { title: "Fertility", ticks: 5 }, y: { title: "Life Expectancy", ticks: 5 } },
  marks: [
    path({
      strokeWidth: 4, opacity: 0.35,
      channels: { series: { field: "country" }, x: { field: "fertility" }, y: { field: "life" },
                  stroke: { field: "region" } },
    }),
    point({
      size: 6, stroke: "#fff", strokeWidth: 1,
      channels: {
        x: { field: "fertility" }, y: { field: "life" },
        fill: { field: "region", legend: { fontSize: 10, swatchSize: 10 } },
        opacity: { fn: (d) => (d.year === 2030 ? 1 : 0.35) },
      },
      edits: [ move({ channels: ["x", "y"] }) ],                    //! drag a 2030 dot to your forecast
    }),
    text({
      fontSize: 11, dy: -11,
      channels: { x: { field: "fertility" }, y: { field: "life" },
                  text: { fn: (d) => (d.year === 2030 ? d.country : "") } },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_overview_detail',
  status: 'none',
  verdict: 'An S&P 500 area chart whose x domain is set by brushing a small overview area below it. Either area alone is an ordinary `areaY`, and the detail view alone can zoom with `edit.axis.zoom()`; the overview linked to it is a second view, and multiple views are not covered by this study.',
  needs: ['concat', 'zoom', 'selection'],
  gaps: [
    'The detail view could zoom with `edit.axis.zoom()` on its own x axis (the wheel), but nothing links it to a brushed overview, and dragging to pan is out of scope.',
  ],
  alternative: 'The brushed window can be the answer: `brushSpan()` on a `rect` over the S&P 500 area (drawn by `guides.custom`) writes the stretch a reader would call a bear market, as the `vl-interactive_area_brush` interface does for unemployment.',
});

GALLERY.add({
  id: 'vl-interactive_crossfilter',
  status: 'none',
  verdict: 'Three repeated histograms (distance, delay, hour) where brushing any one filters the other two. Each histogram alone is a `rect` over d3 bins; repeated, cross-filtered views are not covered by this study.',
  needs: ['concat', 'selection'],
  gaps: [
    'No `repeat`, no linked brushes.',
  ],
  alternative: 'Ask for one conditional distribution at a time: a `barY` histogram of delay with `move()` on each bin and `maintainSum({ total: 100 })`, under the question "for flights longer than 1,500 miles, how are delays distributed?" — the filter becomes part of the question rather than a brush.',
});

GALLERY.add({
  id: 'vl-interactive_layered_crossfilter',
  status: 'none',
  verdict: 'The crossfilter again, but each histogram keeps the full distribution in grey behind the brushed subset. As with `vl-interactive_crossfilter`, repeated, cross-filtered views are not covered by this study.',
  needs: ['concat', 'selection'],
  gaps: [
    'The grey-behind-blue layering itself is easy (two `rect` marks over the same bins); the link between views is not.',
  ],
  alternative: 'The layering suits a prior-versus-belief question: draw the full distance histogram as a grey `guides.custom` and let the reader drag a blue `barY` per bin (`move()`, `maintainSum`) for "flights delayed more than an hour" — their subset sits in front of the whole, as in the original.',
});

GALLERY.add({
  id: 'vl-interactive_concat_layer',
  status: 'none',
  verdict: 'A binned IMDB × Rotten Tomatoes heatmap above a genre bar chart; clicking a genre overlays that genre\'s counts as sized dots on the heatmap. Each view alone is drawable; multiple views, with a click in one filtering the other, are not covered by this study.',
  needs: ['concat', 'selection'],
  gaps: [
    'The heatmap is a `rect` grid with a quantitative `fill`, and the bar chart a `barY`; the cross-highlight is the example.',
  ],
  alternative: 'Make the genre the condition of the question: over the binned heatmap (as context), ask "where do you think most horror films fall?" and let the reader `toggle()` cells of a `rect` grid, building the set of rating cells they expect the genre to occupy.',
});

GALLERY.add({
  id: 'vl-interactive_seattle_weather',
  status: 'none',
  verdict: 'The Seattle weather dashboard: a date × temperature scatter whose brush filters a weather-type bar chart below, and whose bars, clicked, filter the scatter back. The scatter alone is a `point` mark; multiple, mutually filtering views are not covered by this study.',

  needs: ['concat', 'selection'],
  gaps: [
    'The scatter (sized by precipitation, coloured by weather) and the count bars are each drawable; the two-way filtering is not.',
  ],
  alternative: 'Elicit the bar chart under a stated condition: "for days in July and August, how many of each weather type?" as a `barX` with `move()` on each count, or the brush itself as the answer — `brushSpan()` over the date axis for "the stretch of the year you would call the rainy season".',
});
