# Accesibilidad de la paleta en vídeo

Medición de contraste de los tokens de marca con la fórmula de la WCAG, hecha
porque el 69 % de la audiencia del canal tiene 55 años o más y el 88 % pasa de
45.

## Por qué importa aquí más que en web

La [revisión de literatura del W3C sobre usuarios mayores](https://www.w3.org/WAI/older-users/literature/)
recoge que una persona de 80 años tiene en torno a un 80 % menos de
sensibilidad al contraste que una de 20, y que el deterioro visual suele
empezar a mediados de los cuarenta. El propio W3C explica que el umbral de
4,5:1 se eligió para compensar una pérdida equivalente a una visión de 20/40, y
el de 7:1 para una de 20/80.
[Understanding SC 1.4.3](https://w3c.github.io/wcag/understanding/contrast-minimum) ·
[Understanding SC 1.4.6](https://w3c.github.io/wcag/understanding/contrast-enhanced)

Umbrales: 4,5:1 para texto normal, 3:1 para texto grande (18 pt, o 14 pt en
negrita), 7:1 para el nivel AAA.

## Resultados

| Combinación | Ratio | Nivel |
| --- | --- | --- |
| Bosque sobre blanco | 10,42:1 | AAA |
| Blanco sobre bosque | 10,42:1 | AAA |
| Bosque sobre crema | 9,81:1 | AAA |
| Blanco sobre la placa bosque de subtítulos | 9,80:1 | AAA |
| Bosque sobre lima | 8,08:1 | AAA |
| Blanco sobre verde oscuro `#668814` | 4,12:1 | solo texto grande |
| **Blanco sobre olivo `#7AA606`** | **2,88:1** | **no llega a ninguno** |

## El problema

`CLAUDE.md` fija la regla como absoluta: "Texto blanco sobre olivo. Texto bosque
sobre lima. Siempre."

La segunda mitad de esa regla es excelente: bosque sobre lima da 8,08:1, nivel
AAA. La primera no llega. **Blanco sobre olivo se queda en 2,88:1, por debajo
incluso del umbral de 3:1 que se aplica al texto grande.** Se queda cerca, a un
4 % del listón, pero por debajo.

Esto afecta a la placa inferior de cada cartela, a la cabecera de los gráficos y
a cualquier texto blanco sobre un fondo olivo plano.

## Opciones, todas dentro de la paleta existente

Blanco sobre los verdes de `scale.green`:

| Token | Color | Ratio | Nivel |
| --- | --- | --- | --- |
| `scale.green[5]` (olivo) | `#7AA606` | 2,88:1 | no llega |
| `scale.green[6]` (greenDark) | `#668814` | 4,12:1 | texto grande |
| `scale.green[7]` | `#4F6B0F` | 6,10:1 | AA |
| `scale.green[8]` | `#38500B` | 9,05:1 | AAA |

Invertir la tinta, poniendo bosque sobre verde claro:

| Fondo | Ratio con bosque | Nivel |
| --- | --- | --- |
| `#E6F0CC` | 8,78:1 | AAA |
| `#CDE199` | 7,36:1 | AAA |
| `#7AA606` (olivo) | 3,61:1 | texto grande |

## Recomendación

No se toca el token `brand.green`: es la identidad y en fondos grandes, logo y
elementos no textuales funciona perfectamente. Lo que se propone es acotar su
uso **como fondo de texto**:

1. **Placas de cartela y cabeceras de gráfico con texto blanco:** usar
   `scale.green[7]` `#4F6B0F`, que da 6,10:1 y sigue leyéndose como el verde de
   la marca.
2. **Donde el olivo tenga que ser exactamente `#7AA606`:** poner el texto en
   bosque, no en blanco. Sube de 2,88 a 3,61 y entra en el umbral de texto
   grande.
3. **Subtítulos:** no tocar. La placa bosque translúcida ya da 9,80:1.
4. **Bosque sobre lima:** no tocar. Da 8,08:1.

Esta es una decisión de marca, no técnica, así que queda propuesta y no
aplicada. Mientras no se decida, las piezas siguen usando la regla actual.

## Lo que no se cambia por esto

El tamaño de letra. La [revisión sistemática de Hou et al. (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9376262)
sitúa el rango recomendado para personas mayores entre 14 y 22 pt, y advierte de
que por encima de aproximadamente un grado de ángulo visual la velocidad de
lectura también baja. Su conclusión literal es que "bigger may not always mean
better font sizes for older adults". Agrandar los rótulos por encima de lo
actual no ayudaría.
