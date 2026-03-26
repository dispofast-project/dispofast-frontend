import { Box } from "@mui/material";
import type { QuotePreview } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatCurrency } from "../../../shared/utils/currency";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { QUOTE_STATUS_CONFIG } from "../config/statusConfig";

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
      <StatusBadge
        key={`status-${quote.id}`}
        status={quote.status}
        configMap={QUOTE_STATUS_CONFIG}
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
      />
    </Box>
  );
};

export default QuotesTable;
