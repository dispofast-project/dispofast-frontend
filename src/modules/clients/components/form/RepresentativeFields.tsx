import React from "react";
import { Typography, TextField } from "@mui/material";
import { LegalEntityType } from "../../types";
import type { ClientFormData } from "./types";

interface RepresentativeFieldsProps {
  entityType: LegalEntityType;
  formData: ClientFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RepresentativeFields = ({ entityType, formData, onChange }: RepresentativeFieldsProps) => {
  const isLegal = entityType === LegalEntityType.LEGAL;

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }} className="mb-4 text-gray-800 font-bold opacity-90 mt-2">
        Datos {isLegal ? "del Representante (Requerido)" : "de Contacto Autorizado (Opcional)"}
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLegal && (
          <>
            <TextField size="small" fullWidth required={isLegal} label="Nombres" name="representativeFirstName" value={formData.representativeFirstName} onChange={onChange} />
            <TextField size="small" fullWidth required={isLegal} label="Apellidos" name="representativeLastName" value={formData.representativeLastName} onChange={onChange} />
          </>
          )}
        <TextField size="small" fullWidth required={isLegal} label="Identificación" name="representativeIdentification" value={formData.representativeIdentification} onChange={onChange} />
        <TextField size="small" fullWidth required={isLegal} type="email" label="Correo Electrónico" name="representativeEmail" value={formData.representativeEmail} onChange={onChange} />
        <TextField size="small" fullWidth required={isLegal} label="Teléfono" name="representativePhone" value={formData.representativePhone} onChange={onChange} />
      </div>
    </>
  );
};
