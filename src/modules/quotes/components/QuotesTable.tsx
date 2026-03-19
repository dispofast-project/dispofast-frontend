import { Box, IconButton, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import type { QuotePreview } from "../types";
import { QuoteStatus } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatCurrency } from "../../../shared/utils/currency";
import { formatDate } from "../../../shared/utils/date";
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
  onCreateOrder,
}: QuotesTableProps) => {

  const headers = [
    "Estado",
    "No. Cotización",
    "Cliente",
    "Asesor",
    "Fecha",
    "Total",
    "Validez",
    "Acciones",
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

      formatDate(quote.createdAt),

      <span className="font-mono text-right">
        {formatCurrency(quote.total)}
      </span>,

      formatDate(quote.expirationDate),

      quote.status === QuoteStatus.ACCEPTED ? (
        <Tooltip title="Convertir a Orden de Compra" arrow>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onCreateOrder(quote);
            }}
          >
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <span />
      ),
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
