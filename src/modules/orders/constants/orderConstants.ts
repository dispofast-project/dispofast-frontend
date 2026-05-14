import type { PaymentCondition } from "../types";

export const PAYMENT_CONDITION_OPTIONS: { value: PaymentCondition; label: string }[] = [
  { value: "CONTADO",         label: "Contado" },
  { value: "CREDITO_15_DIAS", label: "Crédito 15 días" },
  { value: "CREDITO_30_DIAS", label: "Crédito 30 días" },
  { value: "CREDITO_60_DIAS", label: "Crédito 60 días" },
  { value: "CREDITO_90_DIAS", label: "Crédito 90 días" },
  { value: "CONTRAENTREGA",   label: "Contraentrega" },
];

export const DISCOUNT_OPTIONS = [
  { value: "0", label: "No aplica" },
  { value: "1", label: "1%" },
  { value: "2", label: "2%" },
  { value: "3", label: "3%" },
];

export const ZONE_OPTIONS = [
  { value: "norte", label: "Zona Norte" },
  { value: "sur", label: "Zona Sur" },
  { value: "oriente", label: "Zona Oriente" },
  { value: "occidente", label: "Zona Occidente" },
  { value: "centro", label: "Zona Centro" },
];
