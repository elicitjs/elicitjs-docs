// What the ORIGINALS need: Vega-Lite (via vega-embed) and Plot (via the
// Observable runtime, which runs each gallery notebook as published).
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';
import vegaEmbed from 'vega-embed';
import * as Plot from '@observablehq/plot';
import { Runtime, Inspector } from '@observablehq/runtime';
import { Library } from '@observablehq/stdlib';
window.vega = vega; window.vegaLite = vegaLite; window.vegaEmbed = vegaEmbed;
window.Plot = Plot; window.ObservableRuntime = { Runtime, Inspector, Library };
