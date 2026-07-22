## ADDED Requirements

### Requirement: Ciclo de producción con gates HITL por escena
Cada escena SHALL producirse en orden narrativo (E0→E7) con el ciclo: boceto de dirección (poses entrada/durante/salida, tamaño de umbral, destino de la sección afectada, forma mobile/reduced) → gate de Alan sobre el boceto → build → verificación Playwright sobre build de prod (desktop 1440, mobile 375, reduced-motion; scroll con wheel por pasos además de scrollTo) → gate visual de Alan → commit. El working tree SHALL acumular a lo sumo una pieza en revisión.

#### Scenario: Boceto rechazado
- **WHEN** Alan rechaza o corrige el boceto de una escena
- **THEN** no se escribe código de esa escena hasta re-gatear el boceto corregido

### Requirement: E0 — la intro cuenta la escena 0
La intro SHALL contar la escena 0 del guión con la física correcta de una muerte estelar (dirección Alan 22/07): la estrella del sistema YA EXISTE desde el primer cuadro, se desestabiliza, colapsa hacia adentro (succionando la tienda del protagonista), se comprime y rebota en la explosión — SIN fase de acreción-nacimiento. La explosión existente (aprobada) SHALL reutilizarse adaptada, el escape con el mostrador SHALL preceder al estallido, y la nebulosa remanente SHALL persistir como fondo del sitio (handoff al cielo Z1) en vez de desvanecerse con el overlay. Los gates vigentes SHALL mantenerse: 1×/sesión, skip por click/tecla, `?intro` para replay, reduced-motion la omite revelando el hero.

#### Scenario: Primera visita
- **WHEN** un visitante nuevo carga el sitio sin reduced-motion
- **THEN** ve la escena 0 completa (tienda bajo su estrella → desestabilización y colapso → escape → supernova → wordmark) y al terminar se revela el hero con la nebulosa remanente persistiendo en el cielo del sitio

#### Scenario: Skip inmediato
- **WHEN** el visitante clickea o presiona Enter/Espacio/Escape durante la intro
- **THEN** la intro termina de inmediato y el hero queda revelado y funcional

### Requirement: E1 — el radar reencuadra el Hero
El Hero SHALL conservar promesa y CTA; la transición Hero→Dolores SHALL ser el zoom al punto del radar (aparición 2/4 del leitmotiv EKG) como un timeline continuo con labels.

#### Scenario: Scroll del hero hacia dolores
- **WHEN** el scroll avanza del Hero hacia Dolores
- **THEN** el zoom del radar interpola de forma continua y la promesa/CTA permanecen legibles hasta salir de su banda

### Requirement: E2 — el cinturón fusiona la sección Dolores
La sección Dolores SHALL transformarse en el campo de asteroides: cada card deviene una roca con su nombre tallado (copy vigente de `Dolores.tsx`, texto en DOM real legible) vía morph por cambio de clase con delays escalonados. El visitante SHALL poder destruir asteroides (point & click / tap) como interacción narrativa, con fallback de igual peso: teclado (focus + Enter), mobile (tap) y reduced-motion (sin interacción requerida), con tutorial just-in-time y sin atrapar jamás el foco.

#### Scenario: Destruir un asteroide con el mouse
- **WHEN** el visitante clickea un asteroide
- **THEN** el asteroide se destruye con su recompensa visual y el progreso de la escena lo registra

#### Scenario: Visitante solo-teclado
- **WHEN** un visitante navega la escena con Tab y Enter
- **THEN** puede destruir cada asteroide enfocable y avanzar la escena con el mismo resultado que con mouse

#### Scenario: Reduced-motion
- **WHEN** un visitante con reduced-motion llega a la sección
- **THEN** ve las rocas en estado final con su copy legible y el avance no depende de ninguna interacción

### Requirement: E3 — el descenso y aterrizaje
Una escena nueva (pre-Mostrador) SHALL contar el descenso completo del protagonista CON su nave: primero las capas altas de la atmósfera, después las nubes flat regeneradas (canon vigente) con parallax por capas, y el aterrizaje sobre el planeta. La transformación de la tienda (E4) SHALL arrancar recién después de tocar tierra.

#### Scenario: Descenso completo con el scroll
- **WHEN** el scroll cruza la banda del aterrizaje
- **THEN** la nave desciende atravesando atmósfera y nubes de forma continua y la escena resuelve con el aterrizaje que da pie al Mostrador

### Requirement: E4 — la tienda dollhouse representa el ciclo de pedido
El Mostrador SHALL transformarse en la tienda isométrica de tres planos (fuera/dentro/detrás) donde el ciclo de pedido se representa EN escena: el alien hace el pedido y el dueño lo recibe, narrado por beats del timeline con doble pista de texto. Esto SHALL superseder el demo standalone La Espiga.

#### Scenario: El ciclo completo en scroll
- **WHEN** el scroll recorre la banda del Mostrador
- **THEN** la tienda se transforma (cartel se endereza y enciende, vitrina se ilumina) y el pedido del alien llega al dueño, con los tres planos legibles

### Requirement: E5 — órbitas espejadas en Proceso
La sección Proceso SHALL partirse en mitades espejadas (arriba: cuerpos entrando en órbita; abajo: la tienda construyéndose por fases) sincronizadas fase a fase, rematando en la primera órbita capturada (el primer cliente que vuelve) seguida de un beat de crecimiento: más objetos SHALL entrar en órbita, transmitiendo crecimiento más allá de un solo cliente.

#### Scenario: Avance por fases
- **WHEN** el scroll avanza una fase del proceso
- **THEN** cielo y tierra avanzan su beat correspondiente en espejo

#### Scenario: Beat de crecimiento
- **WHEN** el scroll pasa la fase de la primera órbita capturada
- **THEN** entran progresivamente más objetos en órbita alrededor del planeta/negocio

### Requirement: E6 — mission control reencuadra el Tablero
El Tablero SHALL conservar su maquinaria funcional (paneles, toggle, eco Reservas→mostrador) y ganar el envoltorio narrativo caos→orden: el escritorio desaturado que recupera color al ordenarse, con el pulso regular en pantalla (EKG 3/4). La escena SHALL ser levemente interactiva: el visitante ejecuta un par de acciones narrativizadas en el panel que hacen avanzar visiblemente el proceso en la tienda, y el panel SHALL reservar el lugar del switch de skins (build en BL-16). La interacción SHALL tener fallback de igual peso (teclado/mobile/reduced) y no bloquear el avance.

#### Scenario: Caos a orden
- **WHEN** el scroll entra a la banda del Tablero
- **THEN** el desorden inicial transiciona al tablero ordenado sin romper la interactividad existente de los paneles

#### Scenario: Acción del visitante avanza el proceso
- **WHEN** el visitante ejecuta una acción del panel (click/tap/teclado)
- **THEN** el proceso de la tienda avanza de forma visible y coherente con la narrativa

#### Scenario: Visitante que no interactúa
- **WHEN** el visitante scrollea la escena sin tocar el panel
- **THEN** puede seguir avanzando por el sitio sin quedar bloqueado

### Requirement: E7 — la señal reencuadra el CTA
El CTA SHALL reencuadrarse como consola de transmisión ("mandá tu señal") manteniendo los campos existentes del form, con el último latido ascendiendo a estrella (EKG 4/4).

#### Scenario: Llegada al cierre
- **WHEN** el visitante llega al final del viaje
- **THEN** ve su tienda latiendo en el mapa, el form como consola de señal y el leitmotiv EKG cerrando en la estrella del logo
