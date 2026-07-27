import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  getQuoteByIdService,
  completeProspectClientService,
} from "../../quotes/api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote } from "../../quotes/types";
import { LegalEntityType } from "../types";
import { useNotificationStore } from "../../../shared/store";
import { useClientForm } from "../hooks/useClientForm";
import { EntityTypeSelector } from "../components/form/EntityTypeSelector";
import { GeneralDataFields } from "../components/form/GeneralDataFields";
import { NaturalPersonFields } from "../components/form/NaturalPersonFields";
import { OrganizationFields } from "../components/form/OrganizationFields";
import { RepresentativeFields } from "../components/form/RepresentativeFields";
import { FormActions } from "../components/form/FormActions";
import LegalDocumentUploadZone, { type DocumentItem } from "../components/LegalDocumentUploadZone";
import type { ClientFormData } from "../components/form/types";

const CompleteProspectClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getQuoteByIdService(id)
      .then((data) => setQuote(data))
      .catch(() => setLoadError("No se pudo cargar la cotización."))
      .finally(() => setIsLoadingQuote(false));
  }, [id]);

  const prospect = quote?.prospect;

  const initialValues: Partial<ClientFormData> = {
    email: prospect?.email ?? "",
    phone: prospect?.phone ?? "",
    clientTypeId: prospect?.clientTypeId != null ? String(prospect.clientTypeId) : "",
    ...(prospect?.legalEntityType === LegalEntityType.LEGAL
      ? { legalName: prospect.name }
      : { firstName: prospect?.name ?? "" }),
  };

  const {
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
  } = useClientForm({
    initialValues,
    initialEntityType: prospect?.legalEntityType ?? null,
    onSubmitClient: (payload) => completeProspectClientService(id!, payload),
    getClientId: (updatedQuote) => updatedQuote.account.id,
    onSuccess: async (updatedQuote) => {
      showNotification("Cliente creado, generando la orden...", "success");
      const order = await createOrderFromQuote(updatedQuote.id);
      navigate(`/ordenes/${order.id}`);
    },
  });

  if (isLoadingQuote) {
    return (
      <Box className="flex justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  if (loadError || !quote) {
    return (
      <Box className="max-w-4xl mx-auto p-4 sm:p-6">
        <Alert severity="error">{loadError ?? "Cotización no encontrada."}</Alert>
      </Box>
    );
  }

  return (
    <Box className="max-w-4xl mx-auto p-4 sm:p-6">
      <Box className="flex items-center mb-4">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/cotizaciones/${id}`)}
          sx={{ mr: 2, color: "text.secondary" }}
          size="small"
        >
          Volver
        </Button>
      </Box>

      <Box className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-1">
            Completar Cliente del Prospecto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa los datos que faltan para convertir el prospecto de la cotización {quote.number} en un cliente y generar la orden.
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

              {entityType === LegalEntityType.LEGAL && (
                <Box className="mt-6 pt-6 border-t border-gray-100">
                  <Box className="flex items-center gap-2 mb-4">
                    <DescriptionIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" className="font-semibold text-gray-700">
                      Documentos Legales *
                    </Typography>
                  </Box>
                  <LegalDocumentUploadZone
                    items={documents.map<DocumentItem>((f, i) => ({
                      key: String(i),
                      name: f.name,
                      meta: f.size < 1024 * 1024
                        ? `${(f.size / 1024).toFixed(1)} KB`
                        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                      onDelete: () => setDocuments((prev) => prev.filter((_, idx) => idx !== i)),
                    }))}
                    onAdd={(files) => {
                      setDocumentsError(false);
                      setDocuments((prev) => [...prev, ...files]);
                    }}
                    error={documentsError}
                    errorMessage="Debe adjuntar al menos un documento legal."
                  />
                </Box>
              )}

              <FormActions isLoading={isLoading} onCancel={() => navigate(`/cotizaciones/${id}`)} />
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default CompleteProspectClientPage;
