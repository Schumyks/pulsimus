'use client';

import { useSyncExternalStore } from 'react';

/**
 * Desktop breakpoint gate for the quien-soy choreography (P2): the track+sticky
 * coreografía only runs at `md` (768px) and up — below that, and whenever
 * `prefers-reduced-motion` is active, the section renders its stacked fallback
 * (see `useReducedMotion`, same pattern). Client-only: defaults to `false` on
 * the server so hydration never mismatches, same convention as the rest of the
 * motion kit (see the `?tune` gates in Mostrador/Tablero).
 */
const QUERY = '(min-width: 768px)';

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
