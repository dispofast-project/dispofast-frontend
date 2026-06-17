import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomTitle from "../../../shared/components/Title/Title";
import { Button } from "../../../shared/components/Button/Button";
import CreateUserForm from "../components/CreateUserForm/CreateUserForm";

const RegisterUserPage = () => {
    const navigate = useNavigate();

    return (
        <Box className="flex h-full flex-col space-y-6 max-w-4xl">
            <Box className="flex items-center gap-3 flex-shrink-0">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/usuarios")}
                    className="!p-2 min-w-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <CustomTitle
                    mainTitle="Nuevo usuario"
                    description="Completa la información para crear un nuevo usuario"
                />
            </Box>

            <Box className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
                <CreateUserForm
                    onSuccess={() => navigate("/usuarios")}
                    onCancel={() => navigate("/usuarios")}
                />
            </Box>
        </Box>
    );
};

export default RegisterUserPage;
