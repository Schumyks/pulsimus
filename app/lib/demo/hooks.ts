'use client';

/**
 * Única capa de `app/lib/demo/` que importa React. Envuelve el store plano
 * (`store.ts`) con `useSyncExternalStore`, mismo patrón que
 * `app/components/motion/useReducedMotion.ts` (subscribe / getSnapshot /
 * getServerSnapshot). El resto del módulo (products/names/economics/seeds/
 * store/selectors) es TS puro sin React — así se puede verificar con `tsx`
 * en Node sin arrastrar un runtime de React.
 */

import { useMemo, useSyncExternalStore } from 'react';
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  placeOrder,
  confirmReservation,
  type DemoState,
  type Order,
  type OrderItem,
  type PaymentMethod,
} from './store';

/** Snapshot completo del store, re-renderiza el componente cuando cambia. */
export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Selector genérico sobre el estado de la demo. Recomputa cuando cambia el
 * snapshot o la identidad de `selector` — si el llamador arma el selector
 * inline, memoizalo con `useCallback` para evitar recomputar en renders
 * que no tocan la demo.
 */
export function useDemoSelector<T>(selector: (state: DemoState) => T): T {
  const state = useDemoState();
  return useMemo(() => selector(state), [state, selector]);
}

/** Órdenes del día (seed + las que arma el visitante en esta visita). */
export function useOrders(): Order[] {
  return useDemoSelector((state) => state.orders);
}

/** Acciones del store, con referencia estable entre renders. */
export function useDemoActions(): {
  placeOrder: (items: OrderItem[], paymentMethod: PaymentMethod) => Order;
  confirmReservation: (orderNumber: number) => boolean;
} {
  return useMemo(() => ({ placeOrder, confirmReservation }), []);
}
