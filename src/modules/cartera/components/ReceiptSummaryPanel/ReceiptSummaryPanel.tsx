import { Box, Divider, Typography } from "@mui/material";

const COMMISSION_RATE = 0.015;

const fmt = (v: number) =>
  `$${v.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

// Generic money row
const MoneyRow = ({
  label,
  value,
  highlight = false,
  zero = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  zero?: boolean;
}) => (
  <Box className="flex items-center justify-between">
    <Typography
      variant="body2"
      className={highlight ? "font-bold text-gray-800" : "text-gray-500"}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      className={`font-medium ${
        highlight ? "text-base" : zero ? "text-gray-400" : "text-gray-700"
      }`}
      sx={highlight ? { color: "var(--dispofast-primary)" } : undefined}
    >
      {zero ? "$0,00" : fmt(value)}
    </Typography>
  </Box>
);

// Plain (non-currency) row — for day counts, etc.
const PlainRow = ({ label, value }: { label: string; value: string }) => (
  <Box className="flex items-center justify-between">
    <Typography variant="body2" className="text-gray-500">
      {label}
    </Typography>
    <Typography variant="body2" className="font-medium text-gray-700">
      {value}
    </Typography>
  </Box>
);

export interface ReceiptSummaryData {
  diasCartera: number;
  orderNumber: string | null;
  invoiceNumber: string | null;
  subtotal: number;
  iva: number;
  retefuente: number;
  freight: number;
  discountAmt: number;
  totalValue: number;
  hasOrderData: boolean;
}

interface ReceiptSummaryPanelProps {
  data: ReceiptSummaryData;
}

const ReceiptSummaryPanel = ({ data }: ReceiptSummaryPanelProps) => {
  const commission = data.subtotal * COMMISSION_RATE;

  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top summary */}
      <Box className="px-5 py-4 border-b border-gray-100">
        <Typography variant="body1" className="font-bold text-gray-800">
          Resumen
        </Typography>
      </Box>
      <Box className="px-5 py-4 flex flex-col gap-2">
        <PlainRow
          label="Dias de cartera"
          value={`${data.diasCartera} día${data.diasCartera !== 1 ? "s" : ""}`}
        />
        <MoneyRow label="Comisión asesor" value={commission} />
      </Box>

      <Divider />

      {/* Order breakdown */}
      <Box className="px-5 py-4 flex flex-col gap-3">
        <Box className="flex items-center justify-between">
          <Typography
            variant="body2"
            className="font-bold"
            sx={{ color: "var(--dispofast-primary)" }}
          >
            Orden #{data.orderNumber ?? "—"}
          </Typography>
          {data.invoiceNumber && (
            <Typography variant="body2" className="text-gray-500">
              Factura:{" "}
              <span className="font-semibold text-gray-700">
                {data.invoiceNumber}
              </span>
            </Typography>
          )}
        </Box>

        {data.hasOrderData ? (
          <Box className="flex flex-col gap-2">
            <MoneyRow label="Sub Total" value={data.subtotal} />
            <MoneyRow
              label="IVA"
              value={data.iva}
              zero={data.iva === 0}
            />
            <MoneyRow
              label="Retefuente"
              value={data.retefuente}
              zero={data.retefuente === 0}
            />
            <MoneyRow label="Reteica" value={0} zero />
            <MoneyRow
              label="Descuento Comercial"
              value={data.discountAmt}
              zero={data.discountAmt === 0}
            />
            <MoneyRow label="Pronto pago" value={0} zero />
            <MoneyRow label="Otros descuentos" value={0} zero />
            <MoneyRow
              label="Flete"
              value={data.freight}
              zero={data.freight === 0}
            />
          </Box>
        ) : (
          <Typography variant="caption" className="text-gray-400 italic">
            Desglose no disponible
          </Typography>
        )}

        <Divider />

        <MoneyRow label="Total" value={data.totalValue} highlight />
      </Box>
    </Box>
  );
};

export default ReceiptSummaryPanel;
