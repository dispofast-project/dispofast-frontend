import { useState } from "react";
import { getProductById, type Product } from "../api/product.service";

export const useProduct = () => {

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getProductById(id);
            setProduct(response);
        } catch (err) {
            setError("Error al cargar el producto");
        } finally {
            setLoading(false);
        }
    };

    return { product, loading, error, fetchProduct };
};