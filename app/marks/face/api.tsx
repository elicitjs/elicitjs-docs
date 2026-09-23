import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "face(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A <b>preset, not a mark</b>: it returns a <a href="/marks/composite#box">composite in box mode</a> — a head <code className="inline">point</code>, two <code className="inline">ellipse</code> eyes, two <code className="inline">tickY</code> brows and a <code className="inline">curveY</code> mouth — each placed in the glyph&rsquo;s own local units. So every feature is its own drag target, and every parameter takes the universal edits. Its centre is placed by the x/y channels when present, else parked at the plot centre.
      </>
    ),
    signatures: [
      "face({ channels, size, ink, edits, id }) → Feature[]",
    ],
    options: [
      {
        name: "channels",
        type: "FaceChannels",
        default: "emotion preset",
        desc: (
          <>
            The channel map. The <b>six face params are channels</b> — bind a field with <code className="inline">mouthCurve: {'{'} field: 'joy', edit: slide({'{'} axis: 'y' {'}'}) {'}'}</code>, or pin a constant with <code className="inline">{'{'} value: 0.8 {'}'}</code> (a fraction of that param&rsquo;s travel). Bind none and you get the emotion preset (mouthCurve ← valence, eyeScale ← arousal); binding any one replaces it.
          </>
        ),
      },
      {
        name: "size",
        type: "number | ChannelSpec",
        default: "band slot, else min(w,h)·0.35",
        desc: "The box's half-size, which the head is drawn at — so every feature scales with it. Set it when drawing many faces so they don't overlap.",
      },
      {
        name: "ink",
        type: "string",
        default: "'#1f2937'",
        desc: "The colour of the drawn features (eyes, brows, mouth).",
      },
      {
        name: "channels.x / .y",
        type: "ChannelSpec",
        default: "—",
        desc: "Optional: place the face centre in a plot (small-multiples, or an emotion-space scatter). An edit here rides on the box, which covers the whole glyph — so move() picks the face up from anywhere on it.",
      },
      {
        name: "fill, stroke",
        type: "style",
        default: "'#FFD666' / '#B7791F'",
        desc: "The head's colour.",
      },
      {
        name: "edits",
        type: "Edit[]",
        default: "—",
        desc: "Mark-level edits. They ride on the HEAD part, so a whole-dataset edit (create) fires once per gesture rather than once per facial feature.",
      },
    ],
    channels: [
      {
        name: "mouthCurve",
        type: "→ mouth curvature",
        desc: (
          <>
            Deep frown ∩ ↔ deep smile ∪. Natural edit: <code className="inline">slide({'{'} axis: 'y', increase: 'up' {'}'})</code>. (Preset: ← <code className="inline">valence</code>.)
          </>
        ),
      },
      {
        name: "mouthAsym",
        type: "→ mouth angle",
        desc: (
          <>
            Centred ↔ smirk. Natural edit: <code className="inline">rotate({'{'} pivot: 'mark', pick: 'direct' {'}'})</code>.
          </>
        ),
      },
      {
        name: "eyeScale",
        type: "→ eye rx",
        desc: (
          <>
            Pinpricks ↔ wide. Natural edit: <code className="inline">slide({'{'} axis: 'x', increase: 'right' {'}'})</code>. (Preset: ← <code className="inline">arousal</code>.)
          </>
        ),
      },
      {
        name: "eyeSquint",
        type: "→ eye ry",
        desc: (
          <>
            Round ↔ flat. Natural edit: <code className="inline">slide({'{'} axis: 'y', increase: 'down' {'}'})</code>. Unbound, the eyes stay round as they widen.
          </>
        ),
      },
      {
        name: "browHeight",
        type: "→ brow y",
        desc: (
          <>
            Slammed down ↔ high arch. Natural edit: <code className="inline">slide({'{'} axis: 'y', increase: 'up' {'}'})</code>.
          </>
        ),
      },
      {
        name: "browTilt",
        type: "→ brow angle",
        desc: (
          <>
            Sad (outer-down) ↔ angry (inner-down); the two brows mirror each other. Natural edit: <code className="inline">rotate({'{'} pivot: 'mark', pick: 'direct' {'}'})</code>.
          </>
        ),
      },
      {
        name: "x, y",
        type: "→ box x, y",
        desc: "Face centre; omitted parks it at the plot centre. move() on either picks the whole face up.",
      },
      {
        name: "size",
        type: "→ box size",
        desc: "The box's half-size, drawn as the head. resize() on it scales the whole glyph.",
      },
    ],
    returns: (
      <>
        An <b>array of features</b> (Elicit flattens it): the composite&rsquo;s <b>box</b> — which draws one invisible hit circle per row, so <code className="inline">move()</code> / <code className="inline">resize()</code> on x/y/size picks the whole face up — then head, eyes, brows and mouth.
      </>
    ),
  },
];
