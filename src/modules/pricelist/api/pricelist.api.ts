import apiClient from "../../../shared/api/apiClient";

export interface PriceListItem {
  id: string;
  name: string;
}

export interface PriceListProductItem {
  productId: string;
  productReference: string;
  productName: string;
  taxFree: boolean;
  unitPrice: number;
  quantityAvailable: number | null;
}

export const getAllPriceLists = async (): Promise<PriceListItem[]> => {
  try {
    const { data } = await apiClient.get<PriceListItem[]>("/price-lists");
    return data;
  } catch {
    throw new Error("Error al cargar las listas de precios");
  }
};

export const getPriceListItems = async (priceListId: string): Promise<PriceListProductItem[]> => {
  const { data } = await apiClient.get<PriceListProductItem[]>(`/price-lists/${priceListId}/items`);
  return data;
};
