import { Box, Typography } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { AdvisorAutocomplete } from "../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import type { User } from "../../iam/types";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";

interface PurchaseOrderBuyerCardProps {
  value: User | null;
  onChange: (user: User | null) => void;
  readOnly?: boolean;
}

const PurchaseOrderBuyerCard = ({ value, onChange, readOnly = false }: PurchaseOrderBuyerCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
    <SectionTitle icon={<SupportAgentIcon fontSize="small" />}>Comprador</SectionTitle>
    {readOnly ? (
      <Typography variant="body2" color="text.secondary">
        {value?.name ?? "Sin comprador asignado"}
      </Typography>
    ) : (
      <AdvisorAutocomplete value={value} onChange={onChange} label="Comprador" />
    )}
  </Box>
);

export default PurchaseOrderBuyerCard;
