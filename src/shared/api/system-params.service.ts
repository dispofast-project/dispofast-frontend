import apiClient from "./apiClient";

export interface SystemParams {
  IVA: number;
  RETEFUENTE_RATE_PERSONA_JURIDICA: number;
  RETEFUENTE_RATE_PERSONA_NATURAL: number;
  RETEFUENTE_THRESHOLD: number;
}

const DEFAULT_PARAMS: SystemParams = {
  IVA: 0.19,
  RETEFUENTE_RATE_PERSONA_JURIDICA: 0.025,
  RETEFUENTE_RATE_PERSONA_NATURAL: 0.035,
  RETEFUENTE_THRESHOLD: 524000,
};

export const getPublicSystemParams = async (): Promise<SystemParams> => {
  const response = await apiClient.get<Record<string, number>>("/system-params/public");
  return {
    IVA: response.data.IVA ?? DEFAULT_PARAMS.IVA,
    RETEFUENTE_RATE_PERSONA_JURIDICA:
      response.data.RETEFUENTE_RATE_PERSONA_JURIDICA ?? DEFAULT_PARAMS.RETEFUENTE_RATE_PERSONA_JURIDICA,
    RETEFUENTE_RATE_PERSONA_NATURAL:
      response.data.RETEFUENTE_RATE_PERSONA_NATURAL ?? DEFAULT_PARAMS.RETEFUENTE_RATE_PERSONA_NATURAL,
    RETEFUENTE_THRESHOLD: response.data.RETEFUENTE_THRESHOLD ?? DEFAULT_PARAMS.RETEFUENTE_THRESHOLD,
  };
};
