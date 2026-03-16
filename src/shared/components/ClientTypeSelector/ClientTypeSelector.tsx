import React, { useState, useEffect } from "react";
import { TextField, MenuItem, CircularProgress, InputAdornment } from "@mui/material";
import type { ClientType } from "../../../modules/clients/types";
import { getClientTypesService } from "../../../modules/clients/api/clients.api";

interface ClientTypeSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const ClientTypeSelector = ({
  value,
  onChange,
  required = false,
  error,
  helperText,
}: ClientTypeSelectorProps) => {
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getClientTypesService()
      .then(setClientTypes)
      .catch((err) => console.error("Error cargando tipos de cliente:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <TextField
      select
      size="small"
      fullWidth
      label="Tipo de Cliente"
      name="clientTypeId"
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText}
      disabled={isLoading}
      InputProps={
        isLoading
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }
          : undefined
      }
    >
      {clientTypes.map((ct) => (
        <MenuItem key={ct.id} value={String(ct.id)}>
          {ct.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
