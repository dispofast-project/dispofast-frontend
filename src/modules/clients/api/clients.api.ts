import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { ClientPreview, ClientResponse, ClientType, PriceListResponse } from "../types";
import type { CreateClientRequestDTO, CreateIndividualRequestDTO, CreateOrganizationRequestDTO } from "../types/create-client.dto";

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

export const createClientService = async (
  payload: CreateClientRequestDTO
): Promise<ClientResponse> => {
  const response = await apiClient.post<ClientResponse>("/clients", payload);
  return response.data;
};

export const updateClientService = async (
  id: string,
  payload: CreateIndividualRequestDTO | CreateOrganizationRequestDTO
): Promise<ClientResponse> => {
  const response = await apiClient.put<ClientResponse>(`/clients/${id}`, payload);
  return response.data;
};

export const getClientTypesService = async (): Promise<ClientType[]> => {
  const response = await apiClient.get<ClientType[]>("/client-types");
  return response.data;
};

export const getPriceListsService = async (): Promise<PriceListResponse[]> => {
  const response = await apiClient.get<PriceListResponse[]>("/price-lists");
  return response.data;
};
