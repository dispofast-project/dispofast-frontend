import apiClient from "../../../shared/api/apiClient";

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

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const { data } = await apiClient.get(`/products/${id}`);
        return data;
    } catch (error) {
        throw new Error("Error al cargar el producto");
    }
}