import { Box } from "@mui/material";
import type { PurchaseOrderPreview } from "../types";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { formatCurrency } from "../../../shared/utils/currency";

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrderPreview[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowClick: (purchaseOrder: PurchaseOrderPreview) => void;
}

const PurchaseOrdersTable = ({
  purchaseOrders,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onRowClick,
}: PurchaseOrdersTableProps) => {
  const headers = ["No. Orden", "Proveedor", "Comprador", "Fecha", "Total"];

  const renderRow = (order: PurchaseOrderPreview) => [
    <span className="font-medium text-gray-900">{order.number}</span>,
    order.supplierName,
    order.buyer?.fullName ?? "-",
    new Date(order.createdAt).toLocaleDateString("es-CO"),
    <span className="font-mono text-right">{formatCurrency(order.total)}</span>,
  ];

  return (
    <Box className="w-full">
      <CustomTable
        headers={headers}
        data={purchaseOrders}
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

export default PurchaseOrdersTable;
