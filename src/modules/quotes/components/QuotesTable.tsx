import { Box, Divider, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Eye, ShoppingCart } from "lucide-react";
import type { QuotePreview } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatCurrency } from "../../../shared/utils/currency";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
import { QUOTE_STATUS_UI } from "../constants";

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
  onChangeStatus?: (quoteId: string, newStatus: string) => void;
}

const STATUS_OPTIONS = Object.entries(QUOTE_STATUS_UI).map(([value, config]) => ({
  value,
  label: config.label,
  colorClass: config.colorClass,
}));

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

      {onChangeStatus && (
        <>
          <Divider sx={{ my: 0.5 }} />
          <Typography variant="caption" sx={{ px: 2, py: 0.5, color: "text.secondary", display: "block" }}>
            Cambiar estado
          </Typography>
          {STATUS_OPTIONS.filter((opt) => opt.value !== quote.status).map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => {
                closeMenu();
                onChangeStatus(quote.id, opt.value);
              }}
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${opt.colorClass}`}>
                {opt.label}
              </span>
            </MenuItem>
          ))}
        </>
      )}
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
