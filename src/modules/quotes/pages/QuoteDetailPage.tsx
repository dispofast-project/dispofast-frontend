import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  User,
  Hash,
  CalendarDays,
  ReceiptText,
  TrendingDown,
  Percent,
} from "lucide-react";

import { getQuoteByIdService } from "../api/quotes.api";
import { formatDate } from "../../../shared/utils/date";
import { formatCurrency } from "../../../shared/utils/currency";
import { QuoteStatusBadge } from "../components/QuoteStatusBadge";
import type { Quote } from "../types";

// TODO: Pagina Temporal

// ─── Sub-componentes Reutilizables (Extraídos para evitar re-renders) ───────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    className="text-gray-500 font-bold tracking-widest mb-2 block"
  >
    {children}
  </Typography>
);

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box className="flex items-start gap-3 py-3">
    <Box className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</Box>
    <Box>
      <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wider">
        {label}
      </Typography>
      <Typography variant="body2" className="font-medium mt-1 break-all">
        {value}
      </Typography>
    </Box>
  </Box>
);

const AmountRow = ({ label, value, bold, colorClass }: { label: React.ReactNode; value: string; bold?: boolean; colorClass?: string }) => (
  <Box className="flex justify-between items-center py-2.5">
    <Typography variant="body2" className={`${bold ? "font-bold" : "text-gray-500"} ${colorClass}`}>
      {label}
    </Typography>
    <Typography variant="body2" className={`tabular-nums ${bold ? "font-bold text-lg" : "font-medium"} ${colorClass}`}>
      {value}
    </Typography>
  </Box>
);

// ─── Página Principal ─────────────────────────────────────────────────────────

interface QuoteState {
  data: Quote | null;
  isLoading: boolean;
  error: string | null;
}

const QuoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Agrupamos el estado para evitar múltiples renders sincrónicos
  const [quoteState, setQuoteState] = useState<QuoteState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    // Marcamos inicio de carga
    setQuoteState(prev => ({ ...prev, isLoading: true, error: null }));

    getQuoteByIdService(id)
      .then((data) => {
        // Actualizamos todo de un solo golpe
        setQuoteState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        setQuoteState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Error al cargar la cotización.",
        });
      });
  }, [id]);

  // Desestructuramos para mantener limpio el código inferior
  const { data: quote, isLoading, error } = quoteState;

  // ... (formatters se mantienen igual)

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !quote) {
    return (
      <Box className="p-4">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Volver
        </Button>
        <Box className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error ?? "Cotización no encontrada."}
        </Box>
      </Box>
    );
  }
  return (
    <Box className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* ── Barra Superior ── */}
      <Box className="flex items-center gap-4 mb-8">
        <IconButton onClick={() => navigate(-1)} size="small" className="border border-gray-200 rounded-lg">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box className="flex-1">
          <Typography variant="h5" className="font-extrabold text-gray-900">
            {quote.number}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Creada el {formatDate(quote.createdAt)}
          </Typography>
        </Box>
        <QuoteStatusBadge status={quote.status} />
      </Box>

      {/* ── Grid de Información ── */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identificación */}
        <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>Identificación</SectionTitle>
          <DetailRow icon={<Hash size={16} />} label="No. Cotización" value={quote.number} />
          <Divider className="opacity-50" />
          <DetailRow icon={<User size={16} />} label="Asesor" value={quote.sellerName} />
        </Box>

        {/* Fechas */}
        <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>Fechas</SectionTitle>
          <DetailRow icon={<CalendarDays size={16} />} label="Expiración" value={formatDate(quote.expirationDate)} />
          <Divider className="opacity-50" />
          <DetailRow icon={<CalendarDays size={16} />} label="Última actualización" value={formatDate(quote.updatedAt)} />
        </Box>

        {/* Resumen Financiero */}
        <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
          <SectionTitle>Resumen Financiero</SectionTitle>
          <Box className="max-w-md">
            <AmountRow 
                label={<span className="flex items-center gap-2"><ReceiptText size={14}/> Subtotal</span>} 
                value={formatCurrency(quote.subtotalAmount)} 
            />
            <AmountRow 
                label={<span className="flex items-center gap-2"><TrendingDown size={14}/> Descuento</span>} 
                value={`- ${formatCurrency(quote.discountTotal)}`} 
                colorClass="text-green-600"
            />
            <AmountRow 
                label={<span className="flex items-center gap-2"><Percent size={14}/> IVA (19%)</span>} 
                value={formatCurrency(quote.taxTotal)} 
            />
            <Divider className="my-4" />
            <AmountRow 
                label="Total a Pagar" 
                value={formatCurrency(quote.totalAmount)} 
                bold 
                colorClass="text-dispofast-primary"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuoteDetailPage;