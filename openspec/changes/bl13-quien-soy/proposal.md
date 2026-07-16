# Proposal: Sección "Quién está del otro lado" (BL-13)

## Why

La auditoría de conversión del 14/07 (contra 22 competidores en 3 mercados) encontró que la landing en producción no tiene NINGUNA prueba: ni casos, ni números, ni humano. La prueba humana es el arma estándar del mercado, y para una agencia unipersonal el "quién" ES parte de la prueba. El form ya firma "Te leo y escucho yo, Alan" — una firma sin cara ni historia detrás. Pedido directo de Alan (14/07): "al final del sitio firmo yo. QUIÉN ES ALAN es algo que falta."

El refinamiento con Alan (16/07, dos rondas: toki + chat) convirtió la sección en una pieza mayor: no un texto con foto sino una **pieza scrollytelling que demuestra sus capacidades ejecutando** — la tercera pieza firma de la landing, hermana del mostrador y el tablero.

Fuente contractual: `docs/backlog.md` § TAREA-CONTRATO BL-13 (cerrada con Alan 16/07).

## What Changes

- **Nueva sección `#quien-soy`** entre Proceso y `#contacto`: 5 estaciones que ocupan el viewport completo — Intro (foto real + LinkedIn) · panel Diseño · panel Construcción · panel Calidad · Remate (credo) — que desemboca en el form.
- **Coreografía de scroll**: en desktop la sección se ancla y las estaciones transicionan con animaciones cuidadas al scrollear. Mobile y `prefers-reduced-motion` ven las estaciones apiladas (todas full-viewport, sin ancla).
- **Demo del panel Construcción**: fichas de necesidad en idioma de mostrador; al tocar una, la mini-web del panel se arma ante los ojos con esa forma ("te escucho y te construyo a medida").
- **Demo del panel Calidad**: comparación interactiva "sin alma / con alma" — la misma pieza como plantilla genérica inerte vs. con feedback y cuidado en cada detalle ("la calidad es la experiencia").
- **Panel Diseño**: pitch de diseño de marca (branding desde cero, manual de uso de marca) + el gancho del selector de skins. El reskin completo de la página (BL-16) y la galería de marcas (BL-14) NO entran en este cambio — llegan como cambio propio posterior; este cambio deja el lugar preparado.
- **Copy nuevo** en la voz de Alan (muestra de voz 16/07 + frases aprobadas), bajo las prohibiciones del contrato.

## Non-goals

- Skins completos de página y galería/manual de marca (cambio futuro `bl16-skins`, gateado por las direcciones estéticas de Alan).
- Versión EN, timeline/CV, logos de empleadores, link a GitHub, menciones de Disney o geografía, sonido.

## Capabilities

### New Capabilities

- `seccion-quien-soy`: la pieza completa — estructura de 5 estaciones, coreografía de scroll con sus fallbacks, los dos demos interactivos y las reglas de copy/accesibilidad/performance que la gobiernan.

## Impact

- `app/components/` (componentes nuevos de la sección + demos), `app/page.tsx` (integración), `app/globals.css` (keyframes/tokens de la coreografía), `public/` (foto de Alan tratada).
- Sin cambios de datos ni de infraestructura. Sin impacto en las secciones existentes salvo el orden del flujo (Proceso → quien-soy → contacto).
- Entrega en 2 pasos con gate de Alan cada uno: P1 estructura apilada + copy real (shippeable) → P2 coreografía + demos interactivos.
