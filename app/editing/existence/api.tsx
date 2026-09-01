import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "create(options)",
    summary: "A plane gesture that mints a datum — inverts pointer pixels through positional channels, populating defaults for the rest.",
    signatures: [
      "create({ channels, defaults, gesture }) → Edit",
    ],
    options: [
      {
        name: "channels",
        type: "string[]",
        default: "['x','y']",
        desc: "Positional channels to place from the pointer.",
      },
      {
        name: "defaults",
        type: "object",
        default: "{}",
        desc: "Seed values for non-positional fields on newly minted rows.",
      },
      {
        name: "gesture",
        type: "'click' | 'dblclick'",
        default: "'click'",
        desc: "The plane gesture that triggers creation.",
      },
    ],
  },
  {
    name: "remove(options)",
    summary: "Deletes the targeted datum from the dataset.",
    signatures: [
      "remove({ pick, threshold, when, gesture }) → Edit",
    ],
    options: [
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "—",
        desc: "Arbitration predicate (e.g. when.alt so Alt-click deletes while click recolours).",
      },
      {
        name: "gesture",
        type: "string",
        default: "'click'",
        desc: "The gesture that removes the row.",
      },
    ],
  },
  {
    name: "lock",
    summary: "Marks seed rows or matching rows as read-only, preventing edits and deletion.",
    signatures: [
      "lock: 'seed' | ((datum) => boolean)",
    ],
    options: [
      {
        name: "lock: 'seed'",
        type: "'seed'",
        desc: "Locks all initially supplied rows; newly created rows remain editable.",
      },
      {
        name: "lock: (d) => boolean",
        type: "Function",
        desc: "Predicate function locking specific rows by field (e.g. d.kind === 'actual').",
      },
    ],
  },
];
