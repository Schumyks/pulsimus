# Specs de generación (para Alan, en Higgsfield/MJ)

Cómo generar un asset para que salga bien vectorizable. Cuanto más se respeten, más fiel el SVG y menos iteraciones de calcado.

## Obligatorio

- **Resolución**: 2K mínimo, **4K si el modelo deja**. Más píxeles = lectura más precisa.
- **Fondo**: **verde plano** `#00B140` puro (chroma-key). Uniforme, sin gradiente, sin sombra proyectada sobre el verde.
- **Asset completo** y de **frente** (vista plana, sin perspectiva rara).
- **Sin glow / halo / brillo externo** — los agrega el código. Que la pieza termine en su borde.

## Muy recomendado (facilita la vectorización)

- **Flat**: colores planos o gradientes simples y bandas definidas. **Sin textura de grano/papel**, sin ruido, sin sombreado pictórico complejo.
- **Bordes definidos** (no difusos).
- **Estados que se necesiten** como piezas separadas y mismo encuadre: p. ej. carita **😊 y X_X**; puerta abierta/cerrada; etc.
- Si es un **componente** (ej. la tienda): idealmente también sus **partes** separables, o al menos el completo bien legible para que el código lo despiece.

## Qué NO hacer

- No pedir "green background" a secas → sale un verde sage que complica el chroma. Especificar **`#00B140` puro**.
- No meter sombras/reflejos sobre el fondo verde.
- No pedir texturas realistas si el destino es vector.

## Frontera

Esto es para assets **geométricos**. Nubes/fuego/follaje/humo (orgánico) NO se vectorizan — van como raster o efecto de código.
