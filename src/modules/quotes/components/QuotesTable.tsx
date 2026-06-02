import { Box, ListItemIcon, MenuItem } from "@mui/material";
import { Eye, ShoppingCart } from "lucide-react";
import type { QuotePreview } from "../types";
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
}

const QuotesTable = ({
  quotes,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onRowClick,
  onCreateOrder,
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
      quote.accountName,
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
