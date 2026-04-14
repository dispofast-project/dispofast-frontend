import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export interface DropdownOption<V = string> {
  value: V;
  label: string;
}

interface DropdownProps<V = string> {
  label: string;
  options: DropdownOption<V>[];
  value: V | "";
  onChange: (value: V | "") => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  minWidth?: number;
}

const Dropdown = <V extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  size = "small",
  fullWidth = false,
  minWidth = 160,
}: DropdownProps<V>) => {
  const handleChange = (event: SelectChangeEvent<V | "">) => {
    onChange(event.target.value as V | "");
  };

  return (
    <FormControl size={size} fullWidth={fullWidth} sx={{ minWidth }} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select<V | ""> value={value} label={label} onChange={handleChange}>
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;