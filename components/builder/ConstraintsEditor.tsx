'use client';

import type { Dispatch } from 'react';
import type { BuilderAction, BuilderState } from '../../lib/builder/types';
import { CONSTRAINTS, constraintByName } from '../../lib/builder/constraints.manifest';
import { OptionField } from './OptionField';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
};

export function ConstraintsEditor({ state, dispatch }: Props) {
  const constraints = state.constraints || [];

  return (
    <div className="constraints-panel">
      <div className="section-header-row">
        <span className="settings-subhead">Dataset Invariants</span>
        <select
          className="add-inline-select"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              dispatch({ type: 'ADD_CONSTRAINT', name: e.target.value });
            }
          }}
        >
          <option value="">＋ Add Constraint...</option>
          {CONSTRAINTS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.label}()
            </option>
          ))}
        </select>
      </div>

      {constraints.length === 0 ? (
        <p className="settings-hint">
          Spec-level constraints enforce mathematical invariants on the whole dataset (e.g. maintainSum totals, clamp boundaries, monotonic ordering, uniqueness).
        </p>
      ) : (
        <div className="instances-list">
          {constraints.map((c) => {
            const def = constraintByName(c.name);
            return (
              <div key={c.id} className="instance-card">
                <div className="instance-head">
                  <code>{c.name}()</code>
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
                    onClick={() => dispatch({ type: 'REMOVE_CONSTRAINT', id: c.id })}
                    title="Remove constraint"
                  >
                    ×
                  </button>
                </div>

                {def.options.map((opt) => (
                  <OptionField
                    key={opt.name}
                    option={opt}
                    value={c.options[opt.name]}
                    onChange={(val) =>
                      dispatch({
                        type: 'SET_CONSTRAINT_OPTION',
                        id: c.id,
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
