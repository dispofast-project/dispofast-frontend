import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import SectionCard from "../../../../shared/components/Card/SectionCard";
import type { ProductFormData } from "../../schema/product.schema";

interface Props {
  control: Control<ProductFormData> | any;
  disabled?: boolean;
}

const ProductInfoSection = ({ control, disabled }: Props) => (
  <SectionCard title="Información producto">
    <div className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Título"
            size="small"
            fullWidth
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="shortDescription"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Descripción corta"
            size="small"
            fullWidth
            multiline
            rows={3}
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="longDescription"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Descripción larga"
            size="small"
            fullWidth
            multiline
            rows={5}
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="imageUrl"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="URL de imagen"
            size="small"
            fullWidth
            placeholder="https://..."
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </div>
  </SectionCard>
);

export default ProductInfoSection;
