# Design — bl13-quien-soy

## D1 · Técnica de anclaje: CSS sticky + track de scroll, no scroll-jacking

Contenedor de altura `N × 100vh` (track) con un hijo `position: sticky; top: 0; height: 100vh` que renderiza la estación activa. El progreso se deriva de la posición de scroll dentro del track (IntersectionObserver + `scrollY` normalizado, o `animation-timeline: scroll()` donde esté disponible con fallback JS). **Nunca** se secuestra la rueda (`preventDefault` prohibido): el scroll nativo sigue siendo el motor, la sección solo mapea progreso → estación. Esto garantiza el escenario "liberación del ancla" y la accesibilidad de teclado gratis (PageDown/flechas funcionan porque el scroll es real).

- Rechazado: librerías de scroll-jacking (GSAP ScrollTrigger pin incluido) — dependencia nueva y riesgo de trap; el motion kit propio (F3) ya da keyframes + reveals y se extiende.
- Los umbrales de transición y duraciones se calibran con el patrón **`?tune`** existente (TunePanel), igual que F4T.

## D2 · Estructura de componentes

```
app/components/quien-soy/
  QuienSoy.tsx          — track + sticky + derivación de estación activa; variante apilada
  EstacionIntro.tsx
  EstacionDiseno.tsx
  EstacionConstruccion.tsx  (+ demo fichas → mini-web)
  EstacionCalidad.tsx       (+ demo sin alma / con alma)
  EstacionRemate.tsx
```

Los demos son autocontenidos con estado local (`useState`) — sin store global: nada fuera de la sección depende de ellos (misma decisión que BL-08 del tablero, mismo motivo: un toggle del demo no re-renderiza el resto).

La variante apilada (mobile/reduced) es el MISMO árbol sin track ni sticky: una prop/media query decide, no hay dos implementaciones. P1 shipea solo la variante apilada; P2 agrega el track por encima. Así P1→P2 es aditivo (criterio de reversa del contrato).

## D3 · Demos

- **Construcción**: la "mini-web" es un mock compuesto de primitivas propias (rects con tokens, sin iframe ni contenido real). Cada ficha define un layout objetivo; el armado es una secuencia de reveals escalonados (estructura → estilo → interacción) reutilizando los keyframes del motion kit. Fichas: `tomo pedidos por WhatsApp` · `doy turnos` · `vendo por Instagram` (copy final con Alan).
- **Calidad**: dos instancias del mismo mock de pieza (tarjeta de pedido) con la MISMA grilla (cero layout shift al conmutar). La versión "sin alma" no tiene estados hover/active/focus ni microanimaciones; la "con alma" tiene feedback en cada elemento. El toggle es un switch accesible (`role="switch"`).
- **Diseño**: derecha pitch de marca; izquierda la zona del selector de skins con las 3 marcas visibles como fichas estáticas (Faro Ámbar activa). El comportamiento de reskin llega en `bl16-skins`; mientras tanto las fichas inactivas no son interactivas (sin promesas rotas).

## D4 · Copy y assets

- Copy: se redacta ANTES de P1 desde la muestra de voz de Alan (16/07, Engram) + frases aprobadas; doc `docs/bl13-copy.md` con el texto final gateado por Alan. Prohibiciones del contrato aplican (ver proposal §Non-goals y backlog §TAREA-CONTRATO).
- Foto: la provee Alan (curación suya, tratamiento estilo ámbar). `next/image`, `alt` descriptivo, peso optimizado. Placeholder bloqueante: P1 no shipea sin foto real.

## D5 · Mapeo de entrega

| Paso | Contenido | Gate |
|---|---|---|
| P1 | Variante apilada completa: 5 estaciones full-viewport, copy final, foto, LinkedIn, demos como composición estática (Calidad fija en "con alma", Construcción con ficha default armada) | Alan revisa preview de rama → merge |
| P2 | Track + sticky + transiciones (`?tune`) + demos interactivos + a11y completa | Alan revisa preview → merge |

Fuera de este cambio: `bl16-skins` (reskin completo + galería/manual, gateado por las 2 direcciones estéticas de Alan).

## D6 · Verificación

Cada paso cierra con: `bun run build` + `next start` + Playwright CLI (patrón atómico): capturas desktop 1440 / mobile 375 / `reduced-motion`, consola limpia, y en P2 videos del recorrido completo + reversa + teclado. Reporte y assets en `docs/gate-bl13/`. Tax conocido: stale-build al rebuildear bajo server corriendo → `rm -rf .next` + rebuild + restart.
