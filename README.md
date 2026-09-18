# Santiago Ways · Vídeo de marca

Los vídeos de marca escritos como código, para dejar de rehacerlos a mano cada
vez. Cambiar un dato es editar una línea y volver a exportar, y la misma pieza
sale en los tres formatos sin recomponerla.

## Empezar

```bash
git clone https://github.com/santiagoways2026/centrodecontrol
cd centrodecontrol/video
npm install
npm run dev
```

`npm run dev` abre Remotion Studio: la preview con línea de tiempo. Los textos
se editan desde la interfaz y se escriben solos en el código.

Para exportar:

```bash
npx remotion render ReelXacobeo salida.mp4
```

## Qué hay aquí

| Carpeta | Contenido |
| --- | --- |
| `video/` | El proyecto Remotion: escenas, componentes y tokens de marca |
| `docs/` | La guía de marca oficial, edición 2026 |
| `herramientas/mapas-vfx/` | Los configuradores de mapas animados de rutas |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para catalogar y cortar metraje |

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
| `ReelXacobeo` | Reel del Año Santo 2027, vertical, con locución |
| `Grafico` | Banco de pruebas para ver cada gráfico aislado |
