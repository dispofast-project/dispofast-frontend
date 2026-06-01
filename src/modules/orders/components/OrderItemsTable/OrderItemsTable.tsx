import type { JSX } from "react";
import { Box } from "@mui/material";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import type { SalesOrderItem } from "../../types";

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "-";
  return `$${value.toLocaleString("es-CO")}`;
};

interface OrderItemsTableProps {
  items: SalesOrderItem[];
}

const OrderItemsTable = ({ items }: OrderItemsTableProps) => {
  if (!items || items.length === 0) return null;

  return (
    <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Box className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Productos</h3>
      </Box>
      <CustomTable<SalesOrderItem>
        headers={["Producto", "SKU", "IVA", "Cantidad", "Precio Unit.", "Descuento", "Total Línea"]}
        data={items}
        renderRow={(item): (string | JSX.Element)[] => [
          item.productName,
          item.productSku ?? "-",
          item.taxFree ? "No aplica" : "19%",
          String(item.quantity),
          formatCurrency(item.unitPrice),
          item.discount ? `${item.discount}%` : "-",
          formatCurrency(item.lineTotal),
        ]}
        currentPage={1}
        itemsPerPage={items.length}
        totalItems={items.length}
        onPageChange={() => {}}
        hidePagination
      />
    </Box>
  );
};

export default OrderItemsTable;
