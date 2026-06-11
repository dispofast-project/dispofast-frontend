import { useState } from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "../../../shared/utils/date";
import { changeQuoteStatusService } from "../api/quotes.api";
import ColoredDropdown from "../../../shared/components/ColoredDropdown/ColoredDropdown";
import type { Quote } from "../types";
import { LegalEntityType } from "../types";

const STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente", color: "#c2410c" },
  { value: "aprobada",  label: "Aprobada",  color: "#15803d" },
  { value: "rechazada", label: "Rechazada", color: "#b91c1c" },
  { value: "caducada",  label: "Caducada",  color: "#6b7280" },
];

interface QuoteHeaderCardProps {
  quote: Quote;
  onUpdated: (updated: Quote) => void;
}

const QuoteDetailsHeaderCard = ({ quote, onUpdated }: QuoteHeaderCardProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // account can be null at runtime for prospect quotes
  const account = quote.account as typeof quote.account | null;
  const isProspect = !account && !!quote.prospect;
  const isEmpresa = !isProspect && account?.legalEntityType === LegalEntityType.EMPRESA;

  const rawName = account
    ? (isEmpresa
        ? (account.legalName ?? account.name)
        : (`${account.firstName ?? ""} ${account.lastName ?? ""}`.trim() || account.name))
    : null;
  const displayName = isProspect ? (quote.prospect?.name ?? "Prospecto") : (rawName ?? "—");

  const avatarContent = isEmpresa ? (
    <BusinessIcon sx={{ fontSize: "2rem" }} />
  ) : (
    (displayName ?? "?").substring(0, 2).toUpperCase()
  );

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === quote.status || isSaving) return;
    setIsSaving(true);
    try {
      const updated = await changeQuoteStatusService(quote.id, newStatus);
      onUpdated(updated);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <Box className="flex items-center gap-4">
        <Avatar sx={{ width: 64, height: 64, bgcolor: isEmpresa ? "secondary.main" : "primary.main", fontSize: "1.75rem" }}>
          {avatarContent}
        </Avatar>
        <Box className="flex flex-col gap-1.5">
          <Typography variant="h6" className="font-bold text-gray-900 leading-tight">
            {displayName || "—"}
          </Typography>
          <Box className="flex items-center flex-wrap gap-2 mt-0.5">
            {isProspect ? (
              <Chip
                label="Prospecto"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  bgcolor: "#fff7ed",
                  color: "#c2410c",
                  border: "1px solid #fed7aa",
                  fontWeight: 600,
                }}
              />
            ) : (
              <Chip
                icon={isEmpresa ? <BusinessIcon sx={{ fontSize: "0.9rem !important" }} /> : <PersonIcon sx={{ fontSize: "0.9rem !important" }} />}
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
            )}
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col sm:items-end gap-2">
        <Typography variant="body2" className="text-gray-500">
          Cotización:{" "}
          <strong className="text-gray-800 font-semibold">{quote.number}</strong>
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Actualizado:{" "}
          <strong className="text-gray-800 font-semibold">{formatDate(quote.updatedAt)}</strong>
        </Typography>
        <ColoredDropdown
          options={STATUS_OPTIONS}
          value={quote.status}
          onChange={handleStatusChange}
          isSaving={isSaving}
        />
      </Box>
    </Box>
  );
};

export default QuoteDetailsHeaderCard;
