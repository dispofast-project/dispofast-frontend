import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import CustomTitle from "../../../shared/components/Title/Title";
import UsersContent from "../components/UsersContent/UsersContent";
import { Button } from "../../../shared/components/Button/Button";

const UsersPage = () => {
    const navigate = useNavigate();

    return (
        <Box className="flex h-full flex-col space-y-6">
            <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
                <CustomTitle mainTitle="Usuarios" description="Gestiona los usuarios y permisos" />

                <Box className="flex items-center justify-end">
                    <Button
                        variant="primary"
                        onClick={() => navigate("/usuarios/nuevo")}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo usuario
                    </Button>
                </Box>
            </Box>

            <Box>
                <UsersContent />
            </Box>
        </Box>
    );
};

export default UsersPage;