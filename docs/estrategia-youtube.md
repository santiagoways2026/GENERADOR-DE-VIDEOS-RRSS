# Estrategia de YouTube

Análisis con datos propios, no con buenas prácticas genéricas. Las cifras salen
de Metricool, Windsor y la API de YouTube, medidas en noviembre de 2026.

## Los dos canales

| Canal | ID | Suscriptores | Vídeos |
| --- | --- | --- | --- |
| Santiago Ways (ES) | `UCi-cWDFkaI9p73AwYHVwOnQ` | 5.380 | 32 listados |
| Santiago Ways (EN) | `UCjX2JkKlRohlpWAKPOsCkNQ` | 21 | 2 listados |

El conector de Windsor apunta al canal en inglés y Metricool al español. No son
la misma fuente, y conviene no mezclar sus cifras.

## El hallazgo que condiciona todo lo demás

Fuentes de tráfico del canal español, de mayo a noviembre de 2026:

| Fuente | Visualizaciones | Peso |
| --- | --- | --- |
| Publicidad | 189.341 | 51,5 % |
| URL externa (web propia) | 173.870 | 47,3 % |
| Búsqueda de YouTube | 2.113 | 0,57 % |
| Suscriptores | 820 | 0,22 % |
| Vídeo relacionado | 185 | 0,05 % |
| Feed de Shorts | 52 | 0,01 % |
| Pantalla final | 2 | 0,00 % |

**El 98,8 % del alcance es comprado o embebido en la web propia. El
descubrimiento orgánico de YouTube, sumando búsqueda, sugeridos y Shorts, es el
0,6 %.** Dos pantallas finales en seis meses significa que, en la práctica, no
hay pantallas finales.

Esto cambia el objetivo. No se trata de optimizar un canal que funciona
orgánicamente, sino de arrancar un canal que todavía no lo hace.

## La carencia técnica que sí importa

De los 13 vídeos que devuelve la API con sus metadatos:

- `video_has_captions` es `false` en **todos**.
- `video_tags` es `null` en **todos**.

**De estas dos, solo una es un problema.** La documentación de YouTube clasifica
las etiquetas como "Not important" y explica que sirven sobre todo para corregir
faltas de ortografía frecuentes. Etiquetar el catálogo entero sería trabajo
tirado; como mucho, añadirlas donde haya variantes mal escritas como "camino
santiago", "jacobeo" o "Xacobeo".
[YouTube performance FAQ](https://support.google.com/youtube/answer/141805?hl=en)

Los subtítulos son otra cosa, y el argumento no es de posicionamiento sino de
comprensión. La revisión del W3C recoge que el 47 % de las personas de 61 a 80
años tiene alguna pérdida auditiva, y el 93 % de las mayores de 81, y que el
ruido de fondo les resulta difícil de filtrar.
[W3C, usuarios mayores](https://www.w3.org/WAI/older-users/literature/)
Con una audiencia que en un 69 % pasa de 55 años, subtitular no es una táctica
de alcance: es que se entienda.

Y hay un segundo efecto, este sí de alcance. Para reforzar la pista de audio en
otro idioma, YouTube publica que los creadores que subieron audio multiidioma
vieron **más del 25 % de su tiempo de visionado venir del idioma no principal**.
[Multi-language features](https://support.google.com/youtube/answer/13338784?hl=en)

## Capítulos, que aquí valen doble

Requisitos oficiales: al menos tres marcas de tiempo en orden ascendente, la
primera obligatoriamente `00:00`, y mínimo 10 segundos por capítulo.
[Chapters](https://support.google.com/youtube/answer/9884579?hl=en)

Lo interesante es que no son solo un activo de YouTube. Google Search Central
documenta los "key moments" y dice que si el vídeo está alojado en YouTube se
pueden marcar desde la descripción.
[Google Search Central, vídeo](https://developers.google.com/search/docs/appearance/video)
Como 173.870 visualizaciones ya vienen de la web propia embebida, los capítulos
hacen esas piezas direccionables desde la búsqueda de Google.

## La audiencia real

### Geografía, por seguidores del canal español

| País | Peso |
| --- | --- |
| España | 43,3 % |
| Estados Unidos | 17,9 % |
| Irlanda | 13,5 % |
| Reino Unido | 10,4 % |
| Italia | 2,0 % |
| Canadá | 1,7 % |
| Alemania | 1,6 % |

**Latinoamérica entera suma en torno al 0,65 %**, sumando México, Argentina,
Colombia, Uruguay, Brasil, Chile, Perú, Ecuador y el resto. México, el primero
de ellos, es el 0,2 %.

Es decir: el 42 % de la audiencia está en países de habla inglesa (EE. UU.,
Irlanda, Reino Unido y Canadá) y el 43 % en España.

**Matiz importante:** como el 98,8 % del tráfico es publicidad y web propia, esta
geografía describe a quién se le ha pagado por llegar, no a quién encontraría el
canal por su cuenta. Es el reflejo de la segmentación de campañas, no una
preferencia del mercado.

### Edad, por seguidores del canal español

| Franja | Peso |
| --- | --- |
| 55-64 | 35,0 % |
| 65+ | 34,1 % |
| 45-54 | 18,7 % |
| 35-44 | 6,1 % |
| 13-17 | 3,0 % |
| 25-34 | 2,6 % |
| 18-24 | 0,4 % |

**El 69 % tiene 55 años o más. El 88 % tiene 45 o más. Los menores de 35 son el
3 %.** Este dato condiciona el estilo más que ningún otro.

## Retención medida, no estimada

Del canal en inglés, con porcentaje medio visto:

| Pieza | Duración | Vistas | % medio visto |
| --- | --- | --- | --- |
| The next Holy Year won't be until 2032 | 0:32 | 36 | 92,6 % |
| Why is 2027 so special for the Camino? | 0:41 | 337 | 90,9 % |
| What is the Camino de Santiago? | 0:53 | 214 | 69,5 % |
| Camino Frances Route from Sarria | 11:29 | 532 | 48,5 % |
| Walk your Way: Make the Camino Fit You | 25:58 | 250 | 30,3 % |

Del canal español, calculando sobre duración y duración media vista:

| Pieza | Duración | Vistas | Retención |
| --- | --- | --- | --- |
| Camino Portugués desde Tui, Guía Completa | 7:53 | 5.712 | ~40 % |
| Guía Completa del Camino francés desde Sarria | 6:21 | 2.901 | ~41 % |
| Camino de Santiago 2026, Guía Completa | 6:14 | 616 | ~25 % |

Lo que esto dice:

1. El formato "guía completa" de 6 a 8 minutos es el que mejor funciona en
   orgánico, y es el que más minutos de visionado acumula.
2. Pasar de 25 minutos hunde la retención a la mitad.
3. Los vídeos de curiosidad con respuesta corta llegan al 90 %.

## El punto más flojo: no hay conversación

Los comentarios van de 0 a 6 por pieza en todo el canal. La mayoría tiene cero.
Con 5.380 suscriptores y casi 370.000 visualizaciones en seis meses, eso no es
una audiencia pequeña: es una audiencia que no tiene motivo para escribir.

## Lo que dice la investigación sobre vídeo educativo

Dos referencias con revisión por pares, no blogs de herramientas:

- **Guo, Kim y Rubin (2014)**, *How video production affects student engagement*,
  L@S '14, sobre 6,9 millones de sesiones en edX. Recomiendan planificar
  segmentos de menos de 6 minutos en preproducción, y encuentran que dibujar a
  mano supera a las diapositivas.
  [ACM](https://dl.acm.org/doi/10.1145/2556325.2566239)
- **Brame (2016)**, *Effective Educational Videos*, CBE Life Sciences Education
  15:es6. Textual: "time for a video of any length was 6 minutes" y "use
  signaling to highlight important ideas or concepts". Sus cuatro palancas son
  señalización, segmentación, poda y ajuste de modalidad.
  [doi](https://doi.org/10.1187/cbe.16-03-0125)

Cruzado con el dato de edad, la conclusión es que el estilo de corte rápido y
tensión constante que funciona con audiencias de 18 a 34 años no es lo indicado
aquí. Tensión sí, en momentos marcados; frenesí no.

## Lo que no se ha podido medir

- **Semrush** devuelve `no_api_units`: la cuenta es una subcuenta corporativa sin
  unidades de API. Hay que pedir al propietario de la cuenta que asigne más.
- El vídeo de YouTube no se puede descargar para analizarlo fotograma a
  fotograma: el CDN `googlevideo.com` está inalcanzable desde este entorno. Los
  metadatos sí se obtienen.
- `pexels.com` y `pixabay.com` están bloqueados por la política de red. `coverr.co`
  y `mixkit.co` sí responden.

## Qué busca la gente, de verdad

Recogido en vivo del autocompletado de Google y de YouTube por idioma y país.
Son cadenas de sugerencia reales, no suposiciones. **Sin volúmenes, porque
Semrush está sin unidades de API.**

### Lo que cambia la decisión

**1. Existe demanda explícita por edad, y es exactamente el producto.**
En Google en español: `camino de santiago para mayores de 65 años`, `para
mayores de 60`, `para mayores de 50 años`, `para mayores de 70 años`, `para
personas mayores` y `camino de santiago organizado para personas mayores`. En
inglés: `camino de santiago for seniors` y `camino de santiago tours for
seniors`.

Esto coincide con la franja de edad que ya tiene el canal. No hay ni una pieza
que ataque esas consultas.

**2. El punto de partida es el modificador dominante.**
En español, `desde sarria` aparece en casi todas las raíces. En inglés, `from
porto`, `from sarria`, `from leon`, `from tui`. Y desde Irlanda, que es el 13,5 %
de la audiencia, aparece `camino de santiago last 100km`, que es literalmente el
producto de Sarria. Los títulos deberían nombrar el punto de partida.

**3. La estación es un eje que el canal no usa.**
`camino de santiago desde sarria en noviembre`, `en invierno`, `en octubre`,
`en julio`; `mochila camino de santiago invierno / verano / otoño`. En inglés,
`in september`, `in october`, `in march`.

**4. Las consultas de comparación están mal servidas.**
`camino frances vs camino portugues`, `qué camino de santiago elegir`, `which
route`, `best camino route for first timers`.

**5. En YouTube la demanda del Año Santo vive bajo "Xacobeo", no bajo "año
santo".** `xacobeo 2027` es la primera sugerencia de su raíz, mientras que `año
santo 2027` no devuelve prácticamente nada en YouTube. En la búsqueda web de
Google ocurre lo contrario: ahí sí funcionan `año santo 2027`, `año santo
compostelano 2027` y `año santo jacobeo 2027`.

Conclusión operativa: titular a "Xacobeo" en YouTube y a "Año Santo" en la web.
Los dos Shorts del canal sobre este tema retienen al 90,9 % y al 92,6 %, y no
los encuentra nadie.

### Inglés, modificadores más repetidos

`packing list` es el más recurrente con diferencia, seguido de `what to pack`,
`which route`, `best route`, `how to plan`, `training for`, `cost`, `alone`,
`safety`.

## Qué provoca comentarios

No hay ningún estudio controlado que compare en YouTube un CTA específico contra
un "comenta abajo" genérico. Lo más cercano y transferible:

- Las publicaciones interactivas, en particular las preguntas, aumentan los
  comentarios. Estudio sobre 106.316 mensajes de 782 empresas.
  [SAGE Open](https://journals.sagepub.com/doi/10.1177/21582440231219096)
- **El tipo de pregunta importa y depende del producto:** las preguntas de
  experiencia funcionan mejor para productos hedónicos y las de búsqueda para
  los utilitarios.
  [Journal of Business Research](https://www.sciencedirect.com/science/article/abs/pii/S0148296322005306)

El Camino es un producto hedónico, así que la pregunta debe ser de experiencia,
no de especificación. "¿Desde dónde empezaste y en qué año?" tiene mejor apoyo
que "¿qué mochila usas?".

Un matiz honesto: puede que el problema de comentarios sea estructural y no de
redacción. Una audiencia que llega desde un anuncio o desde un reproductor
embebido en la web no está en disposición de comentar, y desde el embebido es
más incómodo hacerlo.

## Qué premia un jurado

Criterios oficiales de los Webby en Video & Film, que es lo único verificado:
concepto y escritura, calidad de oficio, integración, ejecución y experiencia
global. Dicen expresamente que la calidad de oficio "means more than just a
pretty looking film or video" y que no hace falta que sea puntera ni estar de
moda. En las categorías de Branded Entertainment valoran que la marca esté
"balanced rather than heavy-handed".
[Webby judging criteria](https://www.webbyawards.com/judging-criteria/)

**Nada en esos criterios premia la densidad de cortes ni de ganchos.** Lo que se
juzga es el concepto, la coherencia del relato y el oficio. Eso respalda la regla
de un solo CTA por pieza que ya tiene la marca.

## Lo que se ha descartado por mala fuente

- Las cifras de "un corte cada 30 a 60 segundos" o "cada 10 a 20 segundos" salen
  de blogs de marketing que no citan estudio y se contradicen entre sí. No se
  usan.
- El "los subtítulos suben las visualizaciones un 7,32 %" es un estudio de 2014
  publicado por un proveedor de subtitulado. Indicativo, no planificable.
- La cifra de 160 a 180 ppm de la BBC no se ha podido verificar en el documento
  oficial. Se usa la de la DCMP y la de Ofcom.
- No se ha encontrado ninguna declaración de primera mano de divulgadores
  conocidos sobre bucles abiertos o aperturas en frío. Lo que circula es
  comentario de terceros.
