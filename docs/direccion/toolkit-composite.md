# Toolkit de composite — corrida de construcción (2026-07-25)

> Corrida autónoma nocturna. **Objetivo:** construir + auto-validar los 3 scripts que faltan del toolkit de vectorización de composites, cada uno contra **verdad conocida** (no reward-hackear el propio toolkit). NO se toca trabajo visual: esto es código de herramienta, verificable y reversible. El re-vectorizado de la tienda (test de método, visual) queda para una corrida CON gate por pieza de Alan.
>
> Contexto: el score multi-eje (`score.py`, forma+color, Opción B) ya está construido y validado (25/07). Falta el resto del toolkit que mata iteraciones. Specs en la skill `asset-vectorizer` § *Deuda — toolkit de composite* y en [`tecnicas-mapeo-verificacion-research.md`](tecnicas-mapeo-verificacion-research.md).

## Restricciones (heredadas)

- **NO regenerar assets.** Se usa lo que ya existe: piezas individuales (`tienda/pieces/*.png`), piezas vectorizadas (`tienda/piezas_vec/*.svg`), el composite (`tienda_clean.png`) y `tienda_vector.svg`.
- **Verdad conocida obligatoria.** Cada script se valida contra un caso donde la respuesta correcta se conoce de antemano (banco sintético o mutación controlada). Un toolkit que se valida contra sí mismo no vale.
- **Corre en Linux, gratis/open-source.** node 22 / bun 1.3 / python 3.14 / xmllint. Sin GPU (SAM queda parqueado, BL-22).
- **Anti reward-hacking del toolkit:** para cada script, además del caso que DEBE pasar, un caso que DEBE fallar (si nada falla, el check no discrimina).

## Piezas (orden + criterio de aceptación)

### F0 · Setup (verdad conocida)
- Reconstruir `venv-score` (efímero, se perdió) para re-correr `score.py`.
- Construir el **banco sintético**: pegar las 5 piezas individuales de tamaño conocido en un canvas en offsets que YO defino, separadas por gap → la respuesta correcta de los bboxes es conocida por construcción.
- **Aceptación:** venv corre `score.py --help`; banco generado + tabla de bboxes-verdad escrita.

### F1 · `map-pieces.mjs <composite.png>`
Localiza cada isla de contenido por connected-components (reusa el flood-fill de `segment2.mjs`) → tabla de bboxes + centroide + área. Mata el mapeo a ojo (los 5 corrimientos de ~500px de la corrida de la tienda).
- **Aceptación:** sobre el banco sintético recupera las N cajas conocidas con error ≤ ~2px por lado (tolerancia por umbral de alpha). Reporta también sobre material real.
- **Límite declarado:** separa islas **desconectadas por fondo** (el input canónico = sheet DESARMADO). Piezas PEGADAS (composite ensamblado) NO se separan por forma → eso es color/watershed (BL-21) o SAM (BL-22), parqueado. Se documenta, no se finge.

### F2 · `crop-check.mjs <composite.png> <pieza1.png> …`
El gate de recorte del paso 2, hecho script. Dos chequeos:
- **(a) anillo perimetral** — las filas/columnas del borde del bbox de cada pieza deben ser alpha≈0. Un borde con contenido = crop que cortó la pieza (el error del buzón sin base).
- **(b) mapa de residuo** — `contenido del composite − ∪ piezas ≈ 0`. Lo que sobra = recorte incompleto o pieza faltante.
- **Aceptación:** pieza completa PASA el anillo; pieza mutilada (buzón con la base recortada al ras) FALLA. Residuo ≈ 0 con todas las piezas; residuo = zona conocida al quitar una.

### F3 · `check-rig.py <svg> …`
Lint de riggeabilidad pre-Rive:
- `xmllint --noout --valid` → caza colisión id-elemento ↔ id-gradiente (verificado en research: exit 4).
- Paths anónimos / grupos de 1 hijo (parse XML liviano).
- Checklist de incompatibilidades Rive por grep: `gradientTransform`, `<mask>`, `<filter>`, `<image>`, `stroke-dasharray`, `skewX/Y`, fill/stroke por `class`.
- **Aceptación:** SVG con colisión de id FALLA; SVG namespaceado PASA; flaggea cada feature Rive-incompatible inyectada en un SVG trampa. Corrida sobre los SVG reales (`piezas_vec/*.svg`, `tienda_vector.svg`) → reporte de qué caza.

### F4 · Integración + sellado
- Verificar `score.py` re-corre en el venv reconstruido (sobre una pieza real).
- Actualizar `SKILL.md`: scripts nuevos en § *Scripts*, deuda saldada, changelog entry con cómo revertir.
- Documentar resultados + evidencia en ESTE doc.
- Engram + STATE + cierre + handoff.

## Gates
- Ninguno humano en la corrida (Alan duerme): todo autoverificable. El gate de Alan es sobre el RESULTADO (este doc + evidencia) al despertar.
- Gate duro interno: un script no se da por bueno sin su caso-que-falla pasando.

## Estimate (grueso)
~350–600k tokens / 40–70 min. Fase más cara: F1 (banco + validación iterativa del CC). Riesgo: wheels de Python 3.14 para el venv (mitigado: corre en background desde el arranque; si falla, score.py queda documentado como bloqueado, no frena F1–F3 que son JS/xmllint).

---

## RESULTADOS (corrida cerrada 2026-07-25)

**Los 4 scripts del toolkit quedaron construidos y validados contra verdad conocida.** Todo verde. Cero trabajo visual tocado.

| Script | Qué hace | Validación (verdad conocida) | Veredicto |
|---|---|---|---|
| `map-pieces.mjs` | bbox por isla (connected-components) | banco de 5 piezas en offsets conocidos | **0px de error, IoU 1.0** en las 5 ✓ |
| `crop-check.mjs` (ring) | anillo perimetral por pieza | mailbox completa vs base-cortada | completa PASA · cortada FLAGGEA `bottom(450)` ✓ |
| `crop-check.mjs` (residue) | composite − ∪ piezas | manifiesto completo vs sin-mailbox | 0.00% vs **11.63% bbox [600,600,450,424]** exacto ✓ |
| `check-rig.py` | ids dup + features Rive | 3 SVG trampa | clean PASA · idcollision FALLA · rivebad caza 5 features ✓ |
| `score.py` (re-check) | multi-eje forma+color | self-consistency + cairosvg | IoU 1.0/dE 0 · rasteriza SVG ✓ |

### Hallazgos del run (lecciones de método, no defectos de la tienda)
1. **Las piezas del despiece se recortaron SIN padding** (`pieces/*.png` = bbox exacto de contenido) → el anillo perimetral las marca TODAS como "touches edge" y no puede afirmar completitud. Un recorte exacto y uno que se comió una parte **se ven igual en el borde**. → **Regla nueva: recortar SIEMPRE con margen transparente** (clean-asset ya lo hace con PAD=8; `crop-pieces.mjs` NO lo hacía — por eso el buzón sin base pasó desapercibido). Por eso el anillo es WARNING y la cobertura (residuo) es el gate duro.
2. **`entrada.svg` horneó el haz de luz como `<filter>` SVG** (`entrada-beam-blur`, feGaussianBlur stdDeviation=14). Rive NO soporta `<filter>` → rig-breaker. Y contradice la frontera 🎨/⚡ de la skill: el haz de luz es **efecto de código ⚡**, no debe estar horneado en el asset. check-rig lo cazó solo. → al riggear la tienda, ese haz se rehace por código.
3. **`venv-score` es efímero** (vivía en el scratchpad de la sesión que construyó score.py) → se reconstruye de `requirements-score.txt`. Ahora está gitignored y documentado.

### Límite honesto de map-pieces (verificado, no fingido)
Separa islas **desconectadas por fondo** (el sheet DESARMADO de nano-banana = input canónico) → ahí da 0px. Sobre el composite **ENSAMBLADO** (`tienda_clean.png`, piezas pegadas) devuelve **1 blob** [8,8,2896,1866] + ruido. Partir piezas pegadas necesita color/gradiente (BL-21) o SAM (BL-22), ambos parqueados. El toolkit dice la verdad sobre su frontera.

### Evidencia
Todo en `space-src/e0-supernova/piezas/spike-rive/tienda/_toolkit-bench/` (gitignored, persistente):
- `make-bench.mjs` · `bench_composite.png` · `bench_truth.json` — el banco.
- `validate-map.mjs` · `validate-crop.mjs` — los harness de validación (reproducibles).
- `mailbox_padded.png` / `mailbox_cut.png` · `bench_manifest_{full,missing}.json` — casos de crop-check.
- `svg_{clean,idcollision,rivebad}.svg` — casos de check-rig.

## VERIFICACIONES PRE-TEST (2026-07-25, de-riesgo antes del test visual)

Dos verificaciones más, todavía sin dibujar nada — para no quemar la corrida visual con el toolkit a medio probar.

### 1 · Template matching — la 3ª vía de mapeo (`locate-piece.py`)
Alan preguntó si había otra forma de mapear sin el bbox difícil. **La hay, y resuelve el caso de la tienda.** `locate-piece.py` busca cada pieza CONOCIDA dentro del composite por correlación normalizada (NCC) → **LOCALIZA sin segmentar** → funciona sobre el composite ENSAMBLADO (donde map-pieces ve 1 blob).

| Caso | Resultado |
|---|---|
| Banco de verdad conocida (5 piezas) | posición **exacta**, peak **1.000** |
| **Material real: `pieces/` vs `tienda_clean.png`** | posición exacta, peak **1.000** en las 3 probadas |

El peak 1.000 sobre material real revela que **las piezas de `pieces/` son recortes 1:1 de `tienda_clean`** → template matching da la posición de cada una en la tienda armada, **sin ojo, sin blob, sin los 500px**. Las **tres vías de mapeo** quedan claras: connected-components (sheet desarmado) · **template matching (tenés las piezas + el arte armado)** · color/SAM (BL-21/BL-22, solo si NO tenés las piezas).

### 2 · Loop de verificación por-pieza (`score.py` + `overlay`)
Sobre un par alineado real (norma base `face_smile_3.svg` vs su target `face_smile_2k.png`):
- **score.py distingue calidad:** norma base dE95=**10** / diss=**0.25** vs la vieja mala (glow inflado) dE95=**14** / diss=**0.42**. Ambas `shape-ok` (correcto: el defecto de la vieja es color, no forma).
- **overlay genera el diff** (el "dónde"), 1690×1494.
- **Matiz honesto:** el verdict binario + los umbrales de señal filtran lo GRUESO; para diferencias FINAS entre dos versiones buenas hay que leer los números crudos + el diff. Es la división de trabajo de la Opción B funcionando, no un defecto — pero el ejecutor tiene que mirar el diff, no solo el verdict.

Evidencia extra en `_toolkit-bench/` + `_trace_diff.png`/`_trace_over.png` en `spike-rive/`.

### Qué queda para la próxima (CON gate de Alan, porque es visual)
El **test de método**: re-vectorizar la tienda de 0 con el toolkit completo puesto (**`locate-piece` da las posiciones** sobre el arte armado, o `map-pieces` sobre un sheet desarmado → vectorizar cada pieza → `score.py`+diff verifican fidelidad → `crop-check` el recorte → `check-rig` antes de Rive) y medir si un ejecutor sin ojo llega sin los corrimientos ni los 3 errores del gate. Eso es visual → gate por pieza, no autónomo.
