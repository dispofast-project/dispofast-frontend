import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";

export const CLIENT_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  "true": {
    label: "Activo",
    color: "success",
  },
  "false": {
    label: "Inactivo",
    color: "error",
  },
};
