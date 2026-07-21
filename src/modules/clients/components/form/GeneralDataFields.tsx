import React, { useState } from "react";
import { Typography, TextField, Box } from "@mui/material";
import type { ClientFormData } from "./types";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import type { City } from "../../../../shared/types/location";
import { ZoneSelector } from "../../../../shared/components/ZoneSelector/ZoneSelector";
import { AdvisorAutocomplete } from "../../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import { ClientTypeSelector } from "../../../../shared/components/ClientTypeSelector/ClientTypeSelector";
import { PriceListAutocomplete } from "../../../../shared/components/PriceListAutocomplete/PriceListAutocomplete";
import { RetefuenteTypeSelector } from "../../../../shared/components/RetefuenteTypeSelector/RetefuenteTypeSelector";
import type { User } from "../../../iam/types";
import { useAuthStore } from "../../../iam/auth.store";
import CommercialDiscountSelect from "../../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";

interface GeneralDataFieldsProps {
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralDataFields = ({ formData, onChange }: GeneralDataFieldsProps) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<User | null>(null);
  const [selectedPriceList, setSelectedPriceList] = useState<{ id: string; name: string } | null>(null);
  const authorities = useAuthStore((state) => state.authorities);
  const user = useAuthStore((state) => state.user);
  const isAdmin = authorities.includes("ROLE_ADMIN");

  return ( 
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }} className="mb-8 text-gray-800 font-bold opacity-90">
        Datos Generales
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <TextField size="small" fullWidth required label="Identificación (Cédula o NIT)" name="identificationNumber" value={formData.identificationNumber} onChange={onChange} />
        <TextField size="small" fullWidth required type="email" label="Correo Electrónico" name="email" value={formData.email} onChange={onChange} />
        <TextField size="small" fullWidth required label="Teléfono" name="phone" value={formData.phone} onChange={onChange} />
        <TextField size="small" fullWidth required label="Dirección" name="address" value={formData.address} onChange={onChange} />
        <CityAutocomplete 
          required 
          value={selectedCity}
          onChange={(newCity) => {
            setSelectedCity(newCity);
            onChange({
              target: { name: "cityCode", value: newCity?.code || "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
        />
        <ZoneSelector
          value={formData.zone}
          onChange={onChange}
        />
        <ClientTypeSelector required value={formData.clientTypeId} onChange={onChange} />
        <PriceListAutocomplete
          required
          value={selectedPriceList}
          onChange={(priceList) => {
            setSelectedPriceList(priceList);
            onChange({
              target: { name: "priceListId", value: priceList?.id || "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
        />
        {isAdmin ? (
          <AdvisorAutocomplete
            required
            value={selectedAdvisor}
            onChange={(advisor) => {
              setSelectedAdvisor(advisor);
              onChange({
                target: { name: "defaultAdvisorId", value: advisor?.id || "" },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
          />
        ) : (
          <TextField
            size="small"
            fullWidth
            label="Asesor"
            value={user?.name ?? ""}
            disabled
            InputProps={{ readOnly: true }}
          />
        )}
        <CommercialDiscountSelect
          label="Descuento comercial"
          value={formData.defaultDiscountRate}
          onChange={(val) =>
            onChange({ target: { name: "defaultDiscountRate", value: val } } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      </div>

      <Box className="border border-gray-100 p-4 rounded-xl bg-gray-50 mb-6">
        <RetefuenteTypeSelector value={formData.retefuenteType} onChange={onChange} required />
      </Box>
    </>
  );
};
