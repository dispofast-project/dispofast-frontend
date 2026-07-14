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
import { Button } from "../../../../shared/components/Button/Button";
import { Package, Truck, User } from "lucide-react";
import type { City } from "../../../../shared/types/location";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import { CarrierAutocomplete } from "../CarrierAutocomplete/CarrierAutocomplete";
import { DriverAutocomplete } from "../DriverAutocomplete/DriverAutocomplete";
import { VehicleAutocomplete } from "../VehicleAutocomplete/VehicleAutocomplete";
import { updateShipment } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Carrier, DeliveryType, Driver, Shipment, Vehicle } from "../../types";

const assignmentSchema = z
  .object({
    deliveryType: z.enum(["CONDUCTOR", "TRANSPORTADORA", "RETIRO"] as const),
    driver: z.custom<Driver>().nullable(),
    vehicle: z.custom<Vehicle>().nullable(),
    carrier: z.custom<Carrier>().nullable(),
    trackingCode: z.string().optional(),
    estimatedDeliveryDate: z.string().optional(),
    city: z.custom<City>().nullable(),
    deliveryAddress: z.string().min(1, "La dirección es requerida"),
    addressDetail: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "CONDUCTOR" && !data.driver) {
      ctx.addIssue({ code: "custom", path: ["driver"], message: "Selecciona un conductor" });
    }
    if (data.deliveryType === "TRANSPORTADORA" && !data.carrier) {
      ctx.addIssue({ code: "custom", path: ["carrier"], message: "Selecciona una transportadora" });
    }
    if (!data.city) {
      ctx.addIssue({ code: "custom", path: ["city"], message: "Selecciona una ciudad" });
    }
  });

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Props {
  shipment: Shipment;
  onSaved: () => void;
}

const DELIVERY_TYPES: { value: DeliveryType; label: string; icon: React.ReactNode }[] = [
  { value: "CONDUCTOR", label: "Conductor", icon: <User size={15} /> },
  { value: "TRANSPORTADORA", label: "Transportadora", icon: <Truck size={15} /> },
  { value: "RETIRO", label: "Retiro", icon: <Package size={15} /> },
];

const sectionTitleSx = {
  display: "block",
  fontSize: "0.625rem",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase" as const,
  color: "text.disabled",
};

const getDefaultValues = (s: Shipment): AssignmentFormData => ({
  deliveryType: s.deliveryType ?? "CONDUCTOR",
  driver: s.driver ?? null,
  vehicle: s.vehicle ?? null,
  carrier: s.carrier ?? null,
  trackingCode: s.trackingCode ?? "",
  estimatedDeliveryDate: s.estimatedDeliveryDate ?? "",
  city: s.city ?? null,
  deliveryAddress: s.deliveryAddress ?? "",
  addressDetail: s.addressDetail ?? "",
});

export const ShipmentAssignmentTab = ({ shipment, onSaved }: Props) => {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: getDefaultValues(shipment),
  });

  useEffect(() => {
    reset(getDefaultValues(shipment));
  }, [shipment, reset]);

  const deliveryType = watch("deliveryType");
  const selectedCity = watch("city");

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      await updateShipment(shipment.id, {
        deliveryType: data.deliveryType,
        driverId: data.deliveryType === "CONDUCTOR" ? (data.driver?.id ?? null) : null,
        vehicleId: data.deliveryType === "CONDUCTOR" ? (data.vehicle?.id ?? null) : null,
        carrierId: data.deliveryType === "TRANSPORTADORA" ? (data.carrier?.id ?? null) : null,
        trackingCode: data.deliveryType === "TRANSPORTADORA" ? (data.trackingCode || null) : null,
        estimatedDeliveryDate:
          data.deliveryType !== "RETIRO" ? (data.estimatedDeliveryDate || null) : null,
        cityCode: data.city?.code,
        deliveryAddress: data.deliveryAddress,
        addressDetail: data.addressDetail || null,
      });
      showNotification("Despacho actualizado correctamente", "success");
      onSaved();
    } catch {
      showNotification("Error al guardar la asignación", "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* Forma de entrega */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.25,
            bgcolor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={sectionTitleSx}>Forma de entrega</Typography>
        </Box>
        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Controller
            name="deliveryType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value}
                exclusive
                onChange={(_, v) => v && field.onChange(v)}
                fullWidth
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    gap: 0.75,
                    py: 1,
                  },
                }}
              >
                {DELIVERY_TYPES.map((opt) => (
                  <ToggleButton key={opt.value} value={opt.value}>
                    {opt.icon}
                    {opt.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />

          {deliveryType === "CONDUCTOR" && (
            <Box
              sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}
            >
              <Box>
                <Controller
                  name="driver"
                  control={control}
                  render={({ field }) => (
                    <DriverAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.driver}
                      helperText={errors.driver?.message}
                      required
                    />
                  )}
                />
              </Box>
              <Box>
                <Controller
                  name="vehicle"
                  control={control}
                  render={({ field }) => (
                    <VehicleAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.vehicle}
                      helperText={errors.vehicle?.message}
                      required
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {deliveryType === "TRANSPORTADORA" && (
            <Box
              sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}
            >
              <Box>
                <Controller
                  name="carrier"
                  control={control}
                  render={({ field }) => (
                    <CarrierAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.carrier}
                      helperText={errors.carrier?.message}
                      required
                    />
                  )}
                />
              </Box>
              <Box>
                <Controller
                  name="trackingCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Código de seguimiento"
                      fullWidth
                      size="small"
                      placeholder="Ej. TRK-123456"
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {deliveryType !== "RETIRO" && (
            <Controller
              name="estimatedDeliveryDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha estimada de entrega"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { sm: 300 } }}
                />
              )}
            />
          )}
        </Box>
      </Paper>

      {/* Destino */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.25,
            bgcolor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={sectionTitleSx}>Destino de entrega</Typography>
        </Box>
        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}
          >
            <TextField
              label="Departamento"
              value={selectedCity?.department?.name ?? ""}
              size="small"
              disabled
              fullWidth
              placeholder="Se llena al seleccionar ciudad"
            />
            <Box>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CityAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    required
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Box>
          </Box>

          <Controller
            name="deliveryAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dirección *"
                fullWidth
                size="small"
                placeholder="Calle 123 # 45-67"
                error={!!errors.deliveryAddress}
                helperText={errors.deliveryAddress?.message}
              />
            )}
          />

          <Controller
            name="addressDetail"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Detalle de dirección"
                fullWidth
                size="small"
                placeholder="Apto 301, Torre B, Bodega..."
              />
            )}
          />
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
          Guardar asignación
        </Button>
      </Box>
    </Box>
  );
};
