import apiClient from "../../../shared/api/apiClient";
import type { DashboardStats } from "../types";

export const getDashboardStats = (): Promise<DashboardStats> =>
  apiClient.get<DashboardStats>("/dashboard/stats").then((r) => r.data);
