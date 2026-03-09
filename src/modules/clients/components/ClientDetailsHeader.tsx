import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { ClientPreview } from "../types";

// Helper para obtener las iniciales
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
}

const ClientDetailsHeader = ({ client }: ClientDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <Box className="flex items-center gap-4">
        <IconButton
          onClick={() => navigate("/clientes")}
          className="bg-white shadow-sm hover:bg-gray-50 border border-gray-200"
          size="small"
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        
        <Avatar 
          sx={{ 
            width: 56, 
            height: 56, 
            bgcolor: 'primary.main', 
            fontSize: '1.25rem',
            fontWeight: 'bold',
            boxShadow: 1
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
      <Box className="flex gap-3 w-full md:w-auto">
        <Button
          variant="outlined"
          color={client.isActive ? "success" : "error"}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: '8px' }}
          className="flex-1 md:flex-none"
        >
          {client.isActive ? "Activo" : "Inactivo"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon fontSize="small" />}
          color="primary"
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: '8px' }}
          className="flex-1 md:flex-none border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Editar
        </Button>
      </Box>
    </Box>
  );
};

export default ClientDetailsHeader;
