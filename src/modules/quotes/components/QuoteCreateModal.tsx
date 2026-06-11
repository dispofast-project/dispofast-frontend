import { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Box,
  CircularProgress,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { X, FileText, Search, Users, UserPlus } from "lucide-react";
import { searchClientsService } from "../api/quotes.api";
import { ClientTypeSelector } from "../../../shared/components/ClientTypeSelector/ClientTypeSelector";
import type { ClientPreview, ProspectDetails } from "../types";
import { LegalEntityType as LET } from "../types";
import type { LegalEntityType } from "../types";

interface QuoteCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (accountId: string) => Promise<void>;
  onSubmitProspect?: (prospectData: ProspectDetails) => void;
}

type ModalMode = "client" | "prospect";

const QuoteCreateModal = ({ open, onClose, onSubmit, onSubmitProspect }: QuoteCreateModalProps) => {
  const [modalMode, setModalMode] = useState<ModalMode>("client");

  // ── Client mode state ──
  const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<ClientPreview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // ── Prospect mode state ──
  const [prospectName, setProspectName] = useState("");
  const [prospectLegalEntity, setProspectLegalEntity] = useState<LegalEntityType>(LET.NATURAL);
  const [prospectClientTypeId, setProspectClientTypeId] = useState("");
  const [prospectPhone, setProspectPhone] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [prospectError, setProspectError] = useState<string | null>(null);

  // Search effect — client mode only
  useEffect(() => {
    if (!open || modalMode !== "client") return;

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
  }, [inputValue, open, modalMode]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setModalMode("client");
      setSelectedClient(null);
      setInputValue("");
      setOptions([]);
      setClientError(null);
      setProspectName("");
      setProspectLegalEntity(LET.NATURAL);
      setProspectClientTypeId("");
      setProspectPhone("");
      setProspectEmail("");
      setProspectError(null);
    }
  }, [open]);

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      setClientError("Debes seleccionar un cliente de la lista.");
      return;
    }
    setIsSubmitting(true);
    setClientError(null);
    try {
      await onSubmit(selectedClient.id);
      onClose();
    } catch (err: unknown) {
      setClientError(err instanceof Error ? err.message : "Error al crear la cotización.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName.trim()) {
      setProspectError("El nombre es requerido.");
      return;
    }
    onSubmitProspect?.({
      name: prospectName.trim(),
      legalEntityType: prospectLegalEntity,
      clientTypeId: prospectClientTypeId ? Number(prospectClientTypeId) : undefined,
      phone: prospectPhone.trim() || undefined,
      email: prospectEmail.trim() || undefined,
    });
    onClose();
  };

  const isClientMode = modalMode === "client";

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
            <p className="text-sm text-gray-500">Selecciona cliente o crea un prospecto</p>
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

      {/* Toggle */}
      <div className="flex gap-2 px-6 pb-4">
        <button
          type="button"
          onClick={() => setModalMode("client")}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg border transition-colors ${
            isClientMode
              ? "text-white border-transparent"
              : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50"
          }`}
          style={isClientMode ? { backgroundColor: "var(--dispofast-primary)" } : undefined}
        >
          <Users size={15} />
          Cliente existente
        </button>
        <button
          type="button"
          onClick={() => setModalMode("prospect")}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg border transition-colors ${
            !isClientMode
              ? "text-white border-transparent"
              : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50"
          }`}
          style={!isClientMode ? { backgroundColor: "var(--dispofast-primary)" } : undefined}
        >
          <UserPlus size={15} />
          Nuevo prospecto
        </button>
      </div>

      {/* ── Client mode ── */}
      {isClientMode && (
        <Box component="form" onSubmit={handleClientSubmit}>
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
                setClientError(null);
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
                  error={!!clientError}
                  helperText={clientError}
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
              {isSubmitting ? "Cargando..." : "Crear Cotización"}
            </button>
          </div>
        </Box>
      )}

      {/* ── Prospect mode ── */}
      {!isClientMode && (
        <Box component="form" onSubmit={handleProspectSubmit}>
          <div className="px-6 pb-2 flex flex-col gap-3">
            <TextField
              label="Nombre completo / Razón social"
              value={prospectName}
              onChange={(e) => {
                setProspectName(e.target.value);
                setProspectError(null);
              }}
              size="small"
              fullWidth
              required
              error={!!prospectError}
              helperText={prospectError}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#f9fafb" },
              }}
            />

            <TextField
              select
              label="Tipo de persona"
              value={prospectLegalEntity}
              onChange={(e) => setProspectLegalEntity(e.target.value as LegalEntityType)}
              size="small"
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#f9fafb" },
              }}
            >
              <MenuItem value={LET.NATURAL}>Persona Natural</MenuItem>
              <MenuItem value={LET.EMPRESA}>Empresa</MenuItem>
            </TextField>

            <ClientTypeSelector
              value={prospectClientTypeId}
              onChange={(e) => setProspectClientTypeId(e.target.value)}
            />

            <TextField
              label="Teléfono"
              value={prospectPhone}
              onChange={(e) => setProspectPhone(e.target.value)}
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#f9fafb" },
              }}
            />

            <TextField
              label="Correo electrónico"
              type="email"
              value={prospectEmail}
              onChange={(e) => setProspectEmail(e.target.value)}
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#f9fafb" },
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!prospectName.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--dispofast-primary)" }}
            >
              Continuar
            </button>
          </div>
        </Box>
      )}
    </Dialog>
  );
};

export default QuoteCreateModal;
