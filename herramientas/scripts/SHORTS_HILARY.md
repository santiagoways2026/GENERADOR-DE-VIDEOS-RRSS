# Shorts verticales del vídeo largo de Hildary

Sacan 22 shorts de 30 a 55 s del vídeo "Camino Francés from Sarria" (inglés).

## Qué hace cada pieza

| Paso | Herramienta |
| --- | --- |
| Transcripción palabra a palabra | faster-whisper `medium.en` sobre el audio del vídeo limpio |
| Guion de montaje | `shorts_hilary.py`: resuelve cada frase a sus tiempos y escribe `video/src/shorts/shorts.json` |
| Recorte de Hildary sin fondo (gancho) | RobustVideoMatting, WebM VP9 con alfa en `video/public/hilary/recortes/` |
| Render | `render_shorts.sh`: Remotion y normalización a -14 LUFS |

## Medios que no están en el repositorio

Todo sale de la carpeta "Hilary" del Drive:

- `video/public/hilary/limpio.mp4`: "SW EN LIMPIO.mov" en H.264, GOP 15.
- `video/public/hilary/youtube.mp4`: "SANTIAGO WAYS GUIA COMPLETA EN(3).mov" en H.264, sin audio.
- `video/public/hilary/mapas/`: mapas verticales en inglés de `Camino Francés/ingles`.
- `video/public/musica/`: pistas de Kevin MacLeod (incompetech.com), CC BY 4.0.

## Montaje

- Voz siempre del vídeo limpio. Los cortes caen en los límites de palabra.
- El B-roll a pantalla completa del vídeo de YouTube se reaprovecha sincronizado
  con la voz; los mapas horizontales se cambian por sus versiones verticales.
- Cartelas y CTA: los PNG del kit, con el barrido lateral de 27 fotogramas.
- Cierre común: el final del vídeo largo ("leave them below… Buen Camino")
  con la barra de redes, el botón de suscripción y la web.
- Efectos de sonido sintetizados (`video/public/sfx/`), libres de derechos.

## Crédito obligatorio de la música

En la descripción de cada publicación:

> Music by Kevin MacLeod (incompetech.com), licensed under CC BY 4.0.
