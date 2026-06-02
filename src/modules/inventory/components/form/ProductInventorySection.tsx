import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import SectionCard from "../../../../shared/components/Card/SectionCard";
import type { ProductFormData } from "../../schema/product.schema";

const SIZES = ["0.5ml", "1ml", "2ml", "3ml", "5ml", "10ml", "20ml", "50ml", "100ml"];

interface Props {
  control: Control<ProductFormData> | any;
  disabled?: boolean;
  showInitialStock?: boolean;
}

const ProductInventorySection = ({ control, disabled, showInitialStock = true }: Props) => {

  const watch = useWatch({ control });

  return (
    <SectionCard title="Inventario">
      <div className="flex flex-col gap-4">
        <Controller
          name="state"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl size="small" fullWidth error={!!fieldState.error} disabled={disabled}>
              <InputLabel>Estado del inventario</InputLabel>
              <Select {...field} label="Estado del inventario">
                <MenuItem value="">
                  <em>Elegir</em>
                </MenuItem>
                <MenuItem value="ACTIVE">Disponible</MenuItem>
                <MenuItem value="INACTIVE">No disponible</MenuItem>
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="sku"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Código (SKU)"
              size="small"
              fullWidth
              disabled={disabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="reference"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Referencia Marca"
              size="small"
              fullWidth
              disabled={disabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="size"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl size="small" fullWidth error={!!fieldState.error} disabled={disabled}>
              <InputLabel>Tamaño</InputLabel>
              <Select {...field} label="Tamaño">
                <MenuItem value="">
                  <em>Elegir</em>
                </MenuItem>
                {SIZES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        {showInitialStock && (watch.state === "ACTIVE" || watch.state === "") && (
          <Controller
            name="initialStock"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Stock inicial"
                type="number"
                size="small"
                fullWidth
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )}
        {!showInitialStock && (
          <Controller
            name="stock"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Stock"
                type="number"
                size="small"
                fullWidth
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )}
        <Controller
          name="taxFree"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox checked={field.value} onChange={field.onChange} disabled={disabled} />
              }
              label="Exento de IVA"
            />
          )}
        />
      </div>
    </SectionCard>
  );
};

export default ProductInventorySection;
