'use client';

import { useState } from 'react';
import { STARTER_CATEGORIES, STARTER_TEMPLATES, starterById } from '../../lib/builder/starters.manifest';
import type { StarterTemplate } from '../../lib/builder/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectStarter: (starter: StarterTemplate) => void;
};

export function StarterPicker({ isOpen, onClose, onSelectStarter }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...STARTER_CATEGORIES];
  const filtered =
    selectedCategory === 'All'
      ? STARTER_TEMPLATES
      : STARTER_TEMPLATES.filter((s) => s.category === selectedCategory);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="starter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Elicitation Archetypes & Starters</h2>
            <p className="modal-subtitle">
              Choose a starter elicitation device to load into the visual composer.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="starter-categories-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`starter-category-pill${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="starter-cards-grid">
          {filtered.map((starter) => (
            <div
              key={starter.id}
              className="starter-card"
              onClick={() => {
                onSelectStarter(starter);
                onClose();
              }}
            >
              <div className="starter-card-header">
                <span className="starter-category-badge">{starter.category}</span>
                <span className="starter-marks-count">
                  {starter.state.marks.length} {starter.state.marks.length === 1 ? 'mark' : 'marks'}
                </span>
              </div>
              <h3 className="starter-card-title">{starter.title}</h3>
              <p className="starter-card-blurb">{starter.blurb}</p>
              {starter.tryHint && (
                <div className="starter-card-hint">
                  <b>Try:</b> {starter.tryHint}
                </div>
              )}
              <button type="button" className="starter-load-btn">
                Load this device →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
