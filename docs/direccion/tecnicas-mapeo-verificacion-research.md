# Research 2 — Técnicas de MAPEO y VERIFICACIÓN (vectorización de assets)

> **Fecha:** 2026-07-24 · **Rama:** bl13-quien-soy · **Frente:** landing Pulsimus, pipeline de assets.
> **Objetivo:** MENOS iteraciones + MÁS calidad en el **mapeo** (localizar/separar piezas de un composite) y la **verificación** (validar recorte, fidelidad y riggeabilidad). NO es research de herramientas de vectorización — eso ya se decidió en [`vectorizacion-research.md`](vectorizacion-research.md) (vtracer = carril A; diffvg/LIVE = carril B parqueado, BL-20). Este cubre TÉCNICAS de proceso.
> **Método:** 4 subagentes Sonnet en paralelo (acotado). Restricciones duras heredadas: corre en Linux, GPU = RTX 3070 8GB, gratis/open-source.
> **Disparador:** la corrida de la tienda destapó reward-hacking del score (piezas mal orientadas/incompletas que el número no delató) + el mapeo a ojo como eslabón débil.

## TL;DR — lo más accionable

1. **El score se refuerza a MULTI-EJE** (color + estructura + forma + bordes), con **pooling NO-mean** (p95 / std-dev). Un promedio diluye una franja mal calcada; el p95 no la deja pasar. Es la defensa directa contra el reward-hacking que pasó los toldos al revés.
2. **`xmllint --valid` = gate de 1 línea** que caza la colisión de ids del gate (VERIFICADO por el research: rechaza `id="puerta"` duplicado en `<g>` y `<linearGradient>`). Cero setup.
3. **Separación de objetos pegados = por COLOR/gradiente, NUNCA por silueta.** El watershed clásico (erosión de la máscara) no separa sin cintura cóncava — corrige el BL-21.
4. **Segmentación GPU = patrón Grounded-SAM** con un SAM liviano (MobileSAM/EdgeSAM entran en 8GB). Pero **medir VRAM empírico** (ningún repo la publica) y **probar en flat** (SAM tiende a fundir partes sin textura).

---

## Eje 1 — MAPEO (localizar y separar piezas)

### 1a · Segmentación por GPU (familia SAM)

Patrón recomendado: **Grounded-SAM** — como el vocabulario de cada escena es CERRADO y conocido (fachada/toldo/cartel/buzón/puerta/carita), se prompea por texto la pieza esperada → caja (Grounding DINO / YOLO-World) → máscara fina (SAM liviano). Reemplaza "segmentar todo y clasificar después".

| Modelo | Peso/params | ¿8GB? | Licencia | Nota |
|---|---|---|---|---|
| **MobileSAM** | ~5M, ~330MB | Holgado | Apache/MIT | El más seguro para prototipar; drop-in de SAM |
| **EdgeSAM** | CNN, edge/móvil | Holgado | OSS | Mejor mIoU que MobileSAM, más rápido |
| **SAM2 tiny/small** | — | tiny 4GB / small 5GB* | Apache 2.0 | *cifras de agregador, sin confirmar. Evitar `large` (12GB) |
| FastSAM / YOLO-World | 24MB / — | Sí | **AGPL-3.0** | ⚠️ traba para producto cerrado |
| SAM3 (nov 2025) | 473M, 3.45GB | Riesgo | Apache | Concept-prompts, pero pesado — probar antes |

- **Ningún repo oficial publica VRAM** → medir empírico en la 3070, no confiar en blogs.
- **Caveat con evidencia:** SAM "merges distinct semantic parts" en arte sin textura (papers de line-art/manga). El contraste del canon (índigo/ámbar) *podría* mitigarlo — **sin evidencia directa sobre estilo Kurzgesagt, hay que probar.**

### 1b · Separación clásica CPU (objetos pegados sin fondo)

**Insight central (corrige el BL-21):** connected-components sobre alpha solo ve la silueta EXTERNA. El buzón a ras de la pared da una silueta convexa sin "cintura" → cualquier técnica que mire solo la máscara binaria (distance-transform, erosión, SLIC compacto) **no puede** hallar la costura. La señal vive en el **color/gradiente interno**, no en la forma.

Pipeline recomendado para "pegados, color similar, división sutil":
1. **Mean-shift / bilateral** (OpenCV) → mata el ruido del degradé IA sin borrar la costura real.
2. **Flood-fill con seeds por objeto** (más barato, cero tuneo) — primer intento.
3. Si falla: **Canny restringido a la máscara** → dilatar 1-2px → restar → connected-components → usar esos componentes como **markers de un watershed sobre GRADIENTE DE COLOR** (no sobre la silueta).
4. Fallback "una función": **Felzenszwalb** (`scale` bajo) + **RAG-merge**.
5. `regionprops`/`label` al final → auto-bbox/centroide (mata el mapeo a ojo).

**NO aplica:** watershed shape-based (erosión + distance-transform de la silueta) — la trampa de copiar el tutorial de "monedas"; SLIC con compactness alto (funde la costura); active-contours como detector (solo pule un contorno ya dado).

### 1c · Z-order / oclusión

No hay tool maduro "bajar y usar" (amodal segmentation = área académica fragmentada; "See-through" feb-2026 promete pero sin release). **Y no hace falta en el camino principal:** las piezas ya vienen desarmadas (paso 3), el z-order lo pone el rigger. Solo importaría si dependemos del composite (fallback). → No invertir ahora.

### 1d · Tiling por cuadrantes — por qué NO como mapeo, cuándo SÍ (idea de Alan, 24/07)

Dividir el composite en una grilla de cuadrantes y "mapear el objeto que aparezca en cada celda" **NO sirve como método de mapeo**: un objeto (fachada, toldo, cartel) casi nunca respeta la grilla → cruza 4-6 celdas → se fragmenta → hay que re-fusionar los pedazos, que es reinventar connected-components pero con costuras artificiales y peor. El mapeo lo resuelven connected-components / color (§ 1b) / SAM (§ 1a), que siguen la forma REAL del objeto, no una cuadrícula arbitraria.

**Dónde el tiling SÍ aplica** (otra cosa, mismo nombre): procesar un asset ENORME (4K/8K) **por tiles para no reventar los 8GB de VRAM** al correr SAM → va con [[BL-22]]. Y localizar el peor error por región — que el Hausdorff del score ya devuelve con su coordenada, sin grilla. Es técnica de memoria/GPU, no de segmentación.

---

## Eje 2 — VERIFICACIÓN

### 2a · Score REFORZADO (el corazón — anti reward-hacking)

Un escalar de color promedio es hackeable. La defensa = **panel de ejes ortogonales + pooling robusto + región fijada por el TARGET**. Ninguna trampa satisface los 4 ejes a la vez:

| Eje | Métrica | Impl (Linux) | Mata la trampa de… |
|---|---|---|---|
| **Color** | ΔE **CIEDE2000** | `colour-science` / `skimage` (CPU) | color mal disfrazado |
| **Estructura/contraste** | **SSIM** (con mapa `full=True`) | `skimage` (CPU) / `torchmetrics`,`piq` (GPU) | forma/orientación mal, color OK (los toldos) |
| **Forma/cobertura** | **IoU/Dice de silueta** (XOR = mapa gratis) | numpy / `torchmetrics` | objeto incompleto (buzón sin base) |
| **Bordes** | **FSIM / GMSD** | `piq` (GPU) o Sobel/Canny (CPU) | blur, contornos corridos |
| **Peor punto** | **Hausdorff** (+devuelve la coordenada) | `skimage` (CPU) | apunta a la zona sin abrir el heatmap |

**Reglas de robustez (lo que faltó):**
- **Separar el mapa por-píxel del pooling. En el pooling NO usar mean → p95 o std-dev** (GMSD lo hace por diseño). El mean diluye una franja mala hasta pasarla.
- **La región de scoring la fija el TARGET, no el agente** (silueta del PNG de referencia). Si no, el masking se vuelve arma de trampa (esconde lo faltante).
- **El que mide es el gate, no el que dibuja** — re-score determinista sobre el SVG entregado, full-res.
- **Diff visual de contraste OBLIGATORIO por pieza** (heatmap falso-color): el "dónde", no el escalar. Era herramienta en la skill → pasa a GATE.

Receta por pieza: IoU → ΔE(p95) → SSIM(full) → Hausdorff → [LPIPS spatial opcional] → si CUALQUIER escalar-robusto cruza umbral, abrir el heatmap de esa pieza. El escalar filtra sin ojo humano (menos iteraciones); el mapa señala la zona (más calidad). *(LPIPS al final: entrenada en fotos, sin validar en flat.)*

### 2b · Lint de RIGGEABILIDAD (pre-Rive)

- **`xmllint --noout --valid`** — el DTD de SVG 1.1 declara `id` como tipo `ID` → XML exige unicidad global. **VERIFICADO:** rechaza la colisión `<g id="puerta">`+`<linearGradient id="puerta">` (exit 4), valida limpio con namespacing. Gate de 1 línea, DTD local (sin red).
- **Checklist de incompatibilidades de Rive** (lint propio por grep): Rive NO soporta `gradientTransform`, `<mask>`, `<filter>`, `<image>` embebida, `stroke-dasharray`, `skewX/Y`, ni fill/stroke por CSS/`class` — exige **atributos de presentación inline**.
- ⚠️ **Gotcha nuevo:** `svgo` con `preset-default` corre `cleanupIds` que **borra ids no referenciados por `url()`** → volaría nuestros ids de rig en silencio. Usar `preservePrefixes` o desactivar `cleanupIds`.
- Paths anónimos / grupos de 1 hijo = script custom ~20 líneas (`svgelements`/`lxml`). Topología entre estados 😊/X_X: **depende de swap vs morph** (ver `escenas/e0-supernova/spike-rive.md` #6) — si es swap (state machine), no exige misma topología; si es interpolación real, sí.

### 2c · Detección de INCERTIDUMBRE (cuándo flaggear)

- **PyMatting** (trimap fg/bg/unknown → alpha matting): donde el alpha resuelto queda ≈0.5 = frontera realmente ambigua. Reemplaza el threshold único de `greenness` + erode/feather fijo por una señal MEDIDA de cuánto se dudó.
- **`skimage.filters.rank.entropy`** (entropía local): baja = plano, alta = textura. Automatiza la decisión "primitiva vs trace vs raster" que hoy es a ojo, y caza sub-estructura no vista (el error del techo: entropía inesperada en zona asumida plana).
- Descartado: gPb/UCM (académico, foto natural, pesado).

### 2d · CONVERGENCIA / cuándo parar el loop

- **Early-stopping por patience + tol** (patrón sklearn/Keras, ~5 líneas): si el score no baja ≥tol en N pasadas → parar y marcar "en plateau" en vez de pulir a ciegas. Portar a `score.mjs`.
- **Target adaptativo por complejidad:** no existe tool (confirmado: `fogleman/primitive` para por Nº fijo, no detecta plateau). Camino propio: el pipeline YA mide complejidad (bandas de `read-structure`, componentes de `segment2`) + tiene el dato empírico (rectilíneas → ~80%, curvas repetidas → 60-70%). Fitear `target = f(complejidad)` en vez de vara fija.

---

## Qué se aterriza vs qué se parquea

- **Sellar en la skill YA** (criterio validado con Alan): score multi-eje + pooling no-mean + región-por-target · **diff de contraste OBLIGATORIO** · gate `xmllint` + gotcha `svgo cleanupIds`.
- **Construir + probar en el próximo run** (toolkit de composite): `map-pieces.mjs` (regionprops), `score.mjs` reforzado (`--mask` por target), `crop-check.mjs`, `check-rig.py` (paths anónimos).
- **Parqueado** (necesita spike/validación de VRAM o es proyecto aparte): Grounded-SAM + SAM liviano (medir 8GB, probar en flat) · PyMatting trimap · early-stopping + target adaptativo · [[BL-21]] separación por color/watershed-gradiente.

## Fuentes (consolidadas)

**Mapeo GPU:** facebookresearch/segment-anything · ChaoningZhang/MobileSAM · chongzhou96/EdgeSAM · IDEA-Research/Grounded-Segment-Anything · docs.ultralytics.com/models/sam-3 · blog.roboflow.com/yolo-world-prompting-tips
**Mapeo CPU:** scikit-image.org (segmentation, canny, rag, measure) · docs.opencv.org (distance-transform, mean-shift)
**Métricas:** scikit-image.org/metrics · lightning.ai/torchmetrics (SSIM, LPIPS) · colour.readthedocs.io (CIEDE2000) · photosynthesis-team/piq (GMSD/FSIM) · arxiv 1308.3052 (GMSD) · FSIM (PolyU)
**Riggeabilidad/proceso:** rive.app/docs/editor/assets/svg · libxml2 xmllint · svgo.dev/docs/plugins/cleanupIds · meerk40t/svgelements · pymatting/pymatting · fogleman/primitive (evidencia negativa)
