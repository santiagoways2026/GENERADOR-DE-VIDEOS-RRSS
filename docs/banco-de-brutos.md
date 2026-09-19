# Banco de brutos

Qué metraje hay, dónde está el que aún no ha entrado y cómo se incorpora.

## Lo que hay en el repositorio

29 planos recortados en `video/public/brutos/`, 32 MB en total. Todos comparten
formato: **1920x1080, 30 fps, H.264, sin audio**, y duran entre 0,73 y 2,23
segundos. Esa horquilla no es casual, viene de que los brutos son compilaciones
y ninguna toma suya pasa de 2,75 segundos.

Son horizontales. Para una pieza vertical hay que revisar plano a plano y poner
`encuadre` donde el recorte se coma a la gente de los laterales.

**El banco está agotado.** `ReelXacobeo` gasta 28 de los 29, uno cada uno; solo
`vieiras` queda libre. Como ninguna toma puede repetirse entre bloques
contiguos, cualquier pieza nueva necesita metraje nuevo.

## Lo que hay en Drive y aún no ha entrado

Carpeta [VIDEOS BRUTOS CLIENTES](https://drive.google.com/drive/folders/1QlrMbkEf1a1XONqu3L-na8lUNdy-EZjw),
ocho compilaciones sin recortar:

| Bruto | Tamaño | ID de Drive |
| --- | --- | --- |
| PLANOS RECURSO 1 | 17,9 MB | `1kt9aG3KGhfXCAmURjfYFzn2RWUYTEl5f` |
| PLANOS RECURSO 2 | 11,8 MB | `1Fb_CrYVd_RjLQ2sUM2kRYC-QJKR3L8dn` |
| PLANOS RECURSO 3 | 16,4 MB | `1tt9Uhgjfu7x7ydD1irrccV0uX28Y6Q4h` |
| PLANOS RECURSO 4 | 24,5 MB | `1rS6pFly_H_9UTU7mMFQLCFNH8qHCAWTf` |
| HOTELES | 8,8 MB | `1p5lrSugvXdXU3WaeyKlzjSFw8nMTlJNS` |
| COMIDA | 15,6 MB | `1tdwJdTc5bLrn17Ev1hOEAnTvTT9I5Bqw` |
| TRANSPORTE EQUIPAJE | 8,9 MB | `1Fv_TLviT9kdhqVpkmu9lY637FrhkWnrZ` |
| Diseño sin título (4).mp4 | 196,5 MB | `1xTxuGjn0VS-_WMm2uHhbiBPJJiGkyqlR` |

Los cuatro `PLANOS RECURSO` son los candidatos naturales a ampliar el banco.
`HOTELES`, `COMIDA` y `TRANSPORTE EQUIPAJE` cubren huecos que el banco actual
no tiene, porque hoy no hay ningún plano de equipaje ni de traslado.

Hay más vídeo en Drive, en carpetas `ES` y `EN` con nombres de camino (FRENCH
WAY, PORTUGUESE WAY, VIA DE LA PLATA y demás) y piezas de unos 40 MB. Esas son
montajes terminados, no brutos: sirven de referencia, no de materia prima.

## Por qué no están ya aquí

Las sesiones de Claude Code en la web no pueden traerse estos archivos:

- La política de egreso de la organización bloquea `drive.google.com` y
  `drive.usercontent.google.com`. El proxy responde 403 al CONNECT.
- El conector de Drive sí llega a los archivos, pero devuelve el contenido como
  base64 dentro de la propia conversación. Vale para un CSV de 17 KB y es
  inviable para un vídeo de 18 MB.

Para desbloquearlo hay que permitir `drive.google.com` en la política de red
del entorno. Mientras tanto, la vía es local: descargar los brutos a mano y
recortarlos con los scripts de `herramientas/scripts/`.

## Cómo se incorpora un bruto

```bash
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg   # verlo de un vistazo
python3 herramientas/scripts/planos.py bruto.mp4               # dónde empieza cada toma
python3 herramientas/scripts/recortar.py bruto.mp4 video/public/brutos/ flecha credencial
```

`recortar.py` detecta los planos y los corta respetando sus límites, con la
misma codificación que el resto del banco. Los nombres se aplican por orden a
los planos detectados; a los que no reciben nombre les toca `bruto-01`,
`bruto-02` y así. Conviene nombrar solo los que se van a usar y borrar el
resto: el banco se lee mucho mejor con `catedral-torres` que con `recurso-07`.

Los brutos completos no entran en el repositorio. Pesan y se sustituyen a
menudo; lo que se versiona son los recortes.
