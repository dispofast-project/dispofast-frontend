import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Button } from "../Button/Button";
import { getClientProductPriceHistoryService } from "../../../modules/clients/api/clients.api";
import type { PriceHistoryEntry } from "../../../modules/clients/types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

interface PriceHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  productId: string;
  productName?: string;
}

const PriceHistoryDialog = ({
  open,
  onClose,
  clientId,
  productId,
  productName,
}: PriceHistoryDialogProps) => {
  const [entries, setEntries] = useState<PriceHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError(null);
    getClientProductPriceHistoryService(clientId, productId)
      .then(setEntries)
      .catch(() => setError("No se pudo cargar el histórico de precios."))
      .finally(() => setIsLoading(false));
  }, [open, clientId, productId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold">
        Histórico de precios{productName ? ` — ${productName}` : ""}
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-3 pt-1">
          {isLoading && (
            <Box className="flex justify-center py-8">
              <CircularProgress size={28} />
            </Box>
          )}

          {!isLoading && error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <Typography variant="body2" color="text.secondary" className="py-6 text-center">
              Sin historial previo con este cliente para este producto.
            </Typography>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Origen</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Precio Unit.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={entry.source === "ORDER" ? "Orden" : "Cotización"}
                        size="small"
                        color={entry.source === "ORDER" ? "primary" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{entry.documentNumber}</TableCell>
                    <TableCell align="right">{entry.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(entry.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceHistoryDialog;
