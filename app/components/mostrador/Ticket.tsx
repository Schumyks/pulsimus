"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Order, OrderStatus } from "../../lib/demo/store";
import { getProduct } from "../../lib/demo/products";

type TicketProps = {
  order: Order;
  /**
   * true only the first time this order's ticket mounts as a genuinely new
   * order (OwnerPanel passes `order.isLive`) — frozen into `shouldAnimate`
   * below, so later prop changes for the same mounted instance are ignored.
   */
  animateIn: boolean;
  onOpenDetail: () => void;
};

const GRID_TRANSITION =
  "grid-template-rows 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)";
const REVEAL_TRANSITION =
  "opacity 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function formatKr(value: number): string {
  return `${Math.round(value).toLocaleString("da-DK")} kr.`;
}

function summarizeItems(items: Order["items"]): string {
  return items
    .map((item) => {
      const product = getProduct(item.productId);
      return `${product?.name ?? item.productId} ×${item.qty}`;
    })
    .join(", ");
}

/**
 * Estado con TEXTO siempre (nunca color solo): las tres etiquetas se leen
 * sin depender del color de fondo. Se recalcula en cada render a partir de
 * `order.status` — nunca se cachea — así el eco de `confirmReservation`
 * (pending → confirmed, disparado desde El tablero) actualiza el badge solo.
 */
const STATUS_META: Record<OrderStatus, { label: string; className: string }> =
  {
    paid: {
      label: "✓ Pagada (MobilePay)",
      className: "text-noche/70",
    },
    reservation_pending: {
      label: "Reserva · pendiente",
      className:
        "rounded-full bg-ambar/15 px-2 py-0.5 text-noche ring-1 ring-inset ring-ambar/50",
    },
    reservation_confirmed: {
      label: "✓ Reserva confirmada",
      className: "rounded-full bg-noche/8 px-2 py-0.5 text-noche/70",
    },
  };

export default function Ticket({ order, animateIn, onOpenDetail }: TicketProps) {
  // `animateIn` is frozen at MOUNT into `shouldAnimate`: whether to print
  // this ticket in is a decision made once, the instant it's born (its
  // `order.number` key never remounts it again). This also protects the
  // transition from a parent re-render that recomputes `animateIn` for the
  // same key after the fact (e.g. OwnerPanel re-rendering for an unrelated
  // reason) — a live prop read here would risk yanking the CSS transition
  // mid-flight and making the print-in snap instead of animate.
  const [shouldAnimate] = useState(animateIn);
  // Reduced-motion is read once at mount: a static seed ticket
  // (shouldAnimate false) or a reduced-motion mount both start already
  // expanded, with no transition wired up. Only a live insert with motion
  // allowed starts collapsed and expands on the next frame — the same rAF
  // handshake Reveals.tsx uses to give the browser a frame to paint the
  // "before" state.
  const [reduced] = useState(() => !shouldAnimate || prefersReducedMotion());
  const [expanded, setExpanded] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const raf = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const withTransition = shouldAnimate && !reduced;

  const wrapperStyle: CSSProperties = {
    display: "grid",
    gridTemplateRows: expanded ? "1fr" : "0fr",
    ...(withTransition ? { transition: GRID_TRANSITION } : null),
  };

  const innerStyle: CSSProperties = {
    overflow: "hidden",
    opacity: expanded ? 1 : 0,
    transform: expanded ? "translateY(0)" : "translateY(-8px)",
    ...(withTransition ? { transition: REVEAL_TRANSITION } : null),
  };

  // Status is derived from `order` on every render (never cached in
  // useState at mount): the pending→confirmed echo from a "Confirmar
  // reserva" click elsewhere just re-renders this Ticket with the same
  // `order.number` key, and the badge updates on its own.
  const status = STATUS_META[order.status];

  return (
    <li>
      <div style={wrapperStyle}>
        <div style={innerStyle}>
          <button
            type="button"
            onClick={onOpenDetail}
            aria-label={`Ver detalle del pedido número ${order.number} de ${order.customer}`}
            className="w-full rounded-t-lg bg-hueso px-4 pt-3 pb-2 text-left text-noche transition-colors hover:bg-hueso/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 font-semibold">
                {order.isLive && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
                  />
                )}
                #{order.number} · {order.customer}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">
                {formatKr(order.total)}
              </span>
            </div>
            <p className="mt-1 text-sm text-noche/70">
              {summarizeItems(order.items)}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className={`text-xs font-medium ${status.className}`}>
                {status.label}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-bruma">
                retiro {order.pickupAt}
              </span>
            </div>
          </button>
          <div className="px-ticket-teeth" aria-hidden="true" />
        </div>
      </div>
    </li>
  );
}
