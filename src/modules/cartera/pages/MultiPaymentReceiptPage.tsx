import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircle, Paperclip, XCircle } from "lucide-react";
import type { ArEntry, PaymentMethod, PromptPaymentDiscountRate } from "../types";
import type { SalesOrder } from "../../orders/types";
import { createMultiInvoicePayment, uploadPaymentVoucher } from "../api/cartera.service";
import { getOrderById } from "../../orders/api/order.service";
import { useNotificationStore } from "../../../shared/store/notification.store";
import { Button } from "../../../shared/components/Button/Button";
import ReceiptHeader from "../components/ReceiptHeader/ReceiptHeader";

const fmt = (v: number) => `$${v.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

interface InvoiceVoucherUploadProps {
  fileName: string | null;
  uploading: boolean;
  invalid: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}

const InvoiceVoucherUpload = ({
  fileName,
  uploading,
  invalid,
  onUpload,
  onClear,
}: InvoiceVoucherUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Box className="flex flex-col gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      {fileName ? (
        <Box className="flex items-center justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
          <Box className="flex items-center gap-2 min-w-0">
            <CheckCircle size={14} className="text-green-600 shrink-0" />
            <Typography variant="caption" className="text-green-700 truncate">
              {fileName}
            </Typography>
          </Box>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <XCircle size={14} />
          </button>
        </Box>
      ) : (
        <Button
          variant="secondary"
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-2 !py-1.5 !text-xs w-fit"
        >
          <Paperclip size={14} />
          {uploading ? "Subiendo..." : "Adjuntar comprobante"}
        </Button>
      )}
      {invalid && !fileName && (
        <Typography variant="caption" className="text-red-500">
          Falta el comprobante de este pago
        </Typography>
      )}
    </Box>
  );
};

const MultiPaymentReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotificationStore();

  const entries: ArEntry[] = location.state?.entries ?? [];

  useEffect(() => {
    if (entries.length < 2) navigate("/cartera", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Oldest invoice first (FIFO).
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(a.invoiceDate ?? 0).getTime() - new Date(b.invoiceDate ?? 0).getTime()
      ),
    [entries]
  );

  const client = sortedEntries[0];
  const totalBalance = sortedEntries.reduce((s, e) => s + e.balance, 0);

  // ── Pre-tax subtotal per invoice (base of the prompt-payment discount) ─────
  const [subtotals, setSubtotals] = useState<Record<string, number>>({});
  useEffect(() => {
    if (sortedEntries.length === 0) return;
    let cancelled = false;
    Promise.allSettled(
      sortedEntries.map((e) => (e.orderId ? getOrderById(e.orderId) : Promise.resolve(null)))
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, number> = {};
      results.forEach((r, i) => {
        if (r.status === "fulfilled" && r.value) {
          const order = r.value as SalesOrder;
          map[sortedEntries[i].id] = (order.items ?? []).reduce((s, it) => s + it.lineTotal, 0);
        }
      });
      setSubtotals(map);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedEntries.map((e) => e.id).join(",")]);

  // ── Discount (applies uniformly, computed per invoice's own subtotal) ─────
  const [discountRate, setDiscountRate] = useState<PromptPaymentDiscountRate | undefined>(
    undefined
  );
  const discountFor = (entryId: string) =>
    discountRate ? (subtotals[entryId] ?? 0) * (discountRate / 100) : 0;
  const totalDiscount = sortedEntries.reduce((s, e) => s + discountFor(e.id), 0);

  // ── Allocation (cash portion per invoice) ─────────────────────────────────
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const handleAllocationChange = (id: string, raw: string) => {
    setAllocations((prev) => {
      const next = { ...prev };
      if (raw === "") {
        delete next[id];
      } else {
        next[id] = Number(raw);
      }
      return next;
    });
  };

  const allocatedCash = Object.values(allocations).reduce((s, v) => s + (v || 0), 0);

  // ── Shared payment metadata ────────────────────────────────────────────────
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CAJA");
  const [documentNumber, setDocumentNumber] = useState("");
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Voucher (one per invoice — every payment must have its own proof) ────
  const [voucherKeys, setVoucherKeys] = useState<Record<string, string>>({});
  const [voucherNames, setVoucherNames] = useState<Record<string, string>>({});
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

  const handleVoucherUpload = async (entryId: string, file: File) => {
    setUploadingIds((prev) => new Set(prev).add(entryId));
    try {
      const key = await uploadPaymentVoucher(file);
      setVoucherKeys((prev) => ({ ...prev, [entryId]: key }));
      setVoucherNames((prev) => ({ ...prev, [entryId]: file.name }));
    } catch {
      showNotification("No se pudo subir el comprobante", "error");
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    }
  };

  const handleVoucherClear = (entryId: string) => {
    setVoucherKeys((prev) => {
      const next = { ...prev };
      delete next[entryId];
      return next;
    });
    setVoucherNames((prev) => {
      const next = { ...prev };
      delete next[entryId];
      return next;
    });
  };

  if (!client) return null;

  const rowExceedsBalance = (entry: ArEntry) =>
    (allocations[entry.id] || 0) + discountFor(entry.id) > entry.balance + 0.01;

  const anyRowInvalid = sortedEntries.some(rowExceedsBalance);
  const rowsWithPayment = sortedEntries.filter((e) => (allocations[e.id] || 0) > 0);
  const missingVoucher = rowsWithPayment.some((e) => !voucherKeys[e.id]);
  const canSubmit =
    !!paymentDate &&
    !anyRowInvalid &&
    !missingVoucher &&
    allocatedCash + totalDiscount > 0 &&
    !submitting;

  const handleSubmit = async () => {
    if (!client.clientId) {
      showNotification("No se pudo determinar el cliente de estas facturas", "error");
      return;
    }

    if (rowsWithPayment.length === 0) {
      showNotification("Asigna un valor a al menos una factura", "error");
      return;
    }

    if (missingVoucher) {
      showNotification("Adjunta el comprobante de pago de cada factura", "error");
      return;
    }

    const allocationPayload = rowsWithPayment.map((e) => ({
      arEntryId: e.id,
      value: allocations[e.id],
      promptPaymentDiscountRate: discountRate,
      voucherS3Key: voucherKeys[e.id],
    }));

    setSubmitting(true);
    try {
      await createMultiInvoicePayment({
        clientId: client.clientId,
        paymentDate,
        paymentMethod,
        documentNumber: documentNumber || undefined,
        observations: observations || undefined,
        allocations: allocationPayload,
      });
      showNotification("Pago combinado registrado exitosamente", "success");
      navigate("/cartera");
    } catch (error: any) {
      showNotification(`No se pudo registrar el pago: ${error.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col gap-6 pb-8">
      <ReceiptHeader
        clientName={client.clientName}
        clientIdentification={client.clientIdentification}
        receiptRef={`${sortedEntries.length} facturas`}
      />

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: invoice allocation table */}
        <Box className="lg:col-span-2 flex flex-col gap-4">
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <Typography variant="body1" className="font-bold text-gray-800">
                Facturas seleccionadas
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Saldo total: {fmt(totalBalance)}
              </Typography>
            </Box>

            <Box className="flex flex-col">
              {sortedEntries.map((entry) => {
                const discount = discountFor(entry.id);
                const invalid = rowExceedsBalance(entry);
                const hasPayment = (allocations[entry.id] || 0) > 0;
                const voucherMissing = hasPayment && !voucherKeys[entry.id];
                return (
                  <Box
                    key={entry.id}
                    className="px-5 py-3 flex flex-col gap-2 border-b border-gray-50 last:border-b-0"
                  >
                    <Box className="flex items-center gap-3">
                      <Box className="flex-1 min-w-0">
                        <Typography variant="body2" className="font-medium text-gray-800 truncate">
                          Factura {entry.invoiceNumber ?? "-"} · Orden {entry.orderNumber ?? "-"}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          Saldo: {fmt(entry.balance)}
                          {discount > 0 && ` · Descuento: -${fmt(discount)}`}
                        </Typography>
                      </Box>
                      <TextField
                        type="number"
                        size="small"
                        label="Valor asignado"
                        placeholder="0"
                        sx={{ width: 160 }}
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        value={allocations[entry.id] ?? ""}
                        error={invalid}
                        helperText={invalid ? "Supera el saldo" : undefined}
                        onChange={(e) => handleAllocationChange(entry.id, e.target.value)}
                      />
                    </Box>

                    {hasPayment && (
                      <InvoiceVoucherUpload
                        fileName={voucherNames[entry.id] ?? null}
                        uploading={uploadingIds.has(entry.id)}
                        invalid={voucherMissing}
                        onUpload={(file) => handleVoucherUpload(entry.id, file)}
                        onClear={() => handleVoucherClear(entry.id)}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Right: payment metadata + summary */}
        <Box className="lg:col-span-1 sticky top-4 flex flex-col gap-4">
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="px-5 py-4 border-b border-gray-100">
              <Typography variant="body1" className="font-bold text-gray-800">
                Resumen
              </Typography>
            </Box>
            <Box className="px-5 py-4 flex flex-col gap-2">
              <Box className="flex items-center justify-between">
                <Typography variant="body2" className="text-gray-500">
                  Efectivo asignado
                </Typography>
                <Typography variant="body2" className="font-medium text-gray-700">
                  {fmt(allocatedCash)}
                </Typography>
              </Box>
              {totalDiscount > 0 && (
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">
                    Descuento pronto pago
                  </Typography>
                  <Typography variant="body2" className="font-medium text-green-600">
                    -{fmt(totalDiscount)}
                  </Typography>
                </Box>
              )}
              <Divider />
              <Box className="flex items-center justify-between">
                <Typography variant="body2" className="font-bold text-gray-800">
                  Saldo restante total
                </Typography>
                <Typography
                  variant="body2"
                  className="font-bold"
                  sx={{
                    color:
                      totalBalance - allocatedCash - totalDiscount <= 0
                        ? "success.main"
                        : "var(--dispofast-primary)",
                  }}
                >
                  {fmt(Math.max(0, totalBalance - allocatedCash - totalDiscount))}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="px-5 py-4 border-b border-gray-100">
              <Typography variant="body1" className="font-bold text-gray-800">
                Datos del pago
              </Typography>
            </Box>
            <Box className="px-5 py-4 flex flex-col gap-4">
              <Box className="grid grid-cols-2 gap-3">
                <TextField
                  label="Documento"
                  size="small"
                  fullWidth
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
                <TextField
                  label="Fecha de pago"
                  type="date"
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </Box>

              <Divider />

              <FormControl>
                <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}>
                  Método de pago
                </FormLabel>
                <RadioGroup
                  row
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  <FormControlLabel
                    value="CAJA"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Caja</Typography>}
                  />
                  <FormControlLabel
                    value="TRANSFERENCIA"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Transferencia</Typography>}
                  />
                </RadioGroup>
              </FormControl>

              <FormControl size="small" fullWidth>
                <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}>
                  Descuento por pronto pago
                </FormLabel>
                <Select
                  displayEmpty
                  value={discountRate ?? ""}
                  onChange={(e) =>
                    setDiscountRate(
                      e.target.value === "" ? undefined : (Number(e.target.value) as PromptPaymentDiscountRate)
                    )
                  }
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  <MenuItem value={2}>2%</MenuItem>
                  <MenuItem value={3}>3%</MenuItem>
                  <MenuItem value={5}>5%</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="caption" className="text-gray-400 -mt-2">
                El comprobante de cada pago se adjunta junto a su factura, en la lista de la
                izquierda.
              </Typography>

              <TextField
                label="Observaciones"
                multiline
                rows={3}
                size="small"
                fullWidth
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Box>

            <Box className="px-5 pb-5 flex flex-col gap-2">
              <Button
                variant="primary"
                type="button"
                isLoading={submitting}
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-full justify-center"
              >
                Confirmar pago combinado
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate("/cartera")}
                disabled={submitting}
                className="w-full justify-center"
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MultiPaymentReceiptPage;
