import { Autocomplete, TextField } from "@mui/material";
import { getAllVehicles } from "../../api/shipping.service";
import type { Vehicle } from "../../types";
import { useApiAutocomplete } from "../../../../shared/hooks/useApiAutocomplete";
import { VEHICLE_TYPE_LABELS } from "../../constants/shippingConstants";

interface VehicleAutocompleteProps {
  value: Vehicle | null;
  onChange: (vehicle: Vehicle | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const VehicleAutocomplete = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
}: VehicleAutocompleteProps) => {
  const { options, setOptions, isSearching, open, setOpen, handleInputChange } =
    useApiAutocomplete<Vehicle>({
      fetchFn: (query) => getAllVehicles({ size: 100, plate: query }).then((r) => r.content),
      debounceMs: 300,
    });

  return (
    <Autocomplete
      size="small"
      value={value}
      onChange={(_, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue);
      }}
      onInputChange={(_, newInputValue, reason) => handleInputChange(newInputValue, reason)}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setOptions(value ? [value] : []);
      }}
      options={options}
      getOptionLabel={(option) => `${option.plate} — ${VEHICLE_TYPE_LABELS[option.type]}`}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      filterOptions={(x) => x}
      filterSelectedOptions
      loading={isSearching}
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Vehículo"
          placeholder="Buscar por placa..."
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};
