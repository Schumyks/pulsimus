---
name: pulsimus-escenas
description: >-
  Usar SIEMPRE al construir, animar o revisar escenas scrollytelling de la
  landing Pulsimus — pin/scrub, umbrales, transiciones escena↔sección,
  parallax, reveals, timing/coreografía, o cualquier motion ligado al scroll.
  Combina el criterio de coreografía (12 principios aplicados a scroll) con
  las recetas GSAP ScrollTrigger del stack, más las reglas y gotchas propios
  del proyecto.
---

# Escenas Pulsimus — coreografía + motor de scroll

Destilado de `dylantarre/animation-principles@scroll-animations` (criterio) y
`github/awesome-copilot@gsap-framer-scroll-animation` (técnica, autor Utkarsh
Patrikar; referencia GSAP completa copiada en [`referencia-gsap.md`](referencia-gsap.md)),
adaptado al stack y la dirección de Pulsimus.

## 1 · Jerarquía de fuentes (leer antes de construir)

1. [`docs/bl17-guion-narrativo.md`](../../../docs/bl17-guion-narrativo.md) — QUÉ cuenta cada escena (§ Arquitectura de escenas: mapa E0–E7, umbral variable, timing por momento).
2. [`docs/canon-assets-higgsfield.md`](../../../docs/canon-assets-higgsfield.md) — CÓMO se ven los assets.
3. Esta skill — CÓMO se mueve todo.

## 2 · El motor (decisión cerrada)

**GSAP ScrollTrigger + Lenis. Nunca Framer Motion** (un solo motor de
animación; ScrollTrigger es superior para pin+scrub narrativo y ya está en el
stack — `StarLayer.tsx` usa gsap.ticker + Lenis).

- React: `useGSAP` de `@gsap/react` con `{ scope }` — NUNCA `useEffect` plano
  (useGSAP auto-mata los ScrollTriggers al desmontar y sobrevive strict mode).
- `gsap.registerPlugin(ScrollTrigger)` antes de todo uso, en cliente.
- **Un solo Lenis para todo el sitio.** Hoy vive dentro de `StarLayer.tsx`;
  al introducir ScrollTrigger hay que extraerlo a un módulo único y cablear
  `lenis.on('scroll', ScrollTrigger.update)` — sin eso el pin/scrub tiembla.
- `scrub` ⇒ `ease: 'none'` SIEMPRE (easing con scrub se siente roto).
- `markers: true` solo en dev; jamás llega a un commit.
- Gates responsive/motion con `gsap.matchMedia()` (desktop / mobile /
  `prefers-reduced-motion: reduce`), coherentes con StarLayerGate.

### Patrón base de escena (pin + scrub)

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "+=250%",        // = cuánto scroll dura la escena (su TIMING)
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.from(".escena-cuerpo", { opacity: 0, y: 60 })
    .from(".escena-detalle", { scale: 0.85, opacity: 0 }, "-=0.3");
}, { scope: sectionRef });
```

El `end: '+=N%'` ES el timing de la escena: una escena clave merece 200–300%;
una transición breve, 60–100%. Nunca scrub largo sin pin (el elemento se va
del viewport a mitad de animación).

## 3 · Coreografía (los principios, aplicados)

- **Poses:** toda escena define estado OCULTO y estado REVELADO; el scroll
  interpola entre poses. Nada "aparece": todo llega.
- **Anticipación:** disparar con el elemento 10–20% visible, que la entrada
  termine antes de estar centrado.
- **Staging:** revelar en orden de lectura (arriba→abajo, izq→der).
- **Stagger:** elementos hermanos escalonados (primero al 20% del viewport,
  siguiente al 25%…) — 0.1–0.15s entre cards.
- **Ease-out para reveals** (el contenido "asienta"); parallax SIEMPRE lineal.
- **Timings de referencia:** reveal 400–600ms · sticky/transición 200–300ms ·
  parallax y progreso: tiempo real.
- **Sutileza:** el scroll es del usuario — la velocidad de scroll ES la
  exageración; la animación premia la exploración, jamás la obstruye.
- **Solid drawing:** nada salta ni teletransporta; interpolación suave en
  TODA posición de scroll (probar scrolleando lento, rápido y hacia atrás).
- **Impacto ≠ duración:** el impacto de una escena viene del contraste
  (quietud→explosión, oscuridad→luz ámbar), no de alargarla.

## 4 · Reglas duras de la casa

- Animar SOLO `transform` y `opacity` (GPU); jamás width/height/top/left/
  box-shadow/filter en loops. `will-change` con cuentagotas.
- `prefers-reduced-motion: reduce` ⇒ página continua estática: escenas en su
  pose final, sin pin, sin parallax. Mobile: sin cielo protagonista (gates
  actuales) hasta que se decida la versión mobile de las escenas.
- **Z-map del sitio:** canvas cielo `-z-10` → nebulosas `-z-10` (post-canvas
  en DOM) → contenido → StarLayer `z-40` → overlays de escena `z-[45]` →
  header `z-50`.
- Presupuesto: máx 2 elementos decorativos por viewport; el contenido SIEMPRE
  gana el contraste.
- Parallax in-flow: SIEMPRE con clamp (±110–160px) — sin clamp, una pieza
  lejos del centro del viewport invade las secciones vecinas.
- Máscaras radiales sobre plates rectangulares: el gradiente mide hasta la
  ESQUINA (farthest-corner) — el fade debe morir ≤72% o el borde recto se ve.
- Glow NUNCA horneado en el asset: se recorta y se re-crea en CSS
  (radial/`drop-shadow` ámbar #F2A63E) — así puede LATIR.
- Verificación: SIEMPRE Playwright sobre build de prod (gotcha Turbopack/
  inotify), con pasadas mobile (375) y reduced-motion además de desktop.
- TODO loop por-frame (canvas, partículas, blobs) va gateado por visibilidad:
  un booleano que ScrollTrigger onEnter/onLeave prende y apaga, chequeado
  antes de calcular nada (patrón Artifex — bl17-referencias-analisis.md).
- Todo lo scroll-driven se DESTRUYE al desmontar (contraejemplo real: Seed
  Journey acumula 190+ errores de state machines vivos tras navegar).

## 5 · Pitfalls que ya nos mordieron (no repetir)

- sharp: round-trip raw de 1 canal devuelve otro layout — procesar alpha a
  mano (ver Engram obs 350).
- `scrollIntoView` en Playwright es poco determinista tras wheels — medir
  layout y usar `window.scrollTo` directo.
- Copilot/LLM olvidan `registerPlugin`, usan easing con scrub, dejan
  `markers: true`, y escriben `end` estático para horizontal scroll (usar
  función: `end: () => …` para que recalcule en resize).
- En tests Playwright de escenas, scrollear con wheel POR PASOS además de
  `scrollTo` directo: los saltos grandes de posición rompen motores de scrub
  (crashes reproducidos en 5/6 sitios de referencia analizados).
- Tras CADA `bun run build`, reiniciar el `next start` local que siga corriendo
  (`fuser -k 3199/tcp` + relanzar): un server viejo sobre un `.next`
  reemplazado sirve chunks rotos y las capas interactivas (cielo / estrella /
  pulso) mueren en silencio, sin error visible (nos pasó el 21/07).

## 6 · Checklist por escena (antes de darla por hecha)

1. ¿Qué momento del guión cuenta? (E0–E7; si no está en el guión, no existe.)
2. Tamaño del umbral/escena decidido por su peso narrativo (vh + `end`).
3. Poses oculta/revelada definidas; transición de ENTRADA y de SALIDA
   dirigidas (escena↔sección, nunca corte seco).
4. Reduced-motion y mobile resueltos (aunque sea "no existe en mobile").
5. Presupuesto de capas respetado; texto siempre legible.
6. Verificada en build de prod con Playwright (lento/rápido/atrás) +
   screenshots.
7. Gate de Alan antes de commitear la escena como definitiva.
