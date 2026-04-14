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
    const form = new FormData();
    form.append("invoiceNumber", payload.invoiceNumber);
    form.append("file", payload.file);
    const { data } = await apiClient.patch<SalesOrder>(
      `${BASE_URL}/${id}/invoice`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch {
    throw new Error("Error al adjuntar la factura");
  }
};

export const downloadInvoice = async (id: string): Promise<void> => {
  try {
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
  } catch {
    throw new Error("Error al descargar la factura");
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`);
  } catch {
    throw new Error("Error al eliminar la orden");
  }
};
