import { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getAllVehicles } from "../../api/shipping.service";
import type { Vehicle } from "../../types";
import { VEHICLE_TYPE_LABELS } from "../../constants/shippingConstants";

interface VehicleAutocompleteProps {
  value: Vehicle | null;
  onChange: (vehicle: Vehicle | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const VehicleAutocomplete = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
}: VehicleAutocompleteProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getAllVehicles({ size: 100 })
      .then((r) => {
        if (active) setVehicles(r.content);
      })
      .catch(() => {
        if (active) setVehicles([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.state === "AVAILABLE" || vehicle.id === value?.id
  );

  return (
    <FormControl fullWidth size="small" disabled={disabled} error={error} required={required}>
      <InputLabel>Vehículo</InputLabel>
      <Select
        value={value?.id ?? ""}
        label="Vehículo"
        onChange={(e) => {
          const selected = availableVehicles.find((v) => v.id === e.target.value) ?? null;
          onChange(selected);
        }}
        endAdornment={isLoading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null}
      >
        {availableVehicles.map((vehicle) => (
          <MenuItem key={vehicle.id} value={vehicle.id}>
            {vehicle.plate} — {VEHICLE_TYPE_LABELS[vehicle.type]}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
