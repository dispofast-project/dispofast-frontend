import { Box, Divider, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Eye, ShoppingCart, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { QuotePreview } from "../types";
import { QuoteStatus } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatCurrency } from "../../../shared/utils/currency";
import { QuoteStatusBadge } from "./QuoteStatusBadge";

interface QuotesTableProps {
  quotes: QuotePreview[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onDownload: (quote: QuotePreview) => void;
  onShowActions: (quote: QuotePreview) => void;
  onRowClick: (quote: QuotePreview) => void;
  onCreateOrder: (quote: QuotePreview) => void;
  onChangeStatus: (quote: QuotePreview, status: string) => void;
}

const QuotesTable = ({
  quotes,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onRowClick,
  onCreateOrder,
  onChangeStatus,
}: QuotesTableProps) => {

  const headers = [
    "Estado",
    "No. Cotización",
    "Cliente",
    "Asesor",
    "Fecha",
    "Total",
  ];

  const renderRow = (quote: QuotePreview) => {
    return [
      <QuoteStatusBadge
        key={`status-${quote.id}`}
        status={quote.status}
      />,

      <span className="font-medium text-gray-900">{quote.number}</span>,

      <span key={`client-${quote.id}`}>
        {quote.accountName}
        {quote.prospect && (
          <span className="block text-xs font-bold text-orange-500 uppercase tracking-wide">
            Prospecto
          </span>
        )}
      </span>,

      quote.seller?.fullName ?? "-",

      new Date(quote.createdAt).toLocaleDateString("es-CO"),

      <span className="font-mono text-right">
        {formatCurrency(quote.total)}
      </span>,
    ];
  };

  const STATUS_OPTIONS = [
    { value: QuoteStatus.PENDING,  label: "Pendiente", icon: <Clock size={15} className="text-orange-500" /> },
    { value: QuoteStatus.ACCEPTED, label: "Aprobada",  icon: <CheckCircle size={15} className="text-green-600" /> },
    { value: QuoteStatus.REJECTED, label: "Rechazada", icon: <XCircle size={15} className="text-red-500" /> },
    { value: QuoteStatus.EXPIRED,  label: "Caducada",  icon: <AlertCircle size={15} className="text-gray-500" /> },
  ];

  const optionsMenu = (quote: QuotePreview, closeMenu: () => void) => (
    <>
      <MenuItem onClick={() => { closeMenu(); onRowClick(quote); }}>
        <ListItemIcon><Eye size={16} /></ListItemIcon>
        Ver cotización
      </MenuItem>
      <MenuItem onClick={() => { closeMenu(); onCreateOrder(quote); }}>
        <ListItemIcon><ShoppingCart size={16} /></ListItemIcon>
        Crear orden
      </MenuItem>
      <Divider />
      <Typography variant="caption" className="px-4 py-1 text-gray-400 font-semibold uppercase tracking-wide block">
        Cambiar estado
      </Typography>
      {STATUS_OPTIONS.filter((s) => s.value !== quote.status).map((s) => (
        <MenuItem key={s.value} onClick={() => { closeMenu(); onChangeStatus(quote, s.value); }}>
          <ListItemIcon>{s.icon}</ListItemIcon>
          {s.label}
        </MenuItem>
      ))}
    </>
  );

  return (
    <Box className="w-full">
      <CustomTable
        headers={headers}
        data={quotes}
        renderRow={renderRow}
        onRowClick={onRowClick}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
        optionsMenu={optionsMenu}
      />
    </Box>
  );
};

export default QuotesTable;
