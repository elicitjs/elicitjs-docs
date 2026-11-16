import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "Elicit.dataset(spec)",
    summary: (
      <>
        A dataset that any number of charts read and write. It holds the rows, the schema, the dataset&rsquo;s rules, the undo history and the selection. Make a chart over it with <code className="inline">ds.chart(spec)</code>.
      </>
    ),
    signatures: [
      "Elicit.dataset({ schema, data?, constraints?, lock?, context?, onChange? }) → Dataset",
    ],
    options: [
      {
        name: "schema",
        type: "Schema",
        default: "required",
        desc: (
          <>
            Each field&rsquo;s type and domain. See <a href="/schema">Data schema</a>.
          </>
        ),
      },
      {
        name: "data",
        type: "Datum[] | Record<table, Datum[]>",
        default: "[]",
        desc: "The seed rows.",
      },
      {
        name: "constraints",
        type: "Constraint[]",
        default: "[]",
        desc: (
          <>
            Rules that gate and repair every edit from every chart, and every <code className="inline">set</code>. See <a href="/constraints">Constraints</a>.
          </>
        ),
      },
      {
        name: "lock / context",
        type: "LockSpec / ContextSpec",
        default: "—",
        desc: (
          <>
            Read-only rows and reference rows, in every chart. See <a href="/editing/lock">Locked rows</a> and <a href="/editing/existence#context">Context rows</a>.
          </>
        ),
      },
      {
        name: "onChange",
        type: "(data) => void",
        default: "—",
        desc: "Called once per commit, from any chart, with the committed data.",
      },
    ],
    returns: (
      <>
        A <b>Dataset</b>: <code className="inline">chart</code>, <code className="inline">getData</code>, <code className="inline">getSchema</code>, <code className="inline">setData</code>, <code className="inline">setDomain</code>, <code className="inline">set</code>, <code className="inline">undo</code> / <code className="inline">redo</code> / <code className="inline">canUndo</code> / <code className="inline">canRedo</code>, <code className="inline">on(&quot;change&quot; | &quot;select&quot;)</code> and the <a href="/editing/selection">selection</a> methods. See <a href="/overview">Overview</a> for each.
      </>
    ),
  },
  {
    name: "ds.chart(spec)",
    summary: (
      <>
        A chart over the dataset. It takes every spec key the dataset doesn&rsquo;t: <code className="inline">marks</code>, <code className="inline">elements</code>, size, <code className="inline">axes</code>, <code className="inline">theme</code>, <code className="inline">guides</code>, <code className="inline">effects</code>, stages. Append <code className="inline">chart.dom()</code> to the page.
      </>
    ),
    signatures: [
      "ds.chart({ marks, width?, height?, … }) → Chart",
      "parent.append(chart.dom())",
    ],
    returns: (
      <>
        A <b>Chart</b>: <code className="inline">dom()</code>, <code className="inline">dataset</code>, <code className="inline">control</code>, <code className="inline">emit</code>, <code className="inline">on(&quot;stage&quot;)</code>, the <a href="/editing/stages">stage</a> methods and <code className="inline">destroy()</code>, plus the dataset&rsquo;s methods.
      </>
    ),
  },
  {
    name: "ds.set(field, value, options?)",
    summary: (
      <>
        Write one cell from outside any chart. Runs the dataset&rsquo;s constraints, then the lock. One undo step; fires <code className="inline">change</code> and redraws every chart.
      </>
    ),
    signatures: [
      "ds.set(\"share\", 40)                      // row 0 of the primary table",
      "ds.set(\"share\", \"40\", { index: 2 })      // stored as the number 40",
      "ds.set(\"weight\", 3, { index: 0, table: \"links\" })",
    ],
    options: [
      {
        name: "index",
        type: "number",
        default: "0",
        desc: (
          <>
            The row, counted as <code className="inline">getData()</code> reports them: context rows left out.
          </>
        ),
      },
      {
        name: "table",
        type: "string",
        default: "the primary table",
        desc: "The table the row is in.",
      },
    ],
    returns: (
      <>
        <code className="inline">true</code> when it commits. <code className="inline">false</code> when a constraint rejects it, the row is locked or the value is unchanged, and, with a warning, for an undeclared field, an index out of range or a value the field&rsquo;s type can&rsquo;t hold.
      </>
    ),
  },
];
