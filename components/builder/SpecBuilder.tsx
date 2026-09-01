'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { MarkLayers } from './MarkLayers';
import { MarkInspector } from './MarkInspector';
import { CanvasPreview } from './CanvasPreview';
import { SchemaDataEditor } from './SchemaDataEditor';
import { GuidesEditor } from './GuidesEditor';
import { ConstraintsEditor } from './ConstraintsEditor';
import { ScalesLayoutEditor } from './ScalesLayoutEditor';
import { ThemeEffectsEditor } from './ThemeEffectsEditor';
import { StarterPicker } from './StarterPicker';
import { ExportModal } from './ExportModal';
import { builderReducer, defaultStarter } from '../../lib/builder/state';
import { buildSpecCode } from '../../lib/builder/serialize';
import type { InstanceId, StarterTemplate } from '../../lib/builder/types';

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return v;
}

export function SpecBuilder() {
  const [state, dispatch] = useReducer(builderReducer, undefined, defaultStarter);
  const [activeMarkId, setActiveMarkId] = useState<InstanceId | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<
    'schema' | 'guides' | 'constraints' | 'scales' | 'theme'
  >('schema');
  const [showStarterModal, setShowStarterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Auto-select first mark if activeMarkId is null or removed
  const currentMarks = state.marks || [];
  const selectedMark =
    currentMarks.find((m) => m.id === activeMarkId) || currentMarks[0] || null;

  useEffect(() => {
    if (!selectedMark && currentMarks.length > 0) {
      setActiveMarkId(currentMarks[0].id);
    }
  }, [selectedMark, currentMarks]);

  const code = useMemo(() => buildSpecCode(state), [state]);
  const liveCode = useDebounced(code, 200);

  const handleLoadStarter = (starter: StarterTemplate) => {
    dispatch({ type: 'LOAD_STARTER', state: starter.state });
    if (starter.state.marks.length > 0) {
      setActiveMarkId(starter.state.marks[0].id);
    }
  };

  return (
    <div className="composition-studio">
      {/* Studio Header Toolbar */}
      <div className="studio-top-strip">
        <div className="studio-brand-group">
          <span className="studio-title">Composition Studio</span>
          <span className="studio-tag">Full Feature Suite</span>
        </div>

        <div className="studio-actions-group">
          <button
            type="button"
            className="starter-browse-btn"
            onClick={() => setShowStarterModal(true)}
          >
            📂 Load Starter Archetype...
          </button>
          <button
            type="button"
            className="export-trigger-btn"
            onClick={() => setShowExportModal(true)}
          >
            🚀 Export Spec...
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={() => dispatch({ type: 'RESET' })}
            title="Reset to default starter"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="studio-workspace-grid">
        {/* LEFT COLUMN: Layer Stack & Layer Inspector */}
        <section className="studio-column col-layers">
          <div className="column-card layer-stack-card">
            <div className="card-header">
              <span className="card-title">Mark Layers</span>
            </div>
            <div className="card-body">
              <MarkLayers
                state={state}
                dispatch={dispatch}
                activeMarkId={selectedMark?.id || null}
                onSelectMark={(id) => setActiveMarkId(id)}
              />
            </div>
          </div>

          <div className="column-card layer-inspector-card">
            <div className="card-header">
              <span className="card-title">
                {selectedMark ? `Layer: ${selectedMark.label}` : 'Mark Inspector'}
              </span>
            </div>
            <div className="card-body">
              {selectedMark ? (
                <MarkInspector state={state} dispatch={dispatch} mark={selectedMark} />
              ) : (
                <p className="settings-hint">Select or add a mark layer above to inspect.</p>
              )}
            </div>
          </div>
        </section>

        {/* CENTER COLUMN: Live Reactive Canvas Viewport */}
        <section className="studio-column col-canvas">
          <div className="column-card canvas-card">
            <CanvasPreview
              liveCode={liveCode}
              state={state}
              onOpenExport={() => setShowExportModal(true)}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: Schema, Guides, Invariants, Scales, Theme */}
        <section className="studio-column col-config">
          <div className="column-card config-card">
            <div className="config-tabs-nav">
              <button
                type="button"
                className={`config-tab-btn${rightPanelTab === 'schema' ? ' active' : ''}`}
                onClick={() => setRightPanelTab('schema')}
              >
                Schema & Data
              </button>
              <button
                type="button"
                className={`config-tab-btn${rightPanelTab === 'guides' ? ' active' : ''}`}
                onClick={() => setRightPanelTab('guides')}
              >
                Guides ({state.guides?.length || 0})
              </button>
              <button
                type="button"
                className={`config-tab-btn${rightPanelTab === 'constraints' ? ' active' : ''}`}
                onClick={() => setRightPanelTab('constraints')}
              >
                Invariants ({state.constraints?.length || 0})
              </button>
              <button
                type="button"
                className={`config-tab-btn${rightPanelTab === 'scales' ? ' active' : ''}`}
                onClick={() => setRightPanelTab('scales')}
              >
                Scales & Layout
              </button>
              <button
                type="button"
                className={`config-tab-btn${rightPanelTab === 'theme' ? ' active' : ''}`}
                onClick={() => setRightPanelTab('theme')}
              >
                Theme & Feedback
              </button>
            </div>

            <div className="config-tab-content">
              {rightPanelTab === 'schema' && (
                <SchemaDataEditor state={state} dispatch={dispatch} />
              )}
              {rightPanelTab === 'guides' && (
                <GuidesEditor state={state} dispatch={dispatch} />
              )}
              {rightPanelTab === 'constraints' && (
                <ConstraintsEditor state={state} dispatch={dispatch} />
              )}
              {rightPanelTab === 'scales' && (
                <ScalesLayoutEditor state={state} dispatch={dispatch} />
              )}
              {rightPanelTab === 'theme' && (
                <ThemeEffectsEditor state={state} dispatch={dispatch} />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Starter Templates Picker Modal */}
      <StarterPicker
        isOpen={showStarterModal}
        onClose={() => setShowStarterModal(false)}
        onSelectStarter={handleLoadStarter}
      />

      {/* Code Exporter Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        state={state}
      />
    </div>
  );
}
