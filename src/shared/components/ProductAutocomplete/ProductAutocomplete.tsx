import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import { getAllInventoryProducts, type InventoryItem } from "../../../modules/inventory/api/inventory.service";

interface ProductAutocompleteProps {
  value: InventoryItem | null;
  onChange: (product: InventoryItem | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const ProductAutocomplete = ({
  value,
  onChange,
  label = "Producto",
  error,
  helperText,
}: ProductAutocompleteProps) => {
  const [options, setOptions] = useState<InventoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getAllInventoryProducts(0, 200)
      .then((res) => setOptions(res.content))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [open]);

  const filtered = inputValue.trim()
    ? options.filter((o) =>
        o.productName.toLowerCase().includes(inputValue.toLowerCase()) ||
        o.sku.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : options;

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={filtered}
      getOptionLabel={(option) => `${option.sku} - ${option.productName}`}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      noOptionsText={isLoading ? "Cargando..." : "No se encontraron productos"}
      onChange={(_event, newValue: InventoryItem | null) => onChange(newValue)}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason === "input" || reason === "clear") setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, val) => option.productId === val.productId}
      renderInput={(params) => (
        <TextField
          {...params}
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
      renderOption={(props, option) => (
        <li {...props} key={option.productId}>
          <Box>
            <Typography variant="body2">{option.productName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {option.sku}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
};
