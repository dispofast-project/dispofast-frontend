import { useEffect, useState } from "react";
import { CircularProgress, Drawer } from "@mui/material";
import { X, Search } from "lucide-react";
import { getPriceListItems, type PriceListItem, type PriceListProductItem } from "../api/pricelist.api";

interface PriceListItemsDrawerProps {
  open: boolean;
  priceList: PriceListItem | null;
  onClose: () => void;
}

const formatCOP = (value: number) =>
  `$${new Intl.NumberFormat("es-CO").format(Math.round(value))}`;

const COLUMNS = ["Código", "Referencia", "Precio", "IVA (19%)", "P.TOTAL", "UNL.EMP"];

const PriceListItemsDrawer = ({ open, priceList, onClose }: PriceListItemsDrawerProps) => {
  const [items, setItems] = useState<PriceListProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !priceList) return;

    setItems([]);
    setSearch("");
    setError(null);
    setIsLoading(true);

    getPriceListItems(priceList.id)
      .then(setItems)
      .catch(() => setError("Error al cargar los ítems de la lista de precios"))
      .finally(() => setIsLoading(false));
  }, [open, priceList]);

  const filtered = items.filter(
    (item) =>
      item.productReference.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 900, maxWidth: "95vw", display: "flex", flexDirection: "column" } } }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ backgroundColor: "var(--dispofast-primary)" }}
      >
        <h2 className="text-base font-semibold text-white truncate pr-4">
          {priceList?.name ?? "Lista de precios"}
        </h2>
        <button
          onClick={onClose}
          className="shrink-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-hidden p-4 gap-4">
        {/* Search */}
        <div className="relative shrink-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center flex-1">
            <CircularProgress size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-sm">
            {error}
          </div>
        ) : (
          <div className="overflow-auto flex-1 rounded-lg border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0">
                <tr style={{ backgroundColor: "#1e2f4e" }}>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-white font-semibold text-xs whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="px-4 py-8 text-center text-gray-400 text-sm"
                    >
                      {items.length === 0
                        ? "Esta lista aún no tiene ítems. Sube un archivo .xlsx con el botón Actualizar."
                        : "No se encontraron resultados para la búsqueda."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => {
                    const price = item.unitPrice ?? 0;
                    const iva = item.taxFree ? 0 : price * 0.19;
                    const total = price + iva;
                    return (
                      <tr
                        key={item.productId}
                        className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-700 whitespace-nowrap">
                          {item.productReference}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-800">
                          {item.productName}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">
                          {item.unitPrice != null ? formatCOP(price) : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">
                          {item.taxFree ? "Exento" : formatCOP(iva)}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-semibold text-gray-900 whitespace-nowrap">
                          {formatCOP(total)}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">
                          {item.quantityAvailable !== null
                            ? new Intl.NumberFormat("es-CO").format(item.quantityAvailable)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default PriceListItemsDrawer;
