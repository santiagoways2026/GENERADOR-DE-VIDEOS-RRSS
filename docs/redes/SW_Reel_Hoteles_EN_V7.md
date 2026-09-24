# Reel de hoteles · testimonio en inglés · vertical · V7

Pieza de 49,2 s, 1080x1920 a 30 fps, para stories y TikTok.

Fuente viva: `video/src/SWReelHotelesEN.tsx`.
Pista: `herramientas/scripts/audio-reel-hoteles.py`.

## Qué cambia respecto a la V6

1. **El «and» ya no suena.** No era el corte, era el fundido.
2. Un plano más de equipaje, y el de la maleta con la concha cae entero sobre
   «The only way to go».
3. Fuera las dos terrazas con mesas, `terraza-comida` y `mesa-exterior`.
4. Fuera el lavabo del segundo 39. En su sitio, la casa rural.
5. Las dos fachadas que gustaron, el pazo blanco y la casa rural, duran más.
6. El cierre va sobre la catedral, y antes entran los peregrinos llegando.
7. El CTA tiene ventana para leerse: antes «starts here» duraba medio segundo
   entero, entre que acababa de entrar y empezaba a salir.

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
conservan dos tramos del master, **15,30 a 29,72** y **42,40 a 70,80**, y se
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
- la **cola de música**, sacada de los primeros segundos del master, que son
  de música sola, para que la placa final no se quede muda y la música llegue
  hasta el final.

## Lo que se oye, y cuándo

Tiempos ya de la pieza montada, no del master:

| Segundo | Frase |
| --- | --- |
| 0,5 – 4,2 | «I've had the trail on my bucket list for about 10 years» |
| 5,1 – 11,4 | «…and wanting to do it, because I understand there's a lot of emotion that goes into» |
| 11,9 – 14,9 | «a 100-kilometer hike over five days» |
| 16,8 – 21,8 | «Having somebody Sherpa your belongings from town to town, so you can really focus on the hike» |
| 22,3 – 24,2 | «The only way to go» |
| 25,2 – 30,7 | «Makes it a really great trip in a lot of ways, because for one, I'm not carrying it all on my back» |
| 31,2 – 35,6 | «There's nothing better than laying down in a nice clean bed and a shower after a long day of hiking» |
| 36,3 – 42,6 | «I won't be sleeping in a tent or at some hostel, so I'm glad we're doing it this way» |

## Los planos de recurso

**Ninguno sale del master**, salvo las cuatro veces en que se ve hablar a
alguien. Los del master son planos generales pensados para 16:9 y al
recortarlos a vertical la acción se queda fuera de cuadro. El resto viene de
la biblioteca y va centrado, elegido mirando cómo queda ya recortado a 9:16.

### Caras

| Entra | Sale | Quién |
| --- | --- | --- |
| 0,0 s | 4,6 s | el padre |
| 17,7 s | 19,0 s | el padre |
| 26,9 s | 29,1 s | el hijo |
| 35,2 s | 36,7 s | el hijo |

### Camino, sobre lo que cuenta el padre

| Entra | Sale | Plano |
| --- | --- | --- |
| 4,6 s | 6,6 s | `piezas-viejas/peregrinos-calzada` |
| 6,6 s | 8,1 s | `pareja-muros` (1080p) |
| 8,1 s | 10,3 s | `testimonios/camino-dedaleras` |
| 10,3 s | 12,9 s | `piezas-viejas/sendero-peregrinos` |
| 12,9 s | 14,9 s | `piezas-viejas/grupo-calle` · tapa la juntura del corte |
| 14,9 s | 16,7 s | `piezas-viejas/calle-aldea` |

### Equipaje

| Entra | Sale | Plano |
| --- | --- | --- |
| 16,7 s | 17,7 s | `testimonios/maletas-portal` |
| 19,0 s | 21,1 s | `piezas-viejas/maletas-etiqueta` |
| 21,1 s | 22,2 s | `testimonios/etiquetas-maletas` |
| 22,2 s | 23,9 s | `piezas-viejas/maleta-concha` · **sobre «The only way to go»** |

El plano nuevo es `etiquetas-maletas`, y el de la concha se ha movido para
que caiga entero sobre la frase que remata el tramo. Van los tres seguidos y
ninguno baja de 1,1 s: en la V3 el tramo eran cinco planos y dos de ellos no
llegaban al segundo, y parpadeaba.

### Alojamiento

| Entra | Sale | Plano |
| --- | --- | --- |
| 23,9 s | 25,9 s | `piezas-viejas/pazo-blanco` · fachada, x0,86 |
| 25,9 s | 26,9 s | `piezas-viejas/galeria-hotel` |
| 29,1 s | 31,1 s | `habitacion` (1080p) · la mejor cama que hay |
| 31,1 s | 32,3 s | `testimonios/bano-ducha` |
| 32,3 s | 34,2 s | `piezas-viejas/habitacion-ventanal` |
| 34,2 s | 35,2 s | `piezas-viejas/salon-rustico` |
| 36,7 s | 38,4 s | `piezas-viejas/habitacion-piedra` |
| 38,4 s | 39,7 s | `casa-rural` (1080p) · fachada, x0,85 · **sobre «not at some hostel»** |

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
| 39,7 s | 41,4 s | `testimonios/grupo-compostelas` · las dos peregrinas con su Compostela |
| 41,4 s | 42,6 s | `brazos-alto` (1080p) · los brazos en alto, x0,8 |
| 42,6 s | 45,9 s | `testimonios/fachada-obradoiro` · **la catedral, bajo el CTA** |
| 45,9 s | 49,2 s | placa de marca |

El cierre se dice sobre el sitio, no sobre el alojamiento: primero la gente
llegando, después la catedral, que es lo que remata. La fachada del Obradoiro
lleva una panorámica lenta y aguanta los 3,3 s sin quedarse quieta.

## Las cartelas

| Entra | Sale | Texto |
| --- | --- | --- |
| 0,7 s | 7,4 s | Camino de Santiago / **fully organised** |
| 16,9 s | 23,8 s | Your luggage / **travels for you** · «Hotel to hotel, every stage» |
| 29,9 s | 35,5 s | A clean bed / **and a hot shower** · «Waiting for you every night» |
| 36,3 s | 39,7 s | Always private / **room & bathroom** · «Hand-picked hotels» |
| 42,75 s | 45,7 s | Your Camino / **starts here** · el CTA |

**Van a 480 px del borde inferior**, no a 72 como en horizontal: en stories y
en TikTok los últimos 300 px los tapa la interfaz, y TikTok mete además el pie
de foto y el usuario por encima de eso. A la derecha no hace falta margen
extra: la caja más ancha llega al píxel 799 y el carril de botones de TikTok
empieza sobre el 880.

El cuerpo es de 76 px. Se midió la caja ya renderizada, que Montserrat 900
ocupa 0,565 em por carácter y no los 0,88 que se supusieron al principio.

La cartela del equipaje se alarga hasta el 23,8 para cubrir «The only way to
go», y la del baño se recorta al 39,7 para dejar la llegada limpia: un rótulo
de hotel sobre unos peregrinos abrazándose no pega.

**El CTA necesita más ventana de la que parece.** Entra con el barrido de 27
fotogramas más los 14 de relevo entre líneas, así que hasta el segundo y pico
no está entero, y sale con otros 12. Con la ventana de la V6, del 42,9 al
45,2, «starts here» se quedaba entero medio segundo. Ahora va del 42,75 al
45,7 y la placa de marca espera al 45,9.

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
`casa-rural` y `brazos-alto`, suben sólo 1,78x y se ve. No hay más material de
alojamiento ni de llegada a esa resolución.

Si hiciera falta más calidad, la salida sería grabar vertical de origen, o
montar en 720x1280 en lugar de 1080x1920, donde el aumento baja a 1,78x.

## Lo que falta decidir

- **Subtítulos incrustados.** En stories y TikTok se ve en silencio, y aquí
  además el testimonio es en inglés. Habría que decidir si van en inglés o
  traducidos, y dónde: la franja de abajo la ocupan las cartelas.
- **Versión sólo de hoteles.** Si se prefiere una pieza más corta y toda sobre
  alojamiento, sale una de unos 26 s empezando en el segundo 16,7.
