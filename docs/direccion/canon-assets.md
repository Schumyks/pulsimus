# Canon de generación de assets — documento maestro (Higgsfield)

> **Qué es:** el manual de decisiones para generar CUALQUIER asset visual del sitio — lo use Alan a mano en Higgsfield, Claude vía MCP, o Design. Acá vive el estilo, los templates de prompt, las specs técnicas por tipo de asset y el workflow completo.
>
> **Jerarquía:** [`bl17-guion-narrativo.md`](guion-narrativo.md) manda sobre el QUÉ (qué escena, qué personaje, qué emoción); este doc manda sobre el CÓMO se genera. Ante conflicto de estilo, gana este doc; ante conflicto de narrativa, gana el guión.
>
> **Curación:** la fuente de verdad de qué generación se aprueba es **Alan**. Este doc le da la checklist para curar (§ Anti-canon).

---

## 1 · Las decisiones de diseño (y su porqué)

| Decisión | Regla | Por qué |
|---|---|---|
| **Estilo** | Flat vectorial "science-explainer" (inspiración Kurzgesagt, no copia): formas geométricas limpias, 2–3 tonos planos por objeto, outlines mínimos o ninguno | Identidad memorable; es el estilo que los generadores clavan con más consistencia entre tandas; assets livianos; se cortan en capas para animar |
| **La luz es ámbar** | La luz de marca (#F2A63E) es la ÚNICA luz cálida protagonista: neones, ventanas, rim lights, la estrella, el pulso. Los objetos pueden tener cualquier color; la luz que importa, no | El ámbar deja de ser "el color de todo" y pasa a ser la firma lumínica — el ojo siempre sabe qué es Pulsimus |
| **El offset ámbar** *(consagrado en la tanda 1, 21/07)* | En personajes y objetos sólidos, el rim light se materializa como **contorno desplazado ámbar** en un lateral (estilo sticker offset) — no como degradé de luz pintada | Así lo interpretó el generador en toda la tanda 1 de forma consistente (alien, dueño, asteroide) y unifica el elenco; queda como regla, no como accidente |
| **Base noche** | Todo asset asienta sobre la familia noche: #12162E (profundo) a #1B2140 (noche). Fondos de generación en esa familia o negro puro según tipo | Todos los assets viven en el mismo universo aunque sus paletas locales varíen |
| **Paleta extendida** | Los mundos tienen color libre: nebulosas magenta/cian, planetas óxido, aliens verdes/teal. Sin miedo | Decisión de Alan (21/07): todo-ámbar quedaría monótono; la coherencia la dan la base noche + la luz ámbar + el estilo |
| **Grain** | Textura de grano sutil en todo asset | El sello táctil del estilo; evita el look "vector estéril" |
| **Isométrico** | Solo donde representa algo: la tienda dollhouse, el escritorio/tablero, la construcción del Proceso. El espacio abierto es frontal/plano | La iso paga cuando hay interior/estructura que mostrar; en el vacío no aporta |
| **Personajes** | Formas redondeadas simples, ojos expresivos, proporciones chibi-friendly. El dueño: **entrañable y digno, nunca patético**. Humor sutil, no circo | La emoción del guión depende de que el protagonista genere ternura y respeto a la vez |
| **Sin texto en imagen** | NUNCA texto legible dentro del asset (carteles = formas abstractas). El lettering real se agrega en código/SVG | Los generadores escriben texto roto; y el texto en imagen no se traduce ni se reskinea |

## 2 · Tipos de asset y specs técnicas

### Tipo A — Fondos luminosos (galaxias, nebulosas, brumas) · capa Z1
- **Fondo de generación:** NEGRO PURO (#000000). Se monta con CSS `mix-blend-mode: screen` → el negro desaparece solo, sin recorte.
- **Regla del prompt:** el objeto BRILLA contra el negro; nada de estrellas ni objetos sueltos fuera del cuerpo principal (ensucian el blend).
- **Lección tanda 1 (21/07):** para Z1 pedir explícitamente `large diffuse glowing shapes, soft blurred edges, no hard outlines, no central planet, background art for parallax layer` — sin eso el generador produce un ICONO nítido (arcos duros, objeto-céntrico), que sirve como cuerpo decorativo Z2 pero no como fondo Z1.
- **Aspect:** 16:9 o más ancho. **Procesado:** WebP q80, ~1600–2000px de ancho.

### Tipo B — Objetos sólidos (planetas, asteroides, lunas, naves, cometas) · capa Z2
- **Fondo de generación:** liso oscuro (#12162E), objeto centrado, sin nada más → se recorta a alpha (remove background) después.
- **Regla del prompt:** rim light ámbar en un borde (valida la firma lumínica en cada objeto).
- **Lección tanda 1 (21/07) — glow horneado:** si el generador rodea el objeto con un halo/glow derramado, el glow NO se conserva: el pipeline lo recorta (fill glow-aware por saturación + opening morfológico para trazos huérfanos) y el glow se **re-crea en CSS** al montar (`drop-shadow` ámbar) — así además puede LATIR, que es de marca. El glow horneado no sobrevive ningún recorte limpio.
- **Aspect:** 1:1. **Procesado:** recorte a alpha → WebP con transparencia, ~800px.

### Tipo C — Personajes (el dueño, aliens, la estrella si se dibuja)
- Igual que Tipo B (fondo liso, recorte a alpha) + **cuerpo completo visible**, pose simple y legible.
- **Consistencia de personaje:** el primer render aprobado se convierte en **referencia** — toda pose/variante nueva se genera con esa imagen como style/character reference. Si el modelo soporta hoja de personaje (varias poses en una imagen), mejor: se recortan de una sola generación coherente.
- **Aspect:** 3:4. **Procesado:** alpha → WebP, ~800px de alto.
- **Para animar (nivel 2 — rigging):** pedir además pose neutra de frente; las piezas (ojos, brazos, etc.) se separan en edición.

### Tipo D — Escenas (fachada de la tienda, dollhouse iso, escritorio mission control)
- **Fondo de generación:** liso muy oscuro (#12162E); la escena es el objeto.
- **Regla del prompt:** la luz ámbar como única fuente cálida (ventanas, neón). Carteles con formas abstractas, sin texto.
- **Aspect:** 3:4 / 4:5 (fachadas), 4:3 (interiores iso). **Procesado:** según montaje — recorte a alpha si flota sobre el fondo del sitio, o se integra con el borde fundido.

## 3 · Template de prompt maestro

Todo prompt del proyecto se construye sobre esta base (en inglés — los generadores rinden mejor):

```text
Flat vector illustration, modern science-explainer style, [SUBJECT + acción/emoción],
clean geometric shapes, 2-3 flat tones per object, subtle grain texture,
soft warm amber rim light (#F2A63E) as the only brand light,
minimal outlines, no text, no watermark,
[VIEW: front-flat | isometric cutaway],
[FONDO según tipo: pure black background (Tipo A) |
 centered on a plain solid dark background #12162E (Tipos B/C/D)]
```

Reglas de uso:
- **No parafrasear el template** entre tandas — se copia idéntico y solo cambia el [SUBJECT]. La consistencia entre generaciones es el riesgo #1 y el template idéntico es la primera defensa.
- **Asset ancla:** la primera pieza que Alan apruebe pasa a ser style reference de todas las siguientes (si el modelo acepta imagen de referencia, usarla SIEMPRE).
- **Modelo en Higgsfield:** elegir modo ilustración/arte; evitar modos photorealistic/cinematic. Si una tanda sale "3D render" o pintoresca, no pelearla con retoques: ajustar modelo/modo y regenerar.

## 4 · Anti-canon — checklist de curación (rechazar si…)

- ❌ Fotorealismo, render 3D, sombreado suave pintado (debe ser plano).
- ❌ Más de ~3 tonos por objeto o degradés complejos.
- ❌ Texto/letras dentro de la imagen (aunque sea "bonito").
- ❌ Luz cálida que NO sea ámbar (naranjas rojizos, amarillos limón) como luz protagonista.
- ❌ Outlines gruesos estilo cartoon infantil.
- ❌ Fondo sucio en Tipo A (estrellitas/objetos sueltos fuera del cuerpo luminoso).
- ❌ Personaje en pose ilegible o con emoción equivocada (el dueño jamás patético).
- ❌ Estilo que no podría convivir en el mismo frame con los demás assets aprobados.

## 5 · Workflow completo

1. **Generar** (Alan en Higgsfield) con el template + specs del tipo. Varias variantes por asset (4+), misma sesión.
2. **Curar** (Alan) con la checklist § 4. Lo aprobado define/actualiza el asset ancla.
3. **Procesar** (Claude): crudos → carpeta local NO versionada (mismo patrón que `public/clouds/*.png` gitignoreadas) → recorte a alpha según tipo → WebP a la resolución de su capa → `public/space/`.
4. **Cortar en capas** los que llevan animación nivel 2 (rigging).
5. **Montar y validar EN EL SITIO** (verificación Playwright sobre build de prod, como siempre). Nada se aprueba en abstracto.

### Carpetas y naming

```
public/space/
  z1/        fondos luminosos (blend screen)     galaxy-01.webp
  z2/        cuerpos con alpha                   asteroid-grin.webp
  chars/     personajes con alpha                owner-idle.webp · alien-shopper.webp
  scenes/    escenas                             shop-facade-night.webp
```

Crudos de generación: carpeta local `space-src/` (gitignorear con el patrón de las nubes).

## 6 · Set de prueba (5 piezas) — primera aplicación del canon

Objetivo: validar el canon MONTADO en el sitio antes de producir en serie. Cubre los 4 tipos: A (galaxia), B (asteroide), C (protagonista + alien), D (fachada). Los prompts completos listos para pegar están abajo; specs de cada uno en § 2.

### P1 · Galaxia (Tipo A · 16:9)
```text
Flat vector illustration, modern science-explainer style, a large spiral galaxy
seen at a slight angle, built from clean geometric shapes and simple dot clusters,
soft magenta and cool blue-violet arms with a warm glowing amber core (#F2A63E),
2-3 flat tones per element, subtle grain texture, minimal outlines,
glowing against a pure black background, no stars outside the galaxy,
no other objects, no text, no watermark, wide composition
```

### P2 · Asteroide con cara (Tipo B · 1:1)
```text
Flat vector illustration, modern science-explainer style, a single rocky asteroid
with a subtle mocking grin and heavy-lidded eyes carved into the rock,
cool gray-brown flat tones, a few simple craters, 2-3 flat tones,
subtle grain texture, soft warm amber rim light (#F2A63E) on one edge,
minimal outlines, centered on a plain solid dark background (#12162E),
no other objects, no text, no watermark
```

### P3 · El protagonista (Tipo C · 3:4)
```text
Flat vector illustration, modern science-explainer style, a small-business shop
owner character, full body, simple rounded friendly shapes, wearing a shopkeeper
apron, warm dignified expression with simple expressive eyes, standing pose
slightly tired but hopeful, 2-3 flat tones for skin and clothes, subtle grain
texture, soft warm amber rim light (#F2A63E), minimal outlines, centered on a
plain solid dark background (#12162E), full character visible, no text, no watermark
```

### P4 · El alien cliente (Tipo C · 3:4)
```text
Flat vector illustration, modern science-explainer style, a small friendly alien
customer holding a shopping bag, simple rounded shapes, soft teal-green flat
tones, cheerful curious expression with simple expressive eyes, 2-3 flat tones,
subtle grain texture, soft warm amber rim light (#F2A63E), minimal outlines,
centered on a plain solid dark background (#12162E), full character visible,
no text, no watermark
```

### P5 · La fachada de la tienda (Tipo D · 3:4)
```text
Flat vector illustration, modern science-explainer style, a small cozy
neighborhood shop facade at night, slightly crooked hand-painted sign with
abstract shapes instead of letters, warm amber neon light and glowing shop
window (#F2A63E) as the only light source, dark night-blue building tones,
simple details: awning, crates by the door, 2-3 flat tones per element,
subtle grain texture, minimal outlines, front view, centered on a plain solid
very dark background (#12162E), no people, no text, no watermark
```

**Al curar el set:** la primera pieza aprobada = asset ancla → regenerar las otras con ella como referencia si el estilo bailó entre tandas.
