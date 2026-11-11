# Planes de montaje de testimonios

Cada plan describe una pieza: de qué vídeo sale la imagen, qué audio limpio
lleva, qué fragmentos del bruto horizontal entran y con qué corrección de
color. Las rutas son relativas a esta carpeta y esperan los brutos en
`brutos-originales/<testimonio>/`, que no entra en git.

```bash
python3 herramientas/scripts/montar_testimonio.py herramientas/scripts/planes/grace-armando-yt.json
```

## Grace y Armando

- `clientes.mp4`: bruto horizontal DJI 4K. Para trabajar se pasa antes a
  1080p y 30 fps (`master1080.mp4`), porque descodificar el HEVC de 10 bits
  en cada corte es muy lento.
- `vertical.mp4`: el vertical del móvil, 576x1024. Va 0,286 s por detrás del
  horizontal; ese desfase se midió correlando los dos audios.
- `voz2.wav`: la voz del horizontal, que lleva un micro de solapa por canal.
  Se limpia cada canal por separado (paso alto a 120 Hz y `afftdn`), se
  mezclan con prioridad al micro de quien habla para evitar cancelaciones,
  se ecualiza para dar presencia y se normaliza a -14 LUFS.
- `transcripcion.json`: faster-whisper `medium.en` con tiempos por palabra.
  Las palabras que entiende mal se corrigen en `correcciones` del plan
  ("Kamehameha" es Camino; "Waze", Ways).
- `voz3.wav`: la misma voz con la entrevistadora fuera. Ella no lleva micro,
  así que llega unos 15 dB más baja que ellos (-31 frente a -16 dB por
  palabra). Se mantienen a nivel todas las palabras que caen dentro de los
  fragmentos elegidos, que solo son respuestas suyas, y el resto se baja 12 dB
  con transiciones de 60 ms. Así sus «mhm» de fondo desaparecen sin que el
  ambiente de la plaza bombee.
- Las preguntas no entran en ningún fragmento: las dos piezas empiezan por
  «Hola, I'm Grace» y encadenan solo las respuestas.
