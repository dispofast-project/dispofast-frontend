import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const ZONES = [
  { value: 'norte', label: 'Norte' },
  { value: 'sur', label: 'Sur' },
  { value: 'oriente', label: 'Oriente' },
  { value: 'occidente', label: 'Occidente' },
  { value: 'centro', label: 'Centro' },
];

interface ZoneSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const ZoneSelector = ({
  value,
  onChange,
  required = false,
  error,
  helperText,
}: ZoneSelectorProps) => {
  return (
    <TextField
      select
      size="small"
      fullWidth
      label="Zona"
      name="zone"
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: 'var(--dispofast-primary)',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--dispofast-primary)',
        },
      }}
    >
      {ZONES.map((zone) => (
        <MenuItem key={zone.value} value={zone.value}>
          {zone.label}
        </MenuItem>
      ))}
    </TextField>
  );
};