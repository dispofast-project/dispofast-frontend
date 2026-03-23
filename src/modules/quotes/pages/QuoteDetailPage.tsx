import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import DataField from "../components/detailcard/DetailItem";
import { getQuoteByIdService, getPriceListsService, updateQuoteService } from "../api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote, PriceList } from "../types";
import { QuoteStatus, LegalEntityType } from "../types";
import QuoteDetailsHeaderCard from "../components/QuoteDetailsHeaderCard";
import QuotePriceListCard from "../components/QuotePriceListCard";
import QuotePaymentDetailsCard from "../components/QuotePaymentDetailsCard";

const SectionTitle = ({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Typography
    variant="overline"
    className="text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-1.5"
    component="div"
  >
    {icon}
    {children}
  </Typography>
);

interface QuoteState {
  data: Quote | null;
  isLoading: boolean;
  error: string | null;
}

const QuoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quoteState, setQuoteState] = useState<QuoteState>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [selectedPriceListId, setSelectedPriceListId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    getQuoteByIdService(id)
      .then((data) => {
        if (!isMounted) return;
        setQuoteState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setQuoteState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Error al cargar la cotización.",
        });
      });

    getPriceListsService()
      .then((data) => {
        if (isMounted) setPriceLists(data);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const { data: quote, isLoading, error } = quoteState;

  useEffect(() => {
    if (quote?.priceList?.id) {
      setSelectedPriceListId(quote.priceList.id);
    }
  }, [quote]);

  const handleCreateOrder = async () => {
    if (!id) return;
    setIsCreatingOrder(true);
    setOrderError(null);
    try {
      const order = await createOrderFromQuote(id);
      navigate(`/ordenes/${order.id}`);
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : "Error al crear la orden.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSave = async () => {
    if (!id || selectedPriceListId === quote?.priceList?.id) return;
    setIsSaving(true);
    try {
      await updateQuoteService(id, { priceListId: selectedPriceListId });
      const newPriceList = priceLists.find((pl) => pl.id === selectedPriceListId);
      if (newPriceList && quote) {
        setQuoteState((prev) => ({
          ...prev,
          data: { ...quote, priceList: newPriceList },
        }));
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !quote) {
    return (
      <Box className="p-4">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Volver
        </Button>
        <Box className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error ?? "Cotización no encontrada."}
        </Box>
      </Box>
    );
  }

  const isEmpresa = quote.account.legalEntityType === LegalEntityType.EMPRESA;

  return (
    <Box className="p-4 sm:p-8 max-w-7xl mx-auto" component="div">
      {/* Barra superior */}
      <Box className="flex items-center gap-4 mb-6">
        <IconButton
          onClick={() => navigate(-1)}
          size="small"
          className="border border-gray-200 rounded-lg"
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" className="font-extrabold text-gray-900">
          Detalle de Cotización
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Columna principal ── */}
        <Box className="lg:col-span-2 flex flex-col gap-6">
          {/* 1. Header */}
          <QuoteDetailsHeaderCard quote={quote} />

          {/* 2. Información del cliente — se bifurca por tipo */}
          {isEmpresa ? (
            <EmpresaClientSection account={quote.account} location={quote.location} />
          ) : (
            <NaturalClientSection account={quote.account} location={quote.location} />
          )}
        </Box>

        {/* ── Columna lateral ── */}
        <Box className="flex flex-col gap-6">
          {/* Convertir a Orden (solo si está aprobada) */}
          {quote.status === QuoteStatus.ACCEPTED && (
            <Box className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <SectionTitle icon={<ShoppingCartIcon fontSize="small" />}>
                Orden de Compra
              </SectionTitle>
              <Typography variant="body2" className="text-gray-500 mb-4">
                Esta cotización está aprobada. Puedes generar una orden de compra.
              </Typography>
              {orderError && (
                <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem" }}>
                  {orderError}
                </Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                startIcon={
                  isCreatingOrder ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                disabled={isCreatingOrder}
                onClick={handleCreateOrder}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {isCreatingOrder ? "Creando orden..." : "Convertir a Orden"}
              </Button>
            </Box>
          )}

          {/* Lista de precios */}
          <QuotePriceListCard
            quote={quote}
            priceLists={priceLists}
            selectedPriceListId={selectedPriceListId}
            setSelectedPriceListId={setSelectedPriceListId}
            isSaving={isSaving}
            handleSave={handleSave}
          />

          {/* Detalles de pago */}
          <QuotePaymentDetailsCard quote={quote} />
        </Box>
      </Box>
    </Box>
  );
};

// ────────────────────────────────────────────────────────────────
// Sección para EMPRESA
// ────────────────────────────────────────────────────────────────
const EmpresaClientSection = ({
  account,
  location,
}: {
  account: Quote["account"];
  location: Quote["location"];
}) => {
  const hasRepresentative =
    account.representativeFirstName || account.representativeLastName;

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
      {/* Datos de la empresa */}
      <Box>
        <SectionTitle icon={<BusinessIcon fontSize="small" />}>
          Datos de la Empresa
        </SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField
            label="Razón Social"
            value={account.legalName}
          />
          <DataField label="NIT" value={account.identificationNumber} />
          <DataField label="Correo Corporativo" value={account.email} />
          <DataField label="Correo de Facturación" value={account.billingEmail} />
          <DataField label="Teléfono" value={account.phone} />
          <DataField label="Dirección" value={account.address} />
        </Box>
      </Box>

      {/* Representante Legal */}
      {hasRepresentative && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>
              Representante Legal
            </SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={account.representativeFirstName} />
              <DataField label="Apellidos" value={account.representativeLastName} />
              <DataField
                label="Identificación"
                value={account.representativeIdentification}
              />
              <DataField label="Email" value={account.representativeEmail} />
              <DataField label="Teléfono" value={account.representativePhone} />
            </Box>
          </Box>
        </>
      )}

      {/* Ubicación */}
      <Box className="h-px bg-gray-100" />
      <LocationSection location={location} />
    </Box>
  );
};

// ────────────────────────────────────────────────────────────────
// Sección para PERSONA NATURAL
// ────────────────────────────────────────────────────────────────
const NaturalClientSection = ({
  account,
  location,
}: {
  account: Quote["account"];
  location: Quote["location"];
}) => {
  const hasReference =
    account.representativeFirstName || account.representativeLastName;

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
      {/* Datos personales */}
      <Box>
        <SectionTitle icon={<PersonIcon fontSize="small" />}>
          Datos Personales
        </SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Nombres" value={account.firstName} />
          <DataField label="Apellidos" value={account.lastName} />
          <DataField label="Cédula" value={account.identificationNumber} />
          <DataField
            label="Aplica Retefuente"
            value={account.retefuenteApplies ? "Sí" : "No"}
          />
          <DataField label="Email" value={account.email} />
          <DataField label="Teléfono" value={account.phone} />
          <DataField label="Dirección" value={account.address} />
        </Box>
      </Box>

      {/* Persona de referencia (opcional) */}
      {hasReference && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>
              Persona de Referencia
            </SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={account.representativeFirstName} />
              <DataField label="Apellidos" value={account.representativeLastName} />
              <DataField
                label="Identificación"
                value={account.representativeIdentification}
              />
              <DataField label="Cargo" value={account.representativeJobTitle} />
              <DataField label="Email" value={account.representativeEmail} />
              <DataField label="Teléfono" value={account.representativePhone} />
            </Box>
          </Box>
        </>
      )}

      {/* Ubicación */}
      <Box className="h-px bg-gray-100" />
      <LocationSection location={location} />
    </Box>
  );
};

// ────────────────────────────────────────────────────────────────
// Sección de ubicación (compartida)
// ────────────────────────────────────────────────────────────────
const LocationSection = ({ location }: { location: Quote["location"] }) => (
  <Box>
    <SectionTitle icon={<LocationOnIcon fontSize="small" />}>Ubicación</SectionTitle>
    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      <DataField label="Ciudad" value={location?.name} />
      <DataField label="Departamento" value={location?.department?.name} />
    </Box>
  </Box>
);

export default QuoteDetailPage;
