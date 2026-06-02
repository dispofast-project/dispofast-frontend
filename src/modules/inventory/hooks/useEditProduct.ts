import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { updateProductSchema, type UpdateProductFormData } from "../schema/product.schema";
import {
  getProductById,
  updateProduct,
  getCategories,
  type Product,
  type Category,
} from "../api/product.service";

export const useEditProduct = (id: string) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
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
      stock: 0,
    },
  });

  const populateForm = (p: Product, cats: Category[]) => {
    const cat = cats.find((c) => c.name === p.categoryName);
    form.reset({
      name: p.name,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      imageUrl: p.imageUrl,
      taxFree: p.taxFree,
      sku: p.sku,
      reference: p.reference,
      size: p.size,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
      state: p.state === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      categoryId: cat?.id ?? "",
      stock: p.stock ?? 0,
    });
  };

  useEffect(() => {
    Promise.all([getProductById(id), getCategories()])
      .then(([productData, catsData]) => {
        setProduct(productData);
        setCategories(catsData);
        populateForm(productData, catsData);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    if (product) populateForm(product, categories);
    setIsEditing(false);
    setSubmitError(null);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await updateProduct(id, data);
      setProduct(updated);
      populateForm(updated, categories);
      setIsEditing(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al actualizar el producto",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const onBack = () => navigate("/inventario");

  return {
    form,
    categories,
    product,
    isLoading,
    isEditing,
    isSubmitting,
    submitError,
    startEditing,
    cancelEditing,
    onSubmit,
    onBack,
  };
};
