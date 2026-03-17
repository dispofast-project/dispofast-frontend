import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NumericFormat } from "react-number-format";

import { getClientByIdService, updateClientService } from "../api/clients.api";
import type {
  ClientResponse,
  IndividualResponse,
  OrganizationResponse,
} from "../types";
import { LegalEntityType } from "../types";
import type {
  CreateIndividualRequestDTO,
  CreateOrganizationRequestDTO,
} from "../types/create-client.dto";
import type { ClientFormData } from "../components/form/types";
import { useNotificationStore } from "../../../shared/store";
import type { City } from "../../../shared/types/location";
import type { User } from "../../iam/types";
import type { PriceListResponse } from "../types";

import ClientDetailsHeader from "../components/ClientDetailsHeader";
import SectionCard from "../components/detail/SectionCard";
import { CityAutocomplete } from "../../../shared/components/CityAutocomplete/CityAutocomplete";
import { ZoneSelector } from "../../../shared/components/ZoneSelector/ZoneSelector";
import { AdvisorAutocomplete } from "../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import { ClientTypeSelector } from "../../../shared/components/ClientTypeSelector/ClientTypeSelector";
import { PriceListAutocomplete } from "../../../shared/components/PriceListAutocomplete/PriceListAutocomplete";

import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

// ─── Helpers ────────────────────────────────────────────────────────────────

const cleanValue = (val: string | undefined): string | undefined => {
  if (!val || val.trim() === "") return undefined;
  return val.trim();
};

const clientToFormData = (client: ClientResponse): ClientFormData => {
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

// ─── Component ──────────────────────────────────────────────────────────────

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();

  const [client, setClient] = useState<ClientResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [initialFormData, setInitialFormData] = useState<ClientFormData | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [initialIsActive, setInitialIsActive] = useState(true);

  // Autocomplete controlled values (needed for pre-population)
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

        // Pre-populate autocomplete display state
        setSelectedCity(data.city ?? null);
        setSelectedAdvisor(
          data.defaultAdvisor
            ? ({ id: data.defaultAdvisor.id, name: data.defaultAdvisor.fullName, email: "", role: "", effectivePermissions: [] } as User)
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
    setIsUpdating(true);

    const isNatural = client.legalEntityType === LegalEntityType.NATURAL;
    const basePayload = {
      legalEntityType: client.legalEntityType,
      identificationNumber: formData.identificationNumber,
      email: formData.email,
      phone: formData.phone,
      isActive,
      retefuenteApplies: formData.retefuenteApplies,
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

  // ─── Loading / error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center p-20 min-h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client || !formData) {
    return (
      <Box className="p-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/clientes")}
          className="mb-6"
          sx={{ textTransform: "none" }}
        >
          Volver a Clientes
        </Button>
        <Box className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center shadow-sm">
          <Typography variant="h6" className="font-semibold mb-2">
            Error
          </Typography>
          <Typography>{error || "No se encontró el cliente."}</Typography>
        </Box>
      </Box>
    );
  }

  const isNatural = client.legalEntityType === LegalEntityType.NATURAL;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Box className="p-6 max-w-7xl mx-auto animate-fade-in">
      <ClientDetailsHeader
        client={client}
        isActive={isActive}
        onActiveChange={setIsActive}
        isDirty={isDirty}
        isUpdating={isUpdating}
        onUpdate={handleUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">

          {isNatural ? (
            <>
              {/* Datos Personales */}
              <SectionCard title="Datos Personales" icon={<PersonIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Nombres"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Apellidos"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Identificación (Cédula)"
                    name="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={handleChange}
                  />
                  <Box className="flex items-center justify-between border border-gray-100 p-3 rounded-lg bg-gray-50 col-span-1 sm:col-span-2">
                    <Box>
                      <Typography variant="subtitle2" className="font-bold text-gray-800">
                        Aplica Retefuente
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        ¿Se le aplicará retención en la fuente?
                      </Typography>
                    </Box>
                    <Switch
                      color="primary"
                      name="retefuenteApplies"
                      checked={formData.retefuenteApplies as boolean}
                      onChange={handleChange}
                    />
                  </Box>
                </div>
              </SectionCard>

              {/* Datos de Contacto */}
              <SectionCard title="Datos de Contacto" icon={<LocationOnIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    type="email"
                    label="Correo Electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Dirección"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="sm:col-span-2"
                    sx={{ gridColumn: "1 / -1" }}
                  />
                  <CityAutocomplete
                    required
                    value={selectedCity}
                    onChange={handleCityChange}
                  />
                  <ZoneSelector
                    required
                    value={formData.zone}
                    onChange={handleChange}
                  />
                </div>
              </SectionCard>

              {/* Persona de Referencia */}
              <SectionCard title="Persona de Referencia (Opcional)" icon={<BadgeIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    label="Nombres"
                    name="representativeFirstName"
                    value={formData.representativeFirstName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Apellidos"
                    name="representativeLastName"
                    value={formData.representativeLastName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Identificación"
                    name="representativeIdentification"
                    value={formData.representativeIdentification}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    type="email"
                    label="Correo Electrónico"
                    name="representativeEmail"
                    value={formData.representativeEmail}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Teléfono"
                    name="representativePhone"
                    value={formData.representativePhone}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Cargo"
                    name="representativeJobTitle"
                    value={formData.representativeJobTitle}
                    onChange={handleChange}
                  />
                </div>
              </SectionCard>
            </>
          ) : (
            <>
              {/* Información Corporativa */}
              <SectionCard title="Información Corporativa" icon={<BusinessIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Razón Social"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleChange}
                    sx={{ gridColumn: "1 / -1" }}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="NIT"
                    name="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    type="email"
                    label="Correo Corporativo"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    type="email"
                    label="Correo de Facturación"
                    name="billingEmail"
                    value={formData.billingEmail}
                    onChange={handleChange}
                  />
                  <Box className="flex items-center justify-between border border-gray-100 p-3 rounded-lg bg-gray-50 col-span-1 sm:col-span-2">
                    <Box>
                      <Typography variant="subtitle2" className="font-bold text-gray-800">
                        Aplica Retefuente
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        ¿Se le aplicará retención en la fuente?
                      </Typography>
                    </Box>
                    <Switch
                      color="primary"
                      name="retefuenteApplies"
                      checked={formData.retefuenteApplies as boolean}
                      onChange={handleChange}
                    />
                  </Box>
                </div>
              </SectionCard>

              {/* Datos de Contacto */}
              <SectionCard title="Datos de Contacto" icon={<LocationOnIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Dirección"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <CityAutocomplete
                    required
                    value={selectedCity}
                    onChange={handleCityChange}
                  />
                  <ZoneSelector
                    required
                    value={formData.zone}
                    onChange={handleChange}
                  />
                </div>
              </SectionCard>

              {/* Representante Legal */}
              <SectionCard title="Representante Legal" icon={<BadgeIcon fontSize="small" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Nombres"
                    name="representativeFirstName"
                    value={formData.representativeFirstName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Apellidos"
                    name="representativeLastName"
                    value={formData.representativeLastName}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Identificación"
                    name="representativeIdentification"
                    value={formData.representativeIdentification}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    type="email"
                    label="Correo Electrónico"
                    name="representativeEmail"
                    value={formData.representativeEmail}
                    onChange={handleChange}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="Teléfono"
                    name="representativePhone"
                    value={formData.representativePhone}
                    onChange={handleChange}
                  />
                </div>
              </SectionCard>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">

          {/* Información Comercial */}
          <SectionCard title="Información Comercial" icon={<StorefrontIcon fontSize="small" />}>
            <div className="flex flex-col gap-4">
              <ClientTypeSelector
                required
                value={formData.clientTypeId}
                onChange={handleChange}
              />
              <NumericFormat
                customInput={TextField}
                size="small"
                fullWidth
                required
                label="Descuento por defecto"
                name="defaultDiscountRate"
                value={formData.defaultDiscountRate}
                onValueChange={(values) => {
                  setFormData((prev) =>
                    prev ? { ...prev, defaultDiscountRate: values.value } : prev
                  );
                }}
                suffix=" %"
                decimalScale={0}
                allowNegative={false}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return floatValue === undefined || (floatValue >= 0 && floatValue <= 100);
                }}
              />
              <PriceListAutocomplete
                required
                value={selectedPriceList}
                onChange={handlePriceListChange}
              />
            </div>
          </SectionCard>

          {/* Asesor Asignado */}
          <SectionCard title="Asesor Asignado" icon={<AccountBoxIcon fontSize="small" />}>
            <AdvisorAutocomplete
              required
              value={selectedAdvisor}
              onChange={handleAdvisorChange}
            />
          </SectionCard>
        </div>
      </div>
    </Box>
  );
};

export default ClientDetailsPage;
