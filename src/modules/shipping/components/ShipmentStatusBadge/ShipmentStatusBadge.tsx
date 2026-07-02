import { StatusBadge } from "../../../../shared/components/StatusBadge/StatusBadge";
import { SHIPMENT_STATUS_CONFIG } from "../../config/shipmentStatusConfig";
import type { ShipmentState } from "../../types";

interface ShipmentStatusBadgeProps {
  state: ShipmentState | null | undefined;
}

export const ShipmentStatusBadge = ({ state }: ShipmentStatusBadgeProps) => (
  <StatusBadge status={state} configMap={SHIPMENT_STATUS_CONFIG} />
);
