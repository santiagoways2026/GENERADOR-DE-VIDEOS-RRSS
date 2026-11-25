import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { c, cajaGrafico, curva, fuente, seguro } from "./marca";

/**
 * Tarjeta de ruta o de etapa, a partir de las del kit de motion graphics
 * (bloques 02 y 08): placa verde con el nombre y placa blanca debajo con el
 * dato. Entra con barrido lateral, 27 fotogramas, y la segunda placa releva
 * a la primera 14 fotogramas después.
 *
 * Adaptada al Brandbook 2027: minúscula de frase y tinta grafito.
 */
const barrido = (frame: number, desde: number, dura: number) =>
  interpolate(frame, [desde, desde + dura], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...curva),
  });

export const Tarjeta: React.FC<{
  numero?: number | string;
  titulo: string;
  dato?: string;
  arriba?: number;
  desde?: number;
  /** Fotograma (local) en que sale. */
  hasta?: number;
  /** Fotogramas del barrido y del relevo entre placas (27 y 14 en el kit). */
  barre?: number;
  relevo?: number;
}> = ({
  numero,
  titulo,
  dato,
  arriba = 290,
  desde = 0,
  hasta,
  barre = 27,
  relevo = 14,
}) => {
  const f = useCurrentFrame();
  const salida =
    hasta === undefined
      ? 1
      : interpolate(f, [hasta - 8, hasta], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const recorte = (d: number) => `inset(0 ${100 - barrido(f, d, barre)}% 0 0)`;
  return (
    <div
      style={{
        position: "absolute",
        top: arriba,
        left: seguro.izquierda,
        right: seguro.derecha,
        display: "flex",
        alignItems: "flex-start",
        gap: 22,
        fontFamily: fuente,
        opacity: salida,
      }}
    >
      {numero !== undefined ? (
        <div
          style={{
            ...cajaGrafico,
            width: 128,
            height: 128,
            flex: "0 0 128px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 88,
            fontWeight: 800,
            borderRadius: 6,
            clipPath: recorte(desde),
          }}
        >
          {numero}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            backgroundColor: c.verde,
            color: c.blanco,
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.12,
            padding: "14px 26px 16px",
            borderRadius: dato ? "6px 6px 6px 0" : 6,
            clipPath: recorte(desde + (numero !== undefined ? 4 : 0)),
          }}
        >
          {titulo}
        </div>
        {dato ? (
          <div
            style={{
              backgroundColor: c.blanco,
              color: c.grafito,
              fontSize: 40,
              fontWeight: 700,
              padding: "10px 26px 12px",
              borderRadius: "0 6px 6px 6px",
              clipPath: recorte(
                desde + relevo + (numero !== undefined ? 4 : 0),
              ),
            }}
          >
            {dato}
          </div>
        ) : null}
      </div>
    </div>
  );
};
