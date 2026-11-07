// Gallery entries — Observable Plot "Rule, Tick", "Geo", "Arrow, Link, Tree, Vector".
// See AUTHORING.md.

// ============================================================ Rule, Tick

GALLERY.add({
  id: 'plot-candlestick-chart',
  status: 'full',
  verdict: 'Two `ruleX` span marks over the same rows — High–Low wicks and a thick Open–Close body coloured by the sign of the day.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The body is a 4px rule with square caps; Plot rounds them (`strokeLinecap: "round"`).',
    'The up/down colour is a precomputed `dir` column, where Plot derives it inline from a function channel.',
  ],
  recreation: {
    code: `const ticker = (await plotData('aapl')).slice(-130)
  .map(d => ({ Date: d.Date, Open: d.Open, High: d.High, Low: d.Low, Close: d.Close,
               dir: String(Math.sign(d.Close - d.Open)) }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 12, bottom: 28, left: 60 },
  data: ticker,
  schema: {
    Date:  { type: 'temporal' },
    Open:  { type: 'quantitative' },
    High:  { type: 'quantitative' },
    Low:   { type: 'quantitative' },
    Close: { type: 'quantitative' },
    dir:   { type: 'categorical', domain: ['-1', '0', '1'] },
  },
  axes: { x: {}, y: { grid: true, title: '↑ Apple stock price ($)' } },
  marks: [
    ruleX({ stroke: '#333', channels: { x: { field: 'Date' }, y1: { field: 'Low' }, y2: { field: 'High' } } }),
    ruleX({
      strokeWidth: 4,
      channels: {
        x: { field: 'Date' }, y1: { field: 'Open' }, y2: { field: 'Close' },
        stroke: { field: 'dir', scale: { range: ['#e41a1c', '#333', '#4daf4a'] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast the week',
      question: 'Where will Apple stock trade on each of the next five trading days — the low, the high, and the close?',
      try: 'Drag a pink day’s low or high tick, or its close dot. The 20 real (black) days are locked.',
      why: 'The future rows carry `move()` on `Low`, `High` and `Close`, each its own mark over the same row. Two `ordering()` constraints keep every day’s close and open between its low and high, and `lock` freezes the observed days.',
      uses: ['move()', 'ordering()', 'lock'],
      code: `const real = (await plotData('aapl')).slice(-20)
  .map((d, i) => ({ day: i - 19, Open: d.Open, High: d.High, Low: d.Low, Close: d.Close, kind: 'actual' }));
const last = real[real.length - 1].Close;
const future = [1, 2, 3, 4, 5].map(day =>
  ({ day, Open: last, High: last + 3, Low: last - 3, Close: last, kind: 'forecast' }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 16, right: 12, bottom: 32, left: 60 },
  data: [...real, ...future],
  schema: {
    day:   { type: 'ordinal', domain: [...real, ...future].map(d => d.day) },
    Open:  { type: 'quantitative', domain: [140, 200] },
    High:  { type: 'quantitative', domain: [140, 200] },
    Low:   { type: 'quantitative', domain: [140, 200] },
    Close: { type: 'quantitative', domain: [140, 200] },
    kind:  { type: 'categorical', domain: ['actual', 'forecast'] },
  },
  lock: d => d.kind === 'actual',                                        //! the observed days are read-only
  constraints: [
    ordering({ field: ['Low', 'Close', 'High'] }),                       //! the close sits inside the day’s range
    ordering({ field: ['Low', 'Open', 'High'] }),
  ],
  axes: { x: { title: 'trading day (0 = today)' }, y: { grid: true, title: '↑ Apple stock price ($)' } },
  marks: [
    ruleX({ stroke: '#333', channels: { x: { field: 'day' }, y1: { field: 'Low' }, y2: { field: 'High' } } }),
    ruleX({ strokeWidth: 4, stroke: '#999', channels: { x: { field: 'day' }, y1: { field: 'Open' }, y2: { field: 'Close' } } }),
    tickY({ strokeWidth: 2, channels: { x: { field: 'day' }, y: { field: 'Low', edit: move() },    //! drag the low
      stroke: { field: 'kind', scale: { range: ['#333', '#d6336c'] } } } }),
    tickY({ strokeWidth: 2, channels: { x: { field: 'day' }, y: { field: 'High', edit: move() },   //! drag the high
      stroke: { field: 'kind', scale: { range: ['#333', '#d6336c'] } } } }),
    point({ size: 4, channels: { x: { field: 'day' }, y: { field: 'Close', edit: move() },
      fill: { field: 'kind', scale: { range: ['#333', '#d6336c'] } } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-band-chart-with-rule',
  status: 'full',
  verdict: 'One `ruleX` per day from `temp_min` to `temp_max`, stroked by `temp_min` on a blue–red diverging ramp pivoting at 0 °C, over a zero rule.',
  needs: [],
  prep: [],
  gaps: [
    'There is no named `BuRd` scheme, so the ramp is nine stops of `d3.interpolateRdBu` sampled in reverse and handed to a `diverging` scale as its `range`.',
    'Plot’s diverging scale is symmetric about 0, so its coldest nights stay pale; here each side of the pivot spans its own extent and the coldest night is full blue.',
  ],
  recreation: {
    code: `const seattle = await plotData('observablehq__plot-band-chart-with-rule', 'seattle-weather.csv');
const rows = seattle.map(d => ({ date: d.date, temp_min: d.temp_min, temp_max: d.temp_max }));
const BuRd = d3.quantize(t => d3.interpolateRdBu(1 - t), 9);   // RdBu, reversed

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 52 },
  data: rows,
  schema: {
    date:     { type: 'temporal' },
    temp_min: { type: 'quantitative' },
    temp_max: { type: 'quantitative' },
  },
  axes: { x: {}, y: { grid: true, title: '↑ Temperature (°C)' } },
  marks: [
    ruleY({ stroke: '#333', channels: { y: { datum: 0 } } }),
    ruleX({
      channels: {
        x: { field: 'date' }, y1: { field: 'temp_min' }, y2: { field: 'temp_max' },
        stroke: { field: 'temp_min', scale: { type: 'diverging', range: BuRd } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Brush each month',
      question: 'What is the typical daily temperature range in Seattle in each month — the usual low to the usual high?',
      try: 'Drag the top or bottom end of a month’s rule, or its middle to shift it.',
      why: 'The answer is drawn the recreation’s way: a thick `ruleX` span per month, stroked by its low on the same blue–red ramp. `brushSpan()` on the span makes both ends grabbable and the body movable, so one mark elicits two columns; drag an end past the other and the two values swap back into order when you let go.',
      uses: ['brushSpan()', 'ruleX'],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BuRd = d3.quantize(t => d3.interpolateRdBu(1 - t), 9);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 12, bottom: 28, left: 52 },
  data: months.map(m => ({ month: m, low: 5, high: 15 })),   // a flat prior to reshape
  schema: {
    month: { type: 'ordinal', domain: months },
    low:   { type: 'quantitative', domain: [-5, 35] },
    high:  { type: 'quantitative', domain: [-5, 35] },
  },
  axes: { x: {}, y: { grid: true, title: '↑ Temperature (°C)' } },
  marks: [
    ruleY({ stroke: '#333', channels: { y: { datum: 0 } } }),
    ruleX({
      strokeWidth: 18,
      channels: {
        x: { field: 'month' },
        y1: { field: 'low' },
        y2: { field: 'high' },
        stroke: { field: 'low', scale: { type: 'diverging', range: BuRd } },
      },
      edits: [brushSpan({ edgeInset: 8 })],                          //! drag an end or the body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-lollipop',
  status: 'full',
  verdict: 'A `ruleX` stem from zero plus a `point` head per letter — the composite Plot builds from a rule and a dot.',
  needs: [],
  prep: [],
  gaps: ['Plot’s `percent: true` is a `tickFormat` that multiplies by 100; the data stays a fraction.'],
  recreation: {
    code: `const alphabet = await plotData('alphabet');

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 16, right: 12, bottom: 28, left: 48 },
  data: alphabet,
  schema: {
    letter:    { type: 'categorical', domain: alphabet.map(d => d.letter) },
    frequency: { type: 'quantitative', domain: [0, 0.13] },
  },
  axes: { x: { tickSize: 0 }, y: { grid: true, title: '↑ frequency (%)', tickFormat: v => Math.round(v * 100) } },
  marks: [
    ruleX({ stroke: '#333', strokeWidth: 2, channels: { x: { field: 'letter' }, y2: { field: 'frequency' } } }),
    point({ size: 4, fill: '#333', channels: { x: { field: 'letter' }, y: { field: 'frequency' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag the heads',
      question: 'How often does each vowel appear in English text, as a share of all letters?',
      try: 'Drag a lollipop head up or down; the stem follows.',
      why: 'The head is a `point` carrying `move()` on `y`; the stem is an inert `ruleX` over the same field, so it re-derives on every render. `clamp()` keeps every share between 0 and 15%.',
      uses: ['composite', 'move()', 'clamp()'],
      code: `const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 16, right: 12, bottom: 28, left: 48 },
  data: vowels.map(letter => ({ letter, frequency: 0.04 })),
  schema: {
    letter:    { type: 'categorical', domain: vowels },
    frequency: { type: 'quantitative', domain: [0, 0.15] },
  },
  constraints: [clamp({ min: 0, max: 0.15 })],
  axes: { x: { tickSize: 0 }, y: { grid: true, title: '↑ frequency (%)', tickFormat: v => Math.round(v * 100) } },
  marks: [
    composite({
      parts: [
        ruleX({ stroke: '#333', strokeWidth: 2, channels: { x: { field: 'letter' }, y2: { field: 'frequency' } } }),
        point({ size: 7, fill: '#333',
          channels: { x: { field: 'letter' }, y: { field: 'frequency', edit: move() } } }),   //! the head is the handle
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-faceted-lollipop',
  status: 'partial',
  verdict: 'The lollipops (rule + point, coloured by age group) are reproduced; faceting is not covered by this study, so the six state facets are flattened into one band axis of state × age group, with state names drawn as text under each group.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'No `fx` facet: groups are a single categorical x axis of `state · age group` cells, so there is no gap between states and no per-facet axis label.',
    'States are sorted by total population in JS rather than by Plot’s `sort: { fx: "y", reduce: "sum" }`.',
  ],
  recreation: {
    code: `const population = await plotData('observablehq__plot-faceted-lollipop', 'us-state-population.csv');
const keys = d3.sort(new Set(population.map(d => d.key)), d => parseInt(d.match(/\\d+/)[0]));
const states = d3.groupSort(population, g => -d3.sum(g, d => d.population), d => d.state);
const rows = d3.sort(population, d => states.indexOf(d.state), d => keys.indexOf(d.key))
  .map(d => ({ ...d, cell: d.state + ' · ' + d.key }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 8, bottom: 26, left: 56 },
  data: rows,
  schema: {
    state:      { type: 'categorical', domain: states },
    key:        { type: 'ordinal', domain: keys },
    population: { type: 'quantitative', domain: [0, 11e6] },
    cell:       { type: 'categorical', domain: rows.map(d => d.cell) },
  },
  axes: { x: false, y: { grid: true, tickFormat: '~s', title: '↑ population' } },
  marks: [
    ruleY({ stroke: '#333', channels: { y: { datum: 0 } } }),
    ruleX({ strokeWidth: 3, channels: { x: { field: 'cell' }, y2: { field: 'population' },
      stroke: { field: 'key', scale: { scheme: 'warm' } } } }),
    point({ size: 4, channels: { x: { field: 'cell' }, y: { field: 'population' },
      fill: { field: 'key', scale: { scheme: 'warm' }, legend: true } } }),
    text({ fontSize: 11, dy: 14, channels: { x: { field: 'cell' }, y: { datum: 0 },
      text: { fn: d => d.key === keys[3] ? d.state : '' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Split the state',
      question: 'How is Texas’s population split across these seven age groups?',
      try: 'Drag a lollipop head; the others give way so the shares always total 100%.',
      why: '`maintainSum()` on the dataset turns seven independent drags into one allocation: raising one age group takes its share from the rest. The `point` carries `move()`; the stem is an inert `ruleX` on the same field.',
      uses: ['move()', 'maintainSum()'],
      code: `const keys = ['Under 5 Years', '5 to 13 Years', '14 to 17 Years', '18 to 24 Years',
              '25 to 44 Years', '45 to 64 Years', '65 Years and Over'];

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 8, bottom: 26, left: 40 },
  data: keys.map(key => ({ key, short: key.replace(' Years', '').replace(' and Over', '+'), share: 100 / 7 })),
  schema: {
    key:   { type: 'ordinal', domain: keys },
    short: { type: 'categorical' },
    share: { type: 'quantitative', domain: [0, 50] },
  },
  constraints: [maintainSum({ total: 100, strategy: 'redistribute' })],                  //! the seven shares always total 100%
  axes: { x: false, y: { grid: true } },
  marks: [
    ruleX({ strokeWidth: 3, channels: { x: { field: 'key' }, y2: { field: 'share' },
      stroke: { field: 'key', scale: { scheme: 'warm' } } } }),
    point({ size: 7, channels: { x: { field: 'key' },
      y: { field: 'share', edit: move() },                     //! drag a head
      fill: { field: 'key', scale: { scheme: 'warm' } } } }),
    text({ fontSize: 10, dy: 14, channels: { x: { field: 'key' }, y: { datum: 0 }, text: { field: 'short' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-bar-and-tick',
  status: 'full',
  verdict: 'A faint `barY` per letter with a `tickY` stroking its top, plus a zero rule.',
  needs: [],
  prep: [],
  gaps: ['Plot’s `percent: true` is a `tickFormat` that multiplies by 100; the data stays a fraction.'],
  recreation: {
    code: `const alphabet = await plotData('alphabet');

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 16, right: 12, bottom: 28, left: 48 },
  data: alphabet,
  schema: {
    letter:    { type: 'categorical', domain: alphabet.map(d => d.letter) },
    frequency: { type: 'quantitative', domain: [0, 0.13] },
  },
  axes: { x: {}, y: { grid: true, title: '↑ frequency (%)', tickFormat: v => Math.round(v * 100) } },
  marks: [
    barY({ fill: '#333', fillOpacity: 0.2, channels: { x: { field: 'letter' }, y: { field: 'frequency' } } }),
    tickY({ stroke: '#333', channels: { x: { field: 'letter' }, y: { field: 'frequency' } } }),
    ruleY({ stroke: '#333', channels: { y: { datum: 0 } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Ticks as targets',
      question: 'The bars show how common each letter is in English. How common do you think each one is in Spanish?',
      try: 'Press anywhere in a letter’s column and drag — the nearest tick follows.',
      why: 'The bars are inert reference; only the `tickY` carries an edit. `move({ pick: "nearest" })` claims the tick closest to the pointer, so you can grab a 1px target from anywhere in its column.',
      uses: ['move()', 'pick: "nearest"'],
      code: `const english = (await plotData('alphabet')).slice(0, 10);

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 16, right: 12, bottom: 28, left: 48 },
  data: english.map(d => ({ letter: d.letter, english: d.frequency, spanish: d.frequency })),
  schema: {
    letter:  { type: 'categorical', domain: english.map(d => d.letter) },
    english: { type: 'quantitative', domain: [0, 0.15] },
    spanish: { type: 'quantitative', domain: [0, 0.15] },
  },
  axes: { x: {}, y: { grid: true, title: '↑ frequency (%)', tickFormat: v => Math.round(v * 100) } },
  marks: [
    barY({ fill: '#333', fillOpacity: 0.15, channels: { x: { field: 'letter' }, y: { field: 'english' } } }),
    tickY({
      stroke: '#c2410c', strokeWidth: 3,
      channels: { x: { field: 'letter' },
        y: { field: 'spanish', edit: move({ pick: 'nearest' }) } },   //! the tick is the answer
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-barcode',
  status: 'full',
  verdict: 'One `tickX` per state × age group at that age group’s share of the state, with ages on a reversed band axis.',
  needs: [],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: ['Plot’s `normalizeX("sum", { z: "state" })` is computed in JS.', 'Plot’s `percent: true` is a `tickFormat` that multiplies by 100; the data stays a fraction.'],
  recreation: {
    code: `const wide = await plotData('observablehq__plot-barcode', 'us-population-state-age.csv');
const ages = Object.keys(wide[0]).slice(1);   // the age columns, in order
const rows = wide.flatMap(({ name, ...v }) => {
  const total = d3.sum(ages, a => v[a]);
  return ages.map(age => ({ state: name, age, share: v[age] / total }));
});

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 64 },
  data: rows,
  schema: {
    state: { type: 'categorical' },
    age:   { type: 'ordinal', domain: ages },
    share: { type: 'quantitative', domain: [0, 0.22] },
  },
  axes: { x: { grid: true, title: 'Population (%) →', tickFormat: v => Math.round(v * 100) },
          y: { title: '↑ Age (years)' } },
  marks: [
    ruleX({ stroke: '#333', channels: { x: { datum: 0 } } }),
    tickX({ stroke: '#333', strokeOpacity: 0.6, channels: { x: { field: 'share' }, y: { field: 'age' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place one state',
      question: 'Florida skews old. What share of Florida’s population falls in each age group? The grey ticks are the national shares.',
      try: 'Drag an orange tick left or right; the nine shares stay at 100%.',
      why: 'Each row is an age group with two columns: the national share (inert grey `tickX`) and your Florida guess (orange `tickX` with `move()`). `maintainSum` on `fl` makes every drag a reallocation.',
      uses: ['move()', 'maintainSum()'],
      code: `const wide = await plotData('observablehq__plot-barcode', 'us-population-state-age.csv');
const ages = Object.keys(wide[0]).slice(1);   // the age columns, in order
const nation = d3.sum(wide, d => d3.sum(ages, a => d[a]));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 12, bottom: 36, left: 64 },
  data: ages.map(age => ({ age, us: d3.sum(wide, d => d[age]) / nation, fl: 1 / ages.length })),
  schema: {
    age: { type: 'ordinal', domain: ages },
    us:  { type: 'quantitative', domain: [0, 0.25] },
    fl:  { type: 'quantitative', domain: [0, 0.25] },
  },
  constraints: [maintainSum({ field: 'fl', total: 1, strategy: 'redistribute' })],         //! Florida’s nine shares sum to 1
  axes: { x: { grid: true, title: 'Population (%) →', tickFormat: v => Math.round(v * 100) },
          y: { title: '↑ Age (years)' } },
  marks: [
    tickX({ stroke: '#bbb', strokeWidth: 2, channels: { x: { field: 'us' }, y: { field: 'age' } } }),
    tickX({ stroke: '#c2410c', strokeWidth: 3,
      channels: { x: { field: 'fl', edit: move() }, y: { field: 'age' } } }),   //! drag a tick
  ],
}));`
    },
  ],
});

GALLERY.add({
  id: 'plot-sorted-groups',
  status: 'full',
  verdict: 'A faint `tickX` per hourly count and a thick red `tickX` at each location’s median, with locations sorted by that median.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: [
    'The median and the sort are computed in JS (Plot’s `groupY({ x: "median" })` and `sort: { y: "x" }`), so the red ticks are a second table-free mark over precomputed rows.',
    'Values are divided by 1000 in JS rather than by an axis `transform`.',
  ],
  recreation: {
    code: `const traffic = await plotData('observablehq__plot-sorted-groups', 'traffic.csv');
const medians = d3.rollup(traffic, g => d3.median(g, d => d.vehicles) / 1000, d => d.location);
const order = d3.sort(medians.keys(), k => -medians.get(k));
const rows = traffic.map(d => ({ location: d.location, vehicles: d.vehicles / 1000, median: medians.get(d.location) }));

mount(Elicit({
  width: 480, height: 520,
  margins: { top: 8, right: 12, bottom: 36, left: 128 },
  data: rows,
  schema: {
    location: { type: 'categorical', domain: order },
    vehicles: { type: 'quantitative' },
    median:   { type: 'quantitative' },
  },
  axes: { x: { title: 'Vehicles per hour (thousands) →' }, y: {} },
  marks: [
    ruleX({ stroke: '#333', channels: { x: { datum: 0 } } }),
    tickX({ stroke: '#333', strokeOpacity: 0.3, channels: { x: { field: 'vehicles' }, y: { field: 'location' } } }),
    tickX({ stroke: 'red', strokeWidth: 4, channels: { x: { field: 'median' }, y: { field: 'location' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rank and place',
      question: 'Which of these six German traffic counters is busiest, and roughly how many vehicles pass it in a typical hour?',
      try: 'Drag a row up or down to reorder it; drag its red tick sideways to set the median.',
      why: 'One `tickX` carries two edits that read different components of the drag: `rank()` on `y` reorders the rows, `move()` on `x` sets the value. Nothing about the order is implied by the values — the ranking is its own answer.',
      uses: ['rank()', 'move()'],
      code: `const places = ['Köln-Nord', 'Hürth', 'Lotte', 'Bockel', 'Nettersheim', 'Hagen-Vorhalle'];

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 8, right: 16, bottom: 36, left: 112 },
  data: places.map((location, i) => ({ location, rank: i + 1, median: 2 })),
  schema: {
    location: { type: 'categorical', domain: places },
    rank:     { type: 'ordinal', domain: [6, 5, 4, 3, 2, 1] },   // 1 at the top
    median:   { type: 'quantitative', domain: [0, 6] },
  },
  axes: { x: { title: 'Vehicles per hour (thousands) →' }, y: false },
  marks: [
    tickX({
      stroke: 'red', strokeWidth: 4,
      channels: {
        x: { field: 'median', edit: move({ channels: ['x'] }) },   //! sideways: the median
        y: { field: 'rank', edit: rank() },                        //! up/down: the ranking
      },
    }),
    text({ fontSize: 12, textAnchor: 'end',
      channels: { x: { value: -8 }, y: { field: 'rank' }, text: { field: 'location' } } }),
  ],
}));`,
    },
  ],
});

// ============================================================ Geo

GALLERY.add({
  id: 'plot-floor-plan',
  status: 'full',
  verdict: 'The house plan is planar GeoJSON, so `geoBasemap` draws it under an identity projection fitted to the same object.',
  needs: [],
  prep: [],
  gaps: ['The identity projection is a live `d3.geoIdentity()` fitted by hand: `{ type: "identity", domain }` works too, but its spherical ring-winding check misreads the planar rings and warns.'],
  recreation: {
    code: `const westport = await plotData('observablehq__plot-floor-plan', 'westport-house.json');

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 8, right: 8, bottom: 8, left: 8 },
  // A live d3.geoIdentity, fitted by hand: a planar plan has no ring winding to check.
  projection: d3.geoIdentity().fitExtent([[0, 0], [464, 284]], westport),
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: westport, fill: 'none', stroke: '#333', strokeWidth: 1 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the router',
      question: 'Where in this house would you put a single Wi-Fi router so that every room gets a usable signal?',
      try: 'Drag the pin. The answer is in plan coordinates.',
      why: 'Under an `identity` projection lon/lat are just plan coordinates, so `edit.geo.move()` inverts the pointer straight into the floor plan’s own units.',
      uses: ['edit.geo.move()', 'projection: identity'],
      code: `const westport = await plotData('observablehq__plot-floor-plan', 'westport-house.json');

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 8, right: 8, bottom: 8, left: 8 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [464, 284]], westport),   //! plan units in, plan units out
  data: [{ x: 200, y: 150 }],
  schema: {
    x: { type: 'quantitative' },
    y: { type: 'quantitative' },
  },
  marks: [
    geoBasemap({ geojson: westport, fill: '#fafafa', stroke: '#333', strokeWidth: 1 }),
    geoPoint({
      size: 9, fill: '#2563eb', stroke: '#fff', strokeWidth: 2,
      channels: { lon: { field: 'x' }, lat: { field: 'y' } },
      edits: [edit.geo.move()],                                    //! drag the router
    }),
  ],
}));`,
    },
    {
      title: 'Draw the way out',
      question: 'If a fire started in the kitchen, which way would you walk to get out?',
      try: 'Drag across the plan to sketch your route.',
      why: '`edit.geo.draw()` turns one drag into a row whose `coordinates` column holds the whole path, sampled as you move.',
      uses: ['edit.geo.draw()'],
      code: `const westport = await plotData('observablehq__plot-floor-plan', 'westport-house.json');

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 8, right: 8, bottom: 8, left: 8 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [464, 284]], westport),
  data: [],
  schema: { coordinates: { type: 'categorical' } },
  marks: [
    geoBasemap({ geojson: westport, fill: '#fafafa', stroke: '#333', strokeWidth: 1 }),
    geoLine({
      stroke: '#dc2626', strokeWidth: 3,
      channels: { coordinates: { field: 'coordinates', scale: null } },
      edits: [edit.geo.draw()],                                    //! one drag = one route
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-polar-projection',
  status: 'full',
  verdict: 'A live `d3.geoAzimuthalEquidistant()` (rotated to the pole, clipped at 40°) is passed as the chart projection; graticule and land are two `geoBasemap` layers.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [
    'The projection is configured with the chart’s inner size by hand, where Plot hands its projection function `{ width, height }`.',
    'No frame around the plot.',
  ],
  recreation: {
    code: `const world = await plotData('observablehq__plot-polar-projection', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const size = 460;

mount(Elicit({
  width: size, height: size,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  projection: d3.geoAzimuthalEquidistant()
    .rotate([0, 90]).translate([size / 2, size / 2]).scale(size).clipAngle(40),
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ccc', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#333', stroke: 'none' }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the ice edge',
      question: 'Where do you think the edge of the Antarctic sea ice sits at its September maximum?',
      try: 'Drag around Antarctica to sketch the ice edge. Draw again to add another line.',
      why: '`edit.geo.draw()` inverts every sampled pointer position through the polar projection, so the line you draw comes back as longitude/latitude pairs.',
      uses: ['edit.geo.draw()', 'projection'],
      code: `const world = await plotData('observablehq__plot-polar-projection', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const size = 420;

mount(Elicit({
  width: size, height: size,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  projection: d3.geoAzimuthalEquidistant()
    .rotate([0, 90]).translate([size / 2, size / 2]).scale(size).clipAngle(40),
  data: [],
  schema: { coordinates: { type: 'categorical' } },
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ccc', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#bbb', stroke: 'none' }),
    geoLine({
      stroke: '#0284c7', strokeWidth: 3, curve: 'catmullRom',
      channels: { coordinates: { field: 'coordinates', scale: null } },
      edits: [edit.geo.draw({ minDist: 6 })],                      //! sketch the edge in lon/lat
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-map-small-multiples',
  status: 'partial',
  verdict: 'The nation, state mesh and every store are drawn under an Albers projection; faceting is not covered by this study, so the five decade facets collapse into one map with stores coloured by decade.',
  needs: ['facet'],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [
    'One map instead of five side-by-side decade panels (no `fx` facet); the decade is a colour instead.',
    'The projection is fitted to the lower 48 states, since fitting the whole nation (with Alaska) would shrink the map.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-map-small-multiples', 'us-counties-10m.json');
const walmarts = await plotData('observablehq__plot-map-small-multiples', 'walmarts.tsv');
const nation = topojson.feature(us, us.objects.nation);
const statemesh = topojson.mesh(us, us.objects.states);
const lower48 = { type: 'FeatureCollection', features: topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };   // the lower 48 + DC
const decades = ['1960s', '1970s', '1980s', '1990s', '2000s'];
const rows = walmarts.map(d => ({ lon: d.longitude, lat: d.latitude,
  decade: Math.floor(d.date.getUTCFullYear() / 10) * 10 + 's' }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers', domain: lower48 },
  data: rows,
  schema: {
    lon: { type: 'quantitative' },
    lat: { type: 'quantitative' },
    decade: { type: 'ordinal', domain: decades },
  },
  marks: [
    geoBasemap({ geojson: statemesh, fill: 'none', stroke: '#333', strokeWidth: 0.4 }),
    geoBasemap({ geojson: nation, fill: 'none', stroke: '#333', strokeWidth: 1 }),
    geoPoint({ size: 1.2, channels: { lon: { field: 'lon' }, lat: { field: 'lat' },
      fill: { field: 'decade', scale: { scheme: 'viridis' }, legend: true } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Pin the first stores',
      question: 'Walmart opened its first stores in the 1960s. Where do you think the first five were?',
      try: 'Click the map to drop a pin (up to five); drag a pin to adjust it.',
      why: '`edit.geo.create()` mints a row at the clicked longitude/latitude and `edit.geo.move()` drags it. `count({ max: 5 })` caps the answer at five stores.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'count()'],
      code: `const us = await plotData('observablehq__plot-map-small-multiples', 'us-counties-10m.json');
const states = topojson.feature(us, us.objects.states);
const lower48 = { type: 'FeatureCollection',
  features: states.features.filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };   // the lower 48 + DC

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers', domain: lower48 },
  data: [],
  schema: {
    lon: { type: 'quantitative', domain: [-125, -66] },
    lat: { type: 'quantitative', domain: [24, 50] },
  },
  constraints: [count({ max: 5 })],                               //! five stores, no more
  marks: [
    geoBasemap({ geojson: lower48, fill: '#f4f4f4', stroke: '#999', strokeWidth: 0.5 }),
    geoPoint({
      size: 6, fill: '#0071ce', stroke: '#fff', strokeWidth: 1.5,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.create(), edit.geo.move()],                 //! click to add, drag to adjust
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-projection-domain',
  status: 'partial',
  verdict: 'The rotated azimuthal-equidistant projection fitted to a `d3.geoCircle` domain, with graticule, land and the red circle, is reproduced for one fixed radius; the radius slider is not.',
  needs: ['input-widgets'],
  prep: ['prep-geo'],
  gaps: ['The radius is a constant (30°); the original’s range input re-fits the projection live.', 'No frame.'],
  recreation: {
    code: `const world = await plotData('observablehq__plot-projection-domain', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const circle = d3.geoCircle().center([9, 34]).radius(30).precision(2)();

mount(Elicit({
  width: 420, height: 420,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  projection: { type: 'azimuthal-equidistant', rotate: [-9, -34], clipAngle: 90, domain: circle, inset: 10 },
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ccc', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#333', stroke: 'none', opacity: 0.3 }),
    geoBasemap({ geojson: circle, fill: 'none', stroke: 'red', strokeWidth: 2 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Name the cities',
      question: 'Which major cities lie within 3,000 km of Tunis (the red circle)? Mark three and name them.',
      try: 'Click to add a pin, drag it into place, then double-click its label to type the city.',
      why: 'A `geoPoint` and a `geoText` read the same rows: the point carries `edit.geo.create()` and `edit.geo.move()`, the label carries `editText()`. `count({ max: 3 })` keeps the answer to three cities.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'editText()', 'count()'],
      code: `const world = await plotData('observablehq__plot-projection-domain', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const circle = d3.geoCircle().center([9, 34]).radius(27).precision(2)();   // ≈ 3,000 km

mount(Elicit({
  width: 420, height: 420,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  projection: { type: 'azimuthal-equidistant', rotate: [-9, -34], clipAngle: 90, domain: circle, inset: 10 },
  data: [],
  schema: {
    lon:  { type: 'quantitative', domain: [-180, 180] },
    lat:  { type: 'quantitative', domain: [-90, 90] },
    city: { type: 'categorical', open: true },
  },
  constraints: [count({ max: 3 })],                               //! three cities
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ddd', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#ccc', stroke: 'none' }),
    geoBasemap({ geojson: circle, fill: 'none', stroke: 'red', strokeWidth: 2 }),
    geoPoint({
      size: 6, fill: '#111', stroke: '#fff', strokeWidth: 1.5,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.create({ defaults: { city: 'city?' } }), edit.geo.move()],   //! click to add a pin
    }),
    geoText({
      dy: -12, fontSize: 12,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' }, text: { field: 'city' } },
      edits: [editText()],                                          //! double-click to name it
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-albers-usa-projection',
  status: 'full',
  verdict: 'The nation outline and a faint state mesh, both `geoBasemap` layers under the `albers-usa` composite projection.',
  needs: [],
  prep: ['prep-geo'],
  gaps: ['Plot fits albers-usa to the frame by default; here the projection is fitted to the nation outline.'],
  recreation: {
    code: `const us = await plotData('observablehq__plot-albers-usa-projection', 'us-counties-10m.json');
const nation = topojson.feature(us, us.objects.nation);
const statemesh = topojson.mesh(us, us.objects.states);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: nation },
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: nation, fill: 'none', stroke: '#333', strokeWidth: 1 }),
    geoBasemap({ geojson: statemesh, fill: 'none', stroke: 'rgba(0,0,0,0.2)', strokeWidth: 1 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Colour the states',
      question: 'After the 2030 census, which states do you think will gain a House seat, and which will lose one?',
      try: 'Click a state to cycle it: no change → gain → lose.',
      why: 'Each state is a row whose `geometry` column holds its shape; `cycle()` on the `fill` channel steps the `seats` column through its declared domain.',
      uses: ['cycle()', 'geoPolygon'],
      code: `const us = await plotData('observablehq__plot-albers-usa-projection', 'us-counties-10m.json');
const nation = topojson.feature(us, us.objects.nation);
const states = topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60')
  .map(f => ({ name: f.properties.name, geometry: f.geometry, seats: 'no change' }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: nation },
  data: states,
  schema: {
    name:     { type: 'categorical' },
    geometry: { type: 'categorical' },
    seats:    { type: 'categorical', domain: ['no change', 'gain', 'lose'] },
  },
  marks: [
    geoPolygon({
      stroke: '#fff', strokeWidth: 0.8,
      channels: {
        geometry: { field: 'geometry', scale: null },
        fill: { field: 'seats', scale: { range: ['#e5e7eb', '#16a34a', '#dc2626'] },
                legend: true, edit: cycle() },                       //! click a state to cycle it
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-world-projections',
  status: 'partial',
  verdict: 'Graticule, land and sphere outline under any named projection are reproduced, but only for one projection at a time: the dropdown that switches it is not.',
  needs: ['input-widgets'],
  prep: ['prep-geo'],
  gaps: ['The projection is fixed (equirectangular, the original’s default); change the `type` string to see another.'],
  recreation: {
    code: `const world = await plotData('observablehq__plot-world-projections', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'equirectangular', domain: { type: 'Sphere' } },
  data: [],
  schema: {},
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ccc', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#333', stroke: 'none' }),
    geoBasemap({ geojson: { type: 'Sphere' }, fill: 'none', stroke: '#333', strokeWidth: 1 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the flight',
      question: 'On this flat map, what path does the shortest flight from New York to Singapore follow?',
      try: 'Drag from New York (left pin) to Singapore (right pin) to sketch the route.',
      why: '`edit.geo.draw()` records the drag as longitude/latitude, so the answer can be scored against the true great circle — which on an equirectangular map arcs far up over the Arctic.',
      uses: ['edit.geo.draw()'],
      code: `const world = await plotData('observablehq__plot-world-projections', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const cities = { type: 'MultiPoint', coordinates: [[-74, 40.7], [103.8, 1.35]] };

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'equirectangular', domain: { type: 'Sphere' } },
  data: [],
  schema: { coordinates: { type: 'categorical' } },
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#ddd', strokeWidth: 0.6 }),
    geoBasemap({ geojson: land, fill: '#bbb', stroke: 'none' }),
    geoBasemap({ geojson: cities, fill: '#dc2626', stroke: '#fff' }),
    geoLine({
      stroke: '#dc2626', strokeWidth: 2.5, curve: 'catmullRom',
      channels: { coordinates: { field: 'coordinates', scale: null } },
      edits: [edit.geo.draw({ minDist: 8 })],                      //! the drag becomes a lon/lat path
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-earthquake-globe',
  status: 'partial',
  verdict: 'The orthographic globe with land, sphere outline and a dot per earthquake sized by amplitude is reproduced at one rotation; the longitude slider is not.',
  needs: ['input-widgets'],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [
    'The globe’s rotation is fixed (longitude 90°); the original rotates with a range input.',
    'Data is the live USGS weekly feed, as in the original, so the dots change from week to week.',
    'Dots are clipped to the frame rather than allowed to overflow it.',
  ],
  recreation: {
    code: `const world = await plotData('observablehq__plot-earthquake-globe', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const feed = await d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
const quakes = feed.features.map(f => {
  const [lon, lat] = d3.geoCentroid(f);
  return { lon, lat, amplitude: Math.pow(10, f.properties.mag) };   // Richter → amplitude
});

mount(Elicit({
  width: 420, height: 420,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  projection: { type: 'orthographic', rotate: [-90, -30], domain: { type: 'Sphere' } },
  data: quakes,
  schema: {
    lon: { type: 'quantitative' },
    lat: { type: 'quantitative' },
    amplitude: { type: 'quantitative' },
  },
  marks: [
    geoBasemap({ geojson: land, fill: 'rgba(0,0,0,0.2)', stroke: 'none' }),
    geoBasemap({ geojson: { type: 'Sphere' }, fill: 'none', stroke: '#333' }),
    geoPoint({
      stroke: 'red', fill: 'red', fillOpacity: 0.2,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' },
        size: { field: 'amplitude', scale: { type: 'sqrt', range: [0, 24] } } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast the quakes',
      question: 'Where on this side of the globe do you expect next week’s three strongest earthquakes?',
      try: 'Click the globe to drop a pin (three at most); drag a pin to move it.',
      why: 'The orthographic projection inverts every point on the visible hemisphere, so `edit.geo.create()` and `edit.geo.move()` work on the globe exactly as on a flat map. `count({ max: 3 })` caps the answer.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'count()'],
      code: `const world = await plotData('observablehq__plot-earthquake-globe', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  projection: { type: 'orthographic', rotate: [-150, -10], domain: { type: 'Sphere' } },
  data: [],
  schema: {
    lon: { type: 'quantitative', domain: [-180, 180] },
    lat: { type: 'quantitative', domain: [-90, 90] },
  },
  constraints: [count({ max: 3 })],                               //! three quakes
  marks: [
    geoBasemap({ geojson: d3.geoGraticule10(), fill: 'none', stroke: '#eee' }),
    geoBasemap({ geojson: land, fill: '#ddd', stroke: 'none' }),
    geoBasemap({ geojson: { type: 'Sphere' }, fill: 'none', stroke: '#333' }),
    geoPoint({
      size: 9, stroke: 'red', fill: 'red', fillOpacity: 0.3,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.create(), edit.geo.move()],                 //! pins on a globe
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-hexbin-map',
  status: 'partial',
  verdict: 'The map and the binned dots — sized by store count, coloured by first opening year on the spectral scheme — draw correctly. Hexagonal binning is out of scope for an elicitation library, so it is written by hand in JS against a projection fitted by hand.',
  needs: ['hexbin'],
  prep: ['prep-geo', 'prep-bin', 'prep-aggregate'],
  gaps: [
    'No hexbin transform: points are projected, snapped to a 20px hexagonal grid and inverted back to lon/lat in JS (the d3-hexbin algorithm, inlined).',
    'The projection is a live `d3.geoAlbers()` fitted to the chart’s inner size by hand, so the bins and the map share pixel space.',
    'Bins are drawn as circles: `shape` draws a hexagon on x/y scales, but a projection chart takes only `geo*` marks, and `geoPoint` has no symbol channel.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-hexbin-map', 'us-counties-10m.json');
const walmarts = await plotData('observablehq__plot-hexbin-map', 'walmarts.tsv');
const nation = topojson.feature(us, us.objects.nation);
const statemesh = topojson.mesh(us, us.objects.states);
const lower48 = { type: 'FeatureCollection', features: topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };
const proj = d3.geoAlbers().fitExtent([[0, 0], [472, 232]], lower48);   // the plot area below the legend

// Hexagonal binning in pixel space (d3-hexbin's algorithm), binWidth 20px.
function hexbin(points, width = 20) {
  const r = width / Math.sqrt(3), dx = width, dy = r * 1.5, bins = new Map();
  for (const p of points) {
    let py = p.y / dy, pj = Math.round(py), px = p.x / dx - (pj & 1) / 2, pi = Math.round(px);
    const py1 = py - pj;
    if (Math.abs(py1) * 3 > 1) {
      const px1 = px - pi, pi2 = pi + (px < pi ? -1 : 1) / 2, pj2 = pj + (py < pj ? -1 : 1);
      const px2 = px - pi2, py2 = py - pj2;
      if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) { pi = pi2 + (pj & 1 ? 1 : -1) / 2; pj = pj2; }
    }
    const key = pi + ',' + pj;
    if (!bins.has(key)) bins.set(key, { x: (pi + (pj & 1) / 2) * dx, y: pj * dy, rows: [] });
    bins.get(key).rows.push(p);
  }
  return [...bins.values()];
}
const pts = walmarts.map(d => { const [x, y] = proj([d.longitude, d.latitude]) || []; return { x, y, year: d.date.getUTCFullYear() }; })
  .filter(p => p.x != null);
const bins = hexbin(pts).map(b => {
  const [lon, lat] = proj.invert([b.x, b.y]);
  return { lon, lat, count: b.rows.length, first: d3.min(b.rows, p => p.year) };
});

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: proj,
  data: bins,
  schema: {
    lon: { type: 'quantitative' },
    lat: { type: 'quantitative' },
    count: { type: 'quantitative', domain: [0, d3.max(bins, d => d.count)] },
    first: { type: 'quantitative', domain: d3.extent(bins, d => d.first) },
  },
  marks: [
    geoBasemap({ geojson: statemesh, fill: 'none', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 0.5 }),
    geoBasemap({ geojson: nation, fill: 'none', stroke: '#333', strokeWidth: 1 }),
    geoPoint({ channels: { lon: { field: 'lon' }, lat: { field: 'lat' },
      size: { field: 'count', scale: { type: 'sqrt', range: [0, 16] } },
      fill: { field: 'first', scale: { scheme: 'spectral' },
        legend: { anchor: 'top', title: 'First year opened', tickFormat: 'd' } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Size the bins',
      question: 'Walmart grew outward from Arkansas. Roughly how many stores do you think opened in each of these regions by 2006?',
      try: 'Drag a circle’s rim outward or inward to grow or shrink it.',
      why: 'The circle’s `size` channel carries `slide()`, which reads the drag’s vertical component relative to where you pressed, so the circle resizes in place instead of jumping. A `sqrt` scale keeps area proportional to count.',
      uses: ['slide()', 'size channel'],
      code: `const us = await plotData('observablehq__plot-hexbin-map', 'us-counties-10m.json');
const lower48 = { type: 'FeatureCollection', features: topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers', domain: lower48 },
  data: [
    { region: 'Arkansas', lon: -92.4, lat: 34.8, stores: 50 },
    { region: 'Texas', lon: -97.5, lat: 31.5, stores: 50 },
    { region: 'Florida', lon: -81.7, lat: 28.4, stores: 50 },
    { region: 'Ohio Valley', lon: -84.5, lat: 39.5, stores: 50 },
    { region: 'California', lon: -119.5, lat: 36.5, stores: 50 },
    { region: 'Northeast', lon: -74.5, lat: 41.5, stores: 50 },
  ],
  schema: {
    region: { type: 'categorical' },
    lon: { type: 'quantitative' },
    lat: { type: 'quantitative' },
    stores: { type: 'quantitative', domain: [0, 400] },
  },
  marks: [
    geoBasemap({ geojson: lower48, fill: '#f4f4f4', stroke: '#bbb', strokeWidth: 0.5 }),
    geoPoint({
      fill: '#0071ce', fillOpacity: 0.5, stroke: '#0071ce',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' },
        size: { field: 'stores', scale: { type: 'sqrt', range: [0, 30] },
                edit: slide({ axis: 'y', extent: 120 }) } },                  //! drag up to grow
    }),
    geoText({ fontSize: 10, dy: 0, channels: { lon: { field: 'lon' }, lat: { field: 'lat' },
      text: { field: 'stores' } }, format: 'd' }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-centroid-hexbin',
  status: 'partial',
  verdict: 'County centroids binned into 20px hexagons, each drawn as a hollow hexagon `shape` sized by count. Hexagonal binning is out of scope for an elicitation library, so the centroids and the bins are computed by hand in JS.',
  needs: ['hexbin'],
  prep: ['prep-geo', 'prep-bin'],
  gaps: [
    'No `hexbin` transform or `geoCentroid` transform: `d3.geoCentroid` gives each county’s centroid and an inlined d3-hexbin bins them in the pixel space of a hand-fitted `d3.geoAlbers()`.',
    'With no basemap to share a projection with, the bins are plain x/y pixel positions (y running down), so the hexagons can be a cartesian `shape`.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-centroid-hexbin', 'us-counties-10m.json');
const counties = topojson.feature(us, us.objects.counties).features;
const lower48 = { type: 'FeatureCollection', features: topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };
const proj = d3.geoAlbers().fitExtent([[0, 0], [472, 292]], lower48);

function hexbin(points, width = 20) {          // d3-hexbin's algorithm, in pixels
  const r = width / Math.sqrt(3), dx = width, dy = r * 1.5, bins = new Map();
  for (const p of points) {
    let py = p.y / dy, pj = Math.round(py), px = p.x / dx - (pj & 1) / 2, pi = Math.round(px);
    const py1 = py - pj;
    if (Math.abs(py1) * 3 > 1) {
      const px1 = px - pi, pi2 = pi + (px < pi ? -1 : 1) / 2, pj2 = pj + (py < pj ? -1 : 1);
      const px2 = px - pi2, py2 = py - pj2;
      if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) { pi = pi2 + (pj & 1 ? 1 : -1) / 2; pj = pj2; }
    }
    const key = pi + ',' + pj;
    if (!bins.has(key)) bins.set(key, { x: (pi + (pj & 1) / 2) * dx, y: pj * dy, n: 0 });
    bins.get(key).n++;
  }
  return [...bins.values()];
}
const pts = counties.filter(f => f.id < '60' && !['02', '15'].includes(f.id.slice(0, 2)))   // the lower 48
  .map(f => proj(d3.geoCentroid(f))).map(([x, y]) => ({ x, y }));
const bins = hexbin(pts).map(b => ({ x: b.x, y: b.y, count: b.n }));
const hexagon = 'M0,-1L0.866,-0.5L0.866,0.5L0,1L-0.866,0.5L-0.866,-0.5Z';   // pointy-top, as d3-hexbin

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  axes: false,
  data: bins,
  schema: {
    x: { type: 'quantitative', domain: [0, 472] },               // the projection's pixels
    y: { type: 'quantitative', domain: [292, 0] },
    count: { type: 'quantitative', domain: [0, d3.max(bins, d => d.count)] },
  },
  marks: [
    shape({ path: hexagon, fill: 'none', stroke: '#333', channels: { x: { field: 'x' }, y: { field: 'y' },
      size: { field: 'count', scale: { type: 'sqrt', range: [0, 11.5] } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Brush the dense band',
      question: 'Counties are small where settlement is old and dense. Box the stretch of the country where you think counties are packed most tightly.',
      try: 'Drag the box’s edges or corners to reshape it, or its middle to move it.',
      why: '`edit.geo.brush()` writes a box as four lon/lat columns (`west`, `south`, `east`, `north`); edges, corners and body are separate grab zones fixed for the whole gesture.',
      uses: ['edit.geo.brush()', 'geoRect'],
      code: `const us = await plotData('observablehq__plot-centroid-hexbin', 'us-counties-10m.json');
const lower48 = { type: 'FeatureCollection', features: topojson.feature(us, us.objects.states).features
  .filter(f => f.id < '60' && !['02', '15'].includes(f.id)) };

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers', domain: lower48 },
  data: [{ west: -100, south: 33, east: -90, north: 40 }],
  schema: {
    west:  { type: 'quantitative', domain: [-125, -66] },
    south: { type: 'quantitative', domain: [24, 50] },
    east:  { type: 'quantitative', domain: [-125, -66] },
    north: { type: 'quantitative', domain: [24, 50] },
  },
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.counties), fill: 'none', stroke: '#ccc', strokeWidth: 0.3 }),
    geoBasemap({ geojson: lower48, fill: 'none', stroke: '#666', strokeWidth: 0.6 }),
    geoRect({
      fill: 'rgba(220, 38, 38, 0.15)', stroke: '#dc2626', strokeWidth: 1.5,
      channels: { west: { field: 'west' }, south: { field: 'south' }, east: { field: 'east' }, north: { field: 'north' } },
      edits: [edit.geo.brush({ edgeInset: 10 })],                  //! edges resize, the body moves
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-centroid-dot',
  status: 'full',
  verdict: 'One hollow `geoPoint` per county at its `d3.geoCentroid`, under `albers-usa`.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [
    'Centroids are spherical (`d3.geoCentroid`, Plot’s `geoCentroid` transform); the notebook’s first map uses the planar `centroid` initializer, which differs by a pixel at most.',
    'The notebook’s second and third maps (the comparison) are not reproduced.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-centroid-dot', 'us-counties-10m.json');
const counties = topojson.feature(us, us.objects.counties).features;
const rows = counties.map(f => { const [lon, lat] = d3.geoCentroid(f); return { lon, lat }; });

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: rows,
  schema: { lon: { type: 'quantitative' }, lat: { type: 'quantitative' } },
  marks: [
    geoPoint({ size: 2, fill: 'none', stroke: '#333', strokeWidth: 0.8,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Thin the counties',
      question: 'This map shows 40 county centroids at random. Remove the ones you think are in states with fewer than 20 counties.',
      try: 'Alt-click (Option-click) a dot to remove it.',
      why: '`remove({ when: when.alt })` deletes the clicked row, and the modifier keeps an accidental click from deleting anything. The answer is the rows that survive.',
      uses: ['remove()', 'when.alt'],
      code: `const us = await plotData('observablehq__plot-centroid-dot', 'us-counties-10m.json');
const counties = topojson.feature(us, us.objects.counties).features.filter(f => f.id < '60');
const sample = d3.shuffler(d3.randomLcg(7))(counties.slice()).slice(0, 40);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: sample.map(f => { const [lon, lat] = d3.geoCentroid(f); return { county: f.properties.name, lon, lat }; }),
  schema: { county: { type: 'categorical' }, lon: { type: 'quantitative' }, lat: { type: 'quantitative' } },
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states), fill: 'none', stroke: '#bbb', strokeWidth: 0.6 }),
    geoPoint({ size: 5, fill: '#333', stroke: '#fff',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [remove({ when: when.alt })] }),                       //! Alt-click removes a county
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-state-labels',
  status: 'full',
  verdict: 'The state mesh plus a `geoText` at each state’s centroid, under `albers-usa`.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [
    'No white halo behind the labels (Plot’s `stroke: "white"` on text draws one).',
    'Centroids are spherical (`d3.geoCentroid`) rather than Plot’s planar `centroid`.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-state-labels', 'us-counties-10m.json');
const states = topojson.feature(us, us.objects.states).features;
const rows = states.map(f => { const [lon, lat] = d3.geoCentroid(f); return { name: f.properties.name, lon, lat }; });

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: rows,
  schema: { name: { type: 'categorical' }, lon: { type: 'quantitative' }, lat: { type: 'quantitative' } },
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states), fill: 'none', stroke: '#333', strokeWidth: 0.6 }),
    geoText({ fontSize: 7, fill: '#111',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' }, text: { field: 'name' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the names',
      question: 'Drag each state name onto the state it belongs to.',
      try: 'Drag a dot; its label rides along.',
      why: 'A `geoPoint` and a `geoText` read the same rows. Only the point carries `edit.geo.move()`, so the label is pointer-transparent and follows on the next render.',
      uses: ['edit.geo.move()', 'geoText'],
      code: `const us = await plotData('observablehq__plot-state-labels', 'us-counties-10m.json');
const names = ['Wyoming', 'Vermont', 'Delaware', 'Iowa', 'Arkansas', 'Idaho'];

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: names.map((name, i) => ({ name, lon: -99, lat: 46 - i * 2.6 })),   // a column in the middle
  schema: { name: { type: 'categorical' }, lon: { type: 'quantitative' }, lat: { type: 'quantitative' } },
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.states), fill: '#f4f4f4', stroke: '#999', strokeWidth: 0.6 }),
    geoPoint({ size: 5, fill: '#2563eb', stroke: '#fff',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.move()] }),                                  //! drag the dot
    geoText({ fontSize: 11, dx: 8, textAnchor: 'start', fill: '#111',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' }, text: { field: 'name' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-state-centroids',
  status: 'full',
  verdict: 'Faint state outlines with a hover `tip` naming each state, the nation outline and a red `geoPoint` at every state’s centroid, under `albers-usa`.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [
    'Centroids are spherical (`d3.geoCentroid`).',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-state-centroids', 'us-counties-10m.json');
const nation = topojson.feature(us, us.objects.nation);
const states = topojson.feature(us, us.objects.states);
const rows = states.features.map(f => {
  const [lon, lat] = d3.geoCentroid(f);
  return { name: f.properties.name, lon, lat, geometry: f.geometry };
});

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: nation },
  data: rows,
  schema: {
    name: { type: 'categorical' }, lon: { type: 'quantitative' }, lat: { type: 'quantitative' },
    geometry: { type: 'categorical' },
  },
  marks: [
    geoPolygon({ fill: 'none', stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, tip: ['name'],   // the tip is on the state shape
      channels: { geometry: { field: 'geometry', scale: null } } }),
    geoBasemap({ geojson: nation, fill: 'none', stroke: '#333', strokeWidth: 1 }),
    geoPoint({ size: 3, fill: 'red', stroke: 'white',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Find the centre',
      question: 'Where is the geographic centre of the contiguous United States?',
      try: 'Drag the red pin to where you think the centre is.',
      why: 'A single seeded row with `edit.geo.move()` is the simplest map question there is: the answer is one longitude/latitude pair, scorable against the official centre near Lebanon, Kansas.',
      uses: ['edit.geo.move()'],
      code: `const us = await plotData('observablehq__plot-state-centroids', 'us-counties-10m.json');
const nation = topojson.feature(us, us.objects.nation);

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: nation },
  data: [{ lon: -85, lat: 34 }],                                     //! one row, one answer
  schema: { lon: { type: 'quantitative', domain: [-125, -66] }, lat: { type: 'quantitative', domain: [24, 50] } },
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.states), fill: '#f4f4f4', stroke: '#bbb', strokeWidth: 0.6 }),
    geoPoint({ size: 8, fill: 'red', stroke: 'white', strokeWidth: 2,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.move()] }),                                  //! drag the pin
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-v-counties',
  status: 'full',
  verdict: 'County and state meshes, plus a dot and a label at the centroid of every county whose name starts with V.',
  needs: [],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: ['No white halo behind the labels.', 'Centroids are spherical (`d3.geoCentroid`).'],
  recreation: {
    code: `const us = await plotData('observablehq__plot-v-counties', 'us-counties-10m.json');
const vs = topojson.feature(us, us.objects.counties).features
  .filter(f => /^V/.test(f.properties.name))
  .map(f => { const [lon, lat] = d3.geoCentroid(f); return { name: f.properties.name, lon, lat }; });

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: vs,
  schema: { name: { type: 'categorical' }, lon: { type: 'quantitative' }, lat: { type: 'quantitative' } },
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.counties), fill: 'none', stroke: '#333', strokeWidth: 0.1 }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states), fill: 'none', stroke: '#333', strokeWidth: 0.5 }),
    geoPoint({ size: 3, fill: '#111', stroke: 'white', channels: { lon: { field: 'lon' }, lat: { field: 'lat' } } }),
    geoText({ fontSize: 8, dx: 6, textAnchor: 'start', fill: '#111',
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' }, text: { field: 'name' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Mark the V counties',
      question: 'There are dozens of US counties whose names start with V. Where do you think they cluster? Mark up to eight.',
      try: 'Click the map to drop a pin; drag a pin to move it; Alt-click a pin to take it back.',
      why: '`edit.geo.create()` mints a pin on a click, `remove({ when: when.alt })` takes one back, and `count({ max: 8 })` caps the answer — create and remove kept symmetric.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'remove()', 'count()'],
      code: `const us = await plotData('observablehq__plot-v-counties', 'us-counties-10m.json');

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.nation) },
  data: [],
  schema: { lon: { type: 'quantitative', domain: [-180, -60] }, lat: { type: 'quantitative', domain: [15, 72] } },
  constraints: [count({ max: 8 })],                                //! at most eight pins
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.counties), fill: 'none', stroke: '#ddd', strokeWidth: 0.2 }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states), fill: 'none', stroke: '#888', strokeWidth: 0.6 }),
    geoPoint({ size: 5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 1.5,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [
        edit.geo.create(),                                           //! click to add
        edit.geo.move({ when: when.noAlt }),
        remove({ when: when.alt }),                                  //! Alt-click to remove
      ] }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-shockwave',
  status: 'full',
  verdict: 'Land and sphere under a rotated Equal Earth projection, with one `geoPolygon` ring per 10° of distance from Tonga, stroked by that distance in km.',
  needs: [],
  prep: ['prep-geo', 'prep-calculate'],
  gaps: [
    'The rings are `d3.geoCircle` polygons built in JS, where Plot takes a `geometry` function of each radius.',
  ],
  recreation: {
    code: `const world = await plotData('observablehq__plot-shockwave', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const circle = d3.geoCircle().center([-175.38, -20.57]);
const rings = [0.5, 179.5, ...d3.range(10, 171, 10)]
  .map(r => ({ km: 111.2 * r, geometry: circle.radius(r)() }));

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 40, right: 4, bottom: 4, left: 4 },
  projection: { type: 'equal-earth', rotate: [90, 0], domain: { type: 'Sphere' } },
  data: rings,
  schema: { km: { type: 'quantitative', domain: [0, 20000] }, geometry: { type: 'categorical' } },
  marks: [
    geoBasemap({ geojson: land, fill: 'none', stroke: '#333', strokeWidth: 0.7 }),
    geoPolygon({ fill: 'none', strokeWidth: 2, channels: {
      geometry: { field: 'geometry', scale: null },
      stroke: { field: 'km', scale: { scheme: 'turbo' },
                legend: { anchor: 'top', title: 'Distance from Tonga (km)', tickFormat: '~s' } } } }),
    geoBasemap({ geojson: { type: 'Sphere' }, fill: 'none', stroke: '#333' }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Who heard it',
      question: 'The 2022 Hunga Tonga eruption was heard thousands of kilometres away. Mark the four farthest places you think heard the boom.',
      try: 'Click to drop a pin (four at most); drag a pin to adjust it.',
      why: 'Pins are rows minted by `edit.geo.create()` through the Equal Earth inverse; the distance rings are inert chrome that give the answer a scale. `count({ max: 4 })` caps the answer.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'count()'],
      code: `const world = await plotData('observablehq__plot-shockwave', 'countries-110m.json');
const land = topojson.feature(world, world.objects.land);
const circle = d3.geoCircle().center([-175.38, -20.57]);
const rings = { type: 'GeometryCollection', geometries: d3.range(20, 180, 20).map(r => circle.radius(r)()) };

mount(Elicit({
  width: 480, height: 250,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: { type: 'equal-earth', rotate: [90, 0], domain: { type: 'Sphere' } },
  data: [],
  schema: { lon: { type: 'quantitative', domain: [-180, 180] }, lat: { type: 'quantitative', domain: [-90, 90] } },
  constraints: [count({ max: 4 })],                                //! four places
  marks: [
    geoBasemap({ geojson: land, fill: '#e5e5e5', stroke: 'none' }),
    geoBasemap({ geojson: rings, fill: 'none', stroke: '#93c5fd', strokeWidth: 1 }),
    geoBasemap({ geojson: { type: 'Sphere' }, fill: 'none', stroke: '#333' }),
    geoPoint({ size: 6, fill: '#dc2626', stroke: '#fff', strokeWidth: 1.5,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [edit.geo.create(), edit.geo.move()] }),               //! click to add, drag to adjust
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-choropleth',
  status: 'full',
  verdict: 'One `geoPolygon` per county filled by its unemployment class, under white state borders, on pre-projected Albers coordinates.',
  needs: [],
  prep: ['prep-geo', 'prep-lookup', 'prep-bin'],
  gaps: [
    'Plot’s quantize scale (9 classes over 1–10%) is computed in JS as an `ordinal` class column, which ElicitJS colours with the 9-class Brewer Blues; the legend is swatches rather than a threshold bar.',
    'The identity projection is a live `d3.geoIdentity()` fitted by hand (see the floor plan entry).',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');
// Read as text: autoType would turn the FIPS ids "01001" into the number 1001.
const unemployment = new Map(d3.csvParse(await plotData('observablehq__plot-choropleth', 'unemployment-x.csv', { type: 'text' }))
  .map(d => [d.id, +d.rate]));
const classes = d3.range(1, 10).map(i => i + '–' + (i + 1) + '%');
const classOf = r => classes[Math.max(0, Math.min(8, Math.floor(r) - 1))];
const nation = topojson.feature(us, us.objects.nation);
const statemap = new Map(topojson.feature(us, us.objects.states).features.map(f => [f.id, f.properties.name]));
const rows = topojson.feature(us, us.objects.counties).features
  .filter(f => unemployment.has(f.id))
  .map(f => ({ geometry: f.geometry, rate: classOf(unemployment.get(f.id)), percent: unemployment.get(f.id),
    county: f.properties.name, state: statemap.get(f.id.slice(0, 2)) }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [335, 292]], nation),
  data: rows,
  schema: {
    geometry: { type: 'categorical' }, rate: { type: 'ordinal', domain: classes },
    percent: { type: 'quantitative' }, county: { type: 'categorical' }, state: { type: 'categorical' },
  },
  marks: [
    geoPolygon({ stroke: 'none', tip: ['county', 'state', 'percent'], channels: { geometry: { field: 'geometry', scale: null },
      fill: { field: 'rate', scale: { scheme: 'blues' }, legend: { title: 'Unemployment rate (%)' } } } }),
    geoBasemap({ geojson: topojson.feature(us, us.objects.states), fill: 'none', stroke: 'white', strokeWidth: 1 }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Classify the states',
      question: 'Which states do you think had high, middling or low unemployment in 2016?',
      try: 'Click a state to select it, then click a swatch in the legend to give it that class.',
      why: '`select()` on the states picks the row; `edit.legend.category()` on the legend writes the clicked swatch into the selected row’s `level`. The key is the picker, so the answer is given in the vocabulary the map is read in.',
      uses: ['select()', 'edit.legend.category()', 'legendColor'],
      code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');
const nation = topojson.feature(us, us.objects.nation);
const levels = ['low', 'middling', 'high'];

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [390, 292]], nation),
  data: topojson.feature(us, us.objects.states).features
    .map(f => ({ state: f.properties.name, geometry: f.geometry, level: 'middling' })),
  schema: {
    state:    { type: 'categorical' },
    geometry: { type: 'categorical' },
    level:    { type: 'ordinal', domain: levels },
  },
  marks: [
    geoPolygon({ stroke: 'white', strokeWidth: 0.8,
      channels: { geometry: { field: 'geometry', scale: null }, fill: { field: 'level', scale: { scheme: 'blues' } } },
      edits: [select()] }),                                         //! click a state to select it
    legendColor({ anchor: 'right', field: 'level', edit: edit.legend.category() }),   //! click a swatch to classify it
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-bivariate-choropleth',
  status: 'partial',
  verdict: 'The county map coloured by a 3 × 3 diabetes × obesity class with the original nine-colour scheme is reproduced; the rotated-diamond bivariate legend is not.',
  needs: ['legend-custom'],
  prep: ['prep-geo', 'prep-lookup', 'prep-bin'],
  gaps: [
    'The bivariate legend (a 45°-rotated 3 × 3 grid with axis labels) becomes a list of nine labelled swatches.',
    'Tertile thresholds and the class of each county are computed in JS.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-bivariate-choropleth', 'counties-albers-10m.json');
const cdc = d3.csvParse(await plotData('observablehq__plot-bivariate-choropleth', 'cdc_diabetes_obesity_2020.csv', { type: 'text' }),
  d => ({ county: d.county, diabetes: +d.diabetes, obesity: +d.obesity }));
const dT = d3.scaleQuantile(cdc.map(d => d.diabetes), [0, 1, 2]).quantiles();
const oT = d3.scaleQuantile(cdc.map(d => d.obesity), [0, 1, 2]).quantiles();
const level = ['low', 'mid', 'high'];
const classes = d3.cross([0, 1, 2], [0, 1, 2]).map(([a, b]) => 'diabetes ' + level[a] + ' · obesity ' + level[b]);
const index = new Map(cdc.map(d => [d.county, d]));
const classOf = v => {
  if (!v || isNaN(v.diabetes) || isNaN(v.obesity)) return 'no data';
  const a = +(v.diabetes > dT[0]) + (v.diabetes > dT[1]), b = +(v.obesity > oT[0]) + (v.obesity > oT[1]);
  return classes[3 * a + b];
};
const statemap = new Map(topojson.feature(us, us.objects.states).features.map(f => [f.id, f.properties.name]));
const rate = v => (v == null || isNaN(v) ? null : v);
const rows = topojson.feature(us, us.objects.counties).features
  .map(f => ({ geometry: f.geometry, cls: classOf(index.get(f.id)), county: f.properties.name,
    state: statemap.get(f.id.slice(0, 2)), diabetes: rate(index.get(f.id)?.diabetes), obesity: rate(index.get(f.id)?.obesity) }));
const scheme = ['#e8e8e8', '#ace4e4', '#5ac8c8', '#dfb0d6', '#a5add3', '#5698b9', '#be64ac', '#8c62aa', '#3b4994', '#ccc'];

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [300, 292]], topojson.feature(us, us.objects.nation)),
  data: rows,
  schema: {
    geometry: { type: 'categorical' }, cls: { type: 'categorical', domain: [...classes, 'no data'] },
    county: { type: 'categorical' }, state: { type: 'categorical' },
    diabetes: { type: 'quantitative' }, obesity: { type: 'quantitative' },
  },
  marks: [
    geoPolygon({ stroke: 'white', strokeWidth: 0.125, channels: { geometry: { field: 'geometry', scale: null },
      fill: { field: 'cls', scale: { range: scheme }, legend: { title: null } } },
      tip: d => [d.county + ', ' + d.state,                       // Plot's title: name, then both rates
        (d.diabetes == null ? 'no data' : d.diabetes + '%') + ' diabetes',
        (d.obesity == null ? 'no data' : d.obesity + '%') + ' obesity'] }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: 'none', stroke: 'white' }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Classify the counties',
      question: 'Which South Carolina counties do you think have high diabetes and high obesity rates, and which are low on one or both?',
      try: 'Hover a county to see its name. Click it to select it (Shift-click to add more), then click a swatch in the key to give them that class.',
      why: 'The map is the recreation’s: one `geoPolygon` per county, filled by the nine-class `cls` column. `select({ multi: true })` gathers counties and `edit.legend.category()` writes the clicked swatch into every selected row. With 46 shapes this is a lot of clicking; the 3 × 3 allocation in the next tab asks the aggregate question with nine drags, and may be the better instrument.',
      uses: ['select()', 'edit.legend.category()', 'geoPolygon', 'tip'],
      code: `const us = await plotData('observablehq__plot-bivariate-choropleth', 'counties-albers-10m.json');
const level = ['low', 'mid', 'high'];
const classes = d3.cross([0, 1, 2], [0, 1, 2]).map(([a, b]) => 'diabetes ' + level[a] + ' · obesity ' + level[b]);
const scheme = ['#e8e8e8', '#ace4e4', '#5ac8c8', '#dfb0d6', '#a5add3', '#5698b9', '#be64ac', '#8c62aa', '#3b4994'];
const sc = topojson.feature(us, us.objects.counties).features.filter(f => f.id.startsWith('45'));   // South Carolina

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [290, 292]], { type: 'FeatureCollection', features: sc }),
  data: sc.map(f => ({ county: f.properties.name, geometry: f.geometry, cls: classes[4] })),   // all mid · mid
  schema: {
    county:   { type: 'categorical' },
    geometry: { type: 'categorical' },
    cls:      { type: 'categorical', domain: classes },
  },
  marks: [
    geoPolygon({ stroke: 'white', strokeWidth: 0.8,
      channels: { geometry: { field: 'geometry', scale: null }, fill: { field: 'cls', scale: { range: scheme } } },
      tip: ['county'],                                                            // hover names the county
      edits: [select({ multi: true })] }),                                       //! click, Shift-click to add
    legendColor({ anchor: 'right', field: 'cls', title: null, edit: edit.legend.category() }),   //! the key is the picker
  ],
}));`,
    },
    {
      title: 'Fill the 3 × 3',
      question: 'Out of 100 US counties, how many do you think fall in each diabetes × obesity tertile pair?',
      try: 'Drag a circle up to grow it, down to shrink it; the nine always total 100.',
      why: 'Each cell of the bivariate key is a row; `slide()` on the `size` channel changes its count in place, and `maintainSum({ total: 100 })` turns the nine drags into one allocation. Independent tertiles would put 11 in every cell — correlation piles counties on the diagonal.',
      uses: ['slide()', 'maintainSum()'],
      code: `const level = ['low', 'mid', 'high'];
const dLevel = level.map(l => l + ' diabetes'), oLevel = level.map(l => l + ' obesity');
const scheme = ['#e8e8e8', '#ace4e4', '#5ac8c8', '#dfb0d6', '#a5add3', '#5698b9', '#be64ac', '#8c62aa', '#3b4994'];

mount(Elicit({
  width: 360, height: 320,
  margins: { top: 16, right: 16, bottom: 28, left: 90 },
  data: d3.cross([0, 1, 2], [0, 1, 2]).map(([a, b]) =>
    ({ diabetes: dLevel[a], obesity: oLevel[b], cell: scheme[3 * a + b], counties: 100 / 9 })),
  schema: {
    diabetes: { type: 'ordinal', domain: dLevel },
    obesity:  { type: 'ordinal', domain: oLevel },
    cell:     { type: 'categorical', domain: scheme },
    counties: { type: 'quantitative', domain: [0, 100] },
  },
  constraints: [maintainSum({ field: 'counties', total: 100, strategy: 'redistribute' })],   //! nine cells, 100 counties
  axes: { x: {}, y: {} },
  marks: [
    point({ stroke: '#555', channels: {
      x: { field: 'obesity' }, y: { field: 'diabetes' },
      fill: { field: 'cell', scale: { range: scheme } },
      size: { field: 'counties', scale: { type: 'sqrt', range: [0, 44] },
              edit: slide({ axis: 'y', extent: 150 }) } } }),                   //! drag up to grow a cell
    text({ fontSize: 11, channels: { x: { field: 'obesity' }, y: { field: 'diabetes' },
      text: { field: 'counties' } }, format: '.0f' }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-geotiff-contours',
  status: 'none',
  verdict: 'Filled contours of a raster read from a GeoTIFF: contours and rasters are out of scope for an elicitation library, and computing 30 contour bands (plus decoding the TIFF) by hand is not minimal customization.',
  needs: ['density-2d', 'raster', 'clip'],
  prep: [],
  gaps: [
    'No `contour` mark: a grid of values cannot become filled isobands.',
    'No raster input; the GeoTIFF would have to be decoded with an extra library first.',
    'Clipping to the sphere is not available either: `clip: true` confines marks to the plot rectangle, not to a geometry.',
  ],
  alternative: 'Ask for point values instead: seed a handful of `geoPoint` pins over the globe and let the reader set each one’s surface temperature with `slide()` on a colour or size channel — a sparse version of the field the contours show.',
});

// ============================================================ Arrow, Link, Tree, Vector

GALLERY.add({
  id: 'plot-finite-state-machine',
  status: 'full',
  verdict: 'A directed network with self-loops: three circular nodes and nine `link` arrows whose width and label are the transition count. Bends, loops and arrowheads come from the link mark itself.',
  needs: [],
  prep: ['prep-reshape'],
  gaps: [
    'Reciprocal links bow apart by the link mark’s own separation rule rather than Plot’s fixed `bend: true`.',
    'Self-loops (A→A, B→B, C→C) are drawn as loops on their node; in the original they collapse to nothing but their labels.',
  ],
  recreation: {
    code: `const matrix = [[3, 2, 5], [1, 7, 2], [1, 1, 8]];
const names = ['A', 'B', 'C'];
const nodes = matrix.map((m, i) => {
  const [x, y] = d3.pointRadial(((2 - i) * 2 * Math.PI) / matrix.length, 100);
  return { id: names[i], x, y };
});
const edges = matrix.flatMap((m, i) => m.map((value, j) => ({ source: names[i], target: names[j], value })));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 60, right: 60, bottom: 60, left: 60 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true },
               x: { type: 'quantitative', domain: [-130, 130] }, y: { type: 'quantitative', domain: [-130, 130] } },
      links: { directed: true, selfLoops: true,
               fields: { source: { type: 'ref' }, target: { type: 'ref' }, value: { type: 'quantitative' } } },
    },
  },
  data: { nodes, links: edges },
  marks: [
    point({ size: 40, fill: 'none', stroke: '#111', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    link({ stroke: '#111', arrowSize: 10, loopRadius: 26, labelBackground: true,
      channels: { strokeWidth: { field: 'value', scale: null }, text: { field: 'value' } } }),
    text({ fontSize: 14, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Wire the weather',
      question: 'Think of tomorrow’s weather given today’s. Draw an arrow from each kind of day to every kind you think commonly follows it.',
      try: 'Hover a box, then drag from a dot on its edge to another box (or back to itself). Drag a box to move it; drag a link’s end handle to re-point it, or drop it on nothing to delete it.',
      why: 'The `ports` channel on the `sticker` carries `edit.network.connect()`, so a drag from a port proposes a new row in the links table; `edit.network.rewire()` on the `link` moves an end. `directed` and `selfLoops` on the links table are what let “rain → rain” be drawn.',
      uses: ['edit.network.connect()', 'edit.network.rewire()', 'ports', 'directed'],
      code: `mount(Elicit({
  width: 420, height: 320,
  margins: { top: 30, right: 30, bottom: 30, left: 30 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, label: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 100] }, y: { type: 'quantitative', domain: [0, 100] } },
      links: { directed: true, selfLoops: true,                      //! arrows, and a day may follow itself
               fields: { source: { type: 'ref' }, target: { type: 'ref' } } },
    },
  },
  data: {
    nodes: [
      { id: 'sun', label: '☀️ Sunny', x: 50, y: 88 },
      { id: 'cloud', label: '☁️ Cloudy', x: 12, y: 18 },
      { id: 'rain', label: '🌧️ Rainy', x: 88, y: 18 },
    ],
    links: [],
  },
  marks: [
    link({ stroke: '#334155', strokeWidth: 2, edits: [edit.network.rewire()] }),   //! re-point or drop to delete
    sticker({
      fill: '#f8fafc', stroke: '#334155', radius: 10,
      channels: {
        x: { field: 'x', edit: move({ channels: ['x', 'y'], mode: 'relative' }) },   // drag a box to tidy up
        y: { field: 'y' }, text: { field: 'label' },
        ports: { value: true, edit: edit.network.connect() },      //! drag from a port to draw an arrow
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-arc-diagram',
  status: 'full',
  verdict: 'Les Misérables as a network: nodes stacked on one vertical line, sorted by group, with every co-appearance drawn as an `arc` link, coloured when both characters share a group.',
  needs: [],
  prep: ['prep-calculate', 'prep-lookup'],
  gaps: [
    'Each link is oriented top-to-bottom in JS and given a negative `curvature`, so every arc bows to the right; Plot’s `sweep: "-y"` does that itself.',
    'The node order is the group sort done in JS (`sort: { y: "fill" }` in Plot).',
  ],
  recreation: {
    code: `const mis = await plotData('miserables');
const nodes = d3.sort(mis.nodes, d => d.group).map((d, i) => ({ id: d.id, group: String(d.group), x: 0, y: -i }));
const groupOf = new Map(mis.nodes.map(d => [d.id, String(d.group)]));
const position = new Map(nodes.map((d, i) => [d.id, i]));
const groups = d3.range(11).map(String);
const links = d3.sort(mis.links.map(l => {
  const [source, target] = position.get(l.source) < position.get(l.target) ? [l.source, l.target] : [l.target, l.source];
  const g = groupOf.get(l.source);
  return { source, target, same: g === groupOf.get(l.target) ? g : 'none' };
}), l => l.same !== 'none');                                   // grey arcs underneath

mount(Elicit({
  width: 480, height: 900,
  margins: { top: 10, right: 10, bottom: 10, left: 110 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, group: { type: 'categorical', domain: groups },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [-76, 0] } },
      links: { source: { type: 'ref' }, target: { type: 'ref' },
               same: { type: 'categorical', domain: ['none', ...groups] } },
    },
  },
  data: { nodes, links },
  marks: [
    link({ curve: 'arc', curvature: -0.5, inset: 0, strokeWidth: 1.2,
      channels: { stroke: { field: 'same', scale: { range: ['#ccc', ...d3.schemeTableau10, '#666'] } } } }),
    point({ size: 3, channels: { x: { field: 'x' }, y: { field: 'y' },
      fill: { field: 'group', scale: { range: [...d3.schemeTableau10, '#666'] } } } }),
    text({ fontSize: 9, textAnchor: 'end', dx: -6, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' },
      fill: { field: 'group', scale: { range: [...d3.schemeTableau10, '#666'] } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Who meets whom',
      question: 'In Les Misérables, which of these eight characters share a scene? Connect every pair you think appears together.',
      try: 'Shift-drag down from one name’s dot to a name below it to draw an arc. Alt-click an arc to delete it.',
      why: '`edit.network.connect({ when: when.shift })` on the node mark mints a links row from the drag; the arc geometry is the same `link({ curve: "arc" })` as the recreation, so every answer reads as an arc diagram. `remove()` on the link takes one back.',
      uses: ['edit.network.connect()', 'remove()', 'when.shift'],
      code: `const people = ['Valjean', 'Javert', 'Fantine', 'Cosette', 'Marius', 'Eponine', 'Thenardier', 'Gavroche'];

mount(Elicit({
  width: 420, height: 380,
  margins: { top: 16, right: 16, bottom: 16, left: 110 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [-7, 0] } },
      links: { source: { type: 'ref' }, target: { type: 'ref' } },   // undirected: A–B is B–A
    },
  },
  data: { nodes: people.map((id, i) => ({ id, x: 0, y: -i })), links: [] },
  marks: [
    link({ curve: 'arc', curvature: -0.5, inset: 6, stroke: '#4e79a7', strokeWidth: 2,
      edits: [remove({ when: when.alt })] }),                      //! Alt-click an arc to delete it
    point({ size: 6, fill: '#4e79a7', channels: { x: { field: 'x' }, y: { field: 'y' } },
      edits: [edit.network.connect({ when: when.shift })] }),     //! Shift-drag between dots
    text({ fontSize: 12, textAnchor: 'end', dx: -10, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-arrow-variation-chart',
  status: 'full',
  verdict: 'Each metro’s 1980 → 2015 move in population × inequality is a bent arrow coloured by the change, with the highlighted metros labelled — drawn by recasting each row as two nodes joined by one `link`.',
  needs: [],
  prep: ['prep-reshape'],
  gaps: [
    'ElicitJS has no per-row arrow mark (`link-mark`), so each metro becomes two rows of a nodes table (1980, 2015) and one row of a directed links table; the `link` mark then supplies the arrowhead and the bend.',
    'There is no named `BuRd` scheme: the ramp is `d3.interpolateRdBu` sampled in reverse, handed to a `diverging` scale whose domain is made symmetric about 0 in JS, as Plot’s is.',
  ],
  recreation: {
    code: `const metros = await plotData('observablehq__plot-arrow-variation-chart', 'metros.csv');
const nodes = metros.flatMap((d, i) => [
  { id: 'a' + i, x: d.POP_1980, y: d.R90_10_1980, label: '' },
  { id: 'b' + i, x: d.POP_2015, y: d.R90_10_2015, label: d.highlight ? d.nyt_display : '' },
]);
const links = metros.map((d, i) => ({ source: 'a' + i, target: 'b' + i, change: d.R90_10_2015 - d.R90_10_1980 }));
const m = d3.max(links, d => Math.abs(d.change));
const BuRd = d3.quantize(t => d3.interpolateRdBu(1 - t), 9);

mount(Elicit({
  width: 480, height: 380,
  margins: { top: 16, right: 16, bottom: 36, left: 44 },
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, x: { type: 'quantitative' },
               y: { type: 'quantitative' }, label: { type: 'categorical' } },
      links: { directed: true,                                         // arrowheads on the 2015 end
               fields: { source: { type: 'ref' }, target: { type: 'ref' }, change: { type: 'quantitative', domain: [-m, m] } } },
    },
  },
  data: { nodes, links },
  axes: { x: { grid: true, title: 'Population →' }, y: { grid: true, title: '↑ Inequality' } },
  marks: [
    point({ size: 0, channels: { x: { field: 'x', scale: 'log' }, y: { field: 'y' } } }),
    link({ curvature: 0.25, arrowSize: 4, inset: 0, strokeWidth: 1.2,
      channels: { stroke: { field: 'change', scale: { type: 'diverging', range: BuRd },
        legend: { anchor: 'top', title: 'Change in inequality from 1980 to 2015' } } } }),
    text({ fontSize: 10, dy: -8, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'label' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Point to 2035',
      question: 'Where will these six metros be in 2035 — how big, and how unequal?',
      try: 'Drag an open circle (2035) anywhere; the filled 2015 positions are locked.',
      why: 'The arrows are `link` rows between a locked 2015 node and a free 2035 node. `move()` on the node mark writes both `x` and `y` of whichever end you grab, and `lock` keeps the observed ends where they are.',
      uses: ['move()', 'lock', 'link'],
      code: `const metros = (await plotData('observablehq__plot-arrow-variation-chart', 'metros.csv')).filter(d => d.highlight);
const nodes = metros.flatMap((d, i) => [
  { id: 'now' + i, year: 2015, x: d.POP_2015, y: d.R90_10_2015, name: d.nyt_display },
  { id: 'then' + i, year: 2035, x: d.POP_2015 * 1.3, y: d.R90_10_2015 + 0.5, name: '' },   // a nudge to start from
]);

mount(Elicit({
  width: 480, height: 320,
  margins: { top: 16, right: 16, bottom: 36, left: 44 },
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, year: { type: 'ordinal', domain: [2015, 2035] },
               x: { type: 'quantitative', domain: [1e5, 4e7] }, y: { type: 'quantitative', domain: [3, 11] },
               name: { type: 'categorical' } },
      links: { directed: true, fields: { source: { type: 'ref' }, target: { type: 'ref' } } },
    },
  },
  data: { nodes, links: metros.map((d, i) => ({ source: 'now' + i, target: 'then' + i })) },
  lock: d => d.year === 2015,                                       //! the observed end is fixed
  axes: { x: { grid: true, title: 'Population →' }, y: { grid: true, title: '↑ Inequality' } },
  marks: [
    link({ curvature: 0.2, arrowSize: 5, inset: 6, stroke: '#b2182b', strokeWidth: 1.5 }),
    point({ size: 6, stroke: '#b2182b', strokeWidth: 1.5,
      channels: { x: { field: 'x', scale: 'log', edit: move({ channels: ['x', 'y'] }) }, y: { field: 'y' },   //! drag the 2035 end
                  fill: { field: 'year', scale: { range: ['#b2182b', '#fff'] } } } }),
    text({ fontSize: 10, dy: -10, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'name' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-difference-arrows',
  status: 'full',
  verdict: 'Per sport, a horizontal `ruleY` span from the female to the male athlete count, a dot at the female end and a chevron `shape` turned to point along the span as the arrowhead, coloured by which is larger.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: [
    'A rule has no arrow marker, so the arrowhead is a separate `shape` (an open chevron path) at the male end, its `angle` 0 or 180 by the sign of the difference.',
    'Counts and the sort by male count are computed in JS (Plot’s `groupY` reducers).',
  ],
  recreation: {
    code: `const olympians = await plotData('olympians');
const rows = d3.sort(d3.rollups(olympians, g => ({
  female: g.filter(d => d.sex === 'female').length,
  male: g.filter(d => d.sex === 'male').length,
}), d => d.sport).map(([sport, c]) => ({ sport, ...c, more: c.male > c.female ? 'male' : c.male < c.female ? 'female' : 'equal' })),
  d => -d.male);

mount(Elicit({
  width: 480, height: 460,
  margins: { top: 8, right: 16, bottom: 28, left: 100 },
  data: rows,
  schema: {
    sport:  { type: 'categorical', domain: rows.map(d => d.sport) },
    female: { type: 'quantitative', domain: [0, 1300] },
    male:   { type: 'quantitative', domain: [0, 1300] },
    more:   { type: 'categorical', domain: ['female', 'male', 'equal'] },
  },
  axes: { x: {}, y: { grid: true } },
  marks: [
    ruleX({ stroke: '#333', channels: { x: { datum: 0 } } }),
    ruleY({ strokeWidth: 2, channels: { y: { field: 'sport' }, x1: { field: 'female' }, x2: { field: 'male' },
      stroke: { field: 'more', scale: { range: ['#4e79a7', '#f28e2b', '#aaa'] }, legend: { anchor: 'top', title: null } } } }),
    point({ size: 2.5, channels: { y: { field: 'sport' }, x: { field: 'female' },
      fill: { field: 'more', scale: { range: ['#4e79a7', '#f28e2b', '#aaa'] } } } }),
    shape({ path: 'M-6,-5L0,0L-6,5M6,0', size: 3.5, fill: 'none', strokeWidth: 2,   // a chevron, tip at the centre
      channels: { y: { field: 'sport' }, x: { field: 'male' },
        angle: { fn: d => d.male >= d.female ? 0 : 180 },
        stroke: { field: 'more', scale: { range: ['#4e79a7', '#f28e2b', '#aaa'] } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set both ends',
      question: 'At the 2016 Olympics, how many women and how many men competed in each of these sports?',
      try: 'Drag the dot (women) and the arrowhead (men) along each row. Values snap to tens.',
      why: 'Each row has two handles on two columns, the recreation’s marks: a `point` with `move()` on `female` and the chevron `shape` with `move()` on `male`, with an inert `ruleY` span between. The chevron’s `angle` follows the sign of the difference, and `snap({ step: 10 })` rounds both ends, so the answer reads as a count.',
      uses: ['move()', 'shape', 'snap()', 'ruleY'],
      code: `const sports = ['athletics', 'aquatics', 'football', 'rowing', 'gymnastics', 'boxing'];

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 8, right: 16, bottom: 28, left: 80 },
  data: sports.map(sport => ({ sport, female: 150, male: 300 })),
  schema: {
    sport:  { type: 'categorical', domain: sports.slice().reverse() },   // first sport on top
    female: { type: 'quantitative', domain: [0, 1300] },
    male:   { type: 'quantitative', domain: [0, 1300] },
  },
  constraints: [snap({ field: 'female', step: 10 }), snap({ field: 'male', step: 10 })],   //! whole tens
  axes: { x: {}, y: { grid: true } },
  marks: [
    ruleY({ stroke: '#999', strokeWidth: 2, channels: { y: { field: 'sport' }, x1: { field: 'female' }, x2: { field: 'male' } } }),
    point({ size: 6, fill: '#4e79a7', channels: { y: { field: 'sport' }, x: { field: 'female', edit: move() } } }),   //! women
    shape({ path: 'M-6,-5L0,0L-6,5M6,0', size: 8, fill: '#f28e2b', fillOpacity: 0, stroke: '#f28e2b', strokeWidth: 3,
      channels: { y: { field: 'sport' }, x: { field: 'male', edit: move() },                                         //! men
        angle: { fn: d => d.male >= d.female ? 0 : 180 } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-trellis-anomaly',
  status: 'partial',
  verdict: 'The 1931 → 1932 barley yield change per variety is drawn as a coloured span with a chevron `shape` arrowhead and a spectral legend; faceting is not covered by this study, so the six site facets become one long band axis of site · variety rows.',
  needs: ['facet'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'No `fy` facet: sites are grouped by sorting the combined `site · variety` category, without per-facet frames or the right-hand site labels.',
    'A rule has no arrow marker: the arrowhead is a chevron `shape` at the 1932 end, turned by the sign of the change.',
  ],
  recreation: {
    code: `const barley = await plotData('observablehq__plot-trellis-anomaly', 'barley.csv');
const pairs = d3.rollups(barley, g => ({
  y1931: g.find(d => d.year === 1931).yield, y1932: g.find(d => d.year === 1932).yield,
}), d => d.site, d => d.variety);
const siteOrder = d3.sort(pairs, ([, v]) => -d3.median(v, ([, d]) => d.y1931)).map(([s]) => s);
const rows = siteOrder.flatMap(site => d3.sort(pairs.find(([s]) => s === site)[1], ([, d]) => -d.y1931)
  .map(([variety, d]) => ({ row: site + ' · ' + variety, ...d, change: d.y1932 - d.y1931 })));

mount(Elicit({
  width: 480, height: 800,
  margins: { top: 8, right: 16, bottom: 28, left: 190 },
  data: rows,
  schema: {
    row: { type: 'categorical', domain: rows.map(d => d.row).reverse() },   // first site on top
    y1931: { type: 'quantitative', domain: [10, 70] },
    y1932: { type: 'quantitative', domain: [10, 70] },
    change: { type: 'quantitative', domain: [-25, 25] },
  },
  axes: { x: { grid: true }, y: {} },
  marks: [
    ruleY({ strokeWidth: 2, channels: { y: { field: 'row' }, x1: { field: 'y1931' }, x2: { field: 'y1932' },
      stroke: { field: 'change', scale: { type: 'diverging', scheme: 'spectral' },
        legend: { anchor: 'top', title: 'Change in yield', tickFormat: '+d' } } } }),
    shape({ path: 'M-6,-5L0,0L-6,5M6,0', size: 3.5, fill: 'none', strokeWidth: 2,
      channels: { y: { field: 'row' }, x: { field: 'y1932' },
        angle: { fn: d => d.change >= 0 ? 0 : 180 },
        stroke: { field: 'change', scale: { type: 'diverging', scheme: 'spectral' } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast next year',
      question: 'At Morris, Minnesota, what yield (bushels per acre) do you expect from each barley variety the year after 1932?',
      try: 'Drag the open dot left or right; the 1932 yields are fixed.',
      why: 'Each row holds an observed year and a forecast. The span runs from the fixed `y1932` to the free `next` column, and only the open `point` carries `move()`, so the arrow always starts from the data.',
      uses: ['move()', 'ruleY', 'clamp()'],
      code: `const barley = await plotData('observablehq__plot-trellis-anomaly', 'barley.csv');
const morris = barley.filter(d => d.site === 'Morris' && d.year === 1932);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 8, right: 16, bottom: 28, left: 90 },
  data: morris.map(d => ({ variety: d.variety, y1932: d.yield, next: d.yield })),
  schema: {
    variety: { type: 'categorical', domain: morris.map(d => d.variety) },
    y1932:   { type: 'quantitative', domain: [0, 70] },
    next:    { type: 'quantitative', domain: [0, 70] },
  },
  constraints: [clamp({ field: 'next', min: 0, max: 70 })],
  axes: { x: { grid: true }, y: {} },
  marks: [
    ruleY({ stroke: '#999', strokeWidth: 2, channels: { y: { field: 'variety' }, x1: { field: 'y1932' }, x2: { field: 'next' } } }),
    point({ size: 3, fill: '#333', channels: { y: { field: 'variety' }, x: { field: 'y1932' } } }),
    point({ size: 6, fill: '#fff', stroke: '#d53e4f', strokeWidth: 2,
      channels: { y: { field: 'variety' }, x: { field: 'next', edit: move() } } }),   //! drag the forecast
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-phases-of-the-moon',
  status: 'partial',
  verdict: 'A year of moons on a calendar grid, each a dark disc with its lit part drawn as a `shape` whose path is a function of the phase — the limb and an elliptical terminator, the outline Plot’s orthographic hemisphere projects to. The year and locale inputs are not reproduced.',
  needs: ['input-widgets'],
  prep: ['prep-calculate'],
  gaps: [
    'The year is fixed (2026) and the month names are English; the original binds both to inputs.',
    'The phase comes from the mean synodic month (29.53 days from a known new moon), not the suncalc ephemeris, so it can be a few hours off.',
    'Plot draws each moon with a custom vector `shape.draw` that projects a hemisphere; here the same outline is an SVG arc path built per row, passed to `shape` as a `path` function.',
  ],
  recreation: {
    code: `const year = 2026;
const synodic = 29.530588853, newMoon = Date.UTC(2000, 0, 6, 18, 14);   // a known new moon
const phaseOf = d => ((((+d + 12 * 36e5 - newMoon) / 864e5 / synodic) % 1) + 1) % 1;   // 0 new, 0.5 full, at noon
// The lit part: the bright limb (a semicircle) and the terminator (a half-ellipse).
// The trailing moves pin the bounding box to the whole disc.
const lit = p => {
  const rx = Math.abs(Math.cos(2 * Math.PI * p)).toFixed(3), waxing = p < 0.5;
  const limb = waxing ? 1 : 0, term = (p < 0.25 || (p > 0.5 && p < 0.75)) ? 0 : 1;
  return \`M0,-1A1,1 0 0 \${limb} 0,1A\${rx},1 0 0 \${term} 0,-1Z M-1,-1M1,1\`;
};
const days = d3.utcDays(new Date(Date.UTC(year, 0, 1)), new Date(Date.UTC(year + 1, 0, 1))).map(d => ({
  day: d.getUTCDate(), month: d.getUTCMonth(), phase: phaseOf(d),
  col: d.getUTCDate() + (d3.utcMonth(d).getUTCDay() || 7),           // day of month, aligned by weekday
}));
const months = d3.range(12).map(m => new Date(Date.UTC(year, m, 1)).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }));

mount(Elicit({
  width: 480, height: 330,
  margins: { top: 14, right: 6, bottom: 6, left: 70 },
  theme: { background: '#111', axis: { labelFill: '#fff', stroke: '#111' } },
  data: days,
  schema: {
    day:   { type: 'quantitative' },
    month: { type: 'ordinal', domain: d3.range(11, -1, -1) },     // January on top
    col:   { type: 'ordinal', domain: d3.range(1, 40) },
    phase: { type: 'quantitative', domain: [0, 1] },
  },
  axes: { x: false, y: { tickSize: 0, tickFormat: m => months[m].toUpperCase() } },
  marks: [
    point({ size: 4.5, fill: '#333', channels: { x: { field: 'col' }, y: { field: 'month' } } }),
    shape({ size: 4.5, fill: '#fff', path: d => lit(d.phase),
      channels: { x: { field: 'col' }, y: { field: 'month' } } }),
    text({ fontSize: 5, dy: -8, fill: '#fff', channels: { x: { field: 'col' }, y: { field: 'month' }, text: { field: 'day' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Name the phases',
      question: 'The moon is full on 24 November 2026. What does it look like on each of these December nights?',
      try: 'Click a moon to step it through the eight phases, from new to waning crescent.',
      why: 'Each moon is a `shape` whose `symbol` channel maps a phase name to a path drawn the recreation’s way; `cycle()` on that channel steps `phase` through its declared domain. The answer is one category per night, scorable against the ephemeris.',
      uses: ['shape', 'symbol channel', 'cycle()'],
      code: `const lit = p => {   // the lit part of the disc at phase p (0 new, 0.5 full), as in the recreation
  const rx = Math.abs(Math.cos(2 * Math.PI * p)).toFixed(3), waxing = p < 0.5;
  const limb = waxing ? 1 : 0, term = (p < 0.25 || (p > 0.5 && p < 0.75)) ? 0 : 1;
  return \`M0,-1A1,1 0 0 \${limb} 0,1A\${rx},1 0 0 \${term} 0,-1Z M-1,-1M1,1\`;
};
const phases = ['new', 'waxing crescent', 'first quarter', 'waxing gibbous',
                'full', 'waning gibbous', 'last quarter', 'waning crescent'];
const nights = ['Dec 1', 'Dec 5', 'Dec 9', 'Dec 13', 'Dec 17', 'Dec 21', 'Dec 25', 'Dec 29'];

mount(Elicit({
  width: 460, height: 150,
  margins: { top: 16, right: 16, bottom: 28, left: 16 },
  theme: { background: '#111', axis: { labelFill: '#fff', stroke: '#111' } },
  data: nights.map(night => ({ night, phase: 'new' })),
  schema: {
    night: { type: 'ordinal', domain: nights },
    phase: { type: 'ordinal', domain: phases },                    //! the eight answers, in order
  },
  axes: { x: { tickSize: 0 }, y: false },
  marks: [
    point({ size: 18, fill: '#333', channels: { x: { field: 'night' } } }),
    shape({ size: 18, fill: '#fff', stroke: '#333',
      channels: { x: { field: 'night' },
        symbol: { field: 'phase', scale: { range: phases.map((p, i) => lit(i / 8 + 0.002)) },
                  edit: cycle() } } }),                              //! click to step the phase
    text({ fontSize: 9, dy: 30, fill: '#999', channels: { x: { field: 'night' },
      text: { fn: d => d.phase.replace('waxing', 'wax.').replace('waning', 'wan.').replace('crescent', 'cres.') } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-spike',
  status: 'full',
  verdict: 'One thin red triangle per county, rising from its centroid by population, over the nation and white state borders — with the spike legend — on pre-projected Albers coordinates.',
  needs: [],
  prep: ['prep-geo', 'prep-lookup', 'prep-calculate'],
  gaps: [
    'ElicitJS has no spike mark (`vector-mark`), so each spike is a triangle `geoPolygon` built in JS; that works because the identity projection makes geometry units the original’s pixels.',
    'Centroids are planar (`d3.geoPath().centroid`), as with Plot’s `centroid` initializer.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');   // same atlas, pre-projected
const pop = new Map(d3.csvParse(await plotData('observablehq__plot-spike', 'population.csv', { type: 'text' }))
  .map(d => [d.state + d.county, +d.population]));
const nation = topojson.feature(us, us.objects.nation);
const counties = topojson.feature(us, us.objects.counties).features;
const maxPop = d3.max(pop.values());
const spike = ([x, y], v, w = 3.5) => ({ type: 'Polygon',
  coordinates: [[[x - w, y], [x, y - 200 * v / maxPop], [x + w, y], [x - w, y]]] });   // length range [0, 200]
const rows = counties.filter(f => pop.has(f.id))
  .map(f => ({ geometry: spike(d3.geoPath().centroid(f), pop.get(f.id)) }));
const ticks = [2e6, 4e6, 6e6, 8e6, 1e7];
const legendSpikes = ticks.map((v, i) => ({ geometry: spike([960 + (i - 4) * 34, 590], v),
  label: d3.format('~s')(v), x: 960 + (i - 4) * 34, y: 604 }));   // spaced wider than Plot’s 18px so labels fit at this size

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [472, 292]], { type: 'MultiPoint', coordinates: [[0, 0], [975, 610]] }),
  data: [...rows, ...legendSpikes],
  schema: { geometry: { type: 'categorical' }, label: { type: 'categorical' },
            x: { type: 'quantitative' }, y: { type: 'quantitative' } },
  marks: [
    geoBasemap({ geojson: nation, fill: '#e0e0e0', stroke: 'none' }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: 'none', stroke: 'white' }),
    geoPolygon({ fill: 'red', fillOpacity: 0.3, stroke: 'red', strokeWidth: 0.5,
      channels: { geometry: { field: 'geometry', scale: null } } }),
    geoText({ fontSize: 7, channels: { lon: { field: 'x' }, lat: { field: 'y' }, text: { field: 'label' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Raise the spikes',
      question: 'How many people live in each of these six big-city counties?',
      try: 'Drag a spike’s tip up or down. The base stays on the county.',
      why: 'Each spike is two rows — a locked base and a free tip — joined by a `geoLine` with a `series` channel. Only the tip carries `edit.geo.move()`, and `lock` pins the bases, so the spike’s height is the answer.',
      uses: ['edit.geo.move()', 'lock', 'geoLine series'],
      code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');
const pick = { '06037': 'Los Angeles', '17031': 'Cook (Chicago)', '48201': 'Harris (Houston)',
               '04013': 'Maricopa (Phoenix)', '36047': 'Kings (Brooklyn)', '12086': 'Miami-Dade' };
const sites = topojson.feature(us, us.objects.counties).features.filter(f => f.id in pick)
  .map(f => ({ name: pick[f.id], c: d3.geoPath().centroid(f) }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [472, 292]], { type: 'MultiPoint', coordinates: [[0, 0], [975, 610]] }),
  data: sites.flatMap(s => [
    { name: s.name, end: 'base', x: s.c[0], y: s.c[1] },
    { name: s.name, end: 'tip', x: s.c[0], y: s.c[1] - 40 },          // a short spike to start
  ]),
  schema: {
    name: { type: 'categorical' }, end: { type: 'categorical', domain: ['base', 'tip'] },
    x: { type: 'quantitative' }, y: { type: 'quantitative' },
  },
  lock: d => d.end === 'base',                                      //! bases stay on their county
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.nation), fill: '#e0e0e0', stroke: 'none' }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: 'none', stroke: 'white' }),
    geoLine({ stroke: 'red', strokeWidth: 3,
      channels: { lon: { field: 'x' }, lat: { field: 'y' }, series: { field: 'name' } } }),   // one spike per county
    geoPoint({ size: 5, stroke: '#fff',
      channels: { lon: { field: 'x' }, lat: { field: 'y' }, fill: { field: 'end', scale: { range: ['#333', 'red'] } } },
      edits: [edit.geo.move()] }),                                  //! drag a tip
    geoText({ fontSize: 9, dy: 12, channels: { lon: { field: 'x' }, lat: { field: 'y' },
      text: { fn: d => d.end === 'base' ? d.name : '' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-wind-map',
  status: 'full',
  verdict: 'All 4,800 wind vectors on a longitude × latitude grid: one `shape` per row, an arrow path turned by `angle` to the wind’s bearing, sized by speed and stroked by speed on a turbo ramp.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `aspectRatio: 1` is set by hand: the chart’s width, height and the two schema domains are chosen so a degree of longitude and of latitude take the same number of pixels.',
    'Speed and bearing are computed per row in JS; the bearing becomes an `angle` `{ fn }` (degrees counter-clockwise from east, where Plot’s `rotate` is clockwise from north).',
    '`size` is half the arrow’s length, so the arrow is scaled as a whole: its wings grow with it, as in Plot.',
  ],
  recreation: {
    code: `const wind = (await plotData('observablehq__plot-wind-map', 'wind.csv'))
  .map(d => ({ ...d, speed: Math.hypot(d.u, d.v) }));
const maxSpeed = d3.max(wind, d => d.speed), median = d3.median(wind, d => d.speed);
const arrow = 'M-10,0L10,0M6,-4L10,0L6,4';   // drawn pointing east, centred on the row

mount(Elicit({
  width: 480, height: 405,
  margins: { top: 8, right: 8, bottom: 28, left: 36 },
  data: wind,
  schema: {
    longitude: { type: 'quantitative', domain: [-10.5, 10.5] },
    latitude:  { type: 'quantitative', domain: [44.6, 60.4] },
    u: { type: 'quantitative' }, v: { type: 'quantitative' },
    speed: { type: 'quantitative', domain: [0, maxSpeed] },
  },
  axes: { x: { title: 'longitude →' }, y: { title: '↑ latitude' } },
  marks: [
    shape({
      path: arrow, fill: 'none', strokeWidth: 1,
      channels: {
        x: { field: 'longitude' }, y: { field: 'latitude' },
        angle: { fn: d => Math.atan2(d.v, d.u) * 180 / Math.PI },          // where the wind blows to
        size: { field: 'speed', scale: { range: [0, 4.5 * maxSpeed / median] } },   // the median arrow is 9px
        stroke: { field: 'speed', scale: { scheme: 'turbo' }, legend: { anchor: 'top', title: 'Speed (m/s)' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Point the wind',
      question: 'Over the Bay of Biscay on a stormy day, which way and how hard do you think the wind blows at these six points?',
      try: 'Drag an arrow’s tip: it turns to face the pointer, and stretches or shrinks to reach it.',
      why: 'The arrows are the recreation’s `shape`. `rotate()` on `angle` reads the pointer’s bearing from the arrow’s centre and `resize()` on `size` reads its distance, so the two edits take different components of one drag. `clamp()` keeps a breath of wind in every arrow.',
      uses: ['shape', 'rotate()', 'resize()', 'clamp()'],
      code: `const stations = [[-6, 47], [-3, 47], [0, 47], [-6, 50], [-3, 50], [0, 50]];

mount(Elicit({
  width: 420, height: 340,
  margins: { top: 10, right: 10, bottom: 28, left: 36 },
  data: stations.map(([longitude, latitude]) => ({ longitude, latitude, dir: 0, speed: 8 })),   // a westerly to start
  schema: {
    longitude: { type: 'quantitative', domain: [-8.5, 2.5] },
    latitude:  { type: 'quantitative', domain: [45, 52] },
    dir:   { type: 'quantitative', domain: [0, 360] },
    speed: { type: 'quantitative', domain: [0, 25] },
  },
  constraints: [clamp({ field: 'speed', min: 1, max: 25 })],
  axes: { x: { grid: true, title: 'longitude →' }, y: { grid: true, title: '↑ latitude' } },
  marks: [
    shape({
      path: 'M-10,0L10,0M6,-4L10,0L6,4', fill: 'none', stroke: '#2563eb', strokeWidth: 2.5,
      channels: {
        x: { field: 'longitude' }, y: { field: 'latitude' },
        angle: { field: 'dir', scale: { range: [0, 360] },
                 edit: rotate({ pick: 'direct', pivot: 'mark', fold: false }) },    //! the bearing: where the tip points
        size:  { field: 'speed', scale: { range: [0, 50] }, edit: resize() },     //! the speed: how far the tip reaches
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-election-wind-map',
  status: 'partial',
  verdict: 'One arrow per county, tilted right and red or left and blue by the 2020 winner, with length √(margin × votes), over state and nation outlines — drawn as arrow-shaped polylines computed in JS on the pre-projected atlas.',
  needs: ['vector-mark'],
  prep: ['prep-geo', 'prep-lookup', 'prep-calculate'],
  gaps: [
    'No vector mark under a projection: each arrow is a five-point `geoLine` computed in JS (Plot’s `vector` with `anchor: "start"` and a sqrt length scale). A `shape` arrow with `angle` and `size` draws the same vector on x/y scales (see the wind map), but a projection chart takes only `geo*` marks — mixing them warns — and `geoPoint` has no symbol channel.',
    'Uses the pre-projected Albers atlas (the choropleth notebook’s attachment) with an identity projection, where the original projects the unprojected atlas with `albers-usa`; the geometry is the same.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');
const election = new Map(d3.csvParse(await plotData('observablehq__plot-election-wind-map', 'us-presidential-election-2020.csv', { type: 'text' }))
  .map(d => [d.fips, { margin: +d.margin2020, votes: +d.votes }]));
const nation = topojson.feature(us, us.objects.nation);
const proj = d3.geoIdentity().fitExtent([[0, 0], [472, 292]], nation);
const k = proj.scale();
const counties = topojson.feature(us, us.objects.counties).features
  .filter(f => election.has(f.id) && !isNaN(election.get(f.id).margin));
// Plot's sqrt length scale: the largest vector is 60px on its 640px-wide map.
const len = d3.scaleSqrt([0, d3.max(counties, f => Math.abs(election.get(f.id).margin * election.get(f.id).votes))], [0, 60 * 472 / 640]);
const rows = counties.map(f => {
  const { margin, votes } = election.get(f.id);
  const [x, y] = d3.geoPath().centroid(f);
  const l = len(Math.abs(margin * votes)) / k, w = l / 5;
  const t = (margin > 0 ? 60 : -60) * Math.PI / 180, dx = Math.sin(t), dy = -Math.cos(t);   // y grows down here
  const at = (a, p) => [x + a * dx - p * dy, y + a * dy + p * dx];
  return { party: margin > 0 ? 'R' : 'D', coordinates: [at(0, 0), at(l, 0), at(l - w, -w), at(l, 0), at(l - w, w)] };
});

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: proj,
  data: rows,
  schema: { party: { type: 'categorical', domain: ['R', 'D'] }, coordinates: { type: 'categorical' } },
  marks: [
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states), fill: 'none', stroke: '#333', strokeWidth: 0.5 }),
    geoBasemap({ geojson: nation, fill: 'none', stroke: '#333', strokeWidth: 1 }),
    geoLine({ strokeWidth: 1, showVertices: false, channels: { coordinates: { field: 'coordinates', scale: null },
      stroke: { field: 'party', scale: { range: ['red', 'blue'] } } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Lean each state',
      question: 'For each of these swing states, which way did it lean in 2020, and by how much?',
      try: 'Click a state to cycle it through: strongly D, leans D, toss-up, leans R, strongly R.',
      why: '`cycle()` on the `fill` of a `geoPolygon` steps an ordinal column through its declared domain; an ordinal colour field gets an ordered diverging ramp, so the map reads as a wind map of colour.',
      uses: ['cycle()', 'ordinal colour'],
      code: `const us = await plotData('observablehq__plot-choropleth', 'counties-albers-10m.json');
const swing = ['Arizona', 'Georgia', 'Michigan', 'Nevada', 'North Carolina', 'Pennsylvania', 'Wisconsin', 'Florida', 'Texas', 'Ohio'];
const lean = ['strongly D', 'leans D', 'toss-up', 'leans R', 'strongly R'];
const states = topojson.feature(us, us.objects.states).features;

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  projection: d3.geoIdentity().fitExtent([[0, 0], [380, 292]], topojson.feature(us, us.objects.nation)),
  data: states.filter(f => swing.includes(f.properties.name))
    .map(f => ({ state: f.properties.name, geometry: f.geometry, lean: 'toss-up' })),
  schema: {
    state: { type: 'categorical' }, geometry: { type: 'categorical' },
    lean: { type: 'ordinal', domain: lean },                       //! ordered: a diverging ramp
  },
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.states), fill: '#f4f4f4', stroke: '#ccc' }),
    geoPolygon({ stroke: '#333', strokeWidth: 0.6,
      channels: { geometry: { field: 'geometry', scale: null },
        fill: { field: 'lean', scale: { scheme: 'rdbu' }, legend: true, edit: cycle() } } }),   //! click to cycle
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-perlin-noise',
  status: 'full',
  verdict: 'A field of 4,000 short arrows whose angle and length follow 2-D gradient noise: one `shape` per point, an arrow path turned by `angle` and sized by `size`. The noise and the point sampler are written inline rather than imported, so the pattern is not the original’s.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The original imports `perlin2`, `octave` and a Poisson-disc sampler from other notebooks; here a small inline gradient noise and a jittered grid stand in, so the pattern differs.',
    'Plot’s `rotate` (clockwise from north) becomes `angle` (counter-clockwise from east): `90 − noise × 360`.',
  ],
  recreation: {
    code: `// A small seeded 2-D gradient noise (Perlin's scheme), two octaves.
const rand = d3.randomLcg(42);
const perm = d3.shuffler(rand)(d3.range(256)); const P = [...perm, ...perm];
const grad = h => [Math.cos(h * Math.PI / 128), Math.sin(h * Math.PI / 128)];
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
function perlin(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
  const dot = (i, j) => { const [gx, gy] = grad(P[P[X + i] + Y + j]); return gx * (xf - i) + gy * (yf - j); };
  const u = fade(xf), v = fade(yf);
  return lerp(lerp(dot(0, 0), dot(1, 0), u), lerp(dot(0, 1), dot(1, 1), u), v);
}
const noise = (x, y) => perlin(x + 0.5, y + 0.5) + perlin(2 * x, 2 * y) / 2;
// A jittered 63 × 63 grid stands in for the Poisson-disc sampler (≈ 4,000 points).
const rows = d3.cross(d3.range(63), d3.range(63)).map(([i, j]) => {
  const x = (i + 0.2 + 0.6 * rand()) * 2 / 63, y = (j + 0.2 + 0.6 * rand()) * 2 / 63;
  return { x, y, length: noise(x + 2, y) + 0.5, rotate: noise(x, y) * 360 };
});
const median = d3.median(rows, d => d.length);

mount(Elicit({
  width: 470, height: 470,
  margins: { top: 6, right: 6, bottom: 6, left: 6 },
  axes: false,
  data: rows,
  schema: {
    x: { type: 'quantitative', domain: [0, 2] },
    y: { type: 'quantitative', domain: [0, 2] },
    length: { type: 'quantitative', domain: [0, d3.max(rows, d => d.length)] },
    rotate: { type: 'quantitative' },
  },
  marks: [
    shape({
      path: 'M-10,0L10,0M6,-4L10,0L6,4', fill: 'none', stroke: '#333', strokeWidth: 1,
      channels: {
        x: { field: 'x' }, y: { field: 'y' },
        angle: { fn: d => 90 - d.rotate },                                        // Plot's rotate, as an angle
        size: { field: 'length', scale: { range: [0, 2.75 * d3.max(rows, d => d.length) / median] } },  // median 5.5px
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sketch a streamline',
      question: 'Drop a leaf at the green dot on the left edge of this flow. Draw the path you think it follows.',
      try: 'Drag across the field to draw the leaf’s path.',
      why: 'The field is the recreation’s `shape` arrows, inert. `edit.line.draw()` on a `path` turns one drag into a new series of rows, a point every few pixels, on the same x/y scales, so the answer can be compared with integrating the field from the start point.',
      uses: ['shape', 'edit.line.draw()', 'path'],
      code: `const rand = d3.randomLcg(42);
const field = (x, y) => Math.sin(2.2 * x + 1.3 * Math.cos(1.7 * y)) * 1.2;   // a smooth stand-in field, in radians
const arrows = d3.range(500).map(() => { const x = 2 * rand(), y = 2 * rand(); return { x, y, angle: field(x, y) * 180 / Math.PI }; });

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 6, right: 6, bottom: 6, left: 6 },
  axes: false,
  schema: {
    data:   { leaf: { type: 'categorical' },                       // one series per drawn path
              x: { type: 'quantitative', domain: [0, 2] }, y: { type: 'quantitative', domain: [0, 2] } },
    arrows: { context: true,                                       //! the field: read-only context rows
              fields: { x: { type: 'quantitative' }, y: { type: 'quantitative' }, angle: { type: 'quantitative' } } },
  },
  data: { data: [], arrows },
  marks: [
    shape({ table: 'arrows', path: 'M-10,0L10,0M6,-4L10,0L6,4', size: 5, fill: 'none', stroke: '#bbb',
      channels: { x: { field: 'x' }, y: { field: 'y' }, angle: { field: 'angle', scale: null } } }),
    point({ size: 5, fill: '#16a34a', channels: { x: { datum: 0.05 }, y: { datum: 1 } } }),
    path({ stroke: '#16a34a', strokeWidth: 3,
      channels: { series: { field: 'leaf' }, x: { field: 'x' }, y: { field: 'y' } },
      edits: [edit.line.draw({ series: 'leaf', minDist: 6 })] }),    //! one drag = one streamline
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-tree-tidy',
  status: 'partial',
  verdict: 'The flare class hierarchy is drawn as a tidy tree — dots, horizontal Bézier links and end/start-anchored labels — but the hierarchy and its layout are computed with `d3.stratify` and `d3.tree` in JS; the network `link` mark only draws the result.',
  needs: ['tree'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'No tree transform: `d3.stratify().path()` builds the hierarchy from the dotted names and `d3.tree()` lays it out, then the nodes and parent→child links become the two tables of a network.',
    'Links are `curve: "bezier"` pinned to the right of the parent and the left of the child, which matches Plot’s `bump-x`.',
    'Shorter than the original (1,500px vs 1,800px), so leaves are packed tighter.',
  ],
  recreation: {
    code: `const flare = await plotData('flare');
const root = d3.stratify().path(d => d.name.replaceAll('.', '/'))(flare);
d3.tree().size([1, 1])(root);
const nodes = root.descendants().map(n => ({ id: n.id, name: n.id.split('/').pop(), leaf: !n.children, x: n.y, y: 1 - n.x }));
const links = root.links().map(l => ({ source: l.source.id, target: l.target.id }));

mount(Elicit({
  width: 480, height: 1500,
  margins: { top: 10, right: 120, bottom: 10, left: 40 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, name: { type: 'categorical' }, leaf: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [0, 1] } },
      links: { source: { type: 'ref' }, target: { type: 'ref' } },
    },
  },
  data: { nodes, links },
  marks: [
    link({ curve: 'bezier', sourceSide: 'right', targetSide: 'left', inset: 0, stroke: '#555', strokeOpacity: 0.4, strokeWidth: 1.5 }),
    point({ size: 2.5, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    text({ fontSize: 9, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'name' },
      textAnchor: { fn: d => d.leaf ? 'start' : 'end' }, dx: { fn: d => d.leaf ? 6 : -6 } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Re-parent the classes',
      question: 'Each of these flare.vis classes has been filed under the wrong package. Move each one to the package you think it belongs to.',
      try: 'Hover a class’s link, then drag the handle at its left (parent) end onto another package.',
      why: '`edit.network.rewire({ channels: ["source"] })` puts a handle on the parent end only, so a drag re-points `source` and nothing else. `lock` keeps the package links fixed, so the answer is just the six class rows.',
      uses: ['edit.network.rewire()', 'lock', 'link'],
      code: `const packages = ['axis', 'controls', 'data', 'events', 'legend', 'operator'];
const classes = ['CartesianAxes', 'ClickControl', 'DataSprite', 'SelectionEvent', 'LegendItem', 'Labeler'];
const spread = (list, i) => 1 - (i + 0.5) / list.length;

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 10, right: 100, bottom: 10, left: 30 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, leaf: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [0, 1] } },
      links: { directed: true, fields: { source: { type: 'ref' }, target: { type: 'ref' }, fixed: { type: 'categorical' } } },
    },
  },
  data: {
    nodes: [
      { id: 'vis', leaf: 'no', x: 0, y: 0.5 },
      ...packages.map((id, i) => ({ id, leaf: 'no', x: 0.45, y: spread(packages, i) })),
      ...classes.map((id, i) => ({ id, leaf: 'yes', x: 1, y: spread(classes, i) })),
    ],
    links: [
      ...packages.map(p => ({ source: 'vis', target: p, fixed: 'yes' })),
      // every class starts filed under the wrong package
      ...classes.map((c, i) => ({ source: packages[(i + 3) % 6], target: c, fixed: 'no' })),
    ],
  },
  lock: (d, table) => table === 'links' && d.fixed === 'yes',       //! the package level is given
  marks: [
    link({ curve: 'bezier', sourceSide: 'right', targetSide: 'left', inset: 0, arrow: 'none',
      stroke: '#555', strokeOpacity: 0.6, strokeWidth: 1.5,
      edits: [edit.network.rewire({ channels: ['source'] })] }),     //! drag a link’s parent end
    point({ size: 4, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    text({ fontSize: 11, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' },
      textAnchor: { fn: d => d.leaf === 'yes' ? 'start' : 'end' }, dx: { fn: d => d.leaf === 'yes' ? 7 : -7 },
      dy: { fn: d => d.leaf === 'yes' ? 0 : -9 } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-cluster-diagram',
  status: 'partial',
  verdict: 'The flare hierarchy as a dendrogram — every leaf at the same depth, children sorted by height — is drawn by the network `link` mark, with `d3.cluster` doing the layout in JS.',
  needs: ['tree'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'No cluster transform: `d3.stratify` + `d3.cluster` (sorted by `node.height`, like `treeSort: "node:height"`) produce the positions.',
    'No white halo behind labels (`textStroke`).',
    'The long root → vis link swings out past the left edge: a pinned-side bezier spanning most of the height overshoots where Plot’s `bump-x` does not.',
    'Shorter than the original (1,700px vs 2,400px).',
  ],
  recreation: {
    code: `const flare = await plotData('flare');
const root = d3.stratify().path(d => d.name.replaceAll('.', '/'))(flare)
  .sort((a, b) => d3.ascending(a.height, b.height));
d3.cluster().size([1, 1])(root);
const nodes = root.descendants().map(n => ({ id: n.id, name: n.id.split('/').pop(), leaf: !n.children, x: n.y, y: 1 - n.x }));
const links = root.links().map(l => ({ source: l.source.id, target: l.target.id }));

mount(Elicit({
  width: 480, height: 1700,
  margins: { top: 10, right: 130, bottom: 10, left: 40 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, name: { type: 'categorical' }, leaf: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [0, 1] } },
      links: { source: { type: 'ref' }, target: { type: 'ref' } },
    },
  },
  data: { nodes, links },
  marks: [
    link({ curve: 'bezier', sourceSide: 'right', targetSide: 'left', inset: 0, stroke: '#555', strokeOpacity: 0.4, strokeWidth: 1.5 }),
    point({ size: 2.5, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    text({ fontSize: 9, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'name' },
      textAnchor: { fn: d => d.leaf ? 'start' : 'end' }, dx: { fn: d => d.leaf ? 6 : -6 } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Build the dendrogram',
      question: 'Here are four flare.physics classes and the two ideas they implement. Draw the dendrogram: connect each idea to the classes that belong to it.',
      try: 'Shift-drag from a dot on the left to a dot on the right to add a branch; Alt-click a branch to remove it.',
      why: '`edit.network.connect({ when: when.shift })` on the node mark mints a links row from the drag, starting from an empty links table, and `remove()` on the `link` deletes one. The same bezier `link` as the recreation draws each answer as a dendrogram branch.',
      uses: ['edit.network.connect()', 'remove()', 'when.shift'],
      code: `const ideas = ['forces', 'bodies'];
const leaves = ['GravityForce', 'SpringForce', 'Particle', 'Spring'];

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 16, right: 110, bottom: 16, left: 80 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, leaf: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 1] }, y: { type: 'quantitative', domain: [0, 1] } },
      links: { directed: true, fields: { source: { type: 'ref' }, target: { type: 'ref' } } },
    },
  },
  data: {
    nodes: [
      ...ideas.map((id, i) => ({ id, leaf: 'no', x: 0, y: 0.75 - i * 0.5 })),
      ...leaves.map((id, i) => ({ id, leaf: 'yes', x: 1, y: 1 - i / 3 })),
    ],
    links: [],                                                      //! nothing given: you draw every branch
  },
  marks: [
    link({ curve: 'bezier', sourceSide: 'right', targetSide: 'left', inset: 0, arrow: 'none',
      stroke: '#555', strokeWidth: 2, edits: [remove({ when: when.alt })] }),
    point({ size: 6, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y' } },
      edits: [edit.network.connect({ when: when.shift })] }),     //! Shift-drag to add a branch
    text({ fontSize: 12, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' },
      textAnchor: { fn: d => d.leaf === 'yes' ? 'start' : 'end' }, dx: { fn: d => d.leaf === 'yes' ? 10 : -10 } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-custom-tree-layout',
  status: 'partial',
  verdict: 'The indented tree — depth on x, pre-order index on y, step links — is reproduced from a hand-computed layout (the same three-line `eachBefore` the original passes as `treeLayout`), drawn by the network `link` mark.',
  needs: ['tree'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'No tree transform with a pluggable `treeLayout`: the indent layout runs on a `d3.stratify` hierarchy in JS.',
    'Links are `curve: "stepBefore"` from the bottom of the parent to the left of the child; Plot’s `step-before` curve leaves the parent’s centre.',
    'Shorter than the original (2,600px vs 3,600px).',
  ],
  recreation: {
    code: `const flare = await plotData('flare');
const root = d3.stratify().path(d => d.name.replaceAll('.', '/'))(flare);
const nodes = [];
root.eachBefore((n, i) => nodes.push({ id: n.id, name: n.id.split('/').pop(), x: n.depth, y: -i }));   // the indent layout
const links = root.links().map(l => ({ source: l.source.id, target: l.target.id }));

mount(Elicit({
  width: 300, height: 2600,
  margins: { top: 10, right: 130, bottom: 10, left: 10 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, name: { type: 'categorical' },
               x: { type: 'quantitative', domain: [0, 4] }, y: { type: 'quantitative', domain: [-(nodes.length - 1), 0] } },
      links: { source: { type: 'ref' }, target: { type: 'ref' } },
    },
  },
  data: { nodes, links },
  marks: [
    link({ curve: 'stepBefore', sourceSide: 'bottom', targetSide: 'left', inset: 0, cornerRadius: 0,
      stroke: '#555', strokeOpacity: 0.5, strokeWidth: 1 }),
    point({ size: 2.5, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    text({ fontSize: 9, textAnchor: 'start', dx: 6, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'name' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rank the packages',
      question: 'Which of flare’s top-level packages holds the most classes? Order them, largest first.',
      try: 'Drag a package up or down the list.',
      why: 'The children of the root sit at an `ordinal` rank; `rank()` on `y` reorders them, and the step links re-route on every render because they join to the node table by id. The order is the answer.',
      uses: ['rank()', 'link'],
      code: `const packages = ['analytics', 'animate', 'data', 'display', 'flex', 'physics', 'query', 'scale', 'util', 'vis'];

mount(Elicit({
  width: 300, height: 340,
  margins: { top: 10, right: 100, bottom: 10, left: 10 },
  axes: false,
  schema: {
    structure: 'network',
    tables: {
      nodes: { id: { type: 'categorical', key: true }, x: { type: 'quantitative', domain: [0, 1] },
               y: { type: 'ordinal', domain: d3.range(10, -1, -1) } },      // y is the rank; 0 (the root) on top
      links: { source: { type: 'ref' }, target: { type: 'ref' } },
    },
  },
  data: {
    nodes: [{ id: 'flare', x: 0, y: 0 }, ...packages.map((id, i) => ({ id, x: 0.25, y: i + 1 }))],
    links: packages.map(p => ({ source: 'flare', target: p })),
  },
  lock: (d, table) => table === 'nodes' && d.id === 'flare',
  marks: [
    link({ curve: 'stepBefore', sourceSide: 'bottom', targetSide: 'left', inset: 0, cornerRadius: 0,
      stroke: '#555', strokeOpacity: 0.6 }),
    point({ size: 4, fill: '#555', channels: { x: { field: 'x' }, y: { field: 'y', edit: rank() } } }),   //! drag to reorder
    text({ fontSize: 12, textAnchor: 'start', dx: 8, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'id' } } }),
  ],
}));`,
    },
  ],
});
