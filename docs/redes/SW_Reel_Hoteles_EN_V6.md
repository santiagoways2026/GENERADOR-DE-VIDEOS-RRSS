# Reel de hoteles · testimonio en inglés · vertical · V6

Pieza de 49,2 s, 1080x1920 a 30 fps, para stories y TikTok.

Fuente viva: `video/src/SWReelHotelesEN.tsx`.

## Quién habla, que no es uno solo

Son **dos voces, padre e hijo**, y la diferencia se mide:

| Quién | Tramo | Tono | Centroide |
| --- | --- | --- | --- |
| El padre, camiseta turquesa | 0 – 24,2 s | 150 Hz | 550 – 770 Hz |
| El hijo, camiseta granate de Arizona State, **el primero por la izquierda** | 25,2 – 42,4 s | 110 Hz | 890 Hz |

**Lo de los hoteles y la cama limpia lo cuenta el hijo**, no el padre. Eso
decide a quién se enfoca en cada momento, que en vertical no es un detalle:
el grupo son cuatro de lado a lado y el recorte a 9:16 sólo deja ver el
33,75 % del ancho, así que hay que elegir a uno.

Cuando habla el padre se mira al 79 % de la imagen; cuando habla el hijo, al
19 %.

## De dónde sale

Del montaje de testimonios en inglés, `montajes/testimonios-EN.mp4`. Se
conservan dos tramos del master, **15,30 a 30,45** y **42,40 a 70,80**, y se
quitan 11,95 segundos por dentro: «and a lot of sense of being…», «in bonding
with people that are 40 years younger than you» y «and seeing people from all
over the world».

El corte pedido era del 0:19 al 0:26. Se extendió hasta el 0:15 porque «and a
lot of sense of being…» es el arranque de esa misma frase y solo no se
sostiene.

Y se adelantó otros 0,73 s, del 30,45 al **29,72**: en el 29,80 el hombre
arranca un «and» que deja colgado, y sin quitarlo la frase se queda a medias.
«five days» acaba en el 29,15, así que el corte tiene medio segundo de margen
por delante. Se localizó transcribiendo ventanas cada vez más cortas hasta que
la palabra desaparece.

## El audio

Lo monta `herramientas/scripts/audio-reel-hoteles.py`, porque son cosas que
cambian la duración y no se pueden hacer desde Remotion.

La pista lleva **voz y música en el mismo canal**. Los dos extremos del corte
caen en silencio entre frases, pero la música salta igual, así que la juntura
va con fundido cruzado de verdad: se toma audio más allá del corte, que no se
usa para nada más, y se mezcla con el arranque del tramo siguiente. Así ningún
tramo cambia de longitud y la imagen no se descuadra.

La **cola de música** sale de los primeros segundos del master, que son de
música sola, y entra con otro fundido cruzado en el 42,95. Así la placa final
no se queda muda y la música llega hasta el final.

Comprobado sobre la pista montada: las doce frases enteras, ninguna partida, y
en las dos junturas el nivel se mantiene entre -19 y -32 dBFS, sin bache.

## De dónde sale

Del montaje de testimonios en inglés, `montajes/testimonios-EN.mp4`, tramo
**15,30 a 70,80** del master. Es el viajero americano, el del grupo de cuatro
con la camiseta turquesa, y son sus 55,5 segundos seguidos.

**El tramo va entero, sin un solo corte por dentro.** La pista del master trae
voz y música mezcladas en el mismo canal: cualquier juntura se oiría en la
música aunque cayera en un silencio de la voz. Sólo lleva medio segundo de
fundido al entrar y seis décimas al salir.

## Lo que dice, y dónde

| Segundo | Frase |
| --- | --- |
| 0,5 – 4,5 | «I've had the trail on my bucket list for about 10 years» |
| 5,1 – 8,6 | «...and wanting to do it, because I understand there's a lot of—» |
| 9,1 – 15,0 | «a lot of emotion that goes into a 100-kilometer hike over five days» |
| 15,3 – 19,0 | «and a lot of sense of being...» |
| 19,6 – 26,3 | «in bonding with people that are 40 years younger than you, and seeing people from all over the world» |
| 29,5 – 37,0 | «Having somebody Sherpa your belongings from town to town, so you can really focus on the hike. The only way to go» |
| 37,0 – 48,6 | «Makes it a really great trip in a lot of ways, because for one, I'm not carrying it all on my back. And two, there's nothing better than laying down in a nice clean bed and a shower after a long day of hiking» |
| 49,0 – 55,1 | «I won't be sleeping in a tent or at some hostel, so I'm glad we're doing it this way» |

De los 55 segundos, **los de hoteles son los últimos 26**, del 29,5 en
adelante. Los primeros 26 son por qué vino al Camino, y hacen de entrada.

## Los planos de recurso

**Ninguno sale del master.** Los del master son planos generales pensados para
16:9, y al recortarlos a vertical la acción se queda fuera de cuadro. Todos
vienen de la biblioteca y van centrados, elegidos mirando cómo quedan ya
recortados a 9:16.

### Camino, sobre lo que cuenta el padre

| Entra | Sale | Plano |
| --- | --- | --- |
| 4,6 s | 6,6 s | `piezas-viejas/peregrinos-calzada` |
| 6,6 s | 8,1 s | `pareja-muros` (1080p) |
| 8,1 s | 10,3 s | `testimonios/camino-dedaleras` |
| 10,3 s | 12,9 s | `piezas-viejas/sendero-peregrinos` |
| 12,9 s | 15,4 s | `piezas-viejas/grupo-calle` · tapa la juntura del corte |
| 15,4 s | 17,4 s | `piezas-viejas/calle-aldea` |

### Equipaje, sobre «having somebody Sherpa your belongings»

| Entra | Sale | Plano |
| --- | --- | --- |
| 17,4 s | 18,4 s | `testimonios/maletas-portal` |
| 19,7 s | 21,8 s | `piezas-viejas/maletas-etiqueta` |
| 21,8 s | 23,5 s | `piezas-viejas/maleta-concha` |

Eran cinco y son tres. Dos de los que se han ido, `etiquetas-maletas` y
`maletas-fila`, salen casi negros en vertical y duraban menos de un segundo:
el tramo parecía un parpadeo.

### Alojamiento, sobre lo que cuenta el hijo

| Entra | Sale | Plano |
| --- | --- | --- |
| 23,5 s | 25,2 s | `piezas-viejas/pazo-blanco` · fachada |
| 25,2 s | 27,7 s | `piezas-viejas/galeria-hotel` |
| 29,9 s | 31,9 s | `habitacion` (1080p) · la mejor cama que hay |
| 31,9 s | 33,0 s | `testimonios/bano-ducha` |
| 33,0 s | 34,7 s | `piezas-viejas/habitacion-ventanal` |
| 34,7 s | 36,5 s | `piezas-viejas/terraza-comida` |
| 37,4 s | 39,2 s | `piezas-viejas/habitacion-granate` |
| 39,2 s | 40,7 s | `piezas-viejas/bano-lavabo` |
| 40,7 s | 42,5 s | `piezas-viejas/casa-calixtino` · fachada |
| 42,5 s | 43,6 s | `testimonios/lounge-hotel` |

Fuera `hotel-arzua`, que en vertical es una cristalera oscura sin nada que
mirar, y fuera `terraza`, que se queda en dos tercios de cielo.

**El bloque tira de lo rústico**, que es lo que mejor material tiene: el salón
de piedra con vigas, la habitación con la lámpara y el cabecero de madera, la
casona con el cartel y la mesa de piedra bajo el emparrado. Salieron de repasar
los treinta y tres planos de alojamiento de la biblioteca uno a uno, ya
recortados a 9:16. Se fueron por sosos el bar moderno de techo turquesa y la
habitación de los cubrecamas granates.

**No hay ningún plano de piscina en la biblioteca.** Lo más parecido es
`terraza`, que da a un embalse y desde el encuadre parece una lámina de agua.
Si existe metraje de piscina en algún bruto sin subir, con pasarlo se añade.

## El encuadre, que es lo delicado de esta pieza

El grupo son cuatro hombres de lado a lado del cuadro, y un recorte de 16:9 a
9:16 sólo deja ver el 33,75 % del ancho. Centrado se lleva a dos por delante,
y al que habla lo deja cortado por el borde.

Sus seis planos van reencuadrados con la vista puesta en el 79 % de la imagen,
que deja al de la camiseta turquesa entero y a uno de sus compañeros al lado.
El resto del metraje es plano general y se recorta centrado.

Ojo con `objectPosition`, que no es la posición en la imagen: con una ventana
del 33,75 %, un `71%` no centra el recorte en el 71 % de la imagen sino en el
64 %. La primera versión de esta pieza dejaba al hombre cortado justo por eso.
La escena lo convierte con la función `mirar()`.

## Resolución, que es la pega

El master es de 1280x720 horizontal. Recortado a 9:16 quedan **405x720
reales**, que subidos a 1080x1920 son un aumento de 2,67x. Se nota, sobre todo
en la cara.

Los planos de cama y baño de 720p tienen el mismo problema. El de la
habitación con ventanal es de 1080p y sube sólo 1,78x: se ve claramente mejor
que los demás, y no hay más material de alojamiento a esa resolución.

Si hiciera falta más calidad, la salida sería grabar vertical de origen, o
montar en 720x1280 en lugar de 1080x1920, donde el aumento baja a 1,78x.

## Lo que falta decidir

- **Subtítulos incrustados.** En stories y TikTok se ve en silencio, y aquí
  además el testimonio es en inglés. Habría que decidir si van en inglés o
  traducidos, y dónde: la franja de abajo la ocupan las cartelas.
- **Versión sólo de hoteles.** Si se prefiere una pieza más corta y toda sobre
  alojamiento, sale una de unos 26 s empezando en el segundo 17,4.
