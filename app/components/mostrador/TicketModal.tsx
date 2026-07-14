"use client";

import { useEffect, useRef } from "react";
import type { Order, OrderStatus, PaymentMethod } from "../../lib/demo/store";
import { getProduct } from "../../lib/demo/products";

type TicketModalProps = {
  /** null = cerrado. */
  order: Order | null;
  onClose: () => void;
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  mobilepay: "MobilePay",
  on_pickup: "Pago al retirar",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "✓ Pagada",
  reservation_pending: "Reserva · pendiente de confirmar",
  reservation_confirmed: "✓ Reserva confirmada",
};

function formatKr(value: number): string {
  return `${Math.round(value).toLocaleString("da-DK")} kr.`;
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

/**
 * Detalle del pedido — "levantar el papelito" (design-spec §3.2). Dialog
 * accesible: role="dialog" + aria-modal, focus trap (Tab/Shift+Tab cicla
 * dentro), Esc y click en el backdrop cierran, el foco vuelve al disparador
 * al cerrar. `onClose` se lee de un ref para que un cambio de identidad de
 * la función (el llamador la re-crea en cada render) no reinicie el efecto
 * de trap ni reubique el foco mientras el modal sigue abierto.
 */
export default function TicketModal({ order, onClose }: TicketModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isOpen = order !== null;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const initial = dialog ? focusableElements(dialog) : [];
    (initial[0] ?? dialog)?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const items = focusableElements(dialog);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus?.();
    };
  }, [isOpen]);

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-noche/60 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-hueso p-6 text-noche shadow-2xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="ticket-modal-title"
              className="text-lg font-semibold text-noche"
            >
              Pedido #{order.number}
            </h2>
            <p className="mt-0.5 text-sm text-bruma">{order.customer}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle del pedido"
            className="shrink-0 rounded-full p-1.5 text-bruma transition-colors hover:bg-noche/5 hover:text-noche focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
              className="fill-none stroke-current stroke-2"
            >
              <path d="M4 4 L14 14 M14 4 L4 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm font-medium text-noche">
          {STATUS_LABEL[order.status]}
        </p>

        <ul className="mt-4 divide-y divide-noche/10 text-sm">
          {order.items.map((item) => {
            const product = getProduct(item.productId);
            const name = product?.name ?? item.productId;
            const unitPrice = product?.unitPrice ?? 0;
            return (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span>
                  {name} ×{item.qty}
                </span>
                <span className="tabular-nums text-bruma">
                  {formatKr(unitPrice)} c/u
                </span>
                <span className="tabular-nums font-medium">
                  {formatKr(unitPrice * item.qty)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-2 flex items-center justify-between border-t border-noche/10 pt-3 text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatKr(order.total)}</span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <dt className="text-bruma">Método de pago</dt>
          <dd className="text-right tabular-nums">
            {PAYMENT_LABEL[order.paymentMethod]}
          </dd>
          <dt className="text-bruma">Hora del pedido</dt>
          <dd className="text-right tabular-nums">{order.placedAt}</dd>
          <dt className="text-bruma">Retiro</dt>
          <dd className="text-right tabular-nums">{order.pickupAt}</dd>
          <dt className="text-bruma">Canal</dt>
          <dd className="text-right">Web</dd>
        </dl>
      </div>
    </div>
  );
}
