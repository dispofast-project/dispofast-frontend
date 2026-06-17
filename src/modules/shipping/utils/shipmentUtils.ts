import type { ShipmentState } from "../types";
import { EDITABLE_STATES, VALID_STATE_TRANSITIONS } from "../config/shipmentStatusConfig";
import {
  PLATE_REGEX,
  PLATE_MIN_LENGTH,
  PLATE_MAX_LENGTH,
  CARRIER_NAME_MIN,
  CARRIER_NAME_MAX,
} from "../constants/shippingConstants";

export const canEditShipment = (state: ShipmentState): boolean => {
  return EDITABLE_STATES.includes(state);
};

export const canChangeState = (
  currentState: ShipmentState,
  newState: ShipmentState
): boolean => {
  const validTransitions = VALID_STATE_TRANSITIONS[currentState] || [];
  return validTransitions.includes(newState);
};

export const validatePlate = (plate: string): { valid: boolean; error?: string } => {
  if (!plate || plate.trim().length === 0) {
    return { valid: false, error: "La placa es requerida" };
  }
  if (plate.length < PLATE_MIN_LENGTH || plate.length > PLATE_MAX_LENGTH) {
    return {
      valid: false,
      error: `La placa debe tener entre ${PLATE_MIN_LENGTH} y ${PLATE_MAX_LENGTH} caracteres`,
    };
  }
  if (!PLATE_REGEX.test(plate)) {
    return { valid: false, error: "La placa solo puede contener letras, números y guiones" };
  }
  return { valid: true };
};

export const validateCarrierName = (
  name: string
): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "El nombre es requerido" };
  }
  if (
    name.length < CARRIER_NAME_MIN ||
    name.length > CARRIER_NAME_MAX
  ) {
    return {
      valid: false,
      error: `El nombre debe tener entre ${CARRIER_NAME_MIN} y ${CARRIER_NAME_MAX} caracteres`,
    };
  }
  return { valid: true };
};

export const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return "-";
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

export const formatDateTime = (isoDate: string | null): string => {
  if (!isoDate) return "-";
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};
