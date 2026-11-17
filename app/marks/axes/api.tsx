import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "axes (on Elicit)",
    json: ['axis'],
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
    json: ['elements.axis', 'elements.axisX', 'elements.axisY'],
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
        desc: "A d3-format string or a formatter function. A newline in a label breaks it onto a second line.",
      },
      {
        name: "tickSize",
        type: "number | (v, i) => number",
        default: "theme (6)",
        desc: "Tick mark length in pixels; 0 draws none. A function sets each tick's length.",
      },
      {
        name: "tickPadding",
        type: "number",
        default: "theme (3)",
        desc: "Gap between a tick's end and its label, in pixels.",
      },
      {
        name: "labelAngle",
        type: "number",
        default: "theme (0)",
        desc: "Tick-label rotation in degrees, counter-clockwise like a mark's angle. The axis reserves the room the turned labels need.",
      },
      {
        name: "title",
        type: "string",
        default: "—",
        desc: "Axis title, centred along the axis and pushed past the tick labels. A y title is rotated to run along its axis.",
      },
      {
        name: "titleAngle",
        type: "number",
        default: "-90 left · 90 right",
        desc: "Rotation of the title in degrees. 0 lays a y title flat. On an x axis the title is flat unless set.",
      },
      {
        name: "stroke / strokeWidth / line",
        type: "style",
        default: "theme (#6b7280 / 1 / true)",
        desc: (
          <>
            Spine and tick colour and width; <code className="inline">line: false</code> drops the spine. <code className="inline">stroke</code> also takes <code className="inline">(v, i) =&gt; colour</code> per tick.
          </>
        ),
      },
      {
        name: "fill / fontSize / fontFamily / fontWeight",
        type: "style",
        default: "theme (#374151 / 10)",
        desc: (
          <>
            Label paint (labels are text nodes, so they take a <code className="inline">fill</code>). <code className="inline">fill</code> and <code className="inline">fontWeight</code> also take a per-tick function.
          </>
        ),
      },
      {
        name: "titleFill / titleFontSize / titleFontWeight / titlePadding",
        type: "style",
        default: "theme (label fill / fontSize + 1 / — / 0)",
        desc: "The title's paint, and extra pixels between the labels and the title.",
      },
      {
        name: "labelAlign / labelOffset",
        type: "'start' | 'middle' | 'end' / number",
        default: "theme (side's own / 0)",
        desc: "A tick label's text-anchor, and pixels every label moves along the axis. With a negative tickPadding, labelAlign: 'start' on a left axis puts the labels inside the plot.",
      },
      {
        name: "titleAnchor",
        type: "'start' | 'middle' | 'end'",
        default: "theme ('middle')",
        desc: "Where the title sits along the axis; 'end' is the right of x, the top of y. A flat y title at an end sits past it, over the plot: leave room in that margin.",
      },
      {
        name: "offset",
        type: "number",
        default: "0",
        desc: "Move the axis this many pixels away from the plot.",
      },
      {
        name: "grid",
        type: "boolean | grid options",
        default: "false",
        desc: "In the global axes config, also add a matching grid. An object styles it (strokeDash, zero, …).",
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
    json: ['elements.grid', 'elements.gridX', 'elements.gridY'],
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
        name: "stroke / strokeWidth / strokeDash / opacity",
        type: "style",
        default: "theme (#e5e7eb / 1)",
        desc: "Line paint. stroke, strokeWidth and strokeDash also take (v, i) => value per line.",
      },
      {
        name: "zero",
        type: "boolean | { stroke, strokeWidth, strokeDash }",
        default: "theme (none)",
        desc: "An emphasised line at 0 on a continuous scale. true takes the theme's grid.zero style.",
      },
      {
        name: "bandPosition",
        type: "number",
        default: "theme (0.5)",
        desc: "On a band axis, where in each band a line sits: 0 its start edge, so the lines run between the categories.",
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
    json: ['plot.rule', 'plot.ruleX', 'plot.ruleY'],
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
        name: "strokeDash",
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
