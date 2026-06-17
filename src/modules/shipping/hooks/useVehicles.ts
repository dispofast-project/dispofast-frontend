import { useCallback, useEffect, useState } from "react";
import { getAllVehicles } from "../api/shipping.service";
import type { Vehicle, VehicleFilters } from "../types";
import { PAGE_SIZE_VEHICLES } from "../constants/shippingConstants";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<VehicleFilters>({});

  const loadVehicles = useCallback(async (page: number) => {
    try {
      setError(null);
      const response = await getAllVehicles({
        page: page - 1,
        size: PAGE_SIZE_VEHICLES,
      });
      setVehicles(response.content ?? []);
      setTotalElements(response.totalElements ?? 0);
    } catch {
      setError("Error al cargar los vehículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadVehicles(currentPage);
  }, [currentPage, filters, loadVehicles]);

  const refetch = useCallback(() => {
    loadVehicles(currentPage);
  }, [loadVehicles, currentPage]);

  return {
    vehicles,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize: PAGE_SIZE_VEHICLES,
    setCurrentPage,
    setFilters,
    refetch,
  };
};
