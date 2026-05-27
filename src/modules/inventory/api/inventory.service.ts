import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";

export interface InventoryItem {
  productId: string;
  productName: string;
  productReference: string;
  category: string;
  taxFree: boolean;
  quantityAvailable: number;
  quantityReserved: number;
  state: string;
}

export const getAllInventoryProducts = async (
  page = 0,
  size = 100,
): Promise<PagedResponse<InventoryItem>> => {
  try {
    const { data } = await apiClient.get("/inventory", {
      params: { page, size, sort: 'lastUpdated,desc' },
    });
    return data;
  } catch {
    throw new Error("Error al cargar los productos");
  }
};
