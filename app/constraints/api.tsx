import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "Built-in constraints",
    summary: (
      <>
        Import from <code className="inline">elicit.constraints</code> and pass on the <code className="inline">Elicit</code> spec’s <code className="inline">constraints: [...]</code>. That is the only place they go: a constraint gates every edit from every mark, so writing one inside a mark would say something the engine does not mean. All are pure data invariants — they run on every commit and never see pixels.
      </>
    ),
    signatures: [
      "clamp({ min, max, field }) → Constraint",
      "maintainSum({ total, field, strategy }) → Constraint",
      "count({ max, strategy }) → Constraint",
      "unique({ field, max, strategy }) → Constraint",
      "snap({ field, step, origin }) → Constraint",
      "ordering({ field, strategy }) → Constraint",
      "monotonic({ field, along, dir, series }) → Constraint",
      "spacing({ field, min, series }) → Constraint",
    ],
    options: [
      {
        name: "clamp.min / max",
        type: "number",
        default: "field domain",
        desc: "Bounds the active datum’s field to [min, max]; an omitted bound falls back to the field’s declared domain.",
      },
      {
        name: "clamp.field",
        type: "string",
        default: "the edited column",
        desc: "The data field to bound.",
      },
      {
        name: "maintainSum.total",
        type: "number",
        default: "—",
        desc: "Target total for the field.",
      },
      {
        name: "maintainSum.strategy",
        type: "'cap' | 'normalize' | 'redistribute'",
        default: "'cap'",
        desc: (
          <>
            <code className="inline">cap</code> bounds the touched datum (≤ sum); <code className="inline">normalize</code> scales all values to exact sum; <code className="inline">redistribute</code> holds the edited value and proportionally adjusts siblings.
          </>
        ),
      },
      {
        name: "count.max",
        type: "number",
        default: "∞",
        desc: "Maximum number of data rows.",
      },
      {
        name: "count.strategy",
        type: "'replace' | 'reject'",
        default: "'replace'",
        desc: "Over the limit: drop the oldest (keep newest max) or refuse the interaction.",
      },
      {
        name: "unique.field",
        type: "string | string[]",
        default: "the edited column",
        desc: "Category key(s); an array makes a composite (per-cell) key.",
      },
      {
        name: "unique.max / strategy",
        type: "number / string",
        default: "1 / 'reject'",
        desc: "How many may share a key, and whether to reject or replace the resident.",
      },
      {
        name: "snap.step / origin",
        type: "number",
        default: "—",
        desc: "Quantize the field to a grid (slider steps, waffle cells).",
      },
      {
        name: "ordering.field",
        type: "string[]",
        default: "—",
        desc: (
          <>
            Fields of one row that must stay in this order — <code className="inline">["lo", "mean", "hi"]</code> means lo ≤ mean ≤ hi. <code className="inline">lower</code>/<code className="inline">upper</code> are sugar for the two-field case.
          </>
        ),
      },
      {
        name: "ordering.strategy",
        type: "'push' | 'block'",
        default: "'push'",
        desc: (
          <>
            <code className="inline">push</code> repairs — the field you dragged wins and its neighbours give way, so the interval <i>moves</i>. <code className="inline">block</code> rejects instead, for an elicitation where the bounds are given and only the estimate inside them moves.
          </>
        ),
      },
      {
        name: "monotonic.field / along",
        type: "string",
        default: "the edited column / 'x'",
        desc: (
          <>
            The value that may never reverse, and the axis it runs along. Where <code className="inline">ordering</code> keeps <b>fields</b> of one row in order, this keeps <b>rows</b> in order along an axis. Rows are sorted by <code className="inline">along</code>, not by array position, so an appended anchor lands in the right place.
          </>
        ),
      },
      {
        name: "monotonic.dir",
        type: "'up' | 'down'",
        default: "'up'",
        desc: (
          <>
            <code className="inline">up</code> = non-decreasing (a CDF, a budget burning up); <code className="inline">down</code> = non-increasing (a survival curve).
          </>
        ),
      },
      {
        name: "spacing.field / min",
        type: "string / number",
        default: "the edited column / 1",
        desc: (
          <>
            Adjacent values of <code className="inline">field</code> stay at least <code className="inline">min</code> apart, in <b>data</b> units — never pixels. Implies an order too (pushing apart preserves the sort), so a field with <code className="inline">spacing</code> needs no <code className="inline">ordering</code>.
          </>
        ),
      },
      {
        name: "monotonic.series / spacing.series",
        type: "string | null",
        default: "null",
        desc: "Group rows by this field first, so each line of a multi-series chart is judged on its own.",
      },
    ],
    returns: (
      <>
        Each returns a <b>Constraint</b> — a reducer the engine runs on the proposed dataset after every edit.
      </>
    ),
  },
  {
    name: "constraints.custom(apply, meta?)",
    summary: (
      <>
        Author your own. One word for “author your own X” in every grammar namespace — cf. <code className="inline">edit.custom</code> and <code className="inline">guides.custom</code>. (<code className="inline">authoring.defineConstraint</code> is the same function, under the name a mark author reaches for.) Every constraint is a descriptor — <code className="inline">{'{ type, field?, options, apply }'}</code> — and <code className="inline">field</code> left out means the column the dispatching edit writes, so a one-column instrument names nothing twice. The rule gets a pure-data context and returns the shape that’s natural.
      </>
    ),
    signatures: [
      "constraints.custom(({ data, oldData, activeIndex, active, field, fields, value, domain, table, tables }) => result, meta?) → Constraint",
    ],
    options: [
      {
        name: "return number",
        type: "—",
        default: "—",
        desc: (
          <>
            The constrained value for the active datum’s <code className="inline">field</code>.
          </>
        ),
      },
      {
        name: "return object",
        type: "—",
        default: "—",
        desc: "Fields merged into the active datum.",
      },
      {
        name: "return array",
        type: "—",
        default: "—",
        desc: "A full replacement dataset (cross-datum rules: sum, unique, count).",
      },
      {
        name: "return false",
        type: "—",
        default: "—",
        desc: "Reject the whole interaction.",
      },
      {
        name: "return true / undefined",
        type: "—",
        default: "—",
        desc: "Accept unchanged.",
      },
      {
        name: "meta.field",
        type: "string",
        default: "'y'",
        desc: "The field the invariant governs (for value rules + guides).",
      },
      {
        name: "meta.guide",
        type: "function",
        default: "—",
        desc: (
          <>
            Optional drawer so an edit with <code className="inline">guide:true</code> can show this constraint’s bounds.
          </>
        ),
      },
    ],
    returns: (
      <>
        A <b>Constraint</b>. The <code className="inline">ctx.active</code> is the datum the gesture touched; <code className="inline">domain</code> is that field’s declared data range.
      </>
    ),
  },
];
