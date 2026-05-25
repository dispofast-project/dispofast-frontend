import { Box, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { Search } from "lucide-react";

interface InventoryFiltersProps {
  search: string;
  stateFilter: string;
  onSearchChange: (value: string) => void;
  onStateFilterChange: (value: string) => void;
}

const InventoryFilters = ({
  search,
  stateFilter,
  onSearchChange,
  onStateFilterChange,
}: InventoryFiltersProps) => {
  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
      <TextField
        placeholder="Buscar por nombre, SKU o referencia..."
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1, minWidth: 220 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="w-4 h-4 text-gray-400" />
            </InputAdornment>
          ),
        }}
      />
      <Select
        size="small"
        displayEmpty
        value={stateFilter}
        onChange={(e) => onStateFilterChange(e.target.value)}
        sx={{ minWidth: 150 }}
        renderValue={(v) => {
          if (v === "") return <span className="text-gray-400">Todos los estados</span>;
          return v === "IN_STOCK" ? "Disponible" : "Agotado";
        }}
      >
        <MenuItem value="">Todos los estados</MenuItem>
        <MenuItem value="IN_STOCK">Disponible</MenuItem>
        <MenuItem value="OUT_OF_STOCK">Agotado</MenuItem>
      </Select>
    </Box>
  );
};

export default InventoryFilters;
