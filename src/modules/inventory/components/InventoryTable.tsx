import type { JSX } from "react";
import { Box } from "@mui/material";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import StockBar from "./StockBar";
import { INVENTORY_STATUS_CONFIG } from "../config/statusConfig";
import type { InventoryTableItem } from "../types";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InventoryTableProps {
  items: InventoryTableItem[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const   InventoryTable = ({
  items,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: InventoryTableProps) => {
  const headers = [
    "Estado",
    "Producto",
    "SKU.",
    "Categoría",
    "Disponible",
    "Reservado",
    "Stock",
    "Acciones"
  ];

  const navigate = useNavigate();

  const renderRow = (item: InventoryTableItem): (string | JSX.Element)[] => [
    <StatusBadge key="estado" status={item.state} configMap={INVENTORY_STATUS_CONFIG} />,
    <Box key="producto">
      <p className="text-sm font-medium text-gray-800">{item.productName}</p>
    </Box>,
    <span key="sku" className="text-xs text-gray-500 font-mono">
      {item.sku}
    </span>,
    <span key="category" className="text-xs font-semibold uppercase">
      {item.category}
    </span>,
    <span
      key="available"
      className={
        item.quantityAvailable === 0
          ? "font-semibold text-orange-500"
          : "font-semibold text-gray-800"
      }
    >
      {item.quantityAvailable.toLocaleString("es-CO")}
    </span>,
    <span key="reserved" className="text-gray-600">
      {item.quantityReserved.toLocaleString("es-CO")}
    </span>,
    <StockBar
      key="bar"
      available={item.quantityAvailable}
      reserved={item.quantityReserved}
    />,
    <Box className="flex items-center space-x-3 justify-content" key="actions">
      <Eye
        key="view"
        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-dispofast-primary"
        onClick={(e) => { e.stopPropagation(); navigate(`/inventario/producto/${item.id}`); }}
      />
    </Box>
  ];

  return (
    <CustomTable
      headers={headers}
      data={items}
      renderRow={renderRow}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onPageChange={onPageChange}
    />
  );
};

export default InventoryTable;
