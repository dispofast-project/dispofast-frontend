import { useCallback, useEffect, useState } from "react";
import { getAllDrivers } from "../api/shipping.service";
import type { Driver } from "../types";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 15;

  const fetchDrivers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await getAllDrivers({ page: page - 1, size: pageSize });
      setDrivers(result.content);
      setTotalElements(result.totalElements);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage, fetchDrivers]);

  const refetch = () => fetchDrivers(currentPage);

  return { drivers, loading, currentPage, setCurrentPage, totalElements, pageSize, refetch };
};
