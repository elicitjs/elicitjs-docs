import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "point(options)",
    json: ['plot.point'],
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A circle or square per datum; every channel — positional or not — resolves through the global scales.
      </>
    ),
    signatures: [
      "point({ channels, shape, edits, id }) → Feature",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            Channel map — see <b>Channels</b>.
          </>
        ),
      },
      {
        name: "image",
        type: "string | (d) => string | ChannelSpec",
        default: "—",
        desc: (
          <>
            The shape's background image: a URL painted inside each shape in place of the fill. Takes <code className="inline">fit</code>, <code className="inline">position</code> and <code className="inline">repeat</code> as channel params, as in CSS. See <a href="/marks/image#settings">Image</a>.
          </>
        ),
      },
      {
        name: "shape",
        type: "'circle' | 'square'",
        default: "'circle'",
        desc: (
          <>
            Glyph shape. A square is a centred rect with side <code className="inline">2 × size</code>, so an <code className="inline">angle</code> channel can spin it.
          </>
        ),
      },
      {
        name: "edits",
        type: "Edit[]",
        default: "—",
        desc: "Mark-level edits; per-channel edits live in the channels map.",
      },
      {
        name: "tip",
        type: "true | string[] | (d) => string",
        default: "—",
        desc: (
          <>
            A tooltip of the row under the pointer, as on every mark: all columns, the listed ones, or your own text. See <a href="/guides#tips">Tooltips</a>.
          </>
        ),
      },
      {
        name: "motion",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Eased drawing, as on every mark. When the rows change, the mark&apos;s shapes travel to their new places. A grabbed row is drawn at the pointer along a channel whose scale is a band or a point scale, and eases into its slot on release. The data is never eased. See <a href="/widgets#ranking">Ranking</a>.
          </>
        ),
      },
      {
        name: "fill, stroke, size, angle, …",
        type: "style",
        default: "fill: 'steelblue'",
        desc: "Shorthands / channels.",
      },
    ],
    channels: [
      {
        name: "x",
        type: "linear | band",
        desc: "Horizontal position; omitted parks the dot at the centre of x.",
      },
      {
        name: "y",
        type: "linear | band",
        desc: "Vertical position; omitted parks the dot at the centre of y.",
      },
      {
        name: "size",
        type: "linear",
        desc: (
          <>
            The circle radius / half square side (default 5). Pair with <code className="inline">edit: resize()</code> to drag the radius.
          </>
        ),
      },
      {
        name: "angle",
        type: "linear",
        desc: (
          <>
            Orientation in math degrees (0° = +x, CCW). Pair with <code className="inline">edit: rotate({'{'} pivot: 'mark', fold: false, pick: 'direct' {'}'})</code>. Circles are rotation-invariant; squares and symbols rotate.
          </>
        ),
      },
      {
        name: "fill",
        type: "const | field",
        desc: (
          <>
            Fill; a field tints through the ordinal palette.
          </>
        ),
      },
      {
        name: "stroke, strokeWidth, opacity",
        type: "const | field",
        desc: "Standard style surface.",
      },
      {
        name: "symbol",
        type: "const | field",
        desc: (
          <>
            Draws the point as a glyph (emoji or unicode shape), drawn as text and sized by <code className="inline">size</code>. An SVG path warns; use <a href="/marks/shape"><code className="inline">plot.shape()</code></a> for path shapes.
          </>
        ),
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one <code className="inline">circle</code> or <code className="inline">rect</code> per datum.
      </>
    ),
  },
];
