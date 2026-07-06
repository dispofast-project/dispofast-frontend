import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArEntry, ArEntryState, CarteraStats } from "../types";
import {
  getArEntries,
  getAsesorNames,
  getCarteraStats,
  getTotalPaidValue,
} from "../api/cartera.service";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export const useCartera = () => {
  // ── Table state ─────────────────────────────────────────────────────────────
  const [entries, setEntries] = useState<ArEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [stateFilter, setStateFilter] = useState<ArEntryState | "">("");
  const [searchText, setSearchTextRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [asesorFilter, setAsesorFilter] = useState("");

  // ── Stats (computed server-side, independent of the table's pagination) ─────
  const [stats, setStats] = useState<CarteraStats>({
    totalCartera: 0,
    carteraVencida: 0,
    alDia: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [asesorOptions, setAsesorOptions] = useState<string[]>([]);

  // Load stats once on mount. Totals and the asesor list are computed in the
  // database (SUM/DISTINCT queries) instead of fetching hundreds of full rows
  // and reducing them client-side.
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [{ totalCartera, carteraVencida }, alDia, asesores] = await Promise.all([
          getCarteraStats(),
          getTotalPaidValue(),
          getAsesorNames(),
        ]);
        setStats({ totalCartera, carteraVencida, alDia });
        setAsesorOptions(asesores);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  // Debounce the search text before it drives a request, so we don't hit the
  // API on every keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(
      () => setDebouncedSearch(searchText.trim()),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // ── Table load ───────────────────────────────────────────────────────────────
  // Search runs server-side (across the full dataset) so results aren't limited
  // to whatever page happens to already be loaded.
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArEntries(
        { page: currentPage - 1, size: PAGE_SIZE },
        { state: stateFilter || undefined, search: debouncedSearch || undefined }
      );
      setEntries(data.content);
      setTotalElements(data.totalElements);
    } finally {
      setLoading(false);
    }
  }, [currentPage, stateFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 when filters change
  const handleStateFilter = (value: ArEntryState | "") => {
    setStateFilter(value);
    setCurrentPage(1);
  };

  const setSearchText = (value: string) => {
    setSearchTextRaw(value);
    setCurrentPage(1);
  };

  // ── Client-side filtering (asesor only — not covered by the server search) ──
  const filtered = useMemo(() => {
    if (!asesorFilter) return entries;
    return entries.filter((e) => e.asesorName === asesorFilter);
  }, [entries, asesorFilter]);

  return {
    entries: filtered,
    loading,
    currentPage,
    totalElements,
    pageSize: PAGE_SIZE,
    stats,
    statsLoading,
    stateFilter,
    searchText,
    asesorFilter,
    asesorOptions,
    setCurrentPage,
    setSearchText,
    setAsesorFilter,
    handleStateFilter,
    refresh: load,
  };
};
