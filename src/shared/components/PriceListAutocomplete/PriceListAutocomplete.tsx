import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import type { PriceListResponse } from "../../../modules/clients/types";
import { getPriceListsService } from "../../../modules/clients/api/clients.api";

interface PriceListAutocompleteProps {
  value: PriceListResponse | null;
  onChange: (priceList: PriceListResponse | null) => void;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const PriceListAutocomplete = ({
  value,
  onChange,
  required = false,
  label = "Lista de Precios",
  error,
  helperText,
}: PriceListAutocompleteProps) => {
  const [options, setOptions] = useState<PriceListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPriceListsService()
      .then(setOptions)
      .catch((err) => console.error("Error cargando listas de precios:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      loading={isLoading}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_event, newValue) => onChange(newValue)}
      noOptionsText="No se encontraron listas de precios"
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
