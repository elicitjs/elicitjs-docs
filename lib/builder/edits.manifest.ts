import type { ApiEntry, ApiOption } from '../types';
import { isFormOption } from './controlKind';

import { api as gesturesApi } from '../../app/editing/gestures/api';
import { api as existenceApi } from '../../app/editing/existence/api';
import { api as sweepApi } from '../../app/editing/sweep/api';
import { api as handlesApi } from '../../app/editing/handles/api';
import { api as probeApi } from '../../app/editing/probe/api';
import { api as selectionApi } from '../../app/editing/selection/api';
import { api as axisEditApi } from '../../app/editing/axis/api';
import { api as legendEditApi } from '../../app/editing/legend/api';

export type EditManifestEntry = {
  callPath: string;
  label: string;
  category: string;
  docHref: string;
  scope: 'line' | 'geo' | 'trend' | 'network' | 'stack' | 'waffle' | 'legend' | 'axis' | null;
  options: ApiOption[];
};

function entryByPrefix(api: ApiEntry[], prefix: string): ApiEntry | undefined {
  return api.find((e) => (e.name || '').startsWith(prefix));
}

function optionsOf(entry: ApiEntry | undefined): ApiOption[] {
  return (entry?.options || []).filter(isFormOption);
}

const COMMON_EDIT_OPTIONS: ApiOption[] = [
  { name: 'gesture', type: "'drag' | 'click' | 'dblclick'", default: "'drag'", desc: 'Triggering gesture.' },
  { name: 'pick', type: "'direct' | 'nearest' | 'plane' | 'probe' | 'sweep' | 'draw' | 'brush'", default: "'direct'", desc: 'Target pick strategy.' },
  { name: 'threshold', type: 'number', default: '0', desc: 'Proximity catchment radius in px.' },
  { name: 'stage', type: 'number', default: '—', desc: 'Stage index when this edit is active.' },
  { name: 'guide', type: 'boolean', default: 'false', desc: 'Self-draw constraint bounds and tracks.' },
];

export const ALL_EDITS: EditManifestEntry[] = [
  // Universal Gestural Edits
  {
    callPath: 'move',
    label: 'move() — Position drag',
    category: 'Universal Gestures',
    docHref: '/editing/gestures',
    scope: null,
    options: [
      ...COMMON_EDIT_OPTIONS,
      { name: 'mode', type: "'absolute' | 'relative'", default: "'absolute'", desc: 'Drag mode: absolute centers at cursor; relative preserves offset.' },
    ],
  },
  {
    callPath: 'resize',
    label: 'resize() — Magnitude drag',
    category: 'Universal Gestures',
    docHref: '/editing/gestures',
    scope: null,
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'slide',
    label: 'slide() — 1D axial drag',
    category: 'Universal Gestures',
    docHref: '/editing/gestures',
    scope: null,
    options: [
      { name: 'axis', type: "'x' | 'y'", default: "'y'", desc: 'Axis along which drag measures.' },
      { name: 'increase', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", desc: 'Direction of increasing values.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'rotate',
    label: 'rotate() — Radial angle drag',
    category: 'Universal Gestures',
    docHref: '/editing/gestures',
    scope: null,
    options: [
      { name: 'pivot', type: "'mark' | 'plot' | 'origin'", default: "'mark'", desc: 'Pivot point for angle calculation.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'cycle',
    label: 'cycle() — Step domain on click',
    category: 'Universal Gestures',
    docHref: '/editing/gestures',
    scope: null,
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'create',
    label: 'create() — Click to mint datum',
    category: 'Existence',
    docHref: '/editing/existence',
    scope: null,
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'remove',
    label: 'remove() — Click to delete datum',
    category: 'Existence',
    docHref: '/editing/existence',
    scope: null,
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'brushSpan',
    label: 'brushSpan() — Span resize/translate',
    category: 'Universal Gestures',
    docHref: '/editing/handles',
    scope: null,
    options: [
      { name: 'edgeInset', type: 'number', default: '8', desc: 'Margin at endpoints for resize grips.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'editText',
    label: 'editText() — Inline text editor',
    category: 'Universal Gestures',
    docHref: '/marks/text',
    scope: null,
    options: [
      { name: 'multiline', type: 'boolean', default: 'false', desc: 'Allow multiline textarea editing.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'edit.select',
    label: 'edit.select() — Click selection',
    category: 'Selection',
    docHref: '/editing/selection',
    scope: null,
    options: [
      { name: 'multi', type: 'boolean', default: 'false', desc: 'Enable shift-click multi-selection.' },
      { name: 'exclusive', type: 'boolean', default: 'true', desc: 'Deselect other rows on plain click.' },
    ],
  },

  // Line & Curve Scoped Edits
  {
    callPath: 'edit.line.draw',
    label: 'edit.line.draw() — Paint points as pointer crosses',
    category: 'Lines & Curves',
    docHref: '/editing/sweep',
    scope: 'line',
    options: [
      { name: 'samples', type: 'number', default: '10', desc: 'Number of sample points to generate.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'edit.line.sweep',
    label: 'edit.line.sweep() — You-draw-it continuous sweep',
    category: 'Lines & Curves',
    docHref: '/editing/sweep',
    scope: 'line',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.line.anchor',
    label: 'edit.line.anchor() — Click/drag vertex anchor',
    category: 'Lines & Curves',
    docHref: '/editing/existence',
    scope: 'line',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.line.newSeries',
    label: 'edit.line.newSeries() — Start new line stroke',
    category: 'Lines & Curves',
    docHref: '/editing/existence',
    scope: 'line',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Stack & Partition Edits
  {
    callPath: 'edit.stack.edge',
    label: 'edit.stack.edge() — Drag boundary seam',
    category: 'Stacks & Partitions',
    docHref: '/editing/handles',
    scope: 'stack',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.stack.cut',
    label: 'edit.stack.cut() — Split slice into two',
    category: 'Stacks & Partitions',
    docHref: '/editing/sweep',
    scope: 'stack',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Waffle Edits
  {
    callPath: 'edit.waffle.fill',
    label: 'edit.waffle.fill() — Click/drag count fill',
    category: 'Waffle',
    docHref: '/marks/waffle',
    scope: 'waffle',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Trend Edits
  {
    callPath: 'edit.trend.slope',
    label: 'edit.trend.slope() — Rotate trend slope',
    category: 'Models',
    docHref: '/marks/trend',
    scope: 'trend',
    options: [
      { name: 'anchor', type: 'number', default: '0', desc: 'Rotation pivot on the x axis.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'edit.trend.intercept',
    label: 'edit.trend.intercept() — Drag intercept',
    category: 'Models',
    docHref: '/marks/trend',
    scope: 'trend',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.trend.slopeSpread',
    label: 'edit.trend.slopeSpread() — Open confidence cone',
    category: 'Models',
    docHref: '/marks/trend',
    scope: 'trend',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Geo Edits
  {
    callPath: 'edit.geo.move',
    label: 'edit.geo.move() — Drag projected lon/lat',
    category: 'Geo',
    docHref: '/marks/geo',
    scope: 'geo',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.geo.create',
    label: 'edit.geo.create() — Click to place geo pin',
    category: 'Geo',
    docHref: '/marks/geo',
    scope: 'geo',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.geo.draw',
    label: 'edit.geo.draw() — Draw geo line / boundary',
    category: 'Geo',
    docHref: '/marks/geo',
    scope: 'geo',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Network Edits
  {
    callPath: 'edit.network.connect',
    label: 'edit.network.connect() — Drag node to node to link',
    category: 'Network',
    docHref: '/marks/network',
    scope: 'network',
    options: [
      { name: 'threshold', type: 'number', default: '28', desc: 'Docking radius in px.' },
      { name: 'selfLoops', type: 'boolean', default: 'false', desc: 'Allow self-connecting links.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'edit.network.rewire',
    label: 'edit.network.rewire() — Drag link endpoint',
    category: 'Network',
    docHref: '/marks/network',
    scope: 'network',
    options: [
      { name: 'threshold', type: 'number', default: '28', desc: 'Docking radius in px.' },
      ...COMMON_EDIT_OPTIONS,
    ],
  },
  {
    callPath: 'edit.network.reverse',
    label: 'edit.network.reverse() — Click link to reverse arrow',
    category: 'Network',
    docHref: '/marks/network',
    scope: 'network',
    options: [...COMMON_EDIT_OPTIONS],
  },

  // Legend & Axis Scale Edits
  {
    callPath: 'edit.legend.category',
    label: 'edit.legend.category() — Click swatch to assign',
    category: 'Chrome & Legend',
    docHref: '/editing/legend',
    scope: 'legend',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.legend.value',
    label: 'edit.legend.value() — Drag color ramp slider',
    category: 'Chrome & Legend',
    docHref: '/editing/legend',
    scope: 'legend',
    options: [...COMMON_EDIT_OPTIONS],
  },
  {
    callPath: 'edit.scale.categories',
    label: 'edit.scale.categories() — Add/rename/delete categories',
    category: 'Chrome & Legend',
    docHref: '/editing/axis',
    scope: 'axis',
    options: [
      { name: 'mode', type: "'inplace' | 'grow'", default: "'inplace'", desc: 'Resize chart or rescale bands.' },
    ],
  },
  {
    callPath: 'edit.axis.scale',
    label: 'edit.axis.scale() — Drag axis handles to rescale',
    category: 'Chrome & Legend',
    docHref: '/editing/axis',
    scope: 'axis',
    options: [
      { name: 'mode', type: "'inplace' | 'grow'", default: "'inplace'", desc: 'Resize chart or rescale domain.' },
    ],
  },
];

export const EDIT_CATEGORIES = Array.from(new Set(ALL_EDITS.map((e) => e.category)));

export function editByCallPath(callPath: string): EditManifestEntry {
  const found = ALL_EDITS.find((e) => e.callPath === callPath);
  if (!found) return ALL_EDITS[0];
  return found;
}
