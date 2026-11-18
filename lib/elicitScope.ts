'use client';

/**
 * Live-example scope: what an example on the docs site can name without importing.
 *
 * The shape mirrors the library's own split. MARKS and ELEMENTS are spread bare,
 * because an example reads better as `barY({…})` than `plot.barY({…})`. Universal
 * EDITS are bare for the same reason (`move()`), while the scoped edit families
 * stay under `edit.*` — which is also how they are spelled in a spec, and in a
 * JSON spec (`{ "type": "line.draw" }`).
 */
import * as elicit from '@elicit';
import * as d3 from 'd3';
import vancouver from '../data/vancouver.js';

type EditMembers = typeof elicit.edit;
/** The edits that are functions on `edit` itself, not a scoped family or `when`. */
type UniversalEdit = { [K in keyof EditMembers]: EditMembers[K] extends (...args: never[]) => unknown ? K : never }[keyof EditMembers];

/** The grammar namespaces an example names: the library's own, or a recorder's. */
export type Grammar = Pick<typeof elicit, 'plot' | 'elements' | 'constraints' | 'edit' | 'guides' | 'looks' | 'widgets' | 'format'>;

/**
 * @param grammar the namespaces the scope spreads. A recorder's look like the
 *   library's and return each call's JSON descriptor, which is how an example is
 *   shown as a JSON spec (see ExampleLive).
 */
export function createElicitScope(grammar: Grammar = elicit) {
  // The scoped edit namespaces are held back rather than spread: several share a
  // name with a MARK (`line`, `trend`, `waffle`) or an ELEMENT (`axis`, `legend`),
  // and the drawing vocabulary should win the bare name. They stay reachable as
  // `edit.line.draw()`, `edit.legend.category()`, and so on.
  const universalEdits = Object.fromEntries(
    Object.entries(grammar.edit).filter(([, member]) => typeof member === 'function'),
  ) as Pick<typeof elicit.edit, UniversalEdit>;

  // The docs site draws every chart in the Data & Dialogue Lab theme: `dd` in
  // light mode, its dark variant in dark mode (lib/chartTheme.ts). It is the
  // app-wide base, so an example's own `theme` still layers on top of it.
  // ExampleLive re-sets it before every eval, so an example that calls
  // `setTheme()` never leaks into the next one.
  elicit.setTheme('dd');
  return {
    // Marks — view DATA.
    ...grammar.plot,
    // Chart elements — view a SCALE. Spread bare so `axisX(…)` / `legendColor(…)`
    // read the same as a mark; `elements.axisX` also works and is the spelling to
    // prefer in a spec, since it says which of the three kinds it is.
    ...grammar.elements,
    // Constraints — pure data invariants.
    ...grammar.constraints,
    // The namespace too: `custom` is both an edit and a constraint, and the bare
    // spread below takes the edit, so a custom constraint is `constraints.custom`.
    constraints: grammar.constraints,
    // Universal edits (the scoped families stay under `edit.*`).
    ...universalEdits,
    Elicit: elicit.Elicit,
    // The JSON spec layer: `Elicit(compile(json))`, and the way back.
    compile: elicit.compile,
    registerFunction: elicit.registerFunction,
    recorder: elicit.recorder,
    // Arbitration predicates. Part of the edit vocabulary — a `when` only ever
    // appears inside an edit's options.
    when: grammar.edit.when,
    edit: grammar.edit,
    elements: grammar.elements,
    // Guides — view chart STATE, and write nothing.
    guides: grammar.guides,
    // Looks — how the finished chart is drawn. Experimental.
    looks: grammar.looks,
    widgets: grammar.widgets,
    format: grammar.format,
    // The authoring kit, for the /authoring examples that write a custom mark.
    authoring: elicit.authoring,
    D3Renderer: elicit.D3Renderer,
    CanvasRenderer: elicit.CanvasRenderer,
    // Theme layer: `themes` (built-ins), `setTheme` (app-wide), `resolveTheme`.
    themes: elicit.themes,
    setTheme: elicit.setTheme,
    resolveTheme: elicit.resolveTheme,
    // The box a padded note occupies — `sticker`'s own sizing rule, for an example
    // that sizes something else to match a note. It lives in the authoring kit: it
    // can only ever appear inside a `{ fn }` channel, so it is never a spec keyword.
    noteBox: elicit.authoring.noteBox,
    d3,
    vancouver,
  };
}

export type ElicitScope = ReturnType<typeof createElicitScope>;
