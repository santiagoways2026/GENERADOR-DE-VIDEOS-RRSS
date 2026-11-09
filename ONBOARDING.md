# Santiago Ways · Shorts con Claude Code

Guía para seguir editando los shorts de la marca con Claude Code.

## Cómo se trabaja

1. Abre una sesión de Claude Code en el repositorio
   `santiagoways2026/GENERADOR-DE-VIDEOS-RRSS`, rama
   `claude/wizardly-edison-geqlax`.
2. Pásale a Claude el vídeo que quieres rehacer (el MP4 terminado) o el
   enlace de Drive de los brutos, y dile qué cambiar. Él identifica de qué
   short se trata, recupera el metraje, lo renderiza y te lo devuelve con
   su portada.
3. Todo se guarda y se sube a la rama solo; no hay que tocar código.

Las reglas de marca y de montaje están en `CLAUDE.md`: Claude las lee al
empezar. Si algo cambia, díselo y lo apunta ahí para siempre.

## Las tres series de shorts

| Serie | Datos del montaje | Componente | Brutos en Drive |
| --- | --- | --- | --- |
| Hildary (22 shorts en inglés) | `video/src/shorts/shorts.json` | `Short.tsx` | Carpeta "Hilary": vídeo limpio y guía completa |
| Xacobeo 2027 (Hildary, 10 shorts) | `video/src/xacobeo/xacobeo.json` | `ShortXacobeo.tsx` | `1fKcFbqBVo-O7cDr7eqBm84Qr_2Yw1E1p` |
| Equipo / Paula (en español) | `video/src/paula/equipo.json` | `ShortPaula.tsx` | `1n9zGZRiOE6f5mIESXBs7IQQhD8qkH2io` |

Stock y mapas: `17bxwyeK2PCzKj1tn6YWgrb5v0QMZJitN`. Fotos para portadas:
propias `14Zt6wd_1ctJq2x__1bvvPulmDBHdmd3U`, clientes
`1FuBc-gAoj-eQj_Dk6-wC1UTtS1yLDHnM`.

## Lo que se decidió (noviembre de 2026)

- Brandbook 2027 a rajatabla: Montserrat 800, titular en minúscula de frase
  con la parte clave en placa verde Ways.
- Sin fondo blanco al principio: se empieza con el plano real.
- Sin subtítulos mientras está el titular del principio.
- Subtítulos en mayúsculas y minúsculas, nunca todo en mayúsculas, y nunca
  encima de una cara.
- Cartelas sin placa blanca: dato en blanco y complemento en placa verde.
- Portada: foto propia a sangre y tarjeta blanca con la línea clave en
  verde y tres trazos de énfasis.

## Comandos (por si hace falta)

```bash
cd video && npm install
npm run dev                                   # Studio: editar textos a mano
npx remotion render Short-01-por-que-sarria out.mp4
```
