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
- **Origen:** Alan (audio, 2026-07-04). **Reiterado y ampliado por Alan el 2026-07-14** (sesión de auditoría) → prioridad sube a **alta**.
- **Problema:** la marca martilla el "pulso", pero el **acto de scrollear** no lo transmite. El motion actual late en los `PulseDivider` y en los reveals `[data-rv]`, pero el scroll en sí se siente inerte. Alan (14/07): *"siento que le falta vida a Pulsimus"* — hoy la página es tipografía sobre un fondo hueso plano, sin fondo activo.
- **Deseo (ampliado 14/07):** **capas de movimiento en el fondo** — al scrollear, los objetos de fondo NO se mueven todos a la misma velocidad (parallax multi-capa); usar el fondo para **animar el sitio a medida que se scrollea**; que la página sea más reactiva en general.
- **Referencias de Alan (14/07, capturas en research de auditoría):**
  - `phinxlab.com` (ex-empleador) — fondo estelar oscuro con partículas geométricas flotando a distintas profundidades + tipografía display gigante (outline/sólida) + color blocking full-bleed por sección. "Me gusta cómo usan el fondo a favor."
  - `ancla.digital` — franjas de color full-bleed por sección con separadores de onda; el fondo cambia de color y marca el ritmo del scroll.
- **Traducción al lenguaje Faro Ámbar (dirección posible, sin comprometer):** constelación/partículas del símbolo pulso→estrella en capas parallax sobre las franjas noche · la línea de electro como elemento de fondo que recorre/conecta secciones al scrollear · scroll-driven animations (CSS `animation-timeline` / IO) · latido sutil sincronizado con el desplazamiento. Respetar `useReducedMotion` end-to-end y presupuesto de performance (LCP/CLS).
- **Recurso disponible:** Higgsfield para generar assets de imagen/video si hicieran falta (regla de canal: tandas las genera Alan en su UI web; curación de Alan = fuente de verdad).
- **Estado:** pendiente de **refinamiento a tarea-contrato CON Alan** (barrido QA: qué secciones, densidad, mobile, performance, reduced-motion, fuera-de-alcance) antes de construir.

## F4R+F4T · Mostrador ciclo-completo + El tablero — 🔵 AMBAS construidas, esperan gate (F4R en `f4-mostrador`, F4T en `f4-tablero`) · spec: [`f4r-f4t-design-spec.md`](f4r-f4t-design-spec.md) · plan: [`f4r-f4t-plan.md`](f4r-f4t-plan.md)

### BL-07 · Iteraciones v2 del módulo tablero · prioridad baja (post-F4T)
- **Origen:** brainstorming del 2026-07-09 (curación de widgets, spec §8).
- **Clientes que repiten** ("3 de tus 12 pedidos son clientes que ya pidieron") — buenísimo pero pide historial multi-día real → v2.
- **Merma/desperdicio** — el registro de la demo no lo captura; solo si el producto real lo captura.
- **Canal de entrada** — en la demo todo entra por Web, no discrimina nada; cobra sentido multi-canal.
- **Descartado con causa (no revivir):** predicciones ("mañana vas a vender X") — humo en una demo, mata credibilidad.

### BL-08 · ¿Ventana de período del tablero al store? · prioridad baja (decisión de arquitectura, a veredicto de Alan)
- **Origen:** build F4T (director, 2026-07-09). El plan sugería la ventana `today|week|month` en el store; quedó como React state en `Tablero.tsx` (selectores puros con `period` como arg) para **desacoplar** — un toggle del tablero no re-renderiza El mostrador. Reversible; si algún día otra sección necesita leer el período activo, mover al store es trivial.

### BL-09 · Densidad del tablero — que entre TODO sin scroll · ✅ RESUELTO Y CONSTRUIDO (2026-07-14, en `f4-tablero`, esperando gate) · prioridad **alta**
- **Origen:** Alan, revisión en dev local (2026-07-09 ~23:40).
- **Problema:** el tablero pedía scroll y el toggle **Día/Semana/Mes** actualizaba datos debajo del fold (sin feedback visible).
- **Resuelto con:** layout 3+3 (fila 1 = paneles sensibles al período, pegados al toggle; fila 2 = operativos), compactación de paddings/gaps/tracks, y **flash ámbar one-shot** en los paneles al togglear (`tablero-flash`, respeta reduced-motion). Sección 1590px → **860px** a 1440×900, verificado sobre build de PROD (invariantes 58/58, eco end-to-end, mobile sin overflow). Detalle y trade-offs a veredicto: [`gate-f4t/report.md`](gate-f4t/report.md) § Addendum BL-09.

### BL-11 · Video/animación de fondo en loop para una sección · prioridad media (a refinar con Alan)
- **Origen:** Alan (nota mid-sesión, 2026-07-14): *"idea para la sección Cómo trabajamos (o alguna sección): incorporar video de fondo o animación generada que quede en loop, de un negocio o corazón latiendo"*.
- **Idea:** fondo ambiental en loop (video generado con Higgsfield, o animación) detrás de una sección — candidatas: Proceso/"Cómo trabajamos" o el CTA. Motivo: sumar vida (mismo tema que [[BL-01]], distinta técnica: asset en loop vs. capas parallax en código).
- **A resolver en el refinamiento (antes de construir):** (1) tensión con la regla "demo = CÓDIGO jamás video" — aplica a las piezas de demo, un fondo ambiental es otra cosa, pero confirmarlo con Alan; (2) peso/performance (LCP, datos en mobile) y `prefers-reduced-motion` (el loop se congela); (3) legibilidad del texto encima; (4) canal Higgsfield: tandas las genera Alan en su UI web (0 créditos), curación de Alan = fuente de verdad.

### BL-10 · Mejoras del lado La Espiga (mostrador) — post-QA · prioridad media-alta (a definir tras QA de Alan)
- **Origen:** Alan, revisión en dev local (2026-07-09 ~23:40): *"aún hay cosas a mejorar, especialmente en el lado de La Espiga"*.
- **Estado:** sin especificar todavía — Alan hace un QA más fino **mañana (2026-07-10)** y baja los ítems concretos acá. Placeholder para no perder la señal.

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
