// Observable Plot gallery — "Contour, Raster, Density", "Axes", "Delaunay, Voronoi"
// and "Tips and interactions". See AUTHORING.md.

GALLERY.defineFeatures({
  'crosshair': { label: 'Pointer readouts', description: 'Annotation that follows the pointer: crosshair rules with axis readouts, a `pointer`-filtered mark (Plot `crosshair`, `pointerX`). Now covered by `guides.crosshair()` and `guides.custom(build, { tracksPointer: true })`.' },
  'layer-data': { label: 'Layers over other data', description: 'A mark that draws rows of a second, read-only dataset beside the elicited one (a reference series, tick labels, a basemap of points). Now covered by context rows: the reference rows sit in the elicited table, each filling its own columns, and `context` keeps them out of the answer.' },
});
GALLERY.defineFeatures({
  'prep-delaunay': { label: 'Delaunay / Voronoi', description: 'Triangulation, hull or Voronoi edges computed with `d3.Delaunay` and drawn as ordinary marks.' },
  'prep-contour': { label: 'Contours', description: 'Isolines traced with `d3.contours` and drawn as ordinary marks.' },
});

// ════════════════════════════════════════════════════════════════════════════
// Contour, Raster, Density
// ════════════════════════════════════════════════════════════════════════════

GALLERY.add({
  id: 'plot-function-contour',
  status: 'none',
  verdict: 'Filled isobands of a function of x and y: contours are out of scope for an elicitation library, which has no contour generator and no filled polygon mark on planar axes.',
  needs: ['density-2d'],
  prep: [],
  gaps: [
    '`d3.contours` could trace the bands, but nested bands with holes need a filled polygon mark on x/y scales; `line` and `path` always draw unfilled.',
  ],
  alternative: 'Sample the function on a coarse grid of `rect` cells and ask for the value of a hidden cell with `edit.legend.value()`.',
});

GALLERY.add({
  id: 'plot-faceted-function-contour',
  status: 'none',
  verdict: 'Four contour panels of products of functions: contours are out of scope for an elicitation library, and faceting is not covered by this study.',
  needs: ['density-2d', 'facet'],
  prep: [],
  gaps: ['Filled isobands (see Function contour) in a 2×2 facet grid sharing one diverging scale.'],
  alternative: 'One coarse `rect` heatmap per function, each a separate chart.',
});

GALLERY.add({
  id: 'plot-mandelbrot-set',
  status: 'partial',
  verdict: 'The raster becomes a 100×78 grid of `rect` cells coloured by escape count: the same picture at a coarser resolution. Per-pixel rasters are out of scope for an elicitation library.',
  needs: ['raster'],
  prep: ['prep-calculate'],
  gaps: [
    'Plot evaluates the function once per pixel; the recreation evaluates it once per cell, so edges are blocky.',
  ],
  recreation: {
    code: `function mandelbrot(x, y) {
  for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {
    [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];
    if (zr * zr + zi * zi > 4) return n;
  }
}
// One cell per (re, im) step; points that never escape are left unpainted.
const nx = 100, ny = 78, x1 = -2, x2 = 1, y1 = -1.164, y2 = 1.164;
const dx = (x2 - x1) / nx, dy = (y2 - y1) / ny;
const cells = [];
for (let j = 0; j < ny; ++j) for (let i = 0; i < nx; ++i) {
  const re = x1 + i * dx, im = y1 + j * dy;
  const n = mandelbrot(re + dx / 2, im + dy / 2);
  if (n !== undefined) cells.push({ re, re2: re + dx, im, im2: im + dy, n });
}
mount(Elicit({
  width: 440, height: 360,
  margins: { top: 10, right: 10, bottom: 26, left: 40 },
  schema: {
    re: { type: 'quantitative', domain: [x1, x2] }, re2: { type: 'quantitative' },
    im: { type: 'quantitative', domain: [y1, y2] }, im2: { type: 'quantitative' },
    n:  { type: 'quantitative', domain: [0, 80] },
  },
  data: cells,
  marks: [
    rect({
      channels: {
        x1: { field: 're' }, x2: { field: 're2' },
        y1: { field: 'im' }, y2: { field: 'im2' },
        fill: { field: 'n', scale: { scheme: 'turbo' } },
        // A hairline of the same colour closes the anti-aliasing seams between cells.
        stroke: { field: 'n', scale: { scheme: 'turbo' } }, strokeWidth: { value: 0.5 },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Paint it from memory',
      question: 'Without looking, which parts of the complex plane do you think belong to the Mandelbrot set?',
      try: 'Click cells to paint them; click a painted cell to clear it. You have 60 cells.',
      why: '`toggle()` mints a row for the cell under the pointer, or drops the row already there, so the answer is the set of painted cells. `count({ max: 60 })` caps the budget, which forces you to spend cells where you are surest.',
      uses: ['toggle()', 'count()'],
      code: `// Real part across, imaginary part up, 0.2 apart.
const re = d3.range(15).map((i) => +(-1.9 + 0.2 * i).toFixed(1));
const im = d3.range(12).map((j) => +(-1.1 + 0.2 * j).toFixed(1));
mount(Elicit({
  width: 440, height: 360,
  margins: { top: 26, right: 10, bottom: 10, left: 40 },
  schema: {
    re: { type: 'ordinal', domain: re },
    im: { type: 'ordinal', domain: im },
  },
  data: [],
  constraints: [count({ max: 60 })],                     //! a budget of 60 cells
  axes: false,
  guides: [guides.cellGrid({ pad: 1 })],
  marks: [
    rect({
      fill: '#4f46e5', stroke: '#fff', strokeWidth: 2,
      channels: {
        x: { field: 're', scale: { padding: 0 } },
        y: { field: 'im', scale: { padding: 0 } },
      },
      edits: [toggle({ channels: ['x', 'y'] })],          //! a click adds or clears the cell
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-log-heatmap',
  status: 'partial',
  verdict: 'The Goldstein–Price function sampled on an 80×80 grid of `rect` cells, coloured through a log-scaled magma ramp, with zero rules as guides. Per-pixel rasters are out of scope for an elicitation library.',
  needs: ['raster'],
  prep: ['prep-calculate'],
  gaps: [
    'Plot rasterizes at 4 px per sample; the recreation draws 6,400 cells, so it is coarser.',
    'The log magma ramp is a d3 `scaleSequentialLog` adopted on `fill`: `scale: { type: \'log\', scheme: \'magma\' }` spreads the scheme’s stops evenly in data units rather than log units, so the ramp comes out wrong.',
    'Signed tick labels (`+f`) are approximated with a `tickFormat` function.',
  ],
  recreation: {
    code: `const gp = (x, y) =>
  (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
  (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));
const n = 80, dx = 4 / n, dy = 4 / n;
const cells = [];
for (let j = 0; j < n; ++j) for (let i = 0; i < n; ++i) {
  const x = -2 + i * dx, y = -2.5 + j * dy;
  cells.push({ x, x2: x + dx, y, y2: y + dy, v: gp(x + dx / 2, y + dy / 2) });
}
const signed = (d) => (d > 0 ? '+' : '') + d;
const magma = d3.scaleSequentialLog(d3.interpolateMagma).domain(d3.extent(cells, (d) => d.v));
mount(Elicit({
  width: 440, height: 440,
  margins: { top: 10, right: 10, bottom: 26, left: 34 },
  schema: {
    x: { type: 'quantitative', domain: [-2, 2] }, x2: { type: 'quantitative' },
    y: { type: 'quantitative', domain: [-2.5, 1.5] }, y2: { type: 'quantitative' },
    v: { type: 'quantitative' },
  },
  data: cells,
  axes: { x: { ticks: 10, tickFormat: signed }, y: { ticks: 10, tickFormat: signed } },
  guides: [
    guides.rule({ x: 0, stroke: '#fff', strokeDash: 'none', opacity: 0.25 }),
    guides.rule({ y: 0, stroke: '#fff', strokeDash: 'none', opacity: 0.25 }),
  ],
  marks: [
    rect({
      channels: {
        x1: { field: 'x' }, x2: { field: 'x2' }, y1: { field: 'y' }, y2: { field: 'y2' },
        fill: { field: 'v', scale: magma },
        stroke: { field: 'v', scale: magma }, strokeWidth: { value: 0.5 },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fill the hidden patch',
      question: 'Part of the map is hidden. How large do you think the function is in each hidden cell?',
      try: 'Click a grey cell to select it, then drag the handle on the colour ramp to set its value.',
      why: '`edit.select()` makes a cell the target row, and `edit.legend.value()` on the ramp writes the value you point at into it. The field is `log₁₀ f`, so the ramp is the original’s log colour scale. `lock` keeps every visible cell fixed.',
      uses: ['edit.select()', 'edit.legend.value()', 'lock'],
      code: `const gp = (x, y) =>
  (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
  (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));
// A 10 × 10 grid; a patch around the minimum starts hidden.
const xs = d3.range(10).map((i) => +(-2 + 0.4 * (i + 0.5)).toFixed(1));
const ys = d3.range(10).map((j) => +(-2.5 + 0.4 * (j + 0.5)).toFixed(1));
const hidden = (d) => Math.abs(d.x) < 0.7 && Math.abs(d.y + 1.1) < 0.7;
// The answer is on the log scale the original colours by: lv = log₁₀ f.
const cells = xs.flatMap((x) => ys.map((y) => ({ x, y, lv: +Math.log10(gp(x, y)).toFixed(2), shown: true })));
cells.forEach((d) => { if (hidden(d)) { d.lv = null; d.shown = false; } });
mount(Elicit({
  width: 440, height: 360,
  margins: { top: 26, right: 80, bottom: 30, left: 40 },
  schema: {
    x: { type: 'ordinal', domain: xs },
    y: { type: 'ordinal', domain: ys },
    lv: { type: 'quantitative', domain: [0, 6] },
    shown: { type: 'categorical', domain: [true, false] },
  },
  data: cells,
  lock: (d) => d.shown,                                  //! visible cells are given
  theme: { marks: { rect: { fill: '#d4d4d8' } } },       // an unanswered cell is grey
  marks: [
    rect({
      stroke: '#fff',
      channels: {
        x: { field: 'x', scale: { padding: 0 } },
        y: { field: 'y', scale: { padding: 0 } },
        fill: { field: 'lv', scale: { range: ['#1e1b4b', '#fde68a'] } },
      },
      edits: [edit.select()],                            //! pick the cell to answer
    }),
    legendColor({ anchor: 'right', title: 'log₁₀ f', edit: edit.legend.value() }),  //! the ramp sets its value
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-volcano-raster',
  status: 'full',
  verdict: 'Maunga Whau’s 87×61 elevation grid drawn one `rect` per sample, coloured through turbo, with a colour legend. A per-pixel raster is out of scope for an elicitation library; a cell per sample draws the same picture.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'Each sample is a crisp cell; Plot’s raster image is smoothed by the browser when it is scaled up.',
  ],
  recreation: {
    code: `const volcano = await plotData('observablehq__plot-volcano-raster', 'volcano.json');
const { width: w, height: h, values } = volcano;
// One row per sample: column i, row j.
const cells = values.map((v, k) => ({ i: k % w, j: Math.floor(k / w), v }));
cells.forEach((d) => { d.i2 = d.i + 1; d.j2 = d.j + 1; });
mount(Elicit({
  width: 440, height: 360,
  margins: { top: 40, right: 10, bottom: 24, left: 30 },
  schema: {
    i: { type: 'quantitative', domain: [0, w] }, i2: { type: 'quantitative' },
    j: { type: 'quantitative', domain: [0, h] }, j2: { type: 'quantitative' },
    v: { type: 'quantitative', domain: d3.extent(values) },
  },
  data: cells,
  legends: { fill: { anchor: 'top', title: 'Elevation (m)' } },
  marks: [
    rect({
      channels: {
        x1: { field: 'i' }, x2: { field: 'i2' }, y1: { field: 'j' }, y2: { field: 'j2' },
        fill: { field: 'v', scale: { scheme: 'turbo' } },
        stroke: { field: 'v', scale: { scheme: 'turbo' } }, strokeWidth: { value: 0.5 },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Pick each band',
      question: 'The middle of the volcano is hidden. Which elevation band do you think each hidden cell falls in?',
      try: 'Click a grey cell to select it, then click a swatch in the legend. Shift-click to select several cells.',
      why: 'Bands are an `ordinal` field, so the legend is a key of swatches. `edit.legend.category()` turns each swatch into a picker that writes the selected cells, and `edit.select({ multi: true })` decides which cells those are. `lock` keeps the visible cells fixed.',
      uses: ['edit.legend.category()', 'edit.select()', 'lock'],
      code: `const volcano = await plotData('observablehq__plot-volcano-raster', 'volcano.json');
const { width: w, values } = volcano;
const bands = ['100–120 m', '120–140 m', '140–160 m', '160–180 m', '180+ m'];
const bandOf = (v) => bands[Math.min(4, Math.max(0, Math.floor((v - 100) / 20)))];
// 6 × 6 blocks of samples: 14 columns × 10 rows.
const cells = [];
for (let r = 0; r < 10; ++r) for (let c = 0; c < 14; ++c) {
  const block = d3.range(36).map((k) => values[(r * 6 + Math.floor(k / 6)) * w + c * 6 + (k % 6)]);
  const hidden = r >= 3 && r <= 6 && c >= 4 && c <= 9;
  cells.push({ col: c, row: r, band: hidden ? null : bandOf(d3.mean(block)), given: !hidden });
}
mount(Elicit({
  width: 440, height: 300,
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  schema: {
    col: { type: 'ordinal', domain: d3.range(14) },
    row: { type: 'ordinal', domain: d3.range(10) },
    band: { type: 'ordinal', domain: bands },
    given: { type: 'categorical', domain: [true, false] },
  },
  data: cells,
  lock: (d) => d.given,                                  //! visible cells are given
  axes: false,
  theme: { marks: { rect: { fill: '#d4d4d8' } } },       // an unanswered cell is grey
  marks: [
    rect({
      stroke: '#fff',
      channels: {
        x: { field: 'col', scale: { padding: 0 } },
        y: { field: 'row', scale: { padding: 0 } },
        fill: { field: 'band', scale: { scheme: 'turbo' } },
      },
      edits: [edit.select({ multi: true })],             //! choose the cells to answer
    }),
    legendColor({ anchor: 'right', title: 'Elevation', edit: edit.legend.category() }),  //! a swatch click writes the band
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-function-contour-2',
  status: 'none',
  verdict: 'Filled isobands of sin(x)·cos(y) with a diverging legend: contours are out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['A coarse `rect` heatmap of the same function would draw, but not the banded contours that are the point of the example.'],
  alternative: 'Ask for the sign of the function per cell: a grid of `rect` cells whose `fill` you `cycle()` between “+” and “−”.',
});

GALLERY.add({
  id: 'plot-contours-projection',
  status: 'none',
  verdict: 'Contours of a global water-vapour grid, projected to Equal Earth and clipped to the sphere: contours are out of scope for an elicitation library, and the sphere outline and clip are missing too.',
  needs: ['density-2d', 'projection', 'geo-transform', 'clip'],
  prep: [],
  gaps: ['`geoPolygon` could draw projected polygons, but the isobands would have to be computed and wrapped across the antimeridian by hand.'],
  alternative: 'A `geoRect` per coarse lat/lon cell on an Equal Earth map, with the reader picking a vapour band per region via `edit.legend.category()`.',
});

GALLERY.add({
  id: 'plot-blurred-contours',
  status: 'none',
  verdict: 'Contours interpolated from scattered magnetometer samples and blurred: spatial interpolation and contours are out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['The input is non-gridded points; Plot interpolates them onto a grid (`blur: 4`) before tracing contours.'],
  alternative: 'Show a sample of the readings as a `point` scatter coloured by field strength and ask the reader to `brushRect` the anomaly.',
});

GALLERY.add({
  id: 'plot-igrf90-contours',
  status: 'none',
  verdict: 'Filled contours derived from non-gridded samples: interpolation and contours are out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['Same data as Blurred contours, without the blur.'],
  alternative: 'A `point` scatter of the samples on a diverging `fill`, with `cycle()` to classify readings as anomalous.',
});

GALLERY.add({
  id: 'plot-small-grid-contours',
  status: 'partial',
  verdict: 'The notebook’s first chart, a 10×10 grid of values drawn as `text` coloured by value, is reproduced; its contoured twin is not, since contours are out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: ['prep-calculate'],
  gaps: [
    'Only the text grid: the second chart fills contours at intervals of 5 under the numbers.',
  ],
  recreation: {
    code: `const W = 10, H = 10;
// The notebook's grid: the value at (column, row) is column × row.
const values = d3.range(W * H).map((k) => {
  const col = k % W, row = Math.floor(k / W);
  return { x: col + 0.5, y: row + 0.5, v: col * row };
});
mount(Elicit({
  width: 420, height: 400,
  margins: { top: 14, right: 14, bottom: 34, left: 40 },
  schema: {
    x: { type: 'quantitative', domain: [0, W] },
    y: { type: 'quantitative', domain: [0, H] },
    v: { type: 'quantitative', domain: [0, 81] },
  },
  data: values,
  axes: { x: { grid: true, title: 'column →' }, y: { grid: true, title: 'row' } },
  marks: [
    text({
      fontSize: 11,
      channels: {
        x: { field: 'x' }, y: { field: 'y' }, text: { field: 'v' },
        fill: { field: 'v', scale: { scheme: 'turbo' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Above the line?',
      question: 'Values rise from the bottom-left corner. Which cells do you think are above 25?',
      try: 'Click a cell to cycle it between “?”, “below” and “above”. A few cells show their value as a clue.',
      why: 'Classifying every cell against a threshold is drawing a contour by hand. `cycle()` on the `fill` channel steps a cell through the `side` field’s domain; the clues are a second `text` mark over the same rows, so each cell is one row with two views.',
      uses: ['cycle()', 'text'],
      code: `const W = 10;
const clues = new Set([11, 23, 35, 47, 52, 66, 74, 88, 19, 91]);
const cells = d3.range(100).map((k) => {
  const col = k % W, row = Math.floor(k / W);
  return { col, row, side: '?', clue: clues.has(k) ? String(col * row) : '' };
});
mount(Elicit({
  width: 440, height: 360,
  margins: { top: 10, right: 10, bottom: 30, left: 34 },
  schema: {
    col: { type: 'ordinal', domain: d3.range(W) },
    row: { type: 'ordinal', domain: d3.range(W) },
    side: { type: 'ordinal', domain: ['?', 'below', 'above'] },  //! the three answers
    clue: { type: 'categorical' },
  },
  data: cells,
  legends: { fill: { anchor: 'right', title: 'vs 25' } },
  marks: [
    rect({
      stroke: '#fff',
      channels: {
        x: { field: 'col', scale: { padding: 0 } },
        y: { field: 'row', scale: { padding: 0 } },
        fill: { field: 'side', scale: { range: ['#e4e4e7', '#93c5fd', '#f97316'] },
                edit: cycle() },                         //! a click steps the answer
      },
    }),
    text({
      fontSize: 11, fill: '#111827',
      channels: { x: { field: 'col' }, y: { field: 'row' }, text: { field: 'clue' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-filled-contours',
  status: 'none',
  verdict: 'Elevation bands of the volcano filled by value: filled contours are out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: [
    '`d3.contours` can trace the bands, but `line`/`path` are always unfilled, so a band with a hole cannot be painted.',
    'The raster version of the same data is reproducible (see Volcano raster).',
  ],
  alternative: 'Draw the volcano as a `rect` grid and ask for elevation bands with `edit.legend.category()` (see Volcano raster).',
});

GALLERY.add({
  id: 'plot-stroked-contours',
  status: 'full',
  verdict: 'Isolines traced with `d3.contours` and drawn as `path` series, one per ring. Contours are out of scope for an elicitation library, but stroked rings are ordinary polylines, so the map draws once the generator runs in prep.',
  needs: [],
  prep: ['prep-contour'],
  gaps: [
    'The contour generator is `d3.contours` in plain JS; ElicitJS draws the rings it returns, one row per vertex.',
  ],
  recreation: {
    code: `const volcano = await plotData('observablehq__plot-volcano-raster', 'volcano.json');
const { width: w, height: h, values } = volcano;
// Trace isolines every 10 m, in grid units (column, row).
const contours = d3.contours().size([w, h]).thresholds(d3.range(100, 200, 10))(values);
const rows = [];
contours.forEach(({ value, coordinates }) =>
  coordinates.forEach((polygon, p) => polygon.forEach((ring, r) =>
    ring.forEach(([x, y]) => rows.push({ ring: value + ':' + p + ':' + r, x, y, value })))));
mount(Elicit({
  width: 440, height: 330,
  margins: { top: 10, right: 10, bottom: 24, left: 30 },
  schema: {
    ring: { type: 'categorical' },
    x: { type: 'quantitative', domain: [0, w] },
    y: { type: 'quantitative', domain: [0, h] },
    value: { type: 'quantitative' },
  },
  data: rows,
  marks: [
    path({
      stroke: 'currentColor', strokeWidth: 1,
      channels: { series: { field: 'ring' }, x: { field: 'x' }, y: { field: 'y' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Draw the 160 m line',
      question: 'The 100–140 m contours are drawn. Where do you think the 160 m contour runs?',
      try: 'Press and drag to trace a closed line. Draw again to add another ring.',
      why: '`edit.line.draw()` turns a freehand stroke into rows of a new series, sampled every `minDist` pixels, so a hand-drawn ring is data in the same shape as a traced one. The given contours are context rows in their own `gx`/`gy` columns, drawn by a second `path`, so `getData()` holds only your rings.',
      uses: ['edit.line.draw()', 'context'],
      code: `const volcano = await plotData('observablehq__plot-volcano-raster', 'volcano.json');
const { width: w, height: h, values } = volcano;
const contours = d3.contours().size([w, h]).thresholds([100, 120, 140])(values);
const given = [];
contours.forEach(({ value, coordinates }) =>
  coordinates.forEach((polygon, p) => polygon.forEach((ring, r) =>
    ring.filter((_, k) => k % 3 === 0).forEach(([gx, gy]) => given.push({ contour: value + ':' + p + ':' + r, gx, gy })))));
const x = { type: 'quantitative', domain: [0, w] }, y = { type: 'quantitative', domain: [0, h] };
mount(Elicit({
  width: 440, height: 330,
  margins: { top: 10, right: 10, bottom: 24, left: 30 },
  schema: {
    ring: { type: 'quantitative' }, x, y,                    // your rings
    contour: { type: 'categorical' }, gx: x, gy: y,          // the given contours
  },
  data: given,
  context: true,                                            //! the given contours are context
  marks: [
    path({
      stroke: '#9ca3af', strokeWidth: 1.5,
      channels: { series: { field: 'contour' }, x: { field: 'gx' }, y: { field: 'gy' } },
    }),
    path({
      stroke: '#e8590c', strokeWidth: 1.5, handles: 'hit',  // draw aims at the handles
      channels: { series: { field: 'ring' }, x: { field: 'x' }, y: { field: 'y' } },
      edits: [edit.line.draw({ series: 'ring', minDist: 8, into: 'new' })],  //! every stroke is a new ring
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-olympians-density',
  status: 'none',
  verdict: 'Two-dimensional kernel-density contours of weight × height, one set per sex: 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: [
    '`d3.contourDensity` could trace the rings in prep and `path` could draw them (as in Stroked contours), but the estimate runs in pixel space, so the bandwidth and the inversion back to data units would be hand-written.',
  ],
  alternative: 'Ask for the region itself: `brushRect` a box around where you think most athletes of one sex fall.',
});

GALLERY.add({
  id: 'plot-density-weighted',
  status: 'none',
  verdict: 'A 2-D density whose weights a slider skews between the sexes: 2-D density is out of scope for an elicitation library, and the slider is a bound input it lacks.',
  needs: ['density-2d', 'input-widgets'],
  prep: [],
  gaps: ['The interaction is the point: dragging `skew` re-weights the density and the dots’ opacity live.'],
  alternative: 'A `point` scatter of the penguins coloured by sex, where the reader `cycle()`s the sex of unlabelled birds.',
});

GALLERY.add({
  id: 'plot-density-faceted',
  status: 'none',
  verdict: 'Density contours coloured by density, faceted by island and clipped to the frame: 2-D density is out of scope for an elicitation library, and faceting is not covered by this study.',
  needs: ['density-2d', 'facet'],
  prep: [],
  gaps: ['Three panels, one per island, each with its own contour set. `clip: true` would clip each panel to its frame.'],
  alternative: 'One scatter per island, each a separate chart, with `brushRect` for the densest region.',
});

GALLERY.add({
  id: 'plot-walmart-density',
  status: 'none',
  verdict: 'A projected 2-D density of store locations under state borders: 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d', 'projection', 'topojson'],
  prep: [],
  gaps: ['Density fill, state mesh, nation outline and 3,000 dots are four layers over three datasets; the borders and dots could be context rows, the density could not.'],
  alternative: 'Place `geoPoint` pins where you think stores cluster, with `edit.geo.create()` and a `count({ max })` budget.',
});

GALLERY.add({
  id: 'plot-density-stroke',
  status: 'none',
  verdict: 'Density contours of 50,000 diamonds on log–log axes, stroked by density: 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d', 'dense-data'],
  prep: [],
  gaps: ['The underlying scatter would be 53,940 points; the contours summarize them.'],
  alternative: 'Draw the carat–price relation as a `trend` you pull into place on log axes.',
});

GALLERY.add({
  id: 'plot-raster-projection',
  status: 'none',
  verdict: 'A global water-vapour raster, barycentrically interpolated, projected to Equal Earth and clipped to the sphere: projected rasters are out of scope for an elicitation library.',
  needs: ['raster', 'projection', 'clip', 'geo-transform'],
  prep: [],
  gaps: ['`geoRect` cells could tile a coarse version, but neither the interpolation nor the sphere outline exists.'],
  alternative: 'Pick a vapour band per region on a coarse `geoRect` grid with `edit.legend.category()`.',
});

GALLERY.add({
  id: 'plot-one-dimensional-density',
  status: 'none',
  verdict: 'Density contours of Old Faithful waiting times over a strip of dots: the density is two-dimensional even with one variable, and 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['The dot strip alone is a `point` mark on x; the contour rings around it are the example.'],
  alternative: 'Draw the waiting-time density as an `areaY` you reshape with `edit.line.sweep()`: two humps or one?',
});

GALLERY.add({
  id: 'plot-density-options',
  status: 'none',
  verdict: 'Two sliders drive a density mark’s bandwidth and thresholds: 2-D density is out of scope for an elicitation library, and the sliders are bound inputs it lacks.',
  needs: ['density-2d', 'input-widgets'],
  prep: [],
  gaps: ['The example teaches the density options; without the mark there is nothing to tune.'],
  alternative: 'Ask how many clusters the eruptions form by placing one `point` per cluster centre with `create()`.',
});

GALLERY.add({
  id: 'plot-point-cloud-density',
  status: 'none',
  verdict: 'Density contours drawn over the Old Faithful scatter: 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['The scatter is reproducible on its own; the thin and thick contour sets are not.'],
  alternative: 'Show the scatter and ask the reader to `brushRect` each of the two clusters.',
});

GALLERY.add({
  id: 'plot-non-overlapping-density-regions',
  status: 'none',
  verdict: 'One density per species with negative weights for the others, cut at a single threshold to make non-overlapping regions: 2-D density is out of scope for an elicitation library.',
  needs: ['density-2d'],
  prep: [],
  gaps: ['The regions are filled polygons at the 0.05 threshold, drawn under a scatter coloured by species.'],
  alternative: 'Show the penguins as a scatter and ask the reader to draw each species’ boundary with `edit.line.draw()` on a `path`.',
});

// ════════════════════════════════════════════════════════════════════════════
// Axes
// ════════════════════════════════════════════════════════════════════════════

GALLERY.add({
  id: 'plot-wrap-tick-labels',
  status: 'full',
  verdict: 'A `barY` of survey shares whose long category names wrap under each bar: the labels are a `text` mark with `wrap`, sitting where the tick labels would.',
  needs: [],
  prep: [],
  gaps: [
    'The axis itself cannot wrap its labels; the x axis keeps its ticks and a `text` mark over the same rows draws the wrapped names at y = 0.',
    'A wrapped block is centred on its anchor (`lineAnchor` applies per line), so labels of two and four lines do not share a top edge.',
    'The “↑ Responses (%)” title runs along the y axis, past the tick labels; Plot sets it flat above the axis.',
  ],
  recreation: {
    code: `const responses = [
  { name: 'Family in feud with Zucker­bergs', value: 0.17 },
  { name: 'Committed 671 birthdays to memory', value: 0.19 },
  { name: 'Ex is doing too well', value: 0.10 },
  { name: 'High school friends all dead now', value: 0.15 },
  { name: 'Discovered how to “like” things mentally', value: 0.27 },
  { name: 'Not enough politics', value: 0.12 },
];
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 16, right: 10, bottom: 62, left: 40 },
  schema: {
    // Plot sorts an ordinal domain alphabetically.
    name: { type: 'categorical', domain: responses.map((d) => d.name).sort(d3.ascending) },
    value: { type: 'quantitative', domain: [0, 0.3] },
  },
  data: responses,
  axes: {
    x: { tickFormat: () => '' },
    y: { tickFormat: '.0%', title: '↑ Responses (%)' },
  },
  marks: [
    barY({ fill: 'currentColor', channels: { x: { field: 'name' }, y: { field: 'value' } } }),
    // The wrapped names: a text mark pinned to y = 0, below the axis. A wrapped
    // block is centred on its anchor, so \`dy\` pushes it clear of the baseline.
    text({
      fontSize: 10, dy: 26, wrap: 70,
      channels: { x: { field: 'name' }, y: { datum: 0 }, text: { field: 'name' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Split the 100%',
      question: 'Among people who quit Facebook, what share do you think gave each reason?',
      try: 'Drag each bar up from zero. The counter shows how much of the 100% is left.',
      why: '`move()` on `y` writes each share; `maintainSum({ total: 100, strategy: \'cap\' })` refuses to let them exceed 100%, and `guides.remaining()` reads its target off that constraint. The bars start empty, so nothing is suggested.',
      uses: ['move()', 'maintainSum()', 'guides.remaining()'],
      code: `const reasons = ['Family in feud with Zucker­bergs', 'Committed 671 birthdays to memory',
  'Ex is doing too well', 'High school friends all dead now',
  'Discovered how to “like” things mentally', 'Not enough politics'];
mount(Elicit({
  width: 460, height: 320,
  margins: { top: 30, right: 10, bottom: 62, left: 40 },
  schema: {
    name: { type: 'categorical', domain: reasons },
    value: { type: 'quantitative', domain: [0, 50] },
  },
  data: reasons.map((name) => ({ name, value: 0 })),          // nothing placed yet
  constraints: [clamp({ min: 0 }), maintainSum({ total: 100, strategy: 'cap' })],  //! shares cap at 100%
  guides: [guides.remaining({ field: 'value', unit: '%' })],  //! what is left to place
  axes: { x: { tickFormat: () => '' }, y: { tickFormat: (d) => d + '%' } },
  marks: [
    barY({
      fill: '#4f46e5',
      channels: { x: { field: 'name' }, y: { field: 'value', edit: move() } },  //! drag a share
    }),
    text({
      fontSize: 10, dy: 26, wrap: 70,
      channels: { x: { field: 'name' }, y: { datum: 0 }, text: { field: 'name' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-ggplot2-style-axes',
  status: 'full',
  verdict: 'The Apple close as a black `lineY` with white gridlines on a grey panel: `theme.panel` greys the plotting area alone, and the grid and axis tokens do the rest.',
  needs: [],
  prep: [],
  gaps: [],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 14, right: 14, bottom: 28, left: 40 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  theme: {
    panel: { fill: '#eaeaea' },                            //! grey under the plot only, not the margins
    grid: { stroke: '#ffffff', strokeWidth: 1 },
    axis: { line: false, tickSize: 3 },
  },
  axes: { x: { grid: true }, y: { grid: true } },
  marks: [
    lineY({
      stroke: 'black', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Click in the year',
      question: 'Apple’s 2018 closes are missing. Where do you think the stock closed at the end of each month?',
      try: 'Click on the panel to drop a month’s close; drag a point to adjust it. Alt-click removes one.',
      why: '`edit.line.anchor()` mints a point where you click and slots it into the line, and the `snap` constraint on `Date` rounds it to a month-end so you answer one value per month. `lock` keeps the observed history fixed.',
      uses: ['edit.line.anchor()', 'snap()', 'lock', 'remove()'],
      code: `const aapl = await plotData('aapl');
// Month-end closes through 2017; 2018 is yours to fill in.
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date))
  .map(([, rows]) => rows.at(-1)).filter((d) => d.Date < new Date('2018-01-01'))
  .map(({ Date, Close }) => ({ Date: +Date, Close }));
const x0 = +new Date('2016-01-01'), x1 = +new Date('2018-07-01');
mount(Elicit({
  width: 460, height: 300,
  margins: { top: 10, right: 10, bottom: 26, left: 40 },
  schema: {
    Date: { type: 'quantitative', domain: [x0, x1] },
    Close: { type: 'quantitative', domain: [80, 220] },
  },
  data: monthly.filter((d) => d.Date >= x0),
  lock: 'seed',                                            //! history is given
  constraints: [snap({ field: 'Date', step: 30.44 * 864e5, origin: +new Date('2017-12-31') })],  //! one point per month
  theme: { panel: { fill: '#eaeaea' }, grid: { stroke: '#ffffff', strokeWidth: 1 }, axis: { line: false, tickSize: 3 } },
  axes: {
    x: { grid: true, ticks: 5, tickFormat: (d) => d3.utcFormat('%b %Y')(new Date(d)) },
    y: { grid: true },
  },
  marks: [
    lineY({
      stroke: 'black', strokeWidth: 1.5, handleSize: 3,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
      edits: [
        edit.line.anchor({ when: when.noAlt }),            //! click to add a month’s close
        move({ channels: ['y'] }),
        remove({ when: when.alt }),
      ],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-datawrapper-style-date-axis',
  status: 'full',
  verdict: 'The Apple close with a tick and gridline every three months, the year on a second line under each January, and a zero rule.',
  needs: [],
  prep: [],
  gaps: [
    'The zero baseline is a `guides.rule` (a `rule` mark over the dataset would draw one per row).',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
const quarters = d3.utcMonth.every(3).range(new Date('2013-07-01'), new Date('2018-06-01'));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: {
    x: {
      grid: true, tickValues: quarters, fontSize: 9,
      tickFormat: (d) => (d.getUTCMonth() === 0 ? d3.utcFormat('%b\\n%Y')(d) : d3.utcFormat('%b')(d)), //! the year on a second line
    },
  },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeDash: 'none', opacity: 1 })],
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
      title: 'Date the bottom',
      question: 'After its 2015 peak, Apple slid for about a year. In which month do you think it bottomed out?',
      try: 'Drag the orange rule left or right.',
      why: 'The answer is one row with one temporal column, so `ruleX` with `move()` on `x` is the whole instrument: the rule IS the date. The price series is `context`, drawn by the recreation’s `lineY` from its own `day` and `Close` columns, so it never enters `getData()`.',
      uses: ['move()', 'ruleX', 'context'],
      code: `const aapl = await plotData('aapl');
const quarters = d3.utcMonth.every(3).range(new Date('2013-07-01'), new Date('2018-06-01'));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal', domain: [new Date('2013-05-13'), new Date('2018-05-11')] },  // your answer
    day: { type: 'temporal' },                              // the price history
    Close: { type: 'quantitative', domain: [0, 200] },
  },
  data: [
    ...aapl.map(({ Date, Close }) => ({ day: Date, Close })),
    { Date: new Date('2015-05-01') },                       //! one row: the date you pick
  ],
  context: (d) => d.Close != null,                          //! the price is context, not an answer
  axes: {
    x: { grid: true, tickValues: quarters, fontSize: 9,
         tickFormat: (d) => (d.getUTCMonth() === 0 ? d3.utcFormat('%b\\n%Y')(d) : d3.utcFormat('%b')(d)) },
  },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeDash: 'none', opacity: 1 })],
  marks: [
    lineY({
      stroke: '#64748b', strokeWidth: 1.2,
      channels: { x: { field: 'day' }, y: { field: 'Close' } },
    }),
    ruleX({
      stroke: '#e8590c', strokeWidth: 3,
      channels: { x: { field: 'Date', edit: move() } },     //! drag the rule to a date
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-nyt-style-axes',
  status: 'full',
  verdict: 'The Apple close in the NYT style: dotted gridlines with their labels inset above them, no y axis, and a dot at the end of the line. The grid and its labels are a `ruleY` and a `text` over context rows of ticks.',
  needs: [],
  prep: [],
  gaps: [
    'The y axis is off; its gridlines and labels are marks over context rows of tick values, so the dash and the inset are ordinary mark options.',
    'Plot insets the x scale by 36 px to make room for the labels; here the `Date` domain starts a few months early instead.',
    'The end dot is a `point` whose `size` is a `{ fn }` that is zero for every row but the last.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
// The grid: one row per tick, the top label with a dollar sign.
const ticks = d3.range(0, 200, 20).map((level, i, all) => ({ level, label: (i === all.length - 1 ? '$' : '') + level }));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 6 },
  schema: {
    // Starts early to leave room for the inset labels.
    Date: { type: 'temporal', domain: [new Date('2012-12-01'), new Date('2018-05-11')] },
    Close: { type: 'quantitative', domain: [0, 200] },
    level: { type: 'quantitative' }, label: { type: 'categorical' },
  },
  // The ticks first, so the last row is still the last close.
  data: [...ticks, ...aapl.map(({ Date, Close }) => ({ Date, Close }))],
  context: (d) => d.label != null,
  axes: { x: { title: '' }, y: false },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeDash: 'none', opacity: 1 })],
  marks: [
    ruleY({ stroke: 'currentColor', strokeDash: '0.75 2', channels: { y: { field: 'level' } } }),
    text({
      fontSize: 10, textAnchor: 'start', lineAnchor: 'bottom', dy: -4,
      channels: { x: { value: 0 }, y: { field: 'level' }, text: { field: 'label' } },
    }),
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    // markerEnd: "dot" — one visible point, on the last row.
    point({
      fill: 'currentColor',
      channels: {
        x: { field: 'Date' }, y: { field: 'Close' },
        size: { fn: (d, i, data) => (i === data.length - 1 ? 3 : 0) },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Drag the end dot',
      question: 'Apple closed at $188 in May 2018. Where do you think it closed on the last trading day of 2018?',
      try: 'Drag the orange dot up or down. The line follows it.',
      why: 'Your forecast is one more row of the same table, so the `lineY` draws it as the line’s continuation, NYT end dot included. `lock` freezes every observed close; the point mark sizes only your row, so it is the one thing you can grab, and `move()` on `y` keeps its date fixed.',
      uses: ['move()', 'lock', '{ fn } channel'],
      code: `const aapl = await plotData('aapl');
const monthly = d3.groups(aapl, (d) => +d3.utcMonth(d.Date)).map(([, rows]) => rows.at(-1))
  .map(({ Date, Close }) => ({ Date, Close, yours: false }));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [0, 300] },
    yours: { type: 'categorical', domain: [false, true] },
  },
  data: [...monthly, { Date: new Date('2018-12-31'), Close: 188, yours: true }],
  lock: (d) => !d.yours,                                   //! history is given
  axes: { x: { title: '' }, y: { grid: { stroke: '#9ca3af', strokeWidth: 0.6 }, tickSize: 0 } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    point({
      fill: '#e8590c',
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: move() },                //! drag your forecast
        size: { fn: (d) => (d.yours ? 7 : 0) },             //! only your row has a dot
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-data-based-axis',
  status: 'full',
  verdict: 'The Apple line with its data-based y axis: each gridline starts, and each label sits, at the date the price first reached that value. Ticks are context rows drawn by a `ruleY` span and a `text` mark.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    'The y axis is off; its ticks are context rows (value, first date reached, last date), so the staggered grid is ordinary marks rather than an axis option.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
const end = aapl.at(-1).Date;
// One tick per $20, placed at the first date the close reached it.
const ticks = d3.range(0, 200, 20).map((level) => ({ level, reached: aapl.find((d) => d.Close >= level)?.Date, end }))
  .filter((d) => d.reached);
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' }, Close: { type: 'quantitative', domain: [0, 200] },
    level: { type: 'quantitative' }, reached: { type: 'temporal' }, end: { type: 'temporal' },
  },
  data: [...ticks, ...aapl.map(({ Date, Close }) => ({ Date, Close }))],
  context: (d) => d.level != null,
  axes: { y: false },
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeDash: 'none', opacity: 1 })],
  marks: [
    ruleY({
      stroke: 'currentColor', strokeOpacity: 0.1, strokeDash: 'none',
      channels: { x1: { field: 'reached' }, x2: { field: 'end' }, y: { field: 'level' } },
    }),
    text({
      fontSize: 10, textAnchor: 'end', dx: -6,
      channels: { x: { field: 'reached' }, y: { field: 'level' }, text: { field: 'level' } },
    }),
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Set the threshold',
      question: 'By the end of 2019, what is the highest price you think Apple will have closed at?',
      try: 'Drag the orange line up or down; the label follows it.',
      why: 'The answer is a single value, so it is a one-row table: `ruleY` with `move()` on `y` sets it, and a `text` mark over the same row reads it back. `clamp()` stops it below the 2018 high, since the record can only rise. The price history is `context`, drawn by a `lineY`.',
      uses: ['move()', 'ruleY', 'clamp()', 'context'],
      code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal', domain: [new Date('2013-05-13'), new Date('2019-12-31')] },
    Close: { type: 'quantitative' },
    high: { type: 'quantitative', domain: [0, 300] },
  },
  data: [
    ...aapl.map(({ Date, Close }) => ({ Date, Close })),
    // One row: the date the question is about, and your answer.
    { Date: new Date('2019-12-31'), high: 200 },
  ],
  context: (d) => d.Close != null,                          //! the price history is context
  constraints: [clamp({ field: 'high', min: 190.04 })],    //! no lower than the 2018 record
  axes: { y: { grid: true } },
  marks: [
    lineY({
      stroke: '#64748b', strokeWidth: 1.2,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    ruleY({
      stroke: '#e8590c', strokeWidth: 3,
      channels: { y: { field: 'high', edit: move() } },     //! drag the record
    }),
    text({
      fill: '#e8590c', fontSize: 12, format: '$.0f', textAnchor: 'end', lineAnchor: 'bottom', dy: -4,
      channels: { x: { field: 'Date' }, y: { field: 'high' }, text: { field: 'high' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-major-and-minor-axis-ticks',
  status: 'full',
  verdict: 'Two `axisX` and two `axisY` elements over one scale: one draws short unlabelled ticks every month (every $5), the other the labelled major ticks.',
  needs: [],
  prep: [],
  gaps: ['Plot asks for 50 minor y ticks and lets d3 pick the step; here the step is given as explicit `tickValues`.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
const x0 = new Date('2013-05-01'), x1 = new Date('2018-06-01');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal', domain: [x0, x1] },
    Close: { type: 'quantitative', domain: [55, 195] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: false,
  elements: [
    axisX({ tickValues: d3.utcMonth.range(x0, x1), tickFormat: () => '', tickSize: 3 }),
    axisX(),
    axisY({ tickValues: d3.range(55, 200, 5), tickFormat: () => '', tickSize: 3 }),
    axisY({ grid: true }),
  ],
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
      title: 'Brush the worst stretch',
      question: 'Over which months do you think Apple fell the furthest, from a high to the following low?',
      try: 'Drag the edges of the shaded band to the start and end of the slide, or drag its middle to move it.',
      why: '`brushSpan()` on a `rect`’s `x1`/`x2` edits an interval in one gesture: grab an edge to move one end, the body to move both. The monthly minor ticks are what let you read the band to the month; the price is `context`, drawn by the recreation’s `lineY`.',
      uses: ['brushSpan()', 'rect', 'context'],
      code: `const aapl = await plotData('aapl');
const x0 = new Date('2013-05-01'), x1 = new Date('2018-06-01');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    start: { type: 'temporal', domain: [x0, x1] },
    end: { type: 'temporal', domain: [x0, x1] },
    Date: { type: 'temporal', domain: [x0, x1] },
    Close: { type: 'quantitative', domain: [55, 195] },
  },
  data: [
    ...aapl.map(({ Date, Close }) => ({ Date, Close })),
    { start: new Date('2014-01-01'), end: new Date('2014-07-01') },
  ],
  context: (d) => d.Close != null,                          //! the price is context
  axes: false,
  elements: [
    axisX({ tickValues: d3.utcMonth.range(x0, x1), tickFormat: () => '', tickSize: 3 }),
    axisX(),
    axisY({ tickValues: d3.range(55, 200, 5), tickFormat: () => '', tickSize: 3 }),
    axisY({ grid: true }),
  ],
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.2,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    rect({
      fill: '#e8590c', fillOpacity: 0.25, stroke: '#e8590c',
      channels: { x1: { field: 'start' }, x2: { field: 'end' } },
      edits: [brushSpan({ channels: ['x1', 'x2'], edgeInset: 10, guide: true })],  //! edges or body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-parcoords',
  status: 'partial',
  verdict: 'Parallel coordinates the way Plot draws them: a `lineX` over tidy (car, dimension, normalized value) rows, one series per car, coloured by fuel economy, with each axis’s ticks drawn by a `text` mark over context rows. The “color by” select is missing.',
  needs: ['input-widgets'],
  prep: ['prep-reshape', 'prep-calculate'],
  gaps: [
    'Each dimension has its own scale, so its tick labels are context rows with their own (dimension, normalized value, label) columns, computed with `d3.scaleLinear().ticks(7)` as Plot does.',
    'The “color by” select is not bound; the colour is fixed to economy.',
  ],
  recreation: {
    code: `const cars = await plotData('observablehq__plot-parcoords', 'cars.csv');
const dims = ['economy (mpg)', 'cylinders', 'displacement (cc)', 'power (hp)', 'weight (lb)', '0-60 mph (s)', 'year'];
const ext = Object.fromEntries(dims.map((k) => [k, d3.extent(cars, (d) => d[k])]));
const norm = (k, v) => (v - ext[k][0]) / (ext[k][1] - ext[k][0]);
// Tidy rows: one per (car, dimension), the value normalized to [0, 1].
// A missing measurement is skipped, so that car's line jumps over the axis.
const points = cars.flatMap((car, index) => dims.filter((k) => car[k] != null).map((k) => ({
  index, dimension: k, value: norm(k, car[k]), economy: car['economy (mpg)'],
})));
// Each axis's ticks, in that dimension's own units.
const ticks = dims.flatMap((k) => d3.scaleLinear(ext[k], [0, 1]).ticks(7)
  .map((v) => ({ tickDimension: k, tickValue: norm(k, v), label: d3.format(',')(v) })));
// A band y axis runs bottom-up; reverse it so the first dimension is on top.
const dimension = { type: 'categorical', domain: dims.slice().reverse() };
const value = { type: 'quantitative', domain: [0, 1] };
mount(Elicit({
  width: 470, height: 340,
  margins: { top: 10, right: 16, bottom: 10, left: 110 },
  schema: {
    index: { type: 'categorical' }, dimension, value, economy: { type: 'quantitative' },
    tickDimension: dimension, tickValue: value, label: { type: 'categorical' },
  },
  data: [...ticks, ...points],
  context: (d) => d.label != null,
  axes: { x: false, y: { title: '' } },
  marks: [
    ruleY({ stroke: '#d4d4d8', channels: { y: { field: 'tickDimension' } } }),
    lineX({
      strokeWidth: 0.5, strokeOpacity: 0.5,
      channels: {
        series: { field: 'index' },
        y: { field: 'dimension' }, x: { field: 'value' },
        stroke: { field: 'economy', scale: d3.scaleSequential(d3.interpolateBrBG).domain([47, 9]),
                  legend: { anchor: 'top', title: 'economy (mpg)' } },
      },
    }),
    // The per-axis tick labels: a text mark over the tick rows.
    text({
      fontSize: 9, fill: 'black', stroke: 'white', strokeWidth: 3, //! a stroke on text is a halo behind it
      channels: { x: { field: 'tickValue' }, y: { field: 'tickDimension' }, text: { field: 'label' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Profile a car',
      question: 'Sketch a typical 1982 economy car: where does it sit on each dimension, relative to the 1970–82 fleet?',
      try: 'Drag each orange handle left or right along its axis. The grey lines are 30 cars from the data.',
      why: 'Your car is seven rows of the elicited table, one per dimension, so a `lineX` draws it as one more polyline and a `point` mark over the same rows gives it handles. `move()` on `x` slides each along its own axis without changing which axis it is on. The fleet and the tick labels are context rows in columns of their own, read-only and absent from `getData()`.',
      uses: ['move()', 'lineX', 'context'],
      code: `const cars = await plotData('observablehq__plot-parcoords', 'cars.csv');
const dims = ['economy (mpg)', 'cylinders', 'displacement (cc)', 'power (hp)', 'weight (lb)', '0-60 mph (s)', 'year'];
const ext = Object.fromEntries(dims.map((k) => [k, d3.extent(cars, (d) => d[k])]));
const norm = (k, v) => (v - ext[k][0]) / (ext[k][1] - ext[k][0]);
const sample = d3.range(0, cars.length, 14).map((i) => cars[i]).filter((car) => dims.every((k) => car[k] != null));
const fleet = sample.flatMap((car, index) => dims.map((k) => ({ car: index, carDimension: k, carValue: norm(k, car[k]) })));
const ticks = dims.flatMap((k) => d3.scaleLinear(ext[k], [0, 1]).ticks(5)
  .map((v) => ({ tickDimension: k, tickValue: norm(k, v), label: d3.format(',')(v) })));
// A band y axis runs bottom-up; reverse it so the first dimension is on top.
const dimension = { type: 'categorical', domain: dims.slice().reverse() };
const value = { type: 'quantitative', domain: [0, 1] };
mount(Elicit({
  width: 470, height: 340,
  margins: { top: 10, right: 16, bottom: 10, left: 110 },
  schema: {
    dimension, value,                                        // your car
    car: { type: 'categorical' }, carDimension: dimension, carValue: value,  // the fleet
    tickDimension: dimension, tickValue: value, label: { type: 'categorical' },  // the tick labels
  },
  data: [
    ...fleet, ...ticks,
    ...dims.map((k) => ({ dimension: k, value: 0.5 })),       // your car starts mid-range
  ],
  context: (d) => d.value == null,                          //! the fleet and the ticks are context
  axes: { x: false, y: { title: '' } },
  marks: [
    ruleY({ stroke: '#d4d4d8', channels: { y: { field: 'tickDimension' } } }),
    lineX({
      stroke: '#cbd5e1', strokeWidth: 1,
      channels: { series: { field: 'car' }, y: { field: 'carDimension' }, x: { field: 'carValue' } },
    }),
    text({
      fontSize: 9, fill: '#64748b',
      channels: { x: { field: 'tickValue' }, y: { field: 'tickDimension' }, text: { field: 'label' } },
    }),
    lineX({
      stroke: '#e8590c', strokeWidth: 2,
      channels: { y: { field: 'dimension' }, x: { field: 'value' } },
    }),
    point({
      fill: '#e8590c', size: 6,
      channels: {
        y: { field: 'dimension' },
        x: { field: 'value', edit: move() },               //! slide along the axis
      },
    }),
  ],
}));`,
    },
  ],
});

// ════════════════════════════════════════════════════════════════════════════
// Delaunay, Voronoi
// ════════════════════════════════════════════════════════════════════════════

GALLERY.add({
  id: 'plot-delaunay-links',
  status: 'full',
  verdict: 'The Delaunay triangulation of the penguins is computed with `d3.Delaunay`, and each edge drawn as a two-row `path` series coloured by body mass. Delaunay meshes are out of scope for an elicitation library, but the edges are ordinary polylines once the triangulation runs in prep.',
  needs: [],
  prep: ['prep-delaunay'],
  gaps: [
    'The triangulation is prep, not a mark: every edge becomes two rows.',
    'An edge’s colour is the mean body mass of its two penguins; Plot interpolates each link’s channels between its endpoints too, so the colours match.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_depth_mm) && Number.isFinite(d.culmen_length_mm));
const delaunay = d3.Delaunay.from(penguins, (d) => d.culmen_depth_mm, (d) => d.culmen_length_mm);
// Each undirected edge once: halfedge e pairs with its twin, keep the larger.
const rows = [];
const { triangles, halfedges } = delaunay;
for (let e = 0; e < triangles.length; ++e) {
  if (e < halfedges[e]) continue;
  const a = penguins[triangles[e]], b = penguins[triangles[e % 3 === 2 ? e - 2 : e + 1]];
  const mass = (a.body_mass_g + b.body_mass_g) / 2;
  rows.push({ edge: e, x: a.culmen_depth_mm, y: a.culmen_length_mm, mass },
            { edge: e, x: b.culmen_depth_mm, y: b.culmen_length_mm, mass });
}
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 46, right: 14, bottom: 30, left: 36 },
  schema: {
    edge: { type: 'quantitative' },
    x: { type: 'quantitative', domain: [13, 21.5] },
    y: { type: 'quantitative', domain: [32, 60] },
    mass: { type: 'quantitative' },
  },
  data: rows,
  axes: { x: { title: 'culmen_depth_mm →' }, y: { title: '↑ culmen_length_mm' } },
  legends: { stroke: { anchor: 'top', title: 'body_mass_g' } },
  marks: [
    path({
      strokeWidth: 1.5,
      channels: {
        series: { field: 'edge' }, x: { field: 'x' }, y: { field: 'y' },
        stroke: { field: 'mass', scale: d3.scaleSequential(d3.interpolateTurbo).domain([2700, 6300]) },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Link the relatives',
      question: 'These twelve penguins are unlabelled. Which pairs do you think belong to the same species?',
      try: 'Drag from one penguin to another to link them. Alt-click a link to remove it.',
      why: 'A link is a row in a second table, so the answer is a graph rather than a column. `edit.network.connect()` on the node mark proposes a link while you drag and writes it on release; `directed: false` makes A–B and B–A the same pair, so the mirror is refused.',
      uses: ['edit.network.connect()', 'link', 'structure: network'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_depth_mm) && d.sex);
// Four of each species, by a fixed stride, unlabelled.
const pick = ['Adelie', 'Chinstrap', 'Gentoo'].flatMap((s) =>
  penguins.filter((d) => d.species === s).filter((_, i) => i % 9 === 4).slice(0, 4));
mount(Elicit({
  width: 440, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    structure: 'network',
    tables: {
      nodes: {
        id: { type: 'categorical', key: true, open: true },
        x: { type: 'quantitative', domain: [13, 21.5] },   // culmen depth
        y: { type: 'quantitative', domain: [32, 60] },     // culmen length
      },
      links: {
        directed: false,                                 //! a pair, not an arrow
        fields: { source: { type: 'ref' }, target: { type: 'ref' } },
      },
    },
  },
  data: {
    nodes: pick.map((d, i) => ({ id: 'p' + i, x: d.culmen_depth_mm, y: d.culmen_length_mm })),
    links: [],
  },
  axes: { x: { title: 'culmen_depth_mm →' }, y: { title: '↑ culmen_length_mm' } },
  marks: [
    link({ stroke: '#e8590c', strokeWidth: 2, inset: 4, edits: [remove({ when: when.alt })] }),
    point({
      size: 7, fill: '#334155',
      channels: { x: { field: 'x' }, y: { field: 'y' } },
      edits: [edit.network.connect()],                   //! drag node to node
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-voronoi-scatterplot',
  status: 'none',
  verdict: 'Voronoi cells filled by species under a scatter: Voronoi diagrams are out of scope for an elicitation library, which has no filled polygon mark on planar axes.',
  needs: ['delaunay'],
  prep: [],
  gaps: [
    '`d3.Delaunay` gives the cells, but `line`/`path` are always unfilled and `geoPolygon` needs a projection, which would drop the axes.',
    'The dots alone are an ordinary `point` scatter.',
  ],
  alternative: 'Show the penguins unlabelled and ask the reader to `cycle()` each one’s species; the Voronoi regions are what their answer implies.',
});

GALLERY.add({
  id: 'plot-delaunay-hull',
  status: 'full',
  verdict: 'Per-species Delaunay meshes and convex hulls, computed with `d3.Delaunay` and drawn as `path` series: thin for mesh edges, thick and closed for each hull. Delaunay meshes are out of scope for an elicitation library, but these are ordinary polylines once computed in prep.',
  needs: [],
  prep: ['prep-delaunay'],
  gaps: [
    'Mesh edges and hulls are rows of one table, told apart by a `kind` column that sets each series’ width and opacity through `{ fn }` channels.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_depth_mm) && Number.isFinite(d.culmen_length_mm));
const rows = [];
let id = 0;
for (const [species, group] of d3.group(penguins, (d) => d.species)) {
  const pts = group.map((d) => [d.culmen_depth_mm, d.culmen_length_mm]);
  const del = d3.Delaunay.from(pts);
  const { triangles, halfedges } = del;
  // Mesh: each interior edge once, plus the hull edges.
  for (let e = 0; e < triangles.length; ++e) {
    if (e < halfedges[e]) continue;
    const a = pts[triangles[e]], b = pts[triangles[e % 3 === 2 ? e - 2 : e + 1]];
    rows.push({ s: id, x: a[0], y: a[1], species, kind: 'mesh' }, { s: id++, x: b[0], y: b[1], species, kind: 'mesh' });
  }
  // Hull: a closed ring, the first vertex repeated at the end.
  const hull = [...del.hull, del.hull[0]].map((i) => pts[i]);
  hull.forEach(([x, y]) => rows.push({ s: id, x, y, species, kind: 'hull' }));
  id++;
}
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    s: { type: 'quantitative' },
    x: { type: 'quantitative', domain: [13, 21.5] },
    y: { type: 'quantitative', domain: [32, 60] },
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    kind: { type: 'categorical', domain: ['mesh', 'hull'] },
  },
  data: rows,
  axes: { x: { title: 'culmen_depth_mm →' }, y: { title: '↑ culmen_length_mm' } },
  marks: [
    path({
      channels: {
        series: { field: 's' }, x: { field: 'x' }, y: { field: 'y' },
        stroke: { field: 'species', scale: { scheme: 'tableau10' } },
        strokeWidth: { fn: (d) => (d.kind === 'hull' ? 2 : 1) },
        strokeOpacity: { fn: (d) => (d.kind === 'hull' ? 1 : 0.6) },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Box each species',
      question: 'These penguins are unlabelled. Where do you think each of the three species sits?',
      try: 'Drag a box’s edges or corners to resize it, or its middle to move it.',
      why: 'Each species’ region is one row with four columns, so `brushRect()` edits all four extents of a `rect` at once: edges, corners or the body. The penguins are `context`, drawn by a `point` mark, so the answer is only the three boxes.',
      uses: ['brushRect()', 'rect', 'context'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_depth_mm) && Number.isFinite(d.culmen_length_mm));
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 14, right: 96, bottom: 30, left: 36 },
  schema: {
    species: { type: 'categorical', domain: ['Adelie', 'Chinstrap', 'Gentoo'] },
    x1: { type: 'quantitative', domain: [13, 21.5] }, x2: { type: 'quantitative', domain: [13, 21.5] },
    y1: { type: 'quantitative', domain: [32, 60] }, y2: { type: 'quantitative', domain: [32, 60] },
    culmen_depth_mm: { type: 'quantitative' }, culmen_length_mm: { type: 'quantitative' },
  },
  data: [
    ...penguins.map(({ culmen_depth_mm, culmen_length_mm }) => ({ culmen_depth_mm, culmen_length_mm })),
    // Three boxes, stacked at the left to start.
    { species: 'Adelie', x1: 13.5, x2: 15, y1: 52, y2: 58 },
    { species: 'Chinstrap', x1: 13.5, x2: 15, y1: 44, y2: 50 },
    { species: 'Gentoo', x1: 13.5, x2: 15, y1: 36, y2: 42 },
  ],
  context: (d) => d.culmen_depth_mm != null,                //! the penguins are context
  axes: { x: { title: 'culmen_depth_mm →' }, y: { title: '↑ culmen_length_mm' } },
  legends: { fill: { anchor: 'right' } },
  marks: [
    point({
      size: 2, fill: '#64748b',
      channels: { x: { field: 'culmen_depth_mm' }, y: { field: 'culmen_length_mm' } },
    }),
    rect({
      fillOpacity: 0.25, strokeWidth: 2,
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' }, y1: { field: 'y1' }, y2: { field: 'y2' },
        fill: { field: 'species', scale: { scheme: 'tableau10' } },
        stroke: { field: 'species', scale: { scheme: 'tableau10' } },
      },
      edits: [brushRect({ edgeInset: 8 })],              //! edges, corners or body
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-voronoi-map',
  status: 'none',
  verdict: 'Voronoi cells of the state capitals on a clipped azimuthal projection, over a TopoJSON nation: Voronoi diagrams are out of scope for an elicitation library.',
  needs: ['delaunay', 'projection', 'topojson', 'clip', 'geo-transform'],
  prep: [],
  gaps: ['The cells also carry a title per state and `pointerEvents: all`, so the map is a hover lookup.'],
  alternative: 'Pin each capital on a `geoBasemap` with `edit.geo.create()`, from memory.',
});

GALLERY.add({
  id: 'plot-walmart-voronoi',
  status: 'none',
  verdict: 'A Voronoi mesh of 3,000 store locations over the US outline in Albers: Voronoi diagrams are out of scope for an elicitation library.',
  needs: ['delaunay', 'projection', 'topojson', 'dense-data'],
  prep: [],
  gaps: ['Plot computes the mesh in screen space after projecting; ElicitJS has no mark that draws planar segments over a projection.'],
  alternative: 'Ask where stores are densest with a `geoRect` per state and `edit.legend.category()` for a density band.',
});

GALLERY.add({
  id: 'plot-centroid-voronoi',
  status: 'none',
  verdict: 'Voronoi cells around the centroid of every US county under Albers: Voronoi diagrams are out of scope for an elicitation library.',
  needs: ['delaunay', 'geo-transform', 'projection', 'topojson'],
  prep: [],
  gaps: ['Over 3,000 counties; the cells are computed after projection.'],
});

GALLERY.add({
  id: 'plot-visionscarto-planar-vs-spherical-voronoi',
  status: 'none',
  verdict: 'Planar and spherical Voronoi diagrams of world airports compared under five projections: Voronoi diagrams are out of scope for an elicitation library, and multiple views are not covered by this study.',
  needs: ['delaunay', 'projection', 'geo-transform', 'concat'],
  prep: [],
  gaps: ['The notebook is a comparison of two Voronoi algorithms across projections, side by side.'],
});

// ════════════════════════════════════════════════════════════════════════════
// Tips and interactions
// ════════════════════════════════════════════════════════════════════════════

GALLERY.add({
  id: 'plot-crosshair',
  status: 'full',
  verdict: 'The 11,000-athlete weight × height scatter with `guides.crosshair()`: rules to both axes and their readouts follow the pointer, and the nearest athlete is lit.',
  needs: [],
  prep: ['prep-calculate'],
  gaps: [
    '`guides.crosshair()` follows the pointer itself; Plot’s snaps to the nearest athlete. The `hovered` outline marks that athlete instead.',
    'The highlight comes from `edit.select({ pick: \'nearest\' })`, which also makes a click select that athlete.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    sex: { type: 'categorical', domain: ['female', 'male'] },
  },
  data: olympians.map(({ weight, height, sex }) => ({ weight, height, sex })),
  axes: { x: { title: 'weight →' }, y: { title: '↑ height' } },
  effects: { hovered: { outline: { color: '#e8590c', width: 2, pad: 3 } } },
  guides: [guides.crosshair()],
  marks: [
    point({
      fill: 'none', size: 2.5,
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        stroke: { field: 'sex', scale: { scheme: 'tableau10' } },
      },
      // The nearest athlete lights up under the pointer.
      edits: [edit.select({ pick: 'nearest', threshold: 30 })],
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place the averages',
      question: 'Where do you think the average female and the average male Olympian sit, by weight and height?',
      try: 'Drag anywhere: the nearer of the two large dots follows the pointer, and the crosshair reads out its weight and height. The small dots are 400 athletes from the data.',
      why: '`move()` with `pick: \'nearest\'` grabs the closest editable mark from empty space, so a drag anywhere moves one of your two guesses. The athletes are `context`, drawn by their own `point` mark from their own columns, so they are never in the running. `guide: true` draws the catchment ring; `guides.crosshair()` reads out where you are.',
      uses: ['move()', 'pick: nearest', 'context', 'guides.crosshair()'],
      code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
const weight = { type: 'quantitative', domain: [25, 175] };
const height = { type: 'quantitative', domain: [1.2, 2.25] };
mount(Elicit({
  width: 460, height: 360,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    weight, height, sex: { type: 'categorical', domain: ['female', 'male'] },
    athleteWeight: weight, athleteHeight: height,
  },
  data: [
    ...olympians.filter((_, i) => i % 27 === 0)
      .map(({ weight, height, sex }) => ({ athleteWeight: weight, athleteHeight: height, sex })),
    { weight: 120, height: 1.4, sex: 'female' },
    { weight: 150, height: 1.4, sex: 'male' },
  ],
  context: (d) => d.athleteWeight != null,                  //! the athletes are context
  axes: { x: { title: 'weight →' }, y: { title: '↑ height' } },
  guides: [guides.crosshair({ format: '.2~f' })],           //! read off weight and height
  marks: [
    point({
      fill: 'none', size: 2.5,
      channels: { x: { field: 'athleteWeight' }, y: { field: 'athleteHeight' }, stroke: { field: 'sex', scale: { scheme: 'tableau10' } } },
    }),
    point({
      size: 8,
      channels: { x: { field: 'weight' }, y: { field: 'height' }, fill: { field: 'sex', scale: { scheme: 'tableau10' } } },
      edits: [move({ channels: ['x', 'y'], pick: 'nearest', threshold: 400, guide: true })],  //! grab the nearest guess
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-crosshairx',
  status: 'full',
  verdict: 'The Apple close as a `lineY` under `guides.crosshair()`, whose rules and date and price readouts follow the pointer, with the nearest day lit.',
  needs: [],
  prep: [],
  gaps: [
    '`crosshairX` snaps to the nearest date; `guides.crosshair()` follows the pointer, so the price readout is the y under the pointer, not that day’s close. The lit handle is the nearest day by 2-D distance.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  effects: { hovered: { outline: { color: 'currentColor', width: 1.5, pad: 3 } } },
  guides: [guides.crosshair({ format: (v) => (v instanceof Date ? d3.utcFormat('%Y-%m-%d')(v) : v.toFixed(2)) })],
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5, handles: 'hit',
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
      edits: [edit.select({ pick: 'nearest', threshold: 60 })],
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Point to the week',
      question: 'Looking at weekly closes, which week do you think saw Apple’s biggest one-week fall?',
      try: 'Move along the line: the nearest week lights up and the rule reads out its date. Click it to choose; click again to clear.',
      why: '`edit.select()` with `pick: \'nearest\'` turns the line’s handles into a pointer target you never have to hit exactly, and writes the answer as the chart’s SELECTION, not a data column: read it back with `getSelectionAll()`. `guides.crosshair({ y: false })` draws the date rule.',
      uses: ['edit.select()', 'pick: nearest', 'guides.crosshair()'],
      code: `const aapl = await plotData('aapl');
// Friday closes.
const weekly = d3.groups(aapl, (d) => +d3.utcWeek(d.Date)).map(([, rows]) => rows.at(-1))
  .map(({ Date, Close }) => ({ Date, Close }));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: weekly,
  effects: {
    hovered: { outline: { color: '#94a3b8', width: 1.5, pad: 4 } },
    selected: { outline: { color: '#e8590c', width: 2.5, pad: 5 } },  //! your pick stays ringed
  },
  guides: [guides.crosshair({ y: false, format: d3.utcFormat('%b %d, %Y') })],  //! a date readout
  marks: [
    lineY({
      strokeWidth: 1.5, handles: 'hit',
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
      edits: [edit.select({ pick: 'nearest', threshold: 40 })],  //! click the nearest week
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-one-dimensional-crosshair',
  status: 'full',
  verdict: 'The strip of penguin body masses is a `tickX`, with `guides.crosshair({ y: false })` drawing the red rule and its value readout under the pointer.',
  needs: [],
  prep: [],
  gaps: ['Plot’s rule snaps to the nearest tick; `guides.crosshair()` follows the pointer, so the readout is the mass under it.'],
  recreation: {
    code: `const penguins = (await plotData('penguins')).filter((d) => Number.isFinite(d.body_mass_g));
mount(Elicit({
  width: 460, height: 90,
  margins: { top: 10, right: 14, bottom: 30, left: 14 },
  schema: { body_mass_g: { type: 'quantitative', domain: [2700, 6300] } },
  data: penguins.map(({ body_mass_g }) => ({ body_mass_g })),
  axes: { x: { title: 'body_mass_g →' }, y: false },
  guides: [guides.crosshair({ y: false, stroke: 'red', strokeDash: 'none', format: ',.0f' })],
  marks: [tickX({ stroke: 'currentColor', channels: { x: { field: 'body_mass_g' } } })],
}));`,
  },
  interfaces: [
    {
      title: 'Stack the tokens',
      question: 'Before seeing the data: where do you think Gentoo penguins’ body masses fall? Spread 20 tokens over the bins.',
      try: 'Click above a bin to add a token, click a token to take it back. You have 20.',
      why: 'One row is one token, so `dotStack` stacks rows by bin and the count per bin is your probability. `create()` mints a token in the bin you click, `remove()` takes one away, and `count({ max: 20 })` fixes the budget.',
      uses: ['dotStack', 'create()', 'remove()', 'count()'],
      code: `const bins = d3.range(2750, 6300, 250);   // 250 g bins, by centre
mount(Elicit({
  width: 460, height: 260,
  margins: { top: 20, right: 14, bottom: 34, left: 14 },
  schema: { bin: { type: 'ordinal', domain: bins } },
  data: [],
  constraints: [count({ max: 20 })],                        //! a budget of 20 tokens
  axes: { x: { title: 'body mass (g) →', tickFormat: (d) => (d % 1000 === 0 ? d : '') }, y: false },
  marks: [
    dotStack({
      fill: '#e15759',
      channels: { x: { field: 'bin' } },
      edits: [create({ gesture: 'click', channels: ['x'] }), remove()],  //! add and take back tokens
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-color-crosshair',
  status: 'full',
  verdict: 'The penguin culmen scatter stroked by sex, with a crosshair that snaps to the nearest bird and takes its colour: a `guides.custom` with `tracksPointer` that reads `ui.pointer`.',
  needs: [],
  prep: [],
  gaps: [
    '`guides.crosshair()` takes one constant colour, so the sex-coloured, snapping crosshair is a 15-line `guides.custom` that finds the nearest bird itself.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm) && Number.isFinite(d.culmen_depth_mm));
const colours = { FEMALE: '#4e79a7', MALE: '#f28e2b', unknown: '#bab0ac' };
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 70, bottom: 30, left: 36 },
  schema: {
    culmen_length_mm: { type: 'quantitative', domain: [32, 60] },
    culmen_depth_mm: { type: 'quantitative', domain: [13, 21.5] },
    sex: { type: 'categorical', domain: ['FEMALE', 'MALE', 'unknown'] },
  },
  data: penguins.map((d) => ({ culmen_length_mm: d.culmen_length_mm, culmen_depth_mm: d.culmen_depth_mm, sex: d.sex || 'unknown' })),
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: '↑ culmen_depth_mm' } },
  legends: { stroke: { anchor: 'right' } },
  guides: [
    // The crosshair: rules from the nearest bird to each axis, in its sex's colour.
    guides.custom(({ ui, scales, data, height }) => {
      if (!ui.pointer) return [];
      const at = (d) => [scales.x.encode(d.culmen_length_mm), scales.y.encode(d.culmen_depth_mm)];
      const d = d3.least(data, (d) => { const [x, y] = at(d); return Math.hypot(x - ui.pointer.x, y - ui.pointer.y); });
      const [x, y] = at(d), ink = colours[d.sex];
      return [
        { type: 'line', x1: x, x2: x, y1: y, y2: height, stroke: ink, strokeOpacity: 0.5 },
        { type: 'line', x1: 0, x2: x, y1: y, y2: y, stroke: ink, strokeOpacity: 0.5 },
        { type: 'text', x, y: height - 4, text: String(d.culmen_length_mm), fill: ink, fontSize: 10, textAnchor: 'middle', stroke: 'white', strokeWidth: 3 },
        { type: 'text', x: 4, y: y - 4, text: String(d.culmen_depth_mm), fill: ink, fontSize: 10, stroke: 'white', strokeWidth: 3 },
      ];
    }, { tracksPointer: true }),
  ],
  marks: [
    point({
      fill: 'none', size: 3,
      channels: {
        x: { field: 'culmen_length_mm' }, y: { field: 'culmen_depth_mm' },
        stroke: { field: 'sex', scale: { range: Object.values(colours) } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sex the unknowns',
      question: 'Nine penguins were never sexed. From their bills, which do you think are female and which male?',
      try: 'Click near a large ring to cycle it through female, male and unknown. Sexed birds cannot change.',
      why: '`cycle()` with `pick: \'nearest\'` steps the closest bird’s `sex` through the schema’s domain. The sexed birds are `context`, drawn by their own `point` mark from their own columns, so a click near the cluster always lands on one of the nine. Each answer is a value in the `sex` column.',
      uses: ['cycle()', 'pick: nearest', 'context'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm) && Number.isFinite(d.culmen_depth_mm))
  .map((d) => ({ culmen_length_mm: d.culmen_length_mm, culmen_depth_mm: d.culmen_depth_mm, sex: d.sex || 'unknown' }));
const length = { type: 'quantitative', domain: [32, 60] };
const depth = { type: 'quantitative', domain: [13, 21.5] };
const sex = { field: 'sex', scale: { range: ['#9ca3af', '#4e79a7', '#f28e2b'] } };
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    culmen_length_mm: length, culmen_depth_mm: depth,
    sex: { type: 'categorical', domain: ['unknown', 'FEMALE', 'MALE'] },  //! the answers, in click order
    sexedLength: length, sexedDepth: depth,                 // the sexed birds' bills
  },
  data: [
    ...penguins.filter((d) => d.sex !== 'unknown')
      .map((d) => ({ sexedLength: d.culmen_length_mm, sexedDepth: d.culmen_depth_mm, sex: d.sex })),
    ...penguins.filter((d) => d.sex === 'unknown'),
  ],
  context: (d) => d.sexedLength != null,                    //! sexed birds are context
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: '↑ culmen_depth_mm' } },
  legends: { stroke: { anchor: 'top' } },
  marks: [
    point({
      fill: 'none', size: 3,
      channels: { x: { field: 'sexedLength' }, y: { field: 'sexedDepth' }, stroke: sex },
    }),
    point({
      fill: 'none', size: 6, strokeWidth: 2.5,
      channels: {
        x: { field: 'culmen_length_mm' }, y: { field: 'culmen_depth_mm' },
        stroke: { ...sex, edit: cycle({ pick: 'nearest', threshold: 40 }) },  //! click to classify
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-pointer-transform',
  status: 'partial',
  verdict: 'The penguin culmen scatter, with the big red dot that Plot’s pointer transform filters to the nearest penguin drawn by a `guides.custom` that tracks the pointer; the toggle is not bound.',
  needs: ['input-widgets'],
  prep: [],
  gaps: [
    '`Plot.pointer` filters a whole mark to the nearest datum; here a `guides.custom` with `tracksPointer` finds that penguin and draws the red dot behind it (`background: true`).',
    'The notebook’s toggle between pointered and static is not bound.',
  ],
  recreation: {
    code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm) && Number.isFinite(d.culmen_depth_mm));
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    culmen_length_mm: { type: 'quantitative', domain: [32, 60] },
    culmen_depth_mm: { type: 'quantitative', domain: [13, 21.5] },
  },
  data: penguins.map(({ culmen_length_mm, culmen_depth_mm }) => ({ culmen_length_mm, culmen_depth_mm })),
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: '↑ culmen_depth_mm' } },
  guides: [
    // The red dot: drawn only at the penguin nearest the pointer, behind the marks.
    guides.custom(({ ui, scales, data }) => {
      if (!ui.pointer) return [];
      const at = (d) => [scales.x.encode(d.culmen_length_mm), scales.y.encode(d.culmen_depth_mm)];
      const d = d3.least(data, (d) => { const [x, y] = at(d); return Math.hypot(x - ui.pointer.x, y - ui.pointer.y); });
      const [cx, cy] = at(d);
      return [{ type: 'circle', cx, cy, r: 8, fill: 'red', background: true }];
    }, { tracksPointer: true }),
  ],
  marks: [
    point({
      fill: 'none', stroke: 'currentColor', size: 3,
      channels: { x: { field: 'culmen_length_mm' }, y: { field: 'culmen_depth_mm' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Strike the errors',
      question: 'Five of these measurements were corrupted in data entry. Which do you think they are?',
      try: 'Click near a penguin to remove it from the dataset. Use Undo (Cmd/Ctrl-Z) if you change your mind.',
      why: '`remove()` with `pick: \'nearest\'` deletes the closest row from empty space, so even a crowded cluster is easy to edit; the rows left are your cleaned dataset. The pointer’s target is lit before you click (`hovered`), which is the job Plot’s pointer transform does.',
      uses: ['remove()', 'pick: nearest', 'effects.hovered'],
      code: `const penguins = (await plotData('penguins'))
  .filter((d) => Number.isFinite(d.culmen_length_mm) && Number.isFinite(d.culmen_depth_mm));
// Every eighth bird, plus five with their two measurements swapped between species.
const rows = penguins.filter((_, i) => i % 8 === 0)
  .map(({ culmen_length_mm, culmen_depth_mm }) => ({ culmen_length_mm, culmen_depth_mm }));
[[34.1, 20.9], [58.0, 14.1], [37.0, 13.8], [55.2, 20.6], [44.0, 21.2]]
  .forEach(([l, d], k) => rows.splice(5 + k * 7, 0, { culmen_length_mm: l, culmen_depth_mm: d }));
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    culmen_length_mm: { type: 'quantitative', domain: [32, 60] },
    culmen_depth_mm: { type: 'quantitative', domain: [13, 21.5] },
  },
  data: rows,
  axes: { x: { title: 'culmen_length_mm →' }, y: { title: '↑ culmen_depth_mm' } },
  effects: { hovered: { fill: 'red', outline: { color: 'red', width: 2, pad: 3 } } },
  marks: [
    point({
      fill: 'currentColor', size: 3.5,
      channels: { x: { field: 'culmen_length_mm' }, y: { field: 'culmen_depth_mm' } },
      edits: [remove({ pick: 'nearest', threshold: 30 })],  //! a click deletes the nearest row
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-pointer-modes-x-y-and-xy',
  status: 'partial',
  verdict: 'The Apple `lineY` with a `tip` on every day; the select between Plot’s three pointer modes (nearest by x, by y, or by both) is missing.',
  needs: ['input-widgets'],
  prep: [],
  gaps: [
    'The tip shows for the day under the pointer: `handles: \'hit\'` gives each day an invisible target, since a plain line is one path.',
    'Plot’s `x`/`y`/`xy` modes choose the nearest point along one axis or in 2-D; the tip here needs the pointer on the line, and the mode select is not bound.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      handles: 'hit', tip: { text: ['Date', 'Close'], format: '.2f' },
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Fit the trend',
      question: 'If you had to summarize 2013–2018 with one straight line, where would it start and how steep would it be?',
      try: 'Drag the left handle to set where the line starts, then the right handle to tilt it.',
      why: 'A `trend` is two parameters, not rows of points: `edit.trend.intercept()` sets the value at the anchor (the start of 2013) and `edit.trend.slope()` tilts the line about it, so the answer is `{ intercept, slope }` in dollars and dollars per year. The price is `context`, drawn by the recreation’s `lineY`.',
      uses: ['trend', 'edit.trend.intercept()', 'edit.trend.slope()', 'context'],
      code: `const aapl = await plotData('aapl');
// x is years since 2013, so the intercept is the price at the start of 2013.
const yearsOf = (date) => (date - new Date('2013-01-01')) / (365.25 * 864e5);
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    x: { type: 'quantitative', domain: [0, 5.5] },
    y: { type: 'quantitative', domain: [0, 220] },
    intercept: { type: 'quantitative' },
    slope: { type: 'quantitative' },
  },
  data: [
    ...aapl.map((d) => ({ x: yearsOf(d.Date), y: d.Close })),
    { intercept: 120, slope: 0 },                           // a flat start
  ],
  context: (d) => d.y != null,                              //! the price is context
  axes: { origin: false, x: { tickFormat: (d) => 2013 + d, ticks: 6 } },
  marks: [
    lineY({
      stroke: '#94a3b8', strokeWidth: 1.2,
      channels: { x: { field: 'x' }, y: { field: 'y' } },
    }),
    trend({
      stroke: '#e8590c', strokeWidth: 2.5,
      channels: {
        intercept: { field: 'intercept', edit: edit.trend.intercept() },  //! the level
        slope: { field: 'slope', edit: edit.trend.slope() },              //! the tilt
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-multi-series-line-chart-interactive-tips',
  status: 'full',
  verdict: 'Unemployment by industry as one `lineY` grouped by the `series` channel and coloured by industry, with a `tip` naming the industry, date and count under the pointer.',
  needs: [],
  prep: [],
  gaps: [
    'Plot’s `tip: "x"` finds the nearest date anywhere in the chart; here the tip shows when the pointer is on a line, through `handles: \'hit\'`.',
    'The zero rule is a `guides.rule`.',
  ],
  recreation: {
    code: `const industries = await plotData('industries');
mount(Elicit({
  width: 470, height: 320,
  margins: { top: 14, right: 14, bottom: 26, left: 40 },
  schema: {
    date: { type: 'temporal' },
    industry: { type: 'categorical' },
    unemployed: { type: 'quantitative', domain: [0, 2500] },
  },
  data: industries.map(({ date, industry, unemployed }) => ({ date, industry, unemployed })),
  guides: [guides.rule({ y: 0, stroke: 'currentColor', strokeDash: 'none', opacity: 1 })],
  marks: [
    lineY({
      strokeWidth: 1.5, handles: 'hit', tip: ['industry', 'date', 'unemployed'],
      channels: {
        series: { field: 'industry' }, x: { field: 'date' }, y: { field: 'unemployed' },
        stroke: { field: 'industry', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Add the missing line',
      question: 'Construction is missing. How do you think the number of unemployed construction workers moved from 2000 to 2010?',
      try: 'Double-click the chart to add a line, then sweep across it to shape it.',
      why: '`edit.line.newSeries()` mints a whole series on a double-click, one row per quarter in `samples`, keyed by the schema’s next declared `industry`: Construction. The three given industries are `context`, so the sweep (`move({ pick: \'sweep\' })`) can only paint yours.',
      uses: ['edit.line.newSeries()', 'move({ pick: \'sweep\' })', 'context', 'series'],
      code: `const industries = await plotData('industries');
const shown = ['Wholesale and Retail Trade', 'Manufacturing', 'Leisure and hospitality'];
const date = { type: 'temporal', domain: [new Date('2000-01-01'), new Date('2010-02-01')] };
const unemployed = { type: 'quantitative', domain: [0, 2500] };
mount(Elicit({
  width: 470, height: 320,
  margins: { top: 14, right: 14, bottom: 26, left: 40 },
  schema: {
    date, unemployed,
    industry: { type: 'categorical', domain: ['Construction', ...shown] },  //! Construction is the line you add
  },
  data: industries.filter((d) => shown.includes(d.industry))
    .map(({ date, industry, unemployed }) => ({ date, industry, unemployed })),
  context: true,                                            //! the given industries are context
  marks: [
    lineY({
      strokeWidth: 2, handles: 'hit',                       // grabbable, not drawn
      channels: {
        series: { field: 'industry' }, x: { field: 'date' },
        y: { field: 'unemployed', edit: move({ pick: 'sweep' }) },  //! sweep to shape it
        stroke: { field: 'industry', scale: { scheme: 'tableau10' } },
      },
      edits: [edit.line.newSeries({                         //! a double-click seeds a line
        along: 'x', value: 'y', series: 'industry',
        samples: d3.utcMonth.every(3).range(new Date('2000-01-01'), new Date('2010-02-01')),
      })],
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-one-dimensional-pointing',
  status: 'partial',
  verdict: 'The histogram of Apple’s log₁₀ daily volume is a `rectY` over 40 bins computed with `d3.bin`, with a `tip` on each bar and a red dot at each bar’s centroid; one-dimensional pointing and its toggle, which are the example, are missing.',
  needs: ['input-widgets'],
  prep: ['prep-bin', 'prep-calculate'],
  gaps: [
    'Plot’s `x` tip mode shows a bar’s tip with the pointer anywhere in its column; here the pointer has to be on the bar, which is the `xy` behaviour the example contrasts it with.',
    'The radio toggle between the two modes is not bound.',
    'The centroids are computed in prep (`xm`, `ym`) and drawn by a `point` mark over the same rows.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
const bins = d3.bin().thresholds(40)(aapl.map((d) => Math.log10(d.Volume)));
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    x1: { type: 'quantitative', domain: [bins[0].x0, bins.at(-1).x1] },
    x2: { type: 'quantitative' },
    count: { type: 'quantitative', domain: [0, 120] },
    xm: { type: 'quantitative' }, ym: { type: 'quantitative' },
  },
  // Each bin, plus its centroid (the red dots Plot stacks at the middle of each bar).
  data: bins.map((b) => ({ x1: b.x0, x2: b.x1, count: b.length, xm: (b.x0 + b.x1) / 2, ym: b.length / 2 })),
  axes: { x: { title: 'Daily volume (log₁₀) →' }, y: { grid: true, title: '↑ Frequency' } },
  marks: [
    rectY({
      fill: 'currentColor', fillOpacity: 0.85, stroke: '#fff', strokeWidth: 0.5,
      tip: { text: (d) => ['Daily volume (log₁₀): ' + d.x1.toFixed(2) + '–' + d.x2.toFixed(2), 'Frequency: ' + d.count] },
      channels: { x1: { field: 'x1' }, x2: { field: 'x2' }, y: { field: 'count' } },
    }),
    point({ fill: 'none', stroke: 'red', size: 3, channels: { x: { field: 'xm' }, y: { field: 'ym' } } }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Shape the histogram',
      question: 'Out of 100 trading days, how many do you think fall in each band of daily volume?',
      try: 'Drag each bar up or down. The bars always add up to 100 days.',
      why: '`move()` on a `rectY`’s `y` sets each bin’s count, and `maintainSum({ total: 100, strategy: \'redistribute\' })` spreads every change across the other bins, so the bars stay a distribution of 100 days whatever you drag.',
      uses: ['move()', 'rectY', 'maintainSum()'],
      code: `// Ten bands of log₁₀ volume, 7.0 to 8.5, seeded flat.
const edges = d3.range(7, 8.51, 0.15);
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    x1: { type: 'quantitative', domain: [7, 8.5] },
    x2: { type: 'quantitative' },
    days: { type: 'quantitative', domain: [0, 50] },
  },
  data: edges.slice(0, -1).map((x1, i) => ({ x1, x2: edges[i + 1], days: 10 })),
  constraints: [clamp({ min: 0 }), maintainSum({ total: 100, strategy: 'redistribute' })],  //! always 100 days
  axes: { x: { title: 'Daily volume (log₁₀) →' }, y: { grid: true } },
  marks: [
    rectY({
      fill: '#e15759', stroke: '#fff',
      channels: {
        x1: { field: 'x1' }, x2: { field: 'x2' },
        y: { field: 'days', edit: move({ guide: true }) },  //! drag a bin
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-pointer-target-position',
  status: 'full',
  verdict: 'The Apple line with a right-hand y axis; the red rule, dot and “Date … Close …” readout at the day nearest the pointer are a `guides.custom` that tracks the pointer.',
  needs: [],
  prep: [],
  gaps: [
    'Plot’s `pointerX` filters a rule, a dot and a text mark to the nearest day; here one `guides.custom` with `tracksPointer` bisects the rows by date and draws all three, the text pinned above the frame’s top-left.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
const nearestX = d3.bisector((d) => d.Date).center;
mount(Elicit({
  width: 470, height: 180,
  margins: { top: 24, right: 40, bottom: 26, left: 10 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: { y: { anchor: 'right', grid: true, ticks: 4 } },
  guides: [
    // pointerX: the day nearest the pointer along x, as a rule, a dot and a readout.
    guides.custom(({ ui, scales, data, height }) => {
      if (!ui.pointer) return [];
      const d = data[nearestX(data, scales.x.invertValue(ui.pointer.x))];
      const x = scales.x.encode(d.Date), y = scales.y.encode(d.Close);
      return [
        { type: 'line', x1: x, x2: x, y1: 0, y2: height, stroke: 'red' },
        { type: 'circle', cx: x, cy: y, r: 3, fill: 'none', stroke: 'red', strokeWidth: 1.5 },
        { type: 'text', x: 0, y: -8, fontSize: 10, fill: 'currentColor',
          text: 'Date ' + d3.utcFormat('%Y-%m-%d')(d.Date) + ' \u2003Close ' + d.Close.toFixed(2) },
      ];
    }, { tracksPointer: true }),
  ],
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
      title: 'Call the next high',
      question: 'When do you think Apple will next set a record close after May 2018, and at what price?',
      try: 'Drag the red dot anywhere to the right of the line; the readout follows it.',
      why: 'The answer is one row with two columns, so `move()` on both `x` and `y` of a `point` sets the date and the price together, and a `text` mark over the same row is the readout Plot draws with `pointerX`. `clamp()` keeps the date after the data ends. The price history is `context`, in its own `day` and `price` columns.',
      uses: ['move()', 'clamp()', 'text', 'context'],
      code: `const aapl = await plotData('aapl');
const fmt = d3.utcFormat('%b %Y');
mount(Elicit({
  width: 470, height: 260,
  margins: { top: 20, right: 40, bottom: 26, left: 10 },
  schema: {
    Date: { type: 'temporal', domain: [new Date('2013-05-13'), new Date('2020-12-31')] },
    Close: { type: 'quantitative', domain: [50, 300] },
    day: { type: 'temporal' }, price: { type: 'quantitative' },  // the price history
  },
  data: [
    ...aapl.map(({ Date, Close }) => ({ day: Date, price: Close })),
    { Date: new Date('2019-06-01'), Close: 200 },
  ],
  context: (d) => d.price != null,                          //! the price history is context
  constraints: [clamp({ field: 'Date', min: new Date('2018-05-14') })],  //! after the last close
  axes: { y: { anchor: 'right', grid: true, ticks: 5 } },
  marks: [
    lineY({
      stroke: '#64748b', strokeWidth: 1.2,
      channels: { x: { field: 'day' }, y: { field: 'price' } },
    }),
    point({
      fill: 'red', size: 6,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
      edits: [move({ channels: ['x', 'y'] })],              //! date and price in one drag
    }),
    text({
      fill: 'red', fontSize: 11, dy: -12, lineAnchor: 'bottom',
      channels: {
        x: { field: 'Date' }, y: { field: 'Close' },
        text: { fn: (d) => fmt(d.Date) + '   $' + d.Close.toFixed(0) },  //! the readout
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-line-chart-interactive-tip',
  status: 'full',
  verdict: 'The Apple `lineY` with a y grid and a `tip` showing the date and close under the pointer.',
  needs: [],
  prep: [],
  gaps: ['Plot’s `pointerX` tip finds the nearest date anywhere in the chart; here the pointer has to be on the line, where `handles: \'hit\'` gives each day an invisible target.'],
  recreation: {
    code: `const aapl = await plotData('aapl');
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
  },
  data: aapl.map(({ Date, Close }) => ({ Date, Close })),
  axes: { y: { grid: true, title: '↑ Close' } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      handles: 'hit', tip: { text: ['Date', 'Close'], format: '.2f' },
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Sweep the gap',
      question: 'The second half of 2016 is missing. How do you think Apple’s weekly close moved through it?',
      try: 'Sweep the pointer across the gap to paint the line.',
      why: '`move({ pick: \'sweep\' })` writes every handle the pointer crosses, so one stroke paints a whole stretch. `lock` keeps the observed weeks fixed; the hidden weeks start on a straight line between the two ends of the gap.',
      uses: ['move({ pick: \'sweep\' })', 'lock', 'guides.region()'],
      code: `const aapl = await plotData('aapl');
const weekly = d3.groups(aapl, (d) => +d3.utcWeek(d.Date)).map(([, rows]) => rows.at(-1))
  .map(({ Date, Close }) => ({ Date, Close, given: true }));
const a = new Date('2016-07-01'), b = new Date('2016-12-31');
const before = weekly.filter((d) => d.Date < a).at(-1), after = weekly.find((d) => d.Date > b);
const t = d3.scaleTime([before.Date, after.Date], [before.Close, after.Close]);
weekly.forEach((d) => { if (d.Date >= a && d.Date <= b) { d.given = false; d.Close = +t(d.Date).toFixed(2); } });
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' },
    Close: { type: 'quantitative', domain: [50, 200] },
    given: { type: 'categorical', domain: [true, false] },
  },
  data: weekly,
  lock: (d) => d.given,                                     //! observed weeks are fixed
  axes: { y: { grid: true } },
  guides: [guides.region({ x: [a, b], fill: '#e8590c', opacity: 0.08 })],
  marks: [
    lineY({
      strokeWidth: 1.5, handleSize: 2,
      channels: {
        x: { field: 'Date' },
        y: { field: 'Close', edit: move({ pick: 'sweep' }) },  //! paint by sweeping
      },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-static-annotations',
  status: 'full',
  verdict: 'The Apple line carries two notes at the dates they describe: each is a `sticker` box over context rows of notes, joined to its day’s close by a short `ruleX` leader.',
  needs: [],
  prep: [],
  gaps: [
    'Plot’s tip box has a pointer at the anchored point; here a `ruleX` from the close to the box stands in for it.',
    'A sticker centres its box on `y`, so each note carries a `boxY` placed by hand just above the high or below the low; the text is centred where Plot’s is left-aligned.',
  ],
  recreation: {
    code: `const aapl = await plotData('aapl');
// Each note: the point it describes, and where its box sits (above the high, below the low).
const notes = [
  { noteDate: new Date('2015-02-23'), noteClose: 133, boxY: 153,
    note: 'Apple stock reaches a new high of $133 on Feb. 23, 2015. The release of the first Apple Watch, slated for April, is hotly anticipated.' },
  { noteDate: new Date('2016-05-12'), noteClose: 90.34, boxY: 67,
    note: 'Apple stock drops 8% after the company misses Q2 revenue targets and reports declining iPhone sales. It reaches a two-year low of $90.34 on May 12.' },
];
mount(Elicit({
  width: 470, height: 340,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    Date: { type: 'temporal' }, Close: { type: 'quantitative', domain: [50, 200] },
    noteDate: { type: 'temporal' }, noteClose: { type: 'quantitative' }, boxY: { type: 'quantitative' },
    note: { type: 'categorical' },
  },
  data: [...notes, ...aapl.map(({ Date, Close }) => ({ Date, Close }))],
  context: (d) => d.note != null,
  axes: { y: { grid: true, title: '↑ Close' } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    // The leader, then the box: a sticker sizes its box to the wrapped text.
    ruleX({ stroke: '#9ca3af', channels: { x: { field: 'noteDate' }, y1: { field: 'noteClose' }, y2: { field: 'boxY' } } }),
    sticker({
      fill: 'white', stroke: '#9ca3af', fontSize: 10, maxWidth: 220,
      channels: { x: { field: 'noteDate' }, y: { field: 'boxY' }, text: { field: 'note' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Write the note',
      question: 'Something happened to Apple in early 2016. What do you think it was, and when?',
      try: 'Drag the note to the moment you mean, then double-click it to write your explanation.',
      why: 'The note is the one row of the elicited table: `editText()` on the `sticker` writes its `note` column and `move()` its `nx`/`ny` columns, so its position and its text are both data. The price is `context`, read-only and absent from `getData()`.',
      uses: ['sticker', 'editText()', 'move()', 'context'],
      code: `const aapl = await plotData('aapl');
const weekly = d3.groups(aapl, (d) => +d3.utcWeek(d.Date)).map(([, rows]) => rows.at(-1))
  .map(({ Date, Close }) => ({ Date, Close }));
mount(Elicit({
  width: 470, height: 320,
  margins: { top: 14, right: 14, bottom: 26, left: 36 },
  schema: {
    nx: { type: 'temporal', domain: [new Date('2013-05-01'), new Date('2018-06-01')] },
    ny: { type: 'quantitative', domain: [50, 200] },
    note: { type: 'categorical', open: true },
    Date: { type: 'temporal' }, Close: { type: 'quantitative' },
  },
  data: [...weekly, { nx: new Date('2014-06-01'), ny: 170, note: 'Double-click to explain' }],
  context: (d) => d.Close != null,                          //! the price is context
  axes: { y: { grid: true, title: '↑ Close' } },
  marks: [
    lineY({
      stroke: 'currentColor', strokeWidth: 1.5,
      channels: { x: { field: 'Date' }, y: { field: 'Close' } },
    }),
    sticker({
      fill: 'white', stroke: '#e8590c', fontSize: 11, maxWidth: 160,
      channels: {
        x: { field: 'nx', edit: move({ channels: ['x', 'y'], mode: 'relative' }) },  //! drag it to the moment
        y: { field: 'ny' }, text: { field: 'note' },
      },
      edits: [editText({ multiline: true })],               //! type the explanation
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-tips-longer-text',
  status: 'partial',
  verdict: 'The weight × height scatter with the 131 athletes who have a biography drawn dark on top, and a `tip` that shows each one’s name and biography. Faceting is not covered by this study, so both sexes share one panel.',
  needs: ['facet'],
  prep: ['prep-calculate'],
  gaps: [
    'Plot facets the scatter by sex (`fy`); here both sexes share one panel.',
    'A tip line does not wrap, so the biography is wrapped with `authoring.wrapText` inside the tip’s `text` function.',
    'Plot’s tip snaps to the nearest athlete with a biography; here it shows when the pointer is on one.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
// Biographies last, so they paint on top (Plot's sort).
const rows = d3.sort(olympians, (d) => !!d.info)
  .map(({ weight, height, name, info }) => ({ weight, height, name, info: info || '', bio: info ? 'yes' : 'no' }));
const wrap = (s) => authoring.wrapText(s, { maxWidth: 240, fontSize: 11 });
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    bio: { type: 'categorical', domain: ['no', 'yes'] },
    name: { type: 'categorical' }, info: { type: 'categorical' },
  },
  data: rows,
  axes: { x: { title: 'weight →', grid: true }, y: { grid: true, title: '↑ height' } },
  marks: [
    point({
      fill: 'none', size: 2.5,
      // The name, then the biography; an athlete with none shows no tip.
      tip: { text: (d) => (d.info ? [d.name, ...wrap(d.info)] : '') },
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        stroke: { field: 'bio', scale: { range: ['#aaaaaa', 'currentColor'] } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Guess the sport',
      question: 'Six athletes with biographies, by weight and height. Which sport do you think each one competes in?',
      try: 'Click a dark dot to select it, then click a sport in the legend. Each sport is used once.',
      why: '`edit.select()` picks the athlete and `edit.legend.category()` writes the swatch you click into that row’s `sport`, so the legend is the answer sheet. A `constraints.custom` rejects any answer that gives two athletes one sport. The grey crowd is `context`, in columns of its own, so it has no `sport` to count.',
      uses: ['edit.select()', 'edit.legend.category()', 'constraints.custom()', 'context'],
      code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
const sports = ['gymnastics', 'athletics', 'rowing', 'tennis', 'volleyball', 'weightlifting'];
// One athlete with a biography per sport, sport hidden.
const six = sports.map((s) => olympians.find((d) => d.info && d.sport === s))
  .map(({ weight, height }) => ({ weight, height, sport: null }));
const weight = { type: 'quantitative', domain: [25, 175] };
const height = { type: 'quantitative', domain: [1.2, 2.25] };
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    weight, height, sport: { type: 'categorical', domain: sports },
    crowdWeight: weight, crowdHeight: height,               // the grey crowd
  },
  data: [
    ...olympians.filter((_, i) => i % 6 === 0).map((d) => ({ crowdWeight: d.weight, crowdHeight: d.height })),
    ...six,
  ],
  context: (d) => d.crowdWeight != null,                    //! the crowd is context
  // One athlete per sport. (\`unique()\` would count the unanswered nulls as one key.)
  constraints: [constraints.custom(({ data }) => {          //! one athlete per sport
    const named = data.map((d) => d.sport).filter((s) => s != null);
    return new Set(named).size === named.length ? undefined : false;
  })],
  axes: { x: { title: 'weight →', grid: true }, y: { grid: true, title: '↑ height' } },
  legends: { fill: { anchor: 'right' } },
  theme: { marks: { point: { fill: '#334155' } } },         // an unanswered athlete is dark
  marks: [
    point({
      size: 1.5, fill: '#d4d4d8',
      channels: { x: { field: 'crowdWeight' }, y: { field: 'crowdHeight' } },
    }),
    point({
      size: 7, stroke: '#fff', strokeWidth: 1.5,
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        fill: { field: 'sport', scale: { scheme: 'tableau10' },
                edit: edit.legend.category() },             //! a swatch click names the sport
      },
      edits: [edit.select()],                               //! choose the athlete
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-tips-additional-channels',
  status: 'full',
  verdict: 'The weight × height scatter stroked by sex, with a `tip` that lists each athlete’s name and sport beside the drawn channels.',
  needs: [],
  prep: [],
  gaps: [
    'Plot’s `channels: { name, sport }` adds fields only the tip shows; here they are ordinary columns of the table, named in `tip`.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    sex: { type: 'categorical', domain: ['female', 'male'] },
    name: { type: 'categorical' }, sport: { type: 'categorical' },
  },
  data: olympians.map(({ weight, height, sex, name, sport }) => ({ weight, height, sex, name, sport })),
  axes: { x: { title: 'weight →' }, y: { title: '↑ height' } },
  marks: [
    point({
      fill: 'none', size: 2.5,
      tip: ['weight', 'height', 'sex', 'name', 'sport'],    // name and sport are drawn nowhere else
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        stroke: { field: 'sex', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Place four athletes',
      question: 'Where do you think a typical male gymnast, basketball player, rower and weightlifter sit by weight and height?',
      try: 'Drag each labelled dot to where you think that athlete sits.',
      why: 'Each sport is one row; `move()` on `x` and `y` writes its weight and height, and a `text` mark over the same rows labels it, so the label travels with the dot. The crowd behind is `context`, in its own `crowdWeight`/`crowdHeight` columns, with a `tip` naming each athlete’s sport, so you can check your guesses against real rowers and gymnasts; a tip never blocks a drag.',
      uses: ['move()', 'text', 'context', 'tip'],
      code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height) && d.sex === 'male');
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 36 },
  schema: {
    sport: { type: 'categorical' },
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    name: { type: 'categorical' },
    crowdWeight: { type: 'quantitative' }, crowdHeight: { type: 'quantitative' },  // the crowd
  },
  data: [
    ...olympians.filter((_, i) => i % 4 === 0)
      .map(({ name, sport, weight, height }) => ({ name, sport, crowdWeight: weight, crowdHeight: height })),
    // All four start stacked in an empty corner.
    ...['gymnastics', 'basketball', 'rowing', 'weightlifting'].map((sport, i) =>
      ({ sport, weight: 150, height: 1.35 + i * 0.07 })),
  ],
  context: (d) => d.crowdWeight != null,                    //! the crowd is context
  axes: { x: { title: 'weight →' }, y: { title: '↑ height' } },
  marks: [
    point({
      size: 2, fill: '#d4d4d8',
      tip: ['name', 'sport'],                               //! hover the crowd for a hint
      channels: { x: { field: 'crowdWeight' }, y: { field: 'crowdHeight' } },
    }),
    point({
      size: 6, fill: '#f28e2b',
      channels: { x: { field: 'weight' }, y: { field: 'height' } },
      edits: [move({ channels: ['x', 'y'] })],              //! drag weight and height together
    }),
    text({
      fontSize: 11, textAnchor: 'start', dx: 9,
      channels: { x: { field: 'weight' }, y: { field: 'height' }, text: { field: 'sport' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-tip-format',
  status: 'full',
  verdict: 'The same scatter with a formatted `tip`: a `text` function sets which columns show, in what order, under which label and with which units.',
  needs: [],
  prep: [],
  gaps: ['Plot’s `format` object maps channel names to formatters; here one `text` function returns the lines, which covers the order, the “country” relabel and the `kg`/`m` units.'],
  recreation: {
    code: `const olympians = (await plotData('olympians'))
  .filter((d) => Number.isFinite(d.weight) && Number.isFinite(d.height));
mount(Elicit({
  width: 460, height: 340,
  margins: { top: 14, right: 14, bottom: 30, left: 40 },
  schema: {
    weight: { type: 'quantitative', domain: [25, 175] },
    height: { type: 'quantitative', domain: [1.2, 2.25] },
    sex: { type: 'categorical', domain: ['female', 'male'] },
    name: { type: 'categorical' }, sport: { type: 'categorical' }, nationality: { type: 'categorical' },
  },
  data: olympians.map(({ weight, height, sex, name, sport, nationality }) => ({ weight, height, sex, name, sport, nationality })),
  axes: { x: { title: 'weight →' }, y: { title: '↑ height' } },
  marks: [
    point({
      fill: 'none', size: 2.5,
      // Which columns, in what order, relabelled and with units; sex is left out.
      tip: { text: (d) => [
        'name: ' + d.name, 'sport: ' + d.sport, 'country: ' + d.nationality,
        'height: ' + d.height + 'm', 'weight: ' + d.weight + 'kg',
      ] },
      channels: {
        x: { field: 'weight' }, y: { field: 'height' },
        stroke: { field: 'sex', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Rank by height',
      question: 'Order these six sports by the average height of their Olympians, tallest at the top.',
      try: 'Drag a sport’s dot up or down; the others shift to make room.',
      why: '`rank()` on the dot’s `y` inverts the pointer to a slot on the rank axis and inserts the dragged row there, shifting the rows between, so the ranks stay a permutation however you drag. The dots are the recreation’s hollow circles; the names are an inert `text` mark over the same rows. The answer is the `rank` column.',
      uses: ['rank()', 'point', 'text'],
      code: `const sports = ['aquatics', 'archery', 'basketball', 'gymnastics', 'rowing', 'weightlifting'];
mount(Elicit({
  width: 360, height: 260,
  margins: { top: 10, right: 10, bottom: 10, left: 40 },
  schema: {
    sport: { type: 'categorical', domain: sports },
    rank: { type: 'ordinal', domain: [6, 5, 4, 3, 2, 1] },   // 1 at the top
  },
  data: sports.map((sport, i) => ({ sport, rank: i + 1 })),  // alphabetical to start
  axes: { x: false, y: { title: '' } },
  marks: [
    point({
      // A hollow dot, as in the scatter; a clear fill keeps its middle grabbable.
      size: 7, fill: '#4e79a7', fillOpacity: 0, stroke: '#4e79a7', strokeWidth: 2.5,
      channels: { x: { value: 20 }, y: { field: 'rank', edit: rank() } },  //! drag a dot to a slot
    }),
    text({
      fontSize: 13, textAnchor: 'start', dx: 16,
      channels: { x: { value: 20 }, y: { field: 'rank' }, text: { field: 'sport' } },
    }),
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-tips-paired-channels',
  status: 'full',
  verdict: 'The histogram of weights stacked by sex is a stacked `barY` over 5 kg bins, with a `tip` that pairs each bar’s bin edges into one weight range beside its sex and count.',
  needs: [],
  prep: ['prep-bin'],
  gaps: [
    'The tip’s range comes from a `text` function (`bin` to `bin + 5`); Plot pairs `x1`/`x2` on its own.',
    'Bins are band categories (each bar labelled by its lower edge), so the x axis is not a continuous weight scale.',
    'The notebook’s other chart mirrors the sexes about zero (`y` signed by sex); only the stacked version is recreated here, and the interface below builds the mirror.',
    'Bins are 5 kg wide where Plot’s automatic thresholds are narrower.',
  ],
  recreation: {
    code: `const olympians = (await plotData('olympians')).filter((d) => Number.isFinite(d.weight));
const edges = d3.range(30, 175, 5);
const rows = [];
for (const sex of ['female', 'male']) {
  const bins = d3.bin().domain([30, 175]).thresholds(edges)(olympians.filter((d) => d.sex === sex).map((d) => d.weight));
  bins.forEach((b) => rows.push({ bin: b.x0, sex, count: b.length }));
}
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 14, right: 14, bottom: 30, left: 40 },
  schema: {
    bin: { type: 'ordinal', domain: edges },
    sex: { type: 'categorical', domain: ['female', 'male'] },
    count: { type: 'quantitative', domain: [0, 1400] },
  },
  data: rows,
  axes: { x: { title: 'weight →', tickFormat: (d) => (d % 20 === 0 ? d : '') }, y: { grid: true } },
  marks: [
    barY({
      stack: true,
      tip: { text: (d) => ['weight: ' + d.bin + '–' + (d.bin + 5), 'sex: ' + d.sex, 'frequency: ' + d.count] },
      channels: {
        x: { field: 'bin', scale: { padding: 0.05 } }, y: { field: 'count' },
        series: { field: 'sex' },
        fill: { field: 'sex', scale: { scheme: 'tableau10' } },
      },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Mirror the sexes',
      question: 'How do you think the weights of female and male Olympians are distributed, band by band?',
      try: 'Drag the orange bars up for men and the blue bars down for women: taller means more athletes in that band.',
      why: 'Each band is one row with a `male` and a `female` column, and two `barY` marks read one each, so one table draws the mirror. Each mark carries its own `move()`, and a `clamp()` per column keeps men above zero and women below it.',
      uses: ['move()', 'clamp()', 'barY'],
      code: `const bands = d3.range(40, 140, 10);
mount(Elicit({
  width: 470, height: 320,
  margins: { top: 14, right: 14, bottom: 30, left: 40 },
  schema: {
    band: { type: 'ordinal', domain: bands },
    male: { type: 'quantitative', domain: [-40, 40] },
    female: { type: 'quantitative', domain: [-40, 40] },
  },
  data: bands.map((band) => ({ band, male: 5, female: -5 })),    // low and flat to start
  constraints: [
    clamp({ field: 'male', min: 0 }), clamp({ field: 'female', max: 0 }),  //! each side of zero
  ],
  axes: { x: { title: 'weight (kg) →' }, y: { grid: true, tickFormat: (d) => Math.abs(d) } },
  marks: [
    barY({ fill: '#f28e2b', channels: { x: { field: 'band' }, y: { field: 'male', edit: move() } } }),  //! men up
    barY({ fill: '#4e79a7', channels: { x: { field: 'band' }, y: { field: 'female', edit: move() } } }),  //! women down
  ],
}));`,
    },
  ],
});

GALLERY.add({
  id: 'plot-maps-tips',
  status: 'full',
  verdict: 'US states as `geoPolygon`s under Albers USA, each named by a `geoText` at its centroid, with a `tip` naming the state under the pointer: the notebook’s static and interactive maps in one.',
  needs: [],
  prep: ['prep-geo'],
  gaps: [
    'The static labels are plain text at the centroid: no callout box, and no `anchor: "bottom"` pointer.',
    'Centroids are computed with `d3.geoCentroid` in prep (Plot’s `geoCentroid` transform).',
    'The interactive map’s tip sits beside the pointer rather than at the state’s centroid.',
  ],
  recreation: {
    code: `const us = await plotData('observablehq__plot-maps-tips', 'us-counties-10m@1.json');
const states = topojson.feature(us, us.objects.states).features;
const rows = states.map((f) => {
  const [lon, lat] = d3.geoCentroid(f);
  return { name: f.properties.name, geometry: f.geometry, lon, lat };
});
mount(Elicit({
  width: 470, height: 300,
  margins: { top: 6, right: 6, bottom: 6, left: 6 },
  projection: 'albers-usa',
  schema: {
    name: { type: 'categorical' },
    geometry: { type: 'categorical' },
    lon: { type: 'quantitative' },
    lat: { type: 'quantitative' },
  },
  data: rows,
  marks: [
    geoPolygon({
      fill: 'none', stroke: 'currentColor', strokeWidth: 0.6, tip: ['name'],
      channels: { geometry: { field: 'geometry', scale: null } },
    }),
    geoText({
      fontSize: 7,
      channels: { lon: { field: 'lon' }, lat: { field: 'lat' }, text: { field: 'name' } },
    }),
  ],
}));`,
  },
  interfaces: [
    {
      title: 'Colour the big states',
      question: 'Which states do you think have more than 10 million residents?',
      try: 'Click a state to cycle it between “no”, “yes” and “not sure”.',
      why: '`cycle()` on a `geoPolygon`’s `fill` steps the clicked state’s `answer` through the schema’s domain, so the map is the answer sheet; the domain order is the click order, and the legend is the key. A `tip` names the state under the pointer without getting in the way of the click.',
      uses: ['cycle()', 'geoPolygon', 'tip'],
      code: `const us = await plotData('observablehq__plot-maps-tips', 'us-counties-10m@1.json');
const states = topojson.feature(us, us.objects.states).features;
mount(Elicit({
  width: 470, height: 320,
  margins: { top: 6, right: 6, bottom: 6, left: 6 },
  projection: 'albers-usa',
  schema: {
    name: { type: 'categorical' },
    geometry: { type: 'categorical' },
    answer: { type: 'ordinal', domain: ['no', 'yes', 'not sure'] },  //! the answers, in click order
  },
  data: states.map((f) => ({ name: f.properties.name, geometry: f.geometry, answer: 'no' })),
  legends: { fill: { anchor: 'bottom' } },
  marks: [
    geoPolygon({
      stroke: '#fff', strokeWidth: 0.7,
      tip: ['name'],                                       //! hover to read the state
      channels: {
        geometry: { field: 'geometry', scale: null },
        fill: { field: 'answer', scale: { range: ['#e5e7eb', '#e8590c', '#fcd34d'] },
                edit: cycle() },                            //! click a state to answer
      },
    }),
  ],
}));`,
    },
  ],
});
