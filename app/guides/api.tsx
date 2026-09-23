import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "guides.rule · guides.region · guides.remaining · guides.proximity",
    summary: (
      <>
        Import from <code className="inline">elicit.guides</code> and pass in the chart’s <code className="inline">guides: [...]</code>. All position in <b>data space</b> through the same <code className="inline">scale.encode()</code> a mark uses, so they compose across scale types. Non-interactive.
      </>
    ),
    signatures: [
      "guides.rule({ x?, y?, label, stroke, strokeDasharray, strokeWidth, opacity }) → Guide",
      "guides.region({ x?, y?, fill, opacity }) → Guide",
      "guides.remaining({ field, total?, unit?, format?, anchor?, label?, fill?, fontSize? }) → Guide",
      "guides.proximity({ target, stroke, strokeDasharray, strokeWidth, opacity }) → Guide",
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
        desc: "The value to draw the reference line at — a number, a category, or a function of the data. Give both for a crosshair.",
      },
      {
        name: "rule.label",
        type: "string | (ctx) => string",
        default: "—",
        desc: "Text drawn beside the line.",
      },
      {
        name: "rule.stroke / strokeDasharray / strokeWidth / opacity",
        type: "style",
        default: "theme.guide.rule",
        desc: "Line paint. Restyle every reference line at once through the theme instead.",
      },
      {
        name: "region.x / y",
        type: "[a, b] | (ctx) => [a, b]",
        default: "—",
        desc: "The two values to shade between on that axis. Give both for a rectangle.",
      },
      {
        name: "region.fill / opacity",
        type: "style",
        default: "#64748b / 0.1",
        desc: "Band fill and opacity.",
      },
      {
        name: "remaining.field / total",
        type: "string | (ctx) => string  ·  number | (ctx) => number",
        default: "'y' · from constraints",
        desc: "The column being allocated, and the target sum. Omit `total` and it reads the target from the chart's `maintainSum` constraint, so the total you enforce and the total you show stay one number.",
      },
      {
        name: "remaining.unit / anchor / label",
        type: "string · string · (remaining, used, total) => string",
        default: "— · 'top-right' · —",
        desc: "`unit` gives the countable phrasing (\"3 tokens left\"); `anchor` picks the corner; `label` replaces the wording entirely.",
      },
      {
        name: "remaining.format",
        type: "string | fn",
        default: "auto",
        desc: "How the number reads: a d3-format string, or a formatter function.",
      },
      {
        name: "remaining.fill / fontSize",
        type: "string / number",
        default: "theme / 11",
        desc: "Readout colour and size.",
      },
      {
        name: "proximity.target",
        type: "string",
        default: "—",
        desc: "The `id` of the feature whose proximity catchment to draw — a dashed ring at the pointer, the radius within which it reaches for a mark. Prefer `guide: { catchment: true }` on the edit itself, which needs no id.",
      },
      {
        name: "proximity.stroke / strokeDasharray / strokeWidth / opacity",
        type: "style",
        default: "theme catchment",
        desc: "Ring paint.",
      },
      {
        name: "id",
        type: "string",
        default: "—",
        desc: "Stable identity, on every guide.",
      },
    ],
    returns: (
      <>
        Each returns a <b>Guide</b> (<code className="inline">{'{'} isGuide: true, build(ctx) {'}'}</code>), rebuilt every render so it tracks live data.
      </>
    ),
  },
  {
    name: "guides.custom(build)",
    summary: (
      <>
        Draw your own non-interactive nodes from the live render context. One word for &ldquo;author your own&rdquo; in every namespace — cf. <code className="inline">edit.custom</code> and <code className="inline">constraints.custom</code>.
      </>
    ),
    signatures: [
      "guides.custom((ctx) => FeatureNode[]) → Guide",
    ],
    options: [
      {
        name: "ctx",
        type: "object",
        default: "—",
        desc: "The guide context: { scales, state, features, featureNodes, ui, effects, width, height, stage }.",
      },
      {
        name: "return",
        type: "FeatureNode[]",
        default: "—",
        desc: "Nodes to draw. Every one is tagged pointerEvents: 'none', so a custom guide can never capture a gesture.",
      },
      {
        name: "node.background",
        type: "boolean",
        default: "false",
        desc: "Draw this node behind the marks — a track, a cell grid — rather than in front.",
      },
    ],
  },
  {
    name: "Instrument affordances",
    summary: (
      <>
        The chrome a survey instrument draws itself with. Guides like any other — pass them in <code className="inline">guides: [...]</code>. The built-in <a href="/widgets">widgets</a> are assembled from these, so a hand-built instrument gets the same look.
      </>
    ),
    signatures: [
      "guides.prompt(text, { y }) → Guide            // the question, in the top margin",
      "guides.optionRings({ labelOffset, radius }) → Guide   // a Likert scale's rings",
      "guides.cellGrid({ pad }) → Guide              // a matrix's cells + headers",
      "guides.sliderTrack({ format }) → Guide        // a track with end labels",
      "guides.crosshair({ x, y }) → Guide            // centred axes + four end labels",
    ],
    options: [
      {
        name: "prompt.y",
        type: "number",
        default: "—",
        desc: "Lift the prompt clear of whatever sits below it — column headers, an axis title.",
      },
      {
        name: "optionRings.radius / labelOffset",
        type: "number",
        default: "—",
        desc: "Ring radius, and the label's distance below it.",
      },
      {
        name: "cellGrid.pad",
        type: "number",
        default: "—",
        desc: "Gap between cells, in px.",
      },
      {
        name: "sliderTrack.format",
        type: "fn",
        default: "String",
        desc: "How the two end labels read.",
      },
      {
        name: "crosshair.x / y",
        type: "string",
        default: "—",
        desc: "The variable name to label each axis's high and low ends with.",
      },
    ],
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
        desc: "Per-part stroke appearance.",
      },
    ],
  },
];
