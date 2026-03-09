import { useState } from "react";
import type { ChangeEvent } from "react";
import { Box, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { SelectChangeEvent } from "@mui/material";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import type {
  FilterSearchBarProps,
  ScopedTextValue,
} from "./types";
import { useFilterState } from "./useFilterState";

interface InlineScopeSelectProps {
  scopes: { value: string; label: string }[];
  value: string;
  onChange: (scope: string) => void;
}

const InlineScopeSelect = ({ scopes, value, onChange }: InlineScopeSelectProps) => {
  const longestLabel = scopes.reduce(
    (max, s) => (s.label.length > max ? s.label.length : max),
    0
  );
  const fixedWidth = Math.max(160, longestLabel * 8 + 64);

  return (
    <FormControl size="small" sx={{ width: fixedWidth, flexShrink: 0 }}>
      <InputLabel id="scope-select-label">Buscar por</InputLabel>
      <Select
        labelId="scope-select-label"
        value={value}
        label="Buscar por"
        input={<OutlinedInput label="Buscar por" />}
        onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
        className="bg-gray-50 font-medium"
      >
        {scopes.map((s) => (
          <MenuItem key={s.value} value={s.value} className="text-sm">
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const FilterSearchBar = ({ configs, onChange, className }: FilterSearchBarProps) => {
  const { state, setScopedText } = useFilterState(configs, onChange);
  const scopedConfig = configs.find((c) => c.type === "scoped-text");
  
  const globalValue = (state[scopedConfig?.key ?? ""] as ScopedTextValue) || {
    scope: scopedConfig?.scopes[0]?.value ?? "",
    term: "",
  };

  const [localTerm, setLocalTerm] = useState(globalValue.term);

  const [prevGlobalTerm, setPrevGlobalTerm] = useState(globalValue.term);
  if (globalValue.term !== prevGlobalTerm) {
    setLocalTerm(globalValue.term);
    setPrevGlobalTerm(globalValue.term);
  }

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalTerm(term); // Actualización visual inmediata

    if (scopedConfig) {
      // Actualización lógica con Debounce
      setScopedText(scopedConfig.key, { ...globalValue, term });
    }
  };

  const handleScopeChange = (scope: string) => {
    if (scopedConfig) {
      setScopedText(scopedConfig.key, { scope, term: localTerm }, false);
    }
  };

  return (
    <Box
      className={`${className} bg-white border border-gray-200 rounded-lg shadow-sm transition-all hover:border-gray-300`}
    >
      <Stack direction="row" alignItems="center" gap={2} className="px-4 py-3">
        <TextField
          size="small"
          placeholder="Escribe para buscar..."
          value={localTerm} // <-- Conectado al estado local veloz
          onChange={handleTermChange}
          className="flex-grow"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
            }
          }}
        />

        {scopedConfig && (
          <InlineScopeSelect
            scopes={scopedConfig.scopes}
            value={globalValue.scope}
            onChange={handleScopeChange}
          />
        )}
      </Stack>
    </Box>
  );
};

export default FilterSearchBar;
