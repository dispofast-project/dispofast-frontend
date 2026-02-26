import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom"
import CustomTitle from "../../../shared/components/Title/Title";
import UsersContent from "../components/UsersContent/UsersContent";
import { Button } from "../../../shared/components/Button/Button";
import { Plus } from "lucide-react";


const UsersPage = () => {
    
    const breadcrumbs = [{label: 'Usuarios'}]
    const navigate = useNavigate();

    return (
        <Box className="flex h-full flex-col space-y-6">
            <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
                <CustomTitle breadcrumbs={breadcrumbs} />
                <Box className="flex items-center justify-end">
                    <Button
                        variant="primary"
                        onClick={() => {navigate("/usuarios/crear")}}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear usuario
                    </Button>
                </Box>
            </Box>

            <Box>
                <UsersContent />
            </Box>
        </Box>
    )
}

export default UsersPage;