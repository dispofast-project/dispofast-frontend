import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";

import {
  getPurchaseOrderByIdService,
  createPurchaseOrderService,
  addPurchaseOrderItemService,
} from "../api/purchases.api";
import { getClientByIdService } from "../../clients/api/clients.api";
import { RetefuenteType } from "../../clients/types";
import type { ClientResponse } from "../../clients/types";
import type { PurchaseOrder } from "../types";
import { PaymentCondition } from "../types";
import { usePurchaseOrderEdit } from "../hooks/usePurchaseOrderEdit";
import { useAuth } from "../../iam/hooks/useAuth";
import { useSystemParams } from "../../../shared/hooks/useSystemParams";

import PurchaseOrderDetailsHeaderCard from "../components/PurchaseOrderDetailsHeaderCard";
import PurchaseOrderCreateHeaderCard from "../components/PurchaseOrderCreateHeaderCard";
import PurchaseOrderSupplierCard from "../components/PurchaseOrderSupplierCard";
import PurchaseOrderBuyerCard from "../components/PurchaseOrderBuyerCard";
import PurchaseOrderTermsCard from "../components/PurchaseOrderTermsCard";
import PurchaseOrderItemsSection from "../components/PurchaseOrderItemsSection";
import type { PurchaseOrderItemsSectionHandle } from "../components/PurchaseOrderItemsSection";
import PurchaseOrderItemsDraftSection from "../components/PurchaseOrderItemsDraftSection";
import type {
  PurchaseOrderItemsDraftSectionHandle,
  DraftPrintItem,
  DraftTotals,
} from "../components/PurchaseOrderItemsDraftSection";
import PurchaseOrderSummaryPanel from "../components/PurchaseOrderSummaryPanel";
import PurchaseOrderPrintTemplate from "../components/PurchaseOrderPrintTemplate/PurchaseOrderPrintTemplate";
import type {
  PurchaseOrderPrintTemplateProps,
  PurchaseOrderPrintItem,
} from "../components/PurchaseOrderPrintTemplate/PurchaseOrderPrintTemplate";
import { downloadElementAsPdf } from "../../../shared/utils/downloadAsPdf";

interface PurchaseOrderDetailPageProps {
  mode: "create" | "edit";
}

interface OrderState {
  data: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
}

interface SupplierState {
  data: ClientResponse | null;
  isLoading: boolean;
  error: string | null;
}

const PurchaseOrderDetailPage = ({ mode }: PurchaseOrderDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const [orderState, setOrderState] = useState<OrderState>({
    data: null,
    isLoading: mode === "edit",
    error: null,
  });
  const [supplierState, setSupplierState] = useState<SupplierState>({
    data: null,
    isLoading: mode === "create",
    error: null,
  });
  const [hasItemChanges, setHasItemChanges] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [draftTotals, setDraftTotals] = useState<DraftTotals>({ subtotal: 0, tax: 0, itemCount: 0 });

  const itemsRef = useRef<PurchaseOrderItemsSectionHandle>(null);
  const draftItemsRef = useRef<PurchaseOrderItemsDraftSectionHandle>(null);
  const printTemplateRef = useRef<HTMLDivElement>(null);

  const [printData, setPrintData] = useState<PurchaseOrderPrintTemplateProps | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const { data: order, isLoading: isOrderLoading, error: orderError } = orderState;
  const { data: supplier, isLoading: isSupplierLoading, error: supplierError } = supplierState;
  const { authorities } = useAuth();
  const isAdmin = authorities.includes("ROLE_ADMIN");
  const {
    RETEFUENTE_RATE_PERSONA_JURIDICA,
    RETEFUENTE_RATE_PERSONA_NATURAL,
    RETEFUENTE_THRESHOLD,
  } = useSystemParams();

  const {
    selectedBuyer,
    setSelectedBuyer,
    selectedPaymentCondition,
    setSelectedPaymentCondition,
    commercialRate,
    setCommercialRate,
    otherRate,
    setOtherRate,
    freight,
    setFreight,
    retefuenteOverride,
    setRetefuenteOverride,
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  } = usePurchaseOrderEdit(order, (updated) =>
    setOrderState((prev) => ({ ...prev, data: updated })),
  );

  const handleDraftTotalsChange = useCallback((totals: DraftTotals) => {
    setDraftTotals(totals);
  }, []);

  const supplierRetefuenteType = mode === "edit" ? order?.supplier?.retefuenteType : supplier?.retefuenteType;
  const effectiveRetefuenteType: RetefuenteType =
    retefuenteOverride || supplierRetefuenteType || RetefuenteType.NO_APLICA;

  // Financial summary for create mode — computed from draft items + rates
  const createSummary = useMemo(() => {
    const { subtotal, tax } = draftTotals;
    const commRate = parseFloat(commercialRate || "0") / 100;
    const othRate = parseFloat(otherRate || "0") / 100;
    const commercialDiscountAmt = subtotal * commRate;
    const otherDiscountAmt = subtotal * othRate;
    const retefuenteRate =
      effectiveRetefuenteType === RetefuenteType.PERSONA_JURIDICA
        ? RETEFUENTE_RATE_PERSONA_JURIDICA
        : effectiveRetefuenteType === RetefuenteType.PERSONA_NATURAL
        ? RETEFUENTE_RATE_PERSONA_NATURAL
        : 0;
    const netBase = subtotal - commercialDiscountAmt - otherDiscountAmt;
    const retefuenteAmt =
      retefuenteRate > 0 && netBase > RETEFUENTE_THRESHOLD ? netBase * retefuenteRate : 0;
    const total = netBase + tax - retefuenteAmt + freight;
    return { subtotal, tax, commercialDiscountAmt, otherDiscountAmt, retefuenteRate, retefuenteAmt, total };
  }, [
    draftTotals,
    commercialRate,
    otherRate,
    freight,
    effectiveRetefuenteType,
    RETEFUENTE_RATE_PERSONA_JURIDICA,
    RETEFUENTE_RATE_PERSONA_NATURAL,
    RETEFUENTE_THRESHOLD,
  ]);

  // Edit mode: fetch purchase order
  useEffect(() => {
    if (mode !== "edit" || !id) return;
    let isMounted = true;

    getPurchaseOrderByIdService(id)
      .then((data) => {
        if (isMounted) setOrderState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isMounted)
          setOrderState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error al cargar la orden de compra.",
          });
      });

    return () => { isMounted = false; };
  }, [id, mode]);

  // Create mode: fetch supplier info
  useEffect(() => {
    if (mode !== "create" || !supplierId) return;
    let isMounted = true;

    getClientByIdService(supplierId)
      .then((data) => {
        if (isMounted) setSupplierState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isMounted)
          setSupplierState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error al cargar el proveedor.",
          });
      });

    return () => { isMounted = false; };
  }, [supplierId, mode]);

  const handleSave = async () => {
    if (mode === "create") {
      if (!supplierId) return;
      setIsCreating(true);
      setCreateError(null);
      try {
        const newOrder = await createPurchaseOrderService(supplierId);
        await handleSaveAll(newOrder.id);
        const draftItems = draftItemsRef.current?.getItems() ?? [];
        await Promise.all(
          draftItems.map((item) =>
            addPurchaseOrderItemService(newOrder.id, {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }),
          ),
        );
        navigate(`/compras/${newOrder.id}`);
      } catch (err: unknown) {
        setCreateError(err instanceof Error ? err.message : "Error al crear la orden de compra.");
      } finally {
        setIsCreating(false);
      }
    } else {
      if (!id) return;
      if (hasChanges) handleSaveAll(id);
      if (hasItemChanges) itemsRef.current?.saveChanges();
    }
  };

  const handleDownload = async () => {
    const IVA_RATE = 0.19;

    const toPrintItems = (
      src: ReturnType<NonNullable<typeof itemsRef.current>["getItems"]>,
    ): PurchaseOrderPrintItem[] =>
      src.map((item) => ({
        productReference: item.product.reference ?? item.product.sku,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        taxAmount: item.taxAmount,
        total: item.lineTotal,
      }));

    const toDraftPrintItems = (src: DraftPrintItem[]): PurchaseOrderPrintItem[] =>
      src.map((item) => {
        const subtotal = item.quantity * item.unitPrice;
        const taxAmount = item.taxFree ? 0 : subtotal * IVA_RATE;
        return {
          productReference: item.productReference,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
          taxAmount,
          total: subtotal + taxAmount,
        };
      });

    setDownloadLoading(true);
    try {
      let data: PurchaseOrderPrintTemplateProps;

      if (mode === "edit" && order) {
        data = {
          orderNumber: order.number,
          createdAt: order.createdAt,
          isDraft: false,
          supplierName: order.supplier?.name ?? "—",
          identificationNumber: order.supplier?.identificationNumber,
          email: order.supplier?.email,
          phone: order.supplier?.phone,
          city: order.supplier?.city?.name,
          department: order.supplier?.city?.department?.name,
          address: order.supplier?.address,
          buyerName: order.buyerName,
          paymentCondition: order.paymentCondition ? PaymentCondition[order.paymentCondition] : null,
          commercialDiscountRate: order.commercialDiscountRate,
          otherDiscountsRate: order.otherDiscountsRate,
          items: toPrintItems(itemsRef.current?.getItems() ?? []),
          subtotalAmount: order.subtotalAmount,
          commercialDiscountAmount: order.commercialDiscountAmount,
          otherDiscountsAmount: order.otherDiscountsAmount,
          ivaAmount: order.ivaAmount,
          retefuenteAmount: order.retefuenteAmount ?? 0,
          totalAmount: order.totalAmount,
          freight: order.freight ?? 0,
        };
      } else {
        data = {
          orderNumber: "BORRADOR",
          createdAt: new Date().toISOString(),
          isDraft: true,
          supplierName: supplier?.name ?? "—",
          identificationNumber: supplier?.identificationNumber,
          phone: supplier?.phone,
          email: supplier?.email,
          city: supplier?.city?.name,
          department: supplier?.city?.department?.name,
          address: supplier?.address,
          buyerName: selectedBuyer?.name ?? "—",
          paymentCondition: selectedPaymentCondition
            ? (PaymentCondition[selectedPaymentCondition] ?? null)
            : null,
          commercialDiscountRate: parseFloat(commercialRate || "0") / 100,
          otherDiscountsRate: parseFloat(otherRate || "0") / 100,
          items: toDraftPrintItems(draftItemsRef.current?.getFullItems() ?? []),
          subtotalAmount: createSummary.subtotal,
          commercialDiscountAmount: createSummary.commercialDiscountAmt,
          otherDiscountsAmount: createSummary.otherDiscountAmt,
          ivaAmount: createSummary.tax,
          retefuenteAmount: createSummary.retefuenteAmt,
          totalAmount: createSummary.total,
          freight,
        };
      }

      flushSync(() => { setPrintData(data); });

      if (!printTemplateRef.current) return;
      const docNumber = mode === "edit" ? (order?.number ?? "OC") : "BORRADOR";
      const nameLabel = (mode === "edit" ? order?.supplier?.name : supplier?.name) ?? "PROVEEDOR";
      await downloadElementAsPdf(
        printTemplateRef.current,
        `${docNumber}-${nameLabel.toUpperCase().replace(/\s+/g, "_")}.pdf`,
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  const isPageLoading = mode === "edit" ? isOrderLoading : isSupplierLoading;
  const pageError = mode === "edit" ? orderError : supplierError;

  if (isPageLoading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (pageError || (mode === "edit" && !order) || (mode === "create" && !supplier)) {
    return (
      <Box className="p-4">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Volver
        </Button>
        <Box className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {pageError ?? (mode === "edit" ? "Orden de compra no encontrada." : "Proveedor no encontrado.")}
        </Box>
      </Box>
    );
  }

  const isCreateMode = mode === "create";
  const isSaveDisabled = isCreating || isSaving || (mode === "edit" && !hasChanges && !hasItemChanges);
  const displayError = createError ?? saveError;
  const pageTitle = isCreateMode ? "Nueva Orden de Compra" : "Detalle de Orden de Compra";

  const supplierInfo = isCreateMode
    ? { name: supplier!.name, identificationNumber: supplier!.identificationNumber }
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
          {mode === "edit" && order ? (
            <>
              <PurchaseOrderDetailsHeaderCard order={order} />
              <PurchaseOrderSupplierCard supplier={order.supplier} />
            </>
          ) : (
            <PurchaseOrderCreateHeaderCard supplier={supplier!} />
          )}

          <PurchaseOrderBuyerCard
            value={selectedBuyer}
            onChange={setSelectedBuyer}
            readOnly={!isAdmin}
          />
          <PurchaseOrderTermsCard
            paymentCondition={selectedPaymentCondition}
            commercialRate={commercialRate}
            otherRate={otherRate}
            freight={freight}
            retefuenteOverride={effectiveRetefuenteType}
            onPaymentConditionChange={setSelectedPaymentCondition}
            onCommercialRateChange={setCommercialRate}
            onOtherRateChange={setOtherRate}
            onFreightChange={setFreight}
            onRetefuenteOverrideChange={setRetefuenteOverride}
          />

          {mode === "edit" && order ? (
            <PurchaseOrderItemsSection
              ref={itemsRef}
              purchaseOrderId={order.id}
              onHasPendingChanges={setHasItemChanges}
              onItemsChanged={() =>
                getPurchaseOrderByIdService(id!).then((data) =>
                  setOrderState((prev) => ({ ...prev, data }))
                )
              }
            />
          ) : (
            <PurchaseOrderItemsDraftSection
              ref={draftItemsRef}
              onTotalsChange={handleDraftTotalsChange}
            />
          )}
        </Box>

        {/* ── Columna lateral ── */}
        <Box className="flex flex-col gap-6">
          {isCreateMode ? (
            <PurchaseOrderSummaryPanel
              supplierInfo={supplierInfo!}
              subtotal={createSummary.subtotal}
              tax={createSummary.tax}
              commercialDiscountAmt={createSummary.commercialDiscountAmt}
              otherDiscountAmt={createSummary.otherDiscountAmt}
              retefuenteType={effectiveRetefuenteType}
              retefuenteRate={createSummary.retefuenteRate}
              retefuenteAmt={createSummary.retefuenteAmt}
              freight={freight}
              total={createSummary.total}
              itemCount={draftTotals.itemCount}
              missingFields={[]}
              isSaving={isCreating}
              error={createError}
              onSave={handleSave}
              onDownload={handleDownload}
              isDownloading={downloadLoading}
            />
          ) : (
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
              <Button
                variant="outlined"
                fullWidth
                disabled={downloadLoading}
                onClick={handleDownload}
                startIcon={downloadLoading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Descargar PDF
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Template oculto para captura de PDF */}
      {printData && (
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", top: 0, width: "794px" }}
        >
          <PurchaseOrderPrintTemplate ref={printTemplateRef} {...printData} />
        </div>
      )}
    </Box>
  );
};

export default PurchaseOrderDetailPage;
