import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { productSchema, type ProductFormData } from "../schema/product.schema";
import { createProduct, getCategories, uploadProductImage, type Category } from "../api/product.service";

type ProductFormInput = z.input<typeof productSchema>;

export const useAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      taxFree: false,
      sku: "",
      reference: "",
      size: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      state: "ACTIVE",
      categoryId: "",
      initialStock: 0,
    },
  });

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const onSubmit = form.handleSubmit(async (data: ProductFormInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createProduct(data as ProductFormData);
      if (imageFile) {
        await uploadProductImage(created.id, imageFile);
      }
      navigate("/inventario");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al crear el producto",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const onDiscard = () => navigate("/inventario");

  return {
    form,
    categories,
    isSubmitting,
    submitError,
    imageFile,
    setImageFile,
    onSubmit,
    onDiscard,
  };
};
