'use client';

import { useState, type Dispatch } from 'react';
import type { BuilderAction, BuilderState, ScaleKind } from '../../lib/builder/types';
import { SCALES, scaleByType } from '../../lib/builder/scales.manifest';
import { OptionField } from './OptionField';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
};

const COMMON_CHANNELS = ['x', 'y', 'fill', 'size', 'angle', 'radius'];

export function ScalesLayoutEditor({ state, dispatch }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'scales' | 'layout'>('scales');
  const scales = state.scales || {};
  const layout = state.layout || {
    width: 600,
    height: 400,
    responsive: 'scale',
    marginTop: 20,
    marginRight: 20,
    marginBottom: 30,
    marginLeft: 40,
    renderer: 'd3',
  };

  return (
    <div className="scales-layout-panel">
      <div className="sub-tab-strip">
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'scales' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('scales')}
        >
          Channel Scales
        </button>
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'layout' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('layout')}
        >
          Layout & Sizing
        </button>
      </div>

      {/* SCALES TAB */}
      {activeSubTab === 'scales' && (
        <div className="scales-section">
          <p className="settings-hint">
            Override default scale kinds and customize domains, ranges, padding, or color schemes.
          </p>

          <div className="scales-channels-list">
            {COMMON_CHANNELS.map((ch) => {
              const current = scales[ch];
              const scaleDef = current ? scaleByType(current.type) : null;

              return (
                <div key={ch} className="scale-channel-box">
                  <div className="scale-channel-header">
                    <span className="scale-channel-name">{ch} scale</span>
                    <select
                      className="opt-select scale-type-select"
                      value={current?.type || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          dispatch({ type: 'CLEAR_SCALE', channel: ch });
                        } else {
                          dispatch({
                            type: 'SET_SCALE_TYPE',
                            channel: ch,
                            scaleType: val as ScaleKind,
                          });
                        }
                      }}
                    >
                      <option value="">(automatic inference)</option>
                      {SCALES.map((s) => (
                        <option key={s.type} value={s.type}>
                          {s.label} ({s.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {current && scaleDef && (
                    <div className="scale-options-wrap">
                      {scaleDef.options.map((opt) => (
                        <OptionField
                          key={opt.name}
                          option={opt}
                          value={current.options[opt.name]}
                          onChange={(val) =>
                            dispatch({
                              type: 'SET_SCALE_OPTION',
                              channel: ch,
                              name: opt.name,
                              value: val,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LAYOUT & SIZING TAB */}
      {activeSubTab === 'layout' && (
        <div className="layout-section">
          <div className="opt-field">
            <span className="opt-name">Responsive Mode</span>
            <select
              className="opt-select"
              value={layout.responsive || 'scale'}
              onChange={(e) =>
                dispatch({
                  type: 'SET_LAYOUT_OPTION',
                  name: 'responsive',
                  value: e.target.value,
                })
              }
            >
              <option value="scale">scale (preserve aspect ratio viewBox)</option>
              <option value="reflow">reflow (responsive resize observer)</option>
              <option value="fixed">fixed (exact pixel dimensions)</option>
            </select>
          </div>

          <div className="layout-row">
            <div className="opt-field">
              <span className="opt-name">Design Width</span>
              <input
                type="number"
                className="opt-input"
                value={layout.width || 600}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'width',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="opt-field">
              <span className="opt-name">Design Height</span>
              <input
                type="number"
                className="opt-input"
                value={layout.height || 400}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'height',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Margins (px)
          </div>
          <div className="layout-grid-4">
            <div className="opt-field">
              <span className="opt-name">Top</span>
              <input
                type="number"
                className="opt-input"
                value={layout.marginTop ?? 20}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'marginTop',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="opt-field">
              <span className="opt-name">Right</span>
              <input
                type="number"
                className="opt-input"
                value={layout.marginRight ?? 20}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'marginRight',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="opt-field">
              <span className="opt-name">Bottom</span>
              <input
                type="number"
                className="opt-input"
                value={layout.marginBottom ?? 30}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'marginBottom',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="opt-field">
              <span className="opt-name">Left</span>
              <input
                type="number"
                className="opt-input"
                value={layout.marginLeft ?? 40}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LAYOUT_OPTION',
                    name: 'marginLeft',
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="settings-subhead" style={{ marginTop: '0.8rem' }}>
            Rendering & Projections
          </div>
          <div className="opt-field">
            <span className="opt-name">Renderer Engine</span>
            <select
              className="opt-select"
              value={layout.renderer || 'd3'}
              onChange={(e) =>
                dispatch({
                  type: 'SET_LAYOUT_OPTION',
                  name: 'renderer',
                  value: e.target.value,
                })
              }
            >
              <option value="d3">D3 SVG Renderer (Interactive vector nodes)</option>
              <option value="canvas">Canvas 2D Renderer (High-density graphics)</option>
            </select>
          </div>

          <div className="opt-field">
            <span className="opt-name">Geo Projection</span>
            <select
              className="opt-select"
              value={layout.projection || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_LAYOUT_OPTION',
                  name: 'projection',
                  value: e.target.value || undefined,
                })
              }
            >
              <option value="">None (Cartesian coordinates)</option>
              <option value="mercator">Mercator (Web maps & tile basemaps)</option>
              <option value="albers-usa">Albers USA (US Choropleths & territories)</option>
              <option value="equirectangular">Equirectangular (Global geographic)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
