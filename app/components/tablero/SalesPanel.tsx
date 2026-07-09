"use client";

import { useCallback } from "react";
import { useDemoSelector } from "../../lib/demo/hooks";
import { selectStock, selectUnitsSold, type Period, type StockInfo } from "../../lib/demo/selectors";
import type { DemoState } from "../../lib/demo/store";
import { useReducedMotion } from "../motion/useReducedMotion";
import { Bar, formatInt } from "./primitives";

/**
 * Panel 2 — "Qué se vende + qué te queda" (design-spec §4.3). Units sold per
 * product is a MAGNITUDE (not identity), so all three bars share one hue —
 * ambar — with no peak/accent (that distinction belongs to HoursPanel).
 *
 * Stock is a property of the DAY (§4.2): `selectStock` only informs the
 * `today` read. week/month show units for the period with no stock note.
 */

const STOCK_WARN_RATIO = 0.25;

const PERIOD_SUBTITLE: Record<Period, string> = {
  today: "Unidades vendidas · hoy",
  week: "Unidades vendidas · esta semana",
  month: "Unidades vendidas · este mes",
};

type SalesPanelProps = { period: Period; active: boolean };

export default function SalesPanel({ period, active }: SalesPanelProps) {
  const reduced = useReducedMotion();

  const selectUnits = useCallback(
    (state: DemoState) => selectUnitsSold(state, period),
    [period],
  );
  const units = useDemoSelector(selectUnits);
  // Property of the day (never varies with `period`) — only consulted below
  // when `period === "today"`.
  const stock = useDemoSelector(selectStock);
  const stockByProduct = new Map<string, StockInfo>(
    stock.map((entry) => [entry.productId, entry]),
  );

  const max = Math.max(1, ...units.map((unit) => unit.units));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-medium tracking-[0.2em] text-ambar">
          QUÉ SE VENDE
        </h3>
        <p className="mt-1 text-sm text-hueso/45">{PERIOD_SUBTITLE[period]}</p>
      </div>

      <div className="flex flex-col gap-4">
        {units.map((unit, index) => {
          const info = period === "today" ? stockByProduct.get(unit.productId) : undefined;
          const low = info ? info.remaining / info.batchSize <= STOCK_WARN_RATIO : false;
          const note = info && !low ? `quedan ${info.remaining} de ${info.batchSize}` : undefined;

          return (
            <div key={unit.productId} className="flex flex-col gap-1">
              <Bar
                label={unit.name}
                value={unit.units}
                ratio={unit.units / max}
                active={active}
                reduced={reduced}
                color="var(--color-ambar)"
                peak={false}
                format={formatInt}
                note={note}
                delayMs={index * 70}
              />
              {low ? (
                <p
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: "var(--viz-warn)" }}
                >
                  <span aria-hidden="true">⚠</span> se agota
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
