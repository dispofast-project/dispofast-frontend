import React, { useState } from "react";
import { Typography, TextField, Switch, Box } from "@mui/material";
import { NumericFormat } from 'react-number-format';
import type { ClientFormData } from "./types";
import { CityAutocomplete } from "../../../../shared/components/CityAutocomplete/CityAutocomplete";
import type { City } from "../../../../shared/types/location";
import { ZoneSelector } from "../../../../shared/components/ZoneSelector/ZoneSelector";
import { AdvisorAutocomplete } from "../../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import type { User } from "../../../iam/types";

interface GeneralDataFieldsProps {
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralDataFields = ({ formData, onChange }: GeneralDataFieldsProps) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<User | null>(null);

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
          required 
        />
        {/* TODO: Agregar ComboBar para que sea seleccionar el tipo de cliente */}
        <TextField size="small" fullWidth required type="number" label="ID Tipo Cliente" name="clientTypeId" value={formData.clientTypeId} onChange={onChange} />
        {/* TODO: Agregar ComboBar para que sea seleccionar la lista de precios */}
        <TextField size="small" fullWidth required label="ID Lista de Precios" name="priceListId" value={formData.priceListId} onChange={onChange} />
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
        <NumericFormat
          customInput={TextField}
          size="small"
          fullWidth
          required
          label="Descuento por defecto"
          name="defaultDiscountRate"
          value={formData.defaultDiscountRate}
          onValueChange={(values) => {
            onChange({ target: { name: 'defaultDiscountRate', value: values.value } } as React.ChangeEvent<HTMLInputElement>);
          }}
          suffix=" %"
          decimalScale={0}
          allowNegative={false}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue === undefined || (floatValue >= 0 && floatValue <= 100);
          }}
        />
      </div>

      <Box className="flex items-center justify-between border border-gray-100 p-4 rounded-xl bg-gray-50 mb-6">
      <Box className="flex flex-col">
        <Typography 
          variant="subtitle2" 
          className="font-bold text-gray-800"
          sx={{ lineHeight: 1.4 }}
        >
          Aplica Retefuente
        </Typography>
        <Typography 
          variant="caption" 
          className="text-gray-500"
          sx={{ lineHeight: 1.2, mt: 0.5 }}
        >
          ¿Se le aplicará a este cliente retención en la fuente?
        </Typography>
      </Box>
      
      <Switch
        color="primary"
        name="retefuenteApplies"
        checked={formData.retefuenteApplies}
        onChange={onChange}
        sx={{ ml: 2 }}
      />
    </Box>
    </>
  );
};
