import { Chip } from "@mui/material";
import type { ReactNode } from "react";

export interface StatusBadgeConfig {
  label: string;
  color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  icon?: ReactNode;
}

interface StatusBadgeProps {
  status: string | boolean | null | undefined;
  configMap: Record<string, StatusBadgeConfig>;
  defaultConfig?: StatusBadgeConfig;
}

export const StatusBadge = ({
  status,
  configMap,
  defaultConfig = { label: "Desconocido", color: "default" },
}: StatusBadgeProps) => {
  if (status === null || status === undefined) {
    return (
      <Chip
        label={defaultConfig.label}
        color={defaultConfig.color}
        icon={defaultConfig.icon as React.ReactElement}
        size="small"
        className="font-medium"
      />
    );
  }

  const key = String(status);
  const config = configMap[key] || defaultConfig;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon as React.ReactElement}
      size="small"
      className="font-medium"
      variant="filled"
    />
  );
};
