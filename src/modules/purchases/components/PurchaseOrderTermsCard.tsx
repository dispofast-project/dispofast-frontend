import { Box, Typography, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { PaymentCondition } from "../types";
import PercentageInput from "../../../shared/components/PercentageInput/PercentageInput";
import CommercialDiscountSelect from "../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";
import { RetefuenteTypeSelector } from "../../../shared/components/RetefuenteTypeSelector/RetefuenteTypeSelector";
import { RetefuenteType } from "../../clients/types";
import type { PaymentCondition as PaymentConditionType } from "../types";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";

interface PurchaseOrderTermsCardProps {
  paymentCondition: PaymentConditionType | "";
  commercialRate: string;
  otherRate: string;
  freight: number;
  retefuenteOverride: RetefuenteType | "";
  onPaymentConditionChange: (value: PaymentConditionType | "") => void;
  onCommercialRateChange: (value: string) => void;
  onOtherRateChange: (value: string) => void;
  onFreightChange: (value: number) => void;
  onRetefuenteOverrideChange: (value: RetefuenteType | "") => void;
}

const PurchaseOrderTermsCard = ({
  paymentCondition,
  commercialRate,
  otherRate,
  freight,
  retefuenteOverride,
  onPaymentConditionChange,
  onCommercialRateChange,
  onOtherRateChange,
  onFreightChange,
  onRetefuenteOverrideChange,
}: PurchaseOrderTermsCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
    <SectionTitle icon={<AssignmentIcon fontSize="small" />}>Términos</SectionTitle>
    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Box>
        <Typography variant="body2" className="text-gray-500 mb-1">Condiciones de pago</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={paymentCondition}
          onChange={(e) => onPaymentConditionChange(e.target.value as PaymentConditionType | "")}
        >
          <MenuItem value="">Elegir</MenuItem>
          {(Object.keys(PaymentCondition) as Array<keyof typeof PaymentCondition>).map((key) => (
            <MenuItem key={key} value={key}>{PaymentCondition[key]}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Typography variant="body2" className="text-gray-500 mb-1">Descuento comercial</Typography>
        <CommercialDiscountSelect value={commercialRate} onChange={onCommercialRateChange} />
      </Box>
      <Box>
        <Typography variant="body2" className="text-gray-500 mb-1">Otros descuentos</Typography>
        <PercentageInput value={otherRate} onChange={onOtherRateChange} fullWidth />
      </Box>
      <Box>
        <Typography variant="body2" className="text-gray-500 mb-1">Flete</Typography>
        <TextField
          size="small"
          fullWidth
          type="number"
          value={freight || ""}
          onChange={(e) => onFreightChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          slotProps={{
            htmlInput: { min: 0, step: 1000 },
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        />
      </Box>
      <Box>
        <RetefuenteTypeSelector
          value={retefuenteOverride || RetefuenteType.NO_APLICA}
          onChange={(e) => onRetefuenteOverrideChange(e.target.value as RetefuenteType)}
        />
      </Box>
    </Box>
  </Box>
);

export default PurchaseOrderTermsCard;
