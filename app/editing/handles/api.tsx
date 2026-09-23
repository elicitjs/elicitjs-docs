import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: 'handles',
    summary: (
      <>
        The universal handle contract for continuous geometry — <a href="/marks/line">line</a>, <a href="/marks/area">area</a>, <a href="/marks/curve">curve</a>, <a href="/marks/arc">arc</a>, <a href="/marks/trend">trend</a>, <a href="/marks/needle">needle</a>, and a span. Every mark that draws a grip spells these the same way.
      </>
    ),
    options: [
      {
        name: 'handles',
        type: 'boolean | "hit"',
        default: 'true',
        desc: '"hit" keeps the enlarged grab target without drawing a circle. false is neither drawn nor grabbable.',
      },
      {
        name: 'handleSize',
        type: 'number',
        default: '5',
        desc: 'Radius in px of the grip and its pointer hitbox.',
      },
      {
        name: 'handleColor',
        type: 'string',
        default: "theme.handle",
        desc: "Grip fill. Falls back to the mark's own ink when the theme names none, so a recoloured mark keeps a matching grip.",
      },
    ],
    returns: (
      <>
        A grip is drawn only where an edit can use it. A mark with no edit on the channel draws none, whatever <code className="inline">handles</code> says.
      </>
    ),
  },
  {
    name: 'moveSpan(options)',
    summary: 'Translate a two-endpoint span — both endpoints move together, so its width is preserved.',
    signature: 'moveSpan({ channels, when, stage }) → Edit',
    options: [
      {
        name: 'channels',
        type: '[string, string]',
        default: 'injected',
        desc: 'The span pair to govern, e.g. ["x1", "x2"] or ["y1", "y2"].',
      },
    ],
  },
  {
    name: 'brushSpan(options)',
    summary: (
      <>
        The Gantt-bar interaction. Grabbing near one endpoint resizes that edge alone; grabbing the body translates both. The zone is resolved once, at the start of the drag.
      </>
    ),
    signature: 'brushSpan({ channels, edgeInset, guide, when }) → Edit',
    options: [
      {
        name: 'channels',
        type: '[string, string]',
        default: 'injected',
        desc: 'The span pair to govern, e.g. ["x1", "x2"] or ["y1", "y2"].',
      },
      {
        name: 'edgeInset',
        type: 'number',
        default: '8',
        desc: 'Catchment width in px at each end: inside it the gesture resizes that edge, outside it moves the whole span.',
      },
      {
        name: 'pick',
        type: '—',
        default: "'brush'",
        desc: 'Fixed. brushSpan reads a zone only the brush driver sets, so it cannot be repointed at another pick.',
      },
    ],
    returns: (
      <>
        An <b>Edit</b>. Dragging one edge past the other is allowed mid-gesture; the pair is put back in order once, when you let go.
      </>
    ),
  },
  {
    name: 'brushRect(options)',
    summary: "The 2-D counterpart: edges, corners and body of a rect, each live or not as you choose.",
    signature: 'brushRect({ resize, move, edgeInset, when }) → Edit',
    options: [
      {
        name: 'resize',
        type: "'both' | 'x' | 'y' | 'none'",
        default: "'both'",
        desc: "Which axes' edges and corners are live. 'none' leaves a pure 2-D move.",
      },
      {
        name: 'move',
        type: 'boolean',
        default: 'true',
        desc: 'Whether a body drag translates the whole rect. false leaves a resize-only brush.',
      },
      {
        name: 'edgeInset',
        type: 'number',
        default: '8',
        desc: 'Catchment width in px along each edge.',
      },
      {
        name: 'channels',
        type: 'string[]',
        default: "['x1','x2','y1','y2']",
        desc: 'The two endpoint pairs it governs.',
      },
    ],
    returns: (
      <>
        An <b>Edit</b>. A disabled zone degrades to the body, so <code className="inline">resize: 'x'</code> behaves like a per-axis <code className="inline">brushSpan</code>.
      </>
    ),
  },
  {
    name: 'edit.stack.edge(options)',
    summary: 'Drag an interior boundary to move value between the two segments it separates. The group total is preserved by construction.',
    signature: 'edit.stack.edge(options?) → Edit',
    options: [
      {
        name: 'guide',
        type: 'boolean',
        default: '—',
        desc: 'Highlight the boundary under the pointer.',
      },
      {
        name: 'threshold',
        type: 'number',
        default: '0',
        desc: 'Proximity radius in px for grabbing a boundary away from the seam itself.',
      },
    ],
  },
];
