import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { searchAccountsService } from "../api/quotes.api";
import type { Account } from "../types";

interface QuoteCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (accountId: string) => Promise<void>;
}

const QuoteCreateModal = ({ open, onClose, onSubmit }: QuoteCreateModalProps) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Account[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-search effect
  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(selectedAccount ? [selectedAccount] : []);
      return undefined;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchAccountsService(inputValue);
        if (active) {
          setOptions(results);
        }
      } catch (err) {
        if (active) {
          console.error("Error buscando clientes:", err);
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue, selectedAccount]);

  // Reset state on open/close
  useEffect(() => {
    if (open) {
      setSelectedAccount(null);
      setInputValue("");
      setOptions([]);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) {
      setError("Debes seleccionar un cliente de la lista.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(selectedAccount.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la cotización.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Cotización</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ minHeight: "200px" }}>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Busca y selecciona el cliente para la nueva cotización.
          </Typography>
          
          <Autocomplete
            id="account-selector"
            options={options}
            getOptionLabel={(option) => {
              const displayName = option.legalName
                ?? (`${option.firstName ?? ""} ${option.lastName ?? ""}`.trim() || option.name);
              return `${option.identificationNumber ?? ""} - ${displayName ?? ""}`.replace(/^ - /, "");
            }}
            filterOptions={(x) => x}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={selectedAccount}
            noOptionsText={isSearching ? "Buscando..." : "No se encontraron clientes"}
            onChange={(_event: unknown, newValue: Account | null) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setSelectedAccount(newValue);
            }}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            disabled={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error}
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
            renderOption={(props, option) => {
              const displayName = option.organization?.legalName || `${option.firstName || ""} ${option.lastName || ""}`.trim();
              return (
                <li {...props} key={option.id}>
                  <Box>
                    <Typography variant="body1">{displayName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.identificationNumber ? `ID: ${option.identificationNumber}` : "Sin ID"}
                      {option.email ? ` | ${option.email}` : ""}
                    </Typography>
                  </Box>
                </li>
              );
            }}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !selectedAccount}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Creando..." : "Crear Cotización"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default QuoteCreateModal;
