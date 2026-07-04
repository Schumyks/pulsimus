# F3 · Plan de ejecución — Intro domesticada + motion kit

> Para una sesión de Claude Code corriendo en la PC de Alan (cwd `/home/alan/Projects/Agencia`), supervisada por él desde el celular. Ejecutar de punta a punta sin esperar respuestas intermedias, salvo los gates marcados. Este documento es la dirección completa de F3; la coreografía exacta está en [f3-intro-donante.md](f3-intro-donante.md) — autosuficiente, NO re-leer el HTML donante (`Pulsimus Landing.html`, gitignoreado: es la fuente ya extraída, releerlo es gastar de más).

## Contexto mínimo

- Landing de Pulsimus, LIVE en pulsimus.vercel.app. **Cada push a `main` auto-deploya al sitio real.**
- Hecho: F1 (scaffold Next 16 + Tailwind v4 + tokens "Faro Ámbar") y F2 (Hero · Dolores · Proceso · CtaFooter en `pulsimus/app/components/`, header sticky en `page.tsx`, revisión de voz implementada).
- F3 = darle movimiento: intro de marca + motion kit (reveals + divisor de pulso). Cero copy nuevo.
- Referencias mayores si hacen falta (carpeta padre, fuera del repo): `agency/landing-brief.md` (§8 intro, §11 piso de calidad) y `agency/landing-build-plan.md` (F3: secuencial, modelo fuerte, gate de Alan).
- **Leer `pulsimus/AGENTS.md` primero**: este Next NO es el del training data; docs reales en `node_modules/next/dist/docs/`.

## Reglas duras

1. **Trabajar en la rama `f3-motion`** creada desde `main`. **JAMÁS pushear a `main`** — auto-deploya al sitio live. El merge lo decide Alan tras el gate visual.
2. Primer commit de la rama: los docs de preproducción (`f3-intro-donante.md`, este plan, el `.gitignore` tocado) que están sin commitear en el working tree.
3. **NO tocar copy ni estructura de secciones.** F3 es movimiento. Si el markup estorba para animar, el cambio mínimo indispensable, anotado en el reporte.
4. **`prefers-reduced-motion` respetado en TODO** (piso de calidad innegociable): con reduce activo la intro NO existe y la página queda completa, visible y estática.
5. **Scope congelado** a la checklist de abajo. Toda idea extra → sección Backlog del reporte, no al código. El parallax del donante queda FUERA de F3.
6. Accesibilidad: el overlay de la intro no rompe foco/teclado — skip por click Y por tecla (Enter/Espacio/Escape); contraste AA se mantiene.
7. Presupuesto orientativo: **~160–320k tokens** (estimado calibrado 04/07). Si se dispara a mitad de camino: cerrar lo que esté verde, pushear la rama, reporte honesto de qué falta + handoff en `Handoffs/`.

## Orden de ejecución

### 1 · Fundaciones del motion kit
- Keyframes `px-*` y tokens de duración/easing (§1 del doc donante) en `app/globals.css` o módulo de motion.
- Sistema de reveals (§7 donante): `[data-rv]` con IntersectionObserver (threshold 0.12, rootMargin `0px 0px -7% 0px`, revela una vez), delays por `data-rv-d`. Client component/hook reutilizable.
- Plumbing reduced-motion (hook `useReducedMotion` con `matchMedia`), usado por TODO lo que se mueva.

### 2 · Intro (`app/components/Intro.tsx`, client)
Portar del doc donante: overlay (§2), símbolo pulso→estrella con SVG y timings exactos (§3), wordmark + tagline (§4), timeline (§5) **con el viaje arrancando a ~2000ms (NO 2750)**, viaje FLIP al header (§6).
- Ancla en el header: `id="hdr-sym"` en un símbolo pulso→estrella chico del header sticky (opacity 0 → 1 al terminar la intro). Si el header no tiene símbolo, crearlo fiel al SVG del donante a escala.
- **1× por sesión**: `sessionStorage` key `px-intro-seen` — si existe, la intro no se monta.
- Skip: click en todo el overlay + Enter/Espacio/Escape → `finish()` inmediato.
- Con reduced-motion: la intro no se monta, punto.

### 3 · Reveals + PulseDivider
- `data-rv` con delays escalonados sutiles en los bloques de las 4 secciones (el hero se revela al terminar la intro, como el donante §7).
- `PulseDivider` en `app/components/Dolores.tsx`: animar con `px-beat` parametrizado — late **despacio** en la columna HOY, **fuerte** en CON PULSIMUS (duración y amplitud distintas, §1 donante).

### 4 · Opcional (solo si todo lo anterior está verde)
- Línea de Proceso dibujándose con el scroll (`#proc-line`, §8 donante — solo la línea, sin parallax).

### 5 · Verificación + material del gate
- `bun run build` en verde; typecheck/lint sin errores.
- Playwright (ya usado en F2): screenshots desktop 1440×900 y mobile 375×812 post-intro; una pasada con `page.emulateMedia({ reducedMotion: 'reduce' })` verificando página visible y estática; video de la intro (`recordVideo`) → GIF si hay ffmpeg, si no `.webm`.
- Artefactos a `docs/gate-f3/`, commiteados en la rama (así Alan los ve desde el celu en GitHub).
- Push de LA RAMA (`git push origin f3-motion`) → Vercel genera el preview deploy.

### 6 · Gate de Alan (STOP)
Presentarle: URL del preview de Vercel + video/GIF + resumen de desvíos. **Esperar su veredicto.** Con OK → merge a `main` SOLO si él lo pide explícito. Con feedback → iterar en la rama.

## Protocolo de memoria y cierre (la sesión corre en la PC: TODO esto aplica)

- **Engram**: `mem_save` con `project=agencia` EXPLÍCITO en toda llamada (el repo anidado `pulsimus/` auto-promueve un project "pulsimus" si no se pasa — gotcha #166). Saves mínimos: decisiones de motion tomadas en el camino + F3 completada con tokens reales. `mem_session_summary` al cierre (cae en el cajón "pulsimus" por el gotcha: aceptado, no pelearla).
- **`docs/STATE.md`** (raíz de Agencia, punto 5): actualizar al cierre con estado de F3 + sello de fecha/hora.
- **Calibración**: al cerrar la fase, append al log de `~/.claude/skills/estimate/references/calibration.md` — estimado 160–320k vs tokens reales (regla del build-plan).
- Si la sesión muere a medias: handoff en `Handoffs/handoff-AAAA-MM-DD-HHmm.md` con estado exacto de la rama.

## Definition of done

- [ ] Rama `f3-motion` pusheada con build verde, `main` INTACTO.
- [ ] Intro completa: 1×/sesión, ~2s de tiempo muerto, skip por click y teclado, viaje FLIP al `#hdr-sym`.
- [ ] Reveals en las 4 secciones + PulseDivider latiendo (despacio/fuerte).
- [ ] Reduced-motion: sin intro, página completa y estática.
- [ ] `docs/gate-f3/` con reporte + capturas + video/GIF.
- [ ] Engram + STATE.md + calibración actualizados.
