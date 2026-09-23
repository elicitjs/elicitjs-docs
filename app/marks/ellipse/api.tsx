import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "ellipse(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A dot with <b>two independent radii</b>. <code className="inline">point</code> has one <code className="inline">size</code> channel because a circle has one radius; splitting it into <code className="inline">rx</code> and <code className="inline">ry</code> means each can carry its own field and its own edit — two elicited numbers in one shape.
      </>
    ),
    signatures: [
      "ellipse({ channels, edits, id }) → Mark",
    ],
    options: [
      {
        name: "channels",
        type: "Channels",
        default: "{}",
        desc: "x, y, rx, ry, angle plus the standard style channels.",
      },
      {
        name: "size",
        type: "number | ChannelSpec",
        default: "5",
        desc: "The fallback for whichever radius is not otherwise named, so ellipse({ size: 6 }) is a circle.",
      },
      {
        name: "fill, stroke, …",
        type: "style",
        default: "theme ink",
        desc: "The standard style surface, same as every mark.",
      },
    ],
    channels: [
      { name: "x, y", type: "linear | band | point", desc: "The centre. A missing channel parks it at the centre of that dimension." },
      {
        name: "rx",
        type: "size",
        desc: (
          <>
            Horizontal radius in px (default range <code className="inline">[3, 18]</code>). Natural edit: <code className="inline">slide({'{'} axis: 'x' {'}'})</code>.
          </>
        ),
      },
      {
        name: "ry",
        type: "size",
        desc: (
          <>
            Vertical radius in px. Natural edit: <code className="inline">slide({'{'} axis: 'y' {'}'})</code>. Both fall back to <code className="inline">size</code>.
          </>
        ),
      },
      { name: "angle", type: "linear", desc: "Tilt in math degrees about the centre. A rotated ellipse is hit-tested in its own frame, so it stays grabbable where it is drawn." },
    ],
    returns: <>A <b>mark</b> emitting one <code className="inline">ellipse</code> node per datum.</>,
  },
];
