import { Autocomplete, TextField } from "@mui/material";
import { getAllCarriers } from "../../api/shipping.service";
import type { Carrier } from "../../types";
import { useApiAutocomplete } from "../../../../shared/hooks/useApiAutocomplete";

interface CarrierAutocompleteProps {
  value: Carrier | null;
  onChange: (carrier: Carrier | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const CarrierAutocomplete = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
}: CarrierAutocompleteProps) => {
  const { options, isSearching, open, setOpen, handleInputChange } =
    useApiAutocomplete<Carrier>({
      fetchFn: (query) => getAllCarriers({ size: 100, name: query }).then((r) => r.content),
      debounceMs: 300,
    });

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue, reason) => handleInputChange(newInputValue, reason)}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      loading={isSearching}
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Transportista"
          placeholder="Buscar transportista..."
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};
