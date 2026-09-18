# Vídeos Santiago Ways (Remotion)

Vídeo escrito como código React. Cada fotograma es un render de un componente:
se le pregunta "¿qué frame es?" y se dibuja el estado correspondiente.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `src/brand/theme.ts` | Los tokens del BrandBook: colores, fuentes, escala tipográfica, lienzo. Único sitio donde tocar la marca. |
| `src/EscenaPortada.tsx` | Una escena de ejemplo: portada vertical para Reels, TikTok o carrusel. |
| `src/Composition.tsx` | Declara el vídeo: duración, fps, tamaño y textos por defecto. |
| `src/Root.tsx` | Registra todas las composiciones disponibles. |

## Comandos

```bash
npm run dev        # Abre Remotion Studio: preview con línea de tiempo
npx remotion render PortadaSW salida.mp4
```

## Marca

Paleta oficial, del BrandBook:

| Rol | Hex |
| --- | --- |
| Verde principal | `#7AA606` |
| Verde oscuro | `#668814` |
| Blanco | `#FFFFFF` |
| Negro / gris oscuro | `#1A1A1A` |

El manual especifica **Tahoma**, que no existe en el navegador headless con el
que Remotion renderiza. Se usan sustitutas empaquetadas con el proyecto
(Montserrat para titulares, Open Sans para cuerpo) para que el render salga
igual en cualquier máquina y sin conexión. Se cambia en `src/brand/theme.ts`.

El isotipo (vieira) todavía no está en el repo: en `EscenaPortada.tsx` hay un
marcador de posición. Al añadir el SVG o PNG en versión blanca a `public/`, se
sustituye por `<CanvasImage src={staticFile("vieira.svg")} />`.

## Nota sobre entornos sin red

Remotion descarga su propio Chrome la primera vez. Si el entorno bloquea esa
descarga, se le puede pasar un Chromium ya instalado:

```bash
npx remotion render PortadaSW salida.mp4 \
  --browser-executable=/ruta/a/chrome
```
