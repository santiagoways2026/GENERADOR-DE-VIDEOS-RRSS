# Santiago Ways · Vídeo

Producción de vídeo de marca escrita como código, con Remotion. Sustituye al
montaje manual en Canva para las piezas que se repiten: reels, cartelas,
mapas de ruta y gráficos de dato.

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `video/` | El proyecto Remotion. Aquí se monta y se exporta |
| `docs/` | La guía de marca oficial, edición 2026, y las decisiones tomadas |
| `herramientas/mapas-vfx/` | Los dos configuradores de mapas animados |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para preparar metraje y revisar montajes |

## La marca, en lo que afecta al vídeo

Los tokens están en `video/src/brand/theme.ts`. Ese archivo es la traducción
de la guía; si la guía cambia, se cambia ahí y nada más.

Reglas que condicionan cada pieza:

- El protagonista es el verde olivo `#7AA606`. Blanco más verde en la mayoría.
- Lima `#B0F808` y bosque `#184834` son complementarios, de uso puntual.
- Nada de negro puro: la tinta es el bosque.
- Texto blanco sobre olivo. Texto bosque sobre lima. Siempre.
- La marca nunca se escribe como texto. Se usa el archivo de logo.
- Movimiento: fade más desplazamiento corto con `cubic-bezier(0.22,0.61,0.36,1)`.
  Nunca rebote.
- Tipografía: la cascada de la guía es Montserrat, Manrope, Poppins,
  empaquetada con el proyecto. **En vídeo el reparto está fijado**, y va
  abajo: no se decide pieza a pieza. El titular es el patrón `.impact` de la
  guía: mayúsculas, peso 900 y bloque verde con la letra en blanco.
- Formatos: 1080x1920 reels, 1080x1080 feed, 1280x720 YouTube. Márgenes 56 px
  como mínimo.

## Qué fuente va en cada cosa

La guía da la cascada, pero además trae el patrón de titular ya resuelto, y
es el que manda:

```css
/* The signature "impact" headline pattern - UPPERCASE, white on green block. */
.display, .impact {
  font-weight: var(--fw-black);   /* 900 */
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
```

De ahí salen las tres cosas que no se negocian en un titular de vídeo:
**peso 900**, **mayúsculas** y **bloque verde de marca con la letra en
blanco**. No lima: el lima la guía lo reserva para los *punch blocks*
pequeños, y además obliga a letra bosque, que sobre metraje pesa menos.

Y de ahí sale también que el titular es **Montserrat, no Manrope**: el patrón
pide 900 y **Manrope no llega, se queda en 800**. Un rato estuvo en Manrope
800 y se veía flojo al lado de las placas del kit, que van en Montserrat 900.
No era que la fuente no cargara: ése es el tope de Manrope.

El reparto está en `tipo`, dentro de `video/src/brand/theme.ts`. Se usan esos
tokens, no la familia y el peso escritos a mano.

| Qué | Fuente |
| --- | --- |
| Titulares sobre la imagen | **Montserrat 900**. Es el patrón `.impact` de la guía |
| Cifras de impacto | **Montserrat 900** |
| Placas de `Cartela`, cabeceras de gráficos, bullets | **Montserrat** 800 y 900. Son piezas calcadas del kit de motion graphics |
| Subtítulos quemados | **Montserrat 800**. A cuerpo 50 el 900 se empasta y cierra los contornos |
| Línea de apoyo bajo un titular | **Manrope 700** |
| La web del cierre | **Manrope 700** |

Manrope se queda en el texto de apoyo, que es donde abre mejor y contrasta
con el logo. El texto de impacto es Montserrat.

**Esto está cerrado y aprobado: no se vuelve a proponer otra cosa.** Costó
tres rondas llegar aquí, dos de ellas persiguiendo un problema que no era el
que parecía.

### Comprobar que la fuente está puesta de verdad

Esto no es paranoia: durante todas las piezas anteriores **no se cargó ni una
sola fuente de marca** y no lo dijo nadie. Los `import "@fontsource/..."`
compilaban sin una queja y el CSS no llegaba al documento, así que todo salió
con la sans-serif del sistema. En pantalla colaba, porque la de respaldo
también es una grotesca.

Se comprueba con la composición `Fuente`, que pinta el mismo texto en
Montserrat y en Manrope **sin cascada de respaldo** e imprime cuántas caras
hay registradas. Si el texto sale en serif, no hay fuente: es lo que dibuja el
navegador cuando la familia pedida no existe. `document.fonts.check()` no
sirve para esto, devuelve `true` igual.

```bash
cd video
npx remotion still Fuente ../salidas/fuente.png
```

Mirar esa imagen cuando se añade un peso, se toca `fuentes.ts` o se estrena
una pieza.

## Cómo se ven los textos

Las cartelas replican las del kit de motion graphics, no se inventan:

- Placa blanca arriba con el dato en bosque, peso 800, esquinas `6px 6px 0 0`.
- Placa olivo debajo con el complemento en blanco, esquinas `0 6px 6px 6px`.
  **En mayúsculas y peso negro**, nunca en minúsculas.
- Entran con barrido lateral (`clip-path`), 27 fotogramas, con 14 de relevo
  entre placas. No con un fundido.
- Pocas por pieza. Si el bloque lleva un gráfico, el gráfico ya trae su
  titular y la cartela sobra.
- `Cartela` admite varias líneas y ajusta el cuerpo sola. Hace falta fuera del
  español: un rótulo en inglés puede ser el doble de largo y no cabe de una
  tirada en 1080 px.

Una pieza entera a base de placas y listas parece una plantilla, y hace que
todas las piezas de la marca parezcan la misma. Para eso está `Titular`:
texto grande directamente sobre el metraje, en Montserrat 900 y en
mayúsculas, con las palabras entrando una a una en orden de lectura.

**El resalte de `Titular` es un bloque verde de marca con la letra en
blanco**, que es el patrón `.impact` de la guía. Se le pasan los índices de
las palabras que van dentro y el componente agrupa las seguidas en una sola
caja, para que el bloque salga continuo y no a trozos con un hueco en cada
espacio.

Tres cosas que costaron un render entero y conviene no volver a tocar:

- **El bloque y su texto entran juntos**, con un barrido lateral, como las
  cartelas del kit. Antes las palabras entraban una a una por dentro de un
  bloque ya dibujado y se veían flotando dentro de la caja.
- **El barrido dura 16 fotogramas, no 27.** Un titular aguanta en pantalla
  mucho menos que una cartela: con 27, un rótulo de 41 fotogramas llegaba
  entero solo los últimos diez.
- **El bloque es una caja entera, no texto corrido.** Con el bloque en línea,
  un titular que parte en dos deja dos trozos de caja y el `clip-path` del
  barrido solo recorta el primero: la segunda línea **desaparecía del todo**,
  y el rótulo se quedaba en «THE MOST» sin que saltara ningún error. Por eso
  el bloque no parte por dentro y `Titular` **baja el cuerpo solo** hasta que
  quepa, como hace `Cartela`.

El texto vive en la mitad superior. Los gráficos, en la inferior.

**Cuánto tiene que durar un texto.** Un rótulo de dos o tres palabras se lee
en dos segundos; una frase de setenta caracteres necesita cinco o seis. Si no
caben en su bloque, se le da una `<Sequence>` propia que cruce al siguiente,
no se acelera la lectura.

## Reglas de montaje aprendidas

Estas salieron de revisar piezas reales y ahorran repetir errores:

1. **Comprobar los planos antes de cortar.** Los brutos son compilaciones y
   ninguna toma pasa de 2,75 segundos. Un corte de cuatro segundos se come el
   plano siguiente y aparece un salto a mitad de escena.
   `python3 herramientas/scripts/planos.py bruto.mp4` da los límites exactos.
2. **Ninguna toma por debajo de 1,2 segundos en pantalla.** Es el fallo que
   más veces se ha colado y el que primero se nota: un plano de un segundo en
   medio de un bloque se lee como un error. Mejor pocas tomas largas que
   muchas cortas.
3. **Si las tomas no llegan, se estiran con `ritmo`, no se añaden más.** Por
   debajo de 1 la toma rinde más tiempo del que dura, sin congelarse ni
   invadir el plano siguiente del bruto. Entre 0,7 y 0,9 no se percibe; por
   debajo de 0,6 solo en planos casi quietos, como un detalle o una mesa
   puesta. Un plano con gente moviéndose deprisa no baja de 0,7.
4. **Repartir la duración, no fijarla.** `Planos` reparte el bloque en
   proporción a lo que pesa cada toma. El campo `dura` es un presupuesto, no
   la duración del archivo: puede ser menor, y bajarlo es la forma de que una
   toma larga no se coma el bloque.
5. **Encuadrar cada plano.** Un bruto horizontal recortado a vertical pierde
   los laterales, y ahí es donde suele estar la gente. Revisar plano a plano y
   poner `encuadre` donde haga falta. El recorte central parte personas por la
   mitad más a menudo de lo que parece.
6. **Ninguna toma repetida en toda la pieza.** Empezó siendo «entre bloques
   contiguos» y no bastaba: en el short del Francés, la toma de las mujeres
   con la Compostela salía en el bloque 5 y otra vez en el 7, con un bloque
   de por medio, y se notaba igual. En una pieza de menos de un minuto una
   cara repetida se reconoce aunque pasen quince segundos. Con 34 planos en
   `brutos/` y 25 en la pieza, casi siempre hay de dónde tirar.
7. **Ni el mismo sitio en dos tomas distintas.** Un paisaje que sale por la
   ventana de una habitación y otra vez desde una terraza es la misma
   repetición aunque los archivos sean distintos.
8. **Los cortes se apoyan en la locución.** Se miden los silencios del audio y
   cada bloque arranca cuando empieza la frase que ilustra.
9. **Un gráfico no puede tapar una cara.** Si el plano tiene gente en el
   centro, va donde el gráfico ya se ha retirado.
10. **No fiarse del nombre del archivo.** En `video/public/brutos/` hay
    nombres que no corresponden con lo que se ve: `interior-velas` es un
    sendero y `iglesia-exterior` es un interior con velas. Se elige por el
    plano, mirándolo.
11. **Los primerísimos planos pierden definición en vertical.** El recorte a
    9:16 ya amplía el bruto un 78 %; un plano de detalle encima se ve blando.
    Pasan rápido o no entran.
12. **Lo último antes del cierre es una cara, no un sitio.** Un plano de
    alojamiento o de paisaje informa; el de alguien celebrando la llegada es
    el que se recuerda.

## Lo que se ve de verdad en un móvil

La pieza no se mira en un monitor: se mira en Instagram, en vertical y a
menudo sin sonido.

- **La botonera de Reels se come los últimos 200 px** y parte de los primeros
  150. Nada legible ahí abajo. Los gráficos llevan `paddingBottom` de 280 a
  320 px por eso.
- **Nada por debajo de 38 px.** Un pie de titular o una fuente de dato a 30
  px se lee en el monitor y no se lee en un móvil.
- **El texto sobre la imagen no necesita una banda detrás.** Una placa opaca
  tapa metraje en todos los planos para resolver la legibilidad de unos
  pocos. Se resuelve con contorno y sombra de bosque, que es la tinta de la
  marca: `Subtitulos` lo hace con ocho sombras cortas alrededor de la letra,
  porque `-webkit-text-stroke` engorda hacia dentro y se come el dibujo.
- **El logo blanco desaparece sobre un plano claro.** Si va sobre metraje,
  necesita una franja de bosque debajo, que es tinta de marca y no un
  gradiente ajeno.
- **Sin marca de agua.** El logo va en el cierre, que ya es todo marca.
- **El CTA no va en el vídeo.** El cierre se queda con el logo y la web; la
  llamada a la acción la pone quien publica, por encima de la pieza o en el
  pie, que es donde se puede cambiar sin volver a exportar.

## Audio

- La locución manda. La música es cama: unos 15 dB por debajo, volumen 0,14,
  con una entrada corta.
- **Igualar el nivel de la locución antes de mezclar.** Cada voz de
  ElevenLabs sale a un nivel distinto: entre dos piezas de este repositorio
  hay 8 dB de diferencia. Se mide el nivel de voz y el pico con
  `envolvente.py`, y se amplifica con el `volume` del `Audio` hasta dejar el
  pico alrededor de -1,5 dB. Sin eso la cama queda proporcionalmente alta y
  la pieza suena floja al lado de cualquier otra del feed.
- **El punto de entrada de la música se elige mirando su envolvente**, no por
  el principio del archivo. Casi todos los temas traen su propio fundido
  final: si se hace coincidir con el cierre de marca, no hay que inventarse
  ninguno. Medir con `herramientas/scripts/envolvente.py`.
- Cambiar de locución obliga a volver a medir los silencios y a sustituir el
  array de tiempos. No obliga a rehacer el montaje.

## Reglas técnicas de Remotion

- **Usar `OffthreadVideo`, no el `Video` de `@remotion/media`**: este último
  ignora `objectFit` y el clip sale en banda en lugar de recortado.
- Las animaciones CSS no se renderizan. Todo el movimiento sale de
  `interpolate()` sobre `useCurrentFrame()`.
- `interpolate` va dentro del `style`, para que se pueda editar desde Studio.
- Las escenas usan `Interactive.Div` para que los textos se puedan cambiar en
  Studio y se escriban solos en el código.
- **Toda pieza llama a `useFuentesDeMarca()`**, el primer hook del componente
  raíz. Las fuentes se registran desde `video/public/fuentes/` con la API
  `FontFace` y el render espera a que estén listas: sale igual en cualquier
  máquina y sin conexión. Si una pieza se olvida del hook, se renderiza con
  la letra del sistema y no avisa nadie.
- **Los momentos de una animación se cuentan en fotogramas de la escena**, no
  relativos al `desde` del componente. Mezclar las dos escalas ya dejó una
  Puerta Santa que nunca llegaba a abrirse.
- **Comprobar que una animación cabe en su bloque.** Si tarda 54 fotogramas en
  completarse y el bloque dura 151, tiene que arrancar antes del 97.
- **La geometría de un gráfico se calcula desde su ancho, no a ojo.** Un paso
  entre hitos clavado a mano dejó el último año 43 px fuera del raíl.
- Lo que dependa de red o de una librería pesada se precalcula a un archivo de
  datos. El mapa de rutas se proyecta una vez con
  `herramientas/scripts/mapa-datos.mjs`; en render no hay ni d3 ni descargas.

## Un gráfico tiene que leerse sin pensar

La mayoría lo verá en silencio y de paso. Si hay que descifrarlo, no sirve,
por fiel que sea.

La Puerta Santa se dibujó primero como el muro de sillares que de verdad la
tapia y se derriba cada Año Santo. Era lo correcto y no se entendía: unos
bloques que se desvanecen no dicen «puerta». Dos hojas abriéndose las entiende
cualquiera sin pensar.

Lo mismo con el calendario: no enseña una cuadrícula que haya que leer, tiñe
primero la columna de los domingos y solo después enciende el 25. Y la semana
empieza donde la empieza el mercado al que va la pieza, en lunes o en domingo.

**Y tiene que decir la verdad, porque se cuenta.** Si el rótulo dice «7
routes», el mapa dibuja siete: `MapaRutas` tiene dos vistas por eso, la del
noroeste con cinco y la peninsular con las siete principales.

Los emojis no se escriben: no están en Montserrat y saldrían como una caja
vacía. Una flecha se dibuja en SVG.

## Instagram y YouTube no son lo mismo

Las piezas comparten marca y componentes, pero tres cosas cambian con el
canal y conviene no unificarlas por descuido:

| | Reel de Instagram | Short de YouTube |
| --- | --- | --- |
| Subtítulos | No | **Quemados**: se ve mucho sin sonido |
| CTA en pantalla | No, lo pone quien publica | **Sí**: señala los comentarios y el vídeo de debajo, y eso un pie no puede hacerlo |
| Suelo de los gráficos | 280-320 px | **560 px**: encima van los subtítulos, que ocupan de 1420 a 1520 |
| Sincronía del texto | Por bloques | **Por tramo de voz**: los subtítulos se alinean con `alinear-locucion.py`, nunca repartiendo el guion a ojo |

En un short las dos llamadas van separadas y en orden: primero comentar,
después el vídeo o el enlace. Nunca en el mismo rótulo.

## Comandos

```bash
cd video
npm install
npm run dev                                       # Studio, preview editable
npx remotion render ReelXacobeoUS salida.mp4      # Exportar
```

Piezas registradas:

| Composición | Qué es | Ficha |
| --- | --- | --- |
| `ReelXacobeo` | Año Santo 2027 en español, 33 s | — |
| `ReelXacobeoUS` | El mismo, para el mercado estadounidense, 60 s | `docs/reel-xacobeo-2027-us.md` |
| `ShortFrancesUS` | Short de YouTube sobre el Camino Francés, 53 s | `docs/short-a-camino-frances-us.md` |
| `Grafico` | Banco de pruebas para ver un gráfico aislado | — |

La pieza estadounidense dura el doble que la española porque no da por sabido
qué es el Camino.

No hace falta pasar ninguna opción de navegador: `remotion.config.ts` detecta
un Chromium ya instalado si lo hay, que es lo que permite renderizar en las
sesiones de Claude Code en la web, donde la descarga del Chrome de Remotion
está bloqueada.

**Remotion trae su propio ffmpeg y ffprobe**, así que no hace falta instalarlos:
`npx remotion ffmpeg` y `npx remotion ffprobe`. Vienen con los filtros
recortados: hay `silencedetect` y `scale`, pero no `volumedetect` ni `astats`.
Los scripts de `herramientas/scripts/` lo localizan solos.

## Preparar metraje

```bash
python3 herramientas/scripts/planos.py bruto.mp4              # dónde empieza cada toma
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg  # verlo de un vistazo
python3 herramientas/scripts/encuadre.py plano.mp4 comp.jpg 25,45,62  # elegir recorte
python3 herramientas/scripts/envolvente.py musica.mp3         # dónde sube y baja un tema
```

Los planos recortados viven en `video/public/brutos/`. Los brutos completos no
entran en el repositorio: pesan y se sustituyen a menudo.

## Antes de dar una pieza por buena

Dos pasos, y ninguno es opcional:

```bash
python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeoUS.tsx
```

Comprueba que ninguna toma se congela, que ninguna baja del mínimo legible,
que no se repite ninguna entre bloques contiguos y que el ralentí no se pasa
de frenada.

```bash
python3 herramientas/scripts/catalogar.py salida.mp4 control.jpg 6 2
```

Y mirar la hoja de contactos del resultado. Es la forma rápida de ver un texto
cortado, un gráfico que tapa lo que no debe o un plano que quedó oscuro. Lo
que no se mira, no está bien: el mapa con el nombre de la ciudad saliéndose
del marco y la puerta que no se abría pasaron el render sin un solo error.

## Lo que no se hace

- Contadores de cuenta atrás ni "últimas plazas".
- Cifras sin fuente en pantalla, sobre todo en piezas ancladas mucho tiempo.
  En una pieza que va a estar meses anclada, mejor ninguna cifra.
- Promesas de precio que no se puedan sostener.
- Gradientes ajenos a la marca, glassmorphism, texturas digitales abstractas.
- Fotografía en blanco y negro, sobresaturada, con grano o de stock genérico.
- Topónimos que el público de la pieza no conozca. En la versión
  estadounidense se descartó un plano entero por llevar un cartel de
  Portomarín legible.
