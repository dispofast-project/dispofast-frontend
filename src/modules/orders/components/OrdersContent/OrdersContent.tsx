import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Eye, Trash2 } from "lucide-react";
import type { JSX } from "react";
import type { OrderState, SalesOrder } from "../../types";
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

const STATE_LABELS: Record<OrderState, string> = {
  PENDING: "Creada",
  INVOICED: "Facturada",
  ASSIGNED: "Asignada",
  IN_TRANSIT: "En Despacho",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

const STATE_COLORS: Record<OrderState, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  INVOICED: "bg-amber-100 text-amber-700",
  ASSIGNED: "bg-purple-100 text-purple-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

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

const StateBadge = ({ state }: { state: OrderState }): JSX.Element => (
  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATE_COLORS[state]}`}>
    {STATE_LABELS[state] ?? state}
  </span>
);

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

  const handleDelete = async (item: SalesOrder) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
      try {
        await deleteOrder(item.id);
        handleRefresh();
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
      }
      alert(`Orden ${item.orderNumber} eliminada (simulado)`);
    }
  }

  const renderOrderRow = useCallback(
    (item: SalesOrder): (string | JSX.Element)[] => [
      <StateBadge key="state" state={item.state} />,
      item.accountName,
      item.orderNumber,
      formatCurrency(item.totalValue),
      item.invoiceNumber ?? "-",
      item.shipmentCityName,
      formatDate(item.orderDate),
      <Box className="flex items-center space-x-3" key="actions">
        <Eye
          key="view"
          className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600"
          onClick={() => navigate(`/ordenes/${item.id}`)}
        />
        <Trash2
          key="delete"
          className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-600"
          onClick={() => handleDelete(item)}
        />
      </Box>
    ],
    [navigate, handleDelete]
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
    </Box>
  );
};

export default OrdersContent;