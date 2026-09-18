# Kit de motion graphics

Configurador HTML autocontenido que genera las cartelas y elementos que se
superponen sobre el vídeo. Exporta cada pieza en PNG con transparencia, o en
WebM con canal alfa real, para montarlas después en Canva.

Los textos se editan haciendo clic sobre la propia pieza. Todo se dibuja sobre
un lienzo de 1920x1080 con fondo transparente.

## Bloques incluidos

| Bloque | Piezas |
| --- | --- |
| 01 | Rótulos de presentador: placa doble, tarjeta clara, versión mínima sobre foto |
| 02 | Contador de etapa: tarjeta vertical, compacta, chip y barra de progreso |
| 02b | Camino Francés desde Sarria: las 5 etapas, chips y las 9 secciones de la ruta completa |
| 03 | Overlays de 1920x1080: sutil, placa inferior y banda lateral |
| 04 | Cajas de dato en tres tonos y banda de cita |
| 05 | Iconos de línea Lucide, stroke 2, más la vieira |
| 06 | Suscripción, campana, flechas hacia la descripción y barra de redes |
| 07 | Tarjeta TIP, pull quote y píldora de dato |
| 08 | Tarjetas de ruta, una por Camino |
| 09 | Mejor época del año, una por estación |
| 10 | Equipaje: mochila o maleta, más la regla de oro |
| 11 | Qué llevar: lista de imprescindibles |
| 12 | Alojamiento: opciones y avisos |

## Cómo está hecho

Aplicación Vue que dibuja cada pieza en HTML y CSS. La exportación a PNG
rasteriza el nodo; la de vídeo graba el lienzo con `MediaRecorder`, con las
mismas limitaciones que los configuradores de mapas: tiempo real, duración
fija y formato WebM.

Si estas piezas se portan a Remotion dejan de ser PNG que hay que recomponer
en Canva: pasan a ser componentes que se colocan sobre el metraje en el mismo
render, con su animación y sincronizados al fotograma.
