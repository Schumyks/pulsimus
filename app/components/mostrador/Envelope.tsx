"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TRAVEL_EASING } from "./flowParams";

type EnvelopeProps = {
  /** Where the form sat when it sealed — the flight starts here. */
  originRect: DOMRect;
  /** Where the owner panel is — the flight lands here. */
  targetRect: DOMRect;
  foldMs: number;
  travelMs: number;
  /** Fires once the envelope has folded and finished traveling. */
  onArrive: () => void;
};

type Phase = "enter" | "fold" | "fly";

/**
 * The captured form, sealed into an envelope (canto ámbar) and flown to the
 * owner panel — the fold + FLIP of spec §3.1 paso 4. Rendered `fixed` over the
 * page from the form's last position, so the travel crosses columns (desktop)
 * or drops down (mobile, where the owner panel is below). On arrival the
 * orchestrator commits the order and the ticket prints in.
 *
 * Fold and fly are one continuous transform (translate+scale) so the browser
 * interpolates them as matrices without a snap. Timings come from `?tune`.
 */
export default function Envelope({
  originRect,
  targetRect,
  foldMs,
  travelMs,
  onArrive,
}: EnvelopeProps) {
  const [phase, setPhase] = useState<Phase>("enter");
  const arrivedRef = useRef(false);

  const dx =
    targetRect.left + targetRect.width / 2 - (originRect.left + originRect.width / 2);
  const dy = targetRect.top + 28 - (originRect.top + originRect.height / 2);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("fold"));
    const foldTimer = setTimeout(() => setPhase("fly"), foldMs);
    const arriveTimer = setTimeout(() => {
      if (!arrivedRef.current) {
        arrivedRef.current = true;
        onArrive();
      }
    }, foldMs + travelMs);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(foldTimer);
      clearTimeout(arriveTimer);
    };
    // Mount-only: rects and timings are captured for this single flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transform =
    phase === "enter"
      ? "translate(0px, 0px) scale(1, 1)"
      : phase === "fold"
        ? "translate(0px, 0px) scale(0.92, 0.42)"
        : `translate(${dx}px, ${dy}px) scale(0.5, 0.24)`;

  const transition =
    phase === "fold"
      ? `transform ${foldMs}ms ease-in`
      : phase === "fly"
        ? `transform ${travelMs}ms ${TRAVEL_EASING}, opacity ${travelMs}ms ease-in`
        : "none";

  const style: CSSProperties = {
    position: "fixed",
    left: originRect.left,
    top: originRect.top,
    width: originRect.width,
    height: originRect.height,
    transformOrigin: "center",
    transform,
    transition,
    opacity: phase === "fly" ? 0.15 : 1,
    zIndex: 85,
    pointerEvents: "none",
  };

  return (
    <div aria-hidden="true" style={style}>
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-hueso shadow-lg ring-1 ring-noche/10">
        <div className="h-2 shrink-0 bg-ambar" />
        <div className="relative flex-1">
          {/* Envelope flap — two diagonals meeting at the center seam. */}
          <div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background:
                "linear-gradient(135deg, transparent 49.5%, rgba(27,33,64,0.12) 50%, transparent 50.5%), linear-gradient(45deg, transparent 49.5%, rgba(27,33,64,0.12) 50%, transparent 50.5%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
