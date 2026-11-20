// Observable Plot gallery — "Area, Line", second half. See AUTHORING.md.

GALLERY.defineFeatures({
  'line-gaps': { label: 'Gaps for missing values', description: 'Lines and areas that break where a value is undefined or NaN (Plot\'s `defined` behaviour). ElicitJS now breaks a path at a null value, so no entry in this file needs it.' },
  'curve-types': { label: 'More curve interpolators', description: 'Curves ElicitJS does not offer: `bump-x`/`bump-y`, closed curves (`cardinal-closed`, `linear-closed`), and geodesic interpolation.' },
});

GALLERY.add({
  id: 'plot-stacking-order-and-reverse',
  status: 'partial',
  verdict: 'The stacked revenue areas draw with `areaY` over hand-computed `lo`/`hi` bounds; the `order` and `reverse` inputs the example is about become a fixed choice made in JavaScript.',
  needs: ['stack-offset', 'input-widgets'],
  prep: ['prep-stack', 'prep-calculate'],
  gaps: [
    '`area` does not stack, so each format\'s lower and upper bound is a cumulative sum computed before `Elicit`.',
    'The order/reverse dropdown and toggle are gone: changing the order means editing the `order` array and re-running.',
    'Where two formats peak in the same year the hand-computed "appearance" order breaks the tie differently from Plot, so the bottom bands differ.',
  ],
  recreation: {
    code: `const riaa = await plotData("plot-stacking-order-and-reverse", "riaa-us-revenue.csv");
const rows = riaa.map((d) => ({
  format: d.format, group: d.group,
  year: d.year.getUTCFullYear(), revenue: d.revenue / 1000, // billions
}));
// order: "appearance" — formats by the year of their peak revenue
const peak = d3.rollup(rows, (v) => d3.greatest(v, (d) => d.revenue).year, (d) => d.format);
const order = [...peak.keys()].sort((a, b) => peak.get(a) - peak.get(b));
// The stack, by hand: each format's band is [lo, hi] within its year.
for (const [, v] of d3.group(rows, (d) => d.year)) {
  let acc = 0;
  for (const d of d3.sort(v, (d) => order.indexOf(d.format))) {
    d.lo = acc; d.hi = acc += d.revenue;
  }
}

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    format:  { type: "categorical" },
    group:   { type: "categorical", domain: ["Disc", "Download", "Other", "Streaming", "Tape", "Vinyl"] },
    year:    { type: "quantitative", domain: [1973, 2019] },
    revenue: { type: "quantitative", domain: [0, 23] },
    lo:      { type: "quantitative", domain: [0, 23] },
    hi:      { type: "quantitative", domain: [0, 23] },
  },
  axes: { x: { tickFormat: "d" }, y: { title: "Annual revenue (billions, adj.)", grid: true } },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      channels: {
        x: { field: "year" },
        y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "format" },
        fill: { field: "group", legend: true },
      },
    }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Restack the future',
      question: 'How will US recorded-music revenue split between formats from 2020 to 2025?',
      try: 'Drag the dot on top of a band up or down. The bands above it shift to stay stacked.',
      why: 'The dots `move()` each band\'s upper bound `hi`; a `constraints.custom` repair turns the new `hi` back into that format\'s `revenue` and re-stacks the year, so every band above follows. `lock` keeps 2012–2019 as given.',
      uses: ['move()', 'constraints.custom', 'lock'],
      code: `const riaa = await plotData("plot-stacking-order-and-reverse", "riaa-us-revenue.csv");
const groups = ["Physical", "Download", "Streaming"]; // bottom to top
const kind = (g) => (g === "Download" || g === "Streaming" ? g : "Physical");
const sums = d3.rollup(riaa, (v) => d3.sum(v, (d) => d.revenue) / 1000,
  (d) => d.year.getUTCFullYear(), (d) => kind(d.group));
const rows = [];
for (let year = 2012; year <= 2025; year++) {
  for (const group of groups) {
    const known = year <= 2019 ? sums.get(year).get(group) : sums.get(2019).get(group);
    rows.push({ year, group, revenue: +known.toFixed(2) });
  }
}
// Re-derive every band from the revenues: run once now, then after each drag.
function stackRows(data) {
  for (const [, v] of d3.group(data, (d) => d.year)) {
    let acc = 0;
    for (const d of d3.sort(v, (d) => groups.indexOf(d.group))) { d.lo = acc; d.hi = acc += d.revenue; }
  }
  return data;
}
stackRows(rows);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    year:    { type: "quantitative", domain: [2012, 2025] },
    group:   { type: "categorical", domain: groups },
    revenue: { type: "quantitative", domain: [0, 16] },
    lo:      { type: "quantitative", domain: [0, 16] },
    hi:      { type: "quantitative", domain: [0, 16] },
  },
  lock: (d) => d.year <= 2019,                                     //! the record is given
  constraints: [
    constraints.custom(({ data, activeIndex }) => {                 //! dragging a top edge sets that band's revenue …
      const next = data.map((d) => ({ ...d }));
      const a = next[activeIndex];
      if (a) a.revenue = Math.max(0, a.hi - a.lo);
      return stackRows(next);                                       //! … and re-stacks the year
    }, { type: "restack" }),
  ],
  axes: { x: { tickFormat: "d" }, y: { title: "Revenue (billions)", grid: true } },
  guides: [
    guides.region({ x: [2019.5, 2025], fill: "#94a3b8", opacity: 0.12 }),
  ],
  marks: [
    areaY({
      fillOpacity: 0.9, stroke: "white", strokeWidth: 0.5,
      channels: {
        x: { field: "year" }, y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "group" },
        fill: { field: "group", legend: true },
      },
    }),
    point({
      stroke: "white", strokeWidth: 1.5,
      size: (d) => (d.year > 2019 ? 5 : 0),
      channels: {
        x: { field: "year" },
        y: { field: "hi", edit: move() },                             //! a drag writes the band's top
        fill: { field: "group" },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-population-pyramid',
  status: 'full',
  verdict: 'Two mirrored stacks of `areaX` bands — men drawn to the left as negative populations — reproduce the pyramid; the stack is computed by hand.',
  needs: [],
  prep: ['prep-stack', 'prep-calculate'],
  gaps: [
    'The marital-status categories are translated in the data rather than through the legend\'s `tickFormat`.',
    'The axis title sits below the axis as plain text rather than with Plot\'s centred label anchor.',
  ],
  recreation: {
    code: `const population = await plotData("plot-population-pyramid", "population@1.csv");
const english = { ledig: "single", verheiratet: "married", geschieden: "divorced", verwitwet: "widowed" };
const categories = ["single", "married", "divorced", "widowed"];
const rows = population.map((d) => ({ ...d, category: english[d.category] }));
// Stack each (age, sex) column outward from zero: men leftward, women rightward.
for (const v of d3.group(rows, (d) => d.age + d.sex).values()) {
  let acc = 0;
  for (const d of d3.sort(v, (d) => categories.indexOf(d.category))) {
    const sign = d.sex === "M" ? -1 : 1;
    d.x1 = acc * sign; acc += d.population; d.x2 = acc * sign;
    d.band = d.sex + d.category;
  }
}

mount(Elicit({
  width: 460, height: 460,
  margins: { top: 16, right: 16, bottom: 44, left: 36 },
  data: rows,
  schema: {
    age:        { type: "quantitative", domain: [0, 84] },
    sex:        { type: "categorical", domain: ["M", "F"] },
    category:   { type: "categorical", domain: categories },
    population: { type: "quantitative" },
    x1:         { type: "quantitative", domain: [-720, 720] },
    x2:         { type: "quantitative", domain: [-720, 720] },
    band:       { type: "categorical" },
  },
  axes: {
    x: { tickFormat: Math.abs, title: "← men · population (thousands) · women →" },
    y: { grid: true },
  },
  marks: [
    areaX({
      fillOpacity: 1, stroke: "none",
      channels: {
        y: { field: "age" },
        x1: { field: "x1" }, x2: { field: "x2" },
        series: { field: "band" },
        fill: { field: "category", legend: { anchor: "top", title: false },
                scale: { range: ["#69AEBE", "#F1757A", "#F2B678", "#989D9E"] } },
      },
    }),
    ruleX({ channels: { x: { datum: 0 } } }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep the women',
      question: 'What will Germany\'s age pyramid look like for women in 2050?',
      try: 'Sweep up or down across the right half to redraw the women\'s side, band by band.',
      why: 'A `move({ pick: "sweep" })` on the `x` channel of an `areaX` writes every five-year band the pointer passes, so one stroke redraws the profile. `lock` holds the men\'s side as today\'s reference, and `clamp` keeps a band from crossing zero.',
      uses: ['move({ pick: "sweep" })', 'lock', 'clamp()'],
      code: `const population = await plotData("plot-population-pyramid", "population@1.csv");
// Today's population in five-year bands (thousands); men are negative.
const rows = [];
for (const [band, sex, v] of d3.flatRollup(population, (v) => d3.sum(v, (d) => d.population),
  (d) => Math.floor(d.age / 5) * 5 + 2.5, (d) => d.sex)) {
  rows.push({ age: band, sex, pop: sex === "M" ? -v : v });
}

mount(Elicit({
  width: 420, height: 400,
  margins: { top: 16, right: 30, bottom: 44, left: 36 },
  data: d3.sort(rows, (d) => d.age),
  schema: {
    age: { type: "quantitative", domain: [0, 85] },
    sex: { type: "categorical", domain: ["M", "F"] },
    pop: { type: "quantitative", domain: [-4500, 4500] },
  },
  lock: (d) => d.sex === "M",                                        //! men stay as today
  constraints: [ clamp({ field: "pop", min: 0 }) ],                  //! women stay right of zero
  axes: {
    x: { tickFormat: (v) => (v ? Math.abs(v) / 1000 + "M" : "0"), title: "← men (today) · women (2050) →" },
    y: { grid: true },
  },
  marks: [
    areaX({
      curve: "monotoneY", handleSize: 3,
      channels: {
        y: { field: "age" },
        x: { field: "pop", edit: move({ pick: "sweep", guide: true }) }, //! one stroke redraws many bands
        series: { field: "sex" },
        fill: { field: "sex", scale: { range: ["#69AEBE", "#F1757A"] } },
      },
    }),
    ruleX({ channels: { x: { datum: 0 } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-stack-offset',
  status: 'full',
  verdict: 'A wiggle streamgraph of RIAA revenue: d3\'s `stackOffsetWiggle` and inside-out order computed in JavaScript, drawn as `areaY` bands with explicit `y1`/`y2`.',
  needs: [],
  prep: ['prep-stack', 'prep-reshape'],
  gaps: [
    'The offset dropdown (none / center / wiggle) is fixed to wiggle; another offset means swapping the d3 stack offset and re-running.',
  ],
  recreation: {
    code: `const riaa = await plotData("plot-stack-offset", "riaa-us-revenue.csv");
const years = [...new Set(riaa.map((d) => d.year.getUTCFullYear()))];
const formats = [...new Set(riaa.map((d) => d.format))];
const byYear = d3.index(riaa, (d) => d.year.getUTCFullYear(), (d) => d.format);
const groupOf = new Map(riaa.map((d) => [d.format, d.group]));
// The wiggle offset and inside-out order, by d3.stack.
const series = d3.stack()
  .keys(formats)
  .value(([y], f) => (byYear.get(y).get(f)?.revenue ?? 0) / 1000)
  .order(d3.stackOrderInsideOut)
  .offset(d3.stackOffsetWiggle)(d3.group(riaa, (d) => d.year.getUTCFullYear()));
// Like Plot, shift the whole stream so its lowest point sits on zero.
const floor = d3.min(series, (s) => d3.min(s, (p) => p[0]));
const rows = series.flatMap((s) => s.map((p) => ({
  format: s.key, group: groupOf.get(s.key), year: p.data[0], lo: p[0] - floor, hi: p[1] - floor,
})));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    format: { type: "categorical" },
    group:  { type: "categorical", domain: ["Disc", "Download", "Other", "Streaming", "Tape", "Vinyl"] },
    year:   { type: "quantitative", domain: [1973, 2019] },
    lo:     { type: "quantitative" },
    hi:     { type: "quantitative" },
  },
  axes: { x: { tickFormat: "d" }, y: { title: "Annual revenue (billions, adj.)", grid: true } },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      channels: {
        x: { field: "year" }, y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "format" },
        fill: { field: "group" },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep a silhouette',
      question: 'How did total US recorded-music revenue rise and fall between 1973 and 2019?',
      try: 'Sweep across the chart to set the stream\'s thickness year by year; it stays centred on zero.',
      why: 'A centred stream is a band from `-v/2` to `v/2`. A sweep writes the upper edge `hi`, and a `constraints.custom` repair mirrors it into `lo`, so the silhouette stays symmetric whichever way you draw.',
      uses: ['move({ pick: "sweep" })', 'constraints.custom', 'clamp()'],
      code: `const years = d3.range(1973, 2020, 2);
const rows = years.map((year) => ({ year, lo: -5, hi: 5 })); // a flat $10bn prior

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    year: { type: "quantitative", domain: [1973, 2019] },
    lo:   { type: "quantitative", domain: [-13, 13] },
    hi:   { type: "quantitative", domain: [-13, 13] },
  },
  constraints: [
    clamp({ field: "hi", min: 0 }),
    constraints.custom(({ data }) => data.map((d) => ({ ...d, lo: -d.hi })), //! the centre offset, as a rule
      { type: "centre" }),
  ],
  axes: { x: { tickFormat: "d" }, y: { title: "Total revenue (billions, adj.)", grid: true, tickFormat: (v) => Math.abs(v * 2) } },
  marks: [
    areaY({
      handles: "hit", curve: "monotoneX", fill: "#4269d0", fillOpacity: 0.6,
      channels: {
        x: { field: "year" },
        y1: { field: "lo" },
        y2: { field: "hi", edit: move({ pick: "sweep" }) },           //! sweep the top edge
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-normalized-stack',
  status: 'full',
  verdict: 'The normalized RIAA stack is `areaY` bands over shares computed in JavaScript (each year divided by its total), with rules at 0 and 1 and a percent axis.',
  needs: [],
  prep: ['prep-stack'],
  gaps: [
    'The normalize offset is arithmetic before `Elicit`, not a stack option.',
  ],
  recreation: {
    code: `const riaa = await plotData("plot-normalized-stack", "riaa-us-revenue.csv");
const groups = ["Disc", "Download", "Other", "Streaming", "Tape", "Vinyl"];
const rows = riaa.map((d) => ({ format: d.format, group: d.group,
  year: d.year.getUTCFullYear(), revenue: d.revenue }));
// order: "group", reversed — then divide each year's stack by its total.
for (const v of d3.group(rows, (d) => d.year).values()) {
  const total = d3.sum(v, (d) => d.revenue);
  let acc = 0;
  for (const d of d3.sort(v, (d) => -groups.indexOf(d.group))) {
    d.lo = Math.min(1, acc / total); acc += d.revenue; d.hi = Math.min(1, acc / total);
  }
}

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    format:  { type: "categorical" },
    group:   { type: "categorical", domain: groups },
    year:    { type: "quantitative", domain: [1973, 2019] },
    revenue: { type: "quantitative" },
    lo:      { type: "quantitative", domain: [0, 1] },
    hi:      { type: "quantitative", domain: [0, 1] },
  },
  axes: { x: { tickFormat: "d" }, y: { title: "Annual revenue (%)", tickFormat: (v) => v * 100 } },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      channels: {
        x: { field: "year" }, y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "format" },
        fill: { field: "group" },
      },
    }),
    ruleY({ channels: { y: { datum: 0 } } }),
    ruleY({ channels: { y: { datum: 1 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Move the boundaries',
      question: 'What share of US music revenue will physical, download and streaming formats each earn through 2030?',
      try: 'Drag the dots on either boundary up or down. A boundary can\'t cross the other one.',
      why: 'In a two-boundary normalized stack the shares ARE the boundaries, so each row stores `b1` and `b2` and the three bands are drawn between 0, `b1`, `b2` and 1. Each boundary line carries its own `move()`, and `ordering` keeps `b1` below `b2`.',
      uses: ['move()', 'ordering()', 'lock'],
      code: `const riaa = await plotData("plot-normalized-stack", "riaa-us-revenue.csv");
const kind = (g) => (g === "Download" || g === "Streaming" ? g : "Physical");
const sums = d3.rollup(riaa, (v) => d3.sum(v, (d) => d.revenue),
  (d) => d.year.getUTCFullYear(), (d) => kind(d.group));
const shares = (y) => { const s = sums.get(y), t = d3.sum(s.values());
  return { b1: s.get("Physical") / t, b2: (s.get("Physical") + s.get("Download")) / t }; };
const rows = d3.range(2008, 2031).map((year) => ({ year, ...shares(Math.min(year, 2019)) }));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 80, bottom: 28, left: 40 },
  data: rows,
  schema: {
    year: { type: "quantitative", domain: [2008, 2030] },
    b1:   { type: "quantitative", domain: [0, 1] },
    b2:   { type: "quantitative", domain: [0, 1] },
  },
  lock: (d) => d.year <= 2019,                                    //! 2008–2019 is the record
  constraints: [ ordering({ field: ["b1", "b2"] }) ],             //! physical ≤ physical + download
  axes: { x: { tickFormat: "d" }, y: { tickFormat: ".0%" } },
  guides: [ guides.custom(({ scales }) => [
    ["Physical", 0.03], ["Download", 0.3], ["Streaming", 0.75],
  ].map(([text, y]) => ({ type: "text", text, x: scales.x.encode(2030) + 6,
    y: scales.y.encode(y), fontSize: 11, fill: "#333" }))) ],
  marks: [
    areaY({ fill: "#9c755f", fillOpacity: 0.8,
      channels: { x: { field: "year" }, y1: { datum: 0 }, y2: { field: "b1" } } }),
    areaY({ fill: "#f28e2c", fillOpacity: 0.8,
      channels: { x: { field: "year" }, y1: { field: "b1" }, y2: { field: "b2" } } }),
    areaY({ fill: "#76b7b2", fillOpacity: 0.8,
      channels: { x: { field: "year" }, y1: { field: "b2" }, y2: { datum: 1 } } }),
    lineY({ stroke: "white", handleSize: 4,
      channels: { x: { field: "year" }, y: { field: "b1", edit: move() } } }), //! the physical | download boundary
    lineY({ stroke: "white", handleSize: 4,
      channels: { x: { field: "year" }, y: { field: "b2", edit: move() } } }), //! the download | streaming boundary
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-apportionment-of-seats-in-the-ep',
  status: 'full',
  verdict: 'A normalized streamgraph of European Parliament seats per member state, coloured by accession year and labelled at its right edge: `areaY` bands over shares stacked in JavaScript, with a `text` mark for the names.',
  needs: [],
  prep: ['prep-reshape', 'prep-stack', 'prep-calculate'],
  gaps: [
    'The tip reads an invisible `rectY` per state and date, since an `areaY` path carries no row for a tip to read; near a curved band edge it can name the neighbour.',
    'Labels sit at the last date before 2020 like the original, but small states\' names overlap where their bands are thin.',
  ],
  recreation: {
    code: `const eu = await plotData("apportionment-of-seats-in-the-ep", "eu.csv");
const dates = Object.keys(eu[0]).slice(4);
const parse = d3.utcParse("%b %Y");
// Fold the wide table: one row per (state, date).
const rows = eu.flatMap((d) => dates.map((k) => ({
  state: d.State, joined: String(d.Joined), date: parse(k), seats: d[k] ?? 0,
})));
// Stack by accession year, then normalize each date to [0, 1] ("expand").
const order = d3.sort(eu, (d) => d.Joined).map((d) => d.State);
for (const v of d3.group(rows, (d) => +d.date).values()) {
  const total = d3.sum(v, (d) => d.seats);
  let acc = 0;
  for (const d of d3.sort(v, (d) => order.indexOf(d.state))) {
    d.lo = acc / total; acc += d.seats; d.hi = Math.min(1, acc / total);
    d.mid = (d.lo + d.hi) / 2;
  }
}
const lastBefore2020 = d3.max(rows.filter((d) => d.date < new Date(2020, 0, 1)), (d) => d.date);
// Each row's slice of time, halfway to its neighbours: what the tip's rect covers.
const times = dates.map((k) => +parse(k));
for (const d of rows) {
  const i = times.indexOf(+d.date);
  d.t0 = new Date((times[Math.max(0, i - 1)] + times[i]) / 2);
  d.t1 = new Date((times[i] + times[Math.min(times.length - 1, i + 1)]) / 2);
}

mount(Elicit({
  width: 480, height: 600,
  margins: { top: 40, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    state:  { type: "categorical" },
    joined: { type: "categorical", domain: ["1951", "1973", "1981", "1986", "1995", "2004", "2007", "2013"] },
    date:   { type: "temporal" },
    seats:  { type: "quantitative" },
    lo:     { type: "quantitative", domain: [0, 1] },
    hi:     { type: "quantitative", domain: [0, 1] },
    mid:    { type: "quantitative", domain: [0, 1] },
    t0:     { type: "temporal" },
    t1:     { type: "temporal" },
  },
  axes: { x: {}, y: { tickFormat: ".0%" } },
  marks: [
    areaY({
      curve: "monotoneX", fillOpacity: 1, stroke: "white", strokeOpacity: 0.3,
      channels: {
        x: { field: "date" }, y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "state" },
        fill: { field: "joined", legend: { anchor: "top", title: false } },
      },
    }),
    // Plot's title tip (state, accession year). An area's path carries no row for
    // a tip to read, so an invisible rect per (state, date) carries it.
    rectY({ fillOpacity: 0, stroke: "none", tip: ["state", "joined"],
      channels: { x1: { field: "t0" }, x2: { field: "t1" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
    text({
      fontSize: 9, textAnchor: "end", dx: -4, fill: "#000",
      // One label per state: the empty string hides the other dates.
      text: (d) => (+d.date === +lastBefore2020 && d.seats > 0 ? d.state : ""),
      channels: { x: { field: "date" }, y: { field: "mid" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Move seat tokens',
      question: 'The Parliament grew to 720 seats in 2024. How do you think they were shared among the largest states?',
      try: 'Each dot is 10 seats. Drag a dot from one row to another.',
      why: 'Every row of the dataset is one token, and `dotStackX` derives each state\'s count from how many tokens name it. A `move()` on `y` re-labels a token, so seats change hands but the 720 total is preserved by construction — no `maintainSum` needed.',
      uses: ['dotStackX', 'move()'],
      code: `const eu = await plotData("apportionment-of-seats-in-the-ep", "eu.csv");
const big = ["Germany", "France", "Italy", "Spain", "Poland", "Romania", "Netherlands"];
const states = [...big, "The other 20"];
// 2020 seats, scaled to 720 and rounded to tokens of 10 (largest remainder).
const seats = d3.rollup(eu.filter((d) => d["Feb 2020"] != null),
  (v) => d3.sum(v, (d) => d["Feb 2020"]), (d) => (big.includes(d.State) ? d.State : "The other 20"));
const total = d3.sum(seats.values());
const quota = states.map((s) => ({ s, q: (seats.get(s) / total) * 72 }));
quota.forEach((d) => (d.n = Math.floor(d.q)));
d3.sort(quota, (d) => d.n - d.q).slice(0, 72 - d3.sum(quota, (d) => d.n)).forEach((d) => d.n++);
const tokens = quota.flatMap(({ s, n }) => d3.range(n).map(() => ({ state: s })));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 16, left: 96 },
  axes: { x: false, y: {} },
  data: tokens,
  schema: { state: { type: "categorical", domain: states } },
  scales: { y: { type: "band" } },
  marks: [
    dotStackX({
      size: 4, gap: 1, fill: "#66c2a5", label: true,
      channels: { y: { field: "state", edit: move() } },  //! a drag moves 10 seats to another state
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-ribbon-chart',
  status: 'full',
  verdict: 'Ribbons that criss-cross as the largest format rises to the top: the per-year "order by value" stack is computed in JavaScript and drawn with `areaY` bands.',
  needs: [],
  prep: ['prep-stack'],
  gaps: [
    'The `order: "value"` stack is computed by hand: each year\'s formats are sorted by revenue before accumulating.',
  ],
  recreation: {
    code: `const riaa = await plotData("plot-ribbon-chart", "riaa-us-revenue.csv");
const rows = riaa.map((d) => ({ format: d.format, group: d.group,
  year: d.year.getUTCFullYear(), revenue: d.revenue / 1000 }));
// order: "value" — smallest at the bottom, largest on top, re-sorted every year.
for (const v of d3.group(rows, (d) => d.year).values()) {
  let acc = 0;
  for (const d of d3.sort(v, (d) => d.revenue)) { d.lo = acc; d.hi = acc += d.revenue; }
}

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    format:  { type: "categorical" },
    group:   { type: "categorical", domain: ["Disc", "Download", "Other", "Streaming", "Tape", "Vinyl"] },
    year:    { type: "quantitative", domain: [1973, 2019] },
    revenue: { type: "quantitative", domain: [0, 23] },
    lo:      { type: "quantitative", domain: [0, 23] },
    hi:      { type: "quantitative", domain: [0, 23] },
  },
  axes: { x: { tickFormat: "d" }, y: { title: "Annual revenue (billions, adj.)", grid: true } },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      channels: {
        x: { field: "year" }, y1: { field: "lo" }, y2: { field: "hi" },
        series: { field: "format" },
        fill: { field: "group" },
      },
    }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Rank the formats',
      question: 'Which format will earn the most in 2025, and in what order will the others follow?',
      try: 'Drag a bar up or down the list to change its rank. Each bar keeps its 2019 revenue as its length.',
      why: 'A ribbon chart re-sorts every year by value, so each year is a ranked column. Here that column is a `barX` whose band axis is the ordinal `rank` field: `rank()` on `y` inserts the dragged bar at the slot under the pointer and shifts the bars between, so the answer is always a complete ordering with no ties. The length is 2019 revenue, as reference, so you can see where you expect a smaller format to overtake.',
      uses: ['rank()', 'barX'],
      code: `const riaa = await plotData("plot-ribbon-chart", "riaa-us-revenue.csv");
const formats = ["Streaming", "Download", "Disc", "Vinyl", "Other"];
const groupOf = (d) => (d.group === "Tape" ? "Other" : d.group); // tape is a rounding error by 2019
// 2019 revenue by group (billions); the 2025 ranking is seeded with the 2019 order.
const revenue = d3.rollup(riaa.filter((d) => d.year.getUTCFullYear() === 2019),
  (v) => d3.sum(v, (d) => d.revenue) / 1000, groupOf);
const rows = d3.sort(formats, (f) => -revenue.get(f))
  .map((format, i) => ({ format, rank: i + 1, revenue: +revenue.get(format).toFixed(2) }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 16, right: 70, bottom: 32, left: 36 },
  data: rows,
  schema: {
    format:  { type: "categorical", domain: formats },
    rank:    { type: "ordinal", domain: [1, 2, 3, 4, 5] },
    revenue: { type: "quantitative", domain: [0, 9] },
  },
  scales: { y: { reverse: true } }, // rank 1 on top
  axes: { x: { title: "2019 revenue (billions)" }, y: { tickFormat: (r) => "#" + r } },
  marks: [
    barX({
      channels: {
        y: { field: "rank", edit: rank() },                            //! drag across slots to reorder; no ties
        x: { field: "revenue" },
        fill: { field: "format", scale: { range: ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#bab0ac"] } },
      },
    }),
    text({ fontSize: 11, textAnchor: "start", dx: 6,
      channels: { y: { field: "rank" }, x: { field: "revenue" }, text: { field: "format" } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-job-vacancies',
  status: 'full',
  verdict: 'The step area and its outline draw with `areaY` and `lineY` (`curve: "stepBefore"`); the 2008–09 gap that Plot\'s quarterly interval leaves comes from one row with a missing value, which breaks both paths.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'There is no `interval` option: the row that marks the missing quarters is inserted in JavaScript before `Elicit`, and its `null` value breaks the step there.',
  ],
  recreation: {
    code: `const vacancies = await plotData("plot-job-vacancies", "vacancies.csv");
// Plot's quarterly interval keeps missing quarters from being bridged. Here a
// row with no value goes in wherever more than a quarter is skipped.
const rows = vacancies.flatMap((d, i, a) => {
  const prev = a[i - 1];
  if (!prev || d.month - prev.month <= 100 * 864e5) return [d];
  const next = new Date(prev.month); next.setUTCMonth(next.getUTCMonth() + 3);
  return [{ month: next, vacancies: null }, d];
});

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    month:     { type: "temporal" },
    vacancies: { type: "quantitative", domain: [0, 500] },
  },
  axes: { x: {}, y: { title: "Job vacancies, seasonally adj. (thousands)", grid: true } },
  marks: [
    // A null value breaks the step: no series splitting needed.
    areaY({ curve: "stepBefore", fill: "pink", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "month" }, y: { field: "vacancies" } } }),
    lineY({ curve: "stepBefore", stroke: "#222", strokeWidth: 1.5,
      channels: { x: { field: "month" }, y: { field: "vacancies" } } }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Draw the next quarters',
      question: 'Australian job vacancies hit a record 480,000 in May 2022. Where will they be each quarter to 2026?',
      try: 'Drag across the shaded years to draw the steps; drag again to redraw part of it.',
      why: '`edit.line.draw` mints one row per quarter in `samples` as the pointer crosses it, so a single stroke draws the whole forecast and a second stroke reshapes it. `lock: "seed"` keeps the record fixed.',
      uses: ['edit.line.draw()', 'lock'],
      code: `const vacancies = await plotData("plot-job-vacancies", "vacancies.csv");
// Decimal years since 2015 keep the quarterly grid simple.
const record = vacancies
  .filter((d) => d.month.getUTCFullYear() >= 2015)
  .map((d) => ({ t: d.month.getUTCFullYear() + d.month.getUTCMonth() / 12, vacancies: d.vacancies }));
const quarters = d3.range(2022.5, 2026.01, 0.25);

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 22, right: 16, bottom: 28, left: 40 },
  data: record,
  schema: {
    t:         { type: "quantitative", domain: [2015, 2026] },
    vacancies: { type: "quantitative", domain: [0, 600] },
  },
  lock: "seed",                                                     //! the record is fixed
  axes: { x: { tickFormat: "d" }, y: { title: "Job vacancies (thousands)", grid: true } },
  guides: [
    guides.region({ x: [2022.4, 2026], fill: "#94a3b8", opacity: 0.12 }),
  ],
  marks: [
    areaY({ curve: "stepBefore", fill: "pink", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "t" }, y: { field: "vacancies" } } }),
    lineY({ curve: "stepBefore", stroke: "#222", strokeWidth: 1.5, handleSize: 3,
      channels: { x: { field: "t" }, y: { field: "vacancies" } },
      edits: [ edit.line.draw({ samples: quarters }) ],              //! one row per quarter the stroke crosses
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-proportion-plot',
  status: 'full',
  verdict: 'Two 100% stacks — share of population and share of wealth by age — joined by S-shaped ribbons, drawn with `areaY` bands, percentage labels and white age names.',
  needs: [],
  prep: ['prep-reshape', 'prep-stack', 'prep-calculate'],
  gaps: [
    'ElicitJS has no `bump-x` curve, so each ribbon is sampled at 25 points along a smoothstep between its two columns.',
  ],
  recreation: {
    code: `const wide = d3.csvParse(\`age,population,wealth
16-34’s,30,3
35-54’s,33,32
55-74’s,28,52
Over 75’s,9,13\`, d3.autoType);
const ages = wide.map((d) => d.age);
// Stack each column top-down, then sample a smoothstep ribbon between them.
const lo = { population: 0, wealth: 0 };
const rows = wide.flatMap((d) => {
  const a = { lo: lo.population, hi: (lo.population += d.population) };
  const b = { lo: lo.wealth, hi: (lo.wealth += d.wealth) };
  return d3.range(0, 1.0001, 1 / 24).map((t) => {
    const s = t * t * (3 - 2 * t); // the bump
    return { age: d.age, t, pop: d.population, wealth: d.wealth,
      y1: a.lo + (b.lo - a.lo) * s, y2: a.hi + (b.hi - a.hi) * s,
      mid: (a.lo + a.hi) / 2 + ((b.lo + b.hi) / 2 - (a.lo + a.hi) / 2) * s };
  });
});

mount(Elicit({
  width: 400, height: 380,
  margins: { top: 30, right: 60, bottom: 10, left: 50 },
  data: rows,
  schema: {
    age:    { type: "ordinal", domain: ages },
    t:      { type: "quantitative", domain: [0, 1] },
    pop:    { type: "quantitative" },
    wealth: { type: "quantitative" },
    y1:     { type: "quantitative", domain: [0, 100] },
    y2:     { type: "quantitative", domain: [0, 100] },
    mid:    { type: "quantitative", domain: [0, 100] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { anchor: "top", tickValues: [0, 1], tickSize: 0,
               tickFormat: (t) => (t ? "Share of wealth" : "Share of population") }, y: false },
  marks: [
    areaY({
      curve: "linear", fillOpacity: 1, stroke: "white",
      channels: {
        x: { field: "t" }, y1: { field: "y1" }, y2: { field: "y2" },
        series: { field: "age" },
        fill: { field: "age", scale: { scheme: "PRGn", reverse: true } },
      },
    }),
    // Labels read only the end rows: an empty string draws nothing.
    text({
      fontSize: 11,
      text: (d) => (d.t === 0 ? d.pop + "%" : d.t === 1 ? d.wealth + "%" : ""),
      textAnchor: (d) => (d.t === 0 ? "end" : "start"),
      dx: (d) => (d.t === 0 ? -6 : 6),
      channels: { x: { field: "t" }, y: { field: "mid" } },
    }),
    text({
      fontSize: 11, fontWeight: "bold", fill: "white", textAnchor: "start", dx: 8,
      text: (d) => (d.t === 0 ? d.age : ""),
      channels: { x: { field: "t" }, y: { field: "mid" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Push the boundaries',
      question: 'What share of Britain\'s wealth do you think each age group owns?',
      try: 'Drag a boundary inside the wealth column up or down. The population column is the known reference.',
      why: '`edit.stack.edge()` moves value across the boundary between two neighbouring segments, so the wealth column always sums to 100% by construction. `lock` fixes the population column, and a `guides.custom` ribbon redraws from the live rows after every drag.',
      uses: ['edit.stack.edge()', 'lock', 'guides.custom'],
      code: `const ages = ["16-34’s", "35-54’s", "55-74’s", "Over 75’s"];
const population = [30, 33, 28, 9];
const rows = [
  ...ages.map((age, i) => ({ type: "population", age, value: population[i] })),
  ...ages.map((age) => ({ type: "wealth", age, value: 25 })),   // an even prior
];
const colours = [...d3.schemePRGn[4]].reverse();

// Ribbons between the two stacks, recomputed from whatever the rows are now.
const ribbons = guides.custom(({ data, scales }) => {
  const cum = (type) => { let acc = 0;
    return ages.map((age) => { const v = data.find((d) => d.type === type && d.age === age).value;
      return [acc, (acc += v)]; }); };
  const [p, w] = [cum("population"), cum("wealth")];
  const half = scales.x.bandwidth() / 2;
  const x0 = scales.x.encode("population") + half, x1 = scales.x.encode("wealth") - half;
  return ages.map((age, i) => {
    const pts = d3.range(0, 1.0001, 0.05).map((t) => { const s = t * t * (3 - 2 * t);
      return [x0 + (x1 - x0) * t, p[i][1] + (w[i][1] - p[i][1]) * s]; });
    const low = d3.range(1, -0.0001, -0.05).map((t) => { const s = t * t * (3 - 2 * t);
      return [x0 + (x1 - x0) * t, p[i][0] + (w[i][0] - p[i][0]) * s]; });
    return { type: "path", fill: colours[i], opacity: 0.35, stroke: "white",
      points: [...pts, ...low].map(([x, v]) => [x, scales.y.encode(v)]) };
  });
});

mount(Elicit({
  width: 400, height: 320,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    type:  { type: "categorical", domain: ["population", "wealth"] },
    age:   { type: "ordinal", domain: ages },
    value: { type: "quantitative", domain: [0, 100] },
  },
  lock: (d) => d.type === "population",                            //! the population split is known
  scales: { x: { padding: 0.55 } },
  axes: { x: {}, y: { tickFormat: (v) => v + "%" } },
  guides: [ ribbons ],                                             //! ribbons follow the live rows
  marks: [
    barY({
      stroke: "white",
      channels: {
        stack: { field: "age" },
        x: { field: "type" }, y: { field: "value" },
        fill: { field: "age", legend: { anchor: "right", title: false }, scale: { range: colours } },
      },
      edits: [ edit.stack.edge() ],                                 //! value moves between neighbours; total stays 100
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-overlapping-density-estimations',
  status: 'partial',
  verdict: 'The binned culmen-length proportions per species draw as translucent `areaY` bands under `lineY` outlines. Faceting is not covered by this study, so the two sex panels are emulated by offsetting each panel\'s baseline by hand.',
  needs: ['facet'],
  prep: ['prep-bin', 'prep-calculate'],
  gaps: [
    'No faceting: the FEMALE and MALE panels are one plot whose rows are lifted by a per-panel offset, so they share nothing but a coordinate trick.',
    'The bins are d3\'s 10 thresholds over the niced range, and empty bins are dropped as `binX` does; the facet labels are text on one row per panel.',
  ],
  recreation: {
    code: `const penguins = await plotData("penguins");
const species = ["Adelie", "Chinstrap", "Gentoo"];
const sexes = ["FEMALE", "MALE"];
const colours = ["#4269d0", "#efb118", "#ff725c"];
const [x0, x1] = d3.nice(...d3.extent(penguins, (d) => d.culmen_length_mm), 10);
const bin = d3.bin().domain([x0, x1]).thresholds(10);
const rows = [];
sexes.forEach((sex, panel) => species.forEach((sp) => {
  const base = (1 - panel) * 0.12; // FEMALE on top: each panel sits on its own baseline
  const v = penguins.filter((d) => d.sex === sex && d.species === sp).map((d) => d.culmen_length_mm);
  for (const b of bin(v)) {
    if (!b.length) continue; // like binX, empty bins are dropped
    rows.push({ sex, species: sp, key: sex + sp, x: (b.x0 + b.x1) / 2, base,
      top: base + b.length / penguins.length, label: "" });
  }
}));
for (const sex of sexes) rows.find((r) => r.sex === sex).label = sex; // one facet label each

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 34, left: 70 },
  data: rows,
  schema: {
    sex:     { type: "categorical", domain: sexes },
    species: { type: "categorical", domain: species },
    key:     { type: "categorical" },
    x:       { type: "quantitative", domain: [x0, x1] },
    base:    { type: "quantitative", domain: [0, 0.22] },
    top:     { type: "quantitative", domain: [0, 0.22] },
    label:   { type: "categorical" },
  },
  axes: { x: { title: "culmen_length_mm →" }, y: false },
  marks: [
    areaY({ curve: "natural", fillOpacity: 0.1, stroke: "none",
      channels: { x: { field: "x" }, y1: { field: "base" }, y2: { field: "top" },
                  series: { field: "key" },
                  fill: { field: "species", scale: { range: colours },
                          legend: { anchor: "top", title: false } } } }),
    lineY({ curve: "natural",
      channels: { x: { field: "x" }, y: { field: "top" }, series: { field: "key" },
                  stroke: { field: "species", scale: { range: colours } } } }),
    ruleY({ channels: { y: { field: "base" } }, stroke: "#333" }),
    text({ fontSize: 11, textAnchor: "end", dx: -8, dy: -30,
      channels: { x: { datum: x0 }, y: { field: "base" }, text: { field: "label" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep a density',
      question: 'Gentoo penguins are the largest species. How do you think their culmen lengths are distributed?',
      try: 'Sweep across the chart to draw the Gentoo curve. The grey curves are the other two species, for reference.',
      why: 'A `move({ pick: "sweep" })` on `y` paints every bin the pointer crosses, so a distribution is one stroke. `context` marks the Adelie and Chinstrap rows, drawn by a second `lineY` from their own `bin` column: read-only, out of the sweep\'s reach, and absent from `getData()`.',
      uses: ['move({ pick: "sweep" })', 'context', 'clamp()'],
      code: `const penguins = await plotData("penguins");
const bin = d3.bin().domain([32, 60]).thresholds(d3.range(34, 60, 2));
const share = (species, at = "x") => {
  const v = penguins.filter((d) => d.species === species).map((d) => d.culmen_length_mm);
  return bin(v).map((b) => ({ species, [at]: (b.x0 + b.x1) / 2, share: b.length / v.length }));
};

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 16, right: 16, bottom: 34, left: 48 },
  schema: {
    species: { type: "categorical", domain: ["Adelie", "Chinstrap", "Gentoo"] },
    x:       { type: "quantitative", domain: [32, 60] },
    share:   { type: "quantitative", domain: [0, 0.4] },
    bin:     { type: "quantitative", domain: [32, 60] },        // the other species' own x column
  },
  data: [
    ...share("Adelie", "bin"), ...share("Chinstrap", "bin"),
    ...share("Gentoo").map((d) => ({ ...d, share: 0.07 })),          // a flat prior
  ],
  context: (d) => d.species !== "Gentoo",                            //! the other species are context
  constraints: [ clamp({ field: "share", min: 0, max: 0.4 }) ],
  axes: { x: { title: "culmen length (mm) →" }, y: { title: "share of birds", tickFormat: ".0%", grid: true } },
  marks: [
    lineY({ curve: "natural",
      channels: { x: { field: "bin" }, y: { field: "share" }, series: { field: "species" },
                  stroke: { field: "species", scale: { range: ["#bbb", "#999", "#e15759"] } } } }),
    lineY({ curve: "natural", stroke: "#e15759", handleSize: 3,
      channels: {
        x: { field: "x" },
        y: { field: "share", edit: move({ pick: "sweep" }) },         //! one stroke paints the curve
      },
    }),
  ],
}))`,
    },
    {
      title: 'Sweep a band',
      question: 'How sure are you about the Gentoo distribution? Mark the lowest and highest share you find plausible for each culmen length.',
      try: 'Sweep near the top edge to raise or lower it across the bins you cross; sweep near the bottom edge to move that one.',
      why: 'Each bin is one row with a `lo` and a `hi`. `edit.line.sweep()` on both `y1` and `y2` of the `areaY` paints whichever edge is nearest where the drag starts, so one stroke shapes a whole edge of the band. `ordering` keeps the band from turning inside out, and the Adelie and Chinstrap curves are `context` rows.',
      uses: ['edit.line.sweep()', 'ordering()', 'context'],
      code: `const penguins = await plotData("penguins");
const bin = d3.bin().domain([32, 60]).thresholds(d3.range(34, 60, 2));
const share = (species, at = "x") => {
  const v = penguins.filter((d) => d.species === species).map((d) => d.culmen_length_mm);
  return bin(v).map((b) => ({ species, [at]: (b.x0 + b.x1) / 2, share: b.length / v.length }));
};

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 16, right: 16, bottom: 34, left: 48 },
  schema: {
    x:  { type: "quantitative", domain: [32, 60] },
    lo: { type: "quantitative", domain: [0, 0.4] },
    hi: { type: "quantitative", domain: [0, 0.4] },
    species: { type: "categorical", domain: ["Adelie", "Chinstrap"] }, // the other species' own columns
    bin:     { type: "quantitative", domain: [32, 60] },
    share:   { type: "quantitative" },
  },
  data: [
    ...share("Adelie", "bin"), ...share("Chinstrap", "bin"),
    ...share("Gentoo").map(({ x }) => ({ x, lo: 0.02, hi: 0.12 })), // a wide, flat start
  ],
  context: (d) => d.species != null,                                 //! the other species are context
  constraints: [ ordering({ field: ["lo", "hi"] }) ],                //! the band can't turn inside out
  axes: { x: { title: "culmen length (mm) →" }, y: { title: "share of birds", tickFormat: ".0%", grid: true } },
  marks: [
    lineY({ curve: "natural",
      channels: { x: { field: "bin" }, y: { field: "share" }, series: { field: "species" },
                  stroke: { field: "species", scale: { range: ["#bbb", "#999"] } } } }),
    areaY({ curve: "natural", fill: "#e15759", fillOpacity: 0.3, stroke: "#e15759",
      channels: {
        x:  { field: "x" },
        y1: { field: "lo", edit: edit.line.sweep() },                  //! sweep the lower edge …
        y2: { field: "hi", edit: edit.line.sweep() },                  //! … or the upper one
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-density-estimation',
  status: 'full',
  verdict: 'A binned weight distribution of Olympic athletes, drawn as a light `areaY` under a `lineY` outline at each bin\'s midpoint.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [
    'Bins use d3\'s Scott thresholds, which is what Plot\'s automatic binning does; the edges may still differ by a bin.',
  ],
  recreation: {
    code: `const olympians = await plotData("olympians");
// Plot's automatic thresholds follow Scott's rule.
const bins = d3.bin().thresholds(d3.thresholdScott)(olympians.map((d) => d.weight).filter((w) => w != null));
const rows = bins.map((b) => ({ weight: (b.x0 + b.x1) / 2, count: b.length }));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 30, left: 44 },
  data: rows,
  schema: {
    weight: { type: "quantitative", domain: [bins[0].x0, bins.at(-1).x1] },
    count:  { type: "quantitative", domain: [0, d3.max(rows, (d) => d.count)] },
  },
  axes: { x: { title: "weight →" }, y: { title: "Frequency", grid: true } },
  marks: [
    areaY({ fill: "#222", fillOpacity: 0.2, stroke: "none",
      channels: { x: { field: "weight" }, y: { field: "count" } } }),
    lineY({ stroke: "#222", strokeWidth: 1,
      channels: { x: { field: "weight" }, y: { field: "count" } } }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Draw it from nothing',
      question: 'How are Olympic athletes\' body weights distributed? Sketch the shape.',
      try: 'Drag across the empty plot from left to right to draw the curve. Drag again over part of it to reshape.',
      why: 'The chart starts with no rows. `edit.line.draw` mints one row per weight in `samples` as your stroke crosses it, and the `areaY` beneath fills whatever you drew — the question has no prior to anchor on.',
      uses: ['edit.line.draw()'],
      code: `const weights = d3.range(30, 171, 10);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 30, left: 24 },
  data: [],
  schema: {
    weight: { type: "quantitative", domain: [30, 170] },
    share:  { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: { title: "weight (kg) →" }, y: { title: "how common (relative)", ticks: 0 } },
  marks: [
    areaY({ curve: "natural", fill: "#4269d0", fillOpacity: 0.2, stroke: "none",
      channels: { x: { field: "weight" }, y: { field: "share" } } }),
    lineY({ curve: "natural", stroke: "#4269d0", handleSize: 3,
      channels: { x: { field: "weight" }, y: { field: "share" } },
      edits: [ edit.line.draw({ samples: weights }) ],               //! the stroke mints one row per weight
    }),
  ],
}))`,
    },
    {
      title: 'Sweep a band',
      question: 'What share of Olympic athletes falls in each 10 kg weight class? Give a range you are confident about.',
      try: 'Sweep along the top edge to set the upper bounds, then along the bottom edge for the lower ones. Each stroke moves the edge it starts nearest.',
      why: 'An uncertain density is a band, one row per weight class with a `lo` and a `hi`. `edit.line.sweep()` on the `areaY`\'s `y1` and `y2` paints the edge nearest the start of the drag, so a range takes two strokes, and `ordering` stops a stroke dragging one edge through the other.',
      uses: ['edit.line.sweep()', 'ordering()'],
      code: `const classes = d3.range(45, 146, 10); // class midpoints, kg

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 32, left: 48 },
  data: classes.map((weight) => ({ weight, lo: 2, hi: 10 })),    // a wide, flat start
  schema: {
    weight: { type: "quantitative", domain: [45, 145] },
    lo:     { type: "quantitative", domain: [0, 40] },
    hi:     { type: "quantitative", domain: [0, 40] },
  },
  constraints: [ ordering({ field: ["lo", "hi"] }) ],              //! lower bound ≤ upper bound
  axes: { x: { title: "weight (kg) →" }, y: { title: "share of athletes (%)", grid: true } },
  marks: [
    areaY({ curve: "monotoneX", fill: "#222", fillOpacity: 0.2, stroke: "#222",
      channels: {
        x:  { field: "weight" },
        y1: { field: "lo", edit: edit.line.sweep() },                  //! a stroke near the bottom edge …
        y2: { field: "hi", edit: edit.line.sweep() },                  //! … or near the top edge
      },
    }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-variable-fill-area',
  status: 'full',
  verdict: 'One `areaY` under Apple\'s closing price, filled with a horizontal `gradient` whose stops are each day\'s volume on a log turbo ramp, so the colour varies along the curve as Plot\'s `z: null` area does; the `fill` channel\'s log scale supplies the legend.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The gradient\'s stops are computed in JavaScript from the same log scale, at each day\'s fraction of the time axis; a gradient spans the mark\'s own box, which here is the full date range.',
    'A field on `fill` also groups rows into series, so a constant `ticker` column on `series` keeps it one area (Plot\'s `z: null`).',
    'The log turbo ramp is handed in as a live d3 scale: `scale: { type: "log", scheme: "turbo" }` still interpolates only between turbo\'s two end colours.',
    'The colour legend labels its ramp with evenly spaced linear ticks rather than Plot\'s log ticks.',
  ],
  recreation: {
    code: `const aapl = await plotData("aapl");
const colour = d3.scaleSequentialLog(d3.interpolateTurbo).domain(d3.extent(aapl, (d) => d.Volume));
// Each day's volume holds from that day to the next: two stops per day.
const [t0, t1] = d3.extent(aapl, (d) => d.Date);
const at = (d) => (d.Date - t0) / (t1 - t0);
const stops = aapl.slice(1).flatMap((d, i) => [[at(aapl[i]), colour(aapl[i].Volume)], [at(d), colour(aapl[i].Volume)]]);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  data: aapl.map(({ Date, Close, Volume }) => ({ ticker: "AAPL", Date, Close, Volume })),
  schema: {
    ticker: { type: "categorical" },
    Date:   { type: "temporal" },
    Close:  { type: "quantitative", domain: [0, 200] },
    Volume: { type: "quantitative", domain: d3.extent(aapl, (d) => d.Volume) },
  },
  axes: { x: {}, y: { grid: true } },
  marks: [
    areaY({
      fillOpacity: 1, stroke: "none",
      gradient: { stops, direction: "horizontal" },                  // the fill that varies along x
      channels: {
        x: { field: "Date" }, y: { field: "Close" },
        series: { field: "ticker" },                                 // one area: Plot's z: null
        fill: { field: "Volume", scale: colour,                      // the legend's scale
                legend: { anchor: "top", title: "Volume", tickFormat: "~s", ticks: 3 } },
      },
    }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Click to cycle',
      question: 'In which quarters do you think Apple\'s trading volume was heaviest, and in which lightest?',
      try: 'Click a quarter to cycle its volume between light, normal and heavy.',
      why: 'A `cycle()` on the `fill` channel steps the clicked row\'s `level` through its schema domain, so the answer is a colour you set rather than a number you type. The quarters\' heights are the real closing prices, as context.',
      uses: ['cycle()', 'legend'],
      code: `const aapl = await plotData("aapl");
const q = (d) => d.Date.getUTCFullYear() + Math.floor(d.Date.getUTCMonth() / 3) / 4;
const rows = d3.flatRollup(aapl.filter((d) => d.Date.getUTCFullYear() >= 2014),
  (v) => d3.mean(v, (d) => d.Close), q)
  .map(([start, close]) => ({ start, end: start + 0.25, close: Math.round(close), level: "normal" }));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  data: rows,
  schema: {
    start: { type: "quantitative", domain: [2014, 2018.5] },
    end:   { type: "quantitative", domain: [2014, 2018.5] },
    close: { type: "quantitative", domain: [0, 200] },
    level: { type: "ordinal", domain: ["light", "normal", "heavy"] },
  },
  axes: { x: { tickFormat: "d" }, y: { title: "Quarterly mean close ($)", grid: true } },
  marks: [
    rectY({
      stroke: "white", strokeWidth: 0.5,
      channels: {
        x1: { field: "start" }, x2: { field: "end" }, y: { field: "close" },
        fill: { field: "level", edit: cycle(),                       //! a click steps through the domain
                legend: { anchor: "top", title: "volume" },
                scale: { range: ["#9ecae1", "#4292c6", "#08306b"] } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-facet-wrap',
  status: 'partial',
  verdict: 'Fourteen small area charts in a three-column wrap, each industry\'s unemployment normalized to its own extent. Faceting is not covered by this study, so the wrap is emulated by placing every panel at an offset in one shared coordinate space.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'No `fx`/`fy`: each panel\'s column and row become an offset added to the date and value, so the "facets" are one chart with no per-panel scales.',
    'The panel frames are drawn by a `guides.custom` from the scales.',
  ],
  recreation: {
    code: `const industries = await plotData("industries");
const keys = [...new Set(industries.map((d) => d.industry))];
const n = 3, gap = 0.04;
const [t0, t1] = d3.extent(industries, (d) => d.date);
const extent = d3.rollup(industries, (v) => d3.extent(v, (d) => d.unemployed), (d) => d.industry);
const rows = industries.map((d) => {
  const i = keys.indexOf(d.industry), col = i % n, row = Math.floor(i / n);
  const [lo, hi] = extent.get(d.industry);
  const base = -row * (1 + gap) - 1;            // panel bottom, rows downward
  return {
    industry: d.industry,
    px: col * (1 + gap) + (d.date - t0) / (t1 - t0),
    base, top: base + 0.9 * (d.unemployed - lo) / (hi - lo), // normalizeY("extent")
    ptop: base + 1, label: "",
  };
});
for (const k of keys) rows.find((r) => r.industry === k).label = k;
const rowsN = Math.ceil(keys.length / n);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  data: rows,
  schema: {
    industry: { type: "categorical" },
    px:       { type: "quantitative", domain: [0, n * (1 + gap) - gap] },
    base:     { type: "quantitative", domain: [-rowsN * (1 + gap) + gap, 0] },
    top:      { type: "quantitative", domain: [-rowsN * (1 + gap) + gap, 0] },
    ptop:     { type: "quantitative", domain: [-rowsN * (1 + gap) + gap, 0] },
    label:    { type: "categorical" },
  },
  axes: false,
  guides: [ guides.custom(({ scales }) => keys.map((k, i) => {
    const c = i % n, r = Math.floor(i / n);
    const x0 = scales.x.encode(c * (1 + gap)), x1 = scales.x.encode(c * (1 + gap) + 1);
    const y0 = scales.y.encode(-r * (1 + gap)), y1 = scales.y.encode(-r * (1 + gap) - 1);
    return { type: "rect", x: x0, y: y0, width: x1 - x0, height: y1 - y0,
      fill: "none", stroke: "#333", strokeWidth: 1 };
  })) ],
  marks: [
    areaY({ fill: "#333", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "px" }, y1: { field: "base" }, y2: { field: "top" },
                  series: { field: "industry" } } }),
    // One label per panel, at its top-left corner.
    text({ fontSize: 9, textAnchor: "start", dx: 4, dy: 9, fill: "#333",
      channels: { x: { field: "px" }, y: { field: "ptop" }, text: { field: "label" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Brush the climb',
      question: 'US unemployment climbed steeply in the late 2000s. Over which months do you think it was rising?',
      try: 'Drag the band\'s edges to set its start and end, or drag its middle to slide the whole span.',
      why: 'The answer is one row with a `start` and an `end`. `brushSpan` on the `rect`\'s `x1`/`x2` reads an edge drag as one endpoint and a body drag as both, through the time scale. Total unemployment is `context`, drawn by an `areaY` from its own `date` and `n` columns, so it informs the answer without being part of `getData()`.',
      uses: ['brushSpan()', 'context'],
      code: `const industries = await plotData("industries");
const total = d3.flatRollup(industries, (v) => d3.sum(v, (d) => d.unemployed), (d) => +d.date)
  .map(([t, n]) => ({ date: new Date(t), n }));
const span = [total[0].date, total.at(-1).date];

mount(Elicit({
  width: 480, height: 240,
  margins: { top: 16, right: 16, bottom: 28, left: 16 },
  schema: {
    start: { type: "temporal", domain: span },
    end:   { type: "temporal", domain: span },
    date:  { type: "temporal", domain: span },
    n:     { type: "quantitative", domain: [0, d3.max(total, (d) => d.n) * 1.05] },
  },
  data: [...total, { start: new Date("2003-01-01"), end: new Date("2005-01-01") }],
  context: (d) => d.date != null,                                     //! the record is context, not data
  axes: { x: {}, y: false },
  marks: [
    areaY({ fill: "#333", fillOpacity: 0.85, stroke: "none",
      channels: { x: { field: "date" }, y: { field: "n" } } }),
    rectY({
      fill: "#e15759", fillOpacity: 0.3, stroke: "#e15759",
      channels: { x1: { field: "start" }, x2: { field: "end" }, y1: { value: 0 }, y2: { value: 196 } },
      edits: [ brushSpan({ edgeInset: 8 }) ],                          //! edges move one end, the body moves both
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-line-chart-with-markers',
  status: 'full',
  verdict: 'Crimean War deaths by cause as three `lineY` series, with a `point` mark over the same rows as Plot\'s `marker: true`: a disc in the series colour with a white edge.',
  needs: [],
  prep: ['prep-reshape'],
  gaps: [],
  recreation: {
    code: `const wide = await plotData("plot-line-chart-with-markers", "crimean-war.csv");
// Pivot taller: one row per (month, cause).
const causes = ["disease", "wounds", "other"];
const crimea = causes.flatMap((cause) => wide.map((d) => ({ date: d.date, cause, deaths: d[cause] })));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 44 },
  data: crimea,
  schema: {
    date:   { type: "temporal" },
    cause:  { type: "categorical", domain: causes },
    deaths: { type: "quantitative", domain: [0, 3000] },
  },
  axes: { x: {}, y: {} },
  marks: [
    ruleY({ channels: { y: { datum: 0 } } }),
    lineY({ channels: { x: { field: "date" }, y: { field: "deaths" }, stroke: { field: "cause" } } }),
    // marker: true — a filled circle with a white edge
    point({ size: 3, stroke: "white", strokeWidth: 1,
      channels: { x: { field: "date" }, y: { field: "deaths" }, fill: { field: "cause" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Drag the markers',
      question: 'A sanitary commission reached the British hospitals in March 1855. How do you think monthly deaths from disease changed over the following year?',
      try: 'Drag a red marker after March 1855 up or down. Values snap to the nearest 100.',
      why: 'Every marker is a handle on its row, so `move()` on `y` writes that month\'s `deaths`. `lock` fixes everything before the commission and every other cause, and `snap` rounds the answer to a plausible precision.',
      uses: ['move()', 'snap()', 'lock'],
      code: `const wide = await plotData("plot-line-chart-with-markers", "crimean-war.csv");
const causes = ["disease", "wounds", "other"];
const cutoff = new Date(Date.UTC(1855, 2, 1));
// After the cutoff, disease starts flat at its March 1855 level.
const march = wide.find((d) => +d.date === +cutoff).disease;
const rows = causes.flatMap((cause) => wide.map((d) => ({
  date: d.date, cause,
  deaths: cause === "disease" && d.date > cutoff ? march : d[cause],
})));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 44 },
  data: rows,
  schema: {
    date:   { type: "temporal" },
    cause:  { type: "categorical", domain: causes },
    deaths: { type: "quantitative", domain: [0, 3000] },
  },
  lock: (d) => d.cause !== "disease" || d.date <= cutoff,             //! only disease after March 1855 is asked
  constraints: [ snap({ field: "deaths", step: 100 }), clamp({ field: "deaths", min: 0 }) ], //! round to 100s
  axes: { x: {}, y: { grid: true } },
  guides: [ guides.rule({ x: cutoff, label: "commission arrives", stroke: "#888", strokeDash: "3 3" }) ],
  marks: [
    lineY({
      handleSize: 3.5,
      channels: {
        x: { field: "date" },
        y: { field: "deaths", edit: move() },                         //! drag a marker to set that month
        stroke: { field: "cause", legend: { anchor: "top", title: false },
                  scale: { range: ["#e15759", "#4e79a7", "#bab0ac"] } }, // handles take the series colour
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-non-temporal-line-chart',
  status: 'full',
  verdict: 'The elevation profile of a Tour de France stage — 1,880 points against distance — as a single `lineY` over a quantitative x.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: {
    code: `const tdf = await plotData("plot-non-temporal-line-chart", "tdf-stage-8-2017.csv");

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 34, left: 44 },
  data: tdf,
  schema: {
    distance:  { type: "quantitative", domain: [0, 190] },
    elevation: { type: "quantitative", domain: [0, 1250] },
  },
  axes: { x: { title: "Distance from stage start (km) →" }, y: { title: "Elevation (m)", grid: true } },
  marks: [
    ruleY({ channels: { y: { datum: 0 } } }),
    lineY({ stroke: "#222", strokeWidth: 1.5,
      channels: { x: { field: "distance" }, y: { field: "elevation" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Click to build',
      question: 'Stage 8 starts at 225 m and finishes at the Station des Rousses after three climbs. Sketch its elevation profile.',
      try: 'Click on empty space to add a point to the profile; drag any point to adjust it.',
      why: '`edit.line.anchor({ into: "nearest" })` inserts a new row where you click, ordered along `distance`, so the profile is built from a few deliberate points instead of a stroke. `lock: "seed"` keeps the known start and finish fixed.',
      uses: ['edit.line.anchor()', 'move()', 'lock'],
      code: `mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 34, left: 44 },
  data: [ { distance: 0, elevation: 225 }, { distance: 187.8, elevation: 1170 } ],
  schema: {
    distance:  { type: "quantitative", domain: [0, 190] },
    elevation: { type: "quantitative", domain: [0, 1500] },
  },
  lock: "seed",                                                      //! start and finish are known
  axes: { x: { title: "Distance from stage start (km) →" }, y: { title: "Elevation (m)", grid: true } },
  marks: [
    ruleY({ channels: { y: { datum: 0 } } }),
    lineY({ stroke: "#222", strokeWidth: 1.5, handleSize: 4,
      channels: { x: { field: "distance" }, y: { field: "elevation", edit: move() } },
      edits: [ edit.line.anchor({ into: "nearest" }) ],              //! a click adds a point to the profile
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-connected-scatterplot',
  status: 'full',
  verdict: 'Hannah Fairfield\'s "Driving Shifts Into Reverse": a `path` through miles driven and gas price in year order, with a Catmull–Rom curve, `point` markers and a label every five years.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot\'s `inset: 10` is approximated by padding the schema domains.',
  ],
  recreation: {
    code: `const driving = await plotData("plot-connected-scatterplot", "driving.csv");
const rows = driving.map((d) => ({ ...d, label: d.year % 5 === 0 ? String(d.year) : "" }));

mount(Elicit({
  width: 480, height: 340,
  margins: { top: 16, right: 20, bottom: 34, left: 44 },
  data: rows,
  schema: {
    side:  { type: "categorical" },
    year:  { type: "quantitative" },
    miles: { type: "quantitative", domain: [3500, 10200] },
    gas:   { type: "quantitative", domain: [1.3, 3.4] },
    label: { type: "categorical" },
  },
  axes: {
    x: { grid: true, title: "Miles driven (per person-year) →", ticks: 5 },
    y: { title: "Cost of gasoline ($ per gallon)", grid: true },
  },
  marks: [
    path({
      curve: "catmullRom", stroke: "#222", strokeWidth: 1.5,
      channels: { x: { field: "miles" }, y: { field: "gas" }, order: { field: "year" } },
    }),
    // marker: true — a filled circle with a white edge
    point({ size: 3, fill: "#222", stroke: "white", strokeWidth: 1,
      channels: { x: { field: "miles" }, y: { field: "gas" } } }),
    text({ fontSize: 10, dy: -8, fill: "#222",
      channels: { x: { field: "miles" }, y: { field: "gas" }, text: { field: "label" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Steer the trajectory',
      question: 'Where did American driving and gas prices go between 2011 and 2020?',
      try: 'Drag the orange points anywhere; the path follows them in year order.',
      why: 'A `path` connects rows by its `order` channel, not by x, so a point can go backwards in miles and the curve still runs through the years. A `move()` on both `x` and `y` reshapes the trajectory, and a `lock` predicate keeps 1956–2010 fixed.',
      uses: ['path', 'move()', 'lock'],
      code: `const driving = await plotData("plot-connected-scatterplot", "driving.csv");
const last = driving.at(-1);
// Ten future years, seeded along a short continuation of 2010.
const future = d3.range(1, 11).map((k) => ({
  year: 2010 + k, miles: last.miles + 120 * k, gas: last.gas + 0.12 * k, guess: "yes",
}));
const rows = [...driving.map((d) => ({ year: d.year, miles: d.miles, gas: d.gas, guess: "no" })), ...future];

mount(Elicit({
  width: 480, height: 340,
  margins: { top: 16, right: 20, bottom: 34, left: 44 },
  data: rows,
  schema: {
    year:  { type: "quantitative" },
    miles: { type: "quantitative", domain: [3500, 11000] },
    gas:   { type: "quantitative", domain: [1, 4.5] },
    guess: { type: "categorical", domain: ["no", "yes"] },
  },
  lock: (d) => d.guess === "no",                                      //! the record is fixed …
  axes: { x: { grid: true, title: "Miles driven (per person-year) →", ticks: 5 }, y: { grid: true, title: "Cost of gasoline ($ per gallon)" } },
  marks: [
    path({
      curve: "catmullRom", strokeWidth: 1.5, stroke: "#222", handles: "hit",
      channels: {
        x: { field: "miles" }, y: { field: "gas" },
        order: { field: "year" },                                     //! … and the path runs in year order
      },
      edits: [ move({ channels: ["x", "y"] }) ],                      //! drag a year anywhere in the plane
    }),
    // The markers: the record in black, your years in orange. A field on the
    // path itself would split it into two series, one per colour.
    point({ size: 3.5, stroke: "white", strokeWidth: 1,
      channels: { x: { field: "miles" }, y: { field: "gas" },
                  fill: { field: "guess", scale: { range: ["#222", "#f28e2c"] } } } }),
    text({ fontSize: 10, dy: -9, fill: "#555",
      text: (d) => (d.year % 5 === 0 ? String(d.year) : ""),
      channels: { x: { field: "miles" }, y: { field: "gas" } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-window-and-map',
  status: 'partial',
  verdict: 'Unemployment for 45 US metro divisions with each line coloured by its month-to-month change; since a `lineY` series has one stroke, every line is cut into one two-point series per month.',
  needs: ['variable-paint-line'],
  prep: ['prep-window', 'prep-calculate'],
  gaps: [
    'No `z: null` equivalent: each month-to-month step is its own two-row series (about 7,400 paths) so that it can take its own colour.',
    'Plot\'s "BuYlRd" scheme is not a d3 scheme; the reversed RdYlBu interpolator is handed in as a live scale.',
  ],
  recreation: {
    code: `const bls = await plotData("plot-window-and-map", "bls-metro-unemployment.csv");
// The window: each month's difference from the previous month, per division,
// stored on a two-row segment so it can carry its own stroke.
const rows = [];
let seg = 0;
for (const v of d3.group(bls, (d) => d.division).values()) {
  for (let i = 1; i < v.length; i++, seg++) {
    const diff = v[i].unemployment - v[i - 1].unemployment;
    rows.push({ seg, date: v[i - 1].date, unemployment: v[i - 1].unemployment, diff },
              { seg, date: v[i].date, unemployment: v[i].unemployment, diff });
  }
}

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 34 },
  data: rows,
  schema: {
    seg:          { type: "categorical" },
    date:         { type: "temporal" },
    unemployment: { type: "quantitative", domain: [0, 18] },
    diff:         { type: "quantitative" },
  },
  axes: { x: {}, y: { grid: true } },
  marks: [
    ruleY({ channels: { y: { datum: 0 } } }),
    lineY({
      strokeWidth: 1,
      channels: {
        x: { field: "date" }, y: { field: "unemployment" },
        series: { field: "seg" },
        stroke: { field: "diff",
                  scale: d3.scaleSequential((t) => d3.interpolateRdYlBu(1 - t)).domain([-0.5, 0.5]).clamp(true) },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep the recession',
      question: 'Detroit\'s unemployment rate was 8.7% in January 2008. How did it move each month through 2008 and 2009?',
      try: 'Sweep across the chart to draw the line. Each marker turns red where it rises from the month before and blue where it falls.',
      why: 'A sweep writes `rate` month by month, and the markers\' `fill` is a derived `{ fn }` channel that reads the previous row from the live data — so the difference window that Plot computes once is recomputed after every stroke.',
      uses: ['move({ pick: "sweep" })', '{ fn } channel', 'lock'],
      code: `const bls = await plotData("plot-window-and-map", "bls-metro-unemployment.csv");
const detroit = bls.filter((d) => d.division.startsWith("Detroit-Livonia")
  && d.date >= new Date("2007-01-01") && d.date < new Date("2010-01-01"));
// 2007 is the record; 2008–09 starts flat at January 2008's rate.
const rows = detroit.map((d) => ({ date: d.date,
  rate: d.date.getUTCFullYear() < 2008 ? d.unemployment : 8.7 }));
const colour = d3.scaleSequential((t) => d3.interpolateRdYlBu(1 - t)).domain([-0.8, 0.8]).clamp(true);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 16, bottom: 28, left: 34 },
  data: rows,
  schema: {
    date: { type: "temporal" },
    rate: { type: "quantitative", domain: [0, 20] },
  },
  lock: (d) => d.date.getUTCFullYear() < 2008,                        //! 2007 is given
  axes: { x: {}, y: { grid: true, tickFormat: (v) => v + "%" } },
  marks: [
    lineY({
      stroke: "#999", handleSize: 4,
      channels: {
        x: { field: "date" },
        y: { field: "rate", edit: move({ pick: "sweep" }) },          //! one stroke draws the months
        // the window, recomputed live: this month minus the previous one
        fill: { fn: (d, i, data) => colour(i ? d.rate - data[i - 1].rate : 0) }, //! colour = month-to-month change
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-spherical-line-with-a-varying-stroke',
  status: 'partial',
  verdict: 'The Beagle\'s route over an equirectangular world map, built from `geoBasemap` and a row-connecting `geoLine` whose legs follow great circles and clip at the antimeridian; the stroke that varies along the route is faked with one two-point series per leg.',
  needs: ['variable-paint-line'],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [
    'No `z: null`: each leg is its own two-row series so it can take its own colour from the leg index.',
  ],
  recreation: {
    code: `const raw = await plotData("plot-spherical-line-with-a-varying-stroke", "beagle.csv", { type: "text" });
const beagle = d3.csvParseRows(raw, ([lon, lat]) => [+lon, +lat]);
const world = await plotData("plot-spherical-line-with-a-varying-stroke", "countries-110m.json");
const land = topojson.feature(world, world.objects.land);
// One leg per pair of consecutive positions, tagged with its index for colour.
const rows = beagle.slice(1).flatMap((p, i) => [
  { leg: i, lon: beagle[i][0], lat: beagle[i][1] }, { leg: i, lon: p[0], lat: p[1] },
]);

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "equirectangular", domain: { type: "Sphere" } },
  data: rows,
  schema: {
    leg: { type: "quantitative", domain: [0, beagle.length - 2] },
    lon: { type: "quantitative", domain: [-180, 180] },
    lat: { type: "quantitative", domain: [-90, 90] },
  },
  marks: [
    geoBasemap({ geojson: { type: "Sphere" }, fill: "none", stroke: "#333", strokeWidth: 0.8 }),
    geoBasemap({ geojson: land, fill: "none", stroke: "#333", strokeWidth: 0.6 }),
    geoLine({
      strokeWidth: 1.5,
      channels: {
        lon: { field: "lon" }, lat: { field: "lat" },
        series: { field: "leg" },
        stroke: { field: "leg", scale: d3.scaleSequential(d3.interpolateTurbo).domain([0, beagle.length - 2]) },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Draw the voyage',
      question: 'The Beagle left Plymouth in 1831 and came home five years later. Draw the route you think it sailed.',
      try: 'Press near Britain and drag in one stroke to draw the route. Press Reset to start over.',
      why: '`edit.geo.draw` inverts each pointer position through the projection and appends the lon/lat pair to one row\'s `coordinates` list, so a stroke on the map becomes a geographic line in the data.',
      uses: ['edit.geo.draw()', 'geoBasemap'],
      code: `const world = await plotData("plot-spherical-line-with-a-varying-stroke", "countries-110m.json");
const land = topojson.feature(world, world.objects.land);

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "equirectangular", domain: { type: "Sphere" } },
  data: [],
  schema: { coordinates: { type: "categorical" } },
  marks: [
    geoBasemap({ geojson: land, fill: "#eee", stroke: "#999", strokeWidth: 0.5 }),
    geoLine({
      stroke: "#e15759", strokeWidth: 2, handleSize: 3,
      channels: { coordinates: { field: "coordinates", scale: null } },
      edits: [ edit.geo.draw() ],                                    //! a stroke becomes a lon/lat route
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-area-chart-missing-data',
  status: 'full',
  verdict: 'A blue `areaY` over Apple\'s closing price breaks wherever the value is `NaN`, as Plot\'s does, over a grey `areaY` drawn from the known rows only, which interpolates straight across the gaps.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot filters the grey layer with a `filter` option; here the known rows are repeated as `context` rows with their own columns, which the grey area draws.',
  ],
  recreation: {
    code: `const aapl = await plotData("aapl");
// January–March of every year is missing.
const rows = aapl.map((d) => ({ Date: d.Date, Close: d.Date.getUTCMonth() < 3 ? null : d.Close }));
// The known rows again, in columns of their own: the grey layer.
const known = rows.filter((d) => d.Close != null).map((d) => ({ day: d.Date, price: d.Close }));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 28, left: 48 },
  schema: {
    Date:  { type: "temporal" },
    Close: { type: "quantitative", domain: [0, 200] },
    day:   { type: "temporal" },
    price: { type: "quantitative", domain: [0, 200] },
  },
  data: [...known, ...rows],
  context: (d) => d.day != null,
  axes: { x: {}, y: { title: "Daily close ($)", grid: true } },
  marks: [
    // Grey: the known rows only, so the area interpolates across the gaps.
    areaY({ fill: "#ccc", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "day" }, y: { field: "price" } } }),
    // Blue: every row; a missing value breaks the area there.
    areaY({ fill: "steelblue", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "Date" }, y: { field: "Close" } } }),
    ruleY({ channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Fill the gaps',
      question: 'Apple\'s monthly closing prices for January to March are missing every year. What do you think they were?',
      try: 'Sweep across a gap to draw the missing months. The rest of the record is fixed.',
      why: '`edit.line.sweep()` repaints each month the pointer crosses. The gaps start on the straight line between their known neighbours, which is the grey area\'s answer: the grey layer draws the known months again as `context` rows with their own columns, so it keeps showing that interpolation under whatever you draw. A `lock` predicate leaves only the missing months open, so a careless stroke cannot rewrite the record.',
      uses: ['edit.line.sweep()', 'lock', 'context'],
      code: `const aapl = await plotData("aapl");
const monthly = d3.flatRollup(aapl, (v) => d3.mean(v, (d) => d.Close),
  (d) => d.Date.getUTCFullYear() + d.Date.getUTCMonth() / 12)
  .map(([t, close]) => ({ t, close: Math.round(close), missing: Math.round((t % 1) * 12) < 3 }));
const known = monthly.filter((d) => !d.missing);
// A sweep paints handles, and a row with no value draws none, so each gap
// starts on the straight line between its known neighbours.
const interp = d3.scaleLinear(known.map((d) => d.t), known.map((d) => d.close));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 22, right: 16, bottom: 28, left: 48 },
  schema: {
    t:       { type: "quantitative", domain: [2013.33, 2018.4] },
    close:   { type: "quantitative", domain: [0, 200] },
    missing: { type: "categorical", domain: [true, false] },
    knownT:     { type: "quantitative" },                      // the grey layer's own columns
    knownClose: { type: "quantitative" },
  },
  data: [
    ...known.map((d) => ({ knownT: d.t, knownClose: d.close })),
    ...monthly.map((d) => (d.missing ? { ...d, close: Math.round(interp(d.t)) } : d)),
  ],
  context: (d) => d.knownT != null,                                //! the interpolation, as context
  lock: (d) => !d.missing,                                         //! only the gaps are open
  axes: { x: { tickFormat: "d" }, y: { title: "Monthly close ($)", grid: true } },
  marks: [
    areaY({ fill: "#ccc", fillOpacity: 1, stroke: "none",
      channels: { x: { field: "knownT" }, y: { field: "knownClose" } } }),
    areaY({ fill: "steelblue", fillOpacity: 0.35, stroke: "none",
      channels: { x: { field: "t" }, y: { field: "close" } } }),
    lineY({ stroke: "steelblue", handleSize: 2.5,
      channels: {
        x: { field: "t" },
        y: { field: "close", edit: edit.line.sweep() },                //! a stroke fills the months it crosses
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-slope-chart',
  status: 'full',
  verdict: 'Tufte\'s slopegraph of government receipts, 1970 to 1979: one `lineY` per country between two point positions, with labels on both ends nudged apart by the same small force simulation the original runs.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The label dodge runs in JavaScript before `Elicit`, in pixel units of a scale built to match the chart (Plot does it in an initializer).',
  ],
  recreation: {
    code: `const receipts = (await plotData("plot-slope-chart", "gdp-receipts.csv"))
  .map((d) => ({ ...d, year: String(d.year) }));
// occlusionY, as in the original: a 1-D force layout per column, in pixels.
const H = 460, y = d3.scaleLinear([20, 58], [H, 0]);
for (const v of d3.group(receipts, (d) => d.year).values()) {
  const nodes = v.map((d) => ({ fx: 0, y: y(d.receipts), d }));
  d3.forceSimulation(nodes).force("y", d3.forceY((n) => y(n.d.receipts)))
    .force("collide", d3.forceCollide(5.5)).stop().tick(20);
  for (const n of nodes) n.d.ly = y.invert(n.y);
}

mount(Elicit({
  width: 480, height: 520,
  margins: { top: 30, right: 112, bottom: 30, left: 104 },
  data: receipts,
  schema: {
    year:     { type: "categorical", domain: ["1970", "1979"] },
    country:  { type: "categorical" },
    receipts: { type: "quantitative", domain: [20, 58] },
    ly:       { type: "quantitative", domain: [20, 58] },
  },
  scales: { x: { padding: 0.05 } },
  axes: { x: { anchor: "top" }, y: false },
  caption: "Current receipts of government as a percentage of gross domestic product",
  theme: { caption: { fontSize: 10 } }, // the caption starts at the plot's left edge and does not wrap
  marks: [
    lineY({ stroke: "#222", strokeWidth: 1,
      channels: { x: { field: "year" }, y: { field: "receipts" }, series: { field: "country" } } }),
    text({
      fontSize: 10, fill: "#222",
      text: (d) => (d.year === "1970" ? d.country + " " + d.receipts : d.receipts + " " + d.country),
      textAnchor: (d) => (d.year === "1970" ? "end" : "start"),
      dx: (d) => (d.year === "1970" ? -3 : 3),
      channels: { x: { field: "year" }, y: { field: "ly" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Drag the right ends',
      question: 'In 1979 these governments took in the shares of GDP shown on the left. What share do you think each took in 2020?',
      try: 'Drag the dot at the right end of a line up or down.',
      why: 'A slopegraph is two values per row, so each country is two rows and only the 2020 rows carry an edit. `lock` fixes 1979, `clamp` keeps answers between 10% and 70%, and the label is a `{ fn }` of the live value, so the number moves with the dot.',
      uses: ['move()', 'lock', 'clamp()'],
      code: `const receipts = await plotData("plot-slope-chart", "gdp-receipts.csv");
const pick = ["Sweden", "Norway", "France", "Britain", "Italy", "United States", "Japan"];
const known = receipts.filter((d) => d.year === 1979 && pick.includes(d.country));
const rows = known.flatMap((d) => [
  { country: d.country, year: "1979", receipts: d.receipts },
  { country: d.country, year: "2020", receipts: d.receipts },   // seeded flat
]);

mount(Elicit({
  width: 480, height: 320,
  margins: { top: 30, right: 130, bottom: 16, left: 130 },
  data: rows,
  schema: {
    country:  { type: "categorical", domain: pick },
    year:     { type: "categorical", domain: ["1979", "2020"] },
    receipts: { type: "quantitative", domain: [10, 70] },
  },
  lock: (d) => d.year === "1979",                                    //! 1979 is the record
  constraints: [ clamp({ field: "receipts", min: 10, max: 70 }) ],
  scales: { x: { padding: 0.05 } },
  axes: { x: { anchor: "top" }, y: false },
  marks: [
    lineY({ stroke: "#222", strokeWidth: 1, handleSize: 4,
      channels: {
        x: { field: "year" },
        y: { field: "receipts", edit: move() },                       //! drag a 2020 end
        series: { field: "country" },
      } }),
    text({
      fontSize: 10, fill: "#222",
      text: (d) => (d.year === "1979" ? d.country + " " + d.receipts
        : d.receipts.toFixed(1) + " " + d.country),                   //! the label reads the live value
      textAnchor: (d) => (d.year === "1979" ? "end" : "start"),
      dx: (d) => (d.year === "1979" ? -8 : 8),
      channels: { x: { field: "year" }, y: { field: "receipts" } },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-cancer-survival-rates',
  status: 'full',
  verdict: 'A four-column slopegraph of survival rates for 24 cancers: `lineY` series across a point scale, names and values on the outer columns, values alone in the middle, all nudged apart by a 1-D force layout.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The label dodge is computed in JavaScript before `Elicit`.',
  ],
  recreation: {
    code: `const cancer = await plotData("plot-cancer-survival-rates", "cancer.csv");
const years = ["5 Year", "10 Year", "15 Year", "20 Year"];
const H = 500, y = d3.scaleLinear([0, 100], [H, 0]);
for (const v of d3.group(cancer, (d) => d.year).values()) {
  const nodes = v.map((d) => ({ fx: 0, y: y(d.survival), d }));
  d3.forceSimulation(nodes).force("y", d3.forceY((n) => y(n.d.survival)))
    .force("collide", d3.forceCollide(6.5)).stop().tick(20);
  for (const n of nodes) n.d.ly = y.invert(n.y);
}
const label = (d) => d.year === "5 Year" ? d.name + " " + d.survival
  : d.year === "20 Year" ? d.survival + " " + d.name : String(d.survival);

mount(Elicit({
  width: 480, height: 560,
  margins: { top: 30, right: 112, bottom: 30, left: 112 },
  data: cancer,
  schema: {
    name:     { type: "categorical" },
    year:     { type: "ordinal", domain: years },
    survival: { type: "quantitative", domain: [0, 100] },
    ly:       { type: "quantitative", domain: [0, 100] },
  },
  scales: { x: { padding: 0.05 } },
  axes: { x: { anchor: "top" }, y: false },
  marks: [
    lineY({ stroke: "#222", strokeWidth: 1,
      channels: { x: { field: "year" }, y: { field: "survival" }, series: { field: "name" } } }),
    text({
      fontSize: 9, fill: "#222", text: label, stroke: "white", strokeWidth: 3, //! a halo: no line runs through a number
      textAnchor: (d) => (d.year === "5 Year" ? "end" : d.year === "20 Year" ? "start" : "middle"),
      dx: (d) => (d.year === "5 Year" ? -3 : d.year === "20 Year" ? 3 : 0),
      channels: { x: { field: "year" }, y: { field: "ly" } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Survival only falls',
      question: 'Given each cancer\'s 5-year survival, what do you think its 10-, 15- and 20-year survival is?',
      try: 'Drag the dots in the 10-, 15- and 20-year columns up or down.',
      why: 'Survival to 20 years can\'t exceed survival to 15, so `monotonic({ dir: "down", series: "name" })` repairs every proposal into a non-increasing run per cancer, whichever dot you drag. `monotonic` repairs by moving the neighbours, which a locked 5-year row refuses, so a `constraints.custom` cap holds every later column at or below it.',
      uses: ['move()', 'monotonic()', 'constraints.custom', 'lock'],
      code: `const cancer = await plotData("plot-cancer-survival-rates", "cancer.csv");
const names = ["Breast", "Colon", "Lung and bronchus", "Pancreas", "Prostate"];
const five = new Map(cancer.filter((d) => d.year === "5 Year").map((d) => [d.name, d.survival]));
// 5-year survival is given; every later column starts level with it.
const rows = names.flatMap((name) => [5, 10, 15, 20].map((year) => ({ name, year, survival: five.get(name) })));

mount(Elicit({
  width: 480, height: 320,
  margins: { top: 30, right: 120, bottom: 16, left: 52 },
  data: rows,
  schema: {
    name:     { type: "categorical", domain: names },
    year:     { type: "quantitative", domain: [5, 20] },
    survival: { type: "quantitative", domain: [0, 100] },
  },
  lock: (d) => d.year === 5,                                          //! 5-year survival is known
  constraints: [
    monotonic({ field: "survival", along: "year", dir: "down", series: "name" }), //! a later column can't be higher
    // monotonic makes neighbours give way, but the locked 5-year value can't, so cap at it.
    constraints.custom(({ data }) => data.map((d) => ({ ...d,                    //! nothing beats the 5-year rate
      survival: Math.max(0, Math.min(d.survival, five.get(d.name))) })), { type: "cap" }),
  ],
  axes: { x: { anchor: "top", tickValues: [5, 10, 15, 20], tickFormat: (v) => v + " Year" },
          y: { title: "Survival", tickFormat: (v) => v + "%" } },
  marks: [
    lineY({ strokeWidth: 1.5, handleSize: 4,
      channels: {
        x: { field: "year" },
        y: { field: "survival", edit: move() },
        series: { field: "name" }, stroke: { field: "name" },      // handles take the series colour
      } }),
    text({ fontSize: 10, textAnchor: "start", dx: 8,
      text: (d) => (d.year === 20 ? Math.round(d.survival) + " " + d.name : ""),
      channels: { x: { field: "year" }, y: { field: "survival" }, fill: { field: "name" } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-mareys-trains',
  status: 'full',
  verdict: 'Marey\'s graphical timetable for the weekday Caltrain schedule: stations to scale along x, time running down, one `lineY` stringline per train coloured by service type, with station rules and rotated station names.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The weekday/weekend radio is not reproduced; the chart shows the weekday schedule.',
    'At 480 × 760 the chart is far shorter than the original\'s 1,800 px, so stringlines are steeper and closer.',
  ],
  recreation: {
    code: `const trains = await plotData("plot-mareys-trains", "caltrain.csv");
// Minutes after 2am, so a train that runs past midnight stays on the chart.
const parse = d3.utcParse("%I:%M%p");
const minutes = (s) => { const t = parse(s); return (t.getUTCHours() * 60 + t.getUTCMinutes() + 1320) % 1440; };
const asTime = (m) => d3.utcFormat("%-I %p")(new Date(Date.UTC(2000, 0, 1, 2, m)));
const seen = new Set();
const rows = trains.filter((d) => d.schedule === "weekday").map((d) => ({
  train: d.train, direction: d.direction, speed: d.speed, station: d.station, distance: d.distance,
  time: minutes(d.time), clock: d.time,
  // The first row at each station carries its rule and its name.
  first: !seen.has(d.station) && !!seen.add(d.station),
}));

mount(Elicit({
  width: 480, height: 760,
  margins: { top: 96, right: 10, bottom: 10, left: 40 },
  data: rows,
  schema: {
    train:    { type: "categorical" },
    direction: { type: "categorical", domain: ["N", "S"] },
    speed:    { type: "categorical", domain: ["normal", "limited", "bullet"] },
    station:  { type: "categorical" },
    distance: { type: "quantitative", domain: [0, 1060] },
    time:     { type: "quantitative", domain: [120, 1440] },
    clock:    { type: "categorical" },
    first:    { type: "categorical", domain: [true, false] },
  },
  scales: { y: { reverse: true } },
  axes: { x: false, y: { grid: true, tickValues: d3.range(1, 24).map((h) => h * 60), tickFormat: asTime } },
  marks: [
    ruleX({ strokeDash: "2 2", strokeOpacity: (d) => (d.first ? 0.25 : 0),
      channels: { x: { field: "distance" } } }),
    text({ fontSize: 9, angle: 90, textAnchor: "start", fill: "#333",
      text: (d) => (d.first ? d.station : ""),
      channels: { x: { field: "distance" }, y: { value: -6 } } }),
    lineY({
      strokeWidth: 1,
      channels: {
        x: { field: "distance" }, y: { field: "time" },
        series: { field: "train" },
        stroke: { field: "speed", legend: { anchor: "top", title: false },
                  scale: { range: ["rgb(34, 34, 34)", "rgb(183, 116, 9)", "rgb(192, 62, 29)"] } },
      },
    }),
    // marker: "circle", with Plot's title as a tip
    point({ size: 2, stroke: "white", strokeWidth: 0.5,
      tip: (d) => [d.train + d.direction, d.station, d.clock],
      channels: {
        x: { field: "distance" }, y: { field: "time" },
        fill: { field: "speed", scale: { range: ["rgb(34, 34, 34)", "rgb(183, 116, 9)", "rgb(192, 62, 29)"] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Time a new train',
      question: 'A new baby bullet leaves San Francisco at 8:05 and stops only at Millbrae, Hillsdale, Palo Alto, Mountain View and San Jose. When does it reach each stop?',
      try: 'Drag each red stop down to its arrival time. A stop can\'t be earlier than the one before it.',
      why: 'The new train is six rows at fixed station distances, so a `move()` on `y` writes only its `time`. `monotonic` along `distance`, per `train`, means the stringline can never run backwards in time, a `constraints.custom` floor keeps every stop after the locked 8:05 departure (`clamp` would hold only the dragged stop), and `lock` keeps the morning\'s scheduled trains as the traffic it has to fit around.',
      uses: ['move()', 'monotonic()', 'constraints.custom', 'lock'],
      code: `const trains = await plotData("plot-mareys-trains", "caltrain.csv");
const parse = d3.utcParse("%I:%M%p");
const minutes = (s) => { const t = parse(s); return t.getUTCHours() * 60 + t.getUTCMinutes(); };
// The morning's southbound weekday trains leaving San Francisco 7:00–9:10.
const firstStop = d3.rollup(trains, (v) => minutes(v[0].time), (d) => d.train);
const context = trains
  .filter((d) => d.schedule === "weekday" && d.direction === "S")
  .filter((d) => firstStop.get(d.train) >= 420 && firstStop.get(d.train) <= 550)
  .filter((d) => d.distance <= 862) // San Francisco to San Jose
  .map((d) => ({ train: String(d.train), speed: d.speed, distance: d.distance, time: minutes(d.time) }));
const stops = { "San Francisco": 0, Millbrae: 249, Hillsdale: 391, "Palo Alto": 604, "Mountain View": 702, "San Jose": 862 };
const yours = Object.values(stops).map((distance) => ({ train: "new", speed: "yours", distance, time: 485 }));
const asTime = (m) => \`\${Math.floor(m / 60)}:\${String(m % 60).padStart(2, "0")}\`;

mount(Elicit({
  width: 480, height: 420,
  margins: { top: 16, right: 16, bottom: 16, left: 44 },
  data: [...context, ...yours],
  schema: {
    train:    { type: "categorical" },
    speed:    { type: "categorical", domain: ["normal", "limited", "bullet", "yours"] },
    distance: { type: "quantitative", domain: [0, 870] },
    time:     { type: "quantitative", domain: [415, 640] },
  },
  lock: (d) => d.train !== "new" || d.distance === 0,                     //! the timetable, and the 8:05 departure, are fixed
  constraints: [
    monotonic({ field: "time", along: "distance", series: "train" }),   //! a stringline can't run back in time
    // monotonic moves the neighbours, so hold every stop of the new train after 8:05.
    constraints.custom(({ data }) => data.map((d) => (d.train === "new" ? { ...d, time: Math.max(485, d.time) } : d)),
      { type: "afterDeparture" }),
  ],
  scales: { y: { reverse: true } },
  axes: { x: { tickValues: Object.values(stops),
               tickFormat: (v) => ["SF", "Millbrae", "Hillsdale", "Palo Alto", "Mtn View", "SJ"][Object.values(stops).indexOf(v)] },
          y: { grid: true, tickValues: d3.range(420, 641, 30), tickFormat: asTime } },
  marks: [
    lineY({
      handleSize: 2, strokeWidth: 1,
      channels: {
        x: { field: "distance" },
        y: { field: "time", edit: move() },                            //! drag a stop to its arrival time
        series: { field: "train" },
        stroke: { field: "speed", scale: { range: ["#222", "#b77409", "#c03e1d", "#e15759"] } }, // handles follow
        strokeWidth: { fn: (d) => (d.train === "new" ? 3 : 1) },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-radar-chart',
  status: 'partial',
  verdict: 'Built the way the original builds it — an azimuthal-equidistant projection centred on the North Pole, with each axis a longitude and each value a colatitude — from `geoBasemap` rings and spokes, `geoPolygon` areas, `geoPoint` dots with a value `tip`, and `geoText` labels. The areas are straight-edged rather than cardinal-closed curves.',
  needs: ['curve-types'],
  prep: ['prep-geo', 'prep-reshape'],
  gaps: [
    'No `cardinal-closed` curve: each phone\'s area is a straight-edged polygon through its eight values.',
    'The value shows in a `tip` box beside the dot rather than as Plot\'s pointer label, and the CSS that highlights the hovered area is missing.',
    'The `radius` channel places an `arc`\'s rim; a radar\'s polygon is not an arc, so `radius` does not apply, and the rings, spokes and polygons are still GeoJSON built in JavaScript for the polar projection.',
  ],
  recreation: {
    code: `const phones = await plotData("plot-radar-chart", "phones.csv");
const keys = Object.keys(phones[0]).filter((k) => k !== "name");
// Each axis is a longitude; a value v sits at latitude 90 - v.
const longitude = d3.scalePoint(keys, [180, -180]).padding(0.5).align(1);
const ring = (r) => d3.geoCircle().center([0, 90]).radius(r)();
// A spherical polygon must wind so that it encloses the small side.
const polygon = (coords) => {
  const g = { type: "Polygon", coordinates: [[...coords, coords[0]]] };
  return d3.geoArea(g) > 2 * Math.PI ? { type: "Polygon", coordinates: [g.coordinates[0].reverse()] } : g;
};
const rows = [
  ...phones.map((p) => ({ name: p.name, geometry: polygon(keys.map((k) => [longitude(k), 90 - p[k]])) })),
  ...phones.flatMap((p) => keys.map((k) => ({ name: p.name, key: k, value: p[k], lon: longitude(k), lat: 90 - p[k] }))),
  ...keys.map((k) => ({ label: k, llon: longitude(k), llat: 90 - 0.57 })),
  ...[0.3, 0.4, 0.5].map((v) => ({ label: v * 100 + "%", llon: 180, llat: 90 - v })),
];

mount(Elicit({
  width: 450, height: 450,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  projection: { type: "azimuthal-equidistant", rotate: [0, -90], domain: ring(0.625) },
  data: rows,
  schema: {
    name:     { type: "categorical", domain: phones.map((p) => p.name) },
    geometry: { type: "categorical" },
    key:      { type: "categorical", domain: keys },
    value:    { type: "quantitative" },
    lon:      { type: "quantitative" }, lat:  { type: "quantitative" },
    llon:     { type: "quantitative" }, llat: { type: "quantitative" },
    label:    { type: "categorical" },
  },
  marks: [
    geoBasemap({ geojson: { type: "FeatureCollection", features: [0.5, 0.4, 0.3, 0.2, 0.1].map((r) =>
      ({ type: "Feature", geometry: ring(r) })) }, fill: "rgba(0,0,0,0.03)", stroke: "rgba(0,0,0,0.3)", strokeWidth: 0.5 }),
    geoBasemap({ geojson: { type: "MultiLineString", coordinates: keys.map((k) => [[longitude(k), 90 - 0.57], [0, 90]]) },
      fill: "none", stroke: "rgba(255,255,255,0.5)", strokeWidth: 2.5 }),
    geoPolygon({ fillOpacity: 0.1,
      channels: { geometry: { field: "geometry", scale: null }, fill: { field: "name", legend: { anchor: "top", title: false } },
                  stroke: { field: "name" } } }),
    geoPoint({ size: 3, stroke: "white",
      tip: (d) => [d.name, d.key + ": " + d3.format(".0%")(d.value)],   // the value on hover
      channels: { lon: { field: "lon" }, lat: { field: "lat" }, fill: { field: "name" } } }),
    geoText({ fontSize: 10, fill: "#333",
      channels: { lon: { field: "llon" }, lat: { field: "llat" }, text: { field: "label" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Pull the spokes',
      question: 'How much does each factor matter to you when you choose a phone?',
      try: 'Drag a red dot in or out along its spoke. The grey shape is how iPhone buyers answered.',
      why: '`edit.geo.move` inverts the pointer through the polar projection, and a `constraints.custom` repair snaps each dot back onto its own spoke\'s longitude — so a free 2-D drag becomes a radial one — then rebuilds your polygon from the dots. `lock` keeps the iPhone reference fixed, and a `tip` reads each dot\'s value back as you hover it.',
      uses: ['edit.geo.move()', 'constraints.custom', 'lock', 'tip'],
      code: `const phones = await plotData("plot-radar-chart", "phones.csv");
const keys = Object.keys(phones[0]).filter((k) => k !== "name");
const longitude = d3.scalePoint(keys, [180, -180]).padding(0.5).align(1);
const ring = (r) => d3.geoCircle().center([0, 90]).radius(r)();
const polygon = (coords) => {
  const g = { type: "Polygon", coordinates: [[...coords, coords[0]]] };
  return d3.geoArea(g) > 2 * Math.PI ? { type: "Polygon", coordinates: [g.coordinates[0].reverse()] } : g;
};
const iphone = phones.find((p) => p.name === "iPhone");
const rows = [
  { who: "iPhone", geometry: polygon(keys.map((k) => [longitude(k), 90 - iphone[k]])) },
  { who: "you", geometry: null },
  ...keys.map((key) => ({ who: "you", key, lon: longitude(key), lat: 90 - 0.25 })), // a neutral start
  ...keys.map((k) => ({ who: "label", label: k, llon: longitude(k), llat: 90 - 0.57 })),
];
// Keep each dot on its spoke, inside the chart, then redraw "you" from the dots.
const radial = constraints.custom(({ data }) => {
  const next = data.map((d) => {
    if (!d.key) return d;
    const lat = Math.max(90 - 0.5, Math.min(90 - 0.01, d.lat));
    return { ...d, lon: longitude(d.key), lat, value: +(90 - lat).toFixed(3) }; // the answer
  });
  const dots = next.filter((d) => d.key);
  return next.map((d) => (d.who === "you" && !d.key
    ? { ...d, geometry: polygon(dots.map((p) => [p.lon, p.lat])) } : d));
}, { type: "radial" });

mount(Elicit({
  width: 420, height: 420,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  projection: { type: "azimuthal-equidistant", rotate: [0, -90], domain: ring(0.72) },
  data: radial.apply({ data: rows }),
  schema: {
    who:      { type: "categorical", domain: ["iPhone", "you", "label"] },
    geometry: { type: "categorical" },
    key:      { type: "categorical", domain: keys },
    value:    { type: "quantitative", domain: [0, 0.5] },
    lon:      { type: "quantitative" }, lat:  { type: "quantitative" },
    llon:     { type: "quantitative" }, llat: { type: "quantitative" },
    label:    { type: "categorical" },
  },
  lock: (d) => d.who !== "you",                                         //! the reference is fixed
  constraints: [ radial ],                                              //! a free drag, repaired into a radial one
  marks: [
    geoBasemap({ geojson: { type: "FeatureCollection", features: [0.5, 0.4, 0.3, 0.2, 0.1].map((r) =>
      ({ type: "Feature", geometry: ring(r) })) }, fill: "rgba(0,0,0,0.03)", stroke: "rgba(0,0,0,0.3)", strokeWidth: 0.5 }),
    geoBasemap({ geojson: { type: "MultiLineString", coordinates: keys.map((k) => [[longitude(k), 90 - 0.57], [0, 90]]) },
      fill: "none", stroke: "rgba(0,0,0,0.12)", strokeWidth: 1 }),
    geoPolygon({ fillOpacity: 0.15,
      channels: { geometry: { field: "geometry", scale: null },
                  fill: { field: "who", scale: { range: ["#999", "#e15759", "none"] } },
                  stroke: { field: "who", scale: { range: ["#999", "#e15759", "none"] } } } }),
    geoPoint({ size: 6, fill: "#e15759", stroke: "white",
      tip: (d) => d.key + ": " + d3.format(".0%")(d.value),           //! your answer, read back on hover
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [ edit.geo.move() ] }),                                     //! drag a dot
    geoText({ fontSize: 10, fill: "#333",
      channels: { lon: { field: "llon" }, lat: { field: "llat" }, text: { field: "label" } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-radar-chart-faceted',
  status: 'partial',
  verdict: 'Eleven radar charts of car specifications in a 4 × 3 grid, each value normalized by its column maximum, with the raw value as a `tip`. Faceting is not covered by this study, and a polygon has no polar position channel, so every panel\'s rings, spokes and polygon are computed as planar coordinates offset by hand and drawn through an `identity` projection.',
  needs: ['facet', 'radius-channel', 'curve-types'],
  prep: ['prep-geo', 'prep-reshape', 'prep-calculate'],
  gaps: [
    'Faceting is not covered by this study: each panel is an offset in one identity-projected plane, so the grid is arithmetic rather than a layout.',
    'The `radius` channel places an `arc`\'s rim; a radar\'s polygon is not an arc, so `radius` does not apply, and each value v at axis angle θ becomes (v·sin θ, v·cos θ) in JavaScript.',
    'Straight-edged polygons instead of `cardinal-closed` curves.',
  ],
  recreation: {
    code: `const cars = await plotData("plot-radar-chart-faceted", "cars.csv");
const keys = Object.keys(cars[0]).filter((k) => k !== "name");
const max = Object.fromEntries(keys.map((k) => [k, d3.max(cars, (d) => d[k])]));
const angle = (i) => (i / keys.length) * 2 * Math.PI;           // clockwise from 12 o'clock
const S = 2.6;                                                   // panel pitch, in radius units
const at = (f, v, i) => [f.cx + v * Math.sin(angle(i)), f.cy - v * Math.cos(angle(i))];
// Panel 0 holds the axis labels; the cars, cheapest first, fill the rest.
const facets = d3.range(12).map((k) => ({ cx: (k % 4) * S, cy: Math.floor(k / 4) * S }));
const sorted = d3.sort(cars, (d) => d.Price);
const circle = (f, r) => d3.range(0, 361, 10).map((a) => [f.cx + r * Math.sin(a * Math.PI / 180), f.cy - r * Math.cos(a * Math.PI / 180)]);
const rings = facets.flatMap((f) => [0.2, 0.4, 0.6, 0.8, 1].map((r) => circle(f, r)));
const spokes = facets.flatMap((f) => keys.map((_, i) => [[f.cx, f.cy], at(f, 0.8, i)]));
const rows = [
  ...sorted.map((car, n) => ({ name: car.name, geometry: { type: "Polygon",
    coordinates: [[...keys.map((k, i) => at(facets[n + 1], car[k] / max[k], i)), at(facets[n + 1], car[keys[0]] / max[keys[0]], 0)]] } })),
  ...sorted.flatMap((car, n) => keys.map((k, i) => { const [x, y] = at(facets[n + 1], car[k] / max[k], i);
    return { x, y, name: car.name, key: k, raw: car[k] }; })),
  ...sorted.map((car, n) => ({ label: car.name, lx: facets[n + 1].cx, ly: facets[n + 1].cy + 1.2 })),
  ...keys.map((k, i) => { const [lx, ly] = at(facets[0], 1.07, i); return { label: k, lx, ly }; }),
];

mount(Elicit({
  width: 480, height: 380,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  projection: { type: "identity", domain: { type: "MultiPoint", coordinates: [[-1.25, -1.25], [3 * S + 1.25, 2 * S + 1.35]] } },
  data: rows,
  schema: {
    name:     { type: "categorical" },
    geometry: { type: "categorical" },
    key:      { type: "categorical", domain: keys },
    raw:      { type: "quantitative" },
    x: { type: "quantitative" }, y:  { type: "quantitative" },
    lx: { type: "quantitative" }, ly: { type: "quantitative" },
    label:    { type: "categorical" },
  },
  marks: [
    geoBasemap({ geojson: { type: "MultiLineString", coordinates: rings }, fill: "none", stroke: "rgba(0,0,0,0.2)", strokeWidth: 0.5 }),
    geoBasemap({ geojson: { type: "MultiLineString", coordinates: spokes }, fill: "none", stroke: "rgba(0,0,0,0.08)", strokeWidth: 1.5 }),
    geoPolygon({ fill: "#4269D0", fillOpacity: 0.25, stroke: "#4269D0",
      channels: { geometry: { field: "geometry", scale: null } } }),
    geoPoint({ size: 2.5, fill: "#4269D0", stroke: "white", tip: ["name", "key", "raw"], // the raw value on hover
      channels: { lon: { field: "x" }, lat: { field: "y" } } }),
    geoText({ fontSize: 9, fill: "#333", channels: { lon: { field: "lx" }, lat: { field: "ly" }, text: { field: "label" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Profile a new car',
      question: 'A new compact car is about to launch. Relative to the eleven cars shown, what do you expect its displacement, mileage, price, trunk space and weight to be?',
      try: 'Drag each dot along its spoke. The rim is the largest value among the eleven cars.',
      why: 'Each spec is one row with a `value` column, and the dot\'s polar position is a pixel `{ fn }` of it; a `value` channel names the column the edit writes. `slide({ axis: "y" })` changes it by vertical drag distance whichever way the spoke points, so every spoke answers the same gesture, and `clamp` keeps it between zero and the class maximum. A `tip` reads the value back in the spec\'s own units.',
      uses: ['slide()', 'clamp()', 'tip'],
      code: `const cars = await plotData("plot-radar-chart-faceted", "cars.csv");
const keys = Object.keys(cars[0]).filter((k) => k !== "name");
const max = Object.fromEntries(keys.map((k) => [k, d3.max(cars, (d) => d[k])]));
const median = Object.fromEntries(keys.map((k) => [k, d3.median(cars, (d) => d[k]) / max[k]]));
const rows = keys.map((key, i) => ({ key, angle: (i / keys.length) * 360, value: +median[key].toFixed(2) }));
const R = 120; // rim radius, px

mount(Elicit({
  width: 360, height: 340,
  margins: { top: 30, right: 30, bottom: 30, left: 30 },
  data: rows,
  schema: {
    key:   { type: "categorical", domain: keys },
    angle: { type: "quantitative", domain: [0, 360] },
    value: { type: "quantitative", domain: [0, 1] },
  },
  constraints: [ clamp({ field: "value", min: 0.05, max: 1 }) ],   //! between nothing and the class maximum
  axes: false,
  guides: [ guides.custom(({ data, width, height }) => {
    const cx = width / 2, cy = height / 2;
    const pt = (d, v) => [cx + R * v * Math.sin(d.angle * Math.PI / 180), cy - R * v * Math.cos(d.angle * Math.PI / 180)];
    return [
      ...[0.2, 0.4, 0.6, 0.8, 1].map((r) => ({ type: "circle", cx, cy, r: R * r, fill: "none", stroke: "#ddd" })),
      ...data.map((d) => ({ type: "line", x1: cx, y1: cy, x2: pt(d, 1)[0], y2: pt(d, 1)[1], stroke: "#ddd" })),
      { type: "path", points: data.map((d) => pt(d, d.value)), fill: "#4269D0", opacity: 0.25, stroke: "#4269D0" },
      ...data.map((d) => ({ type: "text", text: d.key, x: pt(d, 1.12)[0], y: pt(d, 1.12)[1] + 4,
        textAnchor: "middle", fontSize: 11, fill: "#333" })),
    ];
  }) ],
  marks: [
    point({ size: 7, fill: "#4269D0", stroke: "white",
      tip: (d) => d.key + ": " + Math.round(d.value * max[d.key]),     //! the answer in the spec's own units
      channels: {
        // Polar placement by hand, in pixels about the plot centre (150, 140).
        x: { fn: (d) => 150 + R * d.value * Math.sin(d.angle * Math.PI / 180) },
        y: { fn: (d) => 140 - R * d.value * Math.cos(d.angle * Math.PI / 180) },
        value: { field: "value" },
      },
      edits: [ slide({ channels: ["value"], axis: "y", increase: "up", extent: 200 }) ], //! a vertical drag grows or shrinks the value
    }),
  ],
}))`,
    },
  ],
});
