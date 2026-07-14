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

import type { DemoState, Order, OrderItem, OrderStatus, Product } from './store';
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

export type UnitsSold = { productId: string; name: string; units: number };

/** Facturado del período actual vs. el período anterior equivalente. */
export type PeriodDelta = { current: number; previous: number; pct: number | null };

export type PendingReservation = {
  number: number;
  customer: string;
  items: OrderItem[];
  total: number;
  pickupAt: string;
};

export type Pickup = { pickupAt: string; customer: string; items: OrderItem[]; status: OrderStatus };

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

/**
 * Unidades vendidas por producto en el período, hoy + historia fusionadas.
 * Única fuente para `selectTotals` (costo de mercadería → ganancia) y
 * `selectUnitsSold` (panel "qué se vende") — así ambos paneles cierran
 * entre sí por construcción, nunca driftean.
 */
function aggregateUnits(state: DemoState, period: Period): Record<string, number> {
  const today = todayAggregate(state.orders);
  if (period === 'today') return today.unidadesPorProducto;
  const past = sumHistoryRange(state.history, 1, maxDaysAgoFor(period));
  return mergeUnidades(today.unidadesPorProducto, past.unidadesPorProducto);
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
  let cobrado = today.cobrado;
  let aCobrar = today.aCobrar;

  if (period !== 'today') {
    const past = sumHistoryRange(state.history, 1, maxDaysAgoFor(period));
    facturado = round2(facturado + past.facturado);
    pedidos += past.pedidos;
    // Sin cap "cobrado/a cobrar" real más allá de hoy (el registro operativo
    // vive en el día); se aproxima con el split de método, que sí es
    // historizable y por construcción suma exactamente `facturado`.
    const split = selectPaymentSplit(state, period);
    cobrado = split.mobilepay;
    aCobrar = split.onPickup;
  }

  const unidadesPorProducto = aggregateUnits(state, period);
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
 * Semana/Mes muestran unidades vendidas (`selectUnitsSold`), no stock.
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

/**
 * Unidades vendidas por producto en el período (panel "Qué se vende").
 * Comparte `aggregateUnits` con `selectTotals`: las mismas unidades que
 * entran al costo de mercadería de la ganancia, por construcción.
 */
export function selectUnitsSold(state: DemoState, period: Period): UnitsSold[] {
  const unidades = aggregateUnits(state, period);
  return state.products.map((product) => ({
    productId: product.id,
    name: product.name,
    units: unidades[product.id] ?? 0,
  }));
}

/**
 * Facturado del período actual vs. el período anterior equivalente
 * (panel "El día de un vistazo" → delta). Ventanas rodantes, ver header:
 * - today: hoy vs. `HISTORY_DAYS` en `daysAgo=7` (mismo día de semana,
 *   semana pasada — "hoy" es jueves, así que `daysAgo=7` es jueves pasado).
 * - week: semana rodante actual vs. la semana rodante inmediatamente
 *   anterior (`daysAgo` 7-13).
 * - month: mes rodante actual (hoy + 27 días) vs. los 28 días previos a esa
 *   ventana (`daysAgo` 28-55) — 28 días parejos, dentro del histórico de 60.
 */
export function selectFacturadoDelta(state: DemoState, period: Period): PeriodDelta {
  const current = selectTotals(state, period).facturado;

  let previous: number;
  if (period === 'today') {
    const sameWeekdayLastWeek = state.history.find((day) => day.daysAgo === 7);
    previous = sameWeekdayLastWeek?.facturado ?? 0;
  } else if (period === 'week') {
    previous = sumHistoryRange(state.history, 7, 13).facturado;
  } else {
    previous = sumHistoryRange(state.history, 28, 55).facturado;
  }

  const pct = previous === 0 ? null : round2(((current - previous) / previous) * 100);
  return { current, previous, pct };
}

/**
 * Reservas `reservation_pending` ordenadas por hora de retiro (panel
 * "⚡ Reservas por confirmar"). Cola VIVA operativa: no depende del período
 * (spec §4.2 — las colas viven en presente).
 */
export function selectPendingReservations(state: DemoState): PendingReservation[] {
  return state.orders
    .filter((order): order is Order & { status: 'reservation_pending' } => order.status === 'reservation_pending')
    .map(({ number, customer, items, total, pickupAt }) => ({ number, customer, items, total, pickupAt }))
    .sort((a, b) => a.pickupAt.localeCompare(b.pickupAt));
}

/**
 * Agenda de retiros (panel "Retiros"). today = todas las órdenes de hoy,
 * ordenadas por hora de retiro. week/month = solo reservas `on_pickup`
 * (pending + confirmed) — los "próximos" (spec §4.2: "Retiros muta a
 * 'próximos' en Semana/Mes"). En la práctica solo distingue today vs.
 * no-today: la historia son agregados diarios, no órdenes individuales,
 * así que no hay retiros futuros más allá de las órdenes de hoy.
 */
export function selectPickups(state: DemoState, period: Period): Pickup[] {
  const source =
    period === 'today'
      ? state.orders
      : state.orders.filter(
          (order) => order.status === 'reservation_pending' || order.status === 'reservation_confirmed',
        );

  return [...source]
    .sort((a, b) => a.pickupAt.localeCompare(b.pickupAt))
    .map(({ pickupAt, customer, items, status }) => ({ pickupAt, customer, items, status }));
}
