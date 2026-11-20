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
import { themes } from 'prism-react-renderer';
import { Editor } from 'react-live';
import { Button } from '@/components/ui/button';
import type { CodeMode, ExampleMeta, Prose } from '../lib/types';
import * as elicit from '@elicit';
import { createElicitScope } from '../lib/elicitScope';
import { chartThemeFor, currentChartMode, useChartMode } from '../lib/chartTheme';
import { useSpecMode } from '../lib/specMode';
import { SpecTabs } from './SpecTabs';
import { FoldedCode } from './FoldedCode';
import { findFolds } from '../lib/folds';
import { formatJson, functionsSource, type JsonBlock, type JsonView } from '../lib/jsonSpec';

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

/** The editor's <pre>, as react-live draws it, so the folded view lines up with it. */
const EDITOR_PRE_STYLE: CSSProperties = { margin: 0, outline: 'none', padding: 10, fontFamily: 'inherit' };

/** Put the caret `offset` characters into an editable element. */
function placeCaret(root: HTMLElement, offset: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let left = offset;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent?.length ?? 0;
    if (left <= length) {
      const range = document.createRange();
      range.setStart(node, left);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }
    left -= length;
  }
}

/**
 * Opening the editor unfolds the data rows, so the line that was clicked can
 * move. Scroll it back under the pointer: first within the code panel, if it
 * scrolls, then the page for whatever is left.
 */
function keepUnderPointer(pre: HTMLElement, clientY: number | null) {
  const selection = window.getSelection();
  if (clientY == null || !selection || selection.rangeCount === 0) return;
  let rect = selection.getRangeAt(0).getBoundingClientRect();
  // A caret on an empty line has no box; measure its line instead.
  if (rect.height === 0) {
    const node = selection.anchorNode;
    const el = node instanceof Element ? node : node?.parentElement;
    if (!el) return;
    rect = el.getBoundingClientRect();
  }
  let delta = rect.top + rect.height / 2 - clientY;
  if (Math.abs(delta) < 2) return;
  const panel = pre.closest<HTMLElement>('.code-wrap');
  if (panel && panel.scrollHeight > panel.clientHeight) {
    const before = panel.scrollTop;
    panel.scrollTop = before + delta;
    delta -= panel.scrollTop - before;
  }
  if (Math.abs(delta) >= 2) window.scrollBy(0, delta);
}

/**
 * Isolated from chart/error state so parent re-renders (after debounce eval)
 * do not remount the editor and jump the caret.
 *
 * Code with `data` rows shows them folded until the reader clicks into it; the
 * editor then opens at that spot, and folds again when it loses focus.
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
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const caret = useRef(0);
  const clickY = useRef<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const style = useMemo(
    () => ({
      ...EDITOR_STYLE_BASE,
      minHeight: tall ? 420 : 200,
    }),
    [tall]
  );
  const folds = useMemo(() => findFolds(value).length > 0, [value]);

  // Remount when `source` identity changes (Reset / new preset) via key on parent.
  useEffect(() => {
    setValue(source);
  }, [source]);

  useEffect(() => {
    const pre = editing ? wrap.current?.querySelector('pre') : null;
    if (!pre) return;
    // After the click that opened it has finished with the view it replaced.
    const id = window.setTimeout(() => {
      // focus() would scroll the editor into view on its own; the code below
      // decides the scroll instead.
      pre.focus({ preventScroll: true });
      placeCaret(pre, caret.current);
      keepUnderPointer(pre, clickY.current);
    });
    return () => window.clearTimeout(id);
  }, [editing]);

  if (folds && !editing) {
    return (
      <div
        className="live-editor"
        style={style}
        onPointerDown={(e) => {
          clickY.current = e.clientY;
        }}
      >
        <FoldedCode
          code={value}
          language="jsx"
          style={EDITOR_PRE_STYLE}
          open={open}
          onOpenChange={setOpen}
          onPick={(offset) => {
            caret.current = offset;
            setEditing(true);
          }}
        />
      </div>
    );
  }
  return (
    <div
      ref={wrap}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEditing(false);
      }}
    >
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
    </div>
  );
});

const ReadOnlyCode = memo(function ReadOnlyCode({
  code,
  language = 'jsx',
}: {
  code: string;
  language?: 'jsx' | 'json';
}) {
  return <FoldedCode code={code.trimEnd()} language={language} className="readonly-code" />;
});

/** A spec that cannot be written as JSON, as the recorder reports it. */
const NO_JSON_FORM = '[elicit] recorder: ';

/** An example's JSON spec: each spec it passed to the library, then its functions. */
const JsonPane = memo(function JsonPane({ view }: { view: JsonView }) {
  return (
    <div className="json-pane">
      {view.blocks.map((block, i) => (
        <div key={i} className="json-block">
          <div className="json-call">{block.call}</div>
          <ReadOnlyCode code={block.text} language="json" />
        </div>
      ))}
      {view.functions ? (
        <div className="json-block">
          <div className="json-call">The functions it names</div>
          <ReadOnlyCode code={view.functions} />
        </div>
      ) : null}
    </div>
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
  // In JSON mode the chart is built from the example's JSON spec, not its JavaScript.
  const specMode = useSpecMode();
  const [jsonView, setJsonView] = useState<JsonView | null>(null);

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

    /**
     * Run the example. With `asJson`, its namespaces record each factory call,
     * and every spec it hands to the library is written as JSON and compiled
     * back, so the chart on screen is the one the JSON describes.
     */
    const run = (asJson: boolean) => {
      // Every chart the example builds is recorded here, through `Elicit` and
      // `ds.chart`, so a re-run destroys it. Its node carries it as `__chart`, so
      // browser checks can reach the chart.
      const created: ElicitChart[] = [];
      const mounted: ElicitChart[] = [];
      const blocks: JsonBlock[] = [];
      const functions: Record<string, Function> = {};
      const rec = asJson ? elicit.recorder() : null;
      const names = rec ? createElicitScope(rec) : scope;

      // An example may compile a JSON spec itself; that JSON is then the one shown.
      const compiledHere = new WeakMap<object, { json: unknown; functions: Record<string, Function> }>();
      const compile: typeof elicit.compile = (json, options) => {
        const spec = elicit.compile(json, options);
        compiledHere.set(spec, { json, functions: options?.functions ?? {} });
        return spec;
      };

      /** The spec the library is given: as written, or compiled from its JSON. */
      const specOf = (spec: unknown, call: string): unknown => {
        if (!rec) return spec;
        const own = compiledHere.get(spec as object);
        if (own) {
          blocks.push({ call, text: formatJson(own.json) });
          Object.assign(functions, own.functions);
          return spec;
        }
        const recorded = rec.toJSON(spec as object);
        // Through text and back, so nothing but JSON reaches `compile`.
        const json = JSON.parse(JSON.stringify(recorded.json));
        blocks.push({ call, text: formatJson(json) });
        Object.assign(functions, recorded.functions);
        return elicit.compile(json, { functions: recorded.functions });
      };
      // A function the spec keeps may call a factory while the chart is built.
      const building = <T,>(fn: () => T): T => (rec ? rec.live(fn) : fn());

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
        ds.chart = (spec) => track(building(() => make(specOf(spec, 'dataset.chart(compile(json))'))));
      };
      const RealElicit = scope.Elicit as unknown as ((spec: unknown) => ElicitChart) & {
        dataset: (spec: unknown) => Ds;
      };
      const Elicit = Object.assign(
        (spec: unknown) => track(building(() => RealElicit(specOf(spec, 'Elicit(compile(json))')))),
        RealElicit,
        {
          dataset: (spec: unknown) => {
            const ds = building(() => RealElicit.dataset(specOf(spec, 'Elicit.dataset(compile(json))')));
            patch(ds);
            return ds;
          },
        },
      );

      // `mount` appends a node, like `parent.append`. A chart is mounted as
      // `chart.dom()`; the first one mounted feeds the data panel.
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
        const keys = Object.keys(names);
        const vals = keys.map((n) =>
          n === 'Elicit' ? Elicit : n === 'compile' ? compile : names[n as keyof typeof names],
        );
        // eslint-disable-next-line no-new-func
        const body = new Function(...keys, 'mount', evalCode);
        body(...vals, mount);
      } catch (err) {
        destroyAll(created);
        chart.replaceChildren();
        throw err;
      }
      // What the example does from here on (a click handler, a timer) is not the spec.
      if (rec) rec.stop();
      return { created, mounted, blocks, functions };
    };

    try {
      let ran;
      let unavailable: string | null = null;
      try {
        ran = run(specMode === 'json');
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (specMode !== 'json' || !message.startsWith(NO_JSON_FORM)) throw err;
        // No JSON form: say why, and draw the example from its JavaScript.
        unavailable = message.slice(NO_JSON_FORM.length);
        ran = run(false);
      }
      const { created, mounted } = ran;
      if (cancelled) {
        destroyAll(created);
        chart.replaceChildren();
        return;
      }
      activeRef.current = created;
      const first = mounted[0] ?? null;
      setError(null);
      setElicited(first);
      setJsonView(
        specMode === 'json'
          ? { blocks: ran.blocks, functions: functionsSource(ran.functions), unavailable }
          : null,
      );
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
      chart.replaceChildren();
      activeRef.current = [];
      setElicited(null);
      setJsonView(null);
      setError(formatEvalError(err));
    }

    return () => {
      cancelled = true;
      destroyAll(activeRef.current);
      activeRef.current = [];
    };
  }, [evalCode, scope, chartMode, specMode]);

  // The JSON for this example, when the site shows JSON and the example has one.
  const json = specMode === 'json' && jsonView && !jsonView.unavailable && jsonView.blocks.length ? jsonView : null;
  const noJson = specMode === 'json' && jsonView ? jsonView.unavailable : null;

  const cardClass = [
    'card',
    tall ? 'card-tall' : '',
    isVisual ? 'card-visual' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} data-spec={specMode} data-json={json ? 'compiled' : noJson ? 'none' : undefined}>
      {/* No icons in the card's buttons: the library's browser gate selects a
          section's FIRST <svg> (`#edit svg`), which must be the chart's. */}
      <div className="card-head">
        <div>
          <h3>{meta.title}</h3>
          {meta.blurb ? <p>{meta.blurb}</p> : null}
        </div>
        <div className="card-actions">
          {showCode ? <SpecTabs mode={specMode} /> : null}
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
            {noJson ? <p className="json-note">No JSON form. {noJson}</p> : null}
            {json ? (
              <JsonPane view={json} />
            ) : (
              <CodePane
                key={editorKey}
                source={source}
                tall={tall}
                onDraftChange={onDraftChange}
              />
            )}
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
            {noJson ? <p className="json-note">No JSON form. {noJson}</p> : null}
            {json ? <JsonPane view={json} /> : <ReadOnlyCode code={source} />}
          </div>
        ) : null}
      </div>
    </div>
  );
}
