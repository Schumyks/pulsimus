/**
 * Pool de nombres de clientes de La Espiga (panadería argentina en
 * Copenhague → mezcla AR/DK, ver design-spec §2 · Seeds y nombres).
 *
 * `nameForIndex` es el tomador DETERMINISTA del "próximo nombre": índice
 * incremental puro, JAMÁS `Math.random()`. El store lo usa para bautizar
 * la orden que arma el visitante (client-side, al confirmar el pedido —
 * nunca durante el render, así que no hay riesgo de hydration mismatch).
 */

export const NAME_POOL: readonly string[] = [
  'Sofía R.',
  'Camila F.',
  'Martín G.',
  'Valentina P.',
  'Lucía B.',
  'Mikkel J.',
  'Freja L.',
  'Emil K.',
  'Ida S.',
  'Clara N.',
] as const;

/**
 * Devuelve el nombre determinado por `index`, ciclando el pool.
 * Pura: mismo índice → mismo nombre, siempre.
 */
export function nameForIndex(index: number): string {
  const size = NAME_POOL.length;
  const normalized = ((index % size) + size) % size;
  return NAME_POOL[normalized];
}
