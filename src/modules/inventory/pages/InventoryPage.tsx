import { Box } from "@mui/material";
import { Plus } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import CustomTitle from "../../../shared/components/Title/Title";
import { useInventory } from "../hooks/useInventory";
import InventoryFilters from "../components/InventoryFilters";
import InventoryTable from "../components/InventoryTable";
import { useNavigate } from "react-router-dom";

const InventoryPage = () => {
  const {
    items,
    loading,
    error,
    search,
    stateFilter,
    currentPage,
    totalElements,
    pageSize,
    setCurrentPage,
    handleSearch,
    handleStateFilter,
  } = useInventory();

  const breadcrumbs = [{ label: "Inventarios" }];

  const navigate = useNavigate();

  return (
    <Box className="flex flex-col gap-6 pb-8">
      <Box className="grid grid-cols-2 flex-shrink-0 items-center justify-between">
        <CustomTitle breadcrumbs={breadcrumbs} />
        <Box className="flex items-center justify-end">
          <Button variant="primary" onClick={() => navigate("/inventario/nuevo")}>
            <Plus className="w-4 h-4 mr-2" />
            Añadir
          </Button>
        </Box>
      </Box>

      <Box className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl w-80">
        <span className="font-medium">Barra de stock:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-300 inline-block" />
          Reservado
        </span>
      </Box>

      <InventoryFilters
        search={search}
        stateFilter={stateFilter}
        onSearchChange={handleSearch}
        onStateFilterChange={handleStateFilter}
      />

      {error && (
        <Box className="bg-red-100 text-red-700 p-4 rounded">{error}</Box>
      )}

      {loading ? (
        <Box className="flex justify-center p-10">
          <span className="text-gray-500">Cargando inventario...</span>
        </Box>
      ) : (
        <InventoryTable
          items={items}
          currentPage={currentPage}
          itemsPerPage={pageSize}
          totalItems={totalElements}
          onPageChange={setCurrentPage}
        />
      )}
    </Box>
  );
};

export default InventoryPage;
