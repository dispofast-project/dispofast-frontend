import apiClient from "../../../shared/api/apiClient";
import type { PagedResponseDTO } from "../../../shared/types/common";
import type {
  AttachInvoiceRequestDTO,
  CreateOrderRequestDTO,
  OrderFilters,
  SalesOrder,
  UpdateOrderRequestDTO,
} from "../types";

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

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createOrder = async (
  payload: CreateOrderRequestDTO
): Promise<SalesOrder> => {
  try {
    const { data } = await apiClient.post<SalesOrder>(BASE_URL, payload);
    return data;
  } catch {
    throw new Error("Error al crear la orden");
  }
};

export const createOrderFromQuote = async (
  quoteId: string
): Promise<SalesOrder> => {
  try {
    const { data } = await apiClient.post<SalesOrder>(
      `${BASE_URL}/from-quote/${quoteId}`
    );
    return data;
  } catch {
    throw new Error("Error al crear la orden desde cotización");
  }
};

export const updateOrder = async (
  id: string,
  payload: UpdateOrderRequestDTO
): Promise<SalesOrder> => {
  try {
    const { data } = await apiClient.put<SalesOrder>(`${BASE_URL}/${id}`, payload);
    return data;
  } catch {
    throw new Error("Error al actualizar la orden");
  }
};

export const attachInvoice = async (
  id: string,
  payload: AttachInvoiceRequestDTO
): Promise<SalesOrder> => {
  try {
    const { data } = await apiClient.patch<SalesOrder>(
      `${BASE_URL}/${id}/invoice`,
      payload
    );
    return data;
  } catch {
    throw new Error("Error al adjuntar la factura");
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`);
  } catch {
    throw new Error("Error al eliminar la orden");
  }
};
