"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDemoSelector } from "../../lib/demo/hooks";
import { selectTotals, type PeriodTotals } from "../../lib/demo/selectors";
import type { DemoState } from "../../lib/demo/store";
import { useReducedMotion } from "../motion/useReducedMotion";

const COUNT_MS = 700;

function formatKr(value: number): string {
  return `${Math.round(value).toLocaleString("da-DK")} kr.`;
}

function formatCount(value: number): string {
  return String(Math.round(value));
}

/**
 * Count-up display value for `value`. SSR-safe: the initial state IS
 * `value` (server and first client render always show the final number —
 * no 0→N sweep on mount, no hydration mismatch). Only a later CHANGE to
 * `value` (a new order lands) tweens from the previous number.
 *
 * When `reduced` is true the hook returns `value` straight from render —
 * no effect involved, since that value needs no synchronization with an
 * external system (the "you might not need an effect" case). The effect
 * below only ever drives the *animated* path; while reduced it just keeps
 * `prevRef` caught up (a ref write, not a setState call) so a later
 * reduced→false flip mid-visit doesn't replay a stale jump.
 */
function useCountUp(value: number, reduced: boolean): number {
  const [animated, setAnimated] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      prevRef.current = value;
      return;
    }

    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    if (from === to) return;

    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - (1 - t) ** 3;
      setAnimated(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, reduced]);

  return reduced ? value : animated;
}

type StatProps = {
  label: string;
  value: number;
  reduced: boolean;
  format: (n: number) => string;
};

function Stat({ label, value, reduced, format }: StatProps) {
  const display = useCountUp(value, reduced);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-[0.15em] text-hueso/50">
        {label}
      </span>
      <span className="text-xl font-semibold tabular-nums text-hueso md:text-2xl">
        {format(display)}
      </span>
    </div>
  );
}

/**
 * Franja de negocio de HOY — pedidos · facturado · cobrado / a cobrar. SIN
 * ganancia (design-spec §3.2): la ganancia es el resultado del día y vive
 * en El tablero, no en el mostrador. Lee `selectTotals` directo del store
 * compartido — nunca del borrador del cliente.
 */
export default function BizStrip() {
  const reduced = useReducedMotion();
  const selectTodayTotals = useCallback(
    (state: DemoState): PeriodTotals => selectTotals(state, "today"),
    [],
  );
  const totals = useDemoSelector(selectTodayTotals);

  return (
    <div className="border-b border-hueso/10 pb-5">
      <p className="text-xs font-medium tracking-[0.2em] text-ambar">HOY</p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat
          label="PEDIDOS"
          value={totals.pedidos}
          reduced={reduced}
          format={formatCount}
        />
        <Stat
          label="FACTURADO"
          value={totals.facturado}
          reduced={reduced}
          format={formatKr}
        />
        <Stat
          label="COBRADO"
          value={totals.cobrado}
          reduced={reduced}
          format={formatKr}
        />
        <Stat
          label="A COBRAR"
          value={totals.aCobrar}
          reduced={reduced}
          format={formatKr}
        />
      </div>
    </div>
  );
}
