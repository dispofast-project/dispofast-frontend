import { Box, Button, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import type { UserPreview } from "../../types";
import SectionCard from "./SectionCard";

interface AdvisorCardProps {
  advisor: UserPreview | null | undefined;
}

const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  return (
    <SectionCard
      title="Asesor Asignado"
      icon={<AccountBoxIcon fontSize="small" />}
    >
      {advisor ? (
        <Box>
          <Box className="flex items-center gap-3 mb-4">
            <Box className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              {advisor.fullName.charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-900 leading-tight"
              >
                {advisor.fullName}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Asesor Comercial
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            className="text-blue-600 border-blue-200"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Contactar asesor
          </Button>
        </Box>
      ) : (
        <Typography
          variant="body2"
          className="text-gray-500 italic text-center py-4"
        >
          Sin asesor asignado
        </Typography>
      )}
    </SectionCard>
  );
};

export default AdvisorCard;
