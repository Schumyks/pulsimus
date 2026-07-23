## Why

La landing dejó de ser una página de secciones: la dirección gateada por Alan (21/07, dos rondas — `docs/direccion/plan-operacion.md`) la convierte en una **película de scroll** que cuenta el guión canónico (`docs/direccion/guion-narrativo.md`): escenas full-viewport de umbral variable, intercaladas con las secciones, producidas en orden narrativo E0→E7. Es un cambio de arquitectura (supersede la "capa aditiva" del 18/07) con principio rector "lo nuevo manda". El motor técnico (B1, scrollEngine con Lenis + ScrollTrigger) ya está en `main`-adyacente (`0484124`); falta la obra: las escenas. Este cambio formaliza el ciclo de producción para que cada corrida tenga contrato ejecutable y verificación por task — la deuda declarada al cierre del 21/07.

Tarea-contrato madre: **BL-17** en [`docs/backlog.md`](../../../docs/backlog.md) (§ "Estrella narrativa a nivel sitio", pivote 21/07 "Arquitectura de escenas").

## What Changes

- **E0 · Intro supernova → escena 0 real**: revamp de `Intro.tsx` (hoy ~8s de acreción→supernova genéricos) para contar la escena 0 del guión: la tienda del protagonista, el colapso, el escape con el mostrador, el pulso naciendo. **BREAKING** respecto de la intro en producción (misma pieza, coreografía nueva).
- **E1 · Radar/zoom** (Hero se reencuadra): promesa + CTA quedan; transición Hero→Dolores = zoom al punto del radar. EKG aparición 2/4.
- **E2 · El cinturón** (Dolores se transforma/fusiona): la sección ES el campo de asteroides; cards → rocas con nombre tallado (copy vigente); **interacción destruir-para-avanzar** con fallback de igual peso (teclado/mobile/reduced).
- **E3 · Aterrizaje** (escena nueva pre-Mostrador): el descenso completo del protagonista con su nave — atmósfera → nubes FLAT regeneradas → toca tierra (dirección Alan 22/07).
- **E4 · Tienda dollhouse** (Mostrador se transforma): el ciclo de pedido se representa EN escena (alien pide → dueño recibe); supersede el demo standalone La Espiga.
- **E5 · Órbitas** (Proceso se transforma): mitades espejadas cielo/tierra + beat de crecimiento — entran más objetos en órbita (dirección Alan 22/07).
- **E6 · Mission control** (Tablero se reencuadra): la maquinaria queda; envoltorio caos→orden; levemente interactivo (acciones del visitante avanzan el proceso en la tienda) y aloja el switch de skins de BL-16 (dirección Alan 22/07). EKG 3/4.
- **E7 · Constelación** (CTA se reencuadra): "mandá tu señal". EKG 4/4.
- **Ciclo de producción con gates HITL**: por escena, boceto de dirección → gate de Alan → build → verificación Playwright (prod build, desktop/mobile/reduced) → gate visual → commit. Ninguna escena avanza sin gate de la anterior.
- Quien-soy (BL-13) se muda a PÁGINA APARTE linkeada desde el nav (dirección Alan 22/07); ese build sigue en `bl13-quien-soy`, NO acá. Sus demos se redistribuyen dentro del viaje (skin switch → E6; fichas Construcción → candidato E4/E5; toggle Calidad → a decidir).

## Capabilities

### New Capabilities
- `motor-escenas`: contrato técnico que toda escena debe cumplir sobre el scrollEngine de B1 — pin/scrub con umbral variable, gates `matchMedia` (desktop/mobile/reduced), transiciones dirigidas escena↔sección (nunca corte seco), gate de visibilidad en todo loop, destrucción al desmontar, presupuesto de capas.
- `escenas-narrativas`: las 8 escenas E0–E7 como requirements con escenarios — qué momento del guión cuenta cada una, destino de su sección afectada, forma mobile/reduced, e interacciones propias (E2 destruir-para-avanzar, E4 ciclo de pedido en escena).

### Modified Capabilities
<!-- ninguna: openspec/specs/ está vacío; bl13-quien-soy aún no sincronizó su spec -->

## Impact

- **Código**: `app/components/Intro.tsx` (revamp E0), `app/components/motion/scrollEngine.ts` (consumo, no rediseño), `app/page.tsx` y las secciones `Hero/Dolores/Mostrador/Proceso/Tablero/CTA` (transformación o reencuadre según destino), `app/globals.css` (keyframes idle), `public/space/` (assets nuevos por tanda, los genera Alan en Higgsfield UI según `docs/direccion/canon-assets.md`).
- **Dependencias**: ya presentes (gsap, @gsap/react, ScrollTrigger, lenis). Sin dependencias nuevas.
- **Fuentes de verdad**: guión (`docs/direccion/guion-narrativo.md`) · plan de operación (`docs/direccion/plan-operacion.md`) · canon de assets (`docs/direccion/canon-assets.md`) · skill `pulsimus-escenas` (reglas técnicas) · mapa de referencias (`docs/direccion/referencias.md`).
- **Riesgos**: perf (evidencia dura: los 6 sitios de referencia crashean — mitigado por reglas de la skill); scope creep por escena (mitigado por boceto+gate antes de codear); assets bloqueantes (mitigado: Alan genera por tanda antes del build de cada escena).
