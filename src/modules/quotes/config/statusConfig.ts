import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import React from "react";

export const QUOTE_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  pendiente: {
    label: "Pendiente",
    color: "warning",
    icon: React.createElement(Clock, { size: 14 }),
  },
  aprobada: {
    label: "Aprobada",
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  rechazada: {
    label: "Rechazada",
    color: "error",
    icon: React.createElement(XCircle, { size: 14 }),
  },
  caducada: {
    label: "Caducada",
    color: "default",
    icon: React.createElement(FileText, { size: 14 }),
  },
};
