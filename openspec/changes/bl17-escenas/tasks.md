> Ciclo por escena (D7): boceto → 🚧 GATE Alan → build → verificación Playwright (prod build; desktop 1440 / mobile 375 / reduced; wheel por pasos) → 🚧 GATE visual Alan → commit. Ningún grupo arranca sin el gate del anterior. Assets de cada escena: los genera Alan por tanda ANTES del build (D8).

## 1. E0 · Supernova + escape (revamp intro)

- [ ] 1.1 Boceto de dirección E0 (poses tienda/colapso/escape/pulso, timing, mobile/reduced) → 🚧 GATE Alan
- [ ] 1.2 Tanda E0 según `docs/bl17-assets-direccion.md` (diseños de personaje + spike de VIDEO de la intro) generada por Alan; evaluación video vs canvas → decisión de canal con Alan
- [ ] 1.3 Build E0 sobre el motor de `Intro.tsx` ADAPTADO (eliminar acreción-nacimiento: estrella presente desde p=0; desestabilización + colapso/infall + inhale + explosión existente; handoff de la nebulosa remanente al cielo Z1; gates 1×/sesión, skip, `?intro`, reduced intactos)
- [ ] 1.4 Verificación Playwright E0 + screenshots → 🚧 GATE visual Alan → commit

## 2. E1 · Radar / zoom al pulso (Hero)

- [ ] 2.1 Boceto E1 (timeline Hero→Dolores con labels, EKG 2/4, mood, mobile/reduced; decidir con Alan el candidato "latido al ritmo del scroll") → 🚧 GATE Alan
- [ ] 2.2 Build E1 (reencuadre Hero: promesa+CTA quedan; zoom radar como transición) + mecanismo de mood cromático (D3, primera escena que lo usa lo instala)
- [ ] 2.3 Verificación Playwright E1 + screenshots → 🚧 GATE visual Alan → commit

## 3. E2 · El cinturón (Dolores) — spike de interacción

- [ ] 3.1 Boceto E2 (morph cards→rocas, mecánica destruir-para-avanzar: ¿bloqueo o recompensa?, fallbacks teclado/mobile/reduced de igual peso, tutorial just-in-time) → 🚧 GATE Alan
- [ ] 3.2 Build E2 (receta Species: clip-path + clase + delays; interacción con fallbacks; copy vigente en DOM real)
- [ ] 3.3 Verificación Playwright E2 (incluye recorrido solo-teclado y reduced) + screenshots → 🚧 GATE visual Alan → commit

## 4. E3 · Descenso y aterrizaje (escena nueva pre-Mostrador)

- [ ] 4.1 Boceto E3 (el protagonista desciende CON su nave: atmósfera → nubes flat → toca tierra; densidad, pacing) → 🚧 GATE Alan
- [ ] 4.2 Tanda E3 (nubes flat + nave/descenso según `bl17-assets-direccion.md`) generada por Alan y procesada
- [ ] 4.3 Build E3 + verificación Playwright + screenshots → 🚧 GATE visual Alan → commit

## 5. E4 · La tienda dollhouse (Mostrador)

- [ ] 5.1 Boceto E4 (tres planos, beats del ciclo alien-pide-dueño-recibe, doble pista de texto, ¿punto de avance explícito?, destino del demo La Espiga) → 🚧 GATE Alan
- [ ] 5.2 Tanda tienda iso por planos generada por Alan y procesada
- [ ] 5.3 Build E4 (set-piece #2; presupuesto doble estimado) + verificación Playwright + screenshots → 🚧 GATE visual Alan → commit

## 6. E5 · Órbitas (Proceso)

- [ ] 6.1 Boceto E5 (mitades espejadas, fases sincronizadas, remate primera órbita + beat de crecimiento con más objetos en órbita; ¿aloja las fichas de Construcción ex quien-soy?) → 🚧 GATE Alan
- [ ] 6.2 Build E5 + verificación Playwright + screenshots → 🚧 GATE visual Alan → commit

## 7. E6 · Mission control (Tablero)

- [ ] 7.1 Boceto E6 (envoltorio caos→orden, desaturado→color, EKG 3/4; maquinaria intacta; interacciones que avanzan el proceso en la tienda + slot del switch de skins BL-16) → 🚧 GATE Alan
- [ ] 7.2 Build E6 + verificación Playwright (incluye regresión de paneles/toggle/eco) + screenshots → 🚧 GATE visual Alan → commit

## 8. E7 · Constelación / mandá tu señal (CTA)

- [ ] 8.1 Boceto E7 contra el guión que haya (revisable por Alan; form como consola, EKG 4/4) → 🚧 GATE Alan
- [ ] 8.2 Build E7 + verificación Playwright + screenshots → 🚧 GATE visual Alan → commit

## 9. Cierre del cambio

- [ ] 9.1 Pasada de regresión completa del viaje E0→E7 (scroll continuo lento/rápido/atrás, mobile, reduced, perf sin loops vivos fuera de viewport)
- [ ] 9.2 Actualizar STATE + backlog (BL-17) y sincronizar/archivar el cambio (`/opsx:sync` o archive según decida Alan)
