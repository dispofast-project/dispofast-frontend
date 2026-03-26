import { Box } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { AdvisorAutocomplete } from "../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import type { User } from "../../iam/types";
import SectionTitle from "./SectionTitle";

interface QuoteAdvisorCardProps {
  value: User | null;
  onChange: (user: User | null) => void;
}

const QuoteAdvisorCard = ({ value, onChange }: QuoteAdvisorCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
    <SectionTitle icon={<SupportAgentIcon fontSize="small" />}>Asesor</SectionTitle>
    <AdvisorAutocomplete value={value} onChange={onChange} />
  </Box>
);

export default QuoteAdvisorCard;
