import { Box, Typography } from "@mui/material";
import type { Shipment } from "../../types";

interface Props {
  shipment: Shipment;
}

export const ShipmentHistorialTab = (_: Props) => (
  <Box className="flex justify-center py-12">
    <Typography color="text.secondary">
      Próximamente — historial de cambios del despacho.
    </Typography>
  </Box>
);
