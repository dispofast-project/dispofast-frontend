import { useEffect, useState } from "react";
import type { SalesOrder } from "../types";
import { getOrderById } from "../api/order.service";

export const useOrderDetail = (id: string | undefined) => {
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setError("Error al cargar la orden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [id]);

  return { order, loading, error, refetch: load };
};
