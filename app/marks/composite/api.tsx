import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "composite(options)",
    summary: (
      <>
        A glyph: a group of marks over the shared dataset. Import from <code className="inline">elicit.plot</code> (<code className="inline">group</code> is an alias). Returns an <b>array of features</b>, which <code className="inline">Elicit</code> flattens into its <code className="inline">marks</code> list. In <b>box mode</b> — switched on by a part stating a <code className="inline">frame:</code> channel — the composite&rsquo;s own <code className="inline">x</code> / <code className="inline">y</code> / <code className="inline">size</code> place and size a per-row box, and the parts are placed inside it.
      </>
    ),
    signatures: [
      "composite({ parts, channels, edits, discreteScale, id }) → Feature[]",
    ],
    options: [
      {
        name: "parts",
        type: "Mark[]",
        default: "[]",
        desc: (
          <>
            The sub-marks, in z-order (later parts paint on top — visual parts first, handles last). Each part is an ordinary mark with its <b>own</b> <code className="inline">channels</code> / style shorthands (arm geometry, per-part stroke, a tip’s <code className="inline">size</code>). A part with an <code className="inline">edit</code> is a handle; a part without one is inert and the engine makes it <code className="inline">pointerEvents:"none"</code> so it can’t swallow a sibling’s drag.
          </>
        ),
      },
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            Shared channel map merged into every part. Use it for glyph-wide bindings (<code className="inline">x</code>/<code className="inline">y</code>/<code className="inline">angle</code>/<code className="inline">fill</code>). A part’s own channel for the same name <b>wins</b> (shallow replace). Inherited <code className="inline">edit</code>s land on the last part only. In <b>box mode</b> <code className="inline">x</code> / <code className="inline">y</code> / <code className="inline">size</code> are withheld — they define the box, not each part’s position — and everything else still trickles.
          </>
        ),
      },
      {
        name: "fill, angle, …",
        type: "shorthand",
        default: "—",
        desc: (
          <>
            Constant shorthands desugared into <b>composite</b> channels (shared by every part unless a part overrides). Parts keep their own shorthands too — e.g. a composite <code className="inline">angle</code>, per-part <code className="inline">stroke</code>.
          </>
        ),
      },
      {
        name: "edits",
        type: "Edit[]",
        default: "—",
        desc: (
          <>
            Mark-level edits. They ride the <b>last</b> part — one dataset, so a whole-dataset edit declared on every part would fire once per part. In box mode they ride the <b>box</b>, whose channel map holds the glyph’s placement columns.
          </>
        ),
      },
      {
        name: "discreteScale",
        type: "'band' | 'point'",
        default: "'band'",
        desc: "Stamped onto any part that doesn’t declare its own. A glyph usually sits in a band slot.",
      },
      {
        name: "id",
        type: "string",
        default: "'composite'",
        desc: (
          <>
            Prefix for the parts’ generated ids (<code className="inline">id/0</code>, <code className="inline">id/1</code>, …), so each part keeps a stable identity across renders.
          </>
        ),
      },
    ],
    channels: [
      {
        name: "frame: -0.4  (on x / y)",
        type: "local position",
        desc: (
          <>
            Local range <code className="inline">[-1, 1]</code> from the box&rsquo;s centre, <b>y up</b> — so <code className="inline">{'{'} frame: -0.4 {'}'}</code> is 40% of the way to the left edge. A local part that states <b>no</b> x/y sits at the origin, so parts never repeat the composite&rsquo;s own position. Long form: <code className="inline">{'{'} datum: -0.4, scale: &quot;frame&quot; {'}'}</code>.
          </>
        ),
      },
      {
        name: "frame: 1  (on size / rx / ry / strokeWidth)",
        type: "local magnitude",
        desc: (
          <>
            Local range <code className="inline">[0, 1]</code>: a fraction of the box&rsquo;s half-size, so the part scales with the glyph.
          </>
        ),
      },
      {
        name: "frame: [lo, hi]  (with a field)",
        type: "field → box",
        desc: (
          <>
            Maps the field&rsquo;s <b>schema domain</b> onto that slice of the box. The range is on the channel, the domain on the schema — the same division as everywhere else. Long form: <code className="inline">scale: {'{'} type: &quot;frame&quot;, range: […] {'}'}</code>.
          </>
        ),
      },
      {
        name: "frame on angle / curvature",
        type: "private scale",
        desc: (
          <>
            No local box — the units are the channel&rsquo;s own (degrees, half-chords). The scale is still per part, which is how two mirrored parts get opposite ranges without colliding on a global axis.
          </>
        ),
      },
    ],
    returns: (
      <>
        An <b>array of features</b> — the parts, with ids assigned, composite channels merged in. In box mode the array is led by the <b>box</b>, which carries the composite&rsquo;s x/y/size and covers the whole glyph — so a <code className="inline">move()</code> / <code className="inline">resize()</code> on those channels picks the glyph up from anywhere on it. Nothing about the glyph reaches the engine: it sees ordinary marks reading the one dataset.
      </>
    ),
  },
];
