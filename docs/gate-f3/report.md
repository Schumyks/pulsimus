# Gate F3 · Intro + motion kit — reporte para revisión

> Rama `f3-motion`, corrida autónoma 2026-07-04 (tarde). `main` intacto. Preview de Vercel: se genera con el push de esta rama (mirá el deploy `f3-motion` en el dashboard de Vercel).

## Qué mirar (en orden)

1. **`intro-desktop.gif`** — la intro completa: cielo estrellado → pulso que se dibuja → flash + estrella → wordmark abriendo tracking → tagline → viaje FLIP del símbolo al header. (`intro-desktop.webm` es el video fuente.)
2. **`intro-mid-frame.png`** — frame a ~1650ms: composición completa de la intro.
3. **`desktop-1440x900-post-intro.png`** — la página aterrizada, con el símbolo ya en el header.
4. **`mobile-375x812.png`** — mobile post-intro.
5. **`desktop-reduced-motion.png`** — con `prefers-reduced-motion`: sin intro, página completa y estática.
6. El preview vivo: la intro corre 1× por sesión — para repetirla, borrá `px-intro-seen` del sessionStorage o abrí ventana privada.

## Definition of done — estado

- [x] Rama `f3-motion` con build verde (`bun run build`, tsc, eslint sin errores), `main` intacto.
- [x] Intro completa: 1×/sesión (`sessionStorage`), contenido completo a ~2s, viaje a 2050ms, skip por click en todo el overlay y por Enter/Espacio/Escape, FLIP al `#hdr-sym` del header.
- [x] Reveals `[data-rv]` en las 4 secciones con delays escalonados + PulseDivider latiendo (despacio/fuerte).
- [x] Reduced-motion end-to-end: la intro no se monta, ningún reveal se instala, dividers quietos, página visible y estática (verificado con `emulateMedia`).
- [x] Material del gate en esta carpeta.
- [ ] Gate de Alan (asincrónico en esta corrida, por override del run autónomo): **tu veredicto define el merge**.

## Verificación funcional (Playwright, build de producción)

| Check | Resultado |
|---|---|
| Intro corre en primera visita y termina sola | ✓ overlay desmontado, hero revelado |
| FLIP aterriza y aparece símbolo del header | ✓ `#hdr-sym` opacity 0 → 1 |
| `px-intro-seen` seteado; reload NO re-monta la intro | ✓ |
| Skip por Escape corta y revela todo al instante | ✓ |
| Reduced-motion: sin overlay, sin estilos inline, divider sin animación | ✓ |
| Divider late (`px-beat` en computed style) en visita normal | ✓ |

## Decisiones del director (desvíos y porqués)

1. **Timeline comprimida** (el plan pedía viaje a ~2000, el donante usaba 2750): estrellas 0 · pulso 150–1100 · hint 900 · flash 1000 · pop estrella 1020–1570 · wordmark 1250–1950 · tagline 1500–2050 · **viaje 2050** · fin ~2870. Se mantuvieron los solapes relativos del donante.
2. **El pulso viajero cambia de color durante el viaje** (hueso → noche, transición de `stroke` 0.8s): el símbolo del header vive sobre fondo hueso; sin esto el aterrizaje se invisibilizaba. La estrella queda ámbar.
3. **Guard anti-flash pre-hidratación** (no estaba en el donante, que era SPA): script inline en `layout.tsx` que oculta la página (`html.px-intro-pending`) solo si la intro va a correr, con failsafe de 4s si la hidratación se cuelga. Sin JS: no corre y la página es visible normal.
4. **`px-intro-seen` se marca al INICIAR la intro**, no al terminar: una recarga a mitad de intro no la vuelve a imponer.
5. **PulseDivider partido en dos paths** (geometría original intacta, punto compartido en 20,20): lado HOY en bruma, latido lento y tenue (2.8s, scale 1.05); lado CON PULSIMUS en ámbar, latido fuerte (1.1s, scale 1.18). Cambio mínimo de markup: el color pasó del `<svg>` a cada `<path>`.
6. **`overflow: visible` en el SVG del símbolo de la intro**: el halo del flash (blur + escala 3×) se recortaba en el rect del SVG y se veía un rectángulo oscuro (visible en la primera captura; corregido y regrabado).
7. **A11y del overlay**: `aria-hidden="true"` (intro decorativa para lectores de pantalla; no contiene elementos focusables, el foco del documento no se toca) + skip global por teclado. Contraste AA sin cambios (no se tocó copy ni colores de la página).
8. **`useReducedMotion` (hook reactivo) queda en el kit sin consumidores todavía**: Intro y Reveals leen `matchMedia` one-shot al montar — lo correcto para decisiones de montaje. El hook es para piezas vivas de F4+ (el mostrador).
9. **ESLint `react-hooks/set-state-in-effect` deshabilitado en UNA línea de `Intro.tsx`** con justificación inline: gate client-only (sessionStorage + matchMedia) que debe resolverse pre-paint; un initializer causaría hydration mismatch.

## Opcional del plan NO ejecutado

- **Línea de Proceso dibujándose con scroll (`#proc-line`)**: el markup actual de Proceso usa conectores `<span>` estáticos entre pasos; meter la línea SVG es un cambio de estructura que preferí no hacer sin tu gate (regla dura #3 de F3). Queda en backlog con esta nota como spec.

## Backlog (ideas fuera de scope, NO implementadas)

- `#proc-line` dibujándose con scroll (§8 donante, solo la línea).
- Scroll hint del hero (`px-hint` ya está en el vocabulario de keyframes, sin uso).
- Parallax `[data-px]` del donante (excluido por plan).

## Incidente de verificación (sin impacto en el código)

Un `next-server` viejo de la sesión de la mañana seguía vivo en el puerto 3000 sirviendo el build de F2 — la primera pasada de Playwright verificó contra ESO (chunks 500, sin `#hdr-sym`). Se detectó por consola + `EADDRINUSE`, se mató el proceso y se re-verificó todo contra el build real. Moraleja para futuras corridas: verificar `ss -tlnp | rg 3000` antes de `bun run start`.
