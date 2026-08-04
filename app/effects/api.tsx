import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "effects (on Elicit)",
    summary: (
      <>
        The interaction-<b>state</b> feedback layer, passed as <code className="inline">effects</code> on <code className="inline">Elicit</code>. Keyed by state; partial sub-objects merge over the defaults, so you override just the part you care about. Rules (constraint bounds, a pick&rsquo;s reach, a handle&rsquo;s track) are not effects &mdash; they live on the edit&rsquo;s <code className="inline">guide</code>.
      </>
    ),
    signatures: [
      "effects: { hovered, selected, grabbed }",
    ],
    options: [
      {
        name: "hovered",
        type: "false | object",
        default: "outline",
        desc: (
          <>
            The pointer is over this mark, <em>or</em> a proximity pick resolved it. Both routes draw the same thing. <code className="inline">false</code> disables it.
          </>
        ),
      },
      {
        name: "selected",
        type: "false | object",
        default: "outline",
        desc: "The mark is in the chart's selection (edit.select / el.select). Outranks hovered.",
      },
      {
        name: "grabbed",
        type: "false | string | object",
        default: "brightness(0.82)",
        desc: (
          <>
            A drag on this mark is in flight. A string is shorthand for <code className="inline">{'{'} filter {'}'}</code>.
          </>
        ),
      },
      {
        name: "<state>.filter",
        type: "string",
        default: "—",
        desc: "A CSS filter on the mark's own element — the one effect that survives a mid-drag re-render untouched.",
      },
      {
        name: "<state>.opacity · fill · stroke · strokeWidth · cursor",
        type: "any",
        default: "—",
        desc: "Element effects, applied as CSS properties so they override the mark's paint while set and are removed cleanly on exit.",
      },
      {
        name: "<state>.outline",
        type: "false | { color, width, pad, dash, opacity }",
        default: "accent",
        desc: "An outline overlay traced around the mark, above every other layer. Handles every node type — circle, rect, line, path and text.",
      },
    ],
    returns: (
      <>
        Effects draw either as CSS <em>properties</em> on the element or as overlay nodes &mdash; never as the <code className="inline">fill</code>/<code className="inline">stroke</code> attributes a mark&rsquo;s channels write &mdash; so they can&rsquo;t clobber data-driven style.
      </>
    ),
  },
];
