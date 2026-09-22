# Santiago Ways · Vídeo

Producción de vídeo de marca escrita como código, con Remotion. Sustituye al
montaje manual en Canva para las piezas que se repiten: reels, cartelas,
mapas de ruta y gráficos de dato.

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `video/` | El proyecto Remotion. Aquí se monta y se exporta |
| `docs/` | La guía de marca oficial, edición 2026 |
| `herramientas/mapas-vfx/` | Los dos configuradores de mapas animados |
| `herramientas/motion-kit/` | El kit de cartelas y overlays |
| `herramientas/scripts/` | Utilidades para preparar metraje |

## La marca, en lo que afecta al vídeo

Los tokens están en `video/src/brand/theme.ts`. Ese archivo es la traducción
de la guía; si la guía cambia, se cambia ahí y nada más.

Reglas que condicionan cada pieza:

- El protagonista es el verde olivo `#7AA606`. Blanco más verde en la mayoría.
- Lima `#B0F808` y bosque `#184834` son complementarios, de uso puntual.
- Nada de negro puro: la tinta es el bosque.
- Texto blanco sobre olivo. Texto bosque sobre lima. Siempre.
- La marca nunca se escribe como texto. Se usa el archivo de logo.
- Un solo CTA por pieza.
- Movimiento: fade más desplazamiento corto con `cubic-bezier(0.22,0.61,0.36,1)`.
  Nunca rebote.
- Tipografía: Montserrat, Manrope, Poppins. Empaquetada con el proyecto.
- Formatos: 1080x1920 reels, 1080x1080 feed, 1280x720 YouTube. Márgenes 56 px
  como mínimo.

## Cómo se ven los textos

Las cartelas replican las del kit de motion graphics, no se inventan:

- Placa blanca arriba con el dato en bosque, peso 800, esquinas `6px 6px 0 0`.
- Placa olivo debajo con el complemento en blanco, esquinas `0 6px 6px 6px`.
  **En mayúsculas y peso negro**, nunca en minúsculas.
- Entran con barrido lateral (`clip-path`), 27 fotogramas, con 14 de relevo
  entre placas. No con un fundido.
- Pocas por pieza. Si el bloque lleva un gráfico, el gráfico ya trae su
  titular y la cartela sobra.

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
- Las fuentes se empaquetan con `@fontsource`, no se descargan de Google: así
  el render sale igual en cualquier máquina y funciona sin conexión.

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
python3 herramientas/scripts/marca-agua.py viejo.mp4 limpio.mp4 \
    --zona 410,290,230,70 --desde 1.335 --hasta 59.27   # quitar un logo pegado
```

`--zona` es la esquina donde vive el logo, con margen de sobra: no hace falta
afinarla, el script encuentra la silueta dentro. `--desde` y `--hasta` marcan
por dónde cortar las cartelas.

Los planos recortados viven en `video/public/brutos/`. Los brutos completos no
entran en el repositorio: pesan y se sustituyen a menudo.

Hay dos juegos de planos y conviene saber cuál se coge:

| Carpeta | Qué es | Resolución |
| --- | --- | --- |
| `brutos/` | Los 29 planos del reel original | 1920x1080 |
| `brutos/testimonios/` | 83 planos recurso de las piezas de testimonios | 1280x720 |

Los de `testimonios/` dan variedad, sobre todo de alojamiento, gastronomía y
llegada a Santiago, pero son de menos resolución: para un primer plano grande o
un encuadre que recorte mucho, mejor los de 1080p. Se usan poniendo la
subcarpeta delante, `src: "testimonios/prado-flores"`, porque `Planos` compone
la ruta sola. La lista completa, agrupada por tema, está en el README de esa
carpeta.

### Reaprovechar piezas antiguas

Las piezas viejas de la agencia llevan el logo pegado en una esquina durante
todo el metraje y cartelas de marca al principio y al final. `marca-agua.py`
aprende el logo del propio vídeo, dibuja su silueta y la rellena con lo que hay
alrededor, y de paso recorta por donde se le diga.

Hay dos modos y **el bueno es `--modo recorte`**, que es el que va por defecto:
saca la marca de cuadro cortando por el borde que menos imagen se lleva y
devuelve el formato original con un zoom corto. Sale limpio del todo. En la
pieza de 640x360 se comió el 12% por abajo.

`--modo relleno` mantiene el encuadre y reconstruye el hueco. Se usa solo si la
composición no aguanta perder ese borde, porque sobre fondos con mucho
contraste, un bosque a contraluz o la fachada de la catedral, deja una banda
blanda que se ve.

Un aviso más, por no repetir el trabajo: **no se puede deshacer la mezcla.** Se
probó, que sería lo elegante. Como el logo es casi opaco, dividir por
`1 - alfa` multiplica por ocho el ruido de compresión y salen colorines.

## Lo que no se hace

- Contadores de cuenta atrás ni "últimas plazas".
- Cifras sin fuente en pantalla, sobre todo en piezas ancladas mucho tiempo.
- Promesas de precio que no se puedan sostener.
- Gradientes ajenos a la marca, glassmorphism, texturas digitales abstractas.
- Fotografía en blanco y negro, sobresaturada, con grano o de stock genérico.
