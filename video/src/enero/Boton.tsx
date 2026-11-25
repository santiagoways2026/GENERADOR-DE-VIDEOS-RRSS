import React from "react";
import { c, fuente, seguro } from "./marca";
import { useEntrada } from "./Texto";

/**
 * Botón de llamada a la acción sobre foto: fondo blanco y letra verde.
 * El verde es el sendero (#506718) y no el verde Ways, porque el Brandbook
 * no permite verde Ways sobre blanco.
 */
export const Boton: React.FC<{
  texto: string;
  arriba?: number;
  tam?: number;
}> = ({ texto, arriba = 980, tam = 56 }) => {
  const e = useEntrada(0, 9, 18);
  return (
    <div
      style={{
        position: "absolute",
        top: arriba,
        left: seguro.izquierda,
        right: seguro.derecha,
        display: "flex",
        justifyContent: "center",
        ...e,
      }}
    >
      <div
        style={{
          backgroundColor: c.blanco,
          color: c.sendero,
          fontFamily: fuente,
          fontWeight: 800,
          fontSize: tam,
          padding: "22px 44px 24px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 32px rgba(46, 46, 45, 0.25)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};
