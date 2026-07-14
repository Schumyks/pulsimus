"use client";

import { useMemo } from "react";
import { useDemoSelector } from "../../lib/demo/hooks";
import {
  selectDayBuckets,
  selectHourBuckets,
  selectWeekBuckets,
  type Period,
} from "../../lib/demo/selectors";
import type { Weekday } from "../../lib/demo/store";
import { useReducedMotion } from "../motion/useReducedMotion";
import { Bar, formatInt, formatKr } from "./primitives";

/**
 * Panel 3 — "Cuándo te piden" (design-spec §4.3), the emphasis panel: one
 * accent bar (the peak, ambar) among recessive bars (bruma). Bucketing
 * switches by `period` — hour-of-day / day-of-week / week-of-month — but the
 * visual grammar (one accent, cascade-in, direct labels) stays identical.
 */

const WEEKDAY_FULL: Record<Weekday, string> = {
  lun: "lunes",
  mar: "martes",
  mie: "miércoles",
  jue: "jueves",
  vie: "viernes",
  sab: "sábado",
  dom: "domingo",
};

const PERIOD_SUBTITLE: Record<Period, string> = {
  today: "Pedidos por hora",
  week: "Facturado por día",
  month: "Facturado por semana",
};

type Row = {
  key: string;
  label: string;
  value: number;
  peak: boolean;
  note?: string;
};

/** Index of the first max in `values`, or -1 if every value is 0 (no peak to mark). */
function pickPeakIndex(values: number[]): number {
  let peakIndex = -1;
  let peakValue = 0;
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] > peakValue) {
      peakValue = values[i];
      peakIndex = i;
    }
  }
  return peakIndex;
}

function dayPeakNote(label: Weekday | "hoy"): string {
  return label === "hoy" ? "hoy es tu día fuerte" : `el ${WEEKDAY_FULL[label]} es tu día fuerte`;
}

type HoursPanelProps = { period: Period; active: boolean };

export default function HoursPanel({ period, active }: HoursPanelProps) {
  const reduced = useReducedMotion();

  // Each selector reads a fixed window of its own (hour-of-today /
  // rolling-week / rolling-month) — none takes `period` as an argument, so
  // the stable imported references are passed straight to `useDemoSelector`.
  const hourBuckets = useDemoSelector(selectHourBuckets);
  const dayBuckets = useDemoSelector(selectDayBuckets);
  const weekBuckets = useDemoSelector(selectWeekBuckets);

  const rows = useMemo<Row[]>(() => {
    if (period === "today") {
      const entries = Object.entries(hourBuckets).sort(([a], [b]) => a.localeCompare(b));
      const peakIndex = pickPeakIndex(entries.map(([, count]) => count));
      return entries.map(([hour, count], index) => ({
        key: hour,
        label: `${hour} h`,
        value: count,
        peak: index === peakIndex,
      }));
    }

    if (period === "week") {
      const peakIndex = pickPeakIndex(dayBuckets.map((day) => day.facturado));
      return dayBuckets.map((day, index) => ({
        key: `${day.daysAgo}`,
        label: day.label,
        value: day.facturado,
        peak: index === peakIndex,
        note: index === peakIndex ? dayPeakNote(day.label) : undefined,
      }));
    }

    const peakIndex = pickPeakIndex(weekBuckets.map((week) => week.facturado));
    return weekBuckets.map((week, index) => ({
      key: week.label,
      label: week.label,
      value: week.facturado,
      peak: index === peakIndex,
      note: index === peakIndex ? "tu mejor semana" : undefined,
    }));
  }, [period, hourBuckets, dayBuckets, weekBuckets]);

  const max = Math.max(1, ...rows.map((row) => row.value));
  const format = period === "today" ? formatInt : formatKr;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-xs font-medium tracking-[0.2em] text-ambar">
          CUÁNDO TE PIDEN
        </h3>
        <p className="mt-1 text-sm text-hueso/45">{PERIOD_SUBTITLE[period]}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {rows.map((row, index) => (
          <Bar
            key={row.key}
            label={row.label}
            value={row.value}
            ratio={row.value / max}
            active={active}
            reduced={reduced}
            color={row.peak ? "var(--color-ambar)" : "var(--color-bruma)"}
            peak={row.peak}
            format={format}
            note={row.note}
            delayMs={index * 60}
          />
        ))}
      </div>
    </div>
  );
}
