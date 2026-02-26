import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom"
import CustomTitle from "../../../shared/components/Title/Title";
import UsersContent from "../components/UsersContent/UsersContent";
import { Button } from "../../../shared/components/Button/Button";


const UsersPage = () => {
    
    const breadcrumbs = [{label: 'Usuarios'}]
    const navigate = useNavigate();

    return (
        <Box className="flex h-full flex-col space-y-6 gap-4">
            <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
                <CustomTitle breadcrumbs={breadcrumbs} />
                <Box>
                    <Button
                        variant="primary"
                        onClick={() => {navigate("/usuarios/crear")}}
                    >
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