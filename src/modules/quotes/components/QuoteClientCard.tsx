import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DataField from "./detailcard/DetailItem";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";
import { LegalEntityType } from "../types";
import type { Quote } from "../types";
import { RetefuenteType } from "../../clients/types";

const retefuenteLabel = (type: RetefuenteType | undefined): string => {
  if (type === RetefuenteType.PERSONA_JURIDICA) return "Persona jurídica (2,5%)";
  if (type === RetefuenteType.PERSONA_NATURAL) return "Persona natural (3,5%)";
  return "No aplica";
};

type Account = Quote["account"];
type Location = Quote["location"];

// ── Ubicación ────────────────────────────────────────────────────
const LocationSection = ({ location }: { location: Location }) => (
  <Box>
    <SectionTitle icon={<LocationOnIcon fontSize="small" />}>Ubicación</SectionTitle>
    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      <DataField label="Ciudad" value={location?.name} />
      <DataField label="Departamento" value={location?.department?.name} />
    </Box>
  </Box>
);

// ── Empresa ──────────────────────────────────────────────────────
const EmpresaContent = ({ account, location }: { account: Account; location: Location }) => {
  const hasRepresentative = account.representativeFirstName || account.representativeLastName;
  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <SectionTitle icon={<BusinessIcon fontSize="small" />}>Datos de la Empresa</SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Razón Social" value={account.legalName} />
          <DataField label="NIT" value={account.identificationNumber} />
          <DataField label="Correo Corporativo" value={account.email} />
          <DataField label="Correo de Facturación" value={account.billingEmail} />
          <DataField label="Teléfono" value={account.phone} />
          <DataField label="Dirección" value={account.address} />
        </Box>
      </Box>
      {hasRepresentative && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>Representante Legal</SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={account.representativeFirstName} />
              <DataField label="Apellidos" value={account.representativeLastName} />
              <DataField label="Identificación" value={account.representativeIdentification} />
              <DataField label="Email" value={account.representativeEmail} />
              <DataField label="Teléfono" value={account.representativePhone} />
            </Box>
          </Box>
        </>
      )}
      <Box className="h-px bg-gray-100" />
      <LocationSection location={location} />
    </Box>
  );
};

// ── Persona Natural ──────────────────────────────────────────────
const NaturalContent = ({ account, location }: { account: Account; location: Location }) => {
  const hasReference = account.representativeFirstName || account.representativeLastName;
  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <SectionTitle icon={<PersonIcon fontSize="small" />}>Datos Personales</SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Nombres" value={account.firstName} />
          <DataField label="Apellidos" value={account.lastName} />
          <DataField label="Cédula" value={account.identificationNumber} />
          <DataField label="Retefuente" value={retefuenteLabel(account.retefuenteType)} />
          <DataField label="Email" value={account.email} />
          <DataField label="Teléfono" value={account.phone} />
          <DataField label="Dirección" value={account.address} />
        </Box>
      </Box>
      {hasReference && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>Persona de Referencia</SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={account.representativeFirstName} />
              <DataField label="Apellidos" value={account.representativeLastName} />
              <DataField label="Identificación" value={account.representativeIdentification} />
              <DataField label="Cargo" value={account.representativeJobTitle} />
              <DataField label="Email" value={account.representativeEmail} />
              <DataField label="Teléfono" value={account.representativePhone} />
            </Box>
          </Box>
        </>
      )}
      <Box className="h-px bg-gray-100" />
      <LocationSection location={location} />
    </Box>
  );
};

// ── Export ───────────────────────────────────────────────────────
interface QuoteClientCardProps {
  account: Account;
  location: Location;
}

const QuoteClientCard = ({ account, location }: QuoteClientCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    {account.legalEntityType === LegalEntityType.EMPRESA ? (
      <EmpresaContent account={account} location={location} />
    ) : (
      <NaturalContent account={account} location={location} />
    )}
  </Box>
);

export default QuoteClientCard;
