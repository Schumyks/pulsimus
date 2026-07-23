# Despiece de assets — E0 · La supernova

> **Qué es:** el plano de producción de assets de E0 para el pipeline **vector/canvas riggeado** (piezas planas generadas + animadas por código), NO video. Molde para las escenas siguientes.
> **Estado:** BORRADOR para gate (2026-07-23).
> **Pivote de canal:** supersede parcialmente [`bl17-e0-video.md`](video.md). El 22/07 E0 quedó gateado como VIDEO (Kling); esta sesión pivotea a vector/canvas por **pérdida de calidad + peso** del video (36MB crudos → 4.5MB comprimidos = lavado; y con N escenas no escala). El trabajo de video (`IntroVideo.tsx`, `public/space/intro/e0.mp4`) **NO se borra** — queda como fallback/comparación hasta que el vector pruebe que gana (criterio del spike).
> **Fuentes:** [storyboard E0.1–E0.5](../../direccion/storyboard.md) · [boceto E0](boceto.md) · [canon de assets](../../direccion/canon-assets.md).

---

## Pipeline y reglas de frontera

El flujo (5 pasos), la frontera **🎨 ilustración (la generás vos) / ⚡ efecto de código (lo dibujo yo)**, cuándo hacen falta frames y cómo entregar las piezas viven en **[`direccion/pipeline-assets.md`](../../direccion/pipeline-assets.md)** — reglas permanentes para todas las escenas. Este doc es el despiece concreto de E0.

---

## Despiece E0 — por asset

Leyenda tipo: 🎨 = generás vos (sobre verde) · ⚡ = lo dibujo/animo yo (código) · 🎨→⚡ = generás la pieza base y yo derivo el efecto.

### Asset 1 · La tienda

| Parte | Tipo | Aparece en | Cómo se anima | Cómo la entregás |
|---|---|---|---|---|
| **Cuerpo de la tienda** | 🎨 | E0.1→E0.3 | idle sutil → tiembla → se estira hacia la estrella (succión) → se fragmenta | 1 pieza sobre verde, **entera y de frente**, sin cartel ni ventana pegados si podés |
| **Cartel torcido** | 🎨 | E0.1→E0.3 | idle → se despega y sale volando hacia el núcleo | pieza **separada** sobre verde |
| **Ventana-carita 😊** | 🎨 | E0.1→E0.2 | parpadeo idle → se apaga | pieza sobre verde (o un hueco en el cuerpo) |
| **Ventana-carita X_X** | 🎨 | E0.2→E0.3 | reemplaza a la 😊 en el colapso | 2ª pieza sobre verde (mismo encuadre que la 😊) |
| Luz cálida de la ventana | ⚡ | E0.1→E0.2 | respira → se drena a gris | — la hago yo (glow) |
| Fragmentos poligonales (shards) | 🎨→⚡ | E0.3 | espiral hacia el núcleo | **NO los generes** — fracturo el cuerpo por código |

> Nota: la carita 😊→X_X es el único cambio de **expresión** (deformación). Se resuelve con **2 piezas** (los 2 estados), no con frames. Si querés un estado intermedio, una 3ª. No más.

### Asset 2 · La estrella (el sol que muere)

**Toda ⚡ — es luz y geometría pura, la dibujo yo.** No generes nada de esto; queda mejor por código y buena parte ya existe en canvas (la supernova está construida).

| Parte | Tipo | Aparece en | Cómo se anima |
|---|---|---|---|
| Núcleo + estrella de 4 puntas | ⚡ | E0.1→E0.5 | estable → hinchada/temblando → colapso → detona → remanente |
| Anillos/halos concéntricos | ⚡ | E0.1→E0.2 | pulsan suave → se tensan |
| Succión / campo gravitatorio | ⚡ | E0.2→E0.3 | líneas de polvo curvándose al núcleo (partículas) |
| Flash + shockwave rings (supernova) | ⚡ | E0.4→E0.5 | rebote y detonación (ya en canvas, se adapta) |

### Asset 3 · La furgoneta-nave (con el mostrador)

| Parte | Tipo | Aparece en | Cómo se anima | Cómo la entregás |
|---|---|---|---|---|
| **Carrocería de la furgoneta** | 🎨 | E0.4 | cruza el cuadro en diagonal (traslación) | 1 pieza sobre verde, vista 3/4 escapando |
| **Mostrador de madera** (atado al techo) | 🎨 | E0.4 | se mueve con la furgoneta | pieza **separada** (es "lo único que importa" — lo quiero destacable) |
| Ruedas / propulsores (si se ven) | 🎨 | E0.4 | rotación / parpadeo | piezas separadas y **centradas en su eje** — solo si el diseño las muestra |
| **Estela EKG** | ⚡ | E0.4 | se **escribe** detrás de la nave + late (leitmotiv) | — la dibujo yo (ya la tenemos en `PulseDivider`) |
| Chispa/glow del escape | ⚡ | E0.4 | halo cálido siguiendo la nave | — la hago yo |

> La estela EKG **no me la des pegada dentro de la nave ni recortada** — es un trazo, la anima el código.

### Asset 4 · La nebulosa remanente

Persiste **como fondo del sitio** (handoff a Z1) — no es solo de E0.

| Parte | Tipo | Aparece en | Cómo se anima | Cómo la entregás |
|---|---|---|---|---|
| **Nubes de la nebulosa** | 🎨 | E0.5 → fondo Z1 | drift lento, parallax por capas | 1-2 **texturas** sobre verde (idealmente que loopeen sin costura) |
| Core glow ámbar | ⚡ | E0.5 → Z1 | respira | — gradiente por código |
| Embers / brasas dispersas | ⚡ | E0.5 → Z1 | flotan como estrellas | — partículas por código |

### Asset 5 · Fondo

**Todo ⚡ — ya existe (SkyLayer).** Campo de estrellas (twinkle + parallax) + polvo/debris (partículas). No generes nada.

---

## Lo que tenés que generar AHORA (checklist accionable)

Solo las piezas 🎨, cada una **sobre fondo verde plano**, en el estilo ancla MJ (Kurzgesagt destilado, indigo + ámbar):

- [ ] Tienda — **cuerpo** entero de frente
- [ ] Tienda — **cartel** torcido (pieza separada)
- [ ] Tienda — **ventana-carita 😊**
- [ ] Tienda — **ventana-carita X_X** (mismo encuadre)
- [ ] Furgoneta — **carrocería** 3/4 escapando
- [ ] Furgoneta — **mostrador** de madera (pieza separada)
- [ ] Furgoneta — **ruedas/propulsores** (solo si el diseño los muestra, centrados en su eje)
- [ ] Nebulosa — **1-2 texturas de nube** (seamless si se puede)

**Prompt de asset** (distinto del board — pieza suelta para recortar): usá el template maestro del [canon](../../direccion/canon-assets.md) con `single object, centered` + **`solid flat green background`** (chroma) + `--sref` del ancla E0.1. Sin sombra proyectada sobre el verde (dificulta el recorte); glow/halo NO los generes (los pongo yo).

## Lo que es mío (no generes)

Estrella entera + halos + succión + supernova · estela EKG · glow del escape · luz de la ventana · fragmentos de la tienda (fractura por código) · core-glow y embers de la nebulosa · campo de estrellas + polvo.

---

## Deuda / a decidir

- **Furgoneta espacial:** ¿tiene ruedas visibles o son propulsores? (gate de diseño de la nave sigue pendiente del storyboard).
- **Verde exacto del chroma:** fijar un verde que no aparezca en ningún asset (ni en el ámbar ni en el indigo). Propongo un verde puro tipo `#00B140` (green-screen estándar). A confirmar al generar la primera pieza.
- **Nebulosa 🎨 vs ⚡:** las nubes las marqué 🎨 (textura ilustrada); si al probar el core+embers por código la cosa ya se ve bien sola, quizás la nebulosa entera pasa a ⚡. Se decide con el spike.
