"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./mostrador/ProductCard";
import DraftTicket from "./mostrador/DraftTicket";
import PaymentMoment from "./mostrador/PaymentMoment";
import AutofillForm from "./mostrador/AutofillForm";
import Envelope from "./mostrador/Envelope";
import OwnerPanel from "./mostrador/OwnerPanel";
import TunePanel from "./dev/TunePanel";
import { useReducedMotion } from "./motion/useReducedMotion";
import { PRODUCTS } from "../lib/demo/products";
import { useDemoActions } from "../lib/demo/hooks";
import { peekNextOrder, type PaymentMethod } from "../lib/demo/store";
import { DEFAULT_FLOW_PARAMS, type FlowParams } from "./mostrador/flowParams";

/**
 * El mostrador — la pieza firma. Orquesta el ciclo completo del negocio sobre
 * el store compartido (app/lib/demo): el visitante ARMA un pedido con steppers,
 * lo confirma y paga, la orden VIAJA como sobre al lado interno, y aparece del
 * otro lado del mostrador (OwnerPanel) imprimiéndose. Un solo registro, las dos
 * vistas — esa continuidad es la prueba de la infraestructura.
 *
 * Máquina de fases del lado cliente:
 *   building → choosing → [paying → paid] → filling → traveling → (commit)
 * "Pagar ahora" gana el teatro (pulso + Procesando → ✓ Pagado); "Pago al
 * retirar" viaja sobrio (es una reserva). reduced-motion salta todo el teatro:
 * la orden se comitea y aparece directa en la lista. Los timings salen de
 * `?tune` (Alan los congela en el gate).
 */
type Phase = "building" | "choosing" | "paying" | "paid" | "filling" | "traveling";

const PAID_BEAT_MS = 520;

type CustomerData = { customer: string; pickup: string; contact: string };
type Flight = { origin: DOMRect; target: DOMRect };

/** DK-style contact, deterministic from the seed (no Math.random). */
function fakeContact(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 100_000_000;
  const d = String(hash).padStart(8, "0");
  return `+45 ${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)}`;
}

export default function Mostrador() {
  const reduced = useReducedMotion();
  const { placeOrder } = useDemoActions();

  const [draft, setDraft] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>("building");
  const [pendingMethod, setPendingMethod] = useState<PaymentMethod>("mobilepay");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [params, setParams] = useState<FlowParams>(DEFAULT_FLOW_PARAMS);
  const [tuneOpen, setTuneOpen] = useState(false);

  const flightRef = useRef<HTMLDivElement | null>(null);
  const ownerColRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => {
    // Client-only gate: the ?tune panel depends on window.location, absent
    // during SSR. A lazy state initializer would hydration-mismatch (server
    // false / client true), so it's read once post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL gate, must resolve after hydration
    if (new URLSearchParams(window.location.search).has("tune")) setTuneOpen(true);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

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
    clearTimers();
    setDraft({});
    setPendingMethod("mobilepay");
    setCustomer(null);
    setFlight(null);
    setPhase("building");
  }, [clearTimers]);

  const commit = useCallback(
    (method: PaymentMethod) => {
      placeOrder(
        lines.map((line) => ({ productId: line.product.id, qty: line.qty })),
        method,
      );
      reset();
    },
    [lines, placeOrder, reset],
  );

  const startFlow = useCallback(
    (method: PaymentMethod) => {
      setPendingMethod(method);

      // reduced-motion: no theater, no journey — the order just appears.
      if (reduced) {
        commit(method);
        return;
      }

      const next = peekNextOrder();
      setCustomer({
        customer: next.customer,
        pickup: `hoy · ${next.pickupAt}`,
        contact: fakeContact(next.customer + next.pickupAt),
      });

      if (method === "mobilepay") {
        setPhase("paying");
        later(() => setPhase("paid"), params.processingMs);
        later(() => setPhase("filling"), params.processingMs + PAID_BEAT_MS);
      } else {
        // Reservation: sober, straight to the form (no payment celebration).
        setPhase("filling");
      }
    },
    [reduced, commit, later, params.processingMs],
  );

  const onFormComplete = useCallback(() => {
    const origin = flightRef.current?.getBoundingClientRect();
    const target = ownerColRef.current?.getBoundingClientRect();
    if (!origin || !target) {
      commit(pendingMethod);
      return;
    }
    setFlight({ origin, target });
    setPhase("traveling");
  }, [commit, pendingMethod]);

  const onEnvelopeArrive = useCallback(() => {
    commit(pendingMethod);
  }, [commit, pendingMethod]);

  const showsDraft =
    phase === "building" ||
    phase === "choosing" ||
    phase === "paying" ||
    phase === "paid";

  const paymentMode =
    phase === "paying" ? "processing" : phase === "paid" ? "paid" : "choose";

  const draftFooter =
    phase === "building" ? undefined : (
      <PaymentMoment
        total={total}
        mode={paymentMode}
        onPayNow={() => startFlow("mobilepay")}
        onReserve={() => startFlow("on_pickup")}
      />
    );

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
        <p data-rv="" data-rv-d="100" className="mt-4 max-w-2xl text-lg text-bruma">
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

            <div ref={flightRef}>
              {showsDraft && (
                <DraftTicket
                  lines={lines}
                  total={total}
                  onConfirm={() => setPhase("choosing")}
                  footer={draftFooter}
                  pulsing={phase === "paying"}
                />
              )}
              {phase === "filling" && customer && (
                <AutofillForm
                  customer={customer.customer}
                  pickup={customer.pickup}
                  contact={customer.contact}
                  typingCharMs={params.typingCharMs}
                  fieldStaggerMs={params.fieldStaggerMs}
                  reduced={reduced}
                  onComplete={onFormComplete}
                />
              )}
            </div>
          </div>

          <div
            ref={ownerColRef}
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

      {phase === "traveling" && flight && (
        <Envelope
          originRect={flight.origin}
          targetRect={flight.target}
          foldMs={params.foldMs}
          travelMs={params.travelMs}
          onArrive={onEnvelopeArrive}
        />
      )}

      {tuneOpen && <TunePanel params={params} onChange={setParams} />}
    </section>
  );
}
