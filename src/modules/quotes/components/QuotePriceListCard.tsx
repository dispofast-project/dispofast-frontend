import { Box, Typography, Select, MenuItem } from "@mui/material";
import type { Quote, PriceList } from "../types";

interface QuotePriceListCardProps {
  quote: Quote | null;
  priceLists: PriceList[];
  selectedPriceListId: string;
  setSelectedPriceListId: (id: string) => void;
}

const QuotePriceListCard = ({
  quote: _quote,
  priceLists,
  selectedPriceListId,
  setSelectedPriceListId,
}: QuotePriceListCardProps) => {
  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <Typography variant="body2" className="text-gray-500 mb-1">Lista de Precios</Typography>
      <Select
        size="small"
        fullWidth
        value={selectedPriceListId}
        onChange={(e) => setSelectedPriceListId(e.target.value as string)}
        sx={{ "& .MuiSelect-select": { padding: "8px 14px" } }}
      >
        {priceLists.map((pl) => (
          <MenuItem key={pl.id} value={pl.id}>
            {pl.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default QuotePriceListCard;
