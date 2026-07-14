"use client";

import { useEffect, useRef, useState } from "react";

type Field = { label: string; value: string };

type AutofillFormProps = {
  customer: string;
  pickup: string;
  contact: string;
  typingCharMs: number;
  fieldStaggerMs: number;
  reduced: boolean;
  /** Fires once, when every field has finished typing (or immediately if reduced). */
  onComplete: () => void;
};

const SETTLE_MS = 320;

/**
 * The form a real customer would fill — except it fills ITSELF, typing the
 * generated customer's data (spec §3.1 paso 3). The narrative point: the system
 * captures the data; nobody scribbles it on a scrap of paper. When it finishes,
 * it hands off to the fold+travel (`onComplete`).
 *
 * Typing is driven by a single elapsed-time clock (one rAF loop), so speed and
 * per-field stagger are exact and tuneable; reduced-motion shows every field
 * already filled and completes on the next tick.
 */
export default function AutofillForm({
  customer,
  pickup,
  contact,
  typingCharMs,
  fieldStaggerMs,
  reduced,
  onComplete,
}: AutofillFormProps) {
  const fields: Field[] = [
    { label: "Nombre", value: customer },
    { label: "Retiro", value: pickup },
    { label: "Contacto", value: contact },
  ];

  const [elapsed, setElapsed] = useState(0);
  const doneRef = useRef(false);

  const totalMs =
    fields.reduce(
      (max, field, i) => Math.max(max, i * fieldStaggerMs + field.value.length * typingCharMs),
      0,
    ) + SETTLE_MS;

  useEffect(() => {
    if (reduced) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      setElapsed(t);
      if (t >= totalMs) {
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Mount-only: the flow re-mounts this component per order, and the values
    // are fixed for the life of one fill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function typedValue(field: Field, index: number): { text: string; typing: boolean } {
    if (reduced) return { text: field.value, typing: false };
    const local = elapsed - index * fieldStaggerMs;
    if (local <= 0) return { text: "", typing: false };
    const chars = Math.min(field.value.length, Math.floor(local / typingCharMs));
    return { text: field.value.slice(0, chars), typing: chars < field.value.length };
  }

  return (
    <div className="mt-6 rounded-2xl border border-noche/10 bg-white/60 p-5">
      <p className="text-xs font-medium tracking-[0.15em] text-bruma">
        TUS DATOS · SE CAPTURAN SOLOS
      </p>
      <dl className="mt-4 flex flex-col gap-3">
        {fields.map((field, i) => {
          const { text, typing } = typedValue(field, i);
          return (
            <div key={field.label} className="flex flex-col gap-1">
              <dt className="text-xs text-bruma">{field.label}</dt>
              <dd className="flex min-h-6 items-center rounded-lg border border-noche/10 bg-white px-3 py-1.5 text-sm text-noche">
                <span>{text}</span>
                {typing && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-4 w-px animate-pulse bg-noche/60"
                  />
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
