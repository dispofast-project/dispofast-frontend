import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Search, Package } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { getAllInventoryProducts } from "../../../inventory/api/inventory.api";
import type { InventoryItem } from "../../../inventory/api/inventory.api";
import type { CreateOrderItemDTO } from "../../types";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: CreateOrderItemDTO & { productName: string }) => void;
}

const AddProductDialog = ({ open, onClose, onAdd }: AddProductDialogProps) => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    setError(null);
    getAllInventoryProducts(0, 100)
      .then((res) => setProducts(res.content))
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setIsLoading(false));
  }, [open]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(products);
    } else {
      const lower = search.toLowerCase();
      setFilteredProducts(
        products.filter((p) => p.productName.toLowerCase().includes(lower))
      );
    }
  }, [search, products]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedProduct(null);
      setQuantity("");
      setUnitPrice("");
      setDiscount("0");
      setError(null);
    }
  }, [open]);

  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  const disc = parseFloat(discount) || 0;
  const lineTotal = qty * price * (1 - disc / 100);

  const handleAdd = () => {
    if (!selectedProduct) {
      setError("Selecciona un producto.");
      return;
    }
    if (qty <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      return;
    }
    if (price < 0) {
      setError("El precio no puede ser negativo.");
      return;
    }

    onAdd({
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      quantity: qty,
      unitPrice: price,
      discount: disc > 0 ? disc : undefined,
      lineTotal,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="font-bold">Agregar Producto</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 pt-1">
          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-gray-400" />
                </InputAdornment>
              ),
            }}
          />

          {/* Product list */}
          <Box className="border border-gray-200 rounded-lg overflow-hidden">
            {isLoading ? (
              <Box className="flex items-center justify-center py-10">
                <CircularProgress size={24} />
              </Box>
            ) : error && products.length === 0 ? (
              <Box className="flex items-center justify-center py-10">
                <Typography variant="body2" color="error">{error}</Typography>
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box className="flex items-center justify-center py-10">
                <Typography variant="body2" color="textSecondary">
                  No se encontraron productos
                </Typography>
              </Box>
            ) : (
              <Box className="max-h-52 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Box
                    key={product.productId}
                    onClick={() => {
                      setSelectedProduct(product);
                      setError(null);
                    }}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedProduct?.productId === product.productId
                        ? "bg-blue-50 border-l-4 border-l-dispofast-primary"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Box className="flex items-center gap-3">
                      <Box className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-gray-500" />
                      </Box>
                      <Typography variant="body2" className="font-medium text-gray-800">
                        {product.productName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" className="text-gray-500">
                      Stock: {product.quantityAvailable}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Selected product details form */}
          {selectedProduct && (
            <>
              <Divider />
              <Box className="bg-blue-50 rounded-lg p-3">
                <Typography variant="body2" className="font-semibold text-dispofast-primary">
                  {selectedProduct.productName}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  Disponible: {selectedProduct.quantityAvailable} unidades
                </Typography>
              </Box>

              <Box className="grid grid-cols-3 gap-3">
                <TextField
                  size="small"
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  required
                />
                <TextField
                  size="small"
                  label="Precio unitario"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
                <TextField
                  size="small"
                  label="Descuento %"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>

              <Box className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <Typography variant="body2" className="text-gray-600">Total línea</Typography>
                <Typography variant="body1" className="font-bold text-gray-800">
                  ${lineTotal.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </>
          )}

          {error && selectedProduct && (
            <Typography variant="caption" color="error">{error}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="px-6 pb-4 gap-2">
        <Button variant="tertiary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={!selectedProduct || qty <= 0}
        >
          Agregar producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
