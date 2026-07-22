# Boceto de dirección — E0 · La supernova (revamp de la intro)

> **Estado: GATEADO por Alan (22/07) en estructura** — los 4 actos y la re-lectura del polvo quedan. **Abierto: el CANAL de producción** (canvas vs video, ver § Addendum al final). Task 1.1 de `openspec/changes/bl17-escenas/tasks.md`.
> Fuentes: guión §0 · plan de operación (E0: "se transforma") · mapa de referencias fila E0 (Species: shards radiales · PonPon: color como narrador · Lingo: copy apilándose sobre escenario constante) · `Intro.tsx` actual (motor = función pura de `p`, fases en TUNING).

## La idea en una línea

La intro actual tiene un motor de partículas excelente y una explosión que Alan aprobó ("muy bonita") — pero cuenta la historia INVERTIDA: acreción (polvo → estrella) es el NACIMIENTO de una estrella, no su muerte. El revamp re-secuencia el mismo motor para contar el colapso real: **la estrella del sistema YA EXISTE, se desestabiliza, colapsa hacia adentro (y en esa succión se lleva la tienda), rebota y explota** — y la nebulosa remanente QUEDA como fondo del sitio.

> **Física real (dirección 22/07, verificada):** una estrella masiva muere así: se hincha (gigante roja, lento) → el núcleo colapsa hacia ADENTRO en segundos (compresión) → el rebote es la explosión → el remanente persiste milenios como nebulosa (ej. la del Cangrejo). El "inhale" del motor actual (contracción pre-estallido) es físicamente correcto y se conserva; lo que se elimina es la fase de acreción-nacimiento.

## Los cuatro actos (progreso `p` de 0 a 1)

| Acto | Banda `p` | Qué se ve | Qué cuenta |
|---|---|---|---|
| **1 · La tienda** | 0 → 0.22 | Cielo nocturno. La viñeta flat de la tienda, chica, centrada, ventanas ámbar: la única luz cálida. **Y arriba, ya presente, la estrella de su sistema** — un sol chico, estable, que ilumina la escena. Idle sutil. Línea 1 de copy. | Tenía su tienda en un sistema lejano. Le iba bien, o alcanzaba. |
| **2 · El colapso** | 0.22 → 0.55 | **La estrella se desestabiliza: se hincha, parpadea, vira de tono** (gigante moribunda — sin acreción: la estrella no nace, MUERE). Después empieza el colapso hacia adentro y su gravedad tira de todo: **el color se drena** (receta PonPon/D3) y la tienda **se fragmenta en shards poligonales succionados** hacia la estrella (receta Species invertida) — el infall del motor actual, re-leído: lo que cae no es polvo, es su mundo. Línea 2 de copy. | Las cosas que un dueño no controla: el alquiler, la mudanza, el mercado. El colapso se lleva todo. |
| **3 · El escape** | 0.55 → 0.66 | El `inhale` del motor actual — que ahora ES la física real: el núcleo se comprime, todo se aquieta un instante. En esa pausa, una chispa ámbar con estela sale disparada en diagonal — la nave, lo único que escapa. En su estela se dibuja un **micro-EKG: el leitmotiv nace acá (1 de 4)**. Línea 3 de copy. | Escapa con lo único que salvó: el mostrador. En la onda viaja el último latido de la vieja tienda — que es el primero de la próxima. |
| **4 · Supernova** | 0.66 → 1 | **El rebote: la explosión existente (aprobada por Alan), intacta** — anillos, flash, wordmark PULSIMUS emergiendo. Y el cambio clave (dirección 22/07): **la nebulosa remanente NO se desvanece con el overlay — persiste como el fondo del sitio** (handoff al cielo Z1: la nebulosa de la intro y las nebulosas del SkyLayer/Z1 son la misma cosa, lejos del planeta). La supernova destruye y siembra, literal. | El fin de algo es el material del próximo comienzo. |

**Salida (sin cambio):** fade + reveal del hero, símbolo del header aparece.

## Timing

`autoplaySecs` **8 → 10**. Los actos 1–2 necesitan aire para leerse (≈2.2s y ≈3.3s); el clímax conserva su ritmo actual (~3.4s). El costo real del +2s es casi nulo porque **el skip queda igual** (click/Enter/Espacio/Escape, cartel "CLICK PARA SALTAR") y la intro sigue siendo 1×/sesión. Alternativa si 10s te parece largo: comprimir acto 1 a ~1.5s (total 9s) — mi recomendación es 10s: es la única vez que el visitante la ve entera.

## Copy (borrador para macerar — voz tuya, se gatea aparte)

1. «Tenía su tienda en un sistema lejano.»
2. «Hasta que pasó lo que no controlaba.»
3. «Escapó con lo único que importaba: el mostrador.»

Tres líneas cortas que se apilan (patrón Lingo), DOM real encima del canvas (nítido, tipografía Outfit), sincronizadas a `p`. Si preferís la intro muda (solo imagen), las líneas se cortan sin tocar la coreografía.

## Assets — propuesta: tanda CERO nueva

- **La tienda:** reusar la **fachada curada de la tanda 1** (`public/space/`, la que pasó "con honores"). Es la tienda nueva de E4, sí — pero acá aparece chica, lejana y en des-saturación: funciona como "la vieja tienda" sin generar nada. Si más adelante querés una variante "vieja" (cartel pintado a mano vs. neón), se regenera en la tanda de E4 y se swapea acá en un paso.
- **La nave, los shards, el EKG:** procedurales (canvas/CSS) — sin assets.

Resultado: **E0 se puede construir sin esperar generación** — el gate de assets (task 1.2) queda en "reuso aprobado" o "variante vieja a la tanda de E4", lo decidís acá.

## Mobile y reduced-motion

- **Mobile:** misma narrativa, mismos 4 actos (la intro ya corre full-viewport en mobile). Ajustes: viñeta ~30% más chica, copy máx 2 líneas visibles a la vez, estela del escape más corta.
- **Reduced-motion:** sin cambio de contrato — la intro se omite y el hero queda revelado.

## Técnica (para el build, resumen)

Todo dentro del motor actual, que **SE ADAPTA, no se reusa verbatim** (dirección 22/07): se ELIMINA la fase de acreción-nacimiento (la estrella arranca ya formada: `drawCore` visible desde `p=0` con radio estable) + fases nuevas en `TUNING.phase` (`storeIn`, `destabilize`, `collapseStart`, `escapeAt`) + desestabilización como oscilación de radio/tono del core + la viñeta como capa `drawImage` con slicing a shards en offscreen canvas (cada shard hereda un `Dust` del pool al soltarse — el infall ya está programado) + drenaje de color en función de `p` + copy como overlay DOM. La explosión (anillos/flash/sparks) no se toca. **Handoff de la nebulosa:** al terminar, la nebulosa remanente no muere con el overlay — transición coordinada con el cielo del sitio (nebulosas Z1 apareciendo donde estaba la de la intro; forma exacta a resolver en el build). Verificación: Playwright sobre build de prod, arco completo + skip en cada acto + `?intro` + mobile 375.

## Estimación del build (task 1.3–1.4)

~120–200k tokens · 45–75 min (piso del rango de escena del plan: el clímax ya existe y no hay espera de assets). Candidato a ejecutor Sonnet con spec cerrada UNA VEZ gateado este boceto; la dirección y el QA quedan acá.

## Lo que decidís en este gate

1. ¿Los 4 actos cuentan la escena 0 como la ves? (estructura y re-lectura del polvo como la tienda) — ✅ **gateado 22/07 ("me parece bien")**
2. Timing: ¿10s con skip, o 9s comprimido?
3. Copy: ¿con líneas (borrador a macerar) o intro muda?
4. Assets: ¿reuso de la fachada tanda 1, o variante "tienda vieja" en la tanda de E0/E4?
5. El nacimiento del EKG en la estela del escape (aparición 1/4).

## Addendum (22/07) — el canal: ¿video de Higgsfield o canvas?

Dirección de Alan en el gate: para la intro, una versión CSS/canvas simplificada "no tendría el mismo impacto"; es más fácil darle diseños de personaje a Higgsfield y generar un video bien dirigido (~8s, o micro-clips que después se unifican).

**Es viable** — la intro es autoplay puro, no scrubea con scroll (el descarte del 18/07 era para video como motor de scroll, otra cosa). **Propuesta recomendada: HÍBRIDO.**

- **Video para los actos 1–3** (tienda → colapso → escape, ~5–6s): es la parte con personajes y actuación, donde el video gana por paliza al canvas procedural.
- **Crossfade al clímax canvas existente** (supernova → wordmark → reveal): tres razones técnicas. (1) Texto dentro de video comprimido queda lavado — el wordmark tiene que ser nítido y ya lo dibuja el canvas. (2) El clímax ya está construido, es independiente de resolución y no pesa nada. (3) Si el video no carga o tarda, el canvas arranca solo: fallback natural sin pantalla muerta.
- **Alternativa B** (video completo 0→1): más simple de dirigir, pero más peso, wordmark lavado y tira a la basura el clímax construido. No la recomiendo.

**Costos duros a validar en el spike** (por eso es spike y no decisión ciega): peso (~3–6MB por 5–6s; las escenas oscuras comprimen bien), doble aspect desktop 16:9 / mobile 9:16 (dos renders o encuadre con acción centrada crop-safe), consistencia con el canon (generar DESDE los stills aprobados como referencia), y autoplay mobile (muted + playsinline — sin audio, ya cumplimos). ⚠️ Verificar también si el video en TU plan de Higgsfield descuenta créditos (el toggle Unlimited que conocemos es de imágenes).

**Siguiente paso:** tanda E0 del doc de assets ([`bl17-assets-direccion.md`](bl17-assets-direccion.md) §3) — model sheets + 1 video de prueba de los actos 1–3. Lo montamos y decidimos el canal con datos.
