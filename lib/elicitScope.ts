'use client';

/**
 * Live-example scope: what an example on the docs site can name without importing.
 *
 * The shape mirrors the library's own split. MARKS and ELEMENTS are spread bare,
 * because an example reads better as `barY({…})` than `plot.barY({…})`. Universal
 * EDITS are bare for the same reason (`move()`), while the scoped edit families
 * stay under `edit.*` — which is also how they are spelled in a spec, and how they
 * will be spelled in a JSON spec (`{ "type": "line.draw" }`).
 */
import * as elicit from '@elicit';
import * as d3 from 'd3';
import vancouver from '../data/vancouver.js';

// The scoped edit namespaces are held back rather than spread: several share a
// name with a MARK (`line`, `trend`, `waffle`) or an ELEMENT (`axis`, `legend`),
// and the drawing vocabulary should win the bare name. They stay reachable as
// `edit.line.draw()`, `edit.legend.category()`, and so on.
const {
  line: _editLine,
  axis: _editAxis,
  legend: _editLegend,
  stack: _editStack,
  geo: _editGeo,
  waffle: _editWaffle,
  trend: _editTrend,
  network: _editNetwork,
  when: _editWhen,
  ...universalEdits
} = elicit.edit;

export function createElicitScope() {
  return {
    // Marks — view DATA.
    ...elicit.plot,
    // Chart elements — view a SCALE. Spread bare so `axisX(…)` / `legendColor(…)`
    // read the same as a mark; `elements.axisX` also works and is the spelling to
    // prefer in a spec, since it says which of the three kinds it is.
    ...elicit.elements,
    // Constraints — pure data invariants.
    ...elicit.constraints,
    // Universal edits (the scoped families stay under `edit.*`).
    ...universalEdits,
    Elicit: elicit.Elicit,
    // Arbitration predicates. Part of the edit vocabulary — a `when` only ever
    // appears inside an edit's options.
    when: elicit.edit.when,
    edit: elicit.edit,
    elements: elicit.elements,
    // Guides — view chart STATE, and write nothing.
    guides: elicit.guides,
    widgets: elicit.widgets,
    format: elicit.format,
    // The authoring kit, for the /authoring examples that write a custom mark.
    authoring: elicit.authoring,
    D3Renderer: elicit.D3Renderer,
    CanvasRenderer: elicit.CanvasRenderer,
    // Theme layer: `themes` (built-ins), `setTheme` (app-wide), `resolveTheme`.
    themes: elicit.themes,
    setTheme: elicit.setTheme,
    resolveTheme: elicit.resolveTheme,
    // The box a padded note occupies — `sticker`'s own sizing rule. An example
    // gives it to `link({ channels: { nodeWidth: … } })` so a connector docks to
    // the edge of an auto-sized note.
    noteBox: elicit.noteBox,
    d3,
    vancouver,
  };
}

export type ElicitScope = ReturnType<typeof createElicitScope>;
