# F3 · Coreografía de la intro — extracción del donante (v1 de Fable)

> Fuente: `Pulsimus Landing.html` (raíz del repo, export de Fable, 04/07). El documento real está embebido como string escapeado; versión legible en scratchpad de sesión. Este doc captura TODO lo que F3 necesita portar — no hace falta re-leer el HTML.
>
> **Qué cambia vs el donante (brief §8 + decisión Engram):** (1) sessionStorage 1×/sesión (el donante usa prop `mostrarIntro`, no persiste); (2) tiempo muerto ~2s antes del viaje (el donante usa 2750ms); (3) `hola@pulsimus.com` → placeholder, se barre en F5; (4) portar a React/Next idiomático (el donante es un class component del runtime de Fable).

## 1 · Vocabulario de keyframes (copiar tal cual)

```css
@keyframes px-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes px-draw  { to { stroke-dashoffset: 0; } }
@keyframes px-pop   { 0% { transform: scale(0); opacity: 0; } 55% { transform: scale(1.55); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes px-flash { 0% { opacity: 0; transform: scale(0.4); } 25% { opacity: 0.85; } 100% { opacity: 0; transform: scale(3); } }
@keyframes px-track { 0% { letter-spacing: 0.02em; opacity: 0; } 100% { letter-spacing: 0.22em; opacity: 1; } }
@keyframes px-beat  { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.14); opacity: 0.8; } }
@keyframes px-hint  { 0%, 100% { transform: translateY(0); opacity: 0.85; } 50% { transform: translateY(9px); opacity: 0.35; } }
```

`px-beat` es EL latido de la marca → base de la animación del PulseDivider en Dolores (F3): variar duración/amplitud para "late despacio" (HOY) vs "late fuerte" (CON PULSIMUS). `px-hint` = scroll hint del hero.

## 2 · Overlay de la intro

- `position: fixed; inset: 0; z-index: 90`, click en todo el overlay = skip, `cursor: pointer`.
- Fondo `#1B2140` con `opacity: {bgOp}; transition: opacity 0.7s ease` (se funde al viajar).
- Cielo de estrellas: SVG `viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"`, 10 circles r 1.2–1.8 (8 bruma `#6A719E` + 2 ámbar `#F2A63E`), entra con `px-fade 1s ease both`.
- Columna central: `flex column, align center, gap 30px`.
- "CLICK PARA SALTAR": abajo (bottom 30px), 12px, tracking 0.1em, bruma, `px-fade 0.8s ease 1.2s both`.

## 3 · El símbolo (pulso → estrella)

SVG `id="intro-sym" viewBox="0 0 128 56"` 240×105:

- **Pulso**: `path d="M6 37 H24 L31 30 L38 37 L48 15 L58 45 L66 37 H82 L97 16"`, `pathLength="100"`, stroke hueso `#F6EFE1` 5px round/round, `stroke-dasharray: 100; stroke-dashoffset: 100` → se dibuja con `px-draw 1.1s cubic-bezier(0.5, 0, 0.3, 1) 0.25s forwards`.
- **Estrella** en `translate(103,11)`:
  - Flash previo: circle r11 ámbar 0.85 alpha, `blur(5px)`, `px-flash 0.9s ease 1.28s forwards`.
  - Estrella de 4 puntas: `path d="M0 -9 C1.7 -2.7 2.7 -1.7 9 0 C2.7 1.7 1.7 2.7 0 9 C-1.7 2.7 -2.7 1.7 -9 0 C-2.7 -1.7 -1.7 -2.7 0 -9 Z"` ámbar, `px-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards` (overshoot a 1.55 en el 55%).
  - Ambos con `transform-box: fill-box; transform-origin: center`.

## 4 · Wordmark y tagline

- Wordmark "Pulsimus": 38px, weight 600, uppercase, `text-indent: 0.22em`, hueso, `px-track 0.75s cubic-bezier(0.25, 0.5, 0.3, 1) 1.55s both` (el tracking se ABRE de 0.02em a 0.22em mientras aparece).
- Tagline "EL PULSO DE TU NEGOCIO": 13px, weight 500, tracking 0.18em, ámbar, `px-fade 0.6s ease 2.1s both`.
- Ambos en un wrapper con `opacity: {wmOp}; transition: opacity 0.3s ease` (se apaga rápido al viajar).

## 5 · Timeline completa

| t (ms) | Evento |
|---|---|
| 0 | Overlay + estrellas de fondo (`px-fade` 1s) |
| 250 | El pulso empieza a dibujarse (1.1s) |
| 1200 | Aparece "CLICK PARA SALTAR" |
| 1280 | Flash ámbar (0.9s) |
| 1300 | Pop de la estrella (0.55s) |
| 1550 | Wordmark abre el tracking (0.75s) |
| 2100 | Tagline (0.6s) |
| **2750** | `startTravel()` — **F3 lo baja a ~2000** |
| +820 | `finish()`: overlay fuera, hero revela |

## 6 · El viaje al header (FLIP manual)

En `startTravel()`: medir `getBoundingClientRect()` de `#intro-sym` (a) y del target del header `#hdr-sym` (b) →

```
dx = centroX(b) − centroX(a);  dy = centroY(b) − centroY(a);  s = b.width / a.width
travelT = translate(dx, dy) scale(s)
```

aplicado con `transition: transform 0.8s cubic-bezier(0.7, 0.02, 0.3, 1)` sobre `#intro-sym`, simultáneo: `bgOp → 0` (0.7s) y `wmOp → 0` (0.3s). A los 820ms, `finish()`: fase `done`, se desmonta el overlay, el símbolo del header pasa a opacidad 1 (`hdrOp`) y se revela el hero. Si falta `#hdr-sym`, `finish()` directo (fallback). El header de F2 necesita exponer ese ancla con id estable.

**Skip**: click en cualquier momento → `finish()` (limpia timers).

## 7 · Sistema de reveals (motion kit)

- Elementos `[data-rv]`: estado inicial `opacity: 0; translateY(26px)`, `transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)`, delay por elemento vía `data-rv-d` (ms).
- `IntersectionObserver` con `threshold: 0.12, rootMargin: '0px 0px -7% 0px'`; al intersectar → `opacity: 1; transform: none` + `unobserve` (revela una sola vez).
- El hero (`data-rv="hero"`) NO se observa: lo revela `finish()`/`revealHero()` cuando termina la intro (o de entrada si no hay intro).

## 8 · Parallax + línea de proceso (scroll fx)

- `[data-px]` (factor por elemento, ej. 0.3) × `intensidadParallax` (default 0.6): `translate3d(0, offsetDesdeCentroViewport × f, 0)`, con rAF-throttle en scroll/resize y skip si el host está fuera del viewport ±80px.
- `#proc-line` (línea SVG de Proceso, `pathLength` 100): `stroke-dashoffset = 100 − p×100` con `p = clamp((vh×0.82 − rect.top) / (vh×0.65), 0, 1)` — se dibuja con el scroll.

## 9 · Reduced motion (patrón del donante, mantener en F3)

Al montar: `matchMedia('(prefers-reduced-motion: reduce)')`. Si matchea → fase `done` directa (la intro NO existe), matar animaciones CSS de `[data-anim]`, y NO instalar reveals ni scroll fx — como los estilos iniciales de reveal se aplican por JS, todo queda visible y estático por defecto. Cumple brief §11 ("reduced-motion respetado en TODO").

## 10 · Checklist de porteo F3

- [ ] Keyframes + tokens de motion (durations/easings §1) en globals o módulo de motion.
- [ ] Componente `Intro` cliente: overlay §2–4, timeline §5 con viaje a ~2000ms, FLIP §6, skip, **sessionStorage 1×/sesión** (nuevo vs donante).
- [ ] Ancla `#hdr-sym` en el header sticky de F2 (símbolo con opacidad 0→1 al terminar la intro).
- [ ] Reveals §7 en las 4 secciones + delays escalonados.
- [ ] PulseDivider (Dolores) animado con `px-beat` parametrizado (despacio/fuerte).
- [ ] Parallax §8 opcional — evaluar si entra en F3 o va al backlog (el donante lo tenía; el brief no lo exige).
- [ ] Reduced motion §9 end-to-end.
