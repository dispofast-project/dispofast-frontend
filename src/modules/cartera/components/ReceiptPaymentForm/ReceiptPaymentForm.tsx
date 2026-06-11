import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircle, Paperclip, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../../shared/components/Button/Button";
import { uploadPaymentVoucher } from "../../api/cartera.service";


const schema = z.object({
  documentNumber: z.string().optional(),
  paymentDate: z.string().min(1, "La fecha de pago es obligatoria"),
  value: z.number({ error: "El valor debe ser un número" }).positive("El valor debe ser mayor a 0"),
  paymentMethod: z.enum(["CAJA", "TRANSFERENCIA"], {
    error: "El método de pago es obligatorio",
  }),
  voucherS3Key: z.string().min(1, "El comprobante de pago es obligatorio"),
  observations: z.string().optional(),
});

export type ReceiptFormValues = z.infer<typeof schema>;



interface ReceiptPaymentFormProps {
  onSubmit: (values: ReceiptFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  onValueChange?: (v: number) => void;
}

const ReceiptPaymentForm = ({
  onSubmit,
  onCancel,
  isLoading,
  onValueChange,
}: ReceiptPaymentFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "CAJA" },
  });

  const typedValue = watch("value");
  useEffect(() => {
    onValueChange?.(Number.isFinite(typedValue) && typedValue > 0 ? typedValue : 0);
  }, [typedValue]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVoucher, setUploadingVoucher] = useState(false);
  const [voucherFileName, setVoucherFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVoucher(true);
    setUploadError(null);
    try {
      const key = await uploadPaymentVoucher(file);
      setValue("voucherS3Key", key, { shouldValidate: true });
      setVoucherFileName(file.name);
    } catch {
      setUploadError("No se pudo subir el archivo. Intenta de nuevo.");
    } finally {
      setUploadingVoucher(false);
      // Reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveVoucher = () => {
    setValue("voucherS3Key", "", { shouldValidate: true });
    setVoucherFileName(null);
    setUploadError(null);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Hidden input wired to RHF — validated by Zod */}
      <input type="hidden" {...register("voucherS3Key")} />

      <Box className="px-5 py-4 border-b border-gray-100">
        <Typography variant="body1" className="font-bold text-gray-800">
          Pagos
        </Typography>
      </Box>

      <Box className="px-5 py-4 flex flex-col gap-4">
        <Box className="grid grid-cols-2 gap-3">
          <TextField
            label="Documento"
            size="small"
            fullWidth
            {...register("documentNumber")}
            error={!!errors.documentNumber}
            helperText={errors.documentNumber?.message}
          />
          <TextField
            label="Fecha de pago"
            type="date"
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("paymentDate")}
            error={!!errors.paymentDate}
            helperText={errors.paymentDate?.message}
          />
        </Box>

        <TextField
          label="Valor"
          type="number"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          {...register("value", { valueAsNumber: true })}
          error={!!errors.value}
          helperText={errors.value?.message}
        />

        <Divider />

        <FormControl error={!!errors.paymentMethod}>
          <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}>
            Método de pago
          </FormLabel>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
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
            )}
          />
          {errors.paymentMethod && (
            <FormHelperText>{errors.paymentMethod.message}</FormHelperText>
          )}
        </FormControl>

        {/* Voucher upload */}
        <Box className="flex flex-col gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {voucherFileName ? (
            <Box
              className="flex items-center justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"
            >
              <Box className="flex items-center gap-2 min-w-0">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <Typography
                  variant="body2"
                  className="text-green-700 truncate"
                  title={voucherFileName}
                >
                  {voucherFileName}
                </Typography>
              </Box>
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <XCircle size={16} />
              </button>
            </Box>
          ) : (
            <Button
              variant="secondary"
              type="button"
              disabled={uploadingVoucher || isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full justify-center gap-2"
            >
              {uploadingVoucher ? (
                <CircularProgress size={16} />
              ) : (
                <Paperclip size={16} />
              )}
              <Typography variant="body2" className="font-medium">
                {uploadingVoucher ? "Subiendo..." : "Adjuntar comprobante"}
              </Typography>
            </Button>
          )}

          {errors.voucherS3Key && (
            <FormHelperText error>{errors.voucherS3Key.message}</FormHelperText>
          )}
          {uploadError && (
            <FormHelperText error>{uploadError}</FormHelperText>
          )}
        </Box>

        <TextField
          label="Observaciones"
          multiline
          rows={3}
          size="small"
          fullWidth
          {...register("observations")}
        />
      </Box>

      <Box className="px-5 pb-5 flex flex-col gap-2">
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          className="w-full justify-center"
        >
          Confirmar
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full justify-center"
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default ReceiptPaymentForm;
