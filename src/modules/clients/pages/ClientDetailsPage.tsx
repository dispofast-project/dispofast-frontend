import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { getClientByIdService } from "../api/clients.api";
import type { ClientResponse, IndividualResponse, OrganizationResponse } from "../types";
import { LegalEntityType } from "../types";
import ClientDetailsHeader from "../components/ClientDetailsHeader";

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
          <Typography variant="h6" className="font-semibold mb-2">Error</Typography>
          <Typography>{error || "No se encontró el cliente."}</Typography>
        </Box>
      </Box>
    );
  }

  // Helpers
  const isOrganization = client.legalEntityType === LegalEntityType.LEGAL;
  
  const individualData = client as IndividualResponse;
  const organizationData = client as OrganizationResponse;

  return (
    <Box className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* ── Top Navigation & Actions ── */}
      <ClientDetailsHeader client={client} />

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Data Blocks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bloque: Información General */}
          <Card className="shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 mb-6">
            <Box className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <Typography variant="h6" className="font-semibold text-gray-800">
                Información general
              </Typography>
            </Box>
            <CardContent className="p-6">
              <Grid container spacing={4}>
                {/* Column 1: Client Information */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Tipo de Cliente
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium capitalize">
                      {client.legalEntityType}
                    </Typography>
                  </Box>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Razón Social / Nombre
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.name}
                    </Typography>
                  </Box>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Identificación / NIT
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.identificationNumber}
                    </Typography>
                  </Box>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Aplica Retefuente
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.retefuenteApplies ? "Sí" : "No"}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Column 2: Contact Data */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.phone}
                    </Typography>
                  </Box>
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Correo Electrónico
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.email}
                    </Typography>
                  </Box>
                  {isOrganization && (
                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                        Facturación Electrónica
                      </Typography>
                      <Typography variant="body1" className="text-gray-900 font-medium">
                        {organizationData.billingEmail || "No registrado"}
                      </Typography>
                    </Box>
                  )}
                  <Box className="mb-4">
                    <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Dirección
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-medium">
                      {client.address}, {client.city?.name || "Ciudad no especificada"} {client.zone ? `- ${client.zone}` : ""}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Bloque: Representante Legal (Conditional) */}
          {isOrganization && (
            <Card className="shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 mb-6">
              <Box className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                <Typography variant="h6" className="font-semibold text-gray-800">
                  Representante Legal
                </Typography>
              </Box>
              <CardContent className="p-6">
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" className="text-gray-900 font-medium">
                        {organizationData.representativeFirstName} {organizationData.representativeLastName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                        Cédula
                      </Typography>
                      <Typography variant="body1" className="text-gray-900 font-medium">
                        {organizationData.representativeIdentification}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                        Correo Electrónico
                      </Typography>
                      <Typography variant="body1" className="text-gray-900 font-medium">
                        {organizationData.representativeEmail}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                        Teléfono
                      </Typography>
                      <Typography variant="body1" className="text-gray-900 font-medium">
                        {organizationData.representativePhone}
                      </Typography>
                    </Box>
                  </Grid>
                  {!isOrganization && individualData.representativeJobTitle && (
                    <Grid size={12}>
                      <Box className="mb-0">
                        <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                          Cargo
                        </Typography>
                        <Typography variant="body1" className="text-gray-900 font-medium">
                          {individualData.representativeJobTitle}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN: Información Comercial Cards & Asesor */}
        <div className="lg:col-span-4">
          <Typography variant="h6" className="font-bold text-gray-800 mb-4 px-1">
            Información Comercial
          </Typography>

          <Grid container spacing={2} className="mb-6">
            <Grid size={6}>
              <Card className="shadow-sm border border-blue-50 bg-blue-50/50 rounded-xl h-full">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                  <StorefrontIcon className="text-blue-500 mb-2" />
                  <Typography variant="caption" className="text-gray-500 uppercase font-semibold mb-1">
                    Tipo de Cliente
                  </Typography>
                  <Typography variant="body2" className="text-gray-900 font-bold">
                    {client.clientType?.name || "Sin Clasificar"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={6}>
              <Card className="shadow-sm border border-emerald-50 bg-emerald-50/50 rounded-xl h-full">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                  <LocalOfferIcon className="text-emerald-500 mb-2" />
                  <Typography variant="caption" className="text-gray-500 uppercase font-semibold mb-1">
                    Descuento Base
                  </Typography>
                  <Typography variant="h6" className="text-gray-900 font-bold">
                    {client.defaultDiscountRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Card className="shadow-sm border border-purple-50 bg-purple-50/50 rounded-xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <Box className="p-2 bg-purple-100 rounded-lg">
                    <PaymentsIcon className="text-purple-600" />
                  </Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-500 uppercase font-semibold block">
                      Lista de Precios
                    </Typography>
                    <Typography variant="body1" className="text-gray-900 font-bold">
                      {client.priceList?.name || "Lista Estándar"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card className="shadow-sm border border-gray-100 rounded-xl mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <Box className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <Typography variant="h6" className="font-semibold text-gray-800 flex items-center gap-2">
                <AccountBoxIcon fontSize="small" className="text-gray-500"/>
                Asesor Asignado
              </Typography>
            </Box>
            <CardContent className="p-6">
              {client.defaultAdvisor ? (
                <Box>
                  <Box className="flex items-center gap-3 mb-4">
                    <Box className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {client.defaultAdvisor.fullName.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" className="font-semibold text-gray-900 leading-tight">
                        {client.defaultAdvisor.fullName}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        Asesor Comercial
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" size="small" className="w-full text-blue-600 border-blue-200" sx={{textTransform: 'none', borderRadius: '8px'}}>
                    Contactar asesor
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" className="text-gray-500 italic text-center py-4">
                  Sin asesor asignado
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
};

export default ClientDetailsPage;
