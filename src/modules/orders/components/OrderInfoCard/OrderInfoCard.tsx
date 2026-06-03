import { Box, CircularProgress } from "@mui/material";
import { Download } from "lucide-react";
import type { Invoice } from "../../../invoices/types";

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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </Box>
);

interface OrderInfoCardProps {
  clientName: string;
  totalValue: number;
  orderDate: string;
  asesorName: string;
  invoice: Invoice | null;
  downloadLoading: boolean;
  onDownloadInvoice: () => void;
}

const OrderInfoCard = ({
  clientName,
  totalValue,
  orderDate,
  asesorName,
  invoice,
  downloadLoading,
  onDownloadInvoice,
}: OrderInfoCardProps) => (
  <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
    <h3 className="text-sm font-semibold text-gray-800">Información de la Orden</h3>

    <InfoRow label="Cliente" value={clientName ?? "-"} />

    <Box className="grid grid-cols-2 gap-4">
      <InfoRow label="Valor Total" value={formatCurrency(totalValue)} />
      <InfoRow label="Fecha" value={formatDate(orderDate)} />
    </Box>

    <InfoRow label="Asesor Comercial" value={asesorName ?? "-"} />

    <Box>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Factura</p>
      {invoice ? (
        <Box className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">{invoice.invoiceNumber}</span>
          <button
            onClick={onDownloadInvoice}
            disabled={downloadLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {downloadLoading ? <CircularProgress size={12} /> : <Download className="w-3.5 h-3.5" />}
            Descargar
          </button>
        </Box>
      ) : (
        <p className="text-xs text-gray-400 italic">Sin factura adjunta</p>
      )}
    </Box>

  </Box>
);

export default OrderInfoCard;
