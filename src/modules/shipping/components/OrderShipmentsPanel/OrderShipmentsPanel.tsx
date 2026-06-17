import { Box, Typography, CircularProgress, Card } from "@mui/material";
import { Truck } from "lucide-react";
import { useShipmentByInvoice } from "../../hooks/useShipmentByInvoice";
import { ShipmentStatusBadge } from "../ShipmentStatusBadge/ShipmentStatusBadge";
import { formatDate } from "../../utils/shipmentUtils";

interface OrderShipmentsPanelProps {
  invoiceId: string;
}

export const OrderShipmentsPanel = ({ invoiceId }: OrderShipmentsPanelProps) => {
  const { shipment, loading, error } = useShipmentByInvoice(invoiceId);

  if (loading) return <CircularProgress size={24} />;

  if (error) {
    return (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    );
  }

  if (!shipment) {
    return (
      <Typography color="text.secondary" variant="body2">
        Sin despachos asignados
      </Typography>
    );
  }

  return (
    <Card className="p-4 border border-gray-100">
      <Box className="flex items-start justify-between">
        <Box className="flex items-start gap-3 flex-1">
          <Truck className="w-4 h-4 text-blue-600 mt-1" />
          <Box className="flex-1">
            <Typography variant="subtitle2" className="font-semibold">
              {shipment.carrier?.name || "Sin transportista"}
            </Typography>
            {shipment.carrier && (
              <Typography variant="caption" color="text.secondary">
                Placa: {shipment.carrier.plate}
              </Typography>
            )}
            <Typography variant="caption" className="block mt-1">
              {shipment.deliveryAddress}
              {shipment.city && ` - ${shipment.city.name}`}
            </Typography>
            <Typography variant="caption" color="text.secondary" className="block mt-2">
              Salida: {formatDate(shipment.departureDate)} | Entrega:{" "}
              {formatDate(shipment.deliveryDate)}
            </Typography>
          </Box>
        </Box>
        <ShipmentStatusBadge state={shipment.state} />
      </Box>
    </Card>
  );
};
