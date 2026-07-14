"use client";

import { useCallback, useState } from "react";
import BizStrip from "./BizStrip";
import Ticket from "./Ticket";
import TicketModal from "./TicketModal";
import { useOrders } from "../../lib/demo/hooks";
import type { Order } from "../../lib/demo/store";

/**
 * Fade en los bordes sup/inf de la lista scrolleable — mask-image en vez de
 * un gradiente pintado, así el fade se aplica al contenido real (que puede
 * variar de altura) sin superponer un div extra. `globals.css` es territorio
 * de otro contrato (R-director) — la utilidad vive local al componente.
 */
const SCROLL_FADE =
  "linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)";

/**
 * Orquesta el lado dueño: franja de negocio + lista acumulativa de tickets
 * + modal de detalle. Lee `useOrders()` del store compartido — nunca del
 * borrador del cliente — así que cuando `placeOrder` (R4/R5) agrega una
 * orden, este panel re-renderiza solo porque el store cambió.
 *
 * "Qué órdenes animan el print-in" NO se rastrea acá con un ref/set mutable:
 * `order.isLive` (true solo para lo que arma el visitante en esta visita,
 * nunca en seeds) ya ES esa marca — inmutable una vez creada la orden, y el
 * store solo AGREGA/actualiza-en-lugar, nunca remueve-y-reinserta. Cada
 * `Ticket` monta una única vez por `order.number` (su key) y congela la
 * decisión de animar en ese primer render (ver Ticket.tsx) — así que pasar
 * `animateIn={order.isLive}` en cada render es correcto y no reintroduce el
 * print-in en renders posteriores. Esto evita leer un ref durante el
 * render (el patrón `useRef<Set>` sugerido por la spec disparaba el lint
 * `react-hooks/refs` de este repo — "Cannot access refs during render",
 * parte del ruleset compatible con React Compiler) sin perder el
 * comportamiento pedido: seeds nunca animan, cada orden nueva anima
 * exactamente una vez.
 */
export default function OwnerPanel() {
  const orders = useOrders();
  const [openOrderNumber, setOpenOrderNumber] = useState<number | null>(null);

  const closeModal = useCallback(() => setOpenOrderNumber(null), []);

  const sorted = [...orders].sort((a, b) => b.number - a.number);
  const openOrder: Order | null =
    openOrderNumber === null
      ? null
      : (orders.find((order) => order.number === openOrderNumber) ?? null);

  return (
    <div className="flex flex-col gap-5">
      <BizStrip />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-hueso">Pedidos de hoy</h3>
        <span className="rounded-full bg-ambar px-2.5 py-0.5 text-sm font-semibold text-noche">
          {orders.length}
        </span>
      </div>

      <ul
        aria-live="polite"
        className="flex max-h-[420px] flex-col gap-3 overflow-y-auto py-1"
        style={{ maskImage: SCROLL_FADE, WebkitMaskImage: SCROLL_FADE }}
      >
        {sorted.map((order) => (
          <Ticket
            key={order.number}
            order={order}
            animateIn={order.isLive}
            onOpenDetail={() => setOpenOrderNumber(order.number)}
          />
        ))}
      </ul>

      <TicketModal order={openOrder} onClose={closeModal} />
    </div>
  );
}
