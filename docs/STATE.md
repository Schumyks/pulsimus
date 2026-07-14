# STATE — Landing Pulsimus

> Estado vivo de **la landing de la agencia** (repo `pulsimus/`, deploy `pulsimus.vercel.app`).
> Fuente única de la verdad **volátil de la landing**. Actualizar al cierre de cada sesión que toque la landing.
> **Reglas de negocio / pipeline / metodología de la AGENCIA** viven un nivel arriba → [../../docs/STATE.md](../../docs/STATE.md).
> Migrado a su propio archivo el 2026-07-07 (antes vivía mezclado en el STATE raíz). Última actualización: **2026-07-14 16:45** (sesión Fable: (1) **auditoría de conversión** de la landing vs ancla.digital/phinxlab + research competencia DK/ES/AR — hallazgo central: prod no tiene NINGUNA prueba (4 secciones, sin demo/casos/números); tesis validada por ausencia (nadie vende conversión con seña en 22 competidores); informes en `agency/research/competencia-agencias-2026-07-14.md`. (2) **BL-09 RESUELTO** en `f4-tablero` @ `fa6c6a7` pusheada: tablero 1590→860px (layout 3+3, fila 1 = paneles del toggle) + flash ámbar al togglear; verificado en build de PROD (58/58, eco end-to-end, mobile, reduced); addendum + capturas en `gate-f4t/`. (3) Backlog: BL-01 enriquecido con referencias parallax y subido a alta; BL-11 nuevo (video de fondo en loop, a refinar). Plan acordado: cerrar ciclo F4R/F4T y mergear ANTES de todo lo demás → después BL-01 → después decisión prueba+precio. Previo — 2026-07-09 23:42 (Alan hizo una **primera revisión en dev local** de ambos gates: *le gusta en general*, pero dejó feedback → BL-09 (densidad del tablero: que entre sin scroll, el toggle Día/Semana/Mes actualiza datos fuera del viewport) y BL-10 (mejoras del lado La Espiga/mostrador, sin especificar). **QA fino de Alan → mañana 2026-07-10.** Antes ~18:35: F4T CONSTRUIDO en `f4-tablero` (El tablero — 6 paneles + toggle + coreografía + `?tune`, verificado Playwright sobre build de PROD incl. **eco Reservas→mostrador**; gate en `gate-f4t/`). Antes ~14:45: F4R construido en `f4-mostrador`).

## Qué es

Landing de la agencia Pulsimus ("El pulso de tu negocio"). Repo `Schumyks/pulsimus` **anidado** en `Agencia/pulsimus/` (git propio; `Agencia` NO es git).
Stack: **Next 16 + Tailwind v4** (`@theme inline`) + Outfit + tokens "Faro Ámbar" (noche `#1B2140` / hueso `#F6EFE1` / ámbar `#F2A63E`; símbolo pulso→estrella).
Riel **GitHub → Vercel**: cada push a `main` auto-deploya a `pulsimus.vercel.app`. La app es donante 1 del starter (NO se construye sobre él).

## Estado de ramas / gates

- **`main` (52780d0)** — **LIVE en producción**: F1 + F2 + voz + **F3 (intro + motion kit + latido narrativo)** (+ docs de diseño F4R/F4T). Sigue con el mostrador VIEJO (chip-FLIP) hasta que Alan mergee F4R. Verificado: `pulsimus.vercel.app` sirve el latido (`#ffbf66`). Latido: Dolores = corazón **ENFERMO** — retroiluminación por-card *lub-dub* espaciado a **30bpm** (2s, doble-golpe parejo en 14.5%/29% + pausa larga), ámbar pálido `#ffbf66`, contenido quieto + estrella recorriendo el electro (`offset-path`). Valores **tuneados a mano por Alan** (panel dev `?tune`, ya borrado); provenance JSON en el comentario de `globals.css`. El ritmo **SANO se reserva para El mostrador**. Gate en [`gate-f3/report.md`](gate-f3/report.md).
- **`f3-motion` (45f7834)** — ya mergeada a `main` (idéntica). Redundante; **segura de borrar** junto con la proto.
- **`f4-mostrador` (F4R construido, adelante de `main`)** — **El mostrador REFORMADO (ciclo completo)**, construido y verificado (Playwright, build de producción, cero errores runtime). Store determinista (`app/lib/demo/*`, 21/21 invariantes) + los dos lados (steppers→draft→pago→sobre FLIP→print-in; mini-dashboard con franja de negocio, lista acumulativa sin cap, modal de trazabilidad) + **latido SANO** + `?tune` + reduced-motion. Sincronizada con los docs de `main` (spec/plan/engram-config). **Gate armado**: [`gate-f4r/report.md`](gate-f4r/report.md) + capturas desktop/mobile + `paynow-flow.webm`. **Esperando revisión de Alan** (veredicto de copy + tune de timings + merge). El gate F4 viejo (chip-FLIP) quedó **superseded**; assets en `gate-f4/` como registro histórico.
- **`f4-tablero` (F4T construido, apilada sobre `f4-mostrador`)** — **El tablero** (sección nueva entre `#mostrador` y Proceso), construido y verificado (Playwright, build de PROD, cero errores runtime). Extiende el store (`app/lib/demo/selectors.ts`: selectores por período + deltas, **58/58 invariantes** — los 6 paneles cierran entre sí en Hoy/Semana/Mes) + shell noche con `PeriodToggle` (fila única) + coreografía de carga (IO una vez: marcos stagger → conteo/crecimiento) + **6 paneles** (Reservas accionable · día de un vistazo con ganancia · qué se vende con ⚠ se agota · cuándo te piden con pico ámbar · cómo te pagan con morph barra↔donut · retiros) + `?tune` de coreografía + reduced-motion. **Eco Reservas→mostrador verificado end-to-end** (lo que F4R solo probó estructural). Paleta validada con `dataviz` sobre noche `#1B2140`. **Gate armado**: [`gate-f4t/report.md`](gate-f4t/report.md) + capturas + `tablero-load.webm`. **Esperando revisión de Alan.**
- **`f3-pulse-proto` (9f6b5e6)** — rama proto descartable, ya consolidada en `main`. Redundante; **segura de borrar** (local + remoto/preview) cuando quieras.

## Gate en curso

**GATE F3 · ✅ CERRADO Y EN PRODUCCIÓN.** El latido se tuneó a mano hasta aprobación, se consolidó en `f3-motion` (squash) y se mergeó a `main` (fast-forward) → LIVE en `pulsimus.vercel.app` (verificado).
**GATE F4R · 🟢 ARMADO, ESPERANDO A ALAN.** F4R construido y verificado end-to-end (ver rama `f4-mostrador` arriba). Report + assets en [`gate-f4r/`](gate-f4r/report.md). Lo que le queda a Alan: (1) probar el flujo en el preview logueado; (2) tunear timings con `?tune` → me pasa el JSON a congelar en `flowParams.ts`; (3) veredicto del micro-copy nuevo (lista en el report); (4) decisión de **merge a `main`**. El gate F4 viejo (chip-FLIP) quedó superseded (assets en `gate-f4/`).
**GATE F4T · 🟢 ARMADO, ESPERANDO A ALAN.** F4T construido y verificado end-to-end sobre build de PROD (ver rama `f4-tablero` arriba). Report + assets en [`gate-f4t/`](gate-f4t/report.md). Lo que le queda a Alan: (1) probar el tablero en el preview logueado (toggle de período, morph, eco); (2) **veredicto del h2/sub NUEVOS** ("El resultado del día, sin hacer cuentas." / sub) — marcados a-veredicto en el report; (3) tunear coreografía con `?tune` → me pasa el JSON a congelar en `tableroParams.ts` (defaults: `{frameStaggerMs:90, countMs:900, barMs:700}`); (4) veredicto forma default de "Cómo te pagan" (barra vs donut); (5) decisión de **merge a `main`**. **Orden de merge**: F4R primero (el tablero se apila sobre él); al mergear reconcilian.
**Nota**: previews por rama **protegidos**; producción NO.

## Próximos pasos (landing)

1. **→ ARRANCÁ ACÁ: QA fino de Alan sobre `f4-tablero`** (dev local ya levanta en `localhost:3000`; rama `f4-tablero` trae F4R+F4T juntos). Primera revisión ✅ hecha (le gusta). Próximo: (a) **aplicar BL-09** — densidad del tablero, que entre sin scroll y el toggle dé feedback visible (ajuste PRE-merge); (b) recoger de Alan los ítems concretos del **lado La Espiga/mostrador** → llenar BL-10; (c) veredictos de copy (h2/sub del tablero) + forma default de Pagos + JSON de `?tune` de cada pieza. Cuando cierre: congelar timings (`flowParams.ts` F4R / `tableroParams.ts` F4T) + borrar `TunePanel`/`?tune` + **mergear F4R primero, después F4T** (decisión suya).
2. **Latido SANO** — ✅ hecho en F4R (panel dueño, ~66bpm, intensifica al entrar orden).
3. **Limpieza (opcional, pendiente de OK de Alan):** borrar `f3-pulse-proto` y `f3-motion` (remotas + previews) — ya redundantes.
4. **Módulo EN** de la landing antes del pitch a Prudence (vuelve el 13/07) — OJO: F4R+F4T son ~2 días de ventanas de cuota; el pitch del 13 puede necesitar priorizarse.
5. Pendientes F5 sin cambios (abajo).

## Pendientes F5 (prerequisitos de Alan)

Backorder `pulsimus.com` (vence 02/08) · mail `hola@pulsimus.dk` · cuenta Cal.com · servicio de forms. **Créditos Higgsfield → FG, NO landing.**

## Decisiones de la landing (02/07 — detalle en [../../agency/landing-brief.md](../../agency/landing-brief.md) + Engram `pulsimus/landing-*`)

Posicionamiento "C disfrazada de A" (categoría web, promesa conversión) · página = credencial post-pitch · diferenciador "los dos lados del mostrador" · 7 secciones (stack eliminada; slot Ejemplos vivo) · pieza firma El mostrador (panadería ficticia **La Espiga**, alcance CONGELADO) · CTA primario Cal.com + secundario form→mail · solo ES voseo en v1 · Next.js+Tailwind+Vercel en `pulsimus.dk` · glosario en `CONTEXT.md` (raíz del repo).
**Instagram híbrido:** "Instagram" (concreto) en la línea-firma; "las redes" (genérico) en la voz del dueño.

## Registro / decisiones previas

- [`f2-voz-revision.md`](f2-voz-revision.md) — voz + Instagram híbrido.
- [`f4-image-prompts.md`](f4-image-prompts.md) — assets: curación de Alan = fuente de verdad, pipeline rembg local, **demo = CÓDIGO jamás video**.
- [`backlog.md`](backlog.md) — backlog de la landing reorganizado por fase del roadmap (fuente única de parqueos).
- [`f3-intro-donante.md`](f3-intro-donante.md) — coreografía completa de la intro extraída del donante v1.

## Memoria (Engram)

Project `agencia` fijado por **DOS** configs: el de la raíz de Agencia Y [`.engram/config.json`](../.engram/config.json) **en este repo** (commiteado). Aprendido el 09/07: el config de la raíz NO alcanza cuando la sesión se abre con cwd EN este repo hijo — la resolución cae a `git_remote` → project fantasma `pulsimus` (le pasó a `mem_session_summary`, que no acepta `project=`). Con el config local queda cerrado (verificado: `mem_current_project` → `source: config`). Pasar `project=agencia` explícito sigue siendo el respaldo en las tools que lo aceptan. Huérfano residual documentado: obs #173 (tombstone con puntero). Registro: F3 id 186, F4 id 187; fixes de memoria id 194/195 y migración obs #216 (09/07).
