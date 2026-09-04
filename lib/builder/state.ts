import type {
  BuilderAction,
  BuilderState,
  MarkInstance,
  ChannelBinding,
  ScaleState,
  MarkFamilyId,
  OptionValue,
} from './types';
import { markByFamily } from './marks.manifest';
import { STARTER_TEMPLATES } from './starters.manifest';

function newId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function channelsForFamily(
  family: MarkFamilyId,
  prevChannels: Record<string, ChannelBinding> = {}
): Record<string, ChannelBinding> {
  const entry = markByFamily(family);
  const out: Record<string, ChannelBinding> = {};
  for (const ch of entry.channels) {
    if (prevChannels[ch]) {
      out[ch] = prevChannels[ch];
    } else {
      out[ch] = {
        isField: true,
        field: ch,
      };
    }
  }
  return out;
}

export function defaultStarter(): BuilderState {
  const t = STARTER_TEMPLATES[0];
  return JSON.parse(JSON.stringify(t.state));
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'LOAD_STARTER':
      return JSON.parse(JSON.stringify(action.state));

    case 'RESET':
      return defaultStarter();

    // =========================================================================
    // Mark Layers
    // =========================================================================
    case 'ADD_MARK': {
      const entry = markByFamily(action.family);
      const newMark: MarkInstance = {
        id: newId('mark'),
        label: action.label || entry.label,
        family: action.family,
        enabled: true,
        orientation: entry.factoryNames.y ? 'y' : 'auto',
        channels: channelsForFamily(action.family),
        options: { ...(entry.defaultOptions || {}) },
        style: { ...(entry.defaultStyle || {}) },
        edits: [],
      };
      return {
        ...state,
        marks: [...state.marks, newMark],
      };
    }
    case 'REMOVE_MARK':
      return {
        ...state,
        marks: state.marks.filter((m) => m.id !== action.id),
      };
    case 'DUPLICATE_MARK': {
      const target = state.marks.find((m) => m.id === action.id);
      if (!target) return state;
      const dup: MarkInstance = {
        ...target,
        id: newId('mark'),
        label: `${target.label} (copy)`,
        channels: JSON.parse(JSON.stringify(target.channels)),
        options: { ...target.options },
        style: { ...target.style },
        edits: target.edits.map((e) => ({ ...e, id: newId('edit'), options: { ...e.options } })),
      };
      const idx = state.marks.findIndex((m) => m.id === action.id);
      const nextMarks = [...state.marks];
      nextMarks.splice(idx + 1, 0, dup);
      return { ...state, marks: nextMarks };
    }
    case 'TOGGLE_MARK':
      return {
        ...state,
        marks: state.marks.map((m) => (m.id === action.id ? { ...m, enabled: !m.enabled } : m)),
      };
    case 'REORDER_MARK': {
      const { sourceIndex, targetIndex } = action;
      if (sourceIndex < 0 || sourceIndex >= state.marks.length || targetIndex < 0 || targetIndex >= state.marks.length) {
        return state;
      }
      const nextMarks = [...state.marks];
      const [moved] = nextMarks.splice(sourceIndex, 1);
      nextMarks.splice(targetIndex, 0, moved);
      return { ...state, marks: nextMarks };
    }
    case 'SET_MARK_FAMILY': {
      const entry = markByFamily(action.family);
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.id) return m;
          return {
            ...m,
            family: action.family,
            channels: channelsForFamily(action.family, m.channels),
            options: { ...(entry.defaultOptions || {}) },
            style: { ...(entry.defaultStyle || m.style) },
          };
        }),
      };
    }
    case 'SET_MARK_LABEL':
      return {
        ...state,
        marks: state.marks.map((m) => (m.id === action.id ? { ...m, label: action.label } : m)),
      };
    case 'SET_ORIENTATION':
      return {
        ...state,
        marks: state.marks.map((m) => (m.id === action.id ? { ...m, orientation: action.orientation } : m)),
      };
    case 'SET_CHANNEL':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.id) return m;
          return {
            ...m,
            channels: { ...m.channels, [action.channel]: action.binding },
          };
        }),
      };
    case 'SET_CHANNEL_EDIT':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          const currentBinding = m.channels[action.channel] || { isField: true, field: action.channel };
          return {
            ...m,
            channels: {
              ...m.channels,
              [action.channel]: {
                ...currentBinding,
                edit: {
                  id: newId('edit'),
                  name: action.editName,
                  options: {},
                },
              },
            },
          };
        }),
      };
    case 'REMOVE_CHANNEL_EDIT':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          const currentBinding = m.channels[action.channel];
          if (!currentBinding) return m;
          const { edit: _, ...rest } = currentBinding;
          return {
            ...m,
            channels: {
              ...m.channels,
              [action.channel]: rest,
            },
          };
        }),
      };
    case 'SET_CHANNEL_EDIT_OPTION':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          const currentBinding = m.channels[action.channel];
          if (!currentBinding?.edit) return m;
          return {
            ...m,
            channels: {
              ...m.channels,
              [action.channel]: {
                ...currentBinding,
                edit: {
                  ...currentBinding.edit,
                  options: {
                    ...currentBinding.edit.options,
                    [action.name]: action.value,
                  },
                },
              },
            },
          };
        }),
      };
    case 'SET_MARK_OPTION':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.id) return m;
          return {
            ...m,
            options: { ...m.options, [action.name]: action.value },
          };
        }),
      };
    case 'SET_STYLE':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.id) return m;
          return {
            ...m,
            style: { ...m.style, [action.name]: action.value },
          };
        }),
      };
    case 'ADD_MARK_EDIT':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          return {
            ...m,
            edits: [...m.edits, { id: newId('edit'), name: action.name, options: {} }],
          };
        }),
      };
    case 'REMOVE_MARK_EDIT':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          return {
            ...m,
            edits: m.edits.filter((e) => e.id !== action.editId),
          };
        }),
      };
    case 'SET_MARK_EDIT_OPTION':
      return {
        ...state,
        marks: state.marks.map((m) => {
          if (m.id !== action.markId) return m;
          return {
            ...m,
            edits: m.edits.map((e) =>
              e.id === action.editId ? { ...e, options: { ...e.options, [action.name]: action.value } } : e
            ),
          };
        }),
      };
    case 'ADD_CONSTRAINT':
      return {
        ...state,
        constraints: [...(state.constraints || []), { id: newId('const'), name: action.name, options: {} }],
      };
    case 'REMOVE_CONSTRAINT':
      return {
        ...state,
        constraints: state.constraints.filter((c) => c.id !== action.id),
      };
    case 'SET_CONSTRAINT_OPTION':
      return {
        ...state,
        constraints: state.constraints.map((c) =>
          c.id === action.id ? { ...c, options: { ...c.options, [action.name]: action.value } } : c
        ),
      };

    // =========================================================================
    // Scales & Axes
    // =========================================================================
    case 'SET_SCALE_TYPE': {
      const prev = state.scales[action.channel] || { type: action.scaleType, options: {} };
      return {
        ...state,
        scales: {
          ...state.scales,
          [action.channel]: { type: action.scaleType, options: prev.options },
        },
      };
    }
    case 'SET_SCALE_OPTION': {
      const current = state.scales[action.channel];
      if (!current) return state;
      return {
        ...state,
        scales: {
          ...state.scales,
          [action.channel]: {
            ...current,
            options: { ...current.options, [action.name]: action.value },
          },
        },
      };
    }
    case 'CLEAR_SCALE': {
      const next = { ...state.scales };
      delete next[action.channel];
      return { ...state, scales: next };
    }

    // =========================================================================
    // Layout, Effects, Stages, Lock, Theme
    // =========================================================================
    case 'SET_LAYOUT_OPTION':
      return {
        ...state,
        layout: { ...state.layout, [action.name]: action.value },
      };
    case 'SET_EFFECTS_OPTION':
      return {
        ...state,
        effects: { ...state.effects, [action.name]: action.value },
      };
    case 'SET_STAGES_OPTION':
      return {
        ...state,
        stages: { ...state.stages, [action.name]: action.value },
      };
    case 'SET_LOCK_OPTION':
      return {
        ...state,
        lock: { ...state.lock, [action.name]: action.value },
      };
    case 'SET_THEME_PRESET':
      return {
        ...state,
        theme: { ...state.theme, preset: action.preset },
      };
    case 'SET_THEME_OVERRIDE':
      return {
        ...state,
        theme: {
          ...state.theme,
          overrides: { ...state.theme.overrides, [action.name]: action.value },
        },
      };
    case 'SET_THEME_ADVANCED':
      return {
        ...state,
        theme: { ...state.theme, advancedJson: action.json },
      };

    // =========================================================================
    // Schema & Data
    // =========================================================================
    case 'ADD_SCHEMA_FIELD':
      return {
        ...state,
        schema: [
          ...state.schema,
          { id: newId('field'), name: `field_${state.schema.length + 1}`, type: 'quantitative', domain: '', default: '' },
        ],
      };
    case 'REMOVE_SCHEMA_FIELD':
      return {
        ...state,
        schema: state.schema.filter((f) => f.id !== action.id),
      };
    case 'SET_SCHEMA_FIELD':
      return {
        ...state,
        schema: state.schema.map((f) => (f.id === action.id ? { ...f, ...action.patch } : f)),
      };
    case 'SET_DATA_JSON':
      return {
        ...state,
        dataJson: action.json,
      };

    default:
      return state;
  }
}
