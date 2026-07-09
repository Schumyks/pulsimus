"use client";

/**
 * Panel 4 of El tablero — "Retiros de hoy" / "Próximos retiros" (design-spec
 * §4.3.4). An operative agenda: what has to be ready and when, not a chart —
 * so it prioritizes legibility of hour+status over dataviz adornments.
 *
 * `selectPickups` already orders by pickup time and swaps its source set by
 * period (today: every order of the day; week/month: the "próximos" —
 * pending + confirmed reservations, spec §4.2). This panel just renders that
 * agenda and reuses the mostrador's three status labels verbatim (never
 * color alone, design-spec §4.5).
 *
 * Content-only: the shell (`Tablero.tsx` → `Frame`) owns the card chrome.
 */

import { useCallback, type CSSProperties } from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useDemoSelector } from "../../lib/demo/hooks";
import { selectPickups, type Period, type Pickup } from "../../lib/demo/selectors";
import type { DemoState, OrderStatus } from "../../lib/demo/store";
import { getProduct } from "../../lib/demo/products";

type PanelProps = { period: Period; active: boolean };

const ENTRY_STAGGER_MS = 40;

/**
 * Fade en los bordes sup/inf de la lista scrolleable — mismo patrón que
 * `OwnerPanel.tsx` (mask-image en vez de un gradiente pintado, así se
 * aplica al contenido real sin superponer un div extra).
 */
const SCROLL_FADE =
  "linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)";

// Estado con TEXTO siempre (nunca color solo) — mismo vocabulario que
// `Ticket.tsx` en el mostrador, adaptado a la superficie noche del tablero.
const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  paid: {
    label: "✓ Pagada (MobilePay)",
    className: "text-hueso/60",
  },
  reservation_pending: {
    label: "Reserva · pendiente",
    className:
      "rounded-full bg-ambar/15 px-2 py-0.5 text-ambar ring-1 ring-inset ring-ambar/40",
  },
  reservation_confirmed: {
    label: "✓ Reserva confirmada",
    className: "rounded-full bg-hueso/10 px-2 py-0.5 text-hueso/70",
  },
};

function summarizeItems(items: Pickup["items"]): string {
  return items
    .map((item) => {
      const product = getProduct(item.productId);
      return `${product?.name ?? item.productId} ×${item.qty}`;
    })
    .join(", ");
}

function rowEntryStyle(index: number, active: boolean, reduced: boolean): CSSProperties {
  if (reduced) return {};
  return {
    opacity: active ? 1 : 0,
    transform: active ? "none" : "translateY(10px)",
    transition: `opacity 0.5s ease ${index * ENTRY_STAGGER_MS}ms, transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) ${index * ENTRY_STAGGER_MS}ms`,
  };
}

export default function PickupsPanel({ period, active }: PanelProps) {
  const reduced = useReducedMotion();
  const select = useCallback((s: DemoState) => selectPickups(s, period), [period]);
  const pickups = useDemoSelector(select);

  const title = period === "today" ? "Retiros de hoy" : "Próximos retiros";

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-hueso">{title}</h3>

      {pickups.length === 0 ? (
        <p className="py-6 text-center text-sm text-hueso/50">Sin retiros por ahora.</p>
      ) : (
        <ul
          className="flex max-h-[360px] flex-col gap-2 overflow-y-auto py-1"
          style={{ maskImage: SCROLL_FADE, WebkitMaskImage: SCROLL_FADE }}
        >
          {pickups.map((pickup, index) => {
            const status = STATUS_META[pickup.status];
            return (
              <li
                key={`${pickup.pickupAt}-${pickup.customer}-${index}`}
                style={rowEntryStyle(index, active, reduced)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hueso/10 bg-hueso/5 px-4 py-2.5"
              >
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="shrink-0 tabular-nums font-semibold text-ambar">
                    {pickup.pickupAt}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-hueso">{pickup.customer}</p>
                    <p className="truncate text-sm text-hueso/60">
                      {summarizeItems(pickup.items)}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-medium ${status.className}`}>
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
