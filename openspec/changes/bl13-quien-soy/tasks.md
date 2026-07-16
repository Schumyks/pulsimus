# Tasks — bl13-quien-soy

## 0. Copy y assets (bloqueante de P1)

- [ ] 0.1 **[HITL]** Redactar `docs/bl13-copy.md`: las 5 estaciones completas en la voz de Alan
      (fuente: muestra de voz 16/07 en Engram + frases aprobadas del contrato; aplicar las
      prohibiciones: sin em dashes, jerga, Disney, geografía, terceros, superlativos, tono creído).
      Verificación: Alan aprueba el doc (última iteración de texto).
- [ ] 0.2 **[HITL]** Alan entrega la foto real elegida; producir la versión tratada (estilo ámbar)
      optimizada para `next/image`. Verificación: peso < 150 KB, se ve bien en 1440 y 375.

## 1. P1 — Estructura apilada (shippeable)

- [x] 1.1 Crear `app/components/quien-soy/` con `QuienSoy.tsx` (variante apilada) + las 5
      estaciones full-viewport según design D2; copy desde `docs/bl13-copy.md`, foto + LinkedIn
      en Intro. Verificación: `bunx tsc --noEmit` + `bun run lint` limpios.
- [x] 1.2 Demos como composición estática: Construcción con ficha default y mini-web armada;
      Calidad fija en "con alma"; Diseño con pitch + fichas de marca estáticas (D3).
      Verificación: ninguna promesa interactiva rota (nada clickeable que no haga nada).
- [x] 1.3 Integrar en `app/page.tsx` entre Proceso y `#contacto`. Verificación: el orden del
      flujo es Proceso → #quien-soy → #contacto en el DOM.
- [x] 1.4 Gate P1 sobre build de PROD: capturas desktop/mobile/reduced, consola e hidratación
      limpias, sin overflow horizontal en 375, reporte en `docs/gate-bl13/`. Verificación:
      escenarios del spec "Fallback apilado", "Intro", "Remate" en verde.
- [ ] 1.5 **[HITL — gate de Alan]** Push de rama `bl13-quien-soy`, preview Vercel, veredicto de
      Alan. Solo él mergea a main.

## 2. P2 — Coreografía + demos interactivos

- [ ] 2.1 Track + sticky + derivación de estación activa (D1), transiciones entre estaciones con
      parámetros expuestos en `?tune`. Verificación: avance 1→5, reversa 5→1, liberación del
      ancla al final (escenarios "Coreografía anclada").
- [ ] 2.2 Demo Construcción interactivo: fichas conmutables, armado animado por necesidad, una
      activa a la vez. Verificación: escenarios "Armado a medida" + "Estado inicial".
- [ ] 2.3 Demo Calidad interactivo: switch sin alma/con alma, cero layout shift, feedback en cada
      elemento de la versión con alma. Verificación: escenario "Sentir la diferencia".
- [ ] 2.4 Accesibilidad: teclado end-to-end (sin trap), `aria` en fichas/switch, foco visible.
      Verificación: escenario "Navegación por teclado" recorrido manual + Playwright.
- [ ] 2.5 Gate P2 sobre build de PROD: todo lo de 1.4 + videos del recorrido (ida/vuelta/teclado)
      + verificación reduced-motion (demos en estado final, sin autoplay). Reporte en
      `docs/gate-bl13/`. Verificación: TODOS los escenarios del spec en verde.
- [ ] 2.6 **[HITL — gate de Alan]** Preview, veredicto, merge de Alan. Calibración: registrar
      tokens/tiempo reales del paso en `~/.claude/skills/estimate/references/calibration.md`.

## 3. Cierre del cambio

- [ ] 3.1 Actualizar `docs/STATE.md` + `docs/backlog.md` (BL-13 → shipeado; BL-16/BL-14 quedan
      como cambio futuro `bl16-skins`). Verificación: STATE sellado con fecha.
- [ ] 3.2 `openspec archive bl13-quien-soy` para promover el spec delta a `openspec/specs/`.
      Verificación: `openspec list --specs` muestra `seccion-quien-soy`.
