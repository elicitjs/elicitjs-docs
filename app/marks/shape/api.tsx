import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "shape(options)",
    summary: (
      <>
        One SVG path per row, centred at <code className="inline">x</code>/<code className="inline">y</code>. The shape comes from a <code className="inline">symbol</code> channel or the <code className="inline">path</code> option. It takes every universal edit, is picked inside its body, and declares a node box for a <a href="/marks/network">network</a>.
      </>
    ),
    signatures: [
      "shape({ channels, path, edits, id, table, tip }) → Mark",
    ],
    options: [
      {
        name: "path",
        type: "string | (d, i, data) => string",
        default: "'circle'",
        desc: (
          <>
            The shape when no <code className="inline">symbol</code> channel is declared: a shape name, an SVG path, or a function of the row returning either. A string that is neither draws a circle and logs a warning.
          </>
        ),
      },
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
        name: "edits",
        type: "Edit[]",
        default: "—",
        desc: (
          <>
            Mark-level edits. <code className="inline">move</code>, <code className="inline">resize</code>, <code className="inline">rotate</code> and the rest work as on <code className="inline">point</code>.
          </>
        ),
      },
      {
        name: "fill, stroke, size, angle, …",
        type: "style",
        default: "fill: theme ink",
        desc: "Shorthands for constant channels.",
      },
    ],
    channels: [
      {
        name: "x / y",
        type: "linear | point",
        desc: "The shape's centre. Omitted, it sits at the middle of the plot on that axis.",
      },
      {
        name: "symbol",
        type: "ordinal",
        desc: (
          <>
            The shape per row. A field maps onto the named shapes <code className="inline">circle</code>, <code className="inline">square</code>, <code className="inline">triangle</code>, <code className="inline">diamond</code>, <code className="inline">star</code>, <code className="inline">cross</code>, <code className="inline">wye</code> by default, or onto <code className="inline">{'scale: { range: [...] }'}</code> — names or SVG path strings. Overrides <code className="inline">path</code>.
          </>
        ),
      },
      {
        name: "size",
        type: "linear",
        desc: (
          <>
            The radius of the box the shape fits, in px (default 6). Pair with <code className="inline">resize()</code> to drag it.
          </>
        ),
      },
      {
        name: "angle",
        type: "linear",
        desc: (
          <>
            Rotation in degrees, counter-clockwise from east, about the shape&rsquo;s centre. Pair with <code className="inline">{"rotate({ pick: 'direct', pivot: 'mark', fold: false })"}</code>.
          </>
        ),
      },
      {
        name: "fill / stroke / strokeWidth / strokeDash / opacity",
        type: "const | field",
        desc: "Paint, as on any mark.",
      },
      {
        name: "ports",
        type: "true | sides | { out, in }",
        desc: (
          <>
            Where links may meet the shape&rsquo;s box in a network. Pair with <code className="inline">edit.network.connect()</code>.
          </>
        ),
      },
    ],
  },
];
