import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit({ name }) · container.control(name, index?)",
    summary: (
      <>
        Give any edit a <code className="inline">name</code>, then drive it from outside the chart with{' '}
        <code className="inline">el.control(name)</code>. The control synthesizes the same events a pointer
        does and feeds them to the one dispatch — so constraints, undo, guides, and{' '}
        <code className="inline">on("change")</code> all run. A new input <em>source</em>, not a second
        interaction system.
      </>
    ),
    signatures: [
      "move({ name: \"move\", channels: [\"x\", \"y\"] })   // name an edit",
      "const h = el.control(\"move\", 0);   // handle bound to the edit + datum 0",
      "h.set(value)          // one-shot write (value edit) …",
      "h.set({ x, y })       // … or a data value per channel (positional edit)",
      "h.begin(); h.set(v); h.end();   // live drag → ONE undo entry",
      "h.fire()              // TRIGGER edit (cycle/remove/toggle) — fires its click gesture",
      "h.emit(event)         // raw event passthrough, scoped to this feature/node",
      "h.accepts()           // what the channel's scale allows",
    ],
    options: [
      {
        name: "edit.name",
        type: "string",
        default: "null",
        desc: "The handle this edit answers to. An edit with no name stays pointer- and keyboard-driven.",
      },
      {
        name: "control(name, index?)",
        type: "→ EditControl",
        default: "index: 0",
        desc: "A handle bound to that edit and that row. Ask for it again after the data changes; it resolves the edit on each call.",
      },
      {
        name: "h.set(value)",
        type: "void",
        default: "—",
        desc: (
          <>
            Write a <b>data</b> value. A scalar for a single-channel edit, or a map keyed by channel or field for a multi-channel one. Untouched axes hold their current position rather than teleporting.
          </>
        ),
      },
      {
        name: "h.begin() / h.end()",
        type: "void",
        default: "—",
        desc: (
          <>
            Bracket a live drag, so many <code className="inline">set</code> ticks collapse into one <a href="/editing/history">undo</a> entry — exactly as a pointer drag does.
          </>
        ),
      },
      {
        name: "h.fire()",
        type: "void",
        default: "—",
        desc: (
          <>
            Trigger an edit that takes no value — <code className="inline">cycle</code>, <code className="inline">remove</code>, <code className="inline">toggle</code>. It dispatches the edit&rsquo;s own gesture on the row.
          </>
        ),
      },
      {
        name: "h.accepts()",
        type: "→ object | null",
        default: "—",
        desc: (
          <>
            What the channel&rsquo;s scale allows: <code className="inline">{'{ field, type, kind, temporal, invertible, domain, values, range }'}</code>. <code className="inline">values</code> is the accepted set on a discrete channel and <code className="inline">null</code> on a continuous one, where <code className="inline">domain</code> is the accepted range — so a picker or slider can offer only valid choices.
          </>
        ),
      },
      {
        name: "h.emit(event)",
        type: "void",
        default: "—",
        desc: "A raw event, scoped to this edit's feature and node. The low-level route when you already hold pixels.",
      },
    ],
    returns: (
      <>
        Every route runs the ordinary dispatch, so a constraint gates an external write exactly as it gates a drag. External control is not a bypass.
      </>
    ),
  },
  {
    name: "set(options?)",
    summary: (
      <>
        The universal value edit: write a value into a channel's field — quantitative, colour,
        categorical, temporal. The <code className="inline">commit</code>-gesture counterpart to the
        positional edits, and what an external picker/slider drives via{' '}
        <code className="inline">control(name).set(value)</code>. (<code className="inline">editText</code>{' '}
        is its text specialization.)
      </>
    ),
    signatures: [
      "fill: { field: \"group\", edit: set({ name: \"category\" }) }",
      "el.control(\"category\", i).set(\"B\")",
    ],
  },
  {
    name: "select() · el.select · el.selectWhere",
    summary: (
      <>
        Selection is transient <em>pipeline</em> state, not a <code className="inline">selected</code> data
        column. Put <code className="inline">edit.select()</code> on a mark to select it by click; drive the
        same state from outside with <code className="inline">el.select(index)</code> (a specific item) or{' '}
        <code className="inline">el.selectWhere(field, value)</code> (a category — the first matching row).
        The selected row gets the highlight outline, and a legend picker's{' '}
        <code className="inline">row</code> defaults to it. A <code className="inline">select</code> event
        fires; <code className="inline">on("change")</code>/<code className="inline">getData</code> never do.
      </>
    ),
    signatures: [
      "edits: [ select() ]            // click a mark to select it",
      "el.select(2)                   // select a SPECIFIC item by index",
      "el.selectWhere(\"group\", \"North\")  // select by CATEGORY (first match)",
      "el.getSelection()             // → index | null",
      "el.clearSelection()           // deselect all",
      "el.on(\"select\", (i, all) => …)  // selection changed (no data moved)",
    ],
  },
  {
    name: "container.emit(event)",
    summary: (
      <>
        Low-level: inject a renderer-shaped gesture event directly. <code className="inline">x</code>/
        <code className="inline">y</code> are inner (margin-subtracted) pixels. Prefer{' '}
        <code className="inline">control</code>, which computes pixels from a data value for you.
      </>
    ),
    signatures: [
      "el.emit({ type: \"commit\", node, value })",
      "el.emit({ type: \"dragstart\", node });  el.emit({ type: \"drag\", node, x, y });  el.emit({ type: \"dragend\", node })",
    ],
  },
];
