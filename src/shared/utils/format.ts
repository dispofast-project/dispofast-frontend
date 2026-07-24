export const formatRate = (rate: number | null | undefined): string => {
  if (rate == null) return "0%";
  const pct = rate * 100;
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
};
