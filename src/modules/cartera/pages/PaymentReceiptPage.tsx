import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import type { ArEntry, PaymentMethod, PaymentReceipt } from "../types";
import type { ClientResponse } from "../../clients/types";
import type { SalesOrder } from "../../orders/types";
import {
  createPaymentReceipt,
  getReceiptsByArEntry,
} from "../api/cartera.service";
import { getClientByIdService } from "../../clients/api/clients.api";
import { getOrderById } from "../../orders/api/order.service";
import { useNotificationStore } from "../../../shared/store/notification.store";
import ReceiptHeader from "../components/ReceiptHeader/ReceiptHeader";
import ReceiptClientCard from "../components/ReceiptClientCard/ReceiptClientCard";
import ReceiptProductsTable from "../components/ReceiptProductsTable/ReceiptProductsTable";
import ReceiptSummaryPanel from "../components/ReceiptSummaryPanel/ReceiptSummaryPanel";
import ReceiptPaymentForm from "../components/ReceiptPaymentForm/ReceiptPaymentForm";
import type { ReceiptFormValues } from "../components/ReceiptPaymentForm/ReceiptPaymentForm";
import type { ReceiptSummaryData } from "../components/ReceiptSummaryPanel/ReceiptSummaryPanel";

const IVA_RATE = 0.19;

const PaymentReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotificationStore();

  const entry: ArEntry | undefined = location.state?.entry;

  useEffect(() => {
    if (!entry) navigate("/cartera", { replace: true });
  }, [entry, navigate]);

  const [client, setClient] = useState<ClientResponse | null>(null);
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [typedPayment, setTypedPayment] = useState(0);
  const [discountRate, setDiscountRate] = useState<2 | 3 | 5 | undefined>(undefined);

  const loadReceipts = useCallback(async () => {
    if (!entry) return;
    try {
      const data = await getReceiptsByArEntry(entry.id);
      setReceipts(data);
    } catch {
      // Non-critical; show empty list
    }
  }, [entry?.id]);

  useEffect(() => {
    if (!entry) return;
    const load = async () => {
      try {
        const [clientResult, orderResult] = await Promise.allSettled([
          entry.clientId
            ? getClientByIdService(entry.clientId)
            : Promise.resolve(null),
          entry.orderId
            ? getOrderById(entry.orderId)
            : Promise.resolve(null),
        ]);
        if (clientResult.status === "fulfilled") setClient(clientResult.value);
        if (orderResult.status === "fulfilled") setOrder(orderResult.value);
        await loadReceipts();
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [entry?.clientId, entry?.orderId]);

  

  if (!entry) return null;

  // ── Derived financial data ─────────────────────────────────────────────────
  const items = order?.items ?? [];
  const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
  const iva = items.reduce(
    (s, it) => s + (it.taxFree ? 0 : it.lineTotal * IVA_RATE),
    0
  );
  const totalValue = order?.totalValue ?? entry.value;

  // Compute live balance from fetched receipts so it updates after payment.
  // Prompt-payment discounts are forgiven debt: they settle the balance just like cash.
  const paidTotal = receipts
    .filter((r) => r.state === "ACTIVE")
    .reduce((s, r) => s + r.value + (r.promptPaymentDiscountAmount ?? 0), 0);
  const liveBalance = Math.max(0, totalValue - paidTotal);

  const appliedDiscountTotal = receipts
    .filter((r) => r.state === "ACTIVE")
    .reduce((s, r) => s + (r.promptPaymentDiscountAmount ?? 0), 0);
  const discountPreview = discountRate ? subtotal * (discountRate / 100) : 0;

  const summaryData: ReceiptSummaryData = {
    diasCartera: entry.diasCartera,
    orderNumber: entry.orderNumber,
    invoiceNumber: entry.invoiceNumber,
    subtotal,
    iva,
    retefuente: order?.retefuenteAmount ?? 0,
    freight: order?.freight ?? 0,
    discountAmt:
      subtotal * ((order?.discountRate ?? 0) / 100) +
      subtotal * ((order?.additionalDiscountRate ?? 0) / 100),
    promptPaymentDiscount: appliedDiscountTotal,
    totalValue,
    hasOrderData: !loadingData && order !== null,
    receipts,
    balance: liveBalance,
    pendingPayment: typedPayment,
    pendingDiscount: discountPreview,
  };

  const receiptRef = entry.id.replace(/-/g, "").substring(0, 13);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSubmit = async (values: ReceiptFormValues) => {
    setSubmitting(true);
    try {
      await createPaymentReceipt(entry.id, {
        value: values.value,
        paymentDate: values.paymentDate,
        paymentMethod: values.paymentMethod as PaymentMethod,
        voucherS3Key: values.voucherS3Key,
        documentNumber: values.documentNumber || undefined,
        observations: values.observations || undefined,
        promptPaymentDiscountRate: values.promptPaymentDiscountRate,
      });
      showNotification("Recibo de caja registrado exitosamente", "success");
      // Stay on the page and refresh receipts to show updated balance
      setDiscountRate(undefined);
      await loadReceipts();
    } catch (error: any) {
      showNotification(
        `No se pudo registrar el recibo: ${error.message}`,
        "error"
      );
    } finally {
      setSubmitting(false);
      navigate("/cartera", { replace: true });
    }
  };

  return (
    <Box className="flex flex-col gap-6 pb-8">
      <ReceiptHeader
        clientName={entry.clientName}
        clientIdentification={entry.clientIdentification}
        receiptRef={receiptRef}
      />

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: client info + products */}
        <Box className="lg:col-span-2 flex flex-col gap-5">
          <ReceiptClientCard
            clientIdentification={entry.clientIdentification}
            cityName={entry.cityName}
            asesorName={entry.asesorName}
            client={client}
            loading={loadingData}
          />

          {entry.orderId && (
            <ReceiptProductsTable
              orderNumber={entry.orderNumber}
              invoiceNumber={entry.invoiceNumber}
              items={items}
              loading={loadingData}
            />
          )}
        </Box>

        {/* Right: summary + payment form (hidden when fully paid) */}
        <Box className="lg:col-span-1 sticky top-4 flex flex-col gap-4">
          <ReceiptSummaryPanel data={summaryData} />
          {liveBalance > 0 && (
            <ReceiptPaymentForm
              onSubmit={handleSubmit}
              onCancel={() => navigate("/cartera")}
              isLoading={submitting}
              onValueChange={setTypedPayment}
              onDiscountRateChange={setDiscountRate}
              preTaxSubtotal={subtotal}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentReceiptPage;
