import { Box, Typography, Button, Avatar, FormControlLabel, Switch, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import type { ClientPreview } from "../types";
import { BackButton } from "../../../shared/components/BackButton/BackButton";

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface ClientDetailsHeaderProps {
  client: ClientPreview;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
  isDirty: boolean;
  isUpdating: boolean;
  onUpdate: () => void;
}

const ClientDetailsHeader = ({
  client,
  isActive,
  onActiveChange,
  isDirty,
  isUpdating,
  onUpdate,
}: ClientDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <Box className="flex items-center gap-4">
         <BackButton onClick={() => navigate("/clientes")} />


        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "primary.main",
            fontSize: "1.25rem",
            fontWeight: "bold",
            boxShadow: 1,
          }}
        >
          {getInitials(client.name)}
        </Avatar>

        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 flex items-center gap-3 tracking-tight">
            {client.name}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1 flex items-center gap-2">
            NIT: <span className="font-medium text-gray-700">{client.identificationNumber}</span>
            &bull;
            Ciudad: <span className="font-medium text-gray-700 capitalize">{client.city?.name || "No registrada"}</span>
          </Typography>
        </Box>
      </Box>

      <Box className="flex gap-3 items-center w-full md:w-auto">
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => onActiveChange(e.target.checked)}
              color="success"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 600, color: isActive ? "success.main" : "text.secondary" }}>
              {isActive ? "Activo" : "Inactivo"}
            </Typography>
          }
          labelPlacement="start"
          sx={{ mx: 0, mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!isDirty || isUpdating}
          onClick={onUpdate}
          startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <SaveIcon fontSize="small" />}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          className="flex-1 md:flex-none"
        >
          Actualizar Cliente
        </Button>
      </Box>
    </Box>
  );
};

export default ClientDetailsHeader;
