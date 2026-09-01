import type { ApiOption } from '../types';

export type GuideManifestEntry = {
  type: 'rule' | 'region' | 'remaining' | 'proximity' | 'custom';
  label: string;
  docHref: string;
  options: ApiOption[];
};

export const GUIDES: GuideManifestEntry[] = [
  {
    type: 'rule',
    label: 'guides.rule() — Reference Line',
    docHref: '/guides',
    options: [
      { name: 'x', type: 'number', default: '—', desc: 'X position in data units (vertical rule).' },
      { name: 'y', type: 'number', default: '—', desc: 'Y position in data units (horizontal rule).' },
      { name: 'label', type: 'string', default: '—', desc: 'Reference label text (e.g. "Target", "Mean").' },
      { name: 'stroke', type: 'string', default: "'#64748b'", desc: 'Line colour.' },
      { name: 'strokeDasharray', type: 'string', default: "'5 4'", desc: 'Dash pattern.' },
    ],
  },
  {
    type: 'region',
    label: 'guides.region() — Shaded Band',
    docHref: '/guides',
    options: [
      { name: 'x', type: 'string', default: '—', desc: 'X interval [min, max] comma-separated.' },
      { name: 'y', type: 'string', default: '—', desc: 'Y interval [min, max] comma-separated.' },
      { name: 'fill', type: 'string', default: "'#64748b'", desc: 'Band fill colour.' },
      { name: 'opacity', type: 'number', default: '0.1', desc: 'Band opacity.' },
    ],
  },
  {
    type: 'remaining',
    label: 'guides.remaining() — Remaining Budget Counter',
    docHref: '/guides',
    options: [
      { name: 'field', type: 'string', default: "'y'", desc: 'Data field being summed/allocated.' },
      { name: 'total', type: 'number', default: '100', desc: 'Target budget/sum total.' },
      { name: 'unit', type: 'string', default: "'tokens'", desc: 'Unit label phrase (e.g. "%", "pts", "tokens").' },
      { name: 'anchor', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", desc: 'Corner to dock badge.' },
    ],
  },
  {
    type: 'proximity',
    label: 'guides.proximity() — Pick Catchment Ring',
    docHref: '/guides',
    options: [
      { name: 'color', type: 'string', default: "'#3b82f6'", desc: 'Highlight outline colour.' },
    ],
  },
  {
    type: 'custom',
    label: 'guides.custom() — Custom Function',
    docHref: '/guides',
    options: [
      { name: 'code', type: 'string', default: '({ data, width, height }) => []', desc: 'Custom guide builder function.' },
    ],
  },
];

export function guideByType(type: GuideManifestEntry['type']): GuideManifestEntry {
  const found = GUIDES.find((g) => g.type === type);
  if (!found) return GUIDES[0];
  return found;
}
