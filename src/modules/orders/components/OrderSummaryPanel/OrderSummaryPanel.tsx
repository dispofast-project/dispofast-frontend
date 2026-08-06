import { Box, Typography, Divider, TextField, InputAdornment } from "@mui/material";
import { AlertCircle, Circle } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { formatCurrency, formatDate } from "../../utils/format";
import type { ClientPreview } from "../../../clients/types";
import type { OrderItem } from "../../hooks/useCreateOrder";

interface OrderSummaryPanelProps {
  selectedClient: ClientPreview | null;
  orderNumber?: string;
  orderDate?: Date;
  subtotal: number;
  tax: number;
  discount: number;
  additionalDiscount: number;
  retefuente: number;
  freight: number;
  onFreightChange: (v: number) => void;
  total: number;
  items: OrderItem[];
  missingFields: string[];
  isLoading: boolean;
  onSubmit: () => void;
  submitLabel?: string;
}

const SummaryRow = ({ label, value, negative = false }: { label: string; value: number; negative?: boolean }) => (
  <Box className="flex items-center justify-between">
    <Typography variant="body2" className="text-gray-500">{label}</Typography>
    <Typography variant="body2" className={`font-medium ${negative ? "text-red-600" : "text-gray-700"}`}>
      {negative ? `- ${formatCurrency(value)}` : formatCurrency(value)}
    </Typography>
  </Box>
);

const OrderSummaryPanel = ({
  selectedClient,
  orderNumber,
  orderDate,
  subtotal,
  tax,
  discount,
  additionalDiscount,
  retefuente,
  freight,
  onFreightChange,
  total,
  items,
  missingFields,
  isLoading,
  onSubmit,
  submitLabel = "Crear Orden",
}: OrderSummaryPanelProps) => {

  return (
    <Box className="lg:col-span-1 sticky top-4">
      <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Box className="px-5 py-4 border-b border-gray-100">
          <Typography variant="body1" className="font-bold text-gray-800">
            Resumen de la Orden
          </Typography>
        </Box>

        <Box className="px-5 py-4 flex flex-col gap-4">
          {/* Client */}
          <Box>
            <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide">
              Cliente
            </Typography>
            {selectedClient ? (
              <Box className="mt-1 p-2.5 bg-blue-50 rounded-lg">
                <Typography variant="body2" className="font-semibold text-dispofast-primary">
                  {selectedClient.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {selectedClient.identificationNumber}
                </Typography>
              </Box>
            ) : (
              <Box className="mt-1 p-2.5 bg-gray-50 rounded-lg">
                <Typography variant="body2" className="text-gray-400 text-center text-sm">
                  Sin cliente seleccionado
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Metadata */}
          <Box className="flex flex-col gap-2.5">
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Nº Orden</Typography>
              <Typography variant="body2" className="font-bold text-gray-800">
                {orderNumber ?? "Se genera al crear"}
              </Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Fecha</Typography>
              <Typography variant="body2" className="font-medium text-gray-700">{formatDate(orderDate ?? new Date())}</Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Ítems</Typography>
              <Typography variant="body2" className="font-medium text-gray-700">
                {items.length} {items.length === 1 ? "ítem" : "ítems"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Financial breakdown */}
          <Box className="flex flex-col gap-2">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="IVA (19%)" value={tax} />
            {discount > 0 && <SummaryRow label="Descuento comercial" value={discount} negative />}
            {additionalDiscount > 0 && <SummaryRow label="Otros descuentos" value={additionalDiscount} negative />}
            {retefuente > 0 && <SummaryRow label="Retefuente (3.5%)" value={retefuente} negative />}


            {/* Flete — editable */}
            <Box className="flex items-center justify-between gap-2">
              <Typography variant="body2" className="text-gray-500 shrink-0">Flete</Typography>
              <TextField
                size="small"
                type="number"
                value={freight || ""}
                onChange={(e) => onFreightChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
                slotProps={{
                  htmlInput: { min: 0, step: 1000 },
                  input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                }}
                sx={{ width: 130 }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Total */}
          <Box className="flex items-center justify-between">
            <Typography variant="body1" className="font-bold text-gray-800">Total Orden</Typography>
            <Typography variant="h6" className="font-bold" sx={{ color: "var(--dispofast-primary)" }}>
              {formatCurrency(total)}
            </Typography>
          </Box>

          <Button
            variant="primary"
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={missingFields.length > 0 || isLoading}
            className="w-full justify-center"
          >
            {submitLabel}
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
                    <Typography variant="caption" className="text-amber-700">{field}</Typography>
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

export default OrderSummaryPanel;
