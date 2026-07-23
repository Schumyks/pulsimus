# Generación de video — E0 · La supernova

> **Qué es:** doc de dirección para GENERAR los clips de video de la intro E0 en Higgsfield. **Uno por escena** (este es E0; E1…E7 tendrán el suyo, para no cargar un solo doc).
> **Estado:** BORRADOR para gate + generación (2026-07-22). Modelo primario **Kling v3.0**, alternativa **Seedance 2.0** (A/B por costo).
> **Fuentes:** [boceto E0](boceto.md) (los 4 actos + la física del colapso) · [storyboard](../../direccion/storyboard.md) · [canon de assets](../../direccion/canon-assets.md). Método de prompt: skill global `kling-3-prompting`.
> **Canal decidido:** VIDEO para todo el arco visual + **wordmark/copy como capa DOM encima** (el video va MUDO y SIN texto). El clímax canvas viejo se jubila.

---

## Cómo se usa este doc

1. Generás los **5 clips** en Higgsfield con los settings + prompts de abajo, en **modo keyframe** (imagen de inicio → imagen de fin).
2. El video se genera **MUDO** (`sound: off`) y **SIN texto en el frame** — el copy y el wordmark PULSIMUS van como capa DOM sobre el video, en el sitio.
3. El **montaje** (unir los clips + timing + wordmark) se hace *después*, con el material en mano. Los clips se generan holgados (4–5s) para tener sobrante de edición.

---

## Settings globales

| Ajuste | Kling v3.0 (primario) | Seedance 2.0 (alternativa) |
|---|---|---|
| Model id (HF) | `kling3_0` | `seedance_2_0` |
| Resolución **1080p** | `mode: pro` | `mode: std`, `resolution: 1080p` |
| Audio (MUDO) | `sound: off` | `generate_audio: false` |
| Keyframes inicio/fin | **nativo** (`start_image` + `end_image`) | emulado (`start_image` + `end_image` + `image_references`) |
| Aspecto | `16:9` desktop · `9:16` mobile | idem |
| Duración | 4–5s por clip (mín 3s) | 4–5s (mín 4s) |
| Costo aprox (5s) | ~8.75 créditos | ~45 créditos |

- **Doble render:** cada clip se genera en `16:9` (desktop) y `9:16` (mobile). El aspecto del **start frame manda** en Kling — usar el still en el aspecto correcto, o encuadre crop-safe con la acción centrada.
- **Anclaje de estilo:** el still aprobado como start/end frame ES lo que mantiene el canon Faro Ámbar. No hace falta describir el estilo en detalle: los frames lo fijan.

---

## Keyframes — los stills aprobados

Todos en `space-src/Escena 0/` (crudos, sirven tal cual como referencia de video):

| Ref | Archivo | Rol en la secuencia | Aspecto |
|---|---|---|---|
| **S1a** | `Freya_Vale_…_1.png` (MJ) | Tienda viva, carita 😊, estrella de **anillos suaves** (estrella estable) | 16:9 |
| **S1b** | `hf_20260722_161744_….png` | Tienda viva, carita 😊, estrella de **destello/puntas** (estrella agitada) | 16:9 |
| **S2** | `hf_20260722_162403_….png` | **Colapso**: B&N, carita X_X, escombros al núcleo | ⚠️ **4:3** |
| **S3** | `hf_20260722_164048_….png` | **Escape**: nave-mostrador + estela EKG + explosión | 16:9 |
| **S4** | `hf_20260722_164328_….png` | **Supernova**: anillos de shockwave + destello | 16:9 |
| **S5** | `hf_20260722_165907_….png` | **Nebulosa remanente** (paleta ámbar-canon) | 16:9 |

> ⚠️ **Asset TODO antes de generar los clips 2 y 3:** S2 (colapso) está en **4:3**; el resto en 16:9. Hay que normalizar S2 a 16:9 (re-encuadre/outpaint o re-gen) para que las transiciones no salten de aspecto. La nebulosa azul-magenta (`Schumyks_…`) queda **descartada** (fuera del canon ámbar).

---

## Los 5 clips (modo keyframe: inicio → fin)

| # | Beat | start → end | Dur. | Cámara |
|---|---|---|---|---|
| 1 | La tienda (idle + primer temblor) | S1a → S1b | 4s | dolly push-in muy lento |
| 2 | El colapso | S1b → S2 | 5s | dolly-in con leve shake |
| 3 | El escape | S2 → S3 | 4s | whip-pan siguiendo la nave |
| 4 | La supernova | S3 → S4 | 5s | crash-zoom-out |
| 5 | La nebulosa remanente | S4 → S5 | 4s | drift-out lento |

Prompts **en inglés** (Kling dirige mejor en inglés). Formato Master Formula: *entorno + sujeto + timeline de acción + cámara + atmósfera*.

### Clip 1 — La tienda
- **start:** S1a · **end:** S1b · **4s**
```
Flat 2D vector night scene: a small cozy shop standing alone on a dark planet surface, its window glowing warm amber like a calm little face. Above it, a small stable star ringed with soft concentric amber halos. FIRST the scene rests in quiet — the window light gently breathes and distant stars twinkle; THEN the star overhead slowly intensifies and begins to tremble, its rings tightening. Very slow dolly push-in. Deep navy night sky, warm amber key light, clean flat illustration.
```
- **Negative:** `photorealistic, 3D render, live-action, on-screen text, captions, letters, watermark, morphing, blurry`
- *No excluir `cartoonish/flat/smiling` — son nuestro estilo a propósito.*

### Clip 2 — El colapso
- **start:** S1b · **end:** S2 · **5s**
```
Flat 2D vector scene: the overhead star destabilizes and collapses inward, its light draining from warm amber to cold desaturated grey. Gravity pulls everything toward the imploding core — the little shop cracks and breaks into angular polygonal shards that stream toward the star. The shop window's face shifts from a warm smile to lifeless X_X eyes. Slow ominous dolly-in with subtle shake. The whole color grade collapses from amber into crushed greyscale.
```
- **Negative:** `photorealistic, 3D render, live-action, on-screen text, captions, letters, watermark, bright saturated colors, smiling face, static pose`

### Clip 3 — El escape
- **start:** S2 · **end:** S3 · **4s**
```
Flat 2D vector space: after the grey implosion everything compresses and stills for a single breath. THEN one warm amber spark bursts diagonally out of the collapse — a tiny shop-truck escaping, trailing a glowing amber wake shaped like an EKG heartbeat line. Warm amber returns with the escaping vehicle against the cold dark. Fast camera whip-pan tracking the escape. Clean flat illustration, amber on navy.
```
- **Negative:** `photorealistic, 3D render, live-action, on-screen text, captions, letters, watermark, morphing, static pose`

### Clip 4 — La supernova
- **start:** S3 · **end:** S4 · **5s**
```
Flat 2D vector supernova: the compressed core rebounds and detonates. A brilliant white-amber flash erupts, throwing expanding concentric amber shockwave rings across the night sky, with radiant star-burst spikes at the center. The blast blooms outward and fills the frame. Crash-zoom-out as it expands. Deep navy sky, intense amber and white light, clean flat illustration.
```
- **Negative:** `photorealistic, 3D render, live-action, on-screen text, captions, letters, wordmark, typography, watermark, blurry`
- *Reforzar el "no text/wordmark": el wordmark PULSIMUS va DOM encima, NO horneado.*

### Clip 5 — La nebulosa remanente
- **start:** S4 · **end:** S5 · **4s**
```
Flat 2D vector scene: the supernova's flash and rings slowly dissipate and settle into a drifting remnant nebula — a soft amber-gold core wrapped in deep navy-violet clouds, glowing embers scattered like stars. The motion calms into a gentle drift, leaving a serene, persistent nebula. Slow camera drift-out. Amber and navy palette, clean flat illustration.
```
- **Negative:** `photorealistic, 3D render, live-action, on-screen text, captions, letters, watermark, harsh edges, saturated neon`

---

## Reglas de prompting (destiladas de `kling-3-prompting`, ajustadas a Pulsimus)

- **Dirigir, no listar keywords:** entorno + sujeto + timeline (primero → después → al final) + cámara.
- **Verbos de cámara reales:** dolly push-in, whip-pan, crash-zoom, tracking, drift-out — nunca "moves/goes".
- **Keyframes deben matchear** en color, estilo y luz (por eso los stills son del mismo canon). Kling infiere el movimiento entre frames: prompt sobrio.
- **Custom negatives (IMPORTANTE):** el negative *default* de la skill trae `smiling, cartoonish, flat` — **los quitamos**, porque nuestro estilo ES flat/cartoon y la carita sonríe. Lo que SÍ va siempre en negative: `photorealistic, 3D render, live-action, on-screen text, captions, letters, wordmark, watermark`.
- **5s** para transiciones dinámicas, **hasta 10s** si la transformación es compleja.

---

## Montaje y timing (se resuelve después, con el material)

- Material bruto ≈ 22s (5 clips). La intro objetivo del boceto era ~10s → en el montaje web los clips se **recortan/aceleran** al ritmo de la intro, o Alan decide extender la intro. **Decisión de timing ABIERTA.**
- Los clips se **concatenan** (crossfades cortos entre beats) y encima va la **capa DOM**: copy de los 3 actos + wordmark PULSIMUS (nítidos, tipografía Outfit, sincronizados al progreso).
- **Fallback:** si el video no carga → poster still (S1a) + reveal directo del hero. (Detalle de build.)
- **Handoff:** la nebulosa remanente (S5) empalma con el fondo del sitio (Z1) — la misma nebulosa que persiste.

---

## Reproducibilidad — skills globales

```bash
# metodología de dirección (instalada, global — NO en el repo)
npx skills add aedev-tools/kling-3-prompting-skill@kling-3-prompting -g -y
# (Seedance: openmontage se descartó por ser framework-bound; si se sube a Seedance,
#  evaluar una skill de prompting PURA antes de instalar)
```

## TODO

- [ ] Normalizar **S2** (colapso) de 4:3 → 16:9 antes de los clips 2 y 3.
- [ ] Gate de Alan sobre los 5 prompts.
- [ ] Generar clip 1 en Kling (16:9) como **prueba de calidad** → decidir Kling vs Seedance con el resultado real.
- [ ] Si Kling pasa: generar los 5 clips × 2 aspectos.
- [ ] Copy de los 3 actos (borrador en el boceto) — se gatea aparte.
