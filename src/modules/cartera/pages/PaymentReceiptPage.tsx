import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import type { ArEntry, PaymentMethod } from "../types";
import type { ClientResponse } from "../../clients/types";
import type { SalesOrder } from "../../orders/types";
import { createPaymentReceipt } from "../api/cartera.service";
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
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!entry) return;
    const load = async () => {
      try {
        const [clientResult, orderResult] = await Promise.allSettled([
          getClientByIdService(entry.clientId),
          entry.orderId ? getOrderById(entry.orderId) : Promise.resolve(null),
        ]);
        if (clientResult.status === "fulfilled") setClient(clientResult.value);
        if (orderResult.status === "fulfilled") setOrder(orderResult.value);
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
    totalValue: order?.totalValue ?? entry.value,
    hasOrderData: !loadingData && order !== null,
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
        documentNumber: values.documentNumber || undefined,
        observations: values.observations || undefined,
      });
      showNotification("Recibo de caja registrado exitosamente", "success");
      navigate("/cartera");
    } catch {
      showNotification(
        "No se pudo registrar el recibo. Intenta de nuevo.",
        "error"
      );
    } finally {
      setSubmitting(false);
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
              items={items}
              loading={loadingData}
            />
          )}
        </Box>

        {/* Right: summary + payment form */}
        <Box className="lg:col-span-1 sticky top-4 flex flex-col gap-4">
          <ReceiptSummaryPanel data={summaryData} />
          <ReceiptPaymentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/cartera")}
            isLoading={submitting}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentReceiptPage;
