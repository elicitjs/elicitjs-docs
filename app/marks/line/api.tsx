import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "line · lineY · lineX · path · path",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One non-interactive connector path per series, drawn under one draggable <code className="inline">circle</code> handle per datum. <code className="inline">lineY</code>/<code className="inline">lineX</code> pin the value axis; <code className="inline">path</code> defaults to <code className="inline">connect: "sequence"</code>.
      </>
    ),
    signatures: [
      "line({ channels, orientation, curve, connect, handles, handleSize, handleColor, edits, id }) → Feature",
      "lineY(options) → Feature   // value on y (time series)",
      "path(options) → Feature   // connect: \"sequence\"",
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
        name: "orientation",
        type: "'vertical' | 'horizontal'",
        default: "auto",
        desc: (
          <>
            Which axis the value runs along (<code className="inline">'vertical'</code> = y). Inferred from a band scale or the lone bound channel; <code className="inline">lineY / lineX</code> pin it.
          </>
        ),
      },
      {
        name: "channels.series",
        type: "channel",
        default: "auto",
        desc: (
          <>
            The column grouping points into lines. A <b>channel</b>, because it names a column. Defaults to <code className="inline">fill</code>&rsquo;s field (then <code className="inline">stroke</code>&rsquo;s), so a coloured chart auto-groups.
          </>
        ),
      },
      {
        name: "channels.order",
        type: "channel",
        default: "—",
        desc: (
          <>
            The column each series is sorted by. Also a channel — a route&rsquo;s <code className="inline">stop</code> number orders the line and encodes nothing, so there is no other channel to point at.
          </>
        ),
      },
      {
        name: "connect",
        type: "'domain' | 'sequence'",
        default: "'domain'",
        desc: "How points connect when no order channel is given: sorted by the domain axis, or as drawn. The mode only — it names no column.",
      },
      {
        name: "curve",
        type: "string",
        default: "'linear'",
        desc: (
          <>
            Interpolation between handles (e.g. <code className="inline">"catmullRom"</code>, <code className="inline">"step"</code>).
          </>
        ),
      },
      {
        name: "handles",
        type: "boolean",
        default: "true",
        desc: "Show the per-datum handles. When false they stay (for hit-testing) but render invisible.",
      },
      {
        name: "handleSize",
        type: "number",
        default: "4",
        desc: "Pixel radius of each handle.",
      },
      {
        name: "edits, id",
        type: "—",
        default: "—",
        desc: (
          <>
            As on every mark. Line authoring edits live under <code className="inline">edit.line.*</code>.
          </>
        ),
      },
    ],
    channels: [
      {
        name: "x",
        type: "linear | band | time",
        desc: "Domain or value axis (per variant / inference).",
      },
      {
        name: "y",
        type: "linear | band | time",
        desc: "The other axis; the value axis carries the handle edit.",
      },
      {
        name: "stroke / color",
        type: "const | field",
        desc: (
          <>
            Line colour; a field here also becomes the default <code className="inline">series</code> grouping.
          </>
        ),
      },
      {
        name: "strokeWidth, opacity",
        type: "const | field",
        desc: "Standard style surface for the connector + handles.",
      },
    ],
    returns: (
      <>
        A <b>feature</b> with <code className="inline">supportsSeries: true</code>. Emits one <code className="inline">path</code> per series (<code className="inline">pointerEvents:"none"</code>) plus one indexed <code className="inline">circle</code> handle per datum, each tagged with its <code className="inline">series</code>.
      </>
    ),
  },
];
