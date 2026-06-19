import apiClient from "../../../shared/api/apiClient";
import type { AsesorVsQuotaStats, DashboardStats } from "../types";

const BASE_URL = "/dashboard";

export const getDashboardStats = (): Promise<DashboardStats> =>
  apiClient.get<DashboardStats>(`${BASE_URL}/stats`).then((r) => r.data);

export const getAsesorVsQuotaStats = (months: number, type: string): Promise<AsesorVsQuotaStats[]> =>
  apiClient.get<AsesorVsQuotaStats[]>(`${BASE_URL}/asesor-vs-quota`, {
    params: { months, type }
  }).then((r) => r.data);
