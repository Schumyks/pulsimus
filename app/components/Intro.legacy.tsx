"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * LEGACY intro — the original "pulse draws itself → travels to the header"
 * brand animation. Kept aside on 2026-07-18 when the supernova set-piece took
 * over Intro.tsx. Not imported anywhere; restore by copying back over Intro.tsx.
 */

const SEEN_KEY = "px-intro-seen";
const TRAVEL_AT_MS = 2050;
const TRAVEL_MS = 820;

type Phase = "idle" | "run" | "travel" | "done";

/*
 * Timeline (compressed from the donor so the travel starts at ~2050ms):
 *   0     stars fade in (1s)
 *   150   pulse draws itself (0.95s, done ~1100)
 *   900   "CLICK PARA SALTAR" hint
 *   1000  amber flash (0.9s)
 *   1020  star pops (0.55s, done ~1570)
 *   1250  wordmark opens its tracking (0.7s, done ~1950)
 *   1500  tagline (0.55s, done ~2050)
 *   2050  travel: FLIP to #hdr-sym, background and wordmark fade out
 *   2870  finish: overlay unmounts, hero reveals, header symbol appears
 */

const STARS: Array<{ cx: number; cy: number; r: number; amber?: boolean }> = [
  { cx: 140, cy: 160, r: 1.4 },
  { cx: 320, cy: 640, r: 1.2 },
  { cx: 470, cy: 250, r: 1.6 },
  { cx: 640, cy: 720, r: 1.3 },
  { cx: 810, cy: 130, r: 1.5 },
  { cx: 1010, cy: 560, r: 1.2 },
  { cx: 1180, cy: 300, r: 1.4 },
  { cx: 1340, cy: 690, r: 1.6 },
  { cx: 250, cy: 430, r: 1.8, amber: true },
  { cx: 1240, cy: 480, r: 1.8, amber: true },
];

function revealHero() {
  const hero = document.querySelector<HTMLElement>('[data-rv="hero"]');
  if (hero) {
    hero.style.transition =
      "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)";
    hero.style.opacity = "1";
    hero.style.transform = "none";
  }
}

export default function IntroPulseLegacy() {
  const [phase, setPhase] = useState<Phase>("idle");
  const symRef = useRef<SVGSVGElement | null>(null);
  const travelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (travelTimer.current) clearTimeout(travelTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    revealHero();
    const headerSym = document.getElementById("hdr-sym");
    if (headerSym) headerSym.style.opacity = "1";
    setPhase("done");
  }, []);

  const startTravel = useCallback(() => {
    const sym = symRef.current;
    const target = document.getElementById("hdr-sym");
    if (!sym || !target) {
      finish();
      return;
    }
    const a = sym.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const s = b.width / a.width;
    sym.style.transition = "transform 0.8s cubic-bezier(0.7, 0.02, 0.3, 1)";
    sym.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    finishTimer.current = setTimeout(finish, TRAVEL_MS);
    setPhase("travel");
  }, [finish]);

  // Decide on mount, before paint: the pre-hydration guard class comes off
  // only once the overlay is actually in the DOM (see the phase effect below).
  useLayoutEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = true;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldRun = !seen && !reduced;
    if (shouldRun) {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable — still play the intro this once */
      }
      const hero = document.querySelector<HTMLElement>('[data-rv="hero"]');
      if (hero) {
        hero.style.opacity = "0";
        hero.style.transform = "translateY(26px)";
      }
      const headerSym = document.getElementById("hdr-sym");
      if (headerSym) headerSym.style.opacity = "0";
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only gate (sessionStorage + matchMedia) that must resolve before paint; a state initializer would cause a hydration mismatch
    setPhase(shouldRun ? "run" : "done");
  }, []);

  useLayoutEffect(() => {
    if (phase !== "idle") {
      document.documentElement.classList.remove("px-intro-pending");
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "run") return;
    travelTimer.current = setTimeout(startTravel, TRAVEL_AT_MS);
    return () => {
      if (travelTimer.current) clearTimeout(travelTimer.current);
    };
  }, [phase, startTravel]);

  useEffect(() => {
    if (phase !== "run" && phase !== "travel") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  if (phase === "idle" || phase === "done") return null;

  const traveling = phase === "travel";

  return (
    <div
      aria-hidden="true"
      onClick={finish}
      className="fixed inset-0 z-[90] cursor-pointer"
    >
      <div
        className="absolute inset-0 bg-noche"
        style={{ opacity: traveling ? 0 : 1, transition: "opacity 0.7s ease" }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ animation: "px-fade 1s ease both" }}
        >
          {STARS.map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill={star.amber ? "#F2A63E" : "#6A719E"}
            />
          ))}
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[30px]">
        <svg
          ref={symRef}
          viewBox="0 0 128 56"
          width={240}
          height={105}
          fill="none"
          className="shrink-0"
          style={{ overflow: "visible" }}
        >
          <path
            d="M6 37 H24 L31 30 L38 37 L48 15 L58 45 L66 37 H82 L97 16"
            pathLength={100}
            stroke="#F6EFE1"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation: "px-draw 0.95s cubic-bezier(0.5, 0, 0.3, 1) 0.15s forwards",
              transition: "stroke 0.8s ease",
            }}
          />
          <g transform="translate(103, 11)">
            <circle
              r={11}
              fill="#F2A63E"
              style={{
                opacity: 0,
                filter: "blur(5px)",
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "px-flash 0.9s ease 1s forwards",
              }}
            />
            <path
              d="M0 -9 C1.7 -2.7 2.7 -1.7 9 0 C2.7 1.7 1.7 2.7 0 9 C-1.7 2.7 -2.7 1.7 -9 0 C-2.7 -1.7 -1.7 -2.7 0 -9 Z"
              fill="#F2A63E"
              style={{
                opacity: 0,
                transformBox: "fill-box",
                transformOrigin: "center",
                animation:
                  "px-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 1.02s forwards",
              }}
            />
          </g>
        </svg>

        <div
          className="flex flex-col items-center gap-[14px]"
          style={{ opacity: traveling ? 0 : 1, transition: "opacity 0.3s ease" }}
        >
          <div
            className="text-[38px] font-semibold uppercase text-hueso"
            style={{
              textIndent: "0.22em",
              animation: "px-track 0.7s cubic-bezier(0.25, 0.5, 0.3, 1) 1.25s both",
            }}
          >
            Pulsimus
          </div>
          <div
            className="text-[13px] font-medium tracking-[0.18em] text-ambar"
            style={{ animation: "px-fade 0.55s ease 1.5s both" }}
          >
            EL PULSO DE TU NEGOCIO
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[30px] text-center text-xs tracking-[0.1em] text-bruma"
        style={
          traveling
            ? { opacity: 0, transition: "opacity 0.3s ease" }
            : { animation: "px-fade 0.8s ease 0.9s both" }
        }
      >
        CLICK PARA SALTAR
      </div>
    </div>
  );
}
