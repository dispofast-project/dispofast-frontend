import type { ClientResponse } from "../clients/types";
import type { RetefuenteType } from "../clients/types";

export interface UserPreview {
  id: string;
  fullName: string;
}

export const PaymentCondition = {
  CONTADO: "Contado",
  CREDITO_15_DIAS: "Crédito 15 días",
  CREDITO_30_DIAS: "Crédito 30 días",
  CREDITO_60_DIAS: "Crédito 60 días",
  CREDITO_90_DIAS: "Crédito 90 días",
  CONTRAENTREGA: "Contraentrega",
} as const;

export type PaymentCondition = keyof typeof PaymentCondition;

export interface PurchaseOrderPreview {
  id: string;
  number: string;
  supplierName: string;
  buyer: UserPreview;
  createdAt: string;
  total: number;
}

export interface PurchaseOrderItemProduct {
  id: string;
  name: string;
  reference: string;
  sku: string;
  taxFree: boolean;
}

export interface PurchaseOrderItem {
  id: string;
  product: PurchaseOrderItemProduct;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  paymentCondition: PaymentCondition | null;
  supplier: ClientResponse;
  buyerId: string;
  buyerName: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
  // Detalles de pago
  subtotalAmount: number;
  commercialDiscountRate: number;
  commercialDiscountAmount: number;
  otherDiscountsRate: number;
  otherDiscountsAmount: number;
  ivaRate: number;
  ivaAmount: number;
  retefuenteRate: number | null;
  retefuenteAmount: number | null;
  retefuenteTypeOverride: RetefuenteType | null;
  totalAmount: number;
  freight: number;
}
