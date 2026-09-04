import type { BuilderState, MarkInstance, OptionValue, ChannelBinding } from './types';
import { markByFamily } from './marks.manifest';

type Raw = { __raw: string };
const raw = (source: string): Raw => ({ __raw: source });
function isRaw(v: unknown): v is Raw {
  return typeof v === 'object' && v !== null && '__raw' in v;
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const key = (k: string) => (IDENTIFIER.test(k) ? k : JSON.stringify(k));

function jsLiteral(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  if (isRaw(value)) return value.__raw;
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => pad1 + jsLiteral(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined
    );
    if (entries.length === 0) return '{}';
    const lines = entries.map(([k, v]) => `${pad1}${key(k)}: ${jsLiteral(v, indent + 1)}`);
    return `{\n${lines.join(',\n')}\n${pad}}`;
  }
  return 'null';
}

function cleanOptions(options: Record<string, OptionValue>): Record<string, OptionValue> {
  return Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined && v !== '' && v !== '—')
  );
}

function callLiteral(callPath: string, options: Record<string, OptionValue>): Raw {
  const cleaned = cleanOptions(options);
  if (Object.keys(cleaned).length === 0) return raw(`${callPath}()`);
  return raw(`${callPath}(${jsLiteral(cleaned)})`);
}

function schemaLiteral(state: BuilderState): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of state.schema) {
    if (!f.name.trim()) continue;
    const tokens = f.domain.split(',').map((t) => t.trim()).filter(Boolean);
    const isNumeric = f.type === 'quantitative';
    const isTemporal = f.type === 'temporal';
    const domain = tokens.length
      ? tokens.map((t) =>
          isNumeric ? Number(t) : isTemporal ? raw(`new Date(${JSON.stringify(t)})`) : t
        )
      : undefined;
    const def = f.default.trim()
      ? isNumeric
        ? Number(f.default)
        : isTemporal
          ? raw(`new Date(${JSON.stringify(f.default)})`)
          : f.default
      : undefined;
    out[f.name] = { type: f.type, domain, default: def };
  }
  return out;
}

function dataLiteral(state: BuilderState): Raw {
  try {
    const parsed = JSON.parse(state.dataJson);
    return raw(jsLiteral(parsed));
  } catch {
    return raw('[] /* Note: valid JSON rows expected */');
  }
}

function singleMarkCallLiteral(mark: MarkInstance): Raw {
  const entry = markByFamily(mark.family);
  const factory =
    mark.orientation === 'x'
      ? entry.factoryNames.x || entry.factoryNames.auto
      : mark.orientation === 'y'
        ? entry.factoryNames.y || entry.factoryNames.auto
        : entry.factoryNames.auto;

  const channels: Record<string, unknown> = {};
  const channelEntries = Object.entries(mark.channels);

  for (const [ch, binding] of channelEntries) {
    const chObj: Record<string, unknown> = {};
    if (binding?.isField && binding.field) {
      chObj.field = binding.field;
    } else if (!binding?.isField && binding?.value !== undefined && binding.value !== '') {
      chObj.value = binding.value;
    }

    // Attach channel-level edit if present
    if (binding?.edit) {
      chObj.edit = callLiteral(binding.edit.name, binding.edit.options);
    }

    if (Object.keys(chObj).length > 0) {
      channels[ch] = chObj;
    }
  }

  // Mark-level edits
  const editCalls: Raw[] = [];
  for (const e of mark.edits) {
    // If it's a 1D edit attached at mark level and no channel edit was defined,
    // smartly bind it to the value channel if applicable
    const is1D = ['move', 'slide', 'moveSpan', 'brushSpan', 'cycle', 'rotate', 'resize'].includes(e.name);
    const valueChannel =
      mark.orientation === 'x' ? 'x' : mark.orientation === 'y' ? 'y' : mark.family === 'needle' ? 'angle' : null;

    if (is1D && valueChannel && channels[valueChannel] && !(channels[valueChannel] as any).edit) {
      (channels[valueChannel] as any).edit = callLiteral(e.name, e.options);
    } else if (mark.family === 'point' && e.name === 'move' && !e.options.channels) {
      // 2D point move
      const opts = { ...e.options, channels: ['x', 'y'] };
      editCalls.push(callLiteral(e.name, opts));
    } else if (mark.family === 'node' && e.name === 'move' && !e.options.channels) {
      // 2D node move
      const opts = { ...e.options, channels: ['x', 'y'] };
      editCalls.push(callLiteral(e.name, opts));
    } else {
      editCalls.push(callLiteral(e.name, e.options));
    }
  }

  const options = cleanOptions(mark.options);
  if (mark.family === 'geoBasemap' && !options.geojson) {
    options.geojson = raw('vancouver') as unknown as OptionValue;
  }

  const args: Record<string, unknown> = {
    ...options,
    ...cleanOptions(mark.style),
  };
  if (Object.keys(channels).length > 0) args.channels = channels;
  if (editCalls.length > 0) args.edits = editCalls;

  return raw(`${factory}(${jsLiteral(args)})`);
}

function guidesLiteral(state: BuilderState): Raw[] | undefined {
  if (!state.guides || state.guides.length === 0) return undefined;
  return state.guides.map((g) => {
    if (g.type === 'custom') {
      const code = (g.options.code as string) || '() => []';
      return raw(`guides.custom(${code})`);
    }
    const cleaned = cleanOptions(g.options);
    return raw(`guides.${g.type}(${jsLiteral(cleaned)})`);
  });
}

function constraintsLiteral(state: BuilderState): Raw[] | undefined {
  if (!state.constraints || state.constraints.length === 0) return undefined;
  return state.constraints.map((c) => callLiteral(c.name, c.options));
}

function scalesLiteral(state: BuilderState): Record<string, unknown> | undefined {
  const channels = Object.keys(state.scales || {});
  if (!channels.length) return undefined;
  const out: Record<string, unknown> = {};
  for (const ch of channels) {
    const s = state.scales[ch];
    out[ch] = { type: s.type, ...cleanOptions(s.options) };
  }
  return out;
}

function effectsLiteral(state: BuilderState): Record<string, unknown> | undefined {
  const { effects } = state;
  if (!effects) return undefined;
  const out: Record<string, unknown> = {};
  if (effects.hoverOutlineColor || effects.hoverOutlineWidth) {
    out.hovered = {
      outline: {
        color: effects.hoverOutlineColor || '#2563eb',
        width: effects.hoverOutlineWidth || 2,
      },
    };
  }
  if (effects.selectedOutlineColor || effects.selectedOutlineWidth) {
    out.selected = {
      outline: {
        color: effects.selectedOutlineColor || '#ea580c',
        width: effects.selectedOutlineWidth || 3,
      },
    };
  }
  if (effects.grabbedBrightness) {
    out.grabbed = `brightness(${effects.grabbedBrightness})`;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function themeLiteral(state: BuilderState): Raw | undefined {
  const { theme } = state;
  if (!theme) return undefined;
  const overrides = cleanOptions(theme.overrides);
  let advanced: Record<string, unknown> = {};
  if (theme.advancedJson?.trim()) {
    try {
      advanced = JSON.parse(theme.advancedJson);
    } catch {
      // ignore
    }
  }
  const merged: Record<string, unknown> = { ...overrides, ...advanced };
  const hasMerged = Object.keys(merged).length > 0;

  if (theme.preset === 'default') {
    return hasMerged ? raw(jsLiteral(merged)) : undefined;
  }
  const presetRef = `themes.${theme.preset}`;
  if (!hasMerged) return raw(presetRef);

  const lines = [
    `  ...${presetRef}`,
    ...Object.entries(merged).map(([k, v]) => `  ${key(k)}: ${jsLiteral(v, 1)}`),
  ];
  return raw(`{\n${lines.join(',\n')}\n}`);
}

export function buildSpecCode(state: BuilderState): string {
  const schema = schemaLiteral(state);
  const scales = scalesLiteral(state);
  const theme = themeLiteral(state);
  const guides = guidesLiteral(state);
  const constraints = constraintsLiteral(state);
  const effects = effectsLiteral(state);

  const activeMarks = (state.marks || []).filter((m) => m.enabled);
  const marksCalls = activeMarks.length > 0
    ? activeMarks.map((m) => singleMarkCallLiteral(m))
    : [raw('barY({ channels: { x: { field: "category" }, y: { field: "value" } } })')];

  const specEntries: Record<string, unknown> = {
    schema,
    data: dataLiteral(state),
    marks: marksCalls,
  };

  // Lock configuration
  if (state.lock?.mode === 'seed') {
    specEntries.lock = 'seed';
  } else if (state.lock?.mode === 'predicate' && state.lock.predicateCode?.trim()) {
    specEntries.lock = raw(state.lock.predicateCode);
  }

  // Layout & Sizing
  if (state.layout) {
    if (state.layout.width) specEntries.width = state.layout.width;
    if (state.layout.height) specEntries.height = state.layout.height;
    if (state.layout.responsive && state.layout.responsive !== 'fixed') {
      specEntries.responsive = state.layout.responsive;
    }
    if (state.layout.projection) {
      if (state.layout.projection === 'mercator') {
        specEntries.projection = raw('{ type: "mercator", domain: vancouver, inset: 6 }');
      } else {
        specEntries.projection = state.layout.projection;
      }
    }
    if (state.layout.renderer && state.layout.renderer !== 'd3') {
      specEntries.renderer = raw('CanvasRenderer');
    }
    const m = state.layout;
    if (m.marginTop || m.marginRight || m.marginBottom || m.marginLeft) {
      specEntries.margins = {
        top: m.marginTop ?? 20,
        right: m.marginRight ?? 20,
        bottom: m.marginBottom ?? 30,
        left: m.marginLeft ?? 40,
      };
    }
  }

  if (guides && guides.length > 0) specEntries.guides = guides;
  if (constraints && constraints.length > 0) specEntries.constraints = constraints;
  if (scales) specEntries.scales = scales;
  if (effects) specEntries.effects = effects;
  if (theme) specEntries.theme = theme;

  return `mount(Elicit(${jsLiteral(specEntries)}));\n`;
}

export function buildStandaloneHtml(state: BuilderState): string {
  const code = buildSpecCode(state);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elicitation Device — ElicitJS</title>
  <style>
    body {
      margin: 0;
      padding: 2rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      display: flex;
      justify-content: center;
    }
    #chart-container {
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
</head>
<body>
  <div id="chart-container"></div>
  <script type="module">
    // In production, import * as elicit from '@elicitjs/elicit';
    // const { Elicit, barY, line, move, maintainSum, guides, themes } = elicit;
    
    // Mount the elicitation chart into #chart-container
    const chart = ${code.replace('mount(', 'document.getElementById("chart-container").appendChild(')};
    
    // Listen to respondent updates
    chart.on?.('change', (data) => {
      console.log('Elicited belief update:', data);
    });
  </script>
</body>
</html>`;
}

export function buildReactComponentCode(state: BuilderState): string {
  const code = buildSpecCode(state);
  return `import React, { useEffect, useRef } from 'react';
import * as elicit from '@elicitjs/elicit';

export function ElicitationDevice({ onBeliefChange }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    
    const mount = (el: HTMLElement) => {
      containerRef.current?.appendChild(el);
      return el;
    };

    const {
      Elicit,
      ${Array.from(new Set((state.marks || []).map((m) => markByFamily(m.family).factoryNames.auto))).join(', ')},
      guides,
      themes,
    } = elicit;

    const chart = ${code};

    chart.on?.('change', (data) => {
      onBeliefChange?.(data);
    });

    return () => {
      chart.destroy?.();
    };
  }, [onBeliefChange]);

  return <div ref={containerRef} className="elicit-container" />;
}
`;
}
