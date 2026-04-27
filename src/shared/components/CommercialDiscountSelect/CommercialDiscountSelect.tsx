import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const COMMERCIAL_DISCOUNT_OPTIONS = [
  { value: "0", label: "No Aplica" },
  { value: "1", label: "1%" },
  { value: "2", label: "2%" },
  { value: "3", label: "3%" },
  { value: "4", label: "4%" },
] as const;

const VALID_VALUES = COMMERCIAL_DISCOUNT_OPTIONS.map((o) => o.value);

interface CommercialDiscountSelectProps {
  /** String integer representing the percentage: "0" | "1" | "2" | "3" | "4" */
  value: string;
  onChange: (value: string) => void;
  /** When provided, renders a floating MUI InputLabel inside a FormControl */
  label?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

const CommercialDiscountSelect = ({
  value,
  onChange,
  label,
  size = "small",
  fullWidth = true,
}: CommercialDiscountSelectProps) => (
  <FormControl size={size} fullWidth={fullWidth}>
    {label && <InputLabel>{label}</InputLabel>}
    <Select
      label={label}
      value={VALID_VALUES.includes(value as (typeof VALID_VALUES)[number]) ? value : "0"}
      onChange={(e) => onChange(e.target.value)}
    >
      {COMMERCIAL_DISCOUNT_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default CommercialDiscountSelect;
