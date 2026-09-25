# Reel de hoteles · testimonio en inglés · vertical · V9

Pieza de 49,1 s, 1080x1920 a 30 fps, para stories y TikTok.

Fuente viva: `video/src/SWReelHotelesEN.tsx`.
Pista: `herramientas/scripts/audio-reel-hoteles.py`.

## Qué cambia respecto a la V8

**Las dos junturas de la música.** Sonaban raras las dos, y por tres motivos
distintos que se sumaban. Está contado abajo, en «Las dos junturas».

## Qué cambió de la V7 a la V8

1. **Fuera los tres cortes del master que se colaban.** Son plano de recurso
   del propio montaje de origen, no de la biblioteca, y en vertical se ven
   como un destello. Abajo, en «Los tres destellos», está el detalle.
2. **El bloque de maletas va seguido**, sin la cara del padre partiéndolo por
   la mitad, y gana un quinto plano.
3. **Fuera el plano de las peregrinas con la Compostela.** La celebración dura
   más, aunque no todo lo que se querría: ver por qué abajo.
4. **La catedral entra en dos tiempos**, la escalinata con gente y después la
   fachada, que es lo que pide el manual para varios planos del mismo sitio.

Y de la V6 a la V7, que sigue valiendo: el «and» ya no suena, hay un plano más
de equipaje, fuera las dos terrazas con mesas y el lavabo del segundo 39, las
dos fachadas que gustaron duran más, el cierre va sobre la catedral y el CTA
tiene ventana para leerse.

## Los tres destellos del master

El master es un montaje ya editado, con sus propios planos de recurso entre
declaración y declaración. Al coger un tramo para verlo hablar, si el tramo
empieza un poco antes de tiempo entra el final del recurso anterior. En
vertical, recortado y con el plano durando lo que dura, no se lee como un
plano: se lee como un error.

| Dónde | Qué entraba | Qué se ha hecho |
| --- | --- | --- |
| Segundo 0 | tres fotogramas de bosque | el tramo A empieza en el 15,40, donde corta el master |
| Segundo 17,7 | la cara del padre entre las dos maletas | fuera la cara, las maletas seguidas |
| Segundo 35,2 | un baño, y detrás la cara del hijo | fuera las dos, en su sitio una habitación |

Lo del arranque se arregla **moviendo también la pista**, no sólo la imagen:
si se mueve sólo la imagen, la boca deja de cuadrar con la voz una décima, que
es justo el umbral en el que se empieza a notar. Por eso la pieza dura 49,1 s
y no 49,2, y todos los tiempos de esta ficha han bajado una décima.

## Quién habla, que no es uno solo

Son **dos voces, padre e hijo**, y la diferencia se mide:

| Quién | Tramo | Tono | Centroide |
| --- | --- | --- | --- |
| El padre, camiseta turquesa | 0 – 24 s | 150 Hz | 550 – 770 Hz |
| El hijo, camiseta granate de Arizona State, **el primero por la izquierda** | 25 – 42,5 s | 110 Hz | 890 Hz |

**Lo de los hoteles y la cama limpia lo cuenta el hijo**, no el padre. Eso
decide a quién se enfoca, que en vertical no es un detalle: el grupo son
cuatro de lado a lado y el recorte a 9:16 sólo deja ver el 33,75 % del ancho.

Cuando habla el padre se mira al 79 % de la imagen; cuando habla el hijo, al
19 %.

## De dónde sale

Del montaje de testimonios en inglés, `montajes/testimonios-EN.mp4`. Se
conservan dos tramos del master, **15,40 a 29,72** y **42,40 a 70,80**, y se
van 12,68 segundos por dentro: «and a lot of sense of being…», «in bonding
with people that are 40 years younger than you» y «and seeing people from all
over the world».

El corte pedido era del 0:19 al 0:26. Se extendió hasta el 0:15 porque «and a
lot of sense of being…» es el arranque de esa misma frase y solo no se
sostiene.

### El «and» colgado, que costó dos vueltas

En el 29,75 del master el hombre arranca un «and» que deja en el aire. El
corte se adelantó al **29,72** para quitarlo, y aun así se seguía oyendo. El
corte estaba bien; el que lo devolvía era el fundido.

La juntura va con **fundido cruzado de verdad**, con material de los dos
lados, porque la pista lleva voz y música en el mismo canal y sin cruce la
música salta. El lado que se apaga salía de detrás del propio corte, del
29,72 en adelante, que es la continuación natural de la música. Y ahí es
justo donde vive el «and»: como el fundido empieza con ese lado a volumen
entero, la palabra recién quitada volvía a sonar, sólo que apagándose.

Ahora ese lado se toma del **30,16**, el hueco sin voz que queda entre el
«and» y la frase siguiente. Misma sala, misma música, ninguna palabra.
Medido sobre la pista montada, en el 14,42 la energía de la banda de voz,
de 300 a 3400 Hz, baja del 47 % al 6 %.

## El audio

Lo monta `audio-reel-hoteles.py`, porque son cosas que cambian la duración y
no se pueden hacer desde Remotion:

- el corte de dentro, con el cruce que se acaba de contar;
- la **cola de música**, sacada del arranque del master, que tiene 15,77 s sin
  una sola voz, para que la placa final no se quede muda y la música llegue
  hasta el final.

## Las dos junturas

La pista del master lleva **voz y música en el mismo canal**, así que cualquier
corte se oye en la música aunque caiga en un silencio de la voz. Las dos
junturas sonaban raras, la del 14,3 y la del 42,1, y no era un solo problema
sino tres.

### 1 · El escalón, en la juntura de dentro

El master baja la música cuando alguien habla y la sube cuando nadie habla. A
un lado del corte hay voz cerca y la música está agachada; al otro hay un hueco
de tres segundos y la música está entera. Medido: **7,2 dB de rms y 9,6 de
graves**. El corte en sí era limpio, pero la música pegaba un salto.

El tramo B entra ahora 7,2 dB por debajo y sube a su nivel en dos segundos,
que es justo lo que queda de hueco antes de la frase siguiente. Es el mismo
gesto que hace el master solo, así que no se oye como un truco: se oye como la
música volviendo cuando el hombre deja de hablar. Medido después, el escalón
queda en 1,7 dB.

### 2 · El suelo que se caía, en la cola

La cola salía del segundo 1,50 del master, que es la entrada del tema y no
tiene bajos: **10 dB menos de graves y 5 de rms** que lo que venía sonando.
Al llegar el cierre se caía el suelo de la música.

Y además entraba **a contratiempo**. El pulso son 0,5016 s, 119,6 bpm, y
comparando la envolvente de ataques de los dos lados, el 1,50 caía desplazado
medio pulso, que es lo más lejos que se puede estar de cuadrar.

La cola sale ahora del **7,75**, que cuadra con 0,2 ms de error y tiene el
mismo cuerpo: 64,4 dB de graves contra los 63,1 de lo que venía. El siguiente
sitio que cuadra es el 8,25, por si alguna vez hay que moverla.

Un aviso para la próxima: **la fase no se cuenta multiplicando pulsos por la
distancia.** A 62 segundos de distancia, un milisegundo de error en el pulso
son ya 125 de desfase. Se compara la envolvente de ataques de los dos lados y
se busca el desplazamiento que mejor casa, que es lo único que mide lo que se
oye.

### 3 · El bache del propio fundido

Los dos cruces iban con ganancias lineales. Dos trozos de música distintos no
están correlacionados, así que en mitad del cruce se restan y dejan un bache
de 3 dB: medido, la pieza caía a **-32,5 dB** justo en la juntura de dentro.
Las ganancias van ahora en raíz, que es lo que conserva la potencia, y el
nivel ya no se mueve al pasar por el corte.

## Lo que se oye, y cuándo

Tiempos ya de la pieza montada, no del master:

| Segundo | Frase |
| --- | --- |
| 0,4 – 4,1 | «I've had the trail on my bucket list for about 10 years» |
| 5,0 – 11,3 | «…and wanting to do it, because I understand there's a lot of emotion that goes into» |
| 11,8 – 14,5 | «a 100-kilometer hike over five days» |
| 16,7 – 21,7 | «Having somebody Sherpa your belongings from town to town, so you can really focus on the hike» |
| 22,2 – 24,1 | «The only way to go» |
| 25,1 – 30,6 | «Makes it a really great trip in a lot of ways, because for one, I'm not carrying it all on my back» |
| 31,1 – 35,6 | «And two, there's nothing better than laying down in a nice clean bed and a shower after a long day of hiking» |
| 36,2 – 42,4 | «I won't be sleeping in a tent or at some hostel, so I'm glad we're doing it this way» |

## Los planos de recurso

**Ninguno sale del master**, salvo las cuatro veces en que se ve hablar a
alguien. Los del master son planos generales pensados para 16:9 y al
recortarlos a vertical la acción se queda fuera de cuadro. El resto viene de
la biblioteca y va centrado, elegido mirando cómo queda ya recortado a 9:16.

### Caras

| Entra | Sale | Quién |
| --- | --- | --- |
| 0,0 s | 4,5 s | el padre |
| 26,8 s | 29,0 s | el hijo |

Eran cuatro y son dos. Las dos cortas entraban por un recurso del master, y
además partían bloques que se leen mejor de un tirón.

### Camino, sobre lo que cuenta el padre

| Entra | Sale | Plano |
| --- | --- | --- |
| 4,5 s | 6,5 s | `piezas-viejas/peregrinos-calzada` |
| 6,5 s | 8,0 s | `pareja-muros` (1080p) |
| 8,0 s | 10,2 s | `testimonios/camino-dedaleras` |
| 10,2 s | 12,8 s | `piezas-viejas/sendero-peregrinos` |
| 12,8 s | 14,8 s | `piezas-viejas/grupo-calle` · tapa la juntura del corte |
| 14,8 s | 16,6 s | `piezas-viejas/calle-aldea` |

### Equipaje

| Entra | Sale | Plano |
| --- | --- | --- |
| 16,6 s | 18,1 s | `testimonios/maletas-portal` |
| 18,1 s | 20,2 s | `piezas-viejas/maletas-etiqueta` |
| 20,2 s | 21,4 s | `testimonios/etiquetas-maletas` |
| 21,4 s | 22,2 s | `testimonios/maletas-fila` |
| 22,2 s | 23,8 s | `piezas-viejas/maleta-concha` · **sobre «The only way to go»** |

**Los cinco van seguidos.** Antes la cara del padre partía el bloque entre el
primero y el segundo, y las maletas no llegaban a leerse como una idea. Sin
ella caben cinco planos, que es casi todo el material de equipaje que hay, y
el de la concha cae entero sobre la frase que remata el tramo.

Sólo uno baja del segundo, `maletas-fila`, con 0,80 s, y va entre uno de 1,15
y otro de 1,65: la regla que salió de la V3 es que no se pongan dos cortos
seguidos, no que no pueda haber ninguno.

### Alojamiento

| Entra | Sale | Plano |
| --- | --- | --- |
| 23,8 s | 25,8 s | `piezas-viejas/pazo-blanco` · fachada, x0,86 |
| 25,8 s | 26,8 s | `piezas-viejas/galeria-hotel` |
| 29,0 s | 31,0 s | `habitacion` (1080p) · la mejor cama que hay |
| 31,0 s | 32,2 s | `testimonios/bano-ducha` |
| 32,2 s | 34,1 s | `piezas-viejas/habitacion-ventanal` |
| 34,1 s | 35,1 s | `piezas-viejas/salon-rustico` |
| 35,1 s | 36,6 s | `piezas-viejas/habitacion-buhardilla` · donde estaba el baño del master |
| 36,6 s | 38,3 s | `piezas-viejas/habitacion-piedra` |
| 38,3 s | 39,6 s | `casa-rural` (1080p) · fachada, x0,85 · **sobre «not at some hostel»** |

Se han ido las dos terrazas con mesas, `terraza-comida` y `mesa-exterior`, y
el lavabo de `bano-lavabo`. El baño se queda en uno solo, la ducha, que es el
que sostiene la cartela de la cama limpia; en el sitio del lavabo va ahora la
casa rural, que cae justo sobre «I won't be sleeping in a tent or at some
hostel», que es la frase que vende un hotel de verdad.

**Las dos fachadas van un poco más despacio.** Los archivos duran 1,80 y 1,17
segundos y ya se usaban enteros, así que el metraje extra sólo podía salir de
ahí: `playbackRate` 0,86 y 0,85, que en un plano quieto no se nota y les da
2,0 y 1,35 s en lugar de 1,73 y 1,05. La escena lo lleva en el campo `ritmo`
y `comprobar-inserciones.py` lo tiene en cuenta al medir si el archivo llega.

### Llegada y cierre

| Entra | Sale | Plano |
| --- | --- | --- |
| 39,6 s | 41,1 s | `brazos-alto` (1080p) · los brazos en alto, x0,62 |
| 41,1 s | 42,5 s | `testimonios/catedral-escalinata` · el general, con gente |
| 42,5 s | 45,8 s | `testimonios/fachada-obradoiro` · **la fachada, bajo el CTA** |
| 45,8 s | 49,1 s | placa de marca |

Fuera el plano de las dos peregrinas con la Compostela. La celebración se
queda sola y dura 1,5 s en vez de 1,15.

**No puede durar mucho más, y conviene saber por qué.** El archivo tiene 0,97
segundos y no hay otro: el que parece un segundo plano de lo mismo,
`testimonios/brazos-celebracion`, es la misma toma en 720p. Medido alineando
los dos fotograma a fotograma, se solapan enteros y la unión son 1,13 s, así
que encadenarlos sería repetir el plano. Los 1,5 s salen de bajar la
velocidad a 0,62, que en un plano con gente moviéndose es cámara lenta de
verdad. Aquí se sostiene porque es el remate y se lee como intención, pero es
el límite: por debajo ya parece un efecto.

**La catedral entra en dos tiempos**, la escalinata con gente y después la
fachada. Es lo que pide el manual cuando el final encadena varios planos del
mismo sitio: del general al detalle y con gente por medio. El corte cae antes
de que entre el CTA, así que el rótulo no se parte.

## Las cartelas

| Entra | Sale | Texto |
| --- | --- | --- |
| 0,6 s | 7,3 s | Camino de Santiago / **fully organised** |
| 16,8 s | 23,7 s | Your luggage / **travels for you** · «Hotel to hotel, every stage» |
| 29,8 s | 35,4 s | A clean bed / **and a hot shower** · «Waiting for you every night» |
| 36,2 s | 39,6 s | Always private / **room & bathroom** · «Hand-picked hotels» |
| 42,65 s | 45,6 s | Your Camino / **starts here** · el CTA |

**Van a 480 px del borde inferior**, no a 72 como en horizontal: en stories y
en TikTok los últimos 300 px los tapa la interfaz, y TikTok mete además el pie
de foto y el usuario por encima de eso. A la derecha no hace falta margen
extra: la caja más ancha llega al píxel 799 y el carril de botones de TikTok
empieza sobre el 880.

El cuerpo es de 76 px. Se midió la caja ya renderizada, que Montserrat 900
ocupa 0,565 em por carácter y no los 0,88 que se supusieron al principio.

La cartela del equipaje se alarga hasta el 23,8 para cubrir «The only way to
go», y la del baño se recorta al 39,6 para dejar la llegada limpia: un rótulo
de hotel sobre unos peregrinos abrazándose no pega.

**El CTA necesita más ventana de la que parece.** Entra con el barrido de 27
fotogramas más los 14 de relevo entre líneas, así que hasta el segundo y pico
no está entero, y sale con otros 12. Con la ventana de la V6, del 42,9 al
45,2, «starts here» se quedaba entero medio segundo. Ahora va del 42,65 al
45,6 y la placa de marca espera al 45,8.

## El encuadre, que es lo delicado de esta pieza

El grupo son cuatro hombres de lado a lado del cuadro, y un recorte de 16:9 a
9:16 sólo deja ver el 33,75 % del ancho. Centrado se lleva a dos por delante y
al que habla lo deja cortado por el borde.

Ojo con `objectPosition`, que no es la posición en la imagen: con una ventana
del 33,75 %, un `71%` no centra el recorte en el 71 % de la imagen sino en el
64 %. La primera versión dejaba al hombre cortado justo por eso. La escena lo
convierte con la función `mirar()`.

## Resolución, que es la pega

El master es de 1280x720 horizontal. Recortado a 9:16 quedan **405x720
reales**, que subidos a 1080x1920 son un aumento de 2,67x. Se nota, sobre todo
en la cara.

Los cuatro planos de 1080p de la pieza, `pareja-muros`, `habitacion`,
`casa-rural` y `brazos-alto`, suben sólo 1,78x y se ve. La celebración se ha
dejado en 1080p a propósito, aunque el otro archivo de la misma toma dure
0,16 s más: son caras en primer plano y ahí la nitidez pesa más. No hay más material de
alojamiento ni de llegada a esa resolución.

Si hiciera falta más calidad, la salida sería grabar vertical de origen, o
montar en 720x1280 en lugar de 1080x1920, donde el aumento baja a 1,78x.

## Lo que falta decidir

- **Subtítulos incrustados.** En stories y TikTok se ve en silencio, y aquí
  además el testimonio es en inglés. Habría que decidir si van en inglés o
  traducidos, y dónde: la franja de abajo la ocupan las cartelas.
- **Versión sólo de hoteles.** Si se prefiere una pieza más corta y toda sobre
  alojamiento, sale una de unos 26 s empezando en el segundo 16,6.
