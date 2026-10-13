# Los archivos del logo

Los seis de arriba son los del **Brandbook 2027**, sacados de su página 10 a
1200 dpi y con el fondo transparente. Son los que se usan de ahora en adelante.

| Archivo | Tamaño | Para qué |
| --- | --- | --- |
| `santiago-ways-horizontal-verde.png` | 4205x640 | Sobre blanco o brote |
| `santiago-ways-horizontal-blanco.png` | 4205x640 | Sobre verde, grafito o foto |
| `santiago-ways-vertical-verde.png` | 1714x1532 | Sobre blanco, cuando el horizontal no cabe |
| `santiago-ways-vertical-blanco.png` | 1714x1532 | Lo mismo, sobre cualquier otro fondo |
| `santiago-ways-isotipo-verde.png` | 1332x1106 | La concha suelta: firma, avatar, sellos |
| `santiago-ways-isotipo-blanco.png` | 1332x1106 | La concha sobre foto o color |

**Van recortados a hueso**, sin margen transparente alrededor: el área de
respeto la pone quien los coloca, y la guía la mide en X, que es la mitad de
la altura de la concha.

Anchos mínimos en digital, que la guía da en ancho y no en alto: **140 px** el
horizontal, **160** el vertical y **24** el isotipo.

Sobre blanco el logo va en verde Ways; **sobre cualquier otro fondo, en
blanco**, y eso incluye toda la foto, que es casi todo el vídeo.

## Cómo salieron

El logo va en el PDF en vectorial sobre blanco, así que cada píxel es
`obs = a * color + (1 - a) * blanco` y el alfa se despeja por el canal azul,
que es donde más se separan el verde y el blanco. Así sale **el alfa con su
antialias**, no un recorte a umbral: recomponer el verde sobre blanco devuelve
el original con una diferencia máxima de 1 sobre 255.

**Una incoherencia del propio libro, por si aparece en otro sitio:** en la
página 10 el logo horizontal está dibujado en `#668814` aunque su pie diga
`#7AA606`. El vertical sí usa el verde Ways. Aquí los seis se han reconstruido
en `#7AA606`, que es lo que manda la paleta. Conviene decírselo a quien
mantenga el brandbook.

## Los dos que había antes

Se quedan porque son los que usan las piezas ya entregadas, y cambiarlos
movería el tamaño del logo en sus cierres:

| Archivo | Qué pasa con él |
| --- | --- |
| `santiago-ways-blanco.png` | El horizontal de la edición anterior, 2500x625 con margen transparente. Es la misma silueta, a menos resolución |
| `santiago-ways-verde.png` | El mismo, en verde, a 507x88. Se queda muy corto para cualquier uso grande |
| `isotipo-verde.png` | La concha a 833x833, pintada en `#71970E`, que no es ningún verde de la paleta |

**Para una pieza nueva se usan los de arriba.** Ojo al sustituirlos en una
escena: los viejos llevan margen transparente y los nuevos no, así que con el
mismo `ancho` el logo nuevo se ve un 15 % más grande.
