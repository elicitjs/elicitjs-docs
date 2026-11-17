import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "link(options)",
    json: ['plot.link'],
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. One line per row of the
        links table, drawn between the two nodes it references.
      </>
    ),
    signatures: [
      "link({ channels, curve, curvature, spread, arrow, arrowSize, inset, sourceInset, targetInset, loopRadius, cornerRadius, sourceSide, targetSide, sourceOffset, targetOffset, labelBackground, labelPadding, labelRadius, labelOpacity, format, handles, handleSize, handleColor, table, edits, id }) → Feature",
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
            <code className="inline">opacity</code>) read the link row.{" "}
            <code className="inline">sourceSide</code>/<code className="inline">targetSide</code>{" "}
            with a <code className="inline">field</code> name the columns a connection writes
            its sides to.
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
            bows every link by that amount.
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
        desc: <>How far a self-loop reaches out from its node, in px. More loops on one node take other edges, then nest.</>,
      },
      {
        name: "inset",
        type: "number",
        default: "0",
        desc: (
          <>
            The connection buffer: how far from a node&rsquo;s shape a link stops, in px.{" "}
            <code className="inline">sourceInset</code> and{" "}
            <code className="inline">targetInset</code> set each end separately. An end at a
            port touches the port. With no node mark, it is measured from the
            node&rsquo;s position.
          </>
        ),
      },
      {
        name: "cornerRadius",
        type: "number",
        default: "8",
        desc: <>Rounds the turns of a <code className="inline">"orthogonal"</code> connector, in px. <code className="inline">0</code> draws square corners.</>,
      },
      {
        name: "sourceSide",
        type: 'null | "top" | "right" | "bottom" | "left"',
        default: "null",
        desc: (
          <>
            Which edge the connector leaves the source node by. <code className="inline">null</code>{" "}
            (the default) leaves it unpinned: it meets the facing port, or slides along a
            node that has no ports. A named edge pins it at that
            edge’s midpoint.{" "}
            <code className="inline">targetSide</code> does the same for the other end. Both
            read per row like <code className="inline">curve</code>. As a channel with a{" "}
            <code className="inline">field</code>, the column is also what{" "}
            <code className="inline">connect</code> and <code className="inline">rewire</code>{" "}
            write.
          </>
        ),
      },
      {
        name: "sourceOffset",
        type: "number | channel",
        default: "0",
        desc: (
          <>
            Where along its edge the source end docks, as a fraction of the edge from the
            midpoint, <code className="inline">-0.4</code> to <code className="inline">0.4</code>.
            Positive runs clockwise around the box.{" "}
            <code className="inline">targetOffset</code> does the same for the other end.
            Both read per row like a side, and neither writes to the dataset.
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
        name: "targetOffset",
        type: "number | channel",
        default: "0",
        desc: <>Where along its edge the target end docks; see <code className="inline">sourceOffset</code>.</>,
      },
      {
        name: "targetSide",
        type: 'null | "top" | "right" | "bottom" | "left"',
        default: "null",
        desc: <>Which edge the connector enters the target node by; see <code className="inline">sourceSide</code>.</>,
      },
      {
        name: "format",
        type: "string | fn",
        default: "String",
        desc: (
          <>
            Display formatter for <code className="inline">channels.text</code>: a d3-format
            string, or <code className="inline">(v) ={'>'} string</code>. It formats the label;
            the column keeps its value.
          </>
        ),
      },
      {
        name: "handles",
        type: "boolean | 'hit'",
        default: "true",
        desc: (
          <>
            Endpoint grips, drawn where a channel carries an edit. <code className="inline">'hit'</code> keeps the grip grabbable and
            invisible.
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
    json: ['plot.node'],
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
            once for both parts. A <code className="inline">text</code> channel draws the
            label. Label channels (<code className="inline">fontSize</code>,{" "}
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
        Add the edits you want. Put{" "}
        <code className="inline">move()</code> on <code className="inline">x</code>,{" "}
        <code className="inline">editText()</code> on <code className="inline">text</code>,
        and <code className="inline">edit.network.connect()</code> on a{" "}
        <code className="inline">ports</code> channel. An edit on{" "}
        <code className="inline">x</code>/<code className="inline">y</code> grabs the dot.
      </>
    ),
  },
  {
    name: "channels.ports",
    summary: (
      <>
        A channel on the mark that draws the nodes — <code className="inline">point</code>,{" "}
        <code className="inline">ellipse</code>, <code className="inline">rect</code>,{" "}
        <code className="inline">text</code>, <code className="inline">sticker</code>,{" "}
        <code className="inline">node</code>, <code className="inline">face</code> or a{" "}
        <code className="inline">composite</code>. It puts a dot on the edges a link may
        use, on the shape the mark draws. Put <code className="inline">edit.network.connect()</code>{" "}
        on it to drag new links from the dots.
      </>
    ),
    signatures: [
      "ports: { value | fn | field, edit }",
    ],
    options: [
      {
        name: "value",
        type: 'true | side | side[] | { out, in }',
        default: "—",
        desc: (
          <>
            Which edges get a dot. <code className="inline">true</code> is all four, either
            way. A side or a list of sides is those edges, either way.{" "}
            <code className="inline">{"{ out, in }"}</code> splits them on a directed network:
            links leave by <code className="inline">out</code> and arrive by{" "}
            <code className="inline">in</code>. <code className="inline">false</code> is none.
            Use <code className="inline">fn</code> or <code className="inline">field</code> to
            vary it per node.
          </>
        ),
      },
      {
        name: "edit",
        type: "Edit",
        default: "none",
        desc: (
          <>
            <code className="inline">edit.network.connect()</code> starts a link from a dot.
            With no edit, the dots appear while you drag a link&rsquo;s end, as places to drop it.
          </>
        ),
      },
    ],
    returns: (
      <>
        Dots show where a link can go. Hover a node to see the edges a link can leave
        by. During a drag, the dots that accept the link light up.
      </>
    ),
  },
  {
    name: "edit.network.connect(options)",
    json: ['edit.network.connect'],
    summary: (
      <>
        Drag from a dot to another node to create a link. Put it on the node mark&rsquo;s{" "}
        <code className="inline">ports</code> channel, or on the node mark itself. A dashed
        band follows the pointer. The row gets the columns the{" "}
        <code className="inline">link</code> mark&rsquo;s channels name. A second link
        between one pair needs <code className="inline">multi: true</code> on the links
        table, and a link from a node to itself needs{" "}
        <code className="inline">selfLoops: true</code>.
      </>
    ),
    signatures: [
      "connect({ defaults, threshold, when, stage }) → Edit",
    ],
    options: [
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
        desc: (
          <>
            How near a node&rsquo;s centre a drop connects, in px, when the nodes draw no
            shape. With a shape, a drop anywhere on the node connects, and a dot pins its edge.
          </>
        ),
      },
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "null",
        desc: (
          <>
            Splits drags on a node mark that also carries{" "}
            <code className="inline">move</code>: pair{" "}
            <code className="inline">when.shift</code> with{" "}
            <code className="inline">when.noShift</code>. Leave it out on a{" "}
            <code className="inline">ports</code> channel.
          </>
        ),
      },
    ],
  },
  {
    name: "edit.network.rewire(options)",
    json: ['edit.network.rewire'],
    summary: (
      <>
        Drag a link&rsquo;s end to reconnect it. Put it in a{" "}
        <code className="inline">link</code> mark&rsquo;s <code className="inline">edits</code>.
        Hover a connector to see a handle at each end. Drop the end on a dot to re-point
        it and pin that edge, on a node&rsquo;s body to re-point it, or on empty space to
        remove the link. It follows the links table&rsquo;s{" "}
        <code className="inline">multi</code> and <code className="inline">selfLoops</code>{" "}
        like <code className="inline">connect</code>.
      </>
    ),
    signatures: ["rewire({ channels, threshold, when, stage }) → Edit"],
    options: [
      {
        name: "channels",
        type: "string[]",
        default: '["source", "target"]',
        desc: <>Which ends get a handle.</>,
      },
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
    json: ['edit.network.reverse'],
    summary: (
      <>
        Swap a link’s two ends. Put it on the <code className="inline">link</code> mark;
        it fires on a click anywhere along the line.
      </>
    ),
    signatures: ["reverse({ when, stage }) → Edit"],
    options: [
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "null",
        desc: (
          <>
            Needed when the link mark carries another click edit, such as{" "}
            <code className="inline">remove</code>. On a links table declared{" "}
            <code className="inline">directed: false</code> it logs a warning and leaves the row as it is.
          </>
        ),
      },
    ],
  },
];
