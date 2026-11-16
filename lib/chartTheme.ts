'use client';

import { useSyncExternalStore } from 'react';

/**
 * The chart theme for each docs colour mode.
 *
 * Light mode draws every example in the library's `dd` (Data & Dialogue Lab)
 * theme. Dark mode extends `dd`: the same lab teal and blue ink, with chrome
 * (axes, grid, labels, guides, widgets) re-inked for a dark page and a
 * transparent backdrop, so a chart sits directly on the docs' dark card.
 *
 * Colours here are hex, not CSS variables, because the library also paints to
 * canvas, which can't resolve `var(--…)`. They are the `DD` neutrals and hues
 * from ../elicitjs/src/core/themes.js plus lifted tints of the brand blue.
 * Keep them in step with styles/brand.css if the palette seeds change.
 */

export type ChartMode = 'light' | 'dark';

const DARK = {
  surface: '#132536', // ≈ the dark --card; the halo around handles
  grey100: '#EAF0F4',
  grey200: '#D9E2E9',
  grey300: '#BCC9D4',
  grey500: '#6F8294',
  grey600: '#46596B',
  line: '#2A3F53', // spine / ticks on dark
  grid: '#1C3043',
  well: '#172B3F', // widget cells
  teal: '#50AEB7',
  tealLight: '#7FC4CB',
  blueLight: '#7FB1CB', // DD diverging's light blue: the brand blue, readable on dark
  blueMid: '#5B8DB8',
  coral: '#EE7B5E',
};

export const DD_DARK = {
  extends: 'dd',
  background: null,
  muted: DARK.grey500,
  accent: DARK.blueLight,
  handle: DARK.blueLight,
  handleStroke: DARK.surface,
  // dd's categorical palette with its dark brand blue lifted one step, so the
  // second series doesn't vanish into the page. Other hues are unchanged.
  palette: ['#50AEB7', DARK.blueMid, '#EE7B5E', '#F2B94B', '#8A78C0', '#7DB86B', '#D9638A', '#8497A8'],
  axis: { stroke: DARK.line, labelFill: DARK.grey300, handle: DARK.blueLight },
  grid: { stroke: DARK.grid },
  guide: {
    rule: { stroke: DARK.grey500 },
    region: { fill: DARK.teal, opacity: 0.12 },
    legend: { stroke: DARK.grey300, labelFill: DARK.grey300, currentStroke: DARK.grey100 },
  },
  constraint: { color: DARK.coral },
  effects: { target: { outline: { color: DARK.tealLight } } },
  // Marks whose built-in fallback ink is near-black.
  marks: {
    text: { fill: DARK.grey100 },
    trend: { stroke: DARK.grey200, fill: DARK.grey200 },
  },
  widget: {
    accent: DARK.blueLight,
    ring: DARK.line,
    track: DARK.grid,
    cellFill: DARK.well,
    cellStroke: DARK.line,
    label: DARK.grey300,
    question: DARK.grey100,
  },
} as const;

/** What `setTheme()` receives for a mode. */
export function chartThemeFor(mode: ChartMode): string | typeof DD_DARK {
  return mode === 'dark' ? DD_DARK : 'dd';
}

// The docs' mode is the `dark` class next-themes puts on <html>. It is set by an
// inline script before hydration, so reading the class (rather than waiting for
// next-themes' context) gives the right mode on the very first chart render.
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => obs.disconnect();
}
/** The mode right now, read from the DOM (for use inside effects). */
export const currentChartMode = (): ChartMode =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';
const getServerSnapshot = (): ChartMode => 'light';

/** The current docs colour mode, live. */
export function useChartMode(): ChartMode {
  return useSyncExternalStore(subscribe, currentChartMode, getServerSnapshot);
}
