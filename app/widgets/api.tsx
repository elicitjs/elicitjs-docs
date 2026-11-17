import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "widgets.likert · multipleChoice · slider · matrix · lineCone · ranking · allocation · …",
    json: ['widgets.allocation', 'widgets.histogram', 'widgets.interval', 'widgets.labeledValue', 'widgets.likert', 'widgets.lineCone', 'widgets.matrix', 'widgets.multipleChoice', 'widgets.probabilityTokens', 'widgets.ranking', 'widgets.region', 'widgets.slider', 'widgets.thermometer'],
    summary: (
      <>
        Import from <code className="inline">elicit.widgets</code>. Each returns an <code className="inline">ElicitSpec</code>; pass it straight to <code className="inline">Elicit</code>. The chart draws one dataset, so <code className="inline">getData()</code> reads the answer.
      </>
    ),
    signatures: [
      "likert({ question, options, value, onChange }) → ElicitSpec",
      "multipleChoice({ question, options, max, value, onChange }) → ElicitSpec",
      "slider({ question, domain, step, value, format, onChange }) → ElicitSpec",
      "thermometer({ question, domain, step, value, onChange }) → ElicitSpec",
      "matrix({ question, questions, options, value, onChange }) → ElicitSpec",
      "ranking({ question, items, onChange }) → ElicitSpec",
      "allocation({ question, categories, total, values, onChange }) → ElicitSpec",
      "histogram({ question, bins, max, values, onChange }) → ElicitSpec",
      "probabilityTokens({ question, bins, maxTokens, onChange }) → ElicitSpec",
      "interval({ question, category, mean, lo, hi, domain, symmetric, onChange }) → ElicitSpec",
      "region({ question, xDomain, yDomain, x1, x2, y1, y2, onChange }) → ElicitSpec",
      "lineCone({ question, x, y, r, spread, render, samples, seed, onChange }) → ElicitSpec",
      "labeledValue({ question, input, value, domain, label, onChange }) → ElicitSpec",
    ],
    options: [
      {
        name: "question",
        type: "string",
        default: "per widget",
        desc: "The prompt, drawn into the top margin so it travels with the chart.",
      },
      {
        name: "onChange",
        type: "(data) => void",
        default: "—",
        desc: "Called with the committed answer. Hover previews never fire it.",
      },
      {
        name: "width / height / stage / theme",
        type: "—",
        default: "per widget",
        desc: (
          <>
            The ordinary spec options, passed through. Every widget takes them, so a survey can size and theme its instruments in one place. See <a href="/theming">Theming</a> and <a href="/editing/stages">Stages</a>.
          </>
        ),
      },
      {
        name: "options",
        type: "any[]",
        default: "[]",
        desc: (
          <>
            The response choices, on a band scale — <code className="inline">likert</code>, <code className="inline">multipleChoice</code>, <code className="inline">matrix</code>.
          </>
        ),
      },
      {
        name: "value / values",
        type: "any / any[]",
        default: "—",
        desc: (
          <>
            The starting answer. Singular where there is one (<code className="inline">likert</code>, <code className="inline">slider</code>, <code className="inline">thermometer</code>, <code className="inline">labeledValue</code>); plural where there is one per category (<code className="inline">allocation</code>, <code className="inline">histogram</code>).
          </>
        ),
      },
      {
        name: "max",
        type: "number",
        default: "∞",
        desc: (
          <>
            <code className="inline">multipleChoice</code>: how many picks are allowed, over the limit rejected. <code className="inline">histogram</code>: the top of the count axis.
          </>
        ),
      },
      {
        name: "domain / step",
        type: "[min, max] / number",
        default: "[0, 100] / —",
        desc: (
          <>
            <code className="inline">slider</code>, <code className="inline">thermometer</code>, <code className="inline">labeledValue</code>, <code className="inline">interval</code>: the value range, and the increment answers snap to.
          </>
        ),
      },
      {
        name: "format",
        type: "string | fn",
        default: "auto",
        desc: (
          <>
            <code className="inline">slider</code>: how the end labels read.
          </>
        ),
      },
      {
        name: "questions",
        type: "any[]",
        default: "[]",
        desc: (
          <>
            <code className="inline">matrix</code>: the rows, one question each.
          </>
        ),
      },
      {
        name: "items",
        type: "any[]",
        default: "['A','B','C','D']",
        desc: (
          <>
            <code className="inline">ranking</code>: what is being put in order.
          </>
        ),
      },
      {
        name: "categories / total",
        type: "any[] / number",
        default: "['A','B','C','D'] / 100",
        desc: (
          <>
            <code className="inline">allocation</code>: what the budget is split between, and how much there is. The remainder is drawn for you.
          </>
        ),
      },
      {
        name: "bins / maxTokens",
        type: "any[] / number",
        default: "— / 20",
        desc: (
          <>
            <code className="inline">histogram</code> and <code className="inline">probabilityTokens</code>: the buckets, and how many tokens there are to place.
          </>
        ),
      },
      {
        name: "category / mean / lo / hi",
        type: "string / number",
        default: "'estimate' / 50 / 30 / 70",
        desc: (
          <>
            <code className="inline">interval</code>: what is being estimated, and the starting estimate with its bounds.
          </>
        ),
      },
      {
        name: "symmetric",
        type: "boolean",
        default: "false",
        desc: (
          <>
            <code className="inline">interval</code>: drag one cap and the other mirrors it about the mean. It adds <code className="inline">constraints.symmetric</code> to the widget’s <code className="inline">follow</code>, <code className="inline">ordering</code> and <code className="inline">clamp</code>.
          </>
        ),
      },
      {
        name: "xDomain / yDomain / x1 / x2 / y1 / y2",
        type: "[min,max] / number",
        default: "[0,10] / 3 · 7",
        desc: (
          <>
            <code className="inline">region</code>: the two axes, and the starting corners of the box.
          </>
        ),
      },
      {
        name: "x / y / r / spread",
        type: "string / number",
        default: "'x' / 'y' / 0 / 0",
        desc: (
          <>
            <code className="inline">lineCone</code>: the two variable names labelled on the quadrant frame, and the starting correlation and its width.
          </>
        ),
      },
      {
        name: "render / samples / seed",
        type: "string / number",
        default: "'samples' / 60 / 7",
        desc: (
          <>
            <code className="inline">lineCone</code>: how the spread is drawn, how many sample lines it uses, and the seed that keeps them stable across renders.
          </>
        ),
      },
      {
        name: "input / label",
        type: "'number' | 'text' / string",
        default: "'number' / 'value'",
        desc: (
          <>
            <code className="inline">labeledValue</code>: which editor the answer takes, and the name beside it.
          </>
        ),
      },
    ],
    returns: (
      <>
        An <b>ElicitSpec</b> — an ordinary spec, so you can read it, change one key, and pass it on. The chrome each widget draws itself with is a <a href="/guides">guide</a>: <code className="inline">guides.prompt</code>, <code className="inline">guides.options</code>, <code className="inline">guides.cellGrid</code>, <code className="inline">guides.sliderTrack</code>, <code className="inline">guides.quadrants</code>. The plain-API twins below use those same guides, so each block stands alone.
      </>
    ),
  },
  {
    name: "theme.widget",
    json: ['spec'],
    summary: (
      <>
        The widget tokens, set through <code className="inline">theme</code> on a widget, on <code className="inline">Elicit</code> or with <code className="inline">setTheme</code>. <code className="inline">design</code> names the <a href="#designs">design</a>; the others are the colours and sizes it reads. A widget takes its theme when it is built.
      </>
    ),
    signatures: [
      'theme: "survey" | "surveyBlocks" | "surveyLines"',
      'theme: { extends: "survey", widget: { design, accent, corner, … } }',
    ],
    options: [
      { name: "design", type: '"ring" | "box" | "block" | "line" | string', default: '"ring"', desc: <>How the widgets are drawn: a built-in design, or one you <a href="#new-design">registered</a>.</> },
      { name: "accent / onAccent", type: "string", default: '"#2563eb" / "#ffffff"', desc: "A committed answer, and the text and ticks drawn on it." },
      { name: "tint", type: "string", default: '"#e9f0fe"', desc: "A chosen option's wash in the box design, and a grabbed card's in the block design." },
      { name: "surface / soft / stroke", type: "string", default: "white / light grey / grey", desc: "An option box or a card, a filled block or a bar's track, and the edge of a box or a card." },
      { name: "ring / track", type: "string", default: '"#cbd5e1" / "#e2e8f0"', desc: "An empty control, and a track or a hairline." },
      { name: "cellFill / cellStroke", type: "string", default: '"#f8fafc" / "#e2e8f0"', desc: "A matrix cell in the ring design." },
      { name: "label / question", type: "string", default: '"#334155" / "#0f172a"', desc: "An option's label, and the prompt." },
      { name: "grip / shadow", type: "string", default: "grey / translucent black", desc: "A ranking card's drag handle, and the shadow under a lifted card." },
      { name: "labelSize / itemSize", type: "number", default: "12 / 13", desc: "The text size of an option's label, and of a list row or a card." },
      { name: "questionSize / questionWeight", type: "number", default: "13 / 400", desc: "The prompt's size and weight." },
      { name: "radius", type: "number", default: "11", desc: "The radius of a ring or a radio, and half a checkbox's side." },
      { name: "corner", type: "number", default: "10", desc: "The corner radius of a box, a block or a card." },
      { name: "gap", type: "number", default: "8", desc: "The space between options and between cards." },
      { name: "optionHeight / rowHeight", type: "number", default: "74 / 40", desc: "The height of an option in a row of boxes, and of a list row or a card." },
    ],
  },
  {
    name: "authoring.registerDesign(name, design)",
    json: false,
    summary: (
      <>
        Adds a design. Every widget then draws with it when <code className="inline">theme.widget.design</code> names it. State the parts you change; the rest come from <code className="inline">extends</code>. See <a href="#new-design">Add a design</a>.
      </>
    ),
    signatures: [
      "authoring.registerDesign(name, { extends, list, tiles, option, answer, grid, track, thumb, card, slots, bar, theme })",
      "authoring.designNames() → string[]",
      "authoring.labelNode(text, x, y, tokens, { width, anchor, fill, fontSize, fontWeight }) → node",
      "authoring.checkNode(cx, cy, tokens) → node",
      "authoring.controlNodes(cx, cy, control, selected, tokens) → node[]",
    ],
    options: [
      { name: "extends", type: "string", default: '"ring"', desc: "The design to take the unstated parts from." },
      { name: "list / tiles", type: "boolean", default: "false", desc: <>
        <code className="inline">list</code> stacks multiple choice as a list. <code className="inline">tiles</code> sizes the plot to the options from <code className="inline">optionHeight</code>, <code className="inline">rowHeight</code> and <code className="inline">gap</code>.
      </> },
      { name: "option", type: "(option, tokens) => node[]", default: "from extends", desc: "Draws one option: its box, its empty control and its label." },
      { name: "answer", type: "(option, tokens) => { shape, size, corner, left, top }", default: "from extends", desc: <>The answer&apos;s ink: a <code className="inline">dot</code> or a <code className="inline">square</code> on the control, or a <code className="inline">block</code> that fills the option.</> },
      { name: "grid / slots", type: "(box, tokens) => node[]", default: "from extends", desc: "Chrome around a whole matrix, and the lines between a ranking list's slots." },
      { name: "track / thumb", type: "(track, tokens) => node[] / (tokens) => { size, fill, stroke, strokeWidth }", default: "from extends", desc: "A slider's track, and its handle." },
      { name: "card", type: "(card, tokens) => part[]", default: "from extends", desc: <>A ranking card&apos;s parts, back to front: <code className="inline">body</code>, <code className="inline">badge</code>, <code className="inline">rank</code>, <code className="inline">label</code>, <code className="inline">grip</code>. Each takes <code className="inline">left</code> or <code className="inline">right</code> and its paint.</> },
      { name: "bar", type: "(tokens) => { corner, fillOpacity, track }", default: "from extends", desc: "A bar in the widgets drawn on chart axes." },
      { name: "theme", type: "ThemeSpec", default: "—", desc: <>Registers a named theme under the design&apos;s name, with <code className="inline">widget.design</code> set to it.</> },
    ],
  },
];
