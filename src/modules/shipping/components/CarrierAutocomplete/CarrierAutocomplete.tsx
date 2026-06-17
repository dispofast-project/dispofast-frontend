import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getAllCarriers } from "../../api/shipping.service";
import type { Carrier } from "../../types";

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
  const [options, setOptions] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadCarriers = async () => {
      setLoading(true);
      try {
        const response = await getAllCarriers({ size: 100, name: inputValue });
        setOptions(response.content);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadCarriers();
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => `${option.name} (${option.plate})`}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      loading={loading}
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
