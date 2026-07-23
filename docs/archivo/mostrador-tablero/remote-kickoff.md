# F4T · Kickoff remoto (ejecutable desde el celular)

> **Versión portátil de "ejecutá F4T".** Igual que se ejecutó F4R, pero pensado para
> dispararse desde el celular sin tipear el plan entero. El QUÉ vive en la spec/plan;
> esto es solo el disparador + el setup de un entorno remoto fresco.

## Cómo dispararlo desde el celular

1. Abrí **claude.ai/code** (o la app de Claude con Code) desde el navegador del celular.
2. Conectá el repo **`Schumyks/pulsimus`**, rama base **`f4-mostrador`**.
3. Decile, literal:
   > **"Leé `docs/F4T-remote-kickoff.md` y ejecutalo de punta a punta. Frená solo en el gate."**

Eso es todo lo que tipeás. El resto lo maneja el agente.

## Setup del entorno (sandbox nuevo — HACER PRIMERO)

Un sandbox en la nube arranca vacío (a diferencia de mi máquina local):

- `npm install`
- **Playwright**: `npx playwright install chromium` (el sandbox NO trae el chromium cacheado).
- Verificá que arranca antes de tocar nada: `npx tsc --noEmit` y `npx next build` en verde.
- **Engram** (memoria) puede NO estar disponible en remoto/headless. Si `mem_*` falla:
  seguí con `docs/STATE.md` como fuente de verdad y anotalo en el reporte del gate.

## Bootstrap

- **Rama**: creá **`f4-tablero`** desde `f4-mostrador` (F4T se apila sobre F4R).
- **Contexto** (leer en orden): `docs/STATE.md` · spec **§4** en `docs/f4r-f4t-design-spec.md`
  · plan **§5** en `docs/f4r-f4t-plan.md`. El detalle está ahí; no lo repito acá.
- Si **NO** corrés en Fable: adoptá el ciclo `modo-fable` (verificar estado real antes de
  planificar · marcar nivel de certeza · anomalía→causa raíz · delegar EJECUCIÓN no
  criterio · cerrar loops · sellar estado al final).
- F4T se puede construir **sin esperar** el gate F4R de Alan (es una sección nueva;
  reconcilia al mergear). **NO mergear a `main`** — es decisión exclusiva de Alan.

## La tarea: F4T (El tablero) — plan §5, fases T1–T5

- **T1 · Agregaciones + período** → SUBAGENTE Sonnet. Extiende `app/lib/demo/` (ventana
  global `today|week|month` + selectores por panel + deltas vs. período anterior).
  Revisá las 2 decisiones que R1 dejó marcadas en `selectors.ts`/reporte (ventanas
  RODANTES vs. calendario; stock período-agnóstico). DoD: `tsc` + invariantes extendidos
  (los 6 paneles cierran entre sí en los 3 períodos).
- **T2 · Shell + coreografía de carga + toggle** → DIRECTOR. `Tablero.tsx` entre
  `#mostrador` y Proceso, fondo noche, `PeriodToggle` (fila única arriba — **jamás**
  filtros por card), coreografía §4.4 (stagger de marcos → llenado por naturaleza del
  dato → puntuación al final; IntersectionObserver una vez).
- **T3 · Paneles** → FAN-OUT de **3 SUBAGENTES Sonnet** (paralelos, archivos disjuntos).
  **ANTES del fan-out**: invocá la skill `dataviz` y **VALIDÁ la paleta** con su
  `validate_palette.js` (modo dark, superficie noche `#1B2140`); pasá los hex validados
  en los briefs. T3a colas (Reservas por confirmar + Retiros) · T3b charts (Ventas +
  Horas + Pagos con switch barra↔donut) · T3c KPIs (día de un vistazo + ganancia con
  desglose `bruto − moms − costos`).
- **T4 · Integración + tune + responsive** → DIRECTOR (grid fila-ancha+3+2; mobile
  apilado; eco Reservas→mostrador verificado; params de coreografía en `?tune`).
- **T5 · Verificación + gate** → DIRECTOR. Playwright (build de PROD): la carga anima al
  entrar al viewport · un pedido arriba mueve los números abajo · **confirmar reserva →
  eco al mini-dashboard del mostrador** · toggle 3 períodos re-renderiza coherente · morph
  barra↔donut · reduced-motion · mobile. Assets → `docs/gate-f4t/` + `report.md` (h2/sub
  del tablero **a veredicto de Alan**). Commit por fase · push `f4-tablero` · STATE +
  backlog + Engram (si está).

## Bloque ejecutor (pegar VERBATIM al final de CADA brief de subagente)

> - Ante ambigüedad o contradicción con la spec: devolvé la pregunta en tu reporte, NO inventes.
> - No toques archivos fuera de tu contrato. Si creés que hace falta, reportalo en vez de hacerlo.
> - Verificá tu DoD ANTES de reportar y pegá el output del comando de verificación. "Debería funcionar" no es un estado.
> - Anomalía (warning raro, output inesperado) → reportala con causa probable, no la tapes.
> - Reporte final: qué hiciste · qué verificaste (con evidencia) · qué quedó afuera y por qué · nivel de certeza de cada afirmación.

## Lecciones de F4R (para no repagar)

- Un subagente que escribe un MÓDULO entero + self-verifica ≈ **150–175k tokens** (no 90k).
  El **DIRECTOR es el costo dominante** en fases de verificación pesada (~65% del total) →
  presupuestá la ventana de cuota en consecuencia (F4T ≈ un bloque Heavy, una ventana).
- **eslint React Compiler**: sin `useRef` mutado en render, sin `setState` sincrónico en
  efecto → usá callbacks (rAF/timeout) o `eslint-disable` justificado (gates client-only).
- **Stale-build**: si el browser da `<html id="__next_error__">` tras un rebuild →
  `rm -rf .next` + rebuild + reiniciar el server (curl puede engañarte y verse bien).
- **Playwright CLI**: overhead ~0.5–1s por comando → asserts de timing dentro de un solo
  `run-code`. Saltá la intro con `sessionStorage.setItem('px-intro-seen','1')` en `addInitScript`.
- **Motion**: construir con defaults + `?tune`; los valores se congelan en el gate. No
  iterar timings por descripción.
