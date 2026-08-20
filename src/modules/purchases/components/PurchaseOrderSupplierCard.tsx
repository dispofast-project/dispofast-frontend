import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DataField from "../../quotes/components/detailcard/DetailItem";
import SectionTitle from "../../../shared/components/SectionTitle/SectionTitle";
import { LegalEntityType, RetefuenteType } from "../../clients/types";
import type { ClientResponse, IndividualResponse, OrganizationResponse } from "../../clients/types";

const retefuenteLabel = (type: RetefuenteType | undefined): string => {
  if (type === RetefuenteType.PERSONA_JURIDICA) return "Persona jurídica (2,5%)";
  if (type === RetefuenteType.PERSONA_NATURAL) return "Persona natural (3,5%)";
  return "No aplica";
};

// ── Ubicación ────────────────────────────────────────────────────
const LocationSection = ({ supplier }: { supplier: ClientResponse }) => (
  <Box>
    <SectionTitle icon={<LocationOnIcon fontSize="small" />}>Ubicación</SectionTitle>
    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      <DataField label="Ciudad" value={supplier.city?.name} />
      <DataField label="Departamento" value={supplier.city?.department?.name} />
    </Box>
  </Box>
);

// ── Empresa ──────────────────────────────────────────────────────
const EmpresaContent = ({ supplier }: { supplier: OrganizationResponse }) => {
  const hasRepresentative = supplier.representativeFirstName || supplier.representativeLastName;
  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <SectionTitle icon={<BusinessIcon fontSize="small" />}>Datos del Proveedor</SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Razón Social" value={supplier.legalName} />
          <DataField label="NIT" value={supplier.identificationNumber} />
          <DataField label="Correo" value={supplier.email} />
          <DataField label="Correo de Facturación" value={supplier.billingEmail} />
          <DataField label="Teléfono" value={supplier.phone} />
          <DataField label="Dirección" value={supplier.address} />
        </Box>
      </Box>
      {hasRepresentative && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>Representante Legal</SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={supplier.representativeFirstName} />
              <DataField label="Apellidos" value={supplier.representativeLastName} />
              <DataField label="Identificación" value={supplier.representativeIdentification} />
              <DataField label="Email" value={supplier.representativeEmail} />
              <DataField label="Teléfono" value={supplier.representativePhone} />
            </Box>
          </Box>
        </>
      )}
      <Box className="h-px bg-gray-100" />
      <LocationSection supplier={supplier} />
    </Box>
  );
};

// ── Persona Natural ──────────────────────────────────────────────
const NaturalContent = ({ supplier }: { supplier: IndividualResponse }) => {
  const hasReference = supplier.representativeFirstName || supplier.representativeLastName;
  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <SectionTitle icon={<PersonIcon fontSize="small" />}>Datos Personales</SectionTitle>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Nombres" value={supplier.firstName} />
          <DataField label="Apellidos" value={supplier.lastName} />
          <DataField label="Cédula" value={supplier.identificationNumber} />
          <DataField label="Retefuente" value={retefuenteLabel(supplier.retefuenteType)} />
          <DataField label="Email" value={supplier.email} />
          <DataField label="Teléfono" value={supplier.phone} />
          <DataField label="Dirección" value={supplier.address} />
        </Box>
      </Box>
      {hasReference && (
        <>
          <Box className="h-px bg-gray-100" />
          <Box>
            <SectionTitle icon={<BadgeIcon fontSize="small" />}>Persona de Referencia</SectionTitle>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DataField label="Nombres" value={supplier.representativeFirstName} />
              <DataField label="Apellidos" value={supplier.representativeLastName} />
              <DataField label="Identificación" value={supplier.representativeIdentification} />
              <DataField label="Cargo" value={supplier.representativeJobTitle} />
              <DataField label="Email" value={supplier.representativeEmail} />
              <DataField label="Teléfono" value={supplier.representativePhone} />
            </Box>
          </Box>
        </>
      )}
      <Box className="h-px bg-gray-100" />
      <LocationSection supplier={supplier} />
    </Box>
  );
};

interface PurchaseOrderSupplierCardProps {
  supplier: ClientResponse;
}

const PurchaseOrderSupplierCard = ({ supplier }: PurchaseOrderSupplierCardProps) => (
  <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    {supplier.legalEntityType === LegalEntityType.LEGAL ? (
      <EmpresaContent supplier={supplier as OrganizationResponse} />
    ) : (
      <NaturalContent supplier={supplier as IndividualResponse} />
    )}
  </Box>
);

export default PurchaseOrderSupplierCard;
