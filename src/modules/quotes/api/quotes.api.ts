import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { QuotePreview, Quote } from "../types";
import type { PriceList } from "../types";

export const getQuotesService = async (
  page: number = 0,
  size: number = 20,
  text?: string,
  key?: string,
): Promise<PagedResponse<QuotePreview>> => {
  const params: Record<string, unknown> = { page, size };
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
  data: Partial<Quote> & { priceListId?: string },
): Promise<Quote> => {
  const response = await apiClient.put(`/quotes/${id}`, data);
  return response.data;
};

export const getPriceListsService = async (): Promise<PriceList[]> => {
  const response = await apiClient.get("/price-lists");
  return response.data;
};
