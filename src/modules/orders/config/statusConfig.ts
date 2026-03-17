import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import { Clock, FileText, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import type { OrderState } from "../types";

export const ORDER_STATUS_CONFIG: Record<OrderState, StatusBadgeConfig> = {
  PENDING: {
    label: "Creada",
    color: "default",
    icon: React.createElement(Clock, { size: 14 }),
  },
  INVOICED: {
    label: "Facturada",
    color: "warning",
    icon: React.createElement(FileText, { size: 14 }),
  },
  ASSIGNED: {
    label: "Asignada",
    color: "secondary",
    icon: React.createElement(Package, { size: 14 }),
  },
  IN_TRANSIT: {
    label: "En Despacho",
    color: "info",
    icon: React.createElement(Truck, { size: 14 }),
  },
  DELIVERED: {
    label: "Entregada",
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  CANCELLED: {
    label: "Cancelada",
    color: "error",
    icon: React.createElement(XCircle, { size: 14 }),
  },
};
