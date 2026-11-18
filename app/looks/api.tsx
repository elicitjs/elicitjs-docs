import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "looks (on Elicit) · experimental",
    json: ['looks.rough', 'looks.sketch', 'looks.cartoon', 'looks.halftone', 'looks.custom'],
    summary: (
      <>
        Import from <code className="inline">elicit.looks</code> and pass in the chart&rsquo;s <code className="inline">looks: [...]</code>. A look changes how the chart is drawn and nothing else. <code className="inline">rough</code> draws in both renderers; the others are shaders and need <code className="inline">CanvasRenderer</code>.
      </>
    ),
    signatures: [
      "looks.rough({ scope?, roughness?, fill?, seed? }) → Look",
      "looks.sketch({ scope?, amount?, grain?, seed? }) → Look",
      "looks.cartoon({ scope?, levels?, outline?, ink? }) → Look",
      "looks.halftone({ scope?, size?, angle? }) → Look",
      "looks.custom(fragment, { scope?, uniforms?, seed? }) → Look",
    ],
    options: [
      {
        name: "scope",
        type: "'marks' | 'frame'",
        default: "'marks'",
        desc: "What the look covers: the marks that draw data, or the whole chart.",
      },
      {
        name: "rough.roughness",
        type: "number",
        default: "1",
        desc: "How far the pen strays, 0 to 3. 0 draws true lines.",
      },
      {
        name: "rough.fill",
        type: "'hachure' | 'solid'",
        default: "'hachure'",
        desc: "How a mark's fill is drawn: hatched with lines, or filled.",
      },
      {
        name: "rough.seed / sketch.seed / custom.seed",
        type: "number",
        default: "1",
        desc: (
          <>
            Picks the randomness. The same seed draws the same chart. A custom shader reads it as <code className="inline">u_seed</code>.
          </>
        ),
      },
      {
        name: "sketch.amount",
        type: "number",
        default: "1.2",
        desc: "How far lines wobble, 0 to 2.",
      },
      {
        name: "sketch.grain",
        type: "number",
        default: "0.25",
        desc: "The strength of the pencil grain, 0 to 1.",
      },
      {
        name: "cartoon.levels",
        type: "number",
        default: "4",
        desc: "Steps of colour per channel, 2 to 16.",
      },
      {
        name: "cartoon.outline",
        type: "number",
        default: "1",
        desc: "The strength of the ink line, 0 to 1.",
      },
      {
        name: "cartoon.ink",
        type: "string",
        default: "near-black",
        desc: "The ink line's colour.",
      },
      {
        name: "halftone.size",
        type: "number",
        default: "5",
        desc: "The distance between dots in px, 2 to 40.",
      },
      {
        name: "halftone.angle",
        type: "number",
        default: "30",
        desc: "The angle of the dot screen, in degrees.",
      },
      {
        name: "custom fragment",
        type: "string",
        default: "—",
        desc: (
          <>
            GLSL ES 1.00 source that defines <code className="inline">vec4 look(vec2 uv)</code>.
          </>
        ),
      },
      {
        name: "custom.uniforms",
        type: "{ [name]: number | number[] }",
        default: "—",
        desc: (
          <>
            Numbers the fragment reads by name. A number is a <code className="inline">float</code>; two to four numbers are a <code className="inline">vec2</code>, <code className="inline">vec3</code> or <code className="inline">vec4</code>.
          </>
        ),
      },
    ],
  },
];
