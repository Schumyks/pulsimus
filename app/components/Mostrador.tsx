"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import ProductCard from "./mostrador/ProductCard";
import Ticket from "./mostrador/Ticket";
import { useReducedMotion } from "./motion/useReducedMotion";

const PRODUCTS = [
  { id: "medialunas", name: "Medialunas", qty: 6, img: "/la-espiga/medialunas-3.webp" },
  { id: "pan", name: "Pan de campo", qty: 1, img: "/la-espiga/pan-2.webp" },
  { id: "facturas", name: "Facturas", qty: 12, img: "/la-espiga/medialunas-canoncitos-1.webp" },
] as const;

const SEED_ORDERS: Order[] = [
  { id: "seed-1", name: "Sofía", product: "Medialunas", qty: 6, time: "10:30", fresh: false },
  { id: "seed-2", name: "Martín", product: "Pan de campo", qty: 1, time: "11:00", fresh: false },
];

const MAX_VISIBLE = 4;
const TRAVEL_MS = 550;
const LOCKOUT_MS = 1300;

type Order = {
  id: string;
  name: string;
  product: string;
  qty: number;
  time: string;
  fresh: boolean;
};

type Chip = { qty: number; x: number; y: number; dx: number; dy: number };

/* Pickup time: now + 45 min, rounded up to the next quarter hour. */
function pickupTime(): string {
  const t = new Date(Date.now() + 45 * 60 * 1000);
  t.setMinutes(Math.ceil(t.getMinutes() / 15) * 15, 0, 0);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function Mostrador() {
  const reduced = useReducedMotion();
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  // Total for the live badge: keeps counting past the visible-list cap.
  const [totalCount, setTotalCount] = useState(SEED_ORDERS.length);
  const [orderedId, setOrderedId] = useState<string | null>(null);
  const [chip, setChip] = useState<Chip | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const ownerHeaderRef = useRef<HTMLDivElement | null>(null);
  const counter = useRef(0);

  // Launch the chip on the frame after it mounts so the transition runs.
  useLayoutEffect(() => {
    if (!chip) return;
    const el = chipRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${chip.dx}px), calc(-50% + ${chip.dy}px)) scale(0.7)`;
      el.style.opacity = "0";
    });
    return () => cancelAnimationFrame(raf);
  }, [chip]);

  const handleOrder = useCallback(
    (product: (typeof PRODUCTS)[number]) =>
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (orderedId) return;
        setOrderedId(product.id);
        window.setTimeout(() => setOrderedId(null), LOCKOUT_MS);

        counter.current += 1;
        const order: Order = {
          id: `o-${counter.current}`,
          name: "Vos",
          product: product.name,
          qty: product.qty,
          time: pickupTime(),
          fresh: true,
        };

        const target = ownerHeaderRef.current;
        if (reduced || !target) {
          setOrders((prev) => [order, ...prev].slice(0, MAX_VISIBLE));
          setTotalCount((c) => c + 1);
          return;
        }

        const a = e.currentTarget.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const x = a.left + a.width / 2;
        const y = a.top + a.height / 2;
        setChip({
          qty: product.qty,
          x,
          y,
          dx: b.left + b.width / 2 - x,
          dy: b.bottom + 16 - y,
        });
        window.setTimeout(() => {
          setChip(null);
          setOrders((prev) => [order, ...prev].slice(0, MAX_VISIBLE));
          setTotalCount((c) => c + 1);
        }, TRAVEL_MS + 120);
      },
    [orderedId, reduced],
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
                  name={product.name}
                  qty={product.qty}
                  img={product.img}
                  ordered={orderedId === product.id}
                  onOrder={handleOrder(product)}
                />
              ))}
            </div>
          </div>

          <div
            data-rv=""
            data-rv-d="240"
            className="rounded-2xl bg-noche p-6 text-hueso md:p-8"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-hueso/60">
              LO QUE VES VOS
            </p>
            <div
              ref={ownerHeaderRef}
              className="mt-6 flex items-center justify-between"
            >
              <h3 className="text-xl font-semibold text-hueso">
                Pedidos de hoy
              </h3>
              <span className="rounded-full bg-ambar px-2.5 py-0.5 text-sm font-semibold text-noche">
                {totalCount}
              </span>
            </div>
            <ul aria-live="polite" className="mt-5 flex flex-col gap-3">
              {orders.map((order) => (
                <Ticket
                  key={order.id}
                  name={order.name}
                  product={order.product}
                  qty={order.qty}
                  time={order.time}
                  isNew={order.fresh}
                  animateIn={order.fresh && !reduced}
                />
              ))}
            </ul>
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

      {chip && (
        <div
          ref={chipRef}
          aria-hidden="true"
          className="pointer-events-none fixed z-[80] rounded-full bg-ambar px-3 py-1 text-sm font-medium text-noche"
          style={{
            left: chip.x,
            top: chip.y,
            transform: "translate(-50%, -50%)",
            transition:
              "transform 0.55s cubic-bezier(0.7, 0.02, 0.3, 1), opacity 0.18s ease 0.42s",
          }}
        >
          ×{chip.qty}
        </div>
      )}
    </section>
  );
}
