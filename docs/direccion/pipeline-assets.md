# Pipeline de producción de assets

> **Qué es:** cómo se producen y animan los assets de la película de scroll (BL-17). Reglas **permanentes** y transversales a todas las escenas. El despiece concreto de cada escena vive en `docs/escenas/<escena>/despiece.md`.
> **Canal:** vector/canvas riggeado (piezas planas generadas + animadas por código), NO video horneado. Motivo: el video pierde calidad al comprimir y no escala a N escenas. Ver el pivote en [`escenas/e0-supernova/despiece.md`](../escenas/e0-supernova/despiece.md).

---

## El flujo (5 pasos)

1. **Storyboard de la escena** — [`direccion/storyboard.md`](storyboard.md), cuadro por cuadro.
2. **Claude arma el despiece** — `escenas/<escena>/despiece.md`: assets → partes → tipo → animación → forma de entrega. Acá Claude anticipa también las partes que NO se ven en el board pero necesita para animar.
3. **Alan genera** las piezas 🎨, una por una, a su ritmo, **cada una sobre fondo verde plano** (chroma).
4. **Claude recorta** (chroma key por código), arma la escena y anima (rig de piezas + efectos ⚡).
5. **Gate visual de Alan** por pieza / por beat.

---

## La frontera de responsabilidad

**🎨 Ilustración → la genera ALAN** (sobre verde). Cosas con "dibujo" y carácter: tienda, cartel, furgoneta, mostrador, nubes, fuego con textura. Lo que un ilustrador dibujaría. Claude NO dibuja ilustración figurativa por código — sale plana y sin alma.

**⚡ Efecto de código → lo dibuja CLAUDE** (canvas/SVG). Trazo, luz, geometría, partículas: estela EKG, halos, glow, campo de estrellas, polvo, la estrella de 4 puntas, la supernova, gradientes. Acá el código queda **igual o mejor** que una ilustración raster, y además anima y escala a cualquier resolución sin pesar.

**🎨→⚡** Alan genera una pieza base y Claude deriva el efecto (ej: la tienda se fractura en shards por código — Alan no genera los pedazos).

## Cómo se anima (define si hacen falta frames)

- **Transformación rígida** (rotar, trasladar, escalar, orbitar, parallax) → **UNA pieza, la anima Claude. SIN frames.** (Kurzgesagt casi no usa frames: es rigging de piezas.)
- **Deformación orgánica** (cambio de forma real: expresión, fuego, líquido) → técnicas de canvas, o **2-3 keyframes** que genera Alan. Nunca 12.

## Entrega

- Cada parte que se mueve **independiente** de otra viene como **pieza separada, sobre fondo verde plano**. Si dos cosas siempre se mueven juntas, van en la misma pieza.
- **Sin sombra proyectada** sobre el verde (dificulta el recorte). **Glow/halos NO se generan** — los pone Claude por código.
- Prompt de pieza: template maestro del [canon](canon-assets.md) con `single object, centered` + `solid flat green background` + `--sref` del ancla de la escena.

## Regla ante la duda

¿Tiene textura/carácter de dibujo, o es luz/trazo/geometría? Si hay duda → se marca **🎨 (lo genera Alan)**, para no bajar la calidad dibujando algo feo por código.

---

## Recorte (chroma key)

Higgsfield/MJ no dan transparencia → por eso las piezas se generan sobre **verde plano** y Claude hace el knockout por código (limpio, porque el fondo es uniforme — a diferencia de recortar sobre fondos complejos). `rembg` local y `remove_background` de Higgsfield (MCP, gasta créditos) cortan el **sujeto entero**, no piezas internas → la separación se hace en **generación** (piezas sueltas), no recortando piezas de un plano. Verde estándar: `#00B140` (a confirmar que no aparezca en ningún asset).

---

## Prompts para generar asset sheets (nano-banana, sobre verde)

Dos usos. Rellenar `[OBJECT]`/`[partes]`, pegar la **regla fija** al final. Aspecto `21:9` si hay muchas piezas, `16:9` si pocas. Los genera Alan en la UI de Higgsfield (0 créditos).

**A · DESPIECE** — separar un objeto en sus partes (para riggear):

```
From the [OBJECT] in this image, make a clean asset sheet: separate it into its
individual parts as SEPARATE pieces, laid out in a neat grid with clear spacing.
- Include ONLY parts of the [OBJECT]: [roof, awning, sign, window, door, wheels...].
  Nothing else — no ground, no floor, no terrain, no sky, no planets, no stars,
  no other buildings, no scene.
- Each part fully visible and complete (not cropped), with green padding around it.
- Keep the EXACT same flat-vector art style, colors and lighting as the source
  (deep indigo #1B2140 + warm amber #F2A63E).
- Isolate every part that could move on its own (door, sign, awning, window, wheel).
```

**B · VARIACIONES de la MISMA pieza** — la misma cosa con retoques (para elegir/estados):

```
From the [OBJECT] in this image, make an asset sheet of subtle DESIGN variations of
THIS EXACT SAME [OBJECT] — it must stay clearly recognizable as the same [OBJECT] in
every version (same core, same texture, same colors). Vary ONLY small design details:
[rays / edges / proportions / internal detail]. Do NOT change the color, and do NOT
create different kinds of objects (no different stars, moons, suns, bursts) — they are
all THE SAME [OBJECT] with slight tweaks. Neat grid, green spacing.
```

**Regla fija** (pegar al final de A o B):

```
Solid pure chroma-key green background #00B140, flat and uniform, no gradient,
no shadow cast on the background, no ground, no scene. No text, no labels,
no captions, no watermark. Same flat-vector art style as the source.
```

**Aprendido (2026-07-23):** `"different versions / separate color layers"` hace que el modelo (1) cambie el **color** cuando querías el diseño, y (2) genere objetos **distintos** (soles, lunas, bursts) cuando querías la misma pieza con retoques. Por eso **B** insiste en *THIS EXACT SAME, recognizable, no different kinds*. Y `"No ground"` solo NO alcanza: hay que prohibir explícito suelo/cielo/planetas/otros edificios (se cuelan igual). Ver [[despiece]] de cada escena para el `[OBJECT]` y sus partes.
