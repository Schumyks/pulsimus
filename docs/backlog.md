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

## F3 · Intro domesticada + motion kit — ✅ LIVE en `main`

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

## F4R+F4T · Mostrador ciclo-completo + El tablero — ✅ LIVE en `main` (merge 2026-07-14, OK de Alan "deployar tal como está"; fixes chicos diferidos a BL-12) · spec: [`f4r-f4t-design-spec.md`](archivo/mostrador-tablero/design-spec.md) · plan: [`f4r-f4t-plan.md`](archivo/mostrador-tablero/plan.md)

### BL-12 · Paquete de pulido post-deploy (tablero + mostrador) · prioridad media-alta — **acumulador del próximo lote**
- **Origen:** QA de Alan sobre el preview (2026-07-14): decidió deployar tal como está y mandar los fixes chicos en UN paquete más grande, no de a uno.
- **Ítems confirmados por Alan (14/07):**
  1. **La cola "⚡ Reservas por confirmar" no tiene scroll interno** — con muchas órdenes la card se estira y rompe el one-viewport de BL-09. Fix: mismo patrón que Retiros (`max-h` + `overflow-y-auto` + mask fade). Bug, va primero.
  2. **"TICKET PROM." a 1 línea** — a 357px de panel quiebra a 2 líneas y rompe la estructura de la card.
- **Veredictos que Alan YA dio (14/07, no volver a preguntar):** layout 3+3 ✓ · intensidad del flash del toggle ✓.
- **Acá se suman:** los ítems de BL-10 (lado La Espiga) cuando Alan los baje, y lo que salga de su QA sobre producción.

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
- **Resuelto con:** layout 3+3 (fila 1 = paneles sensibles al período, pegados al toggle; fila 2 = operativos), compactación de paddings/gaps/tracks, y **flash ámbar one-shot** en los paneles al togglear (`tablero-flash`, respeta reduced-motion). Sección 1590px → **860px** a 1440×900, verificado sobre build de PROD (invariantes 58/58, eco end-to-end, mobile sin overflow). Detalle y trade-offs a veredicto: [`gate-f4t/report.md`](archivo/mostrador-tablero/evidencia-tablero/report.md) § Addendum BL-09.

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
- **Prerequisitos de Alan** (§12 del brief, no son parqueos — son gates de arranque): registrar `pulsimus.dk` ✅ · backorder `pulsimus.com` (vence 2026-08-02) · mail `hola@pulsimus.dk` ✅ (16/07; falta cablear Gmail) · cuenta Cal.com + evento "Diagnóstico gratis" · elegir servicio de forms.
- **Intención declarada (16/07):** Alan planea comprar los dominios de España y Argentina (`pulsimus.es`, `.com.ar`/`.ar`) para buscar clientes en esas regiones → la landing debe mantenerse geo-neutral (sin anclarse a Copenhague en el copy).

- **⚠️ Deuda verificada (21/07, Fable):** el form del CTA es **maqueta** — botón `type="button"` sin handler ([`CtaFooter.tsx:166`](../app/components/CtaFooter.tsx)), no envía nada. Cablearlo (al mail `hola@pulsimus.dk` ya live, o al servicio de forms que elija Alan) es **prerequisito de mostrar el sitio a cualquier lead**. El guión narrativo lo reencuadra como "mandá tu señal" (mismos campos, copy a retocar recién en ese pase).

## F6 · Panel de QA — ⚪ pendiente
_Sin parqueos._

## Sección nueva "Quién está del otro lado" — 🔵 CONTRATO CERRADO (16/07), lista para build por pasos

### BL-13 · Sección "Quiénes somos / Quién es Alan" · prioridad **alta** (pedido directo de Alan, 2026-07-14)
- **Origen:** Alan (14/07): *"Tenemos que agregar una sección post agenda. Quiénes somos (quién soy en este caso). Porque al final del sitio firmo yo, Alan. QUIÉN ES ALAN es algo que falta."*
- **Problema real que resuelve:** el form cierra con "Te leo y escucho yo, Alan." — una firma personal sin cara ni historia detrás. La auditoría del 14/07 lo confirma: la prueba social/humana es el arma estándar del mercado y la landing no tiene ninguna. Para una agencia unipersonal, el "quién" ES parte de la prueba.
- **Ubicación tentativa:** después de la sección `#contacto` (¿o entre Proceso y contacto? — decidir con Alan).
- **A refinar CON Alan (barrido pendiente):** contenido (historia QA→builder, por qué negocios de barrio, Copenhague+argentino) · foto real vs ilustración (curación de Alan) · tono (voseo, primera persona) · qué NO decir (integridad: sin métricas infladas) · CTA propio o no · mobile · EN futuro.
- **Prep listo (14/07, sesión AFK):** [`bl13-refinamiento.md`](quien-soy/refinamiento.md) — 3 borradores de contenido en la voz canónica (A: oficio QA · B: argentino en CPH · C: sin humo) + cuestionario de 8 veredictos con recomendación. Alan reacciona ahí y de eso sale la tarea-contrato.
- **Refinamiento en curso (16/07, chat — segunda ronda):** BL-13 evolucionó a **pieza scrollytelling** (sección anclada, intro + paneles por fase que cambian al scrollear). Decidido: foto a la izquierda ✔ · ancla al scroll ✔ · titular panel Diseño "que tu web se vea como tu negocio merece" ✔ · paneles nombrados por FASE del proyecto, no por rol (Diseño/Construcción/Calidad) ✔ · **cada panel debe DEMOSTRAR, no narrar** (rechazados: historia de la tienda como contenido del panel, "la prueba sos vos scrolleando", Disney en el panel 3) · **SIN "argentino en Copenhague"** (Alan planea dominios .es/.ar para expandirse; la sección queda geo-neutral) · intro sin "yo puedo hacer algo mejor" (le suena creído; copy a definir después) · secuencia: planificar la pieza completa, lanzar por pasos (paso 1 = versión apilada estática) · canal: prototipo en código, no Claude Design (gotcha FG: comportamiento JS fino se corrige local igual).
- **Veredictos de Alan (16/07, vía toki — parciales):** ✔ ubicación: **entre Proceso y contacto** · ✔ imagen: **foto real con tratamiento estilo Faro Ámbar** ("ilustración de foto real, estilo ámbar"), curación de Alan · ✔ título: **"Quién está del otro lado"** · ✔ unipersonal: implícito · ✔ CTA: sin CTA propio (fluye al form, que queda justo debajo) · ✔ LinkedIn personal: SÍ, como ícono discreto bajo la foto · 🟠 **ABIERTO — dirección de contenido**: ninguno de los 3 borradores lo convenció (A "soso", B flojo el "en tu idioma", C el approach que más le gustó pero no del todo); se resuelve en chat · 🟠 ~~ABIERTO — mención Disney~~ → RESUELTO 16/07: **Disney AFUERA en todas partes** ("no me convence, a la mierda"). Resultado crudo: `~/.toki/result-bl13.json`.
- **▶️ REDEFINIDO por Alan (22/07, gate de escenas BL-17): quien-soy pasa a PÁGINA APARTE del sitio** — link permanente y visible en la barra de navegación ("si alguien realmente quiere saber quién está detrás, hace clic ahí"); la sección sale de la narrativa de la home para no mezclarse con la película. **Las demos se redistribuyen dentro del viaje:** skin switch → panel mission control E6 ([[BL-16]]) · fichas de Construcción → candidato dentro de E4 (dollhouse) o E5 (órbitas), "cuando estamos trabajando en la construcción" (se decide en esos bocetos) · toggle Calidad → a reubicar (página nueva o escena). El contrato de contenido de abajo (5 estaciones, copy, foto, criterios) sigue vigente como material de la PÁGINA; P1 en prod se migra; **P2 coreografía se replantea contra la forma página** al retomar BL-13.

---

#### TAREA-CONTRATO BL-13 (cerrada con Alan, 16/07/2026)

> **⚙️ Build formalizado en OpenSpec (16/07):** [`openspec/changes/bl13-quien-soy/`](../openspec/changes/bl13-quien-soy/) — proposal + spec (10 requirements con escenarios) + design (D1-D6) + `tasks.md` (15 tasks con verificación por task, gates de Alan como HITL). **Para el build, la fuente ejecutable es el cambio OpenSpec**; este contrato queda como acta del refinamiento. Skins+galería (BL-16/14) = cambio futuro `bl16-skins`.

**Objetivo:** la prueba humana que a la landing le falta (auditoría 14/07), construida como **pieza scrollytelling** que demuestra las capacidades de Alan EJECUTANDO, no narrando. Es la tercera pieza mayor de la landing (hermana del mostrador y el tablero).

**Ubicación:** entre Proceso y `#contacto`. La pieza desemboca en el form.

**Estructura (5 estaciones, cada panel ocupa el viewport COMPLETO; la sección se ancla al scrollear y transiciona entre estaciones con animaciones cuidadas — pedido explícito de Alan):**
1. **Intro** — foto real de Alan (tratamiento estilo Faro Ámbar, curación suya) a la izquierda + ícono LinkedIn (perfil personal) debajo + presentación corta.
2. **Panel DISEÑO** — titular aprobado: *"Que tu web se vea como tu negocio merece."* Izquierda: botón "Cambiar skin" + selector de 3 marcas (Faro Ámbar default + 2 skins de primera clase → [[BL-16]]). Derecha: pitch de diseño de marca (*branding desde cero, manual de uso de marca* — verdad verificable: el brand book de Faro Ámbar existe) + acceso a la galería de construcción de las marcas (→ [[BL-14]]).
3. **Panel CONSTRUCCIÓN** — mensaje: *"te escucho y te construyo a medida"* (titular final a redactar). Demo: 2-3 fichas de necesidad en idioma de mostrador ("tomo pedidos por WhatsApp", "doy turnos", "vendo por Instagram"); al tocar una, la mini-web del panel SE ARMA ante los ojos con la forma de esa necesidad; tocar otra la rearma distinta.
4. **Panel CALIDAD** — mensaje: *"la calidad es la experiencia"* (perfeccionismo punta a punta; NO "que nada llegue roto", demasiado básico). Demo **"sin alma / con alma"**: la misma pieza dos veces — plantilla genérica inerte vs versión con feedback, animación y flujo en cada detalle. Sin nombrar WordPress ni terceros.
5. **Remate** — el credo, solo, como momento alto: *"Para mí, la calidad es algo que nace del corazón."* → suelta el ancla → form.

**Reglas de copy (redacción final pendiente, es el único abierto):** en LA VOZ DE ALAN — partir de su muestra de voz transcripta (16/07, Engram) y sus frases aprobadas: *"Hace diez años que trabajo en calidad y diseño web"* · *"la calidad es la experiencia"* · *"si hay que hacerlo, hay que hacerlo bien; no vale la pena trabajar algo si no está bien hecho"*. Prohibido: em dashes, jerga (QA/dev/checks), Disney, geografía (geo-neutral por expansión .es/.ar), superlativos no verificables ("la más rápida" → "una de las más rápidas"), nombrar terceros, tono "creído" ("yo puedo hacer algo mejor" rechazado), voz de copywriter (4 borradores rechazados dan fe).

**Criterios de aceptación (barrido QA):**
- **Flujo feliz:** desktop 1440×900 — la sección ancla, las 5 estaciones transicionan con el scroll, los 3 demos responden, el remate suelta al form.
- **Mobile (375):** versión APILADA sin ancla (cada estación full-viewport apilada, reveals suaves); demos operables por tap; sin overflow horizontal.
- **`prefers-reduced-motion`:** apilado estático, demos en su estado final (con alma / skin default), cero animación de armado.
- **Estados de los demos:** skin se resetea al recargar (sin persistencia); fichas de Construcción con una activa por vez; toggle Calidad arranca en "con alma".
- **Performance:** verificación sobre build de PROD (gotcha Turbopack/inotify); sin FOUC al cambiar skin; presupuesto LCP/CLS de la landing intacto.
- **Accesibilidad:** operable por teclado (sin scroll-jacking que atrape el foco), contraste de tokens, `aria` en toggles/fichas.
- **Reversa:** cada paso entra por rama + gate de Alan; el paso N no rompe el paso N-1 shipeado.

**Lanzamiento por pasos (gates de Alan en cada uno):**
- **P1 · Estructura + copy real:** las 5 estaciones full-viewport APILADAS (sin ancla), foto, LinkedIn, copy final, demos como composición estática. → la prueba humana entra a prod ya.
- **P2 · Coreografía:** ancla + transiciones entre estaciones + demos Construcción y Calidad interactivos.
- **P3 · Skins + galería:** BL-16 completo (2 skins nuevos diseñados de verdad) + galería/manual de marca (BL-14).

**Insumos de Alan (gates de arranque):** P1: foto real elegida + veredicto del copy · P3: dirección estética de los 2 skins nuevos.
**Fuera de alcance v1:** EN · timeline/CV · logos de empleadores · link GitHub · sonido (evaluar recién en P2/P3, muted por defecto si entra).
**Canal:** prototipo y build EN CÓDIGO (rama `bl13-quien-soy`), verificación Playwright sobre build de prod; Claude Design solo si un skin pide exploración estética.
- **Insumo:** el posicionamiento "builder full-stack que dirige, con background QA y de diseño" ya está escrito en el perfil de Alan; la voz canónica en `CONTEXT.md`.

## Módulo EN — ⚪ pendiente · **prioridad BAJADA por Alan (14/07: "baja Prudence")** — se retoma cuando el pitch a Prudence vuelva a subir

### BL-05 · Selector de idioma "mundo 3D" · prioridad baja (objeciones sin resolver)
- **Origen:** Alan (2026-07-02), referenciado desde `roadmap.md` §Parqueado.
- **Idea:** al abrir el selector aparece un globo 3D que gira y se para en el país del idioma.
- **Objeciones a resolver ANTES de construirlo:** (1) costo de three.js para un control que se usa una vez por visita; (2) banderas ≠ idiomas (¿qué bandera lleva el inglés?). Evaluar versión liviana 2D con el mismo espíritu.

## Slot Ejemplos (sección viva, nace oculta) — ⚪ pendiente contenido

### BL-06 · Primer contenido del slot Ejemplos · prioridad media
- **Origen:** `landing-brief.md` §Post-v1.
- **Qué:** primera muestra en el slot (FG/La Estancia con consentimiento de Agustín, o anonimizada). Sin tocar la estructura de la sección.
- **Insumo nuevo (16/07):** Alan conserva en Figma (al menos parte de) sus diseños de la tienda gamer de Logg (2016+, armador de PC incluido) — candidatos a prueba de trabajo pasado para este slot o para [[BL-14]]. Evaluar derechos/consentimiento antes de publicar (marca de un ex-empleador).

---

## Sin fase asignada

### BL-14 · Galería "lo que puedo hacer conmigo, lo puedo hacer para el cliente" · prioridad media (a refinar)
- **Origen:** Alan (16/07, veredictos toki de BL-13, pregunta de la foto): *"Galería de fotos que demuestren dominio de marcas, estilos. Lo que puedo hacer conmigo, lo puedo hacer para el cliente. Toma la idea para avanzarla luego en otra sección."*
- **Idea:** una galería (sección propia, NO dentro de BL-13) de autorretratos/fotos de Alan tratados en distintos estilos de marca, demostrando rango de dirección de arte. Funciona como prueba de capacidad sin necesitar casos de clientes.
- **A refinar antes de construir:** relación con el slot Ejemplos (¿compite o convive?) · pipeline de generación (Higgsfield, canal: tandas las genera Alan, curación de Alan = fuente de verdad) · cuántos estilos · performance/peso.

### BL-16 · Skins de la landing — demo viva de rango de diseño · prioridad media (disparado desde el panel Diseño de BL-13)
- **Origen:** Alan (16/07, refinando BL-13): *"Quiero hacer distintos skins para la página. Como no tengo otros sitios para recomendar, muestro que puedo hacer distintos diseños sobre una misma página."*
- **Alcance DECIDIDO por Alan (16/07, 2ª ronda):** el reskin es de **TODA la página**, no de un componente contenido — *"la idea es tocar un botón y que se muestre en todo el sitio la capacidad"*. Botón tipo "Cambiar skin" en el panel Diseño de BL-13; al activarlo, llevar al usuario arriba de todo (o señalizar fuerte) para que note y explore el cambio completo.
- **Postura de marca (Alan, textual):** *"Es mi marca y la puedo manejar como quiera. Si quiero tener tres diseños de marca distintos para Pulsimus, los tengo. Faro Ámbar es uno de ellos."* → los skins son diseños de marca de primera clase, Faro Ámbar es el default.
- **Regla de costo/calidad (del director, aceptación pendiente):** cada skin es un PASE DE DISEÑO COMPLETO sobre todas las secciones (incl. mostrador La Espiga y tablero, que tienen paletas propias) — un skin "solo recolor" se ve barato y desmiente el mensaje. Mejor 1-2 skins excelentes que 4 mediocres.
- **A refinar antes de construir:** cuántos skins v1 y sus direcciones estéticas · técnica (tokens Tailwind v4 `@theme` → swap de variables CSS; assets por skin) · default Faro Ámbar + sin persistencia (se resetea al recargar) · performance/FOUC · reduced-motion en la transición.
- **Nota de secuencia:** paso TARDÍO de BL-13 — necesita el panel Diseño existente y los skins diseñados.
- **▶️ Ubicación del trigger REDEFINIDA por Alan (22/07):** el botón "Cambiar skin" ya NO vive en el panel Diseño de quien-soy (que pasa a página aparte) — **vive en el panel de mission control (E6, tablero)**: el usuario pasa por ahí en el viaje y lo toca para ver cambiar el sistema entero. El boceto de E6 (`bl17-escenas` task 7.1) reserva el slot; el build del reskin sigue siendo BL-16.
- **Efecto de transición del reskin (Alan, 18/07):** al tocar "Cambiar skin", un **BARRIDO** recorre la página (izq→der o arriba→abajo) y los componentes cambian de estilo **uno por uno** a medida que pasa el barrido, en tiempo real. Factible **nativo** con View Transitions API + máscara animada (probablemente sin el truco del video-overlay); si el cambio nativo fuera instantáneo, una capa de video/opacidad sincronizada al barrido lo simula. Candidato a ser el **cierre animado narrativo** de la V1.
- **Parte de la V1 completa** (Alan, 18/07): junto con la estrella [[BL-17]], completar quien-soy [[BL-13]] y el cierre animado narrativo.
- **Candidato a skin (Alan, 21/07):** skin **"cómic"** — las mismas escenas del guión narrativo ([`bl17-guion-narrativo.md`](direccion/guion-narrativo.md)) contadas en viñetas generadas. Regla del guión: **guión invariante, piel intercambiable** — un skin re-renderiza los mismos assets/escenas con otro estilo, la narrativa no cambia. Nota de costo: es el skin más caro posible (regenerar el set completo de assets); decidir si entra entre los 2 skins de primera clase recién al arrancar BL-16.
- **Candidato a skin #2 (Alan, 21/07):** skin **"pixel art"** — mismas escenas renderizadas en pixel art, produciendo assets con Aseprite (Alan lo tiene). **Investigación 21/07 (Fable): VIABLE.** Ecosistema real: [`pixel-plugin`](https://github.com/willibrandon/pixel-plugin) = plugin de **Claude Code** (instalación `claude plugin install pixel-plugin`, requiere Aseprite ≥1.3) con slash commands (`/pixel-new`, `/pixel-palette`, `/pixel-export`), 14+ paletas retro preset, export PNG/GIF/spritesheet+JSON; debajo está [`pixel-mcp`](https://github.com/willibrandon/pixel-mcp) (Go, 40+ tools vía CLI+Lua de Aseprite); alternativa [Aseprite MCP Pro](https://aseprite-mcp.abyo.net/) (121 tools, WebSocket al editor vivo, terceros). **Decisión técnica: los assets pixel se shipean como PNG chico + `image-rendering: pixelated` (CSS), NUNCA como SVG** — el SVG pixel-perfect (un rect por píxel) pesa órdenes de magnitud más que el PNG equivalente sin aportar nada: el escalado nítido lo da CSS, y el control fino de color lo da la paleta indexada de Aseprite. Animación idle = sprite sheets con `steps()` en CSS. Workflow candidato: imagen generada (Higgsfield "pixel art style") → cuantización grilla+paleta (pipeline sharp o Aseprite CLI nativo: resize nearest + color mode indexed) → retoque a mano de Alan en Aseprite → export automatizado. Pendiente al arrancar: **spike práctico** del plugin (probar calidad real de las tools; el plugin no documenta importar imagen existente — eso lo cubre Aseprite CLI/Lua nativo).

### BL-17 · Estrella narrativa a nivel sitio — hilo conductor de toda la landing · prioridad **ALTA** (dirección V1 de Alan, 2026-07-18)
- **Origen:** Alan (18/07). Narrativa: la estrella de Pulsimus existe quieta en el vacío → un evento la acciona → viaja por el sitio al scrollear → sus **pulsos dan vida y CONSTRUYEN las secciones** → cierra con el logo. *El scroll ES el viaje; el viaje ES el sitio construyéndose.*
- **📖 GUIÓN NARRATIVO CANÓNICO (21/07, bendecido por Alan):** [`bl17-guion-narrativo.md`](direccion/guion-narrativo.md) — la historia completa del protagonista (supernova destruye Y siembra → radar → cinturón de dolores → aterrizaje/tienda dollhouse iso → órbitas → mission control → navegante → mandá tu señal) + canon visual (flat+iso, "la luz es ámbar", capas Z0–Z4, assets animados en 3 niveles, EKG dosificado en 4 apariciones) + pipeline de assets con template maestro. **Firme hasta Tablero; Quien-soy y CTA revisables.** Toda decisión de asset/animación/copy se valida contra ese doc; absorbe e integra `bl17-estrella-guion.md` (la estrella = manifestación visible del pulso).
- **🎨 Canon de generación de assets (21/07):** [`canon-assets-higgsfield.md`](direccion/canon-assets.md) — doc maestro para generar en Higgsfield: decisiones de diseño con porqué, 4 tipos de asset con specs, template de prompt maestro, checklist anti-canon para curar, workflow (Alan genera y cura → Claude procesa y monta → validación en sitio) y los 5 prompts del set de prueba. El guión manda sobre el QUÉ; este doc sobre el CÓMO.
- **📦 Tanda 1 procesada y shippeada (21/07):** 8 piezas en `public/space/{z1,z2,chars,scenes}/` (~278KB total): 2 nebulosas Z1, galaxy-icon, 2 asteroides con cara, alien, dueño v1 (casting a iterar), fachada tienda. Pipeline Bun+sharp documentado en Engram obs 350.
- **✅ Montaje de validación EJECUTADO (21/07):** `SpaceDecor.tsx` (nebulosas Z1 blend screen + asteroides umbral 1 + tienda/alien umbral 2), verificado Playwright sobre build de prod (mobile/reduced limpios, parallax vivo). Veredicto: canon APROBADO montado; choque flat-vs-nubes-fotográficas confirmado → **nubes fotográficas ELIMINADAS de StarLayer ese mismo día** (dirección de Alan). Gotchas sellados en Engram obs 352 (z-40 de nubes, clamp del parallax in-flow, mask radial que muere antes del borde del plate).
- **▶️ PIVOTE 21/07 — ARQUITECTURA DE ESCENAS (dirección de Alan, es el build principal de BL-17):** la página es una película de scroll — escenas full-viewport/umbral variable con el timing que cada momento narrativo merece, transiciones dirigidas escena↔sección, avance "por momentos". Contrato completo en [`bl17-guion-narrativo.md`](direccion/guion-narrativo.md) § Arquitectura de escenas (mapa tentativo E0–E7). Sub-tareas: (1) spike 1 escena punta a punta con GSAP ScrollTrigger pin/scrub (ya en stack); (2) **intro supernova REVAMP al guión** (hoy 8s genéricos; debe contar la escena 0 con su impacto); (3) nubes FLAT regeneradas con rol único = escena del aterrizaje (pre-Mostrador); (4) escenas restantes una a una, cada una gateada por Alan.
- **Alcance V1 (DECIDIDO):** se construye en **2D + pseudo-3D** — Canvas 2D + GSAP ScrollTrigger + Lenis; parallax por capas / profundidad fingida, **sin shaders**. Capa aditiva **ENCIMA** de las secciones reales (no rebuild). Tiene que ser "wow" para vender igual.
- **Ferrari (PRÓXIMA ÉPICA, diferido):** versión WebGL/Three.js (partículas volumétricas, brillo 3D). La coreografía GSAP del boceto 2D se **REUSA** al subir a WebGL. Diferido por costo (~800k–1.5M+) y foco (facturar antes que pulir la vidriera; la landing aún no se muestra).
- **⚙️ Formalizado en OpenSpec (22/07):** [`openspec/changes/bl17-escenas/`](../openspec/changes/bl17-escenas/) — proposal + design (D1–D8) + specs (`motor-escenas` + `escenas-narrativas`, las 8 escenas como requirements con escenarios) + tasks (9 grupos, ciclo boceto→gate→build→gate por escena). Fuente ejecutable del build de escenas.
- **🎬 Pipeline de VIDEO como asset (dirección de Alan, 22/07):** Alan genera en Higgsfield videos cortos bien dirigidos (diseños de personaje → acciones/reacciones, ~8s o micro-clips por beat) y se unifican — candidato fuerte para la intro E0 ("una versión CSS simplificada no tendría el mismo impacto") y para beats de personaje por escena. **Matiz del descarte del 18/07 (abajo):** aquello descartó video como MOTOR del scroll; video como intro autoplay o micro-clip de personaje es válido. Dirección de assets por escena: [`bl17-assets-direccion.md`](direccion/assets-direccion.md).
- **Fundamento técnico (research 18/07, Engram obs 327 + summary):** video horneado (Higgsfield) descartado — no interactúa con el DOM. Referencias: [journey.zajno.com](https://journey.zajno.com/) (narrativa/transiciones, **favorito de Alan**), [igloo.inc](https://www.igloo.inc/) (cámara viaja por lugares), [loopspeed.co.uk](https://www.loopspeed.co.uk/) (partículas construyen formas → para **demos/experiencias puntuales**, no motor principal). Las 3 son WebGL.
- **Relación:** materializa [[BL-01]] (scroll con pulso, página viva). Es el paraguas de la **V1 COMPLETA** = esta estrella + completar quien-soy [[BL-13]] + los 3 skins [[BL-16]] + el cierre animado narrativo.
- **Estimación piloto 2D:** ~450–800k tokens / ~65–115 min (Heavy, área nueva GSAP/Lenis/Canvas en Next 16). Arrancar por **spike Fase 1** (fundación GSAP+Lenis+canvas SSR-safe) para de-riskear antes de comprometer el resto.
- **Modelo:** se trabaja con **Fable** (visual/creativo/narrativo).

### BL-18 · Rive como herramienta de assets animados/interactivos · prioridad media (candidato a evaluar, NO adoptado)
- **Origen:** Alan (21/07 noche, cierre de sesión): "Rive parece ser una plataforma interesante. ¿Se puede conectar con Claude vía MCP?"
- **Qué es:** editor de animación interactiva (state machines, rigging por huesos, data binding) que exporta `.riv` livianos; el runtime web (`@rive-app/canvas`/`webgl`) es open source y gratis. Encaja con el nivel 2 del canon (rigging por capas de protagonistas) y con demos interactivos (fichas de Construcción BL-13, asteroides destruibles E2).
- **MCP verificado (21/07):** existen DOS vías. (1) [MCP oficial de Rive](https://rive.app/docs/editor/ai/mcp) — controla el EDITOR desktop, pero **solo Windows/macOS** → en el Linux de Alan hoy NO corre (gotcha duro). (2) [RiveMCP comunitario](https://rivemcp.stunning.gg/) — headless, genera/edita `.riv` por código sin editor (139 tools, `npx rivemcp`), corre en Linux; **3 exports gratis por máquina, después licencia paga**. Editor Rive: plan free para crear; premium desde ~9 USD/mes.
- **Costo de tokens (aclaración conceptual):** NINGÚN MCP es gratis en tokens de Claude — cada tool call, schema y resultado consume contexto de la sesión. Lo que puede ser gratis es el lado Rive (herramienta local). No confundir las dos monedas.
- **A resolver en el spike (cuando una escena lo pida, no antes):** calidad real del RiveMCP comunitario en Linux · si 3 exports alcanzan para evaluar · integración `.riv` + ScrollTrigger (Rive tiene scroll binding propio, ¿convive con el motor único?) · peso/perf vs sprites+CSS del canon · ROI vs dispersión (el canon actual cubre la V1; Rive es candidato para nivel 2 / BL-16, no prerequisito).

### BL-15 · Presencia LinkedIn de Pulsimus · prioridad baja (tarea externa, no de código)
- **Origen:** Alan (16/07, veredictos toki de BL-13): *"Después creamos LinkedIn para Pulsimus y para que se vea reflejado en mi cuenta de LinkedIn."*
- **Qué:** crear la página de empresa Pulsimus en LinkedIn + reflejar el rol en el perfil personal de Alan. Se coordina con el pitch a Agustín (¿qué se publica primero?). No bloquea nada de la landing; el ícono de LinkedIn de BL-13 apunta al perfil personal mientras tanto.

### BL-19 · Editor visual de coreografía de escena ("tuner" drag + path) · prioridad **ALTA** (habilitador del build de escenas)
- **Origen:** Alan (2026-07-23/24, sesión pipeline de assets). Intuición textual: *"vamos a tener que armar un prototype que me permita arrastrar los elementos, moverlos, transformarlos, y/o trazar un pathing por la escena a medida que hacemos play. Para tunear a mano el comportamiento. Sino vamos a iterar demasiadas veces hasta que quede como pienso."*
- **Qué es:** un editor en el browser (evolución del patrón `?tune` del proyecto) que carga las piezas 🎨 recortadas de una escena y permite, A MANO: arrastrarlas (posición), transformarlas (escala/rotación/opacidad) y trazar un PATH/trayectoria; con PLAY/scrub para ver el comportamiento contra el progreso (scroll/tiempo). Alan tunea la coreografía visualmente y exporta los params → Claude los convierte en la animación real (canvas/GSAP). Reemplaza el ciclo lento "código → build → mirar → corregir" por tuneo directo.
- **A refinar antes de construir (barrido QA, CON Alan):** qué se edita (posición/escala/rotación/opacidad/path/keyframes de timing) · cómo se define el path (puntos + curva atados al progreso p 0→1) · play/scrub y velocidad · **formato de EXPORT** de params (JSON que consuma el motor de escenas, mapeo 1:1 con lo que Claude anima) · alcance (¿una escena por vez? multi-capa / z-order) · persistencia (guardar/cargar un tune) · reduced-motion/mobile fuera del editor (es herramienta de autor).
- **Arquitectura:** HERRAMIENTA DE AUTOR (dev-only, NO shippea a prod), como los paneles `?tune`. Alto ROI: evita las iteraciones que Alan ya anticipa. Se construye/usa ANTES o EN PARALELO al armado de la primera escena con assets.
- **Relación:** habilita [[BL-17]] (escenas); consume el pipeline de [`pipeline-assets.md`](direccion/pipeline-assets.md) (piezas recortadas 🎨).

### BL-20 · Auto-calcado de precisión (vectorización diferenciable) · prioridad media · PARQUEADO (Opción B)
- **Origen:** Alan (2026-07-24, spike de vectorización). Decisión: probar **Opción A** (vtracer + trace híbrido + primitivas medidas) primero; **B parqueada como alternativa** para cuando A no alcance la vara.
- **Qué es:** el carril SOTA de vectorización por **optimización diferenciable** — `diffvg` (base) + `LIVE`/`SGLIVE` (capas separables + gradientes) + `Bézier Splatting` (velocidad), orquestable con `PyTorch-SVGRender`. Minimiza un loss contra el raster = el **"loop-hasta-score" como descenso de gradiente**. Detalle en [`vectorizacion-research.md`](direccion/vectorizacion-research.md).
- **Por qué parqueado:** es un **proyecto de ML** (PyTorch/CUDA), no un script. VRAM en la RTX 3070 (8GB) **sin validar** (timings publicados son de una 3090 Ti de 24GB). El rigging es inferencia (las capas requieren curación). Y las 2 piezas clave para NUESTRO loop (score localizado + refinamiento por LLM) quedaron **sin evidencia** en el research.
- **Cuándo activar:** si la Opción A pulida **no llega a la vara** en piezas complejas, y/o tras el **upgrade a RTX 5080 16GB**. Antes de construir: barrido QA CON Alan (métrica de score, criterio de convergencia, fallback).
- **Relación:** alternativa al **paso 5 (trace híbrido)** de [`pipeline-assets.md`](direccion/pipeline-assets.md); habilita la "línea de agentes Sonnet en loop-hasta-95%" que propuso Alan (requiere una métrica de score objetiva primero).

### BL-21 · Separación de objetos pegados en composite (edges + watershed + flag de confianza) · prioridad media · PARQUEADO
- **Origen:** Alan (2026-07-24, sesión de método de vectorización). Surgió analizando cómo separar objetos INTERNOS adyacentes de color similar en un composite (buzón/cartel sobre la pared).
- **El nudo:** el chroma separa la tienda del VERDE, pero los objetos internos no están sobre verde — están sobre la pared. Sin verde entre medio, connected-components los fusiona en un blob. El chroma da la silueta EXTERNA; la separación INTERNA necesita otra señal.
- **Qué es:** carril de segmentación para objetos que se tocan. **Técnica CORREGIDA por research 2** ([`tecnicas-mapeo-verificacion-research.md`](direccion/tecnicas-mapeo-verificacion-research.md)): la separación es **por COLOR/gradiente, NO por silueta** — la erosión de la máscara NO separa sin cintura cóncava (dos objetos a ras no la tienen; es la trampa del tutorial de "monedas"). Pipeline: **mean-shift** (mata el ruido del degradé IA) → **flood-fill con seeds por objeto** → si falla, **Canny restringido a la máscara** → **watershed sobre GRADIENTE DE COLOR** (semillas = los componentes cortados por el edge, no de erosionar) → fallback Felzenszwalb+RAG. + **flag de confianza** (borde débil → NO adivinar, flaggear la frontera incierta).
- **Por qué parqueado:** Alan lo parqueó explícitamente. Techo real: si NO hay ninguna división (color idéntico, cero borde) es irrecuperable desde la imagen → ahí gana el input INDIVIDUAL. La oclusión ya la resuelve el z-order del ensamble (la pieza de atrás se dibuja completa).
- **Valor doble:** (1) exprimir el composite en el test de estrés; (2) el flag de confianza es un **detector de ambigüedad** = la regla objetiva de "cuándo pedir el asset individual" en vez de romper en silencio.
- **Relación:** endurece el paso 4 (limpiar+separar) de [`pipeline-assets.md`](direccion/pipeline-assets.md); complementa el gate de recorte (anillo perimetral + mapa de residuo) discutido en la misma sesión. Ver skill `asset-vectorizer`.

### BL-22 · Segmentación por GPU para mapeo de piezas (Grounded-SAM) · prioridad media · PARQUEADO
- **Origen:** research 2 (2026-07-24, [`tecnicas-mapeo-verificacion-research.md`](direccion/tecnicas-mapeo-verificacion-research.md) § Eje 1a). Carril de MAPEO por GPU — análogo al BL-20 (que es de calcado) pero para **separar/localizar piezas**.
- **Qué es:** patrón **Grounded-SAM** — vocabulario CERRADO por escena (fachada/toldo/cartel/buzón/puerta/carita) → prompt de texto por pieza esperada → caja (Grounding DINO / YOLO-World) → máscara fina con un **SAM liviano** (MobileSAM ~330MB / EdgeSAM, ambos entran en 8GB). Reemplaza "segmentar todo y clasificar después".
- **Por qué parqueado:** (a) **VRAM sin validar** — ningún repo publica cifras, medir empírico en la 3070; (b) **SAM tiende a fundir partes distintas en arte SIN textura** (evidencia de line-art/manga) — el contraste del canon índigo/ámbar *podría* salvarlo pero SIN evidencia directa sobre Kurzgesagt → probar antes; (c) **licencias:** FastSAM/YOLO-World son AGPL-3.0 (traba para producto cerrado) → preferir MobileSAM/EdgeSAM (Apache/MIT).
- **Cuándo activar:** si el mapeo por scripts (regionprops / connected-components / separación por color del BL-21) no alcanza en composites complejos, o para acelerar. Antes de construir: spike de VRAM en la 3070 + prueba en un asset flat real.
- **Relación:** alternativa GPU al paso 4 (mapeo) de [`pipeline-assets.md`](direccion/pipeline-assets.md); z-order NO hace falta en el camino principal (piezas ya desarmadas).
