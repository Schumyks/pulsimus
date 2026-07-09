# Backlog — Landing Pulsimus

> **Fuente única de ítems parqueados de la landing, organizados por FASE del roadmap.**
> Cuando aparece una idea/mejora durante el build, se ubica bajo la fase que la origina → así no se escapa y se ve alineada al plan.
> No implementar sin OK explícito de Alan.
>
> Roadmap canónico (el QUÉ / el CÓMO): [`agency/landing-brief.md`](../../agency/landing-brief.md) + [`agency/landing-build-plan.md`](../../agency/landing-build-plan.md). Estado vivo: [`docs/STATE.md`](../../docs/STATE.md).
> Estado de fase: ✅ live en `main` · 🔵 completa, espera gate · ⚪ pendiente

## Cómo se usa este backlog

1. **Nota nueva** → identificar la fase que la origina → agregarla como `BL-NN` bajo esa fase, con prioridad tentativa (media/alta) y origen (quién/cuándo).
2. **Sin fase clara** → va a "Sin fase asignada" (abajo) hasta ubicarla.
3. **Al abrir el gate de una fase** → revisar sus `BL-NN` ANTES de mergear y decidir cuáles entran.

---

## F1 · Scaffold + tokens de marca — ✅ LIVE en `main`
_Sin parqueos._

## F2 · Secciones estáticas (hero · dolores · proceso · CTA shell+footer) — ✅ LIVE en `main` (+ revisión de voz)
_Sin parqueos._

## F3 · Intro domesticada + motion kit — 🔵 completa en `f3-motion` (incl. latido narrativo tuneado), espera decisión de merge a `main`

### BL-01 · Scroll con "pulso" — la página debe sentirse viva · prioridad **media**
- **Origen:** Alan (audio, 2026-07-04).
- **Problema:** la marca martilla el "pulso", pero el **acto de scrollear** no lo transmite. El motion actual late en los `PulseDivider` y en los reveals `[data-rv]`, pero el scroll en sí se siente inerte.
- **Deseo:** que scrollear hacia abajo dé sensación de vida/pulso — que la página "esté viva" mientras el usuario baja, no solo en los elementos que aparecen.
- **Dirección posible (sin comprometer):** scroll-driven animations, easing/inercia en reveals, latido sutil sincronizado con el desplazamiento, parallax discreto. Respetar `useReducedMotion` end-to-end.

## F4R+F4T · Mostrador ciclo-completo + El tablero — 🔵 AMBAS construidas, esperan gate (F4R en `f4-mostrador`, F4T en `f4-tablero`) · spec: [`f4r-f4t-design-spec.md`](f4r-f4t-design-spec.md) · plan: [`f4r-f4t-plan.md`](f4r-f4t-plan.md)

### BL-07 · Iteraciones v2 del módulo tablero · prioridad baja (post-F4T)
- **Origen:** brainstorming del 2026-07-09 (curación de widgets, spec §8).
- **Clientes que repiten** ("3 de tus 12 pedidos son clientes que ya pidieron") — buenísimo pero pide historial multi-día real → v2.
- **Merma/desperdicio** — el registro de la demo no lo captura; solo si el producto real lo captura.
- **Canal de entrada** — en la demo todo entra por Web, no discrimina nada; cobra sentido multi-canal.
- **Descartado con causa (no revivir):** predicciones ("mañana vas a vender X") — humo en una demo, mata credibilidad.

### BL-08 · ¿Ventana de período del tablero al store? · prioridad baja (decisión de arquitectura, a veredicto de Alan)
- **Origen:** build F4T (director, 2026-07-09). El plan sugería la ventana `today|week|month` en el store; quedó como React state en `Tablero.tsx` (selectores puros con `period` como arg) para **desacoplar** — un toggle del tablero no re-renderiza El mostrador. Reversible; si algún día otra sección necesita leer el período activo, mover al store es trivial.

## F4 (versión chip-FLIP) · — ⚠️ SUPERSEDED por F4R (la rama `f4-mostrador` es su base)

### BL-02 · Chips del mostrador = orden real con trazabilidad completa · ✅ RESUELTO Y CONSTRUIDO en F4R (rama `f4-mostrador`, esperando gate) · prioridad **alta**
- **Origen:** Alan (audio, 2026-07-04).
- **Problema:** los chips están **sosos** — hoy son "datos nomás", no parecen una orden real.
- **Deseo:** que el panel receptor (lado mostrador) muestre el **registro completo de la operación**. Si el cliente pide *6 medialunas*, el receptor ve: **quién** la pidió · **hora** del pedido · **cómo paga** · **para cuándo** la quiere · **canal** de entrada.
- **Por qué importa:** ese registro completo es la **trazabilidad** — el argumento de venta (Pulsimus vende infraestructura de conversión con registro, no diseño). Refuerza el diferenciador "los dos lados del mostrador".

### BL-03 · Preámbulo "vidriera → mostrador" · prioridad media
- **Origen:** Alan (2026-07-04), migrado de `landing-brief.md` §Post-v1.
- **Idea:** abrir la pieza F4 desde una "vidriera" (mini-feed IG estilizado con el sistema propio, sin logo/trade dress de Meta) que transiciona al mostrador interactivo, conectando con la tesis de Dolores ("Instagram es tu vidriera, no tu mostrador"). La demo congelada (§5 del brief) sigue siendo el corazón; esto sería solo la entrada narrativa. **NO** usar imágenes AI fotográficas sin curar como assets.

### BL-04 · Referencia de dirección de arte "mostrador de barrio premium" · prioridad baja (referencia, no ítem accionable)
- **Origen:** Alan (2026-07-04), migrado de `landing-brief.md` §Post-v1.
- **Qué es:** render AI de un mostrador físico noche + franja ámbar + madera clara con el latido al frente — paleta calcada a los tokens. Sirve como referencia de *feel* ("chapa noche, canto ámbar, fondo hueso") para los paneles de la demo, **no** como asset.

## F5 · CTA real (Cal.com + forms) — ⚪ pendiente (bloqueada por prerequisitos de Alan)
- **Prerequisitos de Alan** (§12 del brief, no son parqueos — son gates de arranque): registrar `pulsimus.dk` · backorder `pulsimus.com` (vence 2026-08-02) · mail `hola@pulsimus.dk` · cuenta Cal.com + evento "Diagnóstico gratis" · elegir servicio de forms.

_Sin parqueos de mejora todavía._

## F6 · Panel de QA — ⚪ pendiente
_Sin parqueos._

## Módulo EN — ⚪ pendiente (post-v1, antes del pitch a Prudence, vuelve 2026-07-13)

### BL-05 · Selector de idioma "mundo 3D" · prioridad baja (objeciones sin resolver)
- **Origen:** Alan (2026-07-02), referenciado desde `roadmap.md` §Parqueado.
- **Idea:** al abrir el selector aparece un globo 3D que gira y se para en el país del idioma.
- **Objeciones a resolver ANTES de construirlo:** (1) costo de three.js para un control que se usa una vez por visita; (2) banderas ≠ idiomas (¿qué bandera lleva el inglés?). Evaluar versión liviana 2D con el mismo espíritu.

## Slot Ejemplos (sección viva, nace oculta) — ⚪ pendiente contenido

### BL-06 · Primer contenido del slot Ejemplos · prioridad media
- **Origen:** `landing-brief.md` §Post-v1.
- **Qué:** primera muestra en el slot (FG/La Estancia con consentimiento de Agustín, o anonimizada). Sin tocar la estructura de la sección.

---

## Sin fase asignada
_Vacío._
