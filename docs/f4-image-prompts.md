# Prompts de imagen F4 — El mostrador (La Espiga)

> Fecha: 2026-07-04 (v2) · Metodología heredada de [`clients/facha-gaucha/web/image-prompts.md`](../../clients/facha-gaucha/web/image-prompts.md).
> **Regla de canal (feedback de Alan, 04/07): las tandas las genera ALAN por la UI web de Higgsfield (Unlimited + 2K = gratis). El agente entrega prompts, settings y checklist; NO genera por MCP.**
> Diferencia clave con FG: **La Espiga es ficticia** — no hay foto real de referencia. La fidelidad acá es al TEMPLATE (consistencia de luz, ángulo y escala entre piezas) y al CONTEXTO DE USO de abajo.

## Contexto de uso — dónde vive cada foto (leer ANTES de generar o evaluar)

La pieza F4 (brief §5, congelado) es una demo interactiva de dos paneles:

```
┌─────────────────────────────┬──────────────────────────────┐
│  LO QUE VE TU CLIENTE       │  LO QUE VES VOS              │
│  (la tiendita de La Espiga) │  (tu lista de pedidos)       │
│                             │                              │
│  ┌────┐ Medialunas x6       │  ┌────────────────────────┐  │
│  │foto│ ····         [Pedir]│  │ Sofía · x6 · ret. 10:30│  │
│  └────┘                     │  └────────────────────────┘  │
│  ┌────┐ Pan de campo        │  ┌────────────────────────┐  │
│  │foto│ ····         [Pedir]│  │ Martín · x1 · ret. 11:00│ │
│  └────┘                     │  └────────────────────────┘  │
│  ┌────┐ Facturas x12        │                              │
│  │foto│ ····         [Pedir]│   ← al tocar "Pedir" el      │
│  └────┘                     │     pedido CAE acá animado   │
└─────────────────────────────┴──────────────────────────────┘
```

- Las fotos son **thumbnails de app de pedidos** (~80–120 px renderizados) dentro de las cards del panel cliente. NO son fotos de portada ni packshots editoriales.
- El panel dueño no lleva fotos: es UI pura (tickets, texto, estados).
- **Implicación de dirección**: composición SIMPLE, pocas piezas, silueta que se lee al instante a tamaño chico. Una pirámide de 9 medialunas a 100 px es una mancha marrón (aprendizaje de la tanda descartada).

## Qué se genera y qué NO (línea roja de la demo)

| Pieza | Medio | Por qué |
|---|---|---|
| Demo interactiva (paneles, botón Pedir, ticket que cae) | **Código** (React + motion kit F3) | "Esto que acabás de tocar es lo que hacemos" — se toca, no se mira. Congelado en brief §5. |
| Fotos de producto del panel cliente (3) | **Imagen generada** (este doc) | Productos ficticios de La Espiga; thumbnails del catálogo demo. |
| Animación del ticket / micro-interacciones | **Código** (CSS/JS del motion kit) | Jamás GIF/video generado. |
| Preámbulo "vidriera → mostrador" | **Post-v1** (backlog del módulo en brief §Post-v1) | Dirección en §B; no es scope v1. |
| Video generado en la landing v1 | **No va** | Nada en el alcance v1 lo pide. |

## Settings

| Familia | Ratio | Fondo | Post-proceso | Destino final |
|---|---|---|---|---|
| Productos La Espiga (3) | **1:1** | Liso claro (para recorte automático limpio) | `remove_background` → PNG transparente → optimizar ~1024px WebP | `pulsimus/public/la-espiga/` |

- **Por qué 1:1**: la card recorta con `object-fit: cover`; un cuadrado sobrevive a cualquier recorte.
- **Por qué cutout** (hallazgo medido, tanda 04/07): pedir el fondo hueso `#F6EFE1` por prompt/parámetro NO da el hex exacto (muestreo de esquinas dio blanco puro; la "luz de estudio" lava el fondo). Con cutout, el fondo lo pone el CSS del sitio y la sombra la da un `drop-shadow()` idéntico en las 3 cards: consistencia por código.
- **Sin papel manteca ni props**: ensucian el borde del recorte.
- **Naming**: `medialunas.png`, `pan-de-campo.png`, `facturas.png`.
- **Flujo de archivos (regla de Alan, 04/07)**: descargar SIEMPRE la fuente en **2K** → `pulsimus/assets/la-espiga/` (fuente, no se sirve); el achique lo hacemos nosotros → cutout + ~1024px WebP → `pulsimus/public/la-espiga/` (lo que la demo sirve). Tras curar, borrar de `assets/` las variantes descartadas para no engordar el repo (~6MB c/u).

## A · Template v2 + líneas (pegás el template, cambiás SOLO la primera línea)

```
Product: [LÍNEA]

Freshly baked product from a traditional Argentine neighborhood bakery, photographed as a small product thumbnail for an online ordering app. SIMPLE composition with few pieces and a clear silhouette that reads instantly at small size. Centered, straight-on front view at eye level, on a plain light seamless background for clean automatic background removal. Soft diffused daylight, one soft contact shadow, no parchment paper, no props, no hands, no text. The product fills about 75% of the frame. Photorealistic commercial food photography, appetizing natural texture, natural matte colors, no plastic gloss. Square 1:1 format.
```

| # | Línea `Product:` | Archivo |
|---|---|---|
| 1 | Three Argentine medialunas de manteca (small glossy syrup-brushed croissants) in a loose overlapping row | `medialunas.png` |
| 2 | One whole rustic round loaf of Argentine pan de campo with a floured cracked crust | `pan-de-campo.png` |
| 3 | Three assorted Argentine facturas in a row: one vigilante, one cañoncito filled with dulce de leche, one tortita negra | `facturas.png` |

**Checklist de aceptación — evaluar a ESCALA DE USO:**
- Achicá la imagen a un cuadradito de ~100 px (o alejate de la pantalla): ¿se entiende el producto en medio segundo?
- Silueta despejada; sin manchas oscuras confusas ni piezas amontonadas.
- Borde del producto limpio (recortable): sin papel, sin sombras duras pegadas al producto.
- Las 3 juntas: misma luz, mismo ángulo, misma escala aparente.
- Apetitoso sin gloss plástico.

## Registro de tandas

- **04/07 tarde (tanda de Alan, UI web, Nano Banana 2, template v2) — 15 imágenes en `assets/la-espiga/`**:
  - `medialunas-01..04` (3 piezas c/u, almíbar), `pan-de-campo-01..03`, `facturas-01..04` (con tortita negra), `libre-01..04` (primeras pruebas SIN la línea `Product:` → el modelo improvisó el producto; algunas con azúcar impalpable).
  - **Gotcha**: pegar el template sin la línea `Product:` deja al modelo elegir el producto. Siempre completar la primera línea.
  - **CURACIÓN**: la hizo ALAN (descartó tortitas negras y surtidos) y él mismo dejó SU selección en `assets/la-espiga/` (9 fuentes 2K: `Medialunas 1..5`, `Medialunas cañoncitos 1`, `Pan 1..3`). **Regla permanente (04/07): la curación del humano es la fuente de verdad; el agente no re-agrega descartes ni recomienda por encima de una selección ya hecha. Las imágenes pegadas en el chat no son archivos accesibles: los archivos los deja Alan en la carpeta acordada.**
  - **PIPELINE EJECUTADO (04/07)**: cutout local con `rembg` (u2net, en máquina: cero créditos) + resize 1024 + WebP con alpha → `public/la-espiga/*.webp` (9 archivos, 81–195KB c/u). Verificado en cards simuladas sobre hueso con `drop-shadow(0 6px 8px rgba(27,33,64,.18))`: bordes limpios, sin halos; la sombra CSS unificada elimina la variación de fondos entre tomas. **Preproducción de F4 cerrada** — la elección de la foto final por card se hace al construir F4.
- **04/07 mañana (descartada, 32 créditos MCP)**: 4 packshots editoriales (Recraft V4.1 utility). Aprendizajes que quedaron: (1) el fondo por parámetro no garantiza el hex → cutout; (2) el conteo exacto SÍ se puede forzar por prompt pero es irrelevante a escala thumbnail; (3) el error de proceso fue evaluar packshots sin contexto de uso → de ahí la sección de contexto de arriba y el template v2 orientado a thumbnail. Imágenes borradas.

## B · Post-v1: preámbulo "vidriera → mostrador" (dirección, NO congelado)

Idea de Alan (04/07, anotada en brief §Post-v1): abrir F4 desde la "vidriera" y transicionar al mostrador interactivo, conectando con la tesis de Dolores.

Lineamientos para cuando se retome:
- **Exigir**: estética del sistema propio (hueso/noche/ámbar/bruma, Outfit-like), feed genérico estilizado, formato que sirva como asset plano (frontal, sin perspectiva, estilo FG tapa-de-menú).
- **Prohibir**: logo/gradiente/trade dress de Instagram o Meta; imágenes fotorrealistas de "locales" que compitan con la demo.
- **Referencia de feel aprobada**: render del mostrador físico azul noche + ámbar + madera clara (generado por Alan con la brand guide, 04/07) — paleta y materialidad como norte del módulo, no como asset.
