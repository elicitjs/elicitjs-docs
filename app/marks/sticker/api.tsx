import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "sticker(options)",
    summary: (
      <>
        Import from <code className="inline">elicit.plot</code>. A rounded box with text
        inside, sized by the text. A preset over{" "}
        <code className="inline">composite</code>, so it desugars into an ordinary{" "}
        <code className="inline">rect</code> and <code className="inline">text</code>.
      </>
    ),
    signatures: [
      "sticker({ channels, padding, radius, maxWidth, minWidth, minHeight, lineHeight, fontFamily, format, table, edits, id }) → Feature[]",
    ],
    options: [
      {
        name: "channels",
        type: "object",
        default: "{}",
        desc: (
          <>
            <code className="inline">x</code>/<code className="inline">y</code> place the
            box and are shared by both parts. <code className="inline">text</code> is the
            string it holds. Label channels (<code className="inline">fontSize</code>,{" "}
            <code className="inline">textAnchor</code>, <code className="inline">dx</code>,{" "}
            <code className="inline">dy</code>) go to the text; every other channel (
            <code className="inline">fill</code>, <code className="inline">stroke</code>,{" "}
            <code className="inline">opacity</code>, <code className="inline">angle</code>)
            goes to the box. <code className="inline">width</code> and{" "}
            <code className="inline">height</code> pin a dimension and turn auto-sizing off
            for that axis; a pinned <code className="inline">width</code> is also the width
            the text wraps at, so a note resized narrower re-flows and grows taller.
          </>
        ),
      },
      {
        name: "padding",
        type: "number",
        default: "10",
        desc: <>Space between the text and the box’s edge, in px.</>,
      },
      {
        name: "radius",
        type: "number",
        default: "6",
        desc: <>Corner radius in px. Set <code className="inline">0</code> for square corners.</>,
      },
      {
        name: "maxWidth",
        type: "number",
        default: "160",
        desc: (
          <>
            The box stops growing here and the text wraps instead. Also the wrap width, so
            a long note gets taller rather than wider. A <code className="inline">width</code>{" "}
            channel replaces it on both counts.
          </>
        ),
      },
      {
        name: "minWidth",
        type: "number",
        default: "60",
        desc: <>Keeps an empty or one-word note from collapsing to nothing.</>,
      },
      {
        name: "minHeight",
        type: "number",
        default: "0",
        desc: <>A floor for the box’s height, in px.</>,
      },
      {
        name: "lineHeight",
        type: "number",
        default: "1.35 × fontSize",
        desc: <>Baseline step between wrapped lines, in px.</>,
      },
      {
        name: "fontSize",
        type: "number",
        default: "13",
        desc: (
          <>
            Used to measure as well as to draw, so the box matches what is painted. A{" "}
            <code className="inline">fontSize</code> channel still reaches the label, but
            the box is measured at this value.
          </>
        ),
      },
      {
        name: "fontFamily",
        type: "string",
        default: "the theme’s font",
        desc: <>Measured with, when your page font differs from the theme’s.</>,
      },
      {
        name: "format",
        type: "string | fn",
        default: "String",
        desc: (
          <>
            Display formatter for the <code className="inline">text</code> channel: a
            d3-format string, or <code className="inline">(v) ={'>'} string</code>.
            Display-only — the column stays raw, so{" "}
            <code className="inline">editText</code> still writes the real value.
          </>
        ),
      },
    ],
    returns: (
      <>
        Carries no edits of its own, like every mark. Put{" "}
        <code className="inline">move({'{ channels: ["x", "y"], mode: "relative" }'})</code> on{" "}
        <code className="inline">x</code> and{" "}
        <code className="inline">editText({"{ multiline: true }"})</code> in{" "}
        <code className="inline">edits</code>. Both land on the box: you drag and
        double-click the note, not its letters. Prefer{" "}
        <code className="inline">mode: &quot;relative&quot;</code> — an absolute move puts the
        box&rsquo;s centre at the pointer, which snaps a note you grabbed by its corner.
      </>
    ),
  },
  {
    name: "editText(options)",
    summary: (
      <>
        Write a typed string back into the <code className="inline">text</code> channel’s
        field. Double-click opens an editor over the mark; Enter or clicking away commits,
        Escape cancels.
      </>
    ),
    signatures: ["editText({ multiline, channels, when, stage }) → Edit"],
    options: [
      {
        name: "multiline",
        type: "boolean",
        default: "false",
        desc: (
          <>
            Use a textarea, in which Enter inserts a newline and Cmd/Ctrl+Enter commits.
            Pair it with <code className="inline">sticker</code>, whose text wraps.
          </>
        ),
      },
      {
        name: "channels",
        type: "string[]",
        default: '["text"]',
        desc: <>Which channel’s field to write. The default is right almost always.</>,
      },
    ],
  },
];
