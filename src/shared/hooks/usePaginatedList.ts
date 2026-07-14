import { useCallback, useEffect, useState } from "react";

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

export function usePaginatedList<T, F extends object>(
  fetchFn: (page: number, filters: F) => Promise<PaginatedResponse<T>>,
  pageSize: number,
  defaultFilters: F
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<F>(defaultFilters);

  const load = useCallback(async (page: number, currentFilters: F) => {
    try {
      setError(null);
      const response = await fetchFn(page, currentFilters);
      setItems(response.content ?? []);
      setTotalElements(response.totalElements ?? 0);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    setLoading(true);
    load(currentPage, filters);
  }, [currentPage, filters, load]);

  const refetch = useCallback(() => {
    load(currentPage, filters);
  }, [load, currentPage, filters]);

  return {
    items,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    setCurrentPage,
    setFilters,
    refetch,
  };
}
