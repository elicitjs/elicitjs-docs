import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: 'handles',
    summary:
      'The universal handle contract for continuous geometry (line, area, curve, arc, span).',
    options: [
      {
        name: 'handles',
        type: 'boolean | "hit"',
        default: 'true',
        desc: 'true draws visible circular grips. "hit" keeps the enlarged grab target active without rendering circles. false disables handles and interaction.',
      },
      {
        name: 'handleSize',
        type: 'number',
        default: '6',
        desc: 'Radius (in pixels) of the visible grip and pointer hitbox.',
      },
      {
        name: 'handleColor',
        type: 'string',
        default: '"#2563eb"',
        desc: 'Grip colour or accent stroke.',
      },
      {
        name: 'handleFill',
        type: 'string',
        default: '"#ffffff"',
        desc: 'Interior fill colour for circular grips.',
      },
    ],
  },
  {
    name: 'edit.stack.edge()',
    summary: 'Redistribute adjacent shares by dragging interior slice or bar boundaries.',
    signature: 'edit.stack.edge(options?)',
    options: [
      {
        name: 'guide',
        type: 'boolean',
        default: 'true',
        desc: 'Draw active highlight indicators when hovering or dragging a boundary seam.',
      },
      {
        name: 'threshold',
        type: 'number',
        default: '12',
        desc: 'Proximity distance in pixels to snap to a boundary handle.',
      },
    ],
  },
  {
    name: 'brushSpan()',
    summary: 'Two-endpoint span manipulation for interval bars and bands.',
    signature: 'brushSpan(options)',
    options: [
      {
        name: 'channels',
        type: '[string, string]',
        desc: 'Pair of span channels to govern (e.g. ["x1", "x2"] or ["y1", "y2"]).',
      },
      {
        name: 'edgeInset',
        type: 'number',
        default: '10',
        desc: 'Pixel catchment width at each end that resizes that edge instead of moving the whole bar.',
      },
      {
        name: 'guide',
        type: 'boolean',
        default: 'true',
        desc: 'Draw edge resize cursors and body move indicators.',
      },
    ],
  },
];
