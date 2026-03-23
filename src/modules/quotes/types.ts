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
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const LegalEntityType = {
  NATURAL: "natural",
  EMPRESA: "empresa",
} as const;

export type LegalEntityType = (typeof LegalEntityType)[keyof typeof LegalEntityType];

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

export interface Account {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  retefuenteApplies: boolean;
  defaultDiscountRate: number;
  zone: string;
  // Persona Natural
  firstName?: string;
  lastName?: string;
  // Empresa
  legalName?: string;
  billingEmail?: string;
  // Representante (ambos tipos)
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeIdentification?: string;
  representativeJobTitle?: string;
  representativeEmail?: string;
  representativePhone?: string;
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
