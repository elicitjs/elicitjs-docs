import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "waffle(options) · waffleY(options) · waffleX(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. <code className="inline">waffleY</code> grows blocks upward (category on x), <code className="inline">waffleX</code> rightward (category on y). Bare <code className="inline">waffle</code> reads the direction from the channel map: the category's axis is the band, and <code className="inline">count</code> runs along the other one.
      </>
    ),
    signatures: [
      "waffleY({ channels, orientation, unit, multiple, shape, showEmpty, emptyFill, gap, edits, id }) → Feature",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
One band (category) axis — <code className="inline">x</code> or <code className="inline">y</code> — plus <code className="inline">count</code>, the magnitude. Put <code className="inline">edit: edit.waffle.fill()</code> on <code className="inline">count</code>; it fills up to the exact cell under the pointer, for both drag and click.
          </>
        ),
      },
      {
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        default: "from the channel map",
        desc: (
          <>
            Which way the blocks grow. <code className="inline">waffleY</code> / <code className="inline">waffleX</code> set it; otherwise it follows the positional channel you bound. Same option <code className="inline">bar</code> takes.
          </>
        ),
      },
      {
        name: "unit",
        type: "number",
        default: "1",
        desc: (
          <>
            The quantity <b>one cell</b> represents. <code className="inline">value / unit</code> cells fill; raise it for large counts, lower it ({'>'}0) for fine fractions.
          </>
        ),
      },
      {
        name: "multiple",
        type: "number",
        default: "auto",
        desc: (
          <>
            Cells across the band. Defaults to whatever makes cells square given the band width and scale; each row then spans <code className="inline">multiple · unit</code>.
          </>
        ),
      },
      {
        name: "shape",
        type: "'rect' | 'circle'",
        default: "'rect'",
        desc: "Cell shape — square cells or dots.",
      },
      {
        name: "showEmpty",
        type: "boolean",
        default: "true",
        desc: (
          <>
            Draw the unfilled cells (the value track). Set <code className="inline">false</code> to hide them; they stay as invisible drag targets, so dragging up to raise the count still works.
          </>
        ),
      },
      {
        name: "emptyFill",
        type: "string",
        default: "'#eee'",
        desc: "Colour of the unfilled cells when shown (filled cells use the standard style surface).",
      },
      {
        name: "gap",
        type: "number",
        default: "1",
        desc: "Pixel gap between cells.",
      },
    ],
    channels: [
      {
        name: "x / y",
        type: "band",
        desc: "The category axis. Bind one of them; the count runs along the other.",
      },
      {
        name: "count",
        type: "linear",
        desc: "The magnitude, in data units, on its own count axis — not on x or y. One cell is worth one unit of the field.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one cell node (<code className="inline">rect</code> or <code className="inline">circle</code>) per cell; every cell carries the datum, so the whole block is one drag/click target.
      </>
    ),
  },
];
