import { useCallback, useState } from "react";
import type { JSX } from "react";
import { Box, MenuItem } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import type { User } from "../../types";
import { useUsers } from "../../hooks/useUsers";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import { Button } from "../../../../shared/components/Button/Button";
import FilterSearchBar from "../../../../shared/components/SearchBar/SearchBar";
import type { FilterConfig, FilterState } from "../../../../shared/components/SearchBar/types";
import UserPermissionsDialog from "../UserPermissionsDialog/UserPermissionsDialog";
import { formatRole } from "../../utils/formatRole";

const filterConfigs: FilterConfig[] = [
    {
        type: "scoped-text",
        key: "search",
        label: "Buscar",
        scopes: [
            { value: "all", label: "Todos los campos" },
            { value: "name", label: "Nombre" },
            { value: "email", label: "Email" },
        ],
        debounceMs: 400,
    },
];

const UsersContent = () => {
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

    const [permDialogUser, setPermDialogUser] = useState<User | null>(null);

    const handleFilterChange = useCallback(
        (state: FilterState) => {
            const term = state["search"]?.term ?? "";
            handleSearchChange(term);
        },
        [handleSearchChange]
    );

    const renderUserRow = (item: unknown): (string | JSX.Element)[] => {
        const user = item as User;
        return [user.name, user.email, formatRole(user.role)];
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
                    optionsMenu={(item, closeMenu) => (
                        <MenuItem
                            onClick={() => {
                                setPermDialogUser(item as User);
                                closeMenu();
                            }}
                        >
                            <ShieldCheck className="w-4 h-4 mr-2 text-gray-500" />
                            Ver permisos
                        </MenuItem>
                    )}
                />
            </Box>

            <UserPermissionsDialog
                open={permDialogUser !== null}
                user={permDialogUser}
                onClose={() => setPermDialogUser(null)}
            />
        </Box>
    );
};

export default UsersContent;
