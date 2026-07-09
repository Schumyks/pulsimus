"use client";

import { useCallback, useMemo, useState } from "react";
import ProductCard from "./mostrador/ProductCard";
import DraftTicket from "./mostrador/DraftTicket";
import PaymentMoment from "./mostrador/PaymentMoment";
import OwnerPanel from "./mostrador/OwnerPanel";
import { PRODUCTS } from "../lib/demo/products";
import { useDemoActions } from "../lib/demo/hooks";
import type { PaymentMethod } from "../lib/demo/store";

/**
 * El mostrador — la pieza firma. Orquesta el ciclo completo del negocio sobre
 * el store compartido (app/lib/demo): el visitante ARMA un pedido con steppers
 * (lado cliente), lo confirma y paga, y la orden aparece del otro lado del
 * mostrador (lado dueño, OwnerPanel) — un solo registro, las dos vistas.
 *
 * Flujo (R4-4a, integración funcional): building → choosing → placeOrder.
 * El teatro de pago (pulso ámbar), el form autorrellenado y el viaje del sobre
 * (FLIP al panel dueño) los layerea el director en 4b sobre esta máquina.
 */
type Phase = "building" | "choosing";

export default function Mostrador() {
  const { placeOrder } = useDemoActions();
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("building");

  const setQty = useCallback((id: string, qty: number) => {
    setDraft((prev) => ({ ...prev, [id]: qty }));
  }, []);

  const lines = useMemo(
    () =>
      PRODUCTS.map((product) => ({ product, qty: draft[product.id] ?? 0 })).filter(
        (line) => line.qty > 0,
      ),
    [draft],
  );

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.unitPrice * line.qty, 0),
    [lines],
  );

  const reset = useCallback(() => {
    setDraft({});
    setPhase("building");
  }, []);

  const handlePay = useCallback(
    (method: PaymentMethod) => {
      placeOrder(
        lines.map((line) => ({ productId: line.product.id, qty: line.qty })),
        method,
      );
      reset();
    },
    [lines, placeOrder, reset],
  );

  const draftFooter =
    phase === "choosing" ? (
      <PaymentMoment total={total} onPay={handlePay} />
    ) : undefined;

  return (
    <section id="mostrador" aria-labelledby="mostrador-title" className="bg-hueso">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <h2
          id="mostrador-title"
          data-rv=""
          className="max-w-3xl text-3xl font-semibold text-noche md:text-4xl"
        >
          Tocá los dos lados del mostrador.
        </h2>
        <p
          data-rv=""
          data-rv-d="100"
          className="mt-4 max-w-2xl text-lg text-bruma"
        >
          La Espiga no existe. El mostrador, sí. Pedí algo y mirá cómo te llega.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div
            data-rv=""
            data-rv-d="120"
            className="rounded-2xl border border-noche/10 p-6 md:p-8"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-bruma">
              LO QUE VE TU CLIENTE
            </p>
            <div className="mt-6">
              <p className="text-xl font-semibold text-noche">La Espiga</p>
              <p className="mt-1 text-sm text-bruma">
                Panadería de barrio · Pedidos para retirar
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  qty={draft[product.id] ?? 0}
                  onQtyChange={(next) => setQty(product.id, next)}
                  disabled={phase !== "building"}
                />
              ))}
            </div>
            <DraftTicket
              lines={lines}
              total={total}
              onConfirm={() => setPhase("choosing")}
              footer={draftFooter}
            />
          </div>

          <div
            data-rv=""
            data-rv-d="240"
            className="rounded-2xl bg-noche p-6 text-hueso md:p-8"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-hueso/60">
              LO QUE VES VOS
            </p>
            <div className="mt-6">
              <OwnerPanel />
            </div>
          </div>
        </div>

        <p
          data-rv=""
          className="mt-16 max-w-3xl text-2xl leading-snug font-semibold text-noche md:text-3xl"
        >
          Esto que acabás de tocar es lo que hacemos: los dos lados del
          mostrador. El que ve tu cliente, y el que ves vos.
        </p>
        <p
          data-rv=""
          data-rv-d="100"
          className="mt-6 flex items-center gap-2 text-sm text-bruma"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
            aria-hidden="true"
          />
          Pulsimus la diseñamos de cero, del logo a esta página.
        </p>
      </div>
    </section>
  );
}
