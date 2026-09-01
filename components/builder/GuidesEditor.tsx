'use client';

import type { Dispatch } from 'react';
import type { BuilderAction, BuilderState, GuideInstance } from '../../lib/builder/types';
import { GUIDES, guideByType } from '../../lib/builder/guides.manifest';
import { OptionField } from './OptionField';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
};

export function GuidesEditor({ state, dispatch }: Props) {
  const guides = state.guides || [];

  return (
    <div className="guides-panel">
      <div className="section-header-row">
        <span className="settings-subhead">Reference Guides & Indicators</span>
        <select
          className="add-inline-select"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              dispatch({
                type: 'ADD_GUIDE',
                guideType: e.target.value as GuideInstance['type'],
              });
            }
          }}
        >
          <option value="">＋ Add Guide...</option>
          {GUIDES.map((g) => (
            <option key={g.type} value={g.type}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {guides.length === 0 ? (
        <p className="settings-hint">
          Guides are visual reference annotations (reference lines, shaded target regions, budget counters, proximity rings) positioned in data space.
        </p>
      ) : (
        <div className="instances-list">
          {guides.map((guide) => {
            const def = guideByType(guide.type);
            return (
              <div key={guide.id} className="instance-card">
                <div className="instance-head">
                  <code>guides.{guide.type}()</code>
                  <a
                    href={def.docHref}
                    target="_blank"
                    rel="noreferrer"
                    className="instance-docs"
                  >
                    docs ↗
                  </a>
                  <button
                    type="button"
                    className="instance-remove"
                    onClick={() => dispatch({ type: 'REMOVE_GUIDE', id: guide.id })}
                    title="Remove guide"
                  >
                    ×
                  </button>
                </div>

                {def.options.map((opt) => (
                  <OptionField
                    key={opt.name}
                    option={opt}
                    value={guide.options[opt.name]}
                    onChange={(val) =>
                      dispatch({
                        type: 'SET_GUIDE_OPTION',
                        id: guide.id,
                        name: opt.name,
                        value: val,
                      })
                    }
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
