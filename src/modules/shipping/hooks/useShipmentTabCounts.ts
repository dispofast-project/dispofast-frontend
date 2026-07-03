import { useEffect, useState } from "react";
import { getShipmentCounts } from "../api/shipping.service";
import type { ShipmentState } from "../types";

const INITIAL_COUNTS: Record<ShipmentState, number> = {
  PENDING: 0,
  ASSIGNED: 0,
  IN_ROUTE: 0,
  DELIVERED: 0,
  DELAYED: 0,
};

export const useShipmentTabCounts = (refreshKey?: number) => {
  const [tabCounts, setTabCounts] = useState<Record<ShipmentState, number>>(INITIAL_COUNTS);

  useEffect(() => {
    getShipmentCounts().then((counts) => {
      setTabCounts({
        PENDING: counts.PENDING ?? 0,
        ASSIGNED: counts.ASSIGNED ?? 0,
        IN_ROUTE: counts.IN_ROUTE ?? 0,
        DELIVERED: counts.DELIVERED ?? 0,
        DELAYED: counts.DELAYED ?? 0,
      });
    });
  }, [refreshKey]);

  return tabCounts;
};
