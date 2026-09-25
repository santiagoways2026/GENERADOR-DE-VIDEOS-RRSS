# Short · «What is the Camino de Santiago?» · inglés · 1080x1920 · V6

Pieza de 50,0 s, 1080x1920 a 30 fps. Sale de un clip vertical de 720x1280 ya
montado, con sus subtítulos palabra a palabra.

Fuentes vivas:

- `video/src/SWDivulgaCompostelaEN.tsx` · la escena
- `herramientas/scripts/recortar-figura.py` · el cambio de fondo
- `herramientas/scripts/marca-agua.py` · el recorte de la marca
- `herramientas/scripts/entregar.py` · cuadra el audio del render

## Esto no es un testimonio

Y no se monta como uno. **No lleva las cartelas del kit**: el clip ya viene
montado, con sus subtítulos y su chapa de Santiago Ways en el segundo 26. De
la receta del testimonio se aplican el recorte de la marca de agua, la placa
de cierre y el paso de entrega.

El registro del texto también es otro: **Montserrat 900 en caja alta y
centrado**. Lo de caja alta y centrado es lo que separa este formato de las
cartelas de testimonio, que van en minúscula y a la izquierda; el peso es el
mismo, porque 900 es el máximo de la familia y es lo que la guía llama el
negro. Se pidió «más gruesa» y ahí no queda margen: lo que se sube es el
cuerpo, que es donde sí lo hay, hasta que la línea larga roza el lienzo.

## Lo que se cambia: la apertura

El clip abría con un rótulo pegado, una caja verde con texto blanco arriba del
cuadro, del segundo **0,20 al 2,77**. En su sitio va un titular grande, y para
que se lea hay que **quitarle el fondo a la presentadora**: el bambú de detrás
es demasiado ruidoso para poner texto encima.

| | |
| --- | --- |
| Fondo del degradado | El de la placa de cierre: `145deg, #7AA606 0%, #668814 52%, #4F6B0F 100%` |
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
| WHAT IS THE CAMINO DE | 66 | Blanco | 883 px |
| SANTIAGO? | 150 | Blanco | 918 px |

**Los cuerpos los fija el ancho, no el alto.** Montserrat 900 en caja alta es
bastante más ancha que Manrope: «SANTIAGO?» mide 918 px a 150 sobre un lienzo
útil de 960, así que a 155 ya se sale. Los dos están al 92 y al 96 % del
ancho, que es el tope real de esta pieza; de ahí no se sube sin partir las
líneas.

## Los rótulos

Los dos van arriba, en caja alta y centrados, y comparten componente.

| Entra | Sale | Texto | Sobre qué |
| --- | --- | --- | --- |
| 0,00 s | 2,90 s | WHAT IS THE CAMINO DE / **SANTIAGO?** | La tarjeta de apertura |
| 20,10 s | 24,30 s | FRENCH WAY / MOST POPULAR | «the French Way starts in France, crossing the Pyrenees» |
| 24,45 s | 26,30 s | PORTUGUESE WAY | «you've also got the Portuguese Camino» |
| 26,55 s | 27,75 s | NORTHERN WAY | «the Northern Way» |
| 27,85 s | 29,30 s | CAMINO PRIMITIVO | «and the Primitivo» |
| 34,30 s | 36,95 s | SARRIA / MOST POPULAR START | «a lot of people start in Sarria, which is the last 100 km» |

Los límites salen de medir los huecos sin voz uno a uno, no de repartir a ojo.
**Todo el texto de la pieza va en blanco**, que es lo que manda la guía sobre
olivo; el fondo es el que cambia, y eso tiene su apartado.

«MOST POPULAR» y «MOST POPULAR START» no son adornos: ella dice «some routes
are more popular» justo antes de la francesa, y «a lot of people start in
Sarria» justo antes de Sarria.

**Arriba y no abajo**, que es donde van las cartelas de testimonio, por dos
cosas: el clip ya trae sus propios subtítulos quemados a media altura, y la
presentadora ocupa de la mitad para abajo, con el pelo empezando en el píxel
444 de 1920.

«MOST POPULAR» no es un adorno: un segundo antes ella dice «some routes are
more popular», así que el pie recoge lo que acaba de decir. Y del 22,2 en
adelante el rótulo cae sobre el plano del puente, que es donde mejor se lee.

## El degradado de los rótulos de ruta

**Degradado del verde de marca y las letras en blanco.** Es la combinación de
la guía, y es la que resuelve el problema de raíz: el fondo deja de depender
del plano que haya detrás, así que no hay nada que medir tramo a tramo.

Se llegó aquí después de descartar tres variantes con el texto en color sobre
un velo de bosque, todas medidas contra el **10 % más claro del fondo real**
de cada tramo, no contra un fondo inventado:

| | Verde de marca `#7AA606` | Lima `#B0F808` |
| --- | --- | --- |
| Velo fino de bosque, 0,45 | 1,15 – 1,44 | 2,57 – 3,23 |
| Velo cerrado, 0,94 | 3,05 | 6,4 |
| Placa opaca de bosque | 3,61 | 8,08 |

El mínimo para texto grande es 3:1. El verde de marca sobre el velo fino no
llega ni de lejos, la lima se queda justo por debajo, y las dos soluciones que
sí entraban, el velo cerrado y la placa, se descartaron a ojo: la placa por
recuadro y el velo cerrado por oscuro.

El degradado que queda baja por la escala de verdes de la guía, `#7AA606`
arriba y `#668814` a la altura del texto, así que el blanco va de **3,1 a
3,4:1** en vez de los 2,88 que da el olivo a pelo:

```
linear-gradient(to bottom,
  rgba(122,166,6,0.97)   0%,
  rgba(112,151,13,0.95) 16%,
  rgba(102,136,20,0.55) 19.5%,
  rgba(79,107,15,0)     23%)
```

**Se apaga en el 23 % del alto, 441 px, y eso lo fija la presentadora.** Con
la cola larga, hasta el 38 %, el borde del degradado le cruzaba la frente y se
veía como una mancha verde sobre la cara: el pelo le empieza en el píxel 470
en los planos de ruta. Por encima de su cabeza el degradado se lee como una
banda de marca; sobre ella, como un fallo.

La sombra del texto se queda. En el borde de abajo el degradado ya está flojo
y es lo que despega el pie.

| Línea | Cuerpo | Ancho |
| --- | --- | --- |
| Nombre de la ruta | 92 | de 362 a 929 px |
| Pie | 54 | de 450 a 646 px |

**Cuerpo 92 para los cinco**, y lo fija el más largo: «CAMINO PRIMITIVO» mide
929 px sobre un lienzo útil de 960. Sin placa entra algo más que antes, que
iba a 88. Cambiar el cuerpo de uno a otro en una lista de cinco rutas se nota,
así que van todos igual.

## Los planos de recurso

Dos, que es lo que se pidió:

| Entra | Sale | Plano | Sobre qué |
| --- | --- | --- | --- |
| 11,45 s | 12,95 s | La catedral, en vídeo | «Santiago de Compostela» |
| 45,40 s | 46,75 s | Llegada, brazos en alto | «the Camino starts wherever you decide» |

**La catedral.** Ahí el clip metía una foto fija de la fachada del Obradoiro,
con fundido de entrada en 11,53 y de salida entre 12,43 y 12,90. El hueco se
toma completo, con los dos fundidos dentro, para que no asome ni un fotograma
de la foto.

**La celebración** va sobre la frase que cierra, que gana mucho más sobre
gente celebrando que sobre un plano de ella hablando. Ese plano **dura 1,13 s
y no hay más**: se buscó en los dos másters de origen, y en `testimonios-EN`
la toma va del 121,40 al 122,57, o sea 1,17 s enteros. Para alargarlo sólo
queda bajarle la velocidad, y ahí manda la regla 15: tiene 4,55 de movimiento
medio, que es mucho, y por debajo de 0,80 se le empieza a ver el cámara
lenta. A 0,80 se queda en 1,37 s.

## El cierre

El clip dice 52,60 s, pero **los últimos 4,65 son negro y silencio digital**,
y antes hay un fundido a negro de medio segundo, del 47,30 al 47,87. La guía
no funde a negro: las piezas cierran con la placa de marca. Así que la imagen
se corta en 47,35 y la placa entra en 46,90, por encima del fundido.

**La pista va aparte y dura hasta 47,45.** La última palabra es «decide» y se
apaga en 47,38, ya sobre el negro del clip, así que se acaba de decir por
debajo de la placa. Detrás hay una sílaba suelta en 47,80-47,94, a −21 dB, que
el clip arrastra y que ahí no dice nada: se va.

El logo de la placa va a 560 px de ancho en vez de los 460 de las otras
piezas.

## El velo de la tarjeta de apertura

La apertura va sobre el degradado de la placa de cierre, que es plano y pone
además su extremo claro arriba, que es donde va el texto. Ahí sí basta con el
velo fino de bosque, que es el mismo recurso que llevan las cartelas de la
línea:

| Sobre | Blanco | Lima `#B0F808` |
| --- | --- | --- |
| Olivo `#7AA606` a pelo | 2,88:1 | 2,23:1 |
| Con el velo de bosque al 45 % | **4,99:1** | 3,87:1 |

El mínimo para texto grande es 3:1. Las dos líneas van en blanco.

**Dos líneas y no tres.** El modelo que se pasó lleva tres, una de entrada
grande, una de enlace pequeña y el sujeto enorme abajo. Con esos cuerpos el
bloque acaba por debajo del píxel 444, que es donde empieza su pelo. Con dos,
el bloque mide 203 px, arranca en 130 y acaba en 333: ciento diez píxeles
limpios.

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

- **El fondo sólo cambia en la apertura.** Si interesa que la presentadora
  vaya recortada sobre el degradado toda la pieza, el script lo hace subiendo
  `--hasta`; son unos diez minutos de proceso para los 52 s.
