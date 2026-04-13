import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import type { SxProps, Theme } from "@mui/material";

interface PercentageInputProps {
  value: string;
  onChange: (value: string) => void;
  size?: "small" | "medium";
  fullWidth?: boolean;
  decimalScale?: number;
  sx?: SxProps<Theme>;
}

const PercentageInput = ({
  value,
  onChange,
  size = "small",
  fullWidth = false,
  decimalScale = 0,
  sx,
}: PercentageInputProps) => (
  <NumericFormat
    customInput={TextField}
    size={size}
    fullWidth={fullWidth}
    value={value}
    onValueChange={(values) => onChange(values.value)}
    suffix=" %"
    decimalScale={decimalScale}
    allowNegative={false}
    isAllowed={({ floatValue }) => floatValue === undefined || (floatValue >= 0 && floatValue <= 100)}
    sx={sx}
  />
);

export default PercentageInput;
