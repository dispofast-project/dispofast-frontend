import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getClientByIdService } from "../api/clients.api";
import type { ClientResponse, IndividualResponse, OrganizationResponse } from "../types";
import { LegalEntityType } from "../types";
import ClientDetailsHeader from "../components/ClientDetailsHeader";
import PersonalInfoSection from "../components/detail/PersonalInfoSection";
import CorporateInfoSection from "../components/detail/CorporateInfoSection";
import ContactSection from "../components/detail/ContactSection";
import RepresentativeSection from "../components/detail/RepresentativeSection";
import CommercialSidebar from "../components/detail/CommercialSidebar";
import AdvisorCard from "../components/detail/AdvisorCard";

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const clientData = await getClientByIdService(id);
        setClient(clientData);
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

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center p-20 min-h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client) {
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
  const individualData = client as IndividualResponse;
  const organizationData = client as OrganizationResponse;

  const hasRepresentative = isNatural
    ? !!individualData.representativeFirstName
    : !!organizationData.representativeFirstName;

  return (
    <Box className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Navigation & Actions */}
      <ClientDetailsHeader client={client} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Data Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {isNatural ? (
            <>
              <PersonalInfoSection client={individualData} />
              <ContactSection client={client} showEmail={true} />
              {hasRepresentative && (
                <RepresentativeSection
                  client={individualData}
                  showJobTitle={true}
                  title="Persona de Referencia"
                />
              )}
            </>
          ) : (
            <>
              <CorporateInfoSection client={organizationData} />
              <ContactSection client={client} showEmail={false} />
              {hasRepresentative && (
                <RepresentativeSection
                  client={organizationData}
                  showJobTitle={false}
                  title="Representante Legal"
                />
              )}
            </>
          )}
        </div>

        {/* Right Column: Commercial Info & Advisor */}
        <div className="lg:col-span-4 space-y-6">
          <CommercialSidebar client={client} />
          <AdvisorCard advisor={client.defaultAdvisor} />
        </div>
      </div>
    </Box>
  );
};

export default ClientDetailsPage;
