'use client';

import { useSyncExternalStore } from 'react';

/**
 * How every example on the site shows its spec: as JavaScript, or as the JSON it
 * compiles from. One choice for the whole site, kept across pages.
 *
 * `?spec=json` (or `?spec=js`) forces it for one visit without saving it. The
 * library's browser checks use that to run every example from its JSON.
 */
export type SpecMode = 'js' | 'json';

const KEY = 'elicit-docs-spec';
const listeners = new Set<() => void>();
let mode: SpecMode | null = null;

function read(): SpecMode {
  if (mode) return mode;
  try {
    const forced = new URLSearchParams(window.location.search).get('spec');
    if (forced === 'json' || forced === 'js') return (mode = forced);
    return (mode = window.localStorage.getItem(KEY) === 'json' ? 'json' : 'js');
  } catch {
    return (mode = 'js');
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function setSpecMode(next: SpecMode) {
  mode = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage is a convenience; the choice still holds for this visit.
  }
  listeners.forEach((l) => l());
}

/** The current spec mode, live. The server renders JavaScript. */
export function useSpecMode(): SpecMode {
  return useSyncExternalStore(subscribe, read, () => 'js');
}
