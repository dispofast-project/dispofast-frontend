import type { Location } from "../../shared/types/common";

export interface SellerPreview {
  id: string;
  fullName: string;
}

export const QuoteStatus = {
  PENDING: "pendiente",
  ACCEPTED: "aprobada",
  REJECTED: "rechazada",
  EXPIRED: "caducada",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export interface QuotePreview {
  id: string;
  number: string;
  status: QuoteStatus;
  accountName: string;
  seller: SellerPreview;
  createdAt: string;
  total: number;
  expirationDate: string;
}

export interface Quote {
  id: string;
  number: string;
  status: QuoteStatus;
  subtotalAmount: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  expirationDate: string;
  accountId: string;
  sellerName: string;
  location: Location;
  priceListId: string;
  createdAt: string;
  updatedAt: string;
}
