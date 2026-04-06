import type { PaymentCondition } from "../types";

export const PAYMENT_CONDITION_OPTIONS: { value: PaymentCondition; label: string }[] = [
  { value: "CONTADO",         label: "Contado" },
  { value: "CONTADO_15_DIAS", label: "Contado 15 días" },
  { value: "CONTADO_30_DIAS", label: "Contado 30 días" },
  { value: "CONTADO_60_DIAS", label: "Contado 60 días" },
  { value: "CONTADO_90_DIAS", label: "Contado 90 días" },
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
