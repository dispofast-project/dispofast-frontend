import { useCallback, useEffect, useState } from "react";
import { getAllInventoryProducts } from "../api/inventory.service";
import type { InventoryTableItem } from "../types";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

export const useInventory = () => {
  const [items, setItems] = useState<InventoryTableItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce the search text before it drives a request, so we don't hit the
  // API on every keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeoutId);
  }, [search]);

  // Search and filtering run server-side (across the full ~300-product
  // dataset) instead of fetching everything into memory and slicing it.
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInventoryProducts(currentPage - 1, PAGE_SIZE, {
        search: debouncedSearch || undefined,
        state: stateFilter || undefined,
      });
      const mapped: InventoryTableItem[] = response.content.map((item) => ({
        id: item.productId,
        productName: item.productName,
        sku: item.sku,
        category: item.category,
        imageUrl: item.imageUrl ?? null,
        taxFree: item.taxFree,
        quantityAvailable: item.quantityAvailable,
        quantityReserved: item.quantityReserved,
        state: item.state as InventoryTableItem["state"],
      }));
      setItems(mapped);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el inventario",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, stateFilter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSearch = (value: string) => {
    setSearchRaw(value);
    setCurrentPage(1);
  };

  const handleStateFilter = (value: string) => {
    setStateFilter(value);
    setCurrentPage(1);
  };

  return {
    items,
    loading,
    error,
    search,
    stateFilter,
    currentPage,
    totalElements,
    pageSize: PAGE_SIZE,
    setCurrentPage,
    handleSearch,
    handleStateFilter,
  };
};
