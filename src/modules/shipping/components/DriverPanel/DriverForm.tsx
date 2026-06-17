import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { Button } from "../../../../shared/components/Button/Button";
import { createDriver, updateDriver } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Driver } from "../../types";

const driverSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(150, "Máximo 150 caracteres"),
  phone: z.string().max(30, "Máximo 30 caracteres").optional(),
  cedula: z.string().max(30, "Máximo 30 caracteres").optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverFormProps {
  editingDriver: Driver | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPTY_DRIVER: DriverFormData = { name: "", phone: "", cedula: "" };

export const DriverForm = ({ editingDriver, onSuccess, onCancel }: DriverFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: EMPTY_DRIVER,
  });

  useEffect(() => {
    if (editingDriver) {
      reset({
        name: editingDriver.name,
        phone: editingDriver.phone ?? "",
        cedula: editingDriver.cedula ?? "",
      });
    } else {
      reset(EMPTY_DRIVER);
    }
  }, [editingDriver, reset]);

  const onSubmit = async (data: DriverFormData) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone || null,
        cedula: data.cedula || null,
      };
      if (editingDriver) {
        await updateDriver(editingDriver.id, payload);
        showNotification("Conductor actualizado correctamente", "success");
      } else {
        await createDriver(payload);
        showNotification("Conductor registrado correctamente", "success");
      }
      onSuccess();
    } catch {
      showNotification("Error al guardar el conductor", "error");
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
            {editingDriver ? "Editar conductor" : "Nuevo conductor"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingDriver
              ? `Modificando: ${editingDriver.name}`
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
                label="Nombre completo *"
                placeholder="Juan Pérez García"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Controller
              name="cedula"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cédula"
                  placeholder="12345678"
                  fullWidth
                  size="small"
                  error={!!errors.cedula}
                  helperText={errors.cedula?.message ?? "Opcional"}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  placeholder="300 123 4567"
                  fullWidth
                  size="small"
                  error={!!errors.phone}
                  helperText={errors.phone?.message ?? "Opcional"}
                />
              )}
            />
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button type="button" variant="tertiary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <CircularProgress size={14} color="inherit" sx={{ mr: 1 }} />}
          {editingDriver ? "Guardar cambios" : "Registrar"}
        </Button>
      </Box>
    </Box>
  );
};
