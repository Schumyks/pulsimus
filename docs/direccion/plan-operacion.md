# Plan de operación — BL-17 Arquitectura de escenas

> **Estado: GATEADO por Alan (21/07, dos rondas) con dirección ampliada.** Este doc es la dirección escrita de TODA corrida sobre la landing — orden, criterios y gate por pieza, ANTES de tocar código. Nada se ejecuta sin su bloque aprobado acá.
> Jerarquía: [`bl17-guion-narrativo.md`](guion-narrativo.md) (QUÉ) → [`canon-assets-higgsfield.md`](canon-assets.md) (CÓMO visual) → skill `pulsimus-escenas` (CÓMO técnico) → **este doc (EN QUÉ ORDEN y con qué gates)**.

## Dirección de Alan (gate del 21/07 — manda sobre todo lo anterior)

- **Base de partida:** el sitio como estaba con la estrella siguiendo al cursor, pulso al click, reveal de cada sección al llegar — **sin nubes**. (Ejecutado en B0.)
- **Esto es un cambio de arquitectura, no una capa encima.** Supersede la decisión del 18/07 ("capa aditiva, no rebuild"): las secciones existentes se juzgan contra la nueva narrativa una por una.
- **Lo nuevo manda.** No fusionar con lo viejo por default — fusionar puede limitar lo nuevo a adaptarse a lo anterior. Prohibido el punto medio tibio: si una pieza vieja no sirve a la narrativa, se transforma o vuela.
- **Producción en ORDEN NARRATIVO:** se arranca por la escena que da inicio a la historia (E0), después el radar/hero (E1), luego el resto.
- **Destino por sección** (se afina en el boceto de cada escena): ver tabla de B2.

## Dirección de Alan (gate del 22/07 — boceto E0 + ajustes de escenas)

- **Boceto E0 aprobado en estructura** ([`bl17-boceto-e0.md`](../escenas/e0-supernova/boceto.md)): 4 actos, re-lectura del polvo como la tienda desarmándose. Abierto: canal de producción (canvas vs video, ver siguiente punto).
- **El clímax canvas SE ADAPTA, no se reusa verbatim (Alan, 22/07):** la animación actual cuenta un NACIMIENTO (acreción → estrella → explosión); la escena 0 es una MUERTE: la estrella ya existe, se desestabiliza, colapsa hacia adentro y rebota (física real verificada; el "inhale" actual ES el colapso y queda). Se reusa el sistema de partículas y la explosión (aprobada); se elimina la acreción-nacimiento. **La nebulosa remanente PERSISTE como fondo del sitio** (handoff al cielo Z1, lejos del planeta) — "destruye y siembra", literal.
- **Pipeline de VIDEO entra como candidato de producción:** Alan genera en Higgsfield videos cortos bien dirigidos (personajes con acciones/reacciones, ~8s o micro-clips por beat) a partir de diseños de personaje; se unifican después. Candidato fuerte para la intro (una versión CSS simplificada "no tendría el mismo impacto"). Matiz del descarte del 18/07: aquello descartó video como MOTOR del scroll (no interactúa con el DOM); video como intro autoplay o como micro-clip de personaje es otra cosa y es válido.
- **Doc paralelo de assets:** [`bl17-assets-direccion.md`](assets-direccion.md) — dirección de diseño de TODOS los assets (stills y videos) para que Alan genere en paralelo mientras se construye. Se mantiene vivo: cada boceto gateado le agrega su tanda.
- **Storyboard (pedido de Alan 22/07):** [`bl17-storyboard.md`](storyboard.md) — el viaje completo E0–E7 en ~30 cuadros con prompt generable por cuadro. Rol: SINTONÍA visual antes de codear — Alan genera los boards en Higgsfield, se revisan juntos, y el storyboard gateado es insumo del boceto de cada escena (lo que no funcione se corrige en papel, donde es barato).
- **E3 ampliada:** no solo nubes — el protagonista DESCIENDE con su nave (capas de atmósfera → nubes → toca tierra) y aterriza.
- **E5 ampliada:** beat de crecimiento tras la primera órbita — entran MÁS objetos en órbita (más clientes).
- **E6 ampliada:** mission control levemente INTERACTIVO (un par de acciones del visitante hacen avanzar el proceso en la tienda) + ALOJA el switch de skins (BL-16).
- **Quien-soy REDEFINIDO: página aparte** linkeada siempre desde el nav; sus demos se redistribuyen (skin switch → E6 · fichas Construcción → candidato E4/E5 · toggle Calidad → a decidir). BL-13 P2 se replantea bajo esta forma.

## Reglas de operación (contrato de todas las corridas)

1. **Ninguna corrida arranca sin su bloque aprobado acá.** Cambios de alcance → se actualiza este doc primero.
2. **Gate de Alan por pieza visual** (screenshot o preview), nunca por mega-montaje. Una pieza sin gate no avanza a la siguiente.
3. **Composición visual (posición/tamaño/opacidad/timing) la decide Alan** — se le presenta 1 propuesta concreta y se frena.
4. **Verificación por bloque:** Playwright sobre build de prod (desktop 1440 + mobile 375 + reduced-motion) antes de pedir gate.
5. **Commit solo post-gate.** El working tree puede acumular UNA pieza en revisión, no más.
6. **Presupuesto:** Fable dirige y decide; ejecución mecánica con spec cerrada → ejecutor Sonnet. `/estimate` real antes de cada corrida grande.

## B0 · Triage del working tree — ✅ EJECUTADO (21/07, veredictos de Alan)

| Pieza | Veredicto | Acción |
|---|---|---|
| `StarLayer.tsx` sin nubes fotográficas | **Queda** | Committeado |
| `public/space/` (8 WebP tanda 1, ~278KB) | **Queda** (material curado) | Committeado |
| `NebulaField` + `UmbralAsteroids` + `UmbralShopScene` (SpaceDecor) | **Rechazados** | Borrados; wiring de `page.tsx` y keyframes de `globals.css` revertidos |
| `public/clouds/processed/` (huérfano) | **Vuela del repo** | `git rm --cached` + `/public/clouds/` gitignoreado (queda local) |

Resultado: la base contratada — estrella-cursor + pulso + reveal, cielo limpio.

## B1 · Fundación del motor de escenas (técnico, sin gate visual)

Prerequisito de todas las escenas scroll — hoy no existe ScrollTrigger en el sitio:
1. Extraer **Lenis a módulo único** (hoy vive dentro de `StarLayer.tsx`) + `lenis.on('scroll', ScrollTrigger.update)` — un solo reloj de scroll para todo el sitio.
2. Registrar GSAP ScrollTrigger + `matchMedia` gates (desktop / mobile / reduced) coherentes con StarLayerGate.
3. Contrato de escena: pin/scrub según patrón de la skill (`end` variable = timing narrativo).
- **Criterio de aceptación — regresión cero (SOLO de este paso):** tras B1 el sitio se ve y comporta igual que la base de B0; solo cambia la plomería. Es secuencia de ingeniería (motor primero, obra después), NO una promesa de que el sitio queda como está — la obra viene en B2.
- **Estimación:** ~80–140k · 30–50 min. Candidata a ejecutor Sonnet con spec cerrada.

## B2 · Producción escena por escena — ORDEN NARRATIVO

Ciclo por escena (la primera escena scroll construida hace de **spike** — valida motor, patrón y ciclo):
1. **Boceto de dirección ANTES de codear:** qué pasa al entrar/durante/al salir (poses), tamaño del umbral, **destino de la sección afectada** (queda / se reencuadra / se transforma / vuela) y forma mobile. → **gate de Alan sobre el boceto.**
2. Build (pin/scrub, transiciones entrada/salida dirigidas) + verificación (regla 4).
3. Screenshots → **gate visual de Alan** → commit.

| Orden | Escena | Sección afectada | Destino (dirección de Alan 21/07) |
|---|---|---|---|
| 1 | **E0 supernova + escape** | Intro actual (8s genéricos) | **Se transforma** — revamp para contar la escena 0 real (la tienda, el colapso, el escape, el pulso naciendo) |
| 2 | **E1 radar / zoom al pulso** | Hero | **Se reencuadra** — promesa + CTA quedan; la transición Hero→Dolores es el zoom del radar. EKG #2 |
| 3 | **E2 el cinturón** | Dolores | **Se transforma / fusiona** — la sección ES el cinturón. **Interacción: el usuario DESTRUYE los asteroides (point & click / tap) para avanzar** — superar las adversidades que todo dueño negocia. Nombres = copy vigente; texto legible (DOM real). El boceto resuelve: ¿avance bloqueado hasta destruir o destrucción como recompensa? + teclado / mobile / reduced-motion (nunca atrapar el foco) |
| 4 | **E3 aterrizaje** | — (escena nueva, pre-Mostrador) | Nubes **FLAT** regeneradas + **el descenso completo (Alan 22/07)**: el protagonista baja CON su nave — atmósfera → nubes → toca tierra |
| 5 | **E4 la tienda dollhouse** | Mostrador / La Espiga | **Se transforma** — el demo standalone "tiene poco" por sí solo (Alan): el concepto se representa EN escena (el aliencito hace el pedido → el dueño lo recibe). Si conviene marcar el flujo como "punto de avance" explícito dentro de la escena, se evalúa en el boceto |
| 6 | **E5 órbitas** | Proceso | **Se transforma** — mitades espejadas cielo/tierra + **beat de crecimiento (Alan 22/07)**: entran más objetos en órbita. Candidato a alojar las fichas de Construcción (ex quien-soy) |
| 7 | **E6 mission control** | Tablero | **Se reencuadra** — la maquinaria queda; envoltorio caos→orden. **Interactivo (Alan 22/07)**: acciones del visitante avanzan el proceso en la tienda + aloja el switch de skins (BL-16). EKG #3 |
| 8 | **E7 constelación** | CTA / form | **Se reencuadra** — "mandá tu señal". EKG #4. (Deuda F5: cablear el form sigue pendiente, prerequisito de mostrar el sitio) |
| — | Quien-soy (BL-13) | #quien-soy | **Se muda a PÁGINA APARTE (Alan 22/07)** — link permanente en el nav; la sección sale de la película. Sus demos se redistribuyen (skin→E6, construcción→E4/E5, calidad→a decidir). BL-13 se replantea |

- **Estimación por escena:** ~150–300k según complejidad (E4 el doble). `/estimate` real antes de cada una.
- **Assets faltantes los genera Alan** (canal Higgsfield UI, canon vigente): viñeta protagonista/nave (E0), radar/planeta (E1), nubes flat (E3), tienda iso por planos (E4).

## B3 · Mobile — ✅ DECIDIDO (Alan, 21/07)

Las escenas **EXISTEN en mobile con la misma narrativa**. La forma es libre por escena (versión reducida, menos assets, o adaptación específica) y se define en el boceto de cada una. Ya no bloquea la producción en serie.

## Formalización

B1 + ciclo de escenas se bajan a un cambio **OpenSpec** (`bl17-escenas`) al arrancar B1 — el estándar de la casa para builds no triviales.

## Abierto

- Guión fino de quien-soy/CTA (revisables en el guión).
- Por escena: lo que su boceto deba resolver (marcado arriba).
