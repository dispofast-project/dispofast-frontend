import apiClient from "../../../shared/api/apiClient";
import type { PagedResponseDTO } from "../../../shared/types/common";
import type {
  ArEntry,
  CarteraFilters,
  CreatePaymentReceiptRequest,
  PaymentReceipt,
} from "../types";

const BASE_URL = "/cartera";

interface CarteraParams {
  page?: number;
  size?: number;
}

export const getArEntries = async (
  params: CarteraParams,
  filters?: CarteraFilters
): Promise<PagedResponseDTO<ArEntry>> => {
  const { page = 0, size = 10 } = params;
  const { data } = await apiClient.get<PagedResponseDTO<ArEntry>>(BASE_URL, {
    params: {
      page,
      size,
      sort: 'createdAt,desc',
      ...(filters?.state && { state: filters.state }),
    },
  });
  return data;
};

export const createPaymentReceipt = async (
  arEntryId: string,
  request: CreatePaymentReceiptRequest
): Promise<PaymentReceipt> => {
  const { data } = await apiClient.post<PaymentReceipt>(
    `${BASE_URL}/${arEntryId}/recibos`,
    request
  );
  return data;
};

export const getReceiptsByArEntry = async (
  arEntryId: string
): Promise<PaymentReceipt[]> => {
  const { data } = await apiClient.get<PaymentReceipt[]>(
    `${BASE_URL}/${arEntryId}/recibos`
  );
  return data;
};

export const getTotalPaidValue = async (): Promise<number> => {
  const { data } = await apiClient.get<number>(`${BASE_URL}/total-value`);
  return data;
};

export const uploadPaymentVoucher = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<string>(`${BASE_URL}/vouchers/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const downloadPaymentVoucher = async (
  receiptId: string
): Promise<{ blob: Blob; filename: string }> => {
  const response = await apiClient.get(`${BASE_URL}/recibos/${receiptId}/voucher`, {
    responseType: "blob",
  });
  const cd: string = response.headers["content-disposition"] ?? "";
  const match = cd.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : `comprobante_${receiptId}`;
  return { blob: response.data as Blob, filename };
};
