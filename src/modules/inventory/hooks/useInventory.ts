import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllInventoryProducts } from "../api/inventory.service";
import type { InventoryTableItem } from "../types";

const PAGE_SIZE = 20;

export const useInventory = () => {
  const [allItems, setAllItems] = useState<InventoryTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInventoryProducts(0, 200);
      const mapped: InventoryTableItem[] = response.content.map((item) => ({
        id: item.productId,
        productName: item.productName,
        sku: item.sku,
        category: item.category,
        taxFree: item.taxFree,
        quantityAvailable: item.quantityAvailable,
        quantityReserved: item.quantityReserved,
        state: item.state as InventoryTableItem["state"],
      }));
      setAllItems(mapped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el inventario",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesState = !stateFilter || item.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [allItems, search, stateFilter]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStateFilter = (value: string) => {
    setStateFilter(value);
    setCurrentPage(1);
  };

  return {
    items: pagedItems,
    loading,
    error,
    search,
    stateFilter,
    currentPage,
    totalElements: filtered.length,
    pageSize: PAGE_SIZE,
    setCurrentPage,
    handleSearch,
    handleStateFilter,
  };
};
