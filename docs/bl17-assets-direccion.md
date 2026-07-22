# Dirección de assets — BL-17 (doc paralelo de generación)

> **Para Alan:** qué generar y con qué dirección, para que produzcas en Higgsfield EN PARALELO mientras se construyen las escenas. El [`canon-assets-higgsfield.md`](canon-assets-higgsfield.md) manda el CÓMO (template maestro, anti-canon, 4 tipos); este doc lista el QUÉ, por escena, más el tipo nuevo: **video**.
> **Doc VIVO:** cada boceto gateado agrega o afina su tanda. Regla de secuencia: no generar en serie más allá de la escena en producción +1 — el boceto de una escena puede cambiar su lista.
> Workflow de siempre: vos generás y curás (UI web, toggle Unlimited para imágenes) → dejás crudos en `space-src/` → Claude procesa (pipeline sharp) y monta. Tu curación = fuente de verdad.

## 0 · ANTES QUE NADA: los model sheets del elenco

La consistencia entre generaciones es el riesgo #1 del pipeline — y con VIDEO es doble, porque el generador necesita referencia visual del personaje para no inventar uno nuevo por clip. Antes de producir por escena, cerramos el elenco. **Truco: generar cada sheet como UNA sola imagen** (grid de poses/ángulos) — dentro de una misma generación las poses salen coherentes entre sí.

| # | Personaje | Estado | Qué generar (sheet) |
|---|---|---|---|
| 1 | **El protagonista (dueño)** | v1 existe en `public/space/chars/` — casting a iterar | Frente, 3/4 y perfil + 3 expresiones: neutral digno / preocupado / orgulloso. Entrañable, jamás patético |
| 2 | **La nave** | NO existe — diseño abierto del guión (humor: ¿algo de tienda?) | Perfil y 3/4, con y sin estela/llama. Propuesta para tu gate: una furgoneta de reparto espacial con **el mostrador atado al techo** (cuenta el escape solo, sin copy) |
| 3 | **El alien cliente** | v1 existe | 3 poses: mirando el escaparate / pidiendo (señalando) / recibiendo el paquete, contento |
| 4 | **Asteroides con cara** | 2 existen | 4–6 variantes más de expresión (burlona, dormida, gruñona…) para E2/E3 |
| 5 | **La tienda — fachada** | Existe (pasó con honores) | Variante **"tienda vieja"**: mismo edificio, cartel pintado a mano y torcido, sin neón, luz cálida tenue en una ventana (el "antes" de E0; el "después" ya lo tenemos) |

Subject del template maestro para sheets: `character model sheet of [PERSONAJE], multiple poses and expressions in a grid, consistent design across all poses`.

## 1 · Inventario de stills por escena

| Escena | Asset | Tipo (canon) | Estado | Cuándo |
|---|---|---|---|---|
| E0 | Tienda vieja (viñeta) | scenes | Falta (o reuso fachada tanda 1) | **YA — tanda E0** |
| E0 | Nave (del model sheet) | chars | Falta | **YA — tanda E0** |
| E1 | Planeta azul chiquito (el destino) | Z2 | Falta | Con boceto E1 |
| E1 | Nebulosas/galaxias Z1 | Z1 | 2 existen | Alcanza por ahora |
| E2 | Variantes de asteroide con cara | Z2 | 2 de ~6 | Con boceto E2 (las rocas-card salen del morph DOM, esto es lo decorativo) |
| E3 | Nubes flat, 3 densidades (wispy / media / banco) | Z2 | Falta (las fotográficas murieron) | Con boceto E3 |
| E3 | Superficie/horizonte del planeta (llegada) | scenes | Falta | Con boceto E3 |
| E4 | Tienda iso dollhouse EN PLANOS (fuera/dentro/detrás, cortada en capas) | scenes | Falta — **NO generar antes del boceto E4** (se especifica fino ahí) | Con boceto E4 |
| E5 | Planeta con órbitas + satélites/lunas chicas (×N para el beat de crecimiento) | Z2 | Falta | Con boceto E5 |
| E5 | Mini-tienda en 4 fases de construcción | scenes | Falta | Con boceto E5 |
| E6 | Escritorio caótico (papeles, post-its) | scenes | Falta (los paneles del tablero ya son DOM) | Con boceto E6 |
| E7 | Constelación / mapa del barrio con púlsar | Z1/Z2 | Falta | Con boceto E7 |

## 2 · VIDEOS (tipo nuevo — dirección de Alan, 22/07)

**Dónde SÍ:**
- **La intro E0** — el candidato mayor: autoplay puro, no depende del scroll. Recomendación híbrida en [`bl17-boceto-e0.md`](bl17-boceto-e0.md) § Addendum (video actos 1–3 + clímax canvas existente).
- **Micro-clips de personaje** (2–4s): una reacción, una acción, un beat — como asset animado dentro de una escena, siempre **dentro de un marco/viñeta rectangular** que se funde con el fondo.

**Fuentes de video (22/07 — dos en carrera):** Higgsfield (video desde still de referencia) y **Midjourney image-to-video animando los boards del storyboard** (el animatic; para E0, candidato directo a ser la pieza — validar resolución de export). Generador del look FINAL de assets: decisión parqueada hasta terminar los boards (ver nota en [`bl17-storyboard.md`](bl17-storyboard.md) § Midjourney — un solo dueño del estilo, MJ o Higgsfield, se compara lado a lado).

**Dónde NO (límites técnicos, no de gusto):**
- Nada ligado al **scrub del scroll**: el video no avanza/retrocede suave frame a frame en web — eso sigue siendo canvas/DOM+GSAP.
- Nada que necesite **fondo transparente** flotando sobre el cielo: el video generado no trae canal alpha; el workaround de blend `screen` solo sirve para cosas luminosas sobre negro.

**Reglas para generar (cada clip):**
1. **Fondo = la noche del canon** (#12162E–#1B2140): así el rectángulo del video se funde con el cielo del sitio y el marco no canta.
2. **Sin texto dentro del video** — el texto lo pone el sitio en DOM, nítido. El texto en video comprimido se lava.
3. **La luz es ámbar** (regla del canon, vale doble en video).
4. **Aspect:** 16:9 para desktop; si el clip va full-screen, también 9:16 para mobile (2 renders) o encuadrá con la acción bien centrada para crop seguro.
5. **Duración:** intro 6–8s; micro-clips 2–4s. Si un clip tiene que loopear: primera y última pose iguales.
6. **Un clip = UN beat:** personaje (con su still del model sheet como imagen de referencia) + una sola acción + cámara fija o un movimiento simple. La edición/unión la hacemos en el sitio.
7. ⚠️ **Antes de producir en serie: verificá si el video descuenta créditos en tu plan** — el toggle Unlimited que tenemos confirmado es de IMÁGENES. Si el video cuesta, priorizamos: intro primero, micro-clips después.

## 3 · TANDA E0 — lo primero (el spike, en orden)

1. **Model sheet del protagonista** (iterando el casting v1 si no te convence).
2. **Model sheet de la nave** (gate previo tuyo sobre el diseño: ¿furgoneta con el mostrador al techo u otra idea?).
3. **Tienda vieja** (viñeta) — o decidís reusar la fachada de tanda 1 y esta espera a E4.
4. **VIDEO de prueba — actos 1–3 del boceto E0** (~6s, con los diseños de 1–3 como referencia): la tienda vieja quieta con su luz cálida → el cielo tira de ella, el color se drena, la tienda se desarma en fragmentos succionados → la nave escapa en diagonal con estela ámbar. Fondo noche del canon, sin texto, 16:9 (y 9:16 si da). **Con esto montamos el spike y decidimos el canal (video vs canvas) con datos: peso real, consistencia, impacto.**

## 4 · Entrega y procesado

- **Stills:** crudos a `space-src/` como siempre; proceso con el pipeline sharp (fondo→alpha, trim, WebP) a `public/space/`.
- **Videos:** crudos a `space-src/video/`; los transcodifico (WebM + MP4 fallback, poster frame del primer cuadro para que nunca haya pantalla muerta) con presupuesto de peso: **intro ≤ ~4–5MB, micro-clips ≤ ~1MB** — si un crudo no baja a eso con calidad digna, lo reporto y decidimos.
