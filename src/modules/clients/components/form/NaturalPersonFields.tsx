import React from "react";
import { Typography, TextField } from "@mui/material";
import type { ClientFormData } from "./types";

interface NaturalPersonFieldsProps {
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NaturalPersonFields = ({ formData, onChange }: NaturalPersonFieldsProps) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }} className="mb-4 text-gray-800 font-bold opacity-90 mt-2">
        Datos Persona Natural
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <TextField size="small" fullWidth required label="Nombres" name="firstName" value={formData.firstName} onChange={onChange} />
        <TextField size="small" fullWidth required label="Apellidos" name="lastName" value={formData.lastName} onChange={onChange} />
      </div>
    </>
  );
};
