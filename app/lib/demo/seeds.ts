/**
 * Datos deterministas de la demo El mostrador / El tablero.
 *
 * CERO `Math.random()` / `Date.now()` / `new Date()` en este archivo (ni en
 * ningún otro de `app/lib/demo/`): rompería el determinismo SSR y produciría
 * hydration mismatch. Todo acá es números fijos o fórmulas puras sobre esos
 * números fijos — misma entrada, misma salida, siempre.
 *
 * Dos piezas:
 * - `SEED_ORDERS`: las ~14 órdenes del "día" que arrancan el mostrador
 *   (horas fijas HH:MM, pico ~11:00, mezcla de estados).
 * - `HISTORY_DAYS`: agregados DIARIOS de los 60 días anteriores a "hoy"
 *   (facturado, pedidos, unidades por producto, split de pago) — no
 *   órdenes completas, per design-spec §2. Sirven para las vistas
 *   Semana/Mes y sus deltas (El tablero, F4T). Generados con una fórmula
 *   determinista (documentada abajo), no tipeados a mano fila por fila.
 */

import { PRODUCTS } from './products';
import { calcOrderTotal, type OrderItem } from './economics';

export type { OrderItem } from './economics';

export type OrderStatus = 'paid' | 'reservation_pending' | 'reservation_confirmed';

export type PaymentMethod = 'mobilepay' | 'on_pickup';

export type Order = {
  /** correlativo del día (seeds arrancan en #52) */
  number: number;
  customer: string;
  items: OrderItem[];
  /** kr., derivado de items × PRODUCTS.unitPrice */
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  /** HH:MM */
  placedAt: string;
  /** HH:MM — hora de retiro pactada */
  pickupAt: string;
  /** true = la generó el visitante en esta visita (nunca en seeds) */
  isLive: boolean;
};

function seedOrder(
  number: number,
  customer: string,
  items: OrderItem[],
  status: OrderStatus,
  paymentMethod: PaymentMethod,
  placedAt: string,
  pickupAt: string,
): Order {
  return {
    number,
    customer,
    items,
    total: calcOrderTotal(items, PRODUCTS),
    status,
    paymentMethod,
    placedAt,
    pickupAt,
    isLive: false,
  };
}

/**
 * ~14 órdenes del día. Pico de pedidos en la franja de las 11:00 (4 de 14).
 * Estados: 11 pagadas (MobilePay) + exactamente 2 `reservation_pending` +
 * 1 `reservation_confirmed` (las 3 últimas del día, pago al retirar).
 *
 * Calibración (ver reporte R1): facturado 1.236 kr · 14 pedidos ·
 * ticket prom. ~88 kr · cobrado 1.020 kr · a cobrar 216 kr.
 */
export const SEED_ORDERS: Order[] = [
  seedOrder(52, 'Sofía R.', [{ productId: 'medialunas', qty: 6 }], 'paid', 'mobilepay', '08:20', '08:20'),
  seedOrder(53, 'Camila F.', [{ productId: 'facturas', qty: 6 }], 'paid', 'mobilepay', '09:05', '09:05'),
  seedOrder(54, 'Martín G.', [{ productId: 'pan', qty: 1 }], 'paid', 'mobilepay', '09:40', '09:40'),
  seedOrder(
    55,
    'Valentina P.',
    [
      { productId: 'medialunas', qty: 3 },
      { productId: 'facturas', qty: 6 },
    ],
    'paid',
    'mobilepay',
    '10:15',
    '10:15',
  ),
  seedOrder(56, 'Lucía B.', [{ productId: 'facturas', qty: 6 }], 'paid', 'mobilepay', '10:50', '10:50'),
  seedOrder(
    57,
    'Mikkel J.',
    [
      { productId: 'medialunas', qty: 6 },
      { productId: 'pan', qty: 1 },
    ],
    'paid',
    'mobilepay',
    '11:00',
    '11:00',
  ),
  seedOrder(
    58,
    'Freja L.',
    [
      { productId: 'medialunas', qty: 3 },
      { productId: 'facturas', qty: 6 },
    ],
    'paid',
    'mobilepay',
    '11:10',
    '11:10',
  ),
  seedOrder(59, 'Emil K.', [{ productId: 'pan', qty: 2 }], 'paid', 'mobilepay', '11:25', '11:25'),
  seedOrder(60, 'Ida S.', [{ productId: 'medialunas', qty: 6 }], 'paid', 'mobilepay', '11:45', '11:45'),
  seedOrder(61, 'Clara N.', [{ productId: 'facturas', qty: 6 }], 'paid', 'mobilepay', '12:05', '12:05'),
  seedOrder(62, 'Sofía R.', [{ productId: 'medialunas', qty: 3 }], 'paid', 'mobilepay', '12:35', '12:35'),
  seedOrder(
    63,
    'Camila F.',
    [
      { productId: 'pan', qty: 1 },
      { productId: 'facturas', qty: 3 },
    ],
    'reservation_pending',
    'on_pickup',
    '13:00',
    '16:30',
  ),
  seedOrder(64, 'Martín G.', [{ productId: 'medialunas', qty: 3 }], 'reservation_pending', 'on_pickup', '13:30', '17:00'),
  seedOrder(65, 'Valentina P.', [{ productId: 'facturas', qty: 6 }], 'reservation_confirmed', 'on_pickup', '14:00', '17:30'),
];

// ---------------------------------------------------------------------------
// Historia (Semana / Mes) — agregados diarios de los 60 días anteriores a hoy
// ---------------------------------------------------------------------------

export type Weekday = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type DailyAggregate = {
  /** offset en días desde "hoy" (1 = ayer .. 60). "Hoy" (0) vive en SEED_ORDERS. */
  daysAgo: number;
  /** etiqueta de día de semana — determinista, no calendario real */
  weekday: Weekday;
  facturado: number;
  pedidos: number;
  unidadesPorProducto: Record<string, number>;
  /** kr. facturados por método de pago ese día */
  splitPago: { mobilepay: number; onPickup: number };
};

/**
 * "Hoy" en este cronograma ficticio es un jueves. El ciclo de abajo mapea
 * daysAgo → día de semana yendo hacia atrás desde ese jueves:
 * daysAgo 1=mié, 2=mar, 3=lun, 4=dom, 5=sáb, 6=vie, 7=jue (semana pasada), …
 */
const WEEKDAY_CYCLE: readonly Weekday[] = ['mie', 'mar', 'lun', 'dom', 'sab', 'vie', 'jue'];

/** Facturado "normal" de ese día de semana — el sábado es el día fuerte; domingo cerrado. */
const BASE_FACTURADO: Record<Weekday, number> = {
  lun: 900,
  mar: 980,
  mie: 890,
  jue: 1050,
  vie: 1150,
  sab: 1480,
  dom: 0,
};

/** Pedidos "normales" de ese día de semana (≈ facturado / ticket prom. ~88 kr). */
const BASE_PEDIDOS: Record<Weekday, number> = {
  lun: 10,
  mar: 11,
  mie: 10,
  jue: 12,
  vie: 13,
  sab: 17,
  dom: 0,
};

/** Mezcla de producto por facturado — misma proporción que el día seed. */
const PRODUCT_MIX = {
  medialunas: 0.39,
  pan: 0.17,
  facturas: 0.44,
} as const;

/** Split de método de pago — misma proporción que el día seed (~80/20). */
const PAYMENT_MIX = {
  mobilepay: 0.8,
  onPickup: 0.2,
} as const;

function weekdayForDaysAgo(daysAgo: number): Weekday {
  return WEEKDAY_CYCLE[(daysAgo - 1) % 7];
}

/**
 * Variación pseudo-diaria determinista (NO Math.random): dos fórmulas de
 * módulo sobre `daysAgo` que dan un poco de textura semana a semana sin
 * romper la reproducibilidad — mismo `daysAgo`, misma variación, siempre.
 */
function facturadoVariationKr(daysAgo: number): number {
  return (((daysAgo * 17) % 9) - 4) * 10; // -40..+40 kr
}

function pedidosVariation(daysAgo: number): number {
  return ((daysAgo * 5) % 3) - 1; // -1..+1
}

function buildDailyAggregate(daysAgo: number): DailyAggregate {
  const weekday = weekdayForDaysAgo(daysAgo);
  const closed = weekday === 'dom';

  const facturado = closed
    ? 0
    : Math.max(0, BASE_FACTURADO[weekday] + facturadoVariationKr(daysAgo));
  const pedidos = closed ? 0 : Math.max(0, BASE_PEDIDOS[weekday] + pedidosVariation(daysAgo));

  const unidadesPorProducto: Record<string, number> = closed
    ? { medialunas: 0, pan: 0, facturas: 0 }
    : {
        medialunas: Math.round((facturado * PRODUCT_MIX.medialunas) / 16),
        pan: Math.round((facturado * PRODUCT_MIX.pan) / 42),
        facturas: Math.round((facturado * PRODUCT_MIX.facturas) / 14),
      };

  const mobilepay = Math.round(facturado * PAYMENT_MIX.mobilepay * 100) / 100;
  const onPickup = Math.round((facturado - mobilepay) * 100) / 100;

  return {
    daysAgo,
    weekday,
    facturado,
    pedidos,
    unidadesPorProducto,
    splitPago: { mobilepay, onPickup },
  };
}

/**
 * 60 agregados diarios, daysAgo 1..60 (ayer .. hace 60 días). Cubre "esta
 * semana" (1-6) + "semana pasada" (7-13) para deltas semanales, y ~2 meses
 * para "este mes" (1-29) + "mes pasado" (30-59).
 */
export const HISTORY_DAYS: DailyAggregate[] = Array.from({ length: 60 }, (_, i) =>
  buildDailyAggregate(i + 1),
);
