import React from "react";
import { Typography, TextField, FormControlLabel, Switch, Box } from "@mui/material";
import type { ClientFormData } from "./types";

interface GeneralDataFieldsProps {
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralDataFields = ({ formData, onChange }: GeneralDataFieldsProps) => {
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
        {/* TODO: Agregar ComboBar para que sea seleccionar la ciudad */}
        <TextField size="small" fullWidth required label="Código Ciudad (ej: BOG)" name="cityCode" value={formData.cityCode} onChange={onChange} />
        {/* TODO: Agregar ComboBar para que sea seleccionar la zona (aqui no sera consultar el backend si no datos pregrabados) */}
        <TextField size="small" fullWidth required label="Zona (ej: norte, sur)" name="zone" value={formData.zone} onChange={onChange} />
        {/* TODO: Agregar ComboBar para que sea seleccionar el tipo de cliente */}
        <TextField size="small" fullWidth required type="number" label="ID Tipo Cliente" name="clientTypeId" value={formData.clientTypeId} onChange={onChange} />
        {/* TODO: Agregar ComboBar para que sea seleccionar la lista de precios */}
        <TextField size="small" fullWidth required label="ID Lista de Precios" name="priceListId" value={formData.priceListId} onChange={onChange} />
        {/* TODO: Agregar ComboBar para que sea buscar y seleccionar el asesor */}
        <TextField size="small" fullWidth required label="ID Asesor (UUID)" name="defaultAdvisorId" value={formData.defaultAdvisorId} onChange={onChange} />
      </div>

      <Box className="flex items-center justify-between border border-gray-100 p-4 rounded-xl bg-gray-50 mb-6">
        <Box>
          <Typography variant="subtitle2" className="font-bold text-gray-800">Aplica Retefuente</Typography>
          <Typography variant="caption" className="text-gray-500">¿Se le aplicará a este cliente retención en la fuente?</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              name="retefuenteApplies"
              checked={formData.retefuenteApplies}
              onChange={onChange}
            />
          }
          label=""
          className="!m-0"
        />
      </Box>
    </>
  );
};
