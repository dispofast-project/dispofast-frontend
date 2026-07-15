import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { RetefuenteType } from "../../../modules/clients/types";

const RETEFUENTE_OPTIONS = [
  { value: RetefuenteType.PERSONA_JURIDICA, label: "Persona jurídica (2,5%)" },
  { value: RetefuenteType.PERSONA_NATURAL, label: "Persona natural (3,5%)" },
  { value: RetefuenteType.NO_APLICA, label: "No aplica" },
];

interface RetefuenteTypeSelectorProps {
  value: RetefuenteType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const RetefuenteTypeSelector = ({
  value,
  onChange,
  required = false,
}: RetefuenteTypeSelectorProps) => {
  return (
    <TextField
      select
      size="small"
      fullWidth
      label="Retención en la fuente"
      name="retefuenteType"
      value={value}
      onChange={onChange}
      required={required}
      helperText="Tipo de retención aplicable a este cliente"
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "var(--dispofast-primary)",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--dispofast-primary)",
        },
      }}
    >
      {RETEFUENTE_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
