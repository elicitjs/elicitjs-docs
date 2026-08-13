import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "trend(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A single-datum parametric line; the line itself is non-interactive and each handle is a draggable circle claimed by its own parameter.
      </>
    ),
    signatures: [
      "trend({ channels, anchor, grip, probe, handles, handleSize, handleColor, id }) → Feature",
    ],
    options: [
      {
        name: "anchor",
        type: "number",
        default: "0 (if in x domain), else the first domain end",
        desc: "x position of the intercept handle and the slope-rotation pivot. 0 is the classic y-intercept.",
      },
      {
        name: "grip",
        type: "\"end\" | \"probe\"",
        default: "\"end\"",
        desc: "Where the slope grips sit. end mounts a pair on the line's own ends, and a drag passes the line through the pointer — so it swings all the way round. probe pins one at x = probe, sliding vertically at that column, which caps the reachable slope at ySpan / (probe − anchor).",
      },
      {
        name: "probe",
        type: "number",
        default: "the other x-domain end",
        desc: "The column a pinned slope grip sits at, under grip: \"probe\" only. Setting it under the default grip warns.",
      },
      {
        name: "handles",
        type: "boolean | \"hit\"",
        default: "true",
        desc: "Draw the grab handles. Turn them off when the line is driven from the plane instead; \"hit\" keeps them grabbable but invisible.",
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Handle circle radius.",
      },
      {
        name: "handleColor",
        type: "string",
        default: "the mark's fill",
        desc: "Handle circle paint.",
      },
    ],
    channels: [
      {
        name: "x, y",
        type: "field",
        desc: "The plot's AXES, not columns of the datum. Declare their domains in the schema.",
      },
      {
        name: "intercept",
        type: "field | datum",
        default: "field \"intercept\"",
        desc: "The line's value at x = 0. Unscaled — a parameter in its own units, projected through y.",
      },
      {
        name: "slope",
        type: "field | datum",
        default: "field \"slope\"",
        desc: "The line's slope, in y units per x unit. Unscaled. Pin either parameter with { datum: 0 } to make it a constant no edit can write.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting the <code className="inline">line</code> (edge-to-edge through the plot) plus handle <code className="inline">circle</code>s tagged <code className="inline">intercept</code> / <code className="inline">slope</code> — one at the anchor, and one at each end of the line under the default grip. Sets <code className="inline">isTrend</code> so unspecified chart axes cross at the origin.
      </>
    ),
  },
  {
    name: "trendBand(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. The uncertainty around a parametric line: every line the belief’s ranges allow, drawn as one envelope, a stack of nested envelopes, or a fan of samples. Declares no edits of its own — put them on the mark the reader grabs.
      </>
    ),
    signatures: [
      "trendBand({ channels, render, levels, samples, seed, sigma, distribution, anchor, grip, probe, handles, handleSize, id }) → Feature",
    ],
    options: [
      {
        name: "render",
        type: "\"region\" | \"gradient\" | \"samples\"",
        default: "\"region\"",
        desc: "One exact envelope polygon; nested envelopes stacked so the ink darkens toward the line; or individual sampled lines.",
      },
      {
        name: "levels",
        type: "number",
        default: "5",
        desc: "gradient only — how many nested envelopes. Their opacities compound to fillOpacity at the centre.",
      },
      {
        name: "samples",
        type: "number",
        default: "60",
        desc: "samples only — how many lines to draw from the family.",
      },
      {
        name: "seed",
        type: "number",
        default: "7",
        desc: "samples only — PRNG seed, so the fan is stable across re-renders.",
      },
      {
        name: "distribution",
        type: "\"normal\" | \"uniform\"",
        default: "\"normal\"",
        desc: "samples only — normal treats the bounds as a sigma-wide envelope; uniform spreads flat across them.",
      },
      {
        name: "sigma",
        type: "number",
        default: "1.96",
        desc: "The envelope half-width in standard deviations when sampling normally, so ~95% of draws land inside the band that was pointed at.",
      },
      {
        name: "grip",
        type: "\"end\" | \"probe\"",
        default: "\"end\"",
        desc: "As trend — end mounts the slopeSpread grips on the ends of the band's own upper edge, so opening the cone is not capped by how far one pinned column reaches.",
      },
      {
        name: "handles",
        type: "boolean | \"hit\"",
        default: "false",
        desc: "Draw a grab on each spread: the intercept's at the anchor, the slope's on the upper edge (see grip).",
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Handle circle radius.",
      },
      {
        name: "fillOpacity",
        type: "number",
        default: "0.18",
        desc: "region / gradient — the ink of the filled envelope. Gradient divides it across levels so the stack compounds back to it.",
      },
      {
        name: "strokeOpacity",
        type: "number",
        default: "0.15",
        desc: "samples — the ink of ONE line in the fan, so raising samples darkens the overlap and lowering this thins it back out.",
      },
    ],
    channels: [
      {
        name: "x, y, intercept, slope",
        desc: "As trend — the axes, and the line the band surrounds.",
      },
      {
        name: "interceptSpread, slopeSpread",
        type: "field",
        desc: "HALF-WIDTHS in the field's own units: the symmetric form, and what one pointer distance sets.",
      },
      {
        name: "intercept1 / intercept2, slope1 / slope2",
        type: "field",
        desc: "Explicit asymmetric ranges, the same 1/2 span spelling area and rect use. These win wherever both forms are declared.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one <code className="inline">path</code> (region), <code className="inline">levels</code> paths (gradient), or <code className="inline">samples</code> <code className="inline">line</code>s — all inert and painted in the background layer — plus the optional spread handles.
      </>
    ),
  },
  {
    name: "edit.trend.*",
    summary: (
      <>
        The trend-scoped edits. Each inverts the pointer through <code className="inline">x</code>/<code className="inline">y</code> and solves for the parameter it owns, writing the column that parameter’s channel names. A pinned parameter is never written.
      </>
    ),
    signatures: [
      "edit.trend.intercept({ anchor, probe, ...EditOptions }) → Edit",
      "edit.trend.slope({ anchor, probe, ...EditOptions }) → Edit",
      "edit.trend.interceptSpread({ anchor, probe, ...EditOptions }) → Edit",
      "edit.trend.slopeSpread({ anchor, probe, ...EditOptions }) → Edit",
    ],
    options: [
      {
        name: "anchor",
        type: "number",
        default: "the mark's anchor",
        desc: "The pivot: the x whose value a rotation holds, and where an intercept drag places the line.",
      },
      {
        name: "probe",
        type: "number",
        default: "the mark's probe",
        desc: "The x a PINNED handle drag measures at (one drawn under grip: \"probe\"). An end-mounted grip, and a gesture carrying no node at all (a plane or probe pick), use the pointer's own x instead, so the line follows the cursor.",
      },
    ],
    returns: (
      <>
        An <b>Edit</b> with <code className="inline">scope: "trend"</code>, claiming the handle tagged with its own channel. <code className="inline">trend()</code> generates the first two for you; declare them yourself to restage them, retarget them, or drive them from the plane.
      </>
    ),
  },
];
