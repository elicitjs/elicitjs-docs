import type { NavGroup } from "./types";

export const SITE: NavGroup[] = [
  {
    group: "Getting started",
    pages: [
      { href: "/", title: "Intro" },
      { href: "/overview", title: "Overview" },
      { href: "/concepts", title: "Core concepts" },
      { href: "/concepts/contracts", title: "Mark & element contracts" },
      { href: "/sizing", title: "Responsive sizing" },
      { href: "/renderers", title: "Renderers (SVG · Canvas)" },
      { href: "/authoring", title: "Authoring SDK" },
    ],
  },
  {
    group: "Marks",
    pages: [
      { href: "/concepts/contracts", title: "Contracts (all factories)" },
      { href: "/marks/bar", title: "Bar" },
      { href: "/marks/rect", title: "Rect" },
      { href: "/marks/area", title: "Area" },
      { href: "/marks/tick", title: "Tick" },
      { href: "/marks/point", title: "Point & Dot" },
      { href: "/marks/ellipse", title: "Ellipse" },
      { href: "/marks/curve", title: "Curve" },
      { href: "/marks/symbol", title: "Symbol & Emoji" },
      { href: "/marks/face", title: "Face (emotion)" },
      { href: "/marks/text", title: "Text" },
      { href: "/marks/line", title: "Line" },
      { href: "/marks/composite", title: "Composite & glyph boxes" },
      { href: "/marks/dotstack", title: "Stacked dots" },
      { href: "/marks/waffle", title: "Waffle" },
      { href: "/marks/needle", title: "Needle" },
      { href: "/marks/axis-radial", title: "Radial axis" },
      { href: "/marks/arc", title: "Arc · Pie · Donut" },
      { href: "/marks/geo", title: "Geo" },
      { href: "/marks/network", title: "Network (nodes & links)" },
      { href: "/marks/trend", title: "Trend + Band" },
      { href: "/marks/axes", title: "Axis, Grid & Rule" },
      { href: "/marks/legend", title: "Legend" },
    ],
  },
  {
    group: "Editing",
    pages: [
      { href: "/editing", title: "Overview" },
      {
        href: "/editing/gestures",
        title: "Move · Resize · Slide · Rotate · Cycle · Custom",
      },
      { href: "/editing/sweep", title: "Sweep (you-draw-it)" },
      { href: "/editing/lock", title: "Locked rows (read-only)" },
      { href: "/editing/existence", title: "Create · Remove · Anchors" },
      { href: "/editing/probe", title: "Probe (ghost · settle)" },
      { href: "/editing/history", title: "History & keyboard" },
      { href: "/editing/stages", title: "Stages (multi-step)" },
      {
        href: "/editing/external-controls",
        title: "External controls (UI · functions)",
      },
      { href: "/editing/axis", title: "Editable axes (domain)" },
    ],
  },
  {
    group: "Widgets",
    pages: [{ href: "/widgets", title: "Survey instruments" }],
  },
  {
    group: "Scales & data",
    pages: [
      { href: "/scales", title: "Scales & channels" },
      { href: "/schema", title: "Data schema" },
      { href: "/constraints", title: "Constraints" },
    ],
  },
  {
    group: "Feedback",
    pages: [
      { href: "/effects", title: "Interaction effects" },
      { href: "/guides", title: "Guides" },
      { href: "/theming", title: "Theming & style" },
    ],
  },
  {
    group: "Playground",
    pages: [{ href: "/playground", title: "Composition playground" }],
  },
  {
    group: "test",
    pages: [{ href: "/test", title: "Test" }],
  },
];
