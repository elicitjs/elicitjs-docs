import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit.line.sweep(options)",
    summary: (
      <>
        You-draw-it painting: a drag repaints the value of every point the pointer crosses. A <code className="inline">move</code> under the sweep driver, so it inverts the pointer through the same scale.
      </>
    ),
    signature: "edit.line.sweep({ guide, series, when, stage }) → Edit",
    options: [
      {
        name: "guide",
        type: "boolean",
        default: "true",
        desc: "Draw tracking indicators along the swept column.",
      },
      {
        name: "mode",
        type: "'absolute'",
        default: "'absolute'",
        desc: "A sweep paints the pointer's position, so 'relative' has no meaning here and warns.",
      },
    ],
    returns: (
      <>
        An <b>Edit</b> scoped to <code className="inline">line</code>. It needs a mark that groups points into series.
      </>
    ),
  },
  {
    name: "edit.line.draw(options)",
    summary: "Freehand path sampling, or a you-draw-it upsert on a line mark.",
    signature: "edit.line.draw({ along, value, samples, minDist, series, threshold, into }) → Edit",
    options: [
      {
        name: "along / value",
        type: "'x' | 'y'",
        default: "'x' / 'y'",
        desc: "The independent axis to draw along, and the dependent value axis.",
      },
      {
        name: "samples",
        type: "number | any[]",
        default: "the scale's ticks",
        desc: "Domain grid points the drawn value snaps to: a count, explicit positions, or a time interval.",
      },
      {
        name: "minDist",
        type: "number",
        default: "8",
        desc: "How far the pointer must travel, in px, before another freehand point is sampled.",
      },
      {
        name: "series",
        type: "string",
        default: "the mark's series field",
        desc: "The column that carries the series key. Override it when the drawn line groups by something other than the mark's own grouping channel.",
      },
      {
        name: "into",
        type: "'nearest' | 'new'",
        default: "'nearest'",
        desc: "Append to the nearest line, or start a fresh series.",
      },
    ],
  },
  {
    name: "edit.line.anchor(options)",
    summary: "Click to add anchor points to a line, one at a time.",
    signature: "edit.line.anchor({ into, series, gesture, when }) → Edit",
    options: [
      {
        name: "into",
        type: "'nearest' | 'new'",
        default: "'nearest'",
        desc: "Add the point to the closest existing series, or start a new one. A click in empty space under 'nearest' also starts a fresh series.",
      },
      {
        name: "series",
        type: "string",
        default: "the mark's series field",
        desc: "The column the new point's series key is written to.",
      },
    ],
  },
  {
    name: "edit.line.newSeries(options)",
    summary: (
      <>
        Seed a whole line at once — one anchor per sampled domain position, all at the pointer&rsquo;s value. The draw-from-scratch primitive; pair it with <code className="inline">sweep</code> to shape the flat line it leaves.
      </>
    ),
    signature: "edit.line.newSeries({ along, value, samples, series }) → Edit",
    options: [
      {
        name: "along / value",
        type: "'x' | 'y'",
        default: "'x' / 'y'",
        desc: "The axis the line runs along, and the axis it carries a value on.",
      },
      {
        name: "samples",
        type: "number | any[]",
        default: "the scale's ticks",
        desc: "Where the anchors go: a count, explicit domain positions, or a time interval.",
      },
      {
        name: "series",
        type: "string",
        default: "the mark's series field",
        desc: "The column the new series key is written to.",
      },
    ],
  },
  {
    name: "edit.line.removeSeries(options)",
    summary: (
      <>
        Delete a whole line. Clicking any point on it reads that point&rsquo;s series key and drops every row sharing it — the counterpart to <code className="inline">remove</code>, which drops one anchor.
      </>
    ),
    signature: "edit.line.removeSeries({ series, gesture, when }) → Edit",
    options: [
      {
        name: "series",
        type: "string",
        default: "the mark's series field",
        desc: "The column that identifies the line.",
      },
      {
        name: "gesture / when",
        type: "string / (ctx) => boolean",
        default: "'click' / —",
        desc: (
          <>
            Pair them with a <code className="inline">when</code> if another click edit shares the mark — removing one point against removing the whole line.
          </>
        ),
      },
    ],
  },
  {
    name: "edit.stack.cut(options)",
    summary: "Click inside a stacked segment to divide it into two, taking the next category from the schema's domain.",
    signature: "edit.stack.cut({ label, categoryField, defaults, when }) → Edit",
    options: [
      {
        name: "categoryField",
        type: "string",
        default: "the stack's category column",
        desc: "Which column carries the segment's identity, when the stack groups by more than one.",
      },
      {
        name: "label",
        type: "string",
        default: "—",
        desc: (
          <>
            The placeholder name a new segment takes on an <code className="inline">open</code> domain, which has no next category to hand out.
          </>
        ),
      },
      {
        name: "defaults",
        type: "object",
        default: "{}",
        desc: "Extra fields to seed the new row with, over the schema's defaults.",
      },
    ],
  },
  {
    name: "edit.stack.edge(options)",
    summary: (
      <>
        Drag a boundary to move value between the two segments it separates. Only those two change — one grows by exactly what the other loses — so the group&rsquo;s total is preserved by construction.
      </>
    ),
    signature: "edit.stack.edge(options?) → Edit",
    options: [
      {
        name: "—",
        type: "EditOptions",
        default: "—",
        desc: "The universal edit options. The boundary it drags is resolved from the mark's own layout.",
      },
    ],
  },
  {
    name: "edit.stack.merge(options)",
    summary: (
      <>
        Double-click a boundary to fuse the two segments it separates back into one. The inverse of <code className="inline">cut</code>, preserving the same total: the lower row survives and takes the pair&rsquo;s whole magnitude.
      </>
    ),
    signature: "edit.stack.merge(options?) → Edit",
    options: [
      {
        name: "—",
        type: "EditOptions",
        default: "—",
        desc: "The universal edit options. It removes a row, not a category, so the domain is left alone and cutting brings that category back.",
      },
    ],
  },
];
