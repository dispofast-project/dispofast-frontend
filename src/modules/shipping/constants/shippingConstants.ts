import type { ShipmentState } from "../types";

export const SHIPMENT_STATES_OPTIONS: Array<{
  value: ShipmentState;
  label: string;
}> = [
  { value: "PENDING", label: "Pendiente" },
  { value: "ASSIGNED", label: "Asignado" },
  { value: "IN_ROUTE", label: "En Ruta" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "DELAYED", label: "Retrasado" },
];

export const PAGE_SIZE_SHIPMENTS = 10;
export const PAGE_SIZE_CARRIERS = 15;

export const PLATE_REGEX = /^[A-Z0-9\-]+$/i;
export const PLATE_MIN_LENGTH = 3;
export const PLATE_MAX_LENGTH = 20;

export const CARRIER_NAME_MIN = 2;
export const CARRIER_NAME_MAX = 100;
