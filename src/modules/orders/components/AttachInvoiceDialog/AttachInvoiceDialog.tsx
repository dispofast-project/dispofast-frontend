import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface AttachInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  invoiceNumber: string;
  onInvoiceNumberChange: (v: string) => void;
  invoiceFile: File | null;
  onInvoiceFileChange: (f: File | null) => void;
  isLoading: boolean;
  error: string | null;
}

const AttachInvoiceDialog = ({
  open,
  onClose,
  onSubmit,
  invoiceNumber,
  onInvoiceNumberChange,
  invoiceFile,
  onInvoiceFileChange,
  isLoading,
  error,
}: AttachInvoiceDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle className="text-base font-semibold">Adjuntar factura</DialogTitle>

    <DialogContent className="flex flex-col gap-4 pt-2">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <TextField
        label="Número de factura"
        value={invoiceNumber}
        onChange={(e) => onInvoiceNumberChange(e.target.value)}
        size="small"
        fullWidth
        disabled={isLoading}
        inputProps={{ maxLength: 50 }}
      />
      <Box>
        <p className="text-xs font-medium text-gray-500 mb-1">Archivo PDF</p>
        <input
          type="file"
          accept="application/pdf"
          disabled={isLoading}
          onChange={(e) => onInvoiceFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {invoiceFile && (
          <p className="text-xs text-gray-400 mt-1 truncate">{invoiceFile.name}</p>
        )}
      </Box>
    </DialogContent>

    <DialogActions className="px-6 pb-4 gap-2">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        onClick={onSubmit}
        disabled={isLoading || !invoiceNumber.trim() || !invoiceFile}
        className="px-4 py-2 rounded-md text-sm text-white bg-dispofast-primary hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
      >
        {isLoading && <CircularProgress size={12} color="inherit" />}
        Guardar
      </button>
    </DialogActions>
  </Dialog>
);

export default AttachInvoiceDialog;
