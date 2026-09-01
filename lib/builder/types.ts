import type { ApiOption } from '../types';

export type MeasureType = 'quantitative' | 'categorical' | 'ordinal' | 'temporal' | 'geojson' | 'ref';
export type ScaleKind =
  | 'linear' | 'log' | 'symlog' | 'pow' | 'sqrt' | 'time'
  | 'band' | 'point' | 'ordinal' | 'sequential' | 'diverging';

export type OptionValue = string | number | boolean | string[] | number[] | Record<string, unknown> | undefined;

export type EditInstance = {
  id: InstanceId;
  name: string; // e.g. 'move', 'edit.line.draw', 'edit.stack.edge'
  options: Record<string, OptionValue>;
};

export type ChannelBinding = {
  field?: string;
  value?: OptionValue;
  isField?: boolean; // true = bind to data field, false = constant value
  edit?: EditInstance; // channel-level edit (e.g. channels.y.edit = move())
};

export type MarkFamilyId =
  | 'bar' | 'rect' | 'area' | 'tick' | 'point' | 'line' | 'text' | 'dotStack' | 'waffle'
  | 'arc' | 'needle' | 'axisRadial' | 'trend' | 'trendBand' | 'legend'
  | 'axis' | 'grid' | 'rule' | 'composite' | 'group' | 'face' | 'ellipse' | 'curve'
  | 'symbol' | 'geoBasemap' | 'geoTile' | 'geoPoint' | 'geoLine' | 'geoPolygon' | 'geoRect' | 'geoText'
  | 'node' | 'link' | 'sticker';

export type InstanceId = string;

export type ConstraintInstance = {
  id: InstanceId;
  name: string; // e.g. 'maintainSum', 'clamp', 'monotonic'
  options: Record<string, OptionValue>;
};

export type GuideInstance = {
  id: InstanceId;
  type: 'rule' | 'region' | 'remaining' | 'proximity' | 'custom';
  options: Record<string, OptionValue>;
};

export type MarkInstance = {
  id: InstanceId;
  label: string;
  family: MarkFamilyId;
  enabled: boolean;
  orientation: 'auto' | 'x' | 'y';
  channels: Record<string, ChannelBinding>;
  options: Record<string, OptionValue>;
  style: Record<string, OptionValue>;
  edits: EditInstance[];
  constraints: ConstraintInstance[];
};

export type ScaleState = {
  type: ScaleKind;
  options: Record<string, OptionValue>;
};

export type SchemaFieldState = {
  id: InstanceId;
  name: string;
  type: MeasureType;
  domain: string; // comma-separated or JSON
  default: string;
};

export type ThemeState = {
  preset: 'default' | 'survey' | 'dark';
  overrides: Record<string, OptionValue>;
  advancedJson: string;
};

export type LayoutState = {
  width: number;
  height: number;
  responsive: 'fixed' | 'scale' | 'reflow';
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  projection?: 'mercator' | 'albers-usa' | 'equirectangular';
  renderer: 'd3' | 'canvas';
};

export type EffectsState = {
  hoverOutlineColor?: string;
  hoverOutlineWidth?: number;
  selectedOutlineColor?: string;
  selectedOutlineWidth?: number;
  grabbedBrightness?: number;
};

export type StagesState = {
  enabled: boolean;
  initialStage: number;
};

export type LockState = {
  mode: 'none' | 'seed' | 'predicate';
  predicateCode: string;
};

export type StarterTemplate = {
  id: string;
  title: string;
  category: string;
  blurb: string;
  tryHint?: string;
  state: BuilderState;
};

export type BuilderState = {
  schema: SchemaFieldState[];
  dataJson: string;
  lock: LockState;
  marks: MarkInstance[];
  guides: GuideInstance[];
  constraints: ConstraintInstance[];
  scales: Record<string, ScaleState>;
  layout: LayoutState;
  effects: EffectsState;
  stages: StagesState;
  theme: ThemeState;
};

export type BuilderAction =
  // Layers / Marks
  | { type: 'ADD_MARK'; family: MarkFamilyId; label?: string }
  | { type: 'REMOVE_MARK'; id: InstanceId }
  | { type: 'DUPLICATE_MARK'; id: InstanceId }
  | { type: 'TOGGLE_MARK'; id: InstanceId }
  | { type: 'REORDER_MARK'; sourceIndex: number; targetIndex: number }
  | { type: 'SET_MARK_FAMILY'; id: InstanceId; family: MarkFamilyId }
  | { type: 'SET_MARK_LABEL'; id: InstanceId; label: string }
  | { type: 'SET_ORIENTATION'; id: InstanceId; orientation: MarkInstance['orientation'] }
  | { type: 'SET_CHANNEL'; id: InstanceId; channel: string; binding: ChannelBinding }
  | { type: 'SET_CHANNEL_EDIT'; markId: InstanceId; channel: string; editName: string }
  | { type: 'REMOVE_CHANNEL_EDIT'; markId: InstanceId; channel: string }
  | { type: 'SET_CHANNEL_EDIT_OPTION'; markId: InstanceId; channel: string; name: string; value: OptionValue }
  | { type: 'SET_MARK_OPTION'; id: InstanceId; name: string; value: OptionValue }
  | { type: 'SET_STYLE'; id: InstanceId; name: string; value: OptionValue }
  | { type: 'ADD_MARK_EDIT'; markId: InstanceId; name: string }
  | { type: 'REMOVE_MARK_EDIT'; markId: InstanceId; editId: InstanceId }
  | { type: 'SET_MARK_EDIT_OPTION'; markId: InstanceId; editId: InstanceId; name: string; value: OptionValue }
  | { type: 'ADD_MARK_CONSTRAINT'; markId: InstanceId; name: string }
  | { type: 'REMOVE_MARK_CONSTRAINT'; markId: InstanceId; constraintId: InstanceId }
  | { type: 'SET_MARK_CONSTRAINT_OPTION'; markId: InstanceId; constraintId: InstanceId; name: string; value: OptionValue }

  // Spec-level Guides
  | { type: 'ADD_GUIDE'; guideType: GuideInstance['type'] }
  | { type: 'REMOVE_GUIDE'; id: InstanceId }
  | { type: 'SET_GUIDE_OPTION'; id: InstanceId; name: string; value: OptionValue }

  // Spec-level Constraints
  | { type: 'ADD_CONSTRAINT'; name: string }
  | { type: 'REMOVE_CONSTRAINT'; id: InstanceId }
  | { type: 'SET_CONSTRAINT_OPTION'; id: InstanceId; name: string; value: OptionValue }

  // Scales & Axes
  | { type: 'SET_SCALE_TYPE'; channel: string; scaleType: ScaleKind }
  | { type: 'SET_SCALE_OPTION'; channel: string; name: string; value: OptionValue }
  | { type: 'CLEAR_SCALE'; channel: string }

  // Layout & Sizing
  | { type: 'SET_LAYOUT_OPTION'; name: keyof LayoutState; value: any }

  // Effects & Stages & Lock
  | { type: 'SET_EFFECTS_OPTION'; name: keyof EffectsState; value: any }
  | { type: 'SET_STAGES_OPTION'; name: keyof StagesState; value: any }
  | { type: 'SET_LOCK_OPTION'; name: keyof LockState; value: any }

  // Themes
  | { type: 'SET_THEME_PRESET'; preset: ThemeState['preset'] }
  | { type: 'SET_THEME_OVERRIDE'; name: string; value: OptionValue }
  | { type: 'SET_THEME_ADVANCED'; json: string }

  // Schema & Data
  | { type: 'ADD_SCHEMA_FIELD' }
  | { type: 'REMOVE_SCHEMA_FIELD'; id: InstanceId }
  | { type: 'SET_SCHEMA_FIELD'; id: InstanceId; patch: Partial<SchemaFieldState> }
  | { type: 'SET_DATA_JSON'; json: string }

  // Global actions
  | { type: 'LOAD_STARTER'; state: BuilderState }
  | { type: 'RESET' };

export type { ApiOption };
