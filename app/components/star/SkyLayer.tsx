"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The animated night sky behind everything (BL-17, Phinxlab-style drawn
 * starfield). A fixed canvas at z-0: opaque sections painted after it in the
 * DOM cover it, so the sky is only visible through the umbral windows (and
 * any future translucent section). It must sit at NEGATIVE z: positioned
 * elements at z-0 paint ABOVE static blocks regardless of DOM order, which
 * would drown every section background in night. Three parallax layers of
 * hand-drawn dots
 * drift at different rates against the scroll + twinkle on their own clocks —
 * the "capas de movimiento" base of the site's navigation design.
 */

type SkyStar = {
  x: number; // viewport-width fraction
  y: number; // seed offset in px, wrapped over viewport height
  size: number;
  phase: number;
  twinkleHz: number;
  ambar: boolean;
};

type SkyLayerDef = { parallax: number; count: number; alpha: number };

const LAYERS: SkyLayerDef[] = [
  { parallax: 0.12, count: 70, alpha: 0.35 }, // far
  { parallax: 0.28, count: 45, alpha: 0.55 }, // mid
  { parallax: 0.5, count: 22, alpha: 0.8 }, // near
];

export default function SkyLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let vw = 0;
    let vh = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const layers: SkyStar[][] = LAYERS.map((def) =>
      Array.from({ length: def.count }, () => ({
        x: Math.random(),
        y: Math.random() * 4000,
        size: 0.6 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        twinkleHz: 0.08 + Math.random() * 0.25,
        ambar: Math.random() < 0.12,
      })),
    );

    const render = () => {
      const now = performance.now() / 1000;
      const s = window.scrollY;

      const grad = ctx.createRadialGradient(
        vw / 2, vh * 0.45, vh * 0.1,
        vw / 2, vh * 0.45, vh * 0.95,
      );
      grad.addColorStop(0, "#232a52");
      grad.addColorStop(0.55, "#1B2140");
      grad.addColorStop(1, "#12162e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, vw, vh);

      for (let li = 0; li < LAYERS.length; li++) {
        const def = LAYERS[li];
        for (const st of layers[li]) {
          const y = (((st.y - s * def.parallax) % vh) + vh) % vh;
          const tw = 0.65 + 0.35 * Math.sin(now * Math.PI * 2 * st.twinkleHz + st.phase);
          ctx.beginPath();
          ctx.arc(st.x * vw, y, st.size * (li === 2 ? 1.4 : 1), 0, Math.PI * 2);
          ctx.fillStyle = st.ambar
            ? `rgba(242, 166, 62, ${def.alpha * tw})`
            : `rgba(246, 239, 225, ${def.alpha * tw})`;
          ctx.fill();
        }
      }
    };
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
