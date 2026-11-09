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

## Dos carencias técnicas verificadas

De los 13 vídeos que devuelve la API con sus metadatos:

- `video_has_captions` es `false` en **todos**.
- `video_tags` es `null` en **todos**.

No hay subtítulos ni etiquetas en ninguna pieza. Para un canal cuya audiencia es
bilingüe, subtitular es lo más barato que se puede hacer.

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
