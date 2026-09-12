import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "needle(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One needle (+ hub) per datum.
      </>
    ),
    signatures: [
      "needle({ channels, length, handles, handleSize, handleColor, baseWidth, id }) → Feature",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            Must include <code className="inline">theta</code> — the polar angular position. (<code className="inline">angle</code> is a mark&rsquo;s rotation in place and is not read here.) Optional <code className="inline">x</code>/<code className="inline">y</code> place the pivot (default: plot centre).
          </>
        ),
      },
      {
        name: "length",
        type: "number",
        default: "40% of min(w,h)",
        desc: (
          <>
            Needle length in px. Or drive via the <code className="inline">size</code> channel.
          </>
        ),
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Pivot circle radius in px.",
      },
      {
        name: "baseWidth",
        type: "number",
        default: "10",
        desc: "Width of the needle base in px.",
      },
    ],
    channels: [
      {
        name: "theta",
        type: "linear | point (deg)",
        desc: (
          <>
            The elicited value, mapped to degrees by its scale. Default range <code className="inline">[180, 0]</code>.
          </>
        ),
      },
      {
        name: "x / y",
        type: "linear | point",
        desc: "Optional pivot position — categorical or quantitative.",
      },
      {
        name: "fill / stroke",
        type: "style",
        desc: "Needle colour.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting a filled needle <code className="inline">path</code> and hub <code className="inline">circle</code> per datum.
      </>
    ),
  },
];
