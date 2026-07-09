/**
 * Tuneable timings of El tablero's load choreography (T4). Reasonable defaults
 * to build with; Alan freezes the feel by hand at the gate via the `?tune`
 * panel (same pattern as the mostrador flow params and the F3 heartbeat). What
 * the panel copies IS this object → what gets frozen is what gets copied.
 */
export type TableroParams = {
  /** Stagger between consecutive frames' reveal, in reading order (§4.4). */
  frameStaggerMs: number;
  /** Duration of the 0→value count-up (KPIs, stat values). */
  countMs: number;
  /** Duration of a bar's left→right growth. */
  barMs: number;
};

export const DEFAULT_TABLERO_PARAMS: TableroParams = {
  frameStaggerMs: 90,
  countMs: 900,
  barMs: 700,
};

export type TableroParamKey = keyof TableroParams;

/** UI metadata for the `?tune` panel (slider range per param). */
export const TABLERO_PARAM_META: Record<
  TableroParamKey,
  { label: string; min: number; max: number; step: number }
> = {
  frameStaggerMs: { label: "Stagger de marcos (ms)", min: 0, max: 240, step: 10 },
  countMs: { label: "Conteo (ms)", min: 300, max: 2000, step: 50 },
  barMs: { label: "Crecimiento de barras (ms)", min: 200, max: 1600, step: 50 },
};
