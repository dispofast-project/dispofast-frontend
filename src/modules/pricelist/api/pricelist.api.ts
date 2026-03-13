import apiClient from "../../../shared/api/apiClient";

export interface PriceListItem {
  id: string;
  name: string;
}

export const getAllPriceLists = async (): Promise<PriceListItem[]> => {
  try {
    const { data } = await apiClient.get<PriceListItem[]>("/price-lists");
    return data;
  } catch {
    throw new Error("Error al cargar las listas de precios");
  }
};
