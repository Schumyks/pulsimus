"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getTunePanes,
  getTuneVersion,
  subscribeTune,
  type TunePane,
} from "./tuneRegistry";

/**
 * The single `?tune` panel: every registered choreography appears as a tab
 * (star, mostrador, tablero, quien-soy…) so tuning no longer stacks four
 * floating boxes over the page. Collapsible for the same reason. "Copiar
 * JSON" copies the ACTIVE tab's params — what you copy is what you freeze
 * into that choreography's DEFAULT_*. Deleted once Alan freezes the values.
 */
export default function UnifiedTunePanel() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Client-only gate: the ?tune panel depends on window.location, absent
    // during prerender.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL gate, resolves after hydration
    if (new URLSearchParams(window.location.search).has("tune")) setOpen(true);
  }, []);

  useSyncExternalStore(subscribeTune, getTuneVersion, () => 0);
  const panes = getTunePanes();
  const active: TunePane | undefined =
    panes.find((p) => p.key === activeKey) ?? panes[0];

  if (!open || !active) return null;

  async function copy() {
    if (!active) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(active.params, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — the values are still on screen to copy by hand */
    }
  }

  return (
    <div className="fixed top-4 left-4 z-[100] w-72 rounded-xl bg-noche/95 p-4 text-hueso shadow-2xl ring-1 ring-hueso/15 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.15em] text-ambar">?TUNE</p>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          className="rounded px-2 text-sm text-hueso/60 hover:text-hueso"
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="mt-3 flex flex-wrap gap-1">
            {panes.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setActiveKey(p.key)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  p.key === active.key
                    ? "bg-ambar text-noche"
                    : "bg-hueso/10 text-hueso/70 hover:bg-hueso/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {Object.keys(active.meta).map((key) => {
              const meta = active.meta[key];
              return (
                <label key={key} className="flex flex-col gap-1 text-xs">
                  <span className="flex items-center justify-between">
                    <span className="text-hueso/70">{meta.label}</span>
                    <span className="tabular-nums text-hueso">
                      {active.params[key]}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={active.params[key]}
                    onChange={(e) =>
                      active.onChange({
                        ...active.params,
                        [key]: Number(e.target.value),
                      })
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
            {copied ? "✓ Copiado" : `Copiar JSON · ${active.label}`}
          </button>
        </>
      )}
    </div>
  );
}
