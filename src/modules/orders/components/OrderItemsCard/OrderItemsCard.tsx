import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import AddLineItemDialog from "../../../../shared/components/AddLineItemDialog/AddLineItemDialog";
import { formatCurrency } from "../../utils/format";
import type { OrderItem } from "../../hooks/useCreateOrder";
import type { CreateOrderItemDTO } from "../../types";
import type { LineItemResult } from "../../../../shared/components/AddLineItemDialog/AddLineItemDialog";

interface OrderItemsCardProps {
  priceListId: string;
  items: OrderItem[];
  onAddProduct: (item: CreateOrderItemDTO & { productName: string; productReference: string; taxFree: boolean }) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, qty: number, unitPrice: number) => void;
}

const toCreateOrderItem = (result: LineItemResult): CreateOrderItemDTO & { productName: string; productReference: string; taxFree: boolean } => ({
  productId: result.productId,
  productName: result.productName,
  productReference: result.productReference,
  taxFree: result.taxFree,
  quantity: result.quantity,
  unitPrice: result.unitPrice,
  lineTotal: result.lineTotal,
});

const IVA = 0.19;

const OrderItemsCard = ({ priceListId, items, onAddProduct, onRemoveItem, onUpdateItem }: OrderItemsCardProps) => {
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const totalSubtotal  = items.reduce((acc, it) => acc + it.lineTotal, 0);
  const totalIva       = items.reduce((acc, it) => acc + (it.taxFree ? 0 : it.lineTotal * IVA), 0);
  const totalWithIva   = totalSubtotal + totalIva;

  return (
    <>
      <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Box className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <Box className="flex items-center gap-3">
            <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-dispofast-primary" />
            </Box>
            <Box>
              <Typography variant="body1" className="font-semibold text-gray-800">
                Productos de la Orden
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Selecciona y configura los ítems de esta orden
              </Typography>
            </Box>
          </Box>
          <Button
            variant="primary"
            onClick={() => setProductDialogOpen(true)}
            className="flex items-center gap-1.5"
            disabled={!priceListId}
          >
            <Plus className="w-4 h-4" />
            Agregar Producto
          </Button>
        </Box>

        {!priceListId && (
          <Box className="px-6 py-3 bg-amber-50 border-b border-amber-100">
            <Typography variant="caption" className="text-amber-700">
              Selecciona una lista de precios antes de agregar productos.
            </Typography>
          </Box>
        )}

        {items.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-14 gap-3">
            <Box className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-gray-400" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              No hay productos agregados
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Haz clic en "Agregar Producto" para comenzar
            </Typography>
          </Box>
        ) : (
          <Box className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-2 text-left   text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Código</th>
                  <th className="px-4 py-2 text-left   text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Cant.</th>
                  <th className="px-4 py-2 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Valor Unit.</th>
                  <th className="px-4 py-2 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Subtotal</th>
                  <th className="px-4 py-2 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">IVA</th>
                  <th className="px-4 py-2 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Total</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const ivaAmt      = item.taxFree ? 0 : item.lineTotal * IVA;
                  const totalLine   = item.lineTotal + ivaAmt;
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 group">
                      <td className="px-4 py-2 text-xs text-gray-500 font-mono">{item.productReference}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-800">{item.productName}</td>

                      {/* Cant. — editable inline */}
                      <td className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseFloat(e.target.value) || 0;
                            onUpdateItem(idx, qty, item.unitPrice);
                          }}
                          className="w-16 text-center text-sm border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                        />
                      </td>

                      {/* Valor Unit. — editable inline */}
                      <td className="px-2 py-2 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <span className="text-xs text-gray-400">$</span>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) => {
                              const price = parseFloat(e.target.value) || 0;
                              onUpdateItem(idx, item.quantity, price);
                            }}
                            className="w-24 text-right text-sm border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-2 text-sm text-right text-gray-700">{formatCurrency(item.lineTotal)}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-500">{formatCurrency(ivaAmt)}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-800">{formatCurrency(totalLine)}</td>

                      <td className="px-2 py-2 text-right">
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700">Totales</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{formatCurrency(totalSubtotal)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-500 text-right">{formatCurrency(totalIva)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">{formatCurrency(totalWithIva)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </Box>
        )}
      </Box>

      <AddLineItemDialog
        open={productDialogOpen}
        priceListId={priceListId}
        onClose={() => setProductDialogOpen(false)}
        onAdd={(result) => onAddProduct(toCreateOrderItem(result))}
        priceEditable
      />
    </>
  );
};

export default OrderItemsCard;
