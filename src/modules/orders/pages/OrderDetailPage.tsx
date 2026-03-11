import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import type { JSX } from "react";
import { useOrderDetail } from "../hooks/useOrderDetail";
import OrderStatusStepper from "../components/OrderStatusStepper/OrderStatusStepper";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import type { OrderState, SalesOrderItem } from "../types";

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
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error } = useOrderDetail(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-dispofast-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">{error ?? "Orden no encontrada"}</p>
        <button
          onClick={() => navigate("/ordenes")}
          className="text-sm text-dispofast-primary underline"
        >
          Volver a órdenes
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate("/ordenes")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Orden {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{order.accountName}</p>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATE_COLORS[order.state]}`}
          >
            {STATE_LABELS[order.state]}
          </span>
        </div>
      </div>

      {/* Status stepper */}
      <OrderStatusStepper state={order.state} />

      {/* Info cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Información de la Orden
          </h3>

          <InfoRow label="Cliente" value={order.accountName} />

          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Valor Total" value={formatCurrency(order.totalValue)} />
            <InfoRow label="Fecha"       value={formatDate(order.orderDate)} />
          </div>

          <InfoRow label="Asesor Comercial" value={order.asesorName ?? "-"} />

          {order.invoiceNumber && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Factura
              </p>
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          )}
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Información de Entrega
          </h3>

          <InfoRow label="Ciudad"    value={order.shipmentCityName ?? "-"} />
          <InfoRow label="Dirección" value={order.shipmentAddress  ?? "-"} />

          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Zona" value={order.zone ?? "-"} />
            <InfoRow label="Guía" value="-" />
          </div>
        </div>
      </div>

      {/* Items table */}
      {order.items && order.items.length > 0 && (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;