# Short A · Why the French Way? · YouTube Shorts EN

Primera pieza del canal de YouTube en inglés. Es un *spoke*: su trabajo no es
contar el Camino, es llevar a la guía completa del Camino Francés y abrir
conversación en comentarios.

- **Composición:** `ShortFrancesUS` · 1080x1920 · 30 fps · 53 s
- **Locución:** `video/public/locucion-frances.mp3` (ElevenLabs, voz Brittney)
- **Música:** `video/public/musica.mp3`, entrando por el segundo 59
- **Salida:** `salidas/short-frances-us.mp4`
- **Preview:** `salidas/short-frances-us-preview720.mp4` (720x1280)
- **Timeline:** `docs/shortA_timeline.json`

```bash
cd video
npx remotion render ShortFrancesUS ../salidas/short-frances-us.mp4 --crf=23
```

## Lo que hay que saber antes de tocarlo

**Las fuentes.** Esta pieza es la primera que sale con la tipografía de marca
puesta de verdad. Hasta ella, los `@fontsource` no cargaban nada y todo se
renderizaba con la letra del sistema. Ahora los woff2 están en
`video/public/fuentes/` y la pieza llama a `useFuentesDeMarca()`. Si se
estrena otra composición, que la llame también.

**Y el titular es Montserrat 900, no Manrope.** Con la carga arreglada seguía
viéndose flojo, y no era la carga: el patrón de titular de la guía pide peso
900 y Manrope se queda en 800. Manrope sólo sostiene el texto de apoyo.

**Dura 53 s y el brief pedía 40-42.** La locución grabada dura 51,6 s, así que
la pieza no cabe en el máximo del brief. Shorts admite hasta 3 minutos, de
modo que se puede publicar tal cual, pero si hace falta bajar a 42 s hay que
recortar locución, no montaje. Los dos sitios con más grasa:

- El bloque 6 dura casi 11 s. Quitando las tres preguntas sueltas («Saint
  Jean? Sarria? Somewhere in between?») se ahorran unos 2,7 s sin tocar la
  llamada a comentar.
- El bloque 4 dura 8,2 s. La frase «And here's what most people don't know»
  se puede caer entera: el dato aguanta solo.

**El mapa es el peninsular, no el del noroeste.** El rótulo dice «7 routes» y
el espectador las cuenta. El mapa del reel del Xacobeo solo dibuja cinco, así
que aquí se usa la vista `peninsula`, que abre hasta Sevilla y Lisboa. Si se
cambia el número del rótulo, hay que cambiar la vista.

**Son 115 km desde Sarria, no 117.** El brief decía 117; el configurador de
rutas de la casa dice 115 y es lo que está en pantalla, por coherencia con el
resto de materiales. Si la cifra buena es otra, se cambia en un sitio.

**La voz va amplificada 2,2.** Esta locutora grabó 8 dB por debajo de la del
reel del Xacobeo. Cada voz de ElevenLabs sale a su nivel y hay que igualarlas,
o la pieza suena floja al lado de cualquier otra del feed.

## Lo que este canal hace distinto

Tres cosas que no se aplican en Instagram y que conviene no unificar por
descuido:

1. **Subtítulos quemados.** En Shorts se ve mucho sin sonido. Ocupan la franja
   de 1420 a 1520, así que todo lo demás termina antes de 1400: es la razón
   de que los gráficos vayan más arriba que en un reel.
2. **El CTA sí va dentro del vídeo.** En Instagram lo pone quien publica, pero
   aquí la llamada señala algo que está en la propia pantalla, los comentarios
   y el vídeo de debajo, y eso ningún pie de publicación puede hacerlo. Las
   dos llamadas van separadas y en este orden: primero comentar, después la
   guía. Nunca en el mismo rótulo.
3. **Las flechas se dibujan, no se escriben.** Los emojis y los caracteres
   geométricos no están en Montserrat y saldrían como una caja vacía.

## Cada bloque cuenta el texto de otra manera

| Bloque | Recurso |
| --- | --- |
| 1 · Siete rutas | Placas de marca sobre el mapa |
| 2 · 780 km | Mapa con cuentakilómetros, y después la cifra grande contando desde cero |
| 3 · Por qué esa | Tres titulares sobre la imagen, uno cada vez |
| 4 · Sarria | Cifra grande, con el detalle en placa debajo |
| 5 · Mismo Camino | Lista con checks: es el único sitio donde la voz enumera servicios |
| 6 y 7 · Llamadas | Titular sobre la imagen, con una línea pequeña debajo |

Una pieza entera a base de listas y placas parece una plantilla, y hace que
todas las piezas de la marca parezcan la misma. El `Titular` existe para eso:
texto grande sobre el metraje, con la frase clave en bloque verde y letra
blanca, que es el patrón de titular de la guía.

Los planos priorizan caras: `brindis`, `compostela`, `brazos-alto`,
`pareja-muros` y `mochila-ligera` son los que tienen gente sonriendo, y van
donde más pesa la emoción.

## Subtítulos, y por qué el montaje estaba corrido

La primera versión repartió el guion entre los tramos de voz a ojo y salió
corrida casi dos segundos de la mitad en adelante: los bloques 4, 5 y 6
arrancaban antes de que la voz llegara a su frase. No se veía en el código ni
lo detectaba ningún script, solo se oía.

Ahora lo reparte un alineador. Localiza los tramos de voz, cuenta las sílabas
de cada palabra y busca con programación dinámica el corte que mejor ajusta
el peso del texto a la duración de cada tramo, penalizando los cortes que no
caen en un punto o una coma:

```bash
python3 herramientas/scripts/alinear-locucion.py \
  video/public/locucion-frances.mp3 video/public/guiones/frances.txt frances
```

Lo que valida el resultado son las tres preguntas sueltas del guion («Saint
Jean? Sarria? Somewhere in between?»): son los tres únicos tramos de medio
segundo del audio y van seguidos, así que solo encajan en un sitio. El
alineador los coloca ahí, y de ese ancla salen los tiempos de todos los
bloques.

Si algún día llega un SRT de verdad, lo sustituye y es mejor todavía:

```bash
node herramientas/scripts/srt-a-cues.mjs captions.srt frances
```

## Publicación

**Título:** The Camino de Santiago Isn't One Route (Here's the One Most People
Walk)

**Descripción:**

> Seven routes, one French Way. Full stage-by-stage guide → [link]. Where did
> you start yours? #CaminoDeSantiago #FrenchWay #CaminoFrances
> #WalkingHoliday #Spain

**Comentario fijado:**

> Where did you start the French Way? Saint Jean, León, Sarria... tell us
> below 👇 Full guide with every stage here: [link con
> `utm_source=youtube&utm_medium=shorts&utm_campaign=frenchway_us&utm_content=short_a_why`]

**Related video:** la guía del Camino Francés.

## Pendiente

- **Los assets del brief no existen en este repositorio.** El brief da por
  disponibles `/assets/maps/*.mp4` y `/assets/broll/*.mp4`, que son rutas de
  otro sistema. Los mapas se han resuelto con el componente `MapaRutas`, que
  además sale determinista y en marca; el b-roll, con los planos de
  `video/public/brutos/`.
- **Falta metraje de café y de aldea con gente.** El bloque 3 habla de «a
  village, a bed and a café» y lo ilustran una casa rural y una mesa puesta,
  las dos sin nadie. Con un plano de terraza con gente ese bloque mejoraría.
- **El Short B necesita el mapa de Sarria.** La vista `peninsula` ya lo
  permite: es pasarle `soloRuta="cien"` a `MapaRutas`.
