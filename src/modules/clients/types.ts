import type { City } from "../../shared/types/location";

export interface MediaAsset {
  id: string;
  filename: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  type: "INVOICE" | "LEGAL_DOC";
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocument {
  id: string;
  fileAttachment: MediaAsset;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreview {
  id: string;
  fullName: string;
}

export const LegalEntityType = {
  NATURAL: "natural",
  LEGAL: "empresa",
} as const;

export type LegalEntityType = (typeof LegalEntityType)[keyof typeof LegalEntityType];

export const RetefuenteType = {
  PERSONA_JURIDICA: "persona_juridica",
  PERSONA_NATURAL: "persona_natural",
  NO_APLICA: "no_aplica",
} as const;

export type RetefuenteType = (typeof RetefuenteType)[keyof typeof RetefuenteType];

export interface ClientPreview {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  isActive: boolean;
  defaultAdvisor: UserPreview;
  city: City;
}

export interface ClientType {
  id: number;
  name: string;
}

export interface PriceListResponse {
  id: string;
  name: string;
}

export interface ClientResponse {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  email: string;
  phone: string;
  isActive: boolean;
  retefuenteType: RetefuenteType;
  address: string;
  defaultAdvisor: UserPreview;
  city: City;
  zone: string;
  defaultDiscountRate: number;
  priceList: PriceListResponse;
  clientType: ClientType;
  legalDocuments: LegalDocument[];
}

export interface PriceHistoryEntry {
  source: "ORDER" | "QUOTE";
  documentNumber: string;
  date: string;
  quantity: number;
  unitPrice: number;
}

export interface IndividualResponse extends ClientResponse {
  firstName: string;
  lastName: string;
  representativeFirstName: string;
  representativeLastName: string;
  representativeIdentification: string;
  representativeJobTitle: string;
  representativeEmail: string;
  representativePhone: string;
}

export interface OrganizationResponse extends ClientResponse {
  legalName: string;
  billingEmail: string;
  representativeFirstName: string;
  representativeLastName: string;
  representativeIdentification: string;
  representativeEmail: string;
  representativePhone: string;
}
