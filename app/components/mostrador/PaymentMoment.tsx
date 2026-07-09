"use client";

import type { PaymentMethod } from "../../lib/demo/store";

type PaymentMomentProps = {
  total: number;
  onPay: (method: PaymentMethod) => void;
};

/**
 * The payment moment, in place inside the draft ticket (spec §3.1 paso 2):
 * two ways to close the order — "Pagar ahora" (pay now, our own MobilePay-style
 * mark, zero foreign trade dress) or "Pago al retirar" (= a reservation).
 *
 * R4 (this phase) wires the two choices straight through; the pay-now theater
 * (amber pulse · "Procesando…" → "✓ Pagado") and the envelope journey are
 * layered by the director on top of this seam.
 */
export default function PaymentMoment({ total, onPay }: PaymentMomentProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onPay("mobilepay")}
        className="flex items-center justify-center gap-2 rounded-full bg-ambar px-4 py-2.5 text-sm font-semibold text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
      >
        Pagar ahora
        <span className="tabular-nums">· {total} kr</span>
      </button>
      <button
        type="button"
        onClick={() => onPay("on_pickup")}
        className="rounded-full border border-noche/20 px-4 py-2.5 text-sm font-medium text-noche transition-colors hover:bg-noche/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
      >
        Pago al retirar
      </button>
    </div>
  );
}
