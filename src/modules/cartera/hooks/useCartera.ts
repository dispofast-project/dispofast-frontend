import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArEntry, ArEntryState, CarteraStats } from "../types";
import { getArEntries, getTotalPaidValue } from "../api/cartera.service";

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

  // ── Stats (fetched separately, all PENDING entries, no pagination) ───────────
  const [stats, setStats] = useState<CarteraStats>({
    totalCartera: 0,
    carteraVencida: 0,
    alDia: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  // Unique asesor names extracted from the stats dataset for the dropdown
  const [asesorOptions, setAsesorOptions] = useState<string[]>([]);

  // Load stats once on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getArEntries({ page: 0, size: 500 });
        const all = data.content;

        // Unique asesores for the filter dropdown
        const asesores = Array.from(
          new Set(all.map((e) => e.asesorName).filter(Boolean))
        ) as string[];
        setAsesorOptions(asesores.sort());

        // Only PENDING entries contribute to the financial totals.
        // Use balance (= value - paidAmount) so partial payments are reflected.
        const pending = all.filter((e) => e.state === "PENDING");
        const bal = (e: (typeof pending)[0]) => e.balance ?? e.value ?? 0;
        const totalCartera = pending.reduce((s, e) => s + bal(e), 0);
        const carteraVencida = pending
          .filter((e) => e.diasVencimiento <= 0)
          .reduce((s, e) => s + bal(e), 0);

        // "Al Día" = total acumulado pagado en todos los recibos
        const alDia = await getTotalPaidValue();

        setStats({ totalCartera, carteraVencida, alDia });
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
