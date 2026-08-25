import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getPurchaseOrdersService } from "../api/purchases.api";
import type { PurchaseOrderPreview } from "../types";
import PurchaseOrdersTable from "../components/PurchaseOrdersTable";
import type { FilterConfig, FilterState } from "../../../shared/components/SearchBar/types";
import FilterSearchBar from "../../../shared/components/SearchBar/SearchBar";
import PurchaseOrderCreateModal from "../components/PurchaseOrderCreateModal";
import CustomTitle from "../../../shared/components/Title/Title";

/** Maps the FilterSearchBar scope value to the backend `key` query param. */
const SCOPE_TO_API_KEY: Record<string, string> = {
  buyerName: "buyer",
  supplierId: "supplier",
  number: "number",
};

const PURCHASE_ORDERS_FILTER_CONFIGS: FilterConfig[] = [
  {
    type: "scoped-text",
    key: "search",
    label: "Buscar por",
    scopes: [
      { value: "buyerName", label: "Comprador" },
      { value: "supplierId", label: "Proveedor" },
      { value: "number", label: "No. Orden" },
    ],
    debounceMs: 400,
  },
];

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderPreview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchPurchaseOrders = async (page: number, text?: string, key?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Spring pages are 0-indexed
      const response = await getPurchaseOrdersService(page - 1, ITEMS_PER_PAGE, text, key);
      setPurchaseOrders(response.content);
      setTotalItems(response.totalElements);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching purchase orders.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders(currentPage, searchText, searchKey);
  }, [currentPage, searchText, searchKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (order: PurchaseOrderPreview) => {
    navigate(`/compras/${order.id}`);
  };

  const handleFilterChange = (state: FilterState) => {
    const searchFilter = state["search"];
    const term = searchFilter?.term?.trim() || undefined;
    const apiKey = searchFilter?.scope
      ? SCOPE_TO_API_KEY[searchFilter.scope]
      : undefined;

    setSearchText(term);
    setSearchKey(apiKey);
    setCurrentPage(1);
  };

  const handleCreatePurchaseOrder = async (supplierId: string) => {
    navigate(`/compras/nuevo/${supplierId}`);
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <CustomTitle mainTitle="Compras" description="Gestiona las órdenes de compra a proveedores" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Nueva Orden de Compra
        </Button>
      </Box>

      {/* ── Filter Bar ── */}
      <FilterSearchBar
        configs={PURCHASE_ORDERS_FILTER_CONFIGS}
        onChange={handleFilterChange}
        className="mb-4"
      />

      {error && (
        <Box className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</Box>
      )}

      {isLoading ? (
        <Box className="flex justify-center p-10">
          <Typography>Cargando órdenes de compra...</Typography>
        </Box>
      ) : (
        <PurchaseOrdersTable
          purchaseOrders={purchaseOrders}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
        />
      )}

      <PurchaseOrderCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePurchaseOrder}
      />
    </Box>
  );
};

export default PurchaseOrdersPage;
