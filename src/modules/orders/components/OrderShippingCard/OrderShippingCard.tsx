import { Box, Typography } from "@mui/material";
import { MapPin } from "lucide-react";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import { Input } from "../../../../shared/components/Input/Input";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import { ZONE_OPTIONS } from "../../constants/orderConstants";
import type { City } from "../../../../shared/types/location";

interface OrderShippingCardProps {
  shipmentCity: City | null;
  onShipmentCityChange: (city: City | null) => void;
  zone: string;
  onZoneChange: (zone: string) => void;
  shipmentAddress: string;
  onShipmentAddressChange: (address: string) => void;
}

const OrderShippingCard = ({
  shipmentCity,
  onShipmentCityChange,
  zone,
  onZoneChange,
  shipmentAddress,
  onShipmentAddressChange,
}: OrderShippingCardProps) => {
  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Box className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-dispofast-primary" />
        </Box>
        <Box>
          <Typography variant="body1" className="font-semibold text-gray-800">
            Información de Envío
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Datos del lugar de entrega de la orden
          </Typography>
        </Box>
      </Box>

      <Box className="px-6 py-5 flex flex-col gap-4">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CityAutocomplete
            value={shipmentCity}
            onChange={onShipmentCityChange}
            required
            label="Ciudad de Envío *"
          />
          <Dropdown
            label="Zona"
            options={ZONE_OPTIONS}
            value={zone}
            onChange={(v) => onZoneChange(v)}
            placeholder="Seleccionar zona..."
            fullWidth
          />
        </Box>

        <Input
          label="Dirección de Entrega *"
          value={shipmentAddress}
          onChange={(e) => onShipmentAddressChange(e.target.value)}
          placeholder="Ej: Calle 123 #45-67, Piso 2, Bodega 3"
        />
      </Box>
    </Box>
  );
};

export default OrderShippingCard;
