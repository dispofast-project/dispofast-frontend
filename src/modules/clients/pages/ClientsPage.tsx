import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getClientsService } from "../api/clients.api";
import type { ClientPreview } from "../types";
import ClientsTable from "../components/ClientsTable";
import type { FilterConfig, FilterState } from "../../../shared/components/SearchBar/types";
import FilterSearchBar from "../../../shared/components/SearchBar/SearchBar";

const SCOPE_TO_API_KEY: Record<string, string> = {
  name: "text", // The backend takes 'text' for searching generic text which often targets names/ids
  identificationNumber: "key", // Depending on backend, 'key' might be used for identification. We map based on standard usage
};

const CLIENTS_FILTER_CONFIGS: FilterConfig[] = [
  {
    type: "scoped-text",
    key: "search",
    label: "Buscar por",
    scopes: [
      { value: "name", label: "Nombre" },
      { value: "identificationNumber", label: "Identificación" },
    ],
    debounceMs: 400,
  },
];

const ClientsPage = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientPreview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);

  const ITEMS_PER_PAGE = 10;

  const fetchClients = async (page: number, text?: string, key?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Spring pages are 0-indexed
      const response = await getClientsService(page - 1, ITEMS_PER_PAGE, text, key);
      setClients(response.content);
      setTotalItems(response.totalElements);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching clients.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, searchText, searchKey);
  }, [currentPage, searchText, searchKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (client: ClientPreview) => {
    navigate(`/clientes/${client.id}`);
  };

  const handleFilterChange = (state: FilterState) => {
    const searchFilter = state["search"];
    const term = searchFilter?.term?.trim() || undefined;
    const scope = searchFilter?.scope;
    
    // Simplistic mapping: if searching by identification, put the term in 'text' and 'key' in key.
    // If backend searches globally by 'text', we just pass term as 'text' and scope as 'key'.
    setSearchText(term);
    setSearchKey(scope ? SCOPE_TO_API_KEY[scope] : undefined);
    setCurrentPage(1); // reset to first page on new search
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800">
            Clientes
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Gestiona el portafolio de clientes y prospectos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log("Open create client modal/page");
          }}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* ── Filter Bar ── */}
      <FilterSearchBar
        configs={CLIENTS_FILTER_CONFIGS}
        onChange={handleFilterChange}
        className="mb-4"
      />

      {error && (
        <Box className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</Box>
      )}

      {isLoading ? (
        <Box className="flex justify-center p-10">
          <Typography>Cargando clientes...</Typography>
        </Box>
      ) : (
        <ClientsTable
          clients={clients}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}
    </Box>
  );
};

export default ClientsPage;
