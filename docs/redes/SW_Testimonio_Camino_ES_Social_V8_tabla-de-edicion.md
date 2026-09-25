# Testimonio del Camino · español · redes · V8

Pieza de 44,9 s, 1280x720 a 30 fps. Sale de la pieza social antigua, que
duraba 60,1 s con cartela de agencia, fundido final y dos marcas de agua.

Fuentes vivas:

- `video/src/SWSocialCaminoES.tsx` · la escena
- `herramientas/scripts/montaje-social-ES.py` · la base, `social-ES-v3.mp4`
- `herramientas/scripts/ambiente.py` · las camas de ambiente
- `herramientas/scripts/comprobar-inserciones.py` · mide que cada plano llega

## Qué cambia respecto a la V6

**Tres parpadeos, tapados, y una herramienta nueva para cazarlos.**

Los dos primeros, en la juntura del corte. Al quitar el tramo del
segundo peregrino, el montaje deja a los dos lados del corte el final de un
plano y el principio del siguiente. Medidos sobre la base: **0,20 s y 0,10 s**.
A esa duración no se leen como planos, se leen como un parpadeo.

Se tapan con imagen, que es lo que dice la regla 8, y sale gratis: el montaje
tenía un plano de maletas justo dentro del tramo que se ha quitado, así que la
idea del equipaje se había quedado sin imagen. Entra ahí, del 19,5 al 20,9,
sobre «hemos cogido el servicio de recogida de equipaje».

El tercero salió al medir el archivo ya renderizado: entre los planos de
apertura, el montaje asomaba **0,43 s** en el segundo 5,27. Los dos planos de
esa zona entran ahora en 5,27 y salen en 7,60, que son los dos límites de
plano de la base, en vez de en 5,70 y 7,75. El paso de piedras dura 1,00 s de
archivo y el hueco 1,20, así que va a 0,80 de velocidad: es un plano de agua y
no se nota.

Y como esto no se ve a ojo, queda una herramienta:
`planos-visibles.py <escena.tsx> <base.mp4>` cruza los cortes de la base con
las inserciones y lista lo que se ve menos de medio segundo. Se pasa junto con
`comprobar-inserciones.py`: uno mide que el plano llegue hasta donde se le
pide, el otro mide lo que se ve entre plano y plano. La pieza da **ningún
parpadeo**.

## Qué cambió de la V5 a la V6

**Fuera las dos camas de ambiente, y con ellas diez segundos de pieza.**

El aviso era que sonaba un eco de fondo. Y es literal: sintetizar ruido con
fase aleatoria **dispersa la fase**, que es exactamente lo que hace un
reverberador. Por eso una cama sintética, por bien nivelada y por plana que
tenga la potencia, arrastra siempre esa cola de sala grande que no pega con
una grabación de campo.

Lo siguiente que se probó fue lo evidente: pegar silencios de verdad del
master. **No llega.** Medidos con VAD y filtrados por factor de cresta, en los
57,3 s del limpio hay seis huecos y **2,71 s** de ambiente aprovechable:

| Hueco | Dura | Nivel | Cresta |
| --- | --- | --- | --- |
| 0,07 – 1,06 | 0,99 s | -37,3 dB | 3,9 |
| 11,02 – 11,27 | 0,24 s | -44,1 dB | 3,0 |
| 20,08 – 20,83 | 0,76 s | -34,3 dB | 3,4 |
| 33,15 – 33,41 | 0,26 s | -23,2 dB | 2,8 |
| 40,21 – 40,45 | 0,24 s | -29,6 dB | 4,0 |
| 46,63 – 46,85 | 0,22 s | -28,7 dB | 3,6 |

Harían falta 10,3 s. Repetir el hueco largo cuatro veces es el bucle que avisa
la regla 11, y además los niveles van de -23 a -44 dB, así que ni siquiera son
la misma sala.

Así que los diez segundos sin voz se van. **La pieza pasa de 54,9 a 44,9 s** y
no queda ni un tramo sin testimonio. Los planos que vivían en esos huecos no
se pierden: siguen en la pieza, pero como inserciones sobre la voz, que es
donde tenían que haber estado desde el principio.

| Antes | Ahora |
| --- | --- |
| Tres segundos de ambiente y planos de apertura, sin voz | Los mismos planos sobre «venir al Camino era un desafío personal» |
| Siete segundos de ambiente y planos de alojamiento, sin voz | Casa rural y habitación sobre «los dos alojamientos que llevamos», 16,5 – 19,5 |

Y hay un efecto secundario que se agradece: con el corte del segundo peregrino
metido dentro del montaje y no rodeado de camas, **la frase del equipaje se
oye entera**. Antes se quedaba en «el servicio de recogida de…»; ahora dice
«el servicio de recogida de equipaje».

## Qué cambió de la V4 a la V5

**Las dos camas de ambiente sonaban rotas, y era un fallo de la síntesis.**
Se oía al principio y en el segundo 23, que es justo donde están.

1. **Una línea a 43 Hz.** `sintetiza()` solapa ventanas de ruido con fase
   aleatoria, y con ventana de Hann eso no suma amplitudes sino potencias:
   w² + w² vale 1 en el centro de la ventana y 0,5 en el cruce, así que la
   cama salía con 3 dB de temblor al ritmo del salto, los 44100 entre los
   2048 de ventana. Medido sobre la envolvente de la V4: una línea a 43 Hz
   que destacaba **7,5 veces** sobre el resto en la apertura y **10,1** en la
   de hoteles. A esa frecuencia no se oye como trémolo, se oye como un ruido
   raro. Con la ventana en raíz, la potencia queda plana y la línea baja a
   **2,1 y 1,6**, que es el suelo.
2. **La cama de hoteles cuadraba por un lado y no por el otro.** El ambiente
   de esta grabación no es constante: el hueco del corte A está a -33,4 dB y
   el del corte B a -25,4, ocho de diferencia. Con un solo nivel, la cama
   entraba bien y salía ocho por debajo de lo que venía detrás, así que al
   volver el testimonio parecía que el audio subía de golpe. Va con una rampa
   de un nivel al otro: ocho dB en siete segundos no se oyen como rampa, se
   oyen como que la sala era así. Medido, el empalme de salida pasa de 8 dB
   de escalón a 2,7.

Además la pieza ya no arranca de golpe: la cama de apertura entra con un
fundido de 0,25 s.

## Lo que sigue sin tener voz, y por qué

Quedan **tres segundos al principio y siete en el 23** en los que sólo suena
ambiente. No es un fallo, es cómo está montada la pieza:

- Los tres del principio son la apertura nueva, que sustituye al bosque a
  contraluz con el que arrancaba el original.
- Los siete del 23 son el bloque de alojamiento, que entró en lugar de los
  5,15 s en los que habla un segundo peregrino al que no se ve nunca.

Se pueden quitar los dos, pero cambia el montaje: habría que poner la voz por
debajo de esos planos, y entonces la pieza pasa de 54,9 a unos 45 s y las
cartelas dejan de caer sobre la frase que ilustran. **Está sin hacer a
propósito, a la espera de decidirlo.**

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

La cama **no es un bucle**. Se probó encadenando los silencios y se oía: duran
medio segundo, así que el ciclo volvía cada segundo y medio, y las mitades
invertidas sonaban al revés. Ahora se saca la huella espectral de esos
silencios, que es el color de la sala, y se sintetiza con fase aleatoria: sale
continuo, sin ciclo y sin nada reconocible dentro. Cada cama va nivelada
contra el ambiente con el que empalma, no contra la media de la pieza, y las
junturas llevan fundido cruzado de verdad, con material de los dos lados del
corte.

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
| 44,40 s | 45,70 s | Calle de Santiago con peregrinos entrando | `testimonios/rua-santiago` | Llegada |
| 45,70 s | 47,00 s | Plaza del Obradoiro con peregrinos | `testimonios/obradoiro` | Llegada |
| 47,00 s | 52,02 s | Fachada del Obradoiro | `testimonios/fachada-obradoiro` | El cierre se dice sobre la catedral |

Sobre los cortes del final: el montaje encadenaba tres planos de la catedral
casi iguales, los tres torres contra nubes. Ahora la llegada va de lejos a
cerca y con gente en medio, la calle y la plaza, y se lee como una secuencia.

Y había un fallo de bulto que arreglar: al plano de la plaza se le pedían
2,05 s y sólo tiene 1,33. `OffthreadVideo` no avisa de eso, congela el último
fotograma, así que había 0,72 s de imagen parada en el segundo 46. De ahí sale
`comprobar-inserciones.py`, que mide cada inserción contra su archivo. Ahora
todas tienen holgura.

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
2. 51,20 s · Placa de marca. Logo blanco centrado sobre el degradado de verdes
   de la guía, y `santiagoways.com` debajo en blanco.

Termina en la marca, sin fundido a negro.

## Comprobaciones hechas

- La base se volvió a transcribir después de cada corte: quedan ocho frases,
  ninguna partida, y las junturas caen en silencio.
- Se midió el timbre de cada tramo de voz contra los tramos en los que al
  peregrino se le ve hablando en cámara. El tramo que se quitó estaba en
  582 Hz de centroide; los suyos, entre 631 y 770.
- Las camas de ambiente se hicieron eligiendo huecos por factor de cresta. Dos
  de los candidatos llevaban algo dentro, una respiración y un golpe de aire,
  y se descartaron.
- La autocorrelación de la cama de apertura da 0,06 fuera del cero: no hay
  ciclo audible. Y cada cama queda a menos de 1,5 dB del ambiente con el que
  empalma.
- Todas las inserciones tienen holgura sobre la duración real de su archivo,
  medida en fotogramas.
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
