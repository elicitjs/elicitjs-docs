import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "arc(options) · donut(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. <code className="inline">donut</code> is <code className="inline">arc</code> with a default inner radius. A full pie is just <code className="inline">arc()</code>.
      </>
    ),
    signatures: [
      "arc({ channels, outerRadius, innerRadius, padAngle, arc, start, end, handles, handleSize, handleColor, edits, id }) → Feature",
      "donut(options) → Feature",
    ],
    options: [
      {
        name: "outerRadius",
        type: "number",
        default: "fits the slot",
        desc: "Outer radius in px, for every donut. Omit to fit the slot (a band cell, or a shrunk scatter default); or bind a size field for a per-donut radius.",
      },
      {
        name: "innerRadius",
        type: "number",
        default: "0",
        desc: (
          <>
            Inner radius; {'>'}0 makes a donut. A value in <code className="inline">(0,1]</code> is a <b>ratio</b> of the outer radius (so a fitted / size-driven donut stays proportional); {'>'}1 is absolute px. <code className="inline">donut()</code> defaults this.
          </>
        ),
      },
      {
        name: "padAngle",
        type: "number",
        default: "0",
        desc: "Gap between slices in degrees.",
      },
      {
        name: "arc",
        type: "'semi' | 'full'",
        default: "'full'",
        desc: (
          <>
            Angular span of the whole pie. <code className="inline">'semi'</code> is the top half.
          </>
        ),
      },
      {
        name: "start / end",
        type: "number",
        default: "-180 / 180",
        desc: (
          <>
            Explicit span in degrees, clockwise from 12 o&rsquo;clock. Both given, they override <code className="inline">arc</code>.
          </>
        ),
      },
      {
        name: "edits",
        type: "Edit | Edit[]",
        default: "—",
        desc: (
          <>
            Slice editing — <code className="inline">edit.stack.cut()</code>,{" "}
            <code className="inline">edit.stack.edge()</code>,{" "}
            <code className="inline">edit.stack.merge()</code>. Draws a grab handle on each
            interior boundary (<em>n</em> slices → <em>n</em> − 1 handles; the seam is the
            layout's fixed anchor).
          </>
        ),
      },
      {
        name: "handles",
        type: "boolean | 'hit'",
        default: "true",
        desc: (
          <>
            <code className="inline">'hit'</code> keeps each boundary grabbable but draws no dot. <code className="inline">false</code> is neither drawn nor grabbable.
          </>
        ),
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Pixel radius of each boundary handle.",
      },
      {
        name: "handleColor",
        type: "string",
        default: "theme",
        desc: (
          <>
            Handle fill. Defaults to the theme&rsquo;s <code className="inline">handle</code> colour.
          </>
        ),
      },
    ],
    channels: [
      {
        name: "theta",
        type: "magnitude field",
        desc: "Slice size in data units; layout normalizes by the sum of rows. The polar positional channel (Vega-Lite's name for it) — not `angle`, which is a mark's rotation in place, and not `value`, which already means a visual-space constant on any channel. Read raw here: an arc normalizes its own magnitudes, so it neither implies a radial axis nor draws a fan key.",
      },
      {
        name: "fill",
        type: "ordinal | const",
        desc: "Slice colour.",
      },
      {
        name: "x / y",
        type: "field | const",
        desc: "Donut centre. Bind a field to place one donut per distinct value (a band category, or a scatter coordinate) — a grid of donuts, grouped by the encoding. Unbound → the plot centre (one donut).",
      },
      {
        name: "size",
        type: "field | const",
        desc: "Optional per-donut outer radius (e.g. turnout), through the size scale. Overridden by an explicit outerRadius.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one filled <code className="inline">path</code> per row.
      </>
    ),
  },
];
