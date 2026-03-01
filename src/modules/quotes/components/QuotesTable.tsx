import { Box } from "@mui/material";
import type { QuotePreview } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatDate } from "../../../shared/utils/date";
import { QuoteStatusBadge } from "../components/QuoteStatusBadge"; // <-- Importamos tu nuevo componente
import { formatCurrency } from "../../../shared/utils/currency";

interface QuotesTableProps {
  quotes: QuotePreview[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onDownload: (quote: QuotePreview) => void;
  onShowActions: (quote: QuotePreview) => void;
  onRowClick: (quote: QuotePreview) => void;
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
    "Validez",
  ];

  const renderRow = (quote: QuotePreview) => {
    return [
      <QuoteStatusBadge status={quote.status} />,
      
      <span className="font-medium text-gray-900">{quote.number}</span>,
      quote.accountName,
      quote.seller?.fullName ?? "-",
      
      formatDate(quote.createdAt),
      
      <span className="font-mono text-right">
        {formatCurrency(quote.total)}
      </span>,
      
      formatDate(quote.expirationDate),
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