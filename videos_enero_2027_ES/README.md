# Vídeos verticales ES · Enero 2027

Cinco verticales 1080x1920 para Reels, TikTok y YouTube Shorts, montados en
Remotion dentro de este repositorio (`video/src/enero/`).

| Archivo | Publicación | Duración |
| --- | --- | --- |
| `01_2027-01-01_puerta-santa_ES.mp4` | Viernes 1 de enero | 23,1 s |
| `02_2027-01-08_curiosidades-ano-santo_ES.mp4` | Viernes 8 de enero | 32,6 s |
| `03_2027-01-13_4-caminos-5-dias_ES.mp4` | Miércoles 13 de enero | 31,1 s |
| `04_2027-01-20_etapas-ourense_ES.mp4` | Miércoles 20 de enero | 26,8 s |
| `05_2027-01-22_semana-santa-ano-santo_ES.mp4` | Viernes 22 de enero | 25,8 s |

En la carpeta están también `miniaturas/` (PNG 1080x1920), `subtitulos/`
(SRT), `voz/` (la voz sola, en MP3), `copys.md` e `inventario.csv`.

## Especificaciones

- 1080x1920, 30 fps, H.264 con crf 18 y yuv420p. Audio AAC a 48 kHz,
  estéreo, normalizado a −14 LUFS en dos pasadas con un pico máximo de
  −1,5 dBTP.
- Sin logo, sin marca de agua y sin la concha.
- Tipografía Montserrat (ExtraBold en titulares), en minúscula de frase.
- Colores del Brandbook 2027: verde Ways, verde sendero, grafito, blanco,
  niebla y brote.
- Subtítulos de 2 a 5 palabras sincronizados por palabra con la voz. La
  palabra clave va en caja verde plana girada −1,5°.
- Texto fuera de las zonas de interfaz: 250 px libres arriba, 420 abajo y
  120 a la derecha.

## Voz y audio

- **Voz:** sintética, con `edge-tts` y la voz `es-ES-AlvaroNeural`, la misma
  en los cinco vídeos. El script está en `herramientas/scripts/voz.py` y los
  guiones en `video/src/enero/guiones.json`. Velocidad: −8 % en el vídeo 1,
  más solemne, y entre +4 % y +8 % en el resto. No había `ELEVENLABS_API_KEY`
  en el entorno.
- **Campanas (vídeo 1):** sintetizadas para esta pieza con
  `herramientas/scripts/campanas.py` (parciales de campana más reverberación).
  No usan ninguna grabación de terceros, así que no hay licencia que anotar.
  Antes intenté bajar grabaciones CC0 o de dominio público de Wikimedia
  Commons, pero el servidor devolvía un error 429 (límite de peticiones).
- **Ambiente:** el sonido original de los clips, muy bajo.
- **Música:** ninguna. No hace falta base musical.

**Al publicar:** activad la etiqueta de contenido con IA si TikTok o
Instagram la piden. La voz es sintética.

## Kilómetros comprobados en santiagoways.com (24 de noviembre de 2026)

| Ruta | Prompt | Web | Paquete en la web |
| --- | --- | --- | --- |
| Francés desde Sarria | unos 115 km | **111 km** | 7 días / 6 noches: 5 etapas |
| Inglés desde Ferrol | unos 119 km | **126 km** | 7 días / 6 noches: 5 etapas |
| Santiago a Finisterre | unos 90 km | **90 km** | 6 días / 5 noches: 4 etapas |
| Primitivo desde Lugo | unos 100 km | **111 km** | 7 días / 6 noches: 5 etapas |
| Desde Ourense | 119,5 km | **119,5 km** | 8 días / 7 noches: 6 etapas |

En pantalla van las cifras de la web.

**Finisterre:** son 4 etapas, así que su tarjeta dice «4 días · 90 km» y no
«5 días». El título «4 Caminos para hacer en 5 días» sigue siendo cierto,
porque cabe de sobra.

## Planos usados

Todos salen del banco de Drive («2. Videos» y «1. Fotos»). Ningún plano se
repite entre los cinco vídeos. En `inventario.csv`, la columna `usado_en`
dice en qué vídeo va cada uno.

| Vídeo | Planos |
| --- | --- |
| 01 | Vertical/v24 (Puerta Santa en la Quintana, a 0,8x), santiago/159 (cúpula), Vertical/v190 (Obradoiro), foto PATRIMONIO/SANTIAGOWAYS(179) (pináculos), Vertical/v23, santiago/153 (abrazo en el Obradoiro), foto PATRIMONIO/_DSC0446 (Puerta Santa) |
| 02 | Ninguno: solo motion graphics |
| 03 | Mapa de satélite (Esri World Imagery) con las rutas de `herramientas/mapas-vfx`; sarria/216 y Vertical/v144 (ruta 1); Vertical/v58 y v182 (ruta 4) |
| 04 | Vertical/v115, v109, v57, v51, v101, v106, v189, v122; sarria/73; santiago/160 (la Compostela) |
| 05 | foto HOTELES/«WhatsApp Image 2023-04-27 at 16.02.44» (casa con glicinia), portomarin/38 y 39, sarria/231, 215, 28 y 10, Vertical/v196, v22 y v55 |

**Atribución del satélite:** el vídeo 3 y su miniatura llevan «Imagen: Esri,
Maxar, Earthstar Geographics», igual que los configuradores de mapas.

## Decisiones

- **Remotion en lugar de escenas sueltas con ffmpeg.** El prompt pedía un
  archivo por escena unido con el concat demuxer. Remotion renderiza cada
  vídeo de una pasada, fotograma a fotograma, con los mismos ajustes, y deja
  el montaje editable en Studio. ffmpeg solo interviene al final para
  normalizar el audio, sin recodificar el vídeo (`-c:v copy`). Script:
  `herramientas/scripts/render-enero.sh`.
- **Estilo de tus mapas y del kit de motion graphics, con las reglas de
  2027:**
  - El mapa del vídeo 3 replica el de `mapas-vfx`: satélite oscurecido, línea
    con halo que se dibuja, puntos en las localidades y estrella en Santiago.
  - Las tarjetas de ruta y de etapa vienen del kit: placa verde con el nombre
    y placa blanca con el dato, con entrada en barrido lateral.
  - Lo adapté al Brandbook 2027 del prompt: minúscula de frase en lugar de
    mayúsculas, verde Ways en lugar de lima y grafito en lugar de bosque.
- **Lo que no hay en el banco:**
  - No hay mar, Ferrol, Lugo, Ourense, termas, Oseira ni flores de primavera
    reales.
  - En el vídeo 3, Ferrol y Finisterre se quedan en el mapa, que se acerca a
    las rías y al cabo, donde el satélite enseña el mar.
  - En el vídeo 4 el paisaje es gallego genérico (agua, pan, aldea, hórreo,
    bosque, puente) y ningún rótulo dice que el plano sea ese lugar. El gancho
    del baño termal va sobre un arroyo en el bosque.
  - En el vídeo 5, lo más primaveral que hay es la casa con la glicinia en
    flor y los prados verdes.
- **Sin planos de la Puerta Santa abierta.** El vídeo 1 enseña la fachada de
  la Quintana y la voz cuenta que ya está abierta.
- **Botón del vídeo 5.** Es blanco con letra en verde sendero (#506718), no
  en verde Ways, porque el Brandbook no permite verde Ways sobre blanco.
- **Subtítulos en el vídeo 4.** En las etapas 3 a 6 la tarjeta ya dice lo
  mismo que la voz («Casarellos a Lalín»…), así que ahí no se repite el
  subtítulo. El SRT sí lo incluye todo.
- **Rótulo de un establecimiento.** La foto de la glicinia (vídeo 5 y su
  miniatura) es de la carpeta de hoteles y deja leer «Casa Brandariz»; si no
  es un alojamiento de la casa, conviene cambiarla.
- **Datos personales.** No he usado los clips en los que se leen nombre y
  teléfono de clientes en la etiqueta de equipaje (Vertical/v60 y v130;
  sarria/02, 185 y 186).

## Para revisar antes de publicar

1. **Vídeo 3, frase de Sarria.** La voz dice «el que te da la Compostela»,
   como pedía el guion, pero puede entenderse que los demás no la dan. El
   Inglés desde Ferrol y el Primitivo desde Lugo también la dan; Finisterre
   no (allí te dan la Fisterrana). Propuesta: «El clásico, y el más vivido».
2. **Vídeo 5, «Mayo, junio y septiembre son los primeros meses en
   llenarse».** Va exactamente así, como pediste. Pero es una afirmación sin
   fuente en pantalla en una pieza comercial, y CLAUDE.md pide evitar cifras
   y afirmaciones sin fuente. Si tenéis el dato de ocupación, basta con
   confirmarlo.
