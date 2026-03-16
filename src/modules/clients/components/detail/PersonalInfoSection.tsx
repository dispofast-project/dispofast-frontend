import PersonIcon from "@mui/icons-material/Person";
import type { IndividualResponse } from "../../types";
import SectionCard from "./SectionCard";
import DetailField from "./DetailField";

interface PersonalInfoSectionProps {
  client: IndividualResponse;
}

const PersonalInfoSection = ({ client }: PersonalInfoSectionProps) => {
  return (
    <SectionCard
      title="Datos Personales"
      icon={<PersonIcon fontSize="small" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <DetailField
          label="Nombre Completo"
          value={`${client.firstName} ${client.lastName}`}
        />
        <DetailField
          label="Identificación (Cédula)"
          value={client.identificationNumber}
        />
        <DetailField
          label="Aplica Retefuente"
          value={client.retefuenteApplies ? "Sí" : "No"}
          fullWidth
        />
      </div>
    </SectionCard>
  );
};

export default PersonalInfoSection;
