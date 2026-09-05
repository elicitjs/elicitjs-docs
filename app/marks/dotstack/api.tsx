import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "dotStack(options) · dotStackY(options) · dotStackX(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. The category axis is a band/point scale over the discrete slots. <code className="inline">dotStackY</code> stacks upward (slots on x), <code className="inline">dotStackX</code> rightward (slots on y). Bare <code className="inline">dotStack</code> reads the direction from the channel map: the slot channel's axis is the category, and tokens stack along the other one.
      </>
    ),
    signatures: [
      "dotStack({ channels, orientation, size, gap, ghost, label, edits, id }) → Feature",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            A band/point category axis whose <code className="inline">domain</code> is the slot list.
          </>
        ),
      },
      {
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        default: "from the channel map",
        desc: (
          <>
            Which way tokens stack. <code className="inline">dotStackY</code> / <code className="inline">dotStackX</code> set it; otherwise it follows the positional channel you bound. Same option <code className="inline">bar</code> and <code className="inline">waffle</code> take.
          </>
        ),
      },
      {
        name: "size",
        type: "number",
        default: "7",
        desc: "Token radius (fixed geometry — the stack offset is 2·size + gap per token).",
      },
      {
        name: "gap",
        type: "number",
        default: "2",
        desc: "Gap between stacked tokens, along the stack direction.",
      },
      {
        name: "ghost",
        type: "boolean",
        default: "true",
        desc: "Draw a faint open ring at each slot's next position (a droppable affordance).",
      },
      {
        name: "label",
        type: "boolean",
        default: "false",
        desc: "Draw the per-slot count above each column.",
      },
    ],
    channels: [
      {
        name: "x / y",
        type: "band | point",
        desc: "The category (slot) axis; the other axis is a pure count of stacked tokens.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one <code className="inline">circle</code> per token, plus optional ghost rings and count labels.
      </>
    ),
  },
];
