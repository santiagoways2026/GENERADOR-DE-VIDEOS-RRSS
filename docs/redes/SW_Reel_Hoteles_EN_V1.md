# Reel de hoteles · testimonio en inglés · vertical · V1

Pieza de 59,2 s, 1080x1920 a 30 fps, para stories y TikTok.

Fuente viva: `video/src/SWReelHotelesEN.tsx`.

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

## Los planos de alojamiento

Van mudos, sólo imagen: el audio es siempre el continuo del master.

| Entra | Sale | Plano | Sobre qué frase |
| --- | --- | --- | --- |
| 31,7 s | 33,4 s | `piezas-viejas/pazo-blanco` | «Sherpa your belongings from town to town» |
| 43,9 s | 46,0 s | `habitacion` (1080p) | «laying down in a nice clean bed» |
| 46,0 s | 47,1 s | `testimonios/bano-ducha` | «and a shower» |
| 47,1 s | 48,4 s | `piezas-viejas/habitacion-granate` | «after a long day of hiking» |
| 49,4 s | 51,1 s | `piezas-viejas/habitacion-ventanal` | «I won't be sleeping in a tent» |
| 51,1 s | 52,5 s | `piezas-viejas/bano-lavabo` | «or at some hostel» |
| 52,5 s | 54,4 s | `piezas-viejas/galeria-hotel` | «so I'm glad we're doing it this way» |

El master ya trae por su cuenta fachadas de hotel en ese tramo. Lo que no
tenía, y es lo que se añade, son camas y baños.

## Cartelas

| Entra | Sale | Texto | Pie |
| --- | --- | --- | --- |
| 0,8 s | 5,6 s | Some journeys / **stay with you** | Camino de Santiago |
| 30,0 s | 35,4 s | Your luggage / **travels for you** | Hotel to hotel, every stage |
| 43,4 s | 48,4 s | A clean bed / **and a hot shower** | Waiting for you every night |
| 49,5 s | 54,6 s | Always private / **room & bathroom** | Hand-picked hotels |

En negrita, lo que lleva el recuadro verde. Todas a 58 px y en dos líneas.

**Van a 330 px del borde inferior**, no a 72 como en horizontal: en stories y
en TikTok los últimos 300 px los tapa la interfaz, la barra de enviar mensaje
y los botones de la derecha.

## Cierre

55,4 s · Placa de marca: logo blanco centrado sobre el degradado de verdes de
la guía y `santiagoways.com` debajo, en blanco. Termina ahí, sin fundido a
negro.

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
- **Versión sólo de hoteles.** Si se prefiere una pieza corta y todo sobre
  alojamiento, sale una de unos 33 s empezando en el segundo 29,5.
