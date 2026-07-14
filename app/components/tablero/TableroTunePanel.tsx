"use client";

import { useState } from "react";
import {
  TABLERO_PARAM_META,
  type TableroParams,
  type TableroParamKey,
} from "./tableroParams";

type TableroTunePanelProps = {
  params: TableroParams;
  onChange: (next: TableroParams) => void;
};

/**
 * Dev-only tuning panel for El tablero's load choreography (mounted only with
 * `?tune`, same pattern as the mostrador TunePanel and the F3 heartbeat).
 * Sliders drive the live timings; "Copiar" yields the exact JSON to freeze into
 * `DEFAULT_TABLERO_PARAMS`. What you copy IS what you freeze. Deleted once Alan
 * freezes the values at the gate.
 */
export default function TableroTunePanel({ params, onChange }: TableroTunePanelProps) {
  const [copied, setCopied] = useState(false);
  const keys = Object.keys(TABLERO_PARAM_META) as TableroParamKey[];

  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(params, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — the values are still on screen to copy by hand */
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-[100] w-72 rounded-xl bg-noche/95 p-4 text-hueso shadow-2xl ring-1 ring-hueso/15 backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.15em] text-ambar">
        ?TUNE · TABLERO
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {keys.map((key) => {
          const meta = TABLERO_PARAM_META[key];
          return (
            <label key={key} className="flex flex-col gap-1 text-xs">
              <span className="flex items-center justify-between">
                <span className="text-hueso/70">{meta.label}</span>
                <span className="tabular-nums text-hueso">{params[key]}</span>
              </span>
              <input
                type="range"
                min={meta.min}
                max={meta.max}
                step={meta.step}
                value={params[key]}
                onChange={(e) =>
                  onChange({ ...params, [key]: Number(e.target.value) })
                }
                className="accent-ambar"
              />
            </label>
          );
        })}
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-4 w-full rounded-full bg-ambar px-4 py-2 text-xs font-semibold text-noche transition-colors hover:bg-ambar/90"
      >
        {copied ? "✓ Copiado" : "Copiar JSON"}
      </button>
    </div>
  );
}
