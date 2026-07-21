import { useEffect, useMemo, useState } from "react";
import type React from "react";

import { getClientByIdService, updateClientService } from "../api/clients.api";
import type { ClientResponse, PriceListResponse } from "../types";
import { LegalEntityType } from "../types";
import type {
  CreateIndividualRequestDTO,
  CreateOrganizationRequestDTO,
} from "../types/create-client.dto";
import type { ClientFormData } from "../components/form/types";
import type { City } from "../../../shared/types/location";
import type { User } from "../../iam/types";
import { useNotificationStore } from "../../../shared/store";
import { cleanValue, clientToFormData } from "../utils/clientFormHelpers";

const REQUIRED_FIELD_LABELS: Partial<Record<keyof ClientFormData, string>> = {
  identificationNumber: "Número de identificación",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  cityCode: "Ciudad",
  priceListId: "Lista de precios",
  clientTypeId: "Tipo de cliente",
};

export const useClientDetails = (id: string | undefined) => {
  const { showNotification } = useNotificationStore();

  const [client, setClient] = useState<ClientResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [initialFormData, setInitialFormData] = useState<ClientFormData | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [initialIsActive, setInitialIsActive] = useState(true);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<User | null>(null);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceListResponse | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getClientByIdService(id);
        setClient(data);

        const fd = clientToFormData(data);
        setFormData(fd);
        setInitialFormData(fd);
        setIsActive(data.isActive);
        setInitialIsActive(data.isActive);

        setSelectedCity(data.city ?? null);
        setSelectedAdvisor(
          data.defaultAdvisor
            ? ({
                id: data.defaultAdvisor.id,
                name: data.defaultAdvisor.fullName,
                email: "",
                role: "",
                effectivePermissions: [],
              } as User)
            : null
        );
        setSelectedPriceList(data.priceList ?? null);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al cargar los detalles del cliente.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const isDirty = useMemo(() => {
    if (!formData || !initialFormData) return false;
    if (isActive !== initialIsActive) return true;
    return (Object.keys(formData) as Array<keyof ClientFormData>).some(
      (key) => String(formData[key]) !== String(initialFormData[key])
    );
  }, [formData, initialFormData, isActive, initialIsActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => (prev ? { ...prev, [e.target.name]: value } : prev));
  };

  const handleDiscountChange = (value: string) => {
    setFormData((prev) => (prev ? { ...prev, defaultDiscountRate: value } : prev));
  };

  const handleCityChange = (city: City | null) => {
    setSelectedCity(city);
    setFormData((prev) => (prev ? { ...prev, cityCode: city?.code || "" } : prev));
  };

  const handleAdvisorChange = (advisor: User | null) => {
    setSelectedAdvisor(advisor);
    setFormData((prev) => (prev ? { ...prev, defaultAdvisorId: advisor?.id || "" } : prev));
  };

  const handlePriceListChange = (pl: PriceListResponse | null) => {
    setSelectedPriceList(pl);
    setFormData((prev) => (prev ? { ...prev, priceListId: pl?.id || "" } : prev));
  };

  const handleUpdate = async () => {
    if (!client || !formData || !isDirty) return;

    const missingFields = (
      Object.keys(REQUIRED_FIELD_LABELS) as Array<keyof ClientFormData>
    )
      .filter((key) => !String(formData[key] ?? "").trim())
      .map((key) => REQUIRED_FIELD_LABELS[key] as string);

    if (missingFields.length > 0) {
      showNotification(
        `Completa los siguientes campos antes de guardar: ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

    setIsUpdating(true);

    const isNatural = client.legalEntityType === LegalEntityType.NATURAL;
    const basePayload = {
      legalEntityType: client.legalEntityType,
      identificationNumber: formData.identificationNumber,
      email: formData.email,
      phone: formData.phone,
      isActive,
      retefuenteType: formData.retefuenteType,
      address: formData.address,
      cityCode: formData.cityCode,
      zone: formData.zone,
      defaultDiscountRate: parseInt(formData.defaultDiscountRate, 10) || 0,
      priceListId: formData.priceListId,
      defaultAdvisorId: formData.defaultAdvisorId,
      clientTypeId: parseInt(formData.clientTypeId, 10) || 0,
    };

    try {
      let payload: CreateIndividualRequestDTO | CreateOrganizationRequestDTO;

      if (isNatural) {
        payload = {
          ...basePayload,
          firstName: formData.firstName,
          lastName: formData.lastName,
          representativeFirstName: cleanValue(formData.representativeFirstName),
          representativeLastName: cleanValue(formData.representativeLastName),
          representativeIdentification: cleanValue(formData.representativeIdentification),
          representativeEmail: cleanValue(formData.representativeEmail),
          representativePhone: cleanValue(formData.representativePhone),
          representativeJobTitle: cleanValue(formData.representativeJobTitle),
        } as CreateIndividualRequestDTO;
      } else {
        payload = {
          ...basePayload,
          legalName: formData.legalName,
          billingEmail: cleanValue(formData.billingEmail),
          representativeFirstName: formData.representativeFirstName,
          representativeLastName: formData.representativeLastName,
          representativeIdentification: formData.representativeIdentification,
          representativeEmail: formData.representativeEmail,
          representativePhone: formData.representativePhone,
        } as CreateOrganizationRequestDTO;
      }

      const updated = await updateClientService(client.id, payload);
      setClient(updated);
      const newFd = clientToFormData(updated);
      setFormData(newFd);
      setInitialFormData(newFd);
      setIsActive(updated.isActive);
      setInitialIsActive(updated.isActive);
      showNotification("Cliente actualizado exitosamente", "success");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Error al actualizar el cliente.";
      showNotification(message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    client,
    isLoading,
    error,
    isUpdating,
    formData,
    isActive,
    setIsActive,
    isDirty,
    selectedCity,
    selectedAdvisor,
    selectedPriceList,
    handleChange,
    handleDiscountChange,
    handleCityChange,
    handleAdvisorChange,
    handlePriceListChange,
    handleUpdate,
  };
};
