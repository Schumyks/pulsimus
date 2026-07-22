## ADDED Requirements

### Requirement: Toda escena corre sobre el motor único de scroll
Toda escena scroll SHALL construirse sobre `scrollEngine.ts` (Lenis singleton + ScrollTrigger): sin instancias propias de Lenis, sin listeners de scroll paralelos, `useGSAP` con `scope` (nunca `useEffect` plano) y `gsap.matchMedia()` para los gates desktop / mobile / reduced-motion.

#### Scenario: Escena montada y desmontada sin residuos
- **WHEN** una escena se monta y luego se desmonta (navegación, resize a un breakpoint sin escena, strict mode)
- **THEN** todos sus ScrollTriggers, tweens y listeners quedan destruidos y el conteo de Lenis vuelve al valor previo

### Requirement: Umbral variable con pin y scrub lineal
Cada escena SHALL definir su duración de scroll (`end`) según su peso narrativo (escena clave ≈ 200–300%, transición breve ≈ 60–100%) y usar `scrub` con `ease: 'none'`; nunca scrub largo sin pin.

#### Scenario: Scrub determinista en cualquier posición
- **WHEN** el usuario scrollea lento, rápido, hacia atrás, o salta a una posición arbitraria
- **THEN** la escena pinta el estado correcto de su progreso sin saltos, teletransportes ni estados residuales

### Requirement: Transiciones dirigidas escena↔sección
La entrada y la salida de cada escena SHALL estar coreografiadas contra su sección vecina (nunca corte seco dentro de un capítulo); entre bloques mayores SHALL permitirse un umbral breve con identidad como corte legítimo.

#### Scenario: Entrada desde la sección anterior
- **WHEN** el scroll cruza el límite entre una sección y la escena siguiente
- **THEN** hay una transición dirigida (reveal, zoom, tween de mood) y ningún elemento aparece o desaparece sin interpolación

### Requirement: Loops gateados por visibilidad y presupuesto por viewport
Todo loop por-frame (canvas, partículas, idles) SHALL estar gateado por un booleano de visibilidad que ScrollTrigger enciende y apaga, y cada viewport SHALL respetar el presupuesto de máximo 2 elementos decorativos animándose, transform/opacity only.

#### Scenario: Escena fuera del viewport
- **WHEN** una escena queda completamente fuera del viewport
- **THEN** sus loops no ejecutan cálculo ni pintado por frame

### Requirement: Reduced-motion y mobile resueltos por escena
Con `prefers-reduced-motion: reduce` la página SHALL ser continua y estática: cada escena en su pose final, sin pin, sin parallax, sin autoplay. En mobile cada escena SHALL existir con la misma narrativa, en la forma que su boceto defina.

#### Scenario: Usuario con reduced-motion
- **WHEN** un visitante con reduced-motion recorre el sitio completo
- **THEN** ve todo el contenido y el estado final de cada escena, sin animación ni scroll-jacking, y ninguna interacción es requisito para avanzar

### Requirement: Mood cromático por escena
El sistema SHALL exponer un mecanismo de mood por escena (tween de custom properties disparado por data-attributes en onEnter/onLeaveBack) donde la luz ámbar (#F2A63E) queda reservada como recompensa narrativa.

#### Scenario: Cruce de frontera entre escenas con moods distintos
- **WHEN** el scroll entra a una escena con mood declarado y luego vuelve atrás
- **THEN** las custom properties tweenean al mood nuevo en la entrada y restauran el previo en la reversa
