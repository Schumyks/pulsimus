# docs/ — mapa y reglas

Documentación de la landing Pulsimus: planificación + evidencia. Este README es el índice: **si no sabés dónde buscar algo, empezá acá.**

> Hay 3 lugares distintos en el repo, no confundir:
> - **`docs/`** — el papel (planificación + evidencia). Estás acá.
> - **`space-src/`** — assets **crudos** que genera Alan (input, gitignored).
> - **`public/`** — assets **procesados** que usa el sitio (output).

## Qué hay en cada lugar

| Carpeta | Qué vive acá | Estado |
|---|---|---|
| **`STATE.md`** · **`backlog.md`** | Estado vivo del frente + backlog. Se consultan siempre. | 🟢 vivo |
| **`direccion/`** | Visión transversal a TODAS las escenas: guión, plan de operación, storyboard, referencias, canon de assets, **pipeline de assets**, guión de la estrella-cursor. | 🟢 vivo |
| **`escenas/`** | La película de scroll (BL-17). Una carpeta **por escena** (`e0-supernova/…`), cada una junta su boceto + despiece + evidencia. | 🟢 vivo |
| **`quien-soy/`** | Página "quién es Alan" (BL-13): copy, refinamiento, evidencia. | 🟢 vivo (P1 en prod, P2 pendiente) |
| **`archivo/`** | Histórico **ya en producción**, no se toca. Cada tema junta su plan + su evidencia. | 🔒 congelado |

`archivo/` por dentro: `landing-secciones/` (las secciones F2), `intro/` (la intro F3 + sus frames + evidencia), `mostrador-tablero/` (El mostrador y El tablero, F4 — specs, planes y las tres tandas de evidencia).

## Reglas de mantenimiento (para que esto NO se vuelva a desarmar)

1. **Cada doc nuevo nace en su lugar** según la tabla de arriba. **Nunca** suelto en la raíz de `docs/`. Vivo transversal → `direccion/`; de una escena → `escenas/<escena>/`; de quien-soy → `quien-soy/`; histórico en prod → `archivo/…`.
2. **Nomenclatura humana.** Nombres que se entienden sin diccionario: `despiece.md`, `storyboard.md`, `evidencia/`. **Prohibido** códigos internos (`F4T`, `gate-x`, `bl17-`) y nombres de máquina (`hf_2026...`).
3. **Archivar es decisión conjunta.** Cuando una idea nueva reemplaza o revampea algo hecho (o a medias) y lo nuevo parece mejor, Claude **NO archiva lo viejo por su cuenta**: le pregunta a Alan si mover lo anterior a `archivo/`, y se decide en el momento.
4. **Un doc pasa a `archivo/` solo cuando está terminado Y en producción.** Mientras esté en curso o a medias, queda en su carpeta viva.

## Atajos

- Empezar a trabajar una escena → `escenas/<escena>/despiece.md` + `direccion/pipeline-assets.md`.
- Entender la historia → `direccion/guion-narrativo.md`.
- Cómo se generan y animan los assets → `direccion/pipeline-assets.md`.
- Contrato formal / tasks ejecutables → `../openspec/changes/` (OpenSpec; el despiece es su insumo de ejecución, no lo reemplaza).
