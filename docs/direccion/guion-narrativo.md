# Guión narrativo canónico — el viaje Pulsimus (v1)

> **Estado:** bendecido por Alan el 21/07/2026 (sesión de brainstorming con Fable). Firme hasta Tablero inclusive; **Quien-soy y CTA quedan revisables** ("si algo no me cierra más adelante lo cambiamos"). Este doc es la **fuente de verdad narrativa y de dirección de arte** para cualquier ejecutor (Claude, Design, Higgsfield, subagentes): toda decisión de asset, animación o copy se valida contra esto.
>
> **Relación:** es el marco de [[BL-17]] (paraguas de la V1). El guión de la estrella (`bl17-estrella-guion.md`) queda integrado: la estrella es la manifestación visible del pulso que guía al protagonista. Los skins de [[BL-16]] re-renderizan ESTE guión (ver § Reskin). Los demos de quien-soy [[BL-13]] accionan sobre este universo.

---

## La tesis

**El scroll es el viaje de una tienda: del caos al orden.** Igual que una estrella: polvo disperso → colapso → ignición → sistema estable en órbita. El arco caos→orden ES el pitch de Pulsimus ("el pulso de tu negocio" = ritmo estable). El fondo no decora: **argumenta**.

La semilla está en el logo: una línea de electrocardiograma que termina en la estrella de 4 puntas. **Latido → estrella.** El sitio entero es el logo contado en 7 pantallas: tomamos el pulso de tu negocio y lo convertimos en estrella.

Física real que sostiene el origen: una supernova **destruye y siembra a la vez** — sus ondas de choque comprimen el gas que encuentran y disparan el nacimiento de estrellas nuevas. El fin de algo es el material del próximo comienzo.

## El protagonista y el elenco

- **El dueño** (protagonista): tenía su tienda en un sistema lejano. La perdió. Reconstruye. Nunca patético: **entrañable y digno**.
- **La estrella de 4 puntas** (= Pulsimus): el pulso hecho personaje. Ya existe como símbolo del header y compañera del cursor (StarLayer). Es la guía del viaje.
- **Los aliens** (los clientes): "clientes de todos lados… literalmente". Humor sutil, dosificado — una aparición bien puesta vale más que diez.
- Elenco definitivo se refina escena por escena durante producción — nada entra sin pasar por el guión.

## El guión, sección por sección

### 0 · INTRO — La supernova
El protagonista tenía su tienda en un sistema lejano. Le iba bien — o alcanzaba. Su estrella colapsó (las cosas que un dueño no controla: el alquiler, la mudanza, el mercado). La explosión se llevó todo: tienda, clientela, barrio. Pero en la onda expansiva viaja **el último latido de su vieja tienda — que es también el primero de la próxima**. El wordmark PULSIMUS emerge de la explosión (ya construido así en `Intro.tsx`). Él escapa en su nave con lo único que salvó: el mostrador.
- **Concepto:** la supernova destruye Y siembra.
- **Producción:** la intro canvas actual queda; se le suma (fase posterior) la viñeta del escape del protagonista.

### 1 · HERO — La señal
Espacio abierto, galaxias lejanas casi quietas (capa Z1). El protagonista navega sin rumbo. En su radar: *bip… bip* — un pulso débil. Zoom al punto: un planeta azul chiquito. Hay vida ahí. **Hay barrio ahí.** Copy = la promesa + CTA. La transición de scroll Hero→Dolores ES el acercamiento al punto del radar.
- **Concepto:** el pulso ("todo negocio vivo late").
- **Leitmotiv EKG:** aparición 2 de 4 (el radar).

### 2 · DOLORES — El cinturón
Para llegar al pulso hay que cruzar el campo de asteroides. Cada roca lleva el nombre de un dolor real — **los nombres salen del copy vigente de `Dolores.tsx`**, no se inventan nuevos. Asteroides antropomorfizados: caras de piedra que se ríen, alguno lo roza. El protagonista esquiva **solo**, como esquiva un dueño todos los días.
- **Concepto:** velocidad de escape — el esfuerzo que vuelve a caer.
- **Dirección de Alan (21/07, gate del plan de operación):** la sección Dolores **SE FUSIONA con esta escena** (la sección ES el cinturón; las cards actuales se transforman en rocas con el nombre tallado). **Interacción: el visitante DESTRUYE los asteroides (point & click / tap) para avanzar** — refuerza la narrativa de superar las adversidades que todo dueño negocia. Detalles (avance bloqueado vs recompensa, teclado, mobile, reduced-motion) se resuelven en el boceto de E2.

### 3 · MOSTRADOR — El aterrizaje
Aterriza y arma la tienda con los restos de la nave: mal estado pero entrañable (cartel torcido pintado a mano). Con el scroll, **la transformación**: el cartel se endereza y se enciende (neón ámbar), la vitrina se ilumina, el primer alien mira el escaparate.
**Vista isométrica tipo casa de muñecas** — los tres planos visibles a la vez:
- **Fuera** = lo que el barrio ve (tu presencia / tu web).
- **Dentro** = la experiencia de compra (el mostrador, el alien comprando).
- **Detrás** = la operación real (la trastienda: papeles, el caos que el cliente no ve).
- **Concepto:** gravedad — con presencia, la tienda atrae.
- **Nota:** es el set-piece #2 del sitio (hermano de la supernova).
- **Dirección de Alan (22/07) — el aterrizaje (E3) se cuenta COMPLETO:** no son solo nubes: el protagonista desciende CON su nave — primero las capas altas de la atmósfera, después las nubes flat, y toca tierra. Recién al aterrizar arranca la transformación de la tienda (E4).
- **Dirección de Alan (21/07, gate del plan de operación):** el demo standalone del mostrador (La Espiga) "por sí solo tiene poco": el ciclo de pedido **se representa EN la escena** — el alien hace el pedido y el dueño lo recibe — y en la narrativa del sitio se entiende igual. Si conviene marcarlo como punto de avance explícito dentro de la escena, se evalúa en el boceto de E4. Supersede la idea de conservar el componente demo como pieza aparte.

### 4 · PROCESO — Como arriba, es abajo
La sección se parte en dos mitades espejadas. **Arriba el cielo:** cuerpos entrando en órbita, fase a fase. **Abajo la tierra:** la tienda construyéndose, fase a fase (brief → diseño → build → lanzamiento). Remate: *"así como un satélite orbita un planeta, un cliente orbita el negocio"* — la última fase muestra la primera órbita capturada: **el primer cliente que vuelve**.
- **Conceptos:** stages del cohete + órbitas = clientes recurrentes.
- **Dirección de Alan (22/07) — beat de crecimiento:** tras la primera órbita capturada, un paso más: entran MÁS objetos en órbita del planeta/negocio — la sensación de crecimiento va más allá de un solo cliente.

### 5 · TABLERO — Mission control
El mismo escritorio de la trastienda del Mostrador: papeles, post-its, caos. Con el scroll se ordena y se convierte en el tablero — y en pantalla, por primera vez, **el pulso regular**. El dueño ve su negocio entero por primera vez. Emoción de la sección: **orgullo**.
- **Concepto:** el electrocardiograma del negocio.
- **Leitmotiv EKG:** aparición 3 de 4 (el pulso regular en pantalla).
- **Dirección de Alan (22/07) — mission control es INTERACTIVO:** el visitante ejecuta un par de acciones en el panel (adaptadas a la narrativa) que hacen AVANZAR el proceso en la tienda — entiende que el sistema es funcional de verdad, no un dibujo. Además, el panel ALOJA el switch de skins ([[BL-16]]): pasar por ahí y tocarlo muestra cómo cambia el sistema entero (antes vivía en el panel Diseño de quien-soy).

### 6 · QUIEN-SOY — El navegante *(REDEFINIDO por Alan, 22/07)*
**Quien-soy sale de la película: pasa a PÁGINA APARTE del sitio**, linkeada siempre visible desde la barra de navegación — "si alguien realmente quiere saber quién está detrás, hace clic ahí". Así la historia del viaje no se mezcla con la biografía. Las demos contratadas en BL-13 **se redistribuyen dentro del viaje**, donde narrativamente trabajan:
- **Skin switch** → vive en el panel de mission control (E6): el usuario pasa por ahí, lo toca y ve cambiar el sistema entero (BL-16, barrido contratado).
- **Fichas de Construcción** → candidato a vivir donde se CONSTRUYE: dentro de E4 (dollhouse) o E5 (órbitas/proceso) — se decide en esos bocetos; después de eso entra el tablero ya listo.
- **Toggle Calidad** → a reubicar (página quien-soy o una escena); se decide al replanificar BL-13.
El giro ("este viaje lo construí yo") y el colofón de venta ("esto mismo hago con tu negocio") viven en la página nueva.

### 7 · CTA — Mandá tu señal *(revisable)*
La tienda del protagonista ya late en el mapa: un púlsar chiquito en el barrio. El form se reencuadra como **tu señal** (los campos ya existen: nombre, negocio, qué te duele, canal preferido). Del otro lado hay un humano escuchando (copy actual: "Te leo y escucho yo, Alan").
- **Concepto:** el despegue — tu pulso, hecho estrella.
- **Leitmotiv EKG:** aparición 4 de 4 (el último latido asciende y se convierte en la estrella del logo).
- ⚠️ **Deuda verificada (21/07):** el form es maqueta — botón `type="button"` sin handler, no envía. Cablearlo al mail live es prerequisito de mostrar el sitio (→ F5).

## Batería de conceptos-física (para copy)

| Concepto | Física | Uso |
|---|---|---|
| El púlsar | Estrella que emite pulsos con precisión de reloj; los navegantes los usan de faro/GPS | "Tu tienda late, pero el barrio no la ve. La convertimos en púlsar." Ata **Faro Ámbar** (el púlsar ES el faro del espacio) |
| Velocidad de escape | Debajo de cierta velocidad, todo lo que subís cae de vuelta | "No te falta esfuerzo — te falta velocidad de escape." (Dolores) |
| Gravedad | La masa curva el espacio y atrae | "Tu negocio ya tiene peso en el barrio. Démosle gravedad." (Mostrador) |
| Órbitas | Cuerpo capturado que vuelve | Cliente recurrente = luna en órbita (Proceso/Tablero) |
| Stages del cohete | El despegue es quema por etapas, no un empujón | El proceso por fases; "el negocio despega en pulsos de fuerza" |
| El EKG | Signos vitales | El tablero = monitor del negocio |
| La constelación | Estrellas que forman figura | El barrio vivo; visión de agencia (cierre) |

## Canon visual

- **Estilo:** flat vectorial estilo science-explainer (inspiración Kurzgesagt, no copia), **con profundidad**: vistas isométricas donde representen algo (tienda dollhouse, escritorio/tablero, construcción del Proceso). El espacio abierto queda frontal/plano.
- **Paleta — regla "LA LUZ ES ÁMBAR":** base noche compartida (#12162E–#1B2140) para que todo asiente en el mismo universo; los mundos tienen color libre (nebulosas magenta/cian, planetas óxido, aliens verdes…); pero **la luz que importa es siempre ámbar** (#F2A63E): neón de la tienda, ventanas encendidas, estrella guía, el pulso en radar y tablero. El ámbar es la firma lumínica, no el color de todo.
- **Luz procedural convive:** supernova y estrellas canvas quedan como están — son luz, no fotografía.
- **Nubes fotográficas de umbrales:** se retiran/regeneran en flat (decisión Alan 21/07, sin restricciones).

### Sistema de capas (aprobado)

| Capa | Velocidad | Contenido | Técnica |
|---|---|---|---|
| Z0 | 0x (fijo) | gradiente nocturno + estrellas | SkyLayer actual |
| Z1 | ~0.15x | galaxias/nebulosas enormes y difusas | imagen sobre negro puro + blend `screen` |
| Z2 | ~0.4x | planetas, lunas, cometas, asteroides | WebP con alpha; 1 elemento "firma" por sección |
| Z3 | 1x | las secciones | lo existente |
| Z4 | ~1.2x | polvo esporádico | casi nada; jamás sobre texto |

Reglas duras: máx **2 elementos decorativos por viewport** · transform-only (nada que repinte) · lazy fuera de viewport · el contenido siempre gana.

### Assets animados (requisito, no opcional)

Nada queda estático — todo respira. Tres niveles de costo:
1. **Idle loops** (el 80%): CSS keyframes sobre el asset entero — flotación, rotación lenta, parpadeo. Loops 2–6s, amplitudes chicas, transform-only.
2. **Rigging por capas** (protagonistas): asset cortado en 2–4 piezas (cuerpo/ojos/brazos; planeta/anillo/lunas), cada una con su movimiento.
3. **Scroll-driven** (los momentos): propiedades que avanzan con el progreso — el asteroide rota al bajar, el neón se enciende, la llama de la nave.

Sanidad: se pausan fuera de viewport · `prefers-reduced-motion` congela todo · nunca dos niveles peleando en el mismo viewport.

### Leitmotiv EKG (dosificado — decisión Alan 21/07)

NO es línea continua (con el scroll largo saturaría). Cuatro apariciones: **nace** en la intro → **radar** en el hero → **pulso regular** en el tablero → **asciende a estrella** en el CTA.

## Reskin × narrativa

**Guión invariante, piel intercambiable.** Historia, escenas, layout y coreografía son el esqueleto; cada skin de BL-16 re-renderiza los mismos assets con otro estilo. El skin es demo de rango de diseño; la narrativa es la misma en los tres.
- **Candidato nuevo (Alan 21/07):** skin **"cómic"** — las mismas escenas contadas en viñetas generadas. Es el skin más caro posible (regenerar el set completo de assets en otro estilo). Anotado en BL-16; decisión de cuáles son los 2 skins cuando BL-16 arranque.

## Pipeline de producción de assets

1. **Template de prompt maestro** (abajo) — todo asset se genera con él para consistencia entre generaciones (el riesgo #1 de los generadores).
2. **Set de prueba: 5 piezas** — 1 galaxia (Z1), 1 asteroide con cara (Z2), el protagonista, el alien, la tienda (fachada). Se validan **montadas en el sitio** antes de producir en serie.
3. **Producción por sección**, en el orden del guión. Cada asset se corta en capas si va a nivel 2 de animación.

### Template maestro (base, parametrizable)

```text
Flat vector illustration, modern science-explainer style, [SUBJECT],
night-space setting, deep indigo background (#12162E to #1B2140),
clean geometric shapes, 2-3 tones per object, subtle grain texture,
soft warm amber rim light (#F2A63E) as the only brand light,
minimal or no outlines, no text,
[VIEW: front-flat | isometric cutaway],
[OUTPUT: nebula/galaxy on pure black background (for screen blend) |
 solid object on plain background (for background removal)]
```

## Arquitectura de escenas (dirección de Alan, 21/07 — post-validación)

> "Esta web ahora cuenta una historia. Hay que darle el timing que cada escena merece con su impacto adecuado."

- **La página es una película de scroll:** ESCENAS que ocupan la totalidad de la pantalla (o del umbral) intercaladas con SECCIONES de contenido. Se avanza escena por escena, por momentos.
- **El umbral deja de ser fijo:** cada escena define su tamaño según su momento narrativo — una escena clave puede ocupar 100vh+ y anclarse (pin) mientras su animación interna avanza con el scroll (patrón ya probado en quien-soy P2); una transición breve puede ser 40vh.
- **Transiciones dirigidas** escena→sección y sección→escena: nunca un corte seco.
- **Nubes fotográficas: FUERA** (ejecutado 21/07 — peleaban con el canon y no contaban historia; con ellas murió el borde recto x≈1065). Las nubes vuelven FLAT y con rol narrativo único: **la escena del ATERRIZAJE al planeta** (atravesar la atmósfera antes de llegar al barrio/Mostrador).
- **La intro supernova se revampea al guión:** hoy son ~8s genéricos; debe contar la escena 0 (la tienda del protagonista, el colapso, el escape, el pulso naciendo) con su timing e impacto propios.
- **Mapa tentativo de escenas** (a refinar uno por uno con Alan): E0 supernova+escape (intro revamp) · E1 radar/zoom al pulso (transición Hero→Dolores) · E2 el cinturón de asteroides (umbral grande) · E3 aterrizaje entre nubes flat (pre-Mostrador) · E4 la tienda dollhouse (Mostrador) · E5 órbitas (Proceso) · E6 mission control (Tablero) · E7 constelación final (CTA).
- **Motor técnico:** GSAP ScrollTrigger (pin/scrub) + Lenis — ya presentes en el stack (StarLayer los usa). El sistema de escenas ES el build principal de BL-17; arrancar por spike de 1 escena punta a punta.

## Referencias de dirección aportadas por Alan (21/07 noche)

> Alan: "algunos dan en el clavo con lo que busco lograr pero con otros estilos; otros son para tomar ideas, narrativas o transiciones". Se minan durante el BOCETO de cada escena (no antes) — junto con la referencia madre [journey.zajno.com](https://journey.zajno.com/).

- https://www.sbs.com.au/mygrandmotherslingo/ — narrativa interactiva por capítulos.
- https://ponpon-mania.com/ — personaje animado protagonista, tono lúdico.
- http://species-in-pieces.com/ — morphs/transiciones de formas planas (afín al canon flat).
- https://brand.dropbox.com/logo — presentación de sistema de marca (útil para BL-13 panel Diseño / BL-14).
- https://seedjourney.croptrust.org/ — journey scrollytelling por etapas.
- https://eszterbial.com/projects/artifex — case study con motion fino.

## Abierto (no bloquea producción del set de prueba)

- Guión fino de Quien-soy y CTA (revisables por Alan).
- Elenco definitivo (qué personaje aparece en qué escena).
- Copy final por sección con la batería de conceptos.
- Forma de la nave del protagonista (detalle con humor: ¿algo de tienda?).
- Cómo se integra la viñeta del escape en la intro sin alargar los 8s actuales.
