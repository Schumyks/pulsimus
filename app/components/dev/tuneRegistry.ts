"use client";

import { useEffect } from "react";

/**
 * Registry behind the unified `?tune` panel. Each choreography registers its
 * pane (label + param metadata + live params + setter) via `useTunePane`;
 * `UnifiedTunePanel` subscribes and renders them as tabs in ONE floating
 * panel instead of four stacked ones. Registration refreshes after every
 * render so the panel always sees live params.
 */

export type TuneMetaEntry = { label: string; min: number; max: number; step: number };

export type TunePane = {
  key: string;
  label: string;
  /** Tab order in the panel (lower = first). */
  order: number;
  meta: Record<string, TuneMetaEntry>;
  params: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
};

const panes = new Map<string, TunePane>();
const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version++;
  for (const l of listeners) l();
}

export function subscribeTune(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTuneVersion() {
  return version;
}

export function getTunePanes(): TunePane[] {
  return [...panes.values()].sort((a, b) => a.order - b.order);
}

export function useTunePane<P extends Record<string, number>>(pane: {
  key: string;
  label: string;
  order: number;
  meta: Record<keyof P & string, TuneMetaEntry>;
  params: P;
  onChange: (next: P) => void;
}) {
  useEffect(() => {
    // No deps on purpose: re-register after every render so the panel's
    // snapshot of params/onChange never goes stale.
    panes.set(pane.key, pane as unknown as TunePane);
    emit();
  });
  useEffect(
    () => () => {
      panes.delete(pane.key);
      emit();
    },
    [pane.key],
  );
}
