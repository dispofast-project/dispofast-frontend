import React from "react";
import type { ShipmentState } from "../types";
import { Clock, Package, Truck, CheckCircle, AlertCircle } from "lucide-react";

export interface StatusConfig {
  label: string;
  color: "default" | "secondary" | "info" | "success" | "error" | "warning";
  icon?: React.ReactNode;
}

export const SHIPMENT_STATUS_CONFIG: Record<ShipmentState, StatusConfig> = {
  PENDING: {
    label: "Pendiente",
    color: "default",
    icon: React.createElement(Clock, { size: 14 }),
  },
  ASSIGNED: {
    label: "Asignado",
    color: "secondary",
    icon: React.createElement(Package, { size: 14 }),
  },
  IN_ROUTE: {
    label: "En Ruta",
    color: "info",
    icon: React.createElement(Truck, { size: 14 }),
  },
  DELIVERED: {
    label: "Entregado",
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  DELAYED: {
    label: "Retrasado",
    color: "error",
    icon: React.createElement(AlertCircle, { size: 14 }),
  },
};

export const EDITABLE_STATES: ShipmentState[] = ["PENDING", "ASSIGNED"];

export const VALID_STATE_TRANSITIONS: Record<ShipmentState, ShipmentState[]> = {
  PENDING: ["ASSIGNED", "DELAYED"],
  ASSIGNED: ["IN_ROUTE", "DELAYED"],
  IN_ROUTE: ["DELIVERED", "DELAYED"],
  DELIVERED: [],
  DELAYED: ["ASSIGNED", "IN_ROUTE", "DELIVERED"],
};
