import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <IconButton
          onClick={onClick}
          size="small"
          className="border border-gray-200 rounded-lg"
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
    )
}