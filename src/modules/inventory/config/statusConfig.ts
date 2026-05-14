import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";

export const INVENTORY_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  IN_STOCK: { label: "Disponible", color: "success" },
  OUT_OF_STOCK: { label: "Agotado", color: "default" },
};

export const PRODUCT_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  ACTIVE: { label: "Activo", color: "success" },
  INACTIVE: { label: "Inactivo", color: "default" },
};
