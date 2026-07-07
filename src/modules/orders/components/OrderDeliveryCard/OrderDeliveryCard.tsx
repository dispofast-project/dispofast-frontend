import { Box } from "@mui/material";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </Box>
);

interface OrderDeliveryCardProps {
  shipmentCityName: string;
  shipmentAddress: string;
  zone: string | null;
  trackingCode?: string | null;
}

const OrderDeliveryCard = ({
  shipmentCityName,
  shipmentAddress,
  zone,
  trackingCode,
}: OrderDeliveryCardProps) => (
  <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
    <h3 className="text-sm font-semibold text-gray-800">Información de Entrega</h3>
    <InfoRow label="Ciudad" value={shipmentCityName ?? "-"} />
    <InfoRow label="Dirección" value={shipmentAddress ?? "-"} />
    <Box className="grid grid-cols-2 gap-4">
      <InfoRow label="Zona" value={zone ?? "-"} />
      <InfoRow label="Guía" value={trackingCode ?? "-"} />
    </Box>
  </Box>
);

export default OrderDeliveryCard;
