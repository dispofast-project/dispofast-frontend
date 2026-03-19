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
import {
  User,
} from "lucide-react";

import DataField from "../components/detailcard/DetailItem";
import DetailSection from "../components/detailcard/DetailSection";
import { getQuoteByIdService, getPriceListsService, updateQuoteService } from "../api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote, PriceList } from "../types";
import { QuoteStatus } from "../types";
import QuoteDetailsHeaderCard from "../components/QuoteDetailsHeaderCard";
import QuotePriceListCard from "../components/QuotePriceListCard";
import QuotePaymentDetailsCard from "../components/QuotePaymentDetailsCard";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    className="text-gray-500 font-bold tracking-widest mb-4 block"
  >
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
  const [selectedPriceListId, setSelectedPriceListId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    // We can avoid setting isLoading to true here strictly because 
    // the initial state is already set to isLoading = true, 
    // which fixes the linter issue for cascading renders.
    
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
        .then(data => {
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
      const newPriceList = priceLists.find(pl => pl.id === selectedPriceListId);
      if (newPriceList && quote) {
        setQuoteState(prev => ({ ...prev, data: { ...quote, priceList: newPriceList } }));
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

  const clientName = (quote?.account?.organization?.legalName || quote?.account?.name || `${quote?.account?.firstName || ""} ${quote?.account?.lastName || ""}`).trim() || "N/A";
  const initials = clientName.substring(0, 2).toUpperCase();

  return (
    <Box className="p-4 sm:p-8 max-w-7xl mx-auto" component="div">
      {/* ── Barra Superior ── */}
      <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Box className="flex items-center gap-4">
          <IconButton onClick={() => navigate(-1)} size="small" className="border border-gray-200 rounded-lg">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" className="font-extrabold text-gray-900">
            Detalle de Cotización
          </Typography>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUMNA 1 (Izquierda) === */}
        <Box className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. SECCIÓN PRINCIPAL */}
          <QuoteDetailsHeaderCard quote={quote} clientName={clientName} initials={initials} />

          {/* 2. SECCIÓN DETALLE DEL CLIENTE / ORGANIZACIÓN */}
          <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <SectionTitle>
              <User size={16} className="inline mr-2 align-text-bottom"/>
              {quote?.account?.organization?.legalName ? "Información del Cliente" : "Detalle del Cliente"}
            </SectionTitle>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Si hay organización, mostrar los datos de la empresa primero */}
              {quote?.account?.organization && (
                <DetailSection>
                  <DataField label="Razón Social" value={quote.account.organization.legalName} />
                  <DataField label="NIT" value={quote.account.organization.nit} />
                  <DataField label="Dirección" value={quote.account.organization.address} />
                  <DataField label="Teléfono de la Empresa" value={quote.account.organization.phone} />
                  <DataField label="Email de Facturación" value={quote.account.organization.billingEmail} />
                  <DataField label="Email General" value={quote.account.organization.generalEmail} />
                </DetailSection>
              )}

              <DetailSection title={quote?.account?.organization ? "Representante Legal" : undefined}>
                <DataField label="Nombres" value={quote?.account?.firstName || quote?.account?.organization?.representativeFirstName || quote?.account?.representativeFirstName} />
                <DataField label="Apellidos" value={quote?.account?.lastName || quote?.account?.organization?.representativeLastName || quote?.account?.representativeLastName} />
                <DataField label="Identificación" value={quote?.account?.identificationNumber || quote?.account?.organization?.representativeIdentification || quote?.account?.representativeIdentification} />
                <DataField label="Cargo" value={quote?.account?.jobTitle || quote?.account?.representativeJobTitle} />
                <DataField label="Email" value={quote?.account?.email || quote?.account?.organization?.representativeEmail || quote?.account?.representativeEmail} />
                <DataField label="Teléfono" value={quote?.account?.phone || quote?.account?.organization?.representativePhone || quote?.account?.representativePhone} />
              </DetailSection>
              
              <DetailSection title="Ubicación">
                <DataField label="Ciudad" value={quote?.location?.name} />
                <DataField label="Departamento" value={quote?.location?.department?.name} />
              </DetailSection>
            </Box>
          </Box>

          {/* 3. SECCIÓN LISTADO DE PRODUCTOS */}
          <Box className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 border-dashed flex items-center justify-center min-h-[150px]">
             <Typography variant="body1" className="text-blue-500 font-medium text-center">
                Sección de listados de productos<br/>
                <span className="text-sm opacity-80">(de momento no se implementará)</span>
             </Typography>
          </Box>

        </Box>

        {/* === COLUMNA 2 (Derecha) === */}
        <Box className="flex flex-col gap-6">
          
          {/* 1. CONVERTIR A ORDEN (solo si está aprobada) */}
          {quote.status === QuoteStatus.ACCEPTED && (
            <Box className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <SectionTitle>Orden de Compra</SectionTitle>
              <Typography variant="body2" className="text-gray-500 mb-4">
                Esta cotización está aprobada. Puedes generar una orden de compra a partir de ella.
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

          {/* 2. LISTA DE PRECIOS */}
          <QuotePriceListCard 
            quote={quote}
            priceLists={priceLists}
            selectedPriceListId={selectedPriceListId}
            setSelectedPriceListId={setSelectedPriceListId}
            isSaving={isSaving}
            handleSave={handleSave}
          />

          {/* 2. DETALLES DE PAGO */}
          <QuotePaymentDetailsCard quote={quote} />

        </Box>

      </Box>
    </Box>
  );
};

export default QuoteDetailPage;
