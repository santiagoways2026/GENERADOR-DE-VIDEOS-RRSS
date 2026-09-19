# Vídeos Santiago Ways (Remotion)

Vídeo escrito como código React. Cada fotograma es un render de un componente:
se le pregunta "¿qué frame es?" y se dibuja el estado correspondiente. Por eso
las animaciones CSS no sirven aquí: todo el movimiento sale de `interpolate()`.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `src/brand/theme.ts` | El sistema de diseño en código: color, tipografía, espaciado, radios, sombras, movimiento y formatos. Único sitio donde tocar la marca. |
| `src/fuentes.ts` | Carga la cascada Montserrat, Manrope, Poppins, empaquetada con el proyecto. |
| `src/componentes/Logo.tsx` | El logo oficial. La marca nunca se escribe como texto. |
| `src/componentes/entrada.ts` | La entrada estándar: fade más slide-up, sin rebote. |
| `src/componentes/Cartela.tsx` | El texto de marca: placa blanca sobre placa olivo, con barrido lateral. Admite varias líneas. |
| `src/componentes/Clip.tsx` | Una toma encajada en vertical, con encuadre, zoom lento y ritmo de reproducción. |
| `src/componentes/Planos.tsx` | Encadena las tomas de un bloque repartiendo su duración. |
| `src/graficos/` | Los gráficos didácticos: calendario, línea de tiempo, mapa de rutas y Puerta Santa. |
| `src/escenas/Cierre.tsx` | Cierre en degradado con el logo y la web. |
| `src/ReelXacobeo.tsx` | La pieza en español. |
| `src/ReelXacobeoUS.tsx` | La pieza para el mercado estadounidense. |
| `src/Composition.tsx` | Declara cada vídeo: duración, fps y tamaño. |

## Comandos

```bash
npm run dev                                  # Remotion Studio: preview editable
npx remotion render ReelXacobeoUS salida.mp4  # Exportar
```

En Studio puedes editar los textos desde la interfaz y se escriben solos en el
código, gracias a que las escenas usan `<Interactive.Div>`.

## Reglas de marca aplicadas

Las que condicionan el código, tomadas de la guía oficial:

- El protagonista es el verde olivo `#7AA606`. Blanco más verde en la mayoría
  de piezas. Lima y bosque son complementarios de uso puntual.
- Texto blanco sobre olivo, siempre. Texto bosque sobre lima, siempre.
- Nada de negro puro: la tinta es el verde bosque `#184834`.
- El brushstroke lima subraya de una a tres palabras clave, ligeramente
  rotado, nunca como contenedor de párrafos.
- "Santiago Ways" nunca se escribe como texto. Se usa el archivo de logo.
- Un solo CTA por pieza.
- Movimiento: fade más slide-up corto con `cubic-bezier(0.22, 0.61, 0.36, 1)`.
  Nunca rebote.
- Formatos: 1080x1920 reels, 1080x1080 feed, 1280x720 YouTube. Márgenes
  de 56 px como mínimo.

## Tipografía

La guía marca Tahoma como corporativa para PDF y material legacy, con la
cascada Montserrat, Manrope, Poppins para web. En vídeo se usa esa cascada y
las fuentes van empaquetadas con el proyecto: así el render sale idéntico en
cualquier máquina y funciona sin conexión.

## Nota sobre entornos sin red

Remotion descarga su propio Chrome la primera vez. Si el entorno lo bloquea, se
le puede pasar un Chromium ya instalado:

```bash
npx remotion render ReelCamino salida.mp4 --browser-executable=/ruta/a/chrome
```
