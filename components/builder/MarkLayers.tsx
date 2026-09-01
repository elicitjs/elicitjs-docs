'use client';

import { useState, type Dispatch } from 'react';
import { MARKS, MARK_CATEGORIES } from '../../lib/builder/marks.manifest';
import type { BuilderAction, BuilderState, InstanceId, MarkFamilyId } from '../../lib/builder/types';

type Props = {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
  activeMarkId: InstanceId | null;
  onSelectMark: (id: InstanceId) => void;
};

export function MarkLayers({ state, dispatch, activeMarkId, onSelectMark }: Props) {
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(MARK_CATEGORIES[0]);

  const activeMarks = state.marks || [];

  const handleAddMark = (family: MarkFamilyId) => {
    dispatch({ type: 'ADD_MARK', family });
    setShowCatalog(false);
  };

  return (
    <div className="layers-stack">
      <div className="layers-toolbar">
        <span className="layers-count">
          {activeMarks.length} {activeMarks.length === 1 ? 'Layer' : 'Layers'}
        </span>
        <button
          type="button"
          className="add-layer-btn"
          onClick={() => setShowCatalog(!showCatalog)}
        >
          {showCatalog ? '✕ Close' : '＋ Add Mark'}
        </button>
      </div>

      {showCatalog && (
        <div className="mark-catalog-popup">
          <div className="catalog-tabs">
            {MARK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`catalog-tab${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="catalog-grid">
            {MARKS.filter((m) => m.category === selectedCategory).map((m) => (
              <button
                key={m.family}
                type="button"
                className="catalog-item"
                onClick={() => handleAddMark(m.family)}
              >
                <span className="catalog-item-name">{m.label}</span>
                <span className="catalog-item-fn">{m.factoryNames.auto}()</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="layers-list">
        {activeMarks.length === 0 ? (
          <div className="layers-empty">
            <p>No mark layers in composition.</p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => handleAddMark('bar')}
            >
              ＋ Add a Bar Mark
            </button>
          </div>
        ) : (
          activeMarks.map((mark, index) => {
            const isActive = mark.id === activeMarkId;
            return (
              <div
                key={mark.id}
                className={`layer-card${isActive ? ' active' : ''}${!mark.enabled ? ' disabled' : ''}`}
                onClick={() => onSelectMark(mark.id)}
              >
                <div className="layer-header">
                  <button
                    type="button"
                    className="layer-toggle"
                    title={mark.enabled ? 'Hide mark' : 'Show mark'}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_MARK', id: mark.id });
                    }}
                  >
                    {mark.enabled ? '👁' : '🚫'}
                  </button>

                  <div className="layer-info">
                    <span className="layer-title">{mark.label}</span>
                    <span className="layer-badge">{mark.family}</span>
                  </div>

                  <div className="layer-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      className="layer-btn-icon"
                      title="Move layer up"
                      onClick={() =>
                        dispatch({
                          type: 'REORDER_MARK',
                          sourceIndex: index,
                          targetIndex: index - 1,
                        })
                      }
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === activeMarks.length - 1}
                      className="layer-btn-icon"
                      title="Move layer down"
                      onClick={() =>
                        dispatch({
                          type: 'REORDER_MARK',
                          sourceIndex: index,
                          targetIndex: index + 1,
                        })
                      }
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      className="layer-btn-icon"
                      title="Duplicate layer"
                      onClick={() => dispatch({ type: 'DUPLICATE_MARK', id: mark.id })}
                    >
                      ⧉
                    </button>
                    <button
                      type="button"
                      className="layer-btn-icon layer-btn-delete"
                      title="Delete layer"
                      onClick={() => dispatch({ type: 'REMOVE_MARK', id: mark.id })}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
