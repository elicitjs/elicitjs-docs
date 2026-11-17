'use client';

import { useMemo, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { findFolds, type Fold } from '../lib/folds';

type Props = {
  code: string;
  language: 'jsx' | 'json';
  /** Class and style of the <pre>. */
  className?: string;
  style?: CSSProperties;
  /** Folds the reader opened, by first line. Kept by the caller to survive a remount. */
  open?: Set<number>;
  onOpenChange?: (open: Set<number>) => void;
  /** Called with the character offset a click landed on; the caller starts editing there. */
  onPick?: (offset: number) => void;
};

const plural = (n: number) => `${n} more row${n === 1 ? '' : 's'}`;

/**
 * Highlighted code whose `data` rows fold after the first (lib/folds.ts).
 * A fold opens and closes from its own line.
 */
export function FoldedCode({ code, language, className = '', style, open: given, onOpenChange, onPick }: Props) {
  const [own, setOwn] = useState<Set<number>>(() => new Set());
  const open = given ?? own;
  const setOpen = onOpenChange ?? setOwn;
  const folds = useMemo(() => findFolds(code), [code]);
  const lineStarts = useMemo(() => {
    const starts = [0];
    for (let i = 0; i < code.length; i++) if (code[i] === '\n') starts.push(i + 1);
    return starts;
  }, [code]);

  const foldOf = (line: number): Fold | undefined => folds.find((f) => line >= f.start && line <= f.end);
  const toggle = (fold: Fold) => {
    const next = new Set(open);
    if (next.has(fold.start)) next.delete(fold.start);
    else next.add(fold.start);
    setOpen(next);
  };
  const indent = (line: number) => code.slice(lineStarts[line]).match(/^[ \t]*/)?.[0] ?? '';

  /** The text position under a point. */
  const caretAt = (x: number, y: number): { node: Node; offset: number } | null => {
    const doc = document as Document & {
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
    };
    const position = doc.caretPositionFromPoint?.(x, y);
    if (position) return { node: position.offsetNode, offset: position.offset };
    const range = doc.caretRangeFromPoint?.(x, y);
    return range ? { node: range.startContainer, offset: range.startOffset } : null;
  };

  /** A click (not a drag that selects text) starts editing where it landed. */
  const pick = (e: MouseEvent<HTMLPreElement>) => {
    if (!onPick || (e.target as Element).closest('.code-fold')) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    const at = caretAt(e.clientX, e.clientY);
    const line = at && (at.node instanceof Element ? at.node : at.node.parentElement)?.closest<HTMLElement>('[data-line]');
    if (!at || !line) return onPick(code.length);
    const range = document.createRange();
    range.setStart(line, 0);
    range.setEnd(at.node, at.offset);
    onPick(lineStarts[Number(line.dataset.line)] + range.toString().length);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (onPick && e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      onPick(0);
    }
  };

  return (
    <Highlight theme={themes.nightOwl} code={code} language={language}>
      {({ className: highlight, style: plain, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} ${highlight}`}
          style={{ ...plain, ...style }}
          onClick={onPick ? pick : undefined}
          onKeyDown={onPick ? onKeyDown : undefined}
          tabIndex={onPick ? 0 : undefined}
          aria-label={onPick ? 'Code. Click or press Enter to edit.' : undefined}
        >
          {tokens.map((line, i) => {
            const fold = foldOf(i);
            const closed = fold && !open.has(fold.start);
            if (fold && closed) {
              if (i !== fold.start) return null;
              return (
                <button key={i} type="button" className="code-fold" onClick={() => toggle(fold)}>
                  {indent(i)}… {plural(fold.rows)}
                </button>
              );
            }
            const row = (
              <div key={i} {...getLineProps({ line })} data-line={i}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            );
            if (!fold || i !== fold.end) return row;
            return [
              row,
              <button key={`${i}-hide`} type="button" className="code-fold" onClick={() => toggle(fold)}>
                {indent(i)}Hide {fold.rows} row{fold.rows === 1 ? '' : 's'}
              </button>,
            ];
          })}
        </pre>
      )}
    </Highlight>
  );
}
