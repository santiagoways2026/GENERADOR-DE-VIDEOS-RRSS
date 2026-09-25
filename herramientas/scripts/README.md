# Las herramientas

Todas se llaman igual, `python3 herramientas/scripts/<nombre>.py`, y todas
salen de un problema real que dio la cara en una pieza. El razonamiento está
en el docstring de cada una; esto es sólo para saber cuál coger.

## Preparar metraje

Lo que se hace con un archivo antes de montarlo.

| Script | Para qué |
| --- | --- |
| `planos.py` | Dónde empieza y acaba cada toma de un bruto |
| `catalogar.py` | Hoja de contactos: N fotogramas con su marca de tiempo |
| `reescalar.py` | Subir un clip a la resolución de entrega, limpiándolo antes |
| `encuadrar.py` | Qué mirar al pasar un 16:9 a vertical, plano a plano |
| `marca-agua.py` | Quitar un logo pegado, recortando o rellenando |
| `recortar-figura.py` | Cambiar el fondo de un tramo por el degradado de marca |
| `duplicados.py` | Si un plano nuevo ya está en la biblioteca |

`encuadrar.py` y `recortar-figura.py` llevan su modelo al lado: `yunet.onnx`,
que son 232 KB y va en el repositorio, y `u2net_human_seg.onnx`, que son
176 MB y no va; el propio script dice el `curl`.

## Audio

| Script | Para qué |
| --- | --- |
| `ambiente.py` | Cama de ambiente a partir de los silencios del propio montaje |

Es además la librería que usan las demás: de aquí sale `binarios()`, que
encuentra el ffmpeg completo, porque el que trae Remotion es una compilación
recortada.

## Comprobar un montaje

**Los dos se pasan antes de cada render.** Uno mide que el plano llegue, el
otro mide lo que se ve entre plano y plano.

| Script | Para qué |
| --- | --- |
| `comprobar-inserciones.py` | Que ningún plano de recurso se quede corto y congele |
| `planos-visibles.py` | Parpadeos entre inserciones, y tomas repetidas |

## Entregar

| Script | Para qué |
| --- | --- |
| `entregar.py` | Cuadra los 43 ms de retardo del AAC y deja la copia para revisar |

**Se pasa a todo lo que salga de un render**, sin excepción.

## De una pieza concreta, en `piezas/`

No son herramientas: son el montaje de una pieza escrito como script, para
poder rehacer su archivo base si hace falta. Cada uno lleva dentro los cortes
exactos de esa pieza y no vale para otra.

| Script | Rehace |
| --- | --- |
| `piezas/montaje-social-ES.py` | La base de la pieza social en español |
| `piezas/montaje-testimonio-ES2.py` | El testimonio de la pareja, acortado |
| `piezas/audio-reel-de.py` | La pista del reel alemán |
| `piezas/audio-reel-hoteles.py` | La pista del reel de hoteles |
