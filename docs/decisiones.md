# Decisiones de producción

Por qué las piezas son como son. Sirve para no volver sobre lo ya discutido y
para que quien llegue nuevo entienda las razones.

## Tipografía

El manual marca **Tahoma** como corporativa para PDF y material legacy. En
vídeo no sirve: no existe en el navegador headless con el que Remotion
renderiza, así que el resultado saldría con otra fuente sin avisar. Se usa la
cascada de web, **Montserrat, Manrope, Poppins**, empaquetada con el proyecto
para que el render sea idéntico en cualquier máquina y funcione sin conexión.

La web del cierre va en **Manrope**, que contrasta con Montserrat del logo.

## Qué fuente va en cada cosa

La guía fija la cascada (Montserrat → Manrope → Poppins) y, a diferencia de
lo que se supuso durante un tiempo, **sí resuelve el titular**. Trae el
patrón entero, comentado como *"the signature impact headline pattern —
UPPERCASE, white on green block"*: peso 900, interlineado 0,95,
`letter-spacing` -0,02em y mayúsculas.

Hubo una fase en la que el texto de vídeo se puso en **Manrope extrabold**,
por escrito y en los tokens. Fue un invento, y encima uno que no se podía
sostener: el patrón pide 900 y **Manrope se queda en 800**. En pantalla el
titular parecía un pie al lado de las placas del kit, que van en Montserrat
900. Costó dos rondas descartar que fuera un problema de carga de fuentes
antes de ver que el tope de la familia era el techo.

Ahora el reparto es este:

- **Montserrat 900** en el texto de impacto: titulares sobre la imagen y
  cifras. Es el patrón de la guía, y casa con las placas del kit.
- **Montserrat 800** en los subtítulos quemados. A cuerpo 50 el 900 se
  empasta y cierra los contornos.
- **Manrope 700** en el texto de apoyo: la línea pequeña bajo un titular y la
  web del cierre. Ahí sí abre mejor y contrasta con el logo.

Está en `tipo`, dentro de `video/src/brand/theme.ts`, y se usa desde ahí. Un
componente que escriba la familia y el peso a mano se sale del sistema sin
que nadie lo note.

## Cómo se cargan las fuentes, y por qué no se cargaban

Durante las tres primeras piezas **ninguna fuente de marca llegó a cargarse**.
El proyecto tenía los `import "@fontsource/montserrat/800.css"` de rigor,
compilaban sin una queja y el CSS nunca llegaba al documento: `document.fonts`
estaba vacío y todo se renderizó con la sans-serif por defecto del sistema.
No saltó ningún error y en pantalla pasaba por bueno, porque la de respaldo
también es una grotesca. Se descubrió porque el rótulo «no tenía la pinta de
Manrope» tres revisiones seguidas, y lo confirmó pintar el mismo texto en las
dos familias **sin cascada de respaldo**: las dos salieron en serif, que es lo
que dibuja el navegador cuando la familia pedida no existe.

Dos lecciones, y las dos están montadas:

1. **Los woff2 viven en `video/public/fuentes/`** y se registran con la API
   `FontFace` desde `video/src/fuentes.ts`. Ocho caras, 148 KB. No depende del
   bundler ni de la red.
2. **Se comprueba, no se supone.** La composición `Fuente` pinta las muestras
   sin fallback e imprime cuántas caras hay registradas. `document.fonts.check()`
   no vale para esto: devuelve `true` aunque no haya nada cargado.

El `delayRender` a nivel de módulo no funciona; tiene que ser el hook
`useFuentesDeMarca()`, llamado en el componente raíz de cada pieza. Si una
pieza se lo salta, se renderiza con otra letra y no lo dice nadie.

## El titular sobre la imagen

`Cartela` y `Bullets` vienen del kit y son reconocibles, pero una pieza
entera resuelta con ellos parece una plantilla, y todas las piezas de la
marca acaban pareciendo la misma. `Titular` es el contrapunto: texto grande
directamente sobre el metraje, sin placa.

El resalte pasó por tres versiones antes de quedarse donde tenía que haber
empezado, que es el patrón `.impact` de la guía:

1. **La palabra pintada de lima.** Se salta el manual, donde el lima es fondo
   y nunca color de letra, y sobre un plano claro la palabra resaltada se
   leía peor que el resto del titular, justo al revés de lo que se quería.
2. **Banda de lima con la letra en bosque.** Mejor, pero seguía sin ser lo
   que dice la guía: el lima lo reserva para los *punch blocks* pequeños.
3. **Bloque verde de marca con la letra en blanco**, que es el patrón. Es lo
   que hay ahora.

Tres detalles de implementación que dieron guerra:

- **El bloque entra de una pieza, con su texto dentro.** Antes las palabras
  entraban una a una por dentro de un bloque ya dibujado, y se veían flotando
  dentro de la caja en lugar de formar parte de ella.
- **El bloque es una caja entera (`inline-block`), no texto corrido.** Con el
  bloque en línea, un titular que parte en dos deja dos fragmentos de caja y
  el `clip-path` del barrido solo recorta el primero: la segunda línea
  desaparecía del todo. «THE MOST WALKED» se quedó en «THE MOST» y el render
  no dio ni un aviso. Es otro caso de lo de siempre: lo que no se mira, no
  está bien.
- **El cuerpo se ajusta solo.** Como el bloque no parte por dentro, tiene que
  caber entero a lo ancho; si no, `Titular` baja el cuerpo hasta que quepa.
  Sin eso, «the best signposted» partía dentro del bloque y dejaba un
  rectángulo verde con medio lado vacío.

## Textos en pantalla

Empezaron siendo texto blanco suelto sobre el metraje y no funcionaba: no
parecía de la marca. Ahora replican las cartelas del kit de motion graphics,
con sus valores reales: placa blanca con el dato en bosque y peso 800, placa
olivo debajo, esquinas que se responden entre sí y entrada con barrido lateral
de 896 ms con medio segundo de relevo.

La placa pequeña va **en mayúsculas y peso negro**. En minúsculas no encaja.

**Pocas cartelas por pieza.** Se pasó de siete a dos: cuando el bloque lleva un
gráfico, el gráfico ya trae su propio titular y la cartela sobra.

## Gráficos de dato

Se diseñan para entenderse **sin leerlos**, porque la mayoría los verá en
silencio y de paso. Si hay que descifrarlos no sirven, por fieles que sean:
la Puerta Santa se dibujó primero como el muro de sillares que de verdad la
tapia y se derriba cada Año Santo, y hubo que rehacerla porque unos bloques
que se desvanecen no dicen «puerta». Dos hojas abriéndose las entiende
cualquiera sin pensar. El calendario no muestra una cuadrícula que haya que
descifrar: primero tiñe la columna entera de los domingos y solo después
enciende el 25 dentro de ella, así que la vista saca la conclusión sola.

Las cifras van siempre con su fuente en pantalla, y los gráficos que no
necesitan número no lo llevan: el candado de precio cuenta un gesto, no una
cantidad, y así la pieza no envejece.

## Los subtítulos, sin banda

Los subtítulos empezaron con una banda de bosque detrás. Resolvía la
legibilidad, pero tapaba metraje en todos los planos para arreglar unos
pocos y partía la pieza en dos mitades.

Ahora van sueltos, con un contorno de bosque dibujado con ocho sombras
cortas alrededor de la letra. `-webkit-text-stroke` habría sido más directo,
pero engorda la letra hacia dentro y a ese cuerpo se come los contrafuertes
de la letra.

Lo mismo vale para el titular fuera de su bloque: sin placa, con sombra. Si
un plano es demasiado claro, se sube el `overlay` de `Planos` en vez de meter
una caja detrás del texto.

## Un bruto no dura lo que dice el archivo

En el short del Francés, en el segundo 43, aparecía un fotograma en blanco y
medio segundo de un plano que no tocaba, justo antes del cambio de bloque.

La causa: `iglesia-exterior.mp4` dura 1,37 s, pero su toma se corta en 1,16 y
lo que viene detrás es otra escena. El montaje pedía 1,32 s. Los brutos son
compilaciones y a varios les quedó pegado el arranque de la toma siguiente;
`plaza.mp4` es el peor, dura 1 s y su toma se acaba en 0,20.

Lo que dejó pasarlo fue el verificador: comprobaba el `dura` contra la
duración del archivo, que incluye ese rabo de otra escena, así que daba el
visto bueno. Ahora mide el final real de la toma con `fin_de_toma()`, que
busca el corte a saltos y luego lo afina partiendo el intervalo por la mitad
—a saltos de 0,25 s el corte puede estar un cuarto de segundo antes de donde
se detecta, que es demasiado para tomas de uno o dos segundos—. Las medidas
se guardan en `.tomas.json` porque cada una cuesta una docena de
extracciones.

Con la comprobación buena salen cuatro planos pasados en el short, cinco en
el reel del Xacobeo US y tres en el español. Ninguno lo dijo ningún script
hasta ahora.

## Una toma no se repite en la misma pieza

La regla empezó siendo «no repetir entre bloques contiguos», y el verificador
la comprobaba así. No bastaba. En el short del Francés la toma de las cuatro
mujeres enseñando la Compostela salía en el bloque 5 y otra vez en el 7, con
un bloque entero de por medio, y al verla se leyó como un fallo de montaje.

En una pieza de menos de un minuto, una cara se reconoce aunque pasen quince
segundos. Lo que separa los bloques no es suficiente distancia. Ahora
`revisar-montaje.py` marca cualquier toma que aparezca dos veces en la pieza,
esté donde esté.

Lo mismo vale para el sitio, aunque los archivos sean distintos: el short
llevaba tres planos de la misma fachada de la catedral (`plaza`,
`catedral-torres` y `catedral-a`), dos de ellos seguidos. Eso el script no lo
ve, hay que mirarlo.

Hay de dónde tirar: 34 planos en `video/public/brutos/` y 25 en la pieza.

## Metraje

Los brutos son compilaciones de tomas cortas. **Ninguna pasa de 2,75
segundos**, de modo que un corte más largo cruza dos planos y produce un salto
a mitad de escena. Se localizan los límites con el script `planos.py` antes de
cortar nada.

Como los brutos son horizontales y las piezas verticales, cada plano pierde los
laterales al recortarse, que es justo donde suele estar la gente. Cada plano
con personas lleva su punto de encuadre propio, elegido comparando recortes
con `encuadre.py` y no a ojo: el recorte central corta a alguien por la mitad
más veces de las que parece.

Ninguna toma se repite entre bloques contiguos: al volver parece un error de
montaje. Tampoco vale el mismo sitio en dos tomas distintas: un embalse que
sale por la ventana de una habitación y otra vez desde una terraza es la misma
repetición aunque sean dos archivos.

## Cuánto dura un plano

**Ninguna toma baja de 1,2 segundos en pantalla.** Es el fallo que más veces
se ha colado y el más visible: en la primera versión del reel estadounidense
había veinte tomas por debajo del segundo y la más corta duraba 0,71. El
espectador no sabe por qué, pero lo lee como un error de montaje.

El problema de fondo es que los brutos son cortos y las piezas largas: cubrir
un minuto con tomas de dos segundos a velocidad normal obliga a picar cada
bloque en cinco o seis planos. La salida no es meter más tomas, es que cada
una rinda más tiempo. `Planos` acepta un `ritmo` de reproducción: por debajo
de 1 la toma dura más de lo que dura en el bruto, sin congelarse ni invadir el
plano siguiente. Entre 0,7 y 0,9 nadie lo nota; por debajo de 0,6 solo aguanta
un plano casi quieto, como un detalle o una mesa puesta. Un primer plano de
alguien celebrando, a medio tiempo, además mejora.

Con eso el reel estadounidense pasó de 45 tomas a 31 y la más corta subió a
1,23 segundos.

**La pieza española sigue sin revisar con este criterio.** El verificador le
saca ocho tomas por debajo de 1,2 segundos, la más corta de 0,69. No se ha
tocado porque ya está publicada y arreglarlo cambia el montaje, pero si
alguna vez se vuelve a exportar, ese es el primer sitio donde mirar:

```bash
python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeo.tsx
```

## Qué plano cierra la pieza

El último antes del logo es una cara, no un sitio. Se probó con la mesa puesta
de un pazo, que es buena imagen, y no cerraba: informa pero no se recuerda. El
plano del peregrino celebrando la llegada, en primer plano y a medio tiempo,
sí.

Los primerísimos planos, en cambio, pasan rápido: el recorte a vertical ya
amplía el bruto un 78 %, y un plato o un detalle encima se ve blando.

## Sincronía

Los cortes no se colocan a ojo. Se miden los silencios de la locución para
localizar los arranques de frase, y cada bloque empieza justo cuando la voz
dice lo que la imagen ilustra. Cambiar de locución obliga a repetir la medida,
pero no a rehacer el montaje.

La sincronía fina es la que se nota: cuando la voz nombra algo, la imagen lo
enseña en ese fotograma. La tarjeta de equipajes entra sobre «your luggage
moved ahead every morning» y con el plano de las maletas; el punto de Santiago
se enciende cuando la voz dice el nombre de la ciudad; el 2032 de la línea de
tiempo aparece con la cifra, no antes. Es lo que separa un montaje
sincronizado de uno que solo va al ritmo.

## Música

La cama entra por donde diga su envolvente, no por el principio del archivo.
Casi todos los temas traen su propio fundido final; si se hace coincidir con
el cierre de marca, la pieza termina con la canción y no hay que inventarse
ningún fade. En el reel estadounidense el tema dura 116 segundos y se apaga
solo entre el 106 y el 112: arrancando en el 51,55 ese fundido cae justo en el
logo y el tramo pleno coincide con la parte que más pesa.

Va unos 15 dB por debajo de la voz. Se oye en los silencios de la locución,
que es para lo que está, y no compite con ella.

## Cierre

Degradado entre los verdes de la paleta, logo en blanco y la web debajo. Nada
más. El degradado gira muy despacio para que un plano fijo de varios segundos
no se muera, y cierra en bosque suave: terminar en el bosque oscuro apagaba
demasiado la parte de abajo.

**El CTA no va dentro del vídeo.** El cierre se queda limpio y la llamada a la
acción la pone quien publica, por encima de la pieza o en el pie. Así se puede
cambiar sin volver a exportar, que es lo que más veces hace falta.

Tampoco hay marca de agua. El logo aparece solo en el cierre, que ya es todo
marca. Cuando se probó a llevarlo durante toda la pieza hubo que ponerle una
franja de bosque debajo para que no desapareciera sobre los planos claros, y
aun así ensuciaba.

## Adaptar una pieza a otro mercado

No se traduce, se vuelve a montar. La versión española del reel del Xacobeo da
por sabido qué es el Camino; la estadounidense no puede dar nada por sabido, y
por eso dura el doble: hay que explicar la ruta, el Año Santo y por qué 2027
antes de vender nada. Ahí los gráficos dejan de ser adorno y se convierten en
la parte didáctica.

Cambian también cosas pequeñas que se notan mucho. La semana del calendario
empieza en domingo, que es como la lee un americano. Los rótulos en inglés son
bastante más largos y no caben de una tirada, así que la cartela admite varias
líneas. Y no aparece ningún topónimo que el público no conozca: se descartó un
plano entero por llevar un cartel de Portomarín legible.

Está todo detallado en `reel-xacobeo-2027-us.md`.

## Verificar antes de dar algo por bueno

Un montaje puede renderizar sin un solo error y estar mal. En esta pieza
pasaron el render un mapa con el nombre de la ciudad saliéndose del marco, una
Puerta Santa que nunca llegaba a abrirse porque su animación no cabía en el
bloque, y un logo blanco invisible sobre un campo de flores. Ninguno dio aviso.

De ahí salieron dos costumbres. `revisar-montaje.py` comprueba antes de
exportar que ninguna toma se congela, que ninguna baja del mínimo legible y
que no se repite ninguna entre bloques contiguos. Y del MP4 exportado se saca
siempre una hoja de contactos, que es la forma rápida de ver lo que ningún
script detecta.

## Qué no se hace

Contadores de cuenta atrás, "últimas plazas", imágenes de masificación,
comparaciones con la competencia ni promesas de precio que no se puedan
sostener. La urgencia se cuenta desde la ventaja, nunca desde la amenaza.
