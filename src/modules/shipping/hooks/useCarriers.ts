import { getAllCarriers } from "../api/shipping.service";
import type { Carrier, CarrierFilters } from "../types";
import { PAGE_SIZE_CARRIERS } from "../constants/shippingConstants";
import { usePaginatedList } from "../../../shared/hooks/usePaginatedList";

const fetchCarriers = (page: number, filters: CarrierFilters) =>
  getAllCarriers({ page: page - 1, size: PAGE_SIZE_CARRIERS, name: filters.name });

export const useCarriers = () => {
  const { items, loading, error, currentPage, totalElements, pageSize, setCurrentPage, setFilters, refetch } =
    usePaginatedList<Carrier, CarrierFilters>(fetchCarriers, PAGE_SIZE_CARRIERS, {});

  return { carriers: items, loading, error, currentPage, totalElements, pageSize, setCurrentPage, setFilters, refetch };
};
