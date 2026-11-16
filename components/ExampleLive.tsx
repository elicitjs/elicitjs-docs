'use client';

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Editor } from 'react-live';
import { Button } from '@/components/ui/button';
import type { CodeMode, ExampleMeta, Prose } from '../lib/types';
import { createElicitScope } from '../lib/elicitScope';
import { chartThemeFor, currentChartMode, useChartMode } from '../lib/chartTheme';

const EVAL_DEBOUNCE_MS = 280;

const EDITOR_STYLE_BASE: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12.5,
};

function esc(c: string) {
  return c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtValue(v: unknown): string {
  if (v == null) return `<span class="key">${v}</span>`;
  if (typeof v === 'number') {
    return `<span class="num">${Number.isInteger(v) ? v : v.toFixed(2)}</span>`;
  }
  if (v instanceof Date) {
    return `<span class="str">${v.toISOString().slice(0, 10)}</span>`;
  }
  if (typeof v === 'string') return `<span class="str">"${esc(v)}"</span>`;
  return `<span class="num">${esc(JSON.stringify(v))}</span>`;
}

function fmtRow(d: Record<string, unknown>, i: number, pad: number) {
  return (
    `<span class="idx">${String(i).padStart(pad, ' ')}</span>  { ` +
    Object.entries(d)
      .map(([k, v]) => `<span class="key">${esc(k)}:</span> ${fmtValue(v)}`)
      .join(', ') +
    ' }'
  );
}

type Rows = Record<string, unknown>[];
type ElicitData = Rows | Record<string, Rows>;

/** What `Elicit(spec)` and `dataset.chart(spec)` return: a chart, whose node is `dom()`. */
type ElicitChart = {
  dom: () => HTMLElement;
  getData: () => ElicitData;
  on: (ev: string, cb: () => void) => () => void;
  destroy: () => void;
};

const isChart = (x: unknown): x is ElicitChart =>
  x != null && typeof x === 'object' && typeof (x as ElicitChart).dom === 'function';

/**
 * `getData()` is shaped like the spec's `data`: a bare array for a single-table
 * chart, one array per table name for a multi-table structure (see marks/network).
 * Normalise both to named groups; a single-table chart's group has no name, so it
 * renders exactly as it always has.
 */
function dataGroups(data: ElicitData): { name: string | null; rows: Rows }[] {
  if (Array.isArray(data)) return [{ name: null, rows: data }];
  return Object.entries(data ?? {}).map(([name, rows]) => ({
    name,
    rows: Array.isArray(rows) ? rows : [],
  }));
}

function fmtGroup(group: { name: string | null; rows: Rows }) {
  const pad = String(Math.max(group.rows.length - 1, 0)).length;
  const body = group.rows.length
    ? group.rows.map((d, i) => fmtRow(d, i, pad)).join('\n')
    : '<span class="empty">no rows</span>';
  return group.name === null
    ? body
    : `<span class="tbl">${esc(group.name)}</span>\n${body}`;
}

function DataPanel({ chart }: { chart: ElicitChart | null }) {
  const [html, setHtml] = useState('<span class="empty">no rows</span>');
  const [count, setCount] = useState('0 rows');

  useEffect(() => {
    if (!chart) return;
    const render = () => {
      try {
        const groups = dataGroups(chart.getData());
        setCount(
          groups.length === 1 && groups[0].name === null
            ? groups[0].rows.length === 1
              ? '1 row'
              : `${groups[0].rows.length} rows`
            : groups.map((g) => `${g.name} ${g.rows.length}`).join(' · ')
        );
        setHtml(groups.map(fmtGroup).join('\n\n'));
      } catch {
        setHtml('<span class="empty">unavailable</span>');
      }
    };
    const unsub = chart.on('change', render);
    render();
    return unsub;
  }, [chart]);

  if (!chart) return null;
  return (
    <div className="data">
      <div className="data-head">
        <span>getData()</span>
        <span className="data-count">{count}</span>
      </div>
      <pre className="data-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function destroyAll(charts: ElicitChart[]) {
  for (const c of charts) c.destroy();
}

/**
 * `Try: …` affordance under a chart. The hint is JSX so it keeps its own markup
 * — `.try b` in docs.css colours a <b> specifically.
 */
function TryHint({ hint }: { hint: Prose }) {
  return <span className="try">Try: {hint}</span>;
}

function formatEvalError(err: unknown): string {
  if (err instanceof SyntaxError) return `Syntax error: ${err.message}`;
  if (err instanceof Error) return err.message;
  return String(err);
}

/** Coerce imported chart body to a plain string; strip dev HMR preamble/suffix if present. */
function normalizeExampleCode(code: unknown): string {
  const raw =
    typeof code === 'string'
      ? code
      : code != null &&
          typeof code === 'object' &&
          'default' in code &&
          typeof (code as { default: unknown }).default === 'string'
        ? (code as { default: string }).default
        : String(code ?? '');

  if (!raw.includes('import.meta') && !raw.includes('__webpack')) return raw;

  // Dev bundles sometimes wrap the chart body in a hot-reload IIFE — keep only the harness script.
  const cut =
    raw.search(/\n\s*import\.meta\b/) >= 0
      ? raw.search(/\n\s*import\.meta\b/)
      : raw.search(/\n\s*__webpack/) >= 0
        ? raw.search(/\n\s*__webpack/)
        : raw.search(/\$RefreshHelpers\$/) >= 0
          ? raw.search(/\$RefreshHelpers\$/)
          : -1;
  if (cut >= 0) return raw.slice(0, cut).trimEnd();

  const mountIdx = raw.search(/\bmount\s*\(/);
  if (mountIdx > 0) return raw.slice(mountIdx).trimEnd();

  return raw;
}

/**
 * Isolated from chart/error state so parent re-renders (after debounce eval)
 * do not remount the editor and jump the caret.
 */
const CodePane = memo(function CodePane({
  source,
  tall,
  onDraftChange,
}: {
  source: string;
  tall?: boolean;
  onDraftChange: (value: string) => void;
}) {
  const [value, setValue] = useState(source);
  const style = useMemo(
    () => ({
      ...EDITOR_STYLE_BASE,
      minHeight: tall ? 420 : 200,
    }),
    [tall]
  );

  // Remount when `source` identity changes (Reset / new preset) via key on parent.
  useEffect(() => {
    setValue(source);
  }, [source]);

  return (
    <Editor
      className="live-editor"
      code={value}
      language="jsx"
      theme={themes.nightOwl}
      onChange={(next) => {
        setValue(next);
        onDraftChange(next);
      }}
      style={style}
    />
  );
});

const ReadOnlyCode = memo(function ReadOnlyCode({ code }: { code: string }) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trimEnd()} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`readonly-code ${className}`} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
});

type Props = {
  code: string;
  meta: ExampleMeta;
  /** Wider editor (playground). */
  tall?: boolean;
  /** How to present the source. Default: editable. */
  codeMode?: CodeMode;
};

/**
 * Live example: harness-style `mount(chart.dom())` eval with chart + getData panel.
 * `mount` takes a DOM node; the first chart mounted feeds the panel.
 * `codeMode` controls whether source is editable, always-visible read-only, or
 * collapsed behind a toggle (intro gallery).
 */
export function ExampleLive({
  code: initialCode,
  meta,
  tall,
  codeMode = 'editable',
}: Props) {
  const baseCode = useMemo(() => normalizeExampleCode(initialCode), [initialCode]);
  const [source, setSource] = useState(baseCode);
  const [evalCode, setEvalCode] = useState(baseCode);
  const [editorKey, setEditorKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [elicited, setElicited] = useState<ElicitChart | null>(null);
  const [fluid, setFluid] = useState(false);
  const [resultWidth, setResultWidth] = useState<string | undefined>();
  const [codeOpen, setCodeOpen] = useState(codeMode === 'readonly');
  const chartRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<ElicitChart[]>([]);
  const debounceRef = useRef<number | null>(null);
  const scope = useMemo(() => createElicitScope(), []);
  // Charts follow the docs' light/dark mode: a mode switch re-runs the example.
  const chartMode = useChartMode();

  const isEditable = codeMode === 'editable';
  const isVisual = codeMode === 'collapsed' || codeMode === 'readonly';
  const showCode = isEditable || codeMode === 'readonly' || codeOpen;

  useEffect(() => {
    setSource(baseCode);
    setEvalCode(baseCode);
    setEditorKey((k) => k + 1);
  }, [baseCode]);

  // Keep the code-open state tied to `codeMode` alone. A reactive parent (the
  // Build dashboard) feeds a fresh `code` on every form change; folding this
  // into the effect above would slam the "Show code" panel shut mid-edit.
  useEffect(() => {
    setCodeOpen(codeMode === 'readonly');
  }, [codeMode]);

  const onDraftChange = useCallback((value: string) => {
    if (debounceRef.current != null) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setEvalCode(value);
      debounceRef.current = null;
    }, EVAL_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current != null) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (debounceRef.current != null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSource(baseCode);
    setEvalCode(baseCode);
    setEditorKey((k) => k + 1);
  }, [baseCode]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    let cancelled = false;

    destroyAll(activeRef.current);
    activeRef.current = [];
    chart.replaceChildren();
    setElicited(null);
    setFluid(false);
    setResultWidth(undefined);

    // Every chart the example builds is recorded here, through `Elicit` and
    // `ds.chart`, so a re-run destroys it. Its node carries it as `__chart`, so
    // browser checks can reach the chart.
    const created: ElicitChart[] = [];
    const patched = new WeakSet<object>();
    type Ds = { chart: (spec: unknown) => ElicitChart };
    const track = (c: ElicitChart) => {
      (c.dom() as HTMLElement & { __chart?: ElicitChart }).__chart = c;
      created.push(c);
      patch((c as unknown as { dataset?: Ds }).dataset);
      return c;
    };
    const patch = (ds: Ds | undefined) => {
      if (!ds || patched.has(ds)) return;
      patched.add(ds);
      const make = ds.chart;
      ds.chart = (spec) => track(make(spec));
    };
    const RealElicit = scope.Elicit as unknown as ((spec: unknown) => ElicitChart) & {
      dataset: (spec: unknown) => Ds;
    };
    const Elicit = Object.assign((spec: unknown) => track(RealElicit(spec)), RealElicit, {
      dataset: (spec: unknown) => {
        const ds = RealElicit.dataset(spec);
        patch(ds);
        return ds;
      },
    });

    // `mount` appends a node, like `parent.append`. A chart is mounted as
    // `chart.dom()`; the first one mounted feeds the data panel.
    const mounted: ElicitChart[] = [];
    const mount = <T,>(node: T): T => {
      if (isChart(node)) {
        throw new Error('mount() takes a DOM node. Pass chart.dom().');
      }
      chart.appendChild(node as unknown as Node);
      const owner = created.find((c) => c.dom() === (node as unknown));
      if (owner) mounted.push(owner);
      return node;
    };

    try {
      // The app-wide chart theme for the docs' current mode. Read from the DOM,
      // not `chartMode`, so the first render after hydration is already right.
      // Set on every eval, so an example that calls `setTheme()` never leaks.
      scope.setTheme(chartThemeFor(currentChartMode()) as Parameters<typeof scope.setTheme>[0]);
      const names = Object.keys(scope);
      const vals = names.map((n) => (n === 'Elicit' ? Elicit : scope[n as keyof typeof scope]));
      // eslint-disable-next-line no-new-func
      const run = new Function(...names, 'mount', evalCode);
      run(...vals, mount);
      if (cancelled) {
        destroyAll(created);
        chart.replaceChildren();
        return;
      }
      activeRef.current = created;
      const first = mounted[0] ?? null;
      setError(null);
      setElicited(first);
      if (first) {
        const width = first.dom().style.width;
        if (width && width.endsWith('px')) {
          setResultWidth(width);
        } else {
          setFluid(true);
        }
      }
    } catch (err) {
      if (cancelled) return;
      destroyAll(created);
      chart.replaceChildren();
      activeRef.current = [];
      setElicited(null);
      setError(formatEvalError(err));
    }

    return () => {
      cancelled = true;
      destroyAll(activeRef.current);
      activeRef.current = [];
    };
  }, [evalCode, scope, chartMode]);

  const cardClass = [
    'card',
    tall ? 'card-tall' : '',
    isVisual ? 'card-visual' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
      {/* No icons in the card's buttons: the library's browser gate selects a
          section's FIRST <svg> (`#edit svg`), which must be the chart's. */}
      <div className="card-head">
        <div>
          <h3>{meta.title}</h3>
          {meta.blurb ? <p>{meta.blurb}</p> : null}
        </div>
        <div className="card-actions">
          {codeMode === 'collapsed' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCodeOpen((o) => !o)}
              title={codeOpen ? 'Hide the source' : 'Show the source'}
            >
              {codeOpen ? 'Hide code' : 'Show code'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            title="Restore the default example"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className={`body${isVisual ? ' body-visual' : ''}`}>
        {showCode && isEditable ? (
          <div className={`code-wrap${tall ? ' tall' : ''}`}>
            <CodePane
              key={editorKey}
              source={source}
              tall={tall}
              onDraftChange={onDraftChange}
            />
          </div>
        ) : null}
        {isVisual ? (
          <div className="visual-row">
            <div
              className={`result${fluid ? ' fluid' : ''}`}
              style={resultWidth ? { width: resultWidth } : undefined}
            >
              <div className="chart" ref={chartRef} />
              {error ? <pre className="live-error">⚠ {error}</pre> : null}
              {!error && meta.try ? <TryHint hint={meta.try} /> : null}
            </div>
            <div className="visual-data">
              {!error ? <DataPanel chart={elicited} /> : null}
            </div>
          </div>
        ) : (
          <div
            className={`result${fluid ? ' fluid' : ''}`}
            style={resultWidth ? { width: resultWidth } : undefined}
          >
            <div className="chart" ref={chartRef} />
            {error ? <pre className="live-error">⚠ {error}</pre> : null}
            {!error && meta.try ? <TryHint hint={meta.try} /> : null}
            {!error ? <DataPanel chart={elicited} /> : null}
          </div>
        )}
        {showCode && !isEditable ? (
          <div className={`code-wrap code-below${tall ? ' tall' : ''}`}>
            <ReadOnlyCode code={source} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
