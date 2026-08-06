export type PaymentCondition =
  | 'CONTADO'
  | 'CREDITO_15_DIAS'
  | 'CREDITO_30_DIAS'
  | 'CREDITO_60_DIAS'
  | 'CREDITO_90_DIAS'
  | 'CONTRAENTREGA';

export type OrderState =
  | 'PENDING'
  | 'INVOICED'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  productReference: string;
  productSku: string | null;
  taxFree: boolean;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  asesorUserId: string;
  asesorName: string;
  state: OrderState;
  orderDate: string;
  shipmentCityId: string;
  shipmentCityName: string;
  shipmentAddress: string;
  invoiceNumber: string | null;
  trackingCode: string | null;
  zone: string;
  totalValue: number;
  priceListId: string;
  quoteId: string | null;
  paymentCondition: PaymentCondition | null;
  discountRate: number | null;
  additionalDiscountRate: number | null;
  retefuenteAmount?: number | null;
  reteicaAmount?: number | null;
  freight?: number | null;
  observations?: string | null;
  items: SalesOrderItem[];
}

export interface OrderFilters {
  state?: OrderState;
  orderNumber?: string;
}

// ─── Request DTOs ───────────────────────────────────────────────────────────

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  lineTotal: number;
}

export interface CreateOrderRequestDTO {
  clientId: string;
  asesorUserId: string;
  orderDate?: string;
  shipmentCityId: string;
  shipmentAddress: string;
  zone?: string;
  priceListId: string;
  quoteId?: string;
  paymentCondition?: PaymentCondition;
  discountRate?: number;
  additionalDiscountRate?: number;
  observations?: string;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderRequestDTO {
  asesorUserId?: string;
  state?: OrderState;
  orderDate?: string;
  shipmentCityId?: string;
  shipmentAddress?: string;
  zone?: string;
  priceListId?: string;
  paymentCondition?: PaymentCondition;
  discountRate?: number;
  additionalDiscountRate?: number;
  freight?: number;
  observations?: string;
  items?: CreateOrderItemDTO[];
}

export interface AttachInvoiceRequestDTO {
  invoiceNumber: string;
  file: File;
}
