"use client";

/**
 * Shared animation primitives for El tablero (F4T). The panels (Sales / Hours /
 * Payments / Summary / Reservations / Pickups) import these so the load
 * choreography reads as ONE system: counters count up, bars grow left→right,
 * all gated by the same `active` flag the shell flips once the section enters
 * the viewport (see Tablero.tsx). reduced-motion collapses every primitive to
 * its final, static value — no sweeps, no growth (design-spec §4.4).
 *
 * SSR contract (same reasoning as BizStrip's count-up): the server and the
 * first client render always emit the FINAL value / full width, so there is no
 * hydration mismatch and a no-JS / reduced-motion visitor sees a full board.
 * The 0→value sweep is a client-only enhancement that replays on `active` and
 * re-tweens on later value changes (a fresh order, or a period toggle).
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/**
 * Choreography durations, supplied by Tablero.tsx (and tuneable via `?tune`).
 * Panels never pass these — they read the context through the primitives — so
 * wiring the tune panel touched no panel contract. Defaults match
 * DEFAULT_TABLERO_PARAMS so a primitive used outside a provider still behaves.
 */
export const TableroChoreoContext = createContext<{ countMs: number; barMs: number }>({
  countMs: 900,
  barMs: 700,
});

export function formatKr(value: number): string {
  return `${Math.round(value).toLocaleString("da-DK")} kr.`;
}

export function formatInt(value: number): string {
  return Math.round(value).toLocaleString("da-DK");
}

export function formatPct(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

/**
 * Count-up gated by `active`. Holds the final value until `active` flips true
 * (the frame is empty/faded during the stagger-in, so the reset-to-0 that
 * starts the first sweep is never seen); then tweens 0→value. Later value
 * changes tween from the previous number. reduced-motion returns `value`
 * straight from render — no effect drives the display, mirroring BizStrip.
 */
export function useCountUp(value: number, active: boolean, reduced: boolean): number {
  const { countMs } = useContext(TableroChoreoContext);
  const [animated, setAnimated] = useState(value);
  const prevRef = useRef(value);
  const activatedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      prevRef.current = value;
      activatedRef.current = true;
      return;
    }
    if (!active) return;

    const from = activatedRef.current ? prevRef.current : 0;
    activatedRef.current = true;
    const to = value;
    prevRef.current = to;
    if (from === to) return;

    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / countMs);
      const eased = 1 - (1 - t) ** 3;
      setAnimated(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, active, reduced, countMs]);

  return reduced ? value : animated;
}

/**
 * Count-up rendered as text — the common case (a stat value, a KPI). Keeps the
 * hook + formatting in one place so panels don't re-wire tabular-nums.
 */
export function CountValue({
  value,
  active,
  reduced,
  format = formatInt,
  className = "",
}: {
  value: number;
  active: boolean;
  reduced: boolean;
  format?: (n: number) => string;
  className?: string;
}) {
  const display = useCountUp(value, active, reduced);
  return <span className={`tabular-nums ${className}`}>{format(display)}</span>;
}

type BarProps = {
  /** Row label (product name, hour bucket, day…). Always in a text token. */
  label: string;
  /** Numeric value for the direct label (read without hover). */
  value: number;
  /** 0..1 of the panel's max — drives the fill width. */
  ratio: number;
  active: boolean;
  reduced: boolean;
  /** Fill color: the peak/accent (ambar) or the recessive tone (bruma). */
  color: string;
  /** true → this row is the emphasized peak (ambar). */
  peak?: boolean;
  format?: (n: number) => string;
  /** Optional trailing note next to the value (e.g. "quedan 12 de 60"). */
  note?: string;
  /** Stagger the growth start (ms) so bars cascade in reading order. */
  delayMs?: number;
};

/**
 * Horizontal magnitude bar — one hue (magnitude), the peak in ambar, the rest
 * recessive (design-spec §4.3/§4.5). Rounded data-end anchored to the
 * baseline, a recessive hairline track, and a direct value label so the number
 * is legible without hover. Grows from 0 when `active`; snaps full under
 * reduced-motion.
 */
export function Bar({
  label,
  value,
  ratio,
  active,
  reduced,
  color,
  peak = false,
  format = formatInt,
  note,
  delayMs = 0,
}: BarProps) {
  const { barMs } = useContext(TableroChoreoContext);
  const filled = reduced || active;
  const width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;

  const fillStyle: CSSProperties = {
    width: filled ? width : "0%",
    backgroundColor: color,
    transition: reduced
      ? undefined
      : `width ${barMs}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delayMs}ms`,
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={peak ? "font-semibold text-hueso" : "text-hueso/75"}>
          {label}
        </span>
        <span className="shrink-0 tabular-nums">
          <span className={peak ? "font-semibold text-hueso" : "text-hueso/85"}>
            {format(value)}
          </span>
          {note ? <span className="ml-2 text-hueso/45">{note}</span> : null}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-hueso/8">
        <div className="h-full rounded-full" style={fillStyle} />
      </div>
    </div>
  );
}
