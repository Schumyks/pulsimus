"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import PeriodToggle from "./tablero/PeriodToggle";
import ReservationsQueue from "./tablero/ReservationsQueue";
import SummaryPanel from "./tablero/SummaryPanel";
import SalesPanel from "./tablero/SalesPanel";
import HoursPanel from "./tablero/HoursPanel";
import PaymentsPanel from "./tablero/PaymentsPanel";
import PickupsPanel from "./tablero/PickupsPanel";
import TableroTunePanel from "./tablero/TableroTunePanel";
import { TableroChoreoContext } from "./tablero/primitives";
import {
  DEFAULT_TABLERO_PARAMS,
  type TableroParams,
} from "./tablero/tableroParams";
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
  staggerMs: number;
  /** Increments on each period change; retriggers the amber acknowledge flash. */
  flash?: number;
  className?: string;
  children: ReactNode;
};

function Frame({ index, active, reduced, staggerMs, flash = 0, className = "", children }: FrameProps) {
  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(26px)",
        transition: `opacity 0.6s ease ${index * staggerMs}ms, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${index * staggerMs}ms`,
      };
  return (
    <div
      style={style}
      className={`relative rounded-2xl border border-hueso/10 bg-noche p-4 md:p-5 ${className}`}
    >
      {/* Remounting only this overlay (key) replays the flash without touching
          the frame's stagger transition. Period-sensitive frames only. */}
      {flash > 0 && !reduced ? (
        <span
          key={flash}
          aria-hidden="true"
          className="tablero-flash pointer-events-none absolute inset-0 rounded-2xl"
        />
      ) : null}
      {children}
    </div>
  );
}

export default function Tablero() {
  const reduced = useReducedMotion();
  const [period, setPeriod] = useState<Period>("today");
  const [flash, setFlash] = useState(0);
  const [active, setActive] = useState(false);
  const [params, setParams] = useState<TableroParams>(DEFAULT_TABLERO_PARAMS);
  const [tuneOpen, setTuneOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Client-only gate: the ?tune panel depends on window.location, absent
    // during SSR. Reading it in an effect avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL gate, resolves after hydration
    if (new URLSearchParams(window.location.search).has("tune")) setTuneOpen(true);
  }, []);

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

  const stagger = params.frameStaggerMs;

  return (
    <section
      id="tablero"
      ref={sectionRef}
      aria-labelledby="tablero-title"
      className="bg-noche text-hueso"
      style={VIZ_VARS}
    >
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2
              id="tablero-title"
              className="text-3xl font-semibold text-hueso md:text-4xl"
            >
              El resultado del día, sin hacer cuentas.
            </h2>
            <p className="mt-2 text-sm text-bruma md:text-base">
              Lo que todo negocio de barrio necesita saber —y casi nunca sabe—.
              El mismo mostrador, visto de adentro.
            </p>
          </div>
          <PeriodToggle
            period={period}
            onChange={(next) => {
              if (next !== period) setFlash((f) => f + 1);
              setPeriod(next);
            }}
          />
        </div>

        <TableroChoreoContext.Provider
          value={{ countMs: params.countMs, barMs: params.barMs }}
        >
          {/* Density contract (BL-09): two 3-up rows so the whole board fits one
              desktop viewport. Row 1 = the period-sensitive charts, glued to the
              toggle so its feedback lands in-view; row 2 = the operative panels
              (the queue keeps its ⚡ but trades full-width for density). */}
          <div className="mt-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Frame index={0} active={active} reduced={reduced} staggerMs={stagger} flash={flash}>
                <SummaryPanel period={period} active={active} />
              </Frame>
              <Frame index={1} active={active} reduced={reduced} staggerMs={stagger} flash={flash}>
                <SalesPanel period={period} active={active} />
              </Frame>
              <Frame index={2} active={active} reduced={reduced} staggerMs={stagger} flash={flash}>
                <HoursPanel period={period} active={active} />
              </Frame>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Frame index={3} active={active} reduced={reduced} staggerMs={stagger}>
                <ReservationsQueue period={period} active={active} />
              </Frame>
              <Frame index={4} active={active} reduced={reduced} staggerMs={stagger} flash={flash}>
                <PaymentsPanel period={period} active={active} />
              </Frame>
              <Frame index={5} active={active} reduced={reduced} staggerMs={stagger} flash={flash}>
                <PickupsPanel period={period} active={active} />
              </Frame>
            </div>
          </div>
        </TableroChoreoContext.Provider>
      </div>

      {tuneOpen && <TableroTunePanel params={params} onChange={setParams} />}
    </section>
  );
}
