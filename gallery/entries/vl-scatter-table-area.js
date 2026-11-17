// Vega-Lite gallery: "Scatter & Strip Plots", "Table-based Plots",
// "Area Charts & Streamgraphs".

// ============================================================ Scatter & Strip

GALLERY.add({
  id: 'vl-point_2d',
  status: 'full',
  verdict: 'A `point` mark with a hollow stroke over two quantitative fields reproduces the scatterplot exactly.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Rows with a missing horsepower or mileage are filtered out first (Vega-Lite drops them silently).'],
  recreation: {
    code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 50] },
  },
  axes: {
    x: { title: 'Horsepower', grid: true },
    y: { title: 'Miles_per_Gallon', grid: true },
  },
  marks: [
    point({
      fill: 'none', stroke: '#4c78a8', strokeWidth: 1.5, size: 3.5,
      channels: { x: { field: 'hp' }, y: { field: 'mpg' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the trend',
      question: 'For cars of this era, how many miles per gallon does each extra horsepower cost?',
      try: 'Drag the round handle at 100 hp up or down, then swing the line by either end.',
      why: 'The cars are `context` rows, so they are drawn but never elicited. The answer is one row, `{ intercept, slope }`, and `edit.trend.intercept()` and `edit.trend.slope()` each claim their own handle. `anchor: 100` puts the intercept handle at 100 hp, inside the data; the stored `intercept` is still the line\'s value at 0 hp.',
      uses: ['trend()', 'edit.trend.intercept()', 'edit.trend.slope()', 'context'],
      code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 50] },
    intercept: { type: 'quantitative' },
    slope:     { type: 'quantitative' },
  },
  data: [...cars, { intercept: 25, slope: 0 }],             // a flat prior: "horsepower doesn't matter"
  context: (d) => d.hp != null,                             //! the observed cars: drawn, never elicited
  axes: { origin: false, x: { title: 'Horsepower' }, y: { title: 'Miles_per_Gallon' } },
  marks: [
    point({
      size: 3, fill: 'none', stroke: '#94a3b8',
      channels: { x: { field: 'hp' }, y: { field: 'mpg' } },
    }),
    trend({
      anchor: 100,                                          //! the intercept is read at 100 hp
      stroke: '#e45756', strokeWidth: 2.5,
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        intercept: { field: 'intercept', edit: edit.trend.intercept() }, //! shifts the line; stored as mpg at 0 hp
        slope:     { field: 'slope',     edit: edit.trend.slope() },     //! mpg per horsepower
      },
    }),
  ],
}));`,
    },
    {
      title: 'Add next year\'s cars',
      question: 'Where would five cars from the 1983 model year sit on this chart?',
      try: 'Click empty space to add a car (up to five), drag one to move it, Alt-click to remove it.',
      why: 'The 1970–82 cars are `context` rows with columns of their own, so they are read-only and left out of `getData()`: the answer is just the cars you place. `count()` counts the context rows too, so its `max` is the record plus five, and `strategy: "reject"` refuses a sixth car.',
      uses: ['create()', 'move()', 'remove()', 'count()', 'context'],
      code: `const seen = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ seenHp: d.Horsepower, seenMpg: d.Miles_per_Gallon }));
const hp = { type: 'quantitative', domain: [0, 240] };
const mpg = { type: 'quantitative', domain: [0, 50] };

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  schema: { hp, mpg, seenHp: hp, seenMpg: mpg },
  data: seen,
  context: true,                                             //! the record can't be dragged
  // count() counts the context rows too: the record plus five new cars.
  constraints: [ count({ max: seen.length + 5, strategy: 'reject' }) ], //! five cars, no more
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    point({
      size: 3, fill: 'none', stroke: '#a5b4c8', strokeWidth: 1.5,
      channels: { x: { field: 'seenHp' }, y: { field: 'seenMpg' } },
    }),
    point({
      size: 7, fill: '#e45756', stroke: '#fff', strokeWidth: 1.5,
      channels: { x: { field: 'hp' }, y: { field: 'mpg' } },
      edits: [
        create({ when: when.noAlt }),                        //! click to add a car
        move({ channels: ['x', 'y'] }),
        remove({ when: when.alt }),
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-tick_dot',
  status: 'full',
  verdict: 'A `tickX` per day along a single quantitative axis is the same strip plot.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: {
    code: `const days = (await vegaData('seattle-weather.csv'))
  .map((d) => ({ precipitation: d.precipitation }));

mount(Elicit({
  width: 420, height: 64,
  margins: { top: 6, right: 12, bottom: 36, left: 12 },
  data: days,
  schema: { precipitation: { type: 'quantitative', domain: [0, 60] } },
  axes: { x: { title: 'precipitation', grid: true } },
  marks: [
    tickX({
      stroke: '#4c78a8', strokeWidth: 1, length: 18,
      channels: { x: { field: 'precipitation' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drop ten rainy days',
      question: 'Take ten rainy days in a Seattle November. How much rain (mm) falls on each?',
      try: 'Click the strip to drop a tick (ten at most), drag a tick to move it, Alt-click to remove it.',
      why: '`create()` inverts the click through the x scale to mint a row, and `count({ max: 10, strategy: "reject" })` refuses an eleventh. The ticks you place are the elicited sample, so their spread is your belief about the distribution.',
      uses: ['create()', 'move()', 'remove()', 'count()'],
      code: `mount(Elicit({
  width: 420, height: 90,
  margins: { top: 8, right: 12, bottom: 36, left: 12 },
  data: [],
  schema: { precipitation: { type: 'quantitative', domain: [0, 60] } },
  constraints: [ count({ max: 10, strategy: 'reject' }) ],  //! a sample of ten days
  axes: { x: { title: 'precipitation (mm)', grid: true } },
  marks: [
    tickX({
      stroke: '#4c78a8', strokeWidth: 3, length: 40,
      channels: { x: { field: 'precipitation', edit: move() } }, //! drag along x only
      edits: [
        create({ when: when.noAlt }),                       //! click to drop a day
        remove({ when: when.alt }),
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-tick_strip',
  status: 'full',
  verdict: '`tickX` on a quantitative x with an ordinal y draws one strip of ticks per cylinder count.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Cars with no horsepower are filtered out first.'],
  recreation: {
    code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null)
  .map((d) => ({ hp: d.Horsepower, cyl: d.Cylinders }));

mount(Elicit({
  width: 420, height: 150,
  margins: { top: 6, right: 12, bottom: 36, left: 44 },
  data: cars,
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    cyl: { type: 'ordinal', domain: [8, 6, 5, 4, 3] },   // listed bottom-up
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'cyl' } },
  marks: [
    tickX({
      stroke: '#4c78a8', strokeWidth: 1, length: 14,
      channels: { x: { field: 'hp' }, y: { field: 'cyl' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Typical power per engine',
      question: 'For a new car sold today, what is the typical horsepower at each cylinder count?',
      try: 'Drag each tick left or right.',
      why: '`move()` on `x` writes the horsepower of the row you grab. `monotonic({ along: "cyl" })` is a dataset invariant: drag the 4-cylinder tick past the 6-cylinder one and the 6 is pushed along with it, so more cylinders never means less power.',
      uses: ['move()', 'monotonic()'],
      code: `mount(Elicit({
  width: 420, height: 170,
  margins: { top: 6, right: 12, bottom: 36, left: 44 },
  data: [3, 4, 5, 6, 8].map((cyl) => ({ cyl, hp: 150 })),   // a flat prior
  schema: {
    hp:  { type: 'quantitative', domain: [0, 500] },
    cyl: { type: 'ordinal', domain: [8, 6, 5, 4, 3] },   // listed bottom-up
  },
  constraints: [ monotonic({ field: 'hp', along: 'cyl' }) ], //! more cylinders, never less power
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'cyl' } },
  marks: [
    tickX({
      stroke: '#4c78a8', strokeWidth: 4, length: 18,
      channels: {
        x: { field: 'hp', edit: move({ pick: 'nearest', threshold: 16 }) }, //! drag along x; grabs the nearest tick
        y: { field: 'cyl' },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_color_with_shape',
  status: 'full',
  verdict: 'A `shape` mark with `stroke` and `symbol` both bound to species gives the redundant colour-and-shape encoding, with Vega-Lite\'s hollow circle, square and triangle.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The legend keys colour with square swatches; Vega-Lite merges colour and shape into one legend of hollow symbols.',
    'Penguins with a missing measurement are filtered out first.',
  ],
  recreation: {
    code: `const penguins = (await vegaData('penguins.json'))
  .filter((d) => d['Flipper Length (mm)'] != null && d['Body Mass (g)'] != null)
  .map((d) => ({ flipper: d['Flipper Length (mm)'], mass: d['Body Mass (g)'], species: d.Species }));

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 64 },
  data: penguins,
  schema: {
    flipper: { type: 'quantitative', domain: [170, 235] },
    mass:    { type: 'quantitative', domain: [2500, 6500] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  },
  axes: {
    x: { title: 'Flipper Length (mm)', grid: true },
    y: { title: 'Body Mass (g)', grid: true, tickFormat: ',' },
  },
  marks: [
    shape({
      fill: 'none', strokeWidth: 1.5, size: 4, opacity: 0.8,
      channels: {
        x: { field: 'flipper' }, y: { field: 'mass' },
        stroke: { field: 'species', legend: { title: 'Species' } },
        symbol: { field: 'species', scale: { range: ['circle', 'square', 'triangle'] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Classify the birds',
      question: 'Six penguins were measured but not identified. Which species is each one?',
      try: 'Click a grey star-shaped bird to step it through the species.',
      why: '`cycle()` on `fill` steps the row\'s `species` through the schema domain on each click, and `symbol` re-derives from the same field. The measured population is `context` rows with columns of their own, so you classify against the clusters without being able to move them.',
      uses: ['cycle()', 'shape()', 'context'],
      code: `const tint = { Adelie: '#4e79a7', Chinstrap: '#f28e2b', Gentoo: '#e15759' };
const all = (await vegaData('penguins.json'))
  .filter((d) => d['Flipper Length (mm)'] != null && d['Body Mass (g)'] != null)
  .map((d) => ({ popFlipper: d['Flipper Length (mm)'], popMass: d['Body Mass (g)'], known: d.Species }));
// Six real birds with their species hidden.
const mystery = [all[10], all[60], all[160], all[200], all[260], all[300]]
  .map((d) => ({ flipper: d.popFlipper, mass: d.popMass, species: '?' }));
const flipper = { type: 'quantitative', domain: [170, 235] };
const mass = { type: 'quantitative', domain: [2500, 6500] };

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 64 },
  schema: {
    flipper, mass, popFlipper: flipper, popMass: mass,
    species: { type: 'categorical', domain: ['?', 'Adelie', 'Chinstrap', 'Gentoo'] }, //! the answers a click steps through
    known:   { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  },
  data: [...all, ...mystery],
  context: (d) => d.known != null,                          //! the population is read-only
  axes: { x: { title: 'Flipper Length (mm)' }, y: { title: 'Body Mass (g)', tickFormat: ',' } },
  marks: [
    point({
      size: 2.5, opacity: 0.25,
      channels: {
        x: { field: 'popFlipper' }, y: { field: 'popMass' },
        fill: { field: 'known', scale: { range: [tint.Adelie, tint.Chinstrap, tint.Gentoo] } },
      },
    }),
    shape({
      size: 8, stroke: '#1f2733', strokeWidth: 0.75,
      channels: {
        x: { field: 'flipper' }, y: { field: 'mass' },
        fill: {
          field: 'species', legend: { title: 'Species' },
          scale: { range: ['#94a3b8', tint.Adelie, tint.Chinstrap, tint.Gentoo] },
          edit: cycle(),                                    //! click steps to the next species
        },
        symbol: { field: 'species', scale: { range: ['wye', 'circle', 'square', 'triangle'] } },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Fence the Gentoos',
      question: 'Draw the box where you expect a newly measured Gentoo penguin to fall.',
      try: 'Drag an edge or corner to resize the box, or its body to move it.',
      why: '`brushRect()` edits all four extents of one `rect` row: an edge resizes one side, a corner two, the body moves the box. The penguins are `context` rows, so the answer is that single row: a flipper range and a mass range.',
      uses: ['brushRect()', 'rect()', 'context'],
      code: `const tint = { Adelie: '#4e79a7', Chinstrap: '#f28e2b', Gentoo: '#e15759' };
const all = (await vegaData('penguins.json'))
  .filter((d) => d['Flipper Length (mm)'] != null && d['Body Mass (g)'] != null)
  .map((d) => ({ flipper: d['Flipper Length (mm)'], mass: d['Body Mass (g)'], known: d.Species }));
const flip = { type: 'quantitative', domain: [170, 235] };
const mass = { type: 'quantitative', domain: [2500, 6500] };

mount(Elicit({
  width: 400, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 64 },
  schema: {
    f1: flip, f2: flip, m1: mass, m2: mass,
    flipper: flip, mass,
    known: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
  },
  data: [...all, { f1: 195, f2: 210, m1: 3500, m2: 4500 }], // start in the wrong place
  context: (d) => d.known != null,                          //! the penguins are read-only
  axes: { x: { title: 'Flipper Length (mm)' }, y: { title: 'Body Mass (g)', tickFormat: ',' } },
  marks: [
    point({
      size: 2.5, opacity: 0.5,
      channels: {
        x: { field: 'flipper' }, y: { field: 'mass' },
        fill: { field: 'known', scale: { range: [tint.Adelie, tint.Chinstrap, tint.Gentoo] } },
      },
    }),
    rect({
      fill: tint.Gentoo, fillOpacity: 0.15, stroke: tint.Gentoo, strokeWidth: 2,
      channels: {
        x1: { field: 'f1' }, x2: { field: 'f2' },           //! a flipper range…
        y1: { field: 'm1' }, y2: { field: 'm2' },           //! …and a mass range
      },
      edits: [ brushRect({ edgeInset: 10 }) ],              //! edges, corners and body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_bubble',
  status: 'full',
  verdict: 'A `point` with a `size` channel on acceleration reproduces the bubble plot.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Vega-Lite\'s size scale is linear in AREA; the recreation states `scale: "sqrt"` on `size` to match, since ElicitJS sizes are radii.'],
  recreation: {
    code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, acc: d.Acceleration }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 50] },
    acc: { type: 'quantitative', domain: [0, 25] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    point({
      fill: 'none', stroke: '#4c78a8', strokeWidth: 1.5,
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        size: { field: 'acc', scale: { type: 'sqrt', range: [0, 7] },
                legend: { title: 'Acceleration', ticks: 4 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Size each bubble',
      question: 'How many seconds does each of these cars take to reach 60 mph?',
      try: 'Drag outward from a bubble to grow it, inward to shrink it.',
      why: '`edit.resize()` on `size` reads the pointer\'s distance from the bubble\'s centre and inverts it through the same `sqrt` scale that drew the radius, so the legend reads the value back. Every car starts at the same 15 s.',
      uses: ['edit.resize()', 'legendSize()'],
      code: `const picks = ['chevrolet monte carlo', 'mazda glc', 'ford pinto', 'volkswagen rabbit', 'plymouth fury iii'];
const cars = (await vegaData('cars.json'))
  .filter((d) => picks.includes(d.Name) && d.Horsepower != null)
  .filter((d, i, all) => all.findIndex((e) => e.Name === d.Name) === i)
  .map((d) => ({ name: d.Name, hp: d.Horsepower, mpg: d.Miles_per_Gallon, acc: 15 }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    name: { type: 'categorical' },
    hp:   { type: 'quantitative', domain: [0, 240] },
    mpg:  { type: 'quantitative', domain: [0, 50] },
    acc:  { type: 'quantitative', domain: [0, 25] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    point({
      fill: '#4c78a8', fillOpacity: 0.25, stroke: '#4c78a8', strokeWidth: 1.5,
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        size: {
          field: 'acc', scale: { type: 'sqrt', range: [0, 16] },
          legend: { title: 'seconds', ticks: 3 },
          edit: edit.resize(),                              //! drag out to grow, in to shrink
        },
      },
    }),
    text({
      fontSize: 10, fill: '#334155', dy: 22,
      channels: { x: { field: 'hp' }, y: { field: 'mpg' }, text: { field: 'name' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_invalid_color',
  status: 'full',
  verdict: 'Missing ratings are placed at zero and greyed by a derived `fill`, which is what `invalid: null` plus the colour condition does.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['The null-to-zero mapping and the grey test are computed in JavaScript: the rows carry a `missing` flag and the scatter reads zeros.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json')).map((d) => ({
  imdb: d['IMDB Rating'] ?? 0,
  rt: d['Rotten Tomatoes Rating'] ?? 0,
  missing: d['IMDB Rating'] == null || d['Rotten Tomatoes Rating'] == null ? 'yes' : 'no',
}));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: movies,
  schema: {
    imdb:    { type: 'quantitative', domain: [0, 10] },
    rt:      { type: 'quantitative', domain: [0, 100] },
    missing: { type: 'categorical', domain: ['no', 'yes'] },
  },
  axes: {
    x: { title: 'IMDB Rating', grid: true },
    y: { title: 'Rotten Tomatoes Rating', grid: true },
  },
  marks: [
    point({
      fill: 'none', strokeWidth: 1.2, size: 3,
      channels: {
        x: { field: 'imdb' }, y: { field: 'rt' },
        stroke: { field: 'missing', scale: { range: ['#4c78a8', '#aaa'] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill in the gaps',
      question: 'These films have an IMDB rating but no Rotten Tomatoes score. What would critics give them?',
      try: 'Drag each red dot up from the axis to your guess.',
      why: 'The films missing a score sit at zero, the same convention the original uses. `move()` on `y` changes only the missing score and keeps the IMDB rating. The 200 complete films are `context` rows with columns of their own, so they frame the guess and stay out of `getData()`.',
      uses: ['move()', 'context'],
      code: `const all = await vegaData('movies.json');
const known = all
  .filter((d) => d['IMDB Rating'] != null && d['Rotten Tomatoes Rating'] != null)
  .slice(0, 200)
  .map((d) => ({ knownImdb: d['IMDB Rating'], knownRt: d['Rotten Tomatoes Rating'] }));
const gaps = ['Se7en', 'X2', 'Terminator 3: Rise of the Machines', "Harry Potter and the Sorcerer's Stone"]
  .map((t) => all.find((d) => d.Title === t))
  .map((d) => ({ title: d.Title.split(':')[0], imdb: d['IMDB Rating'], rt: 0 }));
const imdb = { type: 'quantitative', domain: [0, 10] };
const rt = { type: 'quantitative', domain: [0, 100] };

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  schema: { title: { type: 'categorical' }, imdb, rt, knownImdb: imdb, knownRt: rt },
  data: [...known, ...gaps],
  context: (d) => d.knownImdb != null,                      //! the complete films are context
  axes: { x: { title: 'IMDB Rating', grid: true }, y: { title: 'Rotten Tomatoes Rating', grid: true } },
  marks: [
    point({
      size: 3, fill: 'none', stroke: '#a5b4c8', strokeWidth: 1.2,
      channels: { x: { field: 'knownImdb' }, y: { field: 'knownRt' } },
    }),
    point({
      size: 6, fill: '#e45756', stroke: '#fff', strokeWidth: 1.2,
      channels: {
        x: { field: 'imdb' },
        y: { field: 'rt', edit: move() },                   //! drag the score; IMDB stays put
      },
    }),
    text({
      fontSize: 10, fill: '#b91c1c', angle: 40, textAnchor: 'start', dx: 6, dy: -6,
      channels: { x: { field: 'imdb' }, y: { field: 'rt' }, text: { field: 'title' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle',
  status: 'full',
  verdict: 'A filled `point` reproduces Vega-Lite\'s `circle` mark.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    mpg: { type: 'quantitative', domain: [0, 50] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    point({
      fill: '#4c78a8', opacity: 0.7, size: 3.5,
      channels: { x: { field: 'hp' }, y: { field: 'mpg' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the frontier',
      question: 'At each horsepower, what is the best fuel economy an engineer could get?',
      try: 'Drag across the chart from left to right to draw the frontier; drag again to redraw part of it.',
      why: '`edit.line.draw()` mints one row per `samples` column as the pointer crosses it, so a single stroke draws the curve. The cars are `context` rows with columns of their own, drawn by the same filled `point`, so the drawing is the only data.',
      uses: ['edit.line.draw()', 'context'],
      code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ carHp: d.Horsepower, carMpg: d.Miles_per_Gallon }));
const hp = { type: 'quantitative', domain: [40, 240] };
const mpg = { type: 'quantitative', domain: [0, 50] };

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  schema: { hp, mpg, carHp: hp, carMpg: mpg },
  data: cars,
  context: true,                                             //! the cars are drawn, not elicited
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    point({
      fill: '#4c78a8', opacity: 0.35, size: 3,
      channels: { x: { field: 'carHp' }, y: { field: 'carMpg' } },
    }),
    lineY({
      stroke: '#e45756', strokeWidth: 3, curve: 'monotoneX', handleSize: 3,
      channels: { x: { field: 'hp' }, y: { field: 'mpg' } },
      edits: [ edit.line.draw({ samples: d3.range(40, 241, 10) }) ], //! one drag draws the curve
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_bubble_health_income',
  status: 'full',
  verdict: 'The log-income bubble plot is reproduced, and `edit.axis.zoom()` with `edit.axis.pan()` on both axes gives the wheel zoom and drag pan that `bind: "scales"` provides.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Zoom and pan stop at the declared domains, so you cannot zoom out or pan past the full view; `bind: "scales"` has no such limit. Every zoom and pan is one undo step, and the plot clips the bubbles they push outside it.'],
  recreation: {
    code: `const countries = (await vegaData('gapminder-health-income.csv'))
  .map((d) => ({ income: d.income, health: d.health, population: d.population }));

// Label only the 1s, 2s and 5s of each decade, however far you zoom.
const label = (v) => (/^[125]$/.test(String(+(v / 10 ** Math.floor(Math.log10(v))).toFixed(6))) ? d3.format('~s')(v) : '');

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 24, bottom: 36, left: 48 },
  data: countries,
  schema: {
    income:     { type: 'quantitative', domain: [100, 1000000] },
    health:     { type: 'quantitative', domain: [45, 85] },
    population: { type: 'quantitative', domain: [0, 1.4e9] },
  },
  axes: {
    x: { title: 'income', grid: true, tickFormat: label, edits: [edit.axis.zoom(), edit.axis.pan()] },
    y: { title: 'health', grid: true, edits: [edit.axis.zoom(), edit.axis.pan()] },
  },
  marks: [
    point({
      fill: '#000', opacity: 0.7,
      channels: {
        x: { field: 'income', scale: 'log' },
        y: { field: 'health' },
        size: { field: 'population', scale: { type: 'sqrt', range: [0, 10] },
                legend: { title: 'population', tickFormat: '~s' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Guess life expectancy',
      question: 'Given their income, how long do people live in Niger, India, Turkey, the United States and Qatar?',
      try: 'Drag each red bubble up or down; its income is fixed. Wheel over the plot to zoom in on the crowd, and drag empty space to pan.',
      why: '`move()` on `y` alone sets health and keeps income. The other 182 countries are `context` rows with columns of their own, so they frame the guess and stay out of `getData()`. `edit.axis.zoom()` and `edit.axis.pan()` on each axis zoom the domain about the pointer and slide it, so you can read a crowded stretch closely. A press on a red bubble still moves it.',
      uses: ['move()', 'context', 'edit.axis.zoom()', 'edit.axis.pan()'],
      code: `const ask = ['Niger', 'India', 'Turkey', 'United States', 'Qatar'];
const all = (await vegaData('gapminder-health-income.csv'));
const given = all.filter((d) => !ask.includes(d.country))
  .map((d) => ({ givenIncome: d.income, givenHealth: d.health, givenPop: d.population }));
const asked = all.filter((d) => ask.includes(d.country))
  .map((d) => ({ country: d.country, income: d.income, health: 65, population: d.population })); // a neutral 65
const income = { type: 'quantitative', domain: [100, 1000000] };
const health = { type: 'quantitative', domain: [45, 85] };
const population = { type: 'quantitative', domain: [0, 1.4e9] };

// Label only the 1s, 2s and 5s of each decade, however far you zoom.
const label = (v) => (/^[125]$/.test(String(+(v / 10 ** Math.floor(Math.log10(v))).toFixed(6))) ? d3.format('~s')(v) : '');

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 24, bottom: 36, left: 48 },
  schema: {
    country: { type: 'categorical' }, income, health, population,
    givenIncome: income, givenHealth: health, givenPop: population,
  },
  data: [...given, ...asked],
  context: (d) => d.givenIncome != null,                    //! the other countries are context
  axes: {
    x: { title: 'income', grid: true, tickFormat: label, edits: [edit.axis.zoom(), edit.axis.pan()] }, //! wheel to zoom, drag to pan
    y: { title: 'health', grid: true, edits: [edit.axis.zoom(), edit.axis.pan()] },
  },
  marks: [
    point({
      fill: '#cbd5e1', opacity: 0.8,
      channels: {
        x: { field: 'givenIncome', scale: 'log' }, y: { field: 'givenHealth' },
        size: { field: 'givenPop', scale: { type: 'sqrt', range: [1, 12] } },
      },
    }),
    point({
      fill: '#e45756', opacity: 0.85,
      channels: {
        x: { field: 'income', scale: 'log' },
        y: { field: 'health', edit: move() },               //! drag health; income stays put
        size: { field: 'population', scale: { type: 'sqrt', range: [1, 12] } },
      },
    }),
    text({
      fontSize: 10, fill: '#7f1d1d', dy: -14,
      channels: { x: { field: 'income', scale: 'log' }, y: { field: 'health' }, text: { field: 'country' } },
    }),
  ],
}));`,
    },
    {
      title: 'How many people?',
      question: 'How many people live in Ethiopia, Nigeria, Bangladesh, Brazil and Japan?',
      try: 'Drag a bubble up to grow it, down to shrink it.',
      why: '`slide({ axis: "y" })` on `size` turns vertical drag distance into population, relative to where you grabbed, so pressing a bubble never changes it. The legend reads the radius back as a number.',
      uses: ['slide()', 'legendSize()'],
      code: `const ask = ['Ethiopia', 'Nigeria', 'Bangladesh', 'Brazil', 'Japan'];
const rows = (await vegaData('gapminder-health-income.csv'))
  .filter((d) => ask.includes(d.country))
  .map((d) => ({ country: d.country, income: d.income, health: d.health, population: 50e6 }));

// Label only the 1s, 2s and 5s of each decade, however far you zoom.
const label = (v) => (/^[125]$/.test(String(+(v / 10 ** Math.floor(Math.log10(v))).toFixed(6))) ? d3.format('~s')(v) : '');

mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 24, bottom: 36, left: 48 },
  data: rows,
  schema: {
    country:    { type: 'categorical' },
    income:     { type: 'quantitative', domain: [100, 1000000] },
    health:     { type: 'quantitative', domain: [45, 85] },
    population: { type: 'quantitative', domain: [0, 300e6] },
  },
  axes: { x: { title: 'income', grid: true, tickFormat: label }, y: { title: 'health', grid: true } },
  marks: [
    point({
      fill: '#000', fillOpacity: 0.55,
      channels: {
        x: { field: 'income', scale: 'log' }, y: { field: 'health' },
        size: {
          field: 'population', scale: { type: 'sqrt', range: [0, 30] },
          legend: { title: 'population', tickFormat: '~s', ticks: 3 },
          edit: slide({ axis: 'y', extent: 160 }),          //! drag up to grow
        },
      },
    }),
    text({
      fontSize: 10, fill: '#1f2733', dy: 4,
      channels: { x: { field: 'income', scale: 'log' }, y: { field: 'health' }, text: { field: 'country' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_natural_disasters',
  status: 'full',
  verdict: 'A `point` per entity and year, sized by deaths and coloured by entity, reproduces the bubble timeline.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['Year is plotted as a number with a `d` tick format rather than as a temporal field.'],
  recreation: {
    code: `const rows = (await vegaData('disasters.csv'))
  .filter((d) => d.Entity !== 'All natural disasters')
  .map((d) => ({ entity: d.Entity, year: d.Year, deaths: d.Deaths }));

mount(Elicit({
  width: 480, height: 360,
  margins: { top: 10, right: 12, bottom: 30, left: 124 },
  data: rows,
  schema: {
    entity: { type: 'categorical', domain: [...new Set(rows.map((d) => d.entity))].sort().reverse() }, // bottom-up
    year:   { type: 'quantitative', domain: [1900, 2017] },
    deaths: { type: 'quantitative', domain: [0, 3.7e6] },
  },
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: '' } },
  marks: [
    point({
      opacity: 0.8, stroke: '#000', strokeWidth: 1,
      channels: {
        x: { field: 'year' },
        y: { field: 'entity' },
        fill: { field: 'entity' },
        size: { field: 'deaths', scale: { type: 'sqrt', range: [0, 30] },
                legend: { title: 'deaths', tickFormat: '~s', ticks: 3 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Forecast the 2030s',
      question: 'In a typical year of the 2030s, how many people will each kind of disaster kill?',
      try: 'Drag a bubble in the 2030 column up to grow it, down to shrink it.',
      why: 'One `point` draws the record and the forecast. `context: (d) => d.year < 2030` marks the 1970–2017 record, so only the 2030 column moves and `getData()` holds just the forecast. `slide({ axis: "y" })` on `size` turns vertical drag distance into deaths, relative to where you grabbed, so the bubble never jumps when pressed.',
      uses: ['slide()', 'context'],
      code: `const record = (await vegaData('disasters.csv'))
  .filter((d) => d.Entity !== 'All natural disasters' && d.Year >= 1970)
  .map((d) => ({ entity: d.Entity, year: d.Year, deaths: d.Deaths }));
const kinds = [...new Set(record.map((d) => d.entity))].sort();

mount(Elicit({
  width: 480, height: 360,
  margins: { top: 10, right: 12, bottom: 30, left: 124 },
  schema: {
    entity: { type: 'categorical', domain: [...kinds].reverse() },
    year:   { type: 'quantitative', domain: [1970, 2032] },
    deaths: { type: 'quantitative', domain: [0, 500000] },
  },
  data: [...record, ...kinds.map((entity) => ({ entity, year: 2030, deaths: 20000 }))],
  context: (d) => d.year < 2030,                            //! the record is fixed
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: '' } },
  guides: [ guides.region({ x: [2025, 2032], fill: '#fde68a', opacity: 0.35 }) ],
  marks: [
    point({
      opacity: 0.8, stroke: '#000',
      channels: {
        x: { field: 'year' }, y: { field: 'entity' }, fill: { field: 'entity' },
        strokeWidth: { fn: (d) => (d.year < 2030 ? 1 : 1.5) }, // the forecast is outlined heavier
        size: {
          field: 'deaths', scale: { type: 'sqrt', range: [0, 24] },
          edit: slide({ axis: 'y', extent: 200 }),          //! drag up to grow the 2030 bubble
        },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-text_scatterplot_colored',
  status: 'full',
  verdict: 'A `text` mark whose `text` channel derives the origin\'s initial and whose `fill` encodes origin is the same coloured-letter scatterplot.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null && d.Miles_per_Gallon != null)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, origin: d.Origin }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp:     { type: 'quantitative', domain: [0, 240] },
    mpg:    { type: 'quantitative', domain: [0, 50] },
    origin: { type: 'categorical', domain: ['Europe', 'Japan', 'USA'] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    text({
      fontSize: 11, lineAnchor: 'middle',
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        text: { fn: (d) => d.origin[0] },                   // E, J or U
        fill: { field: 'origin', legend: { title: 'Origin' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Label by origin',
      question: 'From power and fuel economy alone, where was each of these eight cars built?',
      try: 'Click a ? to select it, then click a swatch in the legend to label it.',
      why: '`edit.select()` makes the letter you click the selected row, and `edit.legend.category()` writes the swatch you click into that row\'s `origin`. The letter and its colour re-derive from the field, so the chart shows your answer.',
      uses: ['edit.select()', 'edit.legend.category()'],
      code: `const names = ['toyota corolla', 'bmw 2002', 'ford mustang', 'peugeot 504',
               'chevrolet impala', 'volvo 144ea', 'honda civic', 'plymouth duster'];
const cars = (await vegaData('cars.json'))
  .filter((d) => names.includes(d.Name))
  .filter((d, i, all) => all.findIndex((e) => e.Name === d.Name) === i)
  .map((d) => ({ hp: d.Horsepower, mpg: d.Miles_per_Gallon, origin: '?' }));

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 50 },
  data: cars,
  schema: {
    hp:     { type: 'quantitative', domain: [50, 230] },
    mpg:    { type: 'quantitative', domain: [10, 35] },
    origin: { type: 'categorical', domain: ['?', 'Europe', 'Japan', 'USA'] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'Miles_per_Gallon', grid: true } },
  marks: [
    text({
      fontSize: 18, lineAnchor: 'middle',
      channels: {
        x: { field: 'hp' }, y: { field: 'mpg' },
        text: { fn: (d) => d.origin[0] },
        fill: { field: 'origin',
                scale: { range: ['#94a3b8', '#4e79a7', '#f28e2b', '#e15759'] } },
      },
      edits: [ edit.select() ],                             //! click a letter to pick the row
    }),
    legendColor({ anchor: 'right', title: 'Origin', edit: edit.legend.category() }), //! the swatch you click is written to it
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-scatter_image',
  status: 'partial',
  verdict: 'There is no image mark; a `guides.custom` layer can draw an image at each row\'s position, but the image itself is not an encoded, pickable mark.',
  needs: ['image-mark'],
  prep: [],
  gaps: [
    'The logos are drawn by a custom guide reading the rows, not by a mark with a `url` channel, so they cannot be picked or edited directly.',
    'An invisible `point` under each logo is what a gesture grabs.',
  ],
  recreation: {
    code: `const base = 'https://cdn.jsdelivr.net/npm/vega-datasets@3/';
mount(Elicit({
  width: 300, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 40 },
  data: [
    { x: 0.5, y: 0.5, img: 'data/ffox.png' },
    { x: 1.5, y: 1.5, img: 'data/gimp.png' },
    { x: 2.5, y: 2.5, img: 'data/7zip.png' },
  ],
  schema: {
    x:   { type: 'quantitative', domain: [0, 3] },
    y:   { type: 'quantitative', domain: [0, 3] },
    img: { type: 'categorical' },
  },
  axes: { x: { title: 'x', grid: true }, y: { title: 'y', grid: true } },
  guides: [
    // No image mark: draw one 50px image per row at the row's position.
    guides.custom(({ data, scales }) => data.map((d) => ({
      type: 'image', background: true, href: base + d.img, width: 50, height: 50,
      x: scales.x.encode(d.x) - 25, y: scales.y.encode(d.y) - 25,
    }))),
  ],
  marks: [ point({ size: 0, channels: { x: { field: 'x' }, y: { field: 'y' } } }) ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the tools',
      question: 'How easy is each tool to learn (left = hard) and how often do you use it (up = daily)?',
      try: 'Drag a logo to its place.',
      why: 'A transparent `point` sits under each logo and carries `move()` on `x` and `y`. The logos are a `guides.custom` layer that reads the rows, so they follow the point you drag.',
      uses: ['move()', 'guides.custom()'],
      code: `const base = 'https://cdn.jsdelivr.net/npm/vega-datasets@3/';
mount(Elicit({
  width: 320, height: 300,
  margins: { top: 10, right: 12, bottom: 36, left: 40 },
  data: [                                                  // all start mid-height
    { x: 0.8, y: 1.5, img: 'data/ffox.png' },
    { x: 1.5, y: 1.5, img: 'data/gimp.png' },
    { x: 2.2, y: 1.5, img: 'data/7zip.png' },
  ],
  schema: {
    x:   { type: 'quantitative', domain: [0, 3] },
    y:   { type: 'quantitative', domain: [0, 3] },
    img: { type: 'categorical' },
  },
  axes: { x: { title: 'easy to learn', ticks: 0 }, y: { title: 'use', ticks: 0 } },
  guides: [
    guides.custom(({ data, scales }) => data.map((d) => ({    //! logos follow their rows
      type: 'image', background: true, href: base + d.img, width: 44, height: 44,
      x: scales.x.encode(d.x) - 22, y: scales.y.encode(d.y) - 22,
    }))),
  ],
  marks: [
    point({
      size: 24, fill: '#4c78a8', fillOpacity: 0.08,
      channels: { x: { field: 'x' }, y: { field: 'y' } },
      edits: [ move({ channels: ['x', 'y'], mode: 'relative' }) ], //! drag the logo, not its centre
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_custom_tick_labels',
  status: 'full',
  verdict: 'Mean rating per genre as a `point` on a band of genres, with `tickValues` and a `tickFormat` function giving the Poor / Neutral / Great labels.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['Films with no genre are labelled "null", as Vega-Lite does.'],
  recreation: {
    code: `const movies = (await vegaData('movies.json')).filter((d) => d['IMDB Rating'] != null);
const means = d3.rollups(movies, (v) => d3.mean(v, (d) => d['IMDB Rating']),
                         (d) => String(d['Major Genre']))
  .map(([genre, rating]) => ({ genre, rating }))
  .sort((a, b) => b.rating - a.rating);   // sort: "x", listed bottom-up

mount(Elicit({
  width: 420, height: 300,
  margins: { top: 10, right: 16, bottom: 26, left: 130 },
  data: means,
  schema: {
    genre:  { type: 'categorical', domain: means.map((d) => d.genre) },
    rating: { type: 'quantitative', domain: [0, 10] },
  },
  axes: {
    x: { title: '', grid: true, tickValues: [0, 5, 10],
         tickFormat: (v) => (v === 0 ? 'Poor' : v === 5 ? 'Neutral' : 'Great') },
    y: { title: '' },
  },
  marks: [
    point({
      fill: '#4c78a8', opacity: 0.7, size: 5,
      channels: { x: { field: 'rating' }, y: { field: 'genre' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rate each genre',
      question: 'What is the average IMDB rating of a film in each genre?',
      try: 'Drag each dot left or right. It snaps to half points.',
      why: '`move()` on `x` writes the rating, and `snap({ step: 0.5 })` rounds every proposal to half a point. The Poor / Neutral / Great ticks are the same `tickFormat` function as the original, so the axis reads like a survey scale.',
      uses: ['move()', 'snap()'],
      code: `const genres = ['Western', 'Musical', 'Horror', 'Drama', 'Documentary', 'Comedy', 'Action'];

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 16, bottom: 26, left: 90 },
  data: genres.map((genre) => ({ genre, rating: 5 })),     // everything starts Neutral
  schema: {
    genre:  { type: 'categorical', domain: genres },
    rating: { type: 'quantitative', domain: [0, 10] },
  },
  constraints: [ snap({ step: 0.5 }) ],                     //! half-point answers
  axes: {
    x: { title: '', grid: true, tickValues: [0, 5, 10],
         tickFormat: (v) => (v === 0 ? 'Poor' : v === 5 ? 'Neutral' : 'Great') },
    y: { title: '' },
  },
  marks: [
    point({
      fill: '#4c78a8', size: 7,
      channels: {
        x: { field: 'rating', edit: move() },               //! drag along the rating
        y: { field: 'genre' },
      },
    }),
    text({
      fontSize: 10, fill: '#334155', dx: 12, textAnchor: 'start', format: '.1f',
      channels: { x: { field: 'rating' }, y: { field: 'genre' }, text: { field: 'rating' } },
    }),
  ],
}));`,
    },
    {
      title: 'Rank the genres',
      question: 'Rank these six genres from best- to worst-rated on IMDB, then place each on the scale.',
      try: 'Drag a dot up or down to move it to another place in the ranking, or left and right to rate it.',
      why: 'This is the original\'s own chart: a dot per genre on a Poor / Neutral / Great scale, the genres listed best first. `rank()` on `y` inserts the genre at the slot you drop it on, and `move()` on `x` rates it; the two read different components of the drag. `monotonic({ dir: "down" })` keeps the ratings in rank order, so re-ranking a genre pushes its neighbours\' ratings along.',
      uses: ['rank()', 'move()', 'monotonic()'],
      code: `mount(Elicit({
  width: 420, height: 240,
  margins: { top: 10, right: 16, bottom: 26, left: 90 },
  data: ['Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Musical']
    .map((genre, i) => ({ genre, rank: i + 1, rating: 5 })),  // everything starts Neutral
  schema: {
    genre:  { type: 'categorical' },
    rank:   { type: 'ordinal', domain: [6, 5, 4, 3, 2, 1] },   // rank 1 on top
    rating: { type: 'quantitative', domain: [0, 10] },
  },
  constraints: [ monotonic({ field: 'rating', along: 'rank', dir: 'down' }) ], //! a better rank never rates lower
  axes: {
    x: { title: '', grid: true, tickValues: [0, 5, 10],
         tickFormat: (v) => (v === 0 ? 'Poor' : v === 5 ? 'Neutral' : 'Great') },
    y: false,
  },
  marks: [
    point({
      fill: '#4c78a8', size: 7,
      channels: {
        x: { field: 'rating', edit: move() },               //! left and right rates it
        y: { field: 'rank', edit: rank() },                 //! up and down re-ranks it
      },
    }),
    text({                                                  // the genre labels, where the axis was
      fontSize: 11, fill: '#334155', textAnchor: 'end', lineAnchor: 'middle',
      channels: { x: { value: -8 }, y: { field: 'rank' }, text: { field: 'genre' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_offset_random',
  status: 'full',
  verdict: 'Jitter is a derived column: each car gets a random offset inside its cylinder row, and the y axis labels the rows.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'There is no `yOffset` channel: the jitter is added to a quantitative y in JavaScript, and `tickValues` + `tickFormat` put the cylinder labels on the row centres.',
    'The random offsets use a seeded generator, so they differ from Vega-Lite\'s.',
  ],
  recreation: {
    code: `const cyls = [3, 4, 5, 6, 8];
const jitter = d3.randomUniform.source(d3.randomLcg(7))(0.05, 0.95);
const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null)
  .map((d) => ({ hp: d.Horsepower, row: cyls.indexOf(d.Cylinders) + jitter() }));

mount(Elicit({
  width: 420, height: 270,
  margins: { top: 6, right: 12, bottom: 36, left: 40 },
  data: cars,
  schema: {
    hp:  { type: 'quantitative', domain: [0, 240] },
    row: { type: 'quantitative', domain: [5, 0] },          // first row on top
  },
  axes: {
    x: { title: 'Horsepower', grid: true },
    y: { title: 'cyl', tickValues: [0.5, 1.5, 2.5, 3.5, 4.5],
         tickFormat: (v) => String(cyls[Math.floor(v)]) },
  },
  marks: [
    point({
      fill: 'none', stroke: '#4c78a8', strokeWidth: 1.2, size: 3,
      channels: { x: { field: 'hp' }, y: { field: 'row' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Bracket each row',
      question: 'What horsepower range covers the middle half of cars in each cylinder class?',
      try: 'Drag a bar\'s end to resize it, or its middle to slide it.',
      why: '`brushSpan()` on `x1`/`x2` resizes the end you grab and translates the bar when you grab its body. One row per cylinder class holds the two ends; the jittered cars are a `guides.custom` backdrop placed with the band scale\'s centre and `authoring.bandwidthOf`.',
      uses: ['brushSpan()', 'barX()', 'guides.custom()'],
      code: `const cyls = [3, 4, 5, 6, 8];
const jitter = d3.randomUniform.source(d3.randomLcg(7))(-0.4, 0.4);
const cars = (await vegaData('cars.json'))
  .filter((d) => d.Horsepower != null)
  .map((d) => ({ hp: d.Horsepower, cyl: d.Cylinders, j: jitter() }));

mount(Elicit({
  width: 420, height: 270,
  margins: { top: 6, right: 12, bottom: 36, left: 40 },
  data: cyls.map((cyl) => ({ cyl, lo: 80, hi: 140 })),     // the same guess everywhere
  schema: {
    cyl: { type: 'ordinal', domain: [...cyls].reverse() },   // listed bottom-up
    lo:  { type: 'quantitative', domain: [0, 240] },
    hi:  { type: 'quantitative', domain: [0, 240] },
  },
  axes: { x: { title: 'Horsepower', grid: true }, y: { title: 'cyl' } },
  guides: [
    guides.custom(({ scales }) => cars.map((d) => ({
      type: 'circle', r: 2.5, fill: 'none', stroke: '#64748b', strokeOpacity: 0.6,
      cx: scales.x.encode(d.hp),
      cy: scales.y.encode(d.cyl) + d.j * authoring.bandwidthOf(scales.y),
    }))),
  ],
  marks: [
    barX({
      fill: '#f58518', fillOpacity: 0.12, stroke: '#f58518', strokeWidth: 2,
      channels: { y: { field: 'cyl' }, x1: { field: 'lo' }, x2: { field: 'hi' } }, //! one range per row
      edits: [ brushSpan({ edgeInset: 10 }) ], //! ends resize, body slides
    }),
  ],
}));`,
    },
  ],
});

// ============================================================ Area Charts & Streamgraphs

GALLERY.add({
  id: 'vl-area',
  status: 'full',
  verdict: 'An `areaY` over the monthly total reproduces the area chart once the sum is aggregated.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['Time is a fractional year with a `d` tick format rather than a temporal field.'],
  recreation: {
    code: `const rows = await vegaData('unemployment-across-industries.json');
const total = d3.rollups(rows, (v) => d3.sum(v, (d) => d.count),
                         (d) => d.year + (d.month - 1) / 12)
  .map(([t, count]) => ({ t, count }))
  .sort((a, b) => a.t - b.t);

mount(Elicit({
  width: 340, height: 220,
  margins: { top: 10, right: 12, bottom: 30, left: 68 },
  data: total,
  schema: {
    t:     { type: 'quantitative', domain: [2000, 2010.1] },
    count: { type: 'quantitative', domain: [0, 16000] },
  },
  axes: { x: { title: '', tickFormat: 'd', ticks: 6 }, y: { title: 'count', grid: true, tickFormat: ',' } },
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 1, stroke: 'none',
      channels: { x: { field: 't' }, y: { field: 'count' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep the recession',
      question: 'From mid-2008, how did the number of unemployed workers (thousands) move until early 2010?',
      try: 'Drag across the shaded months to paint the curve.',
      why: '`move({ pick: "sweep" })` re-targets the nearest month on every drag event, so one stroke paints every value it crosses. `lock` keeps the observed months fixed, and sweep skips locked rows, so the curve stays one continuous area.',
      uses: ['move({ pick: "sweep" })', 'lock', 'guides.region()'],
      code: `const rows = await vegaData('unemployment-across-industries.json');
const total = d3.rollups(rows, (v) => d3.sum(v, (d) => d.count),
                         (d) => d.year + (d.month - 1) / 12)
  .map(([t, count]) => ({ t, count }))
  .filter((d) => d.t >= 2006)
  .sort((a, b) => a.t - b.t);
const cut = 2008.5;
const last = total.filter((d) => d.t < cut).at(-1).count;
const data = total.map((d) => (d.t < cut ? d : { ...d, count: last })); // flat after the cut

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 10, right: 12, bottom: 30, left: 68 },
  data,
  lock: (d) => d.t < cut,                                   //! the observed months are fixed
  schema: {
    t:     { type: 'quantitative', domain: [2006, 2010.1] },
    count: { type: 'quantitative', domain: [0, 20000] },
  },
  axes: { x: { title: '', tickFormat: 'd', ticks: 5 }, y: { title: 'count', grid: true, tickFormat: ',' } },
  guides: [ guides.region({ x: [cut, 2010.1], fill: '#fde68a', opacity: 0.4 }) ],
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 0.7, stroke: '#1e3a5f', handles: 'hit',
      channels: {
        x: { field: 't' },
        y: { field: 'count', edit: move({ pick: 'sweep' }) }, //! one stroke paints every month it crosses
      },
    }),
  ],
}));`,
    },
    {
      title: 'Band the recession',
      question: 'For each quarter from mid-2008 to 2010, what range are you 80% sure covers the number of unemployed workers (thousands)?',
      try: 'Drag along the band\'s top edge to paint the high end, along its bottom edge to paint the low end.',
      why: 'The band is one `areaY` with `edit.line.sweep()` on both `y1` and `y2`. A sweep locks onto the edge nearest the pointer at dragstart and paints only that edge, so one stroke sets every high (or every low) it crosses. `ordering()` keeps each low below its high. The record is `context` rows drawn by a second `areaY`.',
      uses: ['edit.line.sweep()', 'areaY()', 'ordering()', 'context'],
      code: `const rows = await vegaData('unemployment-across-industries.json');
const record = d3.rollups(rows, (v) => d3.sum(v, (d) => d.count),
                          (d) => d.year + (d.month - 1) / 12)
  .map(([t, count]) => ({ t, count }))
  .filter((d) => d.t >= 2006 && d.t <= 2008.5)
  .sort((a, b) => a.t - b.t);
const last = record.at(-1).count;
const time = { type: 'quantitative', domain: [2006, 2010.1] };
const workers = { type: 'quantitative', domain: [0, 20000] };

mount(Elicit({
  width: 420, height: 240,
  margins: { top: 10, right: 12, bottom: 30, left: 68 },
  schema: { t: time, count: workers, lo: workers, hi: workers },
  data: [...record, ...d3.range(2008.5, 2010.01, 0.25).map((t) => ({ t, lo: last * 0.9, hi: last * 1.1 }))],
  context: (d) => d.count != null,                          //! the record is given
  constraints: [ ordering({ field: ['lo', 'hi'] }) ],      //! the low end stays below the high end
  axes: { x: { title: '', tickFormat: 'd', ticks: 5 }, y: { title: 'count', grid: true, tickFormat: ',' } },
  marks: [
    areaY({
      fill: '#4c78a8', fillOpacity: 1, stroke: 'none',
      channels: { x: { field: 't' }, y: { field: 'count' } },
    }),
    areaY({
      fill: '#f58518', fillOpacity: 0.35, stroke: '#f58518', handles: 'hit',
      channels: {
        x:  { field: 't' },
        y1: { field: 'lo', edit: edit.line.sweep() },       //! a stroke near the bottom edge paints the lows
        y2: { field: 'hi', edit: edit.line.sweep() },       //! a stroke near the top edge paints the highs
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-area_gradient',
  status: 'full',
  verdict: 'An `areaY` with a white-to-dark-green `gradient` and a `lineY` along its top reproduce the gradient area chart.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 380, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  data: goog,
  schema: {
    date:  { type: 'temporal', domain: d3.extent(goog, (d) => d.date) },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { title: 'price', grid: true } },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 0.7,                     // Vega-Lite's area opacity
      gradient: { stops: [[0, 'white'], [1, 'darkgreen']], direction: 'vertical' }, // white at the base
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
    lineY({
      stroke: 'darkgreen', strokeWidth: 1.5,
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fan out 2010',
      question: 'Give a range you are 80% sure Google\'s monthly price will stay inside through 2010.',
      try: 'Drag the upper and lower handles of each month.',
      why: 'The 2007–09 prices are `context` rows drawn with the original\'s gradient, so `getData()` is just the twelve months you answer. Each row is a `lo`/`hi` pair: `y1` and `y2` each carry a `move()`, and `ordering()` keeps the low end below the high end whichever you drag.',
      uses: ['areaY()', 'move()', 'ordering()', 'context'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2007, 0, 1) && d.date < new Date(2010, 0, 1));
const months = d3.timeMonth.range(new Date(2010, 0, 1), new Date(2011, 0, 1));
const date = { type: 'temporal', domain: [new Date(2007, 0, 1), new Date(2010, 11, 1)] };
const price = { type: 'quantitative', domain: [0, 1000] };

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  schema: { date, price, lo: price, hi: price },
  data: [...goog, ...months.map((date) => ({ date, lo: 560, hi: 680 }))],
  context: (d) => d.price != null,                          //! the record is given
  constraints: [ ordering({ field: ['lo', 'hi'] }) ],      //! low stays below high
  axes: { x: { title: '' }, y: { title: 'price', grid: true } },
  marks: [
    areaY({
      stroke: 'darkgreen', strokeWidth: 1.5,
      gradient: { stops: [[0, 'white'], [1, 'darkgreen']] },
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
    areaY({
      fill: '#f58518', fillOpacity: 0.35, stroke: '#f58518',
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: move({ channels: ['y1'] }) }, //! the low edge
        y2: { field: 'hi', edit: move({ channels: ['y2'] }) }, //! the high edge
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the fan',
      question: 'Give a range you are 80% sure Google\'s monthly price will stay inside through 2010.',
      try: 'Drag along the fan\'s top edge to paint the high end, along its bottom edge to paint the low end.',
      why: 'The same question as a stroke rather than twenty-four handles: `edit.line.sweep()` on `y1` and `y2` locks onto the edge nearest the pointer at dragstart and paints only that edge across every month it crosses. The fan carries the original\'s white-to-green `gradient`, and `ordering()` keeps the low end below the high end.',
      uses: ['edit.line.sweep()', 'gradient', 'ordering()', 'context'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2007, 0, 1) && d.date < new Date(2010, 0, 1));
const months = d3.timeMonth.range(new Date(2009, 11, 1), new Date(2011, 0, 1));
const date = { type: 'temporal', domain: [new Date(2007, 0, 1), new Date(2010, 11, 1)] };
const price = { type: 'quantitative', domain: [0, 1000] };

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  schema: { date, price, lo: price, hi: price },
  data: [...goog, ...months.map((date) => ({ date, lo: 560, hi: 680 }))],
  context: (d) => d.price != null,
  constraints: [ ordering({ field: ['lo', 'hi'] }) ],
  axes: { x: { title: '' }, y: { title: 'price', grid: true } },
  marks: [
    lineY({
      stroke: 'darkgreen', strokeWidth: 1.5,
      channels: { x: { field: 'date' }, y: { field: 'price' } },
    }),
    areaY({
      stroke: 'darkgreen', strokeWidth: 1, handles: 'hit',
      gradient: { stops: [[0, 'white'], [1, 'darkgreen']] }, //! the original's fill, on the answer
      channels: {
        x:  { field: 'date' },
        y1: { field: 'lo', edit: edit.line.sweep() },       //! a stroke near the bottom edge paints the lows
        y2: { field: 'hi', edit: edit.line.sweep() },       //! a stroke near the top edge paints the highs
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-area_overlay',
  status: 'full',
  verdict: 'An `areaY`, a `lineY` and a `point` over the same rows reproduce the area with its line and point overlay.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [],
  recreation: {
    code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }));

mount(Elicit({
  width: 380, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  data: goog,
  schema: {
    date:  { type: 'temporal', domain: d3.extent(goog, (d) => d.date) },
    price: { type: 'quantitative', domain: [0, 800] },
  },
  axes: { x: { title: 'date' }, y: { title: 'price', grid: true } },
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.7, stroke: 'none',
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    lineY({ stroke: '#4c78a8', strokeWidth: 1.5,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    point({ fill: '#4c78a8', size: 2.5,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw 2010',
      question: 'How will Google\'s monthly price move through 2010?',
      try: 'Drag across the empty months to draw the price; drag again to redraw part of it.',
      why: '`edit.line.draw()` mints a row at each `samples` date the pointer crosses. The area and the points are views over the same rows, so they fill in behind your line. The 2007–09 record is `context` rows with a `close` column of their own, drawn by three marks in blue, so `getData()` holds only your drawing.',
      uses: ['edit.line.draw()', 'context'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), close: d.price }))
  .filter((d) => d.date >= new Date(2007, 0, 1) && d.date < new Date(2010, 0, 1));
const months = d3.timeMonth.range(new Date(2010, 0, 1), new Date(2011, 0, 1));
const price = { type: 'quantitative', domain: [0, 1000] };
const past = { x: { field: 'date' }, y: { field: 'close' } };
const xy = { x: { field: 'date' }, y: { field: 'price' } };

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  schema: {
    date: { type: 'temporal', domain: [new Date(2007, 0, 1), new Date(2010, 11, 1)] },
    price, close: price,
  },
  data: goog,
  context: true,                                             //! the record is given
  axes: { x: { title: '' }, y: { title: 'price', grid: true } },
  guides: [ guides.region({ x: [months[0], months.at(-1)], fill: '#fde68a', opacity: 0.4 }) ],
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.5, stroke: 'none', channels: past }),
    lineY({ stroke: '#4c78a8', strokeWidth: 1.5, channels: past }),
    point({ fill: '#4c78a8', size: 2.5, channels: past }),
    areaY({ fill: '#e45756', fillOpacity: 0.3, stroke: 'none', channels: xy }),
    lineY({
      stroke: '#e45756', strokeWidth: 2, handleSize: 2.5, channels: xy,
      edits: [ edit.line.draw({ samples: months }) ],      //! one row per month you cross
    }),
    point({ fill: '#e45756', size: 2.5, channels: xy }),
  ],
}));`,
    },
    {
      title: 'Bracket the scenarios',
      question: 'Sketch a bad-year and a good-year path for Google\'s monthly price through 2010.',
      try: 'Drag along the upper edge to paint the good year, along the lower edge to paint the bad year.',
      why: 'The band\'s `y1` and `y2` each carry `edit.line.sweep()`, and a sweep locks onto the edge nearest the pointer at dragstart, so a stroke paints one scenario across every month it crosses. Two `point` layers ride the edges, the way the original overlays points on its area. `ordering()` keeps the bad year below the good one.',
      uses: ['edit.line.sweep()', 'areaY()', 'point()', 'ordering()'],
      code: `const goog = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol === 'GOOG')
  .map((d) => ({ date: new Date(d.date), price: d.price }))
  .filter((d) => d.date >= new Date(2007, 0, 1) && d.date < new Date(2010, 0, 1));
const months = d3.timeMonth.range(new Date(2009, 11, 1), new Date(2011, 0, 1));
const date = { type: 'temporal', domain: [new Date(2007, 0, 1), new Date(2010, 11, 1)] };
const price = { type: 'quantitative', domain: [0, 1000] };

mount(Elicit({
  width: 420, height: 260,
  margins: { top: 10, right: 12, bottom: 30, left: 62 },
  schema: { date, price, bad: price, good: price },
  data: [...goog, ...months.map((date) => ({ date, bad: 560, good: 680 }))],
  context: (d) => d.price != null,                          // the record is given
  constraints: [ ordering({ field: ['bad', 'good'] }) ],   //! the bad year stays below the good one
  axes: { x: { title: '' }, y: { title: 'price', grid: true } },
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.7, stroke: 'none',
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    point({ fill: '#4c78a8', size: 2.5,
            channels: { x: { field: 'date' }, y: { field: 'price' } } }),
    areaY({
      fill: '#f58518', fillOpacity: 0.3, stroke: '#f58518', handles: 'hit',
      channels: {
        x:  { field: 'date' },
        y1: { field: 'bad', edit: edit.line.sweep() },      //! a stroke near the lower edge paints the bad year
        y2: { field: 'good', edit: edit.line.sweep() },     //! a stroke near the upper edge paints the good year
      },
    }),
    point({ fill: '#b45309', size: 2.5, channels: { x: { field: 'date' }, y: { field: 'bad' } } }),
    point({ fill: '#b45309', size: 2.5, channels: { x: { field: 'date' }, y: { field: 'good' } } }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-stacked_area',
  status: 'full',
  verdict: 'An `areaY` with a `y1`/`y2` pair per industry, coloured by industry, draws the stacked area once the cumulative bounds are computed.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: [
    '`area` has no `stack` option: each band\'s lower and upper edge is summed in JavaScript.',
    'The `category20b` scheme is passed as an explicit `range`.',
  ],
  recreation: {
    code: `const rows = await vegaData('unemployment-across-industries.json');
const order = [...new Set(rows.map((d) => d.series))].sort();
const stacked = [];
for (const [t, group] of d3.group(rows, (d) => d.year + (d.month - 1) / 12)) {
  let base = 0;                                    // first series on top
  for (const series of [...order].reverse()) {
    const count = d3.sum(group.filter((d) => d.series === series), (d) => d.count);
    stacked.push({ t, series, lo: base, hi: (base += count) });
  }
}
const category20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b',
  '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a'];

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 10, right: 8, bottom: 34, left: 68 },
  data: stacked,
  schema: {
    t:      { type: 'quantitative', domain: [2000, 2010.1] },
    series: { type: 'categorical', domain: order },
    lo:     { type: 'quantitative', domain: [0, 16000] },
    hi:     { type: 'quantitative', domain: [0, 16000] },
  },
  axes: { x: { title: 'date', tickFormat: 'd', ticks: 6 }, y: { title: 'Sum of count', grid: true, tickFormat: ',' } },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        x: { field: 't' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', scale: { range: category20b },
                legend: { title: 'series', swatchSize: 8, fontSize: 9 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Grow each layer',
      question: 'How many workers (thousands) will be unemployed in construction, manufacturing and retail in 2011–13?',
      try: 'Drag a handle on a layer\'s top edge in 2011–13. The layers above it ride along.',
      why: 'The fills are an inert `areaY`; a `lineY` over each band\'s `hi` carries `move()`, so there is one handle per layer top. A `constraints.custom` rule turns that edge back into the band\'s own count and re-stacks the year, so the layers above shift instead of being squeezed. 2006–10 is the record, held by `lock`.',
      uses: ['move()', 'constraints.custom()', 'lock'],
      code: `const short = { 'Construction': 'Construction', 'Manufacturing': 'Manufacturing',
                'Wholesale and Retail Trade': 'Retail' };
const order = Object.values(short);
const rows = (await vegaData('unemployment-across-industries.json'))
  .filter((d) => short[d.series] && d.year >= 2006)
  .map((d) => ({ ...d, series: short[d.series] }));
const yearly = d3.rollups(rows, (v) => Math.round(d3.mean(v, (d) => d.count)),
                          (d) => d.year, (d) => d.series);
const restackYear = (data, year) => {                       // lo/hi from each row's count
  let base = 0;
  for (const s of order) {
    const r = data.find((d) => d.year === year && d.series === s);
    r.lo = base; r.hi = base += r.count;
  }
  return data;
};
let data = [];
for (const [year, bySeries] of yearly) {
  for (const [series, count] of bySeries) data.push({ year, series, count });
}
for (const year of [2011, 2012, 2013]) {
  for (const s of order) data.push({ year, series: s, count: 1000 });
}
for (const year of new Set(data.map((d) => d.year))) restackYear(data, year);

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 30, left: 62 },
  data,
  lock: (d) => d.year <= 2010,                              //! 2006–10 is the record
  schema: {
    year:   { type: 'quantitative', domain: [2006, 2013] },
    series: { type: 'categorical', domain: order },
    count:  { type: 'quantitative', domain: [0, 8000] },
    lo:     { type: 'quantitative', domain: [0, 8000] },
    hi:     { type: 'quantitative', domain: [0, 8000] },
  },
  constraints: [
    constraints.custom(({ data, activeIndex }) => {          //! an edge drag becomes a count, then re-stack
      if (activeIndex == null) return undefined;
      const next = data.map((d) => ({ ...d }));
      const a = next[activeIndex];
      a.count = Math.max(0, Math.round(a.hi - a.lo));
      return restackYear(next, a.year);
    }),
  ],
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: 'count', grid: true, tickFormat: ',' } },
  marks: [
    areaY({
      fillOpacity: 0.85, stroke: 'none',
      channels: {
        x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', legend: { title: '', anchor: 'top' } },
      },
    }),
    lineY({                                                 // one handle per layer top
      stroke: '#fff', strokeWidth: 1.5,
      channels: {
        x: { field: 'year' },
        y: { field: 'hi', edit: move() },                   //! drag a layer's top edge
        series: { field: 'series' },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep each layer',
      question: 'How many workers (thousands) will be unemployed in construction, manufacturing and retail each quarter from spring 2010 to the end of 2013?',
      try: 'Drag along a layer\'s top edge across the shaded quarters to paint it. The layers above ride along.',
      why: 'Here the stacked `areaY` itself carries the edit: `edit.line.sweep()` on `y2` locks onto the layer (its `series`) and the edge nearest the pointer at dragstart, and paints that edge across every quarter it crosses. The same `constraints.custom` rule turns each painted edge back into the layer\'s own count and re-stacks the quarter.',
      uses: ['edit.line.sweep()', 'constraints.custom()', 'lock'],
      code: `const short = { 'Construction': 'Construction', 'Manufacturing': 'Manufacturing',
                'Wholesale and Retail Trade': 'Retail' };
const order = Object.values(short);
const rows = (await vegaData('unemployment-across-industries.json'))
  .filter((d) => short[d.series] && d.year >= 2006)
  .map((d) => ({ ...d, series: short[d.series] }));
const quarterly = d3.rollups(rows, (v) => Math.round(d3.mean(v, (d) => d.count)),
                             (d) => d.year + Math.floor((d.month - 1) / 3) / 4, (d) => d.series);
const restack = (data, t) => {                              // lo/hi from each row's count
  let base = 0;
  for (const s of order) {
    const r = data.find((d) => d.t === t && d.series === s);
    r.lo = base; r.hi = base += r.count;
  }
  return data;
};
const data = [];
for (const [t, bySeries] of quarterly) {
  for (const [series, count] of bySeries) data.push({ t, series, count });
}
for (const t of d3.range(2010.25, 2014, 0.25)) {            // the forecast starts flat
  for (const s of order) data.push({ t, series: s, count: 1000 });
}
for (const t of new Set(data.map((d) => d.t))) restack(data, t);

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 30, left: 62 },
  data,
  lock: (d) => d.t <= 2010,                                 //! the record ends in early 2010
  schema: {
    t:      { type: 'quantitative', domain: [2006, 2013.75] },
    series: { type: 'categorical', domain: order },
    count:  { type: 'quantitative', domain: [0, 8000] },
    lo:     { type: 'quantitative', domain: [0, 8000] },
    hi:     { type: 'quantitative', domain: [0, 8000] },
  },
  constraints: [
    constraints.custom(({ data, activeIndex }) => {          //! a painted edge becomes a count, then re-stack
      if (activeIndex == null) return undefined;
      const next = data.map((d) => ({ ...d }));
      const a = next[activeIndex];
      a.count = Math.max(0, Math.round(a.hi - a.lo));
      return restack(next, a.t);
    }),
  ],
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: 'count', grid: true, tickFormat: ',' } },
  guides: [ guides.region({ x: [2010.25, 2013.75], fill: '#fde68a', opacity: 0.3 }) ],
  marks: [
    areaY({
      fillOpacity: 0.85, stroke: '#fff', strokeWidth: 1, handles: 'hit',
      channels: {
        x: { field: 't' }, y1: { field: 'lo' },
        y2: { field: 'hi', edit: edit.line.sweep() },       //! paint a layer's top edge
        fill: { field: 'series', legend: { title: '', anchor: 'top' } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-stacked_area_normalize',
  status: 'full',
  verdict: 'The normalized stack is the same `y1`/`y2` area with each month\'s bounds divided by the month\'s total.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: ['The normalization (`stack: "normalize"`) is computed in JavaScript.'],
  recreation: {
    code: `const rows = await vegaData('unemployment-across-industries.json');
const order = [...new Set(rows.map((d) => d.series))].sort();
const stacked = [];
for (const [t, group] of d3.group(rows, (d) => d.year + (d.month - 1) / 12)) {
  const total = d3.sum(group, (d) => d.count);
  let base = 0;
  for (const series of [...order].reverse()) {
    const share = d3.sum(group.filter((d) => d.series === series), (d) => d.count) / total;
    stacked.push({ t, series, lo: base, hi: Math.min(1, (base += share)) });
  }
}
const category20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b',
  '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a'];

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 10, right: 8, bottom: 30, left: 10 },
  data: stacked,
  schema: {
    t:      { type: 'quantitative', domain: [2000, 2010.1] },
    series: { type: 'categorical', domain: order },
    lo:     { type: 'quantitative', domain: [0, 1] },
    hi:     { type: 'quantitative', domain: [0, 1] },
  },
  axes: { x: { title: '', tickFormat: 'd', ticks: 6 }, y: false },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        x: { field: 't' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', scale: { range: category20b },
                legend: { title: 'series', swatchSize: 8, fontSize: 9 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Move the boundaries',
      question: 'By 2014, what share of the unemployed will come from construction, from manufacturing, and from everywhere else?',
      try: 'Drag a handle on the boundary between two layers in 2011–14.',
      why: 'The fills are an inert `areaY`; a `lineY` over each band\'s `hi` carries `move()`, so you drag one handle per boundary. A `constraints.custom` rule moves the next layer\'s lower edge with it, so one layer gains exactly what its neighbour loses and every year still sums to 100%.',
      uses: ['move()', 'constraints.custom()', 'lock'],
      code: `const order = ['Construction', 'Manufacturing', 'Other'];
const rows = await vegaData('unemployment-across-industries.json');
const data = [];
for (const [year, group] of d3.group(rows.filter((d) => d.year >= 2005), (d) => d.year)) {
  const total = d3.sum(group, (d) => d.count);
  const share = (s) => d3.sum(group.filter((d) => d.series === s), (d) => d.count) / total;
  const c = share('Construction'), m = share('Manufacturing');
  data.push({ year, series: 'Construction', lo: 0, hi: c },
            { year, series: 'Manufacturing', lo: c, hi: c + m },
            { year, series: 'Other', lo: c + m, hi: 1 });
}
for (const year of [2011, 2012, 2013, 2014]) {               // start every year at 2010's split
  data.push(...data.filter((d) => d.year === 2010).map((d) => ({ ...d, year })));
}

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 30, left: 40 },
  data,
  lock: (d) => d.year <= 2010,
  schema: {
    year:   { type: 'quantitative', domain: [2005, 2014] },
    series: { type: 'categorical', domain: order },
    lo:     { type: 'quantitative', domain: [0, 1] },
    hi:     { type: 'quantitative', domain: [0, 1] },
  },
  constraints: [
    constraints.custom(({ data, activeIndex }) => {          //! the layer above gives up what this one gains
      if (activeIndex == null) return undefined;
      const next = data.map((d) => ({ ...d }));
      const a = next[activeIndex];
      const k = order.indexOf(a.series);
      const above = next.find((d) => d.year === a.year && d.series === order[k + 1]);
      if (!above) { a.hi = 1; return next; }                // the top edge stays at 100%
      a.hi = Math.min(Math.max(a.hi, a.lo), above.hi);
      above.lo = a.hi;
      return next;
    }),
  ],
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: '', tickFormat: '.0%', grid: true } },
  marks: [
    areaY({
      fillOpacity: 0.85, stroke: 'none',
      channels: {
        x: { field: 'year' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', legend: { title: '', anchor: 'top' } },
      },
    }),
    lineY({                                                 // one handle per boundary
      stroke: '#fff', strokeWidth: 1.5,
      channels: {
        x: { field: 'year' },
        y: { field: 'hi', edit: move() },                   //! drag a boundary
        series: { field: 'series' },
      },
    }),
  ],
}));`,
    },
    {
      title: 'Sweep a boundary',
      question: 'By 2014, what share of the unemployed will come from construction, from manufacturing, and from everywhere else?',
      try: 'Drag along a boundary across 2011–14 to paint it; 2005–10 is the record.',
      why: 'The normalised `areaY` carries `edit.line.sweep()` on `y2`, so a stroke locks onto the layer whose top edge is nearest and paints that boundary across every year it crosses. The same `constraints.custom` rule moves the next layer\'s lower edge with each painted year, so the shares still sum to 100%.',
      uses: ['edit.line.sweep()', 'constraints.custom()', 'lock'],
      code: `const order = ['Construction', 'Manufacturing', 'Other'];
const rows = await vegaData('unemployment-across-industries.json');
const data = [];
for (const [year, group] of d3.group(rows.filter((d) => d.year >= 2005), (d) => d.year)) {
  const total = d3.sum(group, (d) => d.count);
  const share = (s) => d3.sum(group.filter((d) => d.series === s), (d) => d.count) / total;
  const c = share('Construction'), m = share('Manufacturing');
  data.push({ year, series: 'Construction', lo: 0, hi: c },
            { year, series: 'Manufacturing', lo: c, hi: c + m },
            { year, series: 'Other', lo: c + m, hi: 1 });
}
for (const year of [2011, 2012, 2013, 2014]) {               // start every year at 2010's split
  data.push(...data.filter((d) => d.year === 2010).map((d) => ({ ...d, year })));
}

mount(Elicit({
  width: 440, height: 260,
  margins: { top: 10, right: 16, bottom: 30, left: 40 },
  data,
  lock: (d) => d.year <= 2010,
  schema: {
    year:   { type: 'quantitative', domain: [2005, 2014] },
    series: { type: 'categorical', domain: order },
    lo:     { type: 'quantitative', domain: [0, 1] },
    hi:     { type: 'quantitative', domain: [0, 1] },
  },
  constraints: [
    constraints.custom(({ data, activeIndex }) => {          //! the layer above gives up what this one gains
      if (activeIndex == null) return undefined;
      const next = data.map((d) => ({ ...d }));
      const a = next[activeIndex];
      const k = order.indexOf(a.series);
      const above = next.find((d) => d.year === a.year && d.series === order[k + 1]);
      if (!above) { a.hi = 1; return next; }
      a.hi = Math.min(Math.max(a.hi, a.lo), above.hi);
      above.lo = a.hi;
      return next;
    }),
  ],
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: '', tickFormat: '.0%', grid: true } },
  marks: [
    areaY({
      fillOpacity: 0.85, stroke: '#fff', strokeWidth: 1, handles: 'hit',
      channels: {
        x: { field: 'year' }, y1: { field: 'lo' },
        y2: { field: 'hi', edit: edit.line.sweep() },       //! paint a boundary across the years
        fill: { field: 'series', legend: { title: '', anchor: 'top' } },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-stacked_area_stream',
  status: 'full',
  verdict: 'The streamgraph is the stacked `y1`/`y2` area with each month\'s stack centred on zero.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack'],
  gaps: ['The centre offset (`stack: "center"`) is computed in JavaScript.'],
  recreation: {
    code: `const rows = await vegaData('unemployment-across-industries.json');
const order = [...new Set(rows.map((d) => d.series))].sort();
const stacked = [];
for (const [t, group] of d3.group(rows, (d) => d.year + (d.month - 1) / 12)) {
  let base = -d3.sum(group, (d) => d.count) / 2;           // centre the stack on zero
  for (const series of [...order].reverse()) {
    const count = d3.sum(group.filter((d) => d.series === series), (d) => d.count);
    stacked.push({ t, series, lo: base, hi: (base += count) });
  }
}
const category20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b',
  '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a'];

mount(Elicit({
  width: 480, height: 260,
  margins: { top: 10, right: 8, bottom: 30, left: 10 },
  data: stacked,
  schema: {
    t:      { type: 'quantitative', domain: [2000, 2010.1] },
    series: { type: 'categorical', domain: order },
    lo:     { type: 'quantitative', domain: [-8000, 8000] },
    hi:     { type: 'quantitative', domain: [-8000, 8000] },
  },
  axes: { x: { title: '', tickFormat: 'd', ticks: 6, tickSize: 0 }, y: false },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 1,
      channels: {
        x: { field: 't' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', scale: { range: category20b },
                legend: { title: 'series', swatchSize: 8, fontSize: 9 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Bracket the surge',
      question: 'Over which months did unemployment rise fastest during the 2008–09 recession?',
      try: 'Drag the band\'s edges to bracket the months, or its body to slide it.',
      why: 'The stream is `context` rows drawn by the recreation\'s own stacked `areaY`. The answer is one row with a `start` and an `end`, drawn by a `rect` that spans the plot height, and `brushSpan()` resizes the edge you grab or slides both.',
      uses: ['brushSpan()', 'rect()', 'context'],
      code: `const rows = await vegaData('unemployment-across-industries.json');
const order = [...new Set(rows.map((d) => d.series))].sort();
const stream = [];
for (const [t, group] of d3.group(rows, (d) => d.year + (d.month - 1) / 12)) {
  let base = -d3.sum(group, (d) => d.count) / 2;
  for (const series of [...order].reverse()) {
    const count = d3.sum(group.filter((d) => d.series === series), (d) => d.count);
    stream.push({ t, series, lo: base, hi: (base += count) });
  }
}
const category20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b',
  '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a'];
const t = { type: 'quantitative', domain: [2000, 2010.1] };
const v = { type: 'quantitative', domain: [-8000, 8000] };

mount(Elicit({
  width: 440, height: 240,
  margins: { top: 10, right: 8, bottom: 30, left: 10 },
  schema: { start: t, end: t, t, lo: v, hi: v, series: { type: 'categorical', domain: order } },
  data: [...stream, { start: 2001, end: 2002 }],
  context: (d) => d.series != null,                         //! the stream is drawn, not elicited
  axes: { x: { title: '', tickFormat: 'd', ticks: 6 }, y: false },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 0.85,
      channels: {
        x: { field: 't' }, y1: { field: 'lo' }, y2: { field: 'hi' },
        fill: { field: 'series', scale: { range: category20b } },
      },
    }),
    rect({
      fill: '#111', fillOpacity: 0.15, stroke: '#111', strokeWidth: 1.5,
      channels: {
        x1: { field: 'start' }, x2: { field: 'end' },        //! a span of months
        y1: { value: 0 }, y2: { value: 200 },
      },
      edits: [ brushSpan({ edgeInset: 8 }) ],               //! edges resize, body slides
    }),
  ],
}));`,
    },
    {
      title: 'Sweep the stream',
      question: 'How many workers (thousands) will be unemployed in total each quarter through 2012?',
      try: 'Drag along the top or bottom edge of the grey stream to paint its thickness; the other edge mirrors it.',
      why: 'A streamgraph is centred on zero, so its thickness is the total. The forecast band has `edit.line.sweep()` on `y1` and `y2`, and a sweep paints only the edge nearest the pointer at dragstart. `symmetric({ about: "mid" })` mirrors that edge about the zero line, so one stroke sets the whole thickness. The record is `context` rows with `bottom` and `top` columns of their own, drawn by the stacked `areaY`.',
      uses: ['edit.line.sweep()', 'symmetric()', 'context'],
      code: `const rows = await vegaData('unemployment-across-industries.json');
const order = [...new Set(rows.map((d) => d.series))].sort();
const stream = [];
let last = 0;
for (const [t, group] of d3.group(rows, (d) => d.year + (d.month - 1) / 12)) {
  last = d3.sum(group, (d) => d.count);
  let base = -last / 2;
  for (const series of [...order].reverse()) {
    const count = d3.sum(group.filter((d) => d.series === series), (d) => d.count);
    stream.push({ t, series, bottom: base, top: (base += count) });
  }
}
const category20b = ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b',
  '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a'];
const t = { type: 'quantitative', domain: [2000, 2013] };
const v = { type: 'quantitative', domain: [-12000, 12000] };

mount(Elicit({
  width: 440, height: 240,
  margins: { top: 10, right: 8, bottom: 30, left: 10 },
  schema: {
    t, lo: v, hi: v, mid: v,
    bottom: v, top: v, series: { type: 'categorical', domain: order },
  },
  data: [...stream, ...d3.range(2010.25, 2013.01, 0.25).map((t) => ({ t, lo: -last / 2, hi: last / 2, mid: 0 }))],
  context: (d) => d.series != null,                         // the record is drawn, not elicited
  constraints: [ symmetric({ field: ['lo', 'hi'], about: 'mid' }) ], //! one edge mirrors the other about zero
  axes: { x: { title: '', tickFormat: 'd', ticks: 6 }, y: false },
  marks: [
    areaY({
      stroke: 'none', fillOpacity: 0.85,
      channels: {
        x: { field: 't' }, y1: { field: 'bottom' }, y2: { field: 'top' },
        fill: { field: 'series', scale: { range: category20b } },
      },
    }),
    areaY({
      fill: '#64748b', fillOpacity: 0.5, stroke: '#334155', handles: 'hit',
      channels: {
        x:  { field: 't' },
        y1: { field: 'lo', edit: edit.line.sweep() },       //! paint the bottom edge…
        y2: { field: 'hi', edit: edit.line.sweep() },       //! …or the top; the other follows
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-area_horizon',
  status: 'full',
  verdict: 'Two `areaY` layers over the folded series (the value capped at 50, and the overflow above 50) reproduce the two-band horizon.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: ['The fold is computed per point rather than by clipping, so where the curve crosses 50 between two points the band edge is flat instead of following the interpolated curve.'],
  recreation: {
    code: `const values = [28, 55, 43, 91, 81, 53, 19, 87, 52, 48, 24, 49, 87, 66, 17, 27, 68, 16, 49, 15];
const data = values.map((y, i) => ({
  x: i + 1, y,
  low: Math.min(y, 50),              // the first band
  high: Math.max(y - 50, 0),         // what spills over 50, folded down
}));

mount(Elicit({
  width: 344, height: 86,
  margins: { top: 4, right: 10, bottom: 32, left: 34 },   // a 300 × 50 plot
  data,
  schema: {
    x:    { type: 'quantitative', domain: [1, 20] },
    y:    { type: 'quantitative', domain: [0, 100] },
    low:  { type: 'quantitative', domain: [0, 50] },
    high: { type: 'quantitative', domain: [0, 50] },
  },
  axes: { x: { title: 'x', ticks: 10 }, y: { title: 'y', ticks: 2 } },
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.6, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'x' }, y: { field: 'low' } } }),
    areaY({ fill: '#4c78a8', fillOpacity: 0.3, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'x' }, y: { field: 'high' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Find the peak week',
      question: 'Reading the horizon, which five consecutive days add up to the most?',
      try: 'Drag the window left or right.',
      why: '`moveSpan()` translates the window\'s `x1` and `x2` together, so its width stays five days. Two `snap()` rules land both ends halfway between days, so the window always covers five whole days. The horizon is `context` rows drawn by the recreation\'s two folded `areaY` layers.',
      uses: ['moveSpan()', 'snap()', 'context'],
      code: `const values = [28, 55, 43, 91, 81, 53, 19, 87, 52, 48, 24, 49, 87, 66, 17, 27, 68, 16, 49, 15];
const days = values.map((y, i) => ({ day: i + 1, low: Math.min(y, 50), high: Math.max(y - 50, 0) }));
const edge = { type: 'quantitative', domain: [0.5, 20.5] };
const band = { type: 'quantitative', domain: [0, 50] };

mount(Elicit({
  width: 400, height: 90,
  margins: { top: 6, right: 12, bottom: 28, left: 12 },
  schema: { a: edge, b: edge, day: edge, low: band, high: band },
  data: [...days, { a: 0.5, b: 5.5 }],                     // the window starts on days 1–5
  context: (d) => d.day != null,                            //! the horizon is context
  constraints: [                                            //! edges land between days
    snap({ step: 1, origin: 0.5, field: 'a' }), snap({ step: 1, origin: 0.5, field: 'b' }),
  ],
  axes: { x: { title: 'day', ticks: 20 }, y: false },
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.6, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'day' }, y: { field: 'low' } } }),
    areaY({ fill: '#4c78a8', fillOpacity: 0.3, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'day' }, y: { field: 'high' } } }),
    rect({
      fill: '#f58518', fillOpacity: 0.2, stroke: '#f58518', strokeWidth: 2,
      channels: { x1: { field: 'a' }, x2: { field: 'b' }, y1: { value: 0 }, y2: { value: 56 } },
      edits: [ moveSpan({ channels: ['x1', 'x2'] }) ],     //! the window keeps its width
    }),
  ],
}));`,
    },
    {
      title: 'Band the next ten days',
      question: 'For each of the next ten days, what range are you 80% sure the value will fall in?',
      try: 'Drag along the band\'s top edge to paint the highs, along its bottom edge to paint the lows.',
      why: 'A fold maps two values to one height, so a pointer on a folded band cannot say which it means; the band you answer on is drawn unfolded, on the full 0–100 scale, beside the twenty folded days. `edit.line.sweep()` on `y1` and `y2` paints the edge nearest the pointer at dragstart, and `ordering()` keeps each low below its high. A rule at 50 marks where the horizon folds, and `context` marks the twenty folded days.',
      uses: ['edit.line.sweep()', 'ordering()', 'guides.rule()', 'context'],
      code: `const values = [28, 55, 43, 91, 81, 53, 19, 87, 52, 48, 24, 49, 87, 66, 17, 27, 68, 16, 49, 15];
const days = values.map((y, i) => ({ day: i + 1, low: Math.min(y, 50), high: Math.max(y - 50, 0) }));
const day = { type: 'quantitative', domain: [1, 30] };
const v = { type: 'quantitative', domain: [0, 100] };

mount(Elicit({
  width: 440, height: 150,
  margins: { top: 6, right: 12, bottom: 30, left: 46 },
  schema: { day, lo: v, hi: v, low: v, high: v },
  data: [...days, ...d3.range(21, 31).map((day) => ({ day, lo: 30, hi: 70 }))],
  context: (d) => d.low != null,
  constraints: [ ordering({ field: ['lo', 'hi'] }) ],      //! each low stays below its high
  axes: { x: { title: 'day', ticks: 15 }, y: { title: 'value', ticks: 2 } },
  guides: [ guides.rule({ y: 50, stroke: '#94a3b8', strokeDash: [3, 3], label: 'fold' }) ],
  marks: [
    areaY({ fill: '#4c78a8', fillOpacity: 0.6, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'day' }, y: { field: 'low' } } }),
    areaY({ fill: '#4c78a8', fillOpacity: 0.3, stroke: 'none', curve: 'monotoneX',
            channels: { x: { field: 'day' }, y: { field: 'high' } } }),
    areaY({
      fill: '#f58518', fillOpacity: 0.3, stroke: '#f58518', curve: 'monotoneX', handles: 'hit',
      channels: {
        x:  { field: 'day' },
        y1: { field: 'lo', edit: edit.line.sweep() },       //! paint the lows
        y2: { field: 'hi', edit: edit.line.sweep() },       //! paint the highs
      },
    }),
  ],
}));`,
    },
  ],
});

// ============================================================ Table-based Plots

GALLERY.add({
  id: 'vl-rect_heatmap',
  status: 'full',
  verdict: 'A `rect` with a category on both axes and a quantitative `fill` draws the heatmap of mean horsepower.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['Gridlines between the bands (`tickBand: "extent"`) are not drawn.'],
  recreation: {
    code: `const cars = (await vegaData('cars.json')).filter((d) => d.Horsepower != null);
const cells = d3.rollups(cars, (v) => d3.mean(v, (d) => d.Horsepower),
                         (d) => d.Origin, (d) => d.Cylinders)
  .flatMap(([origin, byCyl]) => byCyl.map(([cyl, hp]) => ({ origin, cyl, hp })));

mount(Elicit({
  width: 300, height: 160,
  margins: { top: 8, right: 8, bottom: 30, left: 72 },
  data: cells,
  schema: {
    origin: { type: 'categorical', domain: ['USA', 'Japan', 'Europe'] },  // listed bottom-up
    cyl:    { type: 'ordinal', domain: [3, 4, 5, 6, 8] },
    hp:     { type: 'quantitative', domain: [60, 160] },
  },
  axes: { x: { title: 'Cylinders' }, y: { title: 'Origin' } },
  marks: [
    rect({
      channels: {
        x: { field: 'cyl', scale: { padding: 0 } },
        y: { field: 'origin', scale: { padding: 0 } },
        fill: { field: 'hp', scale: d3.scaleSequential([60, 160], d3.interpolateYlGnBu),
                legend: { title: 'hp', ticks: 3 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set each cell',
      question: 'For a car sold today, what is the average horsepower for each origin and cylinder count?',
      try: 'Click a cell to select it, then drag the handle on the colour ramp.',
      why: '`edit.select()` makes the cell you click the selected row, and `edit.legend.value()` adds a handle to the ramp that writes that row\'s `hp`. Colour is not invertible from a pointer, so the ramp is the instrument.',
      uses: ['edit.select()', 'edit.legend.value()'],
      code: `const origins = ['USA', 'Japan', 'Europe'];
mount(Elicit({
  width: 320, height: 170,
  margins: { top: 8, right: 8, bottom: 30, left: 72 },
  data: origins.flatMap((origin) => [4, 6, 8].map((cyl) => ({ origin, cyl, hp: 150 }))),
  schema: {
    origin: { type: 'categorical', domain: origins },
    cyl:    { type: 'ordinal', domain: [4, 6, 8] },
    hp:     { type: 'quantitative', domain: [50, 450] },
  },
  axes: { x: { title: 'Cylinders' }, y: { title: 'Origin' } },
  marks: [
    rect({
      stroke: '#fff', strokeWidth: 1,
      channels: {
        x: { field: 'cyl', scale: { padding: 0 } },
        y: { field: 'origin', scale: { padding: 0 } },
        fill: { field: 'hp', scale: d3.scaleSequential([50, 450], d3.interpolateYlGnBu) },
      },
      edits: [ edit.select() ],                             //! click picks the cell to edit
    }),
    text({
      fontSize: 11, format: 'd', fill: '#111',
      channels: { x: { field: 'cyl' }, y: { field: 'origin' }, text: { field: 'hp' } },
    }),
    legendColor({ anchor: 'right', title: 'hp', edit: edit.legend.value() }), //! drag the ramp handle to set it
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-rect_heatmap_weather',
  status: 'full',
  verdict: 'Day of month by month, coloured by the maximum temperature, is a `rect` over two categorical axes after aggregating.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: [],
  recreation: {
    code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = await vegaData('seattle-weather.csv');
const cells = d3.rollups(days, (v) => d3.max(v, (d) => d.temp_max),
                         (d) => d.date.getUTCMonth(), (d) => d.date.getUTCDate())
  .flatMap(([m, byDay]) => byDay.map(([day, temp]) => ({ month: months[m], day, temp })));

mount(Elicit({
  width: 480, height: 230,
  margins: { top: 8, right: 8, bottom: 34, left: 54 },
  title: 'Daily Max Temperatures (C) in Seattle, WA',
  data: cells,
  schema: {
    month: { type: 'ordinal', domain: [...months].reverse() },   // Jan on top
    day:   { type: 'ordinal', domain: d3.range(1, 32) },
    temp:  { type: 'quantitative', domain: [0, 36] },
  },
  axes: { x: { title: 'Day' }, y: { title: 'Month' } },
  marks: [
    rect({
      channels: {
        x: { field: 'day', scale: { padding: 0 } },
        y: { field: 'month', scale: { padding: 0 } },
        fill: { field: 'temp', scale: d3.scaleSequential([0, 36], d3.interpolateYlGnBu),
                legend: { title: '', ticks: 4 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Colour the year',
      question: 'How warm is a typical Seattle afternoon in each month?',
      try: 'Click a month\'s cell to step it through cold, cool, mild, warm and hot.',
      why: '`cycle()` on `fill` advances the row\'s `feel` to the next value of its ordinal domain on each click. Because `feel` is declared `ordinal`, the colour scale is an ordered ramp rather than unrelated hues.',
      uses: ['cycle()'],
      code: `const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
mount(Elicit({
  width: 460, height: 110,
  margins: { top: 8, right: 8, bottom: 26, left: 60 },
  data: months.map((month) => ({ month, city: 'Seattle', feel: 'mild' })),
  schema: {
    month: { type: 'ordinal', domain: months },
    city:  { type: 'categorical', domain: ['Seattle'] },
    feel:  { type: 'ordinal', domain: ['cold', 'cool', 'mild', 'warm', 'hot'] }, //! an ordered answer set
  },
  axes: { x: { title: '' }, y: { title: '' } },
  marks: [
    rect({
      stroke: '#fff', strokeWidth: 2,
      channels: {
        x: { field: 'month', scale: { padding: 0 } },
        y: { field: 'city', scale: { padding: 0 } },
        fill: { field: 'feel', scale: { scheme: 'RdYlBu', reverse: true },
                edit: cycle() },                            //! click steps to the next band
      },
    }),
    text({
      fontSize: 10, fill: '#111',
      channels: { x: { field: 'month' }, y: { field: 'city' }, text: { field: 'feel' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-circle_github_punchcard',
  status: 'full',
  verdict: 'A `point` per weekday and hour, sized by the summed commit count, is the punchcard.',
  needs: [],
  prep: ['prep-aggregate', 'prep-calculate'],
  gaps: ['Hours are labelled 0–23 rather than with a time format.'],
  recreation: {
    code: `const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const rows = await vegaData('github.csv');
const cells = d3.rollups(rows, (v) => d3.sum(v, (d) => d.count),
                         (d) => days[(new Date(d.time).getDay() + 6) % 7],
                         (d) => new Date(d.time).getHours())
  .flatMap(([day, byHour]) => byHour.map(([hour, count]) => ({ day, hour, count })));

mount(Elicit({
  width: 480, height: 200,
  margins: { top: 8, right: 8, bottom: 32, left: 56 },
  data: cells,
  schema: {
    day:   { type: 'ordinal', domain: [...days].reverse() },   // Mon on top
    hour:  { type: 'ordinal', domain: d3.range(24) },
    count: { type: 'quantitative', domain: [0, 160] },
  },
  axes: { x: { title: 'time (hours)' }, y: { title: 'time (day)' } },
  marks: [
    point({
      fill: '#4c78a8',
      channels: {
        x: { field: 'hour' }, y: { field: 'day' },
        size: { field: 'count', scale: { type: 'sqrt', range: [0, 9] },
                legend: { title: 'count', ticks: 3 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Punch the busy hours',
      question: 'When does a typical open-source project get the most commits? Punch the six busiest hours of the week.',
      try: 'Click an empty slot to punch it; click a punched slot to take it back.',
      why: '`toggle()` on `x` and `y` names a slot from the pointer: an empty slot mints a row there, a full one is removed. The grey grid of slots is `context` rows with columns of their own, drawn by a second `point`, so it never enters the answer. `count()` counts those rows too, so its `max` is the 168 slots plus six, and `strategy: "reject"` turns away a seventh punch.',
      uses: ['toggle()', 'count()', 'context'],
      code: `const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const day = { type: 'ordinal', domain: [...days].reverse() };
const hour = { type: 'ordinal', domain: d3.range(24) };
const slots = days.flatMap((slotDay) => d3.range(24).map((slotHour) => ({ slotDay, slotHour })));

mount(Elicit({
  width: 480, height: 200,
  margins: { top: 8, right: 8, bottom: 32, left: 56 },
  schema: { day, hour, slotDay: day, slotHour: hour },
  data: slots,
  context: true,                                             //! every slot, drawn faintly
  // count() counts the context rows too: every slot plus six punches.
  constraints: [ count({ max: slots.length + 6, strategy: 'reject' }) ], //! six punches
  axes: { x: { title: 'time (hours)' }, y: { title: 'time (day)' } },
  marks: [
    point({ fill: '#cbd5e1', size: 2,
            channels: { x: { field: 'slotHour' }, y: { field: 'slotDay' } } }),
    point({
      fill: '#4c78a8', size: 7,
      channels: { x: { field: 'hour' }, y: { field: 'day' } },
      edits: [ toggle({ channels: ['x', 'y'] }) ],         //! click a slot to punch or clear it
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-layer_text_heatmap',
  status: 'full',
  verdict: 'A `rect` heatmap of counts with a `text` layer over the same rows, whose `fill` switches from black to white past 40, reproduces the labelled heatmap.',
  needs: [],
  prep: ['prep-aggregate'],
  gaps: ['Gridlines between the bands are not drawn.'],
  recreation: {
    code: `const cars = await vegaData('cars.json');
const cells = d3.rollups(cars, (v) => v.length, (d) => d.Origin, (d) => d.Cylinders)
  .flatMap(([origin, byCyl]) => byCyl.map(([cyl, n]) => ({ origin, cyl, n })));

mount(Elicit({
  width: 360, height: 170,
  margins: { top: 8, right: 8, bottom: 30, left: 72 },
  data: cells,
  schema: {
    origin: { type: 'categorical', domain: ['USA', 'Japan', 'Europe'] },
    cyl:    { type: 'ordinal', domain: [3, 4, 5, 6, 8] },
    n:      { type: 'quantitative', domain: [0, 110] },
  },
  axes: { x: { title: 'Cylinders' }, y: { title: 'Origin' } },
  marks: [
    rect({
      channels: {
        x: { field: 'cyl', scale: { padding: 0 } },
        y: { field: 'origin', scale: { padding: 0 } },
        fill: { field: 'n', scale: d3.scaleSequential([0, 110], d3.interpolateYlGnBu),
                legend: { title: 'Count of Records', anchor: 'top', ticks: 3 } },
      },
    }),
    text({
      fontSize: 11,
      channels: {
        x: { field: 'cyl' }, y: { field: 'origin' }, text: { field: 'n' },
        fill: { fn: (d) => (d.n < 40 ? 'black' : 'white') },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Allocate 100 cars',
      question: 'Of the next 100 cars sold, how many come from each origin and cylinder count?',
      try: 'Drag a cell\'s square up to add cars, down to take them away. The counter shows how many are left.',
      why: 'Each cell holds a square grip whose `size` encodes the count. `slide({ axis: "y" })` on that `size` turns vertical drag distance into cars, and the cell\'s colour re-derives from the same field. `maintainSum({ strategy: "cap" })` stops the grid at 100 cars and `guides.remaining()` reads that budget back.',
      uses: ['slide()', 'maintainSum()', 'snap()', 'guides.remaining()'],
      code: `const origins = ['USA', 'Japan', 'Europe'];
mount(Elicit({
  width: 360, height: 200,
  margins: { top: 26, right: 8, bottom: 30, left: 72 },
  data: origins.flatMap((origin) => [4, 6, 8].map((cyl) => ({ origin, cyl, n: 0 }))),
  schema: {
    origin: { type: 'categorical', domain: origins },
    cyl:    { type: 'ordinal', domain: [4, 6, 8] },
    n:      { type: 'quantitative', domain: [0, 100] },
  },
  constraints: [
    snap({ step: 1, field: 'n' }),
    clamp({ min: 0, field: 'n' }),
    maintainSum({ total: 100, field: 'n', strategy: 'cap' }), //! never more than 100 cars
  ],
  guides: [ guides.remaining({ field: 'n', unit: 'car' }) ], //! what is left to place
  axes: { x: { title: 'Cylinders' }, y: { title: 'Origin' } },
  marks: [
    rect({
      stroke: '#fff', strokeWidth: 1,
      channels: {
        x: { field: 'cyl', scale: { padding: 0 } },
        y: { field: 'origin', scale: { padding: 0 } },
        fill: { field: 'n', scale: d3.scaleSequential([0, 100], d3.interpolateYlGnBu) },
      },
    }),
    point({                                                 // a grip that grows with the count
      shape: 'square', fill: '#fff', fillOpacity: 0.3, stroke: '#1f2733', strokeWidth: 1.2,
      channels: {
        x: { field: 'cyl' }, y: { field: 'origin' },
        size: { field: 'n', scale: { range: [9, 22] },
                edit: slide({ axis: 'y', extent: 200 }) },  //! drag up for more cars
      },
    }),
    text({
      fontSize: 12,
      channels: {
        x: { field: 'cyl' }, y: { field: 'origin' }, text: { field: 'n' },
        fill: { fn: (d) => (d.n < 40 ? 'black' : 'white') },
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-rect_lasagna',
  status: 'full',
  verdict: 'One `rect` per stock and month on two categorical axes, coloured by price, is the lasagna plot; `tickValues` keep only the January labels.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Months are categorical `YYYY-MM` keys; `tickValues` lists the Januaries and `tickFormat` prints the year, where Vega-Lite uses conditional label and tick colours.',
  ],
  recreation: {
    code: `const stocks = (await vegaData('stocks.csv'))
  .filter((d) => d.symbol !== 'GOOG')
  .map((d) => ({ symbol: d.symbol, month: d3.utcFormat('%Y-%m')(new Date(d.date + ' UTC')), price: d.price }));
const months = [...new Set(stocks.map((d) => d.month))].sort();

mount(Elicit({
  width: 400, height: 150,
  margins: { top: 6, right: 8, bottom: 34, left: 44 },
  data: stocks,
  schema: {
    symbol: { type: 'categorical', domain: ['MSFT', 'IBM', 'AMZN', 'AAPL'] },   // AAPL on top
    month:  { type: 'ordinal', domain: months },
    price:  { type: 'quantitative', domain: [0, 230] },
  },
  axes: {
    x: { title: 'Time', tickValues: months.filter((m) => m.endsWith('-01')),
         tickFormat: (m) => m.slice(0, 4) },
    y: { title: '' },
  },
  marks: [
    rect({
      channels: {
        x: { field: 'month', scale: { padding: 0 } },
        y: { field: 'symbol', scale: { padding: 0 } },
        fill: { field: 'price', scale: d3.scaleSequential([0, 230], d3.interpolateYlGnBu),
                legend: { title: 'Price', ticks: 3 } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Bracket, then reveal',
      question: 'Between 2000 and 2010, when was each of these stocks at its most expensive?',
      try: 'Drag each bar\'s ends to bracket the stretch, then press Reveal to see the prices behind it.',
      why: '`brushSpan()` edits one `x1`/`x2` pair per stock. It carries `stage: 0`, so pressing Reveal calls `nextStage()`, which retires the gesture and lets the `guides.custom` lasagna (which draws only at `stage >= 1`) show the answer.',
      uses: ['brushSpan()', 'stage', 'nextStage()', 'guides.custom()'],
      code: `const symbols = ['MSFT', 'IBM', 'AMZN', 'AAPL'];
const prices = (await vegaData('stocks.csv'))
  .filter((d) => symbols.includes(d.symbol))
  .map((d) => { const t = new Date(d.date + ' UTC');
    return { symbol: d.symbol, t: t.getUTCFullYear() + t.getUTCMonth() / 12, price: d.price }; });
const colour = d3.scaleSequential([0, 230], d3.interpolateYlGnBu);

const chart = Elicit({
  width: 420, height: 170,
  margins: { top: 6, right: 8, bottom: 30, left: 44 },
  data: symbols.map((symbol) => ({ symbol, from: 2004, to: 2006 })),
  schema: {
    symbol: { type: 'categorical', domain: symbols },
    from:   { type: 'quantitative', domain: [2000, 2010.25] },
    to:     { type: 'quantitative', domain: [2000, 2010.25] },
  },
  axes: { x: { title: '', tickFormat: 'd' }, y: { title: '' } },
  guides: [
    guides.custom(({ scales, stage }) => stage < 1 ? [] : prices.map((d) => ({  //! the answer, after Reveal
      type: 'rect', background: true, fill: colour(d.price),
      x: scales.x.encode(d.t), width: scales.x.encode(d.t + 1 / 12) - scales.x.encode(d.t),
      y: scales.y.encode(d.symbol) - 14, height: 28,
    }))),
  ],
  marks: [
    barX({
      fill: '#e45756', fillOpacity: 0.25, stroke: '#e45756', strokeWidth: 2,
      channels: { y: { field: 'symbol' }, x1: { field: 'from' }, x2: { field: 'to' } },
      edits: [ brushSpan({ edgeInset: 8, stage: 0 }) ], //! live until you reveal
    }),
  ],
});
mount(chart);
const reveal = document.createElement('button');
reveal.textContent = 'Reveal';
reveal.onclick = () => { chart.nextStage(); reveal.disabled = true; };
mount(reveal);`,
    },
  ],
});

GALLERY.add({
  id: 'vl-rect_mosaic_labelled_with_offset',
  status: 'full',
  verdict: 'The mosaic is a `rect` per origin and cylinder count with all four extents computed, plus a `text` layer; the offsets between tiles are the same arithmetic as the original\'s transforms.',
  needs: [],
  prep: ['prep-aggregate', 'prep-stack', 'prep-window'],
  gaps: [
    'Vega-Lite\'s separate header view (the origin names in a `vconcat` row) is drawn as text in the top margin by a `guides.custom` layer.',
    'The axis titles ("Origin", "Cylinders") are omitted.',
  ],
  recreation: {
    code: `const cars = await vegaData('cars.json');
const origins = ['Europe', 'Japan', 'USA'];
const counts = d3.rollup(cars, (v) => v.length, (d) => d.Origin, (d) => d.Cylinders);
const total = cars.length;
const tiles = [];
let x = 0;
origins.forEach((origin, oi) => {
  const byCyl = [...counts.get(origin)].sort((a, b) => a[0] - b[0]);
  const n = d3.sum(byCyl, (d) => d[1]);
  const x1 = x + oi * 0.01, x2 = x + n / total + oi * 0.01;       // column width = share of all cars
  let y = 0;
  byCyl.forEach(([cyl, c], ci) => {
    const gap = (ci * byCyl.length * 0.01) / 3;                   // the original's offset
    const y1 = y + gap, y2 = y + c / n + gap;
    tiles.push({ origin, cyl, x1, x2, y1, y2, xc: (x1 + x2) / 2, yc: (y1 + y2) / 2 });
    y += c / n;
  });
  x += n / total;
});

mount(Elicit({
  width: 400, height: 340,
  margins: { top: 24, right: 8, bottom: 8, left: 8 },
  data: tiles,
  schema: {
    origin: { type: 'categorical', domain: origins },
    cyl:    { type: 'quantitative', domain: [3, 8] },
    x1: { type: 'quantitative', domain: [0, 1.02] }, x2: { type: 'quantitative', domain: [0, 1.02] },
    y1: { type: 'quantitative', domain: [0, 1.05] }, y2: { type: 'quantitative', domain: [0, 1.05] },
    xc: { type: 'quantitative', domain: [0, 1.02] }, yc: { type: 'quantitative', domain: [0, 1.05] },
  },
  axes: false,
  guides: [
    guides.custom(({ scales }) => origins.map((origin, i) => {
      const t = tiles.find((d) => d.origin === origin);
      return { type: 'text', text: origin, textAnchor: 'middle', fontSize: 11,
               fill: d3.schemeTableau10[i], x: scales.x.encode(t.xc), y: -8 };
    })),
  ],
  marks: [
    rect({
      tip: ['origin', 'cyl'],                               // the original's tooltip
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'origin' },
        opacity: { field: 'cyl', scale: { range: [0.3, 0.8] } },
      },
    }),
    text({
      fontSize: 11,
      channels: {
        x: { field: 'xc' }, y: { field: 'yc' },
        text: { field: 'cyl' },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Split each origin',
      question: 'Of 100 new cars from each origin, how many have four, six and eight cylinders?',
      try: 'Drag the boundary between two segments of a column.',
      why: '`barY` with a `stack` channel stacks each origin\'s rows on one band, and `edit.stack.edge()` drags the boundary between two neighbours: one gains what the other loses, so every column keeps its total of 100.',
      uses: ['barY stack channel', 'edit.stack.edge()'],
      code: `const origins = ['Europe', 'Japan', 'USA'];
mount(Elicit({
  width: 360, height: 280,
  margins: { top: 10, right: 8, bottom: 30, left: 40 },
  data: origins.flatMap((origin) => [
    { origin, cyl: '4', share: 34 }, { origin, cyl: '6', share: 33 }, { origin, cyl: '8', share: 33 },
  ]),
  schema: {
    origin: { type: 'categorical', domain: origins },
    cyl:    { type: 'ordinal', domain: ['4', '6', '8'] },
    share:  { type: 'quantitative', domain: [0, 100] },
  },
  legends: true,
  axes: { x: { title: '' }, y: { title: 'cars', ticks: 5 } },
  marks: [
    barY({
      channels: {
        stack: { field: 'cyl' },  //! one column per origin
        x: { field: 'origin' },
        y: { field: 'share' },
        fill: { field: 'cyl', scale: { range: ['#c6dbef', '#6baed6', '#08519c'] } },
      },
      edits: [ edit.stack.edge() ],                         //! drag a boundary: neighbours trade cars
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'vl-point_angle_windvector',
  status: 'full',
  verdict: 'A `shape` mark drawing a wedge path per grid cell, turned by the `angle` channel, coloured by direction and sized by speed, is the vector map.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The Equal Earth projection is computed in JavaScript (`d3.geoEqualEarth().fitSize`), and the wedges are placed at the projected pixels; `shape` has no `lon`/`lat` channels.',
    'There is no speed legend: a size legend draws nested circles, not wedges.',
  ],
  recreation: {
    code: `const W = 440, H = 400;   // the projection is fitted to this box
const raw = await vegaData('windvectors.csv');
const project = d3.geoEqualEarth().fitSize([W, H],
  { type: 'MultiPoint', coordinates: raw.map((d) => [d.longitude, d.latitude]) });
const wind = raw.map((d) => {
  const [x, y] = project([d.longitude, d.latitude]);
  return { x, y, dir: d.dir, speed: d.speed };
});

mount(Elicit({
  width: W, height: H,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  data: wind,
  schema: {
    x:     { type: 'quantitative', domain: [0, W] },
    y:     { type: 'quantitative', domain: [H, 0] },        // pixels grow downward
    dir:   { type: 'quantitative', domain: [0, 360] },
    speed: { type: 'quantitative', domain: [0, 12.2] },
  },
  axes: false,
  marks: [
    shape({
      path: 'M0,-1 L0.3,1 L-0.3,1 Z',                        // Vega's wedge: a long thin triangle
      opacity: 0.7, stroke: 'none',
      channels: {
        x: { field: 'x' }, y: { field: 'y' },
        angle: { field: 'dir', scale: { range: [180, 540] } },  // point where the wind goes
        fill: { field: 'dir', scale: d3.scaleSequential([0, 360], d3.interpolateRainbow) },
        size: { field: 'speed', scale: { type: 'sqrt', range: [0, 8] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Point the wind',
      question: 'On a typical day, which way does the wind blow at each of these nine places over the North Atlantic and western Europe?',
      try: 'Drag a needle round its hub to point where the wind is going.',
      why: '`rotate({ pivot: "mark" })` on `theta` reads the pointer\'s angle about each needle\'s own hub and inverts it through the scale. The range `[90, -270]` maps a compass bearing (0° = north, clockwise) onto screen angles. A `needle` stands in for the map\'s wedge `shape` because `rotate()` on a shape\'s `angle` turns it the opposite way to the pointer.',
      uses: ['needle()', 'rotate()'],
      code: `const sites = [];
for (const lat of [47.5, 52.5, 57.5]) for (const lon of [-7, 0, 7]) sites.push({ lon, lat, toward: 0 });

mount(Elicit({
  width: 380, height: 300,
  margins: { top: 10, right: 12, bottom: 34, left: 48 },
  data: sites,
  schema: {
    lon:    { type: 'quantitative', domain: [-10, 10] },
    lat:    { type: 'quantitative', domain: [45, 60] },
    toward: { type: 'quantitative', domain: [0, 360] },
  },
  axes: { x: { title: 'longitude', ticks: 5 }, y: { title: 'latitude', ticks: 4 } },
  marks: [
    needle({
      length: 30, baseWidth: 8, handleSize: 4,
      channels: {
        x: { field: 'lon' }, y: { field: 'lat' },
        theta: {
          field: 'toward', scale: { range: [90, -270] },     //! a compass bearing, north up, clockwise
          edit: rotate({ pivot: 'mark', fold: false, pick: 'direct' }), //! turn about the needle's hub
        },
        fill: { field: 'toward', scale: d3.scaleSequential([0, 360], d3.interpolateRainbow) },
      },
    }),
  ],
}));`,
    },
  ],
});
