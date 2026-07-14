import type { City } from "../../shared/types/location";

export type ShipmentState =
  | "PENDING"
  | "ASSIGNED"
  | "IN_ROUTE"
  | "DELIVERED"
  | "DELAYED";

export type DeliveryType = "CONDUCTOR" | "TRANSPORTADORA" | "RETIRO";

export interface Carrier {
  id: string;
  name: string;
  website?: string | null;
  registeredAt?: string | null;
}

export interface Driver {
  id: string;
  name: string;
  phone?: string | null;
  cedula?: string | null;
  createdAt?: string | null;
}

export interface CreateDriverDTO {
  name: string;
  phone?: string | null;
  cedula?: string | null;
}

export interface ShipmentItem {
  id: string;
  productSku: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number | null;
  total: number;
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
  addressDetail: string | null;
  estimatedDeliveryDate: string | null;
  departureDate: string | null;
  deliveryDate: string | null;
  productCount: number | null;
  carrier: Carrier | null;
  driver: Driver | null;
  city: City | null;
  deliveryType: DeliveryType | null;
  trackingCode: string | null;
  vehicle: Vehicle | null;
  items?: ShipmentItem[];
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
  deliveryType?: DeliveryType | null;
  deliveryAddress?: string;
  addressDetail?: string | null;
  carrierId?: string | null;
  driverId?: string | null;
  cityCode?: string;
  estimatedDeliveryDate?: string | null;
  trackingCode?: string | null;
  vehicleId?: string | null;
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

export interface ShipmentHistory {
  id: string;
  changedAt: string;
  description: string;
  userEmail: string;
}
