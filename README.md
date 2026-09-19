# Santiago Ways · Vídeo de marca

Los vídeos de marca escritos como código, para dejar de rehacerlos a mano cada
vez. Cambiar un dato es editar una línea y volver a exportar, y la misma pieza
sale en los tres formatos sin recomponerla.

## Empezar

```bash
git clone https://github.com/santiagoways2026/GENERADOR-DE-VIDEOS-RRSS
cd GENERADOR-DE-VIDEOS-RRSS/video
npm install
npm run dev
```

`npm run dev` abre Remotion Studio: la preview con línea de tiempo. Los textos
se editan desde la interfaz y se escriben solos en el código.

Para exportar:

```bash
npx remotion render ReelXacobeoUS salida.mp4
```

## Qué hay aquí

| Carpeta | Contenido |
| --- | --- |
| `video/` | El proyecto Remotion: escenas, componentes y tokens de marca |
| `docs/` | La guía de marca, las decisiones de producción y la ficha de cada pieza |
| `herramientas/mapas-vfx/` | Los configuradores de mapas animados de rutas |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para catalogar metraje, elegir encuadres y revisar montajes |

## Para el equipo de redes

Si no vas a tocar código, no necesitas clonar nada: entra en **claude.ai/code**,
elige este repositorio y pide el vídeo por escrito. Está explicado en
[docs/como-pedir-un-video.md](docs/como-pedir-un-video.md).

## Trabajar con Claude Code

El repositorio lleva `CLAUDE.md`, con las reglas de marca y las de montaje, y
una skill de proyecto en `.claude/skills/reel/`. Cualquiera del equipo puede
abrir una sesión aquí y pedir un reel: las reglas se aplican solas, sin tener
que explicarlas otra vez.

```
/reel
```

También están instaladas las skills oficiales de Remotion, así que no hace
falta saber Remotion para pedir cambios.

## El metraje

Los planos recortados que usa cada pieza viven en `video/public/brutos/`. Los
brutos completos no están en el repositorio: pesan mucho y se sustituyen a
menudo. Para preparar material nuevo, mira el paso 2 de la skill `reel`.

## Piezas montadas

| Composición | Qué es |
| --- | --- |
| `ReelXacobeo` | Reel del Año Santo 2027 en español, vertical, 33 s |
| `ReelXacobeoUS` | El mismo Año Santo para el mercado estadounidense, en inglés, 60 s. Dura el doble porque no da por sabido qué es el Camino. Ficha en [docs/reel-xacobeo-2027-us.md](docs/reel-xacobeo-2027-us.md) |
| `Grafico` | Banco de pruebas para ver cada gráfico aislado |

## Antes de dar una pieza por buena

```bash
python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeoUS.tsx
```

Comprueba que ninguna toma se congela, que ninguna baja del mínimo legible y
que no se repite ninguna entre bloques contiguos. Después, una hoja de
contactos del MP4 exportado: hay fallos que renderizan sin dar ningún error y
solo se ven mirando.
