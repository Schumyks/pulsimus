"use client";

export type PaymentMomentMode = "choose" | "processing" | "paid";

type PaymentMomentProps = {
  total: number;
  mode: PaymentMomentMode;
  onPayNow: () => void;
  onReserve: () => void;
};

/**
 * The payment moment, in place inside the draft ticket (spec §3.1 paso 2).
 * Three modes, driven by the orchestrator:
 * - `choose`: two ways to close the order — "Pagar ahora" (our own MobilePay-
 *   style mark, zero foreign trade dress) or "Pago al retirar" (= reservation).
 * - `processing`: the pay-now theater — "Procesando…" while the ticket pulses.
 * - `paid`: "✓ Pagado N kr." the instant before the envelope forms.
 * The reservation path never enters processing/paid: its animation is sober
 * (it's a promise, not a celebration — spec §3.1 paso 4).
 */
export default function PaymentMoment({
  total,
  mode,
  onPayNow,
  onReserve,
}: PaymentMomentProps) {
  if (mode === "processing") {
    return (
      <p
        aria-live="polite"
        className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-noche"
      >
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ambar" aria-hidden="true" />
        Procesando…
      </p>
    );
  }

  if (mode === "paid") {
    return (
      <p
        aria-live="polite"
        className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-noche"
      >
        <span aria-hidden="true">✓</span>
        Pagado <span className="tabular-nums">{total} kr</span>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onPayNow}
        className="flex items-center justify-center gap-2 rounded-full bg-ambar px-4 py-2.5 text-sm font-semibold text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
      >
        Pagar ahora
        <span className="tabular-nums">· {total} kr</span>
      </button>
      <button
        type="button"
        onClick={onReserve}
        className="rounded-full border border-noche/20 px-4 py-2.5 text-sm font-medium text-noche transition-colors hover:bg-noche/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
      >
        Pago al retirar
      </button>
    </div>
  );
}
