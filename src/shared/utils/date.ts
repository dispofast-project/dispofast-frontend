/**
 * Formatea una fecha al estándar colombiano.
 * @param dateString - Fecha en formato ISO o string compatible.
 * @returns string formateado (ej: 25 feb 2026)
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—"; // Manejo de valores nulos o vacíos

  const date = new Date(dateString);

  // Validar si la fecha es inválida antes de formatear
  if (isNaN(date.getTime())) return "Fecha inválida";

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
