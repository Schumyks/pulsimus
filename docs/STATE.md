# STATE — Landing Pulsimus

> Estado vivo de **la landing de la agencia** (repo `pulsimus/`, deploy `pulsimus.vercel.app`).
> Fuente única de la verdad **volátil de la landing**. Actualizar al cierre de cada sesión que toque la landing.
> **Reglas de negocio / pipeline / metodología de la AGENCIA** viven un nivel arriba → [../../docs/STATE.md](../../docs/STATE.md).
> Migrado a su propio archivo el 2026-07-07 (antes vivía mezclado en el STATE raíz). Último trabajo real de landing: **2026-07-08 23:45** (F3 + latido narrativo tuneado → **mergeado a `main` y LIVE en producción**; `f4-mostrador` rebasada).

## Qué es

Landing de la agencia Pulsimus ("El pulso de tu negocio"). Repo `Schumyks/pulsimus` **anidado** en `Agencia/pulsimus/` (git propio; `Agencia` NO es git).
Stack: **Next 16 + Tailwind v4** (`@theme inline`) + Outfit + tokens "Faro Ámbar" (noche `#1B2140` / hueso `#F6EFE1` / ámbar `#F2A63E`; símbolo pulso→estrella).
Riel **GitHub → Vercel**: cada push a `main` auto-deploya a `pulsimus.vercel.app`. La app es donante 1 del starter (NO se construye sobre él).

## Estado de ramas / gates

- **`main` (45f7834 · HEAD)** — **LIVE en producción**: F1 + F2 + voz + **F3 (intro + motion kit + latido narrativo)**. Verificado: `pulsimus.vercel.app` sirve el latido (`#ffbf66`). Latido: Dolores = corazón **ENFERMO** — retroiluminación por-card *lub-dub* espaciado a **30bpm** (2s, doble-golpe parejo en 14.5%/29% + pausa larga), ámbar pálido `#ffbf66`, contenido quieto + estrella recorriendo el electro (`offset-path`). Valores **tuneados a mano por Alan** (panel dev `?tune`, ya borrado); provenance JSON en el comentario de `globals.css`. El ritmo **SANO se reserva para El mostrador**. Gate en [`gate-f3/report.md`](gate-f3/report.md).
- **`f3-motion` (45f7834)** — ya mergeada a `main` (idéntica). Redundante; **segura de borrar** junto con la proto.
- **`f4-mostrador` (d3c5939)** — F4 pieza firma **El mostrador** completa, verificada con Playwright (gesto chip-FLIP + ticket que se imprime, seeds SSR, cap 4, lockout, reduced, mobile). Incluye **copy nuevo de sección (h2 + sub) a veredicto de Alan**. Gate en `gate-f4/report.md`; spec en `f4-build-spec.md`. Pulido P3: fix header mobile (CTA nowrap responsivo). ✅ **Rebasada sobre `main` (45f7834)** — ahora incluye el latido + El mostrador, typecheck limpio. Lista para el gate F4.
- **`f3-pulse-proto` (9f6b5e6)** — rama proto descartable, ya consolidada en `main`. Redundante; **segura de borrar** (local + remoto/preview) cuando quieras.

## Gate en curso

**GATE F3 · ✅ CERRADO Y EN PRODUCCIÓN.** El latido se tuneó a mano hasta aprobación, se consolidó en `f3-motion` (squash) y se mergeó a `main` (fast-forward) → LIVE en `pulsimus.vercel.app` (verificado). `f4-mostrador` ya rebasada sobre `main`.
**GATE F4 · próximo.** El mostrador vive en `f4-mostrador` (rebasada, incluye el latido). Falta: revisar el preview logueado y **mergear `f4-mostrador` → `main`**. Nota: los previews por rama están **protegidos** (Deployment Protection → solo Alan logueado); producción NO.
**Orden de revisión:** ~~gate F3 → merge~~ ✅ → **gate F4 → merge**. Previews de Vercel por rama.

## Próximos pasos (landing)

1. ~~Consolidar el latido en `f3-motion`~~ ✅ · ~~mergear a `main`~~ ✅ (F3 LIVE) · ~~rebasar `f4-mostrador`~~ ✅.
2. **Limpieza (opcional, pendiente de OK):** borrar `f3-pulse-proto` y `f3-motion` (remotas + previews) — ya redundantes.
3. **Gate F4:** revisar preview de `f4-mostrador` logueado → **mergear a `main`**.
4. **Aplicar el ritmo SANO en El mostrador** (la prueba de que la infra funciona).
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
