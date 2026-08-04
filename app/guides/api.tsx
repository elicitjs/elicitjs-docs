import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "guides.rule · guides.region · guides.proximity",
    summary: (
      <>
        Import from <code className="inline">elicit.guides</code> and pass in the chart’s <code className="inline">guides: [...]</code>. All position in <b>data space</b> through the same <code className="inline">scale.encode()</code> a mark uses, so they compose across scale types. Non-interactive.
      </>
    ),
    signatures: [
      "guides.rule({ x?, y?, stroke, strokeDasharray, label }) → Guide",
      "guides.region({ x?, y?, fill, opacity }) → Guide",
      "guides.proximity({ target, color }) → Guide",
      "guides.custom((ctx) => FeatureNode[]) → Guide",
      "",
      "// any option may be a function of the guide context:",
      "guides.rule({ y: ({ data }) => d3.mean(data, (d) => d.y), label: \"mean\" })",
    ],
    options: [
      {
        name: "rule.x / y",
        type: "any | (ctx) => any",
        default: "—",
        desc: "The value to draw the reference line at (a number, a category, or a function of the data).",
      },
      {
        name: "rule.label",
        type: "string | (ctx) => string",
        default: "—",
        desc: "Optional text label near the line.",
      },
      {
        name: "rule.stroke / strokeDasharray",
        type: "style",
        default: "#64748b / '5 4'",
        desc: "Line colour and dash pattern.",
      },
      {
        name: "region.x / y",
        type: "[a, b] | (ctx) => [a, b]",
        default: "—",
        desc: "The two values to shade between on that axis.",
      },
      {
        name: "region.fill / opacity",
        type: "style",
        default: "#64748b / 0.1",
        desc: "Band fill and opacity.",
      },
      {
        name: "proximity.target",
        type: "string",
        default: "—",
        desc: "The feature id whose nearest-pick selection to visualize (ring + highlight).",
      },
      {
        name: "proximity.color",
        type: "string",
        default: "effect",
        desc: "Override the highlight colour (else the effects layer’s).",
      },
    ],
    returns: (
      <>
        Each returns a <b>Guide</b> (<code className="inline">{'{'} isGuide: true, build(ctx) {'}'}</code>), rebuilt every render so it tracks live data.
      </>
    ),
  },
  {
    name: "guide (on an edit)",
    summary: (
      <>
        What an edit draws about its own <b>rules</b>. <code className="inline">guide: true</code> turns on <code className="inline">bounds</code> and <code className="inline">catchment</code> at their defaults; an object turns parts on individually and restyles them.
      </>
    ),
    signatures: [
      "guide: true | false | { bounds, catchment, track, color }",
    ],
    options: [
      {
        name: "bounds",
        type: "boolean | object",
        default: "on with guide: true",
        desc: "Constraint boundaries on the edit's own value channel — a clamp's band and limit lines, a snap's stops, a maintainSum cap.",
      },
      {
        name: "catchment",
        type: "boolean | object",
        default: "on with guide: true",
        desc: "The reach of a proximity pick: the radius within which a free pointer resolves to a mark. Only drawn by picks that select one.",
      },
      {
        name: "track",
        type: "boolean | object",
        default: "off",
        desc: "Where a handle can travel. Opt-in: extra ink on a chart that already shows the handle, and worth it when the range isn't obvious.",
      },
      {
        name: "color",
        type: "string",
        default: "theme.constraint.color",
        desc: "One colour for every part; a part's own colour still wins.",
      },
      {
        name: "<part>.dash · width · opacity",
        type: "any",
        default: "—",
        desc: "Per-part stroke appearance. Every one of these used to be a hard-coded literal.",
      },
    ],
  },
];
