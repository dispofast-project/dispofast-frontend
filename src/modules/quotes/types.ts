import type { Location } from "../../shared/types/common";

// TODO: Mover cuando se implemente el modulo
export interface PriceList {
  id: string;
  name: string;
}

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

// TODO: Mover cuando se implemente el modulo
export interface Organization {
  id: string;
  nit: string;
  legalName: string;
  defaultDiscountRate: number;
  address: string;
  billingEmail: string;
  generalEmail: string;
  phone: string;
}

// TODO: Mover cuando se implemente el modulo
export interface Account {
  id: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  organization?: Organization;
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
  account: Account;
  sellerName: string;
  location: Location;
  priceList: PriceList;
  createdAt: string;
  updatedAt: string;
}
