/**
 * Timings tuneables de la cadena de motion del mostrador (R4). Defaults
 * razonables para construir; Alan los congela a mano en el gate con el panel
 * `?tune` (mismo patrón que el latido F3). Lo que copia el panel es este objeto
 * → lo que se congela es lo que se copia (cero traducción).
 */
export type FlowParams = {
  /** Duración del teatro de "Pagar ahora" (Procesando… → ✓ Pagado). */
  processingMs: number;
  /** Milisegundos por carácter tipeado en el form autorrellenado. */
  typingCharMs: number;
  /** Retraso entre el arranque de tipeo de un campo y el siguiente. */
  fieldStaggerMs: number;
  /** Pliegue del form a sobre (morph en el origen antes de viajar). */
  foldMs: number;
  /** Viaje del sobre (FLIP) al panel dueño. */
  travelMs: number;
};

export const DEFAULT_FLOW_PARAMS: FlowParams = {
  processingMs: 1200,
  typingCharMs: 34,
  fieldStaggerMs: 280,
  foldMs: 440,
  travelMs: 780,
};

/** Easing del viaje — el mismo del FLIP de la intro (coherencia de marca). */
export const TRAVEL_EASING = "cubic-bezier(0.7, 0.02, 0.3, 1)";

export type FlowParamKey = keyof FlowParams;

/** Metadatos de UI para el panel `?tune` (rango de cada slider). */
export const FLOW_PARAM_META: Record<
  FlowParamKey,
  { label: string; min: number; max: number; step: number }
> = {
  processingMs: { label: "Procesando (ms)", min: 400, max: 2600, step: 50 },
  typingCharMs: { label: "Tipeo (ms/car)", min: 8, max: 90, step: 2 },
  fieldStaggerMs: { label: "Stagger campos (ms)", min: 0, max: 700, step: 20 },
  foldMs: { label: "Pliegue a sobre (ms)", min: 150, max: 1000, step: 20 },
  travelMs: { label: "Viaje del sobre (ms)", min: 300, max: 1600, step: 20 },
};
