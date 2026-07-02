import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { ShipmentState } from "../../types";
import { VALID_STATE_TRANSITIONS } from "../../config/shipmentStatusConfig";
import { SHIPMENT_STATES_OPTIONS } from "../../constants/shippingConstants";

interface ShipmentStateSelectorProps {
  currentState: ShipmentState;
  value: ShipmentState;
  onChange: (state: ShipmentState) => void;
  disabled?: boolean;
}

export const ShipmentStateSelector = ({
  currentState,
  value,
  onChange,
  disabled = false,
}: ShipmentStateSelectorProps) => {
  const validNextStates = VALID_STATE_TRANSITIONS[currentState] || [];

  const options = SHIPMENT_STATES_OPTIONS.filter(
    (opt) =>
      opt.value === currentState ||
      validNextStates.includes(opt.value)
  );

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel>Estado</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as ShipmentState)}
        label="Estado"
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
