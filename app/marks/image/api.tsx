import type { ApiEntry } from '../../../lib/types';

const settings = [
  {
    name: "fit",
    type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'",
    default: "'cover' on image · 'contain' on src",
    desc: "How the picture is sized in its box, as CSS object-fit.",
  },
  {
    name: "position",
    type: "string",
    default: "'center'",
    desc: "Where the picture sits in its box, as CSS object-position: keywords ('top', 'bottom left') and percentages ('25% 75%').",
  },
];

export const api: ApiEntry[] = [
  {
    name: "image(options)",
    json: ['plot.image'],
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One picture per row, like an <code className="inline">{'<img>'}</code>, centred at <code className="inline">x</code>, <code className="inline">y</code> in a square of side <code className="inline">2 * size</code>.
      </>
    ),
    signatures: [
      "image({ src, channels, edits, id }) → Mark",
      "image({ channels: { x, y, src: { field: \"photo\", fit: \"cover\", position: \"top\" } } })",
    ],
    options: [
      {
        name: "channels",
        type: "Channels",
        default: "{}",
        desc: "x, y, src, size, angle plus the standard style channels.",
      },
      {
        name: "src",
        type: "string | (d) => string",
        default: "—",
        desc: "The picture's URL for every row. Shorthand for channels.src = { value }.",
      },
      {
        name: "size",
        type: "number | ChannelSpec",
        default: "16",
        desc: "Half the square's side, in px.",
      },
      {
        name: "stroke, opacity, …",
        type: "style",
        default: "—",
        desc: "A stroke outlines the square; opacity fades the picture.",
      },
    ],
    channels: [
      { name: "x, y", type: "linear | band | point", desc: "The centre. A missing channel parks it at the centre of that dimension." },
      { name: "src", type: "raw", desc: "The picture's URL: a column of URLs ({ field }), one URL ({ value }) or a function of the row ({ fn }). Read as-is, never scaled. Takes fit (default 'contain') and position as params." },
      { name: "angle", type: "linear", desc: "Rotation in math degrees about the centre." },
    ],
    returns: <>A <b>mark</b> emitting one picture per row that has a URL.</>,
  },
  {
    name: "image channel (on marks)",
    json: ['mark'],
    summary: (
      <>
        A shape's background image. <code className="inline">bar</code>, <code className="inline">rect</code>, <code className="inline">area</code>, <code className="inline">point</code>, <code className="inline">ellipse</code>, <code className="inline">shape</code>, <code className="inline">waffle</code> and <code className="inline">dotStack</code> paint it inside each shape in place of the fill. Its settings are params of the channel.
      </>
    ),
    signatures: [
      "barY({ image: \"photo.jpg\", channels })",
      "barY({ channels: { x, y, image: { value: \"icon.svg\", fit: \"contain\", position: \"bottom\", repeat: \"repeat-y\" } } })",
    ],
    options: [
      {
        name: "image",
        type: "string | (d) => string",
        default: "—",
        desc: "The picture's URL. Shorthand for channels.image = { value }.",
      },
      ...settings,
      {
        name: "repeat",
        type: "'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'",
        default: "'no-repeat'",
        desc: "Whether the picture repeats from where position puts it, as CSS background-repeat.",
      },
    ],
  },
];
