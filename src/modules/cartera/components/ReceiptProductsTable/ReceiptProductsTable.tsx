import { Box, CircularProgress, Typography } from "@mui/material";
import type { SalesOrderItem } from "../../../orders/types";

const IVA_RATE = 0.19;

const fmt = (v: number) =>
  `$${v.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

const HEADERS = [
  "Código",
  "Producto",
  "Cantidad",
  "Valor Unit",
  "Subtotal",
  "IVA",
  "Total",
];

interface ReceiptProductsTableProps {
  orderNumber: string | null;
  items: SalesOrderItem[];
  loading: boolean;
}

const ReceiptProductsTable = ({
  orderNumber,
  items,
  loading,
}: ReceiptProductsTableProps) => (
  <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <Box className="px-6 py-4 border-b border-gray-100">
      <Typography variant="body1" className="font-semibold text-gray-800">
        Productos (Orden #{orderNumber ?? "—"})
      </Typography>
    </Box>

    {loading ? (
      <Box className="flex justify-center py-6">
        <CircularProgress size={24} />
      </Box>
    ) : items.length > 0 ? (
      <Box className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemIva = item.taxFree ? 0 : item.lineTotal * IVA_RATE;
              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">
                    {item.productSku ?? item.productReference ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {fmt(item.lineTotal)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{fmt(itemIva)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {fmt(item.lineTotal + itemIva)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    ) : (
      <Box className="px-6 py-4 text-gray-400 text-sm">
        No hay productos disponibles.
      </Box>
    )}
  </Box>
);

export default ReceiptProductsTable;
