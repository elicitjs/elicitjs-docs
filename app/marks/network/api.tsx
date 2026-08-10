import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "link(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One line per row of the
        links table, drawn between the two nodes it references.
      </>
    ),
    signatures: [
      "link({ channels, key, curve, curvature, arrow, arrowSize, inset, sourceInset, targetInset, table, format, id }) → Feature",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            All optional. <code className="inline">source</code>/<code className="inline">target</code> name
            the reference columns (default: the link table’s two <code className="inline">ref</code> fields).
            <code className="inline">x</code>/<code className="inline">y</code> say how a <em>node</em> is
            positioned (default: the node table’s <code className="inline">x</code> and{" "}
            <code className="inline">y</code>). <code className="inline">text</code> draws a label at the
            midpoint. Style channels (<code className="inline">stroke</code>,{" "}
            <code className="inline">strokeWidth</code>, <code className="inline">opacity</code>) read the
            link row.
          </>
        ),
      },
      {
        name: "key",
        type: "string",
        default: "the node table’s key",
        desc: (
          <>
            The column that identifies a node. Declare it in the schema with{" "}
            <code className="inline">key: true</code> instead where you can.
          </>
        ),
      },
      {
        name: "curve",
        type: '"line" | "arc"',
        default: '"line"',
        desc: <>Straight segment, or a quadratic bow so parallel links stay apart.</>,
      },
      {
        name: "curvature",
        type: "number",
        default: "0.2",
        desc: <>How far an <code className="inline">arc</code> bows, as a fraction of its length.</>,
      },
      {
        name: "arrow",
        type: "boolean",
        default: "false",
        desc: <>Draw a filled triangle at the target end.</>,
      },
      {
        name: "arrowSize",
        type: "number",
        default: "6",
        desc: <>Arrowhead length in px.</>,
      },
      {
        name: "inset",
        type: "number",
        default: "0",
        desc: (
          <>
            Pull both ends in by this many px, so the line stops short of the node marks
            instead of running under them. <code className="inline">sourceInset</code> and{" "}
            <code className="inline">targetInset</code> set each end separately.
          </>
        ),
      },
      {
        name: "table",
        type: "string",
        default: "the links-role table",
        desc: (
          <>
            Which table to draw, by name — the universal option every mark takes. You
            rarely need it here: <code className="inline">link</code> resolves the table
            filling the <code className="inline">links</code> role, whatever you called it.
          </>
        ),
      },
    ],
  },
  {
    name: "node(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A dot with a label, as one
        mark — a preset over <code className="inline">composite</code>, so it desugars into
        an ordinary <code className="inline">point</code> and{" "}
        <code className="inline">text</code>. Not network-specific: point it at any table.
      </>
    ),
    signatures: [
      "node({ channels, dy, shape, size, format, table, edits, constraints, id }) → Feature[]",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            <code className="inline">x</code>/<code className="inline">y</code> are stated
            once and shared by both parts — that is the repetition it removes. A{" "}
            <code className="inline">text</code> channel draws the label; without one, no
            label is drawn. Label channels (<code className="inline">fontSize</code>,{" "}
            <code className="inline">textAnchor</code>, <code className="inline">dx</code>)
            go to the text; every other channel (<code className="inline">fill</code>,{" "}
            <code className="inline">stroke</code>, <code className="inline">size</code>,{" "}
            <code className="inline">symbol</code>) goes to the dot.
          </>
        ),
      },
      {
        name: "dy",
        type: "number",
        default: "-16",
        desc: <>Label offset in px, positive downwards.</>,
      },
      {
        name: "shape",
        type: '"circle" | "square"',
        default: '"circle"',
        desc: <>Passed to the dot.</>,
      },
    ],
    returns: (
      <>
        Carries no edits of its own, like every mark. Put{" "}
        <code className="inline">move()</code> on <code className="inline">x</code>,{" "}
        <code className="inline">editText()</code> on <code className="inline">text</code>,
        and <code className="inline">edit.network.connect()</code> in{" "}
        <code className="inline">edits</code>. An edit on{" "}
        <code className="inline">x</code>/<code className="inline">y</code> grabs the dot.
      </>
    ),
  },
  {
    name: "edit.network.connect(options)",
    summary: <>Drag from one node to another to create a link. Put it on the node mark.</>,
    signatures: ["connect({ source, target, defaults, threshold, when, stage }) → Edit"],
    options: [
      {
        name: "source, target",
        type: "string",
        default: "the link table’s ref columns",
        desc: <>Which columns to write the two node identities into.</>,
      },
      {
        name: "defaults",
        type: "object",
        default: "{}",
        desc: <>Extra fields to seed the new link row with, over the schema’s defaults.</>,
      },
      {
        name: "threshold",
        type: "number",
        default: "28",
        desc: <>How near the pointer must land to a node, in px, for the drag to connect.</>,
      },
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "null",
        desc: (
          <>
            Required when the same mark also carries a plain drag such as{" "}
            <code className="inline">move</code> — pair{" "}
            <code className="inline">when.shift</code> with{" "}
            <code className="inline">when.noShift</code>.
          </>
        ),
      },
    ],
  },
  {
    name: "edit.network.rewire(options)",
    summary: (
      <>
        Drag a link’s endpoint onto a different node. Put it on the{" "}
        <code className="inline">source</code> or <code className="inline">target</code> channel of
        a <code className="inline">link</code> mark.
      </>
    ),
    signatures: ["rewire({ threshold, when, stage }) → Edit"],
    options: [
      {
        name: "threshold",
        type: "number",
        default: "28",
        desc: <>How near the release must land to a node, in px.</>,
      },
    ],
  },
];
