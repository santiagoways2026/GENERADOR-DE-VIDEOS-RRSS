# Mapas VFX del Camino

Dos configuradores HTML autocontenidos que generan mapas animados de las rutas
del Camino con el look and feel de Santiago Ways. Se abren en el navegador
directamente, sin servidor.

| Archivo | Contenido |
| --- | --- |
| `mapas-vfx-rutas.html` | El más completo. 14 rutas, vista de mapa, **perfil de etapas** con desnivel, y relieve. Formatos 9:16 y 16:9. |
| `mapas-vfx-caminos.html` | Versión anterior. 12 rutas, solo mapa. Añade el formato 1:1. |

## Cómo están hechos

D3 más TopoJSON dibujando sobre SVG. El mapa base de países viene embebido en
el propio archivo; el relieve se pide en vivo a los tiles de World Hillshade de
ArcGIS. La animación corre con `requestAnimationFrame` y la exportación graba
el lienzo en tiempo real con `MediaRecorder`, produciendo un WebM.

## Datos

Los datos viven dentro del HTML, en dos constantes:

- `ROUTES`: por ruta, etiqueta, origen, km, número de etapas, zoom y la
  polilínea de localidades como `[longitud, latitud, nombre, esHito]`.
- `STAGES`: perfil de altitud como pares `[km acumulado, metros]`, cortes por
  etapa y dificultad.

Rutas incluidas en `mapas-vfx-rutas.html`: Francés, Portugués (completo, desde
Oporto, desde Tui, por la Costa, Costa desde Baiona), Norte (completo, desde
Vilalba, San Sebastián a Bilbao), Vía de la Plata, Primitivo, desde Sarria,
Inglés y Finisterre.

## Limitaciones conocidas

`MediaRecorder` graba en tiempo real, con las consecuencias de siempre:

- El resultado es WebM, no MP4, y hay que reconvertirlo para montarlo.
- Si el equipo va justo, se pierden fotogramas y el movimiento salta.
- La duración está fijada en 15 segundos.
- No hay canal alfa, así que no se puede superponer limpiamente sobre otro
  material.

Todo esto lo resolvería portar las piezas a Remotion, que renderiza fotograma a
fotograma de forma determinista y exporta MP4 o ProRes con transparencia.
