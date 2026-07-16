import { useState, useEffect } from "react";
import { getPublicSystemParams, type SystemParams } from "../api/system-params.service";

const DEFAULT_PARAMS: SystemParams = {
  IVA: 0.19,
  RETEFUENTE_RATE_PERSONA_JURIDICA: 0.025,
  RETEFUENTE_RATE_PERSONA_NATURAL: 0.035,
  RETEFUENTE_THRESHOLD: 524000,
};

export const useSystemParams = (): SystemParams => {
  const [params, setParams] = useState<SystemParams>(DEFAULT_PARAMS);

  useEffect(() => {
    getPublicSystemParams()
      .then(setParams)
      .catch(() => {
        // Mantiene los valores por defecto si falla la petición
      });
  }, []);

  return params;
};
