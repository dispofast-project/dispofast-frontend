import { Box, Avatar, Typography, Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "../../../shared/utils/date";
import { LegalEntityType } from "../../clients/types";
import type { PurchaseOrder } from "../types";

interface PurchaseOrderDetailsHeaderCardProps {
  order: PurchaseOrder;
}

const PurchaseOrderDetailsHeaderCard = ({ order }: PurchaseOrderDetailsHeaderCardProps) => {
  const supplier = order.supplier;
  const isEmpresa = supplier.legalEntityType === LegalEntityType.LEGAL;
  const displayName = supplier.name || "—";

  const avatarContent = isEmpresa ? (
    <BusinessIcon sx={{ fontSize: "2rem" }} />
  ) : (
    displayName.substring(0, 2).toUpperCase()
  );

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <Box className="flex items-center gap-4">
        <Avatar sx={{ width: 64, height: 64, bgcolor: isEmpresa ? "secondary.main" : "primary.main", fontSize: "1.75rem" }}>
          {avatarContent}
        </Avatar>
        <Box className="flex flex-col gap-1.5">
          <Typography variant="h6" className="font-bold text-gray-900 leading-tight">
            {displayName}
          </Typography>
          <Box className="flex items-center flex-wrap gap-2 mt-0.5">
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
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col sm:items-end gap-2">
        <Typography variant="body2" className="text-gray-500">
          Orden de compra:{" "}
          <strong className="text-gray-800 font-semibold">{order.number}</strong>
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Actualizado:{" "}
          <strong className="text-gray-800 font-semibold">{formatDate(order.updatedAt)}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default PurchaseOrderDetailsHeaderCard;
