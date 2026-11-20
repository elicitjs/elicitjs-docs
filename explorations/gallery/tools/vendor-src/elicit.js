// The ElicitJS bundle: the library (from the sibling repo's source), d3 for data
// prep, and topojson-client for maps. Exposed as globals for classic scripts.
import * as elicit from '../../../../elicitjs/src/index.js';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
window.elicit = elicit; window.d3 = d3; window.topojson = topojson;
