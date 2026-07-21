# Análisis de referencias — cómo cuentan sus historias, aplicado a Pulsimus

> Pedido de Alan (21/07 noche): "analizá en profundidad qué y cómo podemos implementar la forma en la que muestran y cuentan las historias estas páginas, aplicado a Pulsimus".
> Método: 6 analistas (Sonnet) recorrieron cada sitio con browser real — scroll completo, screenshots, inspección de DOM y en dos casos lectura del código fuente sin minificar. Esta síntesis (del director) traduce los hallazgos al guión y al plan de operación. Los informes crudos viven en los transcripts de sesión; lo esencial está acá.
> Complementa a la referencia madre [journey.zajno.com](https://journey.zajno.com/). Se consume durante el BOCETO de cada escena.

## Veredicto en una línea por sitio

| Sitio | Qué ES | Motor real (verificado) | Para Pulsimus |
|---|---|---|---|
| Seed Journey (Crop Trust) | Journey por capítulos, EL comparable directo | **Rive** state machines + `position: sticky` + scroll nativo (sin GSAP) | Pacing, escena maestra continua, doble pista de texto |
| Species in Pieces | 30 especies como piezas low-poly | **CSS puro**: 33 divs `clip-path: polygon` reutilizados, morph por cambio de clase | LA receta del morph (cards→asteroides) |
| Artifex (Eszter Bial) | Case study con acabado premium | **Lenis + GSAP ScrollTrigger** (nuestro stack exacto, JS sin minificar leído entero) | Recetas 1:1 portables: reveals, color por sección, gates de perf |
| PonPon Mania | Cómic interactivo, metáfora "disco" | Nuxt + GSAP, scroll horizontal secuestrado | Metáfora sostenida hasta la UI, color como narrador |
| My Grandmother's Lingo | Narrativa por interacción (voz), sin scroll | CreateJS legacy (crashea hoy) | Interacción como moneda narrativa + fallbacks de igual peso |
| Dropbox Brand | Manual de marca vivo | Webflow + piezas **Rive** (canvas 2d) | Panel Diseño de BL-13 / BL-14: un control que recolorea contextos |

## Las 7 lecciones transversales (qué adoptamos como principios)

1. **Scroll libre + scrub le gana al secuestro.** Los dos sitios sólidos (Seed, Artifex) dejan el scroll en manos del usuario y solo le agregan inercia (Lenis) y scrub; el único pin es puntual. PonPon secuestra (`overflow: hidden` + riel horizontal) y es el más frágil: sin fallback, si su JS falla no avanzás. **Valida nuestra arquitectura** (Lenis + ScrollTrigger scrub, pins por escena) — y fija la regla: secuestrar solo DENTRO de una escena pineada, nunca el documento entero.
2. **Escenario constante, capas que cambian.** Lingo mantiene el mismo cielo estrellado durante beats enteros y solo apila texto encima; Artifex cambia el "mood" tweeneando `background-color` por sección (data-attributes + onEnter/onLeaveBack, 0.2s); Seed da identidad cromática por capítulo. Nuestro cielo permanente Z0 ya ES esto. Lo que falta adoptar: **el color como narrador** — cada escena puede teñir el universo (tween de 2-3 custom properties) sin geometría nueva. Ej.: E0 colapso drena el color; el ámbar vuelve como recompensa en cada hito (la regla "la luz es ámbar" ganó un mecanismo de ejecución).
3. **Una escena maestra continua > N pins desconectados.** El capítulo insignia de Seed dedica ~90% de sus 44 viewports a UNA escena continua que muta de viñeta en viñeta; el montaje vive dentro del motor, no en cambios de componente. Traducción a nuestro stack: **un timeline GSAP único con labels por capítulo**, no un pin chico por micro-momento — menos costuras, reversa limpia. Afecta directamente cómo bocetamos E1→E3 (¿un solo timeline "viaje al planeta"?).
4. **El corte duro entre capítulos es legítimo.** Ni Seed ni PonPon transicionan continuo entre capítulos: cortan con un umbral explícito ("next chapter", pantalla de carga con personalidad). Matiz para nuestro contrato "nunca corte seco": la continuidad importa DENTRO del capítulo; entre bloques mayores, un umbral breve con identidad (nuestros Umbrales) es más barato y hasta mejor para el ritmo.
5. **Pacing por densidad de contenido, no fórmula fija.** Números medidos en Seed: ~2.000–2.500px de scroll por beat ilustrado/emocional; los tramos técnicos comprimen mucho más. Confirma nuestro "umbral variable" y le da valores iniciales para los bocetos (escena clave ≈ 200–300% de `end`, ya en la skill — ahora con evidencia externa).
6. **La interacción es moneda narrativa — con fallback de IGUAL peso.** Lingo reemplaza "decí la palabra" por "speed-tap con medidor": mismo esfuerzo, misma recompensa, canal distinto. Regla para E2 (destruir asteroides): el camino teclado/reduced/mobile no es "saltear la escena", es OTRA forma de ganársela (p.ej. focus+Enter los rompe; en reduced se rompen solos al entrar, ya rotos no — ver boceto). Y el tutorial es just-in-time: el ícono de gesto aparece la primera vez que la mecánica existe, no en un onboarding.
7. **La metáfora se sostiene hasta la UI.** PonPon convierte TODO en disco (capítulos = tracks, scroll = aguja que scrubea la canción, stickers de vinilo); es lo que lo hace memorable. Nuestro equivalente: el universo espacial debe llegar a la UI — progreso como radar, el form como consola de transmisión ("mandá tu señal" ya apunta ahí), el reproductor de PonPon ≈ nuestro EKG dosificado (¿el pulso late al ritmo del scroll en los 4 hitos?).

## Recetas técnicas robadas (con dueño y costo)

- **Morph por cambio de clase + onda de delays** (Species, extraído del CSS real): N divs fijos con `clip-path: polygon(%)`; cambiar de forma = togglear UNA clase en el padre; el navegador anima los polígonos nativo, sin rAF. La "vida" la da el delay escalonado por índice (`transition-delay: calc(var(--i) * 20ms)`) → ola que barre la silueta. Moderno: sin prefijo, custom properties registradas. **Uso:** E2 — las cards de Dolores se fragmentan y reensamblan como asteroides; también candidata para el estallido de la supernova en DOM (el preloader de Species ES una supernova de 33 shards). Costo: bajo (CSS+coreografía).
- **Reveal en dos capas** (Artifex): contenedor hace `clip-path: inset(100%→0)` UNA vez al entrar; la imagen interna lleva su propio scrub de `yPercent` por `data-speed`. Entrada + profundidad desacopladas. **Uso:** entrada estándar de assets flat en todas las escenas. Costo: trivial, ya tenemos ScrollTrigger.
- **Color de sección por data-attribute** (Artifex): `data-bg-color`/`data-line-color` + tween en onEnter/onLeaveBack. **Uso:** mecanismo del principio 2 (mood por escena). Costo: trivial.
- **Gate de visibilidad en TODO loop** (Artifex): cada efecto por-frame envuelto en un booleano que ScrollTrigger prende/apaga; el ticker chequea antes de calcular. **Uso:** regla de la casa desde YA (StarLayer y todo lo que venga). → va a la skill.
- **Texto-tesis que se llena con el scroll** (Dropbox): titular contorno→relleno sincronizado al scroll. **Uso:** una frase-tesis por sección (las de la batería de conceptos-física). Costo: bajo (clip-path o background-clip).
- **Doble pista de texto sobre una escena** (Seed): dos cajas fijas independientes narrando en paralelo. **Uso:** E4 dollhouse (fuera/dentro/detrás) y E5 (cielo/tierra espejados — ya nace de a dos). Costo: bajo.
- **Scroll como scrub de audio/latido** (PonPon): un contador que solo avanza cuando el usuario scrollea. **Uso (candidato, decidir con Alan):** el BPM/latido del EKG ligado al ritmo de scroll en sus 4 apariciones. Costo: medio.
- **Un control Rive que recolorea contextos** (Dropbox): su color-picker `.riv` recolorea 3 mockups a la vez. **Uso:** BL-13 panel Diseño / BL-16 skin switch — el botón "Cambiar skin" como pieza que repinta demos en vivo (nuestra versión: tokens CSS, sin Rive necesariamente). Refuerza BL-18 como candidato para PIEZAS contenidas, no para el motor del sitio.

## Advertencia transversal (evidencia dura)

**Los 6 sitios pesados crashearon Chromium headless repetidamente** (Artifex ×3, Lingo ×5, PonPon ×n, Species ×2, Seed ×3 — con causa raíz visible en Seed: state machines que nunca se destruyen al desmontar, 190+ errores acumulados). Lecciones obligatorias para nuestro build: (1) **destruir/gatear todo lo scroll-driven al desmontar** (nuestro scrollEngine ya refcuenta — mantener la disciplina por escena); (2) presupuesto de loops simultáneos por viewport (máx 2 ya está en el canon; los gates de visibilidad lo hacen cumplir); (3) verificar con scroll REAL además de saltos programáticos (los saltos grandes rompen state machines — afecta cómo escribimos los tests Playwright: wheel por pasos, no solo scrollTo).

## Mapa de aplicación por escena (insumo de cada boceto)

| Escena | Roba de | Qué exactamente |
|---|---|---|
| **E0 supernova/escape** | Species (shards radiales del preloader) + PonPon (color como narrador) + Lingo (texto acumulativo sobre escenario constante) | El colapso drena color; la explosión en fragmentos; el copy de la escena 0 apilándose línea a línea sobre el cielo antes del reveal |
| **E1 radar (Hero)** | Seed (escena maestra continua) + Dropbox (frase-tesis que se llena) + PonPon (metáfora en la UI) | Hero→Dolores como UN timeline con labels; la promesa como texto que se llena; el radar como elemento de UI persistente del viaje |
| **E2 cinturón (Dolores)** | Species (morph clase+delays: cards→asteroides) + Lingo (interacción con recompensa + fallback de igual peso + tutorial just-in-time) | La receta completa de la escena está en estos dos informes |
| **E3 aterrizaje** | Seed (pacing ~2-2.5k px/beat) + Artifex (reveal dos capas para las nubes flat) | Transición breve, densidad baja, parallax de capas de nube |
| **E4 dollhouse (Mostrador)** | Seed (doble pista de texto) + Artifex (reveal dos capas + gates de perf) | Fuera/dentro/detrás narrados en pistas paralelas; el ciclo alien-pide-dueño-recibe como beats del timeline |
| **E5 órbitas (Proceso)** | Seed (doble pista: cielo/tierra) | El espejo arriba/abajo ES la doble pista llevada al layout |
| **E6 mission control (Tablero)** | PonPon (color: caos B&N/desaturado → orden a color) + Artifex (color por sección) | El escritorio caótico desaturado que recupera color al ordenarse en tablero |
| **E7 señal (CTA)** | PonPon (metáfora hasta la UI) + Lingo (la acción del usuario como clímax) | El form como consola de transmisión; enviar = tu pulso sube y se hace estrella (EKG #4) |

## Qué NO tomar (con causa)

- **Secuestro total del scroll** (PonPon) — frágil, sin fallback, malo para a11y. Nuestro pin/scrub por escena da el mismo control sin el riesgo.
- **Motor canvas monolítico** (Lingo/CreateJS) — el concepto de Lingo vale; su implementación es la advertencia. Nuestro equivalente moderno es GSAP+DOM/SVG.
- **Rive como motor del SITIO** (Seed) — caro de autorar, state machines frágiles ante saltos, y duplica assets desktop/mobile (Dropbox). Queda como candidato para piezas contenidas (BL-18: demos/skin switch), no para la película.
- **Ilustración única por viñeta** (PonPon) — bellísimo, incosteable a nuestra escala; nuestro nivel-2 (rigging por capas de un mismo asset) es el compromiso correcto.
