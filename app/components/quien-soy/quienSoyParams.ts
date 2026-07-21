/**
 * Tuneable params of the quien-soy choreography (P2, andamiaje neutro). The
 * scroll→estación mapping is continuous (see QuienSoy.tsx); these two knobs
 * are the only creative surface this rail exposes on purpose — per-station
 * effects are a later, human-directed task. Defaults are reasonable to build
 * with; Alan freezes the feel by hand at the gate via the `?tune` panel (same
 * pattern as `flowParams`/`tableroParams`). What the panel copies IS this
 * object → what gets frozen is what gets copied.
 */
export type QuienSoyParams = {
  /** Fraction (0..1) of each station's scroll segment reserved for the
   * cross-fade band: below this point the outgoing station stays fully
   * opaque; from here to the segment's end it cross-fades into the next. */
  transitionThreshold: number;
  /** CSS transition duration (ms) smoothing each scroll-driven opacity
   * update — the crossfade itself is scroll-linked, not time-based; this
   * only softens the per-frame opacity jumps. */
  fadeMs: number;
};

export const DEFAULT_QUIEN_SOY_PARAMS: QuienSoyParams = {
  transitionThreshold: 0.65,
  fadeMs: 220,
};

export type QuienSoyParamKey = keyof QuienSoyParams;

/** UI metadata for the `?tune` panel (slider range per param). */
export const QUIEN_SOY_PARAM_META: Record<
  QuienSoyParamKey,
  { label: string; min: number; max: number; step: number }
> = {
  transitionThreshold: {
    label: "Umbral de transición",
    min: 0.2,
    max: 0.9,
    step: 0.05,
  },
  fadeMs: { label: "Duración cross-fade (ms)", min: 80, max: 600, step: 20 },
};
