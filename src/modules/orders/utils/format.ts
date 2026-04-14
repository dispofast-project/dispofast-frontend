export const formatCurrency = (value: number): string =>
  `$${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

export const formatDate = (date: Date): string =>
  date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
