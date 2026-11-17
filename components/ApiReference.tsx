'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { ApiEntry, ApiOption } from '../lib/types';
import { useSpecMode } from '../lib/specMode';
import { exprVariables, jsonForm, jsonType, signatureFor } from '../lib/jsonApi';
import type { JsonSignature } from '../lib/json-api.generated';
import { SpecTabs } from './SpecTabs';

/**
 * Long tables fold after FOLD_AT rows, but only when that hides at least
 * MIN_HIDDEN rows — folding away two rows saves nothing and costs a click.
 * Nothing is removed: folded rows stay in the DOM under hidden="until-found",
 * so the browser's find-in-page still reaches them and unfolds the table.
 */
const FOLD_AT = 10;
const MIN_HIDDEN = 5;

/** Defaults that mean "no default" — rendered as nothing rather than a dash. */
const EMPTY_DEFAULTS = new Set(['', '—', '-', '–']);

/**
 * Insert soft break opportunities into a code string so long union / function
 * types wrap at their seams (`a | b`, `{ x, y }`, `(ctx) => r`) instead of
 * forcing the column wide or breaking mid-identifier.
 */
function breakable(src: string): ReactNode {
  const parts = src.split(/(\|\s*|,\s*|=>\s*)/);
  if (parts.length === 1) return src;
  return parts.map((p, i) =>
    /^(\||,|=>)/.test(p) ? (
      <Fragment key={i}>
        {p}
        <wbr />
      </Fragment>
    ) : (
      p
    ),
  );
}

type Row = ApiOption & { expr?: string | null };

/** An option row as JSON: a function type becomes `{ expr } | { fn }`, with the expr's variables. */
function asJson(r: ApiOption, functions: Record<string, JsonSignature>): Row {
  const sig = signatureFor(r.name, functions);
  if (!sig) return r;
  return { ...r, type: jsonType(r.type, sig, r.name), expr: exprVariables(sig) };
}

function OptionsTable({
  label,
  nameCol,
  rows: given,
  withDefault,
  functions,
}: {
  label: string;
  nameCol: string;
  rows: ApiOption[];
  withDefault: boolean;
  /** In JSON mode, the options that take a function: their types become references. */
  functions: Record<string, JsonSignature> | null;
}) {
  const rows = functions ? given.map((r) => asJson(r, functions)) : given;
  const hasType = rows.some((r) => r.type != null);
  const hasDefault =
    withDefault && rows.some((r) => r.default != null && !EMPTY_DEFAULTS.has(r.default.trim()));
  const foldable = rows.length - FOLD_AT >= MIN_HIDDEN;
  const [open, setOpen] = useState(!foldable);
  const tableRef = useRef<HTMLTableElement>(null);
  const folded = foldable && !open;

  // React only emits boolean `hidden`; upgrade it to "until-found" so the
  // browser's find-in-page can still match (and reveal) folded rows.
  useLayoutEffect(() => {
    if (!folded) return;
    tableRef.current
      ?.querySelectorAll('[data-fold]')
      .forEach((el) => el.setAttribute('hidden', 'until-found'));
  }, [folded]);

  // Find-in-page hit inside a folded row → unfold the whole table.
  useEffect(() => {
    const el = tableRef.current;
    if (!el || !foldable) return;
    const onMatch = () => setOpen(true);
    el.addEventListener('beforematch', onMatch);
    return () => el.removeEventListener('beforematch', onMatch);
  }, [foldable]);

  // Unfold for print so a printed / PDF'd reference is complete.
  useEffect(() => {
    if (!foldable) return;
    const onPrint = () => setOpen(true);
    window.addEventListener('beforeprint', onPrint);
    return () => window.removeEventListener('beforeprint', onPrint);
  }, [foldable]);

  const collapse = () => {
    setOpen(false);
    const top = tableRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) tableRef.current?.scrollIntoView({ block: 'start' });
  };

  const noun = label === 'Channels' ? 'channels' : 'options';

  return (
    <>
      <div className="api-label">
        {label}
        {foldable ? <span className="api-label-count">{rows.length}</span> : null}
      </div>
      <div className="api-table-wrap">
        <table
          ref={tableRef}
          className={'api-table api-options' + (folded ? ' is-folded' : '')}
        >
          <thead>
            <tr>
              <th>{nameCol}</th>
              {hasType ? <th>{hasDefault ? 'Type · default' : 'Type'}</th> : null}
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: Row, i) => {
              const def =
                withDefault && r.default != null && !EMPTY_DEFAULTS.has(r.default.trim())
                  ? r.default
                  : null;
              const extra = foldable && i >= FOLD_AT;
              const fold = extra && folded ? { hidden: true, 'data-fold': '' } : {};
              return (
                <tr key={r.name} className={extra ? 'api-row-extra' : undefined}>
                  <td className="api-col-name">
                    <div {...fold}>
                      <code className="api-name">{breakable(r.name)}</code>
                    </div>
                  </td>
                  {hasType ? (
                    <td className="api-col-type">
                      <div {...fold}>
                        {r.type != null && !EMPTY_DEFAULTS.has(r.type.trim()) ? (
                          <code className="api-type">{breakable(r.type)}</code>
                        ) : null}
                        {def != null ? (
                          <span className="api-def-row">
                            <span className="api-def-label">default</span>
                            <code className="api-def">{breakable(def)}</code>
                          </span>
                        ) : null}
                        {r.expr ? (
                          <span className="api-def-row">
                            <span className="api-def-label">expr</span>
                            <code className="api-def">{breakable(r.expr)}</code>
                          </span>
                        ) : null}
                      </div>
                    </td>
                  ) : null}
                  <td className="api-col-desc">
                    <div {...fold}>{r.desc}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {foldable ? (
        <button
          type="button"
          className="api-fold-toggle"
          aria-expanded={open}
          onClick={() => (open ? collapse() : setOpen(true))}
        >
          {open
            ? `Show fewer ${noun}`
            : `Show all ${rows.length} ${noun} (${rows.length - FOLD_AT} more)`}
          <span className="api-fold-chevron" aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </button>
      ) : null}
    </>
  );
}

export function ApiReference({ entries }: { entries: ApiEntry[] }) {
  const mode = useSpecMode();
  if (!entries.length) return null;
  const hasJson = entries.some((e) => e.json !== undefined);
  return (
    <section id="api" className="api">
      <div className="api-head">
        <h2 className="section">API reference</h2>
        {hasJson ? <SpecTabs mode={mode} /> : null}
      </div>
      {entries.map((entry, i) => {
        const js = entry.signatures || (entry.signature ? [entry.signature] : []);
        const form = mode === 'json' && entry.json ? jsonForm(entry.json, js) : null;
        const sigs = form ? form.signatures : js;
        const functions = form ? form.functions : null;
        return (
          <div className="api-entry" key={entry.name ?? i}>
            {entry.name ? <h3 className="api-heading">{entry.name}</h3> : null}
            {entry.summary ? (
              <p className="api-summary">{entry.summary}</p>
            ) : null}
            {mode === 'json' && entry.json === false ? (
              <p className="api-json-note">No JSON form: this is called in JavaScript.</p>
            ) : null}
            {sigs.length ? (
              <pre className="code sig">
                <code>{sigs.join('\n')}</code>
              </pre>
            ) : null}
            {entry.options?.length ? (
              <OptionsTable
                label="Options"
                nameCol="Option"
                rows={entry.options}
                withDefault
                functions={functions}
              />
            ) : null}
            {entry.channels?.length ? (
              <OptionsTable
                label="Channels"
                nameCol="Channel"
                rows={entry.channels}
                withDefault={false}
                functions={null}
              />
            ) : null}
            {entry.returns ? (
              <>
                <div className="api-label">Returns / emits</div>
                <p className="api-returns">{entry.returns}</p>
              </>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
