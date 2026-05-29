import apiClient from "../../../shared/api/apiClient";
import type { PagedResponse } from "../../../shared/types/common";
import type { ClientPreview, ClientResponse, ClientType, LegalDocument, PriceListResponse } from "../types";
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
  payload: CreateClientRequestDTO,
  documents?: File[]
): Promise<ClientResponse> => {
  const form = new FormData();
  form.append(
    "clientData",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );
  if (documents && documents.length > 0) {
    for (const file of documents) {
      form.append("documents", file);
    }
  }
  const response = await apiClient.post<ClientResponse>("/clients", form);
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

// ─── Legal Documents ──────────────────────────────────────────────────────────

export const getLegalDocumentsService = async (
  clientId: string
): Promise<LegalDocument[]> => {
  const response = await apiClient.get<LegalDocument[]>(
    `/clients/${clientId}/legal-documents`
  );
  return response.data;
};

export const uploadLegalDocumentService = async (
  clientId: string,
  file: File
): Promise<LegalDocument> => {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post<LegalDocument>(
    `/clients/${clientId}/legal-documents`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteLegalDocumentService = async (
  clientId: string,
  docId: string
): Promise<void> => {
  await apiClient.delete(`/clients/${clientId}/legal-documents/${docId}`);
};

export const downloadLegalDocumentService = async (
  clientId: string,
  docId: string,
  fallbackName?: string
): Promise<void> => {
  const response = await apiClient.get(
    `/clients/${clientId}/legal-documents/${docId}/download`,
    { responseType: "blob" }
  );
  const url = URL.createObjectURL(response.data as Blob);
  const disposition = response.headers["content-disposition"] as string | undefined;
  let fileName = fallbackName ?? "documento";
  if (disposition) {
    // RFC 5987: filename*=UTF-8''encoded-name (takes priority)
    const rfc5987Match = disposition.match(/filename\*\s*=\s*UTF-8''([^;\n]+)/i);
    if (rfc5987Match?.[1]) {
      fileName = decodeURIComponent(rfc5987Match[1]);
    } else {
      // Standard: filename="name" or filename=name
      const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/);
      if (match?.[2]) fileName = match[2];
    }
  }
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
