import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import type { User } from "../../../modules/iam/types";
import { searchUsers } from "../../../modules/iam/api/user.service";

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
  const [options, setOptions] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === "" && !open) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    setIsSearching(true);
    const debounce = inputValue === "" ? 0 : 400;
    const timeoutId = setTimeout(async () => {
      try {
        const result = await searchUsers(inputValue, { page: 0, size: 20 });
        if (active) {
          setOptions(result.content);
        }
      } catch (err) {
        if (active) {
          console.error("Error buscando asesores:", err);
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, debounce);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue, value, open]);

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
      onClose={() => setOpen(false)}
      noOptionsText={isSearching ? "Buscando..." : "No se encontraron asesores"}
      onChange={(_event, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue);
      }}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason === "input" || reason === "clear") {
          setInputValue(newInputValue);
        }
      }}
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
