import { useCallback, useEffect, useState } from "react";
import { getAllCarriers } from "../api/shipping.service";
import type { Carrier, CarrierFilters } from "../types";
import { PAGE_SIZE_CARRIERS } from "../constants/shippingConstants";

export const useCarriers = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<CarrierFilters>({});

  const loadCarriers = useCallback(
    async (page: number, currentFilters: CarrierFilters) => {
      try {
        setError(null);
        const response = await getAllCarriers({
          page: page - 1,
          size: PAGE_SIZE_CARRIERS,
          ...currentFilters,
        });
        setCarriers(response.content);
        setTotalElements(response.totalElements);
      } catch {
        setError("Error al cargar los transportistas");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    loadCarriers(currentPage, filters);
  }, [currentPage, filters, loadCarriers]);

  const refetch = useCallback(() => {
    loadCarriers(currentPage, filters);
  }, [loadCarriers, currentPage, filters]);

  return {
    carriers,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize: PAGE_SIZE_CARRIERS,
    setCurrentPage,
    setFilters,
    refetch,
  };
};
