import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "ChannelSpec.legend · legendColor · legendSize · legendSymbol",
    summary: (
      <>
        A key for one <b>encoding</b> — a (channel, field) pair. Ask for it on the channel (<code className="inline">fill: {'{'} field, legend: true {'}'}</code>), chart-wide with <code className="inline">legends: true</code>, or by composing an element. The shape follows the channel: swatches, a colour ramp, graduated circles for <code className="inline">size</code>, a fan for <code className="inline">angle</code>, a weight stack for <code className="inline">strokeWidth</code>. It <b>reserves space</b> on its side, shrinking the plot so it never overlaps the marks. Elements import from <code className="inline">elicit.elements</code>.
      </>
    ),
    signatures: [
      "fill: { field, legend: true | { anchor, title, edit, … } | false }",
      "legends: true   ·   legends: { fill: { anchor: 'top' }, size: false }",
      "legendColor({ field, anchor, … }) → Feature   ·   legendSize · legendSymbol",
    ],
    options: [
      {
        name: "channel",
        type: "'fill'|'stroke'|'size'|'symbol'|'opacity'|'angle'|'strokeWidth'",
        default: "'fill'",
        desc: "Which channel’s scale to draw (pinned by legendColor/legendSize/legendSymbol). Implied when you declare the legend on the channel. Any other channel warns — an axis is the key for x/y.",
      },
      {
        name: "anchor",
        type: "'right'|'left'|'top'|'bottom'",
        default: "'right'",
        desc: "Which side to sit on. Left/right stack vertically; top/bottom lay out in a row.",
      },
      {
        name: "orient",
        type: "'vertical' | 'horizontal'",
        default: "from anchor",
        desc: "Override the swatch/ramp direction independently of the side.",
      },
      {
        name: "edit / edits",
        type: "Edit | Edit[]",
        default: "—",
        desc: "Opt-in interactivity: edit.legend.category() (click a swatch to set a category) or edit.legend.value() (drag the ramp handle to set a value).",
      },
      {
        name: "field",
        type: "string",
        default: "the channel's field",
        desc: "WHICH ENCODING this legend is for. Implied when declared on a channel. On a hand-composed element it is only needed when the channel carries more than one encoding — with two and no field, the first is used and a warning names both.",
      },
      {
        name: "table",
        type: "string",
        default: "the primary table",
        desc: "Which table that column is in, by name. Only meaningful on a multi-table schema.",
      },
      {
        name: "row",
        type: "number | (data, { selection }) => number",
        default: "selection ?? (single row ? 0 : none)",
        desc: "Which dataset row the picker writes into. Left unset it tracks the chart's selection (edit.select / el.select), falling back to the sole row of a one-row belief. A number pins a fixed row; a function computes one.",
      },
      {
        name: "title",
        type: "string | false",
        default: "the encoded field's name",
        desc: "A caption above the legend. Defaults to the field it is a key for; false removes it.",
      },
      {
        name: "swatchSize / gap / labelWidth",
        type: "number",
        default: "14 / 6 / auto",
        desc: "Discrete swatch geometry. labelWidth defaults to a per-label estimate.",
      },
      {
        name: "rampLength / rampThickness / ticks",
        type: "number",
        default: "140 / 12 / 4",
        desc: "Continuous ramp geometry and its approximate tick count.",
      },
      {
        name: "stroke / fill / fontSize / handleColor",
        type: "string / number",
        default: "theme",
        desc: "Chrome, defaulting to the theme’s legend/axis tokens (resolved at build time).",
      },
    ],
  },
  {
    name: "edit.legend.category · edit.legend.value",
    summary: (
      <>
        The legend pickers, written back through the normal edit pipeline. <code className="inline">edit.legend.category()</code> is a category picker (a direct-pick click on a swatch, whose value it sets). <code className="inline">edit.legend.value()</code> is a continuous value picker (a direct-pick drag on the ramp handle). Pass one to a legend’s <code className="inline">edit</code> option — the legend injects its channel.
      </>
    ),
    signatures: [
      "edit.legend.category() → Edit   (click a swatch; writes node.category)",
      "edit.legend.value() → Edit      (drag the handle; maps to [lo,hi])",
    ],
    options: [
      {
        name: "—",
        type: "EditOptions",
        default: "—",
        desc: "Neither picker names a column: a legend is a key for one encoding, so the column is the one that encoding uses. They take the universal edit options (name, stage, when, constrain).",
      },
    ],
  },
];
