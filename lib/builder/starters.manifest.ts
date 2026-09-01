import type { StarterTemplate } from './types';

function createId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  // 1. Distribution Elicitation
  {
    id: 'distribution-binned',
    title: 'Histogram / Distribution Elicitation',
    category: 'Distributions',
    blurb: 'Binned probability estimation with maintainSum: 100%, compensatory drag across bars, and a remaining tokens indicator.',
    tryHint: 'Drag any bar vertically — other bars automatically compensate to preserve the 100% total.',
    state: {
      schema: [
        { id: createId('f'), name: 'bin', type: 'categorical', domain: '18-24, 25-34, 35-49, 50-64, 65+', default: '' },
        { id: createId('f'), name: 'probability', type: 'quantitative', domain: '0, 100', default: '0' },
      ],
      dataJson: JSON.stringify([
        { bin: '18-24', probability: 15 },
        { bin: '25-34', probability: 35 },
        { bin: '35-49', probability: 25 },
        { bin: '50-64', probability: 15 },
        { bin: '65+', probability: 10 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Probability Bars',
          family: 'bar',
          enabled: true,
          orientation: 'y',
          channels: {
            x: { field: 'bin', isField: true },
            y: {
              field: 'probability',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: { guide: true } },
            },
          },
          options: {},
          style: { fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 1 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Value Labels',
          family: 'text',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: { field: 'bin', isField: true },
            y: { field: 'probability', isField: true },
            text: { field: 'probability', isField: true },
          },
          options: { dy: -10 },
          style: { fill: '#1e293b', fontSize: 11 },
          edits: [],
          constraints: [],
        },
      ],
      guides: [
        { id: createId('g'), type: 'remaining', options: { field: 'probability', unit: '%' } },
        { id: createId('g'), type: 'rule', options: { y: 20, label: 'Even Split (20%)', stroke: '#94a3b8', strokeDasharray: '4 4' } },
      ],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'probability' } },
        { id: createId('c'), name: 'maintainSum', options: { targetSum: 100, field: 'probability' } },
      ],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 30, marginRight: 20, marginBottom: 40, marginLeft: 50, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 2, grabbedBrightness: 0.85 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 2. You-Draw-It Forecast with Baseline Lock
  {
    id: 'you-draw-it-forecast',
    title: 'You-Draw-It Time Series Forecast',
    category: 'Time Series & Forecasting',
    blurb: 'Historical observations are locked in place; draw the forecast curve across future years using sweep and draw gestures.',
    tryHint: 'Sweep or drag across the empty right half to draw your forecast for 2024-2028.',
    state: {
      schema: [
        { id: createId('f'), name: 'year', type: 'quantitative', domain: '2018, 2028', default: '2024' },
        { id: createId('f'), name: 'metric', type: 'quantitative', domain: '0, 100', default: '50' },
        { id: createId('f'), name: 'type', type: 'categorical', domain: 'actual, forecast', default: 'forecast' },
      ],
      dataJson: JSON.stringify([
        { year: 2018, metric: 42, type: 'actual' },
        { year: 2019, metric: 48, type: 'actual' },
        { year: 2020, metric: 35, type: 'actual' },
        { year: 2021, metric: 55, type: 'actual' },
        { year: 2022, metric: 62, type: 'actual' },
        { year: 2023, metric: 70, type: 'actual' },
        { year: 2024, metric: 74, type: 'forecast' },
        { year: 2025, metric: 78, type: 'forecast' },
        { year: 2026, metric: 82, type: 'forecast' },
        { year: 2027, metric: 87, type: 'forecast' },
        { year: 2028, metric: 91, type: 'forecast' },
      ], null, 2),
      lock: { mode: 'predicate', predicateCode: "d => d.type === 'actual'" },
      marks: [
        {
          id: createId('m'),
          label: 'Forecast Curve',
          family: 'line',
          enabled: true,
          orientation: 'y',
          channels: {
            x: { field: 'year', isField: true },
            y: {
              field: 'metric',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: { pick: 'sweep', guide: true } },
            },
          },
          options: { curve: 'catmullRom' },
          style: { stroke: '#2563eb', strokeWidth: 3 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Data Points',
          family: 'point',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: { field: 'year', isField: true },
            y: {
              field: 'metric',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: {} },
            },
          },
          options: {},
          style: { fill: '#1d4ed8', size: 6 },
          edits: [],
          constraints: [],
        },
      ],
      guides: [
        { id: createId('g'), type: 'rule', options: { x: 2023, label: 'Historical Cutoff', stroke: '#64748b', strokeDasharray: '5 4' } },
        { id: createId('g'), type: 'region', options: { x: '2023, 2028', fill: '#3b82f6', opacity: 0.06 } },
      ],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'metric' } },
      ],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 25, marginRight: 25, marginBottom: 40, marginLeft: 50, renderer: 'd3' },
      effects: { hoverOutlineColor: '#3b82f6', hoverOutlineWidth: 2, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'default', overrides: {}, advancedJson: '' },
    },
  },

  // 3. Confidence Interval & Fan Chart
  {
    id: 'confidence-fan-trend',
    title: 'Confidence Fan & Uncertainty Cone',
    category: 'Models & uncertainty',
    blurb: 'Parametric trend line with uncertainty cone: drag slope/intercept handles and spread grips to elicit belief bounds.',
    tryHint: 'Drag the line end to rotate slope; drag the fan boundary to open the uncertainty cone.',
    state: {
      schema: [
        { id: createId('f'), name: 'x', type: 'quantitative', domain: '-10, 10', default: '0' },
        { id: createId('f'), name: 'y', type: 'quantitative', domain: '-10, 10', default: '0' },
        { id: createId('f'), name: 'intercept', type: 'quantitative', domain: '-5, 5', default: '1' },
        { id: createId('f'), name: 'slope', type: 'quantitative', domain: '-2, 2', default: '0.4' },
        { id: createId('f'), name: 'slopeSpread', type: 'quantitative', domain: '0, 1', default: '0.3' },
        { id: createId('f'), name: 'interceptSpread', type: 'quantitative', domain: '0, 5', default: '2' },
      ],
      dataJson: JSON.stringify([
        { intercept: 1, slope: 0.4, slopeSpread: 0.3, interceptSpread: 2 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Uncertainty Fan',
          family: 'trendBand',
          enabled: true,
          orientation: 'auto',
          channels: {
            interceptSpread: {
              field: 'interceptSpread',
              isField: true,
              edit: { id: createId('e'), name: 'edit.trend.interceptSpread', options: {} },
            },
            slopeSpread: {
              field: 'slopeSpread',
              isField: true,
              edit: { id: createId('e'), name: 'edit.trend.slopeSpread', options: {} },
            },
          },
          options: { render: 'gradient', levels: 5, distribution: 'normal', handles: true },
          style: { fill: '#7c3aed', opacity: 0.25 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Central Trend Line',
          family: 'trend',
          enabled: true,
          orientation: 'auto',
          channels: {
            intercept: {
              field: 'intercept',
              isField: true,
              edit: { id: createId('e'), name: 'edit.trend.intercept', options: {} },
            },
            slope: {
              field: 'slope',
              isField: true,
              edit: { id: createId('e'), name: 'edit.trend.slope', options: {} },
            },
          },
          options: { handles: true, handleSize: 6 },
          style: { stroke: '#7c3aed', strokeWidth: 3 },
          edits: [],
          constraints: [],
        },
      ],
      guides: [
        { id: createId('g'), type: 'rule', options: { y: 0, stroke: '#94a3b8', strokeDasharray: '4 4' } },
      ],
      constraints: [],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 25, marginRight: 25, marginBottom: 40, marginLeft: 50, renderer: 'd3' },
      effects: { hoverOutlineColor: '#7c3aed', hoverOutlineWidth: 2, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 4. Budget & Resource Allocation
  {
    id: 'budget-allocation-pie',
    title: 'Constant-Sum Resource Allocation',
    category: 'Partitions & Shares',
    blurb: 'Interactive partition allocation (pie/donut): drag boundary seam handles to shift shares while preserving 100% budget.',
    tryHint: 'Drag any boundary grip between adjacent slices to reallocate the share.',
    state: {
      schema: [
        { id: createId('f'), name: 'category', type: 'categorical', domain: 'Engineering, Design, Marketing, Operations, R&D', default: '' },
        { id: createId('f'), name: 'budget', type: 'quantitative', domain: '0, 100', default: '20' },
      ],
      dataJson: JSON.stringify([
        { category: 'Engineering', budget: 35 },
        { category: 'Design', budget: 20 },
        { category: 'Marketing', budget: 15 },
        { category: 'Operations', budget: 15 },
        { category: 'R&D', budget: 15 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Budget Donut',
          family: 'arc',
          enabled: true,
          orientation: 'auto',
          channels: { value: { field: 'budget', isField: true }, fill: { field: 'category', isField: true } },
          options: { innerRadius: 0.58, padAngle: 1.5, handles: true },
          style: {},
          edits: [
            { id: createId('e'), name: 'edit.stack.edge', options: {} }
          ],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Legend Swatches',
          family: 'legend',
          enabled: true,
          orientation: 'auto',
          channels: {
            fill: {
              field: 'category',
              isField: true,
              edit: { id: createId('e'), name: 'edit.legend.category', options: {} },
            },
          },
          options: {},
          style: {},
          edits: [],
          constraints: [],
        }
      ],
      guides: [
        { id: createId('g'), type: 'remaining', options: { field: 'budget', unit: '%' } },
      ],
      constraints: [
        { id: createId('c'), name: 'maintainSum', options: { targetSum: 100, field: 'budget' } },
      ],
      scales: {},
      layout: { width: 560, height: 380, responsive: 'scale', marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 3, grabbedBrightness: 0.88 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 5. Survey Likert Questionnaire
  {
    id: 'likert-survey-widget',
    title: 'Likert Scale & Opinion Elicitation',
    category: 'Survey & Questionnaires',
    blurb: 'Opinion elicitation with categorical swatches, editable category scale domains, and stage progression.',
    tryHint: 'Click a Likert radio band to select an option, or drag the active point.',
    state: {
      schema: [
        { id: createId('f'), name: 'question', type: 'categorical', domain: 'Usability, Performance, Aesthetics, Support', default: '' },
        { id: createId('f'), name: 'rating', type: 'ordinal', domain: 'Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree', default: 'Neutral' },
      ],
      dataJson: JSON.stringify([
        { question: 'Usability', rating: 'Agree' },
        { question: 'Performance', rating: 'Neutral' },
        { question: 'Aesthetics', rating: 'Strongly Agree' },
        { question: 'Support', rating: 'Disagree' },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Rating Points',
          family: 'point',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: {
              field: 'rating',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: { guide: true } },
            },
            y: { field: 'question', isField: true },
            fill: { field: 'rating', isField: true },
          },
          options: {},
          style: { size: 10 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Grid Lines',
          family: 'rule',
          enabled: true,
          orientation: 'auto',
          channels: { y: { field: 'question', isField: true } },
          options: {},
          style: { stroke: '#e2e8f0', strokeWidth: 2 },
          edits: [],
          constraints: [],
        }
      ],
      guides: [],
      constraints: [],
      scales: {},
      layout: { width: 620, height: 360, responsive: 'scale', marginTop: 30, marginRight: 30, marginBottom: 40, marginLeft: 90, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 6. Spatial Beliefs / Vancouver Pinning
  {
    id: 'spatial-geo-pins',
    title: 'Spatial Beliefs & Geo Pinning',
    category: 'Geo & Spatial',
    blurb: 'Interactive spatial belief pinning on Vancouver basemap with draggable coordinates and pin creation.',
    tryHint: 'Click anywhere on the map to add a belief pin; drag existing pins to reposition.',
    state: {
      schema: [
        { id: createId('f'), name: 'location', type: 'categorical', domain: 'Kitsilano, Downtown, Mount Pleasant, Commercial Dr', default: '' },
        { id: createId('f'), name: 'lon', type: 'quantitative', domain: '-123.27, -123.02', default: '-123.12' },
        { id: createId('f'), name: 'lat', type: 'quantitative', domain: '49.20, 49.32', default: '49.28' },
        { id: createId('f'), name: 'confidence', type: 'quantitative', domain: '1, 10', default: '5' },
      ],
      dataJson: JSON.stringify([
        { location: 'Downtown', lon: -123.1207, lat: 49.2827, confidence: 8 },
        { location: 'Kitsilano', lon: -123.1560, lat: 49.2680, confidence: 6 },
        { location: 'Mount Pleasant', lon: -123.1000, lat: 49.2630, confidence: 4 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Geo Basemap',
          family: 'geoBasemap',
          enabled: true,
          orientation: 'auto',
          channels: {},
          options: { fill: '#e8eef5', stroke: '#64748b', strokeWidth: 0.8 },
          style: {},
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Geo Pins',
          family: 'geoPoint',
          enabled: true,
          orientation: 'auto',
          channels: { lon: { field: 'lon', isField: true }, lat: { field: 'lat', isField: true } },
          options: { size: 8 },
          style: { fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.5 },
          edits: [
            { id: createId('e'), name: 'edit.geo.move', options: {} },
            { id: createId('e'), name: 'edit.geo.create', options: {} },
          ],
          constraints: [],
        },
      ],
      guides: [],
      constraints: [],
      scales: {},
      layout: { width: 560, height: 380, responsive: 'scale', marginTop: 10, marginRight: 10, marginBottom: 10, marginLeft: 10, projection: 'mercator', renderer: 'd3' },
      effects: { hoverOutlineColor: '#ef4444', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'default', overrides: {}, advancedJson: '' },
    },
  },

  // 7. Emotion & Sentiment Elicitation (Chernoff Face)
  {
    id: 'emotion-face-glyph',
    title: 'Emotion & Sentiment Chernoff Face',
    category: 'Composites & Glyphs',
    blurb: 'Elicit emotional valence and arousal using interactive Chernoff face facial feature curves.',
    tryHint: 'Drag the mouth vertically for valence (smile vs frown); drag eyes horizontally for arousal.',
    state: {
      schema: [
        { id: createId('f'), name: 'valence', type: 'quantitative', domain: '-1, 1', default: '0.4' },
        { id: createId('f'), name: 'arousal', type: 'quantitative', domain: '-1, 1', default: '0.6' },
        { id: createId('f'), name: 'browTilt', type: 'quantitative', domain: '-1, 1', default: '0.1' },
        { id: createId('f'), name: 'browHeight', type: 'quantitative', domain: '-1, 1', default: '0.3' },
      ],
      dataJson: JSON.stringify([
        { valence: 0.5, arousal: 0.7, browTilt: 0.2, browHeight: 0.4 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Chernoff Face',
          family: 'face',
          enabled: true,
          orientation: 'auto',
          channels: {
            mouthCurve: {
              field: 'valence',
              isField: true,
              edit: { id: createId('e'), name: 'slide', options: { axis: 'y', increase: 'up' } },
            },
            eyeScale: {
              field: 'arousal',
              isField: true,
              edit: { id: createId('e'), name: 'slide', options: { axis: 'x', increase: 'right' } },
            },
            browTilt: { field: 'browTilt', isField: true },
            browHeight: { field: 'browHeight', isField: true },
          },
          options: { size: 90, ink: '#1f2937' },
          style: { fill: '#fef08a', stroke: '#ca8a04' },
          edits: [],
          constraints: [],
        },
      ],
      guides: [],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: -1, max: 1, field: 'valence' } },
        { id: createId('c'), name: 'clamp', options: { min: -1, max: 1, field: 'arousal' } },
      ],
      scales: {},
      layout: { width: 560, height: 380, responsive: 'scale', marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20, renderer: 'd3' },
      effects: { hoverOutlineColor: '#eab308', hoverOutlineWidth: 2, grabbedBrightness: 0.9 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 8. Causal Belief Network
  {
    id: 'causal-belief-network',
    title: 'Causal Belief Network Graph',
    category: 'Networks & Graphs',
    blurb: 'Interactive node-link causal graph: reposition concept nodes, connect causes to effects, and rewire relationships.',
    tryHint: 'Drag a node to reposition it; drag from one node to another to create a causal link.',
    state: {
      schema: [
        { id: createId('f'), name: 'id', type: 'categorical', domain: '1, 2, 3, 4', default: '' },
        { id: createId('f'), name: 'label', type: 'categorical', domain: 'Price, Demand, Quality, Brand', default: '' },
        { id: createId('f'), name: 'x', type: 'quantitative', domain: '0, 100', default: '50' },
        { id: createId('f'), name: 'y', type: 'quantitative', domain: '0, 100', default: '50' },
      ],
      dataJson: JSON.stringify([
        { id: '1', label: 'Price', x: 20, y: 70 },
        { id: '2', label: 'Quality', x: 20, y: 30 },
        { id: '3', label: 'Brand', x: 50, y: 20 },
        { id: '4', label: 'Demand', x: 80, y: 50 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Network Nodes',
          family: 'node',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: { field: 'x', isField: true },
            y: { field: 'y', isField: true },
            text: { field: 'label', isField: true },
          },
          options: { shape: 'circle', size: 14, dy: -18 },
          style: { fill: '#3b82f6' },
          edits: [
            { id: createId('e'), name: 'move', options: { channels: ['x', 'y'] } },
            { id: createId('e'), name: 'edit.network.connect', options: {} },
          ],
          constraints: [],
        },
      ],
      guides: [],
      constraints: [],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 25, marginRight: 25, marginBottom: 25, marginLeft: 25, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'default', overrides: {}, advancedJson: '' },
    },
  },

  // 9. Two-Stage Interval Elicitation
  {
    id: 'two-stage-estimation',
    title: 'Two-Stage Interval & Confidence Elicitation',
    category: 'Multi-Stage Pipelines',
    blurb: 'Multi-step progressive elicitation: Stage 0 sets the point estimate, Stage 1 expands the confidence interval radius.',
    tryHint: 'Drag horizontally to set the mean in Stage 0, click Next Stage, then drag outwards to size the confidence radius.',
    state: {
      schema: [
        { id: createId('f'), name: 'target', type: 'categorical', domain: 'Revenue, Growth, Retention', default: '' },
        { id: createId('f'), name: 'estimate', type: 'quantitative', domain: '0, 100', default: '50' },
        { id: createId('f'), name: 'confidenceRadius', type: 'quantitative', domain: '0, 30', default: '10' },
      ],
      dataJson: JSON.stringify([
        { target: 'Revenue', estimate: 45, confidenceRadius: 12 },
        { target: 'Growth', estimate: 65, confidenceRadius: 8 },
        { target: 'Retention', estimate: 75, confidenceRadius: 15 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Confidence Interval Bubble',
          family: 'point',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: {
              field: 'estimate',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: { stage: 0 } },
            },
            y: { field: 'target', isField: true },
            size: {
              field: 'confidenceRadius',
              isField: true,
              edit: { id: createId('e'), name: 'resize', options: { stage: 1 } },
            },
          },
          options: {},
          style: { fill: '#3b82f6', opacity: 0.6 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Target Baseline Rules',
          family: 'rule',
          enabled: true,
          orientation: 'auto',
          channels: { y: { field: 'target', isField: true } },
          options: {},
          style: { stroke: '#cbd5e1', strokeWidth: 2 },
          edits: [],
          constraints: [],
        },
      ],
      guides: [
        { id: createId('g'), type: 'rule', options: { x: 50, label: 'Benchmark (50)', stroke: '#94a3b8', strokeDasharray: '4 4' } },
      ],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'estimate' } },
      ],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 30, marginRight: 30, marginBottom: 40, marginLeft: 80, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: true, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 10. Discrete Choice Waffle
  {
    id: 'discrete-choice-waffle',
    title: 'Discrete Choice Waffle Grid',
    category: 'Distributions',
    blurb: 'Unit token counting grid with click-and-drag fill interactions for countable frequency elicitation.',
    tryHint: 'Click or drag across the grid to fill or clear unit tokens.',
    state: {
      schema: [
        { id: createId('f'), name: 'category', type: 'categorical', domain: 'Group A, Group B, Group C', default: '' },
        { id: createId('f'), name: 'count', type: 'quantitative', domain: '0, 50', default: '15' },
      ],
      dataJson: JSON.stringify([
        { category: 'Group A', count: 24 },
        { category: 'Group B', count: 38 },
        { category: 'Group C', count: 17 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Waffle Cells',
          family: 'waffle',
          enabled: true,
          orientation: 'y',
          channels: {
            x: { field: 'category', isField: true },
            y: {
              field: 'count',
              isField: true,
              edit: { id: createId('e'), name: 'edit.waffle.fill', options: {} },
            },
          },
          options: { unit: 1, multiple: 5, shape: 'rect', showEmpty: true, emptyFill: '#f1f5f9' },
          style: { fill: '#3b82f6' },
          edits: [],
          constraints: [],
        },
      ],
      guides: [],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 50, field: 'count' } },
      ],
      scales: {
        x: { type: 'band', options: { padding: 0.3 } },
      },
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 30, marginRight: 30, marginBottom: 40, marginLeft: 50, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 2, grabbedBrightness: 0.85 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 11. Polar Speedometer / Belief Dial
  {
    id: 'polar-speedometer-dial',
    title: 'Polar Dial & Speedometer Needle',
    category: 'Polar & Gauges',
    blurb: 'Radial speedometer needle gauge: drag the needle angle along the dial to record continuous sentiment or probability.',
    tryHint: 'Drag the needle tip along the radial gauge arc.',
    state: {
      schema: [
        { id: createId('f'), name: 'sentiment', type: 'quantitative', domain: '0, 100', default: '50' },
      ],
      dataJson: JSON.stringify([
        { sentiment: 65 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Dial Arc Background',
          family: 'axisRadial',
          enabled: true,
          orientation: 'auto',
          channels: { angle: { field: 'sentiment', isField: true } },
          options: { arc: 'semi', radius: 95, ticks: 6 },
          style: {},
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Gauge Needle',
          family: 'needle',
          enabled: true,
          orientation: 'auto',
          channels: {
            angle: {
              field: 'sentiment',
              isField: true,
              edit: {
                id: createId('e'),
                name: 'rotate',
                options: { pivot: 'mark', fold: false, pick: 'direct' },
              },
            },
          },
          options: { orient: 'top', arc: 'semi', length: 85, handleSize: 7 },
          style: { fill: '#ef4444' },
          edits: [],
          constraints: [],
        },
      ],
      guides: [],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'sentiment' } },
      ],
      scales: {},
      layout: { width: 560, height: 340, responsive: 'scale', marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20, renderer: 'd3' },
      effects: { hoverOutlineColor: '#ef4444', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },

  // 12. Bivariate Correlation Scatter
  {
    id: 'bivariate-scatter-quadrant',
    title: 'Bivariate Correlation & Quadrant Scatter',
    category: 'Points & Ticks',
    blurb: '2D bivariate correlation scatter with quadrant reference lines, monotonic constraints, and boundary clamping.',
    tryHint: 'Drag any scatter point to update its (X, Y) coordinates.',
    state: {
      schema: [
        { id: createId('f'), name: 'item', type: 'categorical', domain: 'Item 1, Item 2, Item 3, Item 4, Item 5', default: '' },
        { id: createId('f'), name: 'feasibility', type: 'quantitative', domain: '0, 100', default: '50' },
        { id: createId('f'), name: 'impact', type: 'quantitative', domain: '0, 100', default: '50' },
      ],
      dataJson: JSON.stringify([
        { item: 'Feature A', feasibility: 80, impact: 85 },
        { item: 'Feature B', feasibility: 30, impact: 90 },
        { item: 'Feature C', feasibility: 70, impact: 40 },
        { item: 'Feature D', feasibility: 45, impact: 30 },
        { item: 'Feature E', feasibility: 90, impact: 60 },
      ], null, 2),
      lock: { mode: 'none', predicateCode: '' },
      marks: [
        {
          id: createId('m'),
          label: 'Quadrant Points',
          family: 'point',
          enabled: true,
          orientation: 'auto',
          channels: {
            x: {
              field: 'feasibility',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: {} },
            },
            y: {
              field: 'impact',
              isField: true,
              edit: { id: createId('e'), name: 'move', options: {} },
            },
          },
          options: {},
          style: { fill: '#3b82f6', size: 9 },
          edits: [],
          constraints: [],
        },
        {
          id: createId('m'),
          label: 'Item Labels',
          family: 'text',
          enabled: true,
          orientation: 'auto',
          channels: { x: { field: 'feasibility', isField: true }, y: { field: 'impact', isField: true }, text: { field: 'item', isField: true } },
          options: { dy: -12 },
          style: { fill: '#1e293b', fontSize: 11 },
          edits: [],
          constraints: [],
        },
      ],
      guides: [
        { id: createId('g'), type: 'rule', options: { x: 50, label: 'Feasibility Midpoint', stroke: '#94a3b8', strokeDasharray: '4 4' } },
        { id: createId('g'), type: 'rule', options: { y: 50, label: 'Impact Midpoint', stroke: '#94a3b8', strokeDasharray: '4 4' } },
      ],
      constraints: [
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'feasibility' } },
        { id: createId('c'), name: 'clamp', options: { min: 0, max: 100, field: 'impact' } },
      ],
      scales: {},
      layout: { width: 620, height: 380, responsive: 'scale', marginTop: 30, marginRight: 30, marginBottom: 40, marginLeft: 50, renderer: 'd3' },
      effects: { hoverOutlineColor: '#2563eb', hoverOutlineWidth: 3, grabbedBrightness: 0.8 },
      stages: { enabled: false, initialStage: 0 },
      theme: { preset: 'survey', overrides: {}, advancedJson: '' },
    },
  },
];

export const STARTER_CATEGORIES = Array.from(new Set(STARTER_TEMPLATES.map((t) => t.category)));

export function starterById(id: string): StarterTemplate {
  const found = STARTER_TEMPLATES.find((t) => t.id === id);
  if (!found) return STARTER_TEMPLATES[0];
  return found;
}
