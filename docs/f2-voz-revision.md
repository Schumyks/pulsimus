# F2 · Revisión de voz y reestructura de Dolores (2026-07-04)

> Decisiones de copy/voz cerradas con Alan DESPUÉS de ver la F2 deployada.
> **NADA está implementado todavía** — la F2 en `pulsimus.vercel.app` tiene el copy VIEJO. La próxima sesión escribe esto en los componentes.
> Este documento **supersede** el copy de las secciones correspondientes en [`f2-section-specs.md`](f2-section-specs.md).

## Principios de voz (nuevos, permanentes)

- **Sin em dashes (—).** Tell de IA. Regla permanente en todo el copy. Reemplazar por punto, coma o dos puntos.
- **Voz de Alan**: directa, oraciones cortas, sin metáforas de agencia. Ortografía perfecta (no replicar los descuidos de tildes del chat).
- **Hilo de marca (pulso/corazón)**: el dolor "pulsa despacio", la promesa "late fuerte / corazón sano".
- **Regla de dosificación**: la metáfora del corazón va SOLO en los momentos altos (hook, remate). Los pasos del proceso van CONCRETOS, en idioma de mostrador. El corazón envuelve; los pasos entregan.
- **Persona HÍBRIDA**: "nosotros" para el trabajo (*armamos, construimos*); "yo, Alan" para el trato (*te muestro, te respondo, te leo yo*). Firma con nombre propio.

## Title / hook

`Pulsimus · El corazón digital de tu negocio`

## Hero

Sin cambios confirmados respecto a la spec original (titular/eyebrow/subtítulo del brief). *(Pendiente: Alan puede querer revisar el titular del Hero; no confirmado.)*

## Dolores — REESTRUCTURA MAYOR

**Título de sección**: `Instagram es tu vidriera, no tu mostrador.`
→ **DECISIÓN ABIERTA**: nombrar "Instagram" explícito vs "las redes" genérico (ver al final).

**Arquitectura**: RAÍZ destacada (statement ancho) + 3 cards antes/después.

**Raíz (statement destacado, ancho):**
- Dolor (voz dueño): `Sin las redes hoy no existo. Todo pasa por ahí. Y gestionarlo entero es difícil y lleva mucho tiempo.`
- Respuesta (Pulsimus): `Instagram es tu vidriera. Te damos el mostrador: los dos lados.`

**3 cards, cada una ANTES/DESPUÉS con PESO EQUILIBRADO:**
- Bloque **HOY** (dolor, voz dueño)
- **DIVISOR = el pulso**, línea horizontal ancha (NO inline). Se anima en F3: el latido recorre la línea; el "antes" late despacio, el "después" late fuerte.
- Bloque **CON PULSIMUS** (después, mismo tamaño visual que el dolor)
- Sello

| Card | HOY (voz dueño) | CON PULSIMUS | Sello |
|---|---|---|---|
| **Catálogo** (lado cliente) | "Publico los productos de a uno y no tengo el catálogo completo en una sola pantalla." | Todo tu catálogo en una página, siempre al día. El cliente ve todo junto y elige. | CATÁLOGO A LA VISTA |
| **Pedidos** (lado cliente) | "Me escribe mucha gente y no siempre son pedidos. Se me traspapelan los chats y pierdo ventas." | El pedido entra por un solo lugar y te cae ordenado. Lo importante no se mezcla con la consulta. | PEDIDOS ORDENADOS |
| **Stock** (lado dueño) | "No llevo bien el stock. No sé qué me queda ni qué se vende más." | Ves tu stock de un vistazo. Lo que se vende, se descuenta solo. | STOCK AL DÍA |

- La card **Stock** es el "lado de adentro" del mostrador → conecta con el `Sistema de gestión` del checkbox del form.
- **Sacado**: el dolor de la seña/booking (Candela). Trade-off: se pierde el gancho "seña automática mata no-shows"; queda cubierto por el paraguas de Instagram. Recuperable si se quiere un ejemplo de booking.

**Origen de los dolores (integridad):** basados en research REAL documentado por cliente (La Bristol *"team of 10"*; Facha Gaucha WooCommerce pagada y abandonada + catálogo disperso; A Matcha Space productos sin venta online). Las frases son composiciones (la landing no cita clientes por nombre). El "cuaderno" y la "doble carga" de la versión original eran inventados/genéricos → corregidos.

## Proceso

- Bajada: `Sin vueltas y en tu idioma.`
- **01 · Diagnóstico gratis**: `Nos juntamos 20 minutos por videollamada. Desde el navegador, sin instalar nada. Ya sabés por dónde se te escapa la plata; yo te muestro cómo cerrar la canilla. Sin compromiso.`
  *(insight de Alan: el cliente YA sabe dónde pierde; el valor está en el CÓMO.)*
- **02 · Propuesta**: `Te armamos un plan concreto: qué se hace, qué ganás y cuánto sale. Fácil, bien estructurado y bajado a tierra.`
- **03 · Construcción**: `Te construimos la web desde cero, cuidando cada detalle. Vos ves los avances. Sale cuando tenga que salir.`
  *("web" se queda — categoría ancla; NO "herramienta".)*
- **Remate (corazón)**: `Un corazón sano late fuerte. Que el de tu negocio no pierda ni un latido: ni un pedido, ni un turno, ni un cliente.`
- **Objeción "es caro"** (migró desde Dolores): responder en el Proceso → `¿Pensás que una web es cara? El diagnóstico es gratis y te digo exactamente cuánto sale. Sin sorpresas.` *(ubicación exacta a definir: junto al paso 01 o como línea puente.)*

## CTA + Footer

- Bajada CTA: `Contame qué se te complica y lo ordenamos.`
- Firma: `Sin spam. Te leo y escucho yo, Alan.`
- Form: **nuevo campo checkbox** `¿Qué necesitás?` → `Una web` / `Un sistema de gestión` / `No sé, ayudame a decidir`.
- **Card gris vacía del contacto**: rellenarla con el panel del booking (título + promesa + botón). Pendiente desde la implementación original de F2.

## DECISIÓN RESUELTA (2026-07-04): Instagram vs "las redes" → HÍBRIDO

Alan delegó la resolución. Se implementó la recomendación del director, que el copy de este doc ya encarnaba:
- **"Instagram" en la línea-firma** (título de sección y respuesta raíz): su fuerza es la concreción; los 4 leads reales viven ahí.
- **"las redes" en el statement raíz** (voz dueño): es como habla un dueño de verdad y no encajona (TikTok/FB).

Contexto de la decisión original:
- **PRO Instagram**: concreto, reconocible, donde están los 4 leads reales; la línea "Instagram es tu vidriera, no tu mostrador" pega fuerte JUSTAMENTE por ser concreta.
- **CON Instagram**: encajona (¿y TikTok/FB?), nombra marca de tercero, puede envejecer.

## Estado de implementación (actualizado 2026-07-04)

**TODO implementado en código** (working tree, SIN pushear — gate: OK de Alan):
1. ✅ `Dolores.tsx`: reestructura mayor (raíz destacada + 3 cards antes/después + divisor de pulso SVG estático, listo para animar en F3).
2. ✅ `Proceso.tsx`: bajada, 3 pasos nuevos, objeción "es caro" y remate del corazón.
   - **Decisión de esta sesión**: la objeción va como **línea puente** entre los pasos y el remate (no dentro del paso 01, que ya quedaba cargado).
3. ✅ `CtaFooter.tsx`: bajada, firma "yo, Alan", checkbox `¿Qué necesitás?` (entre "Tu negocio" y "¿Qué te duele?"), panel de booking en la card gris.
   - **Copy NUEVO del panel booking (no estaba cerrado en este doc, pendiente de OK)**: título `Diagnóstico gratis, 20 minutos` + promesa `Por videollamada, desde el navegador. Te vas con ideas concretas para tu negocio, me contrates o no.` + botón `Agendá tu diagnóstico gratis` (placeholder `#contacto` hasta que F5 cablee el booking real).
4. ✅ `layout.tsx`: title `Pulsimus · El corazón digital de tu negocio`.
5. ✅ `f2-section-specs.md`: banner SUPERSEDED apuntando acá.
6. ✅ Build de prod limpio + screenshots desktop 1440 / mobile 375 (0 errores de consola).
7. ⏸️ **NO tocado**: Hero (sin cambios confirmados) y tagline del footer (`El pulso de tu negocio`; ¿alinearlo al nuevo hook "corazón digital"? → decisión menor pendiente).

Backlog (ya registrado): `audio` (nota de voz) en el form como feature post-v1 → evaluar en F5.
