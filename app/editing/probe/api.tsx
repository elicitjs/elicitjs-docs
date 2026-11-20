import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "anyEdit({ pick: \"probe\", stage, advance })",
    json: ['edit'],
    summary: (
      <>
        Not a new edit — a <b>pick</b> you give an existing one. It runs that edit twice. On <code className="inline">hover</code> or <code className="inline">drag</code> the proposal is parked as a preview and drawn as an inert <b>ghost</b>; on <code className="inline">click</code> or <code className="inline">dragend</code> the same proposal is committed. The ghost is therefore exactly what a commit writes. Both gestures settle, so a knob can be dragged as well as clicked.
      </>
    ),
    signatures: [
      "rotate({ pick: \"probe\", stage: 0 })          // line follows the pointer; click sets it",
      "move({ pick: \"probe\", advance: false })      // a knob that tracks then settles",
      "create({ pick: \"probe\", advance: false })    // a tentative dot, made real on click",
      "toggle({ pick: \"probe\", channels: [\"x\",\"y\"] })  // preview a cell being (un)picked",
    ],
    options: [
      {
        name: "stage",
        type: "number",
        default: "null",
        desc: "Active only in this stage. A click settling it advances the chart to the next stage, freezing the field.",
      },
      {
        name: "advance",
        type: "boolean",
        default: "true",
        desc: (
          <>
            Set <code className="inline">false</code> so a click commits without advancing — the edit stays live for repeated answers.
          </>
        ),
      },
    ],
    returns: (
      <>
        Previews never reach <code className="inline">onChange</code>, <code className="inline">getData</code> or the belief store; leaving the plot discards the proposal. Constraints run on the preview too, so a rejected value never even previews.
      </>
    ),
  },
  {
    name: "edit({ stage }) · container.setStage / nextStage / getStage",
    json: false,
    summary: (
      <>
        Add <code className="inline">stage</code> to any edit factory. The engine filters edits by the current stage in dispatch, cursor, plane-on-top, and guides — one gate everywhere.
      </>
    ),
    signatures: [
      "move({ stage: 1 })            // active only in stage 1",
      "const chart = Elicit({ stage: 0, ... });",
      "chart.getStage() → number",
      "chart.setStage(n)            // set, emit \"stage\", re-render",
      "chart.nextStage()            // setStage(current + 1)",
      "chart.on(\"stage\", (n) => …)  // subscribe; returns an unsubscribe fn",
    ],
    options: [
      {
        name: "edit.stage",
        type: "number",
        default: "null",
        desc: "The stage this edit is active in. Unset, it is active in every stage.",
      },
      {
        name: "spec.stage",
        type: "number",
        default: "0",
        desc: "Which stage the chart starts on.",
      },
      {
        name: "spec.stageLabels",
        type: "string[]",
        default: "[]",
        desc: "A caption per stage, read back with getStageLabel().",
      },
      {
        name: "edit.advance",
        type: "boolean",
        default: "true",
        desc: (
          <>
            Whether a settled <a href="#preview">probe</a> click moves the chart on. Set <code className="inline">false</code> to answer repeatedly within one stage.
          </>
        ),
      },
    ],
    returns: (
      <>
        <code className="inline">setStage</code> and <code className="inline">nextStage</code> emit <code className="inline">stage</code> and re-render. The stage gates dispatch, the cursor, plane pick order, and guides, so an edit outside the current stage is inert everywhere at once.
      </>
    ),
  },
];
