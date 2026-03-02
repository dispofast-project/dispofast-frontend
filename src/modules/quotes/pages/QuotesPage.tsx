import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getQuotesService, createQuoteService } from "../api/quotes.api";
import type { QuotePreview } from "../types";
import QuotesTable from "../components/QuotesTable";
import type { FilterConfig, FilterState } from "../../../shared/components/SearchBar/types";
import FilterSearchBar from "../../../shared/components/SearchBar/SearchBar";
import QuoteCreateModal from "../components/QuoteCreateModal";

/** Maps the FilterSearchBar scope value to the backend `key` query param. */
const SCOPE_TO_API_KEY: Record<string, string> = {
  sellerName: "seller",
  accountId: "account",
  number: "number",
};

const QUOTES_FILTER_CONFIGS: FilterConfig[] = [
  {
    type: "scoped-text",
    key: "search",
    label: "Buscar por",
    scopes: [
      { value: "sellerName", label: "Asesor" },
      { value: "accountId", label: "Cliente" },
      { value: "number", label: "No. Cotización" },
    ],
    debounceMs: 400,
  },
];

const QuotesPage = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<QuotePreview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchQuotes = async (page: number, text?: string, key?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Spring pages are 0-indexed
      const response = await getQuotesService(page - 1, ITEMS_PER_PAGE, text, key);
      setQuotes(response.content);
      setTotalItems(response.totalElements);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching quotes.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(currentPage, searchText, searchKey);
  }, [currentPage, searchText, searchKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownload = (quote: QuotePreview) => {
    console.log("Download quote:", quote.number);
  };

  const handleShowActions = (quote: QuotePreview) => {
    console.log("Show actions for quote:", quote.number);
  };

  const handleRowClick = (quote: QuotePreview) => {
    navigate(`/cotizaciones/${quote.id}`);
  };

  /**
   * Called every time the filter state changes (debounced for text input).
   * Extracts text + scope from the search filter and fires the API request.
   */
  const handleFilterChange = (state: FilterState) => {
    const searchFilter = state["search"];
    const term = searchFilter?.term?.trim() || undefined;
    const apiKey = searchFilter?.scope
      ? SCOPE_TO_API_KEY[searchFilter.scope]
      : undefined;

    setSearchText(term);
    setSearchKey(apiKey);
    setCurrentPage(1); // reset to first page on new search
  };

  const handleCreateQuote = async (accountId: string) => {
    const newQuote = await createQuoteService(accountId);
    navigate(`/cotizaciones/${newQuote.id}`);
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800">
            Cotizaciones
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Gestiona tus cotizaciones de venta
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Nueva Cotización
        </Button>
      </Box>

      {/* ── Filter Bar ── */}
      <FilterSearchBar
        configs={QUOTES_FILTER_CONFIGS}
        onChange={handleFilterChange}
        className="mb-4"
      />

      {error && (
        <Box className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</Box>
      )}

      {isLoading ? (
        <Box className="flex justify-center p-10">
          <Typography>Cargando cotizaciones...</Typography>
        </Box>
      ) : (
        <QuotesTable
          quotes={quotes}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onDownload={handleDownload}
          onShowActions={handleShowActions}
          onRowClick={handleRowClick}
        />
      )}
      
      <QuoteCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuote}
      />
    </Box>
  );
};

export default QuotesPage;
