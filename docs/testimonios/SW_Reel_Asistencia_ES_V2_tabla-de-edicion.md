# Testimonio de la pareja · español · reel · V2

Pieza de 54,3 s, 1080x1920 a 30 fps. Sale de un clip vertical de 720x1280 que
venía de un editor online y duraba 64,98.

Fuentes vivas:

- `video/src/SWReelAsistenciaES.tsx` · la escena
- `herramientas/scripts/marca-agua.py` · quita la marca recortando
- `herramientas/scripts/montaje-testimonio-ES2.py` · el recorte de duración
- `herramientas/scripts/encuadrar.py` · dónde mirar en cada plano de recurso
- `herramientas/scripts/entregar.py` · cuadra el audio del render

## La marca de agua

`clideo.com`, abajo a la derecha, durante todo el metraje. Medida sobre el
mínimo temporal de cada píxel, que es lo que la delata porque está siempre:
ocupaba del píxel **1227 al 1254 de alto** y del **521 al 694 de ancho**.

Se quita **recortando**, que es lo que dice `marca-agua.py` y lo que se pidió.
Cortando por 1218 sale de cuadro con nueve píxeles de margen. El recorte
devuelve el 9:16 original con un zoom de **1,053x**: se pierde el 4,8 % por
abajo y otro tanto por los lados.

Rellenar el hueco en su sitio, que es el otro modo del script, aquí no sirve:
la marca cae sobre los pies de la pareja y sobre la piedra del escalón, que
tienen mucha textura, y ahí el parche se ve. Recortar sale limpio del todo.

El audio se mantiene: la correlación con el original es 0,99968, que es sólo
la diferencia de volver a codificar en AAC.

Los montajes de origen no entran en el repositorio, así que se rehacen con el
clip original y estas dos líneas, en este orden:

```bash
python3 herramientas/scripts/marca-agua.py bruto.mp4 \
    video/public/montajes/testimonio-ES2.mp4 \
    --zona 500,1200,220,80 --modo recorte --calidad 21
python3 herramientas/scripts/montaje-testimonio-ES2.py
```

`--zona` va con margen de sobra: el script encuentra la silueta dentro. La
segunda línea es el recorte de duración y deja `testimonio-ES2-corto.mp4`, que
es el que usa la escena.

## Los planos que cambian

**La apertura.** El clip abría con 5,63 s de un puente medieval bajo cielo
gris y con cables de luz cruzando el cuadro. Entran tres planos de catedral,
que es lo que se pidió, y van **de lo general al detalle con gente en medio**:

| Entra | Sale | Plano | Encuadre |
| --- | --- | --- | --- |
| 0,00 s | 2,10 s | Las dos torres contra el cielo | 0,50 |
| 2,10 s | 4,00 s | La fachada de cerca, con gente al pie | 0,55 |
| 4,00 s | 5,63 s | El tímpano, detalle de la piedra | 0,41 |

Tres encuadres seguidos de torres contra nubes se leerían como un salto. Con
el cambio de escala y la persona en medio, se leen como una secuencia.

**Los hoteles.** Donde había 6,27 s de un rótulo quieto, el seto recortado de
«SANTIAGO de COMPOSTELA» (del 40,53 al 46,80 del clip original, del 29,97 al
36,23 ya recortado). Entran cuatro planos de alojamiento
debajo de la cartela de hoteles:

| Entra | Sale | Plano | Encuadre | Velocidad |
| --- | --- | --- | --- | --- |
| 29,97 s | 32,04 s | Habitación con ventanal al embalse (1080p) | 0,55 | 1,00 |
| 32,04 s | 33,49 s | Habitación doble | 0,35 | 0,68 |
| 33,49 s | 34,84 s | Salón del hotel | 0,35 | 0,86 |
| 34,84 s | 36,23 s | Baño privado | 0,50 | 0,85 |

Los tres últimos son de 720p y duran menos que su hueco, así que van más
lentos. Son planos quietos, de 0,38 a 1,08 de movimiento medido, y a esa
velocidad no se ve la cámara lenta. Los cuatro dejan un fotograma de holgura:
a cero, `comprobar-inserciones.py` no avisa pero cualquier redondeo congela el
último fotograma.

Los dos huecos empiezan y acaban **en cortes del propio clip**, así que no
queda ningún trozo de la base al aire entre plano y plano.

## Cartelas

| Entra | Sale | Texto | Pie | Sobre qué |
| --- | --- | --- | --- | --- |
| 0,60 s | 5,40 s | Camino de Santiago / **organizado en hoteles** | — | «con Santiago Ways la relación ha sido fantástica», 0,70-5,28 |
| 17,90 s | 22,50 s | Teléfono de asistencia / **24/7** | — | «poder tener un número de apoyo 24 horas todos los días del viaje», que tras el corte empieza en 17,4 |
| 30,24 s | 36,04 s | Hoteles / **seleccionados** | Habitación y baño privados | Los cuatro planos de alojamiento |
| 48,40 s | 51,40 s | Tu Camino / **empieza aquí** | — | El cierre, sobre la senda |

En negrita, lo que lleva el recuadro verde.

**Cuerpo de 70 y no los 76 de los otros reels.** «organizado en hoteles» con
su recuadro mide 919 px a 76 sobre un lienzo útil de 936, y «Teléfono de
asistencia» 887. Con 17 px de holgura una cartela no se da por buena, porque
las líneas no se parten solas: se salen del lienzo. A 70 la peor baja a 846.

**El margen inferior se queda en 480**, el de siempre. Aquí la pareja está
sentada y a media altura: medida sobre catorce fotogramas, la barbilla más
baja de la pieza cae en el píxel 950 de los 1920, y el bloque de texto arranca
en 1290. No hace falta bajarlo como en el otro reel en español.

## El cierre

El clip terminaba de golpe sobre la senda, sin logo y sin CTA. Se le ha puesto
el cierre de la línea: el titular sobre el último plano y después la placa con
el logo centrado y la web. Son 2,4 s por detrás de los 51,91 del montaje.

## El recorte de duración

El clip duraba 64,98 s, que es mucho para un reel. Se le quitan **13,07 s en
tres tramos**, los tres cortando por el silencio entre frases y los tres por
las razones de la regla 7: lo que se repite o se queda a medias.

| Sale | Vuelve | Dura | Qué se va |
| --- | --- | --- | --- |
| 13,60 s | 17,70 s | 4,10 s | «y nada, conforme llevamos», que se queda a medias y no dice nada |
| 31,22 s | 37,70 s | 6,48 s | «es fácil que… y esperemos que no, tocaremos madera… pero es posible, tener eso es muy…» |
| 57,46 s | 59,95 s | 2,49 s | «contaríamos con ellos», que es la misma idea que el «así que contaremos con ellos» del final |

El segundo es el que más se nota y el que más gana. Al quitar la broma de
tocar madera queda «una peregrinación requiere esfuerzos **y**» pegado a
«**bueno**, nos da mucha tranquilidad», que es exactamente como se hablaría si
la broma no hubiera existido.

**Las junturas.** Esta pista no lleva música: los seis huecos sin voz miden
entre −35,6 y −38,6 dB y lo que hay es viento y sala, sin cuerpo en medios.
Así que no hacen falta ni la rampa de nivel ni el cuadre de pulso, que son
para pistas con música mezclada. Sí llevan fundido cruzado de verdad, de
0,10 s, con material de los dos lados y ganancias en raíz, y el lado que se
apaga sale de dentro del propio hueco, no de detrás del corte.

Medidas sobre el resultado: escalones de −2,7, +2,6 y −5,0 dB de rms. Los dos
primeros van por debajo de una inserción, así que el cambio de sala cae con un
cambio de imagen; el tercero cae en un corte de plano del propio montaje. Sin
chasquidos: el pico entre muestras en las tres junturas se queda en el
percentil 13, 76 y 15 de la pieza.

**Y los dos parpadeos que dejaba el corte.** El primero dejaba el plano del
camino asomando 0,20 s antes del empalme y después saltando dentro de la misma
toma, porque los dos extremos del corte caían en el mismo plano: la gente que
anda daba un brinco. El segundo dejaba 0,43 s del plano de la mesa. Los dos se
tapan enteros, de límite de plano a límite de plano:

| Entra | Sale | Plano | Encuadre |
| --- | --- | --- | --- |
| 13,40 s | 16,03 s | Peregrina entre muros de piedra | 0,55 |
| 26,70 s | 28,10 s | Remanso del río, sobre «nos da mucha tranquilidad» | 0,43 |

## El audio del render

Lo que sale de Remotion lleva el audio **43 ms por detrás de la imagen**: 2048
muestras a 48 kHz, que es el retardo de arranque del codificador AAC. No lo
compensa ni Remotion ni el contenedor. Se midió comparando el render con su
montaje de origen: la imagen casa en el fotograma cero y el audio en +2048.
`entregar.py` lo cuadra tirando esas 2048 muestras, que son el propio arranque
del codificador. **Se pasa a todo lo que se entregue.**

## Lo que queda por decidir

- **El cierre de marca es añadido.** El clip terminaba de golpe sobre la
  senda, sin logo y sin CTA, y eso va contra la guía. Son 2,4 s por detrás de
  los 51,91 del montaje. Si no se quiere, se quita.
- El letrero de «SANTIAGO de COMPOSTELA» se ha ido entero para dejar sitio a
  los hoteles. Si se quiere conservar, cabe recuperarlo donde ahora está el
  puesto de piedras pintadas, del 23,43 al 26,70, que es el plano más flojo de
  los que quedan.
