# BL-17 · Guión del viaje de la estrella (Fase 2 — coreografía 2D/pseudo-3D)

> Dirección de la narrativa "estrella a nivel sitio" (decisión de Alan 18/07, Engram obs 327).
> La estrella vive en una capa canvas ADITIVA sobre las secciones reales (z-40, sin tocar el DOM de abajo).
> Estado: **propuesta de dirección de Fable — pendiente del gate de Alan.**

## Reglas del sistema

- **Modelo de viaje**: la estrella vive en coordenadas de VIEWPORT (te acompaña siempre en pantalla); su posición se interpola sobre el progreso de scroll a través de waypoints anclados a cada sección, con "chase" suavizado (la estrella persigue su objetivo con lag → sensación viva/magnética).
- **Contraste por skin de fondo** (hallazgo del spike): secciones hueso → cuerpo ámbar; secciones noche → cuerpo hueso. Glow siempre ámbar.
- **Pulso de sección**: al entrar cada sección, la estrella emite un anillo expansivo (el "pulso que da vida"). El encendido REAL de las secciones (reveals disparados por el pulso) es fase posterior.
- **Gates**: solo desktop (≥768px) y sin `prefers-reduced-motion`. Mobile y reduced ven la página tal cual hoy.
- **Path por los márgenes**: la estrella viaja por las bandas laterales libres del layout `max-w-6xl` — jamás pisa contenido (hallazgo del spike).

## Estaciones

| # | Sección | Fondo | Posición (banda) | Mood / acción |
|---|---------|-------|------------------|----------------|
| 0 | `#inicio` Hero | hueso | derecha, alta | **Quieta.** Respira apenas (twinkle idle). El EVENTO: el primer scroll la despierta — flare de glow y arranca el viaje. |
| 1 | `#dolores` | hueso | derecha, media | **Pulso enfermo.** Late lento y tenue (eco del latido 30bpm de la sección). Más chica, glow bajo. |
| 2 | `#mostrador` | hueso | izquierda, media | **Se enciende.** Cruza de banda, recupera brillo, pulso de sección pleno — acá empieza la solución. |
| 3 | `#tablero` | noche | derecha, media | **En su cielo.** Cuerpo hueso brillante, twinkle rápido (datos vivos), leve deriva entre paneles. |
| 4 | `#proceso` | hueso | izquierda, media | **Metódica.** Descenso sereno en línea más recta, pulso de sección al entrar. |
| 5 | `#quien-soy` | noche | derecha, cercana | **Cercana (pseudo-3D).** Crece (profundidad), acompaña el riel de estaciones como presencia. |
| 6 | `#contacto` + footer | noche | centro → wordmark | **Aterrizaje.** Baja al footer y se posa junto a PULSIMUS; pulso final. (El cierre que DIBUJA el logo completo = ítem propio de la V1 completa.) |

## Parámetros afinables (`?tune` — panel STAR)

`chaseLag` (suavizado de persecución) · `sizeBase` / `sizeNear` (escala base y de cercanía) · `glowScale` · `pulseMs` (duración del anillo) · `edgeX` (qué tan afuera viaja en la banda).

## Addendum 18/07 (feedback de Alan sobre la v1 de la coreografía)

- **Umbrales**: 6 zonas de transición (`<Umbral/>`, altura tuneable vía `--umbral-h`, default 55vh) entre todas las secciones — ventanas al cielo nocturno donde la estrella toma el centro de escena (deriva lateral alternada para que el path serpentee). Los bordes de sección dejaron de ser cortes duros: cada umbral pluma el skin saliente y el entrante contra el cielo.
- **Cielo estrellado** (`SkyLayer`, estilo Phinxlab): canvas fijo a **z-negativo** con gradiente noche + 3 capas parallax de estrellas dibujadas con twinkle propio. Visible en los umbrales; las secciones opacas lo tapan. Gotcha de stacking documentado en el código: a z-0 pintaba ENCIMA de los fondos estáticos.
- **Path v3**: interpolación Catmull-Rom por todos los waypoints (secciones + umbrales) — el viaje dejó de ser lerp mecánico.
- **Onda de pulso v2**: recortada al rect de la sección que la emite; donde el frente supera un borde superior/inferior dibuja la cuerda de colisión iluminada ("la onda rompe contra los bordes"). Tuneable: alcance (vh), grosor, duración.
- **Panel `?tune` UNIFICADO**: un solo panel flotante con pestañas (Estrella · Mostrador · Tablero · Quien-soy), colapsable; los 4 paneles individuales fueron eliminados. Registro: `dev/tuneRegistry.ts` + `dev/UnifiedTunePanel.tsx`.

## Addendum 18/07 (2) — pivot NOCHE-FIRST (decisión de Alan, Engram obs 335)

- **El sitio ES el cielo**: mueren los fondos opacos a nivel sección (hueso Y noche); el cielo estrellado corre continuo detrás de todo y las cards contrastan flotando. Mobile/reduced ven noche plano del body. Reskin ejecutado por Sonnet con spec cerrada; las cards claras QUEDAN claras (superficies flotantes).
- **Umbrales v2**: sin plumas de gradiente — ahora son cielo abierto con **bancos de nubes hueso** (16 puffs por umbral en 2 capas: fondo bajo la estrella, frente sobre ella) que derivan con el tiempo y **se abren al paso de la estrella** (shove radial + merma de alpha, tuneable "Apertura de nubes").
- **Cursor**: la estrella se inclina hacia el cursor mientras se mueve (tuneable "Atracción al cursor", decae a los 2s de quietud) y un **click en el vacío emite un pulso libre** + kick del latido — el usuario siente el pulso.
- **Onda-reveal**: la onda de entrada a cada sección ahora REVELA el contenido detrás de su frente (máscara radial `.sw-pending` en `star.css`, radio animado por frame hasta cubrir la esquina más lejana). Saltos profundos por anchor revelan al instante las secciones salteadas. Sin la capa montada (mobile/reduced/no-JS) nada se oculta jamás — progressive enhancement.
- Todas las estaciones pasan a skin "dark" (cuerpo hueso); la maquinaria de skins queda para BL-16.

## Addendum 18/07 (3) — motor v2: la estrella es la COMPAÑERA del cursor

- **Muere el path por scroll** (Alan: "el pathing per se es medio raro"). La estrella acompaña al cursor con chase suavizado; sin puntero, orbita respirando arriba a la derecha. El visitante construye el sitio por donde pasa: cuando una sección entra al viewport, la onda de reveal **nace en la estrella** (donde esté el cursor en ese momento). Click en el vacío = pulso + kick del latido (queda).
- **Nubes procedurales AFUERA** (Alan: "parecen partículas gigantes"). Los umbrales quedan como escenarios de cielo limpio esperando **set-pieces diseñados**, distintos por umbral (ej. aprobado: "energía que se acumula en un sol/galaxia y explota" para el umbral → quien-soy).
- **Pipeline de diseño**: prompts listos en [bl17-design-rounds.md](../escenas/e0-supernova/design-supernova.md) — Ronda 1 Nano Banana (capas de nubes sobre negro puro, alpha por luminancia, → `public/clouds/`), Ronda 2 Claude Design con Opus (prototipo HTML autocontenido del set-piece galaxia, 3 direcciones visuales primero). Arquitectura receptora: registry de escenas por umbral con interfaz `draw(ctx, rect, progress, starPos)`.
- El aterrizaje en el footer y el cierre del logo se rediseñarán sobre este motor (la estrella ya no viaja sola — el cierre será un set-piece/imán).

## Fuera de alcance de esta fase

- Encendido de secciones disparado por el pulso (reveals coreografiados).
- Cierre animado que construye el logo (línea de pulso + estrella).
- Upgrade WebGL (próxima épica, BL-17 nota Ferrari).
