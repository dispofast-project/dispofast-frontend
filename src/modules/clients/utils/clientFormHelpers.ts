import type { ClientResponse, IndividualResponse, OrganizationResponse } from "../types";
import type { ClientFormData } from "../components/form/types";

export const cleanValue = (val: string | undefined): string | undefined => {
  if (!val || val.trim() === "") return undefined;
  return val.trim();
};

export const clientToFormData = (client: ClientResponse): ClientFormData => {
  const ind = client as IndividualResponse;
  const org = client as OrganizationResponse;
  return {
    retefuenteApplies: client.retefuenteApplies,
    defaultDiscountRate: String(client.defaultDiscountRate ?? 0),
    identificationNumber: client.identificationNumber || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    cityCode: client.city?.code || "",
    zone: client.zone?.toLowerCase().replace(/^zona\s+/, "") || "",
    clientTypeId: String(client.clientType?.id || ""),
    priceListId: client.priceList?.id || "",
    defaultAdvisorId: client.defaultAdvisor?.id || "",
    firstName: ind.firstName || "",
    lastName: ind.lastName || "",
    legalName: org.legalName || "",
    billingEmail: org.billingEmail || "",
    representativeFirstName:
      ind.representativeFirstName || org.representativeFirstName || "",
    representativeLastName:
      ind.representativeLastName || org.representativeLastName || "",
    representativeIdentification:
      ind.representativeIdentification || org.representativeIdentification || "",
    representativeEmail: ind.representativeEmail || org.representativeEmail || "",
    representativePhone: ind.representativePhone || org.representativePhone || "",
    representativeJobTitle: ind.representativeJobTitle || "",
  };
};
