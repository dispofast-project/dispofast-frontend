import { useCallback, useEffect, useState } from "react";
import { getShipmentById } from "../api/shipping.service";
import type { Shipment } from "../types";

export const useShipmentDetail = (id?: string) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getShipmentById(id);
      setShipment(data);
    } catch {
      setError("Error al cargar el despacho");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { shipment, loading, error, refetch };
};
