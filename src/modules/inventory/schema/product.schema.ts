import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  shortDescription: z.string().min(1, "Descripción corta es requerida"),
  longDescription: z.string().min(1, "Descripción larga es requerida"),
  taxFree: z.boolean(),
  sku: z.string().min(1, "SKU es requerido"),
  reference: z.string().min(1, "Referencia es requerida"),
  size: z.string().min(1, "Tamaño es requerido"),
  seoTitle: z.string().min(1, "Título SEO es requerido"),
  seoDescription: z.string().min(1, "Descripción SEO es requerida"),
  seoKeywords: z.string().min(1, "Palabras clave son requeridas"),
  state: z.enum(["ACTIVE", "INACTIVE"]),
  categoryId: z.string().min(1, "Categoría es requerida"),
  initialStock: z.coerce.number().min(0).default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const updateProductSchema = productSchema.omit({ initialStock: true });
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
