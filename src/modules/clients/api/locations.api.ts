import apiClient from "../../../shared/api/apiClient";
import type { City } from "../../../shared/types/location";

export const searchCitiesService = async (
  search: string,
): Promise<City[]> => {
  const response = await apiClient.get("/locations/cities", {
    params: { search, size: 20 },
  });
  return response.data?.content || [];
};

export const getCityByCodeService = async (code: string): Promise<City> => {
  const response = await apiClient.get(`/locations/cities/${code}`);
  return response.data;
};
