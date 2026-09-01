'use client';

import { useState, type Dispatch } from 'react';
import type { ApiOption } from '../../lib/types';
import type { BuilderAction, BuilderState, ChannelBinding, InstanceId, MarkInstance, OptionValue } from '../../lib/builder/types';
import { markByFamily } from '../../lib/builder/marks.manifest';
import { ALL_EDITS, editByCallPath } from '../../lib/builder/edits.manifest';
import { isFormOption } from '../../lib/builder/controlKind';
import { OptionField } from './OptionField';

const STYLE_OPTIONS: ApiOption[] = [
  { name: 'fill', type: 'string', default: "'steelblue'", desc: 'Fill colour.' },
  { name: 'stroke', type: 'string', default: '—', desc: 'Stroke colour.' },
  { name: 'strokeWidth', type: 'number', default: '1', desc: 'Stroke width in px.' },
  { name: 'opacity', type: 'number', default: '1', desc: 'Fill opacity (0–1).' },
  { name: 'size', type: 'number', default: '—', desc: 'Radius or size in px.' },
];

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
  mark: MarkInstance;
};

export function MarkInspector({ state, dispatch, mark }: Props) {
  const [activeTab, setActiveTab] = useState<'channels' | 'options' | 'edits' | 'style'>('channels');
  const entry = markByFamily(mark.family);

  const seen = new Set<string>(['orientation']);
  const uniqueMarkOptions = entry.api
    .flatMap((e) => e.options || [])
    .filter(isFormOption)
    .filter((o) => (seen.has(o.name) ? false : (seen.add(o.name), true)));

  const handleChannelFieldChange = (channel: string, field: string) => {
    const current = mark.channels[channel];
    dispatch({
      type: 'SET_CHANNEL',
      id: mark.id,
      channel,
      binding: { ...(current || {}), field, isField: true },
    });
  };

  const handleChannelValueChange = (channel: string, value: OptionValue) => {
    const current = mark.channels[channel];
    dispatch({
      type: 'SET_CHANNEL',
      id: mark.id,
      channel,
      binding: { ...(current || {}), value, isField: false },
    });
  };

  return (
    <div className="inspector-panel">
      <div className="inspector-header">
        <div className="inspector-title-row">
          <input
            type="text"
            className="inspector-label-input"
            value={mark.label}
            onChange={(e) =>
              dispatch({ type: 'SET_MARK_LABEL', id: mark.id, label: e.target.value })
            }
          />
          <a
            href={entry.docHref}
            target="_blank"
            rel="noreferrer"
            className="inspector-doc-link"
            title="Read API docs"
          >
            {entry.label} Docs ↗
          </a>
        </div>

        {(entry.factoryNames.x || entry.factoryNames.y) && (
          <div className="opt-field orientation-row">
            <span className="opt-name">Orientation</span>
            <select
              className="opt-select"
              value={mark.orientation}
              onChange={(e) =>
                dispatch({
                  type: 'SET_ORIENTATION',
                  id: mark.id,
                  orientation: e.target.value as 'auto' | 'x' | 'y',
                })
              }
            >
              <option value="auto">auto ({entry.factoryNames.auto})</option>
              {entry.factoryNames.x && <option value="x">horizontal ({entry.factoryNames.x})</option>}
              {entry.factoryNames.y && <option value="y">vertical ({entry.factoryNames.y})</option>}
            </select>
          </div>
        )}

        <div className="inspector-tabs">
          <button
            type="button"
            className={`inspector-tab${activeTab === 'channels' ? ' active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            Channels ({entry.channels.length})
          </button>
          <button
            type="button"
            className={`inspector-tab${activeTab === 'edits' ? ' active' : ''}`}
            onClick={() => setActiveTab('edits')}
          >
            Edits ({mark.edits.length})
          </button>
          {uniqueMarkOptions.length > 0 && (
            <button
              type="button"
              className={`inspector-tab${activeTab === 'options' ? ' active' : ''}`}
              onClick={() => setActiveTab('options')}
            >
              Options
            </button>
          )}
          <button
            type="button"
            className={`inspector-tab${activeTab === 'style' ? ' active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>
      </div>

      <div className="inspector-body">
        {/* CHANNELS TAB */}
        {activeTab === 'channels' && (
          <div className="channels-section">
            {entry.channels.map((ch) => {
              const currentBinding: ChannelBinding = mark.channels[ch] || {
                isField: true,
                field: ch,
              };
              const isField = currentBinding.isField !== false;
              const attachedEdit = currentBinding.edit;
              const editDef = attachedEdit ? editByCallPath(attachedEdit.name) : null;

              return (
                <div key={ch} className="channel-row">
                  <div className="channel-label-wrap">
                    <span className="channel-name">{ch}</span>
                    <div className="channel-mode-toggle">
                      <button
                        type="button"
                        className={`channel-mode-btn${isField ? ' active' : ''}`}
                        onClick={() =>
                          dispatch({
                            type: 'SET_CHANNEL',
                            id: mark.id,
                            channel: ch,
                            binding: { ...currentBinding, isField: true },
                          })
                        }
                      >
                        Field
                      </button>
                      <button
                        type="button"
                        className={`channel-mode-btn${!isField ? ' active' : ''}`}
                        onClick={() =>
                          dispatch({
                            type: 'SET_CHANNEL',
                            id: mark.id,
                            channel: ch,
                            binding: { ...currentBinding, isField: false },
                          })
                        }
                      >
                        Constant
                      </button>
                    </div>
                  </div>

                  {isField ? (
                    <div className="opt-field">
                      <span className="opt-name" style={{ fontSize: '0.72rem' }}>
                        Field:
                      </span>
                      <select
                        className="opt-select"
                        value={currentBinding.field || ''}
                        onChange={(e) => handleChannelFieldChange(ch, e.target.value)}
                      >
                        <option value="">(unassigned)</option>
                        {state.schema.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name} ({f.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="opt-field">
                      <span className="opt-name" style={{ fontSize: '0.72rem' }}>
                        Value:
                      </span>
                      <input
                        type="text"
                        className="opt-input"
                        placeholder="constant value"
                        value={
                          typeof currentBinding.value === 'string' ||
                          typeof currentBinding.value === 'number'
                            ? currentBinding.value
                            : ''
                        }
                        onChange={(e) => handleChannelValueChange(ch, e.target.value)}
                      />
                    </div>
                  )}

                  {/* Channel Edit Attachment */}
                  {isField && (
                    <div className="channel-edit-section">
                      <div className="opt-field">
                        <span className="opt-name" style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>
                          Gesture:
                        </span>
                        <select
                          className="opt-select"
                          value={attachedEdit?.name || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) {
                              dispatch({
                                type: 'REMOVE_CHANNEL_EDIT',
                                markId: mark.id,
                                channel: ch,
                              });
                            } else {
                              dispatch({
                                type: 'SET_CHANNEL_EDIT',
                                markId: mark.id,
                                channel: ch,
                                editName: val,
                              });
                            }
                          }}
                        >
                          <option value="">(no gesture on this channel)</option>
                          <option value="move">move() — Drag / Sweep value</option>
                          <option value="slide">slide() — Linear slide</option>
                          <option value="rotate">rotate() — Radial angle drag</option>
                          <option value="resize">resize() — Radius / size drag</option>
                          <option value="cycle">cycle() — Step through discrete categories</option>
                          <option value="brushSpan">brushSpan() — 1D interval brush</option>
                          <option value="edit.waffle.fill">edit.waffle.fill() — Grid unit fill</option>
                          <option value="edit.trend.intercept">edit.trend.intercept() — Trend intercept</option>
                          <option value="edit.trend.slope">edit.trend.slope() — Trend slope</option>
                          <option value="edit.trend.interceptSpread">edit.trend.interceptSpread() — Spread</option>
                          <option value="edit.trend.slopeSpread">edit.trend.slopeSpread() — Fan angle</option>
                        </select>
                      </div>

                      {attachedEdit && editDef && (
                        <div className="channel-edit-options">
                          {editDef.options.map((opt) => (
                            <OptionField
                              key={opt.name}
                              option={opt}
                              value={attachedEdit.options[opt.name]}
                              onChange={(val) =>
                                dispatch({
                                  type: 'SET_CHANNEL_EDIT_OPTION',
                                  markId: mark.id,
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
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* OPTIONS TAB */}
        {activeTab === 'options' && (
          <div className="options-section">
            {uniqueMarkOptions.map((opt) => (
              <OptionField
                key={opt.name}
                option={opt}
                value={mark.options[opt.name]}
                onChange={(val) =>
                  dispatch({
                    type: 'SET_MARK_OPTION',
                    id: mark.id,
                    name: opt.name,
                    value: val,
                  })
                }
              />
            ))}
          </div>
        )}

        {/* EDITS TAB */}
        {activeTab === 'edits' && (
          <div className="edits-section">
            <div className="section-header-row">
              <span className="settings-subhead">Mark-Level Gestures</span>
              <select
                className="add-inline-select"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    dispatch({
                      type: 'ADD_MARK_EDIT',
                      markId: mark.id,
                      name: e.target.value,
                    });
                  }
                }}
              >
                <option value="">＋ Add Mark Edit...</option>
                {ALL_EDITS.map((ed) => (
                  <option key={ed.callPath} value={ed.callPath}>
                    {ed.callPath} ({ed.category})
                  </option>
                ))}
              </select>
            </div>

            {mark.edits.length === 0 ? (
              <p className="settings-hint">
                No mark-level edits attached. Channel-level gestures (e.g. <code>move()</code> on <code>y</code>) can be attached directly under the <b>Channels</b> tab.
              </p>
            ) : (
              <div className="instances-list">
                {mark.edits.map((e) => {
                  const def = editByCallPath(e.name);
                  return (
                    <div key={e.id} className="instance-card">
                      <div className="instance-head">
                        <code>{e.name}()</code>
                        {def?.docHref && (
                          <a
                            href={def.docHref}
                            target="_blank"
                            rel="noreferrer"
                            className="instance-docs"
                          >
                            Docs ↗
                          </a>
                        )}
                        <button
                          type="button"
                          className="instance-remove"
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_MARK_EDIT',
                              markId: mark.id,
                              editId: e.id,
                            })
                          }
                          title="Remove edit"
                        >
                          ✕
                        </button>
                      </div>
                      {def?.options && def.options.length > 0 && (
                        <div className="instance-options">
                          {def.options.map((opt) => (
                            <OptionField
                              key={opt.name}
                              option={opt}
                              value={e.options[opt.name]}
                              onChange={(val) =>
                                dispatch({
                                  type: 'SET_MARK_EDIT_OPTION',
                                  markId: mark.id,
                                  editId: e.id,
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
            )}
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === 'style' && (
          <div className="style-section">
            {STYLE_OPTIONS.map((opt) => (
              <OptionField
                key={opt.name}
                option={opt}
                value={mark.style[opt.name]}
                onChange={(val) =>
                  dispatch({
                    type: 'SET_STYLE',
                    id: mark.id,
                    name: opt.name,
                    value: val,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
