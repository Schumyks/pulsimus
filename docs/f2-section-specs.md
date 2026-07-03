# F2 · Specs de secciones (fan-out de 4 subagentes)

> Escritas por el director. Cada subagente construye **una** sección y toca **un solo archivo**.
> El copy es **final**: se pega tal cual, palabra por palabra. No lo reescribas, no lo "mejores", no lo traduzcas.
> Fuente del QUÉ: [`agency/landing-brief.md`](../../agency/landing-brief.md). Glosario y prohibiciones: [`CONTEXT.md`](../../CONTEXT.md).

---

## 0 · Contrato común (léelo antes de escribir código)

### 0.1 Antes de tocar nada
- **Leé los docs de Next 16 primero.** Este NO es el Next que conocés: `next@16.2.10`, `react@19.2.4`. La guía está en `node_modules/next/dist/docs/01-app/`. Leé lo relevante a componentes y estructura del App Router antes de escribir. Respetá los avisos de deprecación.
- Estás dentro del repo `pulsimus/` (git propio). No toques nada fuera de tu archivo asignado.

### 0.2 Stack y reglas duras
- **Next 16 App Router + React 19 + Tailwind v4** (`@theme inline` en `app/globals.css`).
- **Server Components por defecto.** Ninguna sección de F2 lleva `"use client"`, estado ni efectos. F2 es estático.
- **Sin motion.** Nada de animaciones, transiciones de scroll ni JS de interacción — eso es F3/F4. Podés usar `hover:` de Tailwind para estados de botón/link (color/opacidad), nada más.
- **Sin backend.** Ningún `fetch`, ningún `mailto:`, ninguna `action` real. Los CTA apuntan a anclas internas (`#contacto`). El formulario es **cáscara visual** (F5 lo cablea).
- **No toques** `app/layout.tsx`, `app/globals.css`, `app/page.tsx` ni ningún archivo de otro subagente. El director integra y arma el `<header>`/nav.

### 0.3 Archivos (uno por subagente)
Creá tu componente en `app/components/`. Export default, nombre del componente = nombre del archivo.

| Subagente | Archivo a crear | Componente |
|---|---|---|
| A | `app/components/Hero.tsx` | `Hero` |
| B | `app/components/Dolores.tsx` | `Dolores` |
| C | `app/components/Proceso.tsx` | `Proceso` |
| D | `app/components/CtaFooter.tsx` | `CtaFooter` (incluye la sección CTA final **y** el `<footer>`) |

Cada componente rinde una `<section>` autónoma (D rinde `<section>` + `<footer>`) que se pueda soltar en cualquier orden. **No** envuelvas en `<main>` ni `<html>` — eso es del director. **No** importes a los demás.

### 0.4 Sistema visual (del brand guide "Faro Ámbar", congelado — no inventar)
Tokens ya cableados en `globals.css`, disponibles como utilities Tailwind:

| Token | Hex | Utilities | Rol (regla 60/30/7/3) |
|---|---|---|---|
| `hueso` | `#F6EFE1` | `bg-hueso` `text-hueso` | **60%** — base/fondo por defecto |
| `noche` | `#1B2140` | `bg-noche` `text-noche` | **30%** — texto sobre hueso; fondo de secciones de contraste |
| `ambar` | `#F2A63E` | `bg-ambar` `text-ambar` `border-ambar` | **7%** — **acento** (botón primario, líneas, subrayados). **JAMÁS fondo extenso.** |
| `bruma` | `#6A719E` | `text-bruma` `bg-bruma` | **3%** — texto secundario, eyebrows, detalles |

- **Tipografía: Outfit** (`font-sans`, ya global). Pesos disponibles: **400** (`font-normal`), **500** (`font-medium`), **600** (`font-semibold`). No hay más — no uses `font-bold`/700.
- **Wordmark**: Outfit 600, `tracking-[0.22em]`, mayúsculas.
- **Escala de tipo intencional** (no “todo text-base”): titulares grandes 600, subtítulos 400 en `bruma` o `noche/80`, eyebrows chicos en `bruma` con `tracking-[0.2em]` mayúsculas, cuerpo 400. Buscá jerarquía clara, mucho aire, ritmo vertical generoso.
- Contenedor recomendado: `mx-auto max-w-6xl px-6` (ajustá `max-w` por sección si hace falta). Padding vertical de sección generoso, p. ej. `py-24 md:py-32`.

### 0.5 Copy — reglas innegociables (glosario `CONTEXT.md`)
Voz de marca: **español rioplatense, voseo, idioma de mostrador.** El copy de abajo es final.
- **PROHIBIDO** en cualquier texto visible: “agencia técnica”, “automatizaciones”, “automatización”, “infraestructura de conversión”, “UX”, “funnel”, “lead magnet”, “pyme/PYME”, “case study”, “stack”, y **cualquier nombre de tecnología** (Next.js, Supabase, etc.).
- La categoría se dice simple (“agencia web para negocios de barrio”); la promesa se dice como **dolor** (“los pedidos que se te escapan por WhatsApp”), nunca en jerga.

### 0.6 Piso de calidad (es la credencial — no negociable)
- **Responsive** hasta mobile chico (360px). Mobile-first: layout de una columna que crece a grilla en `md:`/`lg:`.
- **Contraste AA**: ámbar es acento, no texto chico sobre hueso. Texto largo en `noche` sobre `hueso`, o `hueso` sobre `noche`.
- **Foco de teclado visible** en todo link/botón/campo: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar` (o equivalente).
- **HTML semántico**: `<section>` con `aria-labelledby` apuntando al `id` de su encabezado; jerarquía de headings correcta (la sección arranca en `<h2>`, salvo el Hero que lleva el único `<h1>`); botones que navegan son `<a>`, no `<button>`.
- Nada de imágenes por ahora: donde el diseño pida una foto/ilustración, dejá un placeholder sobrio (`bg-noche/5 rounded-2xl` con un rótulo en `bruma`), nunca una URL externa.

### 0.7 Cómo integra el director (para que encajes)
El director arma `app/page.tsx` en este orden: `Hero → Dolores → [hueco: El mostrador (F4)] → Proceso → [hueco: Ejemplos (F5, oculto)] → CtaFooter`. Rendí tu sección sin asumir qué hay antes o después salvo por los `id` de ancla (§ por sección). El header/nav sticky lo arma el director; asumí que hay ~72px de barra arriba (no agregues `<header>`).

---

## A · Hero  → `app/components/Hero.tsx`

**Trabajo**: en 3 segundos, decir la categoría y prometer el alivio del dolor. Es la tesis de la página. Fondo `hueso`. Contiene el único `<h1>`.

**Estructura**: `<section id="inicio" aria-labelledby="hero-title">`. Eyebrow → `<h1>` → subtítulo → fila de dos CTA. Composición con mucho aire; el titular es la estrella (grande, 600, `noche`). El ámbar aparece SOLO como acento (subrayado/línea o el fondo del botón primario).

**Copy final** (exacto):
- Eyebrow (mayúsculas, `bruma`, tracking amplio): `AGENCIA WEB PARA NEGOCIOS DE BARRIO`
- `<h1>` (dos líneas; podés separarlas con `<br/>` o dos `<span>` en bloque):
  `Tu negocio ya tiene su ritmo.`
  `Nosotros hacemos que lo digital le siga el pulso.`
- Subtítulo (400, `noche/80` o `bruma`): `Webs donde tus clientes piden fácil y vos ves todo ordenado.`
- CTA primario (`<a href="#contacto">`, `bg-ambar text-noche`, sólido): `Agendá tu diagnóstico gratis`
- CTA secundario (`<a href="#contacto">`, estilo texto/borde discreto, `text-noche`): `Contame tu caso`

**Detalle intencional** (una sola, quiet): que la palabra “pulso” del titular lleve el único acento ámbar del bloque de texto (p. ej. un subrayado fino ámbar o el color ámbar solo en esa palabra). Un gesto, no más.

**Responsive**: titular baja de tamaño en mobile pero mantiene 2 líneas; CTAs pasan a full-width apilados en `<sm`.

**Aceptación**: `<h1>` único · categoría textual presente · subtítulo = promesa (no lista de servicios) · ámbar solo acento · ambos CTA anclan a `#contacto` · foco visible.

---

## B · Dolores  → `app/components/Dolores.tsx`

**Trabajo**: 4 dolores en **primera persona del dueño** (voz de mostrador), cada uno respondido por una **etiqueta-solución sin jerga**. NO es una secuencia → **no numeres** las cards. El device es el par *“esto me pasa” → “esto lo ordena”*.

**Estructura**: `<section id="dolores" aria-labelledby="dolores-title">`. Encabezado de sección (`<h2>` + bajada corta) y una grilla de 4 cards. Grilla: 1 col mobile → 2 cols en `md:`. Cada card: la frase del dueño (protagonista, `noche`, 500) + la etiqueta-solución (chip/eyebrow chico en `bruma` o con un punto ámbar). Cards sobrias: `bg-hueso` con borde `border-noche/10 rounded-2xl`, o bloque `bg-noche/[0.03]`. El ámbar, si aparece, como micro-acento (un punto/guion antes de la etiqueta), nunca como fondo de card.

**Copy final** (exacto):

Encabezado:
- `<h2>`: `Lo que hoy hacés a mano`
- Bajada (`bruma`, 400): `Tu negocio funciona. Lo que se rompe es el paso del “me interesa” al “listo, es tuyo” — y hoy lo cargás vos, mensaje por mensaje.`

Card 1
- Dueño: `“Me llegan pedidos por WhatsApp a toda hora y, entre mensaje y mensaje, siempre se me escapa alguno.”`
- Etiqueta-solución: `PEDIDOS ORDENADOS`

Card 2
- Dueño: `“Los turnos los anoto en un cuaderno y la seña me la mandan por Revolut cuando se acuerdan.”`
- Etiqueta-solución: `AGENDA CON SEÑA`

Card 3
- Dueño: `“Cargo los mismos datos dos veces: una en el chat y otra cuando lo paso a mi lista.”`
- Etiqueta-solución: `CERO DOBLE CARGA`

Card 4
- Dueño: `“Tengo el Instagram lindo, pero para comprar el cliente tiene que preguntarme todo por privado.”`
- Etiqueta-solución: `DEL POSTEO AL PEDIDO`

**Responsive**: 1 col → 2 cols en `md:`. Las 4 frases marcan la altura; alineá las etiquetas al pie de cada card para que el borde inferior quede parejo.

**Aceptación**: 4 cards, primera persona en voseo · etiquetas sin jerga (ninguna palabra prohibida) · **sin numeración** · ámbar solo micro-acento · foco N/A (no interactiva) pero contraste AA.

---

## C · Proceso  → `app/components/Proceso.tsx`

**Trabajo**: 3 pasos, en orden real → **acá SÍ el numerado 01 / 02 / 03 está justificado** (es una secuencia verdadera). El paso 01 enlaza al booking.

**Estructura**: `<section id="proceso" aria-labelledby="proceso-title">`. Encabezado (`<h2>` + bajada) y 3 pasos. Layout: 3 columnas en `lg:`, apiladas en mobile. Cada paso: número grande `01/02/03` (Outfit 600, en `ambar` o `noche/30` como marca estructural — elegí uno y sé consistente), título del paso (`noche`, 600), descripción (400, `noche/80`). Dejá pensada la línea horizontal/vertical que conecta los pasos como marca de secuencia (regla fina `border-noche/15` o de puntos), **sin animarla** — la “línea de pulso scroll-driven” es F3; acá solo la línea estática.

**Copy final** (exacto):

Encabezado:
- `<h2>`: `Cómo trabajamos`
- Bajada (`bruma`, 400): `Sin vueltas y en tu idioma. Del primer café a tu web andando.`

Paso 01 — el número/título envuelto en `<a href="#contacto">` (enlaza al booking):
- Rótulo: `01`
- Título: `Diagnóstico gratis`
- Descripción: `Nos sentamos 20 minutos por videollamada —desde el navegador, sin instalar nada— y te muestro dónde se te está escapando la plata. Sin compromiso.`

Paso 02
- Rótulo: `02`
- Título: `Propuesta`
- Descripción: `Te llevo un plan concreto: qué se hace, qué gana tu negocio y cuánto sale. En idioma de mostrador, no técnico.`

Paso 03
- Rótulo: `03`
- Título: `Construcción`
- Descripción: `Diseñamos y construimos tu web de cero, cuidando cada detalle. Vos ves los avances; sale cuando está para salir.`

**Responsive**: 3 cols `lg:` → 1 col mobile; en mobile la conexión de secuencia pasa a vertical (o se omite, priorizá claridad).

**Aceptación**: exactamente 3 pasos numerados 01/02/03 · paso 01 es link a `#contacto` con foco visible · numeración justificada por secuencia real · línea de conexión estática (sin motion).

---

## D · CTA final + Footer  → `app/components/CtaFooter.tsx`

**Trabajo**: cerrar con la invitación (los dos CTA del brief §6) y el pie. Es el **cierre de contraste**: recomendado fondo `bg-noche` con texto `hueso` (que respira distinto al resto y hace de ancla `#contacto`). El formulario es **cáscara visual**: se ve completo y pulido, pero **no envía** (F5 lo cablea).

**Estructura**:
- `<section id="contacto" aria-labelledby="cta-title" class="bg-noche text-hueso">`: encabezado + promesa de latencia + dos caminos: (1) botón grande al booking, (2) el formulario cáscara.
- `<footer>`: wordmark + tagline + mail + copyright. Sobrio.

**Copy final** (exacto):

CTA:
- `<h2>`: `¿Arrancamos?`
- Bajada (`hueso/80`): `Contame qué te está costando y lo ordenamos juntos.`
- Promesa (chip/línea, `ambar` o `hueso/70`): `Te respondo en 48 horas con ideas concretas.`
- Botón primario (`<a href="#contacto">` por ahora — F5 lo apunta a Cal.com; `bg-ambar text-noche`): `Agendá tu diagnóstico gratis`
- Separador entre booking y form (texto `hueso/60`): `o contame tu caso y te escribo`

Formulario (cáscara, `<form>` sin `action`, sin `onSubmit`; inputs con `label` asociado por `htmlFor`/`id`; el botón es `type="button"` para que no envíe):
- Label + placeholder `Nombre`: `Tu nombre`
- Label + placeholder `Negocio`: `Tu negocio` (placeholder ej.: `panadería, peluquería, carnicería…`)
- Label `¿Qué te duele?` → `<textarea>` (placeholder: `Contame en una o dos líneas qué se te complica hoy`)
- Grupo de opción `¿Por dónde preferís que te responda?` con 3 opciones (radios estilizados o chips): `WhatsApp` · `Mail` · `Llamada`
- Botón de envío (`type="button"`, `bg-ambar text-noche`): `Enviar`
- Nota fina bajo el form (`hueso/50`): `Sin spam. Te leo yo.`

Footer:
- Wordmark: `PULSIMUS` (Outfit 600, `tracking-[0.22em]`)
- Tagline (`bruma` o `hueso/70`): `El pulso de tu negocio`
- Mail (link `<a href="mailto:hola@pulsimus.dk">`): `hola@pulsimus.dk`
- Copyright: `© 2026 Pulsimus`
- **Sin teléfono, sin otros canales.** No inventes redes ni número.

**Responsive**: en `md:` el booking y el form pueden ir lado a lado (2 cols); en mobile apilados, form abajo. Campos full-width en mobile.

**Aceptación**: `id="contacto"` presente (destino de todas las anclas) · form es cáscara: **no envía**, botón `type="button"`, sin `action`/`mailto` en el submit · cada input con label asociado y foco visible · mail real `hola@pulsimus.dk` en el footer · sin teléfono · contraste AA de `hueso` sobre `noche`.

---

## Resumen de anclas (para el director)
`#inicio` (Hero) · `#dolores` · `#proceso` · `#contacto` (CtaFooter, destino de todos los CTA).
