import type { ShipmentState } from "../../types";
import { SHIPMENT_STATUS_CONFIG } from "../../config/shipmentStatusConfig";

interface ShipmentStatusBadgeProps {
  state: ShipmentState | null | undefined;
  size?: "small" | "medium";
}

export const ShipmentStatusBadge = ({ state, size = "medium" }: ShipmentStatusBadgeProps) => {
  if (!state) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${size === "small" ? "text-xs" : "text-sm"}`}>
        Desconocido
      </span>
    );
  }

  const config = SHIPMENT_STATUS_CONFIG[state];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${size === "small" ? "text-xs" : "text-sm"}`}
      style={{
        backgroundColor: `rgba(0, 0, 0, 0.05)`,
      }}
    >
      {config.icon && <span>{config.icon}</span>}
      <span className="font-medium">{config.label}</span>
    </span>
  );
};
