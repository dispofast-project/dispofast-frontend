import { Box, Typography } from "@mui/material";
import { Calendar, Receipt } from "lucide-react";

interface ReceiptHeaderProps {
  clientName: string;
  clientIdentification: string;
  receiptRef: string;
}

const ReceiptHeader = ({
  clientName,
  clientIdentification,
  receiptRef,
}: ReceiptHeaderProps) => {
  const today = new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
      <Box className="flex items-center gap-4">
        <Box className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg select-none">
          {clientName.charAt(0).toUpperCase()}
        </Box>
        <Box>
          <Typography variant="h6" className="font-bold text-gray-800 leading-tight">
            {clientName}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            Código: {clientIdentification}
          </Typography>
        </Box>
      </Box>

      <Box className="text-right">
        <Box className="flex items-center justify-end gap-1.5 text-gray-500 mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <Typography variant="caption">{today}</Typography>
        </Box>
        <Box className="flex items-center justify-end gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-orange-500" />
          <Typography
            variant="caption"
            className="font-semibold"
            sx={{ color: "#F97316" }}
          >
            Recibo de caja: {receiptRef}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReceiptHeader;
