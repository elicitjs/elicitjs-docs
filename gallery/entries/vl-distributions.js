// Gallery entries — Vega-Lite "Histograms, Density Plots, and Dot Plots",
// "Circular Plots", "Box Plots" and "Error Bars & Error Bands". See AUTHORING.md.

// ───────────────────────────────────────────────────────────── histograms

GALLERY.add({
  id: 'vl-histogram',
  status: 'full',
  verdict: 'A `rectY` over pre-binned counts draws the histogram; binning happens in `d3.bin` first.',
  prep: ['prep-bin'],
  gaps: ['Vega-Lite bins and counts inside the spec; here `d3.bin` does it before `Elicit`.'],
  recreation: { code: `const movies = await vegaData('movies.json');
const ratings = movies.map((d) => d['IMDB Rating']).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(2, 10))(ratings);
const data = bins.map((b) => ({ x1: b.x0, x2: b.x1, count: b.length }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 56 },
  axes: { x: { title: 'IMDB Rating (binned)' }, y: { title: 'Count of Records' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [1, 10] },
    x2: { type: 'quantitative', domain: [1, 10] },
    count: { type: 'quantitative', domain: [0, 1000] },
  },
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'count' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Paint the bins',
      question: 'Out of 100 films released next year, how many will land in each IMDB rating band?',
      try: 'Press anywhere and sweep left to right; each bar takes the height of the pointer as you cross it.',
      why: 'A `sweep` pick re-targets the bar under the pointer on every drag event, so one stroke paints the whole histogram. `clamp` keeps every count between 0 and 40.',
      uses: ["move({ pick: 'sweep' })", 'rectY', 'clamp()'],
      code: `const data = d3.range(1, 10).map((r) => ({ x1: r, x2: r + 1, count: 5 }));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 36, left: 52 },
  axes: { x: { title: 'IMDB rating' }, y: { title: 'films' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [1, 10] },
    x2: { type: 'quantitative', domain: [1, 10] },
    count: { type: 'quantitative', domain: [0, 40] },
  },
  constraints: [ clamp({ field: 'count', min: 0, max: 40 }) ], //! counts stay in range
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' },
        y: { field: 'count', edit: move({ pick: 'sweep' }) }, //! one stroke paints every bar
      },
    }),
  ],
}));`,
    },
    {
      title: 'Drop probability chips',
      question: 'Pick a film at random from the catalogue. Spread 20 chips over where its IMDB rating will fall.',
      try: 'Hover a rating to preview a chip, click to drop it; Alt-click a chip to take it back.',
      why: 'Each row of a `dotStack` is one token, so the belief is the count per bin. A `probe` create previews the drop under the pointer and commits on click; `count` caps the budget at 20 chips.',
      uses: ['dotStack', "create({ pick: 'probe' })", "remove({ pick: 'nearest' })", 'count()'],
      code: `const bins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 12, bottom: 32, left: 12 },
  axes: { x: { title: 'IMDB rating' }, y: false },
  data: [{ bin: 6 }, { bin: 7 }],
  schema: { bin: { type: 'ordinal', domain: bins } },
  scales: { x: { type: 'point' } },
  constraints: [ count({ max: 20, strategy: 'reject' }) ], //! a 20-chip budget
  marks: [
    dotStack({
      fill: '#4c78a8', label: true,
      channels: { x: { field: 'bin' } },
      edits: [
        create({ pick: 'probe', channels: ['x'], advance: false, when: when.noAlt }), //! hover previews, click drops
        remove({ pick: 'nearest', when: when.alt }), //! Alt-click takes one back
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-bar_binned_data',
  status: 'full',
  verdict: 'Already-binned rows (`bin_start`, `bin_end`, `count`) map straight onto a `rectY` span.',
  gaps: ['The x axis ticks every 5 rather than at the bin edges.'],
  recreation: { code: `const data = [
  { bin_start: 8, bin_end: 10, count: 7 }, { bin_start: 10, bin_end: 12, count: 29 },
  { bin_start: 12, bin_end: 14, count: 71 }, { bin_start: 14, bin_end: 16, count: 127 },
  { bin_start: 16, bin_end: 18, count: 94 }, { bin_start: 18, bin_end: 20, count: 54 },
  { bin_start: 20, bin_end: 22, count: 17 }, { bin_start: 22, bin_end: 24, count: 5 },
];

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 52 },
  axes: { x: { title: 'bin_start' }, y: { title: 'count' } },
  data,
  schema: {
    bin_start: { type: 'quantitative', domain: [8, 24] },
    bin_end: { type: 'quantitative', domain: [8, 24] },
    count: { type: 'quantitative', domain: [0, 140] },
  },
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: { x1: { field: 'bin_start' }, x2: { field: 'bin_end' }, y: { field: 'count' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Share out 100%',
      question: 'These are last batch’s 404 measurements. What percentage of the next batch will fall in each bin?',
      try: 'Drag a bar up or down. When the 100% is used up, a bar can only grow once another shrinks.',
      why: '`maintainSum` with `strategy: \'cap\'` stops the bars summing past 100, and `guides.remaining` reads the same budget off the constraint to show what is left to place.',
      uses: ['move()', 'maintainSum()', 'clamp()', 'guides.remaining()'],
      code: `const edges = [8, 10, 12, 14, 16, 18, 20, 22];
const data = edges.map((s) => ({ bin_start: s, bin_end: s + 2, pct: 8 }));

mount(Elicit({
  width: 400, height: 280,
  margins: { top: 30, right: 12, bottom: 36, left: 40 },
  axes: { x: { title: 'measurement' }, y: { tickFormat: (v) => v + '%' } },
  data,
  schema: {
    bin_start: { type: 'quantitative', domain: [8, 24] },
    bin_end: { type: 'quantitative', domain: [8, 24] },
    pct: { type: 'quantitative', domain: [0, 50] },
  },
  constraints: [
    clamp({ field: 'pct', min: 0 }),
    maintainSum({ field: 'pct', total: 100, strategy: 'cap' }), //! the bins share 100%
  ],
  guides: [ guides.remaining({ field: 'pct', unit: '%' }) ], //! what is left to place
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: {
        x1: { field: 'bin_start' }, x2: { field: 'bin_end' },
        y: { field: 'pct', edit: move() },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-histogram_log',
  status: 'full',
  verdict: 'Bins computed on log10(x) in JS, then drawn as a `rectY` span on a `log` x scale.',
  prep: ['prep-calculate', 'prep-bin'],
  gaps: ['Binning on the logged values is done in `d3.bin` before `Elicit`.'],
  recreation: { code: `const xs = [0.01, 0.1, 1, 1, 1, 1, 10, 10, 100, 500, 800];
const bins = d3.bin().domain([-2, 3]).thresholds(d3.range(-1.5, 3, 0.5))(xs.map(Math.log10));
const data = bins.map((b) => ({ x1: 10 ** b.x0, x2: 10 ** b.x1, count: b.length }));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 16, bottom: 36, left: 48 },
  axes: { x: { title: 'x1, x2', ticks: 5, tickFormat: d3.format(',~g') }, y: { title: 'Count of Records' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [0.01, 1000] },
    x2: { type: 'quantitative', domain: [0.01, 1000] },
    count: { type: 'quantitative', domain: [0, 4] },
  },
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: {
        x1: { field: 'x1', scale: 'log' },
        x2: { field: 'x2' },
        y: { field: 'count' },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Brush a range',
      question: 'The values above span five orders of magnitude. Between what two values will 80% of the next measurements fall?',
      try: 'Drag either end of the bar to move that bound; drag the middle to slide the whole range.',
      why: '`brushSpan` edits the `x1`/`x2` pair of one row: the ends move a bound, the body moves both. Both invert through the `log` scale, so equal drags are equal ratios.',
      uses: ['brushSpan()', "scale: 'log'", 'ordering()'],
      code: `mount(Elicit({
  width: 420, height: 180,
  margins: { top: 16, right: 16, bottom: 36, left: 70 },
  axes: { x: { title: 'value (log scale)', tickFormat: d3.format(',~g') } },
  data: [{ q: '80% range', lo: 0.5, hi: 50 }],
  schema: {
    q: { type: 'categorical', domain: ['80% range'] },
    lo: { type: 'quantitative', domain: [0.01, 1000] },
    hi: { type: 'quantitative', domain: [0.01, 1000] },
  },
  constraints: [ ordering({ field: ['lo', 'hi'] }) ], //! low bound stays below high
  marks: [
    barX({
      fill: '#4c78a8', fillOpacity: 0.7,
      channels: {
        y: { field: 'q' },
        x1: { field: 'lo', scale: 'log' }, //! every edit inverts through the log scale
        x2: { field: 'hi' },
      },
      edits: [ brushSpan({ channels: ['x1', 'x2'], edgeInset: 10, guide: true }) ], //! ends and body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-histogram_nonlinear',
  status: 'full',
  verdict: 'Bars span uneven bins on a point scale with formatted fps labels, under the chart `title`.',
  gaps: [
    'Tick labels convert ms to fps with a `tickFormat` function rather than a label expression.',
  ],
  recreation: { code: `const data = [
  { startTime: '0', endTime: '8.33', residency: 0 },
  { startTime: '8.33', endTime: '12.50', residency: 0 },
  { startTime: '12.50', endTime: '16.67', residency: 31.17 },
  { startTime: '16.67', endTime: '33.33', residency: 38.96 },
  { startTime: '33.33', endTime: '50.00', residency: 6.49 },
  { startTime: '50.00', endTime: '66.67', residency: 2.9 },
  { startTime: '66.67', endTime: '83.33', residency: 2.6 },
  { startTime: '83.33', endTime: '∞', residency: 16.88 },
];
const edges = ['0', '8.33', '12.50', '16.67', '33.33', '50.00', '66.67', '83.33', '∞'];
const fps = (v) => (v === '∞' ? '0' : v === '0' ? '∞' : d3.format('d')(1000 / v));

mount(Elicit({
  width: 360, height: 180,
  margins: { top: 12, right: 12, bottom: 28, left: 44 },
  title: 'Distribution of Frame Render Time (fps)',
  axes: { x: { tickFormat: fps }, y: { tickFormat: (v) => v + '%', ticks: 5 } },
  data,
  schema: {
    startTime: { type: 'ordinal', domain: edges.slice(0, -1) },
    endTime: { type: 'ordinal', domain: edges.slice(1) },
    residency: { type: 'quantitative', domain: [0, 100] },
  },
  scales: { x: { type: 'point', padding: 0 } },
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: { x1: { field: 'startTime' }, x2: { field: 'endTime' }, y: { field: 'residency' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Rebalance the frames',
      question: 'After a graphics-driver update, what share of frames will render in each fps band?',
      try: 'Drag a bar; the other bars give way so the total stays at 100%.',
      why: '`maintainSum` with `strategy: \'redistribute\'` takes the change out of every other bar in proportion, so the residencies always sum to 100. The seed is the measured profile.',
      uses: ['move()', "maintainSum({ strategy: 'redistribute' })", 'clamp()'],
      code: `const edges = ['0', '8.33', '12.50', '16.67', '33.33', '50.00', '66.67', '83.33', '∞'];
const seed = [0, 0, 31.17, 38.96, 6.49, 2.9, 2.6, 16.88];
const data = seed.map((r, i) => ({ startTime: edges[i], endTime: edges[i + 1], residency: r }));
const fps = (v) => (v === '∞' ? '0' : v === '0' ? '∞' : d3.format('d')(1000 / v));

mount(Elicit({
  width: 360, height: 200,
  margins: { top: 12, right: 12, bottom: 28, left: 44 },
  axes: { x: { tickFormat: fps }, y: { tickFormat: (v) => v + '%', ticks: 5 } },
  data,
  schema: {
    startTime: { type: 'ordinal', domain: edges.slice(0, -1) },
    endTime: { type: 'ordinal', domain: edges.slice(1) },
    residency: { type: 'quantitative', domain: [0, 100] },
  },
  scales: { x: { type: 'point', padding: 0 } },
  constraints: [
    clamp({ field: 'residency', min: 0, max: 100 }),
    maintainSum({ field: 'residency', total: 100, strategy: 'redistribute' }), //! the rest give way
  ],
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      channels: {
        x1: { field: 'startTime' }, x2: { field: 'endTime' },
        y: { field: 'residency', edit: move({ guide: true }) }, //! drag a residency
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-histogram_rel_freq',
  status: 'full',
  verdict: 'Horsepower is binned and divided by the total in JS, then drawn as a `rectY` with a percent axis.',
  prep: ['prep-bin', 'prep-aggregate', 'prep-calculate'],
  gaps: ['The tooltip shows the bin and its share rather than every column of the binned row.'],
  recreation: { code: `const cars = await vegaData('cars.json');
const hp = cars.map((d) => d.Horsepower).filter((v) => v != null);
const bins = d3.bin().domain([40, 240]).thresholds(d3.range(60, 240, 20))(hp);
const data = bins.map((b) => ({ x1: b.x0, x2: b.x1, share: b.length / hp.length }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: {
    x: { title: 'Horsepower' },
    y: { title: 'Relative Frequency', tickFormat: d3.format('.1~%') },
  },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [40, 240] },
    x2: { type: 'quantitative', domain: [40, 240] },
    share: { type: 'quantitative', domain: [0, 0.3] },
  },
  marks: [
    rectY({
      fill: '#4c78a8', stroke: '#fff',
      tip: (d) => ['Horsepower: ' + d.x1 + '–' + d.x2, 'Relative Frequency: ' + d3.format('.1%')(d.share)],
      channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'share' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Fill the cells',
      question: 'Of the cars sold in 2030, what fraction will fall in each horsepower band? Each square is 2%.',
      try: 'Drag up a column to fill it, or click a square to fill up to it.',
      why: 'A `waffleY` column per bin makes a relative frequency countable: `unit: 0.02` makes one cell 2%, and `edit.waffle.fill` sets the count to the cell under the pointer. `maintainSum` keeps the columns summing to 1, and `tip` reads the share back on hover without blocking the drag.',
      uses: ['waffleY', 'edit.waffle.fill()', 'maintainSum()', 'tip'],
      code: `const bands = ['<75', '75–100', '100–125', '125–150', '150–200', '200+'];
const data = bands.map((band) => ({ band, share: 0.1 }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 30, right: 12, bottom: 36, left: 12 },
  axes: { x: { title: 'Horsepower' }, y: false },
  data,
  schema: {
    band: { type: 'ordinal', domain: bands },
    share: { type: 'quantitative', domain: [0, 0.5] },
  },
  scales: { x: { type: 'band' } },
  constraints: [ maintainSum({ field: 'share', total: 1, strategy: 'cap' }) ], //! shares sum to 1
  guides: [ guides.remaining({ field: 'share', label: (left) => d3.format('.0%')(left) + ' left' }) ],
  marks: [
    waffleY({
      fill: '#4c78a8', unit: 0.02, //! one square = 2%
      tip: (d) => d.band + ' hp: ' + d3.format('.0%')(d.share), //! hover reads the share
      channels: {
        x: { field: 'band' },
        count: { field: 'share', edit: edit.waffle.fill() }, //! drag to fill a column
      },
      edits: [ edit.waffle.fill({ channels: ['count'], gesture: 'click' }) ],
    }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── densities

GALLERY.add({
  id: 'vl-area_density',
  status: 'full',
  verdict: 'A Gaussian kernel density computed in JS, drawn as an `areaY`.',
  prep: ['prep-density'],
  gaps: ['The density transform (bandwidth 0.3) runs in JS before `Elicit`.'],
  recreation: { code: `const movies = await vegaData('movies.json');
const xs = movies.map((d) => d['IMDB Rating']).filter((v) => v != null);
const bw = 0.3;
const kernel = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
const [lo, hi] = d3.extent(xs);
const data = d3.range(lo, hi + 1e-9, (hi - lo) / 120).map((value) => ({
  value, density: d3.mean(xs, (v) => kernel((value - v) / bw)) / bw,
}));

mount(Elicit({
  width: 440, height: 150,
  margins: { top: 10, right: 12, bottom: 34, left: 48 },
  axes: { x: { title: 'IMDB Rating' }, y: { title: 'density', ticks: 3 } },
  data,
  schema: {
    value: { type: 'quantitative', domain: [1, 10] },
    density: { type: 'quantitative', domain: [0, 0.4] },
  },
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 1, strokeWidth: 0,
      channels: { x: { field: 'value' }, y: { field: 'density' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Sweep a density',
      question: 'Sketch how IMDB ratings will be spread across next year’s horror films.',
      try: 'Press near the curve and sweep across; the curve follows the pointer as it passes each point.',
      why: 'The curve is 19 rows of `rating` → `density`. A `sweep` pick paints every point the pointer crosses in one stroke, and `clamp` keeps the density non-negative.',
      uses: ["move({ pick: 'sweep' })", 'areaY', 'clamp()'],
      code: `const data = d3.range(1, 10.01, 0.5).map((rating) => ({ rating, density: 0.05 }));

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 12, right: 12, bottom: 34, left: 36 },
  axes: { x: { title: 'IMDB rating' }, y: { ticks: 4 } },
  data,
  schema: {
    rating: { type: 'quantitative', domain: [1, 10] },
    density: { type: 'quantitative', domain: [0, 0.6] },
  },
  constraints: [ clamp({ field: 'density', min: 0 }) ], //! no negative density
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 0.6, stroke: '#4c78a8', curve: 'basis',
      handleSize: 3,
      channels: {
        x: { field: 'rating' },
        y: { field: 'density', edit: move({ pick: 'sweep' }) }, //! paint the curve in one stroke
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep a band',
      question: 'You are unsure how next year’s horror films will be rated. At each rating, sketch the lowest and the highest density you find plausible.',
      try: 'Press near the lower edge and sweep across to paint it; then do the same for the upper edge.',
      why: 'The band is an `areaY` between `lo` and `hi`, with `edit.line.sweep()` on both edges. A sweep locks onto the edge whose handle is nearest at dragstart and paints that edge alone, so each stroke draws one bound. `ordering` stops the edges crossing.',
      uses: ['edit.line.sweep()', 'areaY y1/y2', 'ordering()', 'clamp()'],
      code: `const data = d3.range(1, 10.01, 0.5).map((rating) => ({ rating, lo: 0.02, hi: 0.12 }));

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 12, right: 12, bottom: 34, left: 48 },
  axes: { x: { title: 'IMDB rating' }, y: { title: 'density', ticks: 4 } },
  data,
  schema: {
    rating: { type: 'quantitative', domain: [1, 10] },
    lo: { type: 'quantitative', domain: [0, 0.6] },
    hi: { type: 'quantitative', domain: [0, 0.6] },
  },
  constraints: [
    ordering({ field: ['lo', 'hi'] }), //! the edges never cross
    clamp({ field: ['lo', 'hi'], min: 0 }),
  ],
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 0.35, stroke: '#4c78a8', curve: 'basis', handleSize: 3,
      channels: {
        x: { field: 'rating' },
        y1: { field: 'lo', edit: edit.line.sweep() }, //! sweep the lower edge…
        y2: { field: 'hi', edit: edit.line.sweep() }, //! …or the upper one
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-area_density_stacked',
  status: 'partial',
  verdict: 'Per-species kernel densities stacked in JS and drawn as `areaY` bands (`y1`/`y2`) coloured by species, under the chart `title`; `area` has no stack layout of its own.',
  needs: ['stack-offset'],
  prep: ['prep-density', 'prep-stack'],
  gaps: [
    'The densities and the zero-based stack are computed in JS; `areaY` draws the precomputed `y1`/`y2` bands (there is no `stack` option on `area`, as there is on `bar`).',
  ],
  recreation: { code: `const penguins = (await vegaData('penguins.json')).filter((d) => d['Body Mass (g)'] != null);
const species = ['Adelie', 'Chinstrap', 'Gentoo'];
const masses = d3.range(2500, 6501, 50);
const kernel = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
const dens = species.map((s) => {
  const obs = penguins.filter((d) => d.Species === s).map((d) => d['Body Mass (g)']);
  const bw = 1.06 * d3.deviation(obs) * obs.length ** -0.2; // Scott's rule
  return masses.map((x) => d3.mean(obs, (v) => kernel((x - v) / bw)) / bw);
});
const data = [];
masses.forEach((x, i) => {
  let base = 0;
  // Vega-Lite stacks the last species at the bottom.
  [...species].reverse().forEach((s) => {
    const k = species.indexOf(s);
    data.push({ species: s, mass: x, lo: base, hi: base + dens[k][i] });
    base += dens[k][i];
  });
});
const top = d3.max(data, (d) => d.hi);

mount(Elicit({
  width: 440, height: 180,
  margins: { top: 10, right: 12, bottom: 34, left: 64 },
  title: 'Distribution of Body Mass of Penguins',
  axes: { x: { title: 'Body Mass (g)' }, y: { title: 'density', ticks: 3 } },
  legends: { fill: { anchor: 'right', title: 'Species', labelWidth: 60 } },
  data,
  schema: {
    species: { type: 'categorical', domain: species },
    mass: { type: 'quantitative', domain: [2500, 6500] },
    lo: { type: 'quantitative', domain: [0, top] },
    hi: { type: 'quantitative', domain: [0, top] },
  },
  marks: [
    areaY({
      fillOpacity: 1, strokeWidth: 0,
      channels: {
        x: { field: 'mass' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'species' }, series: { field: 'species' },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Draw the third species',
      question: 'You know the Adelie and Chinstrap body masses. Sketch where Gentoo penguins’ masses lie.',
      try: 'Press on the flat Gentoo curve and sweep across. The other two species are fixed.',
      why: 'The two observed species are a context table: drawn by their own `areaY`, never edited and never part of the answer. The answer is the Gentoo rows alone, so the `sweep` has one series to paint.',
      uses: ["move({ pick: 'sweep' })", 'context table', 'series'],
      code: `const penguins = (await vegaData('penguins.json')).filter((d) => d['Body Mass (g)'] != null);
const masses = d3.range(2500, 6501, 250);
const kernel = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
const kde = (s) => {
  const obs = penguins.filter((d) => d.Species === s).map((d) => d['Body Mass (g)']);
  const bw = 1.06 * d3.deviation(obs) * obs.length ** -0.2;
  return masses.map((x) => d3.mean(obs, (v) => kernel((x - v) / bw)) / bw);
};
const observed = ['Adelie', 'Chinstrap'].flatMap((s) => kde(s).map((d, i) => ({ species: s, mass: masses[i], density: d })));
const gentoo = masses.map((mass) => ({ species: 'Gentoo', mass, density: 0.0001 }));
const fields = {
  species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  mass: { type: 'quantitative', domain: [2500, 6500] },
  density: { type: 'quantitative', domain: [0, 0.0012] },
};

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 12, right: 12, bottom: 34, left: 64 },
  axes: { x: { title: 'Body Mass (g)' }, y: { title: 'density', ticks: 3 } },
  legends: { fill: { anchor: 'right', labelWidth: 60 } },
  schema: { data: fields, observed: { context: true, fields } }, //! the observed species are context
  data: { data: gentoo, observed },
  constraints: [ clamp({ field: 'density', min: 0 }) ],
  marks: [
    areaY({
      table: 'observed', fillOpacity: 0.45,
      channels: {
        x: { field: 'mass' }, y: { field: 'density' },
        fill: { field: 'species' }, stroke: { field: 'species' }, series: { field: 'species' },
      },
    }),
    areaY({
      fillOpacity: 0.45, handleSize: 3,
      channels: {
        x: { field: 'mass' },
        y: { field: 'density', edit: move({ pick: 'sweep' }) }, //! paint the free series
        fill: { field: 'species' }, stroke: { field: 'species' },
        series: { field: 'species' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_binned',
  status: 'full',
  verdict: 'Movies binned on both ratings in JS; a `point` per non-empty cell, its radius a `sqrt` scale of the count.',
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: ['The axes tick at round values rather than at bin edges.'],
  recreation: { code: `const movies = (await vegaData('movies.json'))
  .filter((d) => d['IMDB Rating'] != null && d['Rotten Tomatoes Rating'] != null);
const cells = d3.rollups(movies, (v) => v.length,
  (d) => Math.floor(d['IMDB Rating']) + 0.5, (d) => Math.min(90, Math.floor(d['Rotten Tomatoes Rating'] / 10) * 10) + 5);
const data = cells.flatMap(([imdb, ys]) => ys.map(([rt, n]) => ({ imdb, rt, n })));

mount(Elicit({
  width: 440, height: 320,
  margins: { top: 12, right: 12, bottom: 36, left: 52 },
  axes: { x: { title: 'IMDB Rating (binned)' }, y: { title: 'Rotten Tomatoes Rating (binned)' } },
  legends: { size: { anchor: 'right', title: 'Count of Records' } },
  data,
  schema: {
    imdb: { type: 'quantitative', domain: [1, 10] },
    rt: { type: 'quantitative', domain: [0, 100] },
    n: { type: 'quantitative', domain: [0, 260] },
  },
  marks: [
    point({
      fill: '#4c78a8',
      channels: {
        x: { field: 'imdb' }, y: { field: 'rt' },
        size: { field: 'n', scale: { type: 'sqrt', range: [0, 14] } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Grow each cell',
      question: 'For 100 films reviewed next year, how many will fall in each pairing of IMDB and Rotten Tomatoes ratings?',
      try: 'Drag a circle up to grow it, down to shrink it.',
      why: 'A relative `slide` on `size` turns vertical drag distance into a count, wherever you grab. The size legend reads the same `sqrt` scale, and `maintainSum` caps the films at 100.',
      uses: ["slide({ axis: 'y' })", 'legendSize', 'maintainSum()'],
      code: `const imdb = ['low (<5)', 'mid (5–7)', 'high (7+)'];
const rt = ['rotten (<40%)', 'mixed', 'fresh (70%+)'];
const data = imdb.flatMap((i) => rt.map((r) => ({ imdb: i, rt: r, n: 11 })));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 110, bottom: 36, left: 96 },
  axes: { x: { title: 'IMDB' } },
  legends: { size: { anchor: 'right', title: 'films' } },
  data,
  schema: {
    imdb: { type: 'ordinal', domain: imdb },
    rt: { type: 'ordinal', domain: rt },
    n: { type: 'quantitative', domain: [0, 60] },
  },
  constraints: [ clamp({ field: 'n', min: 0 }), maintainSum({ field: 'n', total: 100, strategy: 'cap' }) ], //! 100 films in all
  marks: [
    point({
      fill: '#4c78a8', fillOpacity: 0.8,
      channels: {
        x: { field: 'imdb' }, y: { field: 'rt' },
        size: { field: 'n', scale: { type: 'sqrt', range: [0, 28] },
                edit: slide({ axis: 'y', increase: 'up', extent: 150 }) }, //! drag up = more films
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-rect_binned_heatmap',
  status: 'full',
  verdict: 'A 2-D binned count in JS, drawn as `rect` cells with `x1`/`x2`/`y1`/`y2` spans and a sequential `fill` ramp.',
  prep: ['prep-bin', 'prep-aggregate'],
  gaps: ['Bin steps (0.2 IMDB × 5 RT) are fixed by hand rather than chosen from `maxbins`.', 'There is no named `YlGnBu` scheme, so the `fill` adopts a `d3.scaleSequential` over `d3.interpolateYlGnBu`.'],
  recreation: { code: `const movies = (await vegaData('movies.json'))
  .filter((d) => d['IMDB Rating'] != null && d['Rotten Tomatoes Rating'] != null);
const cells = d3.rollups(movies, (v) => v.length,
  (d) => Math.floor(d['IMDB Rating'] / 0.2) * 0.2, (d) => Math.min(95, Math.floor(d['Rotten Tomatoes Rating'] / 5) * 5));
const data = cells.flatMap(([x, ys]) => ys.map(([y, n]) => ({ x1: x, x2: x + 0.2, y1: y, y2: y + 5, n })));
const most = d3.max(data, (d) => d.n);

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 12, bottom: 36, left: 52 },
  axes: { x: { title: 'IMDB Rating (binned)' }, y: { title: 'Rotten Tomatoes Rating (binned)' } },
  legends: { fill: { anchor: 'right', title: 'Count of Records' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [1, 10] }, x2: { type: 'quantitative', domain: [1, 10] },
    y1: { type: 'quantitative', domain: [0, 100] }, y2: { type: 'quantitative', domain: [0, 100] },
    n: { type: 'quantitative', domain: [0, most] },
  },
  marks: [
    rect({
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'n', scale: d3.scaleSequential([0, most], d3.interpolateYlGnBu) },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Click to rate cells',
      question: 'Which combinations of IMDB and Rotten Tomatoes ratings are common, and which are rare?',
      try: 'Click a cell to step it through rare → some → common.',
      why: '`cycle()` on an ordinal `fill` advances the clicked row to the next level of the schema domain. Because `fill` is `ordinal`, the levels read as an ordered ramp rather than unrelated hues.',
      uses: ['cycle()', 'ordinal fill', 'legendColor'],
      code: `const imdb = ['1–3', '3–5', '5–7', '7–9', '9+'];
const rt = ['0–20', '20–40', '40–60', '60–80', '80–100'];
const levels = ['rare', 'some', 'common'];
const data = imdb.flatMap((i) => rt.map((r) => ({ imdb: i, rt: r, freq: 'rare' })));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 100, bottom: 36, left: 60 },
  axes: { x: { title: 'IMDB rating' } },
  legends: { fill: { anchor: 'right' } },
  data,
  schema: {
    imdb: { type: 'ordinal', domain: imdb },
    rt: { type: 'ordinal', domain: rt },
    freq: { type: 'ordinal', domain: levels }, //! ordered levels, ordered colours
  },
  marks: [
    rect({
      stroke: '#fff', strokeWidth: 2,
      channels: {
        x: { field: 'imdb', scale: { padding: 0 } },
        y: { field: 'rt', scale: { padding: 0 } },
        fill: { field: 'freq', edit: cycle() }, //! click = next level
      },
    }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── cumulative

GALLERY.add({
  id: 'vl-area_cumulative_freq',
  status: 'full',
  verdict: 'Counts per distinct rating and their running sum computed in JS, drawn as an `areaY`.',
  prep: ['prep-aggregate', 'prep-window'],
  recreation: { code: `const movies = await vegaData('movies.json');
const counts = d3.rollups(movies.filter((d) => d['IMDB Rating'] != null), (v) => v.length, (d) => d['IMDB Rating'])
  .sort((a, b) => a[0] - b[0]);
let run = 0;
const data = counts.map(([rating, n]) => ({ rating, cum: (run += n) }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: { x: { title: 'IMDB Rating' }, y: { title: 'Cumulative Count' } },
  data,
  schema: {
    rating: { type: 'quantitative', domain: [1, 10] },
    cum: { type: 'quantitative', domain: [0, 3000] },
  },
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 1, strokeWidth: 0,
      channels: { x: { field: 'rating' }, y: { field: 'cum' } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Draw the CDF',
      question: 'What share of films are rated at or below each IMDB score?',
      try: 'Drag the points. A point cannot go below the one to its left.',
      why: 'A cumulative share cannot fall, because that would be negative probability. `monotonic` along `rating` enforces it on every drag, and `clamp` keeps it in [0, 1].',
      uses: ['move()', 'monotonic()', 'clamp()'],
      code: `const data = d3.range(1, 11).map((rating) => ({ rating, p: (rating - 1) / 9 }));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 36, left: 40 },
  axes: { x: { title: 'IMDB rating' }, y: { tickFormat: d3.format('.0%') } },
  data,
  schema: {
    rating: { type: 'quantitative', domain: [1, 10] },
    p: { type: 'quantitative', domain: [0, 1] },
  },
  constraints: [
    monotonic({ field: 'p', along: 'rating' }), //! a CDF never falls
    clamp({ field: 'p', min: 0, max: 1 }),
  ],
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 0.5, stroke: '#4c78a8',
      channels: { x: { field: 'rating' }, y: { field: 'p', edit: move() } },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the bounds',
      question: 'How sure are you? At each IMDB score, sketch the lowest and highest share of films you think could be rated at or below it.',
      try: 'Press near the lower edge and sweep across to paint it, then sweep the upper edge.',
      why: 'An `areaY` between `lo` and `hi` with `edit.line.sweep()` on each edge: a stroke paints whichever edge was nearest when you pressed. `monotonic` keeps both bounds rising, as a cumulative share must, and `ordering` keeps them apart.',
      uses: ['edit.line.sweep()', 'areaY y1/y2', 'monotonic()', 'ordering()'],
      code: `const data = d3.range(1, 11).map((rating) => ({ rating, lo: (rating - 1) / 12, hi: Math.min(1, (rating - 1) / 7) }));

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: { x: { title: 'IMDB rating' }, y: { title: 'share rated at or below', tickFormat: d3.format('.0%') } },
  data,
  schema: {
    rating: { type: 'quantitative', domain: [1, 10] },
    lo: { type: 'quantitative', domain: [0, 1] },
    hi: { type: 'quantitative', domain: [0, 1] },
  },
  constraints: [
    monotonic({ field: 'lo', along: 'rating' }), //! both bounds rise
    monotonic({ field: 'hi', along: 'rating' }),
    ordering({ field: ['lo', 'hi'] }),
    clamp({ field: ['lo', 'hi'], min: 0, max: 1 }),
  ],
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 0.35, stroke: '#4c78a8', handleSize: 3,
      channels: {
        x: { field: 'rating' },
        y1: { field: 'lo', edit: edit.line.sweep() }, //! each stroke paints one edge
        y2: { field: 'hi', edit: edit.line.sweep() },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_cumulative_histogram',
  status: 'full',
  verdict: 'Two `rectY` views over the same binned rows: the running total, and the per-bin count in translucent yellow on top.',
  prep: ['prep-bin', 'prep-window'],
  gaps: ['The y axis is titled by hand: Vega-Lite joins the two layers’ field names.'],
  recreation: { code: `const movies = await vegaData('movies.json');
const xs = movies.map((d) => d['IMDB Rating']).filter((v) => v != null);
const bins = d3.bin().domain([1, 10]).thresholds(d3.range(2, 10))(xs);
let run = 0;
const data = bins.map((b) => ({ x1: b.x0, x2: b.x1, count: b.length, cum: (run += b.length) }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: { x: { title: 'IMDB Rating' }, y: { title: 'Cumulative Count, count' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [1, 10] }, x2: { type: 'quantitative', domain: [1, 10] },
    count: { type: 'quantitative', domain: [0, 3000] }, cum: { type: 'quantitative', domain: [0, 3000] },
  },
  marks: [
    rectY({ fill: '#4c78a8', stroke: '#fff', channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'cum' } } }),
    rectY({ fill: 'yellow', fillOpacity: 0.5, channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'count' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Bins drive the total',
      question: 'Out of 100 films, how many will fall in each IMDB rating band? Watch the running total build.',
      try: 'Drag a yellow bar. The blue running total behind it updates as you drag.',
      why: 'Only `count` carries an edit. A custom constraint recomputes `cum` as the running sum after every proposal, so the second view stays consistent with the first without an edit of its own; `maintainSum` caps the films at 100.',
      uses: ['move()', 'constraints.custom()', 'maintainSum()', 'two marks, one dataset'],
      code: `let run = 0;
const data = d3.range(1, 10).map((r) => ({ x1: r, x2: r + 1, count: 11, cum: (run += 11) }));
const runningTotal = constraints.custom(({ data }) => { //! repair: cum is the running sum
  let run = 0;
  return data.map((d) => ({ ...d, cum: (run += d.count) }));
});

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 12, right: 12, bottom: 36, left: 40 },
  axes: { x: { title: 'IMDB rating' } },
  data,
  schema: {
    x1: { type: 'quantitative', domain: [1, 10] }, x2: { type: 'quantitative', domain: [1, 10] },
    count: { type: 'quantitative', domain: [0, 120] }, cum: { type: 'quantitative', domain: [0, 120] },
  },
  constraints: [
    clamp({ field: 'count', min: 0 }),
    maintainSum({ field: 'count', total: 100, strategy: 'cap' }),
    runningTotal,
  ],
  marks: [
    rectY({ fill: '#4c78a8', stroke: '#fff', channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'cum' } } }),
    rectY({
      fill: '#eab308', fillOpacity: 0.7,
      channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'count', edit: move() } }, //! only the bin is edited
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_wilkinson_dotplot',
  status: 'full',
  verdict: '`dotStack` is a Wilkinson dot plot: one row is one dot, stacked per value with no rank transform.',
  gaps: ['Vega-Lite ranks the rows to stack them; `dotStack` stacks by construction.'],
  recreation: { code: `const values = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4];

mount(Elicit({
  width: 200, height: 150,
  margins: { top: 8, right: 12, bottom: 30, left: 12 },
  axes: { x: { title: 'data' }, y: false },
  data: values.map((v) => ({ data: v })),
  schema: { data: { type: 'ordinal', domain: [1, 2, 3, 4] } },
  scales: { x: { type: 'point', padding: 0.5 } },
  marks: [
    dotStack({ fill: '#4c78a8', size: 4, gap: 1, ghost: false, channels: { x: { field: 'data' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Add the next ten',
      question: 'These 21 dots are what you have seen so far. Where will the next 10 observations land?',
      try: 'Click above a value to add a dot there; click one of your dots to remove it.',
      why: '`lock: \'seed\'` fixes the observed dots, so only the ones you add can be removed. New rows take `kind: \'yours\'` from the schema default, which colours them; `count` stops at 31 dots in all.',
      uses: ["create({ gesture: 'click' })", 'remove()', "lock: 'seed'", 'count()'],
      code: `const seen = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4];

mount(Elicit({
  width: 300, height: 260,
  margins: { top: 12, right: 12, bottom: 30, left: 12 },
  axes: { x: { title: 'value' }, y: false },
  data: seen.map((v) => ({ data: v, kind: 'seen' })),
  schema: {
    data: { type: 'ordinal', domain: [1, 2, 3, 4] },
    kind: { type: 'categorical', domain: ['seen', 'yours'], default: 'yours' }, //! new dots are yours
  },
  scales: { x: { type: 'point', padding: 0.5 } },
  lock: 'seed', //! the observed dots are fixed
  constraints: [ count({ max: 31, strategy: 'reject' }) ], //! exactly ten more
  marks: [
    dotStack({
      size: 6, gap: 1,
      channels: { x: { field: 'data' }, fill: { field: 'kind', scale: { range: ['#94a3b8', '#4c78a8'] } } },
      edits: [ create({ gesture: 'click', channels: ['x'] }), remove() ],
    }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── isotype & share

const ISOTYPE_ICONS = `// The original's own pictogram paths (from its shape scale) and colours.
const icons = {
  cattle: 'M4 -2c0 0 0.9 -0.7 1.1 -0.8c0.1 -0.1 -0.1 0.5 -0.3 0.7c-0.2 0.2 1.1 1.1 1.1 1.2c0 0.2 -0.2 0.8 -0.4 0.7c-0.1 0 -0.8 -0.3 -1.3 -0.2c-0.5 0.1 -1.3 1.6 -1.5 2c-0.3 0.4 -0.6 0.4 -0.6 0.4c0 0.1 0.3 1.7 0.4 1.8c0.1 0.1 -0.4 0.1 -0.5 0c0 0 -0.6 -1.9 -0.6 -1.9c-0.1 0 -0.3 -0.1 -0.3 -0.1c0 0.1 -0.5 1.4 -0.4 1.6c0.1 0.2 0.1 0.3 0.1 0.3c0 0 -0.4 0 -0.4 0c0 0 -0.2 -0.1 -0.1 -0.3c0 -0.2 0.3 -1.7 0.3 -1.7c0 0 -2.8 -0.9 -2.9 -0.8c-0.2 0.1 -0.4 0.6 -0.4 1c0 0.4 0.5 1.9 0.5 1.9l-0.5 0l-0.6 -2l0 -0.6c0 0 -1 0.8 -1 1c0 0.2 -0.2 1.3 -0.2 1.3c0 0 0.3 0.3 0.2 0.3c0 0 -0.5 0 -0.5 0c0 0 -0.2 -0.2 -0.1 -0.4c0 -0.1 0.2 -1.6 0.2 -1.6c0 0 0.5 -0.4 0.5 -0.5c0 -0.1 0 -2.7 -0.2 -2.7c-0.1 0 -0.4 2 -0.4 2c0 0 0 0.2 -0.2 0.5c-0.1 0.4 -0.2 1.1 -0.2 1.1c0 0 -0.2 -0.1 -0.2 -0.2c0 -0.1 -0.1 -0.7 0 -0.7c0.1 -0.1 0.3 -0.8 0.4 -1.4c0 -0.6 0.2 -1.3 0.4 -1.5c0.1 -0.2 0.6 -0.4 0.6 -0.4z',
  pigs: 'M1.2 -2c0 0 0.7 0 1.2 0.5c0.5 0.5 0.4 0.6 0.5 0.6c0.1 0 0.7 0 0.8 0.1c0.1 0 0.2 0.2 0.2 0.2c0 0 -0.6 0.2 -0.6 0.3c0 0.1 0.4 0.9 0.6 0.9c0.1 0 0.6 0 0.6 0.1c0 0.1 0 0.7 -0.1 0.7c-0.1 0 -1.2 0.4 -1.5 0.5c-0.3 0.1 -1.1 0.5 -1.1 0.7c-0.1 0.2 0.4 1.2 0.4 1.2l-0.4 0c0 0 -0.4 -0.8 -0.4 -0.9c0 -0.1 -0.1 -0.3 -0.1 -0.3l-0.2 0l-0.5 1.3l-0.4 0c0 0 -0.1 -0.4 0 -0.6c0.1 -0.1 0.3 -0.6 0.3 -0.7c0 0 -0.8 0 -1.5 -0.1c-0.7 -0.1 -1.2 -0.3 -1.2 -0.2c0 0.1 -0.4 0.6 -0.5 0.6c0 0 0.3 0.9 0.3 0.9l-0.4 0c0 0 -0.4 -0.5 -0.4 -0.6c0 -0.1 -0.2 -0.6 -0.2 -0.5c0 0 -0.4 0.4 -0.6 0.4c-0.2 0.1 -0.4 0.1 -0.4 0.1c0 0 -0.1 0.6 -0.1 0.6l-0.5 0l0 -1c0 0 0.5 -0.4 0.5 -0.5c0 -0.1 -0.7 -1.2 -0.6 -1.4c0.1 -0.1 0.1 -1.1 0.1 -1.1c0 0 -0.2 0.1 -0.2 0.1c0 0 0 0.9 0 1c0 0.1 -0.2 0.3 -0.3 0.3c-0.1 0 0 -0.5 0 -0.9c0 -0.4 0 -0.4 0.2 -0.6c0.2 -0.2 0.6 -0.3 0.8 -0.8c0.3 -0.5 1 -0.6 1 -0.6z',
  sheep: 'M-4.1 -0.5c0.2 0 0.2 0.2 0.5 0.2c0.3 0 0.3 -0.2 0.5 -0.2c0.2 0 0.2 0.2 0.4 0.2c0.2 0 0.2 -0.2 0.5 -0.2c0.2 0 0.2 0.2 0.4 0.2c0.2 0 0.2 -0.2 0.4 -0.2c0.1 0 0.2 0.2 0.4 0.1c0.2 0 0.2 -0.2 0.4 -0.3c0.1 0 0.1 -0.1 0.4 0c0.3 0 0.3 -0.4 0.6 -0.4c0.3 0 0.6 -0.3 0.7 -0.2c0.1 0.1 1.4 1 1.3 1.4c-0.1 0.4 -0.3 0.3 -0.4 0.3c-0.1 0 -0.5 -0.4 -0.7 -0.2c-0.3 0.2 -0.1 0.4 -0.2 0.6c-0.1 0.1 -0.2 0.2 -0.3 0.4c0 0.2 0.1 0.3 0 0.5c-0.1 0.2 -0.3 0.2 -0.3 0.5c0 0.3 -0.2 0.3 -0.3 0.6c-0.1 0.2 0 0.3 -0.1 0.5c-0.1 0.2 -0.1 0.2 -0.2 0.3c-0.1 0.1 0.3 1.1 0.3 1.1l-0.3 0c0 0 -0.3 -0.9 -0.3 -1c0 -0.1 -0.1 -0.2 -0.3 -0.2c-0.2 0 -0.3 0.1 -0.4 0.4c0 0.3 -0.2 0.8 -0.2 0.8l-0.3 0l0.3 -1c0 0 0.1 -0.6 -0.2 -0.5c-0.3 0.1 -0.2 -0.1 -0.4 -0.1c-0.2 -0.1 -0.3 0.1 -0.4 0c-0.2 -0.1 -0.3 0.1 -0.5 0c-0.2 -0.1 -0.1 0 -0.3 0.3c-0.2 0.3 -0.4 0.3 -0.4 0.3l0.2 1.1l-0.3 0l-0.2 -1.1c0 0 -0.4 -0.6 -0.5 -0.4c-0.1 0.3 -0.1 0.4 -0.3 0.4c-0.1 -0.1 -0.2 1.1 -0.2 1.1l-0.3 0l0.2 -1.1c0 0 -0.3 -0.1 -0.3 -0.5c0 -0.3 0.1 -0.5 0.1 -0.7c0.1 -0.2 -0.1 -1 -0.2 -1.1c-0.1 -0.2 -0.2 -0.8 -0.2 -0.8c0 0 -0.1 -0.5 0.4 -0.8z',
};
const colours = { cattle: 'rgb(194,81,64)', pigs: 'rgb(93,93,93)', sheep: 'rgb(91,131,149)' };`;

GALLERY.add({
  id: 'vl-isotype_bar_chart',
  status: 'partial',
  verdict: '`shape` draws the original’s own SVG-path pictograms, one per animal, laid out in rows per country; faceting is not covered by this study, so the country facet becomes a combined row key.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'No `row` facet (faceting is out of this study’s scope): country and animal share one ordinal y axis, with the country named on the middle row.',
  ],
  recreation: { code: `${ISOTYPE_ICONS}
const herds = { 'Great Britain': { cattle: 3, pigs: 2, sheep: 10 }, 'United States': { cattle: 9, pigs: 6, sheep: 7 } };
const animals = ['cattle', 'pigs', 'sheep'];
// Listed bottom-up: the first domain value sits at the bottom of a y axis.
const rows = Object.keys(herds).flatMap((c) => animals.map((a) => c + ' / ' + a)).reverse();
const data = Object.entries(herds).flatMap(([country, h]) =>
  animals.flatMap((animal) => d3.range(1, h[animal] + 1).map((col) => ({ col, row: country + ' / ' + animal, animal }))));

mount(Elicit({
  width: 480, height: 230,
  margins: { top: 8, right: 8, bottom: 8, left: 96 },
  axes: { x: false, y: { tickSize: 0, tickFormat: (v) => (v.endsWith('pigs') ? v.split(' / ')[0] : '') } },
  data,
  schema: {
    col: { type: 'ordinal', domain: d3.range(1, 11) },
    row: { type: 'ordinal', domain: rows },
    animal: { type: 'categorical', domain: animals },
  },
  marks: [
    shape({
      size: 13, stroke: 'none',
      channels: {
        x: { field: 'col' }, y: { field: 'row' },
        symbol: { field: 'animal', scale: { range: animals.map((a) => icons[a]) } },
        fill: { field: 'animal', scale: { range: animals.map((a) => colours[a]) } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Place the icons',
      question: 'A century on, how many head of each animal does each country keep? One icon is 10 million.',
      try: 'Click an empty slot in a row to add an icon; click an icon to take it away.',
      why: 'Each row of data is one pictogram, drawn by `shape` from the original’s paths. `toggle` adds a row in an empty `(col, row)` slot or removes the one you click, and a repair constraint packs every row from the left, so the count always reads as a bar of icons.',
      uses: ['shape', "toggle({ channels: ['x', 'y'] })", 'constraints.custom()', 'symbol'],
      code: `${ISOTYPE_ICONS}
const animals = ['cattle', 'pigs', 'sheep'];
const rows = ['Great Britain', 'United States'].flatMap((c) => animals.map((a) => c + ' / ' + a));
const seed = [3, 2, 10, 9, 6, 7];
const data = rows.flatMap((row, i) => d3.range(1, seed[i] + 1).map((col) => ({ col, row })));
const order = [...rows].reverse(); // the first domain value sits at the bottom
const animalOf = (row) => row.split(' / ')[1];
const packLeft = constraints.custom(({ data }) => //! icons pack from the left
  data.map((d) => ({ ...d, col: 1 + data.filter((e) => e.row === d.row && e.col < d.col).length })));

mount(Elicit({
  width: 480, height: 240,
  margins: { top: 8, right: 8, bottom: 8, left: 150 },
  axes: { x: false, y: { tickSize: 0 } },
  data,
  schema: {
    col: { type: 'ordinal', domain: d3.range(1, 13) },
    row: { type: 'ordinal', domain: order },
  },
  constraints: [ packLeft ],
  marks: [
    shape({
      size: 10, stroke: 'none',
      channels: {
        x: { field: 'col' }, y: { field: 'row' },
        symbol: { field: 'row', scale: { range: order.map((r) => icons[animalOf(r)]) } }, //! the original's pictograms
        fill: { field: 'row', scale: { range: order.map((r) => colours[animalOf(r)]) } },
      },
      edits: [ toggle({ channels: ['x', 'y'] }) ], //! click a slot: add or remove an icon
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-isotype_bar_chart_emoji',
  status: 'partial',
  verdict: '`dotStackX` with an emoji `symbol` is this chart: one row per animal, stacked along x per country-and-animal row. Faceting is not covered by this study, so the country facet is flattened.',
  needs: ['facet'],
  gaps: ['No `row` facet (faceting is out of this study’s scope): country and animal share one ordinal y axis, with the country named on the middle row.', 'No rank transform needed: `dotStackX` stacks the rows itself.', 'Emoji are the original’s own glyphs here, so `dotStackX` keeps them rather than switching to `shape`.'],
  recreation: { code: `const herds = { 'Great Britain': { pigs: 2, cattle: 3, sheep: 10 }, 'United States': { pigs: 6, cattle: 9, sheep: 7 } };
const animals = ['pigs', 'cattle', 'sheep'];
// Listed bottom-up: the first domain value sits at the bottom of a y axis.
const rows = Object.keys(herds).flatMap((c) => animals.map((a) => c + ' / ' + a)).reverse();
const data = Object.entries(herds).flatMap(([country, h]) =>
  animals.flatMap((animal) => d3.range(h[animal]).map(() => ({ row: country + ' / ' + animal, animal }))));

mount(Elicit({
  width: 480, height: 230,
  margins: { top: 8, right: 8, bottom: 8, left: 96 },
  axes: { x: false, y: { tickSize: 0, tickFormat: (v) => (v.endsWith('cattle') ? v.split(' / ')[0] : '') } },
  data,
  schema: {
    row: { type: 'ordinal', domain: rows },
    animal: { type: 'categorical', domain: animals },
  },
  scales: { y: { type: 'point' } },
  marks: [
    dotStackX({
      size: 13, gap: 4, ghost: false,
      channels: {
        y: { field: 'row' },
        symbol: { field: 'animal', scale: { range: ['\u{1F416}', '\u{1F404}', '\u{1F40F}'] } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Stock a farm',
      question: 'You are stocking a new farm with 20 animals. How many pigs, cattle and sheep do you buy?',
      try: 'Click beside a row to add an animal; click an animal to sell it.',
      why: 'Each row is one animal, so `create` and `remove` change the herd one token at a time. Every row carries `n: 1` from the schema default, which lets `guides.remaining` count down the budget that `count` enforces.',
      uses: ['dotStackX', 'create()', 'remove()', 'count()', 'guides.remaining()'],
      code: `const animals = ['pigs', 'cattle', 'sheep'];

mount(Elicit({
  width: 480, height: 200,
  margins: { top: 28, right: 12, bottom: 12, left: 60 },
  axes: { x: false, y: { tickSize: 0 } },
  data: [{ animal: 'pigs', n: 1 }, { animal: 'cattle', n: 1 }, { animal: 'sheep', n: 1 }],
  schema: {
    animal: { type: 'categorical', domain: animals },
    n: { type: 'quantitative', domain: [0, 1], default: 1 }, //! every animal counts once
  },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [ count({ max: 20, strategy: 'reject' }) ], //! a 20-animal farm
  guides: [ guides.remaining({ field: 'n', total: 20, unit: 'animal' }) ], //! what is left to buy
  marks: [
    dotStackX({
      size: 11, gap: 3,
      channels: {
        y: { field: 'animal' },
        symbol: { field: 'animal', scale: { range: ['\u{1F416}', '\u{1F404}', '\u{1F40F}'] } },
      },
      edits: [ create({ gesture: 'click', channels: ['y'] }), remove() ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-bar_percent_of_total',
  status: 'full',
  verdict: 'Percent of total computed in JS, drawn as a `barX` per activity.',
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['The share is computed before `Elicit` (Vega-Lite uses `joinaggregate` + `calculate`).'],
  recreation: { code: `const day = [
  { Activity: 'Sleeping', Time: 8 }, { Activity: 'Eating', Time: 2 }, { Activity: 'TV', Time: 4 },
  { Activity: 'Work', Time: 8 }, { Activity: 'Exercise', Time: 2 },
];
const total = d3.sum(day, (d) => d.Time);
const data = day.map((d) => ({ Activity: d.Activity, pct: (d.Time / total) * 100 }));

mount(Elicit({
  width: 400, height: 110,
  margins: { top: 6, right: 16, bottom: 36, left: 64 },
  axes: { x: { title: '% of total Time' } },
  data,
  schema: {
    Activity: { type: 'categorical', domain: day.map((d) => d.Activity) },
    pct: { type: 'quantitative', domain: [0, 35] },
  },
  marks: [ barX({ fill: '#4c78a8', channels: { y: { field: 'Activity' }, x: { field: 'pct' } } }) ],
}));` },
  interfaces: [
    {
      title: 'Budget a day',
      question: 'How does a typical remote worker split a weekday’s 24 hours?',
      try: 'Drag a bar’s end. Bars snap to half hours and stop when the day is full.',
      why: '`maintainSum` with `strategy: \'cap\'` keeps the day at 24 hours and `snap` rounds each answer to the half hour. `guides.remaining` reads the total off the constraint.',
      uses: ['move()', 'maintainSum()', 'snap()', 'guides.remaining()'],
      code: `const acts = ['Sleeping', 'Eating', 'TV', 'Work', 'Exercise', 'Commute'];

mount(Elicit({
  width: 400, height: 220,
  margins: { top: 26, right: 16, bottom: 36, left: 70 },
  axes: { x: { title: 'hours' } },
  data: acts.map((Activity) => ({ Activity, hours: 2 })),
  schema: {
    Activity: { type: 'categorical', domain: acts },
    hours: { type: 'quantitative', domain: [0, 12] },
  },
  constraints: [
    clamp({ field: 'hours', min: 0 }),
    snap({ field: 'hours', step: 0.5 }), //! half-hour steps
    maintainSum({ field: 'hours', total: 24, strategy: 'cap' }), //! a day is 24 hours
  ],
  guides: [ guides.remaining({ field: 'hours', unit: 'hour' }) ],
  marks: [
    barX({ fill: '#4c78a8', channels: { y: { field: 'Activity' }, x: { field: 'hours', edit: move() } } }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── circular

const PIE_DATA = `const data = [
  { category: 1, value: 4 }, { category: 2, value: 6 }, { category: 3, value: 10 },
  { category: 4, value: 3 }, { category: 5, value: 7 }, { category: 6, value: 8 },
];`;

GALLERY.add({
  id: 'vl-arc_pie',
  status: 'full',
  verdict: '`arc` with `theta` on the value and `fill` on the category, swept clockwise from 12 o’clock like Vega-Lite.',
  gaps: ['`start`/`end` are math degrees, so Vega-Lite’s clockwise-from-top layout is `start: 90, end: -270`.'],
  recreation: { code: `${PIE_DATA}

mount(Elicit({
  width: 330, height: 220,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', labelWidth: 60 } },
  data,
  schema: {
    category: { type: 'categorical', domain: [1, 2, 3, 4, 5, 6] },
    value: { type: 'quantitative', domain: [0, 40] },
  },
  marks: [
    arc({
      outerRadius: 100, start: 90, end: -270, strokeWidth: 0,
      channels: { theta: { field: 'value' }, fill: { field: 'category', scale: { scheme: 'tableau10' } } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Drag the boundaries',
      question: 'Which share of UK household energy will each source supply in 2035?',
      try: 'Drag a dot on the rim to move the boundary between two slices.',
      why: '`edit.stack.edge` moves the boundary between two neighbouring slices, so one gains exactly what the other loses and the pie always sums to its total. No `maintainSum` needed: the stack preserves it by arithmetic.',
      uses: ['edit.stack.edge()', 'arc'],
      code: `const sources = ['Gas', 'Electric grid', 'Heat pump', 'Solar', 'Oil', 'Other'];

mount(Elicit({
  width: 360, height: 240,
  margins: { top: 12, right: 10, bottom: 12, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right' } },
  data: sources.map((source) => ({ source, share: 100 / 6 })),
  schema: {
    source: { type: 'categorical', domain: sources },
    share: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    arc({
      outerRadius: 100, start: 90, end: -270,
      channels: { theta: { field: 'share' }, fill: { field: 'source', scale: { scheme: 'tableau10' } } },
      edits: [ edit.stack.edge() ], //! drag a boundary; the total is preserved
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-arc_pie_normalize_tooltip',
  status: 'full',
  verdict: 'The pie is identical to `vl-arc_pie` (an arc always normalizes), and a `tip` function shows each slice’s value and its normalized percentage on hover.',
  gaps: ['The percentage is computed in the `tip` function from the live rows rather than by a `normalize` stack transform.'],
  recreation: { code: `${PIE_DATA}

mount(Elicit({
  width: 330, height: 220,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', labelWidth: 60 } },
  data,
  schema: {
    category: { type: 'categorical', domain: [1, 2, 3, 4, 5, 6] },
    value: { type: 'quantitative', domain: [0, 40] },
  },
  marks: [
    arc({
      outerRadius: 100, start: 90, end: -270, strokeWidth: 0,
      // The tooltip the example is about: each slice's share of the whole.
      tip: (d, { data }) => ['category: ' + d.category, 'value: ' + d.value,
        'share: ' + d3.format('.1%')(d.value / d3.sum(data, (e) => e.value))],
      channels: { theta: { field: 'value' }, fill: { field: 'category', scale: { scheme: 'tableau10' } } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Cut it from whole',
      question: 'Your monthly take-home pay is one whole pie. How do you split it?',
      try: 'Click a slice to cut it in two; drag a rim dot to resize; double-click a rim dot to merge the two slices it separates.',
      why: 'The answer starts as one row holding 100%. `edit.stack.cut` splits the clicked slice and names the new one from the unused categories in the schema domain; `edge` and `merge` resize and rejoin. The share stays a whole by construction, and `tip` reads each slice’s percentage back on hover.',
      uses: ['edit.stack.cut()', 'edit.stack.edge()', 'edit.stack.merge()', 'tip'],
      code: `mount(Elicit({
  width: 360, height: 240,
  margins: { top: 12, right: 10, bottom: 12, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right' } },
  data: [{ use: 'housing', share: 100 }],
  schema: {
    use: { type: 'categorical', domain: ['housing', 'food', 'transport', 'savings', 'fun', 'other'] }, //! names a cut hands out
    share: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    arc({
      outerRadius: 100, start: 90, end: -270,
      tip: (d, { data }) => d.use + ': ' + d3.format('.0%')(d.share / d3.sum(data, (e) => e.share)), //! the normalized share on hover
      channels: { theta: { field: 'share' }, fill: { field: 'use', scale: { scheme: 'tableau10' } } },
      edits: [
        edit.stack.cut(), //! click: split a slice
        edit.stack.edge(), //! drag a boundary
        edit.stack.merge(), //! double-click: merge
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-arc_donut',
  status: 'full',
  verdict: '`donut` (an `arc` with an inner radius) with the same encodings as the pie.',
  recreation: { code: `${PIE_DATA}

mount(Elicit({
  width: 330, height: 220,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', labelWidth: 60 } },
  data,
  schema: {
    category: { type: 'categorical', domain: [1, 2, 3, 4, 5, 6] },
    value: { type: 'quantitative', domain: [0, 40] },
  },
  marks: [
    donut({
      outerRadius: 100, innerRadius: 50, start: 90, end: -270, strokeWidth: 0,
      channels: { theta: { field: 'value' }, fill: { field: 'category', scale: { scheme: 'tableau10' } } },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Name and size',
      question: 'Where will the world’s new electricity come from in 2030? Name the sources yourself, then size them.',
      try: 'Double-click a legend swatch, type a name and press Enter. Drag a rim dot to resize slices.',
      why: '`edit.scale.categories()` on the legend edits the colour scale’s domain: renaming a category rewrites every row that used it. `edit.stack.edge` sizes the slices.',
      uses: ['edit.scale.categories()', 'legendColor', 'edit.stack.edge()'],
      code: `const names = ['Source A', 'Source B', 'Source C', 'Source D'];

mount(Elicit({
  width: 360, height: 240,
  margins: { top: 12, right: 10, bottom: 12, left: 10 },
  axes: false,
  data: names.map((source) => ({ source, share: 25 })),
  schema: {
    source: { type: 'categorical', domain: names },
    share: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    donut({
      outerRadius: 100, innerRadius: 50, start: 90, end: -270,
      channels: { theta: { field: 'share' }, fill: { field: 'source', scale: { scheme: 'tableau10' } } },
      edits: [ edit.stack.edge() ], //! drag a boundary
    }),
    legendColor({ anchor: 'right', edit: edit.scale.categories() }), //! rename a category
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_arc_label',
  status: 'full',
  verdict: 'An `arc` plus a `text` layer whose `x`/`y` are derived channels: each label sits at radius 90 on its slice’s mid-angle.',
  prep: ['prep-calculate'],
  gaps: ['The label position is a `{ fn }` channel computing polar coordinates in pixels: `radius` is a channel on `arc` only, not on `text`.'],
  recreation: { code: `const data = [
  { category: 'a', value: 4 }, { category: 'b', value: 6 }, { category: 'c', value: 10 },
  { category: 'd', value: 3 }, { category: 'e', value: 7 }, { category: 'f', value: 8 },
];
const W = 220, H = 220; // the plot area: the pie sits at its centre
// Mid-angle of row i in radians, clockwise from 12 o'clock, from the live rows.
const mid = (i, rows) => {
  const total = d3.sum(rows, (d) => d.value);
  const before = d3.sum(rows.slice(0, i), (d) => d.value);
  return ((before + rows[i].value / 2) / total) * 2 * Math.PI;
};

mount(Elicit({
  width: W + 20, height: H + 20,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data,
  schema: {
    category: { type: 'categorical', domain: ['a', 'b', 'c', 'd', 'e', 'f'] },
    value: { type: 'quantitative', domain: [0, 40] },
  },
  marks: [
    arc({
      outerRadius: 80, start: 90, end: -270, strokeWidth: 0,
      channels: { theta: { field: 'value' }, fill: { field: 'category', scale: { scheme: 'tableau10' } } },
    }),
    text({
      channels: {
        x: { fn: (d, i, rows) => W / 2 + 90 * Math.sin(mid(i, rows)) },
        y: { fn: (d, i, rows) => H / 2 - 90 * Math.cos(mid(i, rows)) },
        text: { field: 'category' },
        textAnchor: { value: 'middle' }, lineAnchor: { value: 'middle' },
        fill: { field: 'category', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Labels that follow',
      question: 'How does a typical software team split its working week across meetings, focus work, support, admin and learning?',
      try: 'Drag a rim dot. Each label stays on its slice and shows its share.',
      why: 'The labels are a second view of the same rows. Their `x`/`y` and `text` are `{ fn }` channels of the live dataset, so when `edit.stack.edge` moves a boundary they re-derive on the next render.',
      uses: ['edit.stack.edge()', '{ fn } channels', 'two marks, one dataset'],
      code: `const kinds = ['meetings', 'focus', 'support', 'admin', 'learning'];
const W = 260, H = 240;
const share = (i, rows) => rows[i].value / d3.sum(rows, (d) => d.value);
const mid = (i, rows) => (d3.sum(rows.slice(0, i), (d) => d.value) / d3.sum(rows, (d) => d.value) + share(i, rows) / 2) * 2 * Math.PI;

mount(Elicit({
  width: W + 20, height: H + 20,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: kinds.map((kind) => ({ kind, value: 20 })),
  schema: {
    kind: { type: 'categorical', domain: kinds },
    value: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    arc({
      outerRadius: 80, start: 90, end: -270,
      channels: { theta: { field: 'value' }, fill: { field: 'kind', scale: { scheme: 'tableau10' } } },
      edits: [ edit.stack.edge() ], //! drag a boundary
    }),
    text({
      fontSize: 11,
      channels: {
        x: { fn: (d, i, rows) => W / 2 + 112 * Math.sin(mid(i, rows)) }, //! placed from the live rows
        y: { fn: (d, i, rows) => H / 2 - 112 * Math.cos(mid(i, rows)) },
        text: { fn: (d, i, rows) => d.kind + ' ' + d3.format('.0%')(share(i, rows)) },
        textAnchor: { value: 'middle' }, lineAnchor: { value: 'middle' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-arc_radial',
  status: 'full',
  verdict: 'An `arc` with `theta` and a `sqrt` `radius` channel on the same field, so each slice has its own rim; a `text` layer places the values just past each rim.',
  prep: ['prep-calculate'],
  gaps: [
    'The labels are `{ fn }` channels computing polar positions in pixels (`text` has no `radius` channel or `radiusOffset`), so they repeat the radius scale’s arithmetic.',
    'The colour field is a string copy of the value (`key`): a schema field has one measurement type, and the value is quantitative.',
  ],
  recreation: { code: `const values = [12, 23, 47, 6, 52, 19];
// Vega-Lite stacks the slices in the colour field's order: ascending.
const data = d3.sort(values).map((v) => ({ data: v, key: String(v) }));
const W = 280, H = 280; // the plot area: the chart sits at its centre
const R0 = 20, R1 = 125; // inner and outer radius
const rim = (v) => R0 + (R1 - R0) * Math.sqrt(v / 52); // the radius scale, for the labels
const mid = (i, rows) => (d3.sum(rows.slice(0, i), (d) => d.data) + rows[i].data / 2) / d3.sum(rows, (d) => d.data) * 2 * Math.PI;

mount(Elicit({
  width: W + 20, height: H + 20,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data,
  schema: {
    data: { type: 'quantitative', domain: [0, 52] },
    key: { type: 'categorical', domain: data.map((d) => d.key) },
  },
  marks: [
    arc({
      innerRadius: R0, outerRadius: R1, start: 90, end: -270, stroke: '#fff',
      channels: {
        theta: { field: 'data' },
        radius: { field: 'data', scale: 'sqrt' }, // each slice's rim
        fill: { field: 'key', scale: { scheme: 'tableau10' } },
      },
    }),
    text({
      channels: {
        x: { fn: (d, i, rows) => W / 2 + (rim(d.data) + 10) * Math.sin(mid(i, rows)) },
        y: { fn: (d, i, rows) => H / 2 - (rim(d.data) + 10) * Math.cos(mid(i, rows)) },
        text: { field: 'data' },
        textAnchor: { value: 'middle' }, lineAnchor: { value: 'middle' },
        fill: { field: 'key', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'Drag the rims',
      question: 'Six bike counters logged these daily averages, in hundreds of riders. What will each log next summer?',
      try: 'Grab a slice near its outer edge and drag the rim in or out. Its angle follows, because both encode the same count.',
      why: 'A `move()` on `radius` inverts the pointer’s distance from the centre through the `sqrt` scale, so the rim follows the pointer and its distance is the count. `theta` reads the same column, so the slice widens as it grows, exactly as in the original. The rings are an `axisRadial` on the radius scale.',
      uses: ['radius channel', 'move()', "elements.axisRadial({ channel: 'radius' })", 'tip'],
      code: `const stations = ['North', 'East', 'South', 'West', 'Centre', 'Harbour'];
const seed = [12, 23, 47, 6, 52, 19];

mount(Elicit({
  width: 380, height: 270,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', labelWidth: 60 } },
  data: stations.map((station, i) => ({ station, riders: seed[i] })),
  schema: {
    station: { type: 'categorical', domain: stations },
    riders: { type: 'quantitative', domain: [0, 80] },
  },
  constraints: [ clamp({ field: 'riders', min: 1 }) ],
  elements: [ elements.axisRadial({ channel: 'radius', ticks: 4 }) ], //! rings on the radius scale
  marks: [
    arc({
      innerRadius: 20, outerRadius: 120, start: 90, end: -270, stroke: '#fff',
      tip: ['station', 'riders'],
      channels: {
        theta: { field: 'riders' },
        radius: { field: 'riders', scale: 'sqrt', edit: move() }, //! drag a rim: its distance is the count
        fill: { field: 'station', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));`,
    },
    {
      title: 'A rainfall rose',
      question: 'How much rain falls in Seattle in an average month? Drag each month out to your guess.',
      try: 'Grab a month near its outer edge and drag the rim in or out. Values snap to 5 mm.',
      why: 'Equal `theta` gives every month the same angle, so only `radius` carries the answer: a Nightingale rose. `move()` on `radius` writes the rainfall from the pointer’s distance to the centre, and `snap` rounds it; the month names are a `text` layer at fixed angles.',
      uses: ['radius channel', 'move()', 'snap()', "elements.axisRadial({ channel: 'radius' })"],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const W = 280, H = 280;

mount(Elicit({
  width: W + 20, height: H + 20,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: months.map((month) => ({ month, slot: 1, rain: 60 })),
  schema: {
    month: { type: 'ordinal', domain: months },
    slot: { type: 'quantitative', domain: [0, 1] },
    rain: { type: 'quantitative', domain: [0, 240] },
  },
  constraints: [ snap({ field: 'rain', step: 5 }), clamp({ field: 'rain', min: 0 }) ],
  elements: [ elements.axisRadial({ channel: 'radius', ticks: 4, tickFormat: (v) => v + ' mm' }) ],
  marks: [
    arc({
      innerRadius: 0, outerRadius: 120, start: 90, end: -270, stroke: '#fff',
      fill: '#4c78a8', fillOpacity: 0.8,
      channels: {
        theta: { field: 'slot' }, //! every month gets the same angle
        radius: { field: 'rain', edit: move() }, //! drag a month's rim
      },
    }),
    text({
      fontSize: 10,
      channels: {
        x: { fn: (d, i) => W / 2 + 132 * Math.sin(((i + 0.5) / 12) * 2 * Math.PI) },
        y: { fn: (d, i) => H / 2 - 132 * Math.cos(((i + 0.5) / 12) * 2 * Math.PI) },
        text: { field: 'month' },
        textAnchor: { value: 'middle' }, lineAnchor: { value: 'middle' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-arc_pie_pyramid',
  status: 'full',
  verdict: 'An `arc` rotated with `start`/`end`, slices in the `order` given by sorting the rows, and the three colours as an explicit `range`.',
  prep: ['prep-calculate'],
  gaps: [
    'The slice order comes from sorting the rows by `order` (an arc draws rows in data order); Vega-Lite uses an `order` channel.',
    'The legend sits at the right edge rather than at a free position.',
  ],
  recreation: { code: `const rows = [
  { category: 'Sky', value: 75, order: 3 },
  { category: 'Shady side of a pyramid', value: 10, order: 1 },
  { category: 'Sunny side of a pyramid', value: 15, order: 2 },
];
// An arc draws rows in data order, so sort by \`order\` (shady, sunny, sky).
const data = d3.sort(rows, (d) => d.order).map(({ category, value }) => ({ category, value }));

mount(Elicit({
  width: 400, height: 190,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', title: null, labelWidth: 150 } },
  data,
  schema: {
    category: { type: 'categorical', domain: ['Sky', 'Shady side of a pyramid', 'Sunny side of a pyramid'] },
    value: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    arc({
      // Vega-Lite's theta range [135°, 495°] clockwise from 12 o'clock is the
      // math-degree span -45 → -405.
      outerRadius: 80, start: -45, end: -405, strokeWidth: 0,
      channels: {
        theta: { field: 'value' },
        fill: { field: 'category', scale: { range: ['#416D9D', '#674028', '#DEAC58'] } },
      },
    }),
  ],
}));` },
  interfaces: [
    {
      title: 'How much is sky?',
      question: 'In this picture of a pyramid, what share of the view is sky, the shady side and the sunny side?',
      try: 'Drag the rim dots. The slices must keep looking like a pyramid under a sky.',
      why: 'The same rotated `arc` with `edit.stack.edge()`: the three shares trade off along their boundaries, so they always add up to the whole picture.',
      uses: ['edit.stack.edge()', 'start / end'],
      code: `mount(Elicit({
  width: 400, height: 210,
  margins: { top: 12, right: 10, bottom: 12, left: 10 },
  axes: false,
  legends: { fill: { anchor: 'right', title: null, labelWidth: 150 } },
  data: [
    { category: 'Shady side of a pyramid', value: 33 },
    { category: 'Sunny side of a pyramid', value: 33 },
    { category: 'Sky', value: 34 },
  ],
  schema: {
    category: { type: 'categorical', domain: ['Sky', 'Shady side of a pyramid', 'Sunny side of a pyramid'] },
    value: { type: 'quantitative', domain: [0, 100] },
  },
  marks: [
    arc({
      outerRadius: 85, start: -45, end: -405, //! rotated like the original
      channels: {
        theta: { field: 'value' },
        fill: { field: 'category', scale: { range: ['#416D9D', '#674028', '#DEAC58'] } },
      },
      edits: [ edit.stack.edge() ], //! trade share across a boundary
    }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── error bars & bands

// The barley interfaces share their varieties and one yield field; each draws the
// interval as a rule between the ends, with handles over its own columns.
const BARLEY = `const varieties = ['Velvet', 'Trebi', 'Peatland', 'Manchuria'];
const yieldField = { type: 'quantitative', domain: [20, 55] };`;

GALLERY.add({
  id: 'vl-layer_point_errorbar_ci',
  status: 'full',
  verdict: 'Mean and 95% interval per variety computed in JS, drawn as a horizontal `ruleY` span with a black `point` at the mean.',
  needs: ['interval-band'],
  prep: ['prep-aggregate'],
  gaps: ['The interval is a normal approximation (mean ± 1.96·SE); Vega-Lite bootstraps it, so the ends differ slightly.', 'There is no `errorbar` mark: the interval is computed before `Elicit`.'],
  recreation: { code: `const barley = await vegaData('barley.json');
const stats = d3.rollups(barley, (v) => {
  const m = d3.mean(v, (d) => d.yield);
  const se = d3.deviation(v, (d) => d.yield) / Math.sqrt(v.length);
  return { mean: m, lo: m - 1.96 * se, hi: m + 1.96 * se };
}, (d) => d.variety);
const data = stats.map(([variety, s]) => ({ variety, ...s }));
// Vega-Lite lists an ordinal y top-down; ElicitJS starts at the bottom.
const order = data.map((d) => d.variety).sort().reverse();

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 110 },
  axes: { x: { title: 'Barley Yield' }, y: { title: 'variety' } },
  data,
  schema: {
    variety: { type: 'ordinal', domain: order },
    mean: { type: 'quantitative', domain: [24, 48] },
    lo: { type: 'quantitative', domain: [24, 48] },
    hi: { type: 'quantitative', domain: [24, 48] },
  },
  scales: { y: { type: 'point', padding: 0.5 } },
  marks: [
    ruleY({ stroke: '#4c78a8', channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    point({ fill: 'black', size: 3, channels: { y: { field: 'variety' }, x: { field: 'mean' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Mean carries the range',
      question: 'For next season’s trial, where will each variety’s mean yield fall, and what 90% interval would you give it?',
      try: 'Drag a dot to move the mean: its interval travels with it. Drag an end tick to widen or narrow that side.',
      why: '`follow` shifts `lo` and `hi` by however far the mean moved, so the dot carries its interval; an end tick writes only its own column, so the interval may be lopsided. `ordering` keeps `lo ≤ mean ≤ hi` whichever handle you grab.',
      uses: ['move()', 'follow()', 'ordering()', 'clamp()'],
      code: `${BARLEY}
const data = varieties.map((variety) => ({ variety, lo: 30, mean: 35, hi: 40 }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 16, bottom: 36, left: 80 },
  axes: { x: { title: 'Barley yield (bushels/acre)' } },
  data,
  schema: { variety: { type: 'ordinal', domain: varieties }, lo: yieldField, mean: yieldField, hi: yieldField },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! the interval moves with the mean
    ordering({ field: ['lo', 'mean', 'hi'] }), //! lo ≤ mean ≤ hi
    clamp({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    ruleY({ stroke: '#94a3b8', strokeWidth: 2, channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16, channels: { y: { field: 'variety' }, x: { field: 'lo', edit: move() } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16, channels: { y: { field: 'variety' }, x: { field: 'hi', edit: move() } } }),
    point({ fill: 'black', size: 6, channels: { y: { field: 'variety' }, x: { field: 'mean', edit: move() } } }), //! drag the mean
  ],
}));`,
    },
    {
      title: 'Symmetric interval',
      question: 'Give each variety’s expected mean yield next season, with a margin of error that is the same on both sides.',
      try: 'Drag an end tick: the other end mirrors it about the mean. Drag a dot to move the whole interval.',
      why: '`symmetric` sets the end you did not touch to the mean’s reflection of the one you did, so one drag sets the margin. With `follow` beside it, the mean still carries both ends, and they stay mirrored.',
      uses: ['move()', 'follow()', 'symmetric()', 'ordering()'],
      code: `${BARLEY}
const data = varieties.map((variety) => ({ variety, lo: 31, mean: 35, hi: 39 }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 16, bottom: 36, left: 80 },
  axes: { x: { title: 'Barley yield (bushels/acre)' } },
  data,
  schema: { variety: { type: 'ordinal', domain: varieties }, lo: yieldField, mean: yieldField, hi: yieldField },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }),
    symmetric({ field: ['lo', 'hi'], about: 'mean' }), //! one end mirrors the other
    ordering({ field: ['lo', 'mean', 'hi'] }),
    clamp({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    ruleY({ stroke: '#94a3b8', strokeWidth: 2, channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16, channels: { y: { field: 'variety' }, x: { field: 'lo', edit: move() } } }), //! either end sets the margin
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16, channels: { y: { field: 'variety' }, x: { field: 'hi', edit: move() } } }),
    point({ fill: 'black', size: 6, channels: { y: { field: 'variety' }, x: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
    {
      title: 'Independent ends',
      question: 'Where will each variety’s mean yield fall next season, and where are the lowest and highest means you would believe?',
      try: 'Drag the dot for the mean, and either end tick for the interval. Each moves on its own.',
      why: 'With no `follow`, the glyph is three handles over three columns of one row, and each writes only its own field. `ordering` still keeps `lo ≤ mean ≤ hi`, pushing a neighbour along rather than letting the interval turn inside out.',
      uses: ['move()', 'ordering()', 'rule + tick + point'],
      code: `${BARLEY}
const data = varieties.map((variety) => ({ variety, lo: 30, mean: 35, hi: 40 }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 16, bottom: 36, left: 80 },
  axes: { x: { title: 'Barley yield (bushels/acre)' } },
  data,
  schema: { variety: { type: 'ordinal', domain: varieties }, lo: yieldField, mean: yieldField, hi: yieldField },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [ ordering({ field: ['lo', 'mean', 'hi'], strategy: 'push' }) ], //! lo ≤ mean ≤ hi, for every handle
  marks: [
    ruleY({ stroke: '#94a3b8', strokeWidth: 2, channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16,
            channels: { y: { field: 'variety' }, x: { field: 'lo', edit: move() } } }), //! each end is its own handle
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 16,
            channels: { y: { field: 'variety' }, x: { field: 'hi', edit: move() } } }),
    point({ fill: 'black', size: 6, channels: { y: { field: 'variety' }, x: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_point_errorbar_stdev',
  status: 'full',
  verdict: 'Mean ± one standard deviation per variety computed in JS, drawn as a `ruleY` span with a black `point`.',
  needs: ['interval-band'],
  prep: ['prep-aggregate'],
  gaps: ['There is no `errorbar` mark with `extent: \'stdev\'`: the extent is computed before `Elicit`.'],
  recreation: { code: `const barley = await vegaData('barley.json');
const stats = d3.rollups(barley, (v) => {
  const m = d3.mean(v, (d) => d.yield), sd = d3.deviation(v, (d) => d.yield);
  return { mean: m, lo: m - sd, hi: m + sd };
}, (d) => d.variety);
const data = stats.map(([variety, s]) => ({ variety, ...s }));
const order = data.map((d) => d.variety).sort().reverse();

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 110 },
  axes: { x: { title: 'Barley Yield' }, y: { title: 'variety' } },
  data,
  schema: {
    variety: { type: 'ordinal', domain: order },
    mean: { type: 'quantitative', domain: [20, 55] },
    lo: { type: 'quantitative', domain: [20, 55] },
    hi: { type: 'quantitative', domain: [20, 55] },
  },
  scales: { y: { type: 'point', padding: 0.5 } },
  marks: [
    ruleY({ stroke: '#4c78a8', channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    point({ fill: 'black', size: 3, channels: { y: { field: 'variety' }, x: { field: 'mean' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Mean ± one SD',
      question: 'Across the six trial sites, what is each variety’s typical yield, and how far does a typical site stray from it?',
      try: 'Drag an end tick to set the spread: the other end mirrors it. Drag a dot to move the mean and its spread together.',
      why: 'A standard deviation is the same on both sides of the mean, so `symmetric` mirrors whichever end you drag and one gesture sets the SD. `follow` carries both ends with the dot.',
      uses: ['move()', 'symmetric()', 'follow()', 'ordering()'],
      code: `${BARLEY}
const data = varieties.map((variety) => ({ variety, lo: 30, mean: 35, hi: 40 }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 16, bottom: 36, left: 80 },
  axes: { x: { title: 'Barley yield (bushels/acre)' } },
  data,
  schema: { variety: { type: 'ordinal', domain: varieties }, lo: yieldField, mean: yieldField, hi: yieldField },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! the spread rides on the mean
    symmetric({ field: ['lo', 'hi'], about: 'mean' }), //! ± one SD: both sides equal
    ordering({ field: ['lo', 'mean', 'hi'] }),
    clamp({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    ruleY({ stroke: '#4c78a8', strokeWidth: 2, channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 14, channels: { y: { field: 'variety' }, x: { field: 'lo', edit: move() } } }),
    tickX({ stroke: '#4c78a8', strokeWidth: 3, length: 14, channels: { y: { field: 'variety' }, x: { field: 'hi', edit: move() } } }),
    point({ fill: 'black', size: 6, channels: { y: { field: 'variety' }, x: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
    {
      title: 'Brush the spread',
      question: 'Across the six trial sites, how widely will each variety’s yield vary? Brush the range that covers about two thirds of sites.',
      try: 'Drag a rule’s end to stretch it, or its middle to slide it. Shift-drag a dot to move the mean, and the range comes with it.',
      why: '`brushSpan` on the `ruleY` edits the span by its ends and its body, so the spread is one gesture on the recreation’s own mark. It claims every press on the plot, so `when.noShift` lets a Shift-press through to the mean’s `point`; `follow` carries the span when the mean moves, and `ordering` keeps it inside.',
      uses: ['brushSpan()', 'when.noShift', 'move()', 'follow()', 'ordering()'],
      code: `${BARLEY}
const data = varieties.map((variety) => ({ variety, lo: 30, mean: 35, hi: 40 }));

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 12, right: 16, bottom: 36, left: 80 },
  axes: { x: { title: 'Barley yield (bushels/acre)' } },
  data,
  schema: { variety: { type: 'ordinal', domain: varieties }, lo: yieldField, mean: yieldField, hi: yieldField },
  scales: { y: { type: 'point', padding: 0.5 } },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! the mean carries the span
    ordering({ field: ['lo', 'mean', 'hi'], strategy: 'push' }), //! the mean stays inside
  ],
  marks: [
    ruleY({
      stroke: '#4c78a8', strokeWidth: 4,
      channels: { y: { field: 'variety' }, x1: { field: 'lo' }, x2: { field: 'hi' } },
      edits: [ brushSpan({ edgeInset: 10, when: when.noShift }) ], //! ends stretch, body slides
    }),
    point({ fill: 'black', size: 6, channels: { y: { field: 'variety' }, x: { field: 'mean', edit: move() } } }), //! Shift-drag: the mean
  ],
}));`,
    },
  ],
});

// The observed yearly means and 95% intervals, shared by the error-band interfaces.
const MPG_HISTORY = `const cars = (await vegaData('cars.json')).filter((d) => d.Miles_per_Gallon != null);
const history = d3.rollups(cars, (v) => {
  const m = d3.mean(v, (d) => d.Miles_per_Gallon);
  const se = d3.deviation(v, (d) => d.Miles_per_Gallon) / Math.sqrt(v.length);
  return { mean: m, lo: m - 1.96 * se, hi: m + 1.96 * se };
}, (d) => +d.Year.slice(0, 4)).map(([year, s]) => ({ year, ...s })).sort((a, b) => a.year - b.year);
const mpg = { type: 'quantitative', domain: [10, 50] };
const year = { type: 'quantitative', domain: [1970, 1988] };`;

GALLERY.add({
  id: 'vl-layer_line_errorband_ci',
  status: 'full',
  verdict: 'Yearly mean MPG and its 95% interval computed in JS: an `areaY` between `lo` and `hi` under a `lineY` of the mean.',
  needs: ['interval-band'],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['The interval is a normal approximation (Vega-Lite bootstraps).', 'Years are plain numbers rather than a time unit.'],
  recreation: { code: `const cars = (await vegaData('cars.json')).filter((d) => d.Miles_per_Gallon != null);
const data = d3.rollups(cars, (v) => {
  const m = d3.mean(v, (d) => d.Miles_per_Gallon);
  const se = d3.deviation(v, (d) => d.Miles_per_Gallon) / Math.sqrt(v.length);
  return { mean: m, lo: m - 1.96 * se, hi: m + 1.96 * se };
}, (d) => +d.Year.slice(0, 4)).map(([year, s]) => ({ year, ...s })).sort((a, b) => a.year - b.year);

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 52 },
  axes: { x: { title: 'Year (year)', tickFormat: d3.format('d') }, y: { title: 'Mean of Miles per Gallon (95% CIs)' } },
  data,
  schema: {
    year: { type: 'quantitative', domain: [1970, 1982] },
    mean: { type: 'quantitative', domain: [10, 40] },
    lo: { type: 'quantitative', domain: [10, 40] },
    hi: { type: 'quantitative', domain: [10, 40] },
  },
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.3, strokeWidth: 0,
            channels: { x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    lineY({ stroke: '#4c78a8', channels: { x: { field: 'year' }, y: { field: 'mean' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Extend the band',
      question: 'Average fuel economy rose through 1970–1982. Where will the mean go in 1983–1988, and how sure are you?',
      try: 'Drag a dot on the line to move that year’s mean: its band moves with it. Drag a band edge to widen or narrow one side.',
      why: 'The observed years are a context table: drawn by their own `areaY` and `lineY`, never part of the answer. Over the forecast rows, `follow` carries `lo` and `hi` with the mean, and `ordering` keeps the mean inside its band. The 1982 row is `lock`ed so the forecast starts from what was seen.',
      uses: ["context table", 'move()', 'follow()', 'ordering()', 'lock'],
      code: `${MPG_HISTORY}
const last = history[history.length - 1];
const next = [last, ...d3.range(1983, 1989).map((year) => ({ year, mean: 31, lo: 28, hi: 34 }))];
const band = (o) => areaY({ fill: '#4c78a8', fillOpacity: 0.25, strokeWidth: 0, ...o });

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { tickFormat: d3.format('d') }, y: { title: 'mean MPG' } },
  schema: {
    data: { year, mean: mpg, lo: mpg, hi: mpg },
    history: { context: true, fields: { year, mean: mpg, lo: mpg, hi: mpg } }, //! observed years: drawn, never elicited
  },
  data: { data: next, history },
  lock: (d) => d.year === last.year, // the forecast starts from 1982
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! the band moves with the mean
    ordering({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    band({ table: 'history', channels: { x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    lineY({ table: 'history', stroke: '#94a3b8', channels: { x: { field: 'year' }, y: { field: 'mean' } } }),
    band({
      handleSize: 4,
      channels: {
        x: { field: 'year' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) }, //! the band's two edges
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },
      },
    }),
    lineY({ stroke: '#4c78a8', channels: { x: { field: 'year' }, y: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
    {
      title: 'Symmetric band',
      question: 'Forecast the mean fuel economy for 1983–1988 with an interval the same width above and below.',
      try: 'Drag a band edge: the opposite edge mirrors it about the mean. Drag the line to move a year’s mean and band together.',
      why: '`symmetric` sets the edge you did not drag to the mean’s reflection of the one you did, so one drag sets that year’s margin; `follow` keeps the mirrored band riding on the mean.',
      uses: ['move()', 'symmetric()', 'follow()', 'context table'],
      code: `${MPG_HISTORY}
const next = d3.range(1983, 1989).map((year) => ({ year, mean: 31, lo: 28, hi: 34 }));

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { tickFormat: d3.format('d') }, y: { title: 'mean MPG' } },
  schema: {
    data: { year, mean: mpg, lo: mpg, hi: mpg },
    history: { context: true, fields: { year, mean: mpg, lo: mpg, hi: mpg } },
  },
  data: { data: next, history },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }),
    symmetric({ field: ['lo', 'hi'], about: 'mean' }), //! one edge mirrors the other
    ordering({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    areaY({ table: 'history', fill: '#94a3b8', fillOpacity: 0.25, strokeWidth: 0,
            channels: { x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    lineY({ table: 'history', stroke: '#94a3b8', channels: { x: { field: 'year' }, y: { field: 'mean' } } }),
    areaY({
      fill: '#4c78a8', fillOpacity: 0.25, strokeWidth: 0, handleSize: 4,
      channels: {
        x: { field: 'year' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) }, //! drag either edge
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },
      },
    }),
    lineY({ stroke: '#4c78a8', channels: { x: { field: 'year' }, y: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
    {
      title: 'Paint the mean',
      question: 'Sketch the next six years of mean fuel economy, then the band you are 95% sure it stays within.',
      try: 'Press near the line and sweep across to paint the mean; each year’s band follows. Then Shift-drag a band edge dot to set that side.',
      why: '`edit.line.sweep()` on the line paints a mean for every year the pointer crosses, and `follow` drags each painted year’s band along with it. The sweep claims every press on the plot, so it is gated with `when.noShift`: a Shift-press falls through to the band’s point-by-point `move()` handles.',
      uses: ['edit.line.sweep()', 'follow()', 'when.noShift', 'move()'],
      code: `${MPG_HISTORY}
const next = d3.range(1983, 1989).map((year) => ({ year, mean: 31, lo: 28, hi: 34 }));

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { tickFormat: d3.format('d') }, y: { title: 'mean MPG' } },
  schema: {
    data: { year, mean: mpg, lo: mpg, hi: mpg },
    history: { context: true, fields: { year, mean: mpg, lo: mpg, hi: mpg } },
  },
  data: { data: next, history },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! painting the mean carries the band
    ordering({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    areaY({ table: 'history', fill: '#94a3b8', fillOpacity: 0.25, strokeWidth: 0,
            channels: { x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    lineY({ table: 'history', stroke: '#94a3b8', channels: { x: { field: 'year' }, y: { field: 'mean' } } }),
    areaY({
      fill: '#4c78a8', fillOpacity: 0.25, strokeWidth: 0, handleSize: 4,
      channels: {
        x: { field: 'year' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) },
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) },
      },
    }),
    lineY({ stroke: '#4c78a8', channels: { x: { field: 'year' }, y: { field: 'mean', edit: edit.line.sweep({ when: when.noShift }) } } }), //! paint the mean
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_scatter_errorband_1D_stdev_global_mean',
  status: 'full',
  verdict: 'A `point` scatter, with the global mean and ±1 SD band drawn as guides computed from the rows.',
  needs: ['interval-band'],
  gaps: ['The band and mean are `guides.region` / `guides.rule` with functions of the data rather than an `errorband` and an aggregated `rule` layer.'],
  recreation: { code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { title: 'Horsepower' }, y: { title: 'Miles per Gallon' } },
  data: cars,
  schema: {
    hp: { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 50] },
  },
  guides: [
    guides.region({
      y: ({ data }) => [d3.mean(data, (d) => d.mpg) - d3.deviation(data, (d) => d.mpg),
                        d3.mean(data, (d) => d.mpg) + d3.deviation(data, (d) => d.mpg)],
      fill: '#4c78a8', opacity: 0.2,
    }),
    guides.rule({ y: ({ data }) => d3.mean(data, (d) => d.mpg), stroke: '#334155', strokeDash: 'none' }),
  ],
  marks: [
    point({ stroke: '#4c78a8', fill: 'none', size: 3, channels: { x: { field: 'hp' }, y: { field: 'mpg' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'State mean and SD',
      question: 'Without computing anything, where is the average MPG of these cars, and how far does a typical car sit from it?',
      try: 'Drag the dark line to set the mean: the band comes with it. Drag either band edge to set one standard deviation; the other edge mirrors it.',
      why: 'The cars are a context table, drawn but never part of the answer. The answer is one row of `mean`, `lo`, `hi`: `follow` carries the band with the mean, `symmetric` mirrors one edge onto the other, so the band is always mean ± one SD.',
      uses: ['context table', 'move()', 'follow()', 'symmetric()', 'ordering()'],
      code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));
const mpg = { type: 'quantitative', domain: [0, 50] };
const edge = (f) => ruleY({ stroke: '#4c78a8', strokeWidth: 2,
  channels: { x1: { datum: 0 }, x2: { datum: 240 }, y: { field: f, edit: move() } } });

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { title: 'Horsepower' }, y: { title: 'Miles per Gallon' } },
  schema: {
    data: { lo: mpg, mean: mpg, hi: mpg },
    cars: { context: true, fields: { hp: { type: 'quantitative', domain: [0, 240] }, mpg } }, //! the scatter is context
  },
  data: { data: [{ lo: 25, mean: 30, hi: 35 }], cars },
  constraints: [
    follow({ field: ['lo', 'hi'], lead: 'mean' }), //! the band rides on the mean
    symmetric({ field: ['lo', 'hi'], about: 'mean' }), //! mean ± one SD
    ordering({ field: ['lo', 'mean', 'hi'] }),
  ],
  marks: [
    point({ table: 'cars', stroke: '#94a3b8', fill: 'none', size: 3, channels: { x: { field: 'hp' }, y: { field: 'mpg' } } }),
    rect({ fill: '#4c78a8', fillOpacity: 0.2, channels: { x1: { datum: 0 }, x2: { datum: 240 }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    edge('lo'), edge('hi'),
    ruleY({ stroke: '#334155', strokeWidth: 3,
            channels: { x1: { datum: 0 }, x2: { datum: 240 }, y: { field: 'mean', edit: move() } } }),
  ],
}));`,
    },
    {
      title: 'Add cars, move the band',
      question: 'Add five cars you expect on sale in 2030. Where do they sit for horsepower and MPG?',
      try: 'Click in the plot to add a car; drag one of yours to move it. Watch the mean and band respond.',
      why: '`lock: \'seed\'` fixes the observed cars, `create` adds yours and `count` stops at five more. The band and rule are guides over the live rows, so they recompute from every row on each render.',
      uses: ["create({ gesture: 'click' })", 'move()', "lock: 'seed'", 'guides.region()', 'guides.rule()'],
      code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .filter((_, i) => i % 6 === 0)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, who: 'seen' }));
const m = (data) => d3.mean(data, (d) => d.mpg);
const sd = (data) => d3.deviation(data, (d) => d.mpg);

mount(Elicit({
  width: 420, height: 280,
  margins: { top: 10, right: 16, bottom: 36, left: 48 },
  axes: { x: { title: 'Horsepower' }, y: { title: 'Miles per Gallon' } },
  data: cars,
  schema: {
    hp: { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 60] },
    who: { type: 'categorical', domain: ['seen', 'yours'], default: 'yours' },
  },
  lock: 'seed', //! the observed cars are fixed
  constraints: [ count({ max: cars.length + 5, strategy: 'reject' }) ], //! five new cars
  guides: [
    guides.region({ y: ({ data }) => [m(data) - sd(data), m(data) + sd(data)], fill: '#4c78a8', opacity: 0.2 }), //! recomputed from every row
    guides.rule({ y: ({ data }) => m(data), stroke: '#334155', strokeDash: 'none', label: 'mean' }),
  ],
  marks: [
    point({
      size: 4,
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        fill: { field: 'who', scale: { range: ['#cbd5e1', '#e45756'] } },
      },
      edits: [ create({ gesture: 'click', channels: ['x', 'y'] }), move({ channels: ['x', 'y'] }) ],
    }),
  ],
}));`,
    },
  ],
});

// ───────────────────────────────────────────────────────────── box plots

GALLERY.add({
  id: 'vl-boxplot_minmax_2D_vertical',
  status: 'full',
  verdict: 'Quartiles and extremes per species computed in JS; a `ruleX` whisker, a fixed-width `rect` box and a white `tickY` median, all views of one row per species.',
  needs: ['boxplot'],
  prep: ['prep-aggregate'],
  gaps: ['There is no `boxplot` mark: the five-number summary is computed before `Elicit`.'],
  recreation: { code: `const penguins = (await vegaData('penguins.json')).filter((d) => d['Body Mass (g)'] != null);
const data = d3.rollups(penguins, (v) => {
  const xs = v.map((d) => d['Body Mass (g)']).sort(d3.ascending);
  return { min: xs[0], q1: d3.quantile(xs, 0.25), median: d3.quantile(xs, 0.5), q3: d3.quantile(xs, 0.75), max: xs[xs.length - 1] };
}, (d) => d.Species).map(([species, s]) => ({ species, ...s }));
const mass = { type: 'quantitative', domain: [2500, 6500] };

mount(Elicit({
  width: 300, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 60 },
  axes: { x: { title: 'Species' }, y: { title: 'Body Mass (g)' } },
  data,
  schema: {
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    min: mass, q1: mass, median: mass, q3: mass, max: mass,
  },
  marks: [
    ruleX({ stroke: 'black', channels: { x: { field: 'species' }, y1: { field: 'min' }, y2: { field: 'max' } } }),
    rect({ channels: { x: { field: 'species' }, width: { value: 14 }, y1: { field: 'q1' }, y2: { field: 'q3' },
                       fill: { field: 'species', scale: { scheme: 'tableau10' } } } }),
    tickY({ stroke: 'white', strokeWidth: 1.5, length: 14, channels: { x: { field: 'species' }, y: { field: 'median' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Median carries the box',
      question: 'A new colony of each species is being weighed. Where will its median body mass sit, and how are the masses spread around it?',
      try: 'Drag a white median tick: the box and whiskers move with it. Drag any other tick to reshape one part.',
      why: '`follow` moves the quartiles and extremes by however far the median moved, so you place the centre first and keep the shape you drew. Each tick is its own `tickY` over one column, and `ordering` keeps `min ≤ q1 ≤ median ≤ q3 ≤ max` as you reshape.',
      uses: ['move()', 'follow()', 'ordering()', 'tickY'],
      code: `const species = ['Adelie', 'Chinstrap', 'Gentoo'];
const data = species.map((s) => ({ species: s, min: 3000, q1: 3600, median: 4000, q3: 4400, max: 5200 }));
const mass = { type: 'quantitative', domain: [2500, 6500] };
const handle = (f, stroke) => tickY({ stroke, strokeWidth: 3, length: 26,
  channels: { x: { field: 'species' }, y: { field: f, edit: move() } } });

mount(Elicit({
  width: 360, height: 320,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: { y: { title: 'Body mass (g)' } },
  data,
  schema: { species: { type: 'categorical', domain: species }, min: mass, q1: mass, median: mass, q3: mass, max: mass },
  constraints: [
    follow({ field: ['min', 'q1', 'q3', 'max'], lead: 'median' }), //! the median carries the box
    ordering({ field: ['min', 'q1', 'median', 'q3', 'max'], strategy: 'push' }),
    clamp({ field: ['min', 'q1', 'median', 'q3', 'max'] }),
  ],
  marks: [
    ruleX({ stroke: '#64748b', channels: { x: { field: 'species' }, y1: { field: 'min' }, y2: { field: 'max' } } }),
    rect({ channels: { x: { field: 'species' }, width: { value: 26 }, y1: { field: 'q1' }, y2: { field: 'q3' },
                       fill: { field: 'species', scale: { scheme: 'tableau10' } } } }),
    ...['min', 'q1', 'q3', 'max'].map((f) => handle(f, '#0f172a')),
    handle('median', 'white'), //! drag the centre
  ],
}));`,
    },
    {
      title: 'Five handles, one order',
      question: 'A new colony of each species is being weighed. Draw the range, quartiles and median of body mass you expect.',
      try: 'Drag any of the five ticks on a box: the ends of the whisker, the edges of the box, or the median.',
      why: 'With no `follow`, each tick writes only its statistic. One `ordering` over all five fields keeps `min ≤ q1 ≤ median ≤ q3 ≤ max`, pushing neighbours along rather than letting a box turn inside out.',
      uses: ['move()', 'ordering()', 'rect width', 'tickY'],
      code: `const species = ['Adelie', 'Chinstrap', 'Gentoo'];
const data = species.map((s) => ({ species: s, min: 3000, q1: 3600, median: 4000, q3: 4400, max: 5200 }));
const mass = { type: 'quantitative', domain: [2500, 6500] };
const handle = (f) => tickY({ stroke: '#0f172a', strokeWidth: 3, length: 26,
  channels: { x: { field: 'species' }, y: { field: f, edit: move() } } });

mount(Elicit({
  width: 360, height: 320,
  margins: { top: 12, right: 12, bottom: 36, left: 60 },
  axes: { y: { title: 'Body mass (g)' } },
  data,
  schema: { species: { type: 'categorical', domain: species }, min: mass, q1: mass, median: mass, q3: mass, max: mass },
  constraints: [ ordering({ field: ['min', 'q1', 'median', 'q3', 'max'], strategy: 'push' }) ], //! five statistics, one order
  marks: [
    ruleX({ stroke: '#64748b', channels: { x: { field: 'species' }, y1: { field: 'min' }, y2: { field: 'max' } } }),
    rect({ fillOpacity: 0.6, channels: { x: { field: 'species' }, width: { value: 26 }, y1: { field: 'q1' }, y2: { field: 'q3' },
                                          fill: { field: 'species', scale: { scheme: 'tableau10' } } } }),
    ...['min', 'q1', 'median', 'q3', 'max'].map(handle), //! one handle per statistic
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-boxplot_2D_vertical',
  status: 'full',
  verdict: 'Tukey box plots with 1.5×IQR whiskers: one summary row per species, and the outliers in a context table drawn by their own `point` layer.',
  needs: ['boxplot'],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: [
    'No `boxplot` mark: quartiles, whisker ends and outliers are computed in JS.',
  ],
  recreation: { code: `const penguins = (await vegaData('penguins.json')).filter((d) => d['Body Mass (g)'] != null);
const summaries = d3.rollups(penguins, (v) => {
  const xs = v.map((d) => d['Body Mass (g)']).sort(d3.ascending);
  const q1 = d3.quantile(xs, 0.25), q3 = d3.quantile(xs, 0.75), iqr = q3 - q1;
  const inside = xs.filter((x) => x >= q1 - 1.5 * iqr && x <= q3 + 1.5 * iqr);
  return { q1, median: d3.quantile(xs, 0.5), q3, lo: inside[0], hi: inside[inside.length - 1],
           outliers: xs.filter((x) => !inside.includes(x)) };
}, (d) => d.Species);
const boxes = summaries.map(([species, { outliers, ...s }]) => ({ species, ...s }));
const outliers = summaries.flatMap(([species, s]) => s.outliers.map((value) => ({ species, value })));
const species = { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] };
const mass = { type: 'quantitative', domain: [2500, 6500] };

mount(Elicit({
  width: 300, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 60 },
  axes: { x: { title: 'Species' }, y: { title: 'Body Mass (g)' } },
  schema: {
    data: { species, q1: mass, median: mass, q3: mass, lo: mass, hi: mass },
    outliers: { context: true, fields: { species, value: mass } }, // the dot layer's own rows
  },
  data: { data: boxes, outliers },
  marks: [
    ruleX({ stroke: 'black', channels: { x: { field: 'species' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    rect({ channels: { x: { field: 'species' }, width: { value: 14 }, y1: { field: 'q1' }, y2: { field: 'q3' },
                       fill: { field: 'species', scale: { scheme: 'tableau10' } } } }),
    tickY({ stroke: 'white', strokeWidth: 1.5, length: 14, channels: { x: { field: 'species' }, y: { field: 'median' } } }),
    point({ table: 'outliers', fill: 'none', size: 3, channels: {
      x: { field: 'species' }, y: { field: 'value' },
      stroke: { field: 'species', scale: { scheme: 'tableau10' } },
    } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Median, then spread',
      question: 'What body mass do you expect for Adelie penguins next season? Answer in three steps: the median, then the middle half, then the range.',
      try: 'Drag the median line, then press Next to set the quartiles, and Next again for the whiskers.',
      why: 'Each handle’s edit carries a `stage`, so only the step in hand is live: you commit to a centre before you think about spread. `follow` carries the box and whiskers with the median, so a late change of mind about the centre keeps the shape, and `ordering` holds the five values in order across all three stages.',
      uses: ['move({ stage })', 'nextStage()', 'follow()', 'ordering()'],
      code: `const mass = { type: 'quantitative', domain: [2500, 6500] };
const handle = (f, stage, color) => tickY({ stroke: color, strokeWidth: 3, length: 50,
  channels: { x: { field: 'species' }, y: { field: f, edit: move({ stage }) } } }); //! live in one stage only

const chart = Elicit({
  width: 300, height: 300,
  margins: { top: 12, right: 12, bottom: 30, left: 60 },
  axes: { y: { title: 'Body mass (g)' } },
  stage: 0,
  stageLabels: ['median', 'quartiles', 'range'],
  data: [{ species: 'Adelie', lo: 3000, q1: 3400, median: 3700, q3: 4000, hi: 4600 }],
  schema: { species: { type: 'categorical', domain: ['Adelie'] }, lo: mass, q1: mass, median: mass, q3: mass, hi: mass },
  constraints: [
    follow({ field: ['lo', 'q1', 'q3', 'hi'], lead: 'median' }), //! the median carries the box
    ordering({ field: ['lo', 'q1', 'median', 'q3', 'hi'], strategy: 'push' }),
  ],
  marks: [
    ruleX({ stroke: '#64748b', channels: { x: { field: 'species' }, y1: { field: 'lo' }, y2: { field: 'hi' } } }),
    rect({ fill: '#4c78a8', fillOpacity: 0.5, channels: { x: { field: 'species' }, width: { value: 50 }, y1: { field: 'q1' }, y2: { field: 'q3' } } }),
    handle('median', 0, '#e45756'),
    handle('q1', 1, '#4c78a8'), handle('q3', 1, '#4c78a8'), //! stage 1: the box
    handle('lo', 2, '#0f172a'), handle('hi', 2, '#0f172a'), //! stage 2: the whiskers
  ],
});
mount(chart);
const controls = document.createElement('div');
controls.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:6px;font:13px system-ui';
const next = document.createElement('button');
next.textContent = 'Next';
const label = document.createElement('span');
const show = () => { label.textContent = 'Now setting: ' + chart.getStageLabel(); };
next.onclick = () => chart.nextStage(); //! advance the elicitation
chart.on('stage', show); show();
controls.append(next, label);
mount(controls);`,
    },
  ],
});

GALLERY.add({
  id: 'vl-boxplot_preaggregated',
  status: 'full',
  verdict: 'The pre-aggregated summaries map onto a `ruleY` whisker, a `barX` box and a white `tickX` median under the chart `title`; the flattened outliers are a context table drawn as dots.',
  prep: ['prep-reshape'],
  gaps: [
    'The `outliers` arrays are flattened into a context table of their own (Vega-Lite flattens them inside the spec).',
  ],
  recreation: { code: `const summary = [
  { Species: 'Adelie', lower: 2850, q1: 3350, median: 3700, q3: 4000, upper: 4775, outliers: [] },
  { Species: 'Chinstrap', lower: 2700, q1: 3487.5, median: 3700, q3: 3950, upper: 4800, outliers: [2700, 4800] },
  { Species: 'Gentoo', lower: 3950, q1: 4700, median: 5000, q3: 5500, upper: 6300, outliers: [] },
];
const boxes = summary.map(({ outliers, ...s }) => s);
const outliers = summary.flatMap((s) => s.outliers.map((value) => ({ Species: s.Species, value })));
const Species = { type: 'categorical', domain: ['Gentoo', 'Chinstrap', 'Adelie'] };
const mass = { type: 'quantitative', domain: [2500, 6500] };

mount(Elicit({
  width: 420, height: 190,
  margins: { top: 10, right: 16, bottom: 30, left: 70 },
  title: 'Body Mass of Penguin Species (g)',
  schema: {
    data: { Species, lower: mass, q1: mass, median: mass, q3: mass, upper: mass },
    outliers: { context: true, fields: { Species, value: mass } }, // the flattened outlier rows
  },
  data: { data: boxes, outliers },
  marks: [
    ruleY({ stroke: 'black', channels: { y: { field: 'Species' }, x1: { field: 'lower' }, x2: { field: 'upper' } } }),
    rect({ channels: { y: { field: 'Species' }, height: { value: 14 }, x1: { field: 'q1' }, x2: { field: 'q3' },
                       // listed in domain order (bottom-up), so Adelie keeps the first colour
                       fill: { field: 'Species', scale: { range: ['#e45756', '#f58518', '#4c78a8'] } } } }),
    tickX({ stroke: 'white', strokeWidth: 1.5, length: 14, channels: { y: { field: 'Species' }, x: { field: 'median' } } }),
    point({ table: 'outliers', fill: 'none', stroke: '#4c78a8', strokeWidth: 1.5, size: 3,
            channels: { y: { field: 'Species' }, x: { field: 'value' } } }),
  ],
}));` },
  interfaces: [
    {
      title: 'Brush the box',
      question: 'A fourth species, the Emperor penguin, is far heavier. Sketch its box beside the three measured ones.',
      try: 'Drag the white median tick to place the whole box, or a dark whisker tick to set that end. Shift-drag the box’s ends to set the quartiles, or its middle to slide them.',
      why: 'The three measured species are a context table, drawn by their own marks and never part of the answer. On the Emperor row, `follow` carries the box and whiskers with the median, and `brushSpan` edits the interquartile box by both edges and its body. The brush claims every press on the plot, so it waits for `when.shift` and a plain press falls through to the ticks.',
      uses: ['brushSpan()', 'when.shift', 'move()', 'follow()', 'context table'],
      code: `const mass = { type: 'quantitative', domain: [2000, 45000] };
const Species = { type: 'categorical', domain: ['Emperor', 'Gentoo', 'Chinstrap', 'Adelie'] };
const fields = { Species, lower: mass, q1: mass, median: mass, q3: mass, upper: mass };
const measured = [
  { Species: 'Adelie', lower: 2850, q1: 3350, median: 3700, q3: 4000, upper: 4775 },
  { Species: 'Chinstrap', lower: 2700, q1: 3487.5, median: 3700, q3: 3950, upper: 4800 },
  { Species: 'Gentoo', lower: 3950, q1: 4700, median: 5000, q3: 5500, upper: 6300 },
];
const y = { field: 'Species' };
const handle = (f, o) => tickX({ strokeWidth: 3, length: 18, ...o, channels: { y, x: { field: f, edit: move() } } });

mount(Elicit({
  width: 440, height: 220,
  margins: { top: 10, right: 16, bottom: 36, left: 70 },
  axes: { x: { title: 'Body mass (g)' } },
  schema: { data: fields, measured: { context: true, fields } }, //! the measured species are context
  data: { data: [{ Species: 'Emperor', lower: 8000, q1: 10000, median: 12000, q3: 14000, upper: 16000 }], measured },
  constraints: [
    follow({ field: ['lower', 'q1', 'q3', 'upper'], lead: 'median' }), //! the median carries the box
    ordering({ field: ['lower', 'q1', 'median', 'q3', 'upper'], strategy: 'push' }),
  ],
  marks: [
    ruleY({ table: 'measured', stroke: '#94a3b8', channels: { y, x1: { field: 'lower' }, x2: { field: 'upper' } } }),
    barX({ table: 'measured', fill: '#94a3b8', channels: { y, x1: { field: 'q1' }, x2: { field: 'q3' } } }),
    tickX({ table: 'measured', stroke: 'white', strokeWidth: 1.5, length: 14, channels: { y, x: { field: 'median' } } }),
    ruleY({ stroke: '#64748b', channels: { y, x1: { field: 'lower' }, x2: { field: 'upper' } } }),
    barX({
      fill: '#4c78a8', fillOpacity: 0.7,
      channels: { y, x1: { field: 'q1' }, x2: { field: 'q3' } },
      edits: [ brushSpan({ edgeInset: 8, when: when.shift }) ], //! Shift: the box's two edges and body
    }),
    handle('lower', { stroke: '#0f172a' }), handle('upper', { stroke: '#0f172a' }),
    handle('median', { stroke: 'white' }), //! drag the centre
  ],
}));`,
    },
  ],
});
