/**
 * Verificación de invariantes de `app/lib/demo/*` — R1 (store de la demo).
 * Corrida standalone: `npx tsx scripts/verify-demo-invariants.ts`.
 * NO se agrega `tsx` a package.json (npx lo baja transitorio, por indicación
 * del brief). Imprime PASS/FAIL por línea; sale 0 solo si TODO pasa.
 */

import { PRODUCTS } from '../app/lib/demo/products';
import { SEED_ORDERS, HISTORY_DAYS } from '../app/lib/demo/seeds';
import { calcCostOfItems, round2 } from '../app/lib/demo/economics';
import {
  getServerSnapshot,
  getSnapshot,
  placeOrder,
  confirmReservation,
  __resetForTesting,
} from '../app/lib/demo/store';
import { selectTotals, selectStock, selectHourBuckets } from '../app/lib/demo/selectors';
import type { Period } from '../app/lib/demo/selectors';

type Result = { name: string; pass: boolean; detail?: string };

const results: Result[] = [];

function check(name: string, pass: boolean, detail?: string): void {
  results.push({ name, pass, detail });
}

function approxEqual(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}

// ---------------------------------------------------------------------------
// 1 · cobrado + aCobrar === facturado (Hoy)
// ---------------------------------------------------------------------------

{
  const state = getSnapshot();
  const totals = selectTotals(state, 'today');
  const sum = round2(totals.cobrado + totals.aCobrar);
  check(
    'cobrado + aCobrar === facturado (Hoy)',
    approxEqual(sum, totals.facturado),
    `cobrado=${totals.cobrado} aCobrar=${totals.aCobrar} suma=${sum} facturado=${totals.facturado}`,
  );
}

// ---------------------------------------------------------------------------
// 2 · moms === facturado * 0.20 (±0.01) · ganancia === facturado - moms - Σ(unitCost×qty)
// ---------------------------------------------------------------------------

{
  const state = getSnapshot();
  const totals = selectTotals(state, 'today');
  const expectedMoms = round2(totals.facturado * 0.2);
  check(
    'moms === facturado * 0.20 (±0.01)',
    approxEqual(totals.moms, expectedMoms),
    `moms=${totals.moms} esperado=${expectedMoms}`,
  );

  const costoMercaderia = round2(
    SEED_ORDERS.reduce((sum, order) => sum + calcCostOfItems(order.items, PRODUCTS), 0),
  );
  const expectedGanancia = round2(totals.facturado - totals.moms - costoMercaderia);
  check(
    'ganancia === facturado - moms - Σ(unitCost×qty)',
    approxEqual(totals.ganancia, expectedGanancia),
    `ganancia=${totals.ganancia} esperado=${expectedGanancia} costo=${costoMercaderia}`,
  );
}

// ---------------------------------------------------------------------------
// 3 · Determinismo SSR: JSON.stringify(getServerSnapshot()) idéntico en 2 llamadas
// ---------------------------------------------------------------------------

{
  const first = JSON.stringify(getServerSnapshot());
  const second = JSON.stringify(getServerSnapshot());
  check('getServerSnapshot() determinista (2 llamadas consecutivas)', first === second);

  // Robustez extra (no pedida por el DoD, pero cubre la razón de ser del
  // diseño): getServerSnapshot() no debe moverse aunque el estado "vivo"
  // sí lo haga vía acciones — el servidor nunca corre placeOrder/
  // confirmReservation, así que su snapshot es siempre el día seed.
  const beforeActions = JSON.stringify(getServerSnapshot());
  placeOrder([{ productId: 'medialunas', qty: 2 }], 'mobilepay');
  confirmReservation(63);
  const afterActions = JSON.stringify(getServerSnapshot());
  check(
    'getServerSnapshot() no se mueve aunque el estado vivo mute (placeOrder/confirmReservation)',
    beforeActions === afterActions,
  );
  __resetForTesting();
}

// ---------------------------------------------------------------------------
// 4 · stock por tanda nunca negativo en los 3 períodos
// ---------------------------------------------------------------------------

{
  const state = getSnapshot();
  const periods: Period[] = ['today', 'week', 'month'];
  let allNonNegative = true;
  const details: string[] = [];
  for (const period of periods) {
    // selectStock es propiedad del día (spec §4.2: "sin stock, es propiedad
    // del día") — no varía con el período; se verifica igual en los 3 para
    // dejar constancia de que la invariante se sostiene sea cual sea el
    // toggle activo.
    const stock = selectStock(state);
    for (const item of stock) {
      details.push(`${period}/${item.productId}=${item.remaining}`);
      if (item.remaining < 0) allNonNegative = false;
    }
  }
  check('stock por tanda nunca negativo en los 3 períodos', allNonNegative, details.join(', '));
}

// ---------------------------------------------------------------------------
// 5 · Día seed: ~14 pedidos, facturado 1.100-1.400 kr, pico horario ~11:00
// ---------------------------------------------------------------------------

{
  const pedidos = SEED_ORDERS.length;
  check('día seed: 14 pedidos', pedidos === 14, `pedidos=${pedidos}`);

  const facturado = round2(SEED_ORDERS.reduce((sum, order) => sum + order.total, 0));
  check(
    'día seed: facturado en rango 1.100-1.400 kr',
    facturado >= 1100 && facturado <= 1400,
    `facturado=${facturado}`,
  );

  const buckets = selectHourBuckets(getSnapshot());
  const peakHour = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
  check(
    'día seed: bucket horario pico en la franja de las 11:00',
    peakHour?.[0] === '11',
    `buckets=${JSON.stringify(buckets)} pico=${peakHour?.[0]}(${peakHour?.[1]})`,
  );
}

// ---------------------------------------------------------------------------
// 6 · Conteo de estados seed: ≥1 pagada + exactamente 2 pending + 1 confirmed
// ---------------------------------------------------------------------------

{
  const paid = SEED_ORDERS.filter((o) => o.status === 'paid').length;
  const pending = SEED_ORDERS.filter((o) => o.status === 'reservation_pending').length;
  const confirmed = SEED_ORDERS.filter((o) => o.status === 'reservation_confirmed').length;

  check('día seed: al menos 1 orden pagada', paid >= 1, `paid=${paid}`);
  check('día seed: exactamente 2 reservation_pending', pending === 2, `pending=${pending}`);
  check('día seed: exactamente 1 reservation_confirmed', confirmed === 1, `confirmed=${confirmed}`);
}

// ---------------------------------------------------------------------------
// 7 · Extra: HISTORY_DAYS íntegro (60 días, determinista, sin negativos)
// ---------------------------------------------------------------------------

{
  const count = HISTORY_DAYS.length;
  check('HISTORY_DAYS: 60 agregados diarios', count === 60, `count=${count}`);

  const noNegatives = HISTORY_DAYS.every(
    (d) => d.facturado >= 0 && d.pedidos >= 0 && d.splitPago.mobilepay >= 0 && d.splitPago.onPickup >= 0,
  );
  check('HISTORY_DAYS: sin valores negativos', noNegatives);

  const first = JSON.stringify(HISTORY_DAYS);
  const second = JSON.stringify(HISTORY_DAYS);
  check('HISTORY_DAYS: determinista (mismo módulo, 2 serializaciones)', first === second);
}

// ---------------------------------------------------------------------------
// 8 · Extra: placeOrder / confirmReservation se comportan como se espera
// ---------------------------------------------------------------------------

{
  __resetForTesting();
  const before = getSnapshot().orders.length;
  const order = placeOrder([{ productId: 'facturas', qty: 3 }], 'on_pickup');
  const after = getSnapshot().orders.length;

  check('placeOrder: agrega una orden al estado vivo', after === before + 1, `before=${before} after=${after}`);
  check(
    'placeOrder: N° correlativo continúa desde el máximo existente',
    order.number === 66,
    `number=${order.number} (esperado 66, máximo seed es 65)`,
  );
  check(
    'placeOrder: on_pickup deriva status reservation_pending',
    order.status === 'reservation_pending',
    `status=${order.status}`,
  );
  check('placeOrder: marca isLive=true', order.isLive === true);

  const confirmedOk = confirmReservation(order.number);
  const confirmedOrder = getSnapshot().orders.find((o) => o.number === order.number);
  check(
    'confirmReservation: pending → confirmed',
    confirmedOk && confirmedOrder?.status === 'reservation_confirmed',
    `ok=${confirmedOk} status=${confirmedOrder?.status}`,
  );

  const doubleConfirm = confirmReservation(order.number);
  check('confirmReservation: idempotente (segunda vez devuelve false)', doubleConfirm === false);

  __resetForTesting();
}

// ---------------------------------------------------------------------------
// Reporte
// ---------------------------------------------------------------------------

let failures = 0;
for (const result of results) {
  const label = result.pass ? 'PASS' : 'FAIL';
  const detail = result.detail ? ` — ${result.detail}` : '';
  console.log(`${label} · ${result.name}${detail}`);
  if (!result.pass) failures += 1;
}

console.log('');
console.log(`${results.length - failures}/${results.length} checks OK`);

process.exit(failures === 0 ? 0 : 1);
