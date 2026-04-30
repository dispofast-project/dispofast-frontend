import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";

const ProductDetailPage = () => {

    const { id } = useParams<{ id: string }>();
    const { product, loading, error, fetchProduct } = useProduct();

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    return (
        <div className="p-4">
            {loading && <p>Cargando producto...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {product && (
                <div className="bg-white shadow rounded p-6">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-700">{product.shortDescription}</p>
                    <p className="text-gray-500 mt-2">SKU: {product.sku}</p>
                    <p className="text-gray-500">Categoria: {product.categoryName}</p>
                    <p className="text-gray-500">Tamaño: {product.size}</p>
                </div>
            )}
        </div>
    );
}

export default ProductDetailPage;