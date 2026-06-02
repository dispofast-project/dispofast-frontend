import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { updateProductSchema, type UpdateProductFormData } from "../schema/product.schema";
import {
  getProductById,
  updateProduct,
  getCategories,
  uploadProductImage,
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
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
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
    },
  });

  const populateForm = (p: Product, cats: Category[]) => {
    const cat = cats.find((c) => c.name === p.categoryName);
    form.reset({
      name: p.name,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      taxFree: p.taxFree,
      sku: p.sku,
      reference: p.reference,
      size: p.size,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
      state: p.state === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      categoryId: cat?.id ?? "",
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
    setImageFile(null);
    setIsEditing(false);
    setSubmitError(null);
  };

  const onSubmit = form.handleSubmit(async (data: UpdateProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let updated = await updateProduct(id, data);
      if (imageFile) {
        updated = await uploadProductImage(id, imageFile);
        setImageFile(null);
      }
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
    imageFile,
    setImageFile,
    startEditing,
    cancelEditing,
    onSubmit,
    onBack,
  };
};
