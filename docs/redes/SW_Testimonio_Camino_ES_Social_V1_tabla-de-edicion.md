# Testimonio del Camino · español · redes · V1

Pieza de 50,2 s, 1280x720 a 30 fps. Sale de la pieza social antigua, que
duraba 60,1 s con cartela de agencia, fundido final y dos marcas de agua.

Fuente viva: `video/src/SWSocialCaminoES.tsx`.

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

## Qué se quitó del testimonio, para darle ritmo

Un tramo de 9,6 s que repetía una idea ya dicha y terminaba en una frase a
medias:

> «Y la verdad es que son una gente muy amable, muy atenta, y cualquier
> información que les he pedido… me lo han mandado sin ningún problema.
> Y hasta ahora todo muy bien.»

La misma idea ya estaba dos frases antes, mejor dicha: «desde el primer
momento me han atendido muy, muy bien». El corte va por el silencio entre
frases, con 60 ms de fundido a cada lado. No hay música de fondo, solo
ambiente, así que la juntura no se oye.

El montaje pasa de 57,3 s a 47,2 s, y con la placa de marca cierra en 50,2 s.

## Planos de recurso añadidos

Van mudos, solo imagen: el audio que suena es siempre el continuo del montaje.
Los tres salen de tomas que el corte de audio dejaba fuera, así que no se
repite ninguna.

| Entra | Sale | Qué se ve | Para qué |
| --- | --- | --- | --- |
| 5,80 s | 7,75 s | Camino abierto con una peregrina | La apertura se quedaba 6,2 s en el mismo contraluz |
| 24,55 s | 26,35 s | Dos peregrinas con mochila | Tapa la juntura del corte, que cae en 25,10 |
| 34,60 s | 36,40 s | Peregrino con mochila grande | Rompe 4,2 s de entrevista seguida |

## Cartelas

| Entra | Sale | Texto | Pie | Sobre qué |
| --- | --- | --- | --- | --- |
| 0,40 s | 5,30 s | Nunca es tarde / **para el Camino** | Camino de Santiago · España | «venir al Camino era un desafío personal» |
| 11,20 s | 15,80 s | **Tú caminas.** / Nosotros nos ocupamos / del resto | — | «estamos muy contentos con la organización» |
| 17,40 s | 21,60 s | Hoteles / **elegidos y probados** | Por nuestro propio equipo · Habitación y baño privados | «los dos alojamientos que llevamos» |
| 26,80 s | 31,00 s | Tu mochila / **viaja sola** | Transporte de equipaje, de hotel a hotel | «el servicio de recogida de equipaje», sobre el plano de las maletas |
| 37,70 s | 42,00 s | Y al final, / **Santiago** | — | Sobre la catedral |

En negrita, lo que lleva el recuadro verde.

## Cierre

1. 43,60 s · «Tu Camino / **empieza aquí**» sobre el último plano, con el
   overlay diagonal. Va abajo y no a media altura: el último plano es un
   primer plano y a media altura el recuadro cae sobre la cara.
2. 46,55 s · Placa de marca. Logo blanco centrado sobre el degradado de
   verdes de la guía, y `santiagoways.com` debajo en blanco.

Termina en la marca, sin fundido a negro.

## Comprobaciones hechas

- El montaje se volvió a transcribir después de cortar: ninguna frase queda
  partida y la juntura cae en silencio.
- Se comprobó si hablaba más de una persona, comparando el timbre de cada
  tramo de voz. Es una sola: los dos hombres distintos que salen en pantalla
  son planos de recurso, no un segundo testimonio.
- Ninguna toma se repite, ni entre bloques contiguos ni en toda la pieza.
- Ninguna cartela cae sobre una cara.

## Lo que falta decidir

- **Subtítulos incrustados.** En redes se ve en silencio. El `.srt` está al
  lado, pero si se quieren quemados hay que decidir dónde: ahora mismo la
  franja de abajo a la izquierda es de las cartelas.
- **Versión vertical** 1080x1920 para reels y stories. El recorte a vertical
  se lleva los laterales, así que hay que revisar plano a plano.
- Tres palabras del testimonio venían dudosas en la transcripción y están
  puestas con el mejor criterio: «era saber si podíamos llegar a hacerlo»,
  «recorridos, excursiones» y «solo llevamos lo imprescindible». Conviene que
  alguien las oiga antes de publicar el `.srt`.
