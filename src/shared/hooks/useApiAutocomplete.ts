import { useState, useEffect, useRef } from "react";

interface UseApiAutocompleteOptions<T> {
  fetchFn: (query: string) => Promise<T[]>;
  debounceMs?: number;
}

export function useApiAutocomplete<T>({
  fetchFn,
  debounceMs = 300,
}: UseApiAutocompleteOptions<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);

  // Stable ref so inline arrow functions don't re-trigger the effect on every render
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  useEffect(() => {
    if (!open && inputValue === "") return;

    let active = true;
    setIsSearching(true);
    // Fetch immediately on open with empty query; debounce typed input
    const delay = inputValue === "" ? 0 : debounceMs;

    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchFnRef.current(inputValue);
        if (active) setOptions(results);
      } catch (err) {
        if (active) {
          console.error("Error in autocomplete search:", err);
          setOptions([]);
        }
      } finally {
        if (active) setIsSearching(false);
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue, open, debounceMs]);

  const handleInputChange = (newValue: string, reason?: string) => {
    if (!reason || reason === "input" || reason === "clear") {
      setInputValue(newValue);
    }
  };

  return { options, setOptions, inputValue, isSearching, open, setOpen, handleInputChange };
}
