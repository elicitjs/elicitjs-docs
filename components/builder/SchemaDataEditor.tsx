'use client';

import { useState, type Dispatch } from 'react';
import type { BuilderAction, BuilderState, MeasureType } from '../../lib/builder/types';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
};

const MEASURE_TYPES: MeasureType[] = ['quantitative', 'categorical', 'ordinal', 'temporal', 'geojson', 'ref'];

export function SchemaDataEditor({ state, dispatch }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'data' | 'lock'>('schema');
  const [csvInput, setCsvInput] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Quick generator helpers
  const handleGenerateNormal = () => {
    const rows = [
      { bin: '-3σ', count: 3 },
      { bin: '-2σ', count: 14 },
      { bin: '-1σ', count: 34 },
      { bin: 'μ', count: 50 },
      { bin: '+1σ', count: 34 },
      { bin: '+2σ', count: 14 },
      { bin: '+3σ', count: 3 },
    ];
    dispatch({ type: 'SET_DATA_JSON', json: JSON.stringify(rows, null, 2) });
  };

  const handleGenerateCategories = () => {
    const cats = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    const rows = cats.map((c) => ({
      category: c,
      value: Math.floor(Math.random() * 80) + 20,
    }));
    dispatch({ type: 'SET_DATA_JSON', json: JSON.stringify(rows, null, 2) });
  };

  const handleImportCsv = () => {
    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const row: Record<string, any> = {};
        headers.forEach((h, i) => {
          const num = Number(values[i]);
          row[h] = isNaN(num) ? values[i] : num;
        });
        return row;
      });
      dispatch({ type: 'SET_DATA_JSON', json: JSON.stringify(rows, null, 2) });
      setShowCsvModal(false);
      setCsvInput('');
    } catch {
      alert('Error parsing CSV format. Ensure standard comma-separated lines.');
    }
  };

  return (
    <div className="schema-data-panel">
      <div className="sub-tab-strip">
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'schema' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('schema')}
        >
          Schema Fields ({state.schema.length})
        </button>
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'data' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('data')}
        >
          Data Rows
        </button>
        <button
          type="button"
          className={`sub-tab${activeSubTab === 'lock' ? ' active' : ''}`}
          onClick={() => setActiveSubTab('lock')}
        >
          Baseline Lock
        </button>
      </div>

      {/* SCHEMA FIELDS TAB */}
      {activeSubTab === 'schema' && (
        <div className="schema-section">
          <div className="schema-header-row">
            <span className="col-name">Field</span>
            <span className="col-type">Type</span>
            <span className="col-domain">Domain Bounds / Categories</span>
          </div>

          <div className="schema-list">
            {state.schema.map((f) => (
              <div className="schema-row" key={f.id}>
                <input
                  type="text"
                  className="schema-name"
                  placeholder="field name"
                  value={f.name}
                  onChange={(e) =>
                    dispatch({ type: 'SET_SCHEMA_FIELD', id: f.id, patch: { name: e.target.value } })
                  }
                />
                <select
                  className="schema-type"
                  value={f.type}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SCHEMA_FIELD',
                      id: f.id,
                      patch: { type: e.target.value as MeasureType },
                    })
                  }
                >
                  {MEASURE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="schema-domain"
                  placeholder={
                    f.type === 'quantitative' || f.type === 'temporal' ? '0, 100' : 'A, B, C'
                  }
                  value={f.domain}
                  onChange={(e) =>
                    dispatch({ type: 'SET_SCHEMA_FIELD', id: f.id, patch: { domain: e.target.value } })
                  }
                />
                <button
                  type="button"
                  className="instance-remove"
                  onClick={() => dispatch({ type: 'REMOVE_SCHEMA_FIELD', id: f.id })}
                  title="Remove field"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add-schema-btn"
            onClick={() => dispatch({ type: 'ADD_SCHEMA_FIELD' })}
          >
            ＋ Add Schema Field
          </button>
        </div>
      )}

      {/* DATA JSON / CSV TAB */}
      {activeSubTab === 'data' && (
        <div className="data-section">
          <div className="data-generators-toolbar">
            <span className="toolbar-label">Quick Seed:</span>
            <button type="button" className="quick-gen-btn" onClick={handleGenerateNormal}>
              Normal Dist
            </button>
            <button type="button" className="quick-gen-btn" onClick={handleGenerateCategories}>
              Categories A-E
            </button>
            <button
              type="button"
              className="quick-gen-btn"
              onClick={() => setShowCsvModal(!showCsvModal)}
            >
              Paste CSV
            </button>
          </div>

          {showCsvModal && (
            <div className="csv-import-box">
              <span className="csv-title">Paste CSV data (with header row):</span>
              <textarea
                rows={4}
                className="csv-textarea"
                placeholder="category,value&#10;Alpha,35&#10;Beta,60"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
              />
              <div className="csv-btn-row">
                <button type="button" className="primary-btn" onClick={handleImportCsv}>
                  Import as JSON
                </button>
                <button type="button" className="reset-btn" onClick={() => setShowCsvModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <textarea
            className="data-json-editor"
            rows={12}
            value={state.dataJson}
            onChange={(e) => dispatch({ type: 'SET_DATA_JSON', json: e.target.value })}
            placeholder="[ { &quot;x&quot;: 10, &quot;y&quot;: 20 } ]"
          />
        </div>
      )}

      {/* BASELINE LOCK TAB */}
      {activeSubTab === 'lock' && (
        <div className="lock-section">
          <p className="settings-hint">
            Lock rows so respondents only edit elicited items while baseline ground truth stays read-only.
          </p>

          <div className="opt-field">
            <span className="opt-name">Lock Policy</span>
            <select
              className="opt-select"
              value={state.lock?.mode || 'none'}
              onChange={(e) =>
                dispatch({
                  type: 'SET_LOCK_OPTION',
                  name: 'mode',
                  value: e.target.value as 'none' | 'seed' | 'predicate',
                })
              }
            >
              <option value="none">None (all rows freely editable)</option>
              <option value="seed">lock: "seed" (lock all initial rows)</option>
              <option value="predicate">Predicate (lock rows matching expression)</option>
            </select>
          </div>

          {state.lock?.mode === 'predicate' && (
            <div className="predicate-box">
              <span className="opt-name">Predicate Function</span>
              <input
                type="text"
                className="opt-input"
                placeholder="d => d.kind === 'actual'"
                value={state.lock.predicateCode || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_LOCK_OPTION',
                    name: 'predicateCode',
                    value: e.target.value,
                  })
                }
              />
              <span className="predicate-hint">
                e.g. <code className="inline">d =&gt; d.type === &apos;actual&apos;</code> or{' '}
                <code className="inline">d =&gt; d.year &lt;= 2023</code>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
