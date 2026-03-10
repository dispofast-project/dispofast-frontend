import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createClientService } from "../api/clients.api";
import { LegalEntityType } from "../types";
import type { CreateIndividualRequestDTO, CreateOrganizationRequestDTO } from "../types/create-client.dto";
import { useNotificationStore } from "../../../shared/store";
import { EntityTypeSelector } from "../components/form/EntityTypeSelector";
import { GeneralDataFields } from "../components/form/GeneralDataFields";
import { NaturalPersonFields } from "../components/form/NaturalPersonFields";
import { OrganizationFields } from "../components/form/OrganizationFields";
import { RepresentativeFields } from "../components/form/RepresentativeFields";
import { FormActions } from "../components/form/FormActions";
import type { ClientFormData } from "../components/form/types";

const cleanValue = (val: string | undefined): string | undefined => {
  if (!val || val.trim() === "") return undefined;
  return val.trim();
};

const initialFormState = {
  retefuenteApplies: true,
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

const CreateClientPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [entityType, setEntityType] = useState<LegalEntityType | null>(null);

  const [formData, setFormData] = useState<ClientFormData>({ ...initialFormState });

  const handleEntityTypeChange = (type: LegalEntityType) => {
    if (entityType !== type) {
      setEntityType(type);
      setFormData(prev => ({
        ...prev,
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
    setIsLoading(true);

    try {
      const parsedClientTypeId = parseInt(formData.clientTypeId, 10);
      const finalClientTypeId = isNaN(parsedClientTypeId) ? 0 : parsedClientTypeId;

      const basePayload = {
        legalEntityType: entityType,
        retefuenteApplies: formData.retefuenteApplies,
        identificationNumber: formData.identificationNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        cityCode: formData.cityCode,
        zone: formData.zone,
        clientTypeId: finalClientTypeId,
        priceListId: formData.priceListId,
        defaultAdvisorId: formData.defaultAdvisorId,
      };

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
        await createClientService(payload);
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
        await createClientService(payload);
      }

      showNotification("Cliente creado exitosamente", "success");
      navigate("/clientes");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }, message?: string };
      const message = axiosError.response?.data?.message || axiosError.message || "Error al crear el cliente.";
      showNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="max-w-4xl mx-auto p-4 sm:p-6">
      <Box className="flex items-center mb-4">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/clientes")}
          sx={{ mr: 2, color: "text.secondary" }}
          size="small"
        >
          Volver
        </Button>
      </Box>

      <Box className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-1">
            Nuevo Cliente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa la información para registrar un nuevo cliente
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <EntityTypeSelector selected={entityType} onSelect={handleEntityTypeChange} />
          
          {entityType && (
            <Box className="animate-fade-in pt-6 border-t border-gray-100">
              <GeneralDataFields formData={formData} onChange={handleChange} />
              
              {entityType === LegalEntityType.NATURAL ? (
                <NaturalPersonFields formData={formData} onChange={handleChange} />
              ) : (
                <OrganizationFields formData={formData} onChange={handleChange} />
              )}
              
              <RepresentativeFields entityType={entityType} formData={formData} onChange={handleChange} />
              <FormActions isLoading={isLoading} onCancel={() => navigate("/clientes")} />
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default CreateClientPage;
