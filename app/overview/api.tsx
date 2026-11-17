import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "Elicit(spec)",
    json: ['spec'],
    summary: (
      <>
        The entry point (<code className="inline">elicit.Elicit</code>). Builds a dataset and one chart over it from one spec, and returns the <b>chart</b>. Append <code className="inline">chart.dom()</code> to the page. The spec takes the dataset keys and the chart keys below. For several charts over one dataset, call <code className="inline">Elicit.dataset</code> and <code className="inline">ds.chart</code> instead — see <a href="/dataset">Datasets &amp; linked charts</a>.
      </>
    ),
    signatures: [
      "Elicit({ schema, data?, marks, width?, height?, … }) → Chart",
      "parent.append(chart.dom())",
      "Elicit.dataset({ schema, data?, … }).chart({ marks, … })   // the same thing, in two calls",
    ],
    returns: (
      <>
        A <b>Chart</b>, which also carries the dataset&rsquo;s methods. The dataset deep-copies <code className="inline">data</code> and owns it; marks re-derive from the committed rows on every render.
      </>
    ),
  },
  {
    name: "Dataset keys",
    json: ['spec'],
    summary: (
      <>
        What <code className="inline">Elicit.dataset(spec)</code> reads, and the part of an <code className="inline">Elicit(spec)</code> spec that describes the data. Every chart over the dataset shares these.
      </>
    ),
    signatures: [
      "Elicit.dataset({ schema, data?, constraints?, lock?, context?, onChange? }) → Dataset",
    ],
    options: [
      {
        name: "schema",
        type: "Schema",
        default: "required",
        desc: (
          <>
            Field → measurement type / domain / default. Owns every field’s data type and <b>domain</b> — marks never declare one. See <a href="/schema">Data schema</a>.
          </>
        ),
      },
      {
        name: "data",
        type: "Datum[]",
        default: "[]",
        desc: (
          <>
            The seed rows. Every mark in every chart is a <i>view</i> over them. May be empty when <code className="inline">create</code> will mint rows from the schema.
          </>
        ),
      },
      {
        name: "constraints",
        type: "Constraint[]",
        default: "[]",
        desc: (
          <>
            Dataset invariants that gate or repair every edit, from every chart. The only place they go. See <a href="/constraints">Constraints</a>.
          </>
        ),
      },
      {
        name: "lock",
        type: "LockSpec",
        default: "—",
        desc: (
          <>
            Read-only rows. See <a href="/editing/lock">Locked rows</a>.
          </>
        ),
      },
      {
        name: "context",
        type: "ContextSpec",
        default: "—",
        desc: (
          <>
            Reference rows: drawn, read-only, and left out of <code className="inline">getData()</code>. See <a href="/editing/existence#context">Context rows</a>.
          </>
        ),
      },
      {
        name: "onChange",
        type: "(data) => void",
        default: "—",
        desc: "Called with the committed data once per commit, whichever chart made it. Hover previews never fire it.",
      },
    ],
  },
  {
    name: "Chart keys",
    json: ['spec'],
    summary: (
      <>
        What <code className="inline">ds.chart(spec)</code> reads: how one chart draws and edits the dataset. Each chart over a dataset has its own.
      </>
    ),
    signatures: [
      "ds.chart({ marks, width?, height?, … }) → Chart",
    ],
    options: [
      {
        name: "marks",
        type: "Mark[]",
        default: "[]",
        desc: (
          <>
            The marks — <code className="inline">bar(...)</code>, <code className="inline">point(...)</code>, <code className="inline">composite(...)</code>, … drawn in array order (later marks on top). Auto-axes and edit guides keep their own layers behind / in front of marks.
          </>
        ),
      },
      {
        name: "elements",
        type: "Feature[]",
        default: "[]",
        desc: (
          <>
            Scale chrome — <a href="/marks/axes">axis</a>, grid, <a href="/marks/legend">legend</a>, <a href="/marks/axis-radial">axisRadial</a>. Drawn alongside <code className="inline">marks</code>; the split only separates chrome from data in your own source.
          </>
        ),
      },
      {
        name: "scales",
        type: "Record<channel, ScaleSpec>",
        default: "derived",
        desc: (
          <>
            Chart-level scale overrides keyed by channel (<code className="inline">x</code>, <code className="inline">y</code>, <code className="inline">fill</code>, …). Domains stay on the schema. See <a href="/scales">Scales & channels</a>.
          </>
        ),
      },
      {
        name: "width / height",
        type: "number",
        default: "600 / 400",
        desc: "Outer pixel size of the chart.",
      },
      {
        name: "margins",
        type: "{top,right,bottom,left}",
        default: "{20,20,30,40}",
        desc: "Inset around the inner plot (leaves room for axes).",
      },
      {
        name: "responsive",
        type: "'fixed' | 'scale' | 'reflow' | true",
        default: "'fixed'",
        desc: (
          <>
            Sizing mode — see <a href="/sizing">Responsive sizing</a>.
          </>
        ),
      },
      {
        name: "motion",
        type: "false | { duration }",
        default: "{ duration: 220 }",
        desc: (
          <>
            Eased drawing. A hierarchy&apos;s layout, and every mark with <code>motion: true</code>, glides to its new place over <code>duration</code> ms. <code>false</code> draws every change at once. Off when the reader&apos;s system asks for reduced motion. See <a href="/marks/hierarchy#gestures">Hierarchy</a> and <a href="/widgets#ranking">Ranking</a>.
          </>
        ),
      },
      {
        name: "focusOutline",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Browser focus ring on editable marks. Off by default — Tab / arrow keys still work. See <a href="/editing/history#keyboard">History &amp; keyboard</a>.
          </>
        ),
      },
      {
        name: "axes",
        type: "object | false",
        default: "auto",
        desc: (
          <>
            Global axis convenience — desugars into axis/grid marks; <code className="inline">false</code> drops them.
          </>
        ),
      },
      {
        name: "guides",
        type: "Guide[]",
        default: "[]",
        desc: "Non-interactive annotations rebuilt every render.",
      },
      {
        name: "effects",
        type: "object",
        default: "defaults",
        desc: "Interaction-feedback layer (grab / select), kept off mark paint channels.",
      },
      {
        name: "legends",
        type: "boolean | object",
        default: "none",
        desc: (
          <>
            <code className="inline">true</code> draws one legend per bound non-positional scale; an object configures or suppresses each. Off by default, unlike <code className="inline">axes</code>, because a legend reserves layout space. See <a href="/marks/legend">Legend</a>.
          </>
        ),
      },
      {
        name: "title / subtitle / caption",
        type: "string",
        default: "—",
        desc: (
          <>
            Text above the plot (title, then subtitle) and below it (caption). Like a legend, they reserve layout space, so the chart keeps its declared size and the plot shrinks. Styled by the theme&rsquo;s <code className="inline">title</code> / <code className="inline">subtitle</code> / <code className="inline">caption</code> tokens. See <a href="/theming#titles">Theming</a>.
          </>
        ),
      },
      {
        name: "theme",
        type: "object | string",
        default: "the app default",
        desc: (
          <>
            Per-chart theme, over whatever <code className="inline">setTheme()</code> set. See <a href="/theming">Theming</a>.
          </>
        ),
      },
      {
        name: "projection",
        type: "string | object",
        default: "—",
        desc: (
          <>
            Turns the plane into a map; auto-axes go off when it is set. See <a href="/marks/geo">Geo</a>.
          </>
        ),
      },
      {
        name: "stage / stageLabels",
        type: "number / string[]",
        default: "0 / []",
        desc: (
          <>
            The stage a multi-step elicitation starts on, and the caption for each. See <a href="/editing/stages">Stages</a>.
          </>
        ),
      },
      {
        name: "overflow",
        type: "'hidden' | 'visible'",
        default: "'hidden'",
        desc: "Whether marks are clipped to the plot viewport. 'visible' lets a radial or gauge label sit in the margin band.",
      },
      {
        name: "renderer",
        type: "Renderer",
        default: "D3Renderer",
        desc: "The scene-graph renderer; swappable for Canvas/WebGL.",
      },
    ],
  },
  {
    name: "The dataset",
    json: false,
    summary: (
      <>
        What <code className="inline">Elicit.dataset</code> returns. It reads and writes the data from outside any chart, and every chart over it redraws on a change. A chart carries the same methods, so <code className="inline">chart.getData()</code> is <code className="inline">chart.dataset.getData()</code>.
      </>
    ),
    signatures: [
      "ds.chart(spec) → Chart",
      "ds.getData() → Datum[]",
      "ds.getSchema() → Schema",
      "ds.setData(data) → void",
      "ds.setDomain(field, domain, { table? }) → boolean",
      "ds.set(field, value, { index?, table? }) → boolean",
      "ds.on(\"change\" | \"select\", cb) → () => void",
      "ds.undo() · ds.redo() · ds.canUndo() · ds.canRedo()",
      "ds.select(i) · selectWhere · toggleSelection · selectAll · clearSelection",
      "ds.getSelection() · ds.getSelectionAll()",
    ],
    options: [
      {
        name: "chart(spec)",
        type: "→ Chart",
        default: "—",
        desc: (
          <>
            A chart over this dataset. Make as many as you need. See <a href="/dataset">Datasets &amp; linked charts</a>.
          </>
        ),
      },
      {
        name: "getData()",
        type: "→ Datum[]",
        default: "—",
        desc: (
          <>
            A deep <b>copy</b> of the committed data — the elicited answer. Copy, because handing out the live rows would let a caller mutate past every constraint the dataset just enforced.
          </>
        ),
      },
      {
        name: "getSchema()",
        type: "→ Schema",
        default: "—",
        desc: (
          <>
            A deep copy of the dataset&rsquo;s schema, including any domain an <a href="/editing/axis">editable axis</a> reshaped. Your original <code className="inline">spec.schema</code> is never mutated.
          </>
        ),
      },
      {
        name: "setData(data)",
        type: "void",
        default: "—",
        desc: (
          <>
            Replace the rows and redraw every chart. Bypasses constraints — it is a trusted seed or reset, not an edit — and clears the <a href="/editing/history">undo history</a> for the same reason.
          </>
        ),
      },
      {
        name: "setDomain(field, domain)",
        type: "→ boolean",
        default: "—",
        desc: (
          <>
            Set a field&rsquo;s domain, for a zoom button or a reset. One undo step; <code className="inline">null</code> restores the declared domain. Every chart shares the domain. See <a href="/editing/zoom#set-domain">Zoom &amp; pan</a>.
          </>
        ),
      },
      {
        name: "set(field, value, options?)",
        type: "→ boolean",
        default: "—",
        desc: (
          <>
            Write one cell from outside any chart. Runs the dataset&rsquo;s constraints and the lock; one undo step. See <a href="/dataset#set">Write from outside a chart</a>.
          </>
        ),
      },
      {
        name: "on(type, cb)",
        type: "→ unsubscribe",
        default: "—",
        desc: (
          <>
            <code className="inline">change</code> fires once per commit with the new data; <code className="inline">select</code> fires when the <a href="/editing/selection">selection</a> moves. Returns a function that removes the listener.
          </>
        ),
      },
      {
        name: "undo() / redo()",
        type: "→ boolean",
        default: "—",
        desc: (
          <>
            Step one <b>gesture</b>, whichever chart it happened in, and report whether they moved. See <a href="/editing/history">History & keyboard</a>.
          </>
        ),
      },
      {
        name: "select(i) / selectWhere / toggleSelection / selectAll / clearSelection",
        type: "→ boolean",
        default: "—",
        desc: (
          <>
            Set which rows are selected, by index or by a field match. Every chart shows the selection. See <a href="/editing/selection">Selection</a>.
          </>
        ),
      },
      {
        name: "getSelection() / getSelectionAll()",
        type: "→ number | number[]",
        default: "—",
        desc: "The selected row, and every selected row when the selection is multiple.",
      },
    ],
    returns: (
      <>
        <code className="inline">change</code> is the seam to the rest of your app: a survey posts <code className="inline">getData()</code> on submit, a live app writes it through on every commit.
      </>
    ),
  },
  {
    name: "The chart",
    json: false,
    summary: (
      <>
        What <code className="inline">Elicit</code> and <code className="inline">ds.chart</code> return: a plain object, not a DOM node. <code className="inline">dom()</code> is the node to append. It carries every dataset method above, plus its own.
      </>
    ),
    signatures: [
      "chart.dom() → HTMLDivElement",
      "chart.dataset → Dataset",
      "chart.on(\"change\" | \"select\" | \"stage\", cb) → () => void",
      "chart.getStage() · chart.setStage(i) · chart.nextStage() · chart.getStageLabel()",
      "chart.control(name, index?) → EditControl",
      "chart.emit(event) → void",
      "chart.destroy() → void",
    ],
    options: [
      {
        name: "dom()",
        type: "→ HTMLDivElement",
        default: "—",
        desc: "The chart's container. Append it where you like; it is the same node on every call.",
      },
      {
        name: "dataset",
        type: "Dataset",
        default: "—",
        desc: (
          <>
            The dataset this chart reads and writes. For <code className="inline">Elicit(spec)</code>, the one built from the same spec.
          </>
        ),
      },
      {
        name: "on(\"stage\", cb)",
        type: "→ unsubscribe",
        default: "—",
        desc: (
          <>
            Fires when this chart&rsquo;s <a href="/editing/stages">stage</a> changes. <code className="inline">change</code> and <code className="inline">select</code> are the dataset&rsquo;s.
          </>
        ),
      },
      {
        name: "getStage() / setStage(i) / nextStage() / getStageLabel()",
        type: "→ number | string | void",
        default: "—",
        desc: (
          <>
            Read and drive a multi-step elicitation from outside. Stages are per chart. See <a href="/editing/stages">Stages</a>.
          </>
        ),
      },
      {
        name: "control(name, index?)",
        type: "→ EditControl",
        default: "—",
        desc: (
          <>
            Replay a gesture on this chart through a named edit (a slider, a picker). Same dispatch as the pointer — constraints, undo, and <code className="inline">change</code> all run. See <a href="/editing/external-controls">External controls</a>.
          </>
        ),
      },
      {
        name: "emit(event)",
        type: "void",
        default: "—",
        desc: (
          <>
            Low-level: inject a renderer-shaped gesture event (inner pixels). Prefer <code className="inline">control</code> unless you already hold pixels.
          </>
        ),
      },
      {
        name: "destroy()",
        type: "void",
        default: "—",
        desc: "Detach the chart from its dataset and stop its observers. Call it when you unmount the chart — a resize-observing chart outlives its node otherwise. Other charts on the dataset keep working.",
      },
    ],
  },
];
