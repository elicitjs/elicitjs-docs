import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "axes (on Elicit)",
    summary: (
      <>
        The implicit layer. Every key desugars into the <code className="inline">axis</code> and <code className="inline">grid</code> marks below, and an explicit one you compose yourself always wins over the injected one.
      </>
    ),
    signatures: [
      "axes: false                                  // no axes at all",
      "axes: { x, y, count, origin }                // per-channel config",
      "axes: { y: { grid: true, ticks: 8 } }        // any axis option",
    ],
    options: [
      {
        name: "x / y",
        type: "object | false",
        default: "{}",
        desc: (
          <>
            Options for that channel&rsquo;s axis — any option in the table below. <code className="inline">false</code> suppresses the channel.
          </>
        ),
      },
      {
        name: "count",
        type: "boolean | object",
        default: "false",
        desc: (
          <>
            Draw the <code className="inline">count</code> axis of a counting mark (<a href="/marks/waffle">waffle</a>, <a href="/marks/dotstack">dotStack</a>). It sits on whichever side that mark stacks along. Pass an object for the usual axis options.
          </>
        ),
      },
      {
        name: "origin",
        type: "boolean",
        default: "auto",
        desc: (
          <>
            Cross both axes at zero, instead of the left/bottom frame. Inferred <code className="inline">true</code> when a <a href="/marks/trend">trend</a> is present and you wrote no <code className="inline">axes</code> at all; state it either way to override.
          </>
        ),
      },
    ],
    returns: (
      <>
        The injected <code className="inline">axis</code> / <code className="inline">grid</code> marks, in the background layer.
      </>
    ),
  },
  {
    name: "axis · axisX · axisY",
    summary: (
      <>
        A spine, ticks, labels and an optional title for one channel’s scale. Import from <code className="inline">elicit.elements</code>, or reach it through the <code className="inline">axes</code> option above.
      </>
    ),
    signatures: [
      "axisX({ ticks, tickFormat, title, anchor, transform, grid, … }) → Feature",
    ],
    options: [
      {
        name: "channel",
        type: "'x' | 'y'",
        default: "'x'",
        desc: "Which scale to draw (pinned by axisX/axisY).",
      },
      {
        name: "anchor",
        type: "'bottom'|'top'|'left'|'right'",
        default: "per axis",
        desc: "Which side the axis sits on.",
      },
      {
        name: "transform",
        type: "(ctx) => {x?,y?}",
        default: "—",
        desc: "Override the base translate — cross at the origin, or a centred 1D axis.",
      },
      {
        name: "ticks",
        type: "number",
        default: "5",
        desc: "Approximate tick count (linear scales).",
      },
      {
        name: "tickValues",
        type: "any[]",
        default: "—",
        desc: (
          <>
            Explicit tick values (overrides <code className="inline">ticks</code>).
          </>
        ),
      },
      {
        name: "tickFormat",
        type: "string | fn",
        default: "auto",
        desc: "A d3-format string or a formatter function.",
      },
      {
        name: "tickSize",
        type: "number",
        default: "6",
        desc: "Tick mark length in pixels.",
      },
      {
        name: "title",
        type: "string",
        default: "—",
        desc: "Axis title, centred and pushed past the labels.",
      },
      {
        name: "stroke / fill / fontSize",
        type: "style",
        default: "#6b7280 / #374151 / 10",
        desc: (
          <>
            Spine + tick colour, label colour (labels are text nodes, so they take a <code className="inline">fill</code>), label size.
          </>
        ),
      },
      {
        name: "grid",
        type: "boolean",
        default: "false",
        desc: "Also add a matching grid mark alongside the axis.",
      },
      {
        name: "edit / edits",
        type: "Edit / Edit[]",
        default: "—",
        desc: (
          <>
            An axis is inert until you give it one. <code className="inline">edit.axis.scale()</code> drags the domain; see <a href="/editing/axis">Editing the scale</a>.
          </>
        ),
      },
      {
        name: "field",
        type: "string",
        default: "the scale's first field",
        desc: "Which column an edit on this axis writes, when the scale carries several.",
      },
      {
        name: "table",
        type: "string",
        default: "the primary table",
        desc: "Which table that edit writes to, by name.",
      },
      {
        name: "handleColor / handleSize",
        type: "string / number",
        default: "theme / 5",
        desc: "The grip an axis edit draws. Inert axes draw none.",
      },
      {
        name: "id",
        type: "string",
        default: "—",
        desc: "Stable identity, as on every mark.",
      },
    ],
    returns: (
      <>
        A background <b>feature</b> emitting <code className="inline">line</code> + <code className="inline">text</code> nodes; redraws as the domain grows.
      </>
    ),
  },
  {
    name: "grid · gridX · gridY",
    summary: "Full-span gridlines across the plot, one per tick.",
    signatures: [
      "gridY({ ticks, tickValues, stroke, strokeWidth }) → Feature",
    ],
    options: [
      {
        name: "channel",
        type: "'x' | 'y'",
        default: "'x'",
        desc: "Which scale to draw lines for (pinned by gridX/gridY).",
      },
      {
        name: "ticks",
        type: "number",
        default: "5",
        desc: "Approximate line count.",
      },
      {
        name: "tickValues",
        type: "any[]",
        default: "—",
        desc: (
          <>
            Explicit positions (overrides <code className="inline">ticks</code>).
          </>
        ),
      },
      {
        name: "stroke / strokeWidth",
        type: "style",
        default: "#e5e7eb / 1",
        desc: "Line colour and width.",
      },
      {
        name: "id",
        type: "string",
        default: "—",
        desc: "Stable identity, as on every mark.",
      },
    ],
    returns: (
      <>
        A background <b>feature</b> emitting one full-span <code className="inline">line</code> per tick.
      </>
    ),
  },
  {
    name: "rule · ruleX · ruleY",
    summary: (
      <>
        A straight reference line at a value on one axis — or, with a pair of endpoint channels, a <b>span</b> segment (a lollipop stem / error-bar whisker) at a category. An ordinary editable mark: put an <code className="inline">edit</code> on an endpoint channel and its cap becomes a handle. A rule with no edit is left <code className="inline">pointerEvents:"none"</code> by the engine, so an inert whisker never swallows a sibling handle’s drag.
      </>
    ),
    signatures: [
      "ruleY({ channels: { y: { datum: 50 } } }) → Feature   // reference line at y = 50",
      "ruleX({ channels: { x, y1, y2 } }) → Feature          // span per datum",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            The value channel — <code className="inline">{'{'} datum {'}'}</code> for a constant, <code className="inline">{'{'} field {'}'}</code> for one rule per row. <code className="inline">y1/y2</code> or <code className="inline">x1/x2</code> switch to span mode.
          </>
        ),
      },
      {
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        default: "auto",
        desc: (
          <>
            Which axis carries the reference value (<code className="inline">'vertical'</code> = y). Inferred from the bound channel; <code className="inline">ruleY / ruleX</code> pin it.
          </>
        ),
      },
      {
        name: "edits",
        type: "Edit[]",
        default: "—",
        desc: (
          <>
            As on any mark. A per-channel <code className="inline">edit</code> makes that endpoint draggable.
          </>
        ),
      },
      {
        name: "discreteScale",
        type: "'band' | 'point'",
        default: "—",
        desc: "Which variant of a categorical axis the rule sits on. Left unset so a composite can stamp its own.",
      },
      {
        name: "strokeDasharray",
        type: "string",
        default: "—",
        desc: "Dash pattern passthrough.",
      },
      {
        name: "stroke, strokeWidth, opacity",
        type: "style",
        default: "stroke:'black'",
        desc: "Standard style surface.",
      },
    ],
    channels: [
      {
        name: "x / y",
        type: "datum | field",
        desc: (
          <>
            The reference value axis. <code className="inline">{'{'} datum: 50 {'}'}</code> is DATA space — it goes through the scale. (<code className="inline">{'{'} value: 50 {'}'}</code> would be 50 pixels.)
          </>
        ),
      },
      {
        name: "y1 / y2",
        type: "linear",
        desc: "Span endpoints (vertical). A lone endpoint spans from the value-axis baseline.",
      },
      {
        name: "x1 / x2",
        type: "linear",
        desc: "Span endpoints (horizontal).",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one non-interactive <code className="inline">line</code> per rule (full-extent, or a span segment).
      </>
    ),
  },
];
