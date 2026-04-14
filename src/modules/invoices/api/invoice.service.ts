import apiClient from "../../../shared/api/apiClient";
import type { Invoice } from "../types";

const BASE_URL = "/invoices";

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const { data } = await apiClient.get<Invoice>(`${BASE_URL}/${id}`);
    return data;
  } catch {
    throw new Error("Error al cargar la factura");
  }
};

export const getInvoiceByOrderId = async (orderId: string): Promise<Invoice> => {
  try {
    const { data } = await apiClient.get<Invoice>(`${BASE_URL}/by-order/${orderId}`);
    return data;
  } catch {
    throw new Error("Error al cargar la factura de la orden");
  }
};

export const downloadInvoicePdf = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}/download`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data as Blob);
    const disposition = response.headers["content-disposition"] as string | undefined;
    let fileName = "factura.pdf";
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/);
      if (match?.[2]) fileName = match[2];
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    throw new Error("Error al descargar la factura");
  }
};
