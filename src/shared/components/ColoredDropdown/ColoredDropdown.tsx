import { Box, CircularProgress, MenuItem, Select } from "@mui/material";

export interface ColoredDropdownOption {
  value: string;
  label: string;
  color: string;
}

interface ColoredDropdownProps {
  options: ColoredDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isSaving?: boolean;
  minWidth?: number;
}

const ColoredDropdown = ({
  options,
  value,
  onChange,
  disabled = false,
  isSaving = false,
  minWidth = 140,
}: ColoredDropdownProps) => {
  const currentColor = options.find((o) => o.value === value)?.color ?? "#6b7280";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 10, height: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isSaving ? (
          <CircularProgress size={10} />
        ) : (
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: currentColor }} />
        )}
      </Box>
      <Select
        size="small"
        value={value}
        disabled={disabled || isSaving}
        onChange={(e) => onChange(e.target.value as string)}
        renderValue={(val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: opt?.color ?? "inherit" }}>
              {opt?.label ?? val}
            </span>
          );
        }}
        sx={{
          minWidth,
          height: 30,
          fontSize: "0.8rem",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.15)" },
        }}
      >
        {options.map(({ value: val, label, color }) => (
          <MenuItem key={val} value={val} sx={{ fontSize: "0.82rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
              <span style={{ color }}>{label}</span>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ColoredDropdown;
