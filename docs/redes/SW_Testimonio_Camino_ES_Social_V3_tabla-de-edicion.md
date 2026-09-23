# Testimonio del Camino · español · redes · V3

Pieza de 55,1 s, 1280x720 a 30 fps. Sale de la pieza social antigua, que
duraba 60,1 s con cartela de agencia, fundido final y dos marcas de agua.

Fuentes vivas:

- `video/src/SWSocialCaminoES.tsx` · la escena
- `herramientas/scripts/montaje-social-ES.py` · la base, `social-ES-v3.mp4`
- `herramientas/scripts/ambiente.py` · las camas de ambiente

## Qué se quitó del original

| Qué | Dónde estaba | Cómo salió |
| --- | --- | --- |
| Cartela de agencia de entrada | 0,00 – 1,585 s | Recorte por delante |
| Fundido a negro de salida | desde 58,892 s | Recorte por detrás |
| Marca de agua de la herramienta de recorte | esquina inferior derecha, todo el metraje | Recorte del borde inferior |
| Logo viejo de la agencia | misma esquina, superpuesto | Igual, sale en el mismo recorte |

El recorte se lleva el 14,4 % del alto y devuelve el formato original con un
zoom de 1,17x. Se eligió ese borde porque es el que menos imagen pierde. No se
rellenó el hueco: sobre la piedra y el contraluz, que es lo que hay en esa
esquina, el relleno deja una banda blanda que se ve.

## Qué se quitó del testimonio

**Un tramo de 9,6 s** que repetía una idea ya dicha y terminaba en una frase a
medias. La misma idea estaba dos frases antes, mejor dicha.

**Otro de 5,15 s en el que habla un segundo peregrino**, entre el segundo 20 y
el 25 del montaje anterior. En el original se le daba plano justo después de
esa frase, y ese plano cayó con el primer recorte, así que quedaba una voz sin
cara. Fuera entero.

Con eso la pieza es de una sola voz, la del peregrino que sí aparece en
cámara, y todo lo que se oye está sincronizado con lo que se ve.

Los dos cortes van por el silencio entre frases, con fundidos de 40 a 60 ms a
cada lado. No hay música de fondo, solo ambiente, así que la juntura no se
oye.

## Qué se añadió

**Tres segundos de apertura** por delante. La pieza arrancaba con un bosque a
contraluz velado, con un muro de hormigón al fondo. Ese plano sigue en la
pieza, pero entra en el segundo 5,60 y dura 3,1 s.

**Siete segundos de alojamiento** en el hueco que deja el segundo peregrino,
justo después de que el peregrino diga «los dos alojamientos que llevamos». Es
lo que contaba y no había imagen.

Los dos tramos van sin voz, con una cama de ambiente sacada de los silencios
del propio montaje. La pieza no lleva música: poner una sólo en esos diez
segundos sonaría a parche. Si se quiere una cama musical, hace falta una pista
con licencia y se monta debajo de toda la pieza, no de un trozo.

## Planos de recurso

Van mudos, solo imagen: el audio que suena es siempre el continuo de la base.

| Entra | Sale | Qué se ve | De dónde | Para qué |
| --- | --- | --- | --- | --- |
| 0,00 s | 1,60 s | Prado con flores y peregrinos al fondo | `brutos/campo-flores` | Apertura |
| 1,60 s | 3,00 s | Túnel de árboles a contraluz, un peregrino | `brutos/contraluz` | Apertura |
| 3,00 s | 4,10 s | Camino abierto sobre las lomas | `brutos/camino-abierto` | Apertura |
| 4,10 s | 5,60 s | Pareja entre muros de piedra | `brutos/pareja-muros` | Apertura |
| 5,60 s | 8,70 s | El bosque a contraluz del original | base | Va aquí y no al principio |
| 8,70 s | 9,80 s | Grupo entre mimosas | `brutos/grupo-mimosas` | Apertura |
| 9,80 s | 10,75 s | Paso de piedras sobre el río | `brutos/rio-piedras` | Apertura |
| 23,00 s | 30,00 s | Casa rural · habitación · baño · mesa de piedra · terraza | `brutos/` y `brutos/testimonios/` | Bloque de alojamiento |
| 39,45 s | 41,25 s | Peregrino con mochila grande | base | Rompe 4,2 s de entrevista seguida |
| 45,00 s | 47,05 s | Plaza del Obradoiro con peregrinos | `testimonios/obradoiro` | Arregla el corte del segundo 40 |
| 47,05 s | 52,00 s | Fachada del Obradoiro | `testimonios/fachada-obradoiro` | El cierre se dice sobre la catedral |

Sobre el corte del segundo 40: el montaje encadenaba tres planos de la
catedral casi iguales, los tres torres contra nubes, y el del medio se veía
como un salto. El plano de la plaza pone gente a pie de calle entre el general
y el detalle, y la llegada queda como una secuencia.

Los planos de `brutos/` son de 1920x1080 y se ven más nítidos que la base, que
viene de un recorte con zoom. En la apertura y en el cierre eso juega a favor.

## Cartelas

| Entra | Sale | Texto | Pie | Sobre qué |
| --- | --- | --- | --- | --- |
| 0,60 s | 5,40 s | Algunos viajes / **dejan huella** | Camino de Santiago | Apertura |
| 14,20 s | 18,80 s | **Tú caminas.** / Nosotros nos ocupamos del resto | — | «estamos muy contentos con la organización» |
| 23,80 s | 28,80 s | Hoteles / **seleccionados** | Habitación y baño privados | Sobre el bloque de alojamiento |
| 31,65 s | 35,85 s | Tu mochila / **viaja sola** | — | Sobre el plano de las maletas |

En negrita, lo que lleva el recuadro verde.

Todas a 58 px y en dos líneas. En la pieza en inglés el cuerpo es de 72, pero
allí el entrevistado está a media altura; aquí está en primer plano y una
tercera línea le llega a la barbilla.

## Cierre

1. 48,45 s · «Tu Camino / **empieza aquí**» sobre la fachada del Obradoiro,
   con el overlay diagonal. La voz del peregrino sigue sonando por debajo: lo
   que se sustituye es sólo la imagen.
2. 51,40 s · Placa de marca. Logo blanco centrado sobre el degradado de verdes
   de la guía, y `santiagoways.com` debajo en blanco.

Termina en la marca, sin fundido a negro.

## Comprobaciones hechas

- La base se volvió a transcribir después de cada corte: quedan ocho frases,
  ninguna partida, y las junturas caen en silencio.
- Se midió el timbre de cada tramo de voz contra los tramos en los que al
  peregrino se le ve hablando en cámara. El tramo que se quitó estaba en
  582 Hz de centroide; los suyos, entre 631 y 770.
- Las camas de ambiente se hicieron eligiendo huecos por factor de cresta. Uno
  de los candidatos llevaba una respiración dentro y se descartó.
- Ninguna toma se repite, ni entre bloques contiguos ni en toda la pieza.
- Ninguna cartela cae sobre una cara, comprobado fotograma a fotograma.

## Lo que falta decidir

- **Subtítulos incrustados.** En redes se ve en silencio. El `.srt` está al
  lado, pero si se quieren quemados hay que decidir dónde: ahora mismo la
  franja de abajo a la izquierda es de las cartelas.
- **Versión vertical** 1080x1920 para reels y stories. El recorte a vertical
  se lleva los laterales, así que hay que revisar plano a plano.
- **Cama musical**, si se quiere. Hace falta una pista con licencia.
- Dos palabras del testimonio venían dudosas en la transcripción y están
  puestas con el mejor criterio: «era saber si podíamos llegar a hacerlo» y
  «recorridos, excursiones». Conviene que alguien las oiga antes de publicar
  el `.srt`.
