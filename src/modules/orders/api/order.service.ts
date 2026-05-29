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
  const { data } = await apiClient.get<PagedResponseDTO<SalesOrder>>(BASE_URL, {
    params: {
      page,
      size,
      sort: "orderDate,desc",
      ...(filters?.state && { state: filters.state }),
      ...(filters?.orderNumber && { orderNumber: filters.orderNumber }),
    },
  });
  return data;
};

export const getOrderById = async (id: string): Promise<SalesOrder> => {
  const { data } = await apiClient.get<SalesOrder>(`${BASE_URL}/${id}`);
  return data;
};

export const createOrder = async (payload: CreateOrderRequestDTO): Promise<SalesOrder> => {
  const { data } = await apiClient.post<SalesOrder>(BASE_URL, payload);
  return data;
};

export const createOrderFromQuote = async (quoteId: string): Promise<SalesOrder> => {
  const { data } = await apiClient.post<SalesOrder>(`${BASE_URL}/from-quote/${quoteId}`);
  return data;
};

export const updateOrder = async (
  id: string,
  payload: UpdateOrderRequestDTO
): Promise<SalesOrder> => {
  const { data } = await apiClient.put<SalesOrder>(`${BASE_URL}/${id}`, payload);
  return data;
};

export const attachInvoice = async (
  id: string,
  payload: AttachInvoiceRequestDTO
): Promise<SalesOrder> => {
  const form = new FormData();
  form.append("invoiceNumber", payload.invoiceNumber);
  form.append("file", payload.file);
  const { data } = await apiClient.patch<SalesOrder>(`${BASE_URL}/${id}/invoice`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const downloadInvoice = async (id: string): Promise<void> => {
  const response = await apiClient.get(`${BASE_URL}/${id}/invoice/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data as Blob);
  const disposition = response.headers["content-disposition"] as string | undefined;
  let fileName = "factura.pdf";
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/);
    if (match?.[2]) fileName = match[2];
  }
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const deleteOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};
