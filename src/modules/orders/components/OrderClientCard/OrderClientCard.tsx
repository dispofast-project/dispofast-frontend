import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { User } from "lucide-react";
import Dropdown from "../../../../shared/components/Dropdown/Dropdown";
import { Input } from "../../../../shared/components/Input/Input";
import type { ClientPreview, ClientResponse } from "../../../clients/types";
import type { PriceListItem } from "../../../pricelist/api/pricelist.api";

interface OrderClientCardProps {
  selectedClient: ClientPreview | null;
  clientDetail: ClientResponse | null;
  clientOptions: ClientPreview[];
  clientInputValue: string;
  isClientSearching: boolean;
  onClientInputChange: (val: string) => void;
  onClientChange: (client: ClientPreview | null) => void;
  asesorName: string;
  priceListId: string;
  onPriceListChange: (id: string) => void;
  priceLists: PriceListItem[];
}

const OrderClientCard = ({
  selectedClient,
  clientDetail,
  clientOptions,
  clientInputValue,
  isClientSearching,
  onClientInputChange,
  onClientChange,
  asesorName,
  priceListId,
  onPriceListChange,
  priceLists,
}: OrderClientCardProps) => {
  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Box className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <User className="w-4 h-4 text-dispofast-primary" />
        </Box>
        <Box>
          <Typography variant="body1" className="font-semibold text-gray-800">
            Información del Cliente
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Selecciona el cliente y el asesor de esta orden
          </Typography>
        </Box>
      </Box>

      <Box className="px-6 py-5 flex flex-col gap-4">
        <Autocomplete
          size="small"
          fullWidth
          options={clientOptions}
          getOptionLabel={(opt) => opt.name}
          filterOptions={(x) => x}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={selectedClient}
          noOptionsText={
            isClientSearching
              ? "Buscando..."
              : clientInputValue.length < 2
              ? "Escribe al menos 2 caracteres"
              : "No se encontraron clientes"
          }
          onChange={(_e, newVal) => {
            onClientChange(newVal);
          }}
          onInputChange={(_e, val, reason) => {
            if (reason === "input" || reason === "clear") onClientInputChange(val);
          }}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente *"
              placeholder="Buscar por nombre o NIT..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isClientSearching ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, opt) => (
            <li {...props} key={opt.id}>
              <Box>
                <Typography variant="body2" className="font-medium">
                  {opt.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {opt.identificationNumber}
                </Typography>
              </Box>
            </li>
          )}
        />

        {clientDetail && (
          <Box className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <Box className="grid grid-cols-3 gap-x-6 gap-y-3">
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  NIT
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.identificationNumber || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Tipo de Cliente
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.clientType?.name || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Departamento
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.city?.department?.name || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Ciudad (Principal)
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.city?.name || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Dirección (Principal)
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.address || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Teléfono
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.phone || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide block">
                  Correo
                </Typography>
                <Typography variant="body2" className="text-gray-800 font-medium mt-0.5">
                  {clientDetail.email || "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Asesor Comercial"
            value={asesorName}
            readOnly
            placeholder="Se asigna al seleccionar cliente"
            onChange={() => {}}
          />
          <Dropdown
            label="Lista de Precios *"
            options={priceLists.map((pl) => ({ value: pl.id, label: pl.name }))}
            value={priceListId}
            onChange={(v) => onPriceListChange(v)}
            placeholder="Seleccionar lista..."
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OrderClientCard;
