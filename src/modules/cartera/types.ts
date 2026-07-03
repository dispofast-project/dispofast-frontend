export type ArEntryState = "PENDING" | "PAID";
export type ArEntrySource = "ORDER" | "MANUAL";
export type PaymentMethod = "CAJA" | "TRANSFERENCIA";
export type PaymentReceiptState = "ACTIVE" | "CANCELLED";

export interface ArEntry {
  id: string;
  state: ArEntryState;
  source: ArEntrySource;
  clientId?: string;
  clientName: string;
  clientIdentification: string;
  asesorName: string | null;
  orderId?: string | null;
  orderNumber: string | null;
  value: number;
  paidAmount: number;
  balance: number;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  paymentTermDays: number;
  expirationDate: string;
  diasCartera: number;
  diasVencimiento: number;
  cityName: string | null;
}

export interface PaymentReceipt {
  id: string;
  receiptCode: string;
  arEntryId: string;
  createdByName: string;
  documentNumber: string | null;
  paymentDate: string;
  value: number;
  paymentMethod: PaymentMethod;
  voucherS3Key: string | null;
  observations: string | null;
  state: PaymentReceiptState;
  createdAt: string;
}

export interface CreatePaymentReceiptRequest {
  value: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  voucherS3Key: string;
  documentNumber?: string;
  observations?: string;
}

export interface CarteraFilters {
  state?: ArEntryState;
  search?: string;
}

export interface CarteraStats {
  totalCartera: number;
  carteraVencida: number;
  alDia: number;
}


