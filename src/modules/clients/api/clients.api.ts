import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { ClientPreview, ClientResponse } from "../types";

export const getClientsService = async (
  page: number = 0,
  size: number = 20,
  text?: string,
  key?: string,
): Promise<PagedResponse<ClientPreview>> => {
  const params: Record<string, unknown> = { page, size };
  if (text && text.trim()) {
    params.text = text.trim();
    if (key) params.key = key;
  }

  const response = await apiClient.get(`/clients`, { params });
  return response.data;
};

export const getClientByIdService = async (id: string): Promise<ClientResponse> => {
  const response = await apiClient.get<ClientResponse>(`/clients/${id}`);
  return response.data;
};
