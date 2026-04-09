export type ArEntryState = "PENDING" | "PAID";
export type ArEntrySource = "ORDER" | "MANUAL";

/** Estado calculado en frontend para mostrar en UI */
export type CarteraDisplayState = "AL_DIA" | "POR_VENCER" | "VENCIDA" | "PAGADA";

export interface ArEntry {
  id: string;
  state: ArEntryState;
  source: ArEntrySource;
  clientName: string;
  clientIdentification: string;
  asesorName: string | null;
  orderNumber: string | null;
  value: number;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  paymentTermDays: number;
  expirationDate: string;
  diasCartera: number;
  diasVencimiento: number;
  cityName: string | null;
}

export interface CarteraFilters {
  state?: ArEntryState;
}

export interface CarteraStats {
  totalCartera: number;
  carteraVencida: number;
  alDia: number;
}

/**
 * Calcula el estado de visualización basado en los datos del backend.
 * - PAID → PAGADA
 * - diasVencimiento > 0 → VENCIDA
 * - días para vencimiento ≤ 10 → POR_VENCER
 * - resto → AL_DIA
 */
export const getDisplayState = (entry: ArEntry): CarteraDisplayState => {
  if (entry.state === "PAID") return "PAGADA";
  if (entry.diasVencimiento > 0) return "VENCIDA";
  const daysToExpiry = Math.floor(
    (new Date(entry.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysToExpiry >= 0 && daysToExpiry <= 10) return "POR_VENCER";
  return "AL_DIA";
};
