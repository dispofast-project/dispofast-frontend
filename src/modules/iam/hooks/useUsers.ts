import { useEffect, useState } from "react";
import type { User } from "../types";
import { getAllUsers } from "../api/user.service";

export const useUsers = () => {

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
            
            const response = await getAllUsers({
                page: page - 1,
                size: pageSize
            });
            setUsers(response.content);
            setTotalElements(response.totalElements);
        } catch (error) {
            setError("Error al cargar los usuarios");
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadUsers(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }

    const handleRefresh = () => {
        setLoading(true);
        loadUsers(currentPage, searchTerm);
    }

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
        handleRefresh
    }
}