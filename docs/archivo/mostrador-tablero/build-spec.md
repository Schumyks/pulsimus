# F4 · Spec de build — El mostrador (La Espiga)

> Escrita por el director en la corrida autónoma 04/07. Si esta sesión muere a mitad de F4, ESTA spec + brief §5 + f4-image-prompts.md son todo lo que la próxima sesión necesita para terminar sin re-decidir nada.
> Alcance CONGELADO (brief §5): sin carrito, sin checkout, sin totales, sin backend. UN gesto: tocar "Pedir" y ver el pedido caer ordenado en el panel del dueño.

## Assets elegidos (de la curación de Alan, 9 fuentes en public/la-espiga/)

| Card | Foto | Por qué |
|---|---|---|
| Medialunas ×6 | `medialunas-3.webp` | 3 piezas en fila, brillo de almíbar, silueta instantánea a 100px |
| Pan de campo ×1 | `pan-2.webp` | Domo craquelado harinado, frontal, presencia |
| Facturas ×12 | `medialunas-canoncitos-1.webp` | Variedad con dulce de leche visible; está en la curación final de Alan (aprobada) |

Sombra unificada en las 3 (pipeline validado 04/07): `filter: drop-shadow(0 6px 8px rgba(27,33,64,.18))`.

## Estructura de la sección

`app/components/Mostrador.tsx` (client component, director) — `id="mostrador"`, entre Dolores y Proceso (hueco reservado en page.tsx, brief §4 posición 3). Fondo hueso, contenedor `mx-auto max-w-6xl px-6 py-24 md:py-32`.

1. `h2` (data-rv): **"Tocá los dos lados del mostrador."** — COPY NUEVO, a veredicto de Alan en el gate.
2. Sub (data-rv d=100): **"La Espiga no existe. El mostrador, sí. Pedí algo y mirá cómo te llega."** — COPY NUEVO, a veredicto.
3. Grid `lg:grid-cols-2 gap-6 lg:gap-8` (mobile: apilados, cliente ARRIBA, dueño abajo — el pedido viaja hacia abajo):
   - **Panel cliente** (data-rv d=120): borde `border-noche/10`, rounded-2xl, fondo hueso. Label "LO QUE VE TU CLIENTE" (xs, tracking 0.2em, bruma). Mini-header de la tiendita: "La Espiga" semibold + "Panadería de barrio · Pedidos para retirar" (sm, bruma). 3 `<ProductCard>`.
   - **Panel dueño** (data-rv d=240): fondo noche, rounded-2xl, texto hueso. Label "LO QUE VES VOS" (xs, tracking 0.2em, bruma). Header "Pedidos de hoy" + contador vivo en ámbar (badge con el total). Lista `<ul aria-live="polite">` de `<Ticket>`, los nuevos entran ARRIBA. Cap 4 visibles: al entrar el 5.º, el más viejo colapsa (height+fade).
4. Cierre (data-rv, CONGELADO brief §5, textual): **"Esto que acabás de tocar es lo que hacemos: los dos lados del mostrador. El que ve tu cliente, y el que ves vos."** — 2xl/3xl semibold, patrón de las frases-cierre existentes.
5. Nota al pie con puntito ámbar (patrón sello): **"Pulsimus la diseñamos de cero, del logo a esta página."** (línea heredada, brief §4).

## Datos (module-level consts en Mostrador.tsx)

```ts
const PRODUCTS = [
  { id: "medialunas", name: "Medialunas", qty: 6, img: "/la-espiga/medialunas-3.webp" },
  { id: "pan", name: "Pan de campo", qty: 1, img: "/la-espiga/pan-2.webp" },
  { id: "facturas", name: "Facturas", qty: 12, img: "/la-espiga/medialunas-canoncitos-1.webp" },
];
const SEED_ORDERS = [
  { id: "seed-1", name: "Sofía", product: "Medialunas", qty: 6, time: "10:30" },
  { id: "seed-2", name: "Martín", product: "Pan de campo", qty: 1, time: "11:00" },
];
```

Seeds server-renderizados (sin JS la sección muestra los 2 tickets: página completa y estática). El pedido del usuario: `name: "Vos"`, hora = ahora + 45 min redondeada al próximo cuarto, formato 24h `HH:MM` (se computa en el onClick — client-only, sin riesgo de hydration mismatch).

## El gesto (coreografía, director)

1. Tap **Pedir** → botón pasa a "✓ Pedido" 1.3s (disabled, lockout anti-spam).
2. **Chip viajero**: píldora ámbar (`×6`, text-noche, text-sm, rounded-full, aria-hidden, position fixed) nace en el rect del botón y viaja al rect del header "Pedidos de hoy" — `transform: translate(dx,dy) scale(0.7)`, `0.55s cubic-bezier(0.7, 0.02, 0.3, 1)` (el easing del viaje de la intro F3 — mismo lenguaje), fade 150ms al aterrizar. Mismo mecanismo FLIP de Intro.tsx (getBoundingClientRect de origen/destino). Funciona igual desktop (izq→der) y mobile (arriba→abajo).
3. Al aterrizar: se inserta el `<Ticket>` arriba de la lista con la **animación de impresión**.
4. `prefers-reduced-motion`: sin chip, sin impresión — el ticket aparece directo. Usar `useReducedMotion` del kit F3 (su primer consumidor).

## Subcomponentes (delegables, presentacionales puros)

### `app/components/mostrador/ProductCard.tsx`
Props: `{ name: string; qty: number; img: string; ordered: boolean; onOrder: (e: React.MouseEvent<HTMLButtonElement>) => void }`.
- Layout: flex items-center gap-4; foto 96×96 (`<Image>` de next/image, width/height 96, object-contain) con el drop-shadow de arriba; nombre (font-medium, noche) + meta `×{qty}` (sm, bruma); botón a la derecha.
- Botón: `bg-ambar text-noche rounded-full px-4 py-2 text-sm font-medium`, hover `bg-ambar/90`, focus-visible outline ámbar (patrón del sitio), `aria-label={"Pedir " + name}`. Con `ordered`: disabled, texto "✓ Pedido", `opacity-70 cursor-default`.
- Card: `rounded-xl bg-noche/[0.03] p-4` (eco de las cards de Dolores).

### `app/components/mostrador/Ticket.tsx`
Props: `{ name: string; product: string; qty: number; time: string; isNew: boolean; animateIn: boolean }`.
- `<li>`; papelito: fondo hueso, texto noche, rounded-t-lg, px-4 pt-3 pb-2 + tira dentada inferior (clase `.px-ticket-teeth`, ver abajo).
- Línea 1: dot ámbar 1.5 (solo `isNew`) + nombre (font-semibold) + `ret. {time}` a la derecha (text-bruma, text-sm, tabular-nums).
- Línea 2: `{product} ×{qty}` (text-sm, text-noche/80).
- **Impresión** (`animateIn`): patrón grid-rows — wrapper `display:grid` con `gridTemplateRows: '0fr'` → `'1fr'` + inner `overflow:hidden` `translateY(-8px)→0` + `opacity 0→1`, `transition 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)` (easing de reveals F3). Al montar con `animateIn` (y sin reduced-motion): arrancar colapsado y expandir en el frame siguiente (requestAnimationFrame, como Reveals). Seeds: `animateIn={false}` (montan estáticos).

### `.px-ticket-teeth` (globals.css, junto al motion kit)
Tira de 8px con triángulos hueso apuntando hacia abajo (papel cortado):
```css
.px-ticket-teeth {
  height: 8px;
  background:
    linear-gradient(45deg, #F6EFE1 4px, transparent 0) 0 0 / 8px 8px repeat-x,
    linear-gradient(-45deg, #F6EFE1 4px, transparent 0) 4px 0 / 8px 8px repeat-x;
}
```

## A11y

- Lista con `aria-live="polite"` (el pedido nuevo se anuncia); chip viajero `aria-hidden`.
- Botones con aria-label específico; foco visible en todo; contraste: ticket hueso/noche AA, labels bruma sobre noche solo en tamaños ≥ sm como ya hace CtaFooter.

## Verificación (igual F3)

`bun run build` + tsc + eslint verdes. Playwright contra build de producción: gesto completo (click Pedir → chip → ticket impreso, contador +1), cap de lista, reduced-motion (sin chip, ticket directo), screenshots desktop/mobile, video del gesto → GIF. Artefactos a `docs/gate-f4/` + reporte. Push de la rama `f4-mostrador` (apilada sobre f3-motion) — JAMÁS main.
