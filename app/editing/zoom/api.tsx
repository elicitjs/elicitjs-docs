import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit.axis.zoom(options)",
    summary: (
      <>
        The wheel narrows or widens the axis&rsquo;s domain about the value under the pointer. It writes the schema&rsquo;s domain, never the dataset. Place it on an axis: <code className="inline">{'axes: { x: { edit: edit.axis.zoom() } }'}</code>.
      </>
    ),
    signature: "edit.axis.zoom({ factor, limit, minSpan, field, when }) → Edit",
    options: [
      {
        name: "factor",
        type: "number",
        default: "1.2",
        desc: "How much one wheel notch (100 px of wheel travel) scales the span. Scrolling up divides the span by it; scrolling down multiplies.",
      },
      {
        name: "limit",
        type: "'declared' | [lo, hi] | false",
        default: "'declared'",
        desc: "The widest the domain may zoom out to: the field's domain as declared in the schema, an explicit range, or false for no limit.",
      },
      {
        name: "minSpan",
        type: "number",
        default: "—",
        desc: "The narrowest span the domain may zoom in to, in data units.",
      },
      {
        name: "field",
        type: "string",
        default: "every field on the axis",
        desc: "The one field whose domain to write, when several fields share the axis.",
      },
      {
        name: "when",
        type: "(ctx) => boolean",
        default: "—",
        desc: (
          <>
            Gate the zoom on a modifier key. <code className="inline">when.alt</code> on one axis and <code className="inline">when.noAlt</code> on the other zooms them separately.
          </>
        ),
      },
    ],
    returns: (
      <>
        An <b>Edit</b> scoped to <code className="inline">axis</code>. It acts on a continuous scale (numeric or temporal). A burst of wheel ticks is one undo step.
      </>
    ),
  },
  {
    name: "el.setDomain(field, domain, options)",
    summary: (
      <>
        Write a field&rsquo;s domain from outside the chart — a zoom button, a reset control. The same commit a wheel tick makes: undoable, notified through <code className="inline">change</code>, and every scale reflows.
      </>
    ),
    signatures: [
      "el.setDomain(\"x\", [20, 40])   // → true",
      "el.setDomain(\"x\", null)       // restore the declared domain",
      "el.setDomain(\"weight\", [0, 5], { table: \"links\" })",
    ],
    options: [
      {
        name: "field",
        type: "string",
        default: "—",
        desc: "The schema field to write. It writes that one field, as given.",
      },
      {
        name: "domain",
        type: "any[] | null",
        default: "—",
        desc: "The new domain, or null for the domain declared in the schema.",
      },
      {
        name: "options.table",
        type: "string",
        default: "the primary table",
        desc: "The table that declares the field.",
      },
    ],
    returns: (
      <>
        <code className="inline">true</code> when it wrote the domain. <code className="inline">false</code>, with a warning, when the table declares no such field or there is no declared domain to restore.
      </>
    ),
  },
];
