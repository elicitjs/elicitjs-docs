import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "theme (on Elicit)",
    summary: (
      <>
        The style layer, passed as <code className="inline">theme</code> on <code className="inline">Elicit</code> (or on any widget). A partial, deep-merged over the built-in <code className="inline">DEFAULT_THEME</code> — you name only the tokens you change. Precedence, most specific first: a per-datum channel/option <code className="inline">&gt;</code> <code className="inline">theme.marks[name]</code> <code className="inline">&gt;</code> the theme token <code className="inline">&gt;</code> the renderer default.
      </>
    ),
    signatures: [
      "theme: { extends, ink, accent, muted, handle, handleStroke, background, palette, ramp, diverging,\n         font, title, subtitle, caption, axis, grid, panel, bandPadding, guide, constraint,\n         effects, ghost, widget, marks }",
      'theme: "nyt"   // a named theme — see /theming/themes',
    ],
    options: [
      {
        name: "ink",
        type: "string",
        default: "steelblue",
        desc: <>The primary mark colour — every mark that has no explicit paint channel reads it (bar, point, line, area, rect, …).</>,
      },
      {
        name: "accent",
        type: "string",
        default: "#2563eb",
        desc: <>Interactive emphasis: draggable handles, a committed survey answer, an editable-axis handle.</>,
      },
      {
        name: "muted",
        type: "string",
        default: "#9ca3af",
        desc: <>Secondary ink — a de-emphasised mark, a supporting label.</>,
      },
      {
        name: "handle / handleStroke",
        type: "string",
        default: "#2563eb / #fff",
        desc: <>Grip fill and rim. A <code className="inline">line</code> or <code className="inline">area</code> fills its grips with the series&rsquo; own colour instead, keeping <code className="inline">handleStroke</code> as the rim. A mark&rsquo;s own <code className="inline">handleColor</code> still wins.</>,
      },
      {
        name: "background",
        type: "string | null",
        default: "null",
        desc: <>The chart backdrop, applied as the svg/canvas CSS background (margin band included). <code className="inline">null</code> is transparent (the host page shows through); set it for a self-contained dark-mode chart — see <code className="inline">themes.dark</code>.</>,
      },
      {
        name: "palette / ramp / diverging",
        type: "string[]",
        default: "Tableau10 · blues · RdBu",
        desc: <>Colour-scale defaults for a <code className="inline">fill</code>/<code className="inline">stroke</code> channel that names no explicit range or scheme.</>,
      },
      {
        name: "font",
        type: "{ family, size, labelSize, titleSize }",
        default: "family: null",
        desc: <>Typography. A non-null <code className="inline">family</code> is emitted on the root svg (and used by the canvas renderer) so every label inherits it; the default null inherits the host page's font.</>,
      },
      {
        name: "extends",
        type: "theme name",
        default: "—",
        desc: <>Start from a <a className="underline" href="/theming/themes">named theme</a>; the rest of the object deep-merges over it. A bare string (<code className="inline">theme: "nyt"</code>) is the same as <code className="inline">{'{ extends: "nyt" }'}</code>.</>,
      },
      {
        name: "axis",
        type: "{ stroke, strokeWidth, line, tickSize, tickPadding, labelFill, fontSize, fontFamily, fontWeight, labelAngle, labelAlign, labelOffset, titleFill, titleFontSize, titleFontWeight, titlePadding, titleAnchor, handle, discrete, continuous }",
        default: "grey spine, 6px ticks",
        desc: <>Axis chrome. Each token is also an <a className="underline" href="/marks/axes#styling"><code className="inline">axis()</code> option</a> of the same name, and the option wins. <code className="inline">line: false</code> drops the spine; <code className="inline">tickSize: 0</code> the ticks. <code className="inline">discrete</code> and <code className="inline">continuous</code> override any token for axes of that kind — <code className="inline">{'{ continuous: { line: false } }'}</code> drops the value-axis spine and keeps the category one.</>,
      },
      {
        name: "grid",
        type: "{ stroke, strokeWidth, strokeDash, opacity, show, zero, bandPosition }",
        default: "show: \"none\"",
        desc: <>Gridline paint, and which implicit axes get a grid you did not ask for: <code className="inline">"none"</code>, <code className="inline">"value"</code> (the axis the value runs along), <code className="inline">"continuous"</code> or <code className="inline">"all"</code>. <code className="inline">zero</code> draws an emphasised line at 0, <code className="inline">{'{ stroke, strokeWidth, strokeDash }'}</code>.</>,
      },
      {
        name: "panel",
        type: "{ fill, stroke, strokeWidth }",
        default: "none",
        desc: <>The plot area&rsquo;s own surface, under the grid, and a frame around it. <code className="inline">background</code> covers the margins too.</>,
      },
      {
        name: "bandPadding",
        type: "number",
        default: "0.1",
        desc: <>The gap between bars on a band axis, as a fraction of the step. A channel&rsquo;s <code className="inline">scale: {'{ padding }'}</code> wins.</>,
      },
      {
        name: "guide",
        type: "{ rule, region, legend, bounds, catchment, track }",
        default: "neutral greys",
        desc: <>Guide paint. A dash pattern is spelled <code className="inline">strokeDash</code>, e.g. <code className="inline">guide: {'{ rule: { strokeDash: "5 4" } }'}</code>. <code className="inline">legend</code> also takes <code className="inline">swatchSize</code>, <code className="inline">gap</code>, <code className="inline">swatchRadius</code> (half the size for round chips) and <code className="inline">titleFontWeight</code>.</>,
      },
      {
        name: "title / subtitle / caption",
        type: "{ fill, fontSize, fontWeight, fontFamily, fontStyle }",
        default: "fontSize 16 (weight 600) / 12 / 11",
        desc: <>Text style of the spec&rsquo;s <a className="underline" href="#titles"><code className="inline">title</code>, <code className="inline">subtitle</code> and <code className="inline">caption</code></a>. A null <code className="inline">fill</code> (the default) takes <code className="inline">axis.labelFill</code>.</>,
      },
      {
        name: "constraint",
        type: "{ color }",
        default: "#e4572e",
        desc: <>The colour an edit&rsquo;s <a className="underline" href="/guides">guide</a> draws its bounds, catchment and track in.</>,
      },
      {
        name: "effects",
        type: "object",
        default: "outline + dim",
        desc: <>Theme-level defaults for the <a className="underline" href="/effects">effects</a> layer. A chart&rsquo;s own <code className="inline">effects</code> option layers over it.</>,
      },
      {
        name: "ghost",
        type: "{ opacity, fill, stroke, strokeDash }",
        default: "opacity: 0.45",
        desc: <>How a <a className="underline" href="/editing/probe">probe</a> preview is dimmed: a ghost multiplies its opacity by this, and a non-null fill/stroke/dash overrides the committed paint.</>,
      },
      {
        name: "widget",
        type: "object",
        default: "survey tokens",
        desc: <>Survey-instrument affordance tokens (ring, track, cell, label, question, radius), read live by the widget guides.</>,
      },
      {
        name: "marks",
        type: "Record<mark, style>",
        default: "{}",
        desc: <>Sparse per-mark default overrides, keyed by mark name — e.g. <code className="inline">{'{ bar: { fill: "crimson" } }'}</code>. Beyond paint, <code className="inline">bar.rx</code> and <code className="inline">rect.rx</code> set a corner radius and <code className="inline">point.size</code> a radius.</>,
      },
    ],
  },
  {
    name: "themes",
    summary: (
      <>
        The seventeen <a className="underline" href="/theming/themes">named themes</a>: <code className="inline">default</code>, <code className="inline">survey</code> and <code className="inline">dark</code>, plus fourteen house styles from <a className="underline" href="https://github.com/microsoft/flint-chart">Flint</a>. Each is a partial — pass it (or its name) as <code className="inline">theme</code>, or start from one with <code className="inline">extends</code>.
      </>
    ),
    signatures: [
      "themes.default · survey · dark",
      "themes.nyt · economist · bbc · datawrapper",
      "themes.swiss · nature · deStijl",
      "themes.mckinsey · powerbi · powerbiLight",
      "themes.apple · material · pop · cartoon",
    ],
  },
  {
    name: "setTheme(partial)",
    summary: (
      <>
        Set the application-wide default theme. Every chart created afterwards inherits it unless it passes its own <code className="inline">theme</code>, which layers on top. Pass <code className="inline">null</code> to reset.
      </>
    ),
    signatures: ["setTheme(themes.survey)", "setTheme('economist')", "setTheme({ ink: '#4f46e5' })", "setTheme(null)"],
  },
];
