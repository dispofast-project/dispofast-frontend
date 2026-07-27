import { Box, Typography, Button } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SectionTitle from "./SectionTitle";

interface CompleteProspectCardProps {
  onCompleteClient: () => void;
}

const CompleteProspectCard = ({ onCompleteClient }: CompleteProspectCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
    <SectionTitle icon={<PersonAddAlt1Icon fontSize="small" />}>Completar Cliente</SectionTitle>
    <Typography variant="body2" className="text-gray-500 mb-4">
      Esta cotización pertenece a un prospecto. Completa los datos del cliente para poder generar la orden.
    </Typography>
    <Button
      variant="contained"
      fullWidth
      startIcon={<PersonAddAlt1Icon />}
      onClick={onCompleteClient}
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      Completar cliente
    </Button>
  </Box>
);

export default CompleteProspectCard;
