import { useEffect, useState } from "react";
import { getAllShipments } from "../api/shipping.service";
import type { ShipmentState } from "../types";

const TAB_STATES: ShipmentState[] = ["PENDING", "ASSIGNED", "IN_ROUTE", "DELIVERED", "DELAYED"];

const INITIAL_COUNTS: Record<ShipmentState, number> = {
  PENDING: 0,
  ASSIGNED: 0,
  IN_ROUTE: 0,
  DELIVERED: 0,
  DELAYED: 0,
};

export const useShipmentTabCounts = () => {
  const [tabCounts, setTabCounts] = useState<Record<ShipmentState, number>>(INITIAL_COUNTS);

  useEffect(() => {
    Promise.all(TAB_STATES.map((s) => getAllShipments({ state: s, size: 1, page: 0 }))).then(
      (results) => {
        const counts = {} as Record<ShipmentState, number>;
        TAB_STATES.forEach((s, i) => {
          counts[s] = results[i].totalElements;
        });
        setTabCounts(counts);
      }
    );
  }, []);

  return tabCounts;
};
