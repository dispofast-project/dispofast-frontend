import React from "react";
import { Typography, TextField } from "@mui/material";
import type { ClientFormData } from "./types";

interface OrganizationFieldsProps {
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrganizationFields = ({ formData, onChange }: OrganizationFieldsProps) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }} className="mb-4 text-gray-800 font-bold opacity-90 mt-2">
        Datos Empresa
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="col-span-1 sm:col-span-2">
          <TextField size="small" fullWidth required label="Razón Social" name="legalName" value={formData.legalName} onChange={onChange} />
        </div>
        <TextField size="small" fullWidth type="email" label="Correo de Facturación" name="billingEmail" value={formData.billingEmail} onChange={onChange} />
      </div>
    </>
  );
};
