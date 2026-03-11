import apiClient from "../../../shared/api/apiClient";
import type { PagedResponseDTO } from "../../../shared/types/common";
import type { OrderFilters, SalesOrder } from "../types";

export interface OrderServiceParams {
  page?: number;
  size?: number;
}

const BASE_URL = "/orders";

export const getAllOrders = async (
  params: OrderServiceParams,
  filters?: OrderFilters
): Promise<PagedResponseDTO<SalesOrder>> => {
  const { page = 0, size = 10 } = params;

  try {
    const { data } = await apiClient.get<PagedResponseDTO<SalesOrder>>(BASE_URL, {
      params: {
        page,
        size,
        ...(filters?.state && { state: filters.state }),
        ...(filters?.orderNumber && { orderNumber: filters.orderNumber }),
      },
    });
    return data;
  } catch {
    throw new Error("Error al cargar las órdenes");
  }
};

export const getOrderById = async (id: string): Promise<SalesOrder> => {
  try {
    const { data } = await apiClient.get<SalesOrder>(`${BASE_URL}/${id}`);
    return data;
  } catch {
    throw new Error("Error al cargar la orden");
  }
};
