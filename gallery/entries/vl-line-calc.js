// Vega-Lite gallery: "Line Charts" and "Advanced Calculations".
// Line charts are the classic you-draw-it instrument; the calculation examples are
// VL transforms, which ElicitJS does not have — they are computed in plain JS first,
// and the interfaces ask about the DERIVED quantity (the deviation, the delta, the rank).

// ---------------------------------------------------------------- Line charts

GALLERY.add({
  id: 'vl-line',
  status: 'full',
  verdict: 'A `lineY` over the Google rows of `stocks.csv`; the filter is a line of JS.',
  prep: ['prep-calculate'],
  gaps: ['Dates are parsed in JS (`new Date`), since the CSV holds "Jan 1 2000" strings.'],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: goog,
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the crash',
      question: 'Google closed 2007 near $690. Draw its monthly price through March 2010.',
      try: 'Sweep left to right across the shaded months, then press Reveal.',
      why: 'The observed months are locked by a predicate, so the sweep paints only the seeded future rows. `stage: 0` retires the edit once you reveal, and the answer is a guide that only draws at stage 1, so it never enters `getData()`.',
      uses: ['edit.line.sweep()', 'lock', 'stage', 'guides.custom()'],
      code: `const all = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));
const cut = new Date(2008, 0, 1);
const seen = all.filter((d) => d.date < cut);
const truth = all.filter((d) => d.date >= cut);
const last = seen[seen.length - 1].price;
// The months to predict start flat at the last close.
const future = truth.map((d) => ({ date: d.date, price: last }));

const chart = mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: [...seen, ...future],
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  lock: (d) => d.date < cut,                                  //! the record is fact
  stageLabels: ['draw', 'revealed'],
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  guides: [
    guides.region({ x: [cut, all[all.length - 1].date], fill: '#94a3b8', opacity: 0.12 }),
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [{   //! the answer, drawn after the reveal
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2.5,
      points: truth.map((d) => [scales.x.encode(d.date), scales.y.encode(d.price)]),
    }]),
  ],
  marks: [
    lineY({
      handleSize: 2.5,
      channels: {
        x: { field: 'date' },
        y: { field: 'price', edit: edit.line.sweep({ stage: 0 }) }, //! paint the months you cross
      },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_overlay',
  status: 'full',
  verdict: 'Yearly mean price per company, one `lineY` grouped and coloured by `symbol`; `handles: true` draws the points on a line that carries no edit.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['The year is a number on a linear axis rather than a VL time unit.'],
  recreation: {
    code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, year: new Date(d.date).getFullYear(), price: d.price }));
const data = d3.flatRollup(rows, (v) => d3.mean(v, (d) => d.price), (d) => d.symbol, (d) => d.year)
  .map(([symbol, year, price]) => ({ symbol, year, price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    year:   { type: 'quantitative', domain: [2000, 2010] },
    price:  { type: 'quantitative', domain: [0, 600] },
  },
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'Mean of price' } },
  marks: [
    lineY({
      handles: true, handleSize: 3,                   // VL's point: true
      channels: {
        x: { field: 'year' }, y: { field: 'price' },
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag the next year',
      question: "Where will each company's average share price land in 2011?",
      try: 'Drag each right-hand point up or down.',
      why: '`move()` on `y` drags a handle vertically only, so the year stays put. `lock` fixes the observed years by predicate, and `clamp()` keeps every answer on the axis.',
      uses: ['move()', 'lock', 'clamp()'],
      code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, year: new Date(d.date).getFullYear(), price: d.price }));
const seen = d3.flatRollup(rows, (v) => d3.mean(v, (d) => d.price), (d) => d.symbol, (d) => d.year)
  .map(([symbol, year, price]) => ({ symbol, year, price }))
  .filter((d) => d.year >= 2005);
// One free row per company for 2011, starting at its 2010 level.
const next = seen.filter((d) => d.year === 2010).map((d) => ({ ...d, year: 2011 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data: [...seen, ...next],
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    year:   { type: 'quantitative', domain: [2005, 2011] },
    price:  { type: 'quantitative', domain: [0, 600] },
  },
  lock: (d) => d.year < 2011,                         //! only 2011 is yours
  constraints: [clamp({ min: 0, max: 600 })],         //! answers stay on the axis
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'Mean of price' } },
  marks: [
    lineY({
      handleSize: 4,
      channels: {
        x: { field: 'year' },
        y: { field: 'price', edit: move() },        //! vertical drag on each point
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_overlay_stroked',
  status: 'full',
  verdict: 'The same yearly means, with a `point` mark over the same rows: a white fill and a `stroke` on `symbol` make hollow points ringed in the series colour.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['The year is a number on a linear axis rather than a VL time unit.'],
  recreation: {
    code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, year: new Date(d.date).getFullYear(), price: d.price }));
const data = d3.flatRollup(rows, (v) => d3.mean(v, (d) => d.price), (d) => d.symbol, (d) => d.year)
  .map(([symbol, year, price]) => ({ symbol, year, price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    year:   { type: 'quantitative', domain: [2000, 2010] },
    price:  { type: 'quantitative', domain: [0, 600] },
  },
  axes: { x: { title: 'year', tickFormat: 'd' }, y: { grid: true, title: 'Mean of price' } },
  marks: [
    lineY({
      strokeWidth: 2,
      channels: {
        x: { field: 'year' }, y: { field: 'price' },
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
    point({
      size: 3.5, fill: 'white', strokeWidth: 1.5,
      channels: { x: { field: 'year' }, y: { field: 'price' }, stroke: { field: 'symbol' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Click to extend',
      question: 'Extend any company into 2011 and 2012: where do its yearly averages go?',
      try: 'Click just right of a line, in the shaded years, to add its next point.',
      why: '`edit.line.anchor()` appends a point to the NEAREST line, so one click both picks the company and places the value. `snap()` rounds the year to a whole one and `clamp()` keeps it in the forecast years. The mark carries no other edit, so the observed years cannot move.',
      uses: ['edit.line.anchor()', 'snap()', 'clamp()'],
      code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, year: new Date(d.date).getFullYear(), price: d.price }));
const data = d3.flatRollup(rows, (v) => d3.mean(v, (d) => d.price), (d) => d.symbol, (d) => d.year)
  .map(([symbol, year, price]) => ({ symbol, year, price }))
  .filter((d) => d.year >= 2006);

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    year:   { type: 'quantitative', domain: [2006, 2012] },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  constraints: [
    snap({ field: 'year', step: 1 }),                    //! whole years only
    clamp({ field: 'year', min: 2011, max: 2012 }),      //! only the forecast years
  ],
  guides: [guides.region({ x: [2010.5, 2012], fill: '#94a3b8', opacity: 0.12 })],
  axes: { x: { title: 'year', tickFormat: 'd' }, y: { grid: true, title: 'Mean of price' } },
  marks: [
    lineY({
      handleSize: 4, strokeWidth: 2,
      channels: {
        x: { field: 'year' },
        y: { field: 'price' },
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
      edits: [edit.line.anchor({ series: 'symbol', threshold: 150 })], //! click joins the nearest line
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_color',
  status: 'full',
  verdict: 'Five price series in one `lineY`, grouped and coloured by a `stroke` field.',
  prep: ['prep-calculate'],
  gaps: ['Legend labels sit in a slightly different layout; palette differs.'],
  recreation: {
    code: `const data = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      channels: {
        x: { field: 'date' }, y: { field: 'price' },
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep each stock',
      question: 'The data stops in March 2010. Draw each company through the rest of 2010.',
      try: 'Sweep across the shaded months near one line; repeat for the others.',
      why: 'A sweep locks onto the NEAREST series at drag-start and paints only that line, so one mark holds five independent forecasts. The predicate `lock` keeps the observed months out of reach.',
      uses: ['edit.line.sweep()', 'lock', 'guides.region()'],
      code: `const all = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2008, 0, 1));
const cut = new Date(2010, 2, 15);
// Nine free months per company, flat at its March 2010 price.
const future = d3.groups(all, (d) => d.symbol).flatMap(([symbol, v]) =>
  d3.range(3, 12).map((m) => ({ symbol, date: new Date(2010, m, 1), price: v[v.length - 1].price })));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data: [...all, ...future],
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  lock: (d) => d.date < cut,                                  //! observed months are fixed
  guides: [guides.region({ x: [cut, new Date(2010, 11, 1)], fill: '#94a3b8', opacity: 0.12 })],
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      handleSize: 2,
      channels: {
        x: { field: 'date' },
        y: { field: 'price', edit: edit.line.sweep() },       //! paints the nearest line only
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-repeat_layer',
  status: 'full',
  verdict: 'The repeat-layer is a fold: the two gross columns become one long table with a `measure` series, binned and averaged in JS.',
  prep: ['prep-bin', 'prep-aggregate', 'prep-reshape'],
  gaps: ['Values are shown in millions of dollars.', 'Each line point sits at its bin midpoint.'],
  recreation: {
    code: `const movies = await vegaData('movies.json');
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(1, 10))
  .value((d) => d['IMDB Rating'])(movies.filter((d) => d['IMDB Rating'] != null));
// Fold: one row per (bin, measure).
const data = bins.flatMap((b) => ['US Gross', 'Worldwide Gross'].map((measure) => ({
  measure,
  rating: (b.x0 + b.x1) / 2,
  gross: d3.mean(b, (d) => d[measure]) / 1e6,
}))).filter((d) => d.gross != null);

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 54 },
  data,
  schema: {
    measure: { type: 'categorical', domain: ['US Gross', 'Worldwide Gross'] },
    rating:  { type: 'quantitative', domain: [1, 10] },
    gross:   { type: 'quantitative', domain: [0, 300] },
  },
  axes: { x: { title: 'IMDB Rating (binned)' }, y: { grid: true, tickFormat: '$~s', title: 'Mean of US and Worldwide Gross ($M)' } },
  marks: [
    lineY({
      strokeWidth: 2,
      channels: {
        x: { field: 'rating' }, y: { field: 'gross' },
        stroke: { field: 'measure', legend: { labelWidth: 96 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the world line',
      question: 'Given what films earn in the US at each IMDB rating, how much do they earn worldwide?',
      try: 'Sweep across the chart to draw the worldwide average.',
      why: 'The US line is locked by a predicate on its series, so a sweep only ever paints the worldwide line, which starts flat. `clamp()` keeps every value on the axis.',
      uses: ['edit.line.sweep()', 'lock', 'clamp()'],
      code: `const movies = await vegaData('movies.json');
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(1, 10))
  .value((d) => d['IMDB Rating'])(movies.filter((d) => d['IMDB Rating'] != null));
const us = bins.map((b) => ({
  measure: 'US Gross', rating: (b.x0 + b.x1) / 2, gross: d3.mean(b, (d) => d['US Gross']) / 1e6,
})).filter((d) => d.gross != null);
// The worldwide line starts flat, mid-axis: a neutral prior.
const world = us.map((d) => ({ ...d, measure: 'Worldwide Gross', gross: 150 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 54 },
  data: [...us, ...world],
  schema: {
    measure: { type: 'categorical', domain: ['US Gross', 'Worldwide Gross'] },
    rating:  { type: 'quantitative', domain: [1, 10] },
    gross:   { type: 'quantitative', domain: [0, 300] },
  },
  lock: (d) => d.measure === 'US Gross',                     //! the US line is given
  constraints: [clamp({ min: 0, max: 300 })],
  axes: { x: { title: 'IMDB Rating (binned)' }, y: { grid: true, tickFormat: '$~s', title: 'Mean of US and Worldwide Gross ($M)' } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 3,
      channels: {
        x: { field: 'rating' },
        y: { field: 'gross', edit: edit.line.sweep() },        //! sweep the free line
        stroke: { field: 'measure', legend: { labelWidth: 96 } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_color_halo',
  status: 'full',
  verdict: 'Two `lineY` marks over the same rows: a wide white one underneath gives every coloured line a halo where it crosses another.',
  prep: ['prep-calculate'],
  gaps: ['The pivot + repeat in the original is a workaround for VL; here the long table is drawn directly.'],
  recreation: {
    code: `const data = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({ stroke: 'white', strokeWidth: 4,
            channels: { x: { field: 'date' }, y: { field: 'price' }, series: { field: 'symbol' } } }),
    lineY({
      channels: {
        x: { field: 'date' }, y: { field: 'price' },
        stroke: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw Amazon',
      question: "You see four tech stocks. Draw Amazon's share price from 2000 to 2010.",
      try: 'Press and drag left to right to draw; drag over your line again to reshape it.',
      why: '`edit.line.draw()` lays a point down in each sample column the pointer crosses, so one stroke draws the whole line. The four known stocks sit in a `context: true` table, drawn by the same halo and colour marks as the recreation, so they stay readable under your stroke and never enter `getData()`.',
      uses: ['edit.line.draw()', 'context table'],
      code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }));
const others = rows.filter((d) => d.symbol !== 'AMZN');

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data: { data: [], history: others },
  schema: {
    data: {
      s:     { type: 'categorical' },
      date:  { type: 'temporal', domain: [new Date(2000, 0, 1), new Date(2010, 2, 1)] },
      price: { type: 'quantitative', domain: [0, 800] },
    },
    history: { context: true, fields: {                         //! the known stocks: drawn, never reported
      symbol: { type: 'categorical', domain: ['AAPL', 'GOOG', 'IBM', 'MSFT'] },
      date:   { type: 'temporal' },
      price:  { type: 'quantitative' },
    } },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({ table: 'history', stroke: 'white', strokeWidth: 4,
            channels: { x: { field: 'date' }, y: { field: 'price' }, series: { field: 'symbol' } } }),
    lineY({ table: 'history', strokeWidth: 1.5, opacity: 0.7,
            channels: { x: { field: 'date' }, y: { field: 'price' },
                        stroke: { field: 'symbol', legend: { labelWidth: 40 } } } }),
    lineY({
      stroke: '#e8833a', strokeWidth: 3, handleSize: 2.5,
      channels: { series: { field: 's' }, x: { field: 'date' }, y: { field: 'price' } },
      edits: [edit.line.draw({ series: 's', samples: 21 })],   //! one stroke draws 21 points
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_slope',
  status: 'full',
  verdict: 'A slope graph is a `lineY` over an ordinal x with two categories, one series per site.',
  prep: ['prep-aggregate'],
  gaps: ['Lines carry no end labels in either version; the legend does the naming.'],
  recreation: {
    code: `const barley = await vegaData('barley.json');
const data = d3.flatRollup(barley, (v) => d3.median(v, (d) => d.yield), (d) => d.site, (d) => d.year)
  .map(([site, year, yield_]) => ({ site, year: String(year), median: yield_ }));

mount(Elicit({
  width: 260, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    site:   { type: 'categorical', domain: [...new Set(data.map((d) => d.site))].sort() },
    year:   { type: 'ordinal', domain: ['1931', '1932'] },
    median: { type: 'quantitative', domain: [0, 60] },
  },
  axes: { x: { title: 'year' }, y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2,
      channels: {
        x: { field: 'year' }, y: { field: 'median' },
        stroke: { field: 'site', legend: { labelWidth: 96 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag both ends',
      question: 'For each Minnesota site, what was the median barley yield in 1931 and in 1932?',
      try: 'Drag either end of a line up or down.',
      why: 'Every line starts flat at the overall median, so a slope only appears when you put one there. `move()` on `y` drags each endpoint on its own, and `snap()` rounds answers to whole bushels.',
      uses: ['move()', 'snap()'],
      code: `const sites = ['Crookston', 'Duluth', 'Grand Rapids', 'Morris', 'University Farm', 'Waseca'];
// A neutral prior: every site flat at 35 bushels/acre in both years.
const data = sites.flatMap((site) => ['1931', '1932'].map((year) => ({ site, year, median: 35 })));

mount(Elicit({
  width: 300, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    site:   { type: 'categorical', domain: sites },
    year:   { type: 'ordinal', domain: ['1931', '1932'] },
    median: { type: 'quantitative', domain: [0, 60] },
  },
  constraints: [snap({ step: 1 })],                         //! whole bushels
  axes: { x: { title: 'year' }, y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 5,
      channels: {
        x: { field: 'year' },
        y: { field: 'median', edit: move() },                //! each end on its own
        stroke: { field: 'site', legend: { labelWidth: 96 } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_step',
  status: 'full',
  verdict: 'The Google line with `curve: "stepAfter"`, the d3 name for VL\'s `step-after` interpolation.',
  prep: ['prep-calculate'],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: goog,
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      curve: 'stepAfter',
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set the staircase',
      question: 'An analyst sets a quarterly price target for Google. What should each quarter through 2011 be?',
      try: 'Sweep across the shaded quarters; each step snaps to $25.',
      why: 'A step curve reads as a value that holds until the next row, so each quarter is one row. `snap()` rounds every painted value to $25, the grain an analyst would quote.',
      uses: ['edit.line.sweep()', 'snap()', 'lock'],
      code: `const seen = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2008, 0, 1));
const cut = new Date(2010, 3, 1);
// One row per quarter, starting at the last close.
const targets = d3.timeMonths(cut, new Date(2012, 0, 1), 3)
  .map((date) => ({ date, price: 550 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: [...seen, ...targets],
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 1000] },
  },
  lock: (d) => d.date < cut,
  constraints: [snap({ step: 25 })],                          //! targets in $25 steps
  guides: [guides.region({ x: [cut, new Date(2012, 0, 1)], fill: '#94a3b8', opacity: 0.12 })],
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      curve: 'stepAfter', handleSize: 3,                       //! a value that holds until the next row
      channels: {
        x: { field: 'date' },
        y: { field: 'price', edit: edit.line.sweep() },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_monotone',
  status: 'full',
  verdict: 'The Google line with `curve: "monotoneX"`, the d3 curve VL\'s `monotone` maps to.',
  prep: ['prep-calculate'],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: goog,
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      curve: 'monotoneX',
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Trace the record',
      question: "Draw Google's all-time-high closing price as it stood at each month.",
      try: 'Sweep along the faint price line. Try dipping: the record line refuses to fall.',
      why: 'A running maximum can only rise, and `monotonic()` holds that for every edit: dip a point and its neighbours are pushed back up to meet it. The monthly price sits in a `context: true` table, so only the derived record is elicited.',
      uses: ['monotonic()', 'edit.line.sweep()', 'context table'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));
// One row per month, starting flat at the first close.
const data = goog.filter((d, i) => i % 2 === 0).map((d) => ({ date: d.date, high: 100 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data, history: goog },
  schema: {
    data: {
      date: { type: 'temporal' },
      high: { type: 'quantitative', domain: [0, 800] },
    },
    history: { context: true, fields: {                         //! the monthly price, as reference
      date:  { type: 'temporal' },
      price: { type: 'quantitative' },
    } },
  },
  constraints: [monotonic({ field: 'high', along: 'date' })],  //! a record can only rise
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({ table: 'history', stroke: '#94a3b8', strokeWidth: 1.5,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    lineY({
      curve: 'monotoneX', strokeWidth: 2.5, stroke: '#4f46e5', handleSize: 2.5,
      channels: {
        x: { field: 'date' },
        y: { field: 'high', edit: edit.line.sweep() },        //! paint the record
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_conditional_axis',
  status: 'partial',
  verdict: 'The 2006-2007 Google line draws and the solid-versus-dashed grid is a rule per tick, but the axis is the point of the example: two-line labels and long January ticks are not expressible.',
  needs: ['axis-custom'],
  prep: ['prep-calculate'],
  gaps: [
    'Tick labels are one line ("Jan 2007" on January, the month otherwise) rather than a month line over a year line.',
    'The conditional grid is a `guides.rule()` per tick (solid on January, `strokeDash: "2 2"` otherwise); tick length and tick dash cannot be set per tick.',
  ],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date.getFullYear() >= 2006 && d.date.getFullYear() <= 2007);
const ticks = d3.timeMonths(new Date(2006, 0, 1), new Date(2008, 0, 1), 3);

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 24, bottom: 32, left: 56 },
  data: goog,
  schema: {
    date:  { type: 'temporal' },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: {
    x: {
      tickValues: ticks,
      tickFormat: (d) => d3.timeFormat(d.getMonth() === 0 ? '%b %Y' : '%b')(d),
    },
    y: { grid: true, title: 'price' },
  },
  guides: ticks.map((d) => guides.rule({                      // solid on January, dashed otherwise
    x: d, stroke: '#cbd5e1', strokeDash: d.getMonth() === 0 ? 'none' : '2 2',
  })),
  marks: [
    lineY({
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Seed, then sweep',
      question: 'You know 2006. Draw Google\'s month-end price through 2007.',
      try: 'Double-click in the right half to drop a flat 2007 line at that price, then sweep it into shape.',
      why: '`edit.line.newSeries()` seeds a whole line at once, one row per sample (here the twelve months of 2007), flat at the double-click\'s value. The sweep then shapes only the new line, because the 2006 rows are locked.',
      uses: ['edit.line.newSeries()', 'edit.line.sweep()', 'lock'],
      code: `const seen = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ s: 'seen', date: new Date(d.date), price: d.price }))
  .filter((d) => d.date.getFullYear() === 2006);
const ticks = d3.timeMonths(new Date(2006, 0, 1), new Date(2008, 0, 1), 3);

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 24, bottom: 32, left: 56 },
  data: seen,
  schema: {
    s:     { type: 'categorical' },
    date:  { type: 'temporal', domain: [new Date(2006, 0, 1), new Date(2007, 11, 1)] },
    price: { type: 'quantitative', domain: [300, 800] },
  },
  lock: 'seed',
  axes: {
    x: {
      tickValues: ticks,
      tickFormat: (d) => d3.timeFormat(d.getMonth() === 0 ? '%b %Y' : '%b')(d),
    },
    y: { grid: true, title: 'price' },
  },
  guides: ticks.map((d) => guides.rule({                      // solid on January, dashed otherwise
    x: d, stroke: '#cbd5e1', strokeDash: d.getMonth() === 0 ? 'none' : '2 2',
  })),
  marks: [
    lineY({
      handleSize: 3,
      channels: {
        series: { field: 's' },
        x: { field: 'date' },
        y: { field: 'price', edit: edit.line.sweep() },
      },
      edits: [edit.line.newSeries({                           //! double-click seeds a whole year
        series: 's',
        samples: d3.timeMonths(new Date(2007, 0, 1), new Date(2008, 0, 1)), //! one row per month
      })],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-connected_scatterplot',
  status: 'full',
  verdict: 'A `path` (a line in sequence order) with an `order` channel on `year`; `handles: true` draws the points on a mark with no edit.',
  gaps: ['Neither version labels the years; the original\'s `side` column is unused.'],
  recreation: {
    code: `const data = (await vegaData('driving.json'))
  .map(({ year, miles, gas }) => ({ year, miles, gas }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data,
  schema: {
    year:  { type: 'quantitative' },
    miles: { type: 'quantitative', domain: [3500, 10500] },
    gas:   { type: 'quantitative', domain: [1, 3.5] },
  },
  axes: { x: { title: 'miles', grid: true }, y: { grid: true } },
  marks: [
    path({
      handles: true, handleSize: 3,                  // VL's point: true
      channels: {
        x: { field: 'miles' }, y: { field: 'gas' },
        order: { field: 'year' },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Extend the path',
      question: 'The record ends in 2010. Where did miles driven and the price of gas go in the years after?',
      try: 'Click to add the next year where you think it landed; drag a new point to adjust it.',
      why: 'On a `path`, `edit.line.anchor()` appends the click to the one sequence, so each click is the next year. A `constraints.custom()` repair numbers the new rows, and `move()` on both axes lets you drag a point anywhere.',
      uses: ['edit.line.anchor()', 'move()', 'constraints.custom()', 'lock'],
      code: `const data = (await vegaData('driving.json'))
  .map(({ year, miles, gas }) => ({ year, miles, gas }))
  .filter((d) => d.year >= 1990);

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data,
  schema: {
    year:  { type: 'quantitative' },
    miles: { type: 'quantitative', domain: [7000, 11000] },
    gas:   { type: 'quantitative', domain: [1, 4] },
  },
  lock: 'seed',
  constraints: [
    // A new point is the year after the last one.
    constraints.custom(({ data }) => data.some((d) => d.year == null)  //! number each new point
      ? data.map((d, i) => d.year == null ? { ...d, year: data[i - 1].year + 1 } : d)
      : undefined),
  ],
  axes: { x: { title: 'miles', grid: true }, y: { grid: true } },
  marks: [
    path({
      handleSize: 4,
      channels: { x: { field: 'miles' }, y: { field: 'gas' } },
      edits: [
        move({ channels: ['x', 'y'] }),                      //! drag a point in 2-D
        edit.line.anchor({ channels: ['x', 'y'] }),          //! click appends the next year
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_bump',
  status: 'full',
  verdict: 'A `lineY` over a categorical y: each build\'s result is a category, and the line hops between them.',
  gaps: ['The domain is declared bottom-up (SKIPPED, PASSED, FAILED) to match VL\'s top-down alphabetical order.'],
  recreation: {
    code: `const results = ['PASSED', 'PASSED', 'FAILED', 'FAILED', 'SKIPPED', 'PASSED', 'PASSED', 'FAILED',
  'PASSED', 'PASSED', 'SKIPPED', 'PASSED', 'PASSED', 'FAILED', 'PASSED', 'SKIPPED'];
const data = results.map((result, i) => ({ build: i + 1, result }));

mount(Elicit({
  width: 420, height: 160,
  margins: { top: 16, right: 16, bottom: 32, left: 64 },
  data,
  schema: {
    build:  { type: 'quantitative', domain: [1, 16] },
    result: { type: 'categorical', domain: ['SKIPPED', 'PASSED', 'FAILED'] },
  },
  axes: { x: { title: 'build' } },
  marks: [
    lineY({
      handles: true, handleSize: 3,                  // VL's point: true
      channels: { x: { field: 'build' }, y: { field: 'result' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Click to cycle',
      question: 'Predict the next eight builds: will each pass, fail or be skipped?',
      try: 'Click a point on the right to step it to the next result.',
      why: '`cycle()` steps a categorical field through its declared domain on each click, so a prediction never needs a keyboard. The first sixteen builds are locked by a predicate.',
      uses: ['cycle()', 'lock'],
      code: `const results = ['PASSED', 'PASSED', 'FAILED', 'FAILED', 'SKIPPED', 'PASSED', 'PASSED', 'FAILED',
  'PASSED', 'PASSED', 'SKIPPED', 'PASSED', 'PASSED', 'FAILED', 'PASSED', 'SKIPPED'];
const seen = results.map((result, i) => ({ build: i + 1, result }));
// Eight builds to predict, all starting as PASSED.
const next = d3.range(17, 25).map((build) => ({ build, result: 'PASSED' }));

mount(Elicit({
  width: 420, height: 160,
  margins: { top: 16, right: 16, bottom: 32, left: 64 },
  data: [...seen, ...next],
  schema: {
    build:  { type: 'quantitative', domain: [1, 24] },
    result: { type: 'categorical', domain: ['SKIPPED', 'PASSED', 'FAILED'] },
  },
  lock: (d) => d.build <= 16,                                //! the history is given
  guides: [guides.region({ x: [16.5, 24], fill: '#94a3b8', opacity: 0.12 })],
  axes: { x: { title: 'build' } },
  marks: [
    lineY({
      handleSize: 5,
      channels: {
        x: { field: 'build' },
        y: { field: 'result', edit: cycle() },               //! click steps through the domain
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-trail_color',
  status: 'partial',
  verdict: 'There is no trail mark, so the trail is approximated by a dense run of `point`s whose radius encodes price; overlapping dots read as a line that thickens with price.',
  needs: ['trail-mark'],
  prep: ['prep-calculate'],
  gaps: ['Built from overlapping dots (the months are densified by linear interpolation in JS), not one variable-width path.'],
  recreation: {
    code: `const rows = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: +new Date(d.date), price: d.price }));
// Densify: five interpolated dots between consecutive months, so they overlap.
const data = d3.groups(rows, (d) => d.symbol).flatMap(([symbol, v]) =>
  d3.pairs(v).flatMap(([a, b]) => d3.range(5).map((k) => ({
    symbol,
    date: new Date(a.date + (b.date - a.date) * k / 5),
    price: a.price + (b.price - a.price) * k / 5,
  }))));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true } },
  marks: [
    point({
      channels: {
        x: { field: 'date' }, y: { field: 'price' },
        size: { field: 'price', scale: { range: [0.5, 4] }, legend: true },
        fill: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw a widening band',
      question: "Give a range you are 80% sure holds Google's month-end price for each month of 2010.",
      try: 'Drag the upper and lower edges of each month apart.',
      why: 'A trail whose width grows is how a forecast fans out. Here the width IS the answer: `areaY` with a `y1`/`y2` pair draws the band and gives each edge a handle, and `ordering()` stops an edge crossing the other. The observed price is a `context: true` table.',
      uses: ['areaY', 'move()', 'ordering()', 'context table'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2008, 6, 1));
const last = goog[goog.length - 1].price;
// Nine months, each starting as a narrow band around the last close.
const data = d3.range(3, 12).map((m) => ({ date: new Date(2010, m, 1), lo: last - 50, hi: last + 50 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data, history: goog },
  schema: {
    data: {
      date: { type: 'temporal', domain: [new Date(2008, 6, 1), new Date(2010, 11, 1)] },
      lo:   { type: 'quantitative', domain: [0, 1000] },
      hi:   { type: 'quantitative', domain: [0, 1000] },
    },
    history: { context: true, fields: { date: { type: 'temporal' }, price: { type: 'quantitative' } } },
  },
  constraints: [ordering({ field: ['lo', 'hi'] })],          //! low stays below high
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({ table: 'history', stroke: '#4c78a8', strokeWidth: 2,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    areaY({
      fill: '#e8833a', stroke: '#e8833a', handleSize: 3,
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) },  //! lower edge
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },  //! upper edge
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the band',
      question: "Paint the range you are 80% sure holds Google's month-end price through 2010.",
      try: 'Sweep along the top edge to paint the high end, then along the bottom edge for the low end.',
      why: 'An `edit.line.sweep()` on each of `y1` and `y2` paints whichever edge is nearer at drag-start, so one stroke shapes a whole side of the band. `ordering()` keeps the low edge under the high one as you paint.',
      uses: ['areaY', 'edit.line.sweep()', 'ordering()', 'context table'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2008, 6, 1));
const last = goog[goog.length - 1].price;
// One row per half-month, each a narrow band around the last close.
const data = d3.timeDays(new Date(2010, 3, 1), new Date(2010, 11, 2), 15)
  .map((date) => ({ date, lo: last - 40, hi: last + 40 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data, history: goog },
  schema: {
    data: {
      date: { type: 'temporal', domain: [new Date(2008, 6, 1), new Date(2010, 11, 1)] },
      lo:   { type: 'quantitative', domain: [0, 1000] },
      hi:   { type: 'quantitative', domain: [0, 1000] },
    },
    history: { context: true, fields: { date: { type: 'temporal' }, price: { type: 'quantitative' } } },
  },
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({ table: 'history', stroke: '#4c78a8', strokeWidth: 2,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    areaY({
      fill: '#e8833a', stroke: '#e8833a', handleSize: 2.5,
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: edit.line.sweep() },        //! paint the low edge
        y2: { field: 'hi', edit: edit.line.sweep() },        //! paint the high edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-trail_comet',
  status: 'partial',
  verdict: 'Each comet is drawn as a tapered `areaY` band between its 1931 and 1932 ends, and the six site columns are laid side by side on one x axis. There is no trail mark; faceting is not covered by this study, so the facet is flattened.',
  needs: ['trail-mark', 'facet'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'Faceting is emulated by offsetting each site along one x axis, so there is no per-site header or frame.',
    'The comet is a filled band whose half-width is proportional to yield, not a trail mark.',
    'No size legend: the width is computed into `lo`/`hi`, not encoded by a `size` channel.',
  ],
  recreation: {
    code: `const barley = await vegaData('barley.json');
const sites = [...new Set(barley.map((d) => d.site))].sort();
const varieties = [...new Set(barley.map((d) => d.variety))].sort();
const by = d3.index(barley, (d) => d.site, (d) => d.variety, (d) => d.year);
// Two rows per comet: its 1931 tail and its 1932 head. Half-width ~ yield.
const data = sites.flatMap((site, si) => varieties.flatMap((variety, vi) => {
  const a = by.get(site).get(variety).get(1931).yield;
  const b = by.get(site).get(variety).get(1932).yield;
  return [[0, a], [0.7, b]].map(([dx, y]) => ({
    comet: site + '/' + variety, x: si + 0.15 + dx,
    lo: 9 - vi - y / 240, hi: 9 - vi + y / 240, delta: b - a,
  }));
}));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 8, right: 16, bottom: 56, left: 92 },
  title: 'Barley Yield comparison between 1932 and 1931',
  data,
  schema: {
    comet: { type: 'categorical' },
    x:     { type: 'quantitative', domain: [0, 6] },
    lo:    { type: 'quantitative', domain: [-0.6, 9.6] },
    hi:    { type: 'quantitative', domain: [-0.6, 9.6] },
    delta: { type: 'quantitative', domain: [-25, 25] },
  },
  axes: {
    x: { tickValues: d3.range(6).map((i) => i + 0.5), tickFormat: (v) => sites[Math.floor(v)], fontSize: 8 },
    y: { tickValues: d3.range(10), tickFormat: (v) => varieties[9 - v] },
  },
  legends: { fill: { anchor: 'bottom', title: 'Yield Delta (%)' } },
  marks: [
    areaY({
      strokeWidth: 0,
      channels: {
        series: { field: 'comet' },
        x: { field: 'x' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'delta', scale: { type: 'diverging', scheme: 'RdBu' } },
        fillOpacity: { value: 1 },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag the change',
      question: 'At the Morris site, how much did each barley variety\'s yield change from 1931 to 1932?',
      try: 'Drag each dot left (a drop) or right (a rise).',
      why: 'The comet\'s colour is a derived quantity, the 1932-minus-1931 delta, so the interface elicits that delta directly. `move()` on `x` drags each dot either side of the zero rule, and the diverging fill re-colours it as you go.',
      uses: ['move()', 'clamp()', 'guides.rule()'],
      code: `const varieties = ['Glabron', 'Manchuria', 'No. 457', 'No. 462', 'No. 475',
  'Peatland', 'Svansota', 'Trebi', 'Velvet', 'Wisconsin No. 38'];
const data = varieties.map((variety) => ({ variety, delta: 0 }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 100 },
  data,
  schema: {
    variety: { type: 'categorical', domain: [...varieties].reverse() },
    delta:   { type: 'quantitative', domain: [-25, 25] },
  },
  constraints: [clamp({ min: -25, max: 25 })],
  axes: { x: { title: 'bushels/acre, 1932 minus 1931', grid: true } },
  guides: [guides.rule({ x: 0, stroke: '#334155', label: 'no change' })],
  marks: [
    point({
      size: 7, stroke: '#334155',
      channels: {
        y: { field: 'variety' },
        x: { field: 'delta', edit: move() },                 //! drag the change, either way
        fill: { field: 'delta', scale: { type: 'diverging', scheme: 'RdBu' } }, //! colour follows the sign
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_skip_invalid_mid_overlay',
  status: 'full',
  verdict: 'The rows go in as they are: a `null` value breaks the line there, as VL skips invalid values, and `handles: true` draws the points.',
  recreation: {
    code: `const data = [10, 30, null, 15, null, 40, 20].map((y, i) => ({ x: i + 1, y }));

mount(Elicit({
  width: 400, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    x: { type: 'quantitative', domain: [1, 7] },
    y: { type: 'quantitative', domain: [0, 40] },
  },
  marks: [
    lineY({
      handles: true, handleSize: 3.5,                // VL's point: true
      channels: { x: { field: 'x' }, y: { field: 'y' } }, // a null y breaks the line
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill the gaps',
      question: 'Two readings, at x = 3 and x = 5, were lost. What do you think they were?',
      try: 'Press anywhere in the x = 3 or x = 5 column and drag up or down.',
      why: '`move({ pick: "nearest" })` grabs the closest free point to the press, so you need not hit the dot. The five recorded readings are locked by a predicate, so only the gaps respond.',
      uses: ['move({ pick: "nearest" })', 'lock'],
      code: `const raw = [10, 30, null, 15, null, 40, 20];
// The missing readings start at the middle of the axis.
const data = raw.map((y, i) => ({ x: i + 1, y: y == null ? 20 : y }));

mount(Elicit({
  width: 400, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    x: { type: 'quantitative', domain: [1, 7] },
    y: { type: 'quantitative', domain: [0, 50] },
  },
  lock: (d, i) => raw[i] != null,                              //! recorded readings are fixed
  guides: [3, 5].map((x) => guides.region({ x: [x - 0.3, x + 0.3], fill: '#94a3b8', opacity: 0.15 })),
  marks: [
    lineY({
      handleSize: 4.5,
      channels: {
        x: { field: 'x' },
        y: { field: 'y', edit: move({ pick: 'nearest', threshold: 60 }) }, //! press near a gap
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_line_co2_concentration',
  status: 'full',
  verdict: 'One `lineY` per decade over "year into decade", coloured by an ordinal decade on a magma scheme; the start and end year labels are a `guides.custom()` overlay.',
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: ['The first/last year labels are a guide computed from the rows, not two aggregate text layers.'],
  recreation: {
    code: `const co2 = await vegaData('co2-concentration.csv');
const data = co2.map((d) => {
  const year = d.Date.getUTCFullYear();
  return { decade: Math.floor(year / 10), year, t: (year % 10) + d.Date.getUTCMonth() / 12, co2: d.CO2 };
});
const decades = [...new Set(data.map((d) => d.decade))];
const ends = d3.groups(data, (d) => d.decade).flatMap(([, v]) => [
  { ...v[0], anchor: 'start', dy: 10 }, { ...v[v.length - 1], anchor: 'start', dy: 0 }]);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 12, right: 36, bottom: 32, left: 54 },
  data,
  schema: {
    decade: { type: 'ordinal', domain: decades },
    year:   { type: 'quantitative' },
    t:      { type: 'quantitative', domain: [0, 10] },
    co2:    { type: 'quantitative', domain: [310, 420] },
  },
  axes: { x: { ticks: 11, title: 'Year into Decade' }, y: { grid: true, title: 'CO2 concentration in ppm' } },
  guides: [
    guides.custom(({ scales }) => ends.map((d) => ({
      type: 'text', text: String(d.year), fontSize: 10, fill: '#334155', textAnchor: 'start',
      x: scales.x.encode(d.t) + 3, y: scales.y.encode(d.co2) + d.dy,
    }))),
  ],
  marks: [
    lineY({
      channels: {
        x: { field: 't' }, y: { field: 'co2' },
        stroke: { field: 'decade', scale: { scheme: 'magma' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the 2020s',
      question: 'Draw the yearly CO2 concentration you expect through the 2020s.',
      try: 'Sweep the 2020s line across the decade. It cannot go down.',
      why: 'The 2020s are the only elicited rows, seeded flat at the 2020 level; the earlier decades sit in a `context: true` table drawn by a second `lineY` on the same colour encoding. `monotonic()` reflects the belief that concentration only rises year to year.',
      uses: ['edit.line.sweep()', 'monotonic()', 'context table'],
      code: `const co2 = await vegaData('co2-concentration.csv');
// Annual means for each decade, so a decade is ten points.
const past = d3.flatRollup(co2, (v) => d3.mean(v, (d) => d.CO2), (d) => d.Date.getUTCFullYear())
  .filter(([year]) => year >= 1960 && year < 2020)
  .map(([year, co2]) => ({ decade: String(Math.floor(year / 10) * 10) + 's', t: year % 10, co2 }));
const next = d3.range(10).map((t) => ({ decade: '2020s', t, co2: 412 }));
const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
const colour = { field: 'decade', scale: { scheme: 'magma', reverse: true } };

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 12, right: 60, bottom: 32, left: 54 },
  data: { data: next, history: past },
  schema: {
    data: {
      decade: { type: 'ordinal', domain: decades },
      t:      { type: 'quantitative', domain: [0, 9] },
      co2:    { type: 'quantitative', domain: [310, 460] },
    },
    history: { context: true, fields: {                        //! the past decades, read-only
      decade: { type: 'ordinal', domain: decades },
      t:      { type: 'quantitative' },
      co2:    { type: 'quantitative' },
    } },
  },
  constraints: [monotonic({ field: 'co2', along: 't' })],     //! no year falls below the last
  axes: { x: { title: 'Year into Decade' }, y: { grid: true, title: 'CO2 concentration in ppm' } },
  marks: [
    lineY({ table: 'history',
            channels: { x: { field: 't' }, y: { field: 'co2' }, stroke: { ...colour, legend: { labelWidth: 36 } } } }),
    lineY({
      handleSize: 3,
      channels: {
        x: { field: 't' },
        y: { field: 'co2', edit: edit.line.sweep() },
        stroke: colour,
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-window_rank',
  status: 'full',
  verdict: 'The rank is a window computed in JS and the bump lines are a `lineY` over an ordinal rank axis with the original team colours and title.',
  prep: ['prep-window'],
  gaps: ['Ties share a rank as in VL\'s `rank` op, so tied lines overlap on matchdays 1 and 2.'],
  recreation: {
    code: `const games = [
  ['Germany', 1, 0, -1], ['Mexico', 1, 3, 1], ['South Korea', 1, 0, -1], ['Sweden', 1, 3, 1],
  ['Germany', 2, 3, 0], ['Mexico', 2, 6, 2], ['South Korea', 2, 0, -2], ['Sweden', 2, 3, 0],
  ['Germany', 3, 3, -2], ['Mexico', 3, 6, -1], ['South Korea', 3, 3, 0], ['Sweden', 3, 6, 3],
].map(([team, matchday, point, diff]) => ({ team, matchday, point, diff }));
// Window rank per matchday: points, then goal difference; ties share a rank.
const better = (a, b) => a.point > b.point || (a.point === b.point && a.diff > b.diff);
const data = games.map((d) => ({
  team: d.team, matchday: d.matchday,
  rank: 1 + games.filter((o) => o.matchday === d.matchday && better(o, d)).length,
}));

mount(Elicit({
  width: 380, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 32 },
  title: 'World Cup 2018: Group F Rankings',
  data,
  schema: {
    team:     { type: 'categorical', domain: ['Germany', 'Mexico', 'South Korea', 'Sweden'] },
    matchday: { type: 'ordinal', domain: [1, 2, 3] },
    rank:     { type: 'ordinal', domain: [4, 3, 2, 1] },
  },
  axes: { x: { title: 'matchday' } },
  marks: [
    lineY({
      strokeWidth: 2,
      channels: {
        x: { field: 'matchday' }, y: { field: 'rank' },
        stroke: { field: 'team', scale: { range: ['black', '#127153', '#C91A3C', '#0C71AB'] },
                  legend: { labelWidth: 76 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag to re-rank',
      question: 'Before the last matchday, predict the final Group F table.',
      try: 'Drag a team\'s matchday-3 point up or down; the teams in between shift one place.',
      why: '`rank()` inverts the pointer to a rank slot and INSERTS the team there, shifting the ones in between, so the four places stay a permutation. Matchdays 1 and 2 are locked, so only matchday 3 moves.',
      uses: ['rank()', 'lock'],
      code: `const standings = {
  1: { Mexico: 1, Sweden: 2, Germany: 3, 'South Korea': 4 },
  2: { Mexico: 1, Germany: 2, Sweden: 3, 'South Korea': 4 },
  3: { Mexico: 1, Germany: 2, Sweden: 3, 'South Korea': 4 },  // your prediction
};
const data = Object.entries(standings).flatMap(([md, ranks]) =>
  Object.entries(ranks).map(([team, rank_]) => ({ team, matchday: +md, rank: rank_ })));

mount(Elicit({
  width: 380, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 32 },
  data,
  schema: {
    team:     { type: 'categorical', domain: ['Germany', 'Mexico', 'South Korea', 'Sweden'] },
    matchday: { type: 'ordinal', domain: [1, 2, 3] },
    rank:     { type: 'ordinal', domain: [4, 3, 2, 1] },
  },
  lock: (d) => d.matchday < 3,                                 //! the played matchdays are fixed
  axes: { x: { title: 'matchday' } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 6,
      channels: {
        x: { field: 'matchday' },
        y: { field: 'rank', edit: rank() },                    //! drag inserts at a place
        stroke: { field: 'team', scale: { range: ['black', '#127153', '#C91A3C', '#0C71AB'] },
                  legend: { labelWidth: 76 } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-sequence_line_fold',
  status: 'full',
  verdict: 'The sequence and the fold are a few lines of JS; the two functions are one `lineY` grouped by `key`.',
  prep: ['prep-calculate', 'prep-reshape'],
  recreation: {
    code: `const xs = d3.range(0, 12.7, 0.1);
const data = ['sin(x)', 'cos(x)'].flatMap((key) =>
  xs.map((x) => ({ key, x, value: key === 'sin(x)' ? Math.sin(x) : Math.cos(x) })));

mount(Elicit({
  width: 400, height: 200,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    key:   { type: 'categorical', domain: ['cos(x)', 'sin(x)'] },
    x:     { type: 'quantitative', domain: [0, 12.7] },
    value: { type: 'quantitative', domain: [-1, 1] },
  },
  axes: { x: { title: 'x' } },
  marks: [
    lineY({
      channels: {
        x: { field: 'x' }, y: { field: 'value' },
        stroke: { field: 'key', legend: { labelWidth: 44, title: false } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the derivative',
      question: 'Here is sin(x). Draw its slope at every x, then check it against cos(x).',
      try: 'Sweep across the flat line to draw it, then press Reveal.',
      why: 'The slope is a quantity derived from the curve you see, so the elicited rows are the slope alone, seeded at zero, and sin(x) sits in a `context: true` table. `stage: 0` freezes the slope on Reveal, and the answer is a guide that only draws at stage 1.',
      uses: ['edit.line.sweep()', 'context table', 'stage', 'guides.custom()'],
      code: `const xs = d3.range(0, 12.6, 0.5);
const sin = xs.map((x) => ({ fn: 'sin(x)', x, value: Math.sin(x) }));
const slope = xs.map((x) => ({ fn: 'slope', x, value: 0 }));  // yours, flat at zero
const fields = {
  fn:    { type: 'categorical', domain: ['sin(x)', 'slope'] },
  x:     { type: 'quantitative', domain: [0, 12.5] },
  value: { type: 'quantitative', domain: [-1.5, 1.5] },
};

const chart = mount(Elicit({
  width: 400, height: 220,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data: { data: slope, given: sin },
  schema: { data: fields, given: { context: true, fields } },  //! the function is given, read-only
  axes: { x: { title: 'x' }, y: { grid: true } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [{    //! cos(x), after the reveal
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2, strokeDasharray: '4 3',
      points: d3.range(0, 12.6, 0.1).map((x) => [scales.x.encode(x), scales.y.encode(Math.cos(x))]),
    }]),
  ],
  marks: [
    lineY({ table: 'given', curve: 'catmullRom',
            channels: { x: { field: 'x' }, y: { field: 'value' }, stroke: { field: 'fn' } } }),
    lineY({
      handleSize: 3, curve: 'catmullRom',
      channels: {
        x: { field: 'x' },
        y: { field: 'value', edit: edit.line.sweep({ stage: 0 }) }, //! draw until revealed
        stroke: { field: 'fn', legend: { labelWidth: 44, title: false } },
      },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_strokedash',
  status: 'full',
  verdict: 'Five price series in one `lineY`, told apart by `strokeDash` on `symbol`: an ordinal scale onto a dash vocabulary, with a dash legend.',
  prep: ['prep-calculate'],
  recreation: {
    code: `const data = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      channels: {
        x: { field: 'date' }, y: { field: 'price' },
        strokeDash: { field: 'symbol', legend: { labelWidth: 40 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drop a stock',
      question: 'It is January 2008. Which of these stocks would you sell before the year is out?',
      try: 'Click any point on a line to remove that whole stock. Alt-click removes one month.',
      why: '`edit.line.removeSeries()` deletes every row in the clicked line\'s series, so the answer is the set of lines left. `when.noAlt` / `when.alt` share the click between it and a single-point `remove()`.',
      uses: ['edit.line.removeSeries()', 'remove()', 'when'],
      code: `const data = (await vegaData('stocks.csv'))
  .map((d) => ({ symbol: d.symbol, date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2006, 0, 1) && d.date < new Date(2008, 0, 1));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 52 },
  data,
  schema: {
    symbol: { type: 'categorical', domain: ['AAPL', 'AMZN', 'GOOG', 'IBM', 'MSFT'] },
    date:   { type: 'temporal' },
    price:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { grid: true, title: 'price' } },
  marks: [
    lineY({
      handleSize: 3,
      channels: {
        x: { field: 'date' }, y: { field: 'price' },
        strokeDash: { field: 'symbol', legend: { labelWidth: 40 } }, //! the dash names the stock
      },
      edits: [
        edit.line.removeSeries({ series: 'symbol', when: when.noAlt }), //! click drops the whole stock
        remove({ when: when.alt }),                                      //! alt-click drops one month
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-line_dashed_part',
  status: 'full',
  verdict: 'The observed and predicted runs are two series sharing the E point, and `strokeDash` on `predicted` dashes the second.',
  recreation: {
    code: `const data = [
  { a: 'A', b: 28, predicted: 'false' }, { a: 'B', b: 55, predicted: 'false' },
  { a: 'D', b: 91, predicted: 'false' }, { a: 'E', b: 81, predicted: 'false' },
  { a: 'E', b: 81, predicted: 'true' },  { a: 'G', b: 19, predicted: 'true' },
  { a: 'H', b: 87, predicted: 'true' },
];

mount(Elicit({
  width: 400, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    a:         { type: 'ordinal', domain: ['A', 'B', 'D', 'E', 'G', 'H'] },
    b:         { type: 'quantitative', domain: [0, 100] },
    predicted: { type: 'categorical', domain: ['false', 'true'] },
  },
  axes: { x: { title: 'a' }, y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2,
      channels: {
        x: { field: 'a' }, y: { field: 'b' },
        strokeDash: { field: 'predicted', legend: { labelWidth: 36 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the forecast',
      question: 'A to E are measured. What will G and H be?',
      try: 'Drag the G and H points up or down; values snap to 5.',
      why: 'The predicted run starts at the duplicated E row, which is locked with the measured ones, so the forecast stays joined to the record and dashed by `strokeDash`. `move()` on `y` with `snap()` asks for a value at the grain you would quote.',
      uses: ['move()', 'snap()', 'lock'],
      code: `const data = [
  { a: 'A', b: 28, predicted: 'false' }, { a: 'B', b: 55, predicted: 'false' },
  { a: 'D', b: 91, predicted: 'false' }, { a: 'E', b: 81, predicted: 'false' },
  { a: 'E', b: 81, predicted: 'true' },
  { a: 'G', b: 50, predicted: 'true' },  { a: 'H', b: 50, predicted: 'true' },
];

mount(Elicit({
  width: 400, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    a:         { type: 'ordinal', domain: ['A', 'B', 'D', 'E', 'G', 'H'] },
    b:         { type: 'quantitative', domain: [0, 100] },
    predicted: { type: 'categorical', domain: ['false', 'true'] },
  },
  lock: (d) => d.a <= 'E',                                     //! A to E are measured
  constraints: [snap({ step: 5 })],                            //! quote to the nearest 5
  axes: { x: { title: 'a' }, y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 5,
      channels: {
        x: { field: 'a' },
        y: { field: 'b', edit: move() },
        strokeDash: { field: 'predicted', legend: { labelWidth: 36 } }, //! the forecast reads as dashed
      },
    }),
  ],
}));`,
    },
  ],
});

// ---------------------------------------------------------------- Advanced calculations

GALLERY.add({
  id: 'vl-joinaggregate_mean_difference',
  status: 'full',
  verdict: 'The joinaggregate is a mean computed in JS and stamped on every row; a `barX` draws the ratings and a red `ruleX` draws the stamped mean.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Long titles are truncated in JS and set in a smaller font.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json')).filter((d) => d['IMDB Rating'] != null);
const mean = d3.mean(movies, (d) => d['IMDB Rating']);
// joinaggregate: every row carries the overall mean.
const data = movies.filter((d) => d['IMDB Rating'] - mean > 2.5)
  .map((d) => ({ title: String(d.Title).replace(/^(.{30}).+$/, '$1…'), rating: d['IMDB Rating'], average: mean }));

mount(Elicit({
  width: 480, height: 340,
  margins: { top: 8, right: 16, bottom: 32, left: 200 },
  data,
  schema: {
    title:   { type: 'ordinal', domain: data.map((d) => d.title).sort().reverse() }, // first on top
    rating:  { type: 'quantitative', domain: [0, 10] },
    average: { type: 'quantitative', domain: [0, 10] },
  },
  axes: { x: { title: 'IMDB Rating' }, y: { fontSize: 9 } },
  marks: [
    barX({ channels: { y: { field: 'title' }, x: { field: 'rating' } } }),
    ruleX({ stroke: 'red', channels: { x: { field: 'average' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rate the classics',
      question: 'The average film in this dataset rates 6.3 on IMDB. What do you think these eight classics score?',
      try: 'Drag each bar to your guess, then press Reveal.',
      why: 'Each bar starts at the average, the red rule, so a drag is a statement about how far above average a film sits. `stage: 0` freezes the answers on Reveal, and the real ratings arrive as a stage-1 guide.',
      uses: ['move()', 'guides.rule()', 'stage', 'guides.custom()'],
      code: `const truth = { 'The Godfather': 9.2, 'Casablanca': 8.8, 'Pulp Fiction': 8.9, 'Fight Club': 8.8,
  'Toy Story 3': 8.9, 'Inception': 9.1, 'Goodfellas': 8.8, 'The Dark Knight': 8.9 };
const titles = Object.keys(truth);
const data = titles.map((title) => ({ title, rating: 6.3 }));

const chart = mount(Elicit({
  width: 420, height: 260,
  margins: { top: 8, right: 16, bottom: 32, left: 110 },
  data,
  schema: {
    title:  { type: 'categorical', domain: [...titles].reverse() },
    rating: { type: 'quantitative', domain: [0, 10] },
  },
  constraints: [clamp({ min: 0, max: 10 }), snap({ step: 0.1 })],
  axes: { x: { title: 'IMDB Rating', grid: true } },
  guides: [
    guides.rule({ x: 6.3, stroke: 'red', label: 'average' }), //! the reference every bar starts from
    guides.custom(({ scales, stage }) => stage < 1 ? [] : titles.map((t) => ({
      type: 'circle', r: 4, fill: '#e8833a',
      cx: scales.x.encode(truth[t]), cy: scales.y.encode(t) + scales.y.bandwidth() / 2,
    }))),
  ],
  marks: [
    barX({
      channels: {
        y: { field: 'title' },
        x: { field: 'rating', edit: move({ stage: 0 }) },    //! drag each rating
      },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-joinaggregate_mean_difference_by_year',
  status: 'full',
  verdict: 'The grouped joinaggregate is a per-year mean stamped on each row in JS; a `barX` draws the rating and a red `tickX` draws the year\'s average on the same band.',
  prep: ['prep-aggregate', 'prep-calculate'],
  recreation: {
    code: `const movies = (await vegaData('movies.json')).filter((d) => d['IMDB Rating'] != null);
const year = (d) => new Date(d['Release Date']).getFullYear();
const byYear = d3.rollup(movies, (v) => d3.mean(v, (d) => d['IMDB Rating']), year);
const data = movies
  .filter((d) => d['IMDB Rating'] - byYear.get(year(d)) > 2.5)
  .map((d) => ({ title: String(d.Title).replace(/^(.{30}).+$/, '$1…'), rating: d['IMDB Rating'], yearAverage: byYear.get(year(d)) }));

mount(Elicit({
  width: 480, height: 340,
  margins: { top: 8, right: 16, bottom: 32, left: 200 },
  data,
  schema: {
    title:       { type: 'ordinal', domain: data.map((d) => d.title).sort().reverse() },
    rating:      { type: 'quantitative', domain: [0, 10] },
    yearAverage: { type: 'quantitative', domain: [0, 10] },
  },
  axes: { x: { title: 'IMDB Rating' }, y: { fontSize: 9 } },
  marks: [
    barX({ channels: { y: { field: 'title' }, x: { field: 'rating' } } }),
    tickX({ stroke: 'red', strokeWidth: 2, channels: { y: { field: 'title' }, x: { field: 'yearAverage' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the average',
      question: 'Each bar is a standout film. What was the average IMDB rating of all films released in its year?',
      try: 'Drag each red tick left or right along its bar.',
      why: 'The bar and the tick are two marks over the same rows, and only the tick carries an edit, so a drag writes the year average and never the film\'s own rating. That is the derived column the joinaggregate computes.',
      uses: ['tickX', 'move()', 'clamp()'],
      code: `const films = [
  ['Pulp Fiction (1994)', 8.9], ['Raiders of the Lost Ark (1981)', 8.7], ["Schindler's List (1993)", 8.9],
  ['The Silence of the Lambs (1991)', 8.7], ['The Dark Knight (2008)', 8.9], ['Inception (2010)', 9.1],
  ['The Matrix (1999)', 8.7], ['Memento (2001)', 8.7],
];
// Every tick starts at 5, so its placement is all yours.
const data = films.map(([title, rating]) => ({ title, rating, yearAverage: 5 }));

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 8, right: 16, bottom: 32, left: 170 },
  data,
  schema: {
    title:       { type: 'categorical', domain: films.map((f) => f[0]).reverse() },
    rating:      { type: 'quantitative', domain: [0, 10] },
    yearAverage: { type: 'quantitative', domain: [0, 10] },
  },
  constraints: [clamp({ field: 'yearAverage', min: 0, max: 10 })],
  axes: { x: { title: 'IMDB Rating', grid: true }, y: { fontSize: 10 } },
  marks: [
    barX({ fill: '#c7d7ea', channels: { y: { field: 'title' }, x: { field: 'rating' } } }),
    tickX({
      stroke: 'red', strokeWidth: 3,
      channels: {
        y: { field: 'title' },
        x: { field: 'yearAverage', edit: move() },            //! only the tick writes
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-joinaggregate_residual_graph',
  status: 'full',
  verdict: 'The rating delta is computed in JS; a `point` per film over its release date, stroked on a diverging scale centred on zero.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Colours come from a diverging RdBu ramp rather than VL\'s default blue-orange.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json'))
  .map((d) => ({ date: new Date(d['Release Date']), rating: d['IMDB Rating'] }))
  .filter((d) => d.rating != null && d.date.getFullYear() <= 2019);
const mean = d3.mean(movies, (d) => d.rating);
const data = movies.map((d) => ({ date: d.date, delta: d.rating - mean }));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    date:  { type: 'temporal' },
    delta: { type: 'quantitative', domain: [-5, 3] },
  },
  axes: { x: { title: 'Release Date' }, y: { grid: true } },
  marks: [
    point({
      size: 2, fill: 'none', strokeWidth: 1,
      channels: {
        x: { field: 'date' }, y: { field: 'delta' },
        stroke: { field: 'delta', scale: { type: 'diverging', scheme: 'RdBu' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the decade trend',
      question: 'Are older films rated above or below the average film? Draw the mean rating delta for each decade.',
      try: 'Sweep across the decades; zero is the overall average.',
      why: 'The residual is a derived quantity, and so is its decade mean, so the elicited rows are nine decades seeded at zero. The films are a `context: true` table behind them, and `guides.rule()` marks the average every residual is measured from.',
      uses: ['edit.line.sweep()', 'guides.rule()', 'context table'],
      code: `const movies = (await vegaData('movies.json'))
  .map((d) => ({ date: new Date(d['Release Date']), rating: d['IMDB Rating'] }))
  .filter((d) => d.rating != null && d.date.getFullYear() >= 1930 && d.date.getFullYear() <= 2019);
const mean = d3.mean(movies, (d) => d.rating);
const films = movies.map((d) => ({ year: d.date.getFullYear() + d.date.getMonth() / 12, delta: d.rating - mean }));
const data = d3.range(1930, 2020, 10).map((decade) => ({ decade: decade + 5, delta: 0 }));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data: { data, films },
  schema: {
    data: {
      decade: { type: 'quantitative', domain: [1930, 2020] },
      delta:  { type: 'quantitative', domain: [-5, 3] },
    },
    films: { context: true, fields: { year: { type: 'quantitative' }, delta: { type: 'quantitative' } } },
  },
  axes: { x: { title: 'Release year', tickFormat: 'd' }, y: { grid: true } },
  guides: [guides.rule({ y: 0, stroke: '#334155', label: 'average film' })], //! residuals are measured from here
  marks: [
    point({ table: 'films', size: 1.5, fill: '#94a3b8', opacity: 0.35,   // the films, as context
            channels: { x: { field: 'year' }, y: { field: 'delta' } } }),
    lineY({
      stroke: '#e8833a', strokeWidth: 3, handleSize: 4,
      channels: {
        x: { field: 'decade' },
        y: { field: 'delta', edit: edit.line.sweep() },       //! one decade per column
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-waterfall_chart',
  status: 'full',
  verdict: 'The window sums are computed in JS; floating bars use a `y1`/`y2` pair, a `ruleY` spans each bar to the next, and two `text` marks carry the totals and the deltas.',
  prep: ['prep-window', 'prep-calculate'],
  gaps: ['The connector spans from this band\'s start to the next band\'s start rather than edge to edge of the two bars.'],
  recreation: {
    code: `const raw = [['Begin', 4000], ['Jan', 1707], ['Feb', -1425], ['Mar', -1030], ['Apr', 1812],
  ['May', -1067], ['Jun', -1481], ['Jul', 1228], ['Aug', 1176], ['Sep', 1146], ['Oct', 1205],
  ['Nov', -1388], ['Dec', 1492], ['End', 0]];
let sum = 0;
const data = raw.map(([label, amount], i) => {
  const end = label === 'End';
  const prev = end ? 0 : sum;
  sum = end ? sum : sum + amount;
  const kind = label === 'Begin' || end ? 'total' : amount < 0 ? 'down' : 'up';
  return {
    label, lead: raw[Math.min(i + 1, raw.length - 1)][0], prev, sum, kind,
    center: (prev + sum) / 2,
    delta: kind === 'total' ? String(end ? sum : amount) : (amount > 0 ? '+' : '') + amount,
  };
});
const labels = raw.map((r) => r[0]);

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 12, bottom: 40, left: 54 },
  data,
  schema: {
    label:  { type: 'ordinal', domain: labels },
    lead:   { type: 'ordinal', domain: labels },
    prev:   { type: 'quantitative', domain: [0, 8000] },
    sum:    { type: 'quantitative', domain: [0, 8000] },
    center: { type: 'quantitative', domain: [0, 8000] },
    kind:   { type: 'categorical', domain: ['total', 'down', 'up'] },
    delta:  { type: 'categorical' },
  },
  axes: { x: { title: 'Months' }, y: { grid: true, title: 'Amount' } },
  marks: [
    barY({
      channels: {
        x: { field: 'label' }, y1: { field: 'prev' }, y2: { field: 'sum' },
        fill: { field: 'kind', scale: { range: ['#f7e0b6', '#f78a64', '#93c4aa'] } },
      },
    }),
    ruleY({ stroke: '#404040', strokeWidth: 2,
            channels: { y: { field: 'sum' }, x1: { field: 'label' }, x2: { field: 'lead' } } }),
    text({ fontSize: 9, fill: '#404040', dy: -6,
           channels: { x: { field: 'label' }, y: { field: 'sum' }, text: { field: 'sum' } } }),
    text({ fontSize: 9, lineAnchor: 'middle',
           channels: { x: { field: 'label' }, y: { field: 'center' }, text: { field: 'delta' },
                       fill: { fn: (d) => d.kind === 'total' ? '#725a30' : 'white' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set the balance',
      question: 'You start the year with 4,000. Where will the balance stand at the end of each month?',
      try: 'Drag the top of each month\'s bar; its change and colour follow.',
      why: 'You drag the running balance (`move()` on `y2`); each bar\'s bottom is the previous month\'s balance, which a `constraints.custom()` window keeps in step after every edit. So the monthly change is derived, and the fill and label re-derive from its sign.',
      uses: ['barY', 'move()', 'constraints.custom()', 'lock'],
      code: `const months = ['Begin', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const data = months.map((label, i) => ({ label, start: i ? 4000 : 0, balance: 4000 }));

mount(Elicit({
  width: 480, height: 280,
  margins: { top: 16, right: 12, bottom: 40, left: 54 },
  data,
  schema: {
    label:   { type: 'ordinal', domain: months },
    start:   { type: 'quantitative', domain: [0, 10000] },
    balance: { type: 'quantitative', domain: [0, 10000] },
  },
  lock: (d) => d.label === 'Begin',                             //! the opening balance is given
  constraints: [
    snap({ field: 'balance', step: 100 }),
    // The window: each bar starts where the last one ended.
    constraints.custom(({ data }) => data.some((d, i) => i && d.start !== data[i - 1].balance) //! keeps bars chained
      ? data.map((d, i) => ({ ...d, start: i ? data[i - 1].balance : 0 }))
      : undefined),
  ],
  axes: { x: { title: 'Months' }, y: { grid: true, title: 'Balance' } },
  marks: [
    barY({
      channels: {
        x: { field: 'label' },
        y1: { field: 'start' },
        y2: { field: 'balance', edit: move({ channels: ['y2'] }) }, //! you set the balance
        fill: { fn: (d, i) => i === 0 ? '#f7e0b6' : d.balance < d.start ? '#f78a64' : '#93c4aa' },
      },
    }),
    text({ fontSize: 9, fill: '#404040', dy: -6,
           channels: { x: { field: 'label' }, y: { field: 'balance' },
                       text: { fn: (d, i) => i ? d3.format('+')(d.balance - d.start) : '4000' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-window_top_k',
  status: 'full',
  verdict: 'The rank window and the top-5 filter are a sort and a slice in JS; a `barX` with the band domain in score order.',
  prep: ['prep-window', 'prep-calculate'],
  recreation: {
    code: `const scores = { A: 100, B: 56, C: 88, D: 65, E: 45, F: 23, G: 66, H: 67, I: 13, J: 12, K: 50,
  L: 78, M: 66, N: 30, O: 97, P: 75, Q: 24, R: 42, S: 76, T: 78, U: 21, V: 46 };
const data = Object.entries(scores)
  .map(([student, score]) => ({ student, score }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);                                   // window rank <= 5

mount(Elicit({
  width: 400, height: 200,
  margins: { top: 8, right: 16, bottom: 32, left: 32 },
  data,
  schema: {
    student: { type: 'ordinal', domain: data.map((d) => d.student).reverse() }, // first on top
    score:   { type: 'quantitative', domain: [0, 100] },
  },
  axes: { x: { title: 'score' } },
  marks: [barX({ channels: { y: { field: 'student' }, x: { field: 'score' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Guess the top five',
      question: 'A class of 22 averages 56 on a test. What do the five highest scores look like?',
      try: 'Drag each bar. Pull a lower place past a higher one and the higher one is pushed up.',
      why: 'These are order statistics: the first place can never score below the second. `monotonic()` with `dir: "down"` along `rank` holds that for every drag, pushing the neighbours aside rather than refusing.',
      uses: ['move()', 'monotonic()', 'guides.rule()'],
      code: `const places = ['1st', '2nd', '3rd', '4th', '5th'];
const data = places.map((place, i) => ({ place, rank: i + 1, score: 60 }));

mount(Elicit({
  width: 400, height: 200,
  margins: { top: 8, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    place: { type: 'ordinal', domain: [...places].reverse() },
    rank:  { type: 'quantitative' },
    score: { type: 'quantitative', domain: [0, 100] },
  },
  constraints: [
    monotonic({ field: 'score', along: 'rank', dir: 'down' }),  //! 1st >= 2nd >= ... >= 5th
    clamp({ field: 'score', min: 0, max: 100 }),
  ],
  guides: [guides.rule({ x: 56, stroke: '#64748b', label: 'class mean' })],
  axes: { x: { title: 'score', grid: true } },
  marks: [
    barX({
      channels: {
        y: { field: 'place' },
        x: { field: 'score', edit: move() },                  //! drag a score
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-window_top_k_others',
  status: 'full',
  verdict: 'The aggregate, row-number window and "All Others" bucket are computed in JS and drawn as a sorted `barX` under the original title.',
  prep: ['prep-aggregate', 'prep-window', 'prep-calculate'],
  gaps: ['Gross is shown in millions of dollars.'],
  recreation: {
    code: `const movies = await vegaData('movies.json');
const means = d3.rollups(movies, (v) => d3.mean(v, (d) => d['Worldwide Gross']), (d) => String(d.Director))
  .filter(([, m]) => m != null)
  .sort((a, b) => b[1] - a[1]);
// row_number < 10 keeps its name; everything after is "All Others" (a mean of means).
const top = means.slice(0, 9).map(([director, gross]) => ({ director, gross: gross / 1e6 }));
const data = [...top, { director: 'All Others', gross: d3.mean(means.slice(9), (d) => d[1]) / 1e6 }];

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 8, right: 16, bottom: 32, left: 110 },
  title: 'Top Directors by Average Worldwide Gross',
  data,
  schema: {
    director: { type: 'ordinal', domain: data.map((d) => d.director).reverse() },
    gross:    { type: 'quantitative', domain: [0, 1000] },
  },
  axes: { x: { tickFormat: '$~s', grid: true } },
  marks: [barX({ channels: { y: { field: 'director' }, x: { field: 'gross' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Drag to reorder',
      question: 'These are the six largest average worldwide grosses among these directors. Whose is whose?',
      try: 'Drag a bar up or down; the directors in between shift one place.',
      why: 'The band axis IS the rank, so `rank()` on `y` inserts the dragged bar at a place and shifts the rest, keeping a full ordering. A `constraints.custom()` ties each bar\'s length to its place, so the lengths stay sorted and the names move.',
      uses: ['barX', 'rank()', 'constraints.custom()'],
      code: `const directors = ['George Lucas', 'James Cameron', 'Pete Docter', 'Peter Jackson', 'Carlos Saldanha', 'David Yates'];
const grosses = [938, 830, 769, 731, 674, 596];               // $M, largest first
const data = directors.map((director, i) => ({ director, rank: i + 1, gross: grosses[i] }));

mount(Elicit({
  width: 440, height: 240,
  margins: { top: 8, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    director: { type: 'categorical', domain: directors },
    rank:     { type: 'ordinal', domain: [6, 5, 4, 3, 2, 1] },  // 1st on top
    gross:    { type: 'quantitative', domain: [0, 1000] },
  },
  constraints: [
    constraints.custom(({ data }) => data.some((d) => d.gross !== grosses[d.rank - 1]) //! a place keeps its gross
      ? data.map((d) => ({ ...d, gross: grosses[d.rank - 1] }))
      : undefined),
  ],
  axes: { x: { tickFormat: '$~s', grid: true }, y: { title: false, tickFormat: (r) => '#' + r } },
  marks: [
    barX({
      channels: {
        y: { field: 'rank', edit: rank() },                 //! drag a bar to a place
        x: { field: 'gross' },
      },
    }),
    text({ fontSize: 12, fill: 'white', textAnchor: 'start',
           channels: { x: { value: 8 }, y: { field: 'rank' }, text: { field: 'director' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-lookup',
  status: 'full',
  verdict: 'The lookup is a join in JS (`d3.index` over the people table), then a mean age per group in a `barY`.',
  prep: ['prep-lookup', 'prep-aggregate'],
  recreation: {
    code: `const groups = await vegaData('lookup_groups.csv');
const people = d3.index(await vegaData('lookup_people.csv'), (d) => d.name);
// lookup: each group row gets the person's age.
const joined = groups.map((d) => ({ group: d.group, age: people.get(d.person).age }));
const data = d3.rollups(joined, (v) => d3.mean(v, (d) => d.age), (d) => String(d.group))
  .map(([group, age]) => ({ group, age }));

mount(Elicit({
  width: 260, height: 260,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    group: { type: 'ordinal', domain: ['1', '2', '3'] },
    age:   { type: 'quantitative', domain: [0, 60] },
  },
  axes: { x: { title: 'group' }, y: { grid: true } },
  marks: [barY({ channels: { x: { field: 'group' }, y: { field: 'age' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Place each person',
      question: 'How old is each person? The bars show their group\'s average, as the lookup chart would report it.',
      try: 'Drag each dot up or down; watch the group bar follow.',
      why: 'Every row carries its group\'s mean, and a `constraints.custom()` recomputes it after each drag, the joinaggregate as a dataset invariant. The bar draws that derived column; only the dot carries an edit.',
      uses: ['move()', 'constraints.custom()', 'snap()'],
      code: `const people = [['Alan', 1], ['George', 1], ['Fred', 1], ['Steve', 2], ['Nick', 2], ['Will', 2],
  ['Cole', 3], ['Rick', 3], ['Tom', 3]];
const data = people.map(([person, group]) => ({ person, group: String(group), age: 40, groupMean: 40 }));
const groupMeans = (rows) => d3.rollup(rows, (v) => d3.mean(v, (d) => d.age), (d) => d.group);

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    person:    { type: 'ordinal', domain: people.map((p) => p[0]) },
    group:     { type: 'categorical', domain: ['1', '2', '3'] },
    age:       { type: 'quantitative', domain: [0, 80] },
    groupMean: { type: 'quantitative', domain: [0, 80] },
  },
  constraints: [
    snap({ field: 'age', step: 1 }),
    constraints.custom(({ data }) => {                         //! joinaggregate: mean per group
      const m = groupMeans(data);
      return data.some((d) => d.groupMean !== m.get(d.group))
        ? data.map((d) => ({ ...d, groupMean: m.get(d.group) })) : undefined;
    }),
  ],
  axes: { y: { grid: true } },
  marks: [
    barY({ fillOpacity: 0.35,
           channels: { x: { field: 'person' }, y: { field: 'groupMean' }, fill: { field: 'group', legend: { labelWidth: 40 } } } }),
    point({ size: 6,
            channels: { x: { field: 'person' }, y: { field: 'age', edit: move() }, fill: { field: 'group' } } }), //! drag a person's age
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-parallel_coordinate',
  status: 'full',
  verdict: 'The fold and per-key min/max normalisation are JS; one `lineY` per penguin over a categorical x, with the axis ticks and min/mid/max labels drawn by a guide.',
  prep: ['prep-reshape', 'prep-aggregate', 'prep-calculate'],
  gaps: ['The per-axis min/mid/max labels and ticks are a `guides.custom()` overlay rather than text and tick layers.'],
  recreation: {
    code: `const keys = ['Beak Depth (mm)', 'Beak Length (mm)', 'Body Mass (g)', 'Flipper Length (mm)'];
const penguins = (await vegaData('penguins.json')).filter((d) => d['Beak Length (mm)']);
const ext = Object.fromEntries(keys.map((k) => [k, d3.extent(penguins, (d) => d[k])]));
// fold + joinaggregate: one row per (penguin, measure), normalised to [0, 1].
const data = penguins.flatMap((d, index) => keys.map((key) => ({
  index, species: d.Species, key,
  norm: (d[key] - ext[key][0]) / (ext[key][1] - ext[key][0]),
})));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 24, bottom: 28, left: 40 },
  data,
  schema: {
    index:   { type: 'categorical' },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    key:     { type: 'categorical', domain: keys },
    norm:    { type: 'quantitative', domain: [0, 1] },
  },
  axes: { x: { title: false }, y: false },
  guides: [
    guides.custom(({ scales }) => keys.flatMap((k) => {
      const x = scales.x.encode(k);
      const [lo, hi] = ext[k];
      return [
        { background: true, type: 'line', x1: x, x2: x, y1: scales.y.encode(0), y2: scales.y.encode(1), stroke: '#ccc' },
        ...[[1, hi], [0.5, (lo + hi) / 2], [0, lo]].map(([t, v]) => ({
          type: 'text', x: x - 6, y: scales.y.encode(t) + 4, text: String(+v.toFixed(1)),
          textAnchor: 'end', fontSize: 10, fill: '#475569',
        })),
      ];
    })),
  ],
  marks: [
    lineY({
      strokeOpacity: 0.3,
      channels: {
        series: { field: 'index' },
        x: { field: 'key' }, y: { field: 'norm' },
        stroke: { field: 'species', legend: { anchor: 'bottom', labelWidth: 60 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sketch a Gentoo',
      question: 'Here are typical Adelie and Chinstrap profiles. Sketch a typical Gentoo penguin across the four measures.',
      try: 'Drag each of the four orange points up or down.',
      why: 'Normalising every measure to its own min/max is what lets one y channel carry four units, so the elicited row is four normalised values. The other species sit in a `context: true` table, and `move()` on `y` keeps each point on its axis.',
      uses: ['move()', 'clamp()', 'context table'],
      code: `const keys = ['Beak Depth (mm)', 'Beak Length (mm)', 'Body Mass (g)', 'Flipper Length (mm)'];
const penguins = (await vegaData('penguins.json')).filter((d) => d['Beak Length (mm)']);
const ext = Object.fromEntries(keys.map((k) => [k, d3.extent(penguins, (d) => d[k])]));
const norm = (k, v) => (v - ext[k][0]) / (ext[k][1] - ext[k][0]);
// The known species' mean profiles, as reference rows.
const others = ['Adelie', 'Chinstrap'].flatMap((species) => keys.map((key) => ({
  species, measure: key, norm: norm(key, d3.mean(penguins.filter((d) => d.Species === species), (d) => d[key])),
})));
const data = keys.map((measure) => ({ measure, norm: 0.5 }));

mount(Elicit({
  width: 480, height: 300,
  margins: { top: 12, right: 24, bottom: 28, left: 40 },
  data: { data, others },
  schema: {
    data: {
      measure: { type: 'categorical', domain: keys },
      norm:    { type: 'quantitative', domain: [0, 1] },
    },
    others: { context: true, fields: {                          //! the known species, read-only
      species: { type: 'categorical', domain: ['Adelie', 'Chinstrap'] },
      measure: { type: 'categorical', domain: keys },
      norm:    { type: 'quantitative' },
    } },
  },
  constraints: [clamp({ min: 0, max: 1 })],
  axes: { x: { title: false }, y: false },
  guides: [
    guides.custom(({ scales }) => keys.flatMap((k) => {         // the four axes, min and max
      const x = scales.x.encode(k);
      return [
        { background: true, type: 'line', x1: x, x2: x, y1: scales.y.encode(0), y2: scales.y.encode(1), stroke: '#ccc' },
        { type: 'text', x: x - 6, y: scales.y.encode(1) + 4, text: String(ext[k][1]), textAnchor: 'end', fontSize: 10, fill: '#475569' },
        { type: 'text', x: x - 6, y: scales.y.encode(0) + 4, text: String(ext[k][0]), textAnchor: 'end', fontSize: 10, fill: '#475569' },
      ];
    })),
  ],
  marks: [
    lineY({ table: 'others', strokeWidth: 2,
            channels: { x: { field: 'measure' }, y: { field: 'norm' },
                        stroke: { field: 'species', scale: { range: ['#4c78a8', '#72b7b2'] },
                                  legend: { anchor: 'bottom', labelWidth: 60 } } } }),
    lineY({
      stroke: '#e8833a', strokeWidth: 3, handleSize: 6,
      channels: { x: { field: 'measure' }, y: { field: 'norm', edit: move() } }, //! one value per axis
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-bar_argmax',
  status: 'full',
  verdict: 'The argmax aggregate (the budget of each genre\'s top US grosser) is a reduce in JS; a plain `barX`.',
  prep: ['prep-aggregate'],
  gaps: ['Budgets are shown in millions of dollars; films with no genre are dropped rather than shown as a "null" bar.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json')).filter((d) => d['Major Genre'] != null);
const data = d3.rollups(movies, (v) => d3.greatest(v, (d) => d['US Gross']), (d) => d['Major Genre'])
  .map(([genre, top]) => ({ genre, budget: top['Production Budget'] / 1e6 }));

mount(Elicit({
  width: 440, height: 280,
  margins: { top: 8, right: 16, bottom: 32, left: 140 },
  data,
  schema: {
    genre:  { type: 'categorical', domain: data.map((d) => d.genre).sort().reverse() },
    budget: { type: 'quantitative', domain: [0, 250] },
  },
  axes: { x: { title: 'Production Budget ($M) of the top US grosser', grid: true } },
  marks: [barX({ channels: { y: { field: 'genre' }, x: { field: 'budget' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Give a range',
      question: "For each genre's biggest US hit, give a range you are 80% sure contains its production budget.",
      try: 'Drag either end of a bar, or its middle to slide it; press Reveal to see the real budgets.',
      why: 'A bar with an `x1`/`x2` pair is an interval, and `brushSpan()` moves either edge or the whole bar from one gesture. `stage: 0` freezes it on Reveal, when a guide marks where the true value fell.',
      uses: ['brushSpan()', 'ordering()', 'stage', 'guides.custom()'],
      code: `const truth = { Action: 237, Adventure: 11, Comedy: 15, Drama: 10.5, Horror: 12, Musical: 1.5,
  'Thriller/Suspense': 200, Western: 19 };   // Avatar, Star Wars, Home Alone, E.T., Jaws, ...
const genres = Object.keys(truth);
const data = genres.map((genre) => ({ genre, lo: 20, hi: 80 }));

const chart = mount(Elicit({
  width: 440, height: 260,
  margins: { top: 8, right: 16, bottom: 32, left: 120 },
  data,
  schema: {
    genre: { type: 'categorical', domain: [...genres].reverse() },
    lo:    { type: 'quantitative', domain: [0, 300] },
    hi:    { type: 'quantitative', domain: [0, 300] },
  },
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { x: { title: 'Production Budget ($M)', grid: true } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : genres.map((g) => ({
      type: 'circle', r: 4.5, fill: '#e8833a', stroke: 'white',
      cx: scales.x.encode(truth[g]), cy: scales.y.encode(g) + scales.y.bandwidth() / 2,
    }))),
  ],
  marks: [
    barX({
      fillOpacity: 0.6,
      channels: { y: { field: 'genre' }, x1: { field: 'lo' }, x2: { field: 'hi' } },
      edits: [brushSpan({ edgeInset: 8, stage: 0 })],              //! edges or body
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_line_mean_point_raw',
  status: 'full',
  verdict: 'Each raw row carries its year\'s mean (a joinaggregate in JS), so a translucent `point` and a `lineY` are two views over the same rows.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['The year is a number on a linear axis rather than a VL time unit.'],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ year: new Date(d.date).getFullYear(), price: d.price }));
const means = d3.rollup(goog, (v) => d3.mean(v, (d) => d.price), (d) => d.year);
const data = goog.map((d) => ({ ...d, mean: means.get(d.year) }));

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data,
  schema: {
    year:  { type: 'quantitative', domain: [2004, 2010] },
    price: { type: 'quantitative', domain: [0, 800] },
    mean:  { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'price' } },
  marks: [
    point({ size: 3, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.3,
            channels: { x: { field: 'year' }, y: { field: 'price' } } }),
    lineY({ channels: { x: { field: 'year' }, y: { field: 'mean' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the mean',
      question: "Each column is one year of Google's monthly closes. Draw the line through each year's average.",
      try: 'Press and drag left to right through the columns; drag over your line to adjust it.',
      why: '`edit.line.draw()` starts from an empty dataset and lays one point per sample (here each year) as the pointer crosses its column. The monthly closes are a `context: true` table drawn by the recreation\'s `point` mark, so the only rows elicited are the seven yearly means.',
      uses: ['edit.line.draw()', 'context table'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ year: new Date(d.date).getFullYear(), price: d.price }));

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data: [], closes: goog },
  schema: {
    data: {
      s:     { type: 'categorical' },
      year:  { type: 'quantitative', domain: [2004, 2010] },
      price: { type: 'quantitative', domain: [0, 800] },
    },
    closes: { context: true, fields: { year: { type: 'quantitative' }, price: { type: 'quantitative' } } },
  },
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'price' } },
  marks: [
    point({ table: 'closes', size: 3, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.35, //! the monthly closes, read-only
            channels: { x: { field: 'year' }, y: { field: 'price' } } }),
    lineY({
      stroke: '#e8833a', strokeWidth: 3, handleSize: 4,
      channels: { series: { field: 's' }, x: { field: 'year' }, y: { field: 'price' } },
      edits: [edit.line.draw({ series: 's', samples: d3.range(2004, 2011) })], //! one point per year column
    }),
  ],
}));`,
    },
    {
      title: 'Mean and range',
      question: "For each year, where was Google's average close, and what range held most of its months?",
      try: 'Drag a dot on the line: its band travels with it. Drag a band edge to widen or narrow that side alone.',
      why: '`follow()` moves `lo` and `hi` by however far `mean` moved, so the range rides along with the average, while an edge dragged on its own stays independent. `ordering()` keeps `lo <= mean <= hi` whichever you drag.',
      uses: ['move()', 'follow()', 'ordering()', 'context table'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ year: new Date(d.date).getFullYear(), price: d.price }));
// A neutral start: every year at $300, give or take $100.
const data = d3.range(2004, 2011).map((year) => ({ year, lo: 200, mean: 300, hi: 400 }));

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data, closes: goog },
  schema: {
    data: {
      year: { type: 'quantitative', domain: [2004, 2010] },
      lo:   { type: 'quantitative', domain: [0, 800] },
      mean: { type: 'quantitative', domain: [0, 800] },
      hi:   { type: 'quantitative', domain: [0, 800] },
    },
    closes: { context: true, fields: { year: { type: 'quantitative' }, price: { type: 'quantitative' } } },
  },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }),           //! the range moves with the mean
    ordering({ field: ['lo', 'mean', 'hi'] }),               //! lo <= mean <= hi
    clamp({ field: ['lo', 'mean', 'hi'] }),
  ],
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'price' } },
  marks: [
    point({ table: 'closes', size: 3, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.35,
            channels: { x: { field: 'year' }, y: { field: 'price' } } }),
    areaY({
      fill: '#e8833a', fillOpacity: 0.25, handleSize: 3.5,
      channels: {
        x:  { field: 'year' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) },
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },
      },
    }),
    lineY({
      stroke: '#e8833a', strokeWidth: 2.5, handleSize: 5,
      channels: { x: { field: 'year' }, y: { field: 'mean', edit: move() } }, //! drag the mean
    }),
  ],
}));`,
    },
    {
      title: 'Symmetric range',
      question: "For each year, give Google's average close and a range that sits evenly either side of it.",
      try: 'Drag a dot to set the mean. Drag a point on the top edge to set the spread; the bottom edge mirrors it.',
      why: 'Only the upper edge carries an edit, and `symmetric()` mirrors `lo` about `mean` whenever `hi` moves, so the range stays even either side. `follow()` still carries the band when you drag the mean.',
      uses: ['move()', 'follow()', 'symmetric()', 'ordering()'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ year: new Date(d.date).getFullYear(), price: d.price }));
const data = d3.range(2004, 2011).map((year) => ({ year, lo: 250, mean: 300, hi: 350 }));

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 56 },
  data: { data, closes: goog },
  schema: {
    data: {
      year: { type: 'quantitative', domain: [2004, 2010] },
      lo:   { type: 'quantitative', domain: [0, 800] },
      mean: { type: 'quantitative', domain: [0, 800] },
      hi:   { type: 'quantitative', domain: [0, 800] },
    },
    closes: { context: true, fields: { year: { type: 'quantitative' }, price: { type: 'quantitative' } } },
  },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }),
    symmetric({ field: ['lo', 'hi'], about: 'mean' }),       //! the low edge mirrors the high one
    ordering({ field: ['lo', 'mean', 'hi'] }),
    clamp({ field: ['lo', 'mean', 'hi'] }),
  ],
  axes: { x: { title: 'date (year)', tickFormat: 'd' }, y: { grid: true, title: 'price' } },
  marks: [
    point({ table: 'closes', size: 3, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.35,
            channels: { x: { field: 'year' }, y: { field: 'price' } } }),
    areaY({
      fill: '#e8833a', fillOpacity: 0.25, handleSize: 3,
      channels: {
        x:  { field: 'year' },
        y1: { field: 'lo' },
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) }, //! set the spread
      },
    }),
    lineY({
      stroke: '#e8833a', strokeWidth: 2.5, handleSize: 5,
      channels: { x: { field: 'year' }, y: { field: 'mean', edit: move() } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_line_rolling_mean_point_raw',
  status: 'full',
  verdict: 'The ±15-day rolling mean is a window computed in JS onto each row, so the translucent daily `point`s and the red `lineY` are two views over one table.',
  prep: ['prep-window'],
  recreation: {
    code: `const weather = await vegaData('seattle-weather.csv');
const temps = weather.map((d) => d.temp_max);
// window frame [-15, 15]: the mean of up to 31 days around each one.
const data = weather.map((d, i) => ({
  date: d.date, temp: d.temp_max,
  rolling: d3.mean(temps.slice(Math.max(0, i - 15), i + 16)),
}));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 48 },
  data,
  schema: {
    date:    { type: 'temporal' },
    temp:    { type: 'quantitative', domain: [-5, 40] },
    rolling: { type: 'quantitative', domain: [-5, 40] },
  },
  axes: { x: { title: 'Date' }, y: { grid: true, title: 'Max Temperature and Rolling Mean' } },
  marks: [
    point({ size: 2, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.3,
            channels: { x: { field: 'date' }, y: { field: 'temp' } } }),
    lineY({ stroke: 'red', strokeWidth: 3,
            channels: { x: { field: 'date' }, y: { field: 'rolling' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Click the seasons',
      question: "Seattle's daily highs for 2015 are shown. Where does the smoothed seasonal curve run?",
      try: 'Click to drop points on your curve, left to right or in any order; drag one to adjust it.',
      why: '`edit.line.anchor()` adds one point per click to the nearest line, and a domain-ordered line sorts it into place, so you build the curve knot by knot. `move()` on both axes lets you drag a knot afterwards. The daily highs are a `context: true` table.',
      uses: ['edit.line.anchor()', 'move()', 'context table'],
      code: `const days = (await vegaData('seattle-weather.csv'))
  .filter((d) => d.date.getUTCFullYear() === 2015)
  .map((d) => ({ date: d.date, temp: d.temp_max }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 48 },
  data: { data: [], days },
  schema: {
    data: {
      s:    { type: 'categorical' },
      date: { type: 'temporal', domain: [new Date(Date.UTC(2015, 0, 1)), new Date(Date.UTC(2015, 11, 31))] },
      temp: { type: 'quantitative', domain: [-5, 40] },
    },
    days: { context: true, fields: { date: { type: 'temporal' }, temp: { type: 'quantitative' } } },
  },
  axes: { x: { title: 'Date' }, y: { grid: true, title: 'Max Temperature and Rolling Mean' } },
  marks: [
    point({ table: 'days', size: 2, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.4, //! the daily highs, read-only
            channels: { x: { field: 'date' }, y: { field: 'temp' } } }),
    lineY({
      stroke: 'red', strokeWidth: 3, handleSize: 4, curve: 'monotoneX',
      channels: { series: { field: 's' }, x: { field: 'date' }, y: { field: 'temp' } },
      edits: [
        move({ channels: ['x', 'y'] }),                            //! drag a knot
        edit.line.anchor({ series: 's', threshold: 400 }),          //! each click adds a knot
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Typical, then range',
      question: "Month by month, what is a typical 2015 high in Seattle, and between what values do most days fall?",
      try: 'Drag each dot to the month\'s typical high; its band follows. Press Next, then sweep along either band edge to reshape that side.',
      why: 'Each month is one row of `lo`, `mean` and `hi`. At `stage: 0` you drag the means and `follow()` carries each band; at `stage: 1` an `edit.line.sweep()` on `y1` and on `y2` paints whichever edge is nearer at drag-start. Staging keeps the sweep\'s plane from covering the dots.',
      uses: ['areaY', 'edit.line.sweep()', 'move()', 'follow()', 'stage'],
      code: `const days = (await vegaData('seattle-weather.csv'))
  .filter((d) => d.date.getUTCFullYear() === 2015)
  .map((d) => ({ date: d.date, temp: d.temp_max }));
// One row per mid-month, starting at 15 \u00b1 5.
const data = d3.range(12).map((m) => ({ date: new Date(Date.UTC(2015, m, 15)), lo: 10, mean: 15, hi: 20 }));

const chart = mount(Elicit({
  width: 420, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 48 },
  stageLabels: ['typical', 'range'],
  data: { data, days },
  schema: {
    data: {
      date: { type: 'temporal', domain: [new Date(Date.UTC(2015, 0, 1)), new Date(Date.UTC(2015, 11, 31))] },
      lo:   { type: 'quantitative', domain: [-5, 40] },
      mean: { type: 'quantitative', domain: [-5, 40] },
      hi:   { type: 'quantitative', domain: [-5, 40] },
    },
    days: { context: true, fields: { date: { type: 'temporal' }, temp: { type: 'quantitative' } } },
  },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }),           //! the band rides on the mean
    ordering({ field: ['lo', 'mean', 'hi'] }),
  ],
  axes: { x: { title: 'Date' }, y: { grid: true, title: 'Max Temperature' } },
  marks: [
    point({ table: 'days', size: 2, fill: 'none', stroke: '#4c78a8', strokeOpacity: 0.4,
            channels: { x: { field: 'date' }, y: { field: 'temp' } } }),
    areaY({
      fill: 'red', fillOpacity: 0.15, stroke: 'red', handleSize: 2.5, curve: 'monotoneX',
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: edit.line.sweep({ stage: 1 }) }, //! then paint the low edge
        y2: { field: 'hi', edit: edit.line.sweep({ stage: 1 }) }, //! and the high edge
      },
    }),
    lineY({
      stroke: 'red', strokeWidth: 3, handleSize: 4.5, curve: 'monotoneX',
      channels: { x: { field: 'date' }, y: { field: 'mean', edit: move({ stage: 0 }) } }, //! first the typical high
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Next';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_line_window',
  status: 'full',
  verdict: 'The row number and fps are computed in JS; two series in one `lineY` on a log y scale.',
  prep: ['prep-window', 'prep-calculate'],
  gaps: ['The legend sits at the right, not inside the bottom-right corner.'],
  recreation: {
    code: `const falcon = [16.82,19.76,16.08,19.58,16.42,16.2,16.02,15.94,16.28,16.12,16.16,16.12,16.14,16.1,16.2,16.26,19.36,19.7,15.94,19.14,16.2,16.12,19.52,19.7,16.2,20.98,16.3,16.42,16.82,16.5,16.56,16.18,16.08,16.24,16.04,16.3,19.4,15.7,16.24,15.92,16.26,16.22,16.52,16.46,16.36,15.72,16.06,15.96,16.48,16.6,16.24,16.94,16.22,15.96,15.9,16.48,16.32,15.76,16,16.18,16.22,15.8,16.14,16.3,16.36,16.26,15.96,15.94,16.54,16.14,16.26,16.2,15.9,16.08,16.08,15.7,15.66,16.14,23.1,16.6,16.42,16.02,15.62,16.36,15.72,15.92,15.56,16.34,22.82,15.66,15.56,16,16,15.82,16.4,16.46,16.06,16.24,15.8,16.16,16.36,19.7,16.1,16.14,15.82,16.44,16.14,16.02,15.86,16.06,16.02,15.92,15.82,16.58,15.88,16.58,15.7,19.38,19.24,16,15.98,15.96,16.2,15.98,16.34,16.32,16.26,15.92,15.54,16.14,16.46,16.34,15.82,19.72,15.76,16.5,15.72,16.08,16.44,16.2,15.96,16,16.1,19.32,16.1,16.18,15.96,22.64,15.9,16.28,16.1,15.92,16.08,16.26,15.9,15.82,15.7,15.98,16.38,16.04,19.42,15.94,16.16,15.96,16.26,15.78,15.88,15.98,16.06,16.12,23.02,15.62,15.92,16.06,14.78,16.26,19.52,16.32,16.6,16.22,19.74,19.46,15.94,15.84,16.1,16.46,16.18,16.1,15.94,16.06,15.86,15.82,16.04,16.18,15.82,17.3,15.94,15.74,15.72,15.68,15.62,15.6,16.04,15.5,15.6,19.44,15.96,16.24,16.04,16.24];
const square = [24.2,17.9,15.8,58.4,151,2523.1,245.3,136,72.3,55.7,42.4,37.7,30.1,30.1,21.8,20.6,21.8,17.6,18.2,21,941.7,177.4,2821.8,359.2,318,217.1,126,69,57.8,45.3,35.6,29.1,23.8,44.2,17.7,17.7,15.7,27.8,22.8,3853.6,91.6,181.4,476.3,265.9,254.6,2583.2,124.8,73.2,56.4,48.7,41.6,21.1,20.3,21.3,18.3,17.1,19.5,828.2,162.2,217.9,205.5,197.6,2249.8,103.1,71.7,57.6,41.4,34.5,22,20.5,21.7,18.3,17.3,19.4,666.8,214.9,212.3,125.8,67.7,56.1,45.8,38.3,33,35.4,22.7,19.4,19.9,24.1,19.3,21.3,3508.7,204.1,125.4,65.3,60.8,44.1,36.3,30.5,28.6,16.5,18.6,23.7,22.3,17.6,19.2,448.8,124.4,66.6,53.5,51,45.2,28.4,29.2,26.7,25.9,18.1,17.6,20.1,25.2,3332,67.5,53.6,56.6,39.9,27.6,29.6,33.5,17.2,18.8,25.2,16.7,16.9,240.2,52.4,42.1,33.9,28,28.6,17.3,20,21,22.8,16.7,19.2,175.4,43.5,34.7,29.7,34.9,25.8,17.3,22.6,17.6,17.2,19.2,111.8,35.4,27.6,25.4,21.9,18.6,18.1,21.2,17.9,17,80.6,29.8,30.1,16,26.8,17.5,22.3,16.8,22.4,77.4,31,29.7,28.7,26,16.9,15.8,19,52.6,25.2,16.7,17.9,21,19.8,18.8,46.5,17.5,16.8,18.3,18.3,14.9,41,18.3,17.3,17,17.5,32.3,22.6,16.6,17.9,25.6,17.5,20.3,25.2,18.6,17.7];
// row_number and fps = 1000 / ms, per system.
const data = [['Falcon', falcon], ['Square Crossfilter (3M)', square]].flatMap(([system, ms]) =>
  ms.map((v, i) => ({ system, row: i + 1, fps: 1000 / v })));

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data,
  schema: {
    system: { type: 'categorical', domain: ['Falcon', 'Square Crossfilter (3M)'] },
    row:    { type: 'quantitative', domain: [1, 209] },
    fps:    { type: 'quantitative', domain: [0.2, 80] },
  },
  axes: { x: { title: 'Trial' }, y: { tickValues: [0.5, 1, 2, 5, 10, 20, 50], tickFormat: '~g' } },
  marks: [
    lineY({
      strokeWidth: 1,
      channels: {
        x: { field: 'row' },
        y: { field: 'fps', scale: 'log' },
        stroke: { field: 'system', legend: { labelWidth: 140 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set each typical rate',
      question: 'Square Crossfilter stalls now and then. Where is the MEDIAN frame rate of each system?',
      try: 'Drag each horizontal line up or down, then press Reveal.',
      why: 'On a log axis the eye overweights the dips, which is exactly what makes this a hard estimate. `ruleY` with `move()` on `y` inverts the pointer through the same log scale, so the answer is in frames per second. The traces are a `context: true` table, and each median is a `guides.rule()` whose `y` is a function of the stage.',
      uses: ['ruleY', 'move()', 'stage', 'context table', 'guides.rule()'],
      code: `const falcon = [16.82,19.76,16.08,19.58,16.42,16.2,16.02,15.94,16.28,16.12,16.16,16.12,16.14,16.1,16.2,16.26,19.36,19.7,15.94,19.14,16.2,16.12,19.52,19.7,16.2,20.98,16.3,16.42,16.82,16.5,16.56,16.18,16.08,16.24,16.04,16.3,19.4,15.7,16.24,15.92,16.26,16.22,16.52,16.46,16.36,15.72,16.06,15.96,16.48,16.6,16.24,16.94,16.22,15.96,15.9,16.48,16.32,15.76,16,16.18,16.22,15.8,16.14,16.3,16.36,16.26,15.96,15.94,16.54,16.14,16.26,16.2,15.9,16.08,16.08,15.7,15.66,16.14,23.1,16.6,16.42,16.02,15.62,16.36,15.72,15.92,15.56,16.34,22.82,15.66,15.56,16,16,15.82,16.4,16.46,16.06,16.24,15.8,16.16,16.36,19.7,16.1,16.14,15.82,16.44,16.14,16.02,15.86,16.06,16.02,15.92,15.82,16.58,15.88,16.58,15.7,19.38,19.24,16,15.98,15.96,16.2,15.98,16.34,16.32,16.26,15.92,15.54,16.14,16.46,16.34,15.82,19.72,15.76,16.5,15.72,16.08,16.44,16.2,15.96,16,16.1,19.32,16.1,16.18,15.96,22.64,15.9,16.28,16.1,15.92,16.08,16.26,15.9,15.82,15.7,15.98,16.38,16.04,19.42,15.94,16.16,15.96,16.26,15.78,15.88,15.98,16.06,16.12,23.02,15.62,15.92,16.06,14.78,16.26,19.52,16.32,16.6,16.22,19.74,19.46,15.94,15.84,16.1,16.46,16.18,16.1,15.94,16.06,15.86,15.82,16.04,16.18,15.82,17.3,15.94,15.74,15.72,15.68,15.62,15.6,16.04,15.5,15.6,19.44,15.96,16.24,16.04,16.24];
const square = [24.2,17.9,15.8,58.4,151,2523.1,245.3,136,72.3,55.7,42.4,37.7,30.1,30.1,21.8,20.6,21.8,17.6,18.2,21,941.7,177.4,2821.8,359.2,318,217.1,126,69,57.8,45.3,35.6,29.1,23.8,44.2,17.7,17.7,15.7,27.8,22.8,3853.6,91.6,181.4,476.3,265.9,254.6,2583.2,124.8,73.2,56.4,48.7,41.6,21.1,20.3,21.3,18.3,17.1,19.5,828.2,162.2,217.9,205.5,197.6,2249.8,103.1,71.7,57.6,41.4,34.5,22,20.5,21.7,18.3,17.3,19.4,666.8,214.9,212.3,125.8,67.7,56.1,45.8,38.3,33,35.4,22.7,19.4,19.9,24.1,19.3,21.3,3508.7,204.1,125.4,65.3,60.8,44.1,36.3,30.5,28.6,16.5,18.6,23.7,22.3,17.6,19.2,448.8,124.4,66.6,53.5,51,45.2,28.4,29.2,26.7,25.9,18.1,17.6,20.1,25.2,3332,67.5,53.6,56.6,39.9,27.6,29.6,33.5,17.2,18.8,25.2,16.7,16.9,240.2,52.4,42.1,33.9,28,28.6,17.3,20,21,22.8,16.7,19.2,175.4,43.5,34.7,29.7,34.9,25.8,17.3,22.6,17.6,17.2,19.2,111.8,35.4,27.6,25.4,21.9,18.6,18.1,21.2,17.9,17,80.6,29.8,30.1,16,26.8,17.5,22.3,16.8,22.4,77.4,31,29.7,28.7,26,16.9,15.8,19,52.6,25.2,16.7,17.9,21,19.8,18.8,46.5,17.5,16.8,18.3,18.3,14.9,41,18.3,17.3,17,17.5,32.3,22.6,16.6,17.9,25.6,17.5,20.3,25.2,18.6,17.7];
const systems = ['Falcon', 'Square Crossfilter (3M)'];
const colour = ['#4c78a8', '#f58518'];
const traces = [['Falcon', falcon], ['Square Crossfilter (3M)', square]].flatMap(([system, ms]) =>
  ms.map((v, i) => ({ system, row: i + 1, fps: 1000 / v })));
const median = systems.map((s) => d3.median(traces.filter((d) => d.system === s), (d) => d.fps));
const data = [{ system: 'Falcon', fps: 3 }, { system: 'Square Crossfilter (3M)', fps: 8 }]; // apart, so both show

const chart = mount(Elicit({
  width: 440, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data: { data, traces },
  schema: {
    data: {
      system: { type: 'categorical', domain: systems },
      fps:    { type: 'quantitative', domain: [0.2, 80] },
    },
    traces: { context: true, fields: {
      system: { type: 'categorical', domain: systems },
      row:    { type: 'quantitative', domain: [1, 209] },
      fps:    { type: 'quantitative' },
    } },
  },
  axes: { x: false, y: { tickValues: [0.5, 1, 2, 5, 10, 20, 50], tickFormat: '~g', grid: true } },
  guides: systems.map((s, k) => guides.rule({                  //! the answer, after Reveal
    y: ({ stage }) => (stage < 1 ? undefined : median[k]),
    stroke: colour[k], strokeWidth: 2, strokeDash: '5 4',
  })),
  marks: [
    lineY({ table: 'traces', strokeWidth: 1, opacity: 0.6,
            channels: { x: { field: 'row' }, y: { field: 'fps', scale: 'log' }, stroke: { field: 'system' } } }),
    ruleY({
      strokeWidth: 4,
      channels: {
        y: { field: 'fps', scale: 'log', edit: move({ stage: 0 }) },  //! inverts through the log scale
        stroke: { field: 'system', scale: { range: colour }, legend: { labelWidth: 140 } },
      },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_quantile_quantile',
  status: 'partial',
  verdict: 'The quantile transform and the normal quantile function are computed in JS and each panel is a plain `point` chart. Multiple views are not covered by this study, so only the normal Q-Q panel is drawn.',
  needs: ['concat'],
  prep: ['prep-calculate'],
  gaps: ['Only the right-hand (normal) panel; the uniform panel would be a second chart.'],
  recreation: {
    code: `const u = (await vegaData('normal-2d.json')).map((d) => d.u).sort(d3.ascending);
// Inverse normal CDF (Giles' erfinv approximation).
const erfinv = (x) => {
  let w = -Math.log((1 - x) * (1 + x)), p;
  if (w < 5) { w -= 2.5; p = [2.81022636e-08, 3.43273939e-07, -3.5233877e-06, -4.39150654e-06, 0.00021858087,
    -0.00125372503, -0.00417768164, 0.246640727, 1.50140941].reduce((a, c) => c + a * w, 0); }
  else { w = Math.sqrt(w) - 3; p = [-0.000200214257, 0.000100950558, 0.00134934322, -0.00367342844,
    0.00573950773, -0.0076224613, 0.00943887047, 1.00167406, 2.83297682].reduce((a, c) => c + a * w, 0); }
  return p * x;
};
// quantile: step 0.01, then quantileNormal(p).
const data = d3.range(0.005, 1, 0.01).map((p) => ({
  norm: Math.SQRT2 * erfinv(2 * p - 1), v: d3.quantileSorted(u, p),
}));

mount(Elicit({
  width: 300, height: 280,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data,
  schema: {
    norm: { type: 'quantitative', domain: [-3, 3] },
    v:    { type: 'quantitative', domain: [-0.6, 0.6] },
  },
  axes: { x: { title: 'norm', grid: true }, y: { grid: true }, origin: false },
  marks: [point({ size: 3, fill: 'none', stroke: '#4c78a8', channels: { x: { field: 'norm' }, y: { field: 'v' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Fit the reference line',
      question: 'If this sample were normal, its Q-Q points would lie on a straight line. Draw that line.',
      try: 'Drag the middle handle to set the level, an end handle to set the tilt.',
      why: 'On a normal Q-Q plot the reference line\'s height at 0 is the mean and its slope is the standard deviation, so dragging a `trend` elicits both. `edit.trend.intercept()` and `edit.trend.slope()` claim separate handles; the Q-Q points are a `context: true` table.',
      uses: ['trend', 'edit.trend.intercept()', 'edit.trend.slope()', 'context table'],
      code: `const u = (await vegaData('normal-2d.json')).map((d) => d.u).sort(d3.ascending);
const erfinv = (x) => {
  let w = -Math.log((1 - x) * (1 + x)), p;
  if (w < 5) { w -= 2.5; p = [2.81022636e-08, 3.43273939e-07, -3.5233877e-06, -4.39150654e-06, 0.00021858087,
    -0.00125372503, -0.00417768164, 0.246640727, 1.50140941].reduce((a, c) => c + a * w, 0); }
  else { w = Math.sqrt(w) - 3; p = [-0.000200214257, 0.000100950558, 0.00134934322, -0.00367342844,
    0.00573950773, -0.0076224613, 0.00943887047, 1.00167406, 2.83297682].reduce((a, c) => c + a * w, 0); }
  return p * x;
};
const qq = d3.range(0.005, 1, 0.01).map((p) => ({ x: Math.SQRT2 * erfinv(2 * p - 1), y: d3.quantileSorted(u, p) }));

mount(Elicit({
  width: 320, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 40 },
  data: { data: [{ mean: 0.3, sd: 0 }], qq },                  // a flat, off-centre start
  schema: {
    data: {
      x:    { type: 'quantitative', domain: [-3, 3] },
      y:    { type: 'quantitative', domain: [-0.6, 0.6] },
      mean: { type: 'quantitative' },
      sd:   { type: 'quantitative' },
    },
    qq: { context: true, fields: { x: { type: 'quantitative' }, y: { type: 'quantitative' } } },
  },
  axes: { x: { title: 'normal quantile', grid: true }, y: { grid: true }, origin: false },
  guides: [
    guides.custom(({ data }) => [{ type: 'text', x: 8, y: 14, fontSize: 12, fill: '#334155',
      text: 'mean ' + data[0].mean.toFixed(2) + '   sd ' + data[0].sd.toFixed(2) }]),
  ],
  marks: [
    point({ table: 'qq', size: 3, fill: 'none', stroke: '#4c78a8', channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    trend({
      stroke: '#e8833a',
      channels: {
        intercept: { field: 'mean', edit: edit.trend.intercept() },  //! height at 0 = the mean
        slope:     { field: 'sd', edit: edit.trend.slope() },        //! slope = the SD
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_point_line_regression',
  status: 'full',
  verdict: 'The least-squares fit is computed in JS and stamped on each row, so the filled `point`s and the firebrick `lineY` are two views of one table; the R² label is a guide.',
  prep: ['prep-regression'],
  gaps: ['The R² label is a `guides.custom()` text, not a text layer fed by regression params.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json'))
  .filter((d) => d['Rotten Tomatoes Rating'] != null && d['IMDB Rating'] != null)
  .map((d) => ({ rt: d['Rotten Tomatoes Rating'], imdb: d['IMDB Rating'] }));
// Ordinary least squares, stamped on every row.
const mx = d3.mean(movies, (d) => d.rt), my = d3.mean(movies, (d) => d.imdb);
const b = d3.sum(movies, (d) => (d.rt - mx) * (d.imdb - my)) / d3.sum(movies, (d) => (d.rt - mx) ** 2);
const a = my - b * mx;
const data = movies.map((d) => ({ ...d, fit: a + b * d.rt }));
const r2 = 1 - d3.sum(data, (d) => (d.imdb - d.fit) ** 2) / d3.sum(data, (d) => (d.imdb - my) ** 2);

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 20, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    rt:   { type: 'quantitative', domain: [0, 100] },
    imdb: { type: 'quantitative', domain: [0, 10] },
    fit:  { type: 'quantitative', domain: [0, 10] },
  },
  axes: { x: { title: 'Rotten Tomatoes Rating', grid: true }, y: { grid: true } },
  guides: [guides.custom(({ width }) => [{ type: 'text', x: width, y: -6, textAnchor: 'end',
    fontSize: 11, fill: 'firebrick', text: 'R²: ' + r2.toFixed(2) }])],
  marks: [
    point({ size: 2, fill: '#4c78a8', fillOpacity: 0.7, channels: { x: { field: 'rt' }, y: { field: 'imdb' } } }),
    lineY({ stroke: 'firebrick', channels: { x: { field: 'rt' }, y: { field: 'fit' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Line and uncertainty',
      question: 'How does a film\'s IMDB rating rise with its Rotten Tomatoes score, and how sure are you?',
      try: 'Drag the line\'s handles to set the relationship, then the band\'s handles to widen or narrow your uncertainty.',
      why: 'The belief is one row of four parameters. `trend` writes the intercept and slope, `trendBand` draws every line within your spreads and, with `handles: true`, writes the spreads too. A sample of films sits behind in a `context: true` table.',
      uses: ['trend', 'trendBand', 'edit.trend.intercept()', 'edit.trend.slope()', 'edit.trend.interceptSpread()', 'edit.trend.slopeSpread()', 'context table'],
      code: `const films = (await vegaData('movies.json'))
  .filter((d) => d['Rotten Tomatoes Rating'] != null && d['IMDB Rating'] != null)
  .filter((d, i) => i % 8 === 0)                              // a sample, as context
  .map((d) => ({ x: d['Rotten Tomatoes Rating'], y: d['IMDB Rating'] }));

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data: { data: [{ intercept: 5, slope: 0.01, aSd: 0.6, bSd: 0.01 }], films },
  schema: {
    data: {
      x:         { type: 'quantitative', domain: [0, 100] },
      y:         { type: 'quantitative', domain: [0, 10] },
      intercept: { type: 'quantitative' },
      slope:     { type: 'quantitative' },
      aSd:       { type: 'quantitative' },
      bSd:       { type: 'quantitative' },
    },
    films: { context: true, fields: { x: { type: 'quantitative' }, y: { type: 'quantitative' } } },
  },
  constraints: [clamp({ field: 'aSd', min: 0, max: 5 }), clamp({ field: 'bSd', min: 0, max: 0.1 })],
  axes: { x: { title: 'Rotten Tomatoes Rating', grid: true }, y: { grid: true }, origin: false },
  marks: [
    point({ table: 'films', size: 2, fill: '#94a3b8', opacity: 0.6, channels: { x: { field: 'x' }, y: { field: 'y' } } }),
    trendBand({
      fill: 'firebrick', handles: true, grip: 'probe',
      channels: {
        interceptSpread: { field: 'aSd', edit: edit.trend.interceptSpread() }, //! uncertainty in the level
        slopeSpread:     { field: 'bSd', edit: edit.trend.slopeSpread() },     //! uncertainty in the slope
      },
    }),
    trend({
      stroke: 'firebrick', grip: 'probe',
      channels: {
        intercept: { field: 'intercept', edit: edit.trend.intercept() },        //! rating at RT = 0
        slope:     { field: 'slope', edit: edit.trend.slope() },                //! points per RT point
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_point_line_loess',
  status: 'full',
  verdict: 'A loess smoother (tricube weights, bandwidth 0.3, as VL) is computed in JS onto each row; filled `point`s and a firebrick `lineY` over the same table.',
  prep: ['prep-regression'],
  recreation: {
    code: `const movies = (await vegaData('movies.json'))
  .filter((d) => d['Rotten Tomatoes Rating'] != null && d['IMDB Rating'] != null)
  .map((d) => ({ rt: d['Rotten Tomatoes Rating'], imdb: d['IMDB Rating'] }));
// Local linear regression with tricube weights over the nearest 30% of rows.
const loessAt = (x0) => {
  const near = movies.map((d) => [Math.abs(d.rt - x0), d]).sort((a, b) => a[0] - b[0])
    .slice(0, Math.floor(movies.length * 0.3));
  const h = near[near.length - 1][0] || 1;
  let sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [dist, d] of near) {
    const w = (1 - (dist / h) ** 3) ** 3;
    sw += w; sx += w * d.rt; sy += w * d.imdb; sxx += w * d.rt * d.rt; sxy += w * d.rt * d.imdb;
  }
  const b = (sw * sxy - sx * sy) / (sw * sxx - sx * sx || 1);
  return (sy - b * sx) / sw + b * x0;
};
const smooth = new Map([...new Set(movies.map((d) => d.rt))].map((x) => [x, loessAt(x)]));
const data = movies.map((d) => ({ ...d, loess: smooth.get(d.rt) }));

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    rt:    { type: 'quantitative', domain: [0, 100] },
    imdb:  { type: 'quantitative', domain: [0, 10] },
    loess: { type: 'quantitative', domain: [0, 10] },
  },
  axes: { x: { title: 'Rotten Tomatoes Rating', grid: true }, y: { grid: true } },
  marks: [
    point({ size: 2, fill: '#4c78a8', fillOpacity: 0.7, channels: { x: { field: 'rt' }, y: { field: 'imdb' } } }),
    lineY({ stroke: 'firebrick', channels: { x: { field: 'rt' }, y: { field: 'loess' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sketch the curve',
      question: 'A straight line may not be right. Sketch how the typical IMDB rating changes across Rotten Tomatoes scores.',
      try: 'Sweep along the flat line through the cloud. Hold Shift and drag near one point to fine-tune it alone.',
      why: 'A smoother is just a line with free values, so it is eleven seeded knots you `edit.line.sweep()`. With Shift held, `when.shift` hands the drag to `move({ pick: "nearest" })` instead, which moves only the closest knot. The films are a `context: true` table.',
      uses: ['edit.line.sweep()', 'move({ pick: "nearest" })', 'when.shift', 'context table'],
      code: `const films = (await vegaData('movies.json'))
  .filter((d) => d['Rotten Tomatoes Rating'] != null && d['IMDB Rating'] != null)
  .filter((d, i) => i % 6 === 0)
  .map((d) => ({ rt: d['Rotten Tomatoes Rating'], imdb: d['IMDB Rating'] }));
const data = d3.range(0, 101, 10).map((rt) => ({ rt, imdb: 6.3 }));   // flat at the mean

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data: { data, films },
  schema: {
    data: {
      rt:   { type: 'quantitative', domain: [0, 100] },
      imdb: { type: 'quantitative', domain: [0, 10] },
    },
    films: { context: true, fields: { rt: { type: 'quantitative' }, imdb: { type: 'quantitative' } } },
  },
  axes: { x: { title: 'Rotten Tomatoes Rating', grid: true }, y: { grid: true } },
  marks: [
    point({ table: 'films', size: 2, fill: '#94a3b8', opacity: 0.6, channels: { x: { field: 'rt' }, y: { field: 'imdb' } } }),
    lineY({
      stroke: 'firebrick', strokeWidth: 3, handleSize: 4, curve: 'monotoneX',
      channels: { x: { field: 'rt' }, y: { field: 'imdb' } },
      edits: [
        edit.line.sweep({ channels: ['y'], when: when.noShift }),   //! sweep the whole curve
        move({ channels: ['y'], pick: 'nearest', when: when.shift }), //! shift-drag one knot
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-window_impute_null',
  status: 'full',
  verdict: 'The lag/lead window and the impute are computed in JS; a `lineY` over dates, `handles: true` for the points, and a day-month tick format.',
  prep: ['prep-window', 'prep-calculate'],
  recreation: {
    code: `const raw = [28, 55, null, 65, 43, null, 55, 43];
// window lag/lead: a missing value becomes the mean of its neighbours.
const data = raw.map((b, i) => ({
  date: new Date(2000, 0, i + 1),
  b: b == null ? (raw[i - 1] + raw[i + 1]) / 2 : b,
}));

mount(Elicit({
  width: 320, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    date: { type: 'temporal' },
    b:    { type: 'quantitative', domain: [0, 70] },
  },
  axes: { x: { tickFormat: (d) => d3.timeFormat('%d %b')(d), title: 'a (year-month-date)' }, y: { grid: true } },
  marks: [lineY({ handles: true, handleSize: 3.5, channels: { x: { field: 'date' }, y: { field: 'b' } } })], // VL's point: true
}));`,
  },
  interfaces: [
    {
      title: 'Guess, see, revise',
      question: 'Two days are missing. Guess them, see what averaging the neighbours gives, then revise.',
      try: 'Drag the two orange points; press Next to see the window estimate, then drag the green points.',
      why: 'Two marks over the same rows read two columns: `guess` is editable at `stage: 0`, `revised` at `stage: 1`. A `constraints.custom()` copies each guess into `revised` while you guess, so the revision starts from it and the first answer is kept.',
      uses: ['stage', 'move()', 'constraints.custom()', 'lock', 'guides.custom()'],
      code: `const raw = [28, 55, null, 65, 43, null, 55, 43];
const data = raw.map((b, i) => ({ date: new Date(2000, 0, i + 1), guess: b ?? 35, revised: b ?? 35 }));

const chart = mount(Elicit({
  width: 320, height: 240,
  margins: { top: 12, right: 16, bottom: 32, left: 36 },
  data,
  schema: {
    date:    { type: 'temporal' },
    guess:   { type: 'quantitative', domain: [0, 80] },
    revised: { type: 'quantitative', domain: [0, 80] },
  },
  lock: (d, i) => raw[i] != null,                                //! the recorded days
  stageLabels: ['guess', 'revise'],
  constraints: [
    constraints.custom(({ data, oldData }) =>                     //! a guess also moves the revision
      data.some((d, i) => oldData[i] && d.guess !== oldData[i].guess)
        ? data.map((d) => ({ ...d, revised: d.guess })) : undefined),
  ],
  axes: { x: { tickFormat: (d) => d3.timeFormat('%d %b')(d) }, y: { grid: true } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [2, 5].map((i) => ({
      type: 'circle', r: 6, fill: 'none', stroke: '#334155', strokeWidth: 1.5,
      cx: scales.x.encode(new Date(2000, 0, i + 1)), cy: scales.y.encode((raw[i - 1] + raw[i + 1]) / 2),
    }))),
  ],
  marks: [
    lineY({ stroke: '#e8833a', handleSize: 4,
            channels: { x: { field: 'date' }, y: { field: 'guess', edit: move({ stage: 0 }) } } }),   //! first guess
    lineY({ stroke: '#54a24b', handleSize: 4,
            channels: { x: { field: 'date' }, y: { field: 'revised', edit: move({ stage: 1 }) } } }), //! revision
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Next';
btn.onclick = () => chart.nextStage();`,
    },
  ],
});

GALLERY.add({
  id: 'vl-ternary',
  status: 'full',
  verdict: 'The barycentric transform is JS; the cities are `point` and `text` marks with a tooltip, and the coloured regions, dashed grid and corner labels are `areaY`, `lineY` and `text` marks over three context tables.',
  prep: ['prep-calculate'],
  gaps: [
    'Each region is an `areaY` band between its lower and upper edge (every triangle here is x-monotone), where VL draws a closed, filled line.',
    'The tooltip is one box of lines rather than VL\'s titled rows with emoji keys.',
    'The long title is split into a title and a subtitle to fit the narrower chart.',
  ],
  recreation: {
    code: `const cities = [['Luminar', 5, 50, 30], ['Crystalport', 35, 60, 20], ['Stellaheim', 115, 40, 70],
  ['Mistral Heights', 30, 45, 252], ['Verdancia', 120, 35, 2], ['Aurelian City', 28, 48, 32],
  ['Solaris Bay', 32, 458, 55], ['Sandspire', 12, 30, 55], ['Azureon', 40, 50, 15], ['Goldcrest', 18, 28, 35]];
const colourOf = (h, m, l) => h > 0.8 ? '#FF0F0F' : m > 0.8 ? '#FFC333' : l > 0.8 ? '#32F95D'
  : h > 0.5 ? (m > l ? '#ff3c18' : '#cb4922') : m > 0.5 ? (h > l ? '#ff962a' : '#cbd03d')
  : l > 0.5 ? (m < h ? '#65be49' : '#65eb52') : '#43c1ce';
// Barycentric -> cartesian: High at (0,0), Low at (1,0), Medium at the apex.
const data = cities.map(([city, H, M, L]) => {
  const t = H + M + L, h = H / t, m = M / t, l = L / t;
  return { city, total: t, h, m, l, colour: colourOf(h, m, l), x: 0.5 * (2 * l + m), y: 0.866 * m };
});
// A triangle as an areaY band: at each vertex, from the vertex to the opposite edge.
const band = (fill, pts) => pts.map(([x, y], i) => {
  const [a, b] = pts.filter((_, j) => j !== i);
  const t = (x - a[0]) / (b[0] - a[0]);
  const yy = t >= 0 && t <= 1 ? a[1] + t * (b[1] - a[1]) : y;
  return { fill, x, y1: Math.min(y, yy), y2: Math.max(y, yy) };
}).sort((p, q) => p.x - q.x);
const regions = [
  ['#c8edf1', [[0.25, 0.433], [0.75, 0.433], [0.5, 0]]], ['#f7b7b7', [[0, 0], [0.25, 0.433], [0.5, 0]]],
  ['#ff7a7a', [[0, 0], [0.1, 0.1732], [0.2, 0]]], ['#d1ffdb', [[1, 0], [0.75, 0.433], [0.5, 0]]],
  ['#7cff98', [[1, 0], [0.9, 0.1732], [0.8, 0]]], ['#ffd26f', [[0.5, 0.866], [0.25, 0.433], [0.75, 0.433]]],
  ['#fff0cf', [[0.5, 0.866], [0.4, 0.6928], [0.6, 0.6928]]],
].flatMap(([fill, pts]) => band(fill, pts));
// Three families of grid lines, two rows each.
const gridLines = d3.range(1, 10).flatMap((k) => {
  const f = k / 10;
  return [[[f, 0], [f / 2, f * 0.866]], [[1 - f, 0], [1 - f / 2, f * 0.866]], [[f / 2, f * 0.866], [1 - f / 2, f * 0.866]]];
}).flatMap((pts, line) => pts.map(([x, y]) => ({ line, x, y })));
const corners = [{ label: 'High 100%', x: -0.05, y: -0.05 }, { label: 'Low 100%', x: 1.05, y: -0.05 },
  { label: 'Medium 100%', x: 0.5, y: 0.888 }];
const pct = d3.format('.0%');

mount(Elicit({
  width: 440, height: 460,
  margins: { top: 24, right: 16, bottom: 24, left: 16 },
  title: 'Population Distribution by Socioeconomic Level',
  subtitle: 'in fictional cities',
  data: { data, regions, gridLines, corners },
  schema: {
    data: {
      city:   { type: 'categorical' },
      total:  { type: 'quantitative' },
      h:      { type: 'quantitative' }, m: { type: 'quantitative' }, l: { type: 'quantitative' },
      colour: { type: 'categorical' },
      x:      { type: 'quantitative', domain: [-0.1, 1.1] },
      y:      { type: 'quantitative', domain: [-0.08, 0.95] },
    },
    regions: { context: true, fields: { fill: { type: 'categorical' }, x: { type: 'quantitative' },
                                        y1: { type: 'quantitative' }, y2: { type: 'quantitative' } } },
    gridLines: { context: true, fields: { line: { type: 'categorical' }, x: { type: 'quantitative' }, y: { type: 'quantitative' } } },
    corners: { context: true, fields: { label: { type: 'categorical' }, x: { type: 'quantitative' }, y: { type: 'quantitative' } } },
  },
  axes: false,
  marks: [
    areaY({ table: 'regions', fillOpacity: 0.65, strokeWidth: 0.2,
            channels: { x: { field: 'x' }, y1: { field: 'y1' }, y2: { field: 'y2' }, series: { field: 'fill' },
                        fill: { field: 'fill', scale: null }, stroke: { field: 'fill', scale: null } } }),
    lineY({ table: 'gridLines', stroke: '#696969', strokeWidth: 0.6, strokeDash: '2 2',
            channels: { x: { field: 'x' }, y: { field: 'y' }, series: { field: 'line' } } }),
    text({ table: 'corners', fontSize: 12, dy: -6,
           channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'label' } } }),
    point({
      stroke: '#000', strokeWidth: 1.5,
      tip: (d) => [d.city, 'High ' + pct(d.h), 'Medium ' + pct(d.m), 'Low ' + pct(d.l)],
      channels: {
        x: { field: 'x' }, y: { field: 'y' },
        fill: { field: 'colour', scale: null },
        size: { field: 'total', scale: { range: [4, 12] } },
      },
    }),
    text({
      fontSize: 10,
      channels: {
        x: { field: 'x' }, y: { field: 'y' }, text: { field: 'city' },
        dy: { fn: (d) => d.y > 0.78 ? 16 : -14 },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place a composition',
      question: 'Think of a city you know. What share of its households are high, medium and low socioeconomic level?',
      try: 'Drag the dot anywhere in the triangle; the three shares update as you go.',
      why: 'One 2-D position IS three shares that sum to 100%, so `move()` on both axes elicits a composition in a single gesture. A `constraints.custom()` projects the point back inside the triangle, and a guide reads the derived shares out.',
      uses: ['move()', 'constraints.custom()', 'guides.custom()'],
      code: `const shares = (d) => {
  const m = d.y / 0.866, l = d.x - m / 2;
  return { high: 1 - l - m, medium: m, low: l };
};
const outline = [[0, 0], [1, 0], [0.5, 0.866], [0, 0]];

mount(Elicit({
  width: 440, height: 400,
  margins: { top: 24, right: 16, bottom: 24, left: 16 },
  data: [{ x: 0.5, y: 0.289 }],                                  // one third each
  schema: {
    x: { type: 'quantitative', domain: [-0.1, 1.1] },
    y: { type: 'quantitative', domain: [-0.08, 0.95] },
  },
  axes: false,
  constraints: [
    constraints.custom(({ data }) => data.map((d) => {           //! stay inside the triangle
      const y = Math.min(0.866, Math.max(0, d.y));
      const half = (y / 0.866) / 2;
      return { x: Math.min(1 - half, Math.max(half, d.x)), y };
    })),
  ],
  guides: [
    guides.custom(({ scales, data }) => {
      const P = ([x, y]) => [scales.x.encode(x), scales.y.encode(y)];
      const s = shares(data[0]);
      const pct = d3.format('.0%');
      return [
        { background: true, type: 'path', fill: '#f1f5f9', stroke: '#64748b', points: outline.map(P) },
        ...[[[-0.03, -0.05], 'High', s.high], [[1.03, -0.05], 'Low', s.low], [[0.5, 0.9], 'Medium', s.medium]]
          .map(([p, name, v]) => ({ type: 'text', x: P(p)[0], y: P(p)[1], textAnchor: 'middle', //! the derived shares
            fontSize: 13, fill: '#0f172a', text: name + ' ' + pct(v) })),
      ];
    }),
  ],
  marks: [
    point({
      size: 9, fill: '#43c1ce', stroke: '#000', strokeWidth: 1.5,
      channels: { x: { field: 'x' }, y: { field: 'y' } },
      edits: [move({ channels: ['x', 'y'] })],                    //! one drag, three shares
    }),
  ],
}));`,
    },
  ],
});
