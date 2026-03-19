import React from "react";
import { CheckCircle, AlertCircle, Clock, CreditCard } from "lucide-react";
import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import type { CarteraDisplayState } from "../types";

export const CARTERA_STATUS_CONFIG: Record<CarteraDisplayState, StatusBadgeConfig> = {
  AL_DIA: {
    label: "Al día",
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  POR_VENCER: {
    label: "Por vencer",
    color: "warning",
    icon: React.createElement(Clock, { size: 14 }),
  },
  VENCIDA: {
    label: "Vencida",
    color: "error",
    icon: React.createElement(AlertCircle, { size: 14 }),
  },
  PAGADA: {
    label: "Pagada",
    color: "default",
    icon: React.createElement(CreditCard, { size: 14 }),
  },
};
