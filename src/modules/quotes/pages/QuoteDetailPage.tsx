import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getQuoteByIdService, getPriceListsService } from "../api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote, PriceList } from "../types";
import { QuoteStatus } from "../types";
import { useQuoteEdit } from "../hooks/useQuoteEdit";
import { useAuth } from "../../iam/hooks/useAuth";

import QuoteDetailsHeaderCard from "../components/QuoteDetailsHeaderCard";
import QuoteClientCard from "../components/QuoteClientCard";
import QuoteAdvisorCard from "../components/QuoteAdvisorCard";
import QuoteTermsCard from "../components/QuoteTermsCard";
import QuotePriceListCard from "../components/QuotePriceListCard";
import QuotePaymentDetailsCard from "../components/QuotePaymentDetailsCard";
import QuoteOrderCard from "../components/QuoteOrderCard";

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
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { data: quote, isLoading, error } = quoteState;
  const { authorities } = useAuth();
  const isAdmin = authorities.includes("ROLE_ADMIN");

  const {
    selectedSeller, setSelectedSeller,
    selectedPriceListId, setSelectedPriceListId,
    selectedPaymentCondition, setSelectedPaymentCondition,
    selectedOfferValidity, setSelectedOfferValidity,
    commercialRate, setCommercialRate,
    otherRate, setOtherRate,
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  } = useQuoteEdit(quote, (updated) =>
    setQuoteState((prev) => ({ ...prev, data: updated })),
  );

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    getQuoteByIdService(id)
      .then((data) => { if (isMounted) setQuoteState({ data, isLoading: false, error: null }); })
      .catch((err: unknown) => {
        if (isMounted)
          setQuoteState({ data: null, isLoading: false, error: err instanceof Error ? err.message : "Error al cargar la cotización." });
      });

    getPriceListsService()
      .then((data) => { if (isMounted) setPriceLists(data); })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [id]);

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

  return (
    <Box className="p-4 sm:p-8 max-w-7xl mx-auto" component="div">
      {/* Barra superior */}
      <Box className="flex items-center gap-4 mb-6">
        <IconButton onClick={() => navigate(-1)} size="small" className="border border-gray-200 rounded-lg">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" className="font-extrabold text-gray-900">
          Detalle de Cotización
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Columna principal ── */}
        <Box className="lg:col-span-2 flex flex-col gap-6">
          <QuoteDetailsHeaderCard quote={quote} />
          <QuoteClientCard account={quote.account} location={quote.location} />
          <QuoteAdvisorCard value={selectedSeller} onChange={setSelectedSeller} readOnly={!isAdmin} />
          <QuoteTermsCard
            paymentCondition={selectedPaymentCondition}
            offerValidity={selectedOfferValidity}
            commercialRate={commercialRate}
            otherRate={otherRate}
            onPaymentConditionChange={setSelectedPaymentCondition}
            onOfferValidityChange={setSelectedOfferValidity}
            onCommercialRateChange={setCommercialRate}
            onOtherRateChange={setOtherRate}
          />
        </Box>

        {/* ── Columna lateral ── */}
        <Box className="flex flex-col gap-6">
          {quote.status === QuoteStatus.ACCEPTED && (
            <QuoteOrderCard
              isCreatingOrder={isCreatingOrder}
              orderError={orderError}
              onCreateOrder={handleCreateOrder}
            />
          )}
          <QuotePriceListCard
            quote={quote}
            priceLists={priceLists}
            selectedPriceListId={selectedPriceListId}
            setSelectedPriceListId={setSelectedPriceListId}
          />
          <QuotePaymentDetailsCard quote={quote} />

          {/* Guardar cambios */}
          <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
            {saveError && (
              <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
                {saveError}
              </Alert>
            )}
            <Button
              variant="contained"
              fullWidth
              disabled={isSaving || !hasChanges}
              onClick={() => id && handleSaveAll(id)}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {isSaving ? <CircularProgress size={20} color="inherit" /> : "Guardar cambios"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuoteDetailPage;
