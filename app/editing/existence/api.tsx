import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "create(options)",
    json: ['edit.create'],
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
    json: ['edit.remove'],
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
    json: ['spec'],
    summary: (
      <>
        Which rows of the dataset are read-only. A lock is a property of the <b>data</b> — not of a mark or an edit — so it lives on the dataset spec beside <code className="inline">data</code> and <code className="inline">schema</code>, and holds for every edit from every mark in every chart.
      </>
    ),
    signatures: [
      "lock: \"seed\" | true | ((datum, index) => boolean)",
    ],
    options: [
      {
        name: "\"seed\" / true",
        type: "string | boolean",
        default: "—",
        desc: (
          <>
            The rows the chart was <b>seeded</b> with (its <code className="inline">data</code>) are fixed; anything an edit creates is free. <code className="inline">setData</code> re-seeds the chart, so it also re-takes the lock.
          </>
        ),
      },
      {
        name: "(datum, index) => boolean",
        type: "function",
        default: "—",
        desc: (
          <>
            Lock rows by what they <b>are</b> — <code className="inline">d ={'>'} d.kind === "actual"</code>, <code className="inline">d ={'>'} d.year {'<'}= 1990</code>. Re-evaluated every render, so a row can be locked by a field an edit writes.
          </>
        ),
      },
    ],
    returns: (
      <>
        Two things follow, and both are automatic. <b>Data:</b> a dataset invariant runs on every commit, <i>last</i>, so a lock outranks every other repair — a proposal that touched a locked row keeps its changes to the free rows and snaps the locked ones back (deleting one is rejected outright). <b>Pointer:</b> a locked row’s marks are not grabbable, show no editable cursor, and are skipped by proximity picking — so <code className="inline">nearest</code> / <code className="inline">sweep</code> / <code className="inline">draw</code> never even target one.
      </>
    ),
  },
  {
    name: "context",
    json: ['spec'],
    summary: "Marks seeded rows as reference: drawn and read-only, and left out of getData(), onChange, and the selection and control indices.",
    signatures: [
      "context: true | ((datum, index, table) => boolean)",
    ],
    options: [
      {
        name: "context: true",
        type: "true",
        desc: "Every row in data is context; rows you add are your answer.",
      },
      {
        name: "context: (d) => boolean",
        type: "Function",
        desc: "The seeded rows the predicate accepts are context. It runs once, over the rows in data.",
      },
    ],
  },
];
