"use client";

import { useCallback } from "react";
import { useDemoSelector } from "../../lib/demo/hooks";
import {
  selectFacturadoDelta,
  selectTotals,
  type Period,
  type PeriodDelta,
  type PeriodTotals,
} from "../../lib/demo/selectors";
import type { DemoState } from "../../lib/demo/store";
import { useReducedMotion } from "../motion/useReducedMotion";
import { CountValue, formatInt, formatKr, formatPct } from "./primitives";

/**
 * "El día de un vistazo" (design-spec §4.3 panel 5) — KPI row, delta vs. el
 * período anterior equivalente, y el desglose de ganancia estimada
 * (bruto − moms − costos), el sketch original de Alan. Content-only: el
 * shell (Tablero.tsx → Frame) pone card/borde/fondo y gatea `active` con el
 * IntersectionObserver de la sección.
 */

type SummaryPanelProps = {
  period: Period;
  active: boolean;
};

const DELTA_LABEL: Record<Period, string> = {
  today: "vs. mismo día, semana pasada",
  week: "vs. semana pasada",
  month: "vs. mes pasado",
};

type StatProps = {
  label: string;
  value: number;
  format: (n: number) => string;
  active: boolean;
  reduced: boolean;
};

function Stat({ label, value, format, active, reduced }: StatProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-[0.15em] text-hueso/50">
        {label}
      </span>
      <CountValue
        value={value}
        active={active}
        reduced={reduced}
        format={format}
        className="text-xl font-semibold text-hueso md:text-2xl"
      />
    </div>
  );
}

function DeltaLine({ pct, label }: { pct: number | null; label: string }) {
  if (pct === null) {
    return (
      <p className="text-sm text-hueso/50">
        <span className="tabular-nums">—</span> {label}
      </p>
    );
  }

  const up = pct >= 0;
  return (
    <p className="text-sm text-hueso/60">
      <span
        className="font-semibold tabular-nums"
        style={{ color: up ? "var(--viz-up)" : "var(--viz-down)" }}
      >
        {up ? "↑" : "↓"} {formatPct(pct)}
      </span>{" "}
      {label}
    </p>
  );
}

type BreakdownRowProps = {
  label: string;
  value: number;
  active: boolean;
  reduced: boolean;
};

function BreakdownRow({ label, value, active, reduced }: BreakdownRowProps) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-hueso/65">{label}</span>
      <CountValue
        value={value}
        active={active}
        reduced={reduced}
        format={formatKr}
        className="text-hueso/85"
      />
    </div>
  );
}

export default function SummaryPanel({ period, active }: SummaryPanelProps) {
  const reduced = useReducedMotion();

  const selectSummaryTotals = useCallback(
    (state: DemoState): PeriodTotals => selectTotals(state, period),
    [period],
  );
  const totals = useDemoSelector(selectSummaryTotals);

  const selectDelta = useCallback(
    (state: DemoState): PeriodDelta => selectFacturadoDelta(state, period),
    [period],
  );
  const delta = useDemoSelector(selectDelta);

  const bruto = totals.facturado;
  const moms = totals.moms;
  const ganancia = totals.ganancia;
  const costos = Math.round(bruto - moms - ganancia);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xs font-medium tracking-[0.2em] text-ambar">
        EL DÍA DE UN VISTAZO
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <Stat
          label="FACTURADO"
          value={totals.facturado}
          format={formatKr}
          active={active}
          reduced={reduced}
        />
        <Stat
          label="PEDIDOS"
          value={totals.pedidos}
          format={formatInt}
          active={active}
          reduced={reduced}
        />
        <Stat
          label="TICKET PROM."
          value={totals.ticketPromedio}
          format={formatKr}
          active={active}
          reduced={reduced}
        />
      </div>

      <DeltaLine pct={delta.pct} label={DELTA_LABEL[period]} />

      <div className="flex flex-col gap-1.5 border-t border-hueso/15 pt-4">
        <BreakdownRow label="Bruto" value={bruto} active={active} reduced={reduced} />
        <BreakdownRow label="− IVA (moms)" value={moms} active={active} reduced={reduced} />
        <BreakdownRow label="− Costos" value={costos} active={active} reduced={reduced} />
        <div className="mt-1 flex items-baseline justify-between border-t border-hueso/15 pt-2">
          <span className="text-sm font-medium text-hueso/70">
            = Ganancia estimada
          </span>
          <CountValue
            value={ganancia}
            active={active}
            reduced={reduced}
            format={formatKr}
            className="text-2xl font-semibold text-ambar"
          />
        </div>
      </div>
    </div>
  );
}
