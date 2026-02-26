export interface SelectOption {
  value: string;
  label: string;
}

export interface ScopedTextValue {
  scope: string;
  term: string;
}

export interface FilterConfig {
  type: "scoped-text";
  key: string;
  label: string;
  scopes: SelectOption[];
  debounceMs?: number;
}

export type FilterState = Record<string, ScopedTextValue>;

export interface FilterSearchBarProps {
  configs: FilterConfig[];
  onChange: (state: FilterState) => void;
  className?: string;
}
