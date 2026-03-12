import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import type { JSX } from "react";
import { useOrderDetail } from "../hooks/useOrderDetail";
import OrderStatusStepper from "../components/OrderStatusStepper/OrderStatusStepper";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import type { OrderState, SalesOrderItem } from "../types";
import { Box } from "@mui/material";
import { Button } from "../../../shared/components/Button/Button";

const STATE_LABELS: Record<OrderState, string> = {
  PENDING:    "Creada",
  INVOICED:   "Facturada",
  ASSIGNED:   "Asignada",
  IN_TRANSIT: "En Despacho",
  DELIVERED:  "Entregada",
  CANCELLED:  "Cancelada",
};

const STATE_COLORS: Record<OrderState, string> = {
  PENDING:    "bg-gray-100 text-gray-700",
  INVOICED:   "bg-amber-100 text-amber-700",
  ASSIGNED:   "bg-purple-100 text-purple-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-600",
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "-";
  return `$${value.toLocaleString("es-CO")}`;
};

const formatDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("es-CO", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <Box>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </Box>
);

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error } = useOrderDetail(id);

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
          className="text-sm text-dispofast-primary underline"
          variant="primary"
        >
          Volver a órdenes
        </Button>
      </Box>
    );
  }

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
            <p className="text-sm text-gray-500 mt-0.5">{order.accountName}</p>
          </Box>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATE_COLORS[order.state]}`}
          >
            {STATE_LABELS[order.state]}
          </span>
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

          <InfoRow label="Cliente" value={order.accountName} />

          <Box className="grid grid-cols-2 gap-4">
            <InfoRow label="Valor Total" value={formatCurrency(order.totalValue)} />
            <InfoRow label="Fecha"       value={formatDate(order.orderDate)} />
          </Box>

          <InfoRow label="Asesor Comercial" value={order.asesorName ?? "-"} />

          {order.invoiceNumber && (
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
          )}
        </Box>

        {/* Delivery info */}
        <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Información de Entrega
          </h3>

          <InfoRow label="Ciudad"    value={order.shipmentCityName ?? "-"} />
          <InfoRow label="Dirección" value={order.shipmentAddress  ?? "-"} />

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
    </Box>
  );
};

export default OrderDetailPage;