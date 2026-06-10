import { Box, CircularProgress, Typography } from "@mui/material";
import type { ClientResponse } from "../../../clients/types";

interface ReceiptClientCardProps {
  clientIdentification: string;
  cityName: string | null;
  asesorName: string | null;
  client: ClientResponse | null;
  loading: boolean;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography
      variant="caption"
      className="font-semibold text-gray-400 uppercase tracking-wide block"
    >
      {label}
    </Typography>
    <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
      {value}
    </Typography>
  </Box>
);

const ReceiptClientCard = ({
  clientIdentification,
  cityName,
  asesorName,
  client,
  loading,
}: ReceiptClientCardProps) => (
  <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <Box className="px-6 py-4 border-b border-gray-100">
      <Typography variant="body1" className="font-semibold text-gray-800">
        Información cliente
      </Typography>
    </Box>

    <Box className="px-6 py-5">
      {loading ? (
        <Box className="flex justify-center py-4">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
          <Field label="NIT" value={clientIdentification} />
          <Field label="Tipo de Cliente" value={client?.clientType?.name ?? "-"} />
          <Field label="Ciudad" value={cityName ?? "-"} />
          <Field label="Dirección" value={client?.address ?? "-"} />
          <Field label="Teléfono" value={client?.phone ?? "-"} />
          <Field label="Correo" value={client?.email ?? "-"} />
          <Field label="Vendedor" value={asesorName ?? "-"} />
        </Box>
      )}
    </Box>
  </Box>
);

export default ReceiptClientCard;
