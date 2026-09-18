---
name: reel
description: Montar un reel de Santiago Ways en Remotion, desde el guion y los brutos hasta el MP4. Úsala cuando alguien pida un reel, un vídeo para redes, una pieza vertical o adaptar una existente. Cubre el flujo entero: preparar metraje, sincronizar con la locución, aplicar las cartelas de marca y exportar.
---

# Montar un reel de Santiago Ways

Sigue este orden. Cada paso evita un error que ya se ha cometido antes.

## 1. Reunir el material

Pide, y no empieces a montar hasta tenerlo:

- **El guion**, con los mensajes en pantalla y el CTA.
- **La locución** en MP3, si la hay. Si no, el montaje se apoya solo en los
  rótulos y cada uno necesita medio segundo más en pantalla.
- **Los brutos.** Suelen ser compilaciones de tomas cortas, no clips sueltos.

## 2. Catalogar los brutos

Nunca cortes a ojo. Para cada archivo:

```bash
python3 herramientas/scripts/planos.py bruto.mp4
python3 herramientas/scripts/catalogar.py bruto.mp4 /tmp/hoja.jpg 5 3
```

El primero da los límites exactos de cada toma; el segundo, una hoja de
contactos para ver qué hay. **Ninguna toma suele pasar de 2,75 segundos**, así
que todo corte más largo cruza dos planos y produce un salto.

Extrae cada plano con 0,15 s de margen por dentro de sus límites:

```bash
ffmpeg -ss <inicio> -i bruto.mp4 -t <dura> -an -c:v libx264 -crf 21 \
  -preset medium -pix_fmt yuv420p video/public/brutos/<nombre>.mp4 -y
```

## 3. Revisar los encuadres verticales

Un bruto horizontal recortado a 9:16 pierde los laterales, y ahí suele estar
la gente. Genera un mosaico comparando el original con su recorte central y
mira plano a plano si se corta alguna cara. Donde pase, pon `encuadre` en la
lista de planos: `"34% 50%"` desplaza el recorte a la izquierda, `"62% 50%"` a
la derecha.

## 4. Sincronizar con la locución

Mide los silencios para localizar los arranques de frase:

```bash
ffmpeg -i locucion.mp3 -af silencedetect=noise=-30dB:d=0.28 -f null - 2>&1 \
  | grep -E 'silence_(start|end)'
```

Cada bloque del reel arranca en el final de una de esas pausas, de modo que la
imagen cambia justo cuando la voz empieza a decir lo que ilustra. Esos tiempos
van al array `B` de la composición.

## 5. Montar

Usa `Planos` para encadenar las tomas de cada bloque: reparte la duración en
proporción a lo que dura cada una, así ninguna se estira de más. Basta con que
la suma de las tomas cubra el bloque.

Reglas de contenido:

- **Pocas cartelas.** Si el bloque lleva un gráfico, el gráfico ya trae su
  titular.
- **Ninguna toma repetida** entre bloques contiguos.
- **Un gráfico no tapa una cara**: si el plano tiene gente en el centro, va
  donde el gráfico ya se ha retirado.
- El texto arriba, los gráficos abajo.
- Un solo CTA, al final.

## 6. Cerrar

El cierre es siempre igual: degradado entre los verdes de la paleta, el logo
en blanco y la web en Manrope debajo. Nada más.

## 7. Exportar y revisar

```bash
cd video && npx remotion render <Composicion> salida.mp4 --crf=23
```

Antes de darlo por bueno, saca una hoja de contactos del resultado y
compruébala: es la forma rápida de ver un plano cruzado, un texto ilegible o
un gráfico que tapa lo que no debe.

```bash
python3 herramientas/scripts/catalogar.py salida.mp4 /tmp/control.jpg 6 2
```

## Componentes disponibles

| Componente | Para qué |
| --- | --- |
| `Cartela` | Texto de marca: placa blanca sobre placa olivo, con barrido |
| `Bullets` | Lista de servicios, entrando de uno en uno |
| `Clip` y `Planos` | Metraje encajado en vertical, con encuadre y zoom lento |
| `Logo` | El archivo oficial, en blanco o verde |
| `Calendario` | Julio de 2027 con el 25 en domingo. La semana abre en lunes o en domingo, según el mercado |
| `LineaTiempo` | Años Santos, con la vieira que se detiene en 2027 |
| `MapaRutas` | Las rutas convergiendo en Santiago, trazándose una a una |
| `PuertaSanta` | La Puerta Santa, tapiada y abriéndose |
| `CajaDato` | Una cifra con su fuente debajo |
| `Candado` | Precio bloqueado, sin cifras |
| `Cierre` | Degradado, logo y web |

Las reglas de marca completas están en `CLAUDE.md`.
