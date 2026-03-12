import { useEffect, useState } from "react";
import type { User } from "../types";
import { getAllUsers, searchUsers } from "../api/user.service";
import { useAppDispatch } from "../../../shared/hooks/redux";
import { setLoading as setGlobalLoading } from "../../../shared/slices/loadingSlice";

export const useUsers = () => {
    const dispatch = useAppDispatch();

    const [users, setUsers] = useState<User[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;

    const loadUsers = async (page: number, search: string) => {
        try {
            setError(null);
            dispatch(setGlobalLoading(true));

            const response = search.trim()
                ? await searchUsers(search.trim(), { page: page - 1, size: pageSize })
                : await getAllUsers({ page: page - 1, size: pageSize });

            setUsers(response.content);
            setTotalElements(response.totalElements);
        } catch {
            setError("Error al cargar los usuarios");
        } finally {
            setLoading(false);
            dispatch(setGlobalLoading(false));
        }
    };

    // El debounce lo maneja FilterSearchBar internamente, aquí reaccionamos directo
    useEffect(() => {
        setLoading(true);
        loadUsers(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setLoading(true);
        loadUsers(currentPage, searchTerm);
    };

    return {
        users,
        loading,
        error,
        currentPage,
        totalElements,
        pageSize,
        handlePageChange,
        handleSearchChange,
        handleRefresh,
    };
};
