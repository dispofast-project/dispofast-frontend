import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";

export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  imageUrl: string | null;
  taxFree: boolean;
  quantityAvailable: number;
  quantityReserved: number;
  state: string;
}

export interface InventoryFilters {
  search?: string;
  state?: string;
}

export const getAllInventoryProducts = async (
  page = 0,
  size = 100,
  filters?: InventoryFilters,
): Promise<PagedResponse<InventoryItem>> => {
  const { data } = await apiClient.get("/inventory", {
    params: {
      page,
      size,
      sort: "lastUpdated,desc",
      ...(filters?.search && { search: filters.search }),
      ...(filters?.state && { state: filters.state }),
    },
  });
  return data;
};
