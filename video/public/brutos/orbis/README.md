# Planos recurso de la pieza vieja de la agencia

15 planos, 35 segundos en total, sacados de los dos brutos de un vídeo
antiguo que llevaba el logo de la agencia pegado arriba a la derecha.

**1280x720, sin pista de audio.** Son más pequeños que los brutos de la
carpeta raíz, que van a 1080p; para un primer plano grande tira de aquellos.

Se usan como cualquier otro bruto, poniendo la subcarpeta delante:

```tsx
{ src: "orbis/puente-medieval", dura: 1.8 }
```

## Cómo salieron

La marca vivía en `x 930-1247, y 20-75`, así que el encuadre se corta por
arriba y vuelve al 16:9 por los lados: `crop=1138:640:70:80` y de ahí a
1280x720. Se pierde el 11,1 % por cada lado, que es lo que cuesta sacar de
cuadro una marca pegada tan arriba. No hay subtítulos incrustados en el
original, sólo esa marca.

Fuera todos los planos con los dos entrevistados hablando a cámara, la
cartela de entrada y la de salida. Cada plano lleva un margen de 0,10 a
0,20 s por los dos lados, porque la entrada de la pieza es un encadenado
desde blanco y la salida un fundido, y sin margen se colaban fotogramas
lavados.

## Patrimonio y camino

| Plano | Dura |
| --- | --- |
| `catedral-quintana` | 3.0 s |
| `puente-medieval` | 3.9 s |
| `iglesia-espadana` | 3.7 s |
| `capilla-prado` | 3.2 s |
| `capilla-peregrino` | 1.1 s |
| `cruceiro-prado` | 1.9 s |
| `cruceiro-base` | 1.7 s |
| `piedra-ofrendas` | 1.9 s |
| `mural-estrellas` | 1.6 s |
| `panel-camino` | 2.4 s |

## Peregrinos

| Plano | Dura |
| --- | --- |
| `peregrinos-iglesia` | 2.4 s |
| `sendero-peregrinos` | 4.0 s |

## Alojamiento y equipaje

| Plano | Dura |
| --- | --- |
| `pazo-blanco` | 1.8 s |
| `galeria-hotel` | 2.7 s |
| `maletas-etiqueta` | 2.2 s |
