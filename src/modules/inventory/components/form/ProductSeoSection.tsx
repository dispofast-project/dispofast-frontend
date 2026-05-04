import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import SectionCard from "../../../../shared/components/Card/SectionCard";
import type { ProductFormData } from "../../schema/product.schema";

interface Props {
  control: Control<ProductFormData> | any;
}

const ProductSeoSection = ({ control }: Props) => (
  <SectionCard title="SEO">
    <div className="flex flex-col gap-4">
      <Controller
        name="seoTitle"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Título"
            size="small"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="seoDescription"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Descripción"
            size="small"
            fullWidth
            multiline
            rows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="seoKeywords"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Palabras clave"
            size="small"
            fullWidth
            multiline
            rows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </div>
  </SectionCard>
);

export default ProductSeoSection;
