import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  getQuoteByIdService,
  getPriceListsService,
  getClientByIdService,
  createQuoteService,
  addQuoteItemService,
} from "../api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote, PriceList, ClientDetails } from "../types";
import { QuoteStatus } from "../types";
import { useQuoteEdit } from "../hooks/useQuoteEdit";
import { useAuth } from "../../iam/hooks/useAuth";

import QuoteDetailsHeaderCard from "../components/QuoteDetailsHeaderCard";
import QuoteCreateHeaderCard from "../components/QuoteCreateHeaderCard";
import QuoteClientCard from "../components/QuoteClientCard";
import QuoteAdvisorCard from "../components/QuoteAdvisorCard";
import QuoteTermsCard from "../components/QuoteTermsCard";
import QuotePriceListCard from "../components/QuotePriceListCard";
import QuotePaymentDetailsCard from "../components/QuotePaymentDetailsCard";
import QuoteOrderCard from "../components/QuoteOrderCard";
import QuoteItemsSection from "../components/QuoteItemsSection";
import type { QuoteItemsSectionHandle } from "../components/QuoteItemsSection";
import QuoteItemsDraftSection from "../components/QuoteItemsDraftSection";
import type { QuoteItemsDraftSectionHandle } from "../components/QuoteItemsDraftSection";
import type { DraftTotals } from "../components/QuoteItemsDraftSection";
import QuoteSummaryPanel from "../components/QuoteSummaryPanel/QuoteSummaryPanel";

interface QuoteDetailPageProps {
  mode: "create" | "edit";
}

interface QuoteState {
  data: Quote | null;
  isLoading: boolean;
  error: string | null;
}

interface ClientState {
  data: ClientDetails | null;
  isLoading: boolean;
  error: string | null;
}

const QuoteDetailPage = ({ mode }: QuoteDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const [quoteState, setQuoteState] = useState<QuoteState>({
    data: null,
    isLoading: mode === "edit",
    error: null,
  });
  const [clientState, setClientState] = useState<ClientState>({
    data: null,
    isLoading: mode === "create",
    error: null,
  });
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [hasItemChanges, setHasItemChanges] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [freight, setFreight] = useState(0);
  const [draftTotals, setDraftTotals] = useState<DraftTotals>({ subtotal: 0, tax: 0, itemCount: 0 });

  const quoteItemsRef = useRef<QuoteItemsSectionHandle>(null);
  const draftItemsRef = useRef<QuoteItemsDraftSectionHandle>(null);

  const { data: quote, isLoading: isQuoteLoading, error: quoteError } = quoteState;
  const { data: client, isLoading: isClientLoading, error: clientError } = clientState;
  const { authorities } = useAuth();
  const isAdmin = authorities.includes("ROLE_ADMIN");

  const {
    selectedSeller,
    setSelectedSeller,
    selectedPriceListId,
    setSelectedPriceListId,
    selectedPaymentCondition,
    setSelectedPaymentCondition,
    selectedOfferValidity,
    setSelectedOfferValidity,
    commercialRate,
    setCommercialRate,
    otherRate,
    setOtherRate,
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  } = useQuoteEdit(quote, (updated) =>
    setQuoteState((prev) => ({ ...prev, data: updated })),
  );

  // Edit mode: fetch quote + price lists
  useEffect(() => {
    if (mode !== "edit" || !id) return;
    let isMounted = true;

    getQuoteByIdService(id)
      .then((data) => {
        if (isMounted) setQuoteState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isMounted)
          setQuoteState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error al cargar la cotización.",
          });
      });

    getPriceListsService()
      .then((data) => { if (isMounted) setPriceLists(data); })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [id, mode]);

  // Create mode: fetch client info + price lists
  useEffect(() => {
    if (mode !== "create" || !clientId) return;
    let isMounted = true;

    getClientByIdService(clientId)
      .then((data) => {
        if (isMounted) setClientState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isMounted)
          setClientState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error al cargar el cliente.",
          });
      });

    getPriceListsService()
      .then((data) => { if (isMounted) setPriceLists(data); })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [clientId, mode]);

  // Pre-populate form defaults from client data in create mode
  useEffect(() => {
    if (mode !== "create" || !client) return;
    if (client.defaultAdvisor) {
      setSelectedSeller({
        id: client.defaultAdvisor.id,
        name: client.defaultAdvisor.fullName,
        email: "",
        role: "",
        effectivePermissions: [],
      });
    }
    if (client.priceList) {
      setSelectedPriceListId(client.priceList.id);
    }
    if (client.defaultDiscountRate != null) {
      setCommercialRate(String(Math.round(client.defaultDiscountRate * 100)));
    }
  }, [client, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (mode === "create") {
      if (!clientId) return;
      setIsCreating(true);
      setCreateError(null);
      try {
        const newQuote = await createQuoteService(clientId);
        await handleSaveAll(newQuote.id);
        const draftItems = draftItemsRef.current?.getItems() ?? [];
        await Promise.all(
          draftItems.map((item) =>
            addQuoteItemService(newQuote.id, {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }),
          ),
        );
        navigate(`/cotizaciones/${newQuote.id}`);
      } catch (err: unknown) {
        setCreateError(err instanceof Error ? err.message : "Error al crear la cotización.");
      } finally {
        setIsCreating(false);
      }
    } else {
      if (!id) return;
      if (hasChanges) handleSaveAll(id);
      if (hasItemChanges) quoteItemsRef.current?.saveChanges();
    }
  };

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

  const handleDraftTotalsChange = useCallback((totals: DraftTotals) => {
    setDraftTotals(totals);
  }, []);

  const createSummary = useMemo(() => {
    const { subtotal, tax } = draftTotals;
    const commRate = parseFloat(commercialRate ?? "0") / 100;
    const othRate = parseFloat(otherRate ?? "0") / 100;
    const commercialDiscountAmt = subtotal * commRate;
    const otherDiscountAmt = subtotal * othRate;
    const retefuenteAmt = client?.retefuenteApplies ? subtotal * 0.035 : 0;
    const total = subtotal + tax - commercialDiscountAmt - otherDiscountAmt - retefuenteAmt + freight;
    return { subtotal, tax, commercialDiscountAmt, otherDiscountAmt, retefuenteAmt, total };
  }, [draftTotals, commercialRate, otherRate, client, freight]);

  const createMissingFields = useMemo(() => {
    const fields: string[] = [];
    if (!selectedPriceListId) fields.push("Lista de precios");
    if (!selectedSeller) fields.push("Asesor");
    return fields;
  }, [selectedPriceListId, selectedSeller]);

  const isPageLoading = mode === "edit" ? isQuoteLoading : isClientLoading;
  const pageError = mode === "edit" ? quoteError : clientError;

  if (isPageLoading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (pageError || (mode === "edit" && !quote) || (mode === "create" && !client)) {
    return (
      <Box className="p-4">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Volver
        </Button>
        <Box className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {pageError ?? (mode === "edit" ? "Cotización no encontrada." : "Cliente no encontrado.")}
        </Box>
      </Box>
    );
  }

  const isSaveDisabled =
    isCreating || isSaving || (mode === "edit" && !hasChanges && !hasItemChanges);
  const displayError = createError ?? saveError;
  const pageTitle = mode === "create" ? "Nueva Cotización" : "Detalle de Cotización";

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
          {pageTitle}
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Columna principal ── */}
        <Box className="lg:col-span-2 flex flex-col gap-6">
          {mode === "edit" && quote ? (
            <>
              <QuoteDetailsHeaderCard
                quote={quote}
                onUpdated={(updated) => setQuoteState((prev) => ({ ...prev, data: updated }))}
              />
              <QuoteClientCard account={quote.account} location={quote.location} />
            </>
          ) : (
            <QuoteCreateHeaderCard client={client!} />
          )}

          <QuoteAdvisorCard
            value={selectedSeller}
            onChange={setSelectedSeller}
            readOnly={!isAdmin}
          />
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

          {mode === "create" && (
            <QuotePriceListCard
              quote={null}
              priceLists={priceLists}
              selectedPriceListId={selectedPriceListId}
              setSelectedPriceListId={setSelectedPriceListId}
            />
          )}

          {mode === "edit" && quote ? (
            <QuoteItemsSection
              ref={quoteItemsRef}
              quoteId={quote.id}
              priceListId={quote.priceList.id}
              onHasPendingChanges={setHasItemChanges}
              onItemsChanged={() =>
                getQuoteByIdService(id!).then((data) =>
                  setQuoteState((prev) => ({ ...prev, data }))
                )
              }
            />
          ) : (
            <QuoteItemsDraftSection
              ref={draftItemsRef}
              priceListId={selectedPriceListId ?? ""}
              onTotalsChange={handleDraftTotalsChange}
            />
          )}
        </Box>

        {/* ── Columna lateral ── */}
        <Box className="flex flex-col gap-6">
          {mode === "create" && client ? (
            <QuoteSummaryPanel
              client={client}
              subtotal={createSummary.subtotal}
              tax={createSummary.tax}
              commercialDiscountAmt={createSummary.commercialDiscountAmt}
              otherDiscountAmt={createSummary.otherDiscountAmt}
              retefuenteAmt={createSummary.retefuenteAmt}
              freight={freight}
              onFreightChange={setFreight}
              total={createSummary.total}
              itemCount={draftTotals.itemCount}
              missingFields={createMissingFields}
              isSaving={isCreating}
              error={createError}
              onSave={handleSave}
            />
          ) : (
            <>
              {mode === "edit" && quote?.status === QuoteStatus.ACCEPTED && (
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
              {mode === "edit" && quote && (
                <QuotePaymentDetailsCard quote={quote} />
              )}
              {/* Guardar — solo en modo edición */}
              <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                {displayError && (
                  <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
                    {displayError}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  disabled={isSaveDisabled}
                  onClick={handleSave}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  {isSaving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuoteDetailPage;
