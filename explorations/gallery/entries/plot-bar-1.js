// Observable Plot gallery — "Bar, Cell, Rect", first half. See AUTHORING.md.

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-horizontal-bar-chart',
  status: 'full',
  verdict: 'A `barX` over a letter band whose schema domain is sorted by frequency, with a top percent axis and a zero rule.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot sorts the band by the bar length (`sort: {y: "x"}`); here the sort is computed in JS and written as the schema `domain` of `letter`.',
    'Plot scales the axis to percent (`percent: true`); here the tick format does it.',
  ],
  recreation: {
    code: `const alphabet = (await plotData("alphabet"))
  .map(({ letter, frequency }) => ({ letter, frequency }));
const order = alphabet.slice()
  .sort((a, b) => b.frequency - a.frequency).map((d) => d.letter);

mount(Elicit({
  width: 460, height: 500,
  margins: { top: 44, right: 20, bottom: 8, left: 26 },
  data: alphabet,
  scales: { y: { reverse: true } },   // first category at the top
  schema: {
    letter:    { type: "categorical", domain: order },
    frequency: { type: "quantitative", domain: [0, 0.13] },
  },
  axes: {
    x: { anchor: "top", grid: true, title: "frequency (%) →",
         tickFormat: (d) => Math.round(d * 100) },
    y: {},
  },
  marks: [
    barX({ fill: "#1f2937", channels: {
      y: { field: "letter" },
      x: { field: "frequency" },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Rank, then size',
      question: 'Order the five vowels from most to least frequent in English text, then drag each bar to how often you think it appears.',
      try: 'Grab a bar anywhere. Drag up or down to move it to another rank, left or right to set its frequency.',
      why: 'The same `barX` as the recreation, but its band axis is a `rank` column, so `rank()` on `y` inserts the bar where you drop it and shifts the bars in between. A relative `move()` on `x` reads the other component of the same drag, so one gesture ranks and sizes a bar without the two edits fighting, and pressing mid-bar does not make it jump.',
      uses: ['rank()', 'move({ mode: "relative" })', 'clamp()'],
      code: `const vowels = ["A", "E", "I", "O", "U"];
mount(Elicit({
  width: 440, height: 260,
  margins: { top: 44, right: 24, bottom: 8, left: 40 },
  scales: { y: { reverse: true } },   // rank 1 at the top
  data: vowels.map((letter, i) => ({ letter, rank: i + 1, frequency: 0.05 })),
  schema: {
    letter:    { type: "categorical", domain: vowels },
    rank:      { type: "ordinal", domain: [1, 2, 3, 4, 5] },
    frequency: { type: "quantitative", domain: [0, 0.15] },
  },
  axes: {
    x: { anchor: "top", grid: true, title: "frequency (%) →",
         tickFormat: (d) => Math.round(d * 100) },
    y: false,
  },
  constraints: [clamp({ field: "frequency", min: 0.001, max: 0.15 })],
  marks: [
    barX({ fill: "#1f2937", channels: {
      y: { field: "rank", edit: rank() },          //! drop on another band to re-rank
      x: { field: "frequency", edit: move({ mode: "relative" }) },   //! drag along the bar to size it
    } }),
    text({ textAnchor: "end", dx: -10, fontSize: 14, channels: {
      x: { datum: 0 }, y: { field: "rank" }, text: { field: "letter" },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-vertical-bar-chart',
  status: 'full',
  verdict: 'A `barY` over a letter band sorted by frequency (computed into the schema domain), percent ticks, grid and a zero rule.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The sort by bar height is computed in JS and declared as the band domain.',
  ],
  recreation: {
    code: `const alphabet = (await plotData("alphabet"))
  .map(({ letter, frequency }) => ({ letter, frequency }));
const order = alphabet.slice()
  .sort((a, b) => b.frequency - a.frequency).map((d) => d.letter);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 20, right: 12, bottom: 40, left: 46 },
  data: alphabet,
  schema: {
    letter:    { type: "categorical", domain: order },
    frequency: { type: "quantitative", domain: [0, 0.13] },
  },
  axes: {
    x: { title: "letter" },
    y: { grid: true, title: "frequency (%) →", tickFormat: (d) => Math.round(d * 100) },
  },
  marks: [
    barY({ fill: "#1f2937", channels: {
      x: { field: "letter" },
      y: { field: "frequency" },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Share out 100 letters',
      question: 'Out of every 100 letters in English text, how many are each vowel, and how many are consonants?',
      try: 'Drag bars up or down. The counter shows how many of the 100 letters are still unassigned.',
      why: '`maintainSum({ strategy: "cap" })` lets the bars add up to at most 100, so a bar stops growing once the budget is spent. `guides.remaining()` reads the same total off the constraint and shows what is left.',
      uses: ['move()', 'maintainSum()', 'clamp()', 'guides.remaining()'],
      code: `const cats = ["E", "A", "O", "I", "U", "consonants"];
mount(Elicit({
  width: 440, height: 280,
  margins: { top: 30, right: 12, bottom: 28, left: 46 },
  data: cats.map((letter) => ({ letter, n: 10 })),
  schema: {
    letter: { type: "categorical", domain: cats },
    n:      { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: {}, y: { grid: true, title: "letters out of 100 →" } },
  guides: [guides.remaining({ field: "n", unit: "letter" })],   //! what is left to assign
  constraints: [
    clamp({ field: "n", min: 0 }),
    maintainSum({ field: "n", total: 100, strategy: "cap" }),   //! the 100-letter budget
  ],
  marks: [
    barY({ fill: "#1f2937", channels: {
      x: { field: "letter" },
      y: { field: "n", edit: move() },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-grouped-bar-chart',
  status: 'full',
  verdict: 'A `barY` with the state on x and the age group on `xOffset`, so each state band holds one bar per age group; the state labels are the x axis.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot facets by state (`fx`); here the state is the x band and `xOffset` nests the ages inside it, which draws the same grouped layout.',
    'The state sort (by total population) is computed in JS.',
  ],
  recreation: {
    code: `const rows = await plotData("observablehq__plot-grouped-bar-chart", "population-state-age.csv");
const ages = [...new Set(rows.map((d) => d.key))];
const states = d3.groupSort(rows, (g) => -d3.sum(g, (d) => d.population), (d) => d.state);

mount(Elicit({
  width: 470, height: 320,
  margins: { top: 16, right: 10, bottom: 22, left: 50 },
  data: rows,
  schema: {
    state:      { type: "categorical", domain: states },
    key:        { type: "categorical", domain: ages },
    population: { type: "quantitative", domain: [0, 11e6] },
  },
  axes: { x: { tickSize: 0 }, y: { grid: true, tickFormat: "~s", title: "population →" } },
  marks: [
    barY({ channels: {
      x: { field: "state" },
      xOffset: { field: "key" }, //! one bar per age group inside each state
      y: { field: "population" },
      fill: { field: "key", scale: { scheme: "spectral" },
              legend: { anchor: "right", title: false } },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Estimate against a reference',
      question: 'California’s population by age is shown as bars. How many Texans do you think are in each age group?',
      try: 'Drag each dark tick up or down to your estimate for Texas.',
      why: 'The bars and the ticks read two columns of the same rows, `ca` and `tx`. Both are on `y`, so they share one axis; only the tick carries `move()`, so the reference stays fixed. `snap` rounds each estimate to 100,000 people.',
      uses: ['move()', 'snap()', 'clamp()'],
      code: `const rows = await plotData("observablehq__plot-grouped-bar-chart", "population-state-age.csv");
const ages = [...new Set(rows.map((d) => d.key))];
const ca = new Map(rows.filter((d) => d.state === "CA").map((d) => [d.key, d.population]));
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 44, left: 54 },
  data: ages.map((key) => ({ key, ca: ca.get(key), tx: 2e6 })),
  schema: {
    key: { type: "categorical", domain: ages },
    ca:  { type: "quantitative", domain: [0, 11e6] },
    tx:  { type: "quantitative", domain: [0, 11e6] },
  },
  axes: { x: { tickFormat: (k) => k.replace(" Years", "").replace(" and Over", "+") },
          y: { grid: true, tickFormat: "~s", title: "population →" } },
  constraints: [
    clamp({ field: "tx", min: 0, max: 11e6 }),
    snap({ field: "tx", step: 1e5 }),                     //! estimates in 100k steps
  ],
  marks: [
    barY({ fill: "#cbd5e1", channels: { x: { field: "key" }, y: { field: "ca" } } }),
    tickY({ stroke: "#1f2937", strokeWidth: 3, channels: {
      x: { field: "key" },
      y: { field: "tx", edit: move() },                  //! only the tick is editable
    } }),
    text({ fontSize: 10, fill: "#64748b", dy: -6, lineAnchor: "bottom",
      channels: { x: { datum: ages[4] }, y: { datum: 10.4e6 }, text: { value: "grey: California · black: your Texas" } } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-olympians-grouped-bar-chart',
  status: 'full',
  verdict: 'Athlete counts per sport and sex as a `barY` with the sport on x and the sex on `xOffset`, coloured by sex; the x axis turns the sport labels with `labelAngle`.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: [
    'Plot facets by sport (`fx`); here the sport is the x band and `xOffset` nests the sexes inside it, which draws the same grouped layout.',
    'The count (`groupX({y2: "count"})`) is computed in JS.',
  ],
  recreation: {
    code: `const olympians = await plotData("olympians");
const sports = [...new Set(olympians.map((d) => d.sport))].sort();
const sexes = ["female", "male"];
const counts = d3.rollup(olympians, (v) => v.length, (d) => d.sport, (d) => d.sex);
const data = sports.flatMap((sport) => sexes.map((sex) => ({
  sport, sex, count: (counts.get(sport) || new Map()).get(sex) || 0,
})));

mount(Elicit({
  width: 480, height: 400,
  margins: { top: 40, right: 6, bottom: 10, left: 50 },
  data,
  schema: {
    sport: { type: "categorical", domain: sports },
    sex:   { type: "categorical", domain: sexes },
    count: { type: "quantitative", domain: [0, 1300] },
  },
  // The axis turns its labels (math degrees: -90 reads top to bottom) and
  // reserves the room they need below the plot.
  axes: { x: { labelAngle: -90, tickSize: 0, fontSize: 9 }, y: { grid: true, title: "Frequency →" } },
  marks: [
    barY({ channels: {
      x: { field: "sport", scale: { padding: 0 } },
      xOffset: { field: "sex", scale: { padding: 0.2 } }, //! the sexes side by side in each sport
      y: { field: "count" },
      fill: { field: "sex", scale: { scheme: "observable10" }, legend: { anchor: "top", title: false } },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Fill in the women',
      question: 'The men’s bars show how many male athletes competed in each sport at Rio 2016. How many women do you think competed?',
      try: 'Drag the blue bars up or down. The orange bars are the record.',
      why: '`context: (d) => d.sex === "male"` marks the men as context rows: the same `barY` draws them, but they are read-only and left out of `getData()`, so only your estimates are reported. `xOffset` on `sex` puts each estimate beside its record, and one `fill` encoding on `sex` gives one scale and one legend.',
      uses: ['context', 'move()', 'clamp()', 'xOffset'],
      code: `const olympians = await plotData("olympians");
const sports = ["aquatics", "athletics", "cycling", "football", "gymnastics", "rowing"];
const men = d3.rollup(olympians.filter((d) => d.sex === "male"), (v) => v.length, (d) => d.sport);
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 40, right: 8, bottom: 40, left: 50 },
  schema: {
    sport: { type: "categorical", domain: sports },
    sex:   { type: "categorical", domain: ["female", "male"] },
    count: { type: "quantitative", domain: [0, 1400] },
  },
  data: [
    ...sports.map((sport) => ({ sport, sex: "male", count: men.get(sport) || 0 })),
    ...sports.map((sport) => ({ sport, sex: "female", count: 100 })),
  ],
  context: (d) => d.sex === "male",                       //! the men are given, not elicited
  constraints: [clamp({ field: "count", min: 0, max: 1400 })],
  axes: { x: { tickSize: 0 }, y: { grid: true, title: "athletes →" } },
  marks: [
    barY({ channels: {
      x: { field: "sport" },
      xOffset: { field: "sex", scale: { padding: 0.05 } }, //! your estimate beside the record
      y: { field: "count", edit: move() },                //! your estimates; the men stay put
      fill: { field: "sex", scale: { scheme: "observable10" }, legend: { anchor: "top", title: false } },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-state-population-change',
  status: 'full',
  verdict: 'A diverging `barX` sorted by change, coloured by sign, with state names at zero on the side away from the bar and signed percent labels at the bar end.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot draws the state names as two `axisY` marks anchored at x = 0; here they are a `text` mark at `{ datum: 0 }` whose anchor flips with the sign.',
    'The sort and the change column are computed in JS, as in the original.',
  ],
  recreation: {
    code: `const raw = await plotData("observablehq__plot-state-population-change", "us-state-population-2010-2019.csv");
const data = raw.map((d) => ({ State: d.State, value: (d[2019] - d[2010]) / d[2010] }))
  .map((d) => ({ ...d, growth: d.value > 0 ? "increase" : "decrease" }));
const order = data.slice().sort((a, b) => a.value - b.value).map((d) => d.State);
const pct = d3.format("+.1%");

mount(Elicit({
  width: 470, height: 760,
  margins: { top: 40, right: 50, bottom: 8, left: 50 },
  scales: { y: { reverse: true } },
  data,
  schema: {
    State:  { type: "categorical", domain: order },
    value:  { type: "quantitative", domain: [-0.15, 0.18] },
    growth: { type: "categorical", domain: ["decrease", "increase"] },
  },
  axes: false,
  marks: [
    barX({ channels: {
      y: { field: "State" },
      x: { field: "value" },
      fill: { field: "growth", scale: { range: ["#e9a3c9", "#a1d76a"] } },
    } }),
    gridX({ stroke: "#fff" }),
    axisX({ anchor: "top", tickFormat: (d) => d3.format("+")(Math.round(d * 100)),
            title: "← decrease · Change in population, 2010–2019 (%) · increase →" }),
    // State names at zero, on the side away from the bar.
    text({ fontSize: 9, channels: {
      x: { datum: 0 }, y: { field: "State" }, text: { field: "State" },
      textAnchor: { fn: (d) => (d.value > 0 ? "end" : "start") },
      dx: { fn: (d) => (d.value > 0 ? -4 : 4) },
    } }),
    // Signed percent at the bar end.
    text({ fontSize: 9, channels: {
      x: { field: "value" }, y: { field: "State" },
      text: { fn: (d) => pct(d.value) },
      textAnchor: { fn: (d) => (d.value > 0 ? "start" : "end") },
      dx: { fn: (d) => (d.value > 0 ? 4 : -4) },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Forecast the next decade',
      question: 'By how much will the population of each of these states change between 2020 and 2030?',
      try: 'Press near a state’s row and drag left or right; the closest row is picked for you.',
      why: '`move({ pick: "nearest" })` grabs the row closest to the pointer, so a state seeded at 0% (no bar to grab) is still reachable. The fill is a `{ fn }` over the value, so a bar turns green or pink as you drag it across zero.',
      uses: ['move()', 'clamp()', 'snap()'],
      code: `const states = ["Texas", "Florida", "California", "New York", "Illinois", "West Virginia", "Utah", "Ohio"];
const pct = d3.format("+.1%");
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 40, right: 48, bottom: 8, left: 48 },
  scales: { y: { reverse: true } },
  data: states.map((State) => ({ State, value: 0 })),
  schema: {
    State: { type: "categorical", domain: states },
    value: { type: "quantitative", domain: [-0.15, 0.3] },
  },
  axes: { x: { anchor: "top", tickFormat: (d) => d3.format("+")(Math.round(d * 100)),
               title: "← decrease · change 2020–2030 (%) · increase →" }, y: false },
  constraints: [
    clamp({ field: "value", min: -0.15, max: 0.3 }),
    snap({ field: "value", step: 0.005 }),
  ],
  marks: [
    barX({ channels: {
      y: { field: "State" },
      x: { field: "value",
           edit: move({ pick: "nearest", threshold: 30, guide: true }) },   //! nearest row, with its catchment
      fill: { fn: (d) => (d.value >= 0 ? "#a1d76a" : "#e9a3c9") },          //! colour follows the sign
    } }),
    text({ fontSize: 10, channels: {
      x: { datum: 0 }, y: { field: "State" }, text: { field: "State" },
      textAnchor: { fn: (d) => (d.value >= 0 ? "end" : "start") },
      dx: { fn: (d) => (d.value >= 0 ? -4 : 4) },
    } }),
    text({ fontSize: 10, fill: "#475569", channels: {
      x: { field: "value" }, y: { field: "State" }, text: { fn: (d) => pct(d.value) },
      textAnchor: { fn: (d) => (d.value >= 0 ? "start" : "end") },
      dx: { fn: (d) => (d.value >= 0 ? 4 : -4) },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-diverging-stacked-bar',
  status: 'full',
  verdict: 'Counts per question and response laid out with Plot’s Likert offset in JS, then drawn as `barX` spans (`x1`/`x2`) per question, coloured by an ordinal RdBu scale.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: [
    'The custom diverging stack offset (negatives to the left, neutral centred on zero) is computed in JS; the bar mark only draws the spans.',
    'Plot facets by question (`fy`); here the question is the band axis, which draws the same layout.',
  ],
  recreation: {
    code: `const survey = await plotData("observablehq__plot-diverging-stacked-bar", "survey.json");
const order = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const sign = { "Strongly Disagree": -1, "Disagree": -1, "Neutral": 0, "Agree": 1, "Strongly Agree": 1 };
const questions = [...new Set(survey.map((d) => d.Question))];
const counts = d3.rollup(survey, (v) => v.length, (d) => d.Question, (d) => d.Response);
// Plot's Likert offset: neutral straddles zero, negatives stack leftwards from it.
const data = questions.flatMap((q) => {
  const c = (r) => counts.get(q).get(r) || 0;
  let lo = -c("Neutral") / 2 - c("Disagree") - c("Strongly Disagree");
  return order.map((r) => { const x1 = lo; lo += c(r); return { Question: q, Response: r, x1, x2: lo }; });
});

mount(Elicit({
  width: 470, height: 300,
  margins: { top: 10, right: 16, bottom: 40, left: 32 },
  scales: { y: { reverse: true } },
  data,
  schema: {
    Question: { type: "categorical", domain: questions },
    Response: { type: "ordinal", domain: order },
    x1: { type: "quantitative", domain: [-70, 70] },
    x2: { type: "quantitative", domain: [-70, 70] },
  },
  axes: { x: { tickFormat: (d) => Math.abs(d), title: "# of answers" }, y: { tickSize: 0 } },
  marks: [
    barX({ channels: {
      y: { field: "Question" },
      x1: { field: "x1" }, x2: { field: "x2" },
      fill: { field: "Response", scale: { scheme: "RdBu" }, legend: { anchor: "right", title: false } },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Predict the answers',
      question: 'If 100 new respondents answered Q1 and Q4 again, how would their answers split across the five responses?',
      try: 'Drag the dots on the boundaries between segments. Each bar always holds 100 people.',
      why: 'A stacked bar partitions a total, so `edit.stack.edge()` moves value across one boundary: what one response gains, its neighbour loses, and the 100 is preserved by arithmetic rather than by a constraint.',
      uses: ['edit.stack.edge()', 'bar stack channel'],
      code: `const order = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const data = ["Q1", "Q4"].flatMap((Question) =>
  order.map((Response) => ({ Question, Response, n: 20 })));
mount(Elicit({
  width: 460, height: 220,
  margins: { top: 10, right: 16, bottom: 28, left: 32 },
  scales: { y: { reverse: true } },
  data,
  schema: {
    Question: { type: "categorical", domain: ["Q1", "Q4"] },
    Response: { type: "ordinal", domain: order },
    n:        { type: "quantitative", domain: [0, 100] },
  },
  axes: { x: {}, y: { tickSize: 0 } },
  marks: [
    barX({
      channels: {
        stack: { field: "Response" },  //! one bar = 100 people
        y: { field: "Question" },
        x: { field: "n" },
        fill: { field: "Response", scale: { scheme: "RdBu" }, legend: { anchor: "right", title: false } },
      },
      edits: [edit.stack.edge()],                          //! drag a boundary between two responses
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-stacked-bars',
  status: 'full',
  verdict: 'Penguin counts per island and species, stacked with a `bar` `stack` channel and coloured by species.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: [
    'The count (`groupX({y: "count"})`) is computed in JS; the stack itself is the mark’s.',
  ],
  recreation: {
    code: `const penguins = await plotData("penguins");
const species = ["Adelie", "Chinstrap", "Gentoo"];
const islands = ["Biscoe", "Dream", "Torgersen"];
const counts = d3.rollup(penguins, (v) => v.length, (d) => d.island, (d) => d.species);
const data = species.flatMap((s) => islands.map((island) => ({
  island, species: s, count: (counts.get(island) || new Map()).get(s) || 0,
}))).filter((d) => d.count > 0);

mount(Elicit({
  width: 420, height: 320,
  margins: { top: 40, right: 12, bottom: 40, left: 50 },
  data,
  schema: {
    island:  { type: "categorical", domain: islands },
    species: { type: "categorical", domain: species },
    count:   { type: "quantitative", domain: [0, 170] },
  },
  axes: { x: { title: "island" }, y: { grid: false, title: "Frequency →" } },
  marks: [
    bar({ channels: {
      stack: { field: "species" },
      x: { field: "island" },
      y: { field: "count" },
      fill: { field: "species", scale: { scheme: "observable10" },
              legend: { anchor: "top", title: false } },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Survey a new island',
      question: 'A fourth island is surveyed and 100 penguins are counted. How do you think they split by species?',
      try: 'Click inside the new bar to cut it, drag a boundary dot to move penguins between species, alt-click a boundary to merge two segments.',
      why: 'The new bar starts as one segment. `edit.stack.cut()` splits a segment and hands the new part the next species the bar does not have yet (the domain is closed, so it never invents one); `edge` and `merge` move and fuse, keeping the 100 by arithmetic. `context` marks the three surveyed islands: the same stacked `bar` draws them, read-only and left out of `getData()`.',
      uses: ['edit.stack.cut()', 'edit.stack.edge()', 'edit.stack.merge()', 'context'],
      code: `const penguins = await plotData("penguins");
const species = ["Adelie", "Chinstrap", "Gentoo"];
const islands = ["Biscoe", "Dream", "Torgersen", "new island"];
const counts = d3.rollup(penguins, (v) => v.length, (d) => d.island, (d) => d.species);
const seen = islands.slice(0, 3).flatMap((island) => species.map((s) => ({
  island, species: s, count: (counts.get(island) || new Map()).get(s) || 0,
}))).filter((d) => d.count > 0);
const fields = {
  island:  { type: "categorical", domain: islands },
  species: { type: "categorical", domain: species },       //! closed: a cut picks an unused species
  count:   { type: "quantitative", domain: [0, 170] },
};
const fill = { field: "species", scale: { scheme: "observable10" }, legend: { anchor: "top", title: false } };

mount(Elicit({
  width: 440, height: 320,
  margins: { top: 40, right: 12, bottom: 28, left: 50 },
  schema: fields,
  data: [...seen, { island: "new island", species: "Adelie", count: 100 }],
  context: (d) => d.island !== "new island",              //! the surveyed islands are given
  axes: { x: {}, y: { title: "penguins →" } },
  marks: [
    bar({
      channels: {
        stack: { field: "species" },
        x: { field: "island" },
        y: { field: "count" },
        fill,
      },
      edits: [
        edit.stack.cut(),                                  //! click a segment to split it
        edit.stack.edge(),                                 //! drag a boundary
        edit.stack.merge({ when: when.alt }),              //! alt-click a boundary to fuse
      ],
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-crimean-war-bary',
  status: 'full',
  verdict: 'Monthly deaths by cause, reshaped long, stacked with a `bar` `stack` channel on a month band with one-letter month ticks.',
  needs: [],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'Plot’s `interval: "month"` makes the date a band of months; here each date is formatted to a `YYYY-MM` key and the 24 months are the declared ordinal domain.',
  ],
  recreation: {
    code: `const raw = await plotData("observablehq__plot-crimean-war-bary", "crimean-war.csv");
const causes = ["disease", "wounds", "other"];   // stack order (bottom first)
const month = d3.utcFormat("%Y-%m");
const months = raw.map((d) => month(d.date));
const data = causes.flatMap((cause) =>
  raw.map((d) => ({ month: month(d.date), cause, deaths: d[cause] })));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 24, left: 56 },
  data,
  schema: {
    month:  { type: "ordinal", domain: months },
    cause:  { type: "categorical", domain: causes.slice().sort() },   // colour order
    deaths: { type: "quantitative", domain: [0, 3200] },
  },
  axes: {
    x: { tickSize: 0, tickFormat: (m) => d3.utcFormat("%B")(d3.utcParse("%Y-%m")(m))[0] },
    y: { grid: true, title: "deaths →" },
  },
  marks: [
    bar({ channels: {
      stack: { field: "cause" },
      x: { field: "month" },
      y: { field: "deaths" },
      fill: { field: "cause", scale: { scheme: "observable10" } },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Paint the second year',
      question: 'Sanitary reforms reached the army hospitals in spring 1855. How many soldiers do you think died of disease each month from April 1855 to March 1856?',
      try: 'Press on the right half and sweep the pointer across the months; each bar takes the height of the pointer as you pass over it.',
      why: '`move({ pick: "sweep" })` on the bar re-targets the month under the pointer on every drag event, so one stroke paints a whole year. `context` marks the first year: the same `barY` draws it grey, read-only and left out of `getData()`, so only your year is reported. `snap` rounds to 25 deaths.',
      uses: ['move({ pick: "sweep" })', 'context', 'snap()', 'clamp()'],
      code: `const raw = await plotData("observablehq__plot-crimean-war-bary", "crimean-war.csv");
const month = d3.utcFormat("%Y-%m");
const fields = {
  month:  { type: "ordinal", domain: raw.map((d) => month(d.date)) },
  deaths: { type: "quantitative", domain: [0, 3000] },
};
const given = (d) => d.month < month(raw[12].date);       // the first year

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 24, left: 56 },
  schema: fields,
  data: raw.map((d, i) => ({ month: month(d.date), deaths: i < 12 ? d.disease : 600 })),
  context: given,                                          //! the first year is history
  constraints: [
    clamp({ field: "deaths", min: 0, max: 3000 }),
    snap({ field: "deaths", step: 25 }),
  ],
  axes: {
    x: { tickSize: 0, tickFormat: (m) => d3.utcFormat("%B")(d3.utcParse("%Y-%m")(m))[0] },
    y: { grid: true, title: "disease deaths →" },
  },
  marks: [
    barY({ channels: {
      x: { field: "month" },
      y: { field: "deaths", edit: move({ pick: "sweep" }) },   //! one stroke paints many months
      fill: { fn: (d) => (given(d) ? "#94a3b8" : "#4269d0") },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-crimean-war-recty',
  status: 'full',
  verdict: 'The same deaths as `rect` spans on a continuous time axis: each month is an `x1`/`x2` interval and the stack is an explicit `y1`/`y2` per cause.',
  needs: [],
  prep: ['prep-reshape', 'prep-stack', 'prep-calculate'],
  gaps: [
    'Plot’s `interval: "month"` derives each rect’s end from its start, and `rectY` stacks implicitly; here both the month end and the stack bounds are computed in JS.',
  ],
  recreation: {
    code: `const raw = await plotData("observablehq__plot-crimean-war-recty", "crimean-war.csv");
const causes = ["disease", "wounds", "other"];   // stack order (bottom first)
const data = raw.flatMap((d) => {
  let y = 0;
  return causes.map((cause) => ({
    start: d.date, end: d3.utcMonth.offset(d.date, 1), cause,
    y1: y, y2: (y += d[cause]),
  }));
});

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 28, left: 56 },
  data,
  schema: {
    start: { type: "temporal", domain: [raw[0].date, d3.utcMonth.offset(raw.at(-1).date, 1)] },
    end:   { type: "temporal", domain: [raw[0].date, d3.utcMonth.offset(raw.at(-1).date, 1)] },
    cause: { type: "categorical", domain: causes.slice().sort() },
    y1:    { type: "quantitative", domain: [0, 3200] },
    y2:    { type: "quantitative", domain: [0, 3200] },
  },
  axes: { x: {}, y: { grid: true, title: "deaths →" } },
  marks: [
    rect({ channels: {
      x1: { field: "start" }, x2: { field: "end" },
      y1: { field: "y1" }, y2: { field: "y2" },
      fill: { field: "cause", scale: { scheme: "observable10" } },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Name the main cause',
      question: 'Each rect is one month’s total deaths. Which cause do you think killed the most soldiers that month?',
      try: 'Click a month to select it, then click a cause in the legend. Click another month to move on.',
      why: '`edit.select()` makes a month the chart’s selection, and `edit.legend.category()` writes the clicked swatch into the selected row’s `cause`. The colour is the answer; the height is given context the reader cannot edit.',
      uses: ['edit.select()', 'edit.legend.category()'],
      code: `const raw = await plotData("observablehq__plot-crimean-war-recty", "crimean-war.csv");
const causes = ["disease", "wounds", "other", "not sure"];
const data = raw.map((d) => ({
  start: d.date, end: d3.utcMonth.offset(d.date, 1),
  total: d.disease + d.wounds + d.other, cause: "not sure",
}));
const span = [raw[0].date, d3.utcMonth.offset(raw.at(-1).date, 1)];

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 56 },
  data,
  schema: {
    start: { type: "temporal", domain: span },
    end:   { type: "temporal", domain: span },
    total: { type: "quantitative", domain: [0, 3200] },
    cause: { type: "categorical", domain: causes },
  },
  axes: { x: {}, y: { grid: true, title: "deaths →" } },
  marks: [
    rectY({
      stroke: "#fff",
      channels: {
        x1: { field: "start" }, x2: { field: "end" },
        y: { field: "total" },
        fill: { field: "cause", scale: { range: ["#4269d0", "#ff725c", "#efb118", "#cbd5e1"] } },
      },
      edits: [edit.select()],                              //! click a month to pick it
    }),
    legendColor({ anchor: "right", title: false,
                  edit: edit.legend.category() }),          //! a swatch writes the selected month's cause
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-vertical-bars-rotated-labels',
  status: 'full',
  verdict: 'The 20 most valuable brands as `barY`, values shown in billions, with the tick labels turned by the axis’s `labelAngle`.',
  needs: [],
  prep: ['prep-window', 'prep-calculate'],
  gaps: [
    '`labelAngle: 30` is in math degrees (counter-clockwise), the opposite sign of Plot’s `tickRotate: -30`.',
    'The top-20 sort and limit (`sort: {x: "y", reverse: true, limit: 20}`) and the division by 1,000 are done in JS.',
  ],
  recreation: {
    code: `const brands = await plotData("observablehq__plot-vertical-bars-rotated-labels", "brands-2018.csv");
const top = brands.slice().sort((a, b) => b.value - a.value).slice(0, 20)
  .map((d) => ({ name: d.name, value: d.value / 1000 }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 20, right: 12, bottom: 10, left: 52 },
  data: top,
  schema: {
    name:  { type: "categorical", domain: top.map((d) => d.name) },
    value: { type: "quantitative", domain: [0, 220] },
  },
  axes: { x: { labelAngle: 30 },                         //! the axis turns its own labels
          y: { grid: true, ticks: 5, title: "Market value (US dollars, billions) →" } },
  marks: [
    barY({ fill: "steelblue", channels: { x: { field: "name" }, y: { field: "value" } } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Edit the line-up',
      question: 'Which five brands do you think will be the most valuable in 2030, and what will each be worth (US$ billions)?',
      try: 'Drag a bar to set its value. Double-click a brand name to rename it, click × to drop it, double-click ＋ to add one.',
      why: 'The brands are a schema domain, so the axis carries `edit.scale.categories()`: renaming relabels the row, removing deletes it, adding appends a category. `move()` on `y` sets each value, so one chart elicits both the set and the sizes.',
      uses: ['edit.scale.categories()', 'move()', 'clamp()'],
      code: `const seed = [["Apple", 214], ["Google", 156], ["Amazon", 101], ["Microsoft", 93], ["Coca-Cola", 66]];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 48, left: 52 },
  data: seed.map(([name, value]) => ({ name, value })),
  schema: {
    name:  { type: "categorical", domain: seed.map((d) => d[0]) },
    value: { type: "quantitative", domain: [0, 600] },
  },
  constraints: [clamp({ field: "value", min: 0, max: 600 })],
  axes: false,
  marks: [
    axisY({ grid: true, ticks: 5, title: "value in 2030 (US$ billions) →" }),
    axisX({ edit: edit.scale.categories() }),               //! add, rename and remove brands
    barY({ fill: "steelblue", channels: {
      x: { field: "name" },
      y: { field: "value", edit: move() },                  //! drag to set a value
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-horizontal-bar-chart-with-label',
  status: 'full',
  verdict: 'The ten most valuable brands as `barX` with no x axis, each labelled in white inside its end by a `text` mark.',
  needs: [],
  prep: ['prep-window'],
  gaps: [
    'The top-10 sort and limit are computed in JS.',
  ],
  recreation: {
    code: `const brands = await plotData("observablehq__plot-horizontal-bar-chart-with-label", "brands-2018.csv");
const top = brands.slice().sort((a, b) => b.value - a.value).slice(0, 10);

mount(Elicit({
  width: 460, height: 240,
  margins: { top: 10, right: 12, bottom: 10, left: 90 },
  data: top,
  schema: {
    name:  { type: "categorical", domain: top.map((d) => d.name) },
    value: { type: "quantitative", domain: [0, 214480] },
  },
  scales: { y: { reverse: true } },
  axes: { x: false, y: {} },
  marks: [
    barX({ fill: "#1f2937", channels: { y: { field: "name" }, x: { field: "value" } } }),
    text({ fill: "#fff", textAnchor: "end", dx: -3, fontSize: 10, channels: {
      x: { field: "value" }, y: { field: "name" },
      text: { fn: (d) => Math.floor(d.value / 1000) + " B" },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Grab anywhere',
      question: 'What do you think each of these brands will be worth in 2028, in US$ billions?',
      try: 'Grab a bar anywhere along its length and drag left or right. The label follows.',
      why: 'An absolute `move()` puts the bar’s end at the pointer, so pressing the middle of a long bar would make it jump. `mode: "relative"` moves the value by the drag distance from wherever you grabbed. The label is a `{ fn }` of the same column, so it re-derives on every commit.',
      uses: ['move({ mode: "relative" })', 'clamp()', 'snap()'],
      code: `const seed = [["Apple", 214], ["Google", 156], ["Amazon", 101], ["Microsoft", 93],
              ["Coca-Cola", 66], ["Samsung", 60], ["Toyota", 53]];
mount(Elicit({
  width: 460, height: 240,
  margins: { top: 10, right: 12, bottom: 24, left: 90 },
  data: seed.map(([name, value]) => ({ name, value })),
  schema: {
    name:  { type: "categorical", domain: seed.map((d) => d[0]) },
    value: { type: "quantitative", domain: [0, 500] },
  },
  scales: { y: { reverse: true } },
  constraints: [
    clamp({ field: "value", min: 1, max: 500 }),
    snap({ field: "value", step: 1 }),
  ],
  marks: [
    barX({ fill: "#1f2937", channels: {
      y: { field: "name" },
      x: { field: "value", edit: move({ mode: "relative" }) },   //! no jump where you grab
    } }),
    text({ fill: "#fff", textAnchor: "end", dx: -3, fontSize: 10, channels: {
      x: { field: "value" }, y: { field: "name" },
      text: { fn: (d) => d.value + " B" },                       //! re-derives as you drag
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-horizontal-stacked-bars',
  status: 'full',
  verdict: 'The notebook’s headline chart — party shares of women and of men in Congress, normalized to 100% — as a stacked `barX` over proportions computed in JS.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: [
    'Plot’s `offset: "normalize"` is done in JS: each row is already a share of its gender, so the plain stack sums to 1.',
    'The notebook’s two earlier charts (counts by gender, and by party) are the same mark without the normalization and are not repeated here.',
    'Plot sorts the colours by width within each bar; here the stack follows a fixed party order.',
  ],
  recreation: {
    code: `const congress = await plotData("observablehq__plot-horizontal-stacked-bars", "us-congress-2023.csv");
const parties = ["Democrat", "Independent", "Republican"];   // stack order
const counts = d3.rollup(congress, (v) => v.length, (d) => d.gender, (d) => d.party);
const data = ["M", "F"].flatMap((gender) => {
  const total = d3.sum(counts.get(gender).values());
  return parties.map((party) => ({ gender, party, share: (counts.get(gender).get(party) || 0) / total }));
});

mount(Elicit({
  width: 460, height: 170,
  margins: { top: 40, right: 16, bottom: 36, left: 90 },
  data,
  schema: {
    gender: { type: "categorical", domain: ["M", "F"] },
    party:  { type: "categorical", domain: ["Independent", "Republican", "Democrat"] },  // colour order
    share:  { type: "quantitative", domain: [0, 1] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { tickFormat: (d) => Math.round(d * 100), title: "Frequency (%) →" }, y: {} },
  marks: [
    barX({ channels: {
      stack: { field: "party" },
      y: { field: "gender" },
      x: { field: "share" },
      fill: { field: "party", scale: { scheme: "dark2" },
              legend: { anchor: "top", title: false } },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Fill the chamber',
      question: 'Of the 535 voting members of the 2023 U.S. Congress, how many do you think are women?',
      try: 'Drag up or down across the grid to fill cells, or click a cell. Each cell is five members.',
      why: 'A `waffle` binds the `count` channel: `unit: 5` makes one cell worth five members, so the grid is the whole chamber. `edit.waffle.fill()` inverts the pointer to a cell and writes the count up to it.',
      uses: ['waffle', 'edit.waffle.fill()'],
      code: `mount(Elicit({
  width: 300, height: 320,
  margins: { top: 12, right: 12, bottom: 24, left: 40 },
  data: [{ group: "women", members: 100 }],
  schema: {
    group:   { type: "categorical", domain: ["women"] },
    members: { type: "quantitative", domain: [0, 535] },
  },
  scales: { x: { type: "band" } },
  axes: { x: {}, y: false },
  marks: [
    waffleY({
      fill: "#1b9e77", unit: 5, multiple: 10,               //! one cell = 5 members
      channels: {
        x: { field: "group" },
        count: { field: "members", edit: edit.waffle.fill() },   //! drag to fill
      },
      edits: [edit.waffle.fill({ channels: ["count"], gesture: "click" })],
    }),
    text({ fontSize: 13, lineAnchor: "top", channels: {
      x: { field: "group" }, y: { value: 0 },
      text: { fn: (d) => d.members + " of 535" },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-ordinal-bar-chart',
  status: 'full',
  verdict: 'Quarterly job vacancies on a band of quarters that includes the missing ones, with a second, offset x axis carrying the year under each Q2.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `interval: "quarter"` fills the gap in the data with empty bands; here the full run of quarters is generated in JS and declared as the ordinal domain, which does the same.',
    'The second axis row (`dy: 14` in Plot) is a second `axisX` shifted down with `transform`.',
  ],
  recreation: {
    code: `const all = await plotData("observablehq__plot-ordinal-bar-chart", "vacancies.csv");
const rows = all.slice(106, 127);
const quarter = d3.utcMonth.every(3);
const key = (d) => d.toISOString().slice(0, 10);
const quarters = quarter.range(quarter.floor(rows[0].month), d3.utcMonth.offset(rows.at(-1).month, 1)).map(key);
const data = rows.map((d) => ({ quarter: key(quarter.floor(d.month)), vacancies: d.vacancies }));
const q = (k) => "Q" + (Math.floor(+k.slice(5, 7) / 3) + 1);

mount(Elicit({
  width: 470, height: 280,
  margins: { top: 16, right: 12, bottom: 35, left: 50 },
  data,
  schema: {
    quarter:   { type: "ordinal", domain: quarters },
    vacancies: { type: "quantitative", domain: [0, 200] },
  },
  axes: false,
  marks: [
    axisY({ ticks: 5, title: "vacancies →" }),
    axisX({ tickFormat: q, fontSize: 9 }),
    axisX({ tickSize: 0, fontSize: 9,
            tickFormat: (k) => (q(k) === "Q2" ? k.slice(0, 4) : ""),
            transform: ({ base }) => ({ y: base.y + 13 }) }),
    barY({ fill: "#1f2937", channels: { x: { field: "quarter" }, y: { field: "vacancies" } } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Add the next quarters',
      question: 'How many job vacancies (thousands) do you expect in each of the next four quarters?',
      try: 'Click above an empty quarter on the right to add a bar there, drag it to adjust, alt-click a bar to remove it.',
      why: '`create()` mints a row from a click, inverting the pointer through both scales, so the click sets the quarter and the value at once. `context: true` makes the observed quarters context rows: the same `barY` draws them grey, read-only and never reported. `unique` keeps one bar per quarter, and since the record is rows of the same table, it also refuses a bar on a quarter the record already holds.',
      uses: ['create()', 'remove()', 'move()', 'unique()', 'context'],
      code: `const all = await plotData("observablehq__plot-ordinal-bar-chart", "vacancies.csv");
const rows = all.slice(118, 127);
const quarter = d3.utcMonth.every(3);
const key = (d) => d.toISOString().slice(0, 10);
const start = quarter.floor(rows[0].month);
const quarters = quarter.range(start, d3.utcMonth.offset(start, 3 * 13)).map(key);
const q = (k) => "Q" + (Math.floor(+k.slice(5, 7) / 3) + 1) + " " + k.slice(2, 4);
const record = rows.map((d) => ({ quarter: key(quarter.floor(d.month)), vacancies: d.vacancies }));
const last = record.at(-1).quarter;
const fields = {
  quarter:   { type: "ordinal", domain: quarters },
  vacancies: { type: "quantitative", domain: [0, 250] },
};

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 50 },
  schema: fields,
  data: record,
  context: true,                                            //! the observed quarters are given
  constraints: [
    unique({ field: "quarter", max: 1 }),                   //! one bar per quarter, none on the record
  ],
  axes: { x: { tickFormat: q, fontSize: 9 }, y: { grid: true, title: "vacancies (thousands) →" } },
  marks: [
    barY({
      channels: {
        x: { field: "quarter" },
        y: { field: "vacancies", edit: move() },
        fill: { fn: (d) => (d.quarter <= last ? "#94a3b8" : "#1f2937") },
      },
      edits: [
        create({ when: when.noAlt }),                       //! click empty space to add a bar
        remove({ when: when.alt }),
      ],
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-ordinal-scale-interval',
  status: 'full',
  verdict: 'World population by year as `barY` on an ordinal year domain that declares 2018 even though the data skips it, so the gap shows.',
  needs: [],
  prep: [],
  gaps: [
    'Plot needs `interval: 1` to keep the missing year; in ElicitJS the domain is declared on the schema, so a missing year is visible by construction (the notebook’s toggle has no counterpart).',
  ],
  recreation: {
    code: `const timeseries = [
  { year: 2014, population: 7295.290765 },
  { year: 2015, population: 7379.797139 },
  { year: 2016, population: 7464.022049 },
  { year: 2017, population: 7547.858925 },
  // { year: 2018, population: 7631.091040 },
  { year: 2019, population: 7713.468100 },
  { year: 2020, population: 7794.798739 },
];

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 40, left: 56 },
  data: timeseries,
  schema: {
    year:       { type: "ordinal", domain: d3.range(2014, 2021) },   // 2018 is declared
    population: { type: "quantitative", domain: [0, 8000] },
  },
  axes: { x: { title: "year" }, y: { grid: false, title: "population →" } },
  marks: [
    barY({ fill: "#1f2937", channels: { x: { field: "year" }, y: { field: "population" } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Fill the missing year',
      question: 'The 2018 figure is missing. What was the world’s population (millions) in 2018?',
      try: 'Drag the blue bar up or down within the shaded band.',
      why: '`context: (d) => d.year !== 2018` marks the six known years, so `getData()` reports one row, 2018: your answer. It must lie between its neighbours: a `clamp` holds it there, and a `guides.region` shades the same band so the rule is visible before you hit it.',
      uses: ['move()', 'context', 'clamp()', 'guides.region()'],
      code: `const known = [
  { year: 2014, population: 7295.3 }, { year: 2015, population: 7379.8 },
  { year: 2016, population: 7464.0 }, { year: 2017, population: 7547.9 },
  { year: 2019, population: 7713.5 }, { year: 2020, population: 7794.8 },
];
const fields = {
  year:       { type: "ordinal", domain: d3.range(2014, 2021) },
  population: { type: "quantitative", domain: [7200, 7900] },
};

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 28, left: 54 },
  schema: fields,
  data: [...known, { year: 2018, population: 7547.9 }],
  context: (d) => d.year !== 2018,                            //! the known years are given
  constraints: [clamp({ field: "population", min: 7547.9, max: 7713.5 })],   //! between its neighbours
  guides: [guides.region({ y: [7547.9, 7713.5], fill: "#4269d0", opacity: 0.1 })],
  axes: { x: {}, y: { grid: true, title: "population (millions) →" } },
  marks: [
    barY({ channels: {
      x: { field: "year" },
      y: { field: "population", edit: move() },               //! only 2018 moves
      fill: { fn: (d) => (d.year === 2018 ? "#4269d0" : "#94a3b8") },
    } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-temporal-bar-chart',
  status: 'full',
  verdict: 'Daily wind speed for the last six weeks as `rectY` spans on a continuous time axis, one day wide.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `interval: "day"` derives each rect’s end; here `x2` is computed as the next day in JS.',
  ],
  recreation: {
    code: `const weather = await plotData("weather");
const data = weather.slice(-42).map((d) => ({
  start: d.date, end: d3.utcDay.offset(d.date, 1), wind: d.wind,
}));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 28, left: 46 },
  data,
  schema: {
    start: { type: "temporal", domain: [data[0].start, data.at(-1).end] },
    end:   { type: "temporal", domain: [data[0].start, data.at(-1).end] },
    wind:  { type: "quantitative", domain: [0, 9] },
  },
  axes: { x: { ticks: 6 }, y: { title: "wind →" } },
  marks: [
    rectY({ fill: "#1f2937", stroke: "#fff", strokeWidth: 0.5, channels: {
      x1: { field: "start" }, x2: { field: "end" }, y: { field: "wind" },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Typical, then gusts',
      question: 'Seattle, the first week of 2016: what daily wind speed (m/s) do you expect, and how high could it reach on a gusty day?',
      try: 'First drag each bar to the typical wind. Press Next, then drag each tick to the gust level.',
      why: 'Each edit carries a `stage`, and only the current stage’s edits are live, so the two questions are asked in order without a second chart. `ordering` keeps every gust at or above its day’s typical wind, whichever handle moves.',
      uses: ['stage', 'move()', 'ordering()', 'clamp()'],
      code: `const days = d3.utcDays(new Date("2016-01-01"), new Date("2016-01-08"));
const chart = Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 46 },
  stage: 0,
  stageLabels: ["typical wind", "gusts"],
  data: days.map((d) => ({ start: d, end: d3.utcDay.offset(d, 1), noon: d3.utcHour.offset(d, 12), wind: 3, gust: 3 })),
  schema: {
    start: { type: "temporal", domain: [days[0], d3.utcDay.offset(days.at(-1), 1)] },
    end:   { type: "temporal", domain: [days[0], d3.utcDay.offset(days.at(-1), 1)] },
    noon:  { type: "temporal", domain: [days[0], d3.utcDay.offset(days.at(-1), 1)] },
    wind:  { type: "quantitative", domain: [0, 12] },
    gust:  { type: "quantitative", domain: [0, 12] },
  },
  constraints: [
    clamp({ field: ["wind", "gust"], min: 0, max: 12 }),
    ordering({ field: ["wind", "gust"] }),                   //! a gust is never below the typical wind
  ],
  axes: { x: { ticks: 7, tickFormat: d3.utcFormat("%a %d") }, y: { grid: true, title: "wind (m/s) →" } },
  marks: [
    rectY({ fill: "#1f2937", stroke: "#fff", channels: {
      x1: { field: "start" }, x2: { field: "end" },
      y: { field: "wind", edit: move({ stage: 0 }) },        //! stage 0: the typical wind
    } }),
    tickY({ stroke: "#e4572e", strokeWidth: 3, length: 30, channels: {
      x: { field: "noon" },
      y: { field: "gust", edit: move({ stage: 1 }) },        //! stage 1: the gust
    } }),
  ],
});
mount(chart);
const btn = document.createElement("button");
btn.textContent = "Next";
btn.onclick = () => chart.nextStage();
mount(btn);`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-bullet-graph',
  status: 'partial',
  verdict: 'Each bullet is a wide grey `barX` (share of population) with a narrower coloured `rectX` (share of cases) inside it; faceting is not covered by this study, so the five race panels are flattened into groups on one band axis instead of sitting side by side.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'Faceting is not covered by this study: instead of an `fx` facet, the race panels become five groups of rows on one band axis, labelled by a `text` mark, so the chart is tall instead of wide.',
    'Plot’s `insetTop`/`insetBottom` become a fixed pixel `height` on `rectX`, which centres a thinner bar in its band.',
    'The facet sort (by largest case share) is computed in JS.',
  ],
  recreation: {
    code: `const covid = await plotData("observablehq__plot-bullet-graph", "covid.csv");
const ages = ["80+", "65-79", "50-64", "35-49", "18-34", "0-17"];
const rows = covid.filter((d) => ages.includes(d.age));
const races = d3.groupSort(rows, (g) => -d3.max(g, (d) => d.cases_percent), (d) => d.race);
const slots = races.flatMap((r, i) => [...ages.map((a) => r + "|" + a), ...(i < races.length - 1 ? ["gap|" + r] : [])]);
const data = rows.map((d) => ({ slot: d.race + "|" + d.age, race: d.race, age: d.age,
  population: d.population_percent, cases: d.cases_percent }));

mount(Elicit({
  width: 460, height: 560,
  margins: { top: 30, right: 16, bottom: 8, left: 44 },
  data,
  schema: {
    slot:       { type: "ordinal", domain: slots },
    race:       { type: "categorical", domain: races },
    age:        { type: "ordinal", domain: ages },
    population: { type: "quantitative", domain: [0, 80] },
    cases:      { type: "quantitative", domain: [0, 80] },
  },
  scales: { y: { reverse: true, padding: 0.1 } },
  axes: {
    x: { anchor: "top", grid: true, tickSize: 0, tickValues: d3.range(0, 81, 10),
         tickFormat: (d) => (d === 80 ? d + "%" : d) },
    y: { tickSize: 0, tickFormat: (s) => (s.startsWith("gap") ? "" : s.split("|")[1]) },
  },
  marks: [
    barX({ fill: "#ddd", channels: { y: { field: "slot" }, x: { field: "population" } } }),
    rectX({ height: 6, channels: {
      y: { field: "slot" }, x: { field: "cases" },
      fill: { field: "race", scale: { scheme: "dark2" } },
    } }),
    text({ textAnchor: "end", fontSize: 11, fill: "#1f2937", channels: {
      x: { datum: 80 }, y: { field: "slot" },
      text: { fn: (d) => (d.age === "80+" ? d.race : "") },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Set the targets',
      question: 'Grey is each age group’s share of California’s Latino population; the bar is its share of the group’s COVID-19 cases. Where should next quarter’s target share of cases be for each age group?',
      try: 'Drag each black tick left or right to set a target.',
      why: 'A bullet graph is actual against target. The actuals are columns no edit names, so they stay fixed with no `lock` at all; the `target` column alone carries `move()`. All three columns share one x axis, so the target is read on the same scale as the actuals.',
      uses: ['move()', 'clamp()', 'snap()'],
      code: `const covid = await plotData("observablehq__plot-bullet-graph", "covid.csv");
const ages = ["80+", "65-79", "50-64", "35-49", "18-34", "0-17"];
const data = covid.filter((d) => d.race === "Latino" && ages.includes(d.age))
  .map((d) => ({ age: d.age, population: d.population_percent, cases: d.cases_percent, target: d.cases_percent }));

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 30, right: 16, bottom: 8, left: 50 },
  data,
  schema: {
    age:        { type: "ordinal", domain: ages },
    population: { type: "quantitative", domain: [0, 80] },
    cases:      { type: "quantitative", domain: [0, 80] },
    target:     { type: "quantitative", domain: [0, 80] },
  },
  scales: { y: { reverse: true } },
  constraints: [
    clamp({ field: "target", min: 0, max: 80 }),
    snap({ field: "target", step: 0.5 }),
  ],
  axes: { x: { anchor: "top", grid: true, tickFormat: (d) => d + "%" }, y: { tickSize: 0 } },
  marks: [
    barX({ fill: "#ddd", channels: { y: { field: "age" }, x: { field: "population" } } }),   //! actual: population
    rectX({ height: 8, fill: "#e7298a", channels: { y: { field: "age" }, x: { field: "cases" } } }),   //! actual: cases
    tickX({ stroke: "#111", strokeWidth: 3, inset: 4, channels: {
      y: { field: "age" },
      x: { field: "target", edit: move() },                 //! the target is the only editable column
    } }),
  ],
}))`,
    },
    {
      title: 'Target with tolerance',
      question: 'For each age group, what share of cases should next quarter’s target be, and how far either side of it would still count as on track?',
      try: 'Drag a black tick to move a target; its tolerance band comes with it. Drag either thin end to widen or narrow the band; the other end mirrors it.',
      why: 'A target and its tolerance are three columns of one row. `follow` carries `lo` and `hi` along when the `target` moves, `symmetric` mirrors one end about the target when you drag the other, and `ordering` keeps `lo ≤ target ≤ hi`.',
      uses: ['move()', 'follow()', 'symmetric()', 'ordering()'],
      code: `const covid = await plotData("observablehq__plot-bullet-graph", "covid.csv");
const ages = ["80+", "65-79", "50-64", "35-49", "18-34", "0-17"];
const data = covid.filter((d) => d.race === "Latino" && ages.includes(d.age))
  .map((d) => {
    const c = d.cases_percent, w = Math.min(4, c, 80 - c);   // a ±4 band that fits the axis
    return { age: d.age, population: d.population_percent, cases: c, lo: c - w, target: c, hi: c + w };
  });
const pct = { type: "quantitative", domain: [0, 80] };

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 30, right: 16, bottom: 8, left: 50 },
  data,
  schema: { age: { type: "ordinal", domain: ages },
            population: pct, cases: pct, lo: pct, target: pct, hi: pct },
  scales: { y: { reverse: true } },
  constraints: [
    follow({ field: ["lo", "hi"], lead: "target" }),         //! the band rides with the target
    symmetric({ field: ["lo", "hi"], about: "target" }),     //! one end mirrors the other
    ordering({ field: ["lo", "target", "hi"] }),
    clamp({ field: ["lo", "target", "hi"], min: 0, max: 80 }),
  ],
  axes: { x: { anchor: "top", grid: true, tickFormat: (d) => d + "%" }, y: { tickSize: 0 } },
  marks: [
    barX({ fill: "#ddd", channels: { y: { field: "age" }, x: { field: "population" } } }),
    rectX({ height: 8, fill: "#e7298a", channels: { y: { field: "age" }, x: { field: "cases" } } }),
    rectX({ height: 20, fill: "#111", fillOpacity: 0.12, channels: {
      y: { field: "age" }, x1: { field: "lo" }, x2: { field: "hi" } } }),
    tickX({ stroke: "#475569", strokeWidth: 2, inset: 6, channels: {
      y: { field: "age" }, x: { field: "lo", edit: move() } } }),
    tickX({ stroke: "#475569", strokeWidth: 2, inset: 6, channels: {
      y: { field: "age" }, x: { field: "hi", edit: move() } } }),
    tickX({ stroke: "#111", strokeWidth: 3, inset: 2, channels: {
      y: { field: "age" }, x: { field: "target", edit: move() } } }),   //! drag the target
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-binned-box-plot',
  status: 'full',
  verdict: 'Box plots of diamond price per half-carat bin, composed from `ruleY` whiskers, a `barY` span for the quartiles and a `tickY` median; the outliers are read-only context rows drawn by `point`.',
  needs: [],
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: [
    'ElicitJS has no box transform: the quartiles, the 1.5 × IQR whiskers and the outliers are computed in JS with `d3.quantile`.',
    'Plot facets by the binned carat (`fx` with `interval: 0.5`); here each bin is a band on x, which draws the same layout.',
  ],
  recreation: {
    code: `const diamonds = await plotData("diamonds");
const bin = (c) => (Math.floor(c / 0.5) * 0.5).toFixed(1);
const groups = d3.groups(diamonds, (d) => bin(d.carat)).sort((a, b) => a[0] - b[0]);
const outliers = [];
const data = groups.map(([b, rows]) => {
  const p = rows.map((d) => d.price).sort(d3.ascending);
  const q1 = d3.quantile(p, 0.25), q3 = d3.quantile(p, 0.75), iqr = q3 - q1;
  const lo = d3.min(p.filter((v) => v >= q1 - 1.5 * iqr));
  const hi = d3.max(p.filter((v) => v <= q3 + 1.5 * iqr));
  p.filter((v) => v < lo || v > hi).forEach((price) => outliers.push({ bin: b, price }));
  return { bin: b, lo, q1, median: d3.quantile(p, 0.5), q3, hi };
});
const bins = { type: "ordinal", domain: data.map((d) => d.bin) };
const price = { type: "quantitative", domain: [0, 19000] };

mount(Elicit({
  width: 470, height: 340,
  margins: { top: 16, right: 12, bottom: 34, left: 56 },
  schema: { bin: bins, lo: price, q1: price, median: price, q3: price, hi: price, price },
  data: [...data, ...outliers],
  context: (d) => d.price != null,     // the outliers fill only \`price\`
  axes: { x: { title: "Carats →" }, y: { grid: true, title: "Price →" } },
  marks: [
    ruleY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
    barY({ fill: "#cbd5e1", channels: { x: { field: "bin" }, y1: { field: "q1" }, y2: { field: "q3" } } }),
    tickY({ stroke: "#1f2937", strokeWidth: 2, channels: { x: { field: "bin" }, y: { field: "median" } } }),
    point({ size: 1.5, fill: "none", stroke: "#1f2937", strokeWidth: 0.6,
      channels: { x: { field: "bin" }, y: { field: "price" } } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Draw the next box',
      question: 'The grey box shows diamond prices for 1.5–2.0 carat stones. Where do you think the whiskers, quartiles and median lie for 2.0–2.5 carat stones?',
      try: 'Drag the box’s top or bottom edge, the median line, or a whisker end. Each moves on its own.',
      why: 'A box is five fields of one row. Each field is drawn by its own `tickY` carrying `move()`, so a drag on one handle writes one column, and the box and whisker re-derive from them. `ordering` keeps the five in order whichever one you drag. `context` marks the reference box: the same marks draw it, read-only and never reported.',
      uses: ['move()', 'ordering()', 'context', 'clamp()'],
      code: `const fields = ["lo", "q1", "median", "q3", "hi"];
const q = { type: "quantitative", domain: [0, 20000] };
const box = { bin: { type: "ordinal", domain: ["1.5–2.0", "2.0–2.5"] },
              lo: q, q1: q, median: q, q3: q, hi: q };
const mine = (d) => d.bin === "2.0–2.5";
// The whisker, the box and the median, over every row.
const glyph = [
  ruleY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
  barY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "q1" }, y2: { field: "q3" },
    fill: { fn: (d) => (mine(d) ? "#93c5fd" : "#e2e8f0") } } }),
  tickY({ stroke: "#1f2937", strokeWidth: 2, channels: { x: { field: "bin" }, y: { field: "median" } } }),
];
// A handle per column, drawn on your box only.
const handle = (field, inset = 0) => tickY({ strokeWidth: 3, inset, channels: {
  x: { field: "bin" }, y: { field, edit: move() },
  stroke: { fn: (d) => (mine(d) ? "#1f2937" : "none") } } });

mount(Elicit({
  width: 400, height: 320,
  margins: { top: 16, right: 16, bottom: 36, left: 56 },
  schema: box,
  data: [
    { bin: "1.5–2.0", lo: 3200, q1: 7400, median: 10400, q3: 13600, hi: 18800 },
    { bin: "2.0–2.5", lo: 6000, q1: 9000, median: 12000, q3: 15000, hi: 18000 },
  ],
  context: (d) => !mine(d),                                //! the reference box is given
  constraints: [
    clamp({ field: fields, min: 0, max: 20000 }),
    ordering({ field: fields }),                            //! lo ≤ q1 ≤ median ≤ q3 ≤ hi
  ],
  axes: { x: { title: "carats" }, y: { grid: true, tickFormat: "$~s", title: "price →" } },
  marks: [
    ...glyph,
    handle("q1"), handle("q3"), handle("median"),           //! one tick per column
    handle("lo", 30), handle("hi", 30),
  ],
}))`,
    },
    {
      title: 'Move the median',
      question: 'Where is the typical price of a 2.0–2.5 carat diamond, and how widely do prices spread around it?',
      try: 'Drag the median line: the whole box and its whiskers come with it. Then drag any edge or whisker end on its own to reshape the spread.',
      why: '`follow({ lead: "median" })` moves the four other columns by the same amount whenever the median moves, so you place the centre first without undoing the spread. Dragging an edge writes only that column, and `ordering` keeps the five in order.',
      uses: ['follow()', 'ordering()', 'move()', 'context'],
      code: `const fields = ["lo", "q1", "median", "q3", "hi"];
const q = { type: "quantitative", domain: [0, 20000] };
const box = { bin: { type: "ordinal", domain: ["1.5–2.0", "2.0–2.5"] },
              lo: q, q1: q, median: q, q3: q, hi: q };
const mine = (d) => d.bin === "2.0–2.5";
const glyph = [
  ruleY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
  barY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "q1" }, y2: { field: "q3" },
    fill: { fn: (d) => (mine(d) ? "#93c5fd" : "#e2e8f0") } } }),
  tickY({ stroke: "#1f2937", strokeWidth: 2, channels: { x: { field: "bin" }, y: { field: "median" } } }),
];
// A handle per column, drawn on your box only.
const handle = (field, inset = 0, strokeWidth = 3) => tickY({ strokeWidth, inset, channels: {
  x: { field: "bin" }, y: { field, edit: move() },
  stroke: { fn: (d) => (mine(d) ? "#1f2937" : "none") } } });

mount(Elicit({
  width: 400, height: 320,
  margins: { top: 16, right: 16, bottom: 36, left: 56 },
  schema: box,
  data: [
    { bin: "1.5–2.0", lo: 3200, q1: 7400, median: 10400, q3: 13600, hi: 18800 },
    { bin: "2.0–2.5", lo: 2000, q1: 4000, median: 6000, q3: 8000, hi: 10000 },
  ],
  context: (d) => !mine(d),
  constraints: [
    follow({ field: ["lo", "q1", "q3", "hi"], lead: "median" }),   //! the box rides with the median
    ordering({ field: fields }),
    clamp({ field: fields, min: 0, max: 20000 }),
  ],
  axes: { x: { title: "carats" }, y: { grid: true, tickFormat: "$~s", title: "price →" } },
  marks: [
    ...glyph,
    handle("q1"), handle("q3"), handle("lo", 30), handle("hi", 30),
    handle("median", 0, 5),                                 //! grab the centre
  ],
}))`,
    },
    {
      title: 'A symmetric box',
      question: 'If 2.0–2.5 carat prices were spread evenly either side of the median, where would the median, quartiles and whiskers sit?',
      try: 'Drag the median to move the box. Drag one quartile edge and the other mirrors it; the same for the whisker ends.',
      why: 'Two `symmetric` rules mirror `q1`/`q3` and `lo`/`hi` about the median, so a drag on one end sets both, and `follow` still carries the whole box with the median. The constraints, not the marks, decide the shape you can draw.',
      uses: ['symmetric()', 'follow()', 'ordering()', 'move()'],
      code: `const fields = ["lo", "q1", "median", "q3", "hi"];
const q = { type: "quantitative", domain: [0, 20000] };
const box = { bin: { type: "ordinal", domain: ["1.5–2.0", "2.0–2.5"] },
              lo: q, q1: q, median: q, q3: q, hi: q };
const mine = (d) => d.bin === "2.0–2.5";
const glyph = [
  ruleY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "lo" }, y2: { field: "hi" } } }),
  barY({ stroke: "#1f2937", channels: { x: { field: "bin" }, y1: { field: "q1" }, y2: { field: "q3" },
    fill: { fn: (d) => (mine(d) ? "#93c5fd" : "#e2e8f0") } } }),
  tickY({ stroke: "#1f2937", strokeWidth: 2, channels: { x: { field: "bin" }, y: { field: "median" } } }),
];
// A handle per column, drawn on your box only.
const handle = (field, inset = 0, strokeWidth = 3) => tickY({ strokeWidth, inset, channels: {
  x: { field: "bin" }, y: { field, edit: move() },
  stroke: { fn: (d) => (mine(d) ? "#1f2937" : "none") } } });

mount(Elicit({
  width: 400, height: 320,
  margins: { top: 16, right: 16, bottom: 36, left: 56 },
  schema: box,
  data: [
    { bin: "1.5–2.0", lo: 3200, q1: 7400, median: 10400, q3: 13600, hi: 18800 },
    { bin: "2.0–2.5", lo: 8000, q1: 11000, median: 13000, q3: 15000, hi: 18000 },
  ],
  context: (d) => !mine(d),
  constraints: [
    follow({ field: ["lo", "q1", "q3", "hi"], lead: "median" }),
    symmetric({ field: ["q1", "q3"], about: "median" }),    //! quartiles mirror each other
    symmetric({ field: ["lo", "hi"], about: "median" }),    //! so do the whiskers
    ordering({ field: fields }),
    clamp({ field: fields, min: 0, max: 20000 }),
  ],
  axes: { x: { title: "carats" }, y: { grid: true, tickFormat: "$~s", title: "price →" } },
  marks: [
    ...glyph,
    handle("q1"), handle("q3"), handle("lo", 30), handle("hi", 30),
    handle("median", 0, 5),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-gradient-bars',
  status: 'full',
  verdict: 'The letter frequencies as `barY` painted with the purple–red–gold `gradient`, which runs over each bar’s own box as Plot’s `linearGradient` does.',
  needs: [],
  prep: [],
  gaps: [
    'Plot injects an SVG `<linearGradient>` and points `fill` at it; here the stops are the bar’s `gradient` option. Its offsets run bottom-up (0 is the base of each bar), so Plot’s top-down 15% / 75% / 100% become 0 / 0.25 / 0.85.',
  ],
  recreation: {
    code: `const alphabet = (await plotData("alphabet"))
  .map(({ letter, frequency }) => ({ letter, frequency }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 40, left: 52 },
  data: alphabet,
  schema: {
    letter:    { type: "categorical", domain: alphabet.map((d) => d.letter).sort() },
    frequency: { type: "quantitative", domain: [0, 0.13] },
  },
  axes: { x: { title: "letter" }, y: { tickFormat: ".2f", title: "frequency →" } },
  marks: [
    barY({
      gradient: { stops: [[0, "gold"], [0.25, "red"], [0.85, "purple"]] },   // bottom to top
      channels: { x: { field: "letter" }, y: { field: "frequency" } },
    }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Guess, then reveal',
      question: 'How often does each of these letters appear in English text?',
      try: 'Drag each bar to your guess, then press Reveal to see the real frequencies as black ticks.',
      why: 'The `move()` belongs to stage 0, so once you reveal, the bars freeze and your answer cannot be adjusted to the truth. The truth is a `guides.custom` layer that reads the chart’s `stage` and draws nothing until stage 1: what it shows depends on the state of the interaction, which is what a guide is for.',
      uses: ['stage', 'move()', 'guides.custom', 'gradient', 'clamp()'],
      code: `const alphabet = await plotData("alphabet");
const letters = ["E", "T", "Q", "S", "Z", "H"];
const truth = new Map(alphabet.map((d) => [d.letter, d.frequency]));
const chart = Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 52 },
  stage: 0,
  data: letters.map((letter) => ({ letter, frequency: 0.04 })),
  schema: {
    letter:    { type: "categorical", domain: letters },
    frequency: { type: "quantitative", domain: [0, 0.15] },
  },
  constraints: [clamp({ field: "frequency", min: 0, max: 0.15 })],
  axes: { x: {}, y: { grid: true, tickFormat: ".0%", title: "share of letters →" } },
  guides: [guides.custom(({ scales, stage }) => stage < 1 ? [] : letters.map((l) => ({   //! nothing until stage 1
    type: "line", stroke: "#111", strokeWidth: 4,
    x1: scales.x(l), x2: scales.x(l) + scales.x.bandwidth(),
    y1: scales.y(truth.get(l)), y2: scales.y(truth.get(l)),
  })))],
  marks: [
    barY({
      gradient: { stops: [[0, "gold"], [0.25, "red"], [0.85, "purple"]] },   //! the original's paint
      channels: {
        x: { field: "letter" },
        y: { field: "frequency", edit: move({ stage: 0 }) },   //! editable only before the reveal
      },
    }),
  ],
});
mount(chart);
const btn = document.createElement("button");
btn.textContent = "Reveal";
btn.onclick = () => chart.nextStage();
mount(btn);`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-colored-stacked-bar-chart',
  status: 'full',
  verdict: 'One unit per penguin, stacked along x within each species and coloured by body mass on a continuous ramp; the data is sorted by mass so the stack runs light to heavy.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `x: 1` constant becomes a `one` column, and its `sort: "body_mass_g"` is a JS sort of the rows. Each penguin gets an `id`, and `stack: { field: "id" }` stacks them in that order.',
    'The two penguins with no recorded mass are dropped; Plot keeps them as unfilled units.',
  ],
  recreation: {
    code: `const penguins = (await plotData("penguins"))
  .filter((d) => Number.isFinite(d.body_mass_g))
  .sort((a, b) => a.body_mass_g - b.body_mass_g)
  .map((d, i) => ({ id: i, species: d.species, body_mass_g: d.body_mass_g, one: 1 }));

mount(Elicit({
  width: 460, height: 220,
  margins: { top: 50, right: 16, bottom: 30, left: 66 },
  data: penguins,
  schema: {
    id:          { type: "categorical" },
    species:     { type: "categorical", domain: ["Adelie", "Chinstrap", "Gentoo"] },
    body_mass_g: { type: "quantitative", domain: [2700, 6300] },
    one:         { type: "quantitative", domain: [0, 152] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { title: "Frequency →" }, y: {} },
  marks: [
    barX({ stroke: "#fff", strokeWidth: 0.5, channels: {
      stack: { field: "id" },
      y: { field: "species" },
      x: { field: "one" },
      fill: { field: "body_mass_g", scale: { scheme: "turbo" }, legend: { anchor: "top" } },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Balls in bins',
      question: 'If you weighed 20 Gentoo penguins, how would their body masses spread across these bins?',
      try: 'Click above a bin to drop a penguin there; alt-click a dot to take it back. You have 20.',
      why: 'Here a row is one token, not one value, so `dotStack` draws a column per bin and `create()` adds a row where you click. `count({ max: 20 })` is the budget: a 21st click is refused, so the stacks are a distribution over exactly 20 penguins.',
      uses: ['dotStack', 'create()', 'remove()', 'count()'],
      code: `const bins = d3.range(4000, 6500, 250).map((g) => g + "–" + (g + 250));
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 16, right: 12, bottom: 44, left: 12 },
  data: [],
  schema: { mass: { type: "ordinal", domain: bins } },
  scales: { x: { type: "band" } },
  axes: { x: { fontSize: 9, tickFormat: (b) => b.split("–")[0] }, y: false },
  constraints: [count({ max: 20, strategy: "reject" })],      //! twenty penguins, no more
  marks: [
    dotStack({
      fill: "#5b8def", label: true,
      channels: { x: { field: "mass" } },
      edits: [
        create({ channels: ["x"], when: when.noAlt }),          //! a click adds one penguin
        remove({ when: when.alt }),
      ],
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-civilizations-timeline',
  status: 'full',
  verdict: 'A Gantt-style `barX` with `x1`/`x2` spans per civilization, sorted by start, labelled to the left of each bar, on a top axis formatted as BC/AD.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The sort by start year (`sort: {y: "x1"}`) is computed in JS and declared as the band domain.',
  ],
  recreation: {
    code: `const civs = (await plotData("observablehq__plot-civilizations-timeline", "civilizations.csv"))
  .map(({ civilization, start, end }) => ({ civilization, start, end }))
  .sort((a, b) => a.start - b.start);

mount(Elicit({
  width: 470, height: 680,
  margins: { top: 26, right: 12, bottom: 8, left: 130 },
  overflow: "visible",
  data: civs,
  schema: {
    civilization: { type: "categorical", domain: civs.map((d) => d.civilization) },
    start: { type: "quantitative", domain: [d3.min(civs, (d) => d.start), d3.max(civs, (d) => d.end)] },
    end:   { type: "quantitative", domain: [d3.min(civs, (d) => d.start), d3.max(civs, (d) => d.end)] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { anchor: "top", grid: true, tickFormat: (x) => (x < 0 ? -x + " BC" : x + " AD") }, y: false },
  marks: [
    barX({ fill: "#1f2937", channels: {
      y: { field: "civilization" },
      x1: { field: "start" }, x2: { field: "end" },
    } }),
    text({ textAnchor: "end", dx: -3, fontSize: 9, channels: {
      x: { field: "start" }, y: { field: "civilization" }, text: { field: "civilization" },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Brush each era',
      question: 'When do you think each of these civilizations began and ended?',
      try: 'Drag a bar’s end to move that end; drag its middle to slide the whole span.',
      why: '`brushSpan` edits both columns of a span at once: a grab within `edgeInset` of an end moves that end, anywhere else translates the bar. `ordering` keeps every start before its end.',
      uses: ['brushSpan()', 'ordering()', 'clamp()'],
      code: `const names = ["Indus civilization", "Shang dynasty", "Roman Empire", "Maya civilization",
               "Abbasid Caliphate", "Inca Empire"];
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 26, right: 28, bottom: 8, left: 120 },
  data: names.map((civilization) => ({ civilization, start: -500, end: 500 })),
  schema: {
    civilization: { type: "categorical", domain: names },
    start: { type: "quantitative", domain: [-3500, 2000] },
    end:   { type: "quantitative", domain: [-3500, 2000] },
  },
  scales: { y: { reverse: true } },
  constraints: [
    clamp({ field: ["start", "end"], min: -3500, max: 2000 }),
    ordering({ field: ["start", "end"] }),                    //! a start never passes its end
  ],
  axes: { x: { anchor: "top", grid: true, tickFormat: (x) => (x < 0 ? -x + " BC" : x + " AD") },
          y: { tickSize: 0 } },
  marks: [
    barX({ fill: "#1f2937", channels: {
      y: { field: "civilization" },
      x1: { field: "start" }, x2: { field: "end" },
    }, edits: [brushSpan({ edgeInset: 10 })] }),               //! ends resize, body slides
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-stacked-percentages',
  status: 'full',
  verdict: 'The 26 letter frequencies laid end to end as one bar: `rect` spans from a cumulative sum computed in JS, each labelled with its letter, between rules at 0 and 100%.',
  needs: [],
  prep: ['prep-stack'],
  gaps: [
    'Plot’s `stackX` transform computes the spans and the label positions; here both are computed in JS (a stacked `bar` needs a band axis, which this chart does not have).',
  ],
  recreation: {
    code: `const alphabet = await plotData("alphabet");
let x = 0;
const data = alphabet.map(({ letter, frequency }) => ({ letter, x1: x, x2: (x += frequency), mid: x - frequency / 2 }));

mount(Elicit({
  width: 470, height: 76,
  margins: { top: 6, right: 16, bottom: 30, left: 16 },
  data,
  schema: {
    letter: { type: "categorical", domain: data.map((d) => d.letter) },
    x1:  { type: "quantitative", domain: [0, x] },   // the frequencies sum to 1.0006
    x2:  { type: "quantitative", domain: [0, x] },
    mid: { type: "quantitative", domain: [0, x] },
  },
  axes: { x: { tickFormat: (d) => Math.round(d * 100), title: "frequency (%) →" }, y: false },
  marks: [
    rect({ fill: "#1f2937", fillOpacity: 0.3, stroke: "#fff", strokeWidth: 1,
      channels: { x1: { field: "x1" }, x2: { field: "x2" } } }),
    text({ fontSize: 10, channels: {
      x: { field: "mid" }, y: { value: 20 }, text: { field: "letter" },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 1 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Split one bar',
      question: 'What share of the letters in English text are E, T, A, O and I — and what share are all the other 21 letters?',
      try: 'Drag the dots between segments. The bar always adds up to 100%.',
      why: 'A single stacked bar is a whole divided among rows. `edit.stack.edge()` moves one boundary at a time, so what one letter gains its neighbour loses and the total stays at 100% by construction, with no `maintainSum` needed.',
      uses: ['edit.stack.edge()', 'bar stack channel'],
      code: `const parts = ["E", "T", "A", "O", "I", "the other 21"];
mount(Elicit({
  width: 460, height: 150,
  margins: { top: 10, right: 120, bottom: 26, left: 16 },
  scales: { y: { padding: 0.35 } },
  data: parts.map((letter) => ({ bar: "all letters", letter, share: 1 / 6 })),
  schema: {
    bar:    { type: "categorical", domain: ["all letters"] },
    letter: { type: "categorical", domain: parts },
    share:  { type: "quantitative", domain: [0, 1] },
  },
  axes: { x: { tickFormat: ".0%" }, y: false },
  marks: [
    barX({
      channels: {
        stack: { field: "letter" },  //! one bar, one whole
        y: { field: "bar" },
        x: { field: "share" },
        fill: { field: "letter", legend: { anchor: "right", title: false } },
      },
      edits: [edit.stack.edge()],                             //! move a boundary
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-single-stacked-bar',
  status: 'full',
  verdict: 'The share of Olympians per sport as one bar of `rect` spans (largest first), with rotated sport names on the segments that hold more than 200 athletes.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: [
    'The proportions, the largest-first order and the label filter are computed in JS.',
    'The labels are turned with `angle: -90` (math degrees) to match Plot’s `rotate: 90`.',
  ],
  recreation: {
    code: `const olympians = await plotData("olympians");
const n = olympians.length;
const sports = d3.rollups(olympians, (v) => v.length, (d) => d.sport).sort((a, b) => b[1] - a[1]);
let x = 0;
const data = sports.map(([sport, count]) => ({ sport, count, x1: x, x2: (x += count / n), mid: x - count / n / 2 }));

mount(Elicit({
  width: 470, height: 130,
  margins: { top: 10, right: 16, bottom: 30, left: 16 },
  data,
  schema: {
    sport: { type: "categorical", domain: data.map((d) => d.sport) },
    count: { type: "quantitative", domain: [0, 2400] },
    x1:  { type: "quantitative", domain: [0, 1] },
    x2:  { type: "quantitative", domain: [0, 1] },
    mid: { type: "quantitative", domain: [0, 1] },
  },
  axes: { x: { tickFormat: (d) => Math.round(d * 100), title: "Frequency (%) →" }, y: false },
  marks: [
    rect({ fill: "#1f2937", fillOpacity: 0.2, stroke: "#fff", strokeWidth: 1,
      channels: { x1: { field: "x1" }, x2: { field: "x2" } } }),
    text({ angle: -90, fontSize: 10, channels: {
      x: { field: "mid" }, y: { value: 45 },
      text: { fn: (d) => (d.count > 200 ? d.sport : "") },
    } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 0 } } }),
    ruleX({ stroke: "#1f2937", channels: { x: { datum: 1 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Cut, then name',
      question: 'How do you think the athletes at the next Summer Games will split across sports? Add the sports you expect to be largest.',
      try: 'Click a segment to cut a new sport from it, drag a boundary to resize, alt-click a boundary to merge. Double-click a colour swatch in the legend to rename its sport.',
      why: 'The sport domain is `open`, so `edit.stack.cut()` mints a new category (named by `label`) instead of refusing. Naming is a separate act: the legend carries `edit.scale.categories()`, so a double-click renames the category in the schema and every row that uses it.',
      uses: ['edit.stack.cut()', 'edit.stack.edge()', 'edit.stack.merge()', 'open domain', 'edit.scale.categories()'],
      code: `mount(Elicit({
  width: 460, height: 150,
  margins: { top: 10, right: 120, bottom: 26, left: 16 },
  data: [{ games: "next Games", sport: "athletics", share: 1 }],
  schema: {
    games: { type: "categorical", domain: ["next Games"] },
    sport: { type: "categorical", domain: ["athletics"], open: true },   //! cuts may mint new sports
    share: { type: "quantitative", domain: [0, 1] },
  },
  axes: { x: { tickFormat: ".0%" }, y: false },
  marks: [
    barX({
      channels: {
        stack: { field: "sport" },
        y: { field: "games" },
        x: { field: "share" },
        fill: { field: "sport", scale: { scheme: "tableau10" } },
      },
      edits: [
        edit.stack.cut({ label: "sport" }),                   //! click to cut off a new sport
        edit.stack.edge(),
        edit.stack.merge({ when: when.alt }),
      ],
    }),
    legendColor({ anchor: "right", title: false,
                  edit: edit.scale.categories() }),           //! double-click a swatch to rename
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-warming-stripes',
  status: 'full',
  verdict: 'One full-height `rect` per year, `x1`/`x2` spanning the year, filled by the temperature anomaly on a diverging blue–red scale centred on zero.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `interval: "year"` derives each stripe’s end; here `x2` is the next year, computed in JS.',
    'Plot’s `scheme: "BuRd"` is `scheme: "RdBu"` reversed, on a diverging scale pivoted at zero.',
  ],
  recreation: {
    code: `const raw = await plotData("observablehq__plot-warming-stripes", "hadcrut-annual.txt", { type: "text" });
const data = raw.trim().split(/\\n/g).map((line) => line.split(/\\s+/g))
  .map(([year, anomaly]) => ({ start: +year, end: +year + 1, anomaly: +anomaly }));

mount(Elicit({
  width: 470, height: 64,
  margins: { top: 0, right: 10, bottom: 24, left: 10 },
  data,
  schema: {
    start:   { type: "quantitative", domain: [data[0].start, data.at(-1).end] },
    end:     { type: "quantitative", domain: [data[0].start, data.at(-1).end] },
    anomaly: { type: "quantitative", domain: d3.extent(data, (d) => d.anomaly) },
  },
  axes: { x: { tickFormat: "d" }, y: false },
  marks: [
    rect({ channels: {
      x1: { field: "start" }, x2: { field: "end" },
      fill: { field: "anomaly", scale: { type: "diverging", scheme: "RdBu", reverse: true, pivot: 0 } },
    } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Colour the decades',
      question: 'How warm will each coming decade be, relative to the 1961–1990 average (°C)?',
      try: 'Click one of the three wide stripes on the right, then drag the handle on the colour ramp below.',
      why: 'A colour cannot be dragged, so the value is set on its key: `edit.select()` makes a decade the chart’s selection and `edit.legend.value()` turns the ramp into a slider that writes that row’s `anomaly`. `context` marks the observed years: the same `rect` draws them, read-only, so `getData()` holds only your three decades.',
      uses: ['edit.select()', 'edit.legend.value()', 'context'],
      code: `const raw = await plotData("observablehq__plot-warming-stripes", "hadcrut-annual.txt", { type: "text" });
const observed = raw.trim().split(/\\n/g).map((line) => line.split(/\\s+/g))
  .map(([year, anomaly]) => ({ start: +year, end: +year + 1, anomaly: +anomaly }))
  .filter((d) => d.start >= 1960);
const last = observed.at(-1).end;
const fields = {
  start:   { type: "quantitative", domain: [1960, last + 30] },
  end:     { type: "quantitative", domain: [1960, last + 30] },
  anomaly: { type: "quantitative", domain: [-1, 2.5] },
};
const fill = { field: "anomaly", scale: { type: "diverging", scheme: "RdBu", reverse: true, pivot: 0 } };

mount(Elicit({
  width: 460, height: 170,
  margins: { top: 8, right: 10, bottom: 70, left: 10 },
  schema: fields,
  data: [...observed, ...[0, 10, 20].map((k) => ({ start: last + k, end: last + k + 10, anomaly: 0 }))],
  context: (d) => d.end <= last,                            //! the record is given
  axes: { x: { tickFormat: "d" }, y: false },
  marks: [
    rect({
      strokeWidth: 1,
      channels: { x1: { field: "start" }, x2: { field: "end" }, fill,
                  stroke: { fn: (d) => (d.end > last ? "#fff" : "none") } },   // outline your decades
      edits: [edit.select()],                                 //! click a decade to pick it
    }),
    legendColor({ anchor: "bottom", title: "anomaly (°C)",
                  edit: edit.legend.value() }),                //! the ramp sets its value
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------------------
GALLERY.add({
  id: 'plot-normal-histogram',
  status: 'full',
  verdict: '10,000 standard-normal draws, binned in JS and drawn as `rectY` spans from each bin’s edges to its count.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [
    'Plot’s `binX` transform is `d3.bin` here, with thresholds chosen to give Plot’s 0.2-wide bins; the draws use a seeded generator so the chart is stable.',
  ],
  recreation: {
    code: `const normal = d3.randomNormal.source(d3.randomLcg(42))();
const values = Array.from({ length: 10000 }, normal);
const bins = d3.bin().thresholds(40)(values)
  .map((b) => ({ x1: b.x0, x2: b.x1, count: b.length }));
const span = [bins[0].x1, bins.at(-1).x2];

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 12, bottom: 28, left: 52 },
  data: bins,
  schema: {
    x1:    { type: "quantitative", domain: span },
    x2:    { type: "quantitative", domain: span },
    count: { type: "quantitative", domain: [0, d3.max(bins, (d) => d.count)] },
  },
  axes: { x: {}, y: { grid: false, title: "Frequency →" } },
  marks: [
    rectY({ fill: "#1f2937", stroke: "#fff", strokeWidth: 0.5, channels: {
      x1: { field: "x1" }, x2: { field: "x2" }, y: { field: "count" },
    } }),
    ruleY({ stroke: "#1f2937", channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Share out the chances',
      question: 'Draw 10,000 numbers from a standard normal distribution. What percentage do you think lands in each of these bins?',
      try: 'Drag a bin up or down. The others rescale so the bins always add up to 100%.',
      why: '`maintainSum({ strategy: "normalize" })` repairs every proposal by rescaling the other bins, so the histogram is always a probability distribution. `pick: "nearest"` lets you grab a bin that has been squeezed to nothing.',
      uses: ['move({ pick: "nearest" })', 'maintainSum()', 'clamp()'],
      code: `const edges = d3.range(-4, 4, 1);
mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 52 },
  data: edges.map((x) => ({ x1: x, x2: x + 1, pct: 12.5 })),
  schema: {
    x1:  { type: "quantitative", domain: [-4, 4] },
    x2:  { type: "quantitative", domain: [-4, 4] },
    pct: { type: "quantitative", domain: [0, 60] },
  },
  constraints: [
    clamp({ field: "pct", min: 0, max: 60 }),
    maintainSum({ field: "pct", total: 100, strategy: "normalize" }),   //! always 100% in total
  ],
  axes: { x: {}, y: { grid: true, tickFormat: (d) => d + "%", title: "chance →" } },
  marks: [
    rectY({ fill: "#1f2937", stroke: "#fff", channels: {
      x1: { field: "x1" }, x2: { field: "x2" },
      y: { field: "pct", edit: move({ pick: "nearest", threshold: 60 }) },   //! grab the nearest bin
    } }),
  ],
}))`,
    },
  ],
});
