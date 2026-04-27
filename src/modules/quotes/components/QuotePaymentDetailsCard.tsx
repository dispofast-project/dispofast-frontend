import { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import { Hash } from "lucide-react";
import type { Quote } from "../types";
import { formatCurrency } from "../../../shared/utils/currency";

interface QuotePaymentDetailsCardProps {
  quote: Quote | null;
}

type RowVariant = "normal" | "discount" | "tax" | "retention" | "total";

interface RowConfig {
  label: string;
  value: string;
  variant?: RowVariant;
}

const formatRate = (rate: number | null | undefined): string => {
  if (rate == null) return "0%";
  const pct = rate * 100;
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
};

const VARIANT_STYLES: Record<RowVariant, { label: string; value: string }> = {
  normal:    { label: "text-gray-500",       value: "font-medium tabular-nums" },
  discount:  { label: "text-green-600",      value: "font-medium tabular-nums text-green-600" },
  tax:       { label: "text-gray-500",       value: "font-medium tabular-nums" },
  retention: { label: "text-orange-500",     value: "font-medium tabular-nums text-orange-500" },
  total:     { label: "font-bold text-gray-900", value: "font-bold tabular-nums" },
};

const PaymentRow = ({ label, value, variant = "normal" }: RowConfig) => {
  const styles = VARIANT_STYLES[variant];
  const isTotal = variant === "total";
  return (
    <Box className="flex justify-between items-center">
      <Typography variant={isTotal ? "body1" : "body2"} className={styles.label}>
        {label}
      </Typography>
      <Typography variant={isTotal ? "h6" : "body2"} className={styles.value}>
        {value}
      </Typography>
    </Box>
  );
};

const Divider = () => <Box className="h-px bg-gray-100" />;

const QuotePaymentDetailsCard = ({ quote }: QuotePaymentDetailsCardProps) => {
  const sections: RowConfig[][] = [
    [
      { label: "Subtotal", value: formatCurrency(quote?.subtotalAmount) },
    ],
    [
      {
        label: `Descuento comercial (${formatRate(quote?.commercialDiscountRate)})`,
        value: `-${formatCurrency(quote?.commercialDiscountAmount)}`,
        variant: "discount",
      },
      {
        label: `Otros descuentos (${formatRate(quote?.otherDiscountsRate)})`,
        value: `-${formatCurrency(quote?.otherDiscountsAmount)}`,
        variant: "discount",
      },
    ],
    [
      {
        label: `IVA (${formatRate(quote?.ivaRate)})`,
        value: formatCurrency(quote?.ivaAmount),
        variant: "tax",
      },
      {
        label: `Retefuente (${formatRate(quote?.retefuenteRate)})`,
        value: `-${formatCurrency(quote?.retefuenteAmount)}`,
        variant: "retention",
      },
    ],
    [
      { label: "Total a Pagar", value: formatCurrency(quote?.totalAmount), variant: "total" },
    ],
  ];

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <Typography
        variant="overline"
        className="text-gray-500 font-bold tracking-widest flex items-center gap-1.5"
        component="div"
      >
        <Hash size={14} className="inline" />
        Detalles de Pago
      </Typography>

      <Box className="flex flex-col gap-3">
        {sections.map((rows, i) => (
          <Fragment key={i}>
            {i > 0 && <Divider />}
            {rows.map((row) => (
              <PaymentRow key={row.label} {...row} />
            ))}
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default QuotePaymentDetailsCard;
