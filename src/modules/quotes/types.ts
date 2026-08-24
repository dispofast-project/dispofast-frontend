import type { Location } from "../../shared/types/common";
import type { RetefuenteType } from "../clients/types";

// TODO: Mover cuando se implemente el modulo
export interface PriceList {
  id: string;
  name: string;
}

export interface SellerPreview {
  id: string;
  fullName: string;
}

/** Matches ClientPreviewDTO — returned by GET /clients search */
export interface ClientPreview {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  isActive: boolean;
  defaultAdvisor: SellerPreview | null;
}

/** Matches ClientResponseDTO — returned by GET /clients/{id} */
export interface ClientDetails {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  isActive: boolean;
  retefuenteType: RetefuenteType;
  defaultAdvisor: SellerPreview | null;
  defaultDiscountRate: number | null;
  priceList: PriceList | null;
  city: Location | null;
}

export const QuoteStatus = {
  PENDING: "pendiente",
  ACCEPTED: "aprobada",
  REJECTED: "rechazada",
  EXPIRED: "caducada",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const PaymentCondition = {
  CONTADO: "Contado",
  CREDITO_15_DIAS: "Crédito 15 días",
  CREDITO_30_DIAS: "Crédito 30 días",
  CREDITO_60_DIAS: "Crédito 60 días",
  CREDITO_90_DIAS: "Crédito 90 días",
  CONTRAENTREGA: "Contraentrega",
} as const;

export type PaymentCondition = keyof typeof PaymentCondition;

export const OfferValidity = {
  DIAS_15: "15 días",
  DIAS_30: "30 días",
  DIAS_45: "45 días",
  DIAS_60: "60 días",
} as const;

export type OfferValidity = keyof typeof OfferValidity;

export const LegalEntityType = {
  NATURAL: "natural",
  EMPRESA: "empresa",
} as const;

export type LegalEntityType = (typeof LegalEntityType)[keyof typeof LegalEntityType];

export interface ProspectDetails {
  name: string;
  legalEntityType: LegalEntityType;
  clientTypeId?: number;
  clientTypeName?: string;
  phone?: string;
  email?: string;
}

export interface QuotePreview {
  id: string;
  number: string;
  status: QuoteStatus;
  accountName: string;
  prospect?: boolean;
  seller: SellerPreview;
  createdAt: string;
  total: number;
  offerValidity: OfferValidity | null;
  backorder: boolean;
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
  retefuenteType: RetefuenteType;
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

export interface QuoteItemProduct {
  id: string;
  name: string;
  reference: string;
  sku: string;
  taxFree: boolean;
}

export interface QuoteItem {
  id: string;
  product: QuoteItemProduct;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  number: string;
  status: QuoteStatus;
  paymentCondition: PaymentCondition | null;
  offerValidity: OfferValidity | null;
  account: Account;
  prospect?: ProspectDetails | null;
  sellerId: string;
  sellerName: string;
  location: Location;
  shipmentAddress: string | null;
  priceList: PriceList;
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
  backorder: boolean;
}
