# Planos del testimonio alemán

Un plano del grupo de tres amigos, sacado del clip alemán que llegó de un
editor online. Va aparte de la biblioteca porque **no es un plano recurso**:
es la gente de un testimonio concreto y sólo tiene sentido en su pieza.

| Plano | Dura | Del bruto | Resolución |
| --- | --- | --- | --- |
| `grupo` | 1,70 s | 7,25 – 8,95 | 692x1230 |

Es el único tramo del bruto en el que no hay rótulo en pantalla y que pasa de
segundo y medio. Los otros huecos del grupo se quedan en medio segundo largo.

## De dónde salen esos tramos y no otros

El bruto trae **subtítulos alemanes pegados** en las filas 758 a 843, que son
el 60 % de alto, y una **marca de agua de clideo.com** en las filas 1237 a
1253, abajo a la derecha. Ninguna de las dos se puede quitar sin que se note.

- La marca de agua se va **recortando**: 692x1230 desde la esquina 14,0. Se
  pierde el 4 % del ancho y los pies, que no hacían falta.
- Los subtítulos no se pueden recortar, están en mitad del cuadro. Pero **no
  están siempre**: ocupan el 77 % del metraje y dejan huecos. Los tres planos
  salen de tres de esos huecos.

Los huecos se localizan midiendo la **firma del rótulo**. Y la firma tiene que
mirar dos cosas, no una:

- un píxel muy claro (por encima de 225) con uno muy oscuro (por debajo de 75)
  a menos de cinco píxeles en horizontal, que es el borde negro de las letras
  blancas;
- y un píxel del **verde del rótulo**, RGB 88, 118, 49, con el mismo borde
  oscuro al lado.

Sin la segunda parte se cuela la palabra resaltada, que va en verde y no
dispara un detector de blanco: en la primera versión de la pieza entraba un
«WIR» en los últimos ocho fotogramas del plano, 433 píxeles verdes donde el
resto tenía 8. Y contar píxeles blancos a secas tampoco vale, porque en ese
encuadre los pantalones cortos son blancos y caen justo en la banda.

La hierba, que también es verde, no dispara la firma porque no tiene nada
negro pegado. Medida contra el recorte final, la firma máxima es **16**,
contra los miles que da un rótulo.

## Lo que hay que saber antes de usarlos

**La imagen no va sincronizada con el audio alemán.** Medido: el movimiento de
la zona de las bocas es el mismo cuando la pista tiene voz que cuando está en
silencio, 0,81 contra 0,73 y 0,98. El alemán es una locución puesta encima.
Por eso el plano va corto, 1,7 segundos, y no cae sobre una frase entera: a
esa duración no se lee como un doblaje, se lee como un plano de los clientes.
