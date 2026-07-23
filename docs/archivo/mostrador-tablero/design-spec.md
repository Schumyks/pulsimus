# Spec de diseño · F4R (El mostrador reformado) + F4T (El tablero)

> Diseño validado en sesión de brainstorming con Alan (2026-07-09). Reemplaza el alcance
> congelado del brief §5 (ver §Docs a actualizar). Activa y resuelve **BL-02** del backlog.
> Dos entregas con gates separados: **F4R** primero, **F4T** después (el tablero consume
> el estado que el mostrador produce).

## 1 · Tesis

El mostrador deja de ser un gesto suelto y se convierte en el ciclo completo del negocio,
jugable: el visitante **arma un pedido y paga** (lado cliente), el pedido **viaja como sobre**
al lado interno, y más abajo **El tablero** (sección nueva de la landing) muestra lo que ese
registro le da al dueño: *lo que todo negocio de barrio necesita saber y no sabe*.
El visitante juega los DOS roles: pide como cliente arriba, confirma reservas como dueño abajo.
Un solo registro, todas las vistas — esa continuidad es la prueba de la infraestructura.

Narrativa de la página: Dolores (problema) → **El mostrador (el gesto)** → **El tablero
(el resultado)** → Proceso → CTA.

## 2 · Modelo de datos compartido (módulo único, sin backend)

Un módulo de estado en memoria (React, sin dependencias nuevas; patrón `useSyncExternalStore`
como `useReducedMotion`) alimenta AMBAS secciones. Sin persistencia: la demo vive por visita.

### Productos

```ts
type Product = {
  id: string;
  name: string;        // Medialunas · Pan de campo · Facturas
  unitPrice: number;   // kr., precio al público (moms 25% INCLUIDO)
  unitCost: number;    // kr., costo estimado (~40-50% del precio)
  batchSize: number;   // tanda del día: medialunas 60 · facturas 48 · panes 30
  img: string;         // assets existentes de la curación de Alan
};
```

### Órdenes

```ts
type OrderStatus = 'paid' | 'reservation_pending' | 'reservation_confirmed';

type Order = {
  number: number;          // correlativo del día (seeds arrancan ~#52)
  customer: string;        // nombre generado (pool AR/DK, ver §2.4)
  items: { productId: string; qty: number }[];
  total: number;           // kr., derivado
  status: OrderStatus;
  paymentMethod: 'mobilepay' | 'on_pickup';
  placedAt: string;        // HH:MM
  pickupAt: string;        // HH:MM (+ etiqueta "hoy"/"sáb" en seeds de reserva)
  isLive: boolean;         // true = la generó el visitante en esta visita
};
```

Transición de estados: `reservation_pending → reservation_confirmed` la dispara el dueño
(el visitante) desde El tablero. El eco viaja hacia arriba: el ticket del mini-dashboard
del mostrador actualiza su badge en vivo.

### Economía (fórmulas canónicas — no "corregir" después)

- Los precios son al público con **moms 25% incluido** (Dinamarca) → componente de moms
  = `bruto × 0.20` (25/125).
- `ganancia estimada = facturado − moms − Σ(unitCost × qty)`.
- Ticket promedio = `facturado / pedidos`.
- Los números del mock cierran entre sí porque TODO deriva del mismo modelo; los valores
  concretos de precio/costo se calibran en build para que el "día" se parezca al mock
  (~1.240 kr. · ~14 pedidos).

### Seeds y nombres

- **Nombres**: pool mixto argentino-danés (La Espiga = panadería argentina en Copenhague):
  Sofía R., Camila F., Martín G., Valentina P., Lucía B., Mikkel J., Freja L., Emil K.,
  Ida S., Clara N. Nada de "Vos": la orden del visitante también recibe nombre generado
  (client-side al confirmar → cero hydration mismatch; los seeds SSR son deterministas).
- **Día actual**: ~14 órdenes seed distribuidas en horas realistas (pico ~11:00), mezcla de
  estados (pagadas, reserva pendiente ×2, confirmada ×1) y multi-item.
- **Historia**: para Semana/Mes y los deltas, el generador produce **agregados diarios**
  del período anterior (facturado, pedidos, unidades por producto, split de pago) — NO
  órdenes completas de 60 días.
- Determinismo: seeds fijos (sin `Math.random()` en SSR); la aleatoriedad del visitante
  (nombre) es client-side post-interacción.

## 3 · F4R — El mostrador reformado

### 3.1 Lado cliente: armar → pagar → viaja

1. **Armar.** Cada producto lleva stepper `[− n +]` (arranca en 0, `+` suma de a 1).
   Al primer ítem aparece el **ticket borrador** al pie del panel: papel dentado PÁLIDO
   con borde punteado (papel que aún no se imprimió), items + cantidades + total en vivo,
   botón "Confirmar pedido".
2. **Pagar.** El confirm abre el momento de pago EN el ticket (no un modal): dos opciones —
   **"Pagar ahora"** (marca de pago estilo MobilePay con NUESTRO sistema visual, cero trade
   dress ajeno) y **"Pago al retirar"** (= reserva de productos).
3. **El formulario que se autorellena.** En ambos caminos aparece el form que un cliente
   real llenaría (nombre, retiro, contacto) y se completa SOLO, tipeándose, con los datos
   del cliente generado. Punto narrativo: *el sistema captura los datos; nadie los anota
   en un papelito*.
4. **Sobre y viaje.**
   - *Pagar ahora* → teatro: pulso ámbar recorre el borde, "Procesando…" → "✓ Pagado N kr."
     (~1.2s, tuneable) → el form se **pliega en un sobre** (canto ámbar) → FLIP al panel
     dueño (mismo easing del viaje de la intro).
   - *Pago al retirar* → sobrio: sin ceremonia de pago; form → sobre → viaja directo.
     La animación comunica el ESTADO del pedido (pagado se celebra; reserva es promesa).
5. **Aterrizaje.** El sobre llega al panel dueño y se abre **imprimiéndose** como ticket:
   el papel pálido se vuelve sólido y revela lo que solo el dueño ve (N° de orden, estado
   de pago, hora). Reduced-motion: sin viaje ni teatro — el ticket aparece directo.

### 3.2 Lado dueño: mini-dashboard

- **Franja de negocio** (arriba, viva): `HOY · pedidos · facturado · cobrado / a cobrar`.
  SIN ganancia (la ganancia es el resultado del día → vive en El tablero). Contadores con
  animación de conteo en cada orden nueva.
- **Lista acumulativa y scrolleable** dentro del componente: altura fija, fade en los
  bordes, SIN cap (reemplaza el cap-4 actual); el badge cuenta el total.
- **Ticket compacto** en lista: `#N · cliente · items resumidos · total · estado · retiro`.
  Estados visibles: `✓ Pagada (MobilePay)` · `Reserva · pendiente` · `Reserva confirmada`.
- **Modal de detalle** al click/tap — el gesto de "levantar el papelito": items completos
  con precios, método, hora del pedido, retiro/reserva, canal (Web). Cierra con tap
  afuera / Esc; accesible (focus trap).
- Seeds visibles antes de tocar nada: al menos una orden pagada y una reserva pendiente,
  para que ambos estados se lean de entrada.

### 3.3 Latido sano (decisión heredada de F3)

El latido narrativo: Dolores late ENFERMO (30bpm, lub-dub espaciado — ya LIVE). El
mostrador es la prueba de que la infra funciona → late SANO: mismo lenguaje (halo
por-card / por-panel discreto) a ritmo saludable (~60-70bpm, regular, más sutil que el
enfermo — acá el contenido es el protagonista). Se intensifica sutilmente al recibir
una orden. Valores con defaults + `?tune`; Alan congela en el gate.

### 3.4 Mobile

Paneles apilados (cliente arriba, dueño abajo); el sobre viaja HACIA ABAJO. El modal de
detalle ocupa la pantalla con margen.

## 4 · F4T — El tablero (sección nueva)

### 4.1 Ubicación y rol

Entre `#mostrador` y Proceso. Fondo **noche** (el lado interno del negocio), texto hueso,
acentos ámbar. Se alimenta del MISMO estado: los pedidos hechos arriba mueven los números
de abajo en vivo.

### 4.2 Control global (regla dataviz: jamás filtros por card)

Fila de control única arriba del grid: **`[ Hoy | Semana | Mes ]`**. Un tap re-renderiza
TODO el tablero contra la misma ventana (re-conteo animado). Las colas (Reservas, Retiros)
son operativas y viven en presente: no cambian de período (Retiros muta a "próximos" en
Semana/Mes).

| Panel | Hoy | Semana | Mes |
|---|---|---|---|
| El día de un vistazo | facturado · pedidos · ticket prom. · ganancia + desglose · Δ vs. mismo día sem. pasada | totales + sparkline por día · Δ vs. semana pasada | totales + sparkline por semana · Δ vs. mes pasado |
| Qué se vende | unidades + stock de tanda (⚠ se agota) | unidades semana (sin stock: es propiedad del día) | unidades mes |
| Cuándo te piden | barras por HORA, pico ámbar | barras por DÍA ("el sábado es tu día fuerte") | barras por SEMANA ("tu mejor semana") |
| Cómo te pagan | cobrado / a cobrar · split método | split de la semana | split del mes |
| ⚡ Reservas por confirmar | cola viva (siempre) | idem | idem |
| Retiros | de hoy, por hora | próximos | próximos |

### 4.3 Los 6 paneles (layout: fila ancha + grid 3 + grid 2; mobile apilado)

1. **⚡ Reservas por confirmar** (ancho completo, LA accionable): cada fila = detalle
   compacto (quién, qué, cuánto, cuándo retira) + botón **"Confirmar reserva"**. Al tocar:
   la fila se sella (badge ámbar ✓) y el ECO viaja al mini-dashboard del mostrador (el
   ticket actualiza su badge). Contador de pendientes en el encabezado.
2. **Qué se vende + qué te queda**: barras por producto (un solo hue — es magnitud) con
   `vendidas · quedan N de M`; **⚠ se agota** = color de ESTADO con ícono+texto, jamás
   color solo.
3. **Cuándo te piden**: barras por hora/día/semana según toggle; pico marcado en ámbar
   (énfasis: una barra acento, el resto en tono recesivo).
4. **Retiros de hoy**: agenda `HH:MM · cliente · items · estado` — qué tiene que estar
   listo y a qué hora.
5. **El día de un vistazo**: KPI row (facturado · pedidos · ticket prom.) + delta vs.
   período anterior + **ganancia estimada** con desglose (`bruto − moms − costos`) —
   el sketch original de Alan vive acá.
6. **Cómo te pagan**: cobrado vs. a cobrar + split por método. Único panel con **switch
   de forma `[▤|◔]`**: barra apilada ↔ donut, con morph animado. (Es parte-de-un-todo con
   2-3 segmentos: las DOS formas son legítimas. En el resto de los paneles NO hay picker
   de forma: la forma la elige el trabajo del dato — torta para comparar magnitudes
   cercanas es anti-patrón.)

### 4.4 Coreografía de carga (primera entrada al viewport)

1. Los 6 marcos hacen fade+rise escalonado en orden de lectura (~90ms de stagger), vacíos.
2. Se llenan según su naturaleza: contadores cuentan 0→valor, barras crecen de izquierda
   a derecha, el gráfico de horas levanta en cascada, las filas entran deslizándose.
3. La puntuación aparece al final: pico ámbar, ⚠ se agota.
- IntersectionObserver (patrón `[data-rv]` del kit F3). Se dispara UNA vez por carga.
- Órdenes posteriores desde el mostrador animan solo su delta (contador salta, fila entra).
- Cambio de toggle re-cuenta con la misma gramática, más corto.
- Reduced-motion: todo aparece lleno, sin conteos ni cascadas.

### 4.5 Reglas dataviz (del kit cargado en sesión — obligatorias en build)

- Paleta sobre noche (ámbar / bruma / hueso) **validada con `validate_palette.js`**
  (modo dark, superficie noche) ANTES de codear. CVD y contraste: no se eyeballea.
- Un solo eje siempre; sin dual-axis; sin torta para magnitudes; marcas finas, grid
  recesivo hairline; `tabular-nums` solo donde los números se alinean.
- Valores clave con **direct label** (el dato se lee sin hover); tooltip como refuerzo,
  nunca como única vía. (Deviación consciente v1: no hay "table view" gemela por chart —
  los direct labels cumplen el rol en una demo de landing.)
- Texto siempre en tokens de texto; el color lo lleva la marca, no la palabra.

## 5 · Tuneabilidad (patrón `?tune`, ya validado con el latido F3)

Panel dev montado solo con `?tune`, una función única genera los valores → lo que se
copia es lo que se congela. Parámetros expuestos:
- F4R: duración del "Procesando", velocidad de tipeo del autofill, timing del pliegue a
  sobre, duración/easing del FLIP, timing de impresión al aterrizar.
- F4T: stagger de paneles, duración de conteo, velocidad de crecimiento de barras,
  cascada del gráfico de horas.
El panel se borra al congelar (como en F3).

## 6 · Copy — a veredicto de Alan (en los gates)

- Mostrador: h2/sub actuales quedan ("Tocá los dos lados del mostrador." / "La Espiga no
  existe. El mostrador, sí…") salvo veto; micro-copy nuevo: "Confirmar pedido", "Pagar
  ahora", "Pago al retirar", "Reserva confirmada", form labels.
- Tablero: h2 y sub NUEVOS en voz de marca. Dirección de trabajo: *"El resultado del día,
  sin hacer cuentas."* / concepto "lo que todo negocio de barrio necesita saber y no sabe".
- Todo en ES voseo (v1). El módulo EN se reescribe después, como el resto.

## 7 · Fases, gates y ramas

| Fase | Contenido | Rama | Gate |
|---|---|---|---|
| **F4R** | Rework del mostrador (§3) + modelo compartido (§2) | `f4-mostrador` (evoluciona la existente, rebasada sobre main) | `gate-f4r/report.md` + capturas/GIFs + Playwright |
| **F4T** | Sección El tablero (§4) | `f4-tablero` (apilada sobre F4R) | `gate-f4t/report.md` + idem |

- Verificación Playwright por fase: flujo completo (armar → pagar/reserva → sobre → ticket;
  confirmar reserva → eco), reduced-motion, mobile, seeds SSR deterministas, toggle de
  período, build+tsc+eslint verdes.
- El gate F4 anterior (chip-FLIP) queda superseded por F4R; los assets `gate-f4/` se
  conservan como registro histórico.

## 8 · Docs a actualizar al abrir F4R

- **Brief §5**: guardarraíles reescritos. ENTRAN: orden multi-item con steppers, totales y
  precios en kr., momento de pago simulado, estados de orden, mini-dashboard, sección nueva
  El tablero. SIGUEN: sin backend, sin persistencia real, sin checkout real, demo
  auto-contenida, assets solo de la curación de Alan.
- **Brief §4**: tabla de secciones suma "El tablero" entre El mostrador y Proceso.
- **Backlog**: BL-02 → resuelto por este diseño (referenciar esta spec). Nuevos parqueos
  v2 del módulo tablero: clientes que repiten (pide historial real), predicciones
  (descartado: humo en demo), merma (el registro no la captura), canal de entrada (demo
  mono-canal). BL-03 (vidriera→mostrador) queda como estaba.
- **STATE**: gates F4R/F4T reemplazan al "gate F4" pendiente.

## 9 · No-goals (v1)

Sin backend ni persistencia · sin pago real · sin carrito multi-visita · sin edición de
órdenes del lado dueño (solo confirmar reserva) · sin table-view por chart · sin EN ·
sin sonido (campanita sigue en backlog).
