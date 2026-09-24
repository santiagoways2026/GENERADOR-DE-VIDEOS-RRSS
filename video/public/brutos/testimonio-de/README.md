# Planos del testimonio alemán

Tres planos del grupo de tres amigos, sacados del clip alemán que llegó de un
editor online. Van aparte de la biblioteca porque **no son planos recurso**:
son la gente de un testimonio concreto y sólo tienen sentido en su pieza.

| Plano | Dura | Del bruto | Resolución |
| --- | --- | --- | --- |
| `grupo-1` | 2,05 s | 7,20 – 9,25 | 692x1230 |
| `grupo-2` | 0,86 s | 33,67 – 34,53 | 692x1230 |
| `grupo-3` | 0,83 s | 48,77 – 49,60 | 692x1230 |

## De dónde salen esos tramos y no otros

El bruto trae **subtítulos alemanes pegados** en las filas 758 a 843, que son
el 60 % de alto, y una **marca de agua de clideo.com** en las filas 1237 a
1253, abajo a la derecha. Ninguna de las dos se puede quitar sin que se note.

- La marca de agua se va **recortando**: 692x1230 desde la esquina 14,0. Se
  pierde el 4 % del ancho y los pies, que no hacían falta.
- Los subtítulos no se pueden recortar, están en mitad del cuadro. Pero **no
  están siempre**: ocupan el 77 % del metraje y dejan huecos. Los tres planos
  salen de tres de esos huecos.

Los huecos se localizaron midiendo la **firma del rótulo**: un píxel muy claro
(por encima de 235) con uno muy oscuro (por debajo de 65) a menos de cuatro
píxeles en horizontal, que es lo que deja el borde negro de las letras. Contar
píxeles blancos a secas no vale: en ese plano los pantalones cortos son
blancos y caen justo en la banda del subtítulo. Medida contra los tres
recortes, la firma da **0**.

## Lo que hay que saber antes de usarlos

**La imagen no va sincronizada con el audio alemán.** Medido: el movimiento de
la zona de las bocas es el mismo cuando la pista tiene voz que cuando está en
silencio, 0,81 contra 0,73 y 0,98. El alemán es una locución puesta encima.
Por eso estos planos van cortos, de uno a dos segundos, y nunca sobre una
frase entera: a esa duración no se lee como un doblaje, se lee como un plano
de los clientes.
