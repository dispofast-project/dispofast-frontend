import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { ClientResponse } from "../../types";
import SectionCard from "./SectionCard";
import DetailField from "./DetailField";

interface ContactSectionProps {
  client: ClientResponse;
  showEmail?: boolean;
}

const ContactSection = ({ client, showEmail = true }: ContactSectionProps) => {
  const cityDisplay = client.city?.name
    ? `${client.city.name}${client.city.department?.name ? ` - ${client.city.department.name}` : ""}`
    : undefined;

  const zoneDisplay = client.zone
    ? client.zone.charAt(0).toUpperCase() + client.zone.slice(1)
    : undefined;

  return (
    <SectionCard
      title="Datos de Contacto"
      icon={<LocationOnIcon fontSize="small" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        {showEmail && (
          <DetailField
            label="Correo Electrónico"
            value={client.email}
          />
        )}
        <DetailField
          label="Teléfono"
          value={client.phone}
        />
        <DetailField
          label="Dirección"
          value={client.address}
        />
        <DetailField
          label="Ciudad"
          value={cityDisplay}
        />
        <DetailField
          label="Zona"
          value={zoneDisplay}
        />
      </div>
    </SectionCard>
  );
};

export default ContactSection;
