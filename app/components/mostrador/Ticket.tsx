"use client";

import { useEffect, useState, type CSSProperties } from "react";

type TicketProps = {
  name: string;
  product: string;
  qty: number;
  time: string;
  isNew: boolean;
  animateIn: boolean;
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

export default function Ticket({
  name,
  product,
  qty,
  time,
  isNew,
  animateIn,
}: TicketProps) {
  // Reduced-motion is read once at mount: a static seed ticket (animateIn
  // false) or a reduced-motion mount both start already expanded, with no
  // transition wired up. Only a live insert with motion allowed starts
  // collapsed and expands on the next frame — the same rAF handshake
  // Reveals.tsx uses to give the browser a frame to paint the "before" state.
  const [reduced] = useState(() => !animateIn || prefersReducedMotion());
  const [expanded, setExpanded] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const raf = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const withTransition = animateIn && !reduced;

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

  return (
    <li>
      <div style={wrapperStyle}>
        <div style={innerStyle}>
          <div className="rounded-t-lg bg-hueso px-4 pt-3 pb-2 text-noche">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 font-semibold">
                {isNew && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
                  />
                )}
                {name}
              </span>
              <span className="text-sm tabular-nums text-bruma">
                ret. {time}
              </span>
            </div>
            <p className="mt-1 text-sm text-noche/80">
              {product} ×{qty}
            </p>
          </div>
          <div className="px-ticket-teeth" aria-hidden="true" />
        </div>
      </div>
    </li>
  );
}
