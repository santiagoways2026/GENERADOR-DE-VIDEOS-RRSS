# Planos recurso de las piezas viejas de la agencia

42 planos, 108 segundos en total, sacados de cuatro brutos de vídeos
antiguos. Ninguno lleva gente hablando a cámara y ninguno se repite, ni entre
ellos ni con los de las otras dos carpetas: cada candidato se comparó contra
los 140 planos que ya había.

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

**Los 28 últimos**, de `seto-compostela` en adelante, vienen de dos brutos
que no llevaban marca ni ningún otro sobreimpreso. Se comprobó cruzando los
planos entre sí: cero píxeles quietos en todos a la vez. Salen a cuadro
completo y sin reescalar, así que son los más nítidos de la carpeta.

Ninguno de los cuatro brutos llevaba subtítulos incrustados.

El plano de la calzada del puente estaba en las dos tandas. Se ha quedado el
de la segunda, `puente-calzada`, que viene sin recortar, y se ha borrado el
recortado. Ojo con el nombre: `testimonios/puente-medieval` es otro plano
distinto, el mismo puente visto de lejos con el pueblo detrás.

Cada plano lleva un margen de 0,10 a 0,20 s por los dos lados. Los dos
primeros brutos entran con un encadenado desde blanco y salen con un fundido,
y sin ese margen se colaban fotogramas lavados.

## Santiago y patrimonio

| Plano | Dura |
| --- | --- |
| `catedral-quintana` | 3.0 s |
| `plaza-obradoiro` | 2.4 s |
| `seto-compostela` | 2.1 s |
| `soportales-rua` | 3.2 s |
| `centro-acogida` | 2.9 s |
| `balcones-obradoiro` | 0.8 s |
| `arco-piedra` | 2.6 s |
| `puente-arco` | 2.6 s |
| `puente-calzada` | 3.3 s |
| `iglesia-espadana` | 3.7 s |
| `capilla-prado` | 3.2 s |
| `capilla-peregrino` | 1.1 s |
| `cruceiro-prado` | 1.9 s |
| `cruceiro-base` | 1.7 s |
| `piedra-ofrendas` | 1.9 s |
| `horreo-peregrinos` | 2.8 s |
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
| `peregrinos-campo` | 3.1 s |
| `sendero-peregrinos` | 4.0 s |
| `sendero-pareja` | 2.1 s |
| `grupo-calle` | 2.6 s |
| `calle-aldea` | 3.4 s |

## Alojamiento y equipaje

| Plano | Dura |
| --- | --- |
| `pazo-blanco` | 1.8 s |
| `hotel-arzua` | 1.6 s |
| `galeria-hotel` | 2.7 s |
| `salon-rustico` | 1.0 s |
| `habitacion-ventanal` | 2.1 s |
| `habitacion-granate` | 1.8 s |
| `habitacion-piedra` | 1.7 s |
| `habitacion-buhardilla` | 1.6 s |
| `techo-vigas` | 2.0 s |
| `bano-aseo` | 1.6 s |
| `bano-lavabo` | 1.6 s |
| `terraza-comida` | 2.2 s |
| `maletas-etiqueta` | 2.2 s |
| `maleta-concha` | 1.7 s |
