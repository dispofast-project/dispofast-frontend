import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import { getClientsService } from "../../clients/api/clients.api";
import type { ClientPreview } from "../../clients/types";
import type { PurchaseOrder, PurchaseOrderPreview, PurchaseOrderItem } from "../types";

export const getPurchaseOrdersService = async (
  page: number = 0,
  size: number = 20,
  text?: string,
  key?: string,
): Promise<PagedResponse<PurchaseOrderPreview>> => {
  const params: Record<string, unknown> = { page, size, sort: "createdAt,desc" };
  if (text && text.trim()) {
    params.text = text.trim();
    if (key) params.key = key;
  }

  const response = await apiClient.get(`/purchase-orders`, { params });
  return response.data;
};

export const getPurchaseOrderByIdService = async (id: string): Promise<PurchaseOrder> => {
  const response = await apiClient.get(`/purchase-orders/${id}`);
  return response.data;
};

export const createPurchaseOrderService = async (supplierId: string): Promise<PurchaseOrder> => {
  const response = await apiClient.post("/purchase-orders", { supplierId });
  return response.data;
};

export const updatePurchaseOrderService = async (
  id: string,
  data: Partial<PurchaseOrder> & { buyerId?: string },
): Promise<PurchaseOrder> => {
  const response = await apiClient.put(`/purchase-orders/${id}`, data);
  return response.data;
};

/** Busca proveedores — reutiliza el endpoint de clientes, ya que un proveedor es un cliente más. */
export const searchSuppliersService = async (text: string): Promise<ClientPreview[]> => {
  const response = await getClientsService(0, 20, text);
  return response.content;
};

export const getPurchaseOrderItemsService = async (
  purchaseOrderId: string,
): Promise<PurchaseOrderItem[]> => {
  const response = await apiClient.get(`/purchase-orders/${purchaseOrderId}/items`);
  return response.data;
};

export const addPurchaseOrderItemService = async (
  purchaseOrderId: string,
  data: { productId: string; quantity: number; unitPrice: number },
): Promise<PurchaseOrderItem> => {
  const response = await apiClient.post(`/purchase-orders/${purchaseOrderId}/items`, data);
  return response.data;
};

export const updatePurchaseOrderItemService = async (
  purchaseOrderId: string,
  itemId: string,
  data: { quantity?: number; unitPrice?: number },
): Promise<PurchaseOrderItem> => {
  const response = await apiClient.put(
    `/purchase-orders/${purchaseOrderId}/items/${itemId}`,
    data,
  );
  return response.data;
};

export const removePurchaseOrderItemService = async (
  purchaseOrderId: string,
  itemId: string,
): Promise<void> => {
  await apiClient.delete(`/purchase-orders/${purchaseOrderId}/items/${itemId}`);
};
