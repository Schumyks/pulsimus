/**
 * The star's script (BL-17, motor v2 — cursor companion). The scroll-keyed
 * waypoint path is gone: the star rides with the cursor, so what remains
 * here is WHICH sections get built by a reveal wave when the visitor
 * arrives. Creative direction lives in docs/bl17-estrella-guion.md.
 * Umbral set pieces (per-umbral bespoke scenes) will register here when
 * the Claude Design / Nano Banana rounds land.
 */

export type StarStation = {
  /** DOM id of the section. */
  id: string;
  /** Whether arriving at this section fires a reveal pulse wave. The hero
   * never hides — it is the landing view. */
  pulse: boolean;
};

export const STAR_STATIONS: StarStation[] = [
  { id: "inicio", pulse: false },
  { id: "dolores", pulse: true },
  { id: "mostrador", pulse: true },
  { id: "tablero", pulse: true },
  { id: "proceso", pulse: true },
  { id: "quien-soy", pulse: true },
  { id: "contacto", pulse: true },
];
