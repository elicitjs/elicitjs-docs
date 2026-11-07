// Observable Plot gallery — "Area, Line", first half. See AUTHORING.md.

GALLERY.add({
  id: 'plot-simple-line-chart',
  status: 'full',
  verdict: 'A `lineY` over the Apple closes on a temporal x axis with a y grid.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative' },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: { y: { grid: true } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep the next year',
      question: 'Apple closed at $153 at the end of May 2017. Where did it close each month over the following year?',
      try: 'Sweep across the unshaded part to paint the line, then press Reveal. You can keep revising after the reveal.',
      why: '`lock` fixes the four years of history, so `edit.line.sweep()` can only paint the twelve free months. The reveal is a `guides.custom` gated on the stage: it reads chart state and writes no data, so the answer key never enters `getData()`.',
      uses: ['edit.line.sweep()', 'lock', 'guides.region()', 'guides.custom()', 'nextStage()'],
      code: `const aapl = await plotData('aapl');
// The last close of each month.
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([m, rows]) => ({ Date: new Date(m), Close: rows.at(-1).Close }));
const cut = new Date(Date.UTC(2017, 4, 1));
const history = monthly.filter((d) => d.Date <= cut);
const truth = monthly.filter((d) => d.Date >= cut);
const future = truth.slice(1).map((d) => ({ Date: d.Date, Close: history.at(-1).Close }));

const chart = mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 250] },
  },
  data: [...history, ...future],
  lock: (d) => d.Date <= cut,                       //! history is given, not elicited
  axes: { y: { grid: true } },
  guides: [
    guides.region({ x: [history[0].Date, cut], fill: '#94a3b8', opacity: 0.15 }),
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [{   //! the answer, shown once revealed
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2,
      points: truth.map((d) => [scales.x.encode(d.Date), scales.y.encode(d.Close)]),
    }]),
  ],
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 3,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: edit.line.sweep() },   //! paint by sweeping
      },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
    {
      title: 'Draw it from memory',
      question: 'Without looking, sketch how Apple’s share price moved from mid-2013 to mid-2018.',
      try: 'Press and drag across the chart to draw. Draw again to replace it.',
      why: '`edit.line.draw()` turns a freehand stroke into rows: it samples the stroke at each month in `samples`, so the answer is one close per month whatever your hand speed. The dataset starts empty; the schema alone sizes the axes.',
      uses: ['edit.line.draw()', 'samples'],
      code: `mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    s:     { type: 'categorical' },
    Date:  { type: 'temporal', domain: [new Date('2013-05-01'), new Date('2018-05-01')] },
    Close: { type: 'quantitative', domain: [0, 250] },
  },
  data: [],                                          //! nothing seeded: you draw it all
  axes: { y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 2.5, curve: 'monotoneX',
      channels: { series: { field: 's' }, x: { field: 'Date' }, y: { field: 'Close' } },
      edits: [edit.line.draw({                       //! a stroke becomes rows
        series: 's',
        samples: d3.utcMonths(new Date('2013-05-01'), new Date('2018-05-02')),  //! one row per month
      })],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-multiple-line-chart',
  status: 'full',
  verdict: 'One `lineY` grouped by the `series` channel draws a line per metro division; a `guides.rule` stands in for `ruleY([0])`.',
  needs: [],
  prep: [],
  gaps: [
    'The zero rule is a guide rather than a mark: a `rule` mark over the dataset would draw one rule per row.',
    'The y title runs along the axis rather than sitting flat above it with Plot’s ↑ arrow.',
  ],
  recreation: {
    code: `const bls = await plotData('observablehq__plot-multiple-line-chart', 'bls-metro-unemployment.csv');
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 48 },
  schema: {
    division:     { type: 'categorical' },
    date:         { type: 'temporal' },
    unemployment: { type: 'quantitative', domain: [0, 18] },
  },
  data: bls,
  axes: { y: { grid: true, title: 'Unemployment (%)' } },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: {
        series: { field: 'division' },
        x: { field: 'date' }, y: { field: 'unemployment' },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep each metro',
      question: 'After 2007, how did unemployment move in each of these four metro divisions through 2013?',
      try: 'Sweep over the right half. The sweep paints whichever line is nearest, so trace each one in turn.',
      why: 'The `series` channel groups rows into lines, so `edit.line.sweep()` paints only the nearest line. `lock` keeps 2000–2007 fixed; the seeded 2008–2013 rows start flat at each metro’s 2007 level.',
      uses: ['edit.line.sweep()', 'series', 'lock'],
      code: `const bls = await plotData('observablehq__plot-multiple-line-chart', 'bls-metro-unemployment.csv');
const keep = ['Detroit-Livonia-Dearborn, MI Met Div', 'Miami-Miami Beach-Kendall, FL Met Div',
  'Dallas-Plano-Irving, TX Met Div', 'Bethesda-Rockville-Frederick, MD Met Div'];
// Yearly means for four divisions, named by their first city.
const yearly = d3.flatRollup(bls.filter((d) => keep.includes(d.division)),
  (v) => d3.mean(v, (d) => d.unemployment),
  (d) => d.division.split(/[-,]/)[0], (d) => d.date.getUTCFullYear())
  .map(([metro, year, rate]) => ({ metro, year, rate: +rate.toFixed(1) }));
const seed = yearly.filter((d) => d.year <= 2007);
const future = seed.filter((d) => d.year === 2007)
  .flatMap((d) => d3.range(2008, 2014).map((year) => ({ ...d, year })));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 34 },
  schema: {
    metro: { type: 'categorical' },
    year:  { type: 'quantitative', domain: [2000, 2013] },
    rate:  { type: 'quantitative', domain: [0, 18] },
  },
  data: [...seed, ...future],
  lock: (d) => d.year <= 2007,                       //! the record up to 2007
  axes: { x: { tickFormat: 'd' }, y: { grid: true } },
  guides: [guides.region({ x: [2000, 2007], fill: '#94a3b8', opacity: 0.15 })],
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 3,
      channels: {
        series: { field: 'metro' },                  //! one line per metro
        stroke: { field: 'metro', legend: { anchor: 'right' } },
        x: { field: 'year' },
        y: { field: 'rate', edit: edit.line.sweep() },   //! paints the nearest line only
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-labeled-multi-line-chart',
  status: 'full',
  verdict: 'Four `lineY` series coloured by symbol, with a `text` mark that labels only each series’ last row.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `selectLast` transform becomes a `{ fn }` text channel that returns the symbol on the last date and an empty string elsewhere, so the text mark still emits one (empty) node per row.',
    'The zero rule is a `guides.rule`.',
  ],
  recreation: {
    code: `const files = [['AAPL', 'aapl.csv'], ['AMZN', 'amzn.csv'], ['GOOG', 'goog.csv'], ['IBM', 'ibm.csv']];
const stocks = (await Promise.all(files.map(async ([Symbol, file]) =>
  (await plotData('observablehq__plot-labeled-multi-line-chart', file))
    .map((d) => ({ Symbol, Date: d.Date, Close: d.Close }))))).flat();
const lastDate = +d3.max(stocks, (d) => d.Date);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 40, bottom: 28, left: 40 },
  schema: {
    Symbol: { type: 'categorical' },
    Date:   { type: 'temporal' },
    Close:  { type: 'quantitative', domain: [0, 1700] },
  },
  data: stocks,
  axes: { y: { grid: true } },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({
      strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' }, stroke: { field: 'Symbol' } },
    }),
    text({
      textAnchor: 'start', dx: 3, fontSize: 10, fill: 'currentColor',
      channels: {
        x: { field: 'Date' }, y: { field: 'Close' },
        text: { fn: (d) => +d.Date === lastDate ? d.Symbol : '' },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag the year-end price',
      question: 'Where will each of these four stocks close at the end of 2018?',
      try: 'Drag the dot at the end of each line up or down. The label rides along.',
      why: 'Only the four year-end rows are free: `lock` fixes the monthly history, so the history handles are not grabbable. `move()` on `y` writes the close; the label is a second mark over the same rows, so it re-derives on every commit.',
      uses: ['move()', 'lock', 'clamp()', 'text'],
      code: `const files = [['AAPL', 'aapl.csv'], ['AMZN', 'amzn.csv'], ['GOOG', 'goog.csv'], ['IBM', 'ibm.csv']];
const stocks = (await Promise.all(files.map(async ([Symbol, file]) =>
  (await plotData('observablehq__plot-labeled-multi-line-chart', file))
    .map((d) => ({ Symbol, Date: d.Date, Close: d.Close }))))).flat();
// Month-end closes, plus one free row per stock at the end of 2018.
const monthly = d3.flatGroup(stocks, (d) => d.Symbol, (d) => +d3.utcMonth(d.Date))
  .map(([Symbol, m, rows]) => ({ Symbol, Date: new Date(m), Close: rows.at(-1).Close }));
const end = new Date(Date.UTC(2018, 11, 1));
const guesses = d3.groups(monthly, (d) => d.Symbol)
  .map(([Symbol, rows]) => ({ Symbol, Date: end, Close: rows.at(-1).Close }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 44, bottom: 28, left: 40 },
  schema: {
    Symbol: { type: 'categorical' },
    Date:   { type: 'temporal' },
    Close:  { type: 'quantitative', domain: [0, 2500] },
  },
  data: [...monthly, ...guesses],
  lock: (d) => d.Date < end,                          //! only the year-end rows are free
  constraints: [clamp({ min: 0 })],                   //! a price cannot go below zero
  axes: { y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 1.5, handleSize: 1.5,
      channels: {
        x: { field: 'Date' }, stroke: { field: 'Symbol' },
        y: { field: 'Close', edit: move() },          //! drag a free dot to set its close
      },
    }),
    text({
      textAnchor: 'start', dx: 7, fontSize: 10, fill: 'currentColor',
      channels: {
        x: { field: 'Date' }, y: { field: 'Close' },
        text: { fn: (d) => +d.Date === +end ? d.Symbol : '' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-index-chart',
  status: 'partial',
  verdict: 'The four stocks normalised to a basis day on a log y axis, with end labels; the scrubber that moves the basis day is missing.',
  needs: ['input-widgets', 'text-layout'],
  prep: ['prep-calculate'],
  gaps: [
    'The original’s `Scrubber` input re-normalises the lines as the basis date moves. Here the basis is fixed at the scrubber’s initial position (the 500th trading day).',
    'Plot’s `normalizeY` transform is computed in plain JavaScript.',
  ],
  recreation: {
    code: `const files = [['AAPL', 'aapl.csv'], ['AMZN', 'amzn.csv'], ['GOOG', 'goog.csv'], ['IBM', 'ibm.csv']];
const stocks = (await Promise.all(files.map(async ([Symbol, file]) =>
  (await plotData('observablehq__plot-index-chart', file))
    .map((d) => ({ Symbol, Date: d.Date, Close: d.Close }))))).flat();
// Normalise each stock to its close on the 500th trading day.
const days = d3.sort(d3.union(stocks.map((d) => +d.Date)));
const basisDay = days[500];
const basis = new Map(stocks.filter((d) => +d.Date === basisDay).map((d) => [d.Symbol, d.Close]));
const data = stocks.map((d) => ({ Symbol: d.Symbol, Date: d.Date, ratio: d.Close / basis.get(d.Symbol) }));
const lastDay = days.at(-1);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 40, bottom: 28, left: 52 },
  schema: {
    Symbol: { type: 'categorical' },
    Date:   { type: 'temporal' },
    ratio:  { type: 'quantitative' },
  },
  data,
  axes: { y: { grid: true, title: 'Change in price (%)', tickValues: [0.5, 0.7, 1, 1.5, 2, 3, 4, 6],
               tickFormat: (v) => d3.format('+d')((v - 1) * 100) } },
  guides: [
    guides.rule({ y: 1, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' }),
    guides.rule({ x: new Date(basisDay), stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' }),
  ],
  marks: [
    lineY({
      strokeWidth: 1.5,
      channels: {
        x: { field: 'Date' }, stroke: { field: 'Symbol' },
        y: { field: 'ratio', scale: 'log' },
      },
    }),
    text({
      textAnchor: 'start', dx: 3, fontSize: 10, fill: 'currentColor',
      channels: {
        x: { field: 'Date' }, y: { field: 'ratio', scale: 'log' },
        text: { fn: (d) => +d.Date === lastDay ? d.Symbol : '' },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Add a benchmark line',
      question: 'Indexed to May 2013, how did an S&P 500 index fund do over the same five years?',
      try: 'Double-click the chart to start your line, then sweep along it to shape it.',
      why: '`edit.line.newSeries()` mints a whole series on a double-click: a new key in the `series` column and one row per month in `samples`. `lock: "seed"` freezes the four stocks but not rows an edit adds, so `edit.line.sweep()` can only paint yours. The y channel is on a log scale, and both edits invert through it.',
      uses: ['edit.line.newSeries()', 'edit.line.sweep()', 'lock', "scale: 'log'"],
      code: `const files = [['AAPL', 'aapl.csv'], ['AMZN', 'amzn.csv'], ['GOOG', 'goog.csv'], ['IBM', 'ibm.csv']];
const stocks = (await Promise.all(files.map(async ([Symbol, file]) =>
  (await plotData('observablehq__plot-index-chart', file))
    .map((d) => ({ Symbol, Date: d.Date, Close: d.Close }))))).flat();
// Month-end closes, indexed to the first month.
const monthly = d3.flatGroup(stocks, (d) => d.Symbol, (d) => +d3.utcMonth(d.Date))
  .map(([Symbol, m, rows]) => ({ Symbol, Date: new Date(m), Close: rows.at(-1).Close }));
const first = new Map(monthly.filter((d, i, a) => a.findIndex((e) => e.Symbol === d.Symbol) === i)
  .map((d) => [d.Symbol, d.Close]));
const indexed = monthly.map((d) => ({ Symbol: d.Symbol, Date: d.Date, ratio: d.Close / first.get(d.Symbol) }));
const months = d3.sort(d3.union(indexed.map((d) => +d.Date))).map((t) => new Date(t));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 44, bottom: 28, left: 40 },
  schema: {
    Symbol: { type: 'categorical' },
    Date:   { type: 'temporal' },
    ratio:  { type: 'quantitative', domain: [0.5, 6] },
  },
  data: indexed,
  lock: 'seed',                                       //! the four stocks are given
  axes: { y: { grid: true, tickValues: [0.5, 0.7, 1, 1.5, 2, 3, 4, 6],
               tickFormat: (v) => d3.format('+d')((v - 1) * 100) } },
  guides: [guides.rule({ y: 1, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({
      strokeWidth: 1.5, handleSize: 2,
      channels: {
        x: { field: 'Date' },
        y: { field: 'ratio', scale: 'log', edit: edit.line.sweep() },   //! sweep shapes your line
        series: { field: 'Symbol' },
        stroke: { field: 'Symbol' },
      },
      edits: [edit.line.newSeries({ series: 'Symbol', samples: months })],  //! double-click mints a series
    }),
    text({
      textAnchor: 'start', dx: 5, fontSize: 10, fill: 'currentColor',
      channels: {
        x: { field: 'Date' }, y: { field: 'ratio', scale: 'log' },
        // A minted series key is not one of the four symbols: label it as yours.
        text: { fn: (d) => +d.Date !== +months.at(-1) ? '' : files.some(([s]) => s === d.Symbol) ? d.Symbol : 'yours' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-gradient-encoding',
  status: 'partial',
  verdict: 'The step line is rebuilt from two `rule` marks per day, each coloured by temperature on the `turbo` scheme; within a segment the colour is flat, because a line stroke takes no gradient.',
  needs: ['variable-paint-line'],
  prep: ['prep-calculate'],
  gaps: [
    'Plot strokes one path with an SVG `linearGradient`. `gradient` paints only an area, bar or rect fill, not a line stroke, so every day here is a vertical riser and a horizontal tread, each a flat colour, and a riser that crosses several temperatures shows only its destination colour.',
    'The colour field is clamped to [45, 75] °F in JavaScript, because the colour domain is the schema’s domain and the data runs outside it.',
  ],
  recreation: {
    code: `const sftemp = await plotData('observablehq__plot-gradient-encoding', 'sf-temperatures.csv');
// One row per step of a step-before line: a riser at the previous date, then a tread.
const steps = sftemp.slice(1).map((d, i) => ({
  from: sftemp[i].date, to: d.date, prev: sftemp[i].high, high: d.high,
  heat: Math.max(45, Math.min(75, d.high)),
}));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    from: { type: 'temporal' }, to: { type: 'temporal' },
    prev: { type: 'quantitative' }, high: { type: 'quantitative' },
    heat: { type: 'quantitative', domain: [45, 75] },
  },
  data: steps,
  marks: [
    rule({
      strokeWidth: 1,
      channels: { x: { field: 'from' }, y1: { field: 'prev' }, y2: { field: 'high' },
        stroke: { field: 'heat', scale: { scheme: 'turbo' },
                  legend: { anchor: 'top', title: 'temperature (°F)' } } },
    }),
    rule({
      strokeWidth: 1,
      channels: { x1: { field: 'from' }, x2: { field: 'to' }, y: { field: 'high' },
        stroke: { field: 'heat', scale: { scheme: 'turbo' } } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Colour follows value',
      question: 'What is the typical daily high in San Francisco in each month of the year?',
      try: 'Drag each dot up or down. It snaps to whole degrees and recolours as it moves.',
      why: 'Two marks view the same twelve rows: an inert `lineY` and a `point` whose `fill` encodes the very field its `move()` writes, so the colour is a live readout of your answer. `snap` repairs every proposal to a whole degree.',
      uses: ['move()', 'snap()', 'clamp()', 'fill scale'],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 40, right: 16, bottom: 28, left: 36 },
  schema: {
    month: { type: 'ordinal', domain: months },
    high:  { type: 'quantitative', domain: [45, 75] },
  },
  data: months.map((month) => ({ month, high: 60 })),
  constraints: [snap({ step: 1 }), clamp()],          //! whole degrees, inside the domain
  axes: { y: { grid: true } },
  marks: [
    lineY({
      stroke: '#94a3b8', curve: 'stepBefore',
      channels: { x: { field: 'month' }, y: { field: 'high' } },
    }),
    point({
      size: 8, stroke: 'white', strokeWidth: 1,
      channels: {
        x: { field: 'month' },
        y: { field: 'high', edit: move() },           //! drag sets the high
        fill: { field: 'high', scale: { scheme: 'turbo' },   //! the colour reads the same column
                legend: { anchor: 'top', title: 'temperature (°F)' } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-area-chart',
  status: 'full',
  verdict: 'An `areaY` of the Apple closes, filled down to a zero baseline.',
  needs: [],
  prep: [],
  gaps: ['The zero baseline comes from declaring the y domain as [0, 200]; the area fills down to the scale’s baseline.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  marks: [
    areaY({
      fill: 'currentColor', fillOpacity: 1, stroke: 'none',
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Pull the nearest month',
      question: 'Apple’s trading volume to the end of 2015 is shown. How many shares a day changed hands in each month after that?',
      try: 'Press anywhere in the clear part and drag: the nearest month follows the pointer. The ring shows how far the pick reaches.',
      why: '`move({ pick: "nearest" })` needs no handle under the pointer: it grabs the closest free row within `threshold` pixels, so a thin area is easy to reshape. `guide: true` draws that catchment around the pointer, and `lock` keeps 2013–2015 out of reach.',
      uses: ["move({ pick: 'nearest' })", 'guide', 'lock', 'clamp()'],
      code: `const aapl = await plotData('aapl');
// Average shares traded per day, by month, in millions.
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([m, rows]) => ({ Date: new Date(m), Volume: +(d3.mean(rows, (d) => d.Volume) / 1e6).toFixed(1) }));
const cut = new Date(Date.UTC(2015, 11, 1));
const level = monthly.find((d) => +d.Date === +cut).Volume;
const data = monthly.map((d) => d.Date <= cut ? d : { ...d, Volume: level });

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:   { type: 'temporal' },
    Volume: { type: 'quantitative', domain: [0, 160] },
  },
  data,
  lock: (d) => d.Date <= cut,                         //! 2013–2015 is given
  constraints: [clamp({ min: 0 })],
  axes: { y: { grid: true } },
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.5, stroke: 'steelblue', handleSize: 2.5,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Volume', edit: move({ pick: 'nearest', threshold: 30, guide: true }) },   //! grab the closest month; \`guide\` draws its reach
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep a volume band',
      question: 'How many shares a day will change hands in each month of 2016? Give a range you are 80% sure of.',
      try: 'Press on the top edge and sweep along it to raise or lower it, then do the same on the bottom edge. Start each stroke on the edge you mean.',
      why: 'The area spans `y1: lo` to `y2: hi`, and each edge carries its own `edit.line.sweep()`: the edge you press on is the one that paints, so the two edges are set independently in a stroke each. History rows have `lo = hi`, so the band grows out of the record, and `ordering` keeps the low edge under the high one.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'lock'],
      code: `const aapl = await plotData('aapl');
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([m, rows]) => ({ Date: new Date(m), Volume: +(d3.mean(rows, (d) => d.Volume) / 1e6).toFixed(1) }))
  .filter((d) => d.Date < new Date('2017-01-01'));
const cut = new Date(Date.UTC(2015, 11, 1));
const level = monthly.find((d) => +d.Date === +cut).Volume;
// History is a zero-width band; 2016 starts as a band around the last month.
const data = monthly.map((d) => d.Date <= cut
  ? { Date: d.Date, lo: d.Volume, hi: d.Volume }
  : { Date: d.Date, lo: Math.round(level * 0.7), hi: Math.round(level * 1.3) });

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 54 },
  schema: {
    Date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [0, 160] },
    hi:   { type: 'quantitative', domain: [0, 160] },
  },
  data,
  lock: (d) => d.Date <= cut,                         //! 2013–2015 is given
  constraints: [ordering({ field: ['lo', 'hi'] }), clamp({ field: ['lo', 'hi'], min: 0 })],   //! low edge under high edge
  axes: { y: { grid: true, title: 'Shares a day (millions)' } },
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.5, stroke: 'steelblue', handleSize: 2,
      channels: {
        x:  { field: 'Date' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the bottom edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the top edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-area-chart-with-gradient',
  status: 'full',
  verdict: 'An `areaY` under a `lineY` of the Apple closes, filled with a vertical `gradient` from translucent steelblue to transparent brown, with a zero rule.',
  needs: [],
  prep: [],
  gaps: ['The gradient spans the area’s own box, so it runs from the highest close down to zero rather than over the whole plot as Plot’s `gradientTransform` does; the stops are the same.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: { y: { grid: true } },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    areaY({
      stroke: 'none',
      // Offset 0 is the bottom of the area, 1 the top: Plot's stops, flipped.
      gradient: { stops: [[0, 'rgba(165, 42, 42, 0)'], [0.8, 'rgba(70, 130, 180, 0.5)']], direction: 'vertical' },
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    lineY({
      stroke: 'steelblue', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Click in the turns',
      question: 'Apple closed near $65 in May 2013 and near $188 in May 2018. Where were the big peaks and troughs in between?',
      try: 'Click to add a point where the price turned; drag a point to adjust it; Alt-click a point to delete it.',
      why: 'Only the two ends are seeded. `edit.line.anchor()` adds a row where you click, and the line reconnects in date order, so you choose how many turns the story needs. `create` and `remove` stay symmetric: `remove()` behind `when.alt` takes a point back out.',
      uses: ['edit.line.anchor()', 'move()', 'remove()', 'when.alt', 'lock'],
      code: `mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal', domain: [new Date('2013-05-13'), new Date('2018-05-11')] },
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: [
    { Date: new Date('2013-05-13'), Close: 65 },
    { Date: new Date('2018-05-11'), Close: 188 },
  ],
  lock: 'seed',                                       //! the two ends are given
  axes: { y: { grid: true } },
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.25, stroke: 'none',
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    lineY({
      stroke: 'steelblue', strokeWidth: 2, handleSize: 5,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: move({ channels: ['x', 'y'] }) },
      },
      edits: [
        edit.line.anchor({ into: 'nearest', when: when.noAlt }),   //! click adds a turning point
        remove({ when: when.alt }),                                  //! Alt-click deletes one
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the fade',
      question: 'Apple closed at $188 in May 2018. Over the next twelve months, between what prices do you expect each month’s close to fall?',
      try: 'Press on the top edge of the band and sweep along it, then do the same on the bottom edge.',
      why: 'Each edge of the `areaY` span carries its own `edit.line.sweep()`, so the high and low ends are two independent strokes. The `gradient` fades towards the low edge, so a wide band reads as uncertain at a glance. `ordering` pushes the other edge along rather than letting the band invert.',
      uses: ['edit.line.sweep()', 'gradient', 'ordering()', 'lock'],
      code: `const aapl = await plotData('aapl');
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([m, rows]) => ({ Date: new Date(m), Close: Math.round(rows.at(-1).Close) }))
  .filter((d) => d.Date >= new Date('2016-05-01'));
const last = monthly.at(-1);
const future = d3.utcMonths(d3.utcMonth.offset(last.Date, 1), d3.utcMonth.offset(last.Date, 13))
  .map((Date) => ({ Date, lo: last.Close - 15, hi: last.Close + 15 }));

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [0, 300] },
    hi:   { type: 'quantitative', domain: [0, 300] },
  },
  data: [...monthly.map((d) => ({ Date: d.Date, lo: d.Close, hi: d.Close })), ...future],
  lock: (d) => d.Date <= last.Date,                     //! two years of closes are given
  constraints: [ordering({ field: ['lo', 'hi'] })],     //! the band never turns inside out
  axes: { y: { grid: true } },
  marks: [
    areaY({
      stroke: 'steelblue', handleSize: 2.5,
      gradient: { stops: [[0, 'rgba(165, 42, 42, 0.05)'], [1, 'rgba(70, 130, 180, 0.7)']], direction: 'vertical' },   //! fades towards the low edge
      channels: {
        x:  { field: 'Date' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! paint the low edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! paint the high edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-difference-chart',
  status: 'full',
  verdict: 'The difference between New York and San Francisco highs is an `areaY` band between the two series, split into runs by which city is warmer and coloured by that sign.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Plot’s `differenceY` mark clips one area against the other. Here the runs are split in JavaScript, and each run is extended by one step so the `stepAfter` curve closes against the next run.',
    'The tip needs a row under the pointer, and an area path is one node per run, so an invisible `rect` per day carries it; Plot’s tip snaps to the nearest day anywhere in the plot, this one only over the band.',
    'The four city labels are drawn by a `guides.custom` at the hottest and coldest New York days rather than by `selectMaxY`/`selectMinY` text marks.',
  ],
  recreation: {
    code: `const raw = await plotData('observablehq__plot-difference-chart', 'weather.tsv');
const days = raw.map((d) => ({ date: d3.utcParse('%Y%m%d')(String(d.date)), ny: d['New York'], sf: d['San Francisco'] }));
// Runs of days on which the same city is warmer. Each run is extended to the
// next day so the step-after curve meets the following run.
const sideOf = (d) => d.sf > d.ny ? 'NY' : 'SF';
const rows = [];
let run = 0;
days.forEach((d, i) => {
  const next = days[i + 1];
  // \`until\` closes the day's hover strip; the run extension gets none.
  const row = { run, side: sideOf(d), date: d.date, until: next ? next.date : d.date,
    ny: d.ny, sf: d.sf, lo: Math.min(d.ny, d.sf), hi: Math.max(d.ny, d.sf) };
  rows.push(row);
  if (next && sideOf(next) !== row.side) { rows.push({ ...row, date: next.date, until: next.date }); run++; }
});
const hot = d3.greatest(days, (d) => d.ny), cold = d3.least(days, (d) => d.ny);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 48 },
  schema: {
    run:  { type: 'categorical' },
    side: { type: 'categorical', domain: ['NY', 'SF'] },
    date: { type: 'temporal' }, until: { type: 'temporal' },
    ny:   { type: 'quantitative' },
    sf:   { type: 'quantitative' },
    lo:   { type: 'quantitative' },
    hi:   { type: 'quantitative' },
  },
  data: rows,
  axes: { y: { grid: true, title: 'temperature (°F)' } },
  guides: [
    guides.custom(({ scales }) => [
      [hot, 'ny', 'New York', -6], [hot, 'sf', 'San Francisco', 13],
      [cold, 'ny', 'New York', -10], [cold, 'sf', 'San Francisco', -40],
    ].map(([d, k, label, dy]) => ({
      type: 'text', text: label, fontSize: 10, fill: 'currentColor', textAnchor: 'middle',
      x: scales.x.encode(d.date), y: scales.y.encode(d[k]) + dy,
    }))),
  ],
  marks: [
    areaY({
      curve: 'stepAfter', stroke: 'none', fillOpacity: 1,
      channels: {
        series: { field: 'run' },
        x: { field: 'date' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'side', scale: { range: ['#fc8d59', '#91bfdb'] } },
      },
    }),
    lineY({
      curve: 'stepAfter', stroke: 'currentColor', strokeWidth: 1,
      channels: { series: { field: 'run' }, x: { field: 'date' }, y: { field: 'sf' } },
    }),
    // An area path is one node per run, so the tip reads an invisible strip per day.
    rect({
      opacity: 0,
      tip: { text: (d) => [d3.utcFormat('%b %-d, %Y')(d.date), \`New York: \${d.ny} °F\`, \`San Francisco: \${d.sf} °F\`] },   //! hover a day for both highs
      channels: { x1: { field: 'date' }, x2: { field: 'until' }, y1: { field: 'lo' }, y2: { field: 'hi' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag one city',
      question: 'San Francisco’s average high is shown for each month from October 2011. What was New York’s?',
      try: 'Drag the orange dots. The shaded gap between the cities updates as you go.',
      why: 'Three marks view the same twelve rows: a `lineY` on `sf` with no edit, a `lineY` on `ny` with `move()`, and an `areaY` spanning `y1: sf` to `y2: ny`. Only the `ny` column can be written, and the band re-derives from it on every commit.',
      uses: ['move()', 'areaY span (y1/y2)', 'clamp()'],
      code: `const raw = await plotData('observablehq__plot-difference-chart', 'weather.tsv');
const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
// Monthly mean SF highs; New York starts equal to San Francisco.
const sf = d3.rollup(raw, (v) => d3.mean(v, (d) => d['San Francisco']), (d) => months[(+String(d.date).slice(4, 6) + 2) % 12]);
// x is the month's index: an area sorts its points by the raw x value, so month names would sort alphabetically.
const data = months.map((month, m) => ({ m, sf: +sf.get(month).toFixed(1), ny: +sf.get(month).toFixed(1) }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    m:     { type: 'quantitative', domain: [0, 11] },
    sf:    { type: 'quantitative', domain: [20, 100] },
    ny:    { type: 'quantitative', domain: [20, 100] },
  },
  data,
  constraints: [clamp({ field: 'ny' })],
  axes: { x: { tickValues: d3.range(12), tickFormat: (m) => months[m] }, y: { grid: true } },
  marks: [
    areaY({
      fill: '#94a3b8', fillOpacity: 0.35, stroke: 'none',
      channels: { x: { field: 'm' }, y1: { field: 'sf' }, y2: { field: 'ny' } },   //! the gap is a span
    }),
    lineY({
      stroke: '#f46d43', strokeWidth: 2, handleSize: 6,
      channels: { x: { field: 'm' }, y: { field: 'ny', edit: move() } },   //! only New York is editable
    }),
    // Drawn last but inert, so it stays visible without blocking the New York handles.
    lineY({
      stroke: '#4575b4', strokeWidth: 2, handleSize: 2.5,
      channels: { x: { field: 'm' }, y: { field: 'sf' } },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep both cities',
      question: 'Sketch the average daily high in New York and in San Francisco for each month from October to September.',
      try: 'Press on the orange edge and sweep along it to shape New York, then on the blue edge for San Francisco.',
      why: 'The difference band is one `areaY` from `y1: sf` to `y2: ny`, and each edge carries its own `edit.line.sweep()`, so a stroke paints one city whichever is warmer. No `ordering` here: the cities may cross, and the band flips where they do. The two coloured lines are inert views of the same columns.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'clamp()'],
      code: `const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 48 },
  schema: {
    m:  { type: 'quantitative', domain: [0, 11] },
    sf: { type: 'quantitative', domain: [20, 100] },
    ny: { type: 'quantitative', domain: [20, 100] },
  },
  data: months.map((month, m) => ({ m, sf: 55, ny: 75 })),   //! two flat starting lines, apart
  constraints: [clamp({ field: ['sf', 'ny'] })],
  axes: { x: { tickValues: d3.range(12), tickFormat: (m) => months[m] }, y: { grid: true, title: 'Daily high (°F)' } },
  marks: [
    areaY({
      fill: '#94a3b8', fillOpacity: 0.35, stroke: '#64748b', strokeWidth: 0, handleSize: 3,
      channels: {
        x:  { field: 'm' },
        y1: { field: 'sf', edit: edit.line.sweep() },   //! San Francisco edge
        y2: { field: 'ny', edit: edit.line.sweep() },   //! New York edge
      },
    }),
    lineY({ stroke: '#f46d43', strokeWidth: 2, channels: { x: { field: 'm' }, y: { field: 'ny' } } }),
    lineY({ stroke: '#4575b4', strokeWidth: 2, channels: { x: { field: 'm' }, y: { field: 'sf' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-burndown-chart',
  status: 'full',
  verdict: 'Open issues per day, stacked by the week each issue was opened, as one `areaY` span per week on a step curve, coloured on a continuous date scale.',
  needs: [],
  prep: ['prep-bin', 'prep-stack'],
  gaps: [
    'Plot’s `binX` count and implicit stack are computed in JavaScript (a per-day count per opening week, then `d3.stack`); `areaY` has no stack of its own.',
    'No tooltip: `tip` reads the row under the pointer, and each week’s area is one path with no row of its own. A transparent hit `rect` per (week, day) would carry one, at tens of thousands of nodes.',
  ],
  recreation: {
    code: `const raw = await plotData('observablehq__plot-burndown-chart', 'framework-issues.json');
const end = new Date('2024-10-18');
const issues = raw.map((i) => ({
  week: d3.utcWeek(new Date(i.created_at)),
  days: d3.utcDays(new Date(i.created_at), i.closed_at ? new Date(i.closed_at) : end),
}));
// Open issues per (opening week, day), stacked with the oldest week at the bottom.
const counts = d3.rollup(issues.flatMap((i) => i.days.map((day) => ({ week: +i.week, day: +day }))),
  (v) => v.length, (d) => d.day, (d) => d.week);
const weeks = d3.sort(d3.union(issues.map((i) => +i.week)));
const allDays = d3.sort(counts.keys());
const stacked = d3.stack().keys(weeks).value(([, m], w) => m.get(w) || 0)(allDays.map((d) => [d, counts.get(d)]));
const rows = stacked.flatMap((layer) => layer
  .filter((p) => p.data[0] >= layer.key)          // a week has no issues before it starts
  .map((p) => ({
    // The series key is a string: Date objects are distinct keys, one per row.
    key: new Date(layer.key).toISOString().slice(0, 10),
    opened: new Date(layer.key), day: new Date(p.data[0]), y1: p[0], y2: p[1],
  })));

mount(Elicit({
  width: 460, height: 420,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    key:    { type: 'categorical' },
    opened: { type: 'temporal' },
    day:    { type: 'temporal' },
    y1:     { type: 'quantitative' },
    y2:     { type: 'quantitative' },
  },
  data: rows,
  marks: [
    areaY({
      curve: 'step', stroke: 'none', fillOpacity: 1,
      channels: {
        series: { field: 'key' },
        x: { field: 'day' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'opened', scale: { scheme: 'turbo' },
                legend: { anchor: 'top', title: 'Opened', ticks: 4, tickFormat: (t) => d3.utcFormat('%b')(new Date(t)) } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Burn down a cohort',
      question: '216 issues were opened in January 2024. How many of them were still open at the start of each month after that?',
      try: 'Drag the dots down. A later month can never sit above an earlier one, so dragging one up pushes the earlier months with it. Press Reveal to compare.',
      why: 'A cohort of issues can only close, so the count is non-increasing. `monotonic({ dir: "down" })` is a dataset invariant: it repairs every proposal, whichever dot you grab. `lock` pins the starting 216, and the reveal is a `guides.custom` gated on the stage.',
      uses: ['move()', "monotonic({ dir: 'down' })", 'snap()', 'lock', 'nextStage()'],
      code: `const raw = await plotData('observablehq__plot-burndown-chart', 'framework-issues.json');
const end = new Date('2024-10-18');
const cohort = raw
  .filter((i) => i.created_at >= '2024-01' && i.created_at < '2024-02')
  .map((i) => (i.closed_at ? new Date(i.closed_at) : end));
// Month 0 is the end of January; the answer key is the real count open at each month start.
const starts = d3.utcMonths(new Date('2024-02-01'), new Date('2024-10-02'));
const truth = [{ month: 0, open: cohort.length },
  ...starts.map((t, k) => ({ month: k + 1, open: cohort.filter((c) => c > t).length }))];

const chart = mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 32, left: 40 },
  schema: {
    month: { type: 'quantitative', domain: [0, 9] },
    open:  { type: 'quantitative', domain: [0, 230] },
  },
  data: truth.map((d) => ({ month: d.month, open: cohort.length })),
  lock: (d) => d.month === 0,                          //! all 216 open at the start
  constraints: [
    monotonic({ field: 'open', along: 'month', dir: 'down' }),   //! a cohort only burns down
    snap({ field: 'open', step: 1 }),                              //! whole issues
    clamp({ field: 'open', min: 0 }),
  ],
  axes: { x: { tickFormat: (m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][m] }, y: { grid: true } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [{
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2, curve: 'stepAfter',
      points: truth.map((d) => [scales.x.encode(d.month), scales.y.encode(d.open)]),
    }]),
  ],
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.25, stroke: 'none', curve: 'stepAfter',
      channels: { x: { field: 'month' }, y: { field: 'open' } },
    }),
    lineY({
      stroke: 'steelblue', strokeWidth: 2, curve: 'stepAfter', handleSize: 5,
      channels: { x: { field: 'month' }, y: { field: 'open', edit: move() } },
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
    {
      title: 'Sweep a burn-down band',
      question: 'Of the 216 issues opened in January 2024, how many were still open at the start of each later month? Give a range you are 80% sure of.',
      try: 'Press on the top edge of the band and sweep along it, then on the bottom edge. Neither edge can climb as the months go on.',
      why: 'The band is an `areaY` from `y1: lo` to `y2: hi`, and each edge carries its own `edit.line.sweep()`, so one stroke sets the optimistic edge and another the pessimistic one. Each edge is its own `monotonic` column, because both bounds of a cohort can only burn down, and `ordering` keeps them the right way up.',
      uses: ['edit.line.sweep()', "monotonic({ dir: 'down' })", 'ordering()', 'lock'],
      code: `mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 32, left: 48 },
  schema: {
    month: { type: 'quantitative', domain: [0, 9] },
    lo:    { type: 'quantitative', domain: [0, 230] },
    hi:    { type: 'quantitative', domain: [0, 230] },
  },
  data: d3.range(10).map((month) => month === 0
    ? { month, lo: 216, hi: 216 }
    : { month, lo: 120, hi: 200 }),
  lock: (d) => d.month === 0,                          //! all 216 open at the start
  constraints: [
    monotonic({ field: 'lo', along: 'month', dir: 'down' }),   //! each bound only burns down
    monotonic({ field: 'hi', along: 'month', dir: 'down' }),
    ordering({ field: ['lo', 'hi'] }),
  ],
  axes: { x: { tickFormat: (m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][m] },
          y: { grid: true, title: 'Issues still open' } },
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.3, stroke: 'steelblue', curve: 'stepAfter', handleSize: 4,
      channels: {
        x:  { field: 'month' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the optimistic edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the pessimistic edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-arealiney-custom-mark',
  status: 'full',
  verdict: 'Plot’s custom composite (rule + area + line) is a `composite` whose parts inherit its channels: one `areaY` and one `lineY` over the same rows, with the zero rule as a guide.',
  needs: [],
  prep: [],
  gaps: ['The rule is a `guides.rule`: a `rule` part inside the composite would draw one rule per row.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    // The composite's channels trickle down to every part.
    composite({
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
      parts: [
        areaY({ fill: 'steelblue', fillOpacity: 0.1, stroke: 'none' }),
        lineY({ stroke: 'steelblue', strokeWidth: 1.5 }),
      ],
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'One edit, two parts',
      question: 'Apple ended 2017 at $169. Where do you think it closed at the end of each quarter of 2018–2019?',
      try: 'Drag a dot on the line; the shaded area follows.',
      why: 'An edit declared on the `composite` attaches to its LAST part only, so the line carries the handles and the area stays inert. Both parts view the same rows, so the area re-derives after every drag. `lock` keeps 2016–2017 as given.',
      uses: ['composite()', 'move()', 'lock', 'clamp()'],
      code: `const aapl = await plotData('aapl');
// Quarter-end closes for 2016–2017, then eight free quarters at the last close.
const quarters = d3.groups(aapl.filter((d) => d.Date >= new Date('2016-01-01')), (d) => +d3.utcMonth.every(3).floor(d.Date))
  .map(([q, rows]) => ({ Date: new Date(q), Close: +rows.at(-1).Close.toFixed(2) }))
  .filter((d) => d.Date < new Date('2018-01-01'));
const last = quarters.at(-1).Close;
const future = d3.utcMonth.every(3).range(new Date('2018-01-01'), new Date('2020-01-01'))
  .map((Date) => ({ Date, Close: last }));

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 300] },
  },
  data: [...quarters, ...future],
  lock: (d) => d.Date < new Date('2018-01-01'),        //! 2016–2017 is given
  constraints: [clamp({ min: 0 })],
  axes: { y: { grid: true } },
  marks: [
    composite({
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: move() },             //! attaches to the last part: the line
      },
      parts: [
        areaY({ fill: 'steelblue', fillOpacity: 0.15, stroke: 'none' }),
        // \`handles: true\`: the part's own channels are empty when it is built, so it cannot see the inherited edit.
        lineY({ stroke: 'steelblue', strokeWidth: 2, handles: true, handleSize: 5 }),
      ],
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the band, line on top',
      question: 'Apple ended 2017 at $169. For each quarter of 2018–2019, between what closes are you 80% sure it will end?',
      try: 'Press on the line and sweep along it to set the high end, then on the bottom of the shading for the low end.',
      why: 'The same composite, with its `areaY` part spanning `y1: lo` to `y2: hi` and an `edit.line.sweep()` on each edge; the `lineY` part traces the high edge, as Plot’s custom mark traces the area’s top. Only `x` trickles down from the composite, so each part names its own value columns.',
      uses: ['composite()', 'edit.line.sweep()', 'ordering()', 'lock'],
      code: `const aapl = await plotData('aapl');
const quarters = d3.groups(aapl.filter((d) => d.Date >= new Date('2016-01-01')), (d) => +d3.utcMonth.every(3).floor(d.Date))
  .map(([q, rows]) => ({ Date: new Date(q), Close: Math.round(rows.at(-1).Close) }))
  .filter((d) => d.Date < new Date('2018-01-01'));
const last = quarters.at(-1).Close;
const future = d3.utcMonth.every(3).range(new Date('2018-01-01'), new Date('2020-01-01'))
  .map((Date) => ({ Date, lo: last - 20, hi: last + 20 }));

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [0, 300] },
    hi:   { type: 'quantitative', domain: [0, 300] },
  },
  data: [...quarters.map((d) => ({ Date: d.Date, lo: d.Close, hi: d.Close })), ...future],
  lock: (d) => d.Date < new Date('2018-01-01'),        //! 2016–2017 is given
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { y: { grid: true } },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    composite({
      channels: { x: { field: 'Date' } },
      parts: [
        areaY({
          fill: 'steelblue', fillOpacity: 0.15, stroke: 'steelblue', strokeWidth: 0, handleSize: 4,
          channels: {
            y1: { field: 'lo', edit: edit.line.sweep() },   //! the low edge
            y2: { field: 'hi', edit: edit.line.sweep() },   //! the high edge
          },
        }),
        lineY({ stroke: 'steelblue', strokeWidth: 2, channels: { y: { field: 'hi' } } }),   //! the line rides the high edge
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-faceted-areas',
  status: 'partial',
  verdict: 'Fourteen `areaY` series stacked into rows by an offset computed in JavaScript, each labelled at its first point. Faceting is not covered by this study, so the panels are a layout trick on one y scale.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'Faceting is not covered by this study: each industry’s area is lifted by a per-row offset (`y1: base`, `y2: base + unemployed`) on one shared y scale, so the panels cannot have their own axes and an edit would write the offset values.',
    'Panel frames are drawn by a `guides.custom`.',
  ],
  recreation: {
    code: `const industries = await plotData('industries');
const names = [...new Set(industries.map((d) => d.industry))].sort();
const M = d3.max(industries, (d) => d.unemployed);
const frame = M * 1.1;                        // one panel's height in data units
const panel = M * 1.25;                       // …plus the gap to the next one
const baseOf = (name) => (names.length - 1 - names.indexOf(name)) * panel;
const first = new Set(names.map((n) => industries.find((d) => d.industry === n)));
const rows = industries.map((d) => ({
  industry: d.industry, date: d.date,
  base: baseOf(d.industry), top: baseOf(d.industry) + d.unemployed,
  ceil: baseOf(d.industry) + frame, label: first.has(d) ? d.industry : '',
}));

mount(Elicit({
  width: 460, height: 620,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  axes: false,
  schema: {
    industry: { type: 'categorical' }, date: { type: 'temporal' },
    base: { type: 'quantitative', domain: [0, panel * (names.length - 1) + frame] },
    top: { type: 'quantitative' }, ceil: { type: 'quantitative' }, label: { type: 'categorical' },
  },
  data: rows,
  guides: [
    guides.custom(({ scales, width }) => names.map((n) => ({
      type: 'rect', x: 0, width, fill: 'none', stroke: 'currentColor', strokeWidth: 1,
      y: scales.y.encode(baseOf(n) + frame), height: scales.y.encode(baseOf(n)) - scales.y.encode(baseOf(n) + frame),
    }))),
  ],
  marks: [
    areaY({
      fill: 'currentColor', fillOpacity: 1, stroke: 'none',
      channels: { series: { field: 'industry' }, x: { field: 'date' }, y1: { field: 'base' }, y2: { field: 'top' } },
    }),
    text({
      fontSize: 10, textAnchor: 'start', lineAnchor: 'top', dx: 6, dy: 6, fill: 'currentColor',
      channels: { x: { field: 'date' }, y: { field: 'ceil' }, text: { field: 'label' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Strike out lines',
      question: 'Which of these industries saw unemployment at least double between 2007 and 2010? Remove the ones that did not.',
      try: 'Click any point on a line to remove that whole industry. Use Reset to start over.',
      why: '`edit.line.removeSeries()` reads the clicked row’s `series` key and deletes every row that shares it, so the answer is the set of industries left in `getData()`. It is the take-apart twin of `edit.line.newSeries()`.',
      uses: ['edit.line.removeSeries()', 'series'],
      code: `const industries = await plotData('industries');
const keep = ['Construction', 'Manufacturing', 'Finance', 'Government', 'Education and Health', 'Leisure and hospitality'];
// Yearly mean unemployed (thousands), 2005–2010.
const rows = d3.flatRollup(
  industries.filter((d) => keep.includes(d.industry) && d.date.getUTCFullYear() >= 2005 && d.date.getUTCFullYear() <= 2010),
  (v) => Math.round(d3.mean(v, (d) => d.unemployed)),
  (d) => d.industry, (d) => d.date.getUTCFullYear())
  .map(([industry, year, unemployed]) => ({ industry, year, unemployed }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 16, right: 130, bottom: 28, left: 44 },
  schema: {
    industry:   { type: 'categorical', domain: keep },
    year:       { type: 'quantitative', domain: [2005, 2010] },
    unemployed: { type: 'quantitative', domain: [0, 2500] },
  },
  data: rows,
  axes: { x: { tickFormat: 'd' }, y: { grid: true } },
  marks: [
    lineY({
      strokeWidth: 2, handleSize: 4,
      channels: {
        series: { field: 'industry' },               //! the unit a click removes
        stroke: { field: 'industry' },
        x: { field: 'year' }, y: { field: 'unemployed' },
      },
      edits: [edit.line.removeSeries({ series: 'industry' })],   //! click: drop the whole line
    }),
    text({
      fontSize: 10, textAnchor: 'start', dx: 6, fill: 'currentColor',
      channels: { x: { field: 'year' }, y: { field: 'unemployed' },
        text: { fn: (d) => d.year === 2010 ? d.industry : '' } },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep one panel’s band',
      question: 'Construction unemployment to the end of 2007 is shown. For each month of 2008–2009, give a range you are 80% sure it fell in, in thousands.',
      try: 'Press on the top edge of the band and sweep along it, then on its bottom edge.',
      why: 'One panel of the small multiple, as an `areaY` from `y1: lo` to `y2: hi` with an `edit.line.sweep()` on each edge, so the high and low ends are separate strokes. The record is a zero-width band that `lock` holds still, so the range opens out of the last known month.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'lock'],
      code: `const industries = await plotData('industries');
const rows = industries.filter((d) => d.industry === 'Construction' && d.date < new Date('2010-01-01'));
const cut = new Date('2007-12-01');
const level = rows.find((d) => +d.date === +cut).unemployed;
const data = rows.map((d) => d.date <= cut
  ? { date: d.date, lo: d.unemployed, hi: d.unemployed }
  : { date: d.date, lo: level - 150, hi: level + 150 });

mount(Elicit({
  width: 460, height: 260,
  margins: { top: 16, right: 16, bottom: 28, left: 54 },
  schema: {
    date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [0, 2500] },
    hi:   { type: 'quantitative', domain: [0, 2500] },
  },
  data,
  lock: (d) => d.date <= cut,                         //! 2000–2007 is given
  constraints: [ordering({ field: ['lo', 'hi'] })],   //! the band never inverts
  axes: { y: { grid: true, title: 'Unemployed (thousands)' } },
  guides: [guides.region({ x: [cut, new Date('2009-12-01')], fill: '#94a3b8', opacity: 0.12 })],
  marks: [
    areaY({
      fill: 'currentColor', fillOpacity: 0.7, stroke: 'currentColor', handleSize: 2,
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the low edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the high edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-random-walk',
  status: 'full',
  verdict: 'A 10,000-step random walk (a cumulative sum of normal draws) as one `lineY`, with a zero rule.',
  needs: [],
  prep: ['prep-window'],
  gaps: [
    'Plot’s `mapY("cumsum")` runs in JavaScript (`d3.cumsum`).',
    'The walk is seeded (`d3.randomLcg`) so it is the same on every load; Plot’s changes on every run.',
  ],
  recreation: {
    code: `const normal = d3.randomNormal.source(d3.randomLcg(42))();
const ys = d3.cumsum({ length: 10000 }, () => normal());
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: { i: { type: 'quantitative' }, y: { type: 'quantitative' } },
  data: Array.from(ys, (y, i) => ({ i, y })),
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'i' }, y: { field: 'y' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw a random walk',
      question: 'Draw what you think a random walk of 100 steps looks like, where every step is a draw from a standard normal.',
      try: 'Drag across the chart to draw. Then press Reveal to see five real walks.',
      why: '`edit.line.draw()` samples your stroke at each of the 101 steps in `samples`, so a hand-drawn line becomes one row per step. People draw walks that are too smooth and stray too little; the reveal is a `guides.custom` that only draws in stage 1.',
      uses: ['edit.line.draw()', 'samples', 'guides.custom()', 'nextStage()'],
      code: `const normal = d3.randomNormal.source(d3.randomLcg(7))();
const walks = d3.range(5).map(() => [0, ...d3.cumsum({ length: 100 }, () => normal())]);

const chart = mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    s:    { type: 'categorical' },
    step: { type: 'quantitative', domain: [0, 100] },
    y:    { type: 'quantitative', domain: [-30, 30] },
  },
  data: [],
  axes: { y: { grid: true } },
  guides: [
    guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' }),
    guides.custom(({ scales, stage }) => stage < 1 ? [] : walks.map((w) => ({   //! real walks, after the reveal
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 1, opacity: 0.7,
      points: w.map((y, i) => [scales.x.encode(i), scales.y.encode(y)]),
    }))),
  ],
  marks: [
    lineY({
      stroke: 'steelblue', strokeWidth: 2, handles: 'hit',
      channels: { series: { field: 's' }, x: { field: 'step' }, y: { field: 'y' } },
      edits: [edit.line.draw({ series: 's', samples: d3.range(0, 101), stage: 0 })],   //! one row per step; drawing ends at the reveal
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => chart.nextStage();`,
    },
    {
      title: 'Open the fan',
      question: 'A walk starts at 0 and takes 1,000 standard-normal steps. Within what range will it end up 95% of the time?',
      try: 'Drag a handle at the end of the band up or down to open or close the fan.',
      why: 'A fan is a `trendBand` with its line pinned flat at zero: `intercept` and `slope` are `{ datum: 0 }`, so the only column left to write is `slopeSpread`. The band is linear, so it shows where your fan crosses the true √n envelope after the reveal.',
      uses: ['trendBand', 'edit.trend.slopeSpread()', 'clamp()', 'guides.custom()'],
      code: `const chart = mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  axes: { origin: false, y: { grid: true } },
  schema: {
    x:      { type: 'quantitative', domain: [0, 1000] },
    y:      { type: 'quantitative', domain: [-150, 150] },
    spread: { type: 'quantitative', domain: [0, 0.15] },
  },
  data: [{ spread: 0.02 }],
  constraints: [clamp({ field: 'spread', min: 0, max: 0.15 })],
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [1, -1].map((sign) => ({
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2,
      points: d3.range(0, 1001, 10).map((n) => [scales.x.encode(n), scales.y.encode(sign * 1.96 * Math.sqrt(n))]),
    }))),
  ],
  marks: [
    trendBand({
      fill: 'steelblue', handles: true,
      channels: {
        intercept:   { datum: 0 },                     //! starts at zero…
        slope:       { datum: 0 },                     //! …with no drift
        slopeSpread: { field: 'spread', edit: edit.trend.slopeSpread() },   //! you set the fan
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
  id: 'plot-bollinger-bands',
  status: 'partial',
  verdict: 'A 20-day, 2σ Bollinger band as an `areaY` span under a `lineY` of the closes; the two sliders that set N and K are missing.',
  needs: ['input-widgets'],
  prep: ['prep-window'],
  gaps: [
    'The rolling mean and deviation (Plot’s `bollingerY`) are computed in JavaScript, with N = 20 and K = 2 fixed: the original’s range inputs are not reproduced.',
    'The band starts on the 20th trading day, where its first full window ends; the original draws the price line from day one.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
const n = 20, k = 2;
const rows = aapl.slice(n - 1).map((d, j) => {
  const w = aapl.slice(j, j + n).map((e) => e.Close);
  const m = d3.mean(w), sd = d3.deviation(w);
  return { Date: d.Date, Close: d.Close, lo: m - k * sd, hi: m + k * sd };
});

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date: { type: 'temporal' }, Close: { type: 'quantitative' },
    lo: { type: 'quantitative' }, hi: { type: 'quantitative' },
  },
  data: rows,
  axes: { y: { grid: true } },
  marks: [
    areaY({
      fill: 'currentColor', fillOpacity: 0.2, stroke: 'none',
      channels: { x: { field: 'Date' }, y1: { field: 'lo' }, y2: { field: 'hi' } },
    }),
    lineY({
      stroke: 'currentColor', strokeWidth: 1,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Stretch a forecast band',
      question: 'Two years of month-end closes are shown. For each month of the next year, give a range you are 90% sure Apple’s close will fall in.',
      try: 'Drag the dots on the top and bottom edge of the band. Pushing one edge past the other pushes it along.',
      why: 'The band is one `areaY` over a `y1`/`y2` pair, and each edge carries its own `move()`; the area claims each edit for its own edge’s handles, so a drag never moves both. `ordering` pushes the other edge rather than letting the band turn inside out. History rows have `lo = hi`, so the band grows out of the line, and `lock` keeps them fixed.',
      uses: ['move()', 'ordering()', 'lock', 'areaY span (y1/y2)'],
      code: `const aapl = await plotData('aapl');
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([m, rows]) => ({ Date: new Date(m), Close: rows.at(-1).Close }))
  .filter((d) => d.Date >= new Date('2016-06-01'));
const last = monthly.at(-1);
// History is a zero-width band; the next twelve months start as ±$10.
const future = d3.utcMonths(d3.utcMonth.offset(last.Date, 1), d3.utcMonth.offset(last.Date, 13))
  .map((Date) => ({ Date, lo: Math.round(last.Close - 10), hi: Math.round(last.Close + 10) }));
const data = [...monthly.map((d) => ({ Date: d.Date, lo: d.Close, hi: d.Close })), ...future];

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [50, 300] },
    hi:   { type: 'quantitative', domain: [50, 300] },
  },
  data,
  lock: (d) => d.Date <= last.Date,                     //! the record is fixed
  constraints: [ordering({ field: ['lo', 'hi'] })],     //! pushes rather than inverts
  axes: { y: { grid: true } },
  marks: [
    areaY({
      fill: 'steelblue', fillOpacity: 0.3, stroke: 'steelblue', strokeWidth: 1.5, handleSize: 3.5,
      channels: {
        x:  { field: 'Date' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) },   //! the low edge
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },   //! the high edge
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep past the bands',
      question: 'The last year of closes and their 20-day Bollinger band are shown. Where will the band’s low and high edges run over the next three months?',
      try: 'Press on the top edge of the orange band and sweep along it, then on its bottom edge.',
      why: 'The history and its computed band live in a context table (`context: true`): drawn by marks with `table: "history"`, read-only, and left out of `getData()`. The elicited table holds only the forecast weeks, and each edge of its `areaY` span carries an `edit.line.sweep()`.',
      uses: ['edit.line.sweep()', 'context table', 'ordering()', 'areaY span (y1/y2)'],
      code: `const aapl = await plotData('aapl');
const n = 20, k = 2;
const history = aapl.slice(n - 1).map((d, j) => {
  const w = aapl.slice(j, j + n).map((e) => e.Close);
  const m = d3.mean(w), sd = d3.deviation(w);
  return { Date: d.Date, Close: d.Close, lo: m - k * sd, hi: m + k * sd };
}).filter((d) => d.Date >= new Date('2017-05-01'));
const last = history.at(-1);
const forecast = d3.utcWeeks(d3.utcDay.offset(last.Date, 1), d3.utcMonth.offset(last.Date, 3))
  .map((Date) => ({ Date, lo: Math.round(last.lo), hi: Math.round(last.hi) }));

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    data: {
      Date: { type: 'temporal' },
      lo:   { type: 'quantitative', domain: [120, 240] },
      hi:   { type: 'quantitative', domain: [120, 240] },
    },
    history: {
      context: true,                                  //! drawn, read-only, never reported
      fields: { Date: { type: 'temporal' }, Close: { type: 'quantitative' },
                lo: { type: 'quantitative' }, hi: { type: 'quantitative' } },
    },
  },
  data: { data: forecast, history },
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { y: { grid: true } },
  marks: [
    areaY({ table: 'history', fill: 'currentColor', fillOpacity: 0.15, stroke: 'none',
      channels: { x: { field: 'Date' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    lineY({ table: 'history', stroke: 'currentColor', strokeWidth: 1,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } } }),
    areaY({
      fill: '#e8833a', fillOpacity: 0.3, stroke: '#e8833a', handleSize: 3,
      channels: {
        x:  { field: 'Date' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the low edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the high edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-line-with-moving-average',
  status: 'full',
  verdict: 'Monthly temperature anomalies as `point`s stroked on a diverging scale, with a 12-month moving average `lineY` and a zero rule.',
  needs: [],
  prep: ['prep-window'],
  gaps: [
    'Plot’s `windowY(12)` is computed in JavaScript (centred, shrinking at the ends).',
    'The colour is an adopted `d3.scaleDiverging` over [−m, 0, m], so the ramp is symmetric about zero as in Plot. A `diverging` scale over the schema domain scales each side of the pivot on its own, and declaring a symmetric domain would also widen the y axis.',
  ],
  recreation: {
    code: `const gistemp = await plotData('observablehq__plot-line-with-moving-average', 'gistemp.csv');
const rows = gistemp.map((d, i) => ({
  Date: d.Date, Anomaly: d.Anomaly,
  avg: d3.mean(gistemp.slice(Math.max(0, i - 6), i + 6), (e) => e.Anomaly),
}));
// A live diverging scale, symmetric about zero.
const m = d3.max(gistemp, (d) => Math.abs(d.Anomaly));
const buRd = d3.scaleDiverging([-m, 0, m], (t) => d3.interpolateRdBu(1 - t));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Anomaly: { type: 'quantitative' },
    avg: { type: 'quantitative' },
  },
  data: rows,
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    point({
      size: 2, fill: 'none', strokeWidth: 1,
      channels: { x: { field: 'Date' }, y: { field: 'Anomaly' },
        stroke: { field: 'Anomaly', scale: buRd } },
    }),
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'avg' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fit a trend and a band',
      question: 'Draw the long-run warming trend through these yearly anomalies, then say how uncertain you are about where it will be by 2050.',
      try: 'Drag the centre handle to move the line and an end handle to tilt it; drag the band’s handles to widen or narrow it.',
      why: 'A belief about a trend is two parameters, so the dataset is one row. `trend` writes `intercept` (the anomaly in 2000, since x is years from 2000) and `slope`; `trendBand` views the same row and writes the two spreads. The observed years sit in a context table, drawn by a `point` mark and left out of `getData()`.',
      uses: ['trend', 'trendBand', 'edit.trend.intercept()', 'edit.trend.slope()', 'edit.trend.slopeSpread()', 'context table'],
      code: `const gistemp = await plotData('observablehq__plot-line-with-moving-average', 'gistemp.csv');
const yearly = d3.rollups(gistemp, (v) => d3.mean(v, (d) => d.Anomaly), (d) => d.Date.getUTCFullYear())
  .filter(([year]) => year >= 1960)
  .map(([year, a]) => ({ x: year - 2000, y: a }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  axes: { origin: false, x: { tickFormat: (v) => v + 2000 }, y: { grid: true } },
  schema: {
    data: {
      x: { type: 'quantitative', domain: [-40, 50] },   //! years from 2000
      y: { type: 'quantitative', domain: [-0.6, 2.4] },
      intercept: { type: 'quantitative' }, slope: { type: 'quantitative' },
      aSd: { type: 'quantitative' }, bSd: { type: 'quantitative' },
    },
    // The observed years: drawn, read-only, never reported.
    observed: { context: true, fields: { x: { type: 'quantitative' }, y: { type: 'quantitative' } } },
  },
  data: { data: [{ intercept: 0.3, slope: 0, aSd: 0.1, bSd: 0.004 }], observed: yearly },
  marks: [
    point({
      table: 'observed', size: 2.5, stroke: 'none',
      channels: { x: { field: 'x' }, y: { field: 'y' }, fill: { fn: (d) => d.y > 0 ? '#d6604d' : '#4393c3' } },
    }),
    trendBand({
      fill: '#e8833a', handles: true,
      channels: {
        interceptSpread: { field: 'aSd', edit: edit.trend.interceptSpread() },
        slopeSpread:     { field: 'bSd', edit: edit.trend.slopeSpread() },   //! how sure you are of the rate
      },
    }),
    trend({
      stroke: '#c2410c',
      channels: {
        intercept: { field: 'intercept', edit: edit.trend.intercept() },   //! the level in 2000
        slope:     { field: 'slope',     edit: edit.trend.slope() },       //! warming per year
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-line-chart-with-gaps',
  status: 'full',
  verdict: 'The January–March closes are `null` (Plot uses `NaN`), so one `lineY` breaks wherever the quarter is missing; a faint line over a context table of the defined rows bridges the gaps, as in the notebook’s second chart.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Plot’s second chart filters the same array for its faint line; here the filtered rows are a second, read-only context table, because a mark views exactly one table.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
const rows = aapl.map((d) => ({ Date: d.Date, Close: d.Date.getUTCMonth() < 3 ? null : d.Close }));
mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    data: { Date: { type: 'temporal' }, Close: { type: 'quantitative' } },
    bridge: { context: true, fields: { Date: { type: 'temporal' }, Close: { type: 'quantitative' } } },
  },
  data: { data: rows, bridge: rows.filter((d) => d.Close != null) },
  axes: { y: { grid: true } },
  marks: [
    // The notebook's second chart: the defined rows only, bridging each gap faintly.
    lineY({
      table: 'bridge', stroke: 'currentColor', strokeOpacity: 0.3, strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,   // a null close breaks the line
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill the gap',
      question: 'Apple’s weekly closes for January to March 2016 are missing. What do you think they were?',
      try: 'Sweep across the shaded stretch to repaint it; the line on either side stays put.',
      why: 'The missing weeks are seeded as a straight line between the two known ends, and `lock` fixes every other row. `edit.line.sweep()` skips locked rows, so the stroke can only repaint the gap however wide you sweep.',
      uses: ['edit.line.sweep()', 'lock', 'guides.region()'],
      code: `const aapl = await plotData('aapl');
const weekly = d3.groups(aapl.filter((d) => d.Date >= new Date('2015-07-01') && d.Date < new Date('2016-10-01')),
  (d) => +d3.utcWeek(d.Date)).map(([w, rows]) => ({ Date: new Date(w), Close: rows.at(-1).Close }));
const gapStart = new Date('2016-01-01'), gapEnd = new Date('2016-04-01');
const inGap = (d) => d.Date >= gapStart && d.Date < gapEnd;
// Seed the gap as a straight line between its two known neighbours.
const before = weekly.filter((d) => d.Date < gapStart).at(-1);
const after = weekly.find((d) => d.Date >= gapEnd);
const lerp = d3.scaleTime([before.Date, after.Date], [before.Close, after.Close]);
const data = weekly.map((d) => inGap(d) ? { Date: d.Date, Close: +lerp(d.Date).toFixed(2) } : d);

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 40 },
  schema: {
    Date:  { type: 'temporal' },
    Close: { type: 'quantitative', domain: [80, 140] },
  },
  data,
  lock: (d) => !inGap(d),                             //! only the missing quarter is free
  axes: { y: { grid: true } },
  guides: [guides.region({ x: [gapStart, gapEnd], fill: '#f59e0b', opacity: 0.12 })],
  marks: [
    lineY({
      stroke: 'steelblue', strokeWidth: 2, handleSize: 2.5,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: edit.line.sweep() },   //! repaints only the free rows
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-sparse-line',
  status: 'full',
  verdict: 'A `lineY` through 1,000 irregularly timed observations with a `point` at each, the notebook’s first chart.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The notebook goes on to bin by day and draw rects and gap-aware lines; only its first chart is recreated here. The later ones need `binX` with empty bins kept, which would be `prep-bin` work in JavaScript.',
  ],
  recreation: {
    code: `// The notebook's own generator: a sine sampled densely near 1 July, sparsely elsewhere.
const r = d3.randomNormal.source(d3.randomLcg(42))(0, 20);
const r2 = d3.randomNormal.source(d3.randomLcg(44))(0, 0.1);
const origin = new Date('2024-07-01');
const rows = d3.range(1000).map(() => {
  const offset = r();
  return { date: new Date(+origin + offset * 864e5), value: Math.sin(offset / 4) + r2() };
}).sort((a, b) => d3.ascending(a.date, b.date));

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: { date: { type: 'temporal' }, value: { type: 'quantitative' } },
  data: rows,
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'date' }, y: { field: 'value' } },
    }),
    point({
      size: 1.5, fill: 'currentColor', stroke: 'none',
      channels: { x: { field: 'date' }, y: { field: 'value' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Extend the season',
      question: 'The sensor reported every day for a month either side of 1 July. Where do you think the value was in the spring and autumn it missed?',
      try: 'Click in the empty stretches to add days; drag one of your points to adjust it; Alt-click to delete it.',
      why: 'The midsummer daily means are seeded and locked. `edit.line.anchor()` mints a row where you click; `snap` rounds it to a whole day and `spacing` keeps days at least one apart, in data units, whatever the zoom. Your rows are exactly the ones `getData()` holds beyond the seed.',
      uses: ['edit.line.anchor()', 'snap()', 'spacing()', 'remove()', 'lock'],
      code: `const r = d3.randomNormal.source(d3.randomLcg(42))(0, 20);
const r2 = d3.randomNormal.source(d3.randomLcg(44))(0, 0.1);
const obs = d3.range(1000).map(() => { const offset = r(); return { day: Math.round(offset), value: Math.sin(offset / 4) + r2() }; });
// Daily means of the dense midsummer observations, a month either side of 1 July.
const daily = d3.rollups(obs.filter((d) => Math.abs(d.day) <= 30), (v) => +d3.mean(v, (d) => d.value).toFixed(2), (d) => d.day)
  .map(([day, value]) => ({ day, value })).sort((a, b) => a.day - b.day);

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    day:   { type: 'quantitative', domain: [-90, 90] },
    value: { type: 'quantitative', domain: [-1.5, 1.5] },
  },
  data: daily,
  lock: 'seed',                                       //! midsummer is given
  constraints: [
    snap({ field: 'day', step: 1 }),                  //! whole days…
    spacing({ field: 'day', min: 1 }),                //! …at least one apart
  ],
  axes: { x: { tickFormat: (d) => d3.utcFormat('%b %-d')(d3.utcDay.offset(new Date('2024-07-01'), d)) }, y: { grid: true } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1, handleSize: 3,
      channels: {
        x: { field: 'day' },
        y: { field: 'value', edit: move({ channels: ['x', 'y'] }) },
      },
      edits: [
        edit.line.anchor({ when: when.noAlt }),         //! click adds a day
        remove({ when: when.alt }),
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-window-reduce',
  status: 'full',
  verdict: 'Daily San Francisco lows with 28-day rolling minimum, maximum and median lines, four `lineY` marks over one table.',
  needs: [],
  prep: ['prep-window'],
  gaps: ['Plot’s `windowY` reducers are computed in JavaScript (centred windows that shrink at the ends).'],
  recreation: {
    code: `const sftemp = await plotData('observablehq__plot-window-reduce', 'sf-temperatures.csv');
const k = 28;
const rows = sftemp.map((d, i) => {
  const w = sftemp.slice(Math.max(0, i - k / 2), i + k / 2).map((e) => e.low);
  return { date: d.date, low: d.low, min: d3.min(w), max: d3.max(w), median: d3.median(w) };
});
const series = (field, stroke, extra = {}) => lineY({
  stroke, strokeWidth: 1.5, ...extra,
  channels: { x: { field: 'date' }, y: { field } },
});

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 50 },
  schema: {
    date: { type: 'temporal' }, low: { type: 'quantitative' },
    min: { type: 'quantitative' }, max: { type: 'quantitative' }, median: { type: 'quantitative' },
  },
  data: rows,
  axes: { y: { grid: true, title: 'Temperature (°F)' } },
  marks: [
    series('low', 'currentColor', { strokeOpacity: 0.3 }),
    series('min', 'blue'),
    series('max', 'red'),
    series('median', 'currentColor'),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Three ordered lines',
      question: 'For each month in San Francisco, what are the coldest, the typical and the warmest overnight lows?',
      try: 'Drag the dots on any of the three lines. Push one line through another and it pushes the other along.',
      why: 'Three `lineY` marks view three columns of the same twelve rows, each with its own `move()`. `ordering` is one dataset invariant over all three columns, so whichever line you drag, the coldest stays below the typical and the typical below the warmest.',
      uses: ['move()', 'ordering()', 'snap()'],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const band = (field, stroke) => lineY({
  stroke, strokeWidth: 2, handleSize: 4.5,
  channels: { x: { field: 'month' }, y: { field, edit: move() } },
});

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 36 },
  schema: {
    month:  { type: 'ordinal', domain: months },
    min:    { type: 'quantitative', domain: [35, 70] },
    median: { type: 'quantitative', domain: [35, 70] },
    max:    { type: 'quantitative', domain: [35, 70] },
  },
  data: months.map((month) => ({ month, min: 46, median: 51, max: 56 })),
  constraints: [
    ordering({ field: ['min', 'median', 'max'] }),    //! coldest ≤ typical ≤ warmest, always
    snap({ step: 0.5 }),
  ],
  axes: { y: { grid: true } },
  marks: [band('min', 'blue'), band('median', 'currentColor'), band('max', 'red')],   //! three columns, three marks
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-line-chart-percent-change',
  status: 'partial',
  verdict: 'Apple’s price relative to its first close on a log y axis with percent ticks and a rule at 0%; the range input that moves the basis is missing.',
  needs: ['input-widgets'],
  prep: ['prep-calculate'],
  gaps: ['The basis is fixed at the first close; the original’s range input re-normalises the line as you move it.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
const basis = aapl[0].Close;
const pct = (d) => \`\${d > 1 ? '+' : ''}\${Math.round(100 * (d - 1))}%\`;
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 46 },
  schema: { Date: { type: 'temporal' }, ratio: { type: 'quantitative' } },
  data: aapl.map((d) => ({ Date: d.Date, ratio: d.Close / basis })),
  axes: { y: { grid: true, tickValues: [0.9, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3], tickFormat: pct } },
  guides: [guides.rule({ y: 1, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({
      stroke: 'steelblue', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'ratio', scale: 'log' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'An interval on a log axis',
      question: 'Since May 2013 Apple is up about 190%. What will the change be by May 2019: your best guess and an 80% range?',
      try: 'Drag the big dot for your best guess and the small dots for the ends of the range.',
      why: 'The answer is one row with three columns, each drawn by its own `point` with its own `move()`, plus an inert `rule` between the ends. The chart-level `scales: { y: { type: "log" } }` makes every edit invert through the log scale, so equal drags are equal ratios. `ordering` keeps low ≤ guess ≤ high, and the price record is a read-only context table.',
      uses: ['move()', 'ordering()', 'scales', 'context table'],
      code: `const aapl = await plotData('aapl');
const basis = aapl[0].Close;
const history = d3.groups(aapl, (d) => +d3.utcMonth(d.Date)).map(([m, rows]) => ({ Date: new Date(m), ratio: rows.at(-1).Close / basis }));
const pct = (d) => \`\${d > 1 ? '+' : ''}\${Math.round(100 * (d - 1))}%\`;
const at = new Date('2019-05-01');
const dot = (field, size) => point({
  size, fill: 'steelblue', stroke: 'white', strokeWidth: 1,
  channels: { x: { field: 'Date' }, y: { field, edit: move() } },
});

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 16, bottom: 28, left: 46 },
  schema: {
    data: {
      Date: { type: 'temporal', domain: [new Date('2013-05-01'), new Date('2019-07-01')] },
      lo:   { type: 'quantitative', domain: [0.8, 6] },
      mid:  { type: 'quantitative', domain: [0.8, 6] },
      hi:   { type: 'quantitative', domain: [0.8, 6] },
    },
    history: { context: true, fields: { Date: { type: 'temporal' }, ratio: { type: 'quantitative' } } },   //! the record: drawn, never reported
  },
  data: { data: [{ Date: at, lo: 2.4, mid: 2.9, hi: 3.5 }], history },
  scales: { y: { type: 'log' } },                     //! every y edit inverts through log
  constraints: [ordering({ field: ['lo', 'mid', 'hi'] })],   //! low ≤ guess ≤ high
  axes: { y: { grid: true, tickValues: [1, 1.5, 2, 3, 4, 5], tickFormat: pct } },
  guides: [guides.rule({ y: 1, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    lineY({ table: 'history', stroke: 'steelblue', strokeWidth: 1.5, channels: { x: { field: 'Date' }, y: { field: 'ratio' } } }),
    rule({ stroke: 'steelblue', strokeWidth: 3, channels: { x: { field: 'Date' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    dot('lo', 5), dot('hi', 5), dot('mid', 8),        //! one mark per column
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-ridgeline',
  status: 'partial',
  verdict: 'Thirty-eight overlapping ridges, one `areaY` + `lineY` pair per station so each ridge occludes the ones above it. Faceting is not covered by this study, so the facets are an offset in data units rather than an `fy` scale.',
  needs: ['facet'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'Faceting is not covered by this study. The data is pivoted wide (one column pair per station), each ridge is lifted by its row offset, and the 38 stations become 76 marks, because paint order is mark order and the occlusion needs each ridge’s fill painted right after the line above it.',
    'Station names are a `text` mark at each ridge’s baseline rather than an fy axis.',
  ],
  recreation: {
    code: `const traffic = await plotData('observablehq__plot-ridgeline', 'traffic.csv');
const names = [...new Set(traffic.map((d) => d.name))];
const max = d3.max(traffic, (d) => d.value);
const overlap = 4.5;                                   // a ridge's peak rises 4.5 rows
// Wide: one row per hour, a base and a top column per station.
const byDate = d3.group(traffic, (d) => +d.date);
const rows = [...byDate].sort((a, b) => a[0] - b[0]).map(([t, ds], j) => {
  const row = { date: new Date(t) };
  for (const d of ds) {
    const k = names.indexOf(d.name), base = names.length - 1 - k;
    row['b' + k] = base;
    row['v' + k] = base + (d.value / max) * overlap;
    row['n' + k] = j === 0 ? d.name : '';
  }
  return row;
});
const schema = { date: { type: 'temporal' } };
names.forEach((_, k) => {
  schema['b' + k] = { type: 'quantitative' };
  schema['v' + k] = { type: 'quantitative' };
  schema['n' + k] = { type: 'categorical' };
});

mount(Elicit({
  width: 460, height: 600,
  margins: { top: 24, right: 8, bottom: 4, left: 108 },
  axes: { x: { anchor: 'top' }, y: false },
  schema,
  data: rows,
  marks: names.flatMap((_, k) => [
    areaY({ fill: '#ccc', fillOpacity: 1, stroke: 'none', curve: 'basis',
      channels: { x: { field: 'date' }, y1: { field: 'b' + k }, y2: { field: 'v' + k } } }),
    lineY({ stroke: 'currentColor', strokeWidth: 1, curve: 'basis',
      channels: { x: { field: 'date' }, y: { field: 'v' + k } } }),
    text({ fontSize: 9, textAnchor: 'end', dx: -4, fill: 'currentColor',
      channels: { x: { field: 'date' }, y: { field: 'b' + k }, text: { field: 'n' + k } } }),
  ]),
}));`,
  },
  interfaces: [
    {
      title: 'Draw, reveal, revise',
      question: 'How many vehicles an hour passed the Köln-Nord counter over Monday 4 January 2016?',
      try: 'Drag across to draw the day. Press Reveal: drawing turns off, the real day appears, and dragging now pulls the nearest hour so you can revise.',
      why: 'Both edits carry a `stage`: `edit.line.draw()` is live in stage 0 and a nearest-pick `move()` in stage 1, so `nextStage()` swaps the gesture as well as showing the answer. `getData()` holds your final, revised curve.',
      uses: ['edit.line.draw()', 'move()', 'stage', 'nextStage()', 'guides.custom()'],
      code: `const traffic = await plotData('observablehq__plot-ridgeline', 'traffic.csv');
// The CSV is not in time order; sort the answer key by hour.
const truth = d3.sort(traffic.filter((d) => d.name === 'Köln-Nord' && d.date < new Date('2016-01-05'))
  .map((d) => ({ hour: d.date.getUTCHours(), value: d.value })), (d) => d.hour);

const chart = mount(Elicit({
  width: 460, height: 260,
  margins: { top: 16, right: 16, bottom: 28, left: 44 },
  stageLabels: ['draw', 'revise'],
  schema: {
    s:     { type: 'categorical' },
    hour:  { type: 'quantitative', domain: [0, 23] },
    value: { type: 'quantitative', domain: [0, 10000] },
  },
  data: [],
  axes: { x: { tickFormat: (h) => h + ':00' }, y: { grid: true } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : [{
      type: 'path', fill: 'none', stroke: '#e8833a', strokeWidth: 2, curve: 'basis',
      points: truth.map((d) => [scales.x.encode(d.hour), scales.y.encode(d.value)]),
    }]),
  ],
  marks: [
    areaY({
      fill: '#ccc', fillOpacity: 1, stroke: 'currentColor', curve: 'basis', handleSize: 3.5,
      channels: {
        series: { field: 's' }, x: { field: 'hour' },
        y: { field: 'value', edit: move({ pick: 'nearest', stage: 1 }) },   //! stage 1: revise the nearest hour
      },
      edits: [edit.line.draw({ series: 's', samples: d3.range(0, 24), stage: 0 })],   //! stage 0: draw the day
    }),
  ],
}));
const btn = mount(document.createElement('button'));
btn.textContent = 'Reveal';
btn.onclick = () => { chart.nextStage(); btn.disabled = true; };`,
    },
    {
      title: 'Sweep a ridge’s range',
      question: 'Over an ordinary weekday, between how many vehicles an hour does traffic past the Köln-Nord counter run, hour by hour?',
      try: 'Press on the top of the grey ridge and sweep along it for the busiest you expect, then on its bottom edge for the quietest.',
      why: 'One ridge, as an `areaY` from `y1: lo` to `y2: hi` with an `edit.line.sweep()` on each edge: the edge you press on paints, so the busy and quiet bounds are separate strokes. `ordering` keeps the quiet bound under the busy one, and both edges share the ridge’s `basis` curve.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'clamp()'],
      code: `mount(Elicit({
  width: 460, height: 260,
  margins: { top: 16, right: 16, bottom: 28, left: 54 },
  schema: {
    hour: { type: 'quantitative', domain: [0, 23] },
    lo:   { type: 'quantitative', domain: [0, 10000] },
    hi:   { type: 'quantitative', domain: [0, 10000] },
  },
  data: d3.range(24).map((hour) => ({ hour, lo: 1500, hi: 4500 })),   //! a flat, wide prior
  constraints: [ordering({ field: ['lo', 'hi'] }), clamp({ field: ['lo', 'hi'] })],
  axes: { x: { tickFormat: (h) => h + ':00' }, y: { grid: true, title: 'Vehicles per hour' } },
  marks: [
    areaY({
      fill: '#ccc', fillOpacity: 1, stroke: 'currentColor', curve: 'basis', handleSize: 3,
      channels: {
        x:  { field: 'hour' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the quietest you expect
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the busiest you expect
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-psr-b1919-21',
  status: 'partial',
  verdict: 'The eighty pulses as stacked ridges, each a white-filled `areaY` under a `lineY` so lower pulses occlude upper ones. Faceting is not covered by this study, so the facets are a data-unit offset, and the fill runs to each ridge’s baseline rather than closing the line on itself.',
  needs: ['facet'],
  prep: ['prep-reshape'],
  gaps: [
    'Faceting is not covered by this study: the CSV is kept wide (one column pair per pulse, each lifted by its row offset) and drawn as 160 marks, so that each pulse’s white fill is painted right after the line above it.',
    'Plot fills the line’s own closed path; here each white fill spans from the pulse’s baseline to its line.',
  ],
  recreation: {
    code: `const csv = await plotData('observablehq__plot-psr-b1919-21', 'pulsar.csv', { type: 'text' });
const pulses = d3.csvParseRows(csv, (r) => r.map(Number));      // 80 pulses × 300 samples
const step = d3.max(pulses.flat()) / 16;                       // Plot's y domain per facet
const n = pulses.length;
const rows = d3.range(pulses[0].length).map((j) => {
  const row = { t: (j * 92) / 299 };
  pulses.forEach((p, k) => { row['b' + k] = (n - 1 - k) * step; row['v' + k] = (n - 1 - k) * step + p[j]; });
  return row;
});
const schema = { t: { type: 'quantitative' } };
pulses.forEach((_, k) => { schema['b' + k] = { type: 'quantitative' }; schema['v' + k] = { type: 'quantitative' }; });

mount(Elicit({
  width: 460, height: 600,
  margins: { top: 30, right: 16, bottom: 30, left: 16 },
  axes: { y: false, x: { title: 'Time (ms) →' } },
  schema,
  data: rows,
  marks: pulses.flatMap((_, k) => [
    areaY({ fill: 'white', fillOpacity: 1, stroke: 'none',
      channels: { x: { field: 't' }, y1: { field: 'b' + k }, y2: { field: 'v' + k } } }),
    lineY({ stroke: 'currentColor', strokeWidth: 1,
      channels: { x: { field: 't' }, y: { field: 'v' + k } } }),
  ]),
}));`,
  },
  interfaces: [
    {
      title: 'Brush the arrival window',
      question: 'Each pulse’s main peak arrives at a slightly different time. Which window, in milliseconds, holds the main peak of nine pulses out of ten?',
      try: 'Drag the middle of the shaded window to slide it; drag either edge to resize it.',
      why: 'The answer is one row, `{ start, end }`, drawn as a `rect` spanning `x1`–`x2`. `brushSpan()` reads the grab position at dragstart: near an edge it resizes that edge, in the body it moves both, so one gesture edits the whole interval. The pulses behind it are a context table: drawn, read-only, and not in `getData()`.',
      uses: ['brushSpan()', 'rect', 'context table'],
      code: `const csv = await plotData('observablehq__plot-psr-b1919-21', 'pulsar.csv', { type: 'text' });
const pulses = d3.csvParseRows(csv, (r) => r.map(Number)).slice(0, 24);
const step = 6;
// Long form: one row per (pulse, sample), each pulse lifted by its row offset.
const samples = pulses.flatMap((p, k) => p.map((v, j) => ({ k: String(k), t: (j * 92) / 299, y: (pulses.length - 1 - k) * step + v })));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 16, right: 16, bottom: 32, left: 16 },
  axes: { y: false, x: { title: 'Time (ms) →' } },
  schema: {
    data: {
      start: { type: 'quantitative', domain: [0, 92] },
      end:   { type: 'quantitative', domain: [0, 92] },
      y:     { type: 'quantitative', domain: [-4, step * pulses.length + 20] },
    },
    pulses: { context: true, fields: { k: { type: 'categorical' }, t: { type: 'quantitative' }, y: { type: 'quantitative' } } },   //! read-only backdrop
  },
  data: { data: [{ start: 40, end: 52 }], pulses: samples },
  marks: [
    lineY({ table: 'pulses', stroke: 'currentColor', strokeWidth: 1,
      channels: { series: { field: 'k' }, x: { field: 't' }, y: { field: 'y' } } }),
    rect({
      fill: '#e8833a', fillOpacity: 0.25, stroke: '#e8833a',
      channels: { x1: { field: 'start' }, x2: { field: 'end' }, y1: { datum: -4 }, y2: { datum: step * pulses.length + 20 } },
      edits: [brushSpan({ channels: ['x1', 'x2'], edgeInset: 8 })],   //! edge = resize, body = slide
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the pulse envelope',
      question: 'Twelve pulses are overlaid. Through the main peak, between what intensities does a typical pulse run at each moment?',
      try: 'Press on the top edge of the orange band and sweep along it, then on its bottom edge.',
      why: 'An `areaY` from `y1: lo` to `y2: hi` with an `edit.line.sweep()` on each edge, so the envelope’s ceiling and floor are separate strokes. The overlaid pulses are a context table under it, so you judge the spread against the real traces without them entering your answer.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'context table'],
      code: `const csv = await plotData('observablehq__plot-psr-b1919-21', 'pulsar.csv', { type: 'text' });
const pulses = d3.csvParseRows(csv, (r) => r.map(Number)).slice(0, 12);
const inPeak = (t) => t >= 30 && t <= 62;
const traces = pulses.flatMap((p, k) => p.map((v, j) => ({ k: String(k), t: (j * 92) / 299, v }))).filter((d) => inPeak(d.t));
const top = Math.ceil(d3.max(traces, (d) => d.v));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 16, bottom: 32, left: 40 },
  axes: { x: { title: 'Time (ms) →' }, y: { grid: true } },
  schema: {
    data: {
      t:  { type: 'quantitative', domain: [30, 62] },
      lo: { type: 'quantitative', domain: [0, top] },
      hi: { type: 'quantitative', domain: [0, top] },
    },
    traces: { context: true, fields: { k: { type: 'categorical' }, t: { type: 'quantitative' }, v: { type: 'quantitative' } } },
  },
  data: { data: d3.range(30, 63, 2).map((t) => ({ t, lo: 2, hi: top / 4 })), traces },
  constraints: [ordering({ field: ['lo', 'hi'] })],
  marks: [
    lineY({ table: 'traces', stroke: 'currentColor', strokeOpacity: 0.35, strokeWidth: 1,
      channels: { series: { field: 'k' }, x: { field: 't' }, y: { field: 'v' } } }),
    areaY({
      fill: '#e8833a', fillOpacity: 0.3, stroke: '#e8833a', handleSize: 3,
      channels: {
        x:  { field: 't' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the envelope's floor
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the envelope's ceiling
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-unemployment-horizon-chart',
  status: 'partial',
  verdict: 'Each industry folded into seven bands, every band an `areaY` span clamped to one band’s height and coloured on a YlGnBu ramp, stacked into rows by a data-unit offset. Horizon folding is computed by hand, and faceting is not covered by this study.',
  needs: ['horizon', 'facet'],
  prep: ['prep-calculate'],
  gaps: [
    'No horizon mark: each band’s height, `clamp(v − i·step, 0, step)`, is computed in JavaScript, which reproduces Plot’s clipped areas exactly. `clip: true` confines marks to the plot, not each band to its own strip.',
    'Faceting is not covered by this study: rows are a per-industry offset on one y scale; the industry labels and panel frames are a `guides.custom`.',
    'The YlGnBu ramp is an adopted `d3.scaleSequential`, as `YlGnBu` is not one of the named schemes.',
  ],
  recreation: {
    code: `const industries = await plotData('industries');
const names = [...new Set(industries.map((d) => d.industry))].sort();   // fy sorts its domain
const bands = 7;
const step = d3.max(industries, (d) => d.unemployed) / bands;
const gap = step * 0.12;
const baseOf = (name) => (names.length - 1 - names.indexOf(name)) * (step + gap);
// One row per (band, industry, month); bands first, so higher bands paint on top.
const rows = d3.range(bands).flatMap((i) => industries.map((d) => ({
  key: d.industry + ' ' + i, band: i, date: d.date,
  y1: baseOf(d.industry), y2: baseOf(d.industry) + Math.max(0, Math.min(step, d.unemployed - i * step)),
})));

mount(Elicit({
  width: 460, height: 560,
  margins: { top: 4, right: 4, bottom: 4, left: 4 },
  axes: false,
  schema: {
    key: { type: 'categorical' }, band: { type: 'quantitative' }, date: { type: 'temporal' },
    y1: { type: 'quantitative', domain: [0, baseOf(names[0]) + step] }, y2: { type: 'quantitative' },
  },
  data: rows,
  guides: [
    guides.custom(({ scales, width }) => names.flatMap((n) => [
      { type: 'rect', x: 0, width, fill: 'none', stroke: 'currentColor', strokeWidth: 1,
        y: scales.y.encode(baseOf(n) + step), height: scales.y.encode(baseOf(n)) - scales.y.encode(baseOf(n) + step) },
      { type: 'text', text: n, x: 6, y: scales.y.encode(baseOf(n) + step) + 6, fontSize: 10,
        textAnchor: 'start', dominantBaseline: 'hanging', fill: 'currentColor' },
    ])),
  ],
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        series: { field: 'key' }, x: { field: 'date' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'band', scale: d3.scaleSequential([0, bands - 1], d3.interpolateYlGnBu) },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Watch it fold',
      question: 'Construction unemployment to the end of 2007 is shown. How did it move through 2008 and 2009?',
      try: 'Sweep across the right-hand part of the chart. The horizon strip above folds your line into bands as you draw.',
      why: 'The edit is an ordinary `edit.line.sweep()` on the unfolded line, with `lock` on the record. The horizon strip is a `guides.custom`: it reads the live rows on every render, so a guide can show a second encoding of the answer without being one more place the answer is stored.',
      uses: ['edit.line.sweep()', 'lock', 'guides.custom()'],
      code: `const industries = await plotData('industries');
const rows = industries.filter((d) => d.industry === 'Construction' && d.date < new Date('2010-01-01'))
  .map((d) => ({ date: d.date, unemployed: d.unemployed }));
const cut = new Date('2007-12-01');
const level = rows.find((d) => +d.date === +cut).unemployed;
const data = rows.map((d) => d.date <= cut ? d : { ...d, unemployed: level });
const bands = 4, step = 600, strip = 44;
const colour = d3.scaleSequential([0, bands - 1], d3.interpolateYlGnBu);

mount(Elicit({
  width: 460, height: 330,
  margins: { top: strip + 24, right: 16, bottom: 28, left: 44 },
  schema: {
    date:       { type: 'temporal' },
    unemployed: { type: 'quantitative', domain: [0, bands * step] },
  },
  data,
  lock: (d) => d.date <= cut,                         //! 2000–2007 is given
  axes: { y: { grid: true } },
  guides: [
    guides.custom(({ data, scales }) => d3.range(bands).map((i) => ({   //! the same rows, folded
      type: 'path', fill: colour(i), stroke: 'none',
      points: [
        ...data.map((d) => [scales.x.encode(d.date), -12 - (Math.max(0, Math.min(step, d.unemployed - i * step)) / step) * strip]),
        [scales.x.encode(data.at(-1).date), -12], [scales.x.encode(data[0].date), -12],
      ],
    }))),
  ],
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5, handleSize: 2,
      channels: { x: { field: 'date' }, y: { field: 'unemployed', edit: edit.line.sweep() } },   //! paint the free months
    }),
  ],
}));`,
    },
    {
      title: 'Sweep a band, fold its top',
      question: 'Construction unemployment to the end of 2007 is shown. For each month of 2008–2009, give a range you are 80% sure it fell in.',
      try: 'Press on the top edge of the band and sweep along it, then on the bottom edge. The horizon strip above folds your high edge, the worst case, into bands.',
      why: 'Each edge of the `areaY` span carries its own `edit.line.sweep()`, so the range is two strokes. The strip is a `guides.custom` over the live rows: it re-folds the `hi` column on every render and stores nothing, so the answer stays in one place.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'lock', 'guides.custom()'],
      code: `const industries = await plotData('industries');
const rows = industries.filter((d) => d.industry === 'Construction' && d.date < new Date('2010-01-01'));
const cut = new Date('2007-12-01');
const level = rows.find((d) => +d.date === +cut).unemployed;
const data = rows.map((d) => d.date <= cut
  ? { date: d.date, lo: d.unemployed, hi: d.unemployed }
  : { date: d.date, lo: level - 100, hi: level + 200 });
const bands = 4, step = 600, strip = 44;
const colour = d3.scaleSequential([0, bands - 1], d3.interpolateYlGnBu);

mount(Elicit({
  width: 460, height: 330,
  margins: { top: strip + 24, right: 16, bottom: 28, left: 44 },
  schema: {
    date: { type: 'temporal' },
    lo:   { type: 'quantitative', domain: [0, bands * step] },
    hi:   { type: 'quantitative', domain: [0, bands * step] },
  },
  data,
  lock: (d) => d.date <= cut,                         //! 2000–2007 is given
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { y: { grid: true } },
  guides: [
    guides.custom(({ data, scales }) => d3.range(bands).map((i) => ({   //! the high edge, folded
      type: 'path', fill: colour(i), stroke: 'none',
      points: [
        ...data.map((d) => [scales.x.encode(d.date), -12 - (Math.max(0, Math.min(step, d.hi - i * step)) / step) * strip]),
        [scales.x.encode(data.at(-1).date), -12], [scales.x.encode(data[0].date), -12],
      ],
    }))),
  ],
  marks: [
    areaY({
      fill: '#41b6c4', fillOpacity: 0.35, stroke: '#225ea8', handleSize: 2,
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the low edge
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the high edge
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-horizon',
  status: 'partial',
  verdict: 'Thirty-eight stations folded into five bands each, every band an `areaY` span clamped to one band and coloured on an ordinal Greens scale, with a legend for the band thresholds. Horizon folding is computed by hand, and faceting is not covered by this study, so the rows are a data-unit offset.',
  needs: ['horizon', 'facet', 'input-widgets'],
  prep: ['prep-calculate'],
  gaps: [
    'Band heights, `clamp(v − i·step, 0, step)`, are computed in JavaScript: `clip: true` confines marks to the plot, not each band to its own strip.',
    'Faceting is not covered by this study: rows are offset on one y scale and the station names are a `guides.custom` in the left margin rather than an fy axis with a halo.',
    'The band count is fixed at the input’s default of 5; the original’s range input is missing.',
  ],
  recreation: {
    code: `const traffic = await plotData('observablehq__plot-horizon', 'traffic.csv');
const names = [...new Set(traffic.map((d) => d.name))];
const bands = 5;
const step = +(d3.max(traffic, (d) => d.value) / bands).toPrecision(2);
const pitch = step * 1.08;
const baseOf = (name) => (names.length - 1 - names.indexOf(name)) * pitch;
const rows = d3.range(bands).flatMap((band) => d3.sort(traffic, (d) => d.date).map((d) => ({
  key: d.name + ' ' + band, band, date: d.date,
  y1: baseOf(d.name), y2: baseOf(d.name) + Math.max(0, Math.min(step, d.value - band * step)),
})));

mount(Elicit({
  width: 460, height: 620,
  margins: { top: 64, right: 4, bottom: 4, left: 110 },
  axes: { x: { anchor: 'top' }, y: false },
  schema: {
    key: { type: 'categorical' }, band: { type: 'ordinal', domain: d3.range(bands) },
    date: { type: 'temporal' },
    y1: { type: 'quantitative', domain: [0, baseOf(names[0]) + step] }, y2: { type: 'quantitative' },
  },
  data: rows,
  guides: [
    guides.custom(({ scales }) => names.map((n) => ({
      type: 'text', text: n, x: -6, y: scales.y.encode(baseOf(n) + step / 2), fontSize: 9,
      textAnchor: 'end', dominantBaseline: 'middle', fill: 'currentColor',
    }))),
  ],
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        series: { field: 'key' }, x: { field: 'date' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'band', scale: { scheme: 'greens' },
                legend: { anchor: 'top', title: 'Vehicles per hour', tickFormat: (i) => ((i + 1) * step).toLocaleString('en') } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place each peak',
      question: 'Monday’s traffic at six stations is shown as horizon strips. At what hour do you think each station is busiest on the following Saturday?',
      try: 'Drag each dot left or right along its station’s row. It snaps to whole hours.',
      why: 'One row per station, with `move()` on `x` only, so a drag can change the hour but never the station. `snap` rounds to whole hours. The Monday strips are a read-only `guides.custom`, folded into horizon bands from the same data the original uses.',
      uses: ["move({ channels: ['x'] })", 'snap()', 'clamp()', 'guides.custom()'],
      code: `const traffic = await plotData('observablehq__plot-horizon', 'traffic.csv');
const stations = ['Von der Heydt', 'Illingen', 'Köln-Nord', 'Unna', 'HB-Silbersee', 'Bad Schwartau'];
const monday = (name) => d3.sort(traffic.filter((d) => d.name === name && d.date < new Date('2016-01-05')), (d) => d.date)
  .map((d) => [d.date.getUTCHours(), d.value]);
const bands = 4, step = 2000;
const colour = d3.scaleOrdinal(d3.range(bands), d3.schemeGreens[5].slice(1));

mount(Elicit({
  width: 460, height: 360,
  margins: { top: 44, right: 16, bottom: 30, left: 96 },
  schema: {
    station: { type: 'categorical', domain: stations },
    hour:    { type: 'quantitative', domain: [0, 23] },
  },
  data: stations.map((station) => ({ station, hour: 12 })),
  constraints: [snap({ field: 'hour', step: 1 }), clamp({ field: 'hour' })],   //! whole hours in the day
  axes: { x: { tickFormat: (h) => h + ':00' } },
  guides: [
    guides.custom(({ scales }) => stations.flatMap((s) => {
      // Each strip sits just above its station's row, so it never covers the dot.
      const base = scales.y.encode(s) - 8, h = 28;
      return d3.range(bands).map((i) => ({
        type: 'path', fill: colour(i), stroke: 'none', curve: 'basis',
        points: [...monday(s).map(([hr, v]) => [scales.x.encode(hr), base - (Math.max(0, Math.min(step, v - i * step)) / step) * h]),
          [scales.x.encode(23), base], [scales.x.encode(0), base]],
      }));
    })),
  ],
  marks: [
    point({
      size: 7, fill: '#e8833a', stroke: 'white', strokeWidth: 1.5,
      channels: {
        y: { field: 'station' },
        x: { field: 'hour', edit: move({ channels: ['x'] }) },   //! the hour is the answer
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep Saturday’s range',
      question: 'Monday’s traffic at Köln-Nord is the grey line. On the following Saturday, between how many vehicles an hour will it run, hour by hour?',
      try: 'Press on the top edge of the green band and sweep along it, then on its bottom edge.',
      why: 'Each edge of the `areaY` span carries an `edit.line.sweep()`, so the busy and quiet bounds are separate strokes. Monday is a context table: drawn for comparison by a `lineY` with `table: "monday"`, and never part of `getData()`.',
      uses: ['edit.line.sweep()', 'areaY span (y1/y2)', 'ordering()', 'context table'],
      code: `const traffic = await plotData('observablehq__plot-horizon', 'traffic.csv');
const monday = d3.sort(traffic.filter((d) => d.name === 'Köln-Nord' && d.date < new Date('2016-01-05')), (d) => d.date)
  .map((d) => ({ hour: d.date.getUTCHours(), value: d.value }));

mount(Elicit({
  width: 460, height: 280,
  margins: { top: 16, right: 16, bottom: 28, left: 54 },
  schema: {
    data: {
      hour: { type: 'quantitative', domain: [0, 23] },
      lo:   { type: 'quantitative', domain: [0, 10000] },
      hi:   { type: 'quantitative', domain: [0, 10000] },
    },
    monday: { context: true, fields: { hour: { type: 'quantitative' }, value: { type: 'quantitative' } } },   //! for comparison only
  },
  data: { data: d3.range(24).map((hour) => ({ hour, lo: 1000, hi: 3000 })), monday },
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { x: { tickFormat: (h) => h + ':00' }, y: { grid: true, title: 'Vehicles per hour' } },
  marks: [
    lineY({ table: 'monday', stroke: '#94a3b8', strokeWidth: 2, curve: 'basis',
      channels: { x: { field: 'hour' }, y: { field: 'value' } } }),
    areaY({
      fill: '#74c476', fillOpacity: 0.4, stroke: '#238b45', curve: 'basis', handleSize: 3,
      channels: {
        x:  { field: 'hour' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the quietest you expect
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the busiest you expect
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-stacked-area-chart',
  status: 'full',
  verdict: 'Fourteen industries stacked as `areaY` spans (`y1`/`y2` from `d3.stack`), coloured by industry, with a zero rule.',
  needs: [],
  prep: ['prep-stack'],
  gaps: [
    '`areaY` has no stack option of its own (only `bar` stacks), so the stack is computed with `d3.stack` in input order.',
    'Plot’s `title` channel becomes a tip read from an invisible `rect` per (industry, month), because an area path is one node per series and has no row to show. The tip adds the month and the count to the industry name.',
    'The y title runs along the axis rather than sitting flat above it with Plot’s ↑ arrow.',
  ],
  recreation: {
    code: `const unemployment = await plotData('observablehq__plot-stacked-area-chart', 'unemployment.csv');
const names = [...new Set(unemployment.map((d) => d.industry))];
const byDate = d3.index(unemployment, (d) => +d.date, (d) => d.industry);
const dates = d3.sort([...byDate.keys()]);
const layers = d3.stack().keys(names).value((t, k) => byDate.get(t).get(k).unemployed)(dates);
const rows = layers.flatMap((layer) => layer.map((p, j) => ({
  industry: layer.key, date: new Date(p.data), until: new Date(dates[j + 1] ?? p.data), y1: p[0], y2: p[1],
})));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 16, right: 16, bottom: 28, left: 62 },
  schema: {
    industry: { type: 'categorical', domain: names },
    date: { type: 'temporal' }, until: { type: 'temporal' },
    y1: { type: 'quantitative' }, y2: { type: 'quantitative' },
  },
  data: rows,
  axes: { y: { grid: true, title: 'Unemployed (thousands)' } },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeWidth: 1, strokeDash: 'none' })],
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        series: { field: 'industry' }, x: { field: 'date' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'industry', scale: { scheme: 'tableau10' } },
      },
    }),
    // The hover target: one invisible strip per (industry, month), carrying the tip.
    rect({
      opacity: 0,
      tip: { text: (d) => [d.industry, \`\${d3.utcFormat('%b %Y')(d.date)}: \${Math.round(d.y2 - d.y1)}k\`] },
      channels: { x1: { field: 'date' }, x2: { field: 'until' }, y1: { field: 'y1' }, y2: { field: 'y2' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Total first, then split',
      question: 'Unemployment in three industries to 2006 is shown as a stack. How did it change from 2007 to 2009: first the total, then how it divides?',
      try: 'Step 1: sweep the top edge. Press Next, then drag near the middle boundary; Next again, the lowest boundary.',
      why: 'The rows hold the three stack boundaries, and each step’s edit carries a `stage`: a `sweep` on the top edge, then a nearest-pick `move()` on each inner edge in turn. `ordering` holds the boundaries in order, so lowering the total pushes the inner edges down with it.',
      uses: ['edit.line.sweep()', "move({ pick: 'nearest' })", 'stage', 'ordering()', 'lock'],
      code: `const unemployment = await plotData('observablehq__plot-stacked-area-chart', 'unemployment.csv');
const keys = ['Wholesale and Retail Trade', 'Manufacturing', 'Construction'];
const yearly = d3.rollup(unemployment.filter((d) => keys.includes(d.industry) && d.date < new Date('2010-01-01')),
  (v) => d3.mean(v, (d) => d.unemployed), (d) => d.date.getUTCFullYear(), (d) => d.industry);
// Cumulative boundaries b1 < b2 < b3 per year; 2007–2009 start at the 2006 stack.
const boundaries = (y) => { const m = yearly.get(y); const a = m.get(keys[0]), b = a + m.get(keys[1]); return { b1: Math.round(a), b2: Math.round(b), b3: Math.round(b + m.get(keys[2])) }; };
const data = d3.range(2000, 2010).map((year) => ({ year, ...boundaries(Math.min(year, 2006)) }));
const fills = ['#4e79a7', '#f28e2c', '#e15759'];
const band = (lo, hi, k) => areaY({ fill: fills[k], fillOpacity: 0.8, stroke: 'none',
  channels: { x: { field: 'year' }, y1: lo ? { field: lo } : { datum: 0 }, y2: { field: hi } } });
const edge = (field, edit) => lineY({ stroke: 'currentColor', strokeWidth: 1.5, handleSize: 2.5,
  channels: { x: { field: 'year' }, y: { field, edit } } });

const chart = mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 110, bottom: 28, left: 44 },
  stageLabels: ['total', 'split 1', 'split 2'],
  schema: {
    year: { type: 'quantitative', domain: [2000, 2009] },
    b1: { type: 'quantitative', domain: [0, 5000] }, b2: { type: 'quantitative', domain: [0, 5000] },
    b3: { type: 'quantitative', domain: [0, 5000] },
  },
  data,
  lock: (d) => d.year <= 2006,
  constraints: [ordering({ field: ['b1', 'b2', 'b3'] })],   //! boundaries never cross
  axes: { x: { tickFormat: 'd' }, y: { grid: true } },
  guides: [
    guides.custom(({ data, scales }) => {
      const last = data.at(-1);
      return ['Wholesale & retail', 'Manufacturing', 'Construction'].map((k, i) => ({ type: 'text', text: k, fontSize: 10, textAnchor: 'start', fill: fills[i],
        x: scales.x.encode(last.year) + 6, y: scales.y.encode(((i ? last['b' + i] : 0) + last['b' + (i + 1)]) / 2) }));
    }),
  ],
  marks: [
    band(null, 'b1', 0), band('b1', 'b2', 1), band('b2', 'b3', 2),
    edge('b3', edit.line.sweep({ stage: 0 })),                    //! step 1: the total
    edge('b2', move({ pick: 'nearest', stage: 1 })),              //! step 2: the middle boundary
    edge('b1', move({ pick: 'nearest', stage: 2 })),              //! step 3: the lowest boundary
  ],
}));
const btn = mount(document.createElement('button'));
const label = () => { btn.textContent = chart.getStage() < 2 ? 'Next' : 'Done'; btn.disabled = chart.getStage() >= 2; };
btn.onclick = () => { chart.nextStage(); label(); };
label();`,
    },
    {
      title: 'Sweep a band on the stack',
      question: 'The three industries are stacked to 2006. How high will their combined unemployment run from 2007 to 2009? Give a range you are 80% sure of.',
      try: 'Press on the top edge of the orange band and sweep along it, then on its bottom edge.',
      why: 'The stack is a context table, drawn by three `areaY` marks with `table: "history"` and never reported. The elicited table is just the total’s range: one `areaY` from `y1: lo` to `y2: hi`, with an `edit.line.sweep()` on each edge. `lock` pins 2006, so the band opens out of the stack’s top.',
      uses: ['edit.line.sweep()', 'context table', 'ordering()', 'lock'],
      code: `const unemployment = await plotData('observablehq__plot-stacked-area-chart', 'unemployment.csv');
const keys = ['Wholesale and Retail Trade', 'Manufacturing', 'Construction'];
const yearly = d3.rollup(unemployment.filter((d) => keys.includes(d.industry) && d.date < new Date('2007-01-01')),
  (v) => d3.mean(v, (d) => d.unemployed), (d) => d.date.getUTCFullYear(), (d) => d.industry);
const years = d3.range(2000, 2007);
// The stack: one row per (industry, year) with its lower and upper bound.
const stack = d3.stack().keys(keys).value((y, k) => yearly.get(y).get(k))(years)
  .flatMap((layer) => layer.map((p, j) => ({ industry: layer.key, year: years[j], y1: Math.round(p[0]), y2: Math.round(p[1]) })));
const total = stack.filter((d) => d.year === 2006 && d.industry === keys.at(-1))[0].y2;

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 16, right: 16, bottom: 28, left: 62 },
  schema: {
    data: {
      year: { type: 'quantitative', domain: [2000, 2009] },
      lo:   { type: 'quantitative', domain: [0, 6000] },
      hi:   { type: 'quantitative', domain: [0, 6000] },
    },
    history: { context: true, fields: {                       //! the stack: drawn, never reported
      industry: { type: 'categorical', domain: keys }, year: { type: 'quantitative' },
      y1: { type: 'quantitative' }, y2: { type: 'quantitative' } } },
  },
  data: {
    data: d3.range(2006, 2010).map((year) => year === 2006 ? { year, lo: total, hi: total } : { year, lo: total - 300, hi: total + 300 }),
    history: stack,
  },
  lock: (d) => d.year === 2006,                       //! the band starts at the stack's top
  constraints: [ordering({ field: ['lo', 'hi'] })],
  axes: { x: { tickFormat: 'd' }, y: { grid: true, title: 'Unemployed (thousands)' } },
  marks: [
    areaY({ table: 'history', stroke: 'none', fillOpacity: 0.85,
      channels: { series: { field: 'industry' }, x: { field: 'year' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'industry', scale: { scheme: 'tableau10' }, legend: { anchor: 'top' } } } }),
    areaY({
      fill: '#e8833a', fillOpacity: 0.3, stroke: '#e8833a', handleSize: 3.5,
      channels: {
        x:  { field: 'year' },
        y1: { field: 'lo', edit: edit.line.sweep() },   //! the low edge of the total
        y2: { field: 'hi', edit: edit.line.sweep() },   //! the high edge of the total
      },
    }),
  ],
}));`,
    },
  ],
});
