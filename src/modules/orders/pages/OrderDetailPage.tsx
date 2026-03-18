import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, ChevronDown } from "lucide-react";
import type { JSX } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useOrderDetail } from "../hooks/useOrderDetail";
import OrderStatusStepper from "../components/OrderStatusStepper/OrderStatusStepper";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import type { OrderState, SalesOrderItem } from "../types";
import { Button } from "../../../shared/components/Button/Button";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { ORDER_STATUS_CONFIG } from "../config/statusConfig";
import { attachInvoice, updateOrder } from "../api/order.service";

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "-";
  return `$${value.toLocaleString("es-CO")}`;
};

const formatDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <Box>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </Box>
);

// States that can be set via the temporary state-change dropdown
const NEXT_STATES: Record<OrderState, OrderState[]> = {
  PENDING: ["CANCELLED"],
  INVOICED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error, refetch } = useOrderDetail(id);

  // ── Invoice dialog ──────────────────────────────────────────────────────────
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const handleAttachInvoice = async () => {
    if (!id || !invoiceNumber.trim() || !invoiceUrl.trim()) return;
    setInvoiceLoading(true);
    setInvoiceError(null);
    try {
      await attachInvoice(id, {
        invoiceNumber: invoiceNumber.trim(),
        invoiceUrl: invoiceUrl.trim(),
      });
      setInvoiceOpen(false);
      setInvoiceNumber("");
      setInvoiceUrl("");
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
    setInvoiceUrl("");
    setInvoiceError(null);
  };

  // ── State change dropdown ───────────────────────────────────────────────────
  const [stateAnchor, setStateAnchor] = useState<null | HTMLElement>(null);
  const [stateLoading, setStateLoading] = useState(false);

  const handleStateChange = async (newState: OrderState) => {
    if (!id) return;
    setStateAnchor(null);
    setStateLoading(true);
    try {
      await updateOrder(id, { state: newState });
      refetch();
    } finally {
      setStateLoading(false);
    }
  };

  // ── Render guards ───────────────────────────────────────────────────────────
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
        <Button
          onClick={() => navigate("/ordenes")}
          variant="primary"
        >
          Volver a órdenes
        </Button>
      </Box>
    );
  }

  const nextStates = NEXT_STATES[order.state] ?? [];
  const canAttachInvoice = order.state === "PENDING" && !order.invoiceNumber;
  const isTerminal = order.state === "DELIVERED" || order.state === "CANCELLED";

  return (
    <Box className="flex flex-col gap-6 pb-8">
      {/* Back + header */}
      <Box>
        <Button
          onClick={() => navigate("/ordenes")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          variant="tertiary"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>

        <Box className="flex flex-wrap items-start justify-between gap-3">
          <Box>
            <h1 className="text-2xl font-bold text-gray-800">
              Orden {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{order.clientName}</p>
          </Box>

          {/* Badge + actions row */}
          <Box className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={order.state} configMap={ORDER_STATUS_CONFIG} />

            {/* Attach invoice button — only PENDING without invoice */}
            {canAttachInvoice && (
              <button
                onClick={() => setInvoiceOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Adjuntar factura
              </button>
            )}

            {/* State change dropdown — not shown for terminal states */}
            {!isTerminal && nextStates.length > 0 && (
              <>
                <button
                  disabled={stateLoading}
                  onClick={(e) => setStateAnchor(e.currentTarget)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-dispofast-primary text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  {stateLoading ? (
                    <CircularProgress size={12} color="inherit" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  Cambiar estado
                </button>
                <Menu
                  anchorEl={stateAnchor}
                  open={Boolean(stateAnchor)}
                  onClose={() => setStateAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {nextStates.map((state) => (
                    <MenuItem
                      key={state}
                      onClick={() => handleStateChange(state)}
                      dense
                    >
                      <Box className="flex items-center gap-2">
                        <StatusBadge status={state} configMap={ORDER_STATUS_CONFIG} />
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Status stepper */}
      <OrderStatusStepper state={order.state} />

      {/* Info cards grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order info */}
        <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Información de la Orden
          </h3>

          <InfoRow label="Cliente" value={order.clientName ?? "-"} />

          <Box className="grid grid-cols-2 gap-4">
            <InfoRow label="Valor Total" value={formatCurrency(order.totalValue)} />
            <InfoRow label="Fecha" value={formatDate(order.orderDate)} />
          </Box>

          <InfoRow label="Asesor Comercial" value={order.asesorName ?? "-"} />

          {/* Invoice section */}
          {order.invoiceNumber ? (
            <Box>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Factura
              </p>
              <Box className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">
                  {order.invoiceNumber}
                </span>
                {order.invoiceUrl && (
                  <a
                    href={order.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar
                  </a>
                )}
              </Box>
            </Box>
          ) : (
            canAttachInvoice && (
              <Box>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Factura
                </p>
                <p className="text-xs text-gray-400 italic">Sin factura adjunta</p>
              </Box>
            )
          )}
        </Box>

        {/* Delivery info */}
        <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Información de Entrega
          </h3>

          <InfoRow label="Ciudad" value={order.shipmentCityName ?? "-"} />
          <InfoRow label="Dirección" value={order.shipmentAddress ?? "-"} />

          <Box className="grid grid-cols-2 gap-4">
            <InfoRow label="Zona" value={order.zone ?? "-"} />
            <InfoRow label="Guía" value="-" />
          </Box>
        </Box>
      </Box>

      {/* Items table */}
      {order.items && order.items.length > 0 && (
        <Box>
          <CustomTable<SalesOrderItem>
            headers={["Producto", "Cantidad", "Precio Unit.", "Descuento", "Total Línea"]}
            data={order.items}
            renderRow={(item): (string | JSX.Element)[] => [
              item.productName,
              String(item.quantity),
              formatCurrency(item.unitPrice),
              item.discount ? `${item.discount}%` : "-",
              formatCurrency(item.lineTotal),
            ]}
            currentPage={1}
            itemsPerPage={order.items.length}
            totalItems={order.items.length}
            onPageChange={() => {}}
            hidePagination
          />
        </Box>
      )}

      {/* ── Attach Invoice Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={invoiceOpen}
        onClose={handleCloseInvoiceDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="text-base font-semibold">
          Adjuntar factura
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 pt-2">
          {invoiceError && (
            <p className="text-xs text-red-500">{invoiceError}</p>
          )}
          <TextField
            label="Número de factura"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            size="small"
            fullWidth
            disabled={invoiceLoading}
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            label="URL del documento"
            value={invoiceUrl}
            onChange={(e) => setInvoiceUrl(e.target.value)}
            size="small"
            fullWidth
            disabled={invoiceLoading}
            placeholder="https://..."
            inputProps={{ maxLength: 500 }}
          />
        </DialogContent>

        <DialogActions className="px-6 pb-4 gap-2">
          <button
            onClick={handleCloseInvoiceDialog}
            disabled={invoiceLoading}
            className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAttachInvoice}
            disabled={
              invoiceLoading ||
              !invoiceNumber.trim() ||
              !invoiceUrl.trim()
            }
            className="px-4 py-2 rounded-md text-sm text-white bg-dispofast-primary hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
          >
            {invoiceLoading && <CircularProgress size={12} color="inherit" />}
            Guardar
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetailPage;
