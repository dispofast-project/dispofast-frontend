import { Box, Typography, Select, MenuItem, Button, CircularProgress } from "@mui/material";
import DataField from "./detailcard/DetailItem";
import { formatDate } from "../../../shared/utils/date";
import type { Quote, PriceList } from "../types";

interface QuotePriceListCardProps {
  quote: Quote | null;
  priceLists: PriceList[];
  selectedPriceListId: string;
  setSelectedPriceListId: (id: string) => void;
  isSaving: boolean;
  handleSave: () => void;
}

const QuotePriceListCard = ({
  quote,
  priceLists,
  selectedPriceListId,
  setSelectedPriceListId,
  isSaving,
  handleSave,
}: QuotePriceListCardProps) => {
  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <Box className="flex flex-col gap-4">
        <Box>
          <Typography variant="body2" className="text-gray-500 mb-1">Lista de Precios</Typography>
          <Select
            size="small"
            fullWidth
            value={selectedPriceListId}
            onChange={(e) => setSelectedPriceListId(e.target.value as string)}
            disabled={isSaving}
            sx={{
              "& .MuiSelect-select": {
                padding: "8px 14px",
              },
            }}
          >
            {priceLists.map((pl) => (
              <MenuItem key={pl.id} value={pl.id}>
                {pl.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <DataField label="Asesor Validado" value={quote?.sellerName} />
        <DataField label="Fecha de Expiración" value={quote?.expirationDate ? formatDate(quote.expirationDate) : ""} />
      </Box>
      
      <Button 
         variant="contained" 
         color="primary" 
         fullWidth 
         onClick={handleSave}
         disabled={isSaving || selectedPriceListId === quote?.priceList?.id}
      >
         {isSaving ? <CircularProgress size={24} color="inherit" /> : "Guardar cambios"}
      </Button>
    </Box>
  );
};

export default QuotePriceListCard;
