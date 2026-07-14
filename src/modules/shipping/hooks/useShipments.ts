import { useCallback, useEffect, useState } from "react";
import { getAllShipments } from "../api/shipping.service";
import type { Shipment, ShipmentFilters, ShipmentState } from "../types";
import { PAGE_SIZE_SHIPMENTS } from "../constants/shippingConstants";

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<ShipmentFilters>({});

  const loadShipments = useCallback(
    async (page: number, currentFilters: ShipmentFilters) => {
      try {
        setError(null);
        const response = await getAllShipments({
          page: page - 1,
          size: PAGE_SIZE_SHIPMENTS,
          state: currentFilters.state,
          clientName: currentFilters.clientName,
          asesorName: currentFilters.asesorName,
          dateFrom: currentFilters.dateFrom,
          dateTo: currentFilters.dateTo,
        });
        setShipments(response.content);
        setTotalElements(response.totalElements);
      } catch {
        setError("Error al cargar los despachos");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    loadShipments(currentPage, filters);
  }, [currentPage, filters, loadShipments]);

  const handleStateFilter = useCallback((state: ShipmentState | undefined) => {
    setFilters((prev) => ({ ...prev, state }));
    setCurrentPage(1);
  }, []);

  const applySearchFilters = useCallback(
    (extra: Omit<ShipmentFilters, "state">) => {
      setFilters((prev) => ({ ...prev, ...extra }));
      setCurrentPage(1);
    },
    []
  );

  const refetch = useCallback(() => {
    loadShipments(currentPage, filters);
  }, [loadShipments, currentPage, filters]);

  return {
    shipments,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize: PAGE_SIZE_SHIPMENTS,
    filters,
    setCurrentPage,
    handleStateFilter,
    applySearchFilters,
    refetch,
  };
};
