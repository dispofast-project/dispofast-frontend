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
import { Button } from "../../../shared/components/Button/Button";
import { getAllInventoryProducts } from "../../inventory/api/inventory.service";
import type { InventoryItem } from "../../inventory/api/inventory.service";

export interface PurchaseLineItemResult {
  productId: string;
  productName: string;
  productReference: string;
  taxFree: boolean;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface AddPurchaseItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: PurchaseLineItemResult) => void;
}

const IVA = 0.19;

const AddPurchaseItemDialog = ({ open, onClose, onAdd }: AddPurchaseItemDialogProps) => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError(null);
    getAllInventoryProducts(0, 50, { search: debouncedSearch || undefined })
      .then((res) => setProducts(res.content))
      .catch(() => setError("No se pudieron cargar los productos."))
      .finally(() => setIsLoading(false));
  }, [open, debouncedSearch]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebouncedSearch("");
      setSelectedProduct(null);
      setQuantity("");
      setUnitPrice("");
      setError(null);
    }
  }, [open]);

  const handleSelectProduct = (product: InventoryItem) => {
    setSelectedProduct(product);
    setError(null);
  };

  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  const lineTotal = qty * price;
  const ivaAmount = selectedProduct && !selectedProduct.taxFree ? lineTotal * IVA : 0;
  const totalWithIva = lineTotal + ivaAmount;

  const handleAdd = () => {
    if (!selectedProduct) {
      setError("Selecciona un producto.");
      return;
    }
    if (qty <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      return;
    }
    if (price <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    onAdd({
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productReference: selectedProduct.sku,
      taxFree: selectedProduct.taxFree,
      quantity: qty,
      unitPrice: price,
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
            placeholder="Buscar producto por nombre o referencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-4 h-4 text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Product list */}
          <Box className="border border-gray-200 rounded-lg overflow-hidden">
            {isLoading ? (
              <Box className="flex items-center justify-center py-10">
                <CircularProgress size={24} />
              </Box>
            ) : error && products.length === 0 ? (
              <Box className="flex items-center justify-center py-10 px-4">
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            ) : products.length === 0 ? (
              <Box className="flex items-center justify-center py-10">
                <Typography variant="body2" color="textSecondary">
                  No hay productos en el inventario
                </Typography>
              </Box>
            ) : (
              <Box className="max-h-52 overflow-y-auto">
                {products.map((product) => (
                  <Box
                    key={product.productId}
                    onClick={() => handleSelectProduct(product)}
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
                      <Box>
                        <Typography variant="body2" className="font-medium text-gray-800">
                          {product.productName}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          {product.sku}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="text-right">
                      <Typography variant="caption" className="text-gray-400 block">
                        Stock actual: {product.quantityAvailable}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Selected product form */}
          {selectedProduct && (
            <>
              <Divider />
              <Box className="bg-blue-50 rounded-lg p-3">
                <Typography variant="body2" className="font-semibold text-dispofast-primary">
                  {selectedProduct.productName}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {selectedProduct.sku} · Disponible: {selectedProduct.quantityAvailable} unidades
                </Typography>
              </Box>

              <Box className="grid grid-cols-2 gap-3">
                <TextField
                  size="small"
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                  required
                />
                <TextField
                  size="small"
                  label="Costo unitario"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  slotProps={{
                    htmlInput: { min: 0, step: 0.01 },
                    input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                  }}
                  helperText="Costo pactado con el proveedor"
                  required
                />
              </Box>

              <Box className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col gap-1.5">
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Subtotal</Typography>
                  <Typography variant="body2" className="font-medium text-gray-700">
                    ${lineTotal.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">
                    IVA (19%){selectedProduct.taxFree ? " — Exento" : ""}
                  </Typography>
                  <Typography variant="body2" className="font-medium text-gray-700">
                    ${ivaAmount.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Divider />
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="font-semibold text-gray-700">Total línea</Typography>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${totalWithIva.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
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
          disabled={!selectedProduct || qty <= 0 || price <= 0}
        >
          Agregar producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPurchaseItemDialog;
