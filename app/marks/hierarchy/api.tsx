import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: 'structure: "hierarchy"',
    summary: (
      <>
        Three tables: <code className="inline">nodes</code>,{" "}
        <code className="inline">nesting</code> and an optional{" "}
        <code className="inline">links</code>. One nesting row says one node is inside
        another.
      </>
    ),
    signatures: [
      'schema: { structure: "hierarchy", tables: { nodes, nesting, links? } }',
    ],
    options: [
      {
        name: "nodes",
        type: "table",
        default: "required",
        desc: (
          <>
            One row per node. Needs a <code className="inline">key: true</code> column.
            Named anything with <code className="inline">role: "nodes"</code>.
          </>
        ),
      },
      {
        name: "nesting",
        type: "table",
        default: "required",
        desc: (
          <>
            A field map like any other table, named anything with{" "}
            <code className="inline">role: "nesting"</code>. Its first two{" "}
            <code className="inline">ref</code> columns are the contained node, then its
            container. A node has at most one container. Further columns take a{" "}
            <code className="inline">type</code>, <code className="inline">domain</code> and{" "}
            <code className="inline">default</code> as usual.
          </>
        ),
      },
      {
        name: "links",
        type: "table",
        default: "none",
        desc: (
          <>
            As in a <a href="/marks/network">network</a>:{" "}
            <code className="inline">link()</code> draws it and{" "}
            <code className="inline">edit.network.*</code> edits it.
          </>
        ),
      },
    ],
  },
  {
    name: "channels.contains",
    summary: (
      <>
        A channel on the mark that draws the nodes. It says which rows can hold other
        nodes.
      </>
    ),
    signatures: ["contains: true | { value | fn | field, padding }"],
    options: [
      {
        name: "value | fn | field",
        type: "boolean",
        default: "—",
        desc: (
          <>
            <code className="inline">value: true</code> lets every row hold others. Use{" "}
            <code className="inline">fn</code> or <code className="inline">field</code> to
            decide per row.
          </>
        ),
      },
      {
        name: "padding",
        type: "number | { top, right, bottom, left }",
        default: "10",
        desc: (
          <>
            The room in px between a container&rsquo;s edge and its contents. A fitted
            container is sized to leave it. A fixed one keeps its contents inside it.
          </>
        ),
      },
    ],
  },
  {
    name: "channels.dodge",
    summary: (
      <>
        A channel on the mark that draws the nodes. Rows that take part are pushed clear
        of their siblings when a drag ends and when data is set from outside.
      </>
    ),
    signatures: ["dodge: true | { value | fn | field, gap }"],
    options: [
      {
        name: "value | fn | field",
        type: "boolean",
        default: "—",
        desc: (
          <>
            <code className="inline">true</code> is every row. Use{" "}
            <code className="inline">fn</code> or <code className="inline">field</code> to
            pick the rows that take part.
          </>
        ),
      },
      {
        name: "gap",
        type: "number",
        default: "8",
        desc: <>The space in px two siblings keep between them.</>,
      },
    ],
  },
  {
    name: "fit: true",
    summary: (
      <>
        A flag on a size channel. On a row that holds other nodes, the column is set
        from them.
      </>
    ),
    signatures: ["width: { field, fit: true }"],
    options: [
      {
        name: "channels",
        type: "width | height | size | rx | ry | x1 | x2 | y1 | y2",
        default: "—",
        desc: (
          <>
            The channel needs a <code className="inline">field</code>. The fitted value is
            written to it, so <code className="inline">getData()</code> reports the size
            that is drawn. The row&rsquo;s <code className="inline">x</code> and{" "}
            <code className="inline">y</code> follow the centre of its contents.
          </>
        ),
      },
    ],
  },
  {
    name: "edit.hierarchy.nest(options)",
    summary: (
      <>
        Drop a node into the container under the pointer, or out of one. Put it on the
        mark you drag, beside a <code className="inline">move</code>.
      </>
    ),
    signatures: ["edit.hierarchy.nest({ defaults, when }) → Edit"],
    options: [
      {
        name: "defaults",
        type: "object",
        default: "{}",
        desc: <>Values for any further columns of the nesting row it writes.</>,
      },
    ],
  },
];
