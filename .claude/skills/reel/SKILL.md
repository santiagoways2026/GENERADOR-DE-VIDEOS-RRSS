---
name: reel
description: Montar una pieza de vídeo de Santiago Ways con Remotion. Úsala cuando alguien pida un short, un testimonio, un vídeo horizontal, un reel o una pieza para redes, o cuando pida preparar metraje: sacar planos de un bruto, reescalar un clip, quitar una marca de agua o pasar algo a vertical.
---

# Montar una pieza de Santiago Ways

**Lo primero es saber qué se está pidiendo**, porque cada cosa se monta
distinto y mezclarlas es el error que más tiempo ha costado:

| Si piden | Es | Ve a |
| --- | --- | --- |
| Un **short** | Divulgación en inglés, presentadora a cámara, vertical | «Cómo se monta un short» en `CLAUDE.md` |
| Un **testimonio** | Un cliente contando su viaje, en su idioma | «Cómo se monta un testimonio» en `CLAUDE.md` |
| Un **vídeo horizontal** | La línea editorial. **El modelo está por cerrar**: pregunta antes de inventar | «Los vídeos horizontales» en `CLAUDE.md` |
| **Metraje**: brutos, reescalados, marcas de agua, encuadres | No es una pieza | El paso «Preparar metraje», abajo |

Si no queda claro cuál de las cuatro es, **pregúntalo antes de tocar nada**.
Un testimonio montado como short lleva las cartelas en el sitio equivocado y
hay que rehacerlo entero.

## Lo que vale para las tres líneas

Esto no cambia, se pida lo que se pida:

1. **Mira el clip antes de tocarlo.** Marca de agua, cortes propios, final, y
   la resolución. Todo se mide, nada se supone.
2. **Transcribe.** Los textos van sobre la frase que los sostiene, y eso sólo
   se sabe con los tiempos delante. En `CLAUDE.md`, «Lo que el entorno permite
   y lo que no» dice qué modelo se baja y de dónde.
3. **Ningún corte en un número redondo.** Se cuadra con los límites de plano
   de la base o con los huecos sin voz.
4. **El cuerpo del texto se mide**, con `fontTools` contra la fuente
   empaquetada, antes de dar un rótulo por bueno. Las líneas no se parten
   solas: se salen del lienzo.
5. **Cada encuadre se mira en un fotograma.** `encuadrar.py` propone, no
   decide: no sabe qué va a tapar la cartela ni qué tiene que entrar en cuadro.
6. **La placa de marca al final, siempre.** Ninguno de estos clips viene con
   logo ni con CTA, y sin eso la pieza no es de la marca.
7. **Antes de renderizar**, `comprobar-inserciones.py` y `planos-visibles.py`.
8. **Después de renderizar**, `entregar.py`. Sin excepción: el render sale con
   el audio 43 ms por detrás.

Y las 24 **reglas de montaje aprendidas** de `CLAUDE.md`, que son la memoria
de lo que ya salió mal una vez.

## Preparar metraje

```bash
python3 herramientas/scripts/planos.py bruto.mp4                  # límites de cada toma
python3 herramientas/scripts/catalogar.py bruto.mp4 hoja.jpg 5 3  # verlo de un vistazo
python3 herramientas/scripts/reescalar.py pequeno.mp4 grande.mp4  # subir a 1080x1920
python3 herramientas/scripts/encuadrar.py bruto.mp4               # a vertical
python3 herramientas/scripts/duplicados.py bruto.mp4 12.4,15.8    # ¿ya está en la biblioteca?
```

El índice completo, con qué hace cada una y por qué, está en
`herramientas/scripts/README.md`.

Para extraer un plano de un bruto, con 0,15 s de margen por dentro de sus
límites:

```bash
ffmpeg -ss <inicio> -i bruto.mp4 -t <dura> -an -c:v libx264 -crf 21 \
  -preset medium -pix_fmt yuv420p video/public/brutos/<nombre>.mp4 -y
```

**Antes de añadirlo a la biblioteca, pásale `duplicados.py`.** Hay 154 planos
y seis tomas que ya están dos veces; el índice de `video/public/brutos/` las
lista.

## Exportar

```bash
cd video && npx remotion render <IdDeLaComposicion> salida.mp4 \
  --color-space=bt709 --pixel-format=yuv420p --crf=16
python3 herramientas/scripts/entregar.py salida.mp4
```

El `id` sale en Studio y no cambia aunque el archivo se mueva de carpeta.
`entregar.py` cuadra el audio y deja al lado la copia comprimida para revisar;
el chat no admite más de 30 MiB por archivo.

## Componentes

| Componente | Para qué |
| --- | --- |
| `componentes/CartelaMarca.tsx` | De donde tiran las tres líneas: `Cartela`, `CierreMarca`, `PlacaMarca` |
| `componentes/Clip` y `Planos` | Metraje encajado, con encuadre y zoom lento |
| `componentes/Logo` | El archivo oficial, en blanco o verde |

En `video/src/archivo/` hay otro juego, el del reel del Xacobeo: `CartelaKit`,
`Bullets`, `Cierre` y los gráficos. **Ninguna pieza viva lo usa.** Si alguien
pide «las cartelas de la guía», conviene preguntar cuál de las dos.

Las reglas de marca completas están en `CLAUDE.md`, y la tabla de edición de
cada pieza entregada en `docs/`.
