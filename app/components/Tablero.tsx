"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import PeriodToggle from "./tablero/PeriodToggle";
import { useReducedMotion } from "./motion/useReducedMotion";
import type { Period } from "../lib/demo/selectors";

/**
 * El tablero — the section that shows what the counter's register gives the
 * owner: "lo que todo negocio de barrio necesita saber y no sabe". Night
 * surface (the inside of the business), fed by the SAME shared store as El
 * mostrador — orders placed above move these numbers in real time.
 *
 * Load choreography (design-spec §4.4): a single IntersectionObserver flips
 * `active` once when the section enters the viewport. That drives (1) the
 * frames' staggered fade+rise in reading order, and (2) each panel's fill by
 * the nature of its data (counters count, bars grow) — panels read `active`
 * and animate their own way. The period lives here as React state (NOT in the
 * shared store, so a toggle never re-renders El mostrador): one tap re-renders
 * every panel against the same window, and the count-up/bar-grow primitives
 * re-tween on the value change for free.
 *
 * reduced-motion: `active` still resolves, but the frames never hide and the
 * primitives return their final values — the whole board appears full at once.
 */

// Stagger between consecutive frames' reveal, in reading order (design-spec
// §4.4 ~90ms). Default; Alan freezes the feel at the gate via ?tune (T4).
const FRAME_STAGGER_MS = 90;

/** The chart surface validated with the dataviz palette validator is exactly
 * `#1B2140` (noche); status/delta hues that aren't brand tokens live as CSS
 * vars here so panels reference them by role and they swap in one place. */
const VIZ_VARS = {
  "--viz-warn": "#ec835a", // ⚠ se agota — ships with icon + text, never color alone
  "--viz-up": "#34c759", // Δ vs. período anterior, up
  "--viz-down": "#e66767", // Δ vs. período anterior, down
} as CSSProperties;

type FrameProps = {
  index: number;
  active: boolean;
  reduced: boolean;
  className?: string;
  children: ReactNode;
};

function Frame({ index, active, reduced, className = "", children }: FrameProps) {
  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(26px)",
        transition: `opacity 0.6s ease ${index * FRAME_STAGGER_MS}ms, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${index * FRAME_STAGGER_MS}ms`,
      };
  return (
    <div
      style={style}
      className={`rounded-2xl border border-hueso/10 bg-noche p-6 md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

/** Placeholder panel body — replaced by the real T3 panels in T4. */
function PanelStub({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-[0.2em] text-ambar">{title}</p>
      <p className="text-sm text-hueso/50">{note}</p>
    </div>
  );
}

export default function Tablero() {
  const reduced = useReducedMotion();
  const [period, setPeriod] = useState<Period>("today");
  const [active, setActive] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    // Fire once when the board scrolls into view, then stop observing. If it is
    // already on screen the observer resolves on the first callback tick.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -7% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="tablero"
      ref={sectionRef}
      aria-labelledby="tablero-title"
      className="bg-noche text-hueso"
      style={VIZ_VARS}
    >
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="tablero-title"
              className="text-3xl font-semibold text-hueso md:text-4xl"
            >
              El resultado del día, sin hacer cuentas.
            </h2>
            <p className="mt-4 text-lg text-bruma">
              Lo que todo negocio de barrio necesita saber —y casi nunca sabe—.
              El mismo mostrador, visto de adentro.
            </p>
          </div>
          <PeriodToggle period={period} onChange={setPeriod} />
        </div>

        <div className="mt-12 flex flex-col gap-6">
          <Frame index={0} active={active} reduced={reduced}>
            <PanelStub
              title="⚡ RESERVAS POR CONFIRMAR"
              note="Cola viva — se conecta en T3a/T4."
            />
          </Frame>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Frame index={1} active={active} reduced={reduced}>
              <PanelStub
                title="EL DÍA DE UN VISTAZO"
                note="KPIs + ganancia — se conecta en T3c/T4."
              />
            </Frame>
            <Frame index={2} active={active} reduced={reduced}>
              <PanelStub
                title="QUÉ SE VENDE"
                note="Unidades + stock — se conecta en T3b/T4."
              />
            </Frame>
            <Frame index={3} active={active} reduced={reduced}>
              <PanelStub
                title="CUÁNDO TE PIDEN"
                note="Barras por hora/día/semana — se conecta en T3b/T4."
              />
            </Frame>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Frame index={4} active={active} reduced={reduced}>
              <PanelStub
                title="CÓMO TE PAGAN"
                note="Cobrado / a cobrar + split — se conecta en T3b/T4."
              />
            </Frame>
            <Frame index={5} active={active} reduced={reduced}>
              <PanelStub
                title="RETIROS"
                note="Agenda por hora — se conecta en T3a/T4."
              />
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
}
