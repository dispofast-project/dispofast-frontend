import { Check } from "lucide-react";

interface ProductCardProps {
  name: string;
  category?: string;
  price: string | number;
  inStock?: boolean;
  onClick?: () => void;
}

const formatPrice = (price: string | number): string => {
  if (typeof price === "number") {
    return `$${price.toLocaleString("es-CO")}`;
  }
  return price;
};

const ProductCard = ({ name, category, price, inStock = true, onClick }: ProductCardProps) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
        {category && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{category}</p>
        )}
        <p className="text-sm font-bold text-dispofast-primary mt-1">{formatPrice(price)}</p>
      </div>

      {inStock !== undefined && (
        <div className="flex-shrink-0">
          {inStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
              <Check className="w-3 h-3" />
              Stock disponible
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
              Sin stock
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
