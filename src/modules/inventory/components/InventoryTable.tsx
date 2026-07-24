import type { JSX } from "react";
import { Box, ListItemIcon, MenuItem } from "@mui/material";
import { Eye, ImageIcon } from "lucide-react";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { INVENTORY_STATUS_CONFIG } from "../config/statusConfig";
import type { InventoryTableItem } from "../types";
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
  ];

  const navigate = useNavigate();

  const renderRow = (item: InventoryTableItem): (string | JSX.Element)[] => [
    <StatusBadge key="estado" status={item.state} configMap={INVENTORY_STATUS_CONFIG} />,
    <Box key="producto" className="flex items-center gap-3">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.productName}
          className="w-9 h-9 rounded-md object-cover shrink-0 border border-gray-100"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <Box
        className={`w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100 ${item.imageUrl ? "hidden" : ""}`}
      >
        <ImageIcon size={16} className="text-gray-400" />
      </Box>
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
  ];

  const optionsMenu = (item: InventoryTableItem, closeMenu: () => void) => (
    <MenuItem onClick={() => { closeMenu(); navigate(`/inventario/producto/${item.id}`); }}>
      <ListItemIcon><Eye size={16} /></ListItemIcon>
      Ver producto
    </MenuItem>
  );

  return (
    <CustomTable
      headers={headers}
      data={items}
      renderRow={renderRow}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onRowClick={(item) => navigate(`/inventario/producto/${item.id}`)}
      optionsMenu={optionsMenu}
    />
  );
};

export default InventoryTable;
