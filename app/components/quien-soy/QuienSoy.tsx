"use client";

import { useEffect, useRef, useState } from "react";
import EstacionIntro from "./EstacionIntro";
import EstacionDiseno from "./EstacionDiseno";
import EstacionConstruccion from "./EstacionConstruccion";
import EstacionCalidad from "./EstacionCalidad";
import EstacionRemate from "./EstacionRemate";
import { useTunePane } from "../dev/tuneRegistry";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useIsDesktop } from "../motion/useIsDesktop";
import {
  DEFAULT_QUIEN_SOY_PARAMS,
  QUIEN_SOY_PARAM_META,
  type QuienSoyParams,
} from "./quienSoyParams";

/**
 * quien-soy — P2 andamiaje (D1/D2 del design). MISMO árbol de componentes en
 * los dos modos, aditivo sobre P1:
 *
 *  - Apilado (mobile / prefers-reduced-motion): las 5 estaciones en flujo
 *    normal del documento, full-viewport cada una — el P1 que ya existía.
 *  - Coreografiado (desktop, motion habilitado): un track de 5×100vh con un
 *    panel `sticky` que muestra la estación activa; el progreso se deriva del
 *    scroll nativo dentro del track (IntersectionObserver arma/desarma un
 *    listener de scroll sólo mientras el track está en pantalla). Nunca se
 *    llama `preventDefault`: el scroll sigue siendo el motor, esto solo mapea
 *    progreso → estación. La liberación del ancla es gratis — es la mecánica
 *    nativa de `position: sticky` dentro de un contenedor de altura finita.
 *
 * La transición entre estaciones es un cross-fade neutro por opacidad
 * (parametrizado por `?tune`) — es el riel, no el diseño de cada estación
 * (eso es trabajo dirigido, fuera de este cambio).
 */

const STATIONS = [
  EstacionIntro,
  EstacionDiseno,
  EstacionConstruccion,
  EstacionCalidad,
  EstacionRemate,
] as const;

const STATION_COUNT = STATIONS.length;

/** Opacity of `stationIndex` given the continuous scroll progress (0..N-1)
 * and the crossfade threshold (fraction of a segment before the fade band
 * starts). Exactly one station is fully opaque outside any crossfade band;
 * exactly two (the outgoing/incoming pair) share it during the band. */
function stationOpacity(
  stationIndex: number,
  progress: number,
  threshold: number,
): number {
  const segment = Math.min(
    STATION_COUNT - 2,
    Math.max(0, Math.floor(progress)),
  );
  const localT = Math.min(1, Math.max(0, progress - segment));
  const fadeSpan = Math.max(0.001, 1 - threshold);

  if (stationIndex === segment) {
    return localT < threshold ? 1 : 1 - (localT - threshold) / fadeSpan;
  }
  if (stationIndex === segment + 1) {
    return localT < threshold ? 0 : (localT - threshold) / fadeSpan;
  }
  return 0;
}

export default function QuienSoy() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const choreographed = isDesktop && !reduced;

  const [params, setParams] = useState<QuienSoyParams>(
    DEFAULT_QUIEN_SOY_PARAMS,
  );
  const [progress, setProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement | null>(null);

  useTunePane({
    key: "quien-soy",
    label: "Quien-soy",
    order: 3,
    meta: QUIEN_SOY_PARAM_META,
    params,
    onChange: setParams,
  });

  useEffect(() => {
    if (!choreographed) return;
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    let listening = false;

    function computeProgress() {
      rafId = 0;
      const node = trackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const trackTop = rect.top + window.scrollY;
      const scrollableRange = node.offsetHeight - window.innerHeight;
      if (scrollableRange <= 0) return;
      const scrolled = window.scrollY - trackTop;
      const clamped = Math.min(1, Math.max(0, scrolled / scrollableRange));
      setProgress(clamped * (STATION_COUNT - 1));
    }

    function onScrollOrResize() {
      if (rafId) return;
      rafId = requestAnimationFrame(computeProgress);
    }

    function startListening() {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize);
      computeProgress();
    }

    function stopListening() {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // Only pay for the scroll listener while the track is anywhere near the
    // viewport — IntersectionObserver arms/disarms it, the listener itself
    // does the continuous progress→estación mapping.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) startListening();
          else stopListening();
        }
      },
      { threshold: 0 },
    );
    io.observe(track);

    return () => {
      io.disconnect();
      stopListening();
    };
  }, [choreographed]);

  return (
    <section
      id="quien-soy"
      aria-labelledby="quien-soy-title"
      className="text-hueso"
    >
      <h2 id="quien-soy-title" className="sr-only">
        Quién está del otro lado
      </h2>

      {choreographed ? (
        <div
          ref={trackRef}
          style={{ height: `${STATION_COUNT * 100}vh` }}
          className="relative"
        >
          <div className="sticky top-0 h-screen h-dvh overflow-hidden">
            {STATIONS.map((Station, index) => {
              const opacity = stationOpacity(
                index,
                progress,
                params.transitionThreshold,
              );
              const interactive = opacity > 0;
              return (
                <div
                  key={index}
                  inert={!interactive || undefined}
                  style={{
                    opacity,
                    transition: `opacity ${params.fadeMs}ms ease`,
                  }}
                  className="absolute inset-0"
                >
                  <Station />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <EstacionIntro />
          <EstacionDiseno />
          <EstacionConstruccion />
          <EstacionCalidad />
          <EstacionRemate />
        </>
      )}
    </section>
  );
}
