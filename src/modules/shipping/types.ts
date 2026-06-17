import type { City } from "../../shared/types/location";

export type ShipmentState =
  | "PENDING"
  | "ASSIGNED"
  | "IN_ROUTE"
  | "DELIVERED"
  | "DELAYED";

export interface Carrier {
  id: string;
  name: string;
  plate: string;
}

export interface Shipment {
  id: string;
  invoiceId: string;
  invoiceNumber: string | null;
  createdAt: string | null;
  clientName: string | null;
  asesorName: string | null;
  state: ShipmentState;
  stateLabel: string;
  deliveryAddress: string;
  estimatedDeliveryDate: string | null;
  departureDate: string | null;
  deliveryDate: string | null;
  productCount: number | null;
  carrier: Carrier | null;
  city: City | null;
}

export interface CreateCarrierDTO {
  name: string;
  plate: string;
}

export interface UpdateCarrierDTO {
  name?: string;
  plate?: string;
}

export interface UpdateShipmentDTO {
  deliveryAddress?: string;
  carrierId?: string;
  cityCode?: string;
  estimatedDeliveryDate?: string | null;
}

export interface ShipmentFilters {
  state?: ShipmentState;
  clientName?: string;
  asesorName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CarrierFilters {
  name?: string;
  plate?: string;
}
