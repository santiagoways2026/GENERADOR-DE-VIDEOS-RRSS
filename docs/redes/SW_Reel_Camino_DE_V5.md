# Reel del testimonio alemán · vertical · V5

Pieza de 54,6 s, 1080x1920 a 30 fps, para stories y TikTok.

Fuente viva: `video/src/SWReelCaminoDE.tsx`.
Pista: `herramientas/scripts/audio-reel-de.py`.

## Qué cambia respecto a la V4

**La cama de ambiente del final sonaba rota, y era verdad.** Dos fallos, los
dos en cómo se sintetizaba:

1. **Un temblor a 21,5 Hz.** La síntesis solapa ventanas con fase aleatoria, y
   con ventana de Hann eso no suma amplitudes sino potencias: w² + w² vale 1
   en el centro de cada ventana y 0,5 en el cruce, así que la cama salía con
   3 dB de temblor al ritmo del salto. Medido sobre la envolvente, una línea a
   21,4 Hz que destacaba 6,4 veces sobre el resto. A esa frecuencia no se oye
   como trémolo, se oye como que el audio se rompe. Con la ventana en raíz la
   potencia queda plana y la línea baja a 2,3 veces, que es el suelo de ruido.
2. **La cama era más brillante que la sala.** El color salía de las ventanas
   más flojas de la pieza, y ahí dentro caen colas de voz, que son más
   brillantes que una sala: 3,5 dB de más entre 3 y 8 kHz y 3 dB de nivel de
   más. Ahora el color sale de los **huecos medidos**, los de verdad, que
   están listados en la constante `HUECOS` del script. Cuadra banda a banda
   dentro de 2 dB y el nivel a una décima.

El mismo fallo de la ventana estaba en `herramientas/scripts/ambiente.py`, que
es la herramienta que usan las demás piezas. Queda arreglado ahí también.

## Qué cambió de la V3 a la V4

Cuatro planos, tres fuera y uno reencuadrado:

| Segundo | Qué pasaba | Qué entra |
| --- | --- | --- |
| 10,8 | la pareja caminaba por el 30 % del ancho y el recorte centrado la dejaba pegada al borde | el mismo plano, mirando al 30 % |
| 12,7 | un grupo a contraluz con media gente cortada | `habitacion`, el mejor plano de alojamiento que hay y el único 1080p de la pieza |
| 15,0 | un contraluz velado que en vertical es un muro de árboles oscuros | `maletas-etiqueta`, la concha colgada de la maleta |
| 41,9 | una mesa con un señor mirando a cámara, que sabe a foto de stock | `arco-piedra`, con un peregrino cruzándolo |

Lo del contraluz es literalmente la regla 14 del manual: «un contraluz velado
con un muro al fondo no abre nada».

## Qué cambió de la V2 a la V3

1. **Fuera los subtítulos quemados.** Se probaron y con las cartelas a la vez
   el tercio de abajo se quedaba en un muro de texto. Manda la cartela. Los
   pies siguen existiendo, en `SW_Reel_Camino_DE_V5.srt`, para subirlos como
   subtítulo de la plataforma, que además se puede activar y desactivar.
2. **Los dos planos del 27 y del 29 fuera.** Eran dos muros de piedra con
   maleza, sin nadie y parecidos entre sí. En su sitio, un peregrino pasando
   por una iglesia y el grupo en el mirador con Santiago al fondo, que es lo
   que pide la frase: «lo bonito que es lo que hemos conseguido hasta ahora».

## Qué cambió de la V1 a la V2

1. **Se colaba el rótulo.** En los últimos ocho fotogramas del plano que abría
   la pieza entraba un «WIR» del subtítulo original. El fallo estaba en cómo
   se medían los huecos; está contado abajo, en «El verde que no se veía».
2. **Del grupo se ve un solo plano**, el único hueco que aguanta segundo y
   medio. Los otros dos eran de medio segundo largo y no pasan la medida
   buena.
3. **Subtítulos nuevos**, en alemán y en el registro de la marca, colocados
   por encima de las cartelas.
4. **Cuatro planos reencuadrados**: se salían por un lado.

## Qué había en el bruto

Un clip de 83,3 s a 720x1280, salido de un editor online, con tres problemas:

| Problema | Dónde exactamente |
| --- | --- |
| Subtítulos alemanes pegados | filas 758 a 843, columnas 47 a 660 · el 77 % del metraje |
| Marca de agua `clideo.com` | filas 1237 a 1253, columnas 522 a 693 |
| Calidad | 720x1280 a 2,1 Mbps, mono |

Y una cosa más, que no se ve pero condiciona el montaje: **la imagen no va
sincronizada con el audio alemán.** Medido comparando el movimiento de la zona
de las bocas con el nivel de la pista, el movimiento es el mismo cuando hablan
que cuando la pista está en silencio: 0,81 en el silencio contra 0,73 y 0,98
en los tramos con voz. Si estuviera sincronizado, la correlación entre boca y
voz saldría alta y sale plana, entre 0,03 y 0,16, que es ruido. El alemán es
una locución puesta encima.

## Cómo se han resuelto los tres

**La marca de agua, recortando.** Vive en las 43 filas de abajo, así que los
planos que se usan del bruto van recortados a 692x1230 desde la esquina 14,0.
Se pierde el 4 % del ancho y los pies.

**Los subtítulos, con el montaje.** No se pueden recortar, están en mitad del
cuadro, y reconstruirlos no sale: el texto cambia cada segundo y cae encima de
las manos, así que un relleno dejaría un borrón. Pero **no están siempre**:
ocupan el 77 % del metraje y dejan huecos. De los tres, sólo se ven tres
planos, y los tres salen de esos huecos. El resto de la pieza es biblioteca,
que viene limpia de origen.

### El verde que no se veía

Los huecos se localizan midiendo la **firma del rótulo**. La primera versión
buscaba un píxel muy claro (por encima de 225) con uno muy oscuro (por debajo
de 75) a menos de cinco píxeles en horizontal, que es lo que deja el borde
negro de las letras blancas. Contar píxeles blancos a secas no vale, y se
comprobó a base de sacar planos con un «EINE» o un «DA» todavía dentro: en ese
encuadre los pantalones cortos son blancos y caen justo en la banda.

Pero esa firma **no ve las palabras resaltadas**. El rótulo va en blanco con
borde negro salvo la palabra que resalta, que va en verde, y el verde no
dispara un detector de blanco. Por eso en la V1 se colaba un «WIR» en los
ocho últimos fotogramas del plano de apertura: medido, 433 píxeles verdes
donde el resto del plano tenía 8.

El verde del rótulo es **RGB 88, 118, 49** y también lleva borde oscuro, así
que la firma buena es **claro o verde, con oscuro al lado**. La hierba, que
también es verde, no la dispara porque no tiene nada negro pegado.

Con la medida corregida, el único hueco del grupo que pasa de segundo y medio
es **7,17 – 9,00**. Los que parecían valer en la V1, el 33,6 y el 48,7, se
quedan en medio segundo largo. El plano que se usa va del 7,25 al 8,95 y su
firma máxima es 16, contra los miles que da un rótulo.

**La calidad, no se puede arreglar.** 720x1280 subidos a 1080x1920 son 1,56x.
Se nota en los tres planos del grupo y no se nota en el resto, que sale de la
biblioteca. Si hace falta más calidad, la salida es pedir el original sin
pasar por el editor online.

**Y la sincronía, con la duración.** El plano del grupo dura 1,7 s y no cae
sobre una frase entera. A esa duración no se lee como un doblaje, se lee como
un plano de los clientes, que es para lo que está.

**Si aparece el original sin pasar por el editor online**, lo primero que
gana la pieza son más planos de ellos: ahora mismo el metraje utilizable son
1,7 segundos de los 83.

## El audio

De los 83,3 s del bruto se quedan **50,6**. Lo que se va es lo que se dice dos
veces o se queda a medias, que es la regla 7:

| Se va | Por qué |
| --- | --- |
| 16,6 – 27,6 | «einerseits… andererseits» repite lo de reunirse, y «besteht immer die Möglichkeit… und spirituell zu bereiten» es una frase sin terminar |
| 42,8 – 47,4 | «eine bessere Zusammenarbeit im Team» no viene a cuento |
| 64,2 – 75,3 | «Leute kennenlernen, Orte kennenlernen» vuelve sobre lo que ya se dice mejor antes, y «der hatte ein gutes Wetter» está cortado |

Quedan cuatro tramos y tres junturas, todas en silencio entre frases.

**Esta pista no lleva música.** Medido: entre frase y frase el nivel baja
hasta -41 dBFS y lo que queda es ambiente de campo, no un tema. Sólo hay un
golpe de música en el último segundo del bruto, que se va con el resto. Eso
simplifica las junturas, que no tienen que cuadrar con ningún pulso, y obliga
en el final: la placa de marca va con **cama de ambiente sintetizada**, no con
una canción metida a última hora, que es lo que dice la regla 11. La cama sale
de los huecos de la propia pieza, con fase aleatoria, y queda a -30,7 dB
contra los -30,8 del ambiente con el que empalma. Su autocorrelación es 0,06,
así que no se oye el ciclo, y su envolvente no tiene ninguna línea: el pico
más alto en la banda de 10 a 120 Hz se queda en 3,7 veces la mediana, que es
lo que da el ruido por sí solo.

**Si el equipo quiere música**, hay que pasar un tema: meterle uno sólo a la
cola sonaría a parche, y ponerlo debajo de toda la pieza cambia el registro y
habría que decidirlo.

## Lo que dice, y dónde

Tiempos ya de la pieza montada:

| Segundo | Frase |
| --- | --- |
| 0,3 – 6,7 | «Wir reisen als Gruppe, was für uns wichtig ist. Da es uns die Möglichkeit gibt, uns zu treffen» |
| 7,9 – 14,7 | «Wir sind drei. Wir waren Universitätsstudenten, haben zusammen abgeschlossen und sind hier mit unseren Familien» |
| 15,4 – 26,8 | «Wir hoffen, dass diese Erfahrung uns eine spirituelle Bereicherung bringt, eine größere Verbundenheit, nachdem wir so viel Zeit zusammen verbracht haben» |
| 27,5 – 32,7 | «Ich würde sagen, dass es wunderschön ist, was wir bisher erreicht haben» |
| 32,8 – 43,5 | «Diese Reisen, bei denen du Sport treibst und sie mit Freunden und dem Kennenlernen interessanter Dinge kombinierst. Ich finde es wunderbar» |
| 43,9 – 50,5 | «Die Landschaften sind wunderschön. Wir hoffen, dass dies so weitergeht, bis wir den Weg nach Santiago beenden» |

## Los planos

### El grupo, del propio bruto

| Entra | Sale | Plano |
| --- | --- | --- |
| 0,0 s | 1,7 s | `testimonio-de/grupo` · abre la pieza y no vuelve |

### Bloque 1 · el grupo y los amigos

| Entra | Sale | Plano |
| --- | --- | --- |
| 1,7 s | 4,0 s | `piezas-viejas/peregrinos-calzada` · reencuadrado al 32 % |
| 4,0 s | 6,1 s | `piezas-viejas/grupo-calle` |
| 6,1 s | 8,4 s | `testimonios/peregrinas-muros` |
| 8,4 s | 10,8 s | `piezas-viejas/sendero-peregrinos` |
| 10,8 s | 12,7 s | `testimonios/pareja-muros-piedra` · reencuadrado al 30 % |
| 12,7 s | 14,8 s | `habitacion` (1080p) |

### Bloque 2 · lo espiritual y el vínculo

| Entra | Sale | Plano |
| --- | --- | --- |
| 14,8 s | 16,7 s | `piezas-viejas/maletas-etiqueta` |
| 16,7 s | 18,8 s | `piezas-viejas/iglesia-espadana` · reencuadrado al 80 % |
| 18,8 s | 20,2 s | `testimonios/interior-capilla` |
| 20,2 s | 22,2 s | `piezas-viejas/soportales-rua` |
| 22,2 s | 24,0 s | `piezas-viejas/cruceiro-prado` · reencuadrado al 61 % |
| 24,0 s | 25,6 s | `testimonios/timpano-romanico` |
| 25,6 s | 27,3 s | `piezas-viejas/horreo-peregrinos` |

### Bloque 3 · el deporte, los amigos, descubrir

| Entra | Sale | Plano |
| --- | --- | --- |
| 27,3 s | 29,4 s | `piezas-viejas/peregrinos-iglesia` |
| 29,4 s | 30,9 s | `testimonios/mirador-grupo` · Santiago al fondo |
| 30,9 s | 32,5 s | `testimonios/camino-dedaleras` |
| 32,5 s | 34,6 s | `testimonios/botas-camino` · sobre «Sport treibst» |
| 34,6 s | 36,1 s | `testimonios/ciclista-camino` |
| 36,1 s | 38,2 s | `piezas-viejas/puente-calzada` |
| 38,2 s | 40,3 s | `testimonios/mojon-peregrinas` · sobre «Kennenlernen» |
| 40,3 s | 41,9 s | `testimonios/gaiteros` · reencuadrado al 68 % |
| 41,9 s | 43,7 s | `piezas-viejas/arco-piedra` |

### Bloque 4 · los paisajes y Santiago

| Entra | Sale | Plano |
| --- | --- | --- |
| 43,7 s | 45,8 s | `testimonios/prado-flores` |
| 45,8 s | 47,9 s | `testimonios/catedral-escalinata` · el general, con gente |
| 47,9 s | 51,3 s | `testimonios/fachada-obradoiro` · **la fachada, bajo el CTA** |
| 51,3 s | 54,6 s | placa de marca |

Del general al detalle y con gente por medio, que es como pide el manual para
varios planos del mismo sitio.

## Los reencuadres

Un 16:9 recortado a 9:16 deja ver el 33,75 % del ancho, y centrado se lleva por
delante lo que importa. Cuatro planos se salían:

| Plano | Dónde estaba el sujeto | Se mira al |
| --- | --- | --- |
| `peregrinos-calzada` | el grupo, a la izquierda | 32 % |
| `pareja-muros-piedra` | la pareja, a la izquierda | 30 % |
| `iglesia-espadana` | la iglesia, a la derecha, y el resto era cielo | 80 % |
| `cruceiro-prado` | el cruceiro, a la derecha del centro | 61 % |
| `gaiteros` | cinco músicos de lado a lado; caben tres | 68 % |

Se ponen con la función `mirar()`, que convierte «dónde está esto en la
imagen» en el `objectPosition` que hace falta. No son lo mismo: con una
ventana del 33,75 %, un `71%` no centra el recorte en el 71 % de la imagen
sino en el 64 %.

## Los subtítulos: fuera de la pieza, en un SRT

**La pieza va sin subtítulos quemados.** Se montaron, en el registro de la
marca y colocados por encima de las cartelas, con 66 px de aire entre unos y
otras. Técnicamente funcionaba. Pero con las dos cosas en pantalla el tercio
de abajo se quedaba en un muro de texto, y de los dos el que tiene que mandar
es la cartela, que es la que lleva el mensaje de marca.

Los veinte pies están en **`SW_Reel_Camino_DE_V5.srt`**, listos para subirlos
como subtítulo de la plataforma. Así además el espectador los activa o los
quita, y no compiten con la cartela.

El componente `Subtitulo` se queda en `CartelaMarca.tsx` por si otra pieza lo
necesita: Montserrat 800 a 44 px, sin recuadro verde (el verde es de la
promesa), entrando con un fundido de tres fotogramas y no con el barrido del
kit, que repetido cada dos segundos durante un minuto marea. Y se dibuja por
encima del cierre, porque el overlay diagonal lo apagaba.

**El alemán de los pies sigue pendiente de que lo mire alguien que hable el
idioma.** Sale de transcribir la pista y está repasado a mano, pero la
locución es un doblaje y trae giros que no son alemán corriente.

## Las cartelas · **pendientes de aprobar**

El manual de marca tiene el registro aprobado en español y en inglés. En
alemán no hay nada aprobado, así que **estas cuatro son una propuesta** y
conviene que las mire alguien que hable alemán antes de publicar.

| Entra | Sale | Texto | De dónde viene |
| --- | --- | --- | --- |
| 0,6 s | 7,0 s | Manche Reisen / **hinterlassen Spuren** | «Algunos viajes dejan huella» |
| 16,4 s | 22,4 s | Gemeinsam gehen, / **gemeinsam ankommen** | nueva |
| 33,6 s | 39,6 s | Du gehst. / **Wir kümmern uns.** · «Unterkunft, Gepäck und Betreuung» | «Tú caminas. Nosotros nos ocupamos del resto» |
| 48,2 s | 51,1 s | Dein Camino / **beginnt hier** · el CTA | «Tu Camino empieza aquí» |

La tercera se ha acortado a propósito: la traducción literal, «Wir kümmern uns
um den Rest», mide 27 caracteres y a 76 px se sale del cuadro por 150 px.

## Lo que falta decidir

- **El alemán de las cartelas y de los pies del SRT**, como se acaba de decir.
- **Si la pieza lleva música.** Ahora no lleva, porque el bruto no la tiene.
- **Si hay original sin marca.** Con él se pueden sacar más planos del grupo,
  que ahora mismo se quedan en uno.
