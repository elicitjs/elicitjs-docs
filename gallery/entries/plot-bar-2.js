// Observable Plot gallery — "Bar, Cell, Rect", second half: histograms, cell
// heatmaps, waffles, calendars, marimekko, grid maps. See AUTHORING.md.

// ------------------------------------------------------------------ histograms

GALLERY.add({
  id: 'plot-vertical-histogram',
  status: 'full',
  verdict: 'Weights binned in JavaScript and stacked by hand into `y1`/`y2`, then drawn as a `rect` per (bin, sex) — the same stacked histogram.',
  needs: [],
  prep: ['prep-bin', 'prep-stack'],
  gaps: [
    'Plot stacks `rectY` implicitly; here the stack offsets are computed before `Elicit` (`bar({ stack })` needs a band axis, and these bins are continuous).',
    'Bin thresholds use d3’s Scott rule, close to but not exactly Plot’s automatic thresholds.',
  ],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const bins = d3.bin().value((d) => d.weight).thresholds(d3.thresholdScott)(olympians);
// Stack male under female in each bin (Plot stacks in input order).
const rows = bins.flatMap((b) => {
  const m = b.filter((d) => d.sex === "male").length;
  const f = b.length - m;
  return [
    { x1: b.x0, x2: b.x1, y1: 0, y2: m, sex: "male" },
    { x1: b.x0, x2: b.x1, y1: m, y2: m + f, sex: "female" },
  ];
});
const top = d3.max(rows, (d) => d.y2);
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 34, right: 16, bottom: 40, left: 58 },
  axes: { x: { title: "weight →" }, y: { grid: true, title: "Frequency" } },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    x2: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    y1: { type: "quantitative", domain: [0, top] },
    y2: { type: "quantitative", domain: [0, top] },
    sex: { type: "categorical", domain: ["female", "male"] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y1: { field: "y1" }, y2: { field: "y2" },
        fill: { field: "sex", legend: { anchor: "top" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Split each bar',
      question: 'In each weight class, how many of the Olympic athletes are women?',
      try: 'Drag the boundary between the two colours up or down inside a bar.',
      why: 'The bar totals are the real counts. `edit.stack.edge()` moves the cut between two stacked segments, so one part grows exactly as much as the other shrinks: you answer the split, never the total.',
      uses: ['bar({ stack })', 'edit.stack.edge()'],
      code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const classes = ["<50", "50–60", "60–70", "70–80", "80–90", "90–100", "100+"];
const classOf = (w) => w < 50 ? classes[0] : w >= 100 ? classes[6] : classes[Math.floor(w / 10) - 4];
const totals = d3.rollup(olympians, (v) => v.length, (d) => classOf(d.weight));
// The real total per class, seeded as an even split.
const rows = classes.flatMap((c) => {
  const n = totals.get(c) || 0;
  return [
    { cls: c, sex: "female", n: Math.round(n / 2) },
    { cls: c, sex: "male", n: n - Math.round(n / 2) },
  ];
});
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 34, right: 16, bottom: 30, left: 48 },
  data: rows,
  schema: {
    cls: { type: "ordinal", domain: classes },
    sex: { type: "categorical", domain: ["female", "male"] },
    n: { type: "quantitative", domain: [0, d3.max(totals.values())] },
  },
  marks: [
    bar({
      stack: true, //! the encoding is the stack — one segment per sex
      channels: {
        x: { field: "cls" },
        y: { field: "n" },
        fill: { field: "sex", legend: { anchor: "top" } },
      },
      edits: [edit.stack.edge()], //! drag the cut; the bar total is preserved
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-overlapping-histogram',
  status: 'full',
  verdict: 'One `rectY` per (bin, sex), drawn from the baseline with no stacking; translucent fills stand in for the multiply blend.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [
    'Plot blends with `mixBlendMode: "multiply"`; ElicitJS has no blend mode, so `fillOpacity` shows the overlap instead.',
    'The notebook’s alternative versions (sort to avoid occlusion, interleaved insets) are not recreated.',
  ],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const thresholds = d3.ticks(...d3.extent(olympians, (d) => d.weight), 70);
const bin = d3.bin().value((d) => d.weight).thresholds(thresholds);
const rows = ["female", "male"].flatMap((sex) =>
  bin(olympians.filter((d) => d.sex === sex)).map((b) => ({ x1: b.x0, x2: b.x1, n: b.length, sex })));
const [lo, hi] = d3.extent(rows.flatMap((d) => [d.x1, d.x2]));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 34, right: 16, bottom: 40, left: 58 },
  axes: { x: { title: "weight →" }, y: { title: "Frequency" } },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [lo, hi] },
    x2: { type: "quantitative", domain: [lo, hi] },
    n: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.n)] },
    sex: { type: "categorical", domain: ["female", "male"] },
  },
  marks: [
    rectY({
      fillOpacity: 0.55,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "n" },
        fill: { field: "sex", legend: { anchor: "top" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sketch the men',
      question: 'Given how much the women weigh, sketch the weight distribution of the men.',
      try: 'Drag each orange bar up or down.',
      why: '`lock` keeps the women’s real counts fixed and ungrabbable, so the overlap is a reference you draw against. `move()` on `y` writes the men’s count per bin; `clamp` stops it below zero.',
      uses: ['lock', 'move()', 'clamp()'],
      code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const edges = d3.range(40, 131, 10);
const women = (x) => olympians.filter((d) => d.sex === "female" && d.weight >= x && d.weight < x + 10).length;
const rows = [
  ...edges.slice(0, -1).map((x) => ({ x1: x, x2: x + 10, n: women(x), sex: "female" })),
  ...edges.slice(0, -1).map((x) => ({ x1: x, x2: x + 10, n: 600, sex: "male" })), // flat prior
];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 34, right: 16, bottom: 30, left: 44 },
  data: rows,
  lock: (d) => d.sex === "female", //! the women are given, not elicited
  constraints: [clamp({ field: "n", min: 0 })],
  schema: {
    x1: { type: "quantitative", domain: [40, 130] },
    x2: { type: "quantitative", domain: [40, 130] },
    n: { type: "quantitative", domain: [0, 3000] },
    sex: { type: "categorical", domain: ["female", "male"] },
  },
  marks: [
    rectY({
      fillOpacity: 0.55,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "n", edit: move() }, //! drag a bar to set the men's count
        fill: { field: "sex", legend: { anchor: "top" } },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep a sport',
      question: 'What share of Olympic weightlifters falls in each weight bin? The grey bars are all athletes.',
      try: 'Drag across the chart from left to right; each bar follows the pointer as you pass it.',
      why: '`move({ pick: "sweep" })` retargets the bar in the column under the pointer on every drag event, so one stroke paints a whole distribution. Locked rows are skipped, so the grey reference bars never move.',
      uses: ['move({ pick: "sweep" })', 'lock'],
      code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const edges = d3.range(40, 150, 10);
const share = (x) => (100 * olympians.filter((d) => d.weight >= x && d.weight < x + 10).length) / olympians.length;
const rows = [
  ...edges.map((x) => ({ x1: x, x2: x + 10, pct: share(x), who: "all athletes" })),
  ...edges.map((x) => ({ x1: x, x2: x + 10, pct: 9, who: "weightlifters" })),
];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 34, right: 16, bottom: 30, left: 44 },
  data: rows,
  lock: (d) => d.who === "all athletes", //! the grey bars are given
  constraints: [clamp({ field: "pct", min: 0, max: 40 })],
  schema: {
    x1: { type: "quantitative", domain: [40, 150] },
    x2: { type: "quantitative", domain: [40, 150] },
    pct: { type: "quantitative", domain: [0, 40] },
    who: { type: "categorical", domain: ["all athletes", "weightlifters"] },
  },
  marks: [
    rectY({
      fillOpacity: 0.6,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "pct", edit: move({ pick: "sweep" }) }, //! one stroke paints every bin it crosses
        fill: { field: "who", scale: { range: ["#9ca3af", "#e4572e"] }, legend: { anchor: "top" } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-highlighted-bin',
  status: 'full',
  verdict: 'Bins computed in JavaScript, each flagged by whether it holds the named athlete; `rectY` colours by that flag.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: ['Plot evaluates the test as a bin reducer on `fill`; here the flag is a column computed before `Elicit`.'],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const bins = d3.bin().value((d) => d.weight).thresholds(d3.thresholdScott)(olympians);
const rows = bins.map((b) => ({
  x1: b.x0, x2: b.x1, n: b.length,
  hasAthlete: b.some((d) => d.name === "Aaron Brown") ? "true" : "false",
}));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 40, left: 58 },
  axes: { x: { title: "weight →" }, y: { grid: true, title: "Frequency" } },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    x2: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    n: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.n)] },
    hasAthlete: { type: "categorical", domain: ["false", "true"] },
  },
  marks: [
    rectY({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "n" },
        fill: { field: "hasAthlete", scale: { range: ["#bdbdbd", "#3f3f3f"] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Pick the bin',
      question: 'Which weight bin do you think the 100 m sprinter Aaron Brown falls in?',
      try: 'Click a bar to highlight it. Clicking another bar moves the highlight.',
      why: '`cycle()` on `fill` steps the bar’s `pick` column between the two declared values. A custom constraint repairs the proposal so only the clicked bar keeps `"yes"` — the one-answer rule lives with the data, not the mark.',
      uses: ['cycle()', 'constraints.custom'],
      code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const bins = d3.bin().value((d) => d.weight).domain([40, 130]).thresholds(d3.range(40, 130, 5))(
  olympians.filter((d) => d.weight >= 40 && d.weight < 130));
const rows = bins.map((b) => ({ x1: b.x0, x2: b.x1, n: b.length, pick: "no" }));
// One answer: whichever bar was just set to "yes" clears every other.
const oneAnswer = constraints.custom(({ data, activeIndex }) => //! a single pick across the dataset
  data.map((d, i) => (i === activeIndex ? d : { ...d, pick: "no" })), { field: "pick" });
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 44 },
  data: rows,
  constraints: [oneAnswer],
  schema: {
    x1: { type: "quantitative", domain: [40, 130] },
    x2: { type: "quantitative", domain: [40, 130] },
    n: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.n)] },
    pick: { type: "categorical", domain: ["no", "yes"] },
  },
  marks: [
    rectY({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "n" },
        fill: { field: "pick", scale: { range: ["#4e79a7", "#f28e2c"] }, edit: cycle() }, //! click steps no → yes
      },
    }),
  ],
}));`,
    },
    {
      title: 'Drop athletes',
      question: 'Place 20 Olympic marathon runners into the weight bins where you think they belong.',
      try: 'Click above a bin to drop a token; click a token to take it back.',
      why: 'A `dotStack` binds no magnitude: one row is one athlete, so the histogram is the count of rows per bin. `create()` mints a row at the clicked bin and `count({ max: 20 })` caps the budget.',
      uses: ['dotStack', 'create()', 'remove()', 'count()'],
      code: `const bins = ["40–45", "45–50", "50–55", "55–60", "60–65", "65–70", "70–75", "75–80", "80+"];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 16 },
  axes: { x: { title: "weight (kg)" }, y: false },
  data: [],
  schema: { bin: { type: "ordinal", domain: bins } },
  scales: { x: { type: "band" } },
  constraints: [count({ max: 20, strategy: "reject" })], //! a budget of 20 athletes
  marks: [
    dotStack({
      fill: "#4e79a7",
      label: true,
      channels: { x: { field: "bin" } },
      edits: [create({ gesture: "click", channels: ["x"] }), remove()], //! click to add, click a token to remove
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-prebinned-histogram',
  status: 'full',
  verdict: 'The notebook bins by hand with `d3.bin`; the bins go straight into `rectY` with `x1`/`x2` and a height.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [],
  recreation: {
    code: `const olympians = await plotData("olympians");
const bins = d3.bin().thresholds(80).value((d) => d.weight)(olympians.filter((d) => d.weight != null));
const rows = bins.map((b) => ({ x0: b.x0, x1: b.x1, length: b.length }));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 40, left: 58 },
  axes: { x: { title: "x0 →" }, y: { title: "length" } },
  data: rows,
  schema: {
    x0: { type: "quantitative", domain: [rows[0].x0, rows.at(-1).x1] },
    x1: { type: "quantitative", domain: [rows[0].x0, rows.at(-1).x1] },
    length: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.length)] },
  },
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white", strokeWidth: 0.5,
      channels: { x1: { field: "x0" }, x2: { field: "x1" }, y: { field: "length" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag bin heights',
      question: 'Out of 100 Olympic swimmers, how many fall in each 10 kg weight bin?',
      try: 'Drag a bar up or down. The counter shows how many swimmers you have left to place.',
      why: 'The bins are fixed `x1`/`x2` spans, so `move()` on `y` only sets heights. `maintainSum` with `strategy: "cap"` stops the total at 100 and `guides.remaining` reads the budget off it.',
      uses: ['move()', 'maintainSum()', 'snap()', 'guides.remaining'],
      code: `const edges = d3.range(40, 130, 10);
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 30, right: 16, bottom: 30, left: 44 },
  data: edges.slice(0, -1).map((x, i) => ({ x1: x, x2: edges[i + 1], n: 0 })),
  schema: {
    x1: { type: "quantitative", domain: [40, 120] },
    x2: { type: "quantitative", domain: [40, 120] },
    n: { type: "quantitative", domain: [0, 60] },
  },
  constraints: [
    clamp({ field: "n", min: 0 }),
    snap({ field: "n", step: 1 }),
    maintainSum({ field: "n", total: 100, strategy: "cap" }), //! no more than 100 swimmers
  ],
  guides: [guides.remaining({ field: "n", unit: "swimmer" })], //! the budget left to place
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white",
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "n", edit: move({ guide: true }) }, //! drag a bin's height
      },
    }),
  ],
}));`,
    },
    {
      title: 'Histogram widget',
      question: 'How heavy is a typical Olympic weightlifter?',
      try: 'Drag each bar to how many lifters out of 40 you think fall in it.',
      why: '`widgets.histogram` packages the same instrument — a `barY` with `move()` on `y` and a `clamp` — behind three options, so a survey can ask for a distribution in one line.',
      uses: ['widgets.histogram'],
      code: `mount(Elicit(widgets.histogram({ //! the packaged histogram instrument
  question: "Weight of an Olympic weightlifter (kg)",
  bins: ["<60", "60–70", "70–80", "80–90", "90–100", "100–110", "110+"],
  max: 20, //! the y domain each bar may reach
  width: 460, height: 300,
})));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-cumulative-histogram',
  status: 'full',
  verdict: 'A running count over the weight bins, computed in JavaScript, drawn with `rectY` — the notebook’s +1 (at or below a weight) setting.',
  needs: [],
  prep: ['prep-bin', 'prep-window'],
  gaps: ['The notebook’s radio input switches between −1 and +1; the recreation shows +1 only (the −1 version is the same chart with the running sum taken from the right).'],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const bins = d3.bin().value((d) => d.weight).thresholds(d3.thresholdScott)(olympians);
const counts = d3.cumsum(bins, (b) => b.length); // cumulative: +1
const rows = bins.map((b, i) => ({ x1: b.x0, x2: b.x1, n: counts[i] }));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 40, left: 66 },
  axes: { x: { title: "weight →" }, y: { grid: true, title: "Frequency" } },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [rows[0].x1, rows.at(-1).x2] },
    x2: { type: "quantitative", domain: [rows[0].x1, rows.at(-1).x2] },
    n: { type: "quantitative", domain: [0, olympians.length] },
  },
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white", strokeWidth: 0.5,
      channels: { x1: { field: "x1" }, x2: { field: "x2" }, y: { field: "n" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep the curve',
      question: 'What share of Olympic athletes weigh less than each weight?',
      try: 'Drag across the chart; the bars follow the pointer and can never step down.',
      why: 'A cumulative share can only rise, so `monotonic` along `x1` repairs every proposal into a non-decreasing staircase. `move({ pick: "sweep" })` on the bars lets one stroke set every bar it passes.',
      uses: ['move({ pick: "sweep" })', 'monotonic()', 'clamp()'],
      code: `const edges = d3.range(40, 135, 5);
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 44 },
  axes: { y: { grid: true, tickFormat: (d) => d + "%" } },
  data: edges.slice(0, -1).map((x, i) => ({ x1: x, x2: x + 5, pct: (100 * (i + 1)) / (edges.length - 1) })),
  schema: {
    x1: { type: "quantitative", domain: [40, 130] },
    x2: { type: "quantitative", domain: [40, 130] },
    pct: { type: "quantitative", domain: [0, 100] },
  },
  constraints: [
    clamp({ field: "pct", min: 0, max: 100 }),
    monotonic({ field: "pct", along: "x1", dir: "increasing" }), //! a cumulative share never falls
  ],
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white",
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "pct", edit: move({ pick: "sweep" }) }, //! paint the staircase in one stroke
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-percentogram',
  status: 'full',
  verdict: 'Percentile thresholds, the density 1/(x2−x1) and the percentile index are computed in JavaScript; `rectY` draws one variable-width bar per percentile, coloured by its decile.',
  needs: [],
  prep: ['prep-bin', 'prep-calculate'],
  gaps: [
    'Plot quantizes the bar index into 10 colours with a `quantize` scale and draws a quantize legend with ticks; here the decile is computed first and the legend shows ten swatches.',
  ],
  recreation: {
    code: `const random = d3.randomNormal.source(d3.randomLcg(3))();
const numbers = d3.sort(Float64Array.from({ length: 10000 }, random));
const q = d3.range(0, 101).map((p) => d3.quantileSorted(numbers, p / 100));
const deciles = d3.range(10).map((k) => k * 10 + "–" + (k + 1) * 10);
const rows = d3.range(100).map((i) => ({
  x1: q[i], x2: q[i + 1],
  density: 1 / (q[i + 1] - q[i]),
  decile: deciles[Math.floor(i / 10)],
}));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 44 },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [q[0], q[100]] },
    x2: { type: "quantitative", domain: [q[0], q[100]] },
    density: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.density)] },
    decile: { type: "ordinal", domain: deciles },
  },
  marks: [
    rectY({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "density" },
        fill: { field: "decile", scale: { scheme: "spectral" }, legend: { anchor: "right", title: "percentile" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Move the deciles',
      question: 'Each bar holds 10% of draws from a standard normal. Where do you think the decile edges fall?',
      try: 'Drag a bar sideways, or grab one of its edges. The heights follow, because each bar must keep the same area.',
      why: '`brushSpan` moves a bar’s `x1`/`x2`; a custom constraint copies each edge onto the neighbouring bar so the bins stay contiguous. The same constraint recomputes each height as 0.1 ÷ width, so a narrow bin grows tall — the percentogram’s whole idea.',
      uses: ['brushSpan()', 'constraints.custom'],
      code: `const edges = d3.range(-2.5, 2.51, 0.5);
// Keep neighbours touching, and every bin at least 0.1 wide (so no taller than 1).
const contiguous = constraints.custom(({ data, oldData, activeIndex }) => { //! edges are shared by neighbours
  const a = activeIndex;
  if (a == null) return data;
  const next = data.map((d) => ({ ...d }));
  if (a > 0) next[a - 1].x2 = next[a].x1;
  if (a < next.length - 1) next[a + 1].x1 = next[a].x2;
  if (!next.every((d) => d.x2 - d.x1 >= 0.1)) return false;
  // Every bin holds 10%, so its height is 0.1 ÷ its width.
  return next.map((d) => ({ ...d, density: 0.1 / (d.x2 - d.x1) })); //! equal area, so width sets height
}, { field: ["x1", "x2"] });
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 44 },
  data: d3.range(10).map((i) => ({ x1: edges[i], x2: edges[i + 1], density: 0.2, decile: i })),
  schema: {
    x1: { type: "quantitative", domain: [-3, 3] },
    x2: { type: "quantitative", domain: [-3, 3] },
    density: { type: "quantitative", domain: [0, 1] },
    decile: { type: "ordinal", domain: d3.range(10) },
  },
  constraints: [contiguous],
  marks: [
    rectY({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "density" },
        fill: { field: "decile", scale: { scheme: "spectral" } },
      },
      edits: [brushSpan({ channels: ["x1", "x2"], edgeInset: 6 })], //! drag a bin, or one of its edges
    }),
  ],
}));`,
    },
    {
      title: 'Share out 100%',
      question: 'What share of draws from a standard normal falls in each half-unit bin?',
      try: 'Drag the bars. You have exactly 100% to share out.',
      why: 'The total is the invariant, so `maintainSum` with `strategy: "redistribute"` takes whatever one bar gains from the others. You only ever say how the mass is shaped, never how much there is.',
      uses: ['move()', 'maintainSum()', 'guides.rule'],
      code: `const edges = d3.range(-3, 3.01, 0.5);
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 44 },
  axes: { y: { tickFormat: (d) => d + "%" } },
  data: edges.slice(0, -1).map((x, i) => ({ x1: x, x2: edges[i + 1], pct: 100 / 12 })),
  schema: {
    x1: { type: "quantitative", domain: [-3, 3] },
    x2: { type: "quantitative", domain: [-3, 3] },
    pct: { type: "quantitative", domain: [0, 40] },
  },
  constraints: [
    clamp({ field: "pct", min: 0 }),
    maintainSum({ field: "pct", total: 100, strategy: "redistribute" }), //! the shares always add to 100%
  ],
  guides: [guides.rule({ y: 100 / 12, label: "uniform" })],
  marks: [
    rectY({
      fill: "#5e4fa2", stroke: "white",
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "pct", edit: move() }, //! drag a bin's share
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-cumulative-distribution-of-poverty',
  status: 'full',
  verdict: 'Countries sorted by poverty share and stacked along x by population in JavaScript; each is a `rect` from 0 up to its share, so area is people in poverty.',
  needs: [],
  prep: ['prep-calculate', 'prep-stack'],
  gaps: [
    'Plot stacks along x with `stackX` (order and reverse); here `x1`/`x2` are a running sum computed first.',
  ],
  recreation: {
    code: `const pov = (await plotData("plot-cumulative-distribution-of-poverty", "povcalnet.csv"))
  .filter((d) => ["N", "A"].includes(d.CoverageType));
const sorted = d3.sort(pov, (d) => -d.HeadCount);
let x = 0;
const rows = sorted.map((d) => ({
  country: d.CountryName,
  x1: x, x2: (x += d.ReqYearPopulation),
  share: d.HeadCount,
}));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 34, left: 48 },
  axes: {
    x: { title: "Population (millions) →" },
    y: { title: "% under $30 a day", tickFormat: (d) => Math.round(d * 100) },
  },
  data: rows,
  schema: {
    country: { type: "categorical" },
    x1: { type: "quantitative", domain: [0, x] },
    x2: { type: "quantitative", domain: [0, x] },
    share: { type: "quantitative", domain: [0, 1] },
  },
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white", strokeWidth: 0.2,
      tip: (d) => [d.country, (d.share * 100).toFixed(1) + "%"], // Plot's title channel
      channels: { x1: { field: "x1" }, x2: { field: "x2" }, y: { field: "share" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Raise each region',
      question: 'What share of each region’s population lives on less than $30 a day?',
      try: 'Drag the top of each block (SAS = South Asia, EAP = East Asia & Pacific, SSA = Sub-Saharan Africa, …). The headcount above updates as you go.',
      why: 'Widths are fixed populations, so `move()` on `y` sets only the share — and the AREA is people in poverty. A `guides.custom` text reads the live rows and turns your answer into a headcount, the number the chart is really about.',
      uses: ['move()', 'guides.custom', 'clamp()'],
      code: `// Rough 2015 populations (millions) by World Bank region code.
const regions = [["SAS", 1750], ["EAP", 2280], ["SSA", 1000], ["LAC", 630], ["MNA", 420], ["ECA", 900], ["NAC", 360]];
let x = 0;
const rows = regions.map(([name, pop]) => ({ name, x1: x, x2: (x += pop), mid: x - pop / 2, share: 0.5 }));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 28, right: 16, bottom: 34, left: 44 },
  axes: { x: { title: "Population (millions) →" }, y: { tickFormat: (d) => Math.round(d * 100) + "%" } },
  data: rows,
  schema: {
    name: { type: "categorical", domain: regions.map((r) => r[0]) },
    x1: { type: "quantitative", domain: [0, x] },
    x2: { type: "quantitative", domain: [0, x] },
    mid: { type: "quantitative", domain: [0, x] },
    share: { type: "quantitative", domain: [0, 1] },
  },
  constraints: [clamp({ field: "share", min: 0, max: 1 })],
  guides: [
    guides.custom(({ data, width }) => [{ //! derive the headcount from your answer
      type: "text", x: width, y: -10, textAnchor: "end", fontSize: 12,
      text: "≈ " + (d3.sum(data, (d) => (d.x2 - d.x1) * d.share) / 1000).toFixed(2) + " billion people",
    }]),
  ],
  marks: [
    rectY({
      fill: "#4e79a7", stroke: "white",
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "share", edit: move() }, //! drag a block's share; its area is people
      },
    }),
    text({
      fontSize: 9, fill: "#475569",
      channels: { x: { field: "mid" }, y: { datum: 0.97 }, text: { field: "name" } },
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ cell heatmaps

GALLERY.add({
  id: 'plot-impact-of-vaccines',
  status: 'full',
  verdict: 'One `rect` per (state, year): `x1`/`x2` span the year, the state is a band, and a sqrt PuRd ramp colours the cases; a rule marks the vaccine’s introduction.',
  needs: [],
  prep: ['prep-reshape'],
  gaps: [
    'The notebook’s disease picker is an Observable input; the recreation shows measles.',
    'The colour scale is a d3 scale handed to the channel (`scale: d3.scaleSequentialSqrt(…)`): `scheme: "purd"` names the colours, but a sequential colour scale is linear, and this one is a square root.',
    'The vaccine label sits at the top of the rule rather than below the frame.',
  ],
  recreation: {
    code: `const raw = await plotData("plot-impact-of-vaccines", "vaccines.json");
const states = ["Alaska", "Ala.", "Ark.", "Ariz.", "Calif.", "Colo.", "Conn.", "D.C.", "Del.", "Fla.", "Ga.", "Hawaii", "Iowa", "Idaho", "Ill.", "Ind.", "Kan.", "Ky.", "La.", "Mass.", "Md.", "Maine", "Mich.", "Minn.", "Mo.", "Miss.", "Mont.", "N.C.", "N.D.", "Neb.", "N.H.", "N.J.", "N.M", "Nev.", "N.Y.", "Ohio", "Okla.", "Ore.", "Pa.", "R.I.", "S.C.", "S.D.", "Tenn.", "Texas", "Utah", "Va.", "Vt.", "Wash.", "Wis.", "W.Va.", "Wyo."];
const disease = raw.find((d) => d.title === "Measles");
const rows = disease.data.values.data
  .filter(([, , cases]) => cases != null)
  .map(([year, s, cases]) => ({ year, next: year + 1, state: states[s], cases }));
const years = d3.extent(rows.flatMap((d) => [d.year, d.next]));
mount(Elicit({
  width: 480, height: 640,
  margins: { top: 70, right: 10, bottom: 10, left: 46 },
  axes: { x: { anchor: "top", tickFormat: (d) => String(d) } },
  data: rows,
  schema: {
    year: { type: "quantitative", domain: years },
    next: { type: "quantitative", domain: years },
    state: { type: "ordinal", domain: d3.sort(states) },
    cases: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.cases)] },
  },
  guides: [guides.rule({ x: 1963, label: "1963 vaccine introduced", stroke: "black", strokeDash: "none" })],
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      tip: (d) => [d.state + ", " + d.year, d.cases.toFixed(1) + " cases per 100,000"],
      channels: {
        x1: { field: "year" }, x2: { field: "next" },
        y: { field: "state", scale: { padding: 0, reverse: true } }, // first state at the top
        fill: {
          field: "cases",
          scale: d3.scaleSequentialSqrt(d3.interpolatePuRd).domain([0, d3.max(rows, (d) => d.cases)]),
          legend: { anchor: "top", title: "Cases per 100,000 people" },
        },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the vaccine',
      question: 'Looking at measles cases by state, in which year do you think the vaccine was introduced?',
      try: 'Drag the black line to the year you think the vaccine arrived.',
      why: 'The observed cases are context rows, so the heatmap draws them, shows a tip on hover, and never edits or reports them. They fill their own columns (`start`, `end`, `s`, `cases`). Your answer is one row, `{ year }`, and `move()` on a `ruleX` writes it; `snap` lands it on whole years.',
      uses: ['ruleX', 'move()', 'snap()', 'context', 'tip'],
      code: `const raw = await plotData("plot-impact-of-vaccines", "vaccines.json");
const measles = raw.find((d) => d.title === "Measles").data.values.data
  .filter((d) => d[2] != null)
  .map(([year, s, cases]) => ({ start: year, end: year + 1, s, cases }));
mount(Elicit({
  width: 480, height: 420,
  margins: { top: 26, right: 10, bottom: 10, left: 10 },
  axes: { x: { anchor: "top", tickFormat: (d) => String(d) }, y: false },
  schema: {
    year: { type: "quantitative", domain: [1928, 2003] },
    start: { type: "quantitative" }, end: { type: "quantitative" },
    s: { type: "ordinal", domain: d3.range(51) }, cases: { type: "quantitative" },
  },
  data: [...measles, { year: 1940 }],
  context: (d) => d.cases != null, //! the heatmap is context: drawn, read-only, never reported
  constraints: [snap({ field: "year", step: 1 })],
  marks: [
    rect({
      tip: (d) => d.start + ": " + d.cases.toFixed(1) + " cases per 100,000",
      channels: {
        x1: { field: "start" }, x2: { field: "end" },
        y: { field: "s", scale: { padding: 0 } },
        fill: { field: "cases", scale: d3.scaleSequentialSqrt(d3.interpolatePuRd).domain([0, d3.max(measles, (d) => d.cases)]) },
      },
    }),
    ruleX({
      stroke: "black", strokeWidth: 3,
      channels: { x: { field: "year", edit: move() } }, //! drag the line to your year
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-seattle-temperature-heatmap',
  status: 'full',
  verdict: 'Daily highs grouped by (month, day of month) and reduced to their maximum in JavaScript; a `rect` per cell on two band axes, coloured by temperature.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Plot’s month axis formats month numbers; here the months are categories named directly.'],
  recreation: {
    code: `const seattle = await plotData("plot-seattle-temperature-heatmap", "seattle-weather.csv");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const rows = d3.flatRollup(seattle, (v) => d3.max(v, (d) => d.temp_max),
  (d) => d.date.getUTCMonth(), (d) => d.date.getUTCDate())
  .map(([m, day, temp]) => ({ month: months[m], day, temp }));
mount(Elicit({
  width: 480, height: 250,
  margins: { top: 10, right: 10, bottom: 30, left: 36 },
  data: rows,
  schema: {
    month: { type: "ordinal", domain: months },
    day: { type: "ordinal", domain: d3.range(1, 32) },
    temp: { type: "quantitative", domain: d3.extent(rows, (d) => d.temp) },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x: { field: "day", scale: { padding: 0 } },
        y: { field: "month", scale: { padding: 0, reverse: true } },
        fill: { field: "temp", scale: { scheme: "turbo" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Step the bands',
      question: 'How warm do Seattle’s daily highs get in each part of the year?',
      try: 'Click a cell to step it to the next temperature band.',
      why: 'The temperature is declared `ordinal`, so the ramp is ordered and `cycle()` on `fill` steps a cell through the bands in that order. A click writes a category — there is no pixel to invert in a colour.',
      uses: ['cycle()', 'ordinal fill'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parts = ["early", "mid", "late"];
const bands = ["< 5 °C", "5–10 °C", "10–15 °C", "15–20 °C", "20–25 °C", "> 25 °C"];
mount(Elicit({
  width: 480, height: 230,
  margins: { top: 10, right: 90, bottom: 30, left: 44 },
  data: months.flatMap((month) => parts.map((part) => ({ month, part, band: "10–15 °C" }))),
  schema: {
    month: { type: "ordinal", domain: months },
    part: { type: "ordinal", domain: parts },
    band: { type: "ordinal", domain: bands }, //! an ordered vocabulary of answers
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 1,
      channels: {
        x: { field: "month", scale: { padding: 0 } },
        y: { field: "part", scale: { padding: 0, reverse: true } },
        fill: {
          field: "band", scale: { scheme: "turbo" }, legend: { anchor: "right", title: "daily high" },
          edit: cycle(), //! click steps to the next band
        },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Paint the heat',
      question: 'On which days of the year do you think Seattle has topped 30 °C?',
      try: 'Drag across the grid to paint days. Hold Alt and drag to erase.',
      why: 'An `edit.custom` with `pick: "sweep"` over both `x` and `y` re-resolves the cell nearest the pointer on every drag event, so a stroke paints a region. Two copies split by `when` paint and erase.',
      uses: ['edit.custom', 'pick: "sweep"', 'when.alt'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const paint = (hot) => edit.custom((ctx) => ({ ...ctx.datum, hot }), { //! write one cell's answer
  pick: "sweep", channels: ["x", "y"], //! a 2-D sweep: the nearest cell, every drag event
  when: hot === "yes" ? when.noAlt : when.alt,
});
mount(Elicit({
  width: 480, height: 250,
  margins: { top: 10, right: 10, bottom: 30, left: 36 },
  data: months.flatMap((month) => d3.range(1, 32).map((day) => ({ month, day, hot: "no" }))),
  schema: {
    month: { type: "ordinal", domain: months },
    day: { type: "ordinal", domain: d3.range(1, 32) },
    hot: { type: "categorical", domain: ["no", "yes"] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x: { field: "day", scale: { padding: 0 } },
        y: { field: "month", scale: { padding: 0, reverse: true } },
        fill: { field: "hot", scale: { range: ["#e5e7eb", "#d7301f"] } },
      },
      edits: [paint("yes"), paint("no")],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-sorted-heatmap',
  status: 'full',
  verdict: 'Median vehicles per (location, hour) computed in JavaScript, locations sorted by their busiest hour; a `rect` per cell on two band axes.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Plot sorts the y domain with `sort: { y: "fill" }`; here the sorted location list is computed and declared as the domain.'],
  recreation: {
    code: `const traffic = await plotData("plot-sorted-heatmap", "traffic.csv");
const rows = d3.flatRollup(traffic, (v) => d3.median(v, (d) => d.vehicles),
  (d) => d.location, (d) => new Date(d.date).getUTCHours())
  .map(([location, hour, vehicles]) => ({ location, hour, vehicles }));
// Sort locations by their busiest hour, as sort: { y: "fill" } does.
const peak = d3.rollup(rows, (v) => d3.max(v, (d) => d.vehicles), (d) => d.location);
const locations = d3.sort(peak.keys(), (l) => peak.get(l));
mount(Elicit({
  width: 480, height: 520,
  margins: { top: 50, right: 10, bottom: 30, left: 120 },
  data: rows,
  schema: {
    location: { type: "categorical", domain: locations },
    hour: { type: "ordinal", domain: d3.range(24) },
    vehicles: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.vehicles)] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x: { field: "hour", scale: { padding: 0 } },
        y: { field: "location", scale: { padding: 0, reverse: true } },
        fill: {
          field: "vehicles", legend: { anchor: "top" },
          scale: { scheme: "turbo" },
        },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Mark rush hour',
      question: 'At which hours of a weekday does the A1 at Köln-Nord carry its heaviest traffic?',
      try: 'Click an hour to mark it; click it again to unmark. You may mark up to six.',
      why: 'The dataset starts empty. `toggle()` mints a row for the clicked hour, or drops the row already there, so the answer is the set of rows; `count({ max: 6 })` caps it.',
      uses: ['toggle()', 'count()'],
      code: `mount(Elicit({
  width: 480, height: 130,
  margins: { top: 16, right: 10, bottom: 30, left: 10 },
  axes: { x: { title: "hour of day" }, y: false },
  data: [],
  schema: { hour: { type: "ordinal", domain: d3.range(24) } },
  constraints: [count({ max: 6, strategy: "reject" })], //! at most six hours
  marks: [
    rect({
      fill: "#e8590c", stroke: "white",
      channels: { x: { field: "hour", scale: { padding: 0.05 } } },
      edits: [toggle({ channels: ["x"] })], //! click an hour in, click it out
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-simpsons-ratings',
  status: 'full',
  verdict: 'A `rect` per episode on a season × episode band grid, coloured by IMDb rating on a PiYG ramp, with a `text` mark repeating the rating.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Three episodes with no rating are dropped rather than left blank.'],
  recreation: {
    code: `const simpsons = (await plotData("plot-simpsons-ratings", "simpsons.csv"))
  .filter((d) => d.imdb_rating != null)
  .map(({ season, number_in_season, imdb_rating, title }) => ({ season, number_in_season, imdb_rating, title }));
const channels = {
  x: { field: "season", scale: { padding: 0 } },
  y: { field: "number_in_season", scale: { padding: 0, reverse: true } },
};
mount(Elicit({
  width: 480, height: 480,
  margins: { top: 44, right: 6, bottom: 6, left: 62 },
  axes: { x: { anchor: "top", title: "Season" } },
  data: simpsons,
  schema: {
    season: { type: "ordinal", domain: d3.range(1, 29) },
    number_in_season: { type: "ordinal", domain: d3.range(1, 26) },
    imdb_rating: { type: "quantitative", domain: d3.extent(simpsons, (d) => d.imdb_rating) },
    title: { type: "categorical" },
  },
  // Unbound, so it reads whichever mark is under the pointer: the cell or its label.
  guides: [guides.tip({ text: (d) => [d.title, "S" + d.season + " E" + d.number_in_season + " · " + d.imdb_rating.toFixed(1)] })],
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      channels: { ...channels, fill: { field: "imdb_rating", scale: { scheme: "piyg" } } },
    }),
    text({
      fontSize: 6.5, fill: "black",
      channels: { ...channels, text: { fn: (d) => d.imdb_rating.toFixed(1) } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rate season 9',
      question: 'Seasons 6–8 are filled in. What IMDb rating do you think each episode of season 9 got?',
      try: 'Click a season-9 cell, then drag the handle on the colour ramp below to its rating.',
      why: 'A colour has no position to drag, so the ramp does the inverting: `select()` makes the clicked cell the target row and `edit.legend.value()` writes the value under the ramp handle into it. `lock` keeps the given seasons out of reach, and the label is a `text` mark over the same rows, so it re-reads what you set.',
      uses: ['select()', 'edit.legend.value()', 'lock', 'text'],
      code: `const all = (await plotData("plot-simpsons-ratings", "simpsons.csv")).filter((d) => d.imdb_rating != null);
const given = all.filter((d) => d.season >= 6 && d.season <= 8)
  .map(({ season, number_in_season, imdb_rating }) => ({ season, number_in_season, imdb_rating }));
const nine = d3.range(1, 26).map((n) => ({ season: 9, number_in_season: n, imdb_rating: 7.5 }));
const channels = {
  x: { field: "season", scale: { padding: 0 } },
  y: { field: "number_in_season", scale: { padding: 0, reverse: true } },
};
mount(Elicit({
  width: 300, height: 520,
  margins: { top: 44, right: 10, bottom: 6, left: 62 },
  axes: { x: { anchor: "top", title: "Season" } },
  data: [...given, ...nine],
  lock: (d) => d.season < 9, //! the earlier seasons are given
  schema: {
    season: { type: "ordinal", domain: [6, 7, 8, 9] },
    number_in_season: { type: "ordinal", domain: d3.range(1, 26) },
    imdb_rating: { type: "quantitative", domain: [4, 10] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      edits: [select()], //! click a cell to make it the target
      channels: { ...channels, fill: { field: "imdb_rating", scale: { scheme: "piyg" } } },
    }),
    text({
      fontSize: 8, fill: "black",
      channels: { ...channels, text: { fn: (d) => d.imdb_rating.toFixed(1) } },
    }),
    legendColor({ anchor: "bottom", title: "IMDb rating", edit: edit.legend.value() }), //! the ramp handle writes the selected cell
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-fil-correlation-heatmap',
  status: 'full',
  verdict: 'The correlation matrix of the cars dataset’s numeric columns is computed in JavaScript; a `rect` per pair on a diverging RdYlBu ramp pivoting at 0, with a `text` mark whose ink flips on dark cells.',
  needs: [],
  prep: ['prep-aggregate', 'prep-reshape'],
  gaps: ['The notebook’s dataset picker and field checkboxes are Observable inputs; the recreation shows cars with every numeric field.'],
  recreation: {
    code: `const cars = await plotData("cars");
const fields = d3.sort(Object.keys(cars[0]).filter((c) => cars.some((d) => typeof d[c] === "number")));
// Pearson correlation, exactly as the notebook computes it.
function corr(x, y) {
  const x_ = d3.mean(x), y_ = d3.mean(y);
  const XY = d3.sum(x, (_, i) => (x[i] - x_) * (y[i] - y_));
  const XX = d3.sum(x, (d) => (d - x_) ** 2);
  const YY = d3.sum(y, (d) => (d - y_) ** 2);
  return XY / Math.sqrt(XX * YY);
}
const rows = d3.cross(fields, fields).map(([a, b]) => {
  const correlation = corr(cars.map((d) => d[a]), cars.map((d) => d[b]));
  return { a, b, correlation, ink: Math.abs(correlation) > 0.6 ? "white" : "black" };
});
const channels = { x: { field: "a", scale: { padding: 0 } }, y: { field: "b", scale: { padding: 0, reverse: true } } };
mount(Elicit({
  width: 480, height: 400,
  margins: { top: 50, right: 10, bottom: 30, left: 100 },
  axes: { x: { fontSize: 8 }, y: { fontSize: 9 } },
  data: rows,
  schema: {
    a: { type: "categorical", domain: fields },
    b: { type: "categorical", domain: fields },
    correlation: { type: "quantitative", domain: [-1, 1] },
    ink: { type: "categorical", domain: ["black", "white"] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 2,
      channels: {
        ...channels,
        fill: { field: "correlation", scale: { type: "diverging", scheme: "rdylbu" },
                legend: { anchor: "top", title: "correlation" } },
      },
    }),
    text({
      fontSize: 10,
      channels: { ...channels, text: { fn: (d) => d.correlation.toFixed(2) }, fill: { field: "ink", scale: null } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Guess the matrix',
      question: 'How strongly do you think the penguins’ body measurements correlate with each other?',
      try: 'Click a cell to step it through the strengths. Its mirror cell follows.',
      why: 'The answer is an ordered vocabulary from strong negative to strong positive, so `cycle()` on `fill` steps it and the diverging scheme colours it. A custom constraint copies each answer onto its mirror cell, because r(a, b) = r(b, a) is a fact about the data; `lock` keeps the diagonal fixed.',
      uses: ['cycle()', 'constraints.custom', 'lock'],
      code: `const fields = ["bill length", "bill depth", "flipper", "body mass"];
const strengths = ["strong −", "weak −", "none", "weak +", "strong +"];
const rows = d3.cross(fields, fields).map(([a, b]) => ({ a, b, r: a === b ? "strong +" : "none" }));
// r(a, b) is r(b, a): mirror whatever was just set.
const mirror = constraints.custom(({ data, activeIndex }) => { //! the matrix stays symmetric
  if (activeIndex == null) return data;
  const { a, b, r } = data[activeIndex];
  return data.map((d) => (d.a === b && d.b === a ? { ...d, r } : d));
}, { field: "r" });
const channels = { x: { field: "a", scale: { padding: 0 } }, y: { field: "b", scale: { padding: 0, reverse: true } } };
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 16, right: 96, bottom: 30, left: 80 },
  data: rows,
  lock: (d) => d.a === d.b, //! the diagonal is always perfectly correlated
  constraints: [mirror],
  schema: {
    a: { type: "categorical", domain: fields },
    b: { type: "categorical", domain: fields },
    r: { type: "ordinal", domain: strengths },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 2,
      channels: {
        ...channels,
        fill: {
          field: "r", scale: { scheme: "rdylbu" }, legend: { anchor: "right", title: "correlation" },
          edit: cycle(), //! click steps the strength
        },
      },
    }),
    text({ fontSize: 10, channels: { ...channels, text: { field: "r" } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-auto-mark-heatmap',
  status: 'full',
  verdict: 'Plot’s `auto` mark picks a binned rect heatmap; here both axes are binned in JavaScript and drawn as a `rect` per 2-D bin, coloured by count.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: [
    'There is no `auto` mark: the mark choice (a binned `rect`) is made by hand.',
    'Thresholds use d3’s Scott rule on each axis, close to Plot’s automatic thresholds.',
  ],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null && d.height != null);
const edges = (f) => { const b = d3.bin().value(f).thresholds(d3.thresholdScott)(olympians); return [b[0].x0, ...b.map((d) => d.x1)]; };
const xe = edges((d) => d.weight), ye = edges((d) => d.height);
const rows = d3.flatRollup(olympians, (v) => v.length,
  (d) => d3.bisectRight(xe, d.weight) - 1, (d) => d3.bisectRight(ye, d.height) - 1)
  .map(([i, j, count]) => ({ x1: xe[i], x2: xe[i + 1], y1: ye[j], y2: ye[j + 1], count }));
mount(Elicit({
  width: 460, height: 380,
  margins: { top: 16, right: 16, bottom: 30, left: 40 },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: d3.extent(xe) }, x2: { type: "quantitative", domain: d3.extent(xe) },
    y1: { type: "quantitative", domain: d3.extent(ye) }, y2: { type: "quantitative", domain: d3.extent(ye) },
    count: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.count)] },
  },
  marks: [
    rect({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" }, y1: { field: "y1" }, y2: { field: "y2" },
        fill: { field: "count", scale: { scheme: "turbo" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Box the swimmers',
      question: 'The heatmap shows every Olympic athlete. Where do you think half of the swimmers fall in weight and height?',
      try: 'Drag the box to move it; drag an edge or a corner to resize it.',
      why: 'The athletes are context rows that fill their own columns (`w1`, `w2`, `h1`, `h2`, `n`), drawn by their own `rect` and never reported; your answer is one row of four extents. `brushRect()` gives its `rect` body, edge and corner handles, each writing the extents it touches.',
      uses: ['brushRect()', 'context'],
      code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null && d.height != null);
const xe = d3.range(30, 172, 4), ye = d3.range(1.3, 2.25, 0.04);
const cells = d3.flatRollup(olympians, (v) => v.length,
  (d) => d3.bisectRight(xe, d.weight) - 1, (d) => d3.bisectRight(ye, d.height) - 1)
  .filter(([i, j]) => i >= 0 && j >= 0 && xe[i] + 4 <= 170 && ye[j] + 0.04 <= 2.2 + 1e-9)
  .map(([i, j, n]) => ({ w1: xe[i], w2: xe[i] + 4, h1: ye[j], h2: ye[j] + 0.04, n }));
const extent = (lo, hi) => ({ type: "quantitative", domain: [lo, hi] });
mount(Elicit({
  width: 460, height: 380,
  margins: { top: 16, right: 16, bottom: 30, left: 40 },
  schema: {
    x1: extent(30, 170), x2: extent(30, 170), y1: extent(1.3, 2.2), y2: extent(1.3, 2.2),
    w1: extent(30, 170), w2: extent(30, 170), h1: extent(1.3, 2.2), h2: extent(1.3, 2.2),
    n: { type: "quantitative" },
  },
  data: [...cells, { x1: 60, x2: 80, y1: 1.7, y2: 1.85 }],
  context: (d) => d.n != null, //! every athlete: drawn, read-only, never reported
  marks: [
    rect({
      channels: {
        x1: { field: "w1" }, x2: { field: "w2" }, y1: { field: "h1" }, y2: { field: "h2" },
        fill: { field: "n", scale: d3.scaleSequential(d3.interpolateGreys).domain([0, d3.max(cells, (d) => d.n) * 1.4]) },
      },
    }),
    rect({
      fill: "#2563eb", fillOpacity: 0.25, stroke: "#1d4ed8", strokeWidth: 2,
      channels: { x1: { field: "x1" }, x2: { field: "x2" }, y1: { field: "y1" }, y2: { field: "y2" } },
      edits: [brushRect({ edgeInset: 10 })], //! move the body, resize by edges and corners
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-auto-mark-heatmap-2',
  status: 'full',
  verdict: 'Weights binned in JavaScript per sex; a `rect` per (bin, sex) with the sex as a band, coloured by count.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: ['There is no `auto` mark: the binned `rect` is chosen by hand.'],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const bins = d3.bin().value((d) => d.weight).thresholds(d3.thresholdScott)(olympians);
const rows = bins.flatMap((b) => ["female", "male"].map((sex) =>
  ({ x1: b.x0, x2: b.x1, sex, count: b.filter((d) => d.sex === sex).length })))
  .filter((d) => d.count > 0); // empty bins draw nothing, as in Plot
mount(Elicit({
  width: 460, height: 160,
  margins: { top: 10, right: 16, bottom: 30, left: 50 },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    x2: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    sex: { type: "categorical", domain: ["female", "male"] },
    count: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.count)] },
  },
  marks: [
    rect({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" },
        y: { field: "sex", scale: { padding: 0.05, reverse: true } },
        fill: { field: "count", scale: { scheme: "turbo" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Span the middle',
      question: 'For each sex, which weight range do you think holds the middle half of Olympic athletes?',
      try: 'Drag a bar sideways, or drag one of its ends.',
      why: 'Each row is one band of the heatmap with two extents. `brushSpan()` on `x1`/`x2` moves the whole span from its body and either end from an edge; `ordering` keeps the lower end below the upper.',
      uses: ['brushSpan()', 'ordering()'],
      code: `mount(Elicit({
  width: 460, height: 160,
  margins: { top: 10, right: 16, bottom: 30, left: 50 },
  data: [
    { sex: "female", lo: 60, hi: 80 },
    { sex: "male", lo: 60, hi: 80 },
  ],
  schema: {
    sex: { type: "categorical", domain: ["female", "male"] },
    lo: { type: "quantitative", domain: [30, 140] },
    hi: { type: "quantitative", domain: [30, 140] },
  },
  constraints: [ordering({ field: ["lo", "hi"] })], //! the lower bound stays below the upper
  marks: [
    rect({
      fill: "#f59e0b", fillOpacity: 0.8,
      channels: {
        x1: { field: "lo" }, x2: { field: "hi" },
        y: { field: "sex", scale: { padding: 0.05 } },
      },
      edits: [brushSpan({ channels: ["x1", "x2"], edgeInset: 8 })], //! body moves the span, ends resize it
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-continuous-dimensions-heatmap',
  status: 'full',
  verdict: 'Carat and price binned into 100 thresholds each in JavaScript; a `rect` per non-empty 2-D bin on a symlog BuPu ramp.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: ['The colour scale is a d3 scale handed to the channel: `scheme: "bupu"` names the colours, but a sequential colour scale is linear, and this one is symlog.'],
  recreation: {
    code: `const diamonds = await plotData("diamonds");
const xe = d3.ticks(...d3.extent(diamonds, (d) => d.carat), 100);
const ye = d3.ticks(...d3.extent(diamonds, (d) => d.price), 100);
const dx = xe[1] - xe[0], dy = ye[1] - ye[0];
const rows = d3.flatRollup(diamonds, (v) => v.length,
  (d) => Math.floor(d.carat / dx), (d) => Math.floor(d.price / dy))
  .map(([i, j, count]) => ({ x1: i * dx, x2: (i + 1) * dx, y1: j * dy, y2: (j + 1) * dy, count }));
const X = [d3.min(rows, (d) => d.x1), d3.max(rows, (d) => d.x2)];
const Y = [d3.min(rows, (d) => d.y1), d3.max(rows, (d) => d.y2)];
mount(Elicit({
  width: 460, height: 460,
  margins: { top: 16, right: 16, bottom: 30, left: 48 },
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: X }, x2: { type: "quantitative", domain: X },
    y1: { type: "quantitative", domain: Y }, y2: { type: "quantitative", domain: Y },
    count: { type: "quantitative", domain: [0, d3.max(rows, (d) => d.count)] },
  },
  marks: [
    rect({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" }, y1: { field: "y1" }, y2: { field: "y2" },
        fill: { field: "count", scale: d3.scaleSequentialSymlog(d3.interpolateBuPu).domain([0, d3.max(rows, (d) => d.count)]) },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Claim the cells',
      question: 'Where on a carat × price grid do you think most diamonds sell? Pick up to eight cells.',
      try: 'Click a cell to claim it; click it again to give it back.',
      why: '`toggle()` over BOTH `x` and `y` treats a (carat, price) pair as one slot: a click mints a row there, a second click drops it. `count` turns the picks into a budget of eight, so the reader has to choose. The empty grid is context rows with their own columns: drawn, but never part of the answer.',
      uses: ['toggle()', 'count()', 'context'],
      code: `const carats = ["0–0.5", "0.5–1", "1–1.5", "1.5–2", "2–2.5", "2.5+"];
const prices = ["< $1k", "$1–2.5k", "$2.5–5k", "$5–7.5k", "$7.5–10k", "$10–15k", "> $15k"];
// The grid fills its own columns, so a click never lands on a grid row.
const cells = d3.cross(carats, prices).map(([gridCarat, gridPrice]) => ({ gridCarat, gridPrice }));
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 16, right: 16, bottom: 40, left: 72 },
  axes: { x: { title: "carat" }, y: { title: "price" } },
  schema: {
    carat: { type: "ordinal", domain: carats }, gridCarat: { type: "ordinal", domain: carats },
    price: { type: "ordinal", domain: prices }, gridPrice: { type: "ordinal", domain: prices },
  },
  data: cells,
  context: true, //! the empty grid is context, never reported
  // count() also counts the grid's rows, so allow eight more.
  constraints: [count({ max: cells.length + 8, strategy: "reject" })], //! eight cells to spend
  marks: [
    rect({
      fill: "#f1f5f9", stroke: "white", strokeWidth: 2,
      channels: { x: { field: "gridCarat", scale: { padding: 0 } }, y: { field: "gridPrice", scale: { padding: 0 } } },
    }),
    rect({
      fill: "#8c6bb1", stroke: "white", strokeWidth: 2,
      channels: { x: { field: "carat", scale: { padding: 0 } }, y: { field: "price", scale: { padding: 0 } } },
      edits: [toggle({ channels: ["x", "y"] })], //! a (carat, price) cell is one slot
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ waffles

GALLERY.add({
  id: 'plot-stacked-waffles',
  status: 'partial',
  verdict: 'Each (weight class, sex) count is a `waffleY` block of 10-athlete cells on a count axis, with the class on x and the sex on `xOffset`; the diverging layout (women up, men down) is not drawn.',
  needs: ['stack-offset'],
  prep: ['prep-aggregate', 'prep-bin'],
  gaps: [
    'Plot stacks women above zero and men below it; a waffle here only grows up from a baseline and does not stack, so the two sexes sit side by side in each class.',
    'Plot facets by weight class (`fx`); here the class is the x band and `xOffset` nests the sexes inside it.',
  ],
  recreation: {
    code: `const olympians = (await plotData("olympians")).filter((d) => d.weight != null);
const classes = d3.range(30, 180, 10).filter((w) => olympians.some((d) => Math.floor(d.weight / 10) * 10 === w));
const rows = d3.flatRollup(olympians, (v) => v.length, (d) => Math.floor(d.weight / 10) * 10, (d) => d.sex)
  .map(([w, sex, n]) => ({ w, sex, n }));
mount(Elicit({
  width: 480, height: 320,
  margins: { top: 34, right: 10, bottom: 30, left: 40 },
  data: rows,
  schema: {
    w: { type: "ordinal", domain: classes },
    sex: { type: "categorical", domain: ["female", "male"] },
    n: { type: "quantitative", domain: [0, Math.ceil(d3.max(rows, (d) => d.n) / 10) * 10] }, // whole cells
  },
  axes: { count: true },
  marks: [
    waffleY({
      unit: 10, // one cell is ten athletes
      gap: 0.5, showEmpty: false,
      channels: {
        x: { field: "w", scale: { padding: 0.08 } },
        xOffset: { field: "sex" }, //! a block per sex inside each weight class
        count: { field: "n" },
        fill: { field: "sex", legend: { anchor: "top" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill to a share',
      question: 'Out of 100 Olympic athletes in each weight class, how many do you think won a medal?',
      try: 'Drag up a waffle to fill it, or click a cell to fill up to it.',
      why: '`edit.waffle.fill()` maps the pointer to the exact cell under it and fills up to and including it, so the answer is a whole number of athletes you can count. The mark-level copy with `gesture: "click"` makes a single tap set it too.',
      uses: ['waffleY', 'edit.waffle.fill()'],
      code: `const classes = ["< 60 kg", "60–70", "70–80", "80–90", "90–100", "100+ kg"];
mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 10, bottom: 30, left: 10 },
  data: classes.map((cls) => ({ cls, medals: 10 })),
  schema: {
    cls: { type: "ordinal", domain: classes },
    medals: { type: "quantitative", domain: [0, 100] }, //! 100 cells: one per athlete
  },
  marks: [
    waffleY({
      unit: 1, fill: "#c2a83e", emptyFill: "#e5e7eb",
      channels: {
        x: { field: "cls" },
        count: { field: "medals", edit: edit.waffle.fill() }, //! drag to fill cell by cell
      },
      edits: [edit.waffle.fill({ channels: ["count"], gesture: "click" })], //! a tap sets it too
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-survey-waffle',
  status: 'full',
  verdict: 'One `waffleY` of 120 circular cells per question, filled to the number who said yes, with the empty cells as the faint background and two `text` marks for the percentage and the question.',
  needs: [],
  prep: [],
  gaps: [
    'Plot draws a separate background waffle of 120 cells; here the waffle’s own empty cells (`emptyFill`) are that background.',
    'Plot facets by question (`fx`); here the questions are bands of one x axis, which draws the same row of waffles.',
  ],
  recreation: {
    code: `const survey = [
  { question: "don’t go out after dark", yes: 96 },
  { question: "do no activities other than school", yes: 89 },
  { question: "engage in political discussion and social movements, including online", yes: 10 },
  { question: "would like to do activities but are prevented by safety concerns", yes: 73 },
];
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 10, right: 10, bottom: 92, left: 10 },
  title: "Subdued",
  subtitle: "Of 120 surveyed Syrian teenagers:",
  axes: false,
  data: survey,
  schema: {
    question: { type: "categorical", domain: d3.sort(survey.map((d) => d.question)) },
    yes: { type: "quantitative", domain: [0, 120] },
  },
  marks: [
    waffleY({
      unit: 1, shape: "circle", gap: 1,
      fill: "orange", emptyFill: "#d9d9d9",
      channels: { x: { field: "question", scale: { padding: 0.15 } }, count: { field: "yes" } },
    }),
    text({
      fontSize: 22, fill: "orange",
      channels: { x: { field: "question" }, y: { value: 204 }, text: { fn: (d) => Math.round((d.yes / 120) * 100) + "%" } },
    }),
    text({
      fontSize: 10, wrap: 100, lineHeight: 12, fill: "#333",
      channels: { x: { field: "question" }, y: { value: 248 }, text: { field: "question" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Count the yes',
      question: 'Of 120 surveyed Syrian teenagers, how many do you think said each of these?',
      try: 'Drag up a waffle, or click a circle, to set how many said yes. The percentage follows.',
      why: 'Each circle is one teenager, so `edit.waffle.fill()` writes a count you can check by eye. The percentage is a `text` mark over the same rows with a `{ fn }` channel, so it re-derives from your answer on every render.',
      uses: ['waffleY', 'edit.waffle.fill()', '{ fn } channel'],
      code: `const questions = [
  "don’t go out after dark",
  "do no activities other than school",
  "engage in political discussion and social movements, including online",
  "would like to do activities but are prevented by safety concerns",
];
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 16, right: 10, bottom: 92, left: 10 },
  axes: false,
  data: questions.map((question) => ({ question, yes: 60 })),
  schema: {
    question: { type: "categorical", domain: questions },
    yes: { type: "quantitative", domain: [0, 120] }, //! 120 teenagers, one circle each
  },
  marks: [
    waffleY({
      unit: 1, shape: "circle", gap: 1, fill: "orange", emptyFill: "#d9d9d9",
      channels: {
        x: { field: "question", scale: { padding: 0.15 } },
        count: { field: "yes", edit: edit.waffle.fill() }, //! drag to fill
      },
      edits: [edit.waffle.fill({ channels: ["count"], gesture: "click" })], //! or click a circle
    }),
    text({
      fontSize: 22, fill: "orange",
      channels: { x: { field: "question" }, y: { value: 234 }, text: { fn: (d) => Math.round((d.yes / 120) * 100) + "%" } },
    }),
    text({
      fontSize: 10, wrap: 100, lineHeight: 12, fill: "#333",
      channels: { x: { field: "question" }, y: { value: 278 }, text: { field: "question" } },
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ calendars

GALLERY.add({
  id: 'plot-calendar',
  status: 'partial',
  verdict: 'Cells per trading day on a week × weekday grid coloured by the daily change, with month labels and month dividers drawn by a `guides.custom` layer. Faceting is not covered by this study, so the year facets are emulated with one band per (year, weekday), and only the last three years are shown.',
  needs: ['facet'],
  prep: ['prep-window', 'prep-calculate'],
  gaps: [
    'There is no `fy` facet: each year’s five weekday rows (plus a label row) are bands of one y scale, so years are stacked by hand.',
    'Only 2018–2020 are drawn; the original draws all 21 years at 160 px each.',
    'The custom `MonthLine` mark and the month, weekday and year labels are a `guides.custom` layer computed from the scales.',
    'The day-of-month numbers are left out: at 480 px wide a week column is 8 px, too narrow for them.',
  ],
  recreation: {
    code: `const dji = await plotData("plot-calendar", "^DJI.csv");
const change = dji.map((d, i) => ({ date: d.Date, pct: i ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : null }))
  .filter((d) => d.pct != null && d.date.getUTCFullYear() >= 2018);
const week = (d) => d3.utcWeek.count(d3.utcYear(d), d);
const years = [2020, 2019, 2018]; // latest on top, like fy: { reverse: true }
const row = (y, day) => y + ":" + day;
const rowsDomain = years.flatMap((y) => [row(y, "label"), ...[1, 2, 3, 4, 5].map((k) => row(y, k))]);
const rows = change.map((d) => ({ week: week(d.date), row: row(d.date.getUTCFullYear(), d.date.getUTCDay()), pct: d.pct * 100 }));
const end = d3.utcDay.offset(change.at(-1).date);
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 46, right: 4, bottom: 4, left: 54 },
  axes: false,
  data: rows,
  schema: {
    week: { type: "ordinal", domain: d3.range(53) },
    row: { type: "ordinal", domain: rowsDomain },
    pct: { type: "quantitative", domain: [-6, 6] },
  },
  guides: [guides.custom(({ scales }) => {
    const X = scales.x, Y = scales.y, bw = X.bandwidth(), bh = Y.bandwidth();
    const left = (w) => X.encode(w) - bw / 2, top = (r) => Y.encode(r) - bh / 2;
    const out = [];
    for (const y of years) {
      out.push({ type: "text", x: -50, y: Y.encode(row(y, "label")) + 3, text: String(y), fontSize: 10, fontWeight: "bold" });
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((n, i) => out.push({ type: "text", x: -24, y: Y.encode(row(y, i + 1)) + 3, text: n, fontSize: 8 }));
      for (const m of d3.utcMonths(new Date(Date.UTC(y, 0, 1)), d3.min([end, new Date(Date.UTC(y + 1, 0, 1))]))) {
        const mon = d3.utcMonday.ceil(m);
        out.push({ type: "text", x: left(week(mon)), y: Y.encode(row(y, "label")) + 3, text: d3.utcFormat("%b")(m), fontSize: 8 });
        // The month divider: a step along the first week of the month.
        const first = d3.utcDay.offset(m, m.getUTCDay() === 0 ? 1 : m.getUTCDay() === 6 ? 2 : 0);
        const w = week(first), k = first.getUTCDay(), bottom = top(row(y, 5)) + bh;
        const points = k === 1 ? [[left(w), top(row(y, 1))], [left(w), bottom]]
          : [[left(w + 1), top(row(y, 1))], [left(w + 1), top(row(y, k))], [left(w), top(row(y, k))], [left(w), bottom]];
        out.push({ type: "path", points, stroke: "white", strokeWidth: 3, fill: "none" });
      }
    }
    return out;
  })],
  marks: [
    rect({
      stroke: "white", strokeWidth: 1,
      channels: {
        x: { field: "week", scale: { padding: 0 } },
        y: { field: "row", scale: { padding: 0, reverse: true } },
        fill: {
          field: "pct", legend: { anchor: "top", title: "Daily change (%)" },
          scale: { type: "diverging", scheme: "piyg", clamp: true },
        },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Mark the crash days',
      question: 'On which trading days of March 2020 do you think the Dow fell by more than 5%?',
      try: 'Click a day to mark it; click it again to clear it.',
      why: 'The month’s days are context rows with their own columns, drawn with their dates but never reported, so the answer starts empty. `toggle()` over `x` (week) and `y` (weekday) treats each day as a slot: a click mints a row there or drops the one already there, so the answer is exactly the set of days you marked.',
      uses: ['toggle()', 'context'],
      code: `const days = d3.utcDays(new Date(Date.UTC(2020, 2, 1)), new Date(Date.UTC(2020, 3, 1)))
  .filter((d) => d.getUTCDay() > 0 && d.getUTCDay() < 6);
const week = (d) => d3.utcWeek.count(d3.utcYear(d), d);
const weeks = [...new Set(days.map(week))];
const names = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const weekday = { type: "ordinal", domain: [1, 2, 3, 4, 5] };
// The month's days fill their own columns, so a click never lands on one of them.
const cell = (x, y) => ({ x: { field: x, scale: { padding: 0 } }, y: { field: y, scale: { padding: 0, reverse: true } } });
mount(Elicit({
  width: 420, height: 300,
  margins: { top: 16, right: 10, bottom: 10, left: 40 },
  axes: { x: false, y: { tickFormat: (k) => names[k - 1] } },
  schema: {
    week: { type: "ordinal", domain: weeks }, day: weekday,
    dayWeek: { type: "ordinal", domain: weeks }, weekday, date: { type: "quantitative" },
  },
  data: days.map((d) => ({ dayWeek: week(d), weekday: d.getUTCDay(), date: d.getUTCDate() })),
  context: true, //! the month is drawn, not elicited
  marks: [
    rect({ fill: "#f1f5f9", stroke: "white", strokeWidth: 2, channels: cell("dayWeek", "weekday") }),
    rect({
      fill: "#c51b7d", stroke: "white", strokeWidth: 2,
      channels: cell("week", "day"),
      edits: [toggle({ channels: ["x", "y"] })], //! a (week, weekday) cell is one slot
    }),
    text({ fontSize: 12, channels: { ...cell("dayWeek", "weekday"), text: { field: "date" } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dow-jones-calendar',
  status: 'partial',
  verdict: 'A `rect` per trading day on a week × weekday grid, coloured by daily change on a PiYG ramp, with the daily change as a tip. Faceting is not covered by this study, so the year facets are emulated with one band per (year, weekday).',
  needs: ['facet'],
  prep: ['prep-window', 'prep-calculate'],
  gaps: [
    'There is no `fy` facet: each year is five bands of one y scale plus a spacer, and the year labels are drawn by a `guides.custom` layer.',
    'The year and weekday labels are guide text rather than facet and axis ticks.',
  ],
  recreation: {
    code: `const dji = await plotData("plot-dow-jones-calendar", "dji.csv");
const years = d3.range(2000, 2021);
const row = (y, k) => y + ":" + k;
const rows = dji.slice(1).map((d, i) => ({
  date: d.Date,
  week: d3.utcWeek.count(d3.utcYear(d.Date), d.Date),
  row: row(d.Date.getUTCFullYear(), d.Date.getUTCDay()),
  change: (d.Close - dji[i].Close) / dji[i].Close,
}));
mount(Elicit({
  width: 480, height: 760,
  margins: { top: 46, right: 4, bottom: 4, left: 34 },
  axes: false,
  data: rows,
  schema: {
    date: { type: "temporal" },
    week: { type: "ordinal", domain: d3.range(54) },
    row: { type: "ordinal", domain: years.flatMap((y) => [1, 2, 3, 4, 5, "gap"].map((k) => row(y, k))) },
    change: { type: "quantitative", domain: [-0.06, 0.06] },
  },
  guides: [guides.custom(({ scales }) => years.flatMap((y) => [
    { type: "text", x: -32, y: scales.y.encode(row(y, 3)) + 3, text: String(y), fontSize: 9 },
    ...["M", "T", "W", "T", "F"].map((l, k) => ({ type: "text", x: -6, y: scales.y.encode(row(y, k + 1)) + 2, text: l, fontSize: 5.5, textAnchor: "end" })),
  ]))],
  marks: [
    rect({
      stroke: "white", strokeWidth: 0.5,
      tip: (d) => [d3.utcFormat("%a %-d %b %Y")(d.date), d3.format("+.1%")(d.change)], // Plot's title channel
      channels: {
        x: { field: "week", scale: { padding: 0 } },
        y: { field: "row", scale: { padding: 0, reverse: true } },
        fill: {
          field: "change", legend: { anchor: "top", title: "Daily change", ticks: 3, tickFormat: (v) => d3.format("+.0%")(v) },
          scale: { type: "diverging", scheme: "piyg", clamp: true },
        },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Span the slide',
      question: 'In 2008, which stretch of weeks do you think was the Dow’s steepest fall?',
      try: 'Drag the band sideways, or drag either end to widen or narrow it.',
      why: 'The calendar is context rows with their own columns, drawn behind the question and never reported, and your answer is one row: a start and an end week. `brushSpan()` on `x1`/`x2` moves the band from its body and either end from an edge, and `ordering` keeps the start before the end.',
      uses: ['brushSpan()', 'ordering()', 'context'],
      code: `const days = d3.utcDays(new Date(Date.UTC(2008, 0, 1)), new Date(Date.UTC(2009, 0, 1)))
  .filter((d) => d.getUTCDay() > 0 && d.getUTCDay() < 6);
const week = (d) => d3.utcWeek.count(d3.utcYear(d), d);
mount(Elicit({
  width: 480, height: 150,
  margins: { top: 10, right: 10, bottom: 30, left: 10 },
  axes: { x: { title: "week of 2008" }, y: false },
  schema: {
    start: { type: "quantitative", domain: [0, 53] }, end: { type: "quantitative", domain: [0, 53] },
    // The calendar's days fill their own columns.
    w1: { type: "quantitative", domain: [0, 53] }, w2: { type: "quantitative", domain: [0, 53] },
    day: { type: "ordinal", domain: [1, 2, 3, 4, 5] },
  },
  data: [
    ...days.map((d) => ({ w1: week(d), w2: week(d) + 1, day: d.getUTCDay() })),
    { start: 20, end: 30 },
  ],
  context: (d) => d.day != null, //! the year's calendar: drawn, read-only, never reported
  constraints: [ordering({ field: ["start", "end"] })], //! a stretch starts before it ends
  marks: [
    rect({
      fill: "#e2e8f0", stroke: "white",
      channels: { x1: { field: "w1" }, x2: { field: "w2" }, y: { field: "day", scale: { padding: 0 } } },
    }),
    rect({
      fill: "#c51b7d", fillOpacity: 0.45, stroke: "#c51b7d", strokeWidth: 2,
      channels: { x1: { field: "start" }, x2: { field: "end" } },
      edits: [brushSpan({ channels: ["x1", "x2"], edgeInset: 8 })], //! body moves the span, ends resize it
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ rects in space

GALLERY.add({
  id: 'plot-lebron-james-shots',
  status: 'full',
  verdict: 'Made shots binned into 5 × 5 cells (court units are tenths of a foot) in JavaScript, drawn as a `rect` per cell on a log YlGnBu ramp; the court markings are a `guides.custom` layer, just as the original draws them with a custom mark.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate', 'prep-calculate'],
  gaps: [
    'The log YlGnBu scale is a d3 scale handed to the channel, since `ylgnbu` is not one of ElicitJS’s named schemes.',
    'The faint 5-unit grid lines are omitted, and the log legend labels linear tick values rather than powers of ten.',
  ],
  recreation: {
    code: `const shots = (await plotData("plot-lebron-james-shots", "lebron_shots.csv")).filter((d) => +d.shot_made_flag);
const rows = d3.flatRollup(shots, (v) => v.length, (d) => Math.floor(d.loc_x / 5) * 5, (d) => Math.floor(d.loc_y / 5) * 5)
  .map(([x, y, count]) => ({ x1: x, x2: x + 5, y1: y, y2: y + 5, count }));
// The court, in tenths of a foot, as line segments, circles and arcs.
function court({ scales }) {
  const X = scales.x.encode, Y = scales.y.encode, k = Math.abs(X(1) - X(0));
  const ink = { stroke: "currentColor", strokeWidth: 1, fill: "none" };
  const lines = [[-250, 420, 250, 420], [-250, 450, -250, -50], [250, 450, 250, -50], [250, -50, -250, -50],
    [-220, -50, -220, 90], [220, -50, 220, 90], [-80, -50, -80, 140], [80, -50, 80, 140], [-60, -50, -60, 140],
    [60, -50, 60, 140], [-80, 140, 80, 140], [-30, -10, 30, -10], [0, -10, 0, -7.5], [-40, -10, -40, 0], [40, -10, 40, 0]];
  const circles = [[0, 0, 7.5], [0, 140, 60], [0, 420, 20], [0, 420, 60]];
  const corner = Math.atan(90 / 220);
  const arcs = [[40, 0, Math.PI], [237.5, corner, Math.PI - corner]];
  return [
    ...lines.map(([x1, y1, x2, y2]) => ({ type: "line", x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), ...ink })),
    ...circles.map(([cx, cy, r]) => ({ type: "circle", cx: X(cx), cy: Y(cy), r: r * k, ...ink })),
    ...arcs.map(([r, a0, a1]) => ({ type: "path", ...ink,
      points: d3.range(a0, a1 + 1e-9, (a1 - a0) / 48).map((a) => [X(r * Math.cos(a)), Y(r * Math.sin(a))]) })),
  ];
}
mount(Elicit({
  width: 440, height: 480,
  margins: { top: 40, right: 6, bottom: 6, left: 6 },
  axes: false,
  data: rows,
  schema: {
    x1: { type: "quantitative", domain: [-250, 250] }, x2: { type: "quantitative", domain: [-250, 250] },
    y1: { type: "quantitative", domain: [-50, 450] }, y2: { type: "quantitative", domain: [-50, 450] },
    count: { type: "quantitative", domain: [1, d3.max(rows, (d) => d.count)] },
  },
  guides: [guides.custom(court)],
  marks: [
    rect({
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" }, y1: { field: "y1" }, y2: { field: "y2" },
        fill: {
          field: "count", legend: { anchor: "top", title: "Made shots" },
          scale: d3.scaleSequentialLog(d3.interpolateYlGnBu).domain([1, d3.max(rows, (d) => d.count)]),
        },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drop his makes',
      question: 'Where on the half court do you think LeBron James makes most of his shots? Place 15 made shots.',
      try: 'Click on the court to drop a made shot; click a shot to take it back.',
      why: '`create()` inverts the click through both court scales into a new `{ x, y }` row, so each dot is a shot location in court units. `count({ max: 15 })` makes them a budget, and the court is a guide, so it can never be dragged.',
      uses: ['create()', 'remove()', 'count()', 'guides.custom'],
      code: `const X0 = [-250, 250], Y0 = [-50, 300];
function court({ scales }) {
  const X = scales.x.encode, Y = scales.y.encode, k = Math.abs(X(1) - X(0));
  const ink = { stroke: "#64748b", strokeWidth: 1, fill: "none" };
  const lines = [[-220, -50, -220, 90], [220, -50, 220, 90], [-80, -50, -80, 140], [80, -50, 80, 140],
    [-80, 140, 80, 140], [-30, -10, 30, -10], [-250, -50, 250, -50]];
  const corner = Math.atan(90 / 220);
  return [
    ...lines.map(([x1, y1, x2, y2]) => ({ type: "line", x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), ...ink })),
    { type: "circle", cx: X(0), cy: Y(0), r: 7.5 * k, ...ink },
    { type: "circle", cx: X(0), cy: Y(140), r: 60 * k, ...ink },
    { type: "path", ...ink, points: d3.range(corner, Math.PI - corner + 1e-9, (Math.PI - 2 * corner) / 48)
      .map((a) => [X(237.5 * Math.cos(a)), Y(237.5 * Math.sin(a))]) },
  ];
}
mount(Elicit({
  width: 440, height: 330,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: [],
  schema: { x: { type: "quantitative", domain: X0 }, y: { type: "quantitative", domain: Y0 } },
  constraints: [count({ max: 15, strategy: "reject" })], //! fifteen made shots to place
  guides: [guides.custom(court)], //! the court is context, not data
  marks: [
    point({
      size: 6, fill: "#225ea8", fillOpacity: 0.75, stroke: "white",
      channels: { x: { field: "x" }, y: { field: "y" } },
      edits: [create(), remove()], //! click the court to add, click a shot to remove
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-marimekko',
  status: 'full',
  verdict: 'The double stack — markets across by their share of all sales, segments up by their share of each market — is computed in JavaScript and drawn as one `rect` per (market, segment); `text` labels each cell and a `guides.custom` layer labels the edges.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: [
    'Plot applies its stack transform twice inside a custom transform; here the expanded `x1`/`x2`/`y1`/`y2` are computed before `Elicit`.',
    'The edge labels (segments on the right, markets on top) come from a `guides.custom` layer rather than `selectMaxX`/`selectMaxY` text marks.',
  ],
  recreation: {
    code: `const sales = await plotData("plot-marimekko", "sales.csv");
const markets = [...new Set(sales.map((d) => d.market))];
const segments = [...new Set(sales.map((d) => d.segment))];
const byMarket = d3.rollup(sales, (v) => d3.sum(v, (d) => d.value), (d) => d.market);
const total = d3.sum(byMarket.values());
// Stack markets along x, then segments along y within each market (both expanded to 0–1).
let x = 0;
const rows = markets.flatMap((m) => {
  const x1 = x, x2 = (x += byMarket.get(m) / total);
  let y = 0;
  return sales.filter((d) => d.market === m).map((d) => {
    const y1 = y, y2 = (y += d.value / byMarket.get(m));
    return { market: m, segment: d.segment, value: d.value, x1, x2, y1, y2, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 };
  });
});
const pct = (d) => (d === 1 ? "100%" : String(Math.round(d * 100)));
mount(Elicit({
  width: 480, height: 400,
  margins: { top: 30, right: 26, bottom: 26, left: 34 },
  axes: { x: { ticks: 10, tickFormat: pct }, y: { ticks: 10, tickFormat: pct } },
  data: rows,
  schema: {
    market: { type: "categorical", domain: markets }, segment: { type: "categorical", domain: segments },
    value: { type: "quantitative" },
    x1: { type: "quantitative", domain: [0, 1] }, x2: { type: "quantitative", domain: [0, 1] },
    y1: { type: "quantitative", domain: [0, 1] }, y2: { type: "quantitative", domain: [0, 1] },
    cx: { type: "quantitative", domain: [0, 1] }, cy: { type: "quantitative", domain: [0, 1] },
  },
  guides: [guides.custom(({ scales, width, height }) => [
    { type: "path", points: [[0, 0], [width, 0], [width, height], [0, height], [0, 0]], stroke: "currentColor", fill: "none" },
    ...rows.filter((d) => d.market === markets.at(-1)).map((d) => ({ // segments, on the right
      type: "text", x: width + 8, y: scales.y.encode(d.cy), text: d.segment, fontSize: 8, textAnchor: "middle", angle: -90,
    })),
    ...rows.filter((d) => d.segment === segments.at(-1)).map((d) => ({ // markets, on top
      type: "text", x: scales.x.encode(d.cx), y: -6, text: d.market, fontSize: 8, textAnchor: "middle",
    })),
  ])],
  marks: [
    rect({
      fillOpacity: 0.5, stroke: "white",
      channels: {
        x1: { field: "x1" }, x2: { field: "x2" }, y1: { field: "y1" }, y2: { field: "y2" },
        fill: { field: "segment" },
      },
    }),
    text({
      fontSize: 7, lineHeight: 8,
      channels: {
        x: { field: "cx" }, y: { field: "cy" },
        text: { fn: (d) => [d.value.toLocaleString("en"), d.segment, d.market].join("\\n") },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Cut each market',
      question: 'Each market starts as one segment. How do you think its sales split among the segments that buy there?',
      try: 'Click a bar to cut a new segment off it, drag a boundary to resize, and click a boundary to merge.',
      why: 'A stacked `bar` is one total divided among rows, so the stack edits are the vocabulary: `edit.stack.cut()` mints the next unused segment from the closed `segment` domain, `edit.stack.edge()` moves a boundary and `edit.stack.merge()` removes one. Each keeps the market at 100%.',
      uses: ['bar({ stack })', 'edit.stack.cut()', 'edit.stack.edge()', 'edit.stack.merge()'],
      code: `const markets = ["Auburn, AL", "Birmingham, AL", "Gainesville, FL", "Durham, NC"];
const segments = ["Almond lovers", "Berry buyers", "Carrots-n-more", "Delicious-n-new"];
mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 30, left: 40 },
  axes: { x: { fontSize: 8 }, y: { tickFormat: (d) => d + "%" } },
  data: markets.map((market) => ({ market, segment: "Almond lovers", share: 100 })),
  schema: {
    market: { type: "categorical", domain: markets },
    segment: { type: "categorical", domain: segments }, //! a closed vocabulary: the cut hands out the next one
    share: { type: "quantitative", domain: [0, 100] },
  },
  marks: [
    bar({
      stack: true, fillOpacity: 0.7,
      channels: {
        x: { field: "market" },
        y: { field: "share" },
        fill: { field: "segment", legend: { anchor: "right", title: false } },
      },
      edits: [edit.stack.cut(), edit.stack.edge(), edit.stack.merge()], //! cut, resize and merge, keeping 100%
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-observable-plot-grid-choropleth',
  status: 'full',
  verdict: 'States joined to their grid positions in JavaScript; a `rect` per state on two band axes coloured by 2019 ÷ 2010 population on a diverging-log PiYG scale, with two `text` marks for the abbreviation and the change.',
  needs: [],
  prep: ['prep-lookup', 'prep-calculate'],
  gaps: ['The diverging-log scale is a d3 scale handed to the channel (`d3.scaleDivergingLog`), since ElicitJS’s `diverging` type is linear.'],
  recreation: {
    code: `const gridmap = await plotData("observable-plot-grid-choropleth", "grid.csv");
const population = await plotData("observable-plot-grid-choropleth", "population.csv");
const byName = new Map(gridmap.map((d) => [d.name, d]));
const states = population.filter((d) => byName.has(d.State)).map((d) => {
  const g = byName.get(d.State);
  return { x: g.x, y: g.y, key: g.key, change: d["2019"] / d["2010"] };
});
const m = d3.max(states, (d) => Math.max(d.change, 1 / d.change)); // symmetric about 1 in log space
const channels = { x: { field: "x", scale: { padding: 0 } }, y: { field: "y", scale: { padding: 0, reverse: true } } };
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 6, right: 6, bottom: 6, left: 6 },
  axes: false,
  data: states,
  schema: {
    x: { type: "ordinal", domain: d3.range(12) },
    y: { type: "ordinal", domain: d3.range(8) },
    key: { type: "categorical" },
    change: { type: "quantitative", domain: [1 / m, m] },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 1,
      channels: { ...channels, fill: { field: "change", scale: d3.scaleDivergingLog(d3.interpolatePiYG).domain([1 / m, 1, m]) } },
    }),
    text({ fontSize: 10, dy: -2, channels: { ...channels, text: { field: "key" } } }),
    text({ fontSize: 9, dy: 10, fillOpacity: 0.6, channels: { ...channels, text: { fn: (d) => d3.format("+.0%")(d.change - 1) } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Grew or shrank',
      question: 'Between 2010 and 2019, which states do you think lost population, and which grew fastest?',
      try: 'Click a state to step it: lost → grew a little → grew a lot.',
      why: 'The answer is ordered, so the field is `ordinal` and the PiYG scheme gives it an ordered ramp; `cycle()` on `fill` steps a state one answer along with each click.',
      uses: ['cycle()', 'ordinal fill'],
      code: `const gridmap = await plotData("observable-plot-grid-choropleth", "grid.csv");
const answers = ["lost", "grew < 10%", "grew ≥ 10%"];
const channels = { x: { field: "x", scale: { padding: 0 } }, y: { field: "y", scale: { padding: 0, reverse: true } } };
mount(Elicit({
  width: 480, height: 360,
  margins: { top: 34, right: 6, bottom: 6, left: 6 },
  axes: false,
  data: gridmap.map(({ x, y, key }) => ({ x, y, key, guess: "grew < 10%" })),
  schema: {
    x: { type: "ordinal", domain: d3.range(12) },
    y: { type: "ordinal", domain: d3.range(8) },
    key: { type: "categorical" },
    guess: { type: "ordinal", domain: answers }, //! an ordered set of answers
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 1,
      channels: {
        ...channels,
        fill: {
          field: "guess", scale: { scheme: "piyg" }, legend: { anchor: "top", title: false },
          edit: cycle(), //! click steps the answer
        },
      },
    }),
    text({ fontSize: 10, channels: { ...channels, text: { field: "key" } } }),
  ],
}));`,
    },
    {
      title: 'Select, then label',
      question: 'Which states do you think grew by more than 10% between 2010 and 2019?',
      try: 'Click states to select them (click again to deselect), then click a swatch in the legend to label them all.',
      why: '`select({ exclusive: false })` collects a set of target rows without writing anything, and `edit.legend.category()` writes the clicked swatch into every selected row, so a whole region is labelled in one answer.',
      uses: ['select()', 'edit.legend.category()'],
      code: `const gridmap = await plotData("observable-plot-grid-choropleth", "grid.csv");
const answers = ["shrank", "grew 0–10%", "grew > 10%"];
const channels = { x: { field: "x", scale: { padding: 0 } }, y: { field: "y", scale: { padding: 0, reverse: true } } };
mount(Elicit({
  width: 480, height: 330,
  margins: { top: 6, right: 100, bottom: 6, left: 6 },
  axes: false,
  data: gridmap.map(({ x, y, key }) => ({ x, y, key, guess: "grew 0–10%" })),
  schema: {
    x: { type: "ordinal", domain: d3.range(12) },
    y: { type: "ordinal", domain: d3.range(8) },
    key: { type: "categorical" },
    guess: { type: "ordinal", domain: answers },
  },
  marks: [
    rect({
      stroke: "white", strokeWidth: 1,
      edits: [select({ exclusive: false })], //! every click adds to (or removes from) the set
      channels: { ...channels, fill: { field: "guess", scale: { scheme: "piyg" } } },
    }),
    text({ fontSize: 10, channels: { ...channels, text: { field: "key" } } }),
    legendColor({ anchor: "right", title: "your guess", edit: edit.legend.category() }), //! a swatch click labels the selection
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-county-boxes',
  status: 'full',
  verdict: 'Each county’s geographic bounding box comes from `d3.geoBounds` on the TopoJSON features; `geoRect` draws it under an Albers USA projection.',
  needs: ['topojson'],
  prep: ['prep-geo'],
  gaps: [
    'TopoJSON is converted with `topojson.feature` before `Elicit`; ElicitJS takes GeoJSON or plain coordinates.',
    '`geoRect` projects the four corners of each box, so under Albers USA a box is a slightly skewed quadrilateral, as in Plot.',
  ],
  recreation: {
    code: `const us = await plotData("plot-county-boxes", "us-counties-10m.json");
const counties = topojson.feature(us, us.objects.counties).features;
const rows = counties.map((f) => {
  const [[west, south], [east, north]] = d3.geoBounds(f);
  return { west, south, east, north };
});
mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: topojson.feature(us, us.objects.nation) },
  data: rows,
  schema: {
    west: { type: "quantitative", domain: [-180, 180] }, east: { type: "quantitative", domain: [-180, 180] },
    south: { type: "quantitative", domain: [-90, 90] }, north: { type: "quantitative", domain: [-90, 90] },
  },
  marks: [
    geoRect({
      fill: "none", stroke: "currentColor", strokeWidth: 0.5,
      channels: { west: { field: "west" }, south: { field: "south" }, east: { field: "east" }, north: { field: "north" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Box the small ones',
      question: 'Where in the lower 48 do you think US counties are smallest? Cover that area with the box.',
      try: 'Drag the box to move it; drag an edge or corner to resize it.',
      why: 'The state outlines are a `geoBasemap`, so they are scenery. The dataset is one bounding box in degrees, and `edit.geo.brush()` inverts every drag through the projection, so the box you shape is stored as longitude and latitude.',
      uses: ['geoRect', 'edit.geo.brush()', 'geoBasemap'],
      code: `const us = await plotData("plot-county-boxes", "us-counties-10m.json");
const states = topojson.feature(us, us.objects.states);
mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: [{ west: -100, south: 36, east: -92, north: 41 }],
  schema: {
    west: { type: "quantitative", domain: [-125, -66] }, east: { type: "quantitative", domain: [-125, -66] },
    south: { type: "quantitative", domain: [24, 50] }, north: { type: "quantitative", domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "#f1f5f9", stroke: "#94a3b8", strokeWidth: 0.6 }),
    geoRect({
      fill: "rgba(37, 99, 235, 0.18)", stroke: "#1d4ed8", strokeWidth: 1.5,
      channels: { west: { field: "west" }, south: { field: "south" }, east: { field: "east" }, north: { field: "north" } },
      edits: [edit.geo.brush({ edgeInset: 10 })], //! move the box, or resize it by an edge or corner
    }),
  ],
}));`,
    },
  ],
});
