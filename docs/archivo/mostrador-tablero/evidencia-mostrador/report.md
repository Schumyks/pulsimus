# Gate F4R · El mostrador reformado

> Rework de la pieza firma: el mostrador pasa de un gesto suelto al **ciclo completo
> del negocio, jugable**. Rama `f4-mostrador`. Diseño: [`f4r-f4t-design-spec.md`](../design-spec.md) ·
> Plan: [`f4r-f4t-plan.md`](../plan.md). **El merge a `main` (producción) es decisión de Alan.**

## Qué se construyó

El visitante juega **los dos lados del mostrador** sobre un único registro compartido:

- **Lado cliente** — arma el pedido con steppers `[− n +]` → un **ticket borrador** ("papel
  que aún no se imprimió") se llena en vivo con items + total → **Confirmar** abre el
  momento de pago EN el ticket.
- **Momento de pago** — dos caminos, con teatralidad asimétrica (decisión de Alan):
  - **Pagar ahora**: el ticket pulsa ámbar · *Procesando…* → *✓ Pagado N kr.* → el
    **form se autorrellena tipeándose** con los datos del cliente → se **pliega en un
    sobre** (canto ámbar) → **viaja (FLIP)** al panel dueño → **aterriza imprimiéndose**
    como ticket. `placeOrder` dispara en el aterrizaje: el ticket se imprime justo cuando
    el sobre se disuelve.
  - **Pago al retirar** (= reserva): mismo viaje pero **sobrio**, sin ceremonia de pago
    (es una promesa, no una celebración).
- **Lado dueño** — mini-dashboard: franja `HOY · pedidos · facturado · cobrado / a cobrar`
  (contadores animados, **sin ganancia** — eso vive en El tablero), lista **acumulativa
  scrolleable sin cap**, ticket compacto con 3 estados, **modal de detalle** (la
  trazabilidad completa: items con precios, método, hora, retiro, **canal Web**).
- **Latido SANO** — el panel dueño late saludable (~66 bpm, doble-golpe parejo, sutil,
  ámbar saturado = vivo) — la contracara del latido enfermo de Dolores — e **intensifica
  al entrar una orden** (el negocio late en cada venta).
- **reduced-motion** — salta todo el teatro: la orden aparece directa en la lista.

## Verificación (Playwright, build de producción)

Todo verde, **cero errores de runtime/consola** en todos los flujos:

| Check | Resultado |
|---|---|
| Pay-now end-to-end (armar → pagar → sobre → ticket) | ✓ orden #66 impresa, badge `✓ Pagada (MobilePay)` |
| Economía en vivo | ✓ 2 medialunas+1 factura = 30 kr; facturado +30, **cobrado +30** (MobilePay), a cobrar sin cambio |
| Reserva (pago al retirar) | ✓ badge `Reserva · pendiente`, viaje sobrio |
| reduced-motion | ✓ orden aparece directa (~110 ms, sin teatro) |
| Modal de detalle | ✓ accesible (role=dialog, focus trap, Esc, backdrop), canal **Web** |
| Lista acumulativa | ✓ 5 órdenes → 19 tickets, **scrolleable, sin cap** |
| Latido sano presente | ✓ `.px-card-lit-healthy` en el panel dueño |
| Determinismo SSR | ✓ HTML idéntico en 2 cargas; seeds server-rendered |
| Mobile 375px | ✓ layout apilado, **el sobre viaja hacia abajo** |
| tsc · eslint · next build | ✓ los tres verdes |
| Invariantes del store (R1) | ✓ 21/21 (`scripts/verify-demo-invariants.ts`) |

## Assets

- `desktop-initial.png` · `desktop-payment.png` · `desktop-after-order.png` · `desktop-modal.png`
- `desktop-accumulated.png` (5 órdenes, lista scrolleable)
- `mobile-initial.png` (apilado) · `mobile-travel.png` (sobre bajando) · `mobile-after.png`
- `paynow-flow.webm` — **el flujo completo con teatralidad, a velocidad real**

*(Nota de captura: en los stills de sección el header sticky translúcido se superpone
arriba — es artefacto del screenshot del elemento, no del layout real.)*

## A tu veredicto, Alan

**Copy nuevo (micro-copy en voz de marca):** "Confirmar pedido" · "Pagar ahora · N kr" ·
"Pago al retirar" · "TU PEDIDO" · "TUS DATOS · SE CAPTURAN SOLOS" · form labels
(Nombre / Retiro / Contacto) · estados: "✓ Pagada (MobilePay)" · "Reserva · pendiente" ·
"✓ Reserva confirmada". **El h2/sub de sección quedaron intactos** ("Tocá los dos lados
del mostrador." / "La Espiga no existe…").

**Timings a congelar (`?tune`):** abrí el preview con `?tune` y ajustá a mano; el panel
copia el JSON exacto para congelar en `flowParams.ts`. Defaults actuales:

```json
{ "processingMs": 1200, "typingCharMs": 34, "fieldStaggerMs": 280, "foldMs": 440, "travelMs": 780 }
```

El **latido sano** y la **opacidad del sobre en vuelo** son valores por defecto en
`globals.css`/`Envelope.tsx` (hand-tuneables como el latido enfermo de F3, si querés
otro feel).

## Notas / decisiones

- **Eco de `confirmReservation`** (badge pendiente → confirmada): verificado
  **estructuralmente** (el Ticket deriva el estado del `order` en cada render, no lo
  cachea). El disparador vive en **El tablero (F4T)**, que todavía no existe → se ejercita
  end-to-end en el gate F4T.
- **Assets** = solo la curación de Alan (`public/la-espiga/`). Cero imágenes nuevas.
- **Preview** (protegido, solo vos logueado): rama `f4-mostrador` en Vercel una vez que
  el push buildea. Producción (`main`) **sin tocar** — sigue con el mostrador viejo hasta
  que decidas mergear.
- **Brief §4/§5** (guardarraíles del alcance, en `agency/landing-brief.md`): describen el
  mostrador viejo que sigue LIVE en `main`. Se actualizan **al mergear F4R** (§4 tabla suma
  "El tablero" recién con F4T).
