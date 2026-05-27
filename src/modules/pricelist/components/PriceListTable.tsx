import { Box } from "@mui/material";
import { Eye, RefreshCw, Download, FileText } from "lucide-react";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import type { PriceListItem } from "../api/pricelist.api";

interface PriceListTableProps {
  priceLists: PriceListItem[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onView: (item: PriceListItem) => void;
  onUpdate: (item: PriceListItem) => void;
  onDownload: (item: PriceListItem) => void;
}

const PriceListTable = ({
  priceLists,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onView,
  onUpdate,
  onDownload,
}: PriceListTableProps) => {
  const headers = ["Nombre de documento", "Acciones"];

  const renderRow = (item: PriceListItem) => [
    <div key={`name-${item.id}`} className="flex items-center gap-3 py-1">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#e53e3e" }}
      >
        <FileText size={18} color="white" />
      </div>
      <span className="font-semibold text-gray-900">{item.name}</span>
    </div>,

    <div key={`actions-${item.id}`} className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView(item);
        }}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        <Eye size={12} />
        Ver
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpdate(item);
        }}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        <RefreshCw size={12} />
        Actualizar
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDownload(item);
        }}
        disabled={!item.hasFile}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Download size={12} />
        Descargar
      </button>
    </div>,
  ];

  return (
    <Box className="w-full">
      <CustomTable
        headers={headers}
        data={priceLists}
        renderRow={renderRow}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </Box>
  );
};

export default PriceListTable;
