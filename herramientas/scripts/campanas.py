#!/usr/bin/env python3
"""Sintetiza un toque de campanas de catedral, sin muestras de terceros.

Cada golpe suma los parciales típicos de una campana de iglesia (hum, prime,
tierce menor, quinta, nominal y superiores), con caídas exponenciales más
largas en los graves. Dos campanas alternan; la reverberación se añade luego
con ffmpeg.

    python3 campanas.py salida.wav [duracion_s]
"""
import sys, wave
import numpy as np

SR = 48000
PARCIALES = [(0.5, 1.0, 7.0), (1.0, 0.8, 5.0), (1.2, 0.55, 3.5), (1.5, 0.35, 3.0),
             (2.0, 0.6, 2.5), (2.5, 0.25, 1.6), (3.0, 0.18, 1.2), (4.2, 0.08, 0.7)]


def golpe(f0, dur):
    t = np.arange(int(SR * dur)) / SR
    s = np.zeros_like(t)
    for rel, amp, tau in PARCIALES:
        # Ligera desafinación entre parciales: suena a bronce, no a órgano.
        s += amp * np.sin(2 * np.pi * f0 * rel * 1.0015 ** rel * t) * np.exp(-t / tau)
    ataque = np.minimum(1, t / 0.004)
    return s * ataque


def main():
    salida = sys.argv[1]
    dur = float(sys.argv[2]) if len(sys.argv) > 2 else 26
    n = int(SR * dur)
    mezcla = np.zeros((n + SR * 8, 2))
    t, k = 0.15, 0
    campanas = [(196.0, -0.25), (146.8, 0.25)]  # sol y re graves, una a cada lado
    while t < dur:
        f0, pan = campanas[k % 2]
        g = golpe(f0, 8)
        i = int(t * SR)
        mezcla[i:i + len(g), 0] += g * (1 - pan) * 0.5
        mezcla[i:i + len(g), 1] += g * (1 + pan) * 0.5
        t += 2.3 if k % 2 else 1.55
        k += 1
    mezcla = mezcla[:n]
    fade = np.linspace(1, 0, SR * 2)
    mezcla[-len(fade):] *= fade[:, None]
    mezcla /= np.abs(mezcla).max() * 1.12
    datos = (mezcla * 32767).astype("<i2")
    with wave.open(salida, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())


main()
