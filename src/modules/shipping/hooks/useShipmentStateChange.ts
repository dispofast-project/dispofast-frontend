import { useState } from "react";
import { updateShipmentState } from "../api/shipping.service";
import type { Shipment, ShipmentState } from "../types";
import { VALID_STATE_TRANSITIONS } from "../config/shipmentStatusConfig";

export const useShipmentStateChange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeState = async (
    shipment: Shipment,
    newState: ShipmentState
  ): Promise<Shipment | null> => {
    const validNextStates = VALID_STATE_TRANSITIONS[shipment.state];
    if (!validNextStates.includes(newState)) {
      setError(
        `No se puede cambiar de ${shipment.stateLabel} a ${newState}`
      );
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await updateShipmentState(shipment.id, newState);
      return updated;
    } catch {
      setError("Error al actualizar estado del despacho");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { changeState, loading, error };
};
