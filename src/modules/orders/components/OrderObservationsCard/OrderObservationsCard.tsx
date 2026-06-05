import { useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { MessageSquare, Pencil, Check, X } from "lucide-react";

interface OrderObservationsCardProps {
  observations: string | null | undefined;
  onSave: (value: string) => Promise<void>;
}

const OrderObservationsCard = ({ observations, onSave }: OrderObservationsCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setDraft(observations ?? "");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-3">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Box className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
          </Box>
          <h3 className="text-sm font-semibold text-gray-800">Observaciones</h3>
        </Box>

        {!editing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Editar
          </button>
        )}
      </Box>

      {editing ? (
        <Box className="flex flex-col gap-3">
          <TextField
            size="small"
            fullWidth
            multiline
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ingresa observaciones o notas adicionales para esta orden..."
            autoFocus
          />
          <Box className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-dispofast-primary text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <CircularProgress size={12} sx={{ color: "white" }} /> : <Check className="w-3.5 h-3.5" />}
              Guardar
            </button>
          </Box>
        </Box>
      ) : (
        <p className={`text-sm whitespace-pre-wrap ${observations ? "text-gray-700" : "text-gray-400 italic"}`}>
          {observations || "Sin observaciones"}
        </p>
      )}
    </Box>
  );
};

export default OrderObservationsCard;
