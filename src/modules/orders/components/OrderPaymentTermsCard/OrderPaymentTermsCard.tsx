import { Box, Typography, TextField } from "@mui/material";
import { FileText } from "lucide-react";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import { PAYMENT_CONDITION_OPTIONS, DISCOUNT_OPTIONS } from "../../constants/orderConstants";
import type { PaymentCondition } from "../../types";

interface OrderPaymentTermsCardProps {
  paymentCondition: PaymentCondition | "";
  onPaymentConditionChange: (val: PaymentCondition) => void;
  discountRate: string;
  onDiscountRateChange: (val: string) => void;
  additionalDiscountRate: string;
  onAdditionalDiscountRateChange: (val: string) => void;
  observations: string;
  onObservationsChange: (val: string) => void;
}

const OrderPaymentTermsCard = ({
  paymentCondition,
  onPaymentConditionChange,
  discountRate,
  onDiscountRateChange,
  additionalDiscountRate,
  onAdditionalDiscountRateChange,
  observations,
  onObservationsChange,
}: OrderPaymentTermsCardProps) => {
  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Box className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-dispofast-primary" />
        </Box>
        <Box>
          <Typography variant="body1" className="font-semibold text-gray-800">
            Términos
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Condiciones de pago y descuentos aplicables
          </Typography>
        </Box>
      </Box>

      <Box className="px-6 py-5 flex flex-col gap-4">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown
            label="Condiciones de pago"
            options={PAYMENT_CONDITION_OPTIONS}
            value={paymentCondition}
            onChange={(v) => onPaymentConditionChange(v as PaymentCondition)}
            placeholder="Seleccionar..."
            fullWidth
          />
          <Dropdown
            label="Descuentos"
            options={DISCOUNT_OPTIONS}
            value={discountRate}
            onChange={(v) => onDiscountRateChange(v)}
            placeholder="Seleccionar..."
            fullWidth
          />
          <TextField
            size="small"
            fullWidth
            label="Otros descuentos (%)"
            type="number"
            value={additionalDiscountRate}
            onChange={(e) => onAdditionalDiscountRateChange(e.target.value)}
            placeholder="0"
            inputProps={{ min: 0, max: 100, step: 0.01 }}
          />
        </Box>
        <TextField
          size="small"
          fullWidth
          multiline
          rows={3}
          label="Observaciones"
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Ingresa observaciones o notas adicionales para esta orden..."
        />
      </Box>
    </Box>
  );
};

export default OrderPaymentTermsCard;
