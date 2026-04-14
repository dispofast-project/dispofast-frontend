import { Box } from "@mui/material";
import CustomTitle from "../../../shared/components/Title/Title";
import UsersContent from "../components/UsersContent/UsersContent";
import { Button } from "../../../shared/components/Button/Button";
import { Plus } from "lucide-react";


const UsersPage = () => {
    
    const breadcrumbs = [{label: 'Usuarios'}]

    return (
        <Box className="flex h-full flex-col space-y-6">
            <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
                <CustomTitle breadcrumbs={breadcrumbs} />
                <Box className="flex items-center justify-end">
                    <Button
                        variant="primary"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Invitar usuario
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