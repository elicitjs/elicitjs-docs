// Gallery entries — Observable Plot, "Dot, Image, Text". See AUTHORING.md.

// ---------------------------------------------------------------- scatterplots

GALLERY.add({
  id: 'plot-scatterplot',
  status: 'full',
  verdict: 'A `point` mark with a stroke encoding for sex, over the penguins dataset.',
  prep: ['prep-calculate'],
  gaps: [
    'Rows with no flipper length are dropped; rows with no recorded sex are kept as `n/a`.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.flipper_length_mm))
  .map((d) => ({ flipper: d.flipper_length_mm, mass: d.body_mass_g, sex: d.sex ?? 'n/a' }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 34, right: 16, bottom: 36, left: 66 },
  data: penguins,
  schema: {
    flipper: { type: 'quantitative', domain: [170, 235] },
    mass:    { type: 'quantitative', domain: [2500, 6500] },
    sex:     { type: 'categorical', domain: ['FEMALE', 'MALE', 'n/a'] },
  },
  axes: {
    x: { title: 'flipper_length_mm →', grid: true },
    y: { title: 'body_mass_g →', grid: true },
  },
  marks: [
    point({
      size: 3, fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'flipper' },
        y: { field: 'mass' },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118', '#ff725c'] }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Add the juveniles',
      question: 'Juvenile penguins are not in this dataset. Where would five of them fall?',
      try: 'Click empty space to add a juvenile; drag yours to adjust; Alt-click one to remove it.',
      why: '`lock: \'seed\'` freezes the observed penguins, so only the rows you add can move. `create()` inverts the click through both scales and the schema `default` tags each new row `juvenile`; `count` caps you at five.',
      uses: ['create()', 'move()', 'remove()', 'lock', 'count()'],
      code: `const observed = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.flipper_length_mm) && d.sex != null)
  .map((d) => ({ flipper: d.flipper_length_mm, mass: d.body_mass_g, sex: d.sex }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 34, right: 16, bottom: 36, left: 66 },
  data: observed,
  lock: 'seed',                                              //! the observed penguins are given, not elicited
  schema: {
    flipper: { type: 'quantitative', domain: [150, 235] },
    mass:    { type: 'quantitative', domain: [1000, 6500] },
    sex:     { type: 'categorical', domain: ['FEMALE', 'MALE', 'juvenile'], default: 'juvenile' }, //! every row you add is a juvenile
  },
  constraints: [ count({ max: observed.length + 5 }) ],      //! five guesses, no more
  axes: {
    x: { title: 'flipper_length_mm →', grid: true },
    y: { title: 'body_mass_g →', grid: true },
  },
  marks: [
    point({
      size: 3.5, strokeWidth: 1.5,
      channels: {
        x: { field: 'flipper' },
        y: { field: 'mass' },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118', '#e4572e'] }, legend: { anchor: 'top' } },
        fill: { field: 'sex', scale: { range: ['none', 'none', '#e4572e'] } },
      },
      edits: [
        create({ when: when.noAlt }),                        //! click empty space to add one
        move({ channels: ['x', 'y'] }),
        remove({ when: when.alt }),
      ],
    }),
  ],
}))`,
    },
    {
      title: 'Box the males',
      question: 'Draw the range of flipper length and body mass that holds most adult male penguins.',
      try: 'Drag the box’s body to move it, its edges or corners to resize it.',
      why: 'The answer is one row of four columns, drawn by a `rect`. `brushRect()` maps the body, each edge and each corner to the columns they move. The observed penguins are `context` rows with columns of their own: drawn, read-only, and left out of `getData()`.',
      uses: ['brushRect()', 'rect', 'context'],
      code: `const observed = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.flipper_length_mm))
  .map((d) => ({ flipper: d.flipper_length_mm, mass: d.body_mass_g, male: d.sex === 'MALE' ? 'male' : 'other' }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 66 },
  schema: {
    x1: { type: 'quantitative', domain: [170, 235] },
    x2: { type: 'quantitative', domain: [170, 235] },
    y1: { type: 'quantitative', domain: [2500, 6500] },
    y2: { type: 'quantitative', domain: [2500, 6500] },
    flipper: { type: 'quantitative', domain: [170, 235] },
    mass:    { type: 'quantitative', domain: [2500, 6500] },
    male:    { type: 'categorical', domain: ['male', 'other'] },
  },
  data: [...observed, { x1: 195, x2: 215, y1: 3800, y2: 4800 }],
  context: (d) => d.flipper != null,                         //! every penguin, as read-only context
  axes: {
    x: { title: 'flipper_length_mm →', grid: true },
    y: { title: 'body_mass_g →', grid: true },
  },
  marks: [
    point({
      size: 2.5, fill: 'none', strokeWidth: 1.2,
      channels: {
        x: { field: 'flipper' }, y: { field: 'mass' },
        stroke: { field: 'male', scale: { range: ['#efb118', '#cbd5e1'] } },
      },
    }),
    rect({
      fill: '#efb118', fillOpacity: 0.18, stroke: '#b7791f', strokeWidth: 1.5,
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' },
        y1: { field: 'y1' }, y2: { field: 'y2' },
      },
      edits: [ brushRect({ edgeInset: 10 }) ],               //! body moves, edges and corners resize
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-color-scatterplot',
  status: 'full',
  verdict: 'A `point` mark with x, y and a categorical stroke for species.',
  prep: ['prep-calculate'],
  gaps: ['Rows with no culmen measurement are dropped.'],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ length: d.culmen_length_mm, depth: d.culmen_depth_mm, species: d.species }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: penguins,
  schema: {
    length:  { type: 'quantitative', domain: [32, 60] },
    depth:   { type: 'quantitative', domain: [13, 22] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  },
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: 'culmen_depth_mm →' } },
  marks: [
    point({
      size: 3, fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'length' },
        y: { field: 'depth' },
        stroke: { field: 'species', scale: { range: ['#4269d0', '#efb118', '#ff725c'] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Classify the unknowns',
      question: 'Eight penguins were measured but not identified. Which species is each one?',
      try: 'Click a black dot to step it through the species.',
      why: '`cycle()` on the `stroke` channel advances the clicked row to the next value in the field’s domain. The `lock` predicate fixes every identified penguin, so only the eight unknowns respond.',
      uses: ['cycle()', 'lock'],
      code: `const all = (await plotData('penguins')).filter((d) => Number.isFinite(d.culmen_length_mm));
const mystery = [5, 60, 155, 165, 200, 230, 290, 320].map((i) => all[i]);
const rows = [
  ...mystery.map((d) => ({ length: d.culmen_length_mm, depth: d.culmen_depth_mm, species: '?' })),
  ...all.filter((d) => !mystery.includes(d))
    .map((d) => ({ length: d.culmen_length_mm, depth: d.culmen_depth_mm, species: d.species })),
];

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 34, right: 16, bottom: 36, left: 54 },
  data: rows,
  lock: (d, i) => i >= mystery.length,                      //! only the first eight rows are yours
  schema: {
    length:  { type: 'quantitative', domain: [32, 60] },
    depth:   { type: 'quantitative', domain: [13, 22] },
    species: { type: 'categorical', domain: ['?', 'Adelie', 'Chinstrap', 'Gentoo'] },
  },
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: 'culmen_depth_mm →' } },
  marks: [
    point({
      size: 3, fill: 'none', strokeWidth: 1.5, opacity: 0.5,
      channels: {
        x: { field: 'length' }, y: { field: 'depth' },
        stroke: { field: 'species', scale: { range: ['#111', '#4269d0', '#efb118', '#ff725c'] }, legend: { anchor: 'top' } },
      },
    }),
    point({
      size: 6, strokeWidth: 2.5, fill: 'white',
      channels: {
        x: { field: 'length' }, y: { field: 'depth' },
        stroke: { field: 'species', scale: { range: ['#111', '#4269d0', '#efb118', '#ff725c'] }, edit: cycle() }, //! a click steps the species
        opacity: { fn: (d, i) => (i < mystery.length ? 1 : 0) },
      },
    }),
  ],
}))`,
    },
    {
      title: 'Drag the centres',
      question: 'Where is the typical bill of each species: its average length and depth?',
      try: 'Drag near a labelled dot to move it; the nearest one follows.',
      why: '`pick: \'nearest\'` lets the press land anywhere within `threshold` pixels, and `guide: true` draws the catchment so you can see which dot you will take. The observed penguins are `context` rows with columns of their own: drawn behind, never part of the answer.',
      uses: ['move()', "pick: 'nearest'", 'context'],
      code: `const observed = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ kind: d.species, bill: d.culmen_length_mm, billDepth: d.culmen_depth_mm }));
const colour = { Adelie: '#4269d0', Chinstrap: '#efb118', Gentoo: '#ff725c' };

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  schema: {
    length:    { type: 'quantitative', domain: [32, 60] },
    depth:     { type: 'quantitative', domain: [13, 22] },
    species:   { type: 'categorical', domain: Object.keys(colour) },
    bill:      { type: 'quantitative', domain: [32, 60] },
    billDepth: { type: 'quantitative', domain: [13, 22] },
    kind:      { type: 'categorical', domain: Object.keys(colour) },
  },
  data: [...observed, ...Object.keys(colour).map((species) => ({ species, length: 46, depth: 17.5 }))],
  context: (d) => d.bill != null,                           //! the observed penguins are read-only context
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: 'culmen_depth_mm →' } },
  marks: [
    point({
      size: 2.5, fill: 'none', opacity: 0.3,
      channels: { x: { field: 'bill' }, y: { field: 'billDepth' }, stroke: { field: 'kind', scale: { range: Object.values(colour) } } },
    }),
    point({
      size: 8, stroke: 'white', strokeWidth: 2,
      channels: {
        x: { field: 'length' }, y: { field: 'depth' },
        fill: { field: 'species', scale: { range: Object.values(colour) } },
      },
      edits: [ move({ channels: ['x', 'y'], pick: 'nearest', threshold: 50, guide: true }) ], //! grab the nearest dot from up to 50px away
    }),
    text({
      fontSize: 11, dy: -14, lineAnchor: 'bottom',
      channels: { x: { field: 'length' }, y: { field: 'depth' }, text: { field: 'species' } },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-diverging-color-scatterplot',
  status: 'full',
  verdict: 'Monthly temperature anomalies as dots on a temporal x axis, with a diverging `RdBu` stroke ramp and a zero rule.',
  prep: [],
  gaps: [
        'Plot’s `BuRd` is `RdBu` reversed here.',
  ],
  recreation: {
    code: `const gistemp = await plotData('observablehq__plot-diverging-color-scatterplot', 'gistemp.csv');

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 30, right: 16, bottom: 30, left: 54 },
  data: gistemp,
  schema: {
    Date:    { type: 'temporal', domain: [new Date('1880-01-01'), new Date('2017-01-01')] },
    Anomaly: { type: 'quantitative', domain: [-0.8, 1.4] },
  },
  axes: { x: {}, y: { title: 'Surface temperature anomaly (°C) →', grid: true, tickFormat: '+.1f' } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({
      size: 2, fill: 'none',
      channels: {
        x: { field: 'Date' }, y: { field: 'Anomaly' },
        stroke: { field: 'Anomaly', scale: { type: 'diverging', scheme: 'RdBu', reverse: true }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Forecast the decades',
      question: 'What will the global temperature anomaly be in 2030, 2040 and 2050?',
      try: 'Drag the three hollow dots up or down.',
      why: 'The annual means since 1950 are seed rows held by a `lock` predicate; the three future rows are free. `move()` on `y` alone keeps each forecast on its year, `snap` rounds to 0.05 °C, and the stroke re-derives from the value you set.',
      uses: ['move()', 'lock', 'snap()', 'clamp()'],
      code: `const gistemp = await plotData('observablehq__plot-diverging-color-scatterplot', 'gistemp.csv');
const annual = d3.rollups(gistemp, (v) => d3.mean(v, (d) => d.Anomaly), (d) => d.Date.getUTCFullYear())
  .filter(([year]) => year >= 1950)
  .map(([year, a]) => ({ Date: new Date(Date.UTC(year, 6, 1)), Anomaly: +a.toFixed(2), kind: 'observed' }));
const future = [2030, 2040, 2050].map((y) => ({ Date: new Date(Date.UTC(y, 6, 1)), Anomaly: 0.9, kind: 'forecast' }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 30, right: 16, bottom: 30, left: 54 },
  data: [...annual, ...future],
  lock: (d) => d.kind === 'observed',                       //! history is fixed; the forecasts are yours
  schema: {
    Date:    { type: 'temporal', domain: [new Date('1950-01-01'), new Date('2052-01-01')] },
    Anomaly: { type: 'quantitative', domain: [-0.5, 3] },
    kind:    { type: 'categorical', domain: ['observed', 'forecast'] },
  },
  constraints: [ snap({ step: 0.05 }), clamp({ min: -0.5, max: 3 }) ],
  axes: { x: {}, y: { title: 'Anomaly (°C) →', grid: true, tickFormat: '+.1f' } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({
      fill: 'white', strokeWidth: 2,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Anomaly', edit: move() },               //! drag a forecast up or down
        size: { field: 'kind', scale: { range: [3, 7] } },
        stroke: { field: 'Anomaly', scale: { type: 'diverging', scheme: 'RdBu', reverse: true } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-symbol-channel',
  status: 'full',
  verdict: 'A `shape` mark with species on both `stroke` and `symbol` (circle, plus and times paths), and a symbol legend.',
  prep: ['prep-calculate'],
  gaps: [
    'The plus and times symbols are short SVG paths on the `symbol` scale’s range; `circle` is a named shape.',
    'The symbol legend keys one encoding, so its chips are ink rather than species colours, and its circle is filled where the marks are hollow.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.body_mass_g))
  .map((d) => ({ mass: d.body_mass_g, flipper: d.flipper_length_mm, species: d.species }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 34, right: 16, bottom: 36, left: 54 },
  data: penguins,
  schema: {
    mass:    { type: 'quantitative', domain: [2500, 6500] },
    flipper: { type: 'quantitative', domain: [170, 235] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  },
  axes: { x: { title: 'Body mass (g) →', grid: true }, y: { title: 'Flipper length (mm) →', grid: true } },
  marks: [
    shape({
      size: 4, fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'mass' }, y: { field: 'flipper' },
        stroke: { field: 'species', scale: { range: ['#4269d0', '#efb118', '#ff725c'] } },
        symbol: { field: 'species', scale: { range: ['circle', 'M0 5 L10 5 M5 0 L5 10', 'M0 0 L10 10 M10 0 L0 10'] }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Pick from the legend',
      question: 'Six penguins lost their tags. Which species is each one?',
      try: 'Click a black ✚ to select it, then click a species in the legend.',
      why: '`select()` makes the clicked row the chart’s selection, and `edit.legend.category()` on the symbol legend writes the swatch you click into that row. The key is the picker, so the answer uses the same vocabulary the chart reads with.',
      uses: ['select()', 'edit.legend.category()', 'legendSymbol', 'lock'],
      code: `const all = (await plotData('penguins')).filter((d) => Number.isFinite(d.body_mass_g));
const lost = [12, 80, 160, 180, 240, 300].map((i) => all[i]);
const rows = [
  ...lost.map((d) => ({ mass: d.body_mass_g, flipper: d.flipper_length_mm, species: 'unknown' })),
  ...all.filter((d) => !lost.includes(d)).map((d) => ({ mass: d.body_mass_g, flipper: d.flipper_length_mm, species: d.species })),
];

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 40, right: 16, bottom: 36, left: 54 },
  data: rows,
  lock: (d, i) => i >= lost.length,
  schema: {
    mass:    { type: 'quantitative', domain: [2500, 6500] },
    flipper: { type: 'quantitative', domain: [170, 235] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo', 'unknown'] },
  },
  axes: { x: { title: 'Body mass (g) →', grid: true }, y: { title: 'Flipper length (mm) →', grid: true } },
  marks: [
    point({
      size: 5,
      channels: {
        x: { field: 'mass' }, y: { field: 'flipper' },
        fill: { field: 'species', scale: { range: ['#4269d0', '#efb118', '#ff725c', '#111'] } },
        symbol: { field: 'species', scale: { range: ['●', '▲', '■', '✚'] } },
      },
      edits: [ select() ],                                   //! click a penguin to select it
    }),
    legendSymbol({ anchor: 'top', swatchSize: 16, edit: edit.legend.category() }), //! the legend writes the selected row
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-scatterplot-with-interactive-tips',
  status: 'full',
  verdict: 'The 11,538 athletes draw as a weight × height scatterplot stroked by sex, and `tip: true` shows each athlete’s name, sport and measurements on hover.',
  prep: ['prep-calculate'],
  gaps: [
    'Athletes with no recorded weight or height are dropped.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height))
  .map((d) => ({ name: d.name, sport: d.sport, weight: d.weight, height: d.height, sex: d.sex }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: olympians,
  schema: {
    name:   { type: 'categorical' },
    sport:  { type: 'categorical' },
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    sex:    { type: 'categorical', domain: ['female', 'male'] },
  },
  axes: { x: { title: 'weight →' }, y: { title: 'height →' } },
  marks: [
    point({
      size: 2.5, fill: 'none', strokeWidth: 1,
      tip: true,                                              // every column of the row under the pointer
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118'] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Place the athletes',
      question: 'Where does a typical gymnast, rower, basketball player and weightlifter sit by weight and height?',
      try: 'Drag near a labelled dot; the nearest one follows the pointer.',
      why: 'Four rows, one per sport, each drawn as a dot and a label from the same columns. `pick: \'nearest\'` grabs the closest dot so a small target is easy to take, and the label re-derives from the row you moved. The mark’s `tip` reads out the row under the pointer, and a tip never blocks a drag.',
      uses: ['move()', "pick: 'nearest'", 'tip', 'context'],
      code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
const sample = olympians.filter((d, i) => i % 6 === 0).map((d) => ({ kg: d.weight, m: d.height }));
const sports = ['gymnastics', 'rowing', 'basketball', 'weightlifting'];

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  schema: {
    sport:  { type: 'categorical', domain: sports },
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    kg:     { type: 'quantitative' },
    m:      { type: 'quantitative' },
  },
  data: [...sample, ...sports.map((sport, i) => ({ sport, weight: 45 + i * 30, height: 1.35 + i * 0.12 }))],
  context: (d) => d.kg != null,                             //! every sixth athlete, as read-only context
  constraints: [ clamp({ field: 'weight', min: 25, max: 175 }), clamp({ field: 'height', min: 1.2, max: 2.25 }) ],
  axes: { x: { title: 'weight →' }, y: { title: 'height →' } },
  marks: [
    point({
      size: 1.8, fill: 'none', stroke: '#cbd5e1',
      channels: { x: { field: 'kg' }, y: { field: 'm' } },
    }),
    point({
      size: 7, stroke: 'white', strokeWidth: 1.5,
      tip: { text: (d) => [d.sport, \`\${d.weight.toFixed(0)} kg · \${d.height.toFixed(2)} m\`] }, //! hover reads out your answer
      channels: { x: { field: 'weight' }, y: { field: 'height' }, fill: { field: 'sport' } },
      edits: [ move({ channels: ['x', 'y'], pick: 'nearest', threshold: 40, guide: { catchment: true } }) ], //! the nearest athlete follows the drag
    }),
    text({
      fontSize: 11, dx: 10, textAnchor: 'start',
      channels: { x: { field: 'weight' }, y: { field: 'height' }, text: { field: 'sport' } },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-proportional-symbol-scatterplot',
  status: 'full',
  verdict: 'Daily change against log volume, with dot radius also bound to volume and a rule at zero.',
  prep: ['prep-calculate'],
  gaps: ['Plot’s radius scale is a square-root scale; here `size` uses `scale: \'sqrt\'` with a hand-picked range.'],
  recreation: {
    code: `const aapl = (await plotData('aapl')).map((d) => ({ change: (d.Close - d.Open) / d.Open * 100, volume: d.Volume }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 16, bottom: 36, left: 66 },
  data: aapl,
  schema: {
    change: { type: 'quantitative', domain: [-6, 6] },
    volume: { type: 'quantitative', domain: [1e7, 3e8] },
  },
  scales: { y: { type: 'log' } },
  axes: {
    x: { title: 'Daily change (%) →', grid: true, tickFormat: '+d' },
    y: { title: 'Daily trading volume →', grid: true, ticks: 4, tickFormat: '.0s' },
  },
  marks: [
    rule({ stroke: '#111', channels: { x: { datum: 0 } } }),
    point({
      fill: 'none', stroke: '#111', strokeWidth: 1,
      channels: {
        x: { field: 'change' }, y: { field: 'volume' },
        size: { field: 'volume', scale: { type: 'sqrt', range: [0, 9] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Volume on a big day',
      question: 'When Apple’s price moves this much in a day, how many shares trade?',
      try: 'Drag each dot up or down; its size follows.',
      why: 'The change is fixed per row and only `y` carries `move()`. The edit inverts the pointer through the same log scale that placed the dot, so the drag is proportional, and `size` re-derives from the volume you set.',
      uses: ['move()', "scale: 'log'", 'clamp()'],
      code: `mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 66 },
  data: [-6, -4, -2, -0.5, 0.5, 2, 4, 6].map((change) => ({ change, volume: 5e7 })),
  schema: {
    change: { type: 'quantitative', domain: [-7, 7] },
    volume: { type: 'quantitative', domain: [1e7, 3e8] },
  },
  scales: { y: { type: 'log' } },                            //! the drag inverts through the log scale
  constraints: [ clamp({ field: 'volume', min: 1e7, max: 3e8 }) ],
  axes: {
    x: { title: 'Daily change (%) →', grid: true, tickFormat: '+d' },
    y: { title: 'Daily trading volume →', grid: true, ticks: 4, tickFormat: '.0s' },
  },
  marks: [
    rule({ stroke: '#111', channels: { x: { datum: 0 } } }),
    point({
      fill: '#4269d0', fillOpacity: 0.25, stroke: '#4269d0', strokeWidth: 1.5,
      channels: {
        x: { field: 'change' },
        y: { field: 'volume', edit: move() },                //! only volume is yours to set
        size: { field: 'volume', scale: { type: 'sqrt', range: [0, 14] } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-scatterplot-with-ordinal-dimension',
  status: 'full',
  verdict: 'Body mass on x against a categorical species axis, stroked by sex.',
  prep: ['prep-calculate'],
  gaps: ['Rows with no body mass are dropped; rows with no recorded sex are kept as `n/a`.'],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.body_mass_g))
  .map((d) => ({ mass: d.body_mass_g, species: d.species, sex: d.sex ?? 'n/a' }));

mount(Elicit({
  width: 460, height: 200,
  margins: { top: 30, right: 16, bottom: 36, left: 70 },
  data: penguins,
  schema: {
    mass:    { type: 'quantitative', domain: [2600, 6400] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    sex:     { type: 'categorical', domain: ['FEMALE', 'MALE', 'n/a'] },
  },
  scales: { y: { reverse: true } },                         // first species at the top, as in Plot
  axes: { x: { title: 'body_mass_g →' }, y: {} },
  marks: [
    point({
      size: 3, fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'mass' }, y: { field: 'species' },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118', '#ff725c'] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Typical mass by sex',
      question: 'What does a typical female and a typical male of each species weigh?',
      try: 'Drag each dot left or right.',
      why: 'Six rows, one per species × sex. `move()` on `x` alone keeps a dot on its species row; `snap` rounds to 50 g and `clamp` keeps the answer inside the observed range.',
      uses: ['move()', 'snap()', 'clamp()'],
      code: `const species = ['Adelie', 'Chinstrap', 'Gentoo'];
mount(Elicit({
  width: 460, height: 200,
  margins: { top: 30, right: 16, bottom: 36, left: 70 },
  data: species.flatMap((s) => [{ species: s, sex: 'FEMALE', mass: 4000 }, { species: s, sex: 'MALE', mass: 4400 }]),
  schema: {
    mass:    { type: 'quantitative', domain: [2600, 6400] },
    species: { type: 'categorical', domain: species },
    sex:     { type: 'categorical', domain: ['FEMALE', 'MALE'] },
  },
  constraints: [ snap({ step: 50 }), clamp({ min: 2700, max: 6300 }) ], //! 50 g steps, inside the observed range
  scales: { y: { reverse: true } },
  axes: { x: { title: 'body_mass_g →', grid: true }, y: {} },
  marks: [
    point({
      size: 7, fill: 'white', strokeWidth: 3,
      channels: {
        x: { field: 'mass', edit: move() },                  //! drag along x only
        y: { field: 'species' },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118'] }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
    },
    {
      title: 'Range per species',
      question: 'Between what body masses do most penguins of each species fall?',
      try: 'Drag a bar’s end to stretch it, or its middle to slide the whole range.',
      why: 'Each species is one row with a low and a high column, drawn by a `barX` spanning `x1`→`x2`. `brushSpan()` reads where you press: near an end it moves that end, in the middle it moves both. `ordering` keeps `lo` below `hi`.',
      uses: ['brushSpan()', 'barX', 'ordering()'],
      code: `const species = ['Adelie', 'Chinstrap', 'Gentoo'];
mount(Elicit({
  width: 460, height: 200,
  margins: { top: 30, right: 16, bottom: 36, left: 70 },
  data: species.map((s) => ({ species: s, lo: 3800, hi: 4800 })),
  schema: {
    species: { type: 'categorical', domain: species },
    lo:      { type: 'quantitative', domain: [2600, 6400] },
    hi:      { type: 'quantitative', domain: [2600, 6400] },
  },
  constraints: [ ordering({ field: ['lo', 'hi'] }) ],         //! the low end stays below the high end
  scales: { y: { reverse: true } },
  axes: { x: { title: 'body_mass_g →', grid: true }, y: {} },
  marks: [
    barX({
      fill: '#4269d0', fillOpacity: 0.3, stroke: '#4269d0',
      channels: { x1: { field: 'lo' }, x2: { field: 'hi' }, y: { field: 'species' } },
      edits: [ brushSpan({ channels: ['x1', 'x2'], threshold: 30, edgeInset: 10 }) ], //! ends resize, the body slides
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-stacked-dots',
  status: 'full',
  verdict: 'Members of Congress by age, stacked up for men and down for women; the stack offset is computed in JavaScript and drawn with `point`.',
  prep: ['prep-calculate', 'prep-stack'],
  gaps: [
    'The stack is a precomputed y position (Plot’s `stackY2`), so it is a picture of a stack, not a live one.',
  ],
  recreation: {
    code: `const congress = await plotData('observablehq__plot-stacked-dots', 'us-congress-2023.csv');
// stackY2: the k-th member of an (age, gender) group sits at ±k.
const seen = new Map();
const rows = congress.map((d) => {
  const age = 2023 - d.birthday.getUTCFullYear();
  const key = age + d.gender;
  const k = (seen.get(key) || 0) + 1;
  seen.set(key, k);
  return { age, gender: d.gender, y: d.gender === 'M' ? k - 0.5 : -(k - 0.5) };
});

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 20, right: 16, bottom: 36, left: 50 },
  data: rows,
  schema: {
    age:    { type: 'quantitative', domain: [26, 92] },
    gender: { type: 'categorical', domain: ['F', 'M'] },
    y:      { type: 'quantitative', domain: [-9, 17] },
  },
  axes: {
    x: { title: 'Age (years) →' },
    y: { title: '← Women · Men →', grid: true, tickFormat: (v) => Math.abs(v) },
  },
  marks: [
    point({
      size: 2.2,
      channels: {
        x: { field: 'age' }, y: { field: 'y' },
        fill: { field: 'gender', scale: { range: ['#4269d0', '#efb118'] } },
      },
    }),
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'One token per member',
      question: 'Picture 20 newly elected members of Congress. How old is each one?',
      try: 'Click above an age band to add a member there; click a token to take it back.',
      why: '`dotStack` draws one token per row and stacks them by the band they fall in, so the shape of the answer is the count in each band. `create()` adds a row where you click, `remove()` takes one away, and `count` holds the total to 20.',
      uses: ['dotStack', 'create()', 'remove()', 'count()'],
      code: `const bands = ['25–34', '35–44', '45–54', '55–64', '65–74', '75–84', '85+'];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 20, right: 16, bottom: 34, left: 16 },
  axes: { x: { title: 'Age at election →' }, y: false },
  data: [{ age: '45–54' }, { age: '55–64' }, { age: '55–64' }],
  schema: { age: { type: 'ordinal', domain: bands } },
  scales: { x: { type: 'band' } },
  constraints: [ count({ max: 20, strategy: 'reject' }) ],     //! twenty members, no more
  marks: [
    dotStack({
      size: 7, fill: '#4269d0', label: true,
      channels: { x: { field: 'age' } },
      edits: [ create({ gesture: 'click', channels: ['x'] }), remove() ], //! click a band to add, a token to remove
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- derived dots

GALLERY.add({
  id: 'plot-qq-plot',
  status: 'full',
  verdict: 'Sorted quantiles of two ceramic batches as dots, with the y = x diagonal drawn by a `line` over two context rows.',
  prep: ['prep-calculate', 'prep-window'],
  gaps: [
    'The quantile pairing is computed in JavaScript, as the notebook’s own `qq` helper does.',
  ],
  recreation: {
    code: `const raw = await plotData('observablehq__qq-plot', 'JAHANMI2.DAT', { type: 'text' });
const lines = raw.split('\\r\\n').slice(48, -1);
const [header, , ...cells] = lines.map((l) => l.trim().split(/\\s+/g));
const jahanmi2 = cells.map((r) => Object.fromEntries(header.map((h, i) => [h, +r[i]])));
// Both batches have 240 rows, so the k-th smallest of each pair up directly.
const X = d3.sort(jahanmi2.filter((d) => d.Bat === 2).map((d) => d.Y));
const Y = d3.sort(jahanmi2.filter((d) => d.Bat === 1).map((d) => d.Y));
const lo = Math.min(X[0], Y[0]), hi = Math.max(X.at(-1), Y.at(-1));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 30, right: 16, bottom: 36, left: 58 },
  schema: {
    batch2: { type: 'quantitative', domain: [300, 900] },
    batch1: { type: 'quantitative', domain: [300, 900] },
    diagX:  { type: 'quantitative', domain: [300, 900] },    // the y = x diagonal's own columns
    diagY:  { type: 'quantitative', domain: [300, 900] },
  },
  data: [{ diagX: lo, diagY: lo }, { diagX: hi, diagY: hi }, ...X.map((x, i) => ({ batch2: x, batch1: Y[i] }))],
  context: (d) => d.diagX != null,
  axes: { x: { title: 'Batch 2 →', grid: true }, y: { title: 'Batch 1 →', grid: true } },
  marks: [
    line({ stroke: '#111', channels: { x: { field: 'diagX' }, y: { field: 'diagY' } } }),
    point({ size: 3, fill: 'none', stroke: 'steelblue', strokeWidth: 1.5, channels: { x: { field: 'batch2' }, y: { field: 'batch1' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sketch the quantiles',
      question: 'Batch 1 is believed to be the stronger batch. How do you think its deciles compare with batch 2’s?',
      try: 'Drag each dot up or down. Dots above the diagonal mean batch 1 is stronger at that decile.',
      why: 'Each row is one decile: batch 2’s value is fixed on x, and `move()` on `y` sets batch 1’s. A quantile function can only rise, so `monotonic` along `batch2` keeps your sketch a valid Q–Q curve.',
      uses: ['move()', 'monotonic()', 'context', 'strokeDash'],
      code: `const raw = await plotData('observablehq__qq-plot', 'JAHANMI2.DAT', { type: 'text' });
const lines = raw.split('\\r\\n').slice(48, -1);
const [header, , ...cells] = lines.map((l) => l.trim().split(/\\s+/g));
const batch2 = cells.map((r) => Object.fromEntries(header.map((h, i) => [h, +r[i]]))).filter((d) => d.Bat === 2).map((d) => d.Y);
const deciles = d3.range(1, 10).map((k) => +d3.quantile(batch2, k / 10).toFixed(1));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 30, right: 16, bottom: 36, left: 58 },
  schema: {
    batch2: { type: 'quantitative', domain: [450, 850] },
    batch1: { type: 'quantitative', domain: [450, 850] },
    diagX:  { type: 'quantitative', domain: [450, 850] },    // the y = x reference's own columns
    diagY:  { type: 'quantitative', domain: [450, 850] },
  },
  data: [
    { diagX: 450, diagY: 450 }, { diagX: 850, diagY: 850 },
    ...deciles.map((x) => ({ batch2: x, batch1: x })),       // start on the diagonal: “no difference”
  ],
  context: (d) => d.diagX != null,                          // the diagonal is context, not an answer
  constraints: [ monotonic({ field: 'batch1', along: 'batch2' }) ], //! quantiles can only increase
  axes: { x: { title: 'Batch 2 decile →', grid: true }, y: { title: 'Batch 1 decile →', grid: true } },
  marks: [
    line({                                                    //! the y = x reference, dashed
      stroke: '#94a3b8', strokeDash: '4 3',
      channels: { x: { field: 'diagX' }, y: { field: 'diagY' } },
    }),
    point({
      size: 6, fill: 'white', stroke: 'steelblue', strokeWidth: 2.5,
      channels: { x: { field: 'batch2' }, y: { field: 'batch1', edit: move() } }, //! batch 1's value is yours
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-temperature-amplitude',
  status: 'full',
  verdict: 'Daily low against daily range for Seattle, filled by month on a cyclical rainbow ramp, with the widest day ringed and dated.',
  prep: ['prep-calculate'],
  gaps: [
    'The cyclical scale is a sequential ramp whose `range` is 13 samples of `d3.interpolateRainbow`, so January and December share a hue as in Plot.',
    'The widest day is picked in JavaScript (Plot’s `selectMaxY`) and drawn from one context row with columns of its own.',
  ],
  recreation: {
    code: `const weather = await plotData('observablehq__plot-temperature-amplitude', 'seattle-weather.csv');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const temps = weather.map((d) => ({ low: d.temp_min, delta: +(d.temp_max - d.temp_min).toFixed(1), month: d.date.getUTCMonth() }));
const w = weather[d3.maxIndex(temps, (d) => d.delta)];

mount(Elicit({
  width: 460, height: 420,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  schema: {
    low:   { type: 'quantitative', domain: [-8, 20] },
    delta: { type: 'quantitative', domain: [0, 20] },
    month: { type: 'quantitative', domain: [0, 11] },
    peakLow:   { type: 'quantitative' },                     // the widest day's own columns
    peakDelta: { type: 'quantitative' },
    date:      { type: 'categorical' },
  },
  data: [{ peakLow: w.temp_min, peakDelta: w.temp_max - w.temp_min, date: w.date.toISOString().slice(0, 10) }, ...temps],
  context: (d) => d.date != null,
  axes: { x: { title: 'Daily low temperature (°C) →' }, y: { title: 'Daily temperature variation (Δ°C) →' } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({
      size: 2.5,
      channels: {
        x: { field: 'low' }, y: { field: 'delta' },
        fill: {
          field: 'month', scale: { range: d3.quantize(d3.interpolateRainbow, 13) },
          legend: { anchor: 'top', title: false, tickFormat: (m) => months[m] },
        },
      },
    }),
    point({ size: 5, fill: 'none', stroke: '#111', strokeWidth: 1.5, channels: { x: { field: 'peakLow' }, y: { field: 'peakDelta' } } }),
    text({ fontSize: 11, dy: -10, lineAnchor: 'bottom', channels: { x: { field: 'peakLow' }, y: { field: 'peakDelta' }, text: { field: 'date' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Swing by month',
      question: 'In each month, how many degrees separate a typical Seattle day’s low from its high?',
      try: 'Drag each month’s dot up or down.',
      why: 'Twelve rows, one per month, on a categorical x axis. `move()` on `y` alone sets the swing, `snap` rounds to half a degree and `clamp` keeps it positive; the fill keeps the original’s month colours.',
      uses: ['move()', 'snap()', 'clamp()'],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

mount(Elicit({
  width: 460, height: 360,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: months.map((month) => ({ month, delta: 6 })),
  schema: {
    delta: { type: 'quantitative', domain: [0, 16] },
    month: { type: 'categorical', domain: months },
  },
  constraints: [ snap({ step: 0.5 }), clamp({ min: 0, max: 16 }) ],
  axes: { x: {}, y: { title: 'Typical daily variation (Δ°C) →', grid: true } },
  marks: [
    point({
      size: 7, stroke: 'white', strokeWidth: 1.5,
      channels: {
        x: { field: 'month' },
        y: { field: 'delta', edit: move() },                 //! drag a month's swing up or down
        fill: { field: 'month', scale: { range: d3.quantize((t) => d3.interpolateRainbow(t), 13).slice(0, 12) } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-linear-regression-simpson',
  status: 'full',
  verdict: 'Dots by species, with each species’ and the pooled least-squares line and 95% confidence band drawn from fitted context rows.',
  prep: ['prep-regression'],
  gaps: [
    'The fits and bands are computed in JavaScript (Plot’s `linearRegressionY`), with a normal 1.96 multiplier where Plot uses the t distribution.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ length: d.culmen_length_mm, depth: d.culmen_depth_mm, species: d.species }));
const colour = { Adelie: '#4269d0', Chinstrap: '#efb118', Gentoo: '#ff725c', all: '#111' };
function fit(group, rows) {                                  // least squares + 95% band on the mean
  const n = rows.length, mx = d3.mean(rows, (d) => d.length), my = d3.mean(rows, (d) => d.depth);
  const sxx = d3.sum(rows, (d) => (d.length - mx) ** 2);
  const b = d3.sum(rows, (d) => (d.length - mx) * (d.depth - my)) / sxx, a = my - b * mx;
  const s = Math.sqrt(d3.sum(rows, (d) => (d.depth - a - b * d.length) ** 2) / (n - 2));
  const [x1, x2] = d3.extent(rows, (d) => d.length);
  return d3.range(21).map((k) => {
    const length = x1 + (k / 20) * (x2 - x1), fit = a + b * length;
    const e = 1.96 * s * Math.sqrt(1 / n + (length - mx) ** 2 / sxx);
    return { group, at: length, fit, lo: fit - e, hi: fit + e };
  });
}
const fits = [...d3.groups(penguins, (d) => d.species).flatMap(([g, rows]) => fit(g, rows)), ...fit('all', penguins)];

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 34, right: 16, bottom: 36, left: 54 },
  schema: {
    length:  { type: 'quantitative', domain: [32, 60] },
    depth:   { type: 'quantitative', domain: [13, 22] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    group:   { type: 'categorical', domain: Object.keys(colour) }, // the fitted rows' own columns
    at:  { type: 'quantitative' },
    fit: { type: 'quantitative' }, lo: { type: 'quantitative' }, hi: { type: 'quantitative' },
  },
  data: [...fits, ...penguins],
  context: (d) => d.fit != null,
  axes: { x: { title: 'culmen_length_mm →', grid: true }, y: { title: 'culmen_depth_mm →', grid: true } },
  marks: [
    areaY({
      fillOpacity: 0.15, stroke: 'none',
      channels: {
        x: { field: 'at' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        series: { field: 'group' }, fill: { field: 'group', scale: { range: Object.values(colour) } },
      },
    }),
    lineY({
      strokeWidth: 1.5,
      channels: {
        x: { field: 'at' }, y: { field: 'fit' },
        series: { field: 'group' }, stroke: { field: 'group', scale: { range: Object.values(colour) } },
      },
    }),
    point({
      size: 3,
      channels: {
        x: { field: 'length' }, y: { field: 'depth' },
        fill: { field: 'species', scale: { range: Object.values(colour).slice(0, 3) }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'One line for everyone',
      question: 'Ignoring species, how does bill depth change with bill length across all penguins?',
      try: 'Drag the left handle to raise or lower the line, the right one to tilt it.',
      why: 'A `trend` is one row holding an intercept and a slope. `edit.trend.intercept()` and `edit.trend.slope()` each claim their own handle, so the two gestures never fight. The penguins sit behind as `context` rows.',
      uses: ['trend', 'edit.trend.intercept()', 'edit.trend.slope()', 'context'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ x: d.culmen_length_mm, y: d.culmen_depth_mm, species: d.species }));
const colour = { Adelie: '#4269d0', Chinstrap: '#efb118', Gentoo: '#ff725c' };

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  schema: {
    x: { type: 'quantitative', domain: [32, 60] },
    y: { type: 'quantitative', domain: [13, 22] },
    species:   { type: 'categorical', domain: Object.keys(colour) },
    intercept: { type: 'quantitative' },
    slope:     { type: 'quantitative' },
  },
  data: [...penguins, { intercept: 17, slope: 0 }],
  context: (d) => d.x != null,                              // the penguins: drawn, read-only, not reported
  constraints: [ clamp({ field: 'slope', min: -1, max: 1 }) ],
  axes: { origin: false, x: { title: 'culmen_length_mm →', grid: true }, y: { title: 'culmen_depth_mm →', grid: true } },
  marks: [
    point({
      size: 2.5, opacity: 0.35,
      channels: { x: { field: 'x' }, y: { field: 'y' }, fill: { field: 'species', scale: { range: Object.values(colour) } } },
    }),
    trend({
      anchor: 36, grip: 'probe', stroke: '#111', strokeWidth: 2.5,
      channels: {
        intercept: { field: 'intercept', edit: edit.trend.intercept() }, //! the left handle sets the level
        slope:     { field: 'slope',     edit: edit.trend.slope() },     //! the right handle sets the tilt
      },
    }),
  ],
}))`,
    },
    {
      title: 'A line per species',
      question: 'Now within each species: how does bill depth change with bill length?',
      try: 'Each colour is one species’ line. Drag its handles to fit the dots of that colour.',
      why: 'The same `trend` mark over three rows draws three lines; `stroke` encodes each row’s species. Fitting them one by one shows Simpson’s paradox: the within-species slopes rise while the pooled one falls.',
      uses: ['trend', 'edit.trend.intercept()', 'edit.trend.slope()'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ x: d.culmen_length_mm, y: d.culmen_depth_mm, species: d.species }));
const colour = { Adelie: '#4269d0', Chinstrap: '#efb118', Gentoo: '#ff725c' };

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 34, right: 16, bottom: 36, left: 54 },
  schema: {
    x: { type: 'quantitative', domain: [32, 60] },
    y: { type: 'quantitative', domain: [13, 22] },
    species:   { type: 'categorical', domain: Object.keys(colour) },
    intercept: { type: 'quantitative' },
    slope:     { type: 'quantitative' },
  },
  data: [
    ...penguins,                                             // the penguins: drawn, read-only, not reported
    { species: 'Adelie', intercept: 18.5, slope: 0 },
    { species: 'Chinstrap', intercept: 18, slope: 0 },
    { species: 'Gentoo', intercept: 15, slope: 0 },
  ],
  context: (d) => d.x != null,
  constraints: [ clamp({ field: 'slope', min: -1, max: 1 }) ],
  axes: { origin: false, x: { title: 'culmen_length_mm →', grid: true }, y: { title: 'culmen_depth_mm →', grid: true } },
  marks: [
    point({
      size: 2.5, opacity: 0.35,
      channels: { x: { field: 'x' }, y: { field: 'y' }, fill: { field: 'species', scale: { range: Object.values(colour) } } },
    }),
    trend({
      anchor: 36, grip: 'probe', strokeWidth: 2.5,
      channels: {
        intercept: { field: 'intercept', edit: edit.trend.intercept() },
        slope:     { field: 'slope',     edit: edit.trend.slope() },
        stroke:    { field: 'species', scale: { range: Object.values(colour) }, legend: { anchor: 'top' } }, //! one row, one line, one colour
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dot-plot',
  status: 'full',
  verdict: 'Each state’s age-group shares as coloured dots on one row, with a min–max rule and the state name at the left end.',
  prep: ['prep-reshape', 'prep-aggregate', 'prep-calculate'],
  gaps: [
    'Each state’s min and max share are computed in JavaScript (Plot’s `groupY` reducer) into context rows that the rule and the label read.',
  ],
  recreation: {
    code: `const wide = await plotData('observablehq__plot-dot-plot', 'us-population-state-age.csv');
const ages = ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '≥80'];
// Fold wide → tidy, then normalize each state to shares (Plot’s normalizeX "sum").
const rows = wide.flatMap((d) => {
  const total = d3.sum(ages, (a) => d[a]);
  return ages.map((age) => ({ state: d.name, age, share: d[age] / total }));
});
const ranges = d3.rollups(rows, (v) => d3.extent(v, (d) => d.share), (d) => d.state)
  .map(([state, [lo, hi]]) => ({ state, lo, hi }));
const states = d3.sort(ranges, (d) => d.lo).map((d) => d.state);

mount(Elicit({
  width: 460, height: 680,
  margins: { top: 30, right: 16, bottom: 10, left: 16 },
  schema: {
    state: { type: 'categorical', domain: states },
    age:   { type: 'ordinal', domain: ages },
    share: { type: 'quantitative', domain: [0, 0.22] },
    lo:    { type: 'quantitative' },                         // the range rows' own columns
    hi:    { type: 'quantitative' },
  },
  data: [...ranges, ...rows],                                // one range row per state: its min and max share
  context: (d) => d.lo != null,
  scales: { y: { reverse: true } },                         // lowest minimum share first, as Plot sorts
  axes: { x: { anchor: 'top', grid: true, tickFormat: '.0%' }, y: false },
  marks: [
    rule({ stroke: '#111', channels: { x: { datum: 0 } } }),
    rule({ stroke: '#999', channels: { y: { field: 'state' }, x1: { field: 'lo' }, x2: { field: 'hi' } } }),
    point({
      size: 3.5,
      channels: {
        x: { field: 'share' }, y: { field: 'state' },
        fill: { field: 'age', scale: { scheme: 'spectral' }, legend: { anchor: 'bottom', swatchSize: 10, gap: 4, labelWidth: 30 } },
      },
    }),
    text({
      fontSize: 9, textAnchor: 'end', dx: -6,
      channels: { x: { field: 'lo' }, y: { field: 'state' }, text: { field: 'state' } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Share out the ages',
      question: 'What share of the US population is in each age group?',
      try: 'Drag dots right to give an age group more people. The budget runs out at 100%.',
      why: 'Nine rows, one per age group, each a share in percent. `maintainSum` with `strategy: \'cap\'` stops a drag once the shares reach 100, and `guides.remaining` shows what is left to place, read off the same constraint.',
      uses: ['move()', 'maintainSum()', 'guides.remaining'],
      code: `const ages = ['<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '≥80'];
mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 50 },
  data: ages.map((age) => ({ age, share: 5 })),
  schema: {
    age:   { type: 'ordinal', domain: ages },
    share: { type: 'quantitative', domain: [0, 25] },
  },
  constraints: [ clamp({ min: 0 }), maintainSum({ total: 100, strategy: 'cap' }) ], //! the shares can't pass 100%
  scales: { y: { reverse: true } },
  axes: { x: { title: 'Share of population (%) →', grid: true }, y: {} },
  guides: [ guides.remaining({ field: 'share', unit: 'percentage point', format: '.0f' }) ], //! what's left to allocate
  marks: [
    rule({ stroke: '#ddd', channels: { y: { field: 'age' }, x1: { datum: 0 }, x2: { field: 'share' } } }),
    point({
      size: 7,
      channels: {
        x: { field: 'share', edit: move() },                 //! drag a share left or right
        y: { field: 'age' },
        fill: { field: 'age', scale: { scheme: 'spectral' } },
      },
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- images

GALLERY.defineFeatures({
  'background-image': { label: 'Background image', description: 'A raster image (or CSS background) behind the plot frame.' },
});

GALLERY.add({
  id: 'plot-background-image',
  status: 'partial',
  verdict: 'The white penguin dots, grid and frame draw, but not the sea-ice photograph behind them.',
  needs: ['background-image'],
  prep: ['prep-calculate'],
  gaps: [
    'No photograph: a chart cannot take an image (or a CSS background) behind its frame. A pale blue fill stands in.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ length: d.culmen_length_mm, depth: d.culmen_depth_mm }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 30, bottom: 36, left: 54 },
  data: penguins,
  schema: {
    length: { type: 'quantitative', domain: [31, 61] },
    depth:  { type: 'quantitative', domain: [12.8, 22] },
  },
  axes: { x: { title: 'culmen_length_mm →', grid: true }, y: { title: 'culmen_depth_mm →', grid: true } },
  guides: [
    guides.custom(({ width, height }) => [                    // frame + a flat stand-in for the photo
      { type: 'rect', x: 0, y: 0, width, height, fill: '#cfe3ee', stroke: '#111', background: true },
    ]),
  ],
  marks: [
    point({ size: 3, fill: 'white', stroke: 'black', channels: { x: { field: 'length' }, y: { field: 'depth' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Name the clusters',
      question: 'These are three penguin species. Which cluster is which?',
      try: 'Drag each label onto a cluster, then double-click it to type the species.',
      why: 'Each label is a row with a position and a name. `move()` places it and `editText()` on the `text` channel retypes it, so one mark collects both where the reader thinks a group is and what they call it.',
      uses: ['text', 'move()', 'editText()', 'context'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm))
  .map((d) => ({ bill: d.culmen_length_mm, billDepth: d.culmen_depth_mm }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 30, bottom: 36, left: 54 },
  schema: {
    length: { type: 'quantitative', domain: [31, 61] },
    depth:  { type: 'quantitative', domain: [12.8, 22] },
    name:   { type: 'categorical' },
    bill:      { type: 'quantitative' },                     // the penguins' own columns
    billDepth: { type: 'quantitative' },
  },
  data: [...penguins, ...[36, 46, 56].map((length) => ({ length, depth: 13.8, name: 'species?' }))],
  context: (d) => d.bill != null,                           //! the dots are context, not answers
  axes: { x: { title: 'culmen_length_mm →', grid: true }, y: { title: 'culmen_depth_mm →', grid: true } },
  guides: [
    guides.custom(({ width, height }) => [                    // frame + a flat stand-in for the photo
      { type: 'rect', x: 0, y: 0, width, height, fill: '#cfe3ee', stroke: '#111', background: true },
    ]),
  ],
  marks: [
    point({ size: 3, fill: 'white', stroke: '#333', channels: { x: { field: 'bill' }, y: { field: 'billDepth' } } }),
    text({
      fontSize: 14, fill: '#9a3412',
      channels: {
        x: { field: 'length' }, y: { field: 'depth' },
        text: { field: 'name', edit: editText() },            //! double-click to type a name
      },
      edits: [ move({ channels: ['x', 'y'] }) ],              //! drag to place it on a cluster
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-image-dodge',
  status: 'none',
  verdict: 'Portraits laid out by a dodge transform: ElicitJS has neither an image mark nor collision-avoiding placement.',
  needs: ['image-mark', 'dodge'],
  gaps: [
    'No mark draws an image per row, clipped to a circle.',
    'No `dodgeY` transform to pack the circles into a beeswarm.',
  ],
  alternative: 'A dot per president along the inauguration-date axis, stacked with `dotStack` by decade, asks the same “when” question without portraits.',
});

GALLERY.add({
  id: 'plot-image-medals',
  status: 'partial',
  verdict: 'Each president is a dot at their first inauguration and the share of people with any opinion of them; the portraits are missing.',
  needs: ['image-mark'],
  prep: ['prep-calculate'],
  gaps: [
    'Portraits are replaced by dots labelled with surnames; labels overlap where presidents are close together.',
  ],
  recreation: {
    code: `const presidents = await plotData('observablehq__plot-image-medals', 'us-president-favorability@1.csv');
const rows = presidents.map((d) => ({
  name: d.Name.split(' ').at(-1),
  date: d['First Inauguration Date'],
  opinion: d['Very Favorable %'] + d['Somewhat Favorable %'] + d['Very Unfavorable %'] + d['Somewhat Unfavorable %'],
}));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  data: rows,
  schema: {
    name:    { type: 'categorical' },
    date:    { type: 'temporal', domain: [new Date('1780-01-01'), new Date('2030-01-01')] },
    opinion: { type: 'quantitative', domain: [0, 100] },
  },
  axes: { x: { title: 'First inauguration date →' }, y: { title: 'Any opinion (%) →', grid: true } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({ size: 8, fill: '#e2e8f0', stroke: '#475569', channels: { x: { field: 'date' }, y: { field: 'opinion' } } }),
    text({ fontSize: 8, dy: -12, channels: { x: { field: 'date' }, y: { field: 'opinion' }, text: { field: 'name' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Sweep the awareness',
      question: 'For each president, what share of people today hold any opinion of them at all?',
      try: 'Drag across the chart: every dot you pass jumps to the pointer’s height.',
      why: '`move({ pick: \'sweep\' })` sets each row’s `y` as the pointer passes over its `x`, so one stroke answers all 45 rows. Sweep again over any stretch to revise it.',
      uses: ["move({ pick: 'sweep' })"],
      code: `const presidents = await plotData('observablehq__plot-image-medals', 'us-president-favorability@1.csv');

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  data: presidents.map((d) => ({ name: d.Name, date: d['First Inauguration Date'], opinion: 50 })),
  schema: {
    name:    { type: 'categorical' },
    date:    { type: 'temporal', domain: [new Date('1780-01-01'), new Date('2030-01-01')] },
    opinion: { type: 'quantitative', domain: [0, 100] },
  },
  axes: { x: { title: 'First inauguration date →' }, y: { title: 'Any opinion (%) →', grid: true } },
  marks: [
    point({
      size: 5, fill: '#4269d0',
      channels: {
        x: { field: 'date' },
        y: { field: 'opinion', edit: move({ pick: 'sweep', guide: true }) }, //! one stroke sets every dot it crosses
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-image-scatterplot',
  status: 'partial',
  verdict: 'Net favourability against inauguration date draws as labelled dots; the portraits are missing.',
  needs: ['image-mark'],
  prep: ['prep-calculate'],
  gaps: ['Portraits are replaced by dots labelled with surnames, which overlap in crowded stretches.'],
  recreation: {
    code: `const presidents = await plotData('observablehq__plot-image-scatterplot', 'us-president-favorability@1.csv');
const rows = presidents.map((d) => ({
  name: d.Name.split(' ').at(-1),
  date: d['First Inauguration Date'],
  net: d['Very Favorable %'] + d['Somewhat Favorable %'] - d['Very Unfavorable %'] - d['Somewhat Unfavorable %'],
}));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  data: rows,
  schema: {
    name: { type: 'categorical' },
    date: { type: 'temporal', domain: [new Date('1780-01-01'), new Date('2030-01-01')] },
    net:  { type: 'quantitative', domain: [-40, 80] },
  },
  axes: { x: { title: 'First inauguration date →' }, y: { title: 'Net favorability (%) →', grid: true, tickFormat: '+d' } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({ size: 6, fill: '#e2e8f0', stroke: '#475569', channels: { x: { field: 'date' }, y: { field: 'net' } } }),
    text({ fontSize: 8, dy: -10, channels: { x: { field: 'date' }, y: { field: 'net' }, text: { field: 'name' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Rate the founders',
      question: 'What net favourability do these six historic presidents have with the public today?',
      try: 'Drag any dot up or down; it moves from where it is, however you grab it.',
      why: '`slide({ axis: \'y\' })` is relative: it freezes the value at the press and adds the drag to it, so grabbing a dot off-centre never makes it jump. The labels re-derive from the same rows.',
      uses: ['slide()', 'snap()', 'text'],
      code: `const picks = {
  'George Washington': 'Washington', 'Thomas Jefferson': 'Jefferson', 'Abraham Lincoln': 'Lincoln',
  'Theodore Roosevelt': 'T. Roosevelt', 'Franklin D. Roosevelt': 'F. D. Roosevelt', 'John F. Kennedy': 'Kennedy',
};
const presidents = (await plotData('observablehq__plot-image-scatterplot', 'us-president-favorability@1.csv'))
  .filter((d) => d.Name in picks);

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  data: presidents.map((d) => ({ name: picks[d.Name], date: d['First Inauguration Date'], net: 0 })),
  schema: {
    name: { type: 'categorical' },
    date: { type: 'temporal', domain: [new Date('1780-01-01'), new Date('1975-01-01')] },
    net:  { type: 'quantitative', domain: [-40, 80] },
  },
  constraints: [ snap({ step: 1 }), clamp({ min: -40, max: 80 }) ],
  axes: { x: { title: 'First inauguration date →' }, y: { title: 'Net favorability (%) →', grid: true, tickFormat: '+d' } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    point({
      size: 9, fill: '#4269d0', stroke: 'white', strokeWidth: 1.5,
      channels: {
        x: { field: 'date' },
        y: { field: 'net', edit: slide({ axis: 'y' }) },      //! a relative drag: no jump on press
      },
    }),
    text({
      fontSize: 10,
      channels: {
        x: { field: 'date' }, y: { field: 'net' }, text: { field: 'name' },
        dy: { fn: (d, i) => (i % 2 ? 18 : -16) },             // alternate above / below so neighbours don't collide
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-image-scatterplot-2',
  status: 'partial',
  verdict: 'Favourable against unfavourable opinion draws as dots with zero rules; the 16 px portraits are missing.',
  needs: ['image-mark'],
  prep: ['prep-calculate'],
  gaps: ['Portraits are replaced by plain dots (the example is about the image mark’s default size).'],
  recreation: {
    code: `const presidents = await plotData('observablehq__plot-image-scatterplot-2', 'us-president-favorability@2.csv');
const rows = presidents.map((d) => ({
  fav: d['Very Favorable %'] + d['Somewhat Favorable %'],
  unfav: d['Very Unfavorable %'] + d['Somewhat Unfavorable %'],
}));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  data: rows,
  schema: {
    fav:   { type: 'quantitative', domain: [0, 80] },
    unfav: { type: 'quantitative', domain: [0, 60] },
  },
  axes: { x: { title: 'Favorable opinion (%) →', grid: true }, y: { title: 'Unfavorable opinion (%) →', grid: true } },
  marks: [
    rule({ stroke: '#111', channels: { y: { datum: 0 } } }),
    rule({ stroke: '#111', channels: { x: { datum: 0 } } }),
    point({ size: 6, fill: '#e2e8f0', stroke: '#475569', channels: { x: { field: 'fav' }, y: { field: 'unfav' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Opinions that add up',
      question: 'Where do Lincoln, Nixon and Carter sit today: what share of people view each favourably, and what share unfavourably?',
      try: 'Drag each dot. You can’t cross the dashed line, where the two shares would pass 100%.',
      why: 'Favourable and unfavourable are shares of one population, so their sum cannot pass 100. That rule is not a box on either axis, so it is a `constraints.custom` gate: any drag that breaks it is refused. A dashed `line` over two `context` rows draws the boundary.',
      uses: ['move()', 'constraints.custom', 'context', 'strokeDash'],
      code: `mount(Elicit({
  width: 400, height: 400,
  margins: { top: 30, right: 20, bottom: 36, left: 54 },
  schema: {
    name:  { type: 'categorical' },
    fav:   { type: 'quantitative', domain: [0, 100] },
    unfav: { type: 'quantitative', domain: [0, 100] },
    edgeFav:   { type: 'quantitative' },                     // the boundary's own columns
    edgeUnfav: { type: 'quantitative' },
  },
  data: [
    { edgeFav: 0, edgeUnfav: 100 }, { edgeFav: 100, edgeUnfav: 0 },
    { name: 'Lincoln', fav: 20, unfav: 20 },
    { name: 'Nixon', fav: 35, unfav: 35 },
    { name: 'Carter', fav: 50, unfav: 20 },
  ],
  context: (d) => d.edgeFav != null,
  constraints: [
    constraints.custom(({ data }) => data.every((d) => d.fav == null || (d.fav >= 0 && d.unfav >= 0 && d.fav + d.unfav <= 100))), //! the two shares can't pass 100%
  ],
  axes: { x: { title: 'Favorable opinion (%) →', grid: true }, y: { title: 'Unfavorable opinion (%) →', grid: true } },
  marks: [
    line({                                                    //! the boundary: fav + unfav = 100
      stroke: '#e4572e', strokeDash: '5 4',
      channels: { x: { field: 'edgeFav' }, y: { field: 'edgeUnfav' } },
    }),
    point({
      size: 8, fill: '#4269d0', stroke: 'white', strokeWidth: 1.5,
      channels: { x: { field: 'fav' }, y: { field: 'unfav' } },
      edits: [ move({ channels: ['x', 'y'] }) ],
    }),
    text({ fontSize: 11, dx: 12, textAnchor: 'start', channels: { x: { field: 'fav' }, y: { field: 'unfav' }, text: { field: 'name' } } }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- aggregated dots

GALLERY.add({
  id: 'plot-ordinal-scatterplot',
  status: 'full',
  verdict: 'Penguins counted by species × island × sex, drawn as concentric dots sized by count on two categorical axes.',
  prep: ['prep-aggregate'],
  gaps: ['Plot’s null-sex group is the `n/a` category here.'],
  recreation: {
    code: `const penguins = await plotData('penguins');
const counts = d3.flatRollup(penguins, (v) => v.length, (d) => d.species, (d) => d.island, (d) => d.sex ?? 'n/a')
  .map(([species, island, sex, count]) => ({ species, island, sex, count }));

mount(Elicit({
  width: 460, height: 240,
  margins: { top: 20, right: 30, bottom: 30, left: 80 },
  data: counts,
  schema: {
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    island:  { type: 'categorical', domain: ['Biscoe', 'Dream', 'Torgersen'] },
    sex:     { type: 'categorical', domain: ['FEMALE', 'MALE', 'n/a'] },
    count:   { type: 'quantitative', domain: [0, 70] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { grid: true }, y: { grid: true } },
  marks: [
    point({
      fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'species' }, y: { field: 'island' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, 40] } },
        stroke: { field: 'sex', scale: { range: ['#4269d0', '#efb118', '#ff725c'] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Who lives where',
      question: 'Which islands is each penguin species found on?',
      try: 'Click a cell to place or take back a dot.',
      why: '`toggle()` names a slot by inverting the click through both categorical axes: an empty cell gets a row, a filled one loses it. One gesture answers yes or no for every species × island pair.',
      uses: ['toggle()'],
      code: `mount(Elicit({
  width: 460, height: 220,
  margins: { top: 20, right: 30, bottom: 30, left: 80 },
  data: [],
  schema: {
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    island:  { type: 'categorical', domain: ['Biscoe', 'Dream', 'Torgersen'] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { grid: true }, y: { grid: true } },
  marks: [
    point({
      size: 12, fill: '#ff725c',
      channels: { x: { field: 'species' }, y: { field: 'island' } },
      edits: [ toggle({ channels: ['x', 'y'] }) ],            //! click a cell to add or remove a row there
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dot-heatmap',
  status: 'full',
  verdict: 'Athletes binned in two dimensions (weight × height), drawn as dots whose radius is the count.',
  prep: ['prep-bin'],
  gaps: ['Bins are 2.5 kg × 2.5 cm, chosen by hand rather than by Plot’s automatic thresholds.', 'Only the first of the notebook’s two charts (the one without a stroke by sex) is recreated.'],
  recreation: {
    code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
const bins = d3.flatRollup(olympians, (v) => v.length,
  (d) => Math.floor(d.weight / 2.5) * 2.5 + 1.25, (d) => Math.floor(d.height / 0.025) * 0.025 + 0.0125)
  .map(([weight, height, count]) => ({ weight, height, count }));

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: bins,
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    count:  { type: 'quantitative', domain: [0, 200] },
  },
  axes: { x: { title: 'weight →' }, y: { title: 'height →' } },
  marks: [
    point({
      fill: 'none', stroke: '#111',
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, 6] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Size the cells',
      question: 'Out of every 100 Olympians, how many fall in each of these weight × height cells?',
      try: 'Drag a dot up to grow it, down to shrink it.',
      why: '`slide({ axis: \'y\' })` on `size` turns a vertical drag into a change in count without moving the dot, because the dot’s position is a different channel. `maintainSum` with `cap` holds the counts to 100.',
      uses: ['slide()', 'maintainSum()', 'guides.remaining'],
      code: `const weights = [50, 70, 90, 110], heights = [1.6, 1.75, 1.9];
mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: weights.flatMap((weight) => heights.map((height) => ({ weight, height, count: 2 }))),
  schema: {
    weight: { type: 'quantitative', domain: [40, 120] },
    height: { type: 'quantitative', domain: [1.5, 2] },
    count:  { type: 'quantitative', domain: [0, 40] },
  },
  constraints: [ clamp({ min: 0, max: 40 }), maintainSum({ total: 100, strategy: 'cap' }) ], //! 100 athletes to place
  axes: { x: { title: 'weight (kg) →', grid: true }, y: { title: 'height (m) →', grid: true } },
  guides: [
    guides.remaining({ field: 'count', unit: 'athlete' }),
  ],
  marks: [
    point({
      fill: '#111', fillOpacity: 0.8,
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        size: { field: 'count', scale: { type: 'sqrt', range: [2, 30] }, edit: slide({ axis: 'y' }) }, //! drag up or down to resize
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dot-bins',
  status: 'full',
  verdict: 'Athletes binned by weight, one dot per bin on the x axis with radius encoding the count.',
  prep: ['prep-bin'],
  gaps: ['5 kg bins chosen by hand rather than by Plot’s automatic thresholds.'],
  recreation: {
    code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight));
const bins = d3.bin().domain([25, 175]).thresholds(d3.range(25, 176, 5))(olympians.map((d) => d.weight))
  .map((b) => ({ weight: (b.x0 + b.x1) / 2, count: b.length }));

mount(Elicit({
  width: 460, height: 120,
  margins: { top: 10, right: 16, bottom: 36, left: 16 },
  data: bins,
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    count:  { type: 'quantitative', domain: [0, 1500] },
  },
  axes: { x: { title: 'weight →' }, y: false },
  marks: [
    point({
      fill: '#111',
      channels: { x: { field: 'weight' }, size: { field: 'count', scale: { type: 'sqrt', range: [0, 14] } } },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Grow the bins',
      question: 'How are Olympians’ body weights distributed? Make each bin as big as its share.',
      try: 'Drag outward from a dot’s centre to grow it, inward to shrink it.',
      why: '`resize()` inverts the pointer’s distance from the dot’s centre through the `size` scale, so the radius you drag to is the count you mean. The axis stays the weight; only the dot grows.',
      uses: ['resize()', 'clamp()'],
      code: `mount(Elicit({
  width: 460, height: 140,
  margins: { top: 10, right: 16, bottom: 36, left: 16 },
  data: d3.range(40, 141, 10).map((weight) => ({ weight, count: 5 })),
  schema: {
    weight: { type: 'quantitative', domain: [30, 150] },
    count:  { type: 'quantitative', domain: [0, 40] },
  },
  constraints: [ clamp({ min: 0, max: 40 }) ],
  axes: { x: { title: 'weight (kg) →' }, y: false },
  marks: [
    point({
      fill: '#4269d0', fillOpacity: 0.6, stroke: '#4269d0',
      channels: {
        x: { field: 'weight' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, 20] }, edit: resize() }, //! drag the rim to set the count
      },
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- hexbins

GALLERY.add({
  id: 'plot-olympians-hexbin',
  status: 'none',
  verdict: 'A hexagon-tiled heatmap: hexagonal binning is out of scope for an elicitation library.',
  needs: ['hexbin'],
  gaps: [
    'No hexbin transform (binning in pixel space after scaling).',
    'No hexagon mark: a filled hexagon per bin, sized to tile.',
  ],
  alternative: 'Bin into squares in JavaScript and draw a `rect` heatmap with a `fill` ramp; `edit.legend.value()` or `cycle()` on the fill can then ask how dense each cell is.',
});

GALLERY.add({
  id: 'plot-hexbin-binwidth',
  status: 'partial',
  verdict: 'Hexagonal bins computed by hand in pixel space draw as dots sized by count; the `binWidth` slider is missing, and hexbin itself is out of scope for an elicitation library.',
  needs: ['hexbin', 'input-widgets'],
  prep: ['prep-bin'],
  gaps: [
    'The hexbin (d3-hexbin’s nearest-centre rule) is computed in JavaScript against a copy of the chart’s own scales, so it must be kept in step with the chart size by hand.',
    'No `binWidth` slider: the bin width is fixed at Plot’s default of 20 px.',
    'Bins draw as circles; Plot’s hexbin dots default to hexagon symbols.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
// Bin in PIXEL space, as Plot does: these scales copy the chart's (404 × 254 px plot area).
const sx = d3.scaleLinear([25, 175], [0, 404]), sy = d3.scaleLinear([1.2, 2.25], [254, 0]);
const binWidth = 20, dx = binWidth, dy = binWidth * Math.sqrt(3) / 2;
function hexCentre(d) {                                       // d3-hexbin's nearest-centre rule
  let px = sx(d.weight) / dx, py = sy(d.height) / dy;
  let pj = Math.round(py), pi = Math.round(px -= (pj & 1) / 2);
  const py1 = py - pj;
  if (Math.abs(py1) * 3 > 1) {
    const pi2 = pi + (px < pi ? -1 : 1) / 2, pj2 = pj + (py < pj ? -1 : 1);
    if ((px - pi) ** 2 + py1 ** 2 > (px - pi2) ** 2 + (py - pj2) ** 2) { pi = pi2 + (pj & 1 ? 1 : -1) / 2; pj = pj2; }
  }
  return [(pi + (pj & 1) / 2) * dx, pj * dy].join();
}
const bins = d3.rollups(olympians, (v) => v.length, hexCentre).map(([key, count]) => {
  const [x, y] = key.split(',').map(Number);
  return { weight: sx.invert(x), height: sy.invert(y), count };
});

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: bins,
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    count:  { type: 'quantitative', domain: [0, d3.max(bins, (d) => d.count)] },
  },
  axes: { x: { title: 'weight →' }, y: { title: 'height →' } },
  marks: [
    point({
      fill: 'none', stroke: '#111',
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, binWidth / 2] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Aim, then size',
      question: 'Where is the densest spot of Olympians by weight and height, and how many of the 11,000 athletes would you put within a few kilos and centimetres of it?',
      try: 'Hover to aim and click to place the dot. Then drag outward from it to set the count.',
      why: 'Two stages, two edits. In stage 0, `move({ pick: \'probe\' })` previews the dot under the pointer and the click commits it and advances. In stage 1, `resize()` on `size` reads the pointer’s distance from the centre as the count; `pick: \'nearest\'` lets that drag start anywhere near the dot.',
      uses: ["move({ pick: 'probe' })", 'resize()', 'stage'],
      code: `mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: [{ weight: 100, height: 1.4, count: 100 }],
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    count:  { type: 'quantitative', domain: [0, 2000] },
  },
  constraints: [ clamp({ field: 'count', min: 0, max: 2000 }) ],
  axes: { x: { title: 'weight (kg) →', grid: true }, y: { title: 'height (m) →', grid: true } },
  marks: [
    point({
      fill: '#4269d0', fillOpacity: 0.3, stroke: '#4269d0', strokeWidth: 1.5,
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, 60] }, edit: resize({ stage: 1, pick: 'nearest', threshold: 80 }) }, //! stage 1: drag the rim
      },
      edits: [ move({ channels: ['x', 'y'], pick: 'probe', stage: 0 }) ], //! stage 0: hover to aim, click to place
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-hexbin-text',
  status: 'partial',
  verdict: 'Hexagonal bins computed by hand draw as count labels at each bin centre; hexbin itself is out of scope for an elicitation library.',
  needs: ['hexbin'],
  prep: ['prep-bin'],
  gaps: ['The hexbin is computed in JavaScript against a copy of the chart’s scales, not by a transform.'],
  recreation: {
    code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
const sx = d3.scaleLinear([25, 175], [0, 404]), sy = d3.scaleLinear([1.2, 2.25], [254, 0]);
const binWidth = 20, dx = binWidth, dy = binWidth * Math.sqrt(3) / 2;
function hexCentre(d) {                                       // d3-hexbin's nearest-centre rule
  let px = sx(d.weight) / dx, py = sy(d.height) / dy;
  let pj = Math.round(py), pi = Math.round(px -= (pj & 1) / 2);
  const py1 = py - pj;
  if (Math.abs(py1) * 3 > 1) {
    const pi2 = pi + (px < pi ? -1 : 1) / 2, pj2 = pj + (py < pj ? -1 : 1);
    if ((px - pi) ** 2 + py1 ** 2 > (px - pi2) ** 2 + (py - pj2) ** 2) { pi = pi2 + (pj & 1 ? 1 : -1) / 2; pj = pj2; }
  }
  return [(pi + (pj & 1) / 2) * dx, pj * dy].join();
}
const bins = d3.rollups(olympians, (v) => v.length, hexCentre).map(([key, count]) => {
  const [x, y] = key.split(',').map(Number);
  return { weight: sx.invert(x), height: sy.invert(y), count };
});

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: bins,
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    count:  { type: 'quantitative' },
  },
  axes: { x: { title: 'weight →' }, y: { title: 'height →' } },
  marks: [
    text({ fontSize: 7, channels: { x: { field: 'weight' }, y: { field: 'height' }, text: { field: 'count' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Rate the crowding',
      question: 'How crowded with Olympians is each region of the weight × height plane?',
      try: 'Click a label to step it through none → few → some → many.',
      why: 'Each label is a row on a coarse grid; `cycle()` on its `text` channel steps the word through the field’s declared domain, and `fill` re-derives from the same column, so the answer reads as a heatmap of words.',
      uses: ['cycle()', 'text'],
      code: `const levels = ['none', 'few', 'some', 'many'];
const weights = [50, 75, 100, 125, 150], heights = [1.4, 1.6, 1.8, 2.0];
mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 54 },
  data: weights.flatMap((weight) => heights.map((height) => ({ weight, height, level: 'none' }))),
  schema: {
    weight: { type: 'quantitative', domain: [35, 165] },
    height: { type: 'quantitative', domain: [1.3, 2.1] },
    level:  { type: 'ordinal', domain: levels },
  },
  axes: { x: { title: 'weight (kg) →', grid: true }, y: { title: 'height (m) →', grid: true } },
  marks: [
    text({
      fontSize: 14,
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        text: { field: 'level', edit: cycle() },               //! a click steps the word
        fill: { field: 'level', scale: { range: ['#cbd5e1', '#93c5fd', '#3b82f6', '#1e3a8a'] } },
      },
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- text

GALLERY.add({
  id: 'plot-text-dodge',
  status: 'none',
  verdict: 'IPO valuations as text laid out by a dodge transform; ElicitJS has no collision-avoiding placement.',
  needs: ['dodge', 'text-layout'],
  gaps: [
    'No `dodgeY`: each label’s height comes from packing it against the labels already placed.',
    'A beeswarm could be precomputed in JavaScript, but with per-row radius and font size the layout is the whole chart.',
  ],
  alternative: 'A `text` mark at date × valuation (a plain scatter of numbers) shows the same rows without the packing.',
});

GALLERY.add({
  id: 'plot-text-spiral',
  status: 'full',
  verdict: 'The index of each of 151 points on a spiral, drawn as text at its position.',
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const spiral = d3.range(151).map((i) => ({ i, x: Math.sqrt(i) * Math.sin(i / 10), y: Math.sqrt(i) * Math.cos(i / 10) }));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 20, right: 20, bottom: 30, left: 36 },
  data: spiral,
  schema: {
    i: { type: 'quantitative' },
    x: { type: 'quantitative', domain: [-13, 13] },
    y: { type: 'quantitative', domain: [-13, 13] },
  },
  axes: { x: { grid: true }, y: { grid: true } },
  marks: [
    text({ fontSize: 9, channels: { x: { field: 'x' }, y: { field: 'y' }, text: { field: 'i' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Continue the spiral',
      question: 'The spiral stops at 150. Where would 175 and 200 land?',
      try: 'Drag the two red numbers to where you think they belong.',
      why: 'The 151 given labels and your two guesses are rows of one table; a `lock` predicate fixes the given ones. `move()` on the text mark positions your guesses, and `fill` encodes which rows are yours.',
      uses: ['text', 'move()', 'lock'],
      code: `const spiral = d3.range(151).map((i) => ({ i, x: Math.sqrt(i) * Math.sin(i / 10), y: Math.sqrt(i) * Math.cos(i / 10), kind: 'given' }));

mount(Elicit({
  width: 400, height: 400,
  margins: { top: 20, right: 20, bottom: 30, left: 36 },
  data: [...spiral, { i: 175, x: -13, y: 13, kind: 'guess' }, { i: 200, x: 13, y: -13, kind: 'guess' }],
  lock: (d) => d.kind === 'given',                            //! only the guesses can move
  schema: {
    i:    { type: 'quantitative' },
    x:    { type: 'quantitative', domain: [-16, 16] },
    y:    { type: 'quantitative', domain: [-16, 16] },
    kind: { type: 'categorical', domain: ['given', 'guess'] },
  },
  axes: { x: { grid: true }, y: { grid: true } },
  marks: [
    text({
      fontSize: 9,
      channels: {
        x: { field: 'x' }, y: { field: 'y' }, text: { field: 'i' },
        fill: { field: 'kind', scale: { range: ['#94a3b8', '#e4572e'] } },
      },
      edits: [ move({ channels: ['x', 'y'] }) ],              //! drag a number to place it
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-this-is-just-to-say',
  status: 'full',
  verdict: 'One multi-line text row, centred in a framed plot.',
  gaps: [
    'A public-domain poem (Carl Sandburg’s “Fog”, 1916) stands in for the original’s text.',
    'The frame is drawn by a `guides.custom` rectangle.',
  ],
  recreation: {
    code: `const poem = \`Fog
Carl Sandburg, 1916
The fog comes
on little cat feet.
It sits looking
over harbor and city
on silent haunches
and then moves on.\`;

mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: [{ poem }],
  schema: { poem: { type: 'categorical' } },
  guides: [ guides.custom(({ width, height }) => [{ type: 'rect', x: 0, y: 0, width, height, fill: 'none', stroke: '#111' }]) ],
  marks: [
    text({ fontSize: 10, lineHeight: 13, channels: { text: { field: 'poem' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Write the note',
      question: 'The original poem is a note left on a kitchen table. What note would you leave after eating someone’s breakfast?',
      try: 'Double-click the note and type; press Enter for a new line, click away to finish.',
      why: '`editText({ multiline: true })` opens an editor seeded with the row’s current text and writes the result back to the `note` column. The mark is the answer, so the response is a string in the elicited data like any other value.',
      uses: ['editText()', 'text'],
      code: `mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: [{ note: 'Double-click to write your note' }],
  schema: { note: { type: 'categorical' } },
  guides: [ guides.custom(({ width, height }) => [{ type: 'rect', x: 0, y: 0, width, height, fill: '#fffbea', stroke: '#111', background: true }]) ],
  marks: [
    text({
      fontSize: 14, lineHeight: 18, wrap: 400,
      channels: { text: { field: 'note', edit: editText({ multiline: true }) } }, //! double-click to type
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-fil-voronoi-labels',
  status: 'none',
  verdict: 'Labels moved to the centroids of their Voronoi cells, with leader lines: Voronoi diagrams are out of scope for an elicitation library, and ElicitJS has no label-placement transform.',
  needs: ['delaunay', 'text-layout', 'link-mark'],
  gaps: [
    'No Voronoi mesh mark.',
    'No initializer that moves a label to its cell’s centroid.',
    'No free-standing per-row arrow from a point to its label.',
  ],
  alternative: 'Airport dots with labels you drag clear of each other (`text` + `move()`) collect the same placement by hand.',
});

GALLERY.add({
  id: 'plot-caltrain-schedule',
  status: 'full',
  verdict: 'A stem-and-leaf timetable: departure minutes stacked out from an hour column, northbound right and southbound left, coloured by train type.',
  prep: ['prep-stack', 'prep-calculate'],
  gaps: [
    'The stack offsets are computed in JavaScript (Plot’s `stackX2`); headers and hour labels are rows of the same text table, inked like N trains.',
  ],
  recreation: {
    code: `const caltrain = await plotData('observablehq__plot-caltrain-schedule', 'caltrain.csv');
const seen = new Map();
const trains = caltrain.map((d) => {                           // stackX2: the k-th train in an hour sits at ±k
  const key = d.orientation + d.hours, k = (seen.get(key) || 0) + 1;
  seen.set(key, k);
  return { x: d.orientation === 'N' ? k + 1 : -(k + 1), hour: d.hours, label: String(d.minutes), ink: d.type, anchor: 'middle' };
});
const hours = d3.range(5, 25).map((h) => ({ x: 0, hour: h, label: \`\${h % 12 || 12}\${h % 24 >= 12 ? 'p' : 'a'}\`, ink: 'N', anchor: 'middle' }));
const heads = [
  { x: 1.5, hour: 4, label: 'Northbound', ink: 'N', anchor: 'start' },
  { x: -1.5, hour: 4, label: 'Southbound', ink: 'N', anchor: 'end' },
];

mount(Elicit({
  width: 260, height: 420,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  axes: false,
  data: [...heads, ...hours, ...trains],
  schema: {
    x:      { type: 'quantitative', domain: [-6.5, 6.5] },
    hour:   { type: 'quantitative', domain: [3.5, 24.5] },
    label:  { type: 'categorical' },
    ink:    { type: 'categorical', domain: ['N', 'L', 'B'] },
    anchor: { type: 'categorical' },
  },
  scales: { y: { reverse: true } },
  marks: [
    rule({ stroke: '#111', channels: { x: { datum: 1 } } }),
    rule({ stroke: '#111', channels: { x: { datum: -1 } } }),
    text({
      fontSize: 10,
      channels: {
        x: { field: 'x' }, y: { field: 'hour' }, text: { field: 'label' },
        fill: { field: 'ink', scale: { range: ['#111', 'peru', 'brown'] }, legend: { anchor: 'top' } },
        textAnchor: { field: 'anchor' },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Plan the service',
      question: 'If you ran Caltrain, how many northbound trains would you schedule in each hour of the day?',
      try: 'Click a row to add a train in that hour; click a train to take it away.',
      why: '`dotStackX` draws one token per row and stacks the tokens rightward along their hour, so each row reads as a count. `create()` adds a train to the hour you click and `remove()` takes the clicked one away.',
      uses: ['dotStackX', 'create()', 'remove()', 'count()'],
      code: `const hours = d3.range(5, 25);
mount(Elicit({
  width: 300, height: 440,
  margins: { top: 10, right: 16, bottom: 10, left: 40 },
  axes: { x: false, y: { tickFormat: (h) => \`\${h % 12 || 12}\${h % 24 >= 12 ? 'p' : 'a'}\` } },
  data: [{ hour: 7 }, { hour: 8 }, { hour: 8 }, { hour: 17 }],
  schema: { hour: { type: 'ordinal', domain: hours } },
  scales: { y: { type: 'point', reverse: true } },
  constraints: [ count({ max: 60, strategy: 'reject' }) ],
  marks: [
    dotStackX({
      size: 6, fill: 'peru',
      channels: { y: { field: 'hour' } },
      edits: [ create({ gesture: 'click', channels: ['y'] }), remove() ], //! click an hour to add a train, a train to remove it
    }),
  ],
}))`,
    },
  ],
});

// ---------------------------------------------------------------- dodge & facets

GALLERY.add({
  id: 'plot-dodge-cars',
  status: 'partial',
  verdict: 'The beeswarm draws, but its packing is computed in JavaScript: ElicitJS has no dodge transform, so the layout is a static picture.',
  needs: ['dodge'],
  prep: ['prep-calculate'],
  gaps: [
    'The dodge (each dot at the lowest height clear of those already placed) is computed by hand in pixel units against a copy of the chart’s x scale.',
    'No anchor selector (top / middle / bottom).',
  ],
  recreation: {
    code: `const cars = await plotData('cars');
// dodgeY by hand: place each dot at the lowest height where it overlaps nothing placed before it.
const r = 3, sx = d3.scaleLinear([1500, 5200], [0, 428]);     // the chart's 428 px plot width
const placed = [];
for (const d of cars) {
  const x = sx(d['weight (lb)']);
  const near = placed.filter((p) => Math.abs(p.x - x) < 2 * r);
  const level = [r, ...near.map((p) => p.level + Math.sqrt(4 * r * r - (p.x - x) ** 2))].sort((a, b) => a - b)
    .find((y) => near.every((p) => (p.x - x) ** 2 + (p.level - y) ** 2 >= 4 * r * r - 1e-6));
  placed.push({ x, level, weight: d['weight (lb)'] });
}

mount(Elicit({
  width: 460, height: 186,
  margins: { top: 10, right: 16, bottom: 36, left: 16 },
  data: placed.map(({ weight, level }) => ({ weight, level })),
  schema: {
    weight: { type: 'quantitative', domain: [1500, 5200] },
    level:  { type: 'quantitative', domain: [0, 140] },    // px above the axis: the plot is 140 px tall
  },
  axes: { x: { title: 'weight (lb) →' }, y: false },
  marks: [
    point({ size: r, fill: '#111', channels: { x: { field: 'weight' }, y: { field: 'level' } } }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Drop the tokens',
      question: 'Picture 20 cars from the 1970s. How heavy is each one?',
      try: 'Hover to preview a token, click to drop it. Alt-click near a token to remove it.',
      why: '`dotStack` turns the answer into a beeswarm-like pile of tokens, one row each. `create({ pick: \'probe\' })` previews where the next token would land before the click commits it, and `advance: false` keeps it live for the next one.',
      uses: ['dotStack', "create({ pick: 'probe' })", 'remove()', 'count()'],
      code: `const bins = d3.range(1750, 5000, 250);
mount(Elicit({
  width: 460, height: 220,
  margins: { top: 16, right: 16, bottom: 36, left: 16 },
  axes: { x: { title: 'weight (lb) →', tickFormat: (v) => (v % 1000 ? '' : v) }, y: false },
  data: [],
  schema: { weight: { type: 'ordinal', domain: bins } },
  scales: { x: { type: 'point' } },
  constraints: [ count({ max: 20, strategy: 'reject' }) ],    //! twenty cars
  marks: [
    dotStack({
      size: 5, fill: '#111', ghost: true,
      channels: { x: { field: 'weight' } },
      edits: [
        create({ pick: 'probe', channels: ['x'], advance: false, when: when.noAlt }), //! hover previews, click drops
        remove({ pick: 'nearest', when: when.alt }),
      ],
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dodge-penguins',
  status: 'none',
  verdict: 'A beeswarm per species facet: faceting is not covered by this study, and ElicitJS has no dodge transform to pack the dots.',
  needs: ['facet', 'dodge'],
  gaps: [
    'No `fx` facet: one panel per species sharing the y scale.',
    'No `dodgeX` to pack the dots sideways within each panel.',
  ],
  alternative: 'Body mass by species on one chart (`point` with `y` = mass, `x` = species) shows the same comparison without the packing.',
});

GALLERY.add({
  id: 'plot-barley-trellis',
  status: 'partial',
  verdict: 'All 120 yields draw on one chart. Faceting is not covered by this study, so the six site facets become one long categorical axis of site · variety rows.',
  needs: ['facet'],
  prep: ['prep-calculate', 'prep-aggregate'],
  gaps: [
    'No facets: each site is a block of rows on one axis instead of its own framed panel with a site label.',
    'Sites and varieties are sorted by median yield in JavaScript, as Plot’s `sort` option does.',
  ],
  recreation: {
    code: `const barley = await plotData('observablehq__plot-barley-trellis', 'barley.csv');
const sites = d3.groupSort(barley, (v) => -d3.median(v, (d) => d.yield), (d) => d.site);
const varieties = d3.groupSort(barley, (v) => -d3.median(v, (d) => d.yield), (d) => d.variety);
const rowKey = (d) => \`\${d.site} · \${d.variety}\`;

mount(Elicit({
  width: 460, height: 720,
  margins: { top: 10, right: 16, bottom: 36, left: 170 },
  data: barley.map((d) => ({ row: rowKey(d), yield: d.yield, year: String(d.year) })),
  schema: {
    row:   { type: 'categorical', domain: sites.flatMap((site) => varieties.map((variety) => rowKey({ site, variety }))) },
    yield: { type: 'quantitative', domain: [10, 70] },
    year:  { type: 'categorical', domain: ['1931', '1932'] },
  },
  scales: { y: { reverse: true } },
  axes: { x: { title: 'yield →', grid: true }, y: { fontSize: 8, grid: true } },
  marks: [
    point({
      size: 3, fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'yield' }, y: { field: 'row' },
        stroke: { field: 'year', scale: { range: ['#4269d0', '#efb118'] }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Morris, 1932',
      question: 'At the Morris site, what did each barley variety yield in 1932, given its 1931 yield?',
      try: 'Drag each yellow dot along its row. The blue 1931 dots are fixed.',
      why: 'The 1931 yields are seed rows held by a `lock` predicate; the 1932 rows start on top of them and only move along `x`. Becker et al. suspected the two Morris years were swapped, so this asks whether a reader expects 1932 above or below 1931.',
      uses: ['move()', 'lock', 'snap()'],
      code: `const morris = (await plotData('observablehq__plot-barley-trellis', 'barley.csv')).filter((d) => d.site === 'Morris' && d.year === 1931);
const varieties = d3.sort(morris, (d) => -d.yield).map((d) => d.variety);

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 30, right: 16, bottom: 36, left: 110 },
  data: [
    ...morris.map((d) => ({ variety: d.variety, year: '1931', yield: d.yield })),
    ...morris.map((d) => ({ variety: d.variety, year: '1932', yield: +d.yield.toFixed(1) })),
  ],
  lock: (d) => d.year === '1931',                              //! last year's yields are given
  schema: {
    variety: { type: 'categorical', domain: varieties },
    yield:   { type: 'quantitative', domain: [10, 70] },
    year:    { type: 'categorical', domain: ['1931', '1932'] },
  },
  constraints: [ snap({ step: 0.5 }) ],
  scales: { y: { reverse: true } },
  axes: { x: { title: 'yield (bushels/acre) →', grid: true }, y: { grid: true } },
  marks: [
    point({
      size: 5, fill: 'white', strokeWidth: 2.5,
      channels: {
        x: { field: 'yield', edit: move() },                    //! drag 1932 along the row
        y: { field: 'variety' },
        stroke: { field: 'year', scale: { range: ['#4269d0', '#efb118'] }, legend: { anchor: 'top' } },
      },
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-two-dimensional-faceting',
  status: 'none',
  verdict: 'A grid of panels by sex × species: faceting / multiple views are not covered by this study.',
  needs: ['facet'],
  gaps: ['No `fx`/`fy`: one framed panel per sex (columns) and species (rows), sharing x and y scales.'],
  alternative: 'One scatterplot with species on `stroke` and sex on `symbol` encodes the same two splits in a single panel.',
});

GALLERY.add({
  id: 'plot-non-faceted-marks',
  status: 'none',
  verdict: 'Each sex × species panel repeats the whole population in grey behind its own subset: faceting / multiple views are not covered by this study.',
  needs: ['facet'],
  gaps: ['No facets, so there is no notion of a mark that is repeated in every panel versus one that is split across them.'],
  alternative: 'One panel with the whole population as `context` rows behind one subset as the data shows the same comparison for a chosen group.',
});

GALLERY.add({
  id: 'plot-anscombes-quartet',
  status: 'none',
  verdict: 'Four side-by-side panels, one per series: faceting / multiple views are not covered by this study.',
  needs: ['facet'],
  gaps: ['No `facet` option: the four series would have to share one panel, which defeats the point of the quartet.'],
  alternative: 'One series at a time as a `line` + `point` chart, or all four overlaid with `stroke` by series.',
});

// ---------------------------------------------------------------- bubbles & maps

GALLERY.add({
  id: 'plot-wealth-health-nations',
  status: 'partial',
  verdict: 'The final frame (each nation’s latest income, life expectancy and population) draws as a bubble chart on a log x axis; the animation scrubber is missing.',
  needs: ['input-widgets'],
  prep: ['prep-aggregate'],
  gaps: [
    'No year scrubber or animation: the chart shows the last frame only.',
    'Plot’s `lastDefined` reducer is computed in JavaScript, per nation and per column.',
  ],
  recreation: {
    code: `const nations = await plotData('observablehq__plot-wealth-health-nations', 'nations.csv');
const latest = d3.groups(nations, (d) => d.name).map(([name, rows]) => {
  const last = (k) => d3.sort(rows, (d) => d.year).findLast((d) => d[k] != null)?.[k];
  return { name, region: rows[0].region, income: last('income'), life: last('lifeExpectancy'), population: last('population') };
}).filter((d) => d.income != null && d.life != null && d.population != null);

mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 16, bottom: 36, left: 50 },
  data: d3.sort(latest, (d) => -d.population),              // big bubbles first, small ones on top
  schema: {
    name:       { type: 'categorical' },
    region:     { type: 'categorical' },
    income:     { type: 'quantitative', domain: [200, 100000] },
    life:       { type: 'quantitative', domain: [15, 85] },
    population: { type: 'quantitative', domain: [0, 1.4e9] },
  },
  scales: { x: { type: 'log' } },
  axes: { x: { title: 'income →', grid: true, tickValues: [300, 1000, 3000, 10000, 30000, 100000], tickFormat: '~s' }, y: { title: 'lifeExpectancy →', grid: true } },
  marks: [
    point({
      fill: 'none', strokeWidth: 1.5,
      channels: {
        x: { field: 'income' }, y: { field: 'life' },
        size: { field: 'population', scale: { type: 'sqrt', range: [0, 30] } },
        stroke: { field: 'region', legend: { anchor: 'right', title: false, swatchSize: 10 } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Regions in 2050',
      question: 'Where will the typical country of each region be in 2050, in income and life expectancy?',
      try: 'Drag each region’s dot from its grey ring (2009) to where you expect it in 2050.',
      why: 'One row per region, seeded with the 2009 median. `move()` on both channels inverts x through the log scale, so a drag right is a multiplication of income, not an addition. The grey rings are `context` rows holding where each region started: drawn, read-only, and not part of the answer.',
      uses: ['move()', "scale: 'log'", 'context', 'text'],
      code: `const nations = (await plotData('observablehq__plot-wealth-health-nations', 'nations.csv')).filter((d) => d.year === 2009 && d.income != null && d.lifeExpectancy != null);
const today = d3.rollups(nations, (v) => ({ income: d3.median(v, (d) => d.income), life: d3.median(v, (d) => d.lifeExpectancy) }), (d) => d.region)
  .map(([region, m]) => ({ region, income: Math.round(m.income), life: +m.life.toFixed(1) }));

mount(Elicit({
  width: 460, height: 340,
  margins: { top: 30, right: 16, bottom: 36, left: 50 },
  schema: {
    region: { type: 'categorical' },
    income: { type: 'quantitative', domain: [200, 100000] },
    life:   { type: 'quantitative', domain: [15, 95] },
    income2009: { type: 'quantitative', domain: [200, 100000] }, // the grey rings' own columns
    life2009:   { type: 'quantitative', domain: [15, 95] },
  },
  data: [...today.map((d) => ({ income2009: d.income, life2009: d.life })), ...today],
  context: (d) => d.income2009 != null,                      // the 2009 positions are context
  constraints: [ clamp({ field: 'income', min: 200, max: 100000 }), clamp({ field: 'life', min: 15, max: 95 }) ],
  scales: { x: { type: 'log' } },                             //! the drag multiplies income
  axes: { x: { title: 'income →', grid: true, tickValues: [300, 1000, 3000, 10000, 30000, 100000], tickFormat: '~s' }, y: { title: 'life expectancy →', grid: true } },
  marks: [
    point({                                                     //! where each region was in 2009
      size: 9, fill: 'none', stroke: '#cbd5e1', strokeWidth: 2,
      channels: { x: { field: 'income2009' }, y: { field: 'life2009' } },
    }),
    point({
      size: 7, stroke: 'white', strokeWidth: 1.5,
      channels: { x: { field: 'income' }, y: { field: 'life' }, fill: { field: 'region' } },
      edits: [ move({ channels: ['x', 'y'] }) ],
    }),
    text({ fontSize: 9, dy: -12, channels: { x: { field: 'income' }, y: { field: 'life' }, text: { field: 'region' } } }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-dot-sort',
  status: 'partial',
  verdict: 'County populations draw as bubbles at county centroids over a state mesh (Albers USA), largest first; the sort toggle is missing.',
  needs: ['input-widgets'],
  prep: ['prep-geo', 'prep-lookup', 'prep-calculate'],
  gaps: [
    'No checkbox to switch between descending-radius and input order: the rows are sorted once in JavaScript (the default, sorted state).',
    'Centroids are computed with `d3.geoCentroid` before the chart, standing in for Plot’s `geoCentroid` transform.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-dot-sort', 'us-counties-10m.json');
const popText = await plotData('observablehq__plot-dot-sort', 'us-county-population.csv', { type: 'text' });
const pop = new Map(d3.csvParse(popText).map((d) => [d.state + d.county, +d.population]));
const counties = topojson.feature(us, us.objects.counties).features
  .filter((f) => pop.has(f.id))
  .map((f) => { const [lon, lat] = d3.geoCentroid(f); return { lon, lat, population: pop.get(f.id) }; });
const statemesh = topojson.mesh(us, us.objects.states);

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 5, right: 5, bottom: 5, left: 5 },
  projection: { type: 'albers-usa', domain: topojson.feature(us, us.objects.states) },
  data: d3.sort(counties, (d) => -d.population),             // sort: descending radius
  schema: {
    lon:        { type: 'quantitative' },
    lat:        { type: 'quantitative' },
    population: { type: 'quantitative', domain: [0, 1.1e7] },
  },
  marks: [
    geoBasemap({ geojson: statemesh, fill: 'none', stroke: '#111', strokeWidth: 0.5 }),
    geoPoint({
      fill: '#111', stroke: 'white', strokeWidth: 0.5,
      channels: {
        lon: { field: 'lon' }, lat: { field: 'lat' },
        size: { field: 'population', scale: { type: 'sqrt', range: [0, 18] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Pin the big five',
      question: 'Where are the five most populous counties in the United States?',
      try: 'Click the map to drop a pin, drag a pin to move it, Alt-click a pin to remove it.',
      why: '`edit.geo.create()` inverts the click through the projection to a longitude and latitude, and `edit.geo.move()` does the same while you drag. `count` stops at five pins.',
      uses: ['edit.geo.create()', 'edit.geo.move()', 'remove()', 'count()'],
      code: `const us = await plotData('observablehq__plot-dot-sort', 'us-counties-10m.json');
const states = topojson.feature(us, us.objects.states);

mount(Elicit({
  width: 460, height: 290,
  margins: { top: 5, right: 5, bottom: 5, left: 5 },
  projection: { type: 'albers-usa', domain: states },
  data: [],
  schema: {
    lon: { type: 'quantitative', domain: [-125, -66] },
    lat: { type: 'quantitative', domain: [24, 50] },
  },
  constraints: [ count({ max: 5, strategy: 'reject' }) ],       //! five pins
  marks: [
    geoBasemap({ geojson: states, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.6 }),
    geoPoint({
      size: 7, fill: '#e4572e', stroke: 'white', strokeWidth: 1.5,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' } },
      edits: [
        edit.geo.create({ when: when.noAlt }),                   //! click the map to pin a county
        edit.geo.move(),
        remove({ when: when.alt }),
      ],
    }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-us-bubble-map',
  status: 'full',
  verdict: 'County populations as translucent bubbles at county centroids over a pre-projected US basemap, with a size legend and a hover `tip` naming the county and state.',
  prep: ['prep-geo', 'prep-lookup'],
  gaps: [
    'The size key is `legendSize` (nested circles at the side) rather than the notebook’s hand-built 2M / 5M / 10M key in the corner.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-us-bubble-map', 'counties-albers-10m.json');
const raw = await plotData('observablehq__plot-us-bubble-map', 'population.json');
const countymap = new Map(topojson.feature(us, us.objects.counties).features.map((f) => [f.id, f]));
const statemap = new Map(topojson.feature(us, us.objects.states).features.map((f) => [f.id, f]));
const planar = d3.geoPath();                                   // the file is already projected: planar centroids
const population = raw.slice(1)
  .map((r) => { const [p, state, county] = Object.values(r); return { population: +p, f: countymap.get(state + county), s: statemap.get(state) }; })
  .filter((d) => d.f)
  .map(({ population, f, s }) => {
    const [x, y] = planar.centroid(f);
    return { county: f.properties.name, state: s?.properties.name ?? '', x, y, population };
  });

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 5, right: 80, bottom: 5, left: 5 },
  projection: { type: 'identity', domain: { type: 'MultiPoint', coordinates: [[0, 0], [975, 610]] } }, // the file's own pixel frame
  data: d3.sort(population, (d) => -d.population),
  schema: {
    county:     { type: 'categorical' },
    state:      { type: 'categorical' },
    x:          { type: 'quantitative' },
    y:          { type: 'quantitative' },
    population: { type: 'quantitative', domain: [0, 1.1e7] },
  },
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.nation), fill: '#ddd', stroke: 'none' }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: 'none', stroke: 'white' }),
    geoPoint({
      fill: 'brown', fillOpacity: 0.5, stroke: '#fff', strokeOpacity: 0.5,
      tip: { text: ['county', 'state', 'population'], format: ',d' }, // hover names the county
      channels: {
        lon: { field: 'x' }, lat: { field: 'y' },
        size: { field: 'population', scale: { type: 'sqrt', range: [0, 20] } },
      },
    }),
    legendSize({ anchor: 'right', title: 'population', tickFormat: '~s' }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Size six counties',
      question: 'How many people live in each of these six large counties?',
      try: 'Drag outward from a bubble to grow it, inward to shrink it.',
      why: 'The bubbles are fixed at their counties; only `size` carries an edit. `resize()` reads the pointer’s distance from the bubble’s centre back through the square-root scale, so the area you draw is the population you mean, and the legend keys it. The mark’s `tip` reads the value back as you hover.',
      uses: ['resize()', 'geoPoint', 'legendSize', 'tip'],
      code: `const us = await plotData('observablehq__plot-us-bubble-map', 'counties-albers-10m.json');
const counties = topojson.feature(us, us.objects.counties).features;
const planar = d3.geoPath();
const picks = [['06037', 'Los Angeles'], ['17031', 'Cook'], ['48201', 'Harris'], ['04013', 'Maricopa'], ['36047', 'Kings'], ['12086', 'Miami-Dade']];

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 5, right: 80, bottom: 5, left: 5 },
  projection: { type: 'identity', domain: { type: 'MultiPoint', coordinates: [[0, 0], [975, 610]] } }, // the file's own pixel frame
  data: picks.map(([id, name]) => {
    const [x, y] = planar.centroid(counties.find((f) => f.id === id));
    return { name, x, y, population: 1e6 };
  }),
  schema: {
    name:       { type: 'categorical' },
    x:          { type: 'quantitative' },
    y:          { type: 'quantitative' },
    population: { type: 'quantitative', domain: [0, 1.1e7] },
  },
  constraints: [ clamp({ field: 'population', min: 0, max: 1.1e7 }) ],
  marks: [
    geoBasemap({ geojson: topojson.feature(us, us.objects.nation), fill: '#ddd', stroke: 'none' }),
    geoBasemap({ geojson: topojson.mesh(us, us.objects.states, (a, b) => a !== b), fill: 'none', stroke: 'white' }),
    geoPoint({
      fill: 'brown', fillOpacity: 0.5, stroke: 'brown',
      tip: { text: ['name', 'population'], format: '.3s' },    //! hover reads out your estimate, even under the label
      channels: {
        lon: { field: 'x' }, lat: { field: 'y' },
        size: { field: 'population', scale: { type: 'sqrt', range: [0, 20] }, edit: resize() }, //! drag the rim to set the population
      },
    }),
    geoText({ fontSize: 9, dy: -14, channels: { lon: { field: 'x' }, lat: { field: 'y' }, text: { field: 'name' } } }),
    legendSize({ anchor: 'right', title: 'population', tickFormat: '~s' }),
  ],
}))`,
    },
  ],
});

GALLERY.add({
  id: 'plot-isotype-chart',
  status: 'partial',
  verdict: 'A unit chart of livestock emoji, one per million animals, drawn with `waffleX` and a symbol channel. Faceting is not covered by this study, so the country facets become combined row labels.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'No `fy` facet: each row is labelled “country · animal” instead of grouping rows under a country heading.',
    'Counts are rounded to whole millions, as the notebook does with `repeat`.',
    'The original repeats emoji in a `text` mark, so an emoji waffle is the faithful form. The second interface draws the same animals as `shape` pictograms from SVG paths.',
  ],
  recreation: {
    code: `const data = [
  { animal: 'pigs', country: 'Great Britain', count: 1354979 },
  { animal: 'cattle', country: 'Great Britain', count: 3962921 },
  { animal: 'sheep', country: 'Great Britain', count: 10931215 },
  { animal: 'pigs', country: 'United States', count: 6281935 },
  { animal: 'cattle', country: 'United States', count: 9917873 },
  { animal: 'sheep', country: 'United States', count: 7084151 },
];
const rows = data.map((d) => ({ row: \`\${d.country} · \${d.animal}\`, animal: d.animal, millions: Math.round(d.count / 1e6) }));

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 16, bottom: 10, left: 150 },
  caption: 'Live stock (millions)',
  data: rows,
  schema: {
    row:      { type: 'categorical', domain: rows.map((d) => d.row) },
    animal:   { type: 'categorical', domain: ['cattle', 'sheep', 'pigs'] },
    millions: { type: 'quantitative', domain: [0, 12] },
  },
  scales: { y: { type: 'band', reverse: true } },
  axes: { x: false, y: {} },
  marks: [
    waffleX({
      gap: 2, showEmpty: false,
      channels: {
        y: { field: 'row' },
        count: { field: 'millions' },
        symbol: { field: 'animal', scale: { range: ['🐄', '🐑', '🐖'] } },
      },
    }),
  ],
}))`,
  },
  interfaces: [
    {
      title: 'Count the flock',
      question: 'How many million cattle, sheep and pigs do you think Great Britain has today?',
      try: 'Click a cell to fill the row up to it, or drag along a row.',
      why: '`edit.waffle.fill()` maps the pointer to a cell and sets the count to it, so each answer is a whole number of animals-per-million you can count by eye.',
      uses: ['waffleX', 'edit.waffle.fill()', 'symbol'],
      code: `mount(Elicit({
  width: 460, height: 200,
  margins: { top: 10, right: 16, bottom: 30, left: 60 },
  data: [{ animal: 'cattle', millions: 1 }, { animal: 'sheep', millions: 1 }, { animal: 'pigs', millions: 1 }],
  schema: {
    animal:   { type: 'categorical', domain: ['cattle', 'sheep', 'pigs'] },
    millions: { type: 'quantitative', domain: [0, 36] },
  },
  constraints: [ snap({ step: 1 }) ],
  scales: { y: { type: 'band', reverse: true } },
  axes: { x: false, y: {} },
  marks: [
    waffleX({
      gap: 1, showEmpty: true,
      channels: {
        y: { field: 'animal' },
        count: { field: 'millions', edit: edit.waffle.fill() },  //! drag along a row to set the count
        symbol: { field: 'animal', scale: { range: ['🐄', '🐑', '🐖'] } },
      },
      edits: [ edit.waffle.fill({ channels: ['count'], gesture: 'click' }) ], //! or click a cell
    }),
  ],
}))`,
    },
    {
      title: 'Herds today',
      question: 'The chart counts United States livestock in the 1930s. How many million cattle, sheep and pigs does the country have today?',
      try: 'Drag each coloured pictogram along its row. The grey ones are the 1930s counts.',
      why: '`shape` draws an SVG path per row, picked by the `symbol` channel through a `range` of paths, so each animal is a pictogram. `move()` on `x` sets the count and `snap` keeps it to whole millions; the 1930s counts are `context` rows drawn with the same shapes.',
      uses: ['shape', 'symbol', 'move()', 'snap()', 'context'],
      code: `const cow = 'M2 7 L14 7 L16 4 L17 6 L19 6 L20 9 L18 10 L16 10 L16 15 L14 15 L14 12 L5 12 L5 15 L3 15 L3 11 L1 9 Z';
const sheep = 'M3 9 A3 3 0 0 1 6 5 A3 3 0 0 1 11 4.5 A3 3 0 0 1 15 6 L18 6 L19 9 L16 10 L15 12 L14 12 L14 15 L12 15 L12 12 L7 12 L7 15 L5 15 L5 12 A3 3 0 0 1 3 9 Z';
const pig = 'M2 9 A7 4.5 0 0 1 16 7 L19 7 L19 10 L16 11 L15 12 L15 15 L13 15 L13 13 L6 13 L6 15 L4 15 L4 12 A3 3 0 0 1 2 9 Z';
const then = [{ animal: 'cattle', in1930s: 10 }, { animal: 'sheep', in1930s: 7 }, { animal: 'pigs', in1930s: 6 }];
const symbol = { field: 'animal', scale: { range: [cow, sheep, pig] } };   // one path per animal

mount(Elicit({
  width: 460, height: 220,
  margins: { top: 10, right: 20, bottom: 36, left: 60 },
  schema: {
    animal:   { type: 'categorical', domain: ['cattle', 'sheep', 'pigs'] },
    millions: { type: 'quantitative', domain: [0, 100] },
    in1930s:  { type: 'quantitative', domain: [0, 100] },     // the 1930s counts' own column
  },
  data: [...then, ...then.map(({ animal }) => ({ animal, millions: 50 }))], // start every answer mid-scale
  context: (d) => d.in1930s != null,                          // the 1930s counts are context
  constraints: [ snap({ step: 1 }), clamp({ min: 0, max: 100 }) ],
  scales: { y: { type: 'point', reverse: true } },
  axes: { x: { title: 'Millions of animals →', grid: true }, y: {} },
  marks: [
    shape({ size: 14, fill: '#cbd5e1', channels: { x: { field: 'in1930s' }, y: { field: 'animal' }, symbol } }),
    shape({
      size: 14,
      channels: {
        x: { field: 'millions', edit: move() },                //! drag a pictogram along its row
        y: { field: 'animal' },
        symbol,                                                //! the \`symbol\` scale's range is SVG paths
        fill: { field: 'animal', scale: { range: ['#8c564b', '#7f7f7f', '#e377c2'] } },
      },
    }),
  ],
}))`,
    },
  ],
});
