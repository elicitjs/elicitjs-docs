// The feature-gap vocabulary. An entry's `needs` names what ElicitJS is MISSING
// for that example (it blocks a `none`, or degrades a `partial`); its `prep` names
// the transforms a recreation computes in plain JavaScript before calling Elicit.
// Keep keys stable: the analysis page counts them.
GALLERY.defineFeatures({
  // ---------------------------------------------------------------- layout
  'facet': { label: 'Faceting', description: 'Small multiples: one chart per value of a field (`facet`, `row`/`column`, `fx`/`fy`), sharing scales.' },
  'concat': { label: 'Multi-view layout', description: 'Several coordinated views in one spec (`hconcat`/`vconcat`/`repeat`, marginal plots, overview+detail).' },
  'dual-axis': { label: 'Independent scales', description: 'Two layers with independent scales on one axis (dual y-axis, `resolve: independent`).' },
  'title': { label: 'Titles & captions', description: 'Chart title, subtitle or caption as part of the spec.' },

  // ---------------------------------------------------------------- view interaction
  'selection': { label: 'Selection-driven encoding', description: 'View-side interaction that changes how OTHER marks draw (highlight/filter by a brush, click or hover param, crossfilter, linked views). ElicitJS selections exist, but they select rows to edit; they do not drive conditional encodings or filters.' },
  'tooltip': { label: 'Tooltips', description: 'Hover tooltips / Plot `tip` mark showing row details.' },
  'zoom': { label: 'Linked domains', description: 'A brush or selection in one view that sets another view\'s scale domain (overview + detail, a minimap), or pan and zoom shared across panels. Wheel zoom and drag pan on one view exist (`edit.axis.zoom()`, `edit.axis.pan()`).' },
  'input-widgets': { label: 'Bound input widgets', description: 'Sliders, dropdowns or search boxes bound to chart parameters.' },

  // ---------------------------------------------------------------- marks
  'image-mark': { label: 'Image mark', description: 'Drawing an image (URL) per row.' },
  'trail-mark': { label: 'Variable-width line', description: 'A line whose width varies along its length (`trail`, size along a path).' },
  'vector-mark': { label: 'Vector / arrow / spike', description: 'Arrow, vector or spike marks with per-row length and direction.' },
  'link-mark': { label: 'Free-standing link mark', description: 'A segment from (x1,y1) to (x2,y2) per row of ONE table (Plot `link`/`arrow`) rather than a join between two tables.' },
  'boxplot': { label: 'Box plot mark', description: 'A box-and-whisker composite with automatic quartile/outlier computation.' },
  'hexbin': { label: 'Hexagonal binning', description: 'Hexbin transform and hexagon mark.' },
  'density-2d': { label: 'Contours & 2-D density', description: 'Contour lines/fills, 2-D kernel density, isolines.' },
  'raster': { label: 'Raster', description: 'Per-pixel image rendering of a field or function.' },
  'delaunay': { label: 'Delaunay / Voronoi', description: 'Delaunay meshes, Voronoi cells and convex hulls.' },
  'tree': { label: 'Tree / hierarchy layout', description: 'Tree, cluster or other hierarchy layouts.' },
  'text-layout': { label: 'Label layout', description: 'Automatic label placement: dodged/occlusion-avoiding labels, text along a line, a label at a line end. (Halos, rotated tick labels and two-line tick labels exist: `stroke` on text, an axis `labelAngle`, a `\\n` in `tickFormat`.)' },
  'gradient': { label: 'Gradient fill', description: 'Linear or radial gradient paint on a mark.' },
  'stroke-dash': { label: 'Dash as an encoding', description: '`strokeDash` encoded by a field, or a line that is dashed for part of its length.' },
  'variable-paint-line': { label: 'Varying colour along a line', description: 'A line whose stroke varies per segment (z-less colour encoding).' },
  'radius-channel': { label: 'Radius encoding', description: 'A radial position channel (Vega-Lite `radius`, rose / radial plots).' },
  'stack-offset': { label: 'Stack offsets', description: 'Stack layouts beyond zero-based: normalize to 100%, center/silhouette, wiggle (streamgraph), diverging with a neutral middle, stack order controls.' },
  'horizon': { label: 'Horizon bands', description: 'Horizon charts: a series folded into overlapping coloured bands.' },
  'dodge': { label: 'Dodge / beeswarm', description: 'Collision-avoiding placement of dots (beeswarm, dodge transform), or random jitter as a transform.' },
  'clip': { label: 'Clipping to a geometry', description: 'Clipping marks to a shape (the sphere, a facet frame). Clipping to the plot rectangle exists (`clip`, `clip: { pad }`, and on by default under zoom and pan).' },
  'interval-band': { label: 'Error bar / band composite', description: 'Built-in error bar or error band computed from raw rows (`errorbar`, `errorband`).' },

  // ---------------------------------------------------------------- scales & axes
  'scale-discretize': { label: 'Discretizing scales', description: 'Quantize, quantile and threshold scales (and their legends).' },
  'scale-interval': { label: 'Time-unit / interval scales', description: 'Interval-aware band scales (Plot `interval`), time units as a scale option.' },
  'axis-custom': { label: 'Axis customization', description: 'Axis placements a single axis cannot make: an axis between two mirrored panels, facet headers as axis labels, tick dashes. (Label angle, alignment and offset, labels inside the plot, per-tick styling, two-line labels, title anchoring, offset, spine/tick toggles, grid dashes, band-edge gridlines and zero lines, and a plot panel exist — see /theming and /marks/axes.)' },
  'color-scheme': { label: 'Named colour schemes', description: 'Vega’s own schemes (e.g. `lighttealblue`), or a named scheme on a sqrt/log/symlog colour scale. (Every d3-scale-chromatic scheme can be named with `scheme`.)' },
  'legend-custom': { label: 'Legend customization', description: 'Legend layouts and forms ElicitJS does not draw.' },

  // ---------------------------------------------------------------- geo
  'projection': { label: 'Projection options', description: 'Projections or projection parameters ElicitJS does not offer.' },
  'geo-transform': { label: 'Geo transforms', description: 'Geo centroid, geo-to-pixel transforms, sphere/graticule, spherical lines.' },
  'topojson': { label: 'TopoJSON input', description: 'Reading TopoJSON / feature collections directly from the spec.' },

  // ---------------------------------------------------------------- scale of data
  'dense-data': { label: 'Dense data', description: 'Thousands of marks; a recreation renders but an elicitation over every row is not meaningful.' },
});

// Transforms computed in plain JavaScript (usually d3) before calling Elicit.
GALLERY.defineFeatures({
  'prep-aggregate': { label: 'Aggregate', description: 'Group and summarize (count, mean, sum, joinaggregate, groupX/groupY).' },
  'prep-bin': { label: 'Bin', description: 'Binning into histograms (1-D or 2-D).' },
  'prep-window': { label: 'Window', description: 'Running/cumulative values, moving averages, rank, top-k, lag/lead.' },
  'prep-density': { label: 'Density', description: 'Kernel density estimation.' },
  'prep-regression': { label: 'Regression', description: 'Linear/loess/polynomial regression and quantiles.' },
  'prep-reshape': { label: 'Fold / pivot', description: 'Reshaping wide to long (fold) or long to wide (pivot).' },
  'prep-lookup': { label: 'Lookup / join', description: 'Joining two datasets by a key.' },
  'prep-calculate': { label: 'Calculate / filter', description: 'Derived columns, filters, sequences, sorting and time-unit extraction.' },
  'prep-stack': { label: 'Stack offsets', description: 'Stack offsets (normalize, center) computed by hand.' },
  'prep-geo': { label: 'Geo conversion', description: 'TopoJSON to GeoJSON, centroids, or projection math done by hand.' },
});
