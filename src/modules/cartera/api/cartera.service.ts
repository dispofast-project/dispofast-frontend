import apiClient from "../../../shared/api/apiClient";
import type { PagedResponseDTO } from "../../../shared/types/common";
import type { ArEntry, CarteraFilters } from "../types";

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
