# Storyboard — el viaje Pulsimus, cuadro por cuadro

> **Para qué:** ponernos en sintonía visual ANTES de codear. Vos generás 1 imagen por cuadro en Higgsfield (calidad boceto, sin curación fina — los personajes descriptos básico alcanzan) y con los boards a la vista validamos la narrativa juntos. Lo que no funcione se corrige acá, en papel, que es donde es barato.
> **Cómo usarlo:** generá en orden, una escena por tanda. Guardá los cuadros como `storyboard/E0-1.png`, `E0-2.png`… No hace falta consistencia perfecta de personaje entre cuadros — esto es el plano, no la obra.
> **Convención por cuadro:** **VEMOS** (composición: qué hay en pantalla y dónde) · **MOVIMIENTO** (qué anima en el sitio real — en el board queda congelado) · **COPY** (texto que el sitio pone en DOM; NO va dentro de la imagen) · **PROMPT** (subject para el template maestro del [canon](canon-assets-higgsfield.md); agregale el bloque base de siempre).
> Fuentes: [guión](bl17-guion-narrativo.md) · [boceto E0](bl17-boceto-e0.md) · [plan de operación](bl17-plan-operacion.md) (dirección 22/07).

**El elenco en una línea (para los prompts):** el dueño = hombre sencillo y digno, delantal de tendero · la nave = furgoneta de reparto espacial con un mostrador de madera atado al techo (propuesta, gate tuyo pendiente) · el alien = criatura chiquita verde amistosa · la estrella de 4 puntas = el símbolo Pulsimus.

## Template base de STORYBOARD (distinto del template de assets)

⚠️ **El template maestro del canon NO sirve acá**: ese es para assets sueltos (pide fondo liso porque después se recortan). Un board es una **escena completa** — el fondo y la composición van adentro del cuadro. Usá este:

```text
Flat vector illustration, modern science-explainer style, storyboard frame,
[PROMPT DEL CUADRO],
night-space setting, deep indigo palette (#12162E to #1B2140),
clean geometric shapes, 2-3 flat tones per object, subtle grain texture,
soft warm amber light (#F2A63E) as the only warm light source,
minimal outlines, no text, no watermark,
wide cinematic 16:9 composition
```

El `[PROMPT DEL CUADRO]` es la línea PROMPT de cada cuadro, metida en ese hueco (no pegada al final). Ejemplo armado completo con E0.1:

```text
Flat vector illustration, modern science-explainer style, storyboard frame,
small old storefront alone under a small stable sun in deep space night,
crooked hand-painted sign, one warm amber-lit window, tiny and vulnerable,
night-space setting, deep indigo palette (#12162E to #1B2140),
clean geometric shapes, 2-3 flat tones per object, subtle grain texture,
soft warm amber light (#F2A63E) as the only warm light source,
minimal outlines, no text, no watermark,
wide cinematic 16:9 composition
```

Diferencias con el template de assets, por si las querés entender: sacé el slot `[VIEW]` (cada cuadro ya implica su cámara), sacé el `[FONDO según tipo]` (acá el fondo ES parte de la escena), y agregué `wide cinematic 16:9` (son cuadros de película, no objetos). Cuando un board te salga bien y quieras el ASSET final de ese elemento, ahí sí volvés al template maestro del canon con el fondo de recorte.

---

## E0 · La supernova (intro, autoplay ~10s)

**E0.1 — La tienda bajo su estrella.**
VEMOS: cielo nocturno índigo. Al centro, chica y sola, la tienda vieja: cartel pintado a mano torcido, UNA ventana con luz cálida ámbar. **Arriba, la estrella de su sistema: un sol chico y estable** que ilumina la escena (ya existe — no va a nacer, va a morir).
MOVIMIENTO: idle sutil (parpadeo de ventana). COPY: «Tenía su tienda en un sistema lejano.»
PROMPT: `small old storefront alone under a small stable sun in deep space night, crooked hand-painted sign, one warm amber-lit window, tiny and vulnerable`

**E0.2 — La estrella muere.**
VEMOS: la estrella hinchada e inestable, parpadeando, virando de tono — y empezando a colapsar hacia adentro: su gravedad tira de todo. El cuadro pierde saturación (gris azulado), líneas de polvo curvándose hacia ella. La ventana de la tienda casi sin luz.
MOVIMIENTO: desestabilización → colapso; drenaje de color + succión. COPY: «Hasta que pasó lo que no controlaba.»
PROMPT: `a swollen dying unstable star flickering and collapsing inward above the storefront, everything desaturating, dust streams pulled toward the star, fading amber window light`

**E0.3 — La tienda se desarma.**
VEMOS: la tienda fragmentada en pedazos poligonales flat, succionados en espiral hacia el núcleo. Cuadro casi monocromo.
MOVIMIENTO: los fragmentos SE VUELVEN el polvo de la acreción. COPY: ninguno (beat mudo).
PROMPT: `storefront breaking apart into flat polygonal shards spiraling into a collapsing star, monochrome desaturated night, debris vortex`

**E0.4 — El escape.**
VEMOS: todo quieto un instante alrededor del núcleo a punto de estallar; en diagonal, escapando hacia una esquina, la furgoneta espacial con el mostrador atado al techo, estela ámbar — y en la estela, la línea de un latido (EKG, nace el leitmotiv).
MOVIMIENTO: la chispa cruza el cuadro. COPY: «Escapó con lo único que importaba: el mostrador.»
PROMPT: `small space delivery van with a wooden shop counter strapped to its roof escaping diagonally from a star about to explode, amber light trail shaped like a heartbeat line`

**E0.5 — Supernova y siembra.** *(la explosión ya construida en canvas se adapta — board solo para leer la secuencia)*
VEMOS: el rebote del colapso: anillos de choque ámbar y hueso, flash, y del resplandor emerge el wordmark PULSIMUS. Detrás queda la **nebulosa remanente — que NO desaparece: se convierte en el fondo del sitio** (el cielo Z1, lejos del planeta).
MOVIMIENTO: explosión existente + handoff de la nebulosa al cielo permanente. COPY: el wordmark ES el copy.
PROMPT: `supernova explosion with amber shockwave rings leaving behind a glowing remnant nebula that fills the night sky` *(solo si querés el board; el sitio usa el canvas)*

---

## E1 · La señal (Hero → Dolores)

**E1.1 — A la deriva.**
VEMOS: espacio abierto enorme, galaxias lejanas quietas; la furgoneta chiquita abajo, sin rumbo. Arriba, aire para la promesa y el CTA (el hero actual).
MOVIMIENTO: deriva lenta, casi quietud. COPY: la promesa + CTA vigentes.
PROMPT: `tiny space delivery van drifting alone in vast open space, distant soft galaxies, enormous empty night sky above`

**E1.2 — Bip.**
VEMOS: primer plano del tablero de la furgoneta: una pantalla de radar circular; en el borde, un punto que late en ámbar. La cara del dueño apenas iluminada por el radar.
MOVIMIENTO: el bip late (EKG #2). COPY: transición, sin texto nuevo.
PROMPT: `close-up of a retro radar screen inside a spaceship dashboard, one small amber blip pulsing at the edge, shopkeeper's face softly lit by the glow`

**E1.3 — El zoom.**
VEMOS: el punto del radar crece: zoom hacia un planeta azul chiquito flotando en la oscuridad, rodeado de un cinturón de rocas apenas insinuado.
MOVIMIENTO: el scroll ES este zoom (Hero→Dolores). COPY: «Hay vida ahí. Hay barrio ahí.» (borrador)
PROMPT: `small blue planet seen from far space, warm city lights faintly visible, a hinted asteroid belt ring between viewer and planet`

---

## E2 · El cinturón (Dolores)

**E2.1 — El muro de rocas.**
VEMOS: el cinturón de frente: asteroides grandes cerrando el paso, cada uno con un nombre tallado (los dolores del copy vigente). Caras de piedra: burlonas, dormidas, gruñonas. El planeta azul asoma detrás, lejos.
MOVIMIENTO: las cards de la sección se fragmentan y reensamblan como estas rocas (morph). COPY: los nombres de los dolores + intro de la sección.
PROMPT: `asteroid belt blocking the way, large cartoon asteroids with carved stone faces (mocking, sleepy, grumpy), small blue planet visible far behind`

**E2.2 — El tutorial (primera roca).**
VEMOS: la furgoneta frente al primer asteroide; un ícono de mira/click apenas sugerido sobre la roca (tutorial just-in-time).
MOVIMIENTO: aparece la primera vez que la mecánica existe. COPY: micro-hint («Rompelo», borrador).
PROMPT: `space delivery van facing a single large grumpy asteroid, subtle glowing crosshair target hovering on the rock`

**E2.3 — La destrucción.**
VEMOS: un asteroide estallando en fragmentos flat con destello ámbar; la cara de piedra partida al medio. Los demás asteroides "mirando".
MOVIMIENTO: click/tap/Enter lo destruye; recompensa visual. COPY: el dolor tachado.
PROMPT: `cartoon asteroid shattering into flat polygonal fragments with an amber burst, cracked stone face splitting, other asteroids watching surprised`

**E2.4 — El camino despejado.**
VEMOS: el cinturón abierto: un pasillo limpio de rocas hacia el planeta azul, ahora más grande y nítido. Restos de polvo asentándose.
MOVIMIENTO: la escena suelta el avance. COPY: cierre de la sección (velocidad de escape, borrador de la batería).
PROMPT: `cleared corridor through an asteroid belt, path open toward a welcoming blue planet, settling dust sparkles`

---

## E3 · El descenso (escena nueva, pre-Mostrador)

**E3.1 — Entrada a la atmósfera.**
VEMOS: la furgoneta de punta, entrando: borde del planeta curvo abajo, fricción ámbar en la trompa, cielo pasando de índigo espacial a azul atmosférico.
MOVIMIENTO: el scroll baja CON la nave. COPY: ninguno o mínimo.
PROMPT: `space delivery van entering planet atmosphere nose-first, amber friction glow, sky gradient from deep indigo space to atmospheric blue, curved planet horizon`

**E3.2 — Entre las nubes.**
VEMOS: capas de nubes flat (wispy arriba, bancos densos abajo) atravesadas en parallax; la nave chiquita entre capas.
MOVIMIENTO: parallax de 3 capas de nube. COPY: ninguno.
PROMPT: `flat vector cloud layers at night seen while descending, small van passing between wispy and dense cloud banks, moonlit tops`

**E3.3 — El claro.**
VEMOS: se abren las últimas nubes: abajo, el barrio de noche — manzanas, techos, calles con faroles cálidos. Se ve el lote vacío donde va a estar la tienda.
MOVIMIENTO: revelación del destino. COPY: «Hay barrio ahí» paga acá (borrador).
PROMPT: `breaking through last clouds revealing a cozy neighborhood at night from above, warm streetlights, one empty lot waiting`

**E3.4 — El aterrizaje.**
VEMOS: a nivel de calle: la furgoneta posada, polvo asentándose, el mostrador todavía atado al techo. El lote vacío al lado.
MOVIMIENTO: toca tierra; da pie a E4. COPY: transición al Mostrador.
PROMPT: `street level view of the space van landed in a quiet neighborhood at night, dust settling, wooden counter still strapped to the roof, empty lot beside`

---

## E4 · La tienda dollhouse (Mostrador)

**E4.1 — Mal estado, entrañable.**
VEMOS: la tienda armada con los restos de la nave: cartel torcido pintado a mano, vitrina apagada, el mostrador (EL mostrador) adentro. Digna pero apagada.
MOVIMIENTO: pose inicial de la transformación. COPY: intro de la sección (voz del dueño).
PROMPT: `humble storefront built from spaceship scraps at night, crooked hand-painted sign, dark shop window, warm but dim`

**E4.2 — La transformación.**
VEMOS: mitad y mitad en el mismo cuadro: el cartel enderezándose y encendiéndose en neón ámbar, la vitrina iluminándose de izquierda a derecha.
MOVIMIENTO: scroll-driven (el momento firma de la escena). COPY: la promesa de presencia (gravedad, borrador).
PROMPT: `storefront mid-transformation, sign straightening and lighting up as amber neon, shop window illuminating half-lit half-dark`

**E4.3 — La dollhouse.**
VEMOS: la tienda en corte isométrico, tres planos a la vez: FUERA (el alien mirando el escaparate) / DENTRO (el mostrador, la caja) / DETRÁS (la trastienda con papeles y caos).
MOVIMIENTO: doble pista de texto narrando los planos. COPY: fuera = tu presencia · dentro = la experiencia · detrás = la operación.
PROMPT: `isometric dollhouse cutaway of a small shop showing three layers at once: street front with tiny green alien looking at window, counter area inside, messy back room with papers`

**E4.4 — El pedido.**
VEMOS: primer plano del mostrador: el alien del lado de la calle señalando un producto; en el mostrador, un pedido materializándose (ticket/panel flotante estilo UI del sitio).
MOVIMIENTO: el ciclo alien-pide. COPY: el pedido como beat.
PROMPT: `tiny green alien at a shop counter pointing at a product, a glowing order ticket appearing above the counter, warm amber shop light`

**E4.5 — El dueño recibe.**
VEMOS: la trastienda: el dueño mirando una pantallita donde llegó el pedido, cara de orgullo contenido. El caos de papeles de fondo, un poquito menos caótico.
MOVIMIENTO: cierre del ciclo (candidato a punto de avance). COPY: remate de la sección.
PROMPT: `shopkeeper in the back room looking proudly at a small screen showing an incoming order, slightly messy desk with papers, warm light`

---

## E5 · Como arriba, es abajo (Proceso)

**E5.1 — El espejo.**
VEMOS: cuadro partido horizontal. ARRIBA: el planeta con un primer cuerpo acercándose a órbita. ABAJO: la tienda en obra, fase 1 (andamios/estructura). Las dos mitades componiendo una simetría clara.
MOVIMIENTO: las fases avanzan en espejo con el scroll. COPY: las fases del proceso (brief → diseño → build → lanzamiento).
PROMPT: `split screen composition: top half a planet with one small body approaching orbit in space, bottom half a small shop under construction with scaffolding, mirrored symmetry`

**E5.2 — La órbita capturada.**
VEMOS: arriba, el primer satélite YA en órbita estable (línea de órbita dibujada); abajo, la tienda terminada encendiendo su neón.
MOVIMIENTO: remate de las fases. COPY: «así como un satélite orbita un planeta, un cliente orbita el negocio».
PROMPT: `split screen: top half satellite locked in a drawn stable orbit around planet, bottom half finished shop lighting up its amber neon sign`

**E5.3 — El crecimiento.**
VEMOS: arriba, MÁS cuerpos entrando en órbita (lunas, satélites chicos — 4 o 5, escalonados); abajo, la tienda con movimiento: aliens acercándose por la vereda.
MOVIMIENTO: beat nuevo (dirección 22/07): la sensación de que esto crece más allá de uno. COPY: clientes que vuelven, y traen más.
PROMPT: `split screen: top half multiple small moons and satellites entering staggered orbits around the planet, bottom half small shop with several tiny aliens walking toward it on the sidewalk`

---

## E6 · Mission control (Tablero)

**E6.1 — El caos.**
VEMOS: la trastienda del E4.5 en primer plano total: escritorio tapado de papeles, post-its, cuaderno abierto — TODO desaturado, gris.
MOVIMIENTO: pose inicial. COPY: intro de la sección (el dolor del caos manual).
PROMPT: `desaturated gray cluttered desk covered in papers sticky notes and an open notebook, overwhelmed small business chaos, almost monochrome`

**E6.2 — El orden.**
VEMOS: mismo encuadre: los papeles ordenándose/volando hacia una pantalla que se enciende — y donde tocan la pantalla, EL COLOR VUELVE. Mitad escritorio gris, mitad tablero vivo.
MOVIMIENTO: caos→orden scroll-driven; desaturado→color. COPY: la promesa del tablero.
PROMPT: `papers flying from a gray desk into a glowing screen turning them into a colorful ordered dashboard, color returning where they land, half desaturated half vivid`

**E6.3 — Las manos en el panel.**
VEMOS: el tablero real del sitio (paneles existentes) enmarcado como consola de mission control; una mano/cursor tocando un control y, en una ventanita, la tienda REACCIONANDO (un pedido avanza, una luz se enciende). Espacio reservado para el switch de skins.
MOVIMIENTO: la interacción del visitante avanza el proceso en la tienda (dirección 22/07). COPY: micro-hints de las acciones.
PROMPT: `mission control console framing a business dashboard, a cursor pressing a glowing button while a small window shows the shop reacting with a light turning on`

**E6.4 — El pulso regular.**
VEMOS: en la pantalla principal del tablero, grande y protagonista: la línea de EKG latiendo REGULAR, en ámbar (EKG #3). El dueño de espaldas, mirándola. Orgullo.
MOVIMIENTO: el momento emocional de la sección. COPY: «el pulso de tu negocio», literal.
PROMPT: `shopkeeper seen from behind watching a large screen showing a steady amber heartbeat line, calm pride, ordered desk around him`

---

## E7 · Mandá tu señal (CTA)

**E7.1 — El púlsar del barrio.**
VEMOS: zoom out: el barrio de noche desde arriba, y la tienda del dueño LATIENDO en ámbar — un púlsar chiquito entre los techos. El resto del barrio, puntos tenues.
MOVIMIENTO: el viaje del protagonista cierra; ahora le toca al visitante. COPY: transición al CTA.
PROMPT: `neighborhood at night from above, one small shop pulsing warm amber light like a tiny pulsar among rooftops, soft dim lights elsewhere`

**E7.2 — La consola de transmisión.**
VEMOS: el form del sitio enmarcado como consola de señal: los campos existentes (nombre, negocio, qué te duele, canal) como panel de transmisión; un dial/indicador de señal en ámbar.
MOVIMIENTO: reencuadre del form (los campos son los reales). COPY: «Mandá tu señal» + «Te leo y escucho yo, Alan.»
PROMPT: `retro space transmission console styled as a contact form panel, amber signal dial, warm and inviting, night background`

**E7.3 — El latido se hace estrella.**
VEMOS: desde la consola sube una línea de latido que asciende y, arriba de todo, se convierte en la estrella de 4 puntas del logo (EKG #4 — el logo contado).
MOVIMIENTO: el cierre del leitmotiv; candidato a dispararse al enviar. COPY: ninguno — el símbolo cierra solo.
PROMPT: `a heartbeat line rising from below and transforming into a four-pointed star at the top, amber on deep indigo night, minimal and iconic`

---

## Cómo seguimos con esto

1. Generás los cuadros (E0 primero — son los mismos beats de la tanda E0 del [doc de assets](bl17-assets-direccion.md) §3, doble uso).
2. Los miramos juntos: lo que no se vea como lo imaginaste, se corrige ACÁ (papel barato) antes de que llegue a un boceto o a código.
3. El storyboard gateado pasa a ser insumo del boceto de cada escena — y los cuadros aprobados, referencia visual directa para tus assets y videos finales.

---

## Prompts adaptados para MIDJOURNEY (completos, listos para pegar)

> **✅ Validado (22/07):** Alan generó E0.1 en MJ — "brutal", clavada al primer tiro (cartel torcido, vitrina ámbar única luz cálida, estrella moribunda con haz rojizo). **Esa imagen es el ANCLA de `--sref` para los 30 cuadros restantes.** Único defecto: texto colado en el cartel ("STONET") pese al `--no` — en boards no importa; para finales, pedir `blank sign`.
> **🎞️ Animatic (idea de Alan, 22/07):** MJ también anima (image-to-video) → animar los boards para previsualizar cada escena. Para E0 vale doble: el animatic de E0.1→E0.4 es candidato directo a SER el video de la intro (el spike de video ya planeado, con mejor materia prima). A verificar al probarlo: la resolución de export del video MJ — por debajo de ~720p sirve de animatic pero no de pieza final full-screen.
> **🎨 Assets con MJ:** posible con prompt de asset (`single object, centered, solid flat dark background` + `--sref` del ancla). ⚠️ Decisión PARQUEADA hasta terminar los boards: el estilo MJ es más rico que el flat de la tanda 1 Higgsfield — mezclados en el sitio se nota. Un solo generador dueño del look final; se decide comparando 2-3 extracciones lado a lado (si gana MJ, el canon actualiza su referencia y la tanda 1 se regenera).

**Regla de armado MJ (aprendida el 22/07, primer intento la violó):** `[CUADRO] + [UN solo bloque de estilo] + [parámetros]` — el SUJETO va PRIMERO (MJ pesa más los tokens iniciales), un único bloque de estilo (dos bloques compitiendo se diluyen mutuamente), y los `--ar/--style/--no` SIEMPRE al final (sin `--no text` se cuelan carteles con letras).

**Variante de estilo en prueba (22/07) — Kurzgesagt:** bloque de estilo alternativo: `flat vector illustration, bold minimalist geometric shapes with rounded corners, smooth color gradients and soft glows, layered flat depth, simple characters with dot eyes, deep indigo night palette, warm amber as the hero light, subtle grain texture, crisp clean edges, infographic space aesthetic, Kurzgesagt style`. Primer test E0.1: encantador (ventana sonriente = el "entrañable" del guión, accidente feliz a considerar), más redondo/gradiente que el ancla texturada del primer estilo. El indigo+ámbar quedan anclados en el bloque para que la saturación Kurzgesagt no rompa "la luz es ámbar". Comparar el MISMO cuadro en ambos estilos, con la regla de armado bien aplicada, = insumo de la decisión del look final.

**🏆 Bloque DESTILADO por `/describe` (22/07 — candidato a definitivo):** Alan corrió `/describe` sobre la imagen Kurzgesagt aprobada; de las 4 lecturas de MJ se extrajo el vocabulario repetido (= cómo MJ MISMO nombra ese estilo, más confiable que palabras inventadas para reproducirlo por texto):

```text
2d flat vector illustration, minimalist space themed, clean lines, smooth gradients,
subtle noise texture, limited color palette of deep blues and purples with warm amber light,
quiet whimsical atmosphere
```

Rasgos de contenido que MJ lee como firma (usables como ingredientes de cuadro): `lit window shaped like a smiling face` (el accidente feliz, ya describible a voluntad) · `glowing star with concentric ring halos` (regalo para la estrella moribunda de E0). Este bloque ES el plan B determinista: si `--sref` deriva, se produce todo con este texto.

### Cómo armar un prompt — DOS MODOS

Todo prompt MJ tiene 3 bloques, en este orden (el sujeto SIEMPRE primero — MJ pesa más los tokens iniciales):

```text
[1 · CUADRO]      qué dibujar — la línea de la lista de abajo
[2 · ESTILO]      cómo se ve — SOLO en modo exploración
[3 · PARÁMETROS]  --ar 16:9 --style raw --no text, letters, watermark, typography
```

**MODO EXPLORACIÓN (solo mientras elegís el estilo):** los 3 bloques completos. Ejemplo, cuadro E0.1 + estilo Kurzgesagt:

```text
small old storefront alone under a small dying star in deep space night, crooked hand-painted blank sign, one warm amber lit window, tiny and vulnerable
flat vector illustration, bold minimalist geometric shapes with rounded corners, smooth color gradients and soft glows, layered flat depth, deep indigo night palette, warm amber as the hero light, subtle grain texture, crisp clean edges, infographic space aesthetic, Kurzgesagt style
--ar 16:9 --style raw --no text, letters, watermark, typography
```

(Los renglones son para que VEAS los bloques — al pegarlo en MJ va todo junto, MJ ignora los saltos de línea.)

**MODO PRODUCCIÓN (una vez elegida el ancla — así generás los 31):** el bloque de estilo largo desaparece; queda un mini-stub + la imagen ancla como STYLE reference:

```text
[CUADRO de la lista], flat vector illustration, deep indigo night, warm amber light
--sref <URL-del-ancla> --ar 16:9 --style raw --no text, letters, watermark, typography
```

⚠️ **Gotcha que ya nos mordió (22/07): image prompt ≠ style reference.** Arrastrar la imagen al prompt bar y soltarla la mete como IMAGE PROMPT (referencia de contenido: mezcla la imagen con el texto y el estilo DERIVA — nos devolvió pixel art). En la web de MJ, al soltar la imagen hay que clickear el selector de modo y elegir **estilo** (tres modos: imagen / estilo / personaje). En Discord: URL suelta al principio = image prompt; `--sref URL` al final = estilo.

- El mini-stub textual (`flat vector illustration, deep indigo night, warm amber light`) va SIEMPRE aunque haya `--sref` — ayuda a que la referencia enganche y no derive.
- Si el estilo pega demasiado fuerte o muy débil: `--sw 50` (suave) a `--sw 200` (fuerte); default 100.
- **Plan B si `--sref` sigue derivando:** volver al bloque de TEXTO completo en los 31 (modo exploración para todo) — más repetitivo, pero el texto es determinista; la referencia de imagen es un bonus, no una dependencia.
- **Personajes repetidos** (dueño, nave, alien): referencia de personaje del cuadro donde mejor salió: `--oref <URL>` (v7) o `--cref <URL>` (v6) — de nuevo, marcándola como PERSONAJE, no como image prompt.
- MJ no entiende hex — siempre colores con nombre (deep indigo / warm amber).

### Lista de CUADROS (modo producción: cada línea + la cola fija `--sref ... --ar 16:9 --style raw --no text, letters, watermark, typography`)

```text
E0.1  small old storefront alone under a small dying star in deep space night, crooked hand-painted blank sign, one warm amber lit window, tiny and vulnerable in vast darkness

E0.2  a swollen dying unstable star flickering and collapsing inward above the small storefront, everything desaturating to grey blue, dust streams pulled toward the star, fading amber window light

E0.3  small storefront breaking apart into flat polygonal shards spiraling into a collapsing star, monochrome desaturated night, debris vortex

E0.4  small space delivery van with a wooden shop counter strapped to its roof escaping diagonally from a star about to explode, warm amber light trail shaped like a heartbeat line, tense stillness before the blast

E0.5  supernova explosion with warm amber shockwave rings leaving behind a glowing remnant nebula that fills the night sky, warm light reborn from destruction
```

```text
E1.1  tiny space delivery van drifting alone in vast open space, distant soft galaxies, enormous empty night sky above, feeling of aimlessness

E1.2  close-up of a retro circular radar screen inside a spaceship dashboard, one small warm amber blip pulsing at the edge, shopkeeper face softly lit by the radar glow

E1.3  small blue planet seen from far space with faint warm city lights, a hinted asteroid belt ring between viewer and planet, sense of destination and hope
```

```text
E2.1  asteroid belt blocking the way, large cartoon asteroids with carved stone faces mocking sleepy and grumpy, small blue planet visible far behind

E2.2  small space delivery van facing a single large grumpy cartoon asteroid with a carved stone face, subtle glowing warm amber crosshair target hovering on the rock

E2.3  cartoon asteroid shattering into flat polygonal fragments with a warm amber burst, cracked stone face splitting in half, other asteroids watching surprised

E2.4  cleared corridor through an asteroid belt, open path toward a welcoming small blue planet, settling dust sparkles, sense of achievement
```

```text
E3.1  small space delivery van entering planet atmosphere nose first, warm amber friction glow, sky gradient from deep indigo space to atmospheric blue, curved planet horizon below

E3.2  flat stylized cloud layers at night seen while descending, small delivery van passing between wispy clouds above and dense moonlit cloud banks below

E3.3  breaking through the last night clouds revealing a cozy neighborhood from above, warm amber streetlights, rooftops and streets, one empty lot waiting

E3.4  street level view of a small space delivery van landed in a quiet neighborhood at night, dust settling, wooden shop counter still strapped to its roof, empty lot beside it
```

```text
E4.1  humble storefront built from spaceship scraps at night, crooked hand-painted blank sign, dark unlit shop window, warm but dim, endearing and dignified

E4.2  storefront mid transformation, sign straightening and lighting up as warm amber neon, shop window illuminating from left to right, half lit half dark

E4.3  isometric dollhouse cutaway of a small shop showing three layers at once, street front with a tiny friendly green alien looking at the lit window, counter area inside, messy back room with papers

E4.4  tiny friendly green alien at a wooden shop counter pointing at a product, a glowing warm amber order ticket floating above the counter, cozy shop interior

E4.5  shopkeeper in a slightly messy back room looking proudly at a small glowing screen showing an incoming order, papers on the desk, quiet pride
```

```text
E5.1  split screen composition, top half a planet with one small body approaching orbit in space, bottom half a small shop under construction with scaffolding at night, mirrored symmetry

E5.2  split screen composition, top half a satellite locked in a drawn stable orbit line around a planet, bottom half a finished small shop lighting up its warm amber neon sign, mirrored symmetry

E5.3  split screen composition, top half multiple small moons and satellites entering staggered orbits around a planet, bottom half a small glowing shop with several tiny friendly aliens walking toward it, sense of growth
```

```text
E6.1  desaturated grey cluttered desk covered in papers sticky notes and an open notebook, overwhelmed small business chaos, almost monochrome grey blue

E6.2  papers flying from a grey desaturated desk into a glowing screen turning them into a colorful ordered dashboard, color returning where they land, half grey half vivid with warm amber glow

E6.3  mission control console framing a business dashboard with panels and charts, a cursor pressing a glowing warm amber button while a small window shows a tiny shop reacting with a light turning on

E6.4  shopkeeper seen from behind watching a large screen showing a steady warm amber heartbeat line, calm pride, ordered desk around him, mission control atmosphere
```

```text
E7.1  cozy neighborhood at night seen from above, one small shop pulsing warm amber light like a tiny pulsar among dark rooftops, soft dim lights elsewhere

E7.2  retro space transmission console styled as a contact panel with dials and a warm amber signal indicator, inviting and warm, night sky background

E7.3  a warm amber heartbeat line rising from below and transforming into a four pointed star at the top of the frame, minimal and iconic
```
