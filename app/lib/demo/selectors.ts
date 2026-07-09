/**
 * Selectores puros por período (Hoy / Semana / Mes) sobre el `DemoState`.
 * Sin React — se llaman desde `hooks.ts` (client) y desde el script de
 * verificación (Node) por igual.
 *
 * Semana = hoy + los 6 días anteriores (`HISTORY_DAYS` daysAgo 1..6).
 * Mes    = hoy + los 27 días anteriores (4 semanas, daysAgo 1..27).
 * Los rangos son ventanas RODANTES (no meses/semanas de calendario): no hay
 * `Date` disponible en este módulo y el modelo no fija qué día calendario
 * es "hoy", así que una ventana rodante es la lectura correcta y la más
 * simple de verificar. F4T (`T1`) puede refinar a alineación de calendario
 * si el diseño del tablero lo pide — ver reporte de R1.
 */

import type { DemoState, Order, Product } from './store';
import type { DailyAggregate, Weekday } from './seeds';
import { calcMoms, calcProfit, calcAverageTicket, round2 } from './economics';

export type Period = 'today' | 'week' | 'month';

export type PeriodTotals = {
  facturado: number;
  pedidos: number;
  /** kr. ya cobrados (pagado ahora / MobilePay) */
  cobrado: number;
  /** kr. a cobrar (reserva, pago al retirar — pendiente o confirmada) */
  aCobrar: number;
  moms: number;
  ganancia: number;
  ticketPromedio: number;
};

export type PaymentSplit = { mobilepay: number; onPickup: number };

export type DayBucket = { label: Weekday | 'hoy'; daysAgo: number; facturado: number };

export type WeekBucket = { label: string; facturado: number };

export type StockInfo = {
  productId: string;
  name: string;
  batchSize: number;
  sold: number;
  remaining: number;
};

const WEEK_DAYS_AGO = 6;
const MONTH_DAYS_AGO = 27; // 4 semanas de 7 días (hoy + 27 anteriores)

// ---------------------------------------------------------------------------
// Agregación interna
// ---------------------------------------------------------------------------

type Aggregate = {
  facturado: number;
  pedidos: number;
  unidadesPorProducto: Record<string, number>;
  splitPago: PaymentSplit;
};

function todayAggregate(orders: readonly Order[]): Aggregate & { cobrado: number; aCobrar: number } {
  let facturado = 0;
  let cobrado = 0;
  let mobilepay = 0;
  let onPickup = 0;
  const unidadesPorProducto: Record<string, number> = {};

  for (const order of orders) {
    facturado += order.total;
    if (order.status === 'paid') cobrado += order.total;
    if (order.paymentMethod === 'mobilepay') mobilepay += order.total;
    else onPickup += order.total;
    for (const item of order.items) {
      unidadesPorProducto[item.productId] = (unidadesPorProducto[item.productId] ?? 0) + item.qty;
    }
  }

  facturado = round2(facturado);
  cobrado = round2(cobrado);
  const aCobrar = round2(facturado - cobrado);

  return {
    facturado,
    pedidos: orders.length,
    unidadesPorProducto,
    splitPago: { mobilepay: round2(mobilepay), onPickup: round2(onPickup) },
    cobrado,
    aCobrar,
  };
}

function sumHistoryRange(history: readonly DailyAggregate[], minDaysAgo: number, maxDaysAgo: number): Aggregate {
  let facturado = 0;
  let mobilepay = 0;
  let onPickup = 0;
  let pedidos = 0;
  const unidadesPorProducto: Record<string, number> = {};

  for (const day of history) {
    if (day.daysAgo < minDaysAgo || day.daysAgo > maxDaysAgo) continue;
    facturado += day.facturado;
    pedidos += day.pedidos;
    mobilepay += day.splitPago.mobilepay;
    onPickup += day.splitPago.onPickup;
    for (const [productId, qty] of Object.entries(day.unidadesPorProducto)) {
      unidadesPorProducto[productId] = (unidadesPorProducto[productId] ?? 0) + qty;
    }
  }

  return {
    facturado: round2(facturado),
    pedidos,
    unidadesPorProducto,
    splitPago: { mobilepay: round2(mobilepay), onPickup: round2(onPickup) },
  };
}

function mergeUnidades(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const merged: Record<string, number> = { ...a };
  for (const [productId, qty] of Object.entries(b)) {
    merged[productId] = (merged[productId] ?? 0) + qty;
  }
  return merged;
}

function costFromUnits(unidades: Record<string, number>, products: readonly Product[]): number {
  let cost = 0;
  for (const product of products) {
    cost += product.unitCost * (unidades[product.id] ?? 0);
  }
  return round2(cost);
}

function maxDaysAgoFor(period: Period): number {
  return period === 'month' ? MONTH_DAYS_AGO : WEEK_DAYS_AGO;
}

// ---------------------------------------------------------------------------
// Selectores públicos
// ---------------------------------------------------------------------------

/** Split de pago (kr. facturados por método) para el período dado. */
export function selectPaymentSplit(state: DemoState, period: Period): PaymentSplit {
  const today = todayAggregate(state.orders);
  if (period === 'today') {
    return today.splitPago;
  }
  const past = sumHistoryRange(state.history, 1, maxDaysAgoFor(period));
  return {
    mobilepay: round2(today.splitPago.mobilepay + past.splitPago.mobilepay),
    onPickup: round2(today.splitPago.onPickup + past.splitPago.onPickup),
  };
}

/** Totales del período: facturado, pedidos, cobrado/a-cobrar, moms, ganancia, ticket prom. */
export function selectTotals(state: DemoState, period: Period): PeriodTotals {
  const today = todayAggregate(state.orders);

  let facturado = today.facturado;
  let pedidos = today.pedidos;
  let unidadesPorProducto = today.unidadesPorProducto;
  let cobrado = today.cobrado;
  let aCobrar = today.aCobrar;

  if (period !== 'today') {
    const past = sumHistoryRange(state.history, 1, maxDaysAgoFor(period));
    facturado = round2(facturado + past.facturado);
    pedidos += past.pedidos;
    unidadesPorProducto = mergeUnidades(unidadesPorProducto, past.unidadesPorProducto);
    // Sin cap "cobrado/a cobrar" real más allá de hoy (el registro operativo
    // vive en el día); se aproxima con el split de método, que sí es
    // historizable y por construcción suma exactamente `facturado`.
    const split = selectPaymentSplit(state, period);
    cobrado = split.mobilepay;
    aCobrar = split.onPickup;
  }

  const moms = calcMoms(facturado);
  const cost = costFromUnits(unidadesPorProducto, state.products);
  const ganancia = calcProfit(facturado, moms, cost);
  const ticketPromedio = calcAverageTicket(facturado, pedidos);

  return { facturado, pedidos, cobrado, aCobrar, moms, ganancia, ticketPromedio };
}

/** Buckets por HORA de hoy (placedAt → conteo de pedidos). Solo tiene sentido para "hoy". */
export function selectHourBuckets(state: DemoState): Record<string, number> {
  const buckets: Record<string, number> = {};
  for (const order of state.orders) {
    const hour = order.placedAt.slice(0, 2);
    buckets[hour] = (buckets[hour] ?? 0) + 1;
  }
  return buckets;
}

/** Buckets por DÍA: los últimos 7 días (6 de historia + hoy), en orden cronológico. */
export function selectDayBuckets(state: DemoState): DayBucket[] {
  const past: DayBucket[] = [];
  for (let daysAgo = WEEK_DAYS_AGO; daysAgo >= 1; daysAgo -= 1) {
    const day = state.history.find((d) => d.daysAgo === daysAgo);
    if (day) past.push({ label: day.weekday, daysAgo, facturado: day.facturado });
  }
  const today = todayAggregate(state.orders);
  return [...past, { label: 'hoy', daysAgo: 0, facturado: today.facturado }];
}

/** Buckets por SEMANA dentro del mes rodante (4 bloques de 7 días, el más reciente incluye hoy). */
export function selectWeekBuckets(state: DemoState): WeekBucket[] {
  const today = todayAggregate(state.orders);
  const ranges: { label: string; min: number; max: number; includesToday: boolean }[] = [
    { label: 'esta semana', min: 1, max: 6, includesToday: true },
    { label: 'semana pasada', min: 7, max: 13, includesToday: false },
    { label: 'hace 2 semanas', min: 14, max: 20, includesToday: false },
    { label: 'hace 3 semanas', min: 21, max: 27, includesToday: false },
  ];
  return ranges.map(({ label, min, max, includesToday }) => {
    const past = sumHistoryRange(state.history, min, max);
    const facturado = includesToday ? round2(past.facturado + today.facturado) : past.facturado;
    return { label, facturado };
  });
}

/**
 * Stock restante de la tanda del día, por producto. Es propiedad del DÍA
 * (spec §4.2: "sin stock: es propiedad del día") — no varía con el período;
 * Semana/Mes muestran unidades vendidas (`selectTotals().unidadesPorProducto`
 * vía el consumidor), no stock.
 */
export function selectStock(state: DemoState): StockInfo[] {
  const today = todayAggregate(state.orders);
  return state.products.map((product) => {
    const sold = today.unidadesPorProducto[product.id] ?? 0;
    return {
      productId: product.id,
      name: product.name,
      batchSize: product.batchSize,
      sold,
      remaining: product.batchSize - sold,
    };
  });
}
