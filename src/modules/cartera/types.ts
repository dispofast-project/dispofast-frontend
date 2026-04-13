export type ArEntryState = "PENDING" | "PAID";
export type ArEntrySource = "ORDER" | "MANUAL";


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


