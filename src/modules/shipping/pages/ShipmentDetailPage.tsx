import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Typography, CircularProgress, Alert } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useShipmentDetail } from "../hooks/useShipmentDetail";
import { useShipmentStateChange } from "../hooks/useShipmentStateChange";
import { ShipmentStatusBadge } from "../components/ShipmentStatusBadge/ShipmentStatusBadge";
import { ShipmentStateSelector } from "../components/ShipmentStateSelector/ShipmentStateSelector";
import { formatDate } from "../utils/shipmentUtils";
import type { ShipmentState } from "../types";
import { useState } from "react";
import { Button } from "../../../shared/components/Button/Button";

const ShipmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shipment, loading, refetch } = useShipmentDetail(id);
  const { changeState, loading: stateLoading, error: stateError } = useShipmentStateChange();
  const [selectedState, setSelectedState] = useState<ShipmentState | null>(null);

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-full">
        <CircularProgress />
      </Box>
    );
  }

  if (!shipment) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Typography>Despacho no encontrado</Typography>
      </Box>
    );
  }

  const handleStateChange = async (newState: ShipmentState) => {
    const result = await changeState(shipment, newState);
    if (result) {
      setSelectedState(null);
      refetch();
    }
  };

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => navigate("/despachos")}
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver
        </Button>
        <ShipmentStatusBadge state={shipment.state} />
      </Box>

      <Card className="p-6 space-y-6">
        <Box className="grid grid-cols-2 gap-6">
          <Box>
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Transportista
            </Typography>
            <Typography variant="body1" className="font-semibold">
              {shipment.carrier?.name || "Sin asignar"}
            </Typography>
            {shipment.carrier && (
              <Typography variant="caption" color="text.secondary">
                Placa: {shipment.carrier.plate}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Ciudad
            </Typography>
            <Typography variant="body1">
              {shipment.city?.name || "-"}
            </Typography>
          </Box>

          <Box className="col-span-2">
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Dirección de Entrega
            </Typography>
            <Typography variant="body1">{shipment.deliveryAddress}</Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Fecha Est. de Entrega
            </Typography>
            <Typography variant="body1">
              {formatDate(shipment.estimatedDeliveryDate)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Fecha de Salida
            </Typography>
            <Typography variant="body1">
              {formatDate(shipment.departureDate)}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" variant="caption" className="block mb-2">
              Fecha de Entrega
            </Typography>
            <Typography variant="body1">
              {formatDate(shipment.deliveryDate)}
            </Typography>
          </Box>
        </Box>

        {stateError && (
          <Alert severity="error">{stateError}</Alert>
        )}

        <Box className="max-w-xs">
          <Typography color="text.secondary" variant="caption" className="block mb-2">
            Cambiar Estado
          </Typography>
          <ShipmentStateSelector
            currentState={shipment.state}
            value={selectedState || shipment.state}
            onChange={(state) => {
              setSelectedState(state);
              handleStateChange(state);
            }}
            disabled={stateLoading}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ShipmentDetailPage;
