const colombianCurrency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (
  amount: number | string | null | undefined,
): string => {
  if (amount === null || amount === undefined) {
    return colombianCurrency.format(0);
  }

  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericValue)) {
    return colombianCurrency.format(0);
  }

  return colombianCurrency.format(numericValue);
};
