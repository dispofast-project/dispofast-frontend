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
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  accountId: string;
  accountName: string;
  asesorUserId: string;
  asesorName: string;
  state: OrderState;
  orderDate: string;
  shipmentCityId: string;
  shipmentCityName: string;
  shipmentAddress: string;
  zone: string;
  totalValue: number;
  priceListId: string;
  quoteId: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
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
  orderNumber: string;
  accountId: string;
  asesorUserId: string;
  orderDate?: string;
  shipmentCityId: string;
  shipmentAddress: string;
  zone?: string;
  accountPriceListId: string;
  quoteId?: string;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderRequestDTO {
  asesorUserId?: string;
  state?: OrderState;
  orderDate?: string;
  shipmentCityId?: string;
  shipmentAddress?: string;
  zone?: string;
  accountPriceListId?: string;
  items?: CreateOrderItemDTO[];
}

export interface AttachInvoiceRequestDTO {
  invoiceNumber: string;
  invoiceUrl: string;
}
