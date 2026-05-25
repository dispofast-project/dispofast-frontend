import { useState, useImperativeHandle, forwardRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import { Trash2 } from "lucide-react";
import { NumericFormat } from "react-number-format";

import SectionTitle from "./SectionTitle";
import AddLineItemDialog from "../../../shared/components/AddLineItemDialog/AddLineItemDialog";
import type { LineItemResult } from "../../../shared/components/AddLineItemDialog/AddLineItemDialog";

interface DraftItem {
  tempId: string;
  productId: string;
  productName: string;
  productReference: string;
  taxFree: boolean;
  quantity: number;
  unitPrice: number;
}

export interface QuoteItemsDraftSectionHandle {
  getItems: () => Array<{ productId: string; quantity: number; unitPrice: number }>;
}

interface QuoteItemsDraftSectionProps {
  priceListId: string;
}

const IVA = 0.19;

const fmt = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

const QuoteItemsDraftSection = forwardRef<QuoteItemsDraftSectionHandle, QuoteItemsDraftSectionProps>(
  ({ priceListId }, ref) => {
    const [items, setItems] = useState<DraftItem[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingQty, setPendingQty] = useState<Record<string, string>>({});
    const [pendingPrice, setPendingPrice] = useState<Record<string, string>>({});

    useImperativeHandle(ref, () => ({
      getItems: () =>
        items.map((item) => ({
          productId: item.productId,
          quantity: parseFloat(pendingQty[item.tempId] ?? String(item.quantity)) || item.quantity,
          unitPrice: parseFloat(pendingPrice[item.tempId] ?? String(item.unitPrice)) || item.unitPrice,
        })),
    }));

    const handleAdd = (result: LineItemResult) => {
      const tempId = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        {
          tempId,
          productId: result.productId,
          productName: result.productName,
          productReference: result.productReference,
          taxFree: result.taxFree,
          quantity: result.quantity,
          unitPrice: result.unitPrice,
        },
      ]);
      setPendingQty((prev) => ({ ...prev, [tempId]: String(result.quantity) }));
      setPendingPrice((prev) => ({ ...prev, [tempId]: String(result.unitPrice) }));
    };

    const handleRemove = (tempId: string) => {
      setItems((prev) => prev.filter((i) => i.tempId !== tempId));
      setPendingQty((prev) => { const next = { ...prev }; delete next[tempId]; return next; });
      setPendingPrice((prev) => { const next = { ...prev }; delete next[tempId]; return next; });
    };

    return (
      <>
        <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <Box className="flex items-center justify-between">
            <SectionTitle icon={<InventoryIcon fontSize="small" />}>Productos</SectionTitle>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ textTransform: "none", fontWeight: 600, whiteSpace: "nowrap", height: 36 }}
            >
              Agregar producto
            </Button>
          </Box>

          {items.length === 0 ? (
            <Typography variant="body2" className="text-gray-400 text-center py-4">
              No hay productos agregados
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", whiteSpace: "nowrap" } }}>
                    <TableCell>Código</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Valor Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right">IVA</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => {
                    const qty = parseFloat(pendingQty[item.tempId] ?? String(item.quantity)) || 0;
                    const price = parseFloat(pendingPrice[item.tempId] ?? String(item.unitPrice)) || 0;
                    const subtotal = qty * price;
                    const iva = item.taxFree ? 0 : subtotal * IVA;
                    const total = subtotal + iva;
                    const isQtyDirty = qty !== item.quantity;
                    const isPriceDirty = price !== item.unitPrice;

                    return (
                      <TableRow key={item.tempId} hover sx={{ "& td": { fontSize: "0.82rem" } }}>
                        <TableCell sx={{ color: "text.secondary" }}>{item.productReference}</TableCell>
                        <TableCell>{item.productName}</TableCell>

                        <TableCell align="right" sx={{ minWidth: 110 }}>
                          <NumericFormat
                            customInput={TextField}
                            size="small"
                            value={pendingQty[item.tempId] ?? String(item.quantity)}
                            onValueChange={(v) =>
                              setPendingQty((prev) => ({ ...prev, [item.tempId]: v.value }))
                            }
                            decimalScale={2}
                            allowNegative={false}
                            isAllowed={({ floatValue }) => floatValue === undefined || floatValue > 0}
                            sx={{ width: 40 }}
                            slotProps={{
                              htmlInput: { style: { textAlign: "right", padding: "4px 8px" } },
                              input: {
                                sx: isQtyDirty ? { "& fieldset": { borderColor: "primary.main" } } : undefined,
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell align="right" sx={{ minWidth: 120 }}>
                          <NumericFormat
                            customInput={TextField}
                            size="small"
                            value={pendingPrice[item.tempId] ?? String(item.unitPrice)}
                            onValueChange={(v) =>
                              setPendingPrice((prev) => ({ ...prev, [item.tempId]: v.value }))
                            }
                            decimalScale={2}
                            allowNegative={false}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="$"
                            sx={{ width: 100 }}
                            slotProps={{
                              htmlInput: { style: { textAlign: "right", padding: "4px 8px" } },
                              input: {
                                sx: isPriceDirty ? { "& fieldset": { borderColor: "primary.main" } } : undefined,
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">{fmt(subtotal)}</TableCell>
                        <TableCell align="right">{fmt(iva)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{fmt(total)}</TableCell>
                        <TableCell align="right" padding="none">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemove(item.tempId)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>

        <AddLineItemDialog
          open={dialogOpen}
          priceListId={priceListId}
          onClose={() => setDialogOpen(false)}
          onAdd={handleAdd}
          priceEditable
        />
      </>
    );
  },
);

QuoteItemsDraftSection.displayName = "QuoteItemsDraftSection";

export default QuoteItemsDraftSection;
