import { Box, Avatar, Typography, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { LegalEntityType } from "../types";
import type { ClientDetails } from "../types";

interface QuoteCreateHeaderCardProps {
  client: ClientDetails;
}

const QuoteCreateHeaderCard = ({ client }: QuoteCreateHeaderCardProps) => {
  const isEmpresa = client.legalEntityType === LegalEntityType.EMPRESA;

  const avatarContent = isEmpresa ? (
    <BusinessIcon sx={{ fontSize: "2rem" }} />
  ) : (
    (client.name ?? "?").substring(0, 2).toUpperCase()
  );

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <Box className="flex items-center gap-4">
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: isEmpresa ? "secondary.main" : "primary.main",
            fontSize: "1.75rem",
          }}
        >
          {avatarContent}
        </Avatar>
        <Box className="flex flex-col gap-1.5">
          <Typography variant="h6" className="font-bold text-gray-900 leading-tight">
            {client.name || "—"}
          </Typography>
          <Box className="flex items-center flex-wrap gap-2 mt-0.5">
            <Chip
              icon={
                isEmpresa
                  ? <BusinessIcon sx={{ fontSize: "0.9rem !important" }} />
                  : <PersonIcon sx={{ fontSize: "0.9rem !important" }} />
              }
              label={isEmpresa ? "Empresa" : "Persona Natural"}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                borderColor: isEmpresa ? "secondary.light" : "primary.light",
                color: isEmpresa ? "secondary.dark" : "primary.dark",
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
            <Chip
              label={client.identificationNumber}
              size="small"
              sx={{ fontSize: "0.7rem", height: 20, bgcolor: "grey.100", color: "grey.700" }}
            />
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col sm:items-end gap-2">
        <Typography variant="body2" className="text-gray-500">
          Estado:{" "}
          <strong className="text-gray-800 font-semibold">Nueva Cotización</strong>
        </Typography>
        <Chip
          label="Borrador"
          size="small"
          sx={{
            bgcolor: "#f3f4f6",
            color: "#6b7280",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </Box>
    </Box>
  );
};

export default QuoteCreateHeaderCard;
