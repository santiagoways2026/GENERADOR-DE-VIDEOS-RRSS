# Santiago Ways · Vídeo

Producción de vídeo de marca escrita como código, con Remotion. Sustituye al
montaje manual en Canva para las piezas que se repiten: reels, cartelas,
mapas de ruta y gráficos de dato.

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `video/` | El proyecto Remotion. Aquí se monta y se exporta |
| `docs/` | El Brandbook 2027, que manda, y la guía de 2026, ya superada |
| `herramientas/mapas-vfx/` | Los dos configuradores de mapas animados |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para preparar metraje |

## La marca, en lo que afecta al vídeo

Manda el **Brandbook 2027** (`docs/brandbook-2027.pdf`). Sustituye a la guía de
2026, que se conserva solo como histórico. Los tokens están en
`video/src/brand/theme.ts`: si el brandbook cambia, se cambia ahí y nada más.

Color, con paleta cerrada y sin escalas intermedias:

- Blanco `#FFFFFF` 50 %, verde Ways `#7AA606` 30 %, verde sendero `#506718`
  10 %, grafito `#2E2E2D` 7 %, apoyo 3 % (gris `#6F6F6E`, niebla `#E8E8E6`,
  brote `#FAFFEE`).
- **Lima y bosque ya no existen.** La tinta del texto es el grafito.
- Qué letra va sobre qué fondo: grafito sobre blanco para todo; sendero sobre
  blanco para titulares y palabras en verde; blanco sobre sendero para cajas
  oscuras; blanco sobre verde Ways **solo en negrita** (2,9:1); verde Ways
  sobre blanco nunca como texto. Nunca verde sobre verde.
- Degradado solo en cajas verde Ways: 135°, de `#7AA606` a `#628A04`, sutil.
  Todo lo demás, plano.
- Toda caja lleva sombra `0 8px 32px` grafito al 12 %. Botones, etiquetas y
  subrayados, sin sombra.

Tipografía:

- **Montserrat, una sola familia**, pesos 400 a 800. No hay 900 ni otras
  familias.
- **Titulares en ExtraBold (800)** y en minúscula de frase. Mayúsculas solo en
  antetítulos y etiquetas: 700 con +0,15 em.
- Interlineado 1,1 en titulares y 1,5 en texto.

Logo:

- La marca nunca se escribe como texto. Se usa el archivo de logo.
- En vídeo, **isotipo blanco como marca de agua arriba a la derecha**
  (`MarcaDeAgua`), desde 24 px y nunca sobre caras.
- Sobre blanco, en verde Ways; sobre cualquier otro fondo, en blanco.

Imagen y tono:

- Peregrinos reales y recursos propios, sin banco de imágenes. Buen tiempo,
  luz natural, caras felices. Se evitan el sufrimiento, las rampas duras y las
  mochilas enormes.
- Tono de experto cercano: ilusión, claridad y seguridad tranquila. Sin
  urgencia artificial, sin promesas absolutas, sin grandilocuencia.

Más reglas que siguen en pie:

- Un solo CTA por pieza.
- Movimiento: fade más desplazamiento corto con `cubic-bezier(0.22,0.61,0.36,1)`.
  Nunca rebote.
- Formatos: 1080x1920 reels, 1080x1080 feed, 1280x720 YouTube. Márgenes 56 px
  como mínimo.

## Cómo se ven los textos

Las cartelas son la pieza "Texto sobre vídeo" del brandbook:

- Titular en blanco, Montserrat ExtraBold, minúscula de frase.
- La palabra o las dos palabras que llevan la promesa van sobre el **subrayado
  Ways**: bloque verde Ways plano detrás del texto, girado -1,5°, sin
  redondeo ni sombra. Una vez por titular y un solo tipo por pieza.
- Antetítulo opcional encima, en etiqueta verde Ways, mayúsculas 700.
- Entran con barrido lateral (`clip-path`), 27 fotogramas, con 14 de relevo
  entre líneas. No con un fundido.
- Pocas por pieza. Si el bloque lleva un gráfico, el gráfico ya trae su
  titular y la cartela sobra.

El brandbook define cinco piezas de motion para YouTube: cabecera (logo y
web), capítulo (titular del bloque), etapa (tramo y km), texto sobre vídeo
(frase clave) y mapa (ruta y km recorridos).

El cierre de YouTube es una pantalla final **blanca** con logo y un único CTA
(`Cierre variante="blanco"`). En reels el cierre es opcional; si se pone, es la
caja verde con degradado, logo blanco y web.

El texto vive en la mitad superior. Los gráficos, en la inferior.

## Reglas de montaje aprendidas

Estas salieron de revisar piezas reales y ahorran repetir errores:

1. **Comprobar los planos antes de cortar.** Los brutos son compilaciones y
   ninguna toma pasa de 2,75 segundos. Un corte de cuatro segundos se come el
   plano siguiente y aparece un salto a mitad de escena.
   `python3 herramientas/scripts/planos.py bruto.mp4` da los límites exactos.
2. **Repartir la duración, no fijarla.** El componente `Planos` reparte el
   bloque en proporción a lo que dura de verdad cada toma, así ninguna se
   estira más allá de su final.
3. **Encuadrar cada plano.** Un bruto horizontal recortado a vertical pierde
   los laterales, y ahí es donde suele estar la gente. Revisar plano a plano y
   poner `encuadre` donde haga falta.
4. **Ninguna toma repetida entre bloques contiguos.** Al volver parece un
   error de montaje.
5. **Los cortes se apoyan en la locución.** Se miden los silencios del audio y
   cada bloque arranca cuando empieza la frase que ilustra.
6. **Un gráfico no puede tapar una cara.** Si el plano tiene gente en el
   centro, va donde el gráfico ya se ha retirado.

## Reglas técnicas de Remotion

- **Usar `OffthreadVideo`, no el `Video` de `@remotion/media`**: este último
  ignora `objectFit` y el clip sale en banda en lugar de recortado.
- Las animaciones CSS no se renderizan. Todo el movimiento sale de
  `interpolate()` sobre `useCurrentFrame()`.
- `interpolate` va dentro del `style`, para que se pueda editar desde Studio.
- Las escenas usan `Interactive.Div` para que los textos se puedan cambiar en
  Studio y se escriban solos en el código.
- Las fuentes viven en `video/public/fuentes` y se cargan con `FontFace` en
  `src/fuentes.ts`, importado en `Root.tsx`. No se descargan de Google.
- **`src/fuentes.ts` debe seguir listado en `sideEffects` de `package.json`.**
  Si no, el empaquetador lo elimina por no exportar nada y todo sale en la
  fuente de reserva sin ningún aviso. Pasó hasta noviembre de 2026: ningún
  render anterior salió en Montserrat.

## Comandos

```bash
cd video
npm install
npm run dev                                   # Studio, preview editable
npx remotion render ReelXacobeo salida.mp4    # Exportar
```

No hace falta pasar ninguna opción de navegador: `remotion.config.ts` detecta
un Chromium ya instalado si lo hay, que es lo que permite renderizar en las
sesiones de Claude Code en la web, donde la descarga del Chrome de Remotion
está bloqueada.

## Preparar metraje

```bash
python3 herramientas/scripts/planos.py bruto.mp4      # dónde empieza cada toma
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg   # verlo de un vistazo
```

Los planos recortados viven en `video/public/brutos/`. Los brutos completos no
entran en el repositorio: pesan y se sustituyen a menudo.

## Imágenes de etapa para la web

Mapa, tabla de servicios y perfil de cada etapa, en `video/src/graficos/etapa/`.

1. Configuración en `herramientas/scripts/etapas/<id>.json`: encuadre,
   municipios para pintar la costa, puntos y paradas. Con `relacion` se usa
   el trazado oficial del Camino en OpenStreetMap; con `enlace`, un tramo a pie
   desde el centro hasta donde empieza; con `capas`, ríos, autopistas y tren
   (la descarga tarda unos minutos y se guarda en `etapas/.cache/`).
2. `/usr/bin/python3 herramientas/scripts/mapa_etapa.py herramientas/scripts/etapas/<id>.json`
   escribe `video/src/datos/etapa-<id>.json` (costa, ruta, paradas y perfil).
3. Textos y servicios de cada etapa en `etapas.tsx`.
4. Exportar a 1200 px y pasar a WebP, que pesa unos 30 KB por imagen:
   `npx remotion still <Id> salida.png --scale=0.75` y convertir con PIL
   (`quality=82`). Remotion no exporta WebP directamente.

Mapa y perfil tienen dos estilos: `claro` (mar niebla, tierra blanca) y
`verde` (tierra en brote, agua en el token `mar` de `theme.ts`, ruta verde Ways
y solo ríos principales: sin arroyos ni carreteras, para que se lea bien).
El tono `mar` está fuera de la paleta y es solo para agua de mapas en color.

El mapa lleva siempre "© colaboradores de OpenStreetMap" (licencia ODbL) y el
perfil, la fuente de distancia y altitud.

## Lo que no se hace

- Contadores de cuenta atrás ni "últimas plazas".
- Cifras sin fuente en pantalla, sobre todo en piezas ancladas mucho tiempo.
- Promesas de precio que no se puedan sostener.
- Gradientes ajenos a la marca, glassmorphism, texturas digitales abstractas.
- Fotografía en blanco y negro, sobresaturada, con grano o de stock genérico.
