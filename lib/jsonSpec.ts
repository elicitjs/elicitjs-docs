/**
 * How an example's JSON spec is shown: the JSON, printed to read like the
 * JavaScript beside it, and the functions it names.
 */

// The code pane is about 60 characters wide beside a chart.
const WIDTH = 58;

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

/** A value on one line: `{ "field": "x" }`, `[0, 100]`. */
function inline(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`;
  if (isObject(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    return `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${inline(v)}`).join(', ')} }`;
  }
  return JSON.stringify(value) ?? 'null';
}

/**
 * JSON with short values kept on one line, so a channel reads
 * `"x": { "field": "cat" }` as it does in JavaScript. A long list of short
 * items (a row of coordinates) fills its lines.
 */
export function formatJson(value: unknown, indent = ''): string {
  const flat = inline(value);
  if (indent.length + flat.length <= WIDTH || (!Array.isArray(value) && !isObject(value))) return flat;
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    const items = value.map(inline);
    const short = items.every((item) => item.length <= 24);
    if (short) {
      const lines: string[] = [];
      let line = '';
      for (const item of items) {
        if (line && inner.length + line.length + item.length + 2 > WIDTH) {
          lines.push(line);
          line = '';
        }
        line = line ? `${line}, ${item}` : item;
      }
      if (line) lines.push(line);
      return `[\n${lines.map((l) => inner + l).join(',\n')}\n${indent}]`;
    }
    return `[\n${value.map((v) => inner + formatJson(v, inner)).join(',\n')}\n${indent}]`;
  }
  const body = Object.entries(value)
    .map(([k, v]) => `${inner}${JSON.stringify(k)}: ${formatJson(v, inner)}`)
    .join(',\n');
  return `{\n${body}\n${indent}}`;
}

/** The `compile()` call that supplies the functions a JSON spec names. */
export function functionsSource(functions: Record<string, Function>): string | null {
  const names = Object.keys(functions);
  if (!names.length) return null;
  const body = names
    .map((name) => {
      const key = /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
      return `    ${key}: ${String(functions[name])},`;
    })
    .join('\n');
  return `compile(json, {\n  functions: {\n${body}\n  },\n});`;
}

/** One spec an example passed to the library, as JSON. */
export type JsonBlock = {
  /** The call that takes it, e.g. `Elicit(compile(json))`. */
  call: string;
  text: string;
};

/** What an example shows in JSON mode. */
export type JsonView = {
  blocks: JsonBlock[];
  /** The functions the spec names, as source, or null when it names none. */
  functions: string | null;
  /** Why this example has no JSON form, or null when it has one. */
  unavailable: string | null;
};
