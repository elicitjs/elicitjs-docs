'use client';

import { useState, type Dispatch } from 'react';
import type { BuilderAction, BuilderState } from '../../lib/builder/types';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
};

export function ThemeEffectsEditor({ state, dispatch }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'effects'>('theme');
  const theme = state.theme || { preset: 'default', overrides: {}, advancedJson: '' };
  const effects = state.effects || {};

  return (
    <div className="theme-effects-panel">
      <div className="sub-tab-strip">
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'theme' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('theme')}
        >
          Theme & Styling
        </button>
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'effects' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('effects')}
        >
          Interactive Feedback
        </button>
      </div>

      {/* THEME TAB */}
      {activeSubTab === 'theme' && (
        <div className="theme-section">
          <div className="opt-field">
            <span className="opt-name">Theme Preset</span>
            <select
              className="opt-select"
              value={theme.preset}
              onChange={(e) =>
                dispatch({
                  type: 'SET_THEME_PRESET',
                  preset: e.target.value as 'default' | 'survey' | 'dark',
                })
              }
            >
              <option value="default">Default Elicit look</option>
              <option value="survey">Survey / Editorial questionnaire</option>
              <option value="dark">Self-contained Dark Mode</option>
            </select>
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Color Tokens
          </div>
          <div className="opt-field">
            <span className="opt-name">Primary Ink</span>
            <input
              type="text"
              className="opt-input"
              placeholder="e.g. steelblue or #3b82f6"
              value={typeof theme.overrides.ink === 'string' ? theme.overrides.ink : ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_THEME_OVERRIDE',
                  name: 'ink',
                  value: e.target.value || undefined,
                })
              }
            />
          </div>
          <div className="opt-field">
            <span className="opt-name">Accent (Grips/Focus)</span>
            <input
              type="text"
              className="opt-input"
              placeholder="e.g. #2563eb"
              value={typeof theme.overrides.accent === 'string' ? theme.overrides.accent : ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_THEME_OVERRIDE',
                  name: 'accent',
                  value: e.target.value || undefined,
                })
              }
            />
          </div>
          <div className="opt-field">
            <span className="opt-name">Background</span>
            <input
              type="text"
              className="opt-input"
              placeholder="e.g. #ffffff or #0f172a"
              value={typeof theme.overrides.background === 'string' ? theme.overrides.background : ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_THEME_OVERRIDE',
                  name: 'background',
                  value: e.target.value || undefined,
                })
              }
            />
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Advanced Theme JSON (sparse override)
          </div>
          <textarea
            className="theme-advanced-editor"
            rows={4}
            placeholder="{ &quot;ghost&quot;: { &quot;opacity&quot;: 0.3 } }"
            value={theme.advancedJson || ''}
            onChange={(e) =>
              dispatch({ type: 'SET_THEME_ADVANCED', json: e.target.value })
            }
          />
        </div>
      )}

      {/* EFFECTS TAB */}
      {activeSubTab === 'effects' && (
        <div className="effects-section">
          <p className="settings-hint">
            Customize visual state overlays when respondents hover over, select, or grab marks.
          </p>

          <div className="settings-subhead">Hover State</div>
          <div className="opt-field">
            <span className="opt-name">Outline Color</span>
            <input
              type="text"
              className="opt-input"
              placeholder="#2563eb"
              value={effects.hoverOutlineColor || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_EFFECTS_OPTION',
                  name: 'hoverOutlineColor',
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="opt-field">
            <span className="opt-name">Outline Width (px)</span>
            <input
              type="number"
              className="opt-input"
              placeholder="2"
              value={effects.hoverOutlineWidth || 2}
              onChange={(e) =>
                dispatch({
                  type: 'SET_EFFECTS_OPTION',
                  name: 'hoverOutlineWidth',
                  value: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Selection State
          </div>
          <div className="opt-field">
            <span className="opt-name">Selection Outline</span>
            <input
              type="text"
              className="opt-input"
              placeholder="#ea580c"
              value={effects.selectedOutlineColor || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_EFFECTS_OPTION',
                  name: 'selectedOutlineColor',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Grabbed / In-Flight Drag
          </div>
          <div className="opt-field">
            <span className="opt-name">Brightness Multiplier</span>
            <input
              type="number"
              step="0.05"
              className="opt-input"
              placeholder="0.82"
              value={effects.grabbedBrightness || 0.85}
              onChange={(e) =>
                dispatch({
                  type: 'SET_EFFECTS_OPTION',
                  name: 'grabbedBrightness',
                  value: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
