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
referencias vivas son `SWCaminoStoriesEN.tsx` en inglés para YouTube,
`SWSocialCaminoES.tsx` en horizontal para redes, y `SWReelGrupoES.tsx`,
`SWReelAsistenciaES.tsx` y `SWReelCaminoES.tsx`, los tres reels de testimonio
en español. Para volver a decidir tipografía hay una
muestra de las tres oficiales en `SWMuestraFuentes`.

**En español funciona igual**, sólo cambia el registro: frases cortas y
llanas, sin adornos, y el pie sólo cuando añade algo que el titular no dice.
Las aprobadas, todas usadas ya en pieza:

| Titular | Pie | Dónde ha ido |
| --- | --- | --- |
| Algunos viajes / **dejan huella** | Camino de Santiago | Apertura |
| Camino de Santiago / **organizado en hoteles** | — | Apertura |
| **Tú caminas.** / Nosotros nos ocupamos del resto | — | Sobre la organización |
| Conoce la España / **más auténtica** | — | Sobre patrimonio y gastronomía |
| Hoteles / **seleccionados** | Habitación y baño privados | Sobre el alojamiento |
| Tu mochila / **viaja sola** | — | Sobre el equipaje |
| Teléfono de asistencia / **24/7** | — | Sobre la asistencia |
| Tu Camino / **empieza aquí** | — | El cierre, siempre |

En negrita, lo que lleva el recuadro verde.

## Cómo se monta un testimonio

Esto es lo que ha salido de montar tres seguidos y es lo que se hace de aquí
en adelante, salvo que la pieza pida otra cosa. Cada paso está desarrollado en
las reglas de abajo; esto es el orden.

**1 · Mirar el clip antes de tocarlo.**

- **Marca de agua**: el mínimo temporal de cada píxel en los cuatro bordes. Lo
  que está pegado siempre se queda claro en todos los fotogramas. Si la hay,
  `marca-agua.py --modo recorte`, que la saca de cuadro y devuelve el formato
  con un zoom corto.
- **Los cortes del propio clip**, con `planos-visibles.py`. Todo lo que se
  ponga encima se cuadra con ellos, nunca con un número redondo.
- **El final**. Estos clips acaban donde acabó la cámara, y ahí suele haber
  viento o un golpe: en el testimonio del grupo, los dos últimos segundos iban
  a −6,7 dB con el 82 % por debajo de 250 Hz, más fuerte que las voces. Se
  mide el rms y el reparto grave/medios décima a décima y se corta antes, con
  la pista bajada a cero.

**2 · Transcribir.** Las cartelas van sobre la frase que las sostiene, y eso
sólo se sabe con la transcripción y los tiempos delante. Si una cartela no
tiene frase debajo que la sostenga, sobra: es la primera que se cae cuando hay
que hacer sitio.

**3 · Las cartelas.** `Cartela`, abajo a la izquierda, con estos valores:

| | Valor | Cuándo se cambia |
| --- | --- | --- |
| `tam` | 70 | 52 si el entrevistado está en primer plano |
| `tamPie` | 34 | 26 con `tam` 52 |
| `margen` | 72 | — |
| `margenAbajo` | 480 | Se baja hasta donde acabe la barbilla, medida en vertical |

**El cuerpo se mide, no se elige.** Las líneas no se parten solas: se salen
del lienzo. A 76 «organizado en hoteles» con su recuadro mide 919 px sobre un
útil de 936, y eso no es holgura. Se calcula el ancho con la fuente
empaquetada antes de dar la cartela por buena.

**Tres o cuatro como mucho, y el cierre.** Una cartela tarda 1,37 s en acabar
de entrar y 0,4 en salir, así que cinco textos en 42 s dejan la pieza sin un
respiro. En el testimonio del grupo se quitó la del 24/7 por eso, y porque era
la única que no se apoyaba en nada de lo que decían.

**4 · Los planos de recurso.** De la biblioteca, encuadrados con
`encuadrar.py` y mirados en un fotograma. Van de límite de plano a límite de
plano de la base, y si el clip ya trae un plano suyo que sirve, ése se queda y
los añadidos lo rodean: en el testimonio de la pareja la habitación del propio
clip caía justo sobre «nos trataron con mucho cariño».

**5 · El cierre de marca, siempre.** Titular sobre el último plano y después
la placa con el logo y la web. Ninguno de estos clips viene con logo ni con
CTA, y sin eso la pieza no es de la marca.

**6 · Antes de renderizar**, `comprobar-inserciones.py` y
`planos-visibles.py`. **Después de renderizar**, `entregar.py`.

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
   **Y una inserción se compara también contra el montaje que tapa.** La
   biblioteca de recurso sale de estas mismas piezas, así que meter un plano
   de `testimonios/` encima de un montaje de testimonios es la forma más fácil
   de poner dos veces la misma toma. En la pieza social en español, las
   maletas del portal que tapaban la juntura eran la toma que el montaje
   volvía a poner tres segundos después, 0,931 de parecido. Se mide plano a
   plano de la base, con los cortes que da `planos-visibles.py`, no contra el
   archivo entero: promediar un montaje de 42 segundos no se parece a nada.
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

20. **Tapar un montaje a trozos deja parpadeos, y no se ven a ojo.** El
   montaje de origen trae sus propios cortes. Al cubrirlo con inserciones,
   entre una y otra se queda al aire el final de un plano o el principio del
   siguiente, y a dos o tres décimas eso no se lee como un plano: se lee como
   un parpadeo. En la pieza social en español había tres, de 0,20, 0,10 y
   0,43 s, y los dos primeros estaban a los lados del corte que quitaba al
   segundo peregrino.
   Se arreglan cuadrando la inserción con **el límite de plano de la base**,
   no con un número redondo, y si el hueco no cuadra con lo que dura el
   archivo, se estira con `ritmo`. Cuando la juntura de un corte de audio
   queda en medio, se tapa entera con un plano, que es la regla 8.
   `python3 herramientas/scripts/planos-visibles.py <escena.tsx> <base.mp4>`
   cruza los cortes de la base con las inserciones y los lista. Se pasa junto
   con `comprobar-inserciones.py` antes de cada render: uno mide que el plano
   llegue, el otro mide lo que se ve entre plano y plano.

21. **Poner una pieza de pie es reencuadrar plano a plano, no cambiar el
   lienzo.** Un 16:9 recortado a 9:16 con `cover` deja ver **el 33,75 % del
   ancho**: se va dos tercios de la imagen, y en estos brutos lo que vive en
   los lados es justo la gente. `herramientas/scripts/encuadrar.py` mide
   dónde mirar en cada plano y devuelve el número que se le pasa a `mirar()`.
   Busca por este orden la cara, lo que se mueve y dónde está el detalle, y
   los tres hacen falta: sólo con bordes, en el plano del peregrino entre la
   vegetación, los arbustos puntúan más que una persona a cien metros y se la
   llevan de cuadro; sólo con movimiento, en el plano de la catedral lo que
   se mueve es la gente que cruza y las torres se quedan fuera.
   La propuesta **se mira siempre en un fotograma** antes de darla por buena:
   la herramienta no sabe que debajo va la cartela del equipaje y que por eso
   las maletas tienen que entrar aunque la cara esté en otro sitio.
   Y `objectPosition` no es «el punto de la imagen»: como sólo se ve el
   33,75 %, un `71 %` centra el recorte en el 64 % de la imagen. Por eso se
   escribe `mirar(0.71)` y no el porcentaje a pelo.

22. **Si el montaje de origen se ve por debajo, va troceado por sus cortes, y
   el audio aparte.** Cada plano del montaje necesita su encuadre, así que la
   base deja de ser un solo `OffthreadVideo` y pasa a ser uno por corte. La
   pista **no** se trocea con ellos: va entera en un `Audio`, porque si no
   cada juntura de imagen sería un corte de audio, y son veinte.

23. **En vertical, el texto baja hasta donde acaba la barbilla, no hasta la
   franja segura.** Al recortar a 9:16 un plano medio de 1280x720 la cara se
   amplía 2,67 veces y ocupa media pantalla. En la pieza social en español el
   entrevistado iba del píxel 628 al 1400 de los 1920: con el margen inferior
   de 480 que usan los otros reels, el recuadro verde caía sobre el bigote.
   Se mide la cara sobre un fotograma ya renderizado, en vertical, y el
   margen se ajusta a lo que quede por debajo; ahí fueron 360. Y el titular
   se encoge hasta que la línea larga entre en una sola línea: partirla en
   tres sube el bloque 70 px y vuelve a la barbilla.

24. **Un render de Remotion sale con el audio 43 ms por detrás.** Son 2048
   muestras a 48 kHz, el retardo de arranque del codificador AAC, dos tramas
   de 1024. Remotion no lo compensa y el contenedor tampoco: decodificando
   con la lista de edición del mp4 o sin ella, el desfase es el mismo. Se
   midió comparando dos renders distintos contra sus montajes de origen: la
   imagen casa en el fotograma cero y el audio en +2048, exactamente igual en
   los dos. A 43 ms un espectador entrenado ya nota que el audio va detrás, y
   en un testimonio, que es todo caras hablando, se nota antes. Se quita
   tirando las 2048 primeras muestras, que son el propio arranque del
   codificador, y eso es lo que hace
   `python3 herramientas/scripts/entregar.py <render.mp4>`, que además deja la
   copia comprimida para revisar. **Se pasa a todo lo que se entregue.**

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

Lo que sale del render **no se entrega tal cual**: lleva el audio 43 ms por
detrás, que es el retardo del codificador AAC. Se pasa por

```bash
python3 herramientas/scripts/entregar.py salida.mp4
```

que lo cuadra y deja al lado la copia comprimida para revisar.

## Preparar metraje

```bash
python3 herramientas/scripts/planos.py bruto.mp4      # dónde empieza cada toma
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg   # verlo de un vistazo
python3 herramientas/scripts/marca-agua.py viejo.mp4 limpio.mp4 \
    --zona 410,290,230,70 --desde 1.335 --hasta 59.27   # quitar un logo pegado
python3 herramientas/scripts/encuadrar.py bruto.mp4 0,1.5 1.5,2.6   # a vertical
```

`encuadrar.py` sin tramos mide el archivo entero, que es lo que hace falta para
un plano de la biblioteca; con tramos mide un montaje plano a plano. Lleva
`yunet.onnx` al lado, que es el detector de caras y pesa 232 KB: va en el
repositorio porque las descargas de modelos no siempre pasan.

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
