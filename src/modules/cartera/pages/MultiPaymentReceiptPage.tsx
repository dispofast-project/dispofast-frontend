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
import { CheckCircle, Paperclip, Shuffle, XCircle } from "lucide-react";
import type { ArEntry, PaymentMethod, PromptPaymentDiscountRate } from "../types";
import type { SalesOrder } from "../../orders/types";
import { createMultiInvoicePayment, uploadPaymentVoucher } from "../api/cartera.service";
import { getOrderById } from "../../orders/api/order.service";
import { useNotificationStore } from "../../../shared/store/notification.store";
import { Button } from "../../../shared/components/Button/Button";
import ReceiptHeader from "../components/ReceiptHeader/ReceiptHeader";

const fmt = (v: number) => `$${v.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

const MultiPaymentReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotificationStore();

  const entries: ArEntry[] = location.state?.entries ?? [];

  useEffect(() => {
    if (entries.length < 2) navigate("/cartera", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Oldest invoice first (FIFO), matches how the auto-distribution fills balances.
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
  const [totalPayment, setTotalPayment] = useState<number | "">("");
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const distributeFifo = () => {
    let remaining = typeof totalPayment === "number" ? totalPayment : 0;
    const next: Record<string, number> = {};
    for (const e of sortedEntries) {
      const targetCash = Math.max(0, e.balance - discountFor(e.id));
      const take = Math.max(0, Math.min(targetCash, remaining));
      next[e.id] = Math.round(take * 100) / 100;
      remaining -= take;
    }
    setAllocations(next);
  };

  const handleAllocationChange = (id: string, value: number) => {
    setAllocations((prev) => ({ ...prev, [id]: value }));
  };

  const allocatedCash = Object.values(allocations).reduce((s, v) => s + (v || 0), 0);

  // ── Shared payment metadata ────────────────────────────────────────────────
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CAJA");
  const [documentNumber, setDocumentNumber] = useState("");
  const [observations, setObservations] = useState("");
  const [voucherS3Key, setVoucherS3Key] = useState("");
  const [voucherFileName, setVoucherFileName] = useState<string | null>(null);
  const [uploadingVoucher, setUploadingVoucher] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVoucher(true);
    try {
      const key = await uploadPaymentVoucher(file);
      setVoucherS3Key(key);
      setVoucherFileName(file.name);
    } catch {
      showNotification("No se pudo subir el comprobante", "error");
    } finally {
      setUploadingVoucher(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!client) return null;

  const rowExceedsBalance = (entry: ArEntry) =>
    (allocations[entry.id] || 0) + discountFor(entry.id) > entry.balance + 0.01;

  const anyRowInvalid = sortedEntries.some(rowExceedsBalance);
  const canSubmit =
    !!paymentDate &&
    !!voucherS3Key &&
    !anyRowInvalid &&
    allocatedCash + totalDiscount > 0 &&
    !submitting;

  const handleSubmit = async () => {
    if (!client.clientId) {
      showNotification("No se pudo determinar el cliente de estas facturas", "error");
      return;
    }

    const allocationPayload = sortedEntries
      .filter((e) => (allocations[e.id] || 0) > 0)
      .map((e) => ({
        arEntryId: e.id,
        value: allocations[e.id],
        promptPaymentDiscountRate: discountRate,
      }));

    if (allocationPayload.length === 0) {
      showNotification("Asigna un valor a al menos una factura", "error");
      return;
    }

    setSubmitting(true);
    try {
      await createMultiInvoicePayment({
        clientId: client.clientId,
        paymentDate,
        paymentMethod,
        documentNumber: documentNumber || undefined,
        voucherS3Key,
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

            <Box className="px-5 py-4 flex flex-col gap-3">
              <Box className="flex items-end gap-3">
                <TextField
                  label="Valor total recibido"
                  type="number"
                  size="small"
                  fullWidth
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  value={totalPayment}
                  onChange={(e) =>
                    setTotalPayment(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={distributeFifo}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Shuffle size={16} />
                  Distribuir (más antigua primero)
                </Button>
              </Box>
              <Typography variant="caption" className="text-gray-400">
                Distribuye automáticamente el valor entre las facturas, empezando por la más
                antigua. Puedes ajustar cada valor manualmente después. Si cambias el % de pronto
                pago, vuelve a distribuir.
              </Typography>
            </Box>

            <Divider />

            <Box className="flex flex-col">
              {sortedEntries.map((entry) => {
                const discount = discountFor(entry.id);
                const invalid = rowExceedsBalance(entry);
                return (
                  <Box
                    key={entry.id}
                    className="px-5 py-3 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                  >
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
                      sx={{ width: 160 }}
                      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                      value={allocations[entry.id] ?? 0}
                      error={invalid}
                      helperText={invalid ? "Supera el saldo" : undefined}
                      onChange={(e) => handleAllocationChange(entry.id, Number(e.target.value))}
                    />
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

              <Box className="flex flex-col gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {voucherFileName ? (
                  <Box className="flex items-center justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <Box className="flex items-center gap-2 min-w-0">
                      <CheckCircle size={16} className="text-green-600 shrink-0" />
                      <Typography variant="body2" className="text-green-700 truncate">
                        {voucherFileName}
                      </Typography>
                    </Box>
                    <button
                      type="button"
                      onClick={() => {
                        setVoucherS3Key("");
                        setVoucherFileName(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 shrink-0"
                    >
                      <XCircle size={16} />
                    </button>
                  </Box>
                ) : (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={uploadingVoucher}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-center gap-2"
                  >
                    <Paperclip size={16} />
                    {uploadingVoucher ? "Subiendo..." : "Adjuntar comprobante"}
                  </Button>
                )}
              </Box>

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
