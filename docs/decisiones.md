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

## Qué no se hace

Contadores de cuenta atrás, "últimas plazas", imágenes de masificación,
comparaciones con la competencia ni promesas de precio que no se puedan
sostener. La urgencia se cuenta desde la ventaja, nunca desde la amenaza.
