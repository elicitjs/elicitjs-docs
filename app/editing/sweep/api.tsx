import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit.line.sweep(options)",
    summary: "Sweep across columns to repaint curve points sequentially.",
    signature: "edit.line.sweep(options?) → Edit",
    options: [
      {
        name: "guide",
        type: "boolean",
        default: "true",
        desc: "Draw tracking indicators along the swept column.",
      },
    ],
  },
  {
    name: "edit.line.draw(options)",
    summary: "Freehand path sampling or you-draw-it upsert on line marks.",
    signature: "edit.line.draw({ along, value, samples, minDist, threshold, into }) → Edit",
    options: [
      {
        name: "along / value",
        type: "'x' | 'y'",
        default: "'x' / 'y'",
        desc: "Independent axis to draw along, and the dependent value axis.",
      },
      {
        name: "samples",
        type: "number | any[]",
        default: "ticks",
        desc: "Domain grid points that you-draw-it snaps to.",
      },
      {
        name: "into",
        type: "'nearest' | 'new'",
        default: "'nearest'",
        desc: "Append to the nearest line or start a fresh series.",
      },
    ],
  },
  {
    name: "edit.line.anchor(options)",
    summary: "Click to add sequential anchor points to a line.",
    signature: "edit.line.anchor({ into, gesture }) → Edit",
    options: [
      {
        name: "into",
        type: "'nearest' | 'new'",
        default: "'nearest'",
        desc: "Add point to the closest existing series or start a new series.",
      },
    ],
  },
  {
    name: "edit.stack.edge()",
    summary: "Drag boundary seams between slices or stacked segments to redistribute shares.",
    signature: "edit.stack.edge(options?) → Edit",
  },
  {
    name: "edit.stack.cut()",
    summary: "Click inside a stacked segment to divide it into multiple categories from the schema domain.",
    signature: "edit.stack.cut(options?) → Edit",
  },
];
