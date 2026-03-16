import BadgeIcon from "@mui/icons-material/Badge";
import type { IndividualResponse, OrganizationResponse } from "../../types";
import SectionCard from "./SectionCard";
import DetailField from "./DetailField";

interface RepresentativeSectionProps {
  client: IndividualResponse | OrganizationResponse;
  showJobTitle?: boolean;
  title?: string;
}

const RepresentativeSection = ({
  client,
  showJobTitle = false,
  title = "Representante Legal",
}: RepresentativeSectionProps) => {
  if (!client.representativeFirstName) {
    return null;
  }

  const fullName = `${client.representativeFirstName} ${client.representativeLastName}`.trim();
  const jobTitle = showJobTitle ? (client as IndividualResponse).representativeJobTitle : undefined;

  return (
    <SectionCard
      title={title}
      icon={<BadgeIcon fontSize="small" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <DetailField
          label="Nombre Completo"
          value={fullName}
        />
        <DetailField
          label="Identificación"
          value={client.representativeIdentification}
        />
        <DetailField
          label="Correo Electrónico"
          value={client.representativeEmail}
        />
        <DetailField
          label="Teléfono"
          value={client.representativePhone}
        />
        {showJobTitle && jobTitle && (
          <DetailField
            label="Cargo"
            value={jobTitle}
            fullWidth
          />
        )}
      </div>
    </SectionCard>
  );
};

export default RepresentativeSection;
