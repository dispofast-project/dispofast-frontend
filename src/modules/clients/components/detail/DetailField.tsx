import { Box, Typography } from "@mui/material";

interface DetailFieldProps {
  label: string;
  value?: string | null;
  fallback?: string;
  fullWidth?: boolean;
}

const DetailField = ({ label, value, fallback = "—", fullWidth = false }: DetailFieldProps) => {
  const displayValue = value !== undefined && value !== null && value !== "" ? value : fallback;

  return (
    <Box className={fullWidth ? "col-span-2 mb-4" : "mb-4"}>
      <Typography
        variant="caption"
        className="text-gray-500 uppercase tracking-wider font-semibold block mb-1"
      >
        {label}
      </Typography>
      <Typography variant="body1" className="text-gray-900 font-medium">
        {displayValue}
      </Typography>
    </Box>
  );
};

export default DetailField;
