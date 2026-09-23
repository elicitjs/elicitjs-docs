import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "edit({ stage }) · container.setStage / nextStage / getStage",
    summary: (
      <>
        Add <code className="inline">stage</code> to any edit factory. The engine filters edits by the current stage in dispatch, cursor, plane-on-top, and guides — one gate everywhere.
      </>
    ),
    signatures: [
      "move({ stage: 1 })            // active only in stage 1",
      "const el = Elicit({ stage: 0, ... });",
      "el.getStage() → number",
      "el.setStage(n)               // set, emit \"stage\", re-render",
      "el.nextStage()               // setStage(current + 1)",
      "el.on(\"stage\", (n) => …)     // subscribe; returns an unsubscribe fn",
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
            Whether a settled <a href="/editing/probe">probe</a> click moves the chart on. Set <code className="inline">false</code> to answer repeatedly within one stage.
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
