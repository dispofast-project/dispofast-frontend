import { Box, Typography, Divider } from "@mui/material";
import { AlertCircle, Circle } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { formatCurrency, formatDate } from "../../utils/format";
import type { ClientPreview } from "../../../clients/types";
import type { OrderItem } from "../../hooks/useCreateOrder";

interface OrderSummaryPanelProps {
  selectedClient: ClientPreview | null;
  orderNumber: string;
  subtotal: number;
  items: OrderItem[];
  missingFields: string[];
  isLoading: boolean;
  onSubmit: () => void;
}

const OrderSummaryPanel = ({
  selectedClient,
  orderNumber,
  subtotal,
  items,
  missingFields,
  isLoading,
  onSubmit,
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
          {/* Client display */}
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

          {/* Order metadata */}
          <Box className="flex flex-col gap-2.5">
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Nº Orden</Typography>
              <Typography variant="body2" className="font-bold text-gray-800">
                {orderNumber}
              </Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Fecha</Typography>
              <Typography variant="body2" className="font-medium text-gray-700">
                {formatDate(new Date())}
              </Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Estado</Typography>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                Creada
              </span>
            </Box>
          </Box>

          <Divider />

          {/* Totals */}
          <Box className="flex flex-col gap-2">
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Productos</Typography>
              <Typography variant="body2" className="font-medium text-gray-700">
                {items.length} {items.length === 1 ? "ítem" : "ítems"}
              </Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-500">Subtotal</Typography>
              <Typography variant="body2" className="font-medium text-gray-700">
                {formatCurrency(subtotal)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box className="flex items-center justify-between">
            <Typography variant="body1" className="font-bold text-gray-800">
              Total Orden
            </Typography>
            <Typography
              variant="h6"
              className="font-bold"
              sx={{ color: "var(--dispofast-primary)" }}
            >
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          <Button
            variant="primary"
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={missingFields.length > 0 || isLoading}
            className="w-full justify-center"
          >
            Crear Orden
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

export default OrderSummaryPanel;
