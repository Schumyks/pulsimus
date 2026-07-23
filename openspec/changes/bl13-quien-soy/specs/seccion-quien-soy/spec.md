# seccion-quien-soy — spec delta

## ADDED Requirements

### Requirement: Ubicación y desembocadura
La sección `#quien-soy` SHALL renderizarse entre la sección Proceso y `#contacto`, y su última estación SHALL desembocar visualmente en el form de contacto (sin CTA propio: el form es el siguiente contenido al soltar la sección).

#### Scenario: Flujo de página
- **GIVEN** la landing en producción
- **WHEN** un visitante scrollea desde Proceso hacia abajo
- **THEN** atraviesa las 5 estaciones de `#quien-soy` y lo siguiente que ve es `#contacto`

### Requirement: Cinco estaciones a viewport completo
La sección SHALL componerse de exactamente 5 estaciones — Intro, Diseño, Construcción, Calidad, Remate — y cada estación SHALL ocupar el viewport completo (`100vh`/`100dvh` según corresponda) en desktop y mobile.

#### Scenario: Una estación por pantalla
- **GIVEN** cualquier viewport entre 375×667 y 1920×1080
- **WHEN** una estación está activa/visible
- **THEN** su contenido entra completo en el viewport sin scroll interno ni overflow horizontal

### Requirement: Coreografía anclada en desktop
En desktop con motion habilitado, la sección SHALL anclarse al entrar al viewport y el scroll SHALL avanzar las estaciones con animaciones de transición; al pasar la última estación la sección SHALL soltar el ancla y devolver el scroll normal.

#### Scenario: Avance por scroll
- **GIVEN** desktop 1440×900 sin `prefers-reduced-motion`
- **WHEN** el visitante scrollea dentro de la sección
- **THEN** las estaciones transicionan en orden (1→5) con animación, y el scroll hacia arriba las recorre en reversa

#### Scenario: Liberación del ancla
- **GIVEN** la estación 5 (Remate) visible
- **WHEN** el visitante sigue scrolleando hacia abajo
- **THEN** la página continúa hacia `#contacto` sin quedar atrapada en la sección

### Requirement: Fallback apilado (mobile y reduced-motion)
En mobile y siempre que `prefers-reduced-motion` esté activo, la sección SHALL renderizar las 5 estaciones apiladas sin ancla, con los demos en su estado final. Ningún contenido SHALL quedar oculto ni requerir la coreografía para ser alcanzable.

#### Scenario: Reduced motion
- **GIVEN** `prefers-reduced-motion: reduce` en desktop
- **WHEN** el visitante recorre la sección
- **THEN** ve las 5 estaciones apiladas, sin animación de armado, con el demo de Calidad en "con alma" y sin autoplay de transiciones

#### Scenario: Mobile
- **GIVEN** un viewport 375×667
- **WHEN** el visitante scrollea la sección
- **THEN** las estaciones aparecen apiladas full-viewport con reveals suaves y los demos operables por tap

### Requirement: Estación Intro
La Intro SHALL mostrar la foto real de Alan (tratamiento estilo Faro Ámbar, provista y curada por Alan) a la izquierda, un ícono-link a su LinkedIn personal debajo de la foto, y la presentación corta aprobada. El copy NO SHALL mencionar empleadores, geografía ni contener los patrones prohibidos por contrato.

#### Scenario: Intro completa
- **GIVEN** la estación Intro visible
- **WHEN** se inspecciona su contenido
- **THEN** hay una foto con `alt` descriptivo, un link a LinkedIn que abre en pestaña nueva, y el texto de presentación aprobado por Alan

### Requirement: Panel Construcción — demo a medida
El panel Construcción SHALL ofrecer 2-3 fichas de necesidad en idioma de mostrador; al activar una, la mini-web del panel SHALL armarse con animación tomando la forma de esa necesidad; activar otra ficha SHALL rearmarla. Exactamente una ficha SHALL estar activa a la vez.

#### Scenario: Armado a medida
- **GIVEN** el panel Construcción activo con motion habilitado
- **WHEN** el visitante toca la ficha "doy turnos"
- **THEN** la mini-web se arma mostrando una agenda de turnos; al tocar "tomo pedidos por WhatsApp" se rearma como tienda con pedidos

#### Scenario: Estado inicial
- **GIVEN** el panel Construcción recién visible
- **WHEN** el visitante no tocó ninguna ficha
- **THEN** hay una ficha activa por defecto y la mini-web correspondiente ya armada (nunca un panel vacío)

### Requirement: Panel Calidad — demo "sin alma / con alma"
El panel Calidad SHALL mostrar la misma pieza en dos versiones conmutables — "sin alma" (plantilla genérica inerte) y "con alma" (feedback, animación y cuidado en cada detalle) — con "con alma" como estado inicial. El copy NO SHALL nombrar productos de terceros.

#### Scenario: Sentir la diferencia
- **GIVEN** el panel Calidad activo
- **WHEN** el visitante conmuta a "sin alma" y de vuelta
- **THEN** la versión sin alma no reacciona al hover/tap y la versión con alma responde en cada elemento, sin cambio de layout entre ambas

### Requirement: Panel Diseño — pitch y gancho de skins
El panel Diseño SHALL mostrar el titular aprobado ("Que tu web se vea como tu negocio merece."), el pitch de diseño de marca (branding desde cero, manual de uso de marca) y el lugar preparado para el selector de skins. El reskin funcional completo pertenece al cambio futuro `bl16-skins` y NO SHALL bloquear este cambio.

#### Scenario: Panel Diseño en este cambio
- **GIVEN** el panel Diseño activo
- **WHEN** se inspecciona su contenido
- **THEN** están el titular aprobado, el pitch de marca a la derecha y la zona del selector de skins presente sin ofrecer skins rotos ni promesas falsas

### Requirement: Estación Remate
El Remate SHALL presentar únicamente el credo aprobado — "Para mí, la calidad es algo que nace del corazón." — como momento alto tipográfico, sin otro contenido competidor.

#### Scenario: Remate limpio
- **GIVEN** la estación Remate visible
- **WHEN** se inspecciona su contenido
- **THEN** el credo es el único mensaje y la sección suelta el scroll hacia el form

### Requirement: Accesibilidad
La sección SHALL ser operable por teclado (fichas y toggle alcanzables y activables con Tab/Enter/Espacio), NO SHALL atrapar el foco ni el scroll de teclado, y los controles SHALL exponer estados `aria` correctos. El contraste SHALL respetar los tokens de la paleta.

#### Scenario: Navegación por teclado
- **GIVEN** un usuario navegando con Tab
- **WHEN** recorre la sección
- **THEN** alcanza LinkedIn, las fichas de Construcción y el toggle de Calidad, los activa con teclado, y puede salir de la sección sin quedar atrapado

### Requirement: Verificación sobre build de producción
Todo cierre de paso SHALL verificarse sobre build de PROD (`next build` + `next start`): cero errores de consola e hidratación, capturas desktop 1440 / mobile 375 / reduced-motion, y presupuesto de performance de la landing intacto (sin regresión de CLS/LCP perceptible ni FOUC).

#### Scenario: Gate de paso
- **GIVEN** un paso (P1 o P2) declarado terminado
- **WHEN** se corre la verificación Playwright sobre el build de prod
- **THEN** existen las capturas de los 3 modos, la consola está limpia y el reporte queda en `docs/quien-soy/evidencia/`
