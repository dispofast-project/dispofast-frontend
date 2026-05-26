import { useState, useEffect } from "react";
import { Box, CircularProgress, Dialog } from "@mui/material";
import { X } from "lucide-react";

interface CreatePriceListModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const CreatePriceListModal = ({ open, onClose, onSubmit }: CreatePriceListModalProps) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setNameError("");
      setSubmitError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("El nombre es obligatorio");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(name.trim());
      onClose();
    } catch {
      setSubmitError("Error al crear la lista de precios. Intente de nuevo.");
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
        paper: { style: { borderRadius: "12px", overflow: "hidden" } },
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "var(--dispofast-primary)" }}
      >
        <h2 className="text-base font-semibold text-white">Crear lista de precios</h2>
        {!isSubmitting && (
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <Box component="form" onSubmit={handleSubmit}>
        <div className="px-6 pt-6 pb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Nombre de la lista
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            disabled={isSubmitting}
            placeholder="Ej: Lista de Precios DROGUERÍAS"
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
            style={{ borderColor: nameError ? "#ef4444" : "#d1d5db" }}
            autoFocus
          />
          {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
          {submitError && <p className="mt-3 text-xs text-red-500">{submitError}</p>}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--dispofast-primary)" }}
          >
            {isSubmitting && <CircularProgress size={14} color="inherit" />}
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </Box>
    </Dialog>
  );
};

export default CreatePriceListModal;
