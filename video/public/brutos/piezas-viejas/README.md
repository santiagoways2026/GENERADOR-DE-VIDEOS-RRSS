# Planos recurso de las piezas viejas de la agencia

28 planos, 72 segundos en total, sacados de tres brutos de vídeos antiguos.
Ninguno lleva gente hablando a cámara y ninguno se repite.

**1280x720, sin pista de audio.** Son más pequeños que los brutos de la
carpeta raíz, que van a 1080p; para un primer plano grande tira de aquellos.

Se usan como cualquier otro bruto, poniendo la subcarpeta delante:

```tsx
{ src: "piezas-viejas/puente-medieval", dura: 1.8 }
```

## Dos tandas, y no salieron igual

**Los 15 primeros** vienen de dos brutos que llevaban el logo de la agencia
pegado arriba a la derecha, en `x 930-1247, y 20-75`. El encuadre se corta por
arriba y vuelve al 16:9 por los lados, `crop=1138:640:70:80` y de ahí a
1280x720: se pierde el 11,1 % por cada lado, que es lo que cuesta sacar de
cuadro una marca tan arriba, y la imagen queda un pelo más blanda por el
reescalado.

**Los 13 últimos**, de `seto-compostela` en adelante, vienen de un tercer
bruto que no llevaba marca ni ningún otro sobreimpreso. Se comprobó cruzando
los planos entre sí: cero píxeles quietos en los trece a la vez. Salen a
cuadro completo y sin reescalar, así que son los más nítidos de la carpeta.

Ninguno de los tres brutos llevaba subtítulos incrustados.

Cada plano lleva un margen de 0,10 a 0,20 s por los dos lados. Los dos
primeros brutos entran con un encadenado desde blanco y salen con un fundido,
y sin ese margen se colaban fotogramas lavados.

## Santiago y patrimonio

| Plano | Dura |
| --- | --- |
| `catedral-quintana` | 3.0 s |
| `seto-compostela` | 2.1 s |
| `soportales-rua` | 3.2 s |
| `centro-acogida` | 2.9 s |
| `balcones-obradoiro` | 0.8 s |
| `puente-medieval` | 3.9 s |
| `iglesia-espadana` | 3.7 s |
| `capilla-prado` | 3.2 s |
| `capilla-peregrino` | 1.1 s |
| `cruceiro-prado` | 1.9 s |
| `cruceiro-base` | 1.7 s |
| `piedra-ofrendas` | 1.9 s |
| `mural-estrellas` | 1.6 s |
| `mural-peregrino` | 2.2 s |
| `panel-camino` | 2.4 s |
| `casa-calixtino` | 2.1 s |

## Peregrinos

| Plano | Dura |
| --- | --- |
| `peregrinos-iglesia` | 2.4 s |
| `peregrinos-escalera` | 2.1 s |
| `peregrinos-calzada` | 4.0 s |
| `sendero-peregrinos` | 4.0 s |

## Alojamiento y equipaje

| Plano | Dura |
| --- | --- |
| `pazo-blanco` | 1.8 s |
| `hotel-arzua` | 1.6 s |
| `galeria-hotel` | 2.7 s |
| `habitacion-ventanal` | 2.1 s |
| `habitacion-granate` | 1.8 s |
| `bano-aseo` | 1.6 s |
| `bano-lavabo` | 1.6 s |
| `maletas-etiqueta` | 2.2 s |
