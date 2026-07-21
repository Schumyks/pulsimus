"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Brand intro — "Acreción → supernova" set-piece (ported from Claude Design's
 * public/transitions/pulsimus-supernova.html on 2026-07-18).
 *
 * The screen starts EMPTY (night sky). Dust is sucked toward the center like a
 * black hole, orbits, densifies into a compact star, then EXPLODES into a
 * supernova that leaves a nebula + star field — and the wordmark emerges from
 * the flash. Here it runs on autoplay as the opening overlay; when it finishes
 * (or the visitor skips) it fades out and reveals the hero.
 *
 * The whole visual is a PURE FUNCTION of progress `p` (0→1): every particle
 * knows where it is for any `p`, so autoplay scrubs without jank. Retune the
 * whole choreography by editing TUNING only.
 *
 * The previous "pulse draws itself" intro is preserved in Intro.legacy.tsx.
 */

const SEEN_KEY = "px-intro-seen";
const FADE_MS = 760;

type Phase = "idle" | "run" | "done";
type RGB = [number, number, number];

const TUNING = {
  /* ---- STRICT Faro Ámbar palette (rgb) ---- */
  color: {
    noche: [27, 33, 64] as RGB, //     #1B2140  base background
    nocheProf: [18, 22, 46] as RGB, // #12162e  deep background / vignette
    hueso: [246, 239, 225] as RGB, //  #F6EFE1  warm light / brand white
    ambar: [242, 166, 62] as RGB, //   #F2A63E  ACCENT — the only lead light
    bruma: [106, 113, 158] as RGB, //  #6A719E  SUPPORT — background stars
  },

  /* ---- phases: progress thresholds p (0..1) ---- */
  phase: {
    emptyEnd: 0.08, //   empty screen (night sky)
    coreIn: 0.2, //      the core starts glowing with the accumulation
    inflowEnd: 0.55, //  most of the dust has arrived and orbits
    climax: 0.66, //     THRESHOLD → fires the supernova
    flashPeak: 0.69, //  flash peak
    explodeEnd: 0.88, // the wave has filled the screen
    settleEnd: 1.0, //   nebula + star field (the site is born)
  },

  /* ---- geometry (fractions; discR/orbit on the shorter side, start on the diagonal) ---- */
  geom: {
    discR: 0.42, //       scale of the orbit zone near the center
    tilt: 0.62, //        disc flattening (1 = head-on, 0 = edge-on)
    coreCenterY: 0.5, //  0.5 = exact vertical center
    debrisReach: 0.62, // ejection reach (× diagonal → leaves the frame)
  },

  /* ---- core (the star that forms as dust accumulates) ---- */
  core: {
    r: 0.13, //        body radius at max accumulation
    coronaMul: 3.1, // corona extent relative to the body
    spin: 6.5, //      angular speed while orbiting
    kepler: 4.0, //    how much the spin accelerates as it densifies
    infall: 2.4, //    suction curve: >1 = starts slow far, rushes in near center
    inhale: 0.12, //   anticipation contraction right before the blast
  },

  /* ---- dust / debris (reused pool; peak alive ≤ ~400) ---- */
  dust: {
    count: 340,
    sizeBase: 0.012,
    sharpFrac: 0.42,
    persistFrac: 0.42,
    startFar: [0.85, 1.13] as [number, number], // birth radius (× diagonal) → off-frame
    orbitNear: [0.03, 0.23] as [number, number], // orbit radius where they pile up (× discR)
    enterUpto: 0.34, //                            staggered appearance window (stream)
    travel: [0.18, 0.28] as [number, number], //   inbound travel duration (in p)
    swirl: [2.0, 5.2] as [number, number], //      how much they coil while falling (radians)
    trail: 2,
    trailDp: 0.006,
    trailFade: 0.5,
  },
  spark: { count: 60, size: 0.006 },
  bgStar: { count: 150, size: 0.0032, drift: 0.05 },

  /* ---- explosion ---- */
  boom: {
    rings: 3,
    ringStagger: 0.022,
    ringLife: 0.3,
    ringSpeed: 1.15,
    flashMax: 0.95,
    debrisSpread: 0.34,
    coolStart: 0.1,
  },

  /* ---- payoff: the wordmark emerges from the flash ---- */
  wordmark: { show: true },

  autoplaySecs: 8,
};

type Dust = {
  a0: number;
  startFrac: number;
  orbitFrac: number;
  enterP: number;
  travel: number;
  swirl: number;
  tone: "ambar" | "hueso";
  sharp: boolean;
  dir: number;
  spd: number;
  persist: boolean;
  tw: number;
};
type Spark = { dir: number; r: number };
type BgStar = {
  x: number;
  y: number;
  depth: number;
  tone: "bruma" | "hueso";
  sz: number;
  tw: number;
  base: number;
};
type Sampled = {
  x: number;
  y: number;
  depth: number;
  a: number;
  sz: number;
  spr: HTMLCanvasElement;
  phase: "flow" | "debris";
} | null;

function revealHero() {
  const hero = document.querySelector<HTMLElement>('[data-rv="hero"]');
  if (hero) {
    hero.style.transition =
      "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)";
    hero.style.opacity = "1";
    hero.style.transform = "none";
  }
}

export default function Intro() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    revealHero();
    const sym = document.getElementById("hdr-sym");
    if (sym) sym.style.opacity = "1";
    setLeaving(true);
    window.setTimeout(() => setPhase("done"), FADE_MS);
  }, []);

  // Decide on mount, before paint. `?intro` forces a replay (dev/review), even
  // if already seen or reduced-motion; otherwise: once per session, no reduced.
  useLayoutEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = true;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let force = false;
    try {
      force = new URLSearchParams(window.location.search).has("intro");
    } catch {
      force = false;
    }
    const shouldRun = force || (!seen && !reduced);
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

  // Skip with the keyboard while the set-piece runs.
  useEffect(() => {
    if (phase !== "run") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  // The supernova engine — all canvas state is per-mount.
  useEffect(() => {
    if (phase !== "run") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const TP = TUNING.phase,
      TC = TUNING.color,
      TG = TUNING.geom,
      TCore = TUNING.core,
      TD = TUNING.dust;

    let W = 0,
      H = 0,
      cx = 0,
      cy = 0,
      baseR = 0,
      maxDim = 0,
      maxReach = 0;

    /* ---------- helpers ---------- */
    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smooth = (a: number, b: number, x: number) => {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    };
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mulberry32 = (s: number) =>
      function () {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    const now = () => performance.now();

    /* ---------- cached glow sprites ---------- */
    const glows: Record<string, HTMLCanvasElement> = {};
    function makeGlow(c: RGB) {
      const s = 64,
        oc = document.createElement("canvas");
      oc.width = oc.height = s;
      const g = oc.getContext("2d")!;
      const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grd.addColorStop(0, rgba(c, 1));
      grd.addColorStop(0.25, rgba(c, 0.85));
      grd.addColorStop(0.55, rgba(c, 0.28));
      grd.addColorStop(1, rgba(c, 0));
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
      return oc;
    }
    function makeSharp(c: RGB) {
      const s = 64,
        oc = document.createElement("canvas");
      oc.width = oc.height = s;
      const g = oc.getContext("2d")!;
      const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grd.addColorStop(0, rgba(c, 1));
      grd.addColorStop(0.34, rgba(c, 1));
      grd.addColorStop(0.5, rgba(c, 0.55));
      grd.addColorStop(0.72, rgba(c, 0.12));
      grd.addColorStop(1, rgba(c, 0));
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
      return oc;
    }
    function buildGlows() {
      glows.ambar = makeGlow(TC.ambar);
      glows.ambarS = makeSharp(TC.ambar);
      glows.hueso = makeGlow(TC.hueso);
      glows.huesoS = makeSharp(TC.hueso);
      glows.bruma = makeGlow(TC.bruma);
      glows.brumaS = makeSharp(TC.bruma);
    }
    const pick = (tone: string, sharp: boolean) => glows[tone + (sharp ? "S" : "")];

    function resize() {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv!.width = Math.round(W * DPR);
      cv!.height = Math.round(H * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = W / 2;
      cy = H * TG.coreCenterY;
      baseR = Math.min(W, H);
      maxDim = Math.hypot(W, H);
      maxReach = maxDim * TG.debrisReach;
      buildGlows();
    }

    /* ---------- particles (static params; position = f(p)) ---------- */
    let dust: Dust[] = [],
      sparks: Spark[] = [],
      bgStars: BgStar[] = [];
    function build() {
      const rng = mulberry32(20260718);
      const N = TD.count;
      dust = new Array(N);
      for (let i = 0; i < N; i++) {
        dust[i] = {
          a0: rng() * Math.PI * 2,
          startFrac: lerp(TD.startFar[0], TD.startFar[1], rng()),
          orbitFrac: lerp(TD.orbitNear[0], TD.orbitNear[1], Math.pow(rng(), 1.6)),
          enterP: 0.02 + Math.pow(rng(), 1.15) * TD.enterUpto,
          travel: lerp(TD.travel[0], TD.travel[1], rng()),
          swirl: lerp(TD.swirl[0], TD.swirl[1], rng()),
          tone: rng() < 0.5 ? "ambar" : "hueso",
          sharp: rng() < TD.sharpFrac,
          dir: rng() * Math.PI * 2,
          spd: 0.25 + Math.pow(rng(), 0.7) * 0.95,
          persist: rng() < TD.persistFrac,
          tw: 0.4 + rng() * 1.6,
        };
      }
      sparks = new Array(TUNING.spark.count);
      for (let i = 0; i < sparks.length; i++)
        sparks[i] = { dir: rng() * Math.PI * 2, r: 0.88 + rng() * 0.2 };
      bgStars = new Array(TUNING.bgStar.count);
      for (let i = 0; i < bgStars.length; i++)
        bgStars[i] = {
          x: rng(),
          y: rng(),
          depth: rng(),
          tone: rng() < 0.72 ? "bruma" : "hueso",
          sz: 0.5 + rng() * 1.4,
          tw: 0.3 + rng() * 1.8,
          base: 0.25 + rng() * 0.55,
        };
    }

    /* ---- position of ONE particle as a function of p (or null if off-scene) ---- */
    function sampleDust(d: Dust, p: number): Sampled {
      const discR = baseR * TG.discR;
      const orbitR = d.orbitFrac * discR;

      if (p >= TP.climax) {
        // ---------- EJECTION: debris from the center ----------
        const te = p - TP.climax,
          win = TP.explodeEnd - TP.climax;
        const spread = easeOut(clamp01(te / win)) + Math.max(0, te - win) * 0.15;
        const dist = d.spd * spread * maxReach * (0.5 + TUNING.boom.debrisSpread);
        let tone: string;
        if (te < TUNING.boom.coolStart * 0.4) tone = "hueso";
        else if (te < TUNING.boom.coolStart * 1.6) tone = "ambar";
        else tone = d.persist ? "bruma" : "ambar";
        let a: number;
        if (d.persist) {
          const tw = 0.5 + 0.5 * Math.sin(now() * 0.001 * d.tw + d.a0 * 10);
          a = lerp(1, 0.55 * tw, clamp01(te / win));
        } else a = clamp01(1 - te / (win * 0.9));
        if (a <= 0.02) return null;
        return {
          x: cx + Math.cos(d.dir) * dist,
          y: cy + Math.sin(d.dir) * dist,
          depth: 1,
          a,
          sz: baseR * TD.sizeBase * (1.3 - Math.min(0.8, te * 1.2)) * (d.sharp ? 0.66 : 1),
          spr: pick(tone, d.sharp),
          phase: "debris",
        };
      }

      if (p < d.enterP) return null; // not born yet: off-scene
      const arrival = d.enterP + d.travel;
      let radius: number, ang: number, a: number, sz: number, hot: boolean;

      if (p < arrival) {
        // ---------- ENTRY: sucked toward the center (accelerates) ----------
        const t = (p - d.enterP) / d.travel;
        const ef = Math.pow(t, TCore.infall);
        radius = lerp(d.startFrac * maxDim, orbitR, ef);
        ang = d.a0 + d.swirl * t;
        a = smooth(0, 0.1, t) * (0.45 + 0.55 * t);
        sz = baseR * TD.sizeBase * (0.65 + 0.55 * t) * (d.sharp ? 0.62 : 1);
        hot = t > 0.72;
      } else {
        // ---------- ORBIT + ACCUMULATION: densifies toward the center ----------
        const accum = smooth(arrival, TP.climax, p);
        radius = orbitR * (1 - 0.94 * accum);
        const tf = 1 - radius / orbitR;
        ang = d.a0 + d.swirl + (p - arrival) * TCore.spin * (1 + TCore.kepler * tf);
        a = 0.85 + 0.15 * accum;
        sz = baseR * TD.sizeBase * (0.9 + 0.35 * accum) * (d.sharp ? 0.62 : 1);
        hot = true;
      }

      const x = cx + Math.cos(ang) * radius;
      const y = cy + Math.sin(ang) * radius * TG.tilt;
      const depth = Math.sin(ang);
      return {
        x,
        y,
        depth,
        a: Math.min(1, a * (0.75 + 0.25 * depth)),
        sz: sz * (0.85 + 0.35 * depth),
        spr: pick(hot ? "hueso" : d.tone, d.sharp),
        phase: "flow",
      };
    }

    /* ---- painting with trail (real motion-blur by re-sampling) ---- */
    function paintEchoes(d: Dust, p: number) {
      for (let k = TD.trail; k >= 1; k--) {
        const e = sampleDust(d, p - k * TD.trailDp);
        if (!e || e.phase === "debris") continue;
        const es = e.sz * (1 - 0.12 * k);
        ctx!.globalAlpha = e.a * Math.pow(TD.trailFade, k);
        ctx!.drawImage(e.spr, e.x - es * 3, e.y - es * 3, es * 6, es * 6);
      }
    }
    function paintDot(o: NonNullable<Sampled>) {
      ctx!.globalAlpha = o.a;
      ctx!.drawImage(o.spr, o.x - o.sz * 3, o.y - o.sz * 3, o.sz * 6, o.sz * 6);
    }

    /* ---------- drawing ---------- */
    function drawBackground(dens: number) {
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.85);
      g.addColorStop(0, rgba(TC.nocheProf, 1));
      g.addColorStop(0.6, rgba(TC.noche, 1));
      g.addColorStop(1, rgba(TC.nocheProf, 1));
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      const t = now() * 0.001;
      ctx!.globalCompositeOperation = "lighter";
      for (const s of bgStars) {
        const pull = TUNING.bgStar.drift * dens * (1 - s.depth);
        const sx = lerp(s.x * W, cx, pull),
          sy = lerp(s.y * H, cy, pull);
        const tw = s.base * (0.55 + 0.45 * Math.sin(t * s.tw + s.x * 20));
        const sz = baseR * TUNING.bgStar.size * s.sz;
        ctx!.globalAlpha = tw;
        ctx!.drawImage(
          s.tone === "hueso" ? glows.hueso : glows.bruma,
          sx - sz * 3,
          sy - sz * 3,
          sz * 6,
          sz * 6,
        );
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
    }

    function coreRadius(dens: number, p: number) {
      let r = baseR * (0.006 + TCore.r * easeOut(dens));
      const over = smooth(TP.inflowEnd, TP.climax, p);
      r *= 1 + 0.16 * over;
      r *= 1 - TCore.inhale * smooth(TP.climax - 0.045, TP.climax, p);
      return r;
    }
    function drawCore(dens: number, p: number, alpha: number) {
      const over = smooth(TP.inflowEnd, TP.climax, p);
      const r = coreRadius(dens, p),
        R = r * TCore.coronaMul;

      const gc = ctx!.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        R * (1 + 0.04 * Math.sin(now() * 0.0016)),
      );
      gc.addColorStop(0, rgba(TC.ambar, 0.5 * alpha));
      gc.addColorStop(0.5, rgba(TC.ambar, 0.16 * alpha));
      gc.addColorStop(1, rgba(TC.ambar, 0));
      ctx!.fillStyle = gc;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, 7);
      ctx!.fill();

      const gb = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 1.35);
      gb.addColorStop(0, rgba(TC.hueso, (0.55 + 0.45 * over) * alpha));
      gb.addColorStop(0.35, rgba(TC.ambar, 0.98 * alpha));
      gb.addColorStop(0.8, rgba(TC.ambar, 0.5 * alpha));
      gb.addColorStop(1, rgba(TC.ambar, 0));
      ctx!.fillStyle = gb;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 1.35, 0, 7);
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    function drawShockwave(p: number) {
      if (p < TP.climax) return;
      const B = TUNING.boom;
      ctx!.globalCompositeOperation = "lighter";
      ctx!.lineCap = "round";
      for (let k = 0; k < B.rings; k++) {
        const te = p - (TP.climax + k * B.ringStagger);
        if (te < 0) continue;
        const life = clamp01(te / B.ringLife);
        const rad = easeOut(life) * B.ringSpeed * maxReach;
        const a = (1 - life) * (1 - life);
        if (a <= 0.01) continue;
        ctx!.globalAlpha = a * 0.55;
        ctx!.lineWidth = lerp(baseR * 0.03, 1.5, life);
        ctx!.strokeStyle = rgba(TC.ambar, 1);
        ctx!.beginPath();
        ctx!.arc(cx, cy, rad, 0, 7);
        ctx!.stroke();
        ctx!.globalAlpha = a * 0.9;
        ctx!.lineWidth = lerp(baseR * 0.008, 0.8, life);
        ctx!.strokeStyle = rgba(TC.hueso, 1);
        ctx!.beginPath();
        ctx!.arc(cx, cy, rad, 0, 7);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawFlash(p: number) {
      const fa =
        smooth(TP.climax, TP.flashPeak, p) *
        (1 - smooth(TP.flashPeak, TP.explodeEnd, p)) *
        TUNING.boom.flashMax;
      if (fa <= 0.01) return;
      ctx!.globalCompositeOperation = "lighter";
      const R = maxDim * 0.65,
        g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, rgba(TC.hueso, fa));
      g.addColorStop(0.28, rgba(TC.ambar, fa * 0.85));
      g.addColorStop(0.7, rgba(TC.ambar, fa * 0.18));
      g.addColorStop(1, rgba(TC.ambar, 0));
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawSparks(p: number) {
      if (p < TP.climax) return;
      const te = p - TP.climax,
        win = TP.explodeEnd - TP.climax;
      const k = clamp01(te / (win * 0.85)),
        a = (1 - k) * 0.9;
      if (a <= 0.02) return;
      const rad = easeOut(k) * maxReach,
        sz = baseR * TUNING.spark.size;
      ctx!.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        const rr = rad * s.r;
        ctx!.globalAlpha = a;
        ctx!.drawImage(
          glows.hueso,
          cx + Math.cos(s.dir) * rr - sz * 3,
          cy + Math.sin(s.dir) * rr - sz * 3,
          sz * 6,
          sz * 6,
        );
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
    }

    const NEB = [
      { dx: -0.12, dy: -0.06, r: 0.5, c: "ambar", a: 0.1 },
      { dx: 0.14, dy: 0.05, r: 0.62, c: "ambar", a: 0.07 },
      { dx: 0.02, dy: 0.1, r: 0.7, c: "bruma", a: 0.1 },
      { dx: -0.1, dy: 0.08, r: 0.45, c: "bruma", a: 0.08 },
    ];
    function drawNebula(p: number) {
      const neb = smooth(TP.explodeEnd - 0.02, 1.0, p);
      if (neb <= 0.01) return;
      const t = now() * 0.0003;
      ctx!.globalCompositeOperation = "lighter";
      NEB.forEach((n, i) => {
        const R = baseR * n.r * (0.85 + 0.15 * Math.sin(t * 6 + i));
        const nx = cx + (n.dx + 0.01 * Math.sin(t * 4 + i)) * baseR,
          ny = cy + (n.dy + 0.01 * Math.cos(t * 3 + i)) * baseR;
        const col = n.c === "ambar" ? TC.ambar : TC.bruma;
        const g = ctx!.createRadialGradient(nx, ny, 0, nx, ny, R);
        g.addColorStop(0, rgba(col, n.a * neb));
        g.addColorStop(1, rgba(col, 0));
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(nx, ny, R, 0, 7);
        ctx!.fill();
      });
      ctx!.globalCompositeOperation = "source-over";
    }

    let fontReady = false;
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => {
        fontReady = true;
      });
    function drawWordmark(p: number) {
      if (!TUNING.wordmark.show) return;
      const wm = smooth(TP.flashPeak + 0.03, 0.99, p);
      if (wm <= 0.01) return;
      const a = easeOut(wm),
        rise = (1 - a) * baseR * 0.03,
        fam = fontReady ? "'Outfit'" : "system-ui,sans-serif";
      const c2 = ctx! as CanvasRenderingContext2D & { letterSpacing: string };
      c2.textAlign = "center";
      c2.textBaseline = "middle";
      const fs = Math.min(W * 0.075, 64);
      c2.font = `600 ${fs}px ${fam}`;
      c2.letterSpacing = fs * 0.22 + "px";
      c2.fillStyle = rgba(TC.hueso, a);
      c2.fillText("PULSIMUS", cx, cy - fs * 0.15 + rise);
      const cs2 = Math.min(W * 0.015, 13);
      c2.font = `500 ${cs2}px ${fam}`;
      c2.letterSpacing = cs2 * 0.5 + "px";
      c2.fillStyle = rgba(TC.ambar, a * 0.9);
      c2.fillText("E L   P U L S O   D E   T U   N E G O C I O", cx, cy + fs * 0.55 + rise);
      c2.letterSpacing = "0px";
    }

    function draw(p: number) {
      const dens = easeOut(smooth(TP.emptyEnd, TP.climax, p));
      const coreAlpha =
        smooth(TP.coreIn, TP.coreIn + 0.24, p) * (1 - smooth(TP.climax, TP.flashPeak, p));
      drawBackground(dens);

      ctx!.globalCompositeOperation = "lighter";
      if (p < TP.climax) {
        const back: [Dust, NonNullable<Sampled>][] = [],
          front: [Dust, NonNullable<Sampled>][] = [];
        for (const d of dust) {
          const o = sampleDust(d, p);
          if (!o) continue;
          (o.depth < 0 ? back : front).push([d, o]);
        }
        for (const [d, o] of back) {
          paintEchoes(d, p);
          paintDot(o);
        }
        if (coreAlpha > 0.01) drawCore(dens, p, coreAlpha);
        for (const [d, o] of front) {
          paintEchoes(d, p);
          paintDot(o);
        }
      } else {
        if (coreAlpha > 0.01) drawCore(dens, p, coreAlpha);
        for (const d of dust) {
          const o = sampleDust(d, p);
          if (o) paintDot(o);
        }
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";

      drawSparks(p);
      drawShockwave(p);
      drawFlash(p);
      drawNebula(p);
      drawWordmark(p);
    }

    /* ---------- loop / autoplay ---------- */
    const state = { p: 0, playing: true, playT0: now(), playFrom: 0 };
    let raf = 0;
    function tick() {
      if (state.playing) {
        let np = state.playFrom + (now() - state.playT0) / 1000 / TUNING.autoplaySecs;
        if (np >= 1) {
          np = 1;
          state.playing = false;
          finish();
        }
        state.p = clamp01(np);
      }
      draw(state.p);
      raf = requestAnimationFrame(tick);
    }

    resize();
    build();
    window.addEventListener("resize", resize);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = prevOverflow;
    };
  }, [phase, finish]);

  if (phase !== "run") return null;

  return (
    <div
      aria-hidden="true"
      onClick={finish}
      className="fixed inset-0 z-[90] cursor-pointer"
      style={{
        background: "#12162e",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.7s ease",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-x-0 bottom-[30px] text-center text-xs tracking-[0.1em] text-bruma"
        style={{
          opacity: leaving ? 0 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      >
        CLICK PARA SALTAR
      </div>
    </div>
  );
}
