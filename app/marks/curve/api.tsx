import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "curve(options) · curveX · curveY",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A segment that <b>bends</b>. A <code className="inline">tick</code> draws a straight line between two points; a curve draws the same span bowed off its chord by an amount that is itself a channel — so &ldquo;how much does this bend, and which way&rdquo; becomes an elicited number. <code className="inline">curveY</code> spans x and sits on y; <code className="inline">curveX</code> spans y and sits on x; bare <code className="inline">curve</code> reads the declared channels.
      </>
    ),
    signatures: [
      "curveY({ channels, length, edits, constraints, id }) → Mark",
      "curveX({ … }) → Mark",
      "curve({ … }) → Mark",
    ],
    options: [
      {
        name: "channels",
        type: "Channels",
        default: "{}",
        desc: "The chord endpoints (x1/x2 or y1/y2), the position on the other axis, curvature, angle, plus the standard style channels.",
      },
      {
        name: "length",
        type: "number",
        default: "min(w,h)·0.25",
        desc: "Chord length in px, centred on the span axis' own channel. Used only when no endpoint pair is declared.",
      },
    ],
    channels: [
      {
        name: "curvature",
        type: "linear",
        desc: (
          <>
            How far the apex sits off the chord, as a fraction of the HALF-chord: 0 is a straight segment, ±1 bows out by half the span&rsquo;s length. Positive bows to the <b>left of travel</b> (a rightward chord bows up). It scales with the chord, so a glyph&rsquo;s curve stays proportional when the glyph resizes. Natural edit: <code className="inline">slide({'{'} axis: 'y' {'}'})</code>.
          </>
        ),
      },
      {
        name: "x1, x2 (curveY)",
        type: "linear | band | point",
        desc: "The chord's two ends. Without them the chord is `length` px centred on the `x` channel.",
      },
      {
        name: "y (curveY)",
        type: "linear",
        desc: "Where the chord sits. curveX swaps the two families: y1/y2 span, x positions.",
      },
      {
        name: "angle",
        type: "linear",
        desc: (
          <>
            Tilt about the chord midpoint, in math degrees. Baked into the geometry (neither renderer rotates a path node), so it works everywhere. Natural edit: <code className="inline">rotate({'{'} pivot: 'mark', pick: 'direct' {'}'})</code>.
          </>
        ),
      },
    ],
    returns: (
      <>
        A <b>mark</b> emitting two path nodes per datum: the visible curve, and a fat transparent <b>hit path</b> over it so a few-pixel stroke is actually grabbable. The hit path leaves <code className="inline">pointerEvents</code> unset, so an inert curve is silenced by the engine and can&rsquo;t swallow a neighbour&rsquo;s drag.
      </>
    ),
  },
];
