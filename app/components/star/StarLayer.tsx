"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { acquireScrollEngine, releaseScrollEngine } from "../motion/scrollEngine";
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
 * Umbral zones are stages for designed scenes from the narrative script
 * (docs/bl17-guion-narrativo.md). The photographic cloud banks were
 * REMOVED (Alan, 21/07): they fought the flat canon and told no story.
 * Flat clouds return later as the "landing on the planet" scene. Lenis
 * smooths the native scroll (anchors stay working via `anchors: true`).
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

    acquireScrollEngine();

    let vw = 0;
    let vh = 0;
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // --- Sections that get built by the visitor's passage ---
    let sections: RevealSection[] = [];
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

      for (let i = rings.length - 1; i >= 0; i--) {
        if (!drawRing(rings[i], now, p)) rings.splice(i, 1);
      }

      // Calm heartbeat, kicked by bare clicks so the visitor FEELS the pulse.
      const beat = 1 + p.twinkle * Math.sin(now * Math.PI * 2);
      const clickKick = 1 + Math.exp(-(now - lastClickAt) * 3) * 0.45;
      const size = p.sizeBase * beat * clickKick;
      const glow = 36 * p.glowScale * clickKick;
      drawSeed(ctx, pos.x, pos.y, size, glow);
    };
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      releaseScrollEngine();
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
      className="pointer-events-none fixed inset-0 h-full w-full z-40"
      aria-hidden="true"
    />
  );
}
