export type InvoiceState = 'ISSUED' | 'VOID';

export interface Invoice {
  id: string;
  salesOrderId: string | null;
  orderNumber: string | null;
  clientId: string | null;
  clientName: string | null;
  invoiceNumber: string;
  issueDate: string;
  totalValue: number;
  state: InvoiceState;
}
