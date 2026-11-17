import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: 'bar(options) · barY(options) · barX(options)',
    json: ['plot.bar', 'plot.barY', 'plot.barX'],
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>.{' '}
        <code className="inline">bar</code> infers orientation from which axis is a
        band; <code className="inline">barY</code> forces vertical,{' '}
        <code className="inline">barX</code> horizontal. All three share these
        options.
      </>
    ),
    signatures: [
      'bar({ channels, orientation, edits, id }) → Feature',
      'barY(options) → Feature   // orientation: "vertical"',
      'barX(options) → Feature   // orientation: "horizontal"',
    ],
    options: [
      {
        name: 'channels',
        type: 'object',
        default: '{}',
        desc: (
          <>
            Channel map — one band axis (category) and one linear axis (value or a
            span). See <b>Channels</b>.
          </>
        ),
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: 'auto',
        desc: <>Override the inferred direction (bar only; barY/barX pin it).</>,
      },
      {
        name: 'handles / handleSize / handleColor',
        type: "boolean | 'hit' / number / string",
        default: 'true / 5 / theme',
        desc: (
          <>
            Boundary dots on a stacked bar, drawn once a{' '}
            <code className="inline">edit.stack.*</code> edit is wired.{' '}
            <code className="inline">'hit'</code> keeps them grabbable but invisible.
          </>
        ),
      },
      {
        name: 'gradient',
        type: '{ stops, direction }',
        default: '—',
        desc: (
          <>
            A linear-gradient fill over each bar&rsquo;s own box, in place of a flat{' '}
            <code className="inline">fill</code>. <code className="inline">stops</code> is a
            list of <code className="inline">[offset, colour]</code> with offsets 0–1;{' '}
            <code className="inline">direction</code> is <code className="inline">'vertical'</code>{' '}
            (default, bottom to top) or <code className="inline">'horizontal'</code> (left to
            right).
          </>
        ),
      },
      {
        name: 'edits',
        type: 'Edit[]',
        default: '—',
        desc: (
          <>
            Mark-level edits; per-channel edits live in{' '}
            <code className="inline">channels[ch].edit</code>. A stacked bar also takes{' '}
            <code className="inline">edit.stack.cut()</code>,{' '}
            <code className="inline">edit.stack.edge()</code> and{' '}
            <code className="inline">edit.stack.merge()</code>.
          </>
        ),
      },
      {
        name: 'fill, stroke, …',
        type: 'style',
        default: "fill: 'steelblue'",
        desc: <>Style shorthands / channels (see the style surface on any mark).</>,
      },
    ],
    channels: [
      {
        name: 'x',
        type: 'band | linear',
        desc: <>Category (band) or value (linear), depending on orientation.</>,
      },
      {
        name: 'y',
        type: 'band | linear',
        desc: (
          <>
            The other axis. The value axis carries{' '}
            <code className="inline">edit: move()</code> to make bars draggable.
          </>
        ),
      },
      {
        name: 'y1 / y2',
        type: 'linear',
        desc: (
          <>
            Explicit vertical span (barY) — draw between two values instead of from
            the baseline.
          </>
        ),
      },
      {
        name: 'x1 / x2',
        type: 'linear',
        desc: <>Explicit horizontal span (barX) — a Gantt-style range per category.</>,
      },
      {
        name: 'xOffset / yOffset',
        type: 'band',
        desc: (
          <>
            A second category nested inside each <code className="inline">x</code> (or{' '}
            <code className="inline">y</code>) category: one sub-band per value, for
            grouped bars.
          </>
        ),
      },
      {
        name: 'stack',
        type: 'categorical | ordinal field',
        desc: (
          <>
            Stack the bars that share a band. The field names each segment and sets
            their order (its schema domain, else first appearance).{' '}
            <code className="inline">edit.stack.cut()</code> writes a new segment&rsquo;s
            category into it. Declare a schema domain covering the stacked total.
          </>
        ),
      },
      {
        name: 'fill, stroke, strokeWidth, opacity',
        type: 'const | field',
        desc: <>Standard style surface; a field tints through the ordinal palette.</>,
      },
    ],
    returns: (
      <>
        A <b>feature</b> emitting one <code className="inline">rect</code> per datum,
        styled through the standard surface.
      </>
    ),
  },
];
