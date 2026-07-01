import apiClient from "../../../shared/api/apiClient";
import type {
  Carrier,
  CreateCarrierDTO,
  CreateDriverDTO,
  Driver,
  Shipment,
  ShipmentHistory,
  UpdateCarrierDTO,
  UpdateShipmentDTO,
  ShipmentState,
  Vehicle,
  CreateVehicleDTO,
} from "../types";

const CARRIERS_BASE_URL = "/api/v1/carriers";
const VEHICLES_BASE_URL = "/api/v1/vehicles";
const SHIPMENTS_BASE_URL = "/api/v1/shipments";

// ─── CARRIERS ───────────────────────────────────────────────────────────────

export const getAllCarriers = async (params?: {
  page?: number;
  size?: number;
  name?: string;
}): Promise<{ content: Carrier[]; totalElements: number }> => {
  const { page = 0, size = 15, name } = params || {};
  const { data } = await apiClient.get<{ content: Carrier[]; totalElements: number } | Carrier[]>(
    CARRIERS_BASE_URL,
    { params: { page, size, ...(name ? { name } : {}) } }
  );
  if (Array.isArray(data)) {
    return { content: data, totalElements: data.length };
  }
  return { content: data.content ?? [], totalElements: data.totalElements ?? 0 };
};

export const getCarrierById = async (id: string): Promise<Carrier> => {
  const { data } = await apiClient.get<Carrier>(`${CARRIERS_BASE_URL}/${id}`);
  return data;
};

export const createCarrier = async (payload: CreateCarrierDTO): Promise<Carrier> => {
  const { data } = await apiClient.post<Carrier>(CARRIERS_BASE_URL, payload);
  return data;
};

export const updateCarrier = async (
  id: string,
  payload: UpdateCarrierDTO
): Promise<Carrier> => {
  const { data } = await apiClient.put<Carrier>(
    `${CARRIERS_BASE_URL}/${id}`,
    payload
  );
  return data;
};

export const deleteCarrier = async (id: string): Promise<void> => {
  await apiClient.delete(`${CARRIERS_BASE_URL}/${id}`);
};

// ─── VEHICLES ────────────────────────────────────────────────────────────────

export const getAllVehicles = async (params?: {
  page?: number;
  size?: number;
  plate?: string;
}): Promise<{ content: Vehicle[]; totalElements: number }> => {
  const { page = 0, size = 15, plate } = params || {};
  const { data } = await apiClient.get<{ content: Vehicle[]; totalElements: number } | Vehicle[]>(
    VEHICLES_BASE_URL,
    { params: { page, size, ...(plate ? { plate } : {}) } }
  );
  if (Array.isArray(data)) {
    return { content: data, totalElements: data.length };
  }
  return { content: data.content ?? [], totalElements: data.totalElements ?? 0 };
};

export const createVehicle = async (payload: CreateVehicleDTO): Promise<Vehicle> => {
  const { data } = await apiClient.post<Vehicle>(VEHICLES_BASE_URL, payload);
  return data;
};

export const updateVehicle = async (id: string, payload: CreateVehicleDTO): Promise<Vehicle> => {
  const { data } = await apiClient.put<Vehicle>(`${VEHICLES_BASE_URL}/${id}`, payload);
  return data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiClient.delete(`${VEHICLES_BASE_URL}/${id}`);
};

// ─── SHIPMENTS ──────────────────────────────────────────────────────────────

export const getShipmentById = async (id: string): Promise<Shipment> => {
  const { data } = await apiClient.get<Shipment>(`${SHIPMENTS_BASE_URL}/${id}`);
  return data;
};

export const getShipmentsByInvoice = async (invoiceId: string): Promise<Shipment> => {
  const { data } = await apiClient.get<Shipment>(
    `${SHIPMENTS_BASE_URL}/invoice/${invoiceId}`
  );
  return data;
};

export const getShipmentsByCarrier = async (
  carrierId: string,
  params?: { page?: number; size?: number }
): Promise<{ content: Shipment[]; totalElements: number }> => {
  const { page = 0, size = 10 } = params || {};
  const { data } = await apiClient.get<{
    content: Shipment[];
    totalElements: number;
  }>(`${SHIPMENTS_BASE_URL}/carrier/${carrierId}`, {
    params: { page, size },
  });
  return data;
};

export const getAllShipments = async (params?: {
  page?: number;
  size?: number;
  state?: string;
  clientName?: string;
  asesorName?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ content: Shipment[]; totalElements: number }> => {
  const { page = 0, size = 10, ...filters } = params || {};
  const { data } = await apiClient.get<{
    content: Shipment[];
    totalElements: number;
  }>(SHIPMENTS_BASE_URL, { params: { page, size, ...filters } });
  return data;
};

export const updateShipment = async (
  id: string,
  payload: UpdateShipmentDTO
): Promise<Shipment> => {
  const { data } = await apiClient.put<Shipment>(
    `${SHIPMENTS_BASE_URL}/${id}`,
    payload
  );
  return data;
};

export const updateShipmentState = async (
  id: string,
  state: ShipmentState
): Promise<Shipment> => {
  const { data } = await apiClient.put<Shipment>(
    `${SHIPMENTS_BASE_URL}/${id}/state`,
    null,
    { params: { state } }
  );
  return data;
};

export const deleteShipment = async (id: string): Promise<void> => {
  await apiClient.delete(`${SHIPMENTS_BASE_URL}/${id}`);
};

export const getShipmentHistory = async (id: string): Promise<ShipmentHistory[]> => {
  const { data } = await apiClient.get<ShipmentHistory[]>(`${SHIPMENTS_BASE_URL}/${id}/history`);
  return data;
};

export const getShipmentCounts = async (): Promise<Record<ShipmentState, number>> => {
  const { data } = await apiClient.get<{ counts: Record<string, number> }>(
    `${SHIPMENTS_BASE_URL}/counts`
  );
  return data.counts as Record<ShipmentState, number>;
};

// ─── DRIVERS ─────────────────────────────────────────────────────────────────

const DRIVERS_BASE_URL = "/api/v1/drivers";

export const getAllDrivers = async (params?: {
  page?: number;
  size?: number;
  name?: string;
}): Promise<{ content: Driver[]; totalElements: number }> => {
  const { page = 0, size = 15, name } = params || {};
  const { data } = await apiClient.get<{ content: Driver[]; totalElements: number } | Driver[]>(
    DRIVERS_BASE_URL,
    { params: { page, size, ...(name ? { name } : {}) } }
  );
  if (Array.isArray(data)) {
    return { content: data, totalElements: data.length };
  }
  return { content: data.content ?? [], totalElements: data.totalElements ?? 0 };
};

export const createDriver = async (payload: CreateDriverDTO): Promise<Driver> => {
  const { data } = await apiClient.post<Driver>(DRIVERS_BASE_URL, payload);
  return data;
};

export const updateDriver = async (id: string, payload: CreateDriverDTO): Promise<Driver> => {
  const { data } = await apiClient.put<Driver>(`${DRIVERS_BASE_URL}/${id}`, payload);
  return data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await apiClient.delete(`${DRIVERS_BASE_URL}/${id}`);
};
