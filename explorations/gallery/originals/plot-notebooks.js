window.PLOT_NOTEBOOKS = {};
window.PLOT_NOTEBOOKS["observablehq__plot-scatterplot"] = { code: "data = FileAttachment(\"penguins.csv\").csv({typed: true})\n\nPlot.plot({\n  inset: 8,\n  grid: true,\n  color: {\n    legend: true,\n  },\n  marks: [\n    Plot.dot(data, {x: \"flipper_length_mm\", y: \"body_mass_g\", stroke: \"sex\"})\n  ]\n})", imports: [], define: (function(){
// https://observablehq.com/@observablehq/plot-scatterplot@52
function _1(md){return(
md`# Plot Scatterplot

Using [Plot.dot](https://observablehq.com/@observablehq/plot-dot).`
)}

function _data(FileAttachment){return(
FileAttachment("penguins.csv").csv({typed: true})
)}

function _3(Plot,data){return(
Plot.plot({
  inset: 8,
  grid: true,
  color: {
    legend: true,
  },
  marks: [
    Plot.dot(data, {x: "flipper_length_mm", y: "body_mass_g", stroke: "sex"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["penguins.csv", {url: "https://static.observableusercontent.com/files/715db1223e067f00500780077febc6cebbdd90c151d3d78317c802732252052ab0e367039872ab9c77d6ef99e5f55a0724b35ddc898a1c99cb14c31a379af80a", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["Plot","data"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__color-scatterplot"] = { code: "Plot.dot(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", stroke: \"species\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Scatterplot with color</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Scatterplot with color

Two quantitative dimensions encoded to the *x* and *y* dimensions (see [scales](https://observablehq.com/plot/features/scales)), and a categorical dimension encoded to *stroke* (color), drawn with the [dot](https://observablehq.com/plot/marks/dot) mark.`
)}

function _2(Plot,penguins){return(
Plot.dot(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "species"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-diverging-color-scatterplot"] = { code: "Plot.plot({\n  y: {\n    grid: true,\n    tickFormat: \"+f\",\n    label: \"↑ Surface temperature anomaly (°C)\"\n  },\n  color: {\n    scheme: \"BuRd\",\n    legend: true\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.dot(gistemp, {x: \"Date\", y: \"Anomaly\", stroke: \"Anomaly\"})\n  ]\n})\n\ngistemp = FileAttachment(\"gistemp.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Diverging color scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Diverging color scatterplot

This plot of global average surface temperature ([GISTEMP](https://data.giss.nasa.gov/gistemp/)) uses a *diverging* *color* scale to indicate the deviation from the 1951–1980 average in degrees Celsius. Each measurement is drawn with a [dot](https://observablehq.com/plot/marks/dot), and a ramp [legend](https://observablehq.com/plot/features/legend) allows the reader to interpret the color—which in this case is redundant with its *y* position.`
)}

function _2(Plot,gistemp){return(
Plot.plot({
  y: {
    grid: true,
    tickFormat: "+f",
    label: "↑ Surface temperature anomaly (°C)"
  },
  color: {
    scheme: "BuRd",
    legend: true
  },
  marks: [
    Plot.ruleY([0]),
    Plot.dot(gistemp, {x: "Date", y: "Anomaly", stroke: "Anomaly"})
  ]
})
)}

function _gistemp(FileAttachment){return(
FileAttachment("gistemp.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["gistemp.csv", {url: "https://static.observableusercontent.com/files/1734c862dd51ef67930fef3dcd19e8184bb65c405683f55a085f97ca01c233713a53062c251fe0a6d72f93863fd5f714eadef3c9455b1b4f2ed90546cbc57b32", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","gistemp"], _2);
  main.variable(observer("gistemp")).define("gistemp", ["FileAttachment"], _gistemp);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-symbol-channel"] = { code: "Plot.plot({\n  grid: true,\n  x: {label: \"Body mass (g) →\"},\n  y: {label: \"↑ Flipper length (mm)\"},\n  symbol: {legend: true},\n  marks: [\n    Plot.dot(penguins, {x: \"body_mass_g\", y: \"flipper_length_mm\", stroke: \"species\", symbol: \"species\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Symbol channel</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Symbol channel

When an ordinal _color_ scale is used redundantly with a [_symbol_](https://observablehq.com/plot/marks/dot.html) scale, the _symbol_ [legend](https://observablehq.com/plot/features/legend.html) will incorporate the color encoding. This is more accessible than using color alone, particularly for readers with color vision deficiency.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  grid: true,
  x: {label: "Body mass (g) →"},
  y: {label: "↑ Flipper length (mm)"},
  symbol: {legend: true},
  marks: [
    Plot.dot(penguins, {x: "body_mass_g", y: "flipper_length_mm", stroke: "species", symbol: "species"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__scatterplot-with-interactive-tips"] = { code: "Plot.dot(olympians, {\n  x: \"weight\",\n  y: \"height\",\n  stroke: \"sex\",\n  channels: {name: \"name\", sport: \"sport\"},\n  tip: true\n}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Scatterplot with interactive tips</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Scatterplot with interactive tips

Add **tip**: true to the [dot](https://observablehq.com/plot/marks/dot) mark for a default [interactive tip](https://observablehq.com/plot/features/interactions). Declare extra **channels** to add the relevant information in the [tip](https://observablehq.com/plot/marks/tip).`
)}

function _2(Plot,olympians){return(
Plot.dot(olympians, {
  x: "weight",
  y: "height",
  stroke: "sex",
  channels: {name: "name", sport: "sport"},
  tip: true
}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-proportional-symbol-scatterplot"] = { code: "Plot.plot({\n  grid: true,\n  x: {\n    label: \"Daily change (%) →\",\n    tickFormat: \"+f\",\n    percent: true\n  },\n  y: {\n    type: \"log\",\n    label: \"↑ Daily trading volume\"\n  },\n  marks: [\n    Plot.ruleX([0]),\n    Plot.dot(aapl, {x: (d) => (d.Close - d.Open) / d.Open, y: \"Volume\", r: \"Volume\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Proportional symbol scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Proportional symbol scatterplot

[Dots](https://observablehq.com/plot/marks/dot) with a radius [encoding](https://observablehq.com/plot/features/scales).`
)}

function _2(Plot,aapl){return(
Plot.plot({
  grid: true,
  x: {
    label: "Daily change (%) →",
    tickFormat: "+f",
    percent: true
  },
  y: {
    type: "log",
    label: "↑ Daily trading volume"
  },
  marks: [
    Plot.ruleX([0]),
    Plot.dot(aapl, {x: (d) => (d.Close - d.Open) / d.Open, y: "Volume", r: "Volume"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-scatterplot-with-ordinal-dimension"] = { code: "Plot.plot({\n  marginLeft: 60,\n  x: {inset: 10},\n  y: {label: null},\n  marks: [\n    Plot.dot(penguins, {x: \"body_mass_g\", y: \"species\", stroke: \"sex\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Scatterplot with ordinal dimension</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Scatterplot with ordinal dimension

A [dot](https://observablehq.com/plot/marks/dot) mark encoding three dimensions with various [scales](https://observablehq.com/plot/features/scales): *x* is quantitative, *y* and *stroke* (color) are nominal.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marginLeft: 60,
  x: {inset: 10},
  y: {label: null},
  marks: [
    Plot.dot(penguins, {x: "body_mass_g", y: "species", stroke: "sex"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacked-dots"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  x: {label: \"Age (years)\"},\n  y: {\n    grid: true,\n    label: \"← Women · Men →\",\n    labelAnchor: \"center\",\n    tickFormat: Math.abs\n  },\n  marks: [\n    Plot.dot(\n      congress,\n      Plot.stackY2({\n        x: (d) => 2023 - d.birthday.getUTCFullYear(),\n        y: (d) => d.gender === \"M\" ? 1 : -1,\n        fill: \"gender\",\n        title: \"full_name\"\n      })\n    ),\n    Plot.ruleY([0])\n  ]\n})\n\ncongress = FileAttachment(\"us-congress-2023.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked dots</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked dots

A [dot](https://observablehq.com/plot/marks/dot) mark, [stacked](https://observablehq.com/plot/transforms/stack) in two opposite directions.
`
)}

function _2(Plot,congress){return(
Plot.plot({
  aspectRatio: 1,
  x: {label: "Age (years)"},
  y: {
    grid: true,
    label: "← Women · Men →",
    labelAnchor: "center",
    tickFormat: Math.abs
  },
  marks: [
    Plot.dot(
      congress,
      Plot.stackY2({
        x: (d) => 2023 - d.birthday.getUTCFullYear(),
        y: (d) => d.gender === "M" ? 1 : -1,
        fill: "gender",
        title: "full_name"
      })
    ),
    Plot.ruleY([0])
  ]
})
)}

function _congress(FileAttachment){return(
FileAttachment("us-congress-2023.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-congress-2023.csv", {url: "https://static.observableusercontent.com/files/6eede9891b5d0b0c3ad12e64362df76ee295219777aa46acf52789620255e31e115f6d3f8a71ae87353e3ea055c9ce8cd1e9c8dac3799ea56c89795d5bf7b9fc", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","congress"], _2);
  main.variable(observer("congress")).define("congress", ["FileAttachment"], _congress);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__qq-plot"] = { code: "qq({\n  x: jahanmi2.filter((d) => d.Bat === 2).map((d) => d.Y), // batch 2\n  y: jahanmi2.filter((d) => d.Bat === 1).map((d) => d.Y), // batch 1\n  stroke: \"steelblue\"\n}).plot({\n  aspectRatio: 1,\n  grid: true,\n  nice: true,\n  x: {label: \"Batch 2 →\"},\n  y: {label: \"↑ Batch 1\"}\n})\n\nqq = function qq({x: X, y: Y, ...options} = {}) {\n  const n = Math.min(X.length, Y.length);\n\n  function q(qi, i, Q) {\n    if (Q.length === n) return qi; // no interpolation required\n    const j = i / (n - 1) * (Q.length - 1);\n    const j0 = Math.floor(j);\n    const t = j - j0;\n    return t ? Q[j0] * (1 - t) + Q[j0 + 1] * t : Q[j0];\n  }\n\n  // Sort X and Y; interpolate as needed if the sets are different size.\n  X = d3.sort(X).map(q);\n  Y = d3.sort(Y).map(q);\n\n  // Compute the extent in X and Y.\n  const min = Math.min(X[0], Y[0]);\n  const max = Math.max(X[n - 1], Y[n - 1]);\n\n  return Plot.marks(\n    Plot.link({length: 1}, {x1: min, y1: min, x2: max, y2: max}),\n    Plot.dot({length: n}, {...options, x: X, y: Y})\n  );\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Quantile-quantile plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Quantile-quantile plot

A [quantile-quantile plot](https://en.wikipedia.org/wiki/Q–Q_plot) compares two distributions. If the two are similar, the points will fall approximately along the diagonal; if not, the points will deviate from the diagonal, revealing differences. This example compares the strengths of two batches of ceramics: the first appears to be significantly stronger. Data: [NIST](https://www.itl.nist.gov/div898/handbook/eda/section4/eda42a1.htm)`
)}

function _2(qq,jahanmi2){return(
qq({
  x: jahanmi2.filter((d) => d.Bat === 2).map((d) => d.Y), // batch 2
  y: jahanmi2.filter((d) => d.Bat === 1).map((d) => d.Y), // batch 1
  stroke: "steelblue"
}).plot({
  aspectRatio: 1,
  grid: true,
  nice: true,
  x: {label: "Batch 2 →"},
  y: {label: "↑ Batch 1"}
})
)}

async function _jahanmi2(FileAttachment)
{
  const text = await FileAttachment("JAHANMI2.DAT").text();
  const lines = text.split("\r\n").slice(48, -1);
  const [header,, ...rows] = lines.map((l) => l.trim().split(/\s+/g));
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, +r[i]])));
}


function _4(md){return(
md`---

## Implementation

To import into your notebook:

\`\`\`js
import {qq} from "@observablehq/qq-plot"
\`\`\``
)}

function _5(md){return(
md`Per NIST: “If the data sets are not of equal size, the quantiles are usually picked to correspond to the sorted values from the smaller data set and then the quantiles for the larger data set are interpolated.”`
)}

function _qq(d3,Plot){return(
function qq({x: X, y: Y, ...options} = {}) {
  const n = Math.min(X.length, Y.length);

  function q(qi, i, Q) {
    if (Q.length === n) return qi; // no interpolation required
    const j = i / (n - 1) * (Q.length - 1);
    const j0 = Math.floor(j);
    const t = j - j0;
    return t ? Q[j0] * (1 - t) + Q[j0 + 1] * t : Q[j0];
  }

  // Sort X and Y; interpolate as needed if the sets are different size.
  X = d3.sort(X).map(q);
  Y = d3.sort(Y).map(q);

  // Compute the extent in X and Y.
  const min = Math.min(X[0], Y[0]);
  const max = Math.max(X[n - 1], Y[n - 1]);

  return Plot.marks(
    Plot.link({length: 1}, {x1: min, y1: min, x2: max, y2: max}),
    Plot.dot({length: n}, {...options, x: X, y: Y})
  );
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["JAHANMI2.DAT", {url: "https://static.observableusercontent.com/files/80f2ea7ec632fbd6c1b460e0c47cb1a228c3edb1c8151bf94ff1ed728a33f7ca8793a924555a2a52141818f20ee71c16ca6e2b880576a36687c8275304906f5d", mimeType: "application/octet-stream"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["qq","jahanmi2"], _2);
  main.variable(observer("jahanmi2")).define("jahanmi2", ["FileAttachment"], _jahanmi2);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("qq")).define("qq", ["d3","Plot"], _qq);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-temperature-amplitude"] = { code: "Plot.plot({\n  x: { label: \"Daily low temperature (°F) →\", nice: true },\n  y: { label: \"↑ Daily temperature variation (Δ°F)\", zero: true },\n  aspectRatio: 1,\n  color: {\n    type: \"cyclical\",\n    legend: true,\n    tickFormat: Plot.formatMonth()\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.dot(temps, {\n      fill: (d) => d.date.getUTCMonth(),\n      x: \"temp_min\",\n      y: delta\n    }),\n    Plot.dot(temps, Plot.selectMaxY({ x: \"temp_min\", y: delta, r: 5 })),\n    Plot.text(\n      temps,\n      Plot.selectMaxY({\n        x: \"temp_min\",\n        y: delta,\n        text: \"date\",\n        lineAnchor: \"bottom\",\n        dy: -10\n      })\n    )\n  ]\n})\n\ndelta = (d) => d.temp_max - d.temp_min\n\ntemps = FileAttachment(\"seattle-weather.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Seattle temperature amplitude</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Seattle temperature amplitude

Shows the difference between daily high and low against the low, and highlights the day with the greatest variation. Uses [formats](https://observablehq.com/plot/features/formats), the [select](https://observablehq.com/plot/transforms/select) transform, and a [function accessor](https://observablehq.com/plot/features/marks#marks-have-channels). Data: [NOAA/Vega](https://github.com/vega/vega-datasets/blob/master/scripts/weather.py)`
)}

function _2(Plot,temps,delta){return(
Plot.plot({
  x: { label: "Daily low temperature (°F) →", nice: true },
  y: { label: "↑ Daily temperature variation (Δ°F)", zero: true },
  aspectRatio: 1,
  color: {
    type: "cyclical",
    legend: true,
    tickFormat: Plot.formatMonth()
  },
  marks: [
    Plot.ruleY([0]),
    Plot.dot(temps, {
      fill: (d) => d.date.getUTCMonth(),
      x: "temp_min",
      y: delta
    }),
    Plot.dot(temps, Plot.selectMaxY({ x: "temp_min", y: delta, r: 5 })),
    Plot.text(
      temps,
      Plot.selectMaxY({
        x: "temp_min",
        y: delta,
        text: "date",
        lineAnchor: "bottom",
        dy: -10
      })
    )
  ]
})
)}

function _delta(){return(
(d) => d.temp_max - d.temp_min
)}

function _temps(FileAttachment){return(
FileAttachment("seattle-weather.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["seattle-weather.csv", {url: "https://static.observableusercontent.com/files/831732e8332e141e39aca2776edfdb19b2d43308d4974f5ad4a21fad007faa0518fe5bc4a0fc4f57422689a161dc27b82073403cee0e29ebf6ccb75d0ec4aeb3", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","temps","delta"], _2);
  main.variable(observer("delta")).define("delta", _delta);
  main.variable(observer("temps")).define("temps", ["FileAttachment"], _temps);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-linear-regression-simpson"] = { code: "Plot.plot({\n  grid: true,\n  color: {legend: true},\n  marks: [\n    Plot.dot(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", fill: \"species\"}),\n    Plot.linearRegressionY(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", stroke: \"species\"}),\n    Plot.linearRegressionY(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Linear regression</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Linear regression

If you measure the relationship between culmen depth and length in a mixed population of penguins, it is [positively correlated](https://observablehq.com/plot/marks/linear-regression) in each of the three species (bigger penguins with the longer culmens also tend to have the deeper ones); however, the Gentoo population has a smaller aspect ratio of depth against length, and the overall correlation across the three species is negative. This is called [Simpson’s paradox](https://en.wikipedia.org/wiki/Simpson%27s_paradox), and it applies to any data that contains underlying populations with different properties or outcomes.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  grid: true,
  color: {legend: true},
  marks: [
    Plot.dot(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", fill: "species"}),
    Plot.linearRegressionY(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "species"}),
    Plot.linearRegressionY(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dot-plot"] = { code: "stateage = FileAttachment(\"us-population-state-age.csv\").csv({typed: true}).then((data) => {\n  const ages = data.columns.slice(1); // convert wide data to tidy data\n  return Object.assign(ages.flatMap((age) => data.map((d) => ({state: d.name, age, population: d[age]}))), {ages});\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Dot plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Dot plot

Comparing demographics by state. *Color* represents age group, *y* represents the state, and *x* represents the proportion of the state’s population in that age group. The [normalize transform](https://observablehq.com/plot/transforms/normalize) is used to compute the relative proportion of each age group within each state, while the [group transform](https://observablehq.com/plot/transforms/group) is used to pull out the *min* and *max* values for each state for a horizontal [rule](https://observablehq.com/plot/marks/rule).`
)}

function _2(Plot,stateage)
{
  const xy = Plot.normalizeX("sum", {x: "population", y: "state", z: "state"});
  return Plot.plot({
    height: 660,
    x: {axis: "top", percent: true, grid: true},
    y: {axis: null},
    color: {scheme: "spectral", legend: true},
    marks: [
      Plot.ruleX([0]),
      Plot.ruleY(stateage, Plot.groupY({x1: "min", x2: "max"}, {...xy, sort: {y: "x1"}})),
      Plot.dot(stateage, {...xy, fill: "age", title: "age", sort: {color: null}}), // color in input order
      Plot.text(stateage, Plot.selectMinX({...xy, textAnchor: "end", dx: -6, text: "state"}))
    ]
  });
}


function _stateage(FileAttachment){return(
FileAttachment("us-population-state-age.csv").csv({typed: true}).then((data) => {
  const ages = data.columns.slice(1); // convert wide data to tidy data
  return Object.assign(ages.flatMap((age) => data.map((d) => ({state: d.name, age, population: d[age]}))), {ages});
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-population-state-age.csv", {url: "https://static.observableusercontent.com/files/3ea96de39eb40936da1c5e7bf932e124861c50b9e45569cb17e694e9b9ed462c79684b2ede7266422ee880930d43408010a4741695709c094f9f6827c62534db", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","stateage"], _2);
  main.variable(observer("stateage")).define("stateage", ["FileAttachment"], _stateage);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-background-image"] = { code: "", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Background image</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Background image

Visualizes [Kristen Gorman’s penguins dataset](https://allisonhorst.github.io/palmerpenguins/) atop of her photograph of sea ice near [Palmer Station](https://en.wikipedia.org/wiki/Palmer_Station) on the Antarctic peninsula. Using Plot’s [style](https://observablehq.com/plot/features/plots) option.
`
)}

async function _2(Plot,FileAttachment,penguins){return(
Plot.plot({
  margin: 30,
  inset: 10,
  grid: true,
  style: {
    padding: 10,
    color: "black",
    background: `url(${await FileAttachment("sea-ice.jpg").url()})`,
    backgroundSize: "cover"
  },
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", fill: "white", stroke: "black"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["sea-ice.jpg", {url: "https://static.observableusercontent.com/files/82bea9fc4b884b1dafeefa29476944ada8c68e4d54fb1dcdbf95c2378a61cf5effd497638b3b067b26eade8a5982cec71032cdacada4305982fbb0af0174ee14", mimeType: "image/jpeg"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","FileAttachment","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-image-dodge"] = { code: "Plot.plot({\n  inset: 20,\n  height: 280,\n  marks: [\n    Plot.image(\n      presidents,\n      Plot.dodgeY({\n        x: \"First Inauguration Date\",\n        r: 20, // clip to a circle\n        preserveAspectRatio: \"xMidYMin slice\", // try not to clip heads\n        src: \"Portrait URL\",\n        title: \"Name\"\n      })\n    )\n  ]\n})\n\npresidents = FileAttachment(\"us-president-favorability@2.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Image beeswarm</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Image beeswarm (dodge)

The [image](https://observablehq.com/plot/marks/image) mark supports the *r* option, and can be used with the [dodge](https://observablehq.com/plot/transforms/dodge) transform. data: [YouGov](https://today.yougov.com/topics/politics/articles-reports/2021/07/27/most-and-least-popular-us-presidents-according-ame)`
)}

function _2(Plot,presidents){return(
Plot.plot({
  inset: 20,
  height: 280,
  marks: [
    Plot.image(
      presidents,
      Plot.dodgeY({
        x: "First Inauguration Date",
        r: 20, // clip to a circle
        preserveAspectRatio: "xMidYMin slice", // try not to clip heads
        src: "Portrait URL",
        title: "Name"
      })
    )
  ]
})
)}

function _presidents(FileAttachment){return(
FileAttachment("us-president-favorability@2.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-president-favorability.csv", {url: "https://static.observableusercontent.com/files/597b73a4271667f46b73925e9db5429a8137386026a18dbedc6a85703d711b226410fd04ae7927edb8180736bd26231cea4d9a73b41ad0c80e77671c42b9bfa1", mimeType: "text/csv"}],
    ["us-president-favorability@1.csv", {url: "https://static.observableusercontent.com/files/9e277a1c41a47ed5bca52c882f6d3e80c39fa2016ab5f722ca50fd65e52506cf0ee36de83eb01a2e99a7991279893b819605913080da972fda6d17db5966ef42", mimeType: "text/csv"}],
    ["us-president-favorability@2.csv", {url: "https://static.observableusercontent.com/files/1d0c1c541a6f8d491087e65ed28ea684092a45f64815c8835be6cfb1d9c25e417fd8ed0319e9300afa6541c7443d150f20781ec4b2adc15a0f6fd4575c958a61", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","presidents"], _2);
  main.variable(observer("presidents")).define("presidents", ["FileAttachment"], _presidents);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-image-medals"] = { code: "Plot.plot({\n  x: {inset: 20, label: \"First inauguration date →\"},\n  y: {insetTop: 4, grid: true, label: \"↑ Any opinion (%)\", tickFormat: \"+f\"},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.image(presidents, {\n      x: \"First Inauguration Date\",\n      y: (d) => d[\"Very Favorable %\"] + d[\"Somewhat Favorable %\"] + d[\"Very Unfavorable %\"] + d[\"Somewhat Unfavorable %\"],\n      src: \"Portrait URL\",\n      r: 20,\n      preserveAspectRatio: \"xMidYMin slice\",\n      title: \"Name\"\n    })\n  ]\n})\n\npresidents = FileAttachment(\"us-president-favorability@1.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Image medals</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Image medals

Showing the percentage of people today who have an opinion of past presidents using the [image](https://observablehq.com/plot/marks/image) mark (with the _r_ option set, to make images circular). Data from [YouGov](https://today.yougov.com/topics/politics/articles-reports/2021/07/27/most-and-least-popular-us-presidents-according-ame); inspired by [Robert Lesser](https://observablehq.com/@rlesser/when-presidents-fade-away).`
)}

function _2(Plot,presidents){return(
Plot.plot({
  x: {inset: 20, label: "First inauguration date →"},
  y: {insetTop: 4, grid: true, label: "↑ Any opinion (%)", tickFormat: "+f"},
  marks: [
    Plot.ruleY([0]),
    Plot.image(presidents, {
      x: "First Inauguration Date",
      y: (d) => d["Very Favorable %"] + d["Somewhat Favorable %"] + d["Very Unfavorable %"] + d["Somewhat Unfavorable %"],
      src: "Portrait URL",
      r: 20,
      preserveAspectRatio: "xMidYMin slice",
      title: "Name"
    })
  ]
})
)}

function _presidents(FileAttachment){return(
FileAttachment("us-president-favorability@1.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-president-favorability.csv", {url: "https://static.observableusercontent.com/files/9e277a1c41a47ed5bca52c882f6d3e80c39fa2016ab5f722ca50fd65e52506cf0ee36de83eb01a2e99a7991279893b819605913080da972fda6d17db5966ef42", mimeType: "text/csv"}],
    ["us-president-favorability@1.csv", {url: "https://static.observableusercontent.com/files/1d0c1c541a6f8d491087e65ed28ea684092a45f64815c8835be6cfb1d9c25e417fd8ed0319e9300afa6541c7443d150f20781ec4b2adc15a0f6fd4575c958a61", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","presidents"], _2);
  main.variable(observer("presidents")).define("presidents", ["FileAttachment"], _presidents);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-image-scatterplot"] = { code: "Plot.plot({\n  inset: 20,\n  x: {label: \"First inauguration date →\"},\n  y: {grid: true, label: \"↑ Net favorability (%)\", tickFormat: \"+f\"},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.image(presidents, {\n      x: \"First Inauguration Date\",\n      y: (d) => d[\"Very Favorable %\"] + d[\"Somewhat Favorable %\"] - d[\"Very Unfavorable %\"] - d[\"Somewhat Unfavorable %\"],\n      src: \"Portrait URL\",\n      width: 40,\n      title: \"Name\"\n    })\n  ]\n})\n\npresidents = FileAttachment(\"us-president-favorability@1.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Image scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Image scatterplot

Showing the net favorability of past presidents among people today using the [image](https://observablehq.com/plot/marks/image) mark. Data from [YouGov](https://today.yougov.com/topics/politics/articles-reports/2021/07/27/most-and-least-popular-us-presidents-according-ame); inspired by [Robert Lesser](https://observablehq.com/@rlesser/when-presidents-fade-away).`
)}

function _2(Plot,presidents){return(
Plot.plot({
  inset: 20,
  x: {label: "First inauguration date →"},
  y: {grid: true, label: "↑ Net favorability (%)", tickFormat: "+f"},
  marks: [
    Plot.ruleY([0]),
    Plot.image(presidents, {
      x: "First Inauguration Date",
      y: (d) => d["Very Favorable %"] + d["Somewhat Favorable %"] - d["Very Unfavorable %"] - d["Somewhat Unfavorable %"],
      src: "Portrait URL",
      width: 40,
      title: "Name"
    })
  ]
})
)}

function _presidents(FileAttachment){return(
FileAttachment("us-president-favorability@1.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-president-favorability.csv", {url: "https://static.observableusercontent.com/files/9e277a1c41a47ed5bca52c882f6d3e80c39fa2016ab5f722ca50fd65e52506cf0ee36de83eb01a2e99a7991279893b819605913080da972fda6d17db5966ef42", mimeType: "text/csv"}],
    ["us-president-favorability@1.csv", {url: "https://static.observableusercontent.com/files/1d0c1c541a6f8d491087e65ed28ea684092a45f64815c8835be6cfb1d9c25e417fd8ed0319e9300afa6541c7443d150f20781ec4b2adc15a0f6fd4575c958a61", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","presidents"], _2);
  main.variable(observer("presidents")).define("presidents", ["FileAttachment"], _presidents);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-image-scatterplot-2"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  grid: true,\n  x: {label: \"Favorable opinion (%) →\"},\n  y: {label: \"↑ Unfavorable opinion (%)\"},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.ruleX([0]),\n    Plot.image(presidents, {\n      x: (d) => d[\"Very Favorable %\"] + d[\"Somewhat Favorable %\"],\n      y: (d) => d[\"Very Unfavorable %\"] + d[\"Somewhat Unfavorable %\"],\n      src: \"Portrait URL\",\n      title: \"Name\"\n    })\n  ]\n})\n\npresidents = FileAttachment(\"us-president-favorability@2.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Default image scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Default image scatterplot

The default size of the [image](https://observablehq.com/plot/marks/image) mark is only 16×16 pixels. Data: [YouGov](https://today.yougov.com/topics/politics/articles-reports/2021/07/27/most-and-least-popular-us-presidents-according-ame)`
)}

function _2(Plot,presidents){return(
Plot.plot({
  aspectRatio: 1,
  grid: true,
  x: {label: "Favorable opinion (%) →"},
  y: {label: "↑ Unfavorable opinion (%)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.image(presidents, {
      x: (d) => d["Very Favorable %"] + d["Somewhat Favorable %"],
      y: (d) => d["Very Unfavorable %"] + d["Somewhat Unfavorable %"],
      src: "Portrait URL",
      title: "Name"
    })
  ]
})
)}

function _presidents(FileAttachment){return(
FileAttachment("us-president-favorability@2.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-president-favorability.csv", {url: "https://static.observableusercontent.com/files/597b73a4271667f46b73925e9db5429a8137386026a18dbedc6a85703d711b226410fd04ae7927edb8180736bd26231cea4d9a73b41ad0c80e77671c42b9bfa1", mimeType: "text/csv"}],
    ["us-president-favorability@1.csv", {url: "https://static.observableusercontent.com/files/9e277a1c41a47ed5bca52c882f6d3e80c39fa2016ab5f722ca50fd65e52506cf0ee36de83eb01a2e99a7991279893b819605913080da972fda6d17db5966ef42", mimeType: "text/csv"}],
    ["us-president-favorability@2.csv", {url: "https://static.observableusercontent.com/files/1d0c1c541a6f8d491087e65ed28ea684092a45f64815c8835be6cfb1d9c25e417fd8ed0319e9300afa6541c7443d150f20781ec4b2adc15a0f6fd4575c958a61", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","presidents"], _2);
  main.variable(observer("presidents")).define("presidents", ["FileAttachment"], _presidents);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ordinal-scatterplot"] = { code: "Plot.plot({\n  label: null,\n  marginLeft: 60,\n  height: 240,\n  grid: true,\n  r: {range: [0, 40]},\n  marks: [\n    Plot.dot(penguins, Plot.group({r: \"count\"}, {x: \"species\", y: \"island\", stroke: \"sex\"}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Ordinal scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Ordinal scatterplot

A scatterplot [grouped](https://observablehq.com/plot/transforms/group) on two ordinal dimensions, with a radius [encoding](https://observablehq.com/plot/features/scales).`
)}

function _2(Plot,penguins){return(
Plot.plot({
  label: null,
  marginLeft: 60,
  height: 240,
  grid: true,
  r: {range: [0, 40]},
  marks: [
    Plot.dot(penguins, Plot.group({r: "count"}, {x: "species", y: "island", stroke: "sex"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dot-heatmap"] = { code: "Plot.plot({\n  r: {range: [0, 6]}, // generate slightly smaller dots\n  marks: [\n    Plot.dot(olympians, Plot.bin({r: \"count\"}, {x: \"weight\", y: \"height\"}))\n  ]\n})\n\nPlot.plot({\n  r: {range: [0, 6]},\n  marks: [\n    Plot.dot(olympians, Plot.bin({r: \"count\"}, {x: \"weight\", y: \"height\", stroke: \"sex\"}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Dot heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Dot heatmap

The [bin](https://observablehq.com/plot/transforms/bin) transform aggregates data along two quantitative axes *x* and *y*. The result can be displayed by a [dot](https://observablehq.com/plot/marks/dot) mark with a *radius* encoding the number of elements in each bin.`
)}

function _2(Plot,olympians){return(
Plot.plot({
  r: {range: [0, 6]}, // generate slightly smaller dots
  marks: [
    Plot.dot(olympians, Plot.bin({r: "count"}, {x: "weight", y: "height"}))
  ]
})
)}

function _3(md){return(
md`Each bin can be further grouped by category (here, by _sex_):`
)}

function _4(Plot,olympians){return(
Plot.plot({
  r: {range: [0, 6]},
  marks: [
    Plot.dot(olympians, Plot.bin({r: "count"}, {x: "weight", y: "height", stroke: "sex"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","olympians"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-olympians-hexbin"] = { code: "Plot\n  .hexagon(olympians, Plot.hexbin({fill: \"count\"}, {x: \"weight\", y: \"height\", symbol: \"square\"}))\n  .plot({color: {scheme: \"YlGnBu\"}})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Hexbin heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Hexbin heatmap

Olympic athletes are placed on this heatmap according to their weight and height, [scaled](https://observablehq.com/plot/features/scales) by *x* and *y*. _Then_ their positions (in pixels) are binned into [hexagons](https://observablehq.com/plot/transforms/hexbin), which are filled with a *color* that encodes frequency.`
)}

function _2(Plot,olympians){return(
Plot
  .hexagon(olympians, Plot.hexbin({fill: "count"}, {x: "weight", y: "height", symbol: "square"}))
  .plot({color: {scheme: "YlGnBu"}})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-hexbin-binwidth"] = { code: "binWidth = Inputs.range([0.5, 40], {value: 20, label: \"binWidth\", step: 0.1})\n\nPlot\n  .dot(olympians, Plot.hexbin({r: \"count\"}, {x: \"weight\", y: \"height\", binWidth}))\n  .plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Hexbin binWidth option</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Hexbin binWidth option

Olympic athletes are placed on this [heatmap](https://observablehq.com/@observablehq/plot-olympians-hexbin) according to their weight and height, [scaled](https://observablehq.com/plot/features/scales) by *x* and *y*. _Then_ their positions (in pixels) are grouped into [hexagonal bins](https://observablehq.com/plot/transforms/hexbin), which are represented with a *radius* that encodes frequency. The **binWidth** option (default 20) defines the distance between centers of neighboring hexagons in pixels.`
)}

function _binWidth(Inputs){return(
Inputs.range([0.5, 40], {value: 20, label: "binWidth", step: 0.1})
)}

function _3(Plot,olympians,binWidth){return(
Plot
  .dot(olympians, Plot.hexbin({r: "count"}, {x: "weight", y: "height", binWidth}))
  .plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof binWidth")).define("viewof binWidth", ["Inputs"], _binWidth);
  main.variable(observer("binWidth")).define("binWidth", ["Generators", "viewof binWidth"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","olympians","binWidth"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-hexbin-text"] = { code: "Plot\n  .text(olympians, Plot.hexbin({text: \"count\"}, {x: \"weight\", y: \"height\"}))\n  .plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Hexbin text</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Hexbin text

Olympic athletes are placed on this [heatmap](https://observablehq.com/@observablehq/plot-olympians-hexbin) according to their weight and height, [scaled](https://observablehq.com/plot/features/scales) by *x* and *y*. _Then_ their positions (in pixels) are grouped into [hexagonal bins](https://observablehq.com/plot/transforms/hexbin), which are represented by a [text](https://observablehq.com/plot/marks/text) mark showing the count.`
)}

function _2(Plot,olympians){return(
Plot
  .text(olympians, Plot.hexbin({text: "count"}, {x: "weight", y: "height"}))
  .plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-text-dodge"] = { code: "Plot.plot({\n  insetRight: 10,\n  height: 790,\n  style: \"overflow: visible;\",\n  marks: [\n    Plot.text(\n      ipos,\n      Plot.dodgeY({\n        x: \"date\",\n        r: \"rMVOP\",\n        text: (d) => (d.rMVOP / 1e3).toFixed(1),\n        title: \"NAME\",\n        fontSize: (d) => Math.min(22, Math.cbrt(d.rMVOP / 1e3) * 6)\n      })\n    )\n  ]\n})\n\nipos = FileAttachment(\"ipos.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Text dodge</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Text dodge

The [text](https://observablehq.com/plot/marks/text) mark displays each company’s valuation at IPO; the layout is computed with the [dodge](https://observablehq.com/plot/transforms/dodge) transform.  Data: see [The Facebook IPO](/@observablehq/plot-the-facebook-ipo).`
)}

function _2(Plot,ipos){return(
Plot.plot({
  insetRight: 10,
  height: 790,
  style: "overflow: visible;",
  marks: [
    Plot.text(
      ipos,
      Plot.dodgeY({
        x: "date",
        r: "rMVOP",
        text: (d) => (d.rMVOP / 1e3).toFixed(1),
        title: "NAME",
        fontSize: (d) => Math.min(22, Math.cbrt(d.rMVOP / 1e3) * 6)
      })
    )
  ]
})
)}

function _ipos(FileAttachment){return(
FileAttachment("ipos.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["ipos.csv", {url: "https://static.observableusercontent.com/files/88ee86c690079af193cfb8bec0c55565ba28b182b9092eee8cf3c47b77f1362bf67947c2231a10484ebb0511b36e5b6fcdab1a2ca21a95f1907199184acb78d9", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","ipos"], _2);
  main.variable(observer("ipos")).define("ipos", ["FileAttachment"], _ipos);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-text-spiral"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  inset: 10,\n  grid: true,\n  marks: [\n    Plot.text(d3.range(151).map((i) => [\n      Math.sqrt(i) * Math.sin(i / 10),\n      Math.sqrt(i) * Math.cos(i / 10)\n    ]))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Text spiral</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Text spiral

If both **x** and **y** are not defined, the [text](https://observablehq.com/plot/marks/text) mark assumes that the data is an iterable of points [[*x₁*, *y₁*], [*x₂*, *y₂*], …], allowing for [shorthand](https://observablehq.com/plot/features/shorthand). Furthermore, the default **text** channel is the associated datum’s index.`
)}

function _2(Plot,d3){return(
Plot.plot({
  aspectRatio: 1,
  inset: 10,
  grid: true,
  marks: [
    Plot.text(d3.range(151).map((i) => [
      Math.sqrt(i) * Math.sin(i / 10),
      Math.sqrt(i) * Math.cos(i / 10)
    ]))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-this-is-just-to-say"] = { code: "Plot.plot({\n  height: 200,\n  marks: [\n    Plot.frame(),\n    Plot.text([`This Is Just To Say\nWilliam Carlos Williams, 1934\n\nI have eaten\nthe plums\nthat were in\nthe icebox\n\nand which\nyou were probably\nsaving\nfor breakfast\n\nForgive me\nthey were delicious\nso sweet\nand so cold`], {frameAnchor: \"middle\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: This is just to say</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# This is just to say

The [text](https://observablehq.com/plot/marks/text) mark respects multiline text.`
)}

function _2(Plot){return(
Plot.plot({
  height: 200,
  marks: [
    Plot.frame(),
    Plot.text([`This Is Just To Say
William Carlos Williams, 1934

I have eaten
the plums
that were in
the icebox

and which
you were probably
saving
for breakfast

Forgive me
they were delicious
so sweet
and so cold`], {frameAnchor: "middle"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["fil__plot-voronoi-labels"] = { code: "showVoronoi = Inputs.toggle({ label: \"show voronoi\", value: true })\n\nactivate = Inputs.toggle({ label: \"move to centroids\", value: true })\n\nuseProjection = Inputs.toggle({\n  label: \"mercator\",\n  value: false\n})\n\nPlot.plot({\n  width,\n  height: useProjection ? width : width * 0.7,\n  inset: useProjection ? 0 : 20,\n  projection: useProjection ? { type: \"mercator\" } : undefined,\n  marks: [\n    useProjection ? Plot.sphere() : Plot.frame(),\n    showVoronoi\n      ? Plot.voronoiMesh(airports, { x: \"longitude\", y: \"latitude\" })\n      : null,\n    Plot.arrow(\n      airports,\n      maybeVoronoiCentroids({\n        x1: \"longitude\",\n        y1: \"latitude\",\n        x2: \"longitude\",\n        y2: \"latitude\",\n        stroke: \"black\",\n        strokeWidth: 0.7,\n        bend: true,\n        headLength: 0\n      })\n    ),\n    Plot.dot(airports, {\n      x: \"longitude\",\n      y: \"latitude\",\n      r: 1.5,\n      fill: \"black\"\n    }),\n    Plot.text(\n      airports,\n      maybeVoronoiCentroids({\n        x: \"longitude\",\n        y: \"latitude\",\n        text: (d) => d.name.split(/ /)[0],\n        stroke: \"white\",\n        strokeWidth: 7,\n        fill: \"black\"\n      })\n    )\n  ]\n})\n\nvoronoiCentroids = (options) =>\n  Plot.initializer(\n    options,\n    function (\n      data,\n      facets,\n      { x: X0, y: Y0, x2: X = X0, y2: Y = Y0 },\n      { x, y },\n      { width, height, marginLeft, marginRight, marginTop, marginBottom },\n      { projection }\n    ) {\n      const n = X.value.length;\n      const P = new Float64Array(2 * n).fill(NaN);\n      let i;\n      if (projection) {\n        const stream = projection.stream({\n          point(x, y) {\n            P[2 * i] = x;\n            P[2 * i + 1] = y;\n          }\n        });\n        for (i = 0; i < n; ++i) stream.point(X.value[i], Y.value[i]);\n      } else {\n        for (i = 0; i < n; ++i) P[2 * i] = x ? x(X.value[i]) : X.value[i];\n        for (i = 0; i < n; ++i) P[2 * i + 1] = y ? y(Y.value[i]) : Y.value[i];\n      }\n\n      for (const I of facets) {\n        const v = new d3.Delaunay(P).voronoi([\n          marginLeft,\n          marginTop,\n          width - marginRight,\n          height - marginBottom\n        ]);\n        for (const [i, k] of I.entries())\n          [X.value[i], Y.value[i]] = d3.polygonCentroid(v.cellPolygon(k) ?? []);\n      }\n      delete X.scale;\n      delete Y.scale;\n      return { data, facets };\n    }\n  )\n\nmaybeVoronoiCentroids = activate ? voronoiCentroids : (options) => options\n\nairports = FileAttachment(\"airports.csv\")\n  .csv({ typed: true })\n  .then((data) => data.filter((d, i) => i % 20 === 0))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Voronoi labels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Voronoi labels

Using the [Voronoi diagram](https://github.com/d3/d3-delaunay) to limit label occlusion. See also [D3: Voronoi labels](https://observablehq.com/@d3/voronoi-labels), [occlusion](https://observablehq.com/@fil/occlusion), and [Plot issue #27](https://github.com/observablehq/plot/issues/27).`
)}

function _showVoronoi(Inputs){return(
Inputs.toggle({ label: "show voronoi", value: true })
)}

function _activate(Inputs){return(
Inputs.toggle({ label: "move to centroids", value: true })
)}

function _useProjection(Inputs){return(
Inputs.toggle({
  label: "mercator",
  value: false
})
)}

function _5(Plot,width,useProjection,showVoronoi,airports,maybeVoronoiCentroids){return(
Plot.plot({
  width,
  height: useProjection ? width : width * 0.7,
  inset: useProjection ? 0 : 20,
  projection: useProjection ? { type: "mercator" } : undefined,
  marks: [
    useProjection ? Plot.sphere() : Plot.frame(),
    showVoronoi
      ? Plot.voronoiMesh(airports, { x: "longitude", y: "latitude" })
      : null,
    Plot.arrow(
      airports,
      maybeVoronoiCentroids({
        x1: "longitude",
        y1: "latitude",
        x2: "longitude",
        y2: "latitude",
        stroke: "black",
        strokeWidth: 0.7,
        bend: true,
        headLength: 0
      })
    ),
    Plot.dot(airports, {
      x: "longitude",
      y: "latitude",
      r: 1.5,
      fill: "black"
    }),
    Plot.text(
      airports,
      maybeVoronoiCentroids({
        x: "longitude",
        y: "latitude",
        text: (d) => d.name.split(/ /)[0],
        stroke: "white",
        strokeWidth: 7,
        fill: "black"
      })
    )
  ]
})
)}

function _6(md){return(
md`The custom **voronoiCentroids** options transform (code below) modifies the ﹤x, y﹥ position channels (for the text mark)—and ﹤x2, y2﹥, for the link mark— to reflect the cendroid of the associated polygon in the Voronoi diagram created by the data. This allows to position text labels where there is more space, thus limiting occlusion. If you pass a link or arrow mark, that has ﹤x1, y1, x2, y2﹥ positions, the ﹤x1, y1﹥ channels are left intact as the starting point, with ﹤x2, y2﹥ being the end point.`
)}

function _voronoiCentroids(Plot,d3){return(
(options) =>
  Plot.initializer(
    options,
    function (
      data,
      facets,
      { x: X0, y: Y0, x2: X = X0, y2: Y = Y0 },
      { x, y },
      { width, height, marginLeft, marginRight, marginTop, marginBottom },
      { projection }
    ) {
      const n = X.value.length;
      const P = new Float64Array(2 * n).fill(NaN);
      let i;
      if (projection) {
        const stream = projection.stream({
          point(x, y) {
            P[2 * i] = x;
            P[2 * i + 1] = y;
          }
        });
        for (i = 0; i < n; ++i) stream.point(X.value[i], Y.value[i]);
      } else {
        for (i = 0; i < n; ++i) P[2 * i] = x ? x(X.value[i]) : X.value[i];
        for (i = 0; i < n; ++i) P[2 * i + 1] = y ? y(Y.value[i]) : Y.value[i];
      }

      for (const I of facets) {
        const v = new d3.Delaunay(P).voronoi([
          marginLeft,
          marginTop,
          width - marginRight,
          height - marginBottom
        ]);
        for (const [i, k] of I.entries())
          [X.value[i], Y.value[i]] = d3.polygonCentroid(v.cellPolygon(k) ?? []);
      }
      delete X.scale;
      delete Y.scale;
      return { data, facets };
    }
  )
)}

function _maybeVoronoiCentroids(activate,voronoiCentroids){return(
activate ? voronoiCentroids : (options) => options
)}

function _9(md){return(
md`---
_data_`
)}

function _airports(FileAttachment){return(
FileAttachment("airports.csv")
  .csv({ typed: true })
  .then((data) => data.filter((d, i) => i % 20 === 0))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["airports.csv", {url: "https://static.observableusercontent.com/files/3ba6ffc2faf6f7ee4be0ed0566243932de17192846f8645847a5f7b580b339f9ba604a70b017eeaa8c4a5e1a4032d5a87e828a8e73512d5445226b3b83ac7a29", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof showVoronoi")).define("viewof showVoronoi", ["Inputs"], _showVoronoi);
  main.variable(observer("showVoronoi")).define("showVoronoi", ["Generators", "viewof showVoronoi"], (G, _) => G.input(_));
  main.variable(observer("viewof activate")).define("viewof activate", ["Inputs"], _activate);
  main.variable(observer("activate")).define("activate", ["Generators", "viewof activate"], (G, _) => G.input(_));
  main.variable(observer("viewof useProjection")).define("viewof useProjection", ["Inputs"], _useProjection);
  main.variable(observer("useProjection")).define("useProjection", ["Generators", "viewof useProjection"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","width","useProjection","showVoronoi","airports","maybeVoronoiCentroids"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("voronoiCentroids")).define("voronoiCentroids", ["Plot","d3"], _voronoiCentroids);
  main.variable(observer("maybeVoronoiCentroids")).define("maybeVoronoiCentroids", ["activate","voronoiCentroids"], _maybeVoronoiCentroids);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("airports")).define("airports", ["FileAttachment"], _airports);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-caltrain-schedule"] = { code: "Plot.plot({\n  width: 240,\n  axis: null,\n  x: {type: \"point\"},\n  y: {type: \"point\", domain: d3.range(4, 25)},\n  color: {domain: \"NLB\", range: [\"currentColor\", \"peru\", \"brown\"], legend: true},\n  marks: [\n    Plot.text([[0.5, 4]], {text: [\"Northbound\"], textAnchor: \"start\", dx: 16}),\n    Plot.text([[-0.5, 4]], {text: [\"Southbound\"], textAnchor: \"end\", dx: -16}),\n    Plot.text(d3.range(5, 25), {x: 0, y: Plot.identity, text: (y) => `${y % 12 || 12}${y % 24 >= 12 ? \"p\": \"a\"}`}),\n    Plot.text(caltrain, Plot.stackX2({x: (d) => d.orientation === \"N\" ? 1 : -1, y: \"hours\", fill: \"type\", text: \"minutes\"})),\n    Plot.ruleX([-0.5, 0.5])\n  ]\n})\n\ncaltrain = FileAttachment(\"caltrain.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stem-and-leaf plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stem-and-leaf plot

[Stack](https://observablehq.com/plot/transforms/stack) a [text](https://observablehq.com/plot/marks/text) mark to display a neat schedule for the Caltrain.`
)}

function _2(Plot,d3,caltrain){return(
Plot.plot({
  width: 240,
  axis: null,
  x: {type: "point"},
  y: {type: "point", domain: d3.range(4, 25)},
  color: {domain: "NLB", range: ["currentColor", "peru", "brown"], legend: true},
  marks: [
    Plot.text([[0.5, 4]], {text: ["Northbound"], textAnchor: "start", dx: 16}),
    Plot.text([[-0.5, 4]], {text: ["Southbound"], textAnchor: "end", dx: -16}),
    Plot.text(d3.range(5, 25), {x: 0, y: Plot.identity, text: (y) => `${y % 12 || 12}${y % 24 >= 12 ? "p": "a"}`}),
    Plot.text(caltrain, Plot.stackX2({x: (d) => d.orientation === "N" ? 1 : -1, y: "hours", fill: "type", text: "minutes"})),
    Plot.ruleX([-0.5, 0.5])
  ]
})
)}

function _caltrain(FileAttachment){return(
FileAttachment("caltrain.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["caltrain.csv", {url: "https://static.observableusercontent.com/files/df346b6e60d18054eb2c5fae318ffb4bfb2f89f173cfa3ef5f8d397b8aa4b767874e9dea2595f5277ed0259fdfcefb22c2bc5703e0132f2e46d95aacb1921a35", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","caltrain"], _2);
  main.variable(observer("caltrain")).define("caltrain", ["FileAttachment"], _caltrain);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dodge-cars"] = { code: "anchor = Inputs.select([null, \"top\", \"middle\", \"bottom\"], {label: \"anchor\"})\n\nPlot.plot({\n  height: 160,\n  marks: [\n    Plot.dotX(cars, Plot.dodgeY({x: \"weight (lb)\", title: \"name\", fill: \"currentColor\", anchor: anchor ?? undefined}))\n  ]\n})\n\nPlot.plot({\n  height: 180,\n  marks: [\n    Plot.rectY(cars, Plot.binX({y: \"count\"}, {x: \"weight (lb)\"})),\n    Plot.ruleY([0])\n  ]\n})\n\nPlot.dotX(cars, {x: \"weight (lb)\"}).plot()\n\nPlot.ruleX(cars, {x: \"weight (lb)\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Dodge cars (beeswarm)</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Dodge cars (beeswarm)

The [dodge](https://observablehq.com/plot/transforms/dodge) transform helps to create a beeswarm chart.`
)}

function _anchor(Inputs){return(
Inputs.select([null, "top", "middle", "bottom"], {label: "anchor"})
)}

function _3(Plot,cars,anchor){return(
Plot.plot({
  height: 160,
  marks: [
    Plot.dotX(cars, Plot.dodgeY({x: "weight (lb)", title: "name", fill: "currentColor", anchor: anchor ?? undefined}))
  ]
})
)}

function _4(md){return(
md`For comparison, here are a few other ways to display the same data:`
)}

function _5(Plot,cars){return(
Plot.plot({
  height: 180,
  marks: [
    Plot.rectY(cars, Plot.binX({y: "count"}, {x: "weight (lb)"})),
    Plot.ruleY([0])
  ]
})
)}

function _6(Plot,cars){return(
Plot.dotX(cars, {x: "weight (lb)"}).plot()
)}

function _7(Plot,cars){return(
Plot.ruleX(cars, {x: "weight (lb)"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof anchor")).define("viewof anchor", ["Inputs"], _anchor);
  main.variable(observer("anchor")).define("anchor", ["Generators", "viewof anchor"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","cars","anchor"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","cars"], _5);
  main.variable(observer()).define(["Plot","cars"], _6);
  main.variable(observer()).define(["Plot","cars"], _7);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dodge-penguins"] = { code: "Plot.plot({\n  y: {grid: true},\n  color: {legend: true},\n  marks: [\n    Plot.dot(penguins, Plot.dodgeX(\"middle\", {fx: \"species\", y: \"body_mass_g\", fill: \"sex\"}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Dodge penguins</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Dodge penguins

Distribution of [Palmer penguins](https://allisonhorst.github.io/palmerpenguins/) body masses, [faceted](https://observablehq.com/plot/features/facets) by species, colored by sex, using the [dodge transform](https://observablehq.com/plot/transforms/dodge).`
)}

function _2(Plot,penguins){return(
Plot.plot({
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.dot(penguins, Plot.dodgeX("middle", {fx: "species", y: "body_mass_g", fill: "sex"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-barley-trellis"] = { code: "Plot.plot({\n  height: 800,\n  marginRight: 90,\n  marginLeft: 110,\n  grid: true,\n  x: {nice: true},\n  y: {inset: 5},\n  color: {type: \"categorical\"},\n  marks: [\n    Plot.frame(),\n    Plot.dot(barley, {\n      x: \"yield\",\n      y: \"variety\",\n      fy: \"site\",\n      stroke: \"year\",\n      sort: {y: \"x\", fy: \"x\", reduce: \"median\", reverse: true}\n    })\n  ]\n})\n\nbarley = FileAttachment(\"barley.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Barley Trellis</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Barley Trellis

The [Trellis display](https://www.jstor.org/stable/1390777) by Becker _et al._ helped establish small multiples as a “powerful mechanism for understanding interactions in studies of how a response depends on explanatory variables”. Here we reproduce a trellis of Barley yields from the 1930s, complete with main-effects ordering—using the [**sort** mark option](https://observablehq.com/plot/features/scales#sort-mark-option)— to facilitate comparison.

Notice anything unusual about one of the sites? This anomaly led Becker _et al._ to suspect a major error with the data that went undetected for six decades.`
)}

function _2(Plot,barley){return(
Plot.plot({
  height: 800,
  marginRight: 90,
  marginLeft: 110,
  grid: true,
  x: {nice: true},
  y: {inset: 5},
  color: {type: "categorical"},
  marks: [
    Plot.frame(),
    Plot.dot(barley, {
      x: "yield",
      y: "variety",
      fy: "site",
      stroke: "year",
      sort: {y: "x", fy: "x", reduce: "median", reverse: true}
    })
  ]
})
)}

function _barley(FileAttachment){return(
FileAttachment("barley.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["barley.csv", {url: "https://static.observableusercontent.com/files/321ca5ed58d2cdc77d5e89a9faed844e15d248a421694da394c5e20eb19241e035ed985c769f212bd531072e89282741bd940c702890c112e86d785d17aa0350", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","barley"], _2);
  main.variable(observer("barley")).define("barley", ["FileAttachment"], _barley);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-two-dimensional-faceting"] = { code: "Plot.plot({\n  grid: true,\n  marginRight: 60,\n  facet: {label: null},\n  marks: [\n    Plot.frame(),\n    Plot.dot(penguins, {\n      x: \"culmen_length_mm\",\n      y: \"culmen_depth_mm\",\n      fx: \"sex\",\n      fy: \"species\"\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Two-dimensional faceting</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Two-dimensional faceting

Small multiple charts help comparison across modalities. The horizontal↔︎ [facet](https://observablehq.com/plot/features/facets) shows sex (with the rightmost column representing penguins whose sex field is null, indicating missing data), while the vertical↕︎ facet shows species.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  grid: true,
  marginRight: 60,
  facet: {label: null},
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {
      x: "culmen_length_mm",
      y: "culmen_depth_mm",
      fx: "sex",
      fy: "species"
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-non-faceted-marks"] = { code: "Plot.plot({\n  grid: true,\n  marginRight: 60,\n  facet: {label: null},\n  marks: [\n    Plot.frame(),\n    Plot.dot(penguins, {\n      x: \"culmen_length_mm\",\n      y: \"culmen_depth_mm\",\n      fill: \"#aaa\",\n      r: 1\n    }),\n    Plot.dot(penguins, {\n      x: \"culmen_length_mm\",\n      y: \"culmen_depth_mm\",\n      fx: \"sex\",\n      fy: \"species\"\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Non-faceted marks</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Non-faceted marks

The entire population of penguins is repeated in each [facet](https://observablehq.com/plot/features/facets) as small gray dots, making it easier to see how each facet compares to the whole.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  grid: true,
  marginRight: 60,
  facet: {label: null},
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {
      x: "culmen_length_mm",
      y: "culmen_depth_mm",
      fill: "#aaa",
      r: 1
    }),
    Plot.dot(penguins, {
      x: "culmen_length_mm",
      y: "culmen_depth_mm",
      fx: "sex",
      fy: "species"
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dot-bins"] = { code: "Plot.plot({\n  r: {range: [0, 14]},\n  marks: [\n    Plot.dot(olympians, Plot.binX({r: \"count\"}, {x: \"weight\"}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Dot histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Dot histogram

A [dot](https://observablehq.com/plot/marks/dot) mark with a radius [encoding](https://observablehq.com/plot/features/scales) representing the count of Olympic athletes, [binned](https://observablehq.com/plot/transforms/bin) by weight.`
)}

function _2(Plot,olympians){return(
Plot.plot({
  r: {range: [0, 14]},
  marks: [
    Plot.dot(olympians, Plot.binX({r: "count"}, {x: "weight"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-wealth-health-nations"] = { code: "year = Scrubber(d3.sort(d3.union(nations.map((d) => d.year))), {loop: false, delay: 1000 / 24})\n\nPlot.plot({\n  width: 1152,\n  height: 600,\n  grid: true,\n  x: { type: \"log\", domain: [200, 100e3] },\n  y: { domain: [15, 85], ticks: 8 },\n  color: { legend: true },\n  marks: [\n    Plot.dot(nations, Plot.groupZ({\n      x: lastDefined,\n      y: lastDefined,\n      r: lastDefined,\n      stroke: \"last\"\n    }, {\n      filter: (d) => d.year <= year,\n      x: \"income\",\n      y: \"lifeExpectancy\",\n      r: \"population\",\n      stroke: \"region\",\n      z: \"name\"\n    }))\n  ]\n})\n\nlastDefined = {\n  reduceIndex(I, X) {\n    for (let i = I.length - 1; i >= 0; --i) {\n      const x = X[I[i]];\n      if (x != null) {\n        return x;\n      }\n    }\n  }\n}\n\nnations = FileAttachment(\"nations.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: The Wealth & Health of Nations</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# The Wealth & Health of Nations

This is a [recreation](/@mbostock/the-wealth-health-of-nations) of a [Gapminder visualization](http://gapminder.org/world/) made famous by [Hans Rosling](https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen). It shows per-capita income (*x*), life expectancy (*y*) and population (*area*) of 180 nations over the last 209 years, colored by region. Data prior to 1950 is sparse, so this chart shows the latest value in the data.`
)}

function _year(Scrubber,d3,nations){return(
Scrubber(d3.sort(d3.union(nations.map((d) => d.year))), {loop: false, delay: 1000 / 24})
)}

function _3(Plot,nations,lastDefined,year){return(
Plot.plot({
  width: 1152,
  height: 600,
  grid: true,
  x: { type: "log", domain: [200, 100e3] },
  y: { domain: [15, 85], ticks: 8 },
  color: { legend: true },
  marks: [
    Plot.dot(nations, Plot.groupZ({
      x: lastDefined,
      y: lastDefined,
      r: lastDefined,
      stroke: "last"
    }, {
      filter: (d) => d.year <= year,
      x: "income",
      y: "lifeExpectancy",
      r: "population",
      stroke: "region",
      z: "name"
    }))
  ]
})
)}

function _lastDefined(){return(
{
  reduceIndex(I, X) {
    for (let i = I.length - 1; i >= 0; --i) {
      const x = X[I[i]];
      if (x != null) {
        return x;
      }
    }
  }
}
)}

function _nations(FileAttachment){return(
FileAttachment("nations.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("https://api.observablehq.com/d/450051d7f1174df8@254.js?v=4&resolutions=defc4738ee735cdb@82")).default));
  const fileAttachments = new Map([
    ["nations.json", {url: "https://static.observableusercontent.com/files/cc53935b519635eb9b17b3500a26c0af02ecd1c41e0b3b18955a048d4bce84af25ebb195cc0a6017a085ab2fa80d6213b0c7e4e84d67e6cee8a1639a76cb7994", mimeType: "application/json"}],
    ["nations.csv", {url: "https://static.observableusercontent.com/files/f3aaa869b15c50bc2374583e9e671f6a513983b5353076c12a9f5f03732881da17d2a009b2e2c41b7dc6299f077acc0d7ab534e5c512af31bcba331f20ac4ce6", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof year")).define("viewof year", ["Scrubber","d3","nations"], _year);
  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","nations","lastDefined","year"], _3);
  main.variable(observer("lastDefined")).define("lastDefined", _lastDefined);
  main.variable(observer("nations")).define("nations", ["FileAttachment"], _nations);
  main.define("Scrubber", ["module 1", "@variable"], (_, v) => v.import("Scrubber", _));
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dot-sort"] = { code: "sorted = Inputs.toggle({value: true, label: \"Use default sort\"})\n\nPlot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(statemesh, {strokeOpacity: 0.4}),\n    Plot.dot(counties, Plot.geoCentroid({\n      r: (d) => d.properties.population,\n      fill: \"currentColor\",\n      stroke: \"white\",\n      strokeWidth: 1,\n      sort: sorted\n        ? {channel: \"r\", order: \"descending\"} // explicitly sort “by descending radius”, which is the default\n        : null // draw points in input order\n    }))\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nstatemesh = topojson.mesh(us, us.objects.states)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Bubble map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Bubble map

By default, [dots](https://observablehq.com/plot/marks/dot) are sorted by descending radius. Toggle the checkbox to draw the dots in input order with sort: null.`
)}

function _sorted(Inputs){return(
Inputs.toggle({value: true, label: "Use default sort"})
)}

function _3(Plot,statemesh,counties,sorted){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(statemesh, {strokeOpacity: 0.4}),
    Plot.dot(counties, Plot.geoCentroid({
      r: (d) => d.properties.population,
      fill: "currentColor",
      stroke: "white",
      strokeWidth: 1,
      sort: sorted
        ? {channel: "r", order: "descending"} // explicitly sort “by descending radius”, which is the default
        : null // draw points in input order
    }))
  ]
})
)}

function _4(md){return(
md`---`
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function _7(md){return(
md`The cell below joins the counties geographies with the population data; see our [tutorial](https://observablehq.com/@observablehq/build-your-first-choropleth-map-with-observable-plot) for more details.`
)}

async function _counties(topojson,us,FileAttachment)
{
  const counties = topojson.feature(us, us.objects.counties);
  const pop = await FileAttachment("us-county-population.csv").csv();
  const map = new Map(pop.map((d) => [`${d.state}${d.county}`, +d.population]));
  counties.features.forEach((g) => {
    g.properties.population = map.get(g.id);
  });
  return counties.features;
}


function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}],
    ["us-county-population.csv", {url: "https://static.observableusercontent.com/files/914b363c63bdd462afde01a3ce4b0dcc9fd4d181bbe39054c3c6d381091aec497f4e69cd2106b45ecf4d51a8ca1fdbb61ea896a28ccffabd9888852825c40178", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof sorted")).define("viewof sorted", ["Inputs"], _sorted);
  main.variable(observer("sorted")).define("sorted", ["Generators", "viewof sorted"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","statemesh","counties","sorted"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("counties")).define("counties", ["topojson","us","FileAttachment"], _counties);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-us-bubble-map"] = { code: "Plot.plot({\n  width: 975,\n  projection: \"identity\",\n  r: { range: [0, 40] },\n  marks: [\n    Plot.geo(nation, { fill: \"#ddd\" }),\n    Plot.geo(statemesh, { stroke: \"white\" }),\n    Plot.dot(population, Plot.centroid({\n      r: \"population\",\n      fill: \"brown\",\n      fillOpacity: 0.5,\n      stroke: \"#fff\",\n      strokeOpacity: 0.5,\n      geometry: ({ state, county }) => countymap.get(`${state}${county}`),\n      channels: {\n        county: ({ state, county }) => countymap.get(`${state}${county}`)?.properties.name,\n        state: ({ state }) => statemap.get(state)?.properties.name\n      },\n      tip: true\n    })),\n\n    // Legend helper\n    radiusLegend([2, 5, 10], {r: (d) => d * 1e6, title: (d) => `${d}M`})\n  ]\n})\n\npopulation = FileAttachment(\"population.json\").json()\n  .then((data) =>\n    data\n      .slice(1) // removes a header line\n      .map(([p, state, county]) => ({\n        state,\n        county,\n        population: +p\n      }))\n  )\n\nus = FileAttachment(\"counties-albers-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\nstatemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))\n\ncountymap = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))\n\nstatemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)\n\nradiusLegend = (data, options) =>\n  Plot.dot(data, {\n    ...options,\n    frameAnchor: \"bottom-right\",\n    strokeWidth: 0.8,\n    dx: -40,\n    dy: -3,\n    render: (i, s, v, d, c, next) => {\n      const g = next(i, s, v, d, c);\n      d3.select(g)\n        .selectAll(\"circle\")\n        .each(function (i) {\n          const r = +this.getAttribute(\"r\");\n          const x = +this.getAttribute(\"cx\");\n          const y = +this.getAttribute(\"cy\");\n          this.setAttribute(\"transform\", `translate(0,${-r})`);\n          const title = d3.select(this).select(\"title\");\n          d3.select(g)\n            .append(\"text\")\n            .attr(\"x\", x)\n            .attr(\"y\", y - 2 * r - 4)\n            .attr(\"stroke\", \"none\")\n            .attr(\"fill\", \"currentColor\")\n            .text(title.text());\n          title.remove();\n        });\n      return g;\n    }\n  })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: U.S. bubble map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# U.S. bubble map

Estimated population by county, 2016. See also the [spike map](/@observablehq/plot-spike) as an alternative presentation of this data. Data: [American Community Survey](https://api.census.gov/data/2016/acs/acs5/cprofile/examples.html)`
)}

function _2(Plot,nation,statemesh,population,countymap,statemap,radiusLegend){return(
Plot.plot({
  width: 975,
  projection: "identity",
  r: { range: [0, 40] },
  marks: [
    Plot.geo(nation, { fill: "#ddd" }),
    Plot.geo(statemesh, { stroke: "white" }),
    Plot.dot(population, Plot.centroid({
      r: "population",
      fill: "brown",
      fillOpacity: 0.5,
      stroke: "#fff",
      strokeOpacity: 0.5,
      geometry: ({ state, county }) => countymap.get(`${state}${county}`),
      channels: {
        county: ({ state, county }) => countymap.get(`${state}${county}`)?.properties.name,
        state: ({ state }) => statemap.get(state)?.properties.name
      },
      tip: true
    })),

    // Legend helper
    radiusLegend([2, 5, 10], {r: (d) => d * 1e6, title: (d) => `${d}M`})
  ]
})
)}

function _3(md){return(
md`This dataset comes from the U.S. Census API and contains three columns: the estimated population (as a string), the two-digit state FIPS code, and the three-digit county FIPS code.`
)}

function _population(FileAttachment){return(
FileAttachment("population.json").json()
  .then((data) =>
    data
      .slice(1) // removes a header line
      .map(([p, state, county]) => ({
        state,
        county,
        population: +p
      }))
  )
)}

function _5(md){return(
md`The geometries used in this example are from the [TopoJSON U.S. Atlas](https://github.com/topojson/us-atlas), which are derived from the U.S. Census Bureau shapefiles. (There’s also the [TopoJSON World Atlas](https://github.com/topojson/world-atlas), which is derived from [Natural Earth](https://www.naturalearthdata.com).) The *counties* feature collection is all U.S. counties, using the five-digit FIPS identifier. The *statemap* lets us lookup the name of the state that contains a given county; a state’s two-digit identifier corresponds to the first two digits of its counties’ identifiers. Similarly, the *countymap* lets us lookup the name and geometry of each county.`
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemap(topojson,us){return(
new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))
)}

function _countymap(topojson,us){return(
new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))
)}

function _10(md){return(
md`The *statemesh* is just the internal borders between states, *i.e.*, everything but the coastlines and country borders. This avoids an additional stroke on the perimeter of the map, which would otherwise mask intricate features such as islands and inlets. (Try removing the last argument to topojson.mesh below to see the effect.)`
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states, (a, b) => a !== b)
)}

function _12(md){return(
md`Plot does not yet have an official radius legend (please vote up [#236](https://github.com/observablehq/plot/issues/236)!). In the meantime, here is a helper:`
)}

function _radiusLegend(Plot,d3){return(
(data, options) =>
  Plot.dot(data, {
    ...options,
    frameAnchor: "bottom-right",
    strokeWidth: 0.8,
    dx: -40,
    dy: -3,
    render: (i, s, v, d, c, next) => {
      const g = next(i, s, v, d, c);
      d3.select(g)
        .selectAll("circle")
        .each(function (i) {
          const r = +this.getAttribute("r");
          const x = +this.getAttribute("cx");
          const y = +this.getAttribute("cy");
          this.setAttribute("transform", `translate(0,${-r})`);
          const title = d3.select(this).select("title");
          d3.select(g)
            .append("text")
            .attr("x", x)
            .attr("y", y - 2 * r - 4)
            .attr("stroke", "none")
            .attr("fill", "currentColor")
            .text(title.text());
          title.remove();
        });
      return g;
    }
  })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["population.json", {url: "https://static.observableusercontent.com/files/b6be3f760074b3977c8095ed7fd0cd29d06860ec6b45ea56600e2ea5f03e8b1205c4705712c7866c6818109875824c9ad6b96bb3a40e4a6b43806432c40686bd", mimeType: "application/json"}],
    ["counties-albers-10m.json", {url: "https://static.observableusercontent.com/files/1ec3edc43ba66c0db419744c479d1b5118bb405587189f3ad739a10853f6f933d86824e809f4b4ad18053ab33fb5dc7c5f3d6bc601654c8ea976afd5b321f517", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","nation","statemesh","population","countymap","statemap","radiusLegend"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("population")).define("population", ["FileAttachment"], _population);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemap")).define("statemap", ["topojson","us"], _statemap);
  main.variable(observer("countymap")).define("countymap", ["topojson","us"], _countymap);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("radiusLegend")).define("radiusLegend", ["Plot","d3"], _radiusLegend);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-isotype-chart"] = { code: "Plot.plot({\n  width: 610,\n  height: 380,\n  marginLeft: 60,\n  marginRight: 100,\n  marginTop: 30,\n  y: {label: null},\n  fy: {paddingInner: 0.27, label: null},\n  marks: [\n    Plot.text(data, {\n      frameAnchor: \"left\",\n      fontSize: 40,\n      text: (d) => `${emoji[d.animal]} `.repeat(Math.round(d.count / 1e6)),\n      dx: 20,\n      y: \"animal\",\n      fy: \"country\"\n    }),\n    Plot.axisFy({ fontSize: 18, frameAnchor: \"top\", dy: -18 })\n  ],\n  caption: \"Live stock (millions)\"\n})\n\nemoji = { cattle: \"🐄\", sheep: \"🐑\", pigs: \"🐖\" }\n\ndata = [\n  { animal: \"pigs\", country: \"Great Britain\", count: 1354979 },\n  { animal: \"cattle\", country: \"Great Britain\", count: 3962921 },\n  { animal: \"sheep\", country: \"Great Britain\", count: 10931215 },\n  { animal: \"pigs\", country: \"United States\", count: 6281935 },\n  { animal: \"cattle\", country: \"United States\", count: 9917873 },\n  { animal: \"sheep\", country: \"United States\", count: 7084151 }\n]", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Isotype Chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Isotype Chart

Emoji icons [repeated](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) as many times as necessary, and rendered with the [text](https://observablehq.com/plot/marks/text) mark for unit charts à la [Isotype](https://eagereyes.org/techniques/isotype).`
)}

function _2(Plot,data,emoji){return(
Plot.plot({
  width: 610,
  height: 380,
  marginLeft: 60,
  marginRight: 100,
  marginTop: 30,
  y: {label: null},
  fy: {paddingInner: 0.27, label: null},
  marks: [
    Plot.text(data, {
      frameAnchor: "left",
      fontSize: 40,
      text: (d) => `${emoji[d.animal]} `.repeat(Math.round(d.count / 1e6)),
      dx: 20,
      y: "animal",
      fy: "country"
    }),
    Plot.axisFy({ fontSize: 18, frameAnchor: "top", dy: -18 })
  ],
  caption: "Live stock (millions)"
})
)}

function _emoji(){return(
{ cattle: "🐄", sheep: "🐑", pigs: "🐖" }
)}

function _data(){return(
[
  { animal: "pigs", country: "Great Britain", count: 1354979 },
  { animal: "cattle", country: "Great Britain", count: 3962921 },
  { animal: "sheep", country: "Great Britain", count: 10931215 },
  { animal: "pigs", country: "United States", count: 6281935 },
  { animal: "cattle", country: "United States", count: 9917873 },
  { animal: "sheep", country: "United States", count: 7084151 }
]
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","data","emoji"], _2);
  main.variable(observer("emoji")).define("emoji", _emoji);
  main.variable(observer("data")).define("data", _data);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-anscombes-quartet"] = { code: "Plot.plot({\n  grid: true,\n  aspectRatio: 0.5,\n  facet: {data: anscombe, x: \"series\"},\n  marks: [\n    Plot.frame(),\n    Plot.line(anscombe, {x: \"x\", y: \"y\"}),\n    Plot.dot(anscombe, {x: \"x\", y: \"y\"})\n  ]\n})\n\nanscombe = FileAttachment(\"anscombe.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Anscombe’s quartet</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Anscombe’s quartet

The **[facet](https://observablehq.com/plot/features/facets)** plot option is an alternative to the **fx** and **fy** mark options. It is useful when multiple marks share the same data, such as the [line](https://observablehq.com/plot/marks/line) and [dot](https://observablehq.com/plot/marks/dot) marks below.`
)}

function _2(Plot,anscombe){return(
Plot.plot({
  grid: true,
  aspectRatio: 0.5,
  facet: {data: anscombe, x: "series"},
  marks: [
    Plot.frame(),
    Plot.line(anscombe, {x: "x", y: "y"}),
    Plot.dot(anscombe, {x: "x", y: "y"})
  ]
})
)}

function _anscombe(FileAttachment){return(
FileAttachment("anscombe.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["anscombe.csv", {url: "https://static.observableusercontent.com/files/8e877b95769630c8f6aba42fe61682a90a94f7d14b7daf0f413df2cc691ca6d00e194788e5266015fe4291a8e3fb6f377c7a7f7ca9932c5f7270240889e4186f", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","anscombe"], _2);
  main.variable(observer("anscombe")).define("anscombe", ["FileAttachment"], _anscombe);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-horizontal-bar-chart"] = { code: "Plot.plot({\n  x: {\n    axis: \"top\",\n    grid: true,\n    percent: true\n  },\n  marks: [\n    Plot.ruleX([0]),\n    Plot.barX(alphabet, {x: \"frequency\", y: \"letter\", sort: {y: \"x\", reverse: true}})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Horizontal bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Horizontal bar chart

The ordinal dimension (letters) is, in this case, explicitly [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) according to the *x* dimension, *i.e.* the size of each bar, instead of following the natural order (alphabetical) of its domain.`
)}

function _2(Plot,alphabet){return(
Plot.plot({
  x: {
    axis: "top",
    grid: true,
    percent: true
  },
  marks: [
    Plot.ruleX([0]),
    Plot.barX(alphabet, {x: "frequency", y: "letter", sort: {y: "x", reverse: true}})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-vertical-bar-chart"] = { code: "Plot.plot({\n  y: {\n    grid: true,\n    percent: true\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.barY(alphabet, {x: \"letter\", y: \"frequency\", sort: {x: \"y\", reverse: true}})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Vertical bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Vertical bar chart

The ordinal dimension (letters) is, in this case, explicitly [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) according to the *y* dimension, *i.e.* the size of each bar, instead of following the natural order (alphabetical) of its domain.`
)}

function _2(Plot,alphabet){return(
Plot.plot({
  y: {
    grid: true,
    percent: true
  },
  marks: [
    Plot.ruleY([0]),
    Plot.barY(alphabet, {x: "letter", y: "frequency", sort: {x: "y", reverse: true}})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-grouped-bar-chart"] = { code: "Plot.plot({\n  x: {axis: null},\n  y: {tickFormat: \"s\", grid: true},\n  color: {scheme: \"spectral\", legend: true},\n  marks: [\n    Plot.barY(data, {\n      x: \"key\",\n      y: \"population\",\n      fill: \"key\",\n      fx: \"state\",\n      sort: {x: null, color: null, fx: {value: \"-y\", reduce: \"sum\"}}\n    }),\n    Plot.ruleY([0])\n  ]\n})\n\ndata = FileAttachment(\"population-state-age.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Grouped bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Grouped bar chart

[Facets](https://observablehq.com/plot/features/facets) group the bars by State; the *fx* domain, representing States, is [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) by the sum total of the heights of the bars (in other words, by total population). Each facet is a simple bar chart, with the ordinal *x* position ordered by age (*keys*).`
)}

function _2(Plot,data){return(
Plot.plot({
  x: {axis: null},
  y: {tickFormat: "s", grid: true},
  color: {scheme: "spectral", legend: true},
  marks: [
    Plot.barY(data, {
      x: "key",
      y: "population",
      fill: "key",
      fx: "state",
      sort: {x: null, color: null, fx: {value: "-y", reduce: "sum"}}
    }),
    Plot.ruleY([0])
  ]
})
)}

function _data(FileAttachment){return(
FileAttachment("population-state-age.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["population-state-age.csv", {url: "https://static.observableusercontent.com/files/e6a1c683df2962a2cce8a54e29858393318a3e07777ee2650003325fbed36f4ddb1bef54300f3a0db0248ac1b44dc03473eebb2e75ed36d75dfff39d03d7ef8e", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","data"], _2);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-olympians-grouped-bar-chart"] = { code: "Plot.plot({\n  marginBottom: 100,\n  fx: {padding: 0, label: null, tickRotate: 90, tickSize: 6},\n  x: {axis: null, paddingOuter: 0.2},\n  y: {grid: true},\n  color: {legend: true},\n  marks: [\n    Plot.barY(olympians, Plot.groupX({y2: \"count\"}, {x: \"sex\", fx: \"sport\", fill: \"sex\"})),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Olympians grouped bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Olympians grouped bar chart

The *color* scale, which also represents _sex_, is redundant with *x*, allowing us to suppress the *x* axis and instead rely on the color [legend](https://observablehq.com/plot/features/legends) to help the reader understand the chart’s encodings. The [facets](https://observablehq.com/plot/features/facets) (representing _sports_) are separated by making the *x* [scale](https://observablehq.com/plot/features/scales)’s paddingOuter option a bit larger than the default. `
)}

function _2(Plot,olympians){return(
Plot.plot({
  marginBottom: 100,
  fx: {padding: 0, label: null, tickRotate: 90, tickSize: 6},
  x: {axis: null, paddingOuter: 0.2},
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.barY(olympians, Plot.groupX({y2: "count"}, {x: "sex", fx: "sport", fill: "sex"})),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-state-population-change"] = { code: "Plot.plot({\n  label: null,\n  x: {\n    axis: \"top\",\n    label: \"← decrease · Change in population, 2010–2019 (%) · increase →\",\n    labelAnchor: \"center\",\n    tickFormat: \"+\",\n    percent: true\n  },\n  color: {\n    scheme: \"PiYG\",\n    type: \"ordinal\"\n  },\n  marks: [\n    Plot.barX(statepop, {\n      x: \"value\",\n      y: \"State\",\n      fill: (d) => d.value > 0,\n      sort: { y: \"x\" }\n    }),\n    Plot.gridX({ stroke: \"white\", strokeOpacity: 0.5 }),\n    d3\n      .groups(statepop, (d) => d.value > 0)\n      .map(([growth, states]) => [\n        Plot.axisY({\n          x: 0,\n          ticks: states.map((d) => d.State),\n          tickSize: 0,\n          anchor: growth ? \"left\" : \"right\"\n        }),\n        Plot.textX(states, {\n          x: \"value\",\n          y: \"State\",\n          text: ((f) => (d) => f(d.value))(d3.format(\"+.1%\")),\n          textAnchor: growth ? \"start\" : \"end\",\n          dx: growth ? 4 : -4,\n        })\n      ]),\n    Plot.ruleX([0])\n  ]\n})\n\nstatepop = FileAttachment(\"us-state-population-2010-2019.csv\").csv({typed: true})\n  .then(data => data.map((d) => ({...d, value: (d[2019] - d[2010]) / d[2010]})))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: State population change</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# State population change

This diverging [bar](https://observablehq.com/plot/marks/bar) mark is sized by the population change in each State (between 2010 and 2019). The states are [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) according to the same channel *x*. A white [grid](https://observablehq.com/plot/marks/grid), a [rule](https://observablehq.com/plot/marks/rule) and a *y* [axis](https://observablehq.com/plot/marks/axis) placed at the center (*x*: 0) give the final touch.`
)}

function _2(Plot,statepop,d3){return(
Plot.plot({
  label: null,
  x: {
    axis: "top",
    label: "← decrease · Change in population, 2010–2019 (%) · increase →",
    labelAnchor: "center",
    tickFormat: "+",
    percent: true
  },
  color: {
    scheme: "PiYG",
    type: "ordinal"
  },
  marks: [
    Plot.barX(statepop, {
      x: "value",
      y: "State",
      fill: (d) => d.value > 0,
      sort: { y: "x" }
    }),
    Plot.gridX({ stroke: "white", strokeOpacity: 0.5 }),
    d3
      .groups(statepop, (d) => d.value > 0)
      .map(([growth, states]) => [
        Plot.axisY({
          x: 0,
          ticks: states.map((d) => d.State),
          tickSize: 0,
          anchor: growth ? "left" : "right"
        }),
        Plot.textX(states, {
          x: "value",
          y: "State",
          text: ((f) => (d) => f(d.value))(d3.format("+.1%")),
          textAnchor: growth ? "start" : "end",
          dx: growth ? 4 : -4,
        })
      ]),
    Plot.ruleX([0])
  ]
})
)}

function _statepop(FileAttachment){return(
FileAttachment("us-state-population-2010-2019.csv").csv({typed: true})
  .then(data => data.map((d) => ({...d, value: (d[2019] - d[2010]) / d[2010]})))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-state-population-2010-2019.csv", {url: "https://static.observableusercontent.com/files/aac969458debe147fe75013193b284213a37880132d1e099e40baca431f6ee996e73eecb08582dc9349a7c5ddf6312043c928c816456497befb8a2c9ee8017ee", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","statepop","d3"], _2);
  main.variable(observer("statepop")).define("statepop", ["FileAttachment"], _statepop);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-diverging-stacked-bar"] = { code: "Plot.plot({\n  x: {tickFormat: Math.abs},\n  color: {domain: likert.order, scheme: \"RdBu\", legend: true},\n  marks: [\n    Plot.barX(\n      survey,\n      Plot.groupZ({x: \"count\"}, {fy: \"Question\", fill: \"Response\", ...likert})\n    ),\n    Plot.ruleX([0])\n  ]\n})\n\nlikert = Likert([\n  [\"Strongly Disagree\", -1],\n  [\"Disagree\", -1],\n  [\"Neutral\", 0],\n  [\"Agree\", 1],\n  [\"Strongly Agree\", 1]\n])\n\nPlot.plot({\n  x: { tickFormat: Math.abs, label: \"# of answers\" },\n  y: { tickSize: 0 },\n  color: {\n    legend: true,\n    domain: [\n      \"Strongly Disagree\",\n      \"Disagree\",\n      \"Neutral\",\n      \"Agree\",\n      \"Strongly Agree\"\n    ],\n    scheme: \"RdBu\"\n  },\n  marks: [\n    Plot.barX(\n      survey,\n      Plot.groupY(\n        { x: \"count\" },\n        {\n          fill: \"Response\",\n          order: [\n            \"Strongly Disagree\",\n            \"Disagree\",\n            \"Neutral\",\n            \"Agree\",\n            \"Strongly Agree\"\n          ],\n          y: \"Question\"\n        }\n      )\n    )\n  ]\n})\n\nsign = (label) => label.match(/neutral/i) ? 0 : label.match(/disagree/i) ? -1 : 1\n\nPlot.plot({\n  color: {\n    domain: [\n      \"Strongly Disagree\",\n      \"Disagree\",\n      \"Neutral\",\n      \"Agree\",\n      \"Strongly Agree\"\n    ],\n    scheme: \"RdBu\"\n  },\n  marks: [\n    Plot.barX(\n      survey,\n      Plot.groupY(\n        { x: (d) => d.length * sign(d[0].Response) },\n        {\n          fill: \"Response\",\n          order: [\n            \"Strongly Disagree\",\n            \"Disagree\",\n            \"Neutral\",\n            \"Agree\",\n            \"Strongly Agree\"\n          ],\n          y: \"Question\"\n        }\n      )\n    )\n  ]\n})\n\nnormalize = Inputs.toggle({ label: \"normalize\" })\n\nLikert = function Likert(responses) {\n  const map = new Map(responses);\n  return {\n    order: Array.from(map.keys()),\n    offset(I, X1, X2, Z) {\n      for (const stacks of I) {\n        for (const stack of stacks) {\n          const k = d3.sum(stack, (i) => (X2[i] - X1[i]) * (1 - map.get(Z[i]))) / 2;\n          for (const i of stack) {\n            X1[i] -= k;\n            X2[i] -= k;\n          }\n        }\n      }\n    }\n  };\n}\n\nsurvey = FileAttachment(\"survey.json\").json()\n\nInputs.table(survey, { columns: [\"ID\", \"Question\", \"Response\"], width: 370 })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Diverging stacked bars</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Diverging stacked bars

The dataset contains hundreds of answers to a survey. There are five questions, and the answers rank from negative/red (“Strongly Disagree”, “Disagree”), then neutral/gray, to positive/blue (“Agree”, “Strongly Agree”). Answers are counted and represented as bars describing the absolute frequency of each response. The [bars](https://observablehq.com/plot/marks/bar) are organized in the order of their semantic value, with the
negative answers flowing to the left, and the positive answers flowing to the right. Neutral answers sit in the center. We use a custom [stack offset](https://observablehq.com/plot/transforms/stack#stack-options) to position the bars correctly.`
)}

function _2(Plot,likert,survey){return(
Plot.plot({
  x: {tickFormat: Math.abs},
  color: {domain: likert.order, scheme: "RdBu", legend: true},
  marks: [
    Plot.barX(
      survey,
      Plot.groupZ({x: "count"}, {fy: "Question", fill: "Response", ...likert})
    ),
    Plot.ruleX([0])
  ]
})
)}

function _likert(Likert){return(
Likert([
  ["Strongly Disagree", -1],
  ["Disagree", -1],
  ["Neutral", 0],
  ["Agree", 1],
  ["Strongly Agree", 1]
])
)}

function _4(md){return(
md`For a reference, see Naomi B. Robbins and Richard M. Heiberger, “Plotting Likert
and Other Rating Scales”, 2011
([PDF](http://www.asasrms.org/Proceedings/y2011/Files/300784_64164.pdf)).

_Thanks to [Eitan Lees](/@eitanlees) for asking the
[question](https://talk.observablehq.com/t/diverging-stacked-bar-chart-in-plot/6028)
that prompted this notebook. The write-up below details how we built the chart
(click on the cell definitions to see the code at each stage)._

---`
)}

function _5(md){return(
md`### First try: stacking bars`
)}

function _6(md){return(
md`Using Plot.groupY and fill: "Response" allows us to create a bar for each type of response to each question. The length of each bar corresponds to the count of the corresponding answers (as the *fill* or *z* channel) to the question (as the *y* channel).`
)}

function _7(Plot,survey){return(
Plot.plot({
  x: { tickFormat: Math.abs, label: "# of answers" },
  y: { tickSize: 0 },
  color: {
    legend: true,
    domain: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    scheme: "RdBu"
  },
  marks: [
    Plot.barX(
      survey,
      Plot.groupY(
        { x: "count" },
        {
          fill: "Response",
          order: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree"
          ],
          y: "Question"
        }
      )
    )
  ]
})
)}

function _8(md){return(
md`The next step is to make the red answers flow to the left, the blue answers to the right, and the gray centered.`
)}

function _9(md){return(
md`### Second try: negative vs positive
We introduce a function that returns the sign of a response: -1 for negatives, 0 for neutral, and 1 for positives. This allows us to send the red bars to the left, and the blue ones to the right:`
)}

function _sign(){return(
(label) => label.match(/neutral/i) ? 0 : label.match(/disagree/i) ? -1 : 1
)}

function _11(Plot,survey,sign){return(
Plot.plot({
  color: {
    domain: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    scheme: "RdBu"
  },
  marks: [
    Plot.barX(
      survey,
      Plot.groupY(
        { x: (d) => d.length * sign(d[0].Response) },
        {
          fill: "Response",
          order: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree"
          ],
          y: "Question"
        }
      )
    )
  ]
})
)}

function _12(md){return(
md`However, this immediately raises two issues: first, the neutral value has
disappeared, because we multiplied it by zero. Second, the negative bars grow to
the left from the first element of the scale (“Strongly disagree”), resulting in
a bad ordering.`
)}

function _13(md){return(
md`### Solution: a custom offset

Since the standard strategy followed by Plot.stack ignores neutral values, we can define an offset function (a new feature introduced in Plot 0.4.3). The Likert function below takes as input the association between responses and their rating (positive, negative or neutral), and returns both an *order* and a custom *offset* to use in a stack transform.`
)}

function _normalize(Inputs){return(
Inputs.toggle({ label: "normalize" })
)}

function _15(Likert,Plot,normalize,survey)
{
  const { order, offset } = Likert([
    ["Strongly Disagree", -1],
    ["Disagree", -1],
    ["Neutral", 0],
    ["Agree", 1],
    ["Strongly Agree", 1]
  ]);

  return Plot.plot({
    x: normalize
      ? { tickFormat: "%", label: "answers (%)" }
      : { tickFormat: Math.abs, label: "# of answers" },
    y: { tickSize: 0 },
    facet: { data: survey, y: "Question" },
    color: { domain: order, scheme: "RdBu" },
    marks: [
      Plot.barX(
        survey,
        Plot.groupZ(
          { x: normalize ? "proportion-facet" : "count" },
          {
            fill: "Response",
            stroke: "#777",
            strokeWidth: 0.5,
            order,
            offset
          }
        )
      ),
      Plot.textX(
        survey,
        Plot.stackX(
          Plot.groupZ(
            { x: normalize ? "proportion-facet" : "count", text: "first" },
            {
              text: (d) => d.Response.replace(/[^A-Z]/g, ""),
              z: "Response",
              order,
              offset
            }
          )
        )
      )
    ]
  });
}


function _16(md){return(
md`Note that, by splitting the dataset by question, we can use the proportion-facet reducer to normalize each question to a total of 100%. An alternative approach would be to normalize inside the offset function.`
)}

function _Likert(d3){return(
function Likert(responses) {
  const map = new Map(responses);
  return {
    order: Array.from(map.keys()),
    offset(I, X1, X2, Z) {
      for (const stacks of I) {
        for (const stack of stacks) {
          const k = d3.sum(stack, (i) => (X2[i] - X1[i]) * (1 - map.get(Z[i]))) / 2;
          for (const i of stack) {
            X1[i] -= k;
            X2[i] -= k;
          }
        }
      }
    }
  };
}
)}

function _18(md){return(
md`---
*data*`
)}

function _survey(FileAttachment){return(
FileAttachment("survey.json").json()
)}

function _20(Inputs,survey){return(
Inputs.table(survey, { columns: ["ID", "Question", "Response"], width: 370 })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["survey.json", {url: "https://static.observableusercontent.com/files/db114ca90b9526cbe01835da759e1c622c33e93118aa18148e32899bb7eb998b34e820003f5fefd7e50f5cfca6713e34fc674b99a5edd3b6c1598af14cac615a", mimeType: "application/json"}],
    ["plot.umd.js", {url: "https://static.observableusercontent.com/files/fdb8b318164a24e12b7dcb5e22495a5a052d11fdf67a6c2a21fec7e077de3c3fb49af512cbe14633ea4dce72e3c45bcc703056856a2fa14d850692e968ef48f0", mimeType: "application/javascript"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","likert","survey"], _2);
  main.variable(observer("likert")).define("likert", ["Likert"], _likert);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","survey"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("sign")).define("sign", _sign);
  main.variable(observer()).define(["Plot","survey","sign"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof normalize")).define("viewof normalize", ["Inputs"], _normalize);
  main.variable(observer("normalize")).define("normalize", ["Generators", "viewof normalize"], (G, _) => G.input(_));
  main.variable(observer()).define(["Likert","Plot","normalize","survey"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("Likert")).define("Likert", ["d3"], _Likert);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("survey")).define("survey", ["FileAttachment"], _survey);
  main.variable(observer()).define(["Inputs","survey"], _20);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacked-bars"] = { code: "Plot.barY(\n  penguins,\n  Plot.groupX({ y: \"count\" }, { x: \"island\", fill: \"species\" })\n).plot({ color: { legend: true } })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked bars</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked bars

Group and count data sharing the same *x* base (here, the island where penguins were counted) and *fill* color (their species). The [bar](https://observablehq.com/plot/marks/bar) mark implicitly [stacks](https://observablehq.com/plot/transforms/stack) values, avoiding occlusion between bars and allowing to a part-to-whole comparison on a given *x*.`
)}

function _2(Plot,penguins){return(
Plot.barY(
  penguins,
  Plot.groupX({ y: "count" }, { x: "island", fill: "species" })
).plot({ color: { legend: true } })
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-crimean-war-bary"] = { code: "Plot.plot({\n  x: {\n    interval: \"month\",\n    tickFormat: (d) => d.toLocaleString(\"en\", {month: \"narrow\"}),\n    label: null\n  },\n  y: {grid: true},\n  marks: [\n    Plot.barY(crimea, {x: \"date\", y: \"deaths\", fill: \"cause\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(d3,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Crimean war casualties by cause (with barY)</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Crimean war casualties by cause

A stacked bar chart of [deaths in the Crimean War](https://en.wikipedia.org/wiki/Florence_Nightingale#Crimean_War)—predominantly from <span style="border-bottom: solid ${d3.schemeTableau10[0]} 3px;">disease</span>—using Florence Nightingale’s data. This uses the [bar](https://observablehq.com/plot/marks/bar) mark, with dates quantized by the [interval scale option](https://observablehq.com/plot/features/scales#interval)—compare with the [rect-mark](https://observablehq.com/@observablehq/plot-crimean-war-recty) variant.`
)}

function _2(Plot,crimea){return(
Plot.plot({
  x: {
    interval: "month",
    tickFormat: (d) => d.toLocaleString("en", {month: "narrow"}),
    label: null
  },
  y: {grid: true},
  marks: [
    Plot.barY(crimea, {x: "date", y: "deaths", fill: "cause"}),
    Plot.ruleY([0])
  ]
})
)}

async function _crimea(FileAttachment)
{
  const data = await FileAttachment("crimean-war.csv").csv({ typed: true });
  return data.columns.slice(2)
    .flatMap((cause) => data.map(({ date, [cause]: deaths }) => ({ date, cause, deaths })));
}


function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["crimean-war.csv", {url: "https://static.observableusercontent.com/files/493a2896e4ba5d7132d4b924fde510a519876cecb90c911c57b71ed5d6844eb151f8a874f029362af9a60330f70c98ed9790cb9902e828a592e82e7e86b43137", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["d3","md"], _1);
  main.variable(observer()).define(["Plot","crimea"], _2);
  main.variable(observer("crimea")).define("crimea", ["FileAttachment"], _crimea);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-crimean-war-recty"] = { code: "Plot.plot({\n  y: {grid: true},\n  marks: [\n    Plot.rectY(crimea, {x: \"date\", y: \"deaths\", interval: \"month\", fill: \"cause\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(d3,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Crimean war casualties by cause (with rectY)</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Crimean war casualties by cause 2

A stacked bar chart of [deaths in the Crimean War](https://en.wikipedia.org/wiki/Florence_Nightingale#Crimean_War)—predominantly from <span style="border-bottom: solid ${d3.schemeTableau10[0]} 3px;">disease</span>—using Florence Nightingale’s data. This uses the [rect](https://observablehq.com/plot/marks/rect) mark, with binned dates—compare with the [bar-mark](https://observablehq.com/@observablehq/plot-crimean-war-bary) variant.`
)}

function _2(Plot,crimea){return(
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.rectY(crimea, {x: "date", y: "deaths", interval: "month", fill: "cause"}),
    Plot.ruleY([0])
  ]
})
)}

async function _crimea(FileAttachment)
{
  const data = await FileAttachment("crimean-war.csv").csv({ typed: true });
  return data.columns.slice(2)
    .flatMap((cause) => data.map(({ date, [cause]: deaths }) => ({ date, cause, deaths })));
}


function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["crimean-war.csv", {url: "https://static.observableusercontent.com/files/493a2896e4ba5d7132d4b924fde510a519876cecb90c911c57b71ed5d6844eb151f8a874f029362af9a60330f70c98ed9790cb9902e828a592e82e7e86b43137", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["d3","md"], _1);
  main.variable(observer()).define(["Plot","crimea"], _2);
  main.variable(observer("crimea")).define("crimea", ["FileAttachment"], _crimea);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-vertical-bars-rotated-labels"] = { code: "Plot.plot({\n  marginBottom: 60,\n  x: {\n    tickRotate: -30,\n  },\n  y: {\n    transform: (d) => d / 1000,\n    label: \"↑ Market value (US dollars, billions)\",\n    grid: 5\n  },\n  marks: [\n    Plot.ruleY([0]),\n    \n    Plot.barY(brands, {\n      x: \"name\",\n      y: \"value\",\n      sort: { x: \"y\", reverse: true, limit: 20 },\n      fill: \"steelblue\"\n    }),\n  ]\n})\n\nbrands = FileAttachment(\"brands-2018.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Vertical bars, rotated labels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Vertical bars, rotated labels

The [tickRotate](https://observablehq.com/plot/marks/axis#axis-options) axis option rotates the tick labels.`
)}

function _2(Plot,brands){return(
Plot.plot({
  marginBottom: 60,
  x: {
    tickRotate: -30,
  },
  y: {
    transform: (d) => d / 1000,
    label: "↑ Market value (US dollars, billions)",
    grid: 5
  },
  marks: [
    Plot.ruleY([0]),
    
    Plot.barY(brands, {
      x: "name",
      y: "value",
      sort: { x: "y", reverse: true, limit: 20 },
      fill: "steelblue"
    }),
  ]
})
)}

function _3(md){return(
md`Data: Interbrand. Market value of 100 top global brands in 2018, millions of dollars. `
)}

function _brands(FileAttachment){return(
FileAttachment("brands-2018.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["brands-2018.csv", {url: "https://static.observableusercontent.com/files/e25276a22173f550def0bcf8abb3e64f14b557786172599f29b7ba27911f1261f8a44b44d4ec9f89088325ba3601f5933e8641f673129550632f7fdf328a1904", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","brands"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("brands")).define("brands", ["FileAttachment"], _brands);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-horizontal-bar-chart-with-label"] = { code: "Plot.plot({\n  marginLeft: 90,\n  x: { axis: null },\n  y: { label: null },\n  marks: [\n    Plot.barX(brands, {\n      x: \"value\",\n      y: \"name\",\n      sort: { y: \"x\", reverse: true, limit: 10 }\n    }),\n\n    Plot.text(brands, {\n      text: d => `${Math.floor(d.value / 1000)} B`,\n      y: \"name\",\n      x: \"value\",\n      textAnchor: \"end\",\n      dx: -3,\n      fill: \"white\"\n    })\n  ]\n})\n\nbrands = FileAttachment(\"brands-2018.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Horizontal bar chart with a label</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Horizontal bar chart with a label

Here is one way to set labels atop a [bar](https://observablehq.com/plot/marks/bar) mark; for more, see [these variants](https://observablehq.com/@observablehq/plot-labelled-horizontal-bar-chart-variants). Data: Interbrand. Market value of 10 top global brands in 2018, in millions of dollars. `
)}

function _2(Plot,brands){return(
Plot.plot({
  marginLeft: 90,
  x: { axis: null },
  y: { label: null },
  marks: [
    Plot.barX(brands, {
      x: "value",
      y: "name",
      sort: { y: "x", reverse: true, limit: 10 }
    }),

    Plot.text(brands, {
      text: d => `${Math.floor(d.value / 1000)} B`,
      y: "name",
      x: "value",
      textAnchor: "end",
      dx: -3,
      fill: "white"
    })
  ]
})
)}

function _brands(FileAttachment){return(
FileAttachment("brands-2018.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["brands-2018.csv", {url: "https://static.observableusercontent.com/files/e25276a22173f550def0bcf8abb3e64f14b557786172599f29b7ba27911f1261f8a44b44d4ec9f89088325ba3601f5933e8641f673129550632f7fdf328a1904", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","brands"], _2);
  main.variable(observer("brands")).define("brands", ["FileAttachment"], _brands);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-horizontal-stacked-bars"] = { code: "Plot.plot({\n  marginLeft: 90,\n  color: { legend: true },\n  marks: [Plot.barX(congress, Plot.groupZ({ x: \"count\" }, { fill: \"gender\" }))]\n})\n\nPlot.plot({\n  marginLeft: 90,\n  marks: [\n    Plot.barX(\n      congress,\n      Plot.groupY(\n        { x: \"count\" },\n        { fill: \"gender\", y: \"party\", sort: { y: \"x\", reverse: true } }\n      )\n    )\n  ]\n})\n\nPlot.plot({\n  marginLeft: 90,\n  color: { scheme: \"Dark2\", legend: true },\n  x: { percent: true },\n  marks: [\n    Plot.barX(\n      congress,\n      Plot.groupY(\n        { x: \"count\" },\n        {\n          fill: \"party\",\n          y: \"gender\",\n          sort: { y: \"x\", reverse: true, color: \"width\" },\n          offset: \"normalize\"\n        }\n      )\n    )\n  ]\n})\n\ncongress = FileAttachment(\"us-congress-2023.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Horizontal stacked bars</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Horizontal stacked bars

The [bar](https://observablehq.com/plot/marks/bar) mark implicitly [stacks](https://observablehq.com/plot/transforms/stack) values, allowing to immediately see a total as well as do part-to-whole comparisons.`
)}

function _2(md){return(
md`Let’s look at the gender distribution of members of the U.S. Congress in 2023. First, the number of women (F) and men (M):`
)}

function _3(Plot,congress){return(
Plot.plot({
  marginLeft: 90,
  color: { legend: true },
  marks: [Plot.barX(congress, Plot.groupZ({ x: "count" }, { fill: "gender" }))]
})
)}

function _4(md){return(
md`We can split these by party affiliation (sorting the parties by their number of seats):`
)}

function _5(Plot,congress){return(
Plot.plot({
  marginLeft: 90,
  marks: [
    Plot.barX(
      congress,
      Plot.groupY(
        { x: "count" },
        { fill: "gender", y: "party", sort: { y: "x", reverse: true } }
      )
    )
  ]
})
)}

function _6(md){return(
md`Or reverse the grouping and color encoding, and compare the party affiliation of women representatives vs men representatives, using the _normalize_ [stack offset](https://observablehq.com/plot/transforms/stack#stack-options) to compare proportions rather than absolute counts:`
)}

function _7(Plot,congress){return(
Plot.plot({
  marginLeft: 90,
  color: { scheme: "Dark2", legend: true },
  x: { percent: true },
  marks: [
    Plot.barX(
      congress,
      Plot.groupY(
        { x: "count" },
        {
          fill: "party",
          y: "gender",
          sort: { y: "x", reverse: true, color: "width" },
          offset: "normalize"
        }
      )
    )
  ]
})
)}

function _congress(FileAttachment){return(
FileAttachment("us-congress-2023.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-congress-2023.csv", {url: "https://static.observableusercontent.com/files/319a5af79c7fd8d4cccccabb4677debbb255e3e5897d415724edefe421e85cb1e711c08bc19f1ea7f49610aeba13bf75961f9d71e7bd46ef53d942cf03ccb39a", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["Plot","congress"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","congress"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","congress"], _7);
  main.variable(observer("congress")).define("congress", ["FileAttachment"], _congress);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ordinal-bar-chart"] = { code: "Plot.plot({\n  height: 280,\n  marginBottom: 35,\n  x: { interval: \"quarter\", label: null },\n  marks: [\n    Plot.axisX({tickFormat: \"Q%q\", ticks: 30}),\n    Plot.axisX({\n      tickFormat: (d) => (d.getUTCMonth() === 3 ? `${d.getUTCFullYear()}` : \"\"),\n      tickSize: 0,\n      textAnchor: \"start\",\n      ticks: 30,\n      dy: 14\n    }),\n    Plot.barY(vacancies, { x: \"month\", y: \"vacancies\" }),\n    Plot.ruleY([0])\n  ]\n})\n\nvacancies = FileAttachment(\"vacancies.csv\").csv({typed: true}).then(d => d.slice(106, 127))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Ordinal bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Ordinal bar chart

Use the [interval scale option](https://observablehq.com/plot/features/scales#interval) to make sure that missing data is not invisibly skipped:`
)}

function _2(Plot,vacancies){return(
Plot.plot({
  height: 280,
  marginBottom: 35,
  x: { interval: "quarter", label: null },
  marks: [
    Plot.axisX({tickFormat: "Q%q", ticks: 30}),
    Plot.axisX({
      tickFormat: (d) => (d.getUTCMonth() === 3 ? `${d.getUTCFullYear()}` : ""),
      tickSize: 0,
      textAnchor: "start",
      ticks: 30,
      dy: 14
    }),
    Plot.barY(vacancies, { x: "month", y: "vacancies" }),
    Plot.ruleY([0])
  ]
})
)}

function _vacancies(FileAttachment){return(
FileAttachment("vacancies.csv").csv({typed: true}).then(d => d.slice(106, 127))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["vacancies.csv", {url: "https://static.observableusercontent.com/files/8f0b9f1c91c6eaba248587a6c51c2bff46020a8996148ea1a7ca28ecbf402d834633cb264fe9b937106193233fce1e27eadb1cd506bd557a2e9e76cab9b46110", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","vacancies"], _2);
  main.variable(observer("vacancies")).define("vacancies", ["FileAttachment"], _vacancies);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ordinal-scale-interval"] = { code: "checked = Inputs.toggle({label: \"interval\", value: true})\n\nPlot.barY(timeseries, {x: \"year\", y: \"population\"})\n  .plot({x: {tickFormat: \"\", interval: checked ? 1 : undefined}})\n\ntimeseries = [\n  {year: 2014, population: 7295.290765},\n  {year: 2015, population: 7379.797139},\n  {year: 2016, population: 7464.022049},\n  {year: 2017, population: 7547.858925},\n  // {year: 2018, population: 7631.091040},\n  {year: 2019, population: 7713.468100},\n  {year: 2020, population: 7794.798739}\n]", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Ordinal scale interval</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Ordinal scale interval

Use the [interval scale option](https://observablehq.com/plot/features/scales#interval) to make sure that missing data is not invisibly skipped. See also [a variant for time scales](https://observablehq.com/@observablehq/plot-ordinal-bar-chart).`
)}

function _checked(Inputs){return(
Inputs.toggle({label: "interval", value: true})
)}

function _3(Plot,timeseries,checked){return(
Plot.barY(timeseries, {x: "year", y: "population"})
  .plot({x: {tickFormat: "", interval: checked ? 1 : undefined}})
)}

function _timeseries(){return(
[
  {year: 2014, population: 7295.290765},
  {year: 2015, population: 7379.797139},
  {year: 2016, population: 7464.022049},
  {year: 2017, population: 7547.858925},
  // {year: 2018, population: 7631.091040},
  {year: 2019, population: 7713.468100},
  {year: 2020, population: 7794.798739}
]
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof checked")).define("viewof checked", ["Inputs"], _checked);
  main.variable(observer("checked")).define("checked", ["Generators", "viewof checked"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","timeseries","checked"], _3);
  main.variable(observer("timeseries")).define("timeseries", _timeseries);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-temporal-bar-chart"] = { code: "Plot.plot({\n  marks: [\n    Plot.rectY(weather.slice(-42), {x: \"date\", y: \"wind\", interval: \"day\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Temporal bar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Temporal bar chart

Use the [interval transform](https://observablehq.com/plot/transforms/interval) —here, expressed as the [rect](https://observablehq.com/plot/marks/rect) mark’s **interval** option— to convert a single time value in *x* into an extent ⟨*x₁*, *x₂*⟩.
`
)}

function _2(Plot,weather){return(
Plot.plot({
  marks: [
    Plot.rectY(weather.slice(-42), {x: "date", y: "wind", interval: "day"}),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","weather"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-bullet-graph"] = { code: "Plot.plot({\n  width,\n  height: 200,\n  facet: {\n    data,\n    x: \"race\",\n    label:\n      \"Proportion of COVID-19 cases (color) vs. share of population (gray), by race and age\"\n  },\n  x: {\n    axis: \"top\",\n    grid: true,\n    ticks: d3.range(0, 51, 10),\n    tickFormat: (d) => (d === 50 ? `${d}%` : `${d}`),\n    tickSize: 0\n  },\n  y: {\n    label: null,\n    domain: [\"80+\", \"65-79\", \"50-64\", \"35-49\", \"18-34\", \"0-17\" ]\n  },\n  color: { scheme: \"dark2\" },\n  marks: [\n    Plot.barX(data, {\n      x: \"population_percent\",\n      y: \"age\",\n      fill: \"#ddd\",\n      insetTop: 2,\n      insetBottom: 2\n    }),\n    Plot.barX(data, {\n      x: \"cases_percent\",\n      y: \"age\",\n      fill: \"race\",\n      sort: { fx: \"x\", reverse: true },\n      insetTop: 6,\n      insetBottom: 6\n    })\n  ]\n})\n\nInputs.table(data)\n\ndata = FileAttachment(\"covid.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Bullet graph</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Bullet graph

## California COVID-19 disparities

Data: Ben Welsh (17 May, 2020), [“Tracking coronavirus in California”](https://www.latimes.com/projects/california-coronavirus-cases-tracking-outbreak/), _Los Angeles Times_ (see the [original notebook](https://observablehq.com/@datadesk/california-covid-19-disparities-bullet-graph)).  This version uses two [bar](https://observablehq.com/plot/marks/bar) marks, one for the background (proportion of the general population) and one for the data (proportion of Covid-19 cases). Compare to [Bullet graph II](/@fil/bullet-graph-2).

For more details on bullet graph designs, see [Wikipedia](https://en.wikipedia.org/wiki/Bullet_graph).`
)}

function _2(Plot,width,data,d3){return(
Plot.plot({
  width,
  height: 200,
  facet: {
    data,
    x: "race",
    label:
      "Proportion of COVID-19 cases (color) vs. share of population (gray), by race and age"
  },
  x: {
    axis: "top",
    grid: true,
    ticks: d3.range(0, 51, 10),
    tickFormat: (d) => (d === 50 ? `${d}%` : `${d}`),
    tickSize: 0
  },
  y: {
    label: null,
    domain: ["80+", "65-79", "50-64", "35-49", "18-34", "0-17" ]
  },
  color: { scheme: "dark2" },
  marks: [
    Plot.barX(data, {
      x: "population_percent",
      y: "age",
      fill: "#ddd",
      insetTop: 2,
      insetBottom: 2
    }),
    Plot.barX(data, {
      x: "cases_percent",
      y: "age",
      fill: "race",
      sort: { fx: "x", reverse: true },
      insetTop: 6,
      insetBottom: 6
    })
  ]
})
)}

function _3(Inputs,data){return(
Inputs.table(data)
)}

function _data(FileAttachment){return(
FileAttachment("covid.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["covid.csv", {url: "https://static.observableusercontent.com/files/b1f285040168121ee08e385bef12dd110ab61afd4ac3a83f8812d6cdad2786150508575e370a354112cf43e9d34549249803602df31faacc513a9c149933f2c1", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","data","d3"], _2);
  main.variable(observer()).define(["Inputs","data"], _3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-binned-box-plot"] = { code: "Plot.plot({\n  marginLeft: 60,\n  y: {\n    grid: true,\n    label: \"↑ Price\"\n  },\n  fx: {\n    interval: 0.5,\n    label: \"Carats →\",\n    labelAnchor: \"right\",\n    tickFormat: (x) => x.toFixed(1)\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.boxY(diamonds, {fx: \"carat\", y: \"price\"})\n  ]\n})\n\ndiamonds", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Binned box plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Binned box plot

The [box](https://observablehq.com/plot/marks/box) mark expects a quantitative dimension (for its extent, here, *y*, representing price), and optionally an ordinal dimension. The example below uses the [scale interval option]([plot](https://observablehq.com/plot/features/scales#interval) to convert carats (a quantitative dimension) into a usable ordinal dimension, on *fx*. If you are interested in ways to make this easier, please upvote [#1330](https://github.com/observablehq/plot/issues/1330).`
)}

function _2(Plot,diamonds){return(
Plot.plot({
  marginLeft: 60,
  y: {
    grid: true,
    label: "↑ Price"
  },
  fx: {
    interval: 0.5,
    label: "Carats →",
    labelAnchor: "right",
    tickFormat: (x) => x.toFixed(1)
  },
  marks: [
    Plot.ruleY([0]),
    Plot.boxY(diamonds, {fx: "carat", y: "price"})
  ]
})
)}

function _3(diamonds){return(
diamonds
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","diamonds"], _2);
  main.variable(observer()).define(["diamonds"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-gradient-bars"] = { code: "Plot.plot({\n  marks: [\n    () => htl.svg`<defs>\n      <linearGradient id=\"gradient\" gradientTransform=\"rotate(90)\">\n        <stop offset=\"15%\" stop-color=\"purple\" />\n        <stop offset=\"75%\" stop-color=\"red\" />\n        <stop offset=\"100%\" stop-color=\"gold\" />\n      </linearGradient>\n    </defs>`,\n    Plot.barY(alphabet, {x: \"letter\", y: \"frequency\", fill: \"url(#gradient)\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Gradient bars</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Gradient bars

Marks may be a function which returns an SVG element, if you wish to insert arbitrary content. Here we use [Hypertext Literal](https://observablehq.com/@observablehq/htl) to generate an SVG gradient that can be referenced as a [funciri](https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#funciri) color definition.`
)}

function _2(Plot,htl,alphabet){return(
Plot.plot({
  marks: [
    () => htl.svg`<defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="15%" stop-color="purple" />
        <stop offset="75%" stop-color="red" />
        <stop offset="100%" stop-color="gold" />
      </linearGradient>
    </defs>`,
    Plot.barY(alphabet, {x: "letter", y: "frequency", fill: "url(#gradient)"}),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","htl","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-colored-stacked-bar-chart"] = { code: "Plot.plot({\n  marginLeft: 60,\n  x: {label: \"Frequency →\"},\n  y: {label: null},\n  color: {legend: true},\n  marks: [\n    Plot.barX(penguins, {y: \"species\", x: 1, inset: 0.5, fill: \"body_mass_g\", sort: \"body_mass_g\"}),\n    Plot.ruleX([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked unit chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked unit chart

Each penguin in the dataset is represented by a [bar](https://observablehq.com/plot/marks/bar) of width *x* = 1; bars are implicitly [stacked](https://observablehq.com/plot/transforms/stack), resulting in this unit chart.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marginLeft: 60,
  x: {label: "Frequency →"},
  y: {label: null},
  color: {legend: true},
  marks: [
    Plot.barX(penguins, {y: "species", x: 1, inset: 0.5, fill: "body_mass_g", sort: "body_mass_g"}),
    Plot.ruleX([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-civilizations-timeline"] = { code: "Plot.plot({\n  marginLeft: 130,\n  axis: null,\n  x: {\n    axis: \"top\",\n    grid: true,\n    tickFormat: (x) => x < 0 ? `${-x} BC` : `${x} AD`\n  },\n  marks: [\n    Plot.barX(civilizations, {\n      x1: \"start\",\n      x2: \"end\",\n      y: \"civilization\",\n      sort: {y: \"x1\"}\n    }),\n    Plot.text(civilizations, {\n      x: \"start\",\n      y: \"civilization\",\n      text: \"civilization\",\n      textAnchor: \"end\",\n      dx: -3\n    })\n  ]\n})\n\ncivilizations = FileAttachment(\"civilizations.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot:  Civilizations timeline</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Civilizations timeline

A [bar](https://observablehq.com/plot/marks/bar) mark with explicit *x1* and *x2* channels, marking the start and end of civilizations.`
)}

function _2(Plot,civilizations){return(
Plot.plot({
  marginLeft: 130,
  axis: null,
  x: {
    axis: "top",
    grid: true,
    tickFormat: (x) => x < 0 ? `${-x} BC` : `${x} AD`
  },
  marks: [
    Plot.barX(civilizations, {
      x1: "start",
      x2: "end",
      y: "civilization",
      sort: {y: "x1"}
    }),
    Plot.text(civilizations, {
      x: "start",
      y: "civilization",
      text: "civilization",
      textAnchor: "end",
      dx: -3
    })
  ]
})
)}

function _civilizations(FileAttachment){return(
FileAttachment("civilizations.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["civilizations.csv", {url: "https://static.observableusercontent.com/files/fffd5ddde857ab61026a5a847c54e9c3e3e7daa0d4b23a100211cb481ff677a418f752a5dbdd755d306d60fa62ae9f4e6bb7e0269c5c3cc2f9635884d9d9ea80", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","civilizations"], _2);
  main.variable(observer("civilizations")).define("civilizations", ["FileAttachment"], _civilizations);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacked-percentages"] = { code: "Plot.plot({\n  x: {percent: true},\n  marks: [\n    Plot.barX(alphabet, Plot.stackX({x: \"frequency\", fillOpacity: 0.3, inset: 0.5})),\n    Plot.textX(alphabet, Plot.stackX({x: \"frequency\", text: \"letter\", inset: 0.5})),\n    Plot.ruleX([0, 1])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked percentages</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked percentages

While the [bar](https://observablehq.com/plot/marks/bar) mark is implicitly [stacked](https://observablehq.com/plot/transforms/stack), the [text](https://observablehq.com/plot/marks/text) mark is not. This example uses an explicit stackX transform in both cases for clarity. See also [single stacked bar](/@observablehq/plot-single-stacked-bar).`
)}

function _2(Plot,alphabet){return(
Plot.plot({
  x: {percent: true},
  marks: [
    Plot.barX(alphabet, Plot.stackX({x: "frequency", fillOpacity: 0.3, inset: 0.5})),
    Plot.textX(alphabet, Plot.stackX({x: "frequency", text: "letter", inset: 0.5})),
    Plot.ruleX([0, 1])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-single-stacked-bar"] = { code: "Plot.plot({\n  height: 100,\n  x: {percent: true},\n  marks: [\n    Plot.barX(\n      olympians,\n      Plot.stackX(\n        {order: \"x\", reverse: true},\n        Plot.groupZ(\n          {x: \"proportion\"},\n          {z: \"sport\", fillOpacity: 0.2, inset: 0.5}\n        )\n      )\n    ),\n    Plot.text(\n      olympians,\n      Plot.filter(\n        (D) => D.length > 200,\n        Plot.stackX(\n          {order: \"x\", reverse: true},\n          Plot.groupZ(\n            {x: \"proportion\", text: \"first\"},\n            {z: \"sport\", text: \"sport\", rotate: 90}\n          )\n        )\n      )\n    ),\n    Plot.ruleX([0, 1])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Single stacked bar</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Single stacked bar

The [text](https://observablehq.com/plot/marks/text) mark consumes the *x* channel, which is the midpoint of the [stacked](https://observablehq.com/plot/transforms/stack) positions *x1* and *x2*—putting the label in the middle of each bar. See also [stacked percentages](/@observablehq/plot-stacked-percentages).`
)}

function _2(Plot,olympians){return(
Plot.plot({
  height: 100,
  x: {percent: true},
  marks: [
    Plot.barX(
      olympians,
      Plot.stackX(
        {order: "x", reverse: true},
        Plot.groupZ(
          {x: "proportion"},
          {z: "sport", fillOpacity: 0.2, inset: 0.5}
        )
      )
    ),
    Plot.text(
      olympians,
      Plot.filter(
        (D) => D.length > 200,
        Plot.stackX(
          {order: "x", reverse: true},
          Plot.groupZ(
            {x: "proportion", text: "first"},
            {z: "sport", text: "sport", rotate: 90}
          )
        )
      )
    ),
    Plot.ruleX([0, 1])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-warming-stripes"] = { code: "Plot.plot({\n  x: {round: true},\n  color: {scheme: \"BuRd\"},\n  marks: [\n    Plot.barX(hadcrut, {\n      x: \"year\",\n      fill: \"anomaly\",\n      interval: \"year\", // yearly data\n      inset: 0 // no gaps\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Warming stripes</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Warming stripes

A [bar](https://observablehq.com/plot/marks/bar)’s ordinal dimension is optional; if missing, the bar spans the chart along this dimension. Such bars typically also have a [color](https://observablehq.com/plot/features/scales#color-scales) encoding. For example, here are [warming stripes](https://showyourstripes.info/) showing the increase in average temperature globally over the last 172 years.`
)}

function _2(Plot,hadcrut){return(
Plot.plot({
  x: {round: true},
  color: {scheme: "BuRd"},
  marks: [
    Plot.barX(hadcrut, {
      x: "year",
      fill: "anomaly",
      interval: "year", // yearly data
      inset: 0 // no gaps
    })
  ]
})
)}

async function _hadcrut(FileAttachment){return(
(await FileAttachment("hadcrut-annual.txt").text())
  .trim().split(/\n/g) // split into lines
  .map(line => line.split(/\s+/g)) // split each line into fields 
  .map(([year, anomaly]) => ({ // extract the year and median anomaly
    year: new Date(Date.UTC(year, 0, 1)), 
    anomaly: +anomaly
  }))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["hadcrut-annual.txt", {url: "https://static.observableusercontent.com/files/56252fee45d48e3b1834acc30dc71d7387e85cb50ca4de2e0eff9afd4f8f7e90e89218a5ec966f223eb4aabfda79df16c57654ca044c1a511497676dc5f4da93", mimeType: "text/plain"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","hadcrut"], _2);
  main.variable(observer("hadcrut")).define("hadcrut", ["FileAttachment"], _hadcrut);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-normal-histogram"] = { code: "Plot.rectY({length: 10000}, Plot.binX({y: \"count\"}, {x: d3.randomNormal()})).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Normal histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Normal histogram

For a histogram, use the [binX](https://observablehq.com/plot/transforms/bin) transform with the [rectY](https://observablehq.com/plot/marks/rect) mark. Here we bin 10,000 random samples, generated on-the-fly into the *x* channel from a [normal distribution](https://observablehq.com/@d3/d3-random#normal).`
)}

function _2(Plot,d3){return(
Plot.rectY({length: 10000}, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-vertical-histogram"] = { code: "Plot.plot({\n  y: {grid: true},\n  color: {legend: true},\n  marks: [\n    Plot.rectY(olympians, Plot.binX({y: \"count\"}, {x: \"weight\", fill: \"sex\"})),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked histogram

Olympic athletes [binned](https://observablehq.com/plot/transforms/bin) by weight, separately for each category (*sex*). The [rectY](https://observablehq.com/plot/marks/rect) mark showing the counts is implicitly [stacked](https://observablehq.com/plot/transforms/stack), avoiding occlusion. For an alternative, see [overlapping histogram](https://observablehq.com/@observablehq/plot-overlapping-histogram).`
)}

function _2(Plot,olympians){return(
Plot.plot({
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.rectY(olympians, Plot.binX({y: "count"}, {x: "weight", fill: "sex"})),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-overlapping-histogram"] = { code: "Plot.plot({\n  round: true,\n  color: {legend: true},\n  marks: [\n    Plot.rectY(olympians, Plot.binX({y2: \"count\"}, {x: \"weight\", fill: \"sex\", mixBlendMode: \"multiply\"})),\n    Plot.ruleY([0])\n  ]\n})\n\nPlot.plot({\n  color: {legend: true},\n  marks: [\n    Plot.rectY(\n      olympians,\n      Plot.sort(\n        {channel: \"y2\", order: \"descending\"}, // prevent occlusion 🌶️\n        Plot.binX(\n          {y2: \"count\"}, // opt-out of stacking\n          {x: \"weight\", fill: \"sex\"}\n        )\n      )\n    ),\n    Plot.ruleY([0])\n  ]\n})\n\nPlot.plot({\n  round: true,\n  color: {legend: true},\n  marks: [\n    Plot.rectY(olympians, Plot.binX({y: \"count\"}, {filter: (d) => d.sex === \"male\", x: \"weight\", fill: \"sex\", insetLeft: 4})),\n    Plot.rectY(olympians, Plot.binX({y: \"count\"}, {filter: (d) => d.sex === \"female\", x: \"weight\", fill: \"sex\", insetRight: 4})),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Overlapping histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Overlapping histogram

Olympic athletes [binned](https://observablehq.com/plot/transforms/bin) by weight, separately for each category (*sex*). You can opt-out of [rectY](https://observablehq.com/plot/marks/rect)’s implicit [stackY](https://observablehq.com/plot/transforms/stack) transform by specifying either **y1** or **y2**.`
)}

function _2(Plot,olympians){return(
Plot.plot({
  round: true,
  color: {legend: true},
  marks: [
    Plot.rectY(olympians, Plot.binX({y2: "count"}, {x: "weight", fill: "sex", mixBlendMode: "multiply"})),
    Plot.ruleY([0])
  ]
})
)}

function _3(md){return(
md`The **mixBlendMode** option can be very slow to render if there are many elements, but is useful for avoiding occlusion. Alternatively, you can use a sort transform to draw the shortest rects on top.`
)}

function _4(Plot,olympians){return(
Plot.plot({
  color: {legend: true},
  marks: [
    Plot.rectY(
      olympians,
      Plot.sort(
        {channel: "y2", order: "descending"}, // prevent occlusion 🌶️
        Plot.binX(
          {y2: "count"}, // opt-out of stacking
          {x: "weight", fill: "sex"}
        )
      )
    ),
    Plot.ruleY([0])
  ]
})
)}

function _5(md){return(
md`Or, as two interleaved histograms using insets:`
)}

function _6(Plot,olympians){return(
Plot.plot({
  round: true,
  color: {legend: true},
  marks: [
    Plot.rectY(olympians, Plot.binX({y: "count"}, {filter: (d) => d.sex === "male", x: "weight", fill: "sex", insetLeft: 4})),
    Plot.rectY(olympians, Plot.binX({y: "count"}, {filter: (d) => d.sex === "female", x: "weight", fill: "sex", insetRight: 4})),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","olympians"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["Plot","olympians"], _6);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-highlighted-bin"] = { code: "Plot.plot({\n  y: {\n    grid: true\n  },\n  marks: [\n    Plot.rectY(\n      olympians,\n      Plot.binX(\n        {\n          y: \"count\",\n          fill: test\n        },\n        { x: \"weight\" }\n      )\n    ),\n    Plot.ruleY([0])\n  ]\n})\n\ntest = (bin) => bin.some((d) => d.name === \"Aaron Brown\")", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Highlighted bin</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Highlighted bin

A custom [function reducer](https://observablehq.com/plot/transforms/bin#bin-transform) that tests if [Aaron Brown](https://en.wikipedia.org/wiki/Aaron_Brown_(sprinter%29) belongs to a given bin.`
)}

function _2(Plot,olympians,test){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(
      olympians,
      Plot.binX(
        {
          y: "count",
          fill: test
        },
        { x: "weight" }
      )
    ),
    Plot.ruleY([0])
  ]
})
)}

function _3(md){return(
md`In this example we highlight the bin that has a certain athlete.`
)}

function _test(){return(
(bin) => bin.some((d) => d.name === "Aaron Brown")
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians","test"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("test")).define("test", _test);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-prebinned-histogram"] = { code: "Plot.rectY(bins, {x1: \"x0\", x2: \"x1\", y2: \"length\"}).plot()\n\nbins = d3.bin().thresholds(80).value((d) => d.weight)(olympians)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Pre-binned histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Pre-binned histogram

This is for demonstration only; you wouldn’t normally bin “by hand” as shown here, but rather use the [bin](https://observablehq.com/plot/transforms/bin) transform.`
)}

function _2(Plot,bins){return(
Plot.rectY(bins, {x1: "x0", x2: "x1", y2: "length"}).plot()
)}

function _bins(d3,olympians){return(
d3.bin().thresholds(80).value((d) => d.weight)(olympians)
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","bins"], _2);
  main.variable(observer("bins")).define("bins", ["d3","olympians"], _bins);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-cumulative-histogram"] = { code: "cumulative = Inputs.radio(new Map([[\"−1\", -1], [\"+1\", 1]]), {label: \"cumulative\", value: 1})\n\nPlot.plot({\n  marginLeft: 60,\n  y: {grid: true},\n  marks: [\n    Plot.rectY(olympians, Plot.binX({y: \"count\"}, {x: \"weight\", cumulative})),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Cumulative histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Cumulative histogram

If _cumulative_ is &minus;1, each [bin](https://observablehq.com/plot/transforms/bin) represents the number of athletes above a given weight; if &plus;1, below a given weight.`
)}

function _cumulative(Inputs){return(
Inputs.radio(new Map([["−1", -1], ["+1", 1]]), {label: "cumulative", value: 1})
)}

function _3(Plot,olympians,cumulative){return(
Plot.plot({
  marginLeft: 60,
  y: {grid: true},
  marks: [
    Plot.rectY(olympians, Plot.binX({y: "count"}, {x: "weight", cumulative})),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof cumulative")).define("viewof cumulative", ["Inputs"], _cumulative);
  main.variable(observer("cumulative")).define("cumulative", ["Generators", "viewof cumulative"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","olympians","cumulative"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-percentogram"] = { code: "Plot.plot({\n  color: {\n    legend: true,\n    type: \"quantize\",\n    scheme: \"spectral\",\n    n: 10,\n    label: \"percentile\"\n  },\n  y: {label: \"density\"},\n  marks: [\n    Plot.rectY(numbers, {\n      fill: (d, i) => i,\n      ...Plot.binX({\n        y: (bin, {x1, x2}) => 1 / (x2 - x1),\n        thresholds: percentiles\n      })\n    }),\n    Plot.ruleY([0])\n  ]\n})\n\nnumbers = Float64Array.from({length: 10000}, d3.randomNormal.source(d3.randomLcg(3))())\n\npercentiles = function percentiles(numbers) {\n  const sorted = d3.sort(numbers);\n  return d3.range(0, 101).map((q) => d3.quantileSorted(sorted, q / 100));\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Percentogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Percentogram

Ref. Andrew Gelman, [The “percentogram”—a histogram binned by percentages of the cumulative distribution, rather than using fixed bin widths](https://statmodeling.stat.columbia.edu/2023/04/13/the-percentogram-a-histogram-binned-by-percentages-of-the-cumulative-distribution-rather-than-using-fixed-bin-widths/), 13 April 2023.`
)}

function _2(Plot,numbers,percentiles){return(
Plot.plot({
  color: {
    legend: true,
    type: "quantize",
    scheme: "spectral",
    n: 10,
    label: "percentile"
  },
  y: {label: "density"},
  marks: [
    Plot.rectY(numbers, {
      fill: (d, i) => i,
      ...Plot.binX({
        y: (bin, {x1, x2}) => 1 / (x2 - x1),
        thresholds: percentiles
      })
    }),
    Plot.ruleY([0])
  ]
})
)}

function _numbers(d3){return(
Float64Array.from({length: 10000}, d3.randomNormal.source(d3.randomLcg(3))())
)}

function _percentiles(d3){return(
function percentiles(numbers) {
  const sorted = d3.sort(numbers);
  return d3.range(0, 101).map((q) => d3.quantileSorted(sorted, q / 100));
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","numbers","percentiles"], _2);
  main.variable(observer("numbers")).define("numbers", ["d3"], _numbers);
  main.variable(observer("percentiles")).define("percentiles", ["d3"], _percentiles);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-cumulative-distribution-of-poverty"] = { code: "Plot.plot({\n  x: {label: \"Population (millions) →\"},\n  y: {percent: true, label: \"↑ Proportion living on less than $30 per day (%)\"},\n  marks: [\n    Plot.rectY(povcalnet, Plot.stackX({\n      filter: (d) => [\"N\", \"A\"].includes(d.CoverageType),\n      x: \"ReqYearPopulation\",\n      order: \"HeadCount\",\n      reverse: true,\n      y2: \"HeadCount\", // y2 to avoid stacking by y\n      title: (d) => `${d.CountryName}\\n${(d.HeadCount * 100).toFixed(1)}%`,\n      insetLeft: 0.2,\n      insetRight: 0.2\n    })),\n    Plot.ruleY([0])\n  ]\n})\n\npovcalnet = FileAttachment(\"povcalnet.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Cumulative distribution of poverty</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Cumulative distribution of poverty

Each [rect](https://observablehq.com/plot/marks/rect) represents a country: _x_ encodes the country’s population, while _y_ encodes the proportion of that population living in poverty; hence area represents the number of people living in poverty. Rects are [stacked](https://observablehq.com/plot/transforms/stack) along _x_ in order of descending _y_. Inspired by [Max Roser](https://ourworldindata.org/poverty-minimum-growth-needed).`
)}

function _2(Plot,povcalnet){return(
Plot.plot({
  x: {label: "Population (millions) →"},
  y: {percent: true, label: "↑ Proportion living on less than $30 per day (%)"},
  marks: [
    Plot.rectY(povcalnet, Plot.stackX({
      filter: (d) => ["N", "A"].includes(d.CoverageType),
      x: "ReqYearPopulation",
      order: "HeadCount",
      reverse: true,
      y2: "HeadCount", // y2 to avoid stacking by y
      title: (d) => `${d.CountryName}\n${(d.HeadCount * 100).toFixed(1)}%`,
      insetLeft: 0.2,
      insetRight: 0.2
    })),
    Plot.ruleY([0])
  ]
})
)}

function _povcalnet(FileAttachment){return(
FileAttachment("povcalnet.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["povcalnet.csv", {url: "https://static.observableusercontent.com/files/05c40acca0741f7a57eb19a260719fdee406504b620ab64a796c1261ed0e7a769f8154e50a1373646dad7dd10b842a1fce772421981f455c5712ec2fe494a0a6", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","povcalnet"], _2);
  main.variable(observer("povcalnet")).define("povcalnet", ["FileAttachment"], _povcalnet);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-impact-of-vaccines"] = { code: "disease = Inputs.select(vaccines.map(d => d.disease), {unique: true, label: \"Disease\"})\n\nPlot.plot({\n  width,\n  height: 930,\n  marginBottom: 30,\n  padding: 0,\n  round: false,\n  label: null,\n  x: {axis: \"top\"},\n  color: {\n    scheme: \"purd\",\n    legend: true,\n    type: \"sqrt\",\n    label: \"Cases per 100,000 people\"\n  },\n  marks: [\n    Plot.barX(vaccines.filter(d => d.disease === disease), {\n      x: \"date\",\n      y: \"state\",\n      interval: \"year\",\n      inset: 0.5,\n      fill: \"cases\",\n      title: \"cases\"\n    }),\n    Plot.ruleX([introductions.find(d => d.disease === disease)], {\n      x: \"date\"\n    }),\n    Plot.text([introductions.find(d => d.disease === disease)], {\n      x: \"date\",\n      dy: 4,\n      lineAnchor: \"top\",\n      frameAnchor: \"bottom\",\n      text: (d) => `${d.date.getUTCFullYear()}\\nVaccine introduced`\n    })\n  ]\n})\n\nstates = [\"Alaska\", \"Ala.\", \"Ark.\", \"Ariz.\", \"Calif.\", \"Colo.\", \"Conn.\", \"D.C.\", \"Del.\", \"Fla.\", \"Ga.\", \"Hawaii\", \"Iowa\", \"Idaho\", \"Ill.\", \"Ind.\", \"Kan.\", \"Ky.\", \"La.\", \"Mass.\", \"Md.\", \"Maine\", \"Mich.\", \"Minn.\", \"Mo.\", \"Miss.\", \"Mont.\", \"N.C.\", \"N.D.\", \"Neb.\", \"N.H.\", \"N.J.\", \"N.M\", \"Nev.\", \"N.Y.\", \"Ohio\", \"Okla.\", \"Ore.\", \"Pa.\", \"R.I.\", \"S.C.\", \"S.D.\", \"Tenn.\", \"Texas\", \"Utah\", \"Va.\", \"Vt.\", \"Wash.\", \"Wis.\", \"W.Va.\", \"Wyo.\"]", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: The impact of vaccines</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# The impact of vaccines

A recreation of [a WSJ graphic](http://graphics.wsj.com/infectious-diseases-and-vaccines/) by Tynan DeBold and Dov Friedman.`
)}

function _disease(Inputs,vaccines){return(
Inputs.select(vaccines.map(d => d.disease), {unique: true, label: "Disease"})
)}

function _3(Plot,width,vaccines,disease,introductions){return(
Plot.plot({
  width,
  height: 930,
  marginBottom: 30,
  padding: 0,
  round: false,
  label: null,
  x: {axis: "top"},
  color: {
    scheme: "purd",
    legend: true,
    type: "sqrt",
    label: "Cases per 100,000 people"
  },
  marks: [
    Plot.barX(vaccines.filter(d => d.disease === disease), {
      x: "date",
      y: "state",
      interval: "year",
      inset: 0.5,
      fill: "cases",
      title: "cases"
    }),
    Plot.ruleX([introductions.find(d => d.disease === disease)], {
      x: "date"
    }),
    Plot.text([introductions.find(d => d.disease === disease)], {
      x: "date",
      dy: 4,
      lineAnchor: "top",
      frameAnchor: "bottom",
      text: (d) => `${d.date.getUTCFullYear()}\nVaccine introduced`
    })
  ]
})
)}

async function _vaccines(FileAttachment,states)
{
  const vaccines = await FileAttachment("vaccines.json").json();
  return vaccines
    .flatMap(({title: disease, data: {values: {data}}}) => data
    .map(([date, stateIndex, cases]) => ({
      disease, 
      date: new Date(`${date}-01-01`), 
      state: states[stateIndex], 
      cases
    })));
}


async function _introductions(FileAttachment)
{
  const vaccines = await FileAttachment("vaccines.json").json();
  return vaccines
    .map(({title: disease, data: {chart_options: {vaccine_year}}}) => ({
      disease,
      date: new Date(Date.UTC(vaccine_year, (vaccine_year % 1) * 12, 1))
    }));
}


function _states(){return(
["Alaska", "Ala.", "Ark.", "Ariz.", "Calif.", "Colo.", "Conn.", "D.C.", "Del.", "Fla.", "Ga.", "Hawaii", "Iowa", "Idaho", "Ill.", "Ind.", "Kan.", "Ky.", "La.", "Mass.", "Md.", "Maine", "Mich.", "Minn.", "Mo.", "Miss.", "Mont.", "N.C.", "N.D.", "Neb.", "N.H.", "N.J.", "N.M", "Nev.", "N.Y.", "Ohio", "Okla.", "Ore.", "Pa.", "R.I.", "S.C.", "S.D.", "Tenn.", "Texas", "Utah", "Va.", "Vt.", "Wash.", "Wis.", "W.Va.", "Wyo."]
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["vaccines.json", {url: "https://static.observableusercontent.com/files/b6f6442d639b2aa66deada04456cbba543479325a2e2e22eac7f7dcd0265bc5bff81206b1635fdf775aec6662f2df8605386f5e680c146c1d4c0c11dac5c5851", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof disease")).define("viewof disease", ["Inputs","vaccines"], _disease);
  main.variable(observer("disease")).define("disease", ["Generators", "viewof disease"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","width","vaccines","disease","introductions"], _3);
  main.variable(observer("vaccines")).define("vaccines", ["FileAttachment","states"], _vaccines);
  main.variable(observer("introductions")).define("introductions", ["FileAttachment"], _introductions);
  main.variable(observer("states")).define("states", _states);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-seattle-temperature-heatmap"] = { code: "Plot.plot({\n  padding: 0,\n  y: {tickFormat: Plot.formatMonth(\"en\", \"short\")},\n  marks: [\n    Plot.cell(seattle, Plot.group({fill: \"max\"}, {\n      x: (d) => d.date.getUTCDate(),\n      y: (d) => d.date.getUTCMonth(),\n      fill: \"temp_max\",\n      inset: 0.5\n    }))\n  ]\n})\n\nseattle = FileAttachment(\"seattle-weather.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Seattle temperature temporal heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Seattle temperature temporal heatmap

A calendar with a [cell](https://observablehq.com/plot/marks/cell) for each day (*x*) of each month (*y*), [colored](https://observablehq.com/plot/features/scales#color-scales) by maximum temperature on that day.`
)}

function _2(Plot,seattle){return(
Plot.plot({
  padding: 0,
  y: {tickFormat: Plot.formatMonth("en", "short")},
  marks: [
    Plot.cell(seattle, Plot.group({fill: "max"}, {
      x: (d) => d.date.getUTCDate(),
      y: (d) => d.date.getUTCMonth(),
      fill: "temp_max",
      inset: 0.5
    }))
  ]
})
)}

function _seattle(FileAttachment){return(
FileAttachment("seattle-weather.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["seattle-weather.csv", {url: "https://static.observableusercontent.com/files/831732e8332e141e39aca2776edfdb19b2d43308d4974f5ad4a21fad007faa0518fe5bc4a0fc4f57422689a161dc27b82073403cee0e29ebf6ccb75d0ec4aeb3", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","seattle"], _2);
  main.variable(observer("seattle")).define("seattle", ["FileAttachment"], _seattle);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-sorted-heatmap"] = { code: "Plot.plot({\n  marginLeft: 120,\n  padding: 0,\n  y: {label: null},\n  color: {legend: true, zero: true},\n  marks: [\n    Plot.cell(\n      traffic,\n      Plot.group(\n        {fill: \"median\"},\n        {x: (d) => d.date.getUTCHours(), y: \"location\", fill: \"vehicles\", inset: 0.5, sort: {y: \"fill\"}}\n      )\n    )\n  ]\n})\n\ntraffic = FileAttachment(\"traffic.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Sorted heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Sorted heatmap

[Grouping](https://observablehq.com/plot/transforms/group) by *x* (hour of day) and *y* (location) produces a heatmap. Locations are [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) by the maximum highway traffic (measured as vehicles per hour) they have during the day. Data: [Christopher Möller](https://gist.github.com/chrtze).`
)}

function _2(Plot,traffic){return(
Plot.plot({
  marginLeft: 120,
  padding: 0,
  y: {label: null},
  color: {legend: true, zero: true},
  marks: [
    Plot.cell(
      traffic,
      Plot.group(
        {fill: "median"},
        {x: (d) => d.date.getUTCHours(), y: "location", fill: "vehicles", inset: 0.5, sort: {y: "fill"}}
      )
    )
  ]
})
)}

function _traffic(FileAttachment){return(
FileAttachment("traffic.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["traffic.csv", {url: "https://static.observableusercontent.com/files/609a91fa3908394198a9b2592b8432a798332e9a140a8d5f9c864615e3f18b2e822badadc579c06b394bb1396a20f064d72123b718354b829978b2d4782bd5c9", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","traffic"], _2);
  main.variable(observer("traffic")).define("traffic", ["FileAttachment"], _traffic);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-simpsons-ratings"] = { code: "Plot.plot({\n  padding: 0,\n  grid: true,\n  x: {axis: \"top\", label: \"Season\"},\n  y: {label: \"Episode\"},\n  color: {type: \"linear\", scheme: \"PiYG\"},\n  marks: [\n    Plot.cell(simpsons, {x: \"season\", y: \"number_in_season\", fill: \"imdb_rating\", inset: 0.5}),\n    Plot.text(simpsons, {x: \"season\", y: \"number_in_season\", text: (d) => d.imdb_rating?.toFixed(1), fill: \"black\", title: \"title\"})\n  ]\n})\n\nsimpsons = FileAttachment(\"simpsons.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Simpsons ratings</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Simpsons ratings

A [text](https://observablehq.com/plot/features/marks/text) mark shows the rating of each of the Simpsons episode, organized by season. It is overlaid on a [cell](https://observablehq.com/plot/features/marks/cell) that redundantly [encodes](https://observablehq.com/plot/features/scales#color-scales) the same value as a color. Data: [Internet Movie Data Base](https://www.imdb.com/).`
)}

function _2(Plot,simpsons){return(
Plot.plot({
  padding: 0,
  grid: true,
  x: {axis: "top", label: "Season"},
  y: {label: "Episode"},
  color: {type: "linear", scheme: "PiYG"},
  marks: [
    Plot.cell(simpsons, {x: "season", y: "number_in_season", fill: "imdb_rating", inset: 0.5}),
    Plot.text(simpsons, {x: "season", y: "number_in_season", text: (d) => d.imdb_rating?.toFixed(1), fill: "black", title: "title"})
  ]
})
)}

function _simpsons(FileAttachment){return(
FileAttachment("simpsons.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["simpsons.csv", {url: "https://static.observableusercontent.com/files/f0aaa8353b80ce8d9261a3fcf5c489f90c4c0c9a4f9f76e3d220d21f181daa69c2d3517e520633540ea763d08abce81b99089f5611b55ba1ffc7f2be4005f70c", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","simpsons"], _2);
  main.variable(observer("simpsons")).define("simpsons", ["FileAttachment"], _simpsons);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacked-waffles"] = { code: "Plot.waffleY(olympians, Plot.groupZ(\n  {y: \"sum\"},\n  {fill: \"sex\", y: d => d.sex === \"female\" ? 1 : -1, sort: \"sex\", fx: \"weight\", unit: 10}\n)).plot({fx: {interval: 10}, color: {legend: true}})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked waffles</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked waffles

Like the bar and rect marks, the [waffle mark](https://observablehq.com/plot/marks/waffle) supports implicit stacking.`
)}

function _2(Plot,olympians){return(
Plot.waffleY(olympians, Plot.groupZ(
  {y: "sum"},
  {fill: "sex", y: d => d.sex === "female" ? 1 : -1, sort: "sex", fx: "weight", unit: 10}
)).plot({fx: {interval: 10}, color: {legend: true}})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-survey-waffle"] = { code: "Plot.plot({\n  axis: null,\n  label: null,\n  height: 260,\n  marginTop: 20,\n  marginBottom: 70,\n  title: \"Subdued\",\n  subtitle: \"Of 120 surveyed Syrian teenagers:\",\n  marks: [\n    Plot.axisFx({lineWidth: 10, anchor: \"bottom\", dy: 20}),\n    Plot.waffleY({length: 1}, {y: 120, fillOpacity: 0.4, rx: \"100%\"}),\n    Plot.waffleY(survey, {fx: \"question\", y: \"yes\", rx: \"100%\", fill: \"orange\"}),\n    Plot.text(survey, {fx: \"question\", text: (d) => (d.yes / 120).toLocaleString(\"en-US\", {style: \"percent\"}), frameAnchor: \"bottom\", lineAnchor: \"top\", dy: 6, fill: \"orange\", fontSize: 24, fontWeight: \"bold\"})\n  ]\n})\n\nsurvey = [\n  {question: \"don’t go out after dark\", yes: 96},\n  {question: \"do no activities other than school\", yes: 89},\n  {question: \"engage in political discussion and social movements, including online\", yes: 10},\n  {question: \"would like to do activities but are prevented by safety concerns\", yes: 73}\n]", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Survey waffle</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Survey waffle

The [waffle mark](https://observablehq.com/plot/marks/waffle) can be used to highlight a proportion of the whole. The chart below recreates a graphic of survey responses from “[Teens in Syria](https://www.economist.com/graphic-detail/2015/08/19/teens-in-syria)” by _The Economist_ (August 19, 2015); positive responses are in orange, while negative responses are in gray. The rx option is used to produce circles instead of squares.`
)}

function _2(Plot,survey){return(
Plot.plot({
  axis: null,
  label: null,
  height: 260,
  marginTop: 20,
  marginBottom: 70,
  title: "Subdued",
  subtitle: "Of 120 surveyed Syrian teenagers:",
  marks: [
    Plot.axisFx({lineWidth: 10, anchor: "bottom", dy: 20}),
    Plot.waffleY({length: 1}, {y: 120, fillOpacity: 0.4, rx: "100%"}),
    Plot.waffleY(survey, {fx: "question", y: "yes", rx: "100%", fill: "orange"}),
    Plot.text(survey, {fx: "question", text: (d) => (d.yes / 120).toLocaleString("en-US", {style: "percent"}), frameAnchor: "bottom", lineAnchor: "top", dy: 6, fill: "orange", fontSize: 24, fontWeight: "bold"})
  ]
})
)}

function _survey(){return(
[
  {question: "don’t go out after dark", yes: 96},
  {question: "do no activities other than school", yes: 89},
  {question: "engage in political discussion and social movements, including online", yes: 10},
  {question: "would like to do activities but are prevented by safety concerns", yes: 73}
]
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","survey"], _2);
  main.variable(observer("survey")).define("survey", _survey);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-calendar"] = { code: "dji = FileAttachment(\"^DJI.csv\").csv({typed: true})\n\ncalendar = function calendar({\n  date = Plot.identity,\n  inset = 0.5,\n  ...options\n} = {}) {\n  let D;\n  return {\n    fy: {transform: (data) => (D = Plot.valueof(data, date, Array)).map((d) => d.getUTCFullYear())},\n    x: {transform: () => D.map((d) => d3.utcWeek.count(d3.utcYear(d), d))},\n    y: {transform: () => D.map((d) => d.getUTCDay())},\n    inset,\n    ...options\n  };\n}\n\nMonthLine = class MonthLine extends Plot.Mark {\n  static defaults = {stroke: \"currentColor\", strokeWidth: 1};\n  constructor(data, options = {}) {\n    const {x, y} = options;\n    super(data, {x: {value: x, scale: \"x\"}, y: {value: y, scale: \"y\"}}, options, MonthLine.defaults);\n  }\n  render(index, {x, y}, {x: X, y: Y}, dimensions) {\n    const {marginTop, marginBottom, height} = dimensions;\n    const dx = x.bandwidth(), dy = y.bandwidth();\n    return htl.svg`<path fill=none stroke=${this.stroke} stroke-width=${this.strokeWidth} d=${\n      Array.from(index, (i) => `${Y[i] > marginTop + dy * 1.5 // is the first day a Monday?\n          ? `M${X[i] + dx},${marginTop}V${Y[i]}h${-dx}` \n          : `M${X[i]},${marginTop}`}V${height - marginBottom}`)\n        .join(\"\")\n    }>`;\n  }\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Calendar</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Calendar

This notebook demonstrates a [D3-style calendar](https://observablehq.com/@d3/calendar/2) using [Observable Plot](/@observablehq/plot). This implementation features a custom transform to provide default **x** (week number), **y** (weekday number), and **fy** (year) options derived from the date; it also uses a custom mark to delineate months. See also the [simplified version](/@observablehq/plot-simplified-calendar).`
)}

function _plot(d3,dji,Plot,calendar,MonthLine)
{
  const start = d3.utcDay.offset(d3.min(dji, (d) => d.Date)); // exclusive
  const end = d3.utcDay.offset(d3.max(dji, (d) => d.Date)); // exclusive
  return Plot.plot({
    width: 1152,
    height: d3.utcYear.count(start, end) * 160,
    axis: null,
    padding: 0,
    x: {
      domain: d3.range(53) // or 54, if showing weekends
    },
    y: {
      axis: "left",
      domain: [-1, 1, 2, 3, 4, 5], // hide 0 and 6 (weekends); use -1 for labels
      ticks: [1, 2, 3, 4, 5], // don’t draw a tick for -1
      tickSize: 0,
      tickFormat: Plot.formatWeekday()
    },
    fy: {
      padding: 0.1,
      reverse: true
    },
    color: {
      scheme: "piyg",
      domain: [-6, 6],
      legend: true,
      percent: true,
      ticks: 6,
      tickFormat: "+d",
      label: "Daily change (%)"
    },
    marks: [
      // Draw year labels, rounding down to draw a year even if the data doesn’t
      // start on January 1. Use y = -1 (i.e., above Sunday) to align the year
      // labels vertically with the month labels, and shift them left to align
      // them horizontally with the weekday labels.
      Plot.text(
        d3.utcYears(d3.utcYear(start), end),
        calendar({text: d3.utcFormat("%Y"), frameAnchor: "right", x: 0, y: -1, dx: -20})
      ),

      // Draw month labels at the start of each month, rounding down to draw a
      // month even if the data doesn’t start on the first of the month. As
      // above, use y = -1 to place the month labels above the cells. (If you
      // want to show weekends, round up to Sunday instead of Monday.)
      Plot.text(
        d3.utcMonths(d3.utcMonth(start), end).map(d3.utcMonday.ceil),
        calendar({text: d3.utcFormat("%b"), frameAnchor: "left", y: -1})
      ),

      // Draw a cell for each day in our dataset. The color of the cell encodes
      // the relative daily change. (The first value is not defined because by
      // definition we don’t have the previous day’s close.)
      Plot.cell(
        dji.slice(1),
        calendar({date: "Date", fill: d3.pairs(Plot.valueof(dji, "Close"), (a, b) => (b - a) / a)})
      ),

      // Draw a line delineating adjacent months. Since the y-domain above is
      // set to hide weekends (day number 0 = Sunday and 6 = Saturday), if the
      // first day of the month is a weekend, round up to the first monday.
      new MonthLine(
        d3.utcMonths(d3.utcMonth(start), end)
          .map((d) => d3.utcDay.offset(d, d.getUTCDay() === 0 ? 1
             : d.getUTCDay() === 6 ? 2
             : 0)),
        calendar({stroke: "white", strokeWidth: 3}) 
      ),

      // Lastly, draw the date for all days spanning the dataset, including
      // days for which there is no data.
      Plot.text(
        d3.utcDays(start, end),
        calendar({text: d3.utcFormat("%-d")})
      )
    ]
  });
}


function _dji(FileAttachment){return(
FileAttachment("^DJI.csv").csv({typed: true})
)}

function _calendar(Plot,d3){return(
function calendar({
  date = Plot.identity,
  inset = 0.5,
  ...options
} = {}) {
  let D;
  return {
    fy: {transform: (data) => (D = Plot.valueof(data, date, Array)).map((d) => d.getUTCFullYear())},
    x: {transform: () => D.map((d) => d3.utcWeek.count(d3.utcYear(d), d))},
    y: {transform: () => D.map((d) => d.getUTCDay())},
    inset,
    ...options
  };
}
)}

function _MonthLine(Plot,htl){return(
class MonthLine extends Plot.Mark {
  static defaults = {stroke: "currentColor", strokeWidth: 1};
  constructor(data, options = {}) {
    const {x, y} = options;
    super(data, {x: {value: x, scale: "x"}, y: {value: y, scale: "y"}}, options, MonthLine.defaults);
  }
  render(index, {x, y}, {x: X, y: Y}, dimensions) {
    const {marginTop, marginBottom, height} = dimensions;
    const dx = x.bandwidth(), dy = y.bandwidth();
    return htl.svg`<path fill=none stroke=${this.stroke} stroke-width=${this.strokeWidth} d=${
      Array.from(index, (i) => `${Y[i] > marginTop + dy * 1.5 // is the first day a Monday?
          ? `M${X[i] + dx},${marginTop}V${Y[i]}h${-dx}` 
          : `M${X[i]},${marginTop}`}V${height - marginBottom}`)
        .join("")
    }>`;
  }
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["^DJI.csv", {url: "https://static.observableusercontent.com/files/754e2916be7548300012f5d0d6406308809baff7a2419cca200561b60eb4e788a826f8a588c66afdecbe119eea3b03725a5182fca591c03bc8cdfb1071436085", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("plot")).define("plot", ["d3","dji","Plot","calendar","MonthLine"], _plot);
  main.variable(observer("dji")).define("dji", ["FileAttachment"], _dji);
  main.variable(observer("calendar")).define("calendar", ["Plot","d3"], _calendar);
  main.variable(observer("MonthLine")).define("MonthLine", ["Plot","htl"], _MonthLine);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-dow-jones-calendar"] = { code: "Plot.plot({\n  padding: 0,\n  x: {axis: null},\n  y: {tickFormat: Plot.formatWeekday(\"en\", \"narrow\"), tickSize: 0},\n  fy: {tickFormat: \"\"},\n  color: {scheme: \"PiYG\", legend: true, label: \"Daily change\", tickFormat: \"+%\", domain: [-0.06, 0.06]},\n  marks: [\n    Plot.cell(dji, {\n      x: (d) => d3.utcWeek.count(d3.utcYear(d.Date), d.Date),\n      y: (d) => d.Date.getUTCDay(),\n      fy: (d) => d.Date.getUTCFullYear(),\n      fill: (d, i) => i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,\n      title: (d, i) => i > 0 ? ((d.Close - dji[i - 1].Close) / dji[i - 1].Close * 100).toFixed(1) : NaN,\n      inset: 0.5\n    })\n  ]\n})\n\ndji = FileAttachment(\"dji.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Simplified calendar</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Simplified calendar

A faceted heatmap where the week of year is encoded as *x*, day of week as *y*, year as the *fy* facet, and value as the fill color of each [cell](https://observablehq.com/plot/features/marks/cell). See also the [fancy version](/@observablehq/plot-calendar).`
)}

function _2(Plot,dji,d3){return(
Plot.plot({
  padding: 0,
  x: {axis: null},
  y: {tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0},
  fy: {tickFormat: ""},
  color: {scheme: "PiYG", legend: true, label: "Daily change", tickFormat: "+%", domain: [-0.06, 0.06]},
  marks: [
    Plot.cell(dji, {
      x: (d) => d3.utcWeek.count(d3.utcYear(d.Date), d.Date),
      y: (d) => d.Date.getUTCDay(),
      fy: (d) => d.Date.getUTCFullYear(),
      fill: (d, i) => i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,
      title: (d, i) => i > 0 ? ((d.Close - dji[i - 1].Close) / dji[i - 1].Close * 100).toFixed(1) : NaN,
      inset: 0.5
    })
  ]
})
)}

function _dji(FileAttachment){return(
FileAttachment("dji.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["dji.csv", {url: "https://static.observableusercontent.com/files/8287806ec9d634d4a91ae1e881ca6fc09f35aa9ba4a634e457d58f2077e629eb4b6a320c0348f5de71e679758e9c7ca3ba4bff9b6f1419128c5ff7651525ab80", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","dji","d3"], _2);
  main.variable(observer("dji")).define("dji", ["FileAttachment"], _dji);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["fil__correlation-heatmap"] = { code: "data = Inputs.select(\n  new Map([\n    [\"cars\", cars],\n    [\"penguins\", penguins],\n    [\"olympians\", olympians]\n  ]),\n  { label: \"dataset\" }\n)\n\nfields = Inputs.checkbox(data.columns, {\n  label: \"fields\",\n  value: data.columns.filter((c) => data.find((d) => typeof d[c] === \"number\"))\n})\n\nPlot.plot({\n  marginLeft: 100,\n  label: null,\n  color: { scheme: \"rdylbu\", pivot: 0, legend: true, label: \"correlation\" },\n  marks: [\n    Plot.cell(correlations, { x: \"a\", y: \"b\", fill: \"correlation\" }),\n\n    Plot.text(correlations, {\n      x: \"a\",\n      y: \"b\",\n      text: (d) => d.correlation.toFixed(2),\n      fill: (d) => (Math.abs(d.correlation) > 0.6 ? \"white\" : \"black\")\n    })\n  ]\n})\n\ncorrelations = d3.cross(fields, fields).map(([a, b]) => ({\n  a,\n  b,\n  correlation: corr(Plot.valueof(data, a), Plot.valueof(data, b))\n}))\n\ncorr = function corr(x, y) {\n  const n = x.length;\n  if (y.length !== n)\n    throw new Error(\"The two columns must have the same length.\");\n  const x_ = d3.mean(x);\n  const y_ = d3.mean(y);\n  const XY = d3.sum(x, (_, i) => (x[i] - x_) * (y[i] - y_));\n  const XX = d3.sum(x, (d) => (d - x_) ** 2);\n  const YY = d3.sum(y, (d) => (d - y_) ** 2);\n  return XY / Math.sqrt(XX * YY);\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Correlation heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Correlation heatmap

Select a dataset to display the correlation between its dimensions as colored [cells](https://observablehq.com/plot/marks/cell). The [text](https://observablehq.com/plot/marks/text) fill is black or white, depending on the value, to enhance readability.`
)}

function _data(Inputs,cars,penguins,olympians){return(
Inputs.select(
  new Map([
    ["cars", cars],
    ["penguins", penguins],
    ["olympians", olympians]
  ]),
  { label: "dataset" }
)
)}

function _fields(Inputs,data){return(
Inputs.checkbox(data.columns, {
  label: "fields",
  value: data.columns.filter((c) => data.find((d) => typeof d[c] === "number"))
})
)}

function _4(Plot,correlations){return(
Plot.plot({
  marginLeft: 100,
  label: null,
  color: { scheme: "rdylbu", pivot: 0, legend: true, label: "correlation" },
  marks: [
    Plot.cell(correlations, { x: "a", y: "b", fill: "correlation" }),

    Plot.text(correlations, {
      x: "a",
      y: "b",
      text: (d) => d.correlation.toFixed(2),
      fill: (d) => (Math.abs(d.correlation) > 0.6 ? "white" : "black")
    })
  ]
})
)}

function _correlations(d3,fields,corr,Plot,data){return(
d3.cross(fields, fields).map(([a, b]) => ({
  a,
  b,
  correlation: corr(Plot.valueof(data, a), Plot.valueof(data, b))
}))
)}

function _corr(d3){return(
function corr(x, y) {
  const n = x.length;
  if (y.length !== n)
    throw new Error("The two columns must have the same length.");
  const x_ = d3.mean(x);
  const y_ = d3.mean(y);
  const XY = d3.sum(x, (_, i) => (x[i] - x_) * (y[i] - y_));
  const XX = d3.sum(x, (d) => (d - x_) ** 2);
  const YY = d3.sum(y, (d) => (d - y_) ** 2);
  return XY / Math.sqrt(XX * YY);
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof data")).define("viewof data", ["Inputs","cars","penguins","olympians"], _data);
  main.variable(observer("data")).define("data", ["Generators", "viewof data"], (G, _) => G.input(_));
  main.variable(observer("viewof fields")).define("viewof fields", ["Inputs","data"], _fields);
  main.variable(observer("fields")).define("fields", ["Generators", "viewof fields"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","correlations"], _4);
  main.variable(observer("correlations")).define("correlations", ["d3","fields","corr","Plot","data"], _correlations);
  main.variable(observer("corr")).define("corr", ["d3"], _corr);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-auto-mark-heatmap"] = { code: "Plot.auto(olympians, {x: \"weight\", y: \"height\", color: \"count\"}).plot()\n\nPlot.rect(olympians, Plot.bin({fill: \"count\"}, {x: \"weight\", y: \"height\"})).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Auto mark, heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Auto mark, heatmap

Given two quantitative dimensions for *x* and *y*, the [auto](https://observablehq.com/plot/marks/auto) mark will create a heatmap from the [binned](https://observablehq.com/plot/transforms/bin) values.`
)}

function _2(Plot,olympians){return(
Plot.auto(olympians, {x: "weight", y: "height", color: "count"}).plot()
)}

function _3(md){return(
md`This auto mark is equivalent to a rect & bin combination:`
)}

function _4(Plot,olympians){return(
Plot.rect(olympians, Plot.bin({fill: "count"}, {x: "weight", y: "height"})).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","olympians"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-auto-mark-heatmap-2"] = { code: "Plot.auto(olympians, {x: \"weight\", y: \"sex\", color: \"count\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Auto mark, heatmap 2</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Auto mark, heatmap 2

Given a quantitative dimension for *x* and an ordinal dimension for *y*, the [auto](https://observablehq.com/plot/marks/auto) mark will create a heatmap from the [binned](https://observablehq.com/plot/transforms/bin) *x* values, grouped by *y*.`
)}

function _2(Plot,olympians){return(
Plot.auto(olympians, {x: "weight", y: "sex", color: "count"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-continuous-dimensions-heatmap"] = { code: "Plot.plot({\n  height: 640,\n  marginLeft: 44,\n  color: {\n    scheme: \"bupu\",\n    type: \"symlog\"\n  },\n  marks: [\n    Plot.rect(\n      diamonds,\n      Plot.bin({ fill: \"count\" }, { x: \"carat\", y: \"price\", thresholds: 100 })\n    )\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Quantitative dimensions heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Quantitative dimensions heatmap

Given two quantitative dimensions for *x* and *y*, use the [bin](https://observablehq.com/plot/transforms/bin) transform to create a heatmap.`
)}

function _2(Plot,diamonds){return(
Plot.plot({
  height: 640,
  marginLeft: 44,
  color: {
    scheme: "bupu",
    type: "symlog"
  },
  marks: [
    Plot.rect(
      diamonds,
      Plot.bin({ fill: "count" }, { x: "carat", y: "price", thresholds: 100 })
    )
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","diamonds"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-lebron-james-shots"] = { code: "Plot.plot({\n  height: 640,\n  axis: null,\n  x: {domain: [-250, 250]},\n  y: {domain: [-50, 450]},\n  color: {type: \"log\", scheme: \"ylgnbu\", legend: true, label: \"Made shots\"},\n  marks: [\n    Plot.rect(shots, Plot.bin({fill: \"count\"}, {x: \"loc_x\", y: \"loc_y\", filter: d => +d.shot_made_flag, inset: 0, interval: 5})),\n    Plot.gridX({interval: 5, strokeOpacity: 0.05}),\n    Plot.gridY({interval: 5, strokeOpacity: 0.05}),\n    markings()\n  ]\n})\n\nmarkings = function markings({\n  stroke = \"currentColor\",\n  strokeWidth = 1,\n  strokeOpacity = 1\n} = {}) {\n  // Ref. https://observablehq.com/@nor/nba-2018-19-shooting-effeciency\n  const angle = Math.atan(90 / 220);\n  const arc = d3.arc();\n  const lines = [\n    [-250, 420, 250, 420], // half\n    [-250, 450, -250, -50], // left\n    [250, 450, 250, -50], // right\n    [250, -50, -250, -50], // bottom\n    [-220, -50, -220, 90], // corner 3\n    [220, -50, 220, 90], // corner 3\n    [-80, -50, -80, 140], // paint\n    [80, -50, 80, 140], // paint\n    [-60, -50, -60, 140], // paint\n    [60, -50, 60, 140], // paint\n    [-80, 140, 80, 140], // free throw line\n    [-30, -10, 30, -10], // backboard\n    [0, -10, 0, -7.5], // rim\n    [-40, -10, -40, 0], // ra\n    [40, -10, 40, 0] // ra    \n  ];\n  const circles = [\n    [0, 0, 7.5],  // rim\n    [0, 140, 60],  // key\n    [0, 420, 20],  // center court inner\n    [0, 420, 60]  // center court outer\n  ];\n  const arcs = [\n    [0, 0, 40, -Math.PI * 0.5, Math.PI * 0.5], // ra\n    [0, 0, 237.5, -Math.PI * 0.5 - angle, Math.PI * 0.5 + angle] // 3pt\n  ];\n  return (index, {x, y}) => {\n    return htl.svg`<g fill=none stroke=${stroke} stroke-width=${strokeWidth} stroke-opacity=${strokeOpacity}>\n      ${lines.map(([x1, y1, x2, y2]) => htl.svg`<line x1=${x(x1)} x2=${x(x2)} y1=${y(y1)} y2=${y(y2)}>`)}\n      ${circles.map(([cx, cy, r]) => htl.svg`<ellipse cx=${x(cx)} cy=${y(cy)} rx=${Math.abs(x(r) - x(0))} ry=${Math.abs(y(r) - y(0))}>`)}\n      ${arcs.map(([cx, cy, r, a1, a2]) => htl.svg`<path d=\"M${x(cx + r * Math.cos(a1 - Math.PI / 2))},${y(cy + r * Math.sin(a1 - Math.PI / 2))}A${Math.abs(x(r) - x(0))} ${Math.abs(y(r) - y(0))} 0 0 ${Math.sign(x(r) - x(0)) * Math.sign(y(r) - y(0)) > 0 ? 0 : 1} ${x(cx + r * Math.cos(a2 - Math.PI / 2))},${y(cy + r * Math.sin(a2 - Math.PI / 2))}\">`)}\n    </g>`;\n  };\n}\n\nshots = FileAttachment(\"lebron_shots.csv\").csv()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: LeBron James’ shots</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# LeBron James’ shots

A recreation of [Matt Stiles’](https://observablehq.com/d/d280cb30053f69a9) and [Mitchell Thorson’s](https://observablehq.com/d/db0a303ce8c90c89) basketball shot charts in [Observable Plot](https://observablehq.com/plot/), demonstrating a custom mark to render the court markings. Based on work by [Nicholas Ortenzio](https://observablehq.com/@nor/nba-2018-19-shooting-effeciency). The [bin transform](https://observablehq.com/plot/transforms/bin) is used to produce a heatmap.`
)}

function _2(Plot,shots,markings){return(
Plot.plot({
  height: 640,
  axis: null,
  x: {domain: [-250, 250]},
  y: {domain: [-50, 450]},
  color: {type: "log", scheme: "ylgnbu", legend: true, label: "Made shots"},
  marks: [
    Plot.rect(shots, Plot.bin({fill: "count"}, {x: "loc_x", y: "loc_y", filter: d => +d.shot_made_flag, inset: 0, interval: 5})),
    Plot.gridX({interval: 5, strokeOpacity: 0.05}),
    Plot.gridY({interval: 5, strokeOpacity: 0.05}),
    markings()
  ]
})
)}

function _markings(d3,htl){return(
function markings({
  stroke = "currentColor",
  strokeWidth = 1,
  strokeOpacity = 1
} = {}) {
  // Ref. https://observablehq.com/@nor/nba-2018-19-shooting-effeciency
  const angle = Math.atan(90 / 220);
  const arc = d3.arc();
  const lines = [
    [-250, 420, 250, 420], // half
    [-250, 450, -250, -50], // left
    [250, 450, 250, -50], // right
    [250, -50, -250, -50], // bottom
    [-220, -50, -220, 90], // corner 3
    [220, -50, 220, 90], // corner 3
    [-80, -50, -80, 140], // paint
    [80, -50, 80, 140], // paint
    [-60, -50, -60, 140], // paint
    [60, -50, 60, 140], // paint
    [-80, 140, 80, 140], // free throw line
    [-30, -10, 30, -10], // backboard
    [0, -10, 0, -7.5], // rim
    [-40, -10, -40, 0], // ra
    [40, -10, 40, 0] // ra    
  ];
  const circles = [
    [0, 0, 7.5],  // rim
    [0, 140, 60],  // key
    [0, 420, 20],  // center court inner
    [0, 420, 60]  // center court outer
  ];
  const arcs = [
    [0, 0, 40, -Math.PI * 0.5, Math.PI * 0.5], // ra
    [0, 0, 237.5, -Math.PI * 0.5 - angle, Math.PI * 0.5 + angle] // 3pt
  ];
  return (index, {x, y}) => {
    return htl.svg`<g fill=none stroke=${stroke} stroke-width=${strokeWidth} stroke-opacity=${strokeOpacity}>
      ${lines.map(([x1, y1, x2, y2]) => htl.svg`<line x1=${x(x1)} x2=${x(x2)} y1=${y(y1)} y2=${y(y2)}>`)}
      ${circles.map(([cx, cy, r]) => htl.svg`<ellipse cx=${x(cx)} cy=${y(cy)} rx=${Math.abs(x(r) - x(0))} ry=${Math.abs(y(r) - y(0))}>`)}
      ${arcs.map(([cx, cy, r, a1, a2]) => htl.svg`<path d="M${x(cx + r * Math.cos(a1 - Math.PI / 2))},${y(cy + r * Math.sin(a1 - Math.PI / 2))}A${Math.abs(x(r) - x(0))} ${Math.abs(y(r) - y(0))} 0 0 ${Math.sign(x(r) - x(0)) * Math.sign(y(r) - y(0)) > 0 ? 0 : 1} ${x(cx + r * Math.cos(a2 - Math.PI / 2))},${y(cy + r * Math.sin(a2 - Math.PI / 2))}">`)}
    </g>`;
  };
}
)}

function _shots(FileAttachment){return(
FileAttachment("lebron_shots.csv").csv()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["lebron_shots.csv", {url: "https://static.observableusercontent.com/files/32c28b607af022d2dc3147169611625ace1a401c04dea3a37e6a0340fa756664daf366c40d3f25eb30ff659866ca0a8dd59184b5460355567e6990fdf6c61ade", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","shots","markings"], _2);
  main.variable(observer("markings")).define("markings", ["d3","htl"], _markings);
  main.variable(observer("shots")).define("shots", ["FileAttachment"], _shots);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-marimekko"] = { code: "sales = FileAttachment(\"sales.csv\").csv({typed: true})\n\nmarimekko = function marimekko({\n  x,\n  y,\n  z,\n  value = z,\n  anchor = \"middle\",\n  inset = 0.5,\n  ...options\n} = {}) {\n  const stackX = /\\bleft$/i.test(anchor) ? Plot.stackX1 : /\\bright$/i.test(anchor) ? Plot.stackX2 : Plot.stackX;\n  const stackY = /^top\\b/i.test(anchor) ? Plot.stackY2 : /^bottom\\b/i.test(anchor) ? Plot.stackY1 : Plot.stackY;\n  const [Xv, setXv] = Plot.column(value);\n  const {x: X, x1, x2, transform: tx} = stackX({offset: \"expand\", y, x: Xv});\n  const {y: Y, y1, y2, transform: ty} = stackY({offset: \"expand\", x, y: value});\n  return Plot.transform({x: X, x1, x2, y: Y, y1, y2, z, inset, frameAnchor: anchor, ...options}, (data, facets) => {\n    const I = d3.range(data.length);\n    const X = Plot.valueof(data, x);\n    const Z = Plot.valueof(data, value);\n    const sum = d3.rollup(I, I => d3.sum(I, i => Z[i]), i => X[i]);\n    setXv(I.map(i => sum.get(X[i])));\n    tx(data, facets);\n    ty(data, facets);\n    return {data, facets};\n  });\n}\n\nmarimekkoXY = (sX, sY, options) => marimekko(options)\n\nmarimekkoMid = marimekko\n\nmarimekkoTopLeft = options => marimekko({...options, anchor: \"top-left\"})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Marimekko</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Marimekko

A Marimekko chart, or mosaic plot, visualizes a distribution along two dimensions. Here, sales are broken down by market along the *x*-axis and segment along the *y*-axis. The area of each [rect](https://observablehq.com/plot/marks/rect) encodes the value sold. A custom [transform](https://observablehq.com/plot/features/transforms) is used to apply Plot’s [stack](https://observablehq.com/plot/transforms/stack) transform twice; first along *x* and then along *y*.`
)}

function _chart(marimekko,Plot,sales)
{
  const xy = (options) => marimekko({...options, x: "market", y: "segment", value: "value"});
  return Plot.plot({
    width: 960,
    height: 640,
    label: null,
    x: {percent: true, ticks: 10, tickFormat: (d) => d === 100 ? `100%` : d},
    y: {percent: true, ticks: 10, tickFormat: (d) => d === 100 ? `100%` : d},
    marks: [
      Plot.frame(),
      Plot.rect(sales, xy({fill: "segment", fillOpacity: 0.5})),
      Plot.text(sales, xy({text: d => [d.value.toLocaleString("en"), d.segment, d.market].join("\n")})),
      Plot.text(sales, Plot.selectMaxX(xy({z: "segment", text: "segment", anchor: "right", textAnchor: "middle", lineAnchor: "bottom", rotate: 90, dx: 6}))),
      Plot.text(sales, Plot.selectMaxY(xy({z: "market", text: "market", anchor: "top", lineAnchor: "bottom", dy: -6})))
    ]
  });
}


function _sales(FileAttachment){return(
FileAttachment("sales.csv").csv({typed: true})
)}

function _marimekko(Plot,d3){return(
function marimekko({
  x,
  y,
  z,
  value = z,
  anchor = "middle",
  inset = 0.5,
  ...options
} = {}) {
  const stackX = /\bleft$/i.test(anchor) ? Plot.stackX1 : /\bright$/i.test(anchor) ? Plot.stackX2 : Plot.stackX;
  const stackY = /^top\b/i.test(anchor) ? Plot.stackY2 : /^bottom\b/i.test(anchor) ? Plot.stackY1 : Plot.stackY;
  const [Xv, setXv] = Plot.column(value);
  const {x: X, x1, x2, transform: tx} = stackX({offset: "expand", y, x: Xv});
  const {y: Y, y1, y2, transform: ty} = stackY({offset: "expand", x, y: value});
  return Plot.transform({x: X, x1, x2, y: Y, y1, y2, z, inset, frameAnchor: anchor, ...options}, (data, facets) => {
    const I = d3.range(data.length);
    const X = Plot.valueof(data, x);
    const Z = Plot.valueof(data, value);
    const sum = d3.rollup(I, I => d3.sum(I, i => Z[i]), i => X[i]);
    setXv(I.map(i => sum.get(X[i])));
    tx(data, facets);
    ty(data, facets);
    return {data, facets};
  });
}
)}

function _5(md){return(
md`---
`
)}

function _marimekkoXY(marimekko){return(
(sX, sY, options) => marimekko(options)
)}

function _marimekkoMid(marimekko){return(
marimekko
)}

function _marimekkoTopLeft(marimekko){return(
options => marimekko({...options, anchor: "top-left"})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["sales.csv", {url: "https://static.observableusercontent.com/files/221892f8bfdad60526c66acd9627526a3391f25d6f7933cbad0841dddab1046cb6dd92684cbbedd4dfa2e62b0960ca978518676dd55de4cb52c936f2e139ebde", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["marimekko","Plot","sales"], _chart);
  main.variable(observer("sales")).define("sales", ["FileAttachment"], _sales);
  main.variable(observer("marimekko")).define("marimekko", ["Plot","d3"], _marimekko);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("marimekkoXY")).define("marimekkoXY", ["marimekko"], _marimekkoXY);
  main.variable(observer("marimekkoMid")).define("marimekkoMid", ["marimekko"], _marimekkoMid);
  main.variable(observer("marimekkoTopLeft")).define("marimekkoTopLeft", ["marimekko"], _marimekkoTopLeft);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__observable-plot-grid-choropleth"] = { code: "Plot.plot({\n  height: 420,\n  axis: null,\n  color: {\n    type: \"diverging-log\", // diverging-log scales pivot at 1 by default\n    scheme: \"piyg\"\n  },\n  marks: [\n    Plot.cell(states, {x: \"x\", y: \"y\", fill: change}),\n    Plot.text(states, {x: \"x\", y: \"y\", text: \"key\", dy: -2}), // state abbr\n    Plot.text(states, {x: \"x\", y: \"y\", text: formatChange, dy: 10, fillOpacity: 0.6})\n  ]\n})\n\ngrid = FileAttachment(\"grid.csv\").csv({ typed: true })\n  .then((states) => new Map(states.map((state) => [state.name, state])))\n\npopulation = FileAttachment(\"population.csv\").csv({typed: true})\n\nstates = population\n  .filter((d) => grid.has(d.State))\n  .map((d) => ({ ...d, ...grid.get(d.State) }))\n\nchange = d => d[\"2019\"] / d[\"2010\"]\n\nformatChange = ((f) => (d) => f(change(d) - 1))(d3.format(\"+.0%\"))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Grid choropleth</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Grid choropleth`
)}

function _2(md){return(
md`This grid choropleth created in [Observable Plot](https://observablehq.com/@observablehq/plot) shows the population change in each state (and DC) in the United States between 2019 and 2010. 

A grid map, shown here using the [cell mark](https://observablehq.com/plot/marks/cell) makes each state the same size shape while keeping the states roughly aligned geographically. The diverging-log color scale with the green/pink scheme indicates if the state is increasing or decreasing in population, with darker colors representing a larger change.
`
)}

function _3(Plot,states,change,formatChange){return(
Plot.plot({
  height: 420,
  axis: null,
  color: {
    type: "diverging-log", // diverging-log scales pivot at 1 by default
    scheme: "piyg"
  },
  marks: [
    Plot.cell(states, {x: "x", y: "y", fill: change}),
    Plot.text(states, {x: "x", y: "y", text: "key", dy: -2}), // state abbr
    Plot.text(states, {x: "x", y: "y", text: formatChange, dy: 10, fillOpacity: 0.6})
  ]
})
)}

function _4(md){return(
md`### US Grid & Data`
)}

function _grid(FileAttachment){return(
FileAttachment("grid.csv").csv({ typed: true })
  .then((states) => new Map(states.map((state) => [state.name, state])))
)}

function _population(FileAttachment){return(
FileAttachment("population.csv").csv({typed: true})
)}

function _states(population,grid){return(
population
  .filter((d) => grid.has(d.State))
  .map((d) => ({ ...d, ...grid.get(d.State) }))
)}

function _change(){return(
d => d["2019"] / d["2010"]
)}

function _formatChange(change,d3){return(
((f) => (d) => f(change(d) - 1))(d3.format("+.0%"))
)}

function _10(md){return(
md`
*Thank you to [@severo](https://observablehq.com/@severo) for [Quality Criteria for Existing Gridmaps](https://observablehq.com/@severo/quality-criteria-for-existing-grid-maps), to Krist Wongsuphasawat for his [analysis](https://kristw.medium.com/whose-grid-map-is-better-quality-metrics-for-grid-map-layouts-e3d6075d9e80), and to the New York Times for their grid map layout.*`
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["population.csv", {url: "https://static.observableusercontent.com/files/eafb26048ba58762a4b3105e4726b1705e602228d3bda0b161c83d8c9cce99332e4687cb8a5b544d307d5b5baefbed33d9ee5174da6c97fd9435e67ba92b2475", mimeType: "text/csv"}],
    ["grid.csv", {url: "https://static.observableusercontent.com/files/269079625239914522d83ef62f9df89c50dc9df32fb33e4db65ba8c35e9e3cf944c35c1815ea8b237d4eac950b768d2f178bbcd48087bf3ac3e232115361a339", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["Plot","states","change","formatChange"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("grid")).define("grid", ["FileAttachment"], _grid);
  main.variable(observer("population")).define("population", ["FileAttachment"], _population);
  main.variable(observer("states")).define("states", ["population","grid"], _states);
  main.variable(observer("change")).define("change", _change);
  main.variable(observer("formatChange")).define("formatChange", ["change","d3"], _formatChange);
  main.variable(observer()).define(["md"], _10);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-county-boxes"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.rect(countyboxes, {\n      x1: \"0\", // or ([x1]) => x1\n      y1: \"1\", // or ([, y1]) => y1\n      x2: \"2\", // or ([,, x2]) => x2\n      y2: \"3\", // or ([,,, y2]) => y2\n      stroke: \"currentColor\"\n    })\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: County boxes</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# County boxes

Geographic bounding boxes of U.S. counties, rendered as [rects](https://observablehq.com/plot/marks/rect) with the four coordinates *x₁*, *y₁*, *x₂* and *y₂*.`
)}

function _2(Plot,countyboxes){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.rect(countyboxes, {
      x1: "0", // or ([x1]) => x1
      y1: "1", // or ([, y1]) => y1
      x2: "2", // or ([,, x2]) => x2
      y2: "3", // or ([,,, y2]) => y2
      stroke: "currentColor"
    })
  ]
})
)}

function _countyboxes(topojson,us,d3)
{
  const counties = topojson.feature(us, us.objects.counties).features;
  return counties.map((d) => d3.geoBounds(d).flat());
}


function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","countyboxes"], _2);
  main.variable(observer("countyboxes")).define("countyboxes", ["topojson","us","d3"], _countyboxes);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-simple-line-chart"] = { code: "Plot.lineY(aapl, {x: \"Date\", y: \"Close\"}).plot({y: {grid: true}})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Simple line chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Simple line chart

The [line](https://observablehq.com/plot/marks/line) mark draws two-dimensional lines.`
)}

function _2(Plot,aapl){return(
Plot.lineY(aapl, {x: "Date", y: "Close"}).plot({y: {grid: true}})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-multiple-line-chart"] = { code: "Plot.plot({\n  y: {\n    grid: true,\n    label: \"↑ Unemployment (%)\"\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(bls, {x: \"date\", y: \"unemployment\", z: \"division\"})\n  ]\n})\n\nbls = FileAttachment(\"bls-metro-unemployment.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Multiple line chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Multiple line chart

Use the **z** channel (or **stroke**, or **fill**) to group [tidy data](https://r4ds.had.co.nz/tidy-data.html) into series and create multiple lines.`
)}

function _2(Plot,bls){return(
Plot.plot({
  y: {
    grid: true,
    label: "↑ Unemployment (%)"
  },
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(bls, {x: "date", y: "unemployment", z: "division"})
  ]
})
)}

function _bls(FileAttachment){return(
FileAttachment("bls-metro-unemployment.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["bls-metro-unemployment.csv", {url: "https://static.observableusercontent.com/files/cf77aaa2e0dab4123d57f8421210e5fa6955d75017369c93e3086b7369e4a040e398ed494b71d541a9c0c72575ac29cdc9e7038b6ae681cc1d761fec2c99a85f", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","bls"], _2);
  main.variable(observer("bls")).define("bls", ["FileAttachment"], _bls);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-labeled-multi-line-chart"] = { code: "Plot.plot({\n  style: \"overflow: visible;\",\n  y: {grid: true},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(stocks, {x: \"Date\", y: \"Close\", stroke: \"Symbol\"}),\n    Plot.text(stocks, Plot.selectLast({x: \"Date\", y: \"Close\", z: \"Symbol\", text: \"Symbol\", textAnchor: \"start\", dx: 3}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Labeled multi-line chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Labeled multi-line chart

The [selectLast](https://observablehq.com/plot/transforms/select) transform can be used to label the last point in each series of a multi-series [line](https://observablehq.com/plot/marks/line) chart.`
)}

function _2(Plot,stocks){return(
Plot.plot({
  style: "overflow: visible;",
  y: {grid: true},
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(stocks, {x: "Date", y: "Close", stroke: "Symbol"}),
    Plot.text(stocks, Plot.selectLast({x: "Date", y: "Close", z: "Symbol", text: "Symbol", textAnchor: "start", dx: 3}))
  ]
})
)}

function _3(md){return(
md`The cell below merges four CSV files, adding the symbol for each stock as the first column for each row.`
)}

async function _stocks(FileAttachment){return(
[
  ["AAPL", await FileAttachment("aapl.csv").csv({typed: true})],
  ["AMZN", await FileAttachment("amzn.csv").csv({typed: true})],
  ["GOOG", await FileAttachment("goog.csv").csv({typed: true})],
  ["IBM", await FileAttachment("ibm.csv").csv({typed: true})],
].flatMap(([Symbol, values]) => values.map(d => ({Symbol, ...d})))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["aapl.csv", {url: "https://static.observableusercontent.com/files/4cca720c6f519b999f8bc8d2f004f35c723fc4a36a75e0a4f180fe491728c723684fb21545cec9c5e78cc2f71e6006b180bf649da688b63ae5458847f723868a", mimeType: "text/csv"}],
    ["ibm.csv", {url: "https://static.observableusercontent.com/files/deda73c91713a911d57a035ba817fdd96ff7af6f3f53a5321f3ae67eb72f352be28907000dd9b66f143575ee95b1aa0fe69ac27473ccd0f7ebc8fd7c382f8840", mimeType: "text/csv"}],
    ["goog.csv", {url: "https://static.observableusercontent.com/files/36ca466aea0b600202110d48dc0abdab4c0ad037b7e6a5a0c63d080d2b4fc866c33a5423dc9d12faba851af92c0c25fa0c29e0ed51fe05a2ee53f6f4ad035761", mimeType: "text/csv"}],
    ["amzn.csv", {url: "https://static.observableusercontent.com/files/2b8dd551215b51f42b37daf50ec4489186958f5bb1e771e8c45c82b4936ec9da701b3521d39714a837ba60c9b3a7ad8adcab496ac70e2e7df37dc2a65305e5ef", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","stocks"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("stocks")).define("stocks", ["FileAttachment"], _stocks);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-index-chart"] = { code: "date = Scrubber(d3.union(stocks.map((d) => d.Date)), {\n  format: Plot.formatIsoDate,\n  initial: 500,\n  loop: false,\n  autoplay: false\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Index chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Index chart

A [normalize](https://observablehq.com/plot/transforms/normalize) transform is applied on the reference day, allowing comparison of stocks performance.`
)}

function _date(Scrubber,d3,stocks,Plot){return(
Scrubber(d3.union(stocks.map((d) => d.Date)), {
  format: Plot.formatIsoDate,
  initial: 500,
  loop: false,
  autoplay: false
})
)}

function _3(d3,stocks,date,Plot)
{
  const bisector = d3.bisector((i) => stocks[i].Date);
  const basis = (I, Y) => Y[I[bisector.center(I, date)]];
  return Plot.plot({
    style: "overflow: visible;",
    y: {
      type: "log",
      grid: true,
      label: "Change in price (%)",
      tickFormat: ((f) => (x) => f((x - 1) * 100))(d3.format("+d"))
    },
    marks: [
      Plot.ruleY([1]),
      Plot.ruleX([date]),
      Plot.lineY(stocks, Plot.normalizeY(basis, {
        x: "Date",
        y: "Close",
        stroke: "Symbol"
      })),
      Plot.text(stocks, Plot.selectLast(Plot.normalizeY(basis, {
        x: "Date",
        y: "Close",
        z: "Symbol",
        text: "Symbol",
        textAnchor: "start",
        dx: 3
      })))
    ]
  });
}


function _4(md){return(
md`The cell below merges four CSV files, adding the symbol for each stock as the first column for each row.`
)}

async function _stocks(FileAttachment){return(
(await Promise.all([
  FileAttachment("aapl.csv").csv({typed: true}).then((values) => ["AAPL", values]),
  FileAttachment("amzn.csv").csv({typed: true}).then((values) => ["AMZN", values]),
  FileAttachment("goog.csv").csv({typed: true}).then((values) => ["GOOG", values]),
  FileAttachment("ibm.csv").csv({typed: true}).then((values) => ["IBM", values]),
])).flatMap(([Symbol, values]) => values.map(d => ({Symbol, ...d})))
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("https://api.observablehq.com/d/450051d7f1174df8@255.js?v=4&resolutions=685847e6d26543e6@30")).default));
  const fileAttachments = new Map([
    ["aapl.csv", {url: "https://static.observableusercontent.com/files/4cca720c6f519b999f8bc8d2f004f35c723fc4a36a75e0a4f180fe491728c723684fb21545cec9c5e78cc2f71e6006b180bf649da688b63ae5458847f723868a", mimeType: "text/csv"}],
    ["ibm.csv", {url: "https://static.observableusercontent.com/files/deda73c91713a911d57a035ba817fdd96ff7af6f3f53a5321f3ae67eb72f352be28907000dd9b66f143575ee95b1aa0fe69ac27473ccd0f7ebc8fd7c382f8840", mimeType: "text/csv"}],
    ["goog.csv", {url: "https://static.observableusercontent.com/files/36ca466aea0b600202110d48dc0abdab4c0ad037b7e6a5a0c63d080d2b4fc866c33a5423dc9d12faba851af92c0c25fa0c29e0ed51fe05a2ee53f6f4ad035761", mimeType: "text/csv"}],
    ["amzn.csv", {url: "https://static.observableusercontent.com/files/2b8dd551215b51f42b37daf50ec4489186958f5bb1e771e8c45c82b4936ec9da701b3521d39714a837ba60c9b3a7ad8adcab496ac70e2e7df37dc2a65305e5ef", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof date")).define("viewof date", ["Scrubber","d3","stocks","Plot"], _date);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","stocks","date","Plot"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("stocks")).define("stocks", ["FileAttachment"], _stocks);
  main.define("Scrubber", ["module 1", "@variable"], (_, v) => v.import("Scrubber", _));
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-gradient-encoding"] = { code: "Plot.plot({\n  y: {nice: true},\n  color: { domain: [45, 75], scheme: \"turbo\", legend: true, ticks: 7, label: \"temperature (°F)\" },\n  marks: [\n    Plot.line(sftemp, {\n      x: \"date\",\n      y: \"high\",\n      stroke: \"url(#gradient)\",\n      curve: \"step-before\"\n    }),\n    \n    (_index, { y, color }) => htl.svg`<defs>\n   <linearGradient id=\"gradient\" gradientUnits=\"userSpaceOnUse\"\n     x1=0 x2=0 y1=${y(45)} y2=${y(75)}>${d3.ticks(0, 1, 10).map(\n      (t) =>\n        htl.svg`<stop\n                  offset=${t * 100}%\n                  stop-color=${color(45 * (1 - t) + 75 * t)} />`\n    )}`\n  ]\n})\n\nsftemp = FileAttachment(\"sf-temperatures.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Gradient encoding</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Gradient encoding

A custom [function mark](https://observablehq.com/plot/features/marks) returns a [SVG gradient](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients) (generated with [Hypertext Literal](https://observablehq.com/@observablehq/htl) and based on the color scale), that can be referenced as a [funciri](https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#funciri) stroke color in the [line](https://observablehq.com/plot/marks/line) mark.`
)}

function _2(Plot,sftemp,htl,d3){return(
Plot.plot({
  y: {nice: true},
  color: { domain: [45, 75], scheme: "turbo", legend: true, ticks: 7, label: "temperature (°F)" },
  marks: [
    Plot.line(sftemp, {
      x: "date",
      y: "high",
      stroke: "url(#gradient)",
      curve: "step-before"
    }),
    
    (_index, { y, color }) => htl.svg`<defs>
   <linearGradient id="gradient" gradientUnits="userSpaceOnUse"
     x1=0 x2=0 y1=${y(45)} y2=${y(75)}>${d3.ticks(0, 1, 10).map(
      (t) =>
        htl.svg`<stop
                  offset=${t * 100}%
                  stop-color=${color(45 * (1 - t) + 75 * t)} />`
    )}`
  ]
})
)}

function _sftemp(FileAttachment){return(
FileAttachment("sf-temperatures.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["sf-temperatures.csv", {url: "https://static.observableusercontent.com/files/b78f8bcd4b540922c6c36bbf0c3dac9109bcf248ccaeb4e26d573e5b236ee39bb47a553d352e9255ed2cd0d01bccf35b142536c1b1e963040a31000ea619b875", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","sftemp","htl","d3"], _2);
  main.variable(observer("sftemp")).define("sftemp", ["FileAttachment"], _sftemp);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-area-chart"] = { code: "Plot.areaY(aapl, {x: \"Date\", y: \"Close\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Area chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Area chart

The [area](https://observablehq.com/plot/marks/area) mark draws the region between a baseline (**x1**, **y1**) and a topline (**x2**, **y2**) as in an area chart. Often the baseline represents _y_ = 0, and because the area mark interpolates between adjacent data points, typically both the x and y scales are quantitative or temporal.`
)}

function _2(Plot,aapl){return(
Plot.areaY(aapl, {x: "Date", y: "Close"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-area-chart-with-gradient"] = { code: "Plot.plot({\n  y: {grid: true},\n  marks: [\n    () => htl.svg`<defs>\n      <linearGradient id=\"gradient\" gradientTransform=\"rotate(90)\">\n        <stop offset=\"20%\" stop-color=\"steelblue\" stop-opacity=\"0.5\" />\n        <stop offset=\"100%\" stop-color=\"brown\" stop-opacity=\"0\" />\n      </linearGradient>\n    </defs>`,\n    Plot.areaY(aapl, {x: \"Date\", y: \"Close\", fill: \"url(#gradient)\"}),\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\", stroke: \"steelblue\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Area chart with gradient</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Area chart with gradient

A custom [function mark](https://observablehq.com/plot/features/marks) returns a svg gradient (generated with [Hypertext Literal](https://observablehq.com/@observablehq/htl)), that can be referenced as a [funciri](https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#funciri) color in the [area](https://observablehq.com/plot/marks/area) mark.`
)}

function _2(Plot,htl,aapl){return(
Plot.plot({
  y: {grid: true},
  marks: [
    () => htl.svg`<defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="20%" stop-color="steelblue" stop-opacity="0.5" />
        <stop offset="100%" stop-color="brown" stop-opacity="0" />
      </linearGradient>
    </defs>`,
    Plot.areaY(aapl, {x: "Date", y: "Close", fill: "url(#gradient)"}),
    Plot.lineY(aapl, {x: "Date", y: "Close", stroke: "steelblue"}),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","htl","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-difference-chart"] = { code: "chart = Plot.plot({\n  width: 928,\n  height: 550,\n  x: { inset: 4 },\n  y: { grid: true, label: \"temperature (°F)\" },\n  color: { scheme: \"RdYlBu\", label: \"colder\" },\n  marks: [\n    Plot.differenceY(weather, {\n      x: \"date\",\n      y1: \"New York\",\n      y2: \"San Francisco\",\n      curve: \"step-after\",\n      positiveFill: () => \"NY\",\n      negativeFill: () => \"SF\",\n      tip: true\n    }),\n    Plot.text(\n      weather,\n      Plot.selectMaxY({\n        x: \"date\",\n        y: \"New York\",\n        text: () => \"New York\",\n        dy: -6\n      })\n    ),\n    Plot.text(weather, {\n      ...Plot.selectMaxY({\n        x: \"date\",\n        y: \"New York\"\n      }),\n      y: \"San Francisco\",\n      text: () => \"San Francisco\",\n      dy: 13\n    }),\n    Plot.text(\n      weather,\n      Plot.selectMinY({\n        x: \"date\",\n        y: \"New York\",\n        text: () => \"New York\",\n        textAnchor: \"start\",\n        dy: -10,\n        dx: 6\n      })\n    ),\n    Plot.text(weather, {\n      ...Plot.selectMinY({\n        x: \"date\",\n        y: \"New York\",\n        text: () => \"San Francisco\"\n      }),\n      y: \"San Francisco\",\n      dy: -40\n    })\n  ]\n})\n\nweather = FileAttachment(\"weather.tsv\").tsv({typed: true})\n  .then(l => l.map(d => ({...d, date: d3.utcParse(\"%Y%m%d\")(`${d.date}`)})))", imports: [], define: (function(){
function _1(chart,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Difference chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Difference chart

A difference chart highlights the difference between two values, typically entries vs exits. The amount is encoded as height, and the sign (surplus vs. deficit) as a solid color. In the chart below, we compare the temperatures on the same day; days when San Francisco was warmer are <span style="border-bottom: 2px solid ${chart.scale("color").apply("NY")}">orange</span>, and colder days are <span style="border-bottom: 2px solid ${chart.scale("color").apply("SF")}">blue</span>.`
)}

function _chart(Plot,weather){return(
Plot.plot({
  width: 928,
  height: 550,
  x: { inset: 4 },
  y: { grid: true, label: "temperature (°F)" },
  color: { scheme: "RdYlBu", label: "colder" },
  marks: [
    Plot.differenceY(weather, {
      x: "date",
      y1: "New York",
      y2: "San Francisco",
      curve: "step-after",
      positiveFill: () => "NY",
      negativeFill: () => "SF",
      tip: true
    }),
    Plot.text(
      weather,
      Plot.selectMaxY({
        x: "date",
        y: "New York",
        text: () => "New York",
        dy: -6
      })
    ),
    Plot.text(weather, {
      ...Plot.selectMaxY({
        x: "date",
        y: "New York"
      }),
      y: "San Francisco",
      text: () => "San Francisco",
      dy: 13
    }),
    Plot.text(
      weather,
      Plot.selectMinY({
        x: "date",
        y: "New York",
        text: () => "New York",
        textAnchor: "start",
        dy: -10,
        dx: 6
      })
    ),
    Plot.text(weather, {
      ...Plot.selectMinY({
        x: "date",
        y: "New York",
        text: () => "San Francisco"
      }),
      y: "San Francisco",
      dy: -40
    })
  ]
})
)}

function _weather(FileAttachment,d3){return(
FileAttachment("weather.tsv").tsv({typed: true})
  .then(l => l.map(d => ({...d, date: d3.utcParse("%Y%m%d")(`${d.date}`)})))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["weather.tsv", {url: "https://static.observableusercontent.com/files/d2ee76ca05621b4022071d1d2aa0e80110901286f18765aa2bc8a83cbc6e3da8ab7f93dbf864130cf3f0a2b7dec9b19936fb66def72a2f600156fdda16150afb", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["chart","md"], _1);
  main.variable(observer("chart")).define("chart", ["Plot","weather"], _chart);
  main.variable(observer("weather")).define("weather", ["FileAttachment","d3"], _weather);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-burndown-chart"] = { code: "Plot.plot({\n  width,\n  height: 600,\n  x: {label: null},\n  color: {legend: true, label: \"Opened\"},\n  marks: [\n    Plot.areaY(\n      issues.flatMap((i) =>\n        d3\n          .utcDays(i.created_at, i.closed_at ?? new Date(\"2024-10-18\"))\n          .map((at) => ({created_at: i.created_at, at}))\n      ),\n      Plot.binX(\n        {y: \"count\", filter: null},\n        {\n          x: \"at\",\n          fill: (d) => d3.utcWeek(d.created_at),\n          reverse: true,\n          curve: \"step\",\n          tip: {format: {x: null, z: null}},\n          interval: \"day\"\n        }\n      )\n    )\n  ]\n})\n\nissues = FileAttachment(\"framework-issues.json\")\n  .text()\n  .then((text) => JSON.parse(text, (key, value) => /_at$/.test(key) && value ? new Date(value) : value))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Burndown chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Burndown chart

Ref. https://observablehq.com/@tmcw/github-burndown`
)}

function _2(Plot,width,issues,d3){return(
Plot.plot({
  width,
  height: 600,
  x: {label: null},
  color: {legend: true, label: "Opened"},
  marks: [
    Plot.areaY(
      issues.flatMap((i) =>
        d3
          .utcDays(i.created_at, i.closed_at ?? new Date("2024-10-18"))
          .map((at) => ({created_at: i.created_at, at}))
      ),
      Plot.binX(
        {y: "count", filter: null},
        {
          x: "at",
          fill: (d) => d3.utcWeek(d.created_at),
          reverse: true,
          curve: "step",
          tip: {format: {x: null, z: null}},
          interval: "day"
        }
      )
    )
  ]
})
)}

function _issues(FileAttachment){return(
FileAttachment("framework-issues.json")
  .text()
  .then((text) => JSON.parse(text, (key, value) => /_at$/.test(key) && value ? new Date(value) : value))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["framework-issues.json", {url: "https://static.observableusercontent.com/files/4899d43689c87334bbf9ac8b4b850c9a0942cca2c86e0df61065d3810f6df77ef7155e2d9ea33574f7f9534e52e597d57764620d0ba73f410668ff753fa8942d", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","issues","d3"], _2);
  main.variable(observer("issues")).define("issues", ["FileAttachment"], _issues);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-arealiney-custom-mark"] = { code: "arealineY = function arealineY(data, {color, fillOpacity = 0.1, ...options} = {}) {\n  return Plot.marks(\n    Plot.ruleY([0]),\n    Plot.areaY(data, {fill: color, fillOpacity, ...options}),\n    Plot.lineY(data, {stroke: color, ...options})\n  );\n}\n\narealineY(aapl, {x: \"Date\", y: \"Close\", color: \"steelblue\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: arealineY custom mark</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# arealineY custom mark

Plot allows the creation of custom [composite marks](https://observablehq.com/plot/features/marks#marks-marks), such as this one comprising a rule, area, and line:`
)}

function _arealineY(Plot){return(
function arealineY(data, {color, fillOpacity = 0.1, ...options} = {}) {
  return Plot.marks(
    Plot.ruleY([0]),
    Plot.areaY(data, {fill: color, fillOpacity, ...options}),
    Plot.lineY(data, {stroke: color, ...options})
  );
}
)}

function _3(md){return(
md`You can use this composite mark like any built-in mark:`
)}

function _4(arealineY,aapl){return(
arealineY(aapl, {x: "Date", y: "Close", color: "steelblue"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("arealineY")).define("arealineY", ["Plot"], _arealineY);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["arealineY","aapl"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-faceted-areas"] = { code: "Plot.plot({\n  height: 720,\n  axis: null,\n  marks: [\n    Plot.areaY(industries, {x: \"date\", y: \"unemployed\", fy: \"industry\"}),\n    Plot.text(industries, Plot.selectFirst({text: \"industry\", fy: \"industry\", frameAnchor: \"top-left\", dx: 6, dy: 6})),\n    Plot.frame()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Faceted areas</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Faceted areas

Small multiples, rendering different [facets](https://observablehq.com/plot/features/facets) (subsets of the complete dataset), facilitate comparison between modalities. Here, the evolution of the number of unemployed workers across industries.`
)}

function _2(Plot,industries){return(
Plot.plot({
  height: 720,
  axis: null,
  marks: [
    Plot.areaY(industries, {x: "date", y: "unemployed", fy: "industry"}),
    Plot.text(industries, Plot.selectFirst({text: "industry", fy: "industry", frameAnchor: "top-left", dx: 6, dy: 6})),
    Plot.frame()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","industries"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-random-walk"] = { code: "Plot.plot({\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY({length: 10000}, Plot.mapY(\"cumsum\", {y: d3.randomNormal()}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Random walk</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Random walk

This [map transform](https://observablehq.com/plot/transforms/map) computes a cumulative sum (_cumsum_) of the values. Applied to a [random number generator](https://observablehq.com/@d3/d3-random#normal), this generates a random walk. Brownian movement in a single line of code!`
)}

function _2(Plot,d3){return(
Plot.plot({
  marks: [
    Plot.ruleY([0]),
    Plot.lineY({length: 10000}, Plot.mapY("cumsum", {y: d3.randomNormal()}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-bollinger-bands"] = { code: "n = Inputs.range([2, 100], {step: 1, value: 20, label: \"Periods (N)\"})\n\nk = Inputs.range([0, 4], {step: 0.1, value: 2, label: \"Deviations (K)\"})\n\nPlot.plot({\n  y: {grid: true},\n  marks: [\n    Plot.bollingerY(aapl, {n, k, x: \"Date\", y: \"Close\", stroke: \"none\"}),\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\", strokeWidth: 1})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Bollinger bands</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Bollinger bands

The [bollinger mark](https://observablehq.com/plot/marks/bollinger) draws an area where the top-line (**y2**) is the mean of the *N* most recent values plus *K* times the deviation of the *N* most recent values, and the bottom-line (**y1**) is symmetrically the mean of the *N* most recent values minus *K* times the deviation of the *N* most recent values. A central line usually represents the mean of the *N* most recent values — in the cart below we cancel it by setting the **stroke** option to none, and display the actual values instead:`
)}

function _n(Inputs){return(
Inputs.range([2, 100], {step: 1, value: 20, label: "Periods (N)"})
)}

function _k(Inputs){return(
Inputs.range([0, 4], {step: 0.1, value: 2, label: "Deviations (K)"})
)}

function _4(Plot,aapl,n,k){return(
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.bollingerY(aapl, {n, k, x: "Date", y: "Close", stroke: "none"}),
    Plot.lineY(aapl, {x: "Date", y: "Close", strokeWidth: 1})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof n")).define("viewof n", ["Inputs"], _n);
  main.variable(observer("n")).define("n", ["Generators", "viewof n"], (G, _) => G.input(_));
  main.variable(observer("viewof k")).define("viewof k", ["Inputs"], _k);
  main.variable(observer("k")).define("k", ["Generators", "viewof k"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","aapl","n","k"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-line-with-moving-average"] = { code: "Plot.plot({\n  color: {scheme: \"BuRd\"},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.dot(gistemp, {x: \"Date\", y: \"Anomaly\", stroke: \"Anomaly\"}),\n    Plot.lineY(gistemp, Plot.windowY(12, {x: \"Date\", y: \"Anomaly\"}))\n  ]\n})\n\ngistemp = FileAttachment(\"gistemp.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Line with moving average</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Line with moving average

The [window](https://observablehq.com/plot/transforms/window) transform can be used to draw a moving average atop points — here, global temperature readings. Source: [NASA Goddard Institute for Space Studies](https://data.giss.nasa.gov/gistemp/)`
)}

function _2(Plot,gistemp){return(
Plot.plot({
  color: {scheme: "BuRd"},
  marks: [
    Plot.ruleY([0]),
    Plot.dot(gistemp, {x: "Date", y: "Anomaly", stroke: "Anomaly"}),
    Plot.lineY(gistemp, Plot.windowY(12, {x: "Date", y: "Anomaly"}))
  ]
})
)}

function _gistemp(FileAttachment){return(
FileAttachment("gistemp.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["gistemp.csv", {url: "https://static.observableusercontent.com/files/1734c862dd51ef67930fef3dcd19e8184bb65c405683f55a085f97ca01c233713a53062c251fe0a6d72f93863fd5f714eadef3c9455b1b4f2ed90546cbc57b32", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","gistemp"], _2);
  main.variable(observer("gistemp")).define("gistemp", ["FileAttachment"], _gistemp);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-line-chart-with-gaps"] = { code: "Plot.plot({\n  y: {\n    grid: true\n  },\n  marks: [\n    Plot.lineY(aapl, {x: \"Date\", y: (d) => d.Date.getUTCMonth() < 3 ? NaN : d.Close})\n  ]\n})\n\nPlot.plot({\n  y: {\n    grid: true\n  },\n  marks: [\n    Plot.lineY(aapl, {filter: (d) => d.Date.getUTCMonth() >= 3, x: \"Date\", y: \"Close\", strokeOpacity: 0.3}),\n    Plot.lineY(aapl, {x: \"Date\", y: (d) => d.Date.getUTCMonth() < 3 ? NaN : d.Close})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Line with missing data</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Line with missing data

If some channel values are undefined (or null or NaN), gaps will appear between adjacent points of a [line](https://observablehq.com/plot/marks/line) mark. To demonstrate, below we set the **y** value to NaN for the first three months of each year.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.lineY(aapl, {x: "Date", y: (d) => d.Date.getUTCMonth() < 3 ? NaN : d.Close})
  ]
})
)}

function _3(md){return(
md`Contrast with a chart where missing values have been filtered out:`
)}

function _4(Plot,aapl){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.lineY(aapl, {filter: (d) => d.Date.getUTCMonth() >= 3, x: "Date", y: "Close", strokeOpacity: 0.3}),
    Plot.lineY(aapl, {x: "Date", y: (d) => d.Date.getUTCMonth() < 3 ? NaN : d.Close})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","aapl"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-sparse-line"] = { code: "Plot.lineY(data, {x: \"date\", y: \"value\", marker: true}).plot()\n\nPlot.rectY(data, Plot.binX({y: \"count\"}, {x: \"date\"})).plot()\n\nPlot.rectY(data, Plot.binX({y: \"count\"}, {x: \"date\", interval: \"day\", tip: true})).plot()\n\nPlot.lineY(data, Plot.binX({y: \"mean\"}, {x: \"date\", y: \"value\", interval: \"day\", marker: true})).plot()\n\nPlot.lineY(data, Plot.binX({y: \"mean\", filter: null}, {x: \"date\", y: \"value\", interval: \"day\", marker: true})).plot()\n\nPlot.lineY(data, {x: \"date\", y: \"value\", reduce: \"mean\", interval: \"day\", marker: true}).plot()\n\nPlot.plot({\n  marks: [\n    Plot.rectY(data, Plot.binX({y: \"count\"}, {x: \"date\", interval: \"day\", fill: \"#ccc\"})),\n    Plot.lineY(data, Plot.binX({y: \"count\"}, {x: \"date\", interval: \"day\"})),\n    Plot.ruleY([0])\n  ]\n})\n\nPlot.plot({\n  marks: [\n    Plot.rectY(data, Plot.binX({y: \"count\"}, {x: \"date\", interval: \"day\", fill: \"#ccc\"})),\n    Plot.lineY(data, Plot.binX({y: \"count\", filter: null}, {x: \"date\", interval: \"day\"})),\n    Plot.ruleY([0])\n  ]\n})\n\nPlot.lineY(data, {x: \"date\", reduce: \"count\", interval: \"day\"}).plot()\n\nPlot.areaY(data, {x: \"date\", y: true, reduce: \"count\", interval: \"day\"}).plot()\n\nPlot.plot({\n  marks: [\n    Plot.rectY(data, Plot.binX({y: \"count\"}, {x: \"date\", interval: \"day\", fill: \"#ccc\"})),\n    Plot.lineY(data, {x: \"date\", y: \"value\", reduce: \"mean\", interval: \"day\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`# Plot: Line with sparse data

Say you have some continuous function — oscillating temperature, say — with some irregularly sampled observations. Maybe you have a lot of samples in the summer months, but only sparse observations the rest of the year. You may be tempted to visualize the data as a line chart.`
)}

function _2(Plot,data){return(
Plot.lineY(data, {x: "date", y: "value", marker: true}).plot()
)}

function _3(md){return(
md`This approach works fine in the summer, when the observations are dense. But when the observations are sparse, interpolating linearly between the samples makes the data look pretty choppy! So what can you do instead?`
)}

function _4(md){return(
md`Well to start, let’s just look at when the observations occur to get a sense of the temporal distribution. In Plot, that’s the bin transform with the _count_ reducer.`
)}

function _5(Plot,data){return(
Plot.rectY(data, Plot.binX({y: "count"}, {x: "date"})).plot()
)}

function _6(md){return(
md`For more precision, we can choose a specific **interval**:`
)}

function _7(Plot,data){return(
Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", interval: "day", tip: true})).plot()
)}

function _8(md){return(
md`During the summer months, we generally have multiple observations per day. So it’d be reasonable to aggregate those observations into a single value to produce a smooth line, say by using the _mean_ or _median_.`
)}

function _9(Plot,data){return(
Plot.lineY(data, Plot.binX({y: "mean"}, {x: "date", y: "value", interval: "day", marker: true})).plot()
)}

function _10(md){return(
md`But again, this approach doesn’t work well when data is sparse. That’s because the bin transform won’t emit empty bins, and so the line mark will happily interpolate over the days when data is missing.`
)}

function _11(md){return(
md`We can tell the bin transform to emit empty bins using the **filter** output option.`
)}

function _12(Plot,data){return(
Plot.lineY(data, Plot.binX({y: "mean", filter: null}, {x: "date", y: "value", interval: "day", marker: true})).plot()
)}

function _13(md){return(
md`Now we get gaps when there aren’t any samples for a particular day, and thus no meaningful mean observed value.`
)}

function _14(md){return(
md`If this feels a little verbose to you, Plot has shorthand **interval** and **reduce** options that you can pass directly to the line mark. Plot knows to set the **filter** output option to null automatically since the line will interpolate across bins.`
)}

function _15(Plot,data){return(
Plot.lineY(data, {x: "date", y: "value", reduce: "mean", interval: "day", marker: true}).plot()
)}

function _16(md){return(
md`Filling in the gaps is especially important when using the _count_ reducer because by definition, without the empty bins we would never see a zero value! (I’ll plot the bins as rects below, too, so you can see the gaps more clearly.)`
)}

function _17(Plot,data){return(
Plot.plot({
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", interval: "day", fill: "#ccc"})),
    Plot.lineY(data, Plot.binX({y: "count"}, {x: "date", interval: "day"})),
    Plot.ruleY([0])
  ]
})
)}

function _18(md){return(
md`Compare to dense bins:`
)}

function _19(Plot,data){return(
Plot.plot({
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", interval: "day", fill: "#ccc"})),
    Plot.lineY(data, Plot.binX({y: "count", filter: null}, {x: "date", interval: "day"})),
    Plot.ruleY([0])
  ]
})
)}

function _20(md){return(
md`Or, as shorthand:`
)}

function _21(Plot,data){return(
Plot.lineY(data, {x: "date", reduce: "count", interval: "day"}).plot()
)}

function _22(md){return(
md`You can do the same with an area mark, but it seems like you also have to set the **y** option to anything. That’s probably [a bug](https://github.com/observablehq/plot/issues/2328).`
)}

function _23(Plot,data){return(
Plot.areaY(data, {x: "date", y: true, reduce: "count", interval: "day"}).plot()
)}

function _24(md){return(
md`Here’s another way of putting it together:`
)}

function _25(Plot,data){return(
Plot.plot({
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", interval: "day", fill: "#ccc"})),
    Plot.lineY(data, {x: "date", y: "value", reduce: "mean", interval: "day"}),
    Plot.ruleY([0])
  ]
})
)}

function _26(md){return(
md`---

## Appendix`
)}

function _data(d3)
{
  const r = d3.randomNormal.source(d3.randomLcg(42))(0, 20);
  const r2 = d3.randomNormal.source(d3.randomLcg(44))(0, 0.1);
  const origin = new Date("2024-07-01");
  return d3.range(1000).map(() => {
    const offset = r();
    return {date: new Date(+origin + offset * 864e5), value: Math.sin(offset / 4) + r2()};
  }).sort((a, b) => d3.ascending(a.date, b.date));
}


function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","data"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","data"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","data"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","data"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["Plot","data"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["Plot","data"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["Plot","data"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["Plot","data"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["Plot","data"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["Plot","data"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["Plot","data"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("data")).define("data", ["d3"], _data);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-window-reduce"] = { code: "Plot.plot({\n  y: {\n    grid: true,\n    label: \"↑ Temperature (°F)\"\n  },\n  marks: [\n    Plot.lineY(sftemp, {x: \"date\", y: \"low\", strokeOpacity: 0.3}),\n    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: \"min\"}, {x: \"date\", y: \"low\", stroke: \"blue\"})),\n    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: \"max\"}, {x: \"date\", y: \"low\", stroke: \"red\"})),\n    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: \"median\"}, {x: \"date\", y: \"low\"}))\n  ]\n})\n\nsftemp = FileAttachment(\"sf-temperatures.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Window reducers</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Window reducers

The [window](https://observablehq.com/plot/transforms/window) transform computes a moving window of *k* values, and then derives summary statistics from the current window, say to compute rolling averages, rolling medians, rolling minimums, or rolling maximums.`
)}

function _2(Plot,sftemp){return(
Plot.plot({
  y: {
    grid: true,
    label: "↑ Temperature (°F)"
  },
  marks: [
    Plot.lineY(sftemp, {x: "date", y: "low", strokeOpacity: 0.3}),
    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: "min"}, {x: "date", y: "low", stroke: "blue"})),
    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: "max"}, {x: "date", y: "low", stroke: "red"})),
    Plot.lineY(sftemp, Plot.windowY({k: 28, reduce: "median"}, {x: "date", y: "low"}))
  ]
})
)}

function _sftemp(FileAttachment){return(
FileAttachment("sf-temperatures.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["sf-temperatures.csv", {url: "https://static.observableusercontent.com/files/b78f8bcd4b540922c6c36bbf0c3dac9109bcf248ccaeb4e26d573e5b236ee39bb47a553d352e9255ed2cd0d01bccf35b142536c1b1e963040a31000ea619b875", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","sftemp"], _2);
  main.variable(observer("sftemp")).define("sftemp", ["FileAttachment"], _sftemp);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-line-chart-percent-change"] = { code: "basis = Inputs.range(d3.extent(aapl, d => d.Close), {label: \"Basis\", value: aapl[0].Close, step: 0.01, format: x => x.toFixed(2)})\n\nPlot.plot({\n  width: 928,\n  marginLeft: 45,\n  y: {type: \"log\", tickFormat: d => `${d > 1 ? \"+\" : \"\"}${Math.round(100 * (d - 1))}%`, grid: true, ticks: 12},\n  marks: [\n    Plot.ruleY([1]),\n    Plot.line(aapl, Plot.normalizeY(() => basis, {x: \"Date\", y: \"Close\", stroke: \"steelblue\"}))\n  ]\n})", imports: [], define: (function(){
function _1(basis,aapl,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Line chart, percent change</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Line chart, percent change

The variant of a [line chart](/@observablehq/plot-simple-line-chart) shows the change in price of Apple stock relative to ${basis.toFixed(2) === aapl[0].Close.toFixed(2) ? `its ${aapl[0].Date.toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})}`: "the"} price of $${basis.toFixed(2)}. <br>The vertical [log scale](https://observablehq.com/plot/features/scales#continuous-scales) allows [accurate comparison](/@mbostock/methods-of-comparison-compared); the [normalize transform](/plot/transforms/normalize) uses a custom basis, for interaction. Data: [Yahoo Finance](https://finance.yahoo.com/lookup)`
)}

function _basis(Inputs,d3,aapl){return(
Inputs.range(d3.extent(aapl, d => d.Close), {label: "Basis", value: aapl[0].Close, step: 0.01, format: x => x.toFixed(2)})
)}

function _3(Plot,aapl,basis){return(
Plot.plot({
  width: 928,
  marginLeft: 45,
  y: {type: "log", tickFormat: d => `${d > 1 ? "+" : ""}${Math.round(100 * (d - 1))}%`, grid: true, ticks: 12},
  marks: [
    Plot.ruleY([1]),
    Plot.line(aapl, Plot.normalizeY(() => basis, {x: "Date", y: "Close", stroke: "steelblue"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["basis","aapl","md"], _1);
  main.variable(observer("viewof basis")).define("viewof basis", ["Inputs","d3","aapl"], _basis);
  main.variable(observer("basis")).define("basis", ["Generators", "viewof basis"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","aapl","basis"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ridgeline"] = { code: "Plot.plot({\n  height: 40 + new Set(traffic.map((d) => d.name)).size * 17,\n  width,\n  marginBottom: 1,\n  marginLeft: 120,\n  x: {axis: \"top\"},\n  y: {axis: null, range: [2.5 * 17 - 2, (2.5 - overlap) * 17 - 2]},\n  fy: {label: null, domain: traffic.map((d) => d.name)}, // preserve input order\n  marks: [\n    Plot.areaY(traffic, {\n      x: \"date\",\n      y: \"value\",\n      fy: \"name\",\n      curve: \"basis\",\n      sort: \"date\",\n      fill: \"#ccc\",\n      fillOpacity: 1,\n      line: true,\n      stroke: \"black\",\n      strokeWidth: 1\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Ridgeline Plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Ridgeline Plot

Ridgeline plots are an alternative to [horizon charts](/@observablehq/plot-horizon) and small-multiple area charts that allow greater precision for a given vertical space at the expense of occlusion (overlapping areas). See also the [D3 version](/@d3/ridgeline-plot). Data: [Christopher Möller](https://gist.github.com/chrtze/c74efb46cadb6a908bbbf5227934bfea).`
)}

function _3(Plot,traffic,width,overlap){return(
Plot.plot({
  height: 40 + new Set(traffic.map((d) => d.name)).size * 17,
  width,
  marginBottom: 1,
  marginLeft: 120,
  x: {axis: "top"},
  y: {axis: null, range: [2.5 * 17 - 2, (2.5 - overlap) * 17 - 2]},
  fy: {label: null, domain: traffic.map((d) => d.name)}, // preserve input order
  marks: [
    Plot.areaY(traffic, {
      x: "date",
      y: "value",
      fy: "name",
      curve: "basis",
      sort: "date",
      fill: "#ccc",
      fillOpacity: 1,
      line: true,
      stroke: "black",
      strokeWidth: 1
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["traffic.csv", {url: "https://static.observableusercontent.com/files/4ea24221b4db5e916702f2056cc385f5a14a80a44c7c304af89957c5cb6c5707cf64372ab0c4ecd9858375af251ce70e9eb397da832f22afc57faf2f54eec9f9", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","traffic","width","overlap"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-psr-b1919-21"] = { code: "chart = Plot.plot({\n  height: 760,\n  marginTop: 30,\n  width,\n  axis: null,\n  x: {axis: \"bottom\", label: \"Time (ms) →\"},\n  y: {domain: [0, d3.max(pulsar, ([, y]) => y) / 16]},\n  marks: [Plot.lineY(pulsar, {x: \"0\", y: \"1\", fy: \"2\", fill: \"white\", stroke: \"currentColor\", strokeWidth: 1})]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: PSR B1919+21</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# PSR B1919+21

Data: [Borgar Þorsteinsson](https://bl.ocks.org/borgar/31c1e476b8e92a11d7e9), [Michael Zöllner](http://i.document.m05.de/2013/05/23/joy-divisions-unknown-pleasures-printed-in-3d/)`
)}

function _chart(Plot,width,d3,pulsar){return(
Plot.plot({
  height: 760,
  marginTop: 30,
  width,
  axis: null,
  x: {axis: "bottom", label: "Time (ms) →"},
  y: {domain: [0, d3.max(pulsar, ([, y]) => y) / 16]},
  marks: [Plot.lineY(pulsar, {x: "0", y: "1", fy: "2", fill: "white", stroke: "currentColor", strokeWidth: 1})]
})
)}

async function _pulsar(FileAttachment){return(
(await FileAttachment("pulsar.csv").csv({typed: true, array: true}))
  .flatMap((Y, z) => Y.map((y, x) => [x * 92 / 299, y, z]))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["pulsar.csv", {url: "https://static.observableusercontent.com/files/d8bb57e2ce25a2c277c80011c3aa3c6ad6c31df240f54193509f46623bc6612f19299403aba9778f5d3ce79285df9f615ac323906b2b1de2117e20f63af62f6b", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["Plot","width","d3","pulsar"], _chart);
  main.variable(observer("pulsar")).define("pulsar", ["FileAttachment"], _pulsar);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-unemployment-horizon-chart"] = { code: "Plot.plot({\n  height: 720,\n  axis: null,\n  y: {domain: [0, step]},\n  color: {scheme: \"YlGnBu\"},\n  facet: {data: industries, y: \"industry\"},\n  marks: [\n    d3.range(bands).map((i) => Plot.areaY(industries, {x: \"date\", y: (d) => d.unemployed - i * step, fill: i, clip: true})),\n    Plot.text(industries, Plot.selectFirst({text: \"industry\", frameAnchor: \"top-left\", dx: 6, dy: 6})),\n    Plot.frame()\n  ]\n})\n\nbands = 7\n\nstep = d3.max(industries, (d) => d.unemployed) / bands", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Unemployment horizon chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Unemployment horizon chart

By layering colored [bands](https://observablehq.com/plot/marks/area), the horizon chart makes the most of a limited vertical space. For another example, see [Horizon chart](https://observablehq.com/@observablehq/plot-horizon).`
)}

function _2(Plot,step,industries,d3,bands){return(
Plot.plot({
  height: 720,
  axis: null,
  y: {domain: [0, step]},
  color: {scheme: "YlGnBu"},
  facet: {data: industries, y: "industry"},
  marks: [
    d3.range(bands).map((i) => Plot.areaY(industries, {x: "date", y: (d) => d.unemployed - i * step, fill: i, clip: true})),
    Plot.text(industries, Plot.selectFirst({text: "industry", frameAnchor: "top-left", dx: 6, dy: 6})),
    Plot.frame()
  ]
})
)}

function _bands(){return(
7
)}

function _step(d3,industries,bands){return(
d3.max(industries, (d) => d.unemployed) / bands
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","step","industries","d3","bands"], _2);
  main.variable(observer("bands")).define("bands", _bands);
  main.variable(observer("step")).define("step", ["d3","industries","bands"], _step);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-horizon"] = { code: "bands = Inputs.range([2, 8], {step: 1, label: \"Bands\"})\n\nchart = Plot.plot({\n  height: 1100,\n  width: 928,\n  x: {axis: \"top\"},\n  y: {domain: [0, step], axis: null},\n  fy: {axis: null, domain: traffic.map((d) => d.name), padding: 0.05},\n  color: {\n    type: \"ordinal\",\n    scheme: \"Greens\",\n    label: \"Vehicles per hour\",\n    tickFormat: (i) => ((i + 1) * step).toLocaleString(\"en\"),\n    legend: true\n  },\n  marks: [\n    d3.range(bands).map((band) => Plot.areaY(traffic, {x: \"date\", y: (d) => d.value - band * step, fy: \"name\", fill: band, sort: \"date\", clip: true})),\n    Plot.axisFy({frameAnchor: \"left\", dx: -28, fill: \"currentColor\", textStroke: \"white\", label: null})\n  ]\n})\n\ntraffic = FileAttachment(\"traffic.csv\").csv({typed: true})\n\nstep = +(d3.max(traffic, (d) => d.value) / bands).toPrecision(2)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Horizon Chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Horizon Chart

Horizon charts are an alternative to [ridgeline plots](/@observablehq/plot-ridgeline) and small-multiple area charts that allow greater precision for a given vertical space by using colored bands. These charts can be used with diverging color scales to differentiate positive and negative values. See also the [D3 version](/@d3/horizon-chart/2). Data: [Christopher Möller](https://gist.github.com/chrtze/c74efb46cadb6a908bbbf5227934bfea).`
)}

function _bands(Inputs){return(
Inputs.range([2, 8], {step: 1, label: "Bands"})
)}

function _chart(Plot,step,traffic,d3,bands){return(
Plot.plot({
  height: 1100,
  width: 928,
  x: {axis: "top"},
  y: {domain: [0, step], axis: null},
  fy: {axis: null, domain: traffic.map((d) => d.name), padding: 0.05},
  color: {
    type: "ordinal",
    scheme: "Greens",
    label: "Vehicles per hour",
    tickFormat: (i) => ((i + 1) * step).toLocaleString("en"),
    legend: true
  },
  marks: [
    d3.range(bands).map((band) => Plot.areaY(traffic, {x: "date", y: (d) => d.value - band * step, fy: "name", fill: band, sort: "date", clip: true})),
    Plot.axisFy({frameAnchor: "left", dx: -28, fill: "currentColor", textStroke: "white", label: null})
  ]
})
)}

function _traffic(FileAttachment){return(
FileAttachment("traffic.csv").csv({typed: true})
)}

function _step(d3,traffic,bands){return(
+(d3.max(traffic, (d) => d.value) / bands).toPrecision(2)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["traffic.csv", {url: "https://static.observableusercontent.com/files/4ea24221b4db5e916702f2056cc385f5a14a80a44c7c304af89957c5cb6c5707cf64372ab0c4ecd9858375af251ce70e9eb397da832f22afc57faf2f54eec9f9", mimeType: "text/csv"}],
    ["plot.umd.js", {url: "https://static.observableusercontent.com/files/4cbc62bf8447b7270ba0572b3f326638192faac0d10033c3258d1cdb5c0e6de3dcf52e5f081d3d6cc42c9a0317228b31dcab70047772fbf2bdb0ca01a888044a", mimeType: "application/javascript"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof bands")).define("viewof bands", ["Inputs"], _bands);
  main.variable(observer("bands")).define("bands", ["Generators", "viewof bands"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["Plot","step","traffic","d3","bands"], _chart);
  main.variable(observer("traffic")).define("traffic", ["FileAttachment"], _traffic);
  main.variable(observer("step")).define("step", ["d3","traffic","bands"], _step);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacked-area-chart"] = { code: "Plot.plot({\n  marginLeft: 50,\n  width: 928,\n  y: {\n    grid: true,\n    label: \"↑ Unemployed (thousands)\"\n  },\n  marks: [\n    Plot.areaY(unemployment, {x: \"date\", y: \"unemployed\", fill: \"industry\", title: \"industry\"}),\n    Plot.ruleY([0])\n  ]\n})\n\nunemployment = FileAttachment(\"unemployment.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacked area chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacked area chart

The [areaY](https://observablehq.com/plot/marks/area) mark implicitly [stacks](https://observablehq.com/plot/features/stack) the areas vertically, avoiding occlusion and allowing the reader to make sense of the total as well as of the parts.`
)}

function _2(Plot,unemployment){return(
Plot.plot({
  marginLeft: 50,
  width: 928,
  y: {
    grid: true,
    label: "↑ Unemployed (thousands)"
  },
  marks: [
    Plot.areaY(unemployment, {x: "date", y: "unemployed", fill: "industry", title: "industry"}),
    Plot.ruleY([0])
  ]
})
)}

function _unemployment(FileAttachment){return(
FileAttachment("unemployment.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["unemployment.csv", {url: "https://static.observableusercontent.com/files/76f13741128340cc88798c0a0b7fa5a2df8370f57554000774ab8ee9ae785ffa2903010cad670d4939af3e9c17e5e18e7e05ed2b38b848ac2fc1a0066aa0005f", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","unemployment"], _2);
  main.variable(observer("unemployment")).define("unemployment", ["FileAttachment"], _unemployment);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stacking-order-and-reverse"] = { code: "order = Inputs.select(\n  new Map([\n    [\"null\", null],\n    [\"appearance\", \"appearance\"],\n    [\"inside-out\", \"inside-out\"],\n    [\"sum\", \"sum\"],\n    [\"group\", \"group\"],\n    [\"z\", \"z\"]\n  ]),\n  { label: \"order\", value: \"appearance\" }\n)\n\nreverse = Inputs.toggle({label: \"reverse\"})\n\nPlot.plot({\n  y: {\n    grid: true,\n    label: \"↑ Annual revenue (billions, adj.)\",\n    transform: (d) => d / 1000 // convert millions to billions\n  },\n  color: { legend: true },\n  marks: [\n    Plot.areaY(\n      riaa,\n      Plot.stackY(\n        { order, reverse },\n        { x: \"year\", y: \"revenue\", z: \"format\", fill: \"group\" }\n      )\n    ),\n    Plot.ruleY([0])\n  ]\n})\n\nriaa = FileAttachment(\"riaa-us-revenue.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stacking order and reverse</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stacking order and reverse

The **order** and **reverse** options control the order in which the [stack](https://observablehq.com/plot/transforms/stack) transform stacks series.`
)}

function _order(Inputs){return(
Inputs.select(
  new Map([
    ["null", null],
    ["appearance", "appearance"],
    ["inside-out", "inside-out"],
    ["sum", "sum"],
    ["group", "group"],
    ["z", "z"]
  ]),
  { label: "order", value: "appearance" }
)
)}

function _reverse(Inputs){return(
Inputs.toggle({label: "reverse"})
)}

function _4(Plot,riaa,order,reverse){return(
Plot.plot({
  y: {
    grid: true,
    label: "↑ Annual revenue (billions, adj.)",
    transform: (d) => d / 1000 // convert millions to billions
  },
  color: { legend: true },
  marks: [
    Plot.areaY(
      riaa,
      Plot.stackY(
        { order, reverse },
        { x: "year", y: "revenue", z: "format", fill: "group" }
      )
    ),
    Plot.ruleY([0])
  ]
})
)}

function _riaa(FileAttachment){return(
FileAttachment("riaa-us-revenue.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["riaa-us-revenue.csv", {url: "https://static.observableusercontent.com/files/b676cd78ee900057bd3ea44667c502ee70d3719add31dd64ba3688b51fae8399521c44e1e4b8d0e8462cff5613bd879677b7302153319ccf8856c7082a61d1d8", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof order")).define("viewof order", ["Inputs"], _order);
  main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
  main.variable(observer("viewof reverse")).define("viewof reverse", ["Inputs"], _reverse);
  main.variable(observer("reverse")).define("reverse", ["Generators", "viewof reverse"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","riaa","order","reverse"], _4);
  main.variable(observer("riaa")).define("riaa", ["FileAttachment"], _riaa);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-population-pyramid"] = { code: "Plot.plot({\n  width: 500,\n  height: 500,\n  x: {\n    label: \"← men · population (thousands) · women →\",\n    labelAnchor: \"center\",\n    tickFormat: Math.abs\n  },\n  y: {grid: true},\n  color: {\n    domain: [\"ledig\", \"verheiratet\", \"geschieden\", \"verwitwet\"],\n    range: [\"#69AEBE\", \"#F1757A\", \"#F2B678\", \"#989D9E\"],\n    legend: true,\n    tickFormat: (d) => translations[d]\n  },\n  marks: [\n    Plot.areaX(population, {\n      x: (d) => d.population * (d.sex === \"M\" ? -1 : 1),\n      y: \"age\",\n      z: (d) => [d.sex, d.category].join(\",\"),\n      fill: \"category\"\n    }),\n    Plot.ruleX([0]),\n    Plot.ruleY([0])\n  ]\n})\n\ntranslations = {\n  ledig: \"single\",\n  verheiratet: \"married\",\n  geschieden: \"divorced\",\n  verwitwet: \"widowed\"\n}\n\npopulation = FileAttachment(\"population@1.csv\").csv({typed: true})\n\nPlot.plot({\n  color: {\n    domain: [\"ledig\", \"verheiratet\", \"geschieden\", \"verwitwet\"],\n    range: [\"#69AEBE\", \"#F1757A\", \"#F2B678\", \"#989D9E\"],\n    legend: true,\n    tickFormat: d => translations[d]\n  },\n  height: 500,\n  width: 400,\n  marginBottom: 40,\n  marginLeft: 30,\n  marginRight: 30,\n  marks: [\n    Plot.axisY({\n      frameAnchor: \"middle\",\n      dx: 16,\n      tickSize: 30,\n      label: null,\n      tickFormat: () => \"\",\n      strokeOpacity: (d) => (d ? (d % 10 ? 0.1 : 0.3) : 0)\n    }),\n    Plot.axisX({\n      ticks: [0, -250, -500, -750],\n      tickFormat: Math.abs,\n      dx: -20,\n      label: \"← men (thousands)\",\n      labelAnchor: \"left\"\n    }),\n    Plot.axisX({ ticks: [0, 250, 500, 750], dx: 20, label: \"women (thousands) →\" }),\n    Plot.axisY({\n      frameAnchor: \"middle\",\n      dx: 16,\n      tickSize: 0,\n      label: null,\n      ticks: 10,\n      fill: \"currentColor\",\n      textStroke: \"white\",\n      textStrokeWidth: 10\n    }),\n    Plot.text([\"↑ age\"], { frameAnchor: \"top\", dy: -10 }),\n    Plot.areaX(population, {\n      y: \"age\",\n      x: (d) => -d.population,\n      dx: -20,\n      fill: \"category\",\n      filter: (d) => d.sex === \"M\"\n    }),\n    Plot.areaX(population, {\n      y: \"age\",\n      x: \"population\",\n      dx: 20,\n      fill: \"category\",\n      filter: (d) => d.sex === \"F\"\n    }),\n    Plot.ruleY([0], {\n      x1: 0,\n      x2: -850,\n      dx: -20\n    }),\n    Plot.ruleY([0], {\n      x1: 0,\n      x2: 850,\n      dx: 20\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Population pyramid</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Population pyramid

Horizontally [stacked](https://observablehq.com/plot/transforms/stack) areas. Data: German Federal Institute for Population Research (BiB). To learn more, see Éric Mauvière’s [tutorial](/@ericmauviere/population-pyramid-with-plot) on population pyramids.`
)}

function _2(Plot,translations,population){return(
Plot.plot({
  width: 500,
  height: 500,
  x: {
    label: "← men · population (thousands) · women →",
    labelAnchor: "center",
    tickFormat: Math.abs
  },
  y: {grid: true},
  color: {
    domain: ["ledig", "verheiratet", "geschieden", "verwitwet"],
    range: ["#69AEBE", "#F1757A", "#F2B678", "#989D9E"],
    legend: true,
    tickFormat: (d) => translations[d]
  },
  marks: [
    Plot.areaX(population, {
      x: (d) => d.population * (d.sex === "M" ? -1 : 1),
      y: "age",
      z: (d) => [d.sex, d.category].join(","),
      fill: "category"
    }),
    Plot.ruleX([0]),
    Plot.ruleY([0])
  ]
})
)}

function _translations(){return(
{
  ledig: "single",
  verheiratet: "married",
  geschieden: "divorced",
  verwitwet: "widowed"
}
)}

function _population(FileAttachment){return(
FileAttachment("population@1.csv").csv({typed: true})
)}

function _5(Plot,translations,population){return(
Plot.plot({
  color: {
    domain: ["ledig", "verheiratet", "geschieden", "verwitwet"],
    range: ["#69AEBE", "#F1757A", "#F2B678", "#989D9E"],
    legend: true,
    tickFormat: d => translations[d]
  },
  height: 500,
  width: 400,
  marginBottom: 40,
  marginLeft: 30,
  marginRight: 30,
  marks: [
    Plot.axisY({
      frameAnchor: "middle",
      dx: 16,
      tickSize: 30,
      label: null,
      tickFormat: () => "",
      strokeOpacity: (d) => (d ? (d % 10 ? 0.1 : 0.3) : 0)
    }),
    Plot.axisX({
      ticks: [0, -250, -500, -750],
      tickFormat: Math.abs,
      dx: -20,
      label: "← men (thousands)",
      labelAnchor: "left"
    }),
    Plot.axisX({ ticks: [0, 250, 500, 750], dx: 20, label: "women (thousands) →" }),
    Plot.axisY({
      frameAnchor: "middle",
      dx: 16,
      tickSize: 0,
      label: null,
      ticks: 10,
      fill: "currentColor",
      textStroke: "white",
      textStrokeWidth: 10
    }),
    Plot.text(["↑ age"], { frameAnchor: "top", dy: -10 }),
    Plot.areaX(population, {
      y: "age",
      x: (d) => -d.population,
      dx: -20,
      fill: "category",
      filter: (d) => d.sex === "M"
    }),
    Plot.areaX(population, {
      y: "age",
      x: "population",
      dx: 20,
      fill: "category",
      filter: (d) => d.sex === "F"
    }),
    Plot.ruleY([0], {
      x1: 0,
      x2: -850,
      dx: -20
    }),
    Plot.ruleY([0], {
      x1: 0,
      x2: 850,
      dx: 20
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["population@1.csv", {url: "https://static.observableusercontent.com/files/8cb49ee1f1b8d26f01d0d57d5a040966ba14a05bc5a3e12dc7afc6767bd0f605a1cb2cb4f1ef0fae94f73633ad9ab465b3b3d535757e985855a253c3866cf9a8", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","translations","population"], _2);
  main.variable(observer("translations")).define("translations", _translations);
  main.variable(observer("population")).define("population", ["FileAttachment"], _population);
  main.variable(observer()).define(["Plot","translations","population"], _5);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stack-offset"] = { code: "offset = Inputs.select(\n  new Map([\n    [\"null\", null],\n    [\"center\", \"center\"],\n    [\"wiggle\", \"wiggle\"]\n  ]),\n  { label: \"offset\", value: \"wiggle\" }\n)\n\nPlot.plot({\n  y: {\n    grid: true,\n    label: \"↑ Annual revenue (billions, adj.)\",\n    transform: (d) => d / 1000\n  },\n  marks: [\n    Plot.areaY(riaa, {x: \"year\", y: \"revenue\", z: \"format\", fill: \"group\", offset})\n  ]\n})\n\nriaa = FileAttachment(\"riaa-us-revenue.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Wiggle streamgraph</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Wiggle streamgraph

The *wiggle* **offset** translates [stacks](https://observablehq.com/plot/transforms/stack#stack-options) to minimize apparent movement. It is recommended for streamgraphs, and if used, changes the default **order** to inside-out; see [Byron & Wattenberg](http://leebyron.com/streamgraph/).`
)}

function _offset(Inputs){return(
Inputs.select(
  new Map([
    ["null", null],
    ["center", "center"],
    ["wiggle", "wiggle"]
  ]),
  { label: "offset", value: "wiggle" }
)
)}

function _3(Plot,riaa,offset){return(
Plot.plot({
  y: {
    grid: true,
    label: "↑ Annual revenue (billions, adj.)",
    transform: (d) => d / 1000
  },
  marks: [
    Plot.areaY(riaa, {x: "year", y: "revenue", z: "format", fill: "group", offset})
  ]
})
)}

function _riaa(FileAttachment){return(
FileAttachment("riaa-us-revenue.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["riaa-us-revenue.csv", {url: "https://static.observableusercontent.com/files/b676cd78ee900057bd3ea44667c502ee70d3719add31dd64ba3688b51fae8399521c44e1e4b8d0e8462cff5613bd879677b7302153319ccf8856c7082a61d1d8", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof offset")).define("viewof offset", ["Inputs"], _offset);
  main.variable(observer("offset")).define("offset", ["Generators", "viewof offset"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","riaa","offset"], _3);
  main.variable(observer("riaa")).define("riaa", ["FileAttachment"], _riaa);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-normalized-stack"] = { code: "Plot.plot({\n  y: {\n    label: \"↑ Annual revenue (%)\",\n    percent: true\n  },\n  marks: [\n    Plot.areaY(riaa, Plot.stackY({offset: \"normalize\", order: \"group\", reverse: true}, {x: \"year\", y: \"revenue\", z: \"format\", fill: \"group\"})),\n    Plot.ruleY([0, 1])\n  ]\n})\n\nriaa = FileAttachment(\"riaa-us-revenue.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Normalized stack</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Normalized stack

Use the *normalize* **offset** to rescale each [stack](https://observablehq.com/plot/transforms/stack#stack-options) to fill [0, 1]. Percentages are shown with the scale’s [percent](https://observablehq.com/plot/features/scales#scale-transforms) option. 
`
)}

function _2(Plot,riaa){return(
Plot.plot({
  y: {
    label: "↑ Annual revenue (%)",
    percent: true
  },
  marks: [
    Plot.areaY(riaa, Plot.stackY({offset: "normalize", order: "group", reverse: true}, {x: "year", y: "revenue", z: "format", fill: "group"})),
    Plot.ruleY([0, 1])
  ]
})
)}

function _riaa(FileAttachment){return(
FileAttachment("riaa-us-revenue.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["riaa-us-revenue.csv", {url: "https://static.observableusercontent.com/files/b676cd78ee900057bd3ea44667c502ee70d3719add31dd64ba3688b51fae8399521c44e1e4b8d0e8462cff5613bd879677b7302153319ccf8856c7082a61d1d8", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","riaa"], _2);
  main.variable(observer("riaa")).define("riaa", ["FileAttachment"], _riaa);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__apportionment-of-seats-in-the-ep"] = { code: "Plot.plot({\n  width,\n  height: 600,\n  y: { percent: true },\n  color: { type: \"ordinal\", scheme: \"set2\", legend: true },\n  marks: [\n    Plot.areaY(\n      members,\n      Plot.stackY({\n        x: \"date\",\n        y: \"seats\",\n        z: \"state\",\n        fill: \"joined\",\n        order: \"joined\",\n        title: (d) => `${d.state}\\nJoined ${d.joined}`,\n        stroke: \"#fff\",\n        strokeOpacity: 0.3,\n        offset: \"expand\",\n        curve: \"monotone-x\"\n      })\n    ),\n    Plot.text(\n      members,\n      Plot.selectLast(\n        Plot.stackY({\n          filter: (d) => d.date < new Date(2020, 0, 1),\n          x: \"date\",\n          y: \"seats\",\n          z: \"state\",\n          fill: \"joined\",\n          order: \"joined\",\n          text: \"state\",\n          textAnchor: \"start\",\n          dx: -17,\n          fill: \"#000\",\n          offset: \"expand\"\n        })\n      )\n    )\n  ]\n})\n\neu = FileAttachment(\"eu.csv\").csv()\n\ndates = eu.columns.slice(4)\n\ndateParse = d3.utcParse(\"%b %Y\")\n\nmembers = Array.from(\n  aq.from(eu)\n    .fold(dates)\n    .rename({ key: \"accession\", value: \"seats\", Joined: \"joined\", State: \"state\" }),\n  (d) => ({ state: d.state, seats: d.seats, joined: d.joined, date: dateParse(d.accession) })\n)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Normalized streamgraph</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Apportionment of seats in&nbsp;the&nbsp;European&nbsp;Parliament
## Normalized streamgraph

Evolution of EU countries relative apportionment of seats at the European Parliament, colored by year of accession. Although the areaY mark implicitly stacks values, we chose to make the [stack](https://observablehq.com/plot/transforms/stack) transform explicit, in order to minimize the difference between the two marks ([areaY](https://observablehq.com/plot/marks/area) and [textY](https://observablehq.com/plot/marks/text)). Original [D3 visualization](https://observablehq.com/@lucguillemot/apportionment-of-seats-in-the-european-parliament) created by [Luc Guillemot](/@lucguillemot). Data: [Wikipedia](https://en.wikipedia.org/wiki/Apportionment_in_the_European_Parliament).`
)}

function _2(Plot,width,members){return(
Plot.plot({
  width,
  height: 600,
  y: { percent: true },
  color: { type: "ordinal", scheme: "set2", legend: true },
  marks: [
    Plot.areaY(
      members,
      Plot.stackY({
        x: "date",
        y: "seats",
        z: "state",
        fill: "joined",
        order: "joined",
        title: (d) => `${d.state}\nJoined ${d.joined}`,
        stroke: "#fff",
        strokeOpacity: 0.3,
        offset: "expand",
        curve: "monotone-x"
      })
    ),
    Plot.text(
      members,
      Plot.selectLast(
        Plot.stackY({
          filter: (d) => d.date < new Date(2020, 0, 1),
          x: "date",
          y: "seats",
          z: "state",
          fill: "joined",
          order: "joined",
          text: "state",
          textAnchor: "start",
          dx: -17,
          fill: "#000",
          offset: "expand"
        })
      )
    )
  ]
})
)}

function _3(md){return(
md`The original dataset (**eu**) is a wide array, with one member state per row, and as many columns as there are dates. We make it _tidy_ with arquero’s fold operator, so that each row of the **members** array is an observation: _state_, _date_, and number of _seats_. The _joined_ column is used to color the state’s ribbon.`
)}

function _eu(FileAttachment){return(
FileAttachment("eu.csv").csv()
)}

function _dates(eu){return(
eu.columns.slice(4)
)}

function _dateParse(d3){return(
d3.utcParse("%b %Y")
)}

function _members(aq,eu,dates,dateParse){return(
Array.from(
  aq.from(eu)
    .fold(dates)
    .rename({ key: "accession", value: "seats", Joined: "joined", State: "state" }),
  (d) => ({ state: d.state, seats: d.seats, joined: d.joined, date: dateParse(d.accession) })
)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["eu.csv", {url: "https://static.observableusercontent.com/files/3a73b9191b2db3d5b774669e9b38decce6b300bde1b7315c5d36b67d8351af5db69d0d1e3e460a02e3790f33968ac3953323663d5d2b4af346cb97f483a49602", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","members"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("eu")).define("eu", ["FileAttachment"], _eu);
  main.variable(observer("dates")).define("dates", ["eu"], _dates);
  main.variable(observer("dateParse")).define("dateParse", ["d3"], _dateParse);
  main.variable(observer("members")).define("members", ["aq","eu","dates","dateParse"], _members);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ribbon-chart"] = { code: "Plot.plot({\n  y: {\n    grid: true,\n    label: \"↑ Annual revenue (billions, adj.)\",\n    transform: (d) => d / 1000 // convert millions to billions\n  },\n  marks: [\n    Plot.areaY(riaa, {x: \"year\", y: \"revenue\", z: \"format\", fill: \"group\", order: \"value\"}),\n    Plot.ruleY([0])\n  ]\n})\n\nriaa = FileAttachment(\"riaa-us-revenue.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Ribbon chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Ribbon chart

Ordering [stacks](https://observablehq.com/plot/transforms/stack) by *value* results in criss-crossing ribbons with the largest value on top. (Use **reverse** to put the smallest values on top.)`
)}

function _2(Plot,riaa){return(
Plot.plot({
  y: {
    grid: true,
    label: "↑ Annual revenue (billions, adj.)",
    transform: (d) => d / 1000 // convert millions to billions
  },
  marks: [
    Plot.areaY(riaa, {x: "year", y: "revenue", z: "format", fill: "group", order: "value"}),
    Plot.ruleY([0])
  ]
})
)}

function _riaa(FileAttachment){return(
FileAttachment("riaa-us-revenue.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["riaa-us-revenue.csv", {url: "https://static.observableusercontent.com/files/b676cd78ee900057bd3ea44667c502ee70d3719add31dd64ba3688b51fae8399521c44e1e4b8d0e8462cff5613bd879677b7302153319ccf8856c7082a61d1d8", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","riaa"], _2);
  main.variable(observer("riaa")).define("riaa", ["FileAttachment"], _riaa);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-job-vacancies"] = { code: "Plot.plot({\n  width,\n  y: { label: \"↑ Job vacancies, seasonally adj. (thousands)\", grid: true },\n  marks: [\n    Plot.areaY(vacancies, {\n      x: \"month\",\n      y: \"vacancies\",\n      curve: \"step-before\",\n      interval: \"quarter\",\n      fill: \"pink\"\n    }),\n    Plot.lineY(vacancies, {\n      x: \"month\",\n      y: \"vacancies\",\n      curve: \"step-before\",\n      interval: \"quarter\"\n    }),\n    Plot.ruleY([0])\n  ]\n})\n\nvacancies = FileAttachment(\"vacancies.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Job vacancies</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Job vacancies

This area chart uses an [interval](https://observablehq.com/plot/transforms/interval) transform to avoid interpolation for the values missing in the original dataset. Data: [Australian Bureau of Statistics](https://www.abs.gov.au/statistics/labour/jobs/job-vacancies-australia/may-2022), 30 June 2022.`
)}

function _2(Plot,width,vacancies){return(
Plot.plot({
  width,
  y: { label: "↑ Job vacancies, seasonally adj. (thousands)", grid: true },
  marks: [
    Plot.areaY(vacancies, {
      x: "month",
      y: "vacancies",
      curve: "step-before",
      interval: "quarter",
      fill: "pink"
    }),
    Plot.lineY(vacancies, {
      x: "month",
      y: "vacancies",
      curve: "step-before",
      interval: "quarter"
    }),
    Plot.ruleY([0])
  ]
})
)}

function _vacancies(FileAttachment){return(
FileAttachment("vacancies.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["vacancies.csv", {url: "https://static.observableusercontent.com/files/8f0b9f1c91c6eaba248587a6c51c2bff46020a8996148ea1a7ca28ecbf402d834633cb264fe9b937106193233fce1e27eadb1cd506bd557a2e9e76cab9b46110", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","vacancies"], _2);
  main.variable(observer("vacancies")).define("vacancies", ["FileAttachment"], _vacancies);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-proportion-plot"] = { code: "raw = Inputs.textarea({\n  rows: 5,\n  value: `age,population,wealth\n16-34’s,30,3\n35-54’s,33,32\n55-74’s,28,52\nOver 75’s,9,13`,\n})\n\nwide = d3.csvParse(raw, d3.autoType)\n\ncolumns = wide.columns.slice(1)\n\ndata = columns.flatMap((type) => wide.map((d) => ({ age: d.age, type, value: d[type] })))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Proportion plot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Proportion plot

Pioneered by [Stephanie Evergreen](https://stephanieevergreen.com/proportion-plots/), proportion plots are useful to highlight differences between the share of a population across two metrics. Here we follow Richard Speigal’s “[Who owns Britain?](https://www.linkedin.com/feed/update/urn:li:activity:6758306750174138368/)” chart, highlighting age class inequalities in Britain. Data: U.K. Office for National Statistics.`
)}

function _2(Plot,columns,data)
{
  const stack = (options) => Plot.stackY({}, { x: "type", y: "value", z: "age", ...options });
  return Plot.plot({
    x: {
      domain: columns,
      axis: "top",
      label: null,
      tickFormat: (d) => `Share of ${d}`,
      tickSize: 0,
      padding: 0 // see margins
    },
    y: {
      axis: null,
      reverse: true
    },
    color: {
      scheme: "prgn",
      reverse: true
    },
    marginLeft: 50,
    marginRight: 60,
    marks: [
      Plot.areaY(
        data,
        stack({
          curve: "bump-x",
          fill: "age",
          stroke: "white"
        })
      ),
      Plot.text(
        data,
        stack({
          filter: (d) => d.type === "population",
          text: (d) => `${d.value}%`,
          textAnchor: "end",
          dx: -6
        })
      ),
      Plot.text(
        data,
        stack({
          filter: (d) => d.type === "wealth",
          text: (d) => `${d.value}%`,
          textAnchor: "start",
          dx: +6
        })
      ),
      Plot.text(
        data,
        stack({
          filter: (d) => d.type === "population",
          text: "age",
          textAnchor: "start",
          fill: "white",
          fontWeight: "bold",
          dx: +8
        })
      )
    ]
  });
}


function _3(md){return(
md`The dataset is a tiny CSV—paste your own!`
)}

function _raw(Inputs){return(
Inputs.textarea({
  rows: 5,
  value: `age,population,wealth
16-34’s,30,3
35-54’s,33,32
55-74’s,28,52
Over 75’s,9,13`,
})
)}

function _wide(d3,raw){return(
d3.csvParse(raw, d3.autoType)
)}

function _columns(wide){return(
wide.columns.slice(1)
)}

function _data(columns,wide){return(
columns.flatMap((type) => wide.map((d) => ({ age: d.age, type, value: d[type] })))
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","columns","data"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof raw")).define("viewof raw", ["Inputs"], _raw);
  main.variable(observer("raw")).define("raw", ["Generators", "viewof raw"], (G, _) => G.input(_));
  main.variable(observer("wide")).define("wide", ["d3","raw"], _wide);
  main.variable(observer("columns")).define("columns", ["wide"], _columns);
  main.variable(observer("data")).define("data", ["columns","wide"], _data);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-overlapping-density-estimations"] = { code: "Plot.plot({\n  height: 300,\n  marginLeft: 60,\n  y: { axis: null },\n  x: { nice: true },\n  fy: { domain: [\"FEMALE\", \"MALE\"] }, // excludes N/A\n  color: { legend: true },\n  facet: { data: penguins, y: \"sex\" },\n  marks: [\n    Plot.areaY(\n      penguins,\n      Plot.binX(\n        { y2: \"proportion\" }, // using y2 to avoid areaY’s implicit stacking\n        {\n          x: \"culmen_length_mm\",\n          fill: \"species\",\n          fillOpacity: 0.1,\n          thresholds: 10,\n          curve: \"natural\"\n        }\n      )\n    ),\n    Plot.ruleY([0]),\n    Plot.lineY(\n      penguins,\n      Plot.binX(\n        { y: \"proportion\" },\n        {\n          x: \"culmen_length_mm\",\n          stroke: \"species\",\n          thresholds: 10,\n          curve: \"natural\"\n        }\n      )\n    )\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Overlapping density estimations</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Overlapping density estimations

This chart [bins](https://observablehq.com/plot/transforms/bin) the data to estimate their density. If you are interested in a better evaluation of density, please upvote issue
[#1469](https://github.com/observablehq/plot/issues/1469).
`
)}

function _2(Plot,penguins){return(
Plot.plot({
  height: 300,
  marginLeft: 60,
  y: { axis: null },
  x: { nice: true },
  fy: { domain: ["FEMALE", "MALE"] }, // excludes N/A
  color: { legend: true },
  facet: { data: penguins, y: "sex" },
  marks: [
    Plot.areaY(
      penguins,
      Plot.binX(
        { y2: "proportion" }, // using y2 to avoid areaY’s implicit stacking
        {
          x: "culmen_length_mm",
          fill: "species",
          fillOpacity: 0.1,
          thresholds: 10,
          curve: "natural"
        }
      )
    ),
    Plot.ruleY([0]),
    Plot.lineY(
      penguins,
      Plot.binX(
        { y: "proportion" },
        {
          x: "culmen_length_mm",
          stroke: "species",
          thresholds: 10,
          curve: "natural"
        }
      )
    )
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-density-estimation"] = { code: "Plot.plot({\n  y: {grid: true},\n  marks: [\n    Plot.areaY(olympians, Plot.binX({y: \"count\", filter: null}, {x: \"weight\", fillOpacity: 0.2})),\n    Plot.lineY(olympians, Plot.binX({y: \"count\", filter: null}, {x: \"weight\"})),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Continuous histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Continuous histogram

This approximates a density estimation by [binning](https://observablehq.com/plot/transforms/bin) the data. If you are interested in a better evaluation of density, please upvote issue
[#1469](https://github.com/observablehq/plot/issues/1469).`
)}

function _2(Plot,olympians){return(
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.areaY(olympians, Plot.binX({y: "count", filter: null}, {x: "weight", fillOpacity: 0.2})),
    Plot.lineY(olympians, Plot.binX({y: "count", filter: null}, {x: "weight"})),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-variable-fill-area"] = { code: "Plot.plot({\n  color: {\n    type: \"log\",\n    legend: true\n  },\n  marks: [\n    Plot.areaY(aapl, {x: \"Date\", y: \"Close\", fill: \"Volume\", z: null}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Variable fill area</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Variable fill area

Set the **z** option to null for [area](https://observablehq.com/plot/marks/area) (or [line](https://observablehq.com/@observablehq/plot-window-and-map)) charts that represent a single series of data with a varying color.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  color: {
    type: "log",
    legend: true
  },
  marks: [
    Plot.areaY(aapl, {x: "Date", y: "Close", fill: "Volume", z: null}),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-facet-wrap"] = { code: "Plot.plot((() => {\n  const n = 3; // number of facet columns\n  const keys = Array.from(d3.union(industries.map((d) => d.industry)));\n  const index = new Map(keys.map((key, i) => [key, i]));\n  const fx = (key) => index.get(key) % n;\n  const fy = (key) => Math.floor(index.get(key) / n);\n  return {\n    height: 300,\n    axis: null,\n    y: {insetTop: 10},\n    fx: {padding: 0.03},\n    marks: [\n      Plot.areaY(industries, Plot.normalizeY(\"extent\", {\n        x: \"date\",\n        y: \"unemployed\",\n        fx: (d) => fx(d.industry),\n        fy: (d) => fy(d.industry)\n      })),\n      Plot.text(keys, {fx, fy, frameAnchor: \"top-left\", dx: 6, dy: 6}),\n      Plot.frame()\n    ]\n  };\n})())", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Facet wrap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Facet wrap

Wrapping facets in two dimensions is possible by explicitly specifying the grid. Set **fy** to the (integer) division of the index by the number of columns, and **fx** to the rest of that division. If you are interested in making this easier, please upvote issue [#277](https://github.com/observablehq/plot/issues/277).`
)}

function _2(Plot,d3,industries){return(
Plot.plot((() => {
  const n = 3; // number of facet columns
  const keys = Array.from(d3.union(industries.map((d) => d.industry)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);
  return {
    height: 300,
    axis: null,
    y: {insetTop: 10},
    fx: {padding: 0.03},
    marks: [
      Plot.areaY(industries, Plot.normalizeY("extent", {
        x: "date",
        y: "unemployed",
        fx: (d) => fx(d.industry),
        fy: (d) => fy(d.industry)
      })),
      Plot.text(keys, {fx, fy, frameAnchor: "top-left", dx: 6, dy: 6}),
      Plot.frame()
    ]
  };
})())
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","industries"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-line-chart-with-markers"] = { code: "Plot.plot({\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(crimea, {x: \"date\", y: \"deaths\", stroke: \"cause\", marker: true})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Line chart with markers</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Line chart with markers

Use [markers](https://observablehq.com/plot/features/markers) to indicate the data points that are interpolated by the [line](https://observablehq.com/plot/marks/line) mark.`
)}

function _2(Plot,crimea){return(
Plot.plot({
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(crimea, {x: "date", y: "deaths", stroke: "cause", marker: true})
  ]
})
)}

async function _crimea(FileAttachment)
{
  const data = await FileAttachment("crimean-war.csv").csv({typed: true});
  return data.columns.slice(2).flatMap((cause) => data.map(({date, [cause]: deaths}) => ({date, cause, deaths}))); // pivot taller
}


function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["crimean-war.csv", {url: "https://static.observableusercontent.com/files/ca429fb9d06a65bfd4f163364080fa45b685f8838f9ed0a0134ed7f2985aea3e6f553a18822528dff50cb0d1e2d91c4cc26a88e5d9a0625e5c41cd9121da3986", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","crimea"], _2);
  main.variable(observer("crimea")).define("crimea", ["FileAttachment"], _crimea);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-non-temporal-line-chart"] = { code: "Plot.plot({\n  x: {\n    label: \"Distance from stage start (km) →\"\n  },\n  y: {\n    label: \"↑ Elevation (m)\",\n    grid: true\n  },\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(tdf, {x: \"distance\", y: \"elevation\"})\n  ]\n})\n\ntdf = FileAttachment(\"tdf-stage-8-2017.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Non-temporal line chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Non-temporal line chart

In this [line](https://observablehq.com/plot/marks/line) chart drawing the elevation profile of a Tour de France stage, the *x* scale represents distance, not time.`
)}

function _2(Plot,tdf){return(
Plot.plot({
  x: {
    label: "Distance from stage start (km) →"
  },
  y: {
    label: "↑ Elevation (m)",
    grid: true
  },
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(tdf, {x: "distance", y: "elevation"})
  ]
})
)}

function _tdf(FileAttachment){return(
FileAttachment("tdf-stage-8-2017.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["tdf-stage-8-2017.csv", {url: "https://static.observableusercontent.com/files/48e833deefb41ad0ee75baa0f970b963596c5f63a9347bcd4926c4b484fd79f34513af58c1ef8f287677cb8c00ad0b65af16d20dc4a18c56e47b9ced0612c2cb", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","tdf"], _2);
  main.variable(observer("tdf")).define("tdf", ["FileAttachment"], _tdf);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-connected-scatterplot"] = { code: "Plot.plot({\n  inset: 10,\n  grid: true,\n  x: {label: \"Miles driven (per person-year) →\"},\n  y: {label: \"↑ Cost of gasoline ($ per gallon)\"},\n  marks: [\n    Plot.line(driving, {x: \"miles\", y: \"gas\", curve: \"catmull-rom\", marker: true}),\n    Plot.text(driving, {filter: (d) => d.year % 5 === 0, x: \"miles\", y: \"gas\", text: (d) => `${d.year}`, dy: -8})\n  ]\n})\n\ndriving = FileAttachment(\"driving.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Connected scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Connected scatterplot

There is no requirement that **y** be dependent on **x**; [lines](https://observablehq.com/plot/marks/line) can be used in connected scatterplots to show two independent (but often correlated) variables. The chart below recreates Hannah Fairfield’s [“Driving Shifts Into Reverse”](http://www.nytimes.com/imagepages/2010/05/02/business/02metrics.html) from 2009.`
)}

function _2(Plot,driving){return(
Plot.plot({
  inset: 10,
  grid: true,
  x: {label: "Miles driven (per person-year) →"},
  y: {label: "↑ Cost of gasoline ($ per gallon)"},
  marks: [
    Plot.line(driving, {x: "miles", y: "gas", curve: "catmull-rom", marker: true}),
    Plot.text(driving, {filter: (d) => d.year % 5 === 0, x: "miles", y: "gas", text: (d) => `${d.year}`, dy: -8})
  ]
})
)}

function _driving(FileAttachment){return(
FileAttachment("driving.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["driving.csv", {url: "https://static.observableusercontent.com/files/f41c1a1f4d1361c3738d427f1bbdbfaa9e5c651f8bec0902b876bda70ed1801a5aa8f487f53b2cd9bfa94fc40b874e54f4659e58d88044cdde1919cd5eebe8ac", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","driving"], _2);
  main.variable(observer("driving")).define("driving", ["FileAttachment"], _driving);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-window-and-map"] = { code: "Plot.plot({\n  y: {grid: true},\n  color: {scheme: \"BuYlRd\", domain: [-0.5, 0.5]},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(\n      bls,\n      Plot.map(\n        {stroke: Plot.window({k: 2, reduce: \"difference\"})},\n        {x: \"date\", y: \"unemployment\", z: \"division\", stroke: \"unemployment\"}\n      )\n    )\n  ]\n})\n\nbls = FileAttachment(\"bls-metro-unemployment.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Difference stroke</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Difference stroke

Set the **z** option to null for [line](https://observablehq.com/plot/marks/line) (or [area](https://observablehq.com/@observablehq/plot-variable-fill-area)) charts that represent a single series of data with a varying color. Here a [window](https://observablehq.com/plot/transforms/window) transform with a *difference* reducer is applied to the data and informs the stroke channel.`
)}

function _2(Plot,bls){return(
Plot.plot({
  y: {grid: true},
  color: {scheme: "BuYlRd", domain: [-0.5, 0.5]},
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(
      bls,
      Plot.map(
        {stroke: Plot.window({k: 2, reduce: "difference"})},
        {x: "date", y: "unemployment", z: "division", stroke: "unemployment"}
      )
    )
  ]
})
)}

function _bls(FileAttachment){return(
FileAttachment("bls-metro-unemployment.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["bls-metro-unemployment.csv", {url: "https://static.observableusercontent.com/files/cf77aaa2e0dab4123d57f8421210e5fa6955d75017369c93e3086b7369e4a040e398ed494b71d541a9c0c72575ac29cdc9e7038b6ae681cc1d761fec2c99a85f", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","bls"], _2);
  main.variable(observer("bls")).define("bls", ["FileAttachment"], _bls);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-spherical-line-with-a-varying-stroke"] = { code: "Plot.plot({\n  projection: \"equirectangular\",\n  marks: [\n    Plot.geo(land),\n    Plot.line(beagle, {stroke: (d, i) => i, z: null})\n  ]\n})\n\nbeagle = FileAttachment(\"beagle.csv\").csv({array: true, typed: true})\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Spherical line with a varying stroke</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Spherical line with a varying stroke

Set the **z** option to null for [line](https://observablehq.com/plot/marks/line) charts that represent a single series of data with a varying color. This also works with the geodesic [curve](https://observablehq.com/plot/features/curves) used for map [projections](https://observablehq.com/plot/features/projections)!`
)}

function _2(Plot,land,beagle){return(
Plot.plot({
  projection: "equirectangular",
  marks: [
    Plot.geo(land),
    Plot.line(beagle, {stroke: (d, i) => i, z: null})
  ]
})
)}

function _beagle(FileAttachment){return(
FileAttachment("beagle.csv").csv({array: true, typed: true})
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}],
    ["beagle.csv", {url: "https://static.observableusercontent.com/files/695c30f38a07164d21430545762f4096966235534677d72d6f596045c52ecd1f3c9f9cf7ec8620d7aed13f04b291a03266c07d131a96ef54376efd5f89ea7a2e", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","land","beagle"], _2);
  main.variable(observer("beagle")).define("beagle", ["FileAttachment"], _beagle);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-area-chart-missing-data"] = { code: "Plot.plot({\n  y: {grid: true, label: \"Daily close ($)\"},\n  marks: [\n    Plot.areaY(aaplMissing, {filter: (d) => !isNaN(d.Close), x: \"Date\", y1: \"Close\", fill: \"#ccc\"}),\n    Plot.areaY(aaplMissing, {x: \"Date\", y1: \"Close\", fill: \"steelblue\"}),\n    Plot.ruleY([0]),\n  ]\n})\n\naaplMissing = aapl.map(d => ({...d, Close: d.Date.getUTCMonth() < 3 ? NaN : d.Close}))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Area chart, missing data</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Area chart, missing data

The [area mark](/plot/marks/area), in blue, shows gaps for missing data—points where the value is NaN, undefined, or Infinite. A second area, in grey, has these data points filtered out altogether, resulting instead in linear interpolation for the gaps.`
)}

function _2(Plot,aaplMissing){return(
Plot.plot({
  y: {grid: true, label: "Daily close ($)"},
  marks: [
    Plot.areaY(aaplMissing, {filter: (d) => !isNaN(d.Close), x: "Date", y1: "Close", fill: "#ccc"}),
    Plot.areaY(aaplMissing, {x: "Date", y1: "Close", fill: "steelblue"}),
    Plot.ruleY([0]),
  ]
})
)}

function _aaplMissing(aapl){return(
aapl.map(d => ({...d, Close: d.Date.getUTCMonth() < 3 ? NaN : d.Close}))
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aaplMissing"], _2);
  main.variable(observer("aaplMissing")).define("aaplMissing", ["aapl"], _aaplMissing);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-radar-chart"] = { code: "Plot.plot({\n  width: 450,\n  projection: {\n    type: \"azimuthal-equidistant\",\n    rotate: [0, -90],\n    // Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels\n    domain: d3.geoCircle().center([0, 90]).radius(0.625)()\n  },\n  color: { legend: true },\n  marks: [\n    // grey discs\n    Plot.geo([0.5, 0.4, 0.3, 0.2, 0.1], {\n      geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),\n      stroke: \"black\",\n      fill: \"black\",\n      strokeOpacity: 0.3,\n      fillOpacity: 0.03,\n      strokeWidth: 0.5\n    }),\n\n    // white axes\n    Plot.link(longitude.domain(), {\n      x1: longitude,\n      y1: 90 - 0.57,\n      x2: 0,\n      y2: 90,\n      stroke: \"white\",\n      strokeOpacity: 0.5,\n      strokeWidth: 2.5\n    }),\n\n    // tick labels\n    Plot.text([0.3, 0.4, 0.5], {\n      x: 180,\n      y: (d) => 90 - d,\n      dx: 2,\n      textAnchor: \"start\",\n      text: (d) => `${100 * d}%`,\n      fill: \"currentColor\",\n      stroke: \"white\",\n      fontSize: 8\n    }),\n\n    // axes labels\n    Plot.text(longitude.domain(), {\n      x: longitude,\n      y: 90 - 0.57,\n      text: Plot.identity,\n      lineWidth: 5\n    }),\n\n    // areas\n    Plot.area(points, {\n      x1: ({ key }) => longitude(key),\n      y1: ({ value }) => 90 - value,\n      x2: 0,\n      y2: 90,\n      fill: \"name\",\n      stroke: \"name\",\n      curve: \"cardinal-closed\"\n    }),\n\n    // points\n    Plot.dot(points, {\n      x: ({ key }) => longitude(key),\n      y: ({ value }) => 90 - value,\n      fill: \"name\",\n      stroke: \"white\"\n    }),\n\n    // interactive labels\n    Plot.text(\n      points,\n      Plot.pointer({\n        x: ({ key }) => longitude(key),\n        y: ({ value }) => 90 - value,\n        text: (d) => `${(100 * d.value).toFixed(0)}%`,\n        textAnchor: \"start\",\n        dx: 4,\n        fill: \"currentColor\",\n        stroke: \"white\",\n        maxRadius: 10\n      })\n    ),\n\n    // interactive opacity on the areas\n    () =>\n      svg`<style>\n          g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}\n          g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}\n          g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}\n      `\n  ]\n})\n\nphones = FileAttachment(\"phones.csv\").csv({typed: true})\n\npoints = phones.flatMap(({ name, ...values }) =>\n  Object.entries(values).map(([key, value]) => ({ name, key, value }))\n)\n\nlongitude = d3.scalePoint(new Set(Plot.valueof(points, \"key\")), [180, -180]).padding(0.5).align(1)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Radar chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Radar chart

We create a polar coordinate system with an azimuthal equidistant [projection](https://observablehq.com/plot/features/projections) centered on the North Pole. A point is encoded with its angle as longitude: *x* = *angle*; and its length as colatitude: *y* = 90&thinsp;&minus;&thinsp;*length*.

Note that overlapping areas make it difficult to compare, say, more than three objects. Instead, we suggest [radar charts as small multiples](https://observablehq.com/@observablehq/plot-radar-chart-faceted).

_Design inspiration: Nadieh Bremer, “[A different look for the d3.js radar chart](https://www.visualcinnamon.com/2015/10/different-look-d3-radar-chart/),” 2015._`
)}

function _2(Plot,d3,longitude,points,svg){return(
Plot.plot({
  width: 450,
  projection: {
    type: "azimuthal-equidistant",
    rotate: [0, -90],
    // Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
    domain: d3.geoCircle().center([0, 90]).radius(0.625)()
  },
  color: { legend: true },
  marks: [
    // grey discs
    Plot.geo([0.5, 0.4, 0.3, 0.2, 0.1], {
      geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
      stroke: "black",
      fill: "black",
      strokeOpacity: 0.3,
      fillOpacity: 0.03,
      strokeWidth: 0.5
    }),

    // white axes
    Plot.link(longitude.domain(), {
      x1: longitude,
      y1: 90 - 0.57,
      x2: 0,
      y2: 90,
      stroke: "white",
      strokeOpacity: 0.5,
      strokeWidth: 2.5
    }),

    // tick labels
    Plot.text([0.3, 0.4, 0.5], {
      x: 180,
      y: (d) => 90 - d,
      dx: 2,
      textAnchor: "start",
      text: (d) => `${100 * d}%`,
      fill: "currentColor",
      stroke: "white",
      fontSize: 8
    }),

    // axes labels
    Plot.text(longitude.domain(), {
      x: longitude,
      y: 90 - 0.57,
      text: Plot.identity,
      lineWidth: 5
    }),

    // areas
    Plot.area(points, {
      x1: ({ key }) => longitude(key),
      y1: ({ value }) => 90 - value,
      x2: 0,
      y2: 90,
      fill: "name",
      stroke: "name",
      curve: "cardinal-closed"
    }),

    // points
    Plot.dot(points, {
      x: ({ key }) => longitude(key),
      y: ({ value }) => 90 - value,
      fill: "name",
      stroke: "white"
    }),

    // interactive labels
    Plot.text(
      points,
      Plot.pointer({
        x: ({ key }) => longitude(key),
        y: ({ value }) => 90 - value,
        text: (d) => `${(100 * d.value).toFixed(0)}%`,
        textAnchor: "start",
        dx: 4,
        fill: "currentColor",
        stroke: "white",
        maxRadius: 10
      })
    ),

    // interactive opacity on the areas
    () =>
      svg`<style>
          g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
          g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
          g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
      `
  ]
})
)}

function _phones(FileAttachment){return(
FileAttachment("phones.csv").csv({typed: true})
)}

function _4(md){return(
md`Flatten the data into as many points as there are dimensions:`
)}

function _points(phones){return(
phones.flatMap(({ name, ...values }) =>
  Object.entries(values).map(([key, value]) => ({ name, key, value }))
)
)}

function _6(md){return(
md`This intermediate point scale distributes the data axes onto longitudes, starting at 180 and winding back to one step before &minus;180. This task would be unnecessary if we had a native polar coordinate system, please vote up issue [#133](https://github.com/observablehq/plot/issues/133).`
)}

function _longitude(d3,Plot,points){return(
d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["phones.csv", {url: "https://static.observableusercontent.com/files/9ad973471837317050fcd77e09acc8249831ef7214ebc8dff8efd91fa8a50a801ff28979b30a0c27090656670cf7602e84c066452b0c5b17879fa117e1d9dae1", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","longitude","points","svg"], _2);
  main.variable(observer("phones")).define("phones", ["FileAttachment"], _phones);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("points")).define("points", ["phones"], _points);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("longitude")).define("longitude", ["d3","Plot","points"], _longitude);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-radar-chart-faceted"] = { code: "Plot.plot({\n  width: Math.max(width, 600),\n  marginBottom: 10,\n  projection: {\n    type: \"azimuthal-equidistant\",\n    rotate: [0, -90],\n    // Note: 1.22° corresponds to max. percentage (1.0), plus some room for the labels\n    domain: d3.geoCircle().center([0, 90]).radius(1.22)()\n  },\n  facet: {\n    data: points,\n    x: \"fx\",\n    y: \"fy\",\n    axis: null\n  },\n  marks: [\n\n    // Facet name\n    Plot.text(points, Plot.selectFirst({text: \"name\", frameAnchor: \"bottom\", fontWeight: \"400\", fontSize: 14})),\n    \n    // grey discs\n    Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {\n      geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),\n      stroke: \"black\",\n      fill: \"black\",\n      strokeOpacity: 0.2,\n      fillOpacity: 0.02,\n      strokeWidth: 0.5\n    }),\n\n    // white axes\n    Plot.link(longitude.domain(), {\n      x1: longitude,\n      y1: 90 - 0.8,\n      x2: 0,\n      y2: 90,\n      stroke: \"white\",\n      strokeOpacity: 0.5,\n      strokeWidth: 2.5\n    }),\n\n    // tick labels\n    Plot.text([0.4, 0.6, 0.8], {\n      fx: 0, fy: 0,\n      x: 180,\n      y: (d) => 90 - d,\n      dx: 2,\n      textAnchor: \"start\",\n      text: (d) => ( d == 0.8 ? `${100 * d}th percentile` : `${100 * d}th`),\n      fill: \"currentColor\",\n      stroke: \"white\",\n      fontSize: 12\n    }),\n\n    // axes labels\n    Plot.text(longitude.domain(), {\n      fx: 0, fy: 0,\n      x: longitude,\n      y: 90 - 1.07,\n      text: Plot.identity,\n      lineWidth: 5,\n      fontSize: 12\n    }),\n\n    // axes labels, initials\n    Plot.text(longitude.domain(), {\n      fx: 0, fy: 0, facet: \"exclude\",\n      x: longitude,\n      y: 90 - 1.09,\n      text: d => d[0],\n      lineWidth: 5\n    }),\n    \n    // areas\n    Plot.area(points, {\n      x1: ({ key }) => longitude(key),\n      y1: ({ value }) => 90 - value,\n      x2: 0,\n      y2: 90,\n      fill: \"#4269D0\",\n      fillOpacity: 0.25,\n      stroke: \"#4269D0\",\n      curve: \"cardinal-closed\"\n    }),\n\n    // points\n    Plot.dot(points, {\n      x: ({ key }) => longitude(key),\n      y: ({ value }) => 90 - value,\n      fill: \"#4269D0\",\n      stroke: \"white\"\n    }),\n\n    // interactive labels\n    Plot.text(\n      points,\n      Plot.pointer({\n        x: ({ key }) => longitude(key),\n        y: ({ value }) => 90 - value,\n        text: (d) => `${d.raw}\\n(${Math.round(100 * d.value)}%)`,\n        textAnchor: \"start\",\n        dx: 4,\n        fill: \"currentColor\",\n        stroke: \"white\",\n        maxRadius: 10,\n        fontSize: 12\n      })\n    )\n  ]\n})\n\ncars = FileAttachment(\"cars.csv\").csv({typed: true})\n\nlongitude = d3.scalePoint(new Set(Plot.valueof(points, \"key\")), [180, -180]).padding(0.5).align(1)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Radar chart, small multiples</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Radar chart, small multiples

[Radar charts](/@observablehq/plot-radar-chart) are best saved for a single purpose: to spot a difference across multiple values among members of a domain. We recommend avoiding any other use of radar charts because they are easy to misinterpret. When using radar charts, show them side by side in small multiples (using [facets](https://observablehq.com/plot/features/facets)) instead of overlapping them in a single view. 

This example shows 5 values from cars sold in the United States in 1979. `
)}

function _2(Plot,width,d3,points,longitude){return(
Plot.plot({
  width: Math.max(width, 600),
  marginBottom: 10,
  projection: {
    type: "azimuthal-equidistant",
    rotate: [0, -90],
    // Note: 1.22° corresponds to max. percentage (1.0), plus some room for the labels
    domain: d3.geoCircle().center([0, 90]).radius(1.22)()
  },
  facet: {
    data: points,
    x: "fx",
    y: "fy",
    axis: null
  },
  marks: [

    // Facet name
    Plot.text(points, Plot.selectFirst({text: "name", frameAnchor: "bottom", fontWeight: "400", fontSize: 14})),
    
    // grey discs
    Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
      geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
      stroke: "black",
      fill: "black",
      strokeOpacity: 0.2,
      fillOpacity: 0.02,
      strokeWidth: 0.5
    }),

    // white axes
    Plot.link(longitude.domain(), {
      x1: longitude,
      y1: 90 - 0.8,
      x2: 0,
      y2: 90,
      stroke: "white",
      strokeOpacity: 0.5,
      strokeWidth: 2.5
    }),

    // tick labels
    Plot.text([0.4, 0.6, 0.8], {
      fx: 0, fy: 0,
      x: 180,
      y: (d) => 90 - d,
      dx: 2,
      textAnchor: "start",
      text: (d) => ( d == 0.8 ? `${100 * d}th percentile` : `${100 * d}th`),
      fill: "currentColor",
      stroke: "white",
      fontSize: 12
    }),

    // axes labels
    Plot.text(longitude.domain(), {
      fx: 0, fy: 0,
      x: longitude,
      y: 90 - 1.07,
      text: Plot.identity,
      lineWidth: 5,
      fontSize: 12
    }),

    // axes labels, initials
    Plot.text(longitude.domain(), {
      fx: 0, fy: 0, facet: "exclude",
      x: longitude,
      y: 90 - 1.09,
      text: d => d[0],
      lineWidth: 5
    }),
    
    // areas
    Plot.area(points, {
      x1: ({ key }) => longitude(key),
      y1: ({ value }) => 90 - value,
      x2: 0,
      y2: 90,
      fill: "#4269D0",
      fillOpacity: 0.25,
      stroke: "#4269D0",
      curve: "cardinal-closed"
    }),

    // points
    Plot.dot(points, {
      x: ({ key }) => longitude(key),
      y: ({ value }) => 90 - value,
      fill: "#4269D0",
      stroke: "white"
    }),

    // interactive labels
    Plot.text(
      points,
      Plot.pointer({
        x: ({ key }) => longitude(key),
        y: ({ value }) => 90 - value,
        text: (d) => `${d.raw}\n(${Math.round(100 * d.value)}%)`,
        textAnchor: "start",
        dx: 4,
        fill: "currentColor",
        stroke: "white",
        maxRadius: 10,
        fontSize: 12
      })
    )
  ]
})
)}

function _cars(FileAttachment){return(
FileAttachment("cars.csv").csv({typed: true})
)}

function _4(md){return(
md`Normalize and flatten the data into as many points as there are dimensions:`
)}

function _points(d3,cars)
{
  const points = d3.sort(cars, d => d.Price).flatMap(({ name, ...values }, i) =>
    Object.entries(values).map(([key, raw]) => ({
      name,
      key,
      raw,
      fx: (1 + i) % 4, // trellis (facets); we leave facet <0,0> empty for the legend
      fy: Math.floor((1 + i) / 4)
    }))
  );
  for (const [, g] of d3.group(points, d => d.key)) {
    const m = d3.max(g, d => d.raw);
    for (const d of g) d.value = d.raw / m;
  }
  return points;
}


function _longitude(d3,Plot,points){return(
d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["cars.csv", {url: "https://static.observableusercontent.com/files/2cc445a6cec0204a32b964d858e38000e73ad028fc7ec472739949d3f9c30c1808080e65507611b059e01bdee1b9857d7cdf57c246998ba84ffdcf94b1c74d8f", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","d3","points","longitude"], _2);
  main.variable(observer("cars")).define("cars", ["FileAttachment"], _cars);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("points")).define("points", ["d3","cars"], _points);
  main.variable(observer("longitude")).define("longitude", ["d3","Plot","points"], _longitude);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-slope-chart"] = { code: "Plot.plot({\n  height: 540,\n  x: {axis: \"top\", type: \"ordinal\", tickFormat: \"\", inset: 90, label: null},\n  y: {axis: null, inset: 20},\n  marks: [\n    Plot.line(receipts, {x: \"year\", y: \"receipts\", z: \"country\"}),\n    d3.groups(receipts, (d) => d.year === 1970)\n      .map(([left, receipts]) =>\n        Plot.text(receipts, occlusionY({\n          x: \"year\",\n          y: \"receipts\",\n          text: left\n            ? (d) => `${d.country} ${d.receipts}`\n            : (d) => `${d.receipts} ${d.country}`,\n          textAnchor: left ? \"end\" : \"start\",\n          dx: left ? -3 : 3,\n          radius: 5.5\n        }))\n      )\n  ],\n  caption: \"Current receipts of government as a percentage of gross domestic product\"\n})\n\nocclusionY = ({radius = 6.5, ...options} = {}) => Plot.initializer(options, (data, facets, { y: {value: Y}, text: {value: T} }, {y: sy}, dimensions, context) => {\n  for (const index of facets) {\n    const unique = new Set();\n    const nodes = Array.from(index, (i) => ({\n      fx: 0,\n      y: sy(Y[i]),\n      visible: unique.has(T[i]) // remove duplicate labels\n        ? false\n        : !!unique.add(T[i]),\n      i\n    }));\n    d3.forceSimulation(nodes.filter((d) => d.visible))\n      .force(\"y\", d3.forceY(({y}) => y)) // gravitate towards the original y\n      .force(\"collide\", d3.forceCollide().radius(radius)) // collide\n      .stop()\n      .tick(20);\n    for (const { y, node, i, visible } of nodes) Y[i] = !visible ? NaN : y;\n  }\n  return {data, facets, channels: {y: {value: Y}}};\n})\n\nreceipts = FileAttachment(\"gdp-receipts.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Slope chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Slope chart

Also known as a *slopegraph*, this chart shows change between two (or a few) discrete points in time. A tiny [force simulation](https://d3js.org/d3-force) avoids label overlap. The values here are government receipts as a percentage of GDP. Based on [Tufte](https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0003nk).`
)}

function _2(Plot,receipts,d3,occlusionY){return(
Plot.plot({
  height: 540,
  x: {axis: "top", type: "ordinal", tickFormat: "", inset: 90, label: null},
  y: {axis: null, inset: 20},
  marks: [
    Plot.line(receipts, {x: "year", y: "receipts", z: "country"}),
    d3.groups(receipts, (d) => d.year === 1970)
      .map(([left, receipts]) =>
        Plot.text(receipts, occlusionY({
          x: "year",
          y: "receipts",
          text: left
            ? (d) => `${d.country} ${d.receipts}`
            : (d) => `${d.receipts} ${d.country}`,
          textAnchor: left ? "end" : "start",
          dx: left ? -3 : 3,
          radius: 5.5
        }))
      )
  ],
  caption: "Current receipts of government as a percentage of gross domestic product"
})
)}

function _occlusionY(Plot,d3){return(
({radius = 6.5, ...options} = {}) => Plot.initializer(options, (data, facets, { y: {value: Y}, text: {value: T} }, {y: sy}, dimensions, context) => {
  for (const index of facets) {
    const unique = new Set();
    const nodes = Array.from(index, (i) => ({
      fx: 0,
      y: sy(Y[i]),
      visible: unique.has(T[i]) // remove duplicate labels
        ? false
        : !!unique.add(T[i]),
      i
    }));
    d3.forceSimulation(nodes.filter((d) => d.visible))
      .force("y", d3.forceY(({y}) => y)) // gravitate towards the original y
      .force("collide", d3.forceCollide().radius(radius)) // collide
      .stop()
      .tick(20);
    for (const { y, node, i, visible } of nodes) Y[i] = !visible ? NaN : y;
  }
  return {data, facets, channels: {y: {value: Y}}};
})
)}

function _receipts(FileAttachment){return(
FileAttachment("gdp-receipts.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["gdp-receipts.csv", {url: "https://static.observableusercontent.com/files/b9b37403f090d9991a20b79f20e6cbcabc99f25121379c00861f4b28d08a74451a64f252cad9307180bf76a71b76bbc8e48c32197851346034366b146f434b1b", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","receipts","d3","occlusionY"], _2);
  main.variable(observer("occlusionY")).define("occlusionY", ["Plot","d3"], _occlusionY);
  main.variable(observer("receipts")).define("receipts", ["FileAttachment"], _receipts);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-cancer-survival-rates"] = { code: "Plot.plot({\n  width: 800,\n  height: 700,\n  x: {\n    axis: \"top\",\n    type: \"point\",\n    domain: [\"5 Year\", \"10 Year\", \"15 Year\", \"20 Year\"],\n    inset: 60,\n    label: null\n  },\n  y: { axis: null, inset: 20 },\n  marks: [\n    Plot.line(cancer, { x: \"year\", y: \"survival\", z: \"name\" }),\n    d3\n      .groups(cancer, (d) => d.year)\n      .map(([year, cancer]) =>\n        Plot.text(\n          cancer,\n          occlusionY({\n            x: \"year\",\n            y: \"survival\",\n            text:\n              year === \"5 Year\"\n                ? (d) => `${d.name} ${d.survival}`\n                : year === \"20 Year\"\n                ? (d) => `${d.survival} ${d.name}`\n                : \"survival\",\n            textAnchor:\n              year === \"5 Year\"\n                ? \"end\"\n                : year === \"20 Year\"\n                ? \"start\"\n                : \"middle\",\n            fill: \"currentColor\",\n            stroke: \"white\",\n            strokeWidth: 5,\n            dx: year === \"5 Year\" ? -3 : year === \"20 Year\" ? 3 : 0\n          })\n        )\n      )\n  ]\n})\n\nocclusionY = ({radius = 6.5, ...options} = {}) => Plot.initializer(options, (data, facets, { y: {value: Y}, text: {value: T} }, {y: sy}, dimensions, context) => {\n  for (const index of facets) {\n    const unique = new Set();\n    const nodes = Array.from(index, (i) => ({\n      fx: 0,\n      y: sy(Y[i]),\n      visible: unique.has(T[i]) // remove duplicate labels\n        ? false\n        : !!unique.add(T[i]),\n      i\n    }));\n    d3.forceSimulation(nodes.filter((d) => d.visible))\n      .force(\"y\", d3.forceY(({y}) => y)) // gravitate towards the original y\n      .force(\"collide\", d3.forceCollide().radius(radius)) // collide\n      .stop()\n      .tick(20);\n    for (const { y, node, i, visible } of nodes) Y[i] = !visible ? NaN : y;\n  }\n  return {data, facets, channels: {y: {value: Y}}};\n})\n\ncancer = FileAttachment(\"cancer.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Cancer survival rates</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Cancer survival rates

A [slope chart](/@observablehq/plot-slope-chart) with intermediate values. The values here are survival rate (in percents) for various cancers. Based on [Tufte](https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0003nk).`
)}

function _2(Plot,cancer,d3,occlusionY){return(
Plot.plot({
  width: 800,
  height: 700,
  x: {
    axis: "top",
    type: "point",
    domain: ["5 Year", "10 Year", "15 Year", "20 Year"],
    inset: 60,
    label: null
  },
  y: { axis: null, inset: 20 },
  marks: [
    Plot.line(cancer, { x: "year", y: "survival", z: "name" }),
    d3
      .groups(cancer, (d) => d.year)
      .map(([year, cancer]) =>
        Plot.text(
          cancer,
          occlusionY({
            x: "year",
            y: "survival",
            text:
              year === "5 Year"
                ? (d) => `${d.name} ${d.survival}`
                : year === "20 Year"
                ? (d) => `${d.survival} ${d.name}`
                : "survival",
            textAnchor:
              year === "5 Year"
                ? "end"
                : year === "20 Year"
                ? "start"
                : "middle",
            fill: "currentColor",
            stroke: "white",
            strokeWidth: 5,
            dx: year === "5 Year" ? -3 : year === "20 Year" ? 3 : 0
          })
        )
      )
  ]
})
)}

function _occlusionY(Plot,d3){return(
({radius = 6.5, ...options} = {}) => Plot.initializer(options, (data, facets, { y: {value: Y}, text: {value: T} }, {y: sy}, dimensions, context) => {
  for (const index of facets) {
    const unique = new Set();
    const nodes = Array.from(index, (i) => ({
      fx: 0,
      y: sy(Y[i]),
      visible: unique.has(T[i]) // remove duplicate labels
        ? false
        : !!unique.add(T[i]),
      i
    }));
    d3.forceSimulation(nodes.filter((d) => d.visible))
      .force("y", d3.forceY(({y}) => y)) // gravitate towards the original y
      .force("collide", d3.forceCollide().radius(radius)) // collide
      .stop()
      .tick(20);
    for (const { y, node, i, visible } of nodes) Y[i] = !visible ? NaN : y;
  }
  return {data, facets, channels: {y: {value: Y}}};
})
)}

function _cancer(FileAttachment){return(
FileAttachment("cancer.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["cancer.csv", {url: "https://static.observableusercontent.com/files/1c6f2555b7003922dee6a1c927ac88998a03863e9a37193349d660dfa5509757814fdd6f0a9aab0816d59e76c0434bb0c9639a1f6281014d5dde3d5e52bb7204", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","cancer","d3","occlusionY"], _2);
  main.variable(observer("occlusionY")).define("occlusionY", ["Plot","d3"], _occlusionY);
  main.variable(observer("cancer")).define("cancer", ["FileAttachment"], _cancer);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-mareys-trains"] = { code: "schedule = Inputs.radio([\"weekday\", \"weekend\"], {label: \"Schedule\", value: \"weekday\"})\n\nplot = Plot.plot({\n  inset: 10,\n  margin: 10,\n  marginLeft: 40,\n  marginTop: 100,\n  grid: true,\n  width: 1152,\n  height: 1800,\n  x: {\n    axis: null // hide arbitrary distance units\n  },\n  y: {\n    label: null,\n    ticks: d3.range(3, 24).map(h => h * 60),\n    tickFormat: asTime,\n    transform: asMinutes,\n    reverse: true\n  },\n  color: {\n    legend: true,\n    domain: [\"normal\", \"limited\", \"bullet\"],\n    range: [\"rgb(34, 34, 34)\", \"rgb(183, 116, 9)\", \"rgb(192, 62, 29)\"]\n  },\n  marks: [\n    Plot.ruleX(trains, Plot.groupX({}, {x: \"distance\", strokeOpacity: 0.1, strokeDasharray: 2})),\n    Plot.text(trains, Plot.groupX({text: \"first\", y: () => \"4:30am\"}, {x: \"distance\", text: \"station\", rotate: -90, frameAnchor: \"left\", dy: -12})),\n    Plot.line(trains, {filter: d => d.schedule === schedule, x: \"distance\", y: \"time\", z: \"train\", stroke: \"speed\", marker: \"circle\", title: (d) => `${d.train}${d.direction}\\n${d.station}\\n${d.time}`, tip: true})\n  ]\n})\n\nasTime = function asTime(minutes) {\n  return formatTime(d3.utcMinute.offset(d3.utcDay(), minutes - minutesOffset));\n}\n\nasMinutes = function asMinutes(time) {\n  if (!(time = parseTime(time))) return;\n  const minutes = time.getUTCHours() * 60 + time.getUTCMinutes();\n  return (minutes + minutesOffset + 60 * 24) % (24 * 60);\n}\n\nminutesOffset = -60 * 2\n\nparseTime = d3.utcParse(\"%I:%M%p\")\n\nformatTime = d3.utcFormat(\"%-I %p\")\n\ntrains = FileAttachment(\"caltrain.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(plot,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Marey’s trains</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Marey’s trains

A recreation of [E.J. Marey](https://en.wikipedia.org/wiki/Étienne-Jules_Marey)’s graphical train schedule. Stations are positioned to scale so that slope encodes speed. This display also reveals when and where <b style="color: ${plot.scale("color").apply("limited")}">limited service trains</b> are passed by <b style="color: ${plot.scale("color").apply("bullet")}">baby bullets</b>. This type of plot is sometimes called a stringline chart. Based on the [D3 implementation](/@d3/mareys-trains).`
)}

function _schedule(Inputs){return(
Inputs.radio(["weekday", "weekend"], {label: "Schedule", value: "weekday"})
)}

function _plot(Plot,d3,asTime,asMinutes,trains,schedule){return(
Plot.plot({
  inset: 10,
  margin: 10,
  marginLeft: 40,
  marginTop: 100,
  grid: true,
  width: 1152,
  height: 1800,
  x: {
    axis: null // hide arbitrary distance units
  },
  y: {
    label: null,
    ticks: d3.range(3, 24).map(h => h * 60),
    tickFormat: asTime,
    transform: asMinutes,
    reverse: true
  },
  color: {
    legend: true,
    domain: ["normal", "limited", "bullet"],
    range: ["rgb(34, 34, 34)", "rgb(183, 116, 9)", "rgb(192, 62, 29)"]
  },
  marks: [
    Plot.ruleX(trains, Plot.groupX({}, {x: "distance", strokeOpacity: 0.1, strokeDasharray: 2})),
    Plot.text(trains, Plot.groupX({text: "first", y: () => "4:30am"}, {x: "distance", text: "station", rotate: -90, frameAnchor: "left", dy: -12})),
    Plot.line(trains, {filter: d => d.schedule === schedule, x: "distance", y: "time", z: "train", stroke: "speed", marker: "circle", title: (d) => `${d.train}${d.direction}\n${d.station}\n${d.time}`, tip: true})
  ]
})
)}

function _asTime(formatTime,d3,minutesOffset){return(
function asTime(minutes) {
  return formatTime(d3.utcMinute.offset(d3.utcDay(), minutes - minutesOffset));
}
)}

function _asMinutes(parseTime,minutesOffset){return(
function asMinutes(time) {
  if (!(time = parseTime(time))) return;
  const minutes = time.getUTCHours() * 60 + time.getUTCMinutes();
  return (minutes + minutesOffset + 60 * 24) % (24 * 60);
}
)}

function _minutesOffset(){return(
-60 * 2
)}

function _parseTime(d3){return(
d3.utcParse("%I:%M%p")
)}

function _formatTime(d3){return(
d3.utcFormat("%-I %p")
)}

function _trains(FileAttachment){return(
FileAttachment("caltrain.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["caltrain.csv", {url: "https://static.observableusercontent.com/files/6890d6f1c3e531438ebbaaabb87cbb183277103a227578f5b9e51410e41a3e1f72d7818c790ec25d17f9a871bf7456479376176e281cabac637cba5f4c934e00", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["plot","md"], _1);
  main.variable(observer("viewof schedule")).define("viewof schedule", ["Inputs"], _schedule);
  main.variable(observer("schedule")).define("schedule", ["Generators", "viewof schedule"], (G, _) => G.input(_));
  main.variable(observer("plot")).define("plot", ["Plot","d3","asTime","asMinutes","trains","schedule"], _plot);
  main.variable(observer("asTime")).define("asTime", ["formatTime","d3","minutesOffset"], _asTime);
  main.variable(observer("asMinutes")).define("asMinutes", ["parseTime","minutesOffset"], _asMinutes);
  main.variable(observer("minutesOffset")).define("minutesOffset", _minutesOffset);
  main.variable(observer("parseTime")).define("parseTime", ["d3"], _parseTime);
  main.variable(observer("formatTime")).define("formatTime", ["d3"], _formatTime);
  main.variable(observer("trains")).define("trains", ["FileAttachment"], _trains);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-candlestick-chart"] = { code: "Plot.plot({\n  inset: 6,\n  width: 928,\n  grid: true,\n  y: {label: \"↑ Apple stock price ($)\"},\n  color: {domain: [-1, 0, 1], range: [\"#e41a1c\", \"currentColor\", \"#4daf4a\"]},\n  marks: [\n    Plot.ruleX(ticker, {\n      x: \"Date\",\n      y1: \"Low\",\n      y2: \"High\"\n    }),\n    Plot.ruleX(ticker, {\n      x: \"Date\",\n      y1: \"Open\",\n      y2: \"Close\",\n      stroke: (d) => Math.sign(d.Close - d.Open),\n      strokeWidth: 4,\n      strokeLinecap: \"round\"\n    })\n  ]\n})\n\nticker = aapl.slice(-130)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Candlestick chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Candlestick chart

A [ruleX](https://observablehq.com/plot/marks/rule) encodes a vertical extent at a given horizontal position. For more, read Zan Armstrong’s [Candlestick Chart](/@observablehq/observable-plot-candlestick) tutorial.`
)}

function _2(Plot,ticker){return(
Plot.plot({
  inset: 6,
  width: 928,
  grid: true,
  y: {label: "↑ Apple stock price ($)"},
  color: {domain: [-1, 0, 1], range: ["#e41a1c", "currentColor", "#4daf4a"]},
  marks: [
    Plot.ruleX(ticker, {
      x: "Date",
      y1: "Low",
      y2: "High"
    }),
    Plot.ruleX(ticker, {
      x: "Date",
      y1: "Open",
      y2: "Close",
      stroke: (d) => Math.sign(d.Close - d.Open),
      strokeWidth: 4,
      strokeLinecap: "round"
    })
  ]
})
)}

function _ticker(aapl){return(
aapl.slice(-130)
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","ticker"], _2);
  main.variable(observer("ticker")).define("ticker", ["aapl"], _ticker);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-band-chart-with-rule"] = { code: "Plot.plot({\n  y: {grid: true, label: \"↑ Temperature (°C)\"},\n  color: {scheme: \"BuRd\"},\n  marks: [\n    Plot.ruleY([0]),\n    Plot.ruleX(seattle, {x: \"date\", y1: \"temp_min\", y2: \"temp_max\", stroke: \"temp_min\"})\n  ]\n})\n\nseattle = FileAttachment(\"seattle-weather.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Band chart with rule</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Band chart with rule

A [ruleX](https://observablehq.com/plot/marks/rule) encodes a vertical extent at a given horizontal position.`
)}

function _2(Plot,seattle){return(
Plot.plot({
  y: {grid: true, label: "↑ Temperature (°C)"},
  color: {scheme: "BuRd"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX(seattle, {x: "date", y1: "temp_min", y2: "temp_max", stroke: "temp_min"})
  ]
})
)}

function _seattle(FileAttachment){return(
FileAttachment("seattle-weather.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["seattle-weather.csv", {url: "https://static.observableusercontent.com/files/8d035288edb063a73e8cebfc53f73c33d48bfba4f00172d196145106b566300e5c4d101d10973ebf61bb740326201335796b8d49398c23946d400ca435519fdd", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","seattle"], _2);
  main.variable(observer("seattle")).define("seattle", ["FileAttachment"], _seattle);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-lollipop"] = { code: "Plot.plot({\n  x: {label: null, tickPadding: 6, tickSize: 0},\n  y: {percent: true},\n  marks: [\n    Plot.ruleX(alphabet, {x: \"letter\", y: \"frequency\", strokeWidth: 2}),\n    Plot.dot(alphabet, {x: \"letter\", y: \"frequency\", fill: \"currentColor\", r: 4})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Lollipop</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Lollipop

Use a [rule](https://observablehq.com/plot/marks/rule) mark to draw a thin line along one dimension. Add a [dot](https://observablehq.com/plot/marks/dot), and you get a lollipop!`
)}

function _2(Plot,alphabet){return(
Plot.plot({
  x: {label: null, tickPadding: 6, tickSize: 0},
  y: {percent: true},
  marks: [
    Plot.ruleX(alphabet, {x: "letter", y: "frequency", strokeWidth: 2}),
    Plot.dot(alphabet, {x: "letter", y: "frequency", fill: "currentColor", r: 4})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-faceted-lollipop"] = { code: "Plot.plot({\n  marginLeft: 50,\n  color: { domain: keys, scheme: \"Warm\", legend: true },\n  facet: { data: population, x: \"state\" },\n  y: { tickFormat: \"s\", grid: true },\n  x: { axis: null, domain: keys },\n  marks: [\n    Plot.ruleX(population, {\n      x: \"key\",\n      y: \"population\",\n      stroke: \"key\",\n      strokeWidth: 3\n    }),\n    Plot.dot(population, {\n      x: \"key\",\n      y: \"population\",\n      fill: \"key\",\n      r: 5,\n      sort: { fx: \"y\", reduce: \"sum\", reverse: true }\n    }),\n    Plot.ruleY([0])\n  ]\n})\n\npopulation = FileAttachment(\"us-state-population.csv\").csv({typed: true})\n\nkeys = d3.sort(new Set(population.map(d => d.key)), d => parseInt(d.match(/\\d+/)[0]))", imports: [], define: (function(){
function _1(md){return(
md`# Plot: Faceted lollipop

[Facet](https://observablehq.com/plot/features/facets) [lollipops](https://observablehq.com/@observablehq/plot-lollipop) by category for an alternative to a [grouped bar chart](https://observablehq.com/@observablehq/plot-grouped-bar-chart).`
)}

function _2(Plot,keys,population){return(
Plot.plot({
  marginLeft: 50,
  color: { domain: keys, scheme: "Warm", legend: true },
  facet: { data: population, x: "state" },
  y: { tickFormat: "s", grid: true },
  x: { axis: null, domain: keys },
  marks: [
    Plot.ruleX(population, {
      x: "key",
      y: "population",
      stroke: "key",
      strokeWidth: 3
    }),
    Plot.dot(population, {
      x: "key",
      y: "population",
      fill: "key",
      r: 5,
      sort: { fx: "y", reduce: "sum", reverse: true }
    }),
    Plot.ruleY([0])
  ]
})
)}

function _population(FileAttachment){return(
FileAttachment("us-state-population.csv").csv({typed: true})
)}

function _keys(d3,population){return(
d3.sort(new Set(population.map(d => d.key)), d => parseInt(d.match(/\d+/)[0]))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-state-population.csv", {url: "https://static.observableusercontent.com/files/e6a1c683df2962a2cce8a54e29858393318a3e07777ee2650003325fbed36f4ddb1bef54300f3a0db0248ac1b44dc03473eebb2e75ed36d75dfff39d03d7ef8e", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","keys","population"], _2);
  main.variable(observer("population")).define("population", ["FileAttachment"], _population);
  main.variable(observer("keys")).define("keys", ["d3","population"], _keys);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-bar-and-tick"] = { code: "Plot.plot({\n  x: {label: null},\n  y: {percent: true},\n  marks: [\n    Plot.barY(alphabet, {x: \"letter\", y: \"frequency\", fillOpacity: 0.2}),\n    Plot.tickY(alphabet, {x: \"letter\", y: \"frequency\"}),\n    Plot.ruleY([0])\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Bar and tick</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Bar and tick

A [tick](https://observablehq.com/plot/marks/tick) is convenient for stroking the upper bound of a [bar](https://observablehq.com/plot/marks/bar) for emphasis.`
)}

function _2(Plot,alphabet){return(
Plot.plot({
  x: {label: null},
  y: {percent: true},
  marks: [
    Plot.barY(alphabet, {x: "letter", y: "frequency", fillOpacity: 0.2}),
    Plot.tickY(alphabet, {x: "letter", y: "frequency"}),
    Plot.ruleY([0])
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","alphabet"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-barcode"] = { code: "Plot.plot({\n  x: {\n    grid: true,\n    label: \"Population (%) →\",\n    percent: true\n  },\n  y: {\n    domain: stateage.ages, // in age order\n    reverse: true,\n    label: \"↑ Age (years)\",\n    labelAnchor: \"top\"\n  },\n  marks: [\n    Plot.ruleX([0]),\n    Plot.tickX(stateage, Plot.normalizeX(\"sum\", {z: \"state\", x: \"population\", y: \"age\"}))\n  ]\n})\n\nwide = FileAttachment(\"us-population-state-age.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Barcode chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Barcode chart

A barcode chart just adds a [tick](https://observablehq.com/plot/marks/tick) for each value; if the values overlap, use strokeOpacity to give a sense of density. In this example, the populations are [normalized](https://observablehq.com/plot/transforms/normalize) to reflect the percentage of each age class in every State.`
)}

function _2(Plot,stateage){return(
Plot.plot({
  x: {
    grid: true,
    label: "Population (%) →",
    percent: true
  },
  y: {
    domain: stateage.ages, // in age order
    reverse: true,
    label: "↑ Age (years)",
    labelAnchor: "top"
  },
  marks: [
    Plot.ruleX([0]),
    Plot.tickX(stateage, Plot.normalizeX("sum", {z: "state", x: "population", y: "age"}))
  ]
})
)}

function _wide(FileAttachment){return(
FileAttachment("us-population-state-age.csv").csv({ typed: true })
)}

function _stateage(wide)
{
  const ages = wide.columns.slice(1);
  const values = wide.flatMap(({name, ...values}) => ages.map((age) => ({state: name, age, population: values[age]})));
  values.ages = ages;
  return values;
}


function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-population-state-age.csv", {url: "https://static.observableusercontent.com/files/81d7bd5e9551f005d7a4764e2dcb46c44f04b5918551ce19dba191a8799b498beddb5ef2da994047586fc7231749e8911c825b1967f22814a57bee58c590c86e", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","stateage"], _2);
  main.variable(observer("wide")).define("wide", ["FileAttachment"], _wide);
  main.variable(observer("stateage")).define("stateage", ["wide"], _stateage);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-sorted-groups"] = { code: "Plot.plot({\n  marginLeft: 120,\n  x: {label: \"Vehicles per hour (thousands) →\", transform: (x) => x / 1000},\n  y: {label: null},\n  marks: [\n    Plot.ruleX([0]),\n    Plot.tickX(\n      traffic,\n      {x: \"vehicles\", y: \"location\", strokeOpacity: 0.3}\n    ),\n    Plot.tickX(\n      traffic,\n      Plot.groupY(\n        {x: \"median\"},\n        {x: \"vehicles\", y: \"location\", stroke: \"red\", strokeWidth: 4, sort: {y: \"x\"}}\n      )\n    )\n  ]\n})\n\ntraffic = FileAttachment(\"traffic.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Germany traffic patterns</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Germany traffic patterns

The [group](https://observablehq.com/plot/transforms/group) [transform](https://observablehq.com/plot/features/transforms) groups by location and applies a median reducer to position the red tick on *x*. The [sort mark option](https://observablehq.com/plot/features/scales#sort-mark-option) then orders *y* by that derived value. Data: [Christopher Möller](https://gist.github.com/chrtze/c74efb46cadb6a908bbbf5227934bfea).`
)}

function _2(Plot,traffic){return(
Plot.plot({
  marginLeft: 120,
  x: {label: "Vehicles per hour (thousands) →", transform: (x) => x / 1000},
  y: {label: null},
  marks: [
    Plot.ruleX([0]),
    Plot.tickX(
      traffic,
      {x: "vehicles", y: "location", strokeOpacity: 0.3}
    ),
    Plot.tickX(
      traffic,
      Plot.groupY(
        {x: "median"},
        {x: "vehicles", y: "location", stroke: "red", strokeWidth: 4, sort: {y: "x"}}
      )
    )
  ]
})
)}

function _traffic(FileAttachment){return(
FileAttachment("traffic.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["traffic.csv", {url: "https://static.observableusercontent.com/files/609a91fa3908394198a9b2592b8432a798332e9a140a8d5f9c864615e3f18b2e822badadc579c06b394bb1396a20f064d72123b718354b829978b2d4782bd5c9", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","traffic"], _2);
  main.variable(observer("traffic")).define("traffic", ["FileAttachment"], _traffic);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-floor-plan"] = { code: "Plot.geo(westport).plot({projection: {type: \"identity\", domain: westport}})\n\nwestport = FileAttachment(\"westport-house.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Floor plan</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Floor plan

The [geo](https://observablehq.com/plot/marks/geo) mark can display large scale maps such as this floor plan of the Westport House in Dundee, Ireland—using the _identity_ [projection](https://observablehq.com/plot/features/projections).`
)}

function _2(Plot,westport){return(
Plot.geo(westport).plot({projection: {type: "identity", domain: westport}})
)}

function _westport(FileAttachment){return(
FileAttachment("westport-house.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["westport-house.json", {url: "https://static.observableusercontent.com/files/94949815e67a6bb258740308f8c6c64057b88a91bc38e21fef28a7bc2c11f97651f02a8036d491741758150749555eaedbc442ca1e2abce111c87e103be862b2", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","westport"], _2);
  main.variable(observer("westport")).define("westport", ["FileAttachment"], _westport);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-polar-projection"] = { code: "Plot.plot({\n  width: 688,\n  height: 688,\n  projection: ({width, height}) => d3.geoAzimuthalEquidistant()\n    .rotate([0, 90])\n    .translate([width / 2, height / 2])\n    .scale(width)\n    .clipAngle(40),\n  marks: [\n    Plot.graticule(),\n    Plot.geo(land, {fill: \"currentColor\"}),\n    Plot.frame()\n  ]\n})\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Polar projection</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Polar projection

To demonstrate the extensibility of Plot’s [projection system](https://observablehq.com/plot/features/projections), this example explicitly defines an azimuthal equidistant projection that fits a designated rectangle.`
)}

function _2(Plot,d3,land){return(
Plot.plot({
  width: 688,
  height: 688,
  projection: ({width, height}) => d3.geoAzimuthalEquidistant()
    .rotate([0, 90])
    .translate([width / 2, height / 2])
    .scale(width)
    .clipAngle(40),
  marks: [
    Plot.graticule(),
    Plot.geo(land, {fill: "currentColor"}),
    Plot.frame()
  ]
})
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","land"], _2);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-map-small-multiples"] = { code: "Plot.plot({\n  marginLeft: 0,\n  marginRight: 0,\n  projection: \"albers\",\n  fx: {\n    interval: d3.utcYear.every(10),\n    tickFormat: (d) => `${d.getUTCFullYear()}’s`,\n    label: null\n  },\n  marks: [\n    Plot.geo(statemesh, {strokeOpacity: 0.1}),\n    Plot.geo(nation),\n    Plot.dot(walmarts, {fx: \"date\", x: \"longitude\", y: \"latitude\", r: 1, fill: \"currentColor\"})\n  ]\n})\n\nwalmarts = FileAttachment(\"walmarts.tsv\").tsv({typed: true})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nstatemesh = topojson.mesh(us, us.objects.states)\n\nnation = topojson.feature(us, us.objects.nation)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Map small multiples</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Map small multiples

Plot’s [projection](https://observablehq.com/plot/features/projections) system is compatible with its [faceting](https://observablehq.com/plot/features/facets) system. Below, a comic strip of sorts shows the locations of Walmart store openings in past decades.`
)}

function _2(Plot,d3,statemesh,nation,walmarts){return(
Plot.plot({
  marginLeft: 0,
  marginRight: 0,
  projection: "albers",
  fx: {
    interval: d3.utcYear.every(10),
    tickFormat: (d) => `${d.getUTCFullYear()}’s`,
    label: null
  },
  marks: [
    Plot.geo(statemesh, {strokeOpacity: 0.1}),
    Plot.geo(nation),
    Plot.dot(walmarts, {fx: "date", x: "longitude", y: "latitude", r: 1, fill: "currentColor"})
  ]
})
)}

function _walmarts(FileAttachment){return(
FileAttachment("walmarts.tsv").tsv({typed: true})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}],
    ["walmarts.tsv", {url: "https://static.observableusercontent.com/files/3711de2a6d1c44df145f2a29f8744771e113672517ed5d84b0fbf76740b423e060d96eb2ae76bc28806b2d3cef37083de88309b3c86baef2807f0e27b2d045f3", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","statemesh","nation","walmarts"], _2);
  main.variable(observer("walmarts")).define("walmarts", ["FileAttachment"], _walmarts);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-projection-domain"] = { code: "radius = Inputs.range([10, 50], {step: 0.1, label: \"radius\"})\n\nPlot.plot({\n  projection: {\n    type: \"azimuthal-equidistant\",\n    rotate: [-9, -34],\n    domain: circle,\n    inset: 10\n  },\n  marks: [\n    Plot.graticule(),\n    Plot.geo(land, {fill: \"currentColor\", fillOpacity: 0.3}),\n    Plot.geo(circle, {stroke: \"red\", strokeWidth: 2}),\n    Plot.frame()\n  ]\n})\n\ncircle = d3.geoCircle().center([9, 34]).radius(radius).precision(2)()\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Projection domain</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Projection domain

For maps that focus on a specific region, use the [projection](https://observablehq.com/plot/features/projections)’s **domain** option to zoom in. This should be a GeoJSON object. For example, you can use [d3.geoCircle](https://github.com/d3/d3-geo/blob/main/README.md#geoCircle) to generate a circle of a given radius centered at a given longitude and latitude. You can also use the **inset** options for a bit of padding around the **domain**.`
)}

function _radius(Inputs){return(
Inputs.range([10, 50], {step: 0.1, label: "radius"})
)}

function _3(Plot,circle,land){return(
Plot.plot({
  projection: {
    type: "azimuthal-equidistant",
    rotate: [-9, -34],
    domain: circle,
    inset: 10
  },
  marks: [
    Plot.graticule(),
    Plot.geo(land, {fill: "currentColor", fillOpacity: 0.3}),
    Plot.geo(circle, {stroke: "red", strokeWidth: 2}),
    Plot.frame()
  ]
})
)}

function _circle(d3,radius){return(
d3.geoCircle().center([9, 34]).radius(radius).precision(2)()
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof radius")).define("viewof radius", ["Inputs"], _radius);
  main.variable(observer("radius")).define("radius", ["Generators", "viewof radius"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","circle","land"], _3);
  main.variable(observer("circle")).define("circle", ["d3","radius"], _circle);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-albers-usa-projection"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(nation),\n    Plot.geo(statemesh, {strokeOpacity: 0.2})\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\nstatemesh = topojson.mesh(us, us.objects.states)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Albers-USA projection</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Albers-USA projection

Use the *albers-usa* projection for U.S.-centric maps. This projection is equal-area for the continental United States and Hawaii. Note however that the scale for Alaska is diminished: it is projected at 0.35× its true relative area.`
)}

function _2(Plot,nation,statemesh){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(nation),
    Plot.geo(statemesh, {strokeOpacity: 0.2})
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","nation","statemesh"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-world-projections"] = { code: "projection = Inputs.select(\n  [\n    /* \"albers\", */\n    \"azimuthal-equal-area\",\n    \"azimuthal-equidistant\",\n    /* \"conic-conformal\", */\n    \"conic-equal-area\",\n    \"conic-equidistant\",\n    \"equal-earth\",\n    \"equirectangular\",\n    \"gnomonic\",\n    /* \"identity\", */\n    /* \"reflect-y\", */\n    \"mercator\",\n    \"orthographic\",\n    \"stereographic\",\n    \"transverse-mercator\"\n  ],\n  { label: \"projection\", value: \"equirectangular\" }\n)\n\nPlot.plot({\n  projection,\n  marks: [\n    Plot.graticule(),\n    Plot.geo(land, {fill: \"currentColor\"}),\n    Plot.sphere()\n  ]\n})\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: World projections</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# World projections

No single [projection](https://observablehq.com/plot/features/projections) is best at everything. It is impossible, for example, for a projection to be both conformal (preserving angles) and equal-area (preserving relative surface areas).`
)}

function _projection(Inputs){return(
Inputs.select(
  [
    /* "albers", */
    "azimuthal-equal-area",
    "azimuthal-equidistant",
    /* "conic-conformal", */
    "conic-equal-area",
    "conic-equidistant",
    "equal-earth",
    "equirectangular",
    "gnomonic",
    /* "identity", */
    /* "reflect-y", */
    "mercator",
    "orthographic",
    "stereographic",
    "transverse-mercator"
  ],
  { label: "projection", value: "equirectangular" }
)
)}

function _3(Plot,projection,land){return(
Plot.plot({
  projection,
  marks: [
    Plot.graticule(),
    Plot.geo(land, {fill: "currentColor"}),
    Plot.sphere()
  ]
})
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof projection")).define("viewof projection", ["Inputs"], _projection);
  main.variable(observer("projection")).define("projection", ["Generators", "viewof projection"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","projection","land"], _3);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-earthquake-globe"] = { code: "longitude = Inputs.range([-180, 180], {label: \"longitude\", step: 1, value: 90})\n\nPlot.plot({\n  projection: {type: \"orthographic\", rotate: [-longitude, -30]},\n  r: {transform: (d) => Math.pow(10, d)}, // convert Richter to amplitude\n  style: \"overflow: visible;\", // allow dots to escape\n  marks: [\n    Plot.geo(land, {fill: \"currentColor\", fillOpacity: 0.2}),\n    Plot.sphere(),\n    Plot.dot(earthquakes, {x: \"longitude\", y: \"latitude\", r: \"magnitude\", stroke: \"red\", fill: \"red\", fillOpacity: 0.2})\n  ]\n})\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)\n\nearthquakes = d3.json(\"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson\").then(d => d.features.map(f => {\n  const c = d3.geoCentroid(f);\n  return {magnitude: f.properties.mag, longitude: c[0], latitude: c[1]};\n}))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Earthquake globe</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Earthquake globe

[Projections](https://observablehq.com/plot/features/projections) and live data!`
)}

function _longitude(Inputs){return(
Inputs.range([-180, 180], {label: "longitude", step: 1, value: 90})
)}

function _3(Plot,longitude,land,earthquakes){return(
Plot.plot({
  projection: {type: "orthographic", rotate: [-longitude, -30]},
  r: {transform: (d) => Math.pow(10, d)}, // convert Richter to amplitude
  style: "overflow: visible;", // allow dots to escape
  marks: [
    Plot.geo(land, {fill: "currentColor", fillOpacity: 0.2}),
    Plot.sphere(),
    Plot.dot(earthquakes, {x: "longitude", y: "latitude", r: "magnitude", stroke: "red", fill: "red", fillOpacity: 0.2})
  ]
})
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function _earthquakes(d3){return(
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(d => d.features.map(f => {
  const c = d3.geoCentroid(f);
  return {magnitude: f.properties.mag, longitude: c[0], latitude: c[1]};
}))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof longitude")).define("viewof longitude", ["Inputs"], _longitude);
  main.variable(observer("longitude")).define("longitude", ["Generators", "viewof longitude"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","longitude","land","earthquakes"], _3);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  main.variable(observer("earthquakes")).define("earthquakes", ["d3"], _earthquakes);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-hexbin-map"] = { code: "Plot.plot({\n  projection: \"albers\",\n  r: {range: [0, 16]},\n  color: {scheme: \"spectral\", label: \"First year opened\", legend: true},\n  marks: [\n    Plot.geo(statemesh, {strokeOpacity: 0.5}),\n    Plot.geo(nation),\n    Plot.dot(walmarts, Plot.hexbin({r: \"count\", fill: \"min\"}, {x: \"longitude\", y: \"latitude\", fill: \"date\"}))\n  ]\n})\n\nnation = topojson.feature(us, us.objects.nation)\n\nstatemesh = topojson.feature(us, us.objects.states)\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nwalmarts = FileAttachment(\"walmarts.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Hexbin map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Hexbin map

The [hexbin](https://observablehq.com/plot/transforms/hexbin) transform works with Plot’s [projection system](https://observablehq.com/plot/features/projections). Below, hexagon size represents the number of nearby Walmart stores, while color represents the date the first nearby Walmart store opened. (The first Walmart opened in Rogers, Arkansas.)`
)}

function _2(Plot,statemesh,nation,walmarts){return(
Plot.plot({
  projection: "albers",
  r: {range: [0, 16]},
  color: {scheme: "spectral", label: "First year opened", legend: true},
  marks: [
    Plot.geo(statemesh, {strokeOpacity: 0.5}),
    Plot.geo(nation),
    Plot.dot(walmarts, Plot.hexbin({r: "count", fill: "min"}, {x: "longitude", y: "latitude", fill: "date"}))
  ]
})
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemesh(topojson,us){return(
topojson.feature(us, us.objects.states)
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _walmarts(FileAttachment){return(
FileAttachment("walmarts.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}],
    ["walmarts.tsv", {url: "https://static.observableusercontent.com/files/3711de2a6d1c44df145f2a29f8744771e113672517ed5d84b0fbf76740b423e060d96eb2ae76bc28806b2d3cef37083de88309b3c86baef2807f0e27b2d045f3", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","statemesh","nation","walmarts"], _2);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("walmarts")).define("walmarts", ["FileAttachment"], _walmarts);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-centroid-hexbin"] = { code: "Plot.dot(counties, Plot.hexbin({r:\"count\"}, Plot.geoCentroid())).plot({projection: \"albers\"})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\ncounties = topojson.feature(us, us.objects.counties).features", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Centroid hexbin</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Centroid hexbin

Combine the [geoCentroid](https://observablehq.com/plot/transforms/centroid) and [hexbin](https://observablehq.com/plot/transforms/hexbin) transforms to measure the density of U.S. counties.`
)}

function _2(Plot,counties){return(
Plot.dot(counties, Plot.hexbin({r:"count"}, Plot.geoCentroid())).plot({projection: "albers"})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties).features
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","counties"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-centroid-dot"] = { code: "Plot.dot(counties, Plot.centroid()).plot({projection: \"albers-usa\"})\n\nPlot.dot(counties, Plot.geoCentroid()).plot({projection: \"albers-usa\"})\n\nPlot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.dot(counties, Plot.geoCentroid({stroke: \"red\"})),\n    Plot.dot(counties, Plot.centroid({fill: \"currentColor\", r: 2}))\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\ncounties = topojson.feature(us, us.objects.counties).features", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Centroid dot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Centroid dot

The [centroid](https://observablehq.com/plot/transforms/centroid) and geoCentroid transforms work slightly differently—they allow to compute a single location for each geographic feature, which can be used, for example, to display a [dot](https://observablehq.com/plot/marks/dot).`
)}

function _2(Plot,counties){return(
Plot.dot(counties, Plot.centroid()).plot({projection: "albers-usa"})
)}

function _3(Plot,counties){return(
Plot.dot(counties, Plot.geoCentroid()).plot({projection: "albers-usa"})
)}

function _4(md){return(
md`---
The difference between the centroid initializer and the geoCentroid transform is almost imperceptible. In the map below, which layers both approaches, only one dot near the bottom-left of the frame is noticeably different:`
)}

function _5(Plot,counties){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.dot(counties, Plot.geoCentroid({stroke: "red"})),
    Plot.dot(counties, Plot.centroid({fill: "currentColor", r: 2}))
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties).features
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","counties"], _2);
  main.variable(observer()).define(["Plot","counties"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","counties"], _5);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-state-labels"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(statemesh),\n    Plot.text(states, Plot.centroid({text: (d) => d.properties.name, fill: \"currentColor\", stroke: \"white\"}))\n  ]\n})\n\nstates = topojson.feature(us, us.objects.states).features\n\nstatemesh = topojson.mesh(us, us.objects.states)\n\nus = FileAttachment(\"us-counties-10m.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: State labels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# State labels

Add a label to U.S. states with a [text mark](https://observablehq.com/plot/marks/text) and a [centroid](https://observablehq.com/plot/transforms/centroid) transform.`
)}

function _2(Plot,statemesh,states){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(statemesh),
    Plot.text(states, Plot.centroid({text: (d) => d.properties.name, fill: "currentColor", stroke: "white"}))
  ]
})
)}

function _states(topojson,us){return(
topojson.feature(us, us.objects.states).features
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/ff73290f3fccc5db55f09031bb845e639a07e444ca9fbcf83f2dbb4600a38bf4baccb2a85df3c24dba57a4ed64c230dcf1a87604453969495db835c5f3cbebf2", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","statemesh","states"], _2);
  main.variable(observer("states")).define("states", ["topojson","us"], _states);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-state-centroids"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(states, {strokeOpacity: 0.1, tip: true, title: \"name\"}),\n    Plot.geo(nation),\n    Plot.dot(states, Plot.centroid({fill: \"red\", stroke: \"white\"}))\n  ]\n})\n\nnation = topojson.feature(us, us.objects.nation)\n\nstates = topojson.feature(us, us.objects.states).features\n\nus = FileAttachment(\"us-counties-10m.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: State centroids</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# State centroids

Mark the [centroid](https://observablehq.com/plot/transforms/centroid) of each U.S. state with a [dot](https://observablehq.com/plot/marks/dot) and an interactive [tip](https://observablehq.com/plot/marks/tip).`
)}

function _2(Plot,states,nation){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states, {strokeOpacity: 0.1, tip: true, title: "name"}),
    Plot.geo(nation),
    Plot.dot(states, Plot.centroid({fill: "red", stroke: "white"}))
  ]
})
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _states(topojson,us){return(
topojson.feature(us, us.objects.states).features
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/ff73290f3fccc5db55f09031bb845e639a07e444ca9fbcf83f2dbb4600a38bf4baccb2a85df3c24dba57a4ed64c230dcf1a87604453969495db835c5f3cbebf2", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","states","nation"], _2);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("states")).define("states", ["topojson","us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-v-counties"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(countymesh, {strokeWidth: 0.1}),\n    Plot.geo(statemesh, {strokeWidth: 0.5}),\n    Plot.dot(\n      counties,\n      Plot.centroid({\n        filter: (d) => d.properties.name.match(/^V/),\n        fill: \"currentColor\",\n        stroke: \"white\"\n      })\n    ),\n    Plot.text(\n      counties,\n      Plot.centroid({\n        filter: (d) => d.properties.name.match(/^V/),\n        text: (d) => d.properties.name,\n        fill: \"currentColor\",\n        stroke: \"white\",\n        textAnchor: \"start\",\n        dx: 6\n      })\n    )\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\ncounties = topojson.feature(us, us.objects.counties).features\n\ncountymesh = topojson.mesh(us, us.objects.counties)\n\nstatemesh = topojson.mesh(us, us.objects.states)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: V-Counties</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# V-Counties

To label the U.S. counties with names starting with V—this is more interesting than it seems—we can use a [dot mark](https://observablehq.com/plot/marks/dot) and a [text mark](https://observablehq.com/plot/marks/text), in combination with a [centroid](https://observablehq.com/plot/transforms/centroid) transform.`
)}

function _2(Plot,countymesh,statemesh,counties){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(countymesh, {strokeWidth: 0.1}),
    Plot.geo(statemesh, {strokeWidth: 0.5}),
    Plot.dot(
      counties,
      Plot.centroid({
        filter: (d) => d.properties.name.match(/^V/),
        fill: "currentColor",
        stroke: "white"
      })
    ),
    Plot.text(
      counties,
      Plot.centroid({
        filter: (d) => d.properties.name.match(/^V/),
        text: (d) => d.properties.name,
        fill: "currentColor",
        stroke: "white",
        textAnchor: "start",
        dx: 6
      })
    )
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties).features
)}

function _countymesh(topojson,us){return(
topojson.mesh(us, us.objects.counties)
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","countymesh","statemesh","counties"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  main.variable(observer("countymesh")).define("countymesh", ["topojson","us"], _countymesh);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-shockwave"] = { code: "Plot.plot({\n  projection: {\n    type: \"equal-earth\",\n    rotate: [90, 0]\n  },\n  color: {\n    legend: true,\n    label: \"Distance from Tonga (km)\",\n    transform: (d) => 111.2 * d, // degrees to km\n    zero: true\n  },\n  marks: [\n    Plot.geo(land),\n    Plot.geo([0.5, 179.5].concat(d3.range(10, 171, 10)), {\n      geometry: d3.geoCircle().center([-175.38, -20.57]).radius((r) => r),\n      stroke: (r) => r,\n      strokeWidth: 2\n    }),\n    Plot.sphere()\n  ]\n})\n\nworld = FileAttachment(\"countries-110m.json\").json()\n\nland = topojson.feature(world, world.objects.land)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Shockwave</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Shockwave

The shockwave created by the explosion of the [Hunga Tonga–Hunga Haʻapai volcano](https://en.wikipedia.org/wiki/2021%E2%80%9322_Hunga_Tonga%E2%80%93Hunga_Ha%CA%BBapai_eruption_and_tsunami) on January 15, 2022, shown as a series of [geodesic circles](https://github.com/d3/d3-geo/blob/main/README.md#geoCircle) of increasing radius; see the [geo mark](https://observablehq.com/plot/marks/geo).`
)}

function _2(Plot,land,d3){return(
Plot.plot({
  projection: {
    type: "equal-earth",
    rotate: [90, 0]
  },
  color: {
    legend: true,
    label: "Distance from Tonga (km)",
    transform: (d) => 111.2 * d, // degrees to km
    zero: true
  },
  marks: [
    Plot.geo(land),
    Plot.geo([0.5, 179.5].concat(d3.range(10, 171, 10)), {
      geometry: d3.geoCircle().center([-175.38, -20.57]).radius((r) => r),
      stroke: (r) => r,
      strokeWidth: 2
    }),
    Plot.sphere()
  ]
})
)}

function _world(FileAttachment){return(
FileAttachment("countries-110m.json").json()
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["countries-110m.json", {url: "https://static.observableusercontent.com/files/7c6167b65013c12f3978b4d8e85dd28a27e3b5eb580d1e76696ce5b0d399c196de2b02c45e734462931e1af823698e36bb072722253d5e03e7fb61222755bc0c", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","land","d3"], _2);
  main.variable(observer("world")).define("world", ["FileAttachment"], _world);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-choropleth"] = { code: "Plot.plot({\n  width: 975,\n  height: 610,\n  projection: \"identity\",\n  color: {\n    type: \"quantize\",\n    n: 9,\n    domain: [1, 10],\n    scheme: \"blues\",\n    label: \"Unemployment rate (%)\",\n    legend: true\n  },\n  marks: [\n    Plot.geo(counties, Plot.centroid({\n      fill: d => unemployment.get(d.id),\n      tip: true,\n      channels: {\n        County: d => d.properties.name,\n        State: d => statemap.get(d.id.slice(0,2)).properties.name\n      }\n    })),\n    Plot.geo(states, {stroke: \"white\"})\n  ]\n})\n\nus = FileAttachment(\"counties-albers-10m.json\").json()\n\ncounties = topojson.feature(us, us.objects.counties)\n\nstates = topojson.feature(us, us.objects.states)\n\nstatemap = new Map(states.features.map(d => [d.id, d]))\n\nstatemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Choropleth</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Choropleth

Unemployment rate by U.S. county, August 2016. Data: [Bureau of Labor Statistics](http://www.bls.gov/lau/#tables). We use the [geo mark](https://observablehq.com/plot/marks/geo) to paint each county with a color representing the unemployment rate, and render a white mesh of the states boundaries on top. A [centroid transform](https://observablehq.com/plot/transforms/centroid) and extra channels support [interactive tips](https://observablehq.com/plot/features/interactions). See the [D3 version](/@d3/choropleth/2).`
)}

function _2(Plot,counties,unemployment,statemap,states){return(
Plot.plot({
  width: 975,
  height: 610,
  projection: "identity",
  color: {
    type: "quantize",
    n: 9,
    domain: [1, 10],
    scheme: "blues",
    label: "Unemployment rate (%)",
    legend: true
  },
  marks: [
    Plot.geo(counties, Plot.centroid({
      fill: d => unemployment.get(d.id),
      tip: true,
      channels: {
        County: d => d.properties.name,
        State: d => statemap.get(d.id.slice(0,2)).properties.name
      }
    })),
    Plot.geo(states, {stroke: "white"})
  ]
})
)}

function _3(md){return(
md`In the *unemployment* dataset, we don’t use automatic type inference for CSV (*a.k.a.*, typed: true) as that would coerce the FIPS identifiers to numbers, which then wouldn’t match the identifiers in our GeoJSON. However, we still want to coerce the *rate* values to numbers, so we do that explicitly. While we’re at it, we store the values in a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object for fast lookups.`
)}

async function _unemployment(FileAttachment){return(
new Map((await FileAttachment("unemployment-x.csv").csv()).map(d => [d.id, +d.rate]))
)}

function _5(md){return(
md`The geometries used in this example are from the [TopoJSON U.S. Atlas](https://github.com/topojson/us-atlas), which are derived from the U.S. Census Bureau shapefiles, 2017 edition. (There’s also the [TopoJSON World Atlas](https://github.com/topojson/world-atlas), which is derived from [Natural Earth](https://www.naturalearthdata.com).) The *counties* feature collection is all U.S. counties, using the five-digit FIPS identifier. The *statemap* lets us lookup the name of the state that contains a given county; a state’s two-digit identifier corresponds to the first two digits of its counties’ identifiers.`
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties)
)}

function _states(topojson,us){return(
topojson.feature(us, us.objects.states)
)}

function _statemap(states){return(
new Map(states.features.map(d => [d.id, d]))
)}

function _10(md){return(
md`The *statemesh* is just the internal borders between states, *i.e.*, everything but the coastlines and country borders. This avoids an additional stroke on the perimeter of the map, which would otherwise mask intricate features such as islands and inlets. (Try removing the last argument to topojson.mesh below to see the effect.)`
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states, (a, b) => a !== b)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["unemployment-x.csv", {url: "https://static.observableusercontent.com/files/1620fc155f28822d9d68088ea0cccf54bbe9feb8d8c82115d496e5796d4b093bf27cd6ae93ae7241a2a481a29180d382f63fd41194cec619761704f56599e94a", mimeType: "text/csv"}],
    ["counties-albers-10m.json", {url: "https://static.observableusercontent.com/files/1ec3edc43ba66c0db419744c479d1b5118bb405587189f3ad739a10853f6f933d86824e809f4b4ad18053ab33fb5dc7c5f3d6bc601654c8ea976afd5b321f517", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","counties","unemployment","statemap","states"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("unemployment")).define("unemployment", ["FileAttachment"], _unemployment);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  main.variable(observer("states")).define("states", ["topojson","us"], _states);
  main.variable(observer("statemap")).define("statemap", ["states"], _statemap);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-bivariate-choropleth"] = { code: "labels = [\"low\", \"\", \"high\"]\n\nlabel = i => labels[i] ? ` (${labels[i]})` : \"\"\n\ndata = FileAttachment(\"cdc_diabetes_obesity_2020.csv\").csv()\n  .then((data) => {\n    data.forEach((d) => {\n      d.obesity = +d.obesity; // type as numeric\n      d.diabetes = +d.diabetes;\n    });\n    return data;\n  })\n\ndiabetes_thresholds = d3.scaleQuantile(data.map(d => d.diabetes), [0, 1, 2]).quantiles()\n\nobesity_thresholds = d3.scaleQuantile(data.map(d => d.obesity), [0, 1, 2]).quantiles()\n\nscheme = [\"#e8e8e8\",\"#ace4e4\",\"#5ac8c8\",\"#dfb0d6\",\"#a5add3\",\"#5698b9\",\"#be64ac\",\"#8c62aa\",\"#3b4994\"]\n\nus = FileAttachment(\"counties-albers-10m.json\").json()\n\nstates = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Bivariate choropleth</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Bivariate choropleth

Diabetes and obesity prevalence by county, 2020. Colors: [Joshua Stevens](http://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/). Data: [CDC](https://gis.cdc.gov/grasp/diabetes/diabetesatlas-surveillance.html). For details on the data and the method, read our [tutorial](https://observablehq.com/@observablehq/plot-bivariate-choropleth-explained). See also the [D3 version](/@d3/bivariate-choropleth).`
)}

function _chart(Plot,scheme,d3,label,data,topojson,us,bivariateClass,states,svg)
{
  const legend = Plot.plot({
    color: {
      range: scheme,
      transform: ([a, b]) => 3 * a + b,
      unknown: "#ccc" // See Valdez-Cordova, Alaska
    },
    axis: null,
    margin: 0,
    inset: 18,
    width: 106,
    height: 106,
    style: "overflow: visible;",
    marks: [
      Plot.dot(d3.cross([0, 1, 2], [0, 1, 2]), {
        x: ([a, b]) => b - a,
        y: ([a, b]) => b + a,
        symbol: "square",
        rotate: 45,
        r: 14,
        fill: (d) => d,
        title: ([a, b]) => `Diabetes${label(a)}\nObesity${label(b)}`,
        tip: true
      }),
      Plot.text(["Obesity →"], {
        frameAnchor: "right",
        fontWeight: "bold",
        rotate: -45,
        dy: 10
      }),
      Plot.text(["← Diabetes"], {
        frameAnchor: "left",
        fontWeight: "bold",
        rotate: 45,
        dy: 10
      })
    ]
  });

  const color = legend.scale("color");
  const index = new Map(data.map(({ county, ...rest }) => [county, rest]));
  return Plot.plot({
    width: 975,
    height: 610,
    projection: "identity",
    color,
    marks: [
      Plot.geo(
        topojson.feature(us, us.objects.counties),
        Plot.centroid({
          stroke: "white",
          strokeWidth: 0.125,
          fill: (d) => bivariateClass(index.get(d.id)),
          title: (d) => {
            const name = `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}`;
            const value = index.get(d.id);
            if (!value || (isNaN(value.diabetes) && isNaN(value.obesity)))
              return `${name}\nno data`;
            const [dc, oc] = bivariateClass(value);
            return `${name}\n${
              isNaN(value.diabetes) ? "No Data" : value.diabetes
            }% Diabetes${label(dc)}\n${
              isNaN(value.obesity) ? "No Data" : value.obesity
            }% Obesity${label(oc)}`;
          },
          tip: true
        })
      ),
      Plot.geo(topojson.mesh(us, us.objects.states, (a, b) => a !== b), {stroke: "white"}),
      () => svg`<g transform="translate(835,410)">${legend}`
    ],
    style: "overflow: visible;"
  });
}


function _labels(){return(
["low", "", "high"]
)}

function _label(labels){return(
i => labels[i] ? ` (${labels[i]})` : ""
)}

function _data(FileAttachment){return(
FileAttachment("cdc_diabetes_obesity_2020.csv").csv()
  .then((data) => {
    data.forEach((d) => {
      d.obesity = +d.obesity; // type as numeric
      d.diabetes = +d.diabetes;
    });
    return data;
  })
)}

function _diabetes_thresholds(d3,data){return(
d3.scaleQuantile(data.map(d => d.diabetes), [0, 1, 2]).quantiles()
)}

function _obesity_thresholds(d3,data){return(
d3.scaleQuantile(data.map(d => d.obesity), [0, 1, 2]).quantiles()
)}

function _bivariateClass(diabetes_thresholds,obesity_thresholds)
{
  const d = diabetes_thresholds;
  const o = obesity_thresholds;
  return (value) => {
    const { diabetes: a, obesity: b } = value;
    return [
      isNaN(a) ? a : +(a > d[0]) + (a > d[1]),
      isNaN(b) ? b : +(b > o[0]) + (b > o[1])
    ];
  };
}


function _scheme(){return(
["#e8e8e8","#ace4e4","#5ac8c8","#dfb0d6","#a5add3","#5698b9","#be64ac","#8c62aa","#3b4994"]
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)}

function _states(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["cdc_diabetes_obesity_2020.csv", {url: "https://static.observableusercontent.com/files/85cd1742bcef2c42ca4a117fb91627fc9df397f34399898dee65f3a90232edf24fb6348be342ee0216e0a6880bded77a0062a0223d5d96b60ddcffcf210532c6", mimeType: "text/csv"}],
    ["counties-albers-10m.json", {url: "https://static.observableusercontent.com/files/1ec3edc43ba66c0db419744c479d1b5118bb405587189f3ad739a10853f6f933d86824e809f4b4ad18053ab33fb5dc7c5f3d6bc601654c8ea976afd5b321f517", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["Plot","scheme","d3","label","data","topojson","us","bivariateClass","states","svg"], _chart);
  main.variable(observer("labels")).define("labels", _labels);
  main.variable(observer("label")).define("label", ["labels"], _label);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("diabetes_thresholds")).define("diabetes_thresholds", ["d3","data"], _diabetes_thresholds);
  main.variable(observer("obesity_thresholds")).define("obesity_thresholds", ["d3","data"], _obesity_thresholds);
  main.variable(observer("bivariateClass")).define("bivariateClass", ["diabetes_thresholds","obesity_thresholds"], _bivariateClass);
  main.variable(observer("scheme")).define("scheme", _scheme);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("states")).define("states", ["us"], _states);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-geotiff-contours"] = { code: "Plot.plot({\n  width,\n  projection: \"equal-earth\",\n  color: { scheme: \"Magma\" },\n  marks: [\n    Plot.contour(values, {\n      x: (_, i) => i % n / 2,\n      y: (_, i) => 90 - Math.floor(i / n) / 2,\n      fill: values,\n      thresholds: 30,\n      stroke: \"#000\",\n      strokeWidth: 0.25,\n      clip: \"sphere\"\n    }),\n    Plot.sphere()\n  ]\n})\n\nGeoTIFF = import(\"https://esm.sh/geotiff@2\")\n\ntiff = FileAttachment(\"sfctmp.tiff\").arrayBuffer().then(GeoTIFF.fromArrayBuffer)\n\nimage = tiff.getImage()\n\nn = image.getWidth()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: GeoTIFF contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# GeoTIFF contours`
)}

function _2(Plot,width,values,n){return(
Plot.plot({
  width,
  projection: "equal-earth",
  color: { scheme: "Magma" },
  marks: [
    Plot.contour(values, {
      x: (_, i) => i % n / 2,
      y: (_, i) => 90 - Math.floor(i / n) / 2,
      fill: values,
      thresholds: 30,
      stroke: "#000",
      strokeWidth: 0.25,
      clip: "sphere"
    }),
    Plot.sphere()
  ]
})
)}

function _GeoTIFF(){return(
import("https://esm.sh/geotiff@2")
)}

function _tiff(FileAttachment,GeoTIFF){return(
FileAttachment("sfctmp.tiff").arrayBuffer().then(GeoTIFF.fromArrayBuffer)
)}

function _image(tiff){return(
tiff.getImage()
)}

function _n(image){return(
image.getWidth()
)}

async function _values(image){return(
(await image.readRasters())[0]
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["sfctmp.tiff", {url: "https://static.observableusercontent.com/files/66e5d2e54a2e83bdc462ec5f976d7f1d401c8ee79a8f7b5c5f5c9a8b16887243941fefba27142905ffc23eb1a786cd22864e184c96077636138099ab325f5b6b", mimeType: "image/tiff"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","width","values","n"], _2);
  main.variable(observer("GeoTIFF")).define("GeoTIFF", _GeoTIFF);
  main.variable(observer("tiff")).define("tiff", ["FileAttachment","GeoTIFF"], _tiff);
  main.variable(observer("image")).define("image", ["tiff"], _image);
  main.variable(observer("n")).define("n", ["image"], _n);
  main.variable(observer("values")).define("values", ["image"], _values);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-finite-state-machine"] = { code: "Plot.plot({\n  inset: 60,\n  aspectRatio: 1,\n  axis: null,\n  marks: [\n    Plot.dot(nodes, {r: 40}),\n    Plot.arrow(edges, {\n      x1: ([[x1]]) => x1,\n      y1: ([[, y1]]) => y1,\n      x2: ([, [x2]]) => x2,\n      y2: ([, [, y2]]) => y2,\n      bend: true,\n      strokeWidth: ([,, value]) => value,\n      strokeLinejoin: \"miter\",\n      headLength: 24,\n      inset: 48\n    }),\n    Plot.text(nodes, {text: [\"A\", \"B\", \"C\"], dy: 12}),\n    Plot.text(edges, {\n      x: ([[x1, y1], [x2, y2]]) => (x1 + x2) / 2 + (y1 - y2) * 0.15,\n      y: ([[x1, y1], [x2, y2]]) => (y1 + y2) / 2 - (x1 - x2) * 0.15,\n      text: ([,, value]) => value\n    })\n  ]\n})\n\nmatrix = [[3, 2, 5], [1, 7, 2], [1, 1, 8]]\n\nnodes = matrix.map((m, i) => d3.pointRadial(((2 - i) * 2 * Math.PI) / matrix.length, 100))\n\nedges = matrix.flatMap((m, i) => m.map((value, j) => ([nodes[i], nodes[j], value])))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Finite state machine</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Finite state machine

The [arrow](https://observablehq.com/plot/marks/arrow) mark connects machine states.`
)}

function _2(Plot,nodes,edges){return(
Plot.plot({
  inset: 60,
  aspectRatio: 1,
  axis: null,
  marks: [
    Plot.dot(nodes, {r: 40}),
    Plot.arrow(edges, {
      x1: ([[x1]]) => x1,
      y1: ([[, y1]]) => y1,
      x2: ([, [x2]]) => x2,
      y2: ([, [, y2]]) => y2,
      bend: true,
      strokeWidth: ([,, value]) => value,
      strokeLinejoin: "miter",
      headLength: 24,
      inset: 48
    }),
    Plot.text(nodes, {text: ["A", "B", "C"], dy: 12}),
    Plot.text(edges, {
      x: ([[x1, y1], [x2, y2]]) => (x1 + x2) / 2 + (y1 - y2) * 0.15,
      y: ([[x1, y1], [x2, y2]]) => (y1 + y2) / 2 - (x1 - x2) * 0.15,
      text: ([,, value]) => value
    })
  ]
})
)}

function _matrix(){return(
[[3, 2, 5], [1, 7, 2], [1, 1, 8]]
)}

function _nodes(matrix,d3){return(
matrix.map((m, i) => d3.pointRadial(((2 - i) * 2 * Math.PI) / matrix.length, 100))
)}

function _edges(matrix,nodes){return(
matrix.flatMap((m, i) => m.map((value, j) => ([nodes[i], nodes[j], value])))
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","nodes","edges"], _2);
  main.variable(observer("matrix")).define("matrix", _matrix);
  main.variable(observer("nodes")).define("nodes", ["matrix","d3"], _nodes);
  main.variable(observer("edges")).define("edges", ["matrix","nodes"], _edges);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-arc-diagram"] = { code: "Plot.plot({\n  height: 1080,\n  marginLeft: 100,\n  axis: null,\n  x: {domain: [0, 1]}, // see https://github.com/observablehq/plot/issues/1541\n  color: {domain: d3.range(10), unknown: \"#ccc\"},\n  marks: [\n    Plot.dot(miserables.nodes, {x: 0, y: \"id\", fill: \"group\", sort: {y: \"fill\"}}),\n    Plot.text(miserables.nodes, {x: 0, y: \"id\", text: \"id\", textAnchor: \"end\", dx: -6, fill: \"group\"}),\n    Plot.arrow(miserables.links, {x: 0, y1: \"source\", y2: \"target\", sweep: \"-y\", bend: 90, headLength: 0, stroke: samegroup, sort: samegroup, reverse: true})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Arc diagram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Arc diagram

This diagram places nodes in a vertical line with circular arcs for links. Unlike other network visualizations such as a [force layout](/@d3/force-directed-graph), the appearance (and usefulness) of an arc diagram is highly dependent on the order of nodes.`
)}

function _2(Plot,d3,miserables,samegroup){return(
Plot.plot({
  height: 1080,
  marginLeft: 100,
  axis: null,
  x: {domain: [0, 1]}, // see https://github.com/observablehq/plot/issues/1541
  color: {domain: d3.range(10), unknown: "#ccc"},
  marks: [
    Plot.dot(miserables.nodes, {x: 0, y: "id", fill: "group", sort: {y: "fill"}}),
    Plot.text(miserables.nodes, {x: 0, y: "id", text: "id", textAnchor: "end", dx: -6, fill: "group"}),
    Plot.arrow(miserables.links, {x: 0, y1: "source", y2: "target", sweep: "-y", bend: 90, headLength: 0, stroke: samegroup, sort: samegroup, reverse: true})
  ]
})
)}

function _samegroup(miserables)
{
  const groups = new Map(miserables.nodes.map((d) => [d.id, d.group]));
  return ({source, target}) => {
    source = groups.get(source);
    target = groups.get(target);
    return source === target ? source : null;
  };
}


function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","miserables","samegroup"], _2);
  main.variable(observer("samegroup")).define("samegroup", ["miserables"], _samegroup);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-arrow-variation-chart"] = { code: "Plot.plot({\n  grid: true,\n  inset: 10,\n  x: {\n    type: \"log\",\n    label: \"Population →\"\n  },\n  y: {\n    label: \"↑ Inequality\",\n    ticks: 4\n  },\n  color: {\n    scheme: \"BuRd\",\n    label: \"Change in inequality from 1980 to 2015\",\n    legend: true,\n    tickFormat: \"+f\"\n  },\n  marks: [\n    Plot.arrow(metros, {\n      x1: \"POP_1980\",\n      y1: \"R90_10_1980\",\n      x2: \"POP_2015\",\n      y2: \"R90_10_2015\",\n      bend: true,\n      stroke: (d) => d.R90_10_2015 - d.R90_10_1980\n    }),\n    Plot.text(metros, {\n      x: \"POP_2015\",\n      y: \"R90_10_2015\",\n      filter: \"highlight\",\n      text: \"nyt_display\",\n      fill: \"currentColor\",\n      stroke: \"white\",\n      dy: -6\n    })\n  ]\n})\n\nmetros = FileAttachment(\"metros.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Arrow variation chart</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Arrow variation chart

An [arrow](https://observablehq.com/plot/marks/arrow) connects the positions in 1980 and 2015 of each city on this population &times; inequality chart. Color [encodes](https://observablehq.com/plot/features/scales) variation. Based on an earlier [D3 example](https://observablehq.com/@d3/inequality-in-american-cities), which is based on work by [Emily Badger and Kevin Quealy](https://www.nytimes.com/2019/12/02/upshot/wealth-poverty-divide-american-cities.html).`
)}

function _2(Plot,metros){return(
Plot.plot({
  grid: true,
  inset: 10,
  x: {
    type: "log",
    label: "Population →"
  },
  y: {
    label: "↑ Inequality",
    ticks: 4
  },
  color: {
    scheme: "BuRd",
    label: "Change in inequality from 1980 to 2015",
    legend: true,
    tickFormat: "+f"
  },
  marks: [
    Plot.arrow(metros, {
      x1: "POP_1980",
      y1: "R90_10_1980",
      x2: "POP_2015",
      y2: "R90_10_2015",
      bend: true,
      stroke: (d) => d.R90_10_2015 - d.R90_10_1980
    }),
    Plot.text(metros, {
      x: "POP_2015",
      y: "R90_10_2015",
      filter: "highlight",
      text: "nyt_display",
      fill: "currentColor",
      stroke: "white",
      dy: -6
    })
  ]
})
)}

function _metros(FileAttachment){return(
FileAttachment("metros.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["metros.csv", {url: "https://static.observableusercontent.com/files/908397e29debb9123dba8617429cc1ba3217f766dc7fca854a4b03a8fb00d44351a9d822e5cdda8ec273344683ecd6399b6b5169af27664d05b091516974069b", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","metros"], _2);
  main.variable(observer("metros")).define("metros", ["FileAttachment"], _metros);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-difference-arrows"] = { code: "Plot.plot({\n  marginTop: 0,\n  marginLeft: 100,\n  y: {grid: true, label: null},\n  color: {\n    type: \"categorical\",\n    domain: [-1, 1],\n    unknown: \"#aaa\",\n    transform: Math.sign,\n    tickFormat: (c) => c < 0 ? \"female\" : \"male\",\n    legend: true\n  },\n  marks: [\n    Plot.ruleX([0]),\n    Plot.link(\n      olympians,\n      Plot.groupY(\n        {\n          x1: (D) => d3.sum(D, (d) => d === \"female\"),\n          x2: (D) => d3.sum(D, (d) => d === \"male\"),\n          stroke: (D) => d3.sum(D, (d) => d === \"male\") - d3.sum(D, (d) => d === \"female\")\n        },\n        {\n          y: \"sport\",\n          x1: \"sex\",\n          x2: \"sex\",\n          markerStart: \"dot\",\n          markerEnd: \"arrow\",\n          sort: {y: \"x2\"},\n          stroke: \"sex\",\n          strokeWidth: 2\n        }\n      )\n    )\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Difference arrows</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Difference arrows

The chart plots the difference between the number of male and female Olympic athletes by sport. Sports with more men are right-pointing orange [arrows](https://observablehq.com/plot/marks/arrow), while sports with more women (only gymnastics and fencing) are left-pointing blue arrows.`
)}

function _2(Plot,olympians,d3){return(
Plot.plot({
  marginTop: 0,
  marginLeft: 100,
  y: {grid: true, label: null},
  color: {
    type: "categorical",
    domain: [-1, 1],
    unknown: "#aaa",
    transform: Math.sign,
    tickFormat: (c) => c < 0 ? "female" : "male",
    legend: true
  },
  marks: [
    Plot.ruleX([0]),
    Plot.link(
      olympians,
      Plot.groupY(
        {
          x1: (D) => d3.sum(D, (d) => d === "female"),
          x2: (D) => d3.sum(D, (d) => d === "male"),
          stroke: (D) => d3.sum(D, (d) => d === "male") - d3.sum(D, (d) => d === "female")
        },
        {
          y: "sport",
          x1: "sex",
          x2: "sex",
          markerStart: "dot",
          markerEnd: "arrow",
          sort: {y: "x2"},
          stroke: "sex",
          strokeWidth: 2
        }
      )
    )
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians","d3"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-trellis-anomaly"] = { code: "Plot.plot({\n  height: 800,\n  marginLeft: 110,\n  grid: true,\n  x: {nice: true},\n  y: {inset: 5},\n  color: {scheme: \"spectral\", label: \"Change in yield\", tickFormat: \"+f\", legend: true},\n  facet: {marginRight: 90},\n  marks: [\n    Plot.frame(),\n    Plot.arrow(barley, Plot.groupY({\n      x1: \"first\",\n      x2: \"last\",\n      stroke: ([x1, x2]) => x2 - x1 // year-over-year difference\n    }, {\n      x: \"yield\",\n      y: \"variety\",\n      fy: \"site\",\n      stroke: \"yield\",\n      strokeWidth: 2,\n      sort: {y: \"x1\", fy: \"x1\", reduce: \"median\", reverse: true}\n    }))\n  ]\n})\n\nbarley = FileAttachment(\"barley.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Barley Trellis plot with arrows</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Barley Trellis plot with arrows

See the [Trellis display](https://observablehq.com/@observablehq/plot-barley-trellis) notebook for more context. Here the variation is shown as an [arrow](https://observablehq.com/plot/marks/arrow) and is used to sort the [facets](https://observablehq.com/plot/features/facets), strongly emphasizing the direction of the change in yield.`
)}

function _2(Plot,barley){return(
Plot.plot({
  height: 800,
  marginLeft: 110,
  grid: true,
  x: {nice: true},
  y: {inset: 5},
  color: {scheme: "spectral", label: "Change in yield", tickFormat: "+f", legend: true},
  facet: {marginRight: 90},
  marks: [
    Plot.frame(),
    Plot.arrow(barley, Plot.groupY({
      x1: "first",
      x2: "last",
      stroke: ([x1, x2]) => x2 - x1 // year-over-year difference
    }, {
      x: "yield",
      y: "variety",
      fy: "site",
      stroke: "yield",
      strokeWidth: 2,
      sort: {y: "x1", fy: "x1", reduce: "median", reverse: true}
    }))
  ]
})
)}

function _barley(FileAttachment){return(
FileAttachment("barley.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["barley.csv", {url: "https://static.observableusercontent.com/files/321ca5ed58d2cdc77d5e89a9faed844e15d248a421694da394c5e20eb19241e035ed985c769f212bd531072e89282741bd940c702890c112e86d785d17aa0350", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","barley"], _2);
  main.variable(observer("barley")).define("barley", ["FileAttachment"], _barley);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-phases-of-the-moon"] = { code: "year = Inputs.number({\n  label: \"Year\",\n  value: +new URLSearchParams(new URL(document.baseURI).search).get(\"year\") || new Date().getUTCFullYear(),\n  min: 1900,\n  max: 2100,\n  step: 1\n})\n\nlocale = Inputs.text({\n  label: \"Locale\",\n  value: \"en-US\",\n  validate(input) {\n    try { (new Date).toLocaleString(input.value); }\n    catch { return false; }\n    return true;\n  }\n})\n\nPlot.plot({\n  aspectRatio: 0.6,\n  marginLeft: 90,\n  width: 1152,\n  style: `\n    margin: 0 -14px;\n    background: #111;\n    color: #fff;\n    max-width: none;\n    text-transform: uppercase;\n    width: calc(100% + 28px);\n  `,\n  x: {domain: d3.range(1, 40), axis: null}, // day of month, aligned by day of week\n  y: {domain: d3.range(12)}, // month of year\n  length: {type: \"identity\"}, // overloading meaning as lunar phase angle!\n  marks: (({data, x, y, r, hemisphere, projection}) => [\n    Plot.axisY({textAnchor: \"start\", tickFormat: Plot.formatMonth(locale, \"long\"), tickSize: 0, dx: -50}),\n    Plot.dot(data, {x, y, r, fill: \"#333\"}),\n    Plot.text(data, {x, y, r, text: (d) => d.getUTCDate(), dy: -r - 5, fontSize: 7}),\n    Plot.vector(data, {\n      x,\n      y,\n      length(d) {\n        const noon = d3.utcHour.offset(d, 12);\n        const illum = suncalc.getMoonIllumination(noon);\n        return 180 - illum.phase * 360;\n      },\n      shape: {\n        draw(context, length) {\n          projection.rotate([length, 0]).scale(r);\n          const path = d3.geoPath(projection, context);\n          path(hemisphere);\n        }\n      },\n      anchor: \"start\", // disable default translate along length\n      fill: \"currentColor\"\n    })\n  ])({\n    data: (() => {\n      const start = d3.utcYear(Date.UTC(year, 0, 1));\n      return d3.utcDays(start, d3.utcYear.offset(start));\n    })(),\n    x(d) {\n      const start = d3.utcMonth(d);\n      const offset = start.getUTCDay() || 7;\n      return d.getUTCDate() + offset;\n    },\n    y(d) {\n      return d.getUTCMonth();\n    },\n    r: 12,\n    hemisphere: d3.geoCircle()(),\n    projection: d3.geoOrthographic().translate([0, 0])\n  })\n})", imports: [], define: (function(){
function _1(year,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Phases of the Moon</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Phases of the Moon

For the year ${year}, in the style of [Irwin Glusker](https://www.moma.org/explore/inside_out/2012/10/16/a-paean-to-the-phases-of-the-moon/).`
)}

function _year(Inputs,URLSearchParams){return(
Inputs.number({
  label: "Year",
  value: +new URLSearchParams(new URL(document.baseURI).search).get("year") || new Date().getUTCFullYear(),
  min: 1900,
  max: 2100,
  step: 1
})
)}

function _locale(Inputs){return(
Inputs.text({
  label: "Locale",
  value: "en-US",
  validate(input) {
    try { (new Date).toLocaleString(input.value); }
    catch { return false; }
    return true;
  }
})
)}

function _4(Plot,d3,locale,suncalc,year){return(
Plot.plot({
  aspectRatio: 0.6,
  marginLeft: 90,
  width: 1152,
  style: `
    margin: 0 -14px;
    background: #111;
    color: #fff;
    max-width: none;
    text-transform: uppercase;
    width: calc(100% + 28px);
  `,
  x: {domain: d3.range(1, 40), axis: null}, // day of month, aligned by day of week
  y: {domain: d3.range(12)}, // month of year
  length: {type: "identity"}, // overloading meaning as lunar phase angle!
  marks: (({data, x, y, r, hemisphere, projection}) => [
    Plot.axisY({textAnchor: "start", tickFormat: Plot.formatMonth(locale, "long"), tickSize: 0, dx: -50}),
    Plot.dot(data, {x, y, r, fill: "#333"}),
    Plot.text(data, {x, y, r, text: (d) => d.getUTCDate(), dy: -r - 5, fontSize: 7}),
    Plot.vector(data, {
      x,
      y,
      length(d) {
        const noon = d3.utcHour.offset(d, 12);
        const illum = suncalc.getMoonIllumination(noon);
        return 180 - illum.phase * 360;
      },
      shape: {
        draw(context, length) {
          projection.rotate([length, 0]).scale(r);
          const path = d3.geoPath(projection, context);
          path(hemisphere);
        }
      },
      anchor: "start", // disable default translate along length
      fill: "currentColor"
    })
  ])({
    data: (() => {
      const start = d3.utcYear(Date.UTC(year, 0, 1));
      return d3.utcDays(start, d3.utcYear.offset(start));
    })(),
    x(d) {
      const start = d3.utcMonth(d);
      const offset = start.getUTCDay() || 7;
      return d.getUTCDate() + offset;
    },
    y(d) {
      return d.getUTCMonth();
    },
    r: 12,
    hemisphere: d3.geoCircle()(),
    projection: d3.geoOrthographic().translate([0, 0])
  })
})
)}

function _5(md){return(
md`Above, to specify a custom [vector shape](https://observablehq.com/plot/marks/vector#vector-options), I’m using an [immediately-invoked function expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) so that I can share a few local variables (\`data\`, \`x\`, \`y\`, \`r\`, *etc.*). A more conventional style would declare them as local variables before calling Plot.plot, say using \`const\`, but I wanted to declare them within.`
)}

async function _suncalc(){return(
(await import("https://cdn.jsdelivr.net/npm/suncalc@1/+esm")).default
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["year","md"], _1);
  main.variable(observer("viewof year")).define("viewof year", ["Inputs","URLSearchParams"], _year);
  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));
  main.variable(observer("viewof locale")).define("viewof locale", ["Inputs"], _locale);
  main.variable(observer("locale")).define("locale", ["Generators", "viewof locale"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","d3","locale","suncalc","year"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("suncalc")).define("suncalc", _suncalc);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-spike"] = { code: "map = Plot.plot({\n  projection: \"identity\",\n  width: 975,\n  length: { range: [0, 200] },\n  marks: [\n    Plot.geo(nation, { fill: \"#e0e0e0\" }),\n    Plot.geo(statemesh, { stroke: \"white\" }),\n    Plot.spike(counties.features, Plot.centroid({ stroke: \"red\", length: (d) => population.get(d.id) })),\n    legendSpike([2e6, 4e6, 6e6, 8e6, 10e6], {stroke: \"red\"})\n  ]\n})\n\nlegendSpike = function legendSpike(values, {frameAnchor = \"bottom-right\", format = \"~s\", stroke} = {}) {\n  if (!Array.isArray(values)) values = Array.from(values);\n  if (typeof format !== \"function\") format = d3.format(format);\n  return Plot.marks(\n    values.map((v, i) => {\n      const dx = (i - values.length) * 18;\n      return [\n        Plot.spike([v], {\n          length: [v],\n          dx,\n          dy: -20,\n          frameAnchor,\n          stroke\n        }),\n        Plot.text([v], {\n          text: [format(v)],\n          dx,\n          dy: -10,\n          frameAnchor,\n          textAnchor: \"middle\"\n        })\n      ];\n    })\n  );\n}\n\npopulation = FileAttachment(\"population.csv\").csv()\n  .then((data) => new Map(data.map(({state, county, population}) => [`${state}${county}`, +population])))\n\nus = FileAttachment(\"counties-albers-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\nstatemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))\n\ncounties = topojson.feature(us, us.objects.counties)\n\nstatemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Spike map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Spike map

The [spike](https://observablehq.com/plot/marks/vector#spike-data-options) mark is a vector with default values that allows us to quickly create this map of the estimated US population by county in 2016. Data: [American Community Survey](https://api.census.gov/data/2016/acs/acs5/cprofile/examples.html)`
)}

function _map(Plot,nation,statemesh,counties,population,legendSpike){return(
Plot.plot({
  projection: "identity",
  width: 975,
  length: { range: [0, 200] },
  marks: [
    Plot.geo(nation, { fill: "#e0e0e0" }),
    Plot.geo(statemesh, { stroke: "white" }),
    Plot.spike(counties.features, Plot.centroid({ stroke: "red", length: (d) => population.get(d.id) })),
    legendSpike([2e6, 4e6, 6e6, 8e6, 10e6], {stroke: "red"})
  ]
})
)}

function _3(md){return(
md`This custom legendSpike composite mark draws the legend on the right-hand side:`
)}

function _legendSpike(d3,Plot){return(
function legendSpike(values, {frameAnchor = "bottom-right", format = "~s", stroke} = {}) {
  if (!Array.isArray(values)) values = Array.from(values);
  if (typeof format !== "function") format = d3.format(format);
  return Plot.marks(
    values.map((v, i) => {
      const dx = (i - values.length) * 18;
      return [
        Plot.spike([v], {
          length: [v],
          dx,
          dy: -20,
          frameAnchor,
          stroke
        }),
        Plot.text([v], {
          text: [format(v)],
          dx,
          dy: -10,
          frameAnchor,
          textAnchor: "middle"
        })
      ];
    })
  );
}
)}

function _5(md){return(
md`We get the population data from a CSV file; we process it into a JavaScript Map for fast lookups. The key is the FIPS code (state and county codes, concatenated into a string), and value is the population coerced to a number.`
)}

function _population(FileAttachment){return(
FileAttachment("population.csv").csv()
  .then((data) => new Map(data.map(({state, county, population}) => [`${state}${county}`, +population])))
)}

function _7(md){return(
md`The dataset doesn’t include the positions of the counties, so we call Plot’s _centroid_ helper method to derive centroids from the GeoJSON features.`
)}

function _8(md){return(
md`The geometries used in this example are from the [TopoJSON U.S. Atlas](https://github.com/topojson/us-atlas), which are derived from the U.S. Census Bureau shapefiles. (There’s also the [TopoJSON World Atlas](https://github.com/topojson/world-atlas), which is derived from [Natural Earth](https://www.naturalearthdata.com).) The *counties* feature collection is all U.S. counties, using the five-digit FIPS identifier. The *statemap* lets us look up the name of the state that contains a given county; a state’s two-digit identifier corresponds to the first two digits of its counties’ identifiers. Since the shapes have already been projected to screen coordinates, we use the _identity_ projection.`
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemap(topojson,us){return(
new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]))
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties)
)}

function _13(md){return(
md`The _statemesh_ contains the internal borders between states, _i.e._, everything but the coastlines and country borders. This avoids an additional stroke on the perimeter of the map, which would otherwise mask intricate features such as islands and inlets.`
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states, (a, b) => a !== b)
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["population.csv", {url: "https://static.observableusercontent.com/files/4c1c67eb1892eb7cd0d96b741892ef88913f754330f7ed0171bd9ccd42014e945f199cb9537f55b4db5e2e0d10ea91e2226609af8bb7f03cadaa2ca328f9dc86", mimeType: "text/csv"}],
    ["counties-albers-10m.json", {url: "https://static.observableusercontent.com/files/50848f0dd4d2d9c84821adba90ca625cb2815694117bbb7b6ae393e788aae9d85f19a6c73d60d642bb04e2f95b87993e8c7312d4d4da6a1431c58460f5ad6c63", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("map")).define("map", ["Plot","nation","statemesh","counties","population","legendSpike"], _map);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("legendSpike")).define("legendSpike", ["d3","Plot"], _legendSpike);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("population")).define("population", ["FileAttachment"], _population);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemap")).define("statemap", ["topojson","us"], _statemap);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-wind-map"] = { code: "Plot.plot({\n  inset: 10,\n  aspectRatio: 1,\n  color: {\n    label: \"Speed (m/s)\",\n    zero: true,\n    legend: true\n  },\n  marks: [\n    Plot.vector(wind, {\n      x: \"longitude\",\n      y: \"latitude\",\n      rotate: ({u, v}) => Math.atan2(u, v) * 180 / Math.PI,\n      length: ({u, v}) => Math.hypot(u, v),\n      stroke: ({u, v}) => Math.hypot(u, v)\n    })\n  ]\n})\n\nwind = FileAttachment(\"wind.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Wind map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Wind map

[Vectors](https://observablehq.com/plot/marks/vector) on a grid can show both direction and intensity—in this case, the speed of winds.`
)}

function _2(Plot,wind){return(
Plot.plot({
  inset: 10,
  aspectRatio: 1,
  color: {
    label: "Speed (m/s)",
    zero: true,
    legend: true
  },
  marks: [
    Plot.vector(wind, {
      x: "longitude",
      y: "latitude",
      rotate: ({u, v}) => Math.atan2(u, v) * 180 / Math.PI,
      length: ({u, v}) => Math.hypot(u, v),
      stroke: ({u, v}) => Math.hypot(u, v)
    })
  ]
})
)}

function _wind(FileAttachment){return(
FileAttachment("wind.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["wind.csv", {url: "https://static.observableusercontent.com/files/d90680aa9bed329b7fa2cdba0c42cfa66fb5ddd1a3f2628752570544ae9229ef21ef55e7d7cb8f230303f4f029830891c4b576b4651433929aaf873a1e9aaaf9", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","wind"], _2);
  main.variable(observer("wind")).define("wind", ["FileAttachment"], _wind);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-election-wind-map"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  length: {type: \"sqrt\", transform: Math.abs},\n  marks: [\n    Plot.geo(statemesh, {strokeWidth: 0.5}),\n    Plot.geo(nation),\n    Plot.vector(\n      counties,\n      Plot.centroid({\n        anchor: \"start\",\n        length: (d) => d.properties.margin2020 * d.properties.votes,\n        stroke: (d) => d.properties.margin2020 > 0 ? \"red\" : \"blue\",\n        rotate: (d) => d.properties.margin2020 > 0 ? 60 : -60\n      })\n    )\n  ]\n})\n\nstatemesh = topojson.mesh(us, us.objects.states)\n\nnation = topojson.feature(us, us.objects.nation)\n\nelection = FileAttachment(\"us-presidential-election-2020.csv\").csv()\n\nus = FileAttachment(\"us-counties-10m.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Election wind map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Election wind map

A map where the margin by which the winner of the US presidential election of 2020 won the vote in each county is represented as a non-gridded [wind map](https://observablehq.com/@observablehq/plot-wind-map). The length of the [vector](https://observablehq.com/plot/marks/vector) encodes the difference in votes for the Democratic candidate <svg width=12 height=12 viewBox="-11 -11 12 12" style="display: inline-block"><path d="M0,0l-10,-6m1,3.28l-1,-3.28l3.28,-1" stroke="blue" stroke-width="1.5"></path></svg> vs the Republican candidate <svg width=12 height=12 viewBox="0 -11 12 12" style="display: inline-block"><path d="M0,0l10,-6m-1,3.28l1,-3.28l-3.28,-1" stroke="red" stroke-width="1.5"></path></svg>, with color and direction both showing who won.`
)}

function _2(Plot,statemesh,nation,counties){return(
Plot.plot({
  projection: "albers-usa",
  length: {type: "sqrt", transform: Math.abs},
  marks: [
    Plot.geo(statemesh, {strokeWidth: 0.5}),
    Plot.geo(nation),
    Plot.vector(
      counties,
      Plot.centroid({
        anchor: "start",
        length: (d) => d.properties.margin2020 * d.properties.votes,
        stroke: (d) => d.properties.margin2020 > 0 ? "red" : "blue",
        rotate: (d) => d.properties.margin2020 > 0 ? 60 : -60
      })
    )
  ]
})
)}

function _counties(topojson,us,election)
{
  const counties = topojson.feature(us, us.objects.counties).features;
  const _election = new Map(election.map((d) => [d.fips, d]));
  counties.forEach(county => {
    county.properties.margin2020 = +_election.get(county.id)?.margin2020;
    county.properties.votes = +_election.get(county.id)?.votes;
  });
  return counties;
}


function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _election(FileAttachment){return(
FileAttachment("us-presidential-election-2020.csv").csv()
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}],
    ["us-presidential-election-2020.csv", {url: "https://static.observableusercontent.com/files/16a631122c098cbefd93dc7de8eb048d090fc1b4ce657224bd99a19a09b57ad853f9b8cf4fc38514dfe032fe27f41ab862d707ddb63b18c80cb483addbc55396", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","statemesh","nation","counties"], _2);
  main.variable(observer("counties")).define("counties", ["topojson","us","election"], _counties);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("election")).define("election", ["FileAttachment"], _election);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-tree-tidy"] = { code: "Plot.plot({\n  axis: null,\n  margin: 10,\n  marginLeft: 40,\n  marginRight: 160,\n  width: 928,\n  height: 1800,\n  marks: [\n    Plot.tree(flare, {path: \"name\", delimiter: \".\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Tree, tidy</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Tidy tree

Plot’s [tree transform](https://observablehq.com/plot/marks/tree) implements the [Reingold–Tilford “tidy” algorithm](http://reingold.co/tidier-drawings.pdf) for constructing hierarchical node-link diagrams, improved to run in linear time by [Buchheim *et al.*](http://dirk.jivas.de/papers/buchheim02improving.pdf) Tidy trees are typically more compact than [cluster dendrograms](/@observablehq/plot-cluster-diagram), which place all leaves at the same level. See also the [radial variant](/@d3/radial-tidy-tree) (using D3).`
)}

function _2(Plot,flare){return(
Plot.plot({
  axis: null,
  margin: 10,
  marginLeft: 40,
  marginRight: 160,
  width: 928,
  height: 1800,
  marks: [
    Plot.tree(flare, {path: "name", delimiter: "."})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","flare"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-cluster-diagram"] = { code: "Plot.plot({\n  axis: null,\n  margin: 10,\n  marginLeft: 40,\n  marginRight: 160,\n  width: 928,\n  height: 2400,\n  marks: [\n    Plot.cluster(flare, {path: \"name\", treeSort: \"node:height\", delimiter: \".\", textStroke: \"white\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Cluster diagram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Cluster diagram

Plot’s [cluster layout](https://observablehq.com/plot/marks/tree) produces node-link diagrams with leaf nodes at equal depth. These are less compact than [tidy trees](/@observablehq/plot-tree-tidy), but are useful for dendrograms, hierarchical clustering, and [phylogenetic trees](/@d3/tree-of-life). See also the [radial variant](/@d3/radial-dendrogram) (using D3).`
)}

function _2(Plot,flare){return(
Plot.plot({
  axis: null,
  margin: 10,
  marginLeft: 40,
  marginRight: 160,
  width: 928,
  height: 2400,
  marks: [
    Plot.cluster(flare, {path: "name", treeSort: "node:height", delimiter: ".", textStroke: "white"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","flare"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-custom-tree-layout"] = { code: "Plot.plot({\n  axis: null,\n  inset: 10,\n  insetRight: 120,\n  round: true,\n  width: 200,\n  height: 3600,\n  marks: Plot.tree(flare, {\n    path: \"name\",\n    delimiter: \".\",\n    treeLayout: indent,\n    strokeWidth: 1,\n    curve: \"step-before\",\n    textStroke: \"none\"\n  })\n})\n\nindent = function indent() {\n  return (root) => {\n    root.eachBefore((node, i) => {\n      node.y = node.depth;\n      node.x = i;\n    });\n  };\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Indented tree diagram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Indented tree diagram

A [tree](https://observablehq.com/plot/marks/tree) with a custom layout.`
)}

function _2(Plot,flare,indent){return(
Plot.plot({
  axis: null,
  inset: 10,
  insetRight: 120,
  round: true,
  width: 200,
  height: 3600,
  marks: Plot.tree(flare, {
    path: "name",
    delimiter: ".",
    treeLayout: indent,
    strokeWidth: 1,
    curve: "step-before",
    textStroke: "none"
  })
})
)}

function _indent(){return(
function indent() {
  return (root) => {
    root.eachBefore((node, i) => {
      node.y = node.depth;
      node.x = i;
    });
  };
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","flare","indent"], _2);
  main.variable(observer("indent")).define("indent", _indent);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-perlin-noise"] = { code: "Plot.plot({\n  inset: 6,\n  width: 1024,\n  aspectRatio: 1,\n  axis: null,\n  marks: [\n    Plot.vector(poisson([0, 0, 2, 2], {n: 4000}), {\n      length: ([x, y]) => noise(x + 2, y) + 0.5,\n      rotate: ([x, y]) => noise(x, y) * 360\n    })\n  ]\n})\n\nnoise = octave(perlin2, 2)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Perlin noise</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Perlin noise

An example showing a Perlin noise [vector](https://observablehq.com/plot/marks/vector) field, just because it’s pretty:`
)}

function _2(Plot,poisson,noise){return(
Plot.plot({
  inset: 6,
  width: 1024,
  aspectRatio: 1,
  axis: null,
  marks: [
    Plot.vector(poisson([0, 0, 2, 2], {n: 4000}), {
      length: ([x, y]) => noise(x + 2, y) + 0.5,
      rotate: ([x, y]) => noise(x, y) * 360
    })
  ]
})
)}

function _noise(octave,perlin2){return(
octave(perlin2, 2)
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("https://api.observablehq.com/d/316b246fa1642db4@285.js?v=4&resolutions=a51b7f87054fb6e2@62")).default));
  main.define("module 2", async () => runtime.module((await import("https://api.observablehq.com/d/19c9e8baf0415fa7@75.js?v=4&resolutions=a51b7f87054fb6e2@62")).default));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","poisson","noise"], _2);
  main.variable(observer("noise")).define("noise", ["octave","perlin2"], _noise);
  main.define("octave", ["module 1", "@variable"], (_, v) => v.import("octave", _));
  main.define("perlin2", ["module 1", "@variable"], (_, v) => v.import("perlin2", _));
  main.define("poisson", ["module 2", "@variable"], (_, v) => v.import("poisson", _));
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-function-contour"] = { code: "Plot.plot({\n  color: { type: \"diverging\" },\n  aspectRatio: 1,\n  marks: [\n    Plot.contour({\n      fill: peaks,\n      stroke: \"currentColor\",\n      x1: -3,\n      x2: 3,\n      y1: -2.2,\n      y2: 2.2\n    })\n  ]\n})\n\npeaks = (y, x) =>\n  3 * (1 - x) ** 2 * Math.exp(-x * x - (y + 1) ** 2) -\n  10 * (x / 5 - x ** 3 - y ** 5) * Math.exp(-x * x - y * y) -\n  (1 / 3) * Math.exp(-y * y - (x + 1) ** 2)", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Function contour</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Function contour

The [contours](https://observablehq.com/plot/marks/contour) of a function of *x* and *y*. To draw multiple functions jointly, see the [Faceted function contour](/@observablehq/plot-faceted-function-contour) notebook.`
)}

function _2(Plot,peaks){return(
Plot.plot({
  color: { type: "diverging" },
  aspectRatio: 1,
  marks: [
    Plot.contour({
      fill: peaks,
      stroke: "currentColor",
      x1: -3,
      x2: 3,
      y1: -2.2,
      y2: 2.2
    })
  ]
})
)}

function _peaks(){return(
(y, x) =>
  3 * (1 - x) ** 2 * Math.exp(-x * x - (y + 1) ** 2) -
  10 * (x / 5 - x ** 3 - y ** 5) * Math.exp(-x * x - y * y) -
  (1 / 3) * Math.exp(-y * y - (x + 1) ** 2)
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","peaks"], _2);
  main.variable(observer("peaks")).define("peaks", _peaks);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-faceted-function-contour"] = { code: "Plot.plot({\n  height: 580,\n  color: { type: \"diverging\", scheme: \"PuOr\" },\n  fx: { tickFormat: (f) => f?.name },\n  fy: { tickFormat: (f) => f?.name },\n  marks: [\n    Plot.contour({\n      fill: (x, y, { fx, fy }) => fx(x) * fy(y),\n      fx: [sin, sin, lin, lin],\n      fy: [cos, lin, lin, cos],\n      x1: 0,\n      y1: 0,\n      x2: fourPi,\n      y2: fourPi,\n      interval: 0.2\n    }),\n    Plot.frame()\n  ]\n})\n\nlin = function lin(x) { return x / fourPi; }\n\nsin = Math.sin\n\ncos = Math.cos\n\nfourPi = 4 * Math.PI", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Faceted function contour</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Faceted function contour

The [facets](https://observablehq.com/plot/features/facets) are passed as the third argument to the function of *x* and *y* for which we draw [contours](https://observablehq.com/plot/marks/contour). To draw a single function, see the simpler [Function contour](/@observablehq/plot-function-contour) notebook. Note that all the facets share the same thresholds.`
)}

function _2(Plot,sin,lin,cos,fourPi){return(
Plot.plot({
  height: 580,
  color: { type: "diverging", scheme: "PuOr" },
  fx: { tickFormat: (f) => f?.name },
  fy: { tickFormat: (f) => f?.name },
  marks: [
    Plot.contour({
      fill: (x, y, { fx, fy }) => fx(x) * fy(y),
      fx: [sin, sin, lin, lin],
      fy: [cos, lin, lin, cos],
      x1: 0,
      y1: 0,
      x2: fourPi,
      y2: fourPi,
      interval: 0.2
    }),
    Plot.frame()
  ]
})
)}

function _lin(fourPi){return(
function lin(x) { return x / fourPi; }
)}

function _sin(){return(
Math.sin
)}

function _cos(){return(
Math.cos
)}

function _fourPi(){return(
4 * Math.PI
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","sin","lin","cos","fourPi"], _2);
  main.variable(observer("lin")).define("lin", ["fourPi"], _lin);
  main.variable(observer("sin")).define("sin", _sin);
  main.variable(observer("cos")).define("cos", _cos);
  main.variable(observer("fourPi")).define("fourPi", _fourPi);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-mandelbrot-set"] = { code: "Plot.raster({fill: mandelbrot, x1: -2, x2: 1, y1: -1.164, y2: 1.164}).plot({aspectRatio: 1})\n\nmandelbrot = function mandelbrot(x, y) {\n  for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {\n    [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];\n    if (zr * zr + zi * zi > 4) return n;\n  }\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Mandelbrot set</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Mandelbrot set

A [raster](https://observablehq.com/plot/marks/raster) can color each pixel with the result of a function. Here the function counts the number of iterations needed until the point “escapes”. Reference: [Wikipedia](https://en.wikipedia.org/wiki/Mandelbrot_set).`
)}

function _2(Plot,mandelbrot){return(
Plot.raster({fill: mandelbrot, x1: -2, x2: 1, y1: -1.164, y2: 1.164}).plot({aspectRatio: 1})
)}

function _mandelbrot(){return(
function mandelbrot(x, y) {
  for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {
    [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];
    if (zr * zr + zi * zi > 4) return n;
  }
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","mandelbrot"], _2);
  main.variable(observer("mandelbrot")).define("mandelbrot", _mandelbrot);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-log-heatmap"] = { code: "Plot.plot({\n  height: 630,\n  x: {ticks: 10, tickFormat: \"+f\"},\n  y: {ticks: 10, tickFormat: \"+f\"},\n  color: {type: \"log\", scheme: \"magma\"},\n  marks: [\n    Plot.raster({\n      fill: (x, y) =>\n        (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *\n        (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2)),\n      x1: -2,\n      y1: -2.5,\n      x2: 2,\n      y2: 1.5,\n      pixelSize: 4\n    }),\n    Plot.ruleX([0], {strokeOpacity: 0.2}),\n    Plot.ruleY([0], {strokeOpacity: 0.2}),\n    Plot.frame()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Log heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Log heatmap

This [heatmap](https://observablehq.com/plot/marks/raster) is using a log color [scale](https://observablehq.com/plot/features/scales), to better reflect variations in magnitude.`
)}

function _2(Plot){return(
Plot.plot({
  height: 630,
  x: {ticks: 10, tickFormat: "+f"},
  y: {ticks: 10, tickFormat: "+f"},
  color: {type: "log", scheme: "magma"},
  marks: [
    Plot.raster({
      fill: (x, y) =>
        (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
        (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2)),
      x1: -2,
      y1: -2.5,
      x2: 2,
      y2: 1.5,
      pixelSize: 4
    }),
    Plot.ruleX([0], {strokeOpacity: 0.2}),
    Plot.ruleY([0], {strokeOpacity: 0.2}),
    Plot.frame()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-volcano-raster"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  color: {label: \"Elevation (m)\", legend: true},\n  marks: [\n    Plot.raster(volcano.values, {width: volcano.width, height: volcano.height})\n  ]\n})\n\nvolcano = FileAttachment(\"volcano.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Volcano raster</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Volcano raster

A [raster](https://observablehq.com/plot/marks/raster) mark directly reading an array of elevation values.`
)}

function _2(Plot,volcano){return(
Plot.plot({
  aspectRatio: 1,
  color: {label: "Elevation (m)", legend: true},
  marks: [
    Plot.raster(volcano.values, {width: volcano.width, height: volcano.height})
  ]
})
)}

function _volcano(FileAttachment){return(
FileAttachment("volcano.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["volcano.json", {url: "https://static.observableusercontent.com/files/c9bc6fe983c9c129027d444552981bfe0d029f1847539c2e7ec0f0dcf51c497cb6bd30984faa2acbb62858f08e4a0433a4ab2fb186a766e0208a1011fc6ae880", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","volcano"], _2);
  main.variable(observer("volcano")).define("volcano", ["FileAttachment"], _volcano);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-function-contour-2"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  x: {tickSpacing: 80, label: \"x →\"},\n  y: {tickSpacing: 80, label: \"↑ y\"},\n  color: {type: \"diverging\", legend: true, label: \"sin(x) cos(y)\"},\n  marks: [\n    Plot.contour({\n      fill: (x, y) => Math.sin(x) * Math.cos(y),\n      x1: 0,\n      y1: 0,\n      x2: 6 * Math.PI,\n      y2: 4 * Math.PI\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Function contour 2</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Function contour 2

A function [contour](https://observablehq.com/plot/marks/contour) with a [diverging](https://observablehq.com/plot/features/scales#color-scale-options) color scale.`
)}

function _2(Plot){return(
Plot.plot({
  aspectRatio: 1,
  x: {tickSpacing: 80, label: "x →"},
  y: {tickSpacing: 80, label: "↑ y"},
  color: {type: "diverging", legend: true, label: "sin(x) cos(y)"},
  marks: [
    Plot.contour({
      fill: (x, y) => Math.sin(x) * Math.cos(y),
      x1: 0,
      y1: 0,
      x2: 6 * Math.PI,
      y2: 4 * Math.PI
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-contours-projection"] = { code: "Plot.plot({\n  projection: \"equal-earth\",\n  color: {\n    scheme: \"BuPu\",\n    domain: [0, 6],\n    legend: true,\n    label: \"Water vapor (cm)\"\n  },\n  marks: [\n    Plot.contour(vapor, {\n      fill: Plot.identity,\n      width: 360,\n      height: 180,\n      x1: -180,\n      y1: 90,\n      x2: 180,\n      y2: -90,\n      blur: 1,\n      stroke: \"black\",\n      strokeWidth: 0.5,\n      clip: \"sphere\"\n    }),\n    Plot.sphere({stroke: \"black\"})\n  ]\n})\n\nvapor = FileAttachment(\"water-vapor.csv\").csv({array: true}).then(rows => rows.flat().map((x) => (x === \"99999.0\" ? NaN : +x)))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Contours & projection</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Contours & projection

When [contours](https://observablehq.com/plot/marks/contour) are applied to samples with [projected](https://observablehq.com/plot/features/projections) coordinates, it is useful to [clip](https://observablehq.com/plot/features/marks#mark-options) the mark to the sphere.`
)}

function _2(Plot,vapor){return(
Plot.plot({
  projection: "equal-earth",
  color: {
    scheme: "BuPu",
    domain: [0, 6],
    legend: true,
    label: "Water vapor (cm)"
  },
  marks: [
    Plot.contour(vapor, {
      fill: Plot.identity,
      width: 360,
      height: 180,
      x1: -180,
      y1: 90,
      x2: 180,
      y2: -90,
      blur: 1,
      stroke: "black",
      strokeWidth: 0.5,
      clip: "sphere"
    }),
    Plot.sphere({stroke: "black"})
  ]
})
)}

function _vapor(FileAttachment){return(
FileAttachment("water-vapor.csv").csv({array: true}).then(rows => rows.flat().map((x) => (x === "99999.0" ? NaN : +x)))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["water-vapor.csv", {url: "https://static.observableusercontent.com/files/39603251c158a62cc6dabe63bf4cbf0c846f929d58de82a9fbb8835fb39cc0546ac2d8f9dcb83c645c611ceb9d2c4ea6ee76749405ff39e52a4958b6f6d82e3b", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","vapor"], _2);
  main.variable(observer("vapor")).define("vapor", ["FileAttachment"], _vapor);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-blurred-contours"] = { code: "Plot.contour(ca55, {x: \"LONGITUDE\", y: \"LATITUDE\", fill: \"MAG_IGRF90\", blur: 4}).plot({color: {type: \"diverging\"}})\n\nca55 = FileAttachment(\"ca55-south.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Blurred contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Blurred contours

 Use the contour mark’s [blur](https://observablehq.com/plot/marks/contour) option for smoother isolines.`
)}

function _2(Plot,ca55){return(
Plot.contour(ca55, {x: "LONGITUDE", y: "LATITUDE", fill: "MAG_IGRF90", blur: 4}).plot({color: {type: "diverging"}})
)}

function _ca55(FileAttachment){return(
FileAttachment("ca55-south.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["ca55-south.csv", {url: "https://static.observableusercontent.com/files/3d6b39a91941e8cc83e23343c46d9616c959d4fc997feb2d6764545ac12cb3fa14bc523c21ae3b167780bec507ae11385b56b248c196c4882a1f2cd30f791716", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","ca55"], _2);
  main.variable(observer("ca55")).define("ca55", ["FileAttachment"], _ca55);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-igrf90-contours"] = { code: "Plot.contour(ca55, {x: \"LONGITUDE\", y: \"LATITUDE\", fill: \"MAG_IGRF90\"}).plot({color: {type: \"diverging\"}})\n\nca55 = FileAttachment(\"ca55-south.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: IGRF90 contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# IGRF90 contours

The [contour](https://observablehq.com/plot/marks/contour) mark can derive contours from non-gridded data samples.`
)}

function _2(Plot,ca55){return(
Plot.contour(ca55, {x: "LONGITUDE", y: "LATITUDE", fill: "MAG_IGRF90"}).plot({color: {type: "diverging"}})
)}

function _ca55(FileAttachment){return(
FileAttachment("ca55-south.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["ca55-south.csv", {url: "https://static.observableusercontent.com/files/3d6b39a91941e8cc83e23343c46d9616c959d4fc997feb2d6764545ac12cb3fa14bc523c21ae3b167780bec507ae11385b56b248c196c4882a1f2cd30f791716", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","ca55"], _2);
  main.variable(observer("ca55")).define("ca55", ["FileAttachment"], _ca55);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-small-grid-contours"] = { code: "Plot.plot({\n  grid: true,\n  x: {domain: [0, grid.width], label: \"column →\"},\n  y: {domain: [0, grid.height], label: \"↑ row\"},\n  marks: [\n    Plot.text(grid.values, {\n      text: Plot.identity,\n      fill: Plot.identity,\n      x: (d, i) => i % grid.width + 0.5,\n      y: (d, i) => Math.floor(i / grid.width) + 0.5\n    })\n  ]\n})\n\nPlot.plot({\n  marks: [\n    Plot.contour(grid.values, {\n      width: grid.width,\n      height: grid.height,\n      fill: Plot.identity,\n      interval: 5\n    }),\n    Plot.text(grid.values, {\n      text: Plot.identity,\n      fill: \"white\",\n      x: (d, i) => i % grid.width + 0.5,\n      y: (d, i) => Math.floor(i / grid.width) + 0.5\n    })\n  ]\n})\n\ngrid = {\n  \"width\": 10,\n  \"height\": 10,\n  \"values\": [\n     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,\n     0,  1,  2,  3,  4,  5,  6,  7,  8,  9,\n     0,  2,  4,  6,  8, 10, 12, 14, 16, 18,\n     0,  3,  6,  9, 12, 15, 18, 21, 24, 27,\n     0,  4,  8, 12, 16, 20, 24, 28, 32, 36,\n     0,  5, 10, 15, 20, 25, 30, 35, 40, 45,\n     0,  6, 12, 18, 24, 30, 36, 42, 48, 54,\n     0,  7, 14, 21, 28, 35, 42, 49, 56, 63,\n     0,  8, 16, 24, 32, 40, 48, 56, 64, 72,\n     0,  9, 18, 27, 36, 45, 54, 63, 72, 81\n  ]\n}", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Small grid contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Small grid contours

Part of the documentation for the [contour](https://observablehq.com/plot/marks/contour) mark.`
)}

function _2(Plot,grid){return(
Plot.plot({
  grid: true,
  x: {domain: [0, grid.width], label: "column →"},
  y: {domain: [0, grid.height], label: "↑ row"},
  marks: [
    Plot.text(grid.values, {
      text: Plot.identity,
      fill: Plot.identity,
      x: (d, i) => i % grid.width + 0.5,
      y: (d, i) => Math.floor(i / grid.width) + 0.5
    })
  ]
})
)}

function _3(Plot,grid){return(
Plot.plot({
  marks: [
    Plot.contour(grid.values, {
      width: grid.width,
      height: grid.height,
      fill: Plot.identity,
      interval: 5
    }),
    Plot.text(grid.values, {
      text: Plot.identity,
      fill: "white",
      x: (d, i) => i % grid.width + 0.5,
      y: (d, i) => Math.floor(i / grid.width) + 0.5
    })
  ]
})
)}

function _grid(){return(
{
  "width": 10,
  "height": 10,
  "values": [
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
     0,  2,  4,  6,  8, 10, 12, 14, 16, 18,
     0,  3,  6,  9, 12, 15, 18, 21, 24, 27,
     0,  4,  8, 12, 16, 20, 24, 28, 32, 36,
     0,  5, 10, 15, 20, 25, 30, 35, 40, 45,
     0,  6, 12, 18, 24, 30, 36, 42, 48, 54,
     0,  7, 14, 21, 28, 35, 42, 49, 56, 63,
     0,  8, 16, 24, 32, 40, 48, 56, 64, 72,
     0,  9, 18, 27, 36, 45, 54, 63, 72, 81
  ]
}
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","grid"], _2);
  main.variable(observer()).define(["Plot","grid"], _3);
  main.variable(observer("grid")).define("grid", _grid);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-filled-contours"] = { code: "Plot.plot({\n  aspectRatio: 1,\n  color: {\n    legend: true,\n    label: \"Elevation (m)\"\n  },\n  marks: [\n    Plot.contour(volcano.values, {\n      width: volcano.width,\n      height: volcano.height,\n      fill: Plot.identity,\n      stroke: \"black\"\n    })\n  ]\n})\n\nvolcano = FileAttachment(\"volcano.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Filled contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Filled contours

[Contours](https://observablehq.com/plot/marks/contour) can be filled with a color based on their value.`
)}

function _2(Plot,volcano){return(
Plot.plot({
  aspectRatio: 1,
  color: {
    legend: true,
    label: "Elevation (m)"
  },
  marks: [
    Plot.contour(volcano.values, {
      width: volcano.width,
      height: volcano.height,
      fill: Plot.identity,
      stroke: "black"
    })
  ]
})
)}

function _volcano(FileAttachment){return(
FileAttachment("volcano.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["volcano.json", {url: "https://static.observableusercontent.com/files/c9bc6fe983c9c129027d444552981bfe0d029f1847539c2e7ec0f0dcf51c497cb6bd30984faa2acbb62858f08e4a0433a4ab2fb186a766e0208a1011fc6ae880", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","volcano"], _2);
  main.variable(observer("volcano")).define("volcano", ["FileAttachment"], _volcano);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-stroked-contours"] = { code: "Plot.contour(volcano.values, {width: volcano.width, height: volcano.height}).plot({aspectRatio: 1})\n\nvolcano = FileAttachment(\"volcano.json\").json()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Stroked contours</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Stroked contours

[Contours](https://observablehq.com/plot/marks/contour) default to a stroked outline of the region that contains values above each threshold.`
)}

function _2(Plot,volcano){return(
Plot.contour(volcano.values, {width: volcano.width, height: volcano.height}).plot({aspectRatio: 1})
)}

function _volcano(FileAttachment){return(
FileAttachment("volcano.json").json()
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["volcano.json", {url: "https://static.observableusercontent.com/files/c9bc6fe983c9c129027d444552981bfe0d029f1847539c2e7ec0f0dcf51c497cb6bd30984faa2acbb62858f08e4a0433a4ab2fb186a766e0208a1011fc6ae880", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","volcano"], _2);
  main.variable(observer("volcano")).define("volcano", ["FileAttachment"], _volcano);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-olympians-density"] = { code: "Plot.density(olympians, {x: \"weight\", y: \"height\", stroke: \"sex\"}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Olympians density</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Olympians density

Use the [density](https://observablehq.com/plot/marks/density) mark to show the spread of two classes of Olympic athletes. Data: [Matt Riggott/IOC](https://www.flother.is/2017/olympic-games-data/)`
)}

function _2(Plot,olympians){return(
Plot.density(olympians, {x: "weight", y: "height", stroke: "sex"}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-density-weighted"] = { code: "skew = Inputs.range([-1, 1], {label: \"skew (-F/+M)\", step: 0.01})\n\nPlot.plot({\n  inset: 10,\n  color: {legend: true},\n  marks: [\n    Plot.density(penguins.filter((d) => d.sex), {\n      weight: (d) => d.sex === \"FEMALE\" ? 1 - skew : 1 + skew,\n      x: \"flipper_length_mm\",\n      y: \"culmen_length_mm\",\n      strokeOpacity: 0.5,\n      clip: true\n    }),\n    Plot.dot(penguins.filter((d) => d.sex), {\n      x: \"flipper_length_mm\",\n      y: \"culmen_length_mm\",\n      stroke: \"sex\",\n      strokeOpacity: (d) => d.sex === \"FEMALE\" ? 1 - skew : 1 + skew\n    }),\n    Plot.frame()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Density skew (weight) interactive</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Density skew (weight) interactive

Using a variable weight, we can make the [density](https://observablehq.com/plot/marks/density) mark progressively ignore some points and take others into account.`
)}

function _skew(Inputs){return(
Inputs.range([-1, 1], {label: "skew (-F/+M)", step: 0.01})
)}

function _3(Plot,penguins,skew){return(
Plot.plot({
  inset: 10,
  color: {legend: true},
  marks: [
    Plot.density(penguins.filter((d) => d.sex), {
      weight: (d) => d.sex === "FEMALE" ? 1 - skew : 1 + skew,
      x: "flipper_length_mm",
      y: "culmen_length_mm",
      strokeOpacity: 0.5,
      clip: true
    }),
    Plot.dot(penguins.filter((d) => d.sex), {
      x: "flipper_length_mm",
      y: "culmen_length_mm",
      stroke: "sex",
      strokeOpacity: (d) => d.sex === "FEMALE" ? 1 - skew : 1 + skew
    }),
    Plot.frame()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof skew")).define("viewof skew", ["Inputs"], _skew);
  main.variable(observer("skew")).define("skew", ["Generators", "viewof skew"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","penguins","skew"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-density-faceted"] = { code: "Plot.plot({\n  marks: [\n    Plot.density(penguins, {fx: \"island\", x: \"flipper_length_mm\", y: \"culmen_length_mm\", stroke: \"density\", clip: true}),\n    Plot.frame()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Density, faceted</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Density, faceted

The [density](https://observablehq.com/plot/marks/density) mark uses the same thresholds across [facets](https://observablehq.com/plot/features/facets), ensuring comparability.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marks: [
    Plot.density(penguins, {fx: "island", x: "flipper_length_mm", y: "culmen_length_mm", stroke: "density", clip: true}),
    Plot.frame()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-walmart-density"] = { code: "Plot.plot({\n  projection: \"albers\",\n  color: {scheme: \"YlGnBu\"},\n  style: \"overflow: visible;\",\n  marks: [\n    Plot.density(walmarts, {x: \"longitude\", y: \"latitude\", bandwidth: 10, fill: \"density\"}),\n    Plot.geo(statemesh, {strokeOpacity: 0.3}),\n    Plot.geo(nation),\n    Plot.dot(walmarts, {x: \"longitude\", y: \"latitude\", r: 1, fill: \"currentColor\"})\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\nstatemesh = topojson.mesh(us, us.objects.states)\n\nwalmarts = FileAttachment(\"walmarts.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Walmart density</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Walmart density

The [density](https://observablehq.com/plot/marks/density) mark supports projected data. For more accurate results, prefer an equal-area [projection](https://observablehq.com/plot/features/projections).`
)}

function _2(Plot,walmarts,statemesh,nation){return(
Plot.plot({
  projection: "albers",
  color: {scheme: "YlGnBu"},
  style: "overflow: visible;",
  marks: [
    Plot.density(walmarts, {x: "longitude", y: "latitude", bandwidth: 10, fill: "density"}),
    Plot.geo(statemesh, {strokeOpacity: 0.3}),
    Plot.geo(nation),
    Plot.dot(walmarts, {x: "longitude", y: "latitude", r: 1, fill: "currentColor"})
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states)
)}

function _walmarts(FileAttachment){return(
FileAttachment("walmarts.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}],
    ["walmarts.tsv", {url: "https://static.observableusercontent.com/files/3711de2a6d1c44df145f2a29f8744771e113672517ed5d84b0fbf76740b423e060d96eb2ae76bc28806b2d3cef37083de88309b3c86baef2807f0e27b2d045f3", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","walmarts","statemesh","nation"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("walmarts")).define("walmarts", ["FileAttachment"], _walmarts);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-density-stroke"] = { code: "Plot.plot({\n  inset: 10,\n  grid: true,\n  x: {type: \"log\"},\n  y: {type: \"log\"},\n  marks: [\n    Plot.density(diamonds, {x: \"carat\", y: \"price\", stroke: \"density\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Density stroke</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Density stroke

The [density](https://observablehq.com/plot/marks/density) contours can be colored based on their value.`
)}

function _2(Plot,diamonds){return(
Plot.plot({
  inset: 10,
  grid: true,
  x: {type: "log"},
  y: {type: "log"},
  marks: [
    Plot.density(diamonds, {x: "carat", y: "price", stroke: "density"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","diamonds"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-raster-projection"] = { code: "Plot.plot({\n  projection: \"equal-earth\",\n  color: {\n    scheme: \"BuPu\",\n    domain: [0, 6],\n    legend: true,\n    label: \"Water vapor (cm)\"\n  },\n  marks: [\n    Plot.raster(vapor, {\n      fill: Plot.identity,\n      width: 360,\n      height: 180,\n      x1: -180,\n      y1: 90,\n      x2: 180,\n      y2: -90,\n      interpolate: \"barycentric\",\n      clip: \"sphere\"\n    }),\n    Plot.sphere({stroke: \"black\"})\n  ]\n})\n\nvapor = FileAttachment(\"water-vapor.csv\").csv({array: true}).then(rows => rows.flat().map((x) => (x === \"99999.0\" ? NaN : +x)))", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Projected raster: vapor</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Projected raster: vapor

The [raster](https://observablehq.com/plot/marks/raster) mark works with [projections](https://observablehq.com/plot/features/projections). Data: [Aqua/MODIS water vapor](https://neo.gsfc.nasa.gov/view.php?datasetId=MYDAL2_M_SKY_WV), NASA Earth Observations.`
)}

function _2(Plot,vapor){return(
Plot.plot({
  projection: "equal-earth",
  color: {
    scheme: "BuPu",
    domain: [0, 6],
    legend: true,
    label: "Water vapor (cm)"
  },
  marks: [
    Plot.raster(vapor, {
      fill: Plot.identity,
      width: 360,
      height: 180,
      x1: -180,
      y1: 90,
      x2: 180,
      y2: -90,
      interpolate: "barycentric",
      clip: "sphere"
    }),
    Plot.sphere({stroke: "black"})
  ]
})
)}

function _vapor(FileAttachment){return(
FileAttachment("water-vapor.csv").csv({array: true}).then(rows => rows.flat().map((x) => (x === "99999.0" ? NaN : +x)))
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["water-vapor.csv", {url: "https://static.observableusercontent.com/files/39603251c158a62cc6dabe63bf4cbf0c846f929d58de82a9fbb8835fb39cc0546ac2d8f9dcb83c645c611ceb9d2c4ea6ee76749405ff39e52a4958b6f6d82e3b", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","vapor"], _2);
  main.variable(observer("vapor")).define("vapor", ["FileAttachment"], _vapor);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-one-dimensional-density"] = { code: "Plot.plot({\n  height: 100,\n  inset: 10,\n  marks: [\n    Plot.density(faithful, {x: \"waiting\", stroke: \"steelblue\", strokeWidth: 0.25, bandwidth: 10}),\n    Plot.density(faithful, {x: \"waiting\", stroke: \"steelblue\", thresholds: 4, bandwidth: 10}),\n    Plot.dot(faithful, {x: \"waiting\", fill: \"currentColor\", r: 1.5})\n  ]\n})\n\nfaithful = FileAttachment(\"faithful.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: One-dimensional density</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# One-dimensional density

Although it is inherently two-dimensional, the [density](https://observablehq.com/plot/marks/density) mark is compatible with one-dimensional data. For a more accurate estimation of one-dimensional densities, please upvote issue [#1469](https://github.com/observablehq/plot/issues/1469).`
)}

function _2(Plot,faithful){return(
Plot.plot({
  height: 100,
  inset: 10,
  marks: [
    Plot.density(faithful, {x: "waiting", stroke: "steelblue", strokeWidth: 0.25, bandwidth: 10}),
    Plot.density(faithful, {x: "waiting", stroke: "steelblue", thresholds: 4, bandwidth: 10}),
    Plot.dot(faithful, {x: "waiting", fill: "currentColor", r: 1.5})
  ]
})
)}

function _faithful(FileAttachment){return(
FileAttachment("faithful.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["faithful.tsv", {url: "https://static.observableusercontent.com/files/4c881d9f7d1638711375d1a555b856b4580cd47c16a41fa7446ccbd8e63d90543b81aaca584bab5cc75b295ce38ee1461010792e123724364f41709b936120ac", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","faithful"], _2);
  main.variable(observer("faithful")).define("faithful", ["FileAttachment"], _faithful);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-density-options"] = { code: "bandwidth = Inputs.range([0, 40], {step: 0.2, label: \"bandwidth\"})\n\nthresholds = Inputs.range([1, 40], {\n  step: 1,\n  value: 20,\n  label: \"thresholds\"\n})\n\nPlot.plot({\n  inset: 20,\n  marks: [\n    Plot.density(faithful, {x: \"waiting\", y: \"eruptions\", bandwidth, thresholds}),\n    Plot.dot(faithful, {x: \"waiting\", y: \"eruptions\"})\n  ]\n})\n\nfaithful = FileAttachment(\"faithful.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Density options</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Density options

An interactive demo of the main options for the [density](https://observablehq.com/plot/marks/density) mark.`
)}

function _bandwidth(Inputs){return(
Inputs.range([0, 40], {step: 0.2, label: "bandwidth"})
)}

function _thresholds(Inputs){return(
Inputs.range([1, 40], {
  step: 1,
  value: 20,
  label: "thresholds"
})
)}

function _4(Plot,faithful,bandwidth,thresholds){return(
Plot.plot({
  inset: 20,
  marks: [
    Plot.density(faithful, {x: "waiting", y: "eruptions", bandwidth, thresholds}),
    Plot.dot(faithful, {x: "waiting", y: "eruptions"})
  ]
})
)}

function _faithful(FileAttachment){return(
FileAttachment("faithful.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["faithful.tsv", {url: "https://static.observableusercontent.com/files/4c881d9f7d1638711375d1a555b856b4580cd47c16a41fa7446ccbd8e63d90543b81aaca584bab5cc75b295ce38ee1461010792e123724364f41709b936120ac", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof bandwidth")).define("viewof bandwidth", ["Inputs"], _bandwidth);
  main.variable(observer("bandwidth")).define("bandwidth", ["Generators", "viewof bandwidth"], (G, _) => G.input(_));
  main.variable(observer("viewof thresholds")).define("viewof thresholds", ["Inputs"], _thresholds);
  main.variable(observer("thresholds")).define("thresholds", ["Generators", "viewof thresholds"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","faithful","bandwidth","thresholds"], _4);
  main.variable(observer("faithful")).define("faithful", ["FileAttachment"], _faithful);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-point-cloud-density"] = { code: "Plot.plot({\n  inset: 10,\n  marks: [\n    Plot.density(faithful, {x: \"waiting\", y: \"eruptions\", stroke: \"steelblue\", strokeWidth: 0.25}),\n    Plot.density(faithful, {x: \"waiting\", y: \"eruptions\", stroke: \"steelblue\", thresholds: 4}),\n    Plot.dot(faithful, {x: \"waiting\", y: \"eruptions\", fill: \"currentColor\", r: 1.5})\n  ]\n})\n\nfaithful = FileAttachment(\"faithful.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Point cloud density</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Point cloud density

The [density](https://observablehq.com/plot/marks/density) mark shows the estimated density of two-dimensional point clouds.`
)}

function _2(Plot,faithful){return(
Plot.plot({
  inset: 10,
  marks: [
    Plot.density(faithful, {x: "waiting", y: "eruptions", stroke: "steelblue", strokeWidth: 0.25}),
    Plot.density(faithful, {x: "waiting", y: "eruptions", stroke: "steelblue", thresholds: 4}),
    Plot.dot(faithful, {x: "waiting", y: "eruptions", fill: "currentColor", r: 1.5})
  ]
})
)}

function _faithful(FileAttachment){return(
FileAttachment("faithful.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["faithful.tsv", {url: "https://static.observableusercontent.com/files/4c881d9f7d1638711375d1a555b856b4580cd47c16a41fa7446ccbd8e63d90543b81aaca584bab5cc75b295ce38ee1461010792e123724364f41709b936120ac", mimeType: "text/tab-separated-values"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","faithful"], _2);
  main.variable(observer("faithful")).define("faithful", ["FileAttachment"], _faithful);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-non-overlapping-density-regions"] = { code: "Plot.plot({\n  inset: 10,\n  color: {legend: true},\n  marks: [\n    d3.groups(penguins, (d) => d.species).map(([s]) =>\n      Plot.density(penguins, {\n        x: \"flipper_length_mm\",\n        y: \"culmen_length_mm\",\n        weight: (d) => d.species === s ? 1 : -1,\n        fill: () => s,\n        fillOpacity: 0.2,\n        thresholds: [0.05]\n      })\n    ),\n    Plot.dot(penguins, {\n      x: \"flipper_length_mm\",\n      y: \"culmen_length_mm\",\n      stroke: \"species\"\n    }),\n    Plot.frame()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Non-overlapping density regions</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Non-overlapping density regions

By specifying a negative [weight](https://observablehq.com/plot/marks/density#density-options) for some points, we make them repulsive to the density contours—this technique limits overlapping and occlusion.`
)}

function _2(Plot,d3,penguins){return(
Plot.plot({
  inset: 10,
  color: {legend: true},
  marks: [
    d3.groups(penguins, (d) => d.species).map(([s]) =>
      Plot.density(penguins, {
        x: "flipper_length_mm",
        y: "culmen_length_mm",
        weight: (d) => d.species === s ? 1 : -1,
        fill: () => s,
        fillOpacity: 0.2,
        thresholds: [0.05]
      })
    ),
    Plot.dot(penguins, {
      x: "flipper_length_mm",
      y: "culmen_length_mm",
      stroke: "species"
    }),
    Plot.frame()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-wrap-tick-labels"] = { code: "Plot.plot({\n  y: {percent: true},\n  marks: [\n    Plot.axisX({label: null, lineWidth: 8, marginBottom: 40}),\n    Plot.axisY({label: \"↑ Responses (%)\"}),\n    Plot.barY(responses, {x: \"name\", y: \"value\"}),\n    Plot.ruleY([0])\n  ]\n})\n\nresponses = [\n  {name: \"Family in feud with Zucker­bergs\", value: 0.17},\n  {name: \"Committed 671 birthdays to memory\", value: 0.19},\n  {name: \"Ex is doing too well\", value: 0.10},\n  {name: \"High school friends all dead now\", value: 0.15},\n  {name: \"Discovered how to “like” things mentally\", value: 0.27},\n  {name: \"Not enough politics\", value: 0.12}\n]", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Axis with wrapped labels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Axis with wrapped labels

Use the [lineWidth](https://observablehq.com/plot/marks/axis#axis-options) option to wrap long tick labels.`
)}

function _2(Plot,responses){return(
Plot.plot({
  y: {percent: true},
  marks: [
    Plot.axisX({label: null, lineWidth: 8, marginBottom: 40}),
    Plot.axisY({label: "↑ Responses (%)"}),
    Plot.barY(responses, {x: "name", y: "value"}),
    Plot.ruleY([0])
  ]
})
)}

function _responses(){return(
[
  {name: "Family in feud with Zucker­bergs", value: 0.17},
  {name: "Committed 671 birthdays to memory", value: 0.19},
  {name: "Ex is doing too well", value: 0.10},
  {name: "High school friends all dead now", value: 0.15},
  {name: "Discovered how to “like” things mentally", value: 0.27},
  {name: "Not enough politics", value: 0.12}
]
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","responses"], _2);
  main.variable(observer("responses")).define("responses", _responses);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-ggplot2-style-axes"] = { code: "Plot.plot({\n  inset: 10,\n  marks: [\n    Plot.frame({fill: \"#eaeaea\"}),\n    Plot.gridY({stroke: \"white\", strokeOpacity: 1}),\n    Plot.gridX({stroke: \"white\", strokeOpacity: 1}),\n    Plot.line(aapl, {x: \"Date\", y: \"Close\", stroke: \"black\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: ggplot2-style axes</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# ggplot2-style axes

The [frame](https://observablehq.com/plot/marks/frame) and [grid](https://observablehq.com/plot/marks/grid) marks allow for a full customization of the chart’s background, à la [ggplot2](https://ggplot2.tidyverse.org/).`
)}

function _2(Plot,aapl){return(
Plot.plot({
  inset: 10,
  marks: [
    Plot.frame({fill: "#eaeaea"}),
    Plot.gridY({stroke: "white", strokeOpacity: 1}),
    Plot.gridX({stroke: "white", strokeOpacity: 1}),
    Plot.line(aapl, {x: "Date", y: "Close", stroke: "black"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-datawrapper-style-date-axis"] = { code: "Plot.plot({\n  marks: [\n    Plot.ruleY([0]),\n    Plot.axisX({ticks: \"3 months\"}),\n    Plot.gridX(),\n    Plot.line(aapl, {x: \"Date\", y: \"Close\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Datawrapper-style date axis
</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Datawrapper-style date axis

Plot’s time [axes](https://observablehq.com/plot/marks/axis) display month and year on two separate lines, [à la Datawrapper](https://academy.datawrapper.de/article/199-custom-date-formats-that-you-can-display-in-datawrapper).`
)}

function _2(Plot,aapl){return(
Plot.plot({
  marks: [
    Plot.ruleY([0]),
    Plot.axisX({ticks: "3 months"}),
    Plot.gridX(),
    Plot.line(aapl, {x: "Date", y: "Close"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-nyt-style-axes"] = { code: "Plot.plot({\n  round: true,\n  marginLeft: 0, // don’t need left-margin since labels are inset\n  x: {label: null, insetLeft: 36}, // reserve space for inset labels\n  marks: [\n    Plot.gridY({\n      strokeDasharray: \"0.75,2\", // dashed\n      strokeOpacity: 1 // opaque\n    }),\n    Plot.axisY({\n      tickSize: 0, // don’t draw ticks\n      dx: 38, // offset right\n      dy: -6, // offset up\n      lineAnchor: \"bottom\", // draw labels above grid lines\n      tickFormat: (d, i, _) => (i === _.length - 1 ? `$${d}` : d)\n    }),\n    Plot.ruleY([0]),\n    Plot.line(aapl, {x: \"Date\", y: \"Close\", markerEnd: \"dot\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: New York Times-style axes</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# New York Times-style axes

[Axes](https://observablehq.com/plot/marks/axis) can be customized in myriad ways. See the comments in the code below for all the details.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  round: true,
  marginLeft: 0, // don’t need left-margin since labels are inset
  x: {label: null, insetLeft: 36}, // reserve space for inset labels
  marks: [
    Plot.gridY({
      strokeDasharray: "0.75,2", // dashed
      strokeOpacity: 1 // opaque
    }),
    Plot.axisY({
      tickSize: 0, // don’t draw ticks
      dx: 38, // offset right
      dy: -6, // offset up
      lineAnchor: "bottom", // draw labels above grid lines
      tickFormat: (d, i, _) => (i === _.length - 1 ? `$${d}` : d)
    }),
    Plot.ruleY([0]),
    Plot.line(aapl, {x: "Date", y: "Close", markerEnd: "dot"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-data-based-axis"] = { code: "Plot.plot({\n  marginRight: 0,\n  marks: [\n    Plot.ruleY([0]),\n    Plot.line(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.gridY({x: (y) => aapl.find((d) => d.Close >= y)?.Date, insetLeft: -6}),\n    Plot.axisY({x: (y) => aapl.find((d) => d.Close >= y)?.Date, insetLeft: -6, textStroke: \"var(--vp-c-bg)\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Data-based axis</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Data-based axis

A vertical [axis](https://observablehq.com/plot/marks/axis) mark extends from the left (or from the right), but by specifying the *x* channel, we can change the position where the labels are shown, and the extent of the corresponding [grid](https://observablehq.com/plot/marks/grid) lines.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  marginRight: 0,
  marks: [
    Plot.ruleY([0]),
    Plot.line(aapl, {x: "Date", y: "Close"}),
    Plot.gridY({x: (y) => aapl.find((d) => d.Close >= y)?.Date, insetLeft: -6}),
    Plot.axisY({x: (y) => aapl.find((d) => d.Close >= y)?.Date, insetLeft: -6, textStroke: "var(--vp-c-bg)"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-major-and-minor-axis-ticks"] = { code: "Plot.plot({\n  x: {nice: true},\n  y: {grid: true},\n  marks: [\n    Plot.line(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.axisX({ticks: \"month\", text: null, tickSize: 3}),\n    Plot.axisX(),\n    Plot.axisY({ticks: 50, tickSize: 3, text: null}),\n    Plot.axisY()\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Major and minor axis ticks</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Major and minor axis ticks

The [axis](https://observablehq.com/plot/marks/axis) mark can be called several times with different options.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  x: {nice: true},
  y: {grid: true},
  marks: [
    Plot.line(aapl, {x: "Date", y: "Close"}),
    Plot.axisX({ticks: "month", text: null, tickSize: 3}),
    Plot.axisX(),
    Plot.axisY({ticks: 50, tickSize: 3, text: null}),
    Plot.axisY()
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-parcoords"] = { code: "color = Inputs.select(dimensions, { label: \"color by\" })\n\ndimensions = cars.columns.slice(1)\n\ncars = FileAttachment(\"cars.csv\").csv({ typed: true })", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Parallel coordinates</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Parallel coordinates

Each quantitative dimension of the *cars* dataset is normalized and mapped to a different (parallel) axis with a dedicated [D3 scale](https://github.com/d3/d3-scale). [Lines](https://observablehq.com/plot/marks/line) connect the positions of a car across dimensions. Axes are rendered with explicit [rules](https://observablehq.com/plot/marks/rule) and [text](https://observablehq.com/plot/marks/text) marks.`
)}

function _color(Inputs,dimensions){return(
Inputs.select(dimensions, { label: "color by" })
)}

function _3(dimensions,cars,d3,Plot,color)
{
  // Reshape wide data to make it tidy.
  const points = dimensions.flatMap((dimension) =>
    cars.map(({ [dimension]: value }, index) => ({ index, dimension, value }))
  );

  // Compute normalization scales for each dimension.
  const scales = new Map(
    dimensions.map((dimension) => [
      dimension,
      d3.scaleLinear().domain(d3.extent(cars, (d) => d[dimension]))
    ])
  );

  // Compute ticks for each dimension.
  const ticks = dimensions.flatMap((dimension) => {
    return scales
      .get(dimension)
      .ticks(7)
      .map((value) => ({ dimension, value }));
  });

  return Plot.plot({
    marginLeft: 104,
    marginRight: 20,
    x: { axis: null },
    y: { padding: 0.1, domain: dimensions, label: null, tickPadding: 9 },
    color: { scheme: "BrBG", type: "linear", reverse: true, legend: true },
    marks: [
      Plot.ruleY(dimensions),
      Plot.lineX(points, {
        x: ({dimension, value}) => scales.get(dimension)(value),
        y: "dimension",
        z: "index",
        stroke: ({index}) => cars[index][color],
        strokeWidth: 0.5,
        strokeOpacity: 0.5
      }),
      Plot.text(ticks, {
        x: ({dimension, value}) => scales.get(dimension)(value),
        y: "dimension",
        text: "value",
        fill: "black",
        stroke: "white",
        strokeWidth: 3
      })
    ]
  });
}


function _dimensions(cars){return(
cars.columns.slice(1)
)}

function _cars(FileAttachment){return(
FileAttachment("cars.csv").csv({ typed: true })
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["cars.csv", {url: "https://static.observableusercontent.com/files/048ec3dfd528110c0665dfa363dd28bc516ffb7247231f3ab25005036717f5c4c232a5efc7bb74bc03037155cb72b1abe85a33d86eb9f1a336196030443be4f6", mimeType: "text/csv"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof color")).define("viewof color", ["Inputs","dimensions"], _color);
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer()).define(["dimensions","cars","d3","Plot","color"], _3);
  main.variable(observer("dimensions")).define("dimensions", ["cars"], _dimensions);
  main.variable(observer("cars")).define("cars", ["FileAttachment"], _cars);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-delaunay-links"] = { code: "Plot.plot({\n  color: {legend: true},\n  marks: [\n    Plot.delaunayLink(penguins, {x: \"culmen_depth_mm\", y: \"culmen_length_mm\", stroke: \"body_mass_g\", strokeWidth: 1.5})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Delaunay links</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Delaunay links

It can be useful to color the links of the [Delaunay](https://observablehq.com/plot/marks/delaunay) graph based on some property of data, such as the body mass of penguins.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  color: {legend: true},
  marks: [
    Plot.delaunayLink(penguins, {x: "culmen_depth_mm", y: "culmen_length_mm", stroke: "body_mass_g", strokeWidth: 1.5})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-voronoi-scatterplot"] = { code: "Plot.plot({\n  color: {legend: true},\n  marks: [\n    Plot.voronoi(penguins, {x: \"culmen_depth_mm\", y: \"culmen_length_mm\", fill: \"species\", fillOpacity: 0.2, stroke: \"var(--vp-c-bg)\"}),\n    Plot.frame(),\n    Plot.dot(penguins, {x: \"culmen_depth_mm\", y: \"culmen_length_mm\", fill: \"species\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Voronoi scatterplot</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Voronoi scatterplot

The [voronoi](https://observablehq.com/plot/marks/voronoi) mark computes the region closest to each point.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  color: {legend: true},
  marks: [
    Plot.voronoi(penguins, {x: "culmen_depth_mm", y: "culmen_length_mm", fill: "species", fillOpacity: 0.2, stroke: "var(--vp-c-bg)"}),
    Plot.frame(),
    Plot.dot(penguins, {x: "culmen_depth_mm", y: "culmen_length_mm", fill: "species"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-delaunay-hull"] = { code: "Plot.plot({\n  marks: [\n    Plot.delaunayMesh(penguins, {\n      x: \"culmen_depth_mm\",\n      y: \"culmen_length_mm\",\n      z: \"species\",\n      stroke: \"species\",\n      strokeOpacity: 0.6\n    }),\n    Plot.hull(penguins, {\n      x: \"culmen_depth_mm\",\n      y: \"culmen_length_mm\",\n      stroke: \"species\",\n      strokeWidth: 2\n    })\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Delaunay & hull</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Delaunay & hull

The convex [hull](https://observablehq.com/plot/marks/delaunay#hull-data-options) of a set of points—the polygon with the minimum perimeter that contains all the points—can be computed as a derivative of the Delaunay graph.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marks: [
    Plot.delaunayMesh(penguins, {
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      z: "species",
      stroke: "species",
      strokeOpacity: 0.6
    }),
    Plot.hull(penguins, {
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      stroke: "species",
      strokeWidth: 2
    })
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-voronoi-map"] = { code: "Plot.plot({\n  width: 640,\n  height: 640,\n  inset: 2,\n  projection: {\n    type: \"azimuthal-equal-area\",\n    rotate: [96, -40],\n    clip: 24,\n    domain: d3.geoCircle().center([-96, 40]).radius(24)()\n  },\n  marks: [\n    Plot.geo(nation, {fill: \"currentColor\", fillOpacity: 0.2}),\n    Plot.dot(capitals, {x: \"longitude\", y: \"latitude\", r: 2.5, fill: \"currentColor\"}),\n    Plot.voronoi(capitals, {x: \"longitude\", y: \"latitude\", clip: \"sphere\", title: \"state\", pointerEvents: \"all\"}),\n    Plot.sphere({strokeWidth: 2})\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\ncapitals = FileAttachment(\"us-state-capitals.csv\").csv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Voronoi map</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Voronoi map

The [Delaunay and Voronoi](https://observablehq.com/plot/marks/delaunay) marks derive topologies from point clouds. And they are compatible with [projections](https://observablehq.com/plot/features/projections)!`
)}

function _2(Plot,d3,nation,capitals){return(
Plot.plot({
  width: 640,
  height: 640,
  inset: 2,
  projection: {
    type: "azimuthal-equal-area",
    rotate: [96, -40],
    clip: 24,
    domain: d3.geoCircle().center([-96, 40]).radius(24)()
  },
  marks: [
    Plot.geo(nation, {fill: "currentColor", fillOpacity: 0.2}),
    Plot.dot(capitals, {x: "longitude", y: "latitude", r: 2.5, fill: "currentColor"}),
    Plot.voronoi(capitals, {x: "longitude", y: "latitude", clip: "sphere", title: "state", pointerEvents: "all"}),
    Plot.sphere({strokeWidth: 2})
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _capitals(FileAttachment){return(
FileAttachment("us-state-capitals.csv").csv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-state-capitals.csv", {url: "https://static.observableusercontent.com/files/599571a299c8bb9e3f81fba220d57307d17c1efe4f2fd6b286535ce41b9b7309d4c2fc9d56373ce9e3f5013af1e89680bd9705a6a40276e3830675603c613dd4", mimeType: "text/csv"}],
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/783cf2bf259e16d662d92c9f59ec97e564c50841c5984f2bb6f65a6d31f8c1b80846bffb65cb654dc2b587ac96f0007ab68c24bacce33655fd785e46020aff74", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","d3","nation","capitals"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("capitals")).define("capitals", ["FileAttachment"], _capitals);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-walmart-voronoi"] = { code: "Plot.plot({\n  projection: \"albers\",\n  marks: [\n    Plot.geo(nation),\n    Plot.dot(walmarts, {x: \"longitude\", y: \"latitude\", fill: \"currentColor\", r: 1}),\n    Plot.voronoiMesh(walmarts, {x: \"longitude\", y: \"latitude\"})\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\nnation = topojson.feature(us, us.objects.nation)\n\nwalmarts = FileAttachment(\"walmarts.tsv\").tsv({typed: true})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Walmart Voronoi</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Walmart Voronoi

The [Voronoi](https://observablehq.com/plot/marks/delaunay) diagram of the Walmart stores in the contiguous U.S. shows the catchment area of each point.`
)}

function _2(Plot,nation,walmarts){return(
Plot.plot({
  projection: "albers",
  marks: [
    Plot.geo(nation),
    Plot.dot(walmarts, {x: "longitude", y: "latitude", fill: "currentColor", r: 1}),
    Plot.voronoiMesh(walmarts, {x: "longitude", y: "latitude"})
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _walmarts(FileAttachment){return(
FileAttachment("walmarts.tsv").tsv({typed: true})
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["walmarts.tsv", {url: "https://static.observableusercontent.com/files/3711de2a6d1c44df145f2a29f8744771e113672517ed5d84b0fbf76740b423e060d96eb2ae76bc28806b2d3cef37083de88309b3c86baef2807f0e27b2d045f3", mimeType: "text/tab-separated-values"}],
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","nation","walmarts"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("walmarts")).define("walmarts", ["FileAttachment"], _walmarts);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-centroid-voronoi"] = { code: "Plot.voronoi(counties, Plot.centroid()).plot({projection: \"albers\"})\n\nus = FileAttachment(\"us-counties-10m.json\").json()\n\ncounties = topojson.feature(us, us.objects.counties).features", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Centroid Voronoi</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Centroid Voronoi

A classic of creative mapping: take the [centroids](https://observablehq.com/plot/transforms/centroid) of geographic features, and compute their [voronoi](https://observablehq.com/plot/marks/delaunay) diagram.`
)}

function _2(Plot,counties){return(
Plot.voronoi(counties, Plot.centroid()).plot({projection: "albers"})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _counties(topojson,us){return(
topojson.feature(us, us.objects.counties).features
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","counties"], _2);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("counties")).define("counties", ["topojson","us"], _counties);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["visionscarto__planar-vs-spherical-voronoi"] = { code: "compose = Inputs.radio([\"side by side\", \"blue and red\"], {\n  value: \"side by side\"\n})\n\nshow = (projection, frame) => compose === \"side by side\" ?\n  htl.html`<div style=\"display:flex; justify-content: space-between\">\n    ${planar(projection, frame)}\n    ${spherical(projection, frame)}\n  `\n  :\n  htl.html`\n    ${mix(projection, frame)}\n  `\n\nplanar = (projection, frame) =>\n  Plot.plot({\n    width: 0.49 * width,\n    height: 0.49 * width * (projection === \"equal-earth\" ? 0.5 : 1),\n    projection,\n    marks: [\n      Plot.voronoiMesh(points, {\n        clip: \"sphere\",\n        strokeOpacity: 1,\n        strokeWidth: 0.5\n      }),\n      Plot.dot(points, { r: 1, fill: \"black\" }),\n      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()\n    ],\n    caption: \"Planar\"\n  })\n\nspherical = (projection, frame) =>\n  Plot.plot({\n    width: 0.49 * width,\n    height: 0.49 * width * (projection === \"equal-earth\" ? 0.5 : 1),\n    projection,\n    marks: [\n      Plot.geo(d3.geoVoronoi().cellMesh(points), {\n        clip: \"sphere\",\n        strokeOpacity: 1,\n        strokeWidth: 0.5\n      }),\n      Plot.dot(points, { r: 1, fill: \"black\" }),\n      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()\n    ],\n    caption: \"Spherical\"\n  })\n\nmix = (projection, frame) =>\n  Plot.plot({\n    width: 0.49 * width,\n    height: 0.49 * width * (projection === \"equal-earth\" ? 0.5 : 1),\n    projection,\n    marks: [\n      Plot.voronoiMesh(points, {\n        clip: \"sphere\",\n        strokeOpacity: 1,\n        strokeWidth: 0.5,\n        stroke: \"red\"\n      }),\n      Plot.geo(d3.geoVoronoi().cellMesh(points), {\n        clip: \"sphere\",\n        strokeOpacity: 1,\n        strokeWidth: 0.5,\n        stroke: \"blue\"\n      }),\n      Plot.dot(points, { r: 1, fill: \"black\" }),\n      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()\n    ],\n    caption: htl.html`<span><span style=\"color: red\">Planar</span> — <span style=\"color: blue\">Spherical</span>`\n  })\n\nd3 = require(\"d3-geo-voronoi@2\")", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Planar vs. Spherical Voronoi</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Planar vs. Spherical Voronoi

The distances between points projected on the plane are not exactly proportional to the corresponding distances on the sphere. This unescapable mathematical fact creates a discrepancy between the planar Voronoi diagram and its spherical counterpart.

For example, a “true” (spherical) diagram has polygons that cross the antemeridian line, which are impossible on the planar diagram. In general, the planar Voronoi distorts polygons that are close to the edge of the map.

For the sake of simplicity (and for faster loading times), Plot defaults to the planar algorithm. But if you want more accuracy, you can require [d3-geo-voronoi](https://github.com/Fil/d3-geo-voronoi), and let Plot.geo draw its outputs.
`
)}

function _2(md){return(
md`The maps below compare the planar (on the left) and spherical (on the right) Voronoi diagrams associated with a dataset of the [world’s airports](https://observablehq.com/@d3/world-airports-voronoi).`
)}

function _3(show,md){return(
md`## Orthographic
${show("orthographic")}`
)}

function _4(show,md){return(
md`## Mercator
${show("mercator")}`
)}

function _5(show,md){return(
md`## Equal Earth

The distortion near the edges (at the poles and on the antimeridian line) is quite important.

${show("equal-earth")}`
)}

function _6(show,md){return(
md`## Zoom

When we start zooming in, like here with the stereographic projection, the
distortion recedes.

${show("stereographic", true)}
`
)}

function _7(show,md){return(
md`## Focus

Zooming in a bit closer, for example by focusing on the U.S. with Albers’ conic
projection, the distortion is almost invisible.

${show("albers", true)}
`
)}

function _8(md){return(
md`Click on the button below to overlay the maps with blue and red colors.`
)}

function _compose(Inputs){return(
Inputs.radio(["side by side", "blue and red"], {
  value: "side by side"
})
)}

function _10(md){return(
md`---

*supporting code*`
)}

function _show(compose,htl,planar,spherical,mix){return(
(projection, frame) => compose === "side by side" ?
  htl.html`<div style="display:flex; justify-content: space-between">
    ${planar(projection, frame)}
    ${spherical(projection, frame)}
  `
  :
  htl.html`
    ${mix(projection, frame)}
  `
)}

function _planar(Plot,width,points){return(
(projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.voronoiMesh(points, {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: "Planar"
  })
)}

function _spherical(Plot,width,d3,points){return(
(projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.geo(d3.geoVoronoi().cellMesh(points), {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: "Spherical"
  })
)}

function _mix(Plot,width,points,d3,htl){return(
(projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.voronoiMesh(points, {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5,
        stroke: "red"
      }),
      Plot.geo(d3.geoVoronoi().cellMesh(points), {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5,
        stroke: "blue"
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: htl.html`<span><span style="color: red">Planar</span> — <span style="color: blue">Spherical</span>`
  })
)}

function _d3(require){return(
require("d3-geo-voronoi@2")
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.define("module 1", async () => runtime.module((await import("https://api.observablehq.com/d/546b88f86e8150ca@331.js?v=4&resolutions=f59b356f3782a223@197")).default));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["show","md"], _3);
  main.variable(observer()).define(["show","md"], _4);
  main.variable(observer()).define(["show","md"], _5);
  main.variable(observer()).define(["show","md"], _6);
  main.variable(observer()).define(["show","md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof compose")).define("viewof compose", ["Inputs"], _compose);
  main.variable(observer("compose")).define("compose", ["Generators", "viewof compose"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("show")).define("show", ["compose","htl","planar","spherical","mix"], _show);
  main.variable(observer("planar")).define("planar", ["Plot","width","points"], _planar);
  main.variable(observer("spherical")).define("spherical", ["Plot","width","d3","points"], _spherical);
  main.variable(observer("mix")).define("mix", ["Plot","width","points","d3","htl"], _mix);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.define("points", ["module 1", "@variable"], (_, v) => v.import("points", _));
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-crosshair"] = { code: "Plot.plot({\n  marks: [\n    Plot.dot(olympians, {x: \"weight\", y: \"height\", stroke: \"sex\"}),\n    Plot.crosshair(olympians, {x: \"weight\", y: \"height\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Crosshair</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Crosshair

The [crosshair mark](https://observablehq.com/plot/interactions/crosshair) uses the [pointer transform](https://observablehq.com/plot/interactions/pointer) internally to display a [rule](https://observablehq.com/plot/marks/rule) and a [text](https://observablehq.com/plot/marks/text) showing the **x** (horizontal↔︎ position) and **y** (vertical↕︎ position) value of the nearest data.`
)}

function _2(Plot,olympians){return(
Plot.plot({
  marks: [
    Plot.dot(olympians, {x: "weight", y: "height", stroke: "sex"}),
    Plot.crosshair(olympians, {x: "weight", y: "height"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-crosshairx"] = { code: "Plot.plot({\n  style: \"overflow: visible;\",\n  marks: [\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.crosshairX(aapl, {x: \"Date\", y: \"Close\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: CrosshairX</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# CrosshairX

For charts which have a “dominant” dimension, such as time in a time-series chart, use the [crosshairX](https://observablehq.com/plot/interactions/crosshair) mark for the [pointerX](https://observablehq.com/plot/interactions/pointer#pointerx-options) transform.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.lineY(aapl, {x: "Date", y: "Close"}),
    Plot.crosshairX(aapl, {x: "Date", y: "Close"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-one-dimensional-crosshair"] = { code: "Plot.plot({\n  marks: [\n    Plot.tickX(penguins, {x: \"body_mass_g\"}),\n    Plot.crosshairX(penguins, {x: \"body_mass_g\", color: \"red\", opacity: 1})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: One-dimensional crosshair</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# One-dimensional crosshair

If either **x** or **y** is not specified, the [crosshair](https://observablehq.com/plot/interactions/crosshair) is one-dimensional.
`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marks: [
    Plot.tickX(penguins, {x: "body_mass_g"}),
    Plot.crosshairX(penguins, {x: "body_mass_g", color: "red", opacity: 1})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-color-crosshair"] = { code: "Plot.plot({\n  marks: [\n    Plot.dot(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", stroke: \"sex\"}),\n    Plot.crosshair(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", color: \"sex\", opacity: 0.5})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Color crosshair</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Color crosshair

The **color** option of the [crosshair](https://observablehq.com/plot/interactions/crosshair) mark sets the fill color of the text and the stroke color of the rule. This option can be specified as a channel to reinforce a color encoding.`
)}

function _2(Plot,penguins){return(
Plot.plot({
  marks: [
    Plot.dot(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "sex"}),
    Plot.crosshair(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm", color: "sex", opacity: 0.5})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","penguins"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-pointer-transform"] = { code: "pointered = Inputs.toggle({label: \"Use pointer\", value: true})\n\nPlot.plot({\n  marks: [\n    Plot.dot(\n      penguins,\n      pointered\n        ? Plot.pointer({\n            x: \"culmen_length_mm\",\n            y: \"culmen_depth_mm\",\n            fill: \"red\",\n            r: 8\n          })\n        : {x: \"culmen_length_mm\", y: \"culmen_depth_mm\", fill: \"red\", r: 8}\n    ),\n    Plot.dot(penguins, {x: \"culmen_length_mm\", y: \"culmen_depth_mm\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Pointer transform</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Pointer transform

The [pointer transform](https://observablehq.com/plot/interactions/pointer) is not limited to the [tip mark](https://observablehq.com/plot/marks/tip). Below, it is used to filter a filled <span style="border-bottom: solid 2px red;">red</span> dot behind a stroked <span style="border-bottom: solid 2px currentColor;">black</span> dot. As you hover the chart, only the closest red dot to the pointer is rendered. If you remove the pointer transform by toggling the checkbox, all the red dots will be visible.`
)}

function _pointered(Inputs){return(
Inputs.toggle({label: "Use pointer", value: true})
)}

function _3(Plot,penguins,pointered){return(
Plot.plot({
  marks: [
    Plot.dot(
      penguins,
      pointered
        ? Plot.pointer({
            x: "culmen_length_mm",
            y: "culmen_depth_mm",
            fill: "red",
            r: 8
          })
        : {x: "culmen_length_mm", y: "culmen_depth_mm", fill: "red", r: 8}
    ),
    Plot.dot(penguins, {x: "culmen_length_mm", y: "culmen_depth_mm"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof pointered")).define("viewof pointered", ["Inputs"], _pointered);
  main.variable(observer("pointered")).define("pointered", ["Generators", "viewof pointered"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","penguins","pointered"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-pointer-modes-x-y-and-xy"] = { code: "pointermode = Inputs.radio([\"xy\", \"x\", \"y\"], {value: \"x\", label: \"Pointer mode\"})\n\nPlot.lineY(aapl, {x: \"Date\", y: \"Close\", tip: pointermode}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Pointer modes (x, y, and xy)</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Pointer modes (x, y, and xy)

The [pointer transform](https://observablehq.com/plot/interactions/pointer) supports both one- and two-dimensional pointing modes. The two-dimensional mode, **pointer**, is suitable for scatterplots and the general case: it finds the point closest to the pointer by measuring distance in *x* and *y*. The one-dimensional modes, **pointerX** and **pointerY**, in contrast only consider distance in one dimension; this is desirable when a chart has a “dominant” dimension, such as time in a time-series chart, the binned quantitative dimension in a histogram, or the categorical dimension of a bar chart.

Try the different modes on the line chart below to get a feel for their behavior.`
)}

function _pointermode(Inputs){return(
Inputs.radio(["xy", "x", "y"], {value: "x", label: "Pointer mode"})
)}

function _3(Plot,aapl,pointermode){return(
Plot.lineY(aapl, {x: "Date", y: "Close", tip: pointermode}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof pointermode")).define("viewof pointermode", ["Inputs"], _pointermode);
  main.variable(observer("pointermode")).define("pointermode", ["Generators", "viewof pointermode"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","aapl","pointermode"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-multi-series-line-chart-interactive-tips"] = { code: "Plot.plot({\n  marks: [\n    Plot.ruleY([0]),\n    Plot.lineY(industries, {x: \"date\", y: \"unemployed\", stroke: \"industry\", tip: \"x\"})\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Multi-series line chart, interactive tips</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Multi-series line chart, interactive tips

The [pointerX transform](https://observablehq.com/plot/interactions/pointer) respects the dominant dimension (time) by finding the closest point on *x*, but disambiguates between series by also considering the *y* dimension to breaks ties.`
)}

function _2(Plot,industries){return(
Plot.plot({
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(industries, {x: "date", y: "unemployed", stroke: "industry", tip: "x"})
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","industries"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-one-dimensional-pointing"] = { code: "tipmode = Inputs.radio([\"xy\", \"x\"], {value: \"x\", label: \"Tip mode\"})\n\nPlot.plot({\n  x: {label: \"Daily volume (log₁₀)\"},\n  marks: [\n    Plot.rectY(aapl, Plot.binX({y: \"count\"}, {x: (d) => Math.log10(d.Volume), thresholds: 40, tip: tipmode})),\n    Plot.dot(aapl, Plot.stackY(Plot.binX({y: \"count\"}, {x: (d) => Math.log10(d.Volume), thresholds: 40, stroke: \"red\"})))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: One-dimensional pointing</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# One-dimensional pointing

One-dimensional [pointing](https://observablehq.com/plot/interactions/pointer) makes even small bars or rects easily hoverable. If you switch the histogram below to two-dimensional pointing, you must hover near a rect’s centroid (shown in <span style="border-bottom: solid 2px red;">red</span>) to trigger a tip, whereas one-dimensional pointing triggers the tip anywhere in the chart.`
)}

function _tipmode(Inputs){return(
Inputs.radio(["xy", "x"], {value: "x", label: "Tip mode"})
)}

function _3(Plot,aapl,tipmode){return(
Plot.plot({
  x: {label: "Daily volume (log₁₀)"},
  marks: [
    Plot.rectY(aapl, Plot.binX({y: "count"}, {x: (d) => Math.log10(d.Volume), thresholds: 40, tip: tipmode})),
    Plot.dot(aapl, Plot.stackY(Plot.binX({y: "count"}, {x: (d) => Math.log10(d.Volume), thresholds: 40, stroke: "red"})))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof tipmode")).define("viewof tipmode", ["Inputs"], _tipmode);
  main.variable(observer("tipmode")).define("tipmode", ["Generators", "viewof tipmode"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","aapl","tipmode"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-pointer-target-position"] = { code: "Plot.plot({\n  height: 160,\n  y: {axis: \"right\", grid: true, nice: true},\n  marks: [\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.ruleX(aapl, Plot.pointerX({x: \"Date\", py: \"Close\", stroke: \"red\"})),\n    Plot.dot(aapl, Plot.pointerX({x: \"Date\", y: \"Close\", stroke: \"red\"})),\n    Plot.text(aapl, Plot.pointerX({px: \"Date\", py: \"Close\", dy: -17, frameAnchor: \"top-left\", fontVariant: \"tabular-nums\", text: (d) => [`Date ${Plot.formatIsoDate(d.Date)}`, `Close ${d.Close.toFixed(2)}`].join(\"   \")}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Pointer target position</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Pointer target position

The **px** and **py** channels may be used with the [pointer transform](https://observablehq.com/plot/interactions/pointer) to specify pointing target positions independent of the displayed mark. Below, text in the top-left corner shows the focused date and closing price. The focused point is also highlighted with a red dot and rule.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  height: 160,
  y: {axis: "right", grid: true, nice: true},
  marks: [
    Plot.lineY(aapl, {x: "Date", y: "Close"}),
    Plot.ruleX(aapl, Plot.pointerX({x: "Date", py: "Close", stroke: "red"})),
    Plot.dot(aapl, Plot.pointerX({x: "Date", y: "Close", stroke: "red"})),
    Plot.text(aapl, Plot.pointerX({px: "Date", py: "Close", dy: -17, frameAnchor: "top-left", fontVariant: "tabular-nums", text: (d) => [`Date ${Plot.formatIsoDate(d.Date)}`, `Close ${d.Close.toFixed(2)}`].join("   ")}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-line-chart-interactive-tip"] = { code: "Plot.lineY(aapl, {x: \"Date\", y: \"Close\", tip: true}).plot({y: {grid: true}})\n\nPlot.plot({\n  y: {grid: true},\n  marks: [\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.tip(aapl, Plot.pointerX({x: \"Date\", y: \"Close\"}))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Line chart, interactive tip</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Line chart, interactive tip`
)}

function _2(Plot,aapl){return(
Plot.lineY(aapl, {x: "Date", y: "Close", tip: true}).plot({y: {grid: true}})
)}

function _3(md){return(
md`The above code uses the tip [mark option](https://observablehq.com/plot/features/marks#mark-options); the code can be written more explicitly with a [tip mark](https://observablehq.com/plot/marks/tip) and a [pointer transform](https://observablehq.com/plot/interactions/pointer):`
)}

function _4(Plot,aapl){return(
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.lineY(aapl, {x: "Date", y: "Close"}),
    Plot.tip(aapl, Plot.pointerX({x: "Date", y: "Close"}))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","aapl"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-static-annotations"] = { code: "Plot.plot({\n  y: {grid: true},\n  marks: [\n    Plot.lineY(aapl, {x: \"Date\", y: \"Close\"}),\n    Plot.tip(\n      [`Apple stock reaches a new high of $133 on Feb. 23, 2015. The release of the first Apple Watch, slated for April, is hotly anticipated.`],\n      {x: new Date(\"2015-02-23\"), y: 133, dy: -3, anchor: \"bottom\"}\n    ),\n    Plot.tip(\n      [`Apple stock drops 8% after the company misses Q2 revenue targets and reports declining iPhone sales. It reaches a two-year low of $90.34 on May 12.`],\n      {x: new Date(\"2016-05-12\"), y: 90.34, dy: 3, anchor: \"top\"}\n    )\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Static annotations</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Static annotations

The [tip mark](https://observablehq.com/plot/marks/tip) can be used for static annotations, say to draw attention to elements of interest or to add context.`
)}

function _2(Plot,aapl){return(
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.lineY(aapl, {x: "Date", y: "Close"}),
    Plot.tip(
      [`Apple stock reaches a new high of $133 on Feb. 23, 2015. The release of the first Apple Watch, slated for April, is hotly anticipated.`],
      {x: new Date("2015-02-23"), y: 133, dy: -3, anchor: "bottom"}
    ),
    Plot.tip(
      [`Apple stock drops 8% after the company misses Q2 revenue targets and reports declining iPhone sales. It reaches a two-year low of $90.34 on May 12.`],
      {x: new Date("2016-05-12"), y: 90.34, dy: 3, anchor: "top"}
    )
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","aapl"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-tips-longer-text"] = { code: "Plot.plot({\n  grid: true,\n  marks: [\n    Plot.dot(olympians, {\n      x: \"weight\",\n      y: \"height\",\n      fy: \"sex\",\n      sort: (d) => !!d.info,\n      stroke: (d) => d.info ? \"currentColor\" : \"#aaa\"\n    }),\n    Plot.tip(olympians, Plot.pointer({\n      x: \"weight\",\n      y: \"height\",\n      fy: \"sex\",\n      filter: (d) => d.info,\n      title: (d) => [d.name, d.info].join(\"\\n\\n\")\n    }))\n  ]\n})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Interactive tips with longer text</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Interactive tips with longer text

The [tip mark](https://observablehq.com/plot/marks/tip) supports the **title** channel for longer texts.`
)}

function _2(Plot,olympians){return(
Plot.plot({
  grid: true,
  marks: [
    Plot.dot(olympians, {
      x: "weight",
      y: "height",
      fy: "sex",
      sort: (d) => !!d.info,
      stroke: (d) => d.info ? "currentColor" : "#aaa"
    }),
    Plot.tip(olympians, Plot.pointer({
      x: "weight",
      y: "height",
      fy: "sex",
      filter: (d) => d.info,
      title: (d) => [d.name, d.info].join("\n\n")
    }))
  ]
})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-tips-additional-channels"] = { code: "Plot.dot(olympians, {\n  x: \"weight\",\n  y: \"height\",\n  stroke: \"sex\",\n  channels: {name: \"name\", sport: \"sport\"},\n  tip: true\n}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Interactive tips with additional channels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Interactive tips with additional channels

If no **title** channel is supplied, the [tip mark](https://observablehq.com/plot/marks/tip) displays all channel values. You can supply additional name-value pairs by registering extra channels using the **channels** mark option.`
)}

function _2(Plot,olympians){return(
Plot.dot(olympians, {
  x: "weight",
  y: "height",
  stroke: "sex",
  channels: {name: "name", sport: "sport"},
  tip: true
}).plot()
)}

function _3(md){return(
md`<blockquote style="font-family: sans-serif; font-size: smaller;">The tallest athlete in this dataset, swimmer **Kevin Cordes**, is likely an error: his official height is 1.96m (6′ 5″) not 2.21m (7′ 3″). Basketball player **Li Muhao** is likely the true tallest. — _Can you spot them?_`
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  main.variable(observer()).define(["md"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-tip-format"] = { code: "Plot.dot(olympians, {\n  x: \"weight\",\n  y: \"height\",\n  stroke: \"sex\",\n  channels: {\n    name: \"name\",\n    nationality: {\n      value: \"nationality\",\n      label: \"country\"\n    },\n    sport: \"sport\"\n  },\n  tip: {\n    format: {\n      name: true,\n      sport: true,\n      nationality: true,\n      y: (d) => `${d}m`,\n      x: (d) => `${d}kg`,\n      stroke: false\n    }\n  }\n}).plot()", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Tip format</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Tip format`
)}

function _2(md){return(
md`The [tip](https://observablehq.com/plot/marks/tip) **format** option controls which channels are displayed and how, and in what order. A channel’s label can be specified alongside its value in the **channels** option as a {value, label} object (_e.g._, country).`
)}

function _3(Plot,olympians){return(
Plot.dot(olympians, {
  x: "weight",
  y: "height",
  stroke: "sex",
  channels: {
    name: "name",
    nationality: {
      value: "nationality",
      label: "country"
    },
    sport: "sport"
  },
  tip: {
    format: {
      name: true,
      sport: true,
      nationality: true,
      y: (d) => `${d}m`,
      x: (d) => `${d}kg`,
      stroke: false
    }
  }
}).plot()
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["Plot","olympians"], _3);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-tips-paired-channels"] = { code: "Plot.rectY(olympians, Plot.binX({y: \"count\"}, {x: \"weight\", fill: \"sex\", tip: true})).plot()\n\nPlot.rectY(olympians, Plot.binX({y: \"sum\"}, {x: \"weight\", y: (d) => d.sex === \"male\" ? 1 : -1, fill: \"sex\", tip: true})).plot({y: {label: \"Frequency\"}})", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Tips, paired channels</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Tips, paired channels

The [tip mark](https://observablehq.com/plot/marks/tip) recognizes that **x1** & **x2** and **y1** & **y2** are paired channels. They can represent either an extent (_e.g.,_ the boundaries of the bins) or a length (_e.g.,_ the frequency).`
)}

function _2(Plot,olympians){return(
Plot.rectY(olympians, Plot.binX({y: "count"}, {x: "weight", fill: "sex", tip: true})).plot()
)}

function _3(md){return(
md`This even works when stacking negative values, say to mirror the histogram instead of stacking it. (The tip displays negative frequency, but this is consistent with the *y* axis.)`
)}

function _4(Plot,olympians){return(
Plot.rectY(olympians, Plot.binX({y: "sum"}, {x: "weight", y: (d) => d.sex === "male" ? 1 : -1, fill: "sex", tip: true})).plot({y: {label: "Frequency"}})
)}

function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","olympians"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","olympians"], _4);
  return main;
}

return define;
})() };
window.PLOT_NOTEBOOKS["observablehq__plot-maps-tips"] = { code: "Plot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(states),\n    Plot.tip(states, Plot.geoCentroid({title: (d) => d.properties.name, anchor: \"bottom\", textPadding: 3}))\n  ]\n})\n\nPlot.plot({\n  projection: \"albers-usa\",\n  marks: [\n    Plot.geo(states),\n    Plot.tip(states, Plot.pointer(Plot.geoCentroid({title: (d) => d.properties.name})))\n  ]\n})\n\nus = FileAttachment(\"us-counties-10m@1.json\").json()\n\nstates = topojson.feature(us, us.objects.states).features", imports: [], define: (function(){
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Map and tips</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Map and tips

The [centroid transform](https://observablehq.com/plot/transforms/centroid) can derive **x** and **y** channels from [geometries](https://observablehq.com/plot/marks/geo), thus allowing the placement of [tips](https://observablehq.com/plot/marks/tip).`
)}

function _2(Plot,states){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states),
    Plot.tip(states, Plot.geoCentroid({title: (d) => d.properties.name, anchor: "bottom", textPadding: 3}))
  ]
})
)}

function _3(md){return(
md`For interactive tips, just combine the [pointer](https://observablehq.com/plot/interactions/pointer) and [centroid](https://observablehq.com/plot/transforms/centroid) transforms:`
)}

function _4(Plot,states){return(
Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(states),
    Plot.tip(states, Plot.pointer(Plot.geoCentroid({title: (d) => d.properties.name})))
  ]
})
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m@1.json").json()
)}

function _states(topojson,us){return(
topojson.feature(us, us.objects.states).features
)}

function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["us-counties-10m@1.json", {url: "https://static.observableusercontent.com/files/e34d00a1441938da12b88603d3f2f6012369d8f1bec25ed9fb6db16c0d16d5ea4861bd6066275b8de9cc4ea3db735741008c4245e8142cd10c13ffa4c9741873", mimeType: "application/json"}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","states"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","states"], _4);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("states")).define("states", ["topojson","us"], _states);
  return main;
}

return define;
})() };
