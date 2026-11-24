/**
 * Polilíneas de las rutas, copiadas de herramientas/mapas-vfx (constante ROUTES):
 * [longitud, latitud, localidad, esHito].
 */
export type Punto = [number, number, string, number];

export const RUTAS: Record<string, Punto[]> = {
  sarria: [[-7.414,42.781,"Sarria",1],[-7.616,42.807,"Portomarín",1],[-7.869,42.873,"Palas de Rei",1],[-8.015,42.914,"Melide",1],[-8.163,42.928,"Arzúa",1],[-8.363,42.907,"O Pedrouzo",1],[-8.545,42.881,"Santiago de Compostela",1]],
  ferrol: [[-8.234,43.484,"Ferrol",1],[-8.152,43.502,"Neda",0],[-8.172,43.408,"Pontedeume",1],[-8.212,43.28,"Betanzos",1],[-8.334,43.155,"Bruma",0],[-8.442,42.972,"Sigüeiro",1],[-8.545,42.881,"Santiago de Compostela",1]],
  finisterre: [[-8.545,42.881,"Santiago de Compostela",1],[-8.735,42.907,"Negreira",1],[-9.03,42.943,"Olveiroa",1],[-9.188,42.954,"Cee",1],[-9.264,42.906,"Fisterra",1]],
  lugo: [[-7.556,43.012,"Lugo",1],[-7.686,42.947,"Ferreira",1],[-8.015,42.914,"Melide",1],[-8.163,42.928,"Arzúa",1],[-8.408,42.905,"Amenal",1],[-8.545,42.881,"Santiago de Compostela",1]],
  ourense: [[-7.864,42.336,"Ourense",1],[-8.113,42.661,"Lalín",0],[-8.545,42.881,"Santiago de Compostela",1]],
};
