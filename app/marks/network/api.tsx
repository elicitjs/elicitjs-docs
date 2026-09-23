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
      "link({ channels, curve, curvature, spread, arrow, arrowSize, inset, sourceInset, targetInset, loopRadius, nodeWidth, nodeHeight, cornerRadius, sourceSide, targetSide, labelBackground, labelPadding, labelRadius, labelOpacity, format, handles, handleSize, handleColor, table, edits, id }) → Feature",
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
            <code className="inline">y</code>). <code className="inline">text</code> draws a label on the
            path. <code className="inline">curve</code> and <code className="inline">arrow</code> take a
            column, so one mark can draw several kinds of connector. Style channels (
            <code className="inline">stroke</code>, <code className="inline">strokeWidth</code>,{" "}
            <code className="inline">opacity</code>) read the link row.
          </>
        ),
      },
      {
        name: "curve",
        type: '"line" | "step" | "stepBefore" | "stepAfter" | "orthogonal" | "arc" | "bezier"',
        default: '"line"',
        desc: (
          <>
            The connector’s shape. <code className="inline">step</code> and its two variants
            are right-angled elbows drawn between node centres; <code className="inline">orthogonal</code>
            is the flowchart elbow, docked to each node&rsquo;s box edge.{" "}
            <code className="inline">arc</code> is a quadratic bow and{" "}
            <code className="inline">bezier</code> a cubic with square tangents.{" "}
            <code className="inline">"smooth"</code> is an alias of{" "}
            <code className="inline">bezier</code>. A link whose source and target are the
            same node draws a loop whatever you set here.
          </>
        ),
      },
      {
        name: "curvature",
        type: 'number | "auto"',
        default: '"auto"',
        desc: (
          <>
            How far a link bows, as a fraction of its length.{" "}
            <code className="inline">"auto"</code> reads it off the data: links sharing a
            pair of nodes fan apart, and a pair joined by one link stays straight. A number
            applies to every link instead.
          </>
        ),
      },
      {
        name: "spread",
        type: "number",
        default: "0.16",
        desc: (
          <>
            The gap between adjacent links of one pair under{" "}
            <code className="inline">curvature: "auto"</code>.
          </>
        ),
      },
      {
        name: "arrow",
        type: '"auto" | "none" | "target" | "source" | "both"',
        default: '"auto"',
        desc: (
          <>
            Which ends carry a filled triangle. <code className="inline">"auto"</code> draws
            one at the target end when the links table declares{" "}
            <code className="inline">directed: true</code>, and none otherwise.{" "}
            <code className="inline">true</code> and <code className="inline">false</code>{" "}
            are accepted for <code className="inline">"target"</code> and{" "}
            <code className="inline">"none"</code>.
          </>
        ),
      },
      {
        name: "arrowSize",
        type: "number",
        default: "6",
        desc: <>Arrowhead length in px. The end it caps is inset by the same amount.</>,
      },
      {
        name: "loopRadius",
        type: "number",
        default: "22",
        desc: <>How far a self-loop reaches from its node, in px.</>,
      },
      {
        name: "inset",
        type: "number",
        default: "0",
        desc: (
          <>
            Pull both ends in by this many px, so the line stops short of the node marks
            instead of running under them. <code className="inline">sourceInset</code> and{" "}
            <code className="inline">targetInset</code> set each end separately. Under{" "}
            <code className="inline">curve: "orthogonal"</code> it is the clearance from the
            node's edge rather than from its centre.
          </>
        ),
      },
      {
        name: "nodeWidth",
        type: "number | channel",
        default: "—",
        desc: (
          <>
            How wide a node is, in px, for <code className="inline">curve: "orthogonal"</code>{" "}
            to dock to. Read against the node rows, so it takes a constant, a column, or{" "}
            <code className="inline">{"{ fn: d => … }"}</code> — use{" "}
            <code className="inline">noteBox</code> for an auto-sized{" "}
            <code className="inline">sticker</code>. With neither this nor{" "}
            <code className="inline">nodeHeight</code> set, connectors dock to a small square
            around the node's position.
          </>
        ),
      },
      {
        name: "nodeHeight",
        type: "number | channel",
        default: "—",
        desc: <>How tall a node is, in px. Read the same way as <code className="inline">nodeWidth</code>.</>,
      },
      {
        name: "cornerRadius",
        type: "number",
        default: "0",
        desc: <>Rounds the turns of a <code className="inline">"orthogonal"</code> connector, in px.</>,
      },
      {
        name: "sourceSide",
        type: '"auto" | "top" | "right" | "bottom" | "left"',
        default: '"auto"',
        desc: (
          <>
            Which edge the connector leaves the source node by.{" "}
            <code className="inline">"auto"</code> chooses from where the two nodes sit.{" "}
            <code className="inline">targetSide</code> does the same for the other end. Both
            read per row like <code className="inline">curve</code>, and neither writes to the
            dataset.
          </>
        ),
      },
      {
        name: "labelBackground",
        type: "boolean | string",
        default: "off",
        desc: (
          <>
            A plate behind <code className="inline">channels.text</code>, so a label
            sitting on its own connector stays readable.{" "}
            <code className="inline">true</code> uses the theme&rsquo;s backdrop, which
            reads as a gap in the line; a colour string sets it outright.
          </>
        ),
      },
      {
        name: "labelOpacity",
        type: "number",
        default: "0.9",
        desc: <>The plate&rsquo;s fill opacity — lower it to let the connector show through.</>,
      },
      {
        name: "labelPadding",
        type: "number",
        default: "3",
        desc: <>Space between the label and the plate&rsquo;s edge, in px.</>,
      },
      {
        name: "labelRadius",
        type: "number",
        default: "3",
        desc: <>The plate&rsquo;s corner radius, in px.</>,
      },
      {
        name: "sourceInset / targetInset",
        type: "number",
        default: "inset",
        desc: <>Override <code className="inline">inset</code> for one end only.</>,
      },
      {
        name: "targetSide",
        type: '"auto" | "top" | "right" | "bottom" | "left"',
        default: '"auto"',
        desc: <>Which edge the connector enters the target node by, under <code className="inline">curve: "orthogonal"</code>.</>,
      },
      {
        name: "format",
        type: "string | fn",
        default: "String",
        desc: (
          <>
            Display formatter for <code className="inline">channels.text</code>: a d3-format
            string, or <code className="inline">(v) ={'>'} string</code>. Display-only — the
            column stays raw.
          </>
        ),
      },
      {
        name: "handles",
        type: "boolean | 'hit'",
        default: "true",
        desc: (
          <>
            Endpoint grips. Drawn only where a channel carries an edit, so an inert link
            shows none. <code className="inline">'hit'</code> keeps the grip grabbable but
            draws nothing.
          </>
        ),
      },
      {
        name: "handleSize",
        type: "number",
        default: "5",
        desc: "Pixel radius of each endpoint grip.",
      },
      {
        name: "handleColor",
        type: "string",
        default: "theme",
        desc: <>Grip fill. Defaults to the theme&rsquo;s <code className="inline">handle</code> colour.</>,
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
      "node({ channels, dy, shape, size, format, table, edits, id }) → Feature[]",
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
      {
        name: "format",
        type: "string | fn",
        default: "String",
        desc: (
          <>
            Display formatter for the label: a d3-format string, or{" "}
            <code className="inline">(v) ={'>'} string</code>. Display-only.
          </>
        ),
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
    signatures: [
      "connect({ source, target, defaults, threshold, selfLoops, when, stage }) → Edit",
    ],
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
        name: "selfLoops",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Allow a link from a node to itself, by releasing on the node you started from.
            Off by default; <code className="inline">link()</code> draws it as a loop.
          </>
        ),
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
  {
    name: "edit.network.reverse(options)",
    summary: (
      <>
        Swap a link’s two ends. Put it on the <code className="inline">link</code> mark;
        it fires on a click anywhere along the line.
      </>
    ),
    signatures: ["reverse({ source, target, when, stage }) → Edit"],
    options: [
      {
        name: "source, target",
        type: "string",
        default: "the link table’s ref columns",
        desc: <>Which two columns to swap.</>,
      },
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "null",
        desc: (
          <>
            Needed when the link mark carries another click edit, such as{" "}
            <code className="inline">remove</code>. It logs a warning and does nothing on a
            links table declared <code className="inline">directed: false</code>, where the
            two ends already mean the same thing.
          </>
        ),
      },
    ],
  },
];
