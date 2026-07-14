import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import type { User } from "../../../modules/iam/types";
import { searchUsers } from "../../../modules/iam/api/user.service";
import { useApiAutocomplete } from "../../hooks/useApiAutocomplete";

interface AdvisorAutocompleteProps {
  value: User | null;
  onChange: (advisor: User | null) => void;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const AdvisorAutocomplete = ({
  value,
  onChange,
  required = false,
  label = "Asesor",
  error,
  helperText,
}: AdvisorAutocompleteProps) => {
  const { options, setOptions, isSearching, open, setOpen, handleInputChange } =
    useApiAutocomplete<User>({
      fetchFn: (query) => searchUsers(query, { page: 0, size: 20 }).then((r) => r.content),
      debounceMs: 400,
    });

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={options}
      getOptionLabel={(option) => option.name}
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
      noOptionsText={isSearching ? "Buscando..." : "No se encontraron asesores"}
      onChange={(_event, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue);
      }}
      onInputChange={(_event, newInputValue, reason) => handleInputChange(newInputValue, reason)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
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
        <li {...props} key={option.id}>
          <Box>
            <Typography variant="body2">{option.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {option.email}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
};
