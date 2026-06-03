import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import SectionCard from "../../../../shared/components/Card/SectionCard";
import type { ProductFormData } from "../../schema/product.schema";
import ProductImageUpload from "./ProductImageUpload";

interface Props {
  control: Control<ProductFormData> | any;
  disabled?: boolean;
  currentImageUrl?: string;
  imageFile?: File | null;
  onImageChange?: (file: File) => void;
  onImageClear?: () => void;
}

const ProductInfoSection = ({
  control,
  disabled,
  currentImageUrl,
  imageFile,
  onImageChange,
  onImageClear,
}: Props) => (
  <SectionCard title="Información producto">
    <div className="flex flex-col gap-4">
      <ProductImageUpload
        currentImageUrl={currentImageUrl}
        imageFile={imageFile}
        onFileSelect={onImageChange ?? (() => {})}
        onFileClear={onImageClear}
        disabled={disabled}
      />
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
    </div>
  </SectionCard>
);

export default ProductInfoSection;
