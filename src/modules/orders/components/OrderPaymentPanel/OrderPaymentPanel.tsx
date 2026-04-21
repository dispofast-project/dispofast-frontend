import { Box, Divider, Typography } from "@mui/material";
import type { PaymentCondition } from "../../types";
import { PAYMENT_CONDITION_OPTIONS } from "../../constants/orderConstants";

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "$0,00";
  return `$${value.toLocaleString("es-CO")}`;
};

interface PaymentRowProps {
  label: string;
  value: string;
  negative?: boolean;
  highlight?: boolean;
}

const PaymentRow = ({ label, value, negative = false, highlight = false }: PaymentRowProps) => (
  <Box className="flex items-center justify-between">
    <Typography
      variant="body2"
      className={highlight ? "font-bold text-gray-800" : "text-gray-500"}
    >
      {label}
    </Typography>
    <Typography
      variant={highlight ? "h6" : "body2"}
      className={
        highlight
          ? "font-bold"
          : negative
          ? "font-medium text-red-500"
          : "font-medium text-gray-700"
      }
      sx={highlight ? { color: "var(--dispofast-primary)" } : undefined}
    >
      {negative && value !== "$0,00" ? `- ${value}` : value}
    </Typography>
  </Box>
);

interface OrderPaymentPanelProps {
  paymentCondition: PaymentCondition | null;
  subtotal: number;
  tax: number;
  retefuenteAmount: number;
  reteicaAmount: number;
  freight: number;
  discountRate: number;
  discountAmt: number;
  additionalDiscountRate: number;
  additionalDiscountAmt: number;
  totalValue: number;
}

const OrderPaymentPanel = ({
  paymentCondition,
  subtotal,
  tax,
  retefuenteAmount,
  reteicaAmount,
  freight,
  discountRate,
  discountAmt,
  additionalDiscountRate,
  additionalDiscountAmt,
  totalValue,
}: OrderPaymentPanelProps) => {
  const conditionLabel =
    PAYMENT_CONDITION_OPTIONS.find((o) => o.value === paymentCondition)?.label ?? "-";

  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
      {/* Header */}
      <Box className="px-5 py-4 border-b border-gray-100">
        <Typography variant="body1" className="font-bold text-gray-800">
          Detalles de Pago
        </Typography>
      </Box>

      <Box className="px-5 py-4 flex flex-col gap-3">
        {/* Payment condition */}
        <Box className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
            Condición de pago
          </p>
          <p className="text-sm font-semibold text-gray-800">{conditionLabel}</p>
        </Box>

        <Divider />

        {/* Financial breakdown */}
        <Box className="flex flex-col gap-2.5">
          <PaymentRow label="Sub Total" value={formatCurrency(subtotal)} />
          <PaymentRow label="IVA (19%)" value={formatCurrency(tax)} />
          <PaymentRow
            label={`Retefuente`}
            value={formatCurrency(retefuenteAmount)}
            negative={retefuenteAmount > 0}
          />
          <PaymentRow
            label="Reteica"
            value={formatCurrency(reteicaAmount)}
            negative={reteicaAmount > 0}
          />
          <PaymentRow
            label={`Descuento Comercial${discountRate ? ` (${discountRate}%)` : ""}`}
            value={formatCurrency(discountAmt)}
            negative={discountAmt > 0}
          />
          <PaymentRow
            label={`Otros descuentos${additionalDiscountRate ? ` (${additionalDiscountRate}%)` : ""}`}
            value={formatCurrency(additionalDiscountAmt)}
            negative={additionalDiscountAmt > 0}
          />
          <PaymentRow label="Flete" value={formatCurrency(freight)} />
        </Box>

        <Divider />

        {/* Total */}
        <PaymentRow label="Total" value={formatCurrency(totalValue)} highlight />
      </Box>
    </Box>
  );
};

export default OrderPaymentPanel;
