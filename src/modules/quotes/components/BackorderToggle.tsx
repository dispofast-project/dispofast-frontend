import { Box, Typography, Switch } from "@mui/material";
import { PackageX } from "lucide-react";

interface BackorderToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const BackorderToggle = ({ checked, onChange, disabled }: BackorderToggleProps) => (
  <Box
    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
      checked ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"
    }`}
  >
    <Box className="flex items-center gap-2">
      <PackageX className={`w-4 h-4 ${checked ? "text-purple-700" : "text-gray-400"}`} />
      <Box>
        <Typography
          variant="body2"
          className={`font-semibold ${checked ? "text-purple-800" : "text-gray-600"}`}
        >
          Backorder
        </Typography>
        <Typography variant="caption" className={checked ? "text-purple-600" : "text-gray-400"}>
          Sin stock disponible actualmente
        </Typography>
      </Box>
    </Box>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
  </Box>
);
