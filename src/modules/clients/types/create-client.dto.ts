import { LegalEntityType } from '../types';

export interface CreateClientRequestDTO {
  legalEntityType: LegalEntityType;
  identificationNumber: string;
  email: string;
  phone: string;
  isActive?: boolean;
  retefuenteApplies?: boolean;
  address: string;
  defaultAdvisorId?: string;
  cityCode: string;
  zone: string;
  defaultDiscountRate?: number;
  priceListId: string;
  clientTypeId: number;
}

export interface CreateIndividualRequestDTO extends CreateClientRequestDTO {
  firstName: string;
  lastName: string;
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeIdentification?: string;
  representativeJobTitle?: string;
  representativeEmail?: string;
  representativePhone?: string;
}

export interface CreateOrganizationRequestDTO extends CreateClientRequestDTO {
  legalName: string;
  billingEmail?: string;
  representativeFirstName: string;
  representativeLastName: string;
  representativeIdentification: string;
  representativeEmail: string;
  representativePhone: string;
}
