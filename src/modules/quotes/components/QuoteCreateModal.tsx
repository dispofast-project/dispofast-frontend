import { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Box,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { X, FileText, Search } from "lucide-react";
import { searchClientsService } from "../api/quotes.api";
import type { ClientPreview } from "../types";

interface QuoteCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (accountId: string) => Promise<void>;
}

const QuoteCreateModal = ({ open, onClose, onSubmit }: QuoteCreateModalProps) => {
  const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<ClientPreview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search effect — fires on input change or when modal opens
  useEffect(() => {
    if (!open) return;

    let active = true;
    setIsSearching(true);
    const delay = inputValue === "" ? 0 : 400;
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchClientsService(inputValue);
        if (active) setOptions(results);
      } catch {
        // silently ignore search errors
      } finally {
        if (active) setIsSearching(false);
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue, open]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setSelectedClient(null);
      setInputValue("");
      setOptions([]);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      setError("Debes seleccionar un cliente de la lista.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(selectedClient.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la cotización.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          className: "rounded-2xl overflow-hidden shadow-xl",
          style: { borderRadius: "16px" },
        },
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: "var(--dispofast-primary)", opacity: 0.9 }}
          >
            <FileText size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nueva Cotización</h2>
            <p className="text-sm text-gray-500">Selecciona el cliente para comenzar</p>
          </div>
        </div>
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Content */}
        <div className="px-6 pb-2">
          <Autocomplete
            id="client-selector"
            options={options}
            getOptionLabel={(option) => option.name}
            filterOptions={(x) => x}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={selectedClient}
            noOptionsText={
              <span className="text-sm text-gray-500">
                {isSearching ? "Buscando..." : "No se encontraron clientes"}
              </span>
            }
            onChange={(_event: unknown, newValue: ClientPreview | null) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setSelectedClient(newValue);
              setError(null);
            }}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            disabled={isSubmitting}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Escribe para buscar..."
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {isSearching ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#f9fafb",
                    "&:hover fieldset": { borderColor: "var(--dispofast-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--dispofast-primary)" },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.id}
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-gray-800">{option.name}</span>
              </li>
            )}
            slotProps={{
              paper: {
                style: { borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedClient}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--dispofast-primary)" }}
          >
            {isSubmitting && <CircularProgress size={14} color="inherit" />}
            {isSubmitting ? "Cargando..." : "Continuar"}
          </button>
        </div>
      </Box>
    </Dialog>
  );
};

export default QuoteCreateModal;
