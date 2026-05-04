import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import SectionCard from "../../../../shared/components/Card/SectionCard";
import type { ProductFormData } from "../../schema/product.schema";
import type { Category } from "../../api/product.service";

interface Props {
  control: Control<ProductFormData> | any;
  categories: Category[];
}

const ProductCategoriesSection = ({ control, categories }: Props) => (
  <SectionCard title="Categorías">
    <Controller
      name="categoryId"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl size="small" fullWidth error={!!fieldState.error}>
          <InputLabel>Categoría principal</InputLabel>
          <Select {...field} label="Categoría principal">
            <MenuItem value="">
              <em>Elegir</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  </SectionCard>
);

export default ProductCategoriesSection;
