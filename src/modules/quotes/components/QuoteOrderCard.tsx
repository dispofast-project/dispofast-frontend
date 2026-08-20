import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";

interface QuoteOrderCardProps {
  isCreatingOrder: boolean;
  orderError: string | null;
  onCreateOrder: () => void;
}

const QuoteOrderCard = ({ isCreatingOrder, orderError, onCreateOrder }: QuoteOrderCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
    <SectionTitle icon={<ShoppingCartIcon fontSize="small" />}>Orden de Compra</SectionTitle>
    <Typography variant="body2" className="text-gray-500 mb-4">
      Esta cotización está aprobada. Puedes generar una orden de compra.
    </Typography>
    {orderError && (
      <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem" }}>
        {orderError}
      </Alert>
    )}
    <Button
      variant="contained"
      fullWidth
      startIcon={isCreatingOrder ? <CircularProgress size={16} color="inherit" /> : <ShoppingCartIcon />}
      disabled={isCreatingOrder}
      onClick={onCreateOrder}
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      {isCreatingOrder ? "Creando orden..." : "Convertir a Orden"}
    </Button>
  </Box>
);

export default QuoteOrderCard;
