# Documentación

| Archivo | Contenido |
| --- | --- |
| `brandbook-2027.pdf` | **El sistema de diseño vigente.** Estrategia, logo, color, tipografía, imagen, tono y aplicaciones |
| `archivo/guia-de-marca-2026.html` | La edición anterior. Está sólo para entender las piezas de `video/src/archivo/` |
| `como-pedir-un-video.md` | Para quien no toca código: cómo pedir una pieza desde claude.ai/code |
| `decisiones.md` | Lo que se decidió y por qué, en orden |

Los tokens del brandbook están traducidos a código en
`video/src/brand/theme.ts`. Si la guía cambia, ese archivo es lo único que hay
que actualizar. Los de 2026 están congelados en
`video/src/archivo/theme-2026.ts` y no se usan en nada nuevo.

## Una tabla de edición por pieza

Cada pieza entregada deja su ficha: qué se cambió del clip de origen, con qué
números, por qué, y cómo rehacer su archivo base. **Antes de retocar una
pieza, se lee la suya.** Están ordenadas por línea:

| Carpeta | Línea | Piezas |
| --- | --- | --- |
| `shorts/` | Divulgación en inglés, presentadora a cámara | 2 |
| `testimonios/` | Un cliente hablando, vertical y horizontal | 6 |
| `horizontales/` | La editorial de YouTube | 1 |

La receta general de cada línea no está aquí, está en el `CLAUDE.md` de la
raíz: aquí va lo propio de cada pieza.

Los archivos de los shorts se llamaron `SW_Divulga_…` hasta que la línea tuvo
nombre corto; ahora son `SW_Short_…`.
