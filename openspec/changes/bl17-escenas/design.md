## Context

La landing tiene: intro supernova canvas autoplay (`Intro.tsx`, función pura de progreso `p`, TUNING con fases), cielo permanente (`SkyLayer`), estrella-cursor con pulso y reveal por sección (`StarLayer.tsx`), 7 secciones DOM, y desde B1 un **motor único de scroll** (`app/components/motion/scrollEngine.ts`: Lenis singleton con refcount + ScrollTrigger registrado + `lenis.on('scroll', ScrollTrigger.update)`). No existe todavía ninguna escena scroll pineada.

La dirección está gateada y escrita en tres docs jerárquicos (guión → canon de assets → plan de operación) más la skill `pulsimus-escenas` (reglas técnicas) y el mapa de referencias (`docs/direccion/referencias.md`). Este design NO repite ese contenido: fija las decisiones técnicas transversales del build.

## Goals / Non-Goals

**Goals:**
- Convertir la landing en la película de scroll del guión, escena por escena (E0→E7), con gates HITL de Alan en boceto y en visual.
- Cada escena cumple el contrato del motor: pin/scrub sobre scrollEngine, umbral variable, transiciones dirigidas, mobile con la misma narrativa (forma libre), reduced-motion = pose final estática.
- Perf sostenida: las lecciones duras de las referencias (crashes por loops vivos) son requirements, no consejos.

**Non-Goals:**
- Quien-soy/BL-13 (cambio propio), skins/BL-16, galería/BL-14, Rive/BL-18 (candidato para piezas contenidas, jamás motor del sitio).
- Cablear el form del CTA al mail (deuda F5, prerequisito de mostrar el sitio, fuera de este cambio).
- Rediseñar scrollEngine (B1 cerrado; acá solo se consume).

## Decisions

- **D1 · Un timeline maestro por capítulo, no un pin por micro-momento** (lección Seed Journey): bloques narrativos contiguos comparten un timeline GSAP con labels; los Umbrales entre bloques mayores pueden cortar (el corte con identidad es legítimo ENTRE capítulos, la continuidad es obligatoria DENTRO).
- **D2 · E0 se revampea SOBRE el motor de `Intro.tsx` existente** — la coreografía es función pura de `p` con fases en TUNING: contar la escena 0 = re-secuenciar fases + sumar la viñeta tienda/escape como capas nuevas del mismo canvas, no reescribir el motor. El arco acreción→supernova→wordmark ya construido se conserva como clímax. Alternativa descartada: escena scroll pineada para E0 (la intro es autoplay pre-scroll por diseño; el guión lo respalda).
- **D3 · Color como narrador** (receta Artifex): mood por escena tweeneando 2–3 custom properties vía data-attributes + onEnter/onLeaveBack. El ámbar es recompensa de hitos ("la luz es ámbar" con mecanismo de ejecución).
- **D4 · Morph DOM por cambio de clase + delays escalonados** (receta Species) para E2 cards→asteroides: `clip-path: polygon` transicionado por CSS, la ola la dan `transition-delay: calc(var(--i) * Nms)`. Texto siempre DOM real legible.
- **D5 · Interacción con fallback de igual peso** (principio Lingo): en E2 el camino teclado/reduced/mobile es OTRA forma de ganarse la escena, nunca saltearla; tutorial just-in-time (el ícono de gesto aparece la primera vez que la mecánica existe). El foco jamás queda atrapado.
- **D6 · Reglas de perf como contrato** (evidencia: 6/6 referencias crashean): todo loop gateado por visibilidad (booleano que ScrollTrigger prende/apaga), todo lo scroll-driven se destruye al desmontar (`useGSAP` con scope, nunca `useEffect` plano), transform/opacity only, máx 2 decorativos por viewport.
- **D7 · Gates HITL por escena**: boceto (doc, sin código) → gate de Alan → build → Playwright sobre build de prod (desktop 1440 / mobile 375 / reduced; wheel POR PASOS además de scrollTo) → gate visual → commit. El working tree acumula a lo sumo UNA pieza en revisión. Composición visual la decide Alan (1 propuesta concreta y se frena).
- **D8 · Assets por tanda ANTES del build de cada escena**: los genera Alan (Higgsfield UI, canon vigente); el build no arranca con placeholders salvo que Alan lo apruebe en el boceto.

## Risks / Trade-offs

- [Perf acumulada al sumar escenas] → gates de visibilidad + presupuesto por viewport + verificación por escena sobre build de prod; si una escena baja FPS, se degrada ella, no el sitio.
- [Scope creep dentro de una escena] → el boceto gateado ES el alcance; cambios → actualizar plan de operación primero (regla 1 del contrato).
- [Saltos de scroll rompen scrub] → escenas como funciones de progreso (sin estado interno dependiente de deltas); tests con wheel por pasos.
- [Assets que no llegan] → el orden narrativo permite bocetar la escena siguiente mientras Alan genera; nunca se buildea sin assets gateados.
- [Mobile como afterthought] → la forma mobile se decide EN el boceto de cada escena (B3 decidido: misma narrativa, forma libre).

## Open Questions

- E2: ¿avance bloqueado hasta destruir o destrucción como recompensa? (se resuelve en el boceto de E2, con Alan).
- E4: ¿el ciclo de pedido se marca como punto de avance explícito? (boceto de E4).
- Candidato EKG: ¿el latido ligado al ritmo de scroll en sus 4 apariciones? (decidir con Alan cuando toque E1).
- Guión fino de quien-soy/CTA (revisables por Alan; E7 se boceta contra lo que haya).
