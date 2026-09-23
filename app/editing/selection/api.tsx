import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit.select",
    summary: (
      <>
        Makes a mark selectable. Selection is transient <b>pipeline state</b> — the chart remembers which rows are picked, and nothing is written to the data. That is the point: it replaces a <code className="inline">selected</code> column, so no <code className="inline">change</code> fires, nothing lands in undo, and the elicited dataset stays clean.
      </>
    ),
    signatures: [
      "edit.select({ multi, exclusive, toggle }) → Edit",
    ],
    options: [
      {
        name: "multi",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Shift- or meta-click adds to the selection; a plain click still replaces it. Shift-clicking a selected row removes it. Turning this on changes nothing about the gesture you already had.
          </>
        ),
      },
      {
        name: "exclusive",
        type: "boolean",
        default: "true",
        desc: "Selecting a row clears the rest. false makes every click additive, with no modifier — the flat override for a chart that is always multi.",
      },
      {
        name: "toggle",
        type: "boolean",
        default: "true",
        desc: "Clicking an already-selected row deselects it. false never deselects.",
      },
    ],
  },
  {
    name: "Selection API",
    summary: (
      <>
        Selection has its own small API beside <code className="inline">getData</code>/<code className="inline">setData</code>, and its own <code className="inline">select</code> event. Every route — a mark click, an external control, the keyboard — goes through the same commit, so the selection is always in one shape. Indices are rows of the primary table.
      </>
    ),
    signatures: [
      "el.getSelection() → number | null      ·   el.getSelectionAll() → number[]",
      "el.select(i | number[] | null) → boolean",
      "el.toggleSelection(i) → boolean        ·   el.selectAll() → boolean",
      "el.selectWhere(field, value, { all }) → boolean",
      "el.clearSelection() → boolean          ·   el.on('select', (first, all) => …)",
    ],
    options: [
      {
        name: "getSelection / getSelectionAll",
        type: "() => number | null / number[]",
        default: "—",
        desc: "The first selected row, and every selected row. getSelection stays scalar when several are selected, so code written against a single selection keeps working. A stale index (its row was removed) reads as null.",
      },
      {
        name: "select",
        type: "(index | number[] | null)",
        default: "—",
        desc: "Replace the selection. An array selects exactly those rows in one commit; null, an empty array, or an out-of-range index clears.",
      },
      {
        name: "toggleSelection / selectAll",
        type: "(index) / ()",
        default: "—",
        desc: "Add or remove one row, leaving the rest alone (the external counterpart of a shift-click); or take every row.",
      },
      {
        name: "selectWhere",
        type: "(field | predicate, value?, { all }?)",
        default: "all: false",
        desc: "Select by category or predicate. The default takes the first match; { all: true } takes every one, which is what selecting a category usually means.",
      },
      {
        name: "clearSelection",
        type: "()",
        default: "—",
        desc: "Empty the selection. The same commit path, so the select event fires.",
      },
      {
        name: "on('select')",
        type: "(first, all) => void",
        default: "—",
        desc: "Fires whenever the selection moves. No data changed, so this is not a change event.",
      },
    ],
  },
];
