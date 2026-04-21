import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import type { City } from "../../../shared/types/location";
import { searchCitiesService } from "../../../modules/clients/api/locations.api";

interface CityAutocompleteProps {
  value: City | null;
  onChange: (city: City | null) => void;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const CityAutocomplete = ({ 
  value, 
  onChange, 
  required = false, 
  label = "Ciudad",
  error,
  helperText
}: CityAutocompleteProps) => {
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [cityInputValue, setCityInputValue] = useState("");
  const [isCitySearching, setIsCitySearching] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    if (!open && cityInputValue === "") {
      setCityOptions(value ? [value] : []);
      return undefined;
    }

    setIsCitySearching(true);
    const debounce = cityInputValue === "" ? 0 : 400;
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchCitiesService(cityInputValue);
        if (active) {
          setCityOptions(results);
        }
      } catch (err) {
        if (active) {
          console.error("Error buscando ciudades:", err);
        }
      } finally {
        if (active) {
          setIsCitySearching(false);
        }
      }
    }, debounce);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [cityInputValue, value, open]);

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={cityOptions}
      getOptionLabel={(option) => `${option.name} - ${option.department.name}`}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      noOptionsText={isCitySearching ? "Buscando..." : "No se encontraron ciudades"}
      onChange={(_event, newValue: City | null) => {
        setCityOptions(newValue ? [newValue, ...cityOptions] : cityOptions);
        onChange(newValue);
      }}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setCityInputValue(newInputValue);
        }
      }}
      isOptionEqualToValue={(option, val) => option.code === val.code}
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
                {isCitySearching ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          <Box>
            <Typography variant="body2">{option.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {option.department.name}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
};