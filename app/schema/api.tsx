import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "schema — Record<field, FieldSchema>",
    summary: (
      <>
        Required on <code className="inline">Elicit</code> — marks never own domains. Each field maps to a spec that fixes its measurement type, range and creation default — the source of truth a scale and a minted datum both read.
      </>
    ),
    signatures: [
      "schema: { [field]: { type, domain?, default?, open?, key? } }",
      "schema: { structure, tables: { [name]: { role?, fields } } }",
    ],
    options: [
      {
        name: "type",
        type: "'quantitative'|'categorical'|'ordinal'|'temporal'|'ref'",
        default: "—",
        desc: (
          <>
            The field’s measurement type — picks the scale family (quantitative→linear, categorical→band/ordinal, temporal→time). <code className="inline">ref</code> means the value names a row of another table by its key; it scales as a category, and its domain comes from the column it points at.
          </>
        ),
      },
      {
        name: "domain",
        type: "any[]",
        default: "—",
        desc: "The field’s data range or category list; feeds the resolved scale and the axis.",
      },
      {
        name: "open",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Is the domain a ceiling or a starting set? Closed (the default) means the declared categories are the whole vocabulary: <code className="inline">edit.stack.cut()</code> hands out the unused ones and refuses once they run out, and a seed value outside the domain is reported. <code className="inline">open: true</code> lets a cut append a new category and skips that check. A field with no <code className="inline">domain</code> is open either way — its domain is inferred from the data.
          </>
        ),
      },
      {
        name: "key",
        type: "boolean",
        default: "false",
        desc: (
          <>
            This field is the table’s identity — the column a <code className="inline">ref</code> points at, and the one <code className="inline">create</code> writes a fresh value into when it mints a row. One per table. Pair it with <code className="inline">open: true</code> so a gesture can mint an identity without asking you to type; a closed <code className="inline">domain</code> caps how many rows may exist.
          </>
        ),
      },
      {
        name: "to",
        type: "string",
        default: "the nodes table’s key",
        desc: (
          <>
            On a <code className="inline">ref</code> field, which column it points at: <code className="inline">"id"</code> for a column of the nodes table, <code className="inline">"links.id"</code> for another table’s. You rarely need it.
          </>
        ),
      },
      {
        name: "structure",
        type: "'table' | 'network'",
        default: "'table'",
        desc: (
          <>
            Which tables the dataset has. <code className="inline">"table"</code> is one, and its schema is the bare field map above. <code className="inline">"network"</code> is two, under <code className="inline">tables</code> — see <a href="/marks/network">Network</a>.
          </>
        ),
      },
      {
        name: "default",
        type: "any",
        default: "null",
        desc: (
          <>
            The value a newly-created datum gets for this field (<code className="inline">null</code> = present but unset, editable later).
          </>
        ),
      },
    ],
    returns: (
      <>
        With a schema, a feature resolves scales and draws axes from <b>no starter data</b>; <code className="inline">create</code> seeds every declared field before the pointer places the positional ones.
      </>
    ),
  },
];
