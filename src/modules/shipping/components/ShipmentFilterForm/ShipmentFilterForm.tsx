import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { Filter, FilterX, Settings } from "lucide-react";
import { AdvisorAutocomplete } from "../../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import type { User } from "../../../iam/types";

export interface ShipmentFilterValues {
  client: string;
  advisor: User | null;
  dateFrom: string;
  dateTo: string;
}

interface ShipmentFilterFormProps {
  values: ShipmentFilterValues;
  onChange: (values: ShipmentFilterValues) => void;
  onFilter: () => void;
  onClear: () => void;
}

export const ShipmentFilterForm = ({
  values,
  onChange,
  onFilter,
  onClear,
}: ShipmentFilterFormProps) => {
  const [showFilters, setShowFilters] = useState(true);
  const [configMenuAnchor, setConfigMenuAnchor] = useState<null | HTMLElement>(null);

  const set = <K extends keyof ShipmentFilterValues>(key: K, value: ShipmentFilterValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box className="flex justify-end gap-1" sx={{ mb: showFilters ? 2 : 0 }}>
        <Tooltip title="Limpiar filtros">
          <IconButton size="small" onClick={onClear}>
            <FilterX size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}>
          <IconButton
            size="small"
            onClick={() => setShowFilters((v) => !v)}
            color={showFilters ? "primary" : "default"}
          >
            <Filter size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Opciones de configuración">
          <IconButton size="small" onClick={(e) => setConfigMenuAnchor(e.currentTarget)}>
            <Settings size={18} />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={configMenuAnchor}
          open={Boolean(configMenuAnchor)}
          onClose={() => setConfigMenuAnchor(null)}
        >
          <MenuItem onClick={() => setConfigMenuAnchor(null)}>Transportadoras</MenuItem>
          <MenuItem onClick={() => setConfigMenuAnchor(null)}>Vehículos</MenuItem>
        </Menu>
      </Box>

      {showFilters && (
        <Box className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <TextField
            size="small"
            label="Cliente / Prospecto"
            value={values.client}
            onChange={(e) => set("client", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onFilter()}
          />

          <AdvisorAutocomplete
            value={values.advisor}
            onChange={(advisor) => set("advisor", advisor)}
            label="Asesor"
          />

          <TextField
            size="small"
            label="Fecha facturación"
            type="date"
            value={values.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            size="small"
            label="Fecha entrega"
            type="date"
            value={values.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button
            variant="contained"
            size="large"
            startIcon={<Filter size={15} />}
            onClick={onFilter}
            sx={{ alignSelf: "center" }}
          >
            Filtrar
          </Button>
        </Box>
      )}
    </Paper>
  );
};
