import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import { Trash2, History } from "lucide-react";
import { NumericFormat } from "react-number-format";

import SectionTitle from "./SectionTitle";
import AddLineItemDialog from "../../../shared/components/AddLineItemDialog/AddLineItemDialog";
import PriceHistoryDialog from "../../../shared/components/PriceHistoryDialog/PriceHistoryDialog";
import {
  getQuoteItemsService,
  addQuoteItemService,
  updateQuoteItemService,
  removeQuoteItemService,
} from "../api/quotes.api";
import type { QuoteItem } from "../types";

interface QuoteItemsSectionProps {
  quoteId: string;
  priceListId: string;
  clientId?: string;
  onHasPendingChanges?: (hasPending: boolean) => void;
  onItemsChanged?: () => void;
}

export interface QuoteItemsSectionHandle {
  saveChanges: () => Promise<void>;
  getItems: () => QuoteItem[];
}

const fmt = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

const QuoteItemsSection = forwardRef<QuoteItemsSectionHandle, QuoteItemsSectionProps>(
  ({ quoteId, priceListId, clientId, onHasPendingChanges, onItemsChanged }, ref) => {
    const [items, setItems] = useState<QuoteItem[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [historyItem, setHistoryItem] = useState<{ productId: string; productName: string } | null>(null);

    const [pendingQty, setPendingQty] = useState<Record<string, string>>({});
    const [pendingPrice, setPendingPrice] = useState<Record<string, string>>({});

    const loadItems = useCallback(() => {
      setIsLoadingItems(true);
      getQuoteItemsService(quoteId)
        .then((loaded) => {
          setItems(loaded);
          const initialQty: Record<string, string> = {};
          const initialPrice: Record<string, string> = {};
          loaded.forEach((i) => {
            initialQty[i.id] = String(i.quantity);
            initialPrice[i.id] = String(i.unitPrice);
          });
          setPendingQty(initialQty);
          setPendingPrice(initialPrice);
        })
        .catch((err: unknown) =>
          setLoadError(err instanceof Error ? err.message : "Error al cargar los ítems"),
        )
        .finally(() => setIsLoadingItems(false));
    }, [quoteId]);

    useEffect(() => {
      loadItems();
    }, [loadItems]);

    useEffect(() => {
      const hasPending = items.some(
        (i) =>
          parseFloat(pendingQty[i.id] ?? String(i.quantity)) !== i.quantity ||
          parseFloat(pendingPrice[i.id] ?? String(i.unitPrice)) !== i.unitPrice,
      );
      onHasPendingChanges?.(hasPending);
    }, [pendingQty, pendingPrice, items, onHasPendingChanges]);

    useImperativeHandle(ref, () => ({
      getItems: () => items,
      saveChanges: async () => {
        const changed = items.filter(
          (i) =>
            parseFloat(pendingQty[i.id] ?? String(i.quantity)) !== i.quantity ||
            parseFloat(pendingPrice[i.id] ?? String(i.unitPrice)) !== i.unitPrice,
        );
        if (changed.length === 0) return;
        await Promise.all(
          changed.map((i) =>
            updateQuoteItemService(quoteId, i.id, {
              quantity: parseFloat(pendingQty[i.id] ?? String(i.quantity)),
              unitPrice: parseFloat(pendingPrice[i.id] ?? String(i.unitPrice)),
            }),
          ),
        );
        loadItems();
        onItemsChanged?.();
      },
    }));

    const handleAdd = async (productId: string, quantity: number, unitPrice?: number) => {
      setIsAdding(true);
      setAddError(null);
      try {
        await addQuoteItemService(quoteId, { productId, quantity, unitPrice });
        loadItems();
        onItemsChanged?.();
      } catch (err: unknown) {
        setAddError(err instanceof Error ? err.message : "Error al agregar el producto");
      } finally {
        setIsAdding(false);
      }
    };

    const handleRemove = async (itemId: string) => {
      setRemovingId(itemId);
      try {
        await removeQuoteItemService(quoteId, itemId);
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        setPendingQty((prev) => { const next = { ...prev }; delete next[itemId]; return next; });
        setPendingPrice((prev) => { const next = { ...prev }; delete next[itemId]; return next; });
        onItemsChanged?.();
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setRemovingId(null);
      }
    };

    return (
      <>
      <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <Box className="flex items-center justify-between">
          <SectionTitle icon={<InventoryIcon fontSize="small" />}>Productos</SectionTitle>
          <Button
            variant="contained"
            startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            disabled={isAdding}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, whiteSpace: "nowrap", height: 36 }}
          >
            Agregar producto
          </Button>
        </Box>

        {addError && (
          <Alert severity="error" sx={{ fontSize: "0.8rem" }}>{addError}</Alert>
        )}

        {/* ── Tabla de ítems ── */}
        {isLoadingItems ? (
          <Box className="flex justify-center py-6">
            <CircularProgress size={24} />
          </Box>
        ) : loadError ? (
          <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
            {loadError}
          </Alert>
        ) : items.length === 0 ? (
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
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const currentQty = pendingQty[item.id] ?? String(item.quantity);
                  const isDirty = parseFloat(currentQty) !== item.quantity;
                  const subtotal = item.quantity * item.unitPrice;

                  const currentPrice = pendingPrice[item.id] ?? String(item.unitPrice);
                  const isPriceDirty = parseFloat(currentPrice) !== item.unitPrice;

                  return (
                    <TableRow key={item.id} hover sx={{ "& td": { fontSize: "0.82rem" } }}>
                      <TableCell sx={{ color: "text.secondary" }}>{item.product.reference ?? item.product.sku}</TableCell>
                      <TableCell>{item.product.name}</TableCell>

                      <TableCell align="right" sx={{ minWidth: 110 }}>
                        <NumericFormat
                          customInput={TextField}
                          size="small"
                          value={currentQty}
                          onValueChange={(v) =>
                            setPendingQty((prev) => ({ ...prev, [item.id]: v.value }))
                          }
                          decimalScale={2}
                          allowNegative={false}
                          isAllowed={({ floatValue }) => floatValue === undefined || floatValue > 0}
                          sx={{ width: 40 }}
                          slotProps={{
                            htmlInput: { style: { textAlign: "right", padding: "4px 8px" } },
                            input: {
                              sx: isDirty ? { "& fieldset": { borderColor: "primary.main" } } : undefined,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ minWidth: 120 }}>
                        <NumericFormat
                          customInput={TextField}
                          size="small"
                          value={currentPrice}
                          onValueChange={(v) =>
                            setPendingPrice((prev) => ({ ...prev, [item.id]: v.value }))
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
                      <TableCell align="right">{fmt(item.taxAmount)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{fmt(item.lineTotal)}</TableCell>
                      <TableCell align="right" padding="none">
                        <IconButton
                          size="small"
                          disabled={!clientId}
                          onClick={() => setHistoryItem({ productId: item.product.id, productName: item.product.name })}
                          title="Histórico de precios"
                        >
                          <History className="w-3.5 h-3.5" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" padding="none">
                        <IconButton
                          size="small"
                          color="error"
                          disabled={removingId === item.id}
                          onClick={() => handleRemove(item.id)}
                        >
                          {removingId === item.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
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
        onAdd={(result) => handleAdd(result.productId, result.quantity, result.unitPrice)}
        priceEditable
      />

      {clientId && historyItem && (
        <PriceHistoryDialog
          open={!!historyItem}
          onClose={() => setHistoryItem(null)}
          clientId={clientId}
          productId={historyItem.productId}
          productName={historyItem.productName}
        />
      )}
      </>
    );
  },
);

QuoteItemsSection.displayName = "QuoteItemsSection";

export default QuoteItemsSection;
