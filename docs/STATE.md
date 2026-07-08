# STATE — Landing Pulsimus

> Estado vivo de **la landing de la agencia** (repo `pulsimus/`, deploy `pulsimus.vercel.app`).
> Fuente única de la verdad **volátil de la landing**. Actualizar al cierre de cada sesión que toque la landing.
> **Reglas de negocio / pipeline / metodología de la AGENCIA** viven un nivel arriba → [../../docs/STATE.md](../../docs/STATE.md).
> Migrado a su propio archivo el 2026-07-07 (antes vivía mezclado en el STATE raíz). Último trabajo real de landing: **2026-07-08 21:xx** (latido narrativo tuneado a mano y consolidado en `f3-motion`).

## Qué es

Landing de la agencia Pulsimus ("El pulso de tu negocio"). Repo `Schumyks/pulsimus` **anidado** en `Agencia/pulsimus/` (git propio; `Agencia` NO es git).
Stack: **Next 16 + Tailwind v4** (`@theme inline`) + Outfit + tokens "Faro Ámbar" (noche `#1B2140` / hueso `#F6EFE1` / ámbar `#F2A63E`; símbolo pulso→estrella).
Riel **GitHub → Vercel**: cada push a `main` auto-deploya a `pulsimus.vercel.app`. La app es donante 1 del starter (NO se construye sobre él).

## Estado de ramas / gates

- **`main` (738457f)** — LIVE: F1 + F2 + revisión de voz.
- **`f3-motion` (4a2c7e1 · HEAD)** — F3 completa + **latido narrativo consolidado**, pusheada, **SIN mergear**. Intro 1×/sesión con FLIP al header (2050ms), skip click/teclado, reveals `[data-rv]` con IntersectionObserver, PulseDivider, `useReducedMotion` end-to-end. Latido: Dolores = corazón **ENFERMO** — retroiluminación por-card *lub-dub* espaciado a **30bpm** (2s, doble-golpe parejo en 14.5%/29% + pausa larga), ámbar pálido **`#ffbf66`**, contenido quieto + estrella recorriendo el electro (`offset-path`). Valores **tuneados a mano por Alan** (panel dev `?tune`, ya borrado); provenance JSON en el comentario de `globals.css`. El ritmo **SANO se reserva para El mostrador**. Gate en [`gate-f3/report.md`](gate-f3/report.md) (9 decisiones + GIF/video/screenshots).
- **`f4-mostrador` (c262f1e)** — F4 pieza firma **El mostrador** completa, verificada con Playwright (gesto chip-FLIP + ticket que se imprime, seeds SSR, cap 4, lockout, reduced, mobile). Incluye **copy nuevo de sección (h2 + sub) a veredicto de Alan**. Gate en `gate-f4/report.md`; spec en `f4-build-spec.md`. Pulido P3: fix header mobile (CTA nowrap responsivo). ⚠️ **Apilada sobre el `f3-motion` VIEJO (2c00cf7)** — al mover `f3-motion` quedó desactualizada; **rebasar sobre `f3-motion` (o main) antes del gate F4**.
- **`f3-pulse-proto` (9f6b5e6)** — rama proto descartable, **ya CONSOLIDADA en `f3-motion`** (squash). Redundante; **segura de borrar** (local + remoto/preview) cuando quieras.

## Gate en curso

**GATE F3.** Alan rechazó el latido del PulseDivider por escala → se prototipó el latido narrativo, y tras rechazar la primera aprobación lo **tuneó a mano** (panel dev `?tune` construido ad-hoc, ya borrado) hasta un feel **APROBADO** (30bpm, ámbar pálido `#ffbf66`, doble-golpe espaciado). **Consolidado en `f3-motion` (squash, commit a717f28).** Falta solo la decisión de **mergear a `main`** (paso a producción → requiere OK explícito). Preview `pulsimus-git-f3-motion-…` **protegido** (Vercel Deployment Protection → solo Alan logueado lo ve; el agente valida en LOCAL).
**Orden de revisión:** gate F3 → merge → gate F4 → merge. Previews de Vercel por rama.

## Próximos pasos (landing)

1. ~~Consolidar el motion aprobado en `f3-motion`~~ ✅ **hecho** (squash a717f28 + `next.config` 4a2c7e1, pusheado).
2. **Mergear `f3-motion` → `main`** (decisión de Alan: pasa a producción). Después, borrar `f3-pulse-proto` y **rebasar `f4-mostrador`** sobre el nuevo `f3-motion`/main.
3. **Aplicar el ritmo SANO en El mostrador** (la prueba de que la infra funciona).
4. **Gate F4** → merge.
5. **Módulo EN** de la landing antes del pitch a Prudence (vuelve el 13/07).

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

Project `agencia` fijado por [`../../.engram/config.json`](../../.engram/config.json) (`{"project_name":"agencia"}`), prioridad 1 en la resolución de Engram → todo el workspace (incluida esta landing) resuelve a `agencia`. El `git_child` que auto-promovía un project fantasma `"pulsimus"` quedó **neutralizado** (verificado: `mem_current_project` → `source: config`). Pasar `project=agencia` explícito ya es solo respaldo. Registro: F3 id 186, F4 id 187; fix de memoria id 194/195.
