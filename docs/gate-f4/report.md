# Gate F4 · El mostrador (pieza firma) — reporte para revisión

> Rama `f4-mostrador` (apilada sobre `f3-motion` — revisá y mergeá F3 primero). `main` intacto. Alcance congelado de brief §5 respetado: sin carrito, sin checkout, sin totales, sin backend.

## Qué mirar (en orden)

1. **`gesto-desktop.gif`** — el gesto firma: tap "Pedir" → chip ámbar viaja al panel del dueño → ticket se imprime arriba de la lista, contador sube.
2. **`gesto-mobile.gif`** — mismo gesto con paneles apilados: el pedido viaja hacia abajo (brief §5 mobile).
3. **`desktop-mostrador-post-gesto.png`** / **`mobile-mostrador.png`** — la sección aterrizada.
4. El preview vivo (deploy `f4-mostrador` en Vercel): tocalo — es la pieza que se toca.

## Qué se construyó

- Sección `#mostrador` entre Dolores y Proceso (posición 3, brief §4), con reveals del kit F3.
- **Panel cliente**: tiendita "La Espiga" con 3 productos y botón Pedir (lockout 1.3s con "✓ Pedido").
- **Panel dueño**: "Pedidos de hoy" + badge contador vivo + lista de tickets (papel hueso con borde dentado CSS, dot ámbar en los pedidos nuevos). Seeds server-renderizados (Sofía/Martín — sin JS la sección se ve completa).
- **El gesto**: chip ámbar `×N` con FLIP (mismo easing del viaje de la intro: un solo lenguaje de movimiento), 0.55s, aterriza donde nace el ticket; impresión con patrón grid-rows 0.45s.
- Pedido del usuario: "Vos · ret. HH:MM" (ahora + 45 min redondeado al cuarto — client-only, sin hydration mismatch).
- Cap de lista: 4 tickets visibles (el más viejo sale); el badge sigue contando el total.

## Verificación (Playwright, build de producción)

| Check | Resultado |
|---|---|
| Estado inicial: 2 seeds, badge 2 | ✓ |
| Gesto: click → chip → ticket "Vos" arriba, badge +1 | ✓ |
| Cap de lista en 4 visibles con badge siguiendo el total | ✓ |
| Lockout: 2 clicks a 120ms = 1 solo pedido | ✓ |
| Reduced-motion: ticket instantáneo, sin chip | ✓ |
| Mobile apilado: gesto viaja hacia abajo | ✓ (video) |
| build + tsc + eslint | ✓ verdes |

## Assets elegidos (de tu curación de 9)

Medialunas → `medialunas-3` (fila con brillo de almíbar) · Pan de campo → `pan-2` (domo craquelado) · Facturas → `medialunas-canoncitos-1` (variedad con dulce de leche). Sombra CSS unificada del pipeline validado.

## COPY NUEVO — necesita tu veredicto

El brief no definía título ni sub de la sección; los escribí en la voz de la marca (todo lo demás es copy canon del brief §4/§5, textual):

- h2: **"Tocá los dos lados del mostrador."**
- Sub: **"La Espiga no existe. El mostrador, sí. Pedí algo y mirá cómo te llega."**
- Micro-copy de la demo: "La Espiga · Panadería de barrio · Pedidos para retirar", "Pedidos de hoy", "ret. HH:MM", "Vos", "✓ Pedido".

El cierre congelado va textual: "Esto que acabás de tocar es lo que hacemos: los dos lados del mostrador. El que ve tu cliente, y el que ves vos." + la línea heredada "Pulsimus la diseñamos de cero, del logo a esta página."

## Decisiones del director

1. Contador del badge cuenta el TOTAL de la sesión demo, no los visibles (con cap 4, si no, el número se congelaba al 5.º pedido).
2. Lockout GLOBAL de 1.3s (un chip a la vez — dos pedidos simultáneos de productos distintos generarían dos chips cruzándose).
3. El chip aterriza justo DEBAJO del header del panel ("Pedidos de hoy"), donde nace el ticket — continuidad chip→ticket.
4. Labels: "LO QUE VE TU CLIENTE" en bruma sobre hueso; "LO QUE VES VOS" en `hueso/60` sobre noche (bruma sobre noche daba ~3.6:1, insuficiente AA para 12px — mismo patrón que CtaFooter).
5. Sin precios en las cards: fiel al wireframe congelado, y la demo es sobre el gesto, no el catálogo.
6. Exit del ticket viejo al superar el cap: instantáneo en v1 (la atención está en el que entra arriba). Animarlo (colapso+fade) queda en backlog del módulo.

## Backlog del módulo (NO v1, brief §5 guardarraíles)

- Exit animado del ticket que sale por el cap.
- Sonido de campanita opcional al caer el pedido (idea del brief §Post-v1).
- Preámbulo "vidriera → mostrador" (dirección en f4-image-prompts §B).

## Pulido P3 aplicado en esta rama

- Header mobile (pre-existente de F2): el CTA "Agendá tu diagnóstico" partía en 2 líneas y apretaba el wordmark a 375px (visible en `mobile-mostrador.png`, tomado antes del fix). Arreglado con tamaños responsivos + `whitespace-nowrap` (solo estilos, copy intacto) — ver `mobile-header-fixed.png`.
