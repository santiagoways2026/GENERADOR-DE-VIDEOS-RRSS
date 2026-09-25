# Testimonio del Camino · español · reel vertical · V1

Pieza de 44,9 s, **1080x1920** a 30 fps. Es la V9 horizontal puesta de pie.

Fuentes vivas:

- `video/src/SWReelCaminoES.tsx` · la escena
- `video/src/SWSocialCaminoES.tsx` · la horizontal, de la que sale
- `herramientas/scripts/encuadrar.py` · dónde mirar en cada plano
- `herramientas/scripts/comprobar-inserciones.py` · mide que cada plano llega

## Qué se ha tocado y qué no

**El montaje no cambia.** Mismos cortes, mismos planos, mismo audio y mismas
cartelas en los mismos segundos que la V9 horizontal. Si hay que cambiar el
montaje, se cambia en las dos.

Cambian tres cosas: el encuadre de cada plano, el tamaño del texto y dónde se
apoya ese texto.

## El encuadre, que es casi todo el trabajo

Pasar de 16:9 a 9:16 con `cover` deja ver **el 33,75 % del ancho**. No es un
recorte menor: de cada plano se va dos tercios de la imagen, y en estos brutos
lo que vive en los lados suele ser justo la gente. Así que **ningún plano se ha
dejado centrado por defecto**: los 20 tramos del montaje y las 12 inserciones
llevan su `encuadre`, medido y después mirado en un fotograma.

`encuadrar.py` mira tres cosas por este orden: la cara, lo que se mueve y dónde
está el detalle. Los tres hacen falta, y el orden importa:

- **Sólo bordes no vale.** En el plano del peregrino que cruza la vegetación,
  los arbustos tienen mucho más detalle que una persona a cien metros: el
  encuadre se iba a 0,20 y dejaba al peregrino fuera. Con movimiento sale 0,81,
  que es donde está.
- **Sólo movimiento tampoco.** En el plano de la catedral desde la plaza, lo que
  se mueve es la gente que cruza por abajo: salía 0,84 y se llevaba las torres
  fuera de cuadro. Ahí manda el detalle, 0,59.

Y cuatro correcciones a mano, que la herramienta no puede saber:

| Plano | Propone | Va a | Por qué |
| --- | --- | --- | --- |
| Maletas en el portal, 23,37 | 0,85 (la cara) | **0,72** | Debajo está la cartela del equipaje. A 0,85 las cuatro maletas se quedan fuera |
| Grupo en el albergue, 25,00 | 0,06 | **0,40** | A 0,06 quedan dos medias personas contra el borde |
| Camino abierto, 1,50 | 0,42 | **0,68** | A 0,42 el peregrino de la izquierda se parte por la mitad |
| Habitación, 17,50 | 0,25 | **0,55** | La cama tiene que verse: a 0,25 sólo queda el ventanal |

Un aviso para la próxima: **`objectPosition` no es «el punto de la imagen»**.
Como sólo se ve el 33,75 % del ancho, un `71 %` no centra el recorte en el 71 %
de la imagen sino en el 64 %. Por eso en el código se escribe `mirar(0.71)` y
no el porcentaje a pelo.

## El texto

| | Horizontal | Este reel | Los reels EN y DE |
| --- | --- | --- | --- |
| Lienzo | 1280x720 | 1080x1920 | 1080x1920 |
| Cuerpo del titular | 58 | **52** | 76 |
| Cuerpo del pie | 21 | **26** | 34 |
| Margen | 64 | 72 | 72 |
| Margen inferior | 64 | **360** | 480 |
| Cierre | 72 | 76 | 76 |

**Por qué 52 y no 76.** El titular más largo, «Nosotros nos ocupamos del
resto», mide 1320 px a 76 sobre un lienzo útil de 936. A 60 mide 1042, que
tampoco entra, y hay que partirlo en tres líneas. A 52 mide 903 y cabe en una.

**Por qué 360 de margen inferior y no 480.** Al recortar a 9:16 un plano medio
de 1280x720 la cara se amplía 2,67 veces: el entrevistado ocupa del píxel 628
al 1400 de los 1920, y debajo de la barbilla quedan 520 px para el texto y el
margen. Con 480 el recuadro verde de «Tú caminas.» caía **sobre el bigote**, y
un rótulo no tapa una cara. Con 360 el bloque arranca en 1444, que ya es la
camiseta. Los 360 siguen dejando fuera la franja que tapan la barra de enviar
mensaje y los botones de la derecha.

## Cómo está armada la escena

**El montaje base va troceado en 20 tramos**, uno por cada corte suyo, porque
cada plano necesita su encuadre. Los tramos que quedan tapados por una
inserción llevan el encuadre que propone la herramienta y van marcados
`tapado` en el código: no se han revisado uno a uno porque no se ven.

**El audio va aparte y entero**, en un solo `Audio`. Si la pista fuese pegada a
cada trozo de imagen, cada juntura sería un corte de audio, y son veinte. Así
suena exactamente igual que la pieza horizontal, que es lo que se quiere.

## Cartelas

| Entra | Sale | Texto | Pie |
| --- | --- | --- | --- |
| 0,60 s | 5,20 s | Algunos viajes / **dejan huella** | Camino de Santiago |
| 11,20 s | 15,80 s | **Tú caminas.** / Nosotros nos ocupamos del resto | — |
| 16,60 s | 20,80 s | Hoteles / **seleccionados** | Habitación y baño privados |
| 21,40 s | 25,80 s | Tu mochila / **viaja sola** | — |
| 38,40 s | 41,10 s | Tu Camino / **empieza aquí** | — |

En negrita, lo que lleva el recuadro verde.

## Los subtítulos

Los mismos que la horizontal, `SW_Testimonio_Camino_ES_Social_V9.srt`: el audio
es el mismo archivo y los tiempos no se mueven.
