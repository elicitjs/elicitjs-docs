/**
 * Where an example's code folds: the rows of each `data` array after the first,
 * so a long table of rows doesn't bury the spec. Works on JavaScript and JSON.
 */

/** Lines `start`..`end` (0-based, inclusive) fold away; they hold `rows` rows. */
export type Fold = { start: number; end: number; rows: number };

/** A `data` array, or a `data` object whose arrays are tables (`nodes`, `links`). */
const DATA = /(?:(["']?)data\1\s*:|\b(?:const|let|var)\s+data\s*=)\s*([[{])/g;

/** Skip a string or comment starting at `i`; returns the index after it, or `i`. */
function skip(code: string, i: number): number {
  const c = code[i];
  if (c === '"' || c === "'" || c === '`') {
    for (let j = i + 1; j < code.length; j++) {
      if (code[j] === '\\') j++;
      else if (code[j] === c) return j + 1;
    }
    return code.length;
  }
  if (c === '/' && code[i + 1] === '/') {
    const end = code.indexOf('\n', i);
    return end < 0 ? code.length : end;
  }
  if (c === '/' && code[i + 1] === '*') {
    const end = code.indexOf('*/', i + 2);
    return end < 0 ? code.length : end + 2;
  }
  return i;
}

/**
 * The top level of the bracket at `open`: where each item starts, the key of
 * each value (in an object), and where it closes.
 */
function scan(code: string, open: number) {
  const items: number[] = [];
  const values: { key: string; at: number }[] = [];
  let depth = 0;
  let expecting = true;
  for (let i = open; i < code.length; ) {
    const after = skip(code, i);
    if (after !== i) {
      if (depth === 1 && expecting && !code.startsWith('/', i)) {
        items.push(i);
        expecting = false;
      }
      i = after;
      continue;
    }
    const c = code[i];
    if ('([{'.includes(c)) {
      if (depth === 1 && expecting) {
        items.push(i);
        expecting = false;
      }
      depth++;
    } else if (')]}'.includes(c)) {
      if (--depth === 0) return { items, values, close: i };
    } else if (depth === 1 && c === ',') expecting = true;
    else if (depth === 1 && c === ':' && code[open] === '{') {
      const key = code.slice(items[items.length - 1] ?? open + 1, i).replace(/["'\s]/g, '');
      const at = code.slice(i + 1).search(/\S/) + i + 1;
      values.push({ key, at });
      expecting = false;
    } else if (depth === 1 && expecting && /\S/.test(c)) {
      items.push(i);
      expecting = false;
    }
    i++;
  }
  return null;
}

export function findFolds(code: string): Fold[] {
  const lineStarts = [0];
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') lineStarts.push(i + 1);
  const lineOf = (offset: number) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  const folds: Fold[] = [];
  const foldArray = (open: number) => {
    const array = scan(code, open);
    if (!array || array.items.length < 2) return;
    const first = lineOf(array.items[0]);
    const second = lineOf(array.items[1]);
    const start = second > first ? second : first + 1;
    const closeLine = lineOf(array.close);
    // The closing bracket starts its own line, so the fold is whole lines.
    if (code.slice(lineStarts[closeLine], array.close).trim()) return;
    const end = closeLine - 1;
    const rows = array.items.filter((at) => lineOf(at) >= start).length;
    // Folding one line away saves nothing.
    if (rows && end - start >= 1) folds.push({ start, end, rows });
  };

  for (const m of code.matchAll(DATA)) {
    const open = (m.index ?? 0) + m[0].length - 1;
    if (code[open] === '[') foldArray(open);
    else {
      const object = scan(code, open);
      for (const value of object?.values ?? []) if (code[value.at] === '[') foldArray(value.at);
    }
  }
  return folds.sort((a, b) => a.start - b.start);
}
