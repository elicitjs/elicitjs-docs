import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "area(options) · areaY(options) · areaX(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One filled path per series, with an optional draggable handle per datum. <code className="inline">areaY</code> fills to the y baseline, <code className="inline">areaX</code> to the x baseline; bare <code className="inline">area</code> infers the value axis.
      </>
    ),
    signatures: [
      "area({ channels, orientation, curve, connect, handles, handleSize, handleColor, edits, id }) → Feature",
      "areaY(options) → Feature   // value on y",
      "areaX(options) → Feature   // value on x",
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
            Which axis the value runs along (<code className="inline">'vertical'</code> = y). Inferred from a band scale, an endpoint pair, or the lone bound channel; <code className="inline">areaY / areaX</code> pin it.
          </>
        ),
      },
      {
        name: "channels.series",
        type: "channel",
        default: "auto",
        desc: (
          <>
            The column grouping points into separate areas. Defaults to <code className="inline">fill</code>&rsquo;s field, then <code className="inline">stroke</code>&rsquo;s.
          </>
        ),
      },
      {
        name: "channels.order",
        type: "channel",
        default: "—",
        desc: "The column each series is sorted by, when array order and the domain axis are both wrong.",
      },
      {
        name: "connect",
        type: "'domain' | 'sequence'",
        default: "'domain'",
        desc: "How points join when no order channel is given: sorted by the domain axis, or as drawn.",
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
        type: "boolean | 'hit'",
        default: "true",
        desc: (
          <>
            <code className="inline">true</code> draws a grabbable circle per datum. <code className="inline">'hit'</code> keeps the grab target but draws nothing. <code className="inline">false</code> is neither drawn nor grabbable.
          </>
        ),
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Pixel radius of each handle.",
      },
      {
        name: "handleColor",
        type: "string",
        default: "theme",
        desc: (
          <>
            Handle fill. Defaults to the theme&rsquo;s <code className="inline">handle</code> colour.
          </>
        ),
      },
      {
        name: "edits, id",
        type: "—",
        default: "—",
        desc: (
          <>
            As on every mark. Area authoring edits live under <code className="inline">edit.line.*</code>, which it shares with <code className="inline">line</code>.
          </>
        ),
      },
    ],
    channels: [
      {
        name: "x / y",
        type: "linear | point | time",
        desc: "Domain and value axes (same as line).",
      },
      {
        name: "y1 / y2 · x1 / x2",
        type: "linear",
        desc: (
          <>
            An endpoint <b>pair</b> on the value axis: fill between the two fields instead of down to the baseline (a confidence band, a fan chart). They share the value axis&rsquo;s scale, so they resolve exactly like <code className="inline">y</code>, and declaring a pair picks the value axis on its own. Handles appear on <b>both</b> edges. Same span/baseline split <code className="inline">bar</code> and <code className="inline">rect</code> make, spelled the same way.
          </>
        ),
      },
      {
        name: "fill / stroke",
        type: "const | field",
        desc: "Area fill (default fillOpacity 0.35) and outline. A field here also becomes the default series grouping.",
      },
    ],
    returns: "A feature emitting one filled path per series plus optional handle circles.",
  },
];
