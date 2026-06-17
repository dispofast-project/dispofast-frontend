import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import type { City } from "../../../shared/types/location";
import { searchCitiesService } from "../../../modules/clients/api/locations.api";
import { useApiAutocomplete } from "../../hooks/useApiAutocomplete";

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
  helperText,
}: CityAutocompleteProps) => {
  const { options, setOptions, isSearching, open, setOpen, handleInputChange } =
    useApiAutocomplete<City>({
      fetchFn: searchCitiesService,
      debounceMs: 400,
    });

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={options}
      getOptionLabel={(option) => `${option.name} - ${option.department.name}`}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setOptions(value ? [value] : []);
      }}
      noOptionsText={isSearching ? "Buscando..." : "No se encontraron ciudades"}
      onChange={(_event, newValue: City | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue);
      }}
      onInputChange={(_event, newInputValue, reason) => handleInputChange(newInputValue, reason)}
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
                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
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
