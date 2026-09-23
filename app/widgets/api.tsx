import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "widgets.likert · multipleChoice · slider · matrix · lineCone · ranking · allocation · …",
    summary: (
      <>
        Import from <code className="inline">elicit.widgets</code>. Each returns an <code className="inline">ElicitSpec</code>; pass it straight to <code className="inline">Elicit</code>. The chart elicits one dataset, so <code className="inline">getData()</code> reads the answer.
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
      "interval({ question, category, mean, lo, hi, domain, onChange }) → ElicitSpec",
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
            <code className="inline">lineCone</code>: the two variable names labelled on the crosshair, and the starting correlation and its width.
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
        An <b>ElicitSpec</b> — an ordinary spec, so you can read it, change one key, and pass it on. The chrome each widget draws itself with is a <a href="/guides">guide</a>: <code className="inline">guides.prompt</code>, <code className="inline">guides.optionRings</code>, <code className="inline">guides.cellGrid</code>, <code className="inline">guides.sliderTrack</code>, <code className="inline">guides.crosshair</code>. The plain-API twins below use those same guides, so each block stands alone.
      </>
    ),
  },
];
