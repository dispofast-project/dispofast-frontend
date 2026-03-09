import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { QuotePreview, Quote } from "../types";

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
