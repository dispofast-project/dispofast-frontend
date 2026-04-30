import { Box, Typography, Select, MenuItem } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { PaymentCondition, OfferValidity } from "../types";
import PercentageInput from "../../../shared/components/PercentageInput/PercentageInput";
import CommercialDiscountSelect from "../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";
import type { PaymentCondition as PaymentConditionType, OfferValidity as OfferValidityType } from "../types";
import SectionTitle from "./SectionTitle";

interface QuoteTermsCardProps {
  paymentCondition: PaymentConditionType | "";
  offerValidity: OfferValidityType | "";
  commercialRate: string;
  otherRate: string;
  onPaymentConditionChange: (value: PaymentConditionType | "") => void;
  onOfferValidityChange: (value: OfferValidityType | "") => void;
  onCommercialRateChange: (value: string) => void;
  onOtherRateChange: (value: string) => void;
}

const QuoteTermsCard = ({
  paymentCondition,
  offerValidity,
  commercialRate,
  otherRate,
  onPaymentConditionChange,
  onOfferValidityChange,
  onCommercialRateChange,
  onOtherRateChange,
}: QuoteTermsCardProps) => (
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
        <Typography variant="body2" className="text-gray-500 mb-1">Validez de oferta</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={offerValidity}
          onChange={(e) => onOfferValidityChange(e.target.value as OfferValidityType | "")}
        >
          <MenuItem value="">Elegir</MenuItem>
          {(Object.keys(OfferValidity) as Array<keyof typeof OfferValidity>).map((key) => (
            <MenuItem key={key} value={key}>{OfferValidity[key]}</MenuItem>
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
    </Box>
  </Box>
);

export default QuoteTermsCard;
