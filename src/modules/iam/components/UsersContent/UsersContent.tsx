import { useNavigate } from "react-router-dom"
import type { User } from "../../types";
import { Box } from "@mui/material";
import { useUsers } from "../../hooks/useUsers";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import type { JSX } from "react";

const UsersContent = () => {
    
    const navigate = useNavigate();

    const {
        users = [],
        loading,
        error,
        currentPage,
        totalElements,
        pageSize,
        searchTerm,
        handlePageChange,
        handleSearchChange,
        handleRefresh
    } = useUsers();

    const formatRole = (rolesArr: string[]) => {
        if (!rolesArr?.length) return '-';

        const labels: Record<string, string> = {
            ADMIN: 'Administrador',
            VENDEDOR: 'Vendedor',
            BODEGA: 'Bodega',
        };

        return rolesArr
            .map((r: string) => {
                const key = r;
                if (!key) return null;
                return labels[key] ?? key.charAt(0) + key.slice(1).toLowerCase();
            })
            .filter(Boolean)
            .join(', ');
    };

    const renderUserRow = (item: any): (string | JSX.Element)[] => {
        const user = item as User;
        return [
            user.name,
            user.email,
            formatRole(user.roles)
        ];
    };

    return(
        <Box component="div" className="space-y-6 pb-6">
            
                <Box className={loading ? "opacity-50 pointer-events-none" : ""}>
                    <CustomTable 
                        data={users}
                        headers={["Nombre", "Email", "Roles"]}
                        renderRow={renderUserRow}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        itemsPerPage={pageSize}
                        totalItems={totalElements}
                    />
                </Box>
            
        </Box>
    )
}

export default UsersContent;