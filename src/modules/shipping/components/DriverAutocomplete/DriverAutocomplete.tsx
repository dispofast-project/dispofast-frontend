import { Autocomplete, TextField } from "@mui/material";
import { getAllDrivers } from "../../api/shipping.service";
import type { Driver } from "../../types";
import { useApiAutocomplete } from "../../../../shared/hooks/useApiAutocomplete";

interface DriverAutocompleteProps {
  value: Driver | null;
  onChange: (driver: Driver | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const DriverAutocomplete = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
  label = "Conductor",
}: DriverAutocompleteProps) => {
  const { options, setOptions, isSearching, open, setOpen, handleInputChange } =
    useApiAutocomplete<Driver>({
      fetchFn: (query) => getAllDrivers({ size: 100, name: query || undefined }).then((r) => r.content),
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
      getOptionLabel={(option) =>
        option.cedula ? `${option.name} — C.C. ${option.cedula}` : option.name
      }
      isOptionEqualToValue={(option, val) => option.id === val.id}
      filterOptions={(x) => x}
      filterSelectedOptions
      loading={isSearching}
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Buscar conductor..."
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};
