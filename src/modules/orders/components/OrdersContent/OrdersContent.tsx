import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Eye, Trash2 } from "lucide-react";
import type { JSX } from "react";
import type { OrderState, SalesOrder } from "../../types";
import { ORDER_STATUS_CONFIG } from "../../config/statusConfig";
import { StatusBadge } from "../../../../shared/components/StatusBadge/StatusBadge";
import { useOrders } from "../../hooks/useOrders";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import { Button } from "../../../../shared/components/Button/Button";
import FilterSearchBar from "../../../../shared/components/SearchBar/SearchBar";
import type { FilterConfig, FilterState } from "../../../../shared/components/SearchBar/types";
import { deleteOrder } from "../../api/order.service";

const filterConfigs: FilterConfig[] = [
  {
    type: "scoped-text",
    key: "search",
    label: "Buscar",
    scopes: [
      { value: "orderNumber", label: "# Orden" },
    ],
    debounceMs: 400,
  },
];

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "-";
  return `$${value.toLocaleString("es-CO")}`;
};

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ALL_STATES: { value: OrderState | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Creada" },
  { value: "INVOICED", label: "Facturada" },
  { value: "ASSIGNED", label: "Asignada" },
  { value: "IN_TRANSIT", label: "En Despacho" },
  { value: "DELIVERED", label: "Entregada" },
  { value: "CANCELLED", label: "Cancelada" },
];

const HEADERS = [
  "Estado", 
  "Cliente", 
  "# Orden", 
  "Valor", 
  "# Factura", 
  "Ciudad", 
  "Fecha", 
  "Acciones"
];

const OrdersContent = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    filters,
    handlePageChange,
    handleStateFilter,
    handleSearchChange,
    handleRefresh,
  } = useOrders();

  const [orderToDelete, setOrderToDelete] = useState<SalesOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleFilterChange = useCallback(
    (state: FilterState) => {
      const term = state["search"]?.term ?? "";
      handleSearchChange(term);
    },
    [handleSearchChange]
  );

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const val = event.target.value as OrderState | "";
    handleStateFilter(val || undefined);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteOrder(orderToDelete.id);
      setOrderToDelete(null);
      handleRefresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar la orden.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    if (isDeleting) return;
    setOrderToDelete(null);
    setDeleteError(null);
  };

  const renderOrderRow = useCallback(
    (item: SalesOrder): (string | JSX.Element)[] => [
      <StatusBadge key="state" status={item.state} configMap={ORDER_STATUS_CONFIG} />,
      item.clientName,
      item.orderNumber,
      formatCurrency(item.totalValue),
      item.invoiceNumber ?? "-",
      item.shipmentCityName,
      formatDate(item.orderDate),
      <Box className="flex items-center space-x-3" key="actions">
        <Eye
          key="view"
          className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600"
          onClick={(e) => { e.stopPropagation(); navigate(`/ordenes/${item.id}`); }}
        />
        {item.state === "PENDING" && (
          <Trash2
            key="delete"
            className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-600"
            onClick={(e) => { e.stopPropagation(); setOrderToDelete(item); }}
          />
        )}
      </Box>
    ],
    [navigate]
  );

  if (error) {
    return (
      <Box className="text-center py-10">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={handleRefresh} variant="primary">
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box component="div" className="space-y-4 pb-6">
      <Box className="flex flex-wrap items-center gap-3">
        <FilterSearchBar
          configs={filterConfigs}
          onChange={handleFilterChange}
          className="flex-grow max-w-lg"
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.state ?? ""}
            label="Estado"
            onChange={handleStateChange}
          >
            {ALL_STATES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className={loading ? "opacity-50 pointer-events-none" : ""}>
        <CustomTable
          data={orders}
          headers={HEADERS}
          renderRow={renderOrderRow}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={pageSize}
          totalItems={totalElements}
        />
      </Box>

      <Dialog open={!!orderToDelete} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la orden{" "}
            <strong>{orderToDelete?.orderNumber}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
          {deleteError && (
            <Box className="mt-3 text-sm text-red-600 bg-red-50 rounded p-2">
              {deleteError}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog} disabled={isDeleting}>
            Cancelar
          </MuiButton>
          <MuiButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersContent;