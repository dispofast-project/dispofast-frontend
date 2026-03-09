import { useEffect, useState, useRef } from "react";
import type { User } from "../types";
import { getAllUsers, searchUsers } from "../api/user.service";

const DEBOUNCE_MS = 400;

export const useUsers = () => {

    const [users, setUsers] = useState<User[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const pageSize = 10;

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadUsers = async (page: number, search: string) => {
        try {
            setError(null);

            const response = search.trim()
                ? await searchUsers(search.trim(), { page: page - 1, size: pageSize })
                : await getAllUsers({ page: page - 1, size: pageSize });

            setUsers(response.content);
            setTotalElements(response.totalElements);
        } catch {
            setError("Error al cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    // Debounce: espera que el usuario deje de escribir antes de hacer la request
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, DEBOUNCE_MS);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [searchTerm]);

    // Fetch al cambiar página o término de búsqueda (ya debounced)
    useEffect(() => {
        setLoading(true);
        loadUsers(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setLoading(true);
        loadUsers(currentPage, debouncedSearch);
    };

    return {
        users,
        loading,
        error,
        currentPage,
        totalElements,
        pageSize,
        searchTerm,
        handlePageChange,
        handleSearchChange,
        handleRefresh,
    };
};
