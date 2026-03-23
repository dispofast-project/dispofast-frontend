import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { QuoteStatus } from "../types";
import React from "react";

export const QUOTE_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  [QuoteStatus.PENDING]: {
    label: "Pendiente",
    color: "warning",
    icon: React.createElement(Clock, { size: 14 }),
  },
  [QuoteStatus.ACCEPTED]: {
    label: "Aprobada",
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  [QuoteStatus.REJECTED]: {
    label: "Rechazada",
    color: "error",
    icon: React.createElement(XCircle, { size: 14 }),
  },
  [QuoteStatus.EXPIRED]: {
    label: "Caducada",
    color: "default",
    icon: React.createElement(FileText, { size: 14 }),
  },
};
