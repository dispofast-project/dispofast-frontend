import { Box, Button, CircularProgress } from "@mui/material";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isLoading, onCancel }: FormActionsProps) => {
  return (
    <Box className="flex justify-end gap-3 pt-5 border-t border-gray-100">
      <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isLoading} size="small">
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ px: 4, fontWeight: "bold" }}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isLoading ? "Guardando..." : "Crear Cliente"}
      </Button>
    </Box>
  );
};
