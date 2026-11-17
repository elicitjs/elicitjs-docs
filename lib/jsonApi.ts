/**
 * The JSON form of an API entry, from the library's grammar
 * (lib/json-api.generated.ts). An entry names what it documents with
 * `json: ['plot.bar', 'mark']`; `json: false` means it has no JSON form.
 */
import { JSON_KEYWORDS, JSON_OWNERS, JSON_SLOTS, type JsonKeyword, type JsonSignature } from './json-api.generated';

export type JsonForm = {
  /** The signature lines, as JSON. */
  signatures: string[];
  /** The signature of each option that takes a function. */
  functions: Record<string, JsonSignature>;
};

/** What a placeholder for a positional key looks like. */
const PLACEHOLDER: Record<string, string> = { fn: '"<name>"' };

function descriptor(k: JsonKeyword): string {
  const keys = k.positional.map((p) => `"${p}": ${PLACEHOLDER[p] ?? '…'}`);
  const body = `{ "type": "${k.type}", ${[...keys, '…'].join(', ')} }`;
  return k.place === 'under "widget"' ? `"widget": ${body}` : body;
}

/** The keyword a JavaScript call names: `barY(` and `edit.network.connect(` alike. */
function keywordOf(path: string, ids: string[]): string | undefined {
  return ids.find((id) => JSON_KEYWORDS[id] && (id === path || id.endsWith(`.${path}`)));
}

/** The text after a call's closing parenthesis, or null when it does not close. */
function afterCall(line: string, open: number): string | null {
  let depth = 0;
  for (let i = open; i < line.length; i++) {
    if (line[i] === '(') depth++;
    else if (line[i] === ')' && --depth === 0) return line.slice(i + 1);
  }
  return null;
}

/**
 * An entry's JSON form. A line that calls a listed keyword becomes its
 * descriptor, once per keyword, keeping its comment. A `key: type` line keeps
 * its place with function types rewritten. With keywords, any other line is
 * JavaScript usage and is left out.
 */
export function jsonForm(ids: string[], lines: string[]): JsonForm {
  // `constraints` and `constrain` hold descriptors; a function goes in an item, not the option.
  const { constraints: _c, constrain: _k, ...slots } = JSON_SLOTS;
  const functions: Record<string, JsonSignature> = { ...slots };
  const owners = ids.flatMap((id) => JSON_KEYWORDS[id]?.owners ?? [id]);
  // Most specific owner wins: `plot.rect`'s `width` over a mark's.
  for (const owner of owners.reverse()) Object.assign(functions, JSON_OWNERS[owner]);

  const keywords = ids.filter((id) => JSON_KEYWORDS[id]);
  if (!keywords.length) return { signatures: lines.map((l) => jsonSignatureLine(l, functions)), functions };

  const rows: [string, string][] = [];
  const shown = new Set<string>();
  const show = (id: string, note: string | null) => {
    shown.add(id);
    const k = JSON_KEYWORDS[id];
    rows.push([descriptor(k), note ?? (k.place === 'under "widget"' ? '' : `// ${k.place}`)]);
  };
  for (const line of lines) {
    const call = line.match(/^\s*([A-Za-z][\w.]*)\(/);
    const id = call && keywordOf(call[1], keywords);
    if (id && call) {
      if (shown.has(id)) continue;
      const rest = afterCall(line, call[0].length - 1) ?? '';
      // Keep a comment or a description, not the return type.
      const note = rest.match(/(\/\/.*|— .*)$/);
      show(id, note ? note[1] : null);
    } else if (/^\s*"?\w+"?: /.test(line)) rows.push([jsonSignatureLine(line, functions), '']);
  }
  for (const id of keywords) if (!shown.has(id)) show(id, null);

  const width = Math.max(...rows.filter(([, note]) => note).map(([code]) => code.length), 0);
  return {
    signatures: rows.map(([code, note]) => (note ? `${code.padEnd(width)}   ${note}` : code)),
    functions,
  };
}

/**
 * The signature of an option row. A row may name several options
 * (`fill / stroke`, `rule.x / y`): it takes a function only when all of them
 * take the same kind.
 */
export function signatureFor(name: string, functions: Record<string, JsonSignature>) {
  const keys = name
    .split(/[/·,]/)
    .map((part) => part.replace(/[?()]/g, '').trim().split('.').pop() ?? '')
    .filter((key) => /^\w+$/.test(key));
  const sigs = keys.map((key) => functions[key] ?? functions['*']);
  if (!sigs.length || sigs.some((sig) => !sig)) return undefined;
  const first = JSON.stringify(sigs[0]);
  return sigs.every((sig) => JSON.stringify(sig) === first) ? sigs[0] : undefined;
}

/** Split a type at its top-level `|`. */
function members(type: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < type.length; i++) {
    const c = type[i];
    if ('([{<'.includes(c)) depth++;
    else if (')]}>'.includes(c) && type[i - 1] !== '=') depth--;
    else if (c === '|' && depth === 0) {
      out.push(type.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(type.slice(start).trim());
  return out.filter(Boolean);
}

const isFunction = (member: string) => /=>|^Function\b|^fn$|^\(\s*\(/.test(member);

/** A JavaScript type with its function forms written as JSON references. */
export function jsonType(type: string | undefined, sig: JsonSignature, key?: string): string {
  const refs = sig === 'fn' ? ['{ fn }'] : ['{ expr }', '{ fn }'];
  const kept = [...new Set(members(type ?? ''))].filter((m) => !isFunction(m) && !/^[—–-]$/.test(m));
  // A predicate is written by name: "when": "shift".
  if (key === 'when') kept.unshift('"<predicate>"');
  return [...kept, ...refs].join(' | ');
}

/** The variables an `expr` reads, or null when the option takes a named function only. */
export function exprVariables(sig: JsonSignature): string | null {
  if (sig === 'fn') return null;
  if (sig === 'ctx') return 'the context keys';
  return Array.isArray(sig) ? sig.join(', ') : sig;
}

/** `lock: 'seed' | ((datum) => boolean)` as JSON, for a signature that shows one key. */
export function jsonSignatureLine(line: string, functions: Record<string, JsonSignature>): string {
  const m = line.match(/^(\s*)(\w+): (.+)$/);
  if (!m || !functions[m[2]]) return line;
  return `${m[1]}"${m[2]}": ${jsonType(m[3], functions[m[2]], m[2])}`;
}
