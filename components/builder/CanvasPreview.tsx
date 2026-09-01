'use client';

import { useState } from 'react';
import { ExampleLive } from '../ExampleLive';
import type { BuilderState } from '../../lib/builder/types';

type Props = {
  liveCode: string;
  state: BuilderState;
  onOpenExport: () => void;
};

export function CanvasPreview({ liveCode, state, onOpenExport }: Props) {
  const [viewportWidth, setViewportWidth] = useState<'full' | 'tablet' | 'mobile'>('full');
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);

  const containerStyle = {
    maxWidth: viewportWidth === 'mobile' ? '420px' : viewportWidth === 'tablet' ? '740px' : '100%',
    margin: '0 auto',
    transition: 'max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div className="canvas-preview-wrapper">
      <div className="canvas-top-bar">
        <div className="viewport-toggles">
          <button
            type="button"
            className={`viewport-btn${viewportWidth === 'full' ? ' active' : ''}`}
            onClick={() => setViewportWidth('full')}
            title="Desktop Viewport (100%)"
          >
            🖥 Desktop
          </button>
          <button
            type="button"
            className={`viewport-btn${viewportWidth === 'tablet' ? ' active' : ''}`}
            onClick={() => setViewportWidth('tablet')}
            title="Tablet Viewport (740px)"
          >
            📱 Tablet
          </button>
          <button
            type="button"
            className={`viewport-btn${viewportWidth === 'mobile' ? ' active' : ''}`}
            onClick={() => setViewportWidth('mobile')}
            title="Mobile Viewport (420px)"
          >
            📱 Mobile
          </button>
        </div>

        <div className="canvas-actions">
          <button
            type="button"
            className={`canvas-action-btn${showCodeDrawer ? ' active' : ''}`}
            onClick={() => setShowCodeDrawer(!showCodeDrawer)}
          >
            {showCodeDrawer ? 'Hide Code' : '🔍 View Code'}
          </button>
          <button
            type="button"
            className="canvas-action-btn export-action-btn"
            onClick={onOpenExport}
          >
            🚀 Export...
          </button>
        </div>
      </div>

      <div className="canvas-stage-area">
        <div className="canvas-device-frame" style={containerStyle}>
          <ExampleLive
            key="canvas-live"
            code={liveCode}
            meta={{
              title: 'Live Elicitation Device',
              blurb: 'Fully reactive — all gesture edits, constraints, and guides update live.',
            }}
            codeMode="collapsed"
          />
        </div>
      </div>

      {showCodeDrawer && (
        <div className="canvas-code-drawer">
          <div className="drawer-header">
            <span>Generated Elicit Spec Code</span>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setShowCodeDrawer(false)}
            >
              ✕
            </button>
          </div>
          <pre className="drawer-code">
            <code>{liveCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
