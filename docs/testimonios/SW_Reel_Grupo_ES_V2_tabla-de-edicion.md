# Testimonio del grupo · español · reel · V2

Pieza de 42,8 s, 1080x1920 a 30 fps. Sale de un clip vertical de 720x1280 de
42,32 s.

Fuentes vivas:

- `video/src/SWReelGrupoES.tsx` · la escena
- `video/public/montajes/testimonio-ES3.mp4` · el clip, tal cual
- `herramientas/scripts/encuadrar.py` · dónde mirar en cada plano de recurso
- `herramientas/scripts/entregar.py` · cuadra el audio del render

## Lo que este clip no necesitaba

A diferencia de los otros dos:

- **No trae marca de agua.** Se comprobó el mínimo temporal de cada píxel en
  los cuatro bordes, que es lo que delata una marca pegada porque está
  siempre: ni un solo píxel se queda claro en todo el metraje.
- **Ya abre con la catedral**, así que la apertura se queda como está.

## Lo que sí hubo que tocar: el final

El clip dura 42,32 s, pero **los dos últimos segundos son un golpe de viento
en el micrófono**: −6,7 dB de rms con el 82 % de la energía por debajo de
250 Hz. Es decir, más fuerte que las voces, que van sobre −15. Medido décima a
décima, la voz acaba en 39,70 y el ruido empieza a subir en 39,80.

Así que el montaje se corta en **40,10**, con la pista bajada a cero entre
39,70 y 40,10, y la placa de marca entra detrás. De paso el último plano pasa
a ser el grupo con los brazos en alto, que remata mucho mejor que la senda con
el mojón que venía después.

## Los planos de alojamiento

El clip ya trae su propio plano de habitación, del 25,53 al 27,90, y cae justo
donde dicen «nos trataron con mucho cariño». Se queda tal cual, y los dos que
se añaden lo rodean, de límite de plano a límite de plano para no dejar restos:

| Entra | Sale | Plano | Encuadre |
| --- | --- | --- | --- |
| 24,27 s | 25,53 s | Terraza con vistas al valle | 0,25 |
| 25,53 s | 27,90 s | **La habitación del propio clip** | — |
| 27,90 s | 29,00 s | Habitación con ventanal, la única de 1080p | 0,55 |

De las tres terrazas de la biblioteca, la de las vistas es la única que
aguanta el 9:16. `mesa-piedra` tiene el interés en horizontal, la mesa larga,
y de pie se queda en dos tercios de pared oscura; `casona-moderna` es una
fachada. El cielo se lleva un tercio del cuadro, que es el precio del formato.

El plano de las ruinas que había en 27,90 sigue viéndose del 29,00 al 30,43, y
detrás viene el paisaje, que es lo que ilustra «y el paisaje bellísimo».

## Cartelas

| Entra | Sale | Texto | Pie | Sobre qué |
| --- | --- | --- | --- | --- |
| 0,60 s | 5,40 s | Camino de Santiago / **organizado en hoteles** | — | El coro de «excelente, espectacular, muy recomendable» |
| 17,20 s | 21,80 s | Conoce la España / **más auténtica** | — | El interior de la catedral y el marisco |
| 24,40 s | 28,90 s | Hoteles / **seleccionados** | Habitación y baño privados | Los tres planos de alojamiento |
| 36,60 s | 39,90 s | Tu Camino / **empieza aquí** | — | El grupo con los brazos en alto |

En negrita, lo que lleva el recuadro verde.

**Cuerpo de 70**, el mismo que el otro reel en español, y por lo mismo:
«organizado en hoteles» con su recuadro mide 919 px a 76 sobre un lienzo útil
de 936, y las líneas no se parten solas. A 70 baja a 846.

**El margen inferior se queda en los 480 de siempre.** Es un plano general de
todo el grupo: medida sobre diez fotogramas, la barbilla más baja de la pieza
cae en el píxel 883 de los 1920, muy por encima del bloque de texto, que
arranca en 1290.

## La cartela que se ha quitado

En la primera vuelta iban cuatro cartelas y el cierre: cinco textos en 42
segundos. La cuarta, «Asistencia 24/7», iba sobre el paisaje del 31,0 al 35,2
y se ha quitado por dos motivos.

**De sitio.** Con ella, los tres últimos textos iban a 2,1 s y 1,4 s de
distancia. Una cartela tarda 1,37 s en acabar de entrar y 0,4 en salir, así
que en ese tramo apenas quedaba pieza sin texto encima.

**De fondo.** Es la única de las cuatro que no se apoya en nada de lo que
dicen. Donde sí encajaría es en «la atención muy buena», que cae en 23,5, pero
ahí está la cartela de hoteles.

Sin ella quedan **7,7 s seguidos de paisaje sin texto**, del 28,90 al 36,60,
que es el respiro que la pieza necesitaba antes del cierre.

Si el mensaje del 24/7 tiene que estar en la pieza, la salida limpia es
ponerlo de pie en la primera cartela, debajo de «organizado en hoteles», en
lugar de como cartela propia.

## Lo que queda por decidir

- **El bloque del grupo en fila dura 12,9 s seguidos**, del 1,87 al 14,77. Es
  mucho para un plano fijo. No se ha tocado porque ahí van contestando uno a
  uno y se ve quién habla; si se quiere romper, hay sitio para un plano de
  recurso sobre el segundo 8.
