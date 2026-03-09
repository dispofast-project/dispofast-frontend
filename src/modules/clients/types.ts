import type { City } from "../../shared/types/location";

export interface UserPreview {
  id: string;
  fullName: string;
}

export const LegalEntityType = {
  NATURAL: "natural",
  LEGAL: "empresa",
} as const;

export type LegalEntityType = (typeof LegalEntityType)[keyof typeof LegalEntityType];

export interface ClientPreview {
  id: string;
  legalEntityType: LegalEntityType;
  name: string;
  identificationNumber: string;
  isActive: boolean;
  defaultAdvisor: UserPreview;
  city: City;
}
