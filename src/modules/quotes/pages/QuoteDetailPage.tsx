import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  getQuoteByIdService,
  getPriceListsService,
  getClientByIdService,
  createQuoteService,
  createQuoteFromProspectService,
  addQuoteItemService,
} from "../api/quotes.api";
import { createOrderFromQuote } from "../../orders/api/order.service";
import type { Quote, PriceList, ClientDetails, ProspectDetails } from "../types";
import { QuoteStatus, LegalEntityType } from "../types";
import { useQuoteEdit } from "../hooks/useQuoteEdit";
import { useAuth } from "../../iam/hooks/useAuth";

import QuoteDetailsHeaderCard from "../components/QuoteDetailsHeaderCard";
import QuoteCreateHeaderCard from "../components/QuoteCreateHeaderCard";
import QuoteProspectHeaderCard from "../components/QuoteProspectHeaderCard";
import QuoteClientCard from "../components/QuoteClientCard";
import QuoteAdvisorCard from "../components/QuoteAdvisorCard";
import QuoteTermsCard from "../components/QuoteTermsCard";
import QuotePriceListCard from "../components/QuotePriceListCard";
import QuotePaymentDetailsCard from "../components/QuotePaymentDetailsCard";
import QuoteOrderCard from "../components/QuoteOrderCard";
import QuoteItemsSection from "../components/QuoteItemsSection";
import type { QuoteItemsSectionHandle } from "../components/QuoteItemsSection";
import QuoteItemsDraftSection from "../components/QuoteItemsDraftSection";
import type { QuoteItemsDraftSectionHandle, DraftTotals } from "../components/QuoteItemsDraftSection";
import QuoteSummaryPanel from "../components/QuoteSummaryPanel/QuoteSummaryPanel";

interface QuoteDetailPageProps {
  mode: "create" | "create-prospect" | "edit";
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
  const location = useLocation();

  // Prospect data passed via navigation state
  const prospectData = (location.state as { prospect?: ProspectDetails } | null)?.prospect ?? null;

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

  const handleDraftTotalsChange = useCallback((totals: DraftTotals) => {
    setDraftTotals(totals);
  }, []);

  // Financial summary for create modes — computed from draft items + rates
  const createSummary = useMemo(() => {
    const { subtotal, tax } = draftTotals;
    const commRate = parseFloat(commercialRate || "0") / 100;
    const othRate = parseFloat(otherRate || "0") / 100;
    const commercialDiscountAmt = subtotal * commRate;
    const otherDiscountAmt = subtotal * othRate;
    const isClientEmpresa =
      client?.retefuenteApplies === true &&
      client?.legalEntityType !== LegalEntityType.NATURAL;
    const netBase = subtotal - commercialDiscountAmt - otherDiscountAmt;
    const retefuenteAmt = isClientEmpresa ? netBase * 0.025 : 0;
    const total = netBase + tax - retefuenteAmt + freight;
    return { subtotal, tax, commercialDiscountAmt, otherDiscountAmt, retefuenteAmt, total };
  }, [draftTotals, commercialRate, otherRate, freight, client]);

  const createMissingFields = useMemo(() => {
    const missing: string[] = [];
    if (!selectedPriceListId) missing.push("Lista de precios");
    return missing;
  }, [selectedPriceListId]);

  // Create-prospect mode: only needs price lists
  useEffect(() => {
    if (mode !== "create-prospect") return;
    let isMounted = true;
    getPriceListsService()
      .then((data) => { if (isMounted) setPriceLists(data); })
      .catch(console.error);
    return () => { isMounted = false; };
  }, [mode]);

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
    if (mode === "create" || mode === "create-prospect") {
      setIsCreating(true);
      setCreateError(null);
      try {
        let newQuote: Quote;
        if (mode === "create-prospect") {
          if (!prospectData) return;
          newQuote = await createQuoteFromProspectService(prospectData);
        } else {
          if (!clientId) return;
          newQuote = await createQuoteService(clientId);
        }
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

  const isPageLoading =
    mode === "edit" ? isQuoteLoading : mode === "create" ? isClientLoading : false;
  const pageError =
    mode === "edit" ? quoteError : mode === "create" ? clientError : null;

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

  // For create-prospect, redirect if no prospect data was passed
  if (mode === "create-prospect" && !prospectData) {
    navigate("/cotizaciones", { replace: true });
    return null;
  }

  const isCreateMode = mode === "create" || mode === "create-prospect";
  const isSaveDisabled =
    isCreating || isSaving || (mode === "edit" && !hasChanges && !hasItemChanges);
  const displayError = createError ?? saveError;
  const pageTitle = isCreateMode ? "Nueva Cotización" : "Detalle de Cotización";

  // accountInfo for summary panel
  const accountInfo = isCreateMode
    ? mode === "create-prospect"
      ? { name: prospectData!.name }
      : { name: client!.name, identificationNumber: client!.identificationNumber }
    : null;

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
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {quote.account ? (
                <QuoteClientCard account={quote.account} location={quote.location} />
              ) : quote.prospect ? (
                <QuoteProspectHeaderCard prospect={quote.prospect} editMode />
              ) : null}
            </>
          ) : mode === "create-prospect" ? (
            <QuoteProspectHeaderCard prospect={prospectData!} />
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

          {/* Price list moved to main column in create modes */}
          {isCreateMode && (
            <QuotePriceListCard
              quote={quote}
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
          {isCreateMode && accountInfo ? (
            <QuoteSummaryPanel
              accountInfo={accountInfo}
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
              error={displayError}
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

              {/* Guardar (edit mode) */}
              <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
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
