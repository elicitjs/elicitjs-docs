import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit.axis.zoom(options)",
    json: ['edit.axis.zoom'],
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
    name: "edit.axis.pan(options)",
    json: ['edit.axis.pan'],
    summary: (
      <>
        Dragging the plot slides the axis&rsquo;s domain along. It writes the schema&rsquo;s domain, never the dataset, and composes with <code className="inline">edit.axis.zoom()</code> on the same axis: <code className="inline">{'axes: { x: { edits: [edit.axis.zoom(), edit.axis.pan()] } }'}</code>.
      </>
    ),
    signature: "edit.axis.pan({ limit, field, when }) → Edit",
    options: [
      {
        name: "limit",
        type: "'declared' | [lo, hi] | false",
        default: "'declared'",
        desc: "How far it may pan: the field's domain as declared in the schema, an explicit range, or false for no limit. At the limit the view stops and keeps its span.",
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
            Gate the pan on a modifier key, e.g. <code className="inline">when.shift</code> to pan only with Shift held.
          </>
        ),
      },
    ],
    returns: (
      <>
        An <b>Edit</b> scoped to <code className="inline">axis</code>. It acts on a continuous scale (numeric or temporal). A press on a mark with its own edit edits the mark. One drag is one undo step.
      </>
    ),
  },
  {
    name: "clip",
    summary: (
      <>
        A spec option. Clips the marks to the plot area, axis to axis. Only the part of a mark inside the clip takes a press or shows a tip. Axes, legends, guides and marks with <code className="inline">clip: false</code> keep drawing in the margins.
      </>
    ),
    signatures: [
      "Elicit({ clip: true | false, … })",
      "Elicit({ clip: { pad: 6 }, … })",
      "Elicit({ clip: { pad: { top: 4, bottom: 4 } }, … })",
      "text({ clip: false, … })   // on a mark",
    ],
    options: [
      {
        name: "clip",
        type: "boolean | { pad }",
        default: "on with zoom or pan",
        desc: (
          <>
            On by default when an axis carries <code className="inline">edit.axis.zoom()</code> or <code className="inline">edit.axis.pan()</code>, off otherwise. The object form turns it on.
          </>
        ),
      },
      {
        name: "pad",
        type: "number | { top, right, bottom, left }",
        default: "0",
        desc: "Pixels past the plot area the marks still draw: one number for every side, or a number per side.",
      },
      {
        name: "clip (on a mark)",
        type: "boolean",
        default: "follows the chart",
        desc: (
          <>
            <code className="inline">false</code> draws the mark past the clip. On a <code className="inline">composite</code>, it applies to every part.
          </>
        ),
      },
    ],
  },
  {
    name: "chart.setDomain(field, domain, options)",
    json: false,
    summary: (
      <>
        Write a field&rsquo;s domain from outside the chart — a zoom button, a reset control. The same commit a wheel tick or a pan makes: undoable, notified through <code className="inline">change</code>, and every scale reflows.
      </>
    ),
    signatures: [
      "chart.setDomain(\"x\", [20, 40])   // → true",
      "chart.setDomain(\"x\", null)       // restore the declared domain",
      "chart.setDomain(\"weight\", [0, 5], { table: \"links\" })",
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
