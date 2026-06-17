import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, TextField, CircularProgress, Typography } from "@mui/material";
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
}

export const CarrierForm = ({ editingCarrier, onSuccess }: CarrierFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarrierFormData>({
    resolver: zodResolver(carrierSchema),
    defaultValues: { name: "", website: "" },
  });

  useEffect(() => {
    if (editingCarrier) {
      reset({
        name: editingCarrier.name,
        website: editingCarrier.website ?? "",
      });
    } else {
      reset({ name: "", website: "" });
    }
  }, [editingCarrier, reset]);

  const onSubmit = async (data: CarrierFormData) => {
    try {
      const payload = {
        name: data.name,
        website: data.website || null,
      };
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Nombre *
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Nombre de la transportadora"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Sitio Web
          </Typography>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="https://ejemplo.com"
                fullWidth
                size="small"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            {editingCarrier ? "Guardar cambios" : "Registrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
