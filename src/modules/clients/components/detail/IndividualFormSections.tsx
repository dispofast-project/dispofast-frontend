import React from "react";
import { Box, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";

import type { ClientFormData } from "../form/types";
import type { City } from "../../../../shared/types/location";
import SectionCard from "./SectionCard";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import { ZoneSelector } from "../../../../shared/components/ZoneSelector/ZoneSelector";
import { RetefuenteTypeSelector } from "../../../../shared/components/RetefuenteTypeSelector/RetefuenteTypeSelector";

interface IndividualFormSectionsProps {
  formData: ClientFormData;
  selectedCity: City | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (city: City | null) => void;
}

const IndividualFormSections = ({
  formData,
  selectedCity,
  onChange,
  onCityChange,
}: IndividualFormSectionsProps) => (
  <>
    <SectionCard title="Datos Personales" icon={<PersonIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth required
          label="Nombres" name="firstName"
          value={formData.firstName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Apellidos" name="lastName"
          value={formData.lastName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Identificación (Cédula)" name="identificationNumber"
          value={formData.identificationNumber} onChange={onChange}
        />
        <Box className="border border-gray-100 p-3 rounded-lg bg-gray-50 col-span-1 sm:col-span-2">
          <RetefuenteTypeSelector value={formData.retefuenteType} onChange={onChange} required />
        </Box>
      </div>
    </SectionCard>

    <SectionCard title="Datos de Contacto" icon={<LocationOnIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth required type="email"
          label="Correo Electrónico" name="email"
          value={formData.email} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Teléfono" name="phone"
          value={formData.phone} onChange={onChange}
        />
        <TextField
          size="small" fullWidth required
          label="Dirección" name="address"
          value={formData.address} onChange={onChange}
          sx={{ gridColumn: "1 / -1" }}
        />
        <CityAutocomplete required value={selectedCity} onChange={onCityChange} />
        <ZoneSelector required value={formData.zone} onChange={onChange} />
      </div>
    </SectionCard>

    <SectionCard title="Persona de Referencia (Opcional)" icon={<BadgeIcon fontSize="small" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          size="small" fullWidth
          label="Nombres" name="representativeFirstName"
          value={formData.representativeFirstName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth
          label="Apellidos" name="representativeLastName"
          value={formData.representativeLastName} onChange={onChange}
        />
        <TextField
          size="small" fullWidth
          label="Identificación" name="representativeIdentification"
          value={formData.representativeIdentification} onChange={onChange}
        />
        <TextField
          size="small" fullWidth type="email"
          label="Correo Electrónico" name="representativeEmail"
          value={formData.representativeEmail} onChange={onChange}
        />
        <TextField
          size="small" fullWidth
          label="Teléfono" name="representativePhone"
          value={formData.representativePhone} onChange={onChange}
        />
        <TextField
          size="small" fullWidth
          label="Cargo" name="representativeJobTitle"
          value={formData.representativeJobTitle} onChange={onChange}
        />
      </div>
    </SectionCard>
  </>
);

export default IndividualFormSections;
