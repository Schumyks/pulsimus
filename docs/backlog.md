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

## F4R+F4T · Mostrador ciclo-completo + El tablero — ✅ LIVE en `main` (merge 2026-07-14, OK de Alan "deployar tal como está"; fixes chicos diferidos a BL-12) · spec: [`f4r-f4t-design-spec.md`](f4r-f4t-design-spec.md) · plan: [`f4r-f4t-plan.md`](f4r-f4t-plan.md)

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
- **Prerequisitos de Alan** (§12 del brief, no son parqueos — son gates de arranque): registrar `pulsimus.dk` ✅ · backorder `pulsimus.com` (vence 2026-08-02) · mail `hola@pulsimus.dk` ✅ (16/07; falta cablear Gmail) · cuenta Cal.com + evento "Diagnóstico gratis" · elegir servicio de forms.
- **Intención declarada (16/07):** Alan planea comprar los dominios de España y Argentina (`pulsimus.es`, `.com.ar`/`.ar`) para buscar clientes en esas regiones → la landing debe mantenerse geo-neutral (sin anclarse a Copenhague en el copy).

_Sin parqueos de mejora todavía._

## F6 · Panel de QA — ⚪ pendiente
_Sin parqueos._

## Sección nueva "Quién está del otro lado" — 🔵 CONTRATO CERRADO (16/07), lista para build por pasos

### BL-13 · Sección "Quiénes somos / Quién es Alan" · prioridad **alta** (pedido directo de Alan, 2026-07-14)
- **Origen:** Alan (14/07): *"Tenemos que agregar una sección post agenda. Quiénes somos (quién soy en este caso). Porque al final del sitio firmo yo, Alan. QUIÉN ES ALAN es algo que falta."*
- **Problema real que resuelve:** el form cierra con "Te leo y escucho yo, Alan." — una firma personal sin cara ni historia detrás. La auditoría del 14/07 lo confirma: la prueba social/humana es el arma estándar del mercado y la landing no tiene ninguna. Para una agencia unipersonal, el "quién" ES parte de la prueba.
- **Ubicación tentativa:** después de la sección `#contacto` (¿o entre Proceso y contacto? — decidir con Alan).
- **A refinar CON Alan (barrido pendiente):** contenido (historia QA→builder, por qué negocios de barrio, Copenhague+argentino) · foto real vs ilustración (curación de Alan) · tono (voseo, primera persona) · qué NO decir (integridad: sin métricas infladas) · CTA propio o no · mobile · EN futuro.
- **Prep listo (14/07, sesión AFK):** [`bl13-refinamiento.md`](bl13-refinamiento.md) — 3 borradores de contenido en la voz canónica (A: oficio QA · B: argentino en CPH · C: sin humo) + cuestionario de 8 veredictos con recomendación. Alan reacciona ahí y de eso sale la tarea-contrato.
- **Refinamiento en curso (16/07, chat — segunda ronda):** BL-13 evolucionó a **pieza scrollytelling** (sección anclada, intro + paneles por fase que cambian al scrollear). Decidido: foto a la izquierda ✔ · ancla al scroll ✔ · titular panel Diseño "que tu web se vea como tu negocio merece" ✔ · paneles nombrados por FASE del proyecto, no por rol (Diseño/Construcción/Calidad) ✔ · **cada panel debe DEMOSTRAR, no narrar** (rechazados: historia de la tienda como contenido del panel, "la prueba sos vos scrolleando", Disney en el panel 3) · **SIN "argentino en Copenhague"** (Alan planea dominios .es/.ar para expandirse; la sección queda geo-neutral) · intro sin "yo puedo hacer algo mejor" (le suena creído; copy a definir después) · secuencia: planificar la pieza completa, lanzar por pasos (paso 1 = versión apilada estática) · canal: prototipo en código, no Claude Design (gotcha FG: comportamiento JS fino se corrige local igual).
- **Veredictos de Alan (16/07, vía toki — parciales):** ✔ ubicación: **entre Proceso y contacto** · ✔ imagen: **foto real con tratamiento estilo Faro Ámbar** ("ilustración de foto real, estilo ámbar"), curación de Alan · ✔ título: **"Quién está del otro lado"** · ✔ unipersonal: implícito · ✔ CTA: sin CTA propio (fluye al form, que queda justo debajo) · ✔ LinkedIn personal: SÍ, como ícono discreto bajo la foto · 🟠 **ABIERTO — dirección de contenido**: ninguno de los 3 borradores lo convenció (A "soso", B flojo el "en tu idioma", C el approach que más le gustó pero no del todo); se resuelve en chat · 🟠 ~~ABIERTO — mención Disney~~ → RESUELTO 16/07: **Disney AFUERA en todas partes** ("no me convence, a la mierda"). Resultado crudo: `~/.toki/result-bl13.json`.

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
- **Efecto de transición del reskin (Alan, 18/07):** al tocar "Cambiar skin", un **BARRIDO** recorre la página (izq→der o arriba→abajo) y los componentes cambian de estilo **uno por uno** a medida que pasa el barrido, en tiempo real. Factible **nativo** con View Transitions API + máscara animada (probablemente sin el truco del video-overlay); si el cambio nativo fuera instantáneo, una capa de video/opacidad sincronizada al barrido lo simula. Candidato a ser el **cierre animado narrativo** de la V1.
- **Parte de la V1 completa** (Alan, 18/07): junto con la estrella [[BL-17]], completar quien-soy [[BL-13]] y el cierre animado narrativo.

### BL-17 · Estrella narrativa a nivel sitio — hilo conductor de toda la landing · prioridad **ALTA** (dirección V1 de Alan, 2026-07-18)
- **Origen:** Alan (18/07). Narrativa: la estrella de Pulsimus existe quieta en el vacío → un evento la acciona → viaja por el sitio al scrollear → sus **pulsos dan vida y CONSTRUYEN las secciones** → cierra con el logo. *El scroll ES el viaje; el viaje ES el sitio construyéndose.*
- **Alcance V1 (DECIDIDO):** se construye en **2D + pseudo-3D** — Canvas 2D + GSAP ScrollTrigger + Lenis; parallax por capas / profundidad fingida, **sin shaders**. Capa aditiva **ENCIMA** de las secciones reales (no rebuild). Tiene que ser "wow" para vender igual.
- **Ferrari (PRÓXIMA ÉPICA, diferido):** versión WebGL/Three.js (partículas volumétricas, brillo 3D). La coreografía GSAP del boceto 2D se **REUSA** al subir a WebGL. Diferido por costo (~800k–1.5M+) y foco (facturar antes que pulir la vidriera; la landing aún no se muestra).
- **Fundamento técnico (research 18/07, Engram obs 327 + summary):** video horneado (Higgsfield) descartado — no interactúa con el DOM. Referencias: [journey.zajno.com](https://journey.zajno.com/) (narrativa/transiciones, **favorito de Alan**), [igloo.inc](https://www.igloo.inc/) (cámara viaja por lugares), [loopspeed.co.uk](https://www.loopspeed.co.uk/) (partículas construyen formas → para **demos/experiencias puntuales**, no motor principal). Las 3 son WebGL.
- **Relación:** materializa [[BL-01]] (scroll con pulso, página viva). Es el paraguas de la **V1 COMPLETA** = esta estrella + completar quien-soy [[BL-13]] + los 3 skins [[BL-16]] + el cierre animado narrativo.
- **Estimación piloto 2D:** ~450–800k tokens / ~65–115 min (Heavy, área nueva GSAP/Lenis/Canvas en Next 16). Arrancar por **spike Fase 1** (fundación GSAP+Lenis+canvas SSR-safe) para de-riskear antes de comprometer el resto.
- **Modelo:** se trabaja con **Fable** (visual/creativo/narrativo).

### BL-15 · Presencia LinkedIn de Pulsimus · prioridad baja (tarea externa, no de código)
- **Origen:** Alan (16/07, veredictos toki de BL-13): *"Después creamos LinkedIn para Pulsimus y para que se vea reflejado en mi cuenta de LinkedIn."*
- **Qué:** crear la página de empresa Pulsimus en LinkedIn + reflejar el rol en el perfil personal de Alan. Se coordina con el pitch a Agustín (¿qué se publica primero?). No bloquea nada de la landing; el ícono de LinkedIn de BL-13 apunta al perfil personal mientras tanto.
