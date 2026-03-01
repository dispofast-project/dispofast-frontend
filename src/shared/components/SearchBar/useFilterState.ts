import { useCallback, useRef, useState } from "react";
import type { FilterConfig, FilterState, ScopedTextValue } from "./types";

function buildInitialState(configs: FilterConfig[]): FilterState {
  return configs.reduce<FilterState>((acc, config) => {
    acc[config.key] = {
      scope: config.scopes[0]?.value ?? "",
      term: "",
    };
    return acc;
  }, {});
}

interface UseFilterStateReturn {
  state: FilterState;
  setScopedText: (
    key: string,
    value: ScopedTextValue,
    debounce?: boolean,
  ) => void;
  clearAll: () => void;
}

export function useFilterState(
  configs: FilterConfig[],
  onChange: (state: FilterState) => void,
): UseFilterStateReturn {
  const [state, setState] = useState<FilterState>(() =>
    buildInitialState(configs),
  );

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const setScopedText = useCallback(
    (key: string, value: ScopedTextValue, debounce = true) => {
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }
      const update = (newValue: ScopedTextValue) => {
        setState((prev) => {
          const newState = { ...prev, [key]: newValue };
          onChange(newState);
          return newState;
        });
      };

      if (!debounce) {
        update(value);
        return;
      }

      const config = configs.find((c) => c.key === key);
      const delay = config?.debounceMs ?? 400;

      debounceTimers.current[key] = setTimeout(() => {
        update(value);
      }, delay);
    },
    [configs, onChange],
  );

  const clearAll = useCallback(() => {
    const initialState = buildInitialState(configs);
    setState(initialState);
    onChange(initialState);
  }, [configs, onChange]);

  return {
    state,
    setScopedText,
    clearAll,
  };
}
