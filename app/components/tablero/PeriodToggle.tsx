"use client";

import { useCallback, useRef } from "react";
import type { Period } from "../../lib/demo/selectors";

/**
 * Single-row global control for El tablero: `[ Hoy | Semana | Mes ]`. ONE
 * control drives the whole board (design-spec §4.2: never per-card filters).
 * A radiogroup with roving arrow-key focus — mutually-exclusive selection is
 * exactly what radios model. The picked period is lifted to Tablero.tsx, which
 * re-renders every panel against the same window.
 */

const OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

type PeriodToggleProps = {
  period: Period;
  onChange: (next: Period) => void;
};

// This is a client component using React DOM; no Next-specific API is involved.
export default function PeriodToggle({ period, onChange }: PeriodToggleProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + dir + OPTIONS.length) % OPTIONS.length;
      onChange(OPTIONS[next].value);
      refs.current[next]?.focus();
    },
    [onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label="Período del tablero"
      className="inline-flex items-center gap-1 rounded-full border border-hueso/15 bg-hueso/5 p-1"
    >
      {OPTIONS.map((option, index) => {
        const selected = option.value === period;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar ${
              selected
                ? "bg-ambar text-noche"
                : "text-hueso/60 hover:text-hueso"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
