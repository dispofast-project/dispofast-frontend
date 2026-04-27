import apiClient from "./apiClient";

export interface SystemParams {
  IVA: number;
  RETEFUENTE_RATE: number;
  RETEFUENTE_THRESHOLD: number;
}

const DEFAULT_PARAMS: SystemParams = {
  IVA: 0.19,
  RETEFUENTE_RATE: 0.025,
  RETEFUENTE_THRESHOLD: 540,
};

export const getPublicSystemParams = async (): Promise<SystemParams> => {
  const response = await apiClient.get<Record<string, number>>("/system-params/public");
  return {
    IVA: response.data.IVA ?? DEFAULT_PARAMS.IVA,
    RETEFUENTE_RATE: response.data.RETEFUENTE_RATE ?? DEFAULT_PARAMS.RETEFUENTE_RATE,
    RETEFUENTE_THRESHOLD: response.data.RETEFUENTE_THRESHOLD ?? DEFAULT_PARAMS.RETEFUENTE_THRESHOLD,
  };
};
