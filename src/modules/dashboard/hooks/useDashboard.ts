import { useEffect, useState } from "react";
import type { AsesorVsQuotaStats, DashboardStats } from "../types";
import { getDashboardStats, getAsesorVsQuotaStats } from "../api/dashboard.service";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [asesorQuotaStats, setAsesorQuotaStats] = useState<AsesorVsQuotaStats[] | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      
    getAsesorVsQuotaStats()
      .then(setAsesorQuotaStats)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, asesorQuotaStats };
};
