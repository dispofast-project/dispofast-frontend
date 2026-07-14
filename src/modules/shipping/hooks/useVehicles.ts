import { getAllVehicles } from "../api/shipping.service";
import type { Vehicle, VehicleFilters } from "../types";
import { PAGE_SIZE_VEHICLES } from "../constants/shippingConstants";
import { usePaginatedList } from "../../../shared/hooks/usePaginatedList";

const fetchVehicles = (page: number, filters: VehicleFilters) =>
  getAllVehicles({ page: page - 1, size: PAGE_SIZE_VEHICLES, plate: filters.plate });

export const useVehicles = () => {
  const { items, loading, error, currentPage, totalElements, pageSize, setCurrentPage, setFilters, refetch } =
    usePaginatedList<Vehicle, VehicleFilters>(fetchVehicles, PAGE_SIZE_VEHICLES, {});

  return { vehicles: items, loading, error, currentPage, totalElements, pageSize, setCurrentPage, setFilters, refetch };
};
