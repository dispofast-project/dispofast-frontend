import { Box, Avatar, Typography, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { LegalEntityType } from "../types";
import type { ClientDetails } from "../types";
import { RetefuenteType } from "../../clients/types";

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
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <Box className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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

      {/* Detalles adicionales del cliente */}
      <Box className="h-px bg-gray-100" />
      <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {client.defaultAdvisor && (
          <Box>
            <Typography variant="caption" className="text-gray-400 font-medium block">
              Asesor por defecto
            </Typography>
            <Typography variant="body2" className="text-gray-700 font-medium">
              {client.defaultAdvisor.fullName}
            </Typography>
          </Box>
        )}
        {client.priceList && (
          <Box>
            <Typography variant="caption" className="text-gray-400 font-medium block">
              Lista de precios
            </Typography>
            <Typography variant="body2" className="text-gray-700 font-medium">
              {client.priceList.name}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography variant="caption" className="text-gray-400 font-medium block">
            Retefuente
          </Typography>
          <Box className="flex items-center gap-1 mt-0.5">
            {client.retefuenteType && client.retefuenteType !== RetefuenteType.NO_APLICA ? (
              <>
                <VerifiedUserIcon sx={{ fontSize: "0.85rem", color: "warning.main" }} />
                <Typography variant="body2" className="text-orange-600 font-medium">
                  {client.retefuenteType === RetefuenteType.PERSONA_JURIDICA
                    ? "Persona jurídica (2,5%)"
                    : "Persona natural (3,5%)"}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" className="text-gray-500">
                No aplica
              </Typography>
            )}
          </Box>
        </Box>
        {client.defaultDiscountRate != null && client.defaultDiscountRate > 0 && (
          <Box>
            <Typography variant="caption" className="text-gray-400 font-medium block">
              Descuento por defecto
            </Typography>
            <Typography variant="body2" className="text-gray-700 font-medium">
              {Math.round(client.defaultDiscountRate * 100)}%
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuoteCreateHeaderCard;
