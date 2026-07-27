import { useState } from "react";
import { LegalEntityType, RetefuenteType } from "../types";
import type {
  CreateIndividualRequestDTO,
  CreateOrganizationRequestDTO,
} from "../types/create-client.dto";
import { uploadLegalDocumentService } from "../api/clients.api";
import { useNotificationStore } from "../../../shared/store";
import type { ClientFormData } from "../components/form/types";

const cleanValue = (val: string | undefined): string | undefined => {
  if (!val || val.trim() === "") return undefined;
  return val.trim();
};

const baseFormState: ClientFormData = {
  retefuenteType: RetefuenteType.NO_APLICA,
  defaultDiscountRate: "0",
  identificationNumber: "",
  email: "",
  phone: "",
  address: "",
  cityCode: "",
  zone: "",
  clientTypeId: "",
  priceListId: "",
  defaultAdvisorId: "",
  firstName: "",
  lastName: "",
  legalName: "",
  billingEmail: "",
  representativeFirstName: "",
  representativeLastName: "",
  representativeIdentification: "",
  representativeEmail: "",
  representativePhone: "",
  representativeJobTitle: "",
};

interface UseClientFormOptions<TResult> {
  initialValues?: Partial<ClientFormData>;
  initialEntityType?: LegalEntityType | null;
  onSubmitClient: (
    payload: CreateIndividualRequestDTO | CreateOrganizationRequestDTO,
  ) => Promise<TResult>;
  /** Extracts the created client's id from `onSubmitClient`'s result, used to upload legal documents. */
  getClientId: (result: TResult) => string;
  onSuccess: (result: TResult) => Promise<void> | void;
}

/** Shared form state + submit orchestration behind CreateClientPage and CompleteProspectClientPage. */
export const useClientForm = <TResult>({
  initialValues,
  initialEntityType = null,
  onSubmitClient,
  getClientId,
  onSuccess,
}: UseClientFormOptions<TResult>) => {
  const { showNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [entityType, setEntityType] = useState<LegalEntityType | null>(initialEntityType);
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentsError, setDocumentsError] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({ ...baseFormState, ...initialValues });

  const handleEntityTypeChange = (type: LegalEntityType) => {
    if (entityType !== type) {
      setEntityType(type);
      setDocuments([]);
      setDocumentsError(false);
      setFormData((prev) => ({
        ...prev,
        retefuenteType:
          type === LegalEntityType.LEGAL
            ? RetefuenteType.PERSONA_JURIDICA
            : RetefuenteType.PERSONA_NATURAL,
        firstName: "",
        lastName: "",
        legalName: "",
        billingEmail: "",
        representativeFirstName: "",
        representativeLastName: "",
        representativeIdentification: "",
        representativeEmail: "",
        representativePhone: "",
        representativeJobTitle: "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityType) return;

    if (entityType === LegalEntityType.LEGAL && documents.length === 0) {
      setDocumentsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const parsedClientTypeId = parseInt(formData.clientTypeId, 10);
      const finalClientTypeId = isNaN(parsedClientTypeId) ? 0 : parsedClientTypeId;

      const parsedDiscountRate = parseInt(formData.defaultDiscountRate, 10);
      const finalDiscountRate = isNaN(parsedDiscountRate) ? 0 : parsedDiscountRate;

      const basePayload = {
        legalEntityType: entityType,
        retefuenteType: formData.retefuenteType,
        defaultDiscountRate: finalDiscountRate,
        identificationNumber: formData.identificationNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        cityCode: formData.cityCode,
        zone: formData.zone,
        clientTypeId: finalClientTypeId,
        priceListId: formData.priceListId,
        defaultAdvisorId: formData.defaultAdvisorId || undefined,
      };

      let created: TResult;

      if (entityType === LegalEntityType.NATURAL) {
        const payload: CreateIndividualRequestDTO = {
          ...basePayload,
          firstName: formData.firstName,
          lastName: formData.lastName,
          representativeFirstName: cleanValue(formData.representativeFirstName),
          representativeLastName: cleanValue(formData.representativeLastName),
          representativeIdentification: cleanValue(formData.representativeIdentification),
          representativeEmail: cleanValue(formData.representativeEmail),
          representativePhone: cleanValue(formData.representativePhone),
          representativeJobTitle: cleanValue(formData.representativeJobTitle),
        };
        created = await onSubmitClient(payload);
      } else {
        const payload: CreateOrganizationRequestDTO = {
          ...basePayload,
          legalName: formData.legalName,
          billingEmail: cleanValue(formData.billingEmail),
          representativeFirstName: formData.representativeFirstName,
          representativeLastName: formData.representativeLastName,
          representativeIdentification: formData.representativeIdentification,
          representativeEmail: formData.representativeEmail,
          representativePhone: formData.representativePhone,
        };
        created = await onSubmitClient(payload);
        for (const file of documents) {
          await uploadLegalDocumentService(getClientId(created), file);
        }
      }

      await onSuccess(created);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError.response?.data?.message || axiosError.message || "Error al crear el cliente.";
      showNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    entityType,
    documents,
    documentsError,
    formData,
    setDocuments,
    setDocumentsError,
    handleEntityTypeChange,
    handleChange,
    handleSubmit,
  };
};
