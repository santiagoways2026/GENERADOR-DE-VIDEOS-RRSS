# Guion · Camino de Santiago a partir de los 55, para YouTube

Pieza **horizontal, 1280x720, de 2:18**, sin presentador. Composición
`YouTubeMayores55` (máster limpio) y `YouTubeMayores55Guia` (con la locución
escrita en pantalla para revisar el montaje sin audio).

## El planteamiento

Del briefing: un vídeo de verdadera utilidad para quien se lo está pensando,
que toque el corazón porque el Camino no es un viaje cualquiera, con gente
real, sin presentador y con gráficos solo donde expliquen algo.

1. **Gancho emocional.** El momento vital en que se decide ir: una
   jubilación, un cumpleaños redondo, los hijos que ya vuelan solos. Es el
   hallazgo central de la investigación de motivaciones (Kurrat, 2019;
   Nelson-Becker y otros, 2020).
2. **El dato que tranquiliza.** Casi la mitad de quienes llegan tiene más de
   45 años.
3. **Tres claves prácticas**, cada una con su capítulo: haber caminado antes,
   el día más largo y la bajada a Portomarín, y el calzado de siempre.
4. **Cierre emocional.** Lo que más se recuerda no son los kilómetros.
5. **Un CTA de comentario con pregunta de experiencia** y pantalla final
   blanca con "Suscríbete".

## Locución

255 palabras a unas 120 por minuto, por debajo del techo de 150 a 160
para subtítulo adulto. El texto y los tiempos viven en
`video/src/datos/locucion-55.json`, del que salen el vídeo y los `.srt`.

Los corchetes no se leen. Medio segundo de pausa entre bloques.

> **[GANCHO · 0:00]**
> Hay viajes que se hacen.
> Y hay uno que mucha gente guarda durante años, esperando el momento.
> Una jubilación.
> Un cumpleaños redondo.
> Los hijos que ya vuelan solos.
> Si ese momento ha llegado y te preguntas si aún estás a tiempo, un dato:
> casi la mitad de quienes llegan a Santiago tiene más de 45 años.
> No vas a ser la excepción.
> Esto es lo que conviene saber antes de ir.
>
> **[1 · ESTAR EN FORMA · 0:39]**
> Primera. No hace falta estar en forma.
> Hace falta haber caminado.
> Sal a andar varias veces por semana, ve subiendo poco a poco, y haz algún día largo antes de ir.
> Es la mejor preparación que hay.
>
> **[2 · EL DÍA MÁS LARGO · 0:57]**
> Segunda. Y esta casi nadie la cuenta.
> Desde Sarria son cinco etapas y ningún puerto de montaña.
> Pero la más larga, de Palas de Rei a Arzúa, son 28 kilómetros y medio de cuestas pequeñas que se notan.
> Si quieres, se parte en dos, en Melide.
> Y ojo a la bajada a Portomarín: es la que más notan las rodillas.
>
> **[3 · LOS ZAPATOS · 1:25]**
> Tercera. Los zapatos.
> Para unos días caminando sin mochila, lo mejor es el calzado con el que ya andas cómodo.
> Y si compras, media talla más: con los kilómetros, los pies se hinchan.
>
> **[LO QUE SE RECUERDA · 1:42]**
> Y lo que más se recuerda no cabe en ningún perfil de etapa.
> Quienes vuelven no hablan de kilómetros.
> Hablan de la gente que conocieron, y de la llegada.
>
> **[CIERRE · 1:58]**
> Si ya lo has hecho, cuéntanos en los comentarios desde dónde empezaste.
> Y si lo estás pensando, suscríbete: te acompañamos paso a paso.
> Buen Camino.

## Montaje

El metraje propio es casi todo vertical. No se estira: se enseña en
**trípticos** y **pantallas divididas** sobre blanco, y el horizontal se usa a
pantalla completa.

| Tramo | Imagen |
| --- | --- |
| 0:00 | Grupo de peregrinos por el sendero, horizontal |
| 0:09 | Tríptico: peregrina con bastones, la fuente, el sello en la credencial. Cada panel entra cuando la voz lo nombra |
| 0:16 | Sendero al sol y peregrinos ante la iglesia |
| 0:23 | Gráfico: casi la mitad tiene más de 45 años, con figuras que se encienden hasta 4,8 de 10 |
| 0:31 | Texto sobre vídeo: "No vas a ser **la excepción**" |
| 0:37 | Cabecera del brandbook: logo y web |
| 0:39 | Capítulo 1 y pantalla dividida "Hace falta haber **caminado**" |
| 0:57 | Capítulo 2, "5 etapas y **ningún puerto**" con las letras de Sarria, perfil de etapas y "Ojo a la **bajada**" con el puente de Portomarín |
| 1:25 | Capítulo 3, "Tu calzado **de siempre**" con pies caminando |
| 1:42 | Brindis, Compostela, sello; tríptico de mojón, vacas y Obradoiro |
| 1:58 | Texto sobre vídeo: "¿Desde dónde **empezaste**?" |
| 2:10 | Pantalla final blanca con logo y "Suscríbete" |

## Subtítulos y traducción

- Pistas `.srt` en español e inglés, generadas con
  `herramientas/scripts/srt.py` desde el mismo JSON que el vídeo.
- El máster va sin subtítulos quemados, para que la pista en inglés no se pise
  con la española.
- Al llegar la locución grabada: medir silencios, ajustar los tiempos del JSON
  y de `T` en la composición, y regenerar los `.srt`.

## Título, miniatura y capítulos

- **Título:** *Camino de Santiago a partir de los 55: 3 cosas que debes saber*
- **Inglés:** *The Camino de Santiago after 55: 3 things to know*
- **Miniatura:** titular grande sobre foto de peregrinos, con una sola parte
  subrayada en verde, por ejemplo "A partir de los **55**".

```
00:00 ¿Estás a tiempo?
00:39 No hace falta estar en forma
00:57 El día más largo desde Sarria
01:25 Qué zapatos llevar
01:42 Lo que de verdad se recuerda
```

## Por confirmar antes de publicar

- La cifra de edad de 2025: sale del panel de la Oficina del Peregrino a
  través de la Federación de Amigos del Camino, y el panel no permite
  descargarla.
