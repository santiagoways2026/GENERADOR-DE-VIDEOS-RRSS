# Testimonio de la pareja · español · reel · V1

Pieza de 67,8 s, 1080x1920 a 30 fps. Sale de un clip vertical de 720x1280 que
venía de un editor online.

Fuentes vivas:

- `video/src/SWReelAsistenciaES.tsx` · la escena
- `video/public/montajes/testimonio-ES2.mp4` · el clip ya sin marca de agua
- `herramientas/scripts/marca-agua.py` · el recorte
- `herramientas/scripts/encuadrar.py` · dónde mirar en cada plano de recurso

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

Los montajes de origen no entran en el repositorio, así que el archivo se
vuelve a hacer con el clip original y esta línea:

```bash
python3 herramientas/scripts/marca-agua.py bruto.mp4 \
    video/public/montajes/testimonio-ES2.mp4 \
    --zona 500,1200,220,80 --modo recorte --calidad 21
```

`--zona` va con margen de sobra: el script encuentra la silueta dentro.

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

**Los hoteles.** Del 40,53 al 46,80 había 6,27 s de un rótulo quieto, el seto
recortado de «SANTIAGO de COMPOSTELA». Entran cuatro planos de alojamiento
debajo de la cartela de hoteles:

| Entra | Sale | Plano | Encuadre | Velocidad |
| --- | --- | --- | --- | --- |
| 40,53 s | 42,60 s | Habitación con ventanal al embalse (1080p) | 0,55 | 1,00 |
| 42,60 s | 44,05 s | Habitación doble | 0,35 | 0,68 |
| 44,05 s | 45,40 s | Salón del hotel | 0,35 | 0,86 |
| 45,40 s | 46,80 s | Baño privado | 0,50 | 0,85 |

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
| 22,00 s | 26,60 s | Teléfono de asistencia / **24/7** | — | «poder tener un número de apoyo 24 horas todos los días del viaje», 21,5-25,5 |
| 40,80 s | 46,60 s | Hoteles / **seleccionados** | Habitación y baño privados | Los cuatro planos de alojamiento |
| 61,40 s | 64,50 s | Tu Camino / **empieza aquí** | — | El cierre, sobre la senda |

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
el logo centrado y la web. Son 2,8 s por detrás de los 64,98 del clip.

## Lo que queda por decidir

- **La pieza dura 67,8 s.** Es larga para un reel. Si interesa acortarla, el
  sitio está en el tramo del 33 al 40, donde se repite la idea de la
  tranquilidad, y en el del 55 al 60. Eso sí, cortar ahí mueve el audio y hay
  que medir las junturas.
- El letrero de «SANTIAGO de COMPOSTELA» se ha ido entero para dejar sitio a
  los hoteles. Si se quiere conservar, cabe recuperarlo donde ahora está el
  puesto de piedras pintadas, del 27,53 al 30,80, que es el plano más flojo
  de los que quedan.
