---
name: reel
description: Montar un reel de Santiago Ways en Remotion, desde el guion y los brutos hasta el MP4. Úsala cuando alguien pida un reel, un vídeo para redes, una pieza vertical o adaptar una existente. Cubre el flujo entero: preparar metraje, sincronizar con la locución, aplicar las cartelas de marca y exportar.
---

# Montar un reel de Santiago Ways

Sigue este orden. Cada paso evita un error que ya se ha cometido antes.

Antes de nada, mira si la pieza que piden se parece a `ReelXacobeoUS`: está
documentada bloque a bloque en `docs/reel-xacobeo-2027-us.md` y casi todo lo
que hay que decidir ya está decidido ahí.

## 1. Reunir el material

Pide lo que falte, pero **no te bloquees esperando**: monta con lo que haya y
deja preparado el hueco de lo que falte.

- **El guion**, con los mensajes en pantalla y el CTA.
- **La locución** en MP3. Si aún no está, monta con los tiempos del guion y
  deja el array de tiempos listo para sustituir: cuando llegue el audio se
  miden los silencios y se cambian los números, nada más.
- **La música**, si lleva.
- **Los brutos.** Suelen ser compilaciones de tomas cortas, no clips sueltos.

**Cuenta el metraje antes de empezar.** Suma lo que dura la locución y lo que
duran todos los brutos. Si el metraje es menos que la pieza, vas a tener que
repetir tomas o estirarlas, y conviene saberlo antes de montar, no después.

## 2. Catalogar los brutos

Nunca cortes a ojo. Para cada archivo:

```bash
python3 herramientas/scripts/planos.py bruto.mp4
python3 herramientas/scripts/catalogar.py bruto.mp4 /tmp/hoja.jpg 5 3
```

El primero da los límites exactos de cada toma; el segundo, una hoja de
contactos para ver qué hay. **Ninguna toma suele pasar de 2,75 segundos**, así
que todo corte más largo cruza dos planos y produce un salto.

Extrae cada plano con 0,15 s de margen por dentro de sus límites:

```bash
FF=video/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
$FF -ss <inicio> -i bruto.mp4 -t <dura> -an -c:v libx264 -crf 21 \
  -preset medium -pix_fmt yuv420p video/public/brutos/<nombre>.mp4 -y
```

En este repositorio no hay un ffmpeg del sistema: se usa el que trae Remotion,
que es el mismo que localizan los scripts. También vale `npx remotion ffmpeg`
desde `video/`.

**Mira la hoja de contactos y apunta qué se ve en cada plano**, no te fíes del
nombre del archivo: en el repositorio hay nombres que no corresponden con su
contenido. Marca también los que tengan un cartel con un topónimo, que no
sirven fuera de España.

## 3. Revisar los encuadres verticales

Un bruto horizontal recortado a 9:16 pierde los laterales, y ahí suele estar
la gente. Para cada plano con personas:

```bash
python3 herramientas/scripts/encuadre.py plano.mp4 /tmp/comp.jpg 25,45,62,80
```

Elige la posición donde no se corte nadie por la mitad y donde se vea lo que
el plano tiene de bueno. Eso va en `encuadre`: `"62% 50%"` desplaza el recorte
a la derecha, `"34% 50%"` a la izquierda.

## 4. Sincronizar con la locución

Mide los silencios para localizar los arranques de frase:

```bash
npx remotion ffmpeg -i public/locucion-en.mp3 \
  -af silencedetect=noise=-30dB:d=0.28 -f null - 2>&1 | grep silence_
```

El arranque de cada frase es `silence_start + silence_duration`. **Mapea frase
a frase**: escribe al lado de cada tiempo qué dice la voz ahí. Esos comentarios
son lo que hace que el montaje se pueda retocar seis meses después. Los tiempos
van al array `B` de la composición.

Cuando la voz nombre algo concreto, que la imagen lo enseñe en ese fotograma:
la tarjeta de equipajes entra en «your luggage moved ahead», y el punto de
Santiago se enciende cuando dice «Santiago de Compostela». Es lo que separa un
montaje sincronizado de uno que solo va al ritmo.

## 5. Repartir los planos

Usa `Planos` para encadenar las tomas de cada bloque. Reparte la duración en
proporción a lo que pesa cada una.

**La regla que más veces se ha saltado: ninguna toma por debajo de 1,2 segundos
en pantalla.** Mejor tres tomas largas que seis cortas. Para conseguirlo:

- Baja `dura` en las tomas largas para que no se coman el bloque. `dura` es un
  presupuesto, no la duración del archivo.
- Sube el tiempo que rinde una toma con `ritmo`. Entre 0,7 y 0,9 no se nota;
  por debajo de 0,6, solo en planos casi quietos.
- Si aun así no salen las cuentas, quita una toma del bloque.

El resto de reglas de contenido:

- **Pocas cartelas.** Si el bloque lleva un gráfico, el gráfico ya trae su
  titular.
- **Ninguna toma repetida** entre bloques contiguos, ni el mismo sitio en dos
  tomas distintas.
- **Un gráfico no tapa una cara**: si el plano tiene gente en el centro, va
  donde el gráfico ya se ha retirado.
- El texto arriba, los gráficos abajo.
- Lo último antes del cierre, una cara.

## 6. La música

Mira su envolvente antes de decidir por dónde entra:

```bash
python3 herramientas/scripts/envolvente.py musica.mp3
```

Busca dónde arranca el fundido final y resta la duración de la pieza: así el
tema termina con el vídeo sin inventarse ningún fade. Volumen 0,14, con una
entrada corta.

## 7. Cerrar

El cierre es siempre igual: degradado entre los verdes de la paleta, el logo
en blanco y la web en Manrope debajo. Sin CTA en pantalla: lo pone quien
publica.

## 8. Verificar, y solo después exportar

```bash
python3 herramientas/scripts/revisar-montaje.py video/src/<Pieza>.tsx
cd video && npx remotion render <Composicion> salida.mp4 --crf=23
python3 herramientas/scripts/catalogar.py salida.mp4 /tmp/control.jpg 6 2
```

**Mira la hoja de contactos del resultado, siempre.** Un texto que se sale del
marco, una animación que no llega a completarse o un gráfico que tapa una cara
no dan ningún error: el render sale limpio y el fallo solo se ve mirando.

Si la pieza lleva audio mezclado, comprueba también el perfil:

```bash
python3 herramientas/scripts/envolvente.py salida.mp4 2.5
```

Debe salir parejo. Una caída brusca es un silencio que la música no tapó.

## Componentes disponibles

| Componente | Para qué |
| --- | --- |
| `Cartela` | Texto de marca: placa blanca sobre placa olivo, con barrido. Admite varias líneas |
| `Bullets` | Lista de servicios, entrando de uno en uno. Con número o con check, y con tiempos de entrada propios |
| `Clip` y `Planos` | Metraje encajado en vertical, con encuadre, zoom lento y ritmo de reproducción |
| `Logo` | El archivo oficial, en blanco o verde |
| `CajaDato` | Una cifra con su fuente debajo |
| `Pildora` | Un dato suelto sobre el metraje |
| `Calendario` | Julio de 2027 con el 25 en domingo. La semana abre en lunes o en domingo, según el mercado |
| `LineaTiempo` | Años Santos, con la vieira que se detiene en 2027 |
| `MapaRutas` | Las rutas convergiendo en Santiago, trazándose una a una |
| `PuertaSanta` | La Puerta Santa, cerrada y abriéndose |
| `Candado` | Precio bloqueado, sin cifras |
| `Cierre` | Degradado, logo y web |

Si haces un gráfico nuevo, pruébalo aislado en la composición `Grafico` antes
de meterlo en la pieza.

Las reglas de marca completas están en `CLAUDE.md`. El porqué de cada decisión,
en `docs/decisiones.md`.
