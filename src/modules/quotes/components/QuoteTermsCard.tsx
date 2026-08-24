import { Box, Typography, Select, MenuItem, TextField, InputAdornment, Checkbox, FormControlLabel } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { PaymentCondition, OfferValidity } from "../types";
import PercentageInput from "../../../shared/components/PercentageInput/PercentageInput";
import CommercialDiscountSelect from "../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";
import { RetefuenteTypeSelector } from "../../../shared/components/RetefuenteTypeSelector/RetefuenteTypeSelector";
import { RetefuenteType } from "../../clients/types";
import type { PaymentCondition as PaymentConditionType, OfferValidity as OfferValidityType } from "../types";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";

interface QuoteTermsCardProps {
  paymentCondition: PaymentConditionType | "";
  offerValidity: OfferValidityType | "";
  commercialRate: string;
  otherRate: string;
  freight: number;
  shipmentAddress: string;
  retefuenteOverride: RetefuenteType | "";
  backorder: boolean;
  onPaymentConditionChange: (value: PaymentConditionType | "") => void;
  onOfferValidityChange: (value: OfferValidityType | "") => void;
  onCommercialRateChange: (value: string) => void;
  onOtherRateChange: (value: string) => void;
  onFreightChange: (value: number) => void;
  onShipmentAddressChange: (value: string) => void;
  onRetefuenteOverrideChange: (value: RetefuenteType | "") => void;
  onBackorderChange: (value: boolean) => void;
}

const QuoteTermsCard = ({
  paymentCondition,
  offerValidity,
  commercialRate,
  otherRate,
  freight,
  shipmentAddress,
  retefuenteOverride,
  backorder,
  onPaymentConditionChange,
  onOfferValidityChange,
  onCommercialRateChange,
  onOtherRateChange,
  onFreightChange,
  onShipmentAddressChange,
  onRetefuenteOverrideChange,
  onBackorderChange,
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
      <Box className="sm:col-span-2">
        <Typography variant="body2" className="text-gray-500 mb-1">Dirección de despacho</Typography>
        <TextField
          size="small"
          fullWidth
          value={shipmentAddress}
          onChange={(e) => onShipmentAddressChange(e.target.value)}
          placeholder="Dirección para el despacho de la orden"
        />
      </Box>
      <Box className="sm:col-span-2">
        <FormControlLabel
          control={
            <Checkbox
              checked={backorder}
              onChange={(e) => onBackorderChange(e.target.checked)}
            />
          }
          label="Backorder — producto sin stock disponible actualmente"
        />
      </Box>
    </Box>
  </Box>
);

export default QuoteTermsCard;
