/**
 * Tuneable params of the star layer choreography (BL-17 phase 2). Same
 * contract as `quienSoyParams`/`flowParams`: defaults are reasonable to
 * build with; Alan freezes the feel by hand at the gate via the `?tune`
 * panel. What the panel copies IS this object.
 */
export type StarParams = {
  /** Chase stiffness (1/s): how fast the star catches its path target.
   * Lower = floatier, higher = tighter to the scroll. */
  chase: number;
  /** Base star radius (px) before depth multipliers. */
  sizeBase: number;
  /** Global glow multiplier on top of each station's mood. */
  glowScale: number;
  /** Section pulse ring duration (ms). */
  pulseMs: number;
  /** Max pulse ring radius as a fraction of viewport height. */
  ringVh: number;
  /** Pulse ring stroke width (px) at birth. */
  ringWidth: number;
  /** Twinkle amplitude (fraction of size) of the heartbeat breathing. */
  twinkle: number;
  /** Umbral (transition zone) height in vh — drives the `--umbral-h` CSS
   * variable, so it reflows the page live while tuning. */
  umbralVh: number;
};

export const DEFAULT_STAR_PARAMS: StarParams = {
  chase: 3.5,
  sizeBase: 12,
  glowScale: 1,
  pulseMs: 1100,
  ringVh: 0.34,
  ringWidth: 2.5,
  twinkle: 0.1,
  umbralVh: 55,
};

export type StarParamKey = keyof StarParams;

/** UI metadata for the `?tune` panel (slider range per param). */
export const STAR_PARAM_META: Record<
  StarParamKey,
  { label: string; min: number; max: number; step: number }
> = {
  chase: { label: "Persecución (rigidez)", min: 0.5, max: 10, step: 0.25 },
  sizeBase: { label: "Tamaño base (px)", min: 6, max: 28, step: 1 },
  glowScale: { label: "Intensidad de glow", min: 0.3, max: 2.5, step: 0.1 },
  pulseMs: { label: "Duración del pulso (ms)", min: 400, max: 2400, step: 50 },
  ringVh: { label: "Alcance de la onda (vh)", min: 0.1, max: 0.8, step: 0.02 },
  ringWidth: { label: "Grosor de la onda (px)", min: 1, max: 6, step: 0.5 },
  twinkle: { label: "Amplitud del latido", min: 0, max: 0.3, step: 0.01 },
  umbralVh: { label: "Altura del umbral (vh)", min: 25, max: 100, step: 5 },
};
