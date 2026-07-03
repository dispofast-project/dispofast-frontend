import { useCallback, useEffect, useState } from "react";
import { getShipmentHistory } from "../api/shipping.service";
import type { ShipmentHistory } from "../types";

export const useShipmentHistory = (shipmentId?: string) => {
  const [history, setHistory] = useState<ShipmentHistory[]>([]);
  const [loading, setLoading] = useState(!!shipmentId);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!shipmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getShipmentHistory(shipmentId);
      setHistory(data);
    } catch {
      setError("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { history, loading, error };
};
