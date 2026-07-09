"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Product } from "../../lib/demo/products";
import { useReducedMotion } from "../motion/useReducedMotion";

type DraftTicketLine = {
  product: Product;
  qty: number;
};

type DraftTicketProps = {
  lines: DraftTicketLine[];
  total: number;
  onConfirm: () => void;
  /**
   * When provided, replaces the default "Confirmar pedido" button — the
   * director swaps in the payment moment (R4) once the order is confirmed,
   * keeping payment IN the ticket (spec §3.1 paso 2).
   */
  footer?: ReactNode;
};

const ENTER_TRANSITION =
  "opacity 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)";

/**
 * Ticket borrador: "papel que aún no se imprimió". Vive solo mientras el
 * visitante arma el pedido (§3.1 paso 1 de la spec) — no conoce el momento
 * de pago, eso lo envuelve el director en R4/R5 alrededor de `onConfirm`.
 */
export default function DraftTicket({ lines, total, onConfirm, footer }: DraftTicketProps) {
  const reduced = useReducedMotion();
  const visibleLines = lines.filter((line) => line.qty > 0);
  const hasItems = visibleLines.length > 0 && total > 0;

  // Detecta el flanco false→true de `hasItems` DURANTE el render ("adjusting
  // state when a prop changes", sin efecto) para animar la entrada SOLO la
  // primera vez que aparece un ítem — nunca en cada +/- posterior, porque
  // el componente nunca se desmonta (el padre siempre lo renderiza; es este
  // componente el que decide devolver null mientras el carrito está vacío).
  const [prevHasItems, setPrevHasItems] = useState(false);
  const [entered, setEntered] = useState(true);
  if (hasItems !== prevHasItems) {
    setPrevHasItems(hasItems);
    if (hasItems) setEntered(reduced);
  }

  // Handshake de dos frames (mismo patrón que Ticket.tsx): arranca en el
  // estado "antes" sin transición, y recién en el frame siguiente pasa al
  // estado "después" con la transición activa — el setState vive dentro
  // del callback de rAF, nunca sincrónico en el cuerpo del efecto.
  useEffect(() => {
    if (reduced || entered) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [entered, reduced]);

  if (!hasItems) return null;

  const wrapperStyle: CSSProperties = {
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(8px)",
    ...(reduced ? null : { transition: ENTER_TRANSITION }),
  };

  return (
    <div style={wrapperStyle} className="mt-6 flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-dashed border-noche/25 bg-white">
        <div className="px-4 pt-4 pb-3 text-noche">
          <p className="text-xs font-medium tracking-[0.15em] text-bruma">
            TU PEDIDO
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {visibleLines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span>
                  {line.product.name} · ×{line.qty}
                </span>
                <span className="tabular-nums text-noche/80">
                  {line.product.unitPrice * line.qty} kr
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-noche/25 pt-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold tabular-nums">
              {total} kr
            </span>
          </div>
        </div>
        <div className="px-ticket-teeth" aria-hidden="true" />
      </div>
      {footer ?? (
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-ambar px-4 py-2.5 text-sm font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
        >
          Confirmar pedido
        </button>
      )}
    </div>
  );
}
