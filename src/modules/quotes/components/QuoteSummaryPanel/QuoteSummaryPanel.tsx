import { Box, Typography, Divider, TextField, InputAdornment, Alert } from "@mui/material";
import { AlertCircle, Circle } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { formatCurrency } from "../../../../shared/utils/currency";

interface AccountInfo {
  name: string;
  identificationNumber?: string;
  retefuenteApplies?: boolean;
}

interface QuoteSummaryPanelProps {
  accountInfo: AccountInfo;
  subtotal: number;
  tax: number;
  commercialDiscountAmt: number;
  otherDiscountAmt: number;
  retefuenteAmt: number;
  freight: number;
  onFreightChange: (v: number) => void;
  total: number;
  itemCount: number;
  missingFields: string[];
  isSaving: boolean;
  error?: string | null;
  onSave: () => void;
}

const SummaryRow = ({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
}) => (
  <Box className="flex items-center justify-between">
    <Typography variant="body2" className="text-gray-500">
      {label}
    </Typography>
    <Typography
      variant="body2"
      className={`font-medium ${negative ? "text-red-600" : "text-gray-700"}`}
    >
      {negative ? `- ${formatCurrency(value)}` : formatCurrency(value)}
    </Typography>
  </Box>
);

const QuoteSummaryPanel = ({
  accountInfo,
  subtotal,
  tax,
  commercialDiscountAmt,
  otherDiscountAmt,
  retefuenteAmt,
  freight,
  onFreightChange,
  total,
  itemCount,
  missingFields,
  isSaving,
  error,
  onSave,
}: QuoteSummaryPanelProps) => {
  return (
    <Box className="lg:col-span-1 sticky top-4">
      <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Box className="px-5 py-4 border-b border-gray-100">
          <Typography variant="body1" className="font-bold text-gray-800">
            Resumen de la Cotización
          </Typography>
        </Box>

        <Box className="px-5 py-4 flex flex-col gap-4">
          {/* Cliente */}
          <Box>
            <Typography
              variant="caption"
              className="font-semibold text-gray-400 uppercase tracking-wide"
            >
              Cliente
            </Typography>
            <Box className="mt-1 p-2.5 bg-blue-50 rounded-lg">
              <Typography variant="body2" className="font-semibold text-dispofast-primary">
                {accountInfo.name}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {accountInfo.identificationNumber}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Metadata */}
          <Box className="flex flex-col gap-2.5">
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">
                Ítems
              </Typography>
              <Typography variant="body2" className="font-medium text-gray-700">
                {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
              </Typography>
            </Box>
            {accountInfo.retefuenteApplies && (
              <Box className="flex items-center justify-between">
                <Typography variant="body2" className="text-gray-500">
                  Retefuente
                </Typography>
                <Typography variant="body2" className="font-medium text-orange-500">
                  Aplica
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Desglose financiero */}
          <Box className="flex flex-col gap-2">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="IVA (19%)" value={tax} />
            {commercialDiscountAmt > 0 && (
              <SummaryRow label="Descuento comercial" value={commercialDiscountAmt} negative />
            )}
            {otherDiscountAmt > 0 && (
              <SummaryRow label="Otros descuentos" value={otherDiscountAmt} negative />
            )}
            {retefuenteAmt > 0 && (
              <SummaryRow label="Retefuente (3.5%)" value={retefuenteAmt} negative />
            )}

            {/* Flete — editable */}
            <Box className="flex items-center justify-between gap-2">
              <Typography variant="body2" className="text-gray-500 shrink-0">
                Flete
              </Typography>
              <TextField
                size="small"
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
                sx={{ width: 130 }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Total */}
          <Box className="flex items-center justify-between">
            <Typography variant="body1" className="font-bold text-gray-800">
              Total Estimado
            </Typography>
            <Typography
              variant="h6"
              className="font-bold"
              sx={{ color: "var(--dispofast-primary)" }}
            >
              {formatCurrency(total)}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
              {error}
            </Alert>
          )}

          <Button
            variant="primary"
            onClick={onSave}
            isLoading={isSaving}
            disabled={missingFields.length > 0 || isSaving}
            className="w-full justify-center"
          >
            Guardar Cotización
          </Button>

          {missingFields.length > 0 && (
            <Box className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <Box className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <Typography variant="caption" className="font-semibold text-amber-700">
                  Campos requeridos
                </Typography>
              </Box>
              <Box className="flex flex-col gap-1">
                {missingFields.map((field) => (
                  <Box key={field} className="flex items-center gap-1.5">
                    <Circle className="w-2 h-2 text-amber-500" fill="currentColor" />
                    <Typography variant="caption" className="text-amber-700">
                      {field}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuoteSummaryPanel;
