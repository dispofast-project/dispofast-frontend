import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Plus, Search } from "lucide-react";
import {
  getAllPriceLists,
  createPriceList,
  downloadPriceListFile,
  uploadPriceListFile,
  type PriceListItem,
} from "../api/pricelist.api";
import PriceListTable from "../components/PriceListTable";
import CreatePriceListModal from "../components/CreatePriceListModal";
import PriceListItemsDrawer from "../components/PriceListItemsDrawer";
import { Button } from "../../../shared/components/Button/Button";

const ITEMS_PER_PAGE = 10;

const PriceListPage = () => {
  const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [drawerPriceList, setDrawerPriceList] = useState<PriceListItem | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadingItemRef = useRef<PriceListItem | null>(null);

  const fetchPriceLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPriceLists();
      setPriceLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las listas de precios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceLists();
  }, []);

  const filtered = priceLists.filter((pl) =>
    pl.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreate = async (name: string) => {
    await createPriceList(name);
    await fetchPriceLists();
  };

  const handleView = (item: PriceListItem) => {
    setDrawerPriceList(item);
  };

  const handleDownload = (item: PriceListItem) => {
    downloadPriceListFile(item.id, item.name);
  };

  const handleUpdate = (item: PriceListItem) => {
    uploadingItemRef.current = item;
    uploadInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadingItemRef.current;
    if (!file || !target) return;

    try {
      await uploadPriceListFile(target.id, file);
      await fetchPriceLists();
    } catch {
      setError("Error al actualizar el archivo de la lista de precios");
    } finally {
      uploadingItemRef.current = null;
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Lista de precios
        </Typography>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} className="mr-1" />
          Crear
        </Button>
      </Box>

      <Box className="flex justify-end mb-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar Documento"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </Box>

      {error && (
        <Box className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</Box>
      )}

      {isLoading ? (
        <Box className="flex justify-center p-10">
          <Typography>Cargando listas de precios...</Typography>
        </Box>
      ) : (
        <PriceListTable
          priceLists={paginated}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
          onView={handleView}
          onUpdate={handleUpdate}
          onDownload={handleDownload}
        />
      )}

      <input
        ref={uploadInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileSelected}
      />

      <CreatePriceListModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <PriceListItemsDrawer
        open={drawerPriceList !== null}
        priceList={drawerPriceList}
        onClose={() => setDrawerPriceList(null)}
      />
    </Box>
  );
};

export default PriceListPage;
