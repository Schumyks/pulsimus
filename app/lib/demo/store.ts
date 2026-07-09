/**
 * Store de la demo — estado en memoria compartido por El mostrador y El
 * tablero. JS/TS plano, SIN importar React: expone el contrato que
 * `useSyncExternalStore` necesita (`subscribe` / `getSnapshot` /
 * `getServerSnapshot`) más las acciones que mutan el "día".
 *
 * Nada de persistencia: el estado vive mientras dura la pestaña. El
 * servidor NUNCA ejecuta `placeOrder` / `confirmReservation` (las disparan
 * clicks del visitante en el cliente), así que `getServerSnapshot()` es,
 * por construcción, siempre el día seed — de ahí que devuelva una
 * referencia congelada aparte del estado "vivo", nunca mutada.
 *
 * CERO `Math.random()` / `Date.now()` / `new Date()` acá — ver seeds.ts.
 */

import { PRODUCTS, type Product } from './products';
import {
  SEED_ORDERS,
  HISTORY_DAYS,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentMethod,
  type DailyAggregate,
} from './seeds';
import { calcOrderTotal } from './economics';
import { nameForIndex } from './names';

export type { Order, OrderItem, OrderStatus, PaymentMethod, DailyAggregate, Weekday } from './seeds';
export type { Product } from './products';

export type DemoState = {
  products: readonly Product[];
  orders: Order[];
  history: DailyAggregate[];
};

type Listener = () => void;

function createInitialState(): DemoState {
  return {
    products: PRODUCTS,
    orders: SEED_ORDERS,
    history: HISTORY_DAYS,
  };
}

/**
 * Snapshot inicial, congelado: SIEMPRE la misma referencia, nunca mutado.
 * `getServerSnapshot()` devuelve esto (nunca `state`) para que el
 * determinismo SSR no dependa de qué haya pasado en un proceso de Node
 * de larga vida (ej. este mismo módulo importado por un script de
 * verificación que también ejerce las acciones).
 */
const INITIAL_STATE: DemoState = createInitialState();

/** Estado "vivo": el que ve el cliente después de hidratar y de interactuar. */
let state: DemoState = INITIAL_STATE;

const listeners = new Set<Listener>();

function emitChange(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): DemoState {
  return state;
}

export function getServerSnapshot(): DemoState {
  return INITIAL_STATE;
}

// ---------------------------------------------------------------------------
// Reloj ficticio de la demo (pura aritmética HH:MM — nunca Date)
// ---------------------------------------------------------------------------

/**
 * "Ahora" en el día ficticio: justo después del último seed (#65, 14:00).
 * Las órdenes que arma el visitante avanzan este reloj de a 1 minuto por
 * orden (ver `placeOrder`), así que dos pedidos en la misma visita no
 * comparten hora.
 */
const DEMO_NOW = '14:15';

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(hhmm: string, deltaMinutes: number): string {
  return minutesToTime(timeToMinutes(hhmm) + deltaMinutes);
}

function roundUpToQuarter(hhmm: string): string {
  const minutes = timeToMinutes(hhmm);
  return minutesToTime(Math.ceil(minutes / 15) * 15);
}

// ---------------------------------------------------------------------------
// Derivación de la próxima orden (compartida por placeOrder y peekNextOrder)
// ---------------------------------------------------------------------------

type NextOrderMeta = { number: number; customer: string; placedAt: string; pickupAt: string };

/**
 * Metadatos que tendría la PRÓXIMA orden del visitante, derivados del estado
 * actual (determinista, sin azar): N° correlativo (máximo + 1), nombre que
 * continúa el ciclo del pool donde lo dejaron los seeds, y horas de pedido/
 * retiro. Una única fuente para que `placeOrder` (commit) y `peekNextOrder`
 * (el form autorrellenado que se muestra ANTES del commit) nunca drifteen.
 */
function deriveNextMeta(current: DemoState): NextOrderMeta {
  const liveOrdersSoFar = current.orders.filter((order) => order.isLive).length;
  const number = Math.max(...current.orders.map((order) => order.number)) + 1;
  const customer = nameForIndex(current.orders.length);
  const placedAt = addMinutes(DEMO_NOW, liveOrdersSoFar);
  const pickupAt = roundUpToQuarter(addMinutes(placedAt, 45));
  return { number, customer, placedAt, pickupAt };
}

/**
 * Solo lectura: el nombre/retiro que le tocarán a la próxima orden. Lo usa el
 * form autorrellenado (R4) para tipear los datos del cliente antes de que el
 * sobre viaje y `placeOrder` commitee. Como el flujo del mostrador está
 * bloqueado (una orden a la vez), el estado no cambia entre el peek y el
 * commit → los valores coinciden exactamente.
 */
export function peekNextOrder(): { customer: string; pickupAt: string } {
  const { customer, pickupAt } = deriveNextMeta(state);
  return { customer, pickupAt };
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------

/**
 * Arma y confirma el pedido del visitante.
 * - `mobilepay` → status `paid` (pagado ahora, en el momento del gesto).
 * - `on_pickup` → status `reservation_pending` (pago al retirar = reserva;
 *   el dueño la confirma después con `confirmReservation`).
 */
export function placeOrder(items: OrderItem[], paymentMethod: PaymentMethod): Order {
  if (items.length === 0) {
    throw new Error('store.placeOrder: el pedido necesita al menos un ítem');
  }

  const { number, customer, placedAt, pickupAt } = deriveNextMeta(state);
  const status: OrderStatus = paymentMethod === 'mobilepay' ? 'paid' : 'reservation_pending';

  const order: Order = {
    number,
    customer,
    items,
    total: calcOrderTotal(items, state.products),
    status,
    paymentMethod,
    placedAt,
    pickupAt,
    isLive: true,
  };

  state = { ...state, orders: [...state.orders, order] };
  emitChange();
  return order;
}

/**
 * El dueño confirma una reserva pendiente (`reservation_pending` →
 * `reservation_confirmed`). Devuelve `false` sin tocar el estado si el
 * número no existe o ya no está pendiente (idempotente ante doble click).
 */
export function confirmReservation(orderNumber: number): boolean {
  const target = state.orders.find((order) => order.number === orderNumber);
  if (!target || target.status !== 'reservation_pending') {
    return false;
  }

  state = {
    ...state,
    orders: state.orders.map((order) =>
      order.number === orderNumber ? { ...order, status: 'reservation_confirmed' as const } : order,
    ),
  };
  emitChange();
  return true;
}

/** Solo para tests/tuning: vuelve el estado vivo al día seed. Nunca la usa la UI. */
export function __resetForTesting(): void {
  state = createInitialState();
  emitChange();
}
