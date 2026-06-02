import { Box } from "@mui/material";
import { User } from "lucide-react";
import type { ClientResponse } from "../../../clients/types";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
  </Box>
);

interface OrderClientDetailCardProps {
  client: ClientResponse | null;
}

const OrderClientDetailCard = ({ client }: OrderClientDetailCardProps) => (
  <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
    <Box className="flex items-center gap-2">
      <Box className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
        <User className="w-3.5 h-3.5 text-dispofast-primary" />
      </Box>
      <h3 className="text-sm font-semibold text-gray-800">Información del Cliente</h3>
    </Box>

    {client ? (
      <>
        <InfoRow label="Nombre" value={client.name} />
        <Box className="grid grid-cols-2 gap-4">
          <InfoRow label="NIT / Identificación" value={client.identificationNumber} />
          <InfoRow label="Teléfono" value={client.phone} />
        </Box>
        <InfoRow label="Correo Electrónico" value={client.email} />
        <InfoRow label="Dirección" value={client.address} />
      </>
    ) : (
      <p className="text-xs text-gray-400 italic">Cargando información del cliente...</p>
    )}
  </Box>
);

export default OrderClientDetailCard;
