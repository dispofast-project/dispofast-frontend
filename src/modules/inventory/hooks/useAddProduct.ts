import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { productSchema, type ProductFormData } from "../schema/product.schema";
import { createProduct, getCategories, type Category } from "../api/product.service";

export const useAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      imageUrl: "",
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

  const onSubmit = form.handleSubmit(async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createProduct(data);
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
    onSubmit,
    onDiscard,
  };
};
