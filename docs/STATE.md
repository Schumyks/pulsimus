# STATE — Landing Pulsimus

> Estado vivo de **la landing de la agencia** (repo `pulsimus/`, deploy `pulsimus.vercel.app`).
> Fuente única de la verdad **volátil de la landing**. Actualizar al cierre de cada sesión que toque la landing.
> **Reglas de negocio / pipeline / metodología de la AGENCIA** viven un nivel arriba → [../../docs/STATE.md](../../docs/STATE.md).
> Migrado a su propio archivo el 2026-07-07 (antes vivía mezclado en el STATE raíz). Última actualización: **2026-07-16 21:45** (cierre: 📬 **mail hola@pulsimus.dk FUNCIONANDO end-to-end** (DNS verificados por dig + prueba recibida en webmail; falta identidad Gmail, ver §Próximos pasos 2). 🧭 **BL-13 refinado a fondo CON Alan** (toki + 3 rondas de chat): evolucionó a **pieza scrollytelling de 5 estaciones full-viewport** con demos que DEMUESTRAN (skins/a-medida/sin-alma-con-alma); contrato sellado en backlog. ⚙️ **OpenSpec adoptado como SDD estándar** (decisión de Alan, todos los proyectos): init en este repo + cambio `bl13-quien-soy` autorado (proposal/spec/design/tasks, 15 tasks). 🏗️ **P1 CONSTRUIDA Y VERIFICADA** en rama `bl13-quien-soy` @ `4d20b40` pusheada (5 estaciones apiladas, gate en `docs/gate-bl13/`, ejecutor Sonnet 103k — piso del estimado): **esperando gate de Alan** (preview Vercel de la rama). Copy = borrador aprobado "mucho mejor" pero Alan lo macera; foto + URL LinkedIn = placeholders con TODO. Previo — 14/07 18:30: 🌐 **pulsimus.dk CONECTADO y sirviendo el sitio** — `www.pulsimus.dk` 200+SSL, apex 308→www, NS en Simply, DNSSEC on. **Mail comprado (Basic Mail) con `hola@` y `hello@` creadas pero SIN registros DNS de correo → los mails REBOTAN** hasta que Alan cargue los 4 registros (tabla en Próximos pasos §2; su intento falló por Tipo=AAAA en vez de MX). Antes, 17:25: (🚀 **F4R+F4T MERGEADOS Y LIVE EN PRODUCCIÓN** con OK explícito de Alan; replan del día: Prudence/EN baja, fixes chicos → paquete BL-12, nace BL-13 "Quién es Alan" (prioridad alta, a refinar), dominio comprado pendiente de aplicar a sitio+mail. Antes, 16:45: (sesión Fable: (1) **auditoría de conversión** de la landing vs ancla.digital/phinxlab + research competencia DK/ES/AR — hallazgo central: prod no tiene NINGUNA prueba (4 secciones, sin demo/casos/números); tesis validada por ausencia (nadie vende conversión con seña en 22 competidores); informes en `agency/research/competencia-agencias-2026-07-14.md`. (2) **BL-09 RESUELTO** en `f4-tablero` @ `fa6c6a7` pusheada: tablero 1590→860px (layout 3+3, fila 1 = paneles del toggle) + flash ámbar al togglear; verificado en build de PROD (58/58, eco end-to-end, mobile, reduced); addendum + capturas en `gate-f4t/`. (3) Backlog: BL-01 enriquecido con referencias parallax y subido a alta; BL-11 nuevo (video de fondo en loop, a refinar). Plan acordado: cerrar ciclo F4R/F4T y mergear ANTES de todo lo demás → después BL-01 → después decisión prueba+precio. Previo — 2026-07-09 23:42 (Alan hizo una **primera revisión en dev local** de ambos gates: *le gusta en general*, pero dejó feedback → BL-09 (densidad del tablero: que entre sin scroll, el toggle Día/Semana/Mes actualiza datos fuera del viewport) y BL-10 (mejoras del lado La Espiga/mostrador, sin especificar). **QA fino de Alan → mañana 2026-07-10.** Antes ~18:35: F4T CONSTRUIDO en `f4-tablero` (El tablero — 6 paneles + toggle + coreografía + `?tune`, verificado Playwright sobre build de PROD incl. **eco Reservas→mostrador**; gate en `gate-f4t/`). Antes ~14:45: F4R construido en `f4-mostrador`).

## Qué es

Landing de la agencia Pulsimus ("El pulso de tu negocio"). Repo `Schumyks/pulsimus` **anidado** en `Agencia/pulsimus/` (git propio; `Agencia` NO es git).
Stack: **Next 16 + Tailwind v4** (`@theme inline`) + Outfit + tokens "Faro Ámbar" (noche `#1B2140` / hueso `#F6EFE1` / ámbar `#F2A63E`; símbolo pulso→estrella).
Riel **GitHub → Vercel**: cada push a `main` auto-deploya a `pulsimus.vercel.app`. La app es donante 1 del starter (NO se construye sobre él).

## Estado de ramas / gates

- **`main` (3de43f1)** — **LIVE en producción (verificado 14/07 ~17:20: `pulsimus.vercel.app` sirve `#mostrador` y `#tablero`)**: F1 + F2 + voz + F3 (latido enfermo 30bpm en Dolores, provenance en `globals.css`) + **F4R (El mostrador ciclo completo + latido SANO)** + **F4T (El tablero denso 3+3 con BL-09)**. Merge del 14/07 con **OK explícito de Alan** ("así como está doy el OK para deployar") — sin congelar `?tune` ni borrar `TunePanel` (inocuo en prod: solo activa con query param; se limpia en el paquete BL-12). La página aún NO se muestra a nadie (decisión de Alan 14/07).
- **`bl13-quien-soy` (4d20b40, pusheada)** — 🟠 **GATE ABIERTO (P1)**: sección `#quien-soy` apilada (5 estaciones full-viewport, demos estáticos) + adopción OpenSpec + docs del refinamiento. 3 commits adelante de main, working tree limpio. Espera veredicto de Alan sobre el preview Vercel. Cambio OpenSpec: `openspec/changes/bl13-quien-soy/` (4/15 tasks ✓).
- **`f4-mostrador` / `f4-tablero`** — ya mergeadas a `main` (merge `3de43f1`). Redundantes; seguras de borrar cuando Alan quiera (junto con `f3-motion` y `f3-pulse-proto`, redundantes desde antes).

## Gate en curso

**GATES F3 / F4R / F4T · ✅ CERRADOS Y EN PRODUCCIÓN** (F4R/F4T: merge 14/07 por OK de Alan; reports en `gate-f4r/` y `gate-f4t/` — este último con addendum BL-09). Veredictos que Alan dio el 14/07: layout 3+3 ✓ · flash del toggle ✓ · copy h2/sub y forma default de Pagos quedaron implícitamente OK con el "deployar tal como está". Fixes chicos detectados en su QA → **BL-12** (paquete, no de a uno).
**Nota**: previews por rama protegidos; producción NO.

## Próximos pasos (landing) — replan de Alan del 14/07

1. **→ ARRANCÁ ACÁ: gate P1 de BL-13** — Alan mira el preview Vercel de la rama `bl13-quien-soy` y da veredicto (task 1.5 del cambio OpenSpec). Con su OK + su pulido del copy (`docs/bl13-copy.md`, le "pican cosas de la narrativa") + su foto real + URL de LinkedIn → se cierran los TODO de `EstacionIntro.tsx` y él mergea. Después: **P2 coreografía** (`/opsx:apply bl13-quien-soy`, tasks 2.1–2.6, ~500–900k, ventana de cuota propia).
2. **Mail del dominio — ✅ FUNCIONANDO end-to-end (16/07):** registros DNS verificados vía `dig` (MX `10 mx.simply.com` + SPF + DKIM 1/2; A/CNAME del sitio intactos) y **mail de prueba recibido en la bandeja de `hola@` en webmail.simply.com** (login: dirección completa + contraseña de la casilla). Falta cerrar:
   1. **Identidad Gmail SEPARADA (decisión de Alan 16/07: no reenviar a su cuenta personal; lo setea él "más tarde"):** crear cuenta Google nueva de Pulsimus (opción A recomendada, gratis; ej. `pulsimus.dk@gmail.com`, nadie la ve) → reenvío en Simply `hola@` → esa cuenta → "Enviar como" `hola@pulsimus.dk` vía `smtp.simply.com:587` (usuario = dirección completa, contraseña de la casilla, TLS). `hello@`: solo reenvío, sin "Enviar como". Workspace (~75 DKK/mes) descartado por ahora.
   2. **Opcional (recomendado antes de mandar mails salientes):** TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:hola@pulsimus.dk` — aún no cargado (verificado 16/07). Webmail mientras tanto: webmail.simply.com (dirección completa + contraseña de la casilla).
3. **BL-12 · paquete de pulido** (acumulando): scroll interno de la cola Reservas (bug) + "TICKET PROM." a 1 línea + ítems BL-10 cuando bajen + limpieza `?tune`/TunePanel + borrar ramas redundantes.
4. **BL-01 · fondo vivo** (alta, refinar antes de construir) y **BL-11 · video loop** (media) — la capa "vida" post-auditoría.
5. **Prudence/módulo EN: BAJADO por Alan (14/07).** F5 (Cal.com + forms) sigue bloqueada por prerequisitos.

## Pendientes F5 (prerequisitos de Alan)

~~Dominio~~ ✅ **comprado (14/07)** — falta aplicarlo (DNS → Vercel) y el mail `hola@`. Backorder `pulsimus.com` (vence 02/08) · cuenta Cal.com · servicio de forms. **Créditos Higgsfield → FG, NO landing.**

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
