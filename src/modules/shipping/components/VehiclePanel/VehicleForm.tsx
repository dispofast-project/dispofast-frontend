import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "../../../../shared/components/Button/Button";
import { createVehicle, updateVehicle } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Vehicle, VehicleState, VehicleType } from "../../types";
import { VEHICLE_STATE_LABELS, VEHICLE_TYPE_LABELS } from "../../constants/shippingConstants";

const vehicleSchema = z.object({
  plate: z.string().min(1, "La placa es requerida").max(50, "Máximo 50 caracteres"),
  state: z.enum(["AVAILABLE", "IN_MAINTENANCE"] as const, "El estado es requerido"),
  type: z.enum(["FURGON", "MENSAJERIA"] as const, "El tipo es requerido"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  editingVehicle: Vehicle | null;
  onSuccess: () => void;
}

export const VehicleForm = ({ editingVehicle, onSuccess }: VehicleFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { plate: "", state: "AVAILABLE", type: "FURGON" },
  });

  useEffect(() => {
    if (editingVehicle) {
      reset({
        plate: editingVehicle.plate,
        state: editingVehicle.state,
        type: editingVehicle.type,
      });
    } else {
      reset({ plate: "", state: "AVAILABLE", type: "FURGON" });
    }
  }, [editingVehicle, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, data);
        showNotification("Vehículo actualizado correctamente", "success");
      } else {
        await createVehicle(data);
        showNotification("Vehículo registrado correctamente", "success");
      }
      onSuccess();
    } catch {
      showNotification("Error al guardar el vehículo", "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Placa *
          </Typography>
          <Controller
            name="plate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Nombre del propietario / placa"
                fullWidth
                size="small"
                error={!!errors.plate}
                helperText={errors.plate?.message}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Estado *
          </Typography>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                size="small"
                error={!!errors.state}
                helperText={errors.state?.message}
              >
                {(Object.keys(VEHICLE_STATE_LABELS) as VehicleState[]).map((key) => (
                  <MenuItem key={key} value={key}>
                    {VEHICLE_STATE_LABELS[key]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Tipo de Vehículo *
          </Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                size="small"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {(Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((key) => (
                  <MenuItem key={key} value={key}>
                    {VEHICLE_TYPE_LABELS[key]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            {editingVehicle ? "Guardar cambios" : "Registrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
