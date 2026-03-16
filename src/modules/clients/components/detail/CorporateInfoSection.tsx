import BusinessIcon from "@mui/icons-material/Business";
import type { OrganizationResponse } from "../../types";
import SectionCard from "./SectionCard";
import DetailField from "./DetailField";

interface CorporateInfoSectionProps {
  client: OrganizationResponse;
}

const CorporateInfoSection = ({ client }: CorporateInfoSectionProps) => {
  return (
    <SectionCard
      title="Información Corporativa"
      icon={<BusinessIcon fontSize="small" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <DetailField
          label="Razón Social"
          value={client.legalName}
        />
        <DetailField
          label="NIT"
          value={client.identificationNumber}
        />
        <DetailField
          label="Correo Corporativo"
          value={client.email}
        />
        <DetailField
          label="Correo de Facturación"
          value={client.billingEmail}
          fallback="No registrado"
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

export default CorporateInfoSection;
