import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { Button } from "../../../../shared/components/Button/Button";
import { createCarrier, updateCarrier } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Carrier } from "../../types";

const carrierSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Debe ser una URL válida (http:// o https://)"
    ),
});

type CarrierFormData = z.infer<typeof carrierSchema>;

interface CarrierFormProps {
  editingCarrier: Carrier | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPTY: CarrierFormData = { name: "", website: "" };

export const CarrierForm = ({ editingCarrier, onSuccess, onCancel }: CarrierFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarrierFormData>({
    resolver: zodResolver(carrierSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    reset(
      editingCarrier
        ? { name: editingCarrier.name, website: editingCarrier.website ?? "" }
        : EMPTY
    );
  }, [editingCarrier, reset]);

  const onSubmit = async (data: CarrierFormData) => {
    try {
      const payload = { name: data.name, website: data.website || null };
      if (editingCarrier) {
        await updateCarrier(editingCarrier.id, payload);
        showNotification("Transportadora actualizada correctamente", "success");
      } else {
        await createCarrier(payload);
        showNotification("Transportadora registrada correctamente", "success");
      }
      onSuccess();
    } catch {
      showNotification("Error al guardar la transportadora", "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            bgcolor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
            {editingCarrier ? "Editar transportadora" : "Nueva transportadora"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingCarrier
              ? `Modificando: ${editingCarrier.name}`
              : "Completa los datos para registrar"}
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre *"
                placeholder="Servientrega, Coordinadora..."
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sitio web"
                placeholder="https://ejemplo.com"
                fullWidth
                size="small"
                error={!!errors.website}
                helperText={errors.website?.message ?? "Opcional"}
              />
            )}
          />
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button type="button" variant="tertiary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <CircularProgress size={14} color="inherit" sx={{ mr: 1 }} />}
          {editingCarrier ? "Guardar cambios" : "Registrar"}
        </Button>
      </Box>
    </Box>
  );
};
