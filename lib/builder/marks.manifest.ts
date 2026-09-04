import type { ApiEntry } from '../types';
import type { MarkFamilyId } from './types';

import { api as barApi } from '../../app/marks/bar/api';
import { api as rectApi } from '../../app/marks/rect/api';
import { api as areaApi } from '../../app/marks/area/api';
import { api as tickApi } from '../../app/marks/tick/api';
import { api as pointApi } from '../../app/marks/point/api';
import { api as lineApi } from '../../app/marks/line/api';
import { api as textApi } from '../../app/marks/text/api';
import { api as dotstackApi } from '../../app/marks/dotstack/api';
import { api as waffleApi } from '../../app/marks/waffle/api';
import { api as arcApi } from '../../app/marks/arc/api';
import { api as needleApi } from '../../app/marks/needle/api';
import { api as axisRadialApi } from '../../app/marks/axis-radial/api';
import { api as trendApi } from '../../app/marks/trend/api';
import { api as legendApi } from '../../app/marks/legend/api';
import { api as axesApi } from '../../app/marks/axes/api';
import { api as compositeApi } from '../../app/marks/composite/api';
import { api as faceApi } from '../../app/marks/face/api';
import { api as ellipseApi } from '../../app/marks/ellipse/api';
import { api as curveApi } from '../../app/marks/curve/api';
import { api as symbolApi } from '../../app/marks/symbol/api';
import { api as geoApi } from '../../app/marks/geo/api';
import { api as networkApi } from '../../app/marks/network/api';
import { api as stickerApi } from '../../app/marks/sticker/api';

export type MarkManifestEntry = {
  family: MarkFamilyId;
  label: string;
  category: string;
  docHref: string;
  api: ApiEntry[];
  factoryNames: { auto: string; x?: string; y?: string };
  buildable: boolean;
  channels: string[];
  supportsSeries?: boolean;
  defaultStyle?: Record<string, any>;
  defaultOptions?: Record<string, any>;
};

export const MARKS: MarkManifestEntry[] = [
  // 1. Bars & Rects
  {
    family: 'bar',
    label: 'Bar',
    category: 'Bars & rects',
    docHref: '/marks/bar',
    api: barApi,
    factoryNames: { auto: 'bar', x: 'barX', y: 'barY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultStyle: { fill: 'steelblue' },
  },
  {
    family: 'rect',
    label: 'Rect / Span',
    category: 'Bars & rects',
    docHref: '/marks/rect',
    api: rectApi,
    factoryNames: { auto: 'rect', x: 'rectX', y: 'rectY' },
    buildable: true,
    channels: ['x', 'y', 'x1', 'x2', 'y1', 'y2'],
    defaultStyle: { fill: 'steelblue' },
  },
  {
    family: 'waffle',
    label: 'Waffle grid',
    category: 'Bars & rects',
    docHref: '/marks/waffle',
    api: waffleApi,
    factoryNames: { auto: 'waffle', x: 'waffleX', y: 'waffleY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultOptions: { unit: 1, shape: 'rect', showEmpty: true },
    defaultStyle: { fill: 'steelblue' },
  },
  {
    family: 'dotStack',
    label: 'Stacked dots',
    category: 'Bars & rects',
    docHref: '/marks/dotstack',
    api: dotstackApi,
    factoryNames: { auto: 'dotStack', x: 'dotStackX', y: 'dotStackY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultStyle: { fill: 'steelblue', size: 6 },
  },

  // 2. Lines & Areas
  {
    family: 'line',
    label: 'Line / Path',
    category: 'Lines & areas',
    docHref: '/marks/line',
    api: lineApi,
    factoryNames: { auto: 'line', x: 'lineX', y: 'lineY' },
    buildable: true,
    channels: ['x', 'y'],
    supportsSeries: true,
    defaultStyle: { stroke: 'steelblue', strokeWidth: 2.5 },
  },
  {
    family: 'area',
    label: 'Area band',
    category: 'Lines & areas',
    docHref: '/marks/area',
    api: areaApi,
    factoryNames: { auto: 'area', x: 'areaX', y: 'areaY' },
    buildable: true,
    channels: ['x', 'y', 'y1', 'y2'],
    supportsSeries: true,
    defaultStyle: { fill: 'steelblue', opacity: 0.35 },
  },
  {
    family: 'curve',
    label: 'Parametric curve',
    category: 'Lines & areas',
    docHref: '/marks/curve',
    api: curveApi,
    factoryNames: { auto: 'curveY', x: 'curveX', y: 'curveY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultStyle: { stroke: 'steelblue', strokeWidth: 2 },
  },

  // 3. Points & Ticks
  {
    family: 'point',
    label: 'Point / Scatter',
    category: 'Points & ticks',
    docHref: '/marks/point',
    api: pointApi,
    factoryNames: { auto: 'point' },
    buildable: true,
    channels: ['x', 'y', 'size', 'fill'],
    defaultStyle: { fill: 'steelblue', size: 7 },
  },
  {
    family: 'tick',
    label: 'Tick mark',
    category: 'Points & ticks',
    docHref: '/marks/tick',
    api: tickApi,
    factoryNames: { auto: 'tick', x: 'tickX', y: 'tickY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultStyle: { stroke: 'steelblue', strokeWidth: 2 },
  },
  {
    family: 'rule',
    label: 'Reference rule',
    category: 'Points & ticks',
    docHref: '/marks/axes',
    api: axesApi,
    factoryNames: { auto: 'rule', x: 'ruleX', y: 'ruleY' },
    buildable: true,
    channels: ['x', 'y'],
    defaultStyle: { stroke: '#94a3b8', strokeWidth: 1.5 },
  },
  {
    family: 'symbol',
    label: 'Symbol & emoji',
    category: 'Points & ticks',
    docHref: '/marks/symbol',
    api: symbolApi,
    factoryNames: { auto: 'point' },
    buildable: true,
    channels: ['x', 'y', 'symbol', 'size'],
    defaultStyle: { size: 10 },
  },

  // 4. Text & Annotations
  {
    family: 'text',
    label: 'Text label',
    category: 'Text & notes',
    docHref: '/marks/text',
    api: textApi,
    factoryNames: { auto: 'text', x: 'textX', y: 'textY' },
    buildable: true,
    channels: ['x', 'y', 'text'],
    defaultStyle: { fill: '#1e293b', fontSize: 12 },
  },
  {
    family: 'sticker',
    label: 'Sticker note',
    category: 'Text & notes',
    docHref: '/marks/sticker',
    api: stickerApi,
    factoryNames: { auto: 'sticker' },
    buildable: true,
    channels: ['x', 'y', 'text'],
    defaultOptions: { padding: 8, radius: 6 },
    defaultStyle: { fill: '#fef08a', stroke: '#eab308' },
  },

  // 5. Polar & Gauges
  {
    family: 'arc',
    label: 'Arc · Donut',
    category: 'Polar & gauges',
    docHref: '/marks/arc',
    api: arcApi,
    factoryNames: { auto: 'arc' },
    buildable: true,
    channels: ['value', 'fill', 'x', 'y'],
    defaultOptions: { innerRadius: 0.55, padAngle: 1 },
  },
  {
    family: 'needle',
    label: 'Needle dial',
    category: 'Polar & gauges',
    docHref: '/marks/needle',
    api: needleApi,
    factoryNames: { auto: 'needle' },
    buildable: true,
    channels: ['angle', 'x', 'y'],
    defaultOptions: { orient: 'top', arc: 'semi' },
    defaultStyle: { fill: '#dc2626' },
  },
  {
    family: 'axisRadial',
    label: 'Radial axis',
    category: 'Polar & gauges',
    docHref: '/marks/axis-radial',
    api: axisRadialApi,
    factoryNames: { auto: 'axisRadial' },
    buildable: true,
    channels: ['angle', 'radius'],
  },

  // 6. Parametric Models & Uncertainty
  {
    family: 'trend',
    label: 'Trend line (slope/intercept)',
    category: 'Models & uncertainty',
    docHref: '/marks/trend',
    api: trendApi,
    factoryNames: { auto: 'trend' },
    buildable: true,
    channels: ['x', 'y', 'intercept', 'slope'],
    defaultStyle: { stroke: '#2563eb', strokeWidth: 2.5 },
  },
  {
    family: 'trendBand',
    label: 'Trend confidence fan',
    category: 'Models & uncertainty',
    docHref: '/marks/trend',
    api: trendApi,
    factoryNames: { auto: 'trendBand' },
    buildable: true,
    channels: ['x', 'y', 'intercept', 'slope', 'interceptSpread', 'slopeSpread'],
    defaultOptions: { render: 'gradient', levels: 4, distribution: 'normal' },
    defaultStyle: { fill: '#3b82f6', opacity: 0.2 },
  },
  {
    family: 'ellipse',
    label: 'Confidence ellipse',
    category: 'Models & uncertainty',
    docHref: '/marks/ellipse',
    api: ellipseApi,
    factoryNames: { auto: 'ellipse' },
    buildable: true,
    channels: ['x', 'y', 'rx', 'ry', 'angle'],
    defaultStyle: { fill: 'steelblue', opacity: 0.3 },
  },

  // 7. Composites & Glyphs
  {
    family: 'face',
    label: 'Chernoff face',
    category: 'Composites & glyphs',
    docHref: '/marks/face',
    api: faceApi,
    factoryNames: { auto: 'face' },
    buildable: true,
    channels: ['mouthCurve', 'eyeScale', 'browTilt', 'browHeight', 'x', 'y'],
    defaultOptions: { size: 60, ink: '#1f2937' },
  },
  {
    family: 'node',
    label: 'Network node',
    category: 'Composites & glyphs',
    docHref: '/marks/network',
    api: networkApi,
    factoryNames: { auto: 'node' },
    buildable: true,
    channels: ['x', 'y', 'text', 'fill', 'size'],
    defaultStyle: { fill: 'steelblue', size: 12 },
  },
  {
    family: 'link',
    label: 'Network link',
    category: 'Composites & glyphs',
    docHref: '/marks/network',
    api: networkApi,
    factoryNames: { auto: 'link' },
    buildable: true,
    channels: ['source', 'target', 'stroke', 'strokeWidth'],
    defaultOptions: { curve: 'arc', arrow: 'target' },
    defaultStyle: { stroke: '#94a3b8', strokeWidth: 2 },
  },
  {
    family: 'composite',
    label: 'Composite container',
    category: 'Composites & glyphs',
    docHref: '/marks/composite',
    api: compositeApi,
    factoryNames: { auto: 'composite' },
    buildable: true,
    channels: ['x', 'y'],
  },

  // 8. Geo & Spatial
  {
    family: 'geoBasemap',
    label: 'Geo basemap',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoBasemap' },
    buildable: true,
    channels: [],
    defaultOptions: { fill: '#f1f5f9', stroke: '#cbd5e1', strokeWidth: 1 },
  },
  {
    family: 'geoTile',
    label: 'Geo tile layer (OSM)',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoTile' },
    buildable: true,
    channels: [],
    defaultOptions: { opacity: 0.85 },
  },
  {
    family: 'geoPoint',
    label: 'Geo point pin',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoPoint' },
    buildable: true,
    channels: ['lon', 'lat', 'size', 'fill'],
    defaultStyle: { fill: '#ef4444', size: 7 },
  },
  {
    family: 'geoLine',
    label: 'Geo line path',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoLine' },
    buildable: true,
    channels: ['lon', 'lat'],
    defaultStyle: { stroke: '#dc2626', strokeWidth: 2 },
  },
  {
    family: 'geoPolygon',
    label: 'Geo polygon area',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoPolygon' },
    buildable: true,
    channels: ['geometry', 'fill'],
    defaultStyle: { fill: 'steelblue', opacity: 0.4 },
  },
  {
    family: 'geoRect',
    label: 'Geo bounding rect',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoRect' },
    buildable: true,
    channels: ['west', 'south', 'east', 'north'],
    defaultStyle: { fill: 'steelblue', opacity: 0.2, stroke: 'steelblue' },
  },
  {
    family: 'geoText',
    label: 'Geo text label',
    category: 'Geo & spatial',
    docHref: '/marks/geo',
    api: geoApi,
    factoryNames: { auto: 'geoText' },
    buildable: true,
    channels: ['lon', 'lat', 'text'],
    defaultStyle: { fill: '#1e293b', fontSize: 11 },
  },

  // 9. Chrome
  {
    family: 'axis',
    label: 'Axes & Grids',
    category: 'Chrome',
    docHref: '/marks/axes',
    api: axesApi,
    factoryNames: { auto: 'axis', x: 'axisX', y: 'axisY' },
    buildable: true,
    channels: [],
  },
  {
    family: 'legend',
    label: 'Legend key',
    category: 'Chrome',
    docHref: '/marks/legend',
    api: legendApi,
    factoryNames: { auto: 'legend' },
    buildable: true,
    channels: ['fill', 'size'],
  },
];

export const MARK_CATEGORIES = Array.from(new Set(MARKS.map((m) => m.category)));

export function markByFamily(family: MarkFamilyId): MarkManifestEntry {
  const found = MARKS.find((m) => m.family === family);
  if (!found) return MARKS[0];
  return found;
}
