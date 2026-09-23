import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "The Edit descriptor",
    summary: (
      <>
        Every edit factory (<code className="inline">elicit.edit.*</code>) returns this shape, built by <code className="inline">makeEdit</code>. The named factories are presets over it: each fixes a <code className="inline">gesture</code> and an <code className="inline">apply</code> — the inversion that turns the gesture back into data. <code className="inline">apply(ctx)</code> is pure: given the context it returns a datum (direct edit), a full array (whole-dataset edit), or <code className="inline">undefined</code> (no-op).
      </>
    ),
    options: [
      {
        name: "gesture",
        type: "'drag'|'click'|'dblclick'|'commit'",
        default: "'drag'",
        desc: "The raw gesture that triggers the edit. 'commit' is a typed string arriving from an inline editor.",
      },
      {
        name: "channels",
        type: "string[] | null",
        default: "null",
        desc: (
          <>
            Channel names it governs; <code className="inline">null</code> injects the channel it was placed on.
          </>
        ),
      },
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "null",
        desc: (
          <>
            Arbitration — whether this edit claims the gesture (e.g. only on Shift). See <code className="inline">edit.when</code>.
          </>
        ),
      },
      {
        name: "pick",
        type: "'direct'|'nearest'|'plane'|'probe'|'sweep'|'draw'|'brush'|'brushRect'",
        default: "'direct'",
        desc: (
          <>
            How the gesture selects its target. Everything but <code className="inline">direct</code> and <code className="inline">plane</code> routes through a driver; register your own with <code className="inline">authoring.registerDriver</code> and name it here.
          </>
        ),
      },
      {
        name: "threshold",
        type: "number",
        default: "0",
        desc: (
          <>
            Proximity radius (px) for <code className="inline">nearest</code>-style picks.
          </>
        ),
      },
      {
        name: "scope",
        type: "null | 'line' | 'scale' | 'legend' | 'network' | 'geo'",
        default: "null",
        desc: "The mark capability this edit needs. A mismatch warns instead of silently doing nothing.",
      },
      {
        name: "constrain",
        type: "Constraint[]",
        default: "[]",
        desc: (
          <>
            Per-edit constraint sugar; the canonical home is the spec’s <code className="inline">constraints</code> (the dataset’s invariants).
          </>
        ),
      },
      {
        name: "guide",
        type: "boolean",
        default: "null",
        desc: "Self-draw this edit’s guide (constraint bounds + snap ring).",
      },
      {
        name: "name",
        type: "string",
        default: "null",
        desc: (
          <>
            The handle an external control addresses this edit by — <code className="inline">el.control(name)</code>. See <a href="/editing/external-controls">External controls</a>. Unnamed edits stay pointer- and keyboard-driven.
          </>
        ),
      },
      {
        name: "channel",
        type: "string",
        default: "—",
        desc: (
          <>
            The single-channel spelling of <code className="inline">channels</code>. Every factory takes either; the singular wins, so it overrides a factory&rsquo;s own default.
          </>
        ),
      },
      {
        name: "stage",
        type: "number",
        default: "null",
        desc: (
          <>
            Only active when the chart is on this stage. See <a href="/editing/stages">Stages</a>.
          </>
        ),
      },
      {
        name: "advance",
        type: "boolean",
        default: "true",
        desc: (
          <>
            Whether a settled <code className="inline">probe</code> click moves to the next stage. Set <code className="inline">false</code> to commit repeatedly within one stage.
          </>
        ),
      },
      {
        name: "into",
        type: "'nearest' | 'new'",
        default: "null",
        desc: (
          <>
            Where a path-authoring gesture writes: extend the closest series, or start a fresh one. See <a href="/editing/sweep">Sweep and draw</a>.
          </>
        ),
      },
      {
        name: "table",
        type: "string",
        default: "the mark's table",
        desc: "Which table this edit writes to, by name. Only meaningful on a multi-table schema.",
      },
      {
        name: "target",
        type: "'domain'",
        default: "—",
        desc: (
          <>
            Write the <b>schema</b> rather than the dataset. Set by <code className="inline">edit.axis.*</code> and <code className="inline">edit.scale.*</code>; see <a href="/editing/axis">Editing the scale</a>.
          </>
        ),
      },
      {
        name: "type",
        type: "string",
        default: "—",
        desc: (
          <>
            The edit&rsquo;s kind, as its dotted path (<code className="inline">move</code>, <code className="inline">line.draw</code>, <code className="inline">geo.brush</code>). Each factory sets its own.
          </>
        ),
      },
      {
        name: "apply",
        type: "(ctx) => datum | data[] | undefined",
        default: "—",
        desc: (
          <>
            The edit itself — maps the gesture to data through the same scale. Never mutate <code className="inline">ctx.data</code>; return a new datum or array.
          </>
        ),
      },
    ],
    returns: (
      <>
        An <b>Edit</b>. The engine matches <code className="inline">gesture</code> + <code className="inline">pick</code>, builds an <code className="inline">EditContext</code>, then calls <code className="inline">apply(ctx)</code>. Three more keys — <code className="inline">cardinality</code>, <code className="inline">inverts</code> and <code className="inline">inline</code> — declare what a new edit does to the dataset; see <a href="/authoring">Authoring</a>.
      </>
    ),
  },
  {
    name: "EditContext (ctx)",
    summary: (
      <>
        The object handed to <code className="inline">apply(ctx)</code> and <code className="inline">when(ctx)</code> — and to <code className="inline">custom(fn)</code>'s one argument. It is the gesture already resolved into plot space plus the mark/scale state needed to invert it. Built once per edit invocation in the engine; read it, don’t mutate it.
      </>
    ),
    options: [
      {
        name: "pointer",
        type: "{ x, y }",
        default: "—",
        desc: (
          <>
            Pointer position in <b>plot pixels</b> (origin at the plot’s top-left, inside the margins). Invert with <code className="inline">ctx.scales.y.invertValue(ctx.pointer.y)</code>.
          </>
        ),
      },
      {
        name: "datum",
        type: "object | undefined",
        default: "—",
        desc: "The row being edited. Set for direct/nearest picks; absent for plane creates that append.",
      },
      {
        name: "index",
        type: "number | null",
        default: "—",
        desc: (
          <>
            Index of <code className="inline">datum</code> in <code className="inline">data</code>. Returning a plain object splices it back at this index.
          </>
        ),
      },
      {
        name: "data",
        type: "Datum[]",
        default: "—",
        desc: (
          <>
            The full current dataset (read-only). Return a new array from <code className="inline">apply</code> for whole-dataset edits (create/remove).
          </>
        ),
      },
      {
        name: "scales",
        type: "ScaleMap",
        default: "—",
        desc: (
          <>
            Live scales by channel name (<code className="inline">ctx.scales.x</code>, <code className="inline">.y</code>, …). Each has <code className="inline">invertValue(pixel)</code> / <code className="inline">encode(value)</code>.
          </>
        ),
      },
      {
        name: "channels",
        type: "ResolvedChannel[]",
        default: "—",
        desc: (
          <>
            This edit’s governed channels, each <code className="inline">{'{'} name, field, scale {'}'}</code>. Empty when the edit named none (typical for bare <code className="inline">custom</code>).
          </>
        ),
      },
      {
        name: "markChannels",
        type: "object",
        default: "—",
        desc: "The mark’s full channel map (name → ChannelSpec). Use to look up a sibling field the edit didn’t declare.",
      },
      {
        name: "event",
        type: "Event",
        default: "—",
        desc: (
          <>
            The raw DOM event (for modifiers like <code className="inline">shiftKey</code>). Prefer <code className="inline">edit.when</code> for arbitration when you can.
          </>
        ),
      },
      {
        name: "node",
        type: "FeatureNode | null",
        default: "—",
        desc: "The scene node under the pointer (direct pick), or null on the plane.",
      },
      {
        name: "value",
        type: "any",
        default: "—",
        desc: (
          <>
            Non-pixel gesture payload — e.g. the typed string from <code className="inline">editText</code>’s <code className="inline">commit</code>. Undefined for pointer gestures.
          </>
        ),
      },
      {
        name: "schema, width, height",
        type: "—",
        default: "—",
        desc: "Dataset schema (for minting rows) and the plot’s inner pixel size (for plane-relative geometry like rotate).",
      },
    ],
    returns: (
      <>
        A line-scoped or driver-backed edit sees more — <code className="inline">seriesKey</code>, <code className="inline">connect</code>, and the driver&rsquo;s own <code className="inline">session</code>. The TypeScript definitions carry the full shape.
      </>
    ),
  },
  {
    name: "Edit catalogue",
    summary: (
      <>
        Universal edits import bare (<code className="inline">elicit.edit.move</code>). A scoped family sits under the subject it is about, and that dotted path is also the edit&rsquo;s <code className="inline">type</code>: <code className="inline">edit.line.draw()</code> is <code className="inline">{'{'} type: "line.draw" {'}'}</code>.
      </>
    ),
    options: [
      {
        name: "move · moveSpan · brushSpan · brushRect",
        type: "drag",
        default: "gestures · handles",
        desc: (
          <>
            Position. <code className="inline">move</code> inverts the pointer on each positional channel; the other three move or resize a two-endpoint span or a 2-D box.
          </>
        ),
      },
      {
        name: "slide · resize · rotate",
        type: "drag",
        default: "gestures",
        desc: (
          <>
            Magnitude and angle. The pointer&rsquo;s axial distance (<code className="inline">slide</code>), radius (<code className="inline">resize</code>) or angle about a pivot (<code className="inline">rotate</code>) inverts to a value.
          </>
        ),
      },
      {
        name: "cycle · toggle · set · rank",
        type: "click",
        default: "gestures · selection",
        desc: (
          <>
            Discrete value. <code className="inline">cycle</code> advances a channel to its next domain value, <code className="inline">toggle</code> flips a row in or out, <code className="inline">set</code> writes a fixed value, <code className="inline">rank</code> reorders rows.
          </>
        ),
      },
      {
        name: "create · remove",
        type: "click",
        default: "existence",
        desc: "Mint a datum from the pointer, or delete the target.",
      },
      {
        name: "editText",
        type: "dblclick",
        default: "sticker",
        desc: "Open an inline editor over the mark and write the typed string back.",
      },
      {
        name: "select",
        type: "click",
        default: "selection",
        desc: "Chart state, not a data row — which rows the chart considers selected.",
      },
      {
        name: "custom",
        type: "drag",
        default: "gestures",
        desc: (
          <>
            An arbitrary <code className="inline">(ctx) ={'>'} …</code> over the full EditContext, for anything the named edits do not cover.
          </>
        ),
      },
      {
        name: "edit.line.*",
        type: "line",
        default: "sweep · existence",
        desc: (
          <>
            <code className="inline">anchor</code>, <code className="inline">newSeries</code>, <code className="inline">draw</code>, <code className="inline">sweep</code>, <code className="inline">removeSeries</code> — author and reshape connected paths. Needs a series-grouping mark.
          </>
        ),
      },
      {
        name: "edit.axis.scale · edit.scale.categories",
        type: "scale",
        default: "axis",
        desc: (
          <>
            Reshape the <b>domain</b> rather than the dataset: drag a positional range, or add, rename and remove categories. <code className="inline">categories()</code> returns three edits — spread it.
          </>
        ),
      },
      {
        name: "edit.legend.category · edit.legend.value",
        type: "legend",
        default: "legend",
        desc: "Turn a legend into an input: click a swatch, or drag the ramp handle.",
      },
      {
        name: "edit.stack.cut · edge · merge",
        type: "stack",
        default: "sweep · handles",
        desc: "Divide a whole among rows: split a segment, move value across a boundary, fuse two back into one.",
      },
      {
        name: "edit.trend.*",
        type: "trend",
        default: "trend",
        desc: (
          <>
            <code className="inline">intercept</code>, <code className="inline">slope</code>, <code className="inline">interceptSpread</code>, <code className="inline">slopeSpread</code> — edit a parametric line by its parameters.
          </>
        ),
      },
      {
        name: "edit.waffle.fill",
        type: "waffle",
        default: "waffle",
        desc: "Fill up to the exact cell under the pointer.",
      },
      {
        name: "edit.network.connect · rewire · reverse",
        type: "network",
        default: "network",
        desc: "Build a network's topology. Nodes themselves are plain create / remove.",
      },
      {
        name: "edit.geo.*",
        type: "geo",
        default: "geo",
        desc: (
          <>
            <code className="inline">move</code>, <code className="inline">create</code>, <code className="inline">draw</code>, <code className="inline">dragVertex</code>, <code className="inline">removeVertex</code>, <code className="inline">brush</code>, <code className="inline">createRect</code> — placed through the chart&rsquo;s projection rather than through x/y scales.
          </>
        ),
      },
      {
        name: "edit.when",
        type: "predicate",
        default: "gestures",
        desc: (
          <>
            Not an edit — the arbitration predicates for an edit&rsquo;s <code className="inline">when</code> (<code className="inline">when.shift</code>, <code className="inline">when.alt</code>, …).
          </>
        ),
      },
    ],
    returns: (
      <>
        See <a href="/editing/gestures">Gestures</a>, <a href="/editing/sweep">Sweep</a>, <a href="/editing/existence">Existence</a> and each mark&rsquo;s page for a factory&rsquo;s own options. There is no <code className="inline">edit.face.*</code>: a face is a composite of ordinary marks, so its parameters take the universal edits.
      </>
    ),
  },
];
