'use client';

import { useState } from 'react';
import type { BuilderState } from '../../lib/builder/types';
import {
  buildSpecCode,
  buildStandaloneHtml,
  buildReactComponentCode,
} from '../../lib/builder/serialize';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  state: BuilderState;
};

type ExportFormat = 'spec' | 'react' | 'html' | 'json';

export function ExportModal({ isOpen, onClose, state }: Props) {
  const [format, setFormat] = useState<ExportFormat>('spec');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let codeText = '';
  if (format === 'spec') {
    codeText = buildSpecCode(state);
  } else if (format === 'react') {
    codeText = buildReactComponentCode(state);
  } else if (format === 'html') {
    codeText = buildStandaloneHtml(state);
  } else if (format === 'json') {
    codeText = JSON.stringify(state, null, 2);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const ext = format === 'html' ? 'html' : format === 'json' ? 'json' : format === 'react' ? 'tsx' : 'js';
    const blob = new Blob([codeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elicit-device.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Export Elicitation Device</h2>
            <p className="modal-subtitle">
              Embed into your application, web survey, or experiment pipeline.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="export-format-tabs">
          <button
            type="button"
            className={`export-tab${format === 'spec' ? ' active' : ''}`}
            onClick={() => setFormat('spec')}
          >
            Elicit JS Spec
          </button>
          <button
            type="button"
            className={`export-tab${format === 'react' ? ' active' : ''}`}
            onClick={() => setFormat('react')}
          >
            React Component
          </button>
          <button
            type="button"
            className={`export-tab${format === 'html' ? ' active' : ''}`}
            onClick={() => setFormat('html')}
          >
            Standalone HTML
          </button>
          <button
            type="button"
            className={`export-tab${format === 'json' ? ' active' : ''}`}
            onClick={() => setFormat('json')}
          >
            JSON Schema
          </button>
        </div>

        <div className="export-code-container">
          <pre className="export-code-block">
            <code>{codeText}</code>
          </pre>
        </div>

        <div className="export-actions-row">
          <button type="button" className="primary-btn" onClick={handleCopy}>
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Code'}
          </button>
          <button type="button" className="secondary-btn" onClick={handleDownload}>
            ⬇ Download File
          </button>
          <button type="button" className="reset-btn" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
