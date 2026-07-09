"use client";

/**
 * Panel 1 of El tablero — "⚡ Reservas por confirmar" (design-spec §4.3.1).
 * Full-width row, THE actionable panel: the owner (the visitor, wearing the
 * other hat) confirms `reservation_pending` orders from here. Confirming
 * echoes back up to the mostrador's mini-dashboard for free — `Ticket.tsx`
 * re-derives its status badge from `order.status` on every render, so this
 * panel only has to call the store action.
 *
 * Content-only: the shell (`Tablero.tsx` → `Frame`) owns the card chrome.
 *
 * Sealing choreography: `selectPendingReservations` stops returning a row the
 * instant it's confirmed (status flips out of `reservation_pending`), so a
 * naive render would yank the row out with no feedback. `sealing` snapshots
 * the row at click time and keeps it rendered — SEALED (ambar ✓, dimmed,
 * no button) — for one beat before letting it go, so the interaction reads
 * as accionable → sealed → gone instead of accionable → gone.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useDemoActions, useDemoSelector } from "../../lib/demo/hooks";
import {
  selectPendingReservations,
  type Period,
  type PendingReservation,
} from "../../lib/demo/selectors";
import { getProduct } from "../../lib/demo/products";
import { formatKr } from "./primitives";

type PanelProps = { period: Period; active: boolean };

const SEAL_MS = 900;
const ENTRY_STAGGER_MS = 60;

function summarizeItems(items: PendingReservation["items"]): string {
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

// The `period` prop is part of the shared panel contract (Tablero.tsx passes
// it uniformly to every panel) but this panel's data is a live queue that
// never depends on it (design-spec §4.2: "las colas viven en presente").
export default function ReservationsQueue({ active }: PanelProps) {
  const reduced = useReducedMotion();
  const pending = useDemoSelector(selectPendingReservations);
  const { confirmReservation } = useDemoActions();

  const [sealing, setSealing] = useState<Map<number, PendingReservation>>(() => new Map());
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const timeout of timeouts.values()) clearTimeout(timeout);
    };
  }, []);

  const handleConfirm = useCallback(
    (reservation: PendingReservation) => {
      setSealing((prev) => {
        const next = new Map(prev);
        next.set(reservation.number, reservation);
        return next;
      });
      confirmReservation(reservation.number);
      const timeout = setTimeout(() => {
        setSealing((prev) => {
          if (!prev.has(reservation.number)) return prev;
          const next = new Map(prev);
          next.delete(reservation.number);
          return next;
        });
        timeoutsRef.current.delete(reservation.number);
      }, SEAL_MS);
      timeoutsRef.current.set(reservation.number, timeout);
    },
    [confirmReservation],
  );

  // Merge live-pending rows with sealed snapshots and re-sort by pickup time
  // (the same order `selectPendingReservations` already returns) so a row
  // being confirmed doesn't jump position while it seals.
  const rows = useMemo(() => {
    const notSealing = pending.filter((r) => !sealing.has(r.number));
    return [...notSealing, ...sealing.values()].sort((a, b) =>
      a.pickupAt.localeCompare(b.pickupAt),
    );
  }, [pending, sealing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-hueso">⚡ Reservas por confirmar</h3>
        <span className="shrink-0 rounded-full bg-ambar px-2.5 py-0.5 text-sm font-semibold text-noche">
          {pending.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-hueso/50">Todo confirmado ✓</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((reservation, index) => {
            const isSealed = sealing.has(reservation.number);
            return (
              <li
                key={reservation.number}
                style={rowEntryStyle(index, active, reduced)}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  isSealed
                    ? "border-ambar/40 bg-ambar/10"
                    : "border-hueso/10 bg-hueso/5"
                }`}
              >
                <div className={`min-w-0 flex-1 ${isSealed ? "opacity-60" : ""}`}>
                  <p className="truncate font-semibold text-hueso">
                    #{reservation.number} · {reservation.customer}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-hueso/70">
                    {summarizeItems(reservation.items)}
                  </p>
                </div>
                <div className={`flex shrink-0 flex-wrap items-center gap-4 ${isSealed ? "opacity-60" : ""}`}>
                  <span className="tabular-nums font-semibold text-hueso">
                    {formatKr(reservation.total)}
                  </span>
                  <span className="tabular-nums text-sm text-hueso/60">
                    retiro {reservation.pickupAt}
                  </span>
                </div>
                {isSealed ? (
                  <span
                    aria-hidden="true"
                    className="shrink-0 rounded-full bg-ambar px-2.5 py-0.5 text-sm font-semibold text-noche"
                  >
                    ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConfirm(reservation)}
                    className="shrink-0 rounded-full bg-ambar px-4 py-2 text-sm font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
                  >
                    Confirmar reserva
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
