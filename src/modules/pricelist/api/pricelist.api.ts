import apiClient from "../../../shared/api/apiClient";

export interface PriceListItem {
  id: string;
  name: string;
  hasFile: boolean;
}

export interface PriceListProductItem {
  productId: string;
  productReference: string;
  productName: string;
  taxFree: boolean;
  unitPrice: number;
  quantityAvailable: number | null;
}

export const createPriceList = async (name: string): Promise<PriceListItem> => {
  const { data } = await apiClient.post<PriceListItem>("/price-lists", { name });
  return data;
};

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

export const uploadPriceListFile = async (priceListId: string, file: File): Promise<void> => {
  const form = new FormData();
  form.append("file", file);
  await apiClient.post(`/price-lists/${priceListId}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadPriceListFile = async (priceListId: string, name: string): Promise<void> => {
  const response = await apiClient.get(`/price-lists/${priceListId}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

export const viewPriceListFile = async (priceListId: string): Promise<void> => {
  const response = await apiClient.get(`/price-lists/${priceListId}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data as Blob);
  window.open(url, "_blank");
};
