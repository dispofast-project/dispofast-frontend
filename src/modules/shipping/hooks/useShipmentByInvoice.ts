import { useEffect, useState } from "react";
import { getShipmentsByInvoice } from "../api/shipping.service";
import type { Shipment } from "../types";

export const useShipmentByInvoice = (invoiceId?: string) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId) {
      setShipment(null);
      return;
    }

    const loadShipment = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getShipmentsByInvoice(invoiceId);
        setShipment(data);
      } catch {
        setError("Error al cargar el despacho");
      } finally {
        setLoading(false);
      }
    };

    loadShipment();
  }, [invoiceId]);

  return { shipment, loading, error };
};
