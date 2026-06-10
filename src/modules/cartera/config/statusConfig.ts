import React from "react";
import { Clock, CreditCard } from "lucide-react";
import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import type { ArEntryState } from "../types";

export const CARTERA_STATUS_CONFIG: Record<ArEntryState, StatusBadgeConfig> = {
  PENDING: {
    label: "Pendiente",
    color: "default",
    icon: React.createElement(Clock, { size: 14 }),
  },
  PAID: {
    label: "Pagada",
    color: "success",
    icon: React.createElement(CreditCard, { size: 14 }),
  },
};
