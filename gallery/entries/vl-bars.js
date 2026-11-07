// Gallery entries — Vega-Lite "Bar Charts". See AUTHORING.md.

GALLERY.defineFeatures({
  'band-offset': { label: 'Nested band offset', description: 'A second band scale nested inside each category band (`xOffset`/`yOffset`), for grouped or dodged bars without hand-computed positions.' },
});

// ------------------------------------------------------------------ vl-bar
GALLERY.add({
  id: 'vl-bar',
  status: 'full',
  verdict: 'A plain `barY` over the nine embedded rows reproduces it exactly.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: { code: `const data = [
  { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: 19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 12, right: 12, bottom: 40, left: 48 },
  data,
  schema: {
    a: { type: "categorical", domain: data.map((d) => d.a) },
    b: { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: { title: "a" }, y: { title: "b" } },
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "a" }, y: { field: "b" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Drag in steps',
      question: 'Treat `b` as a 0–100 score for nine items A–I. What score do you expect each to get next round?',
      try: 'Drag a bar up or down; it settles on the nearest multiple of 5.',
      why: '`move()` on `y` inverts the pointer through the value scale, and the dataset-level `snap` rounds every proposal to a step of 5, so the answers come back as clean survey values.',
      uses: ['move()', 'snap()', 'clamp()'],
      code: `const items = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 12, right: 12, bottom: 28, left: 48 },
  data: items.map((a) => ({ a, b: 50 })),
  schema: {
    a: { type: "categorical", domain: items },
    b: { type: "quantitative", domain: [0, 100] },
  },
  axes: { y: { title: "score next round" } },
  constraints: [
    snap({ field: "b", step: 5 }), //! every value lands on a multiple of 5
    clamp({ field: "b", min: 0, max: 100 }),
  ],
  marks: [
    barY({
      fill: "#4c78a8",
      channels: {
        x: { field: "a" },
        y: { field: "b", edit: move() }, //! drag writes \`b\`
      },
    }),
  ],
}))`,
    },
    {
      title: 'Add the missing bars',
      question: 'A–E are observed. Which of F–I do you think scored at all, and how high?',
      try: 'Click in an empty column to add a bar there, then drag it. The grey bars are fixed.',
      why: '`lock: "seed"` freezes the rows you were given, so only bars you add can move. `create()` mints a row at the clicked column and height, and `unique` allows one bar per letter.',
      uses: ['lock', 'create()', 'move()', 'unique()'],
      code: `const items = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 12, right: 12, bottom: 28, left: 36 },
  data: [
    { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 },
    { a: "D", b: 91 }, { a: "E", b: 81 },
  ],
  lock: "seed", //! the observed rows are given, not elicited
  schema: {
    a: { type: "categorical", domain: items },
    b: { type: "quantitative", domain: [0, 100] },
  },
  constraints: [ unique({ field: "a", max: 1 }) ], //! one bar per letter
  marks: [
    barY({
      channels: {
        x: { field: "a" },
        y: { field: "b", edit: move() },
        fill: { fn: (d) => (d.a < "F" ? "#9ca3af" : "#4c78a8") },
      },
      edits: [ create() ], //! click an empty column to add a bar
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_size_responsive
GALLERY.add({
  id: 'vl-bar_size_responsive',
  status: 'full',
  verdict: 'Counts per origin drawn with `barY`; `responsive: "reflow"` is the counterpart of `width: "container"`.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['The count is computed in JS rather than by an `aggregate` in the spec.'],
  recreation: { code: `const cars = await vegaData("cars.json");
const origins = ["Europe", "Japan", "USA"];
const data = origins.map((Origin) => ({
  Origin, n: cars.filter((d) => d.Origin === Origin).length,
}));
mount(Elicit({
  width: 400, height: 250,
  responsive: "reflow",
  margins: { top: 12, right: 12, bottom: 42, left: 54 },
  data,
  schema: {
    Origin: { type: "categorical", domain: origins },
    n: { type: "quantitative", domain: [0, 260] },
  },
  axes: { x: { title: "Origin" }, y: { title: "Number of Cars" } },
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "Origin" }, y: { field: "n" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Add an origin',
      question: 'If this car dataset were collected today, which origins would it list, and how many models from each?',
      try: 'Double-click ＋ on the x-axis and type a new origin, then click in its empty column to give it a bar. Double-click a label to rename it, click × to drop it; drag bars to set counts.',
      why: '`edit.scale.categories()` on the axis edits the `Origin` domain on the schema (renaming relabels rows, removing deletes them). A new category starts empty, so `create()` mints its bar where you click, and `unique` allows one per origin. The chart reflows to its container.',
      uses: ['edit.scale.categories()', 'create()', 'move()', 'responsive'],
      code: `const origins = ["Europe", "Japan", "USA"];
mount(Elicit({
  width: 400, height: 250,
  responsive: "reflow",
  margins: { top: 12, right: 12, bottom: 44, left: 54 },
  data: [
    { Origin: "Europe", n: 73 }, { Origin: "Japan", n: 79 }, { Origin: "USA", n: 254 },
  ],
  schema: {
    Origin: { type: "categorical", domain: origins },
    n: { type: "quantitative", domain: [0, 300] },
  },
  constraints: [ clamp({ field: "n", min: 0 }), unique({ field: "Origin", max: 1 }) ],
  axes: false,
  marks: [
    axisY({ title: "Number of models" }),
    axisX({ edit: edit.scale.categories() }), //! add / rename / remove origins
    barY({
      fill: "#4c78a8",
      channels: { x: { field: "Origin" }, y: { field: "n", edit: move() } },
      edits: [ create() ], //! click an empty column to give a new origin its bar
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_aggregate
GALLERY.add({
  id: 'vl-bar_aggregate',
  status: 'full',
  verdict: 'US population by age in 2000, summed over sex in JS and drawn with `barX`.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: ['The year filter and the sum are done in JS; tick labels use SI units instead of comma-grouped numbers.'],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = ages.map((age) => ({
  age, people: d3.sum(pop.filter((d) => d.age === age), (d) => d.people),
}));
mount(Elicit({
  width: 400, height: 19 * 17 + 40,
  margins: { top: 8, right: 16, bottom: 36, left: 50 },
  data,
  schema: {
    age: { type: "ordinal", domain: [...ages].reverse() },
    people: { type: "quantitative", domain: [0, 24e6] },
  },
  axes: { x: { title: "population", tickFormat: "~s" }, y: { title: "age" } },
  marks: [
    barX({ fill: "#4c78a8", channels: { y: { field: "age" }, x: { field: "people" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Predict 2050',
      question: 'How many Americans (in millions) will be in each age group in 2050?',
      try: 'Drag a bar left or right. The black ticks mark the 2000 census and do not move.',
      why: 'Two marks view each row: a `tickX` on the 2000 column with no edit, and a `barX` whose `x` carries `move()`. Both columns sit on one x axis because the schema unions their domains.',
      uses: ['move()', 'tickX', 'clamp()'],
      code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = ages.map((age) => {
  const m = d3.sum(pop.filter((d) => d.age === age), (d) => d.people) / 1e6;
  return { age, y2000: +m.toFixed(1), y2050: +m.toFixed(1) };
});
mount(Elicit({
  width: 400, height: 19 * 15 + 40,
  margins: { top: 8, right: 16, bottom: 36, left: 50 },
  data,
  schema: {
    age: { type: "ordinal", domain: [...ages].reverse() },
    y2000: { type: "quantitative", domain: [0, 30] },
    y2050: { type: "quantitative", domain: [0, 30] },
  },
  constraints: [ clamp({ field: "y2050", min: 0, max: 30 }) ],
  axes: { x: { title: "millions of people" }, y: { title: "age" } },
  marks: [
    barX({
      fill: "#4c78a8",
      channels: { y: { field: "age" }, x: { field: "y2050", edit: move() } }, //! your 2050 guess
    }),
    tickX({ stroke: "#111", strokeWidth: 2,
      channels: { y: { field: "age" }, x: { field: "y2000" } } }), //! the 2000 census, inert
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_aggregate_sort_by_encoding
GALLERY.add({
  id: 'vl-bar_aggregate_sort_by_encoding',
  status: 'full',
  verdict: 'The same population bars, with the age domain sorted by the summed value before it is declared.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate', 'prep-window'],
  gaps: ['`sort: "-x"` is a domain order computed in JS; it does not re-sort if the data changes (the first interface shows how to make it).'],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const data = d3.rollups(pop, (v) => d3.sum(v, (d) => d.people), (d) => d.age)
  .map(([age, people]) => ({ age, people }))
  .sort((a, b) => b.people - a.people);
mount(Elicit({
  width: 400, height: 19 * 17 + 40,
  margins: { top: 8, right: 16, bottom: 36, left: 50 },
  data,
  schema: {
    age: { type: "ordinal", domain: data.map((d) => d.age).reverse() },
    people: { type: "quantitative", domain: [0, 24e6] },
  },
  axes: { x: { title: "population", tickFormat: "~s" }, y: { title: "age" } },
  marks: [
    barX({ fill: "#4c78a8", channels: { y: { field: "age" }, x: { field: "people" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Bars that re-sort',
      question: 'How many Americans (millions) will be in each 15-year age band in 2050?',
      try: 'Drag a bar longer or shorter; once it passes a neighbour, the chart re-sorts.',
      why: 'A `constraints.custom` rule recomputes each row\'s `pos` from `people` after every edit, and `y` encodes `pos`, so `sort: "-x"` becomes a live invariant rather than a one-off domain order.',
      uses: ['move()', 'constraints.custom()', 'text'],
      code: `const bands = ["0–14", "15–29", "30–44", "45–59", "60–74", "75+"];
const seed = [62, 61, 60, 58, 50, 30];  // already in rank order
// Keep \`pos\` equal to each row's rank by value: the sort is a data invariant.
const sortByValue = constraints.custom(({ data }) => { //! re-rank on every edit
  const order = [...data].sort((a, b) => b.people - a.people);
  return data.map((d) => ({ ...d, pos: order.indexOf(d) + 1 }));
});
mount(Elicit({
  width: 400, height: 240,
  margins: { top: 8, right: 16, bottom: 32, left: 50 },
  data: bands.map((band, i) => ({ band, people: seed[i], pos: i + 1 })),
  schema: {
    band: { type: "categorical", domain: bands },
    people: { type: "quantitative", domain: [0, 100] },
    pos: { type: "ordinal", domain: [6, 5, 4, 3, 2, 1] },
  },
  constraints: [ clamp({ field: "people", min: 0, max: 100 }), sortByValue ],
  axes: { x: { title: "millions of people" }, y: false },
  marks: [
    barX({
      fill: "#4c78a8",
      channels: {
        y: { field: "pos" }, //! position follows the rank, not the name
        x: { field: "people", edit: move() },
      },
    }),
    text({ fontSize: 11, textAnchor: "end", dx: -6,
      channels: { y: { field: "pos" }, x: { value: 0 }, text: { field: "band" } } }),
  ],
}))`,
    },
    {
      title: 'Rank by dragging',
      question: 'Which age bands made up the largest share of the US population in 1950? Order the six, largest at the top.',
      try: 'Drag a bar up or down; it slides into that slot and the bars between shift along. Each bar\'s length is its band\'s 2000 census count, for comparison.',
      why: '`rank()` on the bar\'s band axis inverts the pointer to a slot and inserts the row there, shifting the rows between, so `rank` stays a permutation of 1–6. The bars keep the example\'s own encoding, population on `x`, here from 2000, so what you change is the order, never the length.',
      uses: ['rank()', 'barX'],
      code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const bands = ["0–14", "15–29", "30–44", "45–59", "60–74", "75+"];
const bandOf = (age) => bands[Math.min(5, Math.floor(age / 15))];
const data = bands
  .map((band) => ({ band, people: d3.sum(pop.filter((d) => bandOf(d.age) === band), (d) => d.people) / 1e6 }))
  .sort((a, b) => b.people - a.people)   // seeded in 2000's order
  .map((d, i) => ({ ...d, rank: i + 1 }));
mount(Elicit({
  width: 400, height: 240,
  margins: { top: 8, right: 16, bottom: 36, left: 50 },
  data,
  schema: {
    band: { type: "categorical", domain: bands },
    rank: { type: "ordinal", domain: [6, 5, 4, 3, 2, 1] }, //! listed bottom-up, so rank 1 is on top
    people: { type: "quantitative", domain: [0, 70] },
  },
  axes: { x: { title: "millions of people in 2000" }, y: { title: "your 1950 rank" } },
  marks: [
    barX({
      fill: "#4c78a8",
      channels: {
        y: { field: "rank", edit: rank() }, //! drag to a slot: the bar is inserted there
        x: { field: "people" }, //! the example's encoding, as context
      },
    }),
    text({ fontSize: 12, fill: "white", dx: 6, textAnchor: "start",
      channels: { y: { field: "rank" }, x: { datum: 0 }, text: { field: "band" } } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_grouped
GALLERY.add({
  id: 'vl-bar_grouped',
  status: 'partial',
  verdict: 'Drawn as `rect`s on a quantitative x with hand-computed group offsets; there is no `xOffset` channel, so the category axis is faked with tick values.',
  needs: ['band-offset'],
  prep: ['prep-calculate'],
  gaps: [
    'No `xOffset`: each bar\'s x span is computed in JS (category index + group slot).',
    'The x axis is a numeric axis with `tickValues` at category centres and a label formatter, not a band axis.',
  ],
  recreation: { code: `const rows = [
  { category: "A", group: "x", value: 0.1 }, { category: "A", group: "y", value: 0.6 },
  { category: "A", group: "z", value: 0.9 }, { category: "B", group: "x", value: 0.7 },
  { category: "B", group: "y", value: 0.2 }, { category: "B", group: "z", value: 1.1 },
  { category: "C", group: "x", value: 0.6 }, { category: "C", group: "y", value: 0.1 },
  { category: "C", group: "z", value: 0.2 },
];
const cats = ["A", "B", "C"], groups = ["x", "y", "z"];
// The xOffset by hand: category band [c, c+1], 10% padding, three equal slots.
const data = rows.map((d) => {
  const lo = cats.indexOf(d.category) + 0.05 + groups.indexOf(d.group) * 0.3;
  return { ...d, lo, hi: lo + 0.3 };
});
mount(Elicit({
  width: 300, height: 260,
  margins: { top: 12, right: 12, bottom: 38, left: 48 },
  data,
  schema: {
    category: { type: "categorical", domain: cats },
    group: { type: "categorical", domain: groups },
    value: { type: "quantitative", domain: [0, 1.2] },
    lo: { type: "quantitative", domain: [0, 3] },
    hi: { type: "quantitative", domain: [0, 3] },
  },
  axes: {
    x: { tickValues: [0.5, 1.5, 2.5], tickFormat: (v) => cats[Math.floor(v)], title: "category" },
    y: { title: "value" },
  },
  legends: { fill: { labelWidth: 30 } },
  marks: [
    rect({ channels: {
      x1: { field: "lo" }, x2: { field: "hi" },
      y: { field: "value" },
      fill: { field: "group" },
    } }),
  ],
}))` },
  interfaces: [
    {
      title: 'One group per stage',
      question: 'Group x, then y, then z: what value do you expect each to reach in categories A–C?',
      try: 'Drag the x bars, press Next, drag the y bars, press Next, then the z bars.',
      why: 'Three `move()` edits share the mark, each with its own `stage` and a `when` that only claims rows of one group, so the form walks the reader through the groups in order.',
      uses: ['move()', 'stage', 'when'],
      code: `const cats = ["A", "B", "C"], groups = ["x", "y", "z"];
const data = cats.flatMap((category, c) => groups.map((group, g) => {
  const lo = c + 0.05 + g * 0.3;
  return { category, group, value: 0.5, lo, hi: lo + 0.3 };
}));
const chart = Elicit({
  width: 300, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 36 },
  stage: 0,
  stageLabels: ["group x", "group y", "group z"],
  data,
  schema: {
    category: { type: "categorical", domain: cats },
    group: { type: "categorical", domain: groups },
    value: { type: "quantitative", domain: [0, 1.2] },
    lo: { type: "quantitative", domain: [0, 3] },
    hi: { type: "quantitative", domain: [0, 3] },
  },
  axes: { x: { tickValues: [0.5, 1.5, 2.5], tickFormat: (v) => cats[Math.floor(v)] } },
  legends: { fill: { labelWidth: 30 } },
  marks: [
    rect({
      channels: {
        x1: { field: "lo" }, x2: { field: "hi" },
        y: { field: "value" },
        fill: { field: "group" },
      },
      edits: groups.map((g, stage) => move({ //! one drag edit per group…
        channels: ["y"], stage, //! …live only in its stage
        when: (ctx) => !!ctx.datum && ctx.datum.group === g, //! …and only on that group's bars
      })),
    }),
  ],
});
mount(chart);
const controls = document.createElement("div");
controls.style.cssText = "margin-top:6px;display:flex;gap:10px;align-items:center;font:13px sans-serif";
const label = document.createElement("span");
const next = document.createElement("button");
next.textContent = "Next";
next.onclick = () => chart.nextStage();
const show = () => { label.textContent = "now editing: " + chart.getStageLabel(); };
chart.on("stage", show); show();
controls.append(next, label);
mount(controls);`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_grouped_repeated
GALLERY.add({
  id: 'vl-bar_grouped_repeated',
  status: 'partial',
  verdict: 'The repeated layer is folded into two rows per genre and drawn as one `rect` mark with hand-computed offsets; there is no `repeat` or `xOffset`.',
  needs: ['band-offset', 'text-layout'],
  prep: ['prep-aggregate', 'prep-reshape', 'prep-calculate'],
  gaps: [
    'No `repeat: { layer }`: the two gross columns are folded into a `Gross` column in JS.',
    'No `xOffset`: side-by-side positions are computed in JS on a numeric x axis; genre labels come from `tickValues` and a formatter, cut to three letters because tick labels cannot be rotated.',
    'Gross is shown in $bn rather than dollars; the y title says so.',
  ],
  recreation: { code: `const movies = await vegaData("movies.json");
// Vega-Lite sorts the missing genre ("null") first.
const genres = ["null", ...[...new Set(movies.map((d) => d["Major Genre"]).filter((g) => g != null))].sort()];
const kinds = ["Worldwide Gross", "US Gross"];
// Fold the two columns into rows, and place each in its half of the genre band.
const data = genres.flatMap((genre, i) => {
  const rows = movies.filter((d) => String(d["Major Genre"]) === genre);
  return kinds.map((Gross, k) => ({
    genre, Gross,
    total: d3.sum(rows, (d) => d[Gross]) / 1e9,
    lo: i + 0.05 + k * 0.45, hi: i + 0.5 + k * 0.45,
  }));
});
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 12, right: 12, bottom: 42, left: 48 },
  data,
  schema: {
    genre: { type: "categorical", domain: genres },
    Gross: { type: "categorical", domain: kinds },
    total: { type: "quantitative", domain: [0, 70] },
    lo: { type: "quantitative", domain: [0, genres.length] },
    hi: { type: "quantitative", domain: [0, genres.length] },
  },
  axes: {
    x: { tickValues: genres.map((_, i) => i + 0.5), fontSize: 9,
         tickFormat: (v) => genres[Math.floor(v)].slice(0, 3), title: "Major Genre" },
    y: { title: "Total Gross ($bn)" },
  },
  legends: { fill: { title: "Gross", labelWidth: 110 } },
  marks: [
    rect({ channels: {
      x1: { field: "lo" }, x2: { field: "hi" },
      y: { field: "total" },
      fill: { field: "Gross" },
    } }),
  ],
}))` },
  interfaces: [
    {
      title: 'US share, capped',
      question: 'For each genre, how much of the worldwide gross ($bn) do you think came from the US box office?',
      try: 'Drag an orange bar. It cannot rise above the blue worldwide bar beside it.',
      why: 'Both columns live on one row, drawn by two marks. Only the US mark carries `move()`, and `ordering({ field: ["us", "ww"], strategy: "block" })` rejects any proposal where the part exceeds the whole.',
      uses: ['move()', 'ordering()'],
      code: `const movies = await vegaData("movies.json");
const genres = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Musical"];
const data = genres.map((genre, i) => {
  const ww = d3.sum(movies.filter((d) => d["Major Genre"] === genre), (d) => d["Worldwide Gross"]) / 1e9;
  return { genre, ww: +ww.toFixed(1), us: +(ww / 2).toFixed(1),
           a: i + 0.05, b: i + 0.5, c: i + 0.95 };
});
mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 30, left: 52 },
  data,
  schema: {
    genre: { type: "categorical", domain: genres },
    ww: { type: "quantitative", domain: [0, 70] },
    us: { type: "quantitative", domain: [0, 70] },
    a: { type: "quantitative", domain: [0, 6] },
    b: { type: "quantitative", domain: [0, 6] },
    c: { type: "quantitative", domain: [0, 6] },
  },
  constraints: [
    ordering({ field: ["us", "ww"], strategy: "block" }), //! the US part never exceeds the world total
    clamp({ field: "us", min: 0 }),
  ],
  axes: {
    x: { tickValues: genres.map((_, i) => i + 0.5), tickFormat: (v) => genres[Math.floor(v)] },
    y: { title: "gross ($bn)" },
  },
  marks: [
    rect({ fill: "#4c78a8", channels: { x1: { field: "a" }, x2: { field: "b" }, y: { field: "ww" } } }),
    rect({ fill: "#f58518",
      channels: { x1: { field: "b" }, x2: { field: "c" }, y: { field: "us", edit: move() } } }), //! only the US column is editable
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-stacked_bar_weather
GALLERY.add({
  id: 'vl-stacked_bar_weather',
  status: 'full',
  verdict: 'Days per month and weather type, counted in JS, drawn as one stacked `bar` with the original colour range.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: ['The month time unit and the count are computed in JS.'],
  recreation: { code: `const wx = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => d3.utcFormat("%b")(new Date(Date.UTC(2000, m, 1))));
const types = ["sun", "fog", "drizzle", "rain", "snow"];
// Row order sets stack order: Vega-Lite puts the last weather type at the bottom.
const data = months.flatMap((month, m) => [...types].reverse().map((weather) => ({
  month, weather,
  days: wx.filter((d) => d.date.getUTCMonth() === m && d.weather === weather).length,
})));
mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 40, left: 50 },
  data,
  schema: {
    month: { type: "ordinal", domain: months },
    weather: { type: "categorical", domain: types },
    days: { type: "quantitative", domain: [0, 125] },
  },
  axes: { x: { title: "Month of the year" }, y: { title: "Count of Records" } },
  legends: { fill: { title: "Weather type", labelWidth: 60 } },
  marks: [
    bar({
      stack: true,
      channels: {
        x: { field: "month" },
        y: { field: "days" },
        fill: { field: "weather",
                scale: { range: ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4", "#9467bd"] } },
      },
    }),
  ],
}))` },
  interfaces: [
    {
      title: 'Trade days',
      question: 'In a typical year in the 2040s, how will each Seattle month\'s days split between sun, fog, drizzle, rain and snow?',
      try: 'Drag a dot on a seam between two colours to move days from one weather type to its neighbour.',
      why: '`edit.stack.edge()` moves value across one boundary, so only the two segments it separates change and each month keeps its number of days. The seed is the observed average for 2012–2015.',
      uses: ['edit.stack.edge()'],
      code: `const wx = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => d3.utcFormat("%b")(new Date(Date.UTC(2000, m, 1))));
const types = ["sun", "fog", "drizzle", "rain", "snow"];
// Seed: the average number of days per year of each type, 2012–2015.
const data = months.flatMap((month, m) => types.map((weather) => ({
  month, weather,
  days: wx.filter((d) => d.date.getUTCMonth() === m && d.weather === weather).length / 4,
})));
mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 28, left: 48 },
  data,
  schema: {
    month: { type: "ordinal", domain: months },
    weather: { type: "categorical", domain: types },
    days: { type: "quantitative", domain: [0, 31] },
  },
  axes: { y: { title: "days" } },
  legends: { fill: { title: "Weather type", labelWidth: 60 } },
  marks: [
    bar({
      stack: true,
      handleSize: 4,
      channels: {
        x: { field: "month" },
        y: { field: "days" },
        fill: { field: "weather",
                scale: { range: ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4", "#9467bd"] } },
      },
      edits: [ edit.stack.edge() ], //! drag a seam: days move between neighbours, the month total holds
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-stacked_bar_count_corner_radius_mark
GALLERY.add({
  id: 'vl-stacked_bar_count_corner_radius_mark',
  status: 'full',
  verdict: 'The stack is computed in JS and drawn with `rect` spans, whose `rx` gives the rounded corners.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate', 'prep-stack'],
  gaps: [
    '`rx` rounds all four corners of each segment; Vega-Lite rounds only the top two.',
    '`bar({ stack: true })` has no corner radius, so the stack offsets are computed by hand for `rect`.',
  ],
  recreation: { code: `const wx = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => d3.utcFormat("%b")(new Date(Date.UTC(2000, m, 1))));
const types = ["drizzle", "fog", "rain", "snow", "sun"];
// Count, then stack by hand (last type at the bottom, as in Vega-Lite).
const data = months.flatMap((month, m) => {
  let acc = 0;
  return [...types].reverse().map((weather) => {
    const n = wx.filter((d) => d.date.getUTCMonth() === m && d.weather === weather).length;
    const row = { month, weather, lo: acc, hi: acc + n };
    acc += n;
    return row;
  });
});
mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 40, left: 50 },
  data,
  schema: {
    month: { type: "ordinal", domain: months },
    weather: { type: "categorical", domain: types },
    lo: { type: "quantitative", domain: [0, 125] },
    hi: { type: "quantitative", domain: [0, 125] },
  },
  axes: { x: { title: "date (month)" }, y: { title: "Count of Records" } },
  legends: { fill: { labelWidth: 60 } },
  marks: [
    rect({
      rx: 3,
      channels: {
        x: { field: "month" },
        y1: { field: "lo" }, y2: { field: "hi" },
        fill: { field: "weather" },
      },
    }),
  ],
}))` },
  interfaces: [
    {
      title: 'Cut the summer',
      question: 'How many days of each weather type will Seattle get next June, July and August?',
      try: 'Click inside a bar to cut it into a new weather type, drag a seam to shift days, double-click a seam to merge two types.',
      why: 'Each month starts as one block of sunny days. `edit.stack.cut()` splits a segment and names the new piece from the closed `weather` domain, so building the forecast takes no typing; all three edits keep the month\'s day count.',
      uses: ['edit.stack.cut()', 'edit.stack.edge()', 'edit.stack.merge()'],
      code: `mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 28, left: 48 },
  data: [
    { month: "Jun", weather: "sun", days: 30 },
    { month: "Jul", weather: "sun", days: 31 },
    { month: "Aug", weather: "sun", days: 31 },
  ],
  schema: {
    month: { type: "ordinal", domain: ["Jun", "Jul", "Aug"] },
    weather: { type: "categorical", domain: ["sun", "fog", "drizzle", "rain", "snow"] }, //! the closed vocabulary a cut hands out
    days: { type: "quantitative", domain: [0, 31] },
  },
  axes: { y: { title: "days" } },
  legends: true,
  marks: [
    bar({
      stack: true,
      channels: { x: { field: "month" }, y: { field: "days" }, fill: { field: "weather" } },
      edits: [
        edit.stack.cut(), //! click: split a segment in two
        edit.stack.edge(), //! drag a seam
        edit.stack.merge(), //! double-click a seam to fuse
      ],
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-stacked_bar_h
GALLERY.add({
  id: 'vl-stacked_bar_h',
  status: 'full',
  verdict: 'Barley yield summed by variety and site in JS, drawn as a horizontal stacked `barX`.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['Varieties are listed bottom-up in the domain so they read top-down alphabetically, as in Vega-Lite.'],
  recreation: { code: `const barley = await vegaData("barley.json");
const varieties = [...new Set(barley.map((d) => d.variety))].sort();
const sites = [...new Set(barley.map((d) => d.site))].sort();
const data = d3.rollups(barley, (v) => d3.sum(v, (d) => d.yield), (d) => d.variety, (d) => d.site)
  .flatMap(([variety, bySite]) => bySite.map(([site, yld]) => ({ variety, site, yld })))
  .sort((a, b) => d3.ascending(a.site, b.site)); // row order = stack order
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 8, right: 12, bottom: 36, left: 112 },
  data,
  schema: {
    variety: { type: "categorical", domain: [...varieties].reverse() },
    site: { type: "categorical", domain: sites },
    yld: { type: "quantitative", domain: [0, 500] },
  },
  axes: { x: { title: "Sum of yield" }, y: { title: "variety" } },
  legends: { fill: { labelWidth: 100 } },
  marks: [
    barX({
      stack: true,
      channels: { y: { field: "variety" }, x: { field: "yld" }, fill: { field: "site" } },
    }),
  ],
}))` },
  interfaces: [
    {
      title: 'Split a new variety',
      question: 'A new barley variety yields 400 bushels across the trial. Which sites, including any new ones, would produce how much of it?',
      try: 'Click inside the top bar to cut it, drag a seam to shift yield, double-click a seam to merge. The two real varieties are fixed.',
      why: 'The `site` domain is `open`, so once the six real sites are used a cut appends a new one (named `Site 1`, …) instead of refusing. A `lock` predicate keeps the reference varieties out of reach of every edit.',
      uses: ['edit.stack.cut()', 'open domain', 'lock'],
      code: `const barley = await vegaData("barley.json");
const sites = [...new Set(barley.map((d) => d.site))].sort();
const ref = ["Manchuria", "Trebi"];
const data = d3.rollups(barley.filter((d) => ref.includes(d.variety)),
    (v) => d3.sum(v, (d) => d.yield), (d) => d.variety, (d) => d.site)
  .flatMap(([variety, bySite]) => bySite.map(([site, yld]) => ({ variety, site, yld })));
data.push({ variety: "New", site: sites[0], yld: 400 });
mount(Elicit({
  width: 440, height: 220,
  margins: { top: 8, right: 12, bottom: 28, left: 80 },
  data,
  lock: (d) => d.variety !== "New", //! the real varieties are reference only
  schema: {
    variety: { type: "categorical", domain: [...ref, "New"] },
    site: { type: "categorical", domain: sites, open: true }, //! a cut may add a site
    yld: { type: "quantitative", domain: [0, 600] },
  },
  legends: true,
  marks: [
    barX({
      stack: true,
      channels: { y: { field: "variety" }, x: { field: "yld" }, fill: { field: "site" } },
      edits: [ edit.stack.cut({ label: "Site" }), edit.stack.edge(), edit.stack.merge() ], //! cut / shift / merge
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-stacked_bar_normalize
GALLERY.add({
  id: 'vl-stacked_bar_normalize',
  status: 'full',
  verdict: 'Each age\'s female and male shares are normalized in JS and stacked with `bar({ stack: true })` on a 0–100% axis.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate', 'prep-stack'],
  gaps: ['`stack: "normalize"` is a JS division by each age\'s total; the y axis is in percent rather than 0–1.'],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = ages.flatMap((age) => {
  const rows = pop.filter((d) => d.age === age);
  const total = d3.sum(rows, (d) => d.people);
  return ["Male", "Female"].map((gender) => ({
    age, gender,
    share: 100 * d3.sum(rows.filter((d) => (d.sex === 2) === (gender === "Female")), (d) => d.people) / total,
  }));
});
mount(Elicit({
  width: 19 * 17 + 120, height: 260,
  margins: { top: 8, right: 8, bottom: 40, left: 52 },
  data,
  schema: {
    age: { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    share: { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: { title: "age" }, y: { title: "population", tickFormat: (v) => v + "%" } },
  legends: true,
  marks: [
    bar({
      stack: true,
      channels: {
        x: { field: "age" }, y: { field: "share" },
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
  ],
}))` },
  interfaces: [
    {
      title: 'One row, two marks',
      question: 'In 2050, what percentage of Americans in each age group will be women?',
      try: 'Drag the top of a purple bar. The tan bar always fills the rest of the column.',
      why: 'Each age is one row with one `female` column. A `barY` draws it from 0 and a `rectY` draws the remainder from `female` up to `{ datum: 100 }`, so the stack is normalized by construction and only one number per age is elicited.',
      uses: ['move()', '{ datum }', 'guides.rule()'],
      code: `const ages = d3.range(0, 95, 5);
mount(Elicit({
  width: 19 * 17 + 72, height: 260,
  margins: { top: 8, right: 8, bottom: 30, left: 52 },
  data: ages.map((age) => ({ age, female: 50 })),
  schema: {
    age: { type: "ordinal", domain: ages },
    female: { type: "quantitative", domain: [0, 100] },
  },
  axes: { y: { title: "women", tickFormat: (v) => v + "%" } },
  guides: [ guides.rule({ y: 50, stroke: "#fff", strokeDash: "3 3" }) ],
  constraints: [ clamp({ field: "female", min: 0, max: 100 }) ],
  marks: [
    barY({ fill: "#675193",
      channels: { x: { field: "age" }, y: { field: "female", edit: move() } } }), //! the one elicited share
    rectY({ fill: "#ca8861",
      channels: { x: { field: "age" }, y1: { field: "female" }, y2: { datum: 100 } } }), //! the rest, up to 100%
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-stacked_bar_h_normalized_labeled
GALLERY.add({
  id: 'vl-stacked_bar_h_normalized_labeled',
  status: 'full',
  verdict: 'Normalized horizontal stack plus a `text` layer at each segment\'s centre printing the summed population.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate', 'prep-stack'],
  gaps: ['Shares and label positions (segment centres) are computed in JS; the x axis is in percent rather than 0–1.'],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = ages.flatMap((age) => {
  const rows = pop.filter((d) => d.age === age);
  const total = d3.sum(rows, (d) => d.people);
  let acc = 0;
  return ["Female", "Male"].map((gender) => {
    const people = d3.sum(rows.filter((d) => (d.sex === 2) === (gender === "Female")), (d) => d.people);
    const share = (100 * people) / total;
    const row = { age, gender, people, share, mid: acc + share / 2 };
    acc += share;
    return row;
  });
});
mount(Elicit({
  width: 440, height: 19 * 17 + 40,
  margins: { top: 8, right: 8, bottom: 36, left: 46 },
  data,
  schema: {
    age: { type: "ordinal", domain: [...ages].reverse() },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    people: { type: "quantitative" },
    share: { type: "quantitative", domain: [0, 100] },
    mid: { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: { title: "population", tickFormat: (v) => v + "%" }, y: { title: "age" } },
  legends: true,
  marks: [
    barX({
      stack: true,
      channels: {
        y: { field: "age" }, x: { field: "share" },
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
    text({ fill: "white", opacity: 0.9, fontSize: 10,
      channels: { y: { field: "age" }, x: { field: "mid" }, text: { field: "people" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Slide the split',
      question: 'Among Americans aged 80 and over in 2050, what share will be women in each age band?',
      try: 'Drag anywhere on a purple bar, left or right; the split moves by how far you drag, not to where you pressed.',
      why: '`slide()` is relative: it freezes the value at drag start and adds the drag distance (`extent` px sweeps the whole domain), so pressing a bar never makes it jump. Both labels are `{ fn }` text over the one `female` column, so they update together.',
      uses: ['slide()', 'text', '{ fn } channel'],
      code: `const bands = ["80–84", "85–89", "90–94", "95–99", "100+"];
mount(Elicit({
  width: 440, height: 220,
  margins: { top: 8, right: 16, bottom: 32, left: 50 },
  data: bands.map((band) => ({ band, female: 50 })),
  schema: {
    band: { type: "categorical", domain: [...bands].reverse() },
    female: { type: "quantitative", domain: [0, 100] },
  },
  constraints: [ clamp({ field: "female", min: 0, max: 100 }) ],
  axes: { x: { tickFormat: (v) => v + "%" } },
  marks: [
    rectX({ fill: "#ca8861",
      channels: { y: { field: "band" }, x1: { field: "female" }, x2: { datum: 100 } } }),
    barX({ fill: "#675193",
      channels: { y: { field: "band" }, x: { field: "female",
          edit: slide({ axis: "x", extent: 370 }) } } }), //! relative drag: no jump on press
    text({ fill: "white", fontSize: 11, textAnchor: "start", dx: 4,
      channels: { y: { field: "band" }, x: { datum: 0 },
                  text: { fn: (d) => "women " + Math.round(d.female) + "%" } } }), //! labels re-derive from the row
    text({ fill: "white", fontSize: 11, textAnchor: "end", dx: -4,
      channels: { y: { field: "band" }, x: { datum: 100 },
                  text: { fn: (d) => "men " + Math.round(100 - d.female) + "%" } } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_gantt
GALLERY.add({
  id: 'vl-bar_gantt',
  status: 'full',
  verdict: 'A `barX` in span mode (`x1`/`x2`) over the three task rows.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: { code: `mount(Elicit({
  width: 400, height: 150,
  margins: { top: 8, right: 12, bottom: 38, left: 42 },
  data: [
    { task: "A", start: 1, end: 3 },
    { task: "B", start: 3, end: 8 },
    { task: "C", start: 8, end: 10 },
  ],
  schema: {
    task: { type: "ordinal", domain: ["C", "B", "A"] },
    start: { type: "quantitative", domain: [0, 10] },
    end: { type: "quantitative", domain: [0, 10] },
  },
  axes: { x: { title: "start, end" }, y: { title: "task" } },
  marks: [
    barX({ fill: "#4c78a8",
      channels: { y: { field: "task" }, x1: { field: "start" }, x2: { field: "end" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Brush the schedule',
      question: 'These three tasks were planned at 1–3, 3–8 and 8–10 weeks. When do you think each will really start and finish?',
      try: 'Drag a bar\'s end to resize it, its middle to move the whole task, or across empty space in a row to redraw it. Ends snap to half weeks.',
      why: '`brushSpan()` on the `x1`/`x2` pair edits both ends of one row: near an edge it moves that end, on the body it moves the span, and in empty space along the row it brushes a new span. One `snap` per field rounds every proposal to half a week.',
      uses: ['brushSpan()', 'snap()'],
      code: `mount(Elicit({
  width: 400, height: 166,
  margins: { top: 8, right: 12, bottom: 36, left: 28 },
  data: [
    { task: "A", start: 1, end: 3 },
    { task: "B", start: 3, end: 8 },
    { task: "C", start: 8, end: 10 },
  ],
  schema: {
    task: { type: "ordinal", domain: ["C", "B", "A"] },
    start: { type: "quantitative", domain: [0, 16] },
    end: { type: "quantitative", domain: [0, 16] },
  },
  constraints: [
    snap({ field: "start", step: 0.5 }), //! half-week resolution…
    snap({ field: "end", step: 0.5 }), //! …on both ends
  ],
  axes: { x: { title: "week" } },
  marks: [
    barX({
      fill: "#4c78a8",
      channels: { y: { field: "task" }, x1: { field: "start" }, x2: { field: "end" } },
      edits: [ brushSpan({ channels: ["x1", "x2"], edgeInset: 8, guide: true }) ], //! edges resize, body moves
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_color_disabled_scale
GALLERY.add({
  id: 'vl-bar_color_disabled_scale',
  status: 'full',
  verdict: '`fill: { field: "color", scale: null }` paints each bar with the colour name stored in the row, as `scale: null` does in Vega-Lite.',
  needs: [],
  prep: [],
  gaps: ['X labels are not rotated.'],
  recreation: { code: `mount(Elicit({
  width: 260, height: 240,
  margins: { top: 12, right: 12, bottom: 40, left: 46 },
  data: [ { color: "red", b: 28 }, { color: "green", b: 55 }, { color: "blue", b: 43 } ],
  schema: {
    color: { type: "categorical", domain: ["blue", "green", "red"] },
    b: { type: "quantitative", domain: [0, 60] },
  },
  axes: { x: { title: "color" }, y: { title: "b" } },
  marks: [
    barY({ channels: {
      x: { field: "color" },
      y: { field: "b" },
      fill: { field: "color", scale: null },
    } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Click to recolour',
      question: 'Out of 100 people, 28, 55 and 43 called red, green and blue “calm” (in some order). Which colour do you think each bar is?',
      try: 'Click a bar to cycle its colour: grey, red, green, blue.',
      why: '`cycle()` on `fill` steps the row\'s `color` value through its domain. The channel has no scale (`scale: null`), so `cycle` reads the schema\'s domain, and the bar paints whatever colour name the row now holds.',
      uses: ['cycle()', 'scale: null'],
      code: `mount(Elicit({
  width: 260, height: 240,
  margins: { top: 12, right: 12, bottom: 28, left: 36 },
  data: [
    { bar: "1st", b: 28, color: "lightgray" },
    { bar: "2nd", b: 55, color: "lightgray" },
    { bar: "3rd", b: 43, color: "lightgray" },
  ],
  schema: {
    bar: { type: "categorical", domain: ["1st", "2nd", "3rd"] },
    b: { type: "quantitative", domain: [0, 60] },
    color: { type: "categorical", domain: ["lightgray", "red", "green", "blue"] }, //! the colours a click steps through
  },
  marks: [
    barY({ channels: {
      x: { field: "bar" },
      y: { field: "b" },
      fill: { field: "color", scale: null, edit: cycle() }, //! click: next colour name, painted as-is
    } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_layered_transparent
GALLERY.add({
  id: 'vl-bar_layered_transparent',
  status: 'full',
  verdict: 'An unstacked `bar` coloured by gender with `opacity: 0.7`, so the two bars per age overlap as in Vega-Lite.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: [],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = pop.map((d) => ({ age: d.age, gender: d.sex === 2 ? "Female" : "Male", people: d.people }));
mount(Elicit({
  width: 19 * 17 + 120, height: 260,
  margins: { top: 8, right: 8, bottom: 40, left: 54 },
  data,
  schema: {
    age: { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    people: { type: "quantitative", domain: [0, 12e6] },
  },
  axes: { x: { title: "age" }, y: { title: "population", tickFormat: "~s" } },
  legends: true,
  marks: [
    bar({
      opacity: 0.7,
      channels: {
        x: { field: "age" }, y: { field: "people" },
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
  ],
}))` },
  interfaces: [
    {
      title: 'Estimate one layer',
      question: 'The tan bars are the number of men in each US age group in 2000. How many women (millions) do you think there were in each?',
      try: 'Drag a purple bar up or down. The tan bars are fixed; the overlap shows where women outnumber men.',
      why: 'A `lock` predicate makes every `Male` row read-only, so `move()` only reaches the women\'s layer. Both layers stay translucent, so the comparison is read off the overlap.',
      uses: ['lock', 'move()'],
      code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = pop.map((d) => ({
  age: d.age,
  gender: d.sex === 2 ? "Female" : "Male",
  people: d.sex === 2 ? 5 : +(d.people / 1e6).toFixed(2),  // women start at a flat 5M
}));
mount(Elicit({
  width: 19 * 17 + 120, height: 260,
  margins: { top: 8, right: 8, bottom: 30, left: 44 },
  data,
  lock: (d) => d.gender === "Male", //! men are given; only women are elicited
  schema: {
    age: { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    people: { type: "quantitative", domain: [0, 14] },
  },
  constraints: [ clamp({ field: "people", min: 0, max: 14 }) ],
  axes: { y: { title: "millions" } },
  legends: true,
  marks: [
    bar({
      opacity: 0.7,
      channels: {
        x: { field: "age" },
        y: { field: "people", edit: move() },
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_diverging_stack_population_pyramid
GALLERY.add({
  id: 'vl-bar_diverging_stack_population_pyramid',
  status: 'full',
  verdict: 'Women get negative counts in JS, so one unstacked `barX` draws the two sides of the pyramid from a shared zero.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Tick labels on the left keep their minus sign, as Vega-Lite\'s `format: "s"` does.'],
  recreation: { code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))];
const data = pop.map((d) => ({
  age: d.age,
  gender: d.sex === 2 ? "Female" : "Male",
  signed: d.sex === 2 ? -d.people : d.people,
}));
mount(Elicit({
  width: 340, height: 250,
  margins: { top: 8, right: 8, bottom: 36, left: 8 },
  data,
  schema: {
    age: { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    signed: { type: "quantitative", domain: [-12e6, 12e6] },
  },
  axes: { x: { title: "population", tickFormat: "~s" }, y: false },
  legends: { fill: { anchor: "top", title: false } },
  marks: [
    barX({ channels: {
      y: { field: "age" }, x: { field: "signed" },
      fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
    } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Two sides, one row',
      question: 'What will the US population pyramid look like in 2050? Set millions of women (left) and men (right) per age group.',
      try: 'Drag any bar outward or inward. Each side stops at zero.',
      why: 'Each age is one row with a `women` column on the negative side and a `men` column on the positive side, drawn by two `barX` marks on one shared x axis. A `clamp` per column keeps each bar on its own side.',
      uses: ['move()', 'clamp()'],
      code: `const ages = d3.range(0, 95, 5);
mount(Elicit({
  width: 340, height: 280,
  margins: { top: 8, right: 8, bottom: 30, left: 28 },
  data: ages.map((age) => ({ age, women: -10, men: 10 })),
  schema: {
    age: { type: "ordinal", domain: ages },
    women: { type: "quantitative", domain: [-14, 0] },
    men: { type: "quantitative", domain: [0, 14] },
  },
  constraints: [
    clamp({ field: "women", max: 0 }), //! women stay left of zero
    clamp({ field: "men", min: 0 }), //! men stay right of zero
  ],
  axes: { x: { title: "millions", tickFormat: (v) => String(Math.abs(v)) } },
  marks: [
    barX({ fill: "#675193", channels: { y: { field: "age" }, x: { field: "women", edit: move() } } }),
    barX({ fill: "#ca8861", channels: { y: { field: "age" }, x: { field: "men", edit: move() } } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_diverging_stack_transform
GALLERY.add({
  id: 'vl-bar_diverging_stack_transform',
  status: 'full',
  verdict: 'The example\'s stack/joinaggregate/calculate pipeline runs in JS; the resulting `nx`/`nx2` spans are drawn with `barX` in span mode.',
  needs: [],
  prep: ['prep-calculate', 'prep-stack', 'prep-aggregate'],
  gaps: ['The whole transform chain (stack by question, offset by the disagree half) is hand-written JS.', 'Axis styling (`offset`, no ticks or domain line) is the library default.'],
  recreation: { code: `const raw = [
  ["Question 1", [0.7, 9.1, 18.5, 59.9, 11.7]], ["Question 2", [18.2, 18.2, 0, 63.6, 0]],
  ["Question 3", [20, 0, 20, 40, 20]],          ["Question 4", [0, 12.5, 6.3, 43.8, 37.5]],
  ["Question 5", [0, 4.2, 12.5, 66.7, 16.7]],   ["Question 6", [6.3, 6.3, 12.5, 56.3, 18.8]],
  ["Question 7", [0, 0, 20, 80, 0]],            ["Question 8", [0, 0, 0, 0, 100]],
];
const types = ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"];
// stack by question, then shift so the disagree half and half of neutral sit left of 0
const data = raw.flatMap(([question, pct]) => {
  const offset = pct[0] + pct[1] + pct[2] / 2;
  let acc = 0;
  return types.map((type, i) => {
    const row = { question, type, nx: acc - offset, nx2: acc + pct[i] - offset };
    acc += pct[i];
    return row;
  });
});
mount(Elicit({
  width: 480, height: 230,
  margins: { top: 8, right: 8, bottom: 38, left: 92 },
  data,
  schema: {
    question: { type: "categorical", domain: raw.map((d) => d[0]).reverse() },
    type: { type: "ordinal", domain: types },
    nx: { type: "quantitative", domain: [-45, 100] },
    nx2: { type: "quantitative", domain: [-45, 100] },
  },
  axes: { x: { title: "Percentage" }, y: { title: "Question" } },
  legends: { fill: { title: "Response", labelWidth: 150 } },
  marks: [
    barX({ channels: {
      y: { field: "question" }, x1: { field: "nx" }, x2: { field: "nx2" },
      fill: { field: "type",
              scale: { range: ["#c30d24", "#f3a583", "#cccccc", "#94c6da", "#1770ab"] } },
    } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Spend 100%',
      question: 'A ninth question goes to the same respondents. What percentage do you expect to give each response?',
      try: 'Drag the bars. Once 100% is allocated, a bar can only grow by taking from the others.',
      why: '`maintainSum({ total: 100, strategy: "cap" })` stops the total passing 100, and `guides.remaining` prints what is left to allocate, reading its target from that constraint.',
      uses: ['move()', 'maintainSum()', 'guides.remaining()'],
      code: `const types = ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"];
mount(Elicit({
  width: 460, height: 240,
  margins: { top: 26, right: 12, bottom: 30, left: 150 },
  data: types.map((type) => ({ type, pct: 10 })),
  schema: {
    type: { type: "ordinal", domain: [...types].reverse() },
    pct: { type: "quantitative", domain: [0, 100] },
  },
  constraints: [
    clamp({ field: "pct", min: 0 }),
    maintainSum({ field: "pct", total: 100, strategy: "cap" }), //! never more than 100% in total
  ],
  guides: [ guides.remaining({ field: "pct", unit: "point" }) ], //! what is left to give
  axes: { x: { tickFormat: (v) => v + "%" } },
  marks: [
    barX({ channels: {
      y: { field: "type" },
      x: { field: "pct", edit: move() },
      fill: { field: "type",
              scale: { range: ["#1770ab", "#94c6da", "#cccccc", "#f3a583", "#c30d24"] } },
    } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-layer_bar_labels
GALLERY.add({
  id: 'vl-layer_bar_labels',
  status: 'full',
  verdict: 'A `barX` plus a `text` mark over the same rows, anchored at the bar end with `dx: 3`.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: { code: `mount(Elicit({
  width: 400, height: 120,
  margins: { top: 6, right: 12, bottom: 38, left: 36 },
  data: [ { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 } ],
  schema: {
    a: { type: "categorical", domain: ["C", "B", "A"] },
    b: { type: "quantitative", domain: [0, 60] },
  },
  axes: { x: { title: "b" }, y: { title: "a" } },
  marks: [
    barX({ fill: "#4c78a8", channels: { y: { field: "a" }, x: { field: "b" } } }),
    text({ textAnchor: "start", dx: 3, fontSize: 11,
      channels: { y: { field: "a" }, x: { field: "b" }, text: { field: "b" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Drag the label',
      question: 'A, B and C scored 28, 55 and 43 out of 60 last time. What will they score next time?',
      try: 'Drag a number at the end of a bar left or right; the bar follows it.',
      why: 'The edit sits on the `text` mark: `move()` on its `x` writes `b`, and the bar re-derives from the same column. The label is the handle, so the reader grabs the very number they are setting.',
      uses: ['move()', 'text', 'snap()'],
      code: `mount(Elicit({
  width: 400, height: 140,
  margins: { top: 6, right: 24, bottom: 28, left: 24 },
  data: [ { a: "A", b: 28 }, { a: "B", b: 55 }, { a: "C", b: 43 } ],
  schema: {
    a: { type: "categorical", domain: ["C", "B", "A"] },
    b: { type: "quantitative", domain: [0, 60] },
  },
  constraints: [ snap({ field: "b", step: 1 }), clamp({ field: "b", min: 0, max: 60 }) ],
  marks: [
    barX({ fill: "#4c78a8", channels: { y: { field: "a" }, x: { field: "b" } } }), //! the bar is inert…
    text({ textAnchor: "start", dx: 3, fontSize: 13, fill: "#1d4ed8",
      channels: {
        y: { field: "a" },
        x: { field: "b", edit: move() }, //! …the label carries the drag
        text: { field: "b" },
      } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-layer_bar_labels_grey
GALLERY.add({
  id: 'vl-layer_bar_labels_grey',
  status: 'full',
  verdict: 'Grey `barX` bars of mean IMDB rating with the genre name drawn inside each bar by a `text` mark at a fixed pixel x.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['The mean is computed in JS; the `detail: count` channel (which only affects grouping) has no counterpart and is not needed.'],
  recreation: { code: `const movies = await vegaData("movies.json");
// Vega-Lite keeps the missing genre as its own "null" bar, first in the sort.
const genres = ["null", ...[...new Set(movies.map((d) => d["Major Genre"]).filter((g) => g != null))].sort()];
const data = genres.map((genre) => ({
  genre,
  rating: d3.mean(movies.filter((d) => String(d["Major Genre"]) === genre), (d) => d["IMDB Rating"]),
}));
mount(Elicit({
  width: 240, height: genres.length * 16 + 40,
  margins: { top: 6, right: 12, bottom: 32, left: 12 },
  data,
  schema: {
    genre: { type: "categorical", domain: [...genres].reverse() },
    rating: { type: "quantitative", domain: [0, 10] },
  },
  axes: { x: { title: "Mean IMDB Ratings", grid: true }, y: false },
  marks: [
    barX({ fill: "#ddd", channels: { y: { field: "genre" }, x: { field: "rating" } } }),
    text({ textAnchor: "start", dx: 5, fontSize: 10,
      channels: { y: { field: "genre" }, x: { value: 0 }, text: { field: "genre" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Against the mean',
      question: 'What is the average IMDB rating of a film in each genre?',
      try: 'Drag a bar left or right; ratings snap to 0.1. The dashed line is the mean of your answers.',
      why: '`move()` writes `rating`, `snap` keeps it to one decimal, and `guides.rule` takes a function of the chart context, so the reference line is recomputed from your rows on every render.',
      uses: ['move()', 'snap()', 'guides.rule()'],
      code: `const genres = ["Action", "Comedy", "Documentary", "Drama", "Horror", "Musical", "Western"];
mount(Elicit({
  width: 420, height: 7 * 26 + 40,
  margins: { top: 16, right: 16, bottom: 32, left: 12 },
  data: genres.map((genre) => ({ genre, rating: 5 })),
  schema: {
    genre: { type: "categorical", domain: [...genres].reverse() },
    rating: { type: "quantitative", domain: [0, 10] },
  },
  constraints: [ snap({ field: "rating", step: 0.1 }), clamp({ field: "rating", min: 0, max: 10 }) ],
  guides: [
    guides.rule({ x: ({ data }) => d3.mean(data, (d) => d.rating), //! recomputed from your answers
                  label: "your mean", stroke: "#e45756", strokeDash: "4 3" }),
  ],
  axes: { x: { title: "Mean IMDB Rating" }, y: false },
  marks: [
    barX({ fill: "#ddd", channels: { y: { field: "genre" }, x: { field: "rating", edit: move() } } }), //! drag writes \`rating\`
    text({ textAnchor: "start", dx: 5, fontSize: 11,
      channels: { y: { field: "genre" }, x: { value: 0 }, text: { field: "genre" } } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_month_temporal_initial
GALLERY.add({
  id: 'vl-bar_month_temporal_initial',
  status: 'full',
  verdict: 'Mean precipitation per month on a band axis, with the axis `tickFormat` cutting each month to its initial, as `labelExpr: datum.label[0]` does.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: [
    'The month time unit is computed in JS, so x is a band axis of month names, not a temporal axis.',
    'Initials are centred under each bar rather than left-aligned at the month boundary (`labelAlign: "left"`).',
  ],
  recreation: { code: `const wx = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => d3.utcFormat("%B")(new Date(Date.UTC(2000, m, 1))));
const data = months.map((month, m) => ({
  month,
  precip: d3.mean(wx.filter((d) => d.date.getUTCMonth() === m), (d) => d.precipitation),
}));
mount(Elicit({
  width: 400, height: 240,
  margins: { top: 10, right: 10, bottom: 40, left: 44 },
  data,
  schema: {
    month: { type: "ordinal", domain: months },
    precip: { type: "quantitative", domain: [0, 6] },
  },
  axes: { x: { tickFormat: (v) => v[0], title: "date (month)" }, y: { title: "Mean of precipitation" } },
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "month" }, y: { field: "precip" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Nearest bar',
      question: 'In the 2040s, what will Seattle\'s mean daily precipitation (mm) be in each month?',
      try: 'Press anywhere near a bar\'s top, even in the empty space above it, and drag up or down.',
      why: '`move({ pick: "nearest" })` targets the closest bar within `threshold` px instead of the one under the pointer, so a short bar is as easy to grab as a tall one. `guide: true` draws the catchment while you aim.',
      uses: ['move()', 'pick: "nearest"'],
      code: `const months = d3.range(12).map((m) => d3.utcFormat("%B")(new Date(Date.UTC(2000, m, 1))));
mount(Elicit({
  width: 400, height: 240,
  margins: { top: 10, right: 10, bottom: 26, left: 44 },
  data: months.map((month) => ({ month, precip: 3 })),
  schema: {
    month: { type: "ordinal", domain: months },
    precip: { type: "quantitative", domain: [0, 8] },
  },
  constraints: [ clamp({ field: "precip", min: 0, max: 8 }) ],
  axes: { x: { tickFormat: (v) => v[0] }, y: { title: "mm per day" } },
  marks: [
    barY({
      fill: "#4c78a8",
      channels: {
        x: { field: "month" },
        y: { field: "precip", edit: move({ pick: "nearest", threshold: 40, guide: true }) }, //! grab the closest bar, not the one under the pointer
      },
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_month_temporal_band_center
GALLERY.add({
  id: 'vl-bar_month_temporal_band_center',
  status: 'full',
  verdict: 'Bars on a real temporal x axis, each a `rectY` spanning its month, with one label per month placed mid-band by `tickValues`.',
  needs: [],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: ['The month time unit and each bar\'s span are computed in JS; the mid-month label positions are explicit `tickValues` rather than `bandPosition`.', 'No vertical gridlines.'],
  recreation: { code: `const wx = await vegaData("seattle-weather.csv");
const data = d3.range(12).map((m) => ({
  start: new Date(2012, m, 1),
  end: new Date(2012, m + 1, 1),
  precip: d3.mean(wx.filter((d) => d.date.getUTCMonth() === m), (d) => d.precipitation),
}));
const domain = [new Date(2012, 0, 1), new Date(2013, 0, 1)];
mount(Elicit({
  width: 420, height: 240,
  margins: { top: 10, right: 12, bottom: 40, left: 44 },
  data,
  schema: {
    start: { type: "temporal", domain },
    end: { type: "temporal", domain },
    precip: { type: "quantitative", domain: [0, 6] },
  },
  axes: { x: {
    tickValues: d3.range(12).map((m) => new Date(2012, m, 15)),   // one label per month, mid-band
    tickFormat: d3.timeFormat("%b"), title: "date (month)",
  }, y: { title: "Mean of precipitation" } },
  marks: [
    rectY({ fill: "#4c78a8", stroke: "white", strokeWidth: 1,
      channels: { x1: { field: "start" }, x2: { field: "end" }, y: { field: "precip" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Classify the months',
      question: 'Which of Seattle\'s months would you call wet, dry, or in between?',
      try: 'Click a bar to select it, then click a swatch in the legend to classify it. Bar heights are the observed means.',
      why: '`edit.select()` makes the clicked bar the chart\'s selection, and `edit.legend.category()` on the `fill` channel turns the legend into a picker that writes the selected row\'s `season`. Nothing moves; only a category is elicited.',
      uses: ['edit.select()', 'edit.legend.category()'],
      code: `const wx = await vegaData("seattle-weather.csv");
const months = d3.range(12).map((m) => d3.utcFormat("%b")(new Date(Date.UTC(2000, m, 1))));
const data = months.map((month, m) => ({
  month,
  precip: d3.mean(wx.filter((d) => d.date.getUTCMonth() === m), (d) => d.precipitation),
  season: "unsure",
}));
mount(Elicit({
  width: 420, height: 240,
  margins: { top: 10, right: 10, bottom: 26, left: 30 },
  data,
  schema: {
    month: { type: "ordinal", domain: months },
    precip: { type: "quantitative", domain: [0, 6] },
    season: { type: "categorical", domain: ["unsure", "dry", "in between", "wet"] },
  },
  marks: [
    barY({
      channels: {
        x: { field: "month" },
        y: { field: "precip" },
        fill: { field: "season", //! the elicited column
                scale: { range: ["#d1d5db", "#e7ba52", "#9ecae1", "#1f77b4"] },
                edit: edit.legend.category() }, //! the legend becomes a picker for the selected bar
      },
      edits: [ edit.select() ], //! click a bar to choose which row the legend writes
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_negative
GALLERY.add({
  id: 'vl-bar_negative',
  status: 'full',
  verdict: 'A `barY` whose bars hang from zero on a domain that spans it, with a black `rule` drawn at zero in place of the conditional grid colour.',
  needs: [],
  prep: [],
  gaps: ['The zero line is a `ruleY` mark rather than a conditionally coloured gridline; the axis domain line and ticks stay on.'],
  recreation: { code: `const data = [
  { a: "A", b: -28 }, { a: "B", b: 55 }, { a: "C", b: -33 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: -19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 10, right: 10, bottom: 38, left: 46 },
  data,
  schema: {
    a: { type: "categorical", domain: data.map((d) => d.a) },
    b: { type: "quantitative", domain: [-40, 100] },
  },
  axes: { x: { title: "a" }, y: { grid: true, title: "b" } },
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "a" }, y: { field: "b" } } }),
    ruleY({ stroke: "black", channels: { y: { datum: 0 } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Colour by sign',
      question: 'Nine products, A–I. The bars show this year\'s change in sales. By what percentage will each change next year?',
      try: 'Drag a bar above or below zero; it turns red when it crosses into a loss.',
      why: '`move()` writes `b` through a scale whose domain spans zero, so a bar can flip sides. `fill` is a derived `{ fn }` channel of the same row, so the colour re-derives after every commit.',
      uses: ['move()', '{ fn } channel', 'clamp()'],
      code: `const lastYear = [-28, 55, -33, 91, 81, 53, -19, 87, 52];
const items = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 10, right: 10, bottom: 26, left: 56 },
  data: items.map((a, i) => ({ a, b: lastYear[i] })),  // seeded with this year
  schema: {
    a: { type: "categorical", domain: items },
    b: { type: "quantitative", domain: [-100, 100] },
  },
  constraints: [ clamp({ field: "b", min: -100, max: 100 }) ],
  axes: { y: { grid: true, tickFormat: (v) => v + "%", title: "change in sales" } },
  marks: [
    ruleY({ stroke: "black", channels: { y: { datum: 0 } } }),
    barY({
      channels: {
        x: { field: "a" },
        y: { field: "b", edit: move() }, //! drag across zero
        fill: { fn: (d) => (d.b < 0 ? "#e45756" : "#4c78a8") }, //! colour derived from the sign
      },
    }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_negative_horizontal_label
GALLERY.add({
  id: 'vl-bar_negative_horizontal_label',
  status: 'full',
  verdict: 'A horizontal `barX` with a `text` layer whose anchor and offset are `{ fn }` channels of the sign, like the `align`/`dx` expressions.',
  needs: [],
  prep: [],
  gaps: ['The zero line is a `ruleX` mark rather than a conditionally coloured gridline; the scale padding is a slightly wider domain.'],
  recreation: { code: `const data = [
  { a: "A", b: -28 }, { a: "B", b: 55 }, { a: "C", b: -33 },
  { a: "D", b: 91 }, { a: "E", b: 81 }, { a: "F", b: 53 },
  { a: "G", b: -19 }, { a: "H", b: 87 }, { a: "I", b: 52 },
];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 8, right: 12, bottom: 38, left: 36 },
  data,
  schema: {
    a: { type: "categorical", domain: data.map((d) => d.a).reverse() },
    b: { type: "quantitative", domain: [-50, 110] },
  },
  axes: { x: { grid: true, title: "b" }, y: { title: "a" } },
  marks: [
    barX({ fill: "#4c78a8", channels: { y: { field: "a" }, x: { field: "b" } } }),
    ruleX({ stroke: "black", channels: { x: { datum: 0 } } }),
    text({ fontSize: 10,
      channels: {
        y: { field: "a" }, x: { field: "b" }, text: { field: "b" },
        textAnchor: { fn: (d) => (d.b < 0 ? "end" : "start") },
        dx: { fn: (d) => (d.b < 0 ? -2 : 2) },
      } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Add, drag, drop',
      question: 'Nine funds, A–I. Which will gain and which will lose next year, and by how many percent?',
      try: 'Drag a bar left or right. Alt-click a fund you have no view on to drop it; click its empty row to bring it back.',
      why: '`remove({ when: when.alt })` and `create()` share the click: Alt deletes the clicked row, a plain click in an empty row mints one there. `unique` keeps one bar per fund, and the labels flip side with the sign.',
      uses: ['remove()', 'create()', 'when', 'unique()', 'move()'],
      code: `const funds = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
mount(Elicit({
  width: 400, height: 260,
  margins: { top: 8, right: 16, bottom: 26, left: 24 },
  data: funds.map((a) => ({ a, b: 10 })),
  schema: {
    a: { type: "categorical", domain: [...funds].reverse() },
    b: { type: "quantitative", domain: [-40, 40] },
  },
  constraints: [ unique({ field: "a", max: 1 }), clamp({ field: "b", min: -40, max: 40 }) ],
  axes: { x: { grid: true } },
  marks: [
    ruleX({ stroke: "black", channels: { x: { datum: 0 } } }),
    barX({
      fill: "#4c78a8",
      channels: { y: { field: "a" }, x: { field: "b", edit: move() } },
      edits: [
        remove({ when: when.alt }), //! Alt-click drops a fund
        create(), //! a click in an empty row brings one back
      ],
    }),
    text({ fontSize: 10,
      channels: {
        y: { field: "a" }, x: { field: "b" }, text: { fn: (d) => Math.round(d.b) + "%" },
        textAnchor: { fn: (d) => (d.b < 0 ? "end" : "start") },
        dx: { fn: (d) => (d.b < 0 ? -3 : 3) },
      } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_axis_space_saving
GALLERY.add({
  id: 'vl-bar_axis_space_saving',
  status: 'partial',
  verdict: 'Half-height rounded `rectX` bars with the origin names drawn above them by a `text` mark; the y axis itself is hidden because its labels cannot be moved inside the plot.',
  needs: ['axis-custom'],
  prep: ['prep-aggregate'],
  gaps: [
    'The space-saving labels are a `text` mark, not axis labels with a negative `labelPadding`/`labelOffset`.',
    'No gridlines at the band boundaries (`bandPosition: 0`) and no axis title placed at the top left.',
    'Bars are centred in their band rather than offset 5 px down (`yOffset`), and `rx` rounds both ends (`cornerRadiusEnd` rounds only the far end).',
  ],
  recreation: { code: `const cars = await vegaData("cars.json");
const origins = ["Europe", "Japan", "USA"];
const data = origins.map((Origin) => ({ Origin, n: cars.filter((d) => d.Origin === Origin).length }));
mount(Elicit({
  width: 400, height: 3 * 50 + 34,
  margins: { top: 4, right: 12, bottom: 30, left: 6 },
  data,
  schema: {
    Origin: { type: "categorical", domain: [...origins].reverse() },
    n: { type: "quantitative", domain: [0, 260] },
  },
  axes: { x: { title: "Number of Cars" }, y: false },
  marks: [
    rectX({ rx: 2, fill: "#4c78a8",
      channels: { y: { field: "Origin" }, x: { field: "n" }, height: { value: 25 } } }),
    text({ fontSize: 11, textAnchor: "start", dx: 5, dy: -19,
      channels: { y: { field: "Origin" }, x: { value: 0 }, text: { field: "Origin" } } }),
  ],
}))` },
  interfaces: [
    {
      title: 'Share a fixed total',
      question: 'This dataset has 406 cars. If it were collected today, how many would come from each origin?',
      try: 'Drag a bar. The other two give way so the three always sum to 406.',
      why: '`maintainSum({ total: 406, strategy: "redistribute" })` repairs every proposal by spreading the difference over the other rows, so the total is an invariant rather than a target you have to hit.',
      uses: ['move()', 'maintainSum()'],
      code: `const origins = ["Europe", "Japan", "USA"];
mount(Elicit({
  width: 400, height: 3 * 50 + 34,
  margins: { top: 4, right: 12, bottom: 30, left: 6 },
  data: [ { Origin: "Europe", n: 135 }, { Origin: "Japan", n: 135 }, { Origin: "USA", n: 136 } ],
  schema: {
    Origin: { type: "categorical", domain: [...origins].reverse() },
    n: { type: "quantitative", domain: [0, 406] },
  },
  constraints: [
    clamp({ field: "n", min: 0 }),
    maintainSum({ field: "n", total: 406, strategy: "redistribute" }), //! the others absorb every change
  ],
  axes: { x: { title: "Number of Cars" }, y: false },
  marks: [
    rectX({ rx: 2, fill: "#4c78a8",
      channels: { y: { field: "Origin" }, x: { field: "n", edit: move() }, height: { value: 25 } } }), //! drag a bar's length
    text({ fontSize: 11, textAnchor: "start", dx: 5, dy: -19,
      channels: { y: { field: "Origin" }, x: { value: 0 },
                  text: { fn: (d) => d.Origin + ": " + Math.round(d.n) } } }),
  ],
}))`,
    },
  ],
});

// ------------------------------------------------------------------ vl-bar_heatlane
GALLERY.add({
  id: 'vl-bar_heatlane',
  status: 'partial',
  verdict: 'The two binning passes run in JS; each horsepower bin is a rounded `rect` spanning ±count/2, coloured by its binned count.',
  needs: ['color-scheme'],
  prep: ['prep-bin', 'prep-aggregate', 'prep-calculate'],
  gaps: [
    'Both `bin` transforms and the `joinaggregate` are JS.',
    'No `lighttealblue` scheme: the ordinal ramp is d3\'s `schemeBlues`, passed as a `range`.',
    'The pixel offsets (`xOffset`, `yOffset`) are approximated in data units.',
  ],
  recreation: { code: `const cars = await vegaData("cars.json");
const hp = cars.map((d) => d.Horsepower).filter((v) => v != null);
const step = 20, countStep = 20, inset = 1.4;   // inset: ~3px in y units
const data = d3.range(40, 240, step).map((lo) => {
  const count = hp.filter((v) => v >= lo && v < lo + step).length;
  const end = Math.ceil((count + 1) / countStep) * countStep;   // bin_count_end
  return { lo: lo + 1, hi: lo + step - 1, y: end / 2, y2: -end / 2,
           yIn: end / 2 - inset, y2In: -end / 2 + inset, level: String(end) };
});
const levels = d3.range(20, 140, 20).map(String);
mount(Elicit({
  width: 440, height: 210,
  title: "Heat Lane of Horsepower",
  margins: { top: 10, right: 12, bottom: 36, left: 12 },
  data,
  schema: {
    lo: { type: "quantitative", domain: [0, 240] },
    hi: { type: "quantitative", domain: [0, 240] },
    y: { type: "quantitative", domain: [-62, 62] },
    y2: { type: "quantitative", domain: [-62, 62] },
    yIn: { type: "quantitative", domain: [-62, 62] },
    y2In: { type: "quantitative", domain: [-62, 62] },
    level: { type: "ordinal", domain: levels },
  },
  axes: { x: { title: "Horsepower" }, y: false },
  legends: { fill: { title: "count" } },
  marks: [
    // layer 1: every lane in the colour of the largest bin (the max joinaggregate)
    rect({ rx: 3, fill: d3.schemeBlues[7][6],
      channels: { x1: { field: "lo" }, x2: { field: "hi" }, y1: { field: "y2" }, y2: { field: "y" } } }),
    // layer 2: inset 3px top and bottom, coloured by its own binned count
    rect({
      channels: { x1: { field: "lo" }, x2: { field: "hi" }, y1: { field: "y2In" }, y2: { field: "yIn" },
                  fill: { field: "level", scale: { range: d3.schemeBlues[7].slice(1) } } } }),
  ],
}))` },
interfaces: [
    {
      title: 'A mirrored brush',
      question: 'Among cars sold today, how common is each horsepower range? Make a lane wider where you expect more cars.',
      try: 'Drag the top or bottom edge of a lane; the opposite edge mirrors it.',
      why: '`brushSpan()` on `y1`/`y2` moves whichever edge you grab, and a `constraints.custom` rule copies that change to the other edge, so each lane stays symmetric about the centre line. The fill re-derives from the width.',
      uses: ['brushSpan()', 'constraints.custom()'],
      code: `const bins = d3.range(40, 240, 20);
// Keep each lane symmetric: whichever edge moved, mirror it onto the other.
const mirror = constraints.custom(({ data, oldData }) => data.map((d, i) => { //! one edge drives both
  const o = oldData[i];
  if (!o) return d;
  if (d.top !== o.top) return { ...d, bottom: -d.top };
  if (d.bottom !== o.bottom) return { ...d, top: -d.bottom };
  return d;
}));
mount(Elicit({
  width: 420, height: 200,
  margins: { top: 10, right: 12, bottom: 32, left: 12 },
  data: bins.map((lo) => ({ lo: lo + 1, hi: lo + 19, top: 15, bottom: -15 })),
  schema: {
    lo: { type: "quantitative", domain: [40, 240] },
    hi: { type: "quantitative", domain: [40, 240] },
    top: { type: "quantitative", domain: [-60, 60] },
    bottom: { type: "quantitative", domain: [-60, 60] },
  },
  constraints: [ clamp({ field: "top", min: 1, max: 60 }), clamp({ field: "bottom", min: -60, max: -1 }), mirror ],
  axes: { x: { title: "Horsepower" }, y: false },
  marks: [
    rect({ rx: 3,
      channels: {
        x1: { field: "lo" }, x2: { field: "hi" }, y1: { field: "bottom" }, y2: { field: "top" },
        fill: { fn: (d) => d3.interpolateBlues(0.2 + d.top / 75) },
      },
      edits: [ brushSpan({ channels: ["y1", "y2"], edgeInset: 8 }) ], //! grab an edge to widen the lane
    }),
  ],
}))`,
    },
  ],
});
