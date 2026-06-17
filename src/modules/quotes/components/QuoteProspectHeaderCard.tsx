import { Box, Avatar, Typography, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { LegalEntityType } from "../types";
import type { ProspectDetails } from "../types";
import DetailItem from "./detailcard/DetailItem";
import SectionTitle from "./SectionTitle";

interface QuoteProspectHeaderCardProps {
  prospect: ProspectDetails;
  editMode?: boolean;
}

const QuoteProspectHeaderCard = ({ prospect, editMode = false }: QuoteProspectHeaderCardProps) => {
  const isEmpresa = prospect.legalEntityType === LegalEntityType.EMPRESA;

  // ── Create mode: compact header with avatar ─────────────────────────────
  if (!editMode) {
    const avatarContent = isEmpresa ? (
      <BusinessIcon sx={{ fontSize: "2rem" }} />
    ) : (
      (prospect.name ?? "?").substring(0, 2).toUpperCase()
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
              {prospect.name || "—"}
            </Typography>
            <Box className="flex items-center flex-wrap gap-2 mt-0.5">
              <Chip
                icon={
                  isEmpresa ? (
                    <BusinessIcon sx={{ fontSize: "0.9rem !important" }} />
                  ) : (
                    <PersonIcon sx={{ fontSize: "0.9rem !important" }} />
                  )
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
              {prospect.clientTypeName && (
                <Chip
                  label={prospect.clientTypeName}
                  size="small"
                  sx={{ fontSize: "0.7rem", height: 20, bgcolor: "grey.100", color: "grey.700" }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box className="flex flex-col sm:items-end gap-2">
          <Typography variant="body2" className="text-gray-500">
            Estado:{" "}
            <strong className="text-gray-800 font-semibold">Nueva Cotización</strong>
          </Typography>
          <Chip
            label="Prospecto"
            size="small"
            sx={{
              bgcolor: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #fed7aa",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </Box>
    );
  }

  // ── Edit mode: detail grid, same style as QuoteClientCard ───────────────
  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <SectionTitle icon={isEmpresa ? <BusinessIcon fontSize="small" /> : <BadgeIcon fontSize="small" />}>
        Información del Prospecto
      </SectionTitle>
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <DetailItem label="Nombre" value={prospect.name} />
        <DetailItem
          label="Tipo de Persona"
          value={isEmpresa ? "Empresa" : "Persona Natural"}
        />
        <DetailItem label="Tipo de Cliente" value={prospect.clientTypeName ?? "—"} />
        <DetailItem label="Teléfono" value={prospect.phone ?? "—"} />
        <DetailItem label="Correo Electrónico" value={prospect.email ?? "—"} />
      </Box>
    </Box>
  );
};

export default QuoteProspectHeaderCard;
