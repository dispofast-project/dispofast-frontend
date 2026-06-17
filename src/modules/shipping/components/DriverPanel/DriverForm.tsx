import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
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
}

export const DriverForm = ({ editingDriver, onSuccess }: DriverFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const EMPTY_DRIVER: DriverFormData = { name: "", phone: "", cedula: "" };

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
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Nombre completo *
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Nombre del conductor"
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
            Cédula
          </Typography>
          <Controller
            name="cedula"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Número de cédula"
                fullWidth
                size="small"
                error={!!errors.cedula}
                helperText={errors.cedula?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Teléfono
          </Typography>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Número de teléfono"
                fullWidth
                size="small"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
            {editingDriver ? "Guardar cambios" : "Registrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
