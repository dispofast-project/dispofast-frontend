import { useNavigate } from "react-router-dom"
import type { LoginFormData } from "../types";
import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm/LoginForm";

const LoginPage = () => {

    const navigate = useNavigate();
    
    const handleSubmit = async (data: LoginFormData) => {
        // Aquí iría la lógica de autenticación, por ejemplo, una llamada a una API.
        // Por simplicidad, vamos a simular un inicio de sesión exitoso con un timeout.
        setTimeout(() => {
            // Simulamos que el inicio de sesión fue exitoso y redirigimos al usuario a la página principal.
            navigate("/");
        }, 1000);
    }

    return (
        <Box component="div" className="min-h-screen bg-gray-100 flex items-center w-full">
            <Box className="w-full max-w-sm px-8 sm:px-12 lg:px-20">
                <LoginForm onSubmit={handleSubmit} />
            </Box>
        </Box>
    )
}

export default LoginPage;