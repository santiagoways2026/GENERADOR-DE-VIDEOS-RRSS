# Divulgación · «What is the Camino de Santiago?» · inglés · reel · V1

Pieza de 52,6 s, 1080x1920 a 30 fps. Sale de un clip vertical de 720x1280 ya
montado, con sus subtítulos palabra a palabra.

Fuentes vivas:

- `video/src/SWDivulgaCompostelaEN.tsx` · la escena
- `herramientas/scripts/recortar-figura.py` · el cambio de fondo
- `herramientas/scripts/marca-agua.py` · el recorte de la marca
- `herramientas/scripts/entregar.py` · cuadra el audio del render

## Esto no es un testimonio

Y no se monta como uno. **No lleva las cartelas del kit ni el cierre de
marca**: el clip ya viene montado, con sus subtítulos y su chapa de Santiago
Ways en el segundo 26. De la receta del testimonio sólo se aplican el recorte
de la marca de agua y el paso de entrega.

El registro del texto también es otro, y es el que se pidió: **Manrope 800 en
caja alta y centrado**, no Montserrat 900 en minúscula y a la izquierda.
Manrope es de la cascada oficial y 800 es su peso máximo, así que «extra bold»
aquí es literalmente el tope de la familia.

## Lo que se cambia: la apertura

El clip abría con un rótulo pegado, una caja verde con texto blanco arriba del
cuadro, del segundo **0,20 al 2,77**. En su sitio va un titular grande, y para
que se lea hay que **quitarle el fondo a la presentadora**: el bambú de detrás
es demasiado ruidoso para poner texto encima.

| | |
| --- | --- |
| Fondo del degradado | Bosque `#184834` arriba a olivo `#7AA606` abajo |
| Tarjeta | 0,00 s – 2,90 s |
| Vuelta al bambú | Fundido de 0,40 s |
| Titular sale | 12 fotogramas antes que el fondo |

## El recorte

Se hace con **u2net_human_seg**, de las releases de `danielgatis/rembg`. Se
probó antes `human_segmentation_pphumanseg`, de opencv_zoo, que pesa 6 MB
contra 176 y va mucho más rápido: **no sirve**. Trabaja a 192x192 sobre un
lienzo de 720x1280, así que además de submuestrear cuatro veces le llega la
persona aplastada de ancho. En el fotograma de prueba le metía una caña de
bambú por la mejilla y dejaba fondo pegado en las esquinas de abajo. u2net va
a 320x320 y sin deformar, y sale limpio de pelo, contorno y cara.

Dos cosas más que hace el script, y las dos hacen falta:

- **Se queda sólo con la mancha grande.** El modelo enciende trozos sueltos
  del fondo; la persona es una sola región conexa.
- **Suaviza el alfa en el tiempo**, con una media de tres fotogramas. Sin eso
  el contorno hierve, porque el modelo no sabe que los fotogramas van seguidos
  y cada uno le sale un poco distinto.

## La persona no se encoge

Se probó encogerla al 86 % y pegarla abajo, que es como sale en el modelo que
se pasó y deja sitio de sobra para el titular. **No vale**, por el fundido de
vuelta: sea cual sea la forma de deshacerlo, en esas cuatro décimas se ven las
dos, la pequeña y la de tamaño natural, una encima de otra. Y si en vez de
fundir se corta, el salto de tamaño sobre la misma persona se lee como un
fallo de montaje.

Así que el titular se ajusta a ella. Medido sobre siete fotogramas de la
tarjeta, **su pelo empieza en el píxel 444 de 1920**.

## El titular

| Línea | Cuerpo | Color | Ancho |
| --- | --- | --- | --- |
| WHAT IS THE CAMINO DE | 74 | Blanco | 880 px |
| SANTIAGO? | 162 | Lima `#B0F808` | 914 px |

**Dos líneas y no tres.** El modelo que se pasó lleva tres, una de entrada
grande, una de enlace pequeña y el sujeto enorme abajo. Con esos cuerpos el
bloque acaba en el píxel 442, justo donde empieza su pelo. Con dos, el bloque
mide 231 px, arranca en 130 y acaba en 361: ochenta píxeles limpios. Y el
sujeto se queda igual de grande, que es lo que da el golpe: 914 px de ancho
sobre un útil de 960, el 95 %, que es la proporción del modelo.

Entran con el movimiento de la guía, fundido más desplazamiento corto de
26 px con `cubic-bezier(0.22,0.61,0.36,1)`, seis fotogramas de relevo entre
línea y línea. Nunca rebote.

## La marca de agua

`clideo.com`, abajo a la derecha, la misma del editor de los otros clips.
Medida sobre el mínimo temporal de cada píxel: y 1228 a 1253, x 523 a 693. Se
quita recortando, 4,8 % por abajo y otro tanto por los lados.

## Cómo se rehace el archivo

Los montajes no entran en el repositorio. Estas dos líneas, en este orden:

```bash
python3 herramientas/scripts/marca-agua.py bruto.mp4 \
    video/public/montajes/compostela.mp4 \
    --zona 500,1200,220,80 --modo recorte --calidad 21
python3 herramientas/scripts/recortar-figura.py \
    video/public/montajes/compostela.mp4 \
    video/public/montajes/compostela-abre.mp4 --hasta 2.9 --vuelta 0.4
```

La segunda necesita `herramientas/scripts/u2net_human_seg.onnx`, que pesa
176 MB y por eso no va en el repositorio. El propio script dice el `curl`.

## Lo que queda por decidir

- **La pieza no cierra con la marca.** Acaba con ella hablando, sin logo y sin
  CTA, que es como venía. No se ha tocado porque lo que había gustaba, pero
  la guía pide placa de cierre y aquí no la hay.
- **El fondo sólo cambia en la apertura.** Si interesa que la presentadora
  vaya recortada sobre el degradado toda la pieza, el script lo hace subiendo
  `--hasta`; son unos diez minutos de proceso para los 52 s.
