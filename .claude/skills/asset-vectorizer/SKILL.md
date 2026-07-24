---
name: asset-vectorizer
description: >
  Convierte un asset ilustrado GEOMÉTRICO generado por IA (sobre fondo verde) en un
  SVG vectorial limpio, fiel y riggeable — recortando, leyendo su estructura, y
  redibujándolo con primitivas + gradientes nativos. Use cuando haya que limpiar,
  recortar, leer o vectorizar assets de una escena (carita/ventana, toldo, cartel,
  puerta, tienda…) para el pipeline de escenas o para riggear en Rive. Palabras
  gatillo: vectorizar asset, recortar chroma, limpiar borde, raster a SVG, calcar,
  pieza para Rive.
---

# asset-vectorizer — raster ilustrado → SVG vectorial fiel

> Estado: **spike validado con la carita (ventana E0)** el 2026-07-24. **Stress-test de la tienda hecho + gateado por Alan el 24/07** (asset complejo): el método rinde pero tiene techo — ver *Techo de fidelidad*.
> **Doctrina (Alan, 24/07): la skill se pule para que funcione con CUALQUIER input.** La tienda/composite es el **test de estrés A PROPÓSITO** — se optimiza contra el peor caso para que, cuando lleguen las grillas de assets 2K/4K, la operativa ya esté al límite. **NO se regenera un asset para tapar un bache del método: se endurece el método.** Vive en el repo mientras se refina; promover a global cuando madure y se use en otro proyecto.

## Dónde encaja en el pipeline (leer junto con [pipeline-assets.md](../../../docs/direccion/pipeline-assets.md))

Esta skill es el **paso 5** (raster→SVG) del pipeline de assets. La cadena punta a punta:

**3.** Alan genera el **sheet 4K DESARMADO** sobre verde (nano-banana despieza — mejor que un bbox) → **4.** Claude limpia (chroma) + separa (connected-components) → **una pieza PNG por archivo** → **5.** ESTA skill vectoriza cada pieza → SVG riggeable → **6.** rig + efectos ⚡.

- **Input canónico:** una **pieza individual, limpia y completa** (del paso 4). NO un bbox de composición ensamblada — eso arrastra fondo/luz/vecinos y es solo fallback.
- **Mejor input → mejor vector:** la pieza desarmada por banana a 4K, sin solapes ni luz horneada, es lo que habilita subir la fidelidad.
- **PERO el método DEBE aguantar el composite igual** (doctrina Alan 24/07): a veces no hay individual (test de estrés, o assets que vienen juntos en un sheet). Cuando entra un composite, dos patas lo salvan **sin round-trips agente↔director**: **(1)** medí cada bbox con SCRIPT, nunca a ojo; **(2)** scoreá cada pieza enmascarando la fuente a su silueta. Detalle en *Aprendizajes del GATE* abajo.

## Criterios de decisión (NORMA BASE — sellado 24/07)

> El objetivo NO es "el método que más escala" — es **el que mejor CALCA cada pieza** (vectores de alta fidelidad). Se elige el camino que MAXIMIZA la fidelidad para ESA pieza. Un método escalable con resultado mediocre **no se usa**.
> Referencia de calidad (NORMA BASE): [`face_smile_3.svg`](../../../space-src/e0-supernova/piezas/spike-rive/face_smile_3.svg) (score **8.31** vs el PNG con `score.mjs` a full-res) — carita con primitivas + bevels, calcada **del PNG en 1 sola pasada** con esta skill afinada. Las versiones previas (`face_smile.svg` v1 con glow inflado + borde inferior mal, y `face_smile_2.svg` v2) están archivadas en `spike-rive/_archive/`.
>
> ⛔ **REGLA DE ORO DEL CALCO: se redibuja SOBRE EL PNG, SIEMPRE.** Un SVG de referencia previo es **solo vara de score** (`score.mjs`), **NUNCA fuente para copiar**. Abrir el SVG de referencia durante el redibujo hace heredar sus errores y anula el ejercicio. La verdad está en el raster, no en un vector anterior.

### Cómo el agente lee una pieza y elige el camino

1. **Segmentar por color** → separar las PARTES (marco, cara, rasgos…). Script: `segment2.mjs` (clasifica por hue/frialdad, connected-components para instancias).
2. **Clasificar cada parte por su FORMA:**
   - **Primitiva** (círculo, rect redondeado, arco, elipse) → **primitiva nativa MEDIDA** (centro/bbox/radio de la segmentación). Ej: ojos = `<circle>`, cara = `<rect>`, boca = arco cúbico. Máxima limpieza, peso mínimo, fidelidad máxima en formas simples.
   - **Forma libre / irregular** (contorno complejo, curva no primitiva) → **trace por máscara** (vtracer bw sobre la máscara de la parte).
   - **Textura / orgánico** (grano, follaje, fuego) → NO vectorizar → raster o efecto de código ⚡.
3. **Clasificar el RELLENO de cada parte:**
   - Plano → color muestreado (promedio de la máscara).
   - Gradiente → `linearGradient`/`radialGradient` muestreado del raster (franjas SOLO de esa parte).
   - **Bevel / profundidad** (borde con luz-sombra que da volumen) → **SÍ se dibuja: es carácter del dibujo, NO luz dinámica.** (Distinto del glow/haz/split global de E0, que sí va por código.)
   - **El depth es ASIMÉTRICO — medí los 4 bordes por separado, NO asumas bevel simétrico.** La luz viene de un lado (en la carita, arriba-izquierda) → el tono oscuro de profundidad asoma **solo del lado en sombra** (derecha), y los otros 3 bordes son de UN tono. Modelarlo como "sombra abajo+derecha" por defecto es el error clásico: en la carita el borde inferior es liso y el oscuro va solo a la derecha. Escaneá cada borde (¿dónde aparece el tono oscuro?) antes de dibujar.
   - **El glow/highlight de volumen es SUTIL.** Si lo modelás con un radial claro, medí su fuerza contra el PNG y quedate corto (la `face_smile.svg` vieja lo puso al 0.42 y lavó la cara; el real ≈0.14). Más glow ≠ más fiel.
4. **Ensamblar:** z-order correcto + cada parte con `id` nombrado (riggeable). Cara SÓLIDA detrás (sin agujeros que dejen ver el marco), rasgos ENCIMA.

### Elección de método global, según la pieza

| Pieza | Método | Por qué (probado 24/07) |
|---|---|---|
| **Simple / geométrica** (carita, cartel, ventana, puerta) | **NORMA BASE**: primitivas medidas + bevels + gradiente muestreado | Más fiel, limpio y liviano (2.4KB). El trace NO lo supera: introduce gaps y pierde los bevels/profundidad. |
| **Compleja / irregular** (tienda entera, toldo festón, contornos libres) | **TRACE HÍBRIDO**: trace por máscara + primitivas donde apliquen + gradiente | El a-mano no escala ni pasa de ~60-80% en formas irregulares. |
| **Orgánico / texturado** | Raster o efecto de código ⚡ | Vectorizar pierde o explota en cientos de paths. |

### Aprendizajes del spike (24/07 tarde) — NO repagar

- **El trace crudo (vtracer color) da fidelidad ~95% PERO 265 paths anónimos, no riggeable.** El nudo no es fidelidad, es ESTRUCTURA. Post-proceso = segmentar + trazar por parte + colapsar gradiente.
- **Para piezas simples, primitivas > trace.** El trace de máscara arrastra la irregularidad del raster (bordes con micro-dientes) y deja **gaps negros** entre paths que no se solapan. Las primitivas (círculo/rect/arco) encajan perfecto y pesan menos.
- **El BEVEL es parte del dibujo, no luz por código.** Error del spike: descartarlo pensando que era "luz dinámica". El highlight del marco y el borde interior de la cara dan la PROFUNDIDAD que distingue high-fi de low-fi. El ojo de diseñador de Alan lo cazó.
- **Gradiente muestreado del raster > estimado a ojo.** Muestrear la rampa real (franjas de la parte) y volcarla como `stops` es superior a adivinar 2-3 tonos.

### Aprendizajes del TEST DEL MARCO (24/07 noche) — carita redibujada de cero, `face_smile_2.svg`

- **El marco guía bien la ESTRUCTURA**: 2 iteraciones a ciegas (solo PNG + reader + score) dejaron la pieza a un pelo de la vara. El proceso segmentar→clasificar→primitivas medidas funciona.
- **Calcar sobre el PNG, no sobre un SVG previo** (regla de oro arriba): el error se coló cuando se miró la `face_smile.svg` para "cerrar el gap" y se heredó su borde inferior oscuro. Calcado del PNG puro → más fiel que la referencia.
- **Medir los 4 bordes del marco por separado** (ver punto 3): el depth oscuro va solo al lado en sombra. Asumir simetría metió oscuro en el borde inferior; medir lo corrigió (score 8.8→7.98).
- **El glow real es sutil** (~0.14, no 0.42). El `score.mjs` baja monótono al corregirlo — pero NO optimizar a 0 (perdés el rasgo de volumen): elegir con ojo el valor que mantiene la profundidad Y calca.
- **Sub-estructuras que el reader detecta pero hay que ELEVAR a checklist al redibujar:** (a) el **marco** también lleva gradiente (no solo la cara); (b) el gradiente de la cara suele tener un **escalón** (banda inferior plana), no rampa continua; (c) el **glow** diagonal sutil.

### Asset COMPUESTO (escena multi-pieza) — corrida de la tienda (24/07 noche)

Cuando el asset es una ESCENA entera (la tienda: fachada + toldos + carita + puerta + cartel + buzón + plantas…), no se vectoriza como una pieza sola. Flujo probado (tienda completa = **40KB, 31 grupos riggeables, score 18.6** vs el trace 4.24 pero 531KB **no** riggeable):

1. **Mapear las zonas con SCRIPTS, nunca a ojo.** Cada elemento → bbox medido con connected-components / escaneo de alpha+color. (En la tienda, mapear "a ojo" desde una vista reducida metió bboxes corridos ~500px — ver gotcha de coords.)
2. **Vectorizar cada pieza por separado**, en **coordenadas ABSOLUTAS del canvas completo**, cada una un SVG con `<g id="pieza">` + sub-ids, y **ids de gradientes/clips PREFIJADOS por pieza** (`toldo-`, `buzon-`…) — sin prefijo, colisionan al juntar.
3. **Ensamblar por z-order** con `assemble.mjs <out> <p1> <p2> …` (junta los `<defs>`, apila en orden de args: primero = atrás).
4. **Reusar piezas-norma** ya hechas (la carita) reubicándolas con `transform="translate() scale()"` — medí la escala por 2 puntos discretos (los OJOS) y confirmala con un tercero (el radio del ojo escalado). Robusto.
5. **Medir el score en el ENSAMBLE**, no por pieza. El bbox de una pieza contiene contexto ajeno (pared, solapes) que la pieza correctamente no dibuja → su score aislado se infla; el número real sale del conjunto (la base llena el fondo).

**Delegación:** cada pieza es un contrato cerrado para un subagente (redibujá SOLO tu pieza · coords absolutas · ids prefijados · **refiná el bbox midiendo vos** · auto-verificá con `score.mjs`). Los 6 ejecutores corrigieron errores del brief por evidencia (coords, colores, piezas inexistentes). Delegá ejecución, no criterio (el z-order y el ensamble los define el director).

**Gotchas de asset compuesto (comprados en la corrida):**
- **Coords vista vs reales:** si mapeás mirando una imagen mostrada a escala reducida, multiplicá por su factor. Mejor: medí el bbox con un script, no a ojo.
- **`density` + `extract`:** renderizar un SVG con `sharp(svg,{density:D})` da un raster de `size·D/96`; hacer `extract` con coords del viewBox cae en el lugar equivocado. Renderizá a canvas exacto (`resize(W,H)`) ANTES de recortar. (`score.mjs` no sufre esto porque hace `resize`.)
- **Colisión de temporales:** `overlay.mjs`/`score.mjs` escriben `_trace_*.png` junto al SVG; en corrida multi-agente con dir compartido se pisan. Usá temporales por-proceso / scratchpad propio.
- **Score de escena limpia ≠ trace:** el redibujo aplana el grano a propósito → su score contra el raster es más alto que el del trace (que lo copia). Es correcto: el valor es formas nítidas + riggeable + liviano, no el número.

### Aprendizajes del GATE de la tienda (Alan, 24/07 noche) — endurecer el método

> Alan revisó el primer run completo. Principio que reforzó: **capturar la ESENCIA de cada elemento y pulir.** Las tres correcciones que dio NO se guardan como defectos de la tienda (eso vive en `tienda/HALLAZGOS-corrida-tienda.md`) — se destilan a **lecciones de método** generalizables.

**Input (con la doctrina de arriba):**
- **Individual cuando exista** → vectorizá desde SU PNG limpio (leé su estructura aislada con `read-structure`/`detect-features`); el composite solo aporta el **bbox de posición**. Separá *redibujar* (del individual) de *posicionar* (en el composite).
- **Robusto al composite siempre** (test de estrés) con las 2 patas: bbox por script + score enmascarado a la silueta.

**Lectura de la pieza — las 3 correcciones del gate = 3 reglas:**
- **NO aplanes una pieza compleja a 1 primitiva.** El techo salió *un rect con gradiente*; era **≥5 tablones + frente curvo perspectivado** (techo abovedado, no plano frontal). Regla: si una pieza hermana tiene sub-estructura (la pared = tablones), asumí que ésta también hasta verificar. Leé CADA pieza con el mismo rigor; la simplificación a ojo miente.
- **Orientación de patrones = ambigüedad "poste de barbero".** Scallops / rayas / festones pueden salir **espejados** (los toldos salieron con las curvas AL REVÉS, y el par mal cortado + despegado del poste). Confirmá la dirección con `overlay.mjs`/diff contra el PNG **DESPUÉS de dibujar** — nunca la des por buena a ojo. Y anclá la pieza a su soporte (el toldo cuelga DEL poste: verificá el encastre).
- **Silueta COMPLETA antes de vectorizar.** Un recorte que se come una parte (la **base oscura inferior del buzón** desapareció) da una pieza mutilada. Revisá que la máscara del `clean` cubra TODA la pieza — bordes incluidos — antes de redibujar. Un bache de recorte se propaga al vector.

**Rig — gotcha técnico (lo cazó el agente "entrada", corrigió 4):**
- **id de gradiente/clip ≠ id de elemento.** Un `<g id="puerta">` y un `<linearGradient id="puerta">` **colisionan** → SVG inválido y **rig roto en Rive**. Namespaceá: elemento `id="puerta"`, gradiente `id="puerta-grad-1"`, clip `id="puerta-clip"`. (Extiende la regla de prefijos-por-pieza al espacio de ids DENTRO de la pieza.)

**Score confiable por pieza (mata round-trips):**
- **Enmascará la fuente a la silueta de la pieza ANTES de scorear.** El bbox crudo mete **35–40% de contexto ajeno** (pared, solapes) → el score no baja de ~9–15 aunque el cuerpo calque a d=4–6 → el agente no confía en su número y **depende del ensamble para saber si calcó** (round-trip con el director). Con el masking (como se midió `face_smile_3` y `cartel-store`), el score LOCAL es real y cada pieza converge sola. Deuda: exponerlo en `score.mjs` como flag `--mask <silueta.png>`.

### Deuda — pulir AMBOS procesos al límite (fase de construcción, no cerrada)

- **Norma base:** templatizar los bevels; usar la medición automática de `segment2` para colocar las primitivas con precisión (que deje de ser "a ojo").
- **Trace híbrido:** matar el gap negro (solapar paths / marco sólido detrás), agregar bevels muestreados, bajar peso (simplificar paths / `path_precision`).
- **Toolkit de composite (los 4 scripts que matan iteraciones — construir + probar en el próximo run contra la tienda):**
  - `map-pieces.mjs <composite.png>` → tabla de bboxes de TODAS las piezas por connected-components. Elimina la ronda entera de "los agentes corrigen el bbox por evidencia" (fue el eslabón débil de la corrida: 5 corrimientos de ~500px por mapear a ojo). (Un tiling ciego por cuadrantes NO reemplaza esto — un objeto cruza varias celdas y se fragmenta; ver [research](../../../docs/direccion/tecnicas-mapeo-verificacion-research.md) § 1d.)
  - `score.py` — **✅ HECHO (25/07): score multi-eje FORMA + COLOR** (IoU/cobertura + ΔE p95 + SSIM + Hausdorff, región por TARGET, distingue FALTA/SOBRA). Vara automática de la Opción B (ver *Verificación reforzada*), validado con banco de verdad conocida. **Futuro (Opción A, escala de miles):** eje de bordes GMSD/FSIM (cierra el blur por número) + veredicto relativo por-pieza.
  - `crop-check.mjs <composite.png> <pieza1.png> …` → **el GATE DE RECORTE del paso 2, hecho script** (anillo perimetral transparente + mapa de residuo): verifica que cada pieza esté COMPLETA y que la unión de piezas cubra el composite. Es el que ataca el error del buzón (recorte que se comió la base). *(Impl: renderizá el SVG a canvas exacto con `resize(W,H)` ANTES de `extract` — el gotcha `density`+`extract` cae en el lugar equivocado si no.)*
  - `check-rig.py` → lint de riggeabilidad (paths anónimos, grupos de 1 hijo) + `xmllint --valid` para ids. Corre por pieza antes de Rive.
- **Auto-calcado a precisión** (carril diferenciable diffvg/LIVE) = **Opción B, PARQUEADA** (ver [research](../../../docs/direccion/vectorizacion-research.md)) — "agua de otro pozo".

### Material del spike (en `space-src/e0-supernova/piezas/spike-rive/tienda/`, gitignored)

`clean-asset` → `crop-pieces` (fallback bbox) · `sample-grid` (mapa de color) · `segment2` (segmentación + máscaras + params) · vtracer bw por máscara · `assemble` (ensamble nombrado + gradiente + primitivas). Reconstruir el flujo desde acá.

## Qué resuelve y por qué

El arte se genera raster (nano-banana/Higgsfield) con softness inherente y textura de grano. Para un asset **geométrico** (formas + gradientes), redibujarlo como **SVG** gana en todo: nítido a cualquier escala, ~1500× más liviano (carita 2.2KB vs 3.4MB PNG), y **riggeable** (cada parte = elemento nombrado que anima/parpadea/cambia por separado). Rive importa SVG como shapes editables.

## La frontera (decidí ANTES de empezar)

- **🟢 Geométrico → SVG redibujado** (esta skill): carita, ventana, toldo, cartel, puerta, mostrador, la mayoría del elenco Kurzgesagt. Formas claras + gradientes.
- **🔴 Orgánico / texturado → raster o efecto de código**: nubes, fuego, follaje, humo. Vectorizar eso pierde o explota en paths. No es para esta skill.
- **NO replicar la textura de papel/grano** del raster: es ruido, se descarta a propósito.

## El flujo (6 pasos)

Corré los scripts con `bun scripts/<x>.mjs …` desde el repo.

1. **GENERAR (lo hace Alan)** — asset **completo** a **2K/4K**, sobre **verde plano** (`#00B140` ideal), **flat** (colores/gradientes simples, sin grano, sin sombra proyectada), **sin glow/halo** (los pone el código), vista frontal, + los **estados** que se necesiten (ej. carita 😊 y X_X). Ver [`specs-generacion.md`](specs-generacion.md).
2. **LIMPIAR** — `clean-asset.mjs <in> <out> [erode=4] [feather=2]`: mide el verde real (no asume), chroma `greenness=G−max(R,B)` → soft-alpha, despill, **erode+feather** (mata el rim de anti-aliasing), crop al bbox.
   - **GATE DE RECORTE — verificar ANTES de vectorizar** (un recorte malo se propaga al vector; fue el error del buzón): **(a) anillo perimetral transparente** — las filas/columnas del borde del bbox deben ser alpha≈0. Si un borde tiene contenido, el crop cortó la pieza (la base oscura del buzón tocaba el borde → cortada). Check binario. **(b) mapa de residuo** — `contenido del composite (alpha>umbral) − ∪ piezas recortadas ≈ 0`; lo que sobra sin cubrir = recorte incompleto o pieza faltante. Un diff de alpha responde "¿recorté bien?" Y "¿falta algún objeto?".
3. **LEER estructura** — `read-structure.mjs <clean.png>`: **promedia franjas** (NO una línea — una línea agarra textura y punto no representativo). Devuelve las bandas (con `dev`=planitud: dev bajo = color plano), los colores por capa, y los bordes del marco.
4. **MEDIR rasgos** — `detect-features.mjs <clean.png>`: ojos/boca por **bounding box** (connected-components), NO por una línea de escaneo.
5. **REDIBUJAR** — a mano, informado por 3–4, **mirando SOLO el PNG** (nunca un SVG previo). Primitivas SVG + gradientes nativos. Cada parte un `id`. Checklist que se olvida a ciegas: **el marco TAMBIÉN lleva gradiente** (no solo la cara); bandas planas = stops del mismo color; bandas con **escalón** (ej. banda inferior plana) = dos stops con salto corto, NO rampa continua; **depth asimétrico = rects desplazados hacia el lado en sombra** (medí los 4 bordes); bevel/highlight = gradientes/overlays; **glow sutil** (medí la fuerza, quedate corto).
6. **VERIFICAR (loop contra target — con GATES obligatorios)** — tres varas, NINGUNA opcional:
   - **DIFF DE CONTRASTE — OBLIGATORIO POR PIEZA.** `overlay.mjs <clean.png> <asset.svg>` → `_trace_diff.png` (**negro = calza, brilla = desajuste**). Dice DÓNDE falla. NO es opcional: el número solo NO delata forma mal orientada ni incompleta — se saltó en la corrida de la tienda (`piezas_vec/` scoreó sin diff) → toldos al revés y buzón incompleto pasaron con score OK.
   - **SCORE MULTI-EJE**, no un solo número (color + estructura + forma + bordes, pooling p95). Ver *Verificación reforzada* abajo. Dice CUÁNTO y si mejoró.
   - Loopeá hasta el target; **no pares en el primer pase** — seguí mientras el diff tenga brillos o algún eje baje. **Cuándo parar (no loopear infinito):** early-stopping por *patience+tol* (si ningún eje baja ≥tol en N pasadas → plateau → parar y marcar la pieza), con **target por CLASE de pieza** (rectilínea ~80%, curvas repetidas ~60-70% — ver *Techo de fidelidad*), no una vara fija. **Gate de riggeabilidad** (`xmllint`) + gate visual de Alan. → Rive.

## Verificación reforzada — score multi-eje + anti reward-hacking (research 2, 24/07)

> Detalle + fuentes + implementaciones en [`tecnicas-mapeo-verificacion-research.md`](../../../docs/direccion/tecnicas-mapeo-verificacion-research.md).
> Un score de UN eje (`mean |Δ|RGB`) es **HACKEABLE**: el agente optimiza el número sin calcar (ley de Goodhart — no es mala fe, optimiza lo que medís). En la tienda pasó: toldos al revés, buzón incompleto, con score OK. Defensa = **ejes ortogonales + pooling robusto + región fijada por el target + gates no-numéricos**.

**División de trabajo (decisión de Alan, 25/07 — "Opción B"), validada con banco de verdad conocida (`scratchpad/bench.py`):** el número y el diff visual se reparten la carga; ninguno pretende cazar todo solo.
- **El número (`score.py`) filtra FORMA + COLOR, automático.** La **forma** (IoU/cobertura) es el eje robusto: corte estable (~0.90), distingue FALTA de SOBRA, tapa el error del buzón — probado en arte real (cobertura 0.98→0.77 al borrar la base). El **color** (ΔE p95) caza desvíos gordos de paleta. Filtran sin ojo humano.
- **El diff de contraste (`_trace_diff.png`, gate OBLIGATORIO) caza ORIENTACIÓN + NITIDEZ**, con el *Criterio accionable del diff* de abajo. Son los modos que el número NO discrimina: **un umbral de color absoluto se cruza entre piezas** (banco: un flip-trampa dio dE95=18, un vector bueno real dio 31 — no hay corte único). El diff los caza gratis.
- **Por qué así:** dos jueces ortogonales (número simple + imagen) son más difíciles de engañar que un juez numérico único y complejo (menos superficie de reward-hacking), y es lo que el volumen actual pide. El camino "el número lo hace todo" (Opción A: eje de bordes GMSD/FSIM + veredicto relativo por-pieza) queda para escala de miles — el eje de bordes es su primer ladrillo (deuda barata, cierra el blur por número).

**Hallazgo del banco (25/07):** con baseline limpio (target = render limpio de la norma base), la forma cazó el mutilado (IoU 0.67) y el faltante real del buzón (cobertura 0.77); el shift lo cazaron color+estructura; **el flip (orientación) y el blur (nitidez) NO los caza el número** → van al diff. Es la evidencia que fija la Opción B.

**El score pasa a MULTI-EJE** (ninguna trampa satisface los cuatro a la vez):
- **Color** = ΔE CIEDE2000 (`colour-science`/`skimage`) · **Estructura/contraste** = SSIM (`skimage`/`piq`) · **Forma** = IoU/Dice de silueta (XOR = mapa gratis) · **Bordes** = FSIM/GMSD (`piq`, GPU) · **Peor punto** = Hausdorff (`skimage`, devuelve la coordenada). Todas corren en Linux/8GB.
- **Pooling NO-mean → p95 o std-dev.** El mean diluye una franja mal calcada hasta pasarla (es lo que dejó pasar los toldos). Separar SIEMPRE el mapa por-píxel del escalar.
- **Región de scoring = silueta del TARGET, no la del dibujo.** Si el agente elige su propia máscara, esconde lo faltante (la base del buzón nunca entraría al score).
- **El que mide es el gate, no el que dibuja** — re-score determinista, full-res, sobre el SVG entregado.

**Catálogo de trampas → defensa** (cubrir la mayor cantidad de casos; agregar acá cada modo nuevo que aparezca):

| Trampa (cómo el número miente) | Defensa |
|---|---|
| Forma/orientación mal, color promedio OK (los toldos) | SSIM + edge score |
| Objeto incompleto escondido por la máscara (buzón sin base) | región = silueta del TARGET + IoU |
| Relleno plano promedio sin estructura | pooling p95/max, no mean |
| Detalle chico omitido (ranura, tornillo) | p95 + peso por importancia |
| Blur/suavizado para bajar el Δ | edge score (un SVG borroso pierde bordes) |
| Auto-reporte desalineado (mide una versión, entrega otra) | mide el gate, no el que dibuja |

### Criterio accionable del diff de contraste — el juez de ORIENTACIÓN + NITIDEZ (Opción B)

`overlay.mjs` deja `_trace_diff.png` (**negro = calza, brillo = desajuste**). **El diff NO se "mira", se LEE**: cada patrón de brillo estructurado tiene causa y corrección. Esto es lo que permite delegar la verificación a un ejecutor SIN ojo de diseñador (dirección de Alan, 25/07).

| Patrón de brillo | Causa | Corrección | Cruzar con el número |
|---|---|---|---|
| Contorno espejado / doble | orientación invertida (poste de barbero, toldo al revés) | espejar/rotar, confirmar contra el PNG | — (el número no lo ve) |
| Contorno corrido paralelo | posición / registro | re-anclar al soporte | forma (IoU baja leve) |
| **Halo que CRECE desde el centro** | **escala mal** (pieza más grande/chica) | reescalar midiendo 2 puntos discretos | IoU baja SIMÉTRICA (no direccional) |
| Región rellena que brilla | parte faltante **o** color de relleno mal | completar/revisar recorte, o revisar muestreo | **cov bajo = FALTA · cov alto + IoU bajo = SOBRA** |
| **Brillo en zona de fondo / lisa** | **elemento SOBRANTE / espurio** (path fantasma, artefacto del trace) | eliminar el elemento | cov alto + IoU < 1 |
| Franja horizontal / vertical | banda de gradiente mal (escalón vs rampa, stop corrido) | revisar los stops de ESA banda | — |
| **Punto brillante chico aislado** | **detalle fino omitido** (ranura, tornillo, rasgo) | agregar el detalle | el **p95** lo levanta (por eso NO se poolea con mean) |
| Brillo difuso tenue uniforme | blur/suavizado o desalineo sub-pixel | endurecer bordes; revisar registro | dE bajo, estructura difusa |

- **Distinción clave (la da el número, se lee acá):** **cobertura baja = FALTA una parte** (buzón sin base); **IoU baja con cobertura alta = SOBRA un elemento** (artefacto). `score.py` reporta ambas.
- **Fuera de alcance del diff por-pieza:** el **z-order invertido** (una pieza tapa otra al revés) es un check del ENSAMBLE, no de una pieza.
- **Cuándo PARAR:** negro en lo estructural + IoU/cobertura > ~0.90 + dE razonable para la clase. Difuso tenue uniforme = aceptable (sub-pixel); brillo **estructurado** (contorno / región / franja / punto) = seguir.
- **Regla de oro:** identificar el patrón → aplicar la corrección → re-correr el diff. Loop hasta que no quede brillo estructurado.

**Antipatrones al leer/actuar el diff (lo que un ejecutor hace mal — NO hacer):**
- ❌ **Declarar OK con brillo ESTRUCTURADO presente.** El "primer pase presentable" (~80%) no alcanza; solo el difuso tenue uniforme es aceptable. (Feedback de Alan: no parar en "suficiente".)
- ❌ **Bajar el número sin abrir el diff.** El número puede mejorar con la forma/orientación mal (los toldos pasaron con score OK). El diff es obligatorio JUSTO por esto — nunca cerrar una pieza solo por el número.
- ❌ **Aplicar la corrección equivocada al patrón.** Trasladar 2px cuando el patrón es orientación (hay que ESPEJAR); retocar color cuando en realidad FALTA una parte. El diff se diagnostica, no se parcha a ojo.
- ❌ **Matar el diff destruyendo el asset.** Aplanar el bevel/glow legítimo, encoger la máscara del candidate, o blurear el vector para bajar el Δ — bajás el brillo pero rompés la pieza (el volumen es parte del dibujo; la región la fija el TARGET, no el candidato). Es reward-hacking sobre el diff.
- ❌ **Leer el diff por su "negrura promedio".** "Está bastante negro" a ojo = el mismo pecado del `mean` que dejó pasar los toldos. Se buscan FOCOS estructurados, no un promedio visual.

**Gate de RIGGEABILIDAD (pre-Rive), separado del de fidelidad:**
- `xmllint --noout --valid <svg>` → caza la colisión id-elemento↔id-gradiente (**verificado**: rechaza `id` duplicado, exit 4). DTD local, 1 línea, cero setup.
- Rive NO soporta `gradientTransform` / `<mask>` / `<filter>` / `<image>` / `stroke-dasharray` / `skew` / fill por CSS-`class` → lint por grep.
- ⚠️ **`svgo` sin configurar corre `cleanupIds` → borra los ids de rig en silencio** (no están referenciados por `url()`). Usar `preservePrefixes` o desactivar `cleanupIds`.

**Flag de confianza — NO adivinar (la regla que faltó en el buzón):**
- Donde el recorte/segmentación es AMBIGUO, **flaggeá la frontera incierta en vez de adivinar** → pedí el asset individual o el ojo de Alan. Señales medibles: alpha resuelto ≈0.5 con `PyMatting` (trimap fg/bg/unknown); borde de separación DÉBIL entre objetos pegados; entropía inesperada (`skimage.filters.rank.entropy`) en una zona asumida plana = sub-estructura no vista (el error del techo). Un recorte ambiguo resuelto mal y en silencio es el pecado.

## Gotchas (comprados a los golpes)

- **Medí el verde real** — si el prompt solo dice "green background" sale sage `rgb(103,150,111)`, NO `#00B140`. El script lo mide.
- **Chroma correcto = `G−max(R,B)`**, no distancia euclidiana (confunde el verde con grises claros del arte).
- **erode+feather SIEMPRE** — sin eso queda rim verde-gris (anillo de AA). En concavidades cerradas puede quedar resto sub-pixel; invisible a tamaño real.
- **Rasgos por bbox, no por línea** — una línea que no pasa por el centro subestima el radio (pasó: r48 medido vs r65 real).
- **Promediá franjas al leer** — una línea sola miente (textura + punto no representativo). Reveló mal las bandas hasta promediar.
- **Bandas planas vs divididas** — no asumir gradiente continuo; el raster suele tener bandas de color plano (la inferior de la carita es UN color en el tercio inferior). El `dev` del reader lo dice.
- **Sub-estructura fina** — capas como el bevel pueden tener 2 tonos (la franja cálida izquierda = 2 naranjas). Leer con foco.
- **Calcar > medir a ciegas** — la lectura numérica da el punto de partida; el ajuste fino se hace **calcando sobre la referencia con el diff**, no dibujando de memoria.
- **NUNCA copiar un SVG de referencia** — se calca del PNG. Un vector previo puede tener errores (la `face_smile.svg` tenía dos); mirarlo los contagia. Es solo vara de `score.mjs`.
- **Los 4 bordes del marco NO son simétricos** — el depth oscuro asoma solo del lado en sombra. Escaneá cada borde antes de dibujar; el default mental "sombra abajo+derecha" mete oscuro donde el arte tiene un tono liso.
- **El glow no se infla** — `score.mjs` baja al bajar el glow; tentación de ir a 0. Parar en el valor que aún da volumen (medí contra el PNG), no en el mínimo numérico.

## Límite conocido / hacia dónde va

El pixel-perfect **a mano** converge pero cuesta N iteraciones → **no escala** a 20–30 assets. El salto grande es **automatizar el paso 6** (loop diff→ajuste automático): carril diferenciable = **BL-20, parqueado** (ver [Criterios de decisión](#criterios-de-decisión-norma-base--sellado-2407) + [research](../../../docs/direccion/vectorizacion-research.md)). Esta skill es el andamiaje semi-manual que la precede y la define. (Illustrator descartado: no corre en el Linux de Alan.)

## Scripts

- `scripts/clean-asset.mjs` — chroma + erode + feather + crop.
- `scripts/read-structure.mjs` — lectura por franjas promediadas (bandas + marco + planitud).
- `scripts/detect-features.mjs` — bbox de rasgos (ojos/boca/…).
- `scripts/overlay.mjs` — trace-overlay: `_trace_over.png` + `_trace_diff.png` junto al SVG.
- `scripts/score.mjs` — score de 1 eje (mean |Δ|RGB in-shape), el VIEJO/legacy. Reemplazado como vara por `score.py`.
- `scripts/score.py` — **score multi-eje FORMA + COLOR (Python, Opción B).** `score.py <target.png> <candidate.{png,svg}>` → IoU/cobertura + ΔE p95 + SSIM + Hausdorff; veredicto de FORMA con corte robusto (distingue FALTA de SOBRA) + señales de color/estructura a cruzar con el diff. Entorno: `venv` con `requirements-score.txt` (numpy/scipy/scikit-image/pillow/cairosvg). La vara automática del lado número.
- `scripts/assemble.mjs` — `bun assemble.mjs <out> <p1.svg> <p2.svg> …` junta piezas (mismo viewBox) en 1 SVG por z-order (primero = atrás), combinando `<defs>`. Para asset compuesto.
- `scripts/reduce-palette.mjs` — `bun reduce-palette.mjs <src.png> <in.svg> <out.svg> [K]` colapsa la paleta explotada de un trace a K familias reales (k-means sobre el PNG). Para el carril trace (limpia color-artefacto).

Requiere `sharp` (ya en el repo) y `bun`.

## Changelog del método (registro para revertir)

> Cada sellado del método queda acá con su ANTES/DESPUÉS y el porqué, para poder razonar o deshacer un cambio si empeora. El punto de reversión **duro** es git (esta skill vive versionada en el repo); esta tabla da el **razonamiento** de la reversión.

### 2026-07-24 — sellado post-gate de la tienda
- **Antes:** el flujo de asset compuesto ya estaba documentado (mapeo por script, ids prefijados por pieza, ensamble por z-order, score en el ensamble), pero faltaba incorporar el **feedback del gate de Alan** sobre el primer run completo.
- **Cambió (esta versión sella):**
  1. **Doctrina** "endurecer el método, no regenerar" + la tienda/composite como test de estrés a propósito (header *Estado* + *Input canónico*).
  2. **Input individual > composite** cuando exista, pero método **robusto al composite** siempre (2 patas: bbox por script + score enmascarado).
  3. Tres reglas de **lectura de pieza** destiladas de las 3 correcciones (no aplanar pieza compleja a 1 primitiva · orientación de patrones = "poste de barbero", confirmar con diff · silueta completa antes de vectorizar).
  4. Gotcha **id de gradiente/clip ≠ id de elemento** (rompe el rig en Rive).
  5. **Score por-pieza enmascarado a la silueta** (mata round-trips) + deuda `score.mjs --mask`.
  6. Deuda de toolkit: `map-pieces.mjs`, `score.mjs --mask`, `crop-check.mjs`.
- **Por qué:** la corrida gastó iteraciones corrigiendo bboxes mal mapeados a ojo y en round-trips por scores de pieza contaminados. Estas reglas atacan ese eslabón débil.
- **Cómo revertir:** `git checkout <sha-previo> -- .claude/skills/asset-vectorizer/SKILL.md`, o borrar la subsección *Aprendizajes del GATE de la tienda* + este entry y los bullets del toolkit de composite.

### 2026-07-24 (2) — research 2: verificación reforzada
- **Antes:** el score era de un eje (`mean |Δ|RGB`) y el diff de contraste estaba como herramienta opcional (paso 6). En la tienda eso permitió reward-hacking (toldos/buzón mal con score OK; verificado: `piezas_vec/` scoreó sin diff).
- **Cambió:** paso 6 → **diff de contraste OBLIGATORIO** + score MULTI-EJE (ΔE + SSIM + IoU + FSIM/GMSD + Hausdorff, pooling p95, región por target, mide el gate) · sección nueva *Verificación reforzada* con catálogo de trampas→defensa · gate de riggeabilidad (`xmllint` + gotcha `svgo cleanupIds`).
- **Por qué:** Alan preguntó qué otras formas de trampa hay y si reforzar el score por color+contraste. Marco: Goodhart. Research 2 (4 subagentes) trajo las métricas y las impl.
- **Fuente:** [`tecnicas-mapeo-verificacion-research.md`](../../../docs/direccion/tecnicas-mapeo-verificacion-research.md).
- **Cómo revertir:** borrar la sección *Verificación reforzada* + este entry + revertir el paso 6; `git checkout <sha-previo> -- SKILL.md`.

### 2026-07-25 — Opción B sellada: `score.py` (forma+color) + criterio accionable del diff
- **Antes:** el score multi-eje estaba especificado pero sin construir; el diff de contraste era obligatorio pero sin criterio de LECTURA (un ejecutor sin ojo no sabía qué hacer con el brillo).
- **Cambió:** **(1)** construido y validado `scripts/score.py` (Python: IoU/cobertura + ΔE p95 + SSIM + Hausdorff) con banco de verdad conocida — la FORMA es el eje robusto (cazó el faltante del buzón en arte real, cobertura 0.98→0.77). **(2)** Decisión de Alan **"Opción B"** (división de trabajo): el número filtra forma+color, el diff visual caza orientación+nitidez (un umbral de color absoluto se cruza entre piezas — banco: flip-trampa dE95=18 vs vector bueno 31). **(3)** *Criterio accionable del diff*: 8 patrones (con escala/sobrante/detalle-chico) + distinción cov/IoU (FALTA vs SOBRA) + 5 antipatrones. `score.mjs` queda como legacy de 1 eje.
- **Por qué:** el gate de la tienda pasó 3 errores con score OK; B reparte la verificación en dos jueces ortogonales (número simple + diff leído), más difícil de hackear que un juez numérico único. Alan: el diff obligatorio + criterio suficiente lleva al agente en la dirección correcta.
- **Cómo revertir:** borrar `scripts/score.py` + `requirements-score.txt`, la subsección *División de trabajo* + *Criterio accionable del diff* + este entry; `git checkout <sha-previo> -- SKILL.md`.
