import { Box, Typography } from "@mui/material";
import { Hash } from "lucide-react";
import type { Quote } from "../types";
import { formatCurrency } from "../../../shared/utils/currency";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    className="text-gray-500 font-bold tracking-widest mb-4 block"
  >
    {children}
  </Typography>
);

interface QuotePaymentDetailsCardProps {
  quote: Quote | null;
}

const QuotePaymentDetailsCard = ({ quote }: QuotePaymentDetailsCardProps) => {
  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <SectionTitle>
        <Hash size={16} className="inline mr-2 align-text-bottom" />
        Detalles de Pago
      </SectionTitle>

      <Box className="flex flex-col gap-3">
        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-500">
            % Descuento Máx.
          </Typography>
          <Typography variant="body2" className="font-medium">
            {quote?.account?.defaultDiscountRate ?? 0}%
          </Typography>
        </Box>

        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-500">
            Subtotal
          </Typography>
          <Typography variant="body2" className="font-medium tabular-nums">
            {formatCurrency(quote?.subtotalAmount)}
          </Typography>
        </Box>

        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-green-600">
            Descuento
          </Typography>
          <Typography variant="body2" className="font-medium tabular-nums text-green-600">
            -{formatCurrency(quote?.discountTotal)}
          </Typography>
        </Box>

        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-500">
            IVA (19%)
          </Typography>
          <Typography variant="body2" className="font-medium tabular-nums">
            {formatCurrency(quote?.taxTotal)}
          </Typography>
        </Box>

        <Box className="h-px bg-gray-200" />

        <Box className="flex justify-between items-center">
          <Typography variant="body1" className="font-bold text-gray-900">
            Total a Pagar
          </Typography>
          <Typography variant="h6" className="font-bold tabular-nums text-primary-main">
            {formatCurrency(quote?.totalAmount)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default QuotePaymentDetailsCard;
