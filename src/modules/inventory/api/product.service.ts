import apiClient from "../../../shared/api/apiClient";
import type { ProductFormData, UpdateProductFormData } from "../schema/product.schema";

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  taxFree: boolean;
  sku: string;
  reference: string;
  size: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  state: string;
  categoryName: string;
}

export interface Category {
  id: string;
  name: string;
}

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const createProduct = async (payload: ProductFormData): Promise<Product> => {
  const { data } = await apiClient.post("/products", payload);
  return data;
};

export const updateProduct = async (id: string, payload: UpdateProductFormData): Promise<Product> => {
  const { data } = await apiClient.put<Product>(`/products/${id}`, payload);
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
};

export const uploadProductImage = async (productId: string, file: File): Promise<Product> => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<Product>(`/products/${productId}/image`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
