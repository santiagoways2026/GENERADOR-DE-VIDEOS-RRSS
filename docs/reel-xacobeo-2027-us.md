# Reel Xacobeo 2027 · mercado US

Pieza en inglés para público estadounidense. No es la versión española
traducida: aquella da por sabido qué es el Camino y esta no da nada por
sabido. De ahí que dure el doble.

- **Composición:** `ReelXacobeoUS` · 1080x1920 · 30 fps · 60,5 s
- **Locución:** `video/public/locucion-en.mp3` (ElevenLabs, voz Lara)
- **Música:** `video/public/musica.mp3`, entrando por el segundo 51,55
- **Salida:** `salidas/reel-xacobeo-2027-us.mp4`

```bash
cd video
npx remotion render ReelXacobeoUS ../salidas/reel-xacobeo-2027-us.mp4 --crf=23
```

## Cómo está montado

Los cortes caen en los arranques de frase de la locución, medidos así:

```bash
npx remotion ffmpeg -i public/locucion-en.mp3 \
  -af silencedetect=noise=-30dB:d=0.28 -f null -
```

Esos tiempos viven en el array `B` de `video/src/ReelXacobeoUS.tsx`. Si se
regenera la locución, se vuelven a medir y se sustituyen: no hay nada más
que tocar.

| Desde | Bloque | En pantalla | Qué hace |
| --- | --- | --- | --- |
| 0:00 | Una puerta | Holy Year 2027 · Camino de Santiago | Titula la pieza. El gancho lo hace la voz |
| 0:06 | Mapa de rutas | 1,000 years of pilgrimage | Sitúa Galicia y enseña que son varias rutas |
| 0:15 | Calendario | July 2027 · July 25 falls on a Sunday | La regla del Año Santo, de un vistazo |
| 0:18 | Puerta Santa | This is a Holy Year | Sealed → Open sobre la palabra "unsealed" |
| 0:23 | Años Santos | 2021 · 2027 · 2032 · 2038 | 2032 se enciende con la cifra |
| 0:29 | Un Año Santo se nota | The Camino at its most alive | Manda el metraje |
| 0:35 | Obradoiro | — | La llegada a la plaza. Sin texto: es donde más trabaja la locución |
| 0:40 | Servicio | Cuatro tarjetas con check | El bloque premium, once segundos |
| 0:52 | Una mochila | You walk. We handle the rest | Remate del servicio |
| 0:54 | Plazas contadas | — | La mesa del pazo y, de remate, el peregrino celebrando la llegada |
| 0:57 | Cierre | — | Logo y web. Sin llamada a la acción: la pone quien publica |

Cada tarjeta de servicio entra sobre la frase que la nombra, y el plano
enseña de qué habla: las maletas con etiqueta salen en "your luggage moved
ahead every morning", el mostrador en "a dedicated advisor".

Ninguna toma baja de 1,2 segundos en pantalla. Como los brutos son cortos
(el más largo dura 2,27 s) y la pieza dura un minuto, cubrir cada bloque con
tomas a velocidad normal obligaba a picarlo en cinco o seis planos y se
notaba. La salida es el campo `ritmo` de `Planos`: por debajo de 1 la toma
rinde más tiempo del que dura, sin congelarse ni invadir el plano siguiente
del bruto. Se usa entre 0,7 y 0,9, salvo el plano de las maletas, que va a
0,44 porque es un detalle casi quieto y aguanta el ralentí.

Antes de renderizar conviene pasar el revisor, que comprueba las cuatro
cosas que han salido mal alguna vez:

```bash
python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeoUS.tsx
```

## La música

La cama entra por el final del tema, no por el principio. La canción dura
116 s y se apaga sola entre el segundo 106 y el 112; el resto es silencio.
Arrancando en 51,55 s ese fundido cae justo en el cierre de marca, y el
tramo pleno coincide con la parte que más pesa, de la explicación a la
llegada a la plaza. No hace falta inventarse un fundido: la canción trae el
suyo y encaja.

Va a 0,14 de volumen, unos 15 dB por debajo de la locución: se oye en los
silencios de la voz y no compite con ella. Si se cambia de tema hay que
volver a mirar dónde empieza su fundido, que es lo que fija el punto de
entrada.

## Caption

> 2027 is a Holy Year on the Camino de Santiago. The next one isn't until 2032.
>
> Here's what that means. For over a thousand years, pilgrims have walked
> across northern Spain to the cathedral in Santiago de Compostela. Whenever
> July 25 falls on a Sunday, the Church declares a Jubilee, or Holy Year, and
> the cathedral's Holy Door, sealed the rest of the time, is opened for
> pilgrims to walk through.
>
> 2027 is one of those years. It happens roughly once a decade.
>
> A Holy Year Camino is the Camino at its fullest: the cathedral packed for
> the pilgrim's mass, the botafumeiro swinging, and a square full of people
> who just finished the walk of their lives.
>
> We've been guiding this route for years, and we plan it end to end:
> ✓ Handpicked hotels, country houses and historic inns, chosen one by one
> ✓ Your luggage moved to the next hotel every morning
> ✓ A dedicated trip advisor who has walked the route
> ✓ 24/7 support in English while you're on the way
> ✓ Routes, distances and documents arranged before you land
>
> You walk. We handle everything else.
>
> One honest note: the best places on each stage are small family-run houses
> with a handful of rooms, and Holy Year books out far in advance. Reserving
> now means you choose your dates, your pace and your hotels, at today's rate.
>
> 👉 Tap the link in bio to plan your 2027 Camino, or comment CAMINO and we'll
> send you the routes.
>
> Save this for when you're ready. 👇

**Hashtags:** #CaminoDeSantiago #HolyYear2027 #JacobeanYear #CaminoFrances
#SantiagoDeCompostela #PilgrimageTravel #BucketListTravel #SlowTravel

**Texto alternativo:** Pilgrims arriving at the cathedral square in Santiago
de Compostela during the 2027 Holy Year.

## Publicación

1. Programar entre las 18:00 y las 21:00 hora del Este, que en España es de
   medianoche a las 03:00. No publicar a mano.
2. Va en el perfil en inglés. Si no lo hay, con audiencia segmentada en la
   promoción de pago: mezclar los dos idiomas en un mismo perfil confunde al
   algoritmo y al usuario.
3. Anclarlo en primera posición: hace de vídeo explicativo para quien llega
   nuevo.
4. Público frío de Estados Unidos, 45 a 70 años, viaje internacional,
   senderismo suave, espiritualidad y catolicismo, y similares a la lista de
   clientes. Guardar como retargeting a quien lo vea más del 50 %.
5. Mejor ventana de octubre a febrero: el americano reserva entre 9 y 12 meses
   antes y decide en otoño e invierno.

## Respuestas preparadas

| Comentario | Respuesta |
| --- | --- |
| Do I have to be religious? | Not at all. Many of our travelers walk it for the history, the landscape or simply the time to think. The route welcomes everyone. |
| How far do you walk each day? | We build it around you. Most itineraries run 12 to 20 km a day, and we can shorten any stage. Your bags travel separately. |
| Is it safe to walk alone? | It's one of the safest long walks in Europe, and you're never far from other pilgrims. You'll also have our team on call 24/7. |
| How much does it cost? | It depends on the route and the number of nights. Send us a message and we'll put together a plan and a firm price, held at today's rate. |
| Isn't it crowded in a Holy Year? | There's more life on the route, which is part of the magic. We book our hotels months ahead and can suggest quieter routes and shoulder-season dates. |

Nada de precios ni descuentos en el caption ni en comentarios. Si alguien
pregunta, se lleva a mensaje directo.

## Decisiones que conviene no deshacer

- **El rótulo de entrada titula, la voz engancha.** En pantalla se lee
  «Holy Year 2027 · Camino de Santiago»: lo que hace única a la fecha en la
  placa blanca y el nombre de la ruta debajo. Mientras, la locución habla de
  una puerta que se abre, que es lo que para el scroll.
- **Sin marca de agua.** El logo va solo en el cierre, que ya es todo marca.
- **Los gráficos son la parte didáctica, no decoración.** Sin el mapa el
  espectador no sabe dónde está Galicia; sin el calendario no entiende la
  regla del Jubileo. Si hay que recortar, se recorta otra cosa.
- **Ningún topónimo salvo Santiago de Compostela.** Al público americano se le
  pierde con etapas, kilómetros y nombres de pueblos. Por eso se descartó el
  plano del cartel de Portomarín, que era el único con un topónimo legible.
- **El argumento para reservar aparece una sola vez, al final, y va ligado a
  la calidad del alojamiento**, no al miedo a quedarse fuera ni al precio.
  Lo dice la locución; en pantalla no hay ninguna llamada a la acción.
- **El cierre va limpio.** Solo el logo y la web. La llamada a la acción la
  pone quien publica, por encima del vídeo o en el pie, que es donde se puede
  cambiar sin volver a exportar.
- **Lo último antes del logo es una cara, no un sitio.** El peregrino
  celebrando la llegada, a medio tiempo. Un plano de alojamiento informa;
  este es el que se recuerda.
- **Ni una palabra de descuento.** La exclusividad es honesta: las mejores
  casas de cada etapa tienen pocas habitaciones y en Año Santo se agotan.
- **El alojamiento se enseña por la fachada y por la mesa**, no por la vista.
  Se descartó el plano de la terraza: es medio cielo vacío, sillas de
  plástico, y repetía el mismo embalse que ya se ve por la ventana de la
  habitación.
- **La semana del calendario empieza en domingo.** Un americano lee la
  cuadrícula así, y el gráfico existe para leerse de un vistazo.
- **La Puerta Santa son dos hojas que se abren.** Se probó antes con el muro
  de sillares que de verdad la tapia y se derriba cada Año Santo, pero en
  pantalla no se leía: unos bloques que se desvanecen no dicen «puerta». Dos
  hojas abriéndose las entiende cualquiera sin pensar, que es lo que hace
  falta en cinco segundos.

## Datos en pantalla

No aparece ninguno. Nada que fechar ni que envejezca en una pieza que va a
estar anclada meses.

Datos disponibles por si se hace una variante, siempre con la fuente escrita
en la propia tarjeta:

- Los estadounidenses son ya la primera nacionalidad extranjera del Camino y
  siguen creciendo: 7,98 % de los peregrinos en 2024, 8,28 % en 2025 y 9,75 %
  en lo que va de 2026, por delante de Italia, Alemania y Portugal.
- 530.987 Compostelas en 2025, récord histórico, con un 57 % de peregrinos
  internacionales.
- Próximos Años Santos: 2027, 2032, 2038 y 2049.

## Pendiente

- **Metraje que falta.** El briefing pide botafumeiro, Puerta Santa real,
  interior de la catedral en misa del peregrino y planos de mesa y de pazo sin
  gente. No hay nada de eso en el repositorio. La Puerta Santa se resolvió con
  una ilustración animada, que además permite enseñar los dos estados; el
  resto se cubrió con lo que había.
- **Nombres de brutos cambiados.** `interior-velas` es un sendero y
  `iglesia-exterior` es un interior con velas. Al montar se eligió por lo que
  se ve, no por el nombre del archivo. Conviene renombrarlos algún día, junto
  con la pieza española que los usa.
