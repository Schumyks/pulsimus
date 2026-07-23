# Gate F4T · El tablero

> Sección nueva de la landing: lo que el registro del mostrador le da al dueño —
> *"lo que todo negocio de barrio necesita saber y no sabe"*. Se apila sobre F4R,
> rama `f4-tablero` (desde `f4-mostrador`). Diseño: [`f4r-f4t-design-spec.md`](../design-spec.md) §4 ·
> Plan: [`f4r-f4t-plan.md`](../plan.md) §5. **El merge a `main` (producción) es decisión de Alan.**

## Qué se construyó

El tablero vive entre `#mostrador` y Proceso, fondo **noche**, alimentado por el MISMO
store compartido: los pedidos de arriba mueven los números de abajo en vivo.

- **Control global único** — `[ Hoy | Semana | Mes ]` (radiogroup, teclado con flechas).
  Un tap re-renderiza TODO el tablero contra la misma ventana. Jamás filtros por card.
- **6 paneles** (grid fila-ancha + 3 + 2; mobile apilado):
  1. **⚡ Reservas por confirmar** (fila ancha, LA accionable) — cada fila: quién · qué ·
     cuánto · cuándo retira + **"Confirmar reserva"**. Al confirmar, la fila se **sella**
     (✓ un beat) y el **eco viaja al mini-dashboard del mostrador**. Contador de pendientes.
  2. **El día de un vistazo** — KPIs (facturado · pedidos · ticket prom.) con conteo
     animado · **Δ vs. período anterior** (flecha + signo, verde/rojo) · **ganancia con
     desglose** `Bruto − IVA (moms) − Costos = Ganancia` (el sketch de Alan).
  3. **Qué se vende** — barras por producto (un solo hue = magnitud) con `quedan N de M`;
     **⚠ se agota** = color de estado con **ícono + texto** (nunca color solo), solo en Hoy.
  4. **Cuándo te piden** — barras por hora/día/semana según período, **pico en ámbar**, el
     resto en tono recesivo.
  5. **Cómo te pagan** — cobrado / a cobrar + split por método, con **switch `[▤|◔]`**:
     barra apilada ↔ **donut**, con morph (crecen 0→valor al entrar; cross-fade+escala al
     togglear).
  6. **Retiros** — agenda `HH:MM · cliente · items · estado`; "de hoy" (Hoy) / "próximos"
     (Semana/Mes).
- **Coreografía de carga** (§4.4) — un IntersectionObserver dispara UNA vez al entrar al
  viewport: los 6 marcos hacen fade+rise escalonado, luego se llenan por naturaleza del
  dato (contadores cuentan 0→valor, barras crecen). Órdenes posteriores y el toggle
  re-cuentan solo su delta.
- **reduced-motion** — todo aparece lleno, sin conteos ni cascadas.
- **`?tune`** — panel dev (`?tune`) para congelar los timings de coreografía (stagger de
  marcos, conteo, crecimiento de barras). Se borra al congelar, como en F3/F4R.

## Verificación (Playwright, build de PRODUCCIÓN)

`npx next start -p 3101` sobre `next build` limpio (`rm -rf .next` + rebuild). Intro
saltada con `sessionStorage['px-intro-seen']='1'`. **Cero errores de runtime/consola** en
todos los flujos.

| Check | Resultado |
|---|---|
| Carga anima al entrar al viewport | ✓ los 6 marcos: opacity 0 (bajo el fold) → 1 (en vista); video adjunto |
| Un pedido arriba mueve los números abajo | ✓ +2 medialunas (32 kr): facturado **1.236 → 1.268**, pedidos **14 → 15** |
| **Confirmar reserva → eco al mostrador** | ✓ mostrador: pendiente **2→1**, confirmada **1→2**; contador del tablero **2→1** |
| Toggle 3 períodos re-renderiza coherente | ✓ facturado **1.236 / 6.716 / 26.006**; pedidos 14/74/293; cada ganancia cierra exacto |
| Δ vs. período anterior | ✓ Hoy **↑+20%** (1.236 vs 1.030 jueves pasado) · Semana ↑+4% · Mes ↑+1% |
| Eje de "Cuándo te piden" cambia por período | ✓ "Pedidos por hora" → "Facturado por día" → (semana) |
| Morph barra ↔ donut | ✓ radiogroup aria-checked alterna; donut renderiza (ver captura) |
| ⚠ se agota (estado con ícono+texto) | ✓ Facturas (quedan 9 de 48 ≤ 25%) marca ⚠, solo en Hoy |
| reduced-motion | ✓ tablero muestra valores finales SIN scroll (gate de conteo bypasseado); 0 marcos ocultos |
| Mobile 375px | ✓ apilado: los 3 paneles del grid a x=24, w=327 (una columna) |
| tsc · eslint · next build | ✓ los tres verdes |
| Invariantes del store (T1) | ✓ **58/58** (`scripts/verify-demo-invariants.ts`) — los 6 paneles cierran entre sí en los 3 períodos |

## Assets

- `desktop-tablero-loaded.png` — el tablero completo, Hoy
- `desktop-week.png` · `desktop-month.png` — toggle de período
- `desktop-payments-donut.png` — morph a donut
- `desktop-eco-confirmed.png` — tras confirmar reserva (eco)
- `desktop-reduced-motion.png` — board lleno bajo reduced-motion
- `mobile-tablero.png` — apilado, 375px
- `tablero-load.webm` — **la coreografía de carga animándose**

*(Nota de captura: el header sticky translúcido se superpone arriba en algunos stills —
artefacto del screenshot, no del layout real; mismo caso que el gate F4R.)*

## A tu veredicto, Alan

**h2 / sub del tablero (copy NUEVO en voz de marca — a tu veredicto):**
- h2: **"El resultado del día, sin hacer cuentas."**
- sub: **"Lo que todo negocio de barrio necesita saber —y casi nunca sabe—. El mismo
  mostrador, visto de adentro."**

**Micro-copy nuevo (funcional):** títulos de panel ("El día de un vistazo", "Qué se
vende", "Cuándo te piden", "Cómo te pagan", "⚡ Reservas por confirmar", "Retiros de hoy" /
"Próximos retiros") · "Confirmar reserva" · "Todo confirmado ✓" · toggle "Hoy / Semana /
Mes" · labels ("FACTURADO", "PEDIDOS", "TICKET PROM.", "Bruto", "− IVA (moms)", "−
Costos", "= Ganancia estimada", "Cobrado / A cobrar", "quedan N de M", "⚠ se agota",
"MobilePay / Pago al retirar") · deltas ("vs. mismo día, semana pasada" / "vs. semana
pasada" / "vs. mes pasado").

**Timings a congelar (`?tune` · abrí el preview con `?tune`, ajustá, "Copiar JSON"):**

```json
{ "frameStaggerMs": 90, "countMs": 900, "barMs": 700 }
```

**Forma default de "Cómo te pagan":** hoy arranca en **barra apilada** (el donut queda a un
tap). Decime si preferís donut de fábrica.

## Notas / decisiones del director

- **La ventana de período NO vive en el store** (aunque el plan lo sugería): quedó como
  React state en `Tablero.tsx`, con los selectores puros tomando `period` como argumento
  (como ya los dejó R1). Motivo: **desacopla** — un toggle del tablero jamás re-renderiza
  El mostrador. Reversible si Alan prefiere el store.
- **Paleta validada** con `dataviz/validate_palette.js` sobre superficie noche `#1B2140`
  (modo dark): ámbar (pico/positivo) / bruma (recesivo/pendiente) / hueso (ink) → **CVD
  ΔE 55–90 y contraste ≥3:1 PASAN** (los no-negociables). Los flags de "banda de
  luminosidad" y "chroma floor" del validador son la tensión del brand-lock (ámbar es
  brillante; bruma es recesiva a propósito) — es la paleta que la spec §4.5 prescribe;
  mitigada con label directo + gap de 2px entre segmentos + ícono/texto en estado (la
  "relief rule" del skill). Estado ⚠ `#ec835a`; deltas ↑`#34c759` / ↓`#e66767`.
- **Ventanas RODANTES** (no calendario) y **stock período-agnóstico** (propiedad del día):
  se mantuvieron las 2 decisiones que R1 dejó marcadas — el modelo no fija día calendario
  y no hay `Date` en el módulo. **Retiros "próximos"** (Semana/Mes) = las reservas
  `on_pickup` (la historia son agregados diarios, no órdenes individuales).
- **Eco** = verificado **end-to-end** por primera vez (F4R solo lo probó estructuralmente):
  confirmar en el tablero → el ticket del mostrador cambia badge, sin recargar.
- **Delegación**: T1 (selectores) y T3 (6 paneles, 3 ejecutores paralelos) = subagentes
  Sonnet con brief cerrado; T2/T4/T5 (criterio de motion + integración + verificación) =
  director. T3b no pudo renderizar en vivo (sin binario de render offline) → esta pasada de
  Playwright ES su verificación visual.
- **Assets** = solo la curación de Alan (`public/la-espiga/`). Cero imágenes nuevas.
- **Nota de entorno**: el worktree aislado no trae `node_modules` y Turbopack rechaza un
  symlink que apunte afuera de su root → hace falta `bun install` en el worktree antes de
  buildear. (Documentado para la próxima sesión que trabaje en un worktree.)
- **Preview** (protegido, solo Alan): rama `f4-tablero` en Vercel al pushear. Producción
  (`main`) **sin tocar**.

---

## Addendum BL-09 (2026-07-14) — densidad + feedback del toggle

Primera revisión de Alan (09/07): el tablero pedía scroll y el toggle actualizaba datos
fuera del viewport. Aplicado PRE-merge sobre `f4-tablero`:

- **Layout 3+3 en una pantalla**: la fila full-width de Reservas se fue; ahora son dos
  filas de 3 paneles. **Fila 1 = lo que responde al toggle** (Vistazo · Qué se vende ·
  Cuándo te piden), pegada al control; fila 2 = lo operativo (Reservas ⚡ · Pagos ·
  Retiros). Sección: **1590px → 860px** a 1440×900 (entra completa; medida sobre build
  de PROD).
- **Feedback del toggle**: anillo ámbar one-shot (`tablero-flash`, 700ms, inset 1.5px)
  sobre los 5 paneles sensibles al período (la cola queda fuera: vive en presente), que
  se suma al re-tween de counters/barras. Bajo `prefers-reduced-motion` no se monta
  (verificado: 0 overlays, datos cambian instantáneo).
- **Compactación**: paddings de sección/frames, gaps de paneles, tracks de barra a 1.5px,
  lista de retiros con `max-h` 248px (scroll interno con fade).
- **Re-verificado sobre build de PROD**: invariantes **58/58** · eco Reservas→mostrador
  end-to-end (pendientes 2→1, badge del ticket cambia sin recarga) · mobile 390px sin
  overflow horizontal · consola limpia (los únicos errores en la sesión de test fueron
  el cliente HMR de una página dev vieja reintentando contra un server apagado —
  artefacto del entorno de test, no de la app).
- **Capturas**: `gate-bl09-desktop-hoy.png` · `gate-bl09-desktop-semana.png` ·
  `gate-bl09-mobile.png`.

**A veredicto de Alan (se suma a la lista del gate):**
1. El trade-off del layout: la cola de Reservas pierde el ancho completo (spec §4.3.1
   decía full-width) a cambio de que TODO entre en una pantalla. Reversible.
2. Intensidad del flash del toggle (hoy sutil: ámbar 55% → 0 en 700ms). Si lo querés
   más presente, es un número en `globals.css` (`tablero-flash`).
3. En "El día de un vistazo", el label "TICKET PROM." quiebra a 2 líneas a 357px de
   panel — ¿lo acortamos ("TICKET") o queda?
