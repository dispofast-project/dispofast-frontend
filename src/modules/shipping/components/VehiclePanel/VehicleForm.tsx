import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  CircularProgress,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Car, Wrench } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { createVehicle, updateVehicle } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Vehicle, VehicleState, VehicleType } from "../../types";

const vehicleSchema = z.object({
  plate: z.string().min(1, "La placa es requerida").max(50, "Máximo 50 caracteres"),
  state: z.enum(["AVAILABLE", "IN_MAINTENANCE"] as const),
  type: z.enum(["FURGON", "MENSAJERIA"] as const),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  editingVehicle: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPTY: VehicleFormData = { plate: "", state: "AVAILABLE", type: "FURGON" };

const VEHICLE_STATES: { value: VehicleState; label: string; color: string }[] = [
  { value: "AVAILABLE", label: "Disponible", color: "#2e7d32" },
  { value: "IN_MAINTENANCE", label: "En mantenimiento", color: "#e65100" },
];

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "FURGON", label: "Furgón" },
  { value: "MENSAJERIA", label: "Mensajería" },
];

const toggleSx = {
  "& .MuiToggleButton-root": {
    textTransform: "none",
    fontSize: "0.8125rem",
    fontWeight: 500,
    flex: 1,
    py: 0.875,
  },
};

export const VehicleForm = ({ editingVehicle, onSuccess, onCancel }: VehicleFormProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    reset(
      editingVehicle
        ? { plate: editingVehicle.plate, state: editingVehicle.state, type: editingVehicle.type }
        : EMPTY
    );
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
            {editingVehicle ? "Editar vehículo" : "Nuevo vehículo"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingVehicle
              ? `Modificando: ${editingVehicle.plate}`
              : "Completa los datos para registrar"}
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Placa */}
          <Controller
            name="plate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Placa *"
                placeholder="ABC-123D"
                fullWidth
                size="small"
                error={!!errors.plate}
                helperText={errors.plate?.message}
                inputProps={{ style: { textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" } }}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />

          {/* Tipo */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem" }}
            >
              Tipo de vehículo
            </Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, v) => v && field.onChange(v)}
                  fullWidth
                  size="small"
                  sx={toggleSx}
                >
                  {VEHICLE_TYPES.map((opt) => (
                    <ToggleButton key={opt.value} value={opt.value}>
                      <Car size={14} style={{ marginRight: 6 }} />
                      {opt.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            />
          </Box>

          {/* Estado */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem" }}
            >
              Estado
            </Typography>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, v) => v && field.onChange(v)}
                  fullWidth
                  size="small"
                  sx={toggleSx}
                >
                  {VEHICLE_STATES.map((opt) => (
                    <ToggleButton
                      key={opt.value}
                      value={opt.value}
                      sx={{
                        "&.Mui-selected": {
                          color: opt.color,
                          borderColor: opt.color,
                          bgcolor: `${opt.color}14`,
                          "&:hover": { bgcolor: `${opt.color}1e` },
                        },
                      }}
                    >
                      {opt.value === "IN_MAINTENANCE" && (
                        <Wrench size={14} style={{ marginRight: 6 }} />
                      )}
                      {opt.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
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
          {editingVehicle ? "Guardar cambios" : "Registrar"}
        </Button>
      </Box>
    </Box>
  );
};
