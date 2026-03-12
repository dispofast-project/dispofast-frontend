import { Box, Typography, Radio } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { LegalEntityType } from "../../types";

interface EntityTypeSelectorProps {
  selected: LegalEntityType | null;
  onSelect: (type: LegalEntityType) => void;
}

export const EntityTypeSelector = ({ selected, onSelect }: EntityTypeSelectorProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" className="font-bold text-gray-800 mb-1">
        Tipo de Persona
      </Typography>
      <Typography variant="body2" color="text.secondary" className="!mb-4">
        Selecciona el tipo de cliente a registrar
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Box
          onClick={() => onSelect(LegalEntityType.NATURAL)}
          className={`border rounded-xl p-4 cursor-pointer flex items-center transition-all ${
            selected === LegalEntityType.NATURAL
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <Box
            className={`p-2 rounded-full mr-3 ${
              selected === LegalEntityType.NATURAL
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <PersonIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box className="flex-1">
            <Typography variant="subtitle2" className="font-bold text-gray-800">
              Persona Natural
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Individuo o persona física
            </Typography>
          </Box>
          <Radio checked={selected === LegalEntityType.NATURAL} size="small" />
        </Box>

        <Box
          onClick={() => onSelect(LegalEntityType.LEGAL)}
          className={`border rounded-xl p-4 cursor-pointer flex items-center transition-all ${
            selected === LegalEntityType.LEGAL
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <Box
            className={`p-2 rounded-full mr-3 ${
              selected === LegalEntityType.LEGAL
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <BusinessIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box className="flex-1">
            <Typography variant="subtitle2" className="font-bold text-gray-800">
              Persona Jurídica
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Empresa o entidad comercial
            </Typography>
          </Box>
          <Radio checked={selected === LegalEntityType.LEGAL} size="small" />
        </Box>
      </div>
    </Box>
  );
};
