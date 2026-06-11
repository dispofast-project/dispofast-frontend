import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { QuotePreview, Quote, QuoteItem, ClientPreview, ClientDetails, ProspectDetails } from "../types";
import type { PriceList } from "../types";

export const getQuotesService = async (
  page: number = 0,
  size: number = 20,
  text?: string,
  key?: string,
): Promise<PagedResponse<QuotePreview>> => {
  const params: Record<string, unknown> = { page, size, sort: 'createdAt,desc' };
  if (text && text.trim()) {
    params.text = text.trim();
    if (key) params.key = key;
  }

  const response = await apiClient.get(`/quotes`, { params });
  return response.data;
};

export const getQuoteByIdService = async (id: string): Promise<Quote> => {
  const response = await apiClient.get(`/quotes/${id}`);
  return response.data;
};

export const updateQuoteService = async (
  id: string,
  data: Partial<Quote> & { priceListId?: string; sellerId?: string },
): Promise<Quote> => {
  const response = await apiClient.put(`/quotes/${id}`, data);
  return response.data;
};

export const createQuoteService = async (accountId: string): Promise<Quote> => {
  const response = await apiClient.post("/quotes", { accountId });
  return response.data;
};

export const searchClientsService = async (
  text: string,
): Promise<ClientPreview[]> => {
  const response = await apiClient.get("/clients", {
    params: { text, size: 20 },
  });
  return response.data?.content || response.data || [];
};

export const getClientByIdService = async (id: string): Promise<ClientDetails> => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
};

export const getPriceListsService = async (): Promise<PriceList[]> => {
  const response = await apiClient.get("/price-lists");
  return response.data;
};

export const getQuoteItemsService = async (quoteId: string): Promise<QuoteItem[]> => {
  const response = await apiClient.get(`/quotes/${quoteId}/items`);
  return response.data;
};

export const addQuoteItemService = async (
  quoteId: string,
  data: { productId: string; quantity: number; unitPrice?: number },
): Promise<QuoteItem> => {
  const response = await apiClient.post(`/quotes/${quoteId}/items`, data);
  return response.data;
};

export const updateQuoteItemService = async (
  quoteId: string,
  itemId: string,
  data: { quantity?: number; unitPrice?: number },
): Promise<QuoteItem> => {
  const response = await apiClient.put(`/quotes/${quoteId}/items/${itemId}`, data);
  return response.data;
};

export const removeQuoteItemService = async (quoteId: string, itemId: string): Promise<void> => {
  await apiClient.delete(`/quotes/${quoteId}/items/${itemId}`);
};

export const changeQuoteStatusService = async (id: string, status: string): Promise<Quote> => {
  const response = await apiClient.patch(`/quotes/${id}/status`, { status });
  return response.data;
};

export const createQuoteFromProspectService = async (
  prospectData: ProspectDetails,
): Promise<Quote> => {
  const response = await apiClient.post("/quotes", { prospect: prospectData });
  return response.data;
};
