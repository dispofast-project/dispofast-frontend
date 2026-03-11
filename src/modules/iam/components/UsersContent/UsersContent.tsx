import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { Box } from "@mui/material";
import { useUsers } from "../../hooks/useUsers";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import type { JSX } from "react";
import { Button } from "../../../../shared/components/Button/Button";
import FilterSearchBar from "../../../../shared/components/SearchBar/SearchBar";
import type { FilterConfig, FilterState } from "../../../../shared/components/SearchBar/types";

const filterConfigs: FilterConfig[] = [
    {
        type: "scoped-text",
        key: "search",
        label: "Buscar",
        scopes: [
            { value: "all",   label: "Todos los campos" },
            { value: "name",  label: "Nombre" },
            { value: "email", label: "Email" },
        ],
        debounceMs: 400,
    },
];

const UsersContent = () => {

    const navigate = useNavigate();

    const {
        users = [],
        loading,
        error,
        currentPage,
        totalElements,
        pageSize,
        handlePageChange,
        handleSearchChange,
        handleRefresh,
    } = useUsers();

    const handleFilterChange = useCallback((state: FilterState) => {
        const term = state["search"]?.term ?? "";
        handleSearchChange(term);
    }, [handleSearchChange]);

    const formatRole = (role: string): string => {
        if (!role) return '-';

        const labels: Record<string, string> = {
            ADMIN: 'Administrador',
            VENDEDOR: 'Vendedor',
            BODEGA: 'Bodega',
        };

        return labels[role] ?? role.charAt(0) + role.slice(1).toLowerCase();
    };

    const renderUserRow = (item: any): (string | JSX.Element)[] => {
        const user = item as User;
        return [
            user.name,
            user.email,
            formatRole(user.role),
        ];
    };

    if (error) {
        return (
            <Box className="text-center py-10">
                <Box className="mb-4">
                    <p className="text-red-500">Error: {error}</p>
                </Box>
                <Button onClick={handleRefresh} variant="primary">
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Box component="div" className="space-y-4 pb-6">
            <FilterSearchBar
                configs={filterConfigs}
                onChange={handleFilterChange}
                className="max-w-lg"
            />

            <Box className={loading ? "opacity-50 pointer-events-none" : ""}>
                <CustomTable
                    data={users}
                    headers={["Nombre", "Email", "Rol"]}
                    renderRow={renderUserRow}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    itemsPerPage={pageSize}
                    totalItems={totalElements}
                />
            </Box>
        </Box>
    );
};

export default UsersContent;
