import { useEffect, useState } from "react";
import type { OrderFilters, OrderState, SalesOrder } from "../types";
import { getAllOrders } from "../api/order.service";
import { useAppDispatch } from "../../../shared/hooks/redux";
import { setLoading as setGlobalLoading } from "../../../shared/slices/loadingSlice";

export const useOrders = () => {
  const dispatch = useAppDispatch();

  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<OrderFilters>({});
  const pageSize = 10;

  const loadOrders = async (page: number, currentFilters: OrderFilters) => {
    try {
      setError(null);
      dispatch(setGlobalLoading(true));
      const response = await getAllOrders({ page: page - 1, size: pageSize }, currentFilters);
      setOrders(response.content);
      setTotalElements(response.totalElements);
    } catch {
      setError("Error al cargar las órdenes");
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrders(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleStateFilter = (state: OrderState | undefined) => {
    handleFilterChange({ ...filters, state });
  };

  const handleSearchChange = (orderNumber: string) => {
    handleFilterChange({ ...filters, orderNumber: orderNumber || undefined });
  };

  const handleRefresh = () => {
    setLoading(true);
    loadOrders(currentPage, filters);
  };

  return {
    orders,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    filters,
    handlePageChange,
    handleStateFilter,
    handleSearchChange,
    handleRefresh,
  };
};
