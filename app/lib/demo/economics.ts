/**
 * Fórmulas económicas canónicas de la demo (ver design-spec §2 · Economía).
 * Puras, sin React, sin I/O — testeables en aislamiento con `tsx`.
 *
 * Reglas fijas (NO "corregir" después, ver spec):
 * - Los precios de `products.ts` son al público con moms 25% INCLUIDO (Dinamarca).
 *   El componente de moms de un monto bruto es `bruto * 0.20` (25/125).
 * - `ganancia estimada = facturado − moms − Σ(unitCost × qty)`.
 * - `ticket promedio = facturado / pedidos`.
 */

import { PRODUCTS, type Product } from './products';

export type OrderItem = {
  productId: string;
  qty: number;
};

/** Redondeo a 2 decimales (evita ruido de punto flotante en kr.). */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Componente de moms (IVA danés) de un monto bruto ya facturado (25/125). */
export function calcMoms(facturado: number): number {
  return round2(facturado * 0.2);
}

/** Total facturado (kr., moms incluido) de una lista de ítems. */
export function calcOrderTotal(
  items: readonly OrderItem[],
  products: readonly Product[] = PRODUCTS,
): number {
  let total = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`economics.calcOrderTotal: producto desconocido "${item.productId}"`);
    }
    total += product.unitPrice * item.qty;
  }
  return round2(total);
}

/** Costo (kr.) de una lista de ítems, Σ(unitCost × qty). */
export function calcCostOfItems(
  items: readonly OrderItem[],
  products: readonly Product[] = PRODUCTS,
): number {
  let cost = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`economics.calcCostOfItems: producto desconocido "${item.productId}"`);
    }
    cost += product.unitCost * item.qty;
  }
  return round2(cost);
}

/** Ganancia estimada = facturado − moms − costo de mercadería. */
export function calcProfit(facturado: number, moms: number, cost: number): number {
  return round2(facturado - moms - cost);
}

/** Ticket promedio = facturado / pedidos (0 si no hay pedidos). */
export function calcAverageTicket(facturado: number, orderCount: number): number {
  if (orderCount <= 0) return 0;
  return round2(facturado / orderCount);
}
