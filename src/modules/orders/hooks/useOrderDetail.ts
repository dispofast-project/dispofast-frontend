import { useEffect, useState } from "react";
import type { SalesOrder } from "../types";
import { getOrderById } from "../api/order.service";
import { useAppDispatch } from "../../../shared/hooks/redux";
import { setLoading as setGlobalLoading } from "../../../shared/slices/loadingSlice";

export const useOrderDetail = (id: string | undefined) => {
  const dispatch = useAppDispatch();

  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      dispatch(setGlobalLoading(true));
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setError("Error al cargar la orden");
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [id]);

  return { order, loading, error, refetch: load };
};
