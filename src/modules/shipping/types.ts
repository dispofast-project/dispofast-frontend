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
  website?: string | null;
  registeredAt?: string | null;
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
  website?: string | null;
}

export interface UpdateCarrierDTO {
  name?: string;
  website?: string | null;
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
}

export type VehicleState = "AVAILABLE" | "IN_MAINTENANCE";
export type VehicleType = "FURGON" | "MENSAJERIA";

export interface Vehicle {
  id: string;
  plate: string;
  state: VehicleState;
  type: VehicleType;
  createdAt?: string | null;
}

export interface CreateVehicleDTO {
  plate: string;
  state: VehicleState;
  type: VehicleType;
}

export interface VehicleFilters {
  plate?: string;
}
