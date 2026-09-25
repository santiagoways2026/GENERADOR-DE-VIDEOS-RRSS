# Santiago Ways · Vídeo

Producción de vídeo de marca escrita como código, con Remotion. Sustituye al
montaje manual en Canva para las piezas que se repiten: reels, cartelas,
mapas de ruta y gráficos de dato.

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `video/` | El proyecto Remotion. Aquí se monta y se exporta |
| `docs/` | La guía de marca oficial, edición 2026 |
| `herramientas/mapas-vfx/` | Los dos configuradores de mapas animados |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para preparar metraje |

## La marca, en lo que afecta al vídeo

Los tokens están en `video/src/brand/theme.ts`. Ese archivo es la traducción
de la guía; si la guía cambia, se cambia ahí y nada más.

Reglas que condicionan cada pieza:

- El protagonista es el verde olivo `#7AA606`. Blanco más verde en la mayoría.
- Lima `#B0F808` y bosque `#184834` son complementarios, de uso puntual.
- Nada de negro puro: la tinta es el bosque.
- Texto blanco sobre olivo. Texto bosque sobre lima. Siempre.
- La marca nunca se escribe como texto. Se usa el archivo de logo.
- Un solo CTA por pieza.
- Movimiento: fade más desplazamiento corto con `cubic-bezier(0.22,0.61,0.36,1)`.
  Nunca rebote.
- Tipografía: Montserrat, Manrope, Poppins. Empaquetada con el proyecto.
- Formatos: 1080x1920 reels, 1080x1080 feed, 1280x720 YouTube. Márgenes 56 px
  como mínimo.

## Cómo se ven los textos

Las cartelas replican las del kit de motion graphics, no se inventan:

- Placa blanca arriba con el dato en bosque, peso 800, esquinas `6px 6px 0 0`.
- Placa olivo debajo con el complemento en blanco, esquinas `0 6px 6px 6px`.
  **En mayúsculas y peso negro**, nunca en minúsculas.
- Entran con barrido lateral (`clip-path`), 27 fotogramas, con 14 de relevo
  entre placas. No con un fundido.
- Pocas por pieza. Si el bloque lleva un gráfico, el gráfico ya trae su
  titular y la cartela sobra.

El texto vive en la mitad superior. Los gráficos, en la inferior.

Esto vale para los **reels verticales**. Las piezas horizontales de marca van
en otro registro, el de abajo.

### Piezas horizontales de marca

Las de YouTube son más editoriales. No llevan las placas del kit: el texto va
suelto sobre el plano y el verde recuadra sólo lo que importa.

- **Montserrat en peso 900**, el negro. Es el grosor máximo de la familia:
  Manrope no pasa de 800 y Poppins es más estrecha. Si piden "más gruesa", el
  margen está en el cuerpo, no en el peso, que ya está al tope.
- **En minúscula con la inicial en mayúscula**, nunca en caja alta. En
  mayúsculas la misma fuente se lee más estrecha y más plana, porque se
  pierden ascendentes y descendentes. Es lo que más veces hubo que corregir.
- **Cuerpo grande**: 72 px sobre lienzo de 1280x720, 66 en las líneas largas.
  Las frases se parten en varias líneas antes que encogerse para caber en una;
  ahí está la contundencia. Interletraje `-0.025em`, interlínea `1.02`.
- **Todas las letras en blanco**, también las que llevan recuadro.
- **El recuadro verde `#7AA606` va sobre la frase que lleva la promesa**, no
  sobre el complemento. En "You walk. We take care of the details" se recuadra
  "You walk."; en "24/7 support all along the way", "24/7 support". Esquinas
  de 6 px.
- **Los pies van en blanco**, no en lima. 21 px, peso 700.
- Abajo a la izquierda, margen de 64 px. Lo de la mitad superior es regla de
  vertical: en horizontal esa franja es donde caen las caras de los
  entrevistados.
- Entran con el barrido lateral del kit, 27 fotogramas y 14 de relevo, y salen
  con el mismo barrido en 12.
- Un velo inferior muy suave detrás del texto. Sin él el blanco se pierde en
  los planos de cielo claro.

**El cierre** es una placa de marca, no un rótulo más:

1. Primero el titular sobre el último plano, con un overlay diagonal.
2. Después, el logo **centrado en el centro exacto del cuadro**, entrando con
   un desvanecimiento sobre un degradado a 145 grados dentro de la escala de
   verdes de la guía: `#7AA606`, `#668814` y `#4F6B0F`.
3. Debajo, la web en blanco. La pieza termina ahí, sin fundido a negro.

Se usa `santiago-ways-blanco.png`, que tiene 2500 px de ancho. El verde sólo
tiene 507 y no aguanta un logo grande. Durante el resto de la pieza no hay
logo: la marca cierra, no acompaña.

**El cierre se dice sobre el sitio, no sobre la cara.** Si la pieza termina
con el entrevistado en primer plano, se sustituye sólo la imagen por un plano
de la catedral o del Obradoiro, que es lo que remata. La voz sigue corriendo
por debajo. Y si el final encadena varios planos del mismo monumento, que
vayan de lo general al detalle y con gente en medio: tres encuadres seguidos
de torres contra nubes se ven como un salto, no como una secuencia. Y aun así el titular del cierre va abajo, al sitio de las
cartelas: a media altura el recuadro verde cae justo sobre la cara si el plano
cambia, y un rótulo no tapa una cara.

**Dos líneas por cartela como máximo, y el cuerpo según lo cerca que esté la
gente.** 72 px valen cuando el entrevistado está a media altura; con él en
primer plano hay que bajar a 58 y partir la frase en dos, no en tres. Una
tercera línea le llega a la barbilla. Antes de dar una cartela por buena, se
mira el fotograma.

Todo esto vive en `video/src/componentes/CartelaMarca.tsx`, que es de donde
tiran las piezas de la línea: `Cartela`, `CierreMarca` y `PlacaMarca`. Las
referencias vivas son `SWCaminoStoriesEN.tsx`, en inglés para YouTube, y
`SWSocialCaminoES.tsx`, en español para redes. Para volver a decidir
tipografía hay una muestra de las tres oficiales en `SWMuestraFuentes`.

**En español funciona igual**, sólo cambia el registro: frases cortas y
llanas, sin adornos, y el pie sólo cuando añade algo que el titular no dice.
Las aprobadas: "Algunos viajes dejan huella", "Tú caminas. Nosotros nos
ocupamos del resto", "Hoteles seleccionados" con "Habitación y baño privados"
de pie, "Tu mochila viaja sola" a secas, y "Tu Camino empieza aquí" en el
cierre.

## Reglas de montaje aprendidas

Estas salieron de revisar piezas reales y ahorran repetir errores:

1. **Comprobar los planos antes de cortar.** Los brutos son compilaciones y
   ninguna toma pasa de 2,75 segundos. Un corte de cuatro segundos se come el
   plano siguiente y aparece un salto a mitad de escena.
   `python3 herramientas/scripts/planos.py bruto.mp4` da los límites exactos.
2. **Repartir la duración, no fijarla.** El componente `Planos` reparte el
   bloque en proporción a lo que dura de verdad cada toma, así ninguna se
   estira más allá de su final.
3. **Encuadrar cada plano.** Un bruto horizontal recortado a vertical pierde
   los laterales, y ahí es donde suele estar la gente. Revisar plano a plano y
   poner `encuadre` donde haga falta.
4. **Ninguna toma repetida entre bloques contiguos.** Al volver parece un
   error de montaje.
5. **Los cortes se apoyan en la locución.** Se miden los silencios del audio y
   cada bloque arranca cuando empieza la frase que ilustra.
6. **Un gráfico no puede tapar una cara.** Si el plano tiene gente en el
   centro, va donde el gráfico ya se ha retirado.
7. **Darle ritmo a un testimonio es quitar, no acelerar.** Se transcribe con
   los silencios finos (`max_speech_duration=4`, `min_silence_duration=0.16`)
   y se leen las frases una a una: en una entrevista siempre hay un tramo que
   dice dos veces lo mismo o que se queda a medias. Ése se va entero, cortando
   por el silencio entre frases. En la pieza social en español eran 9,6
   segundos de 57,3.
8. **La juntura del corte se tapa con imagen.** Un corte de audio limpio
   sigue viéndose si cae a mitad de plano. Encima va un plano de recurso, y
   sale gratis: los planos que ese mismo corte deja fuera sirven, y así no se
   repite ninguna toma.
9. **Antes de cortar, contar cuántos hablan, y hacerlo bien.** El tono no
   distingue a dos hombres de edad parecida, y la envolvente espectral
   promediada tampoco es concluyente. Lo que sí funciona es comparar cada
   tramo de voz contra los tramos en los que se ve a alguien hablando en
   cámara, midiendo el centroide espectral entre 300 y 3400 Hz, que es donde
   caen los formantes. En la pieza social en español un tramo estaba en
   582 Hz y los del peregrino que sí sale, entre 631 y 770: era otro señor.
   Si una prueba sale dudosa, es dudosa, no negativa.
10. **Una voz sin cara no se deja.** Si al que habla no se le ve nunca,
   porque su plano cayó en un recorte anterior, ese tramo se va entero. Suena
   a error, no a segundo testimonio.
11. **Los tramos sin voz llevan cama de ambiente, no silencio.** Y si la
   pieza no tiene música, tampoco se le mete una sólo ahí: suena a parche.
   `herramientas/scripts/ambiente.py` la hace con los propios silencios del
   montaje, y tiene tres reglas metidas dentro, las tres aprendidas a base de
   que se oyera el truco:
   - **No se hace con un bucle.** Los huecos entre frases duran medio segundo,
     así que el ciclo vuelve cada segundo y medio y se nota. Se saca la huella
     espectral, que es el color de la sala, y se sintetiza con fase aleatoria.
   - **La ventana de síntesis va en raíz, y no se divide por el peso.** Con
     Hann y medio solape la suma reconstruye bien una señal, pero aquí cada
     ventana lleva fase aleatoria y no está correlacionada con la anterior: lo
     que se suma no son amplitudes sino potencias, y w1² + w2² no es constante.
     Vale 1 en el centro de la ventana y 0,5 en el cruce, así que la cama sale
     con un temblor de 3 dB al ritmo del salto. En el reel alemán era una línea
     a 21,5 Hz, los 44100 entre los 2048 del salto, que destacaba 6,4 veces
     sobre el resto de la envolvente. A esa frecuencia no se oye como trémolo,
     se oye como que el audio se rompe, y así llegó el aviso. Con la ventana en
     raíz, w² es Hann y Hann más Hann desplazada media ventana suma 1: la
     potencia queda plana y la línea baja a 2,3 veces, que es el suelo.
   - **Los huecos se eligen midiendo**, con el factor de cresta, pico entre
     rms: por debajo de 5 es ambiente, por encima hay una respiración o un
     golpe de aire dentro. `--listar` los mide. Y se eligen **por su sitio, no
     por un percentil de nivel**: coger las ventanas más flojas de la pieza
     mete colas de voz dentro, y una cola de voz es más brillante que una
     sala. En el reel alemán eso dejaba la cama 3,5 dB por encima del ambiente
     de verdad entre 3 y 8 kHz, y una cama más brillante se oye como ruido.
   - **La cama se nivela contra el ambiente con el que empalma**, no contra la
     media de la pieza. La media salía de 3 a 8 dB por encima, y una cama que
     entra más alta que lo que viene detrás se oye como un escalón.
   Las junturas se montan con fundido cruzado de verdad, con material de los
   dos lados: pegando a hueso hay chasquido, y fundiendo cada trozo a silencio
   se oye el bache. **Y el lado que se apaga no se toma de detrás del corte**,
   por muy natural que parezca como continuación de la música: un fundido
   cruzado arranca con ese lado a volumen entero, así que devuelve justo la
   palabra que se acababa de quitar, sólo que apagándose. Se saca del hueco
   sin voz más cercano, que es la misma sala y la misma música sin nadie
   hablando.
   **Y una cama sintetizada arrastra eco, siempre.** Sintetizar con fase
   aleatoria dispersa la fase, que es literalmente lo que hace un
   reverberador: por bien nivelada que esté y por plana que tenga la
   potencia, se le oye una cola de sala grande que no pega con una grabación
   de campo. Así que la síntesis es el último recurso, no el primero. Antes
   van, por este orden: **no dejar el hueco** (cortarlo y que la pieza dure
   menos), **pegar ambiente de verdad** de los huecos del propio master, y
   sólo entonces sintetizar. Lo de pegar ambiente de verdad hay que medirlo
   antes: en la pieza social en español había 2,71 s aprovechables en 57 de
   metraje, y hacían falta 10,3, así que no daba.
   **Y antes de sintetizar nada, comprobar que hay una sala que imitar.** Si
   la pista es un doblaje o una locución puesta encima, lo que queda entre
   frase y frase no es ambiente de la grabación, es lo que dejó el doblador:
   en el testimonio alemán los huecos iban de -40,7 dB a -25,9 según el trozo,
   con colores distintos. Contra eso, una cama sintetizada suena a añadido se
   haga como se haga, y se intentó dos veces. Lo que funciona ahí es un
   segundo de ambiente de verdad, del hueco que más se parezca, bajado a cero,
   y dejar la placa de marca en silencio: al final de una pieza, sobre una
   placa quieta, el silencio se lee como que ha terminado y no como un mute.
12. **Un plano más corto que su hueco no avisa.** `OffthreadVideo` no falla
   cuando se le pide más metraje del que tiene: congela el último fotograma.
   En la pieza social fueron 0,72 s de imagen parada que parecían un corte mal
   hecho. Los brutos duran entre 1 y 2,2 segundos, así que pasa enseguida.
   `python3 herramientas/scripts/comprobar-inserciones.py <escena.tsx>` mide
   cada inserción contra el archivo y avisa. Se pasa antes de cada render.
13. **Un plano nuevo se compara contra toda la biblioteca, no contra su
   tanda.** La firma es la mediana de nueve fotogramas del plano, no un
   fotograma suelto: la mediana borra a la gente que cruza y deja el fondo,
   que es lo que identifica una toma. Por encima de 0,92 de parecido es la
   misma toma; entre 0,85 y 0,92 hay que mirarla. Y si la misma toma aparece
   dos veces, se queda la que no esté recortada.
14. **El primer plano se elige aparte.** El que abre una pieza no es el que
   venía primero en el bruto: se mira si aguanta solo. Un contraluz velado
   con un muro al fondo no abre nada. Para eso están los brutos de 1080p, que
   además entran más nítidos que una base recortada con zoom.
15. **A una toma corta se le da más metraje bajándole la velocidad, no
   repitiéndola.** Los brutos duran entre uno y dos segundos, y a veces el
   plano que gusta ya se está usando entero. `playbackRate` por debajo de 1
   alarga el hueco sin tocar el archivo: a 0,85 un plano de 1,17 s cubre 1,35.
   Sólo vale en planos quietos, fachadas y poco más; con gente moviéndose se
   ve el cámara lenta. En las escenas va en el campo `ritmo` de la inserción,
   y `comprobar-inserciones.py` lo descuenta al medir si el archivo llega.

16. **Un tramo del master empieza donde corta el master, no donde interesa.**
   Los montajes de origen son piezas ya editadas y meten planos de recurso
   entre declaración y declaración. Si el tramo que se coge para ver hablar a
   alguien empieza un poco antes de tiempo, entra el final del recurso
   anterior: en el reel de hoteles fueron tres fotogramas de bosque abriendo
   la pieza, un pasillo y un baño. Tres fotogramas en vertical no se leen como
   un plano, se leen como un error. Se miden los cortes del master antes de
   fijar el tramo, con la diferencia media entre fotogramas consecutivos en
   una miniatura en gris: un corte pasa de 50 y el movimiento normal no llega
   a 12. Y si hay que mover el arranque, **se mueve también el de la pista**:
   moviendo sólo la imagen la boca se descuadra, y una décima ya se nota.

17. **Una juntura en una pista con voz y música mezcladas se mide tres veces.**
   Los tres fallos salieron en la misma pieza y se sumaban:
   - **El escalón de nivel.** El master baja la música cuando alguien habla y
     la sube cuando no. Si un lado del corte tiene voz cerca y el otro un
     hueco largo, la música salta: en el reel de hoteles eran 7,2 dB de rms y
     9,6 de graves. Se arregla haciendo entrar el tramo nuevo por debajo y
     subiéndolo hasta su nivel en el hueco que queda antes de la frase
     siguiente. Es el mismo gesto que hace el master solo y no se oye.
   - **El contratiempo.** La música tiene pulso y el corte cae donde cae. Se
     mide la envolvente de ataques de los dos lados y se busca el
     desplazamiento que mejor casa. No se cuenta multiplicando pulsos por la
     distancia: a un minuto, un milisegundo de error en el pulso son más de
     cien de desfase.
   - **El bache del propio fundido.** Con ganancias lineales, dos trozos de
     música distintos se restan en mitad del cruce y dejan 3 dB de agujero.
     Como no están correlacionados, lo que se conserva es la potencia: las
     ganancias van en raíz.
   Y al elegir de dónde sale un trozo de música, se compara el cuerpo, no sólo
   el nivel: la entrada de un tema suele venir sin bajos y al empalmarla con
   el tema ya arrancado se cae el suelo.

18. **Un rótulo pegado no se quita, se esquiva.** Los clips que vuelven de un
   editor online traen subtítulos quemados y marca de agua. La marca de agua
   suele vivir en un borde y se va recortando, como dice `marca-agua.py`. Los
   subtítulos caen en mitad del cuadro y no hay recorte que valga; borrarlos
   tampoco, porque el texto cambia cada segundo y suele caer sobre manos o
   caras. Lo que sí funciona es **no necesitarlos**: un rótulo ocupa el 70 u
   80 % del metraje, no el 100, y de ese clip sólo hacen falta dos o tres
   planos de la gente. Salen de los huecos.
   Los huecos se miden por la **firma del rótulo**, y la firma mira dos cosas:
   un píxel muy claro (más de 225) con uno muy oscuro (menos de 75) a menos de
   cinco píxeles en horizontal, que es el borde negro de las letras blancas,
   **y el color de la palabra resaltada con ese mismo borde**. Lo segundo no
   es un detalle: estos rótulos resaltan una palabra en color y ese color no
   dispara un detector de blanco, así que se cuela. En el testimonio alemán
   entró un «WIR» en los ocho últimos fotogramas del plano de apertura, 433
   píxeles del verde del rótulo donde el resto tenía 8. Contar píxeles blancos
   a secas tampoco vale: los pantalones cortos eran blancos y caían justo en
   la banda.
   El color del rótulo se mide sobre un fotograma que lo tenga, no se supone.
   Y lo que pinta el fondo, hierba o cielo, no dispara la firma porque no
   lleva negro pegado.
19. **Antes de enseñar una cara, comprobar que la imagen va con el audio.** Un
   testimonio doblado o con locución puesta encima no lleva las bocas en su
   sitio. Se mide comparando el movimiento de la zona de las bocas con el
   nivel de la pista: si van juntos, la correlación sube; si el movimiento es
   el mismo cuando la pista está en silencio, es doblaje. En el testimonio
   alemán daba 0,81 en el silencio contra 0,73 y 0,98 hablando, y la
   correlación se quedaba en 0,03. Con eso, los planos de cara van de uno a
   dos segundos y nunca sobre una frase entera: a esa duración no se lee como
   un doblaje, se lee como un plano de los clientes.

## Reglas técnicas de Remotion

- **Usar `OffthreadVideo`, no el `Video` de `@remotion/media`**: este último
  ignora `objectFit` y el clip sale en banda en lugar de recortado.
- Las animaciones CSS no se renderizan. Todo el movimiento sale de
  `interpolate()` sobre `useCurrentFrame()`.
- `interpolate` va dentro del `style`, para que se pueda editar desde Studio.
- Las escenas usan `Interactive.Div` para que los textos se puedan cambiar en
  Studio y se escriban solos en el código.
- Las fuentes se empaquetan con `@fontsource`, no se descargan de Google: así
  el render sale igual en cualquier máquina y funciona sin conexión.

## Comandos

```bash
cd video
npm install
npm run dev                                   # Studio, preview editable
npx remotion render ReelXacobeo salida.mp4    # Exportar
```

No hace falta pasar ninguna opción de navegador: `remotion.config.ts` detecta
un Chromium ya instalado si lo hay, que es lo que permite renderizar en las
sesiones de Claude Code en la web, donde la descarga del Chrome de Remotion
está bloqueada.

## Preparar metraje

```bash
python3 herramientas/scripts/planos.py bruto.mp4      # dónde empieza cada toma
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg   # verlo de un vistazo
python3 herramientas/scripts/marca-agua.py viejo.mp4 limpio.mp4 \
    --zona 410,290,230,70 --desde 1.335 --hasta 59.27   # quitar un logo pegado
```

`--zona` es la esquina donde vive el logo, con margen de sobra: no hace falta
afinarla, el script encuentra la silueta dentro. `--desde` y `--hasta` marcan
por dónde cortar las cartelas.

Los planos recortados viven en `video/public/brutos/`. Los brutos completos no
entran en el repositorio: pesan y se sustituyen a menudo.

Hay dos juegos de planos y conviene saber cuál se coge:

| Carpeta | Qué es | Resolución |
| --- | --- | --- |
| `brutos/` | Los 29 planos del reel original | 1920x1080 |
| `brutos/testimonios/` | 83 planos recurso de las piezas de testimonios | 1280x720 |
| `brutos/piezas-viejas/` | 42 planos de cuatro piezas viejas de la agencia | 1280x720 |

Los de `testimonios/` dan variedad, sobre todo de alojamiento, gastronomía y
llegada a Santiago, pero son de menos resolución: para un primer plano grande o
un encuadre que recorte mucho, mejor los de 1080p. Se usan poniendo la
subcarpeta delante, `src: "testimonios/prado-flores"`, porque `Planos` compone
la ruta sola. La lista completa, agrupada por tema, está en el README de esa
carpeta.

### Reaprovechar piezas antiguas

Las piezas viejas de la agencia llevan el logo pegado en una esquina durante
todo el metraje y cartelas de marca al principio y al final. `marca-agua.py`
aprende el logo del propio vídeo, dibuja su silueta y la rellena con lo que hay
alrededor, y de paso recorta por donde se le diga.

Hay dos modos y **el bueno es `--modo recorte`**, que es el que va por defecto:
saca la marca de cuadro cortando por el borde que menos imagen se lleva y
devuelve el formato original con un zoom corto. Sale limpio del todo. En la
pieza de 640x360 se comió el 12% por abajo.

`--modo relleno` mantiene el encuadre y reconstruye el hueco. Se usa solo si la
composición no aguanta perder ese borde, porque sobre fondos con mucho
contraste, un bosque a contraluz o la fachada de la catedral, deja una banda
blanda que se ve.

Un aviso más, por no repetir el trabajo: **no se puede deshacer la mezcla.** Se
probó, que sería lo elegante. Como el logo es casi opaco, dividir por
`1 - alfa` multiplica por ocho el ruido de compresión y salen colorines.

## Lo que el entorno permite y lo que no

Comprobado en sesiones de Claude Code en la web, para no volver a averiguarlo:

- **Transcribir audio sí se puede**, y conviene: los cortes se deciden con la
  transcripción delante, no a ojo. Hugging Face y el CDN de OpenAI están
  bloqueados, pero los modelos de `k2-fsa/sherpa-onnx` se bajan de las
  releases de GitHub, que sí pasa. `pip install sherpa-onnx` y el modelo
  `sherpa-onnx-whisper-small.en`, más `silero_vad.onnx` para trocear por voz.
- **Drive**: se pueden crear carpetas, pero no subir vídeos. El conector pasa
  el contenido como texto dentro de la conversación y un MP4 de 80 MB no cabe
  ni de lejos. `drive.google.com` además está denegado por la política de
  salida.
- **El chat admite 30 MiB por archivo.** Para entregar un máster hay que
  trocearlo con `split -b 23m` y que lo peguen con `cat` o `copy /b`. Conviene
  mandar además una copia comprimida de un solo archivo para revisar.
- **Remotion renderiza** sin tocar nada: `remotion.config.ts` encuentra el
  Chromium de `/opt/pw-browsers`. Un montaje de dos minutos a 720p tarda unos
  diez minutos.

## Lo que no se hace

- Contadores de cuenta atrás ni "últimas plazas".
- Cifras sin fuente en pantalla, sobre todo en piezas ancladas mucho tiempo.
- Promesas de precio que no se puedan sostener.
- Gradientes ajenos a la marca, glassmorphism, texturas digitales abstractas.
- Fotografía en blanco y negro, sobresaturada, con grano o de stock genérico.
