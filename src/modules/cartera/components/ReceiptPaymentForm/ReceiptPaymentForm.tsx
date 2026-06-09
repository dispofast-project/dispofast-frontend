import {
  Box,
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../../shared/components/Button/Button";

// ── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  documentNumber: z.string().optional(),
  paymentDate: z.string().min(1, "La fecha de pago es obligatoria"),
  value: z.coerce
    .number({ invalid_type_error: "El valor debe ser un número" })
    .positive("El valor debe ser mayor a 0"),
  paymentMethod: z.enum(["CAJA", "TRANSFERENCIA"] as const, {
    required_error: "El método de pago es obligatorio",
  }),
  observations: z.string().optional(),
});

export type ReceiptFormValues = z.infer<typeof schema>;

// ── Component ────────────────────────────────────────────────────────────────

interface ReceiptPaymentFormProps {
  onSubmit: (values: ReceiptFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ReceiptPaymentForm = ({
  onSubmit,
  onCancel,
  isLoading,
}: ReceiptPaymentFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "CAJA" },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
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
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          {...register("value")}
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
