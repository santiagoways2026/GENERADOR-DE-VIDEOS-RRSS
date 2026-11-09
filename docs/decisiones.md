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
silencio y de paso. El calendario no muestra una cuadrícula que haya que
descifrar: primero tiñe la columna entera de los domingos y solo después
enciende el 25 dentro de ella, así que la vista saca la conclusión sola.

Las cifras van siempre con su fuente en pantalla, y los gráficos que no
necesitan número no lo llevan: el candado de precio cuenta un gesto, no una
cantidad, y así la pieza no envejece.

## Metraje

Los brutos son compilaciones de tomas cortas. **Ninguna pasa de 2,75
segundos**, de modo que un corte más largo cruza dos planos y produce un salto
a mitad de escena. Se localizan los límites con el script `planos.py` antes de
cortar nada.

Como los brutos son horizontales y las piezas verticales, cada plano pierde los
laterales al recortarse, que es justo donde suele estar la gente. Cada plano
con personas lleva su punto de encuadre propio.

Ninguna toma se repite entre bloques contiguos: al volver parece un error de
montaje.

## Sincronía

Los cortes no se colocan a ojo. Se miden los silencios de la locución para
localizar los arranques de frase, y cada bloque empieza justo cuando la voz
dice lo que la imagen ilustra. Cambiar de locución obliga a repetir la medida,
pero no a rehacer el montaje.

## Cierre

Degradado entre los verdes de la paleta, logo en blanco y la web debajo. Nada
más. El degradado gira muy despacio para que un plano fijo de varios segundos
no se muera.

## Efectos sobre una pieza ya editada

Las piezas de Hilary llegan montadas: subtítulos palabra a palabra, tarjetas y
banners van quemados en la imagen. Lo que se añade encima no puede pisarlos:

- Los gráficos nuevos van **debajo de los subtítulos**, desde 1480 px de alto,
  o arriba solo en los planos donde no hay tarjeta quemada.
- El **zoom de énfasis** cae en la palabra que se subraya y solo en tramos sin
  tarjeta ancha, porque el acercamiento recortaría sus bordes. Los saltos de
  vuelta se esconden en los cortes de plano.
- La **transición olivo** solo en cambios de bloque. En cada corte cansaría.
- Los tiempos salen de la transcripción por palabra y de los cortes medidos
  con detección de escena: `ffmpeg -vf "select='gt(scene,0.08)',showinfo"`.
- Si una tarjeta quemada no se lee o lleva demasiado texto, se rehace
  encima, en la misma posición, tapándola entera. Aparece de golpe en el
  corte donde entra la quemada, no con barrido, para que no asome.
- **Una idea por tarjeta, dos líneas como mucho.** Las tarjetas con frase de
  contexto debajo no se leen en el tiempo que están: la voz ya lo cuenta.
  La de la credencial se quedó en "The credential / Included with Santiago
  Ways" y el aviso de los sellos en "Last 100 km / 2 stamps a day", con los
  dos sellos cayendo cuando la voz los nombra.

## Efectos con recorte de la persona

Para poner una tarjeta **detrás** de quien habla, o para el **orbit**, hace
falta separar a la persona del fondo:

```bash
python3 herramientas/scripts/recortar.py pieza.mp4 <desde> <hasta> recorte/
python3 herramientas/scripts/fondo_limpio.py recorte/ fondo/
```

El primero saca a la persona con fondo transparente, fotograma a fotograma;
se convierte a WebM con alfa y Remotion lo pone encima con `transparent`. El
segundo borra a la persona del fondo; sin él, al girar el fondo asoma una
segunda silueta.

Lo que se aprendió al aplicarlo:

- **Un efecto con firma por bloque**, y nunca dos en menos de seis segundos.
  El orbit, una sola vez por pieza.
- La caja de detrás va **a un lado de la cabeza**, no centrada: si el texto
  queda tapado por la persona, no se lee. Asoma desde detrás y vuelve a
  esconderse. Gustó mucho, con una condición: **sutil**. Poco texto, sombra
  apenas marcada, entrada lenta y corta. Está en `CajaDetras`.
- No se puede poner por detrás donde hay una tarjeta quemada encima de la
  cabeza: debajo no queda pelo que recortar.

## La cara de quien habla no se tapa nunca

Ni un gráfico, ni una tarjeta, ni una transición. Lo que se aplica:

- Las tarjetas que tapan las quemadas miden **exactamente** lo mismo que
  ellas, ni un píxel más hacia la cara.
- Si una tarjeta quemada ya baja hasta la cara, ese tramo se cubre con un
  **plano de recurso** mientras sigue la voz, y se reponen encima sus
  subtítulos con el mismo aspecto (`Subtitulo`). En la pieza 03 de Hilary,
  el aviso de los sellos cae sobre el plano del pórtico sellando.
- Las transiciones solo **destapan** el plano nuevo desde el corte: nunca
  tapan los últimos fotogramas de quien habla.

## Redes al final

Un banner con cuatro redes no se lee. Se deja **una red y la web**: en la
pieza 03, "Subscribe on Facebook" y santiagoways.com, en una sola cápsula
que tapa los dos banners quemados.
- El orbit sirve de **transición**: sustituye al barrido de ese corte y
  termina fundiéndose con el plano original, así la vuelta no se nota.
- El tramo del CTA queda **quieto y limpio**, sin zoom.

## Qué no se hace

Contadores de cuenta atrás, "últimas plazas", imágenes de masificación,
comparaciones con la competencia ni promesas de precio que no se puedan
sostener. La urgencia se cuenta desde la ventaja, nunca desde la amenaza.
