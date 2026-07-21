"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { STAR_STATIONS } from "./starScript";
import { DEFAULT_STAR_PARAMS, type StarParams } from "./starParams";

/**
 * BL-17 — the star as the visitor's companion (motor v2, Alan's direction
 * 18/07): the scroll-keyed path is gone. The star simply travels WITH the
 * cursor — wherever the visitor goes, the star goes, and the site gets
 * built by their passage: when an unrevealed section enters the viewport,
 * a pulse wave is born AT THE STAR and uncovers the content behind its
 * expanding front (`.sw-pending` mask in star.css). A bare click also
 * pulses, so the visitor can feel the heartbeat. While the pointer rests,
 * the star drifts on a slow breathing orbit instead of freezing.
 * Umbral zones are stages for designed scenes: the standard scene is the
 * Nano Banana cloud plates (public/clouds/processed, luminance-alpha
 * WebP) drawn as three parallax layers clipped to the umbral band — the
 * front bank opens a soft hole around the star to let it pass. Bespoke
 * set pieces (galaxy explosion, etc.) will replace the standard scene on
 * chosen umbrales when the Claude Design round lands. Lenis smooths the
 * native scroll (anchors stay working via `anchors: true`).
 */

const AMBAR = { r: 242, g: 166, b: 62 };
const HUESO = { r: 246, g: 239, b: 225 };

type Bounds = { top: number; height: number };

type RevealSection = {
  el: HTMLElement;
  bounds: Bounds;
  revealed: boolean;
};

type Ring = {
  x: number;
  y: number;
  born: number;
  bounds?: Bounds;
  el?: HTMLElement;
  revealMax?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cloud plate variants per layer (public/clouds/processed). Umbral i cycles
 * through them so neighboring umbrales never show the same bank. */
const CLOUD_PLATES = {
  a: ["a1", "a2"], // wispy, far
  b: ["b1", "b2", "b3", "b4"], // mid cumulus
  c: ["c1", "c2", "c3", "c4"], // dense front bank
} as const;

function bodyColor(alpha = 1) {
  return `rgba(${HUESO.r}, ${HUESO.g}, ${HUESO.b}, ${alpha})`;
}

function drawSeed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  glow: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = `rgba(${AMBAR.r}, ${AMBAR.g}, ${AMBAR.b}, 0.9)`;
  ctx.shadowBlur = glow;
  ctx.fillStyle = bodyColor();
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.19, -r * 0.3, r * 0.3, -r * 0.19, r, 0);
  ctx.bezierCurveTo(r * 0.3, r * 0.19, r * 0.19, r * 0.3, 0, r);
  ctx.bezierCurveTo(-r * 0.19, r * 0.3, -r * 0.3, r * 0.19, -r, 0);
  ctx.bezierCurveTo(-r * 0.3, -r * 0.19, -r * 0.19, -r * 0.3, 0, -r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default function StarLayer({
  params = DEFAULT_STAR_PARAMS,
}: {
  params?: StarParams;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lenis = new Lenis({ anchors: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Offscreen buffer for the front cloud bank (so the star-hole punch-out
    // never erases what is already painted on the main canvas).
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;

    let vw = 0;
    let vh = 0;
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      off.width = vw;
      off.height = vh;
    };

    // Cloud plates load lazily; a plate draws once its image is ready.
    const plates = new Map<string, HTMLImageElement>();
    for (const names of Object.values(CLOUD_PLATES)) {
      for (const name of names) {
        const img = new Image();
        img.src = `/clouds/processed/${name}.webp`;
        plates.set(name, img);
      }
    }
    const plateFor = (layer: keyof typeof CLOUD_PLATES, umbralIndex: number) => {
      const names = CLOUD_PLATES[layer];
      const img = plates.get(names[umbralIndex % names.length]);
      return img && img.complete && img.naturalWidth > 0 ? img : null;
    };

    // --- Sections that get built by the visitor's passage + umbral bands ---
    let sections: RevealSection[] = [];
    let umbrales: Bounds[] = [];
    let measured = false;
    const measure = () => {
      resizeCanvas();
      const next: RevealSection[] = [];
      for (const st of STAR_STATIONS) {
        if (!st.pulse) continue;
        const el = document.getElementById(st.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const prev = sections.find((s) => s.el === el);
        next.push({
          el,
          bounds: { top: rect.top + window.scrollY, height: rect.height },
          revealed: prev?.revealed ?? false,
        });
      }
      sections = next;
      umbrales = [...document.querySelectorAll<HTMLElement>("[data-umbral]")]
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return { top: rect.top + window.scrollY, height: rect.height };
        })
        .filter((b) => b.height > 0);
      measured = false; // re-run the initial visibility pass with fresh bounds
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);

    // --- Cursor: the star's one guide. Idle = slow breathing orbit ---
    const cursor = { x: -1, y: -1, t: -1 };
    const onPointerMove = (e: PointerEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.t = performance.now() / 1000;
    };
    let lastClickAt = -10;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      // Interactive targets keep their semantics; the sky answers bare clicks.
      if (t?.closest("button, a, input, label, select, textarea, [role=button]")) return;
      lastClickAt = performance.now() / 1000;
      if (pos) rings.push({ x: pos.x, y: pos.y, born: lastClickAt });
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);

    let pos: { x: number; y: number } | null = null;
    const rings: Ring[] = [];

    const startReveal = (ring: Ring) => {
      if (!ring.el || !ring.bounds) return;
      const localX = ring.x;
      const localY = ring.y + window.scrollY - ring.bounds.top;
      ring.el.style.setProperty("--swx", `${localX}px`);
      ring.el.style.setProperty("--swy", `${localY}px`);
      ring.el.style.setProperty("--swr", "0px");
      const corners = [
        Math.hypot(localX, localY),
        Math.hypot(vw - localX, localY),
        Math.hypot(localX, ring.bounds.height - localY),
        Math.hypot(vw - localX, ring.bounds.height - localY),
      ];
      ring.revealMax = Math.max(...corners);
    };

    /** The pulse wave: expands from the star, breaks against the owning
     * section's top/bottom edges, and drives that section's reveal mask. */
    const drawRing = (ring: Ring, now: number, p: StarParams) => {
      const rt = (now - ring.born) / (p.pulseMs / 1000);
      if (rt >= 1) {
        if (ring.el) {
          ring.el.classList.remove("sw-pending");
          ring.el.style.removeProperty("--swr");
        }
        return false;
      }
      const eased = 1 - (1 - rt) * (1 - rt);
      const radius = eased * p.ringVh * vh;
      const alpha = (1 - rt) * 0.5;
      const s = window.scrollY;

      if (ring.el && ring.revealMax) {
        ring.el.style.setProperty("--swr", `${eased * ring.revealMax}px`);
      }

      ctx.save();
      if (ring.bounds) {
        ctx.beginPath();
        ctx.rect(0, ring.bounds.top - s, vw, ring.bounds.height);
        ctx.clip();
      }
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = bodyColor(alpha);
      ctx.lineWidth = lerp(p.ringWidth, p.ringWidth * 0.2, rt);
      ctx.stroke();
      ctx.restore();

      if (ring.bounds) {
        // Edge collision: where the wave passed an edge, light the chord up.
        const edges = [ring.bounds.top - s, ring.bounds.top + ring.bounds.height - s];
        for (const edgeY of edges) {
          const dist = Math.abs(edgeY - ring.y);
          if (radius > dist) {
            const half = Math.sqrt(radius * radius - dist * dist);
            const grad = ctx.createLinearGradient(ring.x - half, 0, ring.x + half, 0);
            grad.addColorStop(0, bodyColor(0));
            grad.addColorStop(0.5, bodyColor(alpha * 1.6));
            grad.addColorStop(1, bodyColor(0));
            ctx.beginPath();
            ctx.moveTo(ring.x - half, edgeY);
            ctx.lineTo(ring.x + half, edgeY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.ringWidth;
            ctx.stroke();
          }
        }
      }
      return true;
    };

    /** Standard umbral scene: three parallax cloud plates clipped to the
     * band. Back/mid draw under the star; the front bank draws over it via
     * the offscreen buffer, with a soft hole punched around the star so the
     * clouds open and let it through. */
    /** Soft band edges: erase a feather strip of cloud pixels at the top and
     * bottom of the clip region so plates dissolve into sky instead of
     * cutting on a hard horizontal line. destination-out only touches what
     * the given context already holds. */
    const featherEdges = (
      target: CanvasRenderingContext2D,
      top: number,
      height: number,
      feather = 48,
    ) => {
      target.save();
      target.globalCompositeOperation = "destination-out";
      let g = target.createLinearGradient(0, top, 0, top + feather);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      target.fillStyle = g;
      target.fillRect(0, top, vw, feather);
      g = target.createLinearGradient(0, top + height - feather, 0, top + height);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,1)");
      target.fillStyle = g;
      target.fillRect(0, top + height - feather, vw, feather);
      target.restore();
    };

    const drawPlate = (
      target: CanvasRenderingContext2D,
      img: HTMLImageElement,
      i: number,
      now: number,
      cy: number,
      scaleW: number,
      driftAmp: number,
      driftSpeed: number,
      alpha: number,
      clipTop: number,
      clipH: number,
    ) => {
      const w = vw * scaleW;
      const h = w * (img.naturalHeight / img.naturalWidth);
      const x = (vw - w) / 2 + Math.sin(now * driftSpeed + i * 1.7) * driftAmp;
      target.save();
      target.beginPath();
      target.rect(0, clipTop, vw, clipH);
      target.clip();
      target.globalAlpha = alpha;
      target.drawImage(img, x, cy - h / 2, w, h);
      target.restore();
    };

    const drawCloudBands = (front: boolean, now: number, s: number) => {
      for (let i = 0; i < umbrales.length; i++) {
        const band = umbrales[i];
        const topV = band.top - s;
        if (topV > vh + 60 || topV + band.height < -60) continue;
        // Depth: shift each layer against the band's distance from the
        // viewport center; horizontal drift keeps them alive.
        const depthShift = topV + band.height / 2 - vh / 2;
        const clipTop = topV;
        const clipH = band.height;

        if (!front) {
          const a = plateFor("a", i);
          const b = plateFor("b", i);
          if (a) drawPlate(ctx, a, i, now, topV + band.height * 0.3 + depthShift * 0.1, 1.25, 26, 0.05, 0.5, clipTop, clipH);
          if (b) drawPlate(ctx, b, i, now, topV + band.height * 0.55 + depthShift * 0.05, 1.15, 18, 0.035, 0.72, clipTop, clipH);
          if (a || b) featherEdges(ctx, clipTop, clipH);
        } else {
          const c = plateFor("c", i);
          if (!c || !pos) continue;
          const holeR = 130;
          const starInBand = pos.y > clipTop - holeR && pos.y < clipTop + clipH + holeR;
          if (!starInBand) {
            // Cheap path: no hole to punch — draw straight to the main
            // canvas. The feather also nibbles ring/star pixels on the band
            // edge strips, but the star is out of band here and rings rarely
            // cross it; the offscreen roundtrip costs more than that risk.
            drawPlate(ctx, c, i, now, topV + band.height * 0.82, 1.2, 12, 0.025, 0.92, clipTop, clipH);
            featherEdges(ctx, clipTop, clipH);
            continue;
          }
          // Star inside the bank: render on a band-sized region of the
          // offscreen buffer, punch the hole there, then blit — never erasing
          // what the main canvas already has.
          const bandH = Math.min(Math.ceil(clipH), vh);
          const srcTop = Math.max(0, clipTop);
          const visH = Math.min(bandH, vh - srcTop);
          if (visH <= 0) continue;
          offCtx.clearRect(0, 0, vw, bandH + 2);
          offCtx.save();
          offCtx.translate(0, -clipTop);
          drawPlate(offCtx, c, i, now, topV + band.height * 0.82, 1.2, 12, 0.025, 1, clipTop, clipH);
          featherEdges(offCtx, clipTop, clipH);
          const g = offCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, holeR);
          g.addColorStop(0, "rgba(0,0,0,1)");
          g.addColorStop(0.55, "rgba(0,0,0,0.85)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          offCtx.globalCompositeOperation = "destination-out";
          offCtx.fillStyle = g;
          offCtx.beginPath();
          offCtx.arc(pos.x, pos.y, holeR, 0, Math.PI * 2);
          offCtx.fill();
          offCtx.restore();
          ctx.save();
          ctx.globalAlpha = 0.92;
          ctx.drawImage(off, 0, srcTop - clipTop, vw, visH, 0, srcTop, vw, visH);
          ctx.restore();
        }
      }
    };

    let lastTime = performance.now() / 1000;
    const render = () => {
      const p = paramsRef.current;
      const now = performance.now() / 1000;
      const dt = Math.min(0.1, now - lastTime);
      lastTime = now;

      ctx.clearRect(0, 0, vw, vh);
      const s = window.scrollY;

      // First pass (and after every re-measure): sections already inside the
      // viewport when the layer wakes up stay visible; everything else waits
      // for the visitor to arrive. Progressive enhancement — without this
      // layer nothing is ever hidden.
      if (!measured) {
        measured = true;
        for (const sec of sections) {
          const visible = sec.bounds.top < s + vh && sec.bounds.top + sec.bounds.height > s;
          if (sec.revealed || visible) {
            sec.revealed = true;
            sec.el.classList.remove("sw-pending");
          } else {
            sec.el.classList.add("sw-pending");
          }
        }
      }

      // The star rides with the cursor; before the first pointer event (or on
      // pointerless visits) it breathes on a slow orbit near the upper right.
      const hasCursor = cursor.t >= 0;
      const idleX = vw * 0.78 + Math.sin(now * 0.5) * vw * 0.04;
      const idleY = vh * 0.3 + Math.sin(now * 0.34 + 1.4) * vh * 0.06;
      const tx = hasCursor ? cursor.x : idleX;
      const ty = hasCursor ? cursor.y : idleY;
      if (!pos) pos = { x: tx, y: ty };
      const k = 1 - Math.exp(-p.chase * dt);
      pos.x += (tx - pos.x) * k;
      pos.y += (ty - pos.y) * k;

      // A section entering the viewport gets built by a wave born at the
      // star — wherever the visitor happens to be pointing right then.
      for (const sec of sections) {
        if (sec.revealed) continue;
        const enters = sec.bounds.top < s + vh * 0.85 && sec.bounds.top + sec.bounds.height > s;
        if (!enters) continue;
        sec.revealed = true;
        const ring: Ring = {
          x: pos.x,
          y: pos.y,
          born: now,
          bounds: sec.bounds,
          el: sec.el,
        };
        startReveal(ring);
        rings.push(ring);
      }

      drawCloudBands(false, now, s);

      for (let i = rings.length - 1; i >= 0; i--) {
        if (!drawRing(rings[i], now, p)) rings.splice(i, 1);
      }

      // Calm heartbeat, kicked by bare clicks so the visitor FEELS the pulse.
      const beat = 1 + p.twinkle * Math.sin(now * Math.PI * 2);
      const clickKick = 1 + Math.exp(-(now - lastClickAt) * 3) * 0.45;
      const size = p.sizeBase * beat * clickKick;
      const glow = 36 * p.glowScale * clickKick;
      drawSeed(ctx, pos.x, pos.y, size, glow);

      drawCloudBands(true, now, s);
    };
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      // Never leave sections hidden behind an unmounted choreography.
      for (const el of document.querySelectorAll(".sw-pending")) {
        el.classList.remove("sw-pending");
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  );
}
