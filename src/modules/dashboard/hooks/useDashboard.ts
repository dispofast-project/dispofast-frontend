import { useEffect, useState } from "react";
import type { DashboardStats } from "../types";
import { getDashboardStats } from "../api/dashboard.service";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};
