// Gallery entries — see AUTHORING.md.
// Vega-Lite: Labeling & Annotation, Other Layered Plots, Faceting,
// Repeat & Concatenation, Maps (Geographic Displays).

// ------------------------------------------------------------------ Labeling & Annotation

GALLERY.add({
  id: 'vl-layer_bar_fruit',
  status: 'full',
  verdict: 'A horizontal bar per fruit coloured by count, with the count printed inside each bar; the label colour flips to white on dark bars through a derived `{ fn }` channel.',
  needs: [],
  prep: [],
  gaps: ['The colour ramp and legend styling differ from Vega-Lite\'s default blues.'],
  recreation: {
    code: `const fruit = [
  { name: "🍊", count: 21 }, { name: "🍇", count: 13 },
  { name: "🍏", count: 8 },  { name: "🍌", count: 5 },
  { name: "🍐", count: 3 },  { name: "🍋", count: 2 },
  { name: "🍎", count: 1 },  { name: "🍉", count: 1 },
];

mount(Elicit({
  width: 440, height: 250,
  margins: { top: 10, right: 20, bottom: 26, left: 34 },
  data: fruit,
  schema: {
    // Domain order runs bottom to top, so reverse it to put the largest on top.
    name:  { type: "categorical", domain: fruit.map((d) => d.name).reverse() },
    count: { type: "quantitative", domain: [0, 21] },
  },
  axes: { y: { fontSize: 16 } },
  marks: [
    barX({
      channels: {
        y: { field: "name" },
        x: { field: "count" },
        fill: { field: "count", legend: { title: "Number of fruit", labelWidth: 70 } },
      },
    }),
    text({
      fontSize: 11, dx: -4, textAnchor: "end",
      channels: {
        y: { field: "name" },
        x: { field: "count" },
        text: { field: "count" },
        fill: { fn: (d) => (d.count > 10 ? "white" : "black") },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill the basket',
      question: 'A basket holds 54 pieces of fruit. How many of each kind do you think it contains?',
      try: 'Drag a bar right or left; the counter shows how many pieces are left to place.',
      why: '`move()` on `x` sets each count, `snap` keeps it a whole number, and `maintainSum({ strategy: "cap" })` stops a bar once the basket is full. `guides.remaining` reads the same total off the constraint.',
      uses: ['move()', 'snap()', 'maintainSum()', 'guides.remaining()'],
      code: `const kinds = ["🍊", "🍇", "🍏", "🍌", "🍐", "🍋", "🍎", "🍉"];

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 26, right: 20, bottom: 26, left: 34 },
  data: kinds.map((name) => ({ name, count: 3 })),
  schema: {
    name:  { type: "categorical", domain: kinds.slice().reverse() },
    count: { type: "quantitative", domain: [0, 25] },
  },
  axes: { y: { fontSize: 16 } },
  constraints: [
    clamp({ min: 0 }),
    snap({ step: 1 }),                                     //! whole fruit only
    maintainSum({ total: 54, strategy: "cap" }),           //! the basket holds 54
  ],
  guides: [ guides.remaining({ field: "count", unit: "piece" }) ], //! what is left to place
  marks: [
    barX({
      fill: "#f59e0b",
      channels: {
        y: { field: "name" },
        x: { field: "count", edit: move() },               //! drag a count
      },
    }),
    text({
      fontSize: 11, dx: 4, textAnchor: "start",
      channels: { y: { field: "name" }, x: { field: "count" }, text: { field: "count" } },
    }),
  ],
}));`,
    },
    {
      title: 'Rank the fruit',
      question: 'Which fruit is most common in the basket? Put them in order, most to least.',
      try: 'Drag a bar up or down to move its fruit to another place in the ranking.',
      why: 'The band axis of the original\'s `barX` is the rank here. `rank()` inverts the pointer to a slot and inserts the fruit there, shifting the rest, so the ranks stay a permutation of 1–8. Each bar\'s length follows its slot, so the answer reads as the sorted bar chart it predicts.',
      uses: ['rank()', 'barX', 'text'],
      code: `const kinds = ["🍎", "🍌", "🍇", "🍉", "🍊", "🍋", "🍏", "🍐"];

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 20, bottom: 12, left: 34 },
  data: kinds.map((name, i) => ({ name, rank: i + 1 })),
  schema: {
    name: { type: "categorical", domain: kinds },
    // Reversed so rank 1 sits at the top.
    rank: { type: "ordinal", domain: [8, 7, 6, 5, 4, 3, 2, 1] },
  },
  axes: { x: false },
  marks: [
    barX({
      fill: "#f59e0b",
      channels: {
        y: { field: "rank", edit: rank() },                //! drag a bar to another slot
        x: { fn: (d) => 360 - d.rank * 38 },               // longest bar on top
      },
    }),
    text({
      fontSize: 18, textAnchor: "start", dx: 6,
      channels: { x: { value: 0 }, y: { field: "rank" }, text: { field: "name" } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_bar_annotations',
  status: 'full',
  verdict: 'Daily PM2.5 bars, the part of each bar above 300 overdrawn in red as a floating `y1`/`y2` bar, and a labelled `guides.rule` at the hazardous threshold.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['The red overlay is a second bar over the same rows from the value to the threshold, filled only where the value exceeds it, rather than a filtered layer.'],
  recreation: {
    code: `const pm = [54.8, 112.1, 63.6, 37.6, 79.7, 137.9, 120.1, 103.3, 394.8, 199.5,
  72.3, 51.1, 112.0, 174.5, 130.5].map((Value, i) => ({ Day: i + 1, Value }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 44 },
  data: pm,
  schema: {
    Day:   { type: "ordinal", domain: pm.map((d) => d.Day) },
    Value: { type: "quantitative", domain: [0, 400] },
  },
  axes: { x: { title: "Day" } },
  guides: [ guides.rule({ y: 300, label: "hazardous", stroke: "#000", strokeDash: "none", strokeWidth: 1 }) ],
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "Day" }, y: { field: "Value" } } }),
    // The hazardous part: a bar from the value to the threshold, painted only
    // where the value is above it.
    barY({
      channels: {
        x: { field: "Day" },
        y1: { datum: 300 },
        y2: { field: "Value" },
        fill: { fn: (d) => (d.Value > 300 ? "#e45755" : "none") },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast next week',
      question: 'Beijing\'s PM2.5 for the last 15 days is shown. What will it be on each of the next five days?',
      try: 'Drag the five pale bars on the right; a bar turns red above the hazardous line.',
      why: '`lock` fixes the observed days, so only the forecast days answer `move()`. The red overlay re-derives from your value on every drag, so the threshold reads as a consequence of your answer.',
      uses: ['move()', 'lock', 'guides.rule()', 'clamp()'],
      code: `const seen = [54.8, 112.1, 63.6, 37.6, 79.7, 137.9, 120.1, 103.3, 394.8, 199.5,
  72.3, 51.1, 112.0, 174.5, 130.5].map((Value, i) => ({ Day: i + 1, Value, kind: "observed" }));
const next = [16, 17, 18, 19, 20].map((Day) => ({ Day, Value: 120, kind: "forecast" }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 44 },
  data: [...seen, ...next],
  schema: {
    Day:   { type: "ordinal", domain: d3.range(1, 21) },
    Value: { type: "quantitative", domain: [0, 450] },
    kind:  { type: "categorical", domain: ["observed", "forecast"] },
  },
  lock: (d) => d.kind === "observed",                        //! the record is given
  constraints: [ clamp({ min: 0, max: 450 }) ],
  axes: { x: { title: "Day" } },
  guides: [ guides.rule({ y: 300, label: "hazardous", stroke: "#000", strokeWidth: 1 }) ],
  marks: [
    barY({
      channels: {
        x: { field: "Day" },
        y: { field: "Value", edit: move() },                 //! drag a forecast day
        fill: { field: "kind", scale: { range: ["#4c78a8", "#a5c0dc"] } },
      },
    }),
    // The hazardous part: a bar from the value to the threshold, painted only
    // where the value is above it.
    barY({
      channels: {
        x: { field: "Day" },
        y1: { datum: 300 },
        y2: { field: "Value" },
        fill: { fn: (d) => (d.Value > 300 ? "#e45755" : "none") },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Where is the line?',
      question: 'Without looking it up: at what PM2.5 level do you think air becomes hazardous?',
      try: 'Drag the dashed line up or down.',
      why: 'The threshold is the elicited quantity here, so it is a one-row table drawn by `ruleY` with `move()` on `y`. The daily readings are `context` rows drawn by an inert `barY`: you see them, but `getData()` holds only your answer.',
      uses: ['ruleY', 'move()', 'context'],
      code: `const pm = [54.8, 112.1, 63.6, 37.6, 79.7, 137.9, 120.1, 103.3, 394.8, 199.5,
  72.3, 51.1, 112.0, 174.5, 130.5].map((Value, i) => ({ Day: i + 1, Value }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 44 },
  schema: {
    Day:       { type: "ordinal", domain: pm.map((d) => d.Day) },
    Value:     { type: "quantitative", domain: [0, 400] },
    threshold: { type: "quantitative", domain: [0, 400] },
  },
  data: [...pm, { threshold: 150 }],                         //! one answer
  context: (d) => d.Day != null,                             //! read-only backdrop
  axes: { x: { title: "Day" } },
  marks: [
    barY({ fill: "#cbd5e1", channels: { x: { field: "Day" }, y: { field: "Value" } } }),
    ruleY({
      stroke: "#e45755", strokeWidth: 3, strokeDash: "6 4",
      channels: { y: { field: "threshold", edit: move() } }, //! drag the threshold
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ Other Layered Plots

GALLERY.add({
  id: 'vl-layer_precipitation_mean',
  status: 'full',
  verdict: 'Mean daily precipitation per month as bars, with the overall mean as a thick red `guides.rule` across them.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Month labels are abbreviated names rather than Vega-Lite\'s time-unit axis.'],
  recreation: {
    code: `const rows = await vegaData("seattle-weather.csv");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthly = months.map((m, i) => ({
  month: m,
  precipitation: d3.mean(rows.filter((d) => d.date.getUTCMonth() === i), (d) => d.precipitation),
}));
const overall = d3.mean(rows, (d) => d.precipitation);

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 52 },
  data: monthly,
  schema: {
    month: { type: "ordinal", domain: months },
    precipitation: { type: "quantitative", domain: [0, 6] },
  },
  axes: { x: { title: "date (month)" }, y: { title: "Mean of precipitation" } },
  guides: [ guides.rule({ y: overall, stroke: "red", strokeDash: "none", strokeWidth: 3 }) ],
  marks: [
    barY({ fill: "#4c78a8", channels: { x: { field: "month" }, y: { field: "precipitation" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Your monthly means',
      question: 'Seattle averages about 3 mm of rain a day. How does that split across the months?',
      try: 'Drag each bar; the red line follows the mean of your bars, the grey one is the real annual mean.',
      why: '`move()` on `y` sets each month. The red `guides.rule` takes a function of the live rows, so it recomputes as you drag and you can see whether your months add up to the year.',
      uses: ['move()', 'guides.rule()', 'clamp()'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 40 },
  data: months.map((month) => ({ month, precipitation: 2 })),
  schema: {
    month: { type: "ordinal", domain: months },
    precipitation: { type: "quantitative", domain: [0, 8] },
  },
  constraints: [ clamp({ min: 0, max: 8 }) ],
  guides: [
    guides.rule({ y: 3.03, stroke: "#94a3b8", label: "actual annual mean" }),
    guides.rule({ y: ({ data }) => d3.mean(data, (d) => d.precipitation), //! mean of your bars
                  stroke: "red", strokeWidth: 3, label: "your mean" }),
  ],
  marks: [
    barY({
      fill: "#4c78a8",
      channels: {
        x: { field: "month" },
        y: { field: "precipitation", edit: move() },       //! drag a month
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sketch the season',
      question: 'Sketch how Seattle\'s rainfall rises and falls through the year.',
      try: 'Drag across the chart from left to right; every month you pass takes the height of the pointer.',
      why: '`edit.line.sweep()` writes every month the pointer crosses in one stroke, so a seasonal shape takes a single gesture instead of twelve drags.',
      uses: ['edit.line.sweep()', 'lineY'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 40 },
  data: months.map((month) => ({ month, precipitation: 3 })),
  schema: {
    month: { type: "ordinal", domain: months },
    precipitation: { type: "quantitative", domain: [0, 8] },
  },
  marks: [
    lineY({
      stroke: "#4c78a8", strokeWidth: 3, curve: "monotoneX",
      channels: {
        x: { field: "month" },
        y: { field: "precipitation", edit: edit.line.sweep() }, //! one stroke sets every month
      },
    }),
  ],
}));`,
    },
    {
      title: 'Mean and range',
      question: 'For each month, what is the mean daily rainfall, and how low or high could it go in a dry or wet year?',
      try: 'Drag a bar to set the month\'s mean; its range comes along. Then drag either end tick to widen or narrow the range.',
      why: '`follow({ lead: "precipitation" })` shifts `lo` and `hi` by however far you move the bar, so you set the centre first and the spread second. The end ticks move on their own, and `ordering` keeps `lo ≤ mean ≤ hi`.',
      uses: ['composite', 'move()', 'follow()', 'ordering()'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 40 },
  data: months.map((month) => ({ month, lo: 2, precipitation: 3, hi: 4 })),
  schema: {
    month: { type: "ordinal", domain: months },
    lo:    { type: "quantitative", domain: [0, 8] },
    precipitation: { type: "quantitative", domain: [0, 8] },
    hi:    { type: "quantitative", domain: [0, 8] },
  },
  axes: { y: { title: "precipitation (mm/day)" } },
  constraints: [
    follow({ field: ["lo", "hi"], lead: "precipitation" }),  //! the range rides on the mean
    ordering({ field: ["lo", "precipitation", "hi"] }),       //! lo ≤ mean ≤ hi
    clamp({ field: ["lo", "precipitation", "hi"] }),
  ],
  marks: [
    composite({
      parts: [
        barY({ fill: "#4c78a8", channels: { x: { field: "month" }, y: { field: "precipitation", edit: move() } } }), //! drag the mean
        ruleX({ stroke: "#1e293b", channels: { x: { field: "month" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
        tickY({ stroke: "#1e293b", strokeWidth: 3, length: 12,
                channels: { x: { field: "month" }, y: { field: "lo", edit: move() } } }),
        tickY({ stroke: "#1e293b", strokeWidth: 3, length: 12,
                channels: { x: { field: "month" }, y: { field: "hi", edit: move() } } }), //! each end on its own
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_histogram_global_mean',
  status: 'full',
  verdict: 'A histogram of IMDB ratings with a thick red rule at the mean rating.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: [],
  recreation: {
    code: `const movies = await vegaData("movies.json");
const ratings = movies.map((d) => d["IMDB Rating"]).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(1, 10.5, 0.5))(ratings)
  .map((b) => ({ lo: b.x0, hi: b.x1, count: b.length }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 44 },
  data: bins,
  schema: {
    lo:    { type: "quantitative", domain: [1, 10] },
    hi:    { type: "quantitative", domain: [1, 10] },
    count: { type: "quantitative", domain: [0, 600] },
  },
  axes: { x: { title: "IMDB Rating (binned)" } },
  guides: [ guides.rule({ x: d3.mean(ratings), stroke: "red", strokeDash: "none", strokeWidth: 5 }) ],
  marks: [
    rectY({
      fill: "#4c78a8", stroke: "white",
      channels: { x1: { field: "lo" }, x2: { field: "hi" }, y: { field: "count" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Guess the mean',
      question: 'Here is the shape of all IMDB ratings. Where is the average rating?',
      try: 'Drag the red line left or right.',
      why: 'The guess is a one-row table drawn by `ruleX`; `move()` on `x` writes it. The histogram is `context` rows under it, drawn by the original\'s own `rectY` but read-only, so `getData()` holds only your answer.',
      uses: ['ruleX', 'move()', 'context'],
      code: `const movies = await vegaData("movies.json");
const ratings = movies.map((d) => d["IMDB Rating"]).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(1, 10.5, 0.5))(ratings)
  .map((b) => ({ lo: b.x0, hi: b.x1, count: b.length }));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 32, left: 16 },
  schema: {
    lo:    { type: "quantitative", domain: [1, 10] },
    hi:    { type: "quantitative", domain: [1, 10] },
    count: { type: "quantitative", domain: [0, 600] },
    mean:  { type: "quantitative", domain: [1, 10] },
  },
  data: [...bins, { mean: 5 }],                              //! one answer
  context: (d) => d.count != null,                           //! the histogram is given
  axes: { x: { title: "IMDB Rating" }, y: false },
  marks: [
    rectY({ fill: "#cbd5e1", stroke: "white",
            channels: { x1: { field: "lo" }, x2: { field: "hi" }, y: { field: "count" } } }),
    ruleX({
      stroke: "red", strokeWidth: 5,
      channels: { x: { field: "mean", edit: move() } },      //! drag your guess
    }),
  ],
}));`,
    },
    {
      title: 'Stack the ratings',
      question: 'Twenty films come out next month. How do you think their IMDB ratings will spread?',
      try: 'Click a bin to add a film there; click a dot to take it away.',
      why: 'One row is one film, so a `dotStack` is the honest instrument: `create()` mints a token at the clicked bin, `remove()` drops one, and `count({ max: 20 })` caps the total.',
      uses: ['dotStack', 'create()', 'remove()', 'count()'],
      code: `const bins = d3.range(1, 10).map((v) => v + "–" + (v + 1));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 32, left: 16 },
  data: [],
  schema: { rating: { type: "ordinal", domain: bins } },
  axes: { x: { title: "IMDB Rating" }, y: false },
  constraints: [ count({ max: 20 }) ],                       //! twenty films
  marks: [
    dotStack({
      fill: "#4c78a8", size: 7,
      channels: { x: { field: "rating" } },
      edits: [ create(), remove() ],                         //! click to add, click a dot to remove
    }),
  ],
}));`,
    },
    {
      title: 'Mean, give or take',
      question: 'Where is the average IMDB rating, and how far either side of your guess could it be?',
      try: 'Drag the red line to move your guess and its band together; drag either edge of the band to widen or narrow it on both sides.',
      why: '`follow` carries `lo` and `hi` with the mean, and `symmetric({ about: "mean" })` mirrors whichever edge you drag, so the answer is always "mean ± margin". The histogram is `context` rows under it, with columns of their own.',
      uses: ['follow()', 'symmetric()', 'ordering()', 'ruleX', 'context'],
      code: `const movies = await vegaData("movies.json");
const ratings = movies.map((d) => d["IMDB Rating"]).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(1, 10.5, 0.5))(ratings)
  .map((b) => ({ x0: b.x0, x1: b.x1, count: b.length }));
const rating = { type: "quantitative", domain: [1, 10] };

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 32, left: 16 },
  schema: { lo: rating, mean: rating, hi: rating, x0: rating, x1: rating, count: { type: "quantitative", domain: [0, 600] } },
  data: [...bins, { lo: 4, mean: 5, hi: 6 }],
  context: (d) => d.count != null,                           //! the histogram is given
  constraints: [
    follow({ field: ["lo", "hi"], lead: "mean" }),           //! the band rides on the mean
    symmetric({ field: ["lo", "hi"], about: "mean" }),       //! one edge mirrors the other
    ordering({ field: ["lo", "mean", "hi"] }),
    clamp({ field: ["lo", "mean", "hi"] }),
  ],
  axes: { x: { title: "IMDB Rating" }, y: false },
  marks: [
    rectY({ fill: "#cbd5e1", stroke: "white",
            channels: { x1: { field: "x0" }, x2: { field: "x1" }, y: { field: "count" } } }),
    rectY({ fill: "#e45755", fillOpacity: 0.15, channels: { x1: { field: "lo" }, x2: { field: "hi" } } }),
    ruleX({ stroke: "#e45755", strokeWidth: 2, channels: { x: { field: "lo", edit: move() } } }), //! drag an edge
    ruleX({ stroke: "#e45755", strokeWidth: 2, channels: { x: { field: "hi", edit: move() } } }),
    ruleX({ stroke: "#e45755", strokeWidth: 5, channels: { x: { field: "mean", edit: move() } } }), //! drag the guess
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_falkensee',
  status: 'full',
  verdict: 'Falkensee\'s population as a line with points, over the two historical periods as a colour-encoded `rectY` layer with a legend, drawn from read-only `context` rows.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Years are a quantitative axis rather than a temporal one.',
  ],
  recreation: {
    code: `const pop = [[1875, 1309], [1890, 1558], [1910, 4512], [1925, 8180], [1933, 15915],
  [1939, 24824], [1946, 28275], [1950, 29189], [1964, 29881], [1971, 26007],
  [1981, 24029], [1985, 23340], [1989, 22307], [1990, 22087], [1991, 22139],
  [1992, 22105], [1993, 22242], [1994, 22801], [1995, 24273], [1996, 25640],
  [1997, 27393], [1998, 29505], [1999, 32124], [2000, 33791], [2001, 35297],
  [2002, 36179], [2003, 36829], [2004, 37493], [2005, 38376], [2006, 39008],
  [2007, 39366], [2008, 39821], [2009, 40179], [2010, 40511], [2011, 40465],
  [2012, 40905], [2013, 41258], [2014, 41777]].map(([year, population]) => ({ year, population }));

const periods = [
  { start: 1933, end: 1945, event: "Nazi Rule" },
  { start: 1948, end: 1989, event: "GDR (East Germany)" },
];

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 60 },
  schema: {
    year:       { type: "quantitative", domain: [1875, 2014] },
    population: { type: "quantitative", domain: [0, 45000] },
    start: { type: "quantitative" }, end: { type: "quantitative" },
    event: { type: "categorical", domain: periods.map((d) => d.event) },
  },
  data: [...periods, ...pop],
  // The second dataset of the original: drawn, never elicited.
  context: (d) => d.event != null,
  axes: { x: { tickFormat: "d", title: "year (year)" }, y: { title: "population" } },
  marks: [
    rectY({
      fillOpacity: 0.5,
      channels: {
        x1: { field: "start" }, x2: { field: "end" },
        fill: { field: "event", scale: { range: ["#f58518", "#4c78a8"] }, legend: { title: "event", labelWidth: 110 } },
      },
    }),
    lineY({ stroke: "#333", channels: { x: { field: "year" }, y: { field: "population" } } }),
    point({ stroke: "#333", fill: "none", size: 3, channels: { x: { field: "year" }, y: { field: "population" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the future',
      question: 'Falkensee had 41,777 residents in 2014. How will its population change through 2040?',
      try: 'Drag across the right-hand part of the chart to draw the line year by year.',
      why: '`lock: "seed"` fixes the record, and `edit.line.draw` with `samples` mints one row per future year as you drag. The record cannot be redrawn.',
      uses: ['edit.line.draw()', 'lock', 'guides.region()'],
      code: `const pop = [[1875, 1309], [1910, 4512], [1933, 15915], [1946, 28275], [1964, 29881],
  [1981, 24029], [1989, 22307], [1993, 22242], [1997, 27393], [2000, 33791],
  [2004, 37493], [2008, 39821], [2011, 40465], [2014, 41777]]
  .map(([year, population]) => ({ year, population }));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 48 },
  data: pop,
  schema: {
    year:       { type: "quantitative", domain: [1875, 2040] },
    population: { type: "quantitative", domain: [0, 70000] },
  },
  lock: "seed",                                              //! history is given
  axes: { x: { tickFormat: "d" }, y: { tickFormat: "~s" } },
  guides: [
    guides.region({ x: [1933, 1945], fill: "#fdae6b", opacity: 0.5 }),
    guides.region({ x: [1948, 1989], fill: "#6baed6", opacity: 0.4 }),
    guides.region({ x: [2014, 2040], fill: "#94a3b8", opacity: 0.12 }),
  ],
  marks: [
    lineY({
      stroke: "#333", strokeWidth: 2, handleSize: 3,
      channels: { x: { field: "year" }, y: { field: "population" } },
      edits: [ edit.line.draw({ samples: d3.range(2016, 2041, 2) }) ], //! one row per future year
    }),
  ],
}));`,
    },
    {
      title: 'Mark the boom',
      question: 'Over which years do you think Falkensee grew fastest?',
      try: 'Drag the shaded band, or either of its edges, to cover the boom.',
      why: 'The answer is an interval, so it is a one-row `rectY` with `x1`/`x2` fields. `brushSpan` moves an edge when you grab near one and the whole band when you grab its body; `ordering` keeps start before end. The population line is `context`, so it stays out of `getData()`.',
      uses: ['brushSpan()', 'ordering()', 'rectY', 'context'],
      code: `const pop = [[1875, 1309], [1890, 1558], [1910, 4512], [1925, 8180], [1933, 15915],
  [1939, 24824], [1946, 28275], [1950, 29189], [1964, 29881], [1971, 26007],
  [1981, 24029], [1989, 22307], [1993, 22242], [1995, 24273], [1997, 27393],
  [1999, 32124], [2001, 35297], [2004, 37493], [2008, 39821], [2014, 41777]]
  .map(([year, population]) => ({ year, population }));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 12, bottom: 32, left: 48 },
  schema: {
    year:       { type: "quantitative", domain: [1875, 2014] },
    population: { type: "quantitative", domain: [0, 45000] },
    start:      { type: "quantitative", domain: [1875, 2014] },
    end:        { type: "quantitative", domain: [1875, 2014] },
  },
  data: [...pop, { start: 1950, end: 1970 }],
  context: (d) => d.population != null,                      //! the record, read-only
  constraints: [ ordering({ field: ["start", "end"] }) ],    //! start stays before end
  axes: { x: { tickFormat: "d" }, y: { tickFormat: "~s" } },
  marks: [
    lineY({ stroke: "#333", strokeWidth: 2,
            channels: { x: { field: "year" }, y: { field: "population" } } }),
    rectY({
      fill: "#e45755", fillOpacity: 0.25, stroke: "#e45755",
      channels: { x1: { field: "start" }, x2: { field: "end" } },
      edits: [ brushSpan({ channels: ["x1", "x2"], edgeInset: 10 }) ], //! drag edges or body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_likert',
  status: 'full',
  verdict: 'Rating counts per question as sized circles over a 1–5 scale, with each question\'s median as a black tick and its two anchor words beside the row, the medians and anchors drawn from read-only `context` rows, the original\'s second dataset.',
  needs: [],
  prep: ['prep-aggregate', 'prep-reshape'],
  gaps: [],
  recreation: {
    code: `const qs = [
  ["Identify Errors:", 1.999976, "Easy", "Hard"], ["Fix Errors:", 2, "Easy", "Hard"],
  ["Easier to Fix:", 1.999969, "Toolbar", "Gesture"], ["Faster to Fix:", 2.500045, "Toolbar", "Gesture"],
  ["Easier on Phone:", 1.500022, "Toolbar", "Gesture"], ["Easier on Tablet:", 2.99998, "Toolbar", "Gesture"],
  ["Device Preference:", 4.500007, "Phone", "Tablet"],
];
// Each participant's seven ratings, in question order.
const answers = [
  [2, 2, 3, 4, 2, 5, 5], [2, 3, 4, 5, 5, 5, 5], [2, 2, 2, 1, 2, 1, 5], [3, 3, 2, 2, 2, 1, 5],
  [2, 2, 3, 3, 2, 3, 4], [1, 1, 2, 1, 1, 3, 4], [2, 2, 1, 3, 2, 2, 5], [2, 2, 2, 2, 1, 3, 5],
  [1, 1, 3, 3, 1, 3, 4], [2, 2, 2, 2, 2, 3, 5], [1, 1, 2, 2, 1, 4, 3], [2, 2, 2, 3, 1, 3, 5],
  [1, 1, 2, 2, 1, 2, 3], [2, 2, 1, 2, 1, 4, 5], [2, 2, 2, 2, 2, 3, 4], [3, 3, 2, 3, 1, 2, 4],
];
const names = qs.map((q) => q[0]);
const counts = d3.rollups(answers.flatMap((a) => a.map((value, i) => ({ name: names[i], value }))),
  (v) => v.length, (d) => d.name, (d) => d.value)
  .flatMap(([name, byValue]) => byValue.map(([value, count]) => ({ name, value, count })));

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 10, right: 60, bottom: 26, left: 170 },
  title: "Questionnaire Ratings",
  schema: {
    name:   { type: "categorical", domain: names.slice().reverse() },
    value:  { type: "quantitative", domain: [0, 6] },
    count:  { type: "quantitative", domain: [0, 16] },
    median: { type: "quantitative", domain: [0, 6] },
    lo: { type: "categorical" }, hi: { type: "categorical" },
  },
  data: [...qs.map(([name, median, lo, hi]) => ({ name, median, lo, hi })), ...counts],
  // The medians and the anchor words: the original's second dataset.
  context: (d) => d.median != null,
  axes: {
    x: { tickValues: [1, 2, 3, 4, 5] },
    // Offset the question labels to leave room for the anchor words.
    y: { fontSize: 11, transform: ({ base }) => ({ x: base.x - 50 }) },
  },
  marks: [
    point({
      fill: "#6EB4FD",
      channels: {
        x: { field: "value" },
        y: { field: "name" },
        size: { field: "count", scale: { type: "sqrt", range: [2, 11] }, legend: { title: "Number of Ratings", labelWidth: 80 } },
      },
    }),
    tickX({ stroke: "black", strokeWidth: 2, length: 16,
            channels: { x: { field: "median" }, y: { field: "name" } } }),
    text({ fontSize: 11, fill: "#333", textAnchor: "end", dx: -4,
           channels: { x: { datum: 0 }, y: { field: "name" }, text: { field: "lo" } } }),
    text({ fontSize: 11, fill: "#333", textAnchor: "start", dx: 4,
           channels: { x: { datum: 6 }, y: { field: "name" }, text: { field: "hi" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Predict the medians',
      question: 'Sixteen participants rated a gesture-based table editor on these seven items. What do you think the median rating was for each?',
      try: 'Drag each tick along its row; it snaps to half points.',
      why: '`move()` on `x` writes one median per question, and `snap({ step: 0.5 })` keeps it to the values a median of 16 ratings can take. The anchor words are `context` rows, so they stay out of `getData()`.',
      uses: ['tickX', 'move()', 'snap()', 'context'],
      code: `const qs = [
  ["Identify Errors:", "Easy", "Hard"], ["Fix Errors:", "Easy", "Hard"],
  ["Easier to Fix:", "Toolbar", "Gesture"], ["Faster to Fix:", "Toolbar", "Gesture"],
  ["Easier on Phone:", "Toolbar", "Gesture"], ["Easier on Tablet:", "Toolbar", "Gesture"],
  ["Device Preference:", "Phone", "Tablet"],
];
const names = qs.map((q) => q[0]);

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 10, right: 60, bottom: 26, left: 170 },
  schema: {
    name:   { type: "categorical", domain: names.slice().reverse() },
    median: { type: "quantitative", domain: [1, 5] },
    lo: { type: "categorical" }, hi: { type: "categorical" },
  },
  data: [
    ...qs.map(([name, lo, hi]) => ({ name, lo, hi })),
    ...names.map((name) => ({ name, median: 3 })),
  ],
  context: (d) => d.lo != null,                              //! the anchor words, read-only
  constraints: [ snap({ step: 0.5 }), clamp({ min: 1, max: 5 }) ], //! medians of 16 ratings
  axes: {
    x: { tickValues: [1, 2, 3, 4, 5] },
    y: { fontSize: 11, transform: ({ base }) => ({ x: base.x - 50 }) },
  },
  marks: [
    text({ fontSize: 11, fill: "#64748b", textAnchor: "end", dx: -4,
           channels: { x: { datum: 1 }, y: { field: "name" }, text: { field: "lo" } } }),
    text({ fontSize: 11, fill: "#64748b", textAnchor: "start", dx: 4,
           channels: { x: { datum: 5 }, y: { field: "name" }, text: { field: "hi" } } }),
    tickX({
      stroke: "black", strokeWidth: 3,
      channels: {
        y: { field: "name" },
        x: { field: "median", edit: move() },                //! drag a median
      },
    }),
  ],
}));`,
    },
    {
      title: 'Your own rating',
      question: 'How easy would it be to fix an error in a table on your phone with a gesture?',
      try: 'Click a circle to answer.',
      why: '`widgets.likert` is a named instrument that returns a whole spec: a one-row dataset, a point per option and an edit that writes the option you click.',
      uses: ['widgets.likert()'],
      code: `mount(Elicit(widgets.likert({                               //! a whole instrument
  question: "Fixing a table error on a phone with a gesture would be…",
  options: ["Very easy", "Easy", "Neutral", "Hard", "Very hard"],
  width: 440,
})));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-concat_layer_voyager_result',
  status: 'partial',
  verdict: 'The upper panel — mean ratings with 95% confidence intervals per study, filled or hollow by measure — is one ElicitJS chart, titled as in the original; the arrow annotation panel underneath is drawn as a guide in the bottom margin, since multiple views are not covered by this study.',
  needs: ['concat'],
  prep: [],
  gaps: [
    'The two-panel `vconcat` becomes one chart; the arrows and their captions are a `guides.custom` under the axis.',
  ],
  recreation: {
    code: `const rows = [
  { measure: "Open Exploration", mean: 1.813, lo: 1.255, hi: 2.37, study: "PoleStar vs Voyager" },
  { measure: "Focused Question Answering", mean: -1.688, lo: -2.325, hi: -1.05, study: "PoleStar vs Voyager" },
  { measure: "Open Exploration", mean: 2.1875, lo: 1.665, hi: 2.71, study: "PoleStar vs Voyager 2" },
  { measure: "Focused Question Answering", mean: -0.0625, lo: -0.474, hi: 0.349, study: "PoleStar vs Voyager 2" },
];

mount(Elicit({
  width: 460, height: 190,
  margins: { top: 10, right: 16, bottom: 70, left: 140 },
  title: "Mean of Subject Ratings (95% CIs)",
  data: rows,
  schema: {
    study:   { type: "categorical", domain: ["PoleStar vs Voyager 2", "PoleStar vs Voyager"] },
    measure: { type: "categorical", domain: ["Focused Question Answering", "Open Exploration"] },
    mean:    { type: "quantitative", domain: [-3, 3] },
    lo:      { type: "quantitative", domain: [-3, 3] },
    hi:      { type: "quantitative", domain: [-3, 3] },
  },
  axes: { x: { grid: { zero: { stroke: "#666" } } } },          //! the gridline at 0, darker
  guides: [
    // The second panel of the original: two arrows saying which side favours which tool.
    guides.custom(({ scales, height }) => {
      const y = height + 38, x = (v) => scales.x.encode(v);
      return [
        { type: "line", x1: x(-0.25), x2: x(-2.9), y1: y, y2: y, stroke: "black" },
        { type: "line", x1: x(0.25), x2: x(2.9), y1: y, y2: y, stroke: "black" },
        { type: "path", fill: "black", points: [[x(-2.9) - 6, y], [x(-2.9), y - 4], [x(-2.9), y + 4]] },
        { type: "path", fill: "black", points: [[x(2.9) + 6, y], [x(2.9), y - 4], [x(2.9), y + 4]] },
        { type: "text", x: x(-0.25), y: y + 14, text: "PoleStar", textAnchor: "end", fontSize: 10, fill: "#333" },
        { type: "text", x: x(-0.25), y: y + 26, text: "More Valuable", textAnchor: "end", fontSize: 10, fill: "#333" },
        { type: "text", x: x(0.25), y: y + 14, text: "Voyager / Voyager 2", textAnchor: "start", fontSize: 10, fill: "#333" },
        { type: "text", x: x(0.25), y: y + 26, text: "More Valuable", textAnchor: "start", fontSize: 10, fill: "#333" },
      ];
    }),
  ],
  marks: [
    ruleY({ stroke: "black", channels: { y: { field: "study" }, x1: { field: "lo" }, x2: { field: "hi" } } }),
    point({
      stroke: "black", size: 5,
      channels: {
        y: { field: "study" }, x: { field: "mean" },
        fill: { field: "measure", scale: { range: ["black", "white"] }, legend: false },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Mean leads',
      question: 'A third study compares PoleStar with a new tool on open exploration. What mean rating, and what 95% interval, do you expect?',
      try: 'Drag the dot to move your estimate; the interval comes with it. Then drag either end to reshape the interval.',
      why: '`follow({ lead: "mean" })` shifts `lo` and `hi` by however far the dot moves, so you place the estimate first and size its interval second. Each end tick is its own part with its own `move()`, so the ends can still be set independently.',
      uses: ['composite', 'move()', 'follow()', 'ordering()'],
      code: `mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 16, bottom: 30, left: 140 },
  data: [
    { study: "PoleStar vs Voyager", mean: 1.813, lo: 1.255, hi: 2.37, given: true },
    { study: "PoleStar vs Voyager 2", mean: 2.1875, lo: 1.665, hi: 2.71, given: true },
    { study: "PoleStar vs new tool", mean: 0, lo: -1, hi: 1, given: false },
  ],
  schema: {
    study: { type: "categorical", domain: ["PoleStar vs new tool", "PoleStar vs Voyager 2", "PoleStar vs Voyager"] },
    mean:  { type: "quantitative", domain: [-3, 3] },
    lo:    { type: "quantitative", domain: [-3, 3] },
    hi:    { type: "quantitative", domain: [-3, 3] },
    given: { type: "categorical", domain: [true, false] },
  },
  lock: (d) => d.given,                                         //! the published studies
  constraints: [
    follow({ field: ["lo", "hi"], lead: "mean" }),           //! the interval rides on the mean
    ordering({ field: ["lo", "mean", "hi"] }),              // lo ≤ mean ≤ hi
    clamp({ field: ["lo", "mean", "hi"] }),
  ],
  axes: { x: { grid: true } },
  guides: [ guides.rule({ x: 0, stroke: "#666", strokeWidth: 1 }) ],
  marks: [
    composite({
      parts: [
        ruleY({ stroke: "black", channels: { y: { field: "study" }, x1: { field: "lo" }, x2: { field: "hi" } } }),
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "lo", edit: move() } } }), //! each end on its own
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "hi", edit: move() } } }),
        point({ fill: "black", stroke: "white", size: 6,
                channels: { y: { field: "study" }, x: { field: "mean", edit: move() } } }), //! drag the mean
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Symmetric interval',
      question: 'A third study compares PoleStar with a new tool on open exploration. What mean rating do you expect, give or take how much?',
      try: 'Drag the dot to move the estimate; drag either end and the other mirrors it.',
      why: '`symmetric({ about: "mean" })` mirrors the end you drag about the dot, so the answer is always a mean ± a margin, the shape of a confidence interval from a symmetric sampling distribution. `follow` still carries both ends with the dot.',
      uses: ['composite', 'move()', 'follow()', 'symmetric()'],
      code: `mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 16, bottom: 30, left: 140 },
  data: [
    { study: "PoleStar vs Voyager", mean: 1.813, lo: 1.255, hi: 2.37, given: true },
    { study: "PoleStar vs Voyager 2", mean: 2.1875, lo: 1.665, hi: 2.71, given: true },
    { study: "PoleStar vs new tool", mean: 0, lo: -1, hi: 1, given: false },
  ],
  schema: {
    study: { type: "categorical", domain: ["PoleStar vs new tool", "PoleStar vs Voyager 2", "PoleStar vs Voyager"] },
    mean:  { type: "quantitative", domain: [-3, 3] },
    lo:    { type: "quantitative", domain: [-3, 3] },
    hi:    { type: "quantitative", domain: [-3, 3] },
    given: { type: "categorical", domain: [true, false] },
  },
  lock: (d) => d.given,                                         //! the published studies
  constraints: [
    follow({ field: ["lo", "hi"], lead: "mean" }),
    symmetric({ field: ["lo", "hi"], about: "mean" }),       //! one end mirrors the other
    ordering({ field: ["lo", "mean", "hi"] }),              // lo ≤ mean ≤ hi
    clamp({ field: ["lo", "mean", "hi"] }),
  ],
  axes: { x: { grid: true } },
  guides: [ guides.rule({ x: 0, stroke: "#666", strokeWidth: 1 }) ],
  marks: [
    composite({
      parts: [
        ruleY({ stroke: "black", channels: { y: { field: "study" }, x1: { field: "lo" }, x2: { field: "hi" } } }),
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "lo", edit: move() } } }), //! drag an end
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "hi", edit: move() } } }),
        point({ fill: "black", stroke: "white", size: 6,
                channels: { y: { field: "study" }, x: { field: "mean", edit: move() } } }), //! drag the mean
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Independent ends',
      question: 'A third study compares PoleStar with a new tool on open exploration. What mean rating, and what 95% interval, do you expect?',
      try: 'Drag the dot, or either end of the line; each part moves alone.',
      why: 'With no `follow`, each part of the `composite` writes only its own field: the dot moves `mean`, each end tick moves `lo` or `hi`. `ordering` keeps `lo ≤ mean ≤ hi` whichever part you grab, so a lopsided interval is allowed.',
      uses: ['composite', 'move()', 'ordering()'],
      code: `mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 16, bottom: 30, left: 140 },
  data: [
    { study: "PoleStar vs Voyager", mean: 1.813, lo: 1.255, hi: 2.37, given: true },
    { study: "PoleStar vs Voyager 2", mean: 2.1875, lo: 1.665, hi: 2.71, given: true },
    { study: "PoleStar vs new tool", mean: 0, lo: -1, hi: 1, given: false },
  ],
  schema: {
    study: { type: "categorical", domain: ["PoleStar vs new tool", "PoleStar vs Voyager 2", "PoleStar vs Voyager"] },
    mean:  { type: "quantitative", domain: [-3, 3] },
    lo:    { type: "quantitative", domain: [-3, 3] },
    hi:    { type: "quantitative", domain: [-3, 3] },
    given: { type: "categorical", domain: [true, false] },
  },
  lock: (d) => d.given,                                         //! the published studies
  constraints: [
    ordering({ field: ["lo", "mean", "hi"] }),              //! lo ≤ mean ≤ hi
    clamp({ field: ["lo", "mean", "hi"] }),
  ],
  axes: { x: { grid: true } },
  guides: [ guides.rule({ x: 0, stroke: "#666", strokeWidth: 1 }) ],
  marks: [
    composite({
      parts: [
        ruleY({ stroke: "black", channels: { y: { field: "study" }, x1: { field: "lo" }, x2: { field: "hi" } } }),
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "lo", edit: move() } } }), //! drag the low end
        tickX({ stroke: "#4c78a8", strokeWidth: 3, length: 14,
                channels: { y: { field: "study" }, x: { field: "hi", edit: move() } } }), //! drag the high end
        point({ fill: "black", stroke: "white", size: 6,
                channels: { y: { field: "study" }, x: { field: "mean", edit: move() } } }), //! drag the mean
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_candlestick',
  status: 'full',
  verdict: 'A candlestick chart: a thin rule from low to high and a bar from open to close per day, both green on an up day and red on a down day through a derived `{ fn }` colour.',
  needs: [],
  prep: [],
  gaps: ['Dates are a band axis of day strings (every fifth labelled, unrotated) rather than a continuous time axis, so weekend gaps are closed up.'],
  recreation: {
    code: `const ohlc = await vegaData("ohlc.json");
const days = ohlc.map((d) => d.date);
const up = (d) => (d.open < d.close ? "#06982d" : "#ae1325");

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 12, right: 12, bottom: 32, left: 40 },
  data: ohlc,
  schema: {
    date:  { type: "ordinal", domain: days },
    open:  { type: "quantitative", domain: [23, 34] },
    high:  { type: "quantitative", domain: [23, 34] },
    low:   { type: "quantitative", domain: [23, 34] },
    close: { type: "quantitative", domain: [23, 34] },
    signal: { type: "categorical" },
    ret:   { type: "quantitative" },
  },
  axes: {
    x: { title: "Date in 2009", tickValues: days.filter((d, i) => i % 5 === 0),
         tickFormat: (d) => d.slice(5).replace("-", "/") },
  },
  marks: [
    ruleX({ channels: { x: { field: "date" }, y1: { field: "low" }, y2: { field: "high" }, stroke: { fn: up } } }),
    barY({ channels: { x: { field: "date" }, y1: { field: "open" }, y2: { field: "close" }, fill: { fn: up } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Tomorrow\'s candle',
      question: 'Here are the last ten trading days. Draw the candle you expect for the next day: its high, low and close.',
      try: 'Drag the top or bottom tick to set the high or low, and the white dot to set the close.',
      why: 'A candle is four fields of one row, so it is a `composite` whose parts each own one field. `lock` fixes the history, and two `ordering` rules keep the open and close inside the day\'s range.',
      uses: ['composite', 'move()', 'ordering()', 'lock'],
      code: `const ohlc = (await vegaData("ohlc.json")).slice(-10);
const last = ohlc[ohlc.length - 1];
const rows = [...ohlc, { date: "next day", open: last.close, high: last.close + 1, low: last.close - 1, close: last.close }];
const up = (d) => (d.open < d.close ? "#06982d" : "#ae1325");

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 12, right: 12, bottom: 32, left: 40 },
  data: rows,
  schema: {
    date:  { type: "ordinal", domain: rows.map((d) => d.date) },
    open:  { type: "quantitative", domain: [20, 34] },
    high:  { type: "quantitative", domain: [20, 34] },
    low:   { type: "quantitative", domain: [20, 34] },
    close: { type: "quantitative", domain: [20, 34] },
    signal: { type: "categorical" },
    ret:   { type: "quantitative" },
  },
  lock: (d) => d.date !== "next day",                            //! the history is given
  constraints: [
    ordering({ field: ["low", "close", "high"] }),              //! close within the range
    ordering({ field: ["low", "open", "high"] }),
  ],
  axes: { x: { tickFormat: (d) => (d === "next day" ? "next" : d.slice(5).replace("-", "/")) } },
  marks: [
    composite({
      parts: [
        ruleX({ channels: { x: { field: "date" }, y1: { field: "low" }, y2: { field: "high" }, stroke: { fn: up } } }),
        barY({ channels: { x: { field: "date" }, y1: { field: "open" }, y2: { field: "close" }, fill: { fn: up } } }),
        tickY({ stroke: "#334155", strokeWidth: 3, channels: { x: { field: "date" }, y: { field: "high", edit: move() } } }), //! the high
        tickY({ stroke: "#334155", strokeWidth: 3, channels: { x: { field: "date" }, y: { field: "low", edit: move() } } }),  //! the low
        point({ fill: "white", stroke: "#334155", size: 5, channels: { x: { field: "date" }, y: { field: "close", edit: move() } } }), //! the close
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Range for the week',
      question: 'For each of the next five trading days, between what low and what high will the stock trade?',
      try: 'Drag a bar\'s top or bottom edge to stretch it, or its middle to slide the whole range. The dashed line is the last close.',
      why: '`brushSpan` on `y1`/`y2` turns each bar into an interval you can resize at either edge or move whole, which is how a day\'s trading range is naturally drawn.',
      uses: ['brushSpan()', 'barY'],
      code: `const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 30, left: 40 },
  data: days.map((day) => ({ day, low: 27, high: 30 })),
  schema: {
    day:  { type: "ordinal", domain: days },
    low:  { type: "quantitative", domain: [20, 36] },
    high: { type: "quantitative", domain: [20, 36] },
  },
  guides: [ guides.rule({ y: 28.25, stroke: "#334155", strokeDash: "4 3" }) ],
  marks: [
    barY({
      fill: "#06982d", fillOpacity: 0.6,
      channels: { x: { field: "day" }, y1: { field: "low" }, y2: { field: "high" } },
      edits: [ brushSpan({ channels: ["y1", "y2"], edgeInset: 10 }) ], //! resize or move each range
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_ranged_dot',
  status: 'full',
  verdict: 'Life expectancy in 1955 and 2000 for the five most populous countries: a line per country joining two dots coloured by year.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const all = await vegaData("countries.json");
const keep = ["China", "India", "United States", "Indonesia", "Brazil"];
const rows = all.filter((d) => keep.includes(d.country) && (d.year === 1955 || d.year === 2000))
  .map(({ country, year, life_expect }) => ({ country, year, life_expect }));

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 10, right: 16, bottom: 32, left: 100 },
  data: rows,
  schema: {
    country:     { type: "categorical", domain: keep.slice().sort().reverse() },
    year:        { type: "ordinal", domain: [1955, 2000] },
    life_expect: { type: "quantitative", domain: [35, 80] },
  },
  axes: { x: { title: "Life Expectancy (years)" } },
  legends: true,
  marks: [
    line({
      stroke: "#db646f", strokeWidth: 2,
      channels: { x: { field: "life_expect" }, y: { field: "country" }, series: { field: "country" } },
    }),
    point({
      size: 6,
      channels: {
        x: { field: "life_expect" }, y: { field: "country" },
        fill: { field: "year", scale: { range: ["#e6959c", "#911a24"] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Predict 2050',
      question: 'Life expectancy in 2000 is shown. Where will each country be in 2050?',
      try: 'Drag each dark dot left or right.',
      why: 'Each row holds both years. `move()` on the 2050 dot writes `e2050`, and the connecting `ruleY` spans `x1`/`x2` from the same row, so the line stretches with your answer.',
      uses: ['move()', 'ruleY', 'clamp()'],
      code: `const rows = [
  { country: "Brazil", e2000: 71.0 }, { country: "China", e2000: 72.0 },
  { country: "India", e2000: 62.9 }, { country: "Indonesia", e2000: 68.6 },
  { country: "United States", e2000: 77.3 },
].map((d) => ({ ...d, e2050: d.e2000 }));

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 10, right: 16, bottom: 32, left: 100 },
  data: rows,
  schema: {
    country: { type: "categorical", domain: rows.map((d) => d.country).reverse() },
    e2000:   { type: "quantitative", domain: [55, 95] },
    e2050:   { type: "quantitative", domain: [55, 95] },
  },
  constraints: [ clamp({ field: "e2050", min: 55, max: 95 }) ],
  axes: { x: { title: "Life Expectancy (years)" } },
  marks: [
    ruleY({ stroke: "#db646f", strokeWidth: 2,
            channels: { y: { field: "country" }, x1: { field: "e2000" }, x2: { field: "e2050" } } }),
    point({ fill: "#911a24", size: 7,
            channels: { y: { field: "country" }, x: { field: "e2050", edit: move() } } }), //! drag 2050
    // The 2000 value as a ring on top, so it stays visible under the 2050 dot.
    point({ fill: "none", stroke: "#e6959c", strokeWidth: 3, size: 9, channels: { y: { field: "country" }, x: { field: "e2000" } } }),
  ],
}));`,
    },
    {
      title: 'Interval for 2050',
      question: 'Give a range you are 80% sure will contain each country\'s 2050 life expectancy.',
      try: 'Drag either end of a band to stretch it, or its middle to slide it.',
      why: 'An interval is two fields, so `barX` spans `x1`/`x2` and `brushSpan` resizes it at either edge or moves it whole. The 2000 values are the original\'s pale dots, drawn from read-only `context` rows.',
      uses: ['brushSpan()', 'barX', 'context'],
      code: `const now = [
  { country: "Brazil", life_expect: 71.0 }, { country: "China", life_expect: 72.0 },
  { country: "India", life_expect: 62.9 }, { country: "Indonesia", life_expect: 68.6 },
  { country: "United States", life_expect: 77.3 },
];
const countries = now.map((d) => d.country);
const years = { type: "quantitative", domain: [55, 95] };

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 10, right: 16, bottom: 32, left: 100 },
  schema: {
    country: { type: "categorical", domain: countries.slice().reverse() },
    lo: years, hi: years, life_expect: years,
  },
  data: [...now, ...now.map((d) => ({ country: d.country, lo: d.life_expect, hi: d.life_expect + 6 }))],
  context: (d) => d.life_expect != null,                    //! 2000, for reference
  axes: { x: { title: "Life Expectancy in 2050 (years)" } },
  marks: [
    barX({
      fill: "#911a24", fillOpacity: 0.35,
      channels: { y: { field: "country" }, x1: { field: "lo" }, x2: { field: "hi" } },
      edits: [ brushSpan({ channels: ["x1", "x2"], edgeInset: 10 }) ], //! resize or slide the interval
    }),
    point({ fill: "#e6959c", size: 5, channels: { y: { field: "country" }, x: { field: "life_expect" } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-facet_bullet',
  status: 'partial',
  verdict: 'Five bullet charts in one panel: each row\'s ranges, measures and target are rescaled to a fraction of that row\'s top range, and a per-row tick scale in the original units is drawn under each bullet as a guide. Faceting is not covered by this study, so the per-row independent scales are flattened.',
  needs: ['facet', 'dual-axis'],
  prep: ['prep-calculate'],
  gaps: [
    'The original facets by row with an independent x scale per row. Here every row shares one 0–1 scale, and each row\'s own units appear only as guide tick labels.',
    'The subtitles (units) are folded into the row label.',
  ],
  recreation: {
    code: `const raw = [
  { title: "Revenue", subtitle: "US$, in thousands", ranges: [150, 225, 300], measures: [220, 270], markers: [250] },
  { title: "Profit", subtitle: "%", ranges: [20, 25, 30], measures: [21, 23], markers: [26] },
  { title: "Order Size", subtitle: "US$, average", ranges: [350, 500, 600], measures: [100, 320], markers: [550] },
  { title: "New Customers", subtitle: "count", ranges: [1400, 2000, 2500], measures: [1000, 1650], markers: [2100] },
  { title: "Satisfaction", subtitle: "out of 5", ranges: [3.5, 4.25, 5], measures: [3.2, 4.7], markers: [4.4] },
];
// One shared scale: every value as a fraction of its row's top range.
const rows = raw.map((d) => {
  const k = d.ranges[2];
  return { title: d.title, max: k, r0: d.ranges[0] / k, r1: d.ranges[1] / k, r2: 1,
           m0: d.measures[0] / k, m1: d.measures[1] / k, mark: d.markers[0] / k };
});
const frac = { type: "quantitative", domain: [0, 1] };

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 6, right: 12, bottom: 4, left: 100 },
  data: rows,
  schema: {
    title: { type: "categorical", domain: raw.map((d) => d.title).sort().reverse() },
    max: { type: "quantitative" },
    r0: frac, r1: frac, r2: frac, m0: frac, m1: frac, mark: frac,
  },
  axes: { x: false },
  guides: [
    // Each row's own axis, in its own units, under its bullet.
    guides.custom(({ scales }) => rows.flatMap((d) => d3.ticks(0, d.max, 5).map((t) => ({
      type: "text", x: scales.x.encode(t / d.max), y: scales.y.encode(d.title) + 24,
      text: d3.format("~s")(t), textAnchor: "middle", fontSize: 9, fill: "#64748b",
    })))),
  ],
  marks: [
    barX({ fill: "#eee", channels: { y: { field: "title" }, x: { field: "r2" } } }),
    barX({ fill: "#ddd", channels: { y: { field: "title" }, x: { field: "r1" } } }),
    barX({ fill: "#ccc", channels: { y: { field: "title" }, x: { field: "r0" } } }),
    rect({ fill: "lightsteelblue", channels: { y: { field: "title" }, x1: { datum: 0 }, x2: { field: "m1" }, height: { value: 10 } } }),
    rect({ fill: "steelblue", channels: { y: { field: "title" }, x1: { datum: 0 }, x2: { field: "m0" }, height: { value: 10 } } }),
    tickX({ stroke: "black", strokeWidth: 2, channels: { y: { field: "title" }, x: { field: "mark" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast revenue',
      question: 'Revenue so far this year is US$220k against a US$250k target. What will the full-year figure be?',
      try: 'Drag the dark bar\'s end to your forecast.',
      why: 'The grey bands and the target tick are fields of the same row, drawn by inert marks. Only the forecast bar carries `move()`, so it is the one thing the reader can grab.',
      uses: ['move()', 'barX', 'tickX'],
      code: `mount(Elicit({
  width: 440, height: 110,
  margins: { top: 10, right: 16, bottom: 26, left: 110 },
  data: [{ title: "Revenue (US$k)", poor: 150, ok: 225, good: 300, so_far: 220, forecast: 240, target: 250 }],
  schema: {
    title: { type: "categorical", domain: ["Revenue (US$k)"] },
    poor: { type: "quantitative", domain: [0, 300] }, ok: { type: "quantitative", domain: [0, 300] },
    good: { type: "quantitative", domain: [0, 300] }, so_far: { type: "quantitative", domain: [0, 300] },
    forecast: { type: "quantitative", domain: [0, 300] }, target: { type: "quantitative", domain: [0, 300] },
  },
  constraints: [ clamp({ field: "forecast", min: 0, max: 300 }) ],
  marks: [
    barX({ fill: "#eee", channels: { y: { field: "title" }, x: { field: "good" } } }),
    barX({ fill: "#ddd", channels: { y: { field: "title" }, x: { field: "ok" } } }),
    barX({ fill: "#ccc", channels: { y: { field: "title" }, x: { field: "poor" } } }),
    rect({ fill: "steelblue", channels: { y: { field: "title" }, x1: { datum: 0 },
           x2: { field: "forecast", edit: move() }, height: { value: 12 } } }), //! drag your forecast
    rect({ fill: "lightsteelblue", channels: { y: { field: "title" }, x1: { datum: 0 }, x2: { field: "so_far" }, height: { value: 6 } } }),
    tickX({ stroke: "black", strokeWidth: 2, channels: { y: { field: "title" }, x: { field: "target" } } }),
  ],
}));`,
    },
    {
      title: 'Where is "good"?',
      question: 'On a 1–5 satisfaction score, where does "poor" end and where does "good" begin?',
      try: 'Drag the two dark ticks; they cannot cross.',
      why: 'The two qualitative boundaries are the elicited fields. Each is a `tickX` with `move()`, the grey bands re-derive from them, and `ordering` keeps "poor" below "good".',
      uses: ['move()', 'ordering()', 'snap()'],
      code: `mount(Elicit({
  width: 440, height: 110,
  margins: { top: 10, right: 16, bottom: 26, left: 110 },
  data: [{ title: "Satisfaction", top: 5, poor: 3, good: 4 }],
  schema: {
    title: { type: "categorical", domain: ["Satisfaction"] },
    top:  { type: "quantitative", domain: [1, 5] },
    poor: { type: "quantitative", domain: [1, 5] },
    good: { type: "quantitative", domain: [1, 5] },
  },
  constraints: [
    ordering({ field: ["poor", "good"] }),                  //! poor ends before good begins
    snap({ step: 0.05 }),
  ],
  marks: [
    barX({ fill: "#eee", channels: { y: { field: "title" }, x1: { datum: 1 }, x2: { field: "top" } } }),
    barX({ fill: "#ddd", channels: { y: { field: "title" }, x1: { datum: 1 }, x2: { field: "good" } } }),
    barX({ fill: "#ccc", channels: { y: { field: "title" }, x1: { datum: 1 }, x2: { field: "poor" } } }),
    tickX({ stroke: "#334155", strokeWidth: 4, channels: { y: { field: "title" }, x: { field: "poor", edit: move() } } }), //! end of poor
    tickX({ stroke: "#334155", strokeWidth: 4, channels: { y: { field: "title" }, x: { field: "good", edit: move() } } }), //! start of good
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_dual_axis',
  status: 'partial',
  verdict: 'Seattle\'s monthly temperature band and precipitation line share one plot, but ElicitJS has one y scale per chart, so the precipitation is rescaled into temperature units by hand and its right-hand axis is a relabelled `axisY`.',
  needs: ['dual-axis'],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: [
    'Precipitation is multiplied into the temperature range in JavaScript; the right axis places ticks at the scaled positions and labels them in precipitation units.',
  ],
  recreation: {
    code: `const rows = (await vegaData("weather.csv")).filter((d) => d.location === "Seattle");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const k = 5; // 0–6 of precipitation onto the 0–30 °C axis
const monthly = months.map((month, i) => {
  const m = rows.filter((d) => d.date.getUTCMonth() === i);
  return { month, tmax: d3.mean(m, (d) => d.temp_max), tmin: d3.mean(m, (d) => d.temp_min),
           rain: k * d3.mean(m, (d) => d.precipitation) };
});

mount(Elicit({
  width: 440, height: 300,
  margins: { top: 12, right: 52, bottom: 28, left: 52 },
  data: monthly,
  schema: {
    month: { type: "ordinal", domain: months },
    tmax:  { type: "quantitative", domain: [0, 30] },
    tmin:  { type: "quantitative", domain: [0, 30] },
    rain:  { type: "quantitative", domain: [0, 30] },
  },
  elements: [
    axisY({ title: "Avg. Temperature (°C)", stroke: "#85C5A6", titleFill: "#4d9a74" }), //! colour the title alone
    // The second axis: ticks at the scaled positions, labelled in the original units.
    axisY({ anchor: "right", title: "Precipitation (inches)", titleFill: "#5b85a8", tickValues: [0, 1, 2, 3, 4, 5, 6].map((v) => v * k),
            tickFormat: (v) => String(v / k), stroke: "#85A9C5" }),
  ],
  marks: [
    areaY({ fill: "#85C5A6", fillOpacity: 0.3, stroke: "none", connect: "sequence",
            channels: { x: { field: "month" }, y1: { field: "tmin" }, y2: { field: "tmax" } } }),
    lineY({ stroke: "#85A9C5", strokeWidth: 2, curve: "monotoneX",
            channels: { x: { field: "month" }, y: { field: "rain" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sketch the band',
      question: 'What are Seattle\'s average daily high and low temperatures in each month?',
      try: 'Drag the upper edge of the band for the highs and the lower edge for the lows.',
      why: 'The band is `areaY` over a `y1`/`y2` pair, and each edge carries its own `move()` so one gesture never moves both. `ordering` keeps every low under its high.',
      uses: ['areaY', 'move()', 'ordering()'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 28, left: 36 },
  data: months.map((month) => ({ month, tmin: 8, tmax: 16 })),
  schema: {
    month: { type: "ordinal", domain: months },
    tmin:  { type: "quantitative", domain: [-5, 35] },
    tmax:  { type: "quantitative", domain: [-5, 35] },
  },
  constraints: [ ordering({ field: ["tmin", "tmax"] }) ],    //! lows stay below highs
  axes: { y: { tickFormat: (v) => v + "°" } },
  marks: [
    areaY({
      fill: "#85C5A6", fillOpacity: 0.35, stroke: "#4d9a74", connect: "sequence",
      channels: {
        x:  { field: "month" },
        y1: { field: "tmin", edit: move({ channels: ["y1"] }) }, //! the lows
        y2: { field: "tmax", edit: move({ channels: ["y2"] }) }, //! the highs
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the band',
      question: 'Sketch the band of Seattle\'s daily highs and lows through the year in two strokes.',
      try: 'Press near the upper edge and sweep across the months to paint the highs; press near the lower edge and sweep again for the lows.',
      why: 'Both edges carry `edit.line.sweep()`. A sweep paints the edge nearest the pointer at dragstart, so one stroke writes every month\'s high and the next every month\'s low. `ordering` keeps the band from turning inside out.',
      uses: ['areaY', 'edit.line.sweep()', 'ordering()'],
      code: `const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 28, left: 36 },
  data: months.map((month) => ({ month, tmin: 8, tmax: 16 })),
  schema: {
    month: { type: "ordinal", domain: months },
    tmin:  { type: "quantitative", domain: [-5, 35] },
    tmax:  { type: "quantitative", domain: [-5, 35] },
  },
  constraints: [ ordering({ field: ["tmin", "tmax"] }) ],
  axes: { y: { tickFormat: (v) => v + "°" } },
  marks: [
    areaY({
      fill: "#85C5A6", fillOpacity: 0.35, stroke: "#4d9a74", connect: "sequence", handles: "hit",
      channels: {
        x:  { field: "month" },
        y1: { field: "tmin", edit: edit.line.sweep() },     //! sweep the lows
        y2: { field: "tmax", edit: edit.line.sweep() },     //! sweep the highs
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-bar_layered_weather',
  status: 'full',
  verdict: 'A week of floating bars: wide grey bars for the record and normal ranges, narrow black bars for observed ranges, and for forecast days a low and a high range joined by a thin stem, with the weekday above each column.',
  needs: [],
  prep: ['prep-reshape'],
  gaps: [
    'Observed days fill the forecast columns with their observed range so one row shape serves every day; the drawing is the same.',
  ],
  recreation: {
    code: `const week = await vegaData("weekly-weather.json");
// Flatten the nested fields; observed days reuse their range for the forecast columns.
const rows = week.map((d) => {
  const lo = d.actual ? [d.actual.low, d.actual.high] : [d.forecast.low.low, d.forecast.low.high];
  const hi = d.actual ? lo : [d.forecast.high.low, d.forecast.high.high];
  return { id: d.id, day: d.day, recLo: d.record.low, recHi: d.record.high,
           normLo: d.normal.low, normHi: d.normal.high,
           aLo: lo[0], aHi: lo[1], bLo: hi[0], bHi: hi[1] };
});
const temp = { type: "quantitative", domain: [10, 70] };
const span = (lo, hi, w, fill) => rect({ fill, channels: {
  x: { field: "id" }, y1: { field: lo }, y2: { field: hi }, width: { value: w } } });

mount(Elicit({
  width: 300, height: 260,
  margins: { top: 22, right: 10, bottom: 10, left: 46 },
  title: "Weekly Weather",
  subtitle: "Observations and Predictions",
  axes: { x: false, y: { title: "Temperature (F)" } },
  data: rows,
  schema: {
    id: { type: "ordinal", domain: rows.map((d) => d.id) },
    day: { type: "categorical" },
    recLo: temp, recHi: temp, normLo: temp, normHi: temp, aLo: temp, aHi: temp, bLo: temp, bHi: temp,
  },
  marks: [
    span("recLo", "recHi", 20, "#ccc"),
    span("normLo", "normHi", 20, "#999"),
    span("aLo", "aHi", 12, "#000"),
    span("aHi", "bLo", 3, "#000"),
    span("bLo", "bHi", 12, "#000"),
    text({ fontSize: 11, channels: { x: { field: "id" }, y: { value: -8 }, text: { field: "day" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast the week',
      question: 'The first five days were observed. What will the low and high temperature be on each of the next five?',
      try: 'Drag the top or bottom of a black bar on the right to set the high or low, or its middle to slide both.',
      why: 'Observed days are `lock`ed, so `brushSpan` on `y1`/`y2` only reaches the forecast days. The record and normal ranges are inert bars over the same rows, giving the reader the context a forecaster has.',
      uses: ['brushSpan()', 'lock', 'ordering()', 'rect'],
      code: `const week = await vegaData("weekly-weather.json");
// Observed days keep their range; forecast days start at the normal range.
const rows = week.map((d) => ({
  id: d.id, day: d.day, observed: !!d.actual,
  recLo: d.record.low, recHi: d.record.high, normLo: d.normal.low, normHi: d.normal.high,
  lo: d.actual ? d.actual.low : d.normal.low, hi: d.actual ? d.actual.high : d.normal.high,
}));
const temp = { type: "quantitative", domain: [10, 70] };

mount(Elicit({
  width: 360, height: 260,
  margins: { top: 22, right: 10, bottom: 10, left: 34 },
  data: rows,
  schema: {
    id: { type: "ordinal", domain: rows.map((d) => d.id) },
    day: { type: "categorical" }, observed: { type: "categorical", domain: [true, false] },
    recLo: temp, recHi: temp, normLo: temp, normHi: temp, lo: temp, hi: temp,
  },
  lock: (d) => d.observed,                                   //! observed days are given
  constraints: [ ordering({ field: ["lo", "hi"] }) ],
  axes: { x: false },
  marks: [
    rect({ fill: "#ccc", channels: { x: { field: "id" }, y1: { field: "recLo" }, y2: { field: "recHi" }, width: { value: 20 } } }),
    rect({ fill: "#999", channels: { x: { field: "id" }, y1: { field: "normLo" }, y2: { field: "normHi" }, width: { value: 20 } } }),
    rect({
      fill: "#000",
      channels: { x: { field: "id" }, y1: { field: "lo" }, y2: { field: "hi" }, width: { value: 12 } },
      edits: [ brushSpan({ channels: ["y1", "y2"], edgeInset: 6 }) ], //! stretch or slide the range
    }),
    text({ fontSize: 11, channels: { x: { field: "id" }, y: { value: -8 }, text: { field: "day" } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-wheat_wages',
  status: 'full',
  verdict: 'Playfair\'s wheat-and-wages chart: five-year wheat price bars, the wages area with its line, faint rules every fifty years, and the monarchs\' reigns as a strip of black and white boxes with their names, drawn from read-only `context` rows as in the original.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Smaller than the 900×400 original, so the monarch names are crowded.',
  ],
  recreation: {
    code: `const wheat = (await vegaData("wheat.json")).map((d) => ({ ...d, year: +d.year, end: +d.year + 5 }));
// The reigns, with the original's box and label offsets.
const monarchs = (await vegaData("monarchs.json")).map((m) => {
  const up = m.commonwealth || m.index % 2 === 0;
  return { ...m, offset: up ? 97 : 93, labelY: up ? 96 : 94, mid: (m.start + m.end) / 2 };
});
const year = { type: "quantitative", domain: [1565, 1825] };
const value = { type: "quantitative", domain: [0, 100] };

mount(Elicit({
  width: 480, height: 240,
  margins: { top: 10, right: 10, bottom: 26, left: 30 },
  schema: {
    // The last two years have a wheat price and no wage: the wage line stops there.
    year, end: year, wheat: value, wages: value,
    // A reign has a start and an end too: \`end\` is shared by both kinds of row.
    name: { type: "categorical" }, start: year, mid: year,
    index: { type: "quantitative" }, commonwealth: { type: "categorical" },
    offset: value, labelY: value,
  },
  data: [...monarchs, ...wheat],
  context: (d) => d.name != null,                // the reigns: drawn, never elicited
  axes: { x: { tickFormat: "d", ticks: 5 } },
  guides: [
    ...[1600, 1650, 1700, 1750, 1800].map((x) => guides.rule({ x, stroke: "#000", strokeDash: "none", strokeWidth: 0.6, opacity: 0.5 })),
  ],
  marks: [
    rectY({ fill: "#aaa", stroke: "#999", channels: { x1: { field: "year" }, x2: { field: "end" }, y: { field: "wheat" } } }),
    areaY({ fill: "#a4cedb", fillOpacity: 0.7, stroke: "none", channels: { x: { field: "year" }, y: { field: "wages" } } }),
    lineY({ stroke: "#000", opacity: 0.7, channels: { x: { field: "year" }, y: { field: "wages" } } }),
    lineY({ stroke: "#EE8182", dy: -2, channels: { x: { field: "year" }, y: { field: "wages" } } }),
    rect({
      stroke: "#000",
      channels: {
        x1: { field: "start" }, x2: { field: "end" }, y1: { datum: 95 }, y2: { field: "offset" },
        fill: { fn: (d) => (d.commonwealth ? "white" : "black") },
      },
    }),
    text({
      fontSize: 7, dy: 14,
      channels: { x: { field: "mid" }, y: { field: "labelY" }, text: { field: "name" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Plot the wages',
      question: 'Weekly wages up to 1700 are shown. Where were they in the eighteenth century?',
      try: 'Click the chart to add a wage point; drag a point to adjust it.',
      why: 'The seeded wages are `lock`ed. `create()` mints a row at the clicked year and wage, `move()` adjusts it, and the line joins every row in year order, so each click extends the curve. The wheat prices are `context` rows behind it, with columns of their own.',
      uses: ['create()', 'move()', 'lock', 'lineY', 'context'],
      code: `const wheat = (await vegaData("wheat.json")).map((d) => ({ year: +d.year, end: +d.year + 5, wheat: d.wheat, wages: d.wages }));
const year = { type: "quantitative", domain: [1565, 1825] };
const value = { type: "quantitative", domain: [0, 100] };

mount(Elicit({
  width: 480, height: 240,
  margins: { top: 10, right: 10, bottom: 26, left: 30 },
  schema: { year, wages: value, start: year, end: year, wheat: value },
  data: [
    ...wheat.map(({ year, end, wheat }) => ({ start: year, end, wheat })),
    ...wheat.filter((d) => d.year <= 1700).map(({ year, wages }) => ({ year, wages })),
  ],
  context: (d) => d.wheat != null,                           //! wheat prices, for context
  lock: "seed",                                              //! wages to 1700 are given
  axes: { x: { tickFormat: "d", ticks: 5 } },
  guides: [ guides.region({ x: [1700, 1825], fill: "#a4cedb", opacity: 0.25 }) ],
  marks: [
    rectY({ fill: "#ddd", channels: { x1: { field: "start" }, x2: { field: "end" }, y: { field: "wheat" } } }),
    lineY({ stroke: "#EE8182", strokeWidth: 2, channels: { x: { field: "year" }, y: { field: "wages" } } }),
    point({
      fill: "#EE8182", size: 4,
      channels: { x: { field: "year" }, y: { field: "wages" } },
      edits: [ create(), move({ channels: ["x", "y"] }) ],   //! click to add, drag to adjust
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the wages',
      question: 'Wages up to 1700 are given. Sketch how they moved through the eighteenth century.',
      try: 'Press on the shaded part of the chart and sweep left to right; every five-year step you pass takes the pointer\'s height.',
      why: 'The wages area carries `edit.line.sweep()`, so one stroke paints every year it crosses, the way Playfair\'s area reads. `lock` keeps the record before 1700 out of reach of the sweep.',
      uses: ['areaY', 'edit.line.sweep()', 'lock'],
      code: `const wheat = (await vegaData("wheat.json")).map((d) => ({ year: +d.year, wages: d.wages }));
const rows = wheat.map((d) => ({ year: d.year, wages: d.year <= 1700 ? d.wages : 10 }));

mount(Elicit({
  width: 480, height: 240,
  margins: { top: 10, right: 10, bottom: 26, left: 30 },
  data: rows,
  schema: {
    year:  { type: "quantitative", domain: [1565, 1825] },
    wages: { type: "quantitative", domain: [0, 60] },
  },
  lock: (d) => d.year <= 1700,                               //! the record is given
  axes: { x: { tickFormat: "d", ticks: 5 } },
  guides: [ guides.region({ x: [1700, 1825], fill: "#fde68a", opacity: 0.3 }) ],
  marks: [
    areaY({
      fill: "#a4cedb", fillOpacity: 0.7, stroke: "#EE8182", strokeWidth: 2, handles: "hit",
      channels: { x: { field: "year" }, y: { field: "wages", edit: edit.line.sweep() } }, //! one stroke paints the century
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ Maps (Geographic Displays)

GALLERY.add({
  id: 'vl-geo_choropleth',
  status: 'full',
  verdict: 'US counties on an Albers USA projection, each filled by its 2009 unemployment rate: the counties become rows with a geometry and a rate, drawn by `geoPolygon`.',
  needs: [],
  prep: ['prep-geo', 'prep-lookup'],
  gaps: ['The default continuous colour ramp and legend differ in look from Vega-Lite\'s.'],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const rates = new Map((await vegaData("unemployment.tsv")).map((d) => [d.id, d.rate]));
const counties = topojson.feature(us, us.objects.counties).features
  .filter((f) => rates.has(f.id))
  .map((f) => ({ id: f.id, rate: rates.get(f.id), geometry: f.geometry }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: topojson.feature(us, us.objects.states) },
  data: counties,
  schema: {
    id:       { type: "categorical" },
    rate:     { type: "quantitative", domain: [0, 0.3] },
    geometry: { type: "categorical" },
  },
  marks: [
    geoPolygon({
      stroke: "none",
      channels: {
        geometry: { field: "geometry", scale: null },
        fill: { field: "rate", legend: { title: "rate", tickFormat: ".0%" } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Classify the states',
      question: 'In 2009, was unemployment in each state low, middling or high?',
      try: 'Click a state to cycle its guess: unknown, low, mid, high.',
      why: 'Each state is a row whose `guess` is an ordinal field; `cycle()` on `fill` advances it through the declared domain, and the ordinal domain gets an ordered ramp so "high" reads darker than "low".',
      uses: ['geoPolygon', 'cycle()'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: states.features.map((f) => ({ id: f.id, guess: "?", geometry: f.geometry })),
  schema: {
    id:       { type: "categorical" },
    guess:    { type: "ordinal", domain: ["?", "low", "mid", "high"] }, //! the answer scale
    geometry: { type: "categorical" },
  },
  marks: [
    geoPolygon({
      stroke: "white", strokeWidth: 0.8,
      channels: {
        geometry: { field: "geometry", scale: null },
        fill: { field: "guess", edit: cycle(), legend: true }, //! click to cycle
      },
    }),
  ],
}));`,
    },
    {
      title: 'Pin the worst county',
      question: 'Which county had the highest unemployment rate in 2009? Put a pin on it.',
      try: 'Drag the pin to the county you have in mind.',
      why: 'The answer is a location, so it is a one-row dataset of `lon`/`lat`. `edit.geo.move()` runs the pointer back through the projection, so the pin writes coordinates, not pixels.',
      uses: ['geoPoint', 'edit.geo.move()', 'geoBasemap'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: [{ lon: -98.5, lat: 39.5 }],                          //! one answer
  schema: {
    lon: { type: "quantitative", domain: [-125, -66] },
    lat: { type: "quantitative", domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.counties), fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 0.3 }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: "none", stroke: "#64748b", strokeWidth: 0.8 }),
    geoPoint({
      size: 7, fill: "#e45755", stroke: "white", strokeWidth: 2,
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [ edit.geo.move() ],                             //! drag through the projection
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_circle',
  status: 'full',
  verdict: 'About 42,000 US zip codes as one-pixel dots on Albers USA, coloured by their first digit, drawn on the canvas renderer.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Drawn with `CanvasRenderer` because of the row count; the palette differs.'],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const zips = (await vegaData("zipcodes.csv", { type: "text" }).then(d3.csvParse))
  .map((d) => ({ lon: +d.longitude, lat: +d.latitude, digit: d.zip_code[0] }));

mount(Elicit({
  width: 480, height: 300,
  renderer: new CanvasRenderer(),
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: topojson.feature(us, us.objects.states) },
  data: zips,
  schema: {
    lon:   { type: "quantitative" },
    lat:   { type: "quantitative" },
    digit: { type: "categorical", domain: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] },
  },
  legends: true,
  marks: [
    geoPoint({ size: 0.7, channels: { lon: { field: "lon" }, lat: { field: "lat" }, fill: { field: "digit" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the digits',
      question: 'Zip codes start with a digit from 0 to 9 that names a region. Where is each region centred?',
      try: 'Drag each numbered pin to where you think that digit\'s zip codes are.',
      why: 'Ten rows, one per digit, each a `lon`/`lat`. `edit.geo.move()` on the dots writes the location; the numbers are a `geoText` over the same rows, so they follow.',
      uses: ['geoPoint', 'geoText', 'edit.geo.move()'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  // All ten start in a row across the middle of the country.
  data: digits.map((digit, i) => ({ digit, lon: -118 + i * 4.5, lat: 38 })),
  schema: {
    digit: { type: "categorical", domain: digits },
    lon:   { type: "quantitative", domain: [-125, -66] },
    lat:   { type: "quantitative", domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "#f1f5f9", stroke: "white" }),
    geoPoint({
      size: 9,
      channels: { lon: { field: "lon" }, lat: { field: "lat" }, fill: { field: "digit" } },
      edits: [ edit.geo.move() ],                             //! drag a region's pin
    }),
    geoText({
      fontSize: 11, fill: "white",
      channels: { lon: { field: "lon" }, lat: { field: "lat" }, text: { field: "digit" } },
    }),
  ],
}));`,
    },
    {
      title: 'Box the 9s',
      question: 'Draw a box around the part of the country where zip codes begin with 9.',
      try: 'Drag an edge or corner of the box to reshape it, or its middle to move it.',
      why: 'A region is four fields — `west`, `south`, `east`, `north` — so `geoRect` draws it and `edit.geo.brush` reshapes it by edge, corner or body, inverting every gesture through the projection.',
      uses: ['geoRect', 'edit.geo.brush()'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: [{ west: -105, south: 33, east: -95, north: 42 }],
  schema: {
    west:  { type: "quantitative", domain: [-125, -66] },
    south: { type: "quantitative", domain: [24, 50] },
    east:  { type: "quantitative", domain: [-125, -66] },
    north: { type: "quantitative", domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "#f1f5f9", stroke: "white" }),
    geoRect({
      fill: "rgba(76, 120, 168, 0.25)", stroke: "#4c78a8", strokeWidth: 2,
      channels: {
        west: { field: "west" }, south: { field: "south" },
        east: { field: "east" }, north: { field: "north" },
      },
      edits: [ edit.geo.brush({ edgeInset: 10 }) ],           //! reshape or move the region
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_layer',
  status: 'full',
  verdict: 'US states in light grey with every airport as a small steelblue dot on Albers USA.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const airports = await vegaData("airports.csv");

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: airports.map((d) => ({ iata: d.iata, lon: d.longitude, lat: d.latitude })),
  schema: {
    iata: { type: "categorical" },
    lon:  { type: "quantitative" },
    lat:  { type: "quantitative" },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoPoint({ size: 1.8, fill: "steelblue", channels: { lon: { field: "lon" }, lat: { field: "lat" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Pin the hubs',
      question: 'Where are the five busiest airports in the US? Pin them.',
      try: 'Click the map to drop a pin, drag a pin to move it, Alt-click a pin to delete it. A sixth pin replaces your oldest.',
      why: '`edit.geo.create()` mints a row at the clicked coordinate, `edit.geo.move()` adjusts it, and `count({ max: 5 })` caps the answer at five. `remove` gated by `when.alt` keeps deleting off the plain drag.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'remove()', 'count()', 'when.alt'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: [],
  schema: {
    lon: { type: "quantitative", domain: [-125, -66] },
    lat: { type: "quantitative", domain: [24, 50] },
  },
  constraints: [ count({ max: 5 }) ],                        //! five airports
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoPoint({
      size: 7, fill: "steelblue", stroke: "white", strokeWidth: 1.5,
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [
        edit.geo.create(),                                    //! click to add
        edit.geo.move({ when: when.noAlt }),
        remove({ when: when.alt }),                           //! Alt-click to delete
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_rule',
  status: 'full',
  verdict: 'Every route out of Seattle as a straight line to its destination airport, over grey airports (read-only `context` rows) and states on Albers USA.',
  needs: [],
  prep: ['prep-geo', 'prep-lookup', 'prep-calculate'],
  gaps: [],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const airports = await vegaData("airports.csv");
const at = new Map(airports.map((d) => [d.iata, [d.longitude, d.latitude]]));
const routes = (await vegaData("flights-airport.csv"))
  .filter((d) => d.origin === "SEA" && at.has(d.destination))
  .map((d) => ({ destination: d.destination, coordinates: [at.get("SEA"), at.get(d.destination)] }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  schema: {
    destination: { type: "categorical" },
    coordinates: { type: "categorical" },
    iata: { type: "categorical" }, lon: { type: "quantitative" }, lat: { type: "quantitative" },
  },
  data: [...airports.map((d) => ({ iata: d.iata, lon: d.longitude, lat: d.latitude })), ...routes],
  context: (d) => d.iata != null,     // the airports: drawn, never elicited
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoPoint({ size: 0.8, fill: "gray", channels: { lon: { field: "lon" }, lat: { field: "lat" } } }),
    geoLine({ stroke: "#4c78a8", strokeWidth: 1, showVertices: false, channels: { coordinates: { field: "coordinates", scale: null } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Seattle\'s top routes',
      question: 'Which five destinations have the most flights from Seattle? Drag each line\'s end to one.',
      try: 'Drag the red dots; each line follows its dot.',
      why: 'Each route is a `series` of two rows, Seattle and a destination. The Seattle rows are `lock`ed, so `edit.geo.move()` only reaches the destinations, and `geoLine` redraws each pair as you drag.',
      uses: ['geoLine', 'edit.geo.move()', 'lock', 'series'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const sea = [-122.31, 47.45];
const rows = [1, 2, 3, 4, 5].flatMap((route, i) => [
  { route, end: "SEA", lon: sea[0], lat: sea[1] },
  { route, end: "dest", lon: -110 + i * 6, lat: 34 },
]);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: rows,
  schema: {
    route: { type: "categorical" },
    end:   { type: "categorical", domain: ["SEA", "dest"] },
    lon:   { type: "quantitative", domain: [-125, -66] },
    lat:   { type: "quantitative", domain: [24, 50] },
  },
  lock: (d) => d.end === "SEA",                               //! Seattle stays put
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoLine({
      stroke: "#4c78a8", strokeWidth: 1.5,
      channels: { lon: { field: "lon" }, lat: { field: "lat" }, series: { field: "route" } }, //! one line per route
    }),
    geoPoint({
      size: 6, stroke: "white", strokeWidth: 1.5,
      channels: {
        lon: { field: "lon" }, lat: { field: "lat" },
        fill: { field: "end", scale: { range: ["#1e293b", "#e45755"] } },
      },
      edits: [ edit.geo.move() ],                             //! drag a destination
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_text',
  status: 'full',
  verdict: 'US state capitals as orange dots with their names above, over grey states on Albers USA.',
  needs: [],
  prep: ['prep-geo'],
  gaps: ['Labels collide in the north-east, as they do in the original.'],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const capitals = await vegaData("us-state-capitals.json");

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: capitals,
  schema: {
    lon: { type: "quantitative" }, lat: { type: "quantitative" },
    state: { type: "categorical" }, city: { type: "categorical" },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoPoint({ size: 3, fill: "orange", channels: { lon: { field: "lon" }, lat: { field: "lat" } } }),
    geoText({ fontSize: 8, dy: -7, channels: { lon: { field: "lon" }, lat: { field: "lat" }, text: { field: "city" } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Find the capitals',
      question: 'Each pin starts at the middle of its state. Where is the state capital?',
      try: 'Drag each orange pin to where you think the capital is.',
      why: 'Each row is one capital with a seeded location from `d3.geoCentroid` of its state. `edit.geo.move()` writes `lon`/`lat`, and the names are a `geoText` over the same rows.',
      uses: ['edit.geo.move()', 'geoPoint', 'geoText'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
// FIPS ids of six states whose capital is not their largest city.
const ask = { 6: "California", 12: "Florida", 17: "Illinois", 36: "New York", 42: "Pennsylvania", 48: "Texas" };
const rows = states.features.filter((f) => ask[f.id]).map((f) => {
  const [lon, lat] = d3.geoCentroid(f);
  return { state: ask[f.id], lon, lat };
});

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: rows,
  schema: {
    state: { type: "categorical" },
    lon:   { type: "quantitative", domain: [-125, -66] },
    lat:   { type: "quantitative", domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: states, fill: "lightgray", stroke: "white" }),
    geoPoint({
      size: 6, fill: "orange", stroke: "#7c2d12", strokeWidth: 1,
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [ edit.geo.move() ],                             //! drag to the capital
    }),
    geoText({ fontSize: 10, dy: -10, channels: { lon: { field: "lon" }, lat: { field: "lat" }, text: { field: "state" } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_line',
  status: 'full',
  verdict: 'An eight-airport itinerary from Seattle to New York as one line through the airports in order, over grey airports (read-only `context` rows) and states.',
  needs: [],
  prep: ['prep-geo', 'prep-lookup'],
  gaps: [],
  recreation: {
    code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);
const airports = await vegaData("airports.csv");
const at = new Map(airports.map((d) => [d.iata, d]));
const trip = ["SEA", "SFO", "LAX", "LAS", "DFW", "DEN", "ORD", "JFK"]
  .map((airport, i) => ({ airport, order: i + 1, lon: at.get(airport).longitude, lat: at.get(airport).latitude }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  schema: {
    airport: { type: "categorical" },
    order: { type: "quantitative" },
    lon: { type: "quantitative" }, lat: { type: "quantitative" },
    // The airports keep the file's own column names, so the itinerary line skips them.
    iata: { type: "categorical" }, longitude: { type: "quantitative" }, latitude: { type: "quantitative" },
  },
  data: [...airports.map(({ iata, longitude, latitude }) => ({ iata, longitude, latitude })), ...trip],
  context: (d) => d.iata != null,     // the airports: drawn, never elicited
  marks: [
    geoBasemap({ geojson: states, fill: "#eee", stroke: "white" }),
    geoPoint({ size: 0.8, fill: "gray", channels: { lon: { field: "longitude" }, lat: { field: "latitude" } } }),
    geoLine({
      stroke: "#4c78a8", strokeWidth: 2,
      channels: { lon: { field: "lon" }, lat: { field: "lat" }, order: { field: "order" } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the flight',
      question: 'A nonstop flight leaves Seattle for New York. Draw the path you think it flies.',
      try: 'Press near Seattle and drag across the map to New York.',
      why: '`edit.geo.draw()` turns a freehand drag into one row holding a list of `[lon, lat]` vertices, inverted through the projection — so the answer is a route on the globe, not a pixel scribble. The two airports are `context` rows, drawn but never reported.',
      uses: ['edit.geo.draw()', 'geoLine', 'context'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  schema: {
    coordinates: { type: "categorical" },
    name: { type: "categorical" }, lon: { type: "quantitative" }, lat: { type: "quantitative" },
  },
  data: [{ name: "SEA", lon: -122.31, lat: 47.45 }, { name: "JFK", lon: -73.78, lat: 40.64 }],
  context: true,                                              //! the two airports, never reported
  marks: [
    geoBasemap({ geojson: states, fill: "#eee", stroke: "white" }),
    geoPoint({ size: 5, fill: "#1e293b", channels: { lon: { field: "lon" }, lat: { field: "lat" } } }),
    geoText({ fontSize: 11, fill: "#1e293b", dy: -9,
              channels: { lon: { field: "lon" }, lat: { field: "lat" }, text: { field: "name" } } }),
    geoLine({
      stroke: "#e45755", strokeWidth: 2.5, showVertices: false,
      channels: { coordinates: { field: "coordinates", scale: null } },
      edits: [ edit.geo.draw() ],                             //! drag to draw a route
    }),
  ],
}));`,
    },
    {
      title: 'Plan the stops',
      question: 'You fly Seattle to New York with three refuelling stops. Where would you put them?',
      try: 'Drag the three middle stops; the route follows.',
      why: '`geoLine` with `lon`/`lat` and an `order` channel joins the rows in stop order. The two end airports are `lock`ed, so `edit.geo.move()` reaches only the stops you choose.',
      uses: ['geoLine', 'edit.geo.move()', 'lock', 'order'],
      code: `const us = await vegaData("us-10m.json");
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "albers-usa", domain: states },
  data: [
    { stop: 0, lon: -122.31, lat: 47.45, fixed: true },
    { stop: 1, lon: -110, lat: 44, fixed: false },
    { stop: 2, lon: -98, lat: 42, fixed: false },
    { stop: 3, lon: -86, lat: 41, fixed: false },
    { stop: 4, lon: -73.78, lat: 40.64, fixed: true },
  ],
  schema: {
    stop:  { type: "quantitative" },
    fixed: { type: "categorical", domain: [true, false] },
    lon:   { type: "quantitative", domain: [-125, -66] },
    lat:   { type: "quantitative", domain: [24, 50] },
  },
  lock: (d) => d.fixed,                                       //! Seattle and New York are given
  marks: [
    geoBasemap({ geojson: states, fill: "#eee", stroke: "white" }),
    geoLine({ stroke: "#4c78a8", strokeWidth: 2,
              channels: { lon: { field: "lon" }, lat: { field: "lat" }, order: { field: "stop" } } }), //! joined in stop order
    geoPoint({
      size: 6, fill: "#4c78a8", stroke: "white", strokeWidth: 1.5,
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [ edit.geo.move() ],                             //! drag a stop
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_layer_line_london',
  status: 'full',
  verdict: 'London\'s boroughs as a light basemap with their short names, and the tube network drawn line by line in each line\'s official colour, with a colour legend.',
  needs: [],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [],
  recreation: {
    code: `const boroughs = await vegaData("londonBoroughs.json");
const centroids = await vegaData("londonCentroids.json");
const tube = await vegaData("londonTubeLines.json");
const lines = ["Bakerloo", "Central", "Circle", "District", "DLR", "Hammersmith & City", "Jubilee",
  "Metropolitan", "Northern", "Piccadilly", "Victoria", "Waterloo & City"];
const colours = ["rgb(137,78,36)", "rgb(220,36,30)", "rgb(255,206,0)", "rgb(1,114,41)", "rgb(0,175,173)",
  "rgb(215,153,175)", "rgb(106,114,120)", "rgb(114,17,84)", "rgb(0,0,0)", "rgb(0,24,168)", "rgb(0,160,226)", "rgb(106,187,170)"];
const london = topojson.feature(boroughs, boroughs.objects.boroughs);
const segments = topojson.feature(tube, tube.objects.line).features
  .map((f) => ({ line: f.id, coordinates: f.geometry.coordinates }));

mount(Elicit({
  width: 480, height: 360,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "mercator", domain: london },
  schema: {
    line: { type: "categorical", domain: lines },
    coordinates: { type: "categorical" },
    name: { type: "categorical" }, cx: { type: "quantitative" }, cy: { type: "quantitative" },
  },
  data: [...centroids.map((d) => ({ ...d, name: d.name.split(" ")[0] })), ...segments],
  // The borough labels: the original's second dataset, drawn and never elicited.
  context: (d) => d.name != null,
  marks: [
    geoBasemap({ geojson: london, fill: "#eee", stroke: "white", strokeWidth: 2 }),
    geoText({ fontSize: 7, fill: "#000", opacity: 0.6,
              channels: { lon: { field: "cx" }, lat: { field: "cy" }, text: { field: "name" } } }),
    geoLine({
      strokeWidth: 2, showVertices: false,
      channels: {
        coordinates: { field: "coordinates", scale: null },
        stroke: { field: "line", scale: { range: colours }, legend: { title: false, fontSize: 9 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw a new line',
      question: 'London gets one new tube line. Where should it run?',
      try: 'Drag across the map to draw your line.',
      why: '`edit.geo.draw()` turns the drag into a row of `[lon, lat]` vertices through the projection. The existing network is chrome under it, a `geoBasemap` of the tube\'s line strings.',
      uses: ['edit.geo.draw()', 'geoBasemap'],
      code: `const boroughs = await vegaData("londonBoroughs.json");
const tube = await vegaData("londonTubeLines.json");
const london = topojson.feature(boroughs, boroughs.objects.boroughs);

mount(Elicit({
  width: 480, height: 360,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "mercator", domain: london },
  data: [],
  schema: { coordinates: { type: "categorical" } },
  marks: [
    geoBasemap({ geojson: london, fill: "#eee", stroke: "white", strokeWidth: 2 }),
    geoBasemap({ geojson: topojson.feature(tube, tube.objects.line), fill: "none", stroke: "#94a3b8", strokeWidth: 1.5 }),
    geoLine({
      stroke: "#7c3aed", strokeWidth: 3,
      channels: { coordinates: { field: "coordinates", scale: null } },
      edits: [ edit.geo.draw() ],                             //! drag to draw your line
    }),
  ],
}));`,
    },
    {
      title: 'Where is central?',
      question: 'Draw the box you would call "central London".',
      try: 'Drag an edge or corner to reshape the box, or its middle to move it.',
      why: 'The region is a `geoRect` over four fields; `edit.geo.brush` decides from where you grab whether to move an edge, a corner or the whole box, and writes degrees of longitude and latitude.',
      uses: ['geoRect', 'edit.geo.brush()'],
      code: `const boroughs = await vegaData("londonBoroughs.json");
const tube = await vegaData("londonTubeLines.json");
const london = topojson.feature(boroughs, boroughs.objects.boroughs);

mount(Elicit({
  width: 480, height: 360,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "mercator", domain: london },
  data: [{ west: -0.2, south: 51.48, east: -0.05, north: 51.54 }],
  schema: {
    west:  { type: "quantitative", domain: [-0.52, 0.34] },
    south: { type: "quantitative", domain: [51.28, 51.7] },
    east:  { type: "quantitative", domain: [-0.52, 0.34] },
    north: { type: "quantitative", domain: [51.28, 51.7] },
  },
  marks: [
    geoBasemap({ geojson: london, fill: "#eee", stroke: "white", strokeWidth: 2 }),
    geoBasemap({ geojson: topojson.feature(tube, tube.objects.line), fill: "none", stroke: "#94a3b8", strokeWidth: 1.5 }),
    geoRect({
      fill: "rgba(220, 36, 30, 0.15)", stroke: "rgb(220,36,30)", strokeWidth: 2,
      channels: {
        west: { field: "west" }, south: { field: "south" },
        east: { field: "east" }, north: { field: "north" },
      },
      edits: [ edit.geo.brush({ edgeInset: 10 }) ],           //! reshape or move
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_params_projections',
  status: 'partial',
  verdict: 'The world map draws in any of ElicitJS\'s named projections, but the example is about switching projection from a dropdown bound to a parameter, which ElicitJS has no bound inputs for; this shows the default Equal Earth.',
  needs: ['input-widgets', 'projection'],
  prep: ['prep-geo'],
  gaps: [
    'No projection dropdown: changing `projection.type` means rebuilding the chart.',
    'Natural Earth is not among the named projections (a live `d3.geoNaturalEarth1()` instance can be passed instead).',
  ],
  recreation: {
    code: `const world = await vegaData("world-110m.json");
const countries = topojson.feature(world, world.objects.countries);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  // Try "mercator", "orthographic", "conic-equal-area", "equirectangular", …
  projection: { type: "equal-earth", domain: { type: "Sphere" } },
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: countries, fill: "lightgray", stroke: "gray", strokeWidth: 0.5 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Big countries',
      question: 'Which countries do you think have more than 100 million people?',
      try: 'Click a country to mark it; click again to clear it.',
      why: 'Each country is a row with a yes/no `pick`; `cycle()` on `fill` flips it. On an equal-area projection the reader is not misled by Greenland\'s size the way Mercator would mislead them.',
      uses: ['geoPolygon', 'cycle()'],
      code: `const world = await vegaData("world-110m.json");
const countries = topojson.feature(world, world.objects.countries);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "equal-earth", domain: { type: "Sphere" } }, //! equal-area, so size is fair
  data: countries.features.map((f) => ({ id: f.id, pick: "no", geometry: f.geometry })),
  schema: {
    id:       { type: "categorical" },
    pick:     { type: "categorical", domain: ["no", "yes"] },
    geometry: { type: "categorical" },
  },
  marks: [
    geoPolygon({
      stroke: "gray", strokeWidth: 0.5,
      channels: {
        geometry: { field: "geometry", scale: null },
        fill: { field: "pick", scale: { range: ["#e5e7eb", "#4c78a8"] }, edit: cycle() }, //! click to toggle
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-interactive_geo_earthquakes',
  status: 'partial',
  verdict: 'An orthographic globe with an ocean sphere, countries and earthquakes sized by magnitude; the rotation and size sliders that are the point of the example have no ElicitJS equivalent, so the globe is fixed at the initial rotation.',
  needs: ['input-widgets'],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [
    'No rotation or size sliders; the globe is drawn at rotation [0, 0].',
    'Far-side quakes are filtered in JavaScript, as the original does with its filter transform.',
  ],
  recreation: {
    code: `const world = await vegaData("world-110m.json");
const quakes = (await vegaData("earthquakes.json")).features
  .map((f) => ({ lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], mag: f.properties.mag }))
  .filter((d) => d.lon > -90 && d.lon < 90);

mount(Elicit({
  width: 320, height: 320,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "orthographic", domain: { type: "Sphere" } },
  data: quakes,
  schema: {
    lon: { type: "quantitative" }, lat: { type: "quantitative" },
    mag: { type: "quantitative", domain: [0, 8] },
  },
  marks: [
    geoBasemap({ geojson: { type: "Sphere" }, fill: "aliceblue", stroke: "none" }),
    geoBasemap({ geojson: topojson.feature(world, world.objects.countries), fill: "mintcream", stroke: "black", strokeWidth: 0.5 }),
    geoPoint({
      fill: "red", opacity: 0.25,
      channels: {
        lon: { field: "lon" }, lat: { field: "lat" },
        size: { field: "mag", scale: { type: "sqrt", range: [0, 7] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Next big quakes',
      question: 'Where will the next three earthquakes of magnitude 6 or more strike?',
      try: 'Click the globe to drop a pin; drag a pin to move it. A fourth pin replaces your oldest.',
      why: '`edit.geo.create()` inverts the click through the orthographic projection to a longitude and latitude, `edit.geo.move()` adjusts it, and `count({ max: 3 })` caps the answer.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'count()'],
      code: `const world = await vegaData("world-110m.json");

mount(Elicit({
  width: 320, height: 320,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: "orthographic", domain: { type: "Sphere" }, rotate: [-150, -10] },
  data: [],
  schema: {
    lon: { type: "quantitative", domain: [-180, 180] },
    lat: { type: "quantitative", domain: [-90, 90] },
  },
  constraints: [ count({ max: 3 }) ],                         //! three quakes
  marks: [
    geoBasemap({ geojson: { type: "Sphere" }, fill: "aliceblue", stroke: "none" }),
    geoBasemap({ geojson: topojson.feature(world, world.objects.countries), fill: "mintcream", stroke: "black", strokeWidth: 0.5 }),
    geoPoint({
      size: 8, fill: "red", fillOpacity: 0.6, stroke: "#7f1d1d",
      channels: { lon: { field: "lon" }, lat: { field: "lat" } },
      edits: [ edit.geo.create(), edit.geo.move() ],          //! click to add, drag to move
    }),
  ],
}));`,
    },
  ],
});

// ------------------------------------------------------------------ Faceting

GALLERY.add({
  id: 'vl-trellis_bar',
  status: 'none',
  verdict: 'Two bar charts of the 2000 US population by age, one row per gender sharing the x scale. Faceting is not covered by this study, so the small-multiple layout is out of scope.',
  needs: ['facet'],
  prep: ['prep-aggregate'],
  gaps: ['A grouped or stacked bar in one panel would be a different chart; the example is the small-multiple layout.'],
  alternative: 'One panel of `barY` bars for a single gender, with `move()` on `y`: "How many people of each age group lived in the US in 2000?"',
});

GALLERY.add({
  id: 'vl-trellis_stacked_bar',
  status: 'none',
  verdict: 'Stacked horizontal bars of barley yield by variety and site, faceted into one column per year: the stacked bar is drawable, but faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-aggregate'],
  gaps: ['One year\'s panel alone is a stacked `barX`; the comparison across years is the faceting.'],
  alternative: 'One year as a stacked `barX`, with `edit.stack.edge()` asking how each variety\'s total yield divides among the six sites.',
});

GALLERY.add({
  id: 'vl-trellis_scatter',
  status: 'none',
  verdict: 'A scatter of worldwide gross against DVD sales wrapped into one panel per MPAA rating. Each panel is a plain scatter; faceting is not covered by this study.',
  needs: ['facet'],
  prep: [],
  gaps: [],
  alternative: 'One rating\'s scatter with an `edit.trend` line: "How strongly do DVD sales follow box-office gross for PG-13 films?"',
});

GALLERY.add({
  id: 'vl-trellis_bar_histogram',
  status: 'none',
  verdict: 'Horsepower histograms of cars stacked in one row per origin: a single histogram is easy, but the three aligned rows are a facet, and faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-bin'],
  gaps: [],
  alternative: '`widgets.histogram` for one origin: "Sketch the distribution of horsepower among Japanese cars."',
});

GALLERY.add({
  id: 'vl-trellis_anscombe',
  status: 'none',
  verdict: 'Anscombe\'s quartet as four scatter plots side by side, one column per series: the four-panel comparison is the point, and faceting is not covered by this study.',
  needs: ['facet'],
  prep: [],
  gaps: [],
  alternative: 'One series as a `point` scatter with `move()` on both axes: "Rearrange these eleven points so the correlation stays 0.82 but the shape changes."',
});

GALLERY.add({
  id: 'vl-trellis_barley',
  status: 'none',
  verdict: 'Becker\'s barley trellis: median yield per variety as dots coloured by year, in one wrapped panel per site sorted by median — a facet with per-panel sorting. Faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-aggregate'],
  gaps: [],
  alternative: 'One site\'s dot plot with a `point` per variety and year and `move()` on `x`: "What yield did each variety give at Morris in 1932?"',
});

GALLERY.add({
  id: 'vl-trellis_area',
  status: 'none',
  verdict: 'Four stock-price area charts stacked in rows that share the time axis: an area per symbol is drawable, but the row layout is a facet, and faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [],
  alternative: 'One symbol\'s `areaY` with `edit.line.draw()` on the months after the data ends: "Draw where AAPL goes next."',
});

GALLERY.add({
  id: 'vl-trellis_area_seattle',
  status: 'none',
  verdict: 'Seattle\'s hourly temperature normals as 24 thin area charts, one row per hour of the day: a row facet with custom header labels. Faceting is not covered by this study.',
  needs: ['facet', 'axis-custom'],
  prep: ['prep-aggregate'],
  gaps: [],
  alternative: 'One hour\'s seasonal curve with `edit.line.sweep()`: "Sketch the average temperature at noon through the year."',
});

GALLERY.add({
  id: 'vl-area_density_facet',
  status: 'none',
  verdict: 'Body-mass density curves for three penguin species, one row each on a shared x axis: the density areas are drawable after a JS density estimate, but the stacked rows are a facet, and faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-density'],
  gaps: [],
  alternative: 'One species\' density as `areaY` with `move()` on its points: "Sketch how body mass is distributed among Gentoo penguins."',
});

GALLERY.add({
  id: 'vl-facet_grid_bar',
  status: 'none',
  verdict: 'A 3×3 grid of tiny bar charts crossing two factors, with a colour legend for a third: a row-and-column facet. Faceting is not covered by this study.',
  needs: ['facet'],
  prep: [],
  gaps: [],
  alternative: 'One cell of the grid as three `barX` bars under `maintainSum({ total: 1 })`: "How is performance split across the three settings?"',
});

// ------------------------------------------------------------------ Repeat & Concatenation

GALLERY.add({
  id: 'vl-vconcat_weather',
  status: 'none',
  verdict: 'Two different charts stacked vertically — monthly mean precipitation bars and a binned temperature bubble plot — from one dataset. Multiple views are not covered by this study.',
  needs: ['concat'],
  prep: ['prep-aggregate', 'prep-bin'],
  gaps: ['Each panel alone is drawable (see `vl-layer_precipitation_mean` for the first).'],
  alternative: 'The precipitation panel alone, with `move()` on each month\'s bar.',
});

GALLERY.add({
  id: 'vl-repeat_histogram',
  status: 'none',
  verdict: 'The same stacked histogram repeated for four car measures in a 2×2 grid: a `repeat` layout, and multiple views are not covered by this study.',
  needs: ['concat'],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: [],
  alternative: 'One measure\'s histogram as `rectY` bins with `move()` on the counts: "How are horsepower values distributed?"',
});

GALLERY.add({
  id: 'vl-interactive_splom',
  status: 'none',
  verdict: 'A 3×3 scatterplot matrix with a shared brush that recolours every panel and pan/zoom bound to the scales. Multiple views, and the selections and domains linked across them, are not covered by this study; a single panel can zoom and pan with `edit.axis.zoom()` and `edit.axis.pan()`.',
  needs: ['concat', 'selection', 'zoom'],
  prep: [],
  gaps: [],
  alternative: 'A single scatter of horsepower against fuel economy with `brushRect`: "Draw a box around the cars you would call efficient and powerful."',
});

GALLERY.add({
  id: 'vl-concat_marginal_histograms',
  status: 'none',
  verdict: 'A 2-D binned heatmap of IMDB against Rotten Tomatoes ratings with marginal histograms on top and right: three aligned views, and multiple views are not covered by this study.',
  needs: ['concat'],
  prep: ['prep-bin'],
  gaps: ['The centre heatmap alone is a `rect` grid with a colour scale.'],
  alternative: 'The heatmap alone, its cells as `rect` marks: "Which combination of critic and audience rating is most common?" with `select()` on a cell.',
});

GALLERY.add({
  id: 'vl-concat_bar_scales_discretize',
  status: 'none',
  verdict: 'Three side-by-side columns of circles showing quantize, quantile and threshold scales with their legends. Multiple views are not covered by this study, and ElicitJS has no discretizing scale types.',
  needs: ['concat', 'scale-discretize'],
  prep: [],
  gaps: [],
  alternative: 'None worth building: the example demonstrates scale types rather than a question about data.',
});

GALLERY.add({
  id: 'vl-nested_concat_align',
  status: 'none',
  verdict: 'Two rows of repeated histograms (ratings, then gross) nested inside a vertical concatenation and aligned by axis extent. Multiple views are not covered by this study.',
  needs: ['concat'],
  prep: ['prep-bin'],
  gaps: [],
  alternative: 'One of the four histograms with `move()` on its bins.',
});

GALLERY.add({
  id: 'vl-concat_population_pyramid',
  status: 'partial',
  verdict: 'The pyramid itself fits one panel: female population as bars running left from a shared centre and male running right, by age group. The original builds it from three concatenated views; multiple views are not covered by this study, so the recreation flattens them into one.',
  needs: ['concat', 'axis-custom'],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: [
    'One diverging panel instead of two mirrored panels with the age labels between them; ages sit on the left axis.',
    'Female values are stored negative to run left; the axis labels show their absolute value.',
  ],
  recreation: {
    code: `const pop = (await vegaData("population.json")).filter((d) => d.year === 2000);
const ages = [...new Set(pop.map((d) => d.age))].sort((a, b) => a - b);
const rows = ages.flatMap((age) => ["Female", "Male"].map((gender) => {
  const people = d3.sum(pop.filter((d) => d.age === age && (d.sex === 2) === (gender === "Female")), (d) => d.people);
  return { age, gender, people: gender === "Female" ? -people : people };
}));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 12, bottom: 38, left: 30 },
  data: rows,
  schema: {
    age:    { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    people: { type: "quantitative", domain: [-12e6, 12e6] },
  },
  axes: { x: { tickFormat: (v) => d3.format("~s")(Math.abs(v)), title: "population" } },
  marks: [
    barX({
      channels: {
        y: { field: "age" }, x: { field: "people" },
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Build the pyramid',
      question: 'What will the US population pyramid look like in 2050? Shape both sides.',
      try: 'Drag the end of any bar outward or inward.',
      why: 'Female bars hold negative values, so one `barX` with `move()` on `x` handles both sides: dragging left grows a female bar and dragging right grows a male one. A `constraints.custom` repair keeps each side on its own side of zero.',
      uses: ['barX', 'move()', 'constraints.custom()'],
      code: `const ages = d3.range(0, 95, 10);
const rows = ages.flatMap((age) => [
  { age, gender: "Female", people: -20 },
  { age, gender: "Male", people: 20 },
]);

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 10, right: 12, bottom: 28, left: 30 },
  data: rows,
  schema: {
    age:    { type: "ordinal", domain: ages },
    gender: { type: "categorical", domain: ["Female", "Male"] },
    people: { type: "quantitative", domain: [-30, 30] },
  },
  constraints: [
    // Each side stays on its own side of zero.
    constraints.custom(({ data }) => data.map((d) => ({ ...d,     //! women left, men right
      people: d.gender === "Female" ? Math.min(0, d.people) : Math.max(0, d.people) }))),
  ],
  axes: { x: { tickFormat: (v) => Math.abs(v) + "M" } },
  marks: [
    barX({
      channels: {
        y: { field: "age" },
        x: { field: "people", edit: move() },                 //! drag either side
        fill: { field: "gender", scale: { range: ["#675193", "#ca8861"] } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-geo_repeat',
  status: 'none',
  verdict: 'Three choropleths of US states — population, engineers and hurricanes — repeated in rows with independent colour scales: each map alone is a `geoPolygon` choropleth, but multiple views are not covered by this study.',
  needs: ['concat'],
  prep: ['prep-geo', 'prep-lookup'],
  gaps: [],
  alternative: 'One of the three maps with `cycle()` on a guess field: "Which states get the most hurricanes?" (see the interfaces on `vl-geo_choropleth`).',
});

GALLERY.add({
  id: 'vl-geo_trellis',
  status: 'none',
  verdict: 'State choropleths of the share of income per bracket, one map per income group in rows: a facet over a geoshape, and faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-geo', 'prep-lookup'],
  gaps: [],
  alternative: 'One income group\'s map with `cycle()` on each state: "Where is the share of households earning over $200k highest?"',
});

GALLERY.add({
  id: 'vl-interactive_geo_facet_species',
  status: 'none',
  verdict: 'County-level habitat maps for four species in a 2×2 grid with a viridis scale and tooltips: a wrapped facet over 3,000-county choropleths. One map is a `geoPolygon` with `scale: { scheme: "viridis" }` and `tip: true`; faceting is not covered by this study.',
  needs: ['facet'],
  prep: ['prep-geo', 'prep-lookup'],
  gaps: [],
  alternative: 'One species\' county map with `edit.geo.brush` on a `geoRect`: "Draw a box around where you think the American bullfrog finds suitable habitat."',
});
