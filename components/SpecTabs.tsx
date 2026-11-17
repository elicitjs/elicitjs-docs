'use client';

import { setSpecMode, type SpecMode } from '../lib/specMode';

const SPEC_MODES: { mode: SpecMode; label: string }[] = [
  { mode: 'js', label: 'JavaScript' },
  { mode: 'json', label: 'JSON' },
];

/**
 * The JavaScript / JSON switch, on example cards and API references. One choice
 * for the whole site. Text only: the library's browser checks take a section's
 * first <svg> to be the chart.
 */
export function SpecTabs({ mode }: { mode: SpecMode }) {
  return (
    <div className="spec-tabs" role="tablist" aria-label="Spec format">
      {SPEC_MODES.map((m) => (
        <button
          key={m.mode}
          type="button"
          role="tab"
          aria-selected={mode === m.mode}
          className={`spec-tab${mode === m.mode ? ' active' : ''}`}
          onClick={() => setSpecMode(m.mode)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
