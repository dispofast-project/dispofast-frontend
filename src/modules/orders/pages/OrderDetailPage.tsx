import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useOrderDetail } from "../hooks/useOrderDetail";
import type { OrderState } from "../types";
import { Button } from "../../../shared/components/Button/Button";
import { attachInvoice, downloadInvoice, updateOrder } from "../api/order.service";
import { getInvoiceByOrderId } from "../../invoices/api/invoice.service";
import type { Invoice } from "../../invoices/types";
import { downloadElementAsPdf } from "../../../shared/utils/downloadAsPdf";

import OrderDetailHeader from "../components/OrderDetailHeader/OrderDetailHeader";
import OrderStatusStepper from "../components/OrderStatusStepper/OrderStatusStepper";
import OrderInfoCard from "../components/OrderInfoCard/OrderInfoCard";
import OrderDeliveryCard from "../components/OrderDeliveryCard/OrderDeliveryCard";
import OrderItemsTable from "../components/OrderItemsTable/OrderItemsTable";
import OrderPaymentPanel from "../components/OrderPaymentPanel/OrderPaymentPanel";
import AttachInvoiceDialog from "../components/AttachInvoiceDialog/AttachInvoiceDialog";
import OrderPrintTemplate from "../components/OrderPrintTemplate/OrderPrintTemplate";

const NEXT_STATES: Record<OrderState, OrderState[]> = {
  PENDING: ["CANCELLED"],
  INVOICED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const IVA_RATE = 0.19;

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error, refetch } = useOrderDetail(id);

  // ── Invoice ─────────────────────────────────────────────────────────────────
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!id || !order || order.state === "PENDING") { setInvoice(null); return; }
    getInvoiceByOrderId(id).then(setInvoice).catch(() => setInvoice(null));
  }, [id, order?.state]);

  const [invoiceOpen, setInvoiceOpen]     = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceFile, setInvoiceFile]     = useState<File | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError]   = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const orderRef = useRef<HTMLDivElement>(null);
  const printTemplateRef = useRef<HTMLDivElement>(null);

  const handleAttachInvoice = async () => {
    if (!id || !invoiceNumber.trim() || !invoiceFile) return;
    setInvoiceLoading(true);
    setInvoiceError(null);
    try {
      await attachInvoice(id, { invoiceNumber: invoiceNumber.trim(), file: invoiceFile });
      setInvoiceOpen(false);
      setInvoiceNumber("");
      setInvoiceFile(null);
      refetch();
    } catch {
      setInvoiceError("No se pudo adjuntar la factura. Intenta de nuevo.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleCloseInvoiceDialog = () => {
    if (invoiceLoading) return;
    setInvoiceOpen(false);
    setInvoiceNumber("");
    setInvoiceFile(null);
    setInvoiceError(null);
  };

  const handleDownloadInvoice = async () => {
    if (!id) return;
    setDownloadLoading(true);
    try { await downloadInvoice(id); } finally { setDownloadLoading(false); }
  };

  const [downloadOrderLoading, setDownloadOrderLoading] = useState(false);

  const handleDownloadOrder = async () => {
    if (!printTemplateRef.current) return;
    setDownloadOrderLoading(true);
    try {
      await downloadElementAsPdf(printTemplateRef.current, `orden_${order?.orderNumber}.pdf`);
    } finally {
      setDownloadOrderLoading(false);
    }
  };

  // ── State change ────────────────────────────────────────────────────────────
  const [stateLoading, setStateLoading] = useState(false);

  const handleStateChange = async (newState: OrderState) => {
    if (!id) return;
    setStateLoading(true);
    try { await updateOrder(id, { state: newState }); refetch(); }
    finally { setStateLoading(false); }
  };

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Box className="w-8 h-8 border-4 border-dispofast-primary border-t-transparent rounded-full animate-spin" />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">{error ?? "Orden no encontrada"}</p>
        <Button onClick={() => navigate("/ordenes")} variant="primary">Volver a órdenes</Button>
      </Box>
    );
  }

  // ── Financial calculations ──────────────────────────────────────────────────
  const subtotal            = order.items?.reduce((acc, it) => acc + it.lineTotal, 0) ?? 0;
  const tax                 = order.items?.reduce((acc, it) => acc + (it.taxFree ? 0 : it.lineTotal * IVA_RATE), 0) ?? 0;
  const discountRate        = order.discountRate ?? 0;
  const additionalDiscountRate = order.additionalDiscountRate ?? 0;
  const discountAmt         = subtotal * (discountRate / 100);
  const additionalDiscountAmt = subtotal * (additionalDiscountRate / 100);
  const retefuenteAmount    = order.retefuenteAmount ?? 0;
  const freight             = order.freight ?? 0;

  const nextStates      = NEXT_STATES[order.state] ?? [];
  const canAttachInvoice = order.state === "PENDING";
  const isTerminal      = order.state === "DELIVERED" || order.state === "CANCELLED";


  return (
    <Box className="flex flex-col gap-6 pb-8" ref={orderRef}>
      <OrderDetailHeader
        orderNumber={order.orderNumber}
        clientName={order.clientName}
        state={order.state}
        nextStates={nextStates}
        isTerminal={isTerminal}
        canAttachInvoice={canAttachInvoice}
        stateLoading={stateLoading}
        onBack={() => navigate("/ordenes")}
        onAttachInvoice={() => setInvoiceOpen(true)}
        onStateChange={handleStateChange}
      />

      <OrderStatusStepper state={order.state} />

      {/* Two-column layout: content + payment sidebar */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: main content */}
        <Box className="lg:col-span-2 flex flex-col gap-5">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OrderInfoCard
              clientName={order.clientName}
              totalValue={order.totalValue}
              orderDate={order.orderDate}
              asesorName={order.asesorName}
              invoice={invoice}
              downloadLoading={downloadLoading}
              onDownloadInvoice={handleDownloadInvoice}
            />
            <OrderDeliveryCard
              shipmentCityName={order.shipmentCityName}
              shipmentAddress={order.shipmentAddress}
              zone={order.zone}
            />
          </Box>

          <OrderItemsTable items={order.items ?? []} />
        </Box>

        {/* Right: payment panel */}
        <Box className="lg:col-span-1">
          <OrderPaymentPanel
            paymentCondition={order.paymentCondition}
            subtotal={subtotal}
            tax={tax}
            retefuenteAmount={retefuenteAmount}
            freight={freight}
            discountRate={discountRate}
            discountAmt={discountAmt}
            additionalDiscountRate={additionalDiscountRate}
            additionalDiscountAmt={additionalDiscountAmt}
            totalValue={order.totalValue}
            handleDownload={handleDownloadOrder}
            downloadLoading={downloadOrderLoading}
          />
        </Box>
      </Box>

      <AttachInvoiceDialog
        open={invoiceOpen}
        onClose={handleCloseInvoiceDialog}
        onSubmit={handleAttachInvoice}
        invoiceNumber={invoiceNumber}
        onInvoiceNumberChange={setInvoiceNumber}
        invoiceFile={invoiceFile}
        onInvoiceFileChange={setInvoiceFile}
        isLoading={invoiceLoading}
        error={invoiceError}
      />

      {/* Hidden print template — off-screen but fully rendered for PDF capture */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0, width: "794px" }}
      >
        <OrderPrintTemplate
          ref={printTemplateRef}
          order={order}
          subtotal={subtotal}
          tax={tax}
          discountAmt={discountAmt}
          additionalDiscountAmt={additionalDiscountAmt}
          retefuenteAmount={retefuenteAmount}
          reteicaAmount={order.reteicaAmount ?? 0}
          freight={freight}
        />
      </div>
    </Box>
  );
};

export default OrderDetailPage;
