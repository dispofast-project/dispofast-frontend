import React from "react";
import { Box, TextField } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";

import type { ClientFormData } from "../form/types";
import type { City } from "../../../../shared/types/location";
import SectionCard from "./SectionCard";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import { ZoneSelector } from "../../../../shared/components/ZoneSelector/ZoneSelector";
import { RetefuenteTypeSelector } from "../../../../shared/components/RetefuenteTypeSelector/RetefuenteTypeSelector";

interface OrganizationFormSectionsProps {
  formData: ClientFormData;
  selectedCity: City | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (city: City | null) => void;
}

const OrganizationFormSections = ({
  formData,
  selectedCity,
  onChange,
  onCityChange,
}: OrganizationFormSectionsProps) => (
  <>
    <SectionCard title="Información Corporativa" icon={<BusinessIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth required
          label="Razón Social" name="legalName"
          value={formData.legalName} onChange={onChange}
          sx={{ gridColumn: "1 / -1" }}
        />
        <TextField
          size="small" fullWidth required
          label="NIT" name="identificationNumber"
          value={formData.identificationNumber} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required type="email"
          label="Correo Corporativo" name="email"
          value={formData.email} onChange={onChange}
        />
        <TextField
          size="small" fullWidth type="email"
          label="Correo de Facturación" name="billingEmail"
          value={formData.billingEmail} onChange={onChange}
        />
        <Box className="border border-gray-100 p-3 rounded-lg bg-gray-50 col-span-1 sm:col-span-2">
          <RetefuenteTypeSelector value={formData.retefuenteType} onChange={onChange} required />
        </Box>
      </div>
    </SectionCard>

    <SectionCard title="Datos de Contacto" icon={<LocationOnIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth required
          label="Teléfono" name="phone"
          value={formData.phone} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Dirección" name="address"
          value={formData.address} onChange={onChange}
        />
        <CityAutocomplete required value={selectedCity} onChange={onCityChange} />
        <ZoneSelector required value={formData.zone} onChange={onChange} />
      </div>
    </SectionCard>

    <SectionCard title="Representante Legal" icon={<BadgeIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth required
          label="Nombres" name="representativeFirstName"
          value={formData.representativeFirstName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Apellidos" name="representativeLastName"
          value={formData.representativeLastName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Identificación" name="representativeIdentification"
          value={formData.representativeIdentification} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required type="email"
          label="Correo Electrónico" name="representativeEmail"
          value={formData.representativeEmail} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Teléfono" name="representativePhone"
          value={formData.representativePhone} onChange={onChange}
        />
      </div>
    </SectionCard>
  </>
);

export default OrganizationFormSections;
