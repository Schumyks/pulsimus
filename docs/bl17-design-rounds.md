# BL-17 · Rondas de diseño — assets y set-pieces de los umbrales

> Reparto según el canal validado en FG: **Fable escribe los prompts, Alan los corre** (Nano Banana en su UI web a 0 créditos; Claude Design con Opus). Fable portea los resultados a la arquitectura real (canvas, reveal, SSR, performance). Curación de Alan = fuente de verdad.

## Ronda 1 · Nano Banana — capas de nubes (umbral estándar)

**Técnica de integración**: generá las nubes en **blanco/crema sobre fondo NEGRO PURO** — yo extraigo el alpha por luminancia localmente (mejor que rembg para bordes difusos) y las tiño a hueso en el canvas. Formato horizontal amplio (se usan como bandas). Idealmente 3 variantes de cada capa para no repetir patrón entre umbrales.

**Prompt A — capa de fondo (lejana):**
> Wide horizontal band of soft wispy stratus clouds, painted in warm cream white on a pure black background, very soft diffuse edges, thin elongated cloud streaks, subtle painterly texture, dreamy night-sky illustration style, no stars, no moon, no ground, 21:9 wide format

**Prompt B — capa media:**
> Wide horizontal bank of fluffy cumulus clouds, warm cream white on pure black background, medium density, soft billowing rounded shapes with gentle painterly shading, dreamlike storybook illustration style, edges dissolving into black, no stars, no ground, 21:9 wide format

**Prompt C — capa frontal (densa, para que la estrella pase por detrás/delante):**
> Dense sculpted cumulus cloud bank filling the lower third, warm cream white on pure black background, dramatic soft volumetric shading, large rounded cloud masses with clear silhouettes, painterly storybook night style, upper two thirds pure black, no stars, no ground, 21:9 wide format

**Entrega**: dejá los PNG curados en `public/clouds/` (nombres libres, me adapto). Con eso integro parallax real de 3 capas por umbral.

> ✅ **Ronda 1 COMPLETADA (18/07).** Alan entregó 10 placas (2 wispy / 4 cúmulos / 4 bancos densos). Procesadas con `scratchpad/process-clouds.ts` (alpha por luminancia + un-premultiply + feather de bordes 6%/5% + WebP 1600px, ~250KB c/u) → `public/clouds/processed/{a1..a2,b1..b4,c1..c4}.webp`. Los cortes de borde de las originales NO exigieron regenerar: el feather los disuelve. Integradas en StarLayer: 3 capas parallax por umbral (variantes ciclando), clip exacto a la banda + pluma vertical, banco frontal con agujero suave alrededor de la estrella (buffer offscreen del tamaño de la banda). Si se regeneran placas, correr de nuevo el script.

## Ronda 2 · Claude Design — set-piece "la energía se acumula y explota" (umbral → quien-soy)

Chat NUEVO en el Project de Design, modelo **Opus**. Prompt para pegar:

---

Sos el motion designer de Pulsimus (identidad "Faro Ámbar": fondo noche `#1B2140` (y más profundo `#12162e`), crema hueso `#F6EFE1`, acento ámbar `#F2A63E`, tipografía Outfit). Estás diseñando un SET-PIECE para una zona de transición de la landing: un tramo de cielo nocturno estrellado donde, a medida que el visitante scrollea, **se acumula energía en un núcleo (un sol naciente / mini-galaxia en espiral) que crece, se carga y al llegar al clímax EXPLOTA en una onda expansiva que llena la pantalla** — la explosión es el "nacimiento" que da paso a la siguiente sección.

Entregá **UN archivo HTML autocontenido** (sin librerías externas, canvas 2D + JS vanilla) que simule la escena en un viewport completo:

- El progreso de la carga se controla con un **slider de debug** (0→1) además del scroll interno del demo, así puedo scrubearlo a mano.
- Fases claras: (1) partículas de polvo ámbar/hueso que orbitan y se van absorbiendo al núcleo, (2) el núcleo crece y gira (espiral) con glow creciente, (3) umbral de clímax → explosión: shockwave + partículas expulsadas + flash que se disuelve.
- Todas las constantes de motion (velocidades, cantidades, radios, colores, umbral del clímax) agrupadas en un objeto `TUNING` al tope del archivo.
- Paleta ESTRICTA Faro Ámbar (nada de azules eléctricos ni violetas neón).
- 60fps en un laptop normal: máximo ~400 partículas vivas.

Antes de codear, proponeme en texto **3 direcciones visuales distintas** para el núcleo (ej.: sol de acreción / galaxia espiral / geiser de pulsos) con un pro y un contra cada una, y esperá que elija una. Después construí el HTML de la elegida.

---

**Qué vuelve a Fable**: el HTML final. Yo lo porteo como `UmbralScene` (módulo por-umbral del canvas real, atado al progreso de scroll del umbral y al sistema de reveal). Límite conocido del canal: el JS fino puede necesitar 2-3 deltas — presupuestalo.

## Arquitectura que los recibe

Los umbrales quedaron como escenarios vacíos (`data-umbral`, altura tuneable). El plan: registry de escenas por umbral (`umbral 0..5 → escena`), cada escena un módulo canvas con la misma interfaz (`draw(ctx, rect, progress, starPos)`). Nubes = escena estándar; galaxia-explosión = escena del umbral 5 (→ quien-soy). Los que no tengan escena asignada quedan cielo limpio.
