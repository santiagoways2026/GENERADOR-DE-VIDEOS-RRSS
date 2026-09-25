# Short · «How long does it take to walk the Camino?» · inglés · 1080x1920 · V1

Pieza de 30,9 s, 1080x1920 a 30 fps. Segundo short de la línea, y se monta
igual que el primero: la receta está en «Cómo se monta un short» del
`CLAUDE.md`, y el razonamiento de cada recurso en
`SW_Divulga_Compostela_EN_V6_tabla-de-edicion.md`. Aquí va sólo lo propio de
esta pieza.

Fuentes vivas:

- `video/src/SWDivulgaDuracionEN.tsx` · la escena
- `herramientas/scripts/recortar-figura.py` · el cambio de fondo
- `herramientas/scripts/entregar.py` · cuadra el audio del render

## El original viene a 360x640

Es lo primero que hay que saber de esta pieza. El clip de partida mide
**360x640 a 363 kb/s**: una cuarta parte del área del clip anterior, que venía
a 720x1280, y una novena parte del lienzo de entrega.

Se sube a 1080x1920 con lanczos, y antes lleva un paso corto de `hqdn3d`,
porque a ese bitrate el bloqueo de la compresión se amplía igual que la
imagen y limpiarlo después ya no sirve. Comparado contra el lanczos a secas,
las ramas del árbol salen algo más definidas y no aparece el crujido que deja
el `unsharp` solo.

Aun así **es una ampliación de tres y se nota**, sobre todo en los planos de
ella, que es donde el ojo busca detalle. Si aparece el original a más
resolución, se rehace la base con las mismas dos órdenes y no hay que tocar
nada más: la escena no cambia.

## Lo que se cambia: la apertura

El clip abría con un rótulo pegado, una caja verde con texto blanco arriba a
la izquierda, **del fotograma 3 al 87**, o sea de 0,10 a 2,90. Medido por los
píxeles verdes de esa esquina, no a ojo.

| | |
| --- | --- |
| Fondo del degradado | El de la placa de cierre: `145deg, #7AA606 0%, #668814 52%, #4F6B0F 100%` |
| Tarjeta | 0,00 s – 3,00 s |
| Vuelta al fondo real | Fundido de 0,40 s |
| Titular sale | 12 fotogramas antes que el fondo |

## El titular: tres líneas, no dos

Al revés que en la pieza anterior. Allí el pelo de la presentadora empezaba en
el píxel 444 y no cabía una tercera línea; aquí el plano es algo más abierto y
**empieza en el 572**, medido sobre diez fotogramas de la tarjeta ya
compuesta. El bloque mide 314 px, arranca en el 130 y acaba en el 444: quedan
128 px limpios por debajo.

| Línea | Cuerpo | Color | Ancho |
| --- | --- | --- | --- |
| HOW LONG DOES IT | 72 | Blanco | 743 px |
| TAKE TO WALK THE | 72 | Blanco | 745 px |
| CAMINO? | 190 | Blanco | 930 px |

**Los cuerpos los fija el ancho.** «CAMINO?» mide 930 px a 190 sobre un lienzo
útil de 960, que es el 97 %. Y la frase no entra en dos líneas: «HOW LONG DOES
IT TAKE TO» ya mide 996 px al cuerpo pequeño, o sea que se sale sola.

## Los rótulos

Dos, y los dos con el degradado del verde de marca y las letras en blanco, que
es lo que quedó fijado en la pieza anterior.

| Entra | Sale | Texto | Sobre qué dice ella |
| --- | --- | --- | --- |
| 0,00 s | 2,90 s | HOW LONG DOES IT / TAKE TO WALK THE / CAMINO? | La tarjeta de apertura |
| 5,15 s | 7,95 s | FULL FRENCH WAY / 4 TO 5 WEEKS | «if you do the full French Camino… it takes around four to five weeks» |
| 12,40 s | 15,85 s | SARRIA / 5 TO 7 DAYS | «the last 100 kilometers from Sarria, which takes about five to seven days» |

**El pie lleva la cifra, no un adorno.** La pieza va de cuánto se tarda, así
que el titular pone la ruta y el pie lo que dura. En la pieza anterior el pie
decía «MOST POPULAR» porque allí el tema era cuántos caminos hay; aquí eso
sobraría, y lo que falta es el número.

Los límites salen de medir los huecos sin voz uno a uno sobre la envolvente de
la pista, no de repartir a ojo:

| Tramo | Qué dice |
| --- | --- |
| 0,12 – 2,06 | «How long does it take to walk the Camino de Santiago?» |
| 4,38 – 5,92 | «if you do the full French Camino» |
| 6,56 – 7,54 | «it takes around four to five weeks» |
| 10,00 – 12,28 | «a very common option is the last 100 kilometers» |
| 12,42 – 12,94 | «from Sarria» |
| 14,66 – 15,28 | «five to seven days» |
| 26,98 – 27,78 | «It depends on you» |

## Los planos de recurso

Uno por rótulo, y los dos **sobre la cifra y no sobre el nombre**: así el
rótulo cae sobre el paisaje en vez de sobre su cara, y la base vuelve a ella
en cuanto sigue hablando.

| Entra | Sale | Plano | Por qué |
| --- | --- | --- | --- |
| 6,55 s | 7,90 s | `brutos/camino-abierto` | Cinco semanas es distancia, y distancia es un general con la gente pequeña |
| 14,55 s | 15,85 s | `testimonios/mojon-peregrinas` | El mojón con la vieira y la flecha es la imagen de los últimos 100 km |

**El camino abierto sale de `brutos/`, que va a 1080p.** Recortar un 16:9 a
vertical deja el 33,75 % del ancho, así que en un plano general la resolución
del origen se nota más que en ningún otro sitio. Dura 1,17 s y hacen falta
1,35, así que va a `ritmo` 0,85: la gente ocupa poco y ahí el 15 % no se lee
como cámara lenta.

**El mojón no empieza en el segundo 0.** Hasta el 1,6 la peregrina que cruza lo
tapa entero y el plano es un primer plano de espaldas y piernas; desde ahí
sale de cuadro y queda limpio. `origen` va en 1,6.

**Y los dos encuadres se corrigieron a ojo**, que es la regla 21:
`encuadrar.py` proponía `mirar(0.43)` en el mojón, por la cara de la peregrina
que cruza, y con eso el mojón se quedaba fuera de cuadro. A `mirar(0.21)` entra
entero. El primer plano que se probó para el otro hueco, `peregrino-embalse`,
se cayó por lo mismo: recortado a vertical es un peregrino colocándose la
mochila y el degradado del rótulo le cortaba la cabeza.

## El cierre

El clip dice 33,90 s, pero **los últimos 4,62 son negro y silencio**, y antes
hay un fundido a negro que arranca en 28,60, medido sobre la media de cada
fotograma. La guía no funde a negro: la imagen se corta en 28,25 y la placa de
marca entra en 27,95, por encima del fundido.

**La pista va aparte y dura hasta 28,10.** La última frase es «It depends on
you» y se apaga en 27,78. Detrás hay una sílaba suelta del 29,02 al 29,26, ya
sobre el negro del clip, que ahí no dice nada y se va.

Los 2,8 s de placa van en silencio, que es lo de la regla 11: sobre una placa
quieta y al final de una pieza, el silencio se lee como que ha terminado.

El logo va a 560 px de ancho, como en la pieza anterior.

## Lo que no hizo falta

- **Marca de agua no hay.** Medido el mínimo temporal de cada píxel en los
  cuatro bordes: ni un píxel por encima de 200 en todo el metraje con imagen.
  Así que no hay recorte, y la base conserva el encuadre entero.
- **Cortes de plano tampoco.** Es un plano único de ella con dos saltos de
  montaje dentro, en 7,87 y 17,57, que no cambian el encuadre. La base va en un
  solo `OffthreadVideo`, no troceada.
- **La chapa de Santiago Ways del segundo 19,5** es del propio clip y se queda:
  es de la marca.

## Cómo se rehace el archivo

Los montajes no entran en el repositorio. Estas dos órdenes, en este orden:

```bash
ffmpeg -i bruto.mp4 \
    -vf "hqdn3d=2:1:3:3,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0.0" \
    -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a copy \
    duracion-1080.mp4
python3 herramientas/scripts/recortar-figura.py duracion-1080.mp4 \
    video/public/montajes/duracion-abre.mp4 --hasta 3.0 --vuelta 0.4
```

La segunda necesita `herramientas/scripts/u2net_human_seg.onnx`, que pesa
176 MB y por eso no va en el repositorio. El propio script dice el `curl`.

## Lo que queda por decidir

- **Si aparece el original a más resolución**, se rehace la base y la pieza
  gana lo que se pierde ahora en la ampliación.
- **El fondo sólo cambia en la apertura.** Si interesa que vaya recortada toda
  la pieza, el script lo hace subiendo `--hasta`.
