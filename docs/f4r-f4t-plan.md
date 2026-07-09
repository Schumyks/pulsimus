# Plan de implementación · F4R + F4T

> **Para ejecutar en sesión nueva.** Spec de diseño (fuente de verdad del QUÉ):
> [`f4r-f4t-design-spec.md`](f4r-f4t-design-spec.md). Este doc es el CÓMO: fases,
> briefs de subagentes, verificación, presupuesto. Aprobado por Alan el 2026-07-09.

## 0 · Bootstrap de la sesión ejecutora

1. `/apertura` (o mínimo: leer `docs/STATE.md`, la spec y este plan; `git status -sb`).
2. Engram: `project=agencia` en toda llamada. Guardar decisiones/gotchas al vuelo.
   Si la sesión no corre en Fable: invocar `modo-fable` antes de arrancar.
3. Ramas: **F4R sobre `f4-mostrador`** (ya rebasada sobre main @ 45f7834+) ·
   **F4T sobre `f4-tablero`** (se crea desde `f4-mostrador` al cerrar F4R).
4. Ejecutar **F4R y F4T en sesiones/ventanas de cuota SEPARADAS** (ver §Estimates:
   cada una es Heavy por sí sola).

## 1 · Reglas duras

- **`main` = PRODUCCIÓN** (auto-deploy a pulsimus.vercel.app). JAMÁS commitear/mergear
  a main. Todo en ramas; push de rama = preview protegido (solo Alan lo ve; el agente
  verifica en LOCAL).
- **Gates asincrónicos**: al cerrar cada fase, capturar assets (GIF/video/screenshots
  vía Playwright) a `docs/gate-f4r/` / `docs/gate-f4t/` + `report.md`. Alan revisa
  cuando puede; NO bloquear esperando.
- **Motion con defaults + panel `?tune`**: construir con timings razonables; Alan tunea
  a mano en el gate (panel dev, patrón F3); los valores se congelan después y el panel
  se borra. NO iterar timings por descripción.
- **Assets**: solo la curación de Alan (`public/la-espiga/`). Nada de imágenes nuevas.
- **Copy**: micro-copy nuevo en voz de marca (ES voseo); h2/sub del tablero van
  marcados "a veredicto de Alan" en el report del gate.
- **Artefactos de código en inglés** (identificadores, comentarios); UI copy en ES.
- **Dataviz (F4T)**: invocar la skill `dataviz` ANTES de codear charts; validar la
  paleta con su `validate_palette.js` (modo dark, superficie noche `#1B2140`).

## 2 · Modelo de delegación

- **Director** (la sesión, en su modelo — Fable u Opus): mantiene el contrato del store,
  escribe los briefs, integra, corre la verificación, captura gates, commitea, y ejecuta
  él mismo las fases marcadas DIRECTOR (R4 motion es la única de confianza baja: no se
  delega). NO delega la verificación final. Si la sesión NO corre en Fable, invocar la
  skill `modo-fable` en el bootstrap antes de delegar.
- **Subagentes** (Agent tool, general-purpose, **`model: sonnet`**): 1 tarea = 1 subagente
  con brief cerrado. Sonnet es deliberado: los briefs vienen masticados (spec exacta,
  paths fijos, DoD verificable) y TODA la calibración del §Estimates es data real de
  subagentes Sonnet en este repo — correrlos en Opus rompe el presupuesto sin ganancia
  proporcional. **Escalada**: si una tarea vuelve floja (candidata: T3b, la más fina),
  re-correr ESA tarea en Opus; no subir el plan entero de categoría.
  Cada brief incluye: qué LEER (spec §, archivos), qué TOCAR (paths exactos — sin
  colisiones entre subagentes paralelos), DoD, y el comando de verificación local.
- **Bloque ejecutor** (disciplinas modo-fable destiladas para ejecutores — pegar
  VERBATIM al final de cada brief de subagente; un subagente no hereda nada solo):
  > - Ante ambigüedad o contradicción con la spec: devolvé la pregunta en tu reporte,
  >   NO inventes una interpretación.
  > - No toques archivos fuera de tu contrato. Si creés que hace falta, reportalo
  >   en vez de hacerlo.
  > - Verificá tu DoD ANTES de reportar y pegá el output del comando de verificación.
  >   "Debería funcionar" no es un estado.
  > - Anomalía (warning raro, output inesperado) → se reporta con causa probable,
  >   no se tapa.
  > - Reporte final: qué hiciste · qué verificaste (con evidencia) · qué quedó
  >   afuera y por qué · nivel de certeza de cada afirmación.
- El director aplica su lado del protocolo con `modo-fable` (§0); para la plantilla
  completa de delegación y el QA del trabajo delegado: `~/.claude/skills/modo-fable/delegacion.md`.
- Calibración conocida (log del 03-04/07): **~70–90k tokens por subagente** que lee
  spec + componentes de referencia. Presupuestar el overhead del director aparte.
- Subagentes paralelos SOLO si no comparten archivos (está diseñado así abajo).
- `AGENTS.md` manda: **leer `node_modules/next/dist/docs/` antes de tocar código Next**
  (este Next 16 tiene breaking changes) — cada subagente lo tiene que saber.

## 3 · Contrato de archivos (fijo — evita colisiones)

```
app/lib/demo/                  ← F4R-1 (store)
  products.ts  names.ts  economics.ts  seeds.ts  store.ts  hooks.ts
app/components/mostrador/      ← F4R
  ProductCard.tsx (steppers)   DraftTicket.tsx   AutofillForm.tsx
  Envelope.tsx (pliegue+FLIP)  PaymentMoment.tsx
  OwnerPanel.tsx  BizStrip.tsx  Ticket.tsx  TicketModal.tsx
app/components/Mostrador.tsx   ← orquesta (director)
app/components/tablero/        ← F4T
  PeriodToggle.tsx  ReservationsQueue.tsx  PickupsPanel.tsx
  SalesPanel.tsx  HoursPanel.tsx  SummaryPanel.tsx  PaymentsPanel.tsx
app/components/Tablero.tsx     ← orquesta (director)
app/components/dev/TunePanel.tsx ← genérico multi-param (se borra al congelar)
app/globals.css                ← keyframes px-* (SOLO director, evita conflictos)
```

## 4 · F4R — El mostrador reformado (rama `f4-mostrador`)

### R1 · Store de la demo — SUBAGENTE (arranque barato e independiente)
- **Lee**: spec §2 completa. **Toca**: `app/lib/demo/*`.
- Modelo `Product`/`Order`/`OrderStatus` textual de la spec · pool de nombres AR/DK ·
  economía canónica (moms = bruto×0.20; ganancia = facturado − moms − costos) ·
  seeds deterministas del día (~14 órdenes, pico 11:00, estados mixtos, 2 reservas
  pendientes + 1 confirmada) · agregados históricos para Semana/Mes y deltas ·
  store `useSyncExternalStore` (subscribe/getSnapshot/actions: `placeOrder`,
  `confirmReservation`) · selectores por período (Hoy/Semana/Mes: totales, buckets
  hora/día/semana, split de pago, stock por tanda).
- **DoD**: `npx tsc --noEmit` verde · script de invariantes (`npx tsx`) verde:
  cobrado+aCobrar=facturado · ganancia cierra con la fórmula · seeds idénticos en
  2 corridas (determinismo SSR) · stock nunca negativo.

### R2 · Lado cliente: armar el pedido — SUBAGENTE (paralelo con R3)
- **Lee**: spec §3.1 pasos 1–2 · `ProductCard.tsx` actual · store R1. **Toca**:
  `mostrador/ProductCard.tsx`, `mostrador/DraftTicket.tsx`.
- Steppers `[− n +]` (desde 0, a11y: aria + teclado) · ticket borrador pálido/punteado
  al pie con items+total en vivo · botón "Confirmar pedido" → expone callback; el
  momento de pago lo integra R4 (NO lo construye R2).
- **DoD**: tsc verde · render con store real · reduced-motion sin animación de entrada.

### R3 · Lado dueño: mini-dashboard — SUBAGENTE (paralelo con R2)
- **Lee**: spec §3.2 · `Ticket.tsx` actual (patrón grid-rows para el print-in) · store R1.
  **Toca**: `mostrador/OwnerPanel.tsx`, `BizStrip.tsx`, `Ticket.tsx`, `TicketModal.tsx`.
- Franja `HOY · pedidos · facturado · cobrado / a cobrar` (contadores animados, SIN
  ganancia) · lista scrolleable acumulativa (altura fija, fades, sin cap, badge total) ·
  ticket compacto con 3 estados · modal de detalle (focus trap, Esc, tap afuera) ·
  reacciona a `confirmReservation` (eco: badge se actualiza).
- **DoD**: tsc verde · seeds visibles SSR (sin JS se ve completo) · modal accesible.

### R4 · Cadena de motion: pago → form → sobre → viaje → impresión — DIRECTOR
La pieza más difícil; queda en el director (calidad de motion + integración fina).
- Momento de pago en el DraftTicket ("Pagar ahora" estilo propio / "Pago al retirar") ·
  teatro de pago (pulso ámbar borde, "Procesando…"→"✓ Pagado N kr.") · form que se
  autorellena tipeándose (datos del cliente generado) · pliegue a sobre (canto ámbar)
  · FLIP al OwnerPanel (easing de la intro; mobile: hacia abajo) · aterrizaje →
  print-in del Ticket. Reserva = mismo camino SIN teatro de pago.
- Keyframes en `globals.css` (namespace px-) · `TunePanel` genérico con los params de
  spec §5 · reduced-motion: orden aparece directa en la lista.
- **DoD**: flujo completo a mano en local · tsc/eslint verdes · reduced-motion OK.

### R5 · Integración + pulido responsive — DIRECTOR
`Mostrador.tsx` orquesta todo · **latido SANO** (spec §3.3: ~60-70bpm sutil, mismo
lenguaje del latido enfermo de Dolores, keyframes px- en globals.css, params en
`?tune`) · mobile apilado (sobre viaja hacia abajo) · pass de a11y (labels, focus,
contraste AA en badges de estado) · `npm run build` verde.

### R6 · Verificación + gate — DIRECTOR
- Playwright (build de producción): armar 2 productos → pagar ahora → sobre → ticket
  `✓ Pagada` + franja actualizada · reserva → `Reserva · pendiente` · cap∅/scroll ·
  modal abre/cierra · `confirmReservation` desde consola → eco en badge ·
  reduced-motion · mobile 375px · determinismo SSR (2 loads = mismos seeds).
- Capturar GIF/video desktop+mobile, screenshots → `docs/gate-f4r/` + `report.md`
  (decisiones del director + copy a veredicto + link preview + params `?tune`).
- Commit por fase (conventional commits) · push rama · actualizar STATE + backlog
  (BL-02 → resuelto, referencia a la spec) + brief §4/§5 (spec §8) · Engram save.

## 5 · F4T — El tablero (rama `f4-tablero`, desde `f4-mostrador`)

### T1 · Agregaciones + período — SUBAGENTE
- **Lee**: spec §2 y §4.2 · `app/lib/demo/` real. **Toca**: `app/lib/demo/` (extiende;
  única excepción de colisión — F4T arranca cuando R está cerrado).
- Ventana global `'today'|'week'|'month'` en el store · selectores por panel/período
  (tabla de spec §4.2) · deltas vs. período anterior desde los agregados históricos.
- **DoD**: tsc + invariantes extendidos (los números de los 6 paneles cierran entre sí
  en los 3 períodos).

### T2 · Shell + coreografía de carga + toggle — DIRECTOR
`Tablero.tsx` entre `#mostrador` y Proceso · fondo noche · `PeriodToggle` (fila única
arriba — jamás filtros por card) · coreografía §4.4 (marcos stagger ~90ms → llenado por
naturaleza → puntuación al final; IO una vez; deltas después animan solo su delta;
cambio de toggle re-cuenta corto; reduced-motion: todo lleno).

### T3 · Paneles — FAN-OUT de 3 SUBAGENTES (paralelos, sin colisión)
> Antes del fan-out el director invoca la skill `dataviz` y VALIDA la paleta
> (`validate_palette.js`, modo dark, superficie `#1B2140`); pasa los hex validados
> en los briefs. Reglas para los 3: un solo hue para magnitud, pico/énfasis en ámbar,
> ⚠ estado con ícono+texto, direct labels (el valor se lee sin hover), texto en
> tokens de texto, marcas finas, grid hairline, sin torta para magnitudes.
- **T3a · Colas**: `ReservationsQueue.tsx` (fila ancha: detalle compacto + botón
  "Confirmar reserva" → `confirmReservation` → sello ✓ + contador pendientes) +
  `PickupsPanel.tsx` (agenda HH:MM; "próximos" en Semana/Mes).
- **T3b · Charts**: `SalesPanel.tsx` (barras + `quedan N de M` + ⚠ solo en Hoy) ·
  `HoursPanel.tsx` (barras hora/día/semana según período, pico ámbar) ·
  `PaymentsPanel.tsx` (cobrado/a-cobrar + split método · **switch `[▤|◔]`** barra
  apilada ↔ donut con morph animado).
- **T3c · KPIs**: `SummaryPanel.tsx` (KPI row + delta vs. período + ganancia estimada
  con desglose `bruto − moms − costos`; conteo animado).
- **DoD c/u**: tsc verde · los 3 períodos renderizan · reduced-motion OK.

### T4 · Integración + tune + responsive — DIRECTOR
Grid (fila ancha + 3 + 2; mobile apilado) · eco Reservas→mostrador verificado ·
params de coreografía en `TunePanel` · build verde.

### T5 · Verificación + gate + docs — DIRECTOR
- Playwright: carga anima al entrar al viewport · pedido arriba mueve números abajo ·
  confirmar reserva → eco arriba · toggle 3 períodos re-renderiza TODO coherente ·
  morph barra↔donut · reduced-motion · mobile.
- Assets → `docs/gate-f4t/` + `report.md` (h2/sub del tablero A VEREDICTO) ·
  STATE + Engram · la rama queda esperando gate; **merge a main = SOLO Alan**.

## 6 · Estimates (calibrado con log real F1–F4 de este repo)

| Fase | Tokens | Wall-clock | Conf. | Driver |
|------|--------|-----------|-------|--------|
| R1 store | ~130–180k | ~12–18 min | alta | subagente ~90k + director brief/verify |
| R2+R3 paralelo | ~290–400k | ~20–30 min | alta | 2 subagentes ~90k c/u + integración |
| R4 motion (director) | ~220–350k | ~30–45 min | **baja-media** | iteración de motion, 2-3 build loops |
| R5 integración | ~60–110k | ~8–12 min | media | 1 build loop |
| R6 verificación+gate | ~120–200k | ~25–35 min | alta | Playwright+capturas es lento en reloj, no en tokens |
| **F4R total** | **~820k–1.24M** | **~1.6–2.3 h** | media | |
| T1 agregaciones | ~110–160k | ~10–15 min | alta | subagente + invariantes |
| T2 shell+coreografía | ~130–200k | ~15–25 min | media | motion de carga, tune |
| T3 fan-out ×3 | ~280–400k | ~20–30 min | alta | 3×~90k + briefs (regla F2: nunca el extremo optimista en fan-outs) |
| T4 integración | ~80–130k | ~10–15 min | media | eco + grid + 1-2 loops |
| T5 verificación+gate+docs | ~140–220k | ~25–35 min | alta | idem R6 + updates de docs |
| **F4T total** | **~740k–1.11M** | **~1.4–2 h** | media-alta | |
| **TOTAL** | **~1.56–2.35M** | **~3–4.3 h** | media | |

**Más caras**: R4 (motion a pulso, la única con confianza baja) y los fan-outs.
**Anclas**: buckets Medium/Heavy + nudges reales del log (70–90k/subagente, F2 fan-out).
**Lectura de cuota**: cada bloque (F4R, F4T) es Heavy por sí solo → **una ventana de
cuota cada uno, mínimo**. R1 es el arranque barato e independiente si la ventana viene
corta. F4R ≈ lo que costó TODA la landing F1–F4 original: es un rework mayor, decidido
a conciencia.

## 7 · Qué le queda a Alan (gates)

1. Gate F4R: probar el flujo en el preview logueado · tunear timings con `?tune` ·
   veredicto de micro-copy → me pasa valores congelables.
2. Gate F4T: idem + veredicto h2/sub del tablero + veredicto de forma default en
   "Cómo te pagan" (¿barra o donut de fábrica?).
3. Merges a main (producción): decisión exclusiva de Alan, como F3.
