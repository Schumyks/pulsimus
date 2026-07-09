"use client";

import { useCallback, useId, useState, type CSSProperties } from "react";
import { useDemoSelector } from "../../lib/demo/hooks";
import {
  selectPaymentSplit,
  selectTotals,
  type Period,
} from "../../lib/demo/selectors";
import type { DemoState } from "../../lib/demo/store";
import { useReducedMotion } from "../motion/useReducedMotion";
import { formatKr } from "./primitives";

/**
 * Panel 6 — "Cómo te pagan" (design-spec §4.3), the only panel with a shape
 * switch: stacked bar ↔ donut. Both are legitimate here because the data is
 * part-of-a-whole with exactly two segments (mobilepay / on_pickup) — the
 * form the rest of the board follows (one hue for magnitude, an accent for
 * the peak) does not apply to a 2-segment split.
 *
 * `selectPaymentSplit` drives the two segments (mobilepay = ambar, on_pickup
 * = bruma); `selectTotals` drives the summary line ("Cobrado x · A cobrar
 * y") — same money, but named the way the design spec asks for it in each
 * spot so the two call sites read like what they say.
 */

const AMBAR = "var(--color-ambar)";
const BRUMA = "var(--color-bruma)";
const GROW_TRANSITION = "0.7s cubic-bezier(0.22, 0.61, 0.36, 1)";
const MORPH_MS = 280;

type Shape = "bar" | "donut";

type Segment = { name: string; amount: number; color: string };

function buildSegments(mobilepay: number, onPickup: number): Segment[] {
  return [
    { name: "MobilePay", amount: mobilepay, color: AMBAR },
    { name: "Pago al retirar", amount: onPickup, color: BRUMA },
  ];
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function SegmentLabels({ segments, total }: { segments: Segment[]; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, index) => {
        // Second row's % completes to 100 instead of independently rounding,
        // so the two percentages always sum to 100 for the reader.
        const percent =
          index === segments.length - 1
            ? 100 - segments.slice(0, -1).reduce((sum, s) => sum + pct(s.amount, total), 0)
            : pct(segment.amount, total);
        return (
          <div key={segment.name} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-hueso/75">{segment.name}</span>
            <span className="ml-auto shrink-0 tabular-nums text-hueso/85">
              {formatKr(segment.amount)}{" "}
              <span className="text-hueso/45">· {percent}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

type FormProps = { segments: Segment[]; total: number; active: boolean; reduced: boolean };

/** Stacked horizontal bar: two fills in a flex track, a 2px noche seam between them. */
function StackedBarForm({ segments, total, active, reduced }: FormProps) {
  const filled = reduced || active;
  const [mp, op] = segments;
  const mpRatio = total > 0 ? mp.amount / total : 0;
  const opRatio = total > 0 ? op.amount / total : 0;
  const hasGap = filled && mpRatio > 0 && opRatio > 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={`MobilePay ${formatKr(mp.amount)}, pago al retirar ${formatKr(op.amount)}`}
        className="flex h-8 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--color-noche)", gap: hasGap ? "2px" : "0px" }}
      >
        <div
          style={{
            width: filled ? `${mpRatio * 100}%` : "0%",
            backgroundColor: mp.color,
            transition: reduced ? undefined : `width ${GROW_TRANSITION}`,
          }}
        />
        <div
          style={{
            width: filled ? `${opRatio * 100}%` : "0%",
            backgroundColor: op.color,
            transition: reduced ? undefined : `width ${GROW_TRANSITION} 60ms`,
          }}
        />
      </div>
      <SegmentLabels segments={segments} total={total} />
    </div>
  );
}

const DONUT_SIZE = 132;
const DONUT_STROKE = 18;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_ARC_GAP = 3; // px trimmed off each arc's drawn length, so a seam of surface shows between them

/**
 * Donut: two arcs on stacked <circle>s, rotated -90deg so the split starts at
 * 12 o'clock. Growth is driven by animating each arc's DRAWN LENGTH (dasharray)
 * from 0 to its target — the direct SVG analogue of the bar's width 0→value —
 * while each arc's rotational start offset (dashoffset) stays fixed. Animating
 * dashoffset instead (sweeping the reveal around the ring) was the other
 * reading of "circumference→value", but it only behaves as a clean 0→value
 * growth for a single full-circle arc; with two fixed-position arcs sharing
 * one ring, growing the length is the version that is actually correct here.
 */
function DonutForm({ segments, total, active, reduced }: FormProps) {
  const filled = reduced || active;
  const [mp, op] = segments;
  const mpRatio = total > 0 ? mp.amount / total : 0;
  const opRatio = total > 0 ? op.amount / total : 0;
  const gap = mpRatio > 0 && opRatio > 0 ? DONUT_ARC_GAP : 0;

  const mpLen = mpRatio * DONUT_CIRCUMFERENCE;
  const opLen = opRatio * DONUT_CIRCUMFERENCE;
  const mpDrawn = filled ? Math.max(0, mpLen - gap) : 0;
  const opDrawn = filled ? Math.max(0, opLen - gap) : 0;

  const center = DONUT_SIZE / 2;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        role="img"
        aria-label={`MobilePay ${formatKr(mp.amount)}, pago al retirar ${formatKr(op.amount)}`}
        className="shrink-0"
      >
        <circle
          cx={center}
          cy={center}
          r={DONUT_RADIUS}
          fill="none"
          stroke="rgba(246,239,225,0.10)"
          strokeWidth={DONUT_STROKE}
        />
        <circle
          cx={center}
          cy={center}
          r={DONUT_RADIUS}
          fill="none"
          stroke={mp.color}
          strokeWidth={DONUT_STROKE}
          strokeLinecap="butt"
          strokeDasharray={`${mpDrawn} ${DONUT_CIRCUMFERENCE - mpDrawn}`}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: reduced ? undefined : `stroke-dasharray ${GROW_TRANSITION}` }}
        />
        <circle
          cx={center}
          cy={center}
          r={DONUT_RADIUS}
          fill="none"
          stroke={op.color}
          strokeWidth={DONUT_STROKE}
          strokeLinecap="butt"
          strokeDasharray={`${opDrawn} ${DONUT_CIRCUMFERENCE - opDrawn}`}
          strokeDashoffset={-mpLen}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: reduced ? undefined : `stroke-dasharray ${GROW_TRANSITION} 60ms` }}
        />
      </svg>
      <SegmentLabels segments={segments} total={total} />
    </div>
  );
}

function ShapeSwitch({
  shape,
  onChange,
  labelId,
}: {
  shape: Shape;
  onChange: (next: Shape) => void;
  labelId: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className="inline-flex items-center gap-1 rounded-full border border-hueso/15 bg-hueso/5 p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={shape === "bar"}
        aria-label="Ver como barra apilada"
        onClick={() => onChange("bar")}
        className={`rounded-full px-3 py-1 text-sm leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar ${
          shape === "bar" ? "bg-ambar text-noche" : "text-hueso/60 hover:text-hueso"
        }`}
      >
        ▤
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={shape === "donut"}
        aria-label="Ver como donut"
        onClick={() => onChange("donut")}
        className={`rounded-full px-3 py-1 text-sm leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar ${
          shape === "donut" ? "bg-ambar text-noche" : "text-hueso/60 hover:text-hueso"
        }`}
      >
        ◔
      </button>
    </div>
  );
}

type PaymentsPanelProps = { period: Period; active: boolean };

export default function PaymentsPanel({ period, active }: PaymentsPanelProps) {
  const reduced = useReducedMotion();
  const [shape, setShape] = useState<Shape>("bar");
  const headingId = useId();

  const selectSplit = useCallback(
    (state: DemoState) => selectPaymentSplit(state, period),
    [period],
  );
  const selectPeriodTotals = useCallback(
    (state: DemoState) => selectTotals(state, period),
    [period],
  );
  const split = useDemoSelector(selectSplit);
  const totals = useDemoSelector(selectPeriodTotals);

  const segments = buildSegments(split.mobilepay, split.onPickup);
  const total = split.mobilepay + split.onPickup;

  // reduced-motion: only the active shape ever mounts — "swap instantáneo al
  // togglear" (design-spec §4.3), no cross-fade layer, no growth-on-load.
  const showBar = shape === "bar";
  const barLayerStyle: CSSProperties = reduced
    ? {}
    : {
        gridArea: "1 / 1",
        opacity: showBar ? 1 : 0,
        transform: showBar ? "scale(1)" : "scale(0.94)",
        transition: `opacity ${MORPH_MS}ms ease, transform ${MORPH_MS}ms ease`,
        pointerEvents: showBar ? "auto" : "none",
      };
  const donutLayerStyle: CSSProperties = reduced
    ? {}
    : {
        gridArea: "1 / 1",
        opacity: showBar ? 0 : 1,
        transform: showBar ? "scale(0.94)" : "scale(1)",
        transition: `opacity ${MORPH_MS}ms ease, transform ${MORPH_MS}ms ease`,
        pointerEvents: showBar ? "none" : "auto",
      };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 id={headingId} className="text-xs font-medium tracking-[0.2em] text-ambar">
            CÓMO TE PAGAN
          </h3>
          <p className="mt-1 text-sm text-hueso/45">
            Cobrado {formatKr(totals.cobrado)} · A cobrar {formatKr(totals.aCobrar)}
          </p>
        </div>
        <ShapeSwitch shape={shape} onChange={setShape} labelId={headingId} />
      </div>

      {reduced ? (
        showBar ? (
          <StackedBarForm segments={segments} total={total} active={active} reduced={reduced} />
        ) : (
          <DonutForm segments={segments} total={total} active={active} reduced={reduced} />
        )
      ) : (
        <div className="grid">
          <div style={barLayerStyle} aria-hidden={!showBar}>
            <StackedBarForm segments={segments} total={total} active={active} reduced={reduced} />
          </div>
          <div style={donutLayerStyle} aria-hidden={showBar}>
            <DonutForm segments={segments} total={total} active={active} reduced={reduced} />
          </div>
        </div>
      )}
    </div>
  );
}
