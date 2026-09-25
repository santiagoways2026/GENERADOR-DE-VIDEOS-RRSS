# Santiago Ways · Vídeo de marca

Los vídeos de marca escritos como código, para dejar de rehacerlos a mano cada
vez. Cambiar un dato es editar una línea y volver a exportar.

## Lo que se hace aquí

Cuatro cosas, y cada una se pide por su nombre:

| Se pide | Qué es |
| --- | --- |
| Un **short** | Divulgación en inglés, una presentadora a cámara respondiendo una pregunta. Vertical |
| Un **testimonio** | Un cliente contando su viaje, en su idioma. Normalmente vertical |
| Un **vídeo horizontal** | La línea editorial, para YouTube. El modelo está por cerrar |
| **Metraje** | Sacar planos de un bruto, reescalar, quitar marcas de agua, pasar a vertical |

La receta de cada una está en [CLAUDE.md](CLAUDE.md), que es lo que lee Claude
al abrir una sesión aquí.

## Empezar

```bash
git clone https://github.com/santiagoways2026/GENERADOR-DE-VIDEOS-RRSS
cd GENERADOR-DE-VIDEOS-RRSS/video
npm install
npm run dev
```

`npm run dev` abre Remotion Studio: la preview con línea de tiempo. Los textos
se editan desde la interfaz y se escriben solos en el código.

Para exportar, con el `id` que sale en Studio:

```bash
npx remotion render SWShortDuracionEN salida.mp4
python3 ../herramientas/scripts/entregar.py salida.mp4
```

El segundo paso no es opcional: el render sale con el audio 43 ms por detrás.

## Qué hay aquí

| Carpeta | Contenido |
| --- | --- |
| `video/src/shorts/` | Los shorts |
| `video/src/testimonios/` | Los testimonios, verticales y horizontales |
| `video/src/horizontales/` | La línea editorial y sus miniaturas |
| `video/src/componentes/` | Lo que comparten las tres líneas |
| `video/src/archivo/` | Piezas de antes de que hubiera líneas |
| `video/public/brutos/` | 154 planos recurso, con su índice |
| `docs/` | La guía de marca y una tabla de edición por pieza |
| `herramientas/scripts/` | Las herramientas, con su README |
| `herramientas/motion-kit/`, `herramientas/mapas-vfx/` | El kit de marca y los mapas animados |

## Para el equipo de redes

Si no vas a tocar código, no necesitas clonar nada: entra en **claude.ai/code**,
elige este repositorio y pide el vídeo por escrito. Está explicado en
[docs/como-pedir-un-video.md](docs/como-pedir-un-video.md).

## Trabajar con Claude Code

El repositorio lleva `CLAUDE.md`, con las reglas de marca y las de montaje, y
una skill de proyecto en `.claude/skills/reel/`. Cualquiera del equipo puede
abrir una sesión aquí y pedir una pieza: las reglas se aplican solas.

```
/reel
```

También están instaladas las skills oficiales de Remotion, así que no hace
falta saber Remotion para pedir cambios.

## El metraje

Los planos recortados que usa cada pieza viven en `video/public/brutos/`, con
su índice. Los brutos completos y los montajes de origen no están en el
repositorio: pesan mucho y se sustituyen a menudo. Cada tabla de edición
explica cómo rehacer el archivo base de su pieza.

## Piezas montadas

| Composición | Qué es |
| --- | --- |
| `SWShortCompostelaEN` | Short · «What is the Camino de Santiago?» |
| `SWShortDuracionEN` | Short · «How long does it take to walk the Camino?» |
| `SWReelCaminoES` | Testimonio vertical en español |
| `SWReelAsistenciaES` | Testimonio vertical en español, la pareja |
| `SWReelGrupoES` | Testimonio vertical en español, el grupo |
| `SWReelCaminoDE` | Testimonio vertical en alemán |
| `SWReelHotelesEN` | Testimonio vertical en inglés |
| `SWSocialCaminoES` | Testimonio horizontal para redes |
| `SWCaminoStoriesEN` | Horizontal editorial para YouTube |
| `SWMiniaturaEN` | Miniatura de YouTube |
| `SWMuestraFuentes` | Muestra de las tres tipografías oficiales |
| `ReelXacobeo` | Archivo: reel del Año Santo 2027, con locución |
| `Grafico` | Archivo: banco de pruebas de los gráficos |
